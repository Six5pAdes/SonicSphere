import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadEventDetailsThunk, deleteEventThunk } from "../../store/events";
import { loadGroupDetailsThunk } from "../../store/groups";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useModal } from "../../context/Modal";
// import './EventDetails.css';

const EventDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const { closeModal } = useModal();
    const user = useSelector(state => state.session.user);
    const event = useSelector(state => state.events[eventId]);
    const group = useSelector(state => state.groups[event?.groupId]);
    const isUserOwner = group?.organizerId == user?.id;

    useEffect(() => {
        if (!event?.EventImages) dispatch(loadEventDetailsThunk(eventId));
        if (group && !group.Organizer) dispatch(loadGroupDetailsThunk(group?.id));
    }, [dispatch, eventId, event?.EventImages, group, group?.id]);

    const handleDelete = async (e) => {
        e.preventDefault();
        await dispatch(deleteEventThunk(eventId));
        closeModal();
        navigate('/events');
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeModal();
    }

    let eventImagesPreview;
    if (event?.previewImage) {
        eventImagesPreview = event.previewImage
    } else if (event?.EventImages) {
        eventImagesPreview = event?.EventImages?.find(image => image?.preview === true)?.url
    }

    let groupPreview;
    if (group?.GroupImages) {
        groupPreview = group?.GroupImages?.find(image => image.preview === true)?.url
    } else if (group?.previewImage) {
        groupPreview = group.previewImage
    }

    let startingDate;
    let startingTime;
    let endingDate;
    let endingTime;

    if (event?.startDate) {
        const starting = event.startDate.split(' ')
        startingDate = starting[0]
        startingTime = starting[1]
        startingTime = startingTime?.slice(0, 5)
        const ending = event.endDate?.split(' ')
        endingDate = ending[0]
        endingTime = ending[1]
        endingTime = endingTime?.slice(0, 5)
    }

    if (!event) return null;

    return (
        <>
            <div className="event-head">
                <span>{"<"}</span><Link className="goBack" to="/events">Back to Events</Link>
                <h1>{event?.name}</h1>
                <h4>Hosted by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h4>
            </div>

            <section className="event-sec">
                <div className="event-details">
                    <div className="event-img-contain">
                        {event?.EventImages && <img src={eventImagesPreview} alt="" />}
                    </div>
                    <div className="event-info">
                        <Link to={`/groups/${event.groupId}`}>
                            <div className="event-grp-card">
                                <div className="event-group-img-contain">
                                    {group?.GroupImages && <img src={groupPreview} />}
                                </div>
                                <div className="event-group-info">
                                    <h3>{group?.name}</h3>
                                    <h4>{group?.private ? "Private" : "Public"}</h4>
                                </div>
                            </div>
                        </Link>

                        <div className="event-stats">
                            <div className="time">
                                <div className="icon-contain">
                                    <i className="fa-regular fa-clock"></i>
                                </div>
                                <div className="time-heads">
                                    <p><span>START</span></p>
                                    <p><span>END</span></p>
                                </div>
                                <div className="time-dates">
                                    <p>{startingDate} • {'<'}{startingTime}{'>'}</p>
                                    <p>{endingDate} • {'<'}{endingTime}{'>'}</p>
                                </div>

                                <div className="price">
                                    <div className="icon-contain">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                    </div>
                                    <div className="price-stat">
                                        <span>{event?.price == 0 ? 'FREE' : event?.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="type">
                                    <div className="icon-contain">
                                        <i className="fa-solid fa-map-pin"></i>
                                    </div>
                                    <div className="type-stat">
                                        <span>{event?.type}</span>
                                    </div>

                                    <div className="user-btns-contain">
                                        {isUserOwner && <button onClick={() => navigate(`/events/${eventId}/edit`)}>Update Event</button>}
                                        {isUserOwner && <OpenModalMenuItem
                                            itemText="Delete Event"
                                            modalComponent={
                                                <div id="confirm-delete">
                                                    <h2>Confirm Delete</h2>
                                                    <span>Are you sure you want to remove this event?</span>
                                                    <button id="delete-complete" type="button" onClick={handleDelete}>Yes (Delete Event)</button>
                                                    <button id="delete-cancel" type="button" onClick={handleCancel}>No (Keep Event)</button>
                                                </div>
                                            }
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="event-description">
                        <p>{event?.description}</p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default EventDetails;
