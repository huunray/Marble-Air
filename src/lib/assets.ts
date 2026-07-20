// Centralized asset references so brand media lives in one place.
export const ASSETS = {
  logo: '/__l5e/assets-v1/f79ed6ef-dea9-4dcb-afc9-53d952a8890b/marble_logo.png',

  heroVideo:
    'https://res.cloudinary.com/dn5jjkar4/video/upload/v1784305304/Airplane_Hero_jtfwx4.mp4',

  walkthrough: {
    mp4: '/__l5e/assets-v1/65444370-5fc2-47e8-aa87-fea827ba10ca/aeris-walkthrough-scrub.mp4',
    webm: '/__l5e/assets-v1/4d5103f3-2f35-4ec7-9a15-067ea3fa5c9f/aeris-walkthrough-scrub.webm',
  },

  skyGlobe: {
    mp4: '/__l5e/assets-v1/432dfcfb-0f50-46ae-b4b2-4ed2dc7b2f17/sky-globe-scrub.mp4',
    webm: '/__l5e/assets-v1/eca3a46d-64ed-4356-b26b-e9acd72f249f/sky-globe-scrub.webm',
  },

  whoWeAreBg:
    '/__l5e/assets-v1/b0a6b59b-1a1c-44bc-8589-611a6bb90bb0/who-we-are-bg.jpeg',

  cabins: {
    first: '/__l5e/assets-v1/9c365550-e922-4bd6-848d-405c169cd590/cabin-first.jpg',
    business:
      '/__l5e/assets-v1/0f3d5921-92ca-47bf-84aa-eb0a380fc199/cabin-business.jpg',
    economy:
      '/__l5e/assets-v1/f3a26779-1aa0-471c-804d-94da53a170b6/cabin-economy.jpg',
  },
} as const

// Shared container width used by the nav + hero content.
export const CONTAINER_WIDTH = 'min(1400px, 94%)'
