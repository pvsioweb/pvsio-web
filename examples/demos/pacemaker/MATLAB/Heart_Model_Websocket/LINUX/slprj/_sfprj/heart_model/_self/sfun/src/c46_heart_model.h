#ifndef __c46_heart_model_h__
#define __c46_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c46_resetEventCounter;
  int32_T c46_sfEvent;
  uint8_T c46_tp_resting;
  uint8_T c46_tp_stimulated;
  uint8_T c46_tp_plateau;
  uint8_T c46_tp_upstroke;
  boolean_T c46_isStable;
  uint8_T c46_is_active_c46_heart_model;
  uint8_T c46_is_c46_heart_model;
  real_T c46_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c46_doSetSimStateSideEffects;
  const mxArray *c46_setSimStateSideEffectsInfo;
} SFc46_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c46_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c46_heart_model_get_check_sum(mxArray *plhs[]);
extern void c46_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
