import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkGetUserEvents } from '../../../store/events';
import { Link } from "react-router-dom";
import OneGroupEvent from "./OneGroupEvent";
import './EventList.css';

function UserEvents() {
    const dispatch = useDispatch();
    const userEvents = useSelector(state => state.events);
    const events = Object.values(userEvents);

    useEffect(() => {
        dispatch(thunkGetUserEvents());
    }, [dispatch]);

    return (
        <>
            <div className="header">
                <h1>My Events</h1>
            </div>
            <div className="event-list">
                {events.map(event => (
                    <Link key={event.id} className='linkTo' to={`/events/${event.id}`}>
                        <OneGroupEvent event={event} />
                    </Link>
                ))}
            </div>
        </>
    )
}

export default UserEvents;
