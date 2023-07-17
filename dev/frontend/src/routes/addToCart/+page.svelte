<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import cartManagement, { getParser } from "$lib/store/process";
  import Item from "$lib/component/Item.svelte";
  import Modal, { type ModalMessage } from "$lib/component/Modal.svelte";

  const dataParser = getParser("api.barcodelookup.com");

  let barcodes: string[] = [];
  let pressed: string[] = [];
  let barcodeInput: HTMLInputElement;
  let checkbox: HTMLInputElement;
  let modalMessage: ModalMessage | boolean = false;
  let timer: number | undefined = undefined;
  let showIDField: boolean = false;

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

  function showErrorMessage(message: string) {
    console.log("[showErrorMessage]", message);
    modalMessage = { message, type: "error" };
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
</script>

<svelte:head>
  <title>Add To Cart</title>
  <meta name="description" content="Outreach | One Community Church" />
</svelte:head>

<section class="page">
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
      submit(barcodeInput.value);
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
      cartManagement.newBox();
      if (document.activeElement) {
        document.activeElement.blur();
        window.focus();
      }
    }}
  >
    New Box
  </button>
  <button
    on:click={function (e) {
      showIDField = !showIDField;
    }}
  >
    {showIDField ? "Hide" : "Show"} ID Field
  </button>
  <pre>
  barcode: {barcodes}
  </pre>
</section>

<section class="page">
  <div class="details">
    <div>Campaign: {$cartManagement.campaign}</div>
    <div>Total Items: {$cartManagement.itemsCount}</div>
    <div>Total Weight: {$cartManagement.totalWeight?.toFixed(2)} pounds</div>
    <div>Total Boxes: {$cartManagement.totalBoxes}</div>

    {#each Object.keys($cartManagement.boxes) as boxId}
      <div class="boxesDetails">
        Box ID: {$cartManagement.boxes[boxId].id} / Items: {$cartManagement
          .boxes[boxId].count} / Weight: {$cartManagement.boxes[
          boxId
        ].weight?.toFixed(2)} pounds
      </div>
    {/each}
  </div>

  <div class="table">
    <div class="header">
      <div />
      <div class:hide={!showIDField}>ID</div>
      <div>BARCODE</div>
      <div>DESCRIPTION</div>
      <div>CATEGORY</div>
      <div>WEIGHT</div>
      <div>BOX ID</div>
    </div>
    <div class="body">
      {#each $cartManagement.items as item}
        <Item showId={showIDField} {item} />
      {/each}
    </div>
  </div>
</section>

<Modal show={modalMessage} />

<style lang="scss">
  div.hide {
    display: none;
  }
  .debug {
    height: 100px;
    overflow-y: scroll;
  }
  .page,
  .barcode {
    padding: 20px;
  }
  .details {
    margin-bottom: 20px;
  }
  .boxesDetails {
    margin-left: 20px;
  }
  .table .header.hide {
    grid-template-columns: 0px 2fr 1fr 1fr 1fr 1fr 1fr;
  }

  .table .header {
    display: grid;
    grid-template-columns: 225px 2fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 8px;
  }
  .table .header {
    font-weight: bold;
    background-color: azure;
  }
  .table .header .action {
    display: grid;
    grid-template-columns: 25px 1fr 1fr;
    height: 15px;
    column-gap: 8px;
  }
  .barcode pre {
    height: 20px;
  }
</style>