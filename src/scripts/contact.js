const campaignParameters = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const contactErrors = {
  invalid: "Confira os campos e tente novamente.",
  test_data: "Use os dados fictícios de homologação para testar o envio.",
  limited: "O limite de tentativas foi atingido. Aguarde alguns minutos.",
  pending: "O envio ainda não foi confirmado. Confira antes de enviar outra solicitação.",
};

function initContactIntent() {
  const current = new window.URL(window.location.href);
  document.querySelectorAll('a[href="/contato/"]').forEach((link) => {
    const destination = new window.URL(link.href);
    for (const key of campaignParameters) {
      const value = current.searchParams.get(key);
      if (value) destination.searchParams.set(key, value);
    }
    link.href = destination.pathname + destination.search;
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest?.(
      '[data-journey-contact], a[href^="tel:"], a[href^="mailto:"], a[href^="/contato/"]',
    );
    if (!target) return;
    const href = target.getAttribute("href") || "";
    const channel = href.startsWith("tel:")
      ? "phone"
      : href.startsWith("mailto:")
        ? "email"
        : "form";
    document.dispatchEvent(
      new window.CustomEvent("tw:contact-intent", {
        detail: { channel, path: current.pathname },
      }),
    );
  });
}

function formatContactPhone(field) {
  const value = field.value;
  if (!/^\+?[\d ().-]*$/.test(value)) return;
  if (value.startsWith("+") && !value.startsWith("+55")) return;

  const prefix = value.startsWith("+55") ? "+55" : "";
  const digits = value.slice(prefix.length).replace(/\D/g, "");
  if (digits.length > 11) return;

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);
  const split = digits.length === 11 ? 5 : 4;
  const lastDigits = number.slice(split);
  const national = number
    ? `(${areaCode}) ${number.slice(0, split)}${lastDigits ? `-${lastDigits}` : ""}`
    : areaCode;
  const formatted = [prefix, national].filter(Boolean).join(" ");
  if (value === formatted) return;

  const cursor = field.selectionStart;
  const digitsBeforeCursor = value.slice(0, cursor).replace(/\D/g, "").length;
  const precedingDigit = [...formatted.matchAll(/\d/g)][digitsBeforeCursor - 1];
  const position =
    cursor === value.length ? formatted.length : precedingDigit ? precedingDigit.index + 1 : 0;
  field.value = formatted;
  field.setSelectionRange(position, position);
}

function initContactForm(form) {
  const phone = form.elements.telefone;
  const group = form.elements.turma;
  const language = form.elements.idioma;
  const adultLanguages = language.querySelectorAll("[data-adults-only]");

  function updateLanguages() {
    const restricted = Boolean(group.value) && !group.selectedOptions[0].hasAttribute("data-adult");
    adultLanguages.forEach((option) => {
      option.disabled = restricted;
    });
    if (language.selectedOptions[0]?.disabled) language.value = "";
  }

  initContactSubmission(form, updateLanguages);
  phone.addEventListener("input", (event) => {
    if (!event.isComposing) formatContactPhone(phone);
  });
  group.addEventListener("change", updateLanguages);
  updateLanguages();
}

function initContactSubmission(form, updateLanguages) {
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById(button.getAttribute("aria-describedby"));
  const enabled = form.hasAttribute("data-contact-endpoint");
  const headers = { "X-TW-Contact": "1", "Content-Type": "application/json" };
  const unconfirmed =
    "Não foi possível confirmar o envio. Confira antes de enviar outra solicitação.";
  let lastAttempt;
  let checking = false;
  let available = false;

  if (enabled && window.crypto?.randomUUID) {
    async function checkAvailability() {
      if (checking || available) return;
      checking = true;
      status.textContent = "Verificando disponibilidade do envio…";
      try {
        const response = await window.fetch(form.action, {
          headers: { "X-TW-Contact": "1" },
          cache: "no-store",
        });
        if (response.ok) {
          const { mode } = await response.json();
          available = mode === "test" || mode === "live";
          if (available) {
            button.disabled = false;
            status.textContent =
              mode === "test" ? "Formulário de teste. Use os dados fictícios de homologação." : "";
          }
        }
      } catch {
        // A later interaction can retry after a temporary network failure.
      } finally {
        if (!available) status.textContent = "O envio ainda está indisponível.";
        checking = false;
      }
    }

    form.addEventListener("focusin", checkAvailability);
    const dialog = form.closest("dialog");
    if (!dialog || dialog.open) checkAvailability();
    dialog?.addEventListener("toggle", () => {
      if (dialog.open) checkAvailability();
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!enabled || button.disabled) return;

    const fields = Object.fromEntries(new window.FormData(form));
    const snapshot = JSON.stringify(fields);
    if (lastAttempt?.snapshot !== snapshot) {
      lastAttempt = { snapshot, requestId: window.crypto.randomUUID() };
    }

    button.disabled = true;
    status.textContent = "Enviando solicitação…";
    try {
      const response = await window.fetch(form.action, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...fields, requestId: lastAttempt.requestId }),
      });
      const result = await response.json();
      if (response.ok && result.sent === true) {
        if (snapshot === JSON.stringify(Object.fromEntries(new window.FormData(form)))) {
          form.reset();
          updateLanguages();
          form.elements.unidade.dispatchEvent(new window.Event("change"));
        }
        lastAttempt = undefined;
        status.textContent = "Solicitação enviada.";
        window.location.assign("/obrigado/");
      } else {
        status.textContent = contactErrors[result.error] ?? unconfirmed;
      }
    } catch {
      status.textContent = unconfirmed;
    } finally {
      button.disabled = false;
    }
  });
}

function initContactMap() {
  const map = document.querySelector("[data-contact-map]");
  if (!map) return;

  const unit = document.querySelector("#contact-unit");

  function updateMap() {
    const selected = unit.value ? unit.selectedOptions[0] : unit.options[1];
    const name = selected.textContent;
    const address = selected.dataset.address;
    const query = encodeURIComponent(address);
    const title = `Mapa da unidade ${name}`;
    if (map.title === title) return;
    map.src = `https://maps.google.com/maps?q=${query}&output=embed`;
    map.title = title;
  }

  unit.addEventListener("change", updateMap);
  updateMap();
}

function initWhereMap() {
  const picker = document.querySelector("[data-where-map-picker]");
  if (!picker) return;

  const map = document.querySelector("[data-where-map]");
  const mapName = document.querySelector("[data-where-map-name]");
  const mapAddress = document.querySelector("[data-where-map-address]");
  const mapLink = document.querySelector("[data-where-map-link]");
  if (!map || !mapName || !mapAddress || !mapLink) return;

  function updateMap() {
    const selected = picker.selectedOptions[0];
    const name = selected.textContent;
    const address = selected.dataset.address;
    const query = encodeURIComponent(address);

    map.src = `https://maps.google.com/maps?q=${query}&output=embed`;
    map.title = `Mapa de ${name}`;
    mapName.textContent = name;
    mapAddress.textContent = address;
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  picker.addEventListener("change", updateMap);
}

function initJourneyContact() {
  const dialog = document.querySelector("#journey-contact-dialog");
  if (!dialog?.showModal) return;

  const group = dialog.querySelector("[name=turma]");
  const language = dialog.querySelector("[name=idioma]");
  const closeButton = dialog.querySelector("[data-close-contact]");
  let opener;

  document.querySelectorAll("[data-journey-contact]").forEach((trigger) => {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", dialog.id);
    trigger.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      if (opener !== trigger) {
        group.value = trigger.dataset.contactGroup || "";
        group.dispatchEvent(new window.Event("change"));
        language.value = trigger.dataset.contactLanguage || "";
      }
      opener = trigger;
      dialog.showModal();
      event.preventDefault();
    });
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    if (!dialog.open) opener?.focus({ preventScroll: true });
  });
}

export function initContact() {
  initContactIntent();
  document.querySelectorAll("[data-contact-form]").forEach(initContactForm);
  initContactMap();
  initWhereMap();
  initJourneyContact();
}
