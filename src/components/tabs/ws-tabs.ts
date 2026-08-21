import {LitElement, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {WsTab} from './ws-tab.js';
import {WsTabPanel} from './ws-tab-panel.js';
import {wsTabsStyles} from './ws-tabs.styles.js';

export type WsTabsOrientation = 'horizontal' | 'vertical';
export type WsTabsVariant = 'standard' | 'contained';

/**
 * Workshop tabs for navigation or local view switching.
 *
 * Navigation tabs use `href`. Local panel tabs use `value` and pair with
 * `ws-tab-panel` children carrying the same value.
 *
 * @slot - One or more `ws-tab` elements.
 * @slot panel - `ws-tab-panel` children managed by this tab group.
 * @csspart tabs - The tablist container.
 * @csspart indicator - The animated active-tab indicator.
 */
@customElement('ws-tabs')
export class WsTabs extends LitElement {
  static override styles = wsTabsStyles;

  /** Accessible label forwarded to the internal tablist. */
  @property({attribute: 'aria-label'})
  accessibleLabel?: string;

  /** Visual treatment for the tab group. */
  @property({reflect: true})
  variant: WsTabsVariant = 'standard';

  /** Visual and accessibility orientation for the tab list. */
  @property({reflect: true})
  orientation: WsTabsOrientation = 'horizontal';

  /** Selected value for local panel tabs. */
  @property({reflect: true})
  value = '';

  @query('.tabs')
  private tabsElement?: HTMLElement;

  @query('slot:not([name])')
  private slotElement?: HTMLSlotElement;

  @query('slot[name="panel"]')
  private panelSlotElement?: HTMLSlotElement;

  private hasMeasuredIndicator = false;
  private indicatorAnimationTimeout = 0;
  private indicatorUpdateFrame = 0;
  private lastSelectedTab: WsTab | null = null;
  private syncingValue = false;

  private readonly mutationObserver = new MutationObserver(() => {
    this.syncValueFromSelectedTab();
    this.syncPanels();
    this.scheduleIndicatorUpdate();
  });

  private readonly resizeObserver = new ResizeObserver(() => {
    this.scheduleIndicatorUpdate({animate: false});
  });

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.handleResize);
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    window.clearTimeout(this.indicatorAnimationTimeout);
    window.cancelAnimationFrame(this.indicatorUpdateFrame);
    this.mutationObserver.disconnect();
    this.resizeObserver.disconnect();
    super.disconnectedCallback();
  }

  override firstUpdated() {
    this.observeTabs();
    this.initializeSelection();
    this.updateIndicator({animate: false});
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value') && !this.syncingValue) {
      this.applyValueSelection();
      this.syncPanels();
      this.scheduleIndicatorUpdate();
    }

    if (
      changedProperties.has('orientation') ||
      changedProperties.has('variant')
    ) {
      this.scheduleIndicatorUpdate({animate: false});
    }
  }

  override render() {
    return html`
      <div class="root">
        <div
          class="tabs"
          part="tabs"
          role="tablist"
          aria-label=${ifDefined(this.accessibleLabel)}
          aria-orientation=${this.orientation}
          @click=${this.selectClickedTab}
          @keydown=${this.handleKeydown}
        >
          <div
            class="indicator"
            part="indicator"
            aria-hidden="true"
            @transitionend=${this.handleIndicatorTransitionEnd}
          ></div>
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
        <slot
          name="panel"
          class="panels"
          @slotchange=${this.handlePanelSlotChange}
        ></slot>
      </div>
    `;
  }

  private animateIndicator() {
    window.clearTimeout(this.indicatorAnimationTimeout);
    this.toggleAttribute('indicator-animated', true);
    this.getBoundingClientRect();
    this.indicatorAnimationTimeout = window.setTimeout(() => {
      this.toggleAttribute('indicator-animated', false);
    }, 320);
  }

  private handleIndicatorTransitionEnd(event: TransitionEvent) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'transform'
    ) {
      return;
    }

    window.clearTimeout(this.indicatorAnimationTimeout);
    this.toggleAttribute('indicator-animated', false);
  }

  private readonly handleResize = () => {
    this.scheduleIndicatorUpdate({animate: false});
  };

  private scheduleIndicatorUpdate(options: {animate?: boolean} = {}) {
    window.cancelAnimationFrame(this.indicatorUpdateFrame);
    this.indicatorUpdateFrame = window.requestAnimationFrame(() => {
      this.updateIndicator(options);
    });
  }

  private readonly updateIndicator = (options: {animate?: boolean} = {}) => {
    const tabsElement = this.tabsElement;
    const selectedTab = this.selectedTab;
    const selectedChanged = selectedTab !== this.lastSelectedTab;
    const shouldAnimate =
      options.animate !== false && this.hasMeasuredIndicator && selectedChanged;

    this.lastSelectedTab = selectedTab;

    if (!tabsElement || !selectedTab) {
      this.style.setProperty('--ws-tabs-indicator-opacity', '0');
      this.hasMeasuredIndicator = true;
      return;
    }

    if (shouldAnimate) this.animateIndicator();

    const hostRect = tabsElement.getBoundingClientRect();
    const selectedRect = selectedTab.getBoundingClientRect();

    if (this.variant === 'contained') {
      this.style.setProperty(
        '--ws-tabs-indicator-inline-size',
        `${selectedRect.width}px`
      );
      this.style.setProperty(
        '--ws-tabs-indicator-block-size',
        `${selectedRect.height}px`
      );
      this.style.setProperty(
        '--ws-tabs-indicator-x',
        `${selectedRect.left - hostRect.left}px`
      );
      this.style.setProperty(
        '--ws-tabs-indicator-y',
        `${selectedRect.top - hostRect.top}px`
      );
    } else if (this.orientation === 'vertical') {
      this.style.setProperty('--ws-tabs-indicator-inline-size', '3px');
      this.style.setProperty(
        '--ws-tabs-indicator-block-size',
        `${selectedRect.height}px`
      );
      this.style.setProperty('--ws-tabs-indicator-x', '0px');
      this.style.setProperty(
        '--ws-tabs-indicator-y',
        `${selectedRect.top - hostRect.top}px`
      );
    } else {
      this.style.setProperty(
        '--ws-tabs-indicator-inline-size',
        `${selectedRect.width}px`
      );
      this.style.setProperty('--ws-tabs-indicator-block-size', '3px');
      this.style.setProperty(
        '--ws-tabs-indicator-x',
        `${selectedRect.left - hostRect.left}px`
      );
      this.style.setProperty('--ws-tabs-indicator-y', '0px');
    }

    this.style.setProperty('--ws-tabs-indicator-opacity', '1');
    this.hasMeasuredIndicator = true;
  };

  private get selectedTab() {
    return this.tabs.find((tab) => tab.selected) ?? null;
  }

  private get tabs() {
    return (
      this.slotElement
        ?.assignedElements({flatten: true})
        .filter((element): element is WsTab => element instanceof WsTab) ?? []
    );
  }

  private get panels() {
    return (
      this.panelSlotElement
        ?.assignedElements({flatten: true})
        .filter(
          (element): element is WsTabPanel => element instanceof WsTabPanel
        ) ?? []
    );
  }

  private initializeSelection() {
    if (this.value) {
      this.applyValueSelection();
    } else {
      const selected = this.selectedTab;
      if (selected?.value) {
        this.setValueWithoutReselecting(selected.value);
      } else if (!selected) {
        const firstPanelTab = this.tabs.find(
          (tab) => tab.value && !tab.disabled
        );
        if (firstPanelTab) this.selectTab(firstPanelTab, {emit: false});
      }
    }
    this.syncPanels();
  }

  private applyValueSelection() {
    if (!this.value) return;
    const matchingTab = this.tabs.find((tab) => tab.value === this.value);
    if (!matchingTab || matchingTab.disabled) return;

    this.tabs.forEach((tab) => {
      tab.selected = tab === matchingTab;
    });
  }

  private syncValueFromSelectedTab() {
    const selected = this.selectedTab;
    if (!selected?.value || selected.value === this.value) return;
    this.setValueWithoutReselecting(selected.value);
  }

  private setValueWithoutReselecting(value: string) {
    this.syncingValue = true;
    this.value = value;
    this.updateComplete.finally(() => {
      this.syncingValue = false;
    });
  }

  private syncPanels() {
    const tabsByValue = new Map(
      this.tabs.filter((tab) => tab.value).map((tab) => [tab.value, tab])
    );

    this.panels.forEach((panel) => {
      const tab = tabsByValue.get(panel.value);
      panel.active = Boolean(tab?.selected);
      if (!tab) return;

      tab.controls = panel.id;
      if (!panel.hasAttribute('aria-label')) {
        panel.accessibleLabel = tab.textContent?.trim() || undefined;
      }
    });
  }

  private observeTabs() {
    this.resizeObserver.disconnect();
    this.mutationObserver.disconnect();

    if (this.tabsElement) this.resizeObserver.observe(this.tabsElement);
    this.tabs.forEach((tab) => {
      this.resizeObserver.observe(tab);
      this.mutationObserver.observe(tab, {
        attributeFilter: ['selected', 'disabled', 'value'],
        attributes: true,
      });
    });
  }

  private handleSlotChange() {
    this.observeTabs();
    this.initializeSelection();
    this.scheduleIndicatorUpdate();
  }

  private handlePanelSlotChange() {
    this.syncPanels();
  }

  private selectClickedTab(event: MouseEvent) {
    const clickedTab = event
      .composedPath()
      .find((target): target is WsTab => target instanceof WsTab);

    if (!clickedTab || !this.tabs.includes(clickedTab)) return;
    if (clickedTab.disabled) {
      event.preventDefault();
      return;
    }

    if (clickedTab.value || clickedTab.href.startsWith('#')) {
      event.preventDefault();
    }

    this.selectTab(clickedTab);
  }

  private handleKeydown(event: KeyboardEvent) {
    const currentTab = event
      .composedPath()
      .find((target): target is WsTab => target instanceof WsTab);
    if (!currentTab?.value || !this.tabs.includes(currentTab)) return;

    const panelTabs = this.tabs.filter((tab) => tab.value && !tab.disabled);
    const currentIndex = panelTabs.indexOf(currentTab);
    if (currentIndex < 0) return;

    let nextIndex: number | null = null;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = panelTabs.length - 1;

    const previousKey =
      this.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey =
      this.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    if (event.key === previousKey) {
      nextIndex = (currentIndex - 1 + panelTabs.length) % panelTabs.length;
    }
    if (event.key === nextKey) {
      nextIndex = (currentIndex + 1) % panelTabs.length;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const nextTab = panelTabs[nextIndex];
    this.selectTab(nextTab);
    nextTab.focus();
  }

  private selectTab(tab: WsTab, options: {emit?: boolean} = {}) {
    this.tabs.forEach((candidate) => {
      candidate.selected = candidate === tab;
    });

    if (tab.value && tab.value !== this.value) {
      this.setValueWithoutReselecting(tab.value);
    }

    this.syncPanels();
    this.scheduleIndicatorUpdate();

    if (options.emit === false) return;
    this.dispatchEvent(
      new CustomEvent('ws-tab-change', {
        detail: {
          tab,
          href: tab.href,
          value: tab.value || undefined,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-tabs': WsTabs;
  }
}
