#ifndef __c43_experiment1_model_new_h__
#define __c43_experiment1_model_new_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c43_event1EventCounter;
  uint32_T c43_event2EventCounter;
  uint32_T c43_event3EventCounter;
  int32_T c43_sfEvent;
  uint8_T c43_tp_state;
  boolean_T c43_isStable;
  uint8_T c43_is_active_c43_experiment1_model_new;
  uint8_T c43_is_c43_experiment1_model_new;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c43_doSetSimStateSideEffects;
  const mxArray *c43_setSimStateSideEffectsInfo;
} SFc43_experiment1_model_newInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray
  *sf_c43_experiment1_model_new_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c43_experiment1_model_new_get_check_sum(mxArray *plhs[]);
extern void c43_experiment1_model_new_method_dispatcher(SimStruct *S, int_T
  method, void *data);

#endif
