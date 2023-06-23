<script lang="ts">
    import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
    import PropertiesBar from '../../annimations/components/PropertiesBar.svelte';
    import { WAVE_MODULES } from '../../annimations';
    import Tabs from './Tabs.svelte';
    import { Button, ButtonGroup } from 'flowbite-svelte';

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
    };

    const handleLoad = () => {
        console.log('Load button clicked');
    };

    const handleDelete = () => {
        console.log('Delete button clicked');
    };

    const handleSave = () => {
        console.log('Save button clicked');
    };
</script>

<div id="app">
    <div id="left" class="height-100">
        <ListBlockSlector />
    </div>
    <div class="content">
        <div class="flex-row">
            <div id="middle" class="flex-col">
                <div class="flex-1">oui</div>

                <div class="buttons">
                    <ButtonGroup class="py-4 button-group">
                        <div class:active={switchState}>
                            <Button outline color={switchState ? 'green' : 'red'} on:click={handleSwitch}>{switchState ? 'On' : 'Off'}</Button>
                        </div>
                    </ButtonGroup>
                    <ButtonGroup class="py-4 button-group">
                        <Button outline color="yellow" on:click={handleLoad}>Load</Button>
                        <Button outline color="blue" on:click={handleSave}>Save</Button>
                    </ButtonGroup>
                    <ButtonGroup class="py-4 button-group">
                        <Button outline color="purple" on:click={handleDelete}>Delete</Button>
                    </ButtonGroup>
                </div>
            </div>
            <div id="right">
                <Tabs>
                    <PropertiesBar slot="dashboard" bind:modules />
                </Tabs>
            </div>
        </div>
    </div>
</div>

<style>
    #app {
        display: flex;
        height: 100%;
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

    .buttons {
        display: flex;
        justify-content: space-evenly;
    }

    .active > button {
        background-color: #007bff !important;
        color: white !important;
    }
</style>