import React from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import ToastedNotes from './components/utility/ToastedNotes';
import Homepage from './components/core/Homepage';
import Login from './components/core/Login';
import LocalStorage from './components/core/LocalStorage';
import PageNotFound from './components/core/PageNotFound';
import CodingCoursePage from './components/coding/CodingCoursePage';
import AttemptCodingProblem from './components/coding/AttemptCodingProblem';
import CodingProblemEditor from './components/coding/CodingProblemEditor';
import QuizEditor from './components/quizlet/QuizEditor';
import {TOKEN_STRING} from './helpers/CONSTANTS';

// defines the private route
const PrivateRoute = ({component : Component, ...rest}) => {
	return (<Route {...rest} render={props => {
		let token = localStorage.getItem(TOKEN_STRING);
		return (token ? <Component {...props} /> : <Redirect to="/" />)
	}} />);
};


// component to be rendered!
export default function App() {
  return (
    <div className="App">
		<ToastedNotes>
			<Router>
				<Switch>
					<Route exact path="/" component={Homepage} />
					<Route exact path="/admin/login" component={Login} />
					<Route exact path="/admin/logout" component={() => {
						localStorage.removeItem(TOKEN_STRING);
						return (<Redirect to="/" />);
					}} />
					<Route exact path="/localStorage" component={LocalStorage} />
					<PrivateRoute exact path="/admin/new/problem" component={CodingProblemEditor} />
					<PrivateRoute exact path="/admin/problem/edit/:problemId" component={CodingProblemEditor} />
					<PrivateRoute exact path="/admin/new/quiz" component={QuizEditor} />
					<Route exact path="/course/the-complete-c-course/problems" 
						component={()=> <CodingCoursePage courseId='the-complete-c-course' />} />
					<Route exact path="/problem/:problemId" component={AttemptCodingProblem} />
					<Route path="/" component={PageNotFound} />
				</Switch>
			</Router>
		</ToastedNotes>
    </div>
  );
}
