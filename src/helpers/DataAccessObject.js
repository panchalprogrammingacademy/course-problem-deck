// imports
import axios from 'axios';
import {BASE_URL, TOKEN_STRING} from './CONSTANTS';
// configurations
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers = {
    'Content-Type': 'application/json',
    'token': localStorage.getItem(TOKEN_STRING)
};

// logins the user with given credentials
export const admin_login = (email, password) => {
    return new Promise(function(resolve, reject){
        axios.post('/admin/login',{email, password})
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// export helpers from CodingProblems
export {
    verify_and_fetch_problem,
    save_problem,
    delete_problem,
    course_problems,
    fetch_problem,
    execute_code
} from './CodingProblems';

// export helpers from Quizlet
export {

} from './Quizlet';