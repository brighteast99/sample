<template>
  <v-card v-if="props.question != null" rounded :elevation="props.elevation">
    <v-card-title v-show="props.showTitle" class="mt-3">
      <h3>{{ props.question.order + 1 + "번 문항" }}</h3>
    </v-card-title>
    <v-card-text class="pa-3 pl-5">
      <div class="mb-5">
        <span style="font-size: 1.3em">
          {{ props.question.title }}
        </span>
      </div>

      <!-- MultipleChoice형 질문인 경우 -->
      <v-radio-group
        v-if="props.question.type == qTypes.MultipleChoice"
        v-model="selectedOption"
        :rules="required"
        :disabled="props.disabled"
        @vnode-updated="updateMV(selectedOption)"
      >
        <v-radio
          v-for="option in props.question.option"
          :key="option"
          :label="option"
          :value="option"
        >
        </v-radio>
      </v-radio-group>

      <!-- Descriptive형 질문인 경우 -->
      <v-text-field
        ref="descInputField"
        v-if="props.question.type == qTypes.Descriptive"
        label="답변"
        v-model="descriptiveInput"
        :rules="required"
        clearable
        :disabled="props.disabled"
        @vnode-updated="updateMV(descriptiveInput)"
        @update:focused="
          if (!event) descriptiveInput = descriptiveInput?.trim();
        "
      ></v-text-field>

      <!-- Likert Scale형 질문인 경우 -->
      <v-slider
        v-if="props.question.type == qTypes.LikertScale"
        v-model="sliderInput"
        :rules="required"
        step="1"
        min="0"
        max="4"
        track-color="#a0a0a0"
        track-fill-color="#a0a0a0"
        :ticks="tickLabels"
        :tick-size="3"
        show-ticks="always"
        :disabled="props.disabled"
        :thumb-size="sliderClicked ? 20 : 0"
        @vnode-updated="updateMV(sliderInput?.toString())"
        @update:focused="showThumb"
      ></v-slider>
    </v-card-text>
  </v-card>

  <v-card v-else width="100%" :elevation="props.elevation">
    <v-card-text>
      <v-row justify="center">
        <v-btn
          disabled
          stacked
          prepend-icon="mdi-close-circle-outline"
          variant="plain"
          color="error"
        >
          해당 문항을 찾을 수 없습니다. <br />
          문항이 삭제되었을 수 있습니다.
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";
import { questionTypes as qTypes } from "@/modules/enums";

// Components
let descInputField = ref(null);

// Data
const tickLabels = {
  0: "매우 그렇지 않다 ",
  1: "조금 그렇지 않다",
  2: "보통이다",
  3: "조금 그렇다",
  4: "매우 그렇다",
};
const required = [
  true,
  (v) => (v != null && v?.toString().trim()?.length > 0) || "필수 항목입니다",
];
let selectedOption = ref(null);
let descriptiveInput = ref(null);
let sliderInput = ref(null);
let sliderClicked = ref(false);

// Props & Emits
const props = defineProps({
  modelValue: String,
  question: {
    Type: { order: Number, title: String, type: String, option: [String] },
  },
  disabled: { Type: Boolean, default: false },
  elevation: { Type: Number, default: 2 },
  showTitle: { Type: Boolean, default: true },
});
const emits = defineEmits(["update:modelValue"]);

// Hooks
onMounted(() => {
  if (props.disabled) init();
});

watch(props.question, () => init());

//Methods
const init = () => {
  switch (props.question.type) {
    case qTypes.MultipleChoice:
      selectedOption.value = props.modelValue ?? props.question.option[0];
      return;

    case qTypes.Descriptive:
      descriptiveInput.value = props.modelValue ?? "예시 답변입니다.";
      return;

    case qTypes.LikertScale:
      sliderInput.value = parseInt(props.modelValue) ?? 2;
      return;
  }
};

const updateMV = (value) => {
  emits("update:modelValue", value);
};

const showThumb = () => {
  sliderClicked.value = true;
  if (!sliderInput.value) sliderInput.value = 0;
};
</script>
