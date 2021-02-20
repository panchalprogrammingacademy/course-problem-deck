import React from 'react';
import './styles/Question.scss';
import QuizletEditor from './QuizletEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as questionTypes from '../../helpers/QuestionTypes';

// functional component
class Question extends React.Component{
    state = {
        problemStatement: this.props.question.problemStatement || '',
        justification: this.props.question.justification || '',
        score: this.props.question.score || 2,
        options: this.props.question.options || [],
        expectedAnswer: this.props.question.expectedAnswer || '',
        questionType: this.props.question.questionType || questionTypes.MULTIPLE_CHOICE,
    };
    setProperty = (name, value) => this.setState(prevState => ({...prevState, [name]: value}));
    setProblemStatement = (value) => this.setProperty(`problemStatement`, value);
    setJustification = (value) => this.setProperty(`justification`, value);
    setExpectedAnswer = (value) => this.setProperty(`expectedAnswer`, value);
    setScore = (value) => this.setProperty(`score`, value);
    setQuestionType = (value) => this.setProperty(`questionType`, value);
    setOptions = (value) => this.setProperty(`options`, value);

    // changes the type of question
    questionTypeChangeHandler = (value) => {
        // update the question type
        this.setQuestionType(value);
        // if new type is multiple-choice remove all selections
        if (value === questionTypes.MULTIPLE_CHOICE) {
            let oldOptions = [...this.state.options];
            for (let i = 0; i < oldOptions.length; ++i) oldOptions[i].checked = false;
            this.setOptions(oldOptions);    
        }
    };
    // addOptionHandler
    addOptionHandler = () => {
        let option = {
            text: ``,
            checked: false
        }
        this.setOptions([...this.state.options, option]);
    };
    // deleteOptionHandler
    deleteOptionHandler = (index) => {
        let oldOptions = [...this.state.options];
        oldOptions.splice(index, 1);
        this.setOptions(oldOptions);
    };
    // updates the option content
    updateOptionHandler = (index, newText, toggleState) => {
        let oldOptions = [...this.state.options];
        if (this.state.questionType === questionTypes.MULTIPLE_CHOICE){
            for (let i = 0; i < oldOptions.length; ++i) 
                oldOptions[i].checked = false;
        }
        if (newText != null)    oldOptions[index].text = newText;
        if (toggleState)        oldOptions[index].checked = !oldOptions[index].checked;
        this.setOptions(oldOptions);
    };


    render = () => {
        // destructure the properties
        let {
            question,
            deleteHandler,
            moveUpHandler,
            moveDownHandler,
            disabledUp,
            disabledDown,
            index,
        } = this.props;
        // construct the available options
        let questionsDropdownOptions = [];
        for (let qType in questionTypes) {
            questionsDropdownOptions.push(
                <option value={questionTypes[qType]} key={qType}>
                    {questionTypes[qType]}
                </option>
            );
        }

        let inputType = null;
        let {questionType} = this.state;
        if (questionType === questionTypes.MULTIPLE_CHOICE) inputType = `radio`;
        if (questionType === questionTypes.CHECKBOXES)      inputType = `checkbox`;
        let questionId = question.id;

        return (
            <div className="question">
                <div className="question-header">
                    <div>
                        <span>Question {index + 1}</span>                 
                    </div>
                    <div className="question-header-options">
                        <div className="input-group">
                            <input type="number" min="0" max="100" 
                                id={questionId} value={this.state.score}
                                placeholder="Points"
                                onChange={event => this.setScore(event.target.value)} />
                        </div>
                        <div className="input-group">
                            <select
                                value={this.state.questionType}
                                onChange={event => this.questionTypeChangeHandler(event.target.value)}>
                                {questionsDropdownOptions}
                            </select>
                        </div>
                        <button 
                            className="up-button" 
                            disabled={disabledUp} 
                            onClick={() => moveUpHandler(index)}>
                            <FontAwesomeIcon icon={faArrowUp}/>
                        </button>
                        <button 
                            className="down-button" 
                            disabled={disabledDown} 
                            onClick={() => moveDownHandler(index)}>
                            <FontAwesomeIcon icon={faArrowDown}/>
                        </button>
                        <button onClick={() => deleteHandler(index)}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </div>
                </div>

                <div className="editors">
                    <div>
                        <div className="label">Problem statement</div>
                        <QuizletEditor
                            content={this.state.problemStatement}
                            setContent={this.setProblemStatement}
                            placeholder="Your problem statement here..."
                        />
                    </div>
                    <div>
                        <div className="label">Your justification</div>
                        <QuizletEditor
                            content={this.state.justification}
                            setContent={this.setJustification}
                            placeholder="Your justification here..."
                        />
                    </div>
                </div>

                {questionType === questionTypes.SHORT_ANSWER && 
                <input 
                    type="text" 
                    className="answer"
                    value={this.state.expectedAnswer}
                    onChange={(event) => this.setExpectedAnswer(event.target.value)}
                    placeholder="Expected Answer"
                />}
                {questionType === questionTypes.PARAGRAPH &&
                <textarea 
                    className="answer"
                    value={this.state.expectedAnswer}
                    onChange={(event) => this.setExpectedAnswer(event.target.value)}
                    placeholder="Expected Answer"
                />}

                {inputType &&
                <div className="options">
                    {this.state.options.map((option, index) => (
                        <div className="option-input-group" key={index}>
                            <input 
                                type={inputType} 
                                checked={option.checked}
                                selected={option.selected}
                                onChange={() => this.updateOptionHandler(index, null, true)}/>
                            <textarea 
                                placeholder={`Option ${index + 1}`}
                                value={option.text}
                                onChange={(event) => this.updateOptionHandler(index, event.target.value, false)}
                            ></textarea>
                            <button className="button"
                                onClick={() => this.deleteOptionHandler(index)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    ))}
                    <div className="option-input-group">
                        <input type={inputType} disabled />
                        <textarea 
                            placeholder="Add option"
                            className="add-option-textarea"
                            value=""
                            onKeyDown={() => {}}
                            onChange={(event) => event.preventDefault()}
                            onClick={this.addOptionHandler}></textarea>
                        <button className="button" disabled>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>}
            </div>
        );
    };
};
export default Question;