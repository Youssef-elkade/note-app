(() => {
  "use strict";
  const STORAGE_KEY = "almdrasa-notes-v1";
  const $ = selector => document.querySelector(selector);
  const sidebar = $("#sidebar");
  const overlay = $("#mobile-overlay");
  const notesView = $("#notes-view");
  const addView = $("#add-view");
  const form = $("#note-form");
  const titleInput = $("#note-title");
  const authorInput = $("#note-author");
  const textInput = $("#note-text");
  const searchInput = $("#search-notes");
  const pinnedList = $("#pinned-list");
  const otherList = $("#other-list");
  const template = $("#note-template");
  let notes = loadNotes();
  let selectedId = notes[0]?.id ?? null;
  let searchTerm = "";
  let pinOnSubmit = false;

  function loadNotes() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(data)) return [];
      return data.filter(n => n && typeof n.id === "string" && typeof n.text === "string")
        .map(n => ({ id:n.id, title:String(n.title || ""), author:String(n.author || ""),
          text:n.text, pinned:Boolean(n.pinned), createdAt:Number(n.createdAt) || Date.now() }));
    } catch { return []; }
  }
  function saveNotes() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); }
    catch { alert("Could not save notes in this browser."); }
  }
  function dateLabel(timestamp) {
    return new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric", year:"numeric" }).format(new Date(timestamp));
  }
  function matches(note) {
    return `${note.title} ${note.author} ${note.text}`.toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase());
  }
  function showView(view) {
    const isAdd = view === "add";
    notesView.hidden = isAdd;
    addView.hidden = !isAdd;
    document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === view));
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
    if (isAdd) setTimeout(() => titleInput.focus(), 0);
  }
  function renderDetail() {
    const note = notes.find(n => n.id === selectedId);
    const detail = $("#detail-pane");
    if (!note) {
      detail.innerHTML = '<div class="detail-empty"><div class="empty-art" aria-hidden="true"><svg viewBox="0 0 96 96"><path d="M25 14h34l15 15v52H25z"/><path d="M59 14v16h15M36 43h27M36 53h27M36 63h19"/></svg></div><p>Select a note to read it</p></div>';
      return;
    }
    detail.replaceChildren();
    const content = document.createElement("div");
    content.className = "detail-content";
    const heading = document.createElement("h1"); heading.textContent = note.title;
    const meta = document.createElement("p"); meta.className = "detail-meta"; meta.textContent = `${dateLabel(note.createdAt)} / By ${note.author || "Unknown"}`;
    const body = document.createElement("p"); body.className = "detail-body"; body.textContent = note.text;
    content.append(heading, meta, body); detail.append(content);
  }
  function createCard(note) {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector(".note-item");
    const select = fragment.querySelector(".note-select");
    item.classList.toggle("selected", note.id === selectedId);
    item.querySelector(".note-item-title").textContent = note.title || "Untitled note";
    item.querySelector(".note-item-preview").textContent = note.text;
    item.querySelector(".note-item-date").textContent = dateLabel(note.createdAt);
    const pin = item.querySelector(".pin-action");
    pin.textContent = note.pinned ? "Unpin" : "Pin";
    pin.setAttribute("aria-label", note.pinned ? "Unpin note" : "Pin note");
    pin.addEventListener("click", event => {
      event.stopPropagation();
      note.pinned = !note.pinned;
      selectedId = note.id;
      saveNotes(); render();
    });
    item.querySelector(".delete-action").addEventListener("click", event => {
      event.stopPropagation();
      notes = notes.filter(n => n.id !== note.id);
      if (selectedId === note.id) selectedId = notes[0]?.id ?? null;
      saveNotes(); render();
    });
    select.addEventListener("click", () => {
      selectedId = note.id;
      render();
      if (window.innerWidth <= 767) {
        const body = $(".detail-pane");
        body.classList.add("mobile-detail-open");
        body.querySelectorAll(".mobile-back").forEach(button => button.remove());
        const back = document.createElement("button");
        back.className = "mobile-back";
        back.type = "button";
        back.textContent = "← Back to notes";
        back.addEventListener("click", () => body.classList.remove("mobile-detail-open"));
        body.prepend(back);
      }
    });
    return fragment;
  }
  function render() {
    pinnedList.replaceChildren(); otherList.replaceChildren();
    const filtered = notes.filter(matches);
    filtered.filter(n => n.pinned).forEach(n => pinnedList.append(createCard(n)));
    filtered.filter(n => !n.pinned).forEach(n => otherList.append(createCard(n)));
    $("#pinned-empty").hidden = filtered.some(n => n.pinned);
    $("#other-empty").hidden = filtered.some(n => !n.pinned);
    renderDetail();
  }
  function addNote(event) {
    event.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const text = textInput.value.trim();
    if (!title || !author || !text) {
      $("#form-error").textContent = "Please complete all fields.";
      return;
    }
    const note = { id: (crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}-${Math.random()}`),
      title, author, text, pinned: pinOnSubmit, createdAt: Date.now() };
    notes.unshift(note); selectedId = note.id; saveNotes(); form.reset();
    $("#form-error").textContent = ""; pinOnSubmit = false;
    showView("notes"); render();
  }
  form.addEventListener("submit", addNote);
  $("#add-pinned-button").addEventListener("click", () => { pinOnSubmit = true; });
  form.addEventListener("submit", event => { if (event.submitter && event.submitter.id === "add-pinned-button") pinOnSubmit = true; });
  document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
  $("#fab-add").addEventListener("click", () => showView("add"));
  $("#menu-toggle").addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("visible"); });
  overlay.addEventListener("click", () => { sidebar.classList.remove("open"); overlay.classList.remove("visible"); });
  searchInput.addEventListener("input", () => { searchTerm = searchInput.value; render(); });
  $("#clear-search").addEventListener("click", () => { searchInput.value = ""; searchTerm = ""; render(); });
  $("#mobile-search-toggle").addEventListener("click", () => { searchInput.focus(); sidebar.classList.add("open"); overlay.classList.add("visible"); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { sidebar.classList.remove("open"); overlay.classList.remove("visible"); }
  });
  render();
})();
