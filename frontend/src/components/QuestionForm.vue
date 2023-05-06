<template>
  <v-card>
    <v-form ref="form" @submit.prevent="createQuestion">
      <v-card-title class="ma-3 mt-5">
        <h3>문항 추가</h3>
      </v-card-title>
      <v-card-text class="ma-3 mb-0 pb-0">
        <v-text-field
          label="질문 내용"
          variant="underlined"
          clearable
          v-model="title"
          :rules="titleRules"
          @update:focused="if (!event) title = title.trim();"
        ></v-text-field>
        <v-select
          label="질문 유형"
          variant="underlined"
          v-model="selectedType"
          :items="questionTypes"
          item-title="display"
          item-value="value"
        >
        </v-select>
        <div v-show="selectedType == qTypes.MultipleChoice">
          <v-form
            ref="optionForm"
            @submit.prevent="addOption"
            style="width: 100%"
          >
            <v-text-field
              label="선택지 입력"
              variant="underlined"
              v-model="option"
              :rules="optionNameRules"
              clearable
              @update:focused="if (!event) option = option?.trim();"
            >
              <template v-slot:append>
                <v-btn
                  type="submit"
                  variant="plain"
                  icon="mdi-plus"
                  rounded="lg"
                  elevation="0"
                  size="sm"
                ></v-btn>
              </template>
            </v-text-field>
          </v-form>
          <v-input
            v-model="options"
            :validation-value="options"
            :rules="optionRules"
          >
            <CustomList v-model="options">
              <template v-slot:item="slotProps">
                <v-list-item-title>{{ slotProps.value }}</v-list-item-title>
              </template>
            </CustomList>
          </v-input>
        </div>
      </v-card-text>
      <v-card-actions class="pa-3 pt-0">
        <v-spacer></v-spacer>
        <v-btn type="submit" variant="tonal" color="primary"> 추가 </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import CustomList from "./CustomList.vue";
import QuestionDataService from "@/services/QuestionDataServices";
import { questionTypes as qTypes } from "@/modules/enums";

// Components
let form = ref(null);
let optionForm = ref(null);

// Data
const questionTypes = [
  { display: "객관식", value: qTypes.MultipleChoice },
  { display: "서술형", value: qTypes.Descriptive },
  { display: "리커트 척도", value: qTypes.LikertScale },
];
const titleRules = [
  true,
  (v) => (v != null && v.trim().length > 0) || "내용이 필요합니다!",
];
const optionRules = [
  true,
  (v) =>
    selectedType.value != qTypes.MultipleChoice ||
    v.length > 1 ||
    "선택지가 둘 이상 필요합니다!",
];
const optionNameRules = [
  true,
  (v) => v?.trim()?.length > 0 || "내용이 필요합니다!",
  (v) => !options.value.includes(v) || "이미 존재하는 선택지입니다!",
];
let title = ref("");
let selectedType = ref(questionTypes[0].value);
let option = ref("");
let options = ref([]);

// Props & Emits
const props = defineProps({
  nextOrder: Number,
});
const emits = defineEmits(["questionCreated"]);

// Methods
const addOption = async () => {
  await optionForm.value.resetValidation();
  const valid = (await optionForm.value.validate()).valid;
  if (!valid) return;

  options.value.push(option.value);
  optionForm.value.reset();
  form.value.validate();
};

const createQuestion = async () => {
  await form.value.resetValidation();
  await optionForm.value.resetValidation();
  const valid = (await form.value.validate()).valid;
  if (!valid) return;

  const data = {
    order: props.nextOrder,
    title: title.value,
    type: selectedType.value,
  };
  if (selectedType.value == qTypes.MultipleChoice) data.option = options.value;

  QuestionDataService.create(data)
    .then(() => emits("questionCreated", data))
    .catch((e) => {
      console.log(e.message);
    });

  await optionForm.value.reset();
  options.value = [];
  form.value.reset();
  selectedType.value = questionTypes[0].value;
  form.value.resetValidation();
};
</script>
