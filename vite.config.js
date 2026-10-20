import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const publicEnv = loadEnv(mode, process.cwd(), 'NEXT_PUBLIC_');

  return {
    base: '/portal-indicadores/',
    plugins: [react()],
    define: {
      'import.meta.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? ''),
      'import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''),
    },
  };
});
