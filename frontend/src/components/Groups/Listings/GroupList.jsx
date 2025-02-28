import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { loadGroupsThunk } from "../../../store/groups";
import GroupListItem from './GroupListItem';
import "./GroupList.css";

const GroupList = () => {
    const groups = useSelector(state => Object.values(state.groups));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadGroupsThunk());
    }, [dispatch]);

    return (
        <div className="group-list">
            <section>
                <div className="links-to">
                    <NavLink className='' to='/events'>Events</NavLink>
                    <NavLink className='' to='/groups'>Groups</NavLink>
                </div>
                <div>
                    <h2>All Current Groups</h2>
                </div>
            </section>
            <section>
                <ul className="each-group">
                    {groups.map((group) => (
                        <GroupListItem
                            groupId={group.id}
                            key={group.id}
                        />
                    ))}
                </ul>
            </section>
        </div >
    );
}

export default GroupList;
