import type { PageLoad } from './$types';
import cartState from "$lib/store/cart";
import { runQuery2 } from '$lib/utils'


export const load = (async ({ fetch }) => {
  console.log("[+] Load checkout:", `http://ocpp.k8s.local:8080/cart/?session_id=${cartState.getCartSession()}`)
  const res = await fetch(`http://ocpp.k8s.local:8080/cart/?session_id=${cartState.getCartSession()}`);
  const item = await res.text();
  console.log(item)

  return { "test": "test" };
}) satisfies PageLoad;