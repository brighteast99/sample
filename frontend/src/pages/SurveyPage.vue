<template>
  <v-container fluid>
    <!-- Survey form -->
    <v-row class="pa-3" justify="center">
      <v-card style="width: 80%">
        <v-form ref="form" @submit.prevent="submitResponse">
          <v-card-text>
            <v-list v-if="questions.length > 0">
              <v-list-item v-for="question in questions" :key="question">
                <v-input :validation-value="answers[question._id]">
                  <question-card
                    v-model="answers[question._id]"
                    :question="question"
                    :elevation="0"
                    style="width: 100%"
                  ></question-card>
                </v-input>
              </v-list-item>
            </v-list>
          </v-card-text>

          <!-- Actions -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn to="/" variant="plain" width="5rem" :ripple="false">
              돌아가기
            </v-btn>
            <v-btn type="submit" variant="tonal" color="primary" width="5rem">
              제출
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-row>
  </v-container>

  <!-- Alert -->
  <alert-modal
    v-if="error || dialog"
    v-model="dialog"
    persistent
    :title="alertTitle"
    :text="alertText"
  >
    <v-btn v-if="error" to="/" variant="plain" :ripple="false">
      돌아가기
    </v-btn>
    <v-btn to="/test" variant="tonal" color="primary"> 문제 풀기 </v-btn>
  </alert-modal>
</template>

<script setup>
import QuestionCard from "@/components/QuestionCard.vue";
import AlertModal from "@/components/AlertModal.vue";

import { ref, computed, onMounted } from "vue";
import VueCookies from "vue-cookies";
import QuestionDataService from "@/services/QuestionDataServices";
import ResponseDataService from "@/services/ResponseDataServices";
import { responseTypes as rTypes, cookieData } from "@/modules/enums";

// Components
let form = ref(null);

// Data
let questions = ref([]);
let answers = {};
let dialog = ref(false);
let error = ref(false);

// Computed
let alertTitle = computed(() =>
  error.value ? "이미 응답한 설문입니다!" : "응답이 제출되었습니다."
);
let alertText = computed(
  () =>
    (error.value ? "이미 설문을 완료하셨습니다.\n" : "") +
    "문제 풀기로 넘어갈 수 있습니다."
);

// Hook
onMounted(() => {
  // Check responded
  ResponseDataService.responded(VueCookies.get(cookieData.uuid)).then(
    (response) => {
      error.value = response;
      dialog.value = response;
    }
  );

  // Get survey questions
  QuestionDataService.getAll()
    .then((response) => {
      questions.value = response.data;
      for (const question of questions.value) answers[question._id] = "";
    })
    .catch((e) => {
      console.log(e);
    });
});

// Methods
const submitResponse = async () => {
  await form.value.resetValidation();
  const valid = (await form.value.validate()).valid;
  if (!valid) return;

  let response = {
    uuid: VueCookies.get(cookieData.uuid),
    responseTo: rTypes.Survey,
    answers: (() => {
      let result = [];
      for (const key in answers)
        result.push({ answerTo: key, answer: answers[key] });
      return result;
    })(),
  };

  ResponseDataService.create(response).then(() => {
    dialog.value = true;
  });
};
</script>
