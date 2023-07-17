<script lang="ts">
  import cartState from "$lib/store/cart";
  import no_product from "$lib/images/no_product.png";

  export let product: any;

  const addToCartNew = async function (event: MouseEvent) {
    const target = event?.target as HTMLElement;
    if (!target.dataset?.productId) return;

    cartState.add({
      id: parseInt(target.dataset?.productId),
      quantity: 1,
    });
  };

  const parseProductImages = (product: any) => {
    if (product?.galleryImages?.length > 0) {
      return product?.galleryImages[0].sourceUrl;
    } else if (product?.image?.sourceUrl) {
      return product?.image?.sourceUrl;
    } else {
      return no_product;
    }
  };
</script>

<div class="product">
  <div class="image">
    <img src={parseProductImages(product)} alt={product.name} />
  </div>
  <div class="card-body">
    <h3 class="product-title">
      {product.name}
    </h3>
    {@html product.excerpt}
  </div>
  <p>
    {#each Array(product.averageRating) as star}
      <i class="star" />
    {/each}
  </p>
  <div class="card-footer">
    <div>
      <span class="price">{product.price}</span>
    </div>
    <div class="buy">
      <button
        data-product-id={product.databaseId}
        class="btn"
        disabled={$cartState.adding[product.databaseId] || $cartState.loading}
        on:click={addToCartNew}
      >
        {#if $cartState.adding[product.databaseId]}
          <span class="spinner" />
        {/if}
        Add to cart
      </button>
    </div>
  </div>
</div>

<style>
  span.spinner {
    margin-right: 8px;
    width: 25px;
    height: 25px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .product {
    flex-basis: 20%;
    padding: 10px;
    min-width: 100px;
    margin-bottom: 50px;
    transition: transform 0.5s;
    border-radius: 0.25rem;
    background: #fff;
    padding: 1rem;
    overflow: hidden;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    border: 1px solid #dcdcdc;
  }
  .product .image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .product .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product .product-title {
    text-align: left;
    --tw-text-opacity: 1;
    color: rgba(31, 41, 55, 1);
    font-weight: 500;
    font-size: 1.25rem;
    line-height: 1.75rem;
    padding-top: 0.5rem;
  }

  :global(.product .card-body p) {
    font-weight: 300;
    --tw-text-opacity: 1;
    color: rgba(31, 41, 55, 1);
    margin: 0px;
    padding-top: 0.5rem;
    min-height: 75px;
  }

  .product .card-footer {
    display: flex;
    margin-top: 0.75rem;
    align-items: center;
    padding-top: 0.5rem;
  }

  .product .card-footer .price {
    font-weight: 500;
    --tw-text-opacity: 1;
    color: rgba(31, 41, 55, 1);
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .product .card-footer .buy {
    margin-left: auto;
  }

  .product .card-footer .buy .btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    appearance: button;
    text-transform: none;
    --tw-bg-opacity: 1;
    background-color: rgba(75, 85, 99, 1);
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, 1);
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    border-width: 0px;
    border-style: solid;
    border-color: initial;
    border-image: initial;
    transition: all 0.8s ease;
  }

  .product .card-footer .buy .btn:hover {
    --tw-bg-opacity: 1;
    background-color: var(--theme-hover-color);
  }

  .product .card-footer .buy .btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .product img {
    width: 100%;
  }

  .product p {
    font-size: 14px;
  }

  .product:hover {
    transform: translateY(-5px);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  *:before,
  *:after {
    box-sizing: inherit;
    -webkit-font-smoothing: antialiased;
  }

  p {
    margin-bottom: 8px;
  }

  /* https://codepen.io/fxm90/pen/yOBWVe */
  .star {
    font-size: 0.7em;
    position: relative;
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 0.9em;
    margin-right: 0.9em;
    margin-bottom: 1.2em;
    border-right: 0.3em solid transparent;
    border-bottom: 0.7em solid #fc0;
    border-left: 0.3em solid transparent;
  }
  .star:before,
  .star:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    top: 0.6em;
    left: -1em;
    border-right: 1em solid transparent;
    border-bottom: 0.7em solid #fc0;
    border-left: 1em solid transparent;
    transform: rotate(-35deg);
  }
  .star:after {
    transform: rotate(35deg);
  }
</style>
