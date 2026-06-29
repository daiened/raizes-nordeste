// Estado da tela. Fica aqui porque quase tudo neste prototipo gira em torno
// desses filtros e do canal de atendimento escolhido.
const estado = {
  lgpdAceito: false,
  canal: "App",
  unidade: UNIDADES[0],
  categoria: "Todos",
  busca: "",
  totemModo: null,
};

document.addEventListener("DOMContentLoaded", () => {
  renderizarUnidades();
  renderizarCategorias();
  renderizarProdutos();
});

function aceitarLGPD() {
  estado.lgpdAceito = true;
  const bar = document.getElementById("lgpdBar");
  bar.style.transition = "opacity .4s";
  bar.style.opacity = "0";
  setTimeout(() => bar.remove(), 400);
}

function getBannerTotemHTML() {
  return `
    <strong>Modo Totem</strong> - Como deseja receber seu pedido?
    <button onclick="setTotemModo('balcao')">Retirar no balcão</button>
    <button onclick="setTotemModo('mesa')">Comer aqui</button>
  `;
}

function setCanal(canal) {
  estado.canal = canal;
  estado.totemModo = null;

  document.querySelectorAll(".canal-tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(`tab-${canal}`).classList.add("active");

  const banner = document.getElementById("totemBanner");
  if (canal === "Totem") {
    banner.innerHTML = getBannerTotemHTML();
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
  }
}

function setTotemModo(modo) {
  estado.totemModo = modo;
  const label = modo === "balcao" ? "Retirada no balcão" : "Comer no local";
  const banner = document.getElementById("totemBanner");
  banner.innerHTML = `
    <strong>Modo Totem</strong> - ${label}
    <button onclick="resetTotemModo()" style="font-size:11px;padding:3px 10px;margin-left:8px">
      Mudar
    </button>
  `;
}

function resetTotemModo() {
  estado.totemModo = null;
  document.getElementById("totemBanner").innerHTML = getBannerTotemHTML();
}

function renderizarUnidades() {
  const el = document.getElementById("unitRow");
  el.innerHTML = UNIDADES.map(unidade => `
    <button class="unit-btn ${estado.unidade === unidade ? "active" : ""}"
            onclick="setUnidade('${unidade}')">
      ${unidade}
    </button>
  `).join("");
}

function setUnidade(unidade) {
  estado.unidade = unidade;
  renderizarUnidades();
  renderizarProdutos();
}

function renderizarCategorias() {
  const el = document.getElementById("catRow");
  el.innerHTML = CATEGORIAS.map(categoria => `
    <button class="cat-btn ${estado.categoria === categoria ? "active" : ""}"
            onclick="setCategoria('${categoria}')">
      ${categoria}
    </button>
  `).join("");
}

function setCategoria(categoria) {
  estado.categoria = categoria;
  renderizarCategorias();
  renderizarProdutos();
}

function filtrarCardapio() {
  estado.busca = document.getElementById("searchInput").value.toLowerCase();
  renderizarProdutos();
}

function renderizarProdutos() {
  const el = document.getElementById("produtosGrid");

  const filtrados = CARDAPIO.filter(produto => {
    const mesmaCategoria = estado.categoria === "Todos" || produto.categoria === estado.categoria;
    const termoEncontrado = produto.nome.toLowerCase().includes(estado.busca) ||
                            produto.descricao.toLowerCase().includes(estado.busca);
    return mesmaCategoria && termoEncontrado;
  });

  if (filtrados.length === 0) {
    el.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">Sem resultados</div>
        <p>Nenhum item encontrado.<br>Tente outro termo ou categoria.</p>
      </div>
    `;
    return;
  }

  el.innerHTML = filtrados.map((produto, idx) => `
    <div class="produto-card" style="animation-delay:${idx * 0.04}s">
      <div class="card-img">
        ${produto.promo ? `<span class="promo-tag">Promo</span>` : ""}
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-name">${produto.nome}</div>
        <div class="card-desc">${produto.descricao}</div>
        <div class="card-footer">
          <span class="card-price">R$ ${produto.preco.toFixed(2).replace(".", ",")}</span>
          <button class="card-add-btn" onclick="adicionarItem(${produto.id}, event)">+ Pedir</button>
        </div>
      </div>
    </div>
  `).join("");
}

function toggleMenu() {
  abrirCarrinho();
}
