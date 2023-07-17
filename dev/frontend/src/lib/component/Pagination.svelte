<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let current_page: number;
  export let last_page: number;
  export let per_page: number;
  export let from: number;
  export let to: number;
  export let total: number;

  const dispatch = createEventDispatcher();

  function range(size: number, startAt = 0) {
    return [...Array(size).keys()].map((i) => i + startAt);
  }

  function changePage(page: number) {
    if (page !== current_page) {
      dispatch("change", page);
    }
  }
</script>

<p>
  Page <code>{current_page}</code> of <code>{last_page}</code> (<code>
    {from + 1}
  </code>
  - <code>{to}</code> on <code>{total}</code> items)
</p>

<nav class="page-btn">
  <span class={current_page === 1 ? "disabled" : ""}>
    <a href={null} on:click={() => changePage(current_page - 1)}>
      <span aria-hidden="true">«</span>
    </a>
  </span>
  {#each range(last_page, 1) as page}
    <span class={page === current_page ? "active" : ""}>
      <a href={null} on:click={() => changePage(page)}>
        {page}
      </a>
    </span>
  {/each}
  <span class={current_page === last_page ? "disabled" : ""}>
    <a href={null} on:click={() => changePage(current_page + 1)}>
      <span aria-hidden="true">»</span>
    </a>
  </span>
</nav>

<style>
  .page-btn {
    margin: 0 auto 80px;
  }

  .page-btn > span:not(:first-child) {
    margin-left: 10px;
  }

  .page-btn > span {
    display: inline-block;
    border: 1px solid #4b5563;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }

  .page-btn > span:hover {
    background: var(--theme-hover-color);
    color: #ffffff;
  }
</style>
