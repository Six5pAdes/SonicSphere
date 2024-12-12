import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [disabled, setDisabled] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const demoUser = () => {
        return dispatch(sessionActions.demoLogin({ credential: 'DemoUser', password: 'password' }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    }

    useEffect(() => {
        let boolean = true;
        if (credential.length >= 4 && password.length >= 6) {
            boolean = false;
        }
        setDisabled(boolean);
    }, [credential, password]);

    return (
        <div id='login-modal'>
            <h1 id='login-header'>Log In</h1>
            <form id='login-form' onSubmit={handleSubmit}>
                <label className='login-labels'>
                    <input
                        className='login-inputs'
                        placeholder='Username or Email'
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                    // required
                    />
                </label>
                <label className='login-labels'>
                    <input
                        className='login-inputs'
                        placeholder='Password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    // required
                    />
                </label>
                {errors.credential && (
                    <p className='error-msg' style={{ color: 'red' }}>{errors.credential}</p>
                )}
                {disabled ?
                    <button id='login-disabled' className='login-inputs' type="submit" disabled={disabled}>Log In</button>
                    :
                    <button id='login-success' className='login-inputs' type="submit">Log In</button>
                }
                <button id='demo' onClick={demoUser}>Log In As Demo User</button>
            </form>
        </div>
    );
}

export default LoginFormModal;
