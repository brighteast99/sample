<template>
  <header-component
    :title="`응답 상세 (UUID: ${props.uuid})`"
    title-size="2"
  ></header-component>

  <v-container fluid>
    <v-row class="pa-3" justify="center">
      <!-- Survey response -->
      <v-col>
        <header-component
          class="mr-3"
          title="설문"
          title-size="3"
        ></header-component>

        <v-alert
          v-if="sDeleted > 0"
          class="mb-6 mx-3"
          type="warning"
          variant="tonal"
          density="compact"
          closable
          title="문항이 일부만 표시됨"
          :text="`${sDeleted}개의 응답에 대해서는 대응하는 문항을 찾을 수 없었습니다. 응답 후에 문항이 삭제되었을 수 있습니다.`"
        ></v-alert>

        <v-card class="mx-3" :elevation="sAnswers.length > 0 ? 1 : 0">
          <v-card-text>
            <v-list v-if="sAnswers.length > 0">
              <v-list-item v-for="sAnswer in sAnswers" :key="sAnswer">
                <question-card
                  :modelValue="sAnswer.answer"
                  :question="sAnswer.answerTo"
                  :elevation="0"
                  :disabled="true"
                  :showTitle="false"
                ></question-card>
              </v-list-item>
            </v-list>

            <v-row v-else justify="center">
              <v-btn
                disabled
                stacked
                prepend-icon="mdi-close-circle-outline"
                variant="plain"
                color="error"
              >
                응답을 찾을 수 없습니다.
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Test Response -->
      <v-col cols="4">
        <header-component class="mr-3" title="문제" title-size="3">
          <span v-if="tAnswers.length > 0">
            {{
              `정답률 ${Math.round(
                (correct / tAnswers.length) * 100
              )}% (${correct} / ${tAnswers.length})`
            }}
          </span>
        </header-component>

        <v-alert
          v-if="tDeleted > 0"
          type="warning"
          variant="tonal"
          density="compact"
          closable
          title="답안이 일부만 표시됨"
          :text="`${tDeleted}개의 답안에 대해서는 대응하는 문제를 찾을 수 없었습니다. 응답 후에 문제가 삭제되었을 수 있습니다.`"
        ></v-alert>

        <v-list v-if="tAnswers.length > 0">
          <v-list-item v-for="tAnswer in tAnswers" :key="tAnswer" class="px-0">
            <problem-card
              :problem="tAnswer.answerTo"
              :answer="tAnswer.answer"
            ></problem-card>
          </v-list-item>
        </v-list>

        <v-card v-else elevation="0">
          <v-card-text>
            <v-row justify="center">
              <v-btn
                disabled
                stacked
                prepend-icon="mdi-close-circle-outline"
                variant="plain"
                color="error"
              >
                사용자가 아직 문제를 풀지 않았습니다.
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import QuestionCard from "@/components/QuestionCard.vue";

import { reactive, ref, computed, defineProps, onMounted } from "vue";
import ResponseDataServices from "@/services/ResponseDataServices";
import { responseTypes as rTypes } from "@/modules/enums";
import HeaderComponent from "@/components/HeaderComponent.vue";
import ProblemCard from "@/components/ProblemCard.vue";
import QuestionDataServices from "@/services/QuestionDataServices";
import ProblemDataServices from "@/services/ProblemDataServices";

// Data
let sAnswers = reactive([]);
let tAnswers = reactive([]);
let sDeleted = ref(0);
let tDeleted = ref(0);

// Computed
let correct = computed(() => {
  let count = 0;
  for (const tAnswer of tAnswers)
    if (tAnswer.answer == tAnswer.answerTo?.correctAnswer) count += 1;

  return count;
});

// Props
const props = defineProps({
  uuid: String,
});

// Hook
onMounted(() => {
  ResponseDataServices.getByUUID(props.uuid)
    .then(async (response) => {
      let sAnswersTemp = [];
      let tAnswersTemp = [];
      for (const res of response.data)
        (res.responseTo == rTypes.Survey ? sAnswersTemp : tAnswersTemp).push(
          ...res.answers
        );

      for (let sAnswer of sAnswersTemp)
        await QuestionDataServices.get(sAnswer.answerTo)
          .then((response) => {
            if (response.data.length > 0) sAnswer.answerTo = response.data[0];
            else sDeleted.value += 1;
          })
          .catch((err) => console.log(err));

      for (let tAnswer of tAnswersTemp)
        await ProblemDataServices.get(tAnswer.answerTo)
          .then((response) => {
            if (response.data.length > 0) tAnswer.answerTo = response.data[0];
            else tDeleted.value += 1;
          })
          .catch((err) => console.log(err));

      sAnswers.push(...sAnswersTemp);
      tAnswers.push(...tAnswersTemp);

      console.log();
    })
    .then(() => {
      sAnswers.splice(
        0,
        sAnswers.length,
        ...sAnswers.filter((item) => typeof item.answerTo == "object")
      );

      tAnswers.splice(
        0,
        tAnswers.length,
        ...tAnswers.filter((item) => typeof item.answerTo == "object")
      );
    })
    .catch((err) => console.log(err));
});
</script>
