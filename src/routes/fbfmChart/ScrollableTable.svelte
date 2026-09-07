<script>
    // See ScrollableTableExample.svelte for the 'table' object structure
    let {table} = $props()
</script>

<!-- Multi-line headers split cleanly into blocks -->
{#snippet header(lines)}
    <th class="p-3 align-middle font-semibold tracking-wider">
        {#each lines as line}
            <span class="block leading-tight text-gray-900 text-center font-medium">{line}</span>
        {/each}
    </th>
{/snippet}

{#snippet row(item)}
    <tr class="hover:bg-gray-50 transition-colors">
        {#each table.cols as col}
            {@render cell(item, col)}
        {/each}
    </tr>
{/snippet}

{#snippet cell(item, col)}
    <!-- whitespace-nowrap stops row content from wrapping onto new lines -->
    <td class="whitespace-nowrap {col.css}">
        {item[col.key]}</td>
{/snippet}

<!-- SCROLLABLE WINDOW CONTAINER 
    - h-64 fixes height to force vertical scroll
    - max-w-full prevents layout breakages
    - overflow-auto manages both scroll directions automatically
-->
<div class="h-64 max-w-full overflow-auto rounded-lg border border-gray-200 shadow-sm">

    <!-- TABLE ELEMENT
        - w-max keeps columns shrunk tight to content size instead of stretching full-width
    -->
    <table class="w-max text-left text-sm border-collapse">
        
        <!-- STICKY MULTI-LINE HEADER
        - sticky top-0 keeps the header floating on vertical scroll
        - bg-gray-100 prevents table rows from showing through text
        -->
        <thead class="sticky top-0 bg-gray-100 text-gray-700 text-xs z-10 select-none">
            <tr class="border-b border-gray-200">
                {#each table.cols as col}
                    {@render header(col.headers)}
                {/each}
            </tr>
        </thead>
        
        <!-- TABLE DATA BODY -->
        <tbody class="divide-y divide-gray-200 bg-white">
            {#each table.data as item (item[table.idKey])}
                {@render row(item)}
            {/each}
        </tbody>
    </table>
</div>
