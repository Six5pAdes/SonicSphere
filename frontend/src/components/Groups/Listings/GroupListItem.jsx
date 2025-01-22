import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import { useModal } from '../../../context/Modal';
import { loadGroupEventsThunk, deleteGroupThunk } from '../../../store/groups';
import { loadUserGroupEventsThunk } from '../../../store/session'
import './GroupList.css'

const GroupListItem = ({ groupId, isOwner, isMember }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const group = useSelector(state => state.groups[groupId]);

    useEffect(() => {
        if (isOwner || isMember) dispatch(loadUserGroupEventsThunk(groupId));
    }, [dispatch, groupId, isOwner, isMember]);

    useEffect(() => {
        dispatch(loadGroupEventsThunk(groupId));
    }, [dispatch, groupId]);

    const handleDelete = async (e) => {
        e.preventDefault();
        await dispatch(deleteGroupThunk(groupId));
        closeModal();
        navigate('/groups');
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeModal();
    }

    if (!group) return null;

    return (
        <li>
            <Link to={`/groups/${group.id}`}>
                <div className='grp-item-contain'>
                    <div className='grp-img-contain'>
                        <img className='grp-img' src={group?.previewImage} alt='Group' />
                    </div>
                    <div className='grp-info'>
                        <h2>{group.name}</h2>
                        <h4>{group.city}, {group.state}</h4>
                        <p>{group.about}</p>
                        <div className='other-info'>
                            <div className='event-type-contain'>
                                <span>Events: {group.Events?.length}</span>
                                <span> • </span>
                                <span>{group.private ? "Private" : "Public"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className='grp-btn-contain'>
                {isOwner && <button onClick={() => navigate(`/groups/${group.id}/edit`)}>Update</button>}
                {isOwner && <OpenModalMenuItem
                    buttonText='Delete'
                    modalComponent={
                        (<div id='confirm-delete'>
                            <h2>Confirm Delete</h2>
                            <span>Are you sure you want to remove this group?</span>
                            <button id='delete-complete' type='button' onClick={() => handleDelete(group.id)}>Yes (Delete Group)</button>
                            <button id='delete-cancel' type='button' onClick={handleCancel}>No (Keep Group)</button>
                        </div>)
                    }
                />}
                {isMember && <button id='tba' onClick={() => alert("Feature coming soon")}>Join</button>}
            </div>
        </li>
    )
}

export default GroupListItem;
