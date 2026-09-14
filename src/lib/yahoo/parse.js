/** Merge Yahoo's array-of-objects team/player blobs into one object. */
export function mergeYahooObjects(items) {
  if (!Array.isArray(items)) {
    return items ?? {};
  }

  return items.reduce((acc, item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return { ...acc, ...item };
    }
    return acc;
  }, {});
}

function collectionToArray(collection, key) {
  if (!collection || typeof collection.count !== "number") {
    return [];
  }

  const items = [];
  for (let i = 0; i < collection.count; i++) {
    const entry = collection[i]?.[key];
    if (entry !== undefined) {
      items.push(entry);
    }
  }
  return items;
}

export function parseTeam(teamArray) {
  const team = mergeYahooObjects(teamArray);

  if (Array.isArray(team.team_logos)) {
    team.team_logos = team.team_logos.map((logo) => logo.team_logo);
  } else {
    team.team_logos = [];
  }

  if (Array.isArray(team.managers)) {
    team.managers = team.managers.map((manager) => manager.manager);
  } else {
    team.managers = [];
  }

  return team;
}

export function parsePlayers(playersCollection) {
  const raw = collectionToArray(playersCollection, "player");
  return raw.map((player) => {
    const base = Array.isArray(player) ? player[0] : player;
    const parsed = mergeYahooObjects(base);

    if (Array.isArray(player) && player[1]) {
      Object.assign(parsed, mergeYahooObjects(player.slice(1)));
    }

    if (Array.isArray(parsed.eligible_positions)) {
      parsed.eligible_positions = parsed.eligible_positions.map(
        (p) => p.position,
      );
    }

    if (Array.isArray(parsed.selected_position)) {
      parsed.selected_position = mergeYahooObjects(parsed.selected_position);
    }

    return parsed;
  });
}

export function parseGames(gamesCollection) {
  return collectionToArray(gamesCollection, "game").map((game) =>
    Array.isArray(game) ? game[0] : game,
  );
}

export function parseUserLeagues(gamesCollection) {
  const games = [];

  for (let i = 0; i < (gamesCollection?.count ?? 0); i++) {
    const gameEntry = gamesCollection[i].game;
    const game = gameEntry[0];
    const leaguesCollection = gameEntry[1]?.leagues;
    const leagues = collectionToArray(leaguesCollection, "league").map(
      (league) => (Array.isArray(league) ? league[0] : league),
    );
    games.push({ ...game, leagues });
  }

  return games;
}

export function parseTeams(teamsCollection) {
  return collectionToArray(teamsCollection, "team").map((team) =>
    parseTeam(Array.isArray(team) ? team[0] : team),
  );
}

export function parseStandings(teamsCollection) {
  const teams = [];

  for (let i = 0; i < (teamsCollection?.count ?? 0); i++) {
    const teamEntry = teamsCollection[i].team;
    const team = parseTeam(teamEntry[0]);
    team.standings = teamEntry[2]?.team_standings ?? null;
    teams.push(team);
  }

  return teams;
}

export function parseSettings(settings) {
  const next = { ...settings };

  if (next.stat_categories?.stats) {
    next.stat_categories = next.stat_categories.stats.map((s) => {
      const stat = { ...s.stat };
      if (Array.isArray(stat.stat_position_types)) {
        stat.stat_position_types = stat.stat_position_types.map(
          (pt) => pt.stat_position_type,
        );
      }
      return stat;
    });
  }

  if (Array.isArray(next.roster_positions)) {
    next.roster_positions = next.roster_positions.map((p) => p.roster_position);
  }

  return next;
}

export function parseDraft(draftResults) {
  return collectionToArray(draftResults, "draft_result");
}

export function parseRoster(rosterNode) {
  const players = rosterNode?.[0]?.players ?? rosterNode?.players;
  return parsePlayers(players);
}
