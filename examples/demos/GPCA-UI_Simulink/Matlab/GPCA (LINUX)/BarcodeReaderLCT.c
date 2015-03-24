#include "BarcodeReaderLCT.h"

FILE *dFile;
void BarcodeReader(unsigned int *d_drugName,
				   double *d_concentration,
				   unsigned int *d_doseUnit,
				   unsigned int *d_volumeUnit,
				   double *d_amount,
				   double *d_diluentVolume) {
    /** The file drugFile contains information about the
     * drug in the reservoir in the format
     * {drug name, concentration, dose units, amount, diluent volume}.
     * We assume that the data is stored in the correct format in the file.
     * The S-function simply reads the data on the drug label, and
     * outputs it in the same format
     */

    char line[512];	/* Maximum length of a line */

    if(dFile!=NULL) {
        /* Read first line (comments) and discard it.*/
		fgets(line, sizeof line, dFile);
        /* Read second line (drug label data)*/
        fgets(line, sizeof line, dFile);
        printf ("Line -> %s\n", line);
		sscanf(line, "%d %lf %d %d %lf %lf", &d_drugName[0], &d_concentration[0], &d_doseUnit[0], &d_volumeUnit[0], &d_amount[0], &d_diluentVolume[0]);
		/* printf ("DrugName: %d\n", drugName[0]);
		/* printf ("Concentraion: %lf\n", concentration[0]);*/
        return;
    }
    /* Default output*/
    d_drugName[0] = 0;
	d_concentration[0] = 0;
	d_doseUnit[0] = 0;
	d_volumeUnit[0] = 0;
	d_amount[0] = 0;
	d_diluentVolume[0] = 0;
	return;
}

void openFile(void)
{
	static const char drugFile[] ="drug_reservoir_label.txt";
    dFile = fopen(drugFile, "r");
    if (dFile==NULL) {
        return;
    }
}

void closeFile(void)
{
    if (dFile==NULL) {
        return;
    }
    fclose(dFile);
}

