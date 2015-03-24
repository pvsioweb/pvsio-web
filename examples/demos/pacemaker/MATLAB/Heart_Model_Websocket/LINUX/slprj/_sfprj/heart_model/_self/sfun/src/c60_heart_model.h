#ifndef __c60_heart_model_h__
#define __c60_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c60_resetEventCounter;
  int32_T c60_sfEvent;
  uint8_T c60_tp_resting;
  uint8_T c60_tp_stimulated;
  uint8_T c60_tp_plateau;
  uint8_T c60_tp_upstroke;
  boolean_T c60_isStable;
  uint8_T c60_is_active_c60_heart_model;
  uint8_T c60_is_c60_heart_model;
  real_T c60_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c60_doSetSimStateSideEffects;
  const mxArray *c60_setSimStateSideEffectsInfo;
} SFc60_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c60_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c60_heart_model_get_check_sum(mxArray *plhs[]);
extern void c60_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
