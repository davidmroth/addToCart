import { browser } from '$app/environment';
import { v4 as uuidv4 } from 'uuid'
import { get, writable } from 'svelte/store';
import { barcodelookup } from "$lib/utils/apiDataParser";

const key = 'cart';

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

type Cart = {
  campaign: string;
  itemsCount: number;
  totalWeight: number;
  totalBoxes: number;
  items: Item[];
  boxes: Boxes;
  metaData: {
    loading: boolean;
    currentBoxId: number;
    boxes: [1];
  };
  debugOutput: {};
}

type Boxes = {
  [id: string]: {
    id: string;
    items: string[];
    count: number;
    weight: number;
  };
}

export type Item = {
  id: string;
  barcode: string;
  categories: string;
  category: string;
  title: string;
  description: string;
  weight: string;
  boxId: string;
};

const defaultState: Cart = {
  campaign: "",
  totalWeight: 0,
  itemsCount: 0,
  totalBoxes: 1,
  items: [],
  boxes: {},
  metaData: {
    loading: true,
    currentBoxId: 1,
    boxes: [1]
  },
  debugOutput: {}
}

const getDefaultState = () => {
  return JSON.parse(JSON.stringify({ ...defaultState, ...{ boxes: updateBoxDetails(defaultState) }, debugOutput: addDebugOutput(defaultState) }))
}

const processWeight = (weight: string): number => {
  let pounds: number = 0;

  const re = /(^[.?\d]+)(.*$)/;
  const match = re.exec(weight);

  if (!match) return 0

  switch (match[2].trim()) {
    case "kg":
      pounds = Number(match[1]) / 0.45359237;
      break;

    case "g":
      pounds = Number(match[1]) * 0.002205;
      break;

    case "oz":
      pounds = Number(match[1]) * 0.0625;
      break;

    default:
      pounds = 0;
  }

  console.log("[WEIGHT]:", weight, match, pounds);
  return pounds;
}

function refreshData(state: Cart): { totalWeight: number, itemsCount: number } {
  const itemsCount: number = state.items.length
  const totalWeight: number = state.items.reduce((acc: number, item: Item) => {
    return acc += processWeight(item.weight || '0');
  }, 0)

  return { totalWeight, itemsCount }
}

function addDebugOutput(state: Cart) {
  const debugOutput = { ...state } // Update debug output
  delete debugOutput.items // Remove items from debug output
  delete debugOutput.debugOutput // Remove debug output from debug output

  return debugOutput
}

function updateBoxDetails(state: Cart) {
  console.log("[Calculate Box Details]", state)

  try {

    const boxDetails = state.metaData.boxes.reduce((acc: Boxes, boxId: number) => {
      acc[boxId] = {
        ...state.boxes[boxId],
        count: state.boxes[boxId]?.items.length || 0,
        weight: state.boxes[boxId]?.items.reduce((acc: number, itemId: string) => {
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
  }
}

const cart: any = (function () {
  // Set default state
  let state = getDefaultState()

  // Initialize store
  const store = writable(state)

  // Get store methods
  const { subscribe, set: masterSet } = store

  // Override set method
  const set = (value: Cart) => {
    console.log("[Set]", value)

    state = { ...state, ...value } // Don't erase previously set values and ensure state is kept in sync
    state = { ...state, ...refreshData(state) } // Update calculations
    state = { ...state, ...{ boxes: updateBoxDetails(state), debugOutput: addDebugOutput(state) } } // Update box details
    masterSet({ ...getDefaultState(), ...state }) // set store and ensure default values are set for missing keys

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

  return {
    set,
    subscribe,
    // For debugging
    getState: () => {
      return state
    },
    setLoading: (loading: boolean) => {
      state.loading = loading
      set(state)
    },
    add: async (item: Item) => {
      console.log("[Add item]", item)
      item.id = uuidv4()

      try {
        // Add item to box for tracking
        state.boxes[state.metaData.currentBoxId].items.push(item.id)

        // Add box id to item
        item.boxId = state.metaData.currentBoxId.toString()

        // Add item to cart
        state.items.push(item)

        // Update state
        set(state);
      } catch (error) {
        console.error("[!] Error:", error);
      }
    },
    duplicate: async (id: string, duplicates: number) => {
      console.log("[Duplicate item]", id, duplicates)

      // Duplicate items
      const duplicateItems: Item[] = []

      // Get a copy of item
      const duplicateItem = { ...state.items.find((item: Item) => item.id === id) }

      try {
        for (let i = 0; i < duplicates; i++) {
          // Generate new id
          duplicateItem.id = uuidv4()

          // Add item to box for tracking
          state.boxes[state.metaData.currentBoxId].items.push(duplicateItem.id)

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
        // Update calculations
        //const newCalulations = refreshData(state.items.find((item: Item) => item.id === id), newState, true);
        //newState.itemsCount = newCalulations.itemsCount
        //newState.totalWeight = newCalulations.totalWeight

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
    }
  }
})()

if (browser) {
  window.getState = cart.getState
  window.setLoading = cart.setLoading
}

export default cart
