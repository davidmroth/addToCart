<script lang="ts">
  import { navigating } from "$app/stores";
  import Header from "$lib/component/Header.svelte";
  import Footer from "$lib/component/Footer.svelte";
  import { showModalBackground } from "$lib/component/Modal.svelte";
  import misc from "$lib/store/misc";
</script>

{#if $navigating}
  <div class="linear-activity">
    <div class="indeterminate" />
  </div>
{/if}

<Header />
<slot />
<div class="modal-background" class:show={$showModalBackground} />
<Footer version={$misc.version} />

<style>
  .modal-background {
    display: none;
    position: fixed;
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
    backdrop-filter: blur(2px);
  }
  .modal-background.show {
    display: block;
  }
  .linear-activity {
    overflow: hidden;
    width: 50%;
    height: 4px;
    background-color: var(--theme-hover-color-light);
    margin: 0;
    width: 100%;
  }
  .indeterminate {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .indeterminate:before {
    content: "";
    position: absolute;
    height: 100%;
    background-color: var(--theme-hover-color);
    animation: indeterminate_first 1.5s infinite ease-out;
  }
  .indeterminate:after {
    content: "";
    position: absolute;
    height: 100%;
    background-color: white;
    animation: indeterminate_second 1.5s infinite ease-in;
  }
  @keyframes indeterminate_first {
    0% {
      left: -100%;
      width: 100%;
    }
    100% {
      left: 100%;
      width: 10%;
    }
  }

  @keyframes indeterminate_second {
    0% {
      left: -150%;
      width: 100%;
    }
    100% {
      left: 100%;
      width: 10%;
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
</style>
