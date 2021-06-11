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

const path = require('path');
let users = []
let channels = []

app.use(express.static(path.join(__dirname, 'front')));

io.on('connection', socket => {

    socket.on('joinChannel', ({username, channel}) => {       
    
        const user = {
            id : socket.id,
            username,
            channel
        }
        
        users.push(user)

        const channelJoined = channels.find(element => element.name === channel)
        channelJoined == undefined ? 
            channels.push({
                name: channel,
                connected: 1
            }) :
            channelJoined.connected += 1
    
        socket.join(user.channel)

        io
        .emit('joinChannel', { 
            users : users,
            user : user, 
            channels,
            message : {
                author : "Rob",
                content : `${user.username} have join the channel ${user.channel}`,
                date : moment().format('h:mm:a')
            }
        })
    })

    socket.on('newMessage', (data) => {
        socket
        .to(data.channel)
        .emit('newMessage', {
            author: data.username,
            content: data.message,
            date: moment().format('h:mm:a')
        })
    }) 

    socket.on('disconnect', () => {
        const index = users.findIndex(user => user.id === socket.id)
        const user = users.find(user => user.id === socket.id)

        if (user) {
            //Vérifie si le channel quitté est vide et le supprime si il l'est.
            const channelLeft = channels.find(element => element.name === user.channel)
            channelLeft.connected -= 1

            // if (channelLeft.connected <= 0) {
            //     let timeoutID;
            //     const channelLeftIndex = channels.findIndex(element => element.name === user.channel)
            //     timeoutID = window.setTimeout(() => {
            //         channels.splice(channelLeftIndex, 1)[0]
            //     }, 120000)
            // }

            //Retire l'utilisateur du tableau des utilisateurs
            if (index !== -1) {
                users.splice(index, 1)[0]
            }

            io.emit('disconnected', {
                users,
                message: {
                    author: 'Rob',
                    content: `${user.username} have left the channel ${user.channel}. Snif...`,
                    date: moment().format('h:mm:a')
                },
                channels
            })
        }
    })

    socket.on('changeUsername', ({oldUsername, newUsername}) => {
        console.log(socket)
        const index = users.findIndex(element => element.username == oldUsername);
        if (index !== -1) {
            users[index].username = newUsername;
        }
        io.emit('usernameChanged', {users, newUsername})
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000')
}) 