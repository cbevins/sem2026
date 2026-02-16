<script>
    let {nodes, title=''} = $props()
    let headers = ['Numb', 'Key', 'Value', 'Status', 'Dirty', 'Updater']
</script>

{#snippet nodeRow(content)}
    <td class='px-2 py-2 border border-gray-300'>{content}</td>
{/snippet}

{#if title && title!==''}
    <h2 class='mt-4 text-base font-bold text-center'>{title} ({nodes.length})</h2>
{/if}

<table class='table-auto text-sm'>
    <thead>
        <tr>
            {#each headers as header}
                <td class='font-bold px-2 py-2 border border-gray-300'>{header}</td>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each nodes as node, n}
            <tr>
                {@render nodeRow(n+1)}
                {@render nodeRow(node.fullKey())}
                {@render nodeRow(node.value)}
                {@render nodeRow(node.status)}
                {@render nodeRow(node.dirty)}
                {@render nodeRow(node.updaterString())}
            </tr>
        {/each}
    </tbody>
</table>
