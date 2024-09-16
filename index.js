const fs = require("fs")
const http = require('http')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const computerId = "1a01ed6f-ccf4-437f-aa93-5cfe98da3170";
let playerAuthentication = {};
let doorAuthentication = {};
const server = http.createServer((req, res) => {})

function LoadJson()
{
    playerAuthentication = JSON.parse(fs.readFileSync(__dirname + "/authentications/players.json", 'utf8'))
    doorAuthentication = JSON.parse(fs.readFileSync(__dirname + "/authentications/doors.json", 'utf8'))

    console.log("Reloaded Json Files!")
}

server.listen(8080, () =>
{
    LoadJson();
    const { address, port } = server.address()
    console.log(`Server is listening on: http://${address}:${port}`)
})

server.on("request", (req, res) =>
{
    console.log(req.headers)

    if (req.headers["command"] === "reload")
    {
        LoadJson()
        res.end("Complete!")

        return
    }

    if (req.headers["user-agent"] !== computerId)
    {
        console.log("Not Authenticated!")
        res.end("false")

        return
    }
    const username = req.headers["player"]
    const door = req.headers["door"]
    const authenticationLevel = playerAuthentication[username] ?? 0
    const doorLevel = doorAuthentication[door] ?? 0

    console.log(`Username: ${username}, AuthenticationLevel: ${authenticationLevel}, DoorLevel: ${doorLevel}`)

    if (authenticationLevel >= doorLevel)
    {
        console.log("Authenticated!")
        res.end("true")

        return
    }

    console.log("Not Authenticated!")
    res.end("false");
})