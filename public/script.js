import {
  getDocs,
  collection,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export function startApp(db) {
  let songLibrary = [];
  let filteredSongs = [];
  const itemsPerPage = 10;
  let currentPage = 1;

  async function fetchSongs() {
    const querySnapshot = await getDocs(collection(db, "songs"));
    songLibrary = []; // 清空重建

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      songLibrary.push({
        id: docSnap.id,
        name: data.song || data.name || "(無歌名)",
        singer: data.singer || "(未知歌手)",
        picked: data.picked === true,
        count: data.count || 0,
        lang: data.lang || ""
      });
    });

    filteredSongs = [...songLibrary]; // 初始化搜尋用陣列
    renderLibrary();
  }

  function renderLibrary() {
    const songLibraryDiv = document.getElementById("songLibrary");
    songLibraryDiv.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // 建立表格容器
    const table = document.createElement("table");
    table.className = "song-table";

    // 表頭
    
    // 表身

	
    const songLibrary = document.getElementById("songLibrary");
	songLibrary.innerHTML = ""; // ✅ 清空舊資料

	const pageSongs = filteredSongs.slice(start, end);

	pageSongs.forEach((song) => {
	  const tr = document.createElement("tr");
	  tr.innerHTML = `
		<td>${song.name}</td>
		<td>${song.singer}</td>
		<td>${song.count}</td>
		<td>${song.lang}</td>
		<td style="text-align: right;">
		  <button onclick="addToQueue('${song.id}', ${song.count})">點歌</button>
		</td>
		`;
	  songLibrary.appendChild(tr); // ✅ 塞進原本 HTML 寫好的 <tbody>
	});

	document.getElementById("prevBtn").disabled = currentPage === 1;
	document.getElementById("nextBtn").disabled = end >= filteredSongs.length;

  }

  window.addToQueue = async function (id, currentCount) {
    const docRef = doc(db, "songs", id);
    await updateDoc(docRef, {
      picked: true,
      count: currentCount + 1
    });

    const song = songLibrary.find((s) => s.id === id);
    if (song) {
      const songList = document.getElementById("songList");
      const div = document.createElement("div");
      div.className = "song";
      div.innerHTML = `<strong>${song.name}</strong> - ${song.singer}`;
      songList.appendChild(div);
    }

    fetchSongs();
  };

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
  fetchSongs();
}
