// imports
import axios from 'axios';

// saves the quiz
export const saveQuizToBackend = (quiz) => {
    let {quizId, title, timeLimit, tags, questionsList} = quiz;
    let payload = {quizId,title,timeLimit, tags, questionsList};
    return new Promise(function(resolve, reject){
        axios.post('/admin/quiz/save', payload)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// deletes the quiz on backend
export const deleteQuizFromBackend = (quizId) => {
    return new Promise(function(resolve, reject){
        axios.post('/admin/quiz/delete', {quizId})
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// reads all the quizzes for the given courseId
export const readAllQuizzesFromBackend = (courseId) => {
    return new Promise(function(resolve, reject){
        axios.get('/course/' + courseId + "/quizzes")
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// reads the quiz with given Id
export const readQuizFromBackend = (quizId) => {
    return new Promise(function(resolve, reject){
        axios.get('/quiz/' + quizId)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};

// reads the quiz after token verification
export const readQuizWithTokenVerification = (quizId) => {
    return new Promise(function(resolve, reject){
        axios.get('/admin/quiz/' + quizId)
            .then(response => resolve(response))
                .catch(err => reject(err));
    });
};