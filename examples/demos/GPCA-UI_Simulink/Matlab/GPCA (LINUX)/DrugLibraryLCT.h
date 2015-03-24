#include <stdio.h>
#include <assert.h>

extern void openFile(void);
extern void closeFile(void);

extern void DrugLibraryReader(unsigned int drugLibraryIndex[2],
				   unsigned int *drugName,
				   unsigned int *location,
				   unsigned int *doseUnit,
				   unsigned int *volumeUnit,
				   double *amount,
				   double *concentrationLowerSoft,
				   double *concentrationLowerHard,
				   double *concentrationTypical,
				   double *concentrationUpperSoft,
				   double *concentrationUpperHard,
				   double *vtbiLowerSoft,
				   double *vtbiLowerHard,
				   double *vtbiTypical,
				   double *vtbiUpperSoft,
				   double *vtbiUpperHard,
				   double *doseRateLowerSoft,
				   double *doseRateLowerHard,
				   double *doseRateTypical,
				   double *doseRateUpperSoft,
				   double *doseRateUpperHard,
				   double *bolusTypical,
				   unsigned int *bolusTimeTypical);
