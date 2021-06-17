import React from 'react'
import { useParams } from 'react-router-dom'
// import { io } from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:3000";

export default function Message ({user, message, date, index}) {

    let username = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    console.log(username)
    switch (user) {
        case 'Rob' :
            return (
                <li className="alert alert-info d-flex justify-content-between p-2" key={index}> 
                <h2 className="mr-3"> {user} </h2>
                <div className="mr-auto">
                    <p> {date} </p>
                    <p className="mr-auto"> {message} </p>
                </div>
                </li> 
            )
        break
        case username :
            return (
                <li className="alert alert-primary d-flex justify-content-between p-2" key={index}> 
                    <div class="d-flex justify-content-center">
                        <h2 className="mr-3"> 
                            {user} 
                        </h2>
                    </div>
                    <div className="mr-auto text-break">
                        <p class="border">
                            {date}
                        </p>
                        <p className="mr-auto my-auto"> 
                            {message} 
                        </p>
                    </div>
                </li> 
            )
        break
        default : 
            return (
                <li className="alert alert-dark d-flex justify-content-between p-2" key={index}> 
                    <h2 className="mr-3"> {user} </h2>
                    <div className="mr-auto">
                        <p> {date} </p>
                        <p className="mr-auto"> {message} </p>
                    </div>
                </li> 
            )
    }
}