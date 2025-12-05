import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SVA Bierliste',
    short_name: 'Bierliste',
    description: 'Drinks Management for SVA',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
          src: '/apple-icon.png',
          sizes: '180x180',
          type: 'image/png'
      }
    ],
  }
}
