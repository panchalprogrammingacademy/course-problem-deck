import React from 'react';
import {CLIENT_URL} from '../DataAccessObject/DataAccessObject';


// component to be rendered
export default function ExternalLink(props){
    const {newWindow, external, to, className} = props;
    let url = null;
    if (external) url = to;
    else          url = CLIENT_URL + "/#" + to;
    // return (
    //     <Link to={url} className={className}
    //         onClick={event => {
    //             event.preventDefault();
    //             if (newWindow)  window.open(url, "_blank");
    //             else            window.location.href = url;
    //     }}>
    //     {props.children}
    //     </Link>
    // );
    return (
        <a href={url} className={className} 
            target={newWindow ? "_blank" : ""}
            rel="noreferrer">
                {props.children}
        </a>
    );

};