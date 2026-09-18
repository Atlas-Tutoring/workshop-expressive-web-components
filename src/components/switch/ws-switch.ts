import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsSwitchStyles} from './ws-switch.styles.js';

/** How the switch swaps between its two icons. */
export type WsSwitchIconTransition = 'rotate' | 'fade';

/**
 * Workshop switch primitive for binary settings.
 *
 * @fires change - Dispatched when the checked state changes.
 * @slot checked-icon - Icon shown when the switch is checked.
 * @slot unchecked-icon - Icon shown when the switch is unchecked.
 * @csspart button - The internal switch button.
 * @csspart track - The switch track.
 * @csspart handle - The switch handle.
 */
@customElement('ws-switch')
export class WsSwitch extends LitElement {
  static override styles = wsSwitchStyles;
  static formAssociated = true;

  /** Whether the switch is on. */
  @property({type: Boolean, reflect: true})
  checked = false;

  /** Form control name. */
  @property({reflect: true})
  name = '';

  /** Form control submitted value when checked. Defaults to 'on'. */
  @property()
  value = 'on';

  /** Whether the switch must be checked to submit a form. */
  @property({type: Boolean, reflect: true})
  required = false;

  /** Disables interaction. */
  @property({type: Boolean, reflect: true})
  disabled = false;

  /** Accessible label forwarded to the internal switch button. */
  @property({attribute: 'aria-label'})
  accessibleLabel?: string;

  /**
   * How the two icons swap: `rotate` twists the outgoing glyph away, `fade`
   * cross-fades them in place.
   */
  @property({attribute: 'icon-transition', reflect: true})
  iconTransition: WsSwitchIconTransition = 'rotate';

  /**
   * Reflected as `has-icon` so the styles can keep the thumb at full size when
   * a glyph needs the room. Slot content is not visible to CSS from inside the
   * shadow root, so it is tracked here.
   */
  @state()
  private hasIcon = false;

  private readonly internals = this.attachInternals();
  private defaultChecked = false;
  private customValidationMessage = '';

  /** Associated form, when the field is inside one. */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  /** Labels associated with the custom element. */
  get labels(): NodeList {
    return this.internals.labels;
  }

  /** Current validity state. */
  get validity(): ValidityState {
    return this.internals.validity;
  }

  /** Current validation message. */
  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  /** Whether the field participates in constraint validation. */
  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  /** Runs constraint validation without displaying browser UI. */
  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  /** Runs constraint validation and makes the invalid state visible. */
  reportValidity(): boolean {
    return this.internals.reportValidity();
  }

  /** Applies a custom validity message. Pass an empty string to clear it. */
  setCustomValidity(message: string) {
    this.customValidationMessage = message;
    this.syncFormState();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formResetCallback() {
    this.checked = this.defaultChecked;
    this.syncFormState();
  }

  formStateRestoreCallback(state: string | null) {
    this.checked = state === 'checked' || state === 'on' || state === 'true';
    this.syncFormState();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.defaultChecked = this.hasAttribute('checked') || this.checked;
    this.syncFormState();
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has('checked') ||
      changedProperties.has('value') ||
      changedProperties.has('required') ||
      changedProperties.has('disabled')
    ) {
      this.syncFormState();
    }
  }

  private syncFormState() {
    this.internals.setFormValue(
      this.checked ? this.value : null,
      this.checked ? 'checked' : null
    );

    const participates = !this.disabled;
    const missing = participates && this.required && !this.checked;
    const flags: ValidityStateFlags = {};

    if (this.customValidationMessage) {
      flags.customError = true;
    }
    if (missing) {
      flags.valueMissing = true;
    }

    const message =
      this.customValidationMessage ||
      (missing ? 'Please check this switch to proceed.' : '');

    const anchor = this.renderRoot?.querySelector?.('button') ?? undefined;
    this.internals.setValidity(flags, message, anchor);
  }

  override render() {
    return html`
      <button
        class="switch"
        part="button"
        type="button"
        role="switch"
        aria-checked=${this.checked ? 'true' : 'false'}
        aria-label=${ifDefined(this.accessibleLabel)}
        ?disabled=${this.disabled}
        @click=${this.toggleChecked}
      >
        <span class="track" part="track" aria-hidden="true">
          <span class="handle" part="handle">
            <span class="unchecked-icon"
              ><slot
                name="unchecked-icon"
                @slotchange=${this.onIconSlotChange}
              ></slot
            ></span>
            <span class="checked-icon"
              ><slot
                name="checked-icon"
                @slotchange=${this.onIconSlotChange}
              ></slot
            ></span>
          </span>
        </span>
      </button>
    `;
  }

  private onIconSlotChange() {
    const slots = this.renderRoot.querySelectorAll<HTMLSlotElement>(
      'slot[name$="-icon"]'
    );

    this.hasIcon = Array.from(slots).some(
      (slot) => slot.assignedNodes({flatten: true}).length > 0
    );
    this.toggleAttribute('has-icon', this.hasIcon);
  }

  private toggleChecked() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.syncFormState();
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-switch': WsSwitch;
  }
}
