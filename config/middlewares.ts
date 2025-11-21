export default [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://nuru.ms', 'https://www.nuru.ms'], // <-- Twoja nowa domena frontendu!
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];