import React from 'react';
import './styles/Loader0.scss';
import Fotter from './Fotter';
export default function Loader0(props){
    return (
        <div className="loader0">
            <div className="sk-cube-grid">
                <div className="sk-cube sk-cube1"></div>
                <div className="sk-cube sk-cube2"></div>
                <div className="sk-cube sk-cube3"></div>
                <div className="sk-cube sk-cube4"></div>
                <div className="sk-cube sk-cube5"></div>
                <div className="sk-cube sk-cube6"></div>
                <div className="sk-cube sk-cube7"></div>
                <div className="sk-cube sk-cube8"></div>
                <div className="sk-cube sk-cube9"></div>
            </div>
            <div className="message">
                Welcome to course problem deck! <br/>
                Practice problems for courses offered by <a href="/" 
                    onClick={event => {
                    event.preventDefault();
                    window.location.href = 'http://panchalprogrammingacademy.herokuapp.com'
                }}>Panchal Programming Academy</a>
            </div>
            <Fotter />
        </div>

    );
};