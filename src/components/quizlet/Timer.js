import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassEnd } from '@fortawesome/free-solid-svg-icons';
// formats the time
const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds);
};
export default function Timer(props){
    let {onFinish} = props;
    const [time, setTime] = useState(100);
    useEffect(()=>{
        let timeInterval = window.setInterval(()=>{            
            let timeRemaining = 0;
            setTime(time => {
                timeRemaining = time;
                return time - 1;
            });
            if (timeRemaining <= 0) {
                window.clearInterval(timeInterval);
                onFinish();
            }
        }, 1000);
        return () => window.clearInterval(timeInterval);
    }, [onFinish]);
    let classList = ['button', 'success', 'fs-20'];
    if (time < 60)  classList.push('blink');
    return (
        <span className={classList.join(' ')}>
            <FontAwesomeIcon icon={faHourglassEnd} /> {formatTime(time)}
        </span>
    );
};