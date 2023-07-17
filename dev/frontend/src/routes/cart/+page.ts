import type { PageLoad } from './$types';
import { runQuery2 } from '$lib/utils'
  
export const load: PageLoad = (async ({url, fetch}) => {
    const { cart } = await runQuery2(
        {
            //dataFetcher: fetch, //TODO: Fix headers issue
            query: 'get_cart',
            session: url.searchParams.get('c') || null
        }
    );

    return cart

}) satisfies PageLoad;