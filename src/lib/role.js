export function normalizeRole(role) {
  if (typeof role !== "string") return "worker";

  const normalized = role.trim().toLowerCase();
  return normalized === "admin" || normalized === "buyer" ? normalized : "worker";
}
