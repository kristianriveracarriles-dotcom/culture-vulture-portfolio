import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PortfolioGrid from './PortfolioGrid';
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('PortfolioGrid Component', () => {
  let mockNavigate: any;
  let playMock: any;
  let pauseMock: any;

  beforeEach(() => {
    mockNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockNavigate);

    playMock = vi.fn().mockResolvedValue(undefined);
    pauseMock = vi.fn();

    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all project bands with correct titles', () => {
    render(<PortfolioGrid />);
    expect(screen.getByText('WHEELSPIN')).toBeInTheDocument();
    expect(screen.getByText('CARDS')).toBeInTheDocument();
    expect(screen.getByText('JACKPOT')).toBeInTheDocument();
  });

  it('plays and pauses video on hover events', async () => {
    render(<PortfolioGrid />);

    const wheelspinBand = screen.getByText('WHEELSPIN').closest('section');
    expect(wheelspinBand).toBeInTheDocument();

    if (wheelspinBand) {
      fireEvent.mouseEnter(wheelspinBand);
      expect(playMock).toHaveBeenCalled();

      fireEvent.mouseLeave(wheelspinBand);
      expect(pauseMock).toHaveBeenCalled();
    }
  });

  it('navigates to the correct project route on click', () => {
    render(<PortfolioGrid />);

    const cardsBand = screen.getByText('CARDS').closest('section');
    expect(cardsBand).toBeInTheDocument();

    if (cardsBand) {
      fireEvent.click(cardsBand);
      expect(mockNavigate).toHaveBeenCalledWith('/card');
    }
  });

  it('supports keyboard navigation via focus, blur, and Enter/Space keys', () => {
    render(<PortfolioGrid />);

    const wheelspinBand = screen.getByRole('link', { name: /View project: WHEELSPIN/i });
    expect(wheelspinBand).toBeInTheDocument();
    expect(wheelspinBand).toHaveAttribute('tabIndex', '0');

    // Focus triggers video play
    fireEvent.focus(wheelspinBand);
    expect(playMock).toHaveBeenCalled();

    // Blur triggers video pause
    fireEvent.blur(wheelspinBand);
    expect(pauseMock).toHaveBeenCalled();

    // Enter triggers navigation
    fireEvent.keyDown(wheelspinBand, { key: 'Enter', code: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/wheelspin');

    // Space triggers navigation
    fireEvent.keyDown(wheelspinBand, { key: ' ', code: 'Space' });
    expect(mockNavigate).toHaveBeenCalledWith('/wheelspin');
  });
});
