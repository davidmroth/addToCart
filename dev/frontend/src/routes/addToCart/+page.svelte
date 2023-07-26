<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import cartManagement, { getParser } from "$lib/store/process";
  import Item from "$lib/component/Item.svelte";
  import type { Item as NewItem } from "$lib/store/process";
  import Modal, { type ModalMessage } from "$lib/component/Modal.svelte";
  import ItemResponsive from "$lib/component/Table/Item-responsive.svelte";
  import "$lib/component/Table/style.css";

  const dataParser = getParser("api.barcodelookup.com");

  let barcodes: string[] = [];
  let pressed: string[] = [];
  let barcodeInput: HTMLInputElement;
  let checkbox: HTMLInputElement;
  let modalMessage: ModalMessage = { enabled: false };
  let timer: number | undefined = undefined;
  let showIDField: boolean = false;
  let hideDebug: boolean = true;
  let mannualAdd: boolean = false;
  let mannuallyAddedItem: NewItem = {
    id: "manual",
    barcode: "",
    title: "manual",
    category: "misc",
    weight: "0 oz",
    boxId: "",
    categories: "misc (manually added)",
    description: "A user submitted item",
    qty: 1,
  };

  onMount(async () => {
    console.log("[scanner] init");
    // Set scanner mode to true
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));
  });

  onDestroy(() => {
    console.log("[scanner] cleanup");
    // Set scanner mode to false
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change"));
  });

  function showErrorMessage(text: string) {
    console.log("[showErrorMessage]", text);
    modalMessage = { enabled: true, text, type: "error" };
  }

  async function submit(barcode: string) {
    console.log("[submit]", barcode);

    try {
      const data = new FormData();
      data.append("upc", barcode);

      // TODO: Causes an internal server error: Why?
      const response = await fetch("/api/upc", {
        method: "POST",
        body: data,
      });

      // BUG: always returns 500 error. Why?
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const res = await response.json();

      // Add product to cart
      const product = dataParser(res.data);
      cartManagement.add(product);
    } catch (err: any) {
      console.error("[!!!]", err);
      throw new Error(err.message);
    }
  }

  function clear() {
    console.log("[clear]");

    if (timer) {
      // Clear timer and remove last barcode
      clearTimeout(timer);
      barcodes.pop();
      barcodes = barcodes;
      timer = undefined;
    } else {
      timer = setTimeout(() => {
        barcodes.pop();
        barcodes = barcodes;
      }, 2000);
      timer = undefined;
    }

    if ("value" in barcodeInput) barcodeInput.value = "";
    if (!checkbox.checked) barcodeInput.focus();
  }

  function handleKeydown(e: KeyboardEvent) {
    console.log("[handleKeydown]", e.key);

    if (e.key === "Enter") {
      barcodes = [...barcodes, pressed.join("")];
      pressed = [];
      // Submit last barcode
      submit(barcodes[barcodes.length - 1]).catch((err) => {
        showErrorMessage(err.message);
      });

      clear();
      return;
    }

    pressed = [...pressed, e.key];
  }

  function toggleScannerMode(e: Event) {
    console.log("[toggleScannerMode]");
    const target = e.target as HTMLInputElement;

    if (target.checked) {
      barcodeInput.blur();
      document.addEventListener("keydown", handleKeydown);
    } else {
      setTimeout(() => {
        barcodeInput.focus();
      }, 50);
      document.removeEventListener("keydown", handleKeydown);
    }
  }

  function handleBatchAdd(event: CustomEvent<[string, boolean]>) {
    const [id, checked] = event.detail;
    cartManagement.batchAdd(id, checked);
  }
</script>

<svelte:head>
  <title>Add To Cart</title>
  <meta name="description" content="Outreach | One Community Church" />
</svelte:head>

<section class="debug" class:hide={hideDebug}>
  <pre class="debug">{JSON.stringify(
      $cartManagement.debugOutput,
      null,
      4
    )}</pre>
</section>
<section class="barcode">
  <input
    type="text"
    placeholder="UPC"
    on:keydown={handleKeydown}
    bind:this={barcodeInput}
  />
  <button
    on:click={function (e) {
      submit(barcodeInput.value).catch((err) => {
        showErrorMessage(err.message);
      });
    }}
  >
    Submit
  </button>
  <button on:click={clear}>Clear</button>
  <label for="barcode">Scanner Mode</label>
  <input
    type="checkbox"
    id="barcode"
    on:change={toggleScannerMode}
    bind:this={checkbox}
  />
  <button
    on:click={function (e) {
      showIDField = !showIDField;
    }}
  >
    {showIDField ? "Hide" : "Show"} ID Field
  </button>
  <button
    on:click={function (e) {
      hideDebug = !hideDebug;
    }}
  >
    {hideDebug ? "Show" : "Hide"} Debug
  </button>
  <button
    style="margin-left: 20px;"
    on:click={function (e) {
      cartManagement.newBox();
      if (document.activeElement) {
        document.activeElement.blur();
        window.focus();
      }
    }}
  >
    New Box
  </button>
  <pre>
  barcode: {barcodes}
  </pre>
</section>

<section class="data">
  <div class="details">
    <div>Campaign: {$cartManagement.campaign}</div>
    <div>Total Items: {$cartManagement.itemsCount}</div>
    <div>Total Weight: {$cartManagement.totalWeight?.toFixed(2)} pounds</div>
    <div>Total Boxes: {$cartManagement.totalBoxes}</div>

    {#each Object.keys($cartManagement.metaData.boxesMetaData) as boxId}
      <div class="boxesDetails">
        Box ID: {$cartManagement.metaData.boxesMetaData[boxId].id} / Items: {$cartManagement
          .metaData.boxesMetaData[boxId].count} / Weight: {$cartManagement.metaData.boxesMetaData[
          boxId
        ].weight?.toFixed(2)} pounds
      </div>
    {/each}
  </div>
</section>

<section>
  <ol class="collection collection-container">
    <li class="item item-container">
      <div class="attribute select" />
      <div class="attribute new-action">
        <div class="default-action">
          <button
            style="background-color: green; color: white;"
            on:click={function (e) {
              mannualAdd = !mannualAdd;
            }}
          >
            <i class="fa fa-plus s-NaQeCmoRB7Q8" />
          </button>
          <button
            disabled={$cartManagement.metaData?.batchItems.length === 0}
            on:click={() => {
              cartManagement.batchRemove();
            }}
            style="background-color: red; color: white; border: #c9c9c9 1px solid;"
          >
            <i class="fa fa-trash" />
          </button>
        </div>
      </div>
      <div class="attribute item-id" class:hide={!showIDField}>id</div>
      <div class="attribute barcode">barcode</div>
      <div class="attribute title">title</div>
      <div class="attribute category">category</div>
      <div class="attribute weight">weight</div>
      <div class="attribute qty">qty</div>
      <div class="attribute box-id">box-id</div>
    </li>
    <div class:hide={!mannualAdd}>
      <ItemResponsive
        showId={showIDField}
        item={mannuallyAddedItem}
        manualAddMode={true}
      />
    </div>
    {#each $cartManagement.items as item}
      <ItemResponsive
        showId={showIDField}
        {item}
        on:batchAdd={handleBatchAdd}
      />
    {/each}
  </ol>
</section>

<Modal message={modalMessage} />

<style lang="scss">
  div.manual-add {
    display: none;
  }
  div.manual-add.show {
    display: grid;
  }
  div.hide {
    display: none;
  }
  section.debug.hide {
    display: none;
  }
  pre.debug {
    height: 100px;
    overflow-y: scroll;
  }
  section.barcode {
    padding: 20px;
  }
  section.data {
    padding: 20px 0 20px 0;
  }
  section.data .details {
    padding: 20px;
  }
  .boxesDetails {
    margin-left: 20px;
  }
  .barcode pre {
    height: 20px;
  }
  .table .header {
    display: grid;
    grid-template-columns: 225px 2fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 8px;
  }
  .table .body {
    display: table;
    overflow-y: scroll;
    height: calc(100vh - 400px);
  }
  .action {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 8px;
    padding: 0px 24px 0px 35px;
  }
  .action button {
    height: 20px;
    font-size: 0.7em;
  }

  .default-action {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 4px;
  }
</style>
