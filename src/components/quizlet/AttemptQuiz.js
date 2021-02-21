// imports
import React, { useEffect, useState } from 'react';
import Loader0 from '../utility/Loader0';
import {readQuizFromBackend} from '../../helpers/Quizlet';
import { addToast } from '../utility/ToastedNotes';
import {Redirect} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Timer from './Timer';
import './styles/AttemptQuiz.scss';
import AttemptQuestion from './AttemptQuestion';
import Fotter from '../utility/Fotter';
import Modal from '../utility/Modal';

// functional component
export default function AttempQuiz(props) {
    const quizId = props.match.params.quizId;
    const [quiz, setQuiz] = useState(null);
    const [maxScore, setMaxScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [attempted, setAttempted] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [sticky, setSticky] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // for neater printing
    window.onbeforeprint = () => {
        let item = document.getElementById('attempt_quiz_header');
        if (!item)  return;
        item.classList.remove('sticky');
    };
    window.onafterprint = () => {
        let item = document.getElementById('attempt_quiz_header');
        if (!item)  return;
        if (sticky) item.classList.add('sticky');
    };

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
            let readQuiz = data.quiz;
            if (!readQuiz) {
                addToast(`Failed to find that quiz`, {appearance: 'error', autoDismiss: true});
                setRedirect(<Redirect to="/" />);
            } else {
                let questionsList = readQuiz.questionsList.map(question => ({...question, ref: React.createRef()}));
                readQuiz.questionsList = questionsList;
                setQuiz(readQuiz);
                let score = readQuiz.questionsList.reduce((sum, question) => sum + question.score, 0);
                setMaxScore(score);
                setIsLoading(false);
            }
        }).catch(error => {
            addToast(String(error), {appearance: `error`, autoDismiss: true});
            setRedirect(<Redirect to="/" />);
        });
    }, [quizId, quiz]);


    // increments the number of attempted questions
    const incrementAttempted = () => setAttempted(attempted + 1);

    // handler for submit quiz
    const submitQuizHandler = () => {
        window.scrollTo(0, 0);
        setSubmitted(true);
        let score = 0;
        let {questionsList} = quiz;
        for (let i = 0; i < questionsList.length; ++i) {
            let question = questionsList[i];
            if (question.ref.current && question.ref.current.decideResult())
                score += question.score;
        }
        setUserScore(score);
        if (score === maxScore) setShowModal(true);
    };

    // ui to be rendered
    if (redirect)   return redirect;
    if (isLoading)  return <Loader0 />
    if (!quiz)      return <Loader0 />
    let headerClassList = ['header'];
    if (sticky) headerClassList.push('sticky');
    document.title = (quiz ? quiz.title + " | " : "") + "Course Problem Deck";
    return (
        <div id="attempt-quiz">
            {showModal && 
            <Modal 
                message="You have got all the answers right."
                onClose={() => setShowModal(false)} 
            />}
            <div id="attempt_quiz_header" className={headerClassList.join(' ')}>
                <div className="quiz-metadata">
                    <div className="title">{quiz.title}</div>
                    <div className="score">{maxScore} Points</div>
                </div>
                <div className="quiz-operations">
                    {!submitted && quiz.timeLimit > 0 && 
                        <Timer 
                            time={quiz.timeLimit * 60}
                            onFinish={()=> setSubmitted(true)}
                        />
                    }
                    <span className="button info fs-20">
                        <FontAwesomeIcon icon={faPaw} />
                        {attempted}/{quiz.questionsList.length}
                    </span>
                    {submitted && 
                    <span className="button success fs-20">
                        <FontAwesomeIcon icon={faTrophy} /> 
                        <span id="userScore">{userScore}</span>/{maxScore}
                    </span>}
                </div>
            </div>

            <div className="problems">
                {quiz.questionsList.map((question, index) => (
                    <AttemptQuestion 
                        key={index}
                        index={index}
                        ref={question.ref}
                        question={question}
                        result={submitted}
                        incrementAttempted={incrementAttempted}
                    />
                ))}
            </div>

            {!submitted && <div className="submit">
                <button 
                    className="button success fs-20 full-width"
                    onClick={submitQuizHandler}>
                    Submit
                </button>
            </div>}

            <Fotter />
        </div>
    );
};