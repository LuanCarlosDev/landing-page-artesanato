/**
 * Caso de Uso: Obter e Filtrar Peças
 */

export class GetPiecesUseCase {
  constructor(pieceRepository) {
    this.pieceRepository = pieceRepository;
  }

  execute({ category = 'all', ambientId = null, query = '', featuredOnly = false } = {}) {
    let pieces = this.pieceRepository.getAll();

    if (category && category !== 'all') {
      pieces = pieces.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (ambientId) {
      pieces = pieces.filter(p => p.ambientId === ambientId);
    }

    if (featuredOnly) {
      pieces = pieces.filter(p => p.featured);
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      pieces = pieces.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.materials.some(m => m.toLowerCase().includes(q))
      );
    }

    return pieces;
  }
}
