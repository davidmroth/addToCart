<script lang="ts" context="module">
  import { writable } from "svelte/store";

  export type ModalMessage = {
    enabled: boolean;
    text?: string;
    type?: "error" | "success";
  };

  export const showModalBackground = writable(false);
</script>

<script lang="ts">
  import { onMount } from "svelte";

  export let message: ModalMessage = { enabled: false };

  onMount(() => {
    console.log("[modal] init");
    document.onkeydown = function (event) {
      const { key } = event;
      if (key === "Escape") {
        message.enabled = false;
      }
    };
  });

  $: if (message.enabled) {
    $showModalBackground = true;
    window.scrollTo(0, 0);
  } else {
    $showModalBackground = false;
  }

  function handleClose() {
    message.enabled = false;
  }
</script>

<div class="modal" class:show={message.enabled}>
  <div class={`modal-header ${message.type}`}>
    <span class="close" on:click={handleClose}>&times;</span>
    <h2>Error</h2>
  </div>
  <div class="modal-content">
    <p>{!!message.enabled && message.text}</p>
  </div>
  <div class={`modal-footer ${message.type}`}>
    <h3 />
  </div>
</div>

<style>
  .modal {
    display: block;
    visibility: hidden;
    position: absolute;
    width: 60%;
    top: -300px;
    left: 50%;
    transform: translate(-50%, 0);
    margin: auto;
    z-index: 2;
    transition: all 0.2s ease-in-out;
  }

  .modal.show {
    visibility: visible;
    top: 20%;
  }

  .modal-content {
    background-color: #fefefe;
    padding: 2px 16px;
  }

  .close {
    color: white;
    font-size: 28px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translate(0, -50%);
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }

  .modal-header {
    position: relative;
    padding: 2px 16px;
    background-color: #5cb85c;
    color: white;
  }

  .modal-footer {
    padding: 2px 16px;
    background-color: #5cb85c;
    color: white;
  }

  @keyframes slideIn {
    0% {
      top: -300px;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      top: 20%;
    }
  }

  @keyframes slideOut {
    0% {
      top: 20%;
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      top: -300px;
    }
  }

  .modal-header.error,
  .modal-footer.error {
    background-color: #f44336;
  }
</style>
