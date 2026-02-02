<script>
    // Funky list of SvgMap properties
    let {d} = $props()
</script>

<div class='ml-5 mt-5 border'>
SVG Map Frame Dimensions
<ul>
    <li>Frame Width, Height = {d.f.width}, {d.f.height}</li>
</ul>
</div>

<div class='ml-5 mt-5 border'>
World Dimensions
<ul>
    <li>World Left - Right, Width = {d.w.left} - {d.w.right}, {d.w.width}</li>
    <li>World Bottom - Top, Height = {d.w.bottom} - {d.w.top}, {d.w.height}</li>
    <li>World Scale at Zoom 1 = {d.w.scale}</li>
</ul>
</div>

<div class='ml-5 mt-5 border'>
View Dimensions
<ul>
    <li>View Zoom {d.v.zoom} is Scale {d.v.scale}</li>
    <li>View Left - Right, Width = {d.v.left} - {d.v.right}, {d.v.width}</li>
    <li>View Bottom - Top, Height = {d.v.bottom} - {d.v.top}, {d.v.height}</li>
    <li>View Center = [{d.v.cx}, {d.v.cy}]</li>
    <li>View Center (frame) = [{d.frameX(d.v.cx)}, {d.frameY(d.v.cy)}]</li>
</ul>
</div>
