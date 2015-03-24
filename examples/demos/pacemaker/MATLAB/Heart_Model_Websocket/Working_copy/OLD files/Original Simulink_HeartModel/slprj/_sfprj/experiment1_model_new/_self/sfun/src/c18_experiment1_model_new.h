#ifndef __c18_experiment1_model_new_h__
#define __c18_experiment1_model_new_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c18_resetEventCounter;
  int32_T c18_sfEvent;
  uint8_T c18_tp_resting;
  uint8_T c18_tp_stimulated;
  uint8_T c18_tp_plateau;
  uint8_T c18_tp_upstroke;
  boolean_T c18_isStable;
  uint8_T c18_is_active_c18_experiment1_model_new;
  uint8_T c18_is_c18_experiment1_model_new;
  real_T c18_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c18_doSetSimStateSideEffects;
  const mxArray *c18_setSimStateSideEffectsInfo;
} SFc18_experiment1_model_newInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray
  *sf_c18_experiment1_model_new_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c18_experiment1_model_new_get_check_sum(mxArray *plhs[]);
extern void c18_experiment1_model_new_method_dispatcher(SimStruct *S, int_T
  method, void *data);

#endif
