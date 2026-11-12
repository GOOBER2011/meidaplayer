// js/player.js
let ytPlayer = null;
let currentVideoId = null;
let onErrorCallback = null;

export function initPlayer(errorHandler) {
  onErrorCallback = errorHandler;
  
  // Load the YouTube API script dynamically
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

export function playVideo(videoId) {
  if (currentVideoId === videoId && ytPlayer) return; // Already playing
  currentVideoId = videoId;

  // If the API is loaded, play the video
  if (window.YT && window.YT.Player) {
    if (ytPlayer) {
      ytPlayer.loadVideoById(videoId);
    } else {
      ytPlayer = new YT.Player('youtubeContainer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: { 'rel': 0, 'autoplay': 1 },
        events: {
          'onError': (event) => {
            let msg = '⚠️ An error occurred.';
            if (event.data === 101 || event.data === 150) {
              msg = '⛔ This video is not allowed to be played by the creator.';
            } else if (event.data === 153) {
              msg = '⚠️ Configuration error (153). Ensure you are on a valid domain.';
            }
            if (onErrorCallback) onErrorCallback(msg);
          }
        }
      });
    }
  } else {
    // If the API hasn't finished loading yet, wait a moment and try again
    setTimeout(() => playVideo(videoId), 500);
  }
}
