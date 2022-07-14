let io;


const initIo = (server) => {
    io = require('socket.io')(server, {
        cors: '*'
    })
    return io
}
const getIo = () => {
    if (!io) {
        console.log({ message: 'in-valid io' });
    } else {
        return io;
    }
}

module.exports = {
    initIo, getIo
}