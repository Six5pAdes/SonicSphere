import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGroupThunk, addGroupImageThunk } from "../../store/groups";
import "./GroupForm.css";

const CreateGroupForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("placeholder");
    const [privateOrNot, setPrivateOrNot] = useState("placeholder");
    const [image, setImage] = useState(null);
    const [validErrors, setValidErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValidErrors({});

        const errors = {};

        if (!name) errors.name = "Name is required";
        if (!city) errors.city = "City is required";
        if (!state) errors.state = "State is required";
        if (about.length < 30) errors.about = "Description must be at least 30 characters";
        if (type == 'placeholder' || !type) errors.type = "Type is required";
        if (type == 'placeholder' || !privateOrNot) errors.privateOrNot = "Visibility type is required";
        if ((!image?.endsWith('.png') && !image?.endsWith('.PNG') && !image?.endsWith('.jpg') && !image?.endsWith('.JPG') && !image?.endsWith('.jpeg') && !image?.endsWith('.JPEG'))) {
            errors.image = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (Object.values(errors).length) {
            setValidErrors(errors);
        } else {
            const group = {
                name,
                city,
                state,
                about,
                type,
                private: privateOrNot,
                image,
            };

            await dispatch(createGroupThunk(group))
                .then(async (newGroup) => {
                    await dispatch(addGroupImageThunk(newGroup.id, image));
                    navigate(`/groups/${newGroup.id}`);
                })
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setValidErrors(data.errors);
                    } else {
                        setValidErrors(data)
                    }
                })
        }
    }

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <section className="group-form-contain">
            <h3>BECOME AN ORGANIZER</h3>
            <h4>Start a new group</h4>
            <form onSubmit={handleSubmit} className="group-form">
                <div>
                    <h3>Set your group&apos;s location</h3>
                    <p>
                        SonicSphere groups meet locally, in person and online. <br />
                        We&apos;ll connect you with people who live near you.
                    </p>
                    <label htmlFor="city">
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            id="city-label"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </label>
                    <span id="comma">,</span>
                    <label htmlFor="state">
                        <input
                            type="text"
                            name="state"
                            placeholder="STATE"
                            id="state-label"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </label>
                    {validErrors.city && <p className="err-msg">{validErrors.city}</p>}
                    {validErrors.state && <p className="err-msg">{validErrors.state}</p>}
                </div>

                <div>
                    <h3>What will your group&apos;s name be?</h3>
                    <p>
                        Choose a name that will give people a clear idea of what the group is about.
                        <br />
                        Feel free to get creative! You can always edit it later if you change your mind.
                    </p>
                    <label htmlFor="name">
                        <input
                            type="text"
                            name="name"
                            placeholder="What is your group name?"
                            id="name-label"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    {validErrors.name && <p className="err-msg">{validErrors.name}</p>}
                </div>

                <div>
                    <h3>Describe the purpose of your group.</h3>
                    <label>
                        <p>People will see this when we promote your group, but yo&apos;ll be able to add to it later, too.
                            <br />
                            <br />
                            1. What&apos;s the purpose of your group?
                            <br />
                            2. Who should join?
                            <br />
                            3. What do you plan to do at your events?
                        </p>
                    </label>
                    <textarea
                        name=""
                        id="about-label"
                        cols="30"
                        rows="10"
                        placeholder="Please write at least 30 characters"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    {validErrors.about && <p className="err-msg">{validErrors.about}</p>}
                </div>

                <div id="finalsteps">
                    <h3>Final steps...</h3>
                    <label htmlFor="type">
                        <p>Is this an in person or online group?</p>
                        <select
                            name="type"
                            id="type-label"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option
                                className="placeholder"
                                disabled
                                value="placeholder">Select one
                            </option>
                            <option value="In person">In person</option>
                            <option value="Online">Online</option>
                        </select>
                    </label>
                    {validErrors.type && <p className="err-msg">{validErrors.type}</p>}

                    <label htmlFor="privateOrNot">
                        <p>Is this group private or public?</p>
                        <select
                            name="private"
                            id="private-label"
                            value={privateOrNot}
                            onChange={(e) => setPrivateOrNot(e.target.value)}
                        >
                            <option
                                className="placeholder"
                                disabled
                                value="placeholder">Select one
                            </option>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>
                    </label>
                    {validErrors.privateOrNot && <p className="err-msg">{validErrors.privateOrNot}</p>}

                    <label>
                        <h5>Please add an image url for your group below:</h5>
                        <textarea
                            placeholder='Image URL'
                            cols='30'
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </label>
                    {validErrors.image && <div className="err-msg">{validErrors.image}</div>}
                </div>

                <div>
                    <button onSubmit={handleSubmit}>Create Group</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </section>
    )
}

export default CreateGroupForm;
