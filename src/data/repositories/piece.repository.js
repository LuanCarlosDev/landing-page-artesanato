/**
 * Repositório de Peças: Implementação de acesso a dados
 */

import { Piece } from '../../domain/models/piece.model.js';
import { PIECES_DATA } from '../sources/pieces.data.js';

export class PieceRepository {
  constructor() {
    this.pieces = PIECES_DATA.map(item => new Piece(item));
  }

  getAll() {
    return [...this.pieces];
  }

  getById(id) {
    return this.pieces.find(p => p.id === id) || null;
  }

  getBySlug(slug) {
    return this.pieces.find(p => p.slug === slug) || null;
  }

  getByCategory(category) {
    if (!category || category === 'all') return this.getAll();
    return this.pieces.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  getByAmbient(ambientId) {
    return this.pieces.filter(p => p.ambientId === ambientId);
  }

  getCategories() {
    const counts = {};
    this.pieces.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count
    }));
  }
}
