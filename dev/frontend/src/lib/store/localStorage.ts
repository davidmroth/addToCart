import { browser } from '$app/environment';
import type { Cart } from '$lib/store/process'

function isEmptyObject(obj: object) {
    return JSON.stringify(obj) === '{}'
}

export function save(key: string, value: any) {
    if (browser) {

        // Don't need (need a way to clear session data in metaData)
        //delete value.metaData.batchItems

        try {
            if (!key) throw Error("Empty key!")
            if (isEmptyObject(value)) throw Error("Empty data; not saving!")
            localStorage.setItem(key, JSON.stringify(value))

        } catch (error) {
            console.error(
                `[!] The \`${key}\` store's new value \`${value}\` could not be persisted to localStorage because of ${error}`,
            )
        }
    }
}

// TODO: Should this return a blank object?
export function load(key: string): Cart | undefined {
    if (browser) {
        let errorString: string = `[!] Unknown error!`;

        try {
            const found = localStorage.getItem(key)
            if (found) {
                return JSON.parse(found)
            } else {
                errorString = `[!] The \`${key}\` store's new value could not be loaded from localStorage because it was not found`
            }

        } catch (error) {
            console.error('[!]:', errorString)
            errorString = `[!] The \`${key}\` store's new value could not be loaded from localStorage because of ${error}`
        }

        throw Error(errorString)
    }
}
