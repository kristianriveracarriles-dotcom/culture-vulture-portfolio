import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock WheelspinEngine to verify lazy loading without needing full Rive WebGL canvas initialization
vi.mock('./projects/wheelspin/WheelspinEngine', () => ({
  default: () => <div data-testid="wheelspin-engine-mock">Wheelspin Engine Mock</div>,
}));

describe('App Routing and Code Splitting', () => {
  it('renders the navbar and home page with PortfolioGrid by default', async () => {
    window.history.pushState({}, 'Home', '/');
    render(<App />);

    expect(screen.getByText('CULTURE VULTURE')).toBeInTheDocument();
    expect(screen.getByText('WHEELSPIN')).toBeInTheDocument();
    expect(screen.getByText('CARDS')).toBeInTheDocument();
    expect(screen.getByText('JACKPOT')).toBeInTheDocument();
  });

  it('dynamically loads WheelspinEngine when navigating to /wheelspin route', async () => {
    window.history.pushState({}, 'Wheelspin', '/wheelspin');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('wheelspin-engine-mock')).toBeInTheDocument();
    });
  });

  it('renders coming soon for unknown routes', async () => {
    window.history.pushState({}, 'Unknown', '/unknown-project');
    render(<App />);

    expect(screen.getByText('COMING SOON')).toBeInTheDocument();
  });
});
