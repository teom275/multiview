document.getElementById('addVideoButton').addEventListener('click', function() {
    var videoUrl = document.getElementById('videoUrl').value;
    if (videoUrl) {
        var videoId = extractVideoID(videoUrl);
        if (videoId) {
            var iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;

            document.getElementById('videoGrid').appendChild(iframe);
        } else {
            alert('Invalid YouTube URL');
        }
    }
});

function extractVideoID(url) {
    var match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return (match && match[1]) ? match[1] : null;
}
