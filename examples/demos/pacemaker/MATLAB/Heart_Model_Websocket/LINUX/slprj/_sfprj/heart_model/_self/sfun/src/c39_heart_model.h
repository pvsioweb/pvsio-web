#ifndef __c39_heart_model_h__
#define __c39_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c39_event1EventCounter;
  uint32_T c39_event2EventCounter;
  uint32_T c39_event3EventCounter;
  int32_T c39_sfEvent;
  uint8_T c39_tp_state;
  boolean_T c39_isStable;
  uint8_T c39_is_active_c39_heart_model;
  uint8_T c39_is_c39_heart_model;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c39_doSetSimStateSideEffects;
  const mxArray *c39_setSimStateSideEffectsInfo;
} SFc39_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c39_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c39_heart_model_get_check_sum(mxArray *plhs[]);
extern void c39_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
