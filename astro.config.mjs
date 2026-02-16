// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vercelAdapter from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			MC_HOST: envField.string({
				context: "server",
				access: "secret",
			}),
			MC_PORT: envField.number({
				context: "server",
				access: "secret",
				default: 25565,
			}),
			MC_PROTOCOL_VERSION: envField.number({
				context: "server",
				access: "secret",
			}),
		},
	},
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
