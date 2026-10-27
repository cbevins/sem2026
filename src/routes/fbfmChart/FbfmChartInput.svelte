<script>
    import RangeSlider from './RangeSlider.svelte'

    // Parent component callback function
    let {updateInput, currentInput} = $props()

    let input = $derived({...currentInput})

    // Controller handlers
    function changeCuredHerb(newValue) {
        input.curedHerb = newValue/100
        updateInput(input)
    }
    function changeDead1h(newValue) {
        input.moistureDead1h = newValue/100
        updateInput(input)
    }
    function changeDead10h(newValue) {
        input.moistureDead10h = newValue/100
        updateInput(input)
    }
    function changeDead100h(newValue) {
        input.moistureDead100h = newValue/100
        updateInput(input)
    }
    function changeLiveHerb(newValue) {
        input.moistureLiveHerb = newValue/100
        updateInput(input)
    }
    function changeLiveStem(newValue) {
        input.moistureLiveStem = newValue/100
        updateInput(input)
    }
    function changeMidflameMph(newValue) {
        input.midflameWindSpeed = 88 * newValue
        updateInput(input)
    }
    function changeSlopeDegrees(newValue) {
        input.slopeRatio = slopeRatio(newValue)
        updateInput(input)
    }
    function changeSlopeRatio(newValue) {
        input.slopeRatio = newValue
        input.slopeDegrees = slopeDegrees(newValue)
        updateInput(input)
    }
    function degrees(radians) { return radians * (180 / Math.PI) }
    function radians(degrees) { return degrees * (Math.PI / 180) }
    function slopeDegrees(ratio) { return degrees(Math.atan(ratio)) }
    function slopeRatio(degrees) { return Math.tan(radians(degrees)) }
</script>

<div class="flex flex-col w-80 gap-y-0 py-0">
    <RangeSlider label="Midflame Wind Speed" min={0} max={20} step={1} ticStep={5} value={10}
        units="mph" onValueChange={changeMidflameMph}/>
    <RangeSlider label="Slope Degrees" min={0} max={80} step={1} ticStep={10} value={input.slopeDegrees}
        units="deg" onValueChange={changeSlopeDegrees}/>
    <RangeSlider label="Slope Ratio" min={0} max={5.7} step={0.1} ticStep={0.2}
        units="ratio" value={input.slopeRatio} onValueChange={changeSlopeRatio}/>
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
