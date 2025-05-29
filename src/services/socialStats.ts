import axios from "axios";

export const getGithubStats = async (username: string) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const BASE_URL = "https://api.github.com/users";
  const url = `${BASE_URL}/${username}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-README-Generator',
    ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
  };
  try {
    const response = await axios.get(url, { headers });
    const {
      followers,
      public_repos,
      public_gists,
      following,
      avatar_url,
      bio,
      name,
    } = response.data;
    const stats = {
      followers,
      public_repos,
      public_gists,
      following,
      avatar_url,
      bio,
      name,
    };
    return stats;
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    throw new Error("Failed to fetch GitHub stats");
  }
};

export const getRepositoryStats = async (owner: string, repo: string) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const BASE_URL = "https://api.github.com/repos";
  const url = `${BASE_URL}/${owner}/${repo}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-README-Generator',
    ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
  };
  
  try {
    const response = await axios.get(url, { headers });
    const {
      stargazers_count,
      forks_count,
      watchers_count,
      open_issues_count,
      subscribers_count
    } = response.data;
    
    return {
      stars: stargazers_count,
      forks: forks_count,
      watchers: watchers_count,
      issues: open_issues_count,
      subscribers: subscribers_count,
    };
  } catch (error) {
    console.error("Error fetching repository stats:", error);
    throw new Error("Failed to fetch repository stats");
  }
};

// Get weekly star count for a repository
export const getWeeklyStarCount = async (owner: string, repo: string) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const BASE_URL = "https://api.github.com/repos";
  const url = `${BASE_URL}/${owner}/${repo}/stargazers`;
  const baseHeaders = {
    'Accept': 'application/vnd.github.v3.star+json',
    'User-Agent': 'GitHub-README-Generator'
  };
  const headers = {
    ...baseHeaders,
    ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
  };
  
  try {
    const response = await axios.get(url, { headers });
    
    // Calculate stars in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyStars = response.data.filter((star: any) => {
      const starDate = new Date(star.starred_at);
      return starDate >= oneWeekAgo;
    }).length;
    
    return weeklyStars;
  } catch (error) {
    console.error("Error fetching weekly star count:", error);
    return 0; // Return 0 if there's an error, don't break the app
  }
};
