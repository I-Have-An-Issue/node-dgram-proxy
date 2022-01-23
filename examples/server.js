const dgram = require("dgram")
const server = dgram.createSocket("udp4")

server.on("message", (msg, rinfo) => console.log(`[${rinfo.address}:${rinfo.port}] ${msg.toString()}`))
server.bind(8080)