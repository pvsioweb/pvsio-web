#ifndef __c4_experiment1_model_new_h__
#define __c4_experiment1_model_new_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c4_resetEventCounter;
  int32_T c4_sfEvent;
  uint8_T c4_tp_resting;
  uint8_T c4_tp_stimulated;
  uint8_T c4_tp_plateau;
  uint8_T c4_tp_upstroke;
  boolean_T c4_isStable;
  uint8_T c4_is_active_c4_experiment1_model_new;
  uint8_T c4_is_c4_experiment1_model_new;
  real_T c4_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c4_doSetSimStateSideEffects;
  const mxArray *c4_setSimStateSideEffectsInfo;
} SFc4_experiment1_model_newInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray
  *sf_c4_experiment1_model_new_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c4_experiment1_model_new_get_check_sum(mxArray *plhs[]);
extern void c4_experiment1_model_new_method_dispatcher(SimStruct *S, int_T
  method, void *data);

#endif
