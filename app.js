(() => {
  const config = window.BARBER_CONFIG || {};
  const phone = config.whatsapp || "5524998837827";
  const whatsappUrl = (message) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const supabaseReady = () =>
    window.supabase?.createClient &&
    config.supabaseUrl?.startsWith("https://qgpuktvvevkdbegtfpor.supabase.co") &&
    config.supabaseAnonKey &&
    !config.supabaseAnonKey.startsWith("sb_publishable_QJxkdBzGXx-t2yal3YEOYA_7-yqzEZY");

  let db = null;
  if (supabaseReady()) {
    db = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  ["whatsHero", "whatsHours", "whatsContact", "whatsFooter"].forEach(id => {
    const link = document.getElementById(id);
    if (link) {
      link.href = whatsappUrl("Olá! Gostaria de informações sobre os serviços da Na Régua Barber Shop.");
      link.target = "_blank";
      link.rel = "noopener";
    }
  });

  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  toggle?.addEventListener("click", () => nav.classList.toggle("open"));
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  const dateInput = document.querySelector('input[name="data"]');
  if (dateInput) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localDate;
  }

  document.getElementById("bookingForm")?.addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    const booking = {
      nome: String(data.get("nome") || "").trim(),
      telefone: String(data.get("telefone") || "").trim(),
      email: String(data.get("email") || "").trim() || null,
      servico: String(data.get("servico") || ""),
      data_desejada: String(data.get("data") || ""),
      horario_desejado: String(data.get("horario") || ""),
      status: "pendente"
    };

    if (!db) {
      alert("O sistema de agendamento ainda não está conectado ao Supabase. Configure a Project URL e a anon/public key no arquivo config.js.");
      return;
    }

    button.disabled = true;
    button.textContent = "Enviando...";
    try {
      const { error } = await db.from("agendamentos").insert(booking);
      if (error) throw error;

      const message = [
        "Olá! Um novo pedido de agendamento foi registrado no site Na Régua Barber Shop.",
        "",
        `Nome: ${booking.nome}`,
        `WhatsApp: ${booking.telefone}`,
        `E-mail: ${booking.email || "Não informado"}`,
        `Serviço: ${booking.servico}`,
        `Data desejada: ${booking.data_desejada}`,
        `Horário desejado: ${booking.horario_desejado}`,
        "Status: Pendente de confirmação",
        "",
        "O pedido também foi salvo no painel administrativo."
      ].join("\n");

      alert("Solicitação registrada! Agora vamos abrir o WhatsApp para você também enviar os dados à barbearia.");
      window.open(whatsappUrl(message), "_blank", "noopener");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Não foi possível salvar o agendamento. Confira sua conexão e tente novamente.");
    } finally {
      button.disabled = false;
      button.textContent = "Solicitar agendamento ↗";
    }
  });
})();
