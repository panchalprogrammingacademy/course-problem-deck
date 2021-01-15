import React from 'react';
import '../Styles/homepage.scss';
import AcademyIcon from '../Assets/ppa.png';
import {HashLink as Link} from 'react-router-hash-link';
import Fotter from './Fotter';

const homepage = (props) => {
    document.title = "Course Problem Deck";
    const courses = [
        {
            id: 'the-complete-c-course',
            title: 'The Complete C Course',
            subtitle: 'Learn C in this course and become a Computer Programmer. Obtain valuable C skills and problem solving strategy!',
            instructor: 'Shubham Panchal (B.Tech 3rd CSE, IIT Hyderabad)',
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
                                <Link to="/" onClick={event => {
                                    event.preventDefault();
                                    window.open(course.courseLink, '_blank');
                                }} className="browse-course">Browse Course</Link>
                                <Link to={"/course/" + course.id} className="browse-problems">Browse Problems</Link>
                            </div>
                        );
                    });
                }()}
            </div>
            <Fotter />
            {/* <div className="fotter">
                Copyright &copy; 2020 <Link to="/" onClick={event => {
                    event.preventDefault();
                    window.location.href = "http://panchalprogrammingacademy.herokuapp.com"
                }}>Panchal Programming Academy</Link><br/>
                Made with <span><FontAwesomeIcon icon={faHeart}/></span> by <Link 
                    to="/" onClick={event => {
                    event.preventDefault();
                    window.location.href = 'http://shubhampanchal.herokuapp.com'
                }}>Shubham Panchal</Link>
            </div> */}
        </div>
    );
};
export default homepage;