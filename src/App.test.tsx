import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock Rive and components if needed to prevent WASM issues in vitest
vi.mock('./projects/wheelspin/WheelspinEngine', () => ({
  default: () => <div data-testid="mock-wheelspin-engine">MOCK WHEELSPIN ENGINE</div>,
}));

describe('App Component', () => {
  it('renders the navbar and default portfolio grid route', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    expect(screen.getByText('CULTURE VULTURE')).toBeInTheDocument();
    expect(screen.getByText('WHEELSPIN')).toBeInTheDocument();
    expect(screen.getByText('CARDS')).toBeInTheDocument();
    expect(screen.getByText('JACKPOT')).toBeInTheDocument();
  });

  it('renders lazy-loaded wheelspin route when navigated to /wheelspin', async () => {
    window.history.pushState({}, '', '/wheelspin');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-wheelspin-engine')).toBeInTheDocument();
    });
  });
});
