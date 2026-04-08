<template>
  <div>
    <AppNavbar />
    <div v-if="isPageLoading" class="flex flex-col h-screen justify-center items-center gap-4">
      <UEmpty size="xl" icon="i-lucide-send" title="Setting Up your AI Environment" class="p-8"
        description="Please give us a few moments to setup and configure the AI tool just for you. This shouldn't take long..." />
      <div class="flex items-center gap-4">
        <USkeleton class="size-24 rounded-full" />

        <div class="grid gap-2">
          <USkeleton class="h-8 w-[450px]" />
          <USkeleton class="h-8 w-[350px]" />
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="grid gap-2">
          <USkeleton class="h-8 w-[450px]" />
          <USkeleton class="h-8 w-[350px]" />
        </div>
        <USkeleton class="size-24 rounded-full" />
      </div>

    </div>
    <div class="assistant-page" v-else>

      <!-- ── LEFT: CHAT ──────────────────────────────────── -->
      <div class="chat-main">

        <!-- Chat header -->
        <div class="chat-header">
          <div class="ai-avatar">
            <span class="ai-avatar-dot"></span>
          </div>
          <div class="chat-header-info">
            <div class="chat-title">QatarDrive AI</div>
            <div class="chat-status">
              <span class="status-dot"></span>
              Online · Scanning QatarLiving
            </div>
          </div>
          <UButton variant="ghost" size="sm" class="clear-btn" @click="clearChat">
            <template #leading>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </template>
            New Chat
          </UButton>
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="messagesEl">

          <!-- Welcome state -->
          <div v-if="messages.length === 0" class="welcome-state">
            <div class="welcome-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <h2 class="welcome-title">What car are you looking for?</h2>
            <p class="welcome-sub">Describe your needs in plain English — budget, brand, how you'll use it — and I'll
              find the
              best matches on QatarLiving right now.</p>
            <div class="quick-prompts">
              <UButton v-for="p in quickPrompts" :key="p" variant="outline" size="md" class="quick-prompt"
                @click="sendQuickPrompt(p)">{{ p }}</UButton>
            </div>
          </div>

          <!-- Message list -->
          <template v-else>
            <div v-for="(msg, i) in messages" :key="i" class="msg-row" :class="msg.role">
              <div v-if="msg.role === 'ai'" class="msg-avatar">
                <span class="msg-avatar-dot"></span>
              </div>
              <div class="msg-content">
                <div class="msg-bubble" :class="msg.role">
                  <div class="msg-text" v-html="msg.text"></div>
                  <div v-if="msg.suggestions" class="msg-suggestions">
                    <UButton v-for="s in msg.suggestions" :key="s" variant="outline" size="xs" class="msg-suggestion"
                      @click="sendQuickPrompt(s)">{{ s }}</UButton>
                  </div>
                </div>
                <div class="msg-time">{{ msg.time }}</div>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="msg-row ai">
              <div class="msg-avatar"><span class="msg-avatar-dot"></span></div>
              <div class="msg-content">
                <div class="msg-bubble ai typing-bubble">
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Input area -->
        <div class="chat-input-area">
          <div v-if="messages.length > 0" class="input-suggestions">
            <UButton v-for="p in shortPrompts" :key="p" variant="outline" size="xs" class="input-suggestion"
              @click="sendQuickPrompt(p)">{{ p }}</UButton>
          </div>

          <div class="input-row">
            <UTextarea v-model="inputText" class="chat-input" placeholder="Describe the car you're looking for..."
              :rows="1" autoresize :maxrows="4" @keydown.enter.exact.prevent="sendMessage" />
            <UButton class="send-btn" :disabled="!inputText.trim()" @click="sendMessage">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </UButton>
          </div>
          <div class="input-hint">Press Enter to send · Shift+Enter for new line</div>
        </div>
      </div>

      <!-- ── RIGHT: RECOMMENDATIONS SIDEBAR ─────────────── -->
      <aside class="rec-sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">AI Recommendations</span>
          <UBadge v-if="recommendations.length" variant="soft" class="sidebar-count">
            {{ recommendations.length }}
          </UBadge>
        </div>

        <!-- Empty state -->
        <div v-if="recommendations.length === 0" class="sidebar-empty">
          <div class="sidebar-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 12h6M9 15h4" />
            </svg>
          </div>
          <p class="sidebar-empty-text">Your AI-matched cars will appear here as you chat</p>
        </div>

        <!-- Recommendation cards -->
        <div v-else class="rec-list">
          <div v-for="(car, i) in recommendations" :key="car.id" class="rec-card" :class="{ 'rec-card-top': i === 0 }"
            @click="$router.push(`/cars/${car.id}`)">
            <div class="rec-rank">#{{ i + 1 }}</div>
            <div class="rec-img">
              <svg viewBox="0 0 220 90" fill="none" class="rec-car-svg">
                <path
                  d="M14 60 L14 48 Q20 32 38 24 L80 16 Q100 13 118 18 L158 24 Q178 28 192 44 L206 50 L206 60 Q206 70 198 70 L22 70 Q14 70 14 60Z"
                  fill="rgba(200,169,110,0.07)" stroke="rgba(200,169,110,0.3)" stroke-width="1" />
                <path d="M44 44 Q52 28 70 22 L108 16 L108 44Z" fill="rgba(150,200,240,0.05)"
                  stroke="rgba(150,200,240,0.15)" stroke-width="0.8" />
                <path d="M116 16 L148 20 L162 34 L166 44 L116 44Z" fill="rgba(150,200,240,0.05)"
                  stroke="rgba(150,200,240,0.15)" stroke-width="0.8" />
                <circle cx="62" cy="70" r="16" fill="#0e0e10" stroke="rgba(200,169,110,0.4)" stroke-width="1" />
                <circle cx="62" cy="70" r="9" fill="rgba(200,169,110,0.05)" stroke="rgba(200,169,110,0.4)"
                  stroke-width="0.8" />
                <circle cx="158" cy="70" r="16" fill="#0e0e10" stroke="rgba(200,169,110,0.4)" stroke-width="1" />
                <circle cx="158" cy="70" r="9" fill="rgba(200,169,110,0.05)" stroke="rgba(200,169,110,0.4)"
                  stroke-width="0.8" />
              </svg>
              <div class="rec-score">{{ car.matchScore }}%</div>
            </div>
            <div class="rec-body">
              <div class="rec-name">{{ car.make }} {{ car.model }} {{ car.year }}</div>
              <div class="rec-price">QAR {{ car.price.toLocaleString() }}</div>
              <div class="rec-tags">
                <span class="rec-tag">{{ car.mileage.toLocaleString() }} km</span>
                <span class="rec-tag">{{ car.transmission }}</span>
                <span class="rec-tag" :class="car.priceClass">{{ car.priceLabel }}</span>
              </div>
              <div v-if="car.reason" class="rec-reason">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                {{ car.reason }}
              </div>
            </div>
          </div>

          <NuxtLink to="/search" class="view-all-btn">
            View All Matches
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Car } from '~~/types'

useSeoMeta({
  title: 'AI Assistant — QatarDrive',
  description: 'Tell our AI what car you need and get ranked matches from QatarLiving instantly.',
})

// ── Types ─────────────────────────────────────────────────
interface Message {
  role: 'user' | 'ai'
  text: string
  time: string
  suggestions?: string[]
}

interface Recommendation {
  id: number
  make: string
  model: string
  year: number
  price: number
  mileage: number
  transmission: string
  matchScore: number
  priceLabel: string
  priceClass: string
  reason: string
}

// ── Refs ──────────────────────────────────────────────────
const messages = ref<Message[]>([])
const inputText = ref('')
const isTyping = ref(false)
const recommendations = ref<Recommendation[]>([])
const messagesEl = ref<HTMLElement | null>(null)
const isPageLoading = ref(true);
const cars = ref<Car[]>([])
const quickPrompts = ref<string[]>([])


// ── Quick prompts ─────────────────────────────────────────


// ── Streaming Data Fetcher ────────────────────────────────
async function fetchData() {
  isPageLoading.value = true
  try {
    const response = await fetch('/api/v1/getAllCars')

    if (!response.body) throw new Error('ReadableStream not supported')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')

      // Keep the last partial line in the buffer
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim()) {
          try {
            const car: Car = JSON.parse(line)
            cars.value.push(car)
          } catch (e) {
            console.error('Error parsing NDJSON line', e)
          }
        }
      }
      cars.value = cars.value.map(c => ({ ...c, images: [] }))
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load cars'
  } finally {
    const { data } = await useFetch('/api/v1/ai/get-chat-suggestions', {
      method: 'POST',
      server: false,
      dedupe: 'cancel',
      body: {
        jsonDB: JSON.stringify(randomize(cars.value).slice(0, 100))
      }
    })
    quickPrompts.value = data.value || []
    isPageLoading.value = false
  }
}

// Start fetching on mount (Client-side only)
onMounted(() => {
  fetchData()
})



function randomize(arr: any[]) {
  return arr.sort(() => Math.random() - 0.5)
}


// const quickPrompts = [
//   'Reliable family SUV under QAR 120,000',
//   'Low mileage Toyota, max 50,000 km',
//   'Best deal BMW or Mercedes under QAR 150,000',
//   'Fuel-efficient sedan, 2020 or newer',
//   'Compare Nissan Patrol vs Toyota Land Cruiser',
//   "What's a fair price for a 2021 Fortuner?",
// ]

const shortPrompts = [
  'Show cheaper options',
  'Filter by low mileage',
  'Compare top 3',
  'Is this a good price?',
]

// ── Helpers ───────────────────────────────────────────────
function getTime(): string {
  return new Date().toLocaleTimeString('en-QA', { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom(): void {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  })
}

function clearChat(): void {
  messages.value = []
  recommendations.value = []
  inputText.value = ''
}

// ── Send message ──────────────────────────────────────────
async function sendMessage(): Promise<void> {
  const text = inputText.value.trim()
  if (!text) return

  messages.value.push({ role: 'user', text, time: getTime() })
  inputText.value = ''
  scrollToBottom()

  isTyping.value = true
  scrollToBottom()
  const aiText = await $fetch('/api/v1/ai/chat-assistant', {
    method: 'POST',
    body: JSON.stringify({
      message: text,
      jsonDB: cars.value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  isTyping.value = false

  const lower = text.toLowerCase()
  let suggestions: string[] = []
  let newRecs: Recommendation[] = []
  messages.value.push({ role: 'ai', text: aiText, suggestions, time: getTime() })
  recommendations.value = newRecs
  scrollToBottom()
}

function sendQuickPrompt(text: string): void {
  inputText.value = text
  sendMessage()
}

// ── Mock data (replace with API response) ─────────────────
const mockRecs: Record<string, Recommendation[]> = {
  suv: [
    { id: 1, make: 'Toyota', model: 'Fortuner', year: 2021, price: 98000, mileage: 42000, transmission: 'Automatic', matchScore: 96, priceLabel: '7% below avg', priceClass: 'good', reason: 'Best value for mileage and year' },
    { id: 5, make: 'Nissan', model: 'Patrol', year: 2021, price: 118000, mileage: 38000, transmission: 'Automatic', matchScore: 89, priceLabel: 'Fair price', priceClass: 'ok', reason: 'Strong reliability track record' },
    { id: 2, make: 'Lexus', model: 'RX 350', year: 2022, price: 145000, mileage: 28000, transmission: 'Automatic', matchScore: 84, priceLabel: 'Fair price', priceClass: 'ok', reason: 'Lowest mileage in category' },
  ],
  luxury: [
    { id: 3, make: 'BMW', model: 'X5', year: 2020, price: 132000, mileage: 55000, transmission: 'Automatic', matchScore: 91, priceLabel: '3% above avg', priceClass: 'warn', reason: 'Single owner, full service history' },
    { id: 7, make: 'Mercedes', model: 'GLC 300', year: 2021, price: 185000, mileage: 35000, transmission: 'Automatic', matchScore: 78, priceLabel: '10% above avg', priceClass: 'warn', reason: 'Premium spec, low mileage' },
  ],
  toyota: [
    { id: 4, make: 'Toyota', model: 'Land Cruiser', year: 2019, price: 165000, mileage: 70000, transmission: 'Automatic', matchScore: 88, priceLabel: 'Fair price', priceClass: 'ok', reason: 'Iconic model, high demand' },
    { id: 1, make: 'Toyota', model: 'Fortuner', year: 2021, price: 98000, mileage: 42000, transmission: 'Automatic', matchScore: 94, priceLabel: '7% below avg', priceClass: 'good', reason: 'Best mileage-to-price ratio' },
  ],
}
</script>

<style scoped>
.assistant-page {
  padding-top: var(--nav-h);
  display: grid;
  grid-template-columns: 1fr 340px;
  height: calc(100vh - var(--nav-h));
  overflow: hidden;
}

/* ── Chat main ───────────────────────────────────────────── */
.chat-main {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  min-height: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 28px;
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
  flex-shrink: 0;
}

.ai-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(200, 169, 110, 0.1);
  border: 1px solid rgba(200, 169, 110, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s infinite;
}

.chat-header-info {
  flex: 1;
}

.chat-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 3px;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

.clear-btn {
  color: var(--muted) !important;
  border-color: var(--border) !important;
  font-size: 12px !important;
}

.clear-btn:hover {
  color: var(--text) !important;
}

/* ── Messages ────────────────────────────────────────────── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.welcome-state {
  margin: auto;
  text-align: center;
  max-width: 520px;
  padding: 40px 20px;
}

.welcome-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(200, 169, 110, 0.08);
  border: 1px solid rgba(200, 169, 110, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: var(--accent);
}

.welcome-title {
  font-family: var(--font-display);
  font-size: 32px;
  letter-spacing: 0.03em;
  margin-bottom: 12px;
}

.welcome-sub {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 32px;
  font-weight: 300;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.quick-prompt {
  border-color: var(--border) !important;
  color: var(--text) !important;
  border-radius: 20px !important;
  font-size: 13px !important;
  background: var(--bg2) !important;
  padding: 4px;
}

.quick-prompt:hover {
  border-color: rgba(200, 169, 110, 0.35) !important;
  color: var(--accent) !important;
}

/* Message rows */
.msg-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.msg-row.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(200, 169, 110, 0.1);
  border: 1px solid rgba(200, 169, 110, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: 18px;
}

.msg-avatar-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
}

.msg-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 78%;
}

.msg-row.user .msg-content {
  align-items: flex-end;
}

.msg-bubble {
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.65;
}

.msg-bubble.ai {
  background: rgba(200, 169, 110, 0.05);
  border: 1px solid rgba(200, 169, 110, 0.12);
  border-radius: 4px 12px 12px 12px;
}

.msg-bubble.user {
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: 12px 4px 12px 12px;
}

.msg-text {
  color: var(--text);
}

.msg-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.msg-suggestion {
  border-color: rgba(200, 169, 110, 0.2) !important;
  color: var(--accent) !important;
  border-radius: 20px !important;
  font-size: 12px !important;
}

.msg-suggestion:hover {
  background: rgba(200, 169, 110, 0.08) !important;
}

.msg-time {
  font-size: 11px;
  color: var(--muted2);
  padding: 0 4px;
}

/* Typing indicator */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 18px;
}

.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.4;
  animation: typingBounce 1.2s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* ── Input area ──────────────────────────────────────────── */
.chat-input-area {
  padding: 16px 28px 20px;
  border-top: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}

.input-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.input-suggestion {
  border-color: var(--border) !important;
  color: var(--muted) !important;
  border-radius: 20px !important;
  font-size: 11px !important;
}

.input-suggestion:hover {
  border-color: rgba(200, 169, 110, 0.3) !important;
  color: var(--accent) !important;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: var(--radius-md);
  padding: 6px 6px 6px 4px;
  transition: border-color 0.2s;
}

.input-row:focus-within {
  border-color: rgba(200, 169, 110, 0.4);
}

/* Override UTextarea internals to match dark theme */
.chat-input {
  flex: 1;
}

.chat-input :deep(textarea) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: var(--text) !important;
  font-size: 14px !important;
  font-family: var(--font-body) !important;
  resize: none !important;
  padding: 8px 12px !important;
}

.chat-input :deep(textarea)::placeholder {
  color: var(--muted) !important;
}

.chat-input :deep(div) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.send-btn {
  background: var(--accent) !important;
  color: #0a0a0b !important;
  border: none !important;
  width: 38px !important;
  height: 38px !important;
  border-radius: var(--radius-sm) !important;
  flex-shrink: 0;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.send-btn:disabled {
  opacity: 0.4 !important;
  cursor: not-allowed !important;
}

.send-btn:not(:disabled):hover {
  background: var(--accent2) !important;
}

.input-hint {
  font-size: 11px;
  color: var(--muted2);
  margin-top: 8px;
  text-align: center;
}

/* ── Sidebar ─────────────────────────────────────────────── */
.rec-sidebar {
  background: var(--bg2);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.sidebar-count {
  background: rgba(200, 169, 110, 0.12) !important;
  color: var(--accent) !important;
  font-size: 11px !important;
}

.sidebar-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  gap: 14px;
  flex: 1;
}

.sidebar-empty-icon {
  opacity: 0.3;
  color: var(--muted);
}

.sidebar-empty-text {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
  max-width: 200px;
}

.rec-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rec-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
  position: relative;
}

.rec-card:hover {
  border-color: rgba(200, 169, 110, 0.3);
  transform: translateY(-1px);
}

.rec-card-top {
  border-color: rgba(200, 169, 110, 0.2);
}

.rec-rank {
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--accent);
  background: rgba(10, 10, 11, 0.8);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: 3px;
  padding: 2px 7px;
  z-index: 1;
}

.rec-img {
  height: 90px;
  background: var(--bg4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.rec-car-svg {
  width: 80%;
}

.rec-score {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(10, 10, 11, 0.85);
  border: 1px solid var(--border2);
  border-radius: 3px;
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--accent);
  padding: 2px 7px;
}

.rec-body {
  padding: 12px 14px;
}

.rec-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.rec-price {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--accent);
  margin-bottom: 8px;
  line-height: 1;
}

.rec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 8px;
}

.rec-tag {
  font-size: 10px;
  color: var(--muted);
  background: var(--bg4);
  padding: 3px 8px;
  border-radius: 3px;
}

.rec-tag.good {
  color: var(--green);
  background: rgba(107, 196, 126, 0.08);
}

.rec-tag.warn {
  color: #e09a3a;
  background: rgba(224, 154, 58, 0.08);
}

.rec-reason {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--muted);
  line-height: 1.4;
}

.rec-reason svg {
  flex-shrink: 0;
  color: var(--accent);
  opacity: 0.7;
}

.view-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.15s;
  margin-top: 4px;
}

.view-all-btn:hover {
  border-color: rgba(200, 169, 110, 0.3);
  color: var(--accent);
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 860px) {
  .assistant-page {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }

  .chat-main {
    height: 70vh;
  }

  .rec-sidebar {
    max-height: 60vh;
  }
}
</style>
