import React from 'react';
// import {CLIENT_URL} from '../../helpers/DataAccessObject';
import {HashLink as Link} from 'react-router-hash-link';

// component to be rendered
export default function ExternalLink(props){
    const {newWindow, external, to, className} = props;
    if (external) {
        return (
            <a href={to} className={className} 
                target={newWindow ? "_blank" : ""}
                rel="noreferrer">
                    {props.children}
            </a>
        );    
    } else {
        return (
            <Link to={to} className={className}
                target={newWindow ? "_blank" : ""}
                rel="noreferrer">
                    {props.children}
            </Link>
        );
    }
    // if (external) url = to;
    // else          url = CLIENT_URL + "/#" + to;
    // return (
    //     <a href={url} className={className} 
    //         target={newWindow ? "_blank" : ""}
    //         rel="noreferrer">
    //             {props.children}
    //     </a>
    // );

};