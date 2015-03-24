#ifndef __c61_experiment1_model_new_h__
#define __c61_experiment1_model_new_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c61_event1EventCounter;
  uint32_T c61_event2EventCounter;
  uint32_T c61_event3EventCounter;
  int32_T c61_sfEvent;
  uint8_T c61_tp_state;
  boolean_T c61_isStable;
  uint8_T c61_is_active_c61_experiment1_model_new;
  uint8_T c61_is_c61_experiment1_model_new;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c61_doSetSimStateSideEffects;
  const mxArray *c61_setSimStateSideEffectsInfo;
} SFc61_experiment1_model_newInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray
  *sf_c61_experiment1_model_new_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c61_experiment1_model_new_get_check_sum(mxArray *plhs[]);
extern void c61_experiment1_model_new_method_dispatcher(SimStruct *S, int_T
  method, void *data);

#endif
