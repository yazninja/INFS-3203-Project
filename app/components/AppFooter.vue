<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-logo">QATAR<span>DRIVE</span></div>
      <p class="footer-copy">© 2026 QatarDrive · AI-Powered Car Finder for Qatar</p>
      <div class="footer-links">
        <NuxtLink to="/search">Browse</NuxtLink>
        <NuxtLink to="/assistant">AI Assistant</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  padding: 32px 0;
  margin-top: 80px;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.footer-logo {
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 0.1em;
  color: var(--muted2);
}
.footer-logo span { color: var(--accent); opacity: 0.6; }
.footer-copy { font-size: 12px; color: var(--muted2); }
.footer-links {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.footer-links a:hover { color: var(--accent); }
</style>
