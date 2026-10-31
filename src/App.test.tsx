import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock Rive hooks & components to prevent canvas/WASM loading in tests
vi.mock('./projects/wheelspin/WheelspinEngine', () => ({
  default: () => <div data-testid="mock-wheelspin-engine">Wheelspin Engine Component</div>,
}));

describe('App Component', () => {
  it('renders landing page with PortfolioGrid by default', () => {
    window.history.pushState({}, 'Home', '/');
    render(<App />);

    expect(screen.getByText('CULTURE VULTURE')).toBeInTheDocument();
    expect(screen.getByText('WHEELSPIN')).toBeInTheDocument();
    expect(screen.getByText('CARDS')).toBeInTheDocument();
    expect(screen.getByText('JACKPOT')).toBeInTheDocument();
  });

  it('renders lazy loaded WheelspinEngine when navigating to /wheelspin', async () => {
    window.history.pushState({}, 'Wheelspin', '/wheelspin');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-wheelspin-engine')).toBeInTheDocument();
    });
  });

  it('renders fallback for other project routes', () => {
    window.history.pushState({}, 'Other', '/card');
    render(<App />);

    expect(screen.getByText('COMING SOON')).toBeInTheDocument();
  });
});
