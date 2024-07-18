
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const backendUrl = 'http://localhost:8000';

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${backendUrl}/get`);
            setItems(response.data);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${backendUrl}/delete/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('There was an error deleting the item!', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newItem = { title, body };
            let response;
            if (isEditing) {
                response = await axios.put(`${backendUrl}/update/${editItem.id}`, newItem);
                setItems(items.map(item => item.id === editItem.id ? response.data : item));
            } else {
                response = await axios.post(`${backendUrl}/add`, newItem);
                setItems([...items, response.data]);
            }
            setTitle('');
            setBody('');
            setEditItem(null);
            setIsEditing(false);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    const editItemHandler = (item) => {
        setTitle(item.title);
        setBody(item.body);
        setEditItem(item);
        setIsEditing(true);
    };

    return (
        <div className="App">
            <div className="container">
                {/* Items List */}
                <div className="list-container">
                    <h1>Data List</h1>
                    <ul>
                        {items.map(item => (
                            <li key={item.id}>
                                <h2>{item.title}</h2>
                                <p>{item.body}</p>
                                <button style={{ backgroundColor: 'red', color: 'white', padding: '10px', marginRight: '5px' }} onClick={() => deleteItem(item.id)}>Delete</button>
                                <button style={{ backgroundColor: 'blue', color: 'white', padding: '10px' }} onClick={() => editItemHandler(item)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Add/Edit Item Form */}
                <div className="form-container">
                    <h2>{isEditing ? 'Edit Data' : 'Add Data'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">{isEditing ? 'Update Data' : 'Add Data'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;