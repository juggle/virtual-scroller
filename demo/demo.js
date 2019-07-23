import '../src/virtual-scroller.ts';

const list = document.querySelector('virtual-scroller');

list.append(...Array(10).fill('Hello').map((text, i) => {
  const el = document.createElement('div');
  el.innerText = `${text} ${i + 1}`;
  el.style.height = '50px';
  return el;
}))