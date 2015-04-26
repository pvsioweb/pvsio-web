#ifndef __c2_GPCA_Extension_h__
#define __c2_GPCA_Extension_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  int32_T c2_sfEvent;
  uint8_T c2_tp_st0;
  boolean_T c2_isStable;
  uint8_T c2_is_active_c2_GPCA_Extension;
  uint8_T c2_is_c2_GPCA_Extension;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c2_doSetSimStateSideEffects;
  const mxArray *c2_setSimStateSideEffectsInfo;
} SFc2_GPCA_ExtensionInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c2_GPCA_Extension_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c2_GPCA_Extension_get_check_sum(mxArray *plhs[]);
extern void c2_GPCA_Extension_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
