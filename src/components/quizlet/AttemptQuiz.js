// imports
import React, { useEffect, useState } from 'react';
import Loader0 from '../utility/Loader0';
import {readQuizFromBackend} from '../../helpers/Quizlet';
import { addToast } from '../utility/ToastedNotes';
import {Redirect} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassEnd, faPaw, faTrophy } from '@fortawesome/free-solid-svg-icons';
import './styles/AttemptQuiz.scss';
import AttemptQuestion from './AttemptQuestion';
import Fotter from '../utility/Fotter';

// formats the time
const formatTime = (time) => {
    time = Math.round(time / 1000);
    let minutes = Math.round(time / 60);
    let seconds = time % 60;
    return (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds);
};
// functional component
export default function AttempQuiz(props) {
    const quizId = props.match.params.quizId;
    const [quiz, setQuiz] = useState(null);
    const [maxScore, setMaxScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [userScore, setUserScore] = useState(0);
    const [attempted, setAttempted] = useState(0);
    const [sticky, setSticky] = useState(false);

    // makes the header sticky according to scroll height
    useEffect(()=>{
        window.addEventListener('scroll', (event)=> setSticky(window.pageYOffset > 50));
    }, []);

    // loads the problem
    useEffect(()=>{
        if (quiz)   return;
        setIsLoading(true);
        readQuizFromBackend(quizId).then(response => {
            let {data} = response;
            let {quiz} = data;
            console.log(quiz);
            if (!quiz) {
                addToast(`Failed to find that quiz`, {appearance: 'error', autoDismiss: true});
                setRedirect(<Redirect to="/" />);
            } else {
                setQuiz(quiz);
                let score = quiz.questionsList.reduce((sum, question) => sum + question.score, 0);
                setMaxScore(score);
                console.log('updated everything...');
                setIsLoading(false);
                // setTimeRemaining(1 * 60 * 1000);
                // startTimer();
            }
        }).catch(error => {
            addToast(String(error), {appearance: `error`, autoDismiss: true});
            setRedirect(<Redirect to="/" />);
        });
    }, [quizId, quiz]);


    // increments the number of attempted questions
    const incrementAttempted = () => setAttempted(attempted + 1);
    const incrementUserScore = (value) => setUserScore(userScore + value);


    // ui to be rendered
    if (redirect)   return redirect;
    console.log('checking isLoading...');
    if (isLoading)  return <Loader0 />
    console.log('checking quiz...');
    if (!quiz)      return <Loader0 />
    console.log('rendering items...');
    let headerClassList = ['header'];
    if (sticky) headerClassList.push('sticky');
    return (
        <div id="attempt-quiz">
            <div className={headerClassList.join(' ')}>
                <div className="quiz-metadata">
                    <div className="title">{quiz.title}</div>
                    <div className="score">{maxScore} Points</div>
                </div>
                <div className="quiz-operations">
                    {!submitted && 
                    <span className="button success fs-20">
                        <FontAwesomeIcon icon={faHourglassEnd} /> {formatTime(0)}
                    </span>}
                    <span className="button info fs-20">
                        <FontAwesomeIcon icon={faPaw} />
                        {attempted}/{quiz.questionsList.length}
                    </span>
                    {submitted && 
                    <span className="button secondary fs-20">
                        <FontAwesomeIcon icon={faTrophy} /> 
                        {userScore}/{maxScore}
                    </span>}
                </div>
            </div>

            <div className="problems">
                {quiz.questionsList.map((question, index) => (
                    <AttemptQuestion 
                        key={index}
                        index={index}
                        question={question}
                        result={submitted}
                        incrementAttempted={incrementAttempted}
                        incrementUserScore={incrementUserScore}
                    />
                ))}
            </div>

            {!submitted && <div className="submit">
                <button 
                    className="button success fs-20 full-width"
                    onClick={() => {
                        setSubmitted(true);
                        window.scrollTo(0, 0);
                    }}>
                    Submit
                </button>
            </div>}

            <Fotter />
        </div>
    );
};