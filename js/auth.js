// ================================================
//  RAÍZES DO NORDESTE – AUTENTICAÇÃO (auth.js)
// ================================================

function getUsuarioSessao() {
  const sessao = sessionStorage.getItem("usuarioLogado");
  if (!sessao) {
    return null;
  }

  try {
    return JSON.parse(sessao);
  } catch {
    return null;
  }
}

function getPontosUsuario(usuario) {
  return Number(usuario?.pontos ?? 0) || 0;
}

function atualizarPontosNaTela(pontos) {
  // Deixo essa parte separada porque os pontos aparecem em mais de um lugar na tela pro user.
  const navPoints = document.getElementById("navPoints");
  if (navPoints) {
    navPoints.textContent = `🎁 ${pontos} pts`;
  }

  const fidPoints = document.getElementById("fidPoints");
  if (fidPoints) {
    fidPoints.textContent = `${pontos} pts`;
  }
}

function adicionarPontosUsuario(pontosGanhos) {
  // Depois que testei o pedido como visitante, percebi que ele comprava,
  // mas não acumulava nada. Então deixei essa função para somar os pontos
  // na própria sessão, mesmo sem um cadastro real.
  const usuario = getUsuarioSessao();
  if (!usuario || pontosGanhos <= 0) return 0;

  const pontosAtualizados = getPontosUsuario(usuario) + pontosGanhos;
  usuario.pontos = pontosAtualizados;
  sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  atualizarPontosNaTela(pontosAtualizados);

  return pontosAtualizados;
}

// Verifica se há sessão ativa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const usuario = getUsuarioSessao();

  if (!usuario) {
    // Sem sessão → redireciona para login
    window.location.href = "pages/login.html";
    return;
  }

  const pontos = getPontosUsuario(usuario);

  // Atualiza a navbar com nome do usuário - visitante tb
  const btnUsuario = document.getElementById("navUsuario");
  if (btnUsuario) {
    const primeiroNome = usuario.nome.split(" ")[0];
    btnUsuario.textContent = `👤 ${primeiroNome}`;
  }

  atualizarPontosNaTela(pontos);
});

// Abre modal de perfil / logout
function abrirPerfilUsuario() {
  const usuario = getUsuarioSessao();
  if (!usuario) return;

  // Remove o modal - se tiver algum antesd
  const anterior = document.getElementById("modalPerfil");
  if (anterior) { anterior.remove(); return; }

  const modal = document.createElement("div");
  modal.id = "modalPerfil";
  modal.style.cssText = `
    position: fixed; top: 64px; right: 16px; z-index: 300;
    background: #fff; border: 1px solid #E8DDD0; border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,.14); padding: 18px 20px;
    min-width: 220px; animation: slideUp .2s ease both;
    font-family: 'DM Sans', sans-serif;
  `;
  modal.innerHTML = `
    <p style="font-size:13px;font-weight:700;color:#1C1208;margin-bottom:2px">
      ${usuario.nome}
    </p>
    <p style="font-size:12px;color:#9C886A;margin-bottom:14px">
      ${usuario.email || "Visitante"}
    </p>
    <div style="border-top:1px solid #E8DDD0;padding-top:12px;display:flex;flex-direction:column;gap:8px">
      <button onclick="verHistorico()" style="
        background:none;border:1px solid #E8DDD0;padding:7px 12px;
        border-radius:20px;font-size:13px;cursor:pointer;
        font-family:'DM Sans',sans-serif;color:#5C4A38;text-align:left
      ">📋 Meus pedidos</button>
      <button onclick="verFidelidade()" style="
        background:none;border:1px solid #E8DDD0;padding:7px 12px;
        border-radius:20px;font-size:13px;cursor:pointer;
        font-family:'DM Sans',sans-serif;color:#5C4A38;text-align:left
      ">🎁 Pontos de fidelidade</button>
      <button onclick="sair()" style="
        background:#FAEAE8;border:1px solid #F5C6C2;padding:7px 12px;
        border-radius:20px;font-size:13px;cursor:pointer;color:#B83227;
        font-family:'DM Sans',sans-serif;font-weight:600;text-align:left
      ">🚪 Sair da conta</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Fecha ao clicar fora
  setTimeout(() => {
    document.addEventListener("click", function fechar(e) {
      if (!modal.contains(e.target) && e.target.id !== "navUsuario") {
        modal.remove();
        document.removeEventListener("click", fechar);
      }
    });
  }, 100);
}

// ── MODAL GENÉRICO ──────────────────────────────────
function abrirModal(titulo, conteudoHTML) {
  // Remove modal anterior
  document.getElementById("modalGenerico")?.remove();
  document.getElementById("overlayModal")?.remove();

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "overlayModal";
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.45);
    z-index:400;backdrop-filter:blur(2px);
    animation:fadeIn .2s ease both;
  `;
  overlay.onclick = fecharModal;

  // Modal
  const modal = document.createElement("div");
  modal.id = "modalGenerico";
  modal.style.cssText = `
    position:fixed;top:50%;left:50%;
    transform:translate(-50%,-50%) scale(.96);
    background:#fff;border-radius:16px;
    box-shadow:0 16px 48px rgba(0,0,0,.18);
    width:90%;max-width:420px;z-index:401;
    font-family:'DM Sans',system-ui,sans-serif;
    animation:modalIn .25s ease both;
    overflow:hidden;
  `;

  modal.innerHTML = `
    <div style="
      background:#FDF6EE;border-bottom:1px solid #E8DDD0;
      padding:16px 20px;display:flex;justify-content:space-between;align-items:center;
    ">
      <h3 style="font-size:16px;font-weight:700;color:#1C1208;margin:0">${titulo}</h3>
      <button onclick="fecharModal()" style="
        background:none;border:none;font-size:20px;cursor:pointer;
        color:#9C886A;line-height:1;padding:2px 6px;border-radius:8px;
      ">✕</button>
    </div>
    <div style="padding:20px">${conteudoHTML}</div>
  `;

  // Estilos de animação (injeta uma vez)
  if (!document.getElementById("modalStyles")) {
    const style = document.createElement("style");
    style.id = "modalStyles";
    style.textContent = `
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes modalIn { from{opacity:0;transform:translate(-50%,-50%) scale(.92)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}

function fecharModal() {
  document.getElementById("modalGenerico")?.remove();
  document.getElementById("overlayModal")?.remove();
}

// ── HISTÓRICO DE PEDIDOS ─────────────────────────────
function verHistorico() {
  document.getElementById("modalPerfil")?.remove();

  const pedidos = [
    { data:"27/05/2026", itens:"Baião Burguer + Suco de Umbu", total:"R$ 37,90", status:"Entregue" },
    { data:"20/05/2026", itens:"Combo Família",                total:"R$ 89,90", status:"Entregue" },
    { data:"14/05/2026", itens:"Tapioca Nordestina + Açaí",    total:"R$ 33,00", status:"Entregue" },
  ];

  const linhas = pedidos.map(p => `
    <div style="
      border:1px solid #E8DDD0;border-radius:10px;padding:12px 14px;
      margin-bottom:10px;background:#FFF8F0;
    ">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:13px;font-weight:600;color:#1C1208">${p.itens}</span>
        <span style="
          font-size:11px;font-weight:600;color:#1E8A4C;
          background:#D3F0E2;padding:2px 8px;border-radius:10px;
        ">${p.status}</span>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="font-size:12px;color:#9C886A">${p.data}</span>
        <span style="font-size:13px;font-weight:700;color:#B83227">${p.total}</span>
      </div>
    </div>
  `).join("");

  abrirModal("📋 Meus Pedidos", `
    ${linhas}
    <p style="font-size:11px;color:#9C886A;text-align:center;margin-top:4px">
      Dados simulados — sem backend real
    </p>
  `);
}

// ── FIDELIDADE ───────────────────────────────────────
function verFidelidade() {
  document.getElementById("modalPerfil")?.remove();
  const usuario = getUsuarioSessao();
  const pts = getPontosUsuario(usuario);
  const pct = Math.min((pts / 1000) * 100, 100).toFixed(0);

  abrirModal("🎁 Programa Raízes Fiel", `
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:42px;font-weight:900;color:#D4820A;font-family:'Playfair Display',serif">
        ${pts}
      </div>
      <div style="font-size:13px;color:#9C886A">pontos acumulados</div>
    </div>

    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#9C886A;margin-bottom:4px">
        <span>Progresso para nível VIP</span><span>${pts}/1000</span>
      </div>
      <div style="height:8px;background:#E8DDD0;border-radius:8px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#B83227,#D4820A);border-radius:8px;transition:width .5s"></div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px">
      ${[
        ["200 pts", "R$ 5,00 de desconto",  pts >= 200],
        ["500 pts", "Item grátis à escolha", pts >= 500],
        ["1000 pts","Acesso VIP + brinde",   pts >= 1000],
      ].map(([req, ben, ok]) => `
        <div style="
          display:flex;justify-content:space-between;align-items:center;
          border:1px solid ${ok ? "#A8D5BA" : "#E8DDD0"};
          background:${ok ? "#D3F0E2" : "#fff"};
          border-radius:10px;padding:10px 14px;
        ">
          <span style="font-size:13px;color:#1C1208">${ben}</span>
          <span style="
            font-size:12px;font-weight:700;
            color:${ok ? "#1E8A4C" : "#9C886A"};
            background:${ok ? "transparent" : "#F5EDE0"};
            padding:2px 10px;border-radius:10px;
          ">${ok ? "✓ Disponível" : req}</span>
        </div>
      `).join("")}
    </div>

    <p style="font-size:11px;color:#9C886A;text-align:center;margin-top:14px">
      Dados simulados — sem backend real
    </p>
  `);
}

function sair() {
  sessionStorage.removeItem("usuarioLogado");
  window.location.href = "pages/login.html";
}
