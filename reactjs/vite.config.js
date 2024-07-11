import path from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const appSelector = (target) => {
	const appList = {
		app: {
			root: 'src/app',
			outDir: path.resolve('..', 'nodejs', 'src', 'http', 'static', 'app'),
		},
		notfound: {
			root: 'src/notfound',
			outDir: path.resolve('..', 'nodejs', 'src', 'http', 'static-private', 'notfound'),
		},
	};
	return appList[target];
};

// const target = appSelector('notfound');
const target = appSelector('app');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	root: target.root,
	build: {
		outDir: target.outDir,
		root: './',
	}
});