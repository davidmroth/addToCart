<script lang="ts">
  import type { Item } from "$lib/store/process";
  import cartManagement from "$lib/store/process";

  export let item: Item;
  export let showId: boolean = true;

  let duplicate: HTMLInputElement;
  let showDuplicate = false;
</script>

<div class="row">
  <div class="action">
    <button
      on:click={() => {
        showDuplicate = true;
        duplicate.focus();
      }}
    >
      duplicate
    </button>
    <button
      on:click={() => {
        if (window.confirm(`Remove ${item.description}?`))
          cartManagement.remove(item.id);
      }}
    >
      remove
    </button>
    <div class="duplicate" class:show={showDuplicate}>
      <input type="input" bind:this={duplicate} size="3" />
      <button
        on:click={() => {
          cartManagement.duplicate(item.id, duplicate.value);
          duplicate.value = "";
          duplicate.blur();
          showDuplicate = false;
        }}>submit</button
      >
      <button
        class="cancel"
        on:click={() => {
          duplicate.value = "";
          duplicate.blur();
          showDuplicate = false;
        }}
      >
        cancel
      </button>
    </div>
  </div>
  <div class:hide={!showId}>{item.id}</div>
  <div>{item.barcode}</div>
  <div class="small-text">{item.description}</div>
  <div>{item.category}</div>
  <div>{item.weight}</div>
  <div>{item.boxId}</div>
</div>

<style lang="scss">
  div.hide {
    display: none;
  }
  .duplicate.show {
    display: grid;
  }
  .duplicate {
    position: absolute;
    top: -3px;
    z-index: 1;
    display: none;
    background-color: aliceblue;
    grid-template-columns: 50px 1fr 52px;
    column-gap: 8px;
    padding: 3px 18px 3px 18px;
    border: 1px solid #c9c9c9;

    button.cancel {
      color: white;
      background-color: red;
    }
  }
  .row {
    position: relative;
    display: grid;
    grid-template-columns: 225px 2fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 8px;
  }
  .row:nth-child(odd) {
    background-color: aliceblue;
  }
  .row .small-text {
    font-size: 0.8rem;
  }
</style>
