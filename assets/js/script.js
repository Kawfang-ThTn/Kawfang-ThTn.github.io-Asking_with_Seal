/* ============================================================
   MVC + OOP — script.js
   ─────────────────────────────────────────────────────────────
   Model      → AppModel      (state & business logic)
   View       → AppView       (DOM reads/writes, no logic)
   Controller → AppController (wires Model ↔ View, handles events)
   ============================================================ */


/* ──────────────────────────────────────────────
   MODEL
   Holds all application state and business rules.
   Never touches the DOM.
   ────────────────────────────────────────────── */
class AppModel {
  static MAX_CLICKS = 3;

  constructor() {
    this.rightClickCount = 0;
    this.isModalOpen = false;
  }

  /* Increment right-button counter; returns updated count */
  incrementRightClick() {
    if (this.rightClickCount < AppModel.MAX_CLICKS) {
      this.rightClickCount++;
    }
    return this.rightClickCount;
  }

  /* Has the right button reached its limit? */
  isRightMaxed() {
    return this.rightClickCount >= AppModel.MAX_CLICKS;
  }

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }

  /* Reset everything back to initial state */
  reset() {
    this.rightClickCount = 0;
    this.isModalOpen = false;
  }
}


/* ──────────────────────────────────────────────
   VIEW
   Only knows how to read/write the DOM.
   No state, no logic — receives instructions and obeys.
   ────────────────────────────────────────────── */
class AppView {
  constructor() {
    /* Cache all DOM references once */
    this.btnLeft = document.getElementById('btn-left');
    this.btnRight = document.getElementById('btn-right');
    this.btnRightLabel = document.getElementById('btn-right-label');
    this.hint = document.getElementById('hint');
    this.modal = document.getElementById('modal');
  }

  /* ── Right button ── */
  setRightBtnSize(sizeIndex) {
    this.btnRight.classList.remove('size-1', 'size-2', 'size-3');
    if (sizeIndex > 0) {
      this.btnRight.classList.add(`size-${sizeIndex}`);
    }
  }

  setRightBtnLabel(text) {
    this.btnRightLabel.textContent = text;
  }

  /* ── Hint text ── */
  setHint(text, color = '') {
    this.hint.textContent = text;
    this.hint.style.color = color;
  }

  /* ── Modal ── */
  showModal() { this.modal.classList.remove('hidden'); }
  hideModal() { this.modal.classList.add('hidden'); }

  /* ── Bind event listeners (callbacks supplied by Controller) ── */
  bindLeftBtn(handler) { this.btnLeft.addEventListener('click', handler); }
  bindRightBtn(handler) { this.btnRight.addEventListener('click', handler); }
  bindModalOverlay(handler) { this.modal.addEventListener('click', handler); }
}


/* ──────────────────────────────────────────────
   CONTROLLER
   The only class allowed to own both Model and View.
   Translates user events → model updates → view renders.
   ────────────────────────────────────────────── */
class AppController {
  /* Hint copy per click count */
  static HINT_MAP = {
    0: { text: 'คำใบ้ : ให้ตอบตามความเป็นจริง', color: '' },
    1: { text: 'ตอบความจริง... (1/3)', color: '' },
    2: { text: 'บอกให้ตอบตามจริงไง... (2/3)', color: '' },
    3: { text: 'กดปุ่ม ✨ อ้วนมาก  เพื่อจบเกม 👈', color: 'rgba(255, 100, 100, 0.7)' },
  };

  /* Right-button labels per click count */
  static LABEL_MAP = {
    0: '🚀 ไม่อ้วนเลย !',
    1: '🚀 ไม่อ้วน !!',
    2: '🚀 ไม่อ้วนเลย !!!',
  };

  constructor(model, view) {
    this.model = model;
    this.view = view;

    /* Wire up events once */
    this.view.bindLeftBtn(() => this.handleLeftBtn());
    this.view.bindRightBtn(() => this.handleRightBtn());
    this.view.bindModalOverlay(e => this.handleModalOverlayClick(e));

    /* Render initial state */
    this.render();
  }

  /* ── Event handlers ── */

  handleLeftBtn() {
    this.model.openModal();
    this.render();
  }

  handleRightBtn() {
    if (this.model.isRightMaxed()) return; // already maxed, ignore
    this.model.incrementRightClick();
    this.render();
  }

  /* Close modal only when clicking the overlay itself, not the inner box */
  handleModalOverlayClick(event) {
    if (event.target === this.view.modal) {
      this.handleCloseModal();
    }
  }

  handleCloseModal() {
    this.model.closeModal();
    this.model.reset();
    this.render();
  }

  /* ── Render: push current model state → view ── */
  render() {
    const count = this.model.rightClickCount;

    /* Right button size & label */
    this.view.setRightBtnSize(count);
    this.view.setRightBtnLabel(AppController.LABEL_MAP[count] ?? '🚀 GO!!!');

    /* Hint */
    const hint = AppController.HINT_MAP[count] ?? AppController.HINT_MAP[3];
    this.view.setHint(hint.text, hint.color);

    /* Modal visibility */
    this.model.isModalOpen ? this.view.showModal() : this.view.hideModal();
  }
}


/* ──────────────────────────────────────────────
   BOOTSTRAP
   Instantiate and wire everything together.
   ────────────────────────────────────────────── */

let app; // exposed so the inline onclick in HTML can reach the controller

document.addEventListener('DOMContentLoaded', () => {
  const model = new AppModel();
  const view = new AppView();
  app = new AppController(model, view);
});

/* Called by the "Close & Reset" button's inline onclick in index.html */
function closeModal() {
  app?.handleCloseModal();
}
