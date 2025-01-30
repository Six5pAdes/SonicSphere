import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUserEventsThunk } from "../../../store/session"
import EventListItem from "./EventListItem";
import "./EventList.css";

const ManageEvents = () => {
    const dispatch = useDispatch()
    const userEvents = useSelector(state => state.session.user.Events)

    useEffect(() => {
        dispatch(loadUserEventsThunk())
    }, [dispatch])

    let ownedEvents;
    let attendingEvents;

    if (userEvents) {
        ownedEvents = Object.values(userEvents.ownedEvents)
        attendingEvents = Object.values(userEvents.attendingEvents)
    }

    ownedEvents?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    attendingEvents?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

    return (
        <div className="manage-events-contain">
            <h1>Manage Events</h1>
            <h3>Your Events in Sonic Sphere</h3>

            {ownedEvents?.length ? (
                <div className="each-event">
                    <h4>Events you are hosting:</h4>
                    <ul>
                        {ownedEvents.map((event) => (
                            <EventListItem
                                key={event.id}
                                event={event}
                                eventId={event.id}
                                isOwned={true}
                            />
                        ))}
                    </ul>
                </div>
            ) : (
                <p>You are not hosting any events at the moment</p>
            )}
            {attendingEvents?.length ? (
                <div className="each-event">
                    <h4>Events you are attending:</h4>
                    <ul>
                        {attendingEvents.map((event) => (
                            <EventListItem
                                key={event.id}
                                event={event}
                                eventId={event.id}
                                isAttending={true}
                            />
                        ))}
                    </ul>
                </div>
            ) : (
                <p>You are not attending any events at the moment</p>
            )}
        </div>

    )
}

export default ManageEvents;
