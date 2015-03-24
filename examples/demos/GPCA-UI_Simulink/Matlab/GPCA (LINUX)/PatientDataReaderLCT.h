#include <stdio.h>

#include <stdlib.h>
#include <time.h>

extern void openFile(void);
extern void closeFile(void);
extern void patientReader(unsigned int *patientName,
				   unsigned int *patientAge,
				   unsigned int *patientGender,
				   unsigned int *patientWeight,
				   unsigned int drugLibraryIndex[2]);

static int selectLine(int LOW, int HIGH);
int numberOfLines(void) ;
void randomizeSeed(void);
extern int selectedLine;
