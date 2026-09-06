<script>
    import { FbfmChart } from './FbfmChart.js'
	import FbfmChartInput from './FbfmChartInput.svelte'

    let chart = $state(new FbfmChart())

    // FbfmChartInput.svelte callback function
    function updatedInput(input) {
        chart.input = {...input}
        chart.update(input)
    }

</script>

                <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
                    <FbfmChartInput {updatedInput} />
                </div>
