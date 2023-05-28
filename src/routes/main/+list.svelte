<div>
    {#each items as item}
        <div>{item}</div>
    {/each}
</div>

<script lang="ts">
    import { onMount } from 'svelte';

    export let items = [];

    onMount(() => {
        items = ['a', 'b', 'c'];
    });
</script>
