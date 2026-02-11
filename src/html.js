export default `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AGENT TUBE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom scrollbar for mewah feel */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f0f0f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        .glass { background: rgba(20, 20, 20, 0.95); backdrop-filter: blur(10px); }
    </style>
</head>
<body class="bg-[#0f0f0f] text-white font-sans antialiased overflow-x-hidden">

    <!-- Login Screen -->
    <div id="login-screen" class="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
        <div class="text-center p-8">
            <h1 class="text-5xl font-bold mb-8 tracking-tighter text-red-600">AGENT <span class="text-white">TUBE</span></h1>
            <p class="text-gray-400 mb-6">Enter Access Key</p>
            <input type="password" id="access-key" class="w-64 bg-[#1a1a1a] border border-[#333] rounded-full px-6 py-3 text-center text-white focus:outline-none focus:border-red-600 transition-colors" placeholder="••••••••">
            <div id="login-error" class="text-red-500 mt-4 h-6 text-sm"></div>
        </div>
    </div>

    <!-- Main App (Hidden by default) -->
    <div id="app" class="hidden min-h-screen">
        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 h-16 glass border-b border-[#333] flex items-center justify-between px-4 z-40">
            <div class="flex items-center gap-4">
                 <div class="text-2xl font-bold tracking-tighter cursor-pointer" onclick="resetSearch()">
                    <span class="text-red-600">AGENT</span> TUBE
                 </div>
            </div>

            <div class="flex-1 max-w-2xl px-4">
                <div class="relative group">
                    <input type="text" id="search-input"
                        class="w-full bg-[#121212] border border-[#333] rounded-full pl-6 pr-12 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Search">
                    <button onclick="performSearch()" class="absolute right-0 top-0 h-full px-4 rounded-r-full bg-[#222] border border-l-0 border-[#333] hover:bg-[#333] transition-colors">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </div>

            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-purple-600"></div>
        </header>

        <!-- Sidebar (Optional, maybe just hidden on mobile) -->

        <!-- Content -->
        <main class="pt-20 px-4 pb-8">
            <div id="loading" class="hidden flex justify-center mt-10">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>

            <div id="video-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <!-- Videos injected here -->
            </div>
        </main>
    </div>

    <!-- Video Player Modal -->
    <div id="player-modal" class="fixed inset-0 z-50 bg-black/90 hidden flex items-center justify-center backdrop-blur-sm">
        <div class="relative w-full max-w-6xl aspect-video bg-black shadow-2xl rounded-lg overflow-hidden border border-[#333]">
            <button onclick="closePlayer()" class="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-red-600 rounded-full p-2 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <iframe id="player-frame" class="w-full h-full" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </div>

    <script>
        /* KEY_INJECTION_POINT */
        // NOTE: UPSTREAM_KEY is injected by src/index.js (const UPSTREAM_KEY = "...";)

        const API_BASE = window.location.origin;
        let AUTH_KEY = localStorage.getItem('agent_tube_key');

        // Check if previously logged in (optimistic)
        if (AUTH_KEY) {
           verifyKey(AUTH_KEY).then(valid => {
               if (valid) showApp();
               else {
                   localStorage.removeItem('agent_tube_key');
                   document.getElementById('login-screen').classList.remove('hidden');
               }
           });
        }

        document.getElementById('access-key').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });

        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        async function handleLogin() {
            const key = document.getElementById('access-key').value;
            if (!key) return;

            const valid = await verifyKey(key);
            if (valid) {
                localStorage.setItem('agent_tube_key', key);
                AUTH_KEY = key;
                showApp();
            } else {
                const err = document.getElementById('login-error');
                err.textContent = "Invalid Access Key";
                err.classList.add('animate-pulse');
                setTimeout(() => err.classList.remove('animate-pulse'), 1000);
            }
        }

        async function verifyKey(key) {
            try {
                const res = await fetch(API_BASE + '/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key })
                });
                return res.ok;
            } catch (e) {
                return false;
            }
        }

        function showApp() {
            const login = document.getElementById('login-screen');
            login.style.opacity = '0';
            setTimeout(() => {
                login.classList.add('hidden');
                document.getElementById('app').classList.remove('hidden');
                // Load default recommendations
                performSearch('Judika'); // Default query from prompt logic
            }, 500);
        }

        async function performSearch(queryOverride) {
            const query = queryOverride || document.getElementById('search-input').value;
            if (!query) return;

            const grid = document.getElementById('video-grid');
            const loader = document.getElementById('loading');

            grid.innerHTML = '';
            loader.classList.remove('hidden');

            try {
                // Fetch directly from upstream API to avoid Worker IP Block (403)
                // Use the injected UPSTREAM_KEY
                const targetUrl = `https://api.ferdev.my.id/search/youtube?query=\${encodeURIComponent(query)}&apikey=\${UPSTREAM_KEY}`;

                const res = await fetch(targetUrl, {
                    method: 'GET',
                     // Usually browsers set User-Agent automatically.
                     // We don't need Authorization header here because we use the API key in the URL.
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Upstream API Error: \${res.status} \${res.statusText} - \${errorText}`);
                }

                const data = await res.json();

                loader.classList.add('hidden');

                if (data.success && data.result) {
                    if (data.result.length === 0) {
                        grid.innerHTML = '<div class="col-span-full text-center text-gray-500">No videos found for your search.</div>';
                    } else {
                        data.result.forEach(video => {
                            const card = createVideoCard(video);
                            grid.appendChild(card);
                        });
                    }
                } else {
                    const errorMsg = data.error || 'Unknown Error';
                    grid.innerHTML = \`<div class="col-span-full text-center text-red-500">API Error: \${errorMsg}</div>\`;
                }

            } catch (e) {
                console.error(e);
                loader.classList.add('hidden');
                grid.innerHTML = '<div class="col-span-full text-center text-red-500">Error loading videos</div>';
            }
        }

        function createVideoCard(video) {
            const div = document.createElement('div');
            div.className = 'group cursor-pointer';
            div.onclick = () => openPlayer(video.url);

            div.innerHTML = \`
                <div class="relative aspect-video rounded-xl overflow-hidden mb-3 border border-transparent group-hover:border-white/20 transition-all">
                    <img src="\${video.thumbnail}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    <div class="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium">
                        \${video.duration}
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="flex-1">
                        <h3 class="font-semibold text-sm line-clamp-2 leading-tight mb-1 group-hover:text-white text-gray-100">\${video.title}</h3>
                        <div class="text-xs text-gray-400">
                            <p class="hover:text-gray-300">\${video.author}</p>
                            <p>\${video.views} views • \${video.uploadDate}</p>
                        </div>
                    </div>
                </div>
            \`;
            return div;
        }

        function openPlayer(url) {
            // Extract Video ID
            // Format: https://youtube.com/watch?v=xf6BYQBForI
            let videoId = '';
            try {
                const urlObj = new URL(url);
                videoId = urlObj.searchParams.get('v');
            } catch (e) {
                console.error("Invalid URL", url);
            }

            if (videoId) {
                const embedUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
                document.getElementById('player-frame').src = embedUrl;
                document.getElementById('player-modal').classList.remove('hidden');
            }
        }

        function closePlayer() {
            document.getElementById('player-frame').src = ''; // Stop video
            document.getElementById('player-modal').classList.add('hidden');
        }

        function resetSearch() {
            document.getElementById('search-input').value = '';
            performSearch('Music');
        }
    </script>
</body>
</html>
`;
