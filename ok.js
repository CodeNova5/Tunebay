import axios from 'axios';
const options = {
  method: 'GET',
  url: 'https://billboard2.p.rapidapi.com/billboard_global_200_excl_us',
  params: {date: '2020-09-19'},
  headers: {
    'x-rapidapi-key': 'efa960acdemsha3194f4039be00cp19921ajsn62dacf76f6ed',
    'x-rapidapi-host': 'billboard2.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

fetchData();