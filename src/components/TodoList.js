import '../assets/css/list.css';
import '../assets/css/clientlist.css';
import {useState, useEffect} from "react";
import axios from "axios";
import acceptBtn from '../assets/images/accept.png'
import declineBtn from '../assets/images/decline.png'
import kuelogo from '../assets/images/logo.png'
const { REACT_APP_BACKEND_URL } = process.env

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [editableTodo, setEditableTodo] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');

const getTodos = () =>
    axios(`${REACT_APP_BACKEND_URL}/todos`)
        .then((resp) => setTodos(resp.data));

// OLD FETCH METHOD
    // fetch(`${REACT_APP_BACKEND_URL}/todos`)
    //     //convert data to json
    //     .then((data) => data.json())
    //     //place data into Todos
    //     .then((data) => setTodos(data));

    useEffect(() => {
        const interval = setInterval(() => {
            getTodos();
        }, 1000); // 1000 milliseconds = 1 second

        return () => clearInterval(interval);
    }, []);
    //setting an empty bracket, so that code does not rerender infinitely.

const handleDelete = (todo)=>{
    axios.delete(`${REACT_APP_BACKEND_URL}/todos/${todo.id}`)
        .then((resp) => {
            //newTodos will filter the t0d0 tasks removing deleted id, and rerendering the list
           const newTodos = todos.filter(el => el.id !== todo.id)
            setTodos(newTodos);
        })
    .catch(err => console.log(err));
};


const toggleComplete = todo => {
    axios.put(`${REACT_APP_BACKEND_URL}/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed,
        status: 'Approved'
    })
        .then((resp) =>{
            const newTodos = todos.map((el) => {
                if (el.id !== todo.id){
                    return el;
                }
                else {
                    return resp.data;
                }
            });
            setTodos(newTodos);
        });
};


    const handleEditTodo = (event) => {
        event.preventDefault();
        if (!editableTodo.todo.track) {
            return;
        }
        const data = {
            id: editableTodo.id,
            todo: {
                artist: editableTodo.todo.artist,
                track: editableTodo.todo.track,
                coverArtURL: editableTodo.todo.coverArtURL,
            },
            completed: editableTodo.completed,
        };
        axios
            .put(`${REACT_APP_BACKEND_URL}/todos/${editableTodo.id}`, data)
            .then((resp) => {
                const updatedTodos = todos.map((todo) =>
                    todo.id === editableTodo.id ? resp.data : todo
                );
                setTodos(updatedTodos);
                setEditableTodo(null);
            });
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    }


    return (
        <div className='paymentContainer'>
            <section className="paymentt">
                <div className="container">
                    <header>
                        <a href="/list">
                            <img src={kuelogo} alt="logo" />
                        </a>
                    </header>
                    
                    <div className='confirmation'>
                        <p className="queueTitle">Requests Management</p>

                        <div className='selectFilter'>
                            <h3>Filter:</h3>
                            <select className='drpDwn' value={selectedStatus} onChange={handleStatusChange}>
                                <option  value="" selected >All</option>
                                <option value="requested" >Requested</option>
                                <option value="Approved" >Accepted</option>
                            </select>
                        </div>

                        <div class="songDisplay">
                            {todos.filter(todo => {
                                if (selectedStatus === 'requested') {
                                    return todo.status === 'requested';
                                } else if (selectedStatus === 'Approved') {
                                    return todo.status === 'Approved';
                                } else {
                                    return true;
                                }
                            }).map((todo) =>
                                <div className='tracks'>
                                    <div key={todo.id} style={{ background: todo.completed ? "rgb(56 56 56)" : "" }}>
                                        <div className="trackRow">
                                            <img className="albumCover" src={todo.todo.coverArtURL} alt="cover art" style={{width: "45px",
                                            height: "45px"}} />
                                            
                                            <div className="trackInfo">
                                                <ul className="info">
                                                    <li className="title" id="trackName">{todo.todo.track}</li>
                                                    <li className="artist">{todo.todo.artist}</li>
                                                </ul>
                                            </div>

                                            <div className="track-time">
                                                <p className="time">{todo.timestamp}</p>
                                            </div>
                                            <div className='btnRequests'>
                                                <button onClick={() => toggleComplete(todo)} className="accept-button"> <img className= "aBtn" src={acceptBtn}  mix-blend-mode ="multiply" width ="25%" height="25%" alt={""} /></button>
                                                <button onClick={() => handleDelete(todo)} className="delete-button" style={{ background: todo.completed ? "rgb(56, 56, 56)" : "#b94142" }}><img className= "dBtn" src={declineBtn} alt={""} width ="25%" height="25%" /></button>
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


export default TodoList;

