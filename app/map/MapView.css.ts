import { style } from '@vanilla-extract/css';

export const mapContainer = style({
  width: '100%',
  height: '100vh',
  position: 'relative',
});

export const loadingContainer = style({
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  color: '#6c757d',
});

export const errorContainer = style({
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  color: '#dc3545',
});