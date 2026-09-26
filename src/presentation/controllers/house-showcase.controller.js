/**
 * HouseShowcaseController - Controla a exibição interativa 3D inspirada no Cash App
 * Substitui o smartphone por uma Residência Arquitetônica Contemporânea
 */

import { eventBus } from '../../core/event-bus.js';

export class HouseShowcaseController {
  constructor({ getAmbientsUseCase, createWhatsAppLinkUseCase }) {
    this.getAmbientsUseCase = getAmbientsUseCase;
    this.createWhatsAppLinkUseCase = createWhatsAppLinkUseCase;
    this.ambients = this.getAmbientsUseCase.execute();
    this.currentAmbientIndex = 0;
    
    // Elementos DOM
    this.containerEl = document.getElementById('casa-showcase') || document.getElementById('house-showcase');
    this.tabsContainerEl = document.getElementById('room-tabs-container');
    this.stageContainerEl = document.getElementById('house-stage-container');
    this.stageEl = document.getElementById('house-stage');
    this.viewportEl = document.getElementById('house-viewport');
    this.ambientImgEl = document.getElementById('house-ambient-img');
    this.roomTitleEl = document.getElementById('frame-room-title');
    this.floatingRackEl = document.getElementById('floating-pieces-rack');
    this.hotspotsContainerEl = document.getElementById('hotspots-container');
    this.detailsTextEl = document.getElementById('ambient-details-text');
    this.ambientWhatsAppBtnEl = document.getElementById('ambient-whatsapp-btn');
  }

  init() {
    if (!this.containerEl) return;
    this.renderTabs();
    this.bindEvents();
    this.loadAmbient(this.ambients[0].id);
    this.init3DParallax();
  }

  renderTabs() {
    if (!this.tabsContainerEl) return;
    this.tabsContainerEl.innerHTML = `
      <div class="room-tabs" role="tablist">
        ${this.ambients.map((amb, index) => `
          <button 
            class="room-tab-btn ${index === 0 ? 'active' : ''}" 
            data-ambient-id="${amb.id}"
            role="tab"
            aria-selected="${index === 0 ? 'true' : 'false'}"
          >
            <svg class="tab-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>${amb.shortName || amb.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    this.tabsContainerEl.querySelectorAll('.room-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-ambient-id');
        this.loadAmbient(id);
      });
    });
  }

  loadAmbient(ambientId) {
    const ambient = this.ambients.find(a => a.id === ambientId);
    if (!ambient) return;

    this.currentAmbient = ambient;

    // Atualizar abas ativas
    if (this.tabsContainerEl) {
      this.tabsContainerEl.querySelectorAll('.room-tab-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-ambient-id') === ambientId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    // Animar e trocar imagem do ambiente
    if (this.ambientImgEl) {
      this.ambientImgEl.style.animation = 'none';
      // Forçar reflow
      void this.ambientImgEl.offsetWidth;
      this.ambientImgEl.src = ambient.image;
      this.ambientImgEl.alt = `${ambient.name} - Casa Lílian Costa`;
      this.ambientImgEl.style.animation = 'roomFadeZoom 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }

    // Atualizar título na barra da moldura
    if (this.roomTitleEl) {
      this.roomTitleEl.textContent = ambient.name;
    }

    // Não renderiza marcadores sobre a foto para manter a imagem limpa e contínua conforme solicitado
    if (this.hotspotsContainerEl) {
      this.hotspotsContainerEl.innerHTML = '';
    }

    // Atualizar cards flutuantes orbitando a casa (Cash App Floating Elements)
    this.renderFloatingPieces(ambient.pieces);

    // Atualizar painel de detalhes do cômodo (sem prefixo 'Minha/Meu')
    if (this.detailsTextEl) {
      this.detailsTextEl.innerHTML = `
        <h3>${ambient.name}</h3>
        <p>${ambient.description}</p>
        <span style="display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.4rem; font-size:0.8rem; color:var(--color-accent-gold); font-weight:500;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          Atmosfera: ${ambient.atmosphere}
        </span>
      `;
    }

    // Atualizar botão WhatsApp do ambiente
    if (this.ambientWhatsAppBtnEl) {
      this.ambientWhatsAppBtnEl.href = this.createWhatsAppLinkUseCase.forAmbient(ambient);
    }
  }

  renderHotspots(pieces) {
    // Desativado conforme solicitado: foto dos cômodos 100% limpa sem marcadores
    if (this.hotspotsContainerEl) {
      this.hotspotsContainerEl.innerHTML = '';
    }
  }

  renderFloatingPieces(pieces) {
    if (!this.floatingRackEl) return;
    this.floatingRackEl.innerHTML = '';

    pieces.forEach((piece, idx) => {
      const card = document.createElement('div');
      card.className = 'floating-piece-item';
      card.style.animationDelay = `${idx * 0.1}s`;

      card.innerHTML = `
        <img class="floating-piece-thumb" src="${piece.imageWebp}" alt="${piece.title}" loading="lazy">
        <div class="floating-piece-info">
          <h4 class="floating-piece-name" title="${piece.title}">${piece.title}</h4>
          <span class="floating-piece-action">
            Explorar Peça
            <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        eventBus.emit('piece:inspect', piece);
      });

      this.floatingRackEl.appendChild(card);
    });
  }

  init3DParallax() {
    if (!this.stageEl) return;

    // Área estável de hit (o container fixo não sofre rotação 3D, garantindo coordenadas perfeitas)
    const hitArea = this.stageContainerEl || this.stageEl;

    // Estado da animação com interpolação linear (LERP)
    let isHovered = false;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetPanX = 0;
    let targetPanY = 0;

    let currentRotX = 0;
    let currentRotY = 0;
    let currentPanX = 0;
    let currentPanY = 0;

    let rafId = null;
    let cachedRect = null;

    const updateRect = () => {
      cachedRect = hitArea.getBoundingClientRect();
    };

    // Invalida cache de posição ao rolar a página ou redimensionar a janela
    window.addEventListener('resize', () => { cachedRect = null; }, { passive: true });
    window.addEventListener('scroll', () => { cachedRect = null; }, { passive: true });

    // Constantes de física e movimento
    const LERP_FACTOR = 0.085;       // Resposta macia e contínua estilo Apple/Cash App
    const MAX_ROTATION_DEG = 5.5;   // Ângulo elegante de inclinação sem distorcer
    const MAX_PAN_PX = 12;          // Deslocamento de profundidade da imagem interna

    const renderLoop = () => {
      // Interpolação suave em direção aos alvos
      currentRotX += (targetRotX - currentRotX) * LERP_FACTOR;
      currentRotY += (targetRotY - currentRotY) * LERP_FACTOR;
      currentPanX += (targetPanX - currentPanX) * LERP_FACTOR;
      currentPanY += (targetPanY - currentPanY) * LERP_FACTOR;

      // Aplica rotação 3D contínua no palco
      this.stageEl.style.transform = `rotateX(${currentRotX.toFixed(3)}deg) rotateY(${currentRotY.toFixed(3)}deg) translateZ(4px)`;

      // Aplica micro-parallax na imagem do cômodo com aceleração GPU
      if (this.ambientImgEl) {
        this.ambientImgEl.style.transform = `scale(1.04) translate3d(${(-currentPanX).toFixed(2)}px, ${(-currentPanY).toFixed(2)}px, 0)`;
      }

      // Critério de repouso: se o ponteiro saiu e a física desacelerou até o centro, encerra o loop
      const isSettled =
        !isHovered &&
        Math.abs(currentRotX) < 0.01 &&
        Math.abs(currentRotY) < 0.01 &&
        Math.abs(currentPanX) < 0.02 &&
        Math.abs(currentPanY) < 0.02;

      if (isSettled) {
        currentRotX = 0;
        currentRotY = 0;
        currentPanX = 0;
        currentPanY = 0;
        this.stageEl.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        if (this.ambientImgEl) {
          this.ambientImgEl.style.transform = 'scale(1) translate3d(0px, 0px, 0px)';
        }
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    const startLoopIfNeeded = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(renderLoop);
      }
    };

    const handlePointerEnter = (e) => {
      if (e.pointerType === 'touch') return;
      isHovered = true;
      updateRect();
      startLoopIfNeeded();
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === 'touch') return;
      if (!cachedRect) updateRect();
      if (!cachedRect || cachedRect.width === 0 || cachedRect.height === 0) return;

      isHovered = true;

      // Posição relativa estável ao container
      const mouseX = e.clientX - cachedRect.left;
      const mouseY = e.clientY - cachedRect.top;

      const centerX = cachedRect.width / 2;
      const centerY = cachedRect.height / 2;

      // Normaliza de -1 a +1
      const rawNormX = (mouseX - centerX) / centerX;
      const rawNormY = (mouseY - centerY) / centerY;

      // Clamping seguro: nas 4 extremidades atinge o limite máximo suavemente sem nunca oscilar ou travar
      const normX = Math.max(-1, Math.min(1, rawNormX));
      const normY = Math.max(-1, Math.min(1, rawNormY));

      // Mapeia coordenadas normalizadas para os ângulos de rotação
      targetRotX = -normY * MAX_ROTATION_DEG;
      targetRotY = normX * MAX_ROTATION_DEG;

      targetPanX = normX * MAX_PAN_PX;
      targetPanY = normY * MAX_PAN_PX;

      startLoopIfNeeded();
    };

    const handlePointerLeave = () => {
      isHovered = false;
      targetRotX = 0;
      targetRotY = 0;
      targetPanX = 0;
      targetPanY = 0;
      cachedRect = null;
      startLoopIfNeeded();
    };

    // Registra listeners na área de detecção estável
    hitArea.addEventListener('pointerenter', handlePointerEnter);
    hitArea.addEventListener('pointermove', handlePointerMove);
    hitArea.addEventListener('pointerleave', handlePointerLeave);
  }

  bindEvents() {
    // Interação caso o usuário queira navegar por teclado
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') {
        const nextIdx = (this.currentAmbientIndex + 1) % this.ambients.length;
        this.currentAmbientIndex = nextIdx;
        this.loadAmbient(this.ambients[nextIdx].id);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (this.currentAmbientIndex - 1 + this.ambients.length) % this.ambients.length;
        this.currentAmbientIndex = prevIdx;
        this.loadAmbient(this.ambients[prevIdx].id);
      }
    });
  }
}
