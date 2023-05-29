const existRoutes = {
    routes: '/',
    gates: '/config/gates',
    fallbacks: '/config/fallbacks',
    blockedphones: '/config/blockedphones',
    regions: '/config/regions',
    templates: '/config/templates',
    contracts: '/contracts',
    analytics: '/analytics',
    contacts: '/contacts',
};

const serverUrls = {
    ping: '/api/ping',

    getSome: '/api/get/templates',
    putSome: '/api/put/templates',
};

export { existRoutes, serverUrls };
