<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Item } from "$lib/store/process";
  import cartManagement from "$lib/store/process";

  export let item: Item;
  export let manualAddMode: boolean = false;
  export let showId: boolean = false;

  $: if (manualAddMode) {
    isEditing = true;
  }

  let duplicate: HTMLInputElement;
  let showDuplicate: boolean = false;
  let isEditing: boolean = false;

  const dispatch = createEventDispatcher();

  function updateItem(item: Item) {
    cartManagement.update(item);
    isEditing = false;
  }

  function handleCheckboxChange(event: Event) {
    dispatch("batchAdd", [item.id, event.target.checked]);
  }
</script>

<div class="row">
  {#if !isEditing}
    <div class="defaut-action">
      <input type="checkbox" on:change={handleCheckboxChange} />
      <button
        on:click={() => {
          showDuplicate = true;
          duplicate.focus();
        }}
      >
        add qty
      </button>
      <button
        on:click={() => {
          if (window.confirm(`Remove ${item.title}?`))
            cartManagement.remove(item.id);
        }}
      >
        remove
      </button>
      <button
        on:click={() => {
          isEditing = !isEditing;
        }}
      >
        edit
      </button>
      <div class="duplicate" class:show={showDuplicate}>
        <input type="input" bind:this={duplicate} size="3" />
        <button
          on:click={() => {
            cartManagement.duplicate(item.id, duplicate.value);
            duplicate.value = "";
            duplicate.blur();
            showDuplicate = false;
          }}
        >
          submit
        </button>
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
  {:else}
    <div class="edit-action">
      {#if manualAddMode}
        <button
          on:click={() => {
            cartManagement.add(item);
            isEditing = false;
          }}
        >
          add
        </button>
      {:else}
        <button on:click={() => updateItem(item)}> save </button>
      {/if}
      <button
        on:click={() => {
          isEditing = false;
        }}
      >
        cancel
      </button>
    </div>
  {/if}

  {#if !isEditing}
    <div class:hide={!showId}>{item.id}</div>
    <div>{item.barcode}</div>
    <div class="small-text">{item.title}</div>
    <div>{item.category}</div>
    <div>{item.weight}</div>
    <div>{item.qty}</div>
    <div>{item.boxId}</div>
  {:else}
    <div class:hide={!showId}>{item.id}</div>
    {#if manualAddMode}
      <input bind:value={item.barcode} />
    {:else}
      <div>{item.barcode}</div>
    {/if}
    <input bind:value={item.title} />
    <input bind:value={item.category} />
    <input bind:value={item.weight} />
    <input bind:value={item.qty} />
    <input bind:value={item.boxId} />
  {/if}
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
    padding: 5px 0 5px 0;
  }
  .row:nth-child(odd) {
    background-color: aliceblue;
  }
  .row .small-text {
    font-size: 0.8rem;
  }

  .defaut-action,
  .edit-action {
    padding-left: 10px;
  }
</style>
