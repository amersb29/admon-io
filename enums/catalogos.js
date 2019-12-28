const aS = 'El';
const aP = 'Los';

const catalogos = {
    MEMBRESIAS: { id: 'memberships', folder: 'catalogos', articulo_singular: 'La', articulo_plural: 'Las', singular: 'membresía', plural: 'membresías' },
    METODOS_PAGO: { id: 'paymentMethods', folder: 'catalogos', articulo_singular: aS, articulo_plural: aP, singular: 'método de pago', plural: 'métodos de pago' },
    PAISES: { id: 'countries', folder: 'catalogos', articulo_singular: aS, articulo_plural: aP, singular: 'país', plural: 'países' },
    ROLE: { id: 'roles', folder: 'catalogos', articulo_singular: aS, articulo_plural: aP, singular: 'rol', plural: 'roles' },
    TIPOS_PRODUCTO: { id: 'tiposProducto', folder: 'catalogos', articulo_singular: aS, articulo_plural: aP, singular: 'tipo de producto', plural: 'tipos de producto' },

    USUARIOS: {id: 'users',  folder: 'usuarios', articulo_singular: aS, articulo_plural: aP, singular: 'usuario', plural: 'usuarios' },
    PRODUCTOS: {id: 'products',  folder: 'productos', articulo_singular: aS, articulo_plural: aP, singular: 'producto', plural: 'productos' },
    SEDES: {id: 'sedes',  folder: 'sedes', articulo_singular: 'La', articulo_plural: 'Las', singular: 'sede', plural: 'sedes' },
}

export default Object.freeze(catalogos);
