import jwtDecode from 'jwt-decode'
import { browser } from '$app/environment';
import { runQuery2 } from "$lib/utils";
import { get, writable } from 'svelte/store';
import no_product from "$lib/images/no_product.png";

const key = 'cart';

type Cart = {
  items?: Item[];
  itemCount?: number;
  total?: string;
  shippingTotal?: string;
  session?: string | boolean;
  cartSession: string;
  loading: boolean;
  adding: {id?: string | false};
}

type Item = {
  key: string;
  name: string;
  description: string;
  shortDescription: string;
  quantity: number;
  price: number;
  wid: number;
  id: string;
  galleryImages: object[];
  averageRating: number;
  type: string;
  onSale: boolean;
  removing: boolean;
};

type AddToCart = {
  id: string;
  quantity: number;
}

type DeleteFromCart = {
  keys: string[];
}

type UpdateQuantity = {
  key: string;
  quantity: number;
}

const defaultState = {
  items: [],
  session: false,
  cartSession: '',
  shippingTotal: "$0.00",
  total: "$0.00",
  itemCount: 0,
  loading: true,
  adding: {},
}

const re = /<p\b[^>]*>(.*?)<\/p>/;

const getDefaultState = () => {
  return JSON.parse(JSON.stringify(defaultState))
}

function truncate(str: string, n: number = 80) {
  return (str.length > n) ? str.substring(0, n-1) + '...' : str;
}

function parseProductImage(node: any) {
  if (node.galleryImages?.nodes.length > 0) {
    return [{
      sourceUrl: node.galleryImages.nodes[0].sourceUrl
    }];
  } else if (node.image?.sourceUrl) {
    return [{
      sourceUrl: node.image.sourceUrl
    }];
  }

  return no_product;
};

function parseCart(data: any, states:Cart, lastOnly: boolean = false) {
  const cart:any = {};

  cart.shippingTotal = data?.shippingTotal;
  cart.total = data?.total;
  cart.itemCount = data?.contents.itemCount;

  const items = data?.contents?.nodes.map((item: any) => {
    return {
      key: item.key,
      id: item.product?.node?.id,
      wid: item.product?.node?.productId,
      name: item.product?.node?.name,
      description: item.product?.node?.description.match(re)[1],
      shortDescription: truncate(item.product?.node?.description.match(re)[1]),
      images: parseProductImage(item.product?.node), // Use srcSet for smaller images
      averageRating: item.product?.node?.averageRating,
      quantity: item.quantity,
      price: item.total,
      removing: false,
    };
  });

  if (lastOnly) {
    states.items?.push(items[0])
    cart.items = states.items;
  } else {
    cart.items = items;
  }

  cart.loading = false;
  if ('adding' in cart) cart.adding = {};

  return cart;
}

const cart:any = (function () {
  // Set default state
  let states = getDefaultState()
  
  // Initialize store
  const store = writable(states)

  // Get store methods
  const { subscribe, set: masterSet } = store

  // Override set method
  const set = (value: Cart) => {

    states = { ...states, ...value } // Don't erase previously set values and ensure state is kept in sync
    masterSet({ ...getDefaultState(), ...states }) // set store and ensure default values are set for missing keys

    // Sync with localStorage
    if (browser) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(
          `the \`${key}\` store's new value \`${value}\` could not be persisted to localStorage because of ${error}`,
        )
      }
    }
  }

  const setRemoving = ({ key, status = true }: { key: string, status: boolean }) => {
    states.items = states.items.map((item: Item) => {
      if (item.key === key) item.removing = status;
      return item;
    })

    set(states);
  }

  const setAdding = (id: string, status = true) => {
    states.loading = true;
    states.adding[id] = status;
    set(states);
  }
  
  return {
    set,
    subscribe,
    // For debugging
    getState: () => {
      return states
    },
    // For debugging
    setLoading: (loading: boolean) => {
      states.loading = loading
      set(states)
    },
    // For debugging
    clearSavedSession: () => {
      if (browser) {
        localStorage.removeItem(key)
      }
      // NOTE: Master set for speed?
      set({...getDefaultState(), loading:false})
    },
    // For debugging
    decodeSession: (jwt: string) => {
      if (!jwt) return
      const decoded = jwtDecode<{ data: { customer_id: string } }>(jwt)
      return decoded.data.customer_id

    },
    setCart: (item: Item) => {
      states.items.push(item)
      set(states)
    },
    setSession: (jwt: string) => {
      if (!jwt) return
      if (browser) {
        if (localStorage.getItem('shopping-session') !== jwt) localStorage.setItem('shopping-session', jwt)
      }
      const newState:Cart = { ...states }
      const decoded = jwtDecode<{ data: { customer_id: string } }>(jwt)
      
      console.log('[+] ---- ---- ---- ---- ----:', jwt, decoded.data.customer_id)
      
      newState.session = jwt
      newState.cartSession = decoded.data.customer_id
      set(newState)
    },
    getCartSession() {
      return states.cartSession
    },
    getSession: () => {
      // Try store, then local storage, then null
      if (states.session) return states.session
      else
        if (browser && localStorage.getItem('shopping-session')) return localStorage.getItem('shopping-session')
      return null
    },
    restoreSession: () => {
      if (browser && localStorage.getItem('shopping-session')) {
        try {
          const session = localStorage.getItem('shopping-session') || ''
          set({ ...states, session })
        } catch (error) {
          console.error(
            `the \`${key}\` store's value could not be restored from localStorage because of ${error}`,
          )
        }
      }
    },
    load: async () => {
      try {
        console.log("[+] Get cart");
        const response = await runQuery2({ query: "get_cart" });
        //console.log("[+] Response:", response);

        const newState:Cart = {...states, ...parseCart(response?.cart, states)}
        //newState = parseCart(response?.cart, states);
        set(newState);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    syncCart: (cart: any) => {
      try {
        console.log("[+] Sync cart", cart);

        const newState:Cart = {...states, ...parseCart(cart, states)}
        //newState = parseCart(cart, states);
        set(newState);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    setAdding,
    add: async ({ id, quantity }: AddToCart) => {
      try {
        console.log("[+] Add item", id, "to cart.");
        setAdding(id)

        const response = await runQuery2(
          {
            query: "add_to_cart",
            data: {
              input: {
                productId: id || null,
                quantity,
              }
            },
          },
        );
  
        console.log("[+] Add cart:", response?.addToCart?.cart);

        const newState:Cart = {...states, ...parseCart(response?.addToCart?.cart, states)};
        //newState = parseCart(response?.addToCart?.cart, states);
        //if (!('adding' in newState)) newState.adding = {}
        newState.adding[id] = false
        
        set(newState);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    setRemoving,
    remove: async ({keys}:DeleteFromCart) => {
      try {
        console.log("[+] Remove item(s)", keys, "to cart.");
  
        const response = await runQuery2(
          {
            query: "remove_from_cart",
            data: {
              input: {
                keys
              },
            },
          }
        );
  
        console.log("[+] Response:", response);

        const newState:Cart = {...states}
        newState.items = states.items.filter((item: Item) => {
          return !keys.includes(item.key)
        })

        newState.itemCount = newState.items?.length

        set(newState);
      } catch (error) {
        console.error("[!] Error:", error);
      }
      setRemoving({ key: keys[0], status: false });
    },
    updateQuantity: async ({ key, quantity }: UpdateQuantity) => {
      try {
        console.log("[+] Update quantity", key, quantity);

        const response = await runQuery2(
          {
            query: "update_cart_item",
            data: {
              input: {
                items: [
                  {
                    key,
                    quantity
                  }
                ]
              },
            },
          }
        );
  
        console.log("[+] Response:", response);

        const newState:Cart = {...states, ...parseCart(response?.updateItemQuantities?.cart, states)}
        //newState = parseCart(response?.updateItemQuantities?.cart, states);
        set(newState);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    }
  }
})()

if (browser) {
  window.getState = cart.getState
  window.setLoading = cart.setLoading
}

export default cart
