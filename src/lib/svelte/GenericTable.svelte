<script>
    let {data, headers=null, title=null} = $props()
    // svelte-ignore state_referenced_locally
    let isObj = $state(isObject(data[0]))
    let keys = $state([])

    function isObject(item) {
        return (
            typeof item === "object" && // Check if the type is 'object'
            !Array.isArray(item) &&   // Exclude arrays using the Array.isArray() method
            item !== null             // Exclude null (which typeof returns as 'object')
        )
    }

    function objectCols(obj) {
        const ar = []
        for(let key of keys) ar.push(obj[key])
        return ar
    }

    // svelte-ignore state_referenced_locally
    if (isObj && (!headers || !headers.length)) {
        keys = Object.keys(data[0])
        headers = keys
    }
</script>

{#snippet cell(content)}
    <td class='px-2 py-2 border border-gray-300'>{content}</td>
{/snippet}

{#snippet header(content)}
    <td class='font-bold px-2 py-2 border border-gray-300'>{content}</td>
{/snippet}

{#snippet row(cols)}
    {#each cols as col}
        {@render cell(col)}
    {/each}
{/snippet}

{#if title && title!==''}
    <h2 class='mt-4 ml-4 text-base font-bold'>{title}</h2>
{/if}

<table class='table-auto text-sm'>
    <thead>
        {#if headers && headers.length}
            <tr>
                {#each headers as str}
                    {@render header(str)}
                {/each}
            </tr>
        {/if}
    </thead>
    <tbody>
        {#each data as item}
            <tr>
                {#if isObj}
                    {@render row(objectCols(item))}
                {:else}
                    {@render row(item)}
                {/if}
            </tr>
        {/each}
    </tbody>
</table>
