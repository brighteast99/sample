<template>
  <v-container fluid>
    <v-row>
      <!-- Object List -->
      <v-col>
        <!-- Section header -->
        <header-component title="오브젝트 목록" title-size="2">
          {{ `${objects.length}개의 오브젝트` }}
        </header-component>
        <v-container>
          <v-row>
            <v-col v-for="(object, i) in objects" :key="object" cols="2">
              <v-card width="90%" elevation="1">
                <object-icon :src="object.imageURL"> </object-icon>
                <v-card-title style="text-align: center" class="py-0">
                  {{ object.name }}
                </v-card-title>

                <v-menu
                  activator="parent"
                  location="center"
                  open-on-hover
                  open-delay="100"
                  close-delay="0"
                  transition="slide-y-reverse-transition"
                  scrim="true"
                  contained
                >
                  <v-btn
                    stacked
                    prepend-icon="mdi-delete"
                    color="error"
                    elevation="0"
                    rounded="lg"
                    @click.stop="deleteObject(i)"
                  >
                    삭제
                  </v-btn>
                </v-menu>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <!-- Add object form -->
      <v-col cols="4">
        <v-form ref="form" @submit.prevent="createObject">
          <v-card width="100%">
            <v-card-title class="mx-3 my-5">
              <h2>오브젝트 추가</h2>
            </v-card-title>
            <v-card-text class="ma-3 mb-0 pb-0">
              <v-text-field
                variant="underlined"
                clearable
                label="이름"
                v-model="name"
                :rules="nameRules"
                @update:focused="if (!event) name = name?.trim();"
              >
              </v-text-field>
              <v-file-input
                variant="underlined"
                clearable
                label="아이콘 (선택)"
                accept="image/png, image/jpg, image/jpeg, image/svg+xml"
                prepend-icon="mdi-image"
                show-size
                v-model="fileInput"
                @update:model-value="updateImageURL"
              >
              </v-file-input>
              <object-icon
                :src="imageURL"
                :default-image="require('@/assets/cloud-upload.svg')"
              >
              </object-icon>
            </v-card-text>
            <v-card-actions class="pa-3 pt-0">
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
import ObjectIcon from "@/components/ObjectIcon.vue";

import { ref, onMounted } from "vue";
import ObjectDataService from "@/services/ObjectDataServices";
import { objectImage } from "@/modules/enums";

// Component
let form = ref(null);

// Data
const nameRules = [
  true,
  (v) => (v != null && v?.trim().length > 0) || "이름이 필요합니다!",
  (v) => unique(v),
];
let objects = ref([]);
let name = ref("");
let imageURL = ref(null);
let fileInput = ref();

// Hooks
onMounted(() => {
  ObjectDataService.getAll()
    .then((response) => {
      objects.value.push(...response.data);
      sortObjects();
    })
    .catch((err) => console.error(err));
});

// Methods
const unique = async (name) => {
  if (await ObjectDataService.exists(name))
    return "같은 이름의 오브젝트가 이미 존재합니다!";
  else return true;
};

const updateImageURL = () => {
  if (!fileInput.value || fileInput.value.length == 0) imageURL.value = null;
  else imageURL.value = window.URL.createObjectURL(fileInput.value[0]);
};

const createObject = async () => {
  await form.value.resetValidation();
  const valid = (await form.value.validate()).valid;
  if (!valid) return;

  const formData = new FormData();
  formData.append("name", name.value);
  if (fileInput.value) formData.append(objectImage, fileInput.value[0]);

  ObjectDataService.create(formData)
    .then((res) => {
      objects.value.push(res.data.objectCreated);
      sortObjects();
      form.value.reset();
    })
    .catch((err) => console.error(err));
};

const deleteObject = (index) => {
  const deletedObject = objects.value.splice(index, 1)[0];
  ObjectDataService.delete(deletedObject._id);
};

const sortObjects = () => {
  objects.value.sort((a, b) => a.name > b.name);
};
</script>
