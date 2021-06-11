import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import Message from './Message';
import User from './User';
import Room from './Room';
import { io } from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3000";
const socket = io(ENDPOINT);

export default function Channel () {

    let { channel, username } = useParams();

    let [users, setUsers] = useState([]);
    let [messages, setMessages] = useState([]);
    let [channels, setChannels] = useState([]);

    useEffect(() => {
        const socket = io(ENDPOINT);
        socket.emit('joinChannel', {channel, username})

        socket.on('joinChannel', (data) => {
            setMessages((messages) => [...messages, data.message])
            setUsers(data.users)
            setChannels(data.channels)
        })
        socket.on('newMessage', data => {
            let tchat = document.querySelector('#tchat')
            setMessages((messages) => [...messages, data])
            tchat.scrollTop = tchat.scrollHeight;
            document.querySelector('#input').value = ''
        })
        socket.on('disconnected', (data) => {
            setMessages((messages) => [...messages, data.message])
            setUsers(data.users)
            setChannels(data.channels)
        })
        socket.on('usernameChanged', data => {    
            setUsers(data.users)
            let url = window.location.href
            url = url.split("/")
            url.pop()
            url.push(data.newUsername)
            url = url.join("/")
            username = data.newUsername
            console.log(username)
            window.history.replaceState(null, null, url)
        })
      }, []);

    function handleSubmit (e) {
        e.preventDefault();

        socket.emit('newMessage', { 
            username: username, 
            channel: channel,
            message: document.querySelector('#input').value
        })
    }

    function changeUsername (e) {
        e.preventDefault()
        socket.emit('changeUsername', {
            oldUsername: username,
            newUsername: document.querySelector('#setUsername').value
        })
    }

    return (
        <>
            <div className = "test d-flex" style={{minHeight: '100vh'}}> 
                <div className="col-2 d-flex flex-column" style={{backgroundColor: 'rgb(45,45,45)'}}> 
                    {channels.map((channel, index) => (
                        <Room users={users} name={channel.name} connected={channel.connected} key={index}/>
                    ))}
                    <form onSubmit={(e) => (changeUsername(e))}> 
                        <input type="text" id="setUsername"/>
                        <button className="btn btn-outline-secondary my-auto">Set my name</button>
                    </form>
                </div>

                <div className="col"> 
                    <ul id = "tchat" className="list-group" style={{maxHeight: '90vh', height: '90vh', overflowY: 'scroll'}}>
                        {messages.map((message, index) => (
                            <Message user={message.author} message={message.content} date={message.date} key={index}/>
                        ))}
                    </ul>
                    <form id="form" className="my-2" onSubmit= {(e) => handleSubmit(e)}>
                        <div className="input-group mb-3">
                            <input id="input" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary">Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}