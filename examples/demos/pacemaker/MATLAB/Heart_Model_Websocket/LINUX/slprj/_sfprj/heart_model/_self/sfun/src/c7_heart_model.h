#ifndef __c7_heart_model_h__
#define __c7_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c7_event1EventCounter;
  uint32_T c7_event2EventCounter;
  uint32_T c7_event3EventCounter;
  int32_T c7_sfEvent;
  uint8_T c7_tp_state;
  boolean_T c7_isStable;
  uint8_T c7_is_active_c7_heart_model;
  uint8_T c7_is_c7_heart_model;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c7_doSetSimStateSideEffects;
  const mxArray *c7_setSimStateSideEffectsInfo;
} SFc7_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c7_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c7_heart_model_get_check_sum(mxArray *plhs[]);
extern void c7_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
