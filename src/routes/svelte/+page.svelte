<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 Svelte Components'
    let items = [{
        route: '#',
        title: 'Svelte Components',
        brief: 'Svelte components and utility demos will go here!'
    }]
</script>
<MenuPage {items} {title}/>