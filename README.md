# Toy Dice Game

This is a small dice game, no database.

A game is created when the server boots up. Just POST a turn for each player with `player_id` and `locked`:

POST /game/10

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