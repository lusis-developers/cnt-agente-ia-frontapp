<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';

const router = useRouter();
const themeStore = useThemeStore();

const handleLogout = () => {
  localStorage.removeItem('isAuth');
  router.push('/login');
};
</script>

<template>
  <div class="dashboard">
    <header class="app-header">
      <div class="header-left">
        <img src="@/assets/logo-prefectura.png" alt="Logo" class="logo" />
      </div>
      <div class="header-right">
        <button @click="themeStore.toggleTheme" class="theme-btn">
          <span v-if="themeStore.theme === 'dark'">🌞</span>
          <span v-else>🌙</span>
        </button>
        <button @click="handleLogout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </header>
    
    <main class="content">
      <div class="hero">
        <h1>Bienvenido al Agente CNT</h1>
        <p>Plataforma oficial de asistencia virtual de la Corporación Nacional de Telecomunicaciones.</p>
      </div>
    </main>

    <footer class="app-footer">
      <p>CNT EP &copy; 2026</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
  color: var(--text-main);
  transition: all var(--transition-speed);
}

.app-header {
  padding: 1rem 2rem;
  background: var(--bg-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color var(--transition-speed), border-color var(--transition-speed);

  .logo {
    height: 45px;
  }

  .header-right {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .theme-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--accent);
    }
  }

  .logout-btn {
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--accent);
    padding: 0.6rem 1.25rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;

    &:hover {
      background: var(--accent);
      color: white;
    }
  }
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .hero {
    text-align: center;
    max-width: 600px;

    h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      color: var(--accent);
      font-weight: 800;
      letter-spacing: -0.05em;
    }

    p {
      color: var(--text-sec);
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.6;
    }
  }
}

.app-footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: var(--bg-card);
  transition: background-color var(--transition-speed), border-color var(--transition-speed);

  p {
    color: var(--text-sec);
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}

[data-theme="light"] {

  .app-header,
  .app-footer {
    border-color: #e2e8f0;
  }

  .theme-btn {
    background: #f1f5f9;
    border-color: #e2e8f0;
  }
}
</style>
