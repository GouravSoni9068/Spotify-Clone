gsap.to("nav",{
    backgroundColor:"rgb(19, 19, 19)",
    scrollTrigger:{
        scroller:".right",
        trigger:"nav",
        start:"top -15%",
        end:"top -30%",
        scrub:2,
    }
})



async function getSongs(){
    let a=await fetch("http://127.0.0.1:3000/songs/")

    let response=await a.text();
    let div=document.createElement("div");

    div.innerHTML=response;
    console.log(div);

    let as=div.getElementsByTagName("a");
    console.log(as);

    let songs=[];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href);
        }
    }
    
    return songs;

}

let audio = new Audio();


function playAudio(track){
    audio.src=track;
    audio.play();
}

async function main(){
    let SongCardContainer=document.querySelector(".song-cardContainer");

   // Get all songs
    let all_songs=await getSongs();
    let addressOfSOng;

  // Show all the songs in the playlist
    all_songs.forEach(song => {

        let songName=song.split("/songs/")[1];
        addressOfSOng=song.split("/songs/")[0];
        
        SongCardContainer.innerHTML+=`

            <div id="pause" class="songCard">

                <div class="musicImg">
                    <i class="fa-solid fa-music"></i>
                </div>

                <div class="songDetail">
                    <div class="songname">${songName}</div>
                    <div class="artist">Lorem, ipsum.</div>
                </div>
                
                <div class="songCard-PlayBtn">
                    <i class="fa-solid fa-play"></i>
                </div>
            
            </div>`
        });


    // PlAY SONGS
        let music_player_PlayBtn =document.querySelector(".play");
        console.log(music_player_PlayBtn)
        let allSongsCard=SongCardContainer.querySelectorAll(".songCard")

        allSongsCard.forEach(sCard => {

            sCard.addEventListener("click",()=>{

                let songName=sCard.querySelector(".songname").innerHTML;
                let songPlay=`${addressOfSOng}/songs/${songName}`;

                playAudio(songPlay);  

                let songInfo=document.querySelector(".songInfo");
                songInfo.innerHTML=songName;

                music_player_PlayBtn.innerHTML=`<i class="fa-solid fa-pause"></i>`

                let songDuration=document.querySelector(".songTime");


            // find song duration time
                audio.addEventListener("loadeddata", () => {
                    songDuration.innerHTML=Math.floor(audio.duration)+'sec';
                    
                  });
            })

        });

        music_player_PlayBtn.addEventListener("click",()=>{
            

            if (audio.paused) {
                if(audio.src=='')
                {
                    console.log("firstly played the song from playlist");
                    
                }
                else
                {
                    music_player_PlayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
                    audio.play();
                }
            } else {
                music_player_PlayBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
                audio.pause();
            }
        })


}



main();

