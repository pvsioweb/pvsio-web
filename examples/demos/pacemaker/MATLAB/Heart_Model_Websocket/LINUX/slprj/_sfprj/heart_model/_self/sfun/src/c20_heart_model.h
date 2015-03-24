#ifndef __c20_heart_model_h__
#define __c20_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c20_resetEventCounter;
  int32_T c20_sfEvent;
  uint8_T c20_tp_resting;
  uint8_T c20_tp_stimulated;
  uint8_T c20_tp_plateau;
  uint8_T c20_tp_upstroke;
  boolean_T c20_isStable;
  uint8_T c20_is_active_c20_heart_model;
  uint8_T c20_is_c20_heart_model;
  real_T c20_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c20_doSetSimStateSideEffects;
  const mxArray *c20_setSimStateSideEffectsInfo;
} SFc20_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c20_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c20_heart_model_get_check_sum(mxArray *plhs[]);
extern void c20_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
