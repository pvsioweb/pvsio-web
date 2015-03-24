/* Include files */

#include "blascompat32.h"
#include "GPCA_Extension_sfun.h"
#include "c2_GPCA_Extension.h"
#define CHARTINSTANCE_CHARTNUMBER      (chartInstance->chartNumber)
#define CHARTINSTANCE_INSTANCENUMBER   (chartInstance->instanceNumber)
#include "GPCA_Extension_sfun_debug_macros.h"

/* Type Definitions */

/* Named Constants */
#define CALL_EVENT                     (-1)
#define c2_IN_NO_ACTIVE_CHILD          ((uint8_T)0U)
#define c2_IN_st0                      ((uint8_T)1U)

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
static void initialize_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void initialize_params_c2_GPCA_Extension
  (SFc2_GPCA_ExtensionInstanceStruct *chartInstance);
static void enable_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void disable_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c2_update_debugger_state_c2_GPCA_Extension
  (SFc2_GPCA_ExtensionInstanceStruct *chartInstance);
static const mxArray *get_sim_state_c2_GPCA_Extension
  (SFc2_GPCA_ExtensionInstanceStruct *chartInstance);
static void set_sim_state_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_st);
static void c2_set_sim_state_side_effects_c2_GPCA_Extension
  (SFc2_GPCA_ExtensionInstanceStruct *chartInstance);
static void finalize_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void sf_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void initSimStructsc2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c2_st0(SFc2_GPCA_ExtensionInstanceStruct *chartInstance);
static void init_script_number_translation(uint32_T c2_machineNumber, uint32_T
  c2_chartNumber);
static const mxArray *c2_sf_marshallOut(void *chartInstanceVoid, void *c2_inData);
static int32_T c2_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_u, const emlrtMsgIdentifier *c2_parentId);
static void c2_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c2_mxArrayInData, const char_T *c2_varName, void *c2_outData);
static const mxArray *c2_b_sf_marshallOut(void *chartInstanceVoid, void
  *c2_inData);
static uint8_T c2_b_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_b_tp_st0, const char_T *c2_identifier);
static uint8_T c2_c_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_u, const emlrtMsgIdentifier *c2_parentId);
static void c2_b_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c2_mxArrayInData, const char_T *c2_varName, void *c2_outData);
static const mxArray *c2_c_sf_marshallOut(void *chartInstanceVoid, void
  *c2_inData);
static real_T c2_d_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_StartStopSimulation, const char_T
  *c2_identifier);
static real_T c2_e_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_u, const emlrtMsgIdentifier *c2_parentId);
static void c2_c_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c2_mxArrayInData, const char_T *c2_varName, void *c2_outData);
static const mxArray *c2_f_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_b_setSimStateSideEffectsInfo, const char_T
  *c2_identifier);
static const mxArray *c2_g_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_u, const emlrtMsgIdentifier *c2_parentId);
static void init_dsm_address_info(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance);

/* Function Definitions */
static void initialize_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  real_T *c2_StartStopSimulation;
  real_T *c2_PowerButton;
  real_T *c2_StartNewInfusion;
  real_T *c2_CheckAdminSet;
  real_T *c2_Prime;
  real_T *c2_CheckDrug;
  real_T *c2_ConfigureInfusionProgram;
  real_T *c2_ConfirmConcentration;
  real_T *c2_ConfirmDoseRate;
  real_T *c2_ConfirmVTBI;
  real_T *c2_StartInfusion;
  real_T *c2_ChangeDoseRate;
  real_T *c2_ChangeVTBI;
  real_T *c2_PauseInfusion;
  real_T *c2_ConfirmPauseInfusion;
  real_T *c2_StopInfusion;
  real_T *c2_ConfirmStopInfusion;
  real_T *c2_RequestBolus;
  real_T *c2_ClearAlarm;
  real_T *c2_ConfirmPowerDown;
  real_T *c2_Cancel;
  c2_Cancel = (real_T *)ssGetOutputPortSignal(chartInstance->S, 21);
  c2_ConfirmPowerDown = (real_T *)ssGetOutputPortSignal(chartInstance->S, 20);
  c2_ClearAlarm = (real_T *)ssGetOutputPortSignal(chartInstance->S, 19);
  c2_RequestBolus = (real_T *)ssGetOutputPortSignal(chartInstance->S, 18);
  c2_ConfirmStopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 17);
  c2_StopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 16);
  c2_ConfirmPauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 15);
  c2_PauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 14);
  c2_ChangeVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 13);
  c2_ChangeDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 12);
  c2_StartInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c2_ConfirmVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 10);
  c2_ConfirmDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 9);
  c2_ConfirmConcentration = (real_T *)ssGetOutputPortSignal(chartInstance->S, 8);
  c2_ConfigureInfusionProgram = (real_T *)ssGetOutputPortSignal(chartInstance->S,
    7);
  c2_CheckDrug = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c2_Prime = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c2_CheckAdminSet = (real_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c2_StartNewInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c2_PowerButton = (real_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c2_StartStopSimulation = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  chartInstance->c2_sfEvent = CALL_EVENT;
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
  chartInstance->c2_doSetSimStateSideEffects = 0U;
  chartInstance->c2_setSimStateSideEffectsInfo = NULL;
  chartInstance->c2_tp_st0 = 0U;
  chartInstance->c2_is_active_c2_GPCA_Extension = 0U;
  chartInstance->c2_is_c2_GPCA_Extension = 0U;
  if (!(cdrGetOutputPortReusable(chartInstance->S, 1) != 0)) {
    *c2_StartStopSimulation = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 2) != 0)) {
    *c2_PowerButton = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 3) != 0)) {
    *c2_StartNewInfusion = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 4) != 0)) {
    *c2_CheckAdminSet = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 5) != 0)) {
    *c2_Prime = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 6) != 0)) {
    *c2_CheckDrug = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 7) != 0)) {
    *c2_ConfigureInfusionProgram = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 8) != 0)) {
    *c2_ConfirmConcentration = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 9) != 0)) {
    *c2_ConfirmDoseRate = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 10) != 0)) {
    *c2_ConfirmVTBI = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 11) != 0)) {
    *c2_StartInfusion = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 12) != 0)) {
    *c2_ChangeDoseRate = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 13) != 0)) {
    *c2_ChangeVTBI = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 14) != 0)) {
    *c2_PauseInfusion = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 15) != 0)) {
    *c2_ConfirmPauseInfusion = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 16) != 0)) {
    *c2_StopInfusion = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 17) != 0)) {
    *c2_ConfirmStopInfusion = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 18) != 0)) {
    *c2_RequestBolus = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 19) != 0)) {
    *c2_ClearAlarm = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 20) != 0)) {
    *c2_ConfirmPowerDown = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 21) != 0)) {
    *c2_Cancel = 0.0;
  }
}

static void initialize_params_c2_GPCA_Extension
  (SFc2_GPCA_ExtensionInstanceStruct *chartInstance)
{
}

static void enable_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
}

static void disable_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
}

static void c2_update_debugger_state_c2_GPCA_Extension
  (SFc2_GPCA_ExtensionInstanceStruct *chartInstance)
{
  uint32_T c2_prevAniVal;
  c2_prevAniVal = sf_debug_get_animation();
  sf_debug_set_animation(0U);
  if (chartInstance->c2_is_active_c2_GPCA_Extension == 1) {
    _SFD_CC_CALL(CHART_ACTIVE_TAG, 1U, chartInstance->c2_sfEvent);
  }

  if (chartInstance->c2_is_c2_GPCA_Extension == c2_IN_st0) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c2_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 0U, chartInstance->c2_sfEvent);
  }

  sf_debug_set_animation(c2_prevAniVal);
  _SFD_ANIMATE();
}

static const mxArray *get_sim_state_c2_GPCA_Extension
  (SFc2_GPCA_ExtensionInstanceStruct *chartInstance)
{
  const mxArray *c2_st;
  const mxArray *c2_y = NULL;
  real_T c2_hoistedGlobal;
  real_T c2_u;
  const mxArray *c2_b_y = NULL;
  real_T c2_b_hoistedGlobal;
  real_T c2_b_u;
  const mxArray *c2_c_y = NULL;
  real_T c2_c_hoistedGlobal;
  real_T c2_c_u;
  const mxArray *c2_d_y = NULL;
  real_T c2_d_hoistedGlobal;
  real_T c2_d_u;
  const mxArray *c2_e_y = NULL;
  real_T c2_e_hoistedGlobal;
  real_T c2_e_u;
  const mxArray *c2_f_y = NULL;
  real_T c2_f_hoistedGlobal;
  real_T c2_f_u;
  const mxArray *c2_g_y = NULL;
  real_T c2_g_hoistedGlobal;
  real_T c2_g_u;
  const mxArray *c2_h_y = NULL;
  real_T c2_h_hoistedGlobal;
  real_T c2_h_u;
  const mxArray *c2_i_y = NULL;
  real_T c2_i_hoistedGlobal;
  real_T c2_i_u;
  const mxArray *c2_j_y = NULL;
  real_T c2_j_hoistedGlobal;
  real_T c2_j_u;
  const mxArray *c2_k_y = NULL;
  real_T c2_k_hoistedGlobal;
  real_T c2_k_u;
  const mxArray *c2_l_y = NULL;
  real_T c2_l_hoistedGlobal;
  real_T c2_l_u;
  const mxArray *c2_m_y = NULL;
  real_T c2_m_hoistedGlobal;
  real_T c2_m_u;
  const mxArray *c2_n_y = NULL;
  real_T c2_n_hoistedGlobal;
  real_T c2_n_u;
  const mxArray *c2_o_y = NULL;
  real_T c2_o_hoistedGlobal;
  real_T c2_o_u;
  const mxArray *c2_p_y = NULL;
  real_T c2_p_hoistedGlobal;
  real_T c2_p_u;
  const mxArray *c2_q_y = NULL;
  real_T c2_q_hoistedGlobal;
  real_T c2_q_u;
  const mxArray *c2_r_y = NULL;
  real_T c2_r_hoistedGlobal;
  real_T c2_r_u;
  const mxArray *c2_s_y = NULL;
  real_T c2_s_hoistedGlobal;
  real_T c2_s_u;
  const mxArray *c2_t_y = NULL;
  real_T c2_t_hoistedGlobal;
  real_T c2_t_u;
  const mxArray *c2_u_y = NULL;
  real_T c2_u_hoistedGlobal;
  real_T c2_u_u;
  const mxArray *c2_v_y = NULL;
  uint8_T c2_v_hoistedGlobal;
  uint8_T c2_v_u;
  const mxArray *c2_w_y = NULL;
  uint8_T c2_w_hoistedGlobal;
  uint8_T c2_w_u;
  const mxArray *c2_x_y = NULL;
  real_T *c2_Cancel;
  real_T *c2_ChangeDoseRate;
  real_T *c2_ChangeVTBI;
  real_T *c2_CheckAdminSet;
  real_T *c2_CheckDrug;
  real_T *c2_ClearAlarm;
  real_T *c2_ConfigureInfusionProgram;
  real_T *c2_ConfirmConcentration;
  real_T *c2_ConfirmDoseRate;
  real_T *c2_ConfirmPauseInfusion;
  real_T *c2_ConfirmPowerDown;
  real_T *c2_ConfirmStopInfusion;
  real_T *c2_ConfirmVTBI;
  real_T *c2_PauseInfusion;
  real_T *c2_PowerButton;
  real_T *c2_Prime;
  real_T *c2_RequestBolus;
  real_T *c2_StartInfusion;
  real_T *c2_StartNewInfusion;
  real_T *c2_StartStopSimulation;
  real_T *c2_StopInfusion;
  c2_Cancel = (real_T *)ssGetOutputPortSignal(chartInstance->S, 21);
  c2_ConfirmPowerDown = (real_T *)ssGetOutputPortSignal(chartInstance->S, 20);
  c2_ClearAlarm = (real_T *)ssGetOutputPortSignal(chartInstance->S, 19);
  c2_RequestBolus = (real_T *)ssGetOutputPortSignal(chartInstance->S, 18);
  c2_ConfirmStopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 17);
  c2_StopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 16);
  c2_ConfirmPauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 15);
  c2_PauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 14);
  c2_ChangeVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 13);
  c2_ChangeDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 12);
  c2_StartInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c2_ConfirmVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 10);
  c2_ConfirmDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 9);
  c2_ConfirmConcentration = (real_T *)ssGetOutputPortSignal(chartInstance->S, 8);
  c2_ConfigureInfusionProgram = (real_T *)ssGetOutputPortSignal(chartInstance->S,
    7);
  c2_CheckDrug = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c2_Prime = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c2_CheckAdminSet = (real_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c2_StartNewInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c2_PowerButton = (real_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c2_StartStopSimulation = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c2_st = NULL;
  c2_st = NULL;
  c2_y = NULL;
  sf_mex_assign(&c2_y, sf_mex_createcellarray(23), FALSE);
  c2_hoistedGlobal = *c2_Cancel;
  c2_u = c2_hoistedGlobal;
  c2_b_y = NULL;
  sf_mex_assign(&c2_b_y, sf_mex_create("y", &c2_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 0, c2_b_y);
  c2_b_hoistedGlobal = *c2_ChangeDoseRate;
  c2_b_u = c2_b_hoistedGlobal;
  c2_c_y = NULL;
  sf_mex_assign(&c2_c_y, sf_mex_create("y", &c2_b_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 1, c2_c_y);
  c2_c_hoistedGlobal = *c2_ChangeVTBI;
  c2_c_u = c2_c_hoistedGlobal;
  c2_d_y = NULL;
  sf_mex_assign(&c2_d_y, sf_mex_create("y", &c2_c_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 2, c2_d_y);
  c2_d_hoistedGlobal = *c2_CheckAdminSet;
  c2_d_u = c2_d_hoistedGlobal;
  c2_e_y = NULL;
  sf_mex_assign(&c2_e_y, sf_mex_create("y", &c2_d_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 3, c2_e_y);
  c2_e_hoistedGlobal = *c2_CheckDrug;
  c2_e_u = c2_e_hoistedGlobal;
  c2_f_y = NULL;
  sf_mex_assign(&c2_f_y, sf_mex_create("y", &c2_e_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 4, c2_f_y);
  c2_f_hoistedGlobal = *c2_ClearAlarm;
  c2_f_u = c2_f_hoistedGlobal;
  c2_g_y = NULL;
  sf_mex_assign(&c2_g_y, sf_mex_create("y", &c2_f_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 5, c2_g_y);
  c2_g_hoistedGlobal = *c2_ConfigureInfusionProgram;
  c2_g_u = c2_g_hoistedGlobal;
  c2_h_y = NULL;
  sf_mex_assign(&c2_h_y, sf_mex_create("y", &c2_g_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 6, c2_h_y);
  c2_h_hoistedGlobal = *c2_ConfirmConcentration;
  c2_h_u = c2_h_hoistedGlobal;
  c2_i_y = NULL;
  sf_mex_assign(&c2_i_y, sf_mex_create("y", &c2_h_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 7, c2_i_y);
  c2_i_hoistedGlobal = *c2_ConfirmDoseRate;
  c2_i_u = c2_i_hoistedGlobal;
  c2_j_y = NULL;
  sf_mex_assign(&c2_j_y, sf_mex_create("y", &c2_i_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 8, c2_j_y);
  c2_j_hoistedGlobal = *c2_ConfirmPauseInfusion;
  c2_j_u = c2_j_hoistedGlobal;
  c2_k_y = NULL;
  sf_mex_assign(&c2_k_y, sf_mex_create("y", &c2_j_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 9, c2_k_y);
  c2_k_hoistedGlobal = *c2_ConfirmPowerDown;
  c2_k_u = c2_k_hoistedGlobal;
  c2_l_y = NULL;
  sf_mex_assign(&c2_l_y, sf_mex_create("y", &c2_k_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 10, c2_l_y);
  c2_l_hoistedGlobal = *c2_ConfirmStopInfusion;
  c2_l_u = c2_l_hoistedGlobal;
  c2_m_y = NULL;
  sf_mex_assign(&c2_m_y, sf_mex_create("y", &c2_l_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 11, c2_m_y);
  c2_m_hoistedGlobal = *c2_ConfirmVTBI;
  c2_m_u = c2_m_hoistedGlobal;
  c2_n_y = NULL;
  sf_mex_assign(&c2_n_y, sf_mex_create("y", &c2_m_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 12, c2_n_y);
  c2_n_hoistedGlobal = *c2_PauseInfusion;
  c2_n_u = c2_n_hoistedGlobal;
  c2_o_y = NULL;
  sf_mex_assign(&c2_o_y, sf_mex_create("y", &c2_n_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 13, c2_o_y);
  c2_o_hoistedGlobal = *c2_PowerButton;
  c2_o_u = c2_o_hoistedGlobal;
  c2_p_y = NULL;
  sf_mex_assign(&c2_p_y, sf_mex_create("y", &c2_o_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 14, c2_p_y);
  c2_p_hoistedGlobal = *c2_Prime;
  c2_p_u = c2_p_hoistedGlobal;
  c2_q_y = NULL;
  sf_mex_assign(&c2_q_y, sf_mex_create("y", &c2_p_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 15, c2_q_y);
  c2_q_hoistedGlobal = *c2_RequestBolus;
  c2_q_u = c2_q_hoistedGlobal;
  c2_r_y = NULL;
  sf_mex_assign(&c2_r_y, sf_mex_create("y", &c2_q_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 16, c2_r_y);
  c2_r_hoistedGlobal = *c2_StartInfusion;
  c2_r_u = c2_r_hoistedGlobal;
  c2_s_y = NULL;
  sf_mex_assign(&c2_s_y, sf_mex_create("y", &c2_r_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 17, c2_s_y);
  c2_s_hoistedGlobal = *c2_StartNewInfusion;
  c2_s_u = c2_s_hoistedGlobal;
  c2_t_y = NULL;
  sf_mex_assign(&c2_t_y, sf_mex_create("y", &c2_s_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 18, c2_t_y);
  c2_t_hoistedGlobal = *c2_StartStopSimulation;
  c2_t_u = c2_t_hoistedGlobal;
  c2_u_y = NULL;
  sf_mex_assign(&c2_u_y, sf_mex_create("y", &c2_t_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 19, c2_u_y);
  c2_u_hoistedGlobal = *c2_StopInfusion;
  c2_u_u = c2_u_hoistedGlobal;
  c2_v_y = NULL;
  sf_mex_assign(&c2_v_y, sf_mex_create("y", &c2_u_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 20, c2_v_y);
  c2_v_hoistedGlobal = chartInstance->c2_is_active_c2_GPCA_Extension;
  c2_v_u = c2_v_hoistedGlobal;
  c2_w_y = NULL;
  sf_mex_assign(&c2_w_y, sf_mex_create("y", &c2_v_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 21, c2_w_y);
  c2_w_hoistedGlobal = chartInstance->c2_is_c2_GPCA_Extension;
  c2_w_u = c2_w_hoistedGlobal;
  c2_x_y = NULL;
  sf_mex_assign(&c2_x_y, sf_mex_create("y", &c2_w_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c2_y, 22, c2_x_y);
  sf_mex_assign(&c2_st, c2_y, FALSE);
  return c2_st;
}

static void set_sim_state_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_st)
{
  const mxArray *c2_u;
  real_T *c2_Cancel;
  real_T *c2_ChangeDoseRate;
  real_T *c2_ChangeVTBI;
  real_T *c2_CheckAdminSet;
  real_T *c2_CheckDrug;
  real_T *c2_ClearAlarm;
  real_T *c2_ConfigureInfusionProgram;
  real_T *c2_ConfirmConcentration;
  real_T *c2_ConfirmDoseRate;
  real_T *c2_ConfirmPauseInfusion;
  real_T *c2_ConfirmPowerDown;
  real_T *c2_ConfirmStopInfusion;
  real_T *c2_ConfirmVTBI;
  real_T *c2_PauseInfusion;
  real_T *c2_PowerButton;
  real_T *c2_Prime;
  real_T *c2_RequestBolus;
  real_T *c2_StartInfusion;
  real_T *c2_StartNewInfusion;
  real_T *c2_StartStopSimulation;
  real_T *c2_StopInfusion;
  c2_Cancel = (real_T *)ssGetOutputPortSignal(chartInstance->S, 21);
  c2_ConfirmPowerDown = (real_T *)ssGetOutputPortSignal(chartInstance->S, 20);
  c2_ClearAlarm = (real_T *)ssGetOutputPortSignal(chartInstance->S, 19);
  c2_RequestBolus = (real_T *)ssGetOutputPortSignal(chartInstance->S, 18);
  c2_ConfirmStopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 17);
  c2_StopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 16);
  c2_ConfirmPauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 15);
  c2_PauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 14);
  c2_ChangeVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 13);
  c2_ChangeDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 12);
  c2_StartInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c2_ConfirmVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 10);
  c2_ConfirmDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 9);
  c2_ConfirmConcentration = (real_T *)ssGetOutputPortSignal(chartInstance->S, 8);
  c2_ConfigureInfusionProgram = (real_T *)ssGetOutputPortSignal(chartInstance->S,
    7);
  c2_CheckDrug = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c2_Prime = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c2_CheckAdminSet = (real_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c2_StartNewInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c2_PowerButton = (real_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c2_StartStopSimulation = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c2_u = sf_mex_dup(c2_st);
  *c2_Cancel = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c2_u, 0)), "Cancel");
  *c2_ChangeDoseRate = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 1)), "ChangeDoseRate");
  *c2_ChangeVTBI = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 2)), "ChangeVTBI");
  *c2_CheckAdminSet = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 3)), "CheckAdminSet");
  *c2_CheckDrug = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c2_u, 4)), "CheckDrug");
  *c2_ClearAlarm = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 5)), "ClearAlarm");
  *c2_ConfigureInfusionProgram = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 6)), "ConfigureInfusionProgram");
  *c2_ConfirmConcentration = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 7)), "ConfirmConcentration");
  *c2_ConfirmDoseRate = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 8)), "ConfirmDoseRate");
  *c2_ConfirmPauseInfusion = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 9)), "ConfirmPauseInfusion");
  *c2_ConfirmPowerDown = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 10)), "ConfirmPowerDown");
  *c2_ConfirmStopInfusion = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 11)), "ConfirmStopInfusion");
  *c2_ConfirmVTBI = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 12)), "ConfirmVTBI");
  *c2_PauseInfusion = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 13)), "PauseInfusion");
  *c2_PowerButton = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 14)), "PowerButton");
  *c2_Prime = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c2_u, 15)), "Prime");
  *c2_RequestBolus = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 16)), "RequestBolus");
  *c2_StartInfusion = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 17)), "StartInfusion");
  *c2_StartNewInfusion = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 18)), "StartNewInfusion");
  *c2_StartStopSimulation = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 19)), "StartStopSimulation");
  *c2_StopInfusion = c2_d_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c2_u, 20)), "StopInfusion");
  chartInstance->c2_is_active_c2_GPCA_Extension = c2_b_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c2_u, 21)),
     "is_active_c2_GPCA_Extension");
  chartInstance->c2_is_c2_GPCA_Extension = c2_b_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c2_u, 22)), "is_c2_GPCA_Extension");
  sf_mex_assign(&chartInstance->c2_setSimStateSideEffectsInfo,
                c2_f_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c2_u, 23)), "setSimStateSideEffectsInfo"), TRUE);
  sf_mex_destroy(&c2_u);
  chartInstance->c2_doSetSimStateSideEffects = 1U;
  c2_update_debugger_state_c2_GPCA_Extension(chartInstance);
  sf_mex_destroy(&c2_st);
}

static void c2_set_sim_state_side_effects_c2_GPCA_Extension
  (SFc2_GPCA_ExtensionInstanceStruct *chartInstance)
{
  if (chartInstance->c2_doSetSimStateSideEffects != 0) {
    if (chartInstance->c2_is_c2_GPCA_Extension == c2_IN_st0) {
      chartInstance->c2_tp_st0 = 1U;
    } else {
      chartInstance->c2_tp_st0 = 0U;
    }

    chartInstance->c2_doSetSimStateSideEffects = 0U;
  }
}

static void finalize_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  sf_mex_destroy(&chartInstance->c2_setSimStateSideEffectsInfo);
}

static void sf_c2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  c2_set_sim_state_side_effects_c2_GPCA_Extension(chartInstance);
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
  _SFD_CC_CALL(CHART_ENTER_SFUNCTION_TAG, 1U, chartInstance->c2_sfEvent);
  chartInstance->c2_sfEvent = CALL_EVENT;
  _SFD_CC_CALL(CHART_ENTER_DURING_FUNCTION_TAG, 1U, chartInstance->c2_sfEvent);
  if (chartInstance->c2_is_active_c2_GPCA_Extension == 0) {
    _SFD_CC_CALL(CHART_ENTER_ENTRY_FUNCTION_TAG, 1U, chartInstance->c2_sfEvent);
    chartInstance->c2_is_active_c2_GPCA_Extension = 1U;
    _SFD_CC_CALL(EXIT_OUT_OF_FUNCTION_TAG, 1U, chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 18U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 18U, chartInstance->c2_sfEvent);
    chartInstance->c2_is_c2_GPCA_Extension = c2_IN_st0;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c2_sfEvent);
    chartInstance->c2_tp_st0 = 1U;
  } else {
    c2_st0(chartInstance);
  }

  _SFD_CC_CALL(EXIT_OUT_OF_FUNCTION_TAG, 1U, chartInstance->c2_sfEvent);
  sf_debug_check_for_state_inconsistency(_GPCA_ExtensionMachineNumber_,
    chartInstance->chartNumber, chartInstance->instanceNumber);
}

static void initSimStructsc2_GPCA_Extension(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
}

static void c2_st0(SFc2_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c2_out;
  boolean_T c2_b_out;
  boolean_T c2_c_out;
  boolean_T c2_d_out;
  boolean_T c2_e_out;
  boolean_T c2_f_out;
  boolean_T c2_g_out;
  boolean_T c2_h_out;
  boolean_T c2_i_out;
  boolean_T c2_j_out;
  boolean_T c2_k_out;
  boolean_T c2_l_out;
  boolean_T c2_m_out;
  boolean_T c2_n_out;
  boolean_T c2_o_out;
  boolean_T c2_p_out;
  boolean_T c2_q_out;
  boolean_T c2_r_out;
  boolean_T c2_s_out;
  boolean_T c2_t_out;
  boolean_T c2_u_out;
  real_T *c2_StartStopSimulation;
  real_T *c2_PowerButton;
  real_T *c2_StartNewInfusion;
  real_T *c2_CheckAdminSet;
  real_T *c2_Prime;
  real_T *c2_CheckDrug;
  real_T *c2_ConfigureInfusionProgram;
  real_T *c2_ConfirmConcentration;
  real_T *c2_ConfirmDoseRate;
  real_T *c2_ConfirmVTBI;
  real_T *c2_StartInfusion;
  real_T *c2_ChangeDoseRate;
  real_T *c2_ChangeVTBI;
  real_T *c2_PauseInfusion;
  real_T *c2_ConfirmPauseInfusion;
  real_T *c2_StopInfusion;
  real_T *c2_ConfirmStopInfusion;
  real_T *c2_RequestBolus;
  real_T *c2_ClearAlarm;
  real_T *c2_ConfirmPowerDown;
  real_T *c2_Cancel;
  int32_T *c2_CommandID;
  boolean_T guard1 = FALSE;
  boolean_T guard2 = FALSE;
  boolean_T guard3 = FALSE;
  boolean_T guard4 = FALSE;
  boolean_T guard5 = FALSE;
  boolean_T guard6 = FALSE;
  boolean_T guard7 = FALSE;
  boolean_T guard8 = FALSE;
  boolean_T guard9 = FALSE;
  boolean_T guard10 = FALSE;
  boolean_T guard11 = FALSE;
  boolean_T guard12 = FALSE;
  boolean_T guard13 = FALSE;
  boolean_T guard14 = FALSE;
  boolean_T guard15 = FALSE;
  boolean_T guard16 = FALSE;
  boolean_T guard17 = FALSE;
  boolean_T guard18 = FALSE;
  boolean_T guard19 = FALSE;
  boolean_T guard20 = FALSE;
  c2_Cancel = (real_T *)ssGetOutputPortSignal(chartInstance->S, 21);
  c2_ConfirmPowerDown = (real_T *)ssGetOutputPortSignal(chartInstance->S, 20);
  c2_ClearAlarm = (real_T *)ssGetOutputPortSignal(chartInstance->S, 19);
  c2_RequestBolus = (real_T *)ssGetOutputPortSignal(chartInstance->S, 18);
  c2_ConfirmStopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 17);
  c2_StopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 16);
  c2_ConfirmPauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 15);
  c2_PauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 14);
  c2_ChangeVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 13);
  c2_ChangeDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 12);
  c2_StartInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c2_ConfirmVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 10);
  c2_ConfirmDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 9);
  c2_ConfirmConcentration = (real_T *)ssGetOutputPortSignal(chartInstance->S, 8);
  c2_ConfigureInfusionProgram = (real_T *)ssGetOutputPortSignal(chartInstance->S,
    7);
  c2_CheckDrug = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c2_Prime = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c2_CheckAdminSet = (real_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c2_StartNewInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c2_PowerButton = (real_T *)ssGetOutputPortSignal(chartInstance->S, 2);
  c2_StartStopSimulation = (real_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c2_CommandID = (int32_T *)ssGetInputPortSignal(chartInstance->S, 0);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 0U, chartInstance->c2_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 19U, chartInstance->c2_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 19U, chartInstance->c2_sfEvent);
  *c2_StartStopSimulation = 0.0;
  *c2_PowerButton = 0.0;
  *c2_StartNewInfusion = 0.0;
  *c2_CheckAdminSet = 0.0;
  *c2_Prime = 0.0;
  *c2_CheckDrug = 0.0;
  *c2_ConfigureInfusionProgram = 0.0;
  *c2_ConfirmConcentration = 0.0;
  *c2_ConfirmDoseRate = 0.0;
  *c2_ConfirmVTBI = 0.0;
  *c2_StartInfusion = 0.0;
  *c2_ChangeDoseRate = 0.0;
  *c2_ChangeVTBI = 0.0;
  *c2_PauseInfusion = 0.0;
  *c2_ConfirmPauseInfusion = 0.0;
  *c2_StopInfusion = 0.0;
  *c2_ConfirmStopInfusion = 0.0;
  *c2_RequestBolus = 0.0;
  *c2_ClearAlarm = 0.0;
  *c2_ConfirmPowerDown = 0.0;
  *c2_Cancel = 0.0;
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 104U, chartInstance->c2_sfEvent);
  c2_out = (CV_TRANSITION_EVAL(104U, (int32_T)_SFD_CCP_CALL(104U, 0,
              *c2_CommandID == 1 != 0U, chartInstance->c2_sfEvent)) != 0);
  guard1 = FALSE;
  guard2 = FALSE;
  guard3 = FALSE;
  guard4 = FALSE;
  guard5 = FALSE;
  guard6 = FALSE;
  guard7 = FALSE;
  guard8 = FALSE;
  guard9 = FALSE;
  guard10 = FALSE;
  guard11 = FALSE;
  guard12 = FALSE;
  guard13 = FALSE;
  guard14 = FALSE;
  guard15 = FALSE;
  guard16 = FALSE;
  guard17 = FALSE;
  guard18 = FALSE;
  guard19 = FALSE;
  guard20 = FALSE;
  if (c2_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 104U, chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 105U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 105U, chartInstance->c2_sfEvent);
    *c2_StartStopSimulation = 1.0;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 106U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 106U, chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 108U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 108U, chartInstance->c2_sfEvent);
    guard20 = TRUE;
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 107U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 107U, chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 0U, chartInstance->c2_sfEvent);
    c2_b_out = (CV_TRANSITION_EVAL(0U, (int32_T)_SFD_CCP_CALL(0U, 0,
      *c2_CommandID == 2 != 0U, chartInstance->c2_sfEvent)) != 0);
    if (c2_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 0U, chartInstance->c2_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 1U,
                   chartInstance->c2_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 1U, chartInstance->c2_sfEvent);
      *c2_PowerButton = 1.0;
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 2U,
                   chartInstance->c2_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 2U, chartInstance->c2_sfEvent);
      guard20 = TRUE;
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 7U,
                   chartInstance->c2_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 7U, chartInstance->c2_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 4U,
                   chartInstance->c2_sfEvent);
      c2_c_out = (CV_TRANSITION_EVAL(4U, (int32_T)_SFD_CCP_CALL(4U, 0,
        *c2_CommandID == 3 != 0U, chartInstance->c2_sfEvent)) != 0);
      if (c2_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 4U, chartInstance->c2_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 5U,
                     chartInstance->c2_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 5U, chartInstance->c2_sfEvent);
        *c2_StartNewInfusion = 1.0;
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 6U,
                     chartInstance->c2_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 6U, chartInstance->c2_sfEvent);
        guard19 = TRUE;
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 8U,
                     chartInstance->c2_sfEvent);
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 8U, chartInstance->c2_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 10U,
                     chartInstance->c2_sfEvent);
        c2_d_out = (CV_TRANSITION_EVAL(10U, (int32_T)_SFD_CCP_CALL(10U, 0,
          *c2_CommandID == 4 != 0U, chartInstance->c2_sfEvent)) != 0);
        if (c2_d_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 10U, chartInstance->c2_sfEvent);
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 11U,
                       chartInstance->c2_sfEvent);
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 11U, chartInstance->c2_sfEvent);
          *c2_CheckAdminSet = 1.0;
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 12U,
                       chartInstance->c2_sfEvent);
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 12U, chartInstance->c2_sfEvent);
          guard18 = TRUE;
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 13U,
                       chartInstance->c2_sfEvent);
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 13U, chartInstance->c2_sfEvent);
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 15U,
                       chartInstance->c2_sfEvent);
          c2_e_out = (CV_TRANSITION_EVAL(15U, (int32_T)_SFD_CCP_CALL(15U, 0,
            *c2_CommandID == 5 != 0U, chartInstance->c2_sfEvent)) != 0);
          if (c2_e_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 15U, chartInstance->c2_sfEvent);
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 16U,
                         chartInstance->c2_sfEvent);
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 16U, chartInstance->c2_sfEvent);
            *c2_Prime = 1.0;
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 17U,
                         chartInstance->c2_sfEvent);
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 17U, chartInstance->c2_sfEvent);
            guard17 = TRUE;
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 23U,
                         chartInstance->c2_sfEvent);
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 23U, chartInstance->c2_sfEvent);
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 20U,
                         chartInstance->c2_sfEvent);
            c2_f_out = (CV_TRANSITION_EVAL(20U, (int32_T)_SFD_CCP_CALL(20U, 0,
              *c2_CommandID == 6 != 0U, chartInstance->c2_sfEvent)) != 0);
            if (c2_f_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 20U, chartInstance->c2_sfEvent);
              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 21U,
                           chartInstance->c2_sfEvent);
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 21U, chartInstance->c2_sfEvent);
              *c2_CheckDrug = 1.0;
              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 22U,
                           chartInstance->c2_sfEvent);
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 22U, chartInstance->c2_sfEvent);
              guard16 = TRUE;
            } else {
              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 28U,
                           chartInstance->c2_sfEvent);
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 28U, chartInstance->c2_sfEvent);
              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 25U,
                           chartInstance->c2_sfEvent);
              c2_g_out = (CV_TRANSITION_EVAL(25U, (int32_T)_SFD_CCP_CALL(25U, 0,
                *c2_CommandID == 7 != 0U, chartInstance->c2_sfEvent)) != 0);
              if (c2_g_out) {
                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 25U,
                             chartInstance->c2_sfEvent);
                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 26U,
                             chartInstance->c2_sfEvent);
                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 26U,
                             chartInstance->c2_sfEvent);
                *c2_ConfigureInfusionProgram = 1.0;
                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 27U,
                             chartInstance->c2_sfEvent);
                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 27U,
                             chartInstance->c2_sfEvent);
                guard15 = TRUE;
              } else {
                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 33U,
                             chartInstance->c2_sfEvent);
                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 33U,
                             chartInstance->c2_sfEvent);
                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 30U,
                             chartInstance->c2_sfEvent);
                c2_h_out = (CV_TRANSITION_EVAL(30U, (int32_T)_SFD_CCP_CALL(30U,
                  0, *c2_CommandID == 8 != 0U, chartInstance->c2_sfEvent)) != 0);
                if (c2_h_out) {
                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 30U,
                               chartInstance->c2_sfEvent);
                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 31U,
                               chartInstance->c2_sfEvent);
                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 31U,
                               chartInstance->c2_sfEvent);
                  *c2_ConfirmConcentration = 1.0;
                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 32U,
                               chartInstance->c2_sfEvent);
                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 32U,
                               chartInstance->c2_sfEvent);
                  guard14 = TRUE;
                } else {
                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 68U,
                               chartInstance->c2_sfEvent);
                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 68U,
                               chartInstance->c2_sfEvent);
                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 35U,
                               chartInstance->c2_sfEvent);
                  c2_i_out = (CV_TRANSITION_EVAL(35U, (int32_T)_SFD_CCP_CALL(35U,
                    0, *c2_CommandID == 9 != 0U, chartInstance->c2_sfEvent)) !=
                              0);
                  if (c2_i_out) {
                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 35U,
                                 chartInstance->c2_sfEvent);
                    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 36U,
                                 chartInstance->c2_sfEvent);
                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 36U,
                                 chartInstance->c2_sfEvent);
                    *c2_ConfirmDoseRate = 1.0;
                    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 37U,
                                 chartInstance->c2_sfEvent);
                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 37U,
                                 chartInstance->c2_sfEvent);
                    guard13 = TRUE;
                  } else {
                    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 42U,
                                 chartInstance->c2_sfEvent);
                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 42U,
                                 chartInstance->c2_sfEvent);
                    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 39U,
                                 chartInstance->c2_sfEvent);
                    c2_j_out = (CV_TRANSITION_EVAL(39U, (int32_T)_SFD_CCP_CALL
                      (39U, 0, *c2_CommandID == 10 != 0U,
                       chartInstance->c2_sfEvent)) != 0);
                    if (c2_j_out) {
                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 39U,
                                   chartInstance->c2_sfEvent);
                      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 40U,
                                   chartInstance->c2_sfEvent);
                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 40U,
                                   chartInstance->c2_sfEvent);
                      *c2_ConfirmVTBI = 1.0;
                      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 41U,
                                   chartInstance->c2_sfEvent);
                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 41U,
                                   chartInstance->c2_sfEvent);
                      guard12 = TRUE;
                    } else {
                      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 43U,
                                   chartInstance->c2_sfEvent);
                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 43U,
                                   chartInstance->c2_sfEvent);
                      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 45U,
                                   chartInstance->c2_sfEvent);
                      c2_k_out = (CV_TRANSITION_EVAL(45U, (int32_T)_SFD_CCP_CALL
                                   (45U, 0, *c2_CommandID == 11 != 0U,
                                    chartInstance->c2_sfEvent)) != 0);
                      if (c2_k_out) {
                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 45U,
                                     chartInstance->c2_sfEvent);
                        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                                     chartInstance->c2_sfEvent);
                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U,
                                     chartInstance->c2_sfEvent);
                        *c2_StartInfusion = 1.0;
                        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 47U,
                                     chartInstance->c2_sfEvent);
                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 47U,
                                     chartInstance->c2_sfEvent);
                        guard11 = TRUE;
                      } else {
                        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 48U,
                                     chartInstance->c2_sfEvent);
                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 48U,
                                     chartInstance->c2_sfEvent);
                        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 50U,
                                     chartInstance->c2_sfEvent);
                        c2_l_out = (CV_TRANSITION_EVAL(50U, (int32_T)
                          _SFD_CCP_CALL(50U, 0, *c2_CommandID == 12 != 0U,
                                        chartInstance->c2_sfEvent)) != 0);
                        if (c2_l_out) {
                          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 50U,
                                       chartInstance->c2_sfEvent);
                          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 51U,
                                       chartInstance->c2_sfEvent);
                          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 51U,
                                       chartInstance->c2_sfEvent);
                          *c2_ChangeDoseRate = 1.0;
                          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 52U,
                                       chartInstance->c2_sfEvent);
                          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 52U,
                                       chartInstance->c2_sfEvent);
                          guard10 = TRUE;
                        } else {
                          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 56U,
                                       chartInstance->c2_sfEvent);
                          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 56U,
                                       chartInstance->c2_sfEvent);
                          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 53U,
                                       chartInstance->c2_sfEvent);
                          c2_m_out = (CV_TRANSITION_EVAL(53U, (int32_T)
                            _SFD_CCP_CALL(53U, 0, *c2_CommandID == 13 != 0U,
                                          chartInstance->c2_sfEvent)) != 0);
                          if (c2_m_out) {
                            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 53U,
                                         chartInstance->c2_sfEvent);
                            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 54U,
                                         chartInstance->c2_sfEvent);
                            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 54U,
                                         chartInstance->c2_sfEvent);
                            *c2_ChangeVTBI = 1.0;
                            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 55U,
                                         chartInstance->c2_sfEvent);
                            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 55U,
                                         chartInstance->c2_sfEvent);
                            guard9 = TRUE;
                          } else {
                            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 61U,
                                         chartInstance->c2_sfEvent);
                            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 61U,
                                         chartInstance->c2_sfEvent);
                            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 58U,
                                         chartInstance->c2_sfEvent);
                            c2_n_out = (CV_TRANSITION_EVAL(58U, (int32_T)
                              _SFD_CCP_CALL(58U, 0, *c2_CommandID == 14 != 0U,
                                            chartInstance->c2_sfEvent)) != 0);
                            if (c2_n_out) {
                              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 58U,
                                           chartInstance->c2_sfEvent);
                              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 59U,
                                           chartInstance->c2_sfEvent);
                              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 59U,
                                           chartInstance->c2_sfEvent);
                              *c2_PauseInfusion = 1.0;
                              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 60U,
                                           chartInstance->c2_sfEvent);
                              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 60U,
                                           chartInstance->c2_sfEvent);
                              guard8 = TRUE;
                            } else {
                              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 66U,
                                           chartInstance->c2_sfEvent);
                              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 66U,
                                           chartInstance->c2_sfEvent);
                              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 63U,
                                           chartInstance->c2_sfEvent);
                              c2_o_out = (CV_TRANSITION_EVAL(63U, (int32_T)
                                _SFD_CCP_CALL(63U, 0, *c2_CommandID == 15 != 0U,
                                              chartInstance->c2_sfEvent)) != 0);
                              if (c2_o_out) {
                                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 63U,
                                             chartInstance->c2_sfEvent);
                                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG,
                                             64U, chartInstance->c2_sfEvent);
                                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 64U,
                                             chartInstance->c2_sfEvent);
                                *c2_ConfirmPauseInfusion = 1.0;
                                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG,
                                             65U, chartInstance->c2_sfEvent);
                                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 65U,
                                             chartInstance->c2_sfEvent);
                                guard7 = TRUE;
                              } else {
                                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG,
                                             92U, chartInstance->c2_sfEvent);
                                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 92U,
                                             chartInstance->c2_sfEvent);
                                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG,
                                             70U, chartInstance->c2_sfEvent);
                                c2_p_out = (CV_TRANSITION_EVAL(70U, (int32_T)
                                  _SFD_CCP_CALL(70U, 0, *c2_CommandID == 16 !=
                                                0U, chartInstance->c2_sfEvent))
                                            != 0);
                                if (c2_p_out) {
                                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 70U,
                                               chartInstance->c2_sfEvent);
                                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG,
                                               71U, chartInstance->c2_sfEvent);
                                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 71U,
                                               chartInstance->c2_sfEvent);
                                  *c2_StopInfusion = 1.0;
                                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG,
                                               72U, chartInstance->c2_sfEvent);
                                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 72U,
                                               chartInstance->c2_sfEvent);
                                  guard6 = TRUE;
                                } else {
                                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG,
                                               73U, chartInstance->c2_sfEvent);
                                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 73U,
                                               chartInstance->c2_sfEvent);
                                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG,
                                               75U, chartInstance->c2_sfEvent);
                                  c2_q_out = (CV_TRANSITION_EVAL(75U, (int32_T)
                                    _SFD_CCP_CALL(75U, 0, *c2_CommandID == 17 !=
                                                  0U, chartInstance->c2_sfEvent))
                                              != 0);
                                  if (c2_q_out) {
                                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 75U,
                                                 chartInstance->c2_sfEvent);
                                    _SFD_CT_CALL
                                      (TRANSITION_BEFORE_PROCESSING_TAG, 76U,
                                       chartInstance->c2_sfEvent);
                                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 76U,
                                                 chartInstance->c2_sfEvent);
                                    *c2_ConfirmStopInfusion = 1.0;
                                    _SFD_CT_CALL
                                      (TRANSITION_BEFORE_PROCESSING_TAG, 77U,
                                       chartInstance->c2_sfEvent);
                                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 77U,
                                                 chartInstance->c2_sfEvent);
                                    guard5 = TRUE;
                                  } else {
                                    _SFD_CT_CALL
                                      (TRANSITION_BEFORE_PROCESSING_TAG, 81U,
                                       chartInstance->c2_sfEvent);
                                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 81U,
                                                 chartInstance->c2_sfEvent);
                                    _SFD_CT_CALL
                                      (TRANSITION_BEFORE_PROCESSING_TAG, 78U,
                                       chartInstance->c2_sfEvent);
                                    c2_r_out = (CV_TRANSITION_EVAL(78U, (int32_T)
                                      _SFD_CCP_CALL(78U, 0, *c2_CommandID == 18
                                                    != 0U,
                                                    chartInstance->c2_sfEvent))
                                                != 0);
                                    if (c2_r_out) {
                                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 78U,
                                                   chartInstance->c2_sfEvent);
                                      _SFD_CT_CALL
                                        (TRANSITION_BEFORE_PROCESSING_TAG, 79U,
                                         chartInstance->c2_sfEvent);
                                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 79U,
                                                   chartInstance->c2_sfEvent);
                                      *c2_RequestBolus = 1.0;
                                      _SFD_CT_CALL
                                        (TRANSITION_BEFORE_PROCESSING_TAG, 80U,
                                         chartInstance->c2_sfEvent);
                                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 80U,
                                                   chartInstance->c2_sfEvent);
                                      guard4 = TRUE;
                                    } else {
                                      _SFD_CT_CALL
                                        (TRANSITION_BEFORE_PROCESSING_TAG, 86U,
                                         chartInstance->c2_sfEvent);
                                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 86U,
                                                   chartInstance->c2_sfEvent);
                                      _SFD_CT_CALL
                                        (TRANSITION_BEFORE_PROCESSING_TAG, 83U,
                                         chartInstance->c2_sfEvent);
                                      c2_s_out = (CV_TRANSITION_EVAL(83U,
                                        (int32_T)_SFD_CCP_CALL(83U, 0,
                                        *c2_CommandID == 19 != 0U,
                                        chartInstance->c2_sfEvent)) != 0);
                                      if (c2_s_out) {
                                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 83U,
                                                     chartInstance->c2_sfEvent);
                                        _SFD_CT_CALL
                                          (TRANSITION_BEFORE_PROCESSING_TAG, 84U,
                                           chartInstance->c2_sfEvent);
                                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 84U,
                                                     chartInstance->c2_sfEvent);
                                        *c2_ClearAlarm = 1.0;
                                        _SFD_CT_CALL
                                          (TRANSITION_BEFORE_PROCESSING_TAG, 85U,
                                           chartInstance->c2_sfEvent);
                                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 85U,
                                                     chartInstance->c2_sfEvent);
                                        guard3 = TRUE;
                                      } else {
                                        _SFD_CT_CALL
                                          (TRANSITION_BEFORE_PROCESSING_TAG, 90U,
                                           chartInstance->c2_sfEvent);
                                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 90U,
                                                     chartInstance->c2_sfEvent);
                                        _SFD_CT_CALL
                                          (TRANSITION_BEFORE_PROCESSING_TAG, 88U,
                                           chartInstance->c2_sfEvent);
                                        c2_t_out = (CV_TRANSITION_EVAL(88U,
                                          (int32_T)_SFD_CCP_CALL(88U, 0,
                                          *c2_CommandID == 20 != 0U,
                                          chartInstance->c2_sfEvent)) != 0);
                                        if (c2_t_out) {
                                          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG,
                                                       88U,
                                                       chartInstance->c2_sfEvent);
                                          _SFD_CT_CALL
                                            (TRANSITION_BEFORE_PROCESSING_TAG,
                                             89U, chartInstance->c2_sfEvent);
                                          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG,
                                                       89U,
                                                       chartInstance->c2_sfEvent);
                                          *c2_ConfirmPowerDown = 1.0;
                                          _SFD_CT_CALL
                                            (TRANSITION_BEFORE_PROCESSING_TAG,
                                             101U, chartInstance->c2_sfEvent);
                                          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG,
                                                       101U,
                                                       chartInstance->c2_sfEvent);
                                          guard2 = TRUE;
                                        } else {
                                          _SFD_CT_CALL
                                            (TRANSITION_BEFORE_PROCESSING_TAG,
                                             95U, chartInstance->c2_sfEvent);
                                          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG,
                                                       95U,
                                                       chartInstance->c2_sfEvent);
                                          _SFD_CT_CALL
                                            (TRANSITION_BEFORE_PROCESSING_TAG,
                                             93U, chartInstance->c2_sfEvent);
                                          c2_u_out = (CV_TRANSITION_EVAL(93U,
                                            (int32_T)_SFD_CCP_CALL(93U, 0,
                                            *c2_CommandID == 21 != 0U,
                                            chartInstance->c2_sfEvent)) != 0);
                                          if (c2_u_out) {
                                            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG,
                                                         93U,
                                                         chartInstance->c2_sfEvent);
                                            _SFD_CT_CALL
                                              (TRANSITION_BEFORE_PROCESSING_TAG,
                                               94U, chartInstance->c2_sfEvent);
                                            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG,
                                                         94U,
                                                         chartInstance->c2_sfEvent);
                                            *c2_Cancel = 1.0;
                                            _SFD_CT_CALL
                                              (TRANSITION_BEFORE_PROCESSING_TAG,
                                               99U, chartInstance->c2_sfEvent);
                                            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG,
                                                         99U,
                                                         chartInstance->c2_sfEvent);
                                            guard1 = TRUE;
                                          } else {
                                            _SFD_CT_CALL
                                              (TRANSITION_BEFORE_PROCESSING_TAG,
                                               98U, chartInstance->c2_sfEvent);
                                            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG,
                                                         98U,
                                                         chartInstance->c2_sfEvent);
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  if (guard20 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 3U, chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 3U, chartInstance->c2_sfEvent);
    guard19 = TRUE;
  }

  if (guard19 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 9U, chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 9U, chartInstance->c2_sfEvent);
    guard18 = TRUE;
  }

  if (guard18 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 14U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 14U, chartInstance->c2_sfEvent);
    guard17 = TRUE;
  }

  if (guard17 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 24U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 24U, chartInstance->c2_sfEvent);
    guard16 = TRUE;
  }

  if (guard16 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 29U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 29U, chartInstance->c2_sfEvent);
    guard15 = TRUE;
  }

  if (guard15 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 34U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 34U, chartInstance->c2_sfEvent);
    guard14 = TRUE;
  }

  if (guard14 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 69U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 69U, chartInstance->c2_sfEvent);
    guard13 = TRUE;
  }

  if (guard13 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 38U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 38U, chartInstance->c2_sfEvent);
    guard12 = TRUE;
  }

  if (guard12 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 44U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 44U, chartInstance->c2_sfEvent);
    guard11 = TRUE;
  }

  if (guard11 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 49U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 49U, chartInstance->c2_sfEvent);
    guard10 = TRUE;
  }

  if (guard10 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 57U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 57U, chartInstance->c2_sfEvent);
    guard9 = TRUE;
  }

  if (guard9 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 62U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 62U, chartInstance->c2_sfEvent);
    guard8 = TRUE;
  }

  if (guard8 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 67U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 67U, chartInstance->c2_sfEvent);
    guard7 = TRUE;
  }

  if (guard7 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 103U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 103U, chartInstance->c2_sfEvent);
    guard6 = TRUE;
  }

  if (guard6 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 74U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 74U, chartInstance->c2_sfEvent);
    guard5 = TRUE;
  }

  if (guard5 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 82U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 82U, chartInstance->c2_sfEvent);
    guard4 = TRUE;
  }

  if (guard4 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 87U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 87U, chartInstance->c2_sfEvent);
    guard3 = TRUE;
  }

  if (guard3 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 91U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 91U, chartInstance->c2_sfEvent);
    guard2 = TRUE;
  }

  if (guard2 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 102U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 102U, chartInstance->c2_sfEvent);
    guard1 = TRUE;
  }

  if (guard1 == TRUE) {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 100U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 100U, chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 97U,
                 chartInstance->c2_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 97U, chartInstance->c2_sfEvent);
  }

  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 96U, chartInstance->c2_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 96U, chartInstance->c2_sfEvent);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 0U, chartInstance->c2_sfEvent);
}

static void init_script_number_translation(uint32_T c2_machineNumber, uint32_T
  c2_chartNumber)
{
}

const mxArray *sf_c2_GPCA_Extension_get_eml_resolved_functions_info(void)
{
  const mxArray *c2_nameCaptureInfo = NULL;
  c2_nameCaptureInfo = NULL;
  sf_mex_assign(&c2_nameCaptureInfo, sf_mex_create("nameCaptureInfo", NULL, 0,
    0U, 1U, 0U, 2, 0, 1), FALSE);
  return c2_nameCaptureInfo;
}

static const mxArray *c2_sf_marshallOut(void *chartInstanceVoid, void *c2_inData)
{
  const mxArray *c2_mxArrayOutData = NULL;
  int32_T c2_u;
  const mxArray *c2_y = NULL;
  SFc2_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc2_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c2_mxArrayOutData = NULL;
  c2_u = *(int32_T *)c2_inData;
  c2_y = NULL;
  sf_mex_assign(&c2_y, sf_mex_create("y", &c2_u, 6, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c2_mxArrayOutData, c2_y, FALSE);
  return c2_mxArrayOutData;
}

static int32_T c2_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_u, const emlrtMsgIdentifier *c2_parentId)
{
  int32_T c2_y;
  int32_T c2_i0;
  sf_mex_import(c2_parentId, sf_mex_dup(c2_u), &c2_i0, 1, 6, 0U, 0, 0U, 0);
  c2_y = c2_i0;
  sf_mex_destroy(&c2_u);
  return c2_y;
}

static void c2_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c2_mxArrayInData, const char_T *c2_varName, void *c2_outData)
{
  const mxArray *c2_b_sfEvent;
  const char_T *c2_identifier;
  emlrtMsgIdentifier c2_thisId;
  int32_T c2_y;
  SFc2_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc2_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c2_b_sfEvent = sf_mex_dup(c2_mxArrayInData);
  c2_identifier = c2_varName;
  c2_thisId.fIdentifier = c2_identifier;
  c2_thisId.fParent = NULL;
  c2_y = c2_emlrt_marshallIn(chartInstance, sf_mex_dup(c2_b_sfEvent), &c2_thisId);
  sf_mex_destroy(&c2_b_sfEvent);
  *(int32_T *)c2_outData = c2_y;
  sf_mex_destroy(&c2_mxArrayInData);
}

static const mxArray *c2_b_sf_marshallOut(void *chartInstanceVoid, void
  *c2_inData)
{
  const mxArray *c2_mxArrayOutData = NULL;
  uint8_T c2_u;
  const mxArray *c2_y = NULL;
  SFc2_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc2_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c2_mxArrayOutData = NULL;
  c2_u = *(uint8_T *)c2_inData;
  c2_y = NULL;
  sf_mex_assign(&c2_y, sf_mex_create("y", &c2_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c2_mxArrayOutData, c2_y, FALSE);
  return c2_mxArrayOutData;
}

static uint8_T c2_b_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_b_tp_st0, const char_T *c2_identifier)
{
  uint8_T c2_y;
  emlrtMsgIdentifier c2_thisId;
  c2_thisId.fIdentifier = c2_identifier;
  c2_thisId.fParent = NULL;
  c2_y = c2_c_emlrt_marshallIn(chartInstance, sf_mex_dup(c2_b_tp_st0),
    &c2_thisId);
  sf_mex_destroy(&c2_b_tp_st0);
  return c2_y;
}

static uint8_T c2_c_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_u, const emlrtMsgIdentifier *c2_parentId)
{
  uint8_T c2_y;
  uint8_T c2_u0;
  sf_mex_import(c2_parentId, sf_mex_dup(c2_u), &c2_u0, 1, 3, 0U, 0, 0U, 0);
  c2_y = c2_u0;
  sf_mex_destroy(&c2_u);
  return c2_y;
}

static void c2_b_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c2_mxArrayInData, const char_T *c2_varName, void *c2_outData)
{
  const mxArray *c2_b_tp_st0;
  const char_T *c2_identifier;
  emlrtMsgIdentifier c2_thisId;
  uint8_T c2_y;
  SFc2_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc2_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c2_b_tp_st0 = sf_mex_dup(c2_mxArrayInData);
  c2_identifier = c2_varName;
  c2_thisId.fIdentifier = c2_identifier;
  c2_thisId.fParent = NULL;
  c2_y = c2_c_emlrt_marshallIn(chartInstance, sf_mex_dup(c2_b_tp_st0),
    &c2_thisId);
  sf_mex_destroy(&c2_b_tp_st0);
  *(uint8_T *)c2_outData = c2_y;
  sf_mex_destroy(&c2_mxArrayInData);
}

static const mxArray *c2_c_sf_marshallOut(void *chartInstanceVoid, void
  *c2_inData)
{
  const mxArray *c2_mxArrayOutData = NULL;
  real_T c2_u;
  const mxArray *c2_y = NULL;
  SFc2_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc2_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c2_mxArrayOutData = NULL;
  c2_u = *(real_T *)c2_inData;
  c2_y = NULL;
  sf_mex_assign(&c2_y, sf_mex_create("y", &c2_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c2_mxArrayOutData, c2_y, FALSE);
  return c2_mxArrayOutData;
}

static real_T c2_d_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_StartStopSimulation, const char_T
  *c2_identifier)
{
  real_T c2_y;
  emlrtMsgIdentifier c2_thisId;
  c2_thisId.fIdentifier = c2_identifier;
  c2_thisId.fParent = NULL;
  c2_y = c2_e_emlrt_marshallIn(chartInstance, sf_mex_dup(c2_StartStopSimulation),
    &c2_thisId);
  sf_mex_destroy(&c2_StartStopSimulation);
  return c2_y;
}

static real_T c2_e_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_u, const emlrtMsgIdentifier *c2_parentId)
{
  real_T c2_y;
  real_T c2_d0;
  sf_mex_import(c2_parentId, sf_mex_dup(c2_u), &c2_d0, 1, 0, 0U, 0, 0U, 0);
  c2_y = c2_d0;
  sf_mex_destroy(&c2_u);
  return c2_y;
}

static void c2_c_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c2_mxArrayInData, const char_T *c2_varName, void *c2_outData)
{
  const mxArray *c2_StartStopSimulation;
  const char_T *c2_identifier;
  emlrtMsgIdentifier c2_thisId;
  real_T c2_y;
  SFc2_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc2_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c2_StartStopSimulation = sf_mex_dup(c2_mxArrayInData);
  c2_identifier = c2_varName;
  c2_thisId.fIdentifier = c2_identifier;
  c2_thisId.fParent = NULL;
  c2_y = c2_e_emlrt_marshallIn(chartInstance, sf_mex_dup(c2_StartStopSimulation),
    &c2_thisId);
  sf_mex_destroy(&c2_StartStopSimulation);
  *(real_T *)c2_outData = c2_y;
  sf_mex_destroy(&c2_mxArrayInData);
}

static const mxArray *c2_f_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_b_setSimStateSideEffectsInfo, const char_T
  *c2_identifier)
{
  const mxArray *c2_y = NULL;
  emlrtMsgIdentifier c2_thisId;
  c2_y = NULL;
  c2_thisId.fIdentifier = c2_identifier;
  c2_thisId.fParent = NULL;
  sf_mex_assign(&c2_y, c2_g_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c2_b_setSimStateSideEffectsInfo), &c2_thisId), FALSE);
  sf_mex_destroy(&c2_b_setSimStateSideEffectsInfo);
  return c2_y;
}

static const mxArray *c2_g_emlrt_marshallIn(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c2_u, const emlrtMsgIdentifier *c2_parentId)
{
  const mxArray *c2_y = NULL;
  c2_y = NULL;
  sf_mex_assign(&c2_y, sf_mex_duplicatearraysafe(&c2_u), FALSE);
  sf_mex_destroy(&c2_u);
  return c2_y;
}

static void init_dsm_address_info(SFc2_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
}

/* SFunction Glue Code */
void sf_c2_GPCA_Extension_get_check_sum(mxArray *plhs[])
{
  ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(11751718U);
  ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(610485410U);
  ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(1330375072U);
  ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(648138086U);
}

mxArray *sf_c2_GPCA_Extension_get_autoinheritance_info(void)
{
  const char *autoinheritanceFields[] = { "checksum", "inputs", "parameters",
    "outputs", "locals" };

  mxArray *mxAutoinheritanceInfo = mxCreateStructMatrix(1,1,5,
    autoinheritanceFields);

  {
    mxArray *mxChecksum = mxCreateString("VHtenGzyvYm5eH00D5AwpG");
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(8));
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
    const char *dataFields[] = { "size", "type", "complexity" };

    mxArray *mxData = mxCreateStructMatrix(1,21,3,dataFields);

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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,5,"type",mxType);
    }

    mxSetField(mxData,5,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,6,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,6,"type",mxType);
    }

    mxSetField(mxData,6,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,7,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,7,"type",mxType);
    }

    mxSetField(mxData,7,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,8,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,8,"type",mxType);
    }

    mxSetField(mxData,8,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,9,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,9,"type",mxType);
    }

    mxSetField(mxData,9,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,10,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,10,"type",mxType);
    }

    mxSetField(mxData,10,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,11,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,11,"type",mxType);
    }

    mxSetField(mxData,11,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,12,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,12,"type",mxType);
    }

    mxSetField(mxData,12,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,13,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,13,"type",mxType);
    }

    mxSetField(mxData,13,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,14,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,14,"type",mxType);
    }

    mxSetField(mxData,14,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,15,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,15,"type",mxType);
    }

    mxSetField(mxData,15,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,16,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,16,"type",mxType);
    }

    mxSetField(mxData,16,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,17,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,17,"type",mxType);
    }

    mxSetField(mxData,17,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,18,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,18,"type",mxType);
    }

    mxSetField(mxData,18,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,19,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,19,"type",mxType);
    }

    mxSetField(mxData,19,"complexity",mxCreateDoubleScalar(0));

    {
      mxArray *mxSize = mxCreateDoubleMatrix(1,2,mxREAL);
      double *pr = mxGetPr(mxSize);
      pr[0] = (double)(1);
      pr[1] = (double)(1);
      mxSetField(mxData,20,"size",mxSize);
    }

    {
      const char *typeFields[] = { "base", "fixpt" };

      mxArray *mxType = mxCreateStructMatrix(1,1,2,typeFields);
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(10));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,20,"type",mxType);
    }

    mxSetField(mxData,20,"complexity",mxCreateDoubleScalar(0));
    mxSetField(mxAutoinheritanceInfo,0,"outputs",mxData);
  }

  {
    mxSetField(mxAutoinheritanceInfo,0,"locals",mxCreateDoubleMatrix(0,0,mxREAL));
  }

  return(mxAutoinheritanceInfo);
}

static const mxArray *sf_get_sim_state_info_c2_GPCA_Extension(void)
{
  const char *infoFields[] = { "chartChecksum", "varInfo" };

  mxArray *mxInfo = mxCreateStructMatrix(1, 1, 2, infoFields);
  const char *infoEncStr[] = {
    "100 S1x10'type','srcId','name','auxInfo'{{M[1],M[274],T\"Cancel\",},{M[1],M[265],T\"ChangeDoseRate\",},{M[1],M[266],T\"ChangeVTBI\",},{M[1],M[257],T\"CheckAdminSet\",},{M[1],M[259],T\"CheckDrug\",},{M[1],M[272],T\"ClearAlarm\",},{M[1],M[260],T\"ConfigureInfusionProgram\",},{M[1],M[261],T\"ConfirmConcentration\",},{M[1],M[262],T\"ConfirmDoseRate\",},{M[1],M[268],T\"ConfirmPauseInfusion\",}}",
    "100 S1x10'type','srcId','name','auxInfo'{{M[1],M[273],T\"ConfirmPowerDown\",},{M[1],M[270],T\"ConfirmStopInfusion\",},{M[1],M[263],T\"ConfirmVTBI\",},{M[1],M[267],T\"PauseInfusion\",},{M[1],M[255],T\"PowerButton\",},{M[1],M[258],T\"Prime\",},{M[1],M[271],T\"RequestBolus\",},{M[1],M[264],T\"StartInfusion\",},{M[1],M[256],T\"StartNewInfusion\",},{M[1],M[254],T\"StartStopSimulation\",}}",
    "100 S1x3'type','srcId','name','auxInfo'{{M[1],M[269],T\"StopInfusion\",},{M[8],M[0],T\"is_active_c2_GPCA_Extension\",},{M[9],M[0],T\"is_c2_GPCA_Extension\",}}"
  };

  mxArray *mxVarInfo = sf_mex_decode_encoded_mx_struct_array(infoEncStr, 23, 10);
  mxArray *mxChecksum = mxCreateDoubleMatrix(1, 4, mxREAL);
  sf_c2_GPCA_Extension_get_check_sum(&mxChecksum);
  mxSetField(mxInfo, 0, infoFields[0], mxChecksum);
  mxSetField(mxInfo, 0, infoFields[1], mxVarInfo);
  return mxInfo;
}

static void chart_debug_initialization(SimStruct *S, unsigned int
  fullDebuggerInitialization)
{
  if (!sim_mode_is_rtw_gen(S)) {
    SFc2_GPCA_ExtensionInstanceStruct *chartInstance;
    chartInstance = (SFc2_GPCA_ExtensionInstanceStruct *) ((ChartInfoStruct *)
      (ssGetUserData(S)))->chartInstance;
    if (ssIsFirstInitCond(S) && fullDebuggerInitialization==1) {
      /* do this only if simulation is starting */
      {
        unsigned int chartAlreadyPresent;
        chartAlreadyPresent = sf_debug_initialize_chart
          (_GPCA_ExtensionMachineNumber_,
           2,
           1,
           109,
           22,
           0,
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
            0,
            0,
            0);
          _SFD_SET_DATA_PROPS(0,1,1,0,"CommandID");
          _SFD_SET_DATA_PROPS(1,2,0,1,"StartStopSimulation");
          _SFD_SET_DATA_PROPS(2,2,0,1,"PowerButton");
          _SFD_SET_DATA_PROPS(3,2,0,1,"StartNewInfusion");
          _SFD_SET_DATA_PROPS(4,2,0,1,"CheckAdminSet");
          _SFD_SET_DATA_PROPS(5,2,0,1,"Prime");
          _SFD_SET_DATA_PROPS(6,2,0,1,"CheckDrug");
          _SFD_SET_DATA_PROPS(7,2,0,1,"ConfigureInfusionProgram");
          _SFD_SET_DATA_PROPS(8,2,0,1,"ConfirmConcentration");
          _SFD_SET_DATA_PROPS(9,2,0,1,"ConfirmDoseRate");
          _SFD_SET_DATA_PROPS(10,2,0,1,"ConfirmVTBI");
          _SFD_SET_DATA_PROPS(11,2,0,1,"StartInfusion");
          _SFD_SET_DATA_PROPS(12,2,0,1,"ChangeDoseRate");
          _SFD_SET_DATA_PROPS(13,2,0,1,"ChangeVTBI");
          _SFD_SET_DATA_PROPS(14,2,0,1,"PauseInfusion");
          _SFD_SET_DATA_PROPS(15,2,0,1,"ConfirmPauseInfusion");
          _SFD_SET_DATA_PROPS(16,2,0,1,"StopInfusion");
          _SFD_SET_DATA_PROPS(17,2,0,1,"ConfirmStopInfusion");
          _SFD_SET_DATA_PROPS(18,2,0,1,"RequestBolus");
          _SFD_SET_DATA_PROPS(19,2,0,1,"ClearAlarm");
          _SFD_SET_DATA_PROPS(20,2,0,1,"ConfirmPowerDown");
          _SFD_SET_DATA_PROPS(21,2,0,1,"Cancel");
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

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(0,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(1,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(2,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(3,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(4,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(5,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(6,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(7,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(8,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(9,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(10,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(11,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(12,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(13,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(14,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(15,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(16,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(17,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(18,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(19,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(95,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(101,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(22,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(21,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(20,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(23,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(24,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(26,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(27,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(25,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(28,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(29,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(31,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(32,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(30,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(33,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(34,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(35,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(36,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(37,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(38,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(39,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(40,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(41,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(42,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(43,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(44,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(45,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(46,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(47,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(48,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(49,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(50,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(51,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(52,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(67,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(53,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(54,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(55,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(56,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(57,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(58,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(59,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(60,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(61,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(62,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(63,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(64,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(65,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(66,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(68,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(69,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(108,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(70,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(71,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(72,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(73,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(74,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(75,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(76,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(77,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(78,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(79,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(80,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(81,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(82,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(83,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(84,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(85,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(86,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(87,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(88,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(89,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(90,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(91,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(92,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(93,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(94,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(97,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(102,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(98,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(99,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(100,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(96,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(103,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(104,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(105,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(106,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(107,0,NULL,NULL,0,NULL);
        _SFD_TRANS_COV_WTS(0,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(0,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(1,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(1,
                              0,NULL,NULL,
                              0,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(3,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(3,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(4,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(4,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(5,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(5,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(6,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(6,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(8,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(8,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(9,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(9,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(10,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(10,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(11,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(11,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(12,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(12,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(13,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(13,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(14,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(14,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(15,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(15,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(16,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(16,
                              0,NULL,NULL,
                              0,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(18,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(18,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(19,0,0,24,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(19,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              24,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(95,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(95,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(101,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(101,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(22,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(22,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(21,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(21,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(20,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(20,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(23,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(23,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(24,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(24,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(26,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(26,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(27,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(27,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(25,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(25,
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

        _SFD_TRANS_COV_WTS(29,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(29,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(31,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(31,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(32,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(32,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(30,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(30,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(33,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(33,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(34,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(34,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(35,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(35,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(36,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(36,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(37,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(37,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(38,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(38,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(39,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(39,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(40,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(40,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(41,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(41,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(42,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(42,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(43,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(43,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(44,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(44,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(45,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(45,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(46,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(46,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(48,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(48,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(49,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(49,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(50,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(50,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(51,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(51,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(52,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(52,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(67,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(67,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(53,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(53,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(54,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(54,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(55,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(55,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(56,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(56,
                              0,NULL,NULL,
                              0,NULL,NULL,
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
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(58,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(59,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(59,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(60,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(60,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(61,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(61,
                              0,NULL,NULL,
                              0,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(63,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(63,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(64,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(64,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(65,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(65,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(66,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(66,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(68,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(68,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(69,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(69,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(108,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(108,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(70,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(70,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(71,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(71,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(72,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(72,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(73,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(73,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(74,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(74,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(75,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(75,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(76,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(76,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(77,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(77,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(78,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(78,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(79,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(79,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(80,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(80,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(81,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(81,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(82,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(82,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(83,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(83,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(84,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(84,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(85,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(85,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(86,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(86,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(87,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(87,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(88,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(88,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(89,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(89,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(90,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(90,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(91,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(91,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(92,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(92,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(93,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(93,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(94,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(94,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(97,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(97,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(96,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(96,
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

        _SFD_TRANS_COV_WTS(104,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(104,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(105,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(105,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(106,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(106,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(107,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(107,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_SET_DATA_COMPILED_PROPS(0,SF_INT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(1,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(2,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(3,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(4,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(5,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(6,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(7,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(8,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(9,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(10,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(11,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(12,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(13,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(14,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(15,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(16,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(17,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(18,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(19,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(20,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(21,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c2_c_sf_marshallOut,(MexInFcnForType)c2_c_sf_marshallIn);

        {
          int32_T *c2_CommandID;
          real_T *c2_StartStopSimulation;
          real_T *c2_PowerButton;
          real_T *c2_StartNewInfusion;
          real_T *c2_CheckAdminSet;
          real_T *c2_Prime;
          real_T *c2_CheckDrug;
          real_T *c2_ConfigureInfusionProgram;
          real_T *c2_ConfirmConcentration;
          real_T *c2_ConfirmDoseRate;
          real_T *c2_ConfirmVTBI;
          real_T *c2_StartInfusion;
          real_T *c2_ChangeDoseRate;
          real_T *c2_ChangeVTBI;
          real_T *c2_PauseInfusion;
          real_T *c2_ConfirmPauseInfusion;
          real_T *c2_StopInfusion;
          real_T *c2_ConfirmStopInfusion;
          real_T *c2_RequestBolus;
          real_T *c2_ClearAlarm;
          real_T *c2_ConfirmPowerDown;
          real_T *c2_Cancel;
          c2_Cancel = (real_T *)ssGetOutputPortSignal(chartInstance->S, 21);
          c2_ConfirmPowerDown = (real_T *)ssGetOutputPortSignal(chartInstance->S,
            20);
          c2_ClearAlarm = (real_T *)ssGetOutputPortSignal(chartInstance->S, 19);
          c2_RequestBolus = (real_T *)ssGetOutputPortSignal(chartInstance->S, 18);
          c2_ConfirmStopInfusion = (real_T *)ssGetOutputPortSignal
            (chartInstance->S, 17);
          c2_StopInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S, 16);
          c2_ConfirmPauseInfusion = (real_T *)ssGetOutputPortSignal
            (chartInstance->S, 15);
          c2_PauseInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S,
            14);
          c2_ChangeVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 13);
          c2_ChangeDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S,
            12);
          c2_StartInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S,
            11);
          c2_ConfirmVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 10);
          c2_ConfirmDoseRate = (real_T *)ssGetOutputPortSignal(chartInstance->S,
            9);
          c2_ConfirmConcentration = (real_T *)ssGetOutputPortSignal
            (chartInstance->S, 8);
          c2_ConfigureInfusionProgram = (real_T *)ssGetOutputPortSignal
            (chartInstance->S, 7);
          c2_CheckDrug = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
          c2_Prime = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
          c2_CheckAdminSet = (real_T *)ssGetOutputPortSignal(chartInstance->S, 4);
          c2_StartNewInfusion = (real_T *)ssGetOutputPortSignal(chartInstance->S,
            3);
          c2_PowerButton = (real_T *)ssGetOutputPortSignal(chartInstance->S, 2);
          c2_StartStopSimulation = (real_T *)ssGetOutputPortSignal
            (chartInstance->S, 1);
          c2_CommandID = (int32_T *)ssGetInputPortSignal(chartInstance->S, 0);
          _SFD_SET_DATA_VALUE_PTR(0U, c2_CommandID);
          _SFD_SET_DATA_VALUE_PTR(1U, c2_StartStopSimulation);
          _SFD_SET_DATA_VALUE_PTR(2U, c2_PowerButton);
          _SFD_SET_DATA_VALUE_PTR(3U, c2_StartNewInfusion);
          _SFD_SET_DATA_VALUE_PTR(4U, c2_CheckAdminSet);
          _SFD_SET_DATA_VALUE_PTR(5U, c2_Prime);
          _SFD_SET_DATA_VALUE_PTR(6U, c2_CheckDrug);
          _SFD_SET_DATA_VALUE_PTR(7U, c2_ConfigureInfusionProgram);
          _SFD_SET_DATA_VALUE_PTR(8U, c2_ConfirmConcentration);
          _SFD_SET_DATA_VALUE_PTR(9U, c2_ConfirmDoseRate);
          _SFD_SET_DATA_VALUE_PTR(10U, c2_ConfirmVTBI);
          _SFD_SET_DATA_VALUE_PTR(11U, c2_StartInfusion);
          _SFD_SET_DATA_VALUE_PTR(12U, c2_ChangeDoseRate);
          _SFD_SET_DATA_VALUE_PTR(13U, c2_ChangeVTBI);
          _SFD_SET_DATA_VALUE_PTR(14U, c2_PauseInfusion);
          _SFD_SET_DATA_VALUE_PTR(15U, c2_ConfirmPauseInfusion);
          _SFD_SET_DATA_VALUE_PTR(16U, c2_StopInfusion);
          _SFD_SET_DATA_VALUE_PTR(17U, c2_ConfirmStopInfusion);
          _SFD_SET_DATA_VALUE_PTR(18U, c2_RequestBolus);
          _SFD_SET_DATA_VALUE_PTR(19U, c2_ClearAlarm);
          _SFD_SET_DATA_VALUE_PTR(20U, c2_ConfirmPowerDown);
          _SFD_SET_DATA_VALUE_PTR(21U, c2_Cancel);
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
  return "t6UMB7siR0dsoLZ5oH4eOD";
}

static void sf_opaque_initialize_c2_GPCA_Extension(void *chartInstanceVar)
{
  chart_debug_initialization(((SFc2_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar)->S,0);
  initialize_params_c2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
  initialize_c2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

static void sf_opaque_enable_c2_GPCA_Extension(void *chartInstanceVar)
{
  enable_c2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*) chartInstanceVar);
}

static void sf_opaque_disable_c2_GPCA_Extension(void *chartInstanceVar)
{
  disable_c2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

static void sf_opaque_gateway_c2_GPCA_Extension(void *chartInstanceVar)
{
  sf_c2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*) chartInstanceVar);
}

extern const mxArray* sf_internal_get_sim_state_c2_GPCA_Extension(SimStruct* S)
{
  ChartInfoStruct *chartInfo = (ChartInfoStruct*) ssGetUserData(S);
  mxArray *plhs[1] = { NULL };

  mxArray *prhs[4];
  int mxError = 0;
  prhs[0] = mxCreateString("chart_simctx_raw2high");
  prhs[1] = mxCreateDoubleScalar(ssGetSFuncBlockHandle(S));
  prhs[2] = (mxArray*) get_sim_state_c2_GPCA_Extension
    ((SFc2_GPCA_ExtensionInstanceStruct*)chartInfo->chartInstance);/* raw sim ctx */
  prhs[3] = (mxArray*) sf_get_sim_state_info_c2_GPCA_Extension();/* state var info */
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

extern void sf_internal_set_sim_state_c2_GPCA_Extension(SimStruct* S, const
  mxArray *st)
{
  ChartInfoStruct *chartInfo = (ChartInfoStruct*) ssGetUserData(S);
  mxArray *plhs[1] = { NULL };

  mxArray *prhs[4];
  int mxError = 0;
  prhs[0] = mxCreateString("chart_simctx_high2raw");
  prhs[1] = mxCreateDoubleScalar(ssGetSFuncBlockHandle(S));
  prhs[2] = mxDuplicateArray(st);      /* high level simctx */
  prhs[3] = (mxArray*) sf_get_sim_state_info_c2_GPCA_Extension();/* state var info */
  mxError = sf_mex_call_matlab(1, plhs, 4, prhs, "sfprivate");
  mxDestroyArray(prhs[0]);
  mxDestroyArray(prhs[1]);
  mxDestroyArray(prhs[2]);
  mxDestroyArray(prhs[3]);
  if (mxError || plhs[0] == NULL) {
    sf_mex_error_message("Stateflow Internal Error: \nError calling 'chart_simctx_high2raw'.\n");
  }

  set_sim_state_c2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*)
    chartInfo->chartInstance, mxDuplicateArray(plhs[0]));
  mxDestroyArray(plhs[0]);
}

static const mxArray* sf_opaque_get_sim_state_c2_GPCA_Extension(SimStruct* S)
{
  return sf_internal_get_sim_state_c2_GPCA_Extension(S);
}

static void sf_opaque_set_sim_state_c2_GPCA_Extension(SimStruct* S, const
  mxArray *st)
{
  sf_internal_set_sim_state_c2_GPCA_Extension(S, st);
}

static void sf_opaque_terminate_c2_GPCA_Extension(void *chartInstanceVar)
{
  if (chartInstanceVar!=NULL) {
    SimStruct *S = ((SFc2_GPCA_ExtensionInstanceStruct*) chartInstanceVar)->S;
    if (sim_mode_is_rtw_gen(S) || sim_mode_is_external(S)) {
      sf_clear_rtw_identifier(S);
    }

    finalize_c2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*)
      chartInstanceVar);
    free((void *)chartInstanceVar);
    ssSetUserData(S,NULL);
  }

  unload_GPCA_Extension_optimization_info();
}

static void sf_opaque_init_subchart_simstructs(void *chartInstanceVar)
{
  initSimStructsc2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

extern unsigned int sf_machine_global_initializer_called(void);
static void mdlProcessParameters_c2_GPCA_Extension(SimStruct *S)
{
  int i;
  for (i=0;i<ssGetNumRunTimeParams(S);i++) {
    if (ssGetSFcnParamTunable(S,i)) {
      ssUpdateDlgParamAsRunTimeParam(S,i);
    }
  }

  if (sf_machine_global_initializer_called()) {
    initialize_params_c2_GPCA_Extension((SFc2_GPCA_ExtensionInstanceStruct*)
      (((ChartInfoStruct *)ssGetUserData(S))->chartInstance));
  }
}

static void mdlSetWorkWidths_c2_GPCA_Extension(SimStruct *S)
{
  if (sim_mode_is_rtw_gen(S) || sim_mode_is_external(S)) {
    mxArray *infoStruct = load_GPCA_Extension_optimization_info();
    int_T chartIsInlinable =
      (int_T)sf_is_chart_inlinable(S,sf_get_instance_specialization(),infoStruct,
      2);
    ssSetStateflowIsInlinable(S,chartIsInlinable);
    ssSetRTWCG(S,sf_rtw_info_uint_prop(S,sf_get_instance_specialization(),
                infoStruct,2,"RTWCG"));
    ssSetEnableFcnIsTrivial(S,1);
    ssSetDisableFcnIsTrivial(S,1);
    ssSetNotMultipleInlinable(S,sf_rtw_info_uint_prop(S,
      sf_get_instance_specialization(),infoStruct,2,
      "gatewayCannotBeInlinedMultipleTimes"));
    if (chartIsInlinable) {
      ssSetInputPortOptimOpts(S, 0, SS_REUSABLE_AND_LOCAL);
      sf_mark_chart_expressionable_inputs(S,sf_get_instance_specialization(),
        infoStruct,2,1);
      sf_mark_chart_reusable_outputs(S,sf_get_instance_specialization(),
        infoStruct,2,21);
    }

    sf_set_rtw_dwork_info(S,sf_get_instance_specialization(),infoStruct,2);
    ssSetHasSubFunctions(S,!(chartIsInlinable));
  } else {
  }

  ssSetOptions(S,ssGetOptions(S)|SS_OPTION_WORKS_WITH_CODE_REUSE);
  ssSetChecksum0(S,(2472835431U));
  ssSetChecksum1(S,(403531750U));
  ssSetChecksum2(S,(643489385U));
  ssSetChecksum3(S,(3102572930U));
  ssSetmdlDerivatives(S, NULL);
  ssSetExplicitFCSSCtrl(S,1);
}

static void mdlRTW_c2_GPCA_Extension(SimStruct *S)
{
  if (sim_mode_is_rtw_gen(S)) {
    ssWriteRTWStrParam(S, "StateflowChartType", "Stateflow");
  }
}

static void mdlStart_c2_GPCA_Extension(SimStruct *S)
{
  SFc2_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc2_GPCA_ExtensionInstanceStruct *)malloc(sizeof
    (SFc2_GPCA_ExtensionInstanceStruct));
  memset(chartInstance, 0, sizeof(SFc2_GPCA_ExtensionInstanceStruct));
  if (chartInstance==NULL) {
    sf_mex_error_message("Could not allocate memory for chart instance.");
  }

  chartInstance->chartInfo.chartInstance = chartInstance;
  chartInstance->chartInfo.isEMLChart = 0;
  chartInstance->chartInfo.chartInitialized = 0;
  chartInstance->chartInfo.sFunctionGateway =
    sf_opaque_gateway_c2_GPCA_Extension;
  chartInstance->chartInfo.initializeChart =
    sf_opaque_initialize_c2_GPCA_Extension;
  chartInstance->chartInfo.terminateChart =
    sf_opaque_terminate_c2_GPCA_Extension;
  chartInstance->chartInfo.enableChart = sf_opaque_enable_c2_GPCA_Extension;
  chartInstance->chartInfo.disableChart = sf_opaque_disable_c2_GPCA_Extension;
  chartInstance->chartInfo.getSimState =
    sf_opaque_get_sim_state_c2_GPCA_Extension;
  chartInstance->chartInfo.setSimState =
    sf_opaque_set_sim_state_c2_GPCA_Extension;
  chartInstance->chartInfo.getSimStateInfo =
    sf_get_sim_state_info_c2_GPCA_Extension;
  chartInstance->chartInfo.zeroCrossings = NULL;
  chartInstance->chartInfo.outputs = NULL;
  chartInstance->chartInfo.derivatives = NULL;
  chartInstance->chartInfo.mdlRTW = mdlRTW_c2_GPCA_Extension;
  chartInstance->chartInfo.mdlStart = mdlStart_c2_GPCA_Extension;
  chartInstance->chartInfo.mdlSetWorkWidths = mdlSetWorkWidths_c2_GPCA_Extension;
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

void c2_GPCA_Extension_method_dispatcher(SimStruct *S, int_T method, void *data)
{
  switch (method) {
   case SS_CALL_MDL_START:
    mdlStart_c2_GPCA_Extension(S);
    break;

   case SS_CALL_MDL_SET_WORK_WIDTHS:
    mdlSetWorkWidths_c2_GPCA_Extension(S);
    break;

   case SS_CALL_MDL_PROCESS_PARAMETERS:
    mdlProcessParameters_c2_GPCA_Extension(S);
    break;

   default:
    /* Unhandled method */
    sf_mex_error_message("Stateflow Internal Error:\n"
                         "Error calling c2_GPCA_Extension_method_dispatcher.\n"
                         "Can't handle method %d.\n", method);
    break;
  }
}
