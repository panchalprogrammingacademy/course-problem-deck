import React from 'react';
import '../Styles/CoursePage.scss';
import AcademyIcon from '../Assets/ppa.png';
import Fotter from './Fotter';

const coursePage = (props) => {
    let courseId = props.match.params.courseId;
    return (
        <div id="course-page">
            <div className="header">
                <img src={AcademyIcon} alt="academyIcon" />
                <h1>{courseId.replaceAll('-', ' ')}</h1>
            </div>
            

            <Fotter />
        </div>
    );
};
export default coursePage;