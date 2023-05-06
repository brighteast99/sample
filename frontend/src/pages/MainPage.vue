<template>
  <v-container fluid>
    <!-- Admin menus -->
    <header-component title="관리자 메뉴" title-size="2"></header-component>
    <v-row>
      <v-btn variant="plain" :ripple="false" to="/survey/edit">
        설문 문항 관리
      </v-btn>
    </v-row>
    <v-row>
      <v-btn variant="plain" :ripple="false" to="/test/edit"> 문제 관리 </v-btn>
    </v-row>
    <v-row>
      <v-btn variant="plain" :ripple="false" to="/objects/edit">
        오브젝트 관리
      </v-btn>
    </v-row>
    <v-row>
      <v-btn variant="plain" :ripple="false" to="/responses"> 응답 확인 </v-btn>
    </v-row>
  </v-container>

  <v-container fluid>
    <!-- User menus -->
    <header-component title="이용자 메뉴" title-size="2"></header-component>
    <v-row>
      <v-btn variant="plain" :ripple="false" to="/survey">설문 시작</v-btn>
    </v-row>
    <v-row>
      <v-btn variant="plain" :ripple="false" to="/test">문제 풀기</v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
</script>
