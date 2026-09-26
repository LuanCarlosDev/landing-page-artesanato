/**
 * Entidade de Domínio: Peça Artesanal Única
 */

export class Piece {
  constructor({
    id,
    slug,
    title,
    subtitle,
    category,
    ambientId,
    description,
    artisticConcept,
    materials = [],
    dimensions,
    techniques = [],
    imageWebp,
    imageJpg,
    ambientPosition = { x: 50, y: 50 }, // posição percentual relativa no ambiente da casa
    featured = false,
    badge = 'Peça Única',
  }) {
    this.id = id;
    this.slug = slug;
    this.title = title;
    this.subtitle = subtitle;
    this.category = category;
    this.ambientId = ambientId;
    this.description = description;
    this.artisticConcept = artisticConcept;
    this.materials = materials;
    this.dimensions = dimensions;
    this.techniques = techniques;
    this.imageWebp = imageWebp;
    this.imageJpg = imageJpg;
    this.ambientPosition = ambientPosition;
    this.featured = featured;
    this.badge = badge;
  }
}
