// js/app.js
import { initPlayer, playVideo } from './player.js';
import { getSavedVideos, saveVideo, deleteVideo } from './storage.js';

const urlInput = document.getElementById('urlInput');
const addBtn = document.getElementById('addBtn');
const myVideoGrid = document.getElementById('myVideoGrid');
const defaultMsg = document.getElementById('defaultMsg');
const ytContainer = document.getElementById('youtubeContainer');

// 1. Setup the player and give it the error handler
initPlayer((errorMessage) => {
  ytContainer.hidden = true;
  defaultMsg.hidden = false;
  defaultMsg.innerText = errorMessage;
});

// 2. Render the video grid
function renderVideos() {
  const myVideos = getSavedVideos();
  myVideoGrid.innerHTML = '';
  
  myVideos.forEach((video, index) => {
    // ... (Your existing render logic)
    
    // When clicking a card, tell the player to play it
    card.addEventListener('click', () => {
      defaultMsg.hidden = true;
      ytContainer.hidden = false;
      playVideo(video.id); // Call the engine!
    });
  });
}

// 3. Handle adding a new video
addBtn.addEventListener('click', async () => {
  // ... (Your existing fetch logic using noembed)
  // Then call saveVideo(newVideo) from storage.js
  // Then call renderVideos()
});

renderVideos();
