<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';

const router = useRouter();
const themeStore = useThemeStore();

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;

  // Simulando llamada a la API
  setTimeout(() => {
    if (email.value === 'agenteia@cnt.ec' && password.value === '123456789') {
      localStorage.setItem('isAuth', 'true');
      router.push('/dashboard');
    } else {
      error.value = 'Correo electrónico o contraseña incorrectos';
    }
    isLoading.value = false;
  }, 1000);
};
</script>

<template>
  <div class="login-container">
    <button @click="themeStore.toggleTheme" class="theme-toggle">
      <span v-if="themeStore.theme === 'dark'">🌞</span>
      <span v-else>🌙</span>
    </button>

    <div class="login-card">
      <div class="brand">
        <img src="@/assets/logo-prefectura.png" alt="CNT Ecuador" class="logo" />
        <h1>Agente Virtual CNT</h1>
        <div class="demo-badge">Demo para CNT Ecuador</div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email">Correo Corporativo</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="agenteia@cnt.ec"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" :disabled="isLoading" class="login-btn">
          <span v-if="isLoading">Iniciando sesión...</span>
          <span v-else>Ingresar a la Demo</span>
        </button>
      </form>

      <footer class="login-footer">
        <p>Corporación Nacional de Telecomunicaciones</p>
        <p class="copyright">&copy; 2026 CNT EP - Todos los derechos reservados</p>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-main);
  padding: 1.5rem;
  transition: background-color var(--transition-speed);
  position: relative;
}

.theme-toggle {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    border-color: var(--accent);
  }
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: var(--bg-card);
  padding: 3rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color var(--transition-speed), border-color var(--transition-speed);
}

.brand {
  text-align: center;
  margin-bottom: 2.5rem;

  .logo {
    width: 140px;
    height: auto;
    margin-bottom: 1.5rem;
  }

  h1 {
    color: var(--text-main);
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    margin-bottom: 0.5rem;
  }

  .demo-badge {
    display: inline-block;
    background: rgba(37, 99, 235, 0.1);
    color: var(--accent);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid rgba(37, 99, 235, 0.2);
  }
}

.login-form {
  .input-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      color: var(--text-sec);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(var(--text-main), 0.03);
      border: 1px solid rgba(var(--text-main), 0.1);
      border-radius: 12px;
      color: var(--text-main);
      font-size: 1rem;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      }
    }
  }

  .error-msg {
    color: #ef4444;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    text-align: center;
    background: rgba(239, 68, 68, 0.1);
    padding: 0.5rem;
    border-radius: 8px;
  }

  .login-btn {
    width: 100%;
    padding: 0.875rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--accent-dark);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.login-footer {
  margin-top: 3rem;
  text-align: center;

  p {
    color: var(--text-sec);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .copyright {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.5;
  }
}

// Light theme overrides (handled via data-theme in App.vue)
[data-theme="light"] {
  .login-container {
    background-color: #f8fafc;
  }

  .theme-toggle {
    background: white;
    border-color: #e2e8f0;
  }

  .login-card {
    background: white;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    border-color: #e2e8f0;
  }

  .brand h1 {
    color: #1e293b;
  }

  .login-form .input-group input {
    background: #f1f5f9 !important;
    border-color: #e2e8f0 !important;
    color: #1e293b;

    &::placeholder {
      color: #94a3b8;
    }
  }
}
</style>
