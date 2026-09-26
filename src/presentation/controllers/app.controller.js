/**
 * AppController - Orquestrador Principal da Aplicação
 * Clean Architecture: Injeção de dependências e inicialização dos componentes
 */

import { CONFIG } from '../../core/config.js';
import { PieceRepository } from '../../data/repositories/piece.repository.js';
import { AMBIENTS_DATA } from '../../data/sources/ambients.data.js';

import { GetPiecesUseCase } from '../../domain/usecases/get-pieces.usecase.js';
import { GetAmbientsUseCase } from '../../domain/usecases/get-ambients.usecase.js';
import { CreateWhatsAppLinkUseCase } from '../../domain/usecases/create-whatsapp-link.usecase.js';

import { HouseShowcaseController } from './house-showcase.controller.js';
import { GalleryController } from './gallery.controller.js';
import { ModalController } from './modal.controller.js';

export class AppController {
  constructor() {
    // 1. Camada de Dados
    this.pieceRepository = new PieceRepository();
    this.ambientsDataSource = {
      getAll: () => AMBIENTS_DATA,
      getById: (id) => AMBIENTS_DATA.find(a => a.id === id) || null
    };

    // 2. Camada de Domínio (Casos de Uso)
    this.getPiecesUseCase = new GetPiecesUseCase(this.pieceRepository);
    this.getAmbientsUseCase = new GetAmbientsUseCase(this.pieceRepository, this.ambientsDataSource);
    this.createWhatsAppLinkUseCase = new CreateWhatsAppLinkUseCase(CONFIG.artisan.phoneRaw);

    // 3. Camada de Apresentação (Controladores)
    this.houseShowcaseController = new HouseShowcaseController({
      getAmbientsUseCase: this.getAmbientsUseCase,
      createWhatsAppLinkUseCase: this.createWhatsAppLinkUseCase,
    });

    this.galleryController = new GalleryController({
      getPiecesUseCase: this.getPiecesUseCase,
      createWhatsAppLinkUseCase: this.createWhatsAppLinkUseCase,
      pieceRepository: this.pieceRepository,
    });

    this.modalController = new ModalController({
      createWhatsAppLinkUseCase: this.createWhatsAppLinkUseCase,
    });
  }

  init() {
    this.setupNavbar();
    this.setupWhatsAppButtons();
    this.setupMobileMenu();
    this.setupHeroInteractions();

    // Inicializar sub-controladores
    this.houseShowcaseController.init();
    this.galleryController.init();
    this.modalController.init();

    console.log('✨ Lílian Costa - Landing Page carregada com sucesso (Clean Architecture).');
  }

  setupNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!toggle || !drawer || !overlay) return;

    const toggleMenu = () => {
      toggle.classList.toggle('active');
      drawer.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
    };

    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  setupWhatsAppButtons() {
    // Links gerais do WhatsApp
    const generalWhatsAppUrl = this.createWhatsAppLinkUseCase.forGeneralInquiry();
    const customOrderWhatsAppUrl = this.createWhatsAppLinkUseCase.forCustomOrder();

    document.querySelectorAll('[data-whatsapp="general"]').forEach(el => {
      el.href = generalWhatsAppUrl;
    });

    document.querySelectorAll('[data-whatsapp="custom"]').forEach(el => {
      el.href = customOrderWhatsAppUrl;
    });
  }

  setupHeroInteractions() {
    // Interações extras no Hero se necessário
  }
}
