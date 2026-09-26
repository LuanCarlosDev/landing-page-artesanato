/**
 * Caso de Uso: Obter Ambientes da Casa e suas Peças Associadas
 */

export class GetAmbientsUseCase {
  constructor(pieceRepository, ambientsDataSource) {
    this.pieceRepository = pieceRepository;
    this.ambientsDataSource = ambientsDataSource;
  }

  execute() {
    const ambients = this.ambientsDataSource.getAll();
    return ambients.map(ambient => {
      const pieces = ambient.featuredPieceIds
        .map(id => this.pieceRepository.getById(id))
        .filter(Boolean);
      return {
        ...ambient,
        pieces,
      };
    });
  }

  getById(id) {
    const ambient = this.ambientsDataSource.getById(id);
    if (!ambient) return null;
    const pieces = ambient.featuredPieceIds
      .map(pId => this.pieceRepository.getById(pId))
      .filter(Boolean);
    return {
      ...ambient,
      pieces,
    };
  }
}
