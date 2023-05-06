<template>
  <v-container fluid style="width: 80%">
    <v-row>
      <v-col>
        <header-component title="응답 목록" :title-size="2"></header-component>
        <custom-list
          v-model="relatedResponses"
          :orderable="false"
          :display-bullet="false"
          @itemDeleted="deleteResponse"
        >
          <template v-slot:item="slotProps">
            <v-list-item>
              <v-card class="ma-3 pa-3">
                <v-card-title>
                  {{ `응답 (UUID: ${slotProps.value?.uuid})` }}
                </v-card-title>
                <v-card-text>
                  {{
                    `응답 제출: ${formatDate(
                      slotProps.value?.surveyResponse?._id
                    )}`
                  }}
                  <br />
                  {{
                    `답안 제출: ${formatDate(
                      slotProps.value?.testResponse?._id
                    )}`
                  }}
                </v-card-text>

                <v-menu
                  activator="parent"
                  location="center"
                  open-on-hover
                  open-delay="50"
                  close-delay="0"
                  transition="slide-y-reverse-transition"
                  scrim="true"
                  contained
                  @click="showDetail(slotProps.value)"
                >
                  <v-btn
                    icon="mdi-magnify"
                    variant="plain"
                    size="x-large"
                    :ripple="false"
                  ></v-btn>
                </v-menu>
              </v-card>
            </v-list-item>
          </template>
        </custom-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import CustomList from "@/components/CustomList.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

import { ref, reactive, onMounted } from "vue";
import ResponseDataServices from "@/services/ResponseDataServices";
import { responseTypes as rTypes } from "@/modules/enums";
import router from "@/router";

// Data
let responses = reactive([[], []]);
let relatedResponses = ref([]);

// Hook
onMounted(async () => {
  await ResponseDataServices.getAllOf(rTypes.Survey)
    .then((response) => responses[0].push(...response.data))
    .catch((err) => console.log(err));

  await ResponseDataServices.getAllOf(rTypes.Test)
    .then((response) => responses[1].push(...response.data))
    .catch((err) => console.log(err));

  let result = {};

  for (const sres of responses[0])
    if (result[sres.uuid]) result[sres.uuid].surveyResponse = sres;
    else result[sres.uuid] = { uuid: sres.uuid, surveyResponse: sres };

  for (const tres of responses[1])
    if (result[tres.uuid]) result[tres.uuid].testResponse = tres;
    else result[tres.uuid] = { uuid: tres.uuid, testResponse: tres };

  relatedResponses.value.push(...Object.values(result));
});

// Methods
const formatDate = (objectId) => {
  if (!objectId) return "";
  let timestamp = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  const time = timestamp.toTimeString().split(" ")[0];
  timestamp.setHours(timestamp.getHours() + 9);
  const date = timestamp.toISOString().split("T")[0];

  return `${date} ${time}`;
};

const showDetail = (response) => {
  router.push({
    name: "ResponseDetail",
    params: { uuid: response.uuid },
  });
};

const deleteResponse = async (response) => {
  if (response.surveyResponse)
    await ResponseDataServices.delete(response.surveyResponse._id);
  if (response.testResponse)
    await ResponseDataServices.delete(response.testResponse._id);
};
</script>
