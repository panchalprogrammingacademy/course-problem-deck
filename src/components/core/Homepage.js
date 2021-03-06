// imports
import React from 'react';
import './styles/Homepage.scss';
import AcademyIcon from '../../assets/ppa.png';
import ExternalLink from '../utility/ExternalLink';
import Fotter from '../utility/Fotter';

// functional component
const homepage = (props) => {
    document.title = "Course Problem Deck";
    const courses = [
        {
            id: 'the-complete-c-course',
            title: 'The Complete C Course',
            subtitle: 'Learn C in this course and become a Computer Programmer. Obtain valuable C skills and problem solving strategy! Build portfolio projects and explore basic data-structures and algorithms!',
            instructor: 'Shubham Panchal (B.Tech 3rd year CSE, IIT Hyderabad)',
            courseLink: 'https://www.udemy.com/course/the-complete-c-course-ppa/?referralCode=E8FBBBCC47B68F60F275'
        },
    ];
    return (
        <div id="homepage">
            <div className="header">
                <img src={AcademyIcon} alt="academyIcon" />
                <h1>Course wise practice problems</h1>
            </div>
            <div className="course">
                {function(){
                    return courses.map(course => {
                        return (
                            <div key={course.id} className="course-content">
                                <h1>{course.title}</h1>
                                <p className="instructor">{course.instructor}</p>
                                <p className="subtitle">{course.subtitle}</p>
                                <div className="course-options">
                                    <ExternalLink newWindow={true} external={true}
                                        to={course.courseLink}
                                        className="browse-course">Browse Course</ExternalLink>
                                    <ExternalLink to={"/course/" + course.id + "/problems"}
                                        className="browse-problems">Browse Problems</ExternalLink>
                                    <ExternalLink to={"/course/" + course.id + "/quizzes"}
                                        className="browse-quizzes">Browse Quizzes</ExternalLink>
                                </div>
                            </div>
                        );
                    });
                }()}
            </div>
            <Fotter />
        </div>
    );
};
export default homepage;