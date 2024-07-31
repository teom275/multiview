document.getElementById('addVideoButton').addEventListener('click', function() {
    const videoUrl = document.getElementById('videoUrl').value;
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
        addVideoToGrid(videoId);
        document.getElementById('videoUrl').value = ''; // Clear the input field
    } else {
        alert('Please enter a valid YouTube URL.');
    }
});

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)([^&\n]+)|youtu\.be\/([^&\n]+)/;
    const match = url.match(regex);
    return (match && (match[1] || match[2])) ? (match[1] || match[2]) : null;
}

function addVideoToGrid(videoId) {
    const videoGrid = document.getElementById('videoGrid');
    const videoItem = document.createElement('div');
    videoItem.classList.add('video-item');
    videoItem.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    videoGrid.appendChild(videoItem);
}
