<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useThemeStore } from '@/stores/theme';
import { useRouter } from 'vue-router';
import MarkdownIt from 'markdown-it';

const chatStore = useChatStore();
const themeStore = useThemeStore();
const router = useRouter();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// Custom renderer for tables to add a wrapper for responsiveness
const defaultRender = md.renderer.rules.table_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
  return '<div class="table-container">' + defaultRender(tokens, idx, options, env, self);
};

const defaultTableClose = md.renderer.rules.table_close || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.table_close = function (tokens, idx, options, env, self) {
  return defaultTableClose(tokens, idx, options, env, self) + '</div>';
};

const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

const handleSend = async () => {
  if (!newMessage.value.trim() || chatStore.isTyping) return;

  const text = newMessage.value;
  newMessage.value = '';
  await chatStore.sendMessage(text);
};

const handleLogout = () => {
  localStorage.removeItem('isAuth');
  router.push('/login');
};

const renderMarkdown = (content: string) => {
  return md.render(content);
};

watch(() => chatStore.messages.length, scrollToBottom);
watch(() => chatStore.isTyping, (val) => { if (val) scrollToBottom(); });

onMounted(() => {
  if (chatStore.messages.length === 0) {
    chatStore.messages.push({
      role: 'assistant',
      content: '¡Hola! Soy el Agente de la Prefectura del Guayas. ¿En qué puedo ayudarte hoy?',
      timestamp: Date.now()
    });
  }
  scrollToBottom();
});
</script>

<template>
  <div class="agent-view" :data-theme="themeStore.theme">
    <!-- Animated Background Pattern -->
    <div class="bg-pattern"></div>

    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo-wrapper">
          <img src="@/assets/logo-prefectura.png" alt="Logo" class="logo" />
        </div>
        <div class="brand-info">
          <h1>Agente IA</h1>
          <div class="status-indicator">
            <span class="dot"></span>
            <span class="status-text">En línea</span>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <button @click="themeStore.toggleTheme" class="icon-btn theme-toggle" :title="themeStore.theme === 'dark' ? 'Modo claro' : 'Modo oscuro'">
          <Transition name="fade-scale" mode="out-in">
            <span v-if="themeStore.theme === 'dark'" key="sun">🌞</span>
            <span v-else key="moon">🌙</span>
          </Transition>
        </button>
        
        <button @click="handleLogout" class="logout-btn">
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>

    <!-- Main Chat Area -->
    <main class="chat-wrapper">
      <div class="messages-container" ref="messagesContainer">
        <TransitionGroup name="message-list">
          <div 
            v-for="(msg, index) in chatStore.messages" 
            :key="msg.timestamp + index"
            :class="['message-bubble', msg.role]"
          >
            <div class="avatar" v-if="msg.role === 'assistant'">
              <img src="@/assets/logo-prefectura.png" alt="AI" />
            </div>
            
            <div class="content-wrapper">
              <div class="message-content markdown-body" v-html="renderMarkdown(msg.content)"></div>
              <div class="message-meta">
                <span class="time">{{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                <span v-if="msg.provider" class="provider-tag">{{ msg.provider }}</span>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <Transition name="fade">
          <div v-if="chatStore.isTyping" class="message-bubble assistant typing">
            <div class="avatar">
              <img src="@/assets/logo-prefectura.png" alt="AI" />
            </div>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Input Bar -->
      <footer class="input-area">
        <div class="input-container">
          <form @submit.prevent="handleSend" class="input-form">
            <textarea 
              v-model="newMessage"
              placeholder="¿En qué puedo ayudarte hoy?"
              :disabled="chatStore.isTyping"
              @keydown.enter.prevent="handleSend"
              rows="1"
              ref="inputField"
            ></textarea>
            <button type="submit" :disabled="!newMessage.trim() || chatStore.isTyping" class="send-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </form>
          <p class="disclaimer">Asistente Oficial de la Prefectura del Guayas • Información Institucional</p>
        </div>
      </footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
// Premium Theme Variables (Local overrides for extra polish)
.agent-view {
  --primary-gradient: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --glass-bg: rgba(26, 36, 33, 0.85);
  --glass-border: rgba(255, 255, 255, 0.08);
  --shadow-premium: 0 10px 40px -10px rgba(0, 0, 0, 0.3);

  &[data-theme="light"] {
    --glass-bg: rgba(255, 255, 255, 0.9);
    --glass-border: rgba(0, 0, 0, 0.05);
    --shadow-premium: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
  }

  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
  transition: all var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image:
    radial-gradient(var(--accent) 0.5px, transparent 0.5px),
    radial-gradient(var(--accent) 0.5px, var(--bg-main) 0.5px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  z-index: 1;
}

.app-header {
  padding: 1rem 2rem;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10;

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;

    .logo-wrapper {
      background: white;
      padding: 6px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;

      .logo {
        height: 32px;
        width: auto;
      }
    }

    .brand-info {
      h1 {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--text-main);
        margin: 0;
        letter-spacing: -0.02em;
      }

      .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 2px;

        .dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
        }

        .status-text {
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

.icon-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &.theme-toggle {
    overflow: hidden;
  }
}

.logout-btn {
  background: transparent;
  border: 2px solid var(--accent);
  color: var(--accent);
  padding: 0.5rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: var(--accent);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    transition: width 0.4s ease, height 0.4s ease;
    z-index: -1;
  }

  &:hover {
    color: white;

    &::before {
      width: 300%;
      height: 300%;
    }
  }
}

.chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
}

.message-bubble {
  display: flex;
  gap: 1.25rem;
  max-width: 85%;
  position: relative;

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;

    .message-content {
      background: var(--primary-gradient);
      color: white;
      border-radius: 20px 20px 4px 20px;
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.25);
    }

    .message-meta {
      justify-content: flex-end;
    }
  }

  &.assistant {
    align-self: flex-start;

    .message-content {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      color: var(--text-main);
      border-radius: 20px 20px 20px 4px;
      border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-premium);
    }
  }

  .avatar {
    width: 42px;
    height: 42px;
    background: white;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);

    img {
      width: 28px;
      height: auto;
    }
  }

  .content-wrapper {
    flex: 1;
  }

  .message-content {
    padding: 1.2rem 1.5rem;
    font-size: 1rem;
    line-height: 1.6;
    word-break: break-word;
  }

  .message-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.6rem;
    font-size: 0.75rem;
    color: var(--text-sec);
    padding: 0 0.5rem;

    .provider-tag {
      text-transform: uppercase;
      background: rgba(37, 99, 235, 0.1);
      color: var(--accent);
      padding: 0.15rem 0.6rem;
      border-radius: 6px;
      font-weight: 800;
      font-size: 0.65rem;
      letter-spacing: 0.05em;
    }
  }
}

.markdown-body {
  :deep(p) {
    margin-bottom: 0.85rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(strong) {
    font-weight: 700;
    color: var(--accent);
  }

  :deep(.table-container) {
    overflow-x: auto;
    margin: 1.25rem 0;
    border-radius: 14px;
    border: 1px solid var(--glass-border);
    background: rgba(0, 0, 0, 0.1);
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th,
    td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--glass-border);
    }

    th {
      background: rgba(255, 255, 255, 0.03);
      font-weight: 800;
      color: var(--text-sec);
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.08em;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.01);
    }
  }

  :deep(ul, ol) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;

    li {
      margin-bottom: 0.5rem;
    }
  }

  :deep(code) {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
    color: #fca5a5;
  }
}

.typing-indicator {
  display: flex;
  gap: 6px;
  padding: 1.2rem 1.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border-radius: 20px 20px 20px 4px;
  border: 1px solid var(--glass-border);

  span {
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
    opacity: 0.6;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

.input-area {
  padding: 1.5rem 2rem 2.5rem;
  background: linear-gradient(to top, var(--bg-main) 70%, transparent);

  .input-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .input-form {
    background: var(--glass-bg);
    backdrop-filter: blur(15px);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    display: flex;
    align-items: flex-end;
    padding: 0.75rem;
    box-shadow: var(--shadow-premium);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus-within {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: 0 20px 60px -15px rgba(37, 99, 235, 0.2);
    }

    textarea {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-main);
      padding: 0.8rem 1rem;
      font-size: 1.05rem;
      outline: none;
      resize: none;
      max-height: 150px;
      line-height: 1.5;
      font-family: inherit;

      &::placeholder {
        color: var(--text-sec);
        opacity: 0.6;
      }
    }

    .send-btn {
      width: 52px;
      height: 52px;
      background: var(--primary-gradient);
      border: none;
      border-radius: 18px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      flex-shrink: 0;

      &:hover:not(:disabled) {
        transform: scale(1.1) rotate(-5deg);
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
      }

      &:disabled {
        opacity: 0.4;
        filter: grayscale(1);
        cursor: not-allowed;
      }

      svg {
        width: 24px;
        height: 24px;
      }
    }
  }

  .disclaimer {
    font-size: 0.7rem;
    color: var(--text-sec);
    text-align: center;
    margin-top: 1.25rem;
    opacity: 0.7;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
}

// Animations
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0.3);
  }

  40% {
    transform: scale(1.0);
  }
}

.message-list-enter-active,
.message-list-move {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.message-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(-45deg);
}

// Responsive
@media (max-width: 768px) {
  .app-header {
    padding: 0.75rem 1.25rem;
  }

  .messages-container {
    padding: 1.5rem 1rem;
  }

  .message-bubble {
    max-width: 92%;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .input-area {
    padding: 1rem 1rem 2rem;
  }

  .logout-btn span {
    display: none;
  }

  .logout-btn::after {
    content: '🚪';
  }

  .logout-btn {
    padding: 0.5rem 0.7rem;
  }
}

[data-theme="light"] {
  .logo-wrapper {
    background: #f1f5f9;
  }

  .markdown-body :deep(code) {
    background: #fee2e2;
    color: #b91c1c;
  }
}
</style>
