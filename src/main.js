/**
 * Entrypoint Principal da Aplicação
 * Inicialização resiliente e segura para navegadores modernos
 */

import { AppController } from './presentation/controllers/app.controller.js';

function bootstrap() {
  const app = new AppController();
  app.init();
  window.app = app;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
