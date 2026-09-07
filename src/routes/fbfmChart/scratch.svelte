<!--  DYNAMIC STYLING EXAMPLE -->
<script>
    let status = 'active' // e.g., 'active', 'pending', 'error'
    const user = {status: 'Active'}
</script>
<!--  -->
<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
    {user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
    {user.status}
</span>

<!-- DYNAMICE STYLING USING data-* ATTRIBUTES -->
<div data-status={status} class="data-[status=active]:bg-green-500 data-[status=pending]:bg-yellow-500 data-[status=error]:bg-red-500 p-4">
    Status content
</div>

<!--  -->
{#snippet clearGroupButton(groupKey)}
    <button
        type="button"
        onclick={() => toggleFuelGroup(groupKey, false)}
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
        onclick={() => toggleFuelGroup(groupKey, true)}
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
        onclick={() => toggleFuelModel(fuel)}
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