import React from 'react';
import '../Styles/fotter.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import ExternalLink from './ExternalLink';

const fotter = (props) => {
    return (
        <div className="fotter">
            Copyright &copy; 2021 <ExternalLink 
                to="https://panchalprogrammingacademy.github.io/panchalprogrammingacademy"
                external={true} newWindow={true}>
                Panchal Programming Academy
            </ExternalLink>
            <br/>
            Made with <span><FontAwesomeIcon icon={faHeart}/></span> by <ExternalLink 
                to="https://shubhampanchal.herokuapp.com"
                external={true} newWindow={true}>
                Shubham Panchal
            </ExternalLink>
        </div>
    );
};
export default fotter;