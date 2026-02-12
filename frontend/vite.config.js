import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const configFilePath = fileURLToPath(import.meta.url)
const configDir = path.dirname(configFilePath)

function readBackendApiKey(frontendCwd) {
  try {
    const backendEnvPath = path.resolve(frontendCwd, '../backend/.env')
    if (!fs.existsSync(backendEnvPath)) {
      return ''
    }
    const raw = fs.readFileSync(backendEnvPath, 'utf8')
    const matched = raw.match(/^API_KEY=(.+)$/m)
    return matched?.[1]?.trim() || ''
  } catch {
    return ''
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, configDir, '')
  const backendTarget = env.BACKEND_TARGET || 'http://127.0.0.1:8080'
  const backendApiKey = env.BACKEND_API_KEY || readBackendApiKey(configDir)

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (backendApiKey) {
                proxyReq.setHeader('x-api-key', backendApiKey)
              }
            })
          },
        },
        '/health': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
