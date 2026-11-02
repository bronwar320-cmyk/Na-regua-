(() => {
  const config = window.BARBER_CONFIG || {};
  const configured = config.supabaseUrl?.startsWith("https://") &&
    config.supabaseAnonKey && !config.supabaseAnonKey.startsWith("COLE_AQUI");
  const loginView = document.getElementById("loginView");
  const dashboardView = document.getElementById("dashboardView");
  const loginError = document.getElementById("loginError");
  let client = null;
  let bookings = [];

  if (configured && window.supabase?.createClient) {
    client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  } else {
    loginError.textContent = "Configure a Project URL e a anon/public key no arquivo config.js.";
    document.querySelector('#loginForm button').disabled = true;
  }

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));

  function showDashboard(user) {
    loginView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    document.getElementById("adminEmail").textContent = user?.email || "";
    loadBookings();
  }

  function showLogin() {
    dashboardView.classList.add("hidden");
    loginView.classList.remove("hidden");
  }

  async function loadBookings() {
    if (!client) return;
    const { data, error } = await client.from("agendamentos")
      .select("id,nome,telefone,email,servico,data_desejada,horario_desejado,status,criado_em")
      .order("data_desejada", { ascending: true })
      .order("horario_desejado", { ascending: true });
    if (error) {
      alert("Não foi possível carregar os agendamentos. Verifique se o SQL foi executado e se este usuário está cadastrado como administrador.");
      console.error(error);
      return;
    }
    bookings = data || [];
    render();
  }

  function render() {
    const status = document.getElementById("statusFilter").value;
    const date = document.getElementById("dateFilter").value;
    const today = new Date();
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
    document.getElementById("totalCount").textContent = bookings.length;
    document.getElementById("pendingCount").textContent = bookings.filter(x => x.status === "pendente").length;
    document.getElementById("confirmedCount").textContent = bookings.filter(x => x.status === "confirmado").length;

    const filtered = bookings.filter(item => {
      if (status !== "todos" && item.status !== status) return false;
      if (date === "hoje" && item.data_desejada !== todayStr) return false;
      if (date === "futuros" && item.data_desejada < todayStr) return false;
      return true;
    });
    const tbody = document.getElementById("bookingRows");
    tbody.innerHTML = filtered.map(item => {
      const dateParts = item.data_desejada.split("-");
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      const statusLabel = item.status || "pendente";
      const actions = statusLabel === "pendente"
        ? `<button class="admin-btn" data-action="confirmado" data-id="${item.id}">Confirmar</button><button class="admin-btn danger" data-action="recusado" data-id="${item.id}">Recusar</button>`
        : `<button class="admin-btn secondary" data-action="pendente" data-id="${item.id}">Reabrir</button><button class="admin-btn danger" data-action="cancelado" data-id="${item.id}">Cancelar</button>`;
      return `<tr>
        <td><b>${escapeHtml(item.nome)}</b><br><span class="muted">${escapeHtml(item.telefone)}</span>${item.email ? `<br><span class="muted">${escapeHtml(item.email)}</span>` : ""}</td>
        <td>${escapeHtml(item.servico)}</td>
        <td>${formattedDate}<br>${escapeHtml(String(item.horario_desejado).slice(0,5))}</td>
        <td><span class="status ${escapeHtml(statusLabel)}">${escapeHtml(statusLabel)}</span></td>
        <td><div class="actions">${actions}</div></td>
      </tr>`;
    }).join("");
    document.getElementById("emptyState").classList.toggle("hidden", filtered.length !== 0);
  }

  document.getElementById("loginForm").addEventListener("submit", async event => {
    event.preventDefault();
    if (!client) return;
    const form = new FormData(event.currentTarget);
    const button = event.currentTarget.querySelector("button");
    button.disabled = true;
    loginError.textContent = "Verificando acesso...";
    const { data, error } = await client.auth.signInWithPassword({
      email: form.get("email"), password: form.get("password")
    });
    button.disabled = false;
    if (error) {
      loginError.textContent = "Não foi possível entrar. Confira seu e-mail e senha.";
      return;
    }
    loginError.textContent = "";
    showDashboard(data.user);
  });

  document.getElementById("bookingRows").addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    button.disabled = true;
    const { error } = await client.from("agendamentos")
      .update({ status: button.dataset.action })
      .eq("id", button.dataset.id);
    if (error) {
      alert("Não foi possível atualizar o status. Tente novamente.");
      console.error(error);
    }
    await loadBookings();
  });

  document.getElementById("refreshBtn").addEventListener("click", loadBookings);
  document.getElementById("statusFilter").addEventListener("change", render);
  document.getElementById("dateFilter").addEventListener("change", render);
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await client.auth.signOut();
    showLogin();
  });

  if (client) {
    client.auth.getSession().then(({ data }) => {
      if (data.session) showDashboard(data.session.user);
    });
    client.auth.onAuthStateChange((_event, session) => {
      if (!session) showLogin();
    });
    window.setInterval(() => {
      if (!dashboardView.classList.contains("hidden")) loadBookings();
    }, 20000);
  }
})();