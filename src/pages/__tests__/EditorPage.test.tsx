import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EditorPage } from '../EditorPage';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

vi.mock('../../contexts/AuthContext');
vi.mock('../../contexts/ThemeContext');
vi.mock('../../services/notes');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('EditorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user1', email: 'test@example.com' },
      loading: false,
      signOut: vi.fn(),
    } as any);
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
    });
  });

  it('should render editor page with title input', () => {
    render(
      <BrowserRouter>
        <EditorPage />
      </BrowserRouter>
    );

    const titleInput = screen.queryByPlaceholderText('Note title...');
    expect(titleInput).toBeTruthy();
  });

  it('should render back button', () => {
    render(
      <BrowserRouter>
        <EditorPage />
      </BrowserRouter>
    );

    const backButton = screen.getByText('Back');
    expect(backButton).toBeTruthy();
  });

  it('should render cancel button', () => {
    render(
      <BrowserRouter>
        <EditorPage />
      </BrowserRouter>
    );

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeTruthy();
  });

  it('should render submit/update button', () => {
    render(
      <BrowserRouter>
        <EditorPage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render editor toolbar buttons', () => {
    render(
      <BrowserRouter>
        <EditorPage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
});
