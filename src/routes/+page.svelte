<script>
    const items = [{
        route: '#',
        title: 'Project 1 Title',
        brief: 'Project 1 Brief',
    },{
        route: '#',
        title: 'Project 2 Title',
        brief: 'Project 2 Brief',
    },{
        route: '#',
        title: 'Project 3 Title',
        brief: 'Project 3 Brief',
    },{
    }]
</script>

<div class="border-2 border-black rounded overflow-hidden mt-4 mb-4 p-4">
    <h1 class='text-xl font-bold'>SEM 2026 Projects</h1>
    <h2 class='text-lg font-bold>'>{new Date()}</h2>
    <div class='grid grid-cols-2 gap-4'>
        {#each items as item}
            <div class='border bg-green-500 rounded'>
                <a href={item.route} class="block max-w-sm p-6 hover:bg-neutral-secondary-medium">
                    <h5 class="mb-3 text-2xl text-white font-semibold text-heading leading-8">
                        {item.title}</h5>
                        <p class="text-white">{item.brief}</p>
                    </a>
            </div>
        {/each}
    </div>
</div>