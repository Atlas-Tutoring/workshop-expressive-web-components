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

  /** Whether the switch is on. */
  @property({type: Boolean, reflect: true})
  checked = false;

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
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-switch': WsSwitch;
  }
}
