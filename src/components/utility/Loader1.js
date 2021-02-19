import React from 'react';
import './styles/Loader1.scss';
const loader1 = (props) => {
    return (
        <div id="loader1">
            <div className="lds-facebook"><div></div><div></div><div></div></div>            
            <div>{props.text}</div>
        </div>
    );
}; 
export default loader1;