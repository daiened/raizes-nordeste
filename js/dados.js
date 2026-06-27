// ================================================
//  RAÍZES DO NORDESTE – DADOS MOCKADOS (dados.js)
// ================================================

const UNIDADES = [
  "Fortaleza – CE",
  "Recife – PE",
  "Salvador – BA",
  "Natal – RN",
  "João Pessoa – PB",
];

const CATEGORIAS = ["Todos", "Lanches", "Bebidas", "Sobremesas", "Combos"];

const CARDAPIO = [
  {
    id: 1,
    nome: "Baião Burguer",
    descricao: "Pão de beiju, carne nordestina, queijo coalho e vinagrete",
    preco: 28.90,
    emoji: "🍔",
    categoria: "Lanches",
    promo: false,
  },
  {
    id: 2,
    nome: "Cuscuz Combo",
    descricao: "Cuscuz + paçoca + queijo de manteiga + suco",
    preco: 22.50,
    emoji: "🌽",
    categoria: "Lanches",
    promo: true,
  },
  {
    id: 3,
    nome: "Tapioca Nordestina",
    descricao: "Tapioca recheada com frango + baião de dois",
    preco: 18.00,
    emoji: "🫓",
    categoria: "Lanches",
    promo: false,
  },
  {
    id: 4,
    nome: "Caldinho de Feijão",
    descricao: "Feijão cremoso com torresmo crocante",
    preco: 12.00,
    emoji: "🥣",
    categoria: "Lanches",
    promo: false,
  },
  {
    id: 5,
    nome: "Combo Família",
    descricao: "2 lanches + 2 bebidas + 2 sobremesas – vale muito!",
    preco: 89.90,
    emoji: "🎁",
    categoria: "Combos",
    promo: true,
  },
  {
    id: 6,
    nome: "Combo Duplo",
    descricao: "2 Baião Burguers + 2 sucos",
    preco: 54.90,
    emoji: "🍱",
    categoria: "Combos",
    promo: false,
  },
  {
    id: 7,
    nome: "Açaí do Sertão",
    descricao: "Açaí com tapioca granulada e mel de abelha",
    preco: 15.00,
    emoji: "🫐",
    categoria: "Sobremesas",
    promo: false,
  },
  {
    id: 8,
    nome: "Rapadura Gelada",
    descricao: "Sorvete de rapadura com amendoim torrado",
    preco: 10.00,
    emoji: "🍨",
    categoria: "Sobremesas",
    promo: false,
  },
  {
    id: 9,
    nome: "Bolo de Rolo",
    descricao: "Fatia de bolo de rolo pernambucano com calda de goiaba",
    preco: 12.50,
    emoji: "🍰",
    categoria: "Sobremesas",
    promo: true,
  },
  {
    id: 10,
    nome: "Suco de Umbu",
    descricao: "Suco natural de umbu gelado – 400ml",
    preco: 9.00,
    emoji: "🥤",
    categoria: "Bebidas",
    promo: false,
  },
  {
    id: 11,
    nome: "Caldo de Cana",
    descricao: "Caldo de cana gelado com limão e gengibre",
    preco: 7.00,
    emoji: "🍹",
    categoria: "Bebidas",
    promo: false,
  },
  {
    id: 12,
    nome: "Suco de Siriguela",
    descricao: "Suco natural de siriguela fresco – 400ml",
    preco: 9.50,
    emoji: "🧃",
    categoria: "Bebidas",
    promo: true,
  },
];

const FORMAS_PAGAMENTO = ["PIX", "Cartão de Crédito", "VR / VA", "Dinheiro"];

const PASSOS_STATUS = [
  { nome: "Pedido recebido",       sub: "Confirmado com sucesso" },
  { nome: "Pagamento aprovado",    sub: "Processado pelo gateway externo" },
  { nome: "Em preparo na cozinha", sub: "Equipe Raízes preparando com carinho" },
  { nome: "Pronto para retirada",  sub: "Retire no balcão – bom apetite! 🌟" },
];
