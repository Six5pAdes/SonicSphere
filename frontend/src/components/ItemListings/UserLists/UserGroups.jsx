import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkGetUserGroups } from '../../../store/groups';
import { Link } from "react-router-dom";
import OneGroup from "../Groups/OneGroup";
import './UserList.css';

function UserGroups() {
    const dispatch = useDispatch();
    const userGroups = useSelector(state => state.groups);
    const groups = Object.values(userGroups);

    useEffect(() => {
        dispatch(thunkGetUserGroups());
    }, [dispatch]);

    return (
        <>
            <div className="header">
                <h1>My Groups</h1>
            </div>
            <div className="user-list">
                {groups.map(group => (
                    <Link key={group.id} className='linkTo' to={`/groups/${group.id}`}>
                        <OneGroup group={group} />
                    </Link>
                ))}
            </div>
        </>
    )
}

export default UserGroups;
