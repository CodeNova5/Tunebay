import puppeteer from "puppeteer";

const credentials = [
  /* your 20+ credentials here */
  { matric: "20240205220", token: "008894" },
  { matric: "20240205248", token: "759805" },
  { matric: "20240205200", token: "934108" },
  { matric: "20240205034", token: "734694" },
  { matric: "20240205295", token: "071533" },
  { matric: "20240205041", token: "360541" },
  { matric: "20240205122", token: "446543" },
  { matric: "20240205077", token: "613233" },
  { matric: "20240205040", token: "445334" },
  { matric: "20240205070", token: "012200" },


  { matric: "20240205150", token: "798903" },
  { matric: "20240205292", token: "72160" },
  { matric: "20240205156", token: "763090" },
  { matric: "20240205080", token: "141675" },
  { matric: "20240205083", token: "728387" },
  { matric: "20240205090", token: "763737" },
  { matric: "20240205110", token: "563043" },
  { matric: "20240205008", token: "252659" },
  { matric: "20240205072", token: "671441" },
  { matric: "20240205023", token: "748027" },
  { matric: "20240205063", token: "722937" },


  { matric: "20240205061", token: "840849" },
  { matric: "20240205079", token: "193745" },
  { matric: "20240205057", token: "619243" },
  { matric: "20240205051", token: "403760" },
  { matric: "20240205053", token: "829190" },
  { matric: "20240205048", token: "874471" },
  { matric: "20240205010", token: "169744" },
  { matric: "20240205071", token: "629935" },
  { matric: "20240205040", token: "445334" },
  { matric: "20240205183", token: "451643" },
  { matric: "20240205183", token: "094277" },


  { matric: "20240205273", token: "600365" },
  { matric: "20240205310", token: "174211" },
  { matric: "20240205016", token: "973020" },
  { matric: "20240205133", token: "722038" },
  { matric: "20240205089", token: "768723" },
  { matric: "20240205064", token: "824014" },
  { matric: "20240205150", token: "798903" },
  { matric: "20240205047", token: "668248" },
  { matric: "20240205164", token: "081747" },
  { matric: "20240205172", token: "701316" },


  { matric: "20240205172", token: "081645" },
  { matric: "20240205180", token: "380758" },
  { matric: "20240205275", token: "777933" },
  { matric: "20240205308", token: "804346" },
  { matric: "20240205181", token: "943804" },
  { matric: "20240205232", token: "623845" },
  { matric: "20240205079", token: "981074" },
  { matric: "20240205282", token: "593008" },
  { matric: "20240205225", token: "814074" },
  { matric: "20240205113", token: "448996" },
  { matric: "20240205059", token: "090745" },


  { matric: "20240205054", token: "346301" },
  { matric: "20240205167", token: "662861" },
  { matric: "20240205101", token: "294692" },
  { matric: "20240205078", token: "487677" },
  { matric: "20240205100", token: "352023" },
  { matric: "20240205249", token: "195663" },
  { matric: "20240205321", token: "266760" },
  { matric: "20240205145", token: "921134" },
  { matric: "20240205167", token: "662861" },
  { matric: "20240204270", token: "454551" },
  { matric: "20240205019", token: "776759" },


  { matric: "20240205021", token: "938144" },
  { matric: "20240205043", token: "232895" },
  { matric: "20240205128", token: "082937" },
  { matric: "20240205169", token: "982730" },
  { matric: "20240205235", token: "597996" },
  { matric: "20240205151", token: "058157" },
  { matric: "20240205245", token: "216682" },
  { matric: "20240205161", token: "609614" },
  { matric: "20240205239", token: "006467" },
  { matric: "20240205198", token: "507508" },
  { matric: "20240205085", token: "532537" },


  { matric: "20240205217", token: "909088" },
  { matric: "20240205281", token: "740803" },
  { matric: "20240205093", token: "686061" },
  { matric: "20240205044", token: "331042" },
  { matric: "20240205291", token: "838664" },
  { matric: "20240205132", token: "054063" },
  { matric: "20240205039", token: "752020" },
  { matric: "20240205208", token: "490775" },
  { matric: "20230403063", token: "509318" },
  { matric: "20230204320", token: "935947" },
  { matric: "20230403379", token: "155489" },


  { matric: "20230398096", token: "138827" },
  { matric: "20240411010", token: "495582" },
  { matric: "20240401308", token: "780139" },
  { matric: "20230302018", token: "191965" },
  { matric: "20230393116", token: "206384" },
  { matric: "2023039020", token: "499711" },

  // gpt added shiii


  { matric: "202303393072", token: "404986" },
  { matric: "20230499071", token: "383927" },
  { matric: "20230393126", token: "040890" },
  { matric: "20240305024", token: "825721" },
  { matric: "20230395087", token: "687439" },
  { matric: "20230398173", token: "666411" },
  { matric: "20230308056", token: "837424" },
  { matric: "20230307216", token: "490348" },
  { matric: "20230307011", token: "874518" },
  { matric: "20230307104", token: "735875" },
  { matric: "20230397011", token: "522817" },
  { matric: "20240305175", token: "223747" },
  { matric: "20230493021", token: "296199" },
  { matric: "20240307095", token: "298826" },
  { matric: "20230393012", token: "078067" },
  { matric: "20230308057", token: "336806" },
  { matric: "20230389122", token: "932178" },
  { matric: "20230377112", token: "564358" },
  { matric: "202303098088", token: "961589" },
  { matric: "20242039511", token: "653412" },
  { matric: "20240109148", token: "202896" },
  { matric: "20230308003", token: "719085" },
  { matric: "20230398048", token: "627743" },
  { matric: "20230308057", token: "336806" },
  { matric: "20230308098", token: "415460" },
  { matric: "20230103065", token: "969927" },
  { matric: "2023039311", token: "838834" },
  { matric: "2023039087", token: "687439" },
  { matric: "20230398173", token: "666411" },
  { matric: "20230308056", token: "837424" },
  { matric: "20230307216", token: "490348" },
  { matric: "20230307011", token: "874518" },
  { matric: "20230307104", token: "735875" },
  { matric: "20230397011", token: "522877" },
  { matric: "20240305175", token: "223747" },
  { matric: "20230493021", token: "296199" },
  { matric: "20230393012", token: "078067" },
  { matric: "20240307095", token: "298826" },
  { matric: "20230308057", token: "336806" },
  { matric: "20230308098", token: "415460" },
  { matric: "20230393155", token: "448020" },
  { matric: "20230393037", token: "603964" },
  { matric: "20230103118", token: "530261" },
  { matric: "20230397004", token: "799288" },
  { matric: "20230204427", token: "833979" },
  { matric: "20230393001", token: "810612" },
  { matric: "20230104011", token: "585460" },
  { matric: "20230103107", token: "706080" },
  { matric: "2023010371", token: "312484" },
  { matric: "20220502085", token: "100067" },
  { matric: "20220502098", token: "943410" },
  { matric: "20220502577", token: "889815" },
  { matric: "20220502523", token: "614826" },
  { matric: "20220502088", token: "237447" },
  { matric: "20220502590", token: "164481" },
  { matric: "20220502251", token: "496868" },
  { matric: "20230405193", token: "619252" },
  { matric: "20230104117", token: "270339" },
  { matric: "20230401099", token: "043092" },
  { matric: "20230401222", token: "326253" },
  { matric: "20230401145", token: "570677" },
  { matric: "20231040118", token: "118436" },
  { matric: "20230103076", token: "418116" },
  { matric: "20230104147", token: "806281" },
  { matric: "20230104239", token: "094024" },
  { matric: "20230104128", token: "000415" },
  { matric: "20230104072", token: "202528" },

  // end gpt added shiii
  { matric: "20230104011", token: "585460" },
  { matric: "20230104148", token: "68802" },
  { matric: "20230104099", token: "615461" },
  { matric: "20230104141", token: "683174" },
  { matric: "20230104239", token: "094024" },
  { matric: "20230104147", token: "694831" },
  { matric: "20230104194", token: "040137" },
  { matric: "20230104128", token: "000415" },
  { matric: "20230104072", token: "202528" },
  { matric: "20230104058", token: "133797" },
  { matric: "20230104150", token: "530818" },
  { matric: "20230103081", token: "607077" },
  { matric: "20230104196", token: "879888" },
  { matric: "20230104194", token: "040137" },
  { matric: "20230104056", token: "412861" },
  { matric: "20230104209", token: "608738" },
  { matric: "20230104025", token: "891642" },
  { matric: "20230104094", token: "662863" },
  { matric: "20230104039", token: "396396" },
  { matric: "20230104099", token: "615461" },
  { matric: "20230104089", token: "842049" },
  { matric: "20230104256", token: "651378" },
  { matric: "20230104243", token: "612463" },
  { matric: "20230104263", token: "490348" },
  { matric: "20230104199", token: "861429" },
  { matric: "20230104216", token: "004267" },
  { matric: "20230104210", token: "988566" },
  { matric: "20230103107", token: "706080" },
  { matric: "20230103067", token: "761909" },
  { matric: "20230103098", token: "814365" },
  { matric: "20230103185", token: "732440" },
  { matric: "20230103071", token: "312484" },
  { matric: "20230103117", token: "270339" },
  { matric: "20230103042", token: "461829" },
  { matric: "20230104008", token: "256056" },
  { matric: "20230104117", token: "270339" },
  { matric: "20230104138", token: "786016" },
  { matric: "20230104026", token: "869144" },
  { matric: "20230307104", token: "735875" },
  { matric: "20230104034", token: "874518" },
  { matric: "20230104200", token: "169836" },

  // new ones

  { matric: "20230401200", token: "308712" },
  { matric: "20230401037", token: "876386" },
  { matric: "20230104150", token: "530818" },
  { matric: "20230104194", token: "040137" },
  { matric: "20230104211", token: "186131" },
  { matric: "20330104194", token: "040137" },
  { matric: "20230105118", token: "334767" },
  { matric: "20230104200", token: "16983" },
  { matric: "20230103081", token: "607077" },
  { matric: "20230104198", token: "841239" },
  { matric: "20230307104", token: "735875" },
  { matric: "20230308056", token: "837424" },
  { matric: "20230398088", token: "961589" },
  { matric: "20230397173", token: "666411" },
  { matric: "20230308003", token: "719085" },
  { matric: "20230308035", token: "083711" },
  { matric: "20240397004", token: "249029" },
  { matric: "20240506019", token: "540181" },
  { matric: "20240506131", token: "798147" },
  { matric: "20240506013", token: "688052" },
  { matric: "20240506018", token: "997426" },
  { matric: "20240506030", token: "413435" },
  { matric: "20210302271", token: "132515" },
  { matric: "20210107320", token: "993898" },
  { matric: "20210393099", token: "069668" },
  { matric: "20220506029", token: "275518" },
  { matric: "20230103077", token: "597563" },
  { matric: "20220506014", token: "597563" },
  { matric: "20220302230", token: "211275" },
  { matric: "20240205295", token: "071533" },
  { matric: "20210404300", token: "238318" },
  { matric: "20210206015", token: "420280" },
  { matric: "20210206022", token: "366145" },
  { matric: "20210206131", token: "688348" },
  { matric: "20230393003", token: "45586" },
  { matric: "20230308079", token: "780406" },
  { matric: "20230308019", token: "14712" },
  { matric: "20230398197", token: "536147" },
  { matric: "20230308098", token: "415460" },
  { matric: "20230308090", token: "547915" },
  { matric: "20230398088", token: "961589" },
  { matric: "20230398114", token: "778805" },
  { matric: "20230308050", token: "484398" },
  { matric: "20230308090", token: "547915" },
  { matric: "20230398088", token: "961889" },
  { matric: "20230308098", token: "415460" },
  { matric: "20230104198", token: "841239" },
  { matric: "20230104092", token: "134797" },
  { matric: "20230104030", token: "222108" },
  { matric: "20230103118", token: "334767" },
  { matric: "20230104210", token: "988566" },
  { matric: "20230405195", token: "619252" },
  { matric: "20230307104", token: "735875" },
  { matric: "20230104035", token: "874518" },
  { matric: "20230104117", token: "270339" },
  { matric: "20230104008", token: "256056" },
  { matric: "20230104026", token: "869144" },
  { matric: "20240104085", token: "443184" },
  { matric: "20240104130", token: "885036" },
  { matric: "20240104140", token: "549358" },
  { matric: "20240104258", token: "046020" },
  { matric: "20240104154", token: "215003" },
  { matric: "20240104228", token: "632795" },
  { matric: "20240104106", token: "958400" },
  { matric: "20240104249", token: "692333" },
  { matric: "20240104274", token: "500358" },
  { matric: "20240104070", token: "361383" },
  { matric: "20240104021", token: "318243" },
  { matric: "20240104061", token: "318243" },
  { matric: "20240104270", token: "999504" },
  { matric: "20240104051", token: "475384" },
  { matric: "20230202106", token: "124778" },
  { matric: "20240104042", token: "380799" },
  { matric: "20240104076", token: "130186" },
  { matric: "20240104126", token: "963553" },
  { matric: "20240104004", token: "097656" },
  { matric: "20240104090", token: "969176" },
  { matric: "20240104066", token: "671095" },
  { matric: "20240204115", token: "263603" },
  { matric: "20240104030", token: "222108" },
  { matric: "20240104240", token: "712674" },
  { matric: "20240104135", token: "421533" },
  { matric: "20240104082", token: "899052" },
  { matric: "20240104108", token: "410146" },
  { matric: "20240104062", token: "196247" },
  { matric: "20240316026", token: "470711" },
  { matric: "20230104256", token: "651378" },
  { matric: "20230104243", token: "612463" },
  { matric: "20230104099", token: "615461" },
  { matric: "20230104209", token: "608738" },

];

const BATCH_SIZE = 10; // run 10 at a time
const LOGIN_URL = "https://evoting.tasued.edu.ng/login";
const VOTE_URL = "https://evoting.tasued.edu.ng/vote/?pid=SUG-PRO";

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function runAccountTask(browser, { matric, token }, opts = {}) {
  const { headless = false } = opts;
  const context = await browser.createBrowserContext({ incognito: true });
  const page = await context.newPage();

  // optional: set user agent or viewport if needed
  // await page.setUserAgent("...");

  try {
    // go to login
    await page.goto(LOGIN_URL, { waitForSelector: "domcontentloaded", timeout: 10000 }).catch(() => null);

    // fill credentials
    await page.type('input[name="username"]', matric, { delay: 20 });
    await page.type('input[name="password"]', token, { delay: 20 });

    // click login
    await Promise.all([
      page.click('button[name="login"]'),
      // wait for some post-login element — change to something reliable on your site
      page.waitForSelector(".page-wrapper", { timeout: 5000 }).catch(() => null)
    ]);

    console.log(`[${matric}] logged in (or selector missing but proceeding)`);

    // navigate to vote page
    await page.goto(VOTE_URL, { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    console.log(`[${matric}] on vote page`);

     // Wait until all candidate cards load
        await page.waitForSelector(".el-card-avatar.el-overlay-1", { visible: true, timeout: 0 });

        // Select the first candidate avatar
        const firstCandidate = (await page.$$(".el-card-avatar.el-overlay-1"))[0];

        if (firstCandidate) {
          // Hover to reveal button
          await firstCandidate.hover();

          // Find the vote button inside the first candidate card
          const voteBtn = await firstCandidate.$(".btn.btn-info[type='submit']");
          if (voteBtn) {
            await voteBtn.click();
            console.log(`Voted for the first candidate!`);
          }
        } else {
          console.log("No candidate found.");
        }



    // optionally wait for confirmation message/alert that vote succeeded
    await page.waitForSelector(".vote-success, .alert-success", { timeout: 3000 }).catch(() => null);

    console.log(`[${matric}] vote submitted`);
    return { matric, success: true };
  } catch (err) {
    console.error(`[${matric}] error: ${err.message}`);
    return { matric, success: false, error: err.message };
  } finally {
    // close context to free memory immediately after this account finishes
    try {
      await context.close();
      console.log(`[${matric}] context closed`);
    } catch (e) {
      console.warn(`[${matric}] failed to close context: ${e.message}`);
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    // you can set args here if you want to reduce memory, e.g. --disable-dev-shm-usage
  });

  const chunks = chunkArray(credentials, BATCH_SIZE);

  for (let i = 0; i < chunks.length; i++) {
    const batch = chunks[i];
    console.log(`Starting batch ${i + 1}/${chunks.length} — ${batch.length} accounts`);

    // start tasks in parallel for this batch
    const tasks = batch.map((creds) => runAccountTask(browser, creds));

    // wait for all to finish (settled) before starting next batch
    const results = await Promise.allSettled(tasks);

    // summary for this batch
    const summary = results.map((r) => (r.status === "fulfilled" ? r.value : { success: false }));
    const succeeded = summary.filter((s) => s.success).length;
    const failed = summary.length - succeeded;
    console.log(`Batch ${i + 1} finished — succeeded: ${succeeded}, failed: ${failed}`);

    // optional: short pause between batches to let browser stabilize
    await new Promise((res) => setTimeout(res, 1500));
  }

  console.log("All batches finished.");
  // keep browser open for debugging, or close it:
  // await browser.close();
})();
