import { useNavigate } from "react-router-dom";
import './EventList.css';

export default function OneGroupEvent({ event }) {
    const nav = useNavigate();

    function handleClick() {
        nav(`/events/${event.id}`);
    }

    return (
        <span className="one-event-contain">
            <div className="event" onClick={handleClick}>
                <div className="event-display">
                    <div className="event-image">
                        <img src={event.previewImage} alt={`${event.name} image`} />
                    </div>
                    <div className="event-info">
                        <h3>{event.name}</h3>
                        <h5>{`${new Date(event?.startDate).toLocaleString('en-us', { timeZone: 'PST8PDT' })}`.slice(0, 22)}</h5>
                        <h5>{`${event.Group.city}, ${event.Group.state}`}</h5>
                    </div>
                </div>
                <p className="event-description">{event.description}</p>
            </div>
        </span>
    );
}
