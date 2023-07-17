import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { getWPVersion } from "$lib/utils";

type Misc = {
    version?: string
}

const defaultState:Misc = {
    version: '0.0.0'
}

const getDefaultState = () => {
  return JSON.parse(JSON.stringify(defaultState))
}

const misc:any = (function () {
    // Set default state
    let states = getDefaultState()
  
    // Initialize store
    const store = writable(states)

    // Get store methods
    const { subscribe, set: masterSet } = store

    const set = (value: Misc) => {
        states = { ...states, ...value } // Don't erase previously set values and ensure state is kept in sync
        masterSet({ ...getDefaultState(), ...states }) // set store and ensure default values are set for missing keys
    }    

    return {
        subscribe,
        getVersion: async () => {
            set({ version: await getWPVersion() });
        }
    }
})();

export default misc;