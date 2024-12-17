import { useParams, useNavigate } from "react-router-dom";
import GroupForm from "./GroupForm";
import { thunkGetGroupById } from '../../store/groups'
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

const UpdateGroup = () => {
    const navigate = useNavigate();
    const { groupId } = useParams();
    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkGetGroupById(groupId));
    }, [dispatch, groupId]);

    const group = useSelector(state => state.groups[groupId]);
    const groupImage = useSelector(state => state.groups.Groups[groupId])

    if (!group) return (<></>)
    if (user.id !== group.organizerId) navigate(`/`)

    return (
        Object.keys(group).length > 1 && (
            <>
                <GroupForm
                    group={{
                        name: group?.name,
                        location: `${group?.city}, ${group?.state}`,
                        about: group?.about,
                        type: group?.type,
                        private: group?.private === 'true',
                        image: groupImage?.previewImage
                    }}
                    groupId={groupId}
                    formType="Update Group"
                />
            </>
        )
    )
}

export default UpdateGroup;
