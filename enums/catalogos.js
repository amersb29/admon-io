const aS = 'El';
const aP = 'Los';

const catalogos = {
    MEMBRESIAS: { id: 'memberships', articulo_singular: 'La', articulo_plural: 'Las', singular: 'membresía', plural: 'membresías' },
    METODOS_PAGO: { id: 'paymentMethods', articulo_singular: aS, articulo_plural: aP, singular: 'método de pago', plural: 'métodos de pago' },
    PAISES: { id: 'countries', articulo_singular: aS, articulo_plural: aP, singular: 'país', plural: 'países' },
    ROLE: { id: 'roles', articulo_singular: aS, articulo_plural: aP, singular: 'rol', plural: 'roles' },
    TIPOS_PRODUCTO: { id: 'tiposProducto', articulo_singular: aS, articulo_plural: aP, singular: 'tipo de producto', plural: 'tipos de producto' },
}

export default Object.freeze(catalogos);
