import React from 'react';
import './styles/Question.scss';
import './styles/AttemptQuestion.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import QuizletEditor from './QuizletEditor';
import * as questionTypes from '../../helpers/QuestionTypes';

// functional component
class Question extends React.Component{
    state = {
        userAnswer: '',
        userOptions: this.props.question.options.map(option => ({...option, checked: false})),
        touched: false
    };
    setProperty = (name, value) => this.setState(prevState => {
        if (!prevState.touched) {this.props.incrementAttempted();}
        return ({
            ...prevState, 
            [name]: value,
            touched: true
        });
    });
    setUserOptions = (value) => this.setProperty(`userOptions`, value);
    setUserAnswer = (value) => this.setProperty(`userAnswer`, value);

    // updates the option content
    updateOptionHandler = (index) => {
        let oldOptions = [...this.state.userOptions];
        if (this.props.question.questionType === questionTypes.MULTIPLE_CHOICE){
            for (let i = 0; i < oldOptions.length; ++i) 
                oldOptions[i].checked = false;
        }
        oldOptions[index].checked = !oldOptions[index].checked;
        this.setUserOptions(oldOptions);
    };

    // compares the values and returns the correct/incorrect status
    decideResult = () => {
        let {question} = this.props;
        let {questionType} = question;
        if (questionType === questionTypes.SHORT_ANSWER ||
                questionType === questionTypes.PARAGRAPH)
                    return (this.state.userAnswer === question.expectedAnswer);
        if (questionType === questionTypes.MULTIPLE_CHOICE ||
                questionType === questionTypes.CHECKBOXES){
            let result = true;
            let length = this.state.userOptions.length;
            for (let i = 0; i < length; ++i)
                if (this.state.userOptions[i].checked !== question.options[i].checked){
                    result = false;
                    break;
                }
            return result;
        }
        return true;
    };


    render = () => {
        // destructure the properties
        let {
            question,
            result,
            index,
        } = this.props;
        let {
            problemStatement,
            justification,
            score,
            questionType
        } = question;
        let correct = null, incorrect = null;
        if (result) {
            correct = this.decideResult();
            incorrect = !correct;   
        }
        let inputType = null;
        if (questionType === questionTypes.MULTIPLE_CHOICE) inputType = `radio`;
        if (questionType === questionTypes.CHECKBOXES)      inputType = `checkbox`;

        let headersClassList = ['question-header'];
        if (correct)    headersClassList.push('correct');
        if (incorrect)  headersClassList.push('incorrect');
        // remove unnecessary extra spaces in string
        problemStatement = problemStatement.replaceAll(/(<p><br><\/p>)+/g, '');

        // actual ui to be rendered
        return (
            <div className="question attempt-question">
                <div className={headersClassList.join(' ')}>
                    <div>
                        <div className="icon">
                            {correct && <FontAwesomeIcon icon={faCheck} />}
                            {incorrect && <FontAwesomeIcon icon={faTimes} />}
                        </div>
                        <span>Question {index + 1} ({score} POINTS)</span>                 
                    </div>
                </div>
                <div>
                    <div className="editors">
                        <QuizletEditor
                            readOnly={true}
                            content={problemStatement}
                            placeholder="Your problem statement here..."
                        />
                    </div>

                    {questionType === questionTypes.SHORT_ANSWER && 
                    <input 
                        type="text" 
                        className="answer"
                        value={this.state.userAnswer}
                        onChange={(event) => !result && this.setUserAnswer(event.target.value)}
                        placeholder="Your Answer"
                    />}
                    {questionType === questionTypes.PARAGRAPH &&
                    <textarea 
                        className="answer"
                        value={this.state.userAnswer}
                        onChange={(event) => !result && this.setUserAnswer(event.target.value)}
                        placeholder="Your Answer"
                    />}

                    {inputType &&
                    <div className="options">
                        {this.state.userOptions.map((option, index) => (
                            <div className="option-input-group" key={index}>
                                <input 
                                    type={inputType} 
                                    checked={option.checked}
                                    selected={option.selected}
                                    onChange={() => !result && this.updateOptionHandler(index, null, true)}/>
                                <p>{option.text}</p>
                            </div>
                        ))}
                    </div>}
                </div>


                {result && justification && 
                <div className="editors justification">
                    <div className="heading">Justification</div>
                    <QuizletEditor
                        readOnly={true}
                        content={justification}
                        placeholder="Your problem statement here..."
                    />
                </div>}

            </div>
        );
    };
};
export default Question;