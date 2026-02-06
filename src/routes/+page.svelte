<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 Projects'
    let items = [{
        route: '/fire',
        title: 'Fire Behavior Projects',
        brief: 'Demos of various wildland fire behavior models',
    },{
        route: '/svg',
        title: 'SVG Classes & Utilities',
        brief: 'Demos of various SVG utility classes'
    },{
        route: '/svelte',
        title: 'Svelte Components',
        brief: 'Demos of various SVelte components',
    }]
</script>
<MenuPage {items} {title}/>