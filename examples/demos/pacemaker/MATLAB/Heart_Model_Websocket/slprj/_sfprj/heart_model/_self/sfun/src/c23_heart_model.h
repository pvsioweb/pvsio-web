#ifndef __c23_heart_model_h__
#define __c23_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c23_event1EventCounter;
  uint32_T c23_event2EventCounter;
  uint32_T c23_event3EventCounter;
  int32_T c23_sfEvent;
  uint8_T c23_tp_state;
  boolean_T c23_isStable;
  uint8_T c23_is_active_c23_heart_model;
  uint8_T c23_is_c23_heart_model;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c23_doSetSimStateSideEffects;
  const mxArray *c23_setSimStateSideEffectsInfo;
} SFc23_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c23_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c23_heart_model_get_check_sum(mxArray *plhs[]);
extern void c23_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
