<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "$lib/component/Layout.svelte";
  import { platform } from "$lib/component/mediaQuery.svelte";
  import Logo from "$lib/component/Logo.svelte";
  import Spinner from "$lib/images/spinner.svg";
  import "./styles.css";

  let ready: boolean = false;
  let root: HTMLElement;

  onMount(() => {
    root = document.documentElement;
    toogleTheme($platform);
    //cartState.restoreSession(); // Why did I do this?
    //cartState.load();
  });

  function toogleTheme(name: string): void {
    if (!root) return;
    root.className = "";
    root.classList.add(name);
    setTimeout(() => {
      ready = true;
    }, 500);
  }

  if (typeof window !== "undefined") {
    window.ready = (status: boolean) => (ready = !ready);
  }

  $: toogleTheme($platform);
</script>

<div class="app">
  {#if ready === false}
    <div id="app-preloader">
      <Logo class="preloader-logo" type="loader" />
      <div class="preloader-spinner">
        <Spinner />
      </div>
    </div>
  {:else}
    <Layout>
      <slot />
    </Layout>
  {/if}
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
    flex-direction: column;
  }
</style>
