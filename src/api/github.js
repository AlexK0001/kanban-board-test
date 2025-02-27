// const GITHUB_API_URL = "https://api.github.com/repos/AlexK0001/kanban-board-test/issues";
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Токен з .env

export async function fetchIssues(repoUrl) {
  try {
    const repoPath = getRepoPath(repoUrl);
    const response = await fetch(`https://api.github.com/repos/${repoPath}/issues`, {
      headers: TOKEN ? { Authorization: `token ${TOKEN}` } : {},
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
}

export async function updateIssue(repoUrl, issueNumber, newState, newLabels, assignee = null) {
  try {
    const repoPath = getRepoPath(repoUrl);
    const response = await fetch(`https://api.github.com/repos/${repoPath}/issues/${issueNumber}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: newState,
        labels: newLabels,
        assignees: assignee ? [assignee] : [],
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating issue:", error);
  }
}

export async function fetchRepoInfo(repoUrl) {
  try {
    const repoPath = getRepoPath(repoUrl);
    const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
      headers: TOKEN ? { Authorization: `token ${TOKEN}` } : {},
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching repo info:", error);
    return null;
  }
}

function getRepoPath(repoUrl) {
  return repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
}
