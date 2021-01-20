import React from 'react';
import '../Styles/Modal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TroffeIcon from '../Assets/award.png';

export default function Modal(props){
    const {onClose, onSave} = props;
    return (
        <div className="modal">
            <div className="modal-content box-shadow drop-animation">
                <div className="modal-header">
                    <div>Congratulations</div>
                    <div onClick={onClose}><FontAwesomeIcon icon={faTimes} /></div>
                </div>
                <div className="modal-body">
                    <div><img src={TroffeIcon} alt=""/></div>
                    <div>
                        <div className="message">
                            You have passed all the test-cases! <br/>
                            Would you like to store your current solution 
                            in your browser's local storage?
                        </div>
                        <div>
                            <button className="danger" onClick={onClose}>Nope</button>
                            <button className="success" onClick={onSave}>Yeah sure!</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};