import { browser } from '$app/environment';
import { v4 as uuidv4 } from 'uuid'
import { get, writable } from 'svelte/store';
import { load, save } from '$lib/store/localStorage'
import { barcodelookup } from "$lib/utils/apiDataParser";

const key = 'cart';

// TODO: Skip keys such as items, which can be large arrays
function deepMerge(object: any, mergedObject: any) {
  for (const key in mergedObject) {
    if (mergedObject.hasOwnProperty(key)) {
      if (typeof object[key] == 'object' && typeof mergedObject[key] == 'object') {
        object[key] = deepMerge(object[key], mergedObject[key]);
        continue;
      }

      object[key] = mergedObject[key];
    }
  }

  return object;
}

// Get API data parser for frontend
export function getParser(api: string) {
  switch (api) {
    case 'api.barcodelookup.com':
      return barcodelookup
    /*case 'api.upcdatabase.org':
      return upcdatabase
    case 'barcode-lookup.p.rapidapi.com':
      return rapidapi*/
    default:
      throw new Error(`Unknown API: ${api}`)
  }
}

// Get API details for backend
export function getAPI(api: string): [(arg0: string) => string, string, object] {
  switch (api) {
    case 'api.barcodelookup.com':
      return [(url: string): string => `https://api.barcodelookup.com/v3/products?barcode=${url}&formatted=n&key=t99zd8z6jsa8kh502702qg7gn6m4ng`, 'GET', {}]
    /*case 'api.upcdatabase.org':
      return [(url: string): string => `https://api.upcdatabase.org/product/${upc}`, {}]
    case 'barcode-lookup.p.rapidapi.com':
      return [(url: string): string => `https://barcode-lookup.p.rapidapi.com/v3/products?barcode=${upc}`, {}]*/
    default:
      throw new Error(`Unknown API: ${api}`)
  }
}

type Boxes = {
  [id: string]: {
    id: string;
    items: string[];
    count: number;
    weight: number;
  };
}

type MetaData = {
  loading: boolean;
  currentBoxId: number;
  boxes: number[];
  batchItems: string[];
  boxesMetaData: Boxes;
};

export type Cart = {
  campaign: string;
  itemsCount: number;
  totalWeight: number;
  totalBoxes: number;
  items: Item[];
  //boxes: Boxes;
  metaData: MetaData;
  debugOutput: object;
}

export type Item = {
  id: string;
  barcode: string;
  categories: string;
  category: string;
  title: string;
  description: string;
  weight: string;
  qty: number;
  boxId: string;
};

const defaultState: Cart = {
  campaign: "",
  totalWeight: 0,
  itemsCount: 0,
  totalBoxes: 1,
  items: [],
  //boxes: {},
  // Meta is dynamically created and should not be persisted
  // TODO: move totalWeight, itemsCount, totalBoxes, and boxes(?) to meta
  metaData: {
    loading: true,
    currentBoxId: 1,
    boxes: [1],
    batchItems: [],
    boxesMetaData: {}
  },
  debugOutput: {}
}

const getDefaultState = (): Cart => {
  return JSON.parse(JSON.stringify({ ...defaultState, ...{ boxes: updateBoxDetails(defaultState) }, debugOutput: addDebugOutput(defaultState) }))
}

const processWeight = (weight: string, qty: number): number => {
  let pounds: number = 0;

  const re = /(^[.?\d]+)(.*$)/;
  const match = re.exec(weight);

  if (!match) return 0

  switch (match[2].trim().toLowerCase()) {
    case "kg":
      pounds = Number(match[1]) / 0.45359237 * qty;
      break;

    case "g":
      pounds = Number(match[1]) * 0.002205 * qty;
      break;

    case "oz":
      pounds = Number(match[1]) * 0.0625 * qty;
      break;

    default:
      pounds = 0;
  }

  //console.log("[WEIGHT]:", qty, weight, match, pounds);
  return pounds;
}

function refreshData(state: Cart): { totalWeight: number, itemsCount: number, metaData: MetaData } {
  const itemsCount: number = state.items.reduce((acc, item) => {
    return acc += item.qty
  }, 0)
  const totalWeight: number = state.items.reduce((acc: number, item: Item) => {
    return acc += processWeight(item.weight || '0', item.qty);
  }, 0)

  const boxesMetaData: Boxes = state.metaData.boxes.reduce((acc: Boxes, boxId: number) => {
    acc[boxId] = {
      id: boxId.toString(),
      items: state.items.filter((item: Item) => item.boxId === boxId.toString()).map((item: Item) => item.id),
      count: state.items.filter((item: Item) => item.boxId === boxId.toString()).reduce((acc, item) => {
        return acc += item.qty
      }, 0) || 0,
      weight: state.items.filter((item: Item) => item.boxId === boxId.toString()).reduce((acc: number, item: Item) => {
        return acc += processWeight(item.weight || '0', item.qty);
      }, 0)
    }

    return acc;
  }, {})

  return {
    totalWeight, itemsCount, metaData: { ...state.metaData, boxesMetaData }
  }
}

function addDebugOutput(state: { items?: Item[], debugOutput?: object }) {
  const debugOutput = { ...state } // Copy Cart
  delete debugOutput.items // Remove items from debug output
  delete debugOutput.debugOutput // Remove debug output from debug output

  // Return a modified copy of the cart
  return debugOutput
}

function groupBarcodes(state: Cart): Item[] {
  // Group barcodes
  const groupedBarcodes = state.items.reduce((acc: { [id: string]: Item }, item: Item) => {
    const id = `${item.barcode}-${item.boxId}`

    if (!acc[id]) {
      acc[id] = { ...item }
    } else {
      acc[id].qty = acc[id].qty + item.qty
    }

    return acc
  }, {})

  console.log("[Grouped Barcodes]", Object.values(groupedBarcodes))
  return Object.values(groupedBarcodes)
}

function updateBoxDetails(state: Cart) {
  console.log("[Calculate Box Details]", state)

  try {
    const boxDetails = state.metaData.boxes.reduce((acc: Boxes, boxId: number) => {
      acc[boxId] = {
        ...state.metaData.boxesMetaData[boxId],
        count: state.metaData.boxesMetaData[boxId]?.items.length || 0,
        weight: state.metaData.boxesMetaData[boxId]?.items.reduce((acc: number, itemId: string) => {
          return acc += processWeight(state.items.find((item: Item) => item.id === itemId)?.weight || '0');
        }, 0)
      }

      // HACK: Add box id if it doesn't exist (I can do better than this)
      if (!acc[boxId]?.items) acc[boxId].items = []
      if (!acc[boxId]?.id) acc[boxId].id = boxId.toString()
      if (!acc[boxId]?.weight) acc[boxId].weight = 0

      return acc
    }, {})

    return boxDetails
  } catch (error) {
    console.error("[!] Error:", error);
    return {}
  }
}

const cart: any = (function () {
  let state = getDefaultState()

  // Set default state
  try {
    state = deepMerge(state, load(key))
    state = { ...state, items: groupBarcodes(state) } // Group barcodes
    state = { ...state, ...refreshData(state) } // Update calculations
    state = { ...state, ...{ debugOutput: addDebugOutput(state) } } /// Update debug details

    //debugger
    //state = load(key)
  } catch (error) {
    console.error("[!] Error:", error);
  }

  // Initialize store
  const store = writable(state)

  // Get store methods
  const { subscribe, set: masterSet } = store

  // Override set method
  const set = (value: Cart) => {
    console.log("[Set]", value)

    state = { ...state, ...value } // Don't erase previously set values and ensure state is kept in sync
    state = { ...state, items: groupBarcodes(state) } // Group barcodes
    state = { ...state, ...refreshData(state) } // Update calculations
    state = { ...state, ...{ debugOutput: addDebugOutput(state) } } // Update debug details

    masterSet({ ...getDefaultState(), ...state }) // set store and ensure default values are set for missing keys

    // Sync with localStorage
    save(key, state)
  }

  return {
    set,
    subscribe,
    // For debugging
    getState: () => {
      return state
    },
    /*setLoading: (loading: boolean) => {
      state.loading = loading
      set(state)
    },*/
    add: async (item: Item) => {
      console.log("[Add item]", item)
      item.id = uuidv4()

      try {
        // Add item to box for tracking
        state.metaData.boxesMetaData[state.metaData.currentBoxId].items.push(item.id)

        // Add box id to item
        item.boxId = state.metaData.currentBoxId.toString()

        // Ensure qty is a number
        item.qty = Number(item.qty) || 1

        // Add item to cart
        state.items.push(item)

        // Update state
        set(state);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    // TODO: I should just update the qty instead of duplicating the item
    duplicate: async (id: string, duplicates: number) => {
      console.log("[Duplicate item]", id, duplicates)

      // Duplicate items
      const duplicateItems: Item[] = []

      // Get a copy of item
      const duplicateItem = { ...state.items.find((item: Item) => item.id === id) } as Item

      try {
        for (let i = 0; i < (duplicates); i++) {
          // Generate new id
          duplicateItem.id = uuidv4()
          duplicateItem.qty = 1

          // Add item to box for tracking
          state.metaData.boxesMetaData[state.metaData.currentBoxId].items.push(duplicateItem.id)

          // Add box id to item
          duplicateItem.boxId = state.metaData.currentBoxId.toString()

          // Add duplicated item to cart
          duplicateItems.push({ ...duplicateItem })
        }

        // If no duplicates, do nothing
        if (Object.keys(duplicateItems).length === 0) return

        // Merge items and save to state
        set({ ...state, items: [...state.items, ...duplicateItems] });
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    remove: async (id: string) => {
      console.log("Remove item", id)
      try {
        const newState: Cart = { ...state, items: [...state.items.filter((item: Item) => item.id !== id)] };

        set(newState);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    update: async (updatedItem: Item) => {
      console.log("[Update item]", updatedItem.id)
      debugger
      try {
        // Ensure qty is a number
        updatedItem.qty = Number(updatedItem.qty)

        // Update item
        // TODO: Call remove()?
        const newState = { ...state, items: [...state.items.filter((item: Item) => item.id !== updatedItem.id), updatedItem] }

        set(newState);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    newBox: async () => {
      console.log("[New Box]")

      try {
        // Increment box count and use box count as new box id
        state.metaData.boxes.push(state.metaData.boxes.length + 1) // Push new box id to boxes array
        const newBoxId = state.metaData.boxes.length // Get new box id
        const newState: Cart = { ...state, totalBoxes: state.metaData.boxes.length, metaData: { ...state.metaData, currentBoxId: newBoxId } };

        set(newState);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    batchAdd: async (item: string, isAdding: boolean) => {
      console.log(`[Batch ${isAdding ? "Adding" : "Removing"}] item ID:`, item)

      if (isAdding) {
        state.metaData.batchItems.push(item)
      } else {
        state.metaData.batchItems = state.metaData.batchItems.filter((batchItem: string) => batchItem !== item)
      }

      set(state);
    },
    batchRemove: async () => {
      console.log("[Batch Removing]")

      try {
        const newState: Cart = { ...state, items: [...state.items.filter((item: Item) => !state.metaData.batchItems.includes(item.id))] };
        state.metaData.batchItems = [] // Clear batch items

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
