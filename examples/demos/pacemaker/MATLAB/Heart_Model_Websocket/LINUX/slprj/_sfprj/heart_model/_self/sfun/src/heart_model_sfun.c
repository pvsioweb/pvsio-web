/* Include files */

#include "heart_model_sfun.h"
#include "c3_heart_model.h"
#include "c4_heart_model.h"
#include "c5_heart_model.h"
#include "c6_heart_model.h"
#include "c7_heart_model.h"
#include "c8_heart_model.h"
#include "c9_heart_model.h"
#include "c10_heart_model.h"
#include "c11_heart_model.h"
#include "c12_heart_model.h"
#include "c13_heart_model.h"
#include "c14_heart_model.h"
#include "c15_heart_model.h"
#include "c16_heart_model.h"
#include "c17_heart_model.h"
#include "c18_heart_model.h"
#include "c19_heart_model.h"
#include "c20_heart_model.h"
#include "c21_heart_model.h"
#include "c22_heart_model.h"
#include "c23_heart_model.h"
#include "c24_heart_model.h"
#include "c25_heart_model.h"
#include "c26_heart_model.h"
#include "c27_heart_model.h"
#include "c28_heart_model.h"
#include "c29_heart_model.h"
#include "c30_heart_model.h"
#include "c31_heart_model.h"
#include "c32_heart_model.h"
#include "c33_heart_model.h"
#include "c34_heart_model.h"
#include "c35_heart_model.h"
#include "c36_heart_model.h"
#include "c37_heart_model.h"
#include "c38_heart_model.h"
#include "c39_heart_model.h"
#include "c40_heart_model.h"
#include "c41_heart_model.h"
#include "c42_heart_model.h"
#include "c43_heart_model.h"
#include "c44_heart_model.h"
#include "c45_heart_model.h"
#include "c46_heart_model.h"
#include "c47_heart_model.h"
#include "c48_heart_model.h"
#include "c49_heart_model.h"
#include "c50_heart_model.h"
#include "c51_heart_model.h"
#include "c52_heart_model.h"
#include "c53_heart_model.h"
#include "c54_heart_model.h"
#include "c55_heart_model.h"
#include "c56_heart_model.h"
#include "c57_heart_model.h"
#include "c58_heart_model.h"
#include "c59_heart_model.h"
#include "c60_heart_model.h"
#include "c61_heart_model.h"
#include "c62_heart_model.h"
#include "c63_heart_model.h"
#include "c64_heart_model.h"
#include "c65_heart_model.h"
#include "c66_heart_model.h"
#include "c67_heart_model.h"
#include "c68_heart_model.h"

/* Type Definitions */

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */
uint32_T _heart_modelMachineNumber_;
real_T _sfTime_;

/* Function Declarations */

/* Function Definitions */
void heart_model_initializer(void)
{
}

void heart_model_terminator(void)
{
}

/* SFunction Glue Code */
unsigned int sf_heart_model_method_dispatcher(SimStruct *simstructPtr, unsigned
  int chartFileNumber, const char* specsCksum, int_T method, void *data)
{
  if (chartFileNumber==3) {
    c3_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==4) {
    c4_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==5) {
    c5_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==6) {
    c6_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==7) {
    c7_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==8) {
    c8_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==9) {
    c9_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==10) {
    c10_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==11) {
    c11_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==12) {
    c12_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==13) {
    c13_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==14) {
    c14_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==15) {
    c15_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==16) {
    c16_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==17) {
    c17_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==18) {
    c18_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==19) {
    c19_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==20) {
    c20_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==21) {
    c21_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==22) {
    c22_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==23) {
    c23_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==24) {
    c24_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==25) {
    c25_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==26) {
    c26_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==27) {
    c27_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==28) {
    c28_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==29) {
    c29_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==30) {
    c30_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==31) {
    c31_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==32) {
    c32_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==33) {
    c33_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==34) {
    c34_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==35) {
    c35_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==36) {
    c36_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==37) {
    c37_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==38) {
    c38_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==39) {
    c39_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==40) {
    c40_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==41) {
    c41_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==42) {
    c42_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==43) {
    c43_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==44) {
    c44_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==45) {
    c45_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==46) {
    c46_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==47) {
    c47_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==48) {
    c48_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==49) {
    c49_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==50) {
    c50_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==51) {
    c51_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==52) {
    c52_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==53) {
    c53_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==54) {
    c54_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==55) {
    c55_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==56) {
    c56_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==57) {
    c57_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==58) {
    c58_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==59) {
    c59_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==60) {
    c60_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==61) {
    c61_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==62) {
    c62_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==63) {
    c63_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==64) {
    c64_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==65) {
    c65_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==66) {
    c66_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==67) {
    c67_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  if (chartFileNumber==68) {
    c68_heart_model_method_dispatcher(simstructPtr, method, data);
    return 1;
  }

  return 0;
}

unsigned int sf_heart_model_process_check_sum_call( int nlhs, mxArray * plhs[],
  int nrhs, const mxArray * prhs[] )
{

#ifdef MATLAB_MEX_FILE

  char commandName[20];
  if (nrhs<1 || !mxIsChar(prhs[0]) )
    return 0;

  /* Possible call to get the checksum */
  mxGetString(prhs[0], commandName,sizeof(commandName)/sizeof(char));
  commandName[(sizeof(commandName)/sizeof(char)-1)] = '\0';
  if (strcmp(commandName,"sf_get_check_sum"))
    return 0;
  plhs[0] = mxCreateDoubleMatrix( 1,4,mxREAL);
  if (nrhs>1 && mxIsChar(prhs[1])) {
    mxGetString(prhs[1], commandName,sizeof(commandName)/sizeof(char));
    commandName[(sizeof(commandName)/sizeof(char)-1)] = '\0';
    if (!strcmp(commandName,"machine")) {
      ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(3546918251U);
      ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(2858149001U);
      ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(1713710922U);
      ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(3023440120U);
    } else if (!strcmp(commandName,"exportedFcn")) {
      ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(0U);
      ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(0U);
      ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(0U);
      ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(0U);
    } else if (!strcmp(commandName,"makefile")) {
      ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(3023506541U);
      ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(405162713U);
      ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(1937609785U);
      ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(487289185U);
    } else if (nrhs==3 && !strcmp(commandName,"chart")) {
      unsigned int chartFileNumber;
      chartFileNumber = (unsigned int)mxGetScalar(prhs[2]);
      switch (chartFileNumber) {
       case 3:
        {
          extern void sf_c3_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c3_heart_model_get_check_sum(plhs);
          break;
        }

       case 4:
        {
          extern void sf_c4_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c4_heart_model_get_check_sum(plhs);
          break;
        }

       case 5:
        {
          extern void sf_c5_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c5_heart_model_get_check_sum(plhs);
          break;
        }

       case 6:
        {
          extern void sf_c6_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c6_heart_model_get_check_sum(plhs);
          break;
        }

       case 7:
        {
          extern void sf_c7_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c7_heart_model_get_check_sum(plhs);
          break;
        }

       case 8:
        {
          extern void sf_c8_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c8_heart_model_get_check_sum(plhs);
          break;
        }

       case 9:
        {
          extern void sf_c9_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c9_heart_model_get_check_sum(plhs);
          break;
        }

       case 10:
        {
          extern void sf_c10_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c10_heart_model_get_check_sum(plhs);
          break;
        }

       case 11:
        {
          extern void sf_c11_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c11_heart_model_get_check_sum(plhs);
          break;
        }

       case 12:
        {
          extern void sf_c12_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c12_heart_model_get_check_sum(plhs);
          break;
        }

       case 13:
        {
          extern void sf_c13_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c13_heart_model_get_check_sum(plhs);
          break;
        }

       case 14:
        {
          extern void sf_c14_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c14_heart_model_get_check_sum(plhs);
          break;
        }

       case 15:
        {
          extern void sf_c15_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c15_heart_model_get_check_sum(plhs);
          break;
        }

       case 16:
        {
          extern void sf_c16_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c16_heart_model_get_check_sum(plhs);
          break;
        }

       case 17:
        {
          extern void sf_c17_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c17_heart_model_get_check_sum(plhs);
          break;
        }

       case 18:
        {
          extern void sf_c18_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c18_heart_model_get_check_sum(plhs);
          break;
        }

       case 19:
        {
          extern void sf_c19_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c19_heart_model_get_check_sum(plhs);
          break;
        }

       case 20:
        {
          extern void sf_c20_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c20_heart_model_get_check_sum(plhs);
          break;
        }

       case 21:
        {
          extern void sf_c21_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c21_heart_model_get_check_sum(plhs);
          break;
        }

       case 22:
        {
          extern void sf_c22_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c22_heart_model_get_check_sum(plhs);
          break;
        }

       case 23:
        {
          extern void sf_c23_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c23_heart_model_get_check_sum(plhs);
          break;
        }

       case 24:
        {
          extern void sf_c24_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c24_heart_model_get_check_sum(plhs);
          break;
        }

       case 25:
        {
          extern void sf_c25_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c25_heart_model_get_check_sum(plhs);
          break;
        }

       case 26:
        {
          extern void sf_c26_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c26_heart_model_get_check_sum(plhs);
          break;
        }

       case 27:
        {
          extern void sf_c27_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c27_heart_model_get_check_sum(plhs);
          break;
        }

       case 28:
        {
          extern void sf_c28_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c28_heart_model_get_check_sum(plhs);
          break;
        }

       case 29:
        {
          extern void sf_c29_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c29_heart_model_get_check_sum(plhs);
          break;
        }

       case 30:
        {
          extern void sf_c30_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c30_heart_model_get_check_sum(plhs);
          break;
        }

       case 31:
        {
          extern void sf_c31_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c31_heart_model_get_check_sum(plhs);
          break;
        }

       case 32:
        {
          extern void sf_c32_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c32_heart_model_get_check_sum(plhs);
          break;
        }

       case 33:
        {
          extern void sf_c33_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c33_heart_model_get_check_sum(plhs);
          break;
        }

       case 34:
        {
          extern void sf_c34_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c34_heart_model_get_check_sum(plhs);
          break;
        }

       case 35:
        {
          extern void sf_c35_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c35_heart_model_get_check_sum(plhs);
          break;
        }

       case 36:
        {
          extern void sf_c36_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c36_heart_model_get_check_sum(plhs);
          break;
        }

       case 37:
        {
          extern void sf_c37_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c37_heart_model_get_check_sum(plhs);
          break;
        }

       case 38:
        {
          extern void sf_c38_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c38_heart_model_get_check_sum(plhs);
          break;
        }

       case 39:
        {
          extern void sf_c39_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c39_heart_model_get_check_sum(plhs);
          break;
        }

       case 40:
        {
          extern void sf_c40_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c40_heart_model_get_check_sum(plhs);
          break;
        }

       case 41:
        {
          extern void sf_c41_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c41_heart_model_get_check_sum(plhs);
          break;
        }

       case 42:
        {
          extern void sf_c42_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c42_heart_model_get_check_sum(plhs);
          break;
        }

       case 43:
        {
          extern void sf_c43_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c43_heart_model_get_check_sum(plhs);
          break;
        }

       case 44:
        {
          extern void sf_c44_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c44_heart_model_get_check_sum(plhs);
          break;
        }

       case 45:
        {
          extern void sf_c45_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c45_heart_model_get_check_sum(plhs);
          break;
        }

       case 46:
        {
          extern void sf_c46_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c46_heart_model_get_check_sum(plhs);
          break;
        }

       case 47:
        {
          extern void sf_c47_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c47_heart_model_get_check_sum(plhs);
          break;
        }

       case 48:
        {
          extern void sf_c48_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c48_heart_model_get_check_sum(plhs);
          break;
        }

       case 49:
        {
          extern void sf_c49_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c49_heart_model_get_check_sum(plhs);
          break;
        }

       case 50:
        {
          extern void sf_c50_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c50_heart_model_get_check_sum(plhs);
          break;
        }

       case 51:
        {
          extern void sf_c51_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c51_heart_model_get_check_sum(plhs);
          break;
        }

       case 52:
        {
          extern void sf_c52_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c52_heart_model_get_check_sum(plhs);
          break;
        }

       case 53:
        {
          extern void sf_c53_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c53_heart_model_get_check_sum(plhs);
          break;
        }

       case 54:
        {
          extern void sf_c54_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c54_heart_model_get_check_sum(plhs);
          break;
        }

       case 55:
        {
          extern void sf_c55_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c55_heart_model_get_check_sum(plhs);
          break;
        }

       case 56:
        {
          extern void sf_c56_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c56_heart_model_get_check_sum(plhs);
          break;
        }

       case 57:
        {
          extern void sf_c57_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c57_heart_model_get_check_sum(plhs);
          break;
        }

       case 58:
        {
          extern void sf_c58_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c58_heart_model_get_check_sum(plhs);
          break;
        }

       case 59:
        {
          extern void sf_c59_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c59_heart_model_get_check_sum(plhs);
          break;
        }

       case 60:
        {
          extern void sf_c60_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c60_heart_model_get_check_sum(plhs);
          break;
        }

       case 61:
        {
          extern void sf_c61_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c61_heart_model_get_check_sum(plhs);
          break;
        }

       case 62:
        {
          extern void sf_c62_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c62_heart_model_get_check_sum(plhs);
          break;
        }

       case 63:
        {
          extern void sf_c63_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c63_heart_model_get_check_sum(plhs);
          break;
        }

       case 64:
        {
          extern void sf_c64_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c64_heart_model_get_check_sum(plhs);
          break;
        }

       case 65:
        {
          extern void sf_c65_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c65_heart_model_get_check_sum(plhs);
          break;
        }

       case 66:
        {
          extern void sf_c66_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c66_heart_model_get_check_sum(plhs);
          break;
        }

       case 67:
        {
          extern void sf_c67_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c67_heart_model_get_check_sum(plhs);
          break;
        }

       case 68:
        {
          extern void sf_c68_heart_model_get_check_sum(mxArray *plhs[]);
          sf_c68_heart_model_get_check_sum(plhs);
          break;
        }

       default:
        ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(0.0);
        ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(0.0);
        ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(0.0);
        ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(0.0);
      }
    } else if (!strcmp(commandName,"target")) {
      ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(1764838350U);
      ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(3410240878U);
      ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(118138738U);
      ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(243351119U);
    } else {
      return 0;
    }
  } else {
    ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(4151234822U);
    ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(2310846028U);
    ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(3236374146U);
    ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(1683089676U);
  }

  return 1;

#else

  return 0;

#endif

}

unsigned int sf_heart_model_autoinheritance_info( int nlhs, mxArray * plhs[],
  int nrhs, const mxArray * prhs[] )
{

#ifdef MATLAB_MEX_FILE

  char commandName[32];
  char aiChksum[64];
  if (nrhs<3 || !mxIsChar(prhs[0]) )
    return 0;

  /* Possible call to get the autoinheritance_info */
  mxGetString(prhs[0], commandName,sizeof(commandName)/sizeof(char));
  commandName[(sizeof(commandName)/sizeof(char)-1)] = '\0';
  if (strcmp(commandName,"get_autoinheritance_info"))
    return 0;
  mxGetString(prhs[2], aiChksum,sizeof(aiChksum)/sizeof(char));
  aiChksum[(sizeof(aiChksum)/sizeof(char)-1)] = '\0';

  {
    unsigned int chartFileNumber;
    chartFileNumber = (unsigned int)mxGetScalar(prhs[1]);
    switch (chartFileNumber) {
     case 3:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c3_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c3_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 4:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c4_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c4_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 5:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c5_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c5_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 6:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c6_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c6_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 7:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c7_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c7_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 8:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c8_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c8_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 9:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c9_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c9_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 10:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c10_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c10_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 11:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c11_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c11_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 12:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c12_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c12_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 13:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c13_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c13_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 14:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c14_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c14_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 15:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c15_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c15_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 16:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c16_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c16_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 17:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c17_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c17_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 18:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c18_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c18_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 19:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c19_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c19_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 20:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c20_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c20_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 21:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c21_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c21_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 22:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c22_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c22_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 23:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c23_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c23_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 24:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c24_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c24_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 25:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c25_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c25_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 26:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c26_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c26_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 27:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c27_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c27_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 28:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c28_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c28_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 29:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c29_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c29_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 30:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c30_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c30_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 31:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c31_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c31_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 32:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c32_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c32_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 33:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c33_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c33_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 34:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c34_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c34_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 35:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c35_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c35_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 36:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c36_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c36_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 37:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c37_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c37_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 38:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c38_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c38_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 39:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c39_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c39_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 40:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c40_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c40_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 41:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c41_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c41_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 42:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c42_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c42_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 43:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c43_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c43_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 44:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c44_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c44_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 45:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c45_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c45_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 46:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c46_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c46_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 47:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c47_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c47_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 48:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c48_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c48_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 49:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c49_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c49_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 50:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c50_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c50_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 51:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c51_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c51_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 52:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c52_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c52_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 53:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c53_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c53_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 54:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c54_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c54_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 55:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c55_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c55_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 56:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c56_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c56_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 57:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c57_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c57_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 58:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c58_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c58_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 59:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c59_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c59_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 60:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c60_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c60_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 61:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c61_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c61_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 62:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c62_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c62_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 63:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c63_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c63_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 64:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c64_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c64_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 65:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c65_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c65_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 66:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c66_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c66_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 67:
      {
        if (strcmp(aiChksum, "g4VGvhM6c2Wbd2wlTELlRD") == 0) {
          extern mxArray *sf_c67_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c67_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     case 68:
      {
        if (strcmp(aiChksum, "CXxzStyR2vNHDGvRqLjuwG") == 0) {
          extern mxArray *sf_c68_heart_model_get_autoinheritance_info(void);
          plhs[0] = sf_c68_heart_model_get_autoinheritance_info();
          break;
        }

        plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
        break;
      }

     default:
      plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
    }
  }

  return 1;

#else

  return 0;

#endif

}

unsigned int sf_heart_model_get_eml_resolved_functions_info( int nlhs, mxArray *
  plhs[], int nrhs, const mxArray * prhs[] )
{

#ifdef MATLAB_MEX_FILE

  char commandName[64];
  if (nrhs<2 || !mxIsChar(prhs[0]))
    return 0;

  /* Possible call to get the get_eml_resolved_functions_info */
  mxGetString(prhs[0], commandName,sizeof(commandName)/sizeof(char));
  commandName[(sizeof(commandName)/sizeof(char)-1)] = '\0';
  if (strcmp(commandName,"get_eml_resolved_functions_info"))
    return 0;

  {
    unsigned int chartFileNumber;
    chartFileNumber = (unsigned int)mxGetScalar(prhs[1]);
    switch (chartFileNumber) {
     case 3:
      {
        extern const mxArray *sf_c3_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c3_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 4:
      {
        extern const mxArray *sf_c4_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c4_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 5:
      {
        extern const mxArray *sf_c5_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c5_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 6:
      {
        extern const mxArray *sf_c6_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c6_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 7:
      {
        extern const mxArray *sf_c7_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c7_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 8:
      {
        extern const mxArray *sf_c8_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c8_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 9:
      {
        extern const mxArray *sf_c9_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c9_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 10:
      {
        extern const mxArray *sf_c10_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c10_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 11:
      {
        extern const mxArray *sf_c11_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c11_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 12:
      {
        extern const mxArray *sf_c12_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c12_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 13:
      {
        extern const mxArray *sf_c13_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c13_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 14:
      {
        extern const mxArray *sf_c14_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c14_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 15:
      {
        extern const mxArray *sf_c15_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c15_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 16:
      {
        extern const mxArray *sf_c16_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c16_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 17:
      {
        extern const mxArray *sf_c17_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c17_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 18:
      {
        extern const mxArray *sf_c18_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c18_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 19:
      {
        extern const mxArray *sf_c19_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c19_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 20:
      {
        extern const mxArray *sf_c20_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c20_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 21:
      {
        extern const mxArray *sf_c21_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c21_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 22:
      {
        extern const mxArray *sf_c22_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c22_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 23:
      {
        extern const mxArray *sf_c23_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c23_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 24:
      {
        extern const mxArray *sf_c24_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c24_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 25:
      {
        extern const mxArray *sf_c25_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c25_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 26:
      {
        extern const mxArray *sf_c26_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c26_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 27:
      {
        extern const mxArray *sf_c27_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c27_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 28:
      {
        extern const mxArray *sf_c28_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c28_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 29:
      {
        extern const mxArray *sf_c29_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c29_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 30:
      {
        extern const mxArray *sf_c30_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c30_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 31:
      {
        extern const mxArray *sf_c31_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c31_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 32:
      {
        extern const mxArray *sf_c32_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c32_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 33:
      {
        extern const mxArray *sf_c33_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c33_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 34:
      {
        extern const mxArray *sf_c34_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c34_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 35:
      {
        extern const mxArray *sf_c35_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c35_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 36:
      {
        extern const mxArray *sf_c36_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c36_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 37:
      {
        extern const mxArray *sf_c37_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c37_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 38:
      {
        extern const mxArray *sf_c38_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c38_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 39:
      {
        extern const mxArray *sf_c39_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c39_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 40:
      {
        extern const mxArray *sf_c40_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c40_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 41:
      {
        extern const mxArray *sf_c41_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c41_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 42:
      {
        extern const mxArray *sf_c42_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c42_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 43:
      {
        extern const mxArray *sf_c43_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c43_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 44:
      {
        extern const mxArray *sf_c44_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c44_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 45:
      {
        extern const mxArray *sf_c45_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c45_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 46:
      {
        extern const mxArray *sf_c46_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c46_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 47:
      {
        extern const mxArray *sf_c47_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c47_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 48:
      {
        extern const mxArray *sf_c48_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c48_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 49:
      {
        extern const mxArray *sf_c49_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c49_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 50:
      {
        extern const mxArray *sf_c50_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c50_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 51:
      {
        extern const mxArray *sf_c51_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c51_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 52:
      {
        extern const mxArray *sf_c52_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c52_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 53:
      {
        extern const mxArray *sf_c53_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c53_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 54:
      {
        extern const mxArray *sf_c54_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c54_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 55:
      {
        extern const mxArray *sf_c55_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c55_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 56:
      {
        extern const mxArray *sf_c56_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c56_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 57:
      {
        extern const mxArray *sf_c57_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c57_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 58:
      {
        extern const mxArray *sf_c58_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c58_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 59:
      {
        extern const mxArray *sf_c59_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c59_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 60:
      {
        extern const mxArray *sf_c60_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c60_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 61:
      {
        extern const mxArray *sf_c61_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c61_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 62:
      {
        extern const mxArray *sf_c62_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c62_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 63:
      {
        extern const mxArray *sf_c63_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c63_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 64:
      {
        extern const mxArray *sf_c64_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c64_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 65:
      {
        extern const mxArray *sf_c65_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c65_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 66:
      {
        extern const mxArray *sf_c66_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c66_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 67:
      {
        extern const mxArray *sf_c67_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c67_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     case 68:
      {
        extern const mxArray *sf_c68_heart_model_get_eml_resolved_functions_info
          (void);
        mxArray *persistentMxArray = (mxArray *)
          sf_c68_heart_model_get_eml_resolved_functions_info();
        plhs[0] = mxDuplicateArray(persistentMxArray);
        mxDestroyArray(persistentMxArray);
        break;
      }

     default:
      plhs[0] = mxCreateDoubleMatrix(0,0,mxREAL);
    }
  }

  return 1;

#else

  return 0;

#endif

}

void heart_model_debug_initialize(void)
{
  _heart_modelMachineNumber_ = sf_debug_initialize_machine("heart_model","sfun",
    0,66,0,0,0);
  sf_debug_set_machine_event_thresholds(_heart_modelMachineNumber_,0,0);
  sf_debug_set_machine_data_thresholds(_heart_modelMachineNumber_,0);
}

void heart_model_register_exported_symbols(SimStruct* S)
{
}

static mxArray* sRtwOptimizationInfoStruct= NULL;
mxArray* load_heart_model_optimization_info(void)
{
  if (sRtwOptimizationInfoStruct==NULL) {
    sRtwOptimizationInfoStruct = sf_load_rtw_optimization_info("heart_model",
      "heart_model");
    mexMakeArrayPersistent(sRtwOptimizationInfoStruct);
  }

  return(sRtwOptimizationInfoStruct);
}

void unload_heart_model_optimization_info(void)
{
  if (sRtwOptimizationInfoStruct!=NULL) {
    mxDestroyArray(sRtwOptimizationInfoStruct);
    sRtwOptimizationInfoStruct = NULL;
  }
}
