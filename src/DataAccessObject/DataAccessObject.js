import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';
// axios.defaults.baseURL = 'https://course-problem-deck-server.herokuapp.com';


// logins the user with given credentials
export const admin_login = (email, password) => {
    return new Promise(function(resolve, reject){
        axios.post('/admin/login',{email, password})
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};
// logouts the user 
export const admin_logout = () => {
    return new Promise(function(resolve, reject){
        axios.post('/admin/logout')
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};
// reads all the problems for the given courseId
export const course_problems = (courseId) => {
    return new Promise(function(resolve, reject){
        axios.get('/course/' + courseId)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};
// reads the problem with given id
export const fetch_problem = (problemId) => {
    return new Promise(function(resolve, reject){
        axios.get('/problem/' + problemId)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};
// executes the user's source code
export const execute_code = (sourceCode, language, timeLimit, input, cmd) => {
    const payload = {sourceCode, language, timeLimit, input, cmd};
    return new Promise(function(resolve, reject){
        axios.post('/execute/problem', payload)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
}