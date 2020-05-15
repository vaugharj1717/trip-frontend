import React, {useState} from 'react'
import './Registration.css';
import {useDispatch, useSelector} from 'react-redux';
import {startRegistering} from '../actions.js';



function Registration(props){
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const registerError = useSelector(state => state.registerError)
;    
    function onRegister(username, password, email){
        dispatch(startRegistering(username, password, email))
    }



    return(
        <div className="registration">
            <div className="registration-header">Register</div>
            <div className="registration-label username">Username</div>
            <input type="text" className="registration-field field-username" maxLength={16} onChange={(e) => setUsername(e.target.value)}></input>
            <div className="registration-label password">Password</div>
            <input type="password" className="registration-field field-password" onChange={(e) => setPassword(e.target.value)}></input>
            <div className="registration-label email">Email</div>
            <input type="text" className="registration-field field-email" onChange={(e) => setEmail(e.target.value)}></input>
            <button className="registration-submit" onClick={() => onRegister(username, password, email)}>Register</button>
            {registerError &&
            <div className="register-error">Error registering.</div>
            }
        </div>
        
    )
}

export default Registration;