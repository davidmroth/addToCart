<script lang="ts">
  import cartState from "$lib/store/cart";

  export let hide: boolean = false;

  const clearSession = () => {
    cartState.clearSavedSession();
  };
</script>

<div class="debug corner" class:hide>
  <button style="display:inline-block" on:click={clearSession}>
    Clear Session
  </button>
  <div style="overflow: scroll; height: 100px;">
    <pre style="display:inline-block">
        {JSON.stringify($cartState)}
      </pre>
  </div>
</div>

<style>
  .corner.debug.hide {
    display: none;
  }
  .corner.debug {
    display: grid;
    display: none;
    grid-gap: 11px;
    grid-template-columns: 1fr 4fr;
    align-items: center;
    width: 100%;
    margin-left: auto;
    color: #fff;
  }
  .debug pre {
    white-space: pre-line;
    word-break: break-all;
    margin-left: auto;
  }
</style>
