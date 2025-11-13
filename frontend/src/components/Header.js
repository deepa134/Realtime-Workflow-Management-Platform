import React from 'react';

const Header = ({ userRole, userName, onLogout }) => {
    
    // Links are now defined but won't be used in the return statement
    let navLinks = [];
    const role = userRole ? userRole.toLowerCase() : 'employee'; 
    const roleTitle = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Employee';
    
    // (Link logic remains but is irrelevant for rendering now)

    return (
        <header className="dashboard-header">
            <div className="dashboard-header-left">
                <h1>{roleTitle} Portal</h1>
            </div>
            
            <div className="role-nav-container">
                {/* 💡 FIX 1: Display the passed userName, falling back gracefully */}
                <span className="welcome-message">Welcome, {userName || roleTitle}!</span>

                {/* ❌ FIX 2: Remove the entire navigation block that contains the links */}
                {/* <nav className="role-links">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.path} 
                        >
                            {link.name}
                        </a>
                    ))}
                </nav> 
                */}
                
                {/* Logout Button */}
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;