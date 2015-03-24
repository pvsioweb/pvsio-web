#include "DrugLibraryLCT.h"

FILE *file;
void DrugLibraryReader(unsigned int drugLibraryIndex[2],
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
				   unsigned int *bolusTimeTypical)
{
	/* double tempData[21]; */
	static const char drugLibraryFile[] ="drug_library.txt";
	int numLines;	/* Number of lines in the drug library */
	int i = 0;		/* Counter */
	int found = 0;	/* Boolean flag used to indicate that the <drug name, location> double was found in the D.L. */
	char line[512];	/* Maximum length of a line */

	/* Read first line (comments) and discard it. */
	fgets(line, sizeof line, file);
	while (fgets(line, sizeof line, file)!=NULL) /* Read a line */
	{
		sscanf(line, "%d %d %d %d %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %d",
					&drugName[0], &location[0], &doseUnit[0], &volumeUnit[0], &amount[0], &concentrationLowerSoft[0], &concentrationLowerHard[0],
					&concentrationTypical[0], &concentrationUpperSoft[0], &concentrationUpperHard[0], &vtbiLowerSoft[0], &vtbiLowerHard[0], &vtbiTypical[0],
					&vtbiUpperSoft[0], &vtbiUpperHard[0], &doseRateLowerSoft[0], &doseRateLowerHard[0], &doseRateTypical[0], &doseRateUpperSoft[0],
					&doseRateUpperHard[0], &bolusTypical[0], &bolusTimeTypical[0]);

		if ((drugName[0]==drugLibraryIndex[0]) && (location[0]==drugLibraryIndex[1])) {
			found = 1;
			break;
		}
	}
	if (found == 0) {
		printf("Could not find the specified drug and location.\n");
		drugName[0] = 0;
		location[0] = 0;
		/* diluentVolume[0] = 0; */
		doseUnit[0] = 0;
		volumeUnit[0] = 0;
		amount[0] = 0;
		concentrationLowerSoft[0] = 0;
		concentrationLowerHard[0] = 0;
		concentrationTypical[0] = 0;
		concentrationUpperSoft[0] = 0;
		concentrationUpperHard[0] = 0;
		vtbiLowerSoft[0] = 0;
		vtbiLowerHard[0] = 0;
		vtbiTypical[0] = 0;
		vtbiUpperSoft[0] = 0;
		vtbiUpperHard[0] = 0;
		doseRateLowerSoft[0] = 0;
		doseRateLowerHard[0] = 0;
		doseRateTypical[0] = 0;
		doseRateUpperSoft[0] = 0;
		doseRateUpperHard[0] = 0;
		bolusTypical[0] = 0;
		bolusTimeTypical[0] = 0;
	}

    rewind(file);
}

void openFile(void)
{
	static const char drugLibraryFile[] ="drug_library.txt";

	/*FILE *fptr;*/
	file = fopen(drugLibraryFile,"r");
	if (file==NULL) {
		return;
	}
}

void closeFile(void)
{
	if (file==NULL) {
		return;
	}
	fclose(file);
}
