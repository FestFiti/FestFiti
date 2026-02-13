import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// API Plugin
const apiPlugin = () => ({
  name: 'api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/test') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'success',
          message: 'API is working!',
          timestamp: new Date().toISOString()
        }));
        return;
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [apiPlugin(), react()],
})
