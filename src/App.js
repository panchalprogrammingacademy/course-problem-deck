import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import Homepage from './Components/Homepage';
import CoursePage from './Components/CoursePage';
import PageNotFound from './Components/PageNotFound';
import Login from './Components/Login';
import AttemptProblem from './Components/AttemptProblem';
import LocalStorage from './Components/LocalStorage';
import { ToastProvider } from 'react-toast-notifications';
export default function App() {
  return (
    <div className="App">
		<ToastProvider>
			<Router>
				<Switch>
					<Route exact path="/" component={Homepage} />
					<Route exact path="/admin/login" component={Login} />
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