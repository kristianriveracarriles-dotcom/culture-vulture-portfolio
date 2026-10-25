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

  it('has accessible role, tabIndex, and aria-label', () => {
    render(<PortfolioGrid />);

    const wheelspinBtn = screen.getByRole('button', { name: /View WHEELSPIN project/i });
    expect(wheelspinBtn).toBeInTheDocument();
    expect(wheelspinBtn).toHaveAttribute('tabIndex', '0');
  });

  it('plays and pauses video on focus and blur events', () => {
    render(<PortfolioGrid />);

    const wheelspinBtn = screen.getByRole('button', { name: /View WHEELSPIN project/i });
    fireEvent.focus(wheelspinBtn);
    expect(playMock).toHaveBeenCalled();

    fireEvent.blur(wheelspinBtn);
    expect(pauseMock).toHaveBeenCalled();
  });

  it('navigates on Enter and Space key presses', () => {
    render(<PortfolioGrid />);

    const cardsBtn = screen.getByRole('button', { name: /View CARDS project/i });

    fireEvent.keyDown(cardsBtn, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/card');

    mockNavigate.mockClear();

    fireEvent.keyDown(cardsBtn, { key: ' ' });
    expect(mockNavigate).toHaveBeenCalledWith('/card');
  });
});
