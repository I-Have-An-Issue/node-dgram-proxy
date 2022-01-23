const dgram_proxy = require("../src")
const proxy = new dgram_proxy()
const dgram = require("dgram")

const client = dgram.createSocket("udp4")
const server = dgram.createSocket("udp4")

proxy.on("worker_spawn", (rinfo) => console.log(`[${rinfo.address}:${rinfo.port}] Spawned`))
proxy.on("worker_bind", (rinfo, port) => console.log(`[${rinfo.address}:${rinfo.port}] Bound at port ${port}`))
proxy.on("worker_idle", (rinfo) => console.log(`[${rinfo.address}:${rinfo.port}] Terminated after 30 sec of inactivity`))
proxy.on("blocked_manual", (rinfo) => console.log(`[${rinfo.address}:${rinfo.port}] Blocked manually`))
proxy.on("blocked_max_conn", (rinfo) => console.log(`[${rinfo.address}:${rinfo.port}] Blocked for too many connections`))
proxy.on("data_in", (rinfo, data) => {})
proxy.on("data_out", (rinfo, data) => {})

proxy.listen("127.0.0.1", 5727, 8888, (rinfo) => {
    // Return true to allow the connection, return false to block it.

    // This function is not async, so if you do anything with databases then you might
    // want to have a cached list or something similar instead of directly reading.

    return true
})

server.on("message", (msg, rinfo) => console.log(`[Server <- ${rinfo.address}:${rinfo.port}] ${msg.toString()}`))
server.bind(5727)

let _ = 10
client.bind(0, () => {
    setInterval(() => {
        if (_ == 0) return; _--
        client.send("hello from localhost!", 8888, "127.0.0.1")
    }, 3500)
})

let last = 0
setInterval(() => {
    let workers = proxy.workers()
    if (workers !== last) {
        last = workers
        console.log(`[Monitor] There is currently ${workers} worker${(workers == 1) ? "" : "s"}`)
    }
}, 1)