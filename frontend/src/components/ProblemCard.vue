<template>
  <v-card v-if="props.problem != null" class="ma-3" elevation="1">
    <v-btn-group style="width: 100%" class="rounded-0" density="compact">
      <v-btn
        class="rounded-ts-sm"
        disabled
        size="lg"
        :color="selected == pAnswer.left ? color : ''"
        style="width: 50%"
      >
        L
      </v-btn>
      <v-btn
        class="rounded-te-sm"
        disabled
        size="lg"
        :color="selected == pAnswer.right ? color : ''"
        style="width: 50%"
      >
        R
      </v-btn>
    </v-btn-group>
    <v-row>
      <v-col class="ml-3 px-0">
        <v-list density="compact">
          <v-list-item
            class="pa-0"
            v-for="object in props.problem.firstGroup"
            :key="object"
            style="text-align: center"
          >
            {{ object }}
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="mr-3 px-0">
        <v-list density="compact">
          <v-list-item
            class="pa-0"
            v-for="object in props.problem.secondGroup"
            :key="object"
            style="text-align: center"
          >
            {{ object }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else class="ma-3" :elevation="1">
    <v-card-text>
      <v-row justify="center">
        <v-btn
          disabled
          stacked
          prepend-icon="mdi-close-circle-outline"
          variant="plain"
          color="error"
        >
          해당 문제를 찾을 수 없습니다. <br />
          문제가 삭제되었을 수 있습니다.
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { problemAnswer as pAnswer } from "@/modules/enums";

// Data
let selected = computed(() => {
  if (props.answer) return props.answer;
  else return props.problem.correctAnswer;
});
let color = computed(() => {
  if (!props.answer) return "success";
  else return props.answer == props.problem.correctAnswer ? "success" : "error";
});

// Props
const props = defineProps({
  problem: {
    Type: {
      firstGroup: {
        Type: [String],
        default: [],
      },
      secondGroup: {
        Type: [String],
        default: [],
      },
      correctAnswer: String,
    },
  },
  answer: String,
});
</script>
