const dgram_proxy = require("../src")
const proxy = new dgram_proxy()

proxy.on("worker_spawn", (rinfo) => console.log(`[${rinfo.address}:${rinfo.port}] Spawned`))
proxy.on("worker_bind", (rinfo, port) => console.log(`[${rinfo.address}:${rinfo.port}] Bound at port ${port}`))
proxy.on("worker_idle", (rinfo) => console.log(`[${rinfo.address}:${rinfo.port}] Terminated after 30 sec of inactivity`))
proxy.on("blocked", (rinfo) => console.log(`[${rinfo.address}:${rinfo.port}] Blocked manually`))
proxy.on("data_in", (rinfo, data) => {})
proxy.on("data_out", (rinfo, data) => {})

proxy.listen(process.argv[2], 8080, 8888)