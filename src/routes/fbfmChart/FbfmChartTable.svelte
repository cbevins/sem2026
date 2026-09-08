<script>
    import ScrollableTable from './ScrollableTable.svelte'

    let {data} = $props()
    let table = $derived(buildTable(data))

    function buildTable(data) {
        const center = 'p-2 text-gray-900 text-center'
        const left   = 'p-2 text-gray-900 text-left'
        const right  = 'p-2 text-gray-900 text-right'
        const t = {
            data: [],
            idKey: 'fuelKey',
            cols: [
                {key: 'fuelKey', headers: ['Fuel'], css: left},
                {key: 'groupKey', headers: ['Group'], css: left},
                {key: 'isCurable', headers: ['Curable'], css: center},
                {key: 'ros', headers: ['RoS', '(ft/min)'], css: right},
                {key: 'fli', headers: ['FLI', '(Btu/ft/s)'], css: right},
                {key: 'flame', headers: ['Flame', '(ft)'], css: right},
                {key: 'depth', headers: ['Depth', '(ft)'], css: right},
                {key: 'savr', headers: ['SA/Vol', '(1/ft)'], css: right},
                {key: 'deadMext', headers: ['DeadMx', '(ratio)'], css: right},
                {key: 'liveMext', headers: ['LiveMx', '(ratio)'], css: right},
                {key: 'wsrf', headers: ['WSRF', '(ratio)'], css: right},
            ]
        }
        // Perform any units conversions, rounding, etc here
        for(let item of data) {
            const fuelKey = item.fuelKey
            t.data.push({
                fuelKey,
                groupKey: item.groupKey,
                isCurable: item.isCurable,
                ros: item.ros.toFixed(2),
                fli: item.fli.toFixed(0),
                flame: item.flame.toFixed(2),
                depth: item.depth.toFixed(2),
                savr: item.savr.toFixed(0),
                deadMext: item.deadMext.toFixed(2),
                liveMext: item.liveMext.toFixed(2),
                wsrf: item.wsrf.toFixed(2),
            })
        }
        return t
    }
</script>

<div class="m-2">
    <ScrollableTable {table}/>
</div>