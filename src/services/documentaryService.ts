/**
 * Ocean Documentary Service
 * Fetches or generates custom National Geographic style documentaries
 * for selected ocean locations using Gemini AI backend or local oceanographic database.
 */

import { OceanLocation } from '../types';
import { DocumentarySection, getDocumentaryForLocation } from '../data/documentaryData';

export async function fetchOrGenerateDocumentary(location: OceanLocation): Promise<DocumentarySection> {
  const fallback = getDocumentaryForLocation(
    location.name,
    location.nearestOcean,
    location.avgTemp,
    location.avgSalinity,
    location.avgDepth,
    location.currentSpeed
  );

  try {
    const res = await fetch('/api/generate-documentary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location }),
    });

    if (!res.ok) return fallback;

    const data = await res.json();
    if (data && data.documentary && data.documentary.overview) {
      return {
        overview: data.documentary.overview || fallback.overview,
        formation: data.documentary.formation || fallback.formation,
        characteristics: data.documentary.characteristics || fallback.characteristics,
        biodiversity: data.documentary.biodiversity || fallback.biodiversity,
        climateImportance: data.documentary.climateImportance || fallback.climateImportance,
        economicImportance: data.documentary.economicImportance || fallback.economicImportance,
        interestingFacts: data.documentary.interestingFacts?.length
          ? data.documentary.interestingFacts
          : fallback.interestingFacts,
        aiSummary: data.documentary.aiSummary || fallback.aiSummary,
      };
    }
  } catch (err) {
    console.warn('[DocumentaryService] Gemini documentary API call failed, using local database:', err);
  }

  return fallback;
}
