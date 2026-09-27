"use server";

export async function getBoxScore(id) {
  const res = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${id}/boxscore`,
  );

  if (!res.ok) throw new Error("Error fetching boxscores");
  return res.json();
}
