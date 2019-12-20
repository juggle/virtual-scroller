import '../src/virtual-scroller.ts';
import imgSrc from './avatar.png';

const list = document.querySelector('virtual-scroller');

const h = (tag, attrs, text) => {
  tag = document.createElement(tag);
  for (let attr in attrs) {
    tag.setAttribute(attr, attrs[attr]);
  }
  tag.textContent = text;
  return tag;
}

const data = Array(10000).fill('Hello').map((text, i) => {
  const item = h('div', { class: i % 2 ? 'even' : 'odd' });
  const img = h('img', { src: imgSrc });
  const detail = h('div', { class: 'text' });
  const name = h('div', { class: 'name' }, 'Person Number ' + (i + 1));
  const phone = h('a', { class: 'phone', href: 'tel:07123456789' }, '07123456789');
  detail.append(name, phone);
  item.append(img, detail);
  return item;
});

list.append(data)