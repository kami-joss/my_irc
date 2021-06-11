import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";

export default function User ({username}) {
    return (
        <li className = "list-group-item list-group-item-dark"> {username} </li>
    )
}