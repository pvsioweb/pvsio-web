#ifndef __c44_heart_model_h__
#define __c44_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c44_resetEventCounter;
  int32_T c44_sfEvent;
  uint8_T c44_tp_resting;
  uint8_T c44_tp_stimulated;
  uint8_T c44_tp_plateau;
  uint8_T c44_tp_upstroke;
  boolean_T c44_isStable;
  uint8_T c44_is_active_c44_heart_model;
  uint8_T c44_is_c44_heart_model;
  real_T c44_vn;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c44_doSetSimStateSideEffects;
  const mxArray *c44_setSimStateSideEffectsInfo;
} SFc44_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c44_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c44_heart_model_get_check_sum(mxArray *plhs[]);
extern void c44_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
