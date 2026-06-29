let carrinho = {};
let formaPagamento = "PIX";
let pontosDoUltimoPedido = 0;

function totalItens() {
  return Object.values(carrinho).reduce((acc, qtd) => acc + qtd, 0);
}

function subtotal() {
  return CARDAPIO
    .filter(produto => carrinho[produto.id])
    .reduce((acc, produto) => acc + produto.preco * carrinho[produto.id], 0);
}

function pontosClienteAtual() {
  const sessao = localStorage.getItem("usuarioLogado") || sessionStorage.getItem("usuarioLogado");
  if (!sessao) return 0;

  try {
    const usuario = JSON.parse(sessao);
    return Number(usuario.pontos) || 0;
  } catch {
    return 0;
  }
}

function calcularDesconto() {
  return pontosClienteAtual() >= 200 && totalItens() > 0 ? -5.00 : 0;
}

function totalFinal() {
  return subtotal() + calcularDesconto();
}

function calcularPontosPedido(valorPedido) {
  return Math.floor(valorPedido);
}

function renderizarCarrinho() {
  const itens = CARDAPIO.filter(produto => carrinho[produto.id]);
  const elItems = document.getElementById("cartItems");
  const elFooter = document.getElementById("cartFooter");

  if (itens.length === 0) {
    elItems.innerHTML = `<p class="cart-vazio">Seu carrinho está vazio.<br>Adicione itens do cardápio!</p>`;
  } else {
    elItems.innerHTML = itens.map(produto => `
      <div class="cart-item">
        <img class="cart-item-img" src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
        <div class="cart-item-info">
          <div class="cart-item-name">${produto.nome}</div>
          <div class="cart-item-price">R$ ${(produto.preco * carrinho[produto.id]).toFixed(2).replace(".", ",")}</div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="alterarQtd(${produto.id}, -1)">-</button>
          <span class="qty-num">${carrinho[produto.id]}</span>
          <button class="qty-btn" onclick="alterarQtd(${produto.id}, +1)">+</button>
        </div>
      </div>
    `).join("");
  }

  const desc = calcularDesconto();
  const pontosCliente = pontosClienteAtual();
  const podeResgatar = pontosCliente >= 200;

  elFooter.innerHTML = `
    <div class="pay-label">Forma de pagamento</div>
    <div class="pay-methods">
      ${FORMAS_PAGAMENTO.map(forma => `
        <div class="pay-method ${formaPagamento === forma ? "active" : ""}"
             onclick="selecionarPagamento('${forma}')">
          ${forma}
        </div>
      `).join("")}
    </div>

    <div class="total-row"><span>Subtotal</span><span>R$ ${subtotal().toFixed(2).replace(".", ",")}</span></div>
    ${podeResgatar && itens.length > 0 ? `
    <div class="total-row discount"><span>Desconto fidelidade (${pontosCliente} pts)</span><span>-R$ 5,00</span></div>
    ` : ""}
    ${!podeResgatar && pontosCliente > 0 && itens.length > 0 ? `
    <div class="total-row"><span>Fidelidade</span><span>Faltam ${200 - pontosCliente} pts</span></div>
    ` : ""}
    <div class="total-row big"><span>Total</span><span>R$ ${totalFinal().toFixed(2).replace(".", ",")}</span></div>

    <div class="lgpd-nota">
      Seus dados de pagamento são processados por gateway externo certificado (PCI-DSS).
      Conforme a <strong>LGPD (Lei 13.709/2018)</strong>, não armazenamos dados de cartão.
      <a href="pages/privacidade.html" target="_blank">Ver política de privacidade</a>
    </div>

    <button class="pay-btn"
            onclick="finalizarPedido()"
            ${itens.length === 0 ? "disabled" : ""}>
      ${itens.length === 0 ? "Adicione itens" : `Confirmar e pagar via ${formaPagamento}`}
    </button>
  `;

  document.getElementById("cartBadge").textContent = totalItens();
}

function adicionarItem(id, ev) {
  carrinho[id] = (carrinho[id] || 0) + 1;
  document.getElementById("cartBadge").textContent = totalItens();

  const btn = ev?.currentTarget;
  if (btn) {
    btn.textContent = "Adicionado";
    setTimeout(() => { btn.textContent = "+ Pedir"; }, 900);
  }
}

function alterarQtd(id, delta) {
  carrinho[id] = (carrinho[id] || 0) + delta;
  if (carrinho[id] <= 0) delete carrinho[id];
  renderizarCarrinho();
}

function selecionarPagamento(forma) {
  formaPagamento = forma;
  renderizarCarrinho();
}

function abrirCarrinho() {
  renderizarCarrinho();
  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}

function fecharCarrinho() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function finalizarPedido() {
  if (totalItens() === 0) return;

  // Guarda a base dos pontos antes de esvaziar o carrinho.
  const valorPontuavel = subtotal();
  pontosDoUltimoPedido = calcularPontosPedido(valorPontuavel);
  if (typeof adicionarPontosUsuario === "function") {
    adicionarPontosUsuario(pontosDoUltimoPedido);
  }

  fecharCarrinho();
  carrinho = {};
  document.getElementById("cartBadge").textContent = 0;

  document.getElementById("mainContent").style.display = "none";
  document.getElementById("statusScreen").style.display = "block";

  exibirStatus(0);

  [1500, 3500, 6000].forEach((tempo, i) => {
    setTimeout(() => exibirStatus(i + 1), tempo);
  });
}

function exibirStatus(passo) {
  const track = document.getElementById("statusTrack");
  const note = document.getElementById("statusNote");

  track.innerHTML = PASSOS_STATUS.map((status, i) => {
    const feito = i < passo;
    const ativo = i === passo;
    const ultimo = i === PASSOS_STATUS.length - 1;
    return `
      <div class="status-step">
        <div class="step-col">
          <div class="step-dot ${feito ? "done" : ""} ${ativo ? "active" : ""}">
            ${feito ? "OK" : ativo ? "..." : i + 1}
          </div>
          ${!ultimo ? `<div class="step-line ${feito ? "done" : ""}"></div>` : ""}
        </div>
        <div class="step-info">
          <div class="step-name">${status.nome}</div>
          <div class="step-sub">${i <= passo ? status.sub : "Aguardando..."}</div>
        </div>
      </div>
    `;
  }).join("");

  if (passo >= PASSOS_STATUS.length - 1) {
    note.innerHTML = `
      <span style="color:var(--green);font-weight:700">Pedido pronto. Bom apetite!</span>
      ${pontosDoUltimoPedido > 0 ? `<br><span>Você ganhou ${pontosDoUltimoPedido} pts neste pedido.</span>` : ""}
    `;
  } else {
    note.textContent = "Atualizando automaticamente...";
  }
}

function voltarMenu() {
  document.getElementById("statusScreen").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}
