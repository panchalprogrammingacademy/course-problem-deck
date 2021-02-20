// imports
import axios from 'axios';

// saves the problem
export const saveProblemToBackend = (problem) => {
    let {problemId, title, timeLimit, problemStatement, tags, testCases} = problem;
    let payload = {problemId, title, timeLimit, problemStatement, tags, testCases};
    return new Promise(function(resolve, reject){
        axios.post('/admin/problem/save', payload)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// deletes the problem on backend
export const deleteProblemFromBackend = (problemId) => {
    return new Promise(function(resolve, reject){
        axios.post('/admin/problem/delete', {problemId})
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// reads all the problems for the given courseId
export const readAllProblemsFromBackend = (courseId) => {
    return new Promise(function(resolve, reject){
        axios.get('/course/' + courseId + "/problems")
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// reads the problem with given Id
export const readProblemFromBackend = (problemId) => {
    return new Promise(function(resolve, reject){
        axios.get('/problem/' + problemId)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// reads the problem after token verification
export const readProblemWithTokenVerification = (problemId) => {
    return new Promise(function(resolve, reject){
        axios.get('/admin/problem/' + problemId)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// executes the user's source code
export const runCodeOnBackend = (sourceCode, language, timeLimit, input, cmd) => {
    const payload = {sourceCode, language, timeLimit, input, cmd};
    return new Promise(function(resolve, reject){
        axios.post('/execute/problem', payload)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
}