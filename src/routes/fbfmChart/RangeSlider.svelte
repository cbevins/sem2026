<script>
    // Define Props with Runes
    let { 
        label = "Volume",  
        units="", 
        min = 0, 
        max = 100, 
        step = 1,          
        ticStep = 25,      
        value = $bindable(50), 
        onValueChange          
    } = $props();

    // Derived State for Ticks and Fill Percentage
    const ticksCount = $derived(Math.floor((max - min) / ticStep) + 1);
    const ticks = $derived(Array.from({ length: ticksCount }, (_, i) => min + i * ticStep));
    const fillPercentage = $derived(((value - min) / (max - min)) * 100);

    // Handle Input Updates
    function handleInput(e) {
        const newValue = Number(e.target.value);
        value = newValue;
        if (onValueChange) onValueChange(newValue);
    }
    </script>

    <!-- Parent Grid: 5 columns force the text label, active value, min bound, track, and max bound onto one ultra-tight line -->
    <div class="grid grid-cols-[4.5rem_3rem_0.5rem_1fr_auto] gap-x-1 items-center w-full select-none h-5">
    
    <!-- Column 1: Static Left Label -->
    <span class="text-[10px] font-semibold text-slate-500 tracking-wide truncate">
        {label}
    </span>

    <!-- Column 2: Real-time Value Label -->
    <div class="text-[10px] font-bold text-indigo-600 tabular-nums text-right">
        {value} {units}
    </div>

    <!-- Column 3: Min Value Indicator -->
    <span class="text-[10px] font-medium text-slate-400 tabular-nums select-none">
        {min}
    </span>

    <!-- Column 4: Slider Bar Track (Pips layered inside) -->
    <div class="relative flex items-center h-full mx-1">
        
        <!-- The Native Range Input Slider -->
        <input type="range" {min} {max} {step} {value}
        oninput={handleInput}
        list="slider-ticks"
        style="background: linear-gradient(to right, rgb(79, 70, 229) 0%, rgb(79, 70, 229) {fillPercentage}%, rgb(226, 232, 240) {fillPercentage}%, rgb(226, 232, 240) 100%);"
        class="w-full h-1.5 rounded-lg appearance-none cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-transparent
                focus:outline-none
                [&::-webkit-slider-runnable-track]:bg-transparent
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:relative
                [&::-webkit-slider-thumb]:z-30
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-indigo-600
                [&::-webkit-slider-thumb]:shadow-sm
                [&::-webkit-slider-thumb]:transition-all
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-moz-range-thumb]:border-none
                [&::-moz-range-thumb]:relative
                [&::-moz-range-thumb]:z-30
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-indigo-600
                [&::-moz-range-thumb]:shadow-sm"
        />

        <!-- Custom Embedded Pips inside the bar -->
        <div class="w-full flex justify-between px-1.5 pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 z-20">
        {#each ticks as tick}
            <span class="w-0.5 h-1.5 rounded-full transition-colors duration-150 {tick <= value ? 'bg-white/60' : 'bg-slate-400'}"></span>
        {/each}
        </div>

    </div>

    <!-- Column 5: Max Value Indicator -->
    <span class="text-[10px] font-medium text-slate-400 tabular-nums select-none">
        {max}
    </span>

    <!-- Hidden native datalist kept for keyboard snapping -->
    <datalist id="slider-ticks">
        {#each ticks as tick}
            <option value={tick}></option>
        {/each}
    </datalist>
    </div>
