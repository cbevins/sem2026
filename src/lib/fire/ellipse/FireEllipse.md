# Fire Ellipse Peimeter Points

## Determing Perimeter Points

Points along the fire ellipse perimeter can be determined by proving one of the following angles:

- from the line segment defined by (a) the fire head and (b) the ignition point (indicated as the 'beta' angle);

- from the line segment defined by (a) the fire head and (b) the ellipse center (indicated as the 'theta' angle);

- between (a) the normal to the tangent of the fire ellipse and (b) the parallel to the ellipse major axis at that perimeter point (indicated as the psi angle).

If we know a fire's length-to-width ratio and forward spread rate or distance, we can determine the perimeter point at some beta, theta, or psi angle, and also determine that point's other two angles.

### 'Beta' Angle

The 'beta' angle is useful for determing fire spread rate, distance, and intensity in any direction from its ignition point (in those cases where the ignition point is known).

The greater the ellipse length-to-with ratio, the more the ignition point gravitates to the back of the ellipse. Therefore, for any given beta angle increment, the perimeter points become more sparse at the head of the fire (the region of greater interest) and more dense at the back (the region of lesser interest).

### 'Psi' Angle

The 'psi' angle is useful for determining fire spread rate and intensity in *any* direction relative to the fire heading direction, even when the ignition point is unkown (such as complex or irregular fire frontal shapes).

Because psi is the normal to the tangent of the ellipse, as the length-to-width ratio increases, so does the density of perimeter points at *both* the ellipse front and back.  But even though distance between perimeter points along the flanks become more spread out, the differences in fire behavior remain fairly iniform around the entire ellipse.

### 'Theta' Angle

The 'theta' angle is primarily useful as an intermediary for determing beta-from-psi, or psi-from-beta, and is seldom used as an input parameter in fire behavior modeling.  It *is* useful for getting a more uniform distribution of perimeter points around the ellipse.

Because theta is measured from the ellipse *center*, as the length-to-width ratio increases, the density of perimeter points at both the ellipse front and back also increases (just as for psi, but to a lesser degree). This makes theta the best choice for getting the most even distribution of perimeter points (without resorting to arc length interpolations).

## Fire Perimeter Point Coordinates

Every point on the fire ellipse perimeter has a position within 2 coordinate systems; the *Cartesian* and the *geographic*.

The Cartesian coordinate places the fire ignition point at the origin [0,0]. The fire heading direction is along the x-axis, and the center point and all perimeter point [x,y] coordinates are relative to ignition point. This is useful for performing mathematical computations on the ellipse geometry.

The geographic system translates the Cartesian [x,y] coordinates into *eastings* and *northings* relative to the ignition point's [east,north], which is more useful for fire perimeter mapping.
