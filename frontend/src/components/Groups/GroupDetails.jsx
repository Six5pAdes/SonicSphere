import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal.jsx";
import { thunkGetGroups, thunkGetGroupById, thunkDeleteGroup } from "../../store/groups";
import { thunkGetGroupEvents } from "../../store/events";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem.jsx";
import OneGroupEvent from '../ItemListings/Events/OneGroupEvent';
import './GroupDetails.css';

export default function GroupDetails() {
    const { groupId } = useParams();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const ref = useRef();
    const { closeModal } = useModal();

    const group = useSelector(state => state.groups[groupId]);
    const groupImg = useSelector(state => state.groups.Groups[groupId]?.previewImage);
    const events = useSelector(state => state.events.Events[groupId?.id]);
    const userId = useSelector(state => state.session.user?.id);

    const past = useSelector(state => state.events.Past[group?.id]);
    const upcoming = useSelector(state => state.events.Upcoming[group?.id]);

    useEffect(() => {
        dispatch(thunkGetGroupById(groupId));
        dispatch(thunkGetGroupEvents(groupId));
        dispatch(thunkGetGroups());
    }, [dispatch, groupId]);

    function updateGroup() {
        nav(`/groups/${groupId}/edit`);
    }
    function newEvent() {
        nav(`/groups/${groupId}/events/new`);
    }

    const handleDelete = () => {
        closeModal();
        dispatch(thunkDeleteGroup(groupId).then(nav('/groups')));
    }
    const handleCancel = () => {
        return closeModal();
    }

    return (
        <div id="group-details-contain">
            <Link to="/groups" className="back"><i className="fa-solid fa-angle-left"></i>Groups</Link>
            <div id="group-details-contain">
                <div id="group-img-contain">
                    <img id="group-img" src={groupImg} alt="Group Preview" />
                </div>
                <div id="group-details-info">
                    <div className="group-info">
                        <h2 className="group-name">{group?.name}</h2>
                        <h4 className="group-location">{`${group?.city}, ${group?.state}`}</h4>
                        <div className="group-details">
                            <h4># {events?.length} events</h4>
                            <h4>&bull;</h4>
                            <h4>{group?.private ? "Private" : "Public"}</h4>
                        </div>
                        <h4>Organized by {`${group?.Organizer?.firstName} ${group?.Organizer?.lastName}`}</h4>
                    </div>
                    <span>
                        {userId === group?.organizerId && (
                            <div className="group-actions">
                                <button onClick={updateGroup}>Edit Group</button>
                                <button onClick={newEvent}>New Event</button>
                                <OpenModalMenuItem itemText="Delete Group"
                                    modalComponent={(
                                        <div id='confirm-delete'>
                                            <h2>Confirm Delete</h2>
                                            <span>Are you sure you want to remove this group?</span>
                                            <button id='delete-complete' type='button' onClick={handleDelete}>Yes (Delete Spot)</button>
                                            <button id='delete-cancel' type='button' onClick={handleCancel}>No (Keep Spot)</button>
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                        {userId !== group?.organizerId && (
                            <div className="to-be-added">
                                <button id='join-button' onClick={() => alert("Feature coming soon")}>Join</button>
                            </div>
                        )}
                    </span>
                </div>
            </div>
            {/* extra info */}
            <div ref={ref} id="extras-contain">
                <div id='organizer-info'>
                    <h2>Organizer</h2>
                    <h5>{`${group?.Organizer?.firstName} ${group?.Organizer?.lastName}`}</h5>
                </div>
                <div className="group-about">
                    <h2>What we&#39;re about</h2>
                    <p>{group?.about}</p>
                </div>
                <span className="event-listings">
                    {upcoming?.length > 0 &&
                        <h2>Upcoming Events &#40;{upcoming?.length}&#41;</h2>}
                    {upcoming?.map(event => (
                        <div key={event?.id}><OneGroupEvent event={event} /></div>))}
                </span>
                <span className="event-listings">
                    {past?.length > 0 &&
                        <h2>Past Events &#40;{past?.length}&#41;</h2>}
                    {past?.map(event => (
                        <div key={event?.id}><OneGroupEvent event={event} /></div>))}
                </span>
            </div>
        </div>
    )
}
