import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Settings, Source, DownloadItem, SourceData } from "./types";
import { TRANSLATIONS } from "./constants";
import { GameCard } from "./components/GameCard";
import { SettingsPanel } from "./components/SettingsPanel";
import { getSources, saveSources } from "./services/db";
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
  const [sources, setSources] = useState<Source[]>([]);
  const [isSourcesLoaded, setIsSourcesLoaded] = useState(false);
  const [allData, setAllData] = useState<DownloadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSourceId, setActiveSourceId] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showLegalNotice, setShowLegalNotice] = useLocalStorage<boolean>(
    "nexusgrid_legal_notice",
    true,
  );

  const t = TRANSLATIONS[settings.language];

  // Load sources from IndexedDB on mount
  useEffect(() => {
    const loadSources = async () => {
      try {
        // Try to migrate from localStorage first
        const legacySources = localStorage.getItem("nexusgrid_sources");
        let initialSources: Source[] = [];

        if (legacySources) {
          initialSources = JSON.parse(legacySources);
          // Save to IndexedDB and remove from localStorage
          await saveSources(initialSources);
          localStorage.removeItem("nexusgrid_sources");
        } else {
          initialSources = await getSources();
        }

        setSources(initialSources);
      } catch (error) {
        console.error("Error loading sources:", error);
      } finally {
        setIsSourcesLoaded(true);
      }
    };
    loadSources();
  }, []);

  // Save sources to IndexedDB whenever they change
  useEffect(() => {
    if (isSourcesLoaded) {
      saveSources(sources).catch((err) =>
        console.error("Error saving sources:", err),
      );
    }
  }, [sources, isSourcesLoaded]);

  // Scroll listener for mobile header and scroll to top
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch data from a source
  const fetchSource = useCallback(
    async (source: Source) => {
      try {
        let data: SourceData;

        if (source.isLocal && source.localData) {
          data = source.localData;
        } else {
          const response = await fetch(
            `/api/proxy?url=${encodeURIComponent(source.url)}`,
          );
          if (!response.ok) throw new Error("Failed to fetch");
          data = await response.json();
        }

        const finalName = data.name || source.name;

        // Update the source name in the sources list if it changed
        if (data.name && data.name !== source.name) {
          setSources((prev) =>
            prev.map((s) =>
              s.id === source.id ? { ...s, name: data.name! } : s,
            ),
          );
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
    if (isSourcesLoaded) {
      fetchAll();
    }
  }, [sources.length, isSourcesLoaded]); // Only refetch when sources are added/removed or initially loaded

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
      <AnimatePresence>
        {!isSourcesLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-base-100 flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-content shadow-2xl shadow-primary/20 animate-bounce">
              <LayoutGrid size={32} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-xl font-black tracking-tighter">
                {t.appName}
              </h2>
              <span className="loading loading-dots loading-md text-primary"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300 transition-all duration-300 ${scrolled ? "py-1 shadow-md" : "py-2 sm:py-3"}`}
      >
        <div
          className={`container mx-auto px-4 flex flex-row gap-2 sm:gap-4 items-center justify-between ${containerClass}`}
        >
          <div
            className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${scrolled ? "opacity-100" : "opacity-100"}`}
          >
            <div className="size-8 sm:size-10 mr-1 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center text-primary-content shadow-lg shadow-primary/20 shrink-0">
              <LayoutGrid className="sm:size-6 size-4" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-black tracking-tighter leading-none">
                {t.appName}
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">
                Link Aggregator
              </p>
            </div>
          </div>

          <div
            className={`flex-1 max-w-2xl relative group transition-all duration-300`}
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 transition-colors group-focus-within:text-red-400"
              size={16}
            />
            <input
              type="text"
              placeholder={t.search}
              className="input input-sm sm:input-md w-full pl-9 sm:pl-10 transition-all bg-base-200/50 border-none focus:bg-base-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={`flex items-center gap-1 sm:gap-2 shrink-0`}>
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-ghost btn-sm sm:btn-md btn-circle"
            >
              <SettingsIcon className="size-4.5 sm:size-5" />
            </button>
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
                  className="btn btn-primary shadow-xl shadow-primary/20 group py-2"
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
            className="fixed bottom-6 left-6 right-6 md:left-auto md:w-[450px] z-50"
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
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-2xl z-30"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
