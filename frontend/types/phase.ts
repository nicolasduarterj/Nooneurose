export type Phase =
  | 'black'    // tela preta inicial
  | 'fadein'   // conteúdo surge
  | 'idle'     // esperando interação
  | 'leaving'; // navegando