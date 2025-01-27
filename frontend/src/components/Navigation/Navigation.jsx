import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div id='Navbar'>
            <NavLink to="/">
                <img id='logo' alt='Sonic Sphere' src='https://res.cloudinary.com/dqygc4mcu/image/upload/v1711420194/character%20sketchings/sonics-jun-2016_ghv0c8.png' href='/' />
            </NavLink>
            <NavLink to='/' className='site-title'>Sonic Sphere</NavLink>
            {isLoaded && (
                <div className='profile-area' id={sessionUser ? "logged" : "not-logged"}>
                    {sessionUser &&
                        <NavLink id='create-group-link' to={'/groups/new'}>Start a new group</NavLink>
                    }
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>
    );
}

export default Navigation;
