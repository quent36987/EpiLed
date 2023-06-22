<script lang="ts">
    import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
    import PropertiesBar from '../../annimations/components/PropertiesBar.svelte';
    import Button from '../../lib/components/common/Button.svelte';
    import { WAVE_MODULES } from '../../annimations';
    import Tabs from "./Tabs.svelte";
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';

    let modules = WAVE_MODULES;
    let switchState = false;

    let createConfig = (modules) => {
        let config = {};
        modules.forEach((module) => {
            if (module.range) config[module.name] = module.range.value;
            else if (module.color) config[module.name] = module.color.value;
        });
        return config;
    };

    const handleSwitch = () => {
        switchState = !switchState;
    }

    const handleLoad = () => {
        console.log("Load button clicked");
    }

    const handleDelete = () => {
        console.log("Delete button clicked");
    }

    const handleSave = () => {
        console.log("Save button clicked");
    }
</script>

<div id="app">
	<div id="left">
	  <ListBlockSlector />
	</div>
	<div class="content">
	  <div class="flex-row">
		<div id="middle">Milieu</div>
		<div id="right">
		  <Tabs>
			<PropertiesBar slot="dashboard" bind:modules />
		  </Tabs>
		</div>
	  </div>
	  <div id="footer">
        <Footer style="width: 100%; display: flex; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            <FooterCopyright href="/" by="Flowbite™" year={2022} />
            <FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
              <FooterLink href="/">About</FooterLink>
              <FooterLink href="/">Privacy Policy</FooterLink>
              <FooterLink href="/">Licensing</FooterLink>
              <FooterLink href="/">Contact</FooterLink>
            </FooterLinkGroup>
          </div>
        </Footer>
      </div>
	</div>
  </div>

  <style>
    #app {
        width: 100vw;
        height: 100vh;
        display: flex;
    }

    #left {
        width: min-content;
        height: 100%;
        background-color: white;
    }

    .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .flex-row {
        flex-grow: 1;
        display: flex;
    }

    #middle {
        background-color: #f8f8f8;
        flex-grow: 3;
    }

    #right {
        background-color: #ddd;
        flex-grow: 1;
        padding: var(--spacing-s);
        max-width: 40vw;
    }

    #footer {
        background-color: #eee;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 30px 5px;
        height: 60px;
    }

    #footer Button {
        background: none !important;
    }
</style>

