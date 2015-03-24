#ifndef __c32_heart_model_h__
#define __c32_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c32_resetEventCounter;
  int32_T c32_sfEvent;
  uint8_T c32_tp_resting;
  uint8_T c32_tp_stimulated;
  uint8_T c32_tp_plateau;
  uint8_T c32_tp_upstroke;
  boolean_T c32_isStable;
  uint8_T c32_is_active_c32_heart_model;
  uint8_T c32_is_c32_heart_model;
  real_T c32_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c32_doSetSimStateSideEffects;
  const mxArray *c32_setSimStateSideEffectsInfo;
} SFc32_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c32_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c32_heart_model_get_check_sum(mxArray *plhs[]);
extern void c32_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
