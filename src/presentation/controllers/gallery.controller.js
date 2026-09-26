/**
 * GalleryController - Controla a Galeria Curada de Peças Únicas
 * Filtros, busca em tempo real, renderização de cards e redirecionamento WhatsApp
 */

import { eventBus } from '../../core/event-bus.js';

export class GalleryController {
  constructor({ getPiecesUseCase, createWhatsAppLinkUseCase, pieceRepository }) {
    this.getPiecesUseCase = getPiecesUseCase;
    this.createWhatsAppLinkUseCase = createWhatsAppLinkUseCase;
    this.pieceRepository = pieceRepository;

    this.activeCategory = 'all';
    this.searchQuery = '';

    // Elementos DOM
    this.gridEl = document.getElementById('gallery-grid');
    this.categoriesContainerEl = document.getElementById('gallery-categories');
    this.searchInputEl = document.getElementById('gallery-search-input');
  }

  init() {
    if (!this.gridEl) return;
    this.renderCategories();
    this.bindEvents();
    this.render();
  }

  renderCategories() {
    if (!this.categoriesContainerEl) return;
    const categories = this.pieceRepository.getCategories();
    const allCount = this.pieceRepository.getAll().length;

    this.categoriesContainerEl.innerHTML = `
      <button class="category-filter-btn active" data-category="all">
        Todas as Peças (${allCount})
      </button>
      ${categories.map(cat => `
        <button class="category-filter-btn" data-category="${cat.name}">
          ${cat.name} (${cat.count})
        </button>
      `).join('')}
    `;

    this.categoriesContainerEl.querySelectorAll('.category-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.categoriesContainerEl.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-category');
        this.render();
      });
    });
  }

  bindEvents() {
    if (this.searchInputEl) {
      this.searchInputEl.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }
  }

  render() {
    const pieces = this.getPiecesUseCase.execute({
      category: this.activeCategory,
      query: this.searchQuery,
    });

    if (pieces.length === 0) {
      this.gridEl.innerHTML = `
        <div class="gallery-empty">
          <h4>Nenhuma peça encontrada</h4>
          <p>Tente ajustar os filtros ou pesquisar por outro material ou termo.</p>
        </div>
      `;
      return;
    }

    this.gridEl.innerHTML = pieces.map(piece => {
      const whatsappUrl = this.createWhatsAppLinkUseCase.forPiece(piece);
      return `
        <article class="piece-card" data-piece-id="${piece.id}">
          <div class="piece-card-media" data-action="inspect" tabindex="0" role="button" aria-label="Ver detalhes de ${piece.title}">
            <img class="piece-card-img" src="${piece.imageWebp}" alt="${piece.title}" loading="lazy">
            <div class="piece-card-overlay-btn">
              <span class="overlay-inspect-btn">Explorar Detalhes</span>
            </div>
          </div>
          <div class="piece-card-body">
            <span class="piece-category-tag">${piece.category}</span>
            <h3 class="piece-title">${piece.title}</h3>
            <p class="piece-subtitle">${piece.subtitle}</p>
            
            <div class="piece-materials-pills">
              ${piece.materials.map(mat => `<span class="material-pill">${mat}</span>`).join('')}
            </div>

            <div class="piece-card-footer">
              <button class="btn-card-inspect" data-action="inspect">
                Ver Detalhes
              </button>
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-whatsapp" title="Conversar no WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span>Falar Comigo</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Adicionar listeners para clique no card/botão de inspeção
    this.gridEl.querySelectorAll('.piece-card').forEach(card => {
      const pieceId = card.getAttribute('data-piece-id');
      const piece = pieces.find(p => p.id === pieceId);
      if (!piece) return;

      card.querySelectorAll('[data-action="inspect"]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          eventBus.emit('piece:inspect', piece);
        });
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            eventBus.emit('piece:inspect', piece);
          }
        });
      });
    });
  }
}
