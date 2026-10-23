import { useTheme } from '@/hooks/useTheme';
import React, {useRef, useCallback, useState, useEffect} from 'react';
import Map, {Layer, Source, FullscreenControl, NavigationControl, MapRef} from 'react-map-gl/maplibre';
import type {Map as MapLibreMap} from 'maplibre-gl';
import useActivities from '@/hooks/useActivities';
import {
  IS_CHINESE,
  USE_DASH_LINE,
  LINE_OPACITY,
  MAP_HEIGHT,
  PRIVACY_MODE,
  LIGHTS_ON,
} from '@/utils/const';
import { Coordinate, IViewState, geoJsonForMap } from '@/utils/utils';
import YearFilter from '@/components/YearFilter';
import RunMarker from './RunMarker';
import styles from './style.module.css';
import { FeatureCollection } from 'geojson';
import { RPGeometry } from '@/static/run_countries';
import 'maplibre-gl/dist/maplibre-gl.css';
import './mapbox.css';
import LightsControl from "@/components/RunMap/LightsControl";

interface IRunMapProps {
  title: string;
  viewState: IViewState;
  setViewState: (_viewState: IViewState) => void;
  geoData: FeatureCollection<RPGeometry>;
  year: string;
  displayedYear: string;
  changeYear: (_year: string) => void;
}

const MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#fdfdfb',
      },
    },
  ],
} as const;

const RunMap = ({
  title,
  viewState,
  setViewState,
  geoData,
  year,
  displayedYear,
  changeYear,
}: IRunMapProps) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const mapColors = { background: dark ? '#181e1b' : '#fdfdfb', visited: dark ? '#769884' : '#3e5b4e', border: dark ? '#35463a' : '#d2d9cf', route: dark ? '#e2b48d' : '#a44922' };
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map?.getLayer('background')) map.setPaintProperty('background', 'background-color', mapColors.background);
  }, [theme]);
  const { countries, provinces } = useActivities();
  const mapRef = useRef<MapRef>();
  const [lights, setLights] = useState(PRIVACY_MODE ? false : LIGHTS_ON);
  const keepWhenLightsOff = ['background', 'runs2']
  function switchLayerVisibility(map: MapLibreMap, lights: boolean) {
    // Privacy mode already uses a local, empty base style; keep its public summary layers.
    if (PRIVACY_MODE) return;
    const styleJson = map.getStyle();
    if (!styleJson?.layers) return;
    styleJson.layers.forEach((it) => {
      if (!keepWhenLightsOff.includes(it.id)) {
        if (lights)
          map.setLayoutProperty(it.id, 'visibility', 'visible');
        else
          map.setLayoutProperty(it.id, 'visibility', 'none');
      }
    })
  }
  const mapRefCallback = useCallback(
    (ref: MapRef) => {
      if (ref !== null) {
        mapRef.current = ref;
        const map = ref.getMap();
        // all style resources have been downloaded
        // and the first visually complete rendering of the base style has occurred.
        map.on('style.load', () => {
          mapRef.current = ref;
          switchLayerVisibility(map, lights);
        });
      }
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        switchLayerVisibility(map, lights);
      }
    },
    [mapRef, lights]
  );
  const filterProvinces = provinces.slice();
  const filterCountries = countries.slice();
  // for geojson format
  filterProvinces.unshift('in', 'name');
  filterCountries.unshift('in', 'name');

  const initGeoDataLength = geoData.features.length;
  const isBigMap = (viewState.zoom ?? 0) <= 3;
  if (isBigMap && IS_CHINESE) {
    // Show boundary and line together, combine geoData(only when not combine yet)
    if(geoData.features.length === initGeoDataLength){
      geoData = {
          "type": "FeatureCollection",
          "features": geoData.features.concat(geoJsonForMap().features)
      };
    }
  }

  const isSingleRun =
    geoData.features.length === 1 &&
    geoData.features[0].geometry.coordinates.length;
  let startLon = 0;
  let startLat = 0;
  let endLon = 0;
  let endLat = 0;
  if (isSingleRun) {
    const points = geoData.features[0].geometry.coordinates as Coordinate[];
    [startLon, startLat] = points[0];
    [endLon, endLat] = points[points.length - 1];
  }
  let dash = USE_DASH_LINE && !isSingleRun && !isBigMap ? [2, 2] : [2, 0];
  const onMove = React.useCallback(({ viewState }: { viewState: IViewState }) => {
    setViewState(viewState);
  }, []);
  const style: React.CSSProperties = {
    width: '100%',
    height: `clamp(320px, 92vw, ${MAP_HEIGHT}px)`,
  };
  const fullscreenButton: React.CSSProperties = {
    position: 'absolute',
    marginTop: '29.2px',
    right: '0px',
    opacity: 1,
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (mapRef.current) {
        mapRef.current.getMap().resize();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Map
      {...viewState}
      onMove={onMove}
      onLoad={() => mapRef.current?.getMap().setPaintProperty('background', 'background-color', mapColors.background)}
      style={style}
      mapStyle={MAP_STYLE}
      ref={mapRefCallback}
    >
      <Source id="data" type="geojson" data={geoData}>
        <Layer
          id="province"
          type="fill"
          paint={{
            'fill-color': mapColors.visited,
            'fill-opacity': 0.85,
          }}
          filter={filterProvinces}
        />
        <Layer
          id="countries"
          type="fill"
          paint={{
            'fill-color': mapColors.visited,
            // in China, fill a bit lighter while already filled provinces
            'fill-opacity': ["case", ["==", ["get", "name"], '中国'], 0.12, 0.85],
          }}
          filter={filterCountries}
        />
        <Layer
          id="runs2"
          type="line"
          paint={{
            'line-color': ['case', ['!=', ['geometry-type'], 'LineString'], mapColors.border, ['has', 'color'], ['match', ['get', 'color'], ['rgb(224,237,94)', '#e0ed5e', '#e1ed5e'], mapColors.route, ['rgb(51,255,87)'], '#518ba0', ['rgb(255,153,51)'], '#b77d38', ['rgb(151,51,255)'], '#8e709d', ['rgb(255,51,51)'], '#b55e65', ['#000000', '#000', 'black'], mapColors.border, ['get', 'color']], mapColors.border],
            'line-width': isBigMap && lights ? 1 : 2,
            'line-dasharray': dash,
            'line-opacity': isSingleRun || isBigMap || !lights ? 1 : LINE_OPACITY,
            'line-blur': 0,
          }}
          layout={{
            'line-join': 'round',
            'line-cap': 'round',
          }}
        />
      </Source>
      {isSingleRun && (
        <RunMarker
          startLat={startLat}
          startLon={startLon}
          endLat={endLat}
          endLon={endLon}
        />
      )}
      <span className={styles.runTitle}>{title}</span>
      <FullscreenControl style={fullscreenButton}/>
      {!PRIVACY_MODE && <LightsControl setLights={setLights} lights={lights}/>}
      <NavigationControl showCompass={false} position={'bottom-right'} style={{opacity: 1}}/>
      <div className="absolute right-3 top-3 z-10 lg:hidden">
        <YearFilter
          year={year}
          displayedYear={displayedYear}
          onChange={changeYear}
        />
      </div>
    </Map>
  );
};

export default RunMap;
