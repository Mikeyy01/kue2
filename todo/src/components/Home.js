import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css';
import requestIcon from '../assets/images/reqSong-01-01.png';
import queueIcon from '../assets/images/queueList-01.png';
import KueLogo from '../assets/images/logo.png'
import XLogo from '../assets/images/X.svg'
import ClubLogo from '../assets/images/Club.svg'

//welcome lines array
const welcomeLines = [
    "Hello, good-looking!",
    "You look fire tonight!",
    "Dang, who is that hottie?",
    "Wow, how do you look this good?",
    "Don't look at me, I'm blushing.",
    "If you were a vegetable, you’d be a ‘cute-cumber."
];

//home page functions
function Home(props) {
    const navigate = useNavigate();
    // Home Page redirect 
    const directToHome = () => {
        navigate('/');
    }
    //Search Page redirect
    const directToSearch = () => {
        navigate('/input-text');
    }
    //Queue page redirect
    const directToQueue = () => {
        navigate('/queue');
    }

    // random line on refresh
    const randomText = welcomeLines[Math.floor(Math.random() * welcomeLines.length)];

    return (

        <div className="homeContainer">
            <section className="home">
                <div className="container">
                    <header>
                        <a onClick={directToHome}>
                            <img className="logo" src={KueLogo} height="" alt="Logo"/>
                        </a>
                        <div className="ClubLine">
                            <img className="X" src={XLogo}  alt="X"/>
                            <img className="Club" src={ClubLogo} alt="Club"/>
                        </div>
                    </header>

                    <div className='homePage'>
                        <h1>{randomText}</h1>
                        <h3>Tell DJ Antonio what you want him to put in queue for 10 euros!</h3>

                        <main>
                            <div className="search-button">
                                <button type="submit" onClick={directToSearch}>
                                    <img src={requestIcon} className="requestImg" width="50%" height="50%" alt="Search icon" />
                                    Request
                                </button>
                                <button className="list-btn" type="submit" onClick={directToQueue}>
                                    <img src={queueIcon} width="50%" height="50%" alt="Queue icon" />
                                    Queue
                                </button>
                            </div>
                        </main>
                    </div>

                    <footer></footer>
                </div>
            </section>
        </div>
    );

}
export default Home;