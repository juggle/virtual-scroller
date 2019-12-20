import { LitElement, html } from 'lit-element';
import { ResizeObserver } from '@juggle/resize-observer';
import { ResizeObserverSize } from '@juggle/resize-observer/lib/ResizeObserverSize';
import { HTMLVirtualCollection } from './HTMLCollection';

window.addEventListener('error', (e) => {
  console.error(e.message);
})

const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
  for (let entry of entries) {
    (entry.target as VirtualScroller)._resize(entry.contentBoxSize);
  }
})

class VirtualScroller extends LitElement {

  private _isVirtualised: boolean = false;
  private _scrollPercentage: number = 0;
  private _width: number = 0;
  private _height: number = 0;
  private _renderCount: number = 0;
  private _translateY: number = 0;
  private _approxScrollHeight: number = 0;
  private _rangeStart = 0;
  private _rangeEnd = 0;

  constructor () {
    super();
    this._overrideChildren();
    this.addEventListener('scroll', () => this._onScroll());
  }

  connectedCallback () {
    super.connectedCallback();
    ro.observe(this);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    ro.unobserve(this);
  }

  render () {
    return html`
      <style>
        :host {
          display: block;
          overflow: hidden;
          overflow-y: auto;
          position: relative;
          /* max-height: 600px; */
        }
        :host ::slotted(*) {
          /* display: block !important; */
        }
        #positioner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        #height {
          width: 0;
        }
      </style>
      <div id="height" style="height:${this._approxScrollHeight}px"></div>
      <div id="positioner" style="transform:translateY(${this._translateY}px)">
        <slot></slot>
      </div>
    `;
  }

  _overrideChildren () {
    Object.defineProperty(this, 'children', {
      value: new HTMLVirtualCollection()
    });
  }

  _resize (size: ResizeObserverSize) {
    this._width = size.inlineSize;
    this._height = size.blockSize;
    this._calc();
  }

  _onScroll () {
    this._scrollPercentage = this.scrollTop / this._approxScrollHeight;
    this._calc();
  }

  get _children () {
    return this.children as HTMLVirtualCollection;
  }

  append (children: HTMLElement[]) {
    this._children.splice(this._children.length, 0, ...children);
    this._calc();
  }

  appendChild (child: HTMLElement) {
    this._children.push(child);
    this._calc();
  }

  removeChild (child: HTMLElement) {
    const index = this._children.indexOf(child);
    index !== -1 && this._children.splice(index, 1);
    this._calc();
  }

  _appendActualChild (child: HTMLElement) {
    super.appendChild(child);
  }

  _clearActualChildren () {
    while (super.children.length) {
      const child = super.removeChild(super.firstElementChild);
      child.style.removeProperty('transform');
    }
  }

  _calc () {
    const approxItemHeight = 80;
    const prevRangeStart = this._rangeStart;
    const prevRangeEnd = this._rangeEnd;
    this._approxScrollHeight = approxItemHeight * this._children.length;
    this._renderCount = this._height / approxItemHeight + 8;
    this._rangeStart = Math.floor((this._children.length - 1) * this._scrollPercentage);
    this._rangeEnd = this._rangeStart + this._renderCount;
    if (this._rangeStart === prevRangeStart && this._rangeEnd === prevRangeEnd) {
      return;
    }
    this._clearActualChildren();
    this._children.slice(this._rangeStart, this._rangeEnd).forEach(el => {
      this._translateY = this._rangeStart * approxItemHeight;
      this._appendActualChild(el);
    });
    this.update();
  }
}

customElements.define('virtual-scroller', VirtualScroller);
