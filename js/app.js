// ================================================
//  RAÍZES DO NORDESTE – APP PRINCIPAL (app.js)
// ================================================

// Guardei o estado principal aqui para não ficar procurando valor solto pela tela.
const estado = {
  lgpdAceito: false,
  canal: "App",
  unidade: UNIDADES[0],
  categoria: "Todos",
  busca: "",
  totemModo: null,
};

/* ---- INICIALIZAÇÃO ---- */
document.addEventListener("DOMContentLoaded", () => {
  renderizarUnidades();
  renderizarCategorias();
  renderizarProdutos();
});

/* ---- LGPD ---- */
function aceitarLGPD() {
  estado.lgpdAceito = true;
  const bar = document.getElementById("lgpdBar");
  bar.style.transition = "opacity .4s";
  bar.style.opacity = "0";
  setTimeout(() => bar.remove(), 400);
}

/* ---- CANAL ---- */
function getBannerTotemHTML() {
  return `
    🖥️ <strong>Modo Totem</strong> — Como deseja receber seu pedido?
    <button onclick="setTotemModo('balcao')">🥡 Retirar no balcão</button>
    <button onclick="setTotemModo('mesa')">🪑 Comer aqui</button>
  `;
}

function setCanal(canal) {
  estado.canal = canal;
  estado.totemModo = null; // reseta a escolha quandso troca de canal

  // Atualiza abas visuais
  document.querySelectorAll(".canal-tab").forEach(t => t.classList.remove("active"));
  document.getElementById(`tab-${canal}`).classList.add("active");

  // Totem banner: mostra e restaura o conteúdo original
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
  const label = modo === "balcao" ? "🥡 Retirada no balcão" : "🪑 Comer no local";
  const banner = document.getElementById("totemBanner");
  banner.innerHTML = `
    🖥️ <strong>Modo Totem</strong> — ${label}
    <button onclick="resetTotemModo()" style="font-size:11px;padding:3px 10px;margin-left:8px">
      🔄 Mudar
    </button>
  `;
}

function resetTotemModo() {
  estado.totemModo = null;
  const banner = document.getElementById("totemBanner");
  banner.innerHTML = getBannerTotemHTML();
}

/* ---- UNIDADES ---- */
function renderizarUnidades() {
  const el = document.getElementById("unitRow");
  el.innerHTML = UNIDADES.map(u => `
    <button class="unit-btn ${estado.unidade === u ? "active" : ""}"
            onclick="setUnidade('${u}')">
      ${u}
    </button>
  `).join("");
}

function setUnidade(unidade) {
  estado.unidade = unidade;
  renderizarUnidades();
  renderizarProdutos(); // cardápio pode variar por unidade
}

/* ---- CATEGORIAS ---- */
function renderizarCategorias() {
  const el = document.getElementById("catRow");
  el.innerHTML = CATEGORIAS.map(c => `
    <button class="cat-btn ${estado.categoria === c ? "active" : ""}"
            onclick="setCategoria('${c}')">
      ${iconeCategoria(c)} ${c}
    </button>
  `).join("");
}

function iconeCategoria(cat) {
  const icons = { Todos: "🍽️", Lanches: "🍔", Bebidas: "🥤", Sobremesas: "🍨", Combos: "📦" };
  return icons[cat] || "";
}

function setCategoria(cat) {
  estado.categoria = cat;
  renderizarCategorias();
  renderizarProdutos();
}

/* ---- BUSCA ---- */
function filtrarCardapio() {
  // Busca simples mesmo: nome ou descrição já resolve bem para esse protótipo.
  estado.busca = document.getElementById("searchInput").value.toLowerCase();
  renderizarProdutos();
}

/* ---- PRODUTOS ---- */
function renderizarProdutos() {
  const el = document.getElementById("produtosGrid");

  const filtrados = CARDAPIO.filter(p => {
    const matchCat = estado.categoria === "Todos" || p.categoria === estado.categoria;
    const matchBusca = p.nome.toLowerCase().includes(estado.busca) ||
                       p.descricao.toLowerCase().includes(estado.busca);
    return matchCat && matchBusca;
  });

  if (filtrados.length === 0) {
    el.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🔍</div>
        <p>Nenhum item encontrado.<br>Tente outro termo ou categoria.</p>
      </div>
    `;
    return;
  }

  el.innerHTML = filtrados.map((p, idx) => `
    <div class="produto-card" style="animation-delay:${idx * 0.04}s">
      <div class="card-img">
        ${p.promo ? `<span class="promo-tag">🎉 Promo</span>` : ""}
        <span>${p.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-name">${p.nome}</div>
        <div class="card-desc">${p.descricao}</div>
        <div class="card-footer">
          <span class="card-price">R$ ${p.preco.toFixed(2).replace(".", ",")}</span>
          <button class="card-add-btn" onclick="adicionarItem(${p.id}, event)">+ Pedir</button>
        </div>
      </div>
    </div>
  `).join("");
}

/* ---- MENU MOBILE (hamburguer) ---- */
function toggleMenu() {
  // Abre o carrinho como menu principal no mobile
  abrirCarrinho();
}
