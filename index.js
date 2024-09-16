const fs = require("fs")
const http = require('http')
const computerId = "1a01ed6f-ccf4-437f-aa93-5cfe98da3170";
const server = http.createServer((req, res) => {})
const jsonFiles = [
    __dirname + "/authentications/players.json",
    __dirname + "/authentications/doors.json"
]
const Logger = {
    getTimeStamp: () => {
        let date = new Date();

        return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    },
    log: (message) => {
        console.log(`${Logger.getTimeStamp()} | ${message}`)
    }
}

let playerAuthentication = {};
let doorAuthentication = {};

jsonFiles.forEach(fileDir =>
{
   fs.watchFile(fileDir, (current, previous) =>
   {
       if (fileDir.endsWith("players.json"))
       {
           playerAuthentication = JSON.parse(fs.readFileSync(fileDir, 'utf8'))
       }
       if (fileDir.endsWith("doors.json"))
       {
           doorAuthentication = JSON.parse(fs.readFileSync(fileDir, 'utf8'))
       }

       Logger.log(`Successfully reloaded ${fileDir}`)
   })
});

server.listen(8080, () =>
{
    const { address, port } = server.address()
    Logger.log(`Server is listening on: http://${address}:${port}`)
})

server.on("request", (req, res) =>
{
    Logger.log(req.headers)

    if (req.headers["user-agent"] !== computerId)
    {
        Logger.log("Not Authenticated!")
        res.end("false")

        return
    }
    const username = req.headers["player"]
    const door = req.headers["door"]
    const authenticationLevel = playerAuthentication[username] ?? 0
    const doorLevel = doorAuthentication[door] ?? 0

    Logger.log(`Username: ${username}, AuthenticationLevel: ${authenticationLevel}, DoorLevel: ${doorLevel}`)

    if (authenticationLevel >= doorLevel)
    {
        Logger.log("Authenticated!")
        res.end("true")

        return
    }

    Logger.log("Not Authenticated!")
    res.end("false");
})