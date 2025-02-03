export const convertToPrice = (price:number) => {
    if(!price){
        return;
    }

    let Cop = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
        
    });

    return Cop.format(price)
}