export function getInitialFromName(name) {
	if (!name || typeof name !== "string") return "?";
	return name.trim().charAt(0).toUpperCase();
}
