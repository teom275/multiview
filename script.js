/**
 * MultiView Pro — OLED Edition
 * Soporta YouTube y Twitch simultáneamente con presets argentinos (Noticias, Deportes, Creadores),
 * cambio individual de canal (Swap), persistencia en localStorage y enlace compartible.
 */

(function () {
    'use strict';

    // Application State
    const state = {
        streams: [],
        layout: 'auto',
        spotlightId: null,
        currentSwappingStreamId: null
    };

    const STORAGE_KEY_STREAMS = 'multiview_pro_streams';
    const STORAGE_KEY_LAYOUT = 'multiview_pro_layout';

    // Catálogo Completo de Canales (Noticias, Finanzas, Internacional, Deportes, Creadores, Kick)
    const ARGENTINA_CATALOG = {
        finanzas: [
            // 6 Principales por defecto (Global Markets & Finance)
            { id: 'bloomberg', name: 'Bloomberg Television', type: 'youtube', target: 'QB5BNdBFujE', badge: 'Live Markets (EN)', isDefault: true },
            { id: 'yahoofinance', name: 'Yahoo Finance Live', type: 'youtube', target: 'n4O5QmWM7IE', badge: 'Market Bell (EN)', isDefault: true },
            { id: 'cnbc', name: 'CNBC Television', type: 'youtube', target: 'h30qlVplAsE', badge: 'Stocks & Biz (EN)', isDefault: true },
            { id: 'coindesk', name: 'CoinDesk (Crypto Markets)', type: 'youtube', target: 'SUzzPdBet10', badge: 'Bitcoin & Crypto (EN)', isDefault: true },
            { id: 'reuters_biz', name: 'Reuters Business Live', type: 'youtube', target: 'qn9w6vrWkyQ', badge: 'Global Markets (EN)', isDefault: true },
            { id: 'euronews_biz', name: 'Euronews Business', type: 'youtube', target: 'I9x2ocfbLDw', badge: 'Economy (EN/ES)', isDefault: true },
            // Alternativas conocidas (Argentina y Global)
            { id: 'ambito', name: 'Ámbito Financiero (Argentina)', type: 'youtube', target: 'ArKbAx1K-2U', badge: 'Mercados & Dólar', isDefault: false },
            { id: 'invertironline', name: 'Invertir Online (IOL)', type: 'youtube', target: 'lV0Ks_nOdxE', badge: 'Bolsa & Finanzas', isDefault: false },
            { id: 'ramiro_marra', name: 'Ramiro Marra (Finanzas / Mercados)', type: 'youtube', target: 'cb12KmMMDJA', badge: 'Dólar & Acciones', isDefault: false }
        ],
        internacional: [
            // 6 Principales por defecto (World News 24/7)
            { id: 'skynews', name: 'Sky News Live', type: 'youtube', target: 'YheZfqgGLHw', badge: 'World News (EN)', isDefault: true },
            { id: 'aljazeera', name: 'Al Jazeera English', type: 'youtube', target: 'gCNeDWCI0vo', badge: 'Global Affairs (EN)', isDefault: true },
            { id: 'dwnews', name: 'DW News (Deutsche Welle)', type: 'youtube', target: 'LuKwFajn37U', badge: 'World / Europe (EN)', isDefault: true },
            { id: 'france24', name: 'France 24 English Live', type: 'youtube', target: 'HvZt-nh9sGg', badge: 'International (EN)', isDefault: true },
            { id: 'abcnews', name: 'ABC News Live (US / Global)', type: 'youtube', target: 'syqrmPSmptw', badge: 'Breaking News (EN)', isDefault: true },
            { id: 'nbcnews', name: 'NBC News NOW', type: 'youtube', target: 'DLnAwi5wQwk', badge: '24/7 News (EN)', isDefault: true },
            // Alternativas conocidas
            { id: 'euronews_world', name: 'Euronews English', type: 'youtube', target: 'I9x2ocfbLDw', badge: 'Europe & World (EN)', isDefault: false },
            { id: 'reuters_news', name: 'Reuters Live News', type: 'youtube', target: 'qn9w6vrWkyQ', badge: 'World News (EN)', isDefault: false }
        ],
        noticias: [
            // 6 Principales por defecto (Telefe removido por bloqueo de embed, Canal 26 activo 24/7)
            { id: 'tn', name: 'TN (Todo Noticias)', type: 'youtube', target: 'cb12KmMMDJA', badge: 'En Vivo', isDefault: true },
            { id: 'c5n', name: 'C5N', type: 'youtube', target: 'j6oh4Kqz3UM', badge: 'En Vivo', isDefault: true },
            { id: 'lnmas', name: 'LN+ (La Nación)', type: 'youtube', target: '_vf6ulohS-s', badge: 'En Vivo', isDefault: true },
            { id: 'cronica', name: 'Crónica HD', type: 'youtube', target: 'hw4uHyct4vg', badge: 'En Vivo', isDefault: true },
            { id: 'a24', name: 'A24', type: 'youtube', target: 'ArKbAx1K-2U', badge: 'En Vivo', isDefault: true },
            { id: 'canal26', name: 'Canal 26 (En Vivo 24/7)', type: 'youtube', target: 'RJe3MMp_3p8', badge: '24 Horas', isDefault: true },
            // Alternativas conocidas
            { id: 'eltrece', name: 'El Trece', type: 'youtube', target: 'h_zyAPPJX1k', badge: 'En Vivo', isDefault: false },
            { id: 'tvpublica', name: 'Televisión Pública', type: 'youtube', target: 'Ufzfd0-cw2g', badge: 'En Vivo', isDefault: false },
            { id: 'olga_news', name: 'OLGA (Streaming)', type: 'youtube', target: 'EODBiMEwilU', badge: 'Streaming', isDefault: false },
            { id: 'luzu_news', name: 'LUZU TV (Streaming)', type: 'youtube', target: '42rWQJlio_g', badge: 'Streaming', isDefault: false },
            { id: 'vorterix_news', name: 'Vorterix', type: 'twitch', target: 'vorterixok', badge: 'Radio/Stream', isDefault: false }
        ],
        deportes: [
            // 6 Principales por defecto
            { id: 'tycsports', name: 'TyC Sports', type: 'youtube', target: 'lV0Ks_nOdxE', badge: 'Deportes AR', isDefault: true },
            { id: 'carburando', name: 'Carburando (TC / Automovilismo)', type: 'youtube', target: 'RDlc6UA2sGY', badge: 'Motores', isDefault: true },
            { id: 'dsports', name: 'DSports Radio', type: 'youtube', target: 'ky1GtPrFMek', badge: 'Fútbol/Radio', isDefault: true },
            { id: 'davo_dep', name: 'Davo Xeneize (Debate)', type: 'twitch', target: 'davooxeneize', badge: 'Stream Fútbol', isDefault: true },
            { id: 'lacobra_dep', name: 'La Cobra (Debate)', type: 'twitch', target: 'lacobraaa', badge: 'Stream Fútbol', isDefault: true },
            { id: 'river', name: 'River Plate Oficial', type: 'youtube', target: '_ypLae9mH7U', badge: 'Club Oficial', isDefault: true },
            // Alternativas conocidas (Twitch, Kick y YouTube)
            { id: 'azzaro_kick', name: 'Flavio Azzaro / El Loco y el Cuerdo (Kick)', type: 'kick', target: 'el-loco-y-el-cuerdo', badge: 'Kick Debate', isDefault: false },
            { id: 'kun_dep_kick', name: 'Kun Agüero / Slakun10 (Kick)', type: 'kick', target: 'slakun10', badge: 'Kick Fútbol', isDefault: false },
            { id: 'davo_kick', name: 'Davo Xeneize (Kick)', type: 'kick', target: 'davoxeneize', badge: 'Kick Fútbol', isDefault: false },
            { id: 'lacobra_kick', name: 'La Cobra (Kick)', type: 'kick', target: 'lacobra', badge: 'Kick Fútbol', isDefault: false },
            { id: 'boca', name: 'Boca Juniors Oficial', type: 'youtube', target: 'cb12KmMMDJA', badge: 'Club Oficial', isDefault: false },
            { id: 'parenlamano', name: 'Paren La Mano (Vorterix)', type: 'twitch', target: 'vorterixok', badge: 'Deporte & Humor', isDefault: false },
            { id: 'azzaro', name: 'Flavio Azzaro (YouTube)', type: 'youtube', target: 'ArKbAx1K-2U', badge: 'Debate Fútbol', isDefault: false },
            { id: 'espn', name: 'ESPN Fans Highlights', type: 'youtube', target: 'RDlc6UA2sGY', badge: 'Polémica', isDefault: false },
            { id: 'tntsports', name: 'TNT Sports Argentina', type: 'youtube', target: 'lV0Ks_nOdxE', badge: 'Fútbol AR', isDefault: false }
        ],
        creadores: [
            // 6 Principales por defecto (Spreen, Coscu Kick, Davo, La Cobra, Luquitas, Carreraaa)
            { id: 'spreen', name: 'Spreen', type: 'twitch', target: 'elspreen', badge: 'Top Twitch', isDefault: true },
            { id: 'coscu_kick', name: 'Coscu (Kick)', type: 'kick', target: 'coscu', badge: 'Kick Oficial', isDefault: true },
            { id: 'davo', name: 'Davo Xeneize', type: 'twitch', target: 'davooxeneize', badge: 'Fútbol & IRL', isDefault: true },
            { id: 'lacobra', name: 'La Cobra', type: 'twitch', target: 'lacobraaa', badge: 'Fútbol & Gaming', isDefault: true },
            { id: 'luquitas', name: 'Luquitas Rodríguez', type: 'twitch', target: 'luquitarodriguez', badge: 'Paren La Mano', isDefault: true },
            { id: 'carreraaa', name: 'Carreraaa', type: 'twitch', target: 'carreraaa', badge: 'Top Streamer', isDefault: true },
            // Alternativas conocidas en Kick, Twitch y YouTube
            { id: 'coscu_tw', name: 'Coscu (Twitch)', type: 'twitch', target: 'coscu', badge: 'Army Leader', isDefault: false },
            { id: 'brunenger_kick', name: 'Brunenger (Kick)', type: 'kick', target: 'brunenger', badge: 'Top Kick', isDefault: false },
            { id: 'brunenger_tw', name: 'Brunenger (Twitch)', type: 'twitch', target: 'brunenger', badge: 'IRL / Autos', isDefault: false },
            { id: 'momo_kick', name: 'Momo (Kick)', type: 'kick', target: 'momo', badge: 'Kick', isDefault: false },
            { id: 'momo_tw', name: 'Momo (Twitch)', type: 'twitch', target: 'momoladinastia', badge: 'Twitch IRL', isDefault: false },
            { id: 'santutu_kick', name: 'Santutu (Kick)', type: 'kick', target: 'santutu', badge: 'Kick', isDefault: false },
            { id: 'santutu_tw', name: 'Santutu (Twitch)', type: 'twitch', target: 'santutu', badge: 'Gaming / IRL', isDefault: false },
            { id: 'slakun10_kick', name: 'Kun Agüero / Slakun10 (Kick)', type: 'kick', target: 'slakun10', badge: 'Kick Leyenda', isDefault: false },
            { id: 'davo_cr_kick', name: 'Davo Xeneize (Kick)', type: 'kick', target: 'davoxeneize', badge: 'Kick IRL', isDefault: false },
            { id: 'lacobra_cr_kick', name: 'La Cobra (Kick)', type: 'kick', target: 'lacobra', badge: 'Kick Gaming', isDefault: false },
            { id: 'goncho', name: 'Goncho Banzas', type: 'twitch', target: 'goncho', badge: 'Gaming / IRL', isDefault: false },
            { id: 'litkillah', name: 'Lit Killah', type: 'twitch', target: 'litkillah', badge: 'Música & Stream', isDefault: false },
            { id: 'robleis', name: 'Robleis', type: 'twitch', target: 'robleis', badge: 'Gaming', isDefault: false },
            { id: 'olga_stream', name: 'OLGA (Migue Granados)', type: 'youtube', target: 'EODBiMEwilU', badge: 'Streaming No. 1', isDefault: false },
            { id: 'luzu_stream', name: 'LUZU TV (Nico Occhiato)', type: 'youtube', target: '42rWQJlio_g', badge: 'Streaming', isDefault: false },
            { id: 'vorterix_stream', name: 'Vorterix Oficial', type: 'twitch', target: 'vorterixok', badge: 'Radio/Stream', isDefault: false }
        ],
        kick: [
            { id: 'coscu_k', name: 'Coscu', type: 'kick', target: 'coscu', badge: 'Kick Oficial', isDefault: false },
            { id: 'spreen_k', name: 'Spreen (Kick)', type: 'kick', target: 'spreen', badge: 'Kick Oficial', isDefault: false },
            { id: 'brunenger_k', name: 'Brunenger', type: 'kick', target: 'brunenger', badge: 'Top Kick AR', isDefault: false },
            { id: 'momo_k', name: 'Momo (Gerónimo Benavides)', type: 'kick', target: 'momo', badge: 'IRL / Viajes', isDefault: false },
            { id: 'santutu_k', name: 'Santutu', type: 'kick', target: 'santutu', badge: 'Gaming / IRL', isDefault: false },
            { id: 'davo_k', name: 'Davo Xeneize', type: 'kick', target: 'davoxeneize', badge: 'Fútbol & Debate', isDefault: false },
            { id: 'lacobra_k', name: 'La Cobra', type: 'kick', target: 'lacobra', badge: 'Fútbol & Gaming', isDefault: false },
            { id: 'slakun10_k', name: 'Kun Agüero (Slakun10)', type: 'kick', target: 'slakun10', badge: 'Leyenda / Watchparty', isDefault: false },
            { id: 'azzaro_k', name: 'El Loco y el Cuerdo (Azzaro & Duka)', type: 'kick', target: 'el-loco-y-el-cuerdo', badge: 'Debate Deportivo', isDefault: false }
        ]
    };

    // Presets Internacionales y Demos
    const WORLD_PRESETS = {
        'lofi': [
            { type: 'youtube', id: 'jfKfPfyJRdk', title: 'Lofi Girl - Relax/Study' }
        ],
        'nasa': [
            { type: 'youtube', id: 'P9C25Un7xaM', title: 'NASA ISS Live Tierra' }
        ],
        'synthwave': [
            { type: 'youtube', id: '4xDzrJKXOOY', title: 'Synthwave Radio 24/7' }
        ],
        'twitch-esports': [
            { type: 'twitch', id: 'shroud', title: 'Twitch: Shroud' }
        ],
        'quad-demo': [
            { type: 'youtube', id: 'jfKfPfyJRdk', title: 'Lofi Girl' },
            { type: 'youtube', id: 'P9C25Un7xaM', title: 'NASA Earth Live' },
            { type: 'youtube', id: '4xDzrJKXOOY', title: 'Synthwave Radio' },
            { type: 'twitch', id: 'shroud', title: 'Twitch Shroud' }
        ],
        'study-chill': [
            { type: 'youtube', id: 'jfKfPfyJRdk', title: 'Lofi Girl' },
            { type: 'youtube', id: '4xDzrJKXOOY', title: 'Synthwave Chill' }
        ],
        'space-live': [
            { type: 'youtube', id: 'P9C25Un7xaM', title: 'NASA ISS Space Station' },
            { type: 'youtube', id: '21X5lGlDOfg', title: 'NASA Live Media' }
        ],
        'quad-multigenre': [
            { type: 'youtube', id: 'jfKfPfyJRdk', title: 'Lofi Girl Live' },
            { type: 'youtube', id: 'P9C25Un7xaM', title: 'NASA ISS Live' },
            { type: 'youtube', id: '4xDzrJKXOOY', title: 'Synthwave Beats' },
            { type: 'twitch', id: 'esl_csgo', title: 'ESL CS:GO' }
        ]
    };

    // DOM Elements
    const elements = {
        videoGrid: document.getElementById('videoGrid'),
        emptyState: document.getElementById('emptyState'),
        streamCountText: document.getElementById('streamCountText'),
        videoUrlInput: document.getElementById('videoUrl'),
        addVideoButton: document.getElementById('addVideoButton'),
        addVideoForm: document.getElementById('addVideoForm'),
        btnClearInput: document.getElementById('btnClearInput'),
        inputPlatformIcon: document.getElementById('inputPlatformIcon'),
        layoutControls: document.getElementById('layoutControls'),
        layoutButtons: document.querySelectorAll('.layout-btn'),
        btnClearAll: document.getElementById('btnClearAll'),
        btnPresets: document.getElementById('btnPresets'),
        btnShare: document.getElementById('btnShare'),
        btnFullscreenApp: document.getElementById('btnFullscreenApp'),
        btnToggleAllAudio: document.getElementById('btnToggleAllAudio'),
        toastContainer: document.getElementById('toastContainer'),
        btnArgPacksHeader: document.getElementById('btnArgPacksHeader'),

        // Swap Modal
        swapModal: document.getElementById('swapModal'),
        swapModalTitle: document.getElementById('swapModalTitle'),
        swapModalDescription: document.getElementById('swapModalDescription'),
        btnCloseSwapModal: document.getElementById('btnCloseSwapModal'),
        swapCategoryTabs: document.getElementById('swapCategoryTabs'),
        swapChannelsGrid: document.getElementById('swapChannelsGrid'),
        swapCustomForm: document.getElementById('swapCustomForm'),
        swapCustomInput: document.getElementById('swapCustomInput'),

        // Batch Modal
        batchModal: document.getElementById('batchModal'),
        btnOpenBatchModal: document.getElementById('btnOpenBatchModal'),
        btnCloseBatchModal: document.getElementById('btnCloseBatchModal'),
        btnCancelBatch: document.getElementById('btnCancelBatch'),
        btnSubmitBatch: document.getElementById('btnSubmitBatch'),
        batchTextarea: document.getElementById('batchTextarea'),

        // Presets Modal
        presetsModal: document.getElementById('presetsModal'),
        btnClosePresetsModal: document.getElementById('btnClosePresetsModal'),
        presetsTabs: document.getElementById('presetsTabs'),
        tabContentArg: document.getElementById('tabContentArg'),
        tabContentWorld: document.getElementById('tabContentWorld'),

        // Share Modal
        shareModal: document.getElementById('shareModal'),
        btnCloseShareModal: document.getElementById('btnCloseShareModal'),
        shareUrlInput: document.getElementById('shareUrlInput'),
        btnCopyShareLink: document.getElementById('btnCopyShareLink')
    };

    /* ==========================================================================
       Stream Parser & URL Resolvers
       ========================================================================== */

    function getTwitchHostParent() {
        const hostname = window.location.hostname;
        if (!hostname || hostname === '' || window.location.protocol === 'file:') {
            return 'localhost';
        }
        return hostname;
    }

    /**
     * Parsea un string para identificar si es YouTube o Twitch
     */
    function parseStreamUrl(rawUrl, customTitle = null) {
        if (!rawUrl || typeof rawUrl !== 'string') return null;
        const trimmed = rawUrl.trim();
        if (!trimmed) return null;

        // 1. YouTube matching (watch?v=, youtu.be/, /live/, /shorts/, /embed/)
        const ytRegex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
        const ytMatch = trimmed.match(ytRegex);

        if (ytMatch && ytMatch[1]) {
            const videoId = ytMatch[1];
            return {
                id: 'stream_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                type: 'youtube',
                identifier: videoId,
                title: customTitle || `YouTube: ${videoId}`,
                embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&enablejsapi=1`,
                watchUrl: `https://www.youtube.com/watch?v=${videoId}`
            };
        }

        // Direct 11-char YouTube ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
            return {
                id: 'stream_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                type: 'youtube',
                identifier: trimmed,
                title: customTitle || `YouTube: ${trimmed}`,
                embedUrl: `https://www.youtube-nocookie.com/embed/${trimmed}?autoplay=1&mute=0&enablejsapi=1`,
                watchUrl: `https://www.youtube.com/watch?v=${trimmed}`
            };
        }

        // 2. Twitch matching
        const twitchRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]{3,25})(?:\/.*)?/i;
        const twitchMatch = trimmed.match(twitchRegex);

        let channelName = null;
        if (twitchMatch && twitchMatch[1]) {
            channelName = twitchMatch[1].toLowerCase();
        } else if (trimmed.toLowerCase().startsWith('twitch:')) {
            const raw = trimmed.substring(7).trim();
            if (/^[a-zA-Z0-9_]{3,25}$/.test(raw)) {
                channelName = raw.toLowerCase();
            }
        }

        if (channelName && !['directory', 'videos', 'downloads'].includes(channelName)) {
            // Normalizar alias comunes a sus identificadores oficiales en Twitch
            const TWITCH_ALIASES = {
                'spreen': 'elspreen',
                'davoxeneize': 'davooxeneize',
                'davoooxeneize': 'davooxeneize',
                'luquitasrodriguez': 'luquitarodriguez',
                'vorterix': 'vorterixok',
                'vorterixoficial': 'vorterixok',
                'momo': 'momoladinastia'
            };
            if (TWITCH_ALIASES[channelName]) {
                channelName = TWITCH_ALIASES[channelName];
            }

            const parentHost = getTwitchHostParent();
            // Twitch exige estrictamente el host actual del embed. Si se pasan múltiples parents
            // no anidados o inexistentes, el handshake de clasificación de contenido falla y arroja
            // el error "No se ha podido determinar la clasificación del contenido".
            const twitchUrl = `https://player.twitch.tv/?channel=${channelName}&parent=${parentHost}&autoplay=true&muted=true`;

            return {
                id: 'stream_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                type: 'twitch',
                identifier: channelName,
                title: customTitle || `Twitch: ${channelName}`,
                embedUrl: twitchUrl,
                watchUrl: `https://www.twitch.tv/${channelName}`
            };
        }

        // 3. Kick stream
        const kickRegex = /(?:https?:\/\/)?(?:www\.)?kick\.com\/([a-zA-Z0-9_-]{3,35})(?:\/.*)?/i;
        const kickMatch = trimmed.match(kickRegex);

        let kickChannel = null;
        if (kickMatch && kickMatch[1]) {
            kickChannel = kickMatch[1].toLowerCase();
        } else if (trimmed.toLowerCase().startsWith('kick:')) {
            const raw = trimmed.substring(5).trim();
            if (/^[a-zA-Z0-9_-]{3,35}$/.test(raw)) {
                kickChannel = raw.toLowerCase();
            }
        }

        if (kickChannel && !['directory', 'videos', 'categories', 'terms', 'privacy'].includes(kickChannel)) {
            return {
                id: 'stream_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                type: 'kick',
                identifier: kickChannel,
                title: customTitle || `Kick: ${kickChannel}`,
                embedUrl: `https://player.kick.com/${kickChannel}?autoplay=true&muted=false`,
                watchUrl: `https://kick.com/${kickChannel}`
            };
        }

        return null;
    }

    /* ==========================================================================
       State Persistence & URL Sharing
       ========================================================================== */

    function saveState() {
        try {
            const serialized = state.streams.map(s => ({
                type: s.type,
                identifier: s.identifier,
                title: s.title
            }));
            localStorage.setItem(STORAGE_KEY_STREAMS, JSON.stringify(serialized));
            localStorage.setItem(STORAGE_KEY_LAYOUT, state.layout);
        } catch (e) {
            console.warn('No se pudo guardar en localStorage:', e);
        }
        updateUrlHash();
    }

    function updateUrlHash() {
        if (state.streams.length === 0) {
            if (window.location.hash && window.location.hash.includes('streams=')) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            return;
        }

        const encoded = state.streams.map(s => {
            const prefix = s.type === 'twitch' ? 'tw:' : (s.type === 'kick' ? 'kick:' : 'yt:');
            return prefix + s.identifier;
        }).join(',');

        const params = new URLSearchParams(window.location.hash.substring(1));
        params.set('streams', encoded);
        params.set('layout', state.layout);
        history.replaceState(null, '', '#' + params.toString());
    }

    function loadState() {
        // 1. Revisar URL hash para configuraciones compartidas
        if (window.location.hash && window.location.hash.includes('streams=')) {
            try {
                const params = new URLSearchParams(window.location.hash.substring(1));
                const streamsParam = params.get('streams');
                const layoutParam = params.get('layout');

                if (layoutParam && ['auto', 'spotlight', 'grid-2x2', 'grid-3x2', 'grid-3x3'].includes(layoutParam)) {
                    state.layout = layoutParam;
                }

                if (streamsParam) {
                    const items = streamsParam.split(',');
                    const loaded = [];
                    for (const item of items) {
                        if (item.startsWith('yt:')) {
                            let ytTarget = item.substring(3);
                            if (ytTarget === 'XhAYcYpPzTc' || ytTarget === 'telefe') ytTarget = 'RJe3MMp_3p8';
                            const parsed = parseStreamUrl(ytTarget);
                            if (parsed) loaded.push(parsed);
                        } else if (item.startsWith('tw:')) {
                            const parsed = parseStreamUrl('twitch:' + item.substring(3));
                            if (parsed) loaded.push(parsed);
                        } else if (item.startsWith('kick:')) {
                            const parsed = parseStreamUrl('https://kick.com/' + item.substring(5));
                            if (parsed) loaded.push(parsed);
                        } else {
                            let cleanItem = item;
                            if (cleanItem.includes('XhAYcYpPzTc')) cleanItem = 'RJe3MMp_3p8';
                            const parsed = parseStreamUrl(cleanItem);
                            if (parsed) loaded.push(parsed);
                        }
                    }

                    if (loaded.length > 0) {
                        state.streams = loaded;
                        showToast(`¡Se cargaron ${loaded.length} transmisiones del enlace compartido!`, 'success');
                        return;
                    }
                }
            } catch (err) {
                console.warn('Error leyendo hash URL:', err);
            }
        }

        // 2. Cargar de localStorage
        try {
            const savedStreams = localStorage.getItem(STORAGE_KEY_STREAMS);
            const savedLayout = localStorage.getItem(STORAGE_KEY_LAYOUT);

            if (savedLayout && ['auto', 'spotlight', 'grid-2x2', 'grid-3x2', 'grid-3x3'].includes(savedLayout)) {
                state.layout = savedLayout;
            }

            if (savedStreams) {
                const parsed = JSON.parse(savedStreams);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    state.streams = parsed.map(item => {
                        let reconstructed;
                        // Auto-migración si el usuario tenía Telefe guardado localmente
                        let targetId = item.identifier;
                        let itemTitle = item.title;
                        if (targetId === 'XhAYcYpPzTc' || targetId === 'telefe' || (itemTitle && itemTitle.toLowerCase().includes('telefe'))) {
                            targetId = 'RJe3MMp_3p8';
                            itemTitle = 'Canal 26 (En Vivo 24/7)';
                            item.type = 'youtube';
                        }

                        if (item.type === 'twitch') {
                            reconstructed = parseStreamUrl(`https://twitch.tv/${targetId}`, itemTitle);
                        } else if (item.type === 'kick') {
                            reconstructed = parseStreamUrl(`https://kick.com/${targetId}`, itemTitle);
                        } else {
                            reconstructed = parseStreamUrl(targetId, itemTitle);
                        }
                        if (reconstructed && itemTitle) {
                            reconstructed.title = itemTitle;
                        }
                        return reconstructed;
                    }).filter(Boolean);
                }
            }
        } catch (e) {
            console.warn('Error leyendo localStorage:', e);
        }
    }

    /* ==========================================================================
       Packs de Argentina & Carga de Canales
       ========================================================================== */

    function loadArgentinaPack(categoryKey) {
        const category = ARGENTINA_CATALOG[categoryKey];
        if (!category) return;

        // Tomar los 6 marcados como isDefault
        const defaultChannels = category.filter(c => c.isDefault);
        const newStreams = [];

        defaultChannels.forEach(ch => {
            let url = ch.target;
            if (ch.type === 'twitch') {
                url = `https://twitch.tv/${ch.target}`;
            } else if (ch.type === 'kick') {
                url = `https://kick.com/${ch.target}`;
            } else if (ch.type === 'youtube') {
                url = `https://www.youtube.com/watch?v=${ch.target}`;
            }
            const parsed = parseStreamUrl(url, ch.name);
            if (parsed) {
                newStreams.push(parsed);
            }
        });

        state.streams = newStreams;
        state.layout = 'grid-3x2'; // 6 canales en 3x2 en pantallas anchas
        state.spotlightId = newStreams[0]?.id || null;

        saveState();
        render();

        const categoryNames = {
            'noticias': 'Noticias Argentina',
            'deportes': 'Deportes Argentina',
            'creadores': 'Top Creadores AR',
            'finanzas': 'Finanzas & Mercados',
            'internacional': 'Noticias Internacionales'
        };

        showToast(`¡Cargados los 6 canales de ${categoryNames[categoryKey]}! Usá el botón ⇄ en cualquier pantalla para cambiarla.`, 'success');
    }

    /* ==========================================================================
       Cambio Individual de Canal (Swap)
       ========================================================================== */

    function openSwapModal(streamId) {
        const currentStream = state.streams.find(s => s.id === streamId);
        if (!currentStream) return;

        state.currentSwappingStreamId = streamId;
        elements.swapModalTitle.textContent = `Cambiar reproductor: ${currentStream.title}`;
        elements.swapModalDescription.textContent = `Elegí un canal para reemplazar "${currentStream.title}" o pegá un enlace nuevo:`;
        elements.swapCustomInput.value = '';

        renderSwapChannels('all');
        elements.swapModal.style.display = 'flex';
        elements.swapCustomInput.focus();
    }

    function closeSwapModal() {
        elements.swapModal.style.display = 'none';
        state.currentSwappingStreamId = null;
    }

    function renderSwapChannels(categoryFilter = 'all') {
        elements.swapChannelsGrid.innerHTML = '';
        let channelsToDisplay = [];

        if (categoryFilter === 'all') {
            for (const catKey of ['finanzas', 'internacional', 'noticias', 'deportes', 'creadores', 'kick']) {
                channelsToDisplay = channelsToDisplay.concat(ARGENTINA_CATALOG[catKey]);
            }
        } else if (ARGENTINA_CATALOG[categoryFilter]) {
            channelsToDisplay = ARGENTINA_CATALOG[categoryFilter];
        }

        channelsToDisplay.forEach(ch => {
            const card = document.createElement('div');
            card.className = 'swap-channel-card';
            const isKick = ch.type === 'kick';
            const badgeClass = isKick ? 'swap-channel-badge badge-kick-tag' : 'swap-channel-badge';
            card.innerHTML = `
                <div class="swap-channel-info">
                    <span class="swap-channel-name">${escapeHtml(ch.name)}</span>
                    <span class="${badgeClass}">${ch.type.toUpperCase()} • ${escapeHtml(ch.badge)}</span>
                </div>
                <button type="button" class="btn btn-sm btn-secondary">Elegir</button>
            `;

            card.addEventListener('click', () => {
                let url = ch.target;
                if (ch.type === 'twitch') {
                    url = `https://twitch.tv/${ch.target}`;
                } else if (ch.type === 'kick') {
                    url = `https://kick.com/${ch.target}`;
                } else if (ch.type === 'youtube') {
                    url = `https://www.youtube.com/watch?v=${ch.target}`;
                }
                executeSwap(url, ch.name);
            });

            elements.swapChannelsGrid.appendChild(card);
        });
    }

    function executeSwap(newUrl, newTitle = null) {
        if (!state.currentSwappingStreamId) return;

        const parsed = parseStreamUrl(newUrl, newTitle);
        if (!parsed) {
            showToast('Enlace no válido. Ingresá un link de YouTube, Twitch o Kick.', 'error');
            return;
        }

        const index = state.streams.findIndex(s => s.id === state.currentSwappingStreamId);
        if (index === -1) return;

        // Mantener id del slot o reemplazar limpiamente
        state.streams[index] = parsed;
        if (state.spotlightId === state.currentSwappingStreamId) {
            state.spotlightId = parsed.id;
        }

        saveState();
        render();
        closeSwapModal();
        showToast(`Canal cambiado a: ${parsed.title}`, 'success');
    }

    /* ==========================================================================
       Rendering & UI
       ========================================================================== */

    function render() {
        updateLayoutButtons();
        updateStatusBar();

        if (state.streams.length === 0) {
            elements.emptyState.style.display = 'flex';
            elements.videoGrid.style.display = 'none';
            elements.videoGrid.innerHTML = '';
            return;
        }

        elements.emptyState.style.display = 'none';
        elements.videoGrid.style.display = 'grid';

        // Aplicar clase del layout
        elements.videoGrid.className = 'video-grid layout-' + state.layout;

        if (state.layout === 'spotlight' && (!state.spotlightId || !state.streams.some(s => s.id === state.spotlightId))) {
            state.spotlightId = state.streams[0]?.id || null;
        }

        elements.videoGrid.innerHTML = '';
        state.streams.forEach((stream, index) => {
            const card = createStreamCard(stream, index);
            elements.videoGrid.appendChild(card);
        });
    }

    function createStreamCard(stream, index) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.id = `card-${stream.id}`;
        card.dataset.streamId = stream.id;

        const isSpotlight = (state.layout === 'spotlight' && state.spotlightId === stream.id);
        if (isSpotlight) {
            card.classList.add('is-spotlight');
        }

        const badgeClass = stream.type === 'youtube' ? 'badge-youtube' : (stream.type === 'twitch' ? 'badge-twitch' : 'badge-generic');
        const badgeLabel = stream.type === 'youtube' ? 'YouTube' : (stream.type === 'twitch' ? 'Twitch' : 'Kick');

        card.innerHTML = `
            <div class="card-header">
                <div class="card-info">
                    <span class="card-badge ${badgeClass}">${badgeLabel}</span>
                    <span class="card-title" title="${escapeHtml(stream.title)}">${escapeHtml(stream.title)}</span>
                </div>
                <div class="card-actions">
                    <button type="button" class="card-btn btn-swap" title="Cambiar este canal por otro de la lista (Swap)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-spotlight ${isSpotlight ? 'active-spotlight' : ''}" title="${isSpotlight ? 'Enfocado en Spotlight' : 'Modo Cine / Spotlight'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-reload" title="Recargar reproductor">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-external" title="Abrir directamente en ${badgeLabel} (por si requiere inicio de sesión)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-fullscreen" title="Pantalla completa">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-remove" title="Quitar stream">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <iframe 
                    src="${stream.embedUrl}" 
                    title="${escapeHtml(stream.title)}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>
            </div>
        `;

        // Eventos en botones de la tarjeta
        const btnSwap = card.querySelector('.btn-swap');
        btnSwap.addEventListener('click', () => {
            openSwapModal(stream.id);
        });

        const btnSpotlight = card.querySelector('.btn-spotlight');
        btnSpotlight.addEventListener('click', () => {
            state.layout = 'spotlight';
            state.spotlightId = stream.id;
            saveState();
            render();
            showToast(`Spotlight enfocado: ${stream.title}`, 'info');
        });

        const btnReload = card.querySelector('.btn-reload');
        btnReload.addEventListener('click', () => {
            const iframe = card.querySelector('iframe');
            if (iframe) {
                const currentSrc = iframe.src;
                iframe.src = 'about:blank';
                setTimeout(() => {
                    iframe.src = currentSrc;
                }, 100);
                showToast(`Recargando ${stream.title}`, 'info');
            }
        });

        const btnExternal = card.querySelector('.btn-external');
        btnExternal.addEventListener('click', () => {
            if (stream.watchUrl) {
                window.open(stream.watchUrl, '_blank', 'noopener,noreferrer');
            }
        });

        const btnFullscreen = card.querySelector('.btn-fullscreen');
        btnFullscreen.addEventListener('click', () => {
            const iframe = card.querySelector('iframe');
            if (card.requestFullscreen) {
                card.requestFullscreen();
            } else if (iframe && iframe.requestFullscreen) {
                iframe.requestFullscreen();
            }
        });

        const btnRemove = card.querySelector('.btn-remove');
        btnRemove.addEventListener('click', () => {
            removeStream(stream.id);
        });

        return card;
    }

    function removeStream(streamId) {
        state.streams = state.streams.filter(s => s.id !== streamId);
        if (state.spotlightId === streamId) {
            state.spotlightId = state.streams[0]?.id || null;
        }
        saveState();
        render();
        showToast('Stream quitado', 'info');
    }

    function addSingleStream(rawUrl, showNotification = true) {
        const parsed = parseStreamUrl(rawUrl);
        if (!parsed) {
            showToast('URL inválida. Ingresá un link de YouTube o Twitch válido.', 'error');
            return false;
        }

        const exists = state.streams.some(s => s.type === parsed.type && s.identifier === parsed.identifier);
        if (exists) {
            showToast('¡Este canal ya está en la pantalla!', 'info');
            return false;
        }

        state.streams.push(parsed);
        saveState();
        render();

        if (showNotification) {
            showToast(`¡Se agregó ${parsed.title}!`, 'success');
        }
        return true;
    }

    function addBatchStreams(text) {
        if (!text) return;
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        let addedCount = 0;

        lines.forEach(line => {
            const parsed = parseStreamUrl(line);
            if (parsed) {
                const exists = state.streams.some(s => s.type === parsed.type && s.identifier === parsed.identifier);
                if (!exists) {
                    state.streams.push(parsed);
                    addedCount++;
                }
            }
        });

        if (addedCount > 0) {
            saveState();
            render();
            showToast(`¡Se agregaron ${addedCount} canales con éxito!`, 'success');
        } else {
            showToast('No se encontraron canales nuevos válidos para agregar.', 'error');
        }
    }

    function loadWorldPreset(presetKey) {
        const list = WORLD_PRESETS[presetKey];
        if (!list) return;

        let addedCount = 0;
        list.forEach(item => {
            let url = item.id;
            if (item.type === 'twitch') {
                url = `https://twitch.tv/${item.id}`;
            } else if (item.type === 'youtube') {
                url = `https://youtube.com/watch?v=${item.id}`;
            }

            const parsed = parseStreamUrl(url, item.title);
            if (parsed) {
                const exists = state.streams.some(s => s.type === parsed.type && s.identifier === parsed.identifier);
                if (!exists) {
                    state.streams.push(parsed);
                    addedCount++;
                }
            }
        });

        saveState();
        render();
        showToast(`¡Se cargaron ${addedCount} transmisiones del preset!`, 'success');
    }

    function updateLayoutButtons() {
        elements.layoutButtons.forEach(btn => {
            if (btn.dataset.layout === state.layout) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function updateStatusBar() {
        const count = state.streams.length;
        elements.streamCountText.textContent = `${count} canal${count === 1 ? '' : 'es'} activo${count === 1 ? '' : 's'}`;
    }

    /* ==========================================================================
       Toast Notifications
       ========================================================================== */

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
        } else if (type === 'error') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
        } else {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
        }

        toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3600);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /* ==========================================================================
       Event Listeners Setup
       ========================================================================== */

    function setupEventListeners() {
        // Form submission
        elements.addVideoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = elements.videoUrlInput.value;
            if (val) {
                const ok = addSingleStream(val);
                if (ok) {
                    elements.videoUrlInput.value = '';
                    elements.btnClearInput.style.display = 'none';
                    updateInputIcon('');
                }
            }
        });

        // Input platform detect
        elements.videoUrlInput.addEventListener('input', (e) => {
            const val = e.target.value;
            elements.btnClearInput.style.display = val ? 'block' : 'none';
            updateInputIcon(val);
        });

        elements.btnClearInput.addEventListener('click', () => {
            elements.videoUrlInput.value = '';
            elements.btnClearInput.style.display = 'none';
            updateInputIcon('');
            elements.videoUrlInput.focus();
        });

        // Layout controls
        elements.layoutControls.addEventListener('click', (e) => {
            const btn = e.target.closest('.layout-btn');
            if (!btn) return;
            const newLayout = btn.dataset.layout;
            if (newLayout) {
                state.layout = newLayout;
                saveState();
                render();
            }
        });

        // Clear all
        elements.btnClearAll.addEventListener('click', () => {
            if (state.streams.length === 0) return;
            if (confirm('¿Seguro que querés quitar todas las transmisiones de la pantalla?')) {
                state.streams = [];
                state.spotlightId = null;
                saveState();
                render();
                showToast('Se limpiaron todas las pantallas', 'info');
            }
        });

        // Botón Packs Argentina en Header
        if (elements.btnArgPacksHeader) {
            elements.btnArgPacksHeader.addEventListener('click', () => {
                elements.presetsModal.style.display = 'flex';
                // Activar pestaña Argentina
                activatePresetTab('arg');
            });
        }

        // Swap Modal handlers
        elements.btnCloseSwapModal.addEventListener('click', closeSwapModal);

        elements.swapCategoryTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.swap-tab-btn');
            if (!btn) return;
            elements.swapCategoryTabs.querySelectorAll('.swap-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSwapChannels(btn.dataset.category);
        });

        elements.swapCustomForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = elements.swapCustomInput.value;
            if (val) {
                executeSwap(val);
            }
        });

        // Eventos en Empty State para los Packs de Argentina
        elements.emptyState.addEventListener('click', (e) => {
            // Cargar pack completo
            const loadBtn = e.target.closest('[data-load-pack]');
            if (loadBtn) {
                loadArgentinaPack(loadBtn.dataset.loadPack);
                return;
            }

            // Explorar alternativas del pack
            const exploreBtn = e.target.closest('[data-explore-pack]');
            if (exploreBtn) {
                elements.presetsModal.style.display = 'flex';
                activatePresetTab('arg');
                return;
            }

            // Presets demo
            const chip = e.target.closest('.preset-chip');
            if (chip && chip.dataset.preset) {
                loadWorldPreset(chip.dataset.preset);
            }
        });

        // Batch Modal handlers
        elements.btnOpenBatchModal.addEventListener('click', () => {
            elements.batchTextarea.value = '';
            elements.batchModal.style.display = 'flex';
            elements.batchTextarea.focus();
        });
        elements.btnCloseBatchModal.addEventListener('click', () => elements.batchModal.style.display = 'none');
        elements.btnCancelBatch.addEventListener('click', () => elements.batchModal.style.display = 'none');
        elements.btnSubmitBatch.addEventListener('click', () => {
            const text = elements.batchTextarea.value;
            if (text.trim()) {
                addBatchStreams(text);
                elements.batchModal.style.display = 'none';
            }
        });

        // Presets Modal handlers
        elements.btnPresets.addEventListener('click', () => {
            elements.presetsModal.style.display = 'flex';
        });
        elements.btnClosePresetsModal.addEventListener('click', () => elements.presetsModal.style.display = 'none');

        // Presets Tabs (Argentina vs Internacional)
        elements.presetsTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.preset-tab-btn');
            if (!btn) return;
            activatePresetTab(btn.dataset.tab);
        });

        // Presets option clicks in modal
        elements.presetsModal.addEventListener('click', (e) => {
            const loadArgBtn = e.target.closest('[data-load-pack]');
            if (loadArgBtn) {
                loadArgentinaPack(loadArgBtn.dataset.loadPack);
                elements.presetsModal.style.display = 'none';
                return;
            }

            const worldCard = e.target.closest('[data-preset]');
            if (worldCard && worldCard.dataset.preset) {
                loadWorldPreset(worldCard.dataset.preset);
                elements.presetsModal.style.display = 'none';
            }
        });

        // Share Modal & URL Generation
        elements.btnShare.addEventListener('click', () => {
            if (state.streams.length === 0) {
                showToast('¡Agregá canales antes de compartir!', 'info');
                return;
            }

            updateUrlHash();
            elements.shareUrlInput.value = window.location.href;
            elements.shareModal.style.display = 'flex';
            elements.shareUrlInput.select();
        });

        elements.btnCloseShareModal.addEventListener('click', () => elements.shareModal.style.display = 'none');

        elements.btnCopyShareLink.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(elements.shareUrlInput.value);
                showToast('¡Enlace copiado al portapapeles!', 'success');
                elements.shareModal.style.display = 'none';
            } catch (err) {
                elements.shareUrlInput.select();
                document.execCommand('copy');
                showToast('¡Enlace copiado al portapapeles!', 'success');
                elements.shareModal.style.display = 'none';
            }
        });

        // Fullscreen toggle
        elements.btnFullscreenApp.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });

        // Sound tip
        elements.btnToggleAllAudio.addEventListener('click', () => {
            showToast('Consejo: Los navegadores silencian por defecto los videos múltiples. Hacé clic en desmutear directamente en cada video.', 'info');
        });

        // Escape key to close modals
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSwapModal();
                elements.batchModal.style.display = 'none';
                elements.presetsModal.style.display = 'none';
                elements.shareModal.style.display = 'none';
            }
        });

        [elements.swapModal, elements.batchModal, elements.presetsModal, elements.shareModal].forEach(modal => {
            if (!modal) return;
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    if (modal === elements.swapModal) state.currentSwappingStreamId = null;
                }
            });
        });
    }

    function activatePresetTab(tabKey) {
        elements.presetsTabs.querySelectorAll('.preset-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabKey);
        });

        if (tabKey === 'arg') {
            elements.tabContentArg.style.display = 'block';
            elements.tabContentWorld.style.display = 'none';
        } else {
            elements.tabContentArg.style.display = 'none';
            elements.tabContentWorld.style.display = 'block';
        }
    }

    function updateInputIcon(value) {
        const val = value.toLowerCase();
        elements.inputPlatformIcon.className = 'input-platform-icon';

        if (val.includes('twitch.tv') || val.startsWith('twitch:')) {
            elements.inputPlatformIcon.classList.add('platform-twitch');
            elements.inputPlatformIcon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
            `;
        } else if (val.includes('youtube.com') || val.includes('youtu.be')) {
            elements.inputPlatformIcon.classList.add('platform-youtube');
            elements.inputPlatformIcon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
            `;
        } else if (val.includes('kick.com') || val.startsWith('kick:')) {
            elements.inputPlatformIcon.classList.add('platform-kick');
            elements.inputPlatformIcon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 3h5v5.5l5.5-5.5h5.5l-7 7 7.5 11h-5.5l-5.5-8.5V21H4V3z"/>
                </svg>
            `;
        } else {
            elements.inputPlatformIcon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
            `;
        }
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */

    function init() {
        setupEventListeners();
        loadState();
        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
