import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/data/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Exclude any future API or internal routes from indexing.
      disallow: ['/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
