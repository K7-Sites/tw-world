// Transcrição autorizada, na ordem editorial da Home.
const reviews = [
  {
    author: "Danillo Henrique",
    quote:
      "Sem comentários, melhores lembro possíveis e imagináveis como aluno e agora como pai de aluna...\n24 anos depois voltando com toda tranquilidade do mundo que estou colocando minha filha no melhor curso de idiomas da região.",
    url: "https://share.google/TLfIOoT2qG6fj3RZx",
  },
  {
    author: "Alba Batista",
    quote:
      "Iniciando com duas colônia de férias on-line e após à pandemia presencial, achamos o ambiente acolhedor.\nApesar de conhecermos o ensino do Transword há 13 anos dentro do Colégio Imaculada Conceição.\nIndico com certeza o Transword.",
    url: "https://share.google/3rWKFiDfUTSZ7zaba",
  },
  {
    author: "Maria luísa",
    quote:
      "Minha experiência foi ótima, a escola tem um ótimo método de ensino, muito divertido e fácil de aprender.",
    url: "https://share.google/77L30KjNYjljkXrSq",
  },
  {
    author: "Otaviano Júnior",
    quote: "Excelente ensino com metodologia incrível.\nPesquisei muitos até chegar aqui",
    url: "https://share.google/ic1jF0c82ZZhFaeEr",
  },
  {
    author: "fabio feliciano",
    quote:
      "Uma escola ótimo! Muito acolhedora, além de ensinar muito bem os idiomas de uma forma divertida",
    url: "https://share.google/4o2NwkEMnpWIEDKwo",
  },
  {
    author: "Isabella Vasco",
    quote:
      "Muito bom, tive ótimas experiências. Tem aulas para todos os gostos. Ótimos professores, super legais.",
    url: "https://share.google/362JwdkQVl8wLJjlw",
  },
  {
    author: "Sofia Porto",
    quote:
      "A minha experiência é maravilhosa. Eu aprendo coisas novas todos os dias. Gosto muito daqui!",
    url: "https://share.google/wtUrlvgX2wNFpMpoq",
  },
];

export default reviews.map((review, index) => ({
  ...review,
  order: index + 1,
  rating: 5,
  source: "Google",
  approved: true,
}));
