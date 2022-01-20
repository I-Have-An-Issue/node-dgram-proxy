const dgram = require("dgram")
const socket = dgram.createSocket("udp4")

const raddress = process.argv[2]
const rport = process.argv[3]
const destination = process.argv[4]
const port = process.argv[5]

let activity = 30
let stop = false

setInterval(() => {
    if (stop) return
    if (activity <= 0) {stop = true; process.send({ content: "CLOSE" })}
    else activity--
}, 1000)

process.on("message", (message) => {
    switch (message.content) {
        case "DATA": 
            activity = 5000
            socket.send(Buffer.from(message.data), port, destination)
            break;
        default:
            break;
    }
})

socket.on("message", (msg, rinfo) => {
    activity = 5000
    process.send({ content: "DATA", data: msg, address: raddress, port: rport })
})

socket.bind(0, () => process.send({ content: "BOUND", data: socket.address().port }))