const request = require("request");
const fakeUa = require("fake-useragent");
const server = require("express")();
const path = require("path");
const server_port = 25564;

function dhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dd = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hd = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var md = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sd = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return (dd + hd + md + sd).slice(0, -2);
}

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/../ui/index.html"));
});

server.get("/resources/:file", (req, res) => {
    res.sendFile(path.join(__dirname + "/../resources/" + req.params.file));
});

server.get("/scripts/:file", (req, res) => {
    res.sendFile(path.join(__dirname + "/../scripts/" + req.params.file));
});

server.get("/ui/:file", (req, res) => {
    res.sendFile(path.join(__dirname + "/../ui/" + req.params.file));
});

server.get("/review/:appid/:limit", (req, res) => {
    options = {
        url: `https://store.steampowered.com/appreviews/${req.params.appid}?json=1&num_per_page=100`,
        method: "GET",
        headers: {},
    };

    options["headers"]["User-Agent"] = fakeUa();


    request(options, function (error, response, body) {
        // console.log(req.headers);
        // console.log(error, response, body);

        body = JSON.parse(body);
        newbody = []
        actualbody = []

        for (i in body.reviews) {
            newbody.push({
                "content": body.reviews[i]["review"],
                "time_played": dhms(body.reviews[i]["author"]["playtime_forever"] * 60),
                "votes": {
                    "funny": body.reviews[i]["votes_funny"],
                    "up": body.reviews[i]["votes_up"]
                }
            })
        }

        for (var i = 0; i < newbody.length; i++) {
            if (i < req.params.limit) {
                actualbody.push(newbody[i])
            }
        }

        actualbody.sort((a, b) => {
            return b.votes.funny - a.votes.funny
        })

        res.json(actualbody)
    });
})

server.listen(server_port, () => {
    console.log(`server.start http://localhost:${server_port}`);
});
