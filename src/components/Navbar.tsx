import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="nav">
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="nav__logo reg-error" data-text="CULTURE VULTURE">CULTURE VULTURE</div>
            </Link>
            <div className="productions-tag">PRODUCTIONS</div>
            <div className="nav__menu">MENU</div>
        </nav>
    );
};

export default Navbar;
