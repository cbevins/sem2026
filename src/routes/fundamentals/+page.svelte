<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"

    let title = 'Fundamentals of Wildland Fire Modeling (2/26/2026)'
    let items = [{
        route: '/fundamentals/1-introduction',
        title: '1 - Introduction to Fundamentals of Wildland Fire Modeling',
        brief: ''
    },{
        route: '/fundamentals/2-fire-shape',
        title: '2 - Modeling Fire Shape and Growth',
        brief: '',
    },{
        route: '/fundamentals/3-surface-fire',
        title: '3 - Predicting Surface Fire Behavior',
        brief: '',
    }]
</script>
<MenuPage {items} {title}/>