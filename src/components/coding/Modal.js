import React from 'react';
import './styles/Modal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TroffeIcon from '../../assets/award.png';

export default function Modal(props){
    const {onClose} = props;
    const messages = [
        `Woo Hoo! Good for you! Congrats!`,
        `Way to go! Congrats!`,
        `Congratulations! You did it! Still clapping!`,
        `Great work! You totally nailed it!`,
        `Totally superb job! Congrats!`,
        `Well done! You totally rocked!`,
        `Congrats! Above and beyond!`,
        `Congratulations! You've got, all of it!`,
    ];
    const index = Math.floor((Math.random() * messages.length));
    let text = messages[index];
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
                            You have passed all the test-cases! <br/>
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