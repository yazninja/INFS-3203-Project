<template>
  <nav class="navbar">
    <div class="navbar-inner container">

      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        QATAR<span>DRIVE</span>
      </NuxtLink>

      <!-- Nav links -->
      <div class="nav-links">
        <NuxtLink to="/search" class="nav-link">Browse Cars</NuxtLink>
        <NuxtLink to="/assistant" class="nav-link">AI Assistant</NuxtLink>
      </div>

      <!-- CTA -->
      <div class="nav-actions">
        <NuxtLink to="/assistant" class="btn-primary">
          <span class="ai-dot"></span>
          Ask AI
        </NuxtLink>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--nav-h);
  background: rgba(10, 10, 11, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.navbar-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 0.1em;
  color: var(--text);
  transition: opacity 0.2s;
}
.logo:hover { opacity: 0.8; }
.logo span  { color: var(--accent); }

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.2s;
  position: relative;
}
.nav-link:hover        { color: var(--text); }
.nav-link.router-link-active { color: var(--accent); }
.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
}

.nav-actions { display: flex; align-items: center; gap: 12px; }

.ai-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a0a0b;
  animation: pulse 2s infinite;
}

@media (max-width: 640px) {
  .nav-links { display: none; }
}
</style>
