/**
 * MultiView Pro — Video Grid & Live Stream Viewer
 * Supports YouTube & Twitch simultaneously with persistence, sharing, and custom layouts.
 */

(function () {
    'use strict';

    // Application State
    const state = {
        streams: [],
        layout: 'auto',
        spotlightId: null
    };

    const STORAGE_KEY_STREAMS = 'multiview_pro_streams';
    const STORAGE_KEY_LAYOUT = 'multiview_pro_layout';

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

        // Share Modal
        shareModal: document.getElementById('shareModal'),
        btnCloseShareModal: document.getElementById('btnCloseShareModal'),
        shareUrlInput: document.getElementById('shareUrlInput'),
        btnCopyShareLink: document.getElementById('btnCopyShareLink')
    };

    // Preset Collections
    const PRESETS = {
        'lofi': [
            { type: 'youtube', id: 'jfKfPfyJRdk', title: 'Lofi Girl - beats to relax/study to' }
        ],
        'nasa': [
            { type: 'youtube', id: 'P9C25Un7xaM', title: 'NASA ISS Live Stream' }
        ],
        'synthwave': [
            { type: 'youtube', id: '4xDzrJKXOOY', title: 'synthwave radio - chill synth / retro' }
        ],
        'twitch-esports': [
            { type: 'twitch', id: 'shroud', title: 'Twitch: shroud' }
        ],
        'quad-demo': [
            { type: 'youtube', id: 'jfKfPfyJRdk', title: 'Lofi Girl' },
            { type: 'youtube', id: 'P9C25Un7xaM', title: 'NASA Earth Live' },
            { type: 'youtube', id: '4xDzrJKXOOY', title: 'Synthwave Radio' },
            { type: 'twitch', id: 'shroud', title: 'Twitch Stream' }
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
     * Parses input string to identify platform and channel / video ID.
     * Returns null if invalid.
     */
    function parseStreamUrl(rawUrl) {
        if (!rawUrl || typeof rawUrl !== 'string') return null;
        const trimmed = rawUrl.trim();
        if (!trimmed) return null;

        // 1. YouTube matching
        // Supports: watch?v=..., youtu.be/..., youtube.com/live/..., youtube.com/shorts/..., youtube.com/embed/...
        const ytRegex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
        const ytMatch = trimmed.match(ytRegex);

        if (ytMatch && ytMatch[1]) {
            const videoId = ytMatch[1];
            return {
                id: 'stream_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                type: 'youtube',
                identifier: videoId,
                title: `YouTube: ${videoId}`,
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
                title: `YouTube: ${trimmed}`,
                embedUrl: `https://www.youtube-nocookie.com/embed/${trimmed}?autoplay=1&mute=0&enablejsapi=1`,
                watchUrl: `https://www.youtube.com/watch?v=${trimmed}`
            };
        }

        // 2. Twitch matching
        // Supports: twitch.tv/channel_name or twitch:channel_name
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
            const parentHost = getTwitchHostParent();
            // Parent parameter is required by Twitch player
            let twitchUrl = `https://player.twitch.tv/?channel=${channelName}&parent=${parentHost}&autoplay=true&muted=false`;
            if (parentHost !== 'localhost') {
                twitchUrl += `&parent=localhost`;
            }

            return {
                id: 'stream_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                type: 'twitch',
                identifier: channelName,
                title: `Twitch: ${channelName}`,
                embedUrl: twitchUrl,
                watchUrl: `https://www.twitch.tv/${channelName}`
            };
        }

        // 3. Kick stream matching (bonus)
        const kickRegex = /(?:https?:\/\/)?(?:www\.)?kick\.com\/([a-zA-Z0-9_]{3,25})(?:\/.*)?/i;
        const kickMatch = trimmed.match(kickRegex);
        if (kickMatch && kickMatch[1]) {
            const kickChannel = kickMatch[1].toLowerCase();
            return {
                id: 'stream_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                type: 'kick',
                identifier: kickChannel,
                title: `Kick: ${kickChannel}`,
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
            console.warn('Unable to save state to localStorage:', e);
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
        // First check URL hash for shared streams
        if (window.location.hash && window.location.hash.includes('streams=')) {
            try {
                const params = new URLSearchParams(window.location.hash.substring(1));
                const streamsParam = params.get('streams');
                const layoutParam = params.get('layout');

                if (layoutParam && ['auto', 'spotlight', 'grid-2x2', 'grid-3x3'].includes(layoutParam)) {
                    state.layout = layoutParam;
                }

                if (streamsParam) {
                    const items = streamsParam.split(',');
                    const loaded = [];
                    for (const item of items) {
                        if (item.startsWith('yt:')) {
                            const parsed = parseStreamUrl(item.substring(3));
                            if (parsed) loaded.push(parsed);
                        } else if (item.startsWith('tw:')) {
                            const parsed = parseStreamUrl('twitch:' + item.substring(3));
                            if (parsed) loaded.push(parsed);
                        } else if (item.startsWith('kick:')) {
                            const parsed = parseStreamUrl('https://kick.com/' + item.substring(5));
                            if (parsed) loaded.push(parsed);
                        } else {
                            const parsed = parseStreamUrl(item);
                            if (parsed) loaded.push(parsed);
                        }
                    }

                    if (loaded.length > 0) {
                        state.streams = loaded;
                        showToast(`Loaded ${loaded.length} shared streams!`, 'success');
                        return;
                    }
                }
            } catch (err) {
                console.warn('Error reading shared URL hash:', err);
            }
        }

        // Otherwise load from localStorage
        try {
            const savedStreams = localStorage.getItem(STORAGE_KEY_STREAMS);
            const savedLayout = localStorage.getItem(STORAGE_KEY_LAYOUT);

            if (savedLayout && ['auto', 'spotlight', 'grid-2x2', 'grid-3x3'].includes(savedLayout)) {
                state.layout = savedLayout;
            }

            if (savedStreams) {
                const parsed = JSON.parse(savedStreams);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    state.streams = parsed.map(item => {
                        let reconstructed;
                        if (item.type === 'twitch') {
                            reconstructed = parseStreamUrl(`https://twitch.tv/${item.identifier}`);
                        } else if (item.type === 'kick') {
                            reconstructed = parseStreamUrl(`https://kick.com/${item.identifier}`);
                        } else {
                            reconstructed = parseStreamUrl(item.identifier);
                        }
                        if (reconstructed && item.title) {
                            reconstructed.title = item.title;
                        }
                        return reconstructed;
                    }).filter(Boolean);
                }
            }
        } catch (e) {
            console.warn('Error reading localStorage:', e);
        }
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

        // Apply layout class
        elements.videoGrid.className = 'video-grid layout-' + state.layout;

        // If in spotlight mode and no spotlight item is set, default to first stream
        if (state.layout === 'spotlight' && (!state.spotlightId || !state.streams.some(s => s.id === state.spotlightId))) {
            state.spotlightId = state.streams[0]?.id || null;
        }

        // Render card elements
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

        // Platform badge styling
        const badgeClass = stream.type === 'youtube' ? 'badge-youtube' : (stream.type === 'twitch' ? 'badge-twitch' : 'badge-generic');
        const badgeLabel = stream.type === 'youtube' ? 'YouTube' : (stream.type === 'twitch' ? 'Twitch' : 'Kick');

        card.innerHTML = `
            <div class="card-header">
                <div class="card-info">
                    <span class="card-badge ${badgeClass}">${badgeLabel}</span>
                    <span class="card-title" title="${escapeHtml(stream.title)}">${escapeHtml(stream.title)}</span>
                </div>
                <div class="card-actions">
                    <button type="button" class="card-btn btn-spotlight ${isSpotlight ? 'active-spotlight' : ''}" title="${isSpotlight ? 'In Spotlight' : 'Focus in Spotlight / Cinema Mode'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-reload" title="Reload stream player">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-external" title="Open on ${badgeLabel}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-fullscreen" title="Fullscreen this video">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    </button>
                    <button type="button" class="card-btn btn-remove" title="Remove stream">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <iframe 
                    src="${stream.embedUrl}" 
                    title="${escapeHtml(stream.title)}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
        `;

        // Attach Card Button Event Listeners
        const btnSpotlight = card.querySelector('.btn-spotlight');
        btnSpotlight.addEventListener('click', () => {
            state.layout = 'spotlight';
            state.spotlightId = stream.id;
            saveState();
            render();
            showToast(`Spotlight focused: ${stream.title}`, 'info');
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
                showToast(`Reloaded ${stream.title}`, 'info');
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
        showToast('Stream removed', 'info');
    }

    function addSingleStream(rawUrl, showNotification = true) {
        const parsed = parseStreamUrl(rawUrl);
        if (!parsed) {
            showToast('Invalid URL. Enter a valid YouTube or Twitch link.', 'error');
            return false;
        }

        // Avoid adding exact duplicate
        const exists = state.streams.some(s => s.type === parsed.type && s.identifier === parsed.identifier);
        if (exists) {
            showToast('This stream is already in your grid!', 'info');
            return false;
        }

        state.streams.push(parsed);
        saveState();
        render();

        if (showNotification) {
            showToast(`Added ${parsed.title}!`, 'success');
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
            showToast(`Successfully added ${addedCount} stream(s)!`, 'success');
        } else {
            showToast('No new valid streams found to add.', 'error');
        }
    }

    function loadPreset(presetKey) {
        const list = PRESETS[presetKey];
        if (!list) return;

        let addedCount = 0;
        list.forEach(item => {
            let url = item.id;
            if (item.type === 'twitch') {
                url = `https://twitch.tv/${item.id}`;
            } else if (item.type === 'youtube') {
                url = `https://youtube.com/watch?v=${item.id}`;
            }

            const parsed = parseStreamUrl(url);
            if (parsed) {
                if (item.title) parsed.title = item.title;
                const exists = state.streams.some(s => s.type === parsed.type && s.identifier === parsed.identifier);
                if (!exists) {
                    state.streams.push(parsed);
                    addedCount++;
                }
            }
        });

        saveState();
        render();
        showToast(`Loaded ${addedCount} preset streams!`, 'success');
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
        elements.streamCountText.textContent = `${count} stream${count === 1 ? '' : 's'} active`;
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
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
        }

        toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3600);
    }

    /* ==========================================================================
       Modals & Input Handling
       ========================================================================== */

    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.style.display = 'flex';
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.style.display = 'none';
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

        // Input live change detection for YouTube vs Twitch
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

        // Clear All streams button
        elements.btnClearAll.addEventListener('click', () => {
            if (state.streams.length === 0) return;
            if (confirm('Are you sure you want to remove all streams from the grid?')) {
                state.streams = [];
                state.spotlightId = null;
                saveState();
                render();
                showToast('All streams cleared', 'info');
            }
        });

        // Batch Modal handlers
        elements.btnOpenBatchModal.addEventListener('click', () => {
            elements.batchTextarea.value = '';
            openModal(elements.batchModal);
            elements.batchTextarea.focus();
        });
        elements.btnCloseBatchModal.addEventListener('click', () => closeModal(elements.batchModal));
        elements.btnCancelBatch.addEventListener('click', () => closeModal(elements.batchModal));
        elements.btnSubmitBatch.addEventListener('click', () => {
            const text = elements.batchTextarea.value;
            if (text.trim()) {
                addBatchStreams(text);
                closeModal(elements.batchModal);
            }
        });

        // Presets Modal handlers
        elements.btnPresets.addEventListener('click', () => {
            openModal(elements.presetsModal);
        });
        elements.btnClosePresetsModal.addEventListener('click', () => closeModal(elements.presetsModal));

        // Presets option clicks in modal
        elements.presetsModal.addEventListener('click', (e) => {
            const card = e.target.closest('.preset-option-card');
            if (card && card.dataset.preset) {
                loadPreset(card.dataset.preset);
                closeModal(elements.presetsModal);
            }
        });

        // Empty state quick chips
        elements.emptyState.addEventListener('click', (e) => {
            const chip = e.target.closest('.preset-chip');
            if (chip && chip.dataset.preset) {
                loadPreset(chip.dataset.preset);
            }
        });

        // Share Modal & URL Generation
        elements.btnShare.addEventListener('click', () => {
            if (state.streams.length === 0) {
                showToast('Add some streams before sharing!', 'info');
                return;
            }

            updateUrlHash();
            elements.shareUrlInput.value = window.location.href;
            openModal(elements.shareModal);
            elements.shareUrlInput.select();
        });

        elements.btnCloseShareModal.addEventListener('click', () => closeModal(elements.shareModal));

        elements.btnCopyShareLink.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(elements.shareUrlInput.value);
                showToast('Link copied to clipboard!', 'success');
                closeModal(elements.shareModal);
            } catch (err) {
                elements.shareUrlInput.select();
                document.execCommand('copy');
                showToast('Link copied to clipboard!', 'success');
                closeModal(elements.shareModal);
            }
        });

        // App Fullscreen toggle
        elements.btnFullscreenApp.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });

        // Sound tip
        elements.btnToggleAllAudio.addEventListener('click', () => {
            showToast('Tip: Browsers block unmuted autoplay. Click un-mute directly on the video player.', 'info');
        });

        // Close modals with Escape or backdrop click
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(elements.batchModal);
                closeModal(elements.presetsModal);
                closeModal(elements.shareModal);
            }
        });

        [elements.batchModal, elements.presetsModal, elements.shareModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });
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
