import axios from "axios";
import dns from "dns/promises";

const domain = "highlifeng.com"; // change this

// Map MX / CNAME patterns → Hosting Providers
const hostPatterns = [
  { pattern: /namecheap/i, provider: "Namecheap" },
  { pattern: /hostinger/i, provider: "Hostinger" },
  { pattern: /bluehost/i, provider: "Bluehost" },
  { pattern: /godaddy/i, provider: "GoDaddy" },
  { pattern: /ovh/i, provider: "OVH" },
  { pattern: /dreamhost/i, provider: "DreamHost" },
  { pattern: /inmotion/i, provider: "InMotion Hosting" },
  { pattern: /siteground/i, provider: "SiteGround" },
  { pattern: /digitalocean/i, provider: "DigitalOcean" },
  { pattern: /aws/i, provider: "Amazon Web Services (AWS)" },
  { pattern: /google/i, provider: "Google Cloud" },
  { pattern: /azure/i, provider: "Microsoft Azure" }
];

function detectHostFromRecords(records) {
  for (const rec of records) {
    const str = JSON.stringify(rec);
    for (const { pattern, provider } of hostPatterns) {
      if (pattern.test(str)) return provider;
    }
  }
  return "Unknown / Hidden (likely behind Cloudflare or cPanel hosting)";
}

async function inspectDomain(domain) {
  console.log(`\n🔎 Inspecting: ${domain}\n`);

  // 1. DNS A records
  try {
    const aRecords = await dns.resolve(domain, "A");
    console.log("A records:", aRecords);
  } catch {
    console.log("No direct A records found.");
  }

  // 2. Common subdomains
  const subdomains = ["www", "mail", "ftp", "cpanel", "webmail", "host"];
  for (const sub of subdomains) {
    const subdomain = `${sub}.${domain}`;
    try {
      const aRecords = await dns.resolve(subdomain, "A");
      console.log(`${subdomain} -> ${aRecords}`);
    } catch {}
  }

  // 3. MX records (mail servers)
  try {
    const mxRecords = await dns.resolve(domain, "MX");
    console.log("\nMX records:", mxRecords);

    const hostGuess = detectHostFromRecords(mxRecords);
    console.log("👉 Likely Hosting Provider (from MX):", hostGuess);
  } catch {
    console.log("\nNo MX records found.");
  }

  // 4. SSL Certificate Transparency
  try {
    const crtRes = await axios.get(`https://crt.sh/?q=${domain}&output=json`);
    const certs = crtRes.data.map((c) => c.name_value);
    const uniqueCerts = [...new Set(certs)];
    console.log("\nSSL cert domains found:");
    console.log(uniqueCerts.slice(0, 10));
  } catch {
    console.log("Couldn't fetch SSL cert transparency logs.");
  }
}

inspectDomain(domain);
