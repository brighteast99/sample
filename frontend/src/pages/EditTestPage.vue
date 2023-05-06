<template>
  <v-container fluid>
    <v-row justify="center">
      <!-- Problem list view -->
      <v-col>
        <header-component title="문제 목록" title-size="2">
          {{ `${problems.length}개의 문제` }}
        </header-component>
        <custom-list
          v-model="problems"
          :orderable="false"
          :display-bullet="false"
          @itemDeleted="deleteProblem"
        >
          <template v-slot:item="slotProps">
            <problem-card :problem="slotProps.value"> </problem-card>
          </template>
        </custom-list>
      </v-col>

      <!-- Create problem form -->
      <v-col cols="6">
        <v-form ref="form" @submit.prevent="createProblem">
          <v-card>
            <v-card-title class="ma-3 mt-5">
              <h2>문제 추가</h2>
            </v-card-title>

            <v-card-text>
              <v-container fluid class="pb-0">
                <!-- Object list view -->
                <v-row class="pb-0">
                  <v-container>
                    <v-row>
                      <v-col v-for="object in objects" :key="object" cols="3">
                        <v-card elevation="1" sc>
                          <object-icon :src="object.imageURL"> </object-icon>
                          <v-card-title
                            style="text-align: center; font-size: 1.2em"
                            class="py-0"
                          >
                            {{ object.name }}
                          </v-card-title>

                          <v-menu
                            :close-on-content-click="false"
                            activator="parent"
                            location="center"
                            open-on-hover
                            open-delay="0"
                            close-delay="0"
                            transition="slide-y-reverse-transition"
                            scrim="true"
                            contained
                          >
                            <v-btn-group rounded="rounded-0">
                              <v-btn
                                :prepend-icon="
                                  full(0) ? 'mdi-exclamation-thick' : 'mdi-plus'
                                "
                                stacked
                                size="x-small"
                                rounded="rounded-s-lg"
                                :color="full(0) ? '' : 'success'"
                                :disabled="full(0)"
                                @click.stop="insertObject(object, 0)"
                              >
                                {{ full(0) ? "최대" : "L" }}
                              </v-btn>
                              <v-btn
                                :prepend-icon="
                                  full(1) ? 'mdi-exclamation-thick' : 'mdi-plus'
                                "
                                stacked
                                size="x-small"
                                rounded="rounded-e-lg"
                                :color="full(0) ? '' : 'success'"
                                :disabled="full(1)"
                                @click.stop="insertObject(object, 1)"
                              >
                                {{ full(1) ? "최대" : "R" }}
                              </v-btn>
                            </v-btn-group>
                          </v-menu>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-row class="mb-3">
                      <v-divider></v-divider>
                    </v-row>

                    <!-- Selected object list -->
                    <v-row>
                      <v-input
                        v-model="groups"
                        :validation-value="groups"
                        :rules="groupRules"
                      >
                        <v-col
                          v-for="(group, i) in groups"
                          :key="group"
                          class="mx-2"
                        >
                          <custom-list
                            v-model="groups[i]"
                            :orderable="false"
                            @itemDeleted="form.validate()"
                          >
                            <template v-slot:item="slotProps">
                              <v-list-item-title>
                                {{ slotProps.value.name }}
                              </v-list-item-title>
                            </template>
                          </custom-list>
                        </v-col>
                      </v-input>
                    </v-row>

                    <!-- correct Answer -->
                    <v-row justify="center" class="mb-3">
                      <v-input
                        v-model="correctAnswer"
                        :validation-value="correctAnswer"
                        :rules="correctAnswerRules"
                      >
                        <v-btn-toggle
                          v-model="correctAnswer"
                          variant="outlined"
                          divided
                          mandatory
                          density="compact"
                          color="success"
                          style="width: 100%"
                          @update:model-value="form.validate()"
                        >
                          <v-btn size="x-large" style="width: 50%">
                            Left
                          </v-btn>
                          <v-btn size="x-large" style="width: 50%">
                            Right
                          </v-btn>
                        </v-btn-toggle>
                      </v-input>
                    </v-row>
                  </v-container>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" variant="tonal" color="primary">
                추가
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import ProblemCard from "@/components/ProblemCard.vue";
import ObjectIcon from "@/components/ObjectIcon.vue";

import { ref, onMounted } from "vue";
import problemDataService from "../services/ProblemDataServices";
import ObjectDataService from "@/services/ObjectDataServices";
import CustomList from "@/components/CustomList.vue";
import { problemAnswer as pAnswer } from "@/modules/enums";

// Components
let form = ref(null);

// Data
const LIMIT = 6;
const groupRules = [
  true,
  (v) =>
    (v[0].length > 0 && v[1].length > 0) ||
    "양쪽에 하나 이상의 오브젝트가 필요합니다!",
];
const correctAnswerRules = [
  true,
  (v) => v != null || "정답을 선택해야 합니다!",
];
let problems = ref([]);
let objects = ref([]);
let correctAnswer = ref(null);
let groups = ref([[], []]);

// Hook
onMounted(() => {
  problemDataService.getAll().then((response) => {
    problems.value.push(...response.data);
  });

  ObjectDataService.getAll().then((response) => {
    objects.value.push(...response.data);
    objects.value.sort((a, b) => a.name > b.name);
  });
});

// Methods
const insertObject = (object, to) => {
  if (full(to)) return;

  groups.value[to].push(object);
  form.value.validate();
};

const createProblem = async () => {
  await form.value.resetValidation();
  const valid = (await form.value.validate()).valid;
  if (!valid) return;

  let newProblem = {
    firstGroup: groups.value[0].map((item) => item.name),
    secondGroup: groups.value[1].map((item) => item.name),
    correctAnswer: correctAnswer.value == 0 ? pAnswer.left : pAnswer.right,
  };

  problemDataService
    .create(newProblem)
    .then((response) => {
      newProblem._id = response.data._id;
      problems.value.push(newProblem);

      correctAnswer.value = null;
      groups.value[0].splice(0, groups.value[0].length);
      groups.value[1].splice(0, groups.value[1].length);
      form.value.resetValidation();
    })
    .catch((err) => console.log(err));
};

const deleteProblem = (problem) => {
  problemDataService.delete(problem._id);
};

const full = (group) => {
  return groups.value[group].length == LIMIT;
};
</script>
