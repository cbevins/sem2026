<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = '2 - Modeling Fire Shape and Growth'
    let items = [{
        route: '/fundamentals/2-fire-shape/1-uniform-no-wind',
        title: '1 - Fire Shape Under Uniform Conditions with No-Wind, No-Slope',
        brief: ''
    },{
        route: '/fundamentals/2-fire-shape/2-uniform-wind-slope',
        title: '2 - Effects of Wind and Slope on Fire Shape',
        brief: ''
    }]
</script>
<MenuPage {items} {title}/>