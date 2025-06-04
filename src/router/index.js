import { api } from "@/libs/api";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MemoView from "../views/MemoView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AboutView from "../views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/memo",
      name: "memo",
      component: MemoView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
  ],
});

// Laravelのトークン認証を使ってログイン状態を判定
const isAuthenticated = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const res = await api.get("/api/user");

    return Boolean(res.data);
  } catch (error) {
    return false;
  }
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await isAuthenticated()) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
