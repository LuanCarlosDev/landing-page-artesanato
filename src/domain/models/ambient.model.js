/**
 * Entidade de Domínio: Ambiente da Casa (Cash App Style Showcase)
 */

export class Ambient {
  constructor({
    id,
    name,
    title,
    tagline,
    image,
    description,
    atmosphere,
    cameraAngle = { rotateX: 3, rotateY: -4, scale: 1 },
    featuredPieceIds = [],
  }) {
    this.id = id;
    this.name = name;
    this.title = title;
    this.tagline = tagline;
    this.image = image;
    this.description = description;
    this.atmosphere = atmosphere;
    this.cameraAngle = cameraAngle;
    this.featuredPieceIds = featuredPieceIds;
  }
}
