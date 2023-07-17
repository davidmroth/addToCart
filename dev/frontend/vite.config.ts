import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';
import svg from '@poppanator/sveltekit-svg'
import sveltePreprocess from 'svelte-preprocess';

const config: UserConfig = {
	plugins: [
		sveltekit({preprocess: sveltePreprocess()}),
		svg(),
	],
	resolve: {
		alias: {
		  $config: path.resolve('src/config/')
		}
	  }
};

export default config;
