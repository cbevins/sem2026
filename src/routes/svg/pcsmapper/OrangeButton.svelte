<script>
    let {label, handler} = $props()
</script>

<button class="group flex h-10 items-center justify-center rounded-md border border-orange-600 bg-linear-to-b from-orange-400 via-orange-500 to-orange-600 px-4 text-neutral-50 shadow-[inset_0_1px_0px_0px_#fdba74] active:[box-shadow:none]"
    onclick={handler}>
    <span class="block group-active:[transform:translate3d(0,1px,0)]">
        {label}</span>
</button>