import { defineStore } from 'pinia';
import { ref } from 'vue';
import { chatService } from '@/services/chatService';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  provider?: string;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([]);
  const isTyping = ref(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    messages.value.push(userMsg);

    isTyping.value = true;

    try {
      // Map history for backend: { role: 'user' | 'assistant', content: string }
      const history = messages.value.slice(0, -1).map((m: Message) => ({
        role: m.role,
        content: m.content
      }));

      const response = await chatService.sendMessage(text, history);

      const assistantMsg: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: Date.now(),
        provider: response.provider
      };
      messages.value.push(assistantMsg);
    } catch (error) {
      const errorMsg: Message = {
        role: 'assistant',
        content: `### ⚠️ Lo siento, ha ocurrido un error al procesar tu mensaje.
Por favor, intenta de nuevo en unos momentos.`,
        timestamp: Date.now()
      };
      messages.value.push(errorMsg);
    } finally {
      isTyping.value = false;
    }
  };

  const clearChat = () => {
    messages.value = [];
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat
  };
});
