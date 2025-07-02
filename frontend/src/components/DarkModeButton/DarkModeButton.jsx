import { useState, useEffect } from 'react';
import './DarkModeButton.css';

function DarkModeButton() {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage for persisted state
        const stored = localStorage.getItem('darkMode');
        return stored === 'true';
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <button
            className="dark-mode-toggle-floating"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {darkMode ? (
                <><i className="fas fa-sun"></i> Light Mode</>
            ) : (
                <><i className="fas fa-moon"></i> Dark Mode</>
            )}
        </button>
    );
}

export default DarkModeButton;
