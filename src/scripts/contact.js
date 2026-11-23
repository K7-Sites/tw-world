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
  const mapName = document.querySelector("[data-contact-map-name]");
  const mapAddress = document.querySelector("[data-contact-map-address]");
  const mapLink = document.querySelector("[data-contact-map-link]");

  function updateMap() {
    const selected = unit.value ? unit.selectedOptions[0] : unit.options[1];
    const name = selected.textContent;
    const address = selected.dataset.address;
    const query = encodeURIComponent(address);
    if (mapName.textContent === name) return;
    map.src = `https://maps.google.com/maps?q=${query}&output=embed`;
    map.title = `Mapa da unidade ${name}`;
    mapName.textContent = name;
    mapAddress.textContent = address;
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  unit.addEventListener("change", updateMap);
  updateMap();
}

function initJourneyContact() {
  const dialog = document.querySelector("#journey-contact-dialog");
  if (!dialog?.showModal) return;

  const group = dialog.querySelector("[name=turma]");
  const closeButton = dialog.querySelector("[data-close-contact]");
  let opener;

  document.querySelectorAll("[data-journey-contact]").forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");
    link.setAttribute("aria-controls", dialog.id);
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      if (opener !== link) {
        group.value = link.dataset.contactGroup || "";
        group.dispatchEvent(new window.Event("change"));
      }
      opener = link;
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
  initJourneyContact();
}
