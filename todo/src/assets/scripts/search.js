const form = document.getElementById("searchForm");
const input = document.getElementById("input");

// spotify api token
const spotifyAccess = (function() {
    const clientID = 'accae6b6c5604b8b9793c93ce82dcb73';
    const clientSecret = 'c131cb4ca8954077bfd42c7b87b0b8d4';

    const getToken = async () => {

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientID + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        })

        const data = await response.json();
        return data.access_token;
    }

    const getTrack = async (token, trackId) => {
        const result = await fetch('https://api.spotify.com/v1/tracks/' + trackId, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        });

        const data = await result.json();
        return data;
    }

    return {
        getAccessToken() {
            return getToken();
        },
        getTrackDetails(token, trackId) {
            return getTrack(token, trackId);
        }
    }
})();


// fetch api
async function search(API) {

    const token = await API.getAccessToken();
    const songDisplay = document.querySelector(".songDisplay");

    // search for tracks
    let searchID = await fetch('https://api.spotify.com/v1/search?q=' + input.value + '&type=track&access_token=' + token)
    .then(response =>  response.json())
    .then(data => {
        let trackName = data.tracks.items[0].name;

        if (trackName = input.value) {
            console.log(`Searched for:  ${input.value}`)
            console.log(data.tracks.items);

            songDisplay.innerHTML = getTracks(data.tracks.items);
        }
    });
}

// display tracks
const getTracks = (tracks) => {
    const results = tracks
    .map((track) =>

        `
        <div class="tracks">

            <div id="${track.id}" onclick="saveData(this.id)">

                <div class="track-row">
                    <img src="${track.album.images[2].url}">

                    <div class="track-info">
                        <ul class="info">
                            <li class="title" id="trackName">${track.name}</li>
                            <li class="artist">${track.artists[0].name}</li>
                        </ul>
                    </div>

                    <div class="track-time">
                        <p class="time">${msToMinutesAndSeconds(track.duration_ms)}</p>
                    </div>
                </div>
            </div>
        </div>
        `

    ).join("\n");

    return results;
}

// get clicked track's data
async function saveData(savedId) {
    const savedID = savedId;

    const token = await spotifyAccess.getAccessToken();

    const track = await spotifyAccess.getTrackDetails(token, savedID);

    // store data
    localStorage.setItem("searchedTrackName", track.name);
    localStorage.setItem("searchedTrackArtist", track.artists[0].name);
    localStorage.setItem("searchedTrackImg", track.album.images[2].url);

    console.log(localStorage.getItem("searchedTrackImg"))

    // direct to payment page
    window.location.href = "payment.html";
}

// converting track duration from ms to minutes and seconds
function msToMinutesAndSeconds(ms) {
  let minutes = Math.floor(ms / 60000);
  let seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// when search bar is clicked
input.onkeypress = function (event) {
    let timer;

    // if existing timer exists, then reset
    if (timer != undefined) clearTimeout(timer);
    // call function when timer ends
    timer = setTimeout(showBtnDelete, 2);
};

const btnDelete = document.getElementById("btnDelete");

// delete btn shows only when typing
function showBtnDelete() {
    if (input.value != "") {

        btnDelete.style.display = "block";
    }
}

// when delete btn is clicked
function emptyInput() {
    input.value = "";

    btnDelete.style.display = "none";
}

// input validation
function hasValue(input) {

    // check if the value is not empty
    if (input.value.trim() === "") {
        input.placeholder = "Please fill in the input to request";
        return false;
    }

    return true;
}

// form validation when submit
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // validate the search
    let inputValid = hasValue(input);

    // if valid, submit the form
    if (inputValid) {
        search(spotifyAccess);
    }
});

