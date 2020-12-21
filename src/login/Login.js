import React, {useState} from 'react'
import './Login.css';
import {useDispatch, useSelector} from 'react-redux';
import {startLoggingIn} from '../actions.js';



function Login(){
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const loginError = useSelector(state => state.loginError);
    
    function onLogin(username, password){
        dispatch(startLoggingIn(username, password))
    }

    return(
        <div className="login">
            <div className="login-header">Log In</div>
            <div className="login-label username">Username</div>
            <input type="text" className="login-field field-username" maxLength={16} onChange={(e) => setUsername(e.target.value)}></input>
            <div className="login-label password">Password</div>
            <input type="password" className="login-field field-password" maxLength={16} onChange={(e) => setPassword(e.target.value)}></input>
            <button className="login-submit" onClick={() => onLogin(username, password)}>Log In</button>
            {loginError &&
            <div className="login-error">Login failed.</div>
            }
        </div>
    )
}

export default Login;