const router = require('express').Router();
const lodash = require('lodash');

const gameTemplate = {
   name: 'my game',
   status: 'PLAYING',
   players: 2,
   p1_ready: false,
   p2_ready: false,
   p1_score: 0,
   p2_score: 0,
   turn: 0,
   turns: []
}
const games = [];

// GET all games
router.get('/', (req, res) => res.send(games));

// POST a new game
router.post('/new', (req, res) => {
   res.send(createNewGame());
});

// POST a new turn
router.post('/turn/:gameId', (req, res) => {
   // {playerId: "p1", lock: ['d1', 'd3']}
   const game = games.find(g => String(g.id) === String(req.params.gameId));
   if (!game) {
      res.sendStatus(400);
      return;
   }

   // Grab the current turn and the id of which player is playing
   const currentTurn = game.turns[game.turn];
   const { playerId } = req.body;

   // For each requested lock die, mark it as locked
   for (const diceId of req.body.lock) {
      currentTurn[`${playerId}_${diceId}`].locked = true;
   }
   // Set this player as having taken a turn
   game[`${playerId}_ready`] = true;

   // Check for end of turn: if both players have taken their turn:
   //   - Copy old turn into new turn
   //   - Roll all unlocked dice
   //   - Advance turn counter, reset players to not played
   if (game.p1_ready && game.p2_ready) {
      // advance to the next turn
      game.p1_ready = false;
      game.p2_ready = false;

      // Re-roll all unlocked dice
      const nextTurn = lodash.cloneDeep(currentTurn);
      for (const playerId of ['p1', 'p2']) {
         for (const diceId of ['d1', 'd2', 'd3', 'd4', 'd5']) {
            const thisDie = nextTurn[`${playerId}_${diceId}`];
            if (!thisDie.locked) {
               thisDie.value = Math.ceil(Math.random() * 5);
            }
         }
      }
      game.turn += 1;
      game.turns.push(nextTurn);

      // Check for end game condition: if we've hit our turn limit
      // update game status, score the game
      if (game.turn === 2) {
         const scoreGame = (game, player) => ['d1', 'd2', 'd3', 'd4', 'd5'].reduce((sum, diceId) => sum + game.turns[game.turn][`${player}_${diceId}`].value === 1 ? 5 : 0, 0)
         game.status = 'FINISHED'
         game.p1_score = scoreGame(game, 'p1');
         game.p2_score = scoreGame(game, 'p2');
      }
   }
   res.send(game);
});

const newDice = () => (
   {
      locked: false,
      value: Math.ceil(Math.random() * 6)
   }
)

const newTurn = () => (
   {
      p1_d1: newDice(),
      p1_d2: newDice(),
      p1_d3: newDice(),
      p1_d4: newDice(),
      p1_d5: newDice(),
      p2_d1: newDice(),
      p2_d2: newDice(),
      p2_d3: newDice(),
      p2_d4: newDice(),
      p2_d5: newDice(),
   }
)

function createNewGame() {
   const newGame = {
      ...gameTemplate,
      turns: [newTurn()],
      id: Math.floor(Math.random() * 100),
   };
   games.push(newGame);
   return newGame;
}

// seed with a random game to start
createNewGame();

module.exports = router;