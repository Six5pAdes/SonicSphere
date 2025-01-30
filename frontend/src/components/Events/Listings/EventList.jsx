import EventListItem from './EventListItem';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadEventsThunk } from '../../../store/events';
import './EventList.css';

const EventList = () => {
    const events = useSelector(state => Object.values(state.events));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadEventsThunk());
    }, [dispatch]);

    events?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const upcoming = [];
    const past = [];
    const today = Date.now();

    events.forEach(event => {
        Date.parse(event.startDate) > today ? upcoming.push(event) : past.push(event);
    })

    return (
        <div className="event-list">
            <section>
                <div className="links-to">
                    <NavLink className='' to='/events'>Events</NavLink>
                    <NavLink className='' to='/groups'>Groups</NavLink>
                </div>
                <div>
                    <h2>All Current Events</h2>
                </div>
            </section>
            <section>
                <ul className="each-event">
                    {upcoming?.length > 0 && <h3>Upcoming Events</h3>}
                    {upcoming?.length > 0 && upcoming?.map((event) => (
                        <EventListItem
                            eventId={event.id}
                            key={event.id}
                        />
                    ))}
                    {past?.length > 0 && <h3 id='time-divide'>Past Events</h3>}
                    {past?.length > 0 && past?.map((event) => (
                        <EventListItem
                            eventId={event.id}
                            key={event.id}
                        />
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default EventList;
