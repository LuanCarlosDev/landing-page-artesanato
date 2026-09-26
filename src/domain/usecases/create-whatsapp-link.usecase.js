/**
 * Caso de Uso: Gerar Link Personalizado para WhatsApp
 * Lílian Costa - Peças Únicas
 */

import { CONFIG } from '../../core/config.js';

export class CreateWhatsAppLinkUseCase {
  constructor(phone = CONFIG.artisan.phoneRaw) {
    this.phone = phone;
  }

  forPiece(piece) {
    const text = `Olá Lílian, tudo bem? Me encantei com a sua peça única "${piece.title}" no seu site e gostaria de saber mais detalhes e disponibilidade para o meu ambiente.`;
    return this._buildUrl(text);
  }

  forAmbient(ambient) {
    const text = `Olá Lílian, tudo bem? Adorei a composição das suas peças no ambiente "${ambient.name}" que vi no seu site. Gostaria de conversar com você sobre propostas para o meu espaço.`;
    return this._buildUrl(text);
  }

  forCustomOrder() {
    const text = `Olá Lílian, tudo bem? Conheci o seu trabalho pelo site e gostaria de conversar com você sobre a criação de uma peça exclusiva e sob medida para o meu lar.`;
    return this._buildUrl(text);
  }

  forGeneralInquiry() {
    const text = `Olá Lílian, tudo bem? Conheci suas criações autorais pelo seu site e gostaria de conversar com você.`;
    return this._buildUrl(text);
  }

  _buildUrl(message) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${this.phone}?text=${encoded}`;
  }
}
