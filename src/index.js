const { EventEmitter } = require("events")
const dgram = require("dgram")
const child_process = require("child_process")

class Proxy extends EventEmitter {
    constructor() {
        super()
        this._dgram = dgram.createSocket("udp4")
        this._workers = new Map()
    }

    workers() {
        return this._workers.size
    }

    listen(daddress, dport, port, allow = () => {true}) {
        if (!(port && daddress && dport)) return new Error("Missing arguments")
        if (typeof dport !== "number" || typeof port !== "number" || typeof daddress !== "string") return new Error("Incorrect argument types")
        if (typeof allow !== "function") return new Error(`"allow" should be typeof "function"`)

        this._dgram.on("message", (msg, rinfo) => {
            if (!allow(rinfo)) return this.emit("blocked", rinfo)

            let worker = this._workers.get(`${rinfo.address}:${rinfo.port}`) || null
            if (!worker) {
                worker = child_process.fork(`${__dirname}/worker.js`, [rinfo.address, rinfo.port, daddress, dport])

                worker.on("message", (message) => {
                    switch (message.content) {
                        case "BOUND": 
                            this.emit("worker_bind", rinfo, message.data)
                            break;
                        case "DATA": 
                            this.emit("data_out", rinfo, Buffer.from(message.data))
                            this._dgram.send(Buffer.from(message.data), message.port, message.address)
                            break;
                        case "CLOSE": 
                            this.emit("worker_idle", rinfo)
                            worker.kill()
                            this._workers.delete(`${rinfo.address}:${rinfo.port}`)
                            break;
                        default: 
                            break;
                    }
                })

                this._workers.set(`${rinfo.address}:${rinfo.port}`, worker)
                this.emit("worker_spawn", rinfo)
            }

            this.emit("data_in", rinfo, msg)
            worker.send({ content: "DATA", data: msg })
        })

        return this._dgram.bind(port)
    }
}

module.exports = Proxy