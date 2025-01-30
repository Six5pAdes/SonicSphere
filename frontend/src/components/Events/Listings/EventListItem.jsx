import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    Link,
    // useNavigate
} from "react-router-dom";
import {
    loadEventDetailsThunk,
    // deleteEventThunk
} from "../../../store/events";
// import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
// import { useModal } from "../../../context/Modal";
import "./EventList.css";

const EventListItem = ({ eventId,
    // isOwned, isAttending
}) => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const { closeModal } = useModal();
    const event = useSelector(state => state.events[eventId]);

    useEffect(() => {
        if (eventId && !event?.description) dispatch(loadEventDetailsThunk(eventId));
    }, [dispatch, eventId, event?.description]);

    // const handleDelete = async (e) => {
    //     e.preventDefault();
    //     await dispatch(deleteEventThunk(eventId));
    //     closeModal();
    //     navigate('/events');
    // }

    // const handleCancel = (e) => {
    //     e.preventDefault();
    //     closeModal();
    // }

    if (!event) return null;

    let date;
    let time;

    if (event && !event.message) {
        date = event.startDate.split(" ")[0];
        time = event.startDate.split(" ")[1];
        time = time?.slice(0, 5);
    }

    return (
        <li>
            <Link to={`/events/${event.id}`} event={event}>
                <div className='event-item-contain'>
                    <div className='event-img-contain'>
                        <img className='event-img' src={event?.EventImages?.find(img => img.preview === true)?.url} alt='Event' />
                    </div>
                    <div className='event-info'>
                        <h3>{date} • {"<"} {time} {">"}</h3>
                        <h2>{event.name}</h2>
                        {event.Venue ? (
                            <h4>{event.Venue?.city}, {event.Venue?.state}</h4>
                        ) : (<h4>Location TBD</h4>)}
                    </div>
                </div>
                <div className="event-description">
                    <p>{event.description}</p>
                </div>
            </Link>
            {/* <div className='event-btn-contain'>
                {isOwned && <button onClick={() => navigate(`/events/${event.id}/edit`)}>Update Event</button>}
                {isOwned && <OpenModalMenuItem
                    itemText='Delete Event'
                    modalComponent={
                        (<div id='confirm-delete'>
                            <h2>Confirm Delete</h2>
                            <span>Are you sure you want to remove this event?</span>
                            <button id='delete-complete' type='button' onClick={() => handleDelete(event.id)}>Yes (Delete Event)</button>
                            <button id='delete-cancel' type='button' onClick={handleCancel}>No (Keep Event)</button>
                        </div>)
                    }
                />}
                {isAttending && (
                    <button id="tba" onClick={() => alert("Feature coming soon")}>Leave Event</button>
                )}
            </div> */}
        </li>
    )
}

export default EventListItem;
