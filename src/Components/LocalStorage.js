import React, { useState } from 'react';
import '../Styles/CoursePage.scss';
import AcademyIcon from '../Assets/ppa.png';
import Fotter from './Fotter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from 'react-toast-notifications';

// component to be rendered
export default function LocalStorage(props){
    // fetch the items stored in local-storage
    let items = {};
    for (let key in localStorage)
        if (key.match(/^[0-9a-fA-F]{24}$/)) {
            let string = localStorage.getItem(key);
            let jsonObject = JSON.parse(string);
            items[key] = jsonObject;
        }
    const [solutions, setSolutions] = useState(items);
    const { addToast } = useToasts();

    // deletes the item from local-storage
    const deleteItem = (id) => {
        let items = solutions;
        delete items[id];
        setSolutions(items);
        localStorage.removeItem(id);
        addToast('The solution you requested to delete has now been deleted!', {appearance: 'info'});
    };

    // downloads the given solution
    const downloadItem = (id) => {
        let solution = solutions[id];
        if (!solution) {
            addToast(`Failed to find that solution in your browser's local storage!`, {appearance: 'error'});
            return;
        }
        let filename = "course-problem-deck-solution";
        switch(solution.language){
            case "C":           filename = filename + ".c";     break;
            case "C++":         filename = filename + ".cpp";   break;
            case "Python2":     filename = filename + ".py";    break;
            case "Python3":     filename = filename + ".py";    break;
            default:            filename = filename + ".txt";   break;
        }
        let link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(solution.code));
        link.setAttribute('download', filename);
        let parent = document.getElementById(id);
        parent.appendChild(link);
        link.click();
        parent.removeChild(link);
    };

    // actual component to be rendered
    return (
        <div id="course-page">
            <div className="header">
                <img src={AcademyIcon} alt="academyIcon" />
                <h1>Solutions saved to local storage</h1>
                <span>With your permission the following solutions are stored in your browser's local storage by course-problem-deck!</span>
            </div>
            <div className="problems">
                {function(){
                    let items = [];
                    for (let id in solutions){
                        let solution = solutions[id];
                        items.push((
                            <div className="problem" key={id} id={id}>
                                <span onClick={event => deleteItem(id)}>
                                    <FontAwesomeIcon style={{color: "black", cursor: "pointer"}} icon={faTrashAlt} />
                                </span>
                                <span onClick={event => downloadItem(id)}>
                                    <FontAwesomeIcon style={{color: "black", cursor: "pointer"}} icon={faFileDownload} />
                                </span>
                                <a href="/" className="problem-title"
                                    onClick={event => {
                                        event.preventDefault();
                                        let url = window.location.origin + "/#/problem/" + id;
                                        window.open(url, '_blank');
                                    }}>{solution.title}</a>
                            </div>
                        ));
                    }
                    if (items.length === 0) items.push(<div className="empty-message">Oops, nothing to show here!</div>);
                    return items;
                }()}
            </div>
            <Fotter />
        </div>
    );
};
