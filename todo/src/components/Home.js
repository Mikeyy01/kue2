import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css';
import searchIcon from '../assets/images/Search.svg';
import queueIcon from '../assets/images/Queue.svg';
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
        <div className="blob">
            <section className="section1">
                <div className="wrapper">
                    <label className="logo">
                        <a href="">
                            <img className="logo" src={KueLogo} height="" alt="Logo"/>
                        </a>
                    </label>
                </div>
                <div className="ClubLine">
                    <img className="X" src={XLogo} width="2%" height="auto" alt="X"/>
                    <img className="Club" src={ClubLogo} width="2%" height="auto" alt="Club"/>
                </div>
            </section>


            <section className="homepage-buttons">
                <div className="outline">
                    <div className="line1"></div>
                    <div className="line2"></div>
                </div>
                <div className="text1">
                    <h1>{randomText}</h1>
                </div>
                <div className="text2">
                    <h3>
                        Tell DJ Antonio what you want him to put in queue for 10 euros!
                    </h3>
                </div>
                <main>
                    <div className="search-button" style={{ width: '100%', margin: '0 auto', textAlign: 'center' }}>
                        <button type="submit" onClick={directToSearch}>
                            <img src={searchIcon} width="50%" height="50%" alt="Search icon" />
                            Search
                        </button>
                        <button className="list-btn" type="submit" onClick={directToQueue}>
                            <img src={queueIcon} width="50%" height="50%" alt="Queue icon" />
                            Queue
                        </button>
                    </div>
                </main>
            </section>
            <footer></footer>
        </div>
    );

}
export default Home;