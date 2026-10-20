import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  const renderNavbar = () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  it('renders the logo text correctly', () => {
    renderNavbar();
    const logoElement = screen.getByText('CULTURE VULTURE');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveClass('nav__logo');
    expect(logoElement).toHaveAttribute('data-text', 'CULTURE VULTURE');
  });

  it('renders the PRODUCTIONS tag', () => {
    renderNavbar();
    const productionsTag = screen.getByText('PRODUCTIONS');
    expect(productionsTag).toBeInTheDocument();
    expect(productionsTag).toHaveClass('productions-tag');
  });

  it('renders the MENU text', () => {
    renderNavbar();
    const menuElement = screen.getByText('MENU');
    expect(menuElement).toBeInTheDocument();
    expect(menuElement).toHaveClass('nav__menu');
  });

  it('wraps the logo in a Link pointing to home', () => {
    renderNavbar();
    const logoElement = screen.getByText('CULTURE VULTURE');
    const linkElement = logoElement.closest('a');

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/');
  });
});
