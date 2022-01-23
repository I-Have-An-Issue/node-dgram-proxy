const crypto = require("crypto")
const dgram = require("dgram")
const clients = []

for (let i = 0; i < 4; i++) {
    let client = dgram.createSocket("udp4")
    clients.push(client)
    client.bind(0, () => {
        setInterval(() => {
            client.send(`[${i}] yo`, 8888, "127.0.0.1")
        }, Math.floor(crypto.randomInt(29000)))
    })
}