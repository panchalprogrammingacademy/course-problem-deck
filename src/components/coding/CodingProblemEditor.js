import React, { useEffect, useState, useCallback } from 'react';
import './styles/ProblemEditor.scss';
import ExternalLink from '../utility/ExternalLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarCheck, faTimes, faTrash, faDirections, faCheck } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useToasts } from '../utility/ToastedNotes';
import Loader1 from '../utility/Loader1';
import {Redirect} from 'react-router-dom';
import Fotter from '../utility/Fotter';
import { v4 as uuidv4 } from 'uuid';
import {readProblemWithTokenVerification, 
    saveProblemToBackend, deleteProblemFromBackend} 
    from '../../helpers/DataAccessObject';

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
export default function CodingProblemEditor(props){

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
    const { addToast, removeToast } = useToasts();


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
        if (!problem)   flagError(`Server couldn't process your request`);
        // update all the properties of the problem
        setProblemId(problem._id);  
        setTitle(problem.title);
        setTimeLimit(problem.timeLimit);
        let statement = String(problem.problemStatement);
        let problemHTML = statement.replaceAll(/(<p><br><\/p>)+/g, `<p><br></p>`);
        setProblemStatement(problemHTML);
        setTags(problem.tags);
        setTestCases(problem.testCases);
        // update the location to edit
        let hash = "#/admin/problem/edit/" + problem._id;
        if (window.location.hash !== hash)   setRedirect(<Redirect to={"/admin/problem/edit/" + problem._id} />);
        // display toast on success
        if (saved) addToast(`Your problem was successfully saved!`, {appearance: 'success', autoDismiss: false});
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
        if (!problemId) return;
        setIsLoading(true);
        readProblemWithTokenVerification(problemId)
        .then(response => handleAPISuccess(response, false))
        .catch((error) => {
            console.log(error);
            flagError(error.response.data.message);
            setRedirect(<Redirect to="/" />);
        });
    }, [problemId, flagError, handleAPISuccess, handleAPIError]);
    
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
        let problemToSave = {
            problemId,
            title,
            timeLimit,
            problemStatement,
            tags, 
            testCases
        };
        saveProblemToBackend(problemToSave)
        .then(response => handleAPISuccess(response, true))
        .catch(handleAPIError)
    };

    // deletes the problem
    const deleteProblemHandler = () => {
        setIsLoading(true);
        deleteProblemFromBackend(problemId).then(response => {
            addToast(response.data.message, {appearance: 'success', autoDismiss: true});
            setRedirect(<Redirect to="/" />);
        }).catch(error => {
            console.log(error);
            if (error.response && error.response.data)
                flagError(error.response.data.message);
            setIsLoading(false);
        });
    };

    // handles the problem delete request
    const onDeleteProblem = (event => {
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
                            deleteProblemHandler();
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
    document.title = (problemId ? "Edit" : "Create") + " Problem | Course Problem Deck";
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
                            value={timeLimit} onChange={event => setTimeLimit(parseInt(event.target.value || "0"))}/>
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
                                        onChange={event => updateTestCase({...testCase, points: parseInt(event.target.value || "0")}, index)} />
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

            <Fotter />
        </div>
    );
};