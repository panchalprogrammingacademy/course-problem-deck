import React, { useState, useEffect } from 'react';
import '../Styles/AttemptProblem.scss';
import Loader0 from './Loader0';
import PageNotFound from './PageNotFound';
import ScreenResizer from './ScreenResizer';
import {fetch_problem, execute_code} from '../DataAccessObject/DataAccessObject';
import { useToasts } from 'react-toast-notifications';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CodeEditor from './CodeEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faLock, faUnlockAlt, faPaw } from '@fortawesome/free-solid-svg-icons';

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
                console.log(data.problem);
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
        if (disabled)   return;
        setDisabled(true);
        if (customTest) {
            setCustomResult(null);
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

        }
    };

    // decide the component to be rendered
    if (isLoading) return <Loader0 />
    if (notFound)   return notFound;
    if (!problem)   return <div>Failed to find that problem!</div>
    document.title = problem.title + " | Course Problem Deck";
    return (
        <div id="attempt-problem">
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
                    <button className="submit-code" disabled={disabled}
                        onClick={onSubmitCode}>Submit code</button>
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
                                    <FontAwesomeIcon icon={tc.publicTestCase ? 
                                        faUnlockAlt : faLock} /> Test Case {i  + 1}                              
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
                            <textarea value={problem.testCases[selectedTestCaseIndex].obtained}
                                onChange={event => event.preventDefault()}/>
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    );
};