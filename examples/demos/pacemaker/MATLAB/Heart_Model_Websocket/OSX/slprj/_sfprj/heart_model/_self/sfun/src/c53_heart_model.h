#ifndef __c53_heart_model_h__
#define __c53_heart_model_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
typedef struct {
  uint32_T c53_event1EventCounter;
  uint32_T c53_event2EventCounter;
  uint32_T c53_event3EventCounter;
  int32_T c53_sfEvent;
  uint8_T c53_tp_state;
  boolean_T c53_isStable;
  uint8_T c53_is_active_c53_heart_model;
  uint8_T c53_is_c53_heart_model;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c53_doSetSimStateSideEffects;
  const mxArray *c53_setSimStateSideEffectsInfo;
} SFc53_heart_modelInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c53_heart_model_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c53_heart_model_get_check_sum(mxArray *plhs[]);
extern void c53_heart_model_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
