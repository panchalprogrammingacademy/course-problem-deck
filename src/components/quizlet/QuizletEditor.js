// imports
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles/Editor.scss';

// configuration for quill-editor
const EditorModules = {
    formula: true, 
    syntax: true,
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['code-block', 'formula', 'blockquote', 'image'],
        [{ 'indent': '-1'}, { 'indent': '+1' }],       
        ['clean']
    ]
};
// functional component
export default function QuizletEditor(props) {
    const {content, setContent, placeholder, readOnly} = props;
    return (
        <div className="quizlet_editor">
            <ReactQuill 
                readOnly={readOnly}
                value={content} 
                onChange={setContent}
                placeholder={placeholder} 
                modules={EditorModules}
            />
        </div>
    );

};