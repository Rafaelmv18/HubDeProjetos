import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Testes (Vitest): simulam o navegador com jsdom
  test: {
    environment: 'jsdom',
    // Roda antes de cada arquivo de teste (matchers e limpeza)
    setupFiles: ['./src/test/setup.ts'],

    // Cobertura: quanto do código os testes realmente executam.
    // Só é medida com "npm run test:coverage".
    coverage: {
      provider: 'v8',
      // "text" mostra a tabela no terminal; "html" cria a pasta coverage/
      reporter: ['text', 'html'],
      // Mede todo o código de src/, mesmo os arquivos que nenhum teste abre
      include: ['src/**/*.{ts,tsx}'],
      // Fora da conta: os próprios testes, a preparação e o ponto de entrada
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
    },
  },
  server: {
    // Aceita conexões de fora do contêiner (o navegador no Windows)
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    // O Vite recusa endereços que não conhece. "web" é como os testes
    // de ponta a ponta (serviço e2e) chamam o front-end dentro do Docker.
    allowedHosts: ['web'],

    // A pasta é compartilhada entre o Windows e o Docker, e o aviso de
    // "arquivo mudou" nem sempre chega. O polling confere os arquivos de
    // tempos em tempos, e a página atualiza sozinha quando você salva.
    watch: {
      usePolling: true,
      interval: 300,
    },

    // Proxy (D30): o que o navegador pedir em /api vai para o Laravel.
    // Para o navegador, a página e a API vêm do mesmo endereço,
    // por isso o login por cookie funciona sem precisar de CORS.
    proxy: {
      '/api': {
        // "api" é o nome do serviço do Laravel no docker-compose.yml
        target: process.env.VITE_API_URL ?? 'http://api:8000',
        changeOrigin: false,
      },
    },
  },
})
