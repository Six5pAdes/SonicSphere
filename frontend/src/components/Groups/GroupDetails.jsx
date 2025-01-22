import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadGroupDetailsThunk, loadGroupEventsThunk, deleteGroupThunk, loadMembersThunk } from '../../store/groups';
// import EventListItem from '../../Events/Listings/EventListItem';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useModal } from '../../context/Modal';
// import './GroupDetails.css'

const GroupDetails = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const { closeModal } = useModal();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const group = groups[groupId];
    const events = useSelector(state => state.events);
    let groupEvent = useSelector(state => state.groups[groupId]?.Events);

    const numEvents = Object.values(events).filter(event => event.groupId == groupId).length;

    useEffect(() => {
        if (!group.Organizer) dispatch(loadGroupDetailsThunk(groupId));

        return () => null;
    }, [dispatch, groupId, group?.Organizer]);

    useEffect(() => {
        if (!group?.Events || group.Events.length !== numEvents) dispatch(loadGroupEventsThunk(groupId));
        return () => null;
    }, [dispatch, groupId, group?.Events, numEvents]);

    useEffect(() => {
        if (!group?.Members && user) dispatch(loadMembersThunk(groupId));
        return () => null;
    }, [dispatch, groupId, group?.Members, user]);

    if (!events) return null;

    const isOwner = user?.id === group?.organizerId;
    let isMember;
    if (group?.Members) {
        const members = Object.values(group?.Members);
        isMember = members.filter(member => {
            return member.id == user.id
        }).length > 0;
    }

    const now = new Date();
    const upcoming = []
    const past = []

    groupEvent?.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
    });

    groupEvent?.forEach(event => {
        new Date(event.startDate) > now ? upcoming.push(event) : past.push(event);
    })

    const handleDelete = async (e) => {
        e.preventDefault();
        await dispatch(deleteGroupThunk(groupId));
        closeModal();
        nav('/groups');
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeModal();
    }

    if (!group) return null;

    return (
        <div>
            <div className='back'>
                <span>{'<'}</span><Link id='goBack' to='/groups'>Back to Groups</Link>
            </div>

            <section className='group-details'>
                <div className='group-img-div'>
                    <img className='group-img' src={group?.GroupImages?.find(img => img.preview == true)?.url} alt='Group' />
                </div>

                <div className='group-info'>
                    <div>
                        <h1>{group.name}</h1>
                        <h3>{group.city}, {group.state}</h3>
                        <h4>{groupEvent.length ? groupEvent.length : 0}
                            events • {group.private ? "Private" : "Public"}
                        </h4>
                        <h4>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h4>
                    </div>
                    <div className='group-btns'>
                        {!isOwner && !isMember && <button id='tba' onClick={() => alert("Feature coming soon")}>Join</button>}
                        {isOwner && <button onClick={() => nav(`groups/${groupId}/events/new`)}>Create New Event</button>}
                        {isOwner && <button onClick={() => nav(`groups/${groupId}/edit`)}>Update</button>}
                        {isOwner && <OpenModalMenuItem
                            buttonText='Delete'
                            modalComponent={
                                (<div id='confirm-delete'>
                                    <h2>Confirm Delete</h2>
                                    <span>Are you sure you want to remove this group?</span>
                                    <button id='delete-complete' type='button' onClick={handleDelete}>Yes (Delete Group)</button>
                                    <button id='delete-cancel' type='button' onClick={handleCancel}>No (Keep Group)</button>
                                </div>)
                            }
                        />}
                    </div>
                </div>
            </section>

            <section className='group-events-contain'>
                <div className='group-events-info'>
                    <div>
                        <h2>Organizer</h2>
                        <h4>{group?.Organizer?.firstName} {group?.Organizer?.lastName}</h4>
                        <h3>What we&apos;re about</h3>
                        <p>{group.about}</p>
                    </div>
                    {!upcoming.length && !past.length && <h2>No events scheduled</h2>}
                    {upcoming.length != 0 && <div className='upcoming-events'>
                        <h2>Upcoming Events ({upcoming.length})</h2>
                        <ul>
                            {/* {upcoming.map(event => (
                                <EventListItem key={event.id} eventId={event.id} /> */}
                            <p></p>
                            {/* ))} */}
                        </ul>
                    </div>}
                    {past.length != 0 && <div className='past-events'>
                        <h2>Past Events ({past.length})</h2>
                        <ul>
                            {/* {past.map(event => (
                                <EventListItem key={event.id} eventId={event.id} /> */}
                            <p></p>
                            {/* ))} */}
                        </ul>
                    </div>}
                </div>
            </section>
        </div>
    )
}

export default GroupDetails;
