<template>
  <v-row justify="center">
    <v-dialog :persistent="props.persistent" v-model="modelValue" width="50%">
      <v-card>
        <v-card-title>
          <h3 class="pt-2" style="white-space: pre">{{ props.title }}</h3>
        </v-card-title>
        <v-card-text>
          <span style="white-space: pre-line">{{ props.text }}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <slot></slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watchEffect } from "vue";

// Data
let modelValue = ref(null);

// Props & Emits
const props = defineProps({
  persistent: Boolean,
  title: String,
  text: String,
  modelValue: { Type: Boolean, default: false },
});
const emits = defineEmits(["update:modelValue"]);

// Hooks
onMounted(() => {
  modelValue.value = props.modelValue;
});

// Watches
watchEffect(() => {
  emits("update:modelValue", modelValue);
});

watchEffect(() => {
  modelValue.value = props.modelValue;
});
</script>
