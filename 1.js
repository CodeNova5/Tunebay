import puppeteer from "puppeteer";

const credentials = [
{ matric: "20220307021", token: "438408"},
{ matric: "20220397021", token: "965273"},
{ matric: "20220307006", token: "109812"},
{ matric: "20220307061", token: "766447"},
{ matric: "20220307010", token: "882888"},
{ matric: "20230307066", token: "708479"},
{ matric: "20230367073", token: "527162"},
{ matric: "20220307044", token: "928347"},
{ matric: "20220391001", token: "785660"},


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
            page.waitForSelector(".page-wrapper", { timeout: 0 }).catch(() => null)
        ]);

        console.log(`[${matric}] logged in (or selector missing but proceeding)`);

        // navigate to vote page
        await page.goto(VOTE_URL, { waitUntil: "domcontentloaded", timeout: 0 }).catch(() => null);
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
