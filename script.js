gsap.to("nav", {
    backgroundColor: "rgb(19, 19, 19)",
    scrollTrigger: {
        scroller: ".right",
        trigger: "nav",
        start: "top -15%",
        end: "top -30%",
        scrub: 2,
    }
})
let songBackName='';


let music_player_PlayBtn = document.querySelector(".play");

// for play audio
let audio = new Audio();

function playAudio(track) {
    audio.src = track;
    audio.play();
    music_player_PlayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    let songName = track.split(`/songs/${folder}/`)[1].split(".mp3")[0];
    let songInfo = document.querySelector(".songInfo");
    songInfo.innerHTML = songName.replaceAll("%20", " ");

}

// To convert min to sec
function secondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if seconds is less than 10
    let formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    return minutes + ":" + formattedSeconds;
}
let folder;

// Fetch all songs and return

async function getSongs(folder) {
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}`)
    // console.log(a);



    let response = await a.text();
    let div = document.createElement("div");

    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }

    return songs;

}
let all_songs;

async function displayAlbum() {
    let album = await fetch("http://127.0.0.1:3000/songs/")
    let response = await album.text();
    // console.log("response: ",response);
    
    let div = document.createElement("div");

    div.innerHTML = response;
    // console.log(div);
    let as = div.querySelectorAll("a");
    // console.log(as);
    
    for (const a of as) {
        // console.log(a.href);
        if (a.href.includes("/songs/")) {
            let folder = (a.href.split('/').slice(-2)[0]);

            // console.log(folder);
            

            let album = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await album.json();
            // console.log(response);
            document.querySelector(".cardContainer").innerHTML +=
                `<div class="card">
                <img src="songs/${folder}/cover.jpg" alt="">
                <h3>${response.title}</h3>
                <p>${response.discription}</p>
                <div class="playBtn">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>`
        }
    };
    return Promise.resolve();
}

function addCardEventListner() {
    // console.log('hello');

    let SongCardContainer = document.querySelector(".song-cardContainer");
    // Get all songs
    let index;
    let right_cards = document.querySelectorAll(".card")
    let right_cards_array = Array.from(right_cards);

    // console.log("right cards: ",right_cards);
    right_cards_array.forEach(rCard => {


        rCard.addEventListener("click", async (e) => {

            SongCardContainer.innerHTML = '';
            folder=e.currentTarget.querySelector("img").src.split("/cover")[0].split("/songs/")[1];
            
            
            all_songs = await getSongs(folder);
            console.log(all_songs);
            
            

            let addressOfSOng;
            playAudio(all_songs[0]);
            // console.log(all_songs[0]);


            // Show all the songs in the playlist

            all_songs.forEach(song => {
                // console.log(song);
                

                let songName = song.split(`/songs/${folder}/`)[1].split(".mp3")[0];
                console.log(songName);

                addressOfSOng = song.split(`/songs/${folder}/`)[0];
                SongCardContainer.innerHTML += `
        
                    <div id="pause" class="songCard">
        
                        <div class="musicImg">
                            <i class="fa-solid fa-music"></i>
                        </div>
        
                        <div class="songDetail">
                            <div class="songname">${songName.replaceAll("%20", " ").split("-")[0]}</div>
                            <div class="artist">${songName.replaceAll("%20", " ").split("-")[1]}</div>
                        </div>
                        
                        <div class="songCard-PlayBtn">
                            <i class="fa-solid fa-play"></i>
                        </div>
                    
                    </div>`
            });
            let allSongsCard = SongCardContainer.querySelectorAll(".songCard")
            // console.log(allSongsCard);


            allSongsCard.forEach(sCard => {

                

                sCard.addEventListener("click", () => {
                    // console.log('Click');


                    let songName = sCard.querySelector(".songname").innerHTML;
                    let artist= sCard.querySelector(".artist").innerHTML
                    
                    let songPlay = `${addressOfSOng}/songs/${folder}/${songName}-${artist}.mp3`;
                    audio.pause();

                    playAudio(songPlay);
                })

            });
            
        })
    })
}


async function main() {


    // Display Album
    // await displayAlbum();

    // PlAY SONGS
    // addCardEventListner();
    await displayAlbum();
    addCardEventListner();


    // CLICK ON MUSIC PLAYER

    music_player_PlayBtn.addEventListener("click", () => {
        if (audio.paused) {

            // if 1st song play
            if (audio.src == '') {
                // audio.pause();
                playAudio(all_songs[0]);
                // console.log(audio.src);
            }
            else {


                audio.play();
                music_player_PlayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;

            }

        }
        else {
            // console.log(audio);

            audio.pause();
            music_player_PlayBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
            // console.log(audio.src);
        }
    })

    // UPDATE DURATION
    audio.addEventListener("timeupdate", () => {

        let songTime = document.querySelector(".songTime");
        songTime.innerHTML = `${secondsToMinutes(audio.currentTime)} / ${secondsToMinutes(audio.duration)}`;

        circle.style.left = `${(audio.currentTime / audio.duration) * 100}` + "%"
        if (circle.style.left == "100%") {
            music_player_PlayBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
            audio.pause();
            circle.style.left = "0%";
        }
    })


    // click on SEEKBAR 

    let circle = document.querySelector(".circle")
    let seekbar = document.querySelector(".seekbar");
    seekbar.addEventListener("click", (e) => {
        circle.style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + '%';

        audio.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * audio.duration;
    })

    document.querySelector(".bars").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })
    document.querySelector(".x-mark").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })



    // prev and Next btns

    document.querySelector(".prev").addEventListener("click", () => {
        if (all_songs.indexOf(audio.src) == 0) {
            playAudio(audio.src);
        }
        else if (all_songs.indexOf(audio.src) == -1) {
            playAudio(all_songs[0]);
        }
        else {
            playAudio(all_songs[all_songs.indexOf(audio.src) - 1]);

        }
    })


    document.querySelector(".next").addEventListener("click", () => {
        if (all_songs.indexOf(audio.src) == all_songs.length - 1) {
            playAudio(audio.src);
        }
        else if (all_songs.indexOf(audio.src) == -1) {
            playAudio(all_songs[0]);
        }
        else {
            playAudio(all_songs[all_songs.indexOf(audio.src) + 1]);
        }
    })

    music_player_PlayBtn.addEventListener("click", () => {
        let rightCardContainer = document.querySelector(".cardContainer")
        let musicPlayer = document.querySelector(".music-player");
        rightCardContainer.style.paddingBottom = musicPlayer.offsetHeight + "px";
    })

    // VOLUME

    let volumeSeekbar = document.querySelector("#volume-seekbar");
    volumeSeekbar.addEventListener("change", (e) => {
        audio.volume = e.target.value / 100;
        if (audio.volume == 0) {
            document.querySelector("#volumeBtn").style.display = "none";
            document.querySelector("#volume-stop").style.display = "block";
        }
        else {
            document.querySelector("#volume-stop").style.display = "none";
            document.querySelector("#volumeBtn").style.display = "block";
        }

    })
    document.querySelector("#volumeBtn").addEventListener("click",()=>{
        audio.volume=0;
        document.querySelector("#volumeBtn").style.display = "none";
        document.querySelector("#volume-stop").style.display = "block";
        volumeSeekbar.value=0;
    })
    document.querySelector("#volume-stop").addEventListener("click",()=>{
        audio.volume=0.7;
        document.querySelector("#volume-stop").style.display = "none";
        document.querySelector("#volumeBtn").style.display = "block";
        volumeSeekbar.value=70;

    })
    
}

main();
