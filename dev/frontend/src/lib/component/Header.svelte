<script>
  import { platform } from "$lib/component/mediaQuery.svelte";
  import Logo from "$lib/component/Logo.svelte";
  import Menu from "$lib/component/Menu.svelte";
  import Debug from "$lib/component/Debug.svelte";

  let isMobile = false;
  let open = false;

  $: if ($platform) {
    isMobile = $platform.includes("mobile");
  }

  const toggleDraw = () => {
    if (open) {
      document.body.classList.remove("open");
    } else {
      document.body.classList.add("open");
    }

    open = !open;
  };
</script>

{#if isMobile}
  <header class="mobile-menu" class:open>
    <div class="menu-button" on:click={toggleDraw} on:keydown={toggleDraw}>
      <div class="bar-top" />
      <div class="bar-middle" />
      <div class="bar-bottom" />
    </div>

    <Logo {open} style="height: 70px;" />

    <div class="drawer" class:open>
      <nav>
        <div class="menu">
          <Menu class="mobile" />
        </div>
      </nav>
    </div>

    <div class="backdrop-bg" class:open />
  </header>
{:else}
  <header class:desktop={!isMobile}>
    <div class="corner">
      <Logo style="height: 70px;" />
    </div>

    <nav style="align-items: center;">
      <Menu class="desktop" />
    </nav>

    <Debug />
  </header>
{/if}

<style>
  :global(body.open) {
    overflow: hidden;
  }
  :global(.mobile-xs .mobile-menu .drawer.open) {
    width: 100% !important;
    animation: slideIn-full 0.3s;
  }
  :global(.desktop-xl .corner) {
    width: 10em;
    height: 7em !important;
  }

  header {
    padding: 0 0 1em 0;
  }

  .mobile-menu .backdrop-bg.open {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    opacity: 0.5;
    width: 100%;
    background-color: #000;
  }
  .mobile-menu .drawer.open {
    display: block;
    opacity: 1;
    width: 50%;
    animation: slideIn-half 0.3s;
  }
  .mobile-menu .drawer {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100vh;
    background: #fff;
    justify-content: center;
    align-items: center;
    opacity: 0;
    z-index: 2;
  }
  .mobile-menu .drawer nav {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    grid-template-rows: 1fr 4fr 1fr;
    width: 100%;
    background: #fff;
  }
  .mobile-menu .drawer nav .menu {
    grid-column-start: 2;
    grid-row-start: 2;
  }
  .mobile-menu .menu-button {
    display: block;
    cursor: pointer;
    width: 2em;
    height: 2em;
    position: relative;
    z-index: 999;
  }
  .mobile-menu .menu-button {
    margin: 2rem;
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    height: 2.5rem;
    width: 2.5rem;
    cursor: pointer;
  }
  .mobile-menu .bar-top,
  .mobile-menu .bar-middle,
  .mobile-menu .bar-bottom {
    height: 5px;
    background: white;
    border-radius: 5px;
    margin: 3px 0;
    transform-origin: left;
    transition: all 0.5s;
  }
  .mobile-menu.open .menu-button .bar-top,
  .mobile-menu.open .menu-button .bar-middle,
  .mobile-menu.open .menu-button .bar-bottom {
    background: black;
  }
  .mobile-menu.open .menu-button .bar-top {
    transform: rotate(45deg);
  }
  .mobile-menu.open .menu-button .bar-middle {
    transform: translateX(1rem);
    opacity: 0;
  }
  .mobile-menu.open .menu-button .bar-bottom {
    transform: rotate(-45deg);
  }
  header {
    background-color: #454545;
    display: grid;
    justify-content: space-between;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
  }
  .desktop .corner {
    width: 10em;
    height: 5em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .desktop nav {
    display: flex;
    justify-content: center;
    color: white;
  }

  @keyframes slideIn-half {
    from {
      opacity: 0;
      width: 0;
    }

    to {
      opacity: 1;
      width: 50%;
    }
  }
  @keyframes slideIn-full {
    from {
      opacity: 0;
      width: 0;
    }

    to {
      opacity: 1;
      width: 100%;
    }
  }
</style>
