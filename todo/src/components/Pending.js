import React from 'react';
import '../assets/css/loadingstyle.css';
import logo3 from '../assets/images/logo.svg';
import tick from '../assets/images/tick.png';

function Pending() {
    return (
        <body>
        <article>
            <img className="logo" src={logo3} alt="logo" />
        </article>
        <div className="line" />

        <h1>Request Sent!</h1>
        <br />
        <img className="tick" src={tick} width="15%" height="auto"  alt={tick}/>
        <br />
        </body>
    );
}
export default Pending;