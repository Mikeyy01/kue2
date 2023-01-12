import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../assets/css/payment.css';
import { useLocation } from 'react-router-dom';
import abn from '../assets/images/abn_amro.png';
import ing from '../assets/images/ing.png';
import rabo from '../assets/images/rabobank.png';
import revolut from '../assets/images/revolut.svg';
import kuelogo from '../assets/images/logo.png';
import arrow1 from '../assets/images/arrow.png';
import { useNavigate } from 'react-router-dom';

const { REACT_APP_BACKEND_URL } = process.env;


//confirmation page functions
function Confirm() {
    const [todos, setTodos] = useState([]);  // state for the tod0 l1st
    const [newTodo, setNewTodo] = useState({ artist: '', track: '', coverArtURL: '' }); // state for the new tod0 object
    // state for the selected bank option
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectListVisible, setSelectListVisible] = useState(false);
    // state for whether the submit button is visible or not
    const [submitVisible, setSubmitVisible] = useState(false);
    const navigate = useNavigate();

    //URL query retrieving and decoding
    const location = useLocation();
    const artist = decodeURIComponent(location.search.split('artist=')[1].split('&')[0]);
    const track = decodeURIComponent(location.search.split('track=')[1].split('&')[0]);
    const coverArtURL = decodeURIComponent(location.search.split('coverArtURL=')[1].split('&')[0]);


    //current timestamp and formatting of the date and time
    const timestamp = new Date().toISOString();
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    useEffect(() => {
        // update image id with the coverartURL
        document.getElementById("searchedTrackImg").src = coverArtURL;
        //set the track values for newTodo
        setNewTodo({ artist: artist, track: track, coverArtURL: coverArtURL });
    }, []);

//retrieve song requests from json server backend
    const getTodos = () =>
        axios(`${REACT_APP_BACKEND_URL}/todos`)
            .then((resp) => setTodos(resp.data));

    useEffect(() => {
        getTodos();
    }, []);

    //submitting and formatting the data of a new song request
    const handleNewTodo = (event) => {
        event.preventDefault();
        //if artist, track, or coverArtURL is not set
        if (!newTodo.artist || !newTodo.track || !newTodo.coverArtURL) {
            return;
        }
        const data = {
            id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
            todo: newTodo,
            completed: false,
            status: 'requested',
            timestamp: formattedDate
        };
        //POST new song request
        axios
            .post(`${REACT_APP_BACKEND_URL}/todos`, data)
            .then((resp) => {
                setTodos([...todos, resp.data]); // update the tod,o list with the new task
                navigate('/pending');
            });
        setNewTodo(""); // reset the song request object
    };

// bank drop down menu
    const options = [
        { value: 'bank', label: 'ABN Amro', img: abn },
        { value: 'bank', label: 'ING', img: ing },
        { value: 'bank', label: 'Rabobank', img: rabo },
        { value: 'bank', label: 'Revolut', img: revolut },
    ];

    //
    const toggleSelectList = () => {
        setSelectListVisible(!selectListVisible);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setSelectListVisible(false);
        // show the submit button
        setSubmitVisible(true);
    };

    //display info from URL query
    const TrackConfirm = ({ artist, track }) => {
        return (
            <ul className="info">
                <li className="name">{track}</li>
                <li className="artist">{artist}</li>
            </ul>
        );
    };

    const returnHome = () => {
        navigate("/");
    }

    return (
        <div className='paymentContainer'>
            <section className="payment">
                <div className="container">
                    <header>
                        <a onClick={returnHome} href="/">
                            <img src={kuelogo} alt="logo" />
                        </a>
                    </header>
                    
                    <div className="confirmation">
                        <p className="confirm">Confirm Request</p>
                        
                        <div className="track-row">
                            <img id="searchedTrackImg" />
                            <div className="track-info">
                                <TrackConfirm track={track} artist={artist}/>
                            </div>
                        </div>
                        <h2 className='confirm__price'>€ 10,00</h2>
                        
                        <form onSubmit={handleNewTodo}>
                            <div className="dropdown">
                                <div className="dropdownField" onClick={toggleSelectList}>
                                    <div className='dropField'>
                                        {selectedOption && (
                                            <img src={selectedOption.img} alt={selectedOption.label} className="selected_icon" />)}
                                        
                                        <p id="selectText" className={`${selectedOption ? 'selected' : ''} choose-bank-text`}>
                                            {selectedOption ? selectedOption.label : 'Choose your bank'}
                                        </p>
                                        <img src={arrow1} id="arrow" className={`${selectListVisible ? '' : 'rotate'}`}/>
                                    </div>
                                </div>

                                <ul
                                    id="select"
                                    className={`${selectListVisible ? '' : 'hide'}`}
                                    onChange={(event) => {
                                        setSelectedOption(event.target.value);
                                        setSelectListVisible(false);
                                    }}
                                >
                                    {options.map((option) => (
                                        <li
                                            key={option.label}
                                            className="options"
                                            value={option}
                                            onClick={() => handleOptionClick(option)}
                                        >
                                            <img src={option.img} alt={option.label} />
                                            <p>{option.label}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <input
                                type="submit"
                                onSubmit={handleNewTodo}
                                value="Confirm and Pay"
                                id="submit"
                                style={{ display: submitVisible ? 'block' : 'none' }}
                            />
                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
}
export default Confirm;