/**
 * a field named coordinates that specifies the object's coordinates.
 * If specifying latitude and longitude coordinates, list the longitude first and then latitude:
 * Valid longitude values are between -180 and 180, both inclusive.
 * Valid latitude values are between -90 and 90, both inclusive.
 */
export interface GeoPoint {
  type: string;
  coordinates: Number[]; // e.g. [ -73.96943, 40.78519 ]
}
