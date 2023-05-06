<template>
  <v-row class="mb-5">
    <h1 v-if="titleSize == 1">{{ props.title }}</h1>
    <h2 v-else-if="titleSize == 2">{{ props.title }}</h2>
    <h3 v-else-if="titleSize == 3">{{ props.title }}</h3>
    <h4 v-else-if="titleSize == 4">{{ props.title }}</h4>
    <h5 v-else-if="titleSize == 5">{{ props.title }}</h5>
    <h6 v-else-if="titleSize == 6">{{ props.title }}</h6>
    <v-spacer></v-spacer>
    <slot></slot>
    <v-divider></v-divider>
  </v-row>
</template>

<script setup>
import { computed, defineProps } from "vue";

// Data
let titleSize = computed(() => {
  if (props.titleSize < 1) return 1;
  if (props.titleSize > 6) return 6;
  return props.titleSize;
});

// Props
const props = defineProps({
  title: String,
  titleSize: { Type: Number, default: 1 },
});
</script>
