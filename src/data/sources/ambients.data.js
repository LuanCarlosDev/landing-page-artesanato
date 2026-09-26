/**
 * Fonte de Dados: Ambientes Planejados
 * Ambientes com peças autorais integradas.
 */

export const AMBIENTS_DATA = [
  {
    id: 'sala-estar',
    name: 'Sala de Estar & Nichos',
    shortName: 'Sala de Estar',
    subtitle: 'Aconchego, Madeira Nobre & Formas Vivas',
    tagline: 'Onde o olhar descansa e o design orgânico acolhe as suas melhores memórias.',
    description: 'Neste espaço de convivência, criei a mesa lateral esculpida em bloco maciço para dialogar com o vaso escultural e as treliças botânicas, compondo uma atmosfera serena e acolhedora.',
    image: './src/assets/ambients/casa-sala-estar.webp',
    atmosphere: 'Luz da tarde filtrada, reboco cal natural e acolhimento orgânico.',
    cameraAngle: { rotateX: 2, rotateY: -3, scale: 1 },
    featuredPieceIds: [
      'piece-1', // mesa lateral
      'piece-2', // trio floreiras
      'piece-8', // vaso bicolor bambu
      'piece-9', // garrafa boho pampas
      'piece-11' // porta-objetos sisal
    ]
  },
  {
    id: 'mesa-jantar',
    name: 'Mesa Posta & Gourmet',
    shortName: 'Mesa Posta',
    subtitle: 'O Coração do Encontro em Família',
    tagline: 'Refeições que se transformam em rituais de afeto, beleza e presença.',
    description: 'Para a mesa, teço ponto a ponto sousplats e porta-guardanapos em macramê rubi e terracota, acompanhados de centros de mesa florais delicados que unem quem se senta ao redor.',
    image: './src/assets/ambients/casa-mesa-jantar.webp',
    atmosphere: 'Aroma de café fresco, linho puro e cerâmica afetiva.',
    cameraAngle: { rotateX: 4, rotateY: 2, scale: 1.02 },
    featuredPieceIds: [
      'piece-4', // kit mesa posta rubi
      'piece-5', // sousplat terracota
      'piece-10' // vaso rosas douradas
    ]
  },
  {
    id: 'quarto',
    name: 'Quarto & Refúgio',
    shortName: 'Quarto',
    subtitle: 'Silêncio, Fibras Suaves & Harmonia',
    tagline: 'Um santuário pessoal idealizado com paz, textura e calma.',
    description: 'No refúgio do repouso, flâmulas suspensas em madeira nobre e bambu trazem leveza acústica e visual, enquanto mandalas botânicas e anjos guardiões selam o ambiente com tranquilidade.',
    image: './src/assets/ambients/casa-quarto.webp',
    atmosphere: 'Luz matinal suave, tecidos naturais e tranquilidade contemplativa.',
    cameraAngle: { rotateX: -2, rotateY: -4, scale: 1 },
    featuredPieceIds: [
      'piece-3', // mandala sementes e sisal
      'piece-6', // flâmula solar amarela
      'piece-7', // flâmula verde menta
      'piece-16' // anjo guardião
    ]
  }
];
