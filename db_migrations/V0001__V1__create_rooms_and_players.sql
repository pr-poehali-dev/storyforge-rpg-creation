
CREATE TABLE IF NOT EXISTS t_p12981526_storyforge_rpg_creat.rooms (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  genre       TEXT NOT NULL,
  description TEXT NOT NULL,
  story_intro TEXT NOT NULL,
  max_players INT NOT NULL DEFAULT 6,
  status      TEXT NOT NULL DEFAULT 'open',
  creator     TEXT NOT NULL DEFAULT 'Аноним',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p12981526_storyforge_rpg_creat.room_players (
  id           SERIAL PRIMARY KEY,
  room_id      INT NOT NULL REFERENCES t_p12981526_storyforge_rpg_creat.rooms(id),
  player_name  TEXT NOT NULL,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_status ON t_p12981526_storyforge_rpg_creat.rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_players_room_id ON t_p12981526_storyforge_rpg_creat.room_players(room_id);
