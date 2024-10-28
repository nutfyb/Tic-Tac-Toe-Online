import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { auth } from "../plugins/firebase"; // Import Firebase auth
import FrontendLayout from "@/core/layout/FrontendLayout.vue";

function lazyLoad(view: string) {
  return () => import(`@/views/frontend/${view}.vue`);
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:locale?",
    name: "Frontend",
    component: FrontendLayout,
    children: [
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: lazyLoad("NotFoundView"),
      },
      {
        path: "",
        name: "Home",
        component: lazyLoad("HomeView"),
        meta: { title: "Tic Tac Toe Online", header: "headline" },
      },
      {
        path: "game",
        name: "Game",
        component: lazyLoad("GameView"),
        meta: {
          title: "Game – Tic Tac Toe Online",
          requiresAuth: true,
          requiresSub: false,
        },
      },
      {
        path: "profile",
        name: "Profile",
        component: lazyLoad("ProfileView"),
        meta: {
          title: "Profile – Tic Tac Toe Online",
          requiresAuth: true,
          requiresSub: false,
        },
      },
      {
        path: "rank",
        name: "Rank",
        component: lazyLoad("RankView"),
        meta: {
          title: "Rank – Tic Tac Toe Online",
          requiresAuth: true,
          requiresSub: false,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Helper function to get current auth state
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

router.beforeEach(async (to, _, next) => {
  if (typeof to.meta.title === "string") {
    document.title = to.meta.title;
  }

  const user = await getCurrentUser();

  if (to.meta.requiresAuth) {
    if (user) {
      next();
    } else {
      next({ name: "Home" });
    }
  } else if (to.name === "Home") {
    if (user) {
      next({ name: "Game" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
