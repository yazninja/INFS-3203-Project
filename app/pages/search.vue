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
          <div class="cars-grid">
            <div v-for="car in sortedCars" :key="car.id" class="car-card" @click="$router.push(`/cars/${car.id}`)">
              <!-- Image area -->
              <div class="car-img-area">
                <div class="car-img-placeholder">
                  <svg class="car-sil" viewBox="0 0 300 120" fill="none">
                    <path
                      d="M20 82 L20 66 Q28 46 52 36 L108 24 Q132 20 155 26 L212 34 Q238 40 256 60 L278 70 L278 82 Q278 94 268 94 L32 94 Q20 94 20 82Z"
                      fill="rgba(200,169,110,0.08)" stroke="rgba(200,169,110,0.25)" stroke-width="1" />
                    <path d="M62 60 Q72 40 96 32 L148 26 L148 60Z" fill="rgba(150,200,240,0.05)"
                      stroke="rgba(150,200,240,0.15)" stroke-width="0.8" />
                    <path d="M158 26 L200 30 L220 44 L224 60 L158 60Z" fill="rgba(150,200,240,0.05)"
                      stroke="rgba(150,200,240,0.15)" stroke-width="0.8" />
                    <circle cx="84" cy="94" r="20" fill="#0e0e10" stroke="rgba(200,169,110,0.35)" stroke-width="1" />
                    <circle cx="84" cy="94" r="11" fill="rgba(200,169,110,0.05)" stroke="rgba(200,169,110,0.4)"
                      stroke-width="0.8" />
                    <circle cx="216" cy="94" r="20" fill="#0e0e10" stroke="rgba(200,169,110,0.35)" stroke-width="1" />
                    <circle cx="216" cy="94" r="11" fill="rgba(200,169,110,0.05)" stroke="rgba(200,169,110,0.4)"
                      stroke-width="0.8" />
                  </svg>
                </div>
                <!-- Badges -->
                <div v-if="car.badge" class="car-badge" :class="`badge-${car.badge.type}`">
                  {{ car.badge.label }}
                </div>
                <!-- AI score -->
                <div class="ai-score">
                  <span class="ai-score-num">{{ car.aiScore }}%</span>
                  <span class="ai-score-label">AI Match</span>
                </div>
              </div>

              <!-- Card body -->
              <div class="car-body">
                <div class="car-name">{{ car.make }} {{ car.model }} {{ car.year }}</div>
                <div class="car-meta">{{ car.bodyType }} · {{ car.transmission }} · {{ car.mileage.toLocaleString() }}
                  km</div>

                <div class="car-specs">
                  <div class="spec">
                    <strong>{{ car.year }}</strong>
                    <span>Year</span>
                  </div>
                  <div class="spec">
                    <strong>{{ car.engine }}</strong>
                    <span>Engine</span>
                  </div>
                  <div class="spec">
                    <strong>{{ car.color }}</strong>
                    <span>Color</span>
                  </div>
                </div>

                <div class="car-footer">
                  <div class="car-price-wrap">
                    <div class="car-price">QAR {{ car.price.toLocaleString() }}</div>
                    <div v-if="car.priceTag" class="price-tag" :class="car.priceTag.type">
                      {{ car.priceTag.label }}
                    </div>
                  </div>
                  <button class="view-btn" @click.stop="$router.push(`/cars/${car.id}`)">
                    View
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

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
useSeoMeta({
  title: 'Browse Cars — QatarDrive',
  description: 'Browse all secondhand car listings in Qatar, ranked by AI.',
})
// ── Data from backend ───────────────────────────────────────
const { data: cars } = await useFetch('/api/v1/getAllCars');
console.log('Fetched', cars.value?.length ?? 0, 'cars from backend')

// ── Filter options ───────────────────────────────────────
const models = cars.value ? Array.from(new Set(cars.value.map(c => c.model))).sort() : []
const makes = cars.value ? Array.from(new Set(cars.value.map(c => c.make))).sort() : []
const years = cars.value ? Array.from(new Set(cars.value.map(c => c.year))).sort((a, b) => b - a) : []
const engine = cars.value ? Array.from(new Set(cars.value.map(c => c.engine))).sort() : []
const locations = cars.value ? Array.from(new Set(cars.value.map(c => c.location))).sort() : []

// ── Reactive filter state ────────────────────────────────
const filters = reactive({
  models: [''],
  makes: [''],
  engine: [''],
  locations: [''],
  minPrice: 0,
  maxPrice: 10000000,
  minYear: 1900,
  maxYear: new Date().getFullYear(),
  minMileage: 0,
  maxMileage: 500000,
})

const sortBy = ref('ai')

function toggleChip(arr, val) {
  const i = arr.indexOf(val)
  if (i === -1) arr.push(val)
  else arr.splice(i, 1)
}

function resetFilters() {
  filters.models = ['']
  filters.makes = ['']
  filters.engine = ['']
  filters.locations = ['']
}

// ── Active filter tags (for pills row) ──────────────────
const activeFilterTags = computed(() => {
  const tags = []
  filters.makes.forEach(m => tags.push({ label: m, remove: () => toggleChip(filters.makes, m) }))
  if (filters.minPrice) tags.push({ label: `Min QAR ${filters.minPrice}`, remove: () => { filters.minPrice = 0 } })
  if (filters.maxPrice) tags.push({ label: `Max QAR ${filters.maxPrice}`, remove: () => { filters.maxPrice = 10000000 } })
  if (filters.minYear) tags.push({ label: `From ${filters.minYear}`, remove: () => { filters.minYear = 1900 } })
  if (filters.maxYear) tags.push({ label: `To ${filters.maxYear}`, remove: () => { filters.maxYear = new Date().getFullYear() } })
  if (filters.minMileage) tags.push({ label: `Min ${filters.minMileage} km`, remove: () => { filters.minMileage = 0 } })
  if (filters.maxMileage) tags.push({ label: `Max ${filters.maxMileage} km`, remove: () => { filters.maxMileage = 500000 } })
  return tags
})

// ── Mock car data (replace with API call) ───────────────
// TODO: replace with useFetch('/api/cars') when backend is ready


// ── Filtering logic ──────────────────────────────────────
const filteredCars = computed(() => {
  return cars.value!.filter(car => {
    // if (filters.makes.length && !filters.makes.includes(car.make)) return false
    // if (filters.models.length && !filters.models.includes(car.model)) return false
    // if (filters.engine.length && !filters.engine.includes(car.engine)) return false
    // if (filters.locations.length && !filters.locations.includes(car.location)) return false
    return true
  })
})

// ── Sorting logic ────────────────────────────────────────
const sortedCars = computed(() => {
  const list = [...filteredCars.value]
  // if (sortBy.value === 'price_asc') return list.sort((a, b) => a.price - b.price)
  // if (sortBy.value === 'price_desc') return list.sort((a, b) => b.price - a.price)
  // if (sortBy.value === 'year') return list.sort((a, b) => b.year - a.year)
  // if (sortBy.value === 'mileage') return list.sort((a, b) => a.mileage - b.mileage)
  // return list.sort((a, b) => b.aiScore - a.aiScore) // default: AI score
  return list;
})
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

.car-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.car-card:hover {
  border-color: rgba(200, 169, 110, 0.3);
  transform: translateY(-2px);
}

.car-img-area {
  position: relative;
  height: 160px;
  background: var(--bg3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.car-sil {
  width: 85%;
  opacity: 0.9;
}

.car-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 10px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge-gold {
  background: rgba(200, 169, 110, 0.15);
  color: var(--accent);
  border: 1px solid rgba(200, 169, 110, 0.3);
}

.badge-red {
  background: rgba(224, 90, 58, 0.12);
  color: #e05a3a;
  border: 1px solid rgba(224, 90, 58, 0.3);
}

.badge-blue {
  background: rgba(100, 160, 220, 0.12);
  color: #7ab4e0;
  border: 1px solid rgba(100, 160, 220, 0.3);
}

.ai-score {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(10, 10, 11, 0.85);
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  backdrop-filter: blur(4px);
}

.ai-score-num {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--accent);
  line-height: 1;
}

.ai-score-label {
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.car-body {
  padding: 16px;
}

.car-name {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
}

.car-meta {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 14px;
}

.car-specs {
  display: flex;
  gap: 0;
  margin-bottom: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.spec {
  flex: 1;
  padding: 8px 10px;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.spec:last-child {
  border-right: none;
}

.spec strong {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.spec span {
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.car-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.car-price-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.car-price {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--accent);
  line-height: 1;
}

.price-tag {
  font-size: 10px;
  letter-spacing: 0.05em;
}

.price-tag.good {
  color: var(--green);
}

.price-tag.ok {
  color: var(--muted);
}

.price-tag.warn {
  color: #e09a3a;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border2);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.view-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
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