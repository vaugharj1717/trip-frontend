import React, {useState} from 'react'
import './Registration.css';
import {useDispatch, useSelector} from 'react-redux';
import {startRegistering} from '../actions.js';



function Registration(props){
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const registerError = useSelector(state => state.registerError);
    const [invalidPass, setInvalidPass] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
;    
    function onRegister(username, password, email){
        if(username.length < 3){
            setInvalidUser(true);
            setInvalidPass(false);
        }
        else if(password.length < 8){
            setInvalidPass(true);
            setInvalidUser(false);
        }
        else{
            setInvalidPass(false);
            setInvalidUser(false);
            dispatch(startRegistering(username, password, email));
        }
        
    }



    return(
        <div className="registration">
            <div className="registration-header">Register</div>
            <div className="registration-label username">&nbsp;&nbsp;Username *</div>
            <input type="text" className="registration-field field-username" maxLength={14} onChange={(e) => setUsername(e.target.value)}></input>
            <div className="registration-label password">&nbsp;&nbsp;Password *</div>
            <input type="password" className="registration-field field-password" onChange={(e) => setPassword(e.target.value)}></input>
            <div className="registration-label email">&nbsp;&nbsp;Email&nbsp;&nbsp;</div>
            <input type="text" className="registration-field field-email" onChange={(e) => setEmail(e.target.value)}></input>
            <button className="registration-submit" onClick={() => onRegister(username, password, email)}>Register</button>
            {invalidUser &&
            <div className="register-error">Username must contain at least 3 characters</div>
            }
            {invalidPass &&
            <div className="register-error">Password must contain at least 8 characters.</div>
            }
            {registerError && !invalidPass && !!invalidUser &&
            <div className="register-error">Error registering.</div>
            }
        </div>
        
    )
}

export default Registration;