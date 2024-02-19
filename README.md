# Toy Dice Game

This is a small dice game, no database.

A game is created when the server boots up. Just POST a turn for each player with `player_id` and `locked`:

GET /game/ to retrieve an array of games.
POST /game/ to make a new game

POST /game/10 to take a turn

```
{
   player_id: "p1",
   locked: ["d1", "d5"]
}
```

Then
```
{
   player_id: "p2",
   locked: ["d2"]
}
```

The game is over after 3 rounds and scored 5 points for every `1` rolled.