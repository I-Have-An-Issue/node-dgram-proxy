const dgram = require("dgram")
const socket = dgram.createSocket("udp4")

const raddress = process.argv[2]
const rport = process.argv[3]
const destination = process.argv[4]
const port = process.argv[5]
const idle = process.argv[6] || 30
let activity = idle

setInterval(() => {
    if (activity < 0) return
    if (activity == 0) {
        activity = -1
        process.send({ content: "CLOSE" })
    } else activity--
}, 1000)

process.on("message", (message) => {
    if (activity < 0) return
    switch (message.content) {
        case "DATA": 
            activity = idle
            socket.send(Buffer.from(message.data), port, destination)
            break;
        default:
            break;
    }
})

socket.on("message", (msg, rinfo) => {
    if (activity < 0) return
    activity = idle
    process.send({ content: "DATA", data: msg, address: raddress, port: rport })
})

socket.bind(0, () => process.send({ content: "BOUND", data: socket.address().port }))
