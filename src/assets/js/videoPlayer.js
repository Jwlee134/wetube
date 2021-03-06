const video = document.querySelector("video");
const videoContainer = document.querySelector("#jsVideoPlayer");
const playBtn = document.querySelector("#jsPlayBtn");
const volumeBtn = document.querySelector("#jsVolumeBtn");
const totalTime = document.querySelector("#totalTime");
const currentTime = document.querySelector("#currentTime");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const videoController = document.querySelector(".videoPlayer__controls");
const fullScrnBtn = document.querySelector("#jsFullScreen");
const volumeRange = document.getElementById("jsVolume");

let timeout;

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

const setDuration = () => {
  const totalSec = parseInt(video.duration % 60);
  const totalMin = parseInt((video.duration / 60) % 60);
  totalTime.innerHTML = `${totalMin}:${
    totalSec < 10 ? `0${totalSec}` : totalSec
  }`;
};

const updateTime = () => {
  const currentSec = parseInt(video.currentTime % 60);
  const currentMin = parseInt((video.currentTime / 60) % 60);
  currentTime.innerHTML = `${currentMin}:${
    currentSec < 10 ? `0${currentSec}` : currentSec
  }`;
};

const restartVideo = () => {
  video.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
};

const exitFullScreen = () => {
  videoController.classList.remove("fullScreen");
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScreen);
  document.webkitExitFullscreen();
};

const goFullScreen = () => {
  videoContainer.webkitRequestFullscreen();
  videoController.classList.add("fullScreen");
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

const handleProgressMax = () => {
  progress.setAttribute("max", video.duration);
};

const handleCurrentProgress = () => {
  if (!progress.getAttribute("max"))
    progress.setAttribute("max", video.duration);
  progress.value = video.currentTime;
};

const handleProgress = (e) => {
  const clickedValue = (e.offsetX * progress.max) / progress.offsetWidth;
  video.currentTime = clickedValue;
};

const detectMouseMove = () => {
  videoContainer.classList.add("showCursor");
  videoController.classList.add("showBar");
  videoContainer.classList.remove("hideCursor");
  videoController.classList.remove("hideBar");
  clearTimeout(timeout);
  timeout = setTimeout(hideContents, 2000);
};

const hideContents = () => {
  videoContainer.classList.add("hideCursor");
  videoController.classList.add("hideBar");
  videoContainer.classList.remove("showCursor");
  videoController.classList.remove("showBar");
};

const init = () => {
  video.volume = 1;
  playBtn.addEventListener("click", handlePlay);
  volumeBtn.addEventListener("click", handleVolume);
  document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
      setDuration();
    }
  });
  video.addEventListener("loadedmetadata", setDuration);
  video.addEventListener("loadedmetadata", handleProgressMax);
  video.addEventListener("timeupdate", updateTime);
  video.addEventListener("timeupdate", handleCurrentProgress);
  video.addEventListener("ended", restartVideo);
  fullScrnBtn.addEventListener("click", goFullScreen);
  volumeRange.addEventListener("input", handleDrag);
  progress.addEventListener("click", handleProgress);
  videoContainer.addEventListener("mousemove", detectMouseMove);
};

if (videoContainer) {
  init();
}
