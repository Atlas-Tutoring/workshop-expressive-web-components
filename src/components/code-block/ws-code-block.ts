import {LitElement, html, nothing} from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedNodes,
  state,
} from 'lit/decorators.js';

import {wsCodeBlockStyles} from './ws-code-block.styles.js';

type HighlightToken = {
  kind?:
    | 'comment'
    | 'keyword'
    | 'number'
    | 'operator'
    | 'punctuation'
    | 'string'
    | 'tag'
    | 'attr';
  text: string;
};

/**
 * Workshop code surface for read-only snippets and lightweight editing.
 *
 * Add `editable` to turn the highlighted code surface into a native textarea
 * editor while preserving Workshop syntax colors underneath it.
 *
 * @fires input - Dispatched while editable code changes.
 * @fires change - Dispatched when editable code is committed by the browser.
 * @fires ws-code-copy - Dispatched when the current code is copied.
 * @csspart header - Header containing the language and actions.
 * @csspart language - Programming language label.
 * @csspart code - Read-only highlighted code surface.
 * @csspart editor - Editable textarea.
 * @csspart line-numbers - Editable line-number gutter.
 * @csspart copy-button - Copy action.
 */
@customElement('ws-code-block')
export class WsCodeBlock extends LitElement {
  static override styles = wsCodeBlockStyles;

  /** Programming language label and syntax-highlighting hint. */
  @property({type: String})
  language = 'text';

  /** Code shown or edited by the component. */
  @property({type: String})
  code = '';

  /** Shows a copy-to-clipboard action. */
  @property({type: Boolean, reflect: true})
  copy = false;

  /** Turns the code surface into an editable code field. */
  @property({type: Boolean, reflect: true})
  editable = false;

  /** Prevents editing while preserving selection and copy behavior. */
  @property({type: Boolean, reflect: true, attribute: 'readonly'})
  readOnly = false;

  /** Disables editing and keyboard interaction. */
  @property({type: Boolean, reflect: true})
  disabled = false;

  /** Shows line numbers in editable mode. */
  @property({type: Boolean, reflect: true, attribute: 'line-numbers'})
  lineNumbers = true;

  /** Number of spaces inserted by Tab in editable mode. */
  @property({type: Number, attribute: 'tab-size'})
  tabSize = 2;

  /** Visible editor height hint, expressed as textarea rows. */
  @property({type: Number})
  rows = 8;

  /** Placeholder shown when the editable block is empty. */
  @property({type: String})
  placeholder = '';

  /** Accessible name for the editable textarea. */
  @property({attribute: 'aria-label'})
  accessibleLabel = 'Code editor';

  @state()
  private copied = false;

  @state()
  private slottedCode = '';

  @queryAssignedNodes({flatten: true})
  private codeNodes!: Node[];

  @query('.editor')
  private editorElement?: HTMLTextAreaElement;

  @query('.highlight-layer')
  private highlightLayer?: HTMLElement;

  @query('.line-numbers')
  private lineNumbersElement?: HTMLElement;

  private editingStarted = false;

  private get displayCode() {
    if (this.editable && this.editingStarted) return this.code;
    return this.code || this.slottedCode;
  }

  private get effectiveTabSize() {
    const size = Math.trunc(Number(this.tabSize));
    if (!Number.isFinite(size)) return 2;
    return Math.max(1, Math.min(8, size));
  }

  private get lineCount() {
    return Math.max(1, this.displayCode.split('\n').length);
  }

  private async copyCode() {
    const code = this.displayCode;
    if (!code.trim()) return;

    try {
      await navigator.clipboard.writeText(code);
      this.copied = true;

      window.setTimeout(() => {
        this.copied = false;
      }, 1400);

      this.dispatchEvent(
        new CustomEvent('ws-code-copy', {
          detail: {code},
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  }

  override render() {
    const code = this.displayCode;

    return html`
      <slot class="source" @slotchange=${this.syncSlottedCode}></slot>
      <figure class="code-block">
        <figcaption class="header" part="header">
          <span class="language" part="language">${this.language}</span>

          ${this.copy
            ? html`
                <button
                  class="copy-button"
                  part="copy-button"
                  type="button"
                  ?disabled=${this.disabled}
                  @click=${this.copyCode}
                >
                  <span class="copy-label">
                    ${this.copied ? 'Copied' : 'Copy'}
                  </span>
                </button>
              `
            : nothing}
        </figcaption>

        ${this.editable
          ? this.renderEditor(code)
          : html`<pre class="readonly-code" part="code"><code>${this.renderHighlightedCode(
              code
            )}</code></pre>`}
      </figure>
    `;
  }

  private renderEditor(code: string) {
    return html`
      <div
        class="editor-shell ${this.lineNumbers ? 'with-line-numbers' : ''}"
        style=${`--ws-code-tab-size: ${this.effectiveTabSize}`}
      >
        ${this.lineNumbers
          ? html`
              <pre
                class="line-numbers"
                part="line-numbers"
                aria-hidden="true"
              >${Array.from({length: this.lineCount}, (_, index) => index + 1).join(
                '\n'
              )}</pre
              >
            `
          : nothing}
        <div class="editor-stack">
          <pre class="highlight-layer" aria-hidden="true"><code>${this.renderHighlightedCode(
            code || '\n'
          )}</code></pre>
          <textarea
            class="editor"
            part="editor"
            .value=${code}
            rows=${Math.max(2, this.rows)}
            placeholder=${this.placeholder}
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            wrap="off"
            ?readonly=${this.readOnly}
            ?disabled=${this.disabled}
            aria-label=${this.accessibleLabel}
            @input=${this.handleEditorInput}
            @change=${this.handleEditorChange}
            @keydown=${this.handleEditorKeydown}
            @scroll=${this.syncEditorScroll}
          ></textarea>
        </div>
      </div>
    `;
  }

  private handleEditorInput(event: InputEvent) {
    event.stopPropagation();
    const editor = event.currentTarget as HTMLTextAreaElement;
    this.editingStarted = true;
    this.code = editor.value;

    this.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        data: event.data,
        inputType: event.inputType,
        isComposing: event.isComposing,
      })
    );

    this.updateComplete.then(() => this.syncEditorScroll());
  }

  private handleEditorChange(event: Event) {
    event.stopPropagation();
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }

  private handleEditorKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || this.readOnly || this.disabled) return;

    const editor = event.currentTarget as HTMLTextAreaElement;
    event.preventDefault();

    const value = editor.value;
    const selectionStart = editor.selectionStart;
    const selectionEnd = editor.selectionEnd;
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const lineEndIndex = value.indexOf('\n', selectionEnd);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const selectedBlock = value.slice(lineStart, lineEnd);
    const indent = ' '.repeat(this.effectiveTabSize);

    if (selectionStart === selectionEnd) {
      if (event.shiftKey) {
        const beforeCaret = value.slice(lineStart, selectionStart);
        const removable = Math.min(
          this.effectiveTabSize,
          beforeCaret.match(/^ */)?.[0].length ?? 0
        );
        if (removable === 0) return;

        const nextValue =
          value.slice(0, lineStart) +
          value.slice(lineStart + removable);
        const nextCaret = Math.max(lineStart, selectionStart - removable);
        this.applyEditorValue(editor, nextValue, nextCaret, nextCaret);
        return;
      }

      const nextValue =
        value.slice(0, selectionStart) + indent + value.slice(selectionEnd);
      const nextCaret = selectionStart + indent.length;
      this.applyEditorValue(editor, nextValue, nextCaret, nextCaret);
      return;
    }

    const lines = selectedBlock.split('\n');
    let transformed: string;
    let removedFromFirstLine = 0;

    if (event.shiftKey) {
      const removals = lines.map((line) =>
        Math.min(this.effectiveTabSize, line.match(/^ */)?.[0].length ?? 0)
      );
      removedFromFirstLine = removals[0] ?? 0;
      transformed = lines
        .map((line, index) => line.slice(removals[index]))
        .join('\n');
    } else {
      transformed = lines.map((line) => indent + line).join('\n');
    }

    const nextValue = value.slice(0, lineStart) + transformed + value.slice(lineEnd);
    const nextStart = event.shiftKey
      ? Math.max(lineStart, selectionStart - removedFromFirstLine)
      : selectionStart + indent.length;
    const nextEnd = lineStart + transformed.length;
    this.applyEditorValue(editor, nextValue, nextStart, nextEnd);
  }

  private applyEditorValue(
    editor: HTMLTextAreaElement,
    value: string,
    selectionStart: number,
    selectionEnd: number
  ) {
    editor.value = value;
    editor.setSelectionRange(selectionStart, selectionEnd);
    this.editingStarted = true;
    this.code = value;

    this.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'insertText',
      })
    );

    this.updateComplete.then(() => {
      const currentEditor = this.editorElement;
      currentEditor?.focus();
      currentEditor?.setSelectionRange(selectionStart, selectionEnd);
      this.syncEditorScroll();
    });
  }

  private syncEditorScroll = () => {
    const editor = this.editorElement;
    if (!editor) return;

    if (this.highlightLayer) {
      this.highlightLayer.scrollTop = editor.scrollTop;
      this.highlightLayer.scrollLeft = editor.scrollLeft;
    }

    if (this.lineNumbersElement) {
      this.lineNumbersElement.scrollTop = editor.scrollTop;
    }
  };

  private renderHighlightedCode(code: string) {
    return this.tokenize(code).map((token) =>
      token.kind
        ? html`<span class="token ${token.kind}">${token.text}</span>`
        : html`${token.text}`
    );
  }

  private tokenize(code: string): HighlightToken[] {
    if (!code) return [];

    if (['html', 'xml', 'svg'].includes(this.language.toLowerCase())) {
      return this.tokenizeMarkup(code);
    }

    if (
      ['js', 'javascript', 'ts', 'typescript', 'css'].includes(
        this.language.toLowerCase()
      )
    ) {
      return this.tokenizeScript(code);
    }

    return [{text: code}];
  }

  private tokenizeMarkup(code: string): HighlightToken[] {
    const tokens: HighlightToken[] = [];
    const pattern =
      /(<!--[\s\S]*?-->|<\/?[\w:-]+|\/?\s*>|[\w:-]+(?==)|"[^"]*"|'[^']*')/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(code))) {
      if (match.index > lastIndex) {
        tokens.push({text: code.slice(lastIndex, match.index)});
      }

      const text = match[0];
      let kind: HighlightToken['kind'] = 'punctuation';
      if (text.startsWith('<!--')) kind = 'comment';
      else if (text.startsWith('<')) kind = 'tag';
      else if (text.startsWith('"') || text.startsWith("'")) kind = 'string';
      else if (!/[<>]/.test(text)) kind = 'attr';

      tokens.push({kind, text});
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < code.length) tokens.push({text: code.slice(lastIndex)});
    return tokens;
  }

  private tokenizeScript(code: string): HighlightToken[] {
    const tokens: HighlightToken[] = [];
    const pattern =
      /(\/\*[\s\S]*?\*\/|\/\/.*|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`|\b(?:const|let|var|function|return|if|else|for|while|class|import|export|from|type|new|await|async|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b|[{}()[\].,;:]|[-+*/%=!<>|&?]+)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(code))) {
      if (match.index > lastIndex) {
        tokens.push({text: code.slice(lastIndex, match.index)});
      }

      const text = match[0];
      let kind: HighlightToken['kind'] = 'operator';
      if (text.startsWith('//') || text.startsWith('/*')) kind = 'comment';
      else if (/^["'`]/.test(text)) kind = 'string';
      else if (/^\d/.test(text)) kind = 'number';
      else if (/^[{}()[\].,;:]$/.test(text)) kind = 'punctuation';
      else if (/^[a-z]/.test(text)) kind = 'keyword';

      tokens.push({kind, text});
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < code.length) tokens.push({text: code.slice(lastIndex)});
    return tokens;
  }

  private syncSlottedCode() {
    const code = this.codeNodes
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent ?? '';
        }

        if (node instanceof HTMLTemplateElement) {
          return node.innerHTML;
        }

        if (node instanceof Element) {
          return node.outerHTML;
        }

        return '';
      })
      .join('')
      .trim();

    if (this.slottedCode !== code) {
      this.slottedCode = code;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-code-block': WsCodeBlock;
  }
}
