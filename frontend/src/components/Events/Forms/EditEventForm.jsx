import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadEventDetailsThunk, updateEventThunk } from '../../../store/events';
import './EventForm.css';

const EditEventForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const event = useSelector(state => state.events[eventId]);
    const user = useSelector(state => state.session.user);
    const group = useSelector(state => state.groups[event?.groupId]);

    const [name, setName] = useState(event?.name);
    const [type, setType] = useState(event?.type);
    const [capacity, setCapacity] = useState(event?.capacity);
    const [price, setPrice] = useState(event?.price);
    const [startDate, setStartDate] = useState(event?.startDate);
    const [endDate, setEndDate] = useState(event?.endDate);
    const [description, setDescription] = useState(event?.description);
    const [image, setImage] = useState(event?.image);
    const [validErrors, setValidErrors] = useState({});
    const isUserOwner = group?.organizerId == user?.id;

    if (isUserOwner == false) navigate(`/events/${event?.id}`);

    useEffect(() => {
        dispatch(loadEventDetailsThunk(eventId));
    }, [dispatch, eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValidErrors({});

        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (name.length < 5) errors.name = 'Name must be at least 5 characters';
        if (!type) errors.type = 'Type is required';
        if (!capacity) errors.capacity = 'Event capacity is required';
        if (!price) errors.price = 'Price is required';
        if (!startDate) errors.startDate = 'Start date is required';
        if (new Date(startDate).getTime() <= new Date().getTime()) errors.startDate = 'Start date must be in the future';
        if (new Date(startDate).getTime() > new Date(endDate).getTime()) errors.endDate = 'Start date must be before end date';
        if (!endDate) errors.endDate = 'End date is required';
        if ((!image?.endsWith('.png') && !image?.endsWith('.PNG') && !image?.endsWith('.jpg') && !image?.endsWith('.JPG') && !image?.endsWith('.jpeg') && !image?.endsWith('.JPEG'))) {
            errors.image = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (description.length < 30) errors.description = 'Description must be at least 30 characters';

        if (Object.values(errors).length) {
            setValidErrors(errors);
        } else {
            const venueId = null;
            const eventInfo = {
                venueId,
                name,
                type,
                capacity,
                price,
                description,
                startDate,
                endDate,
            };

            await dispatch(updateEventThunk(eventId, eventInfo))
                .then(async (event) => {
                    navigate(`/events/${event.id}`);
                })
                .catch(async (res) => {
                    const data = await res.json();
                    setValidErrors(data.errors);
                })
        }
    }

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <form className="event-form" onSubmit={handleSubmit}>
            <div id="event-head-contain">
                <h1>Update Your Event</h1>
                <label htmlFor="event-name">
                    <p>What is the name of your event?</p>
                </label>
                <input
                    name="event-name"
                    id="event-name"
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {validErrors.name && <p className="err-msg">{validErrors.name}</p>}
            </div>

            <div>
                <label htmlFor="event-type">
                    <p>Is this an in person or online event?</p>
                </label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option disabled value="select-one">Select one</option>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                {validErrors.type && <p className="err-msg">{validErrors.type}</p>}

                <label htmlFor="event-capacity">
                    <p>What is the capacity of the event?</p>
                </label>
                <input
                    type="number"
                    name="event-capacity"
                    id="event-capacity"
                    placeholder="Capacity"
                    value={capacity}
                    min={0}
                    onChange={(e) => setCapacity(e.target.value)}
                />
                {validErrors.capacity && <p className="err-msg">{validErrors.capacity}</p>}

                <label htmlFor="event-price">
                    <p>What is the price of the event?</p>
                </label>
                <div id="price-contain">
                    <i className="fa-solid fa-dollar-sign"></i>
                    <input
                        id="event-price"
                        step="0.01"
                        type="number"
                        name="price"
                        placeholder="0.00"
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {validErrors.price && <p className="err-msg">{validErrors.price}</p>}
            </div>

            <div>
                <label htmlFor="event-start-date">
                    <p>When does the event start?</p>
                </label>
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                {validErrors.startDate && <p className="err-msg">{validErrors.startDate}</p>}

                <label htmlFor="event-end-date">
                    <p>When does the event end?</p>
                </label>
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                {validErrors.endDate && <p className="err-msg">{validErrors.endDate}</p>}
            </div>

            <div>
                <label>
                    <p>Please add an image url for your group below:</p>
                    <input
                        id="event-imgURL"
                        // type="file"
                        // accept=".jpg, .png, .jpeg"
                        type="text"
                        placeholder="Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </label>
                {validErrors.image && <div className="err-msg">{validErrors.image}</div>}
            </div>

            <div>
                <label htmlFor="event-description">
                    <p>Describe your event:</p>
                </label>
                <textarea
                    name="event-description"
                    id="event-description"
                    cols="30"
                    rows="10"
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {validErrors.description && <p className="err-msg">{validErrors.description}</p>}
            </div>

            <div className="buttons-contain">
                <button id="submit-button" type="submit">Update Event</button>
                <button id="cancel-button" type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    )

}

export default EditEventForm;
