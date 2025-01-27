import { NavLink } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useSelector } from 'react-redux';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import React from 'react';
import './LandingPage.css';

export default function LandingPage() {
    const sessionUser = useSelector(state => state.session.user);

    const rings = [];
    for (let i = 0; i < 26; i++) {
        rings.push(<i className='fa-solid fa-ring'></i>);
    }

    return (
        <div id="landing-page">
            <div id='intro'>
                <div className='intro-text' id='content'>
                    <h1>The people platform — Where interests become friendships</h1>
                    <div>
                        {rings.map((ring, i) => (
                            <React.Fragment key={i}>{ring}</React.Fragment>
                        ))}
                    </div>
                    <p>Whether you&#39;re into blazing trails, speeding through stories, or teaming up with like-minded folks to level up your skills, Sonic Sphere has thousands of people ready to share the adventure. Events are spinning up every day — jump in and join the action!</p>
                </div>
                <div className='intro-text' id='picture'>
                    <img src='https://res.cloudinary.com/dqygc4mcu/image/upload/v1733948484/sonic_pict/Sonic_Chip_apotos_kmihrk.jpg' alt='' />
                </div>
            </div>

            {/* all features here */}
            <div id='what-to-do'>
                <div id='instructions'>
                    <h2>How Sonic Sphere Works...</h2>
                    <p>
                        Sonic Sphere is a platform that allows you to find groups and events that interest you. You can join groups to meet new people and participate in activities, or you can create your own group and invite others to join you. You can also create events and invite others to join you in those events. Sonic Sphere is a great way to meet new people and have fun!
                    </p>
                </div>
                <div id='site-options'>
                    <div className='action'>
                        <img className='action-img' src='https://res.cloudinary.com/dqygc4mcu/image/upload/v1711420255/character%20sketchings/tails-jul-2014_ay4jug.png' alt='' />
                        <NavLink className={'action-link'} to='/groups'>See All Groups</NavLink>
                        <p className='description'>Look through the groups currently active, and find the one that best suits your fancy!</p>
                    </div>
                    <div className='action'>
                        <img className='action-img' src='https://res.cloudinary.com/dqygc4mcu/image/upload/v1711420301/character%20sketchings/amy-apr-2016_gy5ijn.png' alt='' />
                        <NavLink className={'action-link'} to='/events'>See All Events</NavLink>
                        <p className='description'>There are plenty of events and activities that have happened, are happening, and will happen. It&#39;s up to you to figure out your next adventure!</p>
                    </div>
                    <div className='action'>
                        <img className='action-img' src='https://res.cloudinary.com/dqygc4mcu/image/upload/v1711417675/character%20sketchings/knuckles-may-2013_bm5oec.png' alt='' />
                        {sessionUser ?
                            <NavLink className={'action-link'} to={'/groups/new'}>Start a New Group</NavLink> :
                            <p className={'unavailable action-link'}>Log in to start a new group</p>}
                        <p className='description'>If you don&#39;t see something calling out to you, then feel free to start your own group and call others out to join you!</p>
                    </div>
                </div>
                {!sessionUser && <div id='buttons'>
                    <OpenModalMenuItem modalComponent={<SignupFormModal />} itemText='Join Sonic Sphere Today!' />
                </div>}
            </div>
        </div>
    );
}

function OpenModalMenuItem({
    modalComponent,
    itemText,
    onItemClick,
    onModalClose
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) {
            setOnModalClose(onModalClose);
        }
        setModalContent(modalComponent);
        if (typeof onItemClick === 'function') {
            onItemClick();
        }
    }

    return (
        <button id='join-button' onClick={onClick}>{itemText}</button>
    )
}
