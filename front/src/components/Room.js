import React, {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import User from './User'
import { io } from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3000";


export default function Room ({users, username, name, connected}) {

    const socket = io(ENDPOINT);
    let {channel} = useParams();

    function handleChange (e) {
        if (name != channel) {
            socket.emit('leaveChannel', channel)
            window.location.href = `/${name}/${username}`
        }
    }

    return (
    <>
        <div className="">
            <button className="btn btn-outline-primary btn-lg w-100 my-2" onClick={(e) => handleChange(e)}> {name} <span style={{fontSize: '14px'}}> ({connected}) </span></button>
            <ul className = "list-group"> 
                {users.map((user, index) => (
                    user.channel === name ? 
                    <User username={user.username} key={index}/> :
                    null
                ))}
            </ul>
        </div>
        <hr></hr>
    </>
    )
}