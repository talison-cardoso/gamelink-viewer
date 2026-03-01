import { MIRROR_RULES } from "./constants";

export const detectMirror = (url: string) => {
  const rule = MIRROR_RULES.find((r) => r.pattern.test(url));
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = "";
  }

  if (rule) {
    return { ...rule, domain };
  }

  // Fallback: try to extract a name from domain
  const name = domain ? domain.split(".").slice(-2, -1)[0] : "Link";
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    color: "badge-ghost",
    domain,
  };
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const formatDate = (dateStr: string, lang: string) => {
  try {
    return new Date(dateStr).toLocaleDateString(lang, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const getContrastColor = (hexcolor: string) => {
  // If no color, default to white text
  if (!hexcolor) return "white";

  // Remove # if present
  const hex = hexcolor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white based on luminance
  return yiq >= 128 ? "black" : "white";
};
