<script>
    import { FbfmFuelGroups } from "./FbfmFuelStyles.js"
    import { FbfmFuelStyles as Style } from "./FbfmFuelStyles.js"

    let {
        selectedFbfm,
        onFuelToggle,   // callback function to toggle a single fuel model
        onGroupToggle,
    } = $props()
    
    const groupsArray = []
    for (let group of Object.values(FbfmFuelGroups)) {
        groupsArray.push(group)
    }
    function toggleFuel(fuelKey) {
        onFuelToggle(fuelKey)
    }
    function toggleGroup(groupKey, isActive) {
        onGroupToggle(groupKey, isActive)
    }
    const buttonCss = "w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide select-none shadow-sm transition-all duration-200 ease-in-out active:scale-95"
</script>

{#each groupsArray as group}
    <div class="flex flex-row items-center gap-1 px-2">
        {group.groupKey}
        <button onclick={() => toggleGroup(group, true)} class="{buttonCss}">All</button>
        <button onclick={() => toggleGroup(group, false)} class="w-8 {buttonCss}">None</button>
        {#each group.fuelKeys as fuelKey}
            <button onclick={() => toggleFuel(fuelKey)} class="{buttonCss}
                {selectedFbfm[fuelKey] ? `${Style[fuelKey].active}` : `${Style[fuelKey].inactive}`}"
            >
                {fuelKey}
            </button>
        {/each}
    </div>
{/each}