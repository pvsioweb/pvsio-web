#ifndef __c19_experiment1_model_new_h__
#define __c19_experiment1_model_new_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c19_event1EventCounter;
  uint32_T c19_event2EventCounter;
  uint32_T c19_event3EventCounter;
  int32_T c19_sfEvent;
  uint8_T c19_tp_state;
  boolean_T c19_isStable;
  uint8_T c19_is_active_c19_experiment1_model_new;
  uint8_T c19_is_c19_experiment1_model_new;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c19_doSetSimStateSideEffects;
  const mxArray *c19_setSimStateSideEffectsInfo;
} SFc19_experiment1_model_newInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray
  *sf_c19_experiment1_model_new_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c19_experiment1_model_new_get_check_sum(mxArray *plhs[]);
extern void c19_experiment1_model_new_method_dispatcher(SimStruct *S, int_T
  method, void *data);

#endif
