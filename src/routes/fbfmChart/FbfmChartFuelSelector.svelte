<script>
import { FbfmFuelStyles as Style } from "./FbfmFuelStyles.js"

    let {chart,
        onFuelToggle,   // callback function to toggle a single fuel model
    } = $props()

    function toggleFuelModel(fuelKey) {
        // console.log('Button toggled', fuelKey)
        onFuelToggle(fuelKey)
    }

//------------------------------------------
</script>

<!-- GR row -->
{#each chart.getGroupsArray() as group}
    <div class="flex flex-row justify-center items-center gap-1 px-2">
        <h1>{group.groupKey}</h1>
        {#each group.fuelKeys as fuelKey}
            <button type='button', onclick={() => toggleFuelModel(fuelKey)}
                class="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide 
                select-none shadow-sm
                transition-all duration-200 ease-in-out active:scale-95
                {chart.fuel[fuelKey].isActive ? `${Style[fuelKey].active}` : `${Style[fuelKey].inactive}`}"
            >
                {fuelKey}
            </button>
        {/each}
    </div>
{/each}