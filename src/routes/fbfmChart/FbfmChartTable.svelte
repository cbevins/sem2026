<script>
    let {data} = $props()
</script>

{#snippet head(content)}
    <th class='text-sm px-2 py-1 border border-gray-300'>{content}</th>
{/snippet}

{#snippet item(content)}
    <td class='text-sm px-2 py-1 border text-right border-gray-300'>{content}</td>
{/snippet}

<table class='table-auto ml-2 border rounded'>
    <tbody>
        <tr>
            {@render head('Fuel')}
            {@render head('RoS (ft/min)')}
            {@render head('FLI (Btu/ft/s)')}
            {@render head('Flame (ft)')}
            {@render head('Depth')}
            {@render head('savr (1/ft)')}
            {@render head('DeadMx')}
            {@render head('LiveMx')}
            {@render head('WSRF')}
        </tr>
        {#each data as fuel}
        <tr>
            {@render item(fuel.fuelKey)}
            {@render item(fuel.ros.toFixed(2))}
            {@render item(fuel.fli.toFixed(0))}
            {@render item(fuel.flame.toFixed(2))}
            {@render item(fuel.depth.toFixed(0))}
            {@render item(fuel.savr.toFixed(0))}
            {@render item(fuel.deadMext.toFixed(2))}
            {@render item(fuel.liveMext.toFixed(2))}
            {@render item(fuel.wsrf.toFixed(4))}
        </tr>
        {/each}
    </tbody>
</table>
