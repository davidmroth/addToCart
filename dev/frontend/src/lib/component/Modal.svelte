<script lang="ts" context="module">
  export type ModalMessage = {
    message: string;
    type: "error" | "success";
  };
</script>

<script lang="ts">
  export let show: ModalMessage | boolean = false;

  function handleClose() {
    show = false;
  }
</script>

<div class="modal" class:show={!!show}>
  <div class={`modal-header ${!!show && show.type}`}>
    <span class="close" on:click={handleClose}>&times;</span>
    <h2>Error</h2>
  </div>
  <div class="modal-content">
    <p>{!!show && show.message}</p>
  </div>
  <div class={`modal-footer ${!!show && show.type}`}>
    <h3 />
  </div>
</div>
<div class="modal-background" class:show={!!show} />

<style>
  .modal-background {
    display: none;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    animation-name: fadeIn;
    animation-duration: 0.4s;
  }

  .modal {
    display: none;
    position: absolute;
    width: 60%;
    top: -300px;
    left: 50%;
    transform: translate(-50%, 0);
    margin: auto;
    animation-name: slideIn;
    animation-duration: 1.1s;
    z-index: 2;
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

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .modal-header.error,
  .modal-footer.error {
    background-color: #f44336;
  }
  .modal.show,
  .modal-background.show {
    display: block;
  }
  .modal.show {
    top: 20%;
  }
</style>
