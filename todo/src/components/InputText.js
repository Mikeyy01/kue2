import '../assets/css/search.css';
import React from 'react';
import {useState, useEffect} from "react";
import fetch from 'isomorphic-fetch';
import axios from "axios";
import deleteIcon from '../assets/images/delete-icon.png';
import searchIcon from '../assets/images/search-icon.png';
import kue2 from '../assets/images/logo2.png';
import { useNavigate } from 'react-router-dom';

const { REACT_APP_BACKEND_URL } = process.env;

//spotify search bar functions
const InputText = () => {
    const [setTodos] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();


//spotify api keys
    const spotifyAccess = (function() {
        const clientID = 'accae6b6c5604b8b9793c93ce82dcb73';
        const clientSecret = 'c131cb4ca8954077bfd42c7b87b0b8d4';

        const getToken = async () => {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Authorization' : 'Basic ' + btoa(clientID + ':' + clientSecret)
                },
                body: 'grant_type=client_credentials'
            });

            const data = await response.json();
            return data.access_token;
        }
        const search = async (query) => {
            const token = await getToken();
            const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&access_token=${token}`);
            const data = await result.json();
            return data.tracks.items;
        }

        return {
            search
        }
    })();

    //search song based on user input
    const spotifySearch = (e) => {
        const query = e.target.value;
        spotifyAccess.search(query).then(setTracks);
    }

    //convert milliseconds to minutes and seconds -> used to display the duration of the selected track
    const msToMinutesAndSeconds = (ms) => {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    //retrieve song requests from json server backend
    const getTodos = () =>
        axios(`${REACT_APP_BACKEND_URL}/todos`)
            .then((resp) => setTodos(resp.data));


    //calling gettodo functinn
    useEffect(() => {
        getTodos();
    },
        []);
    //setting an empty array, so that code does not rerender infinitely.


    //update the inputValue state variable with the user's input
    const InputChange = (e) => {
        setInputValue(e.target.value);
    }

    //clear the inputValue state
    const ClearInput = () => {
        setInputValue('');
    }

    //calls user's input + spotify url to search for tracks
    const Input = (e) => {
        InputChange(e);
        spotifySearch(e);
    }

    //takes the selected track's information and transfers to a URL query for the confirmation page
    const TrackSelect = (artist, name, coverArtURL) => {
        navigate(`/confirm?artist=${artist}&track=${name}&coverArtURL=${coverArtURL}`);
    }

    //redirect to homepage
    const returnHome = () => {
        navigate("/");
    }


//Prevent EnterKey bug
    const enterKey = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    return (
        <div className='searchContainer'>
            <section className="search">
                <div className="container">
                    <header>
                        <a onClick={returnHome} href="/">
                            <img src={kue2} alt="logo" />
                        </a>
                    </header>

                    <form id="searchForm" autoComplete="off" onSubmit={spotifySearch}>
                        <button id="btnSearch">
                            <img src={searchIcon}  alt="search icon" />
                        </button>
                        <input
                            onKeyDown={enterKey}
                            type="text"
                            name="searchInput"
                            id="input"
                            onChange={Input}
                            value={inputValue}
                            placeholder="What song would you like to request?"
                        />
                        {inputValue ? (
                            <button className='btnDelete'><img src={deleteIcon} alt="Delete icon" className="btnDelete" onClick={ClearInput}/></button>
                        ) : null}
                    </form>

                    <div className="songDisplay">
                        {tracks.map((track) => (
                            <div className="tracks">
                                <div key={track.id} onClick={() => TrackSelect(track.artists[0].name, track.name, track.album.images[2].url)}>
                                    
                                    <div className="track-row">
                                        <img src={track.album.images[2].url} alt="cover art"/>
                                        
                                        <div className="track-info">
                                            <ul className="info">
                                                <li className="title" id="trackName">{track.name}</li>
                                                <li className="artist">{track.artists[0].name}</li>
                                            </ul>
                                        
                                        </div>
                                        
                                        <div className="track-time">
                                            <p className="time">{msToMinutesAndSeconds(track.duration_ms)}</p>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                        ))}
                    </div>
                    <footer></footer>
                </div>
            </section>
        </div>
    );
}
export default InputText;