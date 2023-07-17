<script lang="ts">
  import type { PageData } from "./$types";
  import Hero from "$lib/component/Hero.svelte";

  export let data: PageData;
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Home" />
</svelte:head>

<Hero />

<section class="page">
  <div class="products">
    <div class="products-list">N/A</div>
  </div>
</section>

<style>
  :global(.desktop-m .products-list, .mobile-s .products-list) {
    grid-template-columns: repeat(2, minmax(0px, 1fr)) !important;
  }

  :global(.mobile-xs .products-list) {
    grid-template-columns: repeat(1, minmax(0px, 1fr)) !important;
  }

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
