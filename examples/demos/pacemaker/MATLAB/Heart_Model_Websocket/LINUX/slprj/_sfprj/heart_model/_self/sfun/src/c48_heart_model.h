#ifndef __c48_heart_model_h__
#define __c48_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c48_resetEventCounter;
  int32_T c48_sfEvent;
  uint8_T c48_tp_resting;
  uint8_T c48_tp_stimulated;
  uint8_T c48_tp_plateau;
  uint8_T c48_tp_upstroke;
  boolean_T c48_isStable;
  uint8_T c48_is_active_c48_heart_model;
  uint8_T c48_is_c48_heart_model;
  real_T c48_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c48_doSetSimStateSideEffects;
  const mxArray *c48_setSimStateSideEffectsInfo;
} SFc48_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c48_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c48_heart_model_get_check_sum(mxArray *plhs[]);
extern void c48_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
