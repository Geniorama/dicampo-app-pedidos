export type Contact = {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    typeDoc: string,
    numDoc: string,
    phone?: string
}

export type Client = {
    id: string,
    companyName: string,
    companyId: string,
    address?: string,
    contact?: Contact,
    contactEmail?: Contact['email'],
    contactPhone?: Contact['phone']
}

export type Attribute = {
    id: string,
    name: string,
    values: []
}

export type Product = {
    id: string,
    name: string,
    description?: string,
    price: number,
    attributes: Attribute[]
}

export type ItemCart = Omit<Product, 'attributes'| 'description'> & {
    quantity: number,
    subtotal: number,
    attributesSelected?: {
        id: Attribute['id'],
        name: Attribute['name'],
        lines: {
            value: string,
            quantity: number
        }[]
    }[]
}

export type Order = {
    title?: string,
    items: ItemCart[],
    clientId: Client['id'],
    clientName: Client['companyName'],
    startDate: string,
    notes?: string,
    total: number,
    sellerEmail?: string | undefined | null
}