import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import {wsDialogStyles} from './ws-dialog.styles.js';

export interface WsDialogCloseDetail {
  returnValue: string;
}

/**
 * A modal dialog with Workshop Expressive styling and a blurred backdrop.
 *
 * @slot icon - Optional icon shown beside the heading.
 * @slot - Dialog body content.
 * @slot actions - Dialog action controls.
 * @fires ws-dialog-cancel - Fired when the native dialog is cancelled, such as with Escape.
 * @fires ws-dialog-close - Fired whenever the dialog closes.
 */
@customElement('ws-dialog')
export class WsDialog extends LitElement {
  static override styles = wsDialogStyles;

  /** Opens the dialog in the modal top layer. */
  @property({type: Boolean, reflect: true})
  open = false;

  /** Primary dialog heading. */
  @property()
  heading = '';

  /** Optional supporting text shown below the heading. */
  @property()
  description = '';

  /** Accessible label used when a visible heading is not provided. */
  @property({attribute: 'aria-label'})
  accessibleLabel = '';

  @state()
  private hasIcon = false;

  @state()
  private hasActions = false;

  override render() {
    const hasHeader = Boolean(this.heading || this.description || this.hasIcon);
    const headingClass = this.hasIcon ? 'heading has-icon' : 'heading';

    return html`
      <dialog
        class="dialog"
        part="dialog"
        aria-label=${!this.heading && this.accessibleLabel
          ? this.accessibleLabel
          : nothing}
        aria-labelledby=${this.heading ? 'heading' : nothing}
        aria-describedby=${this.description ? 'description' : nothing}
        @click=${this.onDialogClick}
        @cancel=${this.onNativeCancel}
        @close=${this.onNativeClose}
      >
        <div class="surface" part="surface">
          <header class=${headingClass} part="header" ?hidden=${!hasHeader}>
            <span class="icon" part="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
            </span>
            <div class="heading-copy">
              ${this.heading
                ? html`<h2 id="heading">${this.heading}</h2>`
                : nothing}
              ${this.description
                ? html`<p id="description">${this.description}</p>`
                : nothing}
            </div>
          </header>

          <section class="content" part="content">
            <slot></slot>
          </section>

          <footer class="actions" part="actions" ?hidden=${!this.hasActions}>
            <slot name="actions" @slotchange=${this.onActionsSlotChange}></slot>
          </footer>
        </div>
      </dialog>
    `;
  }

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      this.syncOpenState();
    }
  }

  /** Opens the dialog as a modal and moves it into the browser top layer. */
  showModal() {
    if (this.open) {
      this.syncOpenState();
      return;
    }

    this.open = true;
  }

  /** Closes the dialog with an optional return value. */
  close(returnValue = '') {
    const dialog = this.dialogElement;
    if (dialog?.open) {
      dialog.close(returnValue);
      return;
    }

    this.open = false;
  }

  private get dialogElement(): HTMLDialogElement | null {
    return this.renderRoot.querySelector<HTMLDialogElement>('dialog');
  }

  private syncOpenState() {
    const dialog = this.dialogElement;
    if (!dialog) return;

    if (this.open && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!this.open && dialog.open) {
      dialog.close();
    }
  }

  private onIconSlotChange = (event: Event) => {
    const slot = event.currentTarget as HTMLSlotElement;
    this.hasIcon = slot.assignedElements({flatten: true}).length > 0;
  };

  private onActionsSlotChange = (event: Event) => {
    const slot = event.currentTarget as HTMLSlotElement;
    this.hasActions = slot.assignedElements({flatten: true}).length > 0;
  };

  private onDialogClick = (event: MouseEvent) => {
    const dialog = this.dialogElement;
    if (!dialog || event.target !== dialog) return;

    const bounds = dialog.getBoundingClientRect();
    const outsideSurface =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (outsideSurface) {
      this.close('dismiss');
    }
  };

  private onNativeCancel = () => {
    this.dispatchEvent(
      new CustomEvent('ws-dialog-cancel', {
        bubbles: true,
        composed: true,
      })
    );
  };

  private onNativeClose = () => {
    const returnValue = this.dialogElement?.returnValue ?? '';
    this.open = false;

    this.dispatchEvent(
      new CustomEvent<WsDialogCloseDetail>('ws-dialog-close', {
        bubbles: true,
        composed: true,
        detail: {returnValue},
      })
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-dialog': WsDialog;
  }

  interface HTMLElementEventMap {
    'ws-dialog-cancel': CustomEvent<void>;
    'ws-dialog-close': CustomEvent<WsDialogCloseDetail>;
  }
}
