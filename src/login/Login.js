import React, {useState} from 'react'
import './Login.css';
import {useDispatch} from 'react-redux';
import {startLoggingIn, goToMainPage} from '../actions.js';



function Login(props){
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    
    function onLogin(username, password){
        dispatch(startLoggingIn(username, password))
    }
    function onBack(){
        dispatch(goToMainPage());
    }



    return(
        <div className="login">
            <div className="login-header">Log In</div>
            <div className="login-label username">Username</div>
            <input type="text" className="login-field field-username" onChange={(e) => setUsername(e.target.value)}></input>
            <div className="login-label password">Password</div>
            <input type="password" className="login-field field-password" onChange={(e) => setPassword(e.target.value)}></input>
            <button className="login-submit" onClick={() => onLogin(username, password)}>Log In</button>
        </div>
        
    )
}

export default Login;