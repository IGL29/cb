export function mount(selector: string, element: HTMLElement): void {
  const rootElement: HTMLElement | null = document.querySelector(selector);
  if (!rootElement) {
    throw new Error('The root element was not found by the passed selector.');
  }
  rootElement.append(element);
}
