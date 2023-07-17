<script lang="ts">
  import Logo from "$lib/images/occ_logo_white.png";

  export let open: boolean = false;
  export let style: any = null;
  export let type: string = "";
  export let width: string = "";
  let clazz: string = "";
  export { clazz as class };
</script>

{#if type === "loader"}
  <img src={Logo} class={`loader ${clazz || ""}`} {style} />
{:else}
  <a href="/" class="logo" class:black={open}>
    <img src={Logo} width={width || ""} class={`${clazz || ""}`} {style} />
  </a>
{/if}

<style>
  .logo {
    position: relative;
    transition: transform 0.2s;
  }
  :global(img.loader) {
    height: auto !important;
  }
  :global(.logo svg) {
    /*padding-top: 1em;*/
    fill: white;
  }
  :global(.mobile-xs .logo.black svg) {
    fill: black;
  }
  :global(.mobile-xs .logo.black) {
    transform: scale(1.5) translateY(15px);
    z-index: 3;
    fill: black;
  }
</style>
