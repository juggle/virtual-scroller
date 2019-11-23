export class HTMLVirtualCollection extends Array {
  item (index: number) {
    return this[index];
  }
  namedItem (id: string) {
    return this.filter(el => el.id === id || (el as HTMLFormElement).name === id)
    .sort((a, b) => b.id === id ? -1 : 1)[0];
  }
}
