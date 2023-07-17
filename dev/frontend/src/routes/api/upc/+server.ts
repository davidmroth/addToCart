import { json, error } from '@sveltejs/kit'
import { getAPI } from "$lib/store/process";

const [url, method, options] = getAPI('api.barcodelookup.com')

export async function POST(event: any) {
  // Get params from request
  const data = await event.request.formData()
  const upc = data.get('upc')

  return await new Promise(async (resolve, reject) => {
    // If no upc provided, throw error
    if (upc.length === 0) {
      return reject(error(500, { ok: false, err: 'No UPC provided' }));
    }

    // Create form data
    const data = new FormData()
    data.append('upc', upc)
    const formattedURL = url(upc)

    console.log("POSTING to:", formattedURL);

    try {
      // Fetch data from API
      const response = await fetch(`${formattedURL}`, { method, ...options })

      // Check response status
      switch (response.status) {
        case 200:
          break;

        case 404:
          return reject(error(404, { ok: false, err: 'Not found' }));

        default:
          return reject(error(500, { ok: false, err: 'Internal server error' }));
      }

      // Throw error if response is not json
      const result = await response.json();
      console.log("[RESULT]:", result);

      return resolve(json({ ok: true, data: result }))
    } catch (err) {
      console.log("[ERROR] --- ", err);
      return reject(error(500, { ok: false, err }));
    }
  });
}