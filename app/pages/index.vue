<template>
  <div>
  <AppNavbar />
  <div class="landing">

    <!-- ── HERO ─────────────────────────────────────────── -->
    <section class="hero">
      <!-- Background layers -->
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>

      <div class="container hero-content">
        <div class="hero-left">
          <div class="hero-badge fade-up">
            <span class="badge-dot"></span>
            AI-Powered · Qatar Listings Only
          </div>

          <h1 class="hero-title fade-up delay-1">
            FIND YOUR<br>
            <em>PERFECT</em><br>
            VEHICLE IN QATAR
          </h1>

          <p class="hero-subtitle fade-up delay-2">
            Describe what you need. Our AI scans every secondhand listing
            on QatarLiving, ranks the best deals, and filters out the fakes —
            in seconds.
          </p>

          <div class="hero-actions fade-up delay-3">
            <NuxtLink to="/assistant" class="btn-primary btn-lg">
              <span class="btn-dot"></span>
              Ask the AI
            </NuxtLink>
            <NuxtLink to="/search" class="btn-ghost btn-lg">
              Browse Listings
            </NuxtLink>
          </div>
        </div>

        <!-- Hero car visual -->
        <div class="hero-right fade-up delay-2">
          <div class="car-visual-wrap">
            <div class="car-visual-glow"></div>
            <svg class="car-svg" viewBox="0 0 520 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Body -->
              <path
                d="M40 158 L40 132 Q52 96 90 80 L180 58 Q220 50 265 58 L370 72 Q415 80 445 112 L480 132 L480 158 Q480 178 465 178 L58 178 Q40 178 40 158Z"
                fill="rgba(200,169,110,0.07)" stroke="rgba(200,169,110,0.35)" stroke-width="1.5" />
              <!-- Roof -->
              <path d="M118 118 Q135 82 175 68 L248 60 Q285 57 320 66 L380 82 L390 118Z" fill="rgba(200,169,110,0.05)"
                stroke="rgba(200,169,110,0.2)" stroke-width="1" />
              <!-- Windshield -->
              <path d="M130 116 Q148 84 182 72 L248 64 L248 116Z" fill="rgba(150,200,240,0.06)"
                stroke="rgba(150,200,240,0.18)" stroke-width="0.8" />
              <!-- Rear window -->
              <path d="M268 64 L340 68 L378 80 L388 116 L268 116Z" fill="rgba(150,200,240,0.06)"
                stroke="rgba(150,200,240,0.18)" stroke-width="0.8" />
              <!-- Wheels -->
              <circle cx="148" cy="178" r="34" fill="#0e0e10" stroke="rgba(200,169,110,0.4)" stroke-width="1.5" />
              <circle cx="148" cy="178" r="20" fill="rgba(200,169,110,0.06)" stroke="rgba(200,169,110,0.5)"
                stroke-width="1" />
              <circle cx="148" cy="178" r="6" fill="rgba(200,169,110,0.4)" />
              <circle cx="372" cy="178" r="34" fill="#0e0e10" stroke="rgba(200,169,110,0.4)" stroke-width="1.5" />
              <circle cx="372" cy="178" r="20" fill="rgba(200,169,110,0.06)" stroke="rgba(200,169,110,0.5)"
                stroke-width="1" />
              <circle cx="372" cy="178" r="6" fill="rgba(200,169,110,0.4)" />
              <!-- Headlight -->
              <ellipse cx="460" cy="138" rx="14" ry="8" fill="rgba(200,169,110,0.15)" stroke="rgba(200,169,110,0.5)"
                stroke-width="1" />
              <!-- Tail light -->
              <ellipse cx="58" cy="140" rx="10" ry="7" fill="rgba(224,90,58,0.2)" stroke="rgba(224,90,58,0.5)"
                stroke-width="1" />
              <!-- Ground shadow -->
              <ellipse cx="260" cy="210" rx="200" ry="12" fill="rgba(200,169,110,0.04)" />
            </svg>

            <!-- Floating badges -->
            <div class="float-badge badge-top-right">
              <span class="float-badge-dot"></span>
              AI Verified Deal
            </div>
            <div class="float-badge badge-bottom-left">
              <span>QAR 98,000</span>
              <small>7% below market</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── STATS STRIP ───────────────────────────────────── -->
    <section class="stats-strip">
      <div class="container stats-inner">
        <div class="stat" v-for="s in stats" :key="s.label">
          <div class="stat-num">{{ s.num }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ──────────────────────────────────── -->
    <section class="how-section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">How It Works</div>
          <h2 class="section-title">THREE STEPS TO <em>YOUR CAR</em></h2>
        </div>

        <div class="steps-grid">
          <div class="step-card" v-for="(step, i) in steps" :key="i">
            <div class="step-number">0{{ i + 1 }}</div>
            <div class="step-icon-wrap">
              <component :is="'div'" class="step-icon" v-html="step.icon"></component>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
            <div class="step-connector" v-if="i < steps.length - 1"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FEATURES ──────────────────────────────────────── -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Why QatarDrive</div>
          <h2 class="section-title">SMARTER THAN <em>SCROLLING</em></h2>
        </div>

        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.title">
            <div class="feature-icon-wrap" v-html="f.icon"></div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA BANNER ────────────────────────────────────── -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box">
          <div class="cta-glow"></div>
          <div class="cta-content">
            <div class="cta-tag">
              <span class="cta-dot"></span> Live · Updated Hourly
            </div>
            <h2 class="cta-title">READY TO FIND<br><em>YOUR NEXT CAR?</em></h2>
            <p class="cta-desc">
              Tell our AI your budget, preferred brand, and what matters most.
              We'll do the rest.
            </p>
            <div class="cta-actions">
              <NuxtLink to="/assistant" class="btn-primary btn-lg">
                Start with AI Assistant
              </NuxtLink>
              <NuxtLink to="/search" class="btn-ghost btn-lg">
                Browse All Listings
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'QatarDrive — AI-Powered Secondhand Car Finder',
  description: 'Find the best secondhand car deals in Qatar. AI-powered search and ranking from QatarLiving listings.',
})



const stats = [
  { num: '4,200+', label: 'Active Listings' },
  { num: 'AI', label: 'Powered Matching' },
  { num: '< 30s', label: 'To Find Your Match' },
  { num: '100%', label: 'Qatar-Based Listings' },
]

const steps = [
  {
    title: 'Describe What You Want',
    desc: 'Tell the AI your budget, preferred brands, mileage limits, or just say "reliable family SUV under 100k QAR".',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    title: 'AI Scans & Ranks',
    desc: 'Our AI analyses all current QatarLiving listings, scores each one on price, mileage, and reliability, and removes bogus ads.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>`,
  },
  {
    title: 'Pick Your Car',
    desc: 'Browse your personalised ranked list, compare specs and pricing, and contact the seller directly through QatarLiving.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  },
]

const features = [
  {
    title: 'AI-Powered Ranking',
    desc: 'Not just a filter. Our AI scores every listing based on your criteria and ranks them from best to worst deal.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
  {
    title: 'Fake Listing Filter',
    desc: 'QatarLiving has bogus ads. Our AI detects and removes suspicious listings — like a car listed for 500 QAR.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    title: 'Qatar-Only Listings',
    desc: 'Every result is a real listing from QatarLiving. No international noise, no outdated data.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  },
  {
    title: 'Updated Hourly',
    desc: 'Our database syncs with QatarLiving every hour, so you always see the freshest listings without any delay.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.08-4.55"/></svg>`,
  },
  {
    title: 'Price Intelligence',
    desc: 'Instantly know if a listing is overpriced or a steal. We compare every car against the current Qatar market average.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  },
  {
    title: 'Natural Language Search',
    desc: 'No need to fill out 10 dropdowns. Just type what you want in plain English or Arabic.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
  },
]
</script>

<style scoped>
.landing {
  padding-top: var(--nav-h);
  overflow-x: hidden;
}

/* ── Hero ───────────────────────────────────── */
.hero {
  position: relative;
  min-height: 88vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

.hero-glow {
  position: absolute;
  right: -10%;
  top: 10%;
  width: 60%;
  height: 70%;
  background: radial-gradient(ellipse, rgba(200, 169, 110, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  padding-top: 60px;
  padding-bottom: 80px;
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(200, 169, 110, 0.08);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: 20px;
  padding: 7px 16px;
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 28px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s infinite;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(60px, 8vw, 96px);
  line-height: 0.9;
  letter-spacing: 0.02em;
  margin-bottom: 28px;
}

.hero-title em {
  color: var(--accent);
  font-style: normal;
}

.hero-subtitle {
  font-size: 16px;
  color: var(--muted);
  line-height: 1.75;
  margin-bottom: 40px;
  max-width: 480px;
  font-weight: 300;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-lg {
  padding: 14px 32px;
  font-size: 13px;
}

.btn-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a0a0b;
  animation: pulse 2s infinite;
}

/* Car visual */
.car-visual-wrap {
  position: relative;
  padding: 40px 20px;
}

.car-visual-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(200, 169, 110, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.car-svg {
  width: 100%;
  max-width: 520px;
  filter: drop-shadow(0 20px 60px rgba(200, 169, 110, 0.1));
}

.float-badge {
  position: absolute;
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: var(--radius-md);
  padding: 8px 14px;
  font-size: 12px;
  backdrop-filter: blur(8px);
  animation: floatBob 4s ease-in-out infinite;
}

@keyframes floatBob {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

.badge-top-right {
  top: 16px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--green);
  animation-delay: 0.5s;
}

.float-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
}

.badge-bottom-left {
  bottom: 24px;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badge-bottom-left span {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--accent);
}

.badge-bottom-left small {
  font-size: 11px;
  color: var(--muted);
}

/* ── Stats strip ─────────────────────────────── */
.stats-strip {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
}

.stats-inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.stat {
  padding: 28px 32px;
  border-right: 1px solid var(--border);
}

.stat:last-child {
  border-right: none;
}

.stat-num {
  font-family: var(--font-display);
  font-size: 36px;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── Section shared ──────────────────────────── */
.how-section,
.features-section {
  padding: 100px 0;
}

.section-header {
  margin-bottom: 56px;
}

.section-tag {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: 0.03em;
  line-height: 1;
}

.section-title em {
  color: var(--accent);
  font-style: normal;
}

/* ── Steps ───────────────────────────────────── */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  position: relative;
}

.step-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  padding: 40px 36px;
  position: relative;
  transition: border-color 0.2s;
}

.step-card:not(:last-child) {
  border-right: none;
}

.step-card:hover {
  border-color: rgba(200, 169, 110, 0.25);
}

.step-card:first-child {
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.step-card:last-child {
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  border-right: 1px solid var(--border);
}

.step-number {
  font-family: var(--font-display);
  font-size: 56px;
  color: rgba(200, 169, 110, 0.1);
  line-height: 1;
  margin-bottom: 20px;
}

.step-icon-wrap {
  color: var(--accent);
  margin-bottom: 20px;
}

.step-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.step-desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}

/* ── Features ────────────────────────────────── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.feature-card {
  background: var(--bg);
  padding: 36px 32px;
  transition: background 0.2s;
}

.feature-card:hover {
  background: var(--bg2);
}

.feature-icon-wrap {
  color: var(--accent);
  margin-bottom: 18px;
  opacity: 0.9;
}

.feature-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
}

.feature-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.7;
}

/* ── CTA ─────────────────────────────────────── */
.cta-section {
  padding-bottom: 0;
}

.cta-box {
  position: relative;
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: var(--radius-lg);
  padding: 80px 64px;
  overflow: hidden;
  background: rgba(200, 169, 110, 0.03);
}

.cta-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200, 169, 110, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.cta-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
}

.cta-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 5vw, 64px);
  letter-spacing: 0.03em;
  line-height: 0.95;
  margin-bottom: 20px;
}

.cta-title em {
  color: var(--accent);
  font-style: normal;
}

.cta-desc {
  font-size: 16px;
  color: var(--muted);
  max-width: 480px;
  margin-bottom: 36px;
  font-weight: 300;
  line-height: 1.7;
}

.cta-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

/* ── Responsive ──────────────────────────────── */
@media (max-width: 900px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-right {
    display: none;
  }

  .stats-inner {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat:nth-child(2) {
    border-right: none;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .step-card {
    border-right: 1px solid var(--border) !important;
    border-radius: 0 !important;
  }

  .step-card:first-child {
    border-radius: var(--radius-md) var(--radius-md) 0 0 !important;
  }

  .step-card:last-child {
    border-radius: 0 0 var(--radius-md) var(--radius-md) !important;
    border-top: none !important;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-box {
    padding: 48px 32px;
  }
}
</style>
