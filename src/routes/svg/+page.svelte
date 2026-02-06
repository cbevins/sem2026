<script>
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 SVG Classes & Utilities'
    let items = [{
        route: '/svg/svgscope',
        title: 'SVG Scope',
        brief: 'SVG Scope is a Svelte component that enables zooming and panning of SVG images'
    },{
        route: '/svg/viewport',
        title: 'SVG ViewPort',
        brief: 'Another SVG Svelte component that enables zooming and panning of SVG images'
    }]
</script>
<MenuPage {items} {title}/>