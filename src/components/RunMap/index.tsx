import MapboxLanguage from '@mapbox/mapbox-gl-language';
import React, {useRef, useCallback, useState, useEffect} from 'react';
import Map, {Layer, Source, FullscreenControl, NavigationControl, MapRef} from 'react-map-gl';
import {MapInstance} from "react-map-gl/src/types/lib";
import useActivities from '@/hooks/useActivities';
import {
  MAP_LAYER_LIST,
  IS_CHINESE,
  ROAD_LABEL_DISPLAY,
  MAPBOX_TOKEN,
  PROVINCE_FILL_COLOR,
  COUNTRY_FILL_COLOR,
  USE_DASH_LINE,
  LINE_OPACITY,
  MAP_HEIGHT,
  PRIVACY_MODE,
  LIGHTS_ON,
} from '@/utils/const';
import { Coordinate, IViewState, geoJsonForMap } from '@/utils/utils';
import RunMarker from './RunMarker';
import RunMapButtons from './RunMapButtons';
import styles from './style.module.css';
import { FeatureCollection } from 'geojson';
import { RPGeometry } from '@/static/run_countries';
import './mapbox.css';
import LightsControl from "@/components/RunMap/LightsControl";

interface IRunMapProps {
  title: string;
  viewState: IViewState;
  setViewState: (_viewState: IViewState) => void;
  changeYear: (_year: string) => void;
  geoData: FeatureCollection<RPGeometry>;
  thisYear: string;
}

const STATIC_MAP_WIDTH = 1000;

const projectCoordinate = ([lon, lat]: Coordinate): Coordinate => {
  const safeLat = Math.max(Math.min(lat, 85), -85);
  const latRad = (safeLat * Math.PI) / 180;
  const x = (lon + 180) / 360;
  const y =
    (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2;
  return [x, y];
};

const collectLineCoordinates = (
  geoData: FeatureCollection<RPGeometry>
): Coordinate[] =>
  geoData.features.flatMap((feature) =>
    feature.geometry.type === 'LineString'
      ? (feature.geometry.coordinates as Coordinate[])
      : []
  );

const collectAllCoordinates = (
  geoData: FeatureCollection<RPGeometry>
): Coordinate[] => {
  const points: Coordinate[] = [];
  geoData.features.forEach((feature) => {
    const { geometry } = feature;
    if (geometry.type === 'LineString') {
      points.push(...(geometry.coordinates as Coordinate[]));
    } else if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach((ring) => points.push(...(ring as Coordinate[])));
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((polygon) =>
        polygon.forEach((ring) => points.push(...(ring as Coordinate[])))
      );
    }
  });
  return points;
};

const createStaticProjector = (
  geoData: FeatureCollection<RPGeometry>,
  height: number,
  viewState?: IViewState
) => {
  if (
    viewState?.longitude !== undefined &&
    viewState.latitude !== undefined &&
    viewState.zoom !== undefined
  ) {
    const center = projectCoordinate([viewState.longitude, viewState.latitude]);
    const scale =
      512 * Math.pow(2, viewState.zoom) * (STATIC_MAP_WIDTH / 800);
    return (coordinate: Coordinate): Coordinate => {
      const [x, y] = projectCoordinate(coordinate);
      return [
        (x - center[0]) * scale + STATIC_MAP_WIDTH / 2,
        (y - center[1]) * scale + height / 2,
      ];
    };
  }

  const boundsCoordinates = collectLineCoordinates(geoData);
  const sourceCoordinates = boundsCoordinates.length
    ? boundsCoordinates
    : collectAllCoordinates(geoData);
  const projected = sourceCoordinates.map(projectCoordinate);
  const xs = projected.map(([x]) => x);
  const ys = projected.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const padding = 48;
  const boundsWidth = Math.max(maxX - minX, 0.0001);
  const boundsHeight = Math.max(maxY - minY, 0.0001);
  const scale = Math.min(
    (STATIC_MAP_WIDTH - padding * 2) / boundsWidth,
    (height - padding * 2) / boundsHeight
  );
  const offsetX = (STATIC_MAP_WIDTH - boundsWidth * scale) / 2 - minX * scale;
  const offsetY = (height - boundsHeight * scale) / 2 - minY * scale;

  return (coordinate: Coordinate): Coordinate => {
    const [x, y] = projectCoordinate(coordinate);
    return [x * scale + offsetX, y * scale + offsetY];
  };
};

const linePathForCoordinates = (
  coordinates: Coordinate[],
  project: (_coordinate: Coordinate) => Coordinate
): string =>
  coordinates
    .map((coordinate, index) => {
      const [x, y] = project(coordinate);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

const polygonPathForRings = (
  rings: Coordinate[][],
  project: (_coordinate: Coordinate) => Coordinate
): string =>
  rings
    .map((ring) => `${linePathForCoordinates(ring, project)} Z`)
    .join(' ');

const polygonPathForFeature = (
  geometry: RPGeometry,
  project: (_coordinate: Coordinate) => Coordinate
): string => {
  if (geometry.type === 'Polygon') {
    return polygonPathForRings(geometry.coordinates as Coordinate[][], project);
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates
      .map((polygon) => polygonPathForRings(polygon as Coordinate[][], project))
      .join(' ');
  }
  return '';
};

const StaticRunMap = ({
  title,
  viewState,
  changeYear,
  geoData,
  thisYear,
  countries,
  provinces,
  isSingleRun,
  startLon,
  startLat,
  endLon,
  endLat,
  dash,
}: IRunMapProps & {
  countries: string[];
  provinces: string[];
  isSingleRun: boolean | number;
  startLon: number;
  startLat: number;
  endLon: number;
  endLat: number;
  dash: number[];
}) => {
  const style: React.CSSProperties = {
    width: '100%',
    height: MAP_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  };
  const project = createStaticProjector(geoData, MAP_HEIGHT, viewState);
  const provinceSet = new Set(provinces);
  const countrySet = new Set(countries);
  const polygonFeatures = geoData.features.filter(
    (feature) => feature.geometry.type !== 'LineString'
  );
  const lineFeatures = geoData.features.filter(
    (feature) => feature.geometry.type === 'LineString'
  );
  const [startX, startY] = project([startLon, startLat]);
  const [endX, endY] = project([endLon, endLat]);

  return (
    <div style={style}>
      <RunMapButtons changeYear={changeYear} thisYear={thisYear} />
      <svg
        aria-label="Map"
        role="img"
        viewBox={`0 0 ${STATIC_MAP_WIDTH} ${MAP_HEIGHT}`}
        width="100%"
        height="100%"
      >
        <rect width={STATIC_MAP_WIDTH} height={MAP_HEIGHT} fill="#1a1a1a" />
        {polygonFeatures.map((feature, index) => {
          const name = String(feature.properties?.name ?? '');
          const isProvince = provinceSet.has(name);
          const isCountry = countrySet.has(name);
          if (!isProvince && !isCountry) return null;
          const path = polygonPathForFeature(feature.geometry, project);
          const fill = isProvince ? PROVINCE_FILL_COLOR : COUNTRY_FILL_COLOR;
          const opacity = isProvince ? 0.85 : name === '中国' ? 0.12 : 0.85;
          return (
            <path
              key={`polygon-${name}-${index}`}
              d={path}
              fill={fill}
              fillOpacity={opacity}
              stroke={isCountry ? COUNTRY_FILL_COLOR : 'transparent'}
              strokeOpacity={isCountry ? (name === '中国' ? 0.25 : 1) : 0}
              strokeWidth={isCountry ? 2 : 0}
            />
          );
        })}
        {lineFeatures.map((feature, index) => {
          const coordinates = feature.geometry.coordinates as Coordinate[];
          if (!coordinates.length) return null;
          const color = String(feature.properties?.color ?? COUNTRY_FILL_COLOR);
          return (
            <path
              key={`line-${index}`}
              d={linePathForCoordinates(coordinates, project)}
              fill="none"
              stroke={color}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dash[1] ? '6 6' : undefined}
              opacity={1}
            />
          );
        })}
        {isSingleRun && (
          <>
            <circle cx={startX} cy={startY} r="6" fill="#cad9fc" />
            <circle cx={endX} cy={endY} r="6" fill="#e64c3c" />
          </>
        )}
      </svg>
      <span className={styles.runTitle}>{title}</span>
    </div>
  );
};

const RunMap = ({
  title,
  viewState,
  setViewState,
  changeYear,
  geoData,
  thisYear,
}: IRunMapProps) => {
  const { countries, provinces } = useActivities();
  const mapRef = useRef<MapRef>();
  const [lights, setLights] = useState(PRIVACY_MODE ? false : LIGHTS_ON);
  const keepWhenLightsOff = ['runs2']
  function switchLayerVisibility(map: MapInstance, lights: boolean) {
    const styleJson = map.getStyle();
    styleJson.layers.forEach((it: { id: string; }) => {
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
        const map = ref.getMap();
        if (map && IS_CHINESE) {
            map.addControl(new MapboxLanguage({defaultLanguage: 'zh-Hans'}));
        }
        // all style resources have been downloaded
        // and the first visually complete rendering of the base style has occurred.
        map.on('style.load', () => {
          if (!ROAD_LABEL_DISPLAY) {
            MAP_LAYER_LIST.forEach((layerId) => {
              map.removeLayer(layerId);
            });
          }
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
    height: MAP_HEIGHT,
  };
  const fullscreenButton: React.CSSProperties = {
    position: 'absolute',
    marginTop: '29.2px',
    right: '0px',
    opacity: 0.3,
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

  if (!MAPBOX_TOKEN) {
    return (
      <StaticRunMap
        title={title}
        viewState={viewState}
        setViewState={setViewState}
        changeYear={changeYear}
        geoData={geoData}
        thisYear={thisYear}
        countries={countries}
        provinces={provinces}
        isSingleRun={isSingleRun}
        startLon={startLon}
        startLat={startLat}
        endLon={endLon}
        endLat={endLat}
        dash={dash}
      />
    );
  }

  return (
    <Map
      {...viewState}
      onMove={onMove}
      style={style}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      ref={mapRefCallback}
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <RunMapButtons changeYear={changeYear} thisYear={thisYear} />
      <Source id="data" type="geojson" data={geoData}>
        <Layer
          id="province"
          type="fill"
          paint={{
            'fill-color': PROVINCE_FILL_COLOR,
            'fill-opacity': 0.85,
          }}
          filter={filterProvinces}
        />
        <Layer
          id="countries"
          type="fill"
          paint={{
            'fill-color': COUNTRY_FILL_COLOR,
            // in China, fill a bit lighter while already filled provinces
            'fill-opacity': ["case", ["==", ["get", "name"], '中国'], 0.12, 0.85],
          }}
          filter={filterCountries}
        />
        <Layer
          id="country-outline"
          type="line"
          paint={{
            'line-color': COUNTRY_FILL_COLOR,
            'line-width': 2,
            'line-opacity': ["case", ["==", ["get", "name"], '中国'], 0.25, 1],
            'line-blur': 0.4,
          }}
          filter={filterCountries}
        />
        <Layer
          id="runs2"
          type="line"
          paint={{
            'line-color':  ['get', 'color'],
            'line-width': isBigMap && lights ? 1 : 2,
            'line-dasharray': dash,
            'line-opacity': isSingleRun || isBigMap || !lights ? 1 : LINE_OPACITY,
            'line-blur': 1,
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
      <NavigationControl showCompass={false} position={'bottom-right'} style={{opacity: 0.3}}/>
    </Map>
  );
};

export default RunMap;
