import axios from "axios";

export const getGithubStats = async (username: string) => {
// no need for headers, works just fine without it 

//   const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const BASE_URL = "https://api.github.com/users";
  const url = `${BASE_URL}/${username}`;
//   const headers = {
//     Authorization: `Bearer ${GITHUB_TOKEN}`,
//     Accept: "application/vnd.github.v3+json",
//   };
  try {
    const response = await axios.get(url);
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
