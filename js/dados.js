// Dados usados pela demo. Quando entrar um backend, este arquivo vira a ponte
// entre a API e a tela, mantendo os nomes das propriedades.

const UNIDADES = [
  "Fortaleza - CE",
  "Recife - PE",
  "Salvador - BA",
  "Natal - RN",
  "João Pessoa - PB",
];

const CATEGORIAS = ["Todos", "Lanches", "Bebidas", "Sobremesas", "Combos"];

const CARDAPIO = [
  {
    id: 1,
    nome: "Baião Burguer",
    descricao: "Pão de beiju, carne nordestina, queijo coalho e vinagrete",
    preco: 28.90,
    imagem: "assets/img/baiao-burguer.svg",
    categoria: "Lanches",
    promo: false,
  },
  {
    id: 2,
    nome: "Cuscuz Combo",
    descricao: "Cuscuz, paçoca, queijo de manteiga e suco da casa",
    preco: 22.50,
    imagem: "assets/img/cuscuz-combo.svg",
    categoria: "Lanches",
    promo: true,
  },
  {
    id: 3,
    nome: "Tapioca Nordestina",
    descricao: "Tapioca recheada com frango, baião de dois e cheiro-verde",
    preco: 18.00,
    imagem: "assets/img/tapioca-nordestina.svg",
    categoria: "Lanches",
    promo: false,
  },
  {
    id: 4,
    nome: "Caldinho de Feijão",
    descricao: "Feijão cremoso com torresmo crocante e tempero de casa",
    preco: 12.00,
    imagem: "assets/img/caldinho-feijao.svg",
    categoria: "Lanches",
    promo: false,
  },
  {
    id: 5,
    nome: "Combo Família",
    descricao: "2 lanches, 2 bebidas e 2 sobremesas para dividir",
    preco: 89.90,
    imagem: "assets/img/combo-familia.svg",
    categoria: "Combos",
    promo: true,
  },
  {
    id: 6,
    nome: "Combo Duplo",
    descricao: "2 Baião Burguers com 2 sucos naturais",
    preco: 54.90,
    imagem: "assets/img/combo-duplo.svg",
    categoria: "Combos",
    promo: false,
  },
  {
    id: 7,
    nome: "Açaí do Sertão",
    descricao: "Açaí com tapioca granulada, banana e mel de abelha",
    preco: 15.00,
    imagem: "assets/img/acai-sertao.svg",
    categoria: "Sobremesas",
    promo: false,
  },
  {
    id: 8,
    nome: "Rapadura Gelada",
    descricao: "Sorvete de rapadura com amendoim torrado",
    preco: 10.00,
    imagem: "assets/img/rapadura-gelada.svg",
    categoria: "Sobremesas",
    promo: false,
  },
  {
    id: 9,
    nome: "Bolo de Rolo",
    descricao: "Fatia de bolo de rolo pernambucano com calda de goiaba",
    preco: 12.50,
    imagem: "assets/img/bolo-rolo.svg",
    categoria: "Sobremesas",
    promo: true,
  },
  {
    id: 10,
    nome: "Suco de Umbu",
    descricao: "Suco natural de umbu gelado - 400 ml",
    preco: 9.00,
    imagem: "assets/img/suco-umbu.svg",
    categoria: "Bebidas",
    promo: false,
  },
  {
    id: 11,
    nome: "Caldo de Cana",
    descricao: "Caldo de cana gelado com limão e gengibre",
    preco: 7.00,
    imagem: "assets/img/caldo-cana.svg",
    categoria: "Bebidas",
    promo: false,
  },
  {
    id: 12,
    nome: "Suco de Siriguela",
    descricao: "Suco natural de siriguela fresco - 400 ml",
    preco: 9.50,
    imagem: "assets/img/suco-siriguela.svg",
    categoria: "Bebidas",
    promo: true,
  },
];

const FORMAS_PAGAMENTO = ["PIX", "Cartão de Crédito", "VR / VA", "Dinheiro"];

const PASSOS_STATUS = [
  { nome: "Pedido recebido",       sub: "Confirmado com sucesso" },
  { nome: "Pagamento aprovado",    sub: "Processado pelo gateway externo" },
  { nome: "Em preparo na cozinha", sub: "Equipe Raízes cuidando do seu pedido" },
  { nome: "Pronto para retirada",  sub: "Retire no balcão. Bom apetite!" },
];
