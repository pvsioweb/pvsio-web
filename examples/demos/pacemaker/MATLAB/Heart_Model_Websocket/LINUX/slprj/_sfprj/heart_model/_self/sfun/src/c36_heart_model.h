#ifndef __c36_heart_model_h__
#define __c36_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c36_resetEventCounter;
  int32_T c36_sfEvent;
  uint8_T c36_tp_resting;
  uint8_T c36_tp_stimulated;
  uint8_T c36_tp_plateau;
  uint8_T c36_tp_upstroke;
  boolean_T c36_isStable;
  uint8_T c36_is_active_c36_heart_model;
  uint8_T c36_is_c36_heart_model;
  real_T c36_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c36_doSetSimStateSideEffects;
  const mxArray *c36_setSimStateSideEffectsInfo;
} SFc36_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c36_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c36_heart_model_get_check_sum(mxArray *plhs[]);
extern void c36_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
