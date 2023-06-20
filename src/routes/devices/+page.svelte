<script lang="ts">
    import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
    import PropertiesBar from '../../annimations/components/PropertiesBar.svelte';
    import Button from '../../lib/components/common/Button.svelte';
    import { WAVE_MODULES } from '../../annimations';
    import Tabs from "./Tabs.svelte";

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
    <div class="flex-row">
        <div id="left">
            <ListBlockSlector />
        </div>

        <div id="middle">Milieu</div>
        <div id="right">
            <Tabs>
                <PropertiesBar slot="dashboard" bind:modules />
            </Tabs>
        </div>
    </div>
    <div id="footer">
        <Button text={switchState ? "Off" : "On"} handleClick={handleSwitch} />
        <Button text="Load" handleClick={handleLoad} />
        <Button text="Delete" handleClick={handleDelete} />
        <Button text="Save" handleClick={handleSave} />
    </div>
</div>


<style>
    #app {
        width: 100vw;
    }

    #left {
        width: min-content;
        background-color: #eee;
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
        grid-column: 2 / span 2;
        background-color: #eee;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 100px 5px;
    }

    #footer Button {
        background: none !important;
    }
</style>
