<template>
  <v-container fluid>
    <v-row>
      <!-- Question list -->
      <v-col>
        <!-- Section header -->
        <header-component title="문항 목록" title-size="2">
          {{ `${questions.length}개의 문항` }}
        </header-component>
        <custom-list
          v-model="questions"
          :displayBullet="false"
          @itemDeleted="deleteQuestion"
          @update:modelValue="questionUpdated"
        >
          <template v-slot:item="slotProps">
            <question-card
              class="ma-1"
              :question="slotProps.value"
              :disabled="true"
            ></question-card>
          </template>
        </custom-list>
      </v-col>

      <!-- Add question form -->
      <v-col cols="4">
        <question-form
          :nextOrder="questions.length"
          @questionCreated="retrieveQuestions()"
        ></question-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import QuestionForm from "@/components/QuestionForm.vue";
import CustomList from "@/components/CustomList.vue";
import QuestionCard from "@/components/QuestionCard.vue";

import { ref, onMounted } from "vue";
import QuestionDataService from "@/services/QuestionDataServices";

// Data
let questions = ref([]);

// Hooks
onMounted(() => retrieveQuestions());

// Methods
const retrieveQuestions = () => {
  QuestionDataService.getAll()
    .then((response) => {
      questions.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
};

const questionUpdated = () => {
  let order = 0;
  for (let question of questions.value) {
    const orderUpdated = order != question.order;
    question.order = order++;

    if (orderUpdated)
      QuestionDataService.update(question._id, question).catch((err) =>
        console.error(err)
      );
  }
};

const deleteQuestion = (deletedItem) => {
  QuestionDataService.delete(deletedItem._id).catch((err) =>
    console.error(err)
  );
};
</script>
