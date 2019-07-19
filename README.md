# virtual-scroller

The aim of this project is to get as close as possible to something like https://github.com/WICG/virtual-scroller.

A native-like experience for scrolling large amounts of content.

```html
<virtual-scroller>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  ...
  <div>Item 1,000,000</div>
</virtual-scroller>
```

## Initial Requirements

1. Must act like a standard non-inline element.
2. Must expand with content, like a standard non-inline element would.
3. Must virtualise content when overflow occurs. For example, when the `max-height` is reached.
4. Must handle being resized. We can use [@juggle/resize-observer](https://github.com/juggle/resize-observer) for this.
5. Should support variable row heights.
6. Should be exposed as an ES module for easy import.
7. Should initially support at least 1 million rich content rows.
