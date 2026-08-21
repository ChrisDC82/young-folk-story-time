export interface AccessibleCanvas {
  tabIndex: number;
  setAttribute(name: string, value: string): void;
}

export function configureCanvasAccessibility(canvas: AccessibleCanvas): void {
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'application');
  canvas.setAttribute('aria-label', 'Young Folk: Story Time interactive game');
}
