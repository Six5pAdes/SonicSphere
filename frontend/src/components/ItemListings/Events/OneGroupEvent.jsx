import { useNavigate } from "react-router-dom";
import './EventList.css';

export default function OneGroupEvent({ event }) {
    const nav = useNavigate();

    function handleClick() {
        nav(`/events/${event.id}`);
    }

    return (
        <span className="one-event-contain">
            <div className="one-event" onClick={handleClick}>
                <div className="event-img-contain">
                    <img className="event-img" src={event?.previewImage} alt={`${event.name} image`} />
                </div>
                <div className="event-info">
                    <h2 className="event-name">{event.name}</h2>
                    <h5>{`${new Date(event?.startDate).toLocaleString('en-us', { timeZone: 'PST8PDT' })}`.slice(0, 22)}</h5>
                    <h5>{`${event.Group.city}, ${event.Group.state}`}</h5>
                </div>
                <p className="event-description">{event.description}</p>
            </div>
        </span>
    );
}
