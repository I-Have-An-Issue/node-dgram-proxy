const { EventEmitter } = require("events")
const dgram = require("dgram")
const child_process = require("child_process")

class Proxy extends EventEmitter {
    constructor() {
        super()
        this._dgram = dgram.createSocket()
        this._workers = new Map()
    }

    listen(port, destination, allow = () => {true}) {
        // Argument checking
        if (!(port && destination)) return new Error("Missing arguments")
        if (typeof port !== "number" || typeof destination !== "string") return new Error(`"port" should be typeof "number", and "destination" should be typeof "string"`)
        if (typeof allow !== "function") return new Error(`"allow" should be typeof "function"`)

        this._dgram.on("message", (msg, rinfo) => {
            // Deny connections from IPv6 addresses
            if (rinfo.family !== "IPv4") return
            if (!allow(rinfo)) return console.log(`[Manager] ${rinfo.address}:${rinfo.port} was blocked manually.`)

            let worker = this._workers.get(`${rinfo.address}:${rinfo.port}`) || null
            if (!worker) {
                // Spawn a new worker 
                worker = child_process.fork(`${__dirname}/worker.js`, [rinfo.address, rinfo.port, destination, port])

                // Handle IPC messages from the worker
                worker.on("message", (message) => {
                    switch (message.content) {
                        case "BOUND": 
                            console.log(`[Manager] ${rinfo.address}:${rinfo.port} has successfully bound to ${message.data}`)
                            break;
                        case "DATA": 
                            console.log(`[${rinfo.address}:${rinfo.port} -> Manager] [Data]`)
                            this._dgram.send(message.data, message.port, message.address)
                            break;
                        case "ERR": 
                            console.log(`[${rinfo.address}:${rinfo.port}] Error: ${message.error}`)
                            console.log(`[Manager] ${rinfo.address}:${rinfo.port} encountered an error. Terminate.`)
                            worker.kill()
                            this._workers.delete(`${rinfo.address}:${rinfo.port}`)
                            break;
                        default: 
                            break;
                    }
                })

                this._workers.set(`${rinfo.address}:${rinfo.port}`, worker)
                console.log(`[Manager] Spawned a new worker: [${rinfo.address}:${rinfo.port}]`)
            } else {
                // Send data directly to worker
                console.log(`[${rinfo.address}:${rinfo.port} <- Manager] [Data]`)
                worker.send({ content: "DATA", data: msg })
            }
        })

        return this._dgram.bind(port)
    }
}

module.exports = Proxy