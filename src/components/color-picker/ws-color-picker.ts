import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import {
  WS_ACCENT_PRESETS,
  WS_DEFAULT_ACCENT,
  accentForeground,
  normalizeHex,
} from './accent.js';
import type {WsAccentPreset, WsColorPickerApply} from './accent.js';
import {wsColorPickerStyles} from './ws-color-picker.styles.js';

/** Detail carried by the `ws-accent-change` event. */
export interface WsAccentChangeDetail {
  /** The accent that was selected. */
  value: string;
  /** The readable foreground computed for that accent. */
  onColor: string;
}

/**
 * Lets people re-theme the whole design system by choosing an accent color.
 *
 * The picker writes two custom properties — `--ws-accent` and
 * `--ws-accent-on` — onto its target. Every primary role in
 * `foundation/colors.css` derives from those, so one write re-themes buttons,
 * focus rings, containers, the brand mark, and the hero in both light and
 * dark schemes.
 *
 * @fires ws-accent-change - The accent changed. Detail is {@link WsAccentChangeDetail}.
 * @fires change - Mirrors `ws-accent-change` for form-style listeners.
 * @csspart trigger - The compact mode trigger button.
 * @csspart panel - The swatch panel.
 * @csspart swatch - Each preset swatch button.
 * @csspart custom - The custom color affordance.
 */
@customElement('ws-color-picker')
export class WsColorPicker extends LitElement {
  static override styles = wsColorPickerStyles;

  /** The selected accent color. */
  @property({reflect: true})
  value: string = WS_DEFAULT_ACCENT;

  /** Preset swatches to offer. Defaults to the shipped accent set. */
  @property({attribute: false})
  presets: readonly WsAccentPreset[] = WS_ACCENT_PRESETS;

  /**
   * Where the accent is written: the document root, this element only, or
   * nowhere (in which case only the events fire).
   */
  @property()
  apply: WsColorPickerApply = 'root';

  /**
   * CSS selector for the element to theme, resolved against the owner
   * document. Takes precedence over `apply` unless `apply` is `none`, which
   * always wins. Use it to re-theme a preview region that is not an ancestor
   * of the picker.
   */
  @property()
  target = '';

  /** Accessible label for the swatch group. */
  @property({attribute: 'aria-label'})
  accessibleLabel = 'Accent color';

  /** Optional caption rendered above the swatches. */
  @property()
  legend = '';

  /** Hides the custom color affordance when set. */
  @property({type: Boolean, attribute: 'no-custom'})
  noCustom = false;

  /** Shows the selected value as a hex string next to the swatches. */
  @property({type: Boolean, attribute: 'show-value'})
  showValue = false;

  /** Renders a trigger button that opens the swatches in a popover. */
  @property({type: Boolean, reflect: true})
  compact = false;

  /**
   * `localStorage` key used to remember the accent across visits. Storage
   * failures (private browsing, disabled cookies) are ignored.
   */
  @property({attribute: 'storage-key'})
  storageKey = '';

  @state()
  private open = false;

  /**
   * Set when the popover would overflow the viewport's inline-start edge, so
   * it anchors to the trigger's start instead. Without this a picker placed
   * anywhere but near the inline-end edge opens off-screen.
   */
  @state()
  private alignStart = false;

  /** The readable foreground for the current accent. */
  get onColor() {
    return accentForeground(this.value);
  }

  override connectedCallback() {
    super.connectedCallback();
    const stored = this.readStoredAccent();
    if (stored) this.value = stored;
    this.applyAccent();
    document.addEventListener(
      'pointerdown',
      this.handleDocumentPointerDown,
      true
    );
    this.addEventListener('keydown', this.handleKeydown);
  }

  override disconnectedCallback() {
    document.removeEventListener(
      'pointerdown',
      this.handleDocumentPointerDown,
      true
    );
    this.removeEventListener('keydown', this.handleKeydown);
    super.disconnectedCallback();
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has('apply') || changed.has('target')) this.clearAccent();
    if (changed.has('value') || changed.has('apply') || changed.has('target')) {
      this.applyAccent();
    }
  }

  override render() {
    const hostStyles = styleMap({
      '--_swatch': this.value,
      '--_swatch-on': this.onColor,
    });

    if (!this.compact) {
      return html`<div style=${hostStyles}>${this.renderPanel()}</div>`;
    }

    return html`
      <button
        class="trigger"
        part="trigger"
        type="button"
        style=${hostStyles}
        aria-haspopup="true"
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-label=${this.accessibleLabel}
        @click=${this.toggle}
      >
        <span class="trigger-dot" aria-hidden="true"></span>
      </button>
      <div
        class=${classMap({popover: true, 'align-start': this.alignStart})}
        style=${hostStyles}
        ?hidden=${!this.open}
      >
        ${this.renderPanel()}
      </div>
    `;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open') && this.open) this.keepPopoverOnScreen();
  }

  /** Flips the popover's anchor when it would open past the viewport edge. */
  private keepPopoverOnScreen() {
    const popover = this.renderRoot.querySelector<HTMLElement>('.popover');
    if (!popover) return;

    // Measure from the default anchor so the check is not self-reinforcing.
    this.alignStart = false;
    const bounds = popover.getBoundingClientRect();

    if (bounds.left < POPOVER_VIEWPORT_MARGIN) {
      this.alignStart = true;
    } else if (
      bounds.right >
      this.ownerDocument.documentElement.clientWidth - POPOVER_VIEWPORT_MARGIN
    ) {
      this.alignStart = false;
    }
  }

  /** Opens the compact popover. No-op outside compact mode. */
  show() {
    if (this.compact) this.open = true;
  }

  /** Closes the compact popover. */
  hide() {
    this.open = false;
  }

  /** Restores the design system's default accent. */
  reset() {
    this.select(WS_DEFAULT_ACCENT);
  }

  private renderPanel() {
    return html`
      <div class="panel" part="panel">
        ${this.legend
          ? html`<span class="legend">${this.legend}</span>`
          : nothing}
        <div
          class="swatches"
          role="radiogroup"
          aria-label=${this.accessibleLabel}
        >
          ${this.presets.map((preset) => this.renderSwatch(preset))}
          ${this.noCustom ? nothing : this.renderCustom()}
          ${this.showValue
            ? html`<span class="value">${this.normalizedValue}</span>`
            : nothing}
        </div>
      </div>
    `;
  }

  private renderSwatch(preset: WsAccentPreset) {
    const selected = this.isSelected(preset.value);

    return html`
      <button
        class=${classMap({swatch: true})}
        part="swatch"
        type="button"
        role="radio"
        aria-checked=${selected ? 'true' : 'false'}
        aria-label=${preset.name}
        title=${preset.name}
        tabindex=${selected || !this.hasSelectedPreset ? '0' : '-1'}
        style=${styleMap({
          '--_swatch': preset.value,
          '--_swatch-on': accentForeground(preset.value),
        })}
        @click=${() => this.select(preset.value)}
      >
        <span class="check" aria-hidden="true"></span>
      </button>
    `;
  }

  private renderCustom() {
    return html`
      <span class="custom" part="custom">
        <span class="custom-glyph" aria-hidden="true"></span>
        <input
          type="color"
          aria-label="Custom accent color"
          .value=${this.normalizedValue ?? WS_DEFAULT_ACCENT}
          @input=${this.handleCustomInput}
        />
      </span>
    `;
  }

  private get normalizedValue() {
    return normalizeHex(this.value);
  }

  private get hasSelectedPreset() {
    return this.presets.some((preset) => this.isSelected(preset.value));
  }

  private isSelected(color: string) {
    const left = normalizeHex(color);
    const right = this.normalizedValue;

    return left && right ? left === right : color.trim() === this.value.trim();
  }

  private handleCustomInput = (event: Event) => {
    this.select((event.target as HTMLInputElement).value);
  };

  private select(color: string) {
    const next = normalizeHex(color) ?? color;
    if (next === this.value) {
      this.hide();
      return;
    }

    this.value = next;
    this.storeAccent(next);
    this.hide();

    const detail: WsAccentChangeDetail = {value: next, onColor: this.onColor};
    this.dispatchEvent(
      new CustomEvent<WsAccentChangeDetail>('ws-accent-change', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }

  private toggle() {
    this.open = !this.open;
  }

  private applyAccent() {
    const target = this.applyTarget;
    if (!target) return;

    target.style.setProperty('--ws-accent', this.value);
    target.style.setProperty('--ws-accent-on', this.onColor);

    /*
     * A subtree has to re-derive the accent roles rather than inherit the ones
     * already computed at :root -- see foundation/colors.css. The attribute is
     * what the foundation's [data-ws-accent-scope] rules key off.
     */
    if (target !== target.ownerDocument.documentElement) {
      target.setAttribute('data-ws-accent-scope', '');
    }

    this.appliedTarget = target;
  }

  /** Releases the previous target so a retarget does not strand an accent. */
  private clearAccent() {
    if (!this.appliedTarget) return;

    this.appliedTarget.style.removeProperty('--ws-accent');
    this.appliedTarget.style.removeProperty('--ws-accent-on');
    this.appliedTarget.removeAttribute('data-ws-accent-scope');
    this.appliedTarget = null;
  }

  private appliedTarget: HTMLElement | null = null;

  private get applyTarget(): HTMLElement | null {
    if (this.apply === 'none') return null;
    if (this.target) {
      return (
        this.ownerDocument?.querySelector<HTMLElement>(this.target) ?? null
      );
    }
    if (this.apply === 'self') return this;

    return this.ownerDocument?.documentElement ?? null;
  }

  private readStoredAccent() {
    if (!this.storageKey) return null;

    try {
      return localStorage.getItem(this.storageKey);
    } catch {
      return null;
    }
  }

  private storeAccent(color: string) {
    if (!this.storageKey) return;

    try {
      localStorage.setItem(this.storageKey, color);
    } catch {
      // Storage is unavailable; the accent still applies for this session.
    }
  }

  /*
   * Dismissal keys off pointerdown, not click. A click is dispatched on the
   * common ancestor of its mousedown and mouseup targets, so a drag that
   * starts inside the popover and ends outside it reports a target outside
   * the picker -- which closed the popover mid text selection. pointerdown
   * only fires where the gesture starts, which is what "outside" means here.
   * <ws-dropdown> dismisses the same way.
   */
  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open) return;
    if (event.composedPath().includes(this)) return;

    this.hide();
  };

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      event.stopPropagation();
      this.hide();
      this.renderRoot.querySelector<HTMLElement>('.trigger')?.focus();
      return;
    }

    const step = ARROW_STEPS[event.key];
    if (step === undefined) return;

    const swatches = Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>('.swatch')
    );
    const current = swatches.findIndex((swatch) =>
      event.composedPath().includes(swatch)
    );
    if (current === -1) return;

    event.preventDefault();
    const next = swatches[(current + step + swatches.length) % swatches.length];
    next?.focus();
    next?.click();
  };
}

/** Breathing room kept between the popover and the viewport edge. */
const POPOVER_VIEWPORT_MARGIN = 8;

/** Arrow keys move the roving focus within the swatch radiogroup. */
const ARROW_STEPS: Record<string, number | undefined> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

declare global {
  interface HTMLElementTagNameMap {
    'ws-color-picker': WsColorPicker;
  }
}
