<script lang="ts">
  import Logo from "$lib/component/Logo.svelte";

  export let version: string;
</script>

<footer class="footer">
  <div class="container">
    <div class="grid">
      <div class="branding">
        <div class="logo">
          <a href={null}>
            <Logo width="130" />
          </a>
        </div>
        <div class="help-button">
          <a href="mailto:info@bestpralines.com">Got Questions?</a>
        </div>
      </div>
      <div class="quick-links">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
        </ul>
      </div>
      <div class="payments-accepted">
        <h4>Payment</h4>
        <p>We accepts most major debit &amp; credit cards!</p>
        <ul>
          <li>
            <svg
              class="icon icon--full-color"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              viewBox="0 0 38 24"
              width="38"
              height="24"
              aria-labelledby="pi-american_express"
            >
              <title id="pi-american_express">American Express</title>
              <g fill="none">
                <path
                  fill="#000"
                  d="M35,0 L3,0 C1.3,0 0,1.3 0,3 L0,21 C0,22.7 1.4,24 3,24 L35,24 C36.7,24 38,22.7 38,21 L38,3 C38,1.3 36.6,0 35,0 Z"
                  opacity=".07"
                />
                <path
                  fill="#006FCF"
                  d="M35,1 C36.1,1 37,1.9 37,3 L37,21 C37,22.1 36.1,23 35,23 L3,23 C1.9,23 1,22.1 1,21 L1,3 C1,1.9 1.9,1 3,1 L35,1"
                />
                <path
                  fill="#FFF"
                  d="M8.971,10.268 L9.745,12.144 L8.203,12.144 L8.971,10.268 Z M25.046,10.346 L22.069,10.346 L22.069,11.173 L24.998,11.173 L24.998,12.412 L22.075,12.412 L22.075,13.334 L25.052,13.334 L25.052,14.073 L27.129,11.828 L25.052,9.488 L25.046,10.346 L25.046,10.346 Z M10.983,8.006 L14.978,8.006 L15.865,9.941 L16.687,8 L27.057,8 L28.135,9.19 L29.25,8 L34.013,8 L30.494,11.852 L33.977,15.68 L29.143,15.68 L28.065,14.49 L26.94,15.68 L10.03,15.68 L9.536,14.49 L8.406,14.49 L7.911,15.68 L4,15.68 L7.286,8 L10.716,8 L10.983,8.006 Z M19.646,9.084 L17.407,9.084 L15.907,12.62 L14.282,9.084 L12.06,9.084 L12.06,13.894 L10,9.084 L8.007,9.084 L5.625,14.596 L7.18,14.596 L7.674,13.406 L10.27,13.406 L10.764,14.596 L13.484,14.596 L13.484,10.661 L15.235,14.602 L16.425,14.602 L18.165,10.673 L18.165,14.603 L19.623,14.603 L19.647,9.083 L19.646,9.084 Z M28.986,11.852 L31.517,9.084 L29.695,9.084 L28.094,10.81 L26.546,9.084 L20.652,9.084 L20.652,14.602 L26.462,14.602 L28.076,12.864 L29.624,14.602 L31.499,14.602 L28.987,11.852 L28.986,11.852 Z"
                />
              </g>
            </svg>
          </li>
          <li>
            <svg
              class="icon icon--full-color"
              viewBox="0 0 38 24"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              width="38"
              height="24"
              aria-labelledby="pi-master"
            >
              <title id="pi-master">Mastercard</title>
              <path
                opacity=".07"
                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
              />
              <path
                fill="#fff"
                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
              />
              <circle fill="#EB001B" cx="15" cy="12" r="7" /><circle
                fill="#F79E1B"
                cx="23"
                cy="12"
                r="7"
              />
              <path
                fill="#FF5F00"
                d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
              />
            </svg>
          </li>
          <li>
            <svg
              class="icon icon--full-color"
              viewBox="0 0 38 24"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              width="38"
              height="24"
              aria-labelledby="pi-visa"
            >
              <title id="pi-visa">Visa</title><path
                opacity=".07"
                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
              />
              <path
                fill="#fff"
                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
              />
              <path
                d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                fill="#142688"
              />
            </svg>
          </li>
        </ul>
      </div>
    </div>
    <hr />
    <div class="copyright">
      <p>
        Copyright © 2023
        <a href="https://bestpralines.com">Fleur De Lista</a> | version: {version}
      </p>
    </div>
  </div>
</footer>

<style>
  :global(.mobile-xs footer .grid) {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }
  :global(.mobile-xs footer) {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
  :global(.mobile-xs footer .branding) {
    padding-top: 0 !important;
    margin: auto !important;
  }
  :global(.mobile-xs footer .branding .help-button) {
    padding: 10px !important;
    margin: auto !important;
  }
  :global(.desktop-xl footer .branding .help-button) {
    padding-left: 0.5rem !important;
  }
  :global(.desktop-m .logo svg) {
    width: 90% !important;
    padding: 10px !important;
  }
  :global(.mobile-s .grid) {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  footer {
    /*padding-bottom: 2rem;
    padding-top: 2rem;*/
    background-color: #454545;
    flex: none;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    padding-left: 5rem;
    padding-right: 5rem;
  }
  .branding {
    grid-column: span 4;
    text-align: center;
    margin: 0 auto 0 0;
    padding-top: 2rem;
    padding-bottom: 2em;
  }
  .branding .logo {
    transition: 0.3s;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    border-width: 4px;
    display: inline-block;
  }
  .help-button {
    padding-top: 1.5rem;
  }
  .help-button a {
    --tw-text-opacity: 1;
    border-radius: 0.25rem;
    color: rgba(255, 255, 255, 1);
    padding: 0.5rem 1rem;
    --tw-bg-opacity: 1;
    background-color: var(--theme-hover-color);
    margin-top: 1rem;
    text-decoration: none;
  }
  .quick-links {
    grid-column: span 4;
    padding-top: 2rem;
    padding-left: 1.5em;
    padding: 1rem;
    color: white;
  }
  .quick-links h4 {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-bottom: 0;
  }
  .quick-links ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .quick-links li {
    margin-top: 1rem;
  }
  .quick-links li a {
    color: white;
    text-decoration: none;
  }
  .payments-accepted {
    grid-column: span 4;
    padding-top: 2rem;
    padding-left: 1.5em;
    padding: 1rem;
    color: white;
  }
  .payments-accepted h4 {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-bottom: 0;
  }
  .payments-accepted ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    padding-top: 1rem;
    margin: 0;
    padding: 0;
  }
  .payments-accepted li {
    margin: 0 0.25rem 0 0;
    display: list-item;
    text-align: -webkit-match-parent;
  }
  .payments-accepted li svg {
    display: block;
    vertical-align: middle;
  }
  .copyright {
    padding-top: 2rem;
    padding-left: 1.5em;
    padding: 1rem;
    color: white;
    text-align: center;
  }
  .copyright a {
    color: white;
    text-decoration: none;
  }
</style>
