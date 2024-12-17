import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkGetGroupEvents } from '../../../store/events'
import { useNavigate } from "react-router-dom";
import './GroupList.css'

export default function OneGroup({ group }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const events = useSelector(state => state.events.Events[group?.id]);

    useEffect(() => {
        dispatch(thunkGetGroupEvents(group?.id))
    }, [dispatch, group?.id])

    function handleClick() {
        navigate(`/groups/${group.id}`)
    }

    return (
        <div className="one-group-contain">
            <div className="one-group" onClick={handleClick}>
                <div className="group-img-contain">
                    <img className="group-img" src={group?.image} alt="group" />
                </div>
                <div className="group-info">
                    <h2 className="group-name">{group?.name}</h2>
                    <h5 className="group-location">{`${group.city}, ${group.state}`}</h5>
                    <p className="group-about">{group?.about}</p>
                    <div className="group-description">
                        <h5># {events.length} event&#40;s&#41;</h5>
                        <h5>&bull;</h5>
                        <h5>{group.private ? "Private" : "Public"}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}
