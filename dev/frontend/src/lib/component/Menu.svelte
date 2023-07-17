<script lang="ts">
  let clazz: string = "";
  export { clazz as class };
</script>

<ul class={`${clazz || ""}`}>
  <li><a href="/">Home</a></li>
  <li><a href="/addToCart">Process Cart</a></li>
  <li class="end" />
</ul>

<style>
  a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  ul.mobile {
    overflow-x: scroll;
    padding-inline-start: 0;
    margin-top: 95px;
  }

  ul.mobile li {
    list-style: none;
    text-align: center;
    border-top: 1px solid #0000001a;
    width: 100%;
    height: 70px;
  }

  ul.mobile li.end {
    height: 100px;
  }

  ul.mobile li a {
    font-size: 1.5rem;
    align-items: center;
    justify-content: center;
  }

  ul.desktop {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  ul.desktop li {
    position: relative;
    height: 100%;
  }
</style>
