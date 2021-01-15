import React, {useState, useEffect} from 'react';
import '../Styles/CoursePage.scss';
import AcademyIcon from '../Assets/ppa.png';
import Fotter from './Fotter';
import Loader1 from './Loader1';
import {course_problems} from '../DataAccessObject/DataAccessObject';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function CoursePage(props){
    const courseId = props.courseId;
    const [isLoading, setIsLoading] = useState(true);
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [filters, setFilters] = useState([]);
    const [filterValue, setFilterValue] = useState('');

    // fetches the problems from server
    useEffect(function(){
        course_problems(courseId).then(response => {
            let {data} = response;
            if (data.error)  setErrorMessage(data.error);
            else {
                let problems = data.problems || [];
                problems.sort( (i1, i2) => i1.title.localeCompare(i2.title));
                setProblems(problems);
                setFilteredProblems(problems);
            }
        }).catch(error => {
            setErrorMessage(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [courseId]);

    // listens to the filter-change
    useEffect(function(){
        // stores the filtered problems
        setFilteredProblems(problems.filter(problem => {
            let tags = problem.tags;
            for (let j = 0; j < filters.length; ++j)
                if (tags.indexOf(filters[j]) === -1) return false;
            return true;
        }));
    }, [filters, problems]);

    // actual component to be rendered
    return (
        <div id="course-page">
            <div className="header">
                <img src={AcademyIcon} alt="academyIcon" />
                <h1>{courseId.replaceAll('-', ' ')}</h1>
            </div>
            {isLoading && <Loader1 text="Please wait. I'm fetched problems from server!"/>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {!isLoading && !errorMessage && 
            <div className="problems">
                <div className="filter-box">
                    <div className="filter-items">
                        {filters.map(filter => {
                            return (
                                <div className="filter-item" key={filter}>
                                    {filter}
                                    <button onClick={event => {
                                        let filterItems = [...filters];
                                        let index = filterItems.indexOf(filter);
                                        filterItems.splice(index, 1);
                                        setFilters(filterItems);
                                    }}><FontAwesomeIcon icon={faTimes} /></button>
                                </div>
                            );
                        })}
                    </div>
                    <input type="text" className="filter-input" value={filterValue}
                        placeholder="Add a filter tag and hit enter" 
                        onChange={event => setFilterValue(event.target.value)}
                        onKeyPress={event => {
                            if (event.key === 'Enter') {
                                let text = filterValue.trim().toUpperCase();
                                setFilterValue('');
                                if (text !== '' && filters.indexOf(text) === -1) 
                                    setFilters([...filters, text]);
                            }
                        }}/>
                </div>

                {filteredProblems.map(problem => {
                    return (
                        <div className="problem" key={problem._id}>
                            {localStorage.getItem(problem._id) && <span><FontAwesomeIcon icon={faCheck} /></span>}
                            <a href="/" className="problem-title"
                                onClick={event => {
                                    event.preventDefault();
                                    let url = window.location.origin + "/#/problem/" + problem._id;
                                    window.open(url, '_blank');
                                }}>{problem.title}</a>
                        </div>
                    );
                })}
                {filteredProblems.length === 0 && <div className="empty-message">Oops, nothing to show here!</div>}
            </div>}

            <Fotter />
        </div>
    );
};
