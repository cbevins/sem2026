<script>
    import MenuPage from "./MenuPage.svelte"
    let title = 'SEM2006 Projects'
    let items = [{
        route: '/fire',
        title: 'Fire Behavior Projects',
        brief: 'Fire behavior models',
    },{
        route: '/svgscope',
        title: 'SVG Scope',
        brief: 'SVG Scope is a Svelte component that enables zooming and panning of SVG images'
    },{
        route: '#',
        title: 'Project 3 Title',
        brief: 'Project 3 Brief',
    }]
</script>
<MenuPage {items} {title}/>