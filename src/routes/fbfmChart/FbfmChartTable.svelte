<script>
    let {results} = $props()
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
        </tr>
        {#each results as result}
        <tr>
            {@render item(result.fuelKey)}
            {@render item(result.rosFpm.toFixed(2))}
            {@render item(result.fli.toFixed(0))}
            {@render item(result.flame.toFixed(2))}
        </tr>
        {/each}
    </tbody>
</table>
