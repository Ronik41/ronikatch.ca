import { chapters, whoop, drivewayExperiences, experienceOrder } from './experience.mjs';

// One content source and order for the guided view and the mobile reading view.
export const journey = experienceOrder.map(([id, year]) => ({
  id, year, metrics: [],
  ...(chapters[id] || drivewayExperiences[id] || {
    ...whoop,
    company: 'WHOOP',
    title: 'Better tools for building wearables.',
    description: 'I built manufacturing testers and hardware simulation infrastructure for wearable and charger product lines.',
    image: 'images/whoop ceo.jpg',
    caption: 'With WHOOP CEO Will Ahmed in Boston.',
    metrics: [['$100K+', 'build costs saved per product line']],
    photos: [['images/whoop HQ.jpg', 'WHOOP headquarters in Boston.']],
  }),
}));

export const experiences = Object.fromEntries(journey.map(item => [item.id, item]));
export function adjacentExperience(id, direction) {
  const index = journey.findIndex(item => item.id === id);
  return index < 0 ? null : journey[index + direction] || null;
}
export const experienceLabel = item => `${item.company} · ${item.year}`;
