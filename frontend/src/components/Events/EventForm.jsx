import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { thunkCreateEvent, thunkCreateEventImage, thunkUpdateEvent } from '../../store/events'
import { thunkGetGroupById } from '../../store/groups'
import './EventForm.css'

const EventForm = ({ event, formType }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [name, setName] = useState(event?.name)
    const [description, setDescription] = useState(event?.description)
    const [privateEvent, setPrivateEvent] = useState(event?.private)
    const [type, setType] = useState(event?.type)
    const [price, setPrice] = useState(event?.price)
    const [image, setImage] = useState(event?.image)
    const [startDate, setStartDate] = useState(event?.startDate)
    const [endDate, setEndDate] = useState(event?.endDate)
    const [errors, setErrors] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const { groupId } = useParams()
    const group = useSelector(state => state.groups[groupId])

    useEffect(() => {
        dispatch(thunkGetGroupById(groupId))
    }, [dispatch, groupId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisabled(true)
        setSubmitted(true)

        event = {
            name,
            capacity: 10,
            description,
            private: privateEvent,
            type,
            venueId: 1,
            price: Number(price),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        }

        if (Object.values(errors).length) {
            event.errors = errors
        }

        if (formType === 'Create Event' && !event.errors) {
            event = await dispatch(thunkCreateEvent(event, groupId))
            await dispatch(thunkCreateEventImage(event?.id, image))
        } else if (formType === 'Update Event' && !group.errors) {
            event = await dispatch(thunkUpdateEvent(event, groupId));
        } else {
            setDisabled(false)
            return null
        }

        if (event.errors) {
            setErrors(event.errors)
            setDisabled(false)
        } else {
            navigate(`/events/${event.id}`)
        }
    }

    useEffect(() => {
        const newErrs = {}

        if (!type) newErrs.type = 'Please select an event type'
        if (privateEvent === '') newErrs.private = 'Please select a privacy setting'
        if ((!image?.endsWith('.png') &&
            !image?.endsWith('.PNG') &&
            !image?.endsWith('.jpg') &&
            !image?.endsWith('.JPG') &&
            !image?.endsWith('.jpeg') &&
            !image?.endsWith('.JPEG'))) {
            newErrs.image = 'Please upload a valid image file (png, jpg, or jpeg)';
        }
        if (!description?.length < 30) newErrs.description = 'Description must be at least 30 characters'
        if (description?.includes('     ')) newErrs.about = 'Please remove extra spaces from your description';
        if (!name) newErrs.name = 'Please provide an event name'
        if (name?.length < 3) newErrs.name = 'Event name must be at least 3 characters'
        if (name?.length > 60) newErrs.name = 'Event name must be 60 characters or less'
        if (!price) newErrs.price = 'Please enter a price'
        if (!startDate) newErrs.startDate = 'Please enter a start date'
        if (new Date(startDate).getTime() < new Date().getTime()) newErrs.startDate = 'Start date must be in the future'
        if (!endDate) newErrs.endDate = 'Please enter an end date'
        if (new Date(endDate).getTime() <= new Date(startDate).getTime()) newErrs.endDate = 'End date must be after start date'

        setErrors(newErrs)
    }, [submitted, type, privateEvent, image, description, name, price, startDate, endDate])

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <form id="event-form" onSubmit={handleSubmit}>
            {formType === 'Create Event' ?
                <h2>{`Create a new event for ${group?.name}`}</h2> :
                <h2>{`Update ${event?.name}`}</h2>
            }
            <div id='event-name'>
                <h4 className="event-label">What is the name of your event?</h4>
                <label>
                    <textarea
                        className='event-text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Event Name'
                    />
                </label>
                {submitted && <div className="error-msg">{errors.name}</div>}
            </div>
            <div id='selection'>
                <div className={'selector type'}>
                    <h4 className="event-label">Is this an in person or online event?</h4>
                    <label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value={''} disabled>&#40;select one&#41;</option>
                            <option value={'Online'}>Online</option>
                            <option value={'In Person'}>In Person</option>
                        </select>
                    </label>
                    {submitted && <div className="error-msg">{errors.type}</div>}
                </div>
                <div className={'selector private'}>
                    <h4 className="event-label">Is this event private or public?</h4>
                    <label>
                        <select
                            value={privateEvent}
                            onChange={(e) => setPrivateEvent(e.target.value)}
                        >
                            <option value={''} disabled>&#40;select one&#41;</option>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>
                    </label>
                    {submitted && <div className="error-msg">{errors.private}</div>}
                </div>
                <div id='price'>
                    <h4 className="event-label">What is the price of your event?</h4>
                    <div>
                        <label>
                            <input
                                type='number'
                                placeholder='0.00'
                                min='0.00'
                                step='0.01'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                    </div>
                    {submitted && <div className="error-msg">{errors.price}</div>}
                </div>
            </div>
            <div id='dates'>
                <h4 className="event-label">When does your event start?</h4>
                <label htmlFor='start-date'>
                    <input
                        type='datetime-local'
                        id='start'
                        name='startDate'
                        placeholder='MM/DD/YYYY HH:mm AM'
                        value={startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                {submitted && <div className="error-msg">{errors.startDate}</div>}
                <h4 className="event-label">When does your event end?</h4>
                <label htmlFor='end-date'>
                    <input
                        type='datetime-local'
                        id='end'
                        name='endDate'
                        placeholder='MM/DD/YYYY HH:mm PM'
                        value={endDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
                {submitted && <div className="error-msg">{errors.endDate}</div>}
            </div>
            <div id='image'>
                <h4 className="event-label">Please add an image url for your event below:</h4>
                <label>
                    <textarea
                        className='event-text'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder='Image URL'
                    />
                </label>
                {submitted && <div className="error-msg">{errors.image}</div>}
            </div>
            <div id='description'>
                <h4 className="event-label">Please describe your event:</h4>
                <label>
                    <textarea
                        className='event-text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Please include at least 30 characters'
                    />
                </label>
                {submitted && <div className="error-msg">{errors.description}</div>}
            </div>

            <div className='buttons'>
                <button disabled={disabled} id="eventform-submit" type="submit">{formType}</button>
                <button id="cancel-button" type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    )
}

export default EventForm
