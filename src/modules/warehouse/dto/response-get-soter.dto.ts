export interface IResGetStore {
    id: number,
    name: string,
    price: string,
    bank_id: number,
    warehouse_id: number,
    category_id: number,
    category: {
        id: number,
        name: string,
        code: string,
        description: null,
        unit_id: number,
        unit: {
            id: number,
            name: string,
            code: string,
            bank_id: null,
            warehouse_id: null,
            description: string
        }
    }
}