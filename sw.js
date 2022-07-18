// Gestión del uso de la memoria
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// Elementos del app shell
const APP_SHELL = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/img/avatars/hulk.jpg',
    '/js/app.js'
];

// Elementos del app shell inmutables
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/css/animate.css',
    '/js/libs/jquery.js'
];

// Al instalar el SW añadimos los archivos en sus memorias respectivas
self.addEventListener('install', e => {

    // Añadimos el shell a la variable estática en memoria
    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => {
            cache.addAll(APP_SHELL);
        })

    // Añadimos el shell inmutable a la variable inmutable en memoria
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => {
            cache.addAll(APP_SHELL_INMUTABLE);
        })

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

// Al activar el SW eliminamos los SW anteriores
self.addEventListener('activate', e => {
    const respuesta = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if(key !== STATIC_CACHE && key.includes('static') ) {
                    return caches.delete(key);
                }
            });
        });

    e.waitUntil(respuesta);
});