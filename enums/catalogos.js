const aS = 'El';
const aP = 'Los';

const catalogos = {
    MEMBRESIAS: { id: 'MEM', articulo_singular: 'La', articulo_plural: 'Las', singular: 'membresía', plural: 'membresías' },
    METODOS_PAGO: { id: 'MEP', articulo_singular: aS, articulo_plural: aP, singular: 'método de pago', plural: 'métodos de pago' },
    PAISES: { id: 'PAI', articulo_singular: aS, articulo_plural: aP, singular: 'país', plural: 'países' },
    ROLE: { id: 'ROL', articulo_singular: aS, articulo_plural: aP, singular: 'rol', plural: 'roles' },
    TIPOS_PRODUCTO: { id: 'TPP', articulo_singular: aS, articulo_plural: aP, singular: 'tipo de producto', plural: 'tipos de producto' },
}

export default Object.freeze(catalogos);
