export const geojsonRectPoint = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [40, 40], 
          [40, 80],
          [80, 80],
          [80, 40],
          [40, 40]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "dot"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [30, 20]
      }
    }
  ]
}