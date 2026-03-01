import React from "react";
import { DownloadItem } from "../types";
import { detectMirror, formatDate, getContrastColor } from "../utils";
import { ExternalLink, Calendar, HardDrive, Share2 } from "lucide-react";
import { motion } from "motion/react";

interface GameCardProps {
  item: DownloadItem;
  lang: string;
}

export const GameCard: React.FC<GameCardProps> = ({ item, lang }) => {
  const hasManyLinks = item.uris.length >= 3;
  const textColor = getContrastColor(item.sourceColor);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="card bg-base-200 shadow-sm border border-base-300 hover:border-primary/30 transition-colors"
    >
      <div className="card-body p-4 gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="card-title text-sm font-bold line-clamp-2 leading-tight">
            {item.title}
          </h3>
          <div
            className="badge badge-sm whitespace-nowrap text-[10px] font-bold uppercase py-2"
            style={{
              backgroundColor: item.sourceColor,
              color: textColor,
              border: "none",
            }}
          >
            {item.sourceName}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-70">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(item.uploadDate, lang)}</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive size={12} />
            <span>{item.fileSize}</span>
          </div>
        </div>

        <div className="divider my-0 opacity-20"></div>

        <div
          className={`grid gap-2 ${hasManyLinks ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {item.uris.map((uri, idx) => {
            const mirror = detectMirror(uri);
            const isTorrent =
              uri.startsWith("magnet:") ||
              uri.endsWith(".torrent") ||
              mirror.name?.toLowerCase().includes("torrent");

            // Lógica de ícone: Se for torrent, usa qBittorrent, senão usa o favicon do domínio
            const faviconUrl = isTorrent
              ? "https://www.qbittorrent.org/favicon.ico"
              : mirror.domain
                ? `https://www.google.com/s2/favicons?domain=${mirror.domain}&sz=256`
                : null;

            return (
              <a
                key={idx}
                href={uri}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-outline flex items-center justify-between px-2 h-9 min-h-0 hover:bg-primary hover:text-primary-content border-base-300"
              >
                <span className="flex items-center gap-2 overflow-hidden">
                  {faviconUrl ? (
                    <img
                      src={faviconUrl}
                      alt=""
                      className="size-4.5 rounded-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Share2 size={10} className="shrink-0" />
                  )}
                  <span className="truncate font-medium">{mirror.name}</span>
                </span>
                <ExternalLink size={10} className="shrink-0 opacity-50" />
              </a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
