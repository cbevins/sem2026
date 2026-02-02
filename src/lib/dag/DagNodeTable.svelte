<script module>
    import {FireEllipseMod} from './FireEllipseMod.js'
    export {DagNodeTable}
</script>

{#snippet nodeRow(content)}
    <td class='px-2 py-2 border border-gray-300'>{content}</td>
{/snippet}

{#snippet nodeHeader(content)}
    <td class='font-bold px-2 py-2 border border-gray-300'>{content}</td>
{/snippet}

{#snippet DagNodeTable(title, nodeArray)}
    <h2 class='mt-4 text-base font-bold'>{title} ({nodeArray.length})</h2>
    <table class='table-auto text-sm'>
        <thead>
            <tr>
                {@render nodeHeader('Numb')}
                {@render nodeHeader('Key')}
                {@render nodeHeader('Value')}
                {@render nodeHeader('Status')}
                {@render nodeHeader('Dirty')}
                {@render nodeHeader('Updater')}
            </tr>
        </thead>
        <tbody>
            {#each nodeArray as node, n}
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
{/snippet}
