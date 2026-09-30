import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CursorSparkle from '../../src/components/CursorSparkle';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CursorSparkle', () => {
  it('acompanha o ponteiro, some ao sair e limpa as coordenadas', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    const { container, unmount } = render(<CursorSparkle />);
    const sparkle = container.firstElementChild;

    fireEvent.pointerMove(window, { clientX: 120, clientY: 80 });

    expect(document.documentElement.style.getPropertyValue('--pointer-x')).toBe('120px');
    expect(document.documentElement.style.getPropertyValue('--pointer-y')).toBe('80px');
    expect(sparkle).toHaveAttribute('data-visible', 'true');

    fireEvent.pointerLeave(document);
    expect(sparkle).toHaveAttribute('data-visible', 'false');

    unmount();
    expect(document.documentElement.style.getPropertyValue('--pointer-x')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--pointer-y')).toBe('');
  });
});
