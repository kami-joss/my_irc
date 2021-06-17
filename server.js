const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"]
    }
  });
const moment = require('moment')
const {
    setUsers,
    getUser,
    setChannels,
    getChannel,
    getChannelIndex,
    getUserIndex
} = require('./utils/usersUtils')

const path = require('path');
const botName = "Rob";

let users = []
let channels = []


io.on('connection', socket => {

    socket.on('leaveChannel', ({channelName}) => {
        socket.leave(channelName)
    })

    socket.on('joinChannel', ({username, channel}) => {       
        users = setUsers(socket, username, channel)
        channels = setChannels(channel)

        const user = getUser(socket.id)
        const userChannel = getChannel(channel)
        let msg = ''
        
        socket.join(user.channel)

        io
        .emit('setChannels', {
            users,
            channels
        })

        if (userChannel.connected == 1) {
            msg = `${user.username} have create the channel ${user.channel}`
        } else {
            msg = `${user.username} have join the channel ${user.channel}`
        }

        socket
        .emit('newMessage', {
            author: botName,
            content: `Welcome on ${user.channel} ${user.username} !`,
            date: moment().format('h:mm:a')
        })

        socket
        .broadcast
        .emit('newMessage', {
            author : botName,
            content : msg,
            date : moment().format('h:mm:a')
        })
    })

    socket.on('newMessage', (data) => {
        console.log(data)
        io
        .to(data.channel)
        .emit('newMessage', {
            author: data.username,
            content: data.message,
            date: moment().format('h:mm:a')
        })
    }) 

    socket.on('changeUsername', ({oldUsername, newUsername}) => {
        const index = getUserIndex(socket.id);

        if (index !== -1) {
            users[index].username = newUsername;

            socket.emit('changeURL', {
                newUsername
            })
    
            io.emit('setChannels', {
                users,
                channels 
            })
    
            socket
            .broadcast
            .to(users[index].channel)
            .emit('newMessage', {
                author: botName,
                content: `${oldUsername} have changed his name to ${newUsername}`,
                date: moment().format('h:mm:a')
            })
        }
    })

    socket.on('disconnect', () => {
        const userIndex = users.findIndex(user => user.id === socket.id)
        const user = getUser(socket.id)
    
        if (user) {
            const channelLeft = getChannel(user.channel)
            
            channelLeft != -1 ? channelLeft.connected -= 1 : null
    
            // Supprime le channel si personne ne se connecte dessus au bout de 15s
            const timerObj = setTimeout(() => {
                if (channelLeft.connected <= 0) {
                    const channelIndex = getChannelIndex(user.channel)
                    channels.splice(channelIndex, 1)[0]
    
                    io.emit('channelClosed', {
                        channels
                    })
    
                    io.emit('newMessage', {
                        author: botName,
                        content: `The channel ${channelLeft.name} has been closed due to inactivity.`,
                        date: moment().format('h:mm:a')
                    })
                }
            }, 15000);
            
            //Retire l'utilisateur du tableau des utilisateurs
            if (userIndex !== -1) {
                users.splice(userIndex, 1)[0]
            }
    
            io.emit('disconnected', {
                users,
                channels
            })
    
            io.emit('newMessage', {
                author: botName,
                content: `${user.username} have left the channel ${user.channel}. Snif...`,
                date: moment().format('h:mm:a')
            })
        }
    })
})





server.listen(3000, () => {
    console.log('listening on *:3000')
}) 