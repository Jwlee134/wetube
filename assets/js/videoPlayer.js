const videoContainer = document.getElementById("jsVideoPlayer")
const videoPlayer = videoContainer.querySelector("#jsVideoPlayer video")
const playBtn = document.getElementById("jsPlayButton")

const handlePlayClick = () => {
    if(videoPlayer.paused){
        videoPlayer.play()
    }else{
        videoPlayer.pause()
    }
}

const init = () => {
    playBtn.addEventListener("click", handlePlayClick)
}

if(videoContainer){
    init()
}