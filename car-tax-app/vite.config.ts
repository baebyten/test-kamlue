import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://car-tax-app-d650a.web.app/', // เปลี่ยนให้ตรงกับเส้นทางที่คุณ deploy
});
