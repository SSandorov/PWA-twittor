// Este archivo es un archivo adicional del SW para poder separar la lógica del mismo
// y que no crezca demasiado en tamaño

// esta función se encargará de guardar en el caché dinámico los request que queramos
const actualizaCacheDinamico = (dynamicCache, req, res) => {
    if(res.ok) {
        return caches.open(dynamicCache)
            .then(cache => {
                cache.put(req, res.clone());
                return res.clone();
            })
    } else {
        return res;
    }
}