import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Check if running in production environment
const isProduction = process.env.NODE_ENV === 'production';

// Conditionally set the server configuration
let serverConfig = {};

if (isProduction) {
  // For production, assuming you want HTTPS with specific certificates
  // or the same as development for local testing
  serverConfig.https = {
    key: fs.readFileSync('./production-key.pem'), // Path to production key
    cert: fs.readFileSync('./production-cert.pem') // Path to production cert
  };
}

export default defineConfig({
  plugins: [react()],
  server: serverConfig
});
