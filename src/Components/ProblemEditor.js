import React, { useEffect, useState, useCallback } from 'react';
import '../Styles/ProblemEditor.scss';
import ExternalLink from './ExternalLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarCheck, faTimes, faTrash, faDirections } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useToasts } from 'react-toast-notifications';
import Loader1 from './Loader1';
import {verify_and_fetch_problem, save_problem, CLIENT_URL, delete_problem} from '../DataAccessObject/DataAccessObject';
import {Redirect} from 'react-router-dom';

// configuration for quill-editor
const EditorModules = {
    formula: true, 
    syntax: true,
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],  
        ['code-block', 'formula', 'blockquote', 'image'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': []}],
        [{ 'indent': '-1'}, { 'indent': '+1' }],       
        ['clean']
    ]
};


// functional component
export default function ProblemEditor(props){

    const params = props.match.params;
    const [problemId, setProblemId] = useState(params.problemId);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [timeLimit, setTimeLimit] = useState(1000);
    const [problemStatement, setProblemStatement] = useState('');
    const [tags, setTags] = useState([]);
    const [tagText, setTagText] = useState('');
    const [testCases, setTestCases] = useState([]);
    const [redirect, setRedirect] = useState(null);
    const { addToast } = useToasts();


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

    // event handler for add test-case
    const onAddTestCaseHandler = (event) => {
        let testCase = {
            publicTestCase: false,
            input: '',
            output: '',
            cmd: '',
            points: 5,
        };
        setTestCases([...testCases, testCase]);
    };

    // updates the test case
    const updateTestCase = (testCase, index) => {
        let oldTestCases = [...testCases];
        oldTestCases[index] = testCase;
        setTestCases(oldTestCases);
    };

    // deletes the test case
    const onDeleteTestCase = (testCase, index) => {
        let oldTestCases = [...testCases];
        oldTestCases.splice(index, 1);
        setTestCases(oldTestCases);
    };

    // displays the toast with error message
    const flagError = useCallback((message) => addToast(message, {appearance: 'error', autoDismiss: false}), [addToast]);
    // update the properties of the problem
    const handleAPISuccess = useCallback((response, saved) => {
        let {data} = response;
        let {problem} = data;
        if (!problem)   return flagError(`Server couldn't find that problem!`);
        // update all the properties of the problem
        setTitle(problem.title);
        setTimeLimit(problem.timeLimit);
        setProblemStatement(problem.problemStatement);
        setTags(problem.tags);
        setTestCases(problem.testCases);
        setProblemId(problem._id);        
        // update the location to edit
        window.location.href = CLIENT_URL + "/#/admin/problem/edit/" + problem._id;
        // display toast on success
        if (saved) addToast(`Your problem was successfully saved!`, {appearance: 'success', autoDismiss: false});
    }, [flagError, addToast]);
    // handles the API error
    const handleAPIError = useCallback((error) => {
        console.log(error);
        let {response} = error;
        let {data} = response;
        let {message} = data;
        flagError(message);
    }, [flagError]);


    // loads the problem from database if problemId is provided
    useEffect(function(){
        if (!problemId) return;
        setIsLoading(true);
        verify_and_fetch_problem(problemId)
        .then(response => handleAPISuccess(response, false))
        .catch(error => setRedirect(<Redirect to="/" />))
        .finally(()=> setIsLoading(false));
    }, [problemId, addToast, handleAPISuccess, handleAPIError]);
    
    // handles the submit form 
    const onSaveProblem = (event) => {
        if (!event.isTrusted)   return;
        if (isLoading)  return;
        // validate problems properties
        if (title.trim() === '')    return flagError('Please provide a valid title');
        if (timeLimit < 1)          return flagError('Time limit has to be at least 1ms');
        if (problemStatement === '')    return flagError('Please provide a problem statement');
        if (testCases.length === 0) return flagError('Please provide at least one test-case');
        for (let i = 0; i < testCases.length; ++i)
            if (testCases[i].points < 1)    return flagError('Points must be at least 1 for test-case ' + (i + 1));
        // everything is valid for the problem
        // now we go ahead and save the problem
        setIsLoading(true);
        save_problem(problemId, title, timeLimit, 
            problemStatement, tags, testCases)
        .then(response => handleAPISuccess(response, true))
        .catch(handleAPIError)
        .finally(()=> setIsLoading(false));
    };

    // handles the problem delete request
    const onDeleteProblem = (event => {
        if (!event.isTrusted)   return;
        if (isLoading)  return;
        setIsLoading(true);
        delete_problem(problemId).then(response => {
            setRedirect(<Redirect to="/" />);
        }).catch(error => {
            console.log(error);
            let {response} = error;
            let {data} = response;
            let {message} = data;
            flagError(message);
            setIsLoading(false);
        });
    });

    if (redirect)   return redirect;
    document.title = (problemId ? "Edit" : "Add") + " Problem | Course Problem Deck";
    // UI to be rendered
    return (
        <div id="problem-editor">
            <div className="header">
                <h1>{problemId ? "Edit" : "Create"} Problem</h1>
                <p>The act of creating/editing problems is restricted 
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
            {!isLoading && <div className="problem-container">
            <div className="problem-meta-data">
                    <div className="input-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id='title' placeholder="Title"
                            value={title} onChange={event => setTitle(event.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="time-limit">Time limit (in milli-seconds)</label>
                        <input type="number" min="0" max="60000" id='time-limit' placeholder="Time limit" 
                            value={timeLimit} onChange={event => setTimeLimit(event.target.value)}/>
                    </div>
                </div>
                <div className="quill-editor-container">
                    <ReactQuill value={problemStatement} onChange={setProblemStatement}
                        placeholder="Your problem statement here..." 
                        modules={EditorModules}/>
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

                <div className="test-cases-container">
                    {testCases.map((testCase, index) => (
                        <div className="test-case" key={index}>
                            <div className="header">
                                Test Case {index + 1} 
                                <button onClick={event => onDeleteTestCase(testCase, index)}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </div>
                            <div className="public-test-case-input">
                                <input type="checkbox" checked={testCase.publicTestCase}
                                    onChange={event => updateTestCase({...testCase, publicTestCase: !testCase.publicTestCase}, index)} /> Make this test case publicly visible
                            </div>
                            <div className="col-2">
                                <div className="input-group">
                                    <label htmlFor={`input${index}`} >Input(Display formatting may not be same)</label>
                                    <textarea id={`input${index}`} value={testCase.input}
                                        onChange={event => updateTestCase({...testCase, input: event.target.value}, index)}></textarea>
                                </div>
                                <div className="input-group">
                                    <label htmlFor={`output${index}`} >Output(Display formatting may not be same)</label>
                                    <textarea id={`output${index}`} value={testCase.output}
                                        onChange={event => updateTestCase({...testCase, output: event.target.value}, index)}></textarea>
                                </div>
                            </div>
                            <div className="col-2">
                            <div className="input-group">
                                    <label htmlFor={`cmd${index}`} >Command line arguments (if any)</label>
                                    <input type="text" id={`cmd${index}`} value={testCase.cmd}
                                        onChange={event => updateTestCase({...testCase, cmd: event.target.value}, index)} />
                                </div>
                                <div className="input-group">
                                    <label htmlFor={`points${index}`} >Points (integral score)</label>
                                    <input type="number" min="0" max="100" 
                                        id={`points${index}`} value={testCase.points}
                                        onChange={event => updateTestCase({...testCase, points: event.target.value}, index)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="sticky-footer">
                    {problemId && 
                    <button className="secondary">
                        <ExternalLink to={"/problem/" + problemId} 
                            newWindow={true} className="browse-problem">
                            <FontAwesomeIcon icon={faDirections}/>
                        </ExternalLink>
                    </button>}
                    {problemId && 
                    <button className="danger" onClick={onDeleteProblem}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>}
                    <button className="info" onClick={onAddTestCaseHandler}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <button className="success" onClick={onSaveProblem}>
                        <FontAwesomeIcon icon={faCalendarCheck} />
                    </button>
                </div>
            </div>}
        </div>
    );
};