<template>
  <v-app>
    <v-app-bar>
      <v-btn to="/" icon="mdi-home" variant="plain" :ripple="false"> </v-btn>
      <span>test website</span>
    </v-app-bar>
    <v-main>
      <v-container class="pa-10" fluid justify-center>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";
import { init } from "@/modules/uuidControl";

onMounted(() => init());
</script>
