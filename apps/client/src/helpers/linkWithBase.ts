export const linkWithBase = (path: string): string => {
  const base = import.meta.env.BASE_URL || "/";

  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const cleanBase = base.replace(/^\/+|\/+$/g, "");

  const joined = cleanBase ? `${cleanBase}/${cleanPath}` : cleanPath;

  return "/" + joined.replace(/\/+/g, "/");
};
