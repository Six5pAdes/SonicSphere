import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [disabled, setDisabled] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    useEffect(() => {
        let boolean = true;
        if (
            username.length >= 4 &&
            password.length >= 6 &&
            email.length > 0 &&
            firstName.length > 0 &&
            lastName.length > 0 &&
            confirmPassword.length > 0
        ) {
            boolean = false;
        }
        setDisabled(boolean);
    }, [username, password, email, firstName, lastName, confirmPassword]);

    return (
        <div id='signup-modal'>
            <h1 id='signup-header'>Sign Up</h1>
            <form id='signup-form' onSubmit={handleSubmit}>
                <label className='signup-labels'>
                    <input
                        className='signup-inputs'
                        type="text"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    // required
                    />
                </label>
                {errors.email && <p className='error-msg' style={{ color: 'red' }}>{errors.email}</p>}
                <label className='signup-labels'>
                    <input
                        className='signup-inputs'
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    // required
                    />
                </label>
                {errors.username && <p className='error-msg' style={{ color: 'red' }}>{errors.username}</p>}
                <label className='signup-labels'>
                    <input
                        className='signup-inputs'
                        type="text"
                        placeholder='First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    // required
                    />
                </label>
                {errors.firstName && <p className='error-msg' style={{ color: 'red' }}>{errors.firstName}</p>}
                <label className='signup-labels'>
                    <input
                        className='signup-inputs'
                        type="text"
                        placeholder='Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    // required
                    />
                </label>
                {errors.lastName && <p className='error-msg' style={{ color: 'red' }}>{errors.lastName}</p>}
                <label className='signup-labels'>
                    <input
                        className='signup-inputs'
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    // required
                    />
                </label>
                {errors.password && <p className='error-msg' style={{ color: 'red' }}>{errors.password}</p>}
                <label className='signup-labels'>
                    <input
                        className='signup-inputs'
                        type="password"
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    // required
                    />
                </label>
                {errors.confirmPassword && (
                    <p className='error-msg' style={{ color: 'red' }}>{errors.confirmPassword}</p>
                )}
                {disabled ?
                    <button id='signup-disabled' className='signup-inputs' type="submit" disabled={disabled}>Sign Up</button>
                    :
                    <button id='signup-success' className='signup-inputs' type="submit">Sign Up</button>
                }
            </form>
        </div>
    );
}

export default SignupFormModal;
