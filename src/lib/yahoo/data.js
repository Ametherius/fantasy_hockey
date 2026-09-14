import "server-only";

import { yahooGet } from "./api";
import { YahooConfigError } from "./errors";
import {
  parseDraft,
  parseGames,
  parseRoster,
  parseSettings,
  parseStandings,
  parseTeam,
  parseTeams,
  parseUserLeagues,
} from "./parse";

export { YahooConfigError, YahooNotConnectedError } from "./errors";

export function getConfiguredLeagueKey(overrideKey) {
  const leagueKey = overrideKey || process.env.YAHOO_LEAGUE_KEY;
  if (!leagueKey) {
    throw new YahooConfigError(
      "Missing league key. Set YAHOO_LEAGUE_KEY or pass ?league_key=",
    );
  }
  return leagueKey;
}

/** Games + leagues for the connected Yahoo user (find YAHOO_LEAGUE_KEY here). */
export async function getUserLeagues() {
  const gamesPayload = await yahooGet("/users;use_login=1/games");
  const user = gamesPayload.fantasy_content.users[0].user[0];
  const games = parseGames(gamesPayload.fantasy_content.users[0].user[1].games);
  const gameKeys = games.map((game) => game.game_key).filter(Boolean);

  if (!gameKeys.length) {
    return { user, games: [] };
  }

  const leaguesPayload = await yahooGet(
    `/users;use_login=1/games;game_keys=${gameKeys.join(",")}/leagues`,
  );

  return {
    user: leaguesPayload.fantasy_content.users[0].user[0],
    games: parseUserLeagues(
      leaguesPayload.fantasy_content.users[0].user[1].games,
    ),
  };
}

/** League settings (scoring, roster positions, draft type, etc.). */
export async function getLeagueSettings(leagueKey) {
  const key = getConfiguredLeagueKey(leagueKey);
  const payload = await yahooGet(`/league/${key}/settings`);
  const league = payload.fantasy_content.league[0];
  const settings = parseSettings(
    payload.fantasy_content.league[1].settings[0],
  );
  return { ...league, settings };
}

/** League standings. */
export async function getLeagueStandings(leagueKey) {
  const key = getConfiguredLeagueKey(leagueKey);
  const payload = await yahooGet(`/league/${key}/standings`);
  const league = payload.fantasy_content.league[0];
  const standings = parseStandings(
    payload.fantasy_content.league[1].standings[0].teams,
  );
  return { ...league, standings };
}

/** Full league draft results. */
export async function getLeagueDraft(leagueKey) {
  const key = getConfiguredLeagueKey(leagueKey);
  const payload = await yahooGet(`/league/${key}/draftresults`);
  const league = payload.fantasy_content.league[0];
  const draft_results = parseDraft(
    payload.fantasy_content.league[1].draft_results,
  );
  return { ...league, draft_results };
}

/** Teams in the league. */
export async function getLeagueTeams(leagueKey) {
  const key = getConfiguredLeagueKey(leagueKey);
  const payload = await yahooGet(`/league/${key}/teams`);
  const league = payload.fantasy_content.league[0];
  const teams = parseTeams(payload.fantasy_content.league[1].teams);
  return { ...league, teams };
}

/** Roster for one team. Optional week number or YYYY-MM-DD as `when`. */
export async function getTeamRoster(teamKey, when) {
  if (!teamKey) {
    throw new YahooConfigError("Missing team_key");
  }

  let path = `/team/${teamKey}/roster`;
  if (when) {
    path += String(when).includes("-") ? `;date=${when}` : `;week=${when}`;
  }

  const payload = await yahooGet(path);
  const teamNode = payload.fantasy_content.team[0];
  const roster = parseRoster(payload.fantasy_content.team[1].roster);

  return {
    ...parseTeam(Array.isArray(teamNode) ? teamNode : [teamNode]),
    roster,
  };
}

/** Rosters for every team in the league. */
export async function getLeagueRosters(leagueKey, when) {
  const teamsPayload = await getLeagueTeams(leagueKey);
  const teams = teamsPayload.teams || [];

  const rosters = await Promise.all(
    teams.map(async (team) => {
      const rosterPayload = await getTeamRoster(team.team_key, when);
      return {
        team_key: team.team_key,
        name: team.name,
        managers: team.managers,
        roster: rosterPayload.roster,
      };
    }),
  );

  return {
    league_key: getConfiguredLeagueKey(leagueKey),
    league: {
      league_key: teamsPayload.league_key,
      name: teamsPayload.name,
      num_teams: teamsPayload.num_teams,
    },
    teams,
    rosters,
  };
}

/** Bundle: settings + standings + draft + teams (no rosters). */
export async function getLeagueOverview(leagueKey) {
  const key = getConfiguredLeagueKey(leagueKey);
  const [settings, standings, draft, teams] = await Promise.all([
    getLeagueSettings(key),
    getLeagueStandings(key),
    getLeagueDraft(key),
    getLeagueTeams(key),
  ]);

  return { league_key: key, settings, standings, draft, teams };
}
