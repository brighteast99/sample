<template>
  <v-img
    :width="props.width"
    :height="props.height"
    :src="props.background"
    style="position: absolute; z-index: 1"
  >
  </v-img>
  <canvas
    ref="canvas"
    :width="props.width"
    :height="props.height"
    style="position: absolute; z-index: 2"
  ></canvas>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from "vue";
import ObjectDataServices from "@/services/ObjectDataServices";

// Components
let canvas = ref(null);

// Data
const defaultIcon = require("@/assets/help.svg");
let objectIconURLs = ref({});

// Props
const props = defineProps({
  width: { Type: Number, default: 600 },
  height: { Type: Number, default: 450 },
  background: String,
  groups: {
    Type: [[{ _id: String, name: String, imageURL: String }]],
    default: [[], []],
  },
});

// Hook
onMounted(async () => {
  await ObjectDataServices.getAll()
    .then((response) => {
      for (const object of response.data)
        if (!object.imageURL) continue;
        else objectIconURLs.value[object.name] = object.imageURL;
    })
    .catch((err) => console.log(err));
  drawObjects();
});

// WatchEffect
watch(props.groups, () => {
  drawObjects();
});

const drawObjects = () => {
  let ctx = canvas.value.getContext("2d");

  // Clear canvas
  ctx.clearRect(0, 0, props.width, props.height);

  // Draw object icons
  for (let group = 0; group < 2; group++) {
    let from = props.groups[group];
    for (let i = 0; i < from.length; i++) {
      let posX = group * 300 + 15 + 97.5 * (i % 3);
      let posY = 90 + 100 * Math.floor(i / 3);
      const icon = new Image();
      icon.onload = () => {
        ctx.drawImage(icon, posX, posY, 75, 75);
      };
      icon.src = objectIconURLs.value[from[i]] ?? defaultIcon;
    }
  }
};
</script>
