import { JwtPayload } from "./api";

function decodeBase64Url(input: string) {
	const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(
		normalized.length + ((4 - (normalized.length % 4)) % 4),
		"=",
	);

	if (typeof Buffer !== "undefined") {
		return Buffer.from(padded, "base64").toString("utf8");
	}

	if (typeof atob === "function") {
		const binString = atob(padded);

		// Tratamento para garantir que caracteres UTF-8 não quebrem
		const bytes = new Uint8Array(binString.length);
		for (let i = 0; i < binString.length; i++) {
			bytes[i] = binString.charCodeAt(i);
		}

		return new TextDecoder().decode(bytes);
	}

	throw new Error("Base64 decodificador não disponível.");
}

export function decodeJwt(token: string): JwtPayload | null {
	try {
		const payloadPart = token.split(".")[1];

		if (!payloadPart) {
			return null;
		}

		const decodedPayload = decodeBase64Url(payloadPart);

		return JSON.parse(decodedPayload) as JwtPayload;
	} catch {
		return null;
	}
}