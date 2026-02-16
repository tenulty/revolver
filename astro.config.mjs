// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vercelAdapter from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	adapter: vercelAdapter({
		imageService: true,
		webAnalytics: {
			enabled: true,
		},
	}),
	vite: {
		plugins: [tailwindcss()],
	},
});
