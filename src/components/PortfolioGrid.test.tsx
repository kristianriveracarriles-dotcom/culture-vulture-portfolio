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

  it('renders all project bands with correct titles and accessibility attributes', () => {
    render(<PortfolioGrid />);
    const wheelspinTitle = screen.getByText('WHEELSPIN');
    expect(wheelspinTitle).toBeInTheDocument();
    expect(screen.getByText('CARDS')).toBeInTheDocument();
    expect(screen.getByText('JACKPOT')).toBeInTheDocument();

    const wheelspinBand = wheelspinTitle.closest('section');
    expect(wheelspinBand).toHaveAttribute('role', 'button');
    expect(wheelspinBand).toHaveAttribute('tabindex', '0');
    expect(wheelspinBand).toHaveAttribute('aria-label', 'View WHEELSPIN project: Aggressive Motion Architecture');
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

  it('plays and pauses video on focus and blur events', async () => {
    render(<PortfolioGrid />);

    const wheelspinBand = screen.getByText('WHEELSPIN').closest('section');
    expect(wheelspinBand).toBeInTheDocument();

    if (wheelspinBand) {
      fireEvent.focus(wheelspinBand);
      expect(playMock).toHaveBeenCalled();

      fireEvent.blur(wheelspinBand);
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

  it('navigates to the correct project route on Enter and Space keypress', () => {
    render(<PortfolioGrid />);

    const wheelspinBand = screen.getByText('WHEELSPIN').closest('section');
    expect(wheelspinBand).toBeInTheDocument();

    if (wheelspinBand) {
      fireEvent.keyDown(wheelspinBand, { key: 'Enter' });
      expect(mockNavigate).toHaveBeenCalledWith('/wheelspin');

      fireEvent.keyDown(wheelspinBand, { key: ' ' });
      expect(mockNavigate).toHaveBeenCalledWith('/wheelspin');
    }
  });
});
