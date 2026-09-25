import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import { BlogCreate } from '../BlogCreate';


vi.mock('../../../lib/apiClient', () => ({
  apiClient: vi.fn()
}));
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: '1', email: 'doctor@kushdental.com', role: 'DOCTOR' },
    login: vi.fn(),
    logout: vi.fn(),
    loading: false
  }))
}));
vi.mock('../../../components/journal/RichTextEditor', () => ({
  RichTextEditor: () => <div data-testid="rich-text-editor" />
}));

describe('BlogAIGeneration', () => {
  test('renders BlogCreate without crashing', () => {
    render(
      <BrowserRouter>
        <BlogCreate />
      </BrowserRouter>
    );
    expect(screen.getByText('Create Blog Post')).toBeTruthy();
  });
});
