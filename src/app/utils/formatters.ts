export const convertToPrice = (price:number) => {
    let Cop = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
        
    });

    return Cop.format(price)
}