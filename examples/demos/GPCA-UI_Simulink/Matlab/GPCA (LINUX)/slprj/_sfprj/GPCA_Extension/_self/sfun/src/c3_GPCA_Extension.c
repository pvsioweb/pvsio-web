/* Include files */

#include "blascompat32.h"
#include "GPCA_Extension_sfun.h"
#include "c3_GPCA_Extension.h"
#define CHARTINSTANCE_CHARTNUMBER      (chartInstance->chartNumber)
#define CHARTINSTANCE_INSTANCENUMBER   (chartInstance->instanceNumber)
#include "GPCA_Extension_sfun_debug_macros.h"

/* Type Definitions */

/* Named Constants */
#define c3_event_E_Restart             (1)
#define c3_event_E_AlarmClear          (2)
#define c3_event_E_LevelOneAlarm       (4)
#define c3_event_E_LevelTwoAlarm       (5)
#define c3_event_E_LevelOneClear       (6)
#define c3_event_E_ResetOne            (7)
#define c3_event_E_DoneOne             (8)
#define c3_event_E_DoneThree           (9)
#define c3_event_E_DoneTwo             (10)
#define c3_event_E_ResetTwo            (11)
#define c3_event_E_ResetThree          (12)
#define c3_event_E_WarningAlarm        (13)
#define c3_event_E_RequestToStart      (14)
#define c3_event_E_Clock               (15)
#define CALL_EVENT                     (-1)
#define c3_IN_NO_ACTIVE_CHILD          ((uint8_T)0U)
#define c3_IN_HumidityCheck            ((uint8_T)7U)
#define c3_IN_BatteryChargingCheck     ((uint8_T)2U)
#define c3_IN_LowBatteryCheck          ((uint8_T)10U)
#define c3_IN_LoggingCheck             ((uint8_T)9U)
#define c3_IN_InfusionPausedDurationCheck ((uint8_T)8U)
#define c3_IN_EndState                 ((uint8_T)3U)
#define c3_IN_WNStart                  ((uint8_T)14U)
#define c3_IN_LowReservoirCheck        ((uint8_T)11U)
#define c3_IN_Hold                     ((uint8_T)4U)
#define c3_IN_HOLD                     ((uint8_T)3U)
#define c3_IN_AlarmingMachine          ((uint8_T)1U)
#define c3_IN_SinkTWOCheckOne          ((uint8_T)7U)
#define c3_IN_START                    ((uint8_T)4U)
#define c3_IN_WatchdogCheck            ((uint8_T)9U)
#define c3_IN_Sink24                   ((uint8_T)15U)
#define c3_IN_Sink26                   ((uint8_T)17U)
#define c3_IN_RateOverPumpCapacityCheck ((uint8_T)10U)
#define c3_IN_CheckLOne                ((uint8_T)1U)
#define c3_IN_CheckWRN                 ((uint8_T)3U)
#define c3_IN_SinkOne                  ((uint8_T)5U)
#define c3_IN_LowInfusionRateCheck     ((uint8_T)6U)
#define c3_IN_RateLessThanKVOCheck     ((uint8_T)9U)
#define c3_IN_Sink25                   ((uint8_T)16U)
#define c3_IN_OcculusionCheck          ((uint8_T)8U)
#define c3_IN_Sink23                   ((uint8_T)14U)
#define c3_IN_HighInfusionRateCheck    ((uint8_T)3U)
#define c3_IN_SinkTWO                  ((uint8_T)6U)
#define c3_IN_Normal                   ((uint8_T)7U)
#define c3_IN_DoorOpenCheck            ((uint8_T)2U)
#define c3_IN_Sink22                   ((uint8_T)13U)
#define c3_b_IN_Normal                 ((uint8_T)2U)
#define c3_IN_s1                       ((uint8_T)3U)
#define c3_IN_ReservoirEmptyCheck      ((uint8_T)11U)
#define c3_IN_Sink21                   ((uint8_T)12U)
#define c3_IN_MemoryCheck              ((uint8_T)5U)
#define c3_IN_CPUCheck                 ((uint8_T)2U)
#define c3_IN_VoltageCheck             ((uint8_T)13U)
#define c3_IN_RTCCheck                 ((uint8_T)8U)
#define c3_IN_FlowRateStabilityCheck   ((uint8_T)5U)
#define c3_c_IN_Normal                 ((uint8_T)6U)
#define c3_IN_InfusionPauseDurationCheck ((uint8_T)5U)
#define c3_IN_Checking                 ((uint8_T)1U)
#define c3_IN_CheckLTwo                ((uint8_T)2U)
#define c3_IN_Sink27                   ((uint8_T)18U)
#define c3_IN_AirInLineCheck           ((uint8_T)1U)
#define c3_IN_Sink29                   ((uint8_T)20U)
#define c3_IN_Sink28                   ((uint8_T)19U)
#define c3_IN_PumpTempCheck            ((uint8_T)7U)
#define c3_IN_s2                       ((uint8_T)4U)
#define c3_IN_L1Sink                   ((uint8_T)4U)
#define c3_IN_BatteryDepletionCheck    ((uint8_T)1U)
#define c3_IN_HoldOn                   ((uint8_T)6U)
#define c3_b_IN_PumpTempCheck          ((uint8_T)12U)
#define c3_IN_EnvTempCheck             ((uint8_T)4U)
#define c3_IN_APErrCheck               ((uint8_T)1U)
#define c3_const_MSG_BLANK             (30U)

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
static void initialize_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void initialize_params_c3_GPCA_Extension
  (SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void enable_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void disable_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_update_debugger_state_c3_GPCA_Extension
  (SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static const mxArray *get_sim_state_c3_GPCA_Extension
  (SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void set_sim_state_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_st);
static void c3_set_sim_state_side_effects_c3_GPCA_Extension
  (SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void finalize_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void sf_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void initSimStructsc3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_HumidityCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_LowBatteryCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_LoggingCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_InfusionPausedDurationCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_EndState(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_WNStart(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_LowReservoirCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_SinkTWOCheckOne(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_START(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_WRN(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_WatchdogCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_Sink24(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_Sink26(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_RateOverPumpCapacityCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_SinkOne(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_LowInfusionRateCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_RateLessThanKVOCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_Sink25(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_OcculusionCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_Sink23(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_HighInfusionRateCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_SinkTWO(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_Controller(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_Normal(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_Sink22(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_ReservoirEmptyCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_Sink21(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_LTwo(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_VoltageCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_RTCCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_FlowRateStabilityCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_b_Normal(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_InfusionPauseDurationCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_enter_atomic_Checking(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c3_Sink27(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_Sink29(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_Sink28(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_LOne(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_PumpTempCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_CheckReady(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_b_PumpTempCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void c3_EnvTempCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static void init_script_number_translation(uint32_T c3_machineNumber, uint32_T
  c3_chartNumber);
static uint32_T c3_clearWarning(SFc3_GPCA_ExtensionInstanceStruct *chartInstance,
  uint32_T c3_cond);
static uint32_T c3_initiate(SFc3_GPCA_ExtensionInstanceStruct *chartInstance);
static const mxArray *c3_sf_marshallOut(void *chartInstanceVoid, void *c3_inData);
static uint32_T c3_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_b_E_AlarmEventCounter, const char_T
  *c3_identifier);
static uint32_T c3_b_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId);
static void c3_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData);
static const mxArray *c3_b_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData);
static int8_T c3_c_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId);
static void c3_b_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData);
static const mxArray *c3_c_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData);
static int32_T c3_d_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId);
static void c3_c_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData);
static const mxArray *c3_d_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData);
static uint8_T c3_e_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_b_tp_HumidityCheck, const char_T
  *c3_identifier);
static uint8_T c3_f_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId);
static void c3_d_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData);
static const mxArray *c3_e_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData);
static const mxArray *c3_f_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData);
static real_T c3_g_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_ErrCond, const char_T *c3_identifier);
static real_T c3_h_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId);
static void c3_e_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData);
static const mxArray *c3_envSenData_bus_io(void *chartInstanceVoid, void
  *c3_pData);
static const mxArray *c3_g_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData);
static const mxArray *c3_hardwareSenData_bus_io(void *chartInstanceVoid, void
  *c3_pData);
static const mxArray *c3_h_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData);
static const mxArray *c3_infuSenData_bus_io(void *chartInstanceVoid, void
  *c3_pData);
static const mxArray *c3_i_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData);
static boolean_T c3_i_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_b_temp, const char_T *c3_identifier);
static boolean_T c3_j_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId);
static void c3_f_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData);
static const mxArray *c3_k_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_b_setSimStateSideEffectsInfo, const char_T
  *c3_identifier);
static const mxArray *c3_l_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId);
static void init_dsm_address_info(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance);

/* Function Definitions */
static void initialize_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  real_T *c3_ErrCond;
  boolean_T *c3_E_Alarm;
  boolean_T *c3_E_Warning;
  boolean_T *c3_E_Ready;
  boolean_T *c3_E_NotReady;
  c3_E_NotReady = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c3_E_Ready = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c3_E_Warning = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c3_E_Alarm = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
  chartInstance->c3_doSetSimStateSideEffects = 0U;
  chartInstance->c3_setSimStateSideEffectsInfo = NULL;
  chartInstance->c3_tp_AlarmingMachine = 0U;
  chartInstance->c3_is_active_CheckReady = 0U;
  chartInstance->c3_is_CheckReady = 0U;
  chartInstance->c3_tp_CheckReady = 0U;
  chartInstance->c3_tp_Checking = 0U;
  chartInstance->c3_b_tp_Normal = 0U;
  chartInstance->c3_tp_s1 = 0U;
  chartInstance->c3_tp_s2 = 0U;
  chartInstance->c3_is_active_Controller = 0U;
  chartInstance->c3_is_Controller = 0U;
  chartInstance->c3_tp_Controller = 0U;
  chartInstance->c3_tp_CheckLOne = 0U;
  chartInstance->c3_tp_CheckLTwo = 0U;
  chartInstance->c3_tp_CheckWRN = 0U;
  chartInstance->c3_tp_START = 0U;
  chartInstance->c3_tp_SinkOne = 0U;
  chartInstance->c3_tp_SinkTWO = 0U;
  chartInstance->c3_tp_SinkTWOCheckOne = 0U;
  chartInstance->c3_is_active_LOne = 0U;
  chartInstance->c3_is_LOne = 0U;
  chartInstance->c3_tp_LOne = 0U;
  chartInstance->c3_tp_BatteryDepletionCheck = 0U;
  chartInstance->c3_tp_CPUCheck = 0U;
  chartInstance->c3_tp_HOLD = 0U;
  chartInstance->c3_tp_L1Sink = 0U;
  chartInstance->c3_tp_MemoryCheck = 0U;
  chartInstance->c3_c_tp_Normal = 0U;
  chartInstance->c3_tp_PumpTempCheck = 0U;
  chartInstance->c3_tp_RTCCheck = 0U;
  chartInstance->c3_tp_WatchdogCheck = 0U;
  chartInstance->c3_is_active_LTwo = 0U;
  chartInstance->c3_is_LTwo = 0U;
  chartInstance->c3_tp_LTwo = 0U;
  chartInstance->c3_tp_AirInLineCheck = 0U;
  chartInstance->c3_tp_DoorOpenCheck = 0U;
  chartInstance->c3_tp_HighInfusionRateCheck = 0U;
  chartInstance->c3_tp_Hold = 0U;
  chartInstance->c3_tp_InfusionPauseDurationCheck = 0U;
  chartInstance->c3_tp_LowInfusionRateCheck = 0U;
  chartInstance->c3_tp_Normal = 0U;
  chartInstance->c3_tp_OcculusionCheck = 0U;
  chartInstance->c3_tp_RateLessThanKVOCheck = 0U;
  chartInstance->c3_tp_RateOverPumpCapacityCheck = 0U;
  chartInstance->c3_tp_ReservoirEmptyCheck = 0U;
  chartInstance->c3_tp_Sink21 = 0U;
  chartInstance->c3_tp_Sink22 = 0U;
  chartInstance->c3_tp_Sink23 = 0U;
  chartInstance->c3_tp_Sink24 = 0U;
  chartInstance->c3_tp_Sink25 = 0U;
  chartInstance->c3_tp_Sink26 = 0U;
  chartInstance->c3_tp_Sink27 = 0U;
  chartInstance->c3_tp_Sink28 = 0U;
  chartInstance->c3_tp_Sink29 = 0U;
  chartInstance->c3_is_active_WRN = 0U;
  chartInstance->c3_is_WRN = 0U;
  chartInstance->c3_tp_WRN = 0U;
  chartInstance->c3_tp_APErrCheck = 0U;
  chartInstance->c3_tp_BatteryChargingCheck = 0U;
  chartInstance->c3_tp_EndState = 0U;
  chartInstance->c3_tp_EnvTempCheck = 0U;
  chartInstance->c3_tp_FlowRateStabilityCheck = 0U;
  chartInstance->c3_tp_HoldOn = 0U;
  chartInstance->c3_tp_HumidityCheck = 0U;
  chartInstance->c3_tp_InfusionPausedDurationCheck = 0U;
  chartInstance->c3_tp_LoggingCheck = 0U;
  chartInstance->c3_tp_LowBatteryCheck = 0U;
  chartInstance->c3_tp_LowReservoirCheck = 0U;
  chartInstance->c3_b_tp_PumpTempCheck = 0U;
  chartInstance->c3_tp_VoltageCheck = 0U;
  chartInstance->c3_tp_WNStart = 0U;
  chartInstance->c3_is_active_c3_GPCA_Extension = 0U;
  chartInstance->c3_is_c3_GPCA_Extension = 0U;
  chartInstance->c3_LOneCond = 0U;
  chartInstance->c3_LTwoCond = 0U;
  chartInstance->c3_WnCond = 0U;
  chartInstance->c3_temp = FALSE;
  chartInstance->c3_MSG_BLANK = 30U;
  if (!(cdrGetOutputPortReusable(chartInstance->S, 1) != 0)) {
    *c3_ErrCond = 0.0;
  }

  chartInstance->c3_E_AlarmEventCounter = 0U;
  *c3_E_Alarm = FALSE;
  chartInstance->c3_E_WarningEventCounter = 0U;
  *c3_E_Warning = FALSE;
  chartInstance->c3_E_ReadyEventCounter = 0U;
  *c3_E_Ready = FALSE;
  chartInstance->c3_E_NotReadyEventCounter = 0U;
  *c3_E_NotReady = FALSE;
}

static void initialize_params_c3_GPCA_Extension
  (SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
}

static void enable_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
}

static void disable_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
}

static void c3_update_debugger_state_c3_GPCA_Extension
  (SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  uint32_T c3_prevAniVal;
  c3_prevAniVal = sf_debug_get_animation();
  sf_debug_set_animation(0U);
  if (chartInstance->c3_is_active_c3_GPCA_Extension == 1) {
    _SFD_CC_CALL(CHART_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_HumidityCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 52U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 52U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_BatteryChargingCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 47U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 47U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_LowBatteryCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 55U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 55U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_LoggingCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 54U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 54U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_InfusionPausedDurationCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 53U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 53U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_EndState) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 48U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 48U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_WNStart) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 59U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 59U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_LowReservoirCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 56U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 56U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Hold) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_IN_HOLD) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_c3_GPCA_Extension == c3_IN_AlarmingMachine) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 0U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_Controller == c3_IN_SinkTWOCheckOne) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 13U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 13U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_Controller == c3_IN_START) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 10U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 10U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_active_WRN == 1) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 45U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 45U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_IN_WatchdogCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink24) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 39U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink26) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 41U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_RateOverPumpCapacityCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 34U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_Controller == c3_IN_CheckLOne) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_Controller == c3_IN_CheckWRN) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_Controller == c3_IN_SinkOne) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 11U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 11U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_LowInfusionRateCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_RateLessThanKVOCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 33U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink25) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 40U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 40U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_OcculusionCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 32U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 32U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink23) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 38U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 38U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_HighInfusionRateCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 27U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 27U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_Controller == c3_IN_SinkTWO) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 12U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 12U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_active_Controller == 1) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 6U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 6U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Normal) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 31U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_DoorOpenCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink22) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 37U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_CheckReady == c3_b_IN_Normal) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_CheckReady == c3_IN_s1) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_ReservoirEmptyCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink21) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_active_LTwo == 1) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 24U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_IN_MemoryCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 19U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_IN_CPUCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_VoltageCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 58U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 58U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_IN_RTCCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_FlowRateStabilityCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 50U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 50U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_c_IN_Normal) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 20U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_InfusionPauseDurationCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 29U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_CheckReady == c3_IN_Checking) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_Controller == c3_IN_CheckLTwo) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 8U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 8U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink27) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 42U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_AirInLineCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 25U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink29) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 44U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LTwo == c3_IN_Sink28) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_active_LOne == 1) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 14U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 14U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_IN_PumpTempCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 21U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_CheckReady == c3_IN_s2) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 5U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_IN_L1Sink) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_LOne == c3_IN_BatteryDepletionCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 15U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_HoldOn) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_active_CheckReady == 1) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 1U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 1U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_b_IN_PumpTempCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 57U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 57U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_EnvTempCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 49U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 49U, chartInstance->c3_sfEvent);
  }

  if (chartInstance->c3_is_WRN == c3_IN_APErrCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
  }

  sf_debug_set_animation(c3_prevAniVal);
  _SFD_ANIMATE();
}

static const mxArray *get_sim_state_c3_GPCA_Extension
  (SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  const mxArray *c3_st;
  const mxArray *c3_y = NULL;
  real_T c3_hoistedGlobal;
  real_T c3_u;
  const mxArray *c3_b_y = NULL;
  uint32_T c3_b_hoistedGlobal;
  uint32_T c3_b_u;
  const mxArray *c3_c_y = NULL;
  uint32_T c3_c_hoistedGlobal;
  uint32_T c3_c_u;
  const mxArray *c3_d_y = NULL;
  uint32_T c3_d_hoistedGlobal;
  uint32_T c3_d_u;
  const mxArray *c3_e_y = NULL;
  boolean_T c3_e_hoistedGlobal;
  boolean_T c3_e_u;
  const mxArray *c3_f_y = NULL;
  boolean_T c3_f_hoistedGlobal;
  boolean_T c3_f_u;
  const mxArray *c3_g_y = NULL;
  boolean_T c3_g_hoistedGlobal;
  boolean_T c3_g_u;
  const mxArray *c3_h_y = NULL;
  boolean_T c3_h_hoistedGlobal;
  boolean_T c3_h_u;
  const mxArray *c3_i_y = NULL;
  boolean_T c3_i_hoistedGlobal;
  boolean_T c3_i_u;
  const mxArray *c3_j_y = NULL;
  uint32_T c3_j_hoistedGlobal;
  uint32_T c3_j_u;
  const mxArray *c3_k_y = NULL;
  uint32_T c3_k_hoistedGlobal;
  uint32_T c3_k_u;
  const mxArray *c3_l_y = NULL;
  uint32_T c3_l_hoistedGlobal;
  uint32_T c3_l_u;
  const mxArray *c3_m_y = NULL;
  uint32_T c3_m_hoistedGlobal;
  uint32_T c3_m_u;
  const mxArray *c3_n_y = NULL;
  uint8_T c3_n_hoistedGlobal;
  uint8_T c3_n_u;
  const mxArray *c3_o_y = NULL;
  uint8_T c3_o_hoistedGlobal;
  uint8_T c3_o_u;
  const mxArray *c3_p_y = NULL;
  uint8_T c3_p_hoistedGlobal;
  uint8_T c3_p_u;
  const mxArray *c3_q_y = NULL;
  uint8_T c3_q_hoistedGlobal;
  uint8_T c3_q_u;
  const mxArray *c3_r_y = NULL;
  uint8_T c3_r_hoistedGlobal;
  uint8_T c3_r_u;
  const mxArray *c3_s_y = NULL;
  uint8_T c3_s_hoistedGlobal;
  uint8_T c3_s_u;
  const mxArray *c3_t_y = NULL;
  uint8_T c3_t_hoistedGlobal;
  uint8_T c3_t_u;
  const mxArray *c3_u_y = NULL;
  uint8_T c3_u_hoistedGlobal;
  uint8_T c3_u_u;
  const mxArray *c3_v_y = NULL;
  uint8_T c3_v_hoistedGlobal;
  uint8_T c3_v_u;
  const mxArray *c3_w_y = NULL;
  uint8_T c3_w_hoistedGlobal;
  uint8_T c3_w_u;
  const mxArray *c3_x_y = NULL;
  uint8_T c3_x_hoistedGlobal;
  uint8_T c3_x_u;
  const mxArray *c3_y_y = NULL;
  uint8_T c3_y_hoistedGlobal;
  uint8_T c3_y_u;
  const mxArray *c3_ab_y = NULL;
  real_T *c3_ErrCond;
  boolean_T *c3_E_Alarm;
  boolean_T *c3_E_NotReady;
  boolean_T *c3_E_Ready;
  boolean_T *c3_E_Warning;
  c3_E_NotReady = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c3_E_Ready = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c3_E_Warning = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c3_E_Alarm = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c3_st = NULL;
  c3_st = NULL;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_createcellarray(25), FALSE);
  c3_hoistedGlobal = *c3_ErrCond;
  c3_u = c3_hoistedGlobal;
  c3_b_y = NULL;
  sf_mex_assign(&c3_b_y, sf_mex_create("y", &c3_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 0, c3_b_y);
  c3_b_hoistedGlobal = chartInstance->c3_LOneCond;
  c3_b_u = c3_b_hoistedGlobal;
  c3_c_y = NULL;
  sf_mex_assign(&c3_c_y, sf_mex_create("y", &c3_b_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 1, c3_c_y);
  c3_c_hoistedGlobal = chartInstance->c3_LTwoCond;
  c3_c_u = c3_c_hoistedGlobal;
  c3_d_y = NULL;
  sf_mex_assign(&c3_d_y, sf_mex_create("y", &c3_c_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 2, c3_d_y);
  c3_d_hoistedGlobal = chartInstance->c3_WnCond;
  c3_d_u = c3_d_hoistedGlobal;
  c3_e_y = NULL;
  sf_mex_assign(&c3_e_y, sf_mex_create("y", &c3_d_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 3, c3_e_y);
  c3_e_hoistedGlobal = chartInstance->c3_temp;
  c3_e_u = c3_e_hoistedGlobal;
  c3_f_y = NULL;
  sf_mex_assign(&c3_f_y, sf_mex_create("y", &c3_e_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 4, c3_f_y);
  c3_f_hoistedGlobal = *c3_E_Alarm;
  c3_f_u = c3_f_hoistedGlobal;
  c3_g_y = NULL;
  sf_mex_assign(&c3_g_y, sf_mex_create("y", &c3_f_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 5, c3_g_y);
  c3_g_hoistedGlobal = *c3_E_NotReady;
  c3_g_u = c3_g_hoistedGlobal;
  c3_h_y = NULL;
  sf_mex_assign(&c3_h_y, sf_mex_create("y", &c3_g_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 6, c3_h_y);
  c3_h_hoistedGlobal = *c3_E_Ready;
  c3_h_u = c3_h_hoistedGlobal;
  c3_i_y = NULL;
  sf_mex_assign(&c3_i_y, sf_mex_create("y", &c3_h_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 7, c3_i_y);
  c3_i_hoistedGlobal = *c3_E_Warning;
  c3_i_u = c3_i_hoistedGlobal;
  c3_j_y = NULL;
  sf_mex_assign(&c3_j_y, sf_mex_create("y", &c3_i_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 8, c3_j_y);
  c3_j_hoistedGlobal = chartInstance->c3_E_AlarmEventCounter;
  c3_j_u = c3_j_hoistedGlobal;
  c3_k_y = NULL;
  sf_mex_assign(&c3_k_y, sf_mex_create("y", &c3_j_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 9, c3_k_y);
  c3_k_hoistedGlobal = chartInstance->c3_E_NotReadyEventCounter;
  c3_k_u = c3_k_hoistedGlobal;
  c3_l_y = NULL;
  sf_mex_assign(&c3_l_y, sf_mex_create("y", &c3_k_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 10, c3_l_y);
  c3_l_hoistedGlobal = chartInstance->c3_E_ReadyEventCounter;
  c3_l_u = c3_l_hoistedGlobal;
  c3_m_y = NULL;
  sf_mex_assign(&c3_m_y, sf_mex_create("y", &c3_l_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 11, c3_m_y);
  c3_m_hoistedGlobal = chartInstance->c3_E_WarningEventCounter;
  c3_m_u = c3_m_hoistedGlobal;
  c3_n_y = NULL;
  sf_mex_assign(&c3_n_y, sf_mex_create("y", &c3_m_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 12, c3_n_y);
  c3_n_hoistedGlobal = chartInstance->c3_is_active_c3_GPCA_Extension;
  c3_n_u = c3_n_hoistedGlobal;
  c3_o_y = NULL;
  sf_mex_assign(&c3_o_y, sf_mex_create("y", &c3_n_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 13, c3_o_y);
  c3_o_hoistedGlobal = chartInstance->c3_is_active_WRN;
  c3_o_u = c3_o_hoistedGlobal;
  c3_p_y = NULL;
  sf_mex_assign(&c3_p_y, sf_mex_create("y", &c3_o_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 14, c3_p_y);
  c3_p_hoistedGlobal = chartInstance->c3_is_active_Controller;
  c3_p_u = c3_p_hoistedGlobal;
  c3_q_y = NULL;
  sf_mex_assign(&c3_q_y, sf_mex_create("y", &c3_p_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 15, c3_q_y);
  c3_q_hoistedGlobal = chartInstance->c3_is_active_LTwo;
  c3_q_u = c3_q_hoistedGlobal;
  c3_r_y = NULL;
  sf_mex_assign(&c3_r_y, sf_mex_create("y", &c3_q_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 16, c3_r_y);
  c3_r_hoistedGlobal = chartInstance->c3_is_active_LOne;
  c3_r_u = c3_r_hoistedGlobal;
  c3_s_y = NULL;
  sf_mex_assign(&c3_s_y, sf_mex_create("y", &c3_r_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 17, c3_s_y);
  c3_s_hoistedGlobal = chartInstance->c3_is_active_CheckReady;
  c3_s_u = c3_s_hoistedGlobal;
  c3_t_y = NULL;
  sf_mex_assign(&c3_t_y, sf_mex_create("y", &c3_s_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 18, c3_t_y);
  c3_t_hoistedGlobal = chartInstance->c3_is_c3_GPCA_Extension;
  c3_t_u = c3_t_hoistedGlobal;
  c3_u_y = NULL;
  sf_mex_assign(&c3_u_y, sf_mex_create("y", &c3_t_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 19, c3_u_y);
  c3_u_hoistedGlobal = chartInstance->c3_is_WRN;
  c3_u_u = c3_u_hoistedGlobal;
  c3_v_y = NULL;
  sf_mex_assign(&c3_v_y, sf_mex_create("y", &c3_u_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 20, c3_v_y);
  c3_v_hoistedGlobal = chartInstance->c3_is_Controller;
  c3_v_u = c3_v_hoistedGlobal;
  c3_w_y = NULL;
  sf_mex_assign(&c3_w_y, sf_mex_create("y", &c3_v_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 21, c3_w_y);
  c3_w_hoistedGlobal = chartInstance->c3_is_LTwo;
  c3_w_u = c3_w_hoistedGlobal;
  c3_x_y = NULL;
  sf_mex_assign(&c3_x_y, sf_mex_create("y", &c3_w_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 22, c3_x_y);
  c3_x_hoistedGlobal = chartInstance->c3_is_LOne;
  c3_x_u = c3_x_hoistedGlobal;
  c3_y_y = NULL;
  sf_mex_assign(&c3_y_y, sf_mex_create("y", &c3_x_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 23, c3_y_y);
  c3_y_hoistedGlobal = chartInstance->c3_is_CheckReady;
  c3_y_u = c3_y_hoistedGlobal;
  c3_ab_y = NULL;
  sf_mex_assign(&c3_ab_y, sf_mex_create("y", &c3_y_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c3_y, 24, c3_ab_y);
  sf_mex_assign(&c3_st, c3_y, FALSE);
  return c3_st;
}

static void set_sim_state_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_st)
{
  const mxArray *c3_u;
  real_T *c3_ErrCond;
  boolean_T *c3_E_Alarm;
  boolean_T *c3_E_NotReady;
  boolean_T *c3_E_Ready;
  boolean_T *c3_E_Warning;
  c3_E_NotReady = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c3_E_Ready = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c3_E_Warning = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c3_E_Alarm = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c3_u = sf_mex_dup(c3_st);
  *c3_ErrCond = c3_g_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c3_u, 0)), "ErrCond");
  chartInstance->c3_LOneCond = c3_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c3_u, 1)), "LOneCond");
  chartInstance->c3_LTwoCond = c3_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c3_u, 2)), "LTwoCond");
  chartInstance->c3_WnCond = c3_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c3_u, 3)), "WnCond");
  chartInstance->c3_temp = c3_i_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c3_u, 4)), "temp");
  *c3_E_Alarm = c3_i_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c3_u, 5)), "E_Alarm");
  *c3_E_NotReady = c3_i_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c3_u, 6)), "E_NotReady");
  *c3_E_Ready = c3_i_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c3_u, 7)), "E_Ready");
  *c3_E_Warning = c3_i_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c3_u, 8)), "E_Warning");
  chartInstance->c3_E_AlarmEventCounter = c3_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 9)), "E_AlarmEventCounter");
  chartInstance->c3_E_NotReadyEventCounter = c3_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 10)), "E_NotReadyEventCounter");
  chartInstance->c3_E_ReadyEventCounter = c3_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 11)), "E_ReadyEventCounter");
  chartInstance->c3_E_WarningEventCounter = c3_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 12)), "E_WarningEventCounter");
  chartInstance->c3_is_active_c3_GPCA_Extension = c3_e_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c3_u, 13)),
     "is_active_c3_GPCA_Extension");
  chartInstance->c3_is_active_WRN = c3_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 14)), "is_active_WRN");
  chartInstance->c3_is_active_Controller = c3_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 15)), "is_active_Controller");
  chartInstance->c3_is_active_LTwo = c3_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 16)), "is_active_LTwo");
  chartInstance->c3_is_active_LOne = c3_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 17)), "is_active_LOne");
  chartInstance->c3_is_active_CheckReady = c3_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 18)), "is_active_CheckReady");
  chartInstance->c3_is_c3_GPCA_Extension = c3_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 19)), "is_c3_GPCA_Extension");
  chartInstance->c3_is_WRN = c3_e_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c3_u, 20)), "is_WRN");
  chartInstance->c3_is_Controller = c3_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 21)), "is_Controller");
  chartInstance->c3_is_LTwo = c3_e_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c3_u, 22)), "is_LTwo");
  chartInstance->c3_is_LOne = c3_e_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c3_u, 23)), "is_LOne");
  chartInstance->c3_is_CheckReady = c3_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c3_u, 24)), "is_CheckReady");
  sf_mex_assign(&chartInstance->c3_setSimStateSideEffectsInfo,
                c3_k_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c3_u, 25)), "setSimStateSideEffectsInfo"), TRUE);
  sf_mex_destroy(&c3_u);
  chartInstance->c3_doSetSimStateSideEffects = 1U;
  c3_update_debugger_state_c3_GPCA_Extension(chartInstance);
  sf_mex_destroy(&c3_st);
}

static void c3_set_sim_state_side_effects_c3_GPCA_Extension
  (SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  if (chartInstance->c3_doSetSimStateSideEffects != 0) {
    if (chartInstance->c3_is_c3_GPCA_Extension == c3_IN_AlarmingMachine) {
      chartInstance->c3_tp_AlarmingMachine = 1U;
    } else {
      chartInstance->c3_tp_AlarmingMachine = 0U;
    }

    if (chartInstance->c3_is_active_Controller == 1) {
      chartInstance->c3_tp_Controller = 1U;
    } else {
      chartInstance->c3_tp_Controller = 0U;
    }

    if (chartInstance->c3_is_Controller == c3_IN_CheckLOne) {
      chartInstance->c3_tp_CheckLOne = 1U;
    } else {
      chartInstance->c3_tp_CheckLOne = 0U;
    }

    if (chartInstance->c3_is_Controller == c3_IN_CheckLTwo) {
      chartInstance->c3_tp_CheckLTwo = 1U;
    } else {
      chartInstance->c3_tp_CheckLTwo = 0U;
    }

    if (chartInstance->c3_is_Controller == c3_IN_CheckWRN) {
      chartInstance->c3_tp_CheckWRN = 1U;
    } else {
      chartInstance->c3_tp_CheckWRN = 0U;
    }

    if (chartInstance->c3_is_Controller == c3_IN_START) {
      chartInstance->c3_tp_START = 1U;
    } else {
      chartInstance->c3_tp_START = 0U;
    }

    if (chartInstance->c3_is_Controller == c3_IN_SinkOne) {
      chartInstance->c3_tp_SinkOne = 1U;
    } else {
      chartInstance->c3_tp_SinkOne = 0U;
    }

    if (chartInstance->c3_is_Controller == c3_IN_SinkTWO) {
      chartInstance->c3_tp_SinkTWO = 1U;
    } else {
      chartInstance->c3_tp_SinkTWO = 0U;
    }

    if (chartInstance->c3_is_Controller == c3_IN_SinkTWOCheckOne) {
      chartInstance->c3_tp_SinkTWOCheckOne = 1U;
    } else {
      chartInstance->c3_tp_SinkTWOCheckOne = 0U;
    }

    if (chartInstance->c3_is_active_CheckReady == 1) {
      chartInstance->c3_tp_CheckReady = 1U;
    } else {
      chartInstance->c3_tp_CheckReady = 0U;
    }

    if (chartInstance->c3_is_CheckReady == c3_IN_Checking) {
      chartInstance->c3_tp_Checking = 1U;
    } else {
      chartInstance->c3_tp_Checking = 0U;
    }

    if (chartInstance->c3_is_CheckReady == c3_b_IN_Normal) {
      chartInstance->c3_b_tp_Normal = 1U;
    } else {
      chartInstance->c3_b_tp_Normal = 0U;
    }

    if (chartInstance->c3_is_CheckReady == c3_IN_s1) {
      chartInstance->c3_tp_s1 = 1U;
    } else {
      chartInstance->c3_tp_s1 = 0U;
    }

    if (chartInstance->c3_is_CheckReady == c3_IN_s2) {
      chartInstance->c3_tp_s2 = 1U;
    } else {
      chartInstance->c3_tp_s2 = 0U;
    }

    if (chartInstance->c3_is_active_LOne == 1) {
      chartInstance->c3_tp_LOne = 1U;
    } else {
      chartInstance->c3_tp_LOne = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_IN_BatteryDepletionCheck) {
      chartInstance->c3_tp_BatteryDepletionCheck = 1U;
    } else {
      chartInstance->c3_tp_BatteryDepletionCheck = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_IN_CPUCheck) {
      chartInstance->c3_tp_CPUCheck = 1U;
    } else {
      chartInstance->c3_tp_CPUCheck = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_IN_HOLD) {
      chartInstance->c3_tp_HOLD = 1U;
    } else {
      chartInstance->c3_tp_HOLD = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_IN_L1Sink) {
      chartInstance->c3_tp_L1Sink = 1U;
    } else {
      chartInstance->c3_tp_L1Sink = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_IN_MemoryCheck) {
      chartInstance->c3_tp_MemoryCheck = 1U;
    } else {
      chartInstance->c3_tp_MemoryCheck = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_c_IN_Normal) {
      chartInstance->c3_c_tp_Normal = 1U;
    } else {
      chartInstance->c3_c_tp_Normal = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_IN_PumpTempCheck) {
      chartInstance->c3_tp_PumpTempCheck = 1U;
    } else {
      chartInstance->c3_tp_PumpTempCheck = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_IN_RTCCheck) {
      chartInstance->c3_tp_RTCCheck = 1U;
    } else {
      chartInstance->c3_tp_RTCCheck = 0U;
    }

    if (chartInstance->c3_is_LOne == c3_IN_WatchdogCheck) {
      chartInstance->c3_tp_WatchdogCheck = 1U;
    } else {
      chartInstance->c3_tp_WatchdogCheck = 0U;
    }

    if (chartInstance->c3_is_active_LTwo == 1) {
      chartInstance->c3_tp_LTwo = 1U;
    } else {
      chartInstance->c3_tp_LTwo = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_AirInLineCheck) {
      chartInstance->c3_tp_AirInLineCheck = 1U;
    } else {
      chartInstance->c3_tp_AirInLineCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_DoorOpenCheck) {
      chartInstance->c3_tp_DoorOpenCheck = 1U;
    } else {
      chartInstance->c3_tp_DoorOpenCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_HighInfusionRateCheck) {
      chartInstance->c3_tp_HighInfusionRateCheck = 1U;
    } else {
      chartInstance->c3_tp_HighInfusionRateCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Hold) {
      chartInstance->c3_tp_Hold = 1U;
    } else {
      chartInstance->c3_tp_Hold = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_InfusionPauseDurationCheck) {
      chartInstance->c3_tp_InfusionPauseDurationCheck = 1U;
    } else {
      chartInstance->c3_tp_InfusionPauseDurationCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_LowInfusionRateCheck) {
      chartInstance->c3_tp_LowInfusionRateCheck = 1U;
    } else {
      chartInstance->c3_tp_LowInfusionRateCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Normal) {
      chartInstance->c3_tp_Normal = 1U;
    } else {
      chartInstance->c3_tp_Normal = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_OcculusionCheck) {
      chartInstance->c3_tp_OcculusionCheck = 1U;
    } else {
      chartInstance->c3_tp_OcculusionCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_RateLessThanKVOCheck) {
      chartInstance->c3_tp_RateLessThanKVOCheck = 1U;
    } else {
      chartInstance->c3_tp_RateLessThanKVOCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_RateOverPumpCapacityCheck) {
      chartInstance->c3_tp_RateOverPumpCapacityCheck = 1U;
    } else {
      chartInstance->c3_tp_RateOverPumpCapacityCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_ReservoirEmptyCheck) {
      chartInstance->c3_tp_ReservoirEmptyCheck = 1U;
    } else {
      chartInstance->c3_tp_ReservoirEmptyCheck = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink21) {
      chartInstance->c3_tp_Sink21 = 1U;
    } else {
      chartInstance->c3_tp_Sink21 = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink22) {
      chartInstance->c3_tp_Sink22 = 1U;
    } else {
      chartInstance->c3_tp_Sink22 = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink23) {
      chartInstance->c3_tp_Sink23 = 1U;
    } else {
      chartInstance->c3_tp_Sink23 = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink24) {
      chartInstance->c3_tp_Sink24 = 1U;
    } else {
      chartInstance->c3_tp_Sink24 = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink25) {
      chartInstance->c3_tp_Sink25 = 1U;
    } else {
      chartInstance->c3_tp_Sink25 = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink26) {
      chartInstance->c3_tp_Sink26 = 1U;
    } else {
      chartInstance->c3_tp_Sink26 = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink27) {
      chartInstance->c3_tp_Sink27 = 1U;
    } else {
      chartInstance->c3_tp_Sink27 = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink28) {
      chartInstance->c3_tp_Sink28 = 1U;
    } else {
      chartInstance->c3_tp_Sink28 = 0U;
    }

    if (chartInstance->c3_is_LTwo == c3_IN_Sink29) {
      chartInstance->c3_tp_Sink29 = 1U;
    } else {
      chartInstance->c3_tp_Sink29 = 0U;
    }

    if (chartInstance->c3_is_active_WRN == 1) {
      chartInstance->c3_tp_WRN = 1U;
    } else {
      chartInstance->c3_tp_WRN = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_APErrCheck) {
      chartInstance->c3_tp_APErrCheck = 1U;
    } else {
      chartInstance->c3_tp_APErrCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_BatteryChargingCheck) {
      chartInstance->c3_tp_BatteryChargingCheck = 1U;
    } else {
      chartInstance->c3_tp_BatteryChargingCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_EndState) {
      chartInstance->c3_tp_EndState = 1U;
    } else {
      chartInstance->c3_tp_EndState = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_EnvTempCheck) {
      chartInstance->c3_tp_EnvTempCheck = 1U;
    } else {
      chartInstance->c3_tp_EnvTempCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_FlowRateStabilityCheck) {
      chartInstance->c3_tp_FlowRateStabilityCheck = 1U;
    } else {
      chartInstance->c3_tp_FlowRateStabilityCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_HoldOn) {
      chartInstance->c3_tp_HoldOn = 1U;
    } else {
      chartInstance->c3_tp_HoldOn = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_HumidityCheck) {
      chartInstance->c3_tp_HumidityCheck = 1U;
    } else {
      chartInstance->c3_tp_HumidityCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_InfusionPausedDurationCheck) {
      chartInstance->c3_tp_InfusionPausedDurationCheck = 1U;
    } else {
      chartInstance->c3_tp_InfusionPausedDurationCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_LoggingCheck) {
      chartInstance->c3_tp_LoggingCheck = 1U;
    } else {
      chartInstance->c3_tp_LoggingCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_LowBatteryCheck) {
      chartInstance->c3_tp_LowBatteryCheck = 1U;
    } else {
      chartInstance->c3_tp_LowBatteryCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_LowReservoirCheck) {
      chartInstance->c3_tp_LowReservoirCheck = 1U;
    } else {
      chartInstance->c3_tp_LowReservoirCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_b_IN_PumpTempCheck) {
      chartInstance->c3_b_tp_PumpTempCheck = 1U;
    } else {
      chartInstance->c3_b_tp_PumpTempCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_VoltageCheck) {
      chartInstance->c3_tp_VoltageCheck = 1U;
    } else {
      chartInstance->c3_tp_VoltageCheck = 0U;
    }

    if (chartInstance->c3_is_WRN == c3_IN_WNStart) {
      chartInstance->c3_tp_WNStart = 1U;
    } else {
      chartInstance->c3_tp_WNStart = 0U;
    }

    chartInstance->c3_doSetSimStateSideEffects = 0U;
  }
}

static void finalize_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  sf_mex_destroy(&chartInstance->c3_setSimStateSideEffectsInfo);
}

static void sf_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  int32_T c3_inputEventFiredFlag;
  uint32_T *c3_ClearCond;
  boolean_T *c3_infusionInProgress;
  real_T *c3_ErrCond;
  boolean_T *c3_infusionPaused;
  int8_T *c3_E_Restart;
  int8_T *c3_E_AlarmClear;
  int8_T *c3_E_RequestToStart;
  int8_T *c3_E_Clock;
  boolean_T *c3_E_Alarm;
  boolean_T *c3_E_Warning;
  boolean_T *c3_E_Ready;
  boolean_T *c3_E_NotReady;
  c3_E_NotReady = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c3_E_Ready = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c3_E_Warning = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c3_E_Alarm = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c3_E_Clock = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 6) + 3);
  c3_E_RequestToStart = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 6)
    + 2);
  c3_E_AlarmClear = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 6) +
    1);
  c3_E_Restart = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 6) + 0);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  c3_ClearCond = (uint32_T *)ssGetInputPortSignal(chartInstance->S, 0);
  c3_set_sim_state_side_effects_c3_GPCA_Extension(chartInstance);
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
  _SFD_CC_CALL(CHART_ENTER_SFUNCTION_TAG, 2U, chartInstance->c3_sfEvent);
  _SFD_DATA_RANGE_CHECK((real_T)*c3_ClearCond, 0U);
  _SFD_DATA_RANGE_CHECK((real_T)*c3_infusionInProgress, 1U);
  _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
  _SFD_DATA_RANGE_CHECK((real_T)*c3_infusionPaused, 3U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_MSG_BLANK, 8U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_temp, 11U);
  c3_inputEventFiredFlag = 0;
  if (*c3_E_Restart == 1) {
    c3_inputEventFiredFlag = 1;
    chartInstance->c3_sfEvent = c3_event_E_Restart;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_Restart,
                 chartInstance->c3_sfEvent);
    c3_c3_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_Restart,
                 chartInstance->c3_sfEvent);
  }

  if (*c3_E_AlarmClear == 1) {
    c3_inputEventFiredFlag = 1;
    chartInstance->c3_sfEvent = c3_event_E_AlarmClear;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_AlarmClear,
                 chartInstance->c3_sfEvent);
    c3_c3_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_AlarmClear,
                 chartInstance->c3_sfEvent);
  }

  if (*c3_E_RequestToStart != 0) {
    c3_inputEventFiredFlag = 1;
    chartInstance->c3_sfEvent = c3_event_E_RequestToStart;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_RequestToStart,
                 chartInstance->c3_sfEvent);
    c3_c3_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_RequestToStart,
                 chartInstance->c3_sfEvent);
  }

  if (*c3_E_Clock == 1) {
    c3_inputEventFiredFlag = 1;
    chartInstance->c3_sfEvent = c3_event_E_Clock;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_Clock,
                 chartInstance->c3_sfEvent);
    c3_c3_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_Clock,
                 chartInstance->c3_sfEvent);
  }

  if (c3_inputEventFiredFlag != 0) {
    if (chartInstance->c3_E_AlarmEventCounter > 0U) {
      *c3_E_Alarm = !*c3_E_Alarm;
      chartInstance->c3_E_AlarmEventCounter--;
    }
  }

  if (c3_inputEventFiredFlag != 0) {
    if (chartInstance->c3_E_WarningEventCounter > 0U) {
      *c3_E_Warning = !*c3_E_Warning;
      chartInstance->c3_E_WarningEventCounter--;
    }
  }

  if (c3_inputEventFiredFlag != 0) {
    if (chartInstance->c3_E_ReadyEventCounter > 0U) {
      *c3_E_Ready = !*c3_E_Ready;
      chartInstance->c3_E_ReadyEventCounter--;
    }
  }

  if (c3_inputEventFiredFlag != 0) {
    if (chartInstance->c3_E_NotReadyEventCounter > 0U) {
      *c3_E_NotReady = !*c3_E_NotReady;
      chartInstance->c3_E_NotReadyEventCounter--;
    }
  }

  sf_debug_check_for_state_inconsistency(_GPCA_ExtensionMachineNumber_,
    chartInstance->chartNumber, chartInstance->instanceNumber);
}

static void c3_c3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  _SFD_CC_CALL(CHART_ENTER_DURING_FUNCTION_TAG, 2U, chartInstance->c3_sfEvent);
  if (chartInstance->c3_is_active_c3_GPCA_Extension == 0) {
    _SFD_CC_CALL(CHART_ENTER_ENTRY_FUNCTION_TAG, 2U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_active_c3_GPCA_Extension = 1U;
    _SFD_CC_CALL(EXIT_OUT_OF_FUNCTION_TAG, 2U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 78U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 78U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_c3_GPCA_Extension = c3_IN_AlarmingMachine;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_AlarmingMachine = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 57U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 57U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_active_Controller = 1U;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 6U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Controller = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 98U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 98U, chartInstance->c3_sfEvent);
    if (chartInstance->c3_is_Controller == c3_IN_START) {
    } else {
      chartInstance->c3_is_Controller = c3_IN_START;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 10U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_START = 1U;
      c3_initiate(chartInstance);
    }

    chartInstance->c3_is_active_CheckReady = 1U;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 1U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_CheckReady = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 138U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 138U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_CheckReady = c3_b_IN_Normal;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
    chartInstance->c3_b_tp_Normal = 1U;
    chartInstance->c3_is_active_LOne = 1U;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 14U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_LOne = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 62U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 62U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LOne = c3_c_IN_Normal;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c3_sfEvent);
    chartInstance->c3_c_tp_Normal = 1U;
    chartInstance->c3_is_active_LTwo = 1U;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_LTwo = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 104U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 104U, chartInstance->c3_sfEvent);
    if (chartInstance->c3_is_LTwo == c3_IN_Normal) {
    } else {
      chartInstance->c3_is_LTwo = c3_IN_Normal;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 31U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Normal = 1U;
      chartInstance->c3_LTwoCond = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
    }

    chartInstance->c3_is_active_WRN = 1U;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 45U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_WRN = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 19U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 19U, chartInstance->c3_sfEvent);
    if (chartInstance->c3_is_WRN == c3_IN_WNStart) {
    } else {
      chartInstance->c3_is_WRN = c3_IN_WNStart;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 59U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_WNStart = 1U;
      chartInstance->c3_WnCond = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
    }
  } else if (chartInstance->c3_is_c3_GPCA_Extension != c3_IN_AlarmingMachine) {
  } else {
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 0U, chartInstance->c3_sfEvent);
    if (chartInstance->c3_is_active_Controller == 0) {
    } else {
      c3_Controller(chartInstance);
    }

    if (chartInstance->c3_is_active_CheckReady == 0) {
    } else {
      c3_CheckReady(chartInstance);
    }

    if (chartInstance->c3_is_active_LOne == 0) {
    } else {
      c3_LOne(chartInstance);
    }

    if (chartInstance->c3_is_active_LTwo == 0) {
    } else {
      c3_LTwo(chartInstance);
    }

    if (chartInstance->c3_is_active_WRN == 0) {
    } else {
      c3_WRN(chartInstance);
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 0U, chartInstance->c3_sfEvent);
  }

  _SFD_CC_CALL(EXIT_OUT_OF_FUNCTION_TAG, 2U, chartInstance->c3_sfEvent);
}

static void initSimStructsc3_GPCA_Extension(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
}

static void c3_HumidityCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  c3_EnvironmentSensorSignals *c3_envSenData;
  c3_envSenData = (c3_EnvironmentSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 3);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 52U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 198U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(198U, (int32_T)_SFD_CCP_CALL(198U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 198U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 17U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 197U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 197U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 2U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 0U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 0U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 190U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 190U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 189U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 189U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HumidityCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 52U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 202U,
                 chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(202U, (int32_T)_SFD_CCP_CALL(202U, 0,
      (int16_T)*(boolean_T *)((char_T *)c3_envSenData + 1) == 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 202;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_envSenData + 1) > 0);
        if (c3_c_out) {
          transitionList[numTransitions] = 199;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 202U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 25U);
      chartInstance->c3_tp_HumidityCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 52U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_APErrCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_APErrCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 199U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(199U, (int32_T)_SFD_CCP_CALL(199U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_envSenData + 1) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 199U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 167U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 167U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 25U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_IN_HumidityCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 167U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_IN_HumidityCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 167U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_HumidityCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 52U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_IN_APErrCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_APErrCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 52U, chartInstance->c3_sfEvent);
}

static void c3_LowBatteryCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 55U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 14U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(14U, (int32_T)_SFD_CCP_CALL(14U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 14U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 189U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 189U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_LowBatteryCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 55U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 3U, chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(3U, (int32_T)_SFD_CCP_CALL(3U, 0, (int16_T)
      *(boolean_T *)((char_T *)c3_hardwareSenData + 4) == 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 3;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 4) >
                    0);
        if (c3_c_out) {
          transitionList[numTransitions] = 177;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 20U);
      chartInstance->c3_tp_LowBatteryCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 55U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_BatteryChargingCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 47U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_BatteryChargingCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 177U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(177U, (int32_T)_SFD_CCP_CALL(177U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 4) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 177U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 176U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 176U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 20U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_IN_LowBatteryCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 176U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_IN_LowBatteryCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 176U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_LowBatteryCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 55U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_IN_BatteryChargingCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 47U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_BatteryChargingCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 55U, chartInstance->c3_sfEvent);
}

static void c3_LoggingCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 54U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 13U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(13U, (int32_T)_SFD_CCP_CALL(13U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 13U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_LoggingCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 54U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 5U, chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(5U, (int32_T)_SFD_CCP_CALL(5U, 0, (int16_T)
      *(boolean_T *)((char_T *)c3_hardwareSenData + 0) == 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 5;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 0) >
                    0);
        if (c3_c_out) {
          transitionList[numTransitions] = 193;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 5U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 19U);
      chartInstance->c3_tp_LoggingCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 54U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_LowBatteryCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 55U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_LowBatteryCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 193U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(193U, (int32_T)_SFD_CCP_CALL(193U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 0) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 193U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 86U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 86U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 19U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_IN_LoggingCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 86U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_IN_LoggingCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 86U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_LoggingCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 54U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_IN_LowBatteryCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 55U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_LowBatteryCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 54U, chartInstance->c3_sfEvent);
}

static void c3_InfusionPausedDurationCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_temp;
  boolean_T c3_e_temp;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  boolean_T *c3_infusionInProgress;
  boolean_T *c3_infusionPaused;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 53U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 11U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(11U, (int32_T)_SFD_CCP_CALL(11U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 11U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_InfusionPausedDurationCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 53U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 164U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(164U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 8) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(164U, 1, (int16_T)*c3_infusionInProgress == 0
        != 0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_c_temp = c3_b_temp;
    if (!c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(164U, 2, (int16_T)*c3_infusionPaused == 0 != 0U,
        chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(164U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 164;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 8) > 0) &&
                    ((int16_T)*c3_infusionInProgress > 0) && ((int16_T)
          *c3_infusionPaused == 1));
        if (c3_c_out) {
          transitionList[numTransitions] = 191;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 164U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 18U);
      chartInstance->c3_tp_InfusionPausedDurationCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 53U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_LoggingCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 54U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_LoggingCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 191U,
                   chartInstance->c3_sfEvent);
      c3_d_temp = (_SFD_CCP_CALL(191U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 8) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (c3_d_temp) {
        c3_d_temp = (_SFD_CCP_CALL(191U, 1, (int16_T)*c3_infusionInProgress > 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_e_temp = c3_d_temp;
      if (c3_e_temp) {
        c3_e_temp = (_SFD_CCP_CALL(191U, 2, (int16_T)*c3_infusionPaused == 1 !=
          0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(191U, (int32_T)c3_e_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 191U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 192U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 192U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 18U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_IN_InfusionPausedDurationCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 192U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_IN_InfusionPausedDurationCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 192U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_InfusionPausedDurationCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 53U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_IN_LoggingCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 54U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_LoggingCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 53U, chartInstance->c3_sfEvent);
}

static void c3_EndState(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  int32_T c3_previousEvent;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 48U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 16U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(16U, (int32_T)_SFD_CCP_CALL(16U, 0,
              chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
    c3_previousEvent = chartInstance->c3_sfEvent;
    chartInstance->c3_sfEvent = c3_event_E_DoneThree;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_DoneThree,
                 chartInstance->c3_sfEvent);
    if (chartInstance->c3_is_active_Controller == 0) {
    } else {
      c3_Controller(chartInstance);
    }

    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_DoneThree,
                 chartInstance->c3_sfEvent);
    chartInstance->c3_sfEvent = c3_previousEvent;
    if (chartInstance->c3_is_WRN != c3_IN_EndState) {
      _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
    }

    if (chartInstance->c3_is_WRN != c3_IN_EndState) {
      _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
    } else {
      chartInstance->c3_tp_EndState = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 48U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_WNStart;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 59U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_WNStart = 1U;
      chartInstance->c3_WnCond = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 48U, chartInstance->c3_sfEvent);
}

static void c3_WNStart(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 59U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 20U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(20U, (int32_T)_SFD_CCP_CALL(20U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 20U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_WNStart = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 59U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 59U, chartInstance->c3_sfEvent);
}

static void c3_LowReservoirCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_c_temp;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 56U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 10U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(10U, (int32_T)_SFD_CCP_CALL(10U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 10U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_LowReservoirCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 56U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 12U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(12U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 1) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(12U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(12U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 12;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 1) > 0) &&
                    ((int16_T)*c3_infusionInProgress > 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 8;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 12U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 17U);
      chartInstance->c3_tp_LowReservoirCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 56U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_InfusionPausedDurationCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 53U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_InfusionPausedDurationCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 8U,
                   chartInstance->c3_sfEvent);
      c3_c_temp = (_SFD_CCP_CALL(8U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 1) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (c3_c_temp) {
        c3_c_temp = (_SFD_CCP_CALL(8U, 1, (int16_T)*c3_infusionInProgress > 0 !=
          0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(8U, (int32_T)c3_c_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 8U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 163U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 163U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 17U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_IN_LowReservoirCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 163U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_IN_LowReservoirCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 163U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_LowReservoirCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 56U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_IN_InfusionPausedDurationCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 53U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_InfusionPausedDurationCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 56U, chartInstance->c3_sfEvent);
}

static void c3_SinkTWOCheckOne(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  boolean_T c3_e_out;
  boolean_T c3_b_temp;
  boolean_T c3_f_out;
  int32_T c3_previousEvent;
  real_T *c3_ErrCond;
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 13U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 136U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(136U, (int32_T)_SFD_CCP_CALL(136U, 0,
              chartInstance->c3_sfEvent == c3_event_E_LevelOneAlarm != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 136;
      sf_debug_transition_conflict_check_begin();
      c3_b_out = (chartInstance->c3_sfEvent == c3_event_E_DoneOne);
      if (c3_b_out) {
        transitionList[numTransitions] = 115;
        numTransitions++;
      }

      c3_c_out = ((chartInstance->c3_sfEvent == c3_event_E_Restart) ||
                  (chartInstance->c3_sfEvent == c3_event_E_AlarmClear));
      if (c3_c_out) {
        transitionList[numTransitions] = 135;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 136U, chartInstance->c3_sfEvent);
    *c3_ErrCond = (real_T)chartInstance->c3_LOneCond;
    _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
    chartInstance->c3_tp_SinkTWOCheckOne = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 13U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_Controller = c3_IN_SinkOne;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 11U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_SinkOne = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 115U,
                 chartInstance->c3_sfEvent);
    c3_d_out = (CV_TRANSITION_EVAL(115U, (int32_T)_SFD_CCP_CALL(115U, 0,
      chartInstance->c3_sfEvent == c3_event_E_DoneOne != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 115;
        sf_debug_transition_conflict_check_begin();
        c3_e_out = ((chartInstance->c3_sfEvent == c3_event_E_Restart) ||
                    (chartInstance->c3_sfEvent == c3_event_E_AlarmClear));
        if (c3_e_out) {
          transitionList[numTransitions] = 135;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 115U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_SinkTWOCheckOne = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 13U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_Controller = c3_IN_SinkTWO;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 12U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_SinkTWO = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 135U,
                   chartInstance->c3_sfEvent);
      c3_b_temp = (_SFD_CCP_CALL(135U, 0, chartInstance->c3_sfEvent ==
        c3_event_E_Restart != 0U, chartInstance->c3_sfEvent) != 0);
      if (!c3_b_temp) {
        c3_b_temp = (_SFD_CCP_CALL(135U, 1, chartInstance->c3_sfEvent ==
          c3_event_E_AlarmClear != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_f_out = (CV_TRANSITION_EVAL(135U, (int32_T)c3_b_temp) != 0);
      if (c3_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 135U, chartInstance->c3_sfEvent);
        *c3_ErrCond = (real_T)chartInstance->c3_LOneCond;
        _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_ResetOne;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_LOne == 0) {
        } else {
          c3_LOne(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_Controller != c3_IN_SinkTWOCheckOne) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 135U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_Controller != c3_IN_SinkTWOCheckOne) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 135U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_SinkTWOCheckOne = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 13U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_Controller = c3_IN_CheckLOne;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_CheckLOne = 1U;
          c3_initiate(chartInstance);
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 13U, chartInstance->c3_sfEvent);
}

static void c3_START(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  int32_T c3_previousEvent;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 10U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 87U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(87U, (int32_T)_SFD_CCP_CALL(87U, 0,
              chartInstance->c3_sfEvent == c3_event_E_Restart != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 87U, chartInstance->c3_sfEvent);
    c3_previousEvent = chartInstance->c3_sfEvent;
    chartInstance->c3_sfEvent = c3_event_E_ResetOne;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                 chartInstance->c3_sfEvent);
    if (chartInstance->c3_is_active_LOne == 0) {
    } else {
      c3_LOne(chartInstance);
    }

    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                 chartInstance->c3_sfEvent);
    chartInstance->c3_sfEvent = c3_previousEvent;
    if (chartInstance->c3_is_Controller != c3_IN_START) {
      _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 87U, chartInstance->c3_sfEvent);
    }

    if (chartInstance->c3_is_Controller != c3_IN_START) {
      _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 87U, chartInstance->c3_sfEvent);
    } else {
      chartInstance->c3_tp_START = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 10U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_Controller = c3_IN_CheckLOne;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_CheckLOne = 1U;
      c3_initiate(chartInstance);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 10U, chartInstance->c3_sfEvent);
}

static void c3_WRN(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  boolean_T c3_e_out;
  int32_T c3_b_previousEvent;
  boolean_T c3_f_out;
  boolean_T c3_g_out;
  boolean_T c3_h_out;
  boolean_T c3_i_out;
  int32_T c3_c_previousEvent;
  boolean_T c3_j_out;
  c3_EnvironmentSensorSignals *c3_envSenData;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  boolean_T guard1 = FALSE;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  c3_envSenData = (c3_EnvironmentSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 3);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 45U, chartInstance->c3_sfEvent);
  switch (chartInstance->c3_is_WRN) {
   case c3_IN_APErrCheck:
    CV_STATE_EVAL(45, 0, 1);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 46U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 201U,
                 chartInstance->c3_sfEvent);
    c3_out = (CV_TRANSITION_EVAL(201U, (int32_T)_SFD_CCP_CALL(201U, 0,
                chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
                chartInstance->c3_sfEvent)) != 0);
    if (c3_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 201U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 203U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 203U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 17U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 197U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 197U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 2U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 0U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 0U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 190U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 190U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 189U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 189U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_APErrCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_HoldOn;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_HoldOn = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 200U,
                   chartInstance->c3_sfEvent);
      c3_b_out = (CV_TRANSITION_EVAL(200U, (int32_T)_SFD_CCP_CALL(200U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_envSenData + 2) == 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      guard1 = FALSE;
      if (c3_b_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 200;
          sf_debug_transition_conflict_check_begin();
          c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_envSenData + 2) > 0);
          if (c3_c_out) {
            transitionList[numTransitions] = 207;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 200U, chartInstance->c3_sfEvent);
        c3_clearWarning(chartInstance, 26U);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 168U,
                     chartInstance->c3_sfEvent);
        c3_d_out = (CV_TRANSITION_EVAL(168U, (int32_T)_SFD_CCP_CALL(168U, 0,
          chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_d_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 168U, chartInstance->c3_sfEvent);
          c3_previousEvent = chartInstance->c3_sfEvent;
          chartInstance->c3_sfEvent = c3_event_E_DoneThree;
          _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_DoneThree,
                       chartInstance->c3_sfEvent);
          if (chartInstance->c3_is_active_Controller == 0) {
          } else {
            c3_Controller(chartInstance);
          }

          _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_DoneThree,
                       chartInstance->c3_sfEvent);
          chartInstance->c3_sfEvent = c3_previousEvent;
          if (chartInstance->c3_is_WRN != c3_IN_APErrCheck) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 168U,
                         chartInstance->c3_sfEvent);
          }

          if (chartInstance->c3_is_WRN != c3_IN_APErrCheck) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 168U,
                         chartInstance->c3_sfEvent);
          } else {
            chartInstance->c3_tp_APErrCheck = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
            chartInstance->c3_is_WRN = c3_IN_WNStart;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 59U, chartInstance->c3_sfEvent);
            chartInstance->c3_tp_WNStart = 1U;
            chartInstance->c3_WnCond = 0U;
            _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
          }
        } else {
          guard1 = TRUE;
        }
      } else {
        guard1 = TRUE;
      }

      if (guard1 == TRUE) {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 207U,
                     chartInstance->c3_sfEvent);
        c3_e_out = (CV_TRANSITION_EVAL(207U, (int32_T)_SFD_CCP_CALL(207U, 0,
          (int16_T)*(boolean_T *)((char_T *)c3_envSenData + 2) > 0 != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_e_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 207U, chartInstance->c3_sfEvent);
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 208U,
                       chartInstance->c3_sfEvent);
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 208U, chartInstance->c3_sfEvent);
          chartInstance->c3_WnCond = 26U;
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
          c3_b_previousEvent = chartInstance->c3_sfEvent;
          chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
          _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                       chartInstance->c3_sfEvent);
          if (chartInstance->c3_is_active_Controller == 0) {
          } else {
            c3_Controller(chartInstance);
          }

          _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                       chartInstance->c3_sfEvent);
          chartInstance->c3_sfEvent = c3_b_previousEvent;
          if (chartInstance->c3_is_WRN != c3_IN_APErrCheck) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 208U,
                         chartInstance->c3_sfEvent);
          }

          if (chartInstance->c3_is_WRN != c3_IN_APErrCheck) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 208U,
                         chartInstance->c3_sfEvent);
          } else {
            chartInstance->c3_tp_APErrCheck = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
            chartInstance->c3_is_WRN = c3_IN_EndState;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 48U, chartInstance->c3_sfEvent);
            chartInstance->c3_tp_EndState = 1U;
          }
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 46U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_BatteryChargingCheck:
    CV_STATE_EVAL(45, 0, 2);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 47U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 15U,
                 chartInstance->c3_sfEvent);
    c3_f_out = (CV_TRANSITION_EVAL(15U, (int32_T)_SFD_CCP_CALL(15U, 0,
      chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_f_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 15U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 190U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 190U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 189U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 189U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_BatteryChargingCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 47U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_HoldOn;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_HoldOn = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 1U,
                   chartInstance->c3_sfEvent);
      c3_g_out = (CV_TRANSITION_EVAL(1U, (int32_T)_SFD_CCP_CALL(1U, 0, (int16_T)*
                    (boolean_T *)((char_T *)c3_hardwareSenData + 5) == 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_g_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 1;
          sf_debug_transition_conflict_check_begin();
          c3_h_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 5) >
                      0);
          if (c3_h_out) {
            transitionList[numTransitions] = 175;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 1U, chartInstance->c3_sfEvent);
        c3_clearWarning(chartInstance, 21U);
        chartInstance->c3_tp_BatteryChargingCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 47U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_WRN = c3_IN_VoltageCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 58U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_VoltageCheck = 1U;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 175U,
                     chartInstance->c3_sfEvent);
        c3_i_out = (CV_TRANSITION_EVAL(175U, (int32_T)_SFD_CCP_CALL(175U, 0,
          (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 5) > 0 != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_i_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 175U, chartInstance->c3_sfEvent);
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 9U,
                       chartInstance->c3_sfEvent);
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
          chartInstance->c3_WnCond = 21U;
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
          c3_c_previousEvent = chartInstance->c3_sfEvent;
          chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
          _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                       chartInstance->c3_sfEvent);
          if (chartInstance->c3_is_active_Controller == 0) {
          } else {
            c3_Controller(chartInstance);
          }

          _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                       chartInstance->c3_sfEvent);
          chartInstance->c3_sfEvent = c3_c_previousEvent;
          if (chartInstance->c3_is_WRN != c3_IN_BatteryChargingCheck) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
          }

          if (chartInstance->c3_is_WRN != c3_IN_BatteryChargingCheck) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
          } else {
            chartInstance->c3_tp_BatteryChargingCheck = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 47U, chartInstance->c3_sfEvent);
            chartInstance->c3_is_WRN = c3_IN_VoltageCheck;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 58U, chartInstance->c3_sfEvent);
            chartInstance->c3_tp_VoltageCheck = 1U;
          }
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 47U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_EndState:
    CV_STATE_EVAL(45, 0, 3);
    c3_EndState(chartInstance);
    break;

   case c3_IN_EnvTempCheck:
    CV_STATE_EVAL(45, 0, 4);
    c3_EnvTempCheck(chartInstance);
    break;

   case c3_IN_FlowRateStabilityCheck:
    CV_STATE_EVAL(45, 0, 5);
    c3_FlowRateStabilityCheck(chartInstance);
    break;

   case c3_IN_HoldOn:
    CV_STATE_EVAL(45, 0, 6);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 51U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 50U,
                 chartInstance->c3_sfEvent);
    c3_j_out = (CV_TRANSITION_EVAL(50U, (int32_T)_SFD_CCP_CALL(50U, 0,
      chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_j_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 50U, chartInstance->c3_sfEvent);
      chartInstance->c3_WnCond = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
      chartInstance->c3_tp_HoldOn = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_FlowRateStabilityCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 50U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_FlowRateStabilityCheck = 1U;
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 51U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_HumidityCheck:
    CV_STATE_EVAL(45, 0, 7);
    c3_HumidityCheck(chartInstance);
    break;

   case c3_IN_InfusionPausedDurationCheck:
    CV_STATE_EVAL(45, 0, 8);
    c3_InfusionPausedDurationCheck(chartInstance);
    break;

   case c3_IN_LoggingCheck:
    CV_STATE_EVAL(45, 0, 9);
    c3_LoggingCheck(chartInstance);
    break;

   case c3_IN_LowBatteryCheck:
    CV_STATE_EVAL(45, 0, 10);
    c3_LowBatteryCheck(chartInstance);
    break;

   case c3_IN_LowReservoirCheck:
    CV_STATE_EVAL(45, 0, 11);
    c3_LowReservoirCheck(chartInstance);
    break;

   case c3_b_IN_PumpTempCheck:
    CV_STATE_EVAL(45, 0, 12);
    c3_b_PumpTempCheck(chartInstance);
    break;

   case c3_IN_VoltageCheck:
    CV_STATE_EVAL(45, 0, 13);
    c3_VoltageCheck(chartInstance);
    break;

   case c3_IN_WNStart:
    CV_STATE_EVAL(45, 0, 14);
    c3_WNStart(chartInstance);
    break;

   default:
    CV_STATE_EVAL(45, 0, 0);
    chartInstance->c3_is_WRN = c3_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    break;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 45U, chartInstance->c3_sfEvent);
}

static void c3_WatchdogCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_d_out;
  int32_T c3_b_previousEvent;
  boolean_T c3_e_out;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 23U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 34U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(34U, (int32_T)_SFD_CCP_CALL(34U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetOne != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 34U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 137U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 137U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 162U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 162U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 179U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 179U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 7U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 165U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 165U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 132U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 132U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_WatchdogCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LOne = c3_IN_HOLD;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HOLD = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 22U,
                 chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(22U, (int32_T)_SFD_CCP_CALL(22U, 0, (int16_T)*
                  (boolean_T *)((char_T *)c3_hardwareSenData + 1) > 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 22;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 1) ==
                    0);
        if (c3_c_out) {
          transitionList[numTransitions] = 30;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
      chartInstance->c3_LOneCond = 6U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelOneAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
      if (chartInstance->c3_is_LOne != c3_IN_WatchdogCheck) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
      }

      if (chartInstance->c3_is_LOne != c3_IN_WatchdogCheck) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
      } else {
        chartInstance->c3_tp_WatchdogCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LOne = c3_IN_L1Sink;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_L1Sink = 1U;
      }
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 30U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(30U, (int32_T)_SFD_CCP_CALL(30U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 1) == 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
        c3_b_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_DoneOne;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_DoneOne,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_DoneOne,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_b_previousEvent;
        if (chartInstance->c3_is_LOne != c3_IN_WatchdogCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_LOne != c3_IN_WatchdogCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 143U,
                       chartInstance->c3_sfEvent);
          c3_e_out = (CV_TRANSITION_EVAL(143U, (int32_T)_SFD_CCP_CALL(143U, 0,
            chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
            chartInstance->c3_sfEvent)) != 0);
          if (c3_e_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 143U, chartInstance->c3_sfEvent);
            chartInstance->c3_tp_WatchdogCheck = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c3_sfEvent);
            chartInstance->c3_is_LOne = c3_c_IN_Normal;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c3_sfEvent);
            chartInstance->c3_c_tp_Normal = 1U;
          }
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 23U, chartInstance->c3_sfEvent);
}

static void c3_Sink24(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  boolean_T *c3_infusionPaused;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 39U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 74U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(74U, (int32_T)_SFD_CCP_CALL(74U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 74U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 102U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 102U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 156U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 156U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink24 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 75U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(75U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 3) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(75U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_c_temp = c3_b_temp;
    if (!c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(75U, 2, (int16_T)*c3_infusionPaused > 0 != 0U,
        chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(75U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 75U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 100U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 100U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 155U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 155U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink24 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 39U, chartInstance->c3_sfEvent);
}

static void c3_Sink26(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 41U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 58U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(58U, (int32_T)_SFD_CCP_CALL(58U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 58U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 184U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 184U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 154U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 154U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 102U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 102U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 156U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 156U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink26 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 61U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(61U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 5) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(61U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(61U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 61U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 183U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 183U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 153U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 153U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 100U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 100U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 155U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 155U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink26 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 41U, chartInstance->c3_sfEvent);
}

static void c3_RateOverPumpCapacityCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_c_temp;
  boolean_T c3_d_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 34U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 54U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(54U, (int32_T)_SFD_CCP_CALL(54U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 54U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 147U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 147U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 148U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 148U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 149U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 149U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 145U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 145U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 144U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 144U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_RateOverPumpCapacityCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_Hold;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Hold = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 53U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(53U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 7) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(53U, 1, (int16_T)*c3_infusionInProgress > 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(53U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 53;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 7) == 0)
                    || ((int16_T)*c3_infusionInProgress == 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 51;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 53U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_RateOverPumpCapacityCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Sink27;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 42U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Sink27 = 1U;
      chartInstance->c3_LTwoCond = 13U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 51U,
                   chartInstance->c3_sfEvent);
      c3_c_temp = (_SFD_CCP_CALL(51U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 7) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (!c3_c_temp) {
        c3_c_temp = (_SFD_CCP_CALL(51U, 1, (int16_T)*c3_infusionInProgress == 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(51U, (int32_T)c3_c_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_RateOverPumpCapacityCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_InfusionPauseDurationCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 29U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_InfusionPauseDurationCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 34U, chartInstance->c3_sfEvent);
}

static void c3_SinkOne(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  int32_T c3_previousEvent;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 11U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 38U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(38U, (int32_T)_SFD_CCP_CALL(38U, 0,
              chartInstance->c3_sfEvent == c3_event_E_Restart != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 38U, chartInstance->c3_sfEvent);
    c3_previousEvent = chartInstance->c3_sfEvent;
    chartInstance->c3_sfEvent = c3_event_E_ResetOne;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                 chartInstance->c3_sfEvent);
    if (chartInstance->c3_is_active_LOne == 0) {
    } else {
      c3_LOne(chartInstance);
    }

    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                 chartInstance->c3_sfEvent);
    chartInstance->c3_sfEvent = c3_previousEvent;
    if (chartInstance->c3_is_Controller != c3_IN_SinkOne) {
      _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 38U, chartInstance->c3_sfEvent);
    }

    if (chartInstance->c3_is_Controller != c3_IN_SinkOne) {
      _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 38U, chartInstance->c3_sfEvent);
    } else {
      chartInstance->c3_tp_SinkOne = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 11U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_Controller = c3_IN_CheckLOne;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_CheckLOne = 1U;
      c3_initiate(chartInstance);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 11U, chartInstance->c3_sfEvent);
}

static void c3_LowInfusionRateCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_d_temp;
  boolean_T c3_e_temp;
  boolean_T c3_d_out;
  boolean_T *c3_infusionInProgress;
  boolean_T *c3_infusionPaused;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 30U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 65U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(65U, (int32_T)_SFD_CCP_CALL(65U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 65U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 149U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 149U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 145U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 145U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 144U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 144U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_LowInfusionRateCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_Hold;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Hold = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 66U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(66U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 4) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(66U, 1, (int16_T)*c3_infusionInProgress > 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_c_temp = c3_b_temp;
    if (c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(66U, 2, (int16_T)*c3_infusionPaused == 0 != 0U,
        chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(66U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 66;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 4) == 0)
                    || ((int16_T)*c3_infusionInProgress == 0) || ((int16_T)
          *c3_infusionPaused > 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 63;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 66U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_LowInfusionRateCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Sink25;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 40U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Sink25 = 1U;
      chartInstance->c3_LTwoCond = 11U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 63U,
                   chartInstance->c3_sfEvent);
      c3_d_temp = (_SFD_CCP_CALL(63U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 4) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (!c3_d_temp) {
        c3_d_temp = (_SFD_CCP_CALL(63U, 1, (int16_T)*c3_infusionInProgress == 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_e_temp = c3_d_temp;
      if (!c3_e_temp) {
        c3_e_temp = (_SFD_CCP_CALL(63U, 2, (int16_T)*c3_infusionPaused > 0 != 0U,
          chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(63U, (int32_T)c3_e_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 63U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_LowInfusionRateCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_RateLessThanKVOCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 33U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_RateLessThanKVOCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 30U, chartInstance->c3_sfEvent);
}

static void c3_RateLessThanKVOCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_c_temp;
  boolean_T c3_d_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 33U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 59U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(59U, (int32_T)_SFD_CCP_CALL(59U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 59U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 148U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 148U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 149U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 149U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 145U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 145U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 144U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 144U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_RateLessThanKVOCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_Hold;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Hold = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 60U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(60U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 5) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(60U, 1, (int16_T)*c3_infusionInProgress > 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(60U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 60;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 5) == 0)
                    || ((int16_T)*c3_infusionInProgress == 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 56;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 60U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_RateLessThanKVOCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Sink26;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 41U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Sink26 = 1U;
      chartInstance->c3_LTwoCond = 12U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 56U,
                   chartInstance->c3_sfEvent);
      c3_c_temp = (_SFD_CCP_CALL(56U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 5) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (!c3_c_temp) {
        c3_c_temp = (_SFD_CCP_CALL(56U, 1, (int16_T)*c3_infusionInProgress == 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(56U, (int32_T)c3_c_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 56U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_RateLessThanKVOCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_RateOverPumpCapacityCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 34U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_RateOverPumpCapacityCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 33U, chartInstance->c3_sfEvent);
}

static void c3_Sink25(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  boolean_T *c3_infusionPaused;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 40U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 67U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(67U, (int32_T)_SFD_CCP_CALL(67U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 67U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 154U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 154U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 102U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 102U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 156U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 156U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink25 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 40U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 64U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(64U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 4) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(64U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_c_temp = c3_b_temp;
    if (!c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(64U, 2, (int16_T)*c3_infusionPaused > 0 != 0U,
        chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(64U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 64U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 153U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 153U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 100U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 100U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 155U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 155U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink25 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 40U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 40U, chartInstance->c3_sfEvent);
}

static void c3_OcculusionCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_c_temp;
  boolean_T c3_d_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 32U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 84U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(84U, (int32_T)_SFD_CCP_CALL(84U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 84U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 144U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 144U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_OcculusionCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 32U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_Hold;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Hold = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 73U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(73U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 2) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(73U, 1, (int16_T)*c3_infusionInProgress > 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(73U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 73;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 2) == 0)
                    || ((int16_T)*c3_infusionInProgress == 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 72;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 73U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_OcculusionCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 32U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Sink23;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 38U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Sink23 = 1U;
      chartInstance->c3_LTwoCond = 9U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 72U,
                   chartInstance->c3_sfEvent);
      c3_c_temp = (_SFD_CCP_CALL(72U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 2) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (!c3_c_temp) {
        c3_c_temp = (_SFD_CCP_CALL(72U, 1, (int16_T)*c3_infusionInProgress == 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(72U, (int32_T)c3_c_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 72U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_OcculusionCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 32U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_HighInfusionRateCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 27U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_HighInfusionRateCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 32U, chartInstance->c3_sfEvent);
}

static void c3_Sink23(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 38U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 77U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(77U, (int32_T)_SFD_CCP_CALL(77U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 77U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 156U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 156U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink23 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 38U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 76U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(76U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 2) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(76U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(76U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 76U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 155U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 155U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink23 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 38U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 38U, chartInstance->c3_sfEvent);
}

static void c3_HighInfusionRateCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_d_temp;
  boolean_T c3_e_temp;
  boolean_T c3_d_out;
  boolean_T *c3_infusionInProgress;
  boolean_T *c3_infusionPaused;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 27U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 83U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(83U, (int32_T)_SFD_CCP_CALL(83U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 83U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 145U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 145U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 144U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 144U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HighInfusionRateCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 27U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_Hold;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Hold = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 70U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(70U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 3) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(70U, 1, (int16_T)*c3_infusionInProgress > 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_c_temp = c3_b_temp;
    if (c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(70U, 2, (int16_T)*c3_infusionPaused == 0 != 0U,
        chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(70U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 70;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 3) == 0)
                    || ((int16_T)*c3_infusionInProgress == 0) || ((int16_T)
          *c3_infusionPaused > 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 69;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 70U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_HighInfusionRateCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 27U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Sink24;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 39U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Sink24 = 1U;
      chartInstance->c3_LTwoCond = 10U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 69U,
                   chartInstance->c3_sfEvent);
      c3_d_temp = (_SFD_CCP_CALL(69U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 3) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (!c3_d_temp) {
        c3_d_temp = (_SFD_CCP_CALL(69U, 1, (int16_T)*c3_infusionInProgress == 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_e_temp = c3_d_temp;
      if (!c3_e_temp) {
        c3_e_temp = (_SFD_CCP_CALL(69U, 2, (int16_T)*c3_infusionPaused > 0 != 0U,
          chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(69U, (int32_T)c3_e_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 69U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_HighInfusionRateCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 27U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_LowInfusionRateCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 30U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_LowInfusionRateCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 27U, chartInstance->c3_sfEvent);
}

static void c3_SinkTWO(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_b_temp;
  boolean_T c3_out;
  int32_T c3_previousEvent;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  int32_T c3_b_previousEvent;
  boolean_T c3_c_out;
  int32_T c3_c_previousEvent;
  real_T *c3_ErrCond;
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 12U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 133U, chartInstance->c3_sfEvent);
  c3_b_temp = (_SFD_CCP_CALL(133U, 0, chartInstance->c3_sfEvent ==
    c3_event_E_Clock != 0U, chartInstance->c3_sfEvent) != 0);
  if (c3_b_temp) {
    c3_b_temp = (_SFD_CCP_CALL(133U, 1, chartInstance->c3_LTwoCond == 0U != 0U,
      chartInstance->c3_sfEvent) != 0);
  }

  c3_out = (CV_TRANSITION_EVAL(133U, (int32_T)c3_b_temp) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 133U, chartInstance->c3_sfEvent);
    *c3_ErrCond = 0.0;
    _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
    c3_previousEvent = chartInstance->c3_sfEvent;
    chartInstance->c3_sfEvent = c3_event_E_ResetOne;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                 chartInstance->c3_sfEvent);
    if (chartInstance->c3_is_active_LOne == 0) {
    } else {
      c3_LOne(chartInstance);
    }

    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                 chartInstance->c3_sfEvent);
    chartInstance->c3_sfEvent = c3_previousEvent;
    if (chartInstance->c3_is_Controller != c3_IN_SinkTWO) {
      _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 133U, chartInstance->c3_sfEvent);
    }

    if (chartInstance->c3_is_Controller != c3_IN_SinkTWO) {
      _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 133U, chartInstance->c3_sfEvent);
    } else {
      chartInstance->c3_tp_SinkTWO = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 12U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_Controller = c3_IN_CheckLOne;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_CheckLOne = 1U;
      c3_initiate(chartInstance);
    }
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 130U,
                 chartInstance->c3_sfEvent);
    c3_c_temp = (_SFD_CCP_CALL(130U, 0, chartInstance->c3_sfEvent ==
      c3_event_E_Restart != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(130U, 1, chartInstance->c3_sfEvent ==
        c3_event_E_AlarmClear != 0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(130U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 130U, chartInstance->c3_sfEvent);
      *c3_ErrCond = 0.0;
      _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
      c3_b_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_ResetOne;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_LOne == 0) {
      } else {
        c3_LOne(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_b_previousEvent;
      if (chartInstance->c3_is_Controller != c3_IN_SinkTWO) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 130U, chartInstance->c3_sfEvent);
      }

      if (chartInstance->c3_is_Controller != c3_IN_SinkTWO) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 130U, chartInstance->c3_sfEvent);
      } else {
        chartInstance->c3_tp_SinkTWO = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 12U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_Controller = c3_IN_CheckLOne;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_CheckLOne = 1U;
        c3_initiate(chartInstance);
      }
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 119U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(119U, (int32_T)_SFD_CCP_CALL(119U, 0,
        chartInstance->c3_LTwoCond > 0U != 0U, chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 119U, chartInstance->c3_sfEvent);
        c3_c_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_ResetOne;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_LOne == 0) {
        } else {
          c3_LOne(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_c_previousEvent;
        if (chartInstance->c3_is_Controller != c3_IN_SinkTWO) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 119U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_Controller != c3_IN_SinkTWO) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 119U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_SinkTWO = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 12U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_Controller = c3_IN_SinkTWOCheckOne;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 13U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_SinkTWOCheckOne = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 12U, chartInstance->c3_sfEvent);
}

static void c3_Controller(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_d_out;
  boolean_T c3_e_out;
  boolean_T c3_f_out;
  int32_T c3_b_previousEvent;
  boolean_T c3_g_out;
  boolean_T c3_h_out;
  boolean_T c3_i_out;
  int32_T c3_c_previousEvent;
  boolean_T c3_j_out;
  boolean_T c3_k_out;
  boolean_T c3_l_out;
  boolean_T c3_m_out;
  boolean_T c3_n_out;
  int32_T c3_d_previousEvent;
  boolean_T c3_o_out;
  int32_T c3_e_previousEvent;
  real_T *c3_ErrCond;
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 6U, chartInstance->c3_sfEvent);
  switch (chartInstance->c3_is_Controller) {
   case c3_IN_CheckLOne:
    CV_STATE_EVAL(6, 0, 1);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 7U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 68U,
                 chartInstance->c3_sfEvent);
    c3_out = (CV_TRANSITION_EVAL(68U, (int32_T)_SFD_CCP_CALL(68U, 0,
                chartInstance->c3_sfEvent == c3_event_E_LevelOneAlarm != 0U,
                chartInstance->c3_sfEvent)) != 0);
    if (c3_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 68;
        sf_debug_transition_conflict_check_begin();
        c3_b_out = (chartInstance->c3_sfEvent == c3_event_E_DoneOne);
        if (c3_b_out) {
          transitionList[numTransitions] = 120;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 68U, chartInstance->c3_sfEvent);
      *c3_ErrCond = (real_T)chartInstance->c3_LOneCond;
      _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
      chartInstance->c3_tp_CheckLOne = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_Controller = c3_IN_SinkOne;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 11U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_SinkOne = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 120U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(120U, (int32_T)_SFD_CCP_CALL(120U, 0,
        chartInstance->c3_sfEvent == c3_event_E_DoneOne != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 120U, chartInstance->c3_sfEvent);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_ResetTwo;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetTwo,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_LTwo == 0) {
        } else {
          c3_LTwo(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetTwo,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_Controller != c3_IN_CheckLOne) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 120U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_Controller != c3_IN_CheckLOne) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 120U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_CheckLOne = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_Controller = c3_IN_CheckLTwo;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 8U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_CheckLTwo = 1U;
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 7U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_CheckLTwo:
    CV_STATE_EVAL(6, 0, 2);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 8U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 121U,
                 chartInstance->c3_sfEvent);
    c3_d_out = (CV_TRANSITION_EVAL(121U, (int32_T)_SFD_CCP_CALL(121U, 0,
      chartInstance->c3_sfEvent == c3_event_E_Restart != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[3];
        unsigned int numTransitions = 1;
        transitionList[0] = 121;
        sf_debug_transition_conflict_check_begin();
        c3_e_out = (chartInstance->c3_sfEvent == c3_event_E_LevelTwoAlarm);
        if (c3_e_out) {
          transitionList[numTransitions] = 117;
          numTransitions++;
        }

        c3_f_out = (chartInstance->c3_sfEvent == c3_event_E_DoneTwo);
        if (c3_f_out) {
          transitionList[numTransitions] = 114;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 121U, chartInstance->c3_sfEvent);
      c3_b_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_ResetOne;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_LOne == 0) {
      } else {
        c3_LOne(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_b_previousEvent;
      if (chartInstance->c3_is_Controller != c3_IN_CheckLTwo) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 121U, chartInstance->c3_sfEvent);
      }

      if (chartInstance->c3_is_Controller != c3_IN_CheckLTwo) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 121U, chartInstance->c3_sfEvent);
      } else {
        chartInstance->c3_tp_CheckLTwo = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 8U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_Controller = c3_IN_CheckLOne;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_CheckLOne = 1U;
        c3_initiate(chartInstance);
      }
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 117U,
                   chartInstance->c3_sfEvent);
      c3_g_out = (CV_TRANSITION_EVAL(117U, (int32_T)_SFD_CCP_CALL(117U, 0,
        chartInstance->c3_sfEvent == c3_event_E_LevelTwoAlarm != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_g_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 117;
          sf_debug_transition_conflict_check_begin();
          c3_h_out = (chartInstance->c3_sfEvent == c3_event_E_DoneTwo);
          if (c3_h_out) {
            transitionList[numTransitions] = 114;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 117U, chartInstance->c3_sfEvent);
        *c3_ErrCond = (real_T)chartInstance->c3_LTwoCond;
        _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
        chartInstance->c3_tp_CheckLTwo = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 8U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_Controller = c3_IN_SinkTWO;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 12U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_SinkTWO = 1U;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 114U,
                     chartInstance->c3_sfEvent);
        c3_i_out = (CV_TRANSITION_EVAL(114U, (int32_T)_SFD_CCP_CALL(114U, 0,
          chartInstance->c3_sfEvent == c3_event_E_DoneTwo != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_i_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 114U, chartInstance->c3_sfEvent);
          c3_c_previousEvent = chartInstance->c3_sfEvent;
          chartInstance->c3_sfEvent = c3_event_E_ResetThree;
          _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetThree,
                       chartInstance->c3_sfEvent);
          if (chartInstance->c3_is_active_WRN == 0) {
          } else {
            c3_WRN(chartInstance);
          }

          _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetThree,
                       chartInstance->c3_sfEvent);
          chartInstance->c3_sfEvent = c3_c_previousEvent;
          if (chartInstance->c3_is_Controller != c3_IN_CheckLTwo) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 114U,
                         chartInstance->c3_sfEvent);
          }

          if (chartInstance->c3_is_Controller != c3_IN_CheckLTwo) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 114U,
                         chartInstance->c3_sfEvent);
          } else {
            chartInstance->c3_tp_CheckLTwo = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 8U, chartInstance->c3_sfEvent);
            chartInstance->c3_is_Controller = c3_IN_CheckWRN;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
            chartInstance->c3_tp_CheckWRN = 1U;
          }
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 8U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_CheckWRN:
    CV_STATE_EVAL(6, 0, 3);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 9U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 112U,
                 chartInstance->c3_sfEvent);
    c3_j_out = (CV_TRANSITION_EVAL(112U, (int32_T)_SFD_CCP_CALL(112U, 0,
      chartInstance->c3_sfEvent == c3_event_E_WarningAlarm != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_j_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[3];
        unsigned int numTransitions = 1;
        transitionList[0] = 112;
        sf_debug_transition_conflict_check_begin();
        c3_k_out = (chartInstance->c3_sfEvent == c3_event_E_DoneThree);
        if (c3_k_out) {
          transitionList[numTransitions] = 35;
          numTransitions++;
        }

        c3_l_out = (chartInstance->c3_sfEvent == c3_event_E_Restart);
        if (c3_l_out) {
          transitionList[numTransitions] = 129;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 112U, chartInstance->c3_sfEvent);
      *c3_ErrCond = (real_T)chartInstance->c3_WnCond;
      _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
      sf_mex_printf("%s\\n", "E_Warning");
      chartInstance->c3_E_WarningEventCounter++;
      chartInstance->c3_tp_CheckWRN = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_Controller = c3_IN_CheckWRN;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_CheckWRN = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 35U,
                   chartInstance->c3_sfEvent);
      c3_m_out = (CV_TRANSITION_EVAL(35U, (int32_T)_SFD_CCP_CALL(35U, 0,
        chartInstance->c3_sfEvent == c3_event_E_DoneThree != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_m_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 35;
          sf_debug_transition_conflict_check_begin();
          c3_n_out = (chartInstance->c3_sfEvent == c3_event_E_Restart);
          if (c3_n_out) {
            transitionList[numTransitions] = 129;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
        c3_d_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_ResetOne;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_LOne == 0) {
        } else {
          c3_LOne(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_d_previousEvent;
        if (chartInstance->c3_is_Controller != c3_IN_CheckWRN) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_Controller != c3_IN_CheckWRN) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_CheckWRN = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_Controller = c3_IN_CheckLOne;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_CheckLOne = 1U;
          c3_initiate(chartInstance);
        }
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 129U,
                     chartInstance->c3_sfEvent);
        c3_o_out = (CV_TRANSITION_EVAL(129U, (int32_T)_SFD_CCP_CALL(129U, 0,
          chartInstance->c3_sfEvent == c3_event_E_Restart != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_o_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 129U, chartInstance->c3_sfEvent);
          c3_e_previousEvent = chartInstance->c3_sfEvent;
          chartInstance->c3_sfEvent = c3_event_E_ResetOne;
          _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_ResetOne,
                       chartInstance->c3_sfEvent);
          if (chartInstance->c3_is_active_LOne == 0) {
          } else {
            c3_LOne(chartInstance);
          }

          _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_ResetOne,
                       chartInstance->c3_sfEvent);
          chartInstance->c3_sfEvent = c3_e_previousEvent;
          if (chartInstance->c3_is_Controller != c3_IN_CheckWRN) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 129U,
                         chartInstance->c3_sfEvent);
          }

          if (chartInstance->c3_is_Controller != c3_IN_CheckWRN) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 129U,
                         chartInstance->c3_sfEvent);
          } else {
            chartInstance->c3_tp_CheckWRN = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 9U, chartInstance->c3_sfEvent);
            chartInstance->c3_is_Controller = c3_IN_CheckLOne;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
            chartInstance->c3_tp_CheckLOne = 1U;
            c3_initiate(chartInstance);
          }
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 9U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_START:
    CV_STATE_EVAL(6, 0, 4);
    c3_START(chartInstance);
    break;

   case c3_IN_SinkOne:
    CV_STATE_EVAL(6, 0, 5);
    c3_SinkOne(chartInstance);
    break;

   case c3_IN_SinkTWO:
    CV_STATE_EVAL(6, 0, 6);
    c3_SinkTWO(chartInstance);
    break;

   case c3_IN_SinkTWOCheckOne:
    CV_STATE_EVAL(6, 0, 7);
    c3_SinkTWOCheckOne(chartInstance);
    break;

   default:
    CV_STATE_EVAL(6, 0, 0);
    chartInstance->c3_is_Controller = c3_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
    break;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 6U, chartInstance->c3_sfEvent);
}

static void c3_Normal(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 31U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 105U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(105U, (int32_T)_SFD_CCP_CALL(105U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 105U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Normal = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_Hold;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Hold = 1U;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 31U, chartInstance->c3_sfEvent);
}

static void c3_Sink22(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 37U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 91U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(91U, (int32_T)_SFD_CCP_CALL(91U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 91U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink22 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 89U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(89U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 0) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(89U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(89U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 89U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink22 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 37U, chartInstance->c3_sfEvent);
}

static void c3_ReservoirEmptyCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_c_temp;
  boolean_T c3_d_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 35U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 82U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(82U, (int32_T)_SFD_CCP_CALL(82U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 82U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_ReservoirEmptyCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_Hold;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Hold = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 81U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(81U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 0) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(81U, 1, (int16_T)*c3_infusionInProgress > 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(81U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 81;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 0) == 0)
                    || ((int16_T)*c3_infusionInProgress == 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 80;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 81U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_ReservoirEmptyCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Sink22;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 37U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Sink22 = 1U;
      chartInstance->c3_LTwoCond = 8U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 80U,
                   chartInstance->c3_sfEvent);
      c3_c_temp = (_SFD_CCP_CALL(80U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 0) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (!c3_c_temp) {
        c3_c_temp = (_SFD_CCP_CALL(80U, 1, (int16_T)*c3_infusionInProgress == 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(80U, (int32_T)c3_c_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 80U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_ReservoirEmptyCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_OcculusionCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 32U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_OcculusionCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 35U, chartInstance->c3_sfEvent);
}

static void c3_Sink21(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 36U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 94U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(94U, (int32_T)_SFD_CCP_CALL(94U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 94U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink21 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 93U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(93U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_hardwareSenData + 2) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(93U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(93U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 93U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink21 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 36U, chartInstance->c3_sfEvent);
}

static void c3_LTwo(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_c_temp;
  boolean_T c3_d_out;
  int32_T c3_b_previousEvent;
  boolean_T c3_e_out;
  boolean_T c3_d_temp;
  boolean_T c3_f_out;
  boolean_T c3_g_out;
  int32_T c3_c_previousEvent;
  boolean_T c3_e_temp;
  boolean_T c3_h_out;
  boolean_T c3_i_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 24U, chartInstance->c3_sfEvent);
  switch (chartInstance->c3_is_LTwo) {
   case c3_IN_AirInLineCheck:
    CV_STATE_EVAL(24, 0, 1);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 25U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 48U,
                 chartInstance->c3_sfEvent);
    c3_out = (CV_TRANSITION_EVAL(48U, (int32_T)_SFD_CCP_CALL(48U, 0,
                chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
                chartInstance->c3_sfEvent)) != 0);
    if (c3_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 48U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 151U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 151U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 152U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 152U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 147U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 147U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 148U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 148U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 149U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 149U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 145U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 145U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 144U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 144U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_AirInLineCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Hold;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Hold = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 37U,
                   chartInstance->c3_sfEvent);
      c3_b_temp = (_SFD_CCP_CALL(37U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 10) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (c3_b_temp) {
        c3_b_temp = (_SFD_CCP_CALL(37U, 1, (int16_T)*c3_infusionInProgress > 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_b_out = (CV_TRANSITION_EVAL(37U, (int32_T)c3_b_temp) != 0);
      if (c3_b_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 37;
          sf_debug_transition_conflict_check_begin();
          c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 10) ==
                       0) || ((int16_T)*c3_infusionInProgress == 0));
          if (c3_c_out) {
            transitionList[numTransitions] = 173;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 37U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_AirInLineCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_Sink29;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 44U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink29 = 1U;
        chartInstance->c3_LTwoCond = 15U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 173U,
                     chartInstance->c3_sfEvent);
        c3_c_temp = (_SFD_CCP_CALL(173U, 0, (int16_T)*(boolean_T *)((char_T *)
          c3_infuSenData + 10) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
        if (!c3_c_temp) {
          c3_c_temp = (_SFD_CCP_CALL(173U, 1, (int16_T)*c3_infusionInProgress ==
            0 != 0U, chartInstance->c3_sfEvent) != 0);
        }

        c3_d_out = (CV_TRANSITION_EVAL(173U, (int32_T)c3_c_temp) != 0);
        if (c3_d_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 173U, chartInstance->c3_sfEvent);
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 172U,
                       chartInstance->c3_sfEvent);
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 172U, chartInstance->c3_sfEvent);
          c3_b_previousEvent = chartInstance->c3_sfEvent;
          chartInstance->c3_sfEvent = c3_event_E_DoneTwo;
          _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_DoneTwo,
                       chartInstance->c3_sfEvent);
          if (chartInstance->c3_is_active_Controller == 0) {
          } else {
            c3_Controller(chartInstance);
          }

          _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_DoneTwo,
                       chartInstance->c3_sfEvent);
          chartInstance->c3_sfEvent = c3_b_previousEvent;
          if (chartInstance->c3_is_LTwo != c3_IN_AirInLineCheck) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 172U,
                         chartInstance->c3_sfEvent);
          }

          if (chartInstance->c3_is_LTwo != c3_IN_AirInLineCheck) {
            _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 172U,
                         chartInstance->c3_sfEvent);
          } else {
            chartInstance->c3_tp_AirInLineCheck = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c3_sfEvent);
            chartInstance->c3_is_LTwo = c3_IN_Normal;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 31U, chartInstance->c3_sfEvent);
            chartInstance->c3_tp_Normal = 1U;
            chartInstance->c3_LTwoCond = 0U;
            _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
          }
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 25U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_DoorOpenCheck:
    CV_STATE_EVAL(24, 0, 2);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 26U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 97U,
                 chartInstance->c3_sfEvent);
    c3_e_out = (CV_TRANSITION_EVAL(97U, (int32_T)_SFD_CCP_CALL(97U, 0,
      chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_e_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 97U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_DoorOpenCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Hold;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Hold = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 95U,
                   chartInstance->c3_sfEvent);
      c3_d_temp = (_SFD_CCP_CALL(95U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_hardwareSenData + 2) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (c3_d_temp) {
        c3_d_temp = (_SFD_CCP_CALL(95U, 1, (int16_T)*c3_infusionInProgress > 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_f_out = (CV_TRANSITION_EVAL(95U, (int32_T)c3_d_temp) != 0);
      if (c3_f_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 95;
          sf_debug_transition_conflict_check_begin();
          c3_g_out = (((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 2)
                       == 0) || ((int16_T)*c3_infusionInProgress == 0));
          if (c3_g_out) {
            transitionList[numTransitions] = 96;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 95U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_Sink21;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink21 = 1U;
        chartInstance->c3_LTwoCond = 7U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
        c3_c_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_c_previousEvent;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 96U,
                     chartInstance->c3_sfEvent);
        c3_e_temp = (_SFD_CCP_CALL(96U, 0, (int16_T)*(boolean_T *)((char_T *)
          c3_hardwareSenData + 2) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
        if (!c3_e_temp) {
          c3_e_temp = (_SFD_CCP_CALL(96U, 1, (int16_T)*c3_infusionInProgress ==
            0 != 0U, chartInstance->c3_sfEvent) != 0);
        }

        c3_h_out = (CV_TRANSITION_EVAL(96U, (int32_T)c3_e_temp) != 0);
        if (c3_h_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 96U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_DoorOpenCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_LTwo = c3_IN_ReservoirEmptyCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_ReservoirEmptyCheck = 1U;
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 26U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_HighInfusionRateCheck:
    CV_STATE_EVAL(24, 0, 3);
    c3_HighInfusionRateCheck(chartInstance);
    break;

   case c3_IN_Hold:
    CV_STATE_EVAL(24, 0, 4);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 28U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 101U,
                 chartInstance->c3_sfEvent);
    c3_i_out = (CV_TRANSITION_EVAL(101U, (int32_T)_SFD_CCP_CALL(101U, 0,
      chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_i_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 101U, chartInstance->c3_sfEvent);
      chartInstance->c3_LTwoCond = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
      chartInstance->c3_tp_Hold = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_DoorOpenCheck = 1U;
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 28U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_InfusionPauseDurationCheck:
    CV_STATE_EVAL(24, 0, 5);
    c3_InfusionPauseDurationCheck(chartInstance);
    break;

   case c3_IN_LowInfusionRateCheck:
    CV_STATE_EVAL(24, 0, 6);
    c3_LowInfusionRateCheck(chartInstance);
    break;

   case c3_IN_Normal:
    CV_STATE_EVAL(24, 0, 7);
    c3_Normal(chartInstance);
    break;

   case c3_IN_OcculusionCheck:
    CV_STATE_EVAL(24, 0, 8);
    c3_OcculusionCheck(chartInstance);
    break;

   case c3_IN_RateLessThanKVOCheck:
    CV_STATE_EVAL(24, 0, 9);
    c3_RateLessThanKVOCheck(chartInstance);
    break;

   case c3_IN_RateOverPumpCapacityCheck:
    CV_STATE_EVAL(24, 0, 10);
    c3_RateOverPumpCapacityCheck(chartInstance);
    break;

   case c3_IN_ReservoirEmptyCheck:
    CV_STATE_EVAL(24, 0, 11);
    c3_ReservoirEmptyCheck(chartInstance);
    break;

   case c3_IN_Sink21:
    CV_STATE_EVAL(24, 0, 12);
    c3_Sink21(chartInstance);
    break;

   case c3_IN_Sink22:
    CV_STATE_EVAL(24, 0, 13);
    c3_Sink22(chartInstance);
    break;

   case c3_IN_Sink23:
    CV_STATE_EVAL(24, 0, 14);
    c3_Sink23(chartInstance);
    break;

   case c3_IN_Sink24:
    CV_STATE_EVAL(24, 0, 15);
    c3_Sink24(chartInstance);
    break;

   case c3_IN_Sink25:
    CV_STATE_EVAL(24, 0, 16);
    c3_Sink25(chartInstance);
    break;

   case c3_IN_Sink26:
    CV_STATE_EVAL(24, 0, 17);
    c3_Sink26(chartInstance);
    break;

   case c3_IN_Sink27:
    CV_STATE_EVAL(24, 0, 18);
    c3_Sink27(chartInstance);
    break;

   case c3_IN_Sink28:
    CV_STATE_EVAL(24, 0, 19);
    c3_Sink28(chartInstance);
    break;

   case c3_IN_Sink29:
    CV_STATE_EVAL(24, 0, 20);
    c3_Sink29(chartInstance);
    break;

   default:
    CV_STATE_EVAL(24, 0, 0);
    chartInstance->c3_is_LTwo = c3_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c3_sfEvent);
    break;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 24U, chartInstance->c3_sfEvent);
}

static void c3_VoltageCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 58U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 88U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(88U, (int32_T)_SFD_CCP_CALL(88U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 88U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 0U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 0U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 190U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 190U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 189U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 189U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_VoltageCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 58U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 204U,
                 chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(204U, (int32_T)_SFD_CCP_CALL(204U, 0,
      (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 6) == 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 204;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 6) >
                    0);
        if (c3_c_out) {
          transitionList[numTransitions] = 18;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 204U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 22U);
      chartInstance->c3_tp_VoltageCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 58U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_b_IN_PumpTempCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 57U, chartInstance->c3_sfEvent);
      chartInstance->c3_b_tp_PumpTempCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 18U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(18U, (int32_T)_SFD_CCP_CALL(18U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 6) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 166U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 166U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 22U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_IN_VoltageCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 166U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_IN_VoltageCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 166U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_VoltageCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 58U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_b_IN_PumpTempCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 57U, chartInstance->c3_sfEvent);
          chartInstance->c3_b_tp_PumpTempCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 58U, chartInstance->c3_sfEvent);
}

static void c3_RTCCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_d_out;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 22U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 128U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(128U, (int32_T)_SFD_CCP_CALL(128U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetOne != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 128U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 165U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 165U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 132U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 132U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_RTCCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LOne = c3_IN_HOLD;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HOLD = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 118U,
                 chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(118U, (int32_T)_SFD_CCP_CALL(118U, 0,
      (int16_T)((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 8) > 0) >
      0 != 0U, chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 118;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)((int16_T)*(boolean_T *)((char_T *)
          c3_hardwareSenData + 8) > 0) == 0);
        if (c3_c_out) {
          transitionList[numTransitions] = 116;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 118U, chartInstance->c3_sfEvent);
      chartInstance->c3_LOneCond = 2U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelOneAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
      if (chartInstance->c3_is_LOne != c3_IN_RTCCheck) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 118U, chartInstance->c3_sfEvent);
      }

      if (chartInstance->c3_is_LOne != c3_IN_RTCCheck) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 118U, chartInstance->c3_sfEvent);
      } else {
        chartInstance->c3_tp_RTCCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LOne = c3_IN_L1Sink;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_L1Sink = 1U;
      }
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 116U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(116U, (int32_T)_SFD_CCP_CALL(116U, 0,
        (int16_T)((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 8) > 0)
        == 0 != 0U, chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 116U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_RTCCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LOne = c3_IN_CPUCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_CPUCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 22U, chartInstance->c3_sfEvent);
}

static void c3_FlowRateStabilityCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_temp;
  boolean_T c3_e_temp;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  boolean_T *c3_infusionInProgress;
  boolean_T *c3_infusionPaused;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 50U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 178U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(178U, (int32_T)_SFD_CCP_CALL(178U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 178U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_FlowRateStabilityCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 50U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 180U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(180U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 6) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(180U, 1, (int16_T)*c3_infusionInProgress == 0
        != 0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_c_temp = c3_b_temp;
    if (!c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(180U, 2, (int16_T)*c3_infusionPaused == 0 != 0U,
        chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(180U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 180;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 6) > 0) &&
                    ((int16_T)*c3_infusionInProgress > 0) && ((int16_T)
          *c3_infusionPaused == 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 181;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 180U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 16U);
      chartInstance->c3_tp_FlowRateStabilityCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 50U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_LowReservoirCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 56U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_LowReservoirCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 181U,
                   chartInstance->c3_sfEvent);
      c3_d_temp = (_SFD_CCP_CALL(181U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 6) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (c3_d_temp) {
        c3_d_temp = (_SFD_CCP_CALL(181U, 1, (int16_T)*c3_infusionInProgress > 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_e_temp = c3_d_temp;
      if (c3_e_temp) {
        c3_e_temp = (_SFD_CCP_CALL(181U, 2, (int16_T)*c3_infusionPaused == 0 !=
          0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(181U, (int32_T)c3_e_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 181U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 6U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 6U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 16U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_IN_FlowRateStabilityCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 6U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_IN_FlowRateStabilityCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 6U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_FlowRateStabilityCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 50U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_IN_LowReservoirCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 56U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_LowReservoirCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 50U, chartInstance->c3_sfEvent);
}

static void c3_b_Normal(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 20U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 26U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(26U, (int32_T)_SFD_CCP_CALL(26U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetOne != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_c_tp_Normal = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 20U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LOne = c3_IN_HOLD;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HOLD = 1U;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 20U, chartInstance->c3_sfEvent);
}

static void c3_InfusionPauseDurationCheck(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_d_temp;
  boolean_T c3_e_temp;
  boolean_T c3_d_out;
  boolean_T *c3_infusionInProgress;
  boolean_T *c3_infusionPaused;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 29U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 49U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(49U, (int32_T)_SFD_CCP_CALL(49U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 49U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 152U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 152U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 147U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 147U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 148U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 148U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 149U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 149U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 145U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 145U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 144U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 144U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_InfusionPauseDurationCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_Hold;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Hold = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 40U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(40U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 9) > 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(40U, 1, (int16_T)*c3_infusionInProgress > 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_c_temp = c3_b_temp;
    if (c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(40U, 2, (int16_T)*c3_infusionPaused == 1 != 0U,
        chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(40U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 40;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = (((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 9) == 0)
                    || ((int16_T)*c3_infusionInProgress == 0) || ((int16_T)
          *c3_infusionPaused == 0));
        if (c3_c_out) {
          transitionList[numTransitions] = 39;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 40U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_InfusionPauseDurationCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LTwo = c3_IN_Sink28;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Sink28 = 1U;
      chartInstance->c3_LTwoCond = 14U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelTwoAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelTwoAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 39U,
                   chartInstance->c3_sfEvent);
      c3_d_temp = (_SFD_CCP_CALL(39U, 0, (int16_T)*(boolean_T *)((char_T *)
        c3_infuSenData + 9) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
      if (!c3_d_temp) {
        c3_d_temp = (_SFD_CCP_CALL(39U, 1, (int16_T)*c3_infusionInProgress == 0
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_e_temp = c3_d_temp;
      if (!c3_e_temp) {
        c3_e_temp = (_SFD_CCP_CALL(39U, 2, (int16_T)*c3_infusionPaused == 0 !=
          0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_d_out = (CV_TRANSITION_EVAL(39U, (int32_T)c3_e_temp) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 39U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_InfusionPauseDurationCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_AirInLineCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 25U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_AirInLineCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 29U, chartInstance->c3_sfEvent);
}

static void c3_enter_atomic_Checking(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  uint32_T c3_x;
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  boolean_T c3_e_out;
  boolean_T c3_f_out;
  boolean_T c3_g_out;
  boolean_T c3_h_out;
  boolean_T c3_i_out;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c3_x, c3_sf_marshallOut,
    c3_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(15U, &c3_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 62U, chartInstance->c3_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 62U, chartInstance->c3_sfEvent);
  c3_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c3_x, 15U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 28U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 28U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 23U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(23U, (int32_T)_SFD_CCP_CALL(23U, 0, (int16_T)
              *(boolean_T *)((char_T *)c3_infuSenData + 0) > 0 != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 23;
      sf_debug_transition_conflict_check_begin();
      c3_b_out = ((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 0) == 0);
      if (c3_b_out) {
        transitionList[numTransitions] = 27;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 23U, chartInstance->c3_sfEvent);
    c3_x = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)c3_x, 15U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 27U,
                 chartInstance->c3_sfEvent);
    c3_c_out = (CV_TRANSITION_EVAL(27U, (int32_T)_SFD_CCP_CALL(27U, 0, (int16_T)*
                  (boolean_T *)((char_T *)c3_infuSenData + 0) == 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 27U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 25U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(25U, (int32_T)_SFD_CCP_CALL(25U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 2) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 25;
          sf_debug_transition_conflict_check_begin();
          c3_e_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 2) ==
                      0);
          if (c3_e_out) {
            transitionList[numTransitions] = 31;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 25U, chartInstance->c3_sfEvent);
        c3_x = 0U;
        _SFD_DATA_RANGE_CHECK((real_T)c3_x, 15U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 31U,
                     chartInstance->c3_sfEvent);
        c3_f_out = (CV_TRANSITION_EVAL(31U, (int32_T)_SFD_CCP_CALL(31U, 0,
          (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 2) == 0 != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_f_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 31U, chartInstance->c3_sfEvent);
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 36U,
                       chartInstance->c3_sfEvent);
          c3_g_out = (CV_TRANSITION_EVAL(36U, (int32_T)_SFD_CCP_CALL(36U, 0,
            (int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 7) > 0 != 0U,
            chartInstance->c3_sfEvent)) != 0);
          if (c3_g_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[2];
              unsigned int numTransitions = 1;
              transitionList[0] = 36;
              sf_debug_transition_conflict_check_begin();
              c3_h_out = ((int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 7) ==
                          0);
              if (c3_h_out) {
                transitionList[numTransitions] = 45;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 36U, chartInstance->c3_sfEvent);
            c3_x = 0U;
            _SFD_DATA_RANGE_CHECK((real_T)c3_x, 15U);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 45U,
                         chartInstance->c3_sfEvent);
            c3_i_out = (CV_TRANSITION_EVAL(45U, (int32_T)_SFD_CCP_CALL(45U, 0,
              (int16_T)*(boolean_T *)((char_T *)c3_infuSenData + 7) == 0 != 0U,
              chartInstance->c3_sfEvent)) != 0);
            if (c3_i_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 45U, chartInstance->c3_sfEvent);
              c3_x = 1U;
              _SFD_DATA_RANGE_CHECK((real_T)c3_x, 15U);
            }
          }
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 62U, chartInstance->c3_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(15U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 62U, chartInstance->c3_sfEvent);
  sf_debug_symbol_scope_pop();
  chartInstance->c3_temp = (c3_x != 0U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_temp, 11U);
}

static void c3_Sink27(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 42U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 55U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(55U, (int32_T)_SFD_CCP_CALL(55U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 55U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 182U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 182U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 184U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 184U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 154U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 154U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 102U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 102U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 156U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 156U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink27 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 52U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(52U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 7) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(52U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(52U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 52U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 174U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 174U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 183U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 183U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 153U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 153U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 100U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 100U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 155U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 155U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink27 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 42U, chartInstance->c3_sfEvent);
}

static void c3_Sink29(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 44U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 42U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(42U, (int32_T)_SFD_CCP_CALL(42U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 42U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 99U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 99U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 103U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 103U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 182U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 182U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 184U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 184U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 154U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 154U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 102U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 102U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 156U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 156U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink29 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 41U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(41U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 10) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(41U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(41U, (int32_T)c3_b_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 41U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 47U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 47U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 150U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 150U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 174U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 174U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 183U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 183U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 153U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 153U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 100U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 100U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 155U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 155U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink29 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 44U, chartInstance->c3_sfEvent);
}

static void c3_Sink28(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_temp;
  boolean_T c3_c_temp;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T *c3_infusionInProgress;
  boolean_T *c3_infusionPaused;
  c3_InfusionSensorSignals *c3_infuSenData;
  c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 5);
  c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 2);
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 43U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 44U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(44U, (int32_T)_SFD_CCP_CALL(44U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetTwo != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 44U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 103U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 103U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 182U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 182U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 184U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 184U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 154U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 154U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 102U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 102U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 156U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 156U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_Sink28 = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_DoorOpenCheck = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 43U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(43U, 0, (int16_T)*(boolean_T *)((char_T *)
      c3_infuSenData + 9) == 0 != 0U, chartInstance->c3_sfEvent) != 0);
    if (!c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(43U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_c_temp = c3_b_temp;
    if (!c3_c_temp) {
      c3_c_temp = (_SFD_CCP_CALL(43U, 2, (int16_T)*c3_infusionPaused == 0 != 0U,
        chartInstance->c3_sfEvent) != 0);
    }

    c3_b_out = (CV_TRANSITION_EVAL(43U, (int32_T)c3_c_temp) != 0);
    if (c3_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 43U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 150U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 150U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 174U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 174U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 183U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 183U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 153U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 153U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 100U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 100U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 155U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 155U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                   chartInstance->c3_sfEvent);
      c3_c_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Sink28 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LTwo = c3_IN_DoorOpenCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_DoorOpenCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 43U, chartInstance->c3_sfEvent);
}

static void c3_LOne(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_d_out;
  boolean_T c3_e_out;
  boolean_T c3_f_out;
  boolean_T c3_g_out;
  int32_T c3_b_previousEvent;
  boolean_T c3_h_out;
  boolean_T c3_i_out;
  boolean_T c3_j_out;
  boolean_T c3_k_out;
  boolean_T c3_l_out;
  boolean_T c3_m_out;
  int32_T c3_c_previousEvent;
  boolean_T c3_n_out;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 14U, chartInstance->c3_sfEvent);
  switch (chartInstance->c3_is_LOne) {
   case c3_IN_BatteryDepletionCheck:
    CV_STATE_EVAL(14, 0, 1);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 15U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 131U,
                 chartInstance->c3_sfEvent);
    c3_out = (CV_TRANSITION_EVAL(131U, (int32_T)_SFD_CCP_CALL(131U, 0,
                chartInstance->c3_sfEvent == c3_event_E_ResetOne != 0U,
                chartInstance->c3_sfEvent)) != 0);
    if (c3_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 131U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 132U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 132U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_BatteryDepletionCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LOne = c3_IN_HOLD;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_HOLD = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 123U,
                   chartInstance->c3_sfEvent);
      c3_b_out = (CV_TRANSITION_EVAL(123U, (int32_T)_SFD_CCP_CALL(123U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 3) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_b_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 123;
          sf_debug_transition_conflict_check_begin();
          c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 3) ==
                      0);
          if (c3_c_out) {
            transitionList[numTransitions] = 122;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 123U, chartInstance->c3_sfEvent);
        chartInstance->c3_LOneCond = 1U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_LevelOneAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_LOne != c3_IN_BatteryDepletionCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 123U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_LOne != c3_IN_BatteryDepletionCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 123U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_BatteryDepletionCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_LOne = c3_IN_L1Sink;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_L1Sink = 1U;
        }
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 122U,
                     chartInstance->c3_sfEvent);
        c3_d_out = (CV_TRANSITION_EVAL(122U, (int32_T)_SFD_CCP_CALL(122U, 0,
          (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 3) == 0 != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_d_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 122U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_BatteryDepletionCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_LOne = c3_IN_RTCCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 22U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_RTCCheck = 1U;
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 15U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_CPUCheck:
    CV_STATE_EVAL(14, 0, 2);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 16U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 126U,
                 chartInstance->c3_sfEvent);
    c3_e_out = (CV_TRANSITION_EVAL(126U, (int32_T)_SFD_CCP_CALL(126U, 0,
      chartInstance->c3_sfEvent == c3_event_E_ResetOne != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_e_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 126U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 7U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 165U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 165U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 132U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 132U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_CPUCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LOne = c3_IN_HOLD;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_HOLD = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 110U,
                   chartInstance->c3_sfEvent);
      c3_f_out = (CV_TRANSITION_EVAL(110U, (int32_T)_SFD_CCP_CALL(110U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 7) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_f_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 110;
          sf_debug_transition_conflict_check_begin();
          c3_g_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 7) ==
                      0);
          if (c3_g_out) {
            transitionList[numTransitions] = 109;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 110U, chartInstance->c3_sfEvent);
        chartInstance->c3_LOneCond = 3U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
        c3_b_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_LevelOneAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_b_previousEvent;
        if (chartInstance->c3_is_LOne != c3_IN_CPUCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 110U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_LOne != c3_IN_CPUCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 110U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_CPUCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_LOne = c3_IN_L1Sink;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_L1Sink = 1U;
        }
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 109U,
                     chartInstance->c3_sfEvent);
        c3_h_out = (CV_TRANSITION_EVAL(109U, (int32_T)_SFD_CCP_CALL(109U, 0,
          (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 7) == 0 != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_h_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 109U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_CPUCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 16U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_LOne = c3_IN_MemoryCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 19U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_MemoryCheck = 1U;
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 16U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_HOLD:
    CV_STATE_EVAL(14, 0, 3);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 17U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 134U,
                 chartInstance->c3_sfEvent);
    c3_i_out = (CV_TRANSITION_EVAL(134U, (int32_T)_SFD_CCP_CALL(134U, 0,
      chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_i_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 134U, chartInstance->c3_sfEvent);
      chartInstance->c3_LOneCond = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
      chartInstance->c3_tp_HOLD = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LOne = c3_IN_BatteryDepletionCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 15U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_BatteryDepletionCheck = 1U;
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 17U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_L1Sink:
    CV_STATE_EVAL(14, 0, 4);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 18U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 92U,
                 chartInstance->c3_sfEvent);
    c3_j_out = (CV_TRANSITION_EVAL(92U, (int32_T)_SFD_CCP_CALL(92U, 0,
      chartInstance->c3_sfEvent == c3_event_E_ResetOne != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_j_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 92U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_L1Sink = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LOne = c3_IN_HOLD;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_HOLD = 1U;
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 18U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_MemoryCheck:
    CV_STATE_EVAL(14, 0, 5);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 19U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 124U,
                 chartInstance->c3_sfEvent);
    c3_k_out = (CV_TRANSITION_EVAL(124U, (int32_T)_SFD_CCP_CALL(124U, 0,
      chartInstance->c3_sfEvent == c3_event_E_ResetOne != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_k_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 124U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 179U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 179U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 7U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 165U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 165U, chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 132U,
                   chartInstance->c3_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 132U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_MemoryCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_LOne = c3_IN_HOLD;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_HOLD = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 108U,
                   chartInstance->c3_sfEvent);
      c3_l_out = (CV_TRANSITION_EVAL(108U, (int32_T)_SFD_CCP_CALL(108U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 9) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_l_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 108;
          sf_debug_transition_conflict_check_begin();
          c3_m_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 9) ==
                      0);
          if (c3_m_out) {
            transitionList[numTransitions] = 107;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 108U, chartInstance->c3_sfEvent);
        chartInstance->c3_LOneCond = 4U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
        c3_c_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_LevelOneAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_c_previousEvent;
        if (chartInstance->c3_is_LOne != c3_IN_MemoryCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 108U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_LOne != c3_IN_MemoryCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 108U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_MemoryCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_LOne = c3_IN_L1Sink;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_L1Sink = 1U;
        }
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 107U,
                     chartInstance->c3_sfEvent);
        c3_n_out = (CV_TRANSITION_EVAL(107U, (int32_T)_SFD_CCP_CALL(107U, 0,
          (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 9) == 0 != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_n_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 107U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_MemoryCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_LOne = c3_IN_PumpTempCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 21U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_PumpTempCheck = 1U;
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 19U, chartInstance->c3_sfEvent);
    break;

   case c3_c_IN_Normal:
    CV_STATE_EVAL(14, 0, 6);
    c3_b_Normal(chartInstance);
    break;

   case c3_IN_PumpTempCheck:
    CV_STATE_EVAL(14, 0, 7);
    c3_PumpTempCheck(chartInstance);
    break;

   case c3_IN_RTCCheck:
    CV_STATE_EVAL(14, 0, 8);
    c3_RTCCheck(chartInstance);
    break;

   case c3_IN_WatchdogCheck:
    CV_STATE_EVAL(14, 0, 9);
    c3_WatchdogCheck(chartInstance);
    break;

   default:
    CV_STATE_EVAL(14, 0, 0);
    chartInstance->c3_is_LOne = c3_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c3_sfEvent);
    break;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 14U, chartInstance->c3_sfEvent);
}

static void c3_PumpTempCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  int32_T c3_previousEvent;
  boolean_T c3_d_out;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 21U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 125U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(125U, (int32_T)_SFD_CCP_CALL(125U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetOne != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 125U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 162U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 162U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 179U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 179U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 7U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 7U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 165U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 165U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 132U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 132U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_PumpTempCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_LOne = c3_IN_HOLD;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HOLD = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 106U,
                 chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(106U, (int32_T)_SFD_CCP_CALL(106U, 0,
      (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 10) > 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 106;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 10) ==
                    0);
        if (c3_c_out) {
          transitionList[numTransitions] = 24;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 106U, chartInstance->c3_sfEvent);
      chartInstance->c3_LOneCond = 5U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
      c3_previousEvent = chartInstance->c3_sfEvent;
      chartInstance->c3_sfEvent = c3_event_E_LevelOneAlarm;
      _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                   chartInstance->c3_sfEvent);
      if (chartInstance->c3_is_active_Controller == 0) {
      } else {
        c3_Controller(chartInstance);
      }

      _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_LevelOneAlarm,
                   chartInstance->c3_sfEvent);
      chartInstance->c3_sfEvent = c3_previousEvent;
      if (chartInstance->c3_is_LOne != c3_IN_PumpTempCheck) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 106U, chartInstance->c3_sfEvent);
      }

      if (chartInstance->c3_is_LOne != c3_IN_PumpTempCheck) {
        _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 106U, chartInstance->c3_sfEvent);
      } else {
        chartInstance->c3_tp_PumpTempCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LOne = c3_IN_L1Sink;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_L1Sink = 1U;
      }
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 24U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(24U, (int32_T)_SFD_CCP_CALL(24U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 10) == 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 24U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_PumpTempCheck = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_LOne = c3_IN_WatchdogCheck;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_WatchdogCheck = 1U;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 21U, chartInstance->c3_sfEvent);
}

static void c3_CheckReady(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  boolean_T c3_e_out;
  boolean_T c3_b_temp;
  boolean_T c3_f_out;
  boolean_T c3_g_out;
  boolean_T c3_c_temp;
  boolean_T c3_h_out;
  boolean_T c3_i_out;
  boolean_T c3_j_out;
  boolean_T c3_k_out;
  boolean_T c3_l_out;
  boolean_T c3_m_out;
  boolean_T c3_n_out;
  boolean_T c3_o_out;
  boolean_T c3_p_out;
  boolean_T c3_q_out;
  boolean_T *c3_infusionInProgress;
  c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 1U, chartInstance->c3_sfEvent);
  switch (chartInstance->c3_is_CheckReady) {
   case c3_IN_Checking:
    CV_STATE_EVAL(1, 0, 1);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 2U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 71U,
                 chartInstance->c3_sfEvent);
    c3_out = (CV_TRANSITION_EVAL(71U, (int32_T)_SFD_CCP_CALL(71U, 0,
                chartInstance->c3_sfEvent == c3_event_E_Restart != 0U,
                chartInstance->c3_sfEvent)) != 0);
    if (c3_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 71U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Checking = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_CheckReady = c3_b_IN_Normal;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
      chartInstance->c3_b_tp_Normal = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 141U,
                   chartInstance->c3_sfEvent);
      c3_b_out = (CV_TRANSITION_EVAL(141U, (int32_T)_SFD_CCP_CALL(141U, 0,
        (int16_T)chartInstance->c3_temp > 0 != 0U, chartInstance->c3_sfEvent))
                  != 0);
      if (c3_b_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 141;
          sf_debug_transition_conflict_check_begin();
          c3_c_out = ((int16_T)chartInstance->c3_temp == 0);
          if (c3_c_out) {
            transitionList[numTransitions] = 140;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 141U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_Checking = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_CheckReady = c3_IN_s1;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_s1 = 1U;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 140U,
                     chartInstance->c3_sfEvent);
        c3_d_out = (CV_TRANSITION_EVAL(140U, (int32_T)_SFD_CCP_CALL(140U, 0,
          (int16_T)chartInstance->c3_temp == 0 != 0U, chartInstance->c3_sfEvent))
                    != 0);
        if (c3_d_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 140U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_Checking = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_CheckReady = c3_IN_s2;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_s2 = 1U;
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 2U, chartInstance->c3_sfEvent);
    break;

   case c3_b_IN_Normal:
    CV_STATE_EVAL(1, 0, 2);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 3U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 139U,
                 chartInstance->c3_sfEvent);
    c3_e_out = (CV_TRANSITION_EVAL(139U, (int32_T)_SFD_CCP_CALL(139U, 0,
      chartInstance->c3_sfEvent == c3_event_E_RequestToStart != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_e_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 139U, chartInstance->c3_sfEvent);
      chartInstance->c3_b_tp_Normal = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_CheckReady = c3_IN_Checking;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Checking = 1U;
      c3_enter_atomic_Checking(chartInstance);
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 3U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_s1:
    CV_STATE_EVAL(1, 0, 3);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 4U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 33U,
                 chartInstance->c3_sfEvent);
    c3_b_temp = (_SFD_CCP_CALL(33U, 0, chartInstance->c3_sfEvent ==
      c3_event_E_Clock != 0U, chartInstance->c3_sfEvent) != 0);
    if (c3_b_temp) {
      c3_b_temp = (_SFD_CCP_CALL(33U, 1, (int16_T)*c3_infusionInProgress == 0 !=
        0U, chartInstance->c3_sfEvent) != 0);
    }

    c3_f_out = (CV_TRANSITION_EVAL(33U, (int32_T)c3_b_temp) != 0);
    if (c3_f_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 33;
        sf_debug_transition_conflict_check_begin();
        c3_g_out = ((chartInstance->c3_sfEvent == c3_event_E_Clock) && ((int16_T)*
          c3_infusionInProgress == 1));
        if (c3_g_out) {
          transitionList[numTransitions] = 113;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 33U, chartInstance->c3_sfEvent);
      sf_mex_printf("%s\\n", "E_Ready");
      chartInstance->c3_E_ReadyEventCounter++;
      chartInstance->c3_tp_s1 = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_CheckReady = c3_IN_s1;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_s1 = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 113U,
                   chartInstance->c3_sfEvent);
      c3_c_temp = (_SFD_CCP_CALL(113U, 0, chartInstance->c3_sfEvent ==
        c3_event_E_Clock != 0U, chartInstance->c3_sfEvent) != 0);
      if (c3_c_temp) {
        c3_c_temp = (_SFD_CCP_CALL(113U, 1, (int16_T)*c3_infusionInProgress == 1
          != 0U, chartInstance->c3_sfEvent) != 0);
      }

      c3_h_out = (CV_TRANSITION_EVAL(113U, (int32_T)c3_c_temp) != 0);
      if (c3_h_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 113U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_s1 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_CheckReady = c3_b_IN_Normal;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
        chartInstance->c3_b_tp_Normal = 1U;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 127U,
                     chartInstance->c3_sfEvent);
        c3_i_out = (CV_TRANSITION_EVAL(127U, (int32_T)_SFD_CCP_CALL(127U, 0,
          chartInstance->c3_sfEvent == c3_event_E_RequestToStart != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_i_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[2];
            unsigned int numTransitions = 1;
            transitionList[0] = 127;
            sf_debug_transition_conflict_check_begin();
            c3_j_out = (chartInstance->c3_sfEvent == c3_event_E_Restart);
            if (c3_j_out) {
              transitionList[numTransitions] = 32;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 127U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_s1 = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_CheckReady = c3_IN_Checking;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_Checking = 1U;
          c3_enter_atomic_Checking(chartInstance);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 32U,
                       chartInstance->c3_sfEvent);
          c3_k_out = (CV_TRANSITION_EVAL(32U, (int32_T)_SFD_CCP_CALL(32U, 0,
            chartInstance->c3_sfEvent == c3_event_E_Restart != 0U,
            chartInstance->c3_sfEvent)) != 0);
          if (c3_k_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 32U, chartInstance->c3_sfEvent);
            chartInstance->c3_tp_s1 = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
            chartInstance->c3_is_CheckReady = c3_b_IN_Normal;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
            chartInstance->c3_b_tp_Normal = 1U;
          }
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 4U, chartInstance->c3_sfEvent);
    break;

   case c3_IN_s2:
    CV_STATE_EVAL(1, 0, 4);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 5U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 111U,
                 chartInstance->c3_sfEvent);
    c3_l_out = (CV_TRANSITION_EVAL(111U, (int32_T)_SFD_CCP_CALL(111U, 0,
      chartInstance->c3_sfEvent == c3_event_E_RequestToStart != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_l_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[3];
        unsigned int numTransitions = 1;
        transitionList[0] = 111;
        sf_debug_transition_conflict_check_begin();
        c3_m_out = (chartInstance->c3_sfEvent == c3_event_E_Clock);
        if (c3_m_out) {
          transitionList[numTransitions] = 29;
          numTransitions++;
        }

        c3_n_out = (chartInstance->c3_sfEvent == c3_event_E_Restart);
        if (c3_n_out) {
          transitionList[numTransitions] = 4;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 111U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_s2 = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 5U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_CheckReady = c3_IN_Checking;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_Checking = 1U;
      c3_enter_atomic_Checking(chartInstance);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 29U,
                   chartInstance->c3_sfEvent);
      c3_o_out = (CV_TRANSITION_EVAL(29U, (int32_T)_SFD_CCP_CALL(29U, 0,
        chartInstance->c3_sfEvent == c3_event_E_Clock != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_o_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 29;
          sf_debug_transition_conflict_check_begin();
          c3_p_out = (chartInstance->c3_sfEvent == c3_event_E_Restart);
          if (c3_p_out) {
            transitionList[numTransitions] = 4;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 29U, chartInstance->c3_sfEvent);
        sf_mex_printf("%s\\n", "E_NotReady");
        chartInstance->c3_E_NotReadyEventCounter++;
        chartInstance->c3_tp_s2 = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 5U, chartInstance->c3_sfEvent);
        chartInstance->c3_is_CheckReady = c3_IN_s2;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c3_sfEvent);
        chartInstance->c3_tp_s2 = 1U;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 4U,
                     chartInstance->c3_sfEvent);
        c3_q_out = (CV_TRANSITION_EVAL(4U, (int32_T)_SFD_CCP_CALL(4U, 0,
          chartInstance->c3_sfEvent == c3_event_E_Restart != 0U,
          chartInstance->c3_sfEvent)) != 0);
        if (c3_q_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 4U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_s2 = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 5U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_CheckReady = c3_b_IN_Normal;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c3_sfEvent);
          chartInstance->c3_b_tp_Normal = 1U;
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 5U, chartInstance->c3_sfEvent);
    break;

   default:
    CV_STATE_EVAL(1, 0, 0);
    chartInstance->c3_is_CheckReady = c3_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
    break;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 1U, chartInstance->c3_sfEvent);
}

static void c3_b_PumpTempCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  c3_HardwareSensorSignals *c3_hardwareSenData;
  c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 57U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 90U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(90U, (int32_T)_SFD_CCP_CALL(90U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 90U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 2U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 0U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 0U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 190U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 190U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 189U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 189U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_b_tp_PumpTempCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 57U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 205U,
                 chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(205U, (int32_T)_SFD_CCP_CALL(205U, 0,
      (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 11) == 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 205;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 11) >
                    0);
        if (c3_c_out) {
          transitionList[numTransitions] = 85;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 205U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 23U);
      chartInstance->c3_b_tp_PumpTempCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 57U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_EnvTempCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 49U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_EnvTempCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 85U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(85U, (int32_T)_SFD_CCP_CALL(85U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_hardwareSenData + 11) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 85U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 79U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 79U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 23U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_b_IN_PumpTempCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 79U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_b_IN_PumpTempCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 79U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_b_tp_PumpTempCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 57U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_IN_EnvTempCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 49U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_EnvTempCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 57U, chartInstance->c3_sfEvent);
}

static void c3_EnvTempCheck(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  boolean_T c3_d_out;
  int32_T c3_previousEvent;
  c3_EnvironmentSensorSignals *c3_envSenData;
  c3_envSenData = (c3_EnvironmentSensorSignals *)ssGetInputPortSignal
    (chartInstance->S, 3);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 49U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 194U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(194U, (int32_T)_SFD_CCP_CALL(194U, 0,
              chartInstance->c3_sfEvent == c3_event_E_ResetThree != 0U,
              chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 194U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 197U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 197U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 2U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 2U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 0U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 0U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 190U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 190U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 189U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 189U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U,
                 chartInstance->c3_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_EnvTempCheck = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 49U, chartInstance->c3_sfEvent);
    chartInstance->c3_is_WRN = c3_IN_HoldOn;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c3_sfEvent);
    chartInstance->c3_tp_HoldOn = 1U;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 206U,
                 chartInstance->c3_sfEvent);
    c3_b_out = (CV_TRANSITION_EVAL(206U, (int32_T)_SFD_CCP_CALL(206U, 0,
      (int16_T)*(boolean_T *)((char_T *)c3_envSenData + 0) == 0 != 0U,
      chartInstance->c3_sfEvent)) != 0);
    if (c3_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 206;
        sf_debug_transition_conflict_check_begin();
        c3_c_out = ((int16_T)*(boolean_T *)((char_T *)c3_envSenData + 0) > 0);
        if (c3_c_out) {
          transitionList[numTransitions] = 195;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 206U, chartInstance->c3_sfEvent);
      c3_clearWarning(chartInstance, 24U);
      chartInstance->c3_tp_EnvTempCheck = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 49U, chartInstance->c3_sfEvent);
      chartInstance->c3_is_WRN = c3_IN_HumidityCheck;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 52U, chartInstance->c3_sfEvent);
      chartInstance->c3_tp_HumidityCheck = 1U;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 195U,
                   chartInstance->c3_sfEvent);
      c3_d_out = (CV_TRANSITION_EVAL(195U, (int32_T)_SFD_CCP_CALL(195U, 0,
        (int16_T)*(boolean_T *)((char_T *)c3_envSenData + 0) > 0 != 0U,
        chartInstance->c3_sfEvent)) != 0);
      if (c3_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 195U, chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 196U,
                     chartInstance->c3_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 196U, chartInstance->c3_sfEvent);
        chartInstance->c3_WnCond = 24U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
        c3_previousEvent = chartInstance->c3_sfEvent;
        chartInstance->c3_sfEvent = c3_event_E_WarningAlarm;
        _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        if (chartInstance->c3_is_active_Controller == 0) {
        } else {
          c3_Controller(chartInstance);
        }

        _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c3_event_E_WarningAlarm,
                     chartInstance->c3_sfEvent);
        chartInstance->c3_sfEvent = c3_previousEvent;
        if (chartInstance->c3_is_WRN != c3_IN_EnvTempCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 196U, chartInstance->c3_sfEvent);
        }

        if (chartInstance->c3_is_WRN != c3_IN_EnvTempCheck) {
          _SFD_CT_CALL(TRANSITION_INACTIVE_TAG, 196U, chartInstance->c3_sfEvent);
        } else {
          chartInstance->c3_tp_EnvTempCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 49U, chartInstance->c3_sfEvent);
          chartInstance->c3_is_WRN = c3_IN_HumidityCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 52U, chartInstance->c3_sfEvent);
          chartInstance->c3_tp_HumidityCheck = 1U;
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 49U, chartInstance->c3_sfEvent);
}

static void init_script_number_translation(uint32_T c3_machineNumber, uint32_T
  c3_chartNumber)
{
}

const mxArray *sf_c3_GPCA_Extension_get_eml_resolved_functions_info(void)
{
  const mxArray *c3_nameCaptureInfo = NULL;
  c3_nameCaptureInfo = NULL;
  sf_mex_assign(&c3_nameCaptureInfo, sf_mex_create("nameCaptureInfo", NULL, 0,
    0U, 1U, 0U, 2, 0, 1), FALSE);
  return c3_nameCaptureInfo;
}

static uint32_T c3_clearWarning(SFc3_GPCA_ExtensionInstanceStruct *chartInstance,
  uint32_T c3_cond)
{
  uint32_T c3_x;
  boolean_T c3_out;
  boolean_T c3_b_out;
  boolean_T c3_c_out;
  real_T c3_d0;
  real_T *c3_ErrCond;
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c3_x, c3_sf_marshallOut,
    c3_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("cond", &c3_cond, c3_sf_marshallOut,
    c3_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK((real_T)c3_cond, 13U);
  _SFD_SET_DATA_VALUE_PTR(14U, &c3_x);
  _SFD_SET_DATA_VALUE_PTR(13U, &c3_cond);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 60U, chartInstance->c3_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 60U, chartInstance->c3_sfEvent);
  c3_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c3_x, 14U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 171U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 171U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 169U, chartInstance->c3_sfEvent);
  c3_out = (CV_TRANSITION_EVAL(169U, (int32_T)_SFD_CCP_CALL(169U, 0, *c3_ErrCond
              != (real_T)c3_cond != 0U, chartInstance->c3_sfEvent)) != 0);
  if (c3_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 169;
      sf_debug_transition_conflict_check_begin();
      c3_b_out = (*c3_ErrCond == (real_T)c3_cond);
      if (c3_b_out) {
        transitionList[numTransitions] = 170;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 169U, chartInstance->c3_sfEvent);
    c3_x = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)c3_x, 14U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 170U,
                 chartInstance->c3_sfEvent);
    c3_c_out = (CV_TRANSITION_EVAL(170U, (int32_T)_SFD_CCP_CALL(170U, 0,
      *c3_ErrCond == (real_T)c3_cond != 0U, chartInstance->c3_sfEvent)) != 0);
    if (c3_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 170U, chartInstance->c3_sfEvent);
      c3_d0 = (real_T)c3_const_MSG_BLANK;
      sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c3_d0, 0, 0U, 0U, 0U,
        0), 0);
      *c3_ErrCond = 0.0;
      _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 60U, chartInstance->c3_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(14U);
  _SFD_UNSET_DATA_VALUE_PTR(13U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 60U, chartInstance->c3_sfEvent);
  sf_debug_symbol_scope_pop();
  return c3_x;
}

static uint32_T c3_initiate(SFc3_GPCA_ExtensionInstanceStruct *chartInstance)
{
  uint32_T c3_x;
  real_T *c3_ErrCond;
  c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c3_x, c3_sf_marshallOut,
    c3_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(12U, &c3_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 61U, chartInstance->c3_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 61U, chartInstance->c3_sfEvent);
  c3_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c3_x, 12U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 21U, chartInstance->c3_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 21U, chartInstance->c3_sfEvent);
  chartInstance->c3_LOneCond = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LOneCond, 5U);
  chartInstance->c3_LTwoCond = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_LTwoCond, 6U);
  chartInstance->c3_WnCond = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c3_WnCond, 7U);
  *c3_ErrCond = 0.0;
  _SFD_DATA_RANGE_CHECK(*c3_ErrCond, 2U);
  c3_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c3_x, 12U);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 61U, chartInstance->c3_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(12U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 61U, chartInstance->c3_sfEvent);
  sf_debug_symbol_scope_pop();
  return c3_x;
}

static const mxArray *c3_sf_marshallOut(void *chartInstanceVoid, void *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  uint32_T c3_u;
  const mxArray *c3_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(uint32_T *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_create("y", &c3_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static uint32_T c3_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_b_E_AlarmEventCounter, const char_T
  *c3_identifier)
{
  uint32_T c3_y;
  emlrtMsgIdentifier c3_thisId;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_b_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c3_b_E_AlarmEventCounter), &c3_thisId);
  sf_mex_destroy(&c3_b_E_AlarmEventCounter);
  return c3_y;
}

static uint32_T c3_b_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId)
{
  uint32_T c3_y;
  uint32_T c3_u0;
  sf_mex_import(c3_parentId, sf_mex_dup(c3_u), &c3_u0, 1, 7, 0U, 0, 0U, 0);
  c3_y = c3_u0;
  sf_mex_destroy(&c3_u);
  return c3_y;
}

static void c3_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData)
{
  const mxArray *c3_b_E_AlarmEventCounter;
  const char_T *c3_identifier;
  emlrtMsgIdentifier c3_thisId;
  uint32_T c3_y;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_b_E_AlarmEventCounter = sf_mex_dup(c3_mxArrayInData);
  c3_identifier = c3_varName;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_b_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c3_b_E_AlarmEventCounter), &c3_thisId);
  sf_mex_destroy(&c3_b_E_AlarmEventCounter);
  *(uint32_T *)c3_outData = c3_y;
  sf_mex_destroy(&c3_mxArrayInData);
}

static const mxArray *c3_b_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  int8_T c3_u;
  const mxArray *c3_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(int8_T *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_create("y", &c3_u, 2, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static int8_T c3_c_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId)
{
  int8_T c3_y;
  int8_T c3_i0;
  sf_mex_import(c3_parentId, sf_mex_dup(c3_u), &c3_i0, 1, 2, 0U, 0, 0U, 0);
  c3_y = c3_i0;
  sf_mex_destroy(&c3_u);
  return c3_y;
}

static void c3_b_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData)
{
  const mxArray *c3_E_Restart;
  const char_T *c3_identifier;
  emlrtMsgIdentifier c3_thisId;
  int8_T c3_y;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_E_Restart = sf_mex_dup(c3_mxArrayInData);
  c3_identifier = c3_varName;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_c_emlrt_marshallIn(chartInstance, sf_mex_dup(c3_E_Restart),
    &c3_thisId);
  sf_mex_destroy(&c3_E_Restart);
  *(int8_T *)c3_outData = c3_y;
  sf_mex_destroy(&c3_mxArrayInData);
}

static const mxArray *c3_c_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  int32_T c3_u;
  const mxArray *c3_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(int32_T *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_create("y", &c3_u, 6, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static int32_T c3_d_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId)
{
  int32_T c3_y;
  int32_T c3_i1;
  sf_mex_import(c3_parentId, sf_mex_dup(c3_u), &c3_i1, 1, 6, 0U, 0, 0U, 0);
  c3_y = c3_i1;
  sf_mex_destroy(&c3_u);
  return c3_y;
}

static void c3_c_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData)
{
  const mxArray *c3_b_sfEvent;
  const char_T *c3_identifier;
  emlrtMsgIdentifier c3_thisId;
  int32_T c3_y;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_b_sfEvent = sf_mex_dup(c3_mxArrayInData);
  c3_identifier = c3_varName;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_d_emlrt_marshallIn(chartInstance, sf_mex_dup(c3_b_sfEvent),
    &c3_thisId);
  sf_mex_destroy(&c3_b_sfEvent);
  *(int32_T *)c3_outData = c3_y;
  sf_mex_destroy(&c3_mxArrayInData);
}

static const mxArray *c3_d_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  uint8_T c3_u;
  const mxArray *c3_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(uint8_T *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_create("y", &c3_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static uint8_T c3_e_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_b_tp_HumidityCheck, const char_T
  *c3_identifier)
{
  uint8_T c3_y;
  emlrtMsgIdentifier c3_thisId;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_f_emlrt_marshallIn(chartInstance, sf_mex_dup(c3_b_tp_HumidityCheck),
    &c3_thisId);
  sf_mex_destroy(&c3_b_tp_HumidityCheck);
  return c3_y;
}

static uint8_T c3_f_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId)
{
  uint8_T c3_y;
  uint8_T c3_u1;
  sf_mex_import(c3_parentId, sf_mex_dup(c3_u), &c3_u1, 1, 3, 0U, 0, 0U, 0);
  c3_y = c3_u1;
  sf_mex_destroy(&c3_u);
  return c3_y;
}

static void c3_d_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData)
{
  const mxArray *c3_b_tp_HumidityCheck;
  const char_T *c3_identifier;
  emlrtMsgIdentifier c3_thisId;
  uint8_T c3_y;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_b_tp_HumidityCheck = sf_mex_dup(c3_mxArrayInData);
  c3_identifier = c3_varName;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_f_emlrt_marshallIn(chartInstance, sf_mex_dup(c3_b_tp_HumidityCheck),
    &c3_thisId);
  sf_mex_destroy(&c3_b_tp_HumidityCheck);
  *(uint8_T *)c3_outData = c3_y;
  sf_mex_destroy(&c3_mxArrayInData);
}

static const mxArray *c3_e_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  boolean_T c3_u;
  const mxArray *c3_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(boolean_T *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_create("y", &c3_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static const mxArray *c3_f_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  real_T c3_u;
  const mxArray *c3_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(real_T *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_create("y", &c3_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static real_T c3_g_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_ErrCond, const char_T *c3_identifier)
{
  real_T c3_y;
  emlrtMsgIdentifier c3_thisId;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_h_emlrt_marshallIn(chartInstance, sf_mex_dup(c3_ErrCond), &c3_thisId);
  sf_mex_destroy(&c3_ErrCond);
  return c3_y;
}

static real_T c3_h_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId)
{
  real_T c3_y;
  real_T c3_d1;
  sf_mex_import(c3_parentId, sf_mex_dup(c3_u), &c3_d1, 1, 0, 0U, 0, 0U, 0);
  c3_y = c3_d1;
  sf_mex_destroy(&c3_u);
  return c3_y;
}

static void c3_e_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData)
{
  const mxArray *c3_ErrCond;
  const char_T *c3_identifier;
  emlrtMsgIdentifier c3_thisId;
  real_T c3_y;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_ErrCond = sf_mex_dup(c3_mxArrayInData);
  c3_identifier = c3_varName;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_h_emlrt_marshallIn(chartInstance, sf_mex_dup(c3_ErrCond), &c3_thisId);
  sf_mex_destroy(&c3_ErrCond);
  *(real_T *)c3_outData = c3_y;
  sf_mex_destroy(&c3_mxArrayInData);
}

static const mxArray *c3_envSenData_bus_io(void *chartInstanceVoid, void
  *c3_pData)
{
  const mxArray *c3_mxVal = NULL;
  c3_EnvironmentSensorSignals c3_tmp;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxVal = NULL;
  c3_tmp.isTemperatureOutOfRange = *(boolean_T *)((char_T *)c3_pData + 0);
  c3_tmp.isHumidityOutOfRange = *(boolean_T *)((char_T *)c3_pData + 1);
  c3_tmp.isAirPressureOutOfRange = *(boolean_T *)((char_T *)c3_pData + 2);
  sf_mex_assign(&c3_mxVal, c3_g_sf_marshallOut(chartInstance, &c3_tmp), FALSE);
  return c3_mxVal;
}

static const mxArray *c3_g_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  c3_EnvironmentSensorSignals c3_u;
  const mxArray *c3_y = NULL;
  boolean_T c3_b_u;
  const mxArray *c3_b_y = NULL;
  boolean_T c3_c_u;
  const mxArray *c3_c_y = NULL;
  boolean_T c3_d_u;
  const mxArray *c3_d_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(c3_EnvironmentSensorSignals *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c3_b_u = c3_u.isTemperatureOutOfRange;
  c3_b_y = NULL;
  sf_mex_assign(&c3_b_y, sf_mex_create("y", &c3_b_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_b_y, "isTemperatureOutOfRange",
                  "isTemperatureOutOfRange", 0);
  c3_c_u = c3_u.isHumidityOutOfRange;
  c3_c_y = NULL;
  sf_mex_assign(&c3_c_y, sf_mex_create("y", &c3_c_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_c_y, "isHumidityOutOfRange", "isHumidityOutOfRange",
                  0);
  c3_d_u = c3_u.isAirPressureOutOfRange;
  c3_d_y = NULL;
  sf_mex_assign(&c3_d_y, sf_mex_create("y", &c3_d_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_d_y, "isAirPressureOutOfRange",
                  "isAirPressureOutOfRange", 0);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static const mxArray *c3_hardwareSenData_bus_io(void *chartInstanceVoid, void
  *c3_pData)
{
  const mxArray *c3_mxVal = NULL;
  c3_HardwareSensorSignals c3_tmp;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxVal = NULL;
  c3_tmp.isLoggingFailed = *(boolean_T *)((char_T *)c3_pData + 0);
  c3_tmp.isWatchDogInterruptDetected = *(boolean_T *)((char_T *)c3_pData + 1);
  c3_tmp.isReservoirDoorOpen = *(boolean_T *)((char_T *)c3_pData + 2);
  c3_tmp.isBatteryDepleted = *(boolean_T *)((char_T *)c3_pData + 3);
  c3_tmp.isBatteryLow = *(boolean_T *)((char_T *)c3_pData + 4);
  c3_tmp.isBatteryUnableToCharge = *(boolean_T *)((char_T *)c3_pData + 5);
  c3_tmp.isSupplyVoltageOutOfRange = *(boolean_T *)((char_T *)c3_pData + 6);
  c3_tmp.isCPUInError = *(boolean_T *)((char_T *)c3_pData + 7);
  c3_tmp.isRTCInError = *(boolean_T *)((char_T *)c3_pData + 8);
  c3_tmp.isMemoryCorrupted = *(boolean_T *)((char_T *)c3_pData + 9);
  c3_tmp.isPumpTooHot = *(boolean_T *)((char_T *)c3_pData + 10);
  c3_tmp.isPumpOverheated = *(boolean_T *)((char_T *)c3_pData + 11);
  sf_mex_assign(&c3_mxVal, c3_h_sf_marshallOut(chartInstance, &c3_tmp), FALSE);
  return c3_mxVal;
}

static const mxArray *c3_h_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  c3_HardwareSensorSignals c3_u;
  const mxArray *c3_y = NULL;
  boolean_T c3_b_u;
  const mxArray *c3_b_y = NULL;
  boolean_T c3_c_u;
  const mxArray *c3_c_y = NULL;
  boolean_T c3_d_u;
  const mxArray *c3_d_y = NULL;
  boolean_T c3_e_u;
  const mxArray *c3_e_y = NULL;
  boolean_T c3_f_u;
  const mxArray *c3_f_y = NULL;
  boolean_T c3_g_u;
  const mxArray *c3_g_y = NULL;
  boolean_T c3_h_u;
  const mxArray *c3_h_y = NULL;
  boolean_T c3_i_u;
  const mxArray *c3_i_y = NULL;
  boolean_T c3_j_u;
  const mxArray *c3_j_y = NULL;
  boolean_T c3_k_u;
  const mxArray *c3_k_y = NULL;
  boolean_T c3_l_u;
  const mxArray *c3_l_y = NULL;
  boolean_T c3_m_u;
  const mxArray *c3_m_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(c3_HardwareSensorSignals *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c3_b_u = c3_u.isLoggingFailed;
  c3_b_y = NULL;
  sf_mex_assign(&c3_b_y, sf_mex_create("y", &c3_b_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_b_y, "isLoggingFailed", "isLoggingFailed", 0);
  c3_c_u = c3_u.isWatchDogInterruptDetected;
  c3_c_y = NULL;
  sf_mex_assign(&c3_c_y, sf_mex_create("y", &c3_c_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_c_y, "isWatchDogInterruptDetected",
                  "isWatchDogInterruptDetected", 0);
  c3_d_u = c3_u.isReservoirDoorOpen;
  c3_d_y = NULL;
  sf_mex_assign(&c3_d_y, sf_mex_create("y", &c3_d_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_d_y, "isReservoirDoorOpen", "isReservoirDoorOpen", 0);
  c3_e_u = c3_u.isBatteryDepleted;
  c3_e_y = NULL;
  sf_mex_assign(&c3_e_y, sf_mex_create("y", &c3_e_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_e_y, "isBatteryDepleted", "isBatteryDepleted", 0);
  c3_f_u = c3_u.isBatteryLow;
  c3_f_y = NULL;
  sf_mex_assign(&c3_f_y, sf_mex_create("y", &c3_f_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_f_y, "isBatteryLow", "isBatteryLow", 0);
  c3_g_u = c3_u.isBatteryUnableToCharge;
  c3_g_y = NULL;
  sf_mex_assign(&c3_g_y, sf_mex_create("y", &c3_g_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_g_y, "isBatteryUnableToCharge",
                  "isBatteryUnableToCharge", 0);
  c3_h_u = c3_u.isSupplyVoltageOutOfRange;
  c3_h_y = NULL;
  sf_mex_assign(&c3_h_y, sf_mex_create("y", &c3_h_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_h_y, "isSupplyVoltageOutOfRange",
                  "isSupplyVoltageOutOfRange", 0);
  c3_i_u = c3_u.isCPUInError;
  c3_i_y = NULL;
  sf_mex_assign(&c3_i_y, sf_mex_create("y", &c3_i_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_i_y, "isCPUInError", "isCPUInError", 0);
  c3_j_u = c3_u.isRTCInError;
  c3_j_y = NULL;
  sf_mex_assign(&c3_j_y, sf_mex_create("y", &c3_j_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_j_y, "isRTCInError", "isRTCInError", 0);
  c3_k_u = c3_u.isMemoryCorrupted;
  c3_k_y = NULL;
  sf_mex_assign(&c3_k_y, sf_mex_create("y", &c3_k_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_k_y, "isMemoryCorrupted", "isMemoryCorrupted", 0);
  c3_l_u = c3_u.isPumpTooHot;
  c3_l_y = NULL;
  sf_mex_assign(&c3_l_y, sf_mex_create("y", &c3_l_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_l_y, "isPumpTooHot", "isPumpTooHot", 0);
  c3_m_u = c3_u.isPumpOverheated;
  c3_m_y = NULL;
  sf_mex_assign(&c3_m_y, sf_mex_create("y", &c3_m_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_m_y, "isPumpOverheated", "isPumpOverheated", 0);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static const mxArray *c3_infuSenData_bus_io(void *chartInstanceVoid, void
  *c3_pData)
{
  const mxArray *c3_mxVal = NULL;
  c3_InfusionSensorSignals c3_tmp;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxVal = NULL;
  c3_tmp.isReservoirEmpty = *(boolean_T *)((char_T *)c3_pData + 0);
  c3_tmp.isReservoirLow = *(boolean_T *)((char_T *)c3_pData + 1);
  c3_tmp.isOcclusionDetected = *(boolean_T *)((char_T *)c3_pData + 2);
  c3_tmp.isInfusionRateTooHigh = *(boolean_T *)((char_T *)c3_pData + 3);
  c3_tmp.isInfusionRateTooLow = *(boolean_T *)((char_T *)c3_pData + 4);
  c3_tmp.isInfusionRateLessThanKVO = *(boolean_T *)((char_T *)c3_pData + 5);
  c3_tmp.isFlowRateNotStable = *(boolean_T *)((char_T *)c3_pData + 6);
  c3_tmp.isFlowRateOverPumpCapacity = *(boolean_T *)((char_T *)c3_pData + 7);
  c3_tmp.isInfusionPausedLong = *(boolean_T *)((char_T *)c3_pData + 8);
  c3_tmp.isInfusionPausedTooLong = *(boolean_T *)((char_T *)c3_pData + 9);
  c3_tmp.isAirInLineDetected = *(boolean_T *)((char_T *)c3_pData + 10);
  sf_mex_assign(&c3_mxVal, c3_i_sf_marshallOut(chartInstance, &c3_tmp), FALSE);
  return c3_mxVal;
}

static const mxArray *c3_i_sf_marshallOut(void *chartInstanceVoid, void
  *c3_inData)
{
  const mxArray *c3_mxArrayOutData = NULL;
  c3_InfusionSensorSignals c3_u;
  const mxArray *c3_y = NULL;
  boolean_T c3_b_u;
  const mxArray *c3_b_y = NULL;
  boolean_T c3_c_u;
  const mxArray *c3_c_y = NULL;
  boolean_T c3_d_u;
  const mxArray *c3_d_y = NULL;
  boolean_T c3_e_u;
  const mxArray *c3_e_y = NULL;
  boolean_T c3_f_u;
  const mxArray *c3_f_y = NULL;
  boolean_T c3_g_u;
  const mxArray *c3_g_y = NULL;
  boolean_T c3_h_u;
  const mxArray *c3_h_y = NULL;
  boolean_T c3_i_u;
  const mxArray *c3_i_y = NULL;
  boolean_T c3_j_u;
  const mxArray *c3_j_y = NULL;
  boolean_T c3_k_u;
  const mxArray *c3_k_y = NULL;
  boolean_T c3_l_u;
  const mxArray *c3_l_y = NULL;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_mxArrayOutData = NULL;
  c3_u = *(c3_InfusionSensorSignals *)c3_inData;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c3_b_u = c3_u.isReservoirEmpty;
  c3_b_y = NULL;
  sf_mex_assign(&c3_b_y, sf_mex_create("y", &c3_b_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_b_y, "isReservoirEmpty", "isReservoirEmpty", 0);
  c3_c_u = c3_u.isReservoirLow;
  c3_c_y = NULL;
  sf_mex_assign(&c3_c_y, sf_mex_create("y", &c3_c_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_c_y, "isReservoirLow", "isReservoirLow", 0);
  c3_d_u = c3_u.isOcclusionDetected;
  c3_d_y = NULL;
  sf_mex_assign(&c3_d_y, sf_mex_create("y", &c3_d_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_d_y, "isOcclusionDetected", "isOcclusionDetected", 0);
  c3_e_u = c3_u.isInfusionRateTooHigh;
  c3_e_y = NULL;
  sf_mex_assign(&c3_e_y, sf_mex_create("y", &c3_e_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_e_y, "isInfusionRateTooHigh", "isInfusionRateTooHigh",
                  0);
  c3_f_u = c3_u.isInfusionRateTooLow;
  c3_f_y = NULL;
  sf_mex_assign(&c3_f_y, sf_mex_create("y", &c3_f_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_f_y, "isInfusionRateTooLow", "isInfusionRateTooLow",
                  0);
  c3_g_u = c3_u.isInfusionRateLessThanKVO;
  c3_g_y = NULL;
  sf_mex_assign(&c3_g_y, sf_mex_create("y", &c3_g_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_g_y, "isInfusionRateLessThanKVO",
                  "isInfusionRateLessThanKVO", 0);
  c3_h_u = c3_u.isFlowRateNotStable;
  c3_h_y = NULL;
  sf_mex_assign(&c3_h_y, sf_mex_create("y", &c3_h_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_h_y, "isFlowRateNotStable", "isFlowRateNotStable", 0);
  c3_i_u = c3_u.isFlowRateOverPumpCapacity;
  c3_i_y = NULL;
  sf_mex_assign(&c3_i_y, sf_mex_create("y", &c3_i_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_i_y, "isFlowRateOverPumpCapacity",
                  "isFlowRateOverPumpCapacity", 0);
  c3_j_u = c3_u.isInfusionPausedLong;
  c3_j_y = NULL;
  sf_mex_assign(&c3_j_y, sf_mex_create("y", &c3_j_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_j_y, "isInfusionPausedLong", "isInfusionPausedLong",
                  0);
  c3_k_u = c3_u.isInfusionPausedTooLong;
  c3_k_y = NULL;
  sf_mex_assign(&c3_k_y, sf_mex_create("y", &c3_k_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_k_y, "isInfusionPausedTooLong",
                  "isInfusionPausedTooLong", 0);
  c3_l_u = c3_u.isAirInLineDetected;
  c3_l_y = NULL;
  sf_mex_assign(&c3_l_y, sf_mex_create("y", &c3_l_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c3_y, c3_l_y, "isAirInLineDetected", "isAirInLineDetected", 0);
  sf_mex_assign(&c3_mxArrayOutData, c3_y, FALSE);
  return c3_mxArrayOutData;
}

static boolean_T c3_i_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_b_temp, const char_T *c3_identifier)
{
  boolean_T c3_y;
  emlrtMsgIdentifier c3_thisId;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_j_emlrt_marshallIn(chartInstance, sf_mex_dup(c3_b_temp), &c3_thisId);
  sf_mex_destroy(&c3_b_temp);
  return c3_y;
}

static boolean_T c3_j_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId)
{
  boolean_T c3_y;
  boolean_T c3_b0;
  sf_mex_import(c3_parentId, sf_mex_dup(c3_u), &c3_b0, 1, 11, 0U, 0, 0U, 0);
  c3_y = c3_b0;
  sf_mex_destroy(&c3_u);
  return c3_y;
}

static void c3_f_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c3_mxArrayInData, const char_T *c3_varName, void *c3_outData)
{
  const mxArray *c3_b_temp;
  const char_T *c3_identifier;
  emlrtMsgIdentifier c3_thisId;
  boolean_T c3_y;
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c3_b_temp = sf_mex_dup(c3_mxArrayInData);
  c3_identifier = c3_varName;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  c3_y = c3_j_emlrt_marshallIn(chartInstance, sf_mex_dup(c3_b_temp), &c3_thisId);
  sf_mex_destroy(&c3_b_temp);
  *(boolean_T *)c3_outData = c3_y;
  sf_mex_destroy(&c3_mxArrayInData);
}

static const mxArray *c3_k_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_b_setSimStateSideEffectsInfo, const char_T
  *c3_identifier)
{
  const mxArray *c3_y = NULL;
  emlrtMsgIdentifier c3_thisId;
  c3_y = NULL;
  c3_thisId.fIdentifier = c3_identifier;
  c3_thisId.fParent = NULL;
  sf_mex_assign(&c3_y, c3_l_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c3_b_setSimStateSideEffectsInfo), &c3_thisId), FALSE);
  sf_mex_destroy(&c3_b_setSimStateSideEffectsInfo);
  return c3_y;
}

static const mxArray *c3_l_emlrt_marshallIn(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c3_u, const emlrtMsgIdentifier *c3_parentId)
{
  const mxArray *c3_y = NULL;
  c3_y = NULL;
  sf_mex_assign(&c3_y, sf_mex_duplicatearraysafe(&c3_u), FALSE);
  sf_mex_destroy(&c3_u);
  return c3_y;
}

static void init_dsm_address_info(SFc3_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
}

/* SFunction Glue Code */
void sf_c3_GPCA_Extension_get_check_sum(mxArray *plhs[])
{
  ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(113033476U);
  ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(125347853U);
  ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(814857584U);
  ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(573458053U);
}

mxArray *sf_c3_GPCA_Extension_get_autoinheritance_info(void)
{
  const char *autoinheritanceFields[] = { "checksum", "inputs", "parameters",
    "outputs", "locals" };

  mxArray *mxAutoinheritanceInfo = mxCreateStructMatrix(1,1,5,
    autoinheritanceFields);

  {
    mxArray *mxChecksum = mxCreateString("ZBbcOrlmRMQ03Mz2ECdbWE");
    mxSetField(mxAutoinheritanceInfo,0,"checksum",mxChecksum);
  }

  {
    const char *dataFields[] = { "size", "type", "complexity" };

    mxArray *mxData = mxCreateStructMatrix(1,6,3,dataFields);

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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(7));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,0,"type",mxType);
    }

    mxSetField(mxData,0,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,1,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(1));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,1,"type",mxType);
    }

    mxSetField(mxData,1,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,2,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(1));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,2,"type",mxType);
    }

    mxSetField(mxData,2,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,3,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,3,"type",mxType);
    }

    mxSetField(mxData,3,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,4,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,4,"type",mxType);
    }

    mxSetField(mxData,4,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,5,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,5,"type",mxType);
    }

    mxSetField(mxData,5,"complexity",mxCreateDoubleScalar(0));
    mxSetField(mxAutoinheritanceInfo,0,"inputs",mxData);
  }

  {
    mxSetField(mxAutoinheritanceInfo,0,"parameters",mxCreateDoubleMatrix(0,0,
                mxREAL));
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
    mxSetField(mxAutoinheritanceInfo,0,"outputs",mxData);
  }

  {
    mxSetField(mxAutoinheritanceInfo,0,"locals",mxCreateDoubleMatrix(0,0,mxREAL));
  }

  return(mxAutoinheritanceInfo);
}

static const mxArray *sf_get_sim_state_info_c3_GPCA_Extension(void)
{
  const char *infoFields[] = { "chartChecksum", "varInfo" };

  mxArray *mxInfo = mxCreateStructMatrix(1, 1, 2, infoFields);
  const char *infoEncStr[] = {
    "100 S1x10'type','srcId','name','auxInfo'{{M[1],M[346],T\"ErrCond\",},{M[3],M[349],T\"LOneCond\",},{M[3],M[350],T\"LTwoCond\",},{M[3],M[351],T\"WnCond\",},{M[3],M[355],T\"temp\",},{M[6],M[360],T\"E_Alarm\",},{M[6],M[377],T\"E_NotReady\",},{M[6],M[376],T\"E_Ready\",},{M[6],M[363],T\"E_Warning\",},{M[7],M[360],T\"E_AlarmEventCounter\",}}",
    "100 S1x10'type','srcId','name','auxInfo'{{M[7],M[377],T\"E_NotReadyEventCounter\",},{M[7],M[376],T\"E_ReadyEventCounter\",},{M[7],M[363],T\"E_WarningEventCounter\",},{M[8],M[0],T\"is_active_c3_GPCA_Extension\",},{M[8],M[14],T\"is_active_WRN\",},{M[8],M[29],T\"is_active_Controller\",},{M[8],M[37],T\"is_active_LTwo\",},{M[8],M[53],T\"is_active_LOne\",},{M[8],M[60],T\"is_active_CheckReady\",},{M[9],M[0],T\"is_c3_GPCA_Extension\",}}",
    "100 S1x5'type','srcId','name','auxInfo'{{M[9],M[14],T\"is_WRN\",},{M[9],M[29],T\"is_Controller\",},{M[9],M[37],T\"is_LTwo\",},{M[9],M[53],T\"is_LOne\",},{M[9],M[60],T\"is_CheckReady\",}}"
  };

  mxArray *mxVarInfo = sf_mex_decode_encoded_mx_struct_array(infoEncStr, 25, 10);
  mxArray *mxChecksum = mxCreateDoubleMatrix(1, 4, mxREAL);
  sf_c3_GPCA_Extension_get_check_sum(&mxChecksum);
  mxSetField(mxInfo, 0, infoFields[0], mxChecksum);
  mxSetField(mxInfo, 0, infoFields[1], mxVarInfo);
  return mxInfo;
}

static void chart_debug_initialization(SimStruct *S, unsigned int
  fullDebuggerInitialization)
{
  if (!sim_mode_is_rtw_gen(S)) {
    SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
    chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *) ((ChartInfoStruct *)
      (ssGetUserData(S)))->chartInstance;
    if (ssIsFirstInitCond(S) && fullDebuggerInitialization==1) {
      /* do this only if simulation is starting */
      {
        unsigned int chartAlreadyPresent;
        chartAlreadyPresent = sf_debug_initialize_chart
          (_GPCA_ExtensionMachineNumber_,
           3,
           63,
           209,
           16,
           18,
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
          init_script_number_translation(_GPCA_ExtensionMachineNumber_,
            chartInstance->chartNumber);
          sf_debug_set_chart_disable_implicit_casting
            (_GPCA_ExtensionMachineNumber_,chartInstance->chartNumber,1);
          sf_debug_set_chart_event_thresholds(_GPCA_ExtensionMachineNumber_,
            chartInstance->chartNumber,
            18,
            18,
            18);
          _SFD_SET_DATA_PROPS(0,1,1,0,"ClearCond");
          _SFD_SET_DATA_PROPS(1,1,1,0,"infusionInProgress");
          _SFD_SET_DATA_PROPS(2,2,0,1,"ErrCond");
          _SFD_SET_DATA_PROPS(3,1,1,0,"infusionPaused");
          _SFD_SET_DATA_PROPS(4,1,1,0,"envSenData");
          _SFD_SET_DATA_PROPS(5,0,0,0,"LOneCond");
          _SFD_SET_DATA_PROPS(6,0,0,0,"LTwoCond");
          _SFD_SET_DATA_PROPS(7,0,0,0,"WnCond");
          _SFD_SET_DATA_PROPS(8,7,0,0,"MSG_BLANK");
          _SFD_SET_DATA_PROPS(9,1,1,0,"hardwareSenData");
          _SFD_SET_DATA_PROPS(10,1,1,0,"infuSenData");
          _SFD_SET_DATA_PROPS(11,0,0,0,"temp");
          _SFD_SET_DATA_PROPS(12,9,0,0,"");
          _SFD_SET_DATA_PROPS(13,8,0,0,"");
          _SFD_SET_DATA_PROPS(14,9,0,0,"");
          _SFD_SET_DATA_PROPS(15,9,0,0,"");
          _SFD_EVENT_SCOPE(0,2);
          _SFD_EVENT_SCOPE(1,1);
          _SFD_EVENT_SCOPE(2,1);
          _SFD_EVENT_SCOPE(3,2);
          _SFD_EVENT_SCOPE(4,0);
          _SFD_EVENT_SCOPE(5,0);
          _SFD_EVENT_SCOPE(6,0);
          _SFD_EVENT_SCOPE(7,0);
          _SFD_EVENT_SCOPE(8,0);
          _SFD_EVENT_SCOPE(9,0);
          _SFD_EVENT_SCOPE(10,0);
          _SFD_EVENT_SCOPE(11,0);
          _SFD_EVENT_SCOPE(12,0);
          _SFD_EVENT_SCOPE(13,0);
          _SFD_EVENT_SCOPE(14,1);
          _SFD_EVENT_SCOPE(15,1);
          _SFD_EVENT_SCOPE(16,2);
          _SFD_EVENT_SCOPE(17,2);
          _SFD_STATE_INFO(0,1,0);
          _SFD_STATE_INFO(1,0,1);
          _SFD_STATE_INFO(2,0,0);
          _SFD_STATE_INFO(3,0,0);
          _SFD_STATE_INFO(4,0,0);
          _SFD_STATE_INFO(5,0,0);
          _SFD_STATE_INFO(6,0,1);
          _SFD_STATE_INFO(7,0,0);
          _SFD_STATE_INFO(8,0,0);
          _SFD_STATE_INFO(9,0,0);
          _SFD_STATE_INFO(10,0,0);
          _SFD_STATE_INFO(11,0,0);
          _SFD_STATE_INFO(12,0,0);
          _SFD_STATE_INFO(13,0,0);
          _SFD_STATE_INFO(14,0,1);
          _SFD_STATE_INFO(15,0,0);
          _SFD_STATE_INFO(16,0,0);
          _SFD_STATE_INFO(17,0,0);
          _SFD_STATE_INFO(18,0,0);
          _SFD_STATE_INFO(19,0,0);
          _SFD_STATE_INFO(20,0,0);
          _SFD_STATE_INFO(21,0,0);
          _SFD_STATE_INFO(22,0,0);
          _SFD_STATE_INFO(23,0,0);
          _SFD_STATE_INFO(24,0,1);
          _SFD_STATE_INFO(25,0,0);
          _SFD_STATE_INFO(26,0,0);
          _SFD_STATE_INFO(27,0,0);
          _SFD_STATE_INFO(28,0,0);
          _SFD_STATE_INFO(29,0,0);
          _SFD_STATE_INFO(30,0,0);
          _SFD_STATE_INFO(31,0,0);
          _SFD_STATE_INFO(32,0,0);
          _SFD_STATE_INFO(33,0,0);
          _SFD_STATE_INFO(34,0,0);
          _SFD_STATE_INFO(35,0,0);
          _SFD_STATE_INFO(36,0,0);
          _SFD_STATE_INFO(37,0,0);
          _SFD_STATE_INFO(38,0,0);
          _SFD_STATE_INFO(39,0,0);
          _SFD_STATE_INFO(40,0,0);
          _SFD_STATE_INFO(41,0,0);
          _SFD_STATE_INFO(42,0,0);
          _SFD_STATE_INFO(43,0,0);
          _SFD_STATE_INFO(44,0,0);
          _SFD_STATE_INFO(45,0,1);
          _SFD_STATE_INFO(46,0,0);
          _SFD_STATE_INFO(47,0,0);
          _SFD_STATE_INFO(48,0,0);
          _SFD_STATE_INFO(49,0,0);
          _SFD_STATE_INFO(50,0,0);
          _SFD_STATE_INFO(51,0,0);
          _SFD_STATE_INFO(52,0,0);
          _SFD_STATE_INFO(53,0,0);
          _SFD_STATE_INFO(54,0,0);
          _SFD_STATE_INFO(55,0,0);
          _SFD_STATE_INFO(56,0,0);
          _SFD_STATE_INFO(57,0,0);
          _SFD_STATE_INFO(58,0,0);
          _SFD_STATE_INFO(59,0,0);
          _SFD_STATE_INFO(60,0,2);
          _SFD_STATE_INFO(61,0,2);
          _SFD_STATE_INFO(62,0,2);
          _SFD_CH_SUBSTATE_COUNT(1);
          _SFD_CH_SUBSTATE_DECOMP(0);
          _SFD_CH_SUBSTATE_INDEX(0,0);
          _SFD_ST_SUBSTATE_COUNT(0,5);
          _SFD_ST_SUBSTATE_INDEX(0,0,6);
          _SFD_ST_SUBSTATE_INDEX(0,1,1);
          _SFD_ST_SUBSTATE_INDEX(0,2,14);
          _SFD_ST_SUBSTATE_INDEX(0,3,24);
          _SFD_ST_SUBSTATE_INDEX(0,4,45);
          _SFD_ST_SUBSTATE_COUNT(6,7);
          _SFD_ST_SUBSTATE_INDEX(6,0,7);
          _SFD_ST_SUBSTATE_INDEX(6,1,8);
          _SFD_ST_SUBSTATE_INDEX(6,2,9);
          _SFD_ST_SUBSTATE_INDEX(6,3,10);
          _SFD_ST_SUBSTATE_INDEX(6,4,11);
          _SFD_ST_SUBSTATE_INDEX(6,5,12);
          _SFD_ST_SUBSTATE_INDEX(6,6,13);
          _SFD_ST_SUBSTATE_COUNT(7,0);
          _SFD_ST_SUBSTATE_COUNT(8,0);
          _SFD_ST_SUBSTATE_COUNT(9,0);
          _SFD_ST_SUBSTATE_COUNT(10,0);
          _SFD_ST_SUBSTATE_COUNT(11,0);
          _SFD_ST_SUBSTATE_COUNT(12,0);
          _SFD_ST_SUBSTATE_COUNT(13,0);
          _SFD_ST_SUBSTATE_COUNT(1,4);
          _SFD_ST_SUBSTATE_INDEX(1,0,2);
          _SFD_ST_SUBSTATE_INDEX(1,1,3);
          _SFD_ST_SUBSTATE_INDEX(1,2,4);
          _SFD_ST_SUBSTATE_INDEX(1,3,5);
          _SFD_ST_SUBSTATE_COUNT(2,0);
          _SFD_ST_SUBSTATE_COUNT(3,0);
          _SFD_ST_SUBSTATE_COUNT(4,0);
          _SFD_ST_SUBSTATE_COUNT(5,0);
          _SFD_ST_SUBSTATE_COUNT(14,9);
          _SFD_ST_SUBSTATE_INDEX(14,0,15);
          _SFD_ST_SUBSTATE_INDEX(14,1,16);
          _SFD_ST_SUBSTATE_INDEX(14,2,17);
          _SFD_ST_SUBSTATE_INDEX(14,3,18);
          _SFD_ST_SUBSTATE_INDEX(14,4,19);
          _SFD_ST_SUBSTATE_INDEX(14,5,20);
          _SFD_ST_SUBSTATE_INDEX(14,6,21);
          _SFD_ST_SUBSTATE_INDEX(14,7,22);
          _SFD_ST_SUBSTATE_INDEX(14,8,23);
          _SFD_ST_SUBSTATE_COUNT(15,0);
          _SFD_ST_SUBSTATE_COUNT(16,0);
          _SFD_ST_SUBSTATE_COUNT(17,0);
          _SFD_ST_SUBSTATE_COUNT(18,0);
          _SFD_ST_SUBSTATE_COUNT(19,0);
          _SFD_ST_SUBSTATE_COUNT(20,0);
          _SFD_ST_SUBSTATE_COUNT(21,0);
          _SFD_ST_SUBSTATE_COUNT(22,0);
          _SFD_ST_SUBSTATE_COUNT(23,0);
          _SFD_ST_SUBSTATE_COUNT(24,20);
          _SFD_ST_SUBSTATE_INDEX(24,0,25);
          _SFD_ST_SUBSTATE_INDEX(24,1,26);
          _SFD_ST_SUBSTATE_INDEX(24,2,27);
          _SFD_ST_SUBSTATE_INDEX(24,3,28);
          _SFD_ST_SUBSTATE_INDEX(24,4,29);
          _SFD_ST_SUBSTATE_INDEX(24,5,30);
          _SFD_ST_SUBSTATE_INDEX(24,6,31);
          _SFD_ST_SUBSTATE_INDEX(24,7,32);
          _SFD_ST_SUBSTATE_INDEX(24,8,33);
          _SFD_ST_SUBSTATE_INDEX(24,9,34);
          _SFD_ST_SUBSTATE_INDEX(24,10,35);
          _SFD_ST_SUBSTATE_INDEX(24,11,36);
          _SFD_ST_SUBSTATE_INDEX(24,12,37);
          _SFD_ST_SUBSTATE_INDEX(24,13,38);
          _SFD_ST_SUBSTATE_INDEX(24,14,39);
          _SFD_ST_SUBSTATE_INDEX(24,15,40);
          _SFD_ST_SUBSTATE_INDEX(24,16,41);
          _SFD_ST_SUBSTATE_INDEX(24,17,42);
          _SFD_ST_SUBSTATE_INDEX(24,18,43);
          _SFD_ST_SUBSTATE_INDEX(24,19,44);
          _SFD_ST_SUBSTATE_COUNT(25,0);
          _SFD_ST_SUBSTATE_COUNT(26,0);
          _SFD_ST_SUBSTATE_COUNT(27,0);
          _SFD_ST_SUBSTATE_COUNT(28,0);
          _SFD_ST_SUBSTATE_COUNT(29,0);
          _SFD_ST_SUBSTATE_COUNT(30,0);
          _SFD_ST_SUBSTATE_COUNT(31,0);
          _SFD_ST_SUBSTATE_COUNT(32,0);
          _SFD_ST_SUBSTATE_COUNT(33,0);
          _SFD_ST_SUBSTATE_COUNT(34,0);
          _SFD_ST_SUBSTATE_COUNT(35,0);
          _SFD_ST_SUBSTATE_COUNT(36,0);
          _SFD_ST_SUBSTATE_COUNT(37,0);
          _SFD_ST_SUBSTATE_COUNT(38,0);
          _SFD_ST_SUBSTATE_COUNT(39,0);
          _SFD_ST_SUBSTATE_COUNT(40,0);
          _SFD_ST_SUBSTATE_COUNT(41,0);
          _SFD_ST_SUBSTATE_COUNT(42,0);
          _SFD_ST_SUBSTATE_COUNT(43,0);
          _SFD_ST_SUBSTATE_COUNT(44,0);
          _SFD_ST_SUBSTATE_COUNT(45,14);
          _SFD_ST_SUBSTATE_INDEX(45,0,46);
          _SFD_ST_SUBSTATE_INDEX(45,1,47);
          _SFD_ST_SUBSTATE_INDEX(45,2,48);
          _SFD_ST_SUBSTATE_INDEX(45,3,49);
          _SFD_ST_SUBSTATE_INDEX(45,4,50);
          _SFD_ST_SUBSTATE_INDEX(45,5,51);
          _SFD_ST_SUBSTATE_INDEX(45,6,52);
          _SFD_ST_SUBSTATE_INDEX(45,7,53);
          _SFD_ST_SUBSTATE_INDEX(45,8,54);
          _SFD_ST_SUBSTATE_INDEX(45,9,55);
          _SFD_ST_SUBSTATE_INDEX(45,10,56);
          _SFD_ST_SUBSTATE_INDEX(45,11,57);
          _SFD_ST_SUBSTATE_INDEX(45,12,58);
          _SFD_ST_SUBSTATE_INDEX(45,13,59);
          _SFD_ST_SUBSTATE_COUNT(46,0);
          _SFD_ST_SUBSTATE_COUNT(47,0);
          _SFD_ST_SUBSTATE_COUNT(48,0);
          _SFD_ST_SUBSTATE_COUNT(49,0);
          _SFD_ST_SUBSTATE_COUNT(50,0);
          _SFD_ST_SUBSTATE_COUNT(51,0);
          _SFD_ST_SUBSTATE_COUNT(52,0);
          _SFD_ST_SUBSTATE_COUNT(53,0);
          _SFD_ST_SUBSTATE_COUNT(54,0);
          _SFD_ST_SUBSTATE_COUNT(55,0);
          _SFD_ST_SUBSTATE_COUNT(56,0);
          _SFD_ST_SUBSTATE_COUNT(57,0);
          _SFD_ST_SUBSTATE_COUNT(58,0);
          _SFD_ST_SUBSTATE_COUNT(59,0);
        }

        _SFD_CV_INIT_CHART(1,0,0,0);

        {
          _SFD_CV_INIT_STATE(0,5,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(1,4,1,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(2,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(3,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(4,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(5,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(6,7,1,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(7,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(8,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(9,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(10,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(11,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(12,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(13,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(14,9,1,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(15,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(16,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(17,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(18,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(19,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(20,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(21,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(22,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(23,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(24,20,1,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(25,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(26,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(27,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(28,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(29,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(30,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(31,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(32,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(33,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(34,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(35,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(36,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(37,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(38,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(39,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(40,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(41,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(42,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(43,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(44,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(45,14,1,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(46,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(47,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(48,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(49,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(50,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(51,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(52,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(53,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(54,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(55,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(56,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(57,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(58,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(59,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(60,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(61,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(62,0,0,0,0,0,NULL,NULL);
        }

        _SFD_CV_INIT_TRANS(0,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 45 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(1,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(2,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 33 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(3,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(4,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 37 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(5,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(6,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(7,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 35 };

          static unsigned int sEndGuardMap[] = { 31, 57 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(8,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(9,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(10,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(11,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 36 };

          static unsigned int sEndGuardMap[] = { 32, 59 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(12,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(13,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(14,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(15,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(16,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(17,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 46 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(18,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(19,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(20,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(21,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 48 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(22,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 33 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(23,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(24,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 40 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(25,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(26,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(27,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(28,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(29,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 47 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(30,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 41 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(31,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(32,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0, 8 };

          static unsigned int sEndGuardMap[] = { 7, 31 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(33,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(34,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(35,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 43 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(36,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 40 };

          static unsigned int sEndGuardMap[] = { 36, 62 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(37,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(38,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 46, 73 };

          static unsigned int sEndGuardMap[] = { 41, 69, 92 };

          static int sPostFixPredicateTree[] = { 0, 1, -2, 2, -2 };

          _SFD_CV_INIT_TRANS(39,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 45, 71 };

          static unsigned int sEndGuardMap[] = { 40, 67, 90 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(40,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 41 };

          static unsigned int sEndGuardMap[] = { 37, 64 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(41,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(42,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 46, 73 };

          static unsigned int sEndGuardMap[] = { 41, 69, 92 };

          static int sPostFixPredicateTree[] = { 0, 1, -2, 2, -2 };

          _SFD_CV_INIT_TRANS(43,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(44,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 44 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(45,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(46,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(47,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(48,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(49,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(50,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 48 };

          static unsigned int sEndGuardMap[] = { 44, 71 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(51,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 48 };

          static unsigned int sEndGuardMap[] = { 44, 71 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(52,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 69 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(53,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(54,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(55,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 70 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(56,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(57,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(58,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(59,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 46 };

          static unsigned int sEndGuardMap[] = { 42, 68 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(60,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 70 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(61,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(62,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 42, 69 };

          static unsigned int sEndGuardMap[] = { 38, 65, 87 };

          static int sPostFixPredicateTree[] = { 0, 1, -2, 2, -2 };

          _SFD_CV_INIT_TRANS(63,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 42, 69 };

          static unsigned int sEndGuardMap[] = { 38, 65, 87 };

          static int sPostFixPredicateTree[] = { 0, 1, -2, 2, -2 };

          _SFD_CV_INIT_TRANS(64,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(65,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 41, 67 };

          static unsigned int sEndGuardMap[] = { 37, 63, 86 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(66,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(67,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(68,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 43, 70 };

          static unsigned int sEndGuardMap[] = { 39, 66, 88 };

          static int sPostFixPredicateTree[] = { 0, 1, -2, 2, -2 };

          _SFD_CV_INIT_TRANS(69,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 42, 68 };

          static unsigned int sEndGuardMap[] = { 38, 64, 87 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(70,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(71,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 41 };

          static unsigned int sEndGuardMap[] = { 37, 64 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(72,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 40 };

          static unsigned int sEndGuardMap[] = { 36, 62 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(73,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(74,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 43, 70 };

          static unsigned int sEndGuardMap[] = { 39, 66, 88 };

          static int sPostFixPredicateTree[] = { 0, 1, -2, 2, -2 };

          _SFD_CV_INIT_TRANS(75,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 41 };

          static unsigned int sEndGuardMap[] = { 37, 64 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(76,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(77,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(78,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(79,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 38 };

          static unsigned int sEndGuardMap[] = { 34, 61 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(80,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 37 };

          static unsigned int sEndGuardMap[] = { 33, 59 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(81,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(82,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(83,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(84,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 37 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(85,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(86,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(87,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(88,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 38 };

          static unsigned int sEndGuardMap[] = { 34, 61 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(89,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(90,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(91,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(92,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 45 };

          static unsigned int sEndGuardMap[] = { 41, 68 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(93,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(94,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 44 };

          static unsigned int sEndGuardMap[] = { 40, 66 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(95,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 45 };

          static unsigned int sEndGuardMap[] = { 41, 68 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(96,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(97,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(98,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(99,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(100,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(101,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(102,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(103,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(104,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(105,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 32 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(106,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(107,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(108,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(109,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 33 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(110,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(111,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(112,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0, 8 };

          static unsigned int sEndGuardMap[] = { 7, 31 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(113,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(114,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(115,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(116,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(117,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 36 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(118,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(119,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(120,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(121,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(122,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(123,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(124,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(125,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(126,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(127,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(128,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(129,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0, 10 };

          static unsigned int sEndGuardMap[] = { 9, 22 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(130,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(131,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(132,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0, 8 };

          static unsigned int sEndGuardMap[] = { 7, 19 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(133,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(134,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0, 10 };

          static unsigned int sEndGuardMap[] = { 9, 22 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(135,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(136,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(137,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(138,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(139,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(140,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(141,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(142,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(143,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(144,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(145,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(146,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(147,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(148,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(149,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(150,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(151,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(152,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(153,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(154,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(155,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(156,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(157,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(158,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(159,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(160,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(161,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(162,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(163,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 42, 69 };

          static unsigned int sEndGuardMap[] = { 38, 65, 88 };

          static int sPostFixPredicateTree[] = { 0, 1, -2, 2, -2 };

          _SFD_CV_INIT_TRANS(164,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(165,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(166,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(167,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(168,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(169,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(170,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(171,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(172,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 41 };

          static unsigned int sEndGuardMap[] = { 37, 64 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(173,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(174,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 44 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(175,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(176,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 33 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(177,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(178,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(179,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 41, 68 };

          static unsigned int sEndGuardMap[] = { 37, 64, 87 };

          static int sPostFixPredicateTree[] = { 0, 1, -2, 2, -2 };

          _SFD_CV_INIT_TRANS(180,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 40, 66 };

          static unsigned int sEndGuardMap[] = { 36, 62, 85 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(181,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(182,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(183,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(184,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(185,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(186,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(187,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(188,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(189,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(190,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 41, 65 };

          static unsigned int sEndGuardMap[] = { 37, 61, 84 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(191,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(192,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 36 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(193,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(194,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(195,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(196,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(197,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(198,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 36 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(199,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(200,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(201,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 37 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(202,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(203,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 47 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(204,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(205,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 40 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(206,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(207,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(208,0,NULL,NULL,0,NULL);
        _SFD_TRANS_COV_WTS(0,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(0,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(1,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 45 };

          _SFD_TRANS_COV_MAPS(1,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(2,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(2,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(3,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 33 };

          _SFD_TRANS_COV_MAPS(3,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(4,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(4,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(5,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 37 };

          _SFD_TRANS_COV_MAPS(5,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(6,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(6,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(7,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(7,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(8,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 35 };

          static unsigned int sEndGuardMap[] = { 31, 57 };

          _SFD_TRANS_COV_MAPS(8,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(9,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(9,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(10,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(10,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(11,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(11,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(12,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 36 };

          static unsigned int sEndGuardMap[] = { 32, 59 };

          _SFD_TRANS_COV_MAPS(12,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(13,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(13,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(14,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(14,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(15,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(15,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(16,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(16,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(17,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(17,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(18,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 46 };

          _SFD_TRANS_COV_MAPS(18,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(19,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(19,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(20,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(20,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(21,0,0,5,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(21,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              5,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(22,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 48 };

          _SFD_TRANS_COV_MAPS(22,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(23,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 33 };

          _SFD_TRANS_COV_MAPS(23,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(24,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(24,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(25,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 40 };

          _SFD_TRANS_COV_MAPS(25,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(26,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(26,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(27,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(27,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(28,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(28,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(29,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(29,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(30,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 47 };

          _SFD_TRANS_COV_MAPS(30,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(31,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 41 };

          _SFD_TRANS_COV_MAPS(31,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(32,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(32,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(33,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 8 };

          static unsigned int sEndGuardMap[] = { 7, 31 };

          _SFD_TRANS_COV_MAPS(33,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(34,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(34,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(35,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(35,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(36,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 43 };

          _SFD_TRANS_COV_MAPS(36,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(37,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 40 };

          static unsigned int sEndGuardMap[] = { 36, 62 };

          _SFD_TRANS_COV_MAPS(37,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(38,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(38,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(39,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 46, 73 };

          static unsigned int sEndGuardMap[] = { 41, 69, 92 };

          _SFD_TRANS_COV_MAPS(39,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(40,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 45, 71 };

          static unsigned int sEndGuardMap[] = { 40, 67, 90 };

          _SFD_TRANS_COV_MAPS(40,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(41,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 41 };

          static unsigned int sEndGuardMap[] = { 37, 64 };

          _SFD_TRANS_COV_MAPS(41,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(42,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(42,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(43,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 46, 73 };

          static unsigned int sEndGuardMap[] = { 41, 69, 92 };

          _SFD_TRANS_COV_MAPS(43,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(44,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(44,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(45,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 44 };

          _SFD_TRANS_COV_MAPS(45,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(46,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(46,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(47,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(47,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(48,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(48,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(49,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(49,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(50,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(50,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(51,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 48 };

          static unsigned int sEndGuardMap[] = { 44, 71 };

          _SFD_TRANS_COV_MAPS(51,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(52,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 48 };

          static unsigned int sEndGuardMap[] = { 44, 71 };

          _SFD_TRANS_COV_MAPS(52,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(53,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 69 };

          _SFD_TRANS_COV_MAPS(53,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(54,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(54,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(55,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(55,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(56,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 70 };

          _SFD_TRANS_COV_MAPS(56,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(57,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(57,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(58,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(58,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(59,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(59,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(60,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 46 };

          static unsigned int sEndGuardMap[] = { 42, 68 };

          _SFD_TRANS_COV_MAPS(60,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(61,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 70 };

          _SFD_TRANS_COV_MAPS(61,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(62,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(62,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(63,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 42, 69 };

          static unsigned int sEndGuardMap[] = { 38, 65, 87 };

          _SFD_TRANS_COV_MAPS(63,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(64,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 42, 69 };

          static unsigned int sEndGuardMap[] = { 38, 65, 87 };

          _SFD_TRANS_COV_MAPS(64,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(65,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(65,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(66,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 41, 67 };

          static unsigned int sEndGuardMap[] = { 37, 63, 86 };

          _SFD_TRANS_COV_MAPS(66,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(67,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(67,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(68,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(68,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(69,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 43, 70 };

          static unsigned int sEndGuardMap[] = { 39, 66, 88 };

          _SFD_TRANS_COV_MAPS(69,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(70,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 42, 68 };

          static unsigned int sEndGuardMap[] = { 38, 64, 87 };

          _SFD_TRANS_COV_MAPS(70,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(71,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(71,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(72,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 41 };

          static unsigned int sEndGuardMap[] = { 37, 64 };

          _SFD_TRANS_COV_MAPS(72,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(73,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 40 };

          static unsigned int sEndGuardMap[] = { 36, 62 };

          _SFD_TRANS_COV_MAPS(73,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(74,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(74,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(75,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 43, 70 };

          static unsigned int sEndGuardMap[] = { 39, 66, 88 };

          _SFD_TRANS_COV_MAPS(75,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(76,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 41 };

          static unsigned int sEndGuardMap[] = { 37, 64 };

          _SFD_TRANS_COV_MAPS(76,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(77,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(77,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(78,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(78,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(79,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(79,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(80,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 38 };

          static unsigned int sEndGuardMap[] = { 34, 61 };

          _SFD_TRANS_COV_MAPS(80,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(81,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 37 };

          static unsigned int sEndGuardMap[] = { 33, 59 };

          _SFD_TRANS_COV_MAPS(81,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(82,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(82,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(83,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(83,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(84,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(84,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(85,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 37 };

          _SFD_TRANS_COV_MAPS(85,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(86,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(86,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(87,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(87,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(88,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(88,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(89,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 38 };

          static unsigned int sEndGuardMap[] = { 34, 61 };

          _SFD_TRANS_COV_MAPS(89,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(90,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(90,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(91,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(91,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(92,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(92,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(93,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 45 };

          static unsigned int sEndGuardMap[] = { 41, 68 };

          _SFD_TRANS_COV_MAPS(93,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(94,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(94,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(95,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 44 };

          static unsigned int sEndGuardMap[] = { 40, 66 };

          _SFD_TRANS_COV_MAPS(95,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(96,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 45 };

          static unsigned int sEndGuardMap[] = { 41, 68 };

          _SFD_TRANS_COV_MAPS(96,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(97,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(97,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(98,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(98,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(99,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(99,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(100,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(100,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(101,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(101,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(102,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(102,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(103,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(103,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(104,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(104,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(105,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(105,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(106,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 32 };

          _SFD_TRANS_COV_MAPS(106,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(107,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          _SFD_TRANS_COV_MAPS(107,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(108,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          _SFD_TRANS_COV_MAPS(108,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(109,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(109,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(110,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 33 };

          _SFD_TRANS_COV_MAPS(110,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(111,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(111,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(112,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(112,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(113,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 8 };

          static unsigned int sEndGuardMap[] = { 7, 31 };

          _SFD_TRANS_COV_MAPS(113,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(114,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(114,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(115,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(115,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(116,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          _SFD_TRANS_COV_MAPS(116,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(117,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(117,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(118,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 36 };

          _SFD_TRANS_COV_MAPS(118,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(119,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(119,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(120,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(120,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(121,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(121,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(122,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          _SFD_TRANS_COV_MAPS(122,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(123,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          _SFD_TRANS_COV_MAPS(123,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(124,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(124,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(125,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(125,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(126,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(126,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(127,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(127,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(128,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(128,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(129,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(129,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(130,0,2,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 10 };

          static unsigned int sEndGuardMap[] = { 9, 22 };

          _SFD_TRANS_COV_MAPS(130,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(131,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(131,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(132,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(132,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(133,0,2,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 8 };

          static unsigned int sEndGuardMap[] = { 7, 19 };

          _SFD_TRANS_COV_MAPS(133,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(134,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(134,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(135,0,2,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 10 };

          static unsigned int sEndGuardMap[] = { 9, 22 };

          _SFD_TRANS_COV_MAPS(135,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(136,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(136,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(137,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(137,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(138,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(138,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(139,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(139,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(140,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(140,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(141,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(141,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(142,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(142,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(143,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(143,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(144,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(144,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(145,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(145,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(146,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(146,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(147,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(147,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(148,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(148,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(149,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(149,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(150,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(150,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(151,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(151,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(152,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(152,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(153,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(153,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(154,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(154,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(155,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(155,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(156,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(156,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(157,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(157,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(158,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(158,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(159,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(159,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(160,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(160,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(161,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(161,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(162,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(162,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(163,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(163,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(164,0,3,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 42, 69 };

          static unsigned int sEndGuardMap[] = { 38, 65, 88 };

          _SFD_TRANS_COV_MAPS(164,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(165,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(165,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(166,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(166,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(167,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(167,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(168,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(168,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(169,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(169,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(170,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(170,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(171,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(171,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(172,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(172,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(173,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 41 };

          static unsigned int sEndGuardMap[] = { 37, 64 };

          _SFD_TRANS_COV_MAPS(173,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(174,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(174,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(175,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 44 };

          _SFD_TRANS_COV_MAPS(175,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(176,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(176,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(177,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 33 };

          _SFD_TRANS_COV_MAPS(177,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(178,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(178,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(179,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(179,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(180,0,3,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 41, 68 };

          static unsigned int sEndGuardMap[] = { 37, 64, 87 };

          _SFD_TRANS_COV_MAPS(180,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(181,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 40, 66 };

          static unsigned int sEndGuardMap[] = { 36, 62, 85 };

          _SFD_TRANS_COV_MAPS(181,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(182,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(182,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(183,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(183,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(184,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(184,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(185,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(185,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(186,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(186,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(187,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(187,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(188,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(188,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(189,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(189,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(190,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(190,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(191,0,3,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 41, 65 };

          static unsigned int sEndGuardMap[] = { 37, 61, 84 };

          _SFD_TRANS_COV_MAPS(191,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(192,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(192,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(193,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 36 };

          _SFD_TRANS_COV_MAPS(193,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(194,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(194,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(195,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          _SFD_TRANS_COV_MAPS(195,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(196,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(196,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(197,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(197,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(198,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(198,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(199,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 36 };

          _SFD_TRANS_COV_MAPS(199,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(200,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          _SFD_TRANS_COV_MAPS(200,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(201,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(201,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(202,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 37 };

          _SFD_TRANS_COV_MAPS(202,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(203,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(203,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(204,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 47 };

          _SFD_TRANS_COV_MAPS(204,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(205,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          _SFD_TRANS_COV_MAPS(205,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(206,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 40 };

          _SFD_TRANS_COV_MAPS(206,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(207,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 39 };

          _SFD_TRANS_COV_MAPS(207,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(208,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(208,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_SET_DATA_COMPILED_PROPS(0,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(1,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_e_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(2,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_f_sf_marshallOut,(MexInFcnForType)c3_e_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(3,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_e_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(4,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_envSenData_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(5,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)c3_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(6,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)c3_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(7,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)c3_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(8,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(9,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_hardwareSenData_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(10,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_infuSenData_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(11,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_e_sf_marshallOut,(MexInFcnForType)c3_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(12,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)c3_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(13,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)c3_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(14,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)c3_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(15,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c3_sf_marshallOut,(MexInFcnForType)c3_sf_marshallIn);
        _SFD_SET_DATA_VALUE_PTR(12,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(13,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(14,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(15,(void *)(NULL));

        {
          uint32_T *c3_ClearCond;
          boolean_T *c3_infusionInProgress;
          real_T *c3_ErrCond;
          boolean_T *c3_infusionPaused;
          c3_EnvironmentSensorSignals *c3_envSenData;
          c3_HardwareSensorSignals *c3_hardwareSenData;
          c3_InfusionSensorSignals *c3_infuSenData;
          c3_infuSenData = (c3_InfusionSensorSignals *)ssGetInputPortSignal
            (chartInstance->S, 5);
          c3_hardwareSenData = (c3_HardwareSensorSignals *)ssGetInputPortSignal
            (chartInstance->S, 4);
          c3_envSenData = (c3_EnvironmentSensorSignals *)ssGetInputPortSignal
            (chartInstance->S, 3);
          c3_infusionPaused = (boolean_T *)ssGetInputPortSignal(chartInstance->S,
            2);
          c3_ErrCond = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
          c3_infusionInProgress = (boolean_T *)ssGetInputPortSignal
            (chartInstance->S, 1);
          c3_ClearCond = (uint32_T *)ssGetInputPortSignal(chartInstance->S, 0);
          _SFD_SET_DATA_VALUE_PTR(0U, c3_ClearCond);
          _SFD_SET_DATA_VALUE_PTR(1U, c3_infusionInProgress);
          _SFD_SET_DATA_VALUE_PTR(2U, c3_ErrCond);
          _SFD_SET_DATA_VALUE_PTR(3U, c3_infusionPaused);
          _SFD_SET_DATA_VALUE_PTR(4U, c3_envSenData);
          _SFD_SET_DATA_VALUE_PTR(5U, &chartInstance->c3_LOneCond);
          _SFD_SET_DATA_VALUE_PTR(6U, &chartInstance->c3_LTwoCond);
          _SFD_SET_DATA_VALUE_PTR(7U, &chartInstance->c3_WnCond);
          _SFD_SET_DATA_VALUE_PTR(8U, &chartInstance->c3_MSG_BLANK);
          _SFD_SET_DATA_VALUE_PTR(9U, c3_hardwareSenData);
          _SFD_SET_DATA_VALUE_PTR(10U, c3_infuSenData);
          _SFD_SET_DATA_VALUE_PTR(11U, &chartInstance->c3_temp);
        }
      }
    } else {
      sf_debug_reset_current_state_configuration(_GPCA_ExtensionMachineNumber_,
        chartInstance->chartNumber,chartInstance->instanceNumber);
    }
  }
}

static const char* sf_get_instance_specialization()
{
  return "jRvVEoUbpyjMPNorcK5kmE";
}

static void sf_opaque_initialize_c3_GPCA_Extension(void *chartInstanceVar)
{
  chart_debug_initialization(((SFc3_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar)->S,0);
  initialize_params_c3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
  initialize_c3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

static void sf_opaque_enable_c3_GPCA_Extension(void *chartInstanceVar)
{
  enable_c3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*) chartInstanceVar);
}

static void sf_opaque_disable_c3_GPCA_Extension(void *chartInstanceVar)
{
  disable_c3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

static void sf_opaque_gateway_c3_GPCA_Extension(void *chartInstanceVar)
{
  sf_c3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*) chartInstanceVar);
}

extern const mxArray* sf_internal_get_sim_state_c3_GPCA_Extension(SimStruct* S)
{
  ChartInfoStruct *chartInfo = (ChartInfoStruct*) ssGetUserData(S);
  mxArray *plhs[1] = { NULL };

  mxArray *prhs[4];
  int mxError = 0;
  prhs[0] = mxCreateString("chart_simctx_raw2high");
  prhs[1] = mxCreateDoubleScalar(ssGetSFuncBlockHandle(S));
  prhs[2] = (mxArray*) get_sim_state_c3_GPCA_Extension
    ((SFc3_GPCA_ExtensionInstanceStruct*)chartInfo->chartInstance);/* raw sim ctx */
  prhs[3] = (mxArray*) sf_get_sim_state_info_c3_GPCA_Extension();/* state var info */
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

extern void sf_internal_set_sim_state_c3_GPCA_Extension(SimStruct* S, const
  mxArray *st)
{
  ChartInfoStruct *chartInfo = (ChartInfoStruct*) ssGetUserData(S);
  mxArray *plhs[1] = { NULL };

  mxArray *prhs[4];
  int mxError = 0;
  prhs[0] = mxCreateString("chart_simctx_high2raw");
  prhs[1] = mxCreateDoubleScalar(ssGetSFuncBlockHandle(S));
  prhs[2] = mxDuplicateArray(st);      /* high level simctx */
  prhs[3] = (mxArray*) sf_get_sim_state_info_c3_GPCA_Extension();/* state var info */
  mxError = sf_mex_call_matlab(1, plhs, 4, prhs, "sfprivate");
  mxDestroyArray(prhs[0]);
  mxDestroyArray(prhs[1]);
  mxDestroyArray(prhs[2]);
  mxDestroyArray(prhs[3]);
  if (mxError || plhs[0] == NULL) {
    sf_mex_error_message("Stateflow Internal Error: \nError calling 'chart_simctx_high2raw'.\n");
  }

  set_sim_state_c3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*)
    chartInfo->chartInstance, mxDuplicateArray(plhs[0]));
  mxDestroyArray(plhs[0]);
}

static const mxArray* sf_opaque_get_sim_state_c3_GPCA_Extension(SimStruct* S)
{
  return sf_internal_get_sim_state_c3_GPCA_Extension(S);
}

static void sf_opaque_set_sim_state_c3_GPCA_Extension(SimStruct* S, const
  mxArray *st)
{
  sf_internal_set_sim_state_c3_GPCA_Extension(S, st);
}

static void sf_opaque_terminate_c3_GPCA_Extension(void *chartInstanceVar)
{
  if (chartInstanceVar!=NULL) {
    SimStruct *S = ((SFc3_GPCA_ExtensionInstanceStruct*) chartInstanceVar)->S;
    if (sim_mode_is_rtw_gen(S) || sim_mode_is_external(S)) {
      sf_clear_rtw_identifier(S);
    }

    finalize_c3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*)
      chartInstanceVar);
    free((void *)chartInstanceVar);
    ssSetUserData(S,NULL);
  }

  unload_GPCA_Extension_optimization_info();
}

static void sf_opaque_init_subchart_simstructs(void *chartInstanceVar)
{
  initSimStructsc3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

extern unsigned int sf_machine_global_initializer_called(void);
static void mdlProcessParameters_c3_GPCA_Extension(SimStruct *S)
{
  int i;
  for (i=0;i<ssGetNumRunTimeParams(S);i++) {
    if (ssGetSFcnParamTunable(S,i)) {
      ssUpdateDlgParamAsRunTimeParam(S,i);
    }
  }

  if (sf_machine_global_initializer_called()) {
    initialize_params_c3_GPCA_Extension((SFc3_GPCA_ExtensionInstanceStruct*)
      (((ChartInfoStruct *)ssGetUserData(S))->chartInstance));
  }
}

static void mdlSetWorkWidths_c3_GPCA_Extension(SimStruct *S)
{
  if (sim_mode_is_rtw_gen(S) || sim_mode_is_external(S)) {
    mxArray *infoStruct = load_GPCA_Extension_optimization_info();
    int_T chartIsInlinable =
      (int_T)sf_is_chart_inlinable(S,sf_get_instance_specialization(),infoStruct,
      3);
    ssSetStateflowIsInlinable(S,chartIsInlinable);
    ssSetRTWCG(S,sf_rtw_info_uint_prop(S,sf_get_instance_specialization(),
                infoStruct,3,"RTWCG"));
    ssSetEnableFcnIsTrivial(S,1);
    ssSetDisableFcnIsTrivial(S,1);
    ssSetNotMultipleInlinable(S,sf_rtw_info_uint_prop(S,
      sf_get_instance_specialization(),infoStruct,3,
      "gatewayCannotBeInlinedMultipleTimes"));
    if (chartIsInlinable) {
      ssSetInputPortOptimOpts(S, 0, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 1, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 2, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 3, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 4, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 5, SS_REUSABLE_AND_LOCAL);
      sf_mark_chart_expressionable_inputs(S,sf_get_instance_specialization(),
        infoStruct,3,6);
      sf_mark_chart_reusable_outputs(S,sf_get_instance_specialization(),
        infoStruct,3,5);
    }

    ssSetInputPortOptimOpts(S, 6, SS_REUSABLE_AND_LOCAL);
    sf_set_rtw_dwork_info(S,sf_get_instance_specialization(),infoStruct,3);
    ssSetHasSubFunctions(S,!(chartIsInlinable));
  } else {
  }

  ssSetOptions(S,ssGetOptions(S)|SS_OPTION_WORKS_WITH_CODE_REUSE);
  ssSetChecksum0(S,(1508651190U));
  ssSetChecksum1(S,(258201792U));
  ssSetChecksum2(S,(597084420U));
  ssSetChecksum3(S,(950776506U));
  ssSetmdlDerivatives(S, NULL);
  ssSetExplicitFCSSCtrl(S,1);
}

static void mdlRTW_c3_GPCA_Extension(SimStruct *S)
{
  if (sim_mode_is_rtw_gen(S)) {
    ssWriteRTWStrParam(S, "StateflowChartType", "Stateflow");
  }
}

static void mdlStart_c3_GPCA_Extension(SimStruct *S)
{
  SFc3_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc3_GPCA_ExtensionInstanceStruct *)malloc(sizeof
    (SFc3_GPCA_ExtensionInstanceStruct));
  memset(chartInstance, 0, sizeof(SFc3_GPCA_ExtensionInstanceStruct));
  if (chartInstance==NULL) {
    sf_mex_error_message("Could not allocate memory for chart instance.");
  }

  chartInstance->chartInfo.chartInstance = chartInstance;
  chartInstance->chartInfo.isEMLChart = 0;
  chartInstance->chartInfo.chartInitialized = 0;
  chartInstance->chartInfo.sFunctionGateway =
    sf_opaque_gateway_c3_GPCA_Extension;
  chartInstance->chartInfo.initializeChart =
    sf_opaque_initialize_c3_GPCA_Extension;
  chartInstance->chartInfo.terminateChart =
    sf_opaque_terminate_c3_GPCA_Extension;
  chartInstance->chartInfo.enableChart = sf_opaque_enable_c3_GPCA_Extension;
  chartInstance->chartInfo.disableChart = sf_opaque_disable_c3_GPCA_Extension;
  chartInstance->chartInfo.getSimState =
    sf_opaque_get_sim_state_c3_GPCA_Extension;
  chartInstance->chartInfo.setSimState =
    sf_opaque_set_sim_state_c3_GPCA_Extension;
  chartInstance->chartInfo.getSimStateInfo =
    sf_get_sim_state_info_c3_GPCA_Extension;
  chartInstance->chartInfo.zeroCrossings = NULL;
  chartInstance->chartInfo.outputs = NULL;
  chartInstance->chartInfo.derivatives = NULL;
  chartInstance->chartInfo.mdlRTW = mdlRTW_c3_GPCA_Extension;
  chartInstance->chartInfo.mdlStart = mdlStart_c3_GPCA_Extension;
  chartInstance->chartInfo.mdlSetWorkWidths = mdlSetWorkWidths_c3_GPCA_Extension;
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

void c3_GPCA_Extension_method_dispatcher(SimStruct *S, int_T method, void *data)
{
  switch (method) {
   case SS_CALL_MDL_START:
    mdlStart_c3_GPCA_Extension(S);
    break;

   case SS_CALL_MDL_SET_WORK_WIDTHS:
    mdlSetWorkWidths_c3_GPCA_Extension(S);
    break;

   case SS_CALL_MDL_PROCESS_PARAMETERS:
    mdlProcessParameters_c3_GPCA_Extension(S);
    break;

   default:
    /* Unhandled method */
    sf_mex_error_message("Stateflow Internal Error:\n"
                         "Error calling c3_GPCA_Extension_method_dispatcher.\n"
                         "Can't handle method %d.\n", method);
    break;
  }
}
