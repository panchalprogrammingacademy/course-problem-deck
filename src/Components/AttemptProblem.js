import React, { useState, useEffect } from 'react';
import '../Styles/AttemptProblem.scss';
import Loader0 from './Loader0';
import PageNotFound from './PageNotFound';
import ScreenResizer from './ScreenResizer';
import {fetch_problem} from '../DataAccessObject/DataAccessObject';
import { useToasts } from 'react-toast-notifications';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CodeEditor from './CodeEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faLock, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

export default function AttemptProblem(props){
    let problemId = props.match.params.problemId;
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(null);
    const [problem, setProblem] = useState(null);
    const [print, setIsPrint] = useState(false);
    const [code, setCode] = useState('');
    const [customTest, setCustomTest] = useState(false);
    const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
    const { addToast } = useToasts();



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
                console.log(data.problem);
            }
        }).catch(err => {
            addToast(err.toString(), {
                appearance: 'error',
            });
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
                    {problem.testCases.reduce((total, item) => total + item.points, 0)} points
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
                <CodeEditor code={code} setCode={setCode}/>
                <div className="code-operations">
                    <button onClick={uploadCode}>
                        <FontAwesomeIcon icon={faUpload}/> Upload code
                    </button>
                    <input type="checkbox" checked={customTest}
                        onChange={event => setCustomTest(!customTest)} /> 
                    <span>Test against custom input</span> <br/>
                    <button className="submit-code">Submit code</button>
                </div>
                {customTest && 
                <div className="custom-test">
                    <div>Custom Input</div>
                    <textarea />
                    <div>Command Line Arguments (if any) </div>
                    <input type="text" />
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