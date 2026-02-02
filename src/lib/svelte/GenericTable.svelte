<script module>
    export {GenericTable}
</script>

{#snippet cell(content)}
    <td class='px-2 py-2 border border-gray-300'>{content}</td>
{/snippet}

{#snippet header(content)}
    <td class='font-bold px-2 py-2 border border-gray-300'>{content}</td>
{/snippet}

{#snippet GenericTable(data, headers=null, title=null)}
    {#if title}
        <h2 class='mt-4 ml-4 text-base font-bold'>{title}</h2>
    {/if}
    <table class='table-auto text-sm'>
        <thead>
            {#if headers}
            <tr>
                {#each headers as str}
                    {@render header(str)}
                {/each}
            </tr>
            {/if}
        </thead>
        <tbody>
            {#each data as row, n}
            <tr>
                {#each row as col}
                    {@render cell(col)}
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>
{/snippet}
