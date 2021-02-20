// imports
import axios from 'axios';
import {BASE_URL, TOKEN_STRING} from './CONSTANTS';
// configurations
axios.defaults.baseURL = BASE_URL;
// set the authToken before making a request
axios.interceptors.request.use(req => {
    req.headers = {
        'Content-Type': 'application/json',
        'token': localStorage.getItem(TOKEN_STRING),
    };
    return req;
}, err => {
    return new Promise.reject(err);
});

// logins the user with given credentials
export const adminLogin = (email, password) => {
    return new Promise(function(resolve, reject){
        axios.post('/admin/login',{email, password})
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// export helpers from CodingProblems
export {
    saveProblemToBackend,
    deleteProblemFromBackend,
    readAllProblemsFromBackend,
    readProblemFromBackend,
    readProblemWithTokenVerification,
    runCodeOnBackend
} from './CodingProblems';

// export helpers from Quizlet
export {
    saveQuizToBackend,
    deleteQuizFromBackend,
    readAllQuizzesFromBackend,
    readQuizFromBackend,
    readQuizWithTokenVerification
} from './Quizlet';