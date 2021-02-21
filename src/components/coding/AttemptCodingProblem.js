import React, { useState, useEffect } from 'react';
import './styles/AttemptProblem.scss';
import Loader0 from '../utility/Loader0';
import Loader2 from '../utility/Loader2';
import Loader3 from '../utility/Loader3';
import Modal from '../utility/Modal';
import ScreenResizer from './ScreenResizer';
import {readProblemFromBackend, runCodeOnBackend} from '../../helpers/DataAccessObject';
import { useToasts } from '../utility/ToastedNotes';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CodeEditor from './CodeEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlockAlt, faPaw, faCheck, faTimes, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import {Redirect} from 'react-router-dom';
import {saveToLocalStorage, readFromLocalStorage} from '../../helpers/LocalStorage';


export default function AttemptCodingProblem(props){
    let problemId = props.match.params.problemId;
    const [isLoading, setIsLoading] = useState(true);
    const [problem, setProblem] = useState(null);
    const [print, setIsPrint] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('C');
    const [customTest, setCustomTest] = useState(false);
    const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [customCMD, setCustomCMD] = useState('');
    const [customResult, setCustomResult] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const { addToast } = useToasts();
    const [maxScore, setMaxScore] = useState(0);
    const [score, setScore] = useState(0);
    const [redirect, setRedirect] = useState(null);
    const [showModal, setShowModal] = useState(false);



    // fetches the problem from server!
    useEffect(function(){
        readProblemFromBackend(problemId).then(response => {
            let {data} = response;
            if (data.error) {
                setRedirect(<Redirect to="/" />);
            } else if (!data.problem){
                setRedirect(<Redirect to="/" />)
            } else {
                setIsLoading(false);
                setProblem(data.problem);
                setMaxScore(data.problem.testCases.reduce((total, item) => total + item.points, 0))
                let jsonObject = readFromLocalStorage(data.problem._id);
                if (jsonObject) {
                    setLanguage(jsonObject.language);
                    setCode(jsonObject.code);
                    let date = new Date(jsonObject.timestamp);
                    if (jsonObject.solved) {
                        addToast('You solved this problem on ' + date.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), {appearance: 'info'});
                    }
                }
            }
        }).catch(err => {
            console.log(err);
            if (err.response && err.response.data) 
                addToast(err.response.data.message, {appearance: `info`, autoDismiss: true});
            setRedirect(<Redirect to="/" />);
        });
    }, [problemId, addToast]);

    // override the printing behavior
    window.onbeforeprint = () => {
        let style = `height: auto; overflow: auto;`;
        let attempt_problem_div = document.getElementById('attempt-problem');
        attempt_problem_div.setAttribute('style', style);
        let left_div = document.getElementById('left');
        left_div.setAttribute(`style`, style);
        setIsPrint(true);
    }
    window.onafterprint = () => {
        let attempt_problem_div = document.getElementById('attempt-problem');
        attempt_problem_div.setAttribute('style', `height: 100vh; overflow: hidden;`);
        let left_div = document.getElementById('left');
        left_div.setAttribute(`style`, `height: 100vh; overflow: scroll;`);
        setIsPrint(false);
    }


    // upload code functionality
    const uploadCode = () => {
        let input = document.createElement('input');
        input.setAttribute('hidden', 'true');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.c, .py');
        input.addEventListener('change', event => {
            if (!input.files)   return;
            if (input.files.length === 0)   return;
            let file = input.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', event => {
                let code = event.target.result;
                setCode(code);
            });
            reader.readAsText(file);
        });
        input.click();
    };

    // handles the submit-code request
    const onSubmitCode = (event) => {
        if (!event.isTrusted)   return;
        if (disabled)   return;
        setDisabled(true);
        saveToLocalStorage(problem._id, problem.title, code, language);
        if (customTest) {
            runCodeOnBackend(code, language, problem.timeLimit, customInput, customCMD)
            .then(response => {
                let data = response.data;
                if (data.error) setCustomResult({isError: true, message: data.error});
                else            setCustomResult({isError: false, message: data.stdout + data.stderr})
            }).catch(err => {
                addToast(err.toString(), {appearance: 'error'});  
            }).finally(()=>{
                setDisabled(false);
            });
        } else {
            setScore(0);
            let testCases = problem.testCases;
            for (let i = 0; i < testCases.length; ++i){
                testCases[i].loading = true;
                testCases[i].executionScore = 0;
                delete testCases[i].passed;
            }
            setProblem({...problem, testCases: testCases});
            for (let i = 0; i < testCases.length; ++i) {
                let  tc = testCases[i];
                runCodeOnBackend(code, language, problem.timeLimit, tc.input, tc.cmd)
                .then(response => {
                    let data = response.data;
                    let executionOutput = data.error || data.stderr || data.stdout;
                    let oldTestCases = problem.testCases;
                    oldTestCases[i].loading = false;
                    oldTestCases[i].passed = false;
                    if (data.stdout) oldTestCases[i].passed = (tc.output.trim() === data.stdout.toString().trim());
                    oldTestCases[i].executionScore = (oldTestCases[i].passed ? tc.points : 0);
                    oldTestCases[i].executionOutput = executionOutput;
                    setProblem({...problem, testCases: oldTestCases});
                }).catch(err => {
                    let executionOutput = err.toString();
                    let oldTestCases = problem.testCases;
                    oldTestCases[i].loading = false;
                    oldTestCases[i].passed = false;
                    oldTestCases[i].executionOutput = executionOutput;
                    setProblem({...problem, testCases: oldTestCases});
                }).finally(()=>{
                    let newScore = problem.testCases.reduce((total, item) => total + item.executionScore, 0);
                    setScore(newScore);
                    if (newScore === maxScore) {
                        // save the problem to local-storage with success
                        saveToLocalStorage(problem._id, problem.title, code, language, true);
                        // display the modal to user
                        setShowModal(true);
                    }
                    let result = problem.testCases.reduce((result, item) => result || item.loading, false);
                    if (!result) setDisabled(false);
                });    
            }
        }
    };

    // decide the component to be rendered
    if (redirect)   return redirect;
    if (isLoading)  return <Loader0 />
    if (!problem)   return <div>Failed to find that problem!</div>
    document.title = problem.title + " | Course Problem Deck";
    return (
        <div id="attempt-problem">
            {showModal && 
            <Modal 
                message="You have passed all the test cases!"
                onClose={() => setShowModal(false)} 
            />}
            <div className={`left ${print ? 'full-flex' : ''}`} id="left">
                {print && <a href="/">{window.location.href}</a>}
                <div className="problem-header">
                    {problem.title}
                </div>
                <div className="problem-score">
                    {maxScore} points
                </div>
                <ReactQuill defaultValue={problem.problemStatement} readOnly
                    className="problem"/>
                <div className="tags">
                    <div className="tags-header">
                        Problem tags:
                    </div>
                    {function(){
                        return problem.tags.map(tag => {
                            return (
                                <div key={tag} className="tag">{tag}</div>
                            );
                        });
                    }()}
                </div>
            </div>
            {!print && <ScreenResizer />}
            {!print &&
            <div className="right" id="right">
                <CodeEditor code={code} setCode={setCode}
                    language={language} setLanguage={setLanguage}/>
                <div className="code-operations">
                    <button onClick={uploadCode}>
                        <FontAwesomeIcon icon={faArrowUp}/> Upload code
                    </button>
                    <input type="checkbox" checked={customTest}
                        onChange={event => setCustomTest(!customTest)} /> 
                    <span>Test against custom input</span> <br/>
                    <div className="button-container">
                        {disabled && <Loader2 />}
                        {!disabled &&
                        <button className="submit-code" 
                            onClick={onSubmitCode}>Submit code
                        </button>}
                    </div>
                </div>
                {customTest && 
                <div className="custom-test">
                    {customResult && 
                    <div className={customResult.isError ? "error-result" : "success-result"}>
                        {customResult.message}
                    </div>}
                    <div>Custom Input</div>
                    <textarea value={customInput} onChange={event => setCustomInput(event.target.value)} />
                    <div>Command Line Arguments (if any) </div>
                    <input type="text" value={customCMD} onChange={event => setCustomCMD(event.target.value)}/>
                </div>}
                <div className="results">
                    <div className="test-case-list">
                        {problem.testCases.map((tc, i) => {
                            return (
                                <div className={selectedTestCaseIndex === i ?
                                    'test-case selected-test-case': 'test-case'}
                                    onClick={event => setSelectedTestCaseIndex(i)}
                                    key={i}>
                                    <span>
                                        <FontAwesomeIcon icon={tc.publicTestCase ? 
                                        faUnlockAlt : faLock} /> Test Case {i  + 1}
                                    </span>
                                    {tc.loading && <Loader3 />}
                                    {tc.passed === true && <FontAwesomeIcon icon={faCheck} className="accepted" />}
                                    {tc.passed === false && <FontAwesomeIcon icon={faTimes} className="rejected" />}
                                </div>
                            );
                        })}
                        <div className="user-score">
                            <FontAwesomeIcon icon={faPaw} /> Score: {score}/{maxScore}
                        </div>
                    </div>
                    <div className="test-case-result">
                        {!problem.testCases[selectedTestCaseIndex].publicTestCase && 
                            'This is a private test case!'}
                        {problem.testCases[selectedTestCaseIndex].publicTestCase && 
                        <div>
                            <div>Input</div>
                            <textarea value={problem.testCases[selectedTestCaseIndex].input}
                                onChange={event => event.preventDefault()}
                                />
                            <div>Expected Output</div>
                            <textarea value={problem.testCases[selectedTestCaseIndex].output}
                                onChange={event => event.preventDefault()}/>
                            <div>Your output</div>
                            <textarea value={problem.testCases[selectedTestCaseIndex].executionOutput}
                                onChange={event => event.preventDefault()}/>
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    );
};