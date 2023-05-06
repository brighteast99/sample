import { createWebHistory, createRouter } from "vue-router";
import ErrorPage from "@/pages/ErrorPage";

const routes = [
  {
    path: "/",
    name: "Main",
    component: () => import("@/pages/MainPage"),
  },
  {
    path: "/survey",
    name: "Survey",
    component: () => import("@/pages/SurveyPage"),
  },
  {
    path: "/survey/edit",
    name: "EditSurvey",
    component: () => import("@/pages/EditSurveyPage"),
  },
  {
    path: "/test/",
    name: "Test",
    component: () => import("@/pages/TestPage"),
  },
  {
    path: "/test/edit",
    name: "EditTest",
    component: () => import("@/pages/EditTestPage"),
  },
  {
    path: "/objects/edit",
    name: "EditObjects",
    component: () => import("@/pages/EditObjectsPage"),
  },
  {
    path: "/responses",
    name: "Responses",
    component: () => import("@/pages/ResponseListPage"),
  },
  {
    path: "/responses/detail/:uuid",
    name: "ResponseDetail",
    component: () => import("@/pages/ResponseDetailPage"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)",
    name: "Not-Found",
    component: ErrorPage,
  },
];

const router = createRouter({
  mode: "history",
  history: createWebHistory(),
  routes: routes,
});

export default router;
