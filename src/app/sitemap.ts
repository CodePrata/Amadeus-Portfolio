import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/data/constants';

/**
 * Static sitemap — this is a single-page portfolio so we only index the root.
 * Extend this array if dedicated routes (e.g. /blog/[slug]) are added later.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
