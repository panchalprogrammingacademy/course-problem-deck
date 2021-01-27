import React from 'react';
import {Link} from 'react-router-dom';
const baseurl = window.location.origin;
// const baseurl = 'https://panchalprogrammingacademy.github.io/course-problem-deck';


// component to be rendered
export default function ExternalLink(props){
    const {newWindow, external, to, className} = props;
    let url = null;
    if (external) url = to;
    else          url = baseurl + "/#" + to;
    return (
        <Link to={url} className={className}
            onClick={event => {
                event.preventDefault();
                if (newWindow)  window.open(url, "_blank");
                else            window.location.href = url;
        }}>
        {props.children}
        </Link>
    );
};