// Split categories string and return 3rd category
function parseCategories(categories: string) {
    return categories.split(' > ')[2];
}

export function barcodelookup(data: any) {
    const product = data.products[0];

    const item = {
        id: '',
        barcode: product.barcode_number,
        categories: product.category,
        category: parseCategories(product.category),
        title: product.title,
        description: product.description,
        weight: product.size
    };

    // console.log("[ITEM]:", item)
    return item
}