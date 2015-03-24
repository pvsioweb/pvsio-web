#ifndef __c8_experiment1_model_new_h__
#define __c8_experiment1_model_new_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c8_resetEventCounter;
  int32_T c8_sfEvent;
  uint8_T c8_tp_resting;
  uint8_T c8_tp_stimulated;
  uint8_T c8_tp_plateau;
  uint8_T c8_tp_upstroke;
  boolean_T c8_isStable;
  uint8_T c8_is_active_c8_experiment1_model_new;
  uint8_T c8_is_c8_experiment1_model_new;
  real_T c8_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c8_doSetSimStateSideEffects;
  const mxArray *c8_setSimStateSideEffectsInfo;
} SFc8_experiment1_model_newInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray
  *sf_c8_experiment1_model_new_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c8_experiment1_model_new_get_check_sum(mxArray *plhs[]);
extern void c8_experiment1_model_new_method_dispatcher(SimStruct *S, int_T
  method, void *data);

#endif
