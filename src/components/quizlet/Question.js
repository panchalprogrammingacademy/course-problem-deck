import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Styles/Problem.scss';
import * as questionTypes from '../DataAccessObject/questionTypes';

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
export default function Problem(props) {
    const {
        problemId
    } = props;
    const [problemStatement, setProblemStatement] = useState('');
    const [justification, setJustification] = useState('');
    const [score, setScore] = useState(0);
    const [options, setOptions] = useState([]);
    const [questionType, setQuestionType] = useState(questionTypes.MULTIPLE_CHOICE);

    // construct the available options
    let questionsDropdownOptions = [];
    for (let qType in questionTypes) {
        questionsDropdownOptions.push(
            <option value={qType} key={qType}>
                {questionTypes[qType]}
            </option>
        );
    }

    // ui to be rendered
    return (
        <div className="problem">
            {problemId}
            <div className="header">
                <div className="col-2">
                    <div className="input-group">
                        <label htmlFor={problemId} >Points (integral score)</label>
                        <input type="number" min="0" max="100" 
                            id={problemId} value={score}
                            onChange={event => setScore(event.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor={problemId} >Question type</label>
                        <select 
                            value={questionType}
                            onChange={event => setQuestionType(event.target.value)}>
                            {questionsDropdownOptions}
                        </select>
                    </div>
                </div>
            </div>
            <ReactQuill value={problemStatement} onChange={setProblemStatement}
                placeholder="Your problem statement here..." 
                modules={EditorModules}/>
            <ReactQuill value={justification} onChange={setJustification}
                placeholder="Your justification here..." 
                modules={EditorModules}/>
        </div>
    );
};