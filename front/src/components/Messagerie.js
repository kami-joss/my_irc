import React, {useEffect, useState, useParams} from 'react'
import Message from './Message'
import { io } from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3000";

export default function Messagerie () {
    const { channel, username } = useParams();

    useEffect(() => {
        console.log('channel ' +  channel)
        const socket = io(ENDPOINT);
        socket.emit('joinChannel', {channel, username})
      }, []);



}