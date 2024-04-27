class Modal extends HTMLElement {
  constructor() {
    super();

    // Global attributes
    this.isOpened = false;

    // Shadow DOM
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>
            #backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: rgba(0, 0, 0, 0.75);
                z-index: 10;
                opacity: 0;
                pointer-events: none;
            }

            :host([opened]) #backdrop,
            :host([opened]) #modal {
              opacity: 1;
              pointer-events: all;
            }

            :host([opened]) #modal {
              top: 15vh;
            }

            #modal {
              position: fixed;
              top: 10vh;
              left: 25%;
              width: 50%;
              z-index: 100;
              background: white;
              border-radius: 3px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              opacity: 0;
              pointer-events: none;
              transition: all 0.3s ease-out;
            }

            header {
              padding: 1rem;
              border-bottom: 1px solid #ccc;
            }

            ::sloted(h1) {
              font-size: 1.25rem;
              margin: 0;
              
            }

            #main {
              padding: 1rem;
            }

            #actions {
              border-top: 1px solid #ccc;
              padding: 1rem;
              display: flex;
              justify-content: flex-end;
            }

            #actions button {
              margin: 0 0.25rem;
            }
        </style>

        <div id="backdrop"></div>

        <div id="modal">
          <header>
            <slot name="title">Please confirm payment</slot>
          </header>
          <section id="main">
            <slot></slot>
          </section>
          <section id="actions">
            <button id="cancel-btn">Cancel</button>
            <button id="ok-btn">OK</button>
          </section>
        </div>
    `;

    const cancelBtn = this.shadowRoot.querySelector('#cancel-btn');
    const confirmBtn = this.shadowRoot.querySelector('#ok-btn');
    const backdrop = this.shadowRoot.querySelector('#backdrop');

    cancelBtn.addEventListener('click', this._cancel.bind(this));
    confirmBtn.addEventListener('click', this._confirm.bind(this));
    backdrop.addEventListener('click', this._cancel.bind(this));
  }

  open() {
    if (this.isOpened === true) {
      this.setAttribute('opened', '');
    }
  }

  close() {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened');
    }
    this.isOpened = false;
  }

  _cancel(event) {
    this.close();
    const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
    event.target.dispatchEvent(cancelEvent);
  }

  _confirm(event) {
    this.close();
    const confirmEvent = new Event('confirm');
    event.target.dispatchEvent(confirmEvent);
  }
}

customElements.define('uc-modal', Modal);
