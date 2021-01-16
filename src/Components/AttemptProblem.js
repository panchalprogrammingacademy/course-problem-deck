import React, { useState, useEffect } from 'react';
import '../Styles/AttemptProblem.scss';
import Loader0 from './Loader0';
import PageNotFound from './PageNotFound';
import ScreenResizer from './ScreenResizer';
import {fetch_problem} from '../DataAccessObject/DataAccessObject';
import { useToasts } from 'react-toast-notifications';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AttemptProblem(props){
    let problemId = props.match.params.problemId;
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(null);
    const [problem, setProblem] = useState(null);
    const { addToast } = useToasts();


    // fetches the problem from server!
    useEffect(function(){
        fetch_problem(problemId).then(response => {
            let {data} = response;
            if (data.error) {
                addToast(data.error, {
                    appearance: 'error',
                });    
            } else if (!data.problem){
                setNotFound(<PageNotFound />);
            } else {
                setProblem(data.problem);
                console.log(data.problem);
            }
        }).catch(err => {
            addToast(err.toString(), {
                appearance: 'error',
            });
        }).finally(()=>{
            setIsLoading(false);
        });

    }, [problemId, addToast]);


    if (isLoading) return <Loader0 />
    if (notFound)   return notFound;
    if (!problem)   return <div>Failed to find that problem!</div>
    document.title = problem.title + " | Course Problem Deck";
    return (
        <div id="attempt-problem">
            <div className="left" id="left">
                <div className="problem-header">
                    {problem.title}
                </div>
                <div className="problem-score">
                    {problem.testCases.reduce((total, item) => total + item.points, 0)} points
                </div>
                <ReactQuill defaultValue={problem.problemStatement} readOnly
                    className="problem"/>
                <div className="tags">
                    <div className="tags-header">
                        Problem tags:
                    </div>
                    {function(){
                        return problem.tags.map(tag => {
                            return (
                                <div key={tag} className="tag">{tag}</div>
                            );
                        });
                    }()}
                </div>
            </div>
            <ScreenResizer />
            <div className="right" id="right">
                right item
            </div>
        </div>
    );
};