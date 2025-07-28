import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: [
      'storage',
      'activeTab',
      'alarms',
    ],
    host_permissions: [
      '*://www.youtube.com/*',
      '*://youtube.com/*',
      '*://raw.githubusercontent.com/*',
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
