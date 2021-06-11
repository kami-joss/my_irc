import React from 'react'
// import { io } from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3000";

export default function Message ({user, message, date, index}) {
    return (
        user === 'Rob' ? 
        <li className="d-flex justify-content-between list-group-item list-group-item-info" key={index}> 
            <h2 className="mr-3 border"> Rob </h2>
            <div className="border mr-auto">
                <p> {date} </p>
                <p className="border mr-auto"> {message} </p>
            </div>
        </li> :
        <li className="message list-group-item d-flex justify-content-between" key={index}> 
            <h2 className="mr-3 border"> {user} </h2>
            <div className="border mr-auto">
                <p> {date} </p>
                <p className="border mr-auto"> {message} </p>
            </div>
        </li> 
    )
}