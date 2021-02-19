import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faCheck, faExclamation, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles/ToastedNotes.scss';
// stores the ref to the returned component
let elementRef = null;
// default time out
const DEFAULT_TIME_OUT = 2000;
// faInfoCircle
class ToastedNotesContainer extends React.Component{
    // states for the toasts
    state = {
        toasts: []
    };
    // stores the default autoDismiss
    defaultTimeOut = this.props.timeOut || DEFAULT_TIME_OUT;
    // delets the toasts with given id
    deleteToast = (id) => {
        // update the toasts
        this.setState(prevState => {
            // get the old toasts
            let oldToasts = [...prevState.toasts];
            // find the toast with given index
            let index = oldToasts.findIndex(toast => toast.id === id);
            // check if such a toast exist
            if (index === -1)   return;
            // delete this toast
            oldToasts.splice(index, 1);
            // update the toasts
            return {toasts: oldToasts}
        });
    };
    // delete all toasts
    deleteAllToasts = () => this.setState({toasts: []});
    // static method to add toasts
    addToast = (body, options) => {
        // get the properties of the toast
        let {
            appearance, 
            autoDismiss, 
            timeOut, 
            toastId, 
            position
        } = options;
        // get or create toastId
        let id = toastId || uuidv4();
        // stores the icon
        let icon = null;
        // prepareIcon according to type
        if      (appearance === `info`)     icon = faInfoCircle;
        else if (appearance === `error`)    icon = faBug;
        else if (appearance === `success`)  icon = faCheck;
        else if (appearance === `warning`)  icon = faExclamation;
        // if autoDismiss is set then dismiss
        if (autoDismiss) {
            // timeout in millis
            let timeToDismiss = timeOut || this.defaultTimeOut;
            // setTimeout]
            setTimeout(this.deleteToast, timeToDismiss, id);
        }

        // update the state
        this.setState(prevState => {
            // get the old toasts
            let oldToasts = [...prevState.toasts];
            // add the toast
            oldToasts.push({appearance, body, icon, id, position});
            // return the updated toasts
            return {toasts: oldToasts};
        });

        // return the id of the toast
        return id;
    };

    // render method
    render = () => {
        // stores the toasts for appropriate positions
        let topLeft = [];
        let topCenter = [];
        let topRight = [];
        let center = [];
        let bottomLeft = [];
        let bottomCenter = [];
        let bottomRight = [];
        // get the toasts
        let toasts = this.state.toasts;
        // filter the toasts according to the positions
        for (let i = 0; i < toasts.length; ++i) {
            // get the toast
            let toast = toasts[i];
            // get the position of the toast
            let position = toast.position || 'top-right';
            // add the toast to appropriate container
            if (position === 'top-left')            topLeft.push(toast);
            else if (position === 'top-center')     topCenter.push(toast);
            else if (position === 'top-right')      topRight.push(toast);
            else if (position === 'center')         center.push(toast);
            else if (position === 'bottom-left')    bottomLeft.push(toast);
            else if (position === 'bottom-center')  bottomCenter.push(toast);
            else if (position === 'bottom-right')   bottomRight.push(toast);
        }

        // create an array to iterate through all positions
        let positions = [
            {position: 'top-left', items: topLeft},
            {position: 'top-center', items: topCenter},
            {position: 'top-right', items: topRight},
            {position: 'center', items: center},
            {position: 'bottom-left', items: bottomLeft},
            {position: 'bottom-center', items: bottomCenter},
            {position: 'bottom-right', items: bottomRight},
        ];

        return (
            <div id="toasted-notes">
                {positions.map(pos => (
                    <div className={`toasted-notes-container ${pos.position}`}
                            key={pos.position}>
                        {pos.items.map(toast => (
                            <div className="toast" key={toast.id}>
                                {(toast.appearance && toast.appearance !== 'none') &&
                                <div className={`toast-icon toast-${toast.appearance}`}>
                                    <FontAwesomeIcon icon={toast.icon} />
                                </div>
                                }
                                <div className="toast-body">
                                    {toast.body}
                                </div>
                                {(toast.appearance && toast.appearance !== 'none') &&
                                <div className="toast-close">
                                    <button onClick={() => this.deleteToast(toast.id)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                }
                            </div>
                        ))}
                    </div>
                ))}
                {this.props.children}
            </div>
        );    
    };
};

// wrapper over toasted
class ToastedNotes extends React.Component{
    render = () => {
        return (
            <ToastedNotesContainer ref={el => elementRef = el} >
                {this.props.children}
            </ToastedNotesContainer>
        );
    };
};
export default ToastedNotes;

// adds a toast
export const addToast = (message, options) => {
    if (!elementRef)    throw new Error("<ToastedNotes /> component should be rendered for addToast");
    return elementRef.addToast(message, options);
}

// removes a toast
export const removeToast = (id) => {
    if (!elementRef)    throw new Error("<ToastedNotes /> component should be rendered for addToast");
    elementRef.deleteToast(id);
};

// removes all the toasts
export const removeAllToasts = () => {
    if (!elementRef)    throw new Error("<ToastedNotes /> component should be rendered for addToast");
    elementRef.deleteAllToasts();
}

// export all the functions under a hook
export const useToasts = () => {
    return {
        addToast, 
        removeToast,
        removeAllToasts
    };
};