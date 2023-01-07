import React from 'react';
import { useNavigate } from 'react-router-dom';
import KueLogo2 from '../assets/images/logo.png'
import XLogo from '../assets/images/X.svg'
import ClubLogo from '../assets/images/Club.svg'
import '../assets/css/list.css';
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

    return <div>
        <div className="blob">
            <div className='containerBody'>
            <div className='todoBody'>
            <section className="section1">
                <div className="wrapper">
                    <label className="logo2">
                        <a onClick={returnHome} href="/">
                            <img className="logo" src={KueLogo2} height="" alt="Logo"/>
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
                <div className="text2">
                    <h1>
                        Current Queue
                    </h1>
                </div>
                <main>
                    {todos
                        .filter(todo => todo.status === "Approved")
                        .map((todo) =>
                            (
                                <div key={todo.id} className="todo" style={{ display: "flex", margin: "20px" , justifyContent : 'center' , alignItems: 'center'}}>
                                    <img className="albumCover" src={todo.todo.coverArtURL} alt="cover art"  />
                                    <p className="songName">
                                        {todo.todo.track}
                                    </p>
                                    <h3 className="artistName">
                                        {todo.todo.artist}
                                    </h3>
                                    <p className="timeStamp">
                                        {todo.timestamp}
                                    </p>

                                </div>
                            ))}
                </main>
            </section>
            <footer></footer>
    </div>
            </div>
        </div>
    </div>
};

export default ClientQueue;