import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import Homepage from './Components/Homepage';
import CoursePage from './Components/CoursePage';
import PageNotFound from './Components/PageNotFound';
import Login from './Components/Login';
export default function App() {
  return (
    <div className="App">
		<Router>
			<Switch>
				<Route exact path="/" component={Homepage} />
				<Route exact path="/admin/login" component={Login} />
				<Route exact path="/course/the-complete-c-course" 
					component={()=> <CoursePage courseId='the-complete-c-course' />} />
				<Route path="/" component={PageNotFound} />
			</Switch>
		</Router>
    </div>
  );
}