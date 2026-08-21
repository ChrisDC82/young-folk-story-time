import { describe, expect, it } from 'vitest';
import {
  configureCanvasAccessibility,
  type AccessibleCanvas,
} from '../../src/game/systems/CanvasAccessibility';

describe('CanvasAccessibility', () => {
  it('makes the game canvas keyboard-focusable and gives it an accessible name', () => {
    const attributes = new Map<string, string>();
    const canvas: AccessibleCanvas = {
      tabIndex: -1,
      setAttribute: (name, value) => attributes.set(name, value),
    };

    configureCanvasAccessibility(canvas);

    expect(canvas.tabIndex).toBe(0);
    expect(attributes.get('role')).toBe('application');
    expect(attributes.get('aria-label')).toBe('Young Folk: Story Time interactive game');
  });
});
