import React, { useState } from "react";
import { Settings, Language, Source } from "../types";
import { DAISY_THEMES, TRANSLATIONS } from "../constants";
import {
  Settings as SettingsIcon,
  X,
  Monitor,
  Columns,
  List,
  Languages,
  Plus,
  Trash2,
  RefreshCw,
  Globe,
  AlertTriangle,
  ShieldAlert,
  Layout,
} from "lucide-react";

interface SettingsPanelProps {
  settings: Settings;
  setSettings: (s: Settings) => void;
  sources: Source[];
  setSources: (s: Source[]) => void;
  onRefresh: (id: string) => void;
  onClose: () => void;
}

type TabType = "mirrors" | "display" | "general";

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  setSettings,
  sources,
  setSources,
  onRefresh,
  onClose,
}) => {
  const t = TRANSLATIONS[settings.language];
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("mirrors");

  const addSource = async () => {
    if (!newUrl) return;
    setError(null);

    if (sources.some((s) => s.url.toLowerCase() === newUrl.toLowerCase())) {
      setError(t.sourceExists);
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch(newUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.downloads)) {
        throw new Error("Invalid JSON structure");
      }

      const id = crypto.randomUUID();
      const color =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");

      const name = data.name || `Source ${sources.length + 1}`;

      setSources([...sources, { id, url: newUrl, name, color }]);
      setNewUrl("");
      setIsAdding(false);
    } catch (err) {
      console.error(err);
      setError(t.invalidSource);
    } finally {
      setIsValidating(false);
    }
  };

  const removeSource = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-base-300 flex flex-col h-150 max-h-[90vh]">
        <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-200 shrink-0">
          <div className="flex items-center gap-2 font-bold">
            <SettingsIcon size={18} />
            <span>{t.settings}</span>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={20} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs tabs-bordered bg-base-200/50 shrink-0">
          <button
            className={`tab flex-1 font-bold h-12 ${activeTab === "mirrors" ? "tab-active text-primary border-primary" : ""}`}
            onClick={() => setActiveTab("mirrors")}
          >
            <Globe size={16} className="mr-2" /> Mirrors
          </button>
          <button
            className={`tab flex-1 font-bold h-12 ${activeTab === "display" ? "tab-active text-primary border-primary" : ""}`}
            onClick={() => setActiveTab("display")}
          >
            <Layout size={16} className="mr-2" /> Display
          </button>
          <button
            className={`tab flex-1 font-bold h-12 ${activeTab === "general" ? "tab-active text-primary border-primary" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <SettingsIcon size={16} className="mr-2" /> General
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "mirrors" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-60">
                  Manage Sources
                </h3>
                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="btn btn-sm btn-primary gap-1"
                >
                  <Plus size={16} /> {t.add}
                </button>
              </div>

              {isAdding && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://.../data.json"
                      className={`input w-full pl-10 bg-base-200 border-none focus:ring-2 focus:ring-primary/45 transition-all focus-within:outline-primary/70 focus-within:outline-2 focus-within:outline-offset-4${error ? "input-error" : ""}`}
                      value={newUrl}
                      onChange={(e) => {
                        setNewUrl(e.target.value);
                        if (error) setError(null);
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !isValidating && addSource()
                      }
                      disabled={isValidating}
                    />
                    <button
                      onClick={addSource}
                      className={`btn btn-primary ${isValidating ? "loading" : ""}`}
                      disabled={isValidating || !newUrl}
                    >
                      {!isValidating && t.add}
                    </button>
                  </div>
                  {error && (
                    <div className="text-[10px] text-error font-bold px-1 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      {error}
                    </div>
                  )}
                  {isValidating && (
                    <div className="text-[10px] text-info font-bold px-1 flex items-center gap-1">
                      <RefreshCw size={10} className="animate-spin" />
                      {t.validating}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between bg-base-200 p-3 rounded-xl border border-base-300"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: source.color }}
                      ></div>
                      <span className="font-bold truncate">{source.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onRefresh(source.id)}
                        className="btn btn-ghost btn-sm btn-circle text-info"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => removeSource(source.id)}
                        className="btn btn-ghost btn-sm btn-circle text-error"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {sources.length === 0 && (
                  <div className="text-center py-12 opacity-40 italic">
                    {t.noSources}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "display" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Theme */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Monitor size={18} /> {t.theme}
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({ ...settings, theme: e.target.value })
                  }
                >
                  {DAISY_THEMES.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Per Page */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <List size={18} /> {t.itemsPerPage}
                  </span>
                </label>
                <div className="join w-full">
                  {[20, 100, 250, "all"].map((val) => (
                    <button
                      key={val}
                      className={`join-item btn flex-1 ${settings.itemsPerPage === val ? "btn-primary" : "btn-ghost border-base-300"}`}
                      onClick={() =>
                        setSettings({ ...settings, itemsPerPage: val as any })
                      }
                    >
                      {val === "all" ? "All" : val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Columns */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Columns size={18} /> {t.columns}
                  </span>
                </label>
                <div className="join w-full">
                  {[1, 2, 3, 4].map((val) => (
                    <button
                      key={val}
                      className={`join-item btn flex-1 ${settings.columns === val ? "btn-primary" : "btn-ghost border-base-300"}`}
                      onClick={() =>
                        setSettings({ ...settings, columns: val as any })
                      }
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Widescreen */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={settings.widescreen}
                    onChange={(e) =>
                      setSettings({ ...settings, widescreen: e.target.checked })
                    }
                  />
                  <span className="label-text font-bold">{t.widescreen}</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Languages size={18} /> {t.language}
                  </span>
                </label>
                <div className="join w-full">
                  {(["en", "pt", "es"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      className={`join-item btn flex-1 ${settings.language === lang ? "btn-primary" : "btn-ghost border-base-300"}`}
                      onClick={() =>
                        setSettings({ ...settings, language: lang })
                      }
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider opacity-20"></div>

              {/* Legal Notice */}
              <div className="alert bg-yellow-200 text-yellow-900 border-none shadow-sm p-6 relative overflow-hidden rounded-2xl">
                <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                  <AlertTriangle size={80} />
                </div>
                <div className="flex flex-col gap-2 relative z-10">
                  <div className="flex items-center gap-2 font-black uppercase tracking-wider text-xs">
                    <AlertTriangle size={16} />
                    <span>{t.mirrors} Legal</span>
                  </div>
                  <p className="text-[10px] font-bold leading-relaxed opacity-80">
                    {t.legalNoticeDetailed}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
