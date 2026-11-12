// js/app.js
import { initPlayer, playVideo } from './player.js';
import { getSavedVideos, saveVideo, deleteVideo } from './storage.js';

// --- DOM ELEMENTS ---
const urlInput = document.getElementById('urlInput');
const addBtn = document.getElementById('addBtn');
const myVideoGrid = document.getElementById('myVideoGrid');
const ytContainer = document.getElementById('youtubeContainer');
const defaultMsg = document.getElementById('defaultMsg');
const myVideosSection = document.getElementById('myVideosSection');
const publicVideosSection = document.getElementById('publicVideosSection');
const navMyVideos = document.getElementById('navMyVideos');
const navPublicVideos = document.getElementById('navPublicVideos');

// --- INITIALIZE PLAYER ENGINE ---
// Pass in what should happen if YouTube throws an error
initPlayer((errorMessage) => {
  ytContainer.hidden = true;
  defaultMsg.hidden = false;
  defaultMsg.innerText = errorMessage;
});

// --- TAB SWITCHING LOGIC ---
navMyVideos.addEventListener('click', () => {
  myVideosSection.hidden = false;
  publicVideosSection.hidden = true;
  navMyVideos.classList.add('active');
  navPublicVideos.classList.remove('active');
});

navPublicVideos.addEventListener('click', () => {
  myVideosSection.hidden = true;
  publicVideosSection.hidden = false;
  navPublicVideos.classList.add('active');
  navMyVideos.classList.remove('active');
});

// --- HELPER FUNCTIONS ---
function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');
    if (host === 'youtube.com' || host === 'm.youtube.com') return parsed.searchParams.get('v');
    if (host === 'youtu.be') return parsed.pathname.slice(1).split('?')[0];
  } catch (e) { return null; }
  return null;
}

// --- RENDER UI ---
function renderVideos() {
  const myVideos = getSavedVideos();
  myVideoGrid.innerHTML = '';
  
  if (myVideos.length === 0) {
    myVideoGrid.innerHTML = '<div class="empty-state">Your library is empty. Paste a link above to save a video!</div>';
    return;
  }

  myVideos.forEach((video) => {
    const card = document.createElement('div');
    card.className = 'video-card';
    
    card.innerHTML = `
      <div class="thumbnail-container">
        <img src="${video.thumbnail}" alt="Thumbnail" loading="lazy" />
        <button class="delete-btn" title="Remove from library">×</button>
      </div>
      <div class="video-info">
        <div class="channel-avatar">${video.author.charAt(0).toUpperCase()}</div>
        <div class="video-text">
          <div class="video-title">${video.title}</div>
          <div class="video-author">${video.author}</div>
        </div>
      </div>
    `;

    // Play video on click
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) return;
      
      defaultMsg.hidden = true;
      ytContainer.hidden = false;
      playVideo(video.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Delete button logic
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteVideo(video.id);
      renderVideos();
    });

    myVideoGrid.appendChild(card);
  });
}

// --- ADD VIDEO LOGIC ---
addBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) return;

  const ytId = getYouTubeId(url);
  if (!ytId) {
    alert('Please enter a valid YouTube link.');
    return;
  }

  // Check if already saved
  if (getSavedVideos().some(v => v.id === ytId)) {
    alert('Video is already in your library!');
    return;
  }

  addBtn.innerText = 'Fetching...';
  addBtn.disabled = true;

  try {
    // Fetch metadata using free noembed API
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
    const data = await response.json();

    if (data.error) throw new Error('Could not fetch video data.');

    const newVideo = {
      id: ytId,
      title: data.title || 'Unknown Title',
      author: data.author_name || 'Unknown Creator',
      thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    };

    saveVideo(newVideo);
    urlInput.value = '';
    renderVideos();

  } catch (err) {
    console.error(err);
    alert('Failed to fetch video details. The video might be private or age-restricted.');
  } finally {
    addBtn.innerText = 'Save Video';
    addBtn.disabled = false;
  }
});

// Support pressing Enter in the input field
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

// --- INITIALIZATION ---
renderVideos();
