import React from 'react';
import '../Styles/fotter.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import ExternalLink from './ExternalLink';

const fotter = (props) => {
    return (
        <div className="fotter">
            Copyright &copy; 2020 <ExternalLink 
                to="http://panchalprogrammingacademy.herokuapp.com"
                external={true} newWindow={true}>
                Panchal Programming Academy
            </ExternalLink>
            <br/>
            Made with <span><FontAwesomeIcon icon={faHeart}/></span> by <ExternalLink 
                to="http://shubhampanchal.herokuapp.com"
                external={true} newWindow={true}>
                Shubham Panchal
            </ExternalLink>
        </div>
    );
};
export default fotter;