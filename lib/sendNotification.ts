// lib/sendNotification.ts
import axios from "axios";

const FCM_URL = "https://fcm.googleapis.com/fcm/send";

export async function sendNotificationToTokens(tokens: string[], title: string, body: string, url?: string) {
  if (!tokens || tokens.length === 0) return;

  const payload = {
    notification: {
      title,
      body,
      click_action: url, // optional: where to open when clicked
      icon: "/favicon.png",
    },
    registration_ids: tokens, // use registration_ids for multiple tokens
  };

  try {
    const response = await axios.post(FCM_URL, payload, {
      headers: {
        Authorization: `key=-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMNroWkhX9f3Od\nPgScyfrneldYkHDtzjbTfhlPoYoOV6UqOsaFOpRT78DNdIWQ805aililg9YqsGon\nCfF7yht3AzYMu78Bi3ubeWxgp3ZRg2LdwIBoeMTtPoTz7wTax9hUeeQJOZCTThWb\nS6j9FDX2lGtcs9krVyGRE4z1i1iFdaM5mtJc10eO6NoIR16FJ9ct0J3Nzr6Vjt3W\nMfAKpibCOiU8HTKQAlgvRJerTJ+rYoBatX8qfm4+uBNdHd/wnZlOHdzuTAwd+PyD\nf+ylfnHoGsNiZF8HSH4hsdZgq0e08VIiCaKWzw63u1JQiYJBcXHCFN+yEvXlahyO\n+cO/eAPjAgMBAAECggEAAS/nZlDna63CrwiJYVPbKV6zuHnFJYcJ26X6Xh5B4L5e\n+X86Zop88hvfVO9gZlj04W8lc32g03MJbBS4+nvWvgi6VwSP6FVqUIMJZznFCYZR\nQ74f/3JVO675SR+LCMzu8JoDv0ZEUj7ldWa4ylw4N5ySvZUxx5bu6UhAaHNjnMy0\nSZYAaCUiRrj7j7957WY3sHYWB7Q49mR9GkCieVfroEqpw+JAC2rZk0zbGK5xZkRn\n05FBVOuPleBfSr/eQl879SrEjoM/Rtij/IxrzW9dVNWdinUH+EAhiYnioZeGguvF\nAKxxY7r9/lTwKPA+BsYfUp2cihOnYLTmUUr+P+22AQKBgQD7YiDEXfjSsghO4f4u\nkrI6HJcMcF1/8pKOb5az5QR/wiBzrXML4ebtlFPj4EPtGx/0gahUGU+Gb+Ifmu0G\ng5g5+XONQy4aJGiRbyuZ6Oy34/0yrE6cVH67s6j470QsGQS29nQGBnQwuwncjbyJ\nh319LTH/i3U8SkwefhQ3w7NZ4wKBgQDP9tUkT8fSoiWUj96xMM5hZhtFgsY3KvY/\n9a+gH5tWUaUWMQMfJNvLEwbl/SoUwIxFT3gb/X8i/5TFZEPZqhfzHac3j7sBQU+r\ns0cMU2AkiBxqyvq1FgKeWZ+7w7E95iF8dVgqOwQIugoRawxBVb9JJwBWarzwCESU\n72Taq9DOAQKBgGixX3Aoqt4k4yznFdMTqUJmccnuaiJFRiAn/R2CvbLviFBk5ksG\nlARSB/YZinCPIWnVLeOIfwRASG5dOWXDHHzYlPU6C1M74ojfQcthpGSZgPO/qyWU\nUwudMTwrebrb2IjSb1OrEGzTGLJQHTsxwGOHlREWZYbscnMokwb+bA19AoGAd+AP\nUoQOahL/WJhpxHeerzQdSj8spMZF9e5YExPFBcfAQn90DjK/41oPYulApX+sG5PI\nZ1IDRBhRGEtIdSJ/9arFJdja8clE9HM95BP3Wnd+8ewZAeMzFTYSRjhyZXzPFp/J\nd2ZXV/RtM0ciZFLaFX++yRFz4WTSq4sm9omNrgECgYBkkF4qIZUqhaoR/4cARnTN\nKQ2Jk2r4TytdZiWAUN6PJMmy1QG3LZ6PJfHU0wVX2SerprQ72i0dPmkme0jp83S/\nb1HNF3aFkxRU0c5NXjO/WVlerALb9lqO/yg/UQUyndhCjqsPVRDbsi34YSqwgAnO\nfCHEJDvFbpE6M7RFOYDEyQ==\n-----END PRIVATE KEY-----\n`,
        "Content-Type": "application/json",
      },
    });

    console.log("FCM Response:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("Error sending FCM notifications:", err.response?.data || err.message);
  }
}
