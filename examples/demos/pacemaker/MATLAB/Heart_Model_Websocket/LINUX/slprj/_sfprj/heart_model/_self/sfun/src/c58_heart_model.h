#ifndef __c58_heart_model_h__
#define __c58_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c58_resetEventCounter;
  int32_T c58_sfEvent;
  uint8_T c58_tp_resting;
  uint8_T c58_tp_stimulated;
  uint8_T c58_tp_plateau;
  uint8_T c58_tp_upstroke;
  boolean_T c58_isStable;
  uint8_T c58_is_active_c58_heart_model;
  uint8_T c58_is_c58_heart_model;
  real_T c58_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c58_doSetSimStateSideEffects;
  const mxArray *c58_setSimStateSideEffectsInfo;
} SFc58_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c58_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c58_heart_model_get_check_sum(mxArray *plhs[]);
extern void c58_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
