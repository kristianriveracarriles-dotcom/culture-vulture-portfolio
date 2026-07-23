import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    // Find the wheelspin section (we can look for the title or tag)
    const wheelspinBand = screen.getByText('WHEELSPIN').closest('section');
    expect(wheelspinBand).toBeInTheDocument();

    if (wheelspinBand) {
        // Trigger hover
        fireEvent.mouseEnter(wheelspinBand);
        expect(playMock).toHaveBeenCalled();

        // Trigger hover out
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
});
