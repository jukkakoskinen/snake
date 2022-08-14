<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Game } from '$lib/game';
	import { View } from '$lib/view';

	let game = Game.create(24);
	let prevDelta = 0;

	$: view = View.create(game);

	onMount(tick);

	function handleKeyDown(event: KeyboardEvent): void {
		if (event.key === 'w') {
			game = Game.turn(game, 'UP');
		} else if (event.key === 'a') {
			game = Game.turn(game, 'LEFT');
		} else if (event.key === 's') {
			game = Game.turn(game, 'DOWN');
		} else if (event.key === 'd') {
			game = Game.turn(game, 'RIGHT');
		}
	}

	function reset(): void {
		game = Game.create(game.size);
	}

	function tick(delta = 0): void {
		requestAnimationFrame(tick);
		if (Math.floor(delta - prevDelta) < 1000 / 24) {
			return;
		}
		game = Game.tick(game);
		prevDelta = delta;
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<svelte:head>
	<title>Snake</title>
</svelte:head>

<div class="bg-black font-mono min-h-screen text-white">
	<div class="mx-auto max-w-xl p-4 md:p-12">
		<h1 class="mb-2 text-xl">Snake</h1>
		<p class="mb-6 text-neutral-400">
			"Snake is a video game genre where the player maneuvers a growing line that becomes a primary
			obstacle to itself."
			<span class="text-white"
				>—&nbsp;<a
					class="underline"
					href="https://en.wikipedia.org/wiki/Snake_(video_game_genre)"
					rel="noreferrer noopener"
					target="_blank">Wikipedia</a
				></span
			>
		</p>
		<div class="flex mb-2">
			<div class="text-neutral-400">Movement: W/A/S/D</div>
			<div class="ml-auto">
				Score:
				{#key game.score}
					<span class="inline-block" in:fly={{ y: 20 }}>{game.score}</span>
				{/key}
			</div>
		</div>
		<div class="border border-neutral-400 divide-neutral-800 divide-y flex flex-col mb-4 relative">
			{#each view as row}
				<div class="divide-neutral-800 divide-x flex">
					{#each row as cell}
						<div
							class="aspect-square flex-1"
							class:bg-green-400={cell === 'head'}
							class:bg-green-600={cell === 'tail'}
							class:bg-yellow-400={cell === 'fruit'}
						/>
					{/each}
				</div>
			{/each}
			{#if game.state === 'lost'}
				<div class="absolute flex inset-0 items-center justify-center" transition:fade>
					<div class="absolute bg-black inset-0 opacity-50" />
					<button
						class="bg-black inline-flex border border-red-400 font-bold mb-4 px-4 py-2 relative text-center text-red-400"
						on:click={reset}>Game over! Try again?</button
					>
				</div>
			{/if}
		</div>
		<div class="text-neutral-400 text-sm md:fixed md:bottom-4 md:right-4">
			Made by <a class="text-white underline" href="https://www.jukkakoskinen.fi">Jukka Koskinen</a>
		</div>
	</div>
</div>
