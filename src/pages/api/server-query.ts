import type { APIRoute } from "astro";

import mc from "minecraftstatuspinger";
import { MC_HOST, MC_PORT, MC_PROTOCOL_VERSION } from "astro:env/server";

function createJSONResponse({
	json,
	options,
	status,
}: {
	json: Record<any, any>;
	options?: ResponseInit;
	status: number;
}) {
	const jsonString = JSON.stringify({ ...json, status: status });
	const blob = new Blob([jsonString], { type: "application/json" });

	let newOptions: ResponseInit = {};
	switch (status) {
		case 500:
			newOptions.statusText = "Something went wrong internally";
	}

	newOptions = { ...newOptions, status: status, ...options };

	return new Response(blob, newOptions);
}

export const GET = (async () => {
	let result;

	try {
		result = await mc.lookup({
			host: MC_HOST,
			port: MC_PORT,
			protocolVersion: MC_PROTOCOL_VERSION,
			timeout: 10000,
			ping: true,
		});
	} catch (err) {
		if (
			!err ||
			typeof err !== "object" ||
			!("code" in err) ||
			typeof err.code !== "string"
		) {
			return createJSONResponse({
				status: 500,
				json: {
					errorRaw: JSON.stringify(err),
					message: "Something wrong happened, and we can't identify it.",
				},
			});
		}

		if (err.code === "ECONNREFUSED") {
			return createJSONResponse({
				status: 500,
				json: {
					errorRaw: JSON.stringify(err),
					message: "Server not reachable (code: ECONNREFUSED)",
				},
			});
		}

		return createJSONResponse({
			status: 500,
			json: {
				errorRaw: JSON.stringify(err),
				message: `Something wrong happened, and we haven't handled its error type: ${err.code}`,
			},
		});
	}

	const jsonString = JSON.stringify(result);
	const blob = new Blob([jsonString], { type: "application/json" });

	const options = { status: 200, statusText: "Got Revolver server query!" };
	const response = new Response(blob, options);

	return response;
}) satisfies APIRoute;
