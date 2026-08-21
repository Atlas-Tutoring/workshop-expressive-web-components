import {css} from 'lit';

export const wsTabPanelStyles = css`
  :host {
    display: block;
    min-inline-size: 0;
  }

  :host([hidden]) {
    display: none;
  }

  .panel {
    min-inline-size: 0;
  }
`;
