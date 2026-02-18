<script>
    import {ClassName, FileName, P} from '$lib/index.js'
	import BetaThetaPsi from './BetaThetaPsi.svelte'
</script>


<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-2xl'>Eventful Fire Ellipse Perimeter Demo</div>

    <P>A visual comparison of fire ellipse perimeter points derived from
        beta, theta, and/or psi angle increments.
    </P>
    <P>This also demonstrates use of <FileName>EventfulViewport.svelte</FileName>
        to enable dynamic update of Svg content from (a) component controls
        and (b) mouse and keyboard events over the SVG element.
        <ClassName>EventfulViewport</ClassName> also enables display of
        perimeter points in either a Cartesian or geographic coordinate system.
    </P>

    <BetaThetaPsi/>
</div>