import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const openDesignKey = env.OPENDESIGN_API_KEY ?? ''

  return {
    plugins: [react(), tailwindcss()],
    base: './',
    server: {
      host: '0.0.0.0',
      port: 3847,
      strictPort: true,
      allowedHosts: true,
      proxy: {
        '/api/opendesign': {
          target: 'https://amr-link.open-design.ai/v1',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/opendesign/, ''),
          headers: openDesignKey ? { Authorization: `Bearer ${openDesignKey}` } : {},
        },
      },
    },
  }
})
