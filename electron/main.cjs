// Add to existing IPC handler
ipcMain.handle('scan-target', async (event, { host, scanType, useOptimized, powerSaveMode }) => {
  const options = {
    // Adjust scan parameters based on power mode
    concurrent: powerSaveMode ? 10 : 100,
    timeout: powerSaveMode ? 2000 : 1000,
    portRanges: powerSaveMode 
      ? [[20, 100], [440, 450], [3389, 3389]] // Limited critical ports
      : [[1, 1024]], // Full range
    useOptimized
  };

  try {
    const scanner = NetworkScanner.getInstance();
    return await scanner.scanNetwork([host], options);
  } catch (error) {
    console.error('Scan error:', error);
    throw error;
  }
});