<template>
  <v-row class="my-1" justify="center">
    <v-sheet :height="props.height" :width="props.height" rounded>
      <v-img
        ref="icon"
        :height="props.height"
        aspect-ratio="1/1"
        :src="source"
        @load="error = false"
        @error="error = true"
      >
      </v-img>
    </v-sheet>
  </v-row>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";

// Component
let icon = ref(null);

// Data
let error = ref(false);

// Computed
let source = computed(() =>
  !error.value && props.src != null ? props.src : props.defaultImage
);

const props = defineProps({
  height: { Type: Number, default: 100 },
  src: String,
  defaultImage: { Type: Object, default: require("@/assets/help.svg") },
});
</script>
