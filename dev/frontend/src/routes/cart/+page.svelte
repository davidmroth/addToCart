<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  import cartState from "$lib/store/cart";
  export let data: PageData;

  onMount(async () => {
    cartState.syncCart(data);
  });

  const removeFromCart = async function (event: MouseEvent) {
    const target = event?.target as HTMLElement;

    if (!target.dataset?.productKey) return;

    cartState.setRemoving({ key: target.dataset.productKey });
    cartState.remove({ keys: [target.dataset?.productKey] });
  };

  const updateQuantity = function (event: Event) {
    const target = event?.target as HTMLInputElement;

    console.log(target.dataset);
    if (!target.dataset?.productKey) return;

    cartState.updateQuantity({
      key: target.dataset?.productKey,
      quantity: parseInt(target.value),
    });
  };

  const checkout = function () {
    console.log("checkout");
    goto("/checkout");
  };
</script>

<svelte:head>
  <title>Cart</title>
  <meta name="description" content="About this app" />
</svelte:head>

<section class="page">
  <div class="cart-container">
    <div>
      <h2 class="Title">
        Your cart ({$cartState.items.length} items)
      </h2>
      <div class="cart">
        <div class="cart-list" class:empty={$cartState.items.length === 0}>
          {#if $cartState.items.length === 0}
            <div class="empty-cart">
              <p>Your cart is empty</p>
            </div>
          {/if}

          {#each $cartState.items as item}
            <div class="cart-item" class:removing={item.removing}>
              <div class="item">
                <div class="image">
                  <img
                    style="width: 100px; height: 100px;"
                    src={item?.images[0]?.sourceUrl}
                    alt={item.name}
                  />
                </div>
                <div class="product">
                  <a href="/product/{item.id}" target="_self" class="title">
                    {item.name}
                  </a>
                  <div class="description">
                    <p>{item.shortDescription}</p>
                  </div>
                  <button
                    class="remove"
                    data-product-key={item.key}
                    on:click={removeFromCart}>×</button
                  >
                </div>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="100"
                  title="Qty"
                  size="3"
                  class="qty show_always"
                  value={item.quantity}
                  data-product-key={item.key}
                  on:change={updateQuantity}
                />
                <div class="total">
                  <div class="ItemPrice">{item.price}</div>
                </div>
              </div>
              {#if item.removing}
                <div class="spinner" />
              {/if}
            </div>
          {/each}
        </div>
        {#if $cartState.items.length > 0}
          <div class="checkout">
            <h2>Order Summary</h2>
            <div class="price-summary">
              <p>Subtotal<span>{$cartState.total}</span></p>
              <p>Shipping<span>{$cartState.shippingTotal}</span></p>
            </div>
            <button on:click={checkout}>Checkout</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  $color_1: inherit;
  $color_2: white;
  $background-color_1: #fff;
  $background-color_2: var(--theme-hover-color);
  $border-top-color_1: #fff;

  :global(.mobile-xs .cart) {
    grid-template-columns: 1fr !important;
  }
  :global(.desktop-m .cart) {
    grid-template-columns: 1fr !important;
  }
  :global(.desktop-xl .cart, .desktop-l .cart) {
    margin-bottom: 1em !important;
  }
  :global(.desktop-l .cart .cart-container, .desktop-m .cart .cart-container) {
    padding: 1em;
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .title {
    padding: 48px 0px 96px;
  }
  .cart {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 1em;
    margin: 0px;
  }
  .cart-container {
    display: flex;
    justify-content: center;
  }
  .cart-list {
    .empty-cart {
      flex-grow: 1;
      display: flex;
      height: 100%;
      min-width: 300px;
      justify-content: center;
      p {
        font-size: 1.5em;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    padding: 0px 0px 96px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1em;
    background-color: $background-color_1;
    padding: 2em;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    height: fit-content;
    align-items: baseline;
  }
  .cart-list.empty {
    grid-column: 1 / span 2;
  }
  .cart-item {
    &:not(:first-child) {
      padding-top: 2em;
    }
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #d3d3d3;
    &:last-child {
      border-bottom: none;
    }
  }
  .cart-item.removing {
    align-items: center;
    .item {
      animation: fadeOut 0.3s forwards;
    }
    .spinner {
      position: absolute;
      display: flex !important;
      justify-content: center;
      height: 1.5rem;
      width: 1.5rem;
      border: 3px solid #934bff;
      border-radius: 50%;
      border-top-color: $border-top-color_1;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 0.2em;
    }
  }
  .item {
    flex-grow: 1;
    position: relative;
    display: grid;
    grid-template-columns: 115px 130px;
    padding: 16px 0px;
    max-width: 650px;
    transition: all 0.8s ease;
    .product {
      position: relative;
      grid-column: 2 / 4;
      grid-row-start: 1;
      justify-self: stretch;
      margin-right: 24px;
      padding-bottom: 16px;
      a {
        color: $color_1;
        text-decoration: none;
        &:visited {
          color: $color_1;
          text-decoration: none;
        }
      }
      .image {
        grid-column-start: 1;
        grid-row-start: 1;
        padding-right: 16px;
        width: 10%;
        overflow: clip;
      }
      .title {
        text-decoration: underline;
        font-size: 1.5rem;
      }
      .description {
        min-width: 100px;
        p {
          font-weight: 300;
        }
      }
      button.remove {
        position: absolute;
        z-index: 1;
        top: 0px;
        right: -24px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        font-size: 1.2em;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #d3d3d3;
        background-color: $background-color_2;
        color: $color_2;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .image {
      img {
        height: 90px;
        width: auto;
        object-fit: cover;
      }
    }
    .qty {
      max-width: 4em;
      padding-right: 0.3em;
      padding-left: 1em;
      height: 2.5em;
    }
    .total {
      grid-column: 2 / span 2;
      grid-row-start: 2;
      place-self: end;
      padding-bottom: 0.375em;
    }
  }
  .checkout {
    background-color: $background-color_1;
    padding: 2em;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    height: fit-content;
    margin-bottom: 1em;
    .price-summary {
      p {
        display: flex;
        justify-content: space-between;
        margin: 0 0 12px;
        font-weight: 300;
        &:last-child {
          padding: 0px 0 1em 0;
          border-bottom: 1px solid #d3d3d3;
        }
      }
      span {
        text-align: right;
        margin-left: 12px;
        font-weight: 500;
      }
    }
    button {
      line-height: 16px;
      font-weight: bold;
      font-size: 1.3rem;
      width: 100%;
      height: 48px;
      border-radius: 4px;
      padding: 0 24px 0 24px;
      border: 1px solid #ccc;
      margin: 10px 0 0 0;
      color: $color_2;
      background-color: $background-color_2;
    }
  }
</style>
