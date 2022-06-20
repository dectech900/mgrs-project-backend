export class AddProductToCartDto {
    product_id: string
    quantity: number
    size: string
    color: string
    sub_total: number
    grand_total: number
    price: number
}

export class UpdateCartDto {
    quantity: number
    size: string
    color: string
}