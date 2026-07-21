// Centralized asset references so brand media lives in one place.
export const ASSETS = {
  logo: '/__l5e/assets-v1/f79ed6ef-dea9-4dcb-afc9-53d952a8890b/marble_logo.png',

  heroVideo:
    'https://res.cloudinary.com/dn5jjkar4/video/upload/v1784305304/Airplane_Hero_jtfwx4.mp4',

  experienceVideo:
    'https://res.cloudinary.com/dn5jjkar4/video/upload/v1784417042/grok-video-13ef7880-d54b-41a7-8d92-8e0f0a543654_1_hmtxpw.mp4',

  flightVideo:
    'https://res.cloudinary.com/dn5jjkar4/video/upload/v1784425068/Sky_Globe_vid_rdo8u4.mp4',

  whoWeAreBg:
    '/__l5e/assets-v1/b0a6b59b-1a1c-44bc-8589-611a6bb90bb0/who-we-are-bg.jpeg',
} as const

// Shared container width used by the nav + hero content.
export const CONTAINER_WIDTH = 'min(1400px, 94%)'
