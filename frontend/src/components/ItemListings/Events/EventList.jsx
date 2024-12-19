import { useDispatch, useSelector } from 'react-redux';
import { thunkGetEvents, selectEventsArray } from '../../../store/events'
import { useEffect } from 'react';
import OneGroupEvent from './OneGroupEvent';
import AllLists from '../AllLists/AllLists';
import './EventList.css';

export default function EventList() {
    const dispatch = useDispatch();
    const events = useSelector(selectEventsArray);

    useEffect(() => {
        dispatch(thunkGetEvents());
    }, [dispatch]);

    return (
        <section id="event-list-sec">
            <AllLists />
            <h3 id="events-title">All Current Events</h3>
            <ul id="event-list">
                {events.map(event => (
                    <div key={event?.id}><OneGroupEvent event={event} /></div>))}
            </ul>
        </section>
    );
}
