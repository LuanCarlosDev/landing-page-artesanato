/**
 * ModalController - Controla o Modal de Detalhes da Peça Única
 */

import { eventBus } from '../../core/event-bus.js';

export class ModalController {
  constructor({ createWhatsAppLinkUseCase }) {
    this.createWhatsAppLinkUseCase = createWhatsAppLinkUseCase;

    this.backdropEl = document.getElementById('piece-modal-backdrop');
    this.containerEl = document.getElementById('piece-modal-container');
    this.closeBtnEl = document.getElementById('modal-close-btn');

    // Elementos internos do modal
    this.imgEl = document.getElementById('modal-img');
    this.categoryEl = document.getElementById('modal-category');
    this.titleEl = document.getElementById('modal-title');
    this.subtitleEl = document.getElementById('modal-subtitle');
    this.descEl = document.getElementById('modal-description');
    this.conceptEl = document.getElementById('modal-concept');
    this.materialsEl = document.getElementById('modal-materials');
    this.dimensionsEl = document.getElementById('modal-dimensions');
    this.techniquesEl = document.getElementById('modal-techniques');
    this.whatsappBtnEl = document.getElementById('modal-whatsapp-btn');
  }

  init() {
    if (!this.backdropEl) return;

    eventBus.on('piece:inspect', (piece) => {
      this.open(piece);
    });

    if (this.closeBtnEl) {
      this.closeBtnEl.addEventListener('click', () => this.close());
    }

    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.backdropEl.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(piece) {
    if (!piece) return;

    if (this.imgEl) {
      this.imgEl.src = piece.imageWebp;
      this.imgEl.alt = piece.title;
    }

    if (this.categoryEl) this.categoryEl.textContent = piece.category;
    if (this.titleEl) this.titleEl.textContent = piece.title;
    if (this.subtitleEl) this.subtitleEl.textContent = piece.subtitle;
    if (this.descEl) this.descEl.textContent = piece.description;
    
    if (this.conceptEl) {
      this.conceptEl.textContent = `"${piece.artisticConcept}"`;
    }

    if (this.materialsEl) {
      this.materialsEl.textContent = piece.materials.join(', ');
    }

    if (this.dimensionsEl) {
      this.dimensionsEl.textContent = piece.dimensions;
    }

    if (this.techniquesEl) {
      this.techniquesEl.textContent = piece.techniques.join(', ');
    }

    if (this.whatsappBtnEl) {
      this.whatsappBtnEl.href = this.createWhatsAppLinkUseCase.forPiece(piece);
    }

    this.backdropEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.backdropEl) return;
    this.backdropEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}
