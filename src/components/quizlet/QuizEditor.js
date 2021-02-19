import React, { useEffect, useState, useCallback } from 'react';
import './styles/QuizEditor.scss';
import ExternalLink from '../utility/ExternalLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarCheck, faTimes, faTrash, faDirections } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from '../utility/ToastedNotes';
import Question from './Question';
import Loader1 from '../utility/Loader1';
import { v4 as uuidv4 } from 'uuid';
import NothingHereImage from '../../assets/nothing.webp';
import {verify_and_fetch_problem, save_problem, CLIENT_URL, delete_problem, TOKEN_STRING} from '../../helpers/DataAccessObject';
import {Redirect} from 'react-router-dom';
import Fotter from '../utility/Fotter';
import * as questionTypes from '../../helpers/QuestionTypes';


// functional component
export default function QuizEditor(props){

    const [isLoading, setIsLoading] = useState(false);
    const [quizId, setQuizId] = useState(null);
    const [title, setTitle] = useState('');
    const [timeLimit, setTimeLimit] = useState(0);
    const [tags, setTags] = useState([]);
    const [questions, setQuestions] = useState([
        { id: uuidv4(), ref: React.createRef()}
    ]);
    const [tagText, setTagText] = useState('');
    const [redirect, setRedirect] = useState(null);
    const { addToast } = useToasts();


    // displays the toast with error message
    const flagError = useCallback((message, autoDismiss=false) => addToast(message, {appearance: 'error', autoDismiss}), [addToast]);
    // event handler for add tag
    const onAddTagHandler = (event) => {
        if (event.key === 'Enter') {
            let text = tagText.trim().toUpperCase();
            setTagText('');    
            if (text === '')    return;
            if (tags.indexOf(text) !== -1)  return;
            setTags([...tags, text]);
        }
    };
    // event handler for addding new-problem
    const addQuestionHandler = (event) => {
        let oldQuestions = [...questions];
        let question = {
            id: uuidv4(),
            ref: React.createRef(),
        }
        oldQuestions.push(question);
        setQuestions(oldQuestions);
    };
    // deletes the problem
    const deleteQuestionHandler = (index) => {
        let oldQuestions = [...questions];
        oldQuestions.splice(index, 1);
        setQuestions(oldQuestions);
    };
    // event handler for moving a questionUp
    const moveUpHandler = (index) => {
        let oldQuestions = [...questions];
        if (index > 0) {
            let item = oldQuestions[index - 1];
            oldQuestions[index - 1] = oldQuestions[index];
            oldQuestions[index] = item; 
        }
        setQuestions(oldQuestions);
    };
    // event handler for moving a questionDown
    const moveDownHandler = (index) => {
        let oldQuestions = [...questions];
        let lastIndex = questions.length - 1;
        if (index < lastIndex) {
            let item = oldQuestions[index + 1];
            oldQuestions[index + 1] = oldQuestions[index];
            oldQuestions[index] = item; 
        }
        setQuestions(oldQuestions);
    };


    // event handler for save quiz
    const saveQuizHandler = () => {
        // check if title is provided
        if (title.trim() === ``) {
            // inform user
            flagError(`Please provide a title`, true);
            // cannot process further
            return;
        }
        // check if time limit is valid
        let time = null;
        try{time = parseInt(timeLimit);} catch(error) { }
        if (!time || time < 0 || time > 120) {
            // inform user
            flagError(`Please provide a valid time limit`, true);
            // cannot process further
            return;
        }
        // check if at least one tag is provided
        if (tags.length === 0) {
            // inform user
            flagError(`Please provide at least one tag`, true);
            // cannot process further
            return;
        }
        // check if questions are added
        if (questions.length === 0) {
            // inform user
            flagError(`Please provide at least one question`, true);
            // cannot process further
            return;
        }
        // get all the problems
        let questionsList = [];
        for (let i = 0; i < questions.length; ++i) {
            let {ref} = questions[i];
            if (ref.current) {
                let question = {...ref.current.state};
                let {questionType, score, options, expectedAnswer} = question;
                questionsList.push(question);
                let points = null;
                try{points = parseInt(score)} catch(error){ }
                if (!points) {
                    // inform user
                    flagError(`Please provide valid score for question ${i + 1}`, true);
                    // cannot process further
                    return;
                }
                if (questionType === questionTypes.MULTIPLE_CHOICE || 
                    questionType === questionTypes.CHECKBOXES) {
                    // for questions with choices - at least two options are required
                    if (options.length < 2) {
                        // inform user
                        flagError(`Please provide at least two options for question ${i + 1}`, true);
                        // cannot process further
                        return;
                    }
                    let checkedCount = 0;
                    // check if options are valid
                    for (let j = 0; j < options.length; ++j){
                        if (options[j].checked) checkedCount++;
                        if (String(options[j].text).trim() === ``){
                            // inform user
                            flagError(`Please provide a text for question ${i + 1}, option ${j + 1}`, true);
                            // cannot process further
                            return;
                        }
                    }
                    // at least one of the options has to be checked
                    if (checkedCount === 0){
                        // inform user
                        flagError(`Please select at least one of the option for question ${i + 1}`, true);
                        // cannot process further
                        return;
                    }    
                } else {
                    // expected answer has to be provided
                    if (expectedAnswer.trim() === ``) {
                        // inform user
                        flagError(`Please provide expected answer for question ${i + 1}`, true);
                        // cannot process further
                        return;
                    }
                }
            }
        }
        // we can proceed to save the quiz to server
        console.log(questionsList);
    };



    // // update the properties of the problem
    // const handleAPISuccess = useCallback((response, saved) => {
    //     let {data} = response;
    //     let {problem} = data;
    //     if (!problem)   flagError(`Server couldn't process your request`);
    //     console.log(problem);
    //     // update all the properties of the problem
    //     setQuestionId(problem._id);  
    //     setTitle(problem.title);
    //     setTimeLimit(problem.timeLimit);
    //     let statement = String(problem.problemStatement);
    //     let problemHTML = statement.replaceAll(/(<p><br><\/p>)+/g, `<p><br></p>`);
    //     setQuestionStatement(problemHTML);
    //     setTags(problem.tags);
    //     setTestCases(problem.testCases);
    //     // update the location to edit
    //     let url = CLIENT_URL + "/#/admin/problem/edit/" + problem._id;
    //     if (window.location.href !== url)   window.location.href = url;
    //     // display toast on success
    //     if (saved) addToast(`Your problem was successfully saved!`, {appearance: 'success', autoDismiss: false});
    //     // the problem was found successfully so close the loader
    //     setIsLoading(false);
    // }, [flagError, addToast]);
    // // handles the API error
    // const handleAPIError = useCallback((error) => {
    //     console.log(error);
    //     let {response} = error;
    //     let {data} = response;
    //     let {message} = data;
    //     flagError(message);
    //     setIsLoading(false);
    // }, [flagError]);


    // // loads the problem from database if questionId is provided
    // useEffect(function(){
    //     if (!questionId) return;
    //     setIsLoading(true);
    //     verify_and_fetch_problem(questionId)
    //     .then(response => handleAPISuccess(response, false))
    //     .catch((error) => {
    //         console.log(error);
    //         localStorage.removeItem(TOKEN_STRING);
    //         setRedirect(<Redirect to="/" />);
    //     });
    // }, [questionId, addToast, handleAPISuccess, handleAPIError]);
    
    // // handles the submit form 
    // const onSaveQuestion = (event) => {
    //     if (!event.isTrusted)   return;
    //     if (isLoading)  return;
    //     // validate problems properties
    //     if (title.trim() === '')    return flagError('Please provide a valid title');
    //     if (timeLimit < 1)          return flagError('Time limit has to be at least 1ms');
    //     if (problemStatement === '')    return flagError('Please provide a problem statement');
    //     if (testCases.length === 0) return flagError('Please provide at least one test-case');
    //     for (let i = 0; i < testCases.length; ++i)
    //         if (testCases[i].points < 1)    return flagError('Points must be at least 1 for test-case ' + (i + 1));
    //     // everything is valid for the problem
    //     // now we go ahead and save the problem
    //     setIsLoading(true);
    //     save_problem(questionId, title, timeLimit, 
    //         problemStatement, tags, testCases)
    //     .then(response => handleAPISuccess(response, true))
    //     .catch(handleAPIError)
    // };

    // // handles the problem delete request
    // const onDeleteQuestion = (event => {
    //     if (!event.isTrusted)   return;
    //     if (isLoading)  return;
    //     setIsLoading(true);
    //     delete_problem(questionId).then(response => {
    //         setRedirect(<Redirect to="/" />);
    //     }).catch(error => {
    //         console.log(error);
    //         let {response} = error;
    //         let {data} = response;
    //         let {message} = data;
    //         flagError(message);
    //         setIsLoading(false);
    //     });
    // });


    // 

    if (redirect)   return redirect;
    document.title = (quizId ? "Edit" : "Create") + " Quiz | Quizlet";
    // UI to be rendered
    return (
        <div id="quiz-editor">
            <div className="header">
                <h1>{quizId ? "Edit" : "Create"} Quiz</h1>
                <p>The act of creating/editing quizzes is restricted 
                    to the admins of 
                    <ExternalLink to="https://panchalprogrammingacademy.github.io/panchalprogrammingacademy"
                        external={true} newWindow={true} className="link">
                            <strong>Panchal Programming Academy</strong>
                        </ExternalLink>
                    <br/>
                    Nobody outside the admin team has rights to create/edit problems.<br/>
                    If you are here by mistake then please leave the page immediately to avoid any future inconvenience!<br/>
                </p>                
            </div>


            {isLoading && <div className="loader"><Loader1 /></div>}
            {!isLoading && 
            <div className="problem-container">
                <div className="problem-meta-data">
                    <div className="input-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id='title' placeholder="Title"
                            value={title} onChange={event => setTitle(event.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="time-limit">Time limit (in minutes)</label>
                        <input type="number" min="0" max="120" id='time-limit' placeholder="Time limit" 
                            value={timeLimit} onChange={event => setTimeLimit(event.target.value)}/>
                    </div>
                </div>

                <div className="tags-container">
                    <div className="input-group">
                        <label htmlFor="tags">Tags</label>
                        <div className="tags">
                            {tags.map(tag => 
                            (<div className="tag" key={tag}>
                                {tag}
                                <button onClick={event => {
                                    let oldTags = [...tags];
                                    let index = oldTags.indexOf(tag);
                                    if (index === -1)   return;
                                    oldTags.splice(index, 1);
                                    setTags(oldTags);
                                }}><FontAwesomeIcon icon={faTimes}/></button>
                            </div>))}
                        </div>
                        <input type="text" onKeyDown={onAddTagHandler} 
                            value={tagText} onChange={event => setTagText(event.target.value)}
                            placeholder="Type a tag and hit enter"/>
                    </div>
                </div>

                <div className="problems">
                    {questions.map((question, index) => (
                        <Question 
                            key={question.id}
                            ref={question.ref}
                            index={index}
                            deleteHandler={deleteQuestionHandler}
                            moveUpHandler={moveUpHandler}
                            moveDownHandler={moveDownHandler}
                            questionId={question.id}
                            disabledUp={index === 0}
                            disabledDown={index === questions.length - 1}
                        />
                    ))}
                    {questions.length === 0 && 
                    <div className="nothing-here">
                        <div>
                            <img src={NothingHereImage} alt="" />
                        </div>
                        <div>
                            No questions added to this quiz!
                        </div>
                    </div>}
                </div>

                <div className="sticky-footer">
                    {quizId && 
                    <button className="secondary">
                        <ExternalLink to={"/problem/" + quizId} 
                            newWindow={true} className="browse-problem">
                            <FontAwesomeIcon icon={faDirections}/>
                        </ExternalLink>
                    </button>}
                    {quizId && 
                    <button className="danger">
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>}
                    <button className="info" onClick={addQuestionHandler}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <button className="success" onClick={saveQuizHandler}>
                        <FontAwesomeIcon icon={faCalendarCheck} />
                    </button>
                </div>
            </div>}

            <Fotter />
        </div>
    );
};