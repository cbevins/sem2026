<script>
    // Svelte 5 Runes for configuration properties
    let { 
        onclick = null,
        fuel = {fuelKey: '1', label: 'One', isOn: true},
        // Provide clean, comprehensive default Tailwind strings if props are missing
        onClasses = "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 focus:ring-emerald-500",
        offClasses = "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:ring-gray-400"
    } = $props()

    // Derived properties that update automatically based on state shifts
    let activeColorClasses = $derived(fuel.isOn ? onClasses : offClasses)
    function toggle() {
        onclick(fuel)
    }
</script>

<!-- 
Perfect circle layout combining fixed width/height with rounded-full.
The active classes inject dynamically based on the current state.
-->
<button
    type="button"
    onclick={toggle}
    class="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wide 
            select-none focus:outline-none focus:ring-2 focus:ring-offset-2 
            transition-all duration-200 ease-in-out active:scale-95 {activeColorClasses}"
    >
    {fuel.label}
</button>
