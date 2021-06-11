import React from 'react'
import User from './User'
// import { io } from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3000";

export default function Message ({users, name, connected}) {
    return (
    <>
        <h2 className="text-center text-white my-4 font-weight-bold"> {name} </h2>
        <ul className = "list-group"> 
            {users.map((user, index) => (
                user.channel === name ? 
                <User username={user.username} key={index}/> :
                null
            ))}
        </ul>
    </>
    )
}