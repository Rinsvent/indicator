import type { MetadataRoute } from 'next'

export const dynamic = 'force-static';
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Indicator`s monitoring 2',
        short_name: 'Indicators',
        description: 'Monitor your error on one page',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/favicon/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        screenshots: [
            {
                "src": "/favicon/web-app-manifest-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "form_factor": "wide",
                "label": "Wonder Widgets"
            }
        ]
    }
}