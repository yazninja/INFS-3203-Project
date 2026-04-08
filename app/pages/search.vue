<template>
  <div>
    <AppNavbar />
    <div class="search-page">

      <!-- ── PAGE HEADER ─────────────────────────────────── -->
      <div class="page-header">
        <div class="container header-inner">
          <div>
            <h1 class="page-title">Browse <em>Listings</em></h1>
            <p class="page-sub">All secondhand cars currently on QatarLiving — ranked by AI</p>
          </div>
          <NuxtLink to="/assistant" class="btn-primary">
            <span class="ai-pulse"></span>
            Ask AI Instead
          </NuxtLink>
        </div>
      </div>

      <div class="container search-layout">

        <!-- ── FILTERS SIDEBAR ──────────────────────────── -->
        <aside class="filters-panel">
          <div class="filters-header">
            <span class="filters-title">Filters</span>
            <button class="reset-btn" @click="resetFilters">Reset all</button>
          </div>

          <!-- Make -->
          <div class="filter-group">
            <div class="filter-label">Make</div>
            <div class="chips">
              <div v-for="make in makes" :key="make" class="chip" :class="{ active: filters.makes.includes(make) }"
                @click="toggleChip(filters.makes, make)">{{ make }}</div>
            </div>
          </div>

          <!-- Budget -->
          <div class="filter-group">
            <div class="filter-label">Budget (QAR)</div>
            <div class="range-row">
              <UInput v-model="filters.minPrice" class="range-input" type="number" placeholder="Min" />
              <span class="range-sep">–</span>
              <UInput v-model="filters.maxPrice" class="range-input" type="number" placeholder="Max" />
            </div>
          </div>

          <!-- Year -->
          <div class="filter-group">
            <div class="filter-label">Year</div>
            <div class="range-row">
              <UInput v-model="filters.minYear" class="range-input" type="number" placeholder="From" />
              <span class="range-sep">–</span>
              <UInput v-model="filters.maxYear" class="range-input" type="number" placeholder="To" />
            </div>
          </div>

          <!-- Condition -->
          <div class="filter-group">
            <div class="filter-label">Condition</div>
            <div class="chips">
              <div v-for="c in conditions" :key="c" class="chip" :class="{ active: filters.condition === c }"
                @click="filters.condition = filters.condition === c ? '' : c">{{ c }}</div>
            </div>
          </div>

          <button class="btn-primary apply-btn">Apply Filters</button>

          <!-- AI shortcut -->
          <div class="ai-hint">
            <div class="ai-hint-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <div>
              <div class="ai-hint-title">Try the AI instead</div>
              <div class="ai-hint-desc">Just describe what you want in plain English</div>
            </div>
          </div>
        </aside>

        <!-- ── RESULTS ───────────────────────────────────── -->
        <div class="results-area">

          <!-- Results header -->
          <div class="results-header">
            <div class="results-count">
              <strong>{{ filteredCars.length }} cars</strong> match your filters
            </div>
            <div class="results-controls">
              <select v-model="sortBy" class="sort-select">
                <option value="ai">Sort: AI Best Match</option>
                <option value="price_asc">Sort: Price Low–High</option>
                <option value="price_desc">Sort: Price High–Low</option>
                <option value="year">Sort: Year (Newest)</option>
                <option value="mileage">Sort: Mileage (Lowest)</option>
              </select>
            </div>
          </div>

          <!-- Active filter tags -->
          <div v-if="activeFilterTags.length" class="active-tags">
            <div v-for="tag in activeFilterTags" :key="tag.label" class="active-tag">
              {{ tag.label }}
              <button @click="tag.remove" class="tag-remove">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Car grid -->
          <UProgress class="mb-4 sticky" v-if="isStreaming" v-model="progressValue" :max="['Loading More Cars']" />
          <UScrollArea v-slot="{ item, index }" :items="sortedCars" orientation="vertical" :virtualize="{
            gap: 16,
            lanes: 2,
            estimateSize: 916,
          }" class="mt-4">
            <LazyCarCard :car="item" :key="index" hydrate-on-visible />
          </UScrollArea>

          <!-- <div class="cars-grid mt-4!">
            <LazyCarCard v-for="car in sortedCars" :key="car.id" :car="car" hydrate-on-visible />
          </div> -->
          <!-- Empty state -->
          <div v-if="sortedCars.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div class="empty-title">No cars match your filters</div>
            <div class="empty-desc">Try adjusting your filters or let the AI find something for you</div>
            <NuxtLink to="/assistant" class="btn-primary" style="margin-top:20px">Ask AI Assistant</NuxtLink>
          </div>

        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Car } from '../../types/index'

useSeoMeta({
  title: 'Browse Cars — QatarDrive',
  description: 'Browse all secondhand car listings in Qatar, ranked by AI.',
})

// ── State ─────────────────────────────────────────────────
const cars = ref<Car[]>([])
const isStreaming = ref(false)
const error = ref<string | null>(null)
const sortBy = ref('ai')
const progressValue = ref(null);

const filters = reactive({
  models: [] as string[],
  makes: [] as string[],
  engine: [] as string[],
  locations: [] as string[],
  minPrice: 0,
  maxPrice: 10000000,
  minYear: 1900,
  maxYear: new Date().getFullYear(),
  minMileage: 0,
  maxMileage: 500000,
})



// ── Streaming Data Fetcher ────────────────────────────────
async function fetchData() {
  isStreaming.value = true
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
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load cars'
  } finally {
    isStreaming.value = false
    localStorage.setItem('jsonDB', JSON.stringify(cars.value)) // Store full data for AI use
    localStorage.setItem('aiReady', 'true') // Flag to indicate AI can start processing;
  }
}

// Start fetching on mount (Client-side only)
onMounted(() => {
  fetchData()
})

// ── Computed Filter Options (Update automatically as cars stream in) ──
const models = computed(() => [...new Set(cars.value.map(c => c.model))].sort())
const makes = computed(() => [...new Set(cars.value.map(c => c.make))].sort())
const years = computed(() => [...new Set(cars.value.map(c => c.year))].sort((a, b) => b - a))
const engines = computed(() => [...new Set(cars.value.map(c => c.engine))].sort())
const locations = computed(() => [...new Set(cars.value.map(c => c.location))].sort())

// ── Filter & Sort Logic ───────────────────────────────────
const filteredCars = computed(() => {
  return cars.value.filter(car => {
    if (filters.makes.length && !filters.makes.includes(car.make)) return false
    if (filters.models.length && !filters.models.includes(car.model)) return false
    if (car.price < filters.minPrice || car.price > filters.maxPrice) return false
    if (car.year < filters.minYear || car.year > filters.maxYear) return false
    if (car.mileage > filters.maxMileage) return false
    return true
  })
})

const sortedCars = computed(() => {
  const list = [...filteredCars.value]
  if (sortBy.value === 'price_asc') return list.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price_desc') return list.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'year') return list.sort((a, b) => b.year - a.year)
  if (sortBy.value === 'mileage') return list.sort((a, b) => a.mileage - b.mileage)
  return list.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
})

// ── UI Helpers ───────────────────────────────────────────
const activeFilterTags = computed(() => {
  const tags: { label: string; remove: () => void }[] = []

  filters.makes.forEach(m => {
    tags.push({ label: m, remove: () => toggleChip(filters.makes, m) })
  })

  if (filters.minPrice > 0) {
    tags.push({ label: `Min QAR ${filters.minPrice}`, remove: () => { filters.minPrice = 0 } })
  }

  // Add more tag logic here...
  return tags
})

function toggleChip(arr: string[], val: string) {
  const i = arr.indexOf(val)
  if (i === -1) arr.push(val)
  else arr.splice(i, 1)
}

function resetFilters() {
  filters.models = []
  filters.makes = []
  filters.engine = []
  filters.locations = []
  filters.minPrice = 0
  // ... reset others
}
</script>

<style scoped>
.search-page {
  padding-top: var(--nav-h);
  min-height: 100vh;
}

/* ── Header ─────────────────────────────────────────────── */
.page-header {
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
  padding: 32px 0;
}

.header-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 42px;
  letter-spacing: 0.03em;
  line-height: 1;
  margin-bottom: 6px;
}

.page-title em {
  color: var(--accent);
  font-style: normal;
}

.page-sub {
  font-size: 13px;
  color: var(--muted);
}

.ai-pulse {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a0a0b;
  animation: pulse 2s infinite;
}

/* ── Layout ─────────────────────────────────────────────── */
.search-layout {
  display: grid;
  grid-template-columns: 268px 1fr;
  gap: 32px;
  padding-top: 32px;
  padding-bottom: 64px;
  align-items: start;
}

/* ── Filters panel ──────────────────────────────────────── */
.filters-panel {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  position: sticky;
  top: calc(var(--nav-h) + 24px);
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters-title {
  font-size: 13px;
  font-weight: 500;
}

.reset-btn {
  font-size: 11px;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.reset-btn:hover {
  color: var(--accent);
}

.filter-group {
  margin-bottom: 22px;
}

.filter-label {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.chip {
  padding: 5px 13px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  border: 1px solid var(--border);
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.chip:hover {
  border-color: var(--border2);
  color: var(--text);
}

.chip.active {
  background: rgba(200, 169, 110, 0.1);
  border-color: rgba(200, 169, 110, 0.4);
  color: var(--accent);
}

.range-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-UInput {
  flex: 1;
  min-width: 0;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  padding: 8px 10px;
  font-size: 12px;
  transition: border-color 0.15s;
}

.range-input:focus {
  outline: none;
  border-color: var(--accent);
}

.range-input::placeholder {
  color: var(--muted2);
}

.range-sep {
  font-size: 12px;
  color: var(--muted2);
  flex-shrink: 0;
}

.apply-btn {
  width: 100%;
  justify-content: center;
  margin-bottom: 16px;
}

.ai-hint {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(200, 169, 110, 0.05);
  border: 1px solid rgba(200, 169, 110, 0.12);
  border-radius: var(--radius-md);
  padding: 12px;
}

.ai-hint-icon {
  color: var(--accent);
  flex-shrink: 0;
  margin-top: 2px;
}

.ai-hint-title {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 2px;
  color: var(--accent);
}

.ai-hint-desc {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.5;
}

/* ── Results ─────────────────────────────────────────────── */
.results-area {
  min-width: 0;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.results-count {
  font-size: 13px;
  color: var(--muted);
}

.results-count strong {
  color: var(--text);
}

.sort-select {
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: var(--font-body);
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: var(--accent);
}

.active-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.active-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(200, 169, 110, 0.08);
  border: 1px solid rgba(200, 169, 110, 0.2);
  color: var(--accent);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
}

.tag-remove {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  opacity: 0.7;
}

.tag-remove:hover {
  opacity: 1;
}

/* ── Car grid ────────────────────────────────────────────── */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}



/* ── Empty state ─────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 80px 32px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  margin-bottom: 16px;
  color: var(--muted2);
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 13px;
  color: var(--muted);
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 960px) {
  .search-layout {
    grid-template-columns: 1fr;
  }

  .filters-panel {
    position: static;
  }

  .cars-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>