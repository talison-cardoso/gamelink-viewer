import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Settings, Source, DownloadItem, SourceData } from "./types";
import { TRANSLATIONS } from "./constants";
import { GameCard } from "./components/GameCard";
import { SettingsPanel } from "./components/SettingsPanel";
import {
  Search,
  Settings as SettingsIcon,
  LayoutGrid,
  Filter,
  ArrowUp,
  Monitor,
  AlertTriangle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  itemsPerPage: 20,
  columns: 3,
  widescreen: true,
  language: "en",
};

export default function App() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "nexusgrid_settings",
    DEFAULT_SETTINGS,
  );
  const [sources, setSources] = useLocalStorage<Source[]>(
    "nexusgrid_sources",
    [],
  );
  const [allData, setAllData] = useState<DownloadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSourceId, setActiveSourceId] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLegalNotice, setShowLegalNotice] = useLocalStorage<boolean>(
    "nexusgrid_legal_notice",
    true,
  );

  const t = TRANSLATIONS[settings.language];

  // Scroll listener for mobile header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch data from a source
  const fetchSource = useCallback(
    async (source: Source) => {
      try {
        const response = await fetch(source.url, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data: SourceData = await response.json();
        const finalName = data.name || source.name;

        // Atualiza nome se mudou
        if (data.name && data.name !== source.name) {
          setSources((prev) =>
            prev.map((s) =>
              s.id === source.id ? { ...s, name: data.name } : s,
            ),
          );
        }

        if (!Array.isArray(data.downloads)) {
          throw new Error("Invalid JSON structure");
        }

        return data.downloads.map((item) => ({
          ...item,
          sourceId: source.id,
          sourceName: finalName,
          sourceColor: source.color,
        }));
      } catch (error) {
        console.error(`Error fetching source ${source.name}:`, error);
        return [];
      }
    },
    [setSources],
  );

  // Fetch all sources
  const fetchAll = useCallback(async () => {
    if (sources.length === 0) {
      setAllData([]);
      return;
    }

    setIsLoading(true);
    const results = await Promise.all(sources.map((s) => fetchSource(s)));
    const flatData = results
      .flat()
      .sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
      );
    setAllData(flatData);
    setIsLoading(false);
  }, [sources, fetchSource]);

  useEffect(() => {
    fetchAll();
  }, [sources.length]); // Only refetch when sources are added/removed

  const handleRefresh = async (id: string) => {
    const source = sources.find((s) => s.id === id);
    if (!source) return;

    setIsLoading(true);
    const newData = await fetchSource(source);
    setAllData((prev) => {
      const filtered = prev.filter((item) => item.sourceId !== id);
      return [...filtered, ...newData].sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
      );
    });
    setIsLoading(false);
  };

  // Filtered data
  const filteredData = useMemo(() => {
    let data = allData;
    if (activeSourceId !== "all") {
      data = data.filter((item) => item.sourceId === activeSourceId);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.sourceName.toLowerCase().includes(query),
      );
    }
    return data;
  }, [allData, activeSourceId, searchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    const initialCount =
      settings.itemsPerPage === "all"
        ? filteredData.length
        : settings.itemsPerPage;
    setVisibleCount(initialCount);
  }, [filteredData.length, activeSourceId, searchQuery, settings.itemsPerPage]);

  const visibleItems = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  const loadMore = () => {
    const step =
      settings.itemsPerPage === "all"
        ? filteredData.length
        : settings.itemsPerPage;
    setVisibleCount((prev) => Math.min(prev + step, filteredData.length));
  };

  const remainingCount = filteredData.length - visibleCount;
  const nextLoadCount =
    settings.itemsPerPage === "all"
      ? remainingCount
      : Math.min(settings.itemsPerPage, remainingCount);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  const containerClass = settings.widescreen ? "max-w-[2160px]" : "max-w-7xl";

  return (
    <div
      className={`min-h-screen bg-base-100 text-base-content font-sans selection:bg-primary selection:text-primary-content`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 bg-base-100/60 border-b border-base-300 backdrop-blur-lg transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div
          className={`container mx-auto px-4 flex flex-col md:flex-row items-center justify-between transition-all duration-300 ${
            scrolled ? "gap-2" : "gap-4"
          }  ${containerClass}`}
        >
          {/* Logo / Título */}
          <div
            className={`flex items-center gap-3 transition-[opacity,transform] duration-300
            ${
              scrolled
                ? "opacity-0 -translate-y-2 hidden md:flex md:opacity-100 md:translate-y-0"
                : "opacity-100 translate-y-0 flex"
            }`}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content shadow-lg shadow-primary/20">
              <LayoutGrid size={24} />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter leading-none">
                {t.appName}
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">
                Link Aggregator
              </p>
            </div>
          </div>

          {/* Search */}
          <div
            className={`flex-1 w-full relative group transition-all duration-300
            ${scrolled ? "max-w-full md:max-w-2xl" : "max-w-xl"}`}
          >
            <Search
              className="absolute left-3 z-10 top-1/2 -translate-y-1/2 text-base-content/50 transition-colors group-focus-within:text-primary/70"
              size={18}
            />

            <input
              type="text"
              placeholder={t.search}
              className="input w-full pl-10 bg-base-200 border-none focus:ring-2 focus:ring-primary/45 transition-all focus-within:outline-primary/70 focus-within:outline-2 focus-within:outline-offset-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Botões direita */}
          <div
            className={`flex items-center gap-2 transition-[opacity,transform] duration-300
            ${
              scrolled
                ? "opacity-0 translate-y-2 hidden md:flex md:opacity-100 md:translate-y-0"
                : "opacity-100 translate-y-0 flex"
            }`}
          >
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-ghost btn-circle"
            >
              <SettingsIcon size={20} />
            </button>

            {isLoading && (
              <span className="loading loading-spinner loading-sm text-primary"></span>
            )}
          </div>
        </div>
      </header>

      <main
        className={`container mx-auto px-4 py-8 space-y-8 ${containerClass}`}
      >
        {sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-in fade-in duration-500">
            <div className="relative flex flex-col my-30 items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
              <Monitor className="opacity-10 size-32 stroke-[0.5]" />
              <h2 className="text-3xl font-bold tracking- opacity-20 uppercase">
                {t.selectSource}
              </h2>
            </div>

            <div className="card bg-base-200/40 backdrop-blur-xl border border-base-300 shadow-2xl max-w-md w-full p-8 space-y-6 items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t.howItWorks}</h3>
                <p className="text-sm opacity-60 leading-relaxed">
                  {t.howItWorksDesc}
                </p>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="btn btn-primary btn-wide shadow-lg shadow-primary/20"
              >
                {t.addSource}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters & Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="tabs tabs-boxed bg-base-200 p-1">
                <button
                  className={`tab tab-sm ${activeSourceId === "all" ? "tab-active" : ""}`}
                  onClick={() => setActiveSourceId("all")}
                >
                  {t.allSources}
                </button>
                {sources.map((s) => (
                  <button
                    key={s.id}
                    className={`tab tab-sm ${activeSourceId === s.id ? "tab-active" : ""}`}
                    onClick={() => setActiveSourceId(s.id)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                <Filter size={14} />
                <span>{filteredData.length} items found</span>
              </div>
            </div>

            {/* Grid */}
            <div
              className={`grid gap-4 transition-all duration-500 ${
                settings.columns === 1
                  ? "grid-cols-1"
                  : settings.columns === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : settings.columns === 3
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              <AnimatePresence>
                {visibleItems.map((item, idx) => (
                  <GameCard
                    key={`${item.sourceId}-${idx}`}
                    item={item}
                    lang={settings.language}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {remainingCount > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  className="btn btn-primary btn-wide shadow-xl shadow-primary/20 group py-2"
                >
                  {settings.itemsPerPage === "all"
                    ? t.loadAll.replace(
                        "{remaining}",
                        remainingCount.toString(),
                      )
                    : t.loadMore
                        .replace("{count}", nextLoadCount.toString())
                        .replace("{remaining}", remainingCount.toString())}
                  <ArrowUp
                    className="rotate-180 group-hover:translate-y-1 transition-transform"
                    size={18}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Dismissible Legal Notice */}
      <AnimatePresence>
        {showLegalNotice && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:w-md z-50"
          >
            <div className="alert bg-yellow-200 text-yellow-900 border-none shadow-2xl p-6 relative overflow-hidden rounded-3xl group cursor-default">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-3">
                <AlertTriangle size={120} />
              </div>
              <div className="flex flex-col gap-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black uppercase tracking-wider">
                    <AlertTriangle size={20} />
                    <span>{TRANSLATIONS[settings.language].mirrors} Legal</span>
                  </div>
                  <button
                    onClick={() => setShowLegalNotice(false)}
                    className="btn btn-ghost btn-xs btn-circle text-yellow-900 hover:bg-yellow-300"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {t.legalNoticeDetailed}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          setSettings={setSettings}
          sources={sources}
          setSources={setSources}
          onRefresh={handleRefresh}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-2xl z-30"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
}
