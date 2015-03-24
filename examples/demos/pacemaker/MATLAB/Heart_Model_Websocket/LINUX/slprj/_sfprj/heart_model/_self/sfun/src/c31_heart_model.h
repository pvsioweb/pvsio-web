#ifndef __c31_heart_model_h__
#define __c31_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c31_event1EventCounter;
  uint32_T c31_event2EventCounter;
  uint32_T c31_event3EventCounter;
  int32_T c31_sfEvent;
  uint8_T c31_tp_state;
  boolean_T c31_isStable;
  uint8_T c31_is_active_c31_heart_model;
  uint8_T c31_is_c31_heart_model;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c31_doSetSimStateSideEffects;
  const mxArray *c31_setSimStateSideEffectsInfo;
} SFc31_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c31_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c31_heart_model_get_check_sum(mxArray *plhs[]);
extern void c31_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
