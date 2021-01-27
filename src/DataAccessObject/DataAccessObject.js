import axios from 'axios';
export const TOKEN_STRING = 'token';

// // for local-development
// axios.defaults.baseURL = 'https://course-problem-deck-server.herokuapp.com';
// export const CLIENT_URL = 'http://localhost:3000'

// // for production
axios.defaults.baseURL = 'https://course-problem-deck-server.herokuapp.com';
export const CLIENT_URL = 'http://panchalprogrammingacademy.github.io/course-problem-deck';

// logins the user with given credentials
export const admin_login = (email, password) => {
    return new Promise(function(resolve, reject){
        axios.post('/admin/login',{email, password})
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};
// reads the problem with given id
export const verify_and_fetch_problem = (problemId) => {
    let token = localStorage.getItem(TOKEN_STRING);
    return new Promise(function(resolve, reject){
        axios.post('/admin/problem/', {problemId, token})
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};
// saves the problem
export const save_problem = (problemId, title, timeLimit, problemStatement, tags, testCases) => {
    let token = localStorage.getItem(TOKEN_STRING);
    let payload = {token, problemId, title, timeLimit, problemStatement, tags, testCases};
    return new Promise(function(resolve, reject){
        axios.post('/admin/problem/save', payload)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};
// deletes the problem
export const delete_problem = (problemId) => {
    let token = localStorage.getItem(TOKEN_STRING);
    let payload = {token, problemId};
    return new Promise(function(resolve, reject){
        axios.post('/admin/problem/delete', payload)
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