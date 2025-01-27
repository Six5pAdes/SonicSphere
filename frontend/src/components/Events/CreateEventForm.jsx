import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadGroupDetailsThunk } from "../../store/groups";
import { createEventThunk, addEventImageThunk } from "../../store/events";
import './EventForm.css';

const CreateEventForm = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector(state => state.groups[groupId]);

    const [name, setName] = useState('');
    const [type, setType] = useState('placeholder');
    const [capacity, setCapacity] = useState('');
    const [price, setPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [validErrors, setValidErrors] = useState({});

    useEffect(() => {
        dispatch(loadGroupDetailsThunk(groupId));
    }, [dispatch, groupId]);

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
            const newEvent = {
                venueId,
                name,
                type,
                capacity,
                price,
                description,
                startDate,
                endDate,
            };

            await dispatch(createEventThunk(newEvent, groupId))
                .then(async (event) => {
                    await dispatch(addEventImageThunk(event.id, image));
                    navigate(`/events/${event.id}`);
                })
                .catch(async (res) => {
                    const data = await res.json()
                    setValidErrors(data.errors)
                });
        }
    }

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <form className="event-form" onSubmit={handleSubmit}>
            <div id="event-head-contain">
                <h1>Create a new event for {group?.name}</h1>
                <label htmlFor="event-name">
                    <p>What is the name of your event?</p>
                </label>
                <input
                    name="event-name"
                    type="text"
                    id="event-name"
                    value={name}
                    placeholder="Event Name"
                    onChange={(e) => setName(e.target.value)}
                />
                {validErrors.name && <p className="err-msg">{validErrors.name}</p>}
            </div>

            <div>
                <label htmlFor="event-type">
                    <p>Is this an in person or online event?</p>
                </label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option disabled value="placeholder">Select one</option>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                {validErrors.type && <p className="err-msg">{validErrors.type}</p>}

                <label htmlFor="event-capacity">
                    <p>What is the capacity of the event?</p>
                </label>
                <input
                    type="number"
                    id="event-capacity"
                    placeholder="Event Capacity"
                    min={0}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />
                {validErrors.capacity && <p className="err-msg">{validErrors.capacity}</p>}

                <label htmlFor="event-price">
                    <p>What is the price of the event?</p>
                </label>
                <div id="price-contain">
                    <i className="fa-solid fa-dollar-sign"></i>
                    <input
                        type="number"
                        id="event-price"
                        step="0.01"
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
                    id="event-start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                {validErrors.startDate && <p className="err-msg">{validErrors.startDate}</p>}
                <label htmlFor="event-end-date">
                    <p>When does the event end?</p>
                </label>
                <input
                    type="datetime-local"
                    id="event-end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                {validErrors.endDate && <p className="err-msg">{validErrors.endDate}</p>}
            </div>

            <div>
                <label>
                    <h5>Please add an image url for your group below:</h5>
                    <textarea
                        placeholder='Image URL'
                        cols='30'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </label>
                {validErrors.image && <div className="err-msg">{validErrors.image}</div>}
            </div>

            <div>
                <label htmlFor="event-description">
                    <p>Please write a description for your event:</p>
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

            <div>
                <button onSubmit={handleSubmit}>Create Event</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    )
}

export default CreateEventForm;
