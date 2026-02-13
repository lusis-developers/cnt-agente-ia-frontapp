import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Iniciar Sesión | Agente IA' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/AgentChatView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Asistente Virtual | CNT Ecuador'
      }
    },
    {
      path: '/',
      redirect: '/login'
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuth') === 'true';

  // SEO: Update page title
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router
