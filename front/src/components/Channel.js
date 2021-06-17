import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import Message from './Message';
import User from './User';
import Room from './Room';
import { io } from "socket.io-client";
require('../styles/style.css');
const ENDPOINT = "http://127.0.0.1:3000";
const socket = io(ENDPOINT)


export default function Channel () {

    let {channel} = useParams();
    let [username, setUsername] = useState(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
    let [users, setUsers] = useState([]);
    let [messages, setMessages] = useState([]);
    let [channels, setChannels] = useState([]);
    let [warning, setWarning] = useState();

    useEffect(() => {
        socket.emit('joinChannel', {username, channel})

        socket.on('setChannels', (data) => {
            setUsers(data.users)
            setChannels(data.channels)
        })
        socket.on('disconnected', (data) => {
            setUsers(data.users)
            setChannels(data.channels)
        })
      }, [ENDPOINT]);

      useEffect(() => {
        socket.on('newMessage', data => {
            console.log("message recu")
            let tchat = document.querySelector('#tchat')
            setMessages((messages) => [...messages, data])
            tchat.scrollTop = tchat.scrollHeight;
            document.querySelector('#input').value = ''
        })
        socket.on('usernameChanged', data => {    
            setUsers(data.users)
        })
        socket.on('channelClosed', ({channels}) => {
            setChannels(channels)
        })
        socket.on('changeURL', data => {
            console.log('ok')
            let url = window.location.href
            url = url.split("/")
            url.pop()
            url.push(data.newUsername)
            url = url.join("/")
            console.log(url)
            setUsername(data.newUsername)
            window.history.replaceState(null, null, url)
        })
      }, [])

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
        if (document.querySelector('#setUsername').value != '') {
            setWarning('')
            socket.emit('changeUsername', {
                oldUsername: username,
                newUsername: document.querySelector('#setUsername').value
            })
            document.querySelector('#setUsername').value = ''
        } else {
            setWarning('Your name is not valid.');
        }


    }

    return (
        <>
            <div className = "d-flex" style={{minHeight: '100vh'}}> 
                <div className="col-2 d-flex flex-column" style={{backgroundColor: 'rgb(45,45,45)'}}> 
                    {channels.map((channel, index) => (
                        <Room users={users} username={username} name={channel.name} userChannel={channel} connected={channel.connected} key={index}/>
                    ))}
                    <form className="d-flex flex-column justify-content-center" onSubmit={(e) => (changeUsername(e))}> 
                        <input type="text" class="form-control" id="setUsername" placeholder="New Name"/>
                        {warning ? <p className='test'> {warning} </p> : null}
                        <button className="btn btn-outline-success my-2">Set my name</button>
                    </form>
                </div>

                <div className="col-10"> 
                    <ul id = "tchat" className="list-group" style={{maxHeight: '90vh', height: '90vh', overflowY: 'scroll'}}>
                        {messages.map((message, index) => (
                            <Message user={message.author} message={message.content} date={message.date} key={index}/>
                        ))}
                    </ul>
                    <form id="form" className="my-2" onSubmit= {(e) => handleSubmit(e)}>
                        <div className="input-group mb-3">
                            <input id="input" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
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
