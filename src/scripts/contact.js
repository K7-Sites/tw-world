function initContactForm(form) {
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

  form.addEventListener("submit", (event) => event.preventDefault());
  group.addEventListener("change", updateLanguages);
  updateLanguages();
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
  document.querySelectorAll("[data-contact-form]").forEach(initContactForm);
  initContactMap();
  initWhereMap();
  initJourneyContact();
}
