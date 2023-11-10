import React from 'react';
import { Button } from 'react-bootstrap';

function Navbar({ currentAccount, appName }) {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-1 shadow">
            <a
                className="navbar-brand col-sm-3 col-md-2 mr-0"
                href="https://rumsan.com"
                target="_blank"
                rel="noopener noreferrer"
            >
                {appName || 'Rumsan Academy'}
            </a>
            {currentAccount ? (
                <Button variant="light">{currentAccount}</Button>
            ) : (
                <Button variant="danger">Wallet not connected</Button>
            )}
        </nav>
    );
}

export default Navbar;
