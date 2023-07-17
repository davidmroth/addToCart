<script lang="ts">
  import type { PageData } from "./$types";
  import Product from "$lib/component/Product.svelte";
  import Pagination from "$lib/component/Pagination.svelte";
  import { createEventDispatcher, setContext } from "svelte";

  let session: string;
  const dispatch = createEventDispatcher();

  let per_page = 1;
  export let data: PageData;

  console.log("[++]", data.products.length);
  /*var MenuItems = document.getElementById("MenuItems");
  MenuItems.style.maxHeight = "0px";*/

  function menutoggle() {
    if (MenuItems.style.maxHeight == "0px") {
      MenuItems.style.maxHeight = "200px";
    } else {
      MenuItems.style.maxHeight = "0px";
    }
  }

  function changePage(event: any) {
    dispatch("pageChange", event.detail);
  }
</script>

<svelte:head>
  <title>Shop</title>
  <meta name="description" content="Shop" />
</svelte:head>

<section class="page">
  <div class="products">
    <div>
      <h2>All Products</h2>
      <select>
        <option value="">Default Shorting</option>
        <option value="">Short by price</option>
        <option value="">Short by popularity</option>
        <option value="">Short by rating</option>
        <option value="">Short by sale</option>
      </select>
    </div>

    <div class="products-list">
      {#each data.products as product}
        <Product {product} />
      {/each}
    </div>

    {#if data.products.length > per_page}
      <Pagination
        current_page={1}
        last_page={3}
        {per_page}
        from={1}
        to={data.products.length}
        total={data.products.length}
        on:change={(ev) => changePage({ page: ev.detail })}
      />
    {/if}
  </div>
</section>

<style>
  .products {
    padding: 3rem calc((100vw - 1300px) / 2);
    color: #141414;
  }
  .products-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0px, 1fr));
    gap: 1rem;
    justify-content: center;
    margin-top: 30px;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
