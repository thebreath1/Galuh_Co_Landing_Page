<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'GALUH & CO.') }} | Hampers Mewah & Corporate Gifting</title>
        <meta name="description" content="Koleksi hampers premium dan corporate gifting mewah dari GALUH & CO. Dikurasi dengan sentuhan personal, delikasi artisanal, dan pengemasan eksklusif berkelas.">
        
        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="GALUH & CO. | Hampers Mewah & Corporate Gifting Eksklusif">
        <meta property="og:description" content="Merangkai kehangatan di setiap hantaran berkesan. Pilihan hampers Lebaran, Natal, Corporate, dan Wedding terbaik.">
        <meta property="og:image" content="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="GALUH & CO. | Hampers Mewah & Corporate Gifting Eksklusif">
        <meta name="twitter:description" content="Merangkai kehangatan di setiap hantaran berkesan. Pilihan hampers Lebaran, Natal, Corporate, dan Wedding terbaik.">
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop">

        <meta name="theme-color" content="#1B382B">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <!-- Preconnect Google Fonts for performance / fast LCP -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

        <style>
            html {
                background-color: #FDFBF7;
                color: #2C2724;
            }
        </style>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head />
    </head>
    <body class="font-sans antialiased bg-[#FDFBF7] text-[#2C2724] selection:bg-[#C8A951]/20 selection:text-[#1B382B]">
        <x-inertia::app />
    </body>
</html>
