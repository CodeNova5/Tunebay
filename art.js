import axios from "axios";
import fs from "fs";
async function downloadMP3(videoId) {
  try {
    const options = {
      method: "GET",
      url: "https://youtube-mp36.p.rapidapi.com/dl",
      params: { id: videoId },
      headers: {
        "x-rapidapi-key": "67685ec1f0msh5feaa6bf64dbeadp16ffa5jsnd72b2a894302",
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
    };

    const res = await axios.request(options);

    if (res.data.status === "ok") {
      const file = fs.createWriteStream("output.mp3");
      const audio = await axios.get(res.data.link, { responseType: "stream" });
      audio.data.pipe(file);

      file.on("finish", () => {
        console.log("✅ MP3 saved as output.mp3");
      });
    } else {
      console.error("❌ Error:", res.data.msg);
    }
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
}

downloadMP3("wAI1hoHjcUA");
