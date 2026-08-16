<script>
    import { FbfmChart } from '$lib/fbfmChart/index.js'
    import RangeSlider from './RangeSlider.svelte'
    import FbfmChartSvg from './fbfmChartSvg.svelte'
    import FbfmChartTable from './fbfmChartTable.svelte'

    let data = $state({
        curedHerb: 2/3,
        moistureDead1h: 0.1,
        moistureDead10h: 0.01,
        moistureDead100h: 0.01,
        moistureLiveHerb: 0.3,
        moistureLiveStem: 0.3,
        midflameWindSpeed: 40*88,
        slopeRatio: 0,
        windBearing: 0,
        slopeAspect: 180,
    })
    let results = $state({})

    // Controller handlers
    function changeCuredHerb(newValue) {
        data.curedHerb = newValue/100
        update()
    }
    function changeDead1h(newValue) {
        data.moistureDead1h = newValue/100
        update()
    }
    function changeDead10h(newValue) {
        data.moistureDead10h = newValue/100
        update()
    }
    function changeDead100h(newValue) {
        data.moistureDead100h = newValue/100
        update()
    }
    function changeLiveHerb(newValue) {
        data.moistureLiveHerb = newValue/100
        update()
    }
    function changeLiveStem(newValue) {
        data.moistureLiveStem = newValue/100
        update()
    }
    function changeMidflameMph(newValue) {
        data.midflameWindSpeed = 88 * newValue
        update()
    }
    function changeSlopeDegrees(newValue) {
        data.slopeRatio = slopeRatio(newValue)
        update()
    }
    function update() {
        chart.update(data)
        results = Object.values(chart.results)
    }
    // function degrees(radians) { return radians * (180 / Math.PI) }
    function radians(degrees) { return degrees * (Math.PI / 180) }
    // function slopeDegrees(ratio) { return degrees(Math.atan(ratio)) }
    function slopeRatio(degrees) { return Math.tan(radians(degrees)) }

    console.clear()
    let chart = new FbfmChart()
    update()
</script>

<div class="mt-4 ml-4 mr-4 w-auto border">
<div class="flex flex-col w-80 gap-y-0 py-2">
    <RangeSlider label="Wind (mi/h)" min={0} max={20} step={1} ticStep={5} value={10}
        units="mph" onValueChange={changeMidflameMph}/>
    <RangeSlider label="Slope (deg)" min={0} max={80} step={1} ticStep={10} value={0}
        units="deg" onValueChange={changeSlopeDegrees}/>
    <RangeSlider label="Dead 1-h" min={0} max={40} step={1} ticStep={5} value={5}
        units="%" onValueChange={changeDead1h}/>
    <RangeSlider label="Dead 10-h" min={0} max={40} step={1} ticStep={5} value={10}
        units="%" onValueChange={changeDead10h}/>
    <RangeSlider label="Dead 100-h" min={0} max={40} step={1} ticStep={5} value={15}
        units="%" onValueChange={changeDead100h}/>
    <RangeSlider label="Live Herb" min={20} max={500} step={5} ticStep={50} value={120}
        units="%" onValueChange={changeLiveHerb}/>
    <RangeSlider label="Live Stem" min={20} max={500} step={5} ticStep={50} value={120}
        units="%" onValueChange={changeLiveStem}/>
    <RangeSlider label="Cured Herb" min={0} max={100} step={1} ticStep={10} value={0}
        units="%" onValueChange={changeCuredHerb}/>
</div>
</div>
<div class="mt-4 ml-4 mr-4 w-auto">
    Fire Behavior Fuel Models Chart
    <FbfmChartSvg results={results}/>
</div>

<div class="mt-4 ml-4 mr-4 w-auto">
    <FbfmChartTable results={results}/>
</div>