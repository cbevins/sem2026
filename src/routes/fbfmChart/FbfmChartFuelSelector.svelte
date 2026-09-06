<script>
    import FuelModelButton from './FuelModelButton.svelte'
    let {
        data,   // Array of objects of:
                // {fuel, fuelKey, ros, fli, flame, deadMext, depth, liveMext, savr, wsrf}
                // and where 'fuel' is an object of:
                // {fuelKey, label, isCurable,isActive, fuelModel, fuelBed, fuelIgnition, fireBehavior}
        groups, // object whose props {'13', 'gr', 'gs', 'sh', 'tl', 'tu', 'sb'}
                // are arrays of group member fuelKeys
        onFuelToggle,   // callback function to toggle a single fuel model
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

<!-- GR row -->
<div class="flex flex-row justify-center items-center gap-1 px-2">
    {#each groups.gr as group}
        <h1>{group}</h1>
    {/each}
</div>