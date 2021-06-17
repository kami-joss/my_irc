let users = []
let channels = []

function setUsers (socket, username, channel) {
    const user = {
        id : socket.id,
        username: username,
        channel: channel
    }
    users.push(user)
    return users
}

function getUser (id) {
    return users.find(user => user.id === id)
}

function setChannels (channelName) {
    const channel = getChannel(channelName)
    console.log(channel)
    if (channel == undefined) {
        channels.push({
            name: channelName,
            connected: 1
        })
    } else {
        channel.connected += 1
    }
    return channels
}

function getChannel (channelName) {
    const channel = channels.find(element => element.name === channelName)
    return channel
}

function getChannelIndex (value) {
    return channels.findIndex(channel => channel.name === value)
}

function getUserIndex (value) {
    return users.findIndex(user => user.id == value)
}

module.exports = {
    setUsers,
    getUser,
    setChannels,
    getChannel,
    getChannelIndex,
    getUserIndex
}