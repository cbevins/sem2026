<script>
    import ScrollableTable from './ScrollableTable.svelte'

    let {chart} = $props()
    let table = $derived(buildTable(chart))

    function buildTable(chart) {
        const center = 'p-2 text-gray-900 text-center'
        const left   = 'p-2 text-gray-900 text-left'
        const right  = 'p-2 text-gray-900 text-right'
        const t = {
            data: [],
            idKey: 'fuelKey',
            cols: [
                {key: 'fuelKey', headers: ['Fuel'], css: left},
                {key: 'isActive', headers: ['Active'], css: center},
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
        for(let fuelKey of chart.fuelKeys) {
            t.data.push({
                fuelKey,
                isActive: chart.isActive(fuelKey),
                ros: chart.ros(fuelKey).toFixed(2),
                fli: chart.fli(fuelKey).toFixed(0),
                flame: chart.flame(fuelKey).toFixed(2),
                depth: chart.depth(fuelKey).toFixed(2),
                savr: chart.savr(fuelKey).toFixed(0),
                deadMext: chart.deadMext(fuelKey).toFixed(2),
                liveMext: chart.liveMext(fuelKey).toFixed(2),
                wsrf: chart.wsrf(fuelKey).toFixed(2),
            })
        }
        return t
    }
</script>

<div class="m-2">
    <ScrollableTable {table}/>
</div>