/* Include files */

#include "blascompat32.h"
#include "heart_model_sfun.h"
#include "c33_heart_model.h"
#define CHARTINSTANCE_CHARTNUMBER      (chartInstance->chartNumber)
#define CHARTINSTANCE_INSTANCENUMBER   (chartInstance->instanceNumber)
#include "heart_model_sfun_debug_macros.h"

/* Type Definitions */

/* Named Constants */
#define CALL_EVENT                     (-1)
#define c33_IN_NO_ACTIVE_CHILD         ((uint8_T)0U)
#define c33_IN_state                   ((uint8_T)1U)

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
static void initialize_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance);
static void initialize_params_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance);
static void enable_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance);
static void disable_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance);
static void c33_update_debugger_state_c33_heart_model
  (SFc33_heart_modelInstanceStruct *chartInstance);
static const mxArray *get_sim_state_c33_heart_model
  (SFc33_heart_modelInstanceStruct *chartInstance);
static void set_sim_state_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_st);
static void c33_set_sim_state_side_effects_c33_heart_model
  (SFc33_heart_modelInstanceStruct *chartInstance);
static void finalize_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance);
static void sf_c33_heart_model(SFc33_heart_modelInstanceStruct *chartInstance);
static void initSimStructsc33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance);
static void init_script_number_translation(uint32_T c33_machineNumber, uint32_T
  c33_chartNumber);
static const mxArray *c33_sf_marshallOut(void *chartInstanceVoid, void
  *c33_inData);
static uint32_T c33_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_b_event1EventCounter, const char_T
  *c33_identifier);
static uint32_T c33_b_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId);
static void c33_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c33_mxArrayInData, const char_T *c33_varName, void *c33_outData);
static const mxArray *c33_b_sf_marshallOut(void *chartInstanceVoid, void
  *c33_inData);
static int32_T c33_c_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId);
static void c33_b_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c33_mxArrayInData, const char_T *c33_varName, void *c33_outData);
static const mxArray *c33_c_sf_marshallOut(void *chartInstanceVoid, void
  *c33_inData);
static uint8_T c33_d_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_b_tp_state, const char_T *c33_identifier);
static uint8_T c33_e_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId);
static void c33_c_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c33_mxArrayInData, const char_T *c33_varName, void *c33_outData);
static const mxArray *c33_d_sf_marshallOut(void *chartInstanceVoid, void
  *c33_inData);
static boolean_T c33_f_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_event1, const char_T *c33_identifier);
static boolean_T c33_g_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId);
static const mxArray *c33_h_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_b_setSimStateSideEffectsInfo, const char_T *
  c33_identifier);
static const mxArray *c33_i_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId);
static void init_dsm_address_info(SFc33_heart_modelInstanceStruct *chartInstance);

/* Function Definitions */
static void initialize_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance)
{
  boolean_T *c33_event1;
  boolean_T *c33_event2;
  boolean_T *c33_event3;
  c33_event3 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c33_event2 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c33_event1 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  chartInstance->c33_sfEvent = CALL_EVENT;
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
  chartInstance->c33_doSetSimStateSideEffects = 0U;
  chartInstance->c33_setSimStateSideEffectsInfo = NULL;
  chartInstance->c33_tp_state = 0U;
  chartInstance->c33_is_active_c33_heart_model = 0U;
  chartInstance->c33_is_c33_heart_model = 0U;
  chartInstance->c33_event1EventCounter = 0U;
  *c33_event1 = FALSE;
  chartInstance->c33_event2EventCounter = 0U;
  *c33_event2 = FALSE;
  chartInstance->c33_event3EventCounter = 0U;
  *c33_event3 = FALSE;
}

static void initialize_params_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance)
{
}

static void enable_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance)
{
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
}

static void disable_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance)
{
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
}

static void c33_update_debugger_state_c33_heart_model
  (SFc33_heart_modelInstanceStruct *chartInstance)
{
  uint32_T c33_prevAniVal;
  c33_prevAniVal = sf_debug_get_animation();
  sf_debug_set_animation(0U);
  if (chartInstance->c33_is_active_c33_heart_model == 1) {
    _SFD_CC_CALL(CHART_ACTIVE_TAG, 30U, chartInstance->c33_sfEvent);
  }

  if (chartInstance->c33_is_c33_heart_model == c33_IN_state) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
  }

  sf_debug_set_animation(c33_prevAniVal);
  _SFD_ANIMATE();
}

static const mxArray *get_sim_state_c33_heart_model
  (SFc33_heart_modelInstanceStruct *chartInstance)
{
  const mxArray *c33_st;
  const mxArray *c33_y = NULL;
  boolean_T c33_hoistedGlobal;
  boolean_T c33_u;
  const mxArray *c33_b_y = NULL;
  boolean_T c33_b_hoistedGlobal;
  boolean_T c33_b_u;
  const mxArray *c33_c_y = NULL;
  boolean_T c33_c_hoistedGlobal;
  boolean_T c33_c_u;
  const mxArray *c33_d_y = NULL;
  uint32_T c33_d_hoistedGlobal;
  uint32_T c33_d_u;
  const mxArray *c33_e_y = NULL;
  uint32_T c33_e_hoistedGlobal;
  uint32_T c33_e_u;
  const mxArray *c33_f_y = NULL;
  uint32_T c33_f_hoistedGlobal;
  uint32_T c33_f_u;
  const mxArray *c33_g_y = NULL;
  uint8_T c33_g_hoistedGlobal;
  uint8_T c33_g_u;
  const mxArray *c33_h_y = NULL;
  uint8_T c33_h_hoistedGlobal;
  uint8_T c33_h_u;
  const mxArray *c33_i_y = NULL;
  boolean_T *c33_event1;
  boolean_T *c33_event2;
  boolean_T *c33_event3;
  c33_event3 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c33_event2 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c33_event1 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c33_st = NULL;
  c33_st = NULL;
  c33_y = NULL;
  sf_mex_assign(&c33_y, sf_mex_createcellarray(8), FALSE);
  c33_hoistedGlobal = *c33_event1;
  c33_u = c33_hoistedGlobal;
  c33_b_y = NULL;
  sf_mex_assign(&c33_b_y, sf_mex_create("y", &c33_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c33_y, 0, c33_b_y);
  c33_b_hoistedGlobal = *c33_event2;
  c33_b_u = c33_b_hoistedGlobal;
  c33_c_y = NULL;
  sf_mex_assign(&c33_c_y, sf_mex_create("y", &c33_b_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c33_y, 1, c33_c_y);
  c33_c_hoistedGlobal = *c33_event3;
  c33_c_u = c33_c_hoistedGlobal;
  c33_d_y = NULL;
  sf_mex_assign(&c33_d_y, sf_mex_create("y", &c33_c_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c33_y, 2, c33_d_y);
  c33_d_hoistedGlobal = chartInstance->c33_event1EventCounter;
  c33_d_u = c33_d_hoistedGlobal;
  c33_e_y = NULL;
  sf_mex_assign(&c33_e_y, sf_mex_create("y", &c33_d_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c33_y, 3, c33_e_y);
  c33_e_hoistedGlobal = chartInstance->c33_event2EventCounter;
  c33_e_u = c33_e_hoistedGlobal;
  c33_f_y = NULL;
  sf_mex_assign(&c33_f_y, sf_mex_create("y", &c33_e_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c33_y, 4, c33_f_y);
  c33_f_hoistedGlobal = chartInstance->c33_event3EventCounter;
  c33_f_u = c33_f_hoistedGlobal;
  c33_g_y = NULL;
  sf_mex_assign(&c33_g_y, sf_mex_create("y", &c33_f_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c33_y, 5, c33_g_y);
  c33_g_hoistedGlobal = chartInstance->c33_is_active_c33_heart_model;
  c33_g_u = c33_g_hoistedGlobal;
  c33_h_y = NULL;
  sf_mex_assign(&c33_h_y, sf_mex_create("y", &c33_g_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c33_y, 6, c33_h_y);
  c33_h_hoistedGlobal = chartInstance->c33_is_c33_heart_model;
  c33_h_u = c33_h_hoistedGlobal;
  c33_i_y = NULL;
  sf_mex_assign(&c33_i_y, sf_mex_create("y", &c33_h_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c33_y, 7, c33_i_y);
  sf_mex_assign(&c33_st, c33_y, FALSE);
  return c33_st;
}

static void set_sim_state_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_st)
{
  const mxArray *c33_u;
  boolean_T *c33_event1;
  boolean_T *c33_event2;
  boolean_T *c33_event3;
  c33_event3 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c33_event2 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c33_event1 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c33_u = sf_mex_dup(c33_st);
  *c33_event1 = c33_f_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c33_u, 0)), "event1");
  *c33_event2 = c33_f_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c33_u, 1)), "event2");
  *c33_event3 = c33_f_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c33_u, 2)), "event3");
  chartInstance->c33_event1EventCounter = c33_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c33_u, 3)), "event1EventCounter");
  chartInstance->c33_event2EventCounter = c33_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c33_u, 4)), "event2EventCounter");
  chartInstance->c33_event3EventCounter = c33_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c33_u, 5)), "event3EventCounter");
  chartInstance->c33_is_active_c33_heart_model = c33_d_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c33_u, 6)),
     "is_active_c33_heart_model");
  chartInstance->c33_is_c33_heart_model = c33_d_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c33_u, 7)), "is_c33_heart_model");
  sf_mex_assign(&chartInstance->c33_setSimStateSideEffectsInfo,
                c33_h_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c33_u, 8)), "setSimStateSideEffectsInfo"), TRUE);
  sf_mex_destroy(&c33_u);
  chartInstance->c33_doSetSimStateSideEffects = 1U;
  c33_update_debugger_state_c33_heart_model(chartInstance);
  sf_mex_destroy(&c33_st);
}

static void c33_set_sim_state_side_effects_c33_heart_model
  (SFc33_heart_modelInstanceStruct *chartInstance)
{
  if (chartInstance->c33_doSetSimStateSideEffects != 0) {
    if (chartInstance->c33_is_c33_heart_model == c33_IN_state) {
      chartInstance->c33_tp_state = 1U;
    } else {
      chartInstance->c33_tp_state = 0U;
    }

    chartInstance->c33_doSetSimStateSideEffects = 0U;
  }
}

static void finalize_c33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance)
{
  sf_mex_destroy(&chartInstance->c33_setSimStateSideEffectsInfo);
}

static void sf_c33_heart_model(SFc33_heart_modelInstanceStruct *chartInstance)
{
  boolean_T c33_out;
  boolean_T c33_b_out;
  boolean_T c33_c_out;
  boolean_T c33_temp;
  boolean_T c33_d_out;
  boolean_T c33_e_out;
  boolean_T c33_f_out;
  real_T *c33_v;
  boolean_T *c33_event1;
  boolean_T *c33_event2;
  boolean_T *c33_event3;
  c33_event3 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c33_event2 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c33_event1 = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c33_v = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
  c33_set_sim_state_side_effects_c33_heart_model(chartInstance);
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
  _SFD_CC_CALL(CHART_ENTER_SFUNCTION_TAG, 30U, chartInstance->c33_sfEvent);
  _SFD_DATA_RANGE_CHECK(*c33_v, 0U);
  chartInstance->c33_sfEvent = CALL_EVENT;
  _SFD_CC_CALL(CHART_ENTER_DURING_FUNCTION_TAG, 30U, chartInstance->c33_sfEvent);
  if (chartInstance->c33_is_active_c33_heart_model == 0) {
    _SFD_CC_CALL(CHART_ENTER_ENTRY_FUNCTION_TAG, 30U, chartInstance->c33_sfEvent);
    chartInstance->c33_is_active_c33_heart_model = 1U;
    _SFD_CC_CALL(EXIT_OUT_OF_FUNCTION_TAG, 30U, chartInstance->c33_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 0U,
                 chartInstance->c33_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
    chartInstance->c33_is_c33_heart_model = c33_IN_state;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
    chartInstance->c33_tp_state = 1U;
  } else {
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 0U, chartInstance->c33_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 1U,
                 chartInstance->c33_sfEvent);
    c33_out = (CV_TRANSITION_EVAL(1U, (int32_T)_SFD_CCP_CALL(1U, 0, *c33_v <
      20.0 != 0U, chartInstance->c33_sfEvent)) != 0);
    if (c33_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[3];
        unsigned int numTransitions = 1;
        transitionList[0] = 1;
        sf_debug_transition_conflict_check_begin();
        c33_b_out = ((*c33_v >= 20.0) && (*c33_v < 138.0));
        if (c33_b_out) {
          transitionList[numTransitions] = 2;
          numTransitions++;
        }

        c33_c_out = (*c33_v >= 138.0);
        if (c33_c_out) {
          transitionList[numTransitions] = 3;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 1U, chartInstance->c33_sfEvent);
      chartInstance->c33_tp_state = 0U;
      chartInstance->c33_is_c33_heart_model = c33_IN_NO_ACTIVE_CHILD;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
      chartInstance->c33_event1EventCounter++;
      chartInstance->c33_is_c33_heart_model = c33_IN_state;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
      chartInstance->c33_tp_state = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 2U,
                   chartInstance->c33_sfEvent);
      c33_temp = (_SFD_CCP_CALL(2U, 0, *c33_v >= 20.0 != 0U,
        chartInstance->c33_sfEvent) != 0);
      if (c33_temp) {
        c33_temp = (_SFD_CCP_CALL(2U, 1, *c33_v < 138.0 != 0U,
          chartInstance->c33_sfEvent) != 0);
      }

      c33_d_out = (CV_TRANSITION_EVAL(2U, (int32_T)c33_temp) != 0);
      if (c33_d_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 2;
          sf_debug_transition_conflict_check_begin();
          c33_e_out = (*c33_v >= 138.0);
          if (c33_e_out) {
            transitionList[numTransitions] = 3;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 2U, chartInstance->c33_sfEvent);
        chartInstance->c33_tp_state = 0U;
        chartInstance->c33_is_c33_heart_model = c33_IN_NO_ACTIVE_CHILD;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
        chartInstance->c33_event2EventCounter++;
        chartInstance->c33_is_c33_heart_model = c33_IN_state;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
        chartInstance->c33_tp_state = 1U;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 3U,
                     chartInstance->c33_sfEvent);
        c33_f_out = (CV_TRANSITION_EVAL(3U, (int32_T)_SFD_CCP_CALL(3U, 0, *c33_v
          >= 138.0 != 0U, chartInstance->c33_sfEvent)) != 0);
        if (c33_f_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 3U, chartInstance->c33_sfEvent);
          chartInstance->c33_tp_state = 0U;
          chartInstance->c33_is_c33_heart_model = c33_IN_NO_ACTIVE_CHILD;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
          chartInstance->c33_event3EventCounter++;
          chartInstance->c33_is_c33_heart_model = c33_IN_state;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c33_sfEvent);
          chartInstance->c33_tp_state = 1U;
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 0U, chartInstance->c33_sfEvent);
  }

  _SFD_CC_CALL(EXIT_OUT_OF_FUNCTION_TAG, 30U, chartInstance->c33_sfEvent);
  if (chartInstance->c33_event1EventCounter > 0U) {
    *c33_event1 = !*c33_event1;
    chartInstance->c33_event1EventCounter--;
  }

  if (chartInstance->c33_event2EventCounter > 0U) {
    *c33_event2 = !*c33_event2;
    chartInstance->c33_event2EventCounter--;
  }

  if (chartInstance->c33_event3EventCounter > 0U) {
    *c33_event3 = !*c33_event3;
    chartInstance->c33_event3EventCounter--;
  }

  sf_debug_check_for_state_inconsistency(_heart_modelMachineNumber_,
    chartInstance->chartNumber, chartInstance->instanceNumber);
}

static void initSimStructsc33_heart_model(SFc33_heart_modelInstanceStruct
  *chartInstance)
{
}

static void init_script_number_translation(uint32_T c33_machineNumber, uint32_T
  c33_chartNumber)
{
}

const mxArray *sf_c33_heart_model_get_eml_resolved_functions_info(void)
{
  const mxArray *c33_nameCaptureInfo = NULL;
  c33_nameCaptureInfo = NULL;
  sf_mex_assign(&c33_nameCaptureInfo, sf_mex_create("nameCaptureInfo", NULL, 0,
    0U, 1U, 0U, 2, 0, 1), FALSE);
  return c33_nameCaptureInfo;
}

static const mxArray *c33_sf_marshallOut(void *chartInstanceVoid, void
  *c33_inData)
{
  const mxArray *c33_mxArrayOutData = NULL;
  uint32_T c33_u;
  const mxArray *c33_y = NULL;
  SFc33_heart_modelInstanceStruct *chartInstance;
  chartInstance = (SFc33_heart_modelInstanceStruct *)chartInstanceVoid;
  c33_mxArrayOutData = NULL;
  c33_u = *(uint32_T *)c33_inData;
  c33_y = NULL;
  sf_mex_assign(&c33_y, sf_mex_create("y", &c33_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c33_mxArrayOutData, c33_y, FALSE);
  return c33_mxArrayOutData;
}

static uint32_T c33_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_b_event1EventCounter, const char_T
  *c33_identifier)
{
  uint32_T c33_y;
  emlrtMsgIdentifier c33_thisId;
  c33_thisId.fIdentifier = c33_identifier;
  c33_thisId.fParent = NULL;
  c33_y = c33_b_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c33_b_event1EventCounter), &c33_thisId);
  sf_mex_destroy(&c33_b_event1EventCounter);
  return c33_y;
}

static uint32_T c33_b_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId)
{
  uint32_T c33_y;
  uint32_T c33_u0;
  sf_mex_import(c33_parentId, sf_mex_dup(c33_u), &c33_u0, 1, 7, 0U, 0, 0U, 0);
  c33_y = c33_u0;
  sf_mex_destroy(&c33_u);
  return c33_y;
}

static void c33_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c33_mxArrayInData, const char_T *c33_varName, void *c33_outData)
{
  const mxArray *c33_b_event1EventCounter;
  const char_T *c33_identifier;
  emlrtMsgIdentifier c33_thisId;
  uint32_T c33_y;
  SFc33_heart_modelInstanceStruct *chartInstance;
  chartInstance = (SFc33_heart_modelInstanceStruct *)chartInstanceVoid;
  c33_b_event1EventCounter = sf_mex_dup(c33_mxArrayInData);
  c33_identifier = c33_varName;
  c33_thisId.fIdentifier = c33_identifier;
  c33_thisId.fParent = NULL;
  c33_y = c33_b_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c33_b_event1EventCounter), &c33_thisId);
  sf_mex_destroy(&c33_b_event1EventCounter);
  *(uint32_T *)c33_outData = c33_y;
  sf_mex_destroy(&c33_mxArrayInData);
}

static const mxArray *c33_b_sf_marshallOut(void *chartInstanceVoid, void
  *c33_inData)
{
  const mxArray *c33_mxArrayOutData = NULL;
  int32_T c33_u;
  const mxArray *c33_y = NULL;
  SFc33_heart_modelInstanceStruct *chartInstance;
  chartInstance = (SFc33_heart_modelInstanceStruct *)chartInstanceVoid;
  c33_mxArrayOutData = NULL;
  c33_u = *(int32_T *)c33_inData;
  c33_y = NULL;
  sf_mex_assign(&c33_y, sf_mex_create("y", &c33_u, 6, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c33_mxArrayOutData, c33_y, FALSE);
  return c33_mxArrayOutData;
}

static int32_T c33_c_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId)
{
  int32_T c33_y;
  int32_T c33_i0;
  sf_mex_import(c33_parentId, sf_mex_dup(c33_u), &c33_i0, 1, 6, 0U, 0, 0U, 0);
  c33_y = c33_i0;
  sf_mex_destroy(&c33_u);
  return c33_y;
}

static void c33_b_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c33_mxArrayInData, const char_T *c33_varName, void *c33_outData)
{
  const mxArray *c33_b_sfEvent;
  const char_T *c33_identifier;
  emlrtMsgIdentifier c33_thisId;
  int32_T c33_y;
  SFc33_heart_modelInstanceStruct *chartInstance;
  chartInstance = (SFc33_heart_modelInstanceStruct *)chartInstanceVoid;
  c33_b_sfEvent = sf_mex_dup(c33_mxArrayInData);
  c33_identifier = c33_varName;
  c33_thisId.fIdentifier = c33_identifier;
  c33_thisId.fParent = NULL;
  c33_y = c33_c_emlrt_marshallIn(chartInstance, sf_mex_dup(c33_b_sfEvent),
    &c33_thisId);
  sf_mex_destroy(&c33_b_sfEvent);
  *(int32_T *)c33_outData = c33_y;
  sf_mex_destroy(&c33_mxArrayInData);
}

static const mxArray *c33_c_sf_marshallOut(void *chartInstanceVoid, void
  *c33_inData)
{
  const mxArray *c33_mxArrayOutData = NULL;
  uint8_T c33_u;
  const mxArray *c33_y = NULL;
  SFc33_heart_modelInstanceStruct *chartInstance;
  chartInstance = (SFc33_heart_modelInstanceStruct *)chartInstanceVoid;
  c33_mxArrayOutData = NULL;
  c33_u = *(uint8_T *)c33_inData;
  c33_y = NULL;
  sf_mex_assign(&c33_y, sf_mex_create("y", &c33_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c33_mxArrayOutData, c33_y, FALSE);
  return c33_mxArrayOutData;
}

static uint8_T c33_d_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_b_tp_state, const char_T *c33_identifier)
{
  uint8_T c33_y;
  emlrtMsgIdentifier c33_thisId;
  c33_thisId.fIdentifier = c33_identifier;
  c33_thisId.fParent = NULL;
  c33_y = c33_e_emlrt_marshallIn(chartInstance, sf_mex_dup(c33_b_tp_state),
    &c33_thisId);
  sf_mex_destroy(&c33_b_tp_state);
  return c33_y;
}

static uint8_T c33_e_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId)
{
  uint8_T c33_y;
  uint8_T c33_u1;
  sf_mex_import(c33_parentId, sf_mex_dup(c33_u), &c33_u1, 1, 3, 0U, 0, 0U, 0);
  c33_y = c33_u1;
  sf_mex_destroy(&c33_u);
  return c33_y;
}

static void c33_c_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c33_mxArrayInData, const char_T *c33_varName, void *c33_outData)
{
  const mxArray *c33_b_tp_state;
  const char_T *c33_identifier;
  emlrtMsgIdentifier c33_thisId;
  uint8_T c33_y;
  SFc33_heart_modelInstanceStruct *chartInstance;
  chartInstance = (SFc33_heart_modelInstanceStruct *)chartInstanceVoid;
  c33_b_tp_state = sf_mex_dup(c33_mxArrayInData);
  c33_identifier = c33_varName;
  c33_thisId.fIdentifier = c33_identifier;
  c33_thisId.fParent = NULL;
  c33_y = c33_e_emlrt_marshallIn(chartInstance, sf_mex_dup(c33_b_tp_state),
    &c33_thisId);
  sf_mex_destroy(&c33_b_tp_state);
  *(uint8_T *)c33_outData = c33_y;
  sf_mex_destroy(&c33_mxArrayInData);
}

static const mxArray *c33_d_sf_marshallOut(void *chartInstanceVoid, void
  *c33_inData)
{
  const mxArray *c33_mxArrayOutData = NULL;
  real_T c33_u;
  const mxArray *c33_y = NULL;
  SFc33_heart_modelInstanceStruct *chartInstance;
  chartInstance = (SFc33_heart_modelInstanceStruct *)chartInstanceVoid;
  c33_mxArrayOutData = NULL;
  c33_u = *(real_T *)c33_inData;
  c33_y = NULL;
  sf_mex_assign(&c33_y, sf_mex_create("y", &c33_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c33_mxArrayOutData, c33_y, FALSE);
  return c33_mxArrayOutData;
}

static boolean_T c33_f_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_event1, const char_T *c33_identifier)
{
  boolean_T c33_y;
  emlrtMsgIdentifier c33_thisId;
  c33_thisId.fIdentifier = c33_identifier;
  c33_thisId.fParent = NULL;
  c33_y = c33_g_emlrt_marshallIn(chartInstance, sf_mex_dup(c33_event1),
    &c33_thisId);
  sf_mex_destroy(&c33_event1);
  return c33_y;
}

static boolean_T c33_g_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId)
{
  boolean_T c33_y;
  boolean_T c33_b0;
  sf_mex_import(c33_parentId, sf_mex_dup(c33_u), &c33_b0, 1, 11, 0U, 0, 0U, 0);
  c33_y = c33_b0;
  sf_mex_destroy(&c33_u);
  return c33_y;
}

static const mxArray *c33_h_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_b_setSimStateSideEffectsInfo, const char_T *
  c33_identifier)
{
  const mxArray *c33_y = NULL;
  emlrtMsgIdentifier c33_thisId;
  c33_y = NULL;
  c33_thisId.fIdentifier = c33_identifier;
  c33_thisId.fParent = NULL;
  sf_mex_assign(&c33_y, c33_i_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c33_b_setSimStateSideEffectsInfo), &c33_thisId), FALSE);
  sf_mex_destroy(&c33_b_setSimStateSideEffectsInfo);
  return c33_y;
}

static const mxArray *c33_i_emlrt_marshallIn(SFc33_heart_modelInstanceStruct
  *chartInstance, const mxArray *c33_u, const emlrtMsgIdentifier *c33_parentId)
{
  const mxArray *c33_y = NULL;
  c33_y = NULL;
  sf_mex_assign(&c33_y, sf_mex_duplicatearraysafe(&c33_u), FALSE);
  sf_mex_destroy(&c33_u);
  return c33_y;
}

static void init_dsm_address_info(SFc33_heart_modelInstanceStruct *chartInstance)
{
}

/* SFunction Glue Code */
void sf_c33_heart_model_get_check_sum(mxArray *plhs[])
{
  ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(600858028U);
  ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(3684122215U);
  ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(2025870209U);
  ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(2859312520U);
}

mxArray *sf_c33_heart_model_get_autoinheritance_info(void)
{
  const char *autoinheritanceFields[] = { "checksum", "inputs", "parameters",
    "outputs", "locals" };

  mxArray *mxAutoinheritanceInfo = mxCreateStructMatrix(1,1,5,
    autoinheritanceFields);

  {
    mxArray *mxChecksum = mxCreateString("g4VGvhM6c2Wbd2wlTELlRD");
    mxSetField(mxAutoinheritanceInfo,0,"checksum",mxChecksum);
  }

  {
    const char *dataFields[] = { "size", "type", "complexity" };

    mxArray *mxData = mxCreateStructMatrix(1,1,3,dataFields);

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,0,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,0,"type",mxType);
    }

    mxSetField(mxData,0,"complexity",mxCreateDoubleScalar(0));
    mxSetField(mxAutoinheritanceInfo,0,"inputs",mxData);
  }

  {
    mxSetField(mxAutoinheritanceInfo,0,"parameters",mxCreateDoubleMatrix(0,0,
                mxREAL));
  }

  {
    mxSetField(mxAutoinheritanceInfo,0,"outputs",mxCreateDoubleMatrix(0,0,mxREAL));
  }

  {
    mxSetField(mxAutoinheritanceInfo,0,"locals",mxCreateDoubleMatrix(0,0,mxREAL));
  }

  return(mxAutoinheritanceInfo);
}

static const mxArray *sf_get_sim_state_info_c33_heart_model(void)
{
  const char *infoFields[] = { "chartChecksum", "varInfo" };

  mxArray *mxInfo = mxCreateStructMatrix(1, 1, 2, infoFields);
  const char *infoEncStr[] = {
    "100 S1x8'type','srcId','name','auxInfo'{{M[6],M[65],T\"event1\",},{M[6],M[66],T\"event2\",},{M[6],M[67],T\"event3\",},{M[7],M[65],T\"event1EventCounter\",},{M[7],M[66],T\"event2EventCounter\",},{M[7],M[67],T\"event3EventCounter\",},{M[8],M[0],T\"is_active_c33_heart_model\",},{M[9],M[0],T\"is_c33_heart_model\",}}"
  };

  mxArray *mxVarInfo = sf_mex_decode_encoded_mx_struct_array(infoEncStr, 8, 10);
  mxArray *mxChecksum = mxCreateDoubleMatrix(1, 4, mxREAL);
  sf_c33_heart_model_get_check_sum(&mxChecksum);
  mxSetField(mxInfo, 0, infoFields[0], mxChecksum);
  mxSetField(mxInfo, 0, infoFields[1], mxVarInfo);
  return mxInfo;
}

static void chart_debug_initialization(SimStruct *S, unsigned int
  fullDebuggerInitialization)
{
  if (!sim_mode_is_rtw_gen(S)) {
    SFc33_heart_modelInstanceStruct *chartInstance;
    chartInstance = (SFc33_heart_modelInstanceStruct *) ((ChartInfoStruct *)
      (ssGetUserData(S)))->chartInstance;
    if (ssIsFirstInitCond(S) && fullDebuggerInitialization==1) {
      /* do this only if simulation is starting */
      {
        unsigned int chartAlreadyPresent;
        chartAlreadyPresent = sf_debug_initialize_chart
          (_heart_modelMachineNumber_,
           33,
           1,
           4,
           1,
           3,
           0,
           0,
           0,
           0,
           &(chartInstance->chartNumber),
           &(chartInstance->instanceNumber),
           ssGetPath(S),
           (void *)S);
        if (chartAlreadyPresent==0) {
          /* this is the first instance */
          init_script_number_translation(_heart_modelMachineNumber_,
            chartInstance->chartNumber);
          sf_debug_set_chart_disable_implicit_casting(_heart_modelMachineNumber_,
            chartInstance->chartNumber,1);
          sf_debug_set_chart_event_thresholds(_heart_modelMachineNumber_,
            chartInstance->chartNumber,
            3,
            3,
            3);
          _SFD_SET_DATA_PROPS(0,1,1,0,"v");
          _SFD_EVENT_SCOPE(0,2);
          _SFD_EVENT_SCOPE(1,2);
          _SFD_EVENT_SCOPE(2,2);
          _SFD_STATE_INFO(0,0,0);
          _SFD_CH_SUBSTATE_COUNT(1);
          _SFD_CH_SUBSTATE_DECOMP(0);
          _SFD_CH_SUBSTATE_INDEX(0,0);
          _SFD_ST_SUBSTATE_COUNT(0,0);
        }

        _SFD_CV_INIT_CHART(1,0,0,0);

        {
          _SFD_CV_INIT_STATE(0,0,0,0,0,0,NULL,NULL);
        }

        _SFD_CV_INIT_TRANS(0,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(3,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 5 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(1,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 8 };

          static unsigned int sEndGuardMap[] = { 6, 13 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(2,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_TRANS_COV_WTS(0,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(0,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(3,0,1,0,1);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(3,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              1,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(1,0,1,0,1);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 5 };

          _SFD_TRANS_COV_MAPS(1,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              1,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(2,0,2,0,1);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 8 };

          static unsigned int sEndGuardMap[] = { 6, 13 };

          _SFD_TRANS_COV_MAPS(2,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              1,NULL,NULL);
        }

        _SFD_SET_DATA_COMPILED_PROPS(0,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c33_d_sf_marshallOut,(MexInFcnForType)NULL);

        {
          real_T *c33_v;
          c33_v = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
          _SFD_SET_DATA_VALUE_PTR(0U, c33_v);
        }
      }
    } else {
      sf_debug_reset_current_state_configuration(_heart_modelMachineNumber_,
        chartInstance->chartNumber,chartInstance->instanceNumber);
    }
  }
}

static const char* sf_get_instance_specialization()
{
  return "uC2wUZ2X7tLsNcUtQjy1iE";
}

static void sf_opaque_initialize_c33_heart_model(void *chartInstanceVar)
{
  chart_debug_initialization(((SFc33_heart_modelInstanceStruct*)
    chartInstanceVar)->S,0);
  initialize_params_c33_heart_model((SFc33_heart_modelInstanceStruct*)
    chartInstanceVar);
  initialize_c33_heart_model((SFc33_heart_modelInstanceStruct*) chartInstanceVar);
}

static void sf_opaque_enable_c33_heart_model(void *chartInstanceVar)
{
  enable_c33_heart_model((SFc33_heart_modelInstanceStruct*) chartInstanceVar);
}

static void sf_opaque_disable_c33_heart_model(void *chartInstanceVar)
{
  disable_c33_heart_model((SFc33_heart_modelInstanceStruct*) chartInstanceVar);
}

static void sf_opaque_gateway_c33_heart_model(void *chartInstanceVar)
{
  sf_c33_heart_model((SFc33_heart_modelInstanceStruct*) chartInstanceVar);
}

extern const mxArray* sf_internal_get_sim_state_c33_heart_model(SimStruct* S)
{
  ChartInfoStruct *chartInfo = (ChartInfoStruct*) ssGetUserData(S);
  mxArray *plhs[1] = { NULL };

  mxArray *prhs[4];
  int mxError = 0;
  prhs[0] = mxCreateString("chart_simctx_raw2high");
  prhs[1] = mxCreateDoubleScalar(ssGetSFuncBlockHandle(S));
  prhs[2] = (mxArray*) get_sim_state_c33_heart_model
    ((SFc33_heart_modelInstanceStruct*)chartInfo->chartInstance);/* raw sim ctx */
  prhs[3] = (mxArray*) sf_get_sim_state_info_c33_heart_model();/* state var info */
  mxError = sf_mex_call_matlab(1, plhs, 4, prhs, "sfprivate");
  mxDestroyArray(prhs[0]);
  mxDestroyArray(prhs[1]);
  mxDestroyArray(prhs[2]);
  mxDestroyArray(prhs[3]);
  if (mxError || plhs[0] == NULL) {
    sf_mex_error_message("Stateflow Internal Error: \nError calling 'chart_simctx_raw2high'.\n");
  }

  return plhs[0];
}

extern void sf_internal_set_sim_state_c33_heart_model(SimStruct* S, const
  mxArray *st)
{
  ChartInfoStruct *chartInfo = (ChartInfoStruct*) ssGetUserData(S);
  mxArray *plhs[1] = { NULL };

  mxArray *prhs[4];
  int mxError = 0;
  prhs[0] = mxCreateString("chart_simctx_high2raw");
  prhs[1] = mxCreateDoubleScalar(ssGetSFuncBlockHandle(S));
  prhs[2] = mxDuplicateArray(st);      /* high level simctx */
  prhs[3] = (mxArray*) sf_get_sim_state_info_c33_heart_model();/* state var info */
  mxError = sf_mex_call_matlab(1, plhs, 4, prhs, "sfprivate");
  mxDestroyArray(prhs[0]);
  mxDestroyArray(prhs[1]);
  mxDestroyArray(prhs[2]);
  mxDestroyArray(prhs[3]);
  if (mxError || plhs[0] == NULL) {
    sf_mex_error_message("Stateflow Internal Error: \nError calling 'chart_simctx_high2raw'.\n");
  }

  set_sim_state_c33_heart_model((SFc33_heart_modelInstanceStruct*)
    chartInfo->chartInstance, mxDuplicateArray(plhs[0]));
  mxDestroyArray(plhs[0]);
}

static const mxArray* sf_opaque_get_sim_state_c33_heart_model(SimStruct* S)
{
  return sf_internal_get_sim_state_c33_heart_model(S);
}

static void sf_opaque_set_sim_state_c33_heart_model(SimStruct* S, const mxArray *
  st)
{
  sf_internal_set_sim_state_c33_heart_model(S, st);
}

static void sf_opaque_terminate_c33_heart_model(void *chartInstanceVar)
{
  if (chartInstanceVar!=NULL) {
    SimStruct *S = ((SFc33_heart_modelInstanceStruct*) chartInstanceVar)->S;
    if (sim_mode_is_rtw_gen(S) || sim_mode_is_external(S)) {
      sf_clear_rtw_identifier(S);
    }

    finalize_c33_heart_model((SFc33_heart_modelInstanceStruct*) chartInstanceVar);
    free((void *)chartInstanceVar);
    ssSetUserData(S,NULL);
  }

  unload_heart_model_optimization_info();
}

static void sf_opaque_init_subchart_simstructs(void *chartInstanceVar)
{
  initSimStructsc33_heart_model((SFc33_heart_modelInstanceStruct*)
    chartInstanceVar);
}

extern unsigned int sf_machine_global_initializer_called(void);
static void mdlProcessParameters_c33_heart_model(SimStruct *S)
{
  int i;
  for (i=0;i<ssGetNumRunTimeParams(S);i++) {
    if (ssGetSFcnParamTunable(S,i)) {
      ssUpdateDlgParamAsRunTimeParam(S,i);
    }
  }

  if (sf_machine_global_initializer_called()) {
    initialize_params_c33_heart_model((SFc33_heart_modelInstanceStruct*)
      (((ChartInfoStruct *)ssGetUserData(S))->chartInstance));
  }
}

static void mdlSetWorkWidths_c33_heart_model(SimStruct *S)
{
  if (sim_mode_is_rtw_gen(S) || sim_mode_is_external(S)) {
    mxArray *infoStruct = load_heart_model_optimization_info();
    int_T chartIsInlinable =
      (int_T)sf_is_chart_inlinable(S,sf_get_instance_specialization(),infoStruct,
      33);
    ssSetStateflowIsInlinable(S,chartIsInlinable);
    ssSetRTWCG(S,sf_rtw_info_uint_prop(S,sf_get_instance_specialization(),
                infoStruct,33,"RTWCG"));
    ssSetEnableFcnIsTrivial(S,1);
    ssSetDisableFcnIsTrivial(S,1);
    ssSetNotMultipleInlinable(S,sf_rtw_info_uint_prop(S,
      sf_get_instance_specialization(),infoStruct,33,
      "gatewayCannotBeInlinedMultipleTimes"));
    if (chartIsInlinable) {
      ssSetInputPortOptimOpts(S, 0, SS_REUSABLE_AND_LOCAL);
      sf_mark_chart_expressionable_inputs(S,sf_get_instance_specialization(),
        infoStruct,33,1);
    }

    sf_set_rtw_dwork_info(S,sf_get_instance_specialization(),infoStruct,33);
    ssSetHasSubFunctions(S,!(chartIsInlinable));
  } else {
  }

  ssSetOptions(S,ssGetOptions(S)|SS_OPTION_WORKS_WITH_CODE_REUSE);
  ssSetChecksum0(S,(2120035736U));
  ssSetChecksum1(S,(3253109315U));
  ssSetChecksum2(S,(2363121021U));
  ssSetChecksum3(S,(755904458U));
  ssSetmdlDerivatives(S, NULL);
  ssSetExplicitFCSSCtrl(S,1);
}

static void mdlRTW_c33_heart_model(SimStruct *S)
{
  if (sim_mode_is_rtw_gen(S)) {
    ssWriteRTWStrParam(S, "StateflowChartType", "Stateflow");
  }
}

static void mdlStart_c33_heart_model(SimStruct *S)
{
  SFc33_heart_modelInstanceStruct *chartInstance;
  chartInstance = (SFc33_heart_modelInstanceStruct *)malloc(sizeof
    (SFc33_heart_modelInstanceStruct));
  memset(chartInstance, 0, sizeof(SFc33_heart_modelInstanceStruct));
  if (chartInstance==NULL) {
    sf_mex_error_message("Could not allocate memory for chart instance.");
  }

  chartInstance->chartInfo.chartInstance = chartInstance;
  chartInstance->chartInfo.isEMLChart = 0;
  chartInstance->chartInfo.chartInitialized = 0;
  chartInstance->chartInfo.sFunctionGateway = sf_opaque_gateway_c33_heart_model;
  chartInstance->chartInfo.initializeChart =
    sf_opaque_initialize_c33_heart_model;
  chartInstance->chartInfo.terminateChart = sf_opaque_terminate_c33_heart_model;
  chartInstance->chartInfo.enableChart = sf_opaque_enable_c33_heart_model;
  chartInstance->chartInfo.disableChart = sf_opaque_disable_c33_heart_model;
  chartInstance->chartInfo.getSimState = sf_opaque_get_sim_state_c33_heart_model;
  chartInstance->chartInfo.setSimState = sf_opaque_set_sim_state_c33_heart_model;
  chartInstance->chartInfo.getSimStateInfo =
    sf_get_sim_state_info_c33_heart_model;
  chartInstance->chartInfo.zeroCrossings = NULL;
  chartInstance->chartInfo.outputs = NULL;
  chartInstance->chartInfo.derivatives = NULL;
  chartInstance->chartInfo.mdlRTW = mdlRTW_c33_heart_model;
  chartInstance->chartInfo.mdlStart = mdlStart_c33_heart_model;
  chartInstance->chartInfo.mdlSetWorkWidths = mdlSetWorkWidths_c33_heart_model;
  chartInstance->chartInfo.extModeExec = NULL;
  chartInstance->chartInfo.restoreLastMajorStepConfiguration = NULL;
  chartInstance->chartInfo.restoreBeforeLastMajorStepConfiguration = NULL;
  chartInstance->chartInfo.storeCurrentConfiguration = NULL;
  chartInstance->S = S;
  ssSetUserData(S,(void *)(&(chartInstance->chartInfo)));/* register the chart instance with simstruct */
  init_dsm_address_info(chartInstance);
  if (!sim_mode_is_rtw_gen(S)) {
  }

  sf_opaque_init_subchart_simstructs(chartInstance->chartInfo.chartInstance);
  chart_debug_initialization(S,1);
}

void c33_heart_model_method_dispatcher(SimStruct *S, int_T method, void *data)
{
  switch (method) {
   case SS_CALL_MDL_START:
    mdlStart_c33_heart_model(S);
    break;

   case SS_CALL_MDL_SET_WORK_WIDTHS:
    mdlSetWorkWidths_c33_heart_model(S);
    break;

   case SS_CALL_MDL_PROCESS_PARAMETERS:
    mdlProcessParameters_c33_heart_model(S);
    break;

   default:
    /* Unhandled method */
    sf_mex_error_message("Stateflow Internal Error:\n"
                         "Error calling c33_heart_model_method_dispatcher.\n"
                         "Can't handle method %d.\n", method);
    break;
  }
}
