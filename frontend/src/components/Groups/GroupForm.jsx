import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkCreateGroup, thunkUpdateGroup } from '../../store/groups'
import { thunkCreateGroupImage } from '../../store/groupimages'
import './GroupForm.css'

const GroupForm = ({ group, formType, groupId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState(group?.name);
    const [location, setLocation] = useState(group?.location);
    const [about, setAbout] = useState(group?.about);
    const [privateGroup, setPrivateGroup] = useState(group?.private);
    const [type, setType] = useState(group?.type);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDisabled(true);
        setSubmitted(true);

        const [city, state] = location.split(', ');
        group = { city, state, name, about, private: privateGroup, type };

        if (Object.values(errors).length) {
            group.errors = errors;
        }

        if (formType === 'Create Group' && !group.errors) {
            group = await dispatch(thunkCreateGroup(group));
            await dispatch(thunkCreateGroupImage(group?.id, image));
        } else if (formType === 'Update Group' && !group.errors) {
            group = await dispatch(thunkUpdateGroup(group, groupId));
        } else {
            setDisabled(false);
            return null;
        }

        if (group.errors) {
            setErrors(group.errors);
            setDisabled(false);
        } else {
            navigate(`/groups/${group.id}`);
        }
    }

    useEffect(() => {
        const newErrs = {};

        if (!type) newErrs.type = 'Please select a group type';
        if (privateGroup === '') newErrs.private = 'Please select a privacy setting';
        if ((!image?.endsWith('.png') &&
            !image?.endsWith('.PNG') &&
            !image?.endsWith('.jpg') &&
            !image?.endsWith('.JPG') &&
            !image?.endsWith('.jpeg') &&
            !image?.endsWith('.JPEG'))) {
            newErrs.image = 'Please upload a valid image file (png, jpg, or jpeg)';
        }
        if (about?.length < 50) newErrs.about = 'Please provide a description of at least 50 characters';
        if (about?.includes('     ')) newErrs.about = 'Please remove extra spaces from your description';
        if (!name) newErrs.name = 'Please provide a group name';
        if (name?.length > 60) newErrs.name = 'Group name must be 60 characters or less';
        if (!location || location?.split(', ').length <= 1 || location?.split(', ').length > 2) {
            newErrs.location = 'Please provide a valid location (city, state)';
        }
        if (location?.split(', ')[0]?.length > 50 || location?.split(', ')[1]?.length > 50) {
            newErrs.location = 'City and state must be 50 characters or less';
        }
        setErrors(newErrs);
    }, [submitted, type, privateGroup, image, about, name, location]);

    return (
        <form id="group-form" onSubmit={handleSubmit}>
            {formType === 'Create Group' ?
                <div id="groupform-heading">
                    <h2>Create a Group</h2>
                    <h5>Let&#39;s create your new group!</h5>
                </div>
                :
                <div id="groupform-heading">
                    <h2>Update a Group</h2>
                </div>
            }

            <div id="groupform-inputs-area">
                {/* location */}
                <div className="groupform-input">
                    <h2>Where is your group located?</h2>
                    <label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, STATE"
                        />
                    </label>
                    {submitted && <div className="error-msg">{errors.location}</div>}
                </div>

                {/* name */}
                <div className="groupform-input">
                    <h2>What will your group be called?</h2>
                    <label>
                        <textarea
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Group Name"
                        />
                    </label>
                    {submitted && <div className="error-msg">{errors.name}</div>}
                </div>

                {/* about */}
                <div className="groupform-input">
                    <h2>Describe what your group will be doing.</h2>
                    <label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="Group Description (at least 50 characters)"
                        />
                    </label>
                    {submitted && <div className="error-msg">{errors.about}</div>}
                </div>

                {/* extra stuff */}
                <div className="groupform-input">
                    <h2>Other Group Listing Requirements</h2>
                    {/* group type */}
                    <div className={'selector type'}>
                        <h4>Will this be an online or in person group?</h4>
                        <label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value={''} disabled>Select a group type</option>
                                <option value={'Online'}>Online</option>
                                <option value={'In Person'}>In Person</option>
                            </select>
                        </label>
                        {submitted && <div className="error-msg">{errors.type}</div>}
                    </div>
                    {/* group private */}
                    <div className={'selector private'}>
                        <h4>Will this group be private?</h4>
                        <label>
                            <select
                                value={privateGroup}
                                onChange={(e) => setPrivateGroup(e.target.value)}
                            >
                                <option value={''} disabled>Select a privacy setting</option>
                                <option value={true}>Private</option>
                                <option value={false}>Public</option>
                            </select>
                        </label>
                        {submitted && <div className="error-msg">{errors.private}</div>}
                    </div>
                    {/* group image */}
                    <div >
                        <h4>Upload a group image</h4>
                        <label>
                            <textarea
                                placeholder="Image URL"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </label>
                        {submitted && <div className="error-msg">{errors.image}</div>}
                    </div>
                </div>
            </div>

            <button disabled={disabled} id="groupform-submit" type="submit">{formType}</button>
        </form>
    )
}

export default GroupForm;
