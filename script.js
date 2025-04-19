export function startApp(db) {
  let songLibrary = [];
  let filteredSongs = [];
  const itemsPerPage = 10;
  let currentPage = 1;

  async function fetchSongsFromFirestore() {
    const querySnapshot = await getDocs(collection(db, "songs"));
    songLibrary = querySnapshot.docs.map(doc => {
	  const data = doc.data();
	  return {
		name: data.name || "無名歌曲",
		singer: data.singer || "未知歌手",
		picked: data.picked || false
	  };
});
    filteredSongs = [...songLibrary];
    renderLibrary();
  }

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
      info.innerHTML = `<strong>${song.name}</strong> - ${song.singer}`;

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
    filteredSongs = songLibrary.filter(song =>
	  song.name.toLowerCase().includes(searchTerm) ||
	  song.singer.toLowerCase().includes(searchTerm)
	);
		currentPage = 1;
    renderLibrary();
  }

  // 綁定按鈕
  document.getElementById("prevBtn").addEventListener("click", prevPage);
  document.getElementById("nextBtn").addEventListener("click", nextPage);
  document.getElementById("searchBtn").addEventListener("click", searchSongs);
  document.getElementById("searchInput").addEventListener("input", searchSongs);

  // 初始化資料
  fetchSongsFromFirestore();
}
