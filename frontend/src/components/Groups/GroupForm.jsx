import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkCreateGroup, thunkCreateGroupImage, thunkUpdateGroup } from '../../store/groups'
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

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <form id="group-form" onSubmit={handleSubmit}>
            {formType === 'Create Group' ?
                <div id="groupform-heading">
                    <h4>BECOME AN ORGANIZER</h4>
                    <h3>We&#39;ll walk you through a few steps to build your local community</h3>
                </div>
                :
                <div id="groupform-heading">
                    <h4>UPDATE YOUR GROUP&#39;S INFORMATION</h4>
                    <h3>We&#39;ll walk you through a few steps to update your group&#39;s information</h3>
                </div>
            }

            <div id="groupform-inputs-area">
                {/* location */}
                <div className="groupform-input">
                    <h2 className="group-label">First&#44; set your group&#39;s location.</h2>
                    <p>Meetup groups meet locally&#44; in person and online. We&#39;ll connect you with people in your area&#44; and more can join you online.</p>
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
                    <h2 className="group-label">What will your group&#39;s name be?</h2>
                    <p>Choose a name that will give people a clear idea of what your group is about.<br />
                        Feel free to get creative! You can edit this later if you change your mind.</p>
                    <label>
                        <textarea
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="What is your group name?"
                        />
                    </label>
                    {submitted && <div className="error-msg">{errors.name}</div>}
                </div>

                {/* about */}
                <div className="groupform-input">
                    <h2 className="group-label">Now describe what your group will be about</h2>
                    <p>People will see this when we promote your group&#44; but you&#39;ll be able to add to it later&#44; too.</p>
                    <ol>
                        <li>What&#39;s the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="Please write at least 50 characters"
                        />
                    </label>
                    {submitted && <div className="error-msg">{errors.about}</div>}
                </div>

                {/* extra stuff */}
                <div className="groupform-input">
                    <h2>Final steps...</h2>
                    {/* group type */}
                    <div className={'selector type'}>
                        <h4 className="group-label">Is this an in person or online group?</h4>
                        <label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value={''} disabled>&#40;select one&#41;</option>
                                <option value={'Online'}>Online</option>
                                <option value={'In Person'}>In Person</option>
                            </select>
                        </label>
                        {submitted && <div className="error-msg">{errors.type}</div>}
                    </div>
                    {/* group private */}
                    <div className={'selector private'}>
                        <h4 className="group-label">Is this group private or public?</h4>
                        <label>
                            <select
                                value={privateGroup}
                                onChange={(e) => setPrivateGroup(e.target.value)}
                            >
                                <option value={''} disabled>&#40;select one&#41;</option>
                                <option value={true}>Private</option>
                                <option value={false}>Public</option>
                            </select>
                        </label>
                        {submitted && <div className="error-msg">{errors.private}</div>}
                    </div>
                    {/* group image */}
                    <div >
                        <h4 className="group-label">Please add an image url for your group below:</h4>
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

            <div className="buttons">
                <button disabled={disabled} id="groupform-submit" type="submit">{formType}</button>
                <button id="cancel-button" type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    )
}

export default GroupForm;
