
import type { Location } from '../types';

export const checkLocationPermission = async (): Promise<PermissionState> => {
  if (!navigator.permissions) {
    // Permissions API not supported, assume 'prompt' as a fallback.
    // The user will be prompted by getCurrentLocation anyway.
    return 'prompt';
  }
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    return permissionStatus.state; // 'granted', 'prompt', or 'denied'
  } catch (error) {
    console.error("Error checking location permission:", error);
    // If the query itself fails, fallback to 'prompt' to allow an attempt.
    return 'prompt';
  }
};


export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("PERMISSION_DENIED"));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("POSITION_UNAVAILABLE"));
            break;
          case error.TIMEOUT:
            reject(new Error("TIMEOUT"));
            break;
          default:
            reject(new Error("UNKNOWN_ERROR"));
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};