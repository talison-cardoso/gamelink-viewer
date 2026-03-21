import { Language } from "./types";

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    appName: "NexusGrid",
    addSource: "Add Source",
    sourceUrl: "JSON URL",
    sourceName: "Source Name (Optional)",
    add: "Add",
    allSources: "All Sources",
    loadMore: "Load more {count} items ({remaining} remaining)",
    loadAll: "Load all remaining items ({remaining})",
    settings: "Settings",
    theme: "Theme",
    itemsPerPage: "Items per load",
    columns: "Columns",
    widescreen: "Widescreen Mode",
    language: "Language",
    noSources: "No sources added yet. Add a JSON URL to start.",
    legalNotice:
      "This site does not host any files. It only renders public links provided by third parties.",
    legalNoticeDetailed:
      "This application is only a link renderer. We do not host, store or distribute any files or links. All content is fetched dynamically from JSON sources provided by the user.",
    howItWorks: "How it works",
    howItWorksDesc:
      "Paste a JSON URL from your favorite source to render the download list instantly. Your sources are saved locally in your browser.",
    selectSource: "SELECT A SOURCE TO START",
    close: "Close",
    remove: "Remove",
    refresh: "Refresh",
    validating: "Validating...",
    invalidSource:
      "Invalid source. The URL must point to a compatible JSON file.",
    sourceExists: "This source is already in your list.",
    search: "Search games...",
    mirrors: "Mirrors",
    date: "Date",
    size: "Size",
    importFile: "Import JSON File",
    or: "or",
  },
  pt: {
    appName: "NexusGrid",
    addSource: "Adicionar Fonte",
    sourceUrl: "URL do JSON",
    sourceName: "Nome da Fonte (Opcional)",
    add: "Adicionar",
    allSources: "Todas as Fontes",
    loadMore: "Carregar mais {count} ({remaining} restantes)",
    loadAll: "Carregar todos os {remaining} itens restantes",
    settings: "Configurações",
    theme: "Tema",
    itemsPerPage: "Itens por carregamento",
    columns: "Colunas",
    widescreen: "Modo Widescreen",
    language: "Idioma",
    noSources:
      "Nenhuma fonte adicionada ainda. Adicione uma URL JSON para começar.",
    legalNotice:
      "Este site não hospeda arquivos. Apenas renderiza links públicos fornecidos por terceiros.",
    legalNoticeDetailed:
      "Este aplicativo é apenas um renderizador de links. Não hospedamos, armazenamos ou distribuímos quaisquer arquivos ou links. Todo o conteúdo é obtido dinamicamente de fontes JSON fornecidas pelo usuário.",
    howItWorks: "Como funciona",
    howItWorksDesc:
      "Cole uma URL JSON de sua fonte favorita para listar os downloads instantaneamente. Suas fontes são salvas localmente no seu navegador.",
    selectSource: "SELECIONE UMA FONTE PARA COMEÇAR",
    close: "Fechar",
    remove: "Remover",
    refresh: "Atualizar",
    validating: "Validando...",
    invalidSource:
      "Fonte inválida. A URL deve apontar para um arquivo JSON compatível.",
    sourceExists: "Esta fonte já está na sua lista.",
    search: "Buscar jogos...",
    mirrors: "Mirrors",
    date: "Data",
    size: "Tamanho",
    importFile: "Importar Arquivo JSON",
    or: "ou",
  },
  es: {
    appName: "NexusGrid",
    addSource: "Añadir Fuente",
    sourceUrl: "URL del JSON",
    sourceName: "Nombre de la Fuente (Opcional)",
    add: "Añadir",
    allSources: "Todas las Fuentes",
    loadMore: "Cargar {count} más ({remaining} restantes)",
    loadAll: "Cargar los {remaining} ítems restantes",
    settings: "Configuraciones",
    theme: "Tema",
    itemsPerPage: "Ítems por carga",
    columns: "Columnas",
    widescreen: "Modo Widescreen",
    language: "Idioma",
    noSources: "No hay fuentes añadidas aún. Añade una URL JSON para empezar.",
    legalNotice:
      "Este sitio no aloja ningún archivo. Solo renderiza enlaces públicos proporcionados por terceros.",
    legalNoticeDetailed:
      "Esta aplicación es solo un renderizador de enlaces. No alojamos, almacenamos ni distribuimos ningún archivo o enlace. Todo el contenido se obtiene dinámicamente de fuentes JSON proporcionadas por el usuario.",
    howItWorks: "Cómo funciona",
    howItWorksDesc:
      "Pegue una URL JSON de su fuente favorita para listar las descargas al instante. Sus fuentes se guardan localmente en su navegador.",
    selectSource: "SELECCIONE UNA FUENTE PARA COMENZAR",
    close: "Cerrar",
    remove: "Eliminar",
    refresh: "Refrescar",
    validating: "Validando...",
    invalidSource:
      "Fuente inválida. La URL debe apuntar a un archivo JSON compatible.",
    sourceExists: "Esta fuente ya está en tu lista.",
    search: "Buscar juegos...",
    mirrors: "Mirrors",
    date: "Fecha",
    size: "Tamaño",
    importFile: "Importar Archivo JSON",
    or: "o",
  },
};

export const DAISY_THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

export const MIRROR_RULES = [
  { pattern: /gofile\.io/, name: "GoFile", color: "badge-primary" },
  {
    pattern: /buzzheavier\.com/,
    name: "BuzzHeavier",
    color: "badge-secondary",
  },
  { pattern: /1fichier\.com/, name: "1Fichier", color: "badge-accent" },
  { pattern: /mega\.nz/, name: "Mega", color: "badge-error" },
  { pattern: /mediafire\.com/, name: "MediaFire", color: "badge-info" },
  { pattern: /pixeldrain\.com/, name: "PixelDrain", color: "badge-warning" },
  { pattern: /torrent|magnet:/, name: "Torrent", color: "badge-ghost" },
  { pattern: /qiwi\.gg/, name: "Qiwi", color: "badge-success" },
  { pattern: /doodrive\.com/, name: "DooDrive", color: "badge-neutral" },
  { pattern: /vikingfile\.com/, name: "VikingFile", color: "badge-primary" },
  {
    pattern: /krakenfiles\.com/,
    name: "KrakenFiles",
    color: "badge-secondary",
  },
  { pattern: /rapidgator\.net/, name: "RapidGator", color: "badge-error" },
  { pattern: /uploaded\.net/, name: "Uploaded", color: "badge-info" },
  { pattern: /uptobox\.com/, name: "UptoBox", color: "badge-accent" },
  { pattern: /userscloud\.com/, name: "UsersCloud", color: "badge-warning" },
  { pattern: /zippyshare\.com/, name: "Zippyshare", color: "badge-success" },
];

export const SOURCE_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
];
