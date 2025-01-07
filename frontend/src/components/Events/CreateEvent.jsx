import EventForm from './EventForm'

export default function CreateEvent() {
    const event = {
        name: '',
        description: '',
        private: '',
        type: '',
        price: '',
        image: '',
        startDate: '',
        endDate: ''
    }

    return (<EventForm event={event} formType="Create Event" />)
}
