import React, { useState } from 'react';
import '../Styles/Login.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {admin_login} from '../DataAccessObject/DataAccessObject';
import Loader2 from './Loader2';
export default function Login(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = (event) => {
        event.preventDefault();
        if (isLoading)  return;
        setIsLoading(true);
        admin_login(email, password).then(response => {
            let {data} = response;
            if (data.error) setErrorMessage(data.error);
            else setSuccessMessage('You are successfully logged in!');
        }).catch(err => {
            setErrorMessage(err);
        }).finally(()=>{
            setIsLoading(false);
        });
    }; 
    return (
        <div id="login">
            {errorMessage && 
            <div className="flash-message error">
                <div>this is a busy day</div>
                <div><button onClick={event => setErrorMessage('')}><FontAwesomeIcon icon={faTimes}/></button></div>
            </div>}
            {successMessage && 
            <div className="flash-message success">
                <div>{successMessage}</div>
                <div><button onClick={event => setSuccessMessage('')}><FontAwesomeIcon icon={faTimes}/></button></div>
            </div>}

            <h1>LOGIN</h1>
            <form method="POST" autoComplete="off" onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" required value={email} 
                        onChange={event => setEmail(event.target.value)}/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" required value={password} 
                        onChange={event => setPassword(event.target.value)}/>
                </div>
                {isLoading && <Loader2 />}
                {!isLoading && <button type="submit" className="btn btn-primary">Submit</button>}
          </form>        
        </div>
    );
};