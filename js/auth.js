const USUARIO_KEY = "usuarioLogado";

function salvarUsuarioSessao(usuario) {
  const dados = JSON.stringify(usuario);
  localStorage.setItem(USUARIO_KEY, dados);
  sessionStorage.setItem(USUARIO_KEY, dados);
}

function limparUsuarioSessao() {
  localStorage.removeItem(USUARIO_KEY);
  sessionStorage.removeItem(USUARIO_KEY);
}

function lerUsuarioSalvo() {
  return localStorage.getItem(USUARIO_KEY) || sessionStorage.getItem(USUARIO_KEY);
}

function getUsuarioDaUrl() {
  const params = new URLSearchParams(window.location.search);
  const dados = params.get("usuario");
  if (!dados) return null;

  try {
    return JSON.parse(dados);
  } catch {
    return null;
  }
}

function limparUsuarioDaUrl() {
  if (!window.location.search.includes("usuario=")) return;
  window.history.replaceState({}, document.title, window.location.pathname);
}

function getUsuarioSessao() {
  const sessao = lerUsuarioSalvo();
  if (!sessao) return null;

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
  const navPoints = document.getElementById("navPoints");
  if (navPoints) {
    navPoints.textContent = `${pontos} pts`;
  }

  const fidPoints = document.getElementById("fidPoints");
  if (fidPoints) {
    fidPoints.textContent = `${pontos} pts`;
  }
}

function adicionarPontosUsuario(pontosGanhos) {
  const usuario = getUsuarioSessao();
  if (!usuario || pontosGanhos <= 0) return 0;

  const pontosAtualizados = getPontosUsuario(usuario) + pontosGanhos;
  usuario.pontos = pontosAtualizados;
  salvarUsuarioSessao(usuario);
  atualizarPontosNaTela(pontosAtualizados);

  return pontosAtualizados;
}

document.addEventListener("DOMContentLoaded", () => {
  let usuario = getUsuarioSessao();
  if (!usuario) {
    usuario = getUsuarioDaUrl();
    if (usuario) {
      salvarUsuarioSessao(usuario);
      limparUsuarioDaUrl();
    }
  }

  if (!usuario) {
    window.location.href = "pages/login.html";
    return;
  }

  const pontos = getPontosUsuario(usuario);
  const btnUsuario = document.getElementById("navUsuario");
  if (btnUsuario) {
    const primeiroNome = usuario.nome.split(" ")[0];
    btnUsuario.textContent = primeiroNome;
  }

  atualizarPontosNaTela(pontos);
});

function abrirPerfilUsuario() {
  const usuario = getUsuarioSessao();
  if (!usuario) return;

  const anterior = document.getElementById("modalPerfil");
  if (anterior) { anterior.remove(); return; }

  const modal = document.createElement("div");
  modal.id = "modalPerfil";
  modal.style.cssText = `
    position: fixed; top: 64px; right: 16px; z-index: 300;
    background: #ffffff; border: 1px solid #E8D8C7; border-radius: 8px;
    box-shadow: 0 12px 30px rgba(43,29,22,.12); padding: 18px 20px;
    min-width: 220px; animation: slideUp .2s ease both;
    font-family: 'Inter', system-ui, sans-serif;
  `;
  modal.innerHTML = `
    <p style="font-size:13px;font-weight:700;color:#2B1D16;margin-bottom:2px">
      ${usuario.nome}
    </p>
    <p style="font-size:12px;color:#8A766B;margin-bottom:14px">
      ${usuario.email || "Visitante"}
    </p>
    <div style="border-top:1px solid #E8D8C7;padding-top:12px;display:flex;flex-direction:column;gap:8px">
      <button onclick="verHistorico()" style="
        background:none;border:1px solid #E8D8C7;padding:7px 12px;
        border-radius:8px;font-size:13px;cursor:pointer;
        font-family:'Inter',system-ui,sans-serif;color:#5F4A3E;text-align:left
      ">Meus pedidos</button>
      <button onclick="verFidelidade()" style="
        background:none;border:1px solid #E8D8C7;padding:7px 12px;
        border-radius:8px;font-size:13px;cursor:pointer;
        font-family:'Inter',system-ui,sans-serif;color:#5F4A3E;text-align:left
      ">Pontos de fidelidade</button>
      <button onclick="sair()" style="
        background:#F7E7DE;border:1px solid #D8B284;padding:7px 12px;
        border-radius:8px;font-size:13px;cursor:pointer;color:#8b2f1d;
        font-family:'Inter',system-ui,sans-serif;font-weight:600;text-align:left
      ">Sair da conta</button>
    </div>
  `;

  document.body.appendChild(modal);

  setTimeout(() => {
    document.addEventListener("click", function fechar(e) {
      if (!modal.contains(e.target) && e.target.id !== "navUsuario") {
        modal.remove();
        document.removeEventListener("click", fechar);
      }
    });
  }, 100);
}

function abrirModal(titulo, conteudoHTML) {
  document.getElementById("modalGenerico")?.remove();
  document.getElementById("overlayModal")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "overlayModal";
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(43,29,22,.45);
    z-index:400;backdrop-filter:blur(2px);
    animation:fadeIn .2s ease both;
  `;
  overlay.onclick = fecharModal;

  const modal = document.createElement("div");
  modal.id = "modalGenerico";
  modal.style.cssText = `
    position:fixed;top:50%;left:50%;
    transform:translate(-50%,-50%) scale(.96);
    background:#ffffff;border-radius:8px;
    box-shadow:0 16px 42px rgba(43,29,22,.14);
    width:90%;max-width:420px;z-index:401;
    font-family:'Inter',system-ui,sans-serif;
    animation:modalIn .25s ease both;
    overflow:hidden;
  `;

  modal.innerHTML = `
    <div style="
      background:#ffffff;border-bottom:1px solid #E8D8C7;
      padding:16px 20px;display:flex;justify-content:space-between;align-items:center;
    ">
      <h3 style="font-size:16px;font-weight:700;color:#2B1D16;margin:0">${titulo}</h3>
      <button onclick="fecharModal()" style="
        background:none;border:none;font-size:20px;cursor:pointer;
        color:#8A766B;line-height:1;padding:2px 6px;border-radius:8px;
      ">x</button>
    </div>
    <div style="padding:20px">${conteudoHTML}</div>
  `;

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

function verHistorico() {
  document.getElementById("modalPerfil")?.remove();

  const pedidos = [
    { data:"27/05/2026", itens:"Baião Burguer + Suco de Umbu", total:"R$ 37,90", status:"Entregue" },
    { data:"20/05/2026", itens:"Combo Família",                total:"R$ 89,90", status:"Entregue" },
    { data:"14/05/2026", itens:"Tapioca Nordestina + Açaí",     total:"R$ 33,00", status:"Entregue" },
  ];

  const linhas = pedidos.map(pedido => `
    <div style="
      border:1px solid #E8D8C7;border-radius:8px;padding:12px 14px;
      margin-bottom:10px;background:#ffffff;
    ">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:13px;font-weight:600;color:#2B1D16">${pedido.itens}</span>
        <span style="
          font-size:11px;font-weight:600;color:#356B45;
          background:#E7F0E8;padding:2px 8px;border-radius:8px;
        ">${pedido.status}</span>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="font-size:12px;color:#8A766B">${pedido.data}</span>
        <span style="font-size:13px;font-weight:700;color:#B65332">${pedido.total}</span>
      </div>
    </div>
  `).join("");

  abrirModal("Meus pedidos", `
    ${linhas}
    <p style="font-size:11px;color:#8A766B;text-align:center;margin-top:4px">
      Histórico usado apenas para demonstração.
    </p>
  `);
}

function verFidelidade() {
  document.getElementById("modalPerfil")?.remove();
  const usuario = getUsuarioSessao();
  const pts = getPontosUsuario(usuario);
  const pct = Math.min((pts / 1000) * 100, 100).toFixed(0);

  abrirModal("Programa Raízes Fiel", `
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:42px;font-weight:900;color:#C9902E;font-family:'Lora',serif">
        ${pts}
      </div>
      <div style="font-size:13px;color:#8A766B">pontos acumulados</div>
    </div>

    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#8A766B;margin-bottom:4px">
        <span>Progresso para nível VIP</span><span>${pts}/1000</span>
      </div>
      <div style="height:8px;background:#E8D8C7;border-radius:8px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#B65332,#C9902E);border-radius:8px;transition:width .5s"></div>
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
          border:1px solid ${ok ? "#AFCBB5" : "#E8D8C7"};
          background:${ok ? "#E7F0E8" : "#ffffff"};
          border-radius:8px;padding:10px 14px;
        ">
          <span style="font-size:13px;color:#2B1D16">${ben}</span>
          <span style="
            font-size:12px;font-weight:700;
            color:${ok ? "#356B45" : "#8A766B"};
            background:${ok ? "transparent" : "#F7E7DE"};
            padding:2px 10px;border-radius:8px;
          ">${ok ? "Disponível" : req}</span>
        </div>
      `).join("")}
    </div>

    <p style="font-size:11px;color:#8A766B;text-align:center;margin-top:14px">
      Dados simulados, ainda sem backend real.
    </p>
  `);
}

function sair() {
  limparUsuarioSessao();
  window.location.href = "pages/login.html";
}
