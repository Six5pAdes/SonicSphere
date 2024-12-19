import { useParams } from "react-router-dom";
import EventForm from "./EventForm";
import { thunkGetOneEvent } from "../../store/events";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

const UpdateEvent = () => {
    // const navigate = useNavigate();
    const { eventId } = useParams();
    const dispatch = useDispatch();

    // const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkGetOneEvent(eventId));
    }, [dispatch, eventId]);

    const event = useSelector(state => state.events[eventId]);
    const eventImage = useSelector(state => state.events.Events[eventId])

    if (!event) return (<></>)

    return (
        Object.keys(event).length > 1 && (
            <>
                <EventForm
                    event={{
                        name: event?.name,
                        description: event?.description,
                        private: event?.private === 'true',
                        type: event?.type,
                        price: event?.price,
                        image: eventImage?.previewImage,
                        startDate: event?.startDate,
                        endDate: event?.endDate
                    }}
                    eventId={eventId}
                    formType="Update Event"
                />
            </>
        )
    )
}

export default UpdateEvent;
