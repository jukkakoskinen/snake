import * as t from './type';

export const Game = {
	create,
	tick,
	turn,
};

function create(size: number): t.Game {
	return placeFruit({
		state: 'playing',
		size,
		score: 0,
		fruit: null,
		snake: [
			{ x: 3, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 1 },
		],
		currDirection: 'RIGHT',
		nextDirection: null,
	});
}

function tick(game: t.Game): t.Game {
	if (game.state !== 'playing') {
		return game;
	}
	const newGame = moveSnake(game);
	if (hitsSnake(game, newGame.snake[0])) {
		return { ...game, state: 'lost' };
	}
	if (hitsFruit(game, newGame.snake[0])) {
		return placeFruit(growSnake({ ...newGame, score: game.score + 1 }));
	}

	return newGame;
}

function turn(game: t.Game, direction: t.Direction): t.Game {
	if (!isValidTurn(game, direction)) {
		return game;
	}

	return { ...game, nextDirection: direction };
}

function addPoints(a: t.Point, b: t.Point): t.Point {
	return {
		x: a.x + b.x,
		y: a.y + b.y,
	};
}

function growSnake(game: t.Game): t.Game {
	return {
		...game,
		snake: [...game.snake, { ...game.snake[game.snake.length - 1] }],
	};
}

function hitsFruit(game: t.Game, point: t.Point): boolean {
	return game.fruit !== null && pointsEq(game.fruit, point);
}

function hitsSnake(game: t.Game, point: t.Point): boolean {
	return game.snake.some((part) => pointsEq(part, point));
}

function isValidTurn(game: t.Game, next: t.Direction): boolean {
	const { x, y } = addPoints(t.Direction[game.currDirection], t.Direction[next]);

	return x !== 0 || y !== 0;
}

function moveSnake(game: t.Game): t.Game {
	const movePart = (part: t.Point, idx: number): t.Point => {
		if (idx === 0) {
			const { x, y } = addPoints(part, t.Direction[game.currDirection]);

			return {
				x: (x + game.size) % game.size,
				y: (y + game.size) % game.size,
			};
		}

		return { ...game.snake[idx - 1] };
	};

	return {
		...game,
		snake: game.snake.map(movePart),
		currDirection: game.nextDirection || game.currDirection,
		nextDirection: null,
	};
}

function placeFruit(game: t.Game): t.Game {
	const newFruit = randomPoint(game);
	if (hitsSnake(game, newFruit)) {
		return placeFruit(game);
	}

	return { ...game, fruit: newFruit };
}

function pointsEq(a: t.Point, b: t.Point): boolean {
	return a.x === b.x && a.y === b.y;
}

function randomPoint(game: t.Game): t.Point {
	return {
		x: Math.floor(Math.random() * game.size),
		y: Math.floor(Math.random() * game.size),
	};
}
