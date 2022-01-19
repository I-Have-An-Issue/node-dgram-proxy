// Handles communication between the connecting client and the destination
const dgram = require("dgram")
const socket = dgram.createSocket()

const raddress = process.argv[2]
const rport = process.argv[3]
const destination = process.argv[4]
const port = process.argv[5]

process.on("message", (message) => {
    switch (message.content) {
        case "DATA": 
            socket.send(message.data, destination, port)
            break;
        default:
            break;
    }
})

socket.on("message", (msg, rinfo) => {
    process.send({ content: "DATA", data: msg, address: raddress, port: rport })
})

socket.bind(0, () => process.send({ content: "BOUND", data: socket.address().port }))