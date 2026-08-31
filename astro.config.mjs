// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://calculadoradeidade.com',
  redirects: {
    '/calculator': '/',
    '/age-calculator': '/',
    '/upsc': '/calculadora-idade-concursos',
    '/upsc-age-calculator': '/calculadora-idade-concursos',
    '/retirement': '/calculadora-idade-aposentadoria',
    '/retirement-age-calculator': '/calculadora-idade-aposentadoria',
    '/dog-age': '/calculadora-idade-cachorro',
    '/dog-age-calculator': '/calculadora-idade-cachorro',
    '/baby-age': '/calculadora-idade-gestacional',
    '/baby-age-calculator': '/calculadora-idade-gestacional',
    '/date-diff': '/calculadora-idade-entre-datas',
    '/date-difference-calculator': '/calculadora-idade-entre-datas',
    '/about': '/sobre',
    '/contact': '/contato',
    '/privacy-policy': '/politica-de-privacidade',
    '/terms-and-conditions': '/termos-de-uso',
  },
  devToolbar: {
    enabled: false
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
