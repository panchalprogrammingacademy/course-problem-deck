import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.baseURL = 'https://course-problem-deck-server.herokuapp.com';
// reads all the problems for the given courseId
export const course_problems = (courseId) => {
    return new Promise(function(resolve, reject){
        axios.get('/course/' + courseId)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};