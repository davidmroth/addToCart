import cartState from "$lib/store/cart";
import { HTTP_ENDPOINT } from '$config'
// https://imranhsayed.medium.com/shippingmethod-mutation-in-wpgraphql-woocommerce-woographql-ef00a1841c6


const cartItemFragmentOld = function () {
	return `
		fragment CartFragment on Cart {
			subtotal
			total
			shippingTotal
			contents(last: 1) {
				itemCount
				nodes {
					key
					product {
						node {
							name
							sku
							databaseId
								... on SimpleProduct {
									price
							}
						}
					}
				}
			}
		}
	`
}

const cartItemFragment = function (lastOnly = false) {
	let contents = `contents`

	if (lastOnly) {
		contents = `contents(first: 1)`
	}

	return `
		fragment CartFragment on Cart {
			${contents} {
				itemCount
				nodes {
					key
					product {
						node {
							id
							productId: databaseId
							name
							description
							type
							onSale
							slug
							averageRating
							reviewCount
							image {
								id
								sourceUrl
								srcSet
								altText
								title
							}
							galleryImages {
								nodes {
									id
									sourceUrl
									srcSet
									altText
									title
								}
							}
						}
					}
					variation {
						node {
							id
							variationId: databaseId
							name
							description
							type
							onSale
							price
							regularPrice
							salePrice
							image {
								id
								sourceUrl
								srcSet
								altText
								title
							}
						}
						attributes {
							id
							name
							value
						}
					}
					quantity
					total
					subtotal
					subtotalTax
				}
			}
			appliedCoupons {
				code
				discountAmount
				discountTax
			}
			subtotal
			subtotalTax
			shippingTax
			shippingTotal
			total
			totalTax
			feeTax
			feeTotal
			discountTax
			discountTotal
		}
	`
}

const removeFromCart = function () {
	return `
		mutation removeItemsFromCart($input: RemoveItemsFromCartInput!){
			removeItemsFromCart(input: $input) {
				cart {
					... CartFragment
				}
				clientMutationId
			}
		}
		${cartItemFragment()}
  `
}

const updateCartItem = function () {
	return `
		mutation updateItemQuantities($input: UpdateItemQuantitiesInput!) {
			updateItemQuantities(input: $input) {
				cart {
					... CartFragment
				}
				clientMutationId
			}
		}
		${cartItemFragment()}
	`
}

const getCart = function () {
	return `
		query GetCart {
			cart {
				... CartFragment
			}
		}
		${cartItemFragment()}
	`
}

const addToCart = function () {
	return `
		mutation ($input: AddToCartInput!) {
			addToCart(input: $input) {
				cart {
					... CartFragment
				}
				clientMutationId
			}
		}
		${cartItemFragment()}
	`
}

const getProducts = function () {
	return `
	{
		products {
		  edges {
			node {
			  name
			  date
			  averageRating
			  featured
			  link
			  ... on SimpleProduct {
				id
				name
				price
			  }
			  image {
				sourceUrl
			  }
			  databaseId
			  excerpt
			  galleryImages {
				edges {
				  node {
					sourceUrl
				  }
				}
			  }
			}
		  }
		}
	  }
	  `
}

const pageQuery = function (pageId: string) {
	return `
	query getPage {
		posts(where: {title: "${pageId}"}) {
			nodes {
			  id
			  title
			  content
			}
		  }
		}
	`
}

const getSession = function () {
	return `
		query { 
			customer { 
			sessionToken
		  } 
		}
	`
}

/**
 * Remove edges, node and __typename from graphql response
 *
 * @param {Object} input - The graphql response
 * @returns {Object} Clean graphql response
 */
const cleanGraphQLResponse = function (input: object): any {
	if (!input) return null;
  
	const isPrimitiveType = (test: any) => {
	  return test !== Object(test);
	};
  
	if (isPrimitiveType(input)) return input;
  
	const output: object = {};
	const isObject = (obj: object) => {
	  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
	};
  
	Object.keys(input).forEach((key: string) => {
	  if (input[key] && input[key].edges) {
		output[key] = input[key].edges.map((edge) =>
		  cleanGraphQLResponse(edge.node),
		);
	  } else if (isObject(input[key])) {
		output[key] = cleanGraphQLResponse(input[key]);
	  } else if (key !== '__typename') {
		output[key] = input[key];
	  }
	});
  
	return output;
};

type Fetcher = {
	dataFetcher?: Function | false;
	url: string;
}
type Response = {
	status: number;
	session: string;
	data: any;
	error: string;
}

// Make the `request` function generic
// to specify the return data type:
// `RequestInit` is a type for configuring 
// a `fetch` request. By default, an empty object.
// This function is async, it will return a Promise:
async function request<TResponse>(
	{dataFetcher = false, url}: Fetcher,
	config: any = {}
): Promise<TResponse> {
	try {
		if (!dataFetcher) {
			dataFetcher = fetch
		}
		// Inside, we call the `fetch` function with 
		// a URL and config given:
		console.log('[+] FETCH [+] ---- ---- ---- ---- ----:', url, config)
		const response = await dataFetcher(url, config);
		const isJson = response.headers.get('content-type')?.includes('application/json')
		const data = isJson ? await response.json() : await response.text()
		return {
			status: response.status,
			session: response.headers.get('shopping-session') ? response.headers.get('shopping-session') : null,
			data
		} as TResponse;
	} catch (error) {
		console.log(error)
		return { error: error } as TResponse;
	}
}

type runQuery = {
	dataFetcher?: Function | false;
	query: string;
	session?: string;
	config?: any;
	data?: any;
}

export async function getWPVersion() {
	try {
		const ep = HTTP_ENDPOINT + "/wp-json/wp/v1/version";
		//console.log('[+++] function gql_getBySid() -> ENDPOINT:', ep)
	
		const response = await request<Response>({url: ep}, {
			method: 'GET'
		})
	
		//console.log('[+] ---- ---- ---- ---- ----:', response)
		return response?.data?.version
	} catch (error) {
		return '0.0.0'
	}
}

export async function runQuery2({ dataFetcher, query, session, config, data }: runQuery): Promise<any> {
	console.log('[+] endpoint:', query, session, data, cartState.decodeSession(session))

	switch (query) {
		case 'get_shop':
			query = pageQuery('shop')
			break
		
		case 'get_products':
			query = getProducts()
			break
		
		case 'get_cart':
			query = getCart()
			break
	
		case 'add_to_cart':
			query = addToCart()
			break
		
		case 'update_cart_item':
			query = updateCartItem()
			break
		
		case 'remove_from_cart':
			query = removeFromCart()
			break
		
		case 'get_session':
			query = getSession()
			break
		
		default:
			throw { status: 404, message: 'Not Found' }
	}

	const ep = HTTP_ENDPOINT + '/api'

	const headers:HeadersInit = {
		'content-type': 'application/json'
	}

	if (session) {
		headers['shopping-session'] = `Session ${session}`
	}  else
	if (cartState.getSession()) {
		headers['shopping-session'] = `Session ${cartState.getSession()}`
	}

	const response = await request<Response>({ dataFetcher, url: ep }, {
		...config,
		method: 'POST',
		headers,
		body: JSON.stringify({
			query,
			variables: {
				...data,
				now: new Date().toISOString(),
			},
		}),
	})

	console.log('[+] ---- RAW RESPONSE ---- [+] ---- ---- ----:', JSON.stringify(response, null, 2))
	
	if (response.session) {
		cartState.setSession(response.session)
	}

	if (response?.status > 399) {
		throw { status: response.status, message: response.data }
	} else if (response?.status > 399) {
		throw { status: response.status, message: response.data }
	} else if (response?.data?.errors) {
		console.log('[+] ---- ERROR(S) ---- [+] ---- ---- ----:', JSON.stringify(response?.data?.errors, null, 2))
		throw { status: response.status, message: response.data }
	} else {
		delete response?.data.extensions
		const cleanedResponse = cleanGraphQLResponse(response.data.data)
		//console.log('[+] ---- FILTERED RESPONSE ---- [+] ---- ---- ----:', JSON.stringify(cleanedResponse, null, 2))
		return cleanedResponse
	}
}