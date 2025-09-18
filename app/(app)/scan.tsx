import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { CameraView, Camera } from 'expo-camera';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={(...args) => {
            const data = args[0]?.data;
            if (data) {
                alert(`Bar code with data ${data} has been scanned!`);
            }
        }}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.scanText}>Point your camera at the QR code to scan it.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#007AFF', borderStyle: 'dashed', borderRadius: 12 },
  scanText: { color: 'white', marginTop: 24, fontSize: 16 },
});