#ifndef __c33_heart_model_h__
#define __c33_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c33_event1EventCounter;
  uint32_T c33_event2EventCounter;
  uint32_T c33_event3EventCounter;
  int32_T c33_sfEvent;
  uint8_T c33_tp_state;
  boolean_T c33_isStable;
  uint8_T c33_is_active_c33_heart_model;
  uint8_T c33_is_c33_heart_model;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c33_doSetSimStateSideEffects;
  const mxArray *c33_setSimStateSideEffectsInfo;
} SFc33_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c33_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c33_heart_model_get_check_sum(mxArray *plhs[]);
extern void c33_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
