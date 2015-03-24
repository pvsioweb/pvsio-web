#include "PatientDataReaderLCT.h"

int selectedLine = 0;

FILE *file;
void patientReader(unsigned int *patientName,
				   unsigned int *patientAge,
				   unsigned int *patientGender,
				   unsigned int *patientWeight,
				   unsigned int drugLibraryIndex[2]){


	int i = 0;      /* Counter used to keep track of lines read in patient file */
	char line[128];	/* Maximum length of a line */
/*    int selectedLine = 0; */
    int drug = 0;
	int location = 0;
    /*FILE *fptr = (FILE *) fid;*/

	/*file = fopen(patientFile, "r");*/
	if(file==NULL) {
	    patientName[0] = 0;
	    patientAge[0] = 0;
	    patientGender[0] = 0;
	    patientWeight[0] = 0;
	    drugLibraryIndex[0] = 0;
	    drugLibraryIndex[1] = 0;
	}
	else {
        while (fgets(line, sizeof line, file)!=NULL) /* Read a line */
		{
			i++;
			if (i==selectedLine) {

				sscanf(line, "%d %d %d %d %d %d", patientName, patientAge,
													patientGender, patientWeight, &drug, &location);
			}
		}

        drugLibraryIndex[0] = drug;   /*Store drug*/
		drugLibraryIndex[1] = location;   /*Store location*/

    }
    printf ("Patient data: %d %d %d %d %d %d\n", *patientName, *patientAge, *patientGender, *patientWeight, drug, location);
    /*printf ("Index: %d %d\n", drugLibraryIndex[0], drugLibraryIndex[1]);*/
    rewind(file);
}



void openFile(void)
{
	int numLines = 0;	/* Number of lines in the patient file*/

    /*FILE *fptr;*/
    file = fopen("patient.txt","r");
    if (file==NULL) {
        return;
    }
    /*file = fptr;*/

    /* Get number of total number of lines in the patient file*/
	numLines = numberOfLines();

    /* Non-deterministically select a random line from the patient file*/
	selectedLine = selectLine(1, numLines);
}

void closeFile(void)
{
    /*FILE *fptr = (FILE *) *fid;*/

    if (file==NULL) {
        return;
    }

    fclose(file);
}

int numberOfLines(void) {
	/** Returns the number of lines in the specified file **/
	int lines = 0;	/* The counter for number of lines*/
	char ch;

	if(file==NULL) {
		return -1;
	}
	else {
		while (!feof(file)) {
			ch = getc(file);
			if (ch == '\n') {
				lines++;
			}
		}
	}
	/* Rewind the file to point to the beginning of the file*/
	rewind(file);
	return lines;
}

static int selectLine(int LOW, int HIGH) {
	/** Generates a randome number between LOW and HIGH, inclusive **/
	int selectedLine;
	/* srand(time(NULL));	/* Seed random number generator*/
	selectedLine = rand()%(HIGH-LOW)+LOW+1;
	return selectedLine;
}

void randomizeSeed(void) {
	/* srand((unsigned int)time(NULL));*/
}
