import React, {useState, useEffect} from 'react';
import './styles/CoursePage.scss';
import AcademyIcon from '../../assets/ppa.png';
import Fotter from '../utility/Fotter';
import Loader1 from '../utility/Loader1';
import {readAllProblemsFromBackend, readAllQuizzesFromBackend} from '../../helpers/DataAccessObject';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import ExternalLink from '../utility/ExternalLink';
import {isProblemSolved} from '../../helpers/LocalStorage';

export default function CoursePage(props){
    const {courseId, type} = props;
    const [isLoading, setIsLoading] = useState(true);
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [filters, setFilters] = useState([]);
    const [filterValue, setFilterValue] = useState('');

    // fetches the problems from server
    useEffect(function(){
        let functionToInvoke = (type === "problems" ? readAllProblemsFromBackend : readAllQuizzesFromBackend);
        functionToInvoke(courseId).then(response => {
            let {data} = response;
            if (data.error)  setErrorMessage(data.error);
            else {
                let problems = data.problems || data.quizzes || [];
                problems.sort( (i1, i2) => i1.title.localeCompare(i2.title));
                setProblems(problems);
                setFilteredProblems(problems);
            }
        }).catch(error => {
            setErrorMessage(error.toString());
        }).finally(() => {
            setIsLoading(false);
        });
    }, [courseId, type]);

    // listens to the filter-change
    useEffect(function(){
        // stores the filtered problems
        setFilteredProblems(problems.filter(problem => {
            let tags = problem.tags;
            let title = problem.title.toUpperCase();
            for (let j = 0; j < filters.length; ++j){
                if (title.indexOf(filters[j]) !== -1) return true;
                if (tags.indexOf(filters[j]) === -1) return false;
            }
            return true;
        }));
    }, [filters, problems]);

    // actual component to be rendered
    document.title = courseId.toUpperCase().replaceAll("-", " ") + " | Course Problem Deck";
    return (
        <div id="course-page">
            <div className="header">
                <img src={AcademyIcon} alt="academyIcon" />
                <h1>
                    {courseId.replaceAll('-', ' ')}<br/>
                    ({type === "problems" ? "Coding Problems" : "Quizzes"})
                </h1>
            </div>
            {isLoading && <Loader1 text="Please wait. I'm fetching problems from server!"/>}
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
                            {isProblemSolved(problem._id) && <span><FontAwesomeIcon icon={faCheck} /></span>}
                            <ExternalLink to={`/${type === 'problems' ? 'problem' : 'quiz'}/` + problem._id} 
                                newWindow={true} className="problem-title">
                                {problem.title}
                            </ExternalLink>
                        </div>
                    );
                })}
                {filteredProblems.length === 0 && <div className="empty-message">Oops, nothing to show here!</div>}
            </div>}
            <Fotter />
        </div>
    );
};
