function toggleSidePanel() {
    var sidePanel = document.getElementById("sidePanel");
    if (sidePanel.style.right === "-300px") {
        sidePanel.style.right = "0";
    } else {
        sidePanel.style.right = "-300px";
    }
}

function closeSidePanel() {
    document.getElementById("sidePanel").style.right = "-300px";
}

function openSocialLink(url) {
    window.open(url, '_blank');
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        var audio = new Audio('assets/audio/OwnParadise.m4a'); // replace 'your_sound_file.mp3' with the actual path to your sound file
        audio.loop = true;
        audio.play();
    }, 10000); // 15 seconds delay
});
