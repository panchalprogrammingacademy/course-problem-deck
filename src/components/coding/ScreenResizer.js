import React from 'react';
export default function ScreenResizer(props) {
    let x = 0;
    let leftWidth = 0;
    // listeners for document
    const mouseMoveHandler = function(e) {
        const resizer = document.getElementById('resizer');
        const leftSide = document.getElementById('left');
        const rightSide = document.getElementById('right');
        if (!resizer)   return;
        if (!leftSide)  return;
        if (!rightSide) return;
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const newLeftWidth = (leftWidth + dx) * 100 / resizer.parentNode.getBoundingClientRect().width;
        leftSide.style.width = `${newLeftWidth}%`;
        resizer.style.cursor = 'col-resize';
        document.body.style.cursor = 'col-resize';
        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';
        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';
    };
    const mouseUpHandler = function() {
        const resizer = document.getElementById('resizer');
        const leftSide = document.getElementById('left');
        const rightSide = document.getElementById('right');
        if (!resizer)   return;
        if (!leftSide)  return;
        if (!rightSide) return;
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');
        rightSide.style.removeProperty('user-select');
        rightSide.style.removeProperty('pointer-events');
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function(e) {
        const leftSide = document.getElementById('left');
        if (!leftSide)  return;
        // Get the current mouse position
        x = e.clientX;
        leftWidth = leftSide.getBoundingClientRect().width;
        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    // return the component
    return (
        <div className="resizer" id="resizer" 
            onMouseDown={mouseDownHandler}>
        </div>);
};