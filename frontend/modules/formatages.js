import React from "react";

function replaceLinesBreacksWithBr(text) {
    return text.split('\n').map((line, index) => ( //react.Fragment is used to avoid adding extra nodes to the DOM
    <React.Fragment key={index}>   
        {line}
      <br />
      </React.Fragment>
    ))
}

function replaceMsWithMinutesAndSeconds(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0); // Convert milliseconds to seconds and round to nearest integer
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
module.exports = { replaceLinesBreacksWithBr, replaceMsWithMinutesAndSeconds };