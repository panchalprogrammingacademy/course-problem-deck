import React, { useEffect, useState, useCallback } from 'react';
import './styles/QuizEditor.scss';
import ExternalLink from '../utility/ExternalLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarCheck, faTimes, faCheck, faTrash, faDirections } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from '../utility/ToastedNotes';
import Question from './Question';
import Loader1 from '../utility/Loader1';
import { v4 as uuidv4 } from 'uuid';
import NothingHereImage from '../../assets/nothing.webp';
import {deleteQuizFromBackend, readQuizWithTokenVerification, saveQuizToBackend} from '../../helpers/Quizlet';
import {Redirect} from 'react-router-dom';
import Fotter from '../utility/Fotter';
import * as questionTypes from '../../helpers/QuestionTypes';


// functional component
export default function QuizEditor(props){
    const [isLoading, setIsLoading] = useState(false);
    const [quizId, setQuizId] = useState(props.match.params.quizId);
    const [title, setTitle] = useState('');
    const [timeLimit, setTimeLimit] = useState(0);
    const [tags, setTags] = useState([]);
    const [questions, setQuestions] = useState([
        {id: uuidv4(), ref: React.createRef()}
    ]);
    const [tagText, setTagText] = useState('');
    const [redirect, setRedirect] = useState(null);
    const { addToast, removeToast } = useToasts();


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
    // adds the id and ref properties to each question
    const filterAndSetQuestions = (questionsList) => {
        let newQuestionsList = questionsList.map(question => ({
            ...question,
            id: uuidv4(),
            ref: React.createRef()
        }));
        setQuestions(newQuestionsList);
    };


    // update the properties of the problem
    const handleAPISuccess = useCallback((response, saved) => {
        let {data} = response;
        let {quiz} = data;
        if (!quiz)   flagError(`Server couldn't process your request`);
        // update all the properties of the quiz
        setQuizId(quiz._id);  
        setTitle(quiz.title);
        setTimeLimit(quiz.timeLimit);
        setTags(quiz.tags);
        filterAndSetQuestions(quiz.questionsList);
        // update the location to edit
        let hash = "#/admin/quiz/edit/" + quiz._id;
        if (window.location.hash !== hash)   setRedirect(<Redirect to={"/admin/quiz/edit/" + quiz._id} />);
        // display toast on success
        if (saved) addToast(`Your quiz was successfully saved!`, {appearance: 'success', autoDismiss: false});
        // the problem was found successfully so close the loader
        setIsLoading(false);
    }, [flagError, addToast]);
    // handles the API error
    const handleAPIError = useCallback((error) => {
        if (error.response && error.response.data)  flagError(error.response.data.message);
        else                                        flagError(`Failed to process your request!`);
        setIsLoading(false);
    }, [flagError]);

    // loads the problem from database if problemId is provided
    useEffect(function(){
        if (!quizId) return;
        setIsLoading(true);
        readQuizWithTokenVerification(quizId)
        .then(response => handleAPISuccess(response, false))
        .catch((error) => {
            if (error.response && error.response.data)  flagError(error.response.data.message);
            else                                        flagError(`Failed to process your request!`);
            setRedirect(<Redirect to="/" />);
        });
    }, [quizId, flagError, handleAPISuccess]);
    


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
                let {
                    score,
                    options,
                    expectedAnswer,
                    questionType,
                } = question;
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
                
                // update the score to integral value
                question['score'] = points;
                // add the question to list of questions
                questionsList.push(question);
            }
        }

        // construct the quiz
        let quiz = {
            quizId,
            title,
            timeLimit : time,
            tags,
            questionsList
        };
        // update the list of questions
        filterAndSetQuestions(quiz.questionsList);
        setIsLoading(true);
        saveQuizToBackend(quiz)
        .then(response => handleAPISuccess(response, true))
        .catch(handleAPIError)
    };

    // delete quiz handler
    const deleteQuizHandler = () => {
        setIsLoading(true);
        deleteQuizFromBackend(quizId).then(response => {
            addToast(response.data.message, {appearance: 'success', autoDismiss: true});
            setRedirect(<Redirect to="/" />);
        }).catch(error => {
            console.log(error);
            if (error.response && error.response.data)
                flagError(error.response.data.message);
            setIsLoading(false);
        });

    };
    // shows modal for delete quiz
    const onDeleteQuiz = (event => {
        if (!event.isTrusted)   return;
        if (isLoading)  return;
        let toastId = uuidv4();
        let item = (
            <div className="delete-problem-modal">
                <div className="close-modal">
                    <div>
                        <strong>Confirm deletion</strong>
                    </div>
                    <button onClick={() => removeToast(toastId)} className="button">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <p>
                    Are you sure you want to delete this problem? <br/>
                    This is a potentially destructive operation and cannot be undone.
                </p>
                <div>
                    <button className="button success"
                        onClick={() => {
                            removeToast(toastId);
                            deleteQuizHandler();
                        }}>
                        <FontAwesomeIcon icon={faCheck} /> Proceed
                    </button>
                    <button className="button danger"
                        onClick={() => removeToast(toastId)}>
                        <FontAwesomeIcon icon={faTimes} /> Abort
                    </button>
                </div>
            </div>
        );
        addToast(item, {appearance: `none`, position: `center`, toastId});
    });


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
                            question={question}
                            index={index}
                            deleteHandler={deleteQuestionHandler}
                            moveUpHandler={moveUpHandler}
                            moveDownHandler={moveDownHandler}
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
                        <ExternalLink to={"/quiz/" + quizId} 
                            newWindow={true} className="browse-problem">
                            <FontAwesomeIcon icon={faDirections}/>
                        </ExternalLink>
                    </button>}
                    {quizId && 
                    <button className="danger" onClick={onDeleteQuiz}>
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