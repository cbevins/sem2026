<script>
    import { FbfmChart } from '$lib/fbfmChart/index.js'
	import FbfmChartInput from './FbfmChartInput.svelte';
    import FbfmChartSvg from './FbfmChartSvg.svelte'
    import FbfmChartTable from './FbfmChartTable.svelte'

    console.clear()
    let chart = new FbfmChart()
    let results = $state(Object.values(chart.results))
    function update(input) {
        chart.update(input)
        results = Object.values(chart.results)
    }
</script>

<div class="mt-4 ml-4 mr-4 w-auto border">
    <FbfmChartInput {update} />
</div>

<div class="mt-4 ml-4 mr-4 w-auto">
    <FbfmChartSvg {results}/>
</div>

<div class="mt-4 ml-4 mr-4 w-auto">
    <FbfmChartTable {results}/>
</div>