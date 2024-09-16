const http = require('http')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const computerId = "1a01ed6f-ccf4-437f-aa93-5cfe98da3170";
const playerAuthentication = {
    "Carbonate": 10
}
const doorAuthentication = {
    "Test": 10
}

const server = http.createServer((req, res) => {})

server.listen(8080, () => {
    const { address, port } = server.address()
    console.log(`Server is listening on: http://${address}:${port}`)
})

server.on("request", (req, res) => {
    console.log(req.headers)

    if (req.headers["user-agent"] !== computerId) {
        console.log("Not Authenticated!")
        res.end("false")
        return
    }
    const username = req.headers["player"]
    const authenticationLevel = playerAuthentication[username] ?? 0
    const doorLevel = doorAuthentication[req.headers["door"]] ?? 0

    console.log(`Username: ${username}, AuthenticationLevel: ${authenticationLevel}, DoorLevel: ${doorLevel}`)

    if (authenticationLevel >= doorLevel) {
        res.end("true")

        console.log("Authenticated!")

        return
    }

    console.log("Not Authenticated!")
    res.end("false");
})