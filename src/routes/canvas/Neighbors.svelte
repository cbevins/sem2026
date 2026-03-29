<script>
    let {neighbors, focusCol, focusRow} = $props()
    function cellStr(cell) {
        const ar = []
        for(let byte of cell) {
            const str = (typeof byte !== 'undefined') ? byte.toString().padStart(4, ' ') : '?'
            ar.push(str)
        }
        return ar.join(', ')
    }
</script>

<div class='mt-4 ml-4 border'>
    Neighbors at {focusCol}, {focusRow}:
    <table>
        <tbody>
            {#each neighbors as row}
                <tr>
                    {#each row as cell}
                        <td class='border px-1 py-1'>{cellStr(cell)}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>