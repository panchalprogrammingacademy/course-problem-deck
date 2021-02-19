// saves user's code to local-storage!
export const saveToLocalStorage = (problemId, title, code, language, solved=false) => {
    // get solution information
    let contentToSave = {title, code,language ,timestamp: new Date(), solved};
    // store the item in local-storage
    localStorage.setItem(problemId, JSON.stringify(contentToSave));        
};

// deletes the user's code from local-storage!
export const deleteFromLocalStorage = (problemId) => {
    // clear the item
    localStorage.removeItem(problemId);
};

// reads the solution from localStorage
export const readFromLocalStorage = (problemId) => {
    // get the item from local-storage
    let oldSolution = localStorage.getItem(problemId);
    // parse and return if exist
    return (oldSolution ? JSON.parse(oldSolution) : null);
};

// checks if a given problem has status of passed
export const isProblemSolved = (problemId) => {
    // read the solution from localStorage
    let solution = readFromLocalStorage(problemId);
    // return status
    return (solution && solution.solved);
}