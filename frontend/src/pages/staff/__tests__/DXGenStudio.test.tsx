import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import { DXGenStudio } from '../DXGenStudio';

vi.mock('../../../lib/apiClient', () => ({
  apiClient: vi.fn()
}));

describe('DXGenStudio', () => {
  test('renders AI Content Studio page without crashing', () => {
    render(
      <BrowserRouter>
        <DXGenStudio />
      </BrowserRouter>
    );
    expect(screen.getByText('AI Content Studio')).toBeTruthy();
  });
});
