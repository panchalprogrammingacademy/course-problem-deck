import React from 'react';
import {HashLink as Link} from 'react-router-hash-link';
import LostImage from '../Assets/404.gif';

const pageNotFound = (props) => {
    document.title = "Course Problem Deck | Page Not Found";
    return (
        <div id="pageNotfound"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                height: '100vh',
                padding: '0px',
                margin: '0px',
                overflow: 'hidden'
            }}>
            <img src={LostImage} alt="lostImage" />
            <div style={{textAlign: 'center'}}>
                <p style={{
                    fontSize: '20px',
                    textAlign: 'center'
                }}>
                    Uh oh! The page you are looking for does not exist! <br/>
                </p>
                <Link to="/" style={{
                        background: '#17a2bb',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '10px',
                        margin: '10px',
                        textDecoration: 'none',
                        fontSize: '20px'
                }}>Home</Link>
            </div>
        </div>
    );
};
export default pageNotFound;