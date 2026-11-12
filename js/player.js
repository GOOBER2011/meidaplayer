// js/player.js
let ytPlayer = null;
let currentVideoId = null;
let onErrorCallback = null;

// Load the YouTube API script dynamically
export function initPlayer(errorHandler) {
  onErrorCallback = errorHandler;
  
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API Ready");
    };
  }
}

export function playVideo(videoId) {
  if (currentVideoId === videoId && ytPlayer) return;
  currentVideoId = videoId;

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
            msg = '⚠️ Configuration error (153).';
          }
          if (onErrorCallback) onErrorCallback(msg);
        }
      }
    });
  }
}
