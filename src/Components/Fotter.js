import React from 'react';
import '../Styles/fotter.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import {HashLink as Link} from 'react-router-hash-link';

const fotter = (props) => {
    return (
        <div className="fotter">
            Copyright &copy; 2020 <Link to="/" onClick={event => {
                event.preventDefault();
                window.location.href = "http://panchalprogrammingacademy.herokuapp.com"
            }}>Panchal Programming Academy</Link><br/>
            Made with <span><FontAwesomeIcon icon={faHeart}/></span> by <Link 
                to="/" onClick={event => {
                event.preventDefault();
                window.location.href = 'http://shubhampanchal.herokuapp.com'
            }}>Shubham Panchal</Link>
        </div>
    );
};
export default fotter;