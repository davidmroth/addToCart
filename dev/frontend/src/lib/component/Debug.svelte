<script>
  import cartState from "$lib/store/cart";
  const clearSession = () => {
    cartState.clearSavedSession();
  };
</script>

<div class="debug corner">
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
