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

async function main(){
    let SongCardContainer=document.querySelector(".song-cardContainer");

    let all_songs=await getSongs();
    console.log(all_songs);

    all_songs.forEach(song => {

        let songName=song.split("/songs/")[1];
        SongCardContainer.innerHTML+=`

            <div class="songCard">

                <div class="songDetail">
                    <div class="songname">${songName}</div>
                    <div class="artist">Lorem, ipsum.</div>
                </div>
                
                <div class="songCard-PlayBtn">
                    <i class="fa-solid fa-play"></i>
                </div>
            
            </div>`
        });

        document.querySelector(".play").addEventListener("click",()=>{
            console.log(all_songs);
            
            let audio = new Audio(all_songs[0]);
            audio.play();
        })
        
}

main();

