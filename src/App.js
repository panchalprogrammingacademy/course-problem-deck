import React from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Homepage from './Components/Homepage';
import CoursePage from './Components/CoursePage';
import PageNotFound from './Components/PageNotFound';
import Login from './Components/Login';
import AttemptProblem from './Components/AttemptProblem';
import LocalStorage from './Components/LocalStorage';
import { ToastProvider } from 'react-toast-notifications';
import ProblemEditor from './Components/ProblemEditor';

// checks if the user has the token
function hasToken(){
	return true;
}

// defines the private route
const PrivateRoute = ({component : Component, ...rest}) => {
	return (
		<Route {...rest} render={props => (
			hasToken() 
			? <Component {...props} />
			: <Redirect to="/" /> 
		)} />
	);
};


// component to be rendered!
export default function App() {
  return (
    <div className="App">
		<ToastProvider>
			<Router>
				<Switch>
					<PrivateRoute exact path="/admin/problem/new" component={ProblemEditor} />
					<Route exact path="/admin/login" component={Login} />

					<Route exact path="/" component={Homepage} />
					<Route exact path="/course/the-complete-c-course" 
						component={()=> <CoursePage courseId='the-complete-c-course' />} />
					<Route exact path="/problem/:problemId" component={AttemptProblem} />
					<Route path="/localStorage" component={LocalStorage} />
					<Route path="/" component={PageNotFound} />
				</Switch>
			</Router>
		</ToastProvider>
    </div>
  );
}