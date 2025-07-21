
console.log("Hello World");

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/Spotify/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}


async function main() {
    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector(".hamburger");
    const closeButton = document.querySelector(".left .close");
    const leftPanel = document.querySelector(".left");

    hamburger.addEventListener("click", () => {
        leftPanel.classList.add("open");
    });

    closeButton.addEventListener("click", () => {
        leftPanel.classList.remove("open");
    });
    let songs = await getSongs();

    let currentSongIndex = 0; // ✅ Correct place

    const audio = new Audio(songs[0]);

    const songUL = document.querySelector(".songlist ul");
    let playbarSongName = document.querySelector(".playbar .songName");
    let playbarSongArtist = document.querySelector(".playbar .songArtist");
    function updatePlaybarInfo(songUrl, playbarSongName, playbarSongArtist) {
        let filename = songUrl.split("/").pop().replace(".mp3", "");
        let [artist, title] = filename.split("_");

        artist = artist.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        title = title.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

        playbarSongName.textContent = title;
        playbarSongArtist.textContent = artist;
    }

    const currentTimeEl = document.querySelector(".currentTime");
    const totalTimeEl = document.querySelector(".totalTime");
    const seekbar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");
    const volumeSlider = document.querySelector(".volumeControl input");

    document.body.addEventListener("click", () => {
        // audio.play();
    });


    for (const song of songs) {
        let filename = song.split("/").pop().replace(".mp3", "");
        let [artist, title] = filename.split("_");

        artist = artist.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        title = title.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

        let li = document.createElement("li");

        let img = document.createElement("img");
        img.className = "invert";
        img.src = "musicIcon.svg";
        img.setAttribute("width", "30px");
        img.alt = "music";
        li.appendChild(img);

        let info = document.createElement("div");
        info.className = "info";

        let link = document.createElement("a");
        link.href = song;

        let songName = document.createElement("div");
        songName.className = "songName";
        songName.textContent = title;

        let songArtist = document.createElement("div");
        songArtist.className = "songArtist";
        songArtist.textContent = artist;

        link.appendChild(songName);
        link.appendChild(songArtist);
        info.appendChild(link);
        li.appendChild(info);

        let playBtn = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        playBtn.classList.add("playbtnHover");
        playBtn.setAttribute("width", "30");
        playBtn.setAttribute("height", "30");
        playBtn.setAttribute("viewBox", "0 0 30 30");

        let triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        triangle.setAttribute("points", "5,5 5,25 25,15");
        triangle.setAttribute("fill", "white");
        playBtn.appendChild(triangle);

        li.appendChild(playBtn);

        function playThisSong() {
            currentSongIndex = songs.indexOf(song);
            audio.src = song;
            updatePlaybarInfo(audio.src, playbarSongName, playbarSongArtist);
            audio.play();
            document.getElementById("playButtonInPlaybar").src = "pause.svg";
        }

        // ✅ Correct: set currentSongIndex & src
        link.addEventListener("click", (e) => {
            e.preventDefault();
            playThisSong();
        });

        playBtn.addEventListener("click", () => {
            playThisSong
        });

        songUL.appendChild(li);
    }

    // ✅ Play/Pause button
    playButtonInPlaybar.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playButtonInPlaybar.src = "pause.svg";
        } else {
            audio.pause();
            playButtonInPlaybar.src = "play.svg";
        }
    });

    // ✅ Prev button
    prevButtonInPlaybar.addEventListener("click", () => {
        if (audio.currentTime > 2) {
            audio.currentTime = 0;
        } else {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            audio.src = songs[currentSongIndex];
            updatePlaybarInfo(audio.src, playbarSongName, playbarSongArtist);
            audio.play();
        }
    });

    // ✅ Next button
    nextButtonInPlaybar.addEventListener("click", () => {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        audio.src = songs[currentSongIndex];
        updatePlaybarInfo(audio.src, playbarSongName, playbarSongArtist);
        audio.play();
    });

    // ✅ Auto skip
    audio.addEventListener("ended", () => {
        nextButtonInPlaybar.click();
    });

    // ✅ Seekbar click
    seekbar.addEventListener("click", (e) => {
        const rect = seekbar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // ✅ Volume slider
    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
        volumeSlider.style.background = `linear-gradient(to right, white ${volumeSlider.value * 100}%, grey ${volumeSlider.value * 100}%)`;

    });

    volumeSlider.style.background = `linear-gradient(to right, white ${volumeSlider.value * 100}%, grey ${volumeSlider.value * 100}%)`;

    // ✅ Time + circle update
    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            let minutes = Math.floor(audio.currentTime / 60);
            let seconds = Math.floor(audio.currentTime % 60);
            if (seconds < 10) seconds = "0" + seconds;
            currentTimeEl.textContent = `${minutes}:${seconds}`;

            const percent = (audio.currentTime / audio.duration) * 100;
            circle.style.left = `${percent}%`;
            if (progressBar) { // Check if progressBar exists
                progressBar.style.width = `${percent}%`;
            }
        }
    });

    audio.addEventListener("loadedmetadata", () => {
        let minutes = Math.floor(audio.duration / 60);
        let seconds = Math.floor(audio.duration % 60);
        if (seconds < 10) seconds = "0" + seconds;
        totalTimeEl.textContent = `${minutes}:${seconds}`;
        updatePlaybarInfo(audio.src, playbarSongName, playbarSongArtist);

    });

    updatePlaybarInfo(songs[0], playbarSongName, playbarSongArtist);

}

main();
