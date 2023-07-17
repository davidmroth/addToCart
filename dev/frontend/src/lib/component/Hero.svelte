<script lang="ts">
  //import hero_image from "$lib/images/hero_image.jpeg";
</script>

<section id="hero">
  <div class="hero-text">
    <h1 class="big">ProficIT</h1>
    <p class="headline">Set your small business up for success</p>
    <p class="headline">Affordable IT Solutions!</p>
  </div>
</section>

<style>
  #hero {
    display: grid;
    position: relative;
    background-color: #454545;
    padding: 0px;
    width: 100%;
    padding-bottom: 1rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    background-image: url("/src/lib/images/hero_image.jpeg");
    min-height: 600px;
  }

  #hero .hero-text {
    padding-top: 20%;
    text-align: center;
    z-index: 1;
  }

  #hero .hero-text .big {
    text-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    font-weight: 700;
    font-size: 6rem;
    color: #fff;
    line-height: 100px;
    margin: 0;
  }

  #hero .hero-text .headline {
    font-size: 1.25rem;
    line-height: 4px;
    color: #fff;
  }

  #hero .hero-image {
    text-align: center;
  }

  #hero .image img {
    display: block;
    height: auto;
    width: 100%;
    text-align: center;
    border: 0 solid;
    box-sizing: border-box;
  }

  img.animate-scale {
    animation: svelte-kgp41b-imagescale 15s ease-in-out infinite alternate;
    animation-delay: 0.3s;
  }

  :global(.mobile-xs #hero .hero-text .big, .mobile-s #hero .hero-text .big) {
    font-size: 4em !important;
    line-height: 65px !important;
  }

  :global(.mobile-xs #hero, .mobile-s #hero) {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
    padding-top: 20px !important;
  }
  :global(
      .mobile-xs #hero .hero-text .headline,
      .mobile-s #hero .hero-text .headline
    ) {
    line-height: normal !important;
  }
  :global(.desktop-m #hero .hero-text .headline) {
    line-height: 24px !important;
  }
</style>
