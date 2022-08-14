export type Direction = keyof typeof Direction;

export const Direction = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 },
};

export type Fruit = Point;

export type Game = Readonly<{
	state: 'playing' | 'lost';
	size: number;
	score: number;
	fruit: Fruit | null;
	snake: Snake;
	currDirection: Direction;
	nextDirection: Direction | null;
}>;

export type Point = Readonly<{
	x: number;
	y: number;
}>;

export type Snake = Point[];
