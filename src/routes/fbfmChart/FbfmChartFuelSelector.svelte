<script>
    import { FbfmFuelGroups, FbfmFuelStyles as Style } from "./FbfmFuelStyles.js"

    let {
        selectedFbfm,   // object of {'gr1':true, 'gr2':false, ...}
        onFuelToggle,   // callback function to toggle a single fuel model
        onGroupToggle,  // callback function to turn all fuel models in a group on/off
    } = $props()
    
    const groupsArray = []
    for (let group of Object.values(FbfmFuelGroups)) {
        groupsArray.push(group)
    }

    const groupCss = "w-6 h-6 rounded-sm flex items-center justify-center text-[12px] font-bold tracking-wide select-none shadow-sm transition-all duration-200 ease-in-out active:scale-95"
    const buttonCss = "w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide select-none shadow-sm transition-all duration-200 ease-in-out active:scale-95"
</script>

{#each groupsArray as group}
    <div class="flex flex-row items-center gap-1 px-2">
        {group.groupKey.toUpperCase()}
        <button onclick={() => onGroupToggle(group, true)} class="bg-green-200 {groupCss}">All</button>
        <button onclick={() => onGroupToggle(group, false)} class="bg-red-200 w-8 {groupCss}">None</button>
        {#each group.fuelKeys as fuelKey}
            <button onclick={() => onFuelToggle(fuelKey)} class="{buttonCss}
                {selectedFbfm[fuelKey] ? `${Style[fuelKey].active}` : `${Style[fuelKey].inactive}`}"
            >
                {fuelKey}
            </button>
        {/each}
    </div>
{/each}
