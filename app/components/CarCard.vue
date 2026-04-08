<template>
  <div class="car-card" @click="navigateTo(`/cars/${car.id}`, {
    external: true,
    open: {
      target: '_blank',
    }
  })">
    <!-- Image area -->
    <div class="car-img-area">
      <div v-if="car.images && car.images.length" class="car-img-placeholder">
        <NuxtImg :src="car.images[0]" alt="Car image" class="car-img" loading="lazy" />
      </div>
      <div class="car-img-placeholder" v-else>
        <svg class="car-sil" viewBox="0 0 300 120" fill="none">
          <path
            d="M20 82 L20 66 Q28 46 52 36 L108 24 Q132 20 155 26 L212 34 Q238 40 256 60 L278 70 L278 82 Q278 94 268 94 L32 94 Q20 94 20 82Z"
            fill="rgba(200,169,110,0.08)" stroke="rgba(200,169,110,0.25)" stroke-width="1" />
          <path d="M62 60 Q72 40 96 32 L148 26 L148 60Z" fill="rgba(150,200,240,0.05)" stroke="rgba(150,200,240,0.15)"
            stroke-width="0.8" />
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
      <div class="ai-score" v-if="rating !== null">
        <!-- car.aiScore -->
        <span class="ai-score-num">{{ rating }}%</span>
        <span class="ai-score-label">AI Rating</span>
      </div>
    </div>

    <!-- Card body -->
    <div class="car-body">
      <div class="car-name">{{ car.make }} {{ car.model }} {{ car.year }}</div>
      <div class="car-meta">{{ car.isBrandNew ? 'Brand New' : '2nd hand' }} · {{ car.installmentsAvailable ?
        'Installments Available ·' : '' }} {{ car.mileage.toLocaleString() }}
        km</div>

      <div class="car-specs">
        <div class="spec">
          <strong>{{ car.year }}</strong>
          <span>Year</span>
        </div>
        <div class="spec">
          <strong>{{ car.cylinder }} Cylinder {{ car.engine }}L</strong>
          <span>Engine</span>
        </div>
        <div class="spec">
          <strong>{{ car.fuel }}</strong>
          <span>Fuel</span>
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
</template>

<script lang="ts" setup>
const rating = ref(null);
const props = defineProps({
  car: {
    type: Object,
    required: true
  }
});

onMounted(async () => {
  // console.log(`Fetching AI rating for ${props.car.make} ${props.car.model}...`);
  if (props.car) {
    const data = await $fetch('/api/v1/ai/get-ai-rating', {
      method: "POST",
      body: {
        jsonDB: JSON.stringify(props.car)
      }
    })
    rating.value = data;
    console.log(`AI rating for ${props.car.make} ${props.car.model}:`, data);
  }
})

async function canReachURL(url) {
  try {
    // Validate URL format first
    new URL(url); // Throws if invalid format

    // Attempt a HEAD request (faster, no body download)
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });

    // If mode: 'no-cors', status might be 0 for opaque responses
    // So we treat status 0 or 200-399 as "reachable"
    return response.ok || response.status === 0;
  } catch (error) {
    console.error(`Error checking URL: ${error.message}`);
    return false;
  }
}
</script>

<style>
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
</style>