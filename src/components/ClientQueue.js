import React from 'react';
import { useNavigate } from 'react-router-dom';
import kuelogo from '../assets/images/logo.png'
import '../assets/css/clientlist.css';
import {useState, useEffect} from "react";
import axios from "axios";
const { REACT_APP_BACKEND_URL } = process.env

//Client Queue List functions
const ClientQueue = () => {
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();


//retrieve song requests from json server backend
    const getTodos = () =>
        axios(`${REACT_APP_BACKEND_URL}/todos`)
            .then((resp) => setTodos(resp.data));

    //retrieve requested songs from json server ever 1 second.
    useEffect(() => {
        const interval = setInterval(() => {
            getTodos();
        }, 1000); // 1000 milliseconds = 1 second

        return () => clearInterval(interval);
    }, []);
    //setting an empty array, so that code does not rerender infinitely.

    //redirect to homepage
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
                    
                    <div className='confirmation'>
                        <p className="queueTitle">Queue List</p>

                        <div class="songDisplay">
                            
                            {todos
                                .filter(todo => todo.status === "Approved")
                                .map((todo) =>
                                <div className='trackss'>
                                    <div key={todo.id}>
                                        <div className="trackRow">
                                            <img className="albumCover" src={todo.todo.coverArtURL} alt="cover art" style={{width: "45px",
                                            height: "45px"}} />
                                            
                                            <div className="trackInfo">
                                                <ul className="info">
                                                    <li className="title" id="trackName">{todo.todo.track}</li>
                                                    <li className="artist">{todo.todo.artist}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClientQueue;