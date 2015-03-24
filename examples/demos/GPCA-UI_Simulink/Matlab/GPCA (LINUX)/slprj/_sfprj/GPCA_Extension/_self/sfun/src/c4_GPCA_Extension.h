#ifndef __c4_GPCA_Extension_h__
#define __c4_GPCA_Extension_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  int32_T c4_sfEvent;
  boolean_T c4_isStable;
  boolean_T c4_doneDoubleBufferReInit;
  uint8_T c4_is_active_c4_GPCA_Extension;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
} SFc4_GPCA_ExtensionInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c4_GPCA_Extension_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c4_GPCA_Extension_get_check_sum(mxArray *plhs[]);
extern void c4_GPCA_Extension_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
