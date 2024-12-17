import { NavLink } from "react-router-dom";
import './AllLists.css';

export default function AllLists() {
    return (
        <div className="all-lists">
            <NavLink className='list-link' to='/events'>Events</NavLink>
            <NavLink className='list-link' to='/groups'>Groups</NavLink>
        </div>
    )
}
