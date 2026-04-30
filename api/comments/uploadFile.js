import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disables Next.js's default body parser
  },
};

function getGitHubAuthToken() {
  return (
    process.env.GITHUB_TOKEN?.trim() ||
    process.env.GITHUB_PAT?.trim() ||
    process.env.GH_TOKEN?.trim() ||
    process.env.GITHUB_ACCESS_TOKEN?.trim() ||
    ""
  );
}

export default async function handler(req, res) {

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing form data" });
    }

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    const uploadedFileName = Array.isArray(fields.fileName) ? fields.fileName[0] : fields.fileName;
    const artistName = Array.isArray(fields.artistName) ? fields.artistName[0] : fields.artistName;

    if (!uploadedFile || !uploadedFileName) {
      return res.status(400).json({ message: "Missing file or fileName" });
    }
    console.log("Uploading file:", uploadedFileName);
    try {
      const { type } = req.query;

      if (type === "music") {
        const fileBuffer = await fs.promises.readFile(uploadedFile.filepath);

        // Reject files smaller than 1MB (1048576 bytes)
        if (fileBuffer.length < 1048576) {
          return res.status(400).json({ message: "File too small. Minimum size is 1MB." });
        }

        const fileContent = fileBuffer.toString("base64");

        // GitHub upload code continues here...

        const { Octokit } = await import("@octokit/rest");
        const githubToken = getGitHubAuthToken();
        if (!githubToken) {
          return res.status(500).json({
            message:
              "GitHub upload is not configured. Set GITHUB_TOKEN (or GITHUB_PAT / GH_TOKEN / GITHUB_ACCESS_TOKEN) with write access.",
          });
        }

        // Initialize Octokit with GitHub token
        const octokit = new Octokit({
          auth: githubToken,
        });

        const owner = "CodeNova5";
        const repo = "Music-Backend";
        const path = `public/music/${artistName}/${uploadedFileName}`;

        let sha;
        try {
          const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
          sha = data.sha;
        } catch (error) {
          console.log("File does not exist and will be created.");
        }

        const commitMessage = sha ? "Update file" : "Add new file";

        let response;
        try {
          response = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: commitMessage,
            content: fileContent,
            sha,
          });
        } catch (githubError) {
          if (githubError.status === 401) {
            return res.status(401).json({
              message:
                "GitHub rejected the upload token. Verify the token value and ensure it has Contents: Read and write permission for CodeNova5/Music-Backend.",
            });
          }
          throw githubError;
        }

        return res.status(200).json({
          message: "File uploaded successfully",
          data: response.data,
          path: `https://raw.githubusercontent.com/CodeNova5/Music-Backend/main/public/music/${artistName}/${uploadedFileName}`,
        });
      }
      if (type === "commentFile") {
        const fileBuffer = await fs.promises.readFile(uploadedFile.filepath);

        // Reject files smaller than 1MB (1048576 bytes)
        if (fileBuffer.length < 1048576) {
          return res.status(400).json({ message: "File too small. Minimum size is 1MB." });
        }

        const fileContent = fileBuffer.toString("base64");

        // GitHub upload code continues here...

        const { Octokit } = await import("@octokit/rest");
        const githubToken = getGitHubAuthToken();
        if (!githubToken) {
          return res.status(500).json({
            message:
              "GitHub upload is not configured. Set GITHUB_TOKEN (or GITHUB_PAT / GH_TOKEN / GITHUB_ACCESS_TOKEN) with write access.",
          });
        }

        // Initialize Octokit with GitHub token
        const octokit = new Octokit({
          auth: githubToken,
        });

        const owner = "CodeNova5";
        const repo = "Music-Backend";
        const path = `public/comment/${uploadedFileName}`;

        let sha;
        try {
          const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
          sha = data.sha;
        } catch (error) {
          console.log("File does not exist and will be created.");
        }

        const commitMessage = sha ? "Update file" : "Add new file";

        let response;
        try {
          response = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: commitMessage,
            content: fileContent,
            sha,
          });
        } catch (githubError) {
          if (githubError.status === 401) {
            return res.status(401).json({
              message:
                "GitHub rejected the upload token. Verify the token value and ensure it has Contents: Read and write permission for CodeNova5/Music-Backend.",
            });
          }
          throw githubError;
        }

        return res.status(200).json({
          message: "File uploaded successfully",
          data: response.data,
          path: `https://raw.githubusercontent.com/CodeNova5/Music-Backend/main/public/comment/${uploadedFileName}`,
        });
      }
    }
    catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ message: error.message });
    }
  });
}
