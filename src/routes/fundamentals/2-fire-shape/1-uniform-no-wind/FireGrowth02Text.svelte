<script>
    import {P} from '$lib/index.js'
    let {children} = $props()
</script>

<div class='h-48 mt-2 px-2 py-2 overflow-auto border rounded'>
<P>Adopting Huygen's Principle gives us three major benefits.
<ol class="list-disc list-inside">
<li>
First, because any point on the fire perimeter may be treated as the ignition point
of a new fire, we no longer need to know the original fire ignition point.</li>
<li>Second, our initial fire perimeter need not be a point or circle;
it can be any arbitrary shape.  All we require is a list of an initial fire
front or perimeter points.</li>
<li>Third, we no longer need to assume that uniform spatial and temporal burning conditions
exist over the entire potential fire area and burn time (which can span many squares miles
or kilometers over the course of days, weeks, or months).  Rather, we can initiate many
small, new fires along an existing perimeter at any desired spatial or temporal resolution.
Our assumption of uniform burning conditions may now be reduced to the order of 
square feet or meters over a period of minutes or hours.</li>
</ol>
</P><P>
The image below demonstrates the fire growth process over 5 time steps.
We begin with 72 perimeter points arranged at 15-degree intervals around a circle.
During each period:
<ol class="list-decimal list-inside">
<li>A new fire is started at each perimeter point along the fire perimeter.</li>
<li>At each point the direction of expansion is determined
    (as the normal to the tangent of the line segment connecting
    its 2 immediate neighborong points).</li>
<li>The expansion point in the direction of expansion is determined
    for the end of the time step.</li>
<li>The expansion points are collected into a new perimeter.</li>
</ol>
</P>

</div>
