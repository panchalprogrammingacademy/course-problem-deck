import React from 'react';
import './styles/Modal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TroffeIcon from '../../assets/award.png';
import {randomCongratsMessage} from './CongratsMessage';

export default function Modal(props){
    const {message, onClose} = props;
    let text = randomCongratsMessage();
    return (
        <div className="modal">
            <div className="modal-content box-shadow drop-animation">
                <div className="modal-header">
                    <div className="header">Congratulations</div>
                    <div onClick={onClose}><FontAwesomeIcon icon={faTimes} /></div>
                </div>
                <div className="modal-body">
                    <div><img src={TroffeIcon} alt=""/></div>
                    <div>
                        <div className="message">
                            {message}<br/>
                            {text}
                        </div>
                        {/* <div>
                            <button className="danger" onClick={onClose}>Nope</button>
                            <button className="success" onClick={onSave}>Yeah sure!</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};