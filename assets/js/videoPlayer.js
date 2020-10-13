const video = document.querySelector("video");
const videoContainer = document.querySelector("#jsVideoPlayer");
const playBtn = document.querySelector("#jsPlayBtn");
const volumeBtn = document.querySelector("#jsVolumeBtn");
const totalTime = document.querySelector("#totalTime");
const currentTime = document.querySelector("#currentTime");
const progress = document.getElementById("progress");
const videoController = document.querySelector(".videoPlayer__controls");
const fullScrnBtn = document.querySelector("#jsFullScreen");
const volumeRange = document.getElementById("jsVolume");

const handlePlay = () => {
  if (video.paused) {
    video.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    video.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
};

const handleVolume = () => {
  if (video.muted) {
    video.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = video.volume;
  } else {
    volumeRange.value = 0;
    video.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
};

const handleSpaceBar = (event) => {
  if (event.keyCode === 32) {
    handlePlay();
  }
};

const setDuration = () => {
  const s = parseInt(video.duration % 60);
  const m = parseInt((video.duration / 60) % 60);
  totalTime.innerHTML = `${m}:${s < 10 ? `0${s}` : s}`;
  progress.max = video.duration;
};

const updateTime = () => {
  progress.value = video.currentTime;
  const s = parseInt(video.currentTime % 60);
  const m = parseInt((video.currentTime / 60) % 60);
  currentTime.innerHTML = `${m}:${s < 10 ? `0${s}` : s}`;
};

const restartVideo = () => {
  video.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
};

const exitFullScreen = () => {
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScreen);
  document.webkitExitFullscreen();
};

const goFullScreen = () => {
  videoContainer.webkitRequestFullscreen();
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
};

const handleDrag = (event) => {
  const {
    target: { value },
  } = event;
  video.volume = value;
  if (value >= 0.5) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.1) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else if (value == 0) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
};

const handleTime = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const init = () => {
  video.volume = 1;
  playBtn.addEventListener("click", handlePlay);
  volumeBtn.addEventListener("click", handleVolume);
  document.addEventListener("keyup", handleSpaceBar);
  video.addEventListener("loadedmetadata", setDuration);
  video.addEventListener("timeupdate", updateTime);
  video.addEventListener("ended", restartVideo);
  fullScrnBtn.addEventListener("click", goFullScreen);
  volumeRange.addEventListener("input", handleDrag);
  progress.addEventListener("click", handleTime);
};

if (videoContainer) {
  init();
}
