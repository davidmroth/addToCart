<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Item } from "$lib/store/process";
  import cartManagement from "$lib/store/process";
  //import "$lib/component/Table/style.css";

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

<li class="item item-container">
  <div class="attribute select">
    <input type="checkbox" on:change={handleCheckboxChange} />
  </div>
  <div class="attribute new-action">
    {#if !isEditing}
      <div class="defaut-action">
        <button
          on:click={() => {
            showDuplicate = true;
            duplicate.focus();
          }}
        >
          <i class="fa fa-plus" />
        </button>
        <button
          on:click={() => {
            isEditing = !isEditing;
          }}
        >
          <i class="fa fa-edit" />
        </button>
        <button
          on:click={() => {
            if (window.confirm(`Remove ${item.title}?`))
              cartManagement.remove(item.id);
          }}
        >
          <i class="fa fa-remove" />
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
  </div>

  {#if !isEditing}
    <div
      class="attribute data item-id"
      data-name="item-id"
      class:hide={!showId}
    >
      {item.id}
    </div>
    <div class="attribute data barcode" data-name="barcode">{item.barcode}</div>
    <div class="attribute data title" data-name="title">{item.title}</div>
    <div class="attribute data category" data-name="category">
      {item.category}
    </div>
    <div class="attribute data weight" data-name="weight">{item.weight}</div>
    <div class="attribute data qty" data-name="qty">{item.qty}</div>
    <div class="attribute data box-id" data-name="box-id">{item.boxId}</div>
  {:else}
    <div class="attribute data item-id" class:hide={!showId}>
      {item.id}
    </div>
    {#if manualAddMode}
      <div class="attribute data barcode" data-name="barcode">
        <input bind:value={item.barcode} />
      </div>
    {:else}
      <div class="attribute data barcode" data-name="barcode">
        {item.barcode}
      </div>
    {/if}
    <div class="attribute data title" data-name="title">
      <input bind:value={item.title} />
    </div>
    <div class="attribute data category" data-name="category">
      <input bind:value={item.category} />
    </div>
    <div class="attribute data weight" data-name="weight">
      <input bind:value={item.weight} />
    </div>
    <div class="attribute data qty" data-name="qty">
      <input bind:value={item.qty} />
    </div>
    <div class="attribute data box-id" data-name="box-id">
      <input bind:value={item.boxId} />
    </div>
  {/if}
</li>

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
    grid-template-columns: 57px 2fr 54px;
    column-gap: 10px;
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

  .defaut-action {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 4px;
    height: 20px;
  }
</style>
