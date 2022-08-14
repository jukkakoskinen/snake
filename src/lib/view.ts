import * as A from 'fp-ts/lib/Array';
import type * as t from '$lib/type';

export type CellState = 'empty' | 'fruit' | 'tail' | 'head';

export const View = {
	create,
};

function create(game: t.Game): CellState[][] {
	const posToIdx = ({ x, y }: t.Point): number => {
		return x + y * game.size;
	};

	const cells: CellState[] = A.makeBy(game.size * game.size, () => {
		return 'empty';
	});
	if (game.fruit !== null) {
		cells[posToIdx(game.fruit)] = 'fruit';
	}
	for (const [idx, pos] of game.snake.entries()) {
		cells[posToIdx(pos)] = idx ? 'tail' : 'head';
	}

	return A.chunksOf(game.size)(cells);
}
