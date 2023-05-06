<template>
  <v-container fluid style="width: 90%">
    <v-row>
      <v-col cols="3" v-show="props.showDescription">
        <v-list density="compact">
          <v-list-item
            v-for="object in props.problem?.firstGroup"
            :key="object"
            prepend-icon="mdi-circle-small"
          >
            {{ object }}
          </v-list-item>
        </v-list>
      </v-col>

      <v-col>
        <v-row justify="center">
          <problem-canvas
            :background="background"
            :groups="groups"
          ></problem-canvas>
        </v-row>
      </v-col>

      <v-col cols="3" v-show="props.showDescription">
        <v-list density="compact">
          <v-list-item
            v-for="object in props.problem?.secondGroup"
            :key="object"
            append-icon="mdi-circle-small"
            style="text-align: right"
          >
            {{ object }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ProblemCanvas from "./ProblemCanvas.vue";

import { computed, ref, defineProps, watch } from "vue";
import { canvasBackground as cBG, problemAnswer } from "@/modules/enums";

// Data
let groups = ref([[], []]);

// Computed
let background = computed(() => {
  switch (props.answer) {
    case problemAnswer.left:
      return cBG.left;
    case problemAnswer.right:
      return cBG.right;
    default:
      return cBG.default;
  }
});

// Props
const props = defineProps({
  problem: {
    Type: {
      firstGroup: [String],
      secondGroup: [String],
      correctAnswer: String,
    },
    default: { firstGroup: [], secondGroup: [], correctAnswer: "" },
  },
  answer: String,
  showDescription: { Type: Boolean, default: false },
});

// Watch
watch(props.problem, () => {
  groups.value[0].splice(
    0,
    groups.value[0].length,
    ...props.problem.firstGroup
  );
  groups.value[1].splice(
    0,
    groups.value[1].length,
    ...props.problem.secondGroup
  );
});
</script>
