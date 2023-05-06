<template>
  <v-container fluid>
    <v-row justify="center">
      <span v-show="problems.length > 0">
        {{ (current + 1).toString() + "/" + problems.length }}</span
      >
    </v-row>

    <!-- Problem view -->
    <v-row justify="center" style="height: 500px">
      <problem-view
        :problem="currentProblem"
        :answer="answer"
        :show-description="true"
      ></problem-view>
    </v-row>

    <!-- Select answer -->
    <v-row justify="center">
      <v-item-group
        v-model="selected"
        mandatory
        selected-class="bg-success"
        style="width: 600px"
      >
        <v-item v-slot="{ selectedClass, toggle }">
          <v-btn
            :class="[selectedClass, 'rounded-s-default', 'rounded-e-0']"
            variant="tonal"
            size="x-large"
            width="50%"
            elevation="0"
            @click.stop="toggle"
          >
            선택
          </v-btn></v-item
        >
        <v-item v-slot="{ selectedClass, toggle }">
          <v-btn
            :class="[selectedClass, 'rounded-s-0', 'rounded-e-default']"
            variant="tonal"
            size="x-large"
            width="50%"
            elevation="0"
            @click.stop="toggle"
          >
            선택
          </v-btn></v-item
        >
      </v-item-group>
    </v-row>

    <!-- Next problem -->
    <v-row class="pt-3" justify="center">
      <v-btn
        width="600px"
        :disabled="selected == null"
        :variant="last ? 'tonal' : 'elevated'"
        elevation="1"
        :color="last ? 'primary' : ''"
        @click="nextProblem"
      >
        {{ last ? "제출" : "다음" }}
      </v-btn>
    </v-row>
  </v-container>

  <!-- Alerts -->
  <alert-modal
    v-if="error || dialog"
    persistent
    v-model="dialog"
    :title="alertTitle"
    :text="alertText"
  >
    <v-btn v-if="error" variant="plain" to="/"> 돌아가기 </v-btn>
    <v-btn variant="tonal" color="primary" :to="goto">
      {{ error ? "설문 응답" : "확인" }}
    </v-btn>
  </alert-modal>
</template>

<script setup>
import ProblemView from "@/components/ProblemView.vue";
import AlertModal from "@/components/AlertModal.vue";

import { ref, computed, reactive, onMounted, watch } from "vue";
import VueCookies from "vue-cookies";
import ResponseDataService from "@/services/ResponseDataServices";
import ProblemDataService from "@/services/ProblemDataServices";
import { refresh } from "@/modules/uuidControl";
import {
  cookieData,
  problemAnswer as pAnswer,
  responseTypes as rTypes,
} from "@/modules/enums";

// Data
const COUNT = 10;
let problems = reactive([]);
let current = ref(null);
let currentProblem = reactive({});
let selected = ref();
let answers = [];
let dialog = ref(false);
let error = ref(false);

// Computed
let answer = computed(() => {
  if (selected.value == null) return null;
  return selected.value == 0 ? pAnswer.left : pAnswer.right;
});
let last = computed(() => current.value + 1 == problems.length);
let alertTitle = computed(() =>
  error.value ? "설문에 응답하지 않았습니다!" : "답안이 제출되었습니다!"
);
let alertText = computed(() =>
  error.value
    ? "문제를 풀기 전에 설문에 응답해야 합니다."
    : "메인으로 돌아갑니다."
);
let goto = computed(() => (error.value ? "/survey" : "/"));

// Hook
onMounted(() => {
  // Check responded
  ResponseDataService.responded(VueCookies.get(cookieData.uuid)).then(
    (response) => {
      if (!response) {
        error.value = true;
        dialog.value = true;
      } else
        ProblemDataService.sample(COUNT).then((response) => {
          problems.push(...response.data);
          current.value = 0;
        });
    }
  );
});

// Watch
watch(current, (newValue) => {
  if (problems.length == 0) return;
  currentProblem._id = problems[newValue]._id;
  currentProblem.firstGroup = problems[newValue].firstGroup;
  currentProblem.secondGroup = problems[newValue].secondGroup;
  currentProblem.correctAnswer = problems[newValue].correctAnswer;
});

// Methods
const nextProblem = () => {
  answers.push({ answerTo: currentProblem._id, answer: answer.value });
  selected.value = null;

  if (!last.value) current.value += 1;
  else {
    let newResponse = {
      uuid: VueCookies.get(cookieData.uuid),
      responseTo: rTypes.Test,
      answers: answers.slice(),
    };

    ResponseDataService.create(newResponse).then(() => {
      refresh();
      dialog.value = true;
    });
  }
};
</script>
