import React, { useState, useEffect } from 'react';
import '../Styles/AttemptProblem.scss';
import Loader0 from './Loader0';
import Loader2 from './Loader2';
import Loader3 from './Loader3';
import PageNotFound from './PageNotFound';
import Modal from './Modal';
import ScreenResizer from './ScreenResizer';
import {fetch_problem, execute_code} from '../DataAccessObject/DataAccessObject';
import { useToasts } from 'react-toast-notifications';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CodeEditor from './CodeEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faLock, faUnlockAlt, faPaw, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AttemptProblem(props){
    let problemId = props.match.params.problemId;
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(null);
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
    const [showModal, setShowModal] = useState(false);



    // fetches the problem from server!
    useEffect(function(){
        fetch_problem(problemId).then(response => {
            let {data} = response;
            if (data.error) {
                addToast(data.error, {
                    appearance: 'error',
                });    
            } else if (!data.problem){
                setNotFound(<PageNotFound />);
            } else {
                setProblem(data.problem);
                setMaxScore(data.problem.testCases.reduce((total, item) => total + item.points, 0))
                let oldSolution = localStorage.getItem(data.problem._id);
                if (oldSolution) {
                    let jsonObject = JSON.parse(oldSolution);
                    setLanguage(jsonObject.language);
                    setCode(jsonObject.code);
                    let date = new Date(jsonObject.timestamp);
                    addToast('You solved this problem on ' + date.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), {appearance: 'info'});
                }
            }
        }).catch(err => {
            addToast(err.toString(), {appearance: 'error'});
        }).finally(()=>{
            setIsLoading(false);
        });

    }, [problemId, addToast]);

    // override the printing behavior
    window.onbeforeprint = () => setIsPrint(true);
    window.onafterprint = () => setIsPrint(false);

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
        if (customTest) {
            execute_code(code, language, problem.timeLimit, customInput, customCMD)
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
                execute_code(code, language, problem.timeLimit, tc.input, tc.cmd)
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
                    if (newScore === maxScore)  setShowModal(true);
                    let result = problem.testCases.reduce((result, item) => result || item.loading, false);
                    if (!result) setDisabled(false);
                });    
            }
        }
    };


    const onClose = ()=> setShowModal(false);
    const onSave = ()=> {
        // get solution information
        let contentToSave = {title: problem.title, code,language,timestamp: new Date()};
        // store the item in local-storage
        localStorage.setItem(problem._id, JSON.stringify(contentToSave));
        // hide the modal
        setShowModal(false);
    };

    // decide the component to be rendered
    if (isLoading) return <Loader0 />
    if (notFound)   return notFound;
    if (!problem)   return <div>Failed to find that problem!</div>
    document.title = problem.title + " | Course Problem Deck";
    return (
        <div id="attempt-problem">
            {showModal && <Modal onClose={onClose} onSave={onSave} />}
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
                        <FontAwesomeIcon icon={faUpload}/> Upload code
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