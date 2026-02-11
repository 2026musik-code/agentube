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
    <div id="app" class="hidden min-h-screen pb-20">
        <!-- Mobile-App Header -->
        <header class="fixed top-0 left-0 right-0 h-16 glass border-b border-[#333] flex items-center justify-between px-4 z-40">
            <div class="flex items-center gap-2" onclick="resetSearch()">
                 <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
                 <div class="text-xl font-bold tracking-tight">AGENT <span class="text-red-500">TUBE</span></div>
            </div>

            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-purple-600 border border-white/20"></div>
        </header>

        <!-- Search Bar (Sticky below header) -->
        <div class="fixed top-16 left-0 right-0 px-4 py-3 bg-[#0f0f0f] z-30">
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
        <div class="fixed top-[7.5rem] left-0 right-0 px-4 pb-2 bg-[#0f0f0f] z-30 overflow-x-auto no-scrollbar flex gap-3 text-sm">
            <button onclick="performSearch('Trending')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-white text-black font-medium">All</button>
            <button onclick="performSearch('Music')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Music</button>
            <button onclick="performSearch('Gaming')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Gaming</button>
            <button onclick="performSearch('News')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">News</button>
            <button onclick="performSearch('Movies')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Movies</button>
            <button onclick="performSearch('Live')" class="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#222] hover:bg-[#333] border border-[#333]">Live</button>
        </div>

        <!-- Content -->
        <main class="pt-[11rem] px-4">
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

            <div id="video-grid" class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <!-- Videos injected here -->
            </div>
        </main>

        <!-- Profile View (Hidden by default) -->
        <main id="profile-view" class="pt-20 px-4 pb-8 hidden">
            <div class="max-w-2xl mx-auto space-y-6">
                <!-- Profile Header -->
                <div class="flex flex-col items-center justify-center py-8">
                    <div class="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg border-2 border-white/20">
                        <span class="text-3xl font-bold">AT</span>
                    </div>
                    <h2 class="text-2xl font-bold tracking-tight">AGENT <span class="text-red-500">TUBE</span></h2>
                    <p class="text-gray-400 text-sm">Developer Profile</p>
                </div>

                <!-- Personal Data Card -->
                <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-[#333] shadow-lg">
                    <h3 class="text-lg font-bold text-white mb-6 border-b border-[#333] pb-2">Informasi Developer</h3>

                    <div class="space-y-4">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-400">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase tracking-wider">Nama</p>
                                <p class="text-white font-medium">NINA KURNIASIH</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-400">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase tracking-wider">Developer</p>
                                <p class="text-white font-medium">AGENT TUBE</p>
                            </div>
                        </div>

                        <a href="mailto:CEODEDI@GMAIL.COM" class="flex items-center gap-4 group cursor-pointer">
                            <div class="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                                <p class="text-white font-medium group-hover:text-red-500 transition-colors">CEODEDI@GMAIL.COM</p>
                            </div>
                        </a>

                        <a href="https://wa.me/6287733745059" target="_blank" class="flex items-center gap-4 group cursor-pointer">
                            <div class="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase tracking-wider">WhatsApp</p>
                                <p class="text-white font-medium group-hover:text-green-500 transition-colors">0877-3374-5059</p>
                            </div>
                        </a>

                        <a href="https://t.me/otomotif_digital" target="_blank" class="flex items-center gap-4 group cursor-pointer">
                            <div class="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase tracking-wider">Telegram</p>
                                <p class="text-white font-medium group-hover:text-blue-500 transition-colors">@otomotif_digital</p>
                            </div>
                        </a>
                    </div>
                </div>

                <!-- About & Legal -->
                <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-[#333] shadow-lg">
                    <h3 class="text-lg font-bold text-white mb-4">Tentang Agent Tube</h3>
                    <p class="text-gray-400 text-sm mb-6 leading-relaxed">
                        Agent Tube adalah platform streaming video premium yang dikembangkan untuk memberikan pengalaman menonton terbaik. Nikmati ribuan konten hiburan tanpa batas.
                    </p>

                    <div class="bg-red-900/20 border border-red-900/50 rounded-xl p-4">
                        <div class="flex items-start gap-3">
                            <svg class="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <div>
                                <h4 class="text-white font-bold text-sm mb-1">PERINGATAN HAK CIPTA</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">
                                    Dilarang keras menyalin, menduplikasi, atau mendistribusikan ulang sebagian atau seluruh konten dan desain web ini tanpa izin tertulis dari pengembang.
                                </p>
                                <p class="text-gray-500 text-[10px] mt-2 italic">
                                    Dilindungi oleh Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta dan Undang-Undang Informasi dan Transaksi Elektronik (UU ITE).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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
            <div class="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <span class="text-[10px] font-medium">Library</span>
            </div>
            <div id="nav-profile" class="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer" onclick="showProfile()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span class="text-[10px] font-medium">Profile</span>
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
        <div class="relative w-full aspect-video bg-black shadow-2xl flex-shrink-0 z-20">
            <iframe id="player-frame" class="w-full h-full" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
                showHome();
                // Load random recommendations
                const randomTopics = ['Trending Indonesia', 'Viral Video', 'Music Hits', 'Lucu', 'Berita Terkini'];
                const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
                performSearch(randomTopic);
            }, 500);
        }

        function showHome() {
            // Hide Profile
            document.getElementById('profile-view').classList.add('hidden');
            // Show Home content
            document.querySelector('#app > header').classList.remove('hidden');
            document.querySelector('#app > div.fixed.top-16').classList.remove('hidden'); // Search bar
            document.querySelector('#app > div.fixed.top-[7.5rem]').classList.remove('hidden'); // Categories
            document.querySelector('#app > main').classList.remove('hidden'); // Video grid

            // Update Nav Icons
            document.getElementById('nav-home').className = 'flex flex-col items-center gap-1 text-red-500 cursor-pointer';
            document.getElementById('nav-home').querySelector('svg').setAttribute('fill', 'currentColor');

            document.getElementById('nav-profile').className = 'flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer';
            document.getElementById('nav-profile').querySelector('svg').setAttribute('fill', 'none');

            window.scrollTo(0,0);
        }

        function showProfile() {
            // Hide Home content
            document.querySelector('#app > header').classList.add('hidden');
            document.querySelector('#app > div.fixed.top-16').classList.add('hidden'); // Search bar
            document.querySelector('#app > div.fixed.top-[7.5rem]').classList.add('hidden'); // Categories
            document.querySelector('#app > main').classList.add('hidden'); // Video grid

            // Show Profile
            document.getElementById('profile-view').classList.remove('hidden');

            // Update Nav Icons
            document.getElementById('nav-home').className = 'flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer';
            document.getElementById('nav-home').querySelector('svg').setAttribute('fill', 'none');

            document.getElementById('nav-profile').className = 'flex flex-col items-center gap-1 text-red-500 cursor-pointer';
            document.getElementById('nav-profile').querySelector('svg').setAttribute('fill', 'currentColor');

            window.scrollTo(0,0);
        }

        async function fetchVideos(query) {
            try {
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
                return { success: false, error: e.message };
            }
        }

        async function performSearch(queryOverride) {
            const query = queryOverride || document.getElementById('search-input').value;
            if (!query) return;

            const grid = document.getElementById('video-grid');
            const loader = document.getElementById('loading');

            grid.innerHTML = '';
            loader.classList.remove('hidden');

            const data = await fetchVideos(query);
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
            div.querySelector('img').src = video.thumbnail;
            div.querySelector('.duration').textContent = video.duration;
            div.querySelector('.title').textContent = video.title;
            div.querySelector('.author').textContent = video.author;
            div.querySelector('.meta').textContent = \`\${video.views} views • \${video.uploadDate}\`;

            return div;
        }

        function openPlayer(video) {
            // Extract Video ID
            // Format: https://youtube.com/watch?v=xf6BYQBForI
            let videoId = '';
            try {
                // video might be an object (from grid) or URL (if called directly, though we updated usage)
                // Let's assume object usage updated everywhere.
                // If it's a string (legacy/url), treat as before.
                const url = (typeof video === 'string') ? video : video.url;
                const urlObj = new URL(url);
                videoId = urlObj.searchParams.get('v');
            } catch (e) {
                console.error("Invalid URL", video);
            }

            if (videoId) {
                const embedUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
                document.getElementById('player-frame').src = embedUrl;

                // Set Info if object provided
                if (typeof video === 'object') {
                    document.getElementById('player-title').textContent = video.title || 'Unknown Title';
                    document.getElementById('player-author').textContent = video.author || 'Unknown Channel';
                    document.getElementById('player-views').textContent = (video.views ? video.views + ' views' : '');
                    document.getElementById('player-date').textContent = video.uploadDate || '';
                }

                document.getElementById('player-modal').classList.remove('hidden');

                // Load Related Recommendations below player (reset list)
                const relatedGrid = document.getElementById('related-grid');
                relatedGrid.innerHTML = '';
                loadMoreRelated(true);
            }
        }

        async function loadMoreRelated(reset = false) {
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

            // Randomize related search
            const relatedTopics = ['Recommended', 'Viral Shorts', 'New Music', 'Trending Now', 'Gaming', 'News', 'Movies'];
            const topic = relatedTopics[Math.floor(Math.random() * relatedTopics.length)];

            const data = await fetchVideos(topic);

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
