/**
 * NASA Earth Observation & GIBS Imagery Layer Service
 * Provides NASA GIBS (Global Imagery Browse Services) layer configurations
 * and satellite observations for sea surface temperature & ocean color.
 */

export interface NasaSatelliteLayer {
  id: string;
  title: string;
  wmtsEndpoint: string;
  format: string;
  layerName: string;
}

export function getNasaSatelliteLayers(): NasaSatelliteLayer[] {
  return [
    {
      id: 'sst-modis',
      title: 'MODIS Sea Surface Temperature (Day)',
      wmtsEndpoint: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_L3_SST_Thermal_4km_Day_Daily/default/',
      format: 'image/png',
      layerName: 'MODIS_Aqua_L3_SST_Thermal_4km_Day_Daily',
    },
    {
      id: 'chlorophyll-a',
      title: 'VIIRS Ocean Color Chlorophyll-a',
      wmtsEndpoint: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_L3_Chlorophyll_a_4km_Daily/default/',
      format: 'image/png',
      layerName: 'VIIRS_SNPP_L3_Chlorophyll_a_4km_Daily',
    },
  ];
}
