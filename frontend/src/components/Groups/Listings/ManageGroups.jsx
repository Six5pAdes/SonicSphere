import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUserGroupsThunk } from '../../../store/session'
import GroupListItem from './GroupListItem';
import './GroupList.css';

const ManageGroups = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const userGroup = useSelector(state => state.session.user.Groups);

    useEffect(() => {
        dispatch(loadUserGroupsThunk())
    }, [dispatch]);

    let userGroups;
    if (userGroup) {
        userGroups = Object.values(userGroup);
    }

    return (
        <div className='manage-groups-contain'>
            <div className='manage-groups-header'>
                <h1>Manage Groups</h1>
                <h3>Your Groups in Sonic Sphere</h3>
            </div>
            <div className='each-group'>
                <ul>
                    {userGroups?.length ? (
                        userGroups.map((group) => (
                            <GroupListItem
                                key={group.id}
                                groupId={group.id}
                                isOwner={user.id == group.organizerId}
                                isMember={user.id != group.organizerId}
                            />
                        ))
                    ) : (
                        <p>You are not in any groups at the moment</p>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default ManageGroups;
