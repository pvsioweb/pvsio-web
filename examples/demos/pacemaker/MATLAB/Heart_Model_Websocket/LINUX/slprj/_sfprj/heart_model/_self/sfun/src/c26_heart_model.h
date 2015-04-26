#ifndef __c26_heart_model_h__
#define __c26_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c26_resetEventCounter;
  int32_T c26_sfEvent;
  uint8_T c26_tp_resting;
  uint8_T c26_tp_stimulated;
  uint8_T c26_tp_plateau;
  uint8_T c26_tp_upstroke;
  boolean_T c26_isStable;
  uint8_T c26_is_active_c26_heart_model;
  uint8_T c26_is_c26_heart_model;
  real_T c26_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c26_doSetSimStateSideEffects;
  const mxArray *c26_setSimStateSideEffectsInfo;
} SFc26_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c26_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c26_heart_model_get_check_sum(mxArray *plhs[]);
extern void c26_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
