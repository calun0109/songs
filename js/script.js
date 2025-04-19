
const songLibrary = [
  { name: "想見你想見你想見你", artist: "八三夭" },
  { name: "光年之外", artist: "鄧紫棋" },
  { name: "刻在我心底的名字", artist: "盧廣仲" },
  { name: "披星戴月的想你", artist: "告五人" },
  { name: "愛你", artist: "Kimberley" },
  { name: "我很忙", artist: "周杰倫" },
  { name: "那些你很冒險的夢", artist: "林俊傑" },
  { name: "你要的全拿走", artist: "胡彥斌" },
  { name: "突然好想你", artist: "五月天" },
  { name: "好不容易", artist: "告五人" },
  { name: "倒數", artist: "G.E.M 鄧紫棋" },
  { name: "平凡之路", artist: "朴樹" },
  { name: "小幸運", artist: "田馥甄" },
  { name: "說好不哭", artist: "周杰倫" },
];

const itemsPerPage = 10;
let currentPage = 1;
let filteredSongs = [...songLibrary];

function renderLibrary() {
  const songLibraryDiv = document.getElementById("songLibrary");
  songLibraryDiv.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageSongs = filteredSongs.slice(start, end);

  pageSongs.forEach((song) => {
    const div = document.createElement("div");
    div.className = "song";

    const info = document.createElement("div");
    info.className = "song-info";
    info.innerHTML = `<strong>${song.name}</strong> - ${song.artist}`;

    const button = document.createElement("button");
    button.textContent = "點歌";
    button.onclick = () => addToQueue(song);

    div.appendChild(info);
    div.appendChild(button);
    songLibraryDiv.appendChild(div);
  });

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = end >= filteredSongs.length;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderLibrary();
  }
}

function nextPage() {
  if ((currentPage * itemsPerPage) < filteredSongs.length) {
    currentPage++;
    renderLibrary();
  }
}

function addToQueue(song) {
  const songList = document.getElementById("songList");
  const div = document.createElement("div");
  div.className = "song";
  div.innerHTML = `<strong>${song.name}</strong> - ${song.artist}`;
  songList.appendChild(div);
}

function searchSongs() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  filteredSongs = songLibrary.filter(song => song.name.toLowerCase().includes(searchTerm) || song.artist.toLowerCase().includes(searchTerm));
  currentPage = 1;  // Reset to first page when searching
  renderLibrary();
}

renderLibrary();