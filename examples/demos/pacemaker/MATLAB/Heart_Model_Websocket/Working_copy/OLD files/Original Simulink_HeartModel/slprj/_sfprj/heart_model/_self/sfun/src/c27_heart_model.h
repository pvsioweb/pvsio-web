#ifndef __c27_heart_model_h__
#define __c27_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c27_event1EventCounter;
  uint32_T c27_event2EventCounter;
  uint32_T c27_event3EventCounter;
  int32_T c27_sfEvent;
  uint8_T c27_tp_state;
  boolean_T c27_isStable;
  uint8_T c27_is_active_c27_heart_model;
  uint8_T c27_is_c27_heart_model;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c27_doSetSimStateSideEffects;
  const mxArray *c27_setSimStateSideEffectsInfo;
} SFc27_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c27_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c27_heart_model_get_check_sum(mxArray *plhs[]);
extern void c27_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
