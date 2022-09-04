const app = new Vue({
    el: "#app",
    data: {
        guesses: [

        ]
    },
});

const baseurl = "https://store.steampowered.com/appreviews/$appid$?json=1&num_per_page=100"

$.ajax(`/review/${games[Math.floor(Math.random() * games.length)].id}`).done((res) => {
    console.log(res)
    return res;
});