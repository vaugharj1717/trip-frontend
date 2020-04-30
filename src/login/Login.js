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
            <div className="login-label">Username</div>
            <input type="text" className="registration-field" onChange={(e) => setUsername(e.target.value)}></input>
            <div className="login-label">Password</div>
            <input type="text" className="registration-field" onChange={(e) => setPassword(e.target.value)}></input>
            <button className="login-submit" onClick={() => onLogin(username, password)}>Login</button>
            <button className="login-back" onClick={() => onBack()}>Back</button>
        </div>
        
    )
}

export default Login;