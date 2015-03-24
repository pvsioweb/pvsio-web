#include <stdio.h>
#include <stdlib.h>
#include <time.h>

extern void openFile(void);
extern void closeFile(void);
extern void BarcodeReader(unsigned int *d_drugName,
				   double *d_concentration,
				   unsigned int *d_doseUnit,
				   unsigned int *d_volumeUnit,
				   double *d_amount,
				   double *d_diluentVolume);



