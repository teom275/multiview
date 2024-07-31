const videoUrlInput = document.getElementById('videoUrl');
const addVideoButton = document.getElementById('addVideoButton');
const videoGrid = document.getElementById('videoGrid');

addVideoButton.addEventListener('click', () => {
  const videoUrl = videoUrlInput.value;
  if (videoUrl) {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      createVideoItem(videoId);
      videoUrlInput.value = '';
    } else {
      alert('Invalid YouTube URL');
    }
  }
});

function extractVideoId(url) {
  // Implement a function to extract the video ID from the YouTube URL
  // You can use regular expressions or URL parsing libraries
  // For simplicity, let's assume a basic pattern for now:
  const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function createVideoItem(videoId) {
  const videoItem = document.createElement('div');
  videoItem.classList.add('video-item');

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}`;   

  iframe.allowFullscreen = true;

  const overlay = document.createElement('div');
  overlay.classList.add('video-overlay');

  const removeButton = document.createElement('span');
  removeButton.classList.add('remove-button');
  removeButton.textContent = '×';
  removeButton.addEventListener('click', () => {
    videoGrid.removeChild(videoItem);
  });

  overlay.appendChild(removeButton);
  videoItem.appendChild(iframe);
  videoItem.appendChild(overlay);
  videoGrid.appendChild(videoItem);
}
