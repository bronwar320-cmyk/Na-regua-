(() => {
  const config = window.BARBER_CONFIG || {};
  const phone = config.whatsapp || "5524998837827";
  const whatsappUrl = (message) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

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

  document.getElementById("bookingForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nome = data.get("nome");
    const telefone = data.get("telefone");
    const email = data.get("email") || "Não informado";
    const servico = data.get("servico");
    const dia = data.get("data");
    const horario = data.get("horario");
    const message = [
      "Olá! Gostaria de solicitar um agendamento na Na Régua Barber Shop.",
      "",
      `Nome: ${nome}`,
      `Meu WhatsApp: ${telefone}`,
      `E-mail: ${email}`,
      `Serviço: ${servico}`,
      `Data desejada: ${dia}`,
      `Horário desejado: ${horario}`,
      "",
      "Aguardo a confirmação. Obrigado!"
    ].join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener");
  });
})();