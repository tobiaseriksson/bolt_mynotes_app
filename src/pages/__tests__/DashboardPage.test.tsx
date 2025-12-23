import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../DashboardPage';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import * as notesService from '../../services/notes';

vi.mock('../../contexts/AuthContext');
vi.mock('../../contexts/ThemeContext');
vi.mock('../../services/notes');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('DashboardPage', () => {
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

  it('should render dashboard page', () => {
    vi.mocked(notesService.fetchNotes).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(true).toBe(true);
  });

  it('should have page title "Your Notes"', () => {
    vi.mocked(notesService.fetchNotes).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    const title = screen.queryByText('Your Notes');
    expect(title).toBeTruthy();
  });

  it('should have Add Note button', () => {
    vi.mocked(notesService.fetchNotes).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    const addButton = screen.queryByText('Add Note');
    expect(addButton).toBeTruthy();
  });

  it('should call fetchNotes when component mounts', () => {
    vi.mocked(notesService.fetchNotes).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(notesService.fetchNotes).toHaveBeenCalled();
  });

  it('should render all buttons', () => {
    vi.mocked(notesService.fetchNotes).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
