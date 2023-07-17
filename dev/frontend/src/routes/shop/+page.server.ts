import type { PageLoad } from './$types';
import { runQuery2 } from '$lib/utils'


function truncate(str: string, n: number) {
    return (str.length > n) ? str.substring(0, n-1) + '...' : str;
}

export const load = ( async ({ params }:any) => {
    console.log('[+]:', params)

    const { products } = await runQuery2({query: 'get_products'});

    return {
        products: products.map((product: any) => {
            const re = /<p>(.*?)<\/p>/;
            product.excerpt = `<p>${truncate(product.excerpt.match(re)[1], 80)}</p>`
            return product;
        })
    };

}) satisfies PageLoad;