// MapLibre paint requires literal colors. Keep both map views on one palette.
const mapPalettes = {
  light: {
    background: '#f3f7f9',
    land: '#f1e9dc',
    border: '#d5ccbe',
    visited: '#e6b08d',
    route: '#e87536',
    halo: '#ffffff',
  },
  dark: {
    background: '#202529',
    land: '#39312a',
    border: '#5c4d40',
    visited: '#926347',
    route: '#f0a16c',
    halo: '#1d1c1a',
  },
};
export const getMapPalette = (theme: 'light' | 'dark') => mapPalettes[theme];
