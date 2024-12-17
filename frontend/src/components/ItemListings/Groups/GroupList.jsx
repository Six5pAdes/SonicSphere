import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroups, selectGroupsArray } from '../../../store/groups'
import { useEffect } from "react";
import OneGroup from "./OneGroup";
import AllLists from '../Navigating/AllLists';
import './GroupList.css'

export default function GroupList() {
    const groups = useSelector(selectGroupsArray);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetGroups())
    }, [dispatch])

    return (
        <section id="group-list-sec">
            <AllLists />
            <h3 id="groups-title">All Current Groups</h3>
            <ul id="group-list">
                {groups.map(group => <OneGroup key={group.id} group={group} />)}
            </ul>
        </section>
    )
}
