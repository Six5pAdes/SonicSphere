import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { thunkGetOneEvent, thunkDeleteEvent } from '../../store/events'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import './EventDetails.css';

export default function EventDetails() {
    const { eventId, group } = useParams();
    const dispatch = useDispatch();
    const nav = useNavigate();
    const { closeModal } = useModal();

    const event = useSelector(state => state.events.All[eventId]);
    const userId = useSelector(state => state.session.user?.id);

    useEffect(() => {
        dispatch(thunkGetOneEvent(eventId));
    }, [dispatch, eventId]);

    const handleDelete = () => {
        closeModal();
        dispatch(thunkDeleteEvent(eventId).then(nav('/events')));
    }
    const handleCancel = () => {
        return closeModal();
    }

    function gotoGroup() {
        nav(`/groups/${event?.groupId}`)
    }
    function updateEvent() {
        nav(`/events/${eventId}/edit`);
    }

    return (
        <div id='event-details-contain'>
            <div id='event-head'>
                <Link to='/events' className='back'><i className='fa-solid fa-angle-left'></i> Events</Link>
                <h2 className='event-name'>{event?.name}</h2>
                <h4>Hosted by {`${event?.Group?.Organizer?.firstName} ${event?.Group?.Organizer?.lastName}`}</h4>
            </div>
            <div id='event-body'>
                <div id='event-info'>
                    <div id='event-img-contain'>
                        <img id='event-img'
                            src={event?.EventImages?.find(image => image.preview === true)?.url}
                            alt='Event Preview' />
                    </div>
                    <div id='event-details'>
                        {/* navigate to group */}
                        <div id="grouptile" onClick={gotoGroup}>
                            <div id="grouptile-img-container">
                                <img id="grouptile-img" src={group?.GroupImages?.find((image) => image.preview === true)?.url} alt={`${group?.name} preview image`} />
                            </div>
                            <div id="grouptile-info">
                                <h5>{group?.name}</h5>
                                <h6>{group?.private ? 'Private' : 'Public'}</h6>
                            </div>
                        </div>

                        <div id='misc-info'>
                            <div className='what-to-know'>
                                <div id='clock'><i className='fa-regular fa-clock'></i></div>
                                <div id='when'>
                                    <h4>{`${new Date(event?.startDate).toLocaleString('en-us', { timeZone: 'PST8PDT' })}`.slice(0, 22)}</h4>
                                    <h4>{`${new Date(event?.endDate).toLocaleString('en-us', { timeZone: 'PST8PDT' })}`.slice(0, 22)}</h4>
                                </div>
                            </div>
                            <div className='what-to-know'>
                                <i className='fa-solid fa-dollar-sign'></i>
                                {event?.price === 0 ? "FREE" : `$${event?.price}`}
                            </div>
                            <div className='what-to-know'>
                                <i className='fa-solid fa-map-marker-alt'></i> {event?.type}
                            </div>
                            <span id='organizer-actions'>
                                {userId === event?.Group?.organizerId &&
                                    <>
                                        <button onClick={updateEvent}>Update Event</button>
                                        <OpenModalMenuItem itemText="Delete Event"
                                            modalComponent={(
                                                <div id='confirm-delete'>
                                                    <h2>Confirm Delete</h2>
                                                    <span>Are you sure you want to remove this event?</span>
                                                    <button id='delete-complete' type='button' onClick={handleDelete}>Yes (Delete Event)</button>
                                                    <button id='delete-cancel' type='button' onClick={handleCancel}>No (Keep Event)</button>
                                                </div>
                                            )}
                                        />
                                    </>}
                                {userId && userId != event?.Group?.organizerId && <>
                                    <button onClick={() => alert("Feature coming soon")}>Join this event</button>
                                </>}
                            </span>
                        </div>
                    </div>
                </div>
                <div id='event-description'>
                    <h2>Details</h2>
                    <h4>{event?.description}</h4>
                </div>
            </div>
        </div>
    )
}
