import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";

// Read token from environment or argument
const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN || "";
if (!TOKEN) throw new Error("Missing GitHub Token");

async function pushToGithub() {
  const octokit = new Octokit({ auth: TOKEN });
  
  // 1. Get authenticated user
  const { data: user } = await octokit.rest.users.getAuthenticated();
  console.log("Authenticated as:", user.login);
  const userEmail = `${user.id}+${user.login}@users.noreply.github.com`;
  
  // 2. Create repo
  const repoName = "easytoys-final";
  let repoUrl = "";
  try {
    const res = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      private: false, // The user might want a private or public, we'll do public unless specified
      auto_init: false,
    });
    repoUrl = res.data.clone_url;
    console.log("Created generic repo:", repoUrl);
  } catch (err: any) {
    if (err.status === 422) { // Already exists
      console.log("Repo already exists, pushing to existing...");
      repoUrl = `https://github.com/${user.login}/${repoName}.git`;
    } else {
      console.error("Error creating repo:", err);
      return;
    }
  }

  // 3. isomorphic-git initialization
  const dir = process.cwd();
  
  await git.init({ fs, dir });
  console.log("Git init completed.");
  
  // Create / append to gitignore safely
  const gitignorePath = path.join(dir, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
     fs.writeFileSync(gitignorePath, "node_modules\ndist\n.env\n*.log\n");
  }

  console.log("Adding files...");
  async function walkAndAdd(currentDir: string) {
    const entries = fs.readdirSync(currentDir);
    for (const entry of entries) {
      if (['node_modules', 'dist', '.git', '.env'].includes(entry)) continue;
      const fullPath = path.join(currentDir, entry);
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');
      
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
         try {
             await walkAndAdd(fullPath);
         } catch(e) {}
      } else {
        try {
          await git.add({ fs, dir, filepath: relPath });
        } catch (e) {
          // ignore ignored files
        }
      }
    }
  }
  
  await walkAndAdd(dir);
  console.log("Files added.");

  await git.commit({
    fs,
    dir,
    author: {
      name: user.login,
      email: userEmail,
    },
    message: "Auto update of code"
  });
  console.log("Committed.");

  console.log("Pushing...");
  const pushUrl = repoUrl.replace("https://", `https://${TOKEN}@`);
  
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: pushUrl,
    force: true
  });
  
  await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'master',
    remoteRef: 'main',
    force: false
  }).catch(console.error);
  
  console.log("Pushed successfully to:", repoUrl);
}

pushToGithub().catch(console.error);
