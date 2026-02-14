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

        /* Toast Animation */
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .toast-enter { animation: slideIn 0.3s ease-out forwards; }
    </style>
</head>
<body class="bg-[#0f0f0f] text-white font-sans antialiased overflow-x-hidden">

    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none"></div>

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
    <div id="app" class="hidden min-h-screen pb-20">
        <!-- Mobile-App Header -->
        <header id="app-header" class="fixed top-0 left-0 right-0 h-16 glass border-b border-[#333] flex items-center justify-between px-4 z-40">
            <div class="flex items-center gap-2" onclick="resetSearch()">
                 <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
                 <div class="text-xl font-bold tracking-tight">AGENT <span class="text-red-500">TUBE</span></div>
            </div>

            <div onclick="changeAccessKey()" class="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-purple-600 border border-white/20 cursor-pointer hover:scale-110 transition-transform shadow-lg relative group">
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </div>
            </div>
        </header>

        <!-- Search Bar (Sticky below header) -->
        <div id="search-bar-container" class="fixed top-16 left-0 right-0 px-4 py-3 bg-[#0f0f0f] z-30">
            <div class="relative group">
                <input type="text" id="search-input"
                    class="w-full bg-[#1a1a1a] border border-[#333] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="Cari video, film, atau musik...">
                <svg class="absolute left-3 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <button onclick="performSearch()" class="absolute right-2 top-2 bg-red-600 p-1 rounded-lg hover:bg-red-700 transition-colors">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
        </div>

        <!-- Category Chips -->
        <div id="category-nav" class="fixed top-[7.5rem] left-0 right-0 px-4 pb-2 bg-[#0f0f0f] z-30 overflow-x-auto no-scrollbar flex gap-3 text-sm">
            <button onclick="performSearch('Trending')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-white text-black font-medium">All</button>
            <button onclick="performSearch('Music')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Music</button>
            <button onclick="performSearch('Gaming')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Gaming</button>
            <button onclick="performSearch('News')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">News</button>
            <button onclick="performSearch('Movies')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Movies</button>
            <button onclick="performSearch('Drakor')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Drakor</button>
            <button onclick="performSearch('Live')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Live</button>
        </div>

        <!-- Content -->
        <main id="main-content" class="pt-[11rem] px-4">
            <!-- Hero / Featured Banner (Static Mockup for "Mewah" feel) -->
            <div id="hero-banner" class="mb-6 relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-[#333]">
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" class="w-full h-full object-cover opacity-60">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4">
                    <span class="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-2 inline-block">Featured</span>
                    <h2 class="text-2xl font-bold text-white mb-1 drop-shadow-md">Welcome to Agent Tube</h2>
                    <p class="text-gray-300 text-sm line-clamp-1">Stream unlimited music and videos with premium experience.</p>
                </div>
            </div>

            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-white">Rekomendasi Untukmu</h3>
                <span class="text-xs text-red-500 font-medium cursor-pointer">Lihat Semua</span>
            </div>

            <div id="loading" class="hidden flex justify-center py-10">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
            </div>

            <div id="video-grid" class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-h-[100px]">
                <!-- Videos injected here -->
            </div>

            <!-- Load More Button Container -->
            <div id="load-more-container" class="flex justify-center py-8 pb-20 hidden">
                 <button onclick="loadMoreMain()" class="group flex items-center gap-2 bg-[#222] hover:bg-[#333] border border-[#333] px-6 py-3 rounded-full transition-all active:scale-95">
                     <span class="text-sm font-medium group-hover:text-white text-gray-300">Muat Lebih Banyak</span>
                     <div class="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                         <svg class="w-4 h-4 text-white animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                     </div>
                 </button>
            </div>
        </main>

        <!-- Drakor View (Hidden by default) -->
        <main id="drakor-view" class="pt-20 px-4 pb-24 hidden">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-2">
                    <div class="w-1 h-8 bg-red-600 rounded-full"></div>
                    <h2 class="text-2xl font-bold tracking-tight">AGENT <span class="text-red-500">TUBE</span></h2>
                </div>
                <!-- Drakor Sub-Nav -->
                <div class="flex bg-[#1a1a1a] rounded-full p-1 border border-[#333]">
                    <button onclick="switchDrakorTab('random')" id="btn-drakor-random" class="px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-white text-black">Random</button>
                    <button onclick="switchDrakorTab('latest')" id="btn-drakor-latest" class="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-gray-400 hover:text-white">Latest</button>
                    <button onclick="switchDrakorTab('trending')" id="btn-drakor-trending" class="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-gray-400 hover:text-white">Trending</button>
                </div>
            </div>

            <div id="drakor-loading" class="flex justify-center py-20">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
            </div>

            <div id="drakor-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <!-- Drakor items injected here -->
            </div>
        </main>

        <!-- Bottom Navigation (Mobile App Style) -->
        <nav class="fixed bottom-0 left-0 right-0 h-16 bg-[#0f0f0f] border-t border-[#333] flex items-center justify-around z-40 pb-safe">
            <div id="nav-home" class="flex flex-col items-center gap-1 text-red-500 cursor-pointer" onclick="showHome()">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                <span class="text-[10px] font-medium">Home</span>
            </div>
            <div id="nav-trending" class="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer" onclick="performSearch('Trending'); showHome()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span class="text-[10px] font-medium">Trending</span>
            </div>
            <!-- Modified Library to Drakor -->
            <div id="nav-drakor" class="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer" onclick="showDrakor()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span class="text-[10px] font-medium">Drakor</span>
            </div>
        </nav>
    </div>

    <!-- Video Player Modal -->
    <div id="player-modal" class="fixed inset-0 z-50 bg-black hidden flex flex-col">
        <!-- Sticky Header in Modal -->
        <div class="bg-black/90 backdrop-blur border-b border-[#333] px-4 py-3 flex items-center justify-between z-30 sticky top-0">
            <div class="flex items-center gap-2">
                 <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
                 <div class="text-lg font-bold tracking-tight text-white">AGENT <span class="text-red-500">TUBE</span></div>
            </div>
            <button onclick="closePlayer()" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Sticky Player Container (Full Width) -->
        <div id="player-container" class="relative w-full aspect-video bg-black shadow-2xl flex-shrink-0 z-20">
            <iframe id="player-frame" class="w-full h-full" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <video id="native-player" class="w-full h-full object-contain bg-black hidden" controls autoplay playsinline></video>
        </div>

        <!-- Scrollable Content Section -->
        <div class="flex-1 overflow-y-auto w-full bg-[#0f0f0f] relative z-10">
             <div class="max-w-6xl mx-auto px-4 py-4">

                <!-- Video Info -->
                <div class="mb-6 border-b border-[#333] pb-4">
                    <h2 id="player-title" class="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight"></h2>
                    <div class="flex items-center gap-2 text-sm text-gray-400">
                        <span id="player-author" class="hover:text-white cursor-pointer font-medium"></span>
                        <span>•</span>
                        <span id="player-views"></span>
                        <span>•</span>
                        <span id="player-date"></span>
                    </div>
                </div>

                <h3 class="text-lg font-bold text-white mb-4">Video Terkait & Trending</h3>
                <div id="related-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                    <!-- Related videos injected here -->
                    <div class="col-span-full text-center py-8">
                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                </div>

                <!-- Load More Button -->
                <div class="flex justify-center pb-20 pt-4">
                    <button onclick="loadMoreRelated()" class="flex flex-col items-center gap-2 text-gray-400 hover:text-red-500 transition-colors animate-bounce">
                        <span class="text-sm font-medium">Lebih Banyak</span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        /* INJECT_KEY_HERE */
        const API_BASE = window.location.origin;
        let AUTH_KEY = localStorage.getItem('agent_tube_key');

        const extraTopics = ['Musik Populer Indonesia', 'Film Aksi Terbaik', 'Game Mobile Legends', 'Vlog Artis Indonesia', 'Komedi Lucu', 'Berita Viral Hari Ini', 'Kuliner Enak Jakarta', 'Teknologi Terbaru', 'Anime Hits', 'Cover Lagu Terbaik'];

        // Global Error Handler
        window.onerror = function(msg, url, line, col, error) {
            showToast(\`System Error: \${msg}\`);
            return false;
        };

        // Check Upstream Key
        if (typeof UPSTREAM_KEY === 'undefined') {
            showToast('CRITICAL: API Configuration Missing (Key Injection Failed)', 'error');
        }

        // Toast System
        function showToast(message, type = 'error') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            let colorClass = 'bg-red-600';
            if (type === 'success') colorClass = 'bg-green-600';
            if (type === 'info') colorClass = 'bg-blue-600';

            toast.className = \`\${colorClass} text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] pointer-events-auto toast-enter border border-white/10\`;
            toast.innerHTML = \`
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span class="text-sm font-medium">\${message}</span>
                <button onclick="this.parentElement.remove()" class="ml-auto hover:bg-white/20 rounded p-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            \`;

            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }

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
                showToast('Auth Error: ' + e.message);
                return false;
            }
        }

        function showApp() {
            const login = document.getElementById('login-screen');
            login.style.opacity = '0';
            setTimeout(() => {
                login.classList.add('hidden');
                document.getElementById('app').classList.remove('hidden');

                // Restore last active tab
                const lastTab = localStorage.getItem('active_tab');
                if (lastTab === 'drakor') {
                    showDrakor();
                } else {
                    showHome();
                    // Load random recommendations only if showing home initially
                    const randomTopics = ['Trending Indonesia', 'Viral Video', 'Music Hits', 'Lucu', 'Berita Terkini'];
                    const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
                    performSearch(randomTopic);
                }
            }, 500);
        }

        function showHome() {
            localStorage.setItem('active_tab', 'home');
            // Hide Drakor View
            document.getElementById('drakor-view').classList.add('hidden');

            const header = document.getElementById('app-header');
            const searchBar = document.getElementById('search-bar-container');
            const categories = document.getElementById('category-nav');
            const mainContent = document.getElementById('main-content');

            // Ensure elements exist before modifying
            if (header) header.classList.remove('hidden');
            if (searchBar) searchBar.classList.remove('hidden');
            if (categories) categories.classList.remove('hidden');
            if (mainContent) mainContent.classList.remove('hidden');

            // Update Nav Icons
            document.getElementById('nav-home').className = 'flex flex-col items-center gap-1 text-red-500 cursor-pointer';
            document.getElementById('nav-home').querySelector('svg').setAttribute('fill', 'currentColor');

            document.getElementById('nav-drakor').className = 'flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer';
            document.getElementById('nav-drakor').querySelector('svg').setAttribute('fill', 'none');

            window.scrollTo(0,0);
        }

        async function showDrakor() {
            localStorage.setItem('active_tab', 'drakor');
            // Hide Home Elements
            document.getElementById('app-header').classList.add('hidden');
            document.getElementById('search-bar-container').classList.add('hidden');
            document.getElementById('category-nav').classList.add('hidden');
            document.getElementById('main-content').classList.add('hidden');

            // Show Drakor View
            document.getElementById('drakor-view').classList.remove('hidden');

            // Update Nav Icons
            document.getElementById('nav-home').className = 'flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer';
            document.getElementById('nav-home').querySelector('svg').setAttribute('fill', 'none');

            document.getElementById('nav-drakor').className = 'flex flex-col items-center gap-1 text-red-500 cursor-pointer';
            document.getElementById('nav-drakor').querySelector('svg').setAttribute('fill', 'currentColor');

            // Fetch content if empty
            const drakorGrid = document.getElementById('drakor-grid');
            if (drakorGrid.children.length === 0) {
                await fetchDrakor('random');
            }

            window.scrollTo(0,0);
        }

        async function switchDrakorTab(type) {
            // Update Tab UI
            ['random', 'latest', 'trending'].forEach(t => {
                const btn = document.getElementById('btn-drakor-' + t);
                if (t === type) {
                    btn.className = 'px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-white text-black';
                } else {
                    btn.className = 'px-4 py-1.5 rounded-full text-xs font-bold transition-all text-gray-400 hover:text-white';
                }
            });

            await fetchDrakor(type);
        }

        async function fetchDrakor(type = 'random', query = '') {
            const grid = document.getElementById('drakor-grid');
            const loader = document.getElementById('drakor-loading');

            grid.innerHTML = ''; // Clear existing
            loader.classList.remove('hidden');

            let url = 'https://www.magma-api.biz.id/dramabox/random';
            if (type === 'latest') url = 'https://www.magma-api.biz.id/dramabox/latest';
            if (type === 'trending') url = 'https://www.magma-api.biz.id/dramabox/trending';
            if (type === 'search' && query) url = 'https://www.magma-api.biz.id/dramabox/search?query=' + encodeURIComponent(query);

            try {
                // Use www subdomain to ensure CORS headers are present (prevents Redirect 307 which causes CORS issues)
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to load Drakor data');

                const data = await res.json();
                loader.classList.add('hidden');

                // The API returns { status: true, data: [...] }
                const items = data.data || data.result;

                if (items && items.length > 0) {
                    items.forEach(item => {
                        try {
                            const card = createDrakorCard(item);
                            grid.appendChild(card);
                        } catch (e) {
                            console.error(e);
                        }
                    });
                } else {
                    grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-10">No dramas found.</div>';
                }
            } catch (e) {
                loader.classList.add('hidden');
                showToast('Drakor API Error: ' + e.message);
                grid.innerHTML = '<div class="col-span-full text-center text-red-500 py-10">Failed to load content.</div>';
            }
        }

        function createDrakorCard(item) {
            const div = document.createElement('div');
            div.className = 'group cursor-pointer relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-transparent hover:border-red-600 transition-all';

            // Prepare video object for player
            // Use the first video in cdnList or direct videoPath if available
            // Prioritize higher quality or default
            let videoUrl = item.videoPath;
            if (item.cdnList && item.cdnList.length > 0) {
                 const cdn = item.cdnList.find(c => c.isDefault) || item.cdnList[0];
                 if (cdn && cdn.videoPathList && cdn.videoPathList.length > 0) {
                     // Try to find 720p or just take first
                     const quality = cdn.videoPathList.find(v => v.quality === 720) || cdn.videoPathList[0];
                     videoUrl = quality.videoPath;
                 }
            }

            const currentEp = (item.chapterIndex !== undefined) ? item.chapterIndex + 1 : 1;
            const totalEp = item.totalChapterNum || '?';

            const videoObj = {
                title: item.bookName,
                author: "Drakor Premium",
                videoPath: videoUrl,
                uploadDate: item.playCount ? item.playCount + ' Plays' : 'New',
                episode: \`Episode \${currentEp} / \${totalEp}\`,
                bookId: item.bookId // Store ID for fallback fetch
            };

            div.onclick = () => {
                if (videoObj.videoPath) {
                    openPlayer(videoObj);
                } else if (videoObj.bookId) {
                    playDrakorById(videoObj.bookId, videoObj);
                } else {
                    showToast("Maaf, konten ini tidak dapat diputar.");
                }
            };

            div.innerHTML = \`
                <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div class="absolute bottom-3 left-3 right-3">
                    <span class="episode-badge bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block"></span>
                    <h3 class="card-title text-white font-bold text-sm line-clamp-2 leading-tight drop-shadow-md"></h3>
                </div>
            \`;

            div.querySelector('img').src = item.bookCover;
            div.querySelector('.episode-badge').textContent = \`EP \${currentEp} / \${totalEp}\`;
            div.querySelector('.card-title').textContent = item.bookName;

            return div;
        }

        async function fetchVideos(query) {
            try {
                if (typeof UPSTREAM_KEY === 'undefined') {
                    throw new Error("API Key not injected");
                }

                // Fetch directly from upstream API (Client Side) to bypass IP Block (403)
                // Use the injected UPSTREAM_KEY (injected by src/index.js)
                const targetUrl = 'https://api.ferdev.my.id/search/youtube?query=' + encodeURIComponent(query) + '&apikey=' + UPSTREAM_KEY;

                const res = await fetch(targetUrl);

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error('Upstream API Error: ' + res.status + ' ' + res.statusText + ' - ' + errorText.substring(0, 100));
                }
                return await res.json();
            } catch (e) {
                console.error(e);
                showToast(e.message); // Show visible error
                return { success: false, error: e.message };
            }
        }

        async function performSearch(queryOverride, isLoadMore = false) {
            const query = queryOverride || document.getElementById('search-input').value;
            if (!query) return;

            // Check if we are in Drakor Mode
            const isDrakorMode = !document.getElementById('drakor-view').classList.contains('hidden');

            if (isDrakorMode) {
                // Perform Drakor Search
                fetchDrakor('search', query);
                return;
            }

            // Normal YouTube Search
            const grid = document.getElementById('video-grid');
            const loader = document.getElementById('loading');
            const loadMoreBtn = document.getElementById('load-more-container');

            if (!isLoadMore) {
                grid.innerHTML = '';
                loadMoreBtn.classList.add('hidden'); // Hide until loaded
            }

            // If it's a new search, show full screen loader, else maybe small spinner (but simple here)
            if (!isLoadMore) loader.classList.remove('hidden');

            try {
                const data = await fetchVideos(query);
                if (!isLoadMore) loader.classList.add('hidden');

                if (data.success && data.result) {
                    if (data.result.length === 0) {
                        if (!isLoadMore) grid.innerHTML = '<div class="col-span-full text-center text-gray-500">No videos found for your search.</div>';
                    } else {
                        data.result.forEach(video => {
                            try {
                                const card = createVideoCard(video);
                                grid.appendChild(card);
                            } catch (renderErr) {
                                console.error("Render Error for item", video, renderErr);
                                showToast("Render Error: " + renderErr.message);
                            }
                        });
                        // Show load more button if we have results
                        loadMoreBtn.classList.remove('hidden');
                    }
                } else {
                    const errorMsg = data.error || 'Unknown Error';
                    if (!isLoadMore) grid.innerHTML = \`<div class="col-span-full text-center text-red-500">API Error: \${errorMsg}</div>\`;
                    showToast("API Error: " + errorMsg);
                }
            } catch (err) {
                if (!isLoadMore) {
                    loader.classList.add('hidden');
                    grid.innerHTML = \`<div class="col-span-full text-center text-red-500">System Error: \${err.message}</div>\`;
                }
                showToast("System Error: " + err.message);
            }
        }

        async function loadMoreMain() {
            // Pick a random topic to simulate infinite feed
            const topic = extraTopics[Math.floor(Math.random() * extraTopics.length)];
            const btn = document.querySelector('#load-more-container button');

            // Add spinning state to button
            const originalText = btn.innerHTML;
            btn.innerHTML = '<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>';
            btn.disabled = true;

            await performSearch(topic, true);

            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
        }

        function createVideoCard(video) {
            const div = document.createElement('div');
            div.className = 'group cursor-pointer';
            // Pass the entire video object to openPlayer
            div.onclick = () => openPlayer(video);

            // Safe rendering to prevent XSS
            div.innerHTML = \`
                <div class="relative aspect-video rounded-xl overflow-hidden mb-3 border border-transparent group-hover:border-white/20 transition-all">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                    <div class="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium duration"></div>
                </div>
                <div class="flex gap-3">
                    <div class="flex-1">
                        <h3 class="font-semibold text-sm line-clamp-2 leading-tight mb-1 group-hover:text-white text-gray-100 title"></h3>
                        <div class="text-xs text-gray-400">
                            <p class="hover:text-gray-300 author"></p>
                            <p class="meta"></p>
                        </div>
                    </div>
                </div>
            \`;

            // Set text content safely
            if (video.thumbnail) div.querySelector('img').src = video.thumbnail;
            if (video.duration) div.querySelector('.duration').textContent = video.duration;
            if (video.title) div.querySelector('.title').textContent = video.title;
            if (video.author) div.querySelector('.author').textContent = video.author;
            div.querySelector('.meta').textContent = \`\${video.views || 0} views • \${video.uploadDate || ''}\`;

            return div;
        }

        function openPlayer(video) {
            // Check if native video (Drakor) or YouTube (Standard)
            const iframe = document.getElementById('player-frame');
            const nativeVideo = document.getElementById('native-player');
            const playerContainer = document.getElementById('player-container');

            // Drakor Safety Check: If Author is Drakor Premium but no path, show error
            if (video.author === "Drakor Premium" && !video.videoPath) {
                showToast("Maaf, video ini belum tersedia untuk diputar.");
                return;
            }

            // Reset state
            iframe.src = '';
            nativeVideo.src = '';
            nativeVideo.classList.add('hidden');
            iframe.classList.add('hidden');

            if (video.videoPath) {
                // Native Player Mode (Drakor) - Mobile/Portrait View
                playerContainer.className = "relative w-full max-w-sm mx-auto aspect-[9/16] bg-black shadow-2xl flex-shrink-0 z-20";

                nativeVideo.src = video.videoPath;
                nativeVideo.classList.remove('hidden');
                nativeVideo.play().catch(e => console.error("Autoplay failed", e));
            } else {
                // YouTube Mode - Standard Landscape View
                playerContainer.className = "relative w-full aspect-video bg-black shadow-2xl flex-shrink-0 z-20";

                let videoId = '';
                try {
                    const url = (typeof video === 'string') ? video : video.url;
                    const urlObj = new URL(url);
                    videoId = urlObj.searchParams.get('v');
                } catch (e) {
                    console.error("Invalid URL", video);
                }

                if (videoId) {
                    const embedUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
                    iframe.src = embedUrl;
                    iframe.classList.remove('hidden');
                } else {
                    showToast("Video ID not found");
                    return;
                }
            }

            // Set Info if object provided
            if (typeof video === 'object') {
                const titleText = video.episode ? \`\${video.title} (\${video.episode})\` : (video.title || 'Unknown Title');
                document.getElementById('player-title').textContent = titleText;
                document.getElementById('player-author').textContent = video.author || 'Unknown Channel';
                document.getElementById('player-views').textContent = (video.views ? video.views + (String(video.views).includes('views') ? '' : ' views') : '');
                document.getElementById('player-date').textContent = video.uploadDate || '';
            }

            document.getElementById('player-modal').classList.remove('hidden');

            // Load Related Recommendations below player (reset list)
            // Pass the video type to loadMoreRelated to fetch appropriate content
            const type = video.videoPath ? 'drakor' : 'youtube';
            loadMoreRelated(true, type);
        }

        async function loadMoreRelated(reset = false, type = 'youtube') {
            const relatedGrid = document.getElementById('related-grid');

            if (reset) {
                 relatedGrid.innerHTML = '<div class="col-span-full text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div></div>';
            } else {
                 // Append loader at bottom if loading more
                 const loader = document.createElement('div');
                 loader.id = 'related-loader';
                 loader.className = 'col-span-full text-center py-4';
                 loader.innerHTML = '<div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-600"></div>';
                 relatedGrid.appendChild(loader);
            }

            // Determine content source based on type
            let data = { success: false, result: [] };

            if (type === 'drakor') {
                // Fetch random Drakor for recommendations
                try {
                    const res = await fetch('https://www.magma-api.biz.id/dramabox/random');
                    if (res.ok) {
                        const json = await res.json();
                        const items = json.data || json.result || [];
                        // Convert Drakor items to standard video objects
                        data.success = true;
                        data.result = items.map(item => {
                            let videoUrl = item.videoPath;
                            if (item.cdnList && item.cdnList.length > 0) {
                                 const cdn = item.cdnList.find(c => c.isDefault) || item.cdnList[0];
                                 if (cdn && cdn.videoPathList && cdn.videoPathList.length > 0) {
                                     const quality = cdn.videoPathList.find(v => v.quality === 720) || cdn.videoPathList[0];
                                     videoUrl = quality.videoPath;
                                 }
                            }
                            return {
                                title: item.bookName,
                                author: "Drakor Premium",
                                videoPath: videoUrl,
                                thumbnail: item.bookCover,
                                duration: 'Full Episode',
                                views: item.playCount,
                                uploadDate: 'Ep ' + (item.totalChapterNum || '?')
                            };
                        });
                    }
                } catch (e) {
                    console.error("Drakor related fetch failed", e);
                }
            } else {
                // Youtube Search
                const relatedTopics = ['Recommended', 'Viral Shorts', 'New Music', 'Trending Now', 'Gaming', 'News', 'Movies'];
                const topic = relatedTopics[Math.floor(Math.random() * relatedTopics.length)];
                data = await fetchVideos(topic);
            }

            if (reset) relatedGrid.innerHTML = '';
            else {
                const loader = document.getElementById('related-loader');
                if (loader) loader.remove();
            }

            if (data.success && data.result) {
                 data.result.forEach(video => {
                    const card = createVideoCard(video);
                    // Override click to stay in modal
                    card.onclick = () => {
                         // Pass full video object to update UI correctly
                         openPlayer(video);
                         // Scroll to top of modal content
                         document.querySelector('#player-modal .overflow-y-auto').scrollTop = 0;
                    };
                    relatedGrid.appendChild(card);
                });
            } else if (reset) {
                 relatedGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">No related videos found.</div>';
            }

            // Re-attach Load More Button for Related
            const loadMoreContainer = document.createElement('div');
            loadMoreContainer.className = 'col-span-full flex justify-center py-4';
            loadMoreContainer.innerHTML = \`
                <button id="btn-load-more-related" class="flex flex-col items-center gap-2 text-gray-400 hover:text-red-500 transition-colors animate-bounce">
                    <span class="text-sm font-medium">Lebih Banyak</span>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </button>
            \`;
            relatedGrid.appendChild(loadMoreContainer);

            // Bind click to load more
            document.getElementById('btn-load-more-related').onclick = function() {
                this.parentElement.remove(); // Remove button before loading
                // Add loader
                 const loader = document.createElement('div');
                 loader.id = 'related-loader';
                 loader.className = 'col-span-full text-center py-4';
                 loader.innerHTML = '<div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-600"></div>';
                 relatedGrid.appendChild(loader);

                 loadMoreRelated(false, type);
            };
        }

        async function playDrakorById(bookId, meta) {
            showToast("Memuat video...", "success");
            try {
                // Fetch random/details using bookId to get a playable chapter
                const res = await fetch('https://www.magma-api.biz.id/dramabox/random?bookId=' + bookId);
                if (!res.ok) throw new Error("Gagal memuat detail video");

                const json = await res.json();
                const items = json.data || json.result;

                if (items && items.length > 0) {
                    const detail = items[0]; // Take first playable chapter found

                    // Extract Video URL logic (same as createDrakorCard)
                    let videoUrl = detail.videoPath;
                    if (detail.cdnList && detail.cdnList.length > 0) {
                         const cdn = detail.cdnList.find(c => c.isDefault) || detail.cdnList[0];
                         if (cdn && cdn.videoPathList && cdn.videoPathList.length > 0) {
                             const quality = cdn.videoPathList.find(v => v.quality === 720) || cdn.videoPathList[0];
                             videoUrl = quality.videoPath;
                         }
                    }

                    if (videoUrl) {
                        // Merge details
                        const fullObj = {
                            ...meta,
                            videoPath: videoUrl,
                            episode: \`Episode \${(detail.chapterIndex || 0) + 1} / \${detail.totalChapterNum || '?'}\`
                        };
                        openPlayer(fullObj);
                    } else {
                        showToast("Maaf, stream tidak ditemukan untuk drama ini.");
                    }
                } else {
                    showToast("Detail video tidak ditemukan.");
                }
            } catch (e) {
                console.error(e);
                showToast("Error: " + e.message);
            }
        }

        function closePlayer() {
            document.getElementById('player-frame').src = ''; // Stop YouTube
            document.getElementById('native-player').pause(); // Stop Native
            document.getElementById('native-player').src = '';
            document.getElementById('player-modal').classList.add('hidden');
        }

        function resetSearch() {
            document.getElementById('search-input').value = '';
            performSearch('Music');
        }

        async function changeAccessKey() {
            if (confirm("Logout and remove Access Key from server?")) {
                const currentKey = localStorage.getItem('agent_tube_key');
                if (currentKey) {
                    try {
                        showToast("Deleting key from server...", "info");
                        const res = await fetch(API_BASE + '/auth', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: currentKey })
                        });

                        const data = await res.json();
                        if (!res.ok) {
                            if (res.status === 403) {
                                alert("Cannot delete Master Key. Logging out locally.");
                            } else {
                                alert("Failed to delete key from server: " + (data.error || 'Unknown Error'));
                            }
                        } else {
                            showToast("Key deleted successfully from server.", "success");
                            await new Promise(r => setTimeout(r, 1500));
                        }
                    } catch (e) {
                        console.error("Logout error", e);
                        alert("Network error. Logging out locally.");
                    }
                }

                localStorage.removeItem('agent_tube_key');
                location.reload();
            }
        }
    </script>
</body>
</html>
`;
