// js/storage.js
export function getSavedVideos() {
  return JSON.parse(localStorage.getItem('myTubeVideos')) || [];
}

export function saveVideo(videoObj) {
  const videos = getSavedVideos();
  videos.unshift(videoObj); // Add to the beginning of the array
  localStorage.setItem('myTubeVideos', JSON.stringify(videos));
}

export function deleteVideo(videoId) {
  let videos = getSavedVideos();
  videos = videos.filter(v => v.id !== videoId);
  localStorage.setItem('myTubeVideos', JSON.stringify(videos));
}
