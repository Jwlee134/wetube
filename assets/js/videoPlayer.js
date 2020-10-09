const videoContainer = document.getElementById("jsVideoPlayer")
const videoPlayer = videoContainer.querySelector("#jsVideoPlayer video")
const playBtn = document.getElementById("jsPlayButton")
const volumeBtn = document.getElementById("jsVolumeBtn")

const handleVolumeClick = () => {
    if(videoPlayer.muted){
        videoPlayer.muted = false
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>'
    }else{
        videoPlayer.muted = true
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'
    }
}

const handlePlayClick = () => {
    if(videoPlayer.paused){
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }else{
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

const init = () => {
    playBtn.addEventListener("click", handlePlayClick)
    volumeBtn.addEventListener("click", handleVolumeClick)
}

if(videoContainer){
    init()
}