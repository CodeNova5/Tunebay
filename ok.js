import axios from 'axios';
const options = {
  method: 'GET',
  url: 'https://billboard2.p.rapidapi.com/billboard_global_200_excl_us',
  params: {date: '2025-10-01'},
  headers: {
    'x-rapidapi-key': 'efa960acdemsha3194f4039be00cp19921ajsn62dacf76f6ed',
    'x-rapidapi-host': 'billboard2.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
     const topSongs = response.data.map((song) => ({
          rank: song.rank || song.position || 0,
          title: song.title || song.song || "Unknown Title",
          artist: song.artist || song.artist_name || "Unknown Artist",
          image: song.image || song.cover || "/placeholder.jpg",
        }));
		console.log(topSongs);
	} catch (error) {
		console.error(error);
	}
}

fetchData();