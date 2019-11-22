import { LitElement, html } from 'lit-element';
import { ResizeObserver } from '@juggle/resize-observer';
import { ResizeObserverSize } from '@juggle/resize-observer/lib/ResizeObserverSize';

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
  private _children: HTMLElement[] = [];

  constructor () {
    super();
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

  _resize (size: ResizeObserverSize) {
    this._width = size.inlineSize;
    this._height = size.blockSize;
    this._calc();
  }

  _onScroll () {
    this._scrollPercentage = this.scrollTop / this._approxScrollHeight;
    this._calc();
  }

  append (children: HTMLElement[]) {
    for (let i = 0; i < children.length; i += 1) {
      this._children.push(children[i]);
    }
    this._calc();
  }

  _calc () {
    const approxItemHeight = 80;
    this._approxScrollHeight = approxItemHeight * this._children.length;
    this._renderCount = this._height / approxItemHeight + 4;
    this.innerHTML = '';
    const startIndex = Math.floor((this._children.length - 1) * this._scrollPercentage);
    const els = this._children.slice(startIndex, startIndex + this._renderCount);
    for (let el of els) {
      el.style.transform = `translateY(${startIndex * approxItemHeight}px)`;
      this.appendChild(el);
    }
    this.update();
  }
}

customElements.define('virtual-scroller', VirtualScroller);
