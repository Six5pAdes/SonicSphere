import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { useNavigate, NavLink } from 'react-router-dom';
import './ProfileButton.css';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const navigate = useNavigate();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        navigate('/');
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            {user ? (
                <div className='dropdown-contain'>
                    <div className='profile-contain' onClick={toggleMenu}>
                        <i className="fas fa-user-circle" />
                        {showMenu ? <i className="fas fa-caret-up" /> : <i className="fas fa-caret-down" />}
                    </div>
                    <div className={ulClassName} ref={ulRef}>
                        <ul>
                            <li className='floating'>Hello, {user.firstName}</li>
                            <li className='floating'>{user.email}</li>
                            <li className='floating'>
                                <NavLink className='dropdown-link' to='/groups'>View Groups</NavLink>
                            </li>
                            <li className='floating'>
                                <NavLink className='dropdown-link' to='/events'>View Events</NavLink>
                            </li>
                            <li className='floating logout'>
                                <button onClick={logout}>Log Out</button>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div>
                    <OpenModalMenuItem modalComponent={<LoginFormModal />} itemText='Log In' onItemClick={closeMenu} />
                    <OpenModalMenuItem modalComponent={<SignupFormModal />} itemText='Sign Up' onItemClick={closeMenu} />
                </div>
            )}
        </>
    );
}

export default ProfileButton;
