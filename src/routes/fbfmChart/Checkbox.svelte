<script>
    // Svelte 5 Runes for component property distribution
    let { 
        id = "chk-" + Math.random().toString(36).substring(2, 9),
        label = "", 
        description = "",
        disabled = false,
        checked = $bindable(false)
    } = $props()
</script>

<label for={id} class="flex items-start gap-3 select-none max-w-sm group {disabled ? 'cursor-not-allowed' : 'cursor-pointer'}">
<div class="relative flex items-center h-5 mt-0.5">
    <!-- Functional hidden native checkbox for accessibility -->
    <input
    id={id}
    type="checkbox"
    bind:checked={checked}
    disabled={disabled}
    class="peer absolute opacity-0 w-0 h-0 m-0"
    />
    
    <!-- Checkbox Border Frame (Stays white background, changes border color on check) -->
    <div class="w-5 h-5 rounded-md border-2 bg-white flex items-center justify-center transition-all duration-200
    {checked ? 'border-emerald-500' : 'border-gray-300'}
    peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2
    group-hover:border-gray-400 {checked ? 'group-hover:border-emerald-600' : ''}
    peer-disabled:bg-gray-50 peer-disabled:border-gray-200 peer-disabled:group-hover:border-gray-200"
    >
    
    <!-- Green Custom SVG Check Icon (Turns emerald-500 and scales up when checked) -->
    <svg 
        class="w-3.5 h-3.5 text-emerald-500 transition-transform duration-200 {checked ? 'scale-100' : 'scale-0'}
            peer-disabled:text-gray-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        stroke-width="4"
    >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
    </div>
</div>

<!-- Text and Descriptive Labels -->
{#if label || description}
    <div class="text-sm leading-5">
    <span class="font-medium transition-colors duration-150
        {disabled ? 'text-gray-400' : 'text-gray-900'}">
        {label}
    </span>
    {#if description}
        <p class="mt-0.5 text-xs transition-colors duration-150 {disabled ? 'text-gray-300' : 'text-gray-500'}">
        {description}
        </p>
    {/if}
    </div>
{/if}
</label>
