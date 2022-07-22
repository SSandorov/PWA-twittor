// Importación de archivos, librerías y funciones
importScripts('js/sw-utils.js');

// Gestión del uso de la memoria
const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

// Elementos del app shell
const APP_SHELL = [
    // solo tiene sentido en producción'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'

];

// Elementos del app shell inmutables
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
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

                if(key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                    return caches.delete(key);
                }
            });
        });

    e.waitUntil(respuesta);
});

// Añadimos la estrategia del caché: cache with network fallback
self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request)
        .then(res => {
            if(res) {
                return res;
            } else {
                return fetch(e.request)
                    .then(newRes => {
                        return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
                    });
            }
        });

    e.respondWith(respuesta);
});