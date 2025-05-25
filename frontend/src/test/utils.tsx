import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
} 