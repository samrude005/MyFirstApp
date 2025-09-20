import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useRouter } from 'expo-router'; // Import the router

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true); // Prevent multiple scans
    console.log('Scanned data:', data);

    try {
      // For robustness, we'll assume the QR code contains a JSON object
      const qrData = JSON.parse(data);

      if (qrData.type === 'location' && qrData.id) {
        // Navigate to the complaint form, passing the location ID as a parameter
        router.push(`/complaint?location=${qrData.id}`);
      } else {
        alert('Invalid QR Code: This QR code is not a valid location code.');
      }
    } catch (error) {
      // If the QR code is just plain text, we can use it directly
      alert(`Scanned non-JSON QR Code. Navigating with raw data...`);
      router.push(`/complaint?location=${data}`);
    }

    // Reset the scanned state after a delay so the user can scan again
    setTimeout(() => setScanned(false), 3000);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.scanText}>Point your camera at a location QR code.</Text>
      </View>
    </View>
  );
}

// ... (styles remain the same)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#007AFF', borderStyle: 'dashed', borderRadius: 12 },
  scanText: { color: 'white', marginTop: 24, fontSize: 16 },
});