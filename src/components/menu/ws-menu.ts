import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import './ws-menu-item.js';
import type {WsMenuItem} from './ws-menu-item.js';
import {wsMenuStyles} from './ws-menu.styles.js';

export type WsMenuVariant = 'primary' | 'secondary' | 'outlined' | 'text';
export type WsMenuSize = 'small' | 'medium' | 'large';
export type WsMenuPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

export interface WsMenuSelectDetail {
  value: string;
  item: WsMenuItem;
}

@customElement('ws-menu')
export class WsMenu extends LitElement {
  static override styles = wsMenuStyles;

  @property({reflect: true}) variant: WsMenuVariant = 'text';
  @property({reflect: true}) size: WsMenuSize = 'small';
  @property({reflect: true}) placement: WsMenuPlacement = 'bottom-end';
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) open = false;
  @property({type: Number}) offset = 8;
  @property({attribute: 'trigger-label'}) triggerLabel = '';
  @property({attribute: 'aria-label'}) accessibleLabel?: string;

  @state() private activeIndex = -1;

  private readonly menuId = `ws-menu-surface-${WsMenu.nextId++}`;
  private static nextId = 1;
  private requestedFocusIndex: number | null = null;

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('pointerdown', this.handleDocumentPointerDown);
  }

  override disconnectedCallback() {
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown);
    this.removePositionListeners();
    super.disconnectedCallback();
  }

  override render() {
    this.toggleAttribute('icon-only', !this.triggerLabel);

    return html`
      <button
        class="trigger"
        part="trigger"
        type="button"
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.accessibleLabel || this.triggerLabel || undefined)}
        aria-haspopup="menu"
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-controls=${this.menuId}
        @click=${this.handleTriggerClick}
        @keydown=${this.handleTriggerKeydown}
      >
        <span class="trigger-icon" part="trigger-icon" aria-hidden="true">
          <slot name="trigger-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 7.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm0 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm0 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"></path>
            </svg>
          </slot>
        </span>
        ${this.triggerLabel
          ? html`<span class="trigger-label">${this.triggerLabel}</span>`
          : nothing}
      </button>

      <div
        class=${this.open ? 'surface open' : 'surface'}
        part="surface"
        id=${this.menuId}
        role="menu"
        aria-label=${ifDefined(this.accessibleLabel || undefined)}
        aria-hidden=${ifDefined(this.open ? undefined : 'true')}
        .inert=${!this.open}
        @click=${this.handleSurfaceClick}
        @keydown=${this.handleSurfaceKeydown}
        @focusin=${this.handleSurfaceFocusIn}
      >
        <div class="items"><slot @slotchange=${this.syncItems}></slot></div>
      </div>
    `;
  }

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this.addPositionListeners();
        void this.updateComplete.then(() => {
          this.positionSurface();
          const requested = this.requestedFocusIndex;
          this.requestedFocusIndex = null;
          this.focusItem(requested ?? this.firstEnabledIndex());
        });
      } else {
        this.removePositionListeners();
      }
    }

    if (changed.has('disabled') && this.disabled && this.open) {
      this.close(false);
    }
  }

  show(focusIndex?: number) {
    if (this.disabled) return;
    this.requestedFocusIndex = focusIndex ?? this.firstEnabledIndex();
    this.open = true;
  }

  close(restoreFocus = true) {
    if (!this.open) return;
    this.open = false;
    this.activeIndex = -1;
    if (restoreFocus) {
      void this.updateComplete.then(() => this.trigger?.focus());
    }
  }

  toggle() {
    if (this.open) this.close(false);
    else this.show();
  }

  private get trigger() {
    return this.shadowRoot?.querySelector<HTMLButtonElement>('.trigger') ?? null;
  }

  private get surface() {
    return this.shadowRoot?.querySelector<HTMLElement>('.surface') ?? null;
  }

  private get items() {
    return Array.from(this.querySelectorAll<WsMenuItem>('ws-menu-item'));
  }

  private firstEnabledIndex() {
    return this.items.findIndex((item) => !item.disabled);
  }

  private lastEnabledIndex() {
    const items = this.items;
    for (let index = items.length - 1; index >= 0; index -= 1) {
      if (!items[index].disabled) return index;
    }
    return -1;
  }

  private focusItem(index: number) {
    const item = this.items[index];
    if (!item || item.disabled) return;
    this.activeIndex = index;
    item.focus();
  }

  private moveFocus(direction: 1 | -1) {
    const items = this.items;
    if (!items.length) return;

    let index = this.activeIndex;
    for (let attempts = 0; attempts < items.length; attempts += 1) {
      index = (index + direction + items.length) % items.length;
      if (!items[index].disabled) {
        this.focusItem(index);
        return;
      }
    }
  }

  private handleTriggerClick = () => {
    this.toggle();
  };

  private handleTriggerKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.show(this.firstEnabledIndex());
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.show(this.lastEnabledIndex());
      return;
    }

    if (event.key === 'Escape') {
      this.close(false);
    }
  };

  private handleSurfaceClick = (event: MouseEvent) => {
    const item = event
      .composedPath()
      .find((target): target is WsMenuItem => target instanceof HTMLElement && target.tagName === 'WS-MENU-ITEM');
    if (!item || item.disabled) return;

    this.dispatchEvent(
      new CustomEvent<WsMenuSelectDetail>('ws-menu-select', {
        bubbles: true,
        composed: true,
        detail: {value: item.value, item},
      })
    );
    this.close(true);
  };

  private handleSurfaceFocusIn = (event: FocusEvent) => {
    const item = event
      .composedPath()
      .find((target): target is WsMenuItem => target instanceof HTMLElement && target.tagName === 'WS-MENU-ITEM');
    if (item) this.activeIndex = this.items.indexOf(item);
  };

  private handleSurfaceKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
      return;
    }

    if (event.key === 'Tab') {
      this.close(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveFocus(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.focusItem(this.firstEnabledIndex());
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusItem(this.lastEnabledIndex());
    }
  };

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (this.open && !event.composedPath().includes(this)) this.close(false);
  };

  private syncItems = () => {
    if (!this.open) return;
    const first = this.firstEnabledIndex();
    if (first < 0) this.activeIndex = -1;
    else if (this.activeIndex < 0 || this.items[this.activeIndex]?.disabled) {
      this.activeIndex = first;
    }
    this.positionSurface();
  };

  private addPositionListeners() {
    window.addEventListener('resize', this.positionSurface);
    window.addEventListener('scroll', this.positionSurface, true);
  }

  private removePositionListeners() {
    window.removeEventListener('resize', this.positionSurface);
    window.removeEventListener('scroll', this.positionSurface, true);
  }

  private positionSurface = () => {
    if (!this.open) return;
    const trigger = this.trigger;
    const surface = this.surface;
    if (!trigger || !surface) return;

    const triggerRect = trigger.getBoundingClientRect();
    const surfaceRect = surface.getBoundingClientRect();
    const viewportMargin = 8;
    const direction = getComputedStyle(this).direction;
    const wantsBottom = this.placement.startsWith('bottom');
    const wantsEnd = this.placement.endsWith('end');
    const endAlignsRight = direction !== 'rtl';
    const alignRight = wantsEnd ? endAlignsRight : !endAlignsRight;

    const bottomTop = triggerRect.bottom + this.offset;
    const topTop = triggerRect.top - surfaceRect.height - this.offset;
    const fitsBottom =
      bottomTop + surfaceRect.height <= window.innerHeight - viewportMargin;
    const fitsTop = topTop >= viewportMargin;
    const useBottom = wantsBottom
      ? fitsBottom || !fitsTop
      : !fitsTop && fitsBottom;

    let top = useBottom ? bottomTop : topTop;
    let left = alignRight
      ? triggerRect.right - surfaceRect.width
      : triggerRect.left;

    top = Math.min(
      Math.max(viewportMargin, top),
      Math.max(viewportMargin, window.innerHeight - surfaceRect.height - viewportMargin)
    );
    left = Math.min(
      Math.max(viewportMargin, left),
      Math.max(viewportMargin, window.innerWidth - surfaceRect.width - viewportMargin)
    );

    surface.style.top = `${Math.round(top)}px`;
    surface.style.left = `${Math.round(left)}px`;
    surface.style.transformOrigin = `${alignRight ? 'right' : 'left'} ${useBottom ? 'top' : 'bottom'}`;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-menu': WsMenu;
  }
}
