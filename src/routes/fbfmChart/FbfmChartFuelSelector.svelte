<script>
    import FuelModelButton from './FuelModelButton.svelte'
    let {
        fuelModels,     // object of fuelKey: {fuelKey, isOn, label}
        onFuelToggle,   // callback function to toggle a single fuel model
        setGroup,       // callback function to set/clear an entire fuel model group
    } = $props()

    function toggle(fuel) {
        console.log(fuel)
        onFuelToggle(fuel.fuelKey)
    }
    const onClasses = "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 focus:ring-emerald-500"
    const offClasses = "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:ring-gray-400"

//------------------------------------------
    // Reactive array holding state AND explicit, individual Tailwind configurations
    let controlPanel = $state([
        { id: 1, label: "HVAC System", isOn: false, activeStyle: "bg-emerald-600 focus:ring-emerald-500", inactiveStyle: "bg-gray-100 text-gray-700" },
        { id: 2, label: "Server Rack B", isOn: true, activeStyle: "bg-indigo-600 focus:ring-indigo-500", inactiveStyle: "bg-gray-100 text-gray-700" },
        { id: 3, label: "Emergency Lights", isOn: false, activeStyle: "bg-rose-600 focus:ring-rose-500 animate-pulse", inactiveStyle: "bg-red-50 text-red-700 border-red-200" },
        { id: 4, label: "Loading Dock Fan", isOn: false, activeStyle: "bg-amber-500 focus:ring-amber-400", inactiveStyle: "bg-gray-100 text-gray-700" }
    ]);

    function toggleButton(index) {
        // Standard array direct-mutation works natively in Svelte 5 deep reactivity
        controlPanel[index].isOn = !controlPanel[index].isOn;
    }
</script>
<div class="grid grid-cols-2 gap-4 p-6 bg-white rounded-xl shadow-sm max-w-md">
    {#each controlPanel as button, index (button.id)}
        <button
        type="button"
        onclick={() => toggleButton(index)}
        class="px-4 py-3 rounded-lg text-sm font-bold border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                {button.isOn ? `${button.activeStyle} text-white border-transparent` : `${button.inactiveStyle} border-gray-200`}"
        >
        {button.label}: {button.isOn ? 'ON' : 'OFF'}
        </button>
    {/each}
</div>

{#snippet clearGroupButton(groupKey)}
    <button
        type="button"
        onclick={() => setGroup(groupKey, false)}
        class="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide 
                select-none focus:outline-none focus:ring-2 focus:ring-offset-2 
                transition-all duration-200 ease-in-out active:scale-95"
        >
        Clr
    </button>
{/snippet}

{#snippet setGroupButton(groupKey)}
    <button
        type="button"
        onclick={() => setGroup(groupKey, true)}
        class="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide 
                select-none focus:outline-none focus:ring-2 focus:ring-offset-2 
                transition-all duration-200 ease-in-out active:scale-95"
        >
        Set
    </button>
{/snippet}

{#snippet fuelModelButton(fuel)}
    <button
        type="button"
        onclick={() => toggle(fuel)}
        class="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide 
                select-none focus:outline-none focus:ring-2 focus:ring-offset-2 
                transition-all duration-200 ease-in-out active:scale-95
                {fuel.isOn ? onClasses : offClasses}"
        >
        {fuel.label}
    </button>
{/snippet}

<h1 class='w-full text-center'>Fuel Model Selector</h1>

<!-- GR row -->
<div class="flex flex-row justify-center items-center gap-1 px-2">
    {@render clearGroupButton('gr')}
    {@render setGroupButton('gr')}
    {@render fuelModelButton(fuelModels.gr1)}
{#each [fuelModels.gr1, fuelModels.gr2, fuelModels.gr3,fuelModels.gr4, fuelModels.gr5, fuelModels.gr6, fuelModels.gr7, fuelModels.gr8, fuelModels.gr9] as fuel}
    <FuelModelButton fuel={fuel} onclick={toggle}
        onClasses = "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 focus:ring-emerald-500",
        offClasses = "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:ring-gray-400"
    />
{/each}
</div>

<!-- SH -->
<div class="flex flex-row justify-center items-center gap-1 px-2">

<button
    type="button"
    onclick={() => setGroup('sh', false)}
    class="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide 
            select-none focus:outline-none focus:ring-2 focus:ring-offset-2 
            transition-all duration-200 ease-in-out active:scale-95"
    >
    Clr
</button>
<button
    type="button"
    onclick={() => setGroup('sh', true)}
    class="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide 
            select-none focus:outline-none focus:ring-2 focus:ring-offset-2 
            transition-all duration-200 ease-in-out active:scale-95"
    >
    Set
</button>

{#each [fuelModels.sh1, fuelModels.sh2, fuelModels.sh3,fuelModels.sh4, fuelModels.sh5, fuelModels.sh6, fuelModels.sh7, fuelModels.sh8, fuelModels.sh9] as fuel}
    <FuelModelButton fuel={fuel} onclick={toggle}
        onClasses = "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 focus:ring-emerald-500",
        offClasses = "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:ring-gray-400"
    />
{/each}
</div>