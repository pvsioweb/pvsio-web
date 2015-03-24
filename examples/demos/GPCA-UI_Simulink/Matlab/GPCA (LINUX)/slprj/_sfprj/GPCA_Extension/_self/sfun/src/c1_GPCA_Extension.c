/* Include files */

#include "blascompat32.h"
#include "GPCA_Extension_sfun.h"
#include "c1_GPCA_Extension.h"
#include "mwmathutil.h"
#define CHARTINSTANCE_CHARTNUMBER      (chartInstance->chartNumber)
#define CHARTINSTANCE_INSTANCENUMBER   (chartInstance->instanceNumber)
#include "GPCA_Extension_sfun_debug_macros.h"

/* Type Definitions */

/* Named Constants */
#define c1_event_E_Clock               (0)
#define c1_event_E_Alarm               (4)
#define c1_event_E_Warning             (5)
#define c1_event_E_Ready               (6)
#define c1_event_E_NotReady            (7)
#define c1_event_E_StartSimulation     (8)
#define c1_event_E_PowerButton         (9)
#define c1_event_E_NewInfusion         (10)
#define c1_event_E_CheckAdminSet       (11)
#define c1_event_E_Prime               (12)
#define c1_event_E_CheckDrug           (13)
#define c1_event_E_ConfigureInfusionProgram (14)
#define c1_event_E_ConfirmConcentration (15)
#define c1_event_E_ConfirmDoseRate     (16)
#define c1_event_E_ConfirmVTBI         (17)
#define c1_event_E_StartInfusion       (18)
#define c1_event_E_ChangeDoseRate      (19)
#define c1_event_E_ChangeVTBI          (20)
#define c1_event_E_PauseInfusion       (21)
#define c1_event_E_ConfirmPauseInfusion (22)
#define c1_event_E_StopInfusion        (23)
#define c1_event_E_ConfirmStopInfusion (24)
#define c1_event_E_RequestBolus        (25)
#define c1_event_E_ClearAlarm          (26)
#define c1_event_E_ConfirmPowerDown    (27)
#define c1_event_E_Cancel              (28)
#define CALL_EVENT                     (-1)
#define c1_IN_NO_ACTIVE_CHILD          ((uint8_T)0U)
#define c1_IN_ALM_VTBIOutBound         ((uint8_T)2U)
#define c1_IN_DisplayDoseRate          ((uint8_T)7U)
#define c1_IN_ConfirmPowerDown         ((uint8_T)4U)
#define c1_IN_PowerOff                 ((uint8_T)10U)
#define c1_IN_POST                     ((uint8_T)8U)
#define c1_IN_ALM_POSTFailed           ((uint8_T)1U)
#define c1_IN_CheckAdminSet            ((uint8_T)2U)
#define c1_IN_CheckPrime               ((uint8_T)4U)
#define c1_IN_ALM_WrongAdminCheck      ((uint8_T)1U)
#define c1_IN_PrimeFailed              ((uint8_T)10U)
#define c1_IN_DisplayDrugInfo          ((uint8_T)7U)
#define c1_IN_CheckDrug_CheckType      ((uint8_T)3U)
#define c1_IN_UnknownDrug              ((uint8_T)11U)
#define c1_IN_Check_DrugUnits          ((uint8_T)6U)
#define c1_IN_IncorrectDrugUnits       ((uint8_T)9U)
#define c1_IN_Check_Concen             ((uint8_T)5U)
#define c1_IN_WrongConcentration       ((uint8_T)13U)
#define c1_IN_WRN_DangerCon            ((uint8_T)12U)
#define c1_IN_DisplayPatientProfile    ((uint8_T)8U)
#define c1_IN_DisplayVTBI              ((uint8_T)9U)
#define c1_IN_ChangeVTBI               ((uint8_T)4U)
#define c1_IN_CheckVTBI                ((uint8_T)6U)
#define c1_IN_ChangeDoseRate           ((uint8_T)3U)
#define c1_IN_CheckDoseRate            ((uint8_T)5U)
#define c1_IN_ALM_DoseRateOutBound     ((uint8_T)1U)
#define c1_IN_DisplaySettings          ((uint8_T)8U)
#define c1_IN_Infusing                 ((uint8_T)7U)
#define c1_IN_InfusionInSession        ((uint8_T)5U)
#define c1_IN_ChangeRate               ((uint8_T)3U)
#define c1_IN_CheckNewRate             ((uint8_T)4U)
#define c1_IN_ALM_NewRateOutBound      ((uint8_T)1U)
#define c1_IN_ConfirmStop              ((uint8_T)6U)
#define c1_IN_ConfirmPause             ((uint8_T)5U)
#define c1_IN_InfusionPaused           ((uint8_T)4U)
#define c1_IN_ReadyToStart             ((uint8_T)10U)
#define c1_IN_PausedStopConfirm        ((uint8_T)8U)
#define c1_IN_InfusionStopped          ((uint8_T)5U)
#define c1_IN_EmptyReservoir           ((uint8_T)3U)
#define c1_IN_CheckDrugWhileInfusing   ((uint8_T)2U)
#define c1_IN_ALMWrongDrug             ((uint8_T)1U)
#define c1_IN_Init                     ((uint8_T)6U)
#define c1_IN_LevelTwoAlarming         ((uint8_T)7U)
#define c1_IN_InfusionSubMachine       ((uint8_T)6U)
#define c1_IN_POSTDONE                 ((uint8_T)9U)
#define c1_IN_WRN_VTBIOutBound         ((uint8_T)12U)
#define c1_IN_LEVELONEALRM             ((uint8_T)7U)
#define c1_IN_BolusRequest             ((uint8_T)2U)
#define c1_IN_WRN_DOSERATEOUTSOFTLIMITS ((uint8_T)11U)
#define c1_IN_PausedTooLong            ((uint8_T)9U)
#define c1_IN_CheckDrugRoutine         ((uint8_T)2U)
#define c1_IN_ConfigureInfusionProgram ((uint8_T)3U)
#define c1_IN_InfusionStateMachine     ((uint8_T)1U)
#define c1_const_MSG_WELCOME           (1U)
#define c1_const_MSG_POWEROFF          (2U)
#define c1_const_MSG_POST              (3U)
#define c1_const_MSG_POSTFAIL          (4U)
#define c1_const_MSG_ADMINCHECK        (5U)
#define c1_const_MSG_ADMINFAIL         (6U)
#define c1_const_MSG_PRIME             (7U)
#define c1_const_MSG_PRIMEFAIL         (8U)
#define c1_const_MSG_CHECKTYPE         (9U)
#define c1_const_MSG_WRONGDRUG         (10U)
#define c1_const_MSG_CHECKDU           (11U)
#define c1_const_MSG_WRONGDU           (12U)
#define c1_const_MSG_CHECKCON          (13U)
#define c1_const_MSG_WRONGCON          (14U)
#define c1_const_MSG_DANGECON          (15U)
#define c1_const_MSG_PATIENTINFO       (16U)
#define c1_const_MSG_CHANGEVTBI        (18U)
#define c1_const_MSG_VTBI              (17U)
#define c1_const_MSG_CHECKVTBI         (19U)
#define c1_const_MSG_ALMVTBI           (20U)
#define c1_const_MSG_DISPLAYDR         (21U)
#define c1_const_MSG_CHECKDR           (22U)
#define c1_const_MSG_CHANGEDR          (23U)
#define c1_const_MSG_DISPLAYSET        (24U)
#define c1_const_MSG_ALRMDR            (25U)
#define c1_const_MSG_INFUSING          (26U)
#define c1_const_MSG_DANGERENVTEMP     (24U)
#define c1_const_MSG_DANGERHUMD        (25U)
#define c1_const_MSG_DANGERAP          (26U)
#define c1_const_MSG_POSTDONE          (27U)
#define c1_const_MSG_DRUGINFO          (28U)
#define c1_const_MSG_BOLUSGRANT        (28U)
#define c1_const_MSG_BOLUSDENIED       (29U)
#define c1_const_MSG_STOPBOLUS         (30U)
#define c1_const_MSG_EMPTYRESERVOIR    (8U)
#define c1_const_MSG_DOOROPEN          (7U)
#define c1_const_MSG_AIRINLINE         (15U)
#define c1_const_MSG_OCCULUSION        (9U)
#define c1_const_MSG_PAUSETOOLONG      (14U)
#define c1_const_MSG_FLOWRATEVARY      (16U)
#define c1_const_MSG_OVERINFUSION      (10U)
#define c1_const_MSG_UNDERINFUSION     (11U)
#define c1_const_MSG_LESSTHANKVO       (12U)
#define c1_const_MSG_RATEEXCEEDCAPACITY (13U)
#define c1_const_MSG_REALTIMECLOCK     (2U)
#define c1_const_MSG_WATCHDOGALERT     (6U)
#define c1_const_MSG_OUTOFPOWER        (1U)
#define c1_const_MSG_MEMORYCORRUPT     (4U)
#define c1_const_MSG_CPUFAILURE        (3U)
#define c1_const_MSG_INFUSIONSTOP      (29U)
#define c1_const_MSG_SPCHOOSE          (30U)
#define c1_const_MSG_INFUSIONPAUSED    (31U)
#define c1_const_MSG_CONFIRMPAUSE      (32U)
#define c1_const_MSG_CONFIRMSTOP       (33U)
#define c1_const_MSG_STOPPAUSE         (34U)
#define c1_const_MSG_LOGERR            (19U)
#define c1_const_MSG_LOWBATT           (20U)
#define c1_const_MSG_LOWRESR           (17U)
#define c1_const_MSG_WRNDR             (35U)
#define c1_const_MSG_WRNVTBI           (36U)
#define c1_const_MSG_NOTREADY          (27U)
#define c1_const_MSG_BLANK             (31U)
#define c1_const_MSG_WRNBATTERYCHARGE  (21U)
#define c1_const_MSG_VOLTOUTRANGE      (22U)
#define c1_const_MSG_PUMPTOOHOT        (5U)
#define c1_const_MSG_PAUSELONG         (18U)
#define c1_const_MSG_PUMPOVERHEAT      (23U)
#define c1_const_MSG_DISPINFU          (32U)

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
static void initialize_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void initialize_params_c1_GPCA_Extension
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void enable_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void disable_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_update_debugger_state_c1_GPCA_Extension
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static const mxArray *get_sim_state_c1_GPCA_Extension
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void set_sim_state_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_st);
static void c1_set_sim_state_side_effects_c1_GPCA_Extension
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void finalize_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void sf_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_chartstep_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void initSimStructsc1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_DisplayDoseRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_ConfirmPowerDown(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_PowerOff(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_PrimeFailed(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_DisplayDrugInfo(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_UnknownDrug(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_Check_DrugUnits(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_IncorrectDrugUnits(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_Check_Concen(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_WrongConcentration(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_WRN_DangerCon(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_DisplayPatientProfile(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_DisplayVTBI(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_ChangeVTBI(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_enter_atomic_CheckVTBI(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_CheckVTBI(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_CheckDoseRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_DisplaySettings(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_Infusing(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_enter_internal_InfusionInSession
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_InfusionInSession(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_exit_internal_InfusionInSession(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_ChangeRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_ALM_NewRateOutBound(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_ConfirmStop(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_ConfirmPause(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_InfusionPaused(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_ReadyToStart(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_PausedStopConfirm(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_InfusionStopped(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_enter_atomic_CheckDrugWhileInfusing
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_enter_atomic_LevelTwoAlarming(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_LevelTwoAlarming(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_InfusionSubMachine(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_exit_internal_InfusionSubMachine
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_WRN_VTBIOutBound(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_enter_atomic_LEVELONEALRM(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_WRN_DOSERATEOUTSOFTLIMITS(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_PausedTooLong(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_enter_internal_CheckDrugRoutine(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_CheckDrugRoutine(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_exit_internal_CheckDrugRoutine(SFc1_GPCA_ExtensionInstanceStruct *
  chartInstance);
static void c1_enter_internal_ConfigureInfusionProgram
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_ConfigureInfusionProgram(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_exit_internal_ConfigureInfusionProgram
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_InfusionStateMachine(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void init_script_number_translation(uint32_T c1_machineNumber, uint32_T
  c1_chartNumber);
static void c1_broadcast_E_Clock(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_Alarm(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_Warning(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_Ready(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_NotReady(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_StartSimulation(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_PowerButton(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_NewInfusion(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_CheckAdminSet(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_Prime(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_CheckDrug(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_ConfigureInfusionProgram
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_broadcast_E_ConfirmConcentration
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_broadcast_E_ConfirmDoseRate(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_ConfirmVTBI(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_StartInfusion(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_ChangeDoseRate(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_ChangeVTBI(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_PauseInfusion(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static void c1_broadcast_E_ConfirmPauseInfusion
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static void c1_broadcast_E_StopInfusion(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static uint32_T c1_enterinto(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  uint32_T c1_stateId);
static real_T c1_resumeInfusion(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static uint32_T c1_warning(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static uint32_T c1_checkDoseRate(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, real_T c1_iRate);
static real_T c1_setPatientInfo(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static real_T c1_setDrugLibInfo(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static uint32_T c1_alrmLevel(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static real_T c1_calcFlowRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_iRate);
static real_T c1_checkDrugConcentration(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static real_T c1_infusionDone(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_expectedVolume);
static uint32_T c1_clearLevel2Alarm(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static uint32_T c1_checkDrugType(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static real_T c1_checkDrugUnits(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static real_T c1_stopInfusion(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static real_T c1_setVTBI(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_iVTBI);
static real_T c1_setDoseRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_iRate);
static real_T c1_pauseInfusion(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static real_T c1_resetInfusionInstructions(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);
static real_T c1_copyInfuStatus(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static real_T c1_initInfuStatus(SFc1_GPCA_ExtensionInstanceStruct *chartInstance);
static const mxArray *c1_sf_marshallOut(void *chartInstanceVoid, void *c1_inData);
static int8_T c1_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId);
static void c1_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData);
static const mxArray *c1_b_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static uint32_T c1_b_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_b_E_RestartEventCounter, const char_T
  *c1_identifier);
static uint32_T c1_c_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId);
static void c1_b_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData);
static const mxArray *c1_c_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static int32_T c1_d_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId);
static void c1_c_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData);
static const mxArray *c1_d_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static uint8_T c1_e_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_b_tp_ALM_VTBIOutBound, const char_T
  *c1_identifier);
static uint8_T c1_f_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId);
static void c1_d_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData);
static const mxArray *c1_e_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static const mxArray *c1_f_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static boolean_T c1_g_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_O_InfusionInProgress, const char_T
  *c1_identifier);
static boolean_T c1_h_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId);
static void c1_e_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData);
static real_T c1_i_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_O_ProgrammedVTBI, const char_T
  *c1_identifier);
static real_T c1_j_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId);
static void c1_f_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData);
static const mxArray *c1_drugLibInfo_bus_io(void *chartInstanceVoid, void
  *c1_pData);
static const mxArray *c1_emlrt_marshallOut(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, c1_DrugLibrary *c1_u);
static const mxArray *c1_g_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static const mxArray *c1_patientInfo_bus_io(void *chartInstanceVoid, void
  *c1_pData);
static const mxArray *c1_h_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static const mxArray *c1_drugInfo_bus_io(void *chartInstanceVoid, void *c1_pData);
static const mxArray *c1_i_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static const mxArray *c1_infuParameters_bus_io(void *chartInstanceVoid, void
  *c1_pData);
static const mxArray *c1_j_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static const mxArray *c1_infuStatus_bus_io(void *chartInstanceVoid, void
  *c1_pData);
static const mxArray *c1_k_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static const mxArray *c1_pumpConfigData_bus_io(void *chartInstanceVoid, void
  *c1_pData);
static const mxArray *c1_l_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData);
static void c1_k_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_O_DrugLibInfo, const char_T *c1_identifier,
  c1_DrugLibrary *c1_y);
static void c1_l_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId,
  c1_DrugLibrary *c1_y);
static c1_InfusionStatus c1_m_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_O_InfuStatus, const char_T *c1_identifier);
static c1_InfusionStatus c1_n_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId);
static c1_PatientInformation c1_o_emlrt_marshallIn
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance, const mxArray
   *c1_O_PatientInfo, const char_T *c1_identifier);
static c1_PatientInformation c1_p_emlrt_marshallIn
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance, const mxArray *c1_u, const
   emlrtMsgIdentifier *c1_parentId);
static const mxArray *c1_q_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_b_setSimStateSideEffectsInfo, const char_T
  *c1_identifier);
static const mxArray *c1_r_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId);
static uint8_T c1__u8_s32_(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  int32_T c1_b);
static uint32_T c1__u32_d_(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_b);
static void init_dsm_address_info(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance);

/* Function Definitions */
static void initialize_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  uint32_T *c1_ClearCond;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  boolean_T *c1_O_BolusRequested;
  real_T *c1_O_ProgrammedVTBI;
  real_T *c1_O_ProgrammedFlowRate;
  uint32_T *c1_O_CurrentState;
  uint32_T *c1_O_AlarmCond;
  c1_DrugLibrary *c1_O_DrugLibInfo;
  c1_PatientInformation *c1_O_PatientInfo;
  c1_InfusionStatus *c1_O_InfuStatus;
  boolean_T *c1_E_Restart;
  boolean_T *c1_E_AlarmClear;
  boolean_T *c1_E_RequestToStart;
  c1_E_RequestToStart = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 14);
  c1_E_AlarmClear = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 13);
  c1_E_Restart = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 12);
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_O_InfuStatus = (c1_InfusionStatus *)ssGetOutputPortSignal(chartInstance->S,
    10);
  c1_O_PatientInfo = (c1_PatientInformation *)ssGetOutputPortSignal
    (chartInstance->S, 9);
  c1_O_DrugLibInfo = (c1_DrugLibrary *)ssGetOutputPortSignal(chartInstance->S, 8);
  c1_O_CurrentState = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 7);
  c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c1_O_ProgrammedVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  c1_ClearCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
  chartInstance->c1_doSetSimStateSideEffects = 0U;
  chartInstance->c1_setSimStateSideEffectsInfo = NULL;
  chartInstance->c1_is_InfusionStateMachine = 0U;
  chartInstance->c1_tp_InfusionStateMachine = 0U;
  chartInstance->c1_tp_ALM_POSTFailed = 0U;
  chartInstance->c1_is_CheckDrugRoutine = 0U;
  chartInstance->c1_was_CheckDrugRoutine = 0U;
  chartInstance->c1_tp_CheckDrugRoutine = 0U;
  chartInstance->c1_tp_ALM_WrongAdminCheck = 0U;
  chartInstance->c1_tp_CheckAdminSet = 0U;
  chartInstance->c1_tp_CheckDrug_CheckType = 0U;
  chartInstance->c1_tp_CheckPrime = 0U;
  chartInstance->c1_tp_Check_Concen = 0U;
  chartInstance->c1_tp_Check_DrugUnits = 0U;
  chartInstance->c1_tp_DisplayDrugInfo = 0U;
  chartInstance->c1_tp_DisplayPatientProfile = 0U;
  chartInstance->c1_tp_IncorrectDrugUnits = 0U;
  chartInstance->c1_tp_PrimeFailed = 0U;
  chartInstance->c1_tp_UnknownDrug = 0U;
  chartInstance->c1_tp_WRN_DangerCon = 0U;
  chartInstance->c1_tp_WrongConcentration = 0U;
  chartInstance->c1_is_ConfigureInfusionProgram = 0U;
  chartInstance->c1_was_ConfigureInfusionProgram = 0U;
  chartInstance->c1_tp_ConfigureInfusionProgram = 0U;
  chartInstance->c1_tp_ALM_DoseRateOutBound = 0U;
  chartInstance->c1_tp_ALM_VTBIOutBound = 0U;
  chartInstance->c1_tp_ChangeDoseRate = 0U;
  chartInstance->c1_tp_ChangeVTBI = 0U;
  chartInstance->c1_tp_CheckDoseRate = 0U;
  chartInstance->c1_tp_CheckVTBI = 0U;
  chartInstance->c1_tp_DisplayDoseRate = 0U;
  chartInstance->c1_tp_DisplaySettings = 0U;
  chartInstance->c1_tp_DisplayVTBI = 0U;
  chartInstance->c1_tp_ReadyToStart = 0U;
  chartInstance->c1_tp_WRN_DOSERATEOUTSOFTLIMITS = 0U;
  chartInstance->c1_tp_WRN_VTBIOutBound = 0U;
  chartInstance->c1_tp_ConfirmPowerDown = 0U;
  chartInstance->c1_is_InfusionInSession = 0U;
  chartInstance->c1_was_InfusionInSession = 0U;
  chartInstance->c1_tp_InfusionInSession = 0U;
  chartInstance->c1_tp_ALMWrongDrug = 0U;
  chartInstance->c1_tp_CheckDrugWhileInfusing = 0U;
  chartInstance->c1_tp_EmptyReservoir = 0U;
  chartInstance->c1_tp_InfusionPaused = 0U;
  chartInstance->c1_tp_InfusionStopped = 0U;
  chartInstance->c1_is_InfusionSubMachine = 0U;
  chartInstance->c1_tp_InfusionSubMachine = 0U;
  chartInstance->c1_tp_ALM_NewRateOutBound = 0U;
  chartInstance->c1_tp_BolusRequest = 0U;
  chartInstance->c1_tp_ChangeRate = 0U;
  chartInstance->c1_tp_CheckNewRate = 0U;
  chartInstance->c1_tp_ConfirmPause = 0U;
  chartInstance->c1_tp_ConfirmStop = 0U;
  chartInstance->c1_tp_Infusing = 0U;
  chartInstance->c1_tp_LevelTwoAlarming = 0U;
  chartInstance->c1_tp_PausedStopConfirm = 0U;
  chartInstance->c1_tp_PausedTooLong = 0U;
  chartInstance->c1_tp_Init = 0U;
  chartInstance->c1_tp_LEVELONEALRM = 0U;
  chartInstance->c1_tp_POST = 0U;
  chartInstance->c1_tp_POSTDONE = 0U;
  chartInstance->c1_tp_PowerOff = 0U;
  chartInstance->c1_is_active_c1_GPCA_Extension = 0U;
  chartInstance->c1_is_c1_GPCA_Extension = 0U;
  chartInstance->c1_temp = 0.0;
  chartInstance->c1_tempx = 0U;
  chartInstance->c1_infusing = FALSE;
  chartInstance->c1_bolusing = FALSE;
  chartInstance->c1_vtbi = 0.0;
  chartInstance->c1_doseRate = 0.0;
  chartInstance->c1_initDrugReservoirVolume = 0.0;
  chartInstance->c1_MSG_WELCOME = 1U;
  chartInstance->c1_MSG_POWEROFF = 2U;
  chartInstance->c1_MSG_POST = 3U;
  chartInstance->c1_MSG_POSTFAIL = 4U;
  chartInstance->c1_MSG_ADMINCHECK = 5U;
  chartInstance->c1_MSG_ADMINFAIL = 6U;
  chartInstance->c1_MSG_PRIME = 7U;
  chartInstance->c1_MSG_PRIMEFAIL = 8U;
  chartInstance->c1_MSG_CHECKTYPE = 9U;
  chartInstance->c1_MSG_WRONGDRUG = 10U;
  chartInstance->c1_MSG_CHECKDU = 11U;
  chartInstance->c1_MSG_WRONGDU = 12U;
  chartInstance->c1_MSG_CHECKCON = 13U;
  chartInstance->c1_MSG_WRONGCON = 14U;
  chartInstance->c1_MSG_DANGECON = 15U;
  chartInstance->c1_MSG_PATIENTINFO = 16U;
  chartInstance->c1_MSG_CHANGEVTBI = 18U;
  chartInstance->c1_MSG_VTBI = 17U;
  chartInstance->c1_MSG_CHECKVTBI = 19U;
  chartInstance->c1_MSG_ALMVTBI = 20U;
  chartInstance->c1_MSG_DISPLAYDR = 21U;
  chartInstance->c1_MSG_CHECKDR = 22U;
  chartInstance->c1_MSG_CHANGEDR = 23U;
  chartInstance->c1_MSG_DISPLAYSET = 24U;
  chartInstance->c1_MSG_ALRMDR = 25U;
  chartInstance->c1_MSG_INFUSING = 26U;
  chartInstance->c1_MSG_DANGERENVTEMP = 24U;
  chartInstance->c1_MSG_DANGERHUMD = 25U;
  chartInstance->c1_MSG_DANGERAP = 26U;
  chartInstance->c1_MSG_POSTDONE = 27U;
  chartInstance->c1_MSG_DRUGINFO = 28U;
  chartInstance->c1_MSG_BOLUSGRANT = 28U;
  chartInstance->c1_MSG_BOLUSDENIED = 29U;
  chartInstance->c1_MSG_STOPBOLUS = 30U;
  chartInstance->c1_MSG_EMPTYRESERVOIR = 8U;
  chartInstance->c1_MSG_DOOROPEN = 7U;
  chartInstance->c1_MSG_AIRINLINE = 15U;
  chartInstance->c1_MSG_OCCULUSION = 9U;
  chartInstance->c1_MSG_PAUSETOOLONG = 14U;
  chartInstance->c1_MSG_FLOWRATEVARY = 16U;
  chartInstance->c1_MSG_OVERINFUSION = 10U;
  chartInstance->c1_MSG_UNDERINFUSION = 11U;
  chartInstance->c1_MSG_LESSTHANKVO = 12U;
  chartInstance->c1_MSG_RATEEXCEEDCAPACITY = 13U;
  chartInstance->c1_MSG_REALTIMECLOCK = 2U;
  chartInstance->c1_MSG_WATCHDOGALERT = 6U;
  chartInstance->c1_MSG_OUTOFPOWER = 1U;
  chartInstance->c1_MSG_MEMORYCORRUPT = 4U;
  chartInstance->c1_MSG_CPUFAILURE = 3U;
  chartInstance->c1_MSG_INFUSIONSTOP = 29U;
  chartInstance->c1_MSG_SPCHOOSE = 30U;
  chartInstance->c1_MSG_INFUSIONPAUSED = 31U;
  chartInstance->c1_MSG_CONFIRMPAUSE = 32U;
  chartInstance->c1_MSG_CONFIRMSTOP = 33U;
  chartInstance->c1_MSG_STOPPAUSE = 34U;
  chartInstance->c1_MSG_LOGERR = 19U;
  chartInstance->c1_MSG_LOWBATT = 20U;
  chartInstance->c1_MSG_LOWRESR = 17U;
  chartInstance->c1_MSG_WRNDR = 35U;
  chartInstance->c1_MSG_WRNVTBI = 36U;
  chartInstance->c1_MSG_NOTREADY = 27U;
  chartInstance->c1_MSG_BLANK = 31U;
  chartInstance->c1_MSG_WRNBATTERYCHARGE = 21U;
  chartInstance->c1_MSG_VOLTOUTRANGE = 22U;
  chartInstance->c1_MSG_PUMPTOOHOT = 5U;
  chartInstance->c1_MSG_PAUSELONG = 18U;
  chartInstance->c1_MSG_PUMPOVERHEAT = 23U;
  chartInstance->c1_MSG_DISPINFU = 32U;
  if (!(cdrGetOutputPortReusable(chartInstance->S, 1) != 0)) {
    *c1_ClearCond = 0U;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 2) != 0)) {
    *c1_O_InfusionInProgress = FALSE;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 3) != 0)) {
    *c1_O_InfusionPaused = FALSE;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 4) != 0)) {
    *c1_O_BolusRequested = FALSE;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 5) != 0)) {
    *c1_O_ProgrammedVTBI = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 6) != 0)) {
    *c1_O_ProgrammedFlowRate = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 7) != 0)) {
    *c1_O_CurrentState = 0U;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 8) != 0)) {
    *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 0) = 0U;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 8) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 16) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 24) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 32) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 40) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 48) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 56) = 0.0;
    *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 64) = 0U;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 72) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 80) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 88) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 96) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 104) = 0.0;
    *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 112) = 0U;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 120) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 128) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 136) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 144) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 152) = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 9) != 0)) {
    *(uint32_T *)((char_T *)c1_O_PatientInfo + 0) = 0U;
    *(uint32_T *)((char_T *)c1_O_PatientInfo + 4) = 0U;
    *(uint32_T *)((char_T *)c1_O_PatientInfo + 8) = 0U;
    *(uint32_T *)((char_T *)c1_O_PatientInfo + 12) = 0U;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 10) != 0)) {
    *(boolean_T *)((char_T *)c1_O_InfuStatus + 0) = FALSE;
    *(real_T *)((char_T *)c1_O_InfuStatus + 8) = 0.0;
    *(real_T *)((char_T *)c1_O_InfuStatus + 16) = 0.0;
  }

  if (!(cdrGetOutputPortReusable(chartInstance->S, 11) != 0)) {
    *c1_O_AlarmCond = 0U;
  }

  chartInstance->c1_E_RestartEventCounter = 0U;
  *c1_E_Restart = FALSE;
  chartInstance->c1_E_AlarmClearEventCounter = 0U;
  *c1_E_AlarmClear = FALSE;
  chartInstance->c1_E_RequestToStartEventCounter = 0U;
  *c1_E_RequestToStart = FALSE;
}

static void initialize_params_c1_GPCA_Extension
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
}

static void enable_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
}

static void disable_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
}

static void c1_update_debugger_state_c1_GPCA_Extension
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  uint32_T c1_prevAniVal;
  c1_prevAniVal = sf_debug_get_animation();
  sf_debug_set_animation(0U);
  if (chartInstance->c1_is_active_c1_GPCA_Extension == 1) {
    _SFD_CC_CALL(CHART_ACTIVE_TAG, 0U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_ALM_VTBIOutBound) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_DisplayDoseRate) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_ConfirmPowerDown) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_PowerOff) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 51U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_POST) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 49U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 49U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_ALM_POSTFailed) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 1U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 1U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_CheckAdminSet) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_CheckPrime) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_ALM_WrongAdminCheck) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_PrimeFailed) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_DisplayDrugInfo) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_CheckDrug_CheckType) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_UnknownDrug) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_Check_DrugUnits) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 8U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 8U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_IncorrectDrugUnits) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_Check_Concen) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_WrongConcentration) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_WRN_DangerCon) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_DisplayPatientProfile) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_DisplayVTBI) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_ChangeVTBI) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_CheckVTBI) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_ChangeDoseRate) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_CheckDoseRate) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram ==
      c1_IN_ALM_DoseRateOutBound) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_DisplaySettings) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionSubMachine == c1_IN_Infusing) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_InfusionInSession) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 30U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 30U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionSubMachine == c1_IN_ChangeRate) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionSubMachine == c1_IN_CheckNewRate) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 40U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 40U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionSubMachine == c1_IN_ALM_NewRateOutBound) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionSubMachine == c1_IN_ConfirmStop) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionSubMachine == c1_IN_ConfirmPause) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_InfusionPaused) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_ReadyToStart) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_PausedStopConfirm) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_InfusionStopped) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_EmptyReservoir) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_CheckDrugWhileInfusing) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_ALMWrongDrug) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_Init) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 47U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 47U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_LevelTwoAlarming) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_InfusionSubMachine) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_POSTDONE) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_WRN_VTBIOutBound) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_LEVELONEALRM) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 48U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 48U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionSubMachine == c1_IN_BolusRequest) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 38U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 38U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_ConfigureInfusionProgram ==
      c1_IN_WRN_DOSERATEOUTSOFTLIMITS) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 27U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 27U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionInSession == c1_IN_PausedTooLong) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine == c1_IN_CheckDrugRoutine) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_InfusionStateMachine ==
      c1_IN_ConfigureInfusionProgram) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 16U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 16U, chartInstance->c1_sfEvent);
  }

  if (chartInstance->c1_is_c1_GPCA_Extension == c1_IN_InfusionStateMachine) {
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c1_sfEvent);
  } else {
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 0U, chartInstance->c1_sfEvent);
  }

  sf_debug_set_animation(c1_prevAniVal);
  _SFD_ANIMATE();
}

static const mxArray *get_sim_state_c1_GPCA_Extension
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  const mxArray *c1_st;
  const mxArray *c1_y = NULL;
  uint32_T c1_hoistedGlobal;
  uint32_T c1_u;
  const mxArray *c1_b_y = NULL;
  uint32_T c1_b_hoistedGlobal;
  uint32_T c1_b_u;
  const mxArray *c1_c_y = NULL;
  boolean_T c1_c_hoistedGlobal;
  boolean_T c1_c_u;
  const mxArray *c1_d_y = NULL;
  uint32_T c1_d_hoistedGlobal;
  uint32_T c1_d_u;
  const mxArray *c1_e_y = NULL;
  c1_DrugLibrary c1_r0;
  c1_InfusionStatus c1_e_u;
  const mxArray *c1_f_y = NULL;
  boolean_T c1_f_u;
  const mxArray *c1_g_y = NULL;
  real_T c1_g_u;
  const mxArray *c1_h_y = NULL;
  real_T c1_h_u;
  const mxArray *c1_i_y = NULL;
  boolean_T c1_e_hoistedGlobal;
  boolean_T c1_i_u;
  const mxArray *c1_j_y = NULL;
  boolean_T c1_f_hoistedGlobal;
  boolean_T c1_j_u;
  const mxArray *c1_k_y = NULL;
  c1_PatientInformation c1_k_u;
  const mxArray *c1_l_y = NULL;
  uint32_T c1_l_u;
  const mxArray *c1_m_y = NULL;
  uint32_T c1_m_u;
  const mxArray *c1_n_y = NULL;
  uint32_T c1_n_u;
  const mxArray *c1_o_y = NULL;
  uint32_T c1_o_u;
  const mxArray *c1_p_y = NULL;
  real_T c1_g_hoistedGlobal;
  real_T c1_p_u;
  const mxArray *c1_q_y = NULL;
  real_T c1_h_hoistedGlobal;
  real_T c1_q_u;
  const mxArray *c1_r_y = NULL;
  boolean_T c1_i_hoistedGlobal;
  boolean_T c1_r_u;
  const mxArray *c1_s_y = NULL;
  real_T c1_j_hoistedGlobal;
  real_T c1_s_u;
  const mxArray *c1_t_y = NULL;
  boolean_T c1_k_hoistedGlobal;
  boolean_T c1_t_u;
  const mxArray *c1_u_y = NULL;
  real_T c1_l_hoistedGlobal;
  real_T c1_u_u;
  const mxArray *c1_v_y = NULL;
  real_T c1_m_hoistedGlobal;
  real_T c1_v_u;
  const mxArray *c1_w_y = NULL;
  uint32_T c1_n_hoistedGlobal;
  uint32_T c1_w_u;
  const mxArray *c1_x_y = NULL;
  real_T c1_o_hoistedGlobal;
  real_T c1_x_u;
  const mxArray *c1_y_y = NULL;
  boolean_T c1_p_hoistedGlobal;
  boolean_T c1_y_u;
  const mxArray *c1_ab_y = NULL;
  boolean_T c1_q_hoistedGlobal;
  boolean_T c1_ab_u;
  const mxArray *c1_bb_y = NULL;
  boolean_T c1_r_hoistedGlobal;
  boolean_T c1_bb_u;
  const mxArray *c1_cb_y = NULL;
  uint32_T c1_s_hoistedGlobal;
  uint32_T c1_cb_u;
  const mxArray *c1_db_y = NULL;
  uint32_T c1_t_hoistedGlobal;
  uint32_T c1_db_u;
  const mxArray *c1_eb_y = NULL;
  uint32_T c1_u_hoistedGlobal;
  uint32_T c1_eb_u;
  const mxArray *c1_fb_y = NULL;
  uint8_T c1_v_hoistedGlobal;
  uint8_T c1_fb_u;
  const mxArray *c1_gb_y = NULL;
  uint8_T c1_w_hoistedGlobal;
  uint8_T c1_gb_u;
  const mxArray *c1_hb_y = NULL;
  uint8_T c1_x_hoistedGlobal;
  uint8_T c1_hb_u;
  const mxArray *c1_ib_y = NULL;
  uint8_T c1_y_hoistedGlobal;
  uint8_T c1_ib_u;
  const mxArray *c1_jb_y = NULL;
  uint8_T c1_ab_hoistedGlobal;
  uint8_T c1_jb_u;
  const mxArray *c1_kb_y = NULL;
  uint8_T c1_bb_hoistedGlobal;
  uint8_T c1_kb_u;
  const mxArray *c1_lb_y = NULL;
  uint8_T c1_cb_hoistedGlobal;
  uint8_T c1_lb_u;
  const mxArray *c1_mb_y = NULL;
  uint8_T c1_db_hoistedGlobal;
  uint8_T c1_mb_u;
  const mxArray *c1_nb_y = NULL;
  uint8_T c1_eb_hoistedGlobal;
  uint8_T c1_nb_u;
  const mxArray *c1_ob_y = NULL;
  uint8_T c1_fb_hoistedGlobal;
  uint8_T c1_ob_u;
  const mxArray *c1_pb_y = NULL;
  uint8_T c1_gb_hoistedGlobal;
  uint8_T c1_pb_u;
  const mxArray *c1_qb_y = NULL;
  uint32_T *c1_ClearCond;
  uint32_T *c1_O_AlarmCond;
  boolean_T *c1_O_BolusRequested;
  uint32_T *c1_O_CurrentState;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  real_T *c1_O_ProgrammedFlowRate;
  real_T *c1_O_ProgrammedVTBI;
  c1_InfusionStatus *c1_O_InfuStatus;
  c1_PatientInformation *c1_O_PatientInfo;
  c1_DrugLibrary *c1_O_DrugLibInfo;
  boolean_T *c1_E_AlarmClear;
  boolean_T *c1_E_RequestToStart;
  boolean_T *c1_E_Restart;
  c1_E_RequestToStart = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 14);
  c1_E_AlarmClear = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 13);
  c1_E_Restart = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 12);
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_O_InfuStatus = (c1_InfusionStatus *)ssGetOutputPortSignal(chartInstance->S,
    10);
  c1_O_PatientInfo = (c1_PatientInformation *)ssGetOutputPortSignal
    (chartInstance->S, 9);
  c1_O_DrugLibInfo = (c1_DrugLibrary *)ssGetOutputPortSignal(chartInstance->S, 8);
  c1_O_CurrentState = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 7);
  c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c1_O_ProgrammedVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  c1_ClearCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c1_st = NULL;
  c1_st = NULL;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_createcellarray(35), FALSE);
  c1_hoistedGlobal = *c1_ClearCond;
  c1_u = c1_hoistedGlobal;
  c1_b_y = NULL;
  sf_mex_assign(&c1_b_y, sf_mex_create("y", &c1_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 0, c1_b_y);
  c1_b_hoistedGlobal = *c1_O_AlarmCond;
  c1_b_u = c1_b_hoistedGlobal;
  c1_c_y = NULL;
  sf_mex_assign(&c1_c_y, sf_mex_create("y", &c1_b_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 1, c1_c_y);
  c1_c_hoistedGlobal = *c1_O_BolusRequested;
  c1_c_u = c1_c_hoistedGlobal;
  c1_d_y = NULL;
  sf_mex_assign(&c1_d_y, sf_mex_create("y", &c1_c_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 2, c1_d_y);
  c1_d_hoistedGlobal = *c1_O_CurrentState;
  c1_d_u = c1_d_hoistedGlobal;
  c1_e_y = NULL;
  sf_mex_assign(&c1_e_y, sf_mex_create("y", &c1_d_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 3, c1_e_y);
  c1_r0.drugID = *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 0);
  c1_r0.amount = *(real_T *)((char_T *)c1_O_DrugLibInfo + 8);
  c1_r0.diluentVolume = *(real_T *)((char_T *)c1_O_DrugLibInfo + 16);
  c1_r0.doseRateTypical = *(real_T *)((char_T *)c1_O_DrugLibInfo + 24);
  c1_r0.doseRateUpperHardLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo + 32);
  c1_r0.doseRateUpperSoftLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo + 40);
  c1_r0.doseRateLowerHardLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo + 48);
  c1_r0.doseRateLowerSoftLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo + 56);
  c1_r0.doseRateUnit = *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 64);
  c1_r0.vtbiTypical = *(real_T *)((char_T *)c1_O_DrugLibInfo + 72);
  c1_r0.vtbiUpperHardLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo + 80);
  c1_r0.vtbiUpperSoftLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo + 88);
  c1_r0.vtbiLowerHardLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo + 96);
  c1_r0.vtbiLowerSoftLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo + 104);
  c1_r0.vtbiUnit = *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 112);
  c1_r0.drugConcentrationTypical = *(real_T *)((char_T *)c1_O_DrugLibInfo + 120);
  c1_r0.drugConcentrationUpperHardLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo
    + 128);
  c1_r0.drugConcentrationUpperSoftLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo
    + 136);
  c1_r0.drugConcentrationLowerHardLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo
    + 144);
  c1_r0.drugConcentrationLowerSoftLimit = *(real_T *)((char_T *)c1_O_DrugLibInfo
    + 152);
  sf_mex_setcell(c1_y, 4, c1_emlrt_marshallOut(chartInstance, &c1_r0));
  c1_e_u.isBolusInProgress = *(boolean_T *)((char_T *)c1_O_InfuStatus + 0);
  c1_e_u.totalVolumeInfused = *(real_T *)((char_T *)c1_O_InfuStatus + 8);
  c1_e_u.remainingVolumeInReservoir = *(real_T *)((char_T *)c1_O_InfuStatus + 16);
  c1_f_y = NULL;
  sf_mex_assign(&c1_f_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c1_f_u = c1_e_u.isBolusInProgress;
  c1_g_y = NULL;
  sf_mex_assign(&c1_g_y, sf_mex_create("y", &c1_f_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_f_y, c1_g_y, "isBolusInProgress", "isBolusInProgress", 0);
  c1_g_u = c1_e_u.totalVolumeInfused;
  c1_h_y = NULL;
  sf_mex_assign(&c1_h_y, sf_mex_create("y", &c1_g_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_f_y, c1_h_y, "totalVolumeInfused", "totalVolumeInfused", 0);
  c1_h_u = c1_e_u.remainingVolumeInReservoir;
  c1_i_y = NULL;
  sf_mex_assign(&c1_i_y, sf_mex_create("y", &c1_h_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_f_y, c1_i_y, "remainingVolumeInReservoir",
                  "remainingVolumeInReservoir", 0);
  sf_mex_setcell(c1_y, 5, c1_f_y);
  c1_e_hoistedGlobal = *c1_O_InfusionInProgress;
  c1_i_u = c1_e_hoistedGlobal;
  c1_j_y = NULL;
  sf_mex_assign(&c1_j_y, sf_mex_create("y", &c1_i_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 6, c1_j_y);
  c1_f_hoistedGlobal = *c1_O_InfusionPaused;
  c1_j_u = c1_f_hoistedGlobal;
  c1_k_y = NULL;
  sf_mex_assign(&c1_k_y, sf_mex_create("y", &c1_j_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 7, c1_k_y);
  c1_k_u.patientID = *(uint32_T *)((char_T *)c1_O_PatientInfo + 0);
  c1_k_u.patientAge = *(uint32_T *)((char_T *)c1_O_PatientInfo + 4);
  c1_k_u.patientGender = *(uint32_T *)((char_T *)c1_O_PatientInfo + 8);
  c1_k_u.patientWeight = *(uint32_T *)((char_T *)c1_O_PatientInfo + 12);
  c1_l_y = NULL;
  sf_mex_assign(&c1_l_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c1_l_u = c1_k_u.patientID;
  c1_m_y = NULL;
  sf_mex_assign(&c1_m_y, sf_mex_create("y", &c1_l_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_l_y, c1_m_y, "patientID", "patientID", 0);
  c1_m_u = c1_k_u.patientAge;
  c1_n_y = NULL;
  sf_mex_assign(&c1_n_y, sf_mex_create("y", &c1_m_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_l_y, c1_n_y, "patientAge", "patientAge", 0);
  c1_n_u = c1_k_u.patientGender;
  c1_o_y = NULL;
  sf_mex_assign(&c1_o_y, sf_mex_create("y", &c1_n_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_l_y, c1_o_y, "patientGender", "patientGender", 0);
  c1_o_u = c1_k_u.patientWeight;
  c1_p_y = NULL;
  sf_mex_assign(&c1_p_y, sf_mex_create("y", &c1_o_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_l_y, c1_p_y, "patientWeight", "patientWeight", 0);
  sf_mex_setcell(c1_y, 8, c1_l_y);
  c1_g_hoistedGlobal = *c1_O_ProgrammedFlowRate;
  c1_p_u = c1_g_hoistedGlobal;
  c1_q_y = NULL;
  sf_mex_assign(&c1_q_y, sf_mex_create("y", &c1_p_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 9, c1_q_y);
  c1_h_hoistedGlobal = *c1_O_ProgrammedVTBI;
  c1_q_u = c1_h_hoistedGlobal;
  c1_r_y = NULL;
  sf_mex_assign(&c1_r_y, sf_mex_create("y", &c1_q_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 10, c1_r_y);
  c1_i_hoistedGlobal = chartInstance->c1_bolusing;
  c1_r_u = c1_i_hoistedGlobal;
  c1_s_y = NULL;
  sf_mex_assign(&c1_s_y, sf_mex_create("y", &c1_r_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 11, c1_s_y);
  c1_j_hoistedGlobal = chartInstance->c1_doseRate;
  c1_s_u = c1_j_hoistedGlobal;
  c1_t_y = NULL;
  sf_mex_assign(&c1_t_y, sf_mex_create("y", &c1_s_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 12, c1_t_y);
  c1_k_hoistedGlobal = chartInstance->c1_infusing;
  c1_t_u = c1_k_hoistedGlobal;
  c1_u_y = NULL;
  sf_mex_assign(&c1_u_y, sf_mex_create("y", &c1_t_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 13, c1_u_y);
  c1_l_hoistedGlobal = chartInstance->c1_initDrugReservoirVolume;
  c1_u_u = c1_l_hoistedGlobal;
  c1_v_y = NULL;
  sf_mex_assign(&c1_v_y, sf_mex_create("y", &c1_u_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 14, c1_v_y);
  c1_m_hoistedGlobal = chartInstance->c1_temp;
  c1_v_u = c1_m_hoistedGlobal;
  c1_w_y = NULL;
  sf_mex_assign(&c1_w_y, sf_mex_create("y", &c1_v_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 15, c1_w_y);
  c1_n_hoistedGlobal = chartInstance->c1_tempx;
  c1_w_u = c1_n_hoistedGlobal;
  c1_x_y = NULL;
  sf_mex_assign(&c1_x_y, sf_mex_create("y", &c1_w_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 16, c1_x_y);
  c1_o_hoistedGlobal = chartInstance->c1_vtbi;
  c1_x_u = c1_o_hoistedGlobal;
  c1_y_y = NULL;
  sf_mex_assign(&c1_y_y, sf_mex_create("y", &c1_x_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 17, c1_y_y);
  c1_p_hoistedGlobal = *c1_E_AlarmClear;
  c1_y_u = c1_p_hoistedGlobal;
  c1_ab_y = NULL;
  sf_mex_assign(&c1_ab_y, sf_mex_create("y", &c1_y_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 18, c1_ab_y);
  c1_q_hoistedGlobal = *c1_E_RequestToStart;
  c1_ab_u = c1_q_hoistedGlobal;
  c1_bb_y = NULL;
  sf_mex_assign(&c1_bb_y, sf_mex_create("y", &c1_ab_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 19, c1_bb_y);
  c1_r_hoistedGlobal = *c1_E_Restart;
  c1_bb_u = c1_r_hoistedGlobal;
  c1_cb_y = NULL;
  sf_mex_assign(&c1_cb_y, sf_mex_create("y", &c1_bb_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 20, c1_cb_y);
  c1_s_hoistedGlobal = chartInstance->c1_E_AlarmClearEventCounter;
  c1_cb_u = c1_s_hoistedGlobal;
  c1_db_y = NULL;
  sf_mex_assign(&c1_db_y, sf_mex_create("y", &c1_cb_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 21, c1_db_y);
  c1_t_hoistedGlobal = chartInstance->c1_E_RequestToStartEventCounter;
  c1_db_u = c1_t_hoistedGlobal;
  c1_eb_y = NULL;
  sf_mex_assign(&c1_eb_y, sf_mex_create("y", &c1_db_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 22, c1_eb_y);
  c1_u_hoistedGlobal = chartInstance->c1_E_RestartEventCounter;
  c1_eb_u = c1_u_hoistedGlobal;
  c1_fb_y = NULL;
  sf_mex_assign(&c1_fb_y, sf_mex_create("y", &c1_eb_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 23, c1_fb_y);
  c1_v_hoistedGlobal = chartInstance->c1_is_active_c1_GPCA_Extension;
  c1_fb_u = c1_v_hoistedGlobal;
  c1_gb_y = NULL;
  sf_mex_assign(&c1_gb_y, sf_mex_create("y", &c1_fb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 24, c1_gb_y);
  c1_w_hoistedGlobal = chartInstance->c1_is_c1_GPCA_Extension;
  c1_gb_u = c1_w_hoistedGlobal;
  c1_hb_y = NULL;
  sf_mex_assign(&c1_hb_y, sf_mex_create("y", &c1_gb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 25, c1_hb_y);
  c1_x_hoistedGlobal = chartInstance->c1_is_InfusionInSession;
  c1_hb_u = c1_x_hoistedGlobal;
  c1_ib_y = NULL;
  sf_mex_assign(&c1_ib_y, sf_mex_create("y", &c1_hb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 26, c1_ib_y);
  c1_y_hoistedGlobal = chartInstance->c1_is_InfusionSubMachine;
  c1_ib_u = c1_y_hoistedGlobal;
  c1_jb_y = NULL;
  sf_mex_assign(&c1_jb_y, sf_mex_create("y", &c1_ib_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 27, c1_jb_y);
  c1_ab_hoistedGlobal = chartInstance->c1_is_CheckDrugRoutine;
  c1_jb_u = c1_ab_hoistedGlobal;
  c1_kb_y = NULL;
  sf_mex_assign(&c1_kb_y, sf_mex_create("y", &c1_jb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 28, c1_kb_y);
  c1_bb_hoistedGlobal = chartInstance->c1_is_ConfigureInfusionProgram;
  c1_kb_u = c1_bb_hoistedGlobal;
  c1_lb_y = NULL;
  sf_mex_assign(&c1_lb_y, sf_mex_create("y", &c1_kb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 29, c1_lb_y);
  c1_cb_hoistedGlobal = chartInstance->c1_is_InfusionStateMachine;
  c1_lb_u = c1_cb_hoistedGlobal;
  c1_mb_y = NULL;
  sf_mex_assign(&c1_mb_y, sf_mex_create("y", &c1_lb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 30, c1_mb_y);
  c1_db_hoistedGlobal = chartInstance->c1_was_InfusionInSession;
  c1_mb_u = c1_db_hoistedGlobal;
  c1_nb_y = NULL;
  sf_mex_assign(&c1_nb_y, sf_mex_create("y", &c1_mb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 31, c1_nb_y);
  c1_eb_hoistedGlobal = chartInstance->c1_was_CheckDrugRoutine;
  c1_nb_u = c1_eb_hoistedGlobal;
  c1_ob_y = NULL;
  sf_mex_assign(&c1_ob_y, sf_mex_create("y", &c1_nb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 32, c1_ob_y);
  c1_fb_hoistedGlobal = chartInstance->c1_was_ConfigureInfusionProgram;
  c1_ob_u = c1_fb_hoistedGlobal;
  c1_pb_y = NULL;
  sf_mex_assign(&c1_pb_y, sf_mex_create("y", &c1_ob_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 33, c1_pb_y);
  c1_gb_hoistedGlobal = chartInstance->c1_temporalCounter_i1;
  c1_pb_u = c1_gb_hoistedGlobal;
  c1_qb_y = NULL;
  sf_mex_assign(&c1_qb_y, sf_mex_create("y", &c1_pb_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_setcell(c1_y, 34, c1_qb_y);
  sf_mex_assign(&c1_st, c1_y, FALSE);
  return c1_st;
}

static void set_sim_state_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_st)
{
  const mxArray *c1_u;
  c1_DrugLibrary c1_r1;
  c1_InfusionStatus c1_r2;
  c1_PatientInformation c1_r3;
  uint32_T *c1_ClearCond;
  uint32_T *c1_O_AlarmCond;
  boolean_T *c1_O_BolusRequested;
  uint32_T *c1_O_CurrentState;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  real_T *c1_O_ProgrammedFlowRate;
  real_T *c1_O_ProgrammedVTBI;
  c1_DrugLibrary *c1_O_DrugLibInfo;
  c1_InfusionStatus *c1_O_InfuStatus;
  c1_PatientInformation *c1_O_PatientInfo;
  boolean_T *c1_E_AlarmClear;
  boolean_T *c1_E_RequestToStart;
  boolean_T *c1_E_Restart;
  c1_E_RequestToStart = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 14);
  c1_E_AlarmClear = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 13);
  c1_E_Restart = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 12);
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_O_InfuStatus = (c1_InfusionStatus *)ssGetOutputPortSignal(chartInstance->S,
    10);
  c1_O_PatientInfo = (c1_PatientInformation *)ssGetOutputPortSignal
    (chartInstance->S, 9);
  c1_O_DrugLibInfo = (c1_DrugLibrary *)ssGetOutputPortSignal(chartInstance->S, 8);
  c1_O_CurrentState = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 7);
  c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c1_O_ProgrammedVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  c1_ClearCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c1_u = sf_mex_dup(c1_st);
  *c1_ClearCond = c1_b_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c1_u, 0)), "ClearCond");
  *c1_O_AlarmCond = c1_b_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 1)), "O_AlarmCond");
  *c1_O_BolusRequested = c1_g_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 2)), "O_BolusRequested");
  *c1_O_CurrentState = c1_b_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 3)), "O_CurrentState");
  c1_k_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 4)),
                        "O_DrugLibInfo", &c1_r1);
  *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 0) = c1_r1.drugID;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 8) = c1_r1.amount;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 16) = c1_r1.diluentVolume;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 24) = c1_r1.doseRateTypical;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 32) = c1_r1.doseRateUpperHardLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 40) = c1_r1.doseRateUpperSoftLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 48) = c1_r1.doseRateLowerHardLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 56) = c1_r1.doseRateLowerSoftLimit;
  *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 64) = c1_r1.doseRateUnit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 72) = c1_r1.vtbiTypical;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 80) = c1_r1.vtbiUpperHardLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 88) = c1_r1.vtbiUpperSoftLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 96) = c1_r1.vtbiLowerHardLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 104) = c1_r1.vtbiLowerSoftLimit;
  *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 112) = c1_r1.vtbiUnit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 120) = c1_r1.drugConcentrationTypical;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 128) =
    c1_r1.drugConcentrationUpperHardLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 136) =
    c1_r1.drugConcentrationUpperSoftLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 144) =
    c1_r1.drugConcentrationLowerHardLimit;
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 152) =
    c1_r1.drugConcentrationLowerSoftLimit;
  c1_r2 = c1_m_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 5)),
    "O_InfuStatus");
  *(boolean_T *)((char_T *)c1_O_InfuStatus + 0) = c1_r2.isBolusInProgress;
  *(real_T *)((char_T *)c1_O_InfuStatus + 8) = c1_r2.totalVolumeInfused;
  *(real_T *)((char_T *)c1_O_InfuStatus + 16) = c1_r2.remainingVolumeInReservoir;
  *c1_O_InfusionInProgress = c1_g_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 6)), "O_InfusionInProgress");
  *c1_O_InfusionPaused = c1_g_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 7)), "O_InfusionPaused");
  c1_r3 = c1_o_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 8)),
    "O_PatientInfo");
  *(uint32_T *)((char_T *)c1_O_PatientInfo + 0) = c1_r3.patientID;
  *(uint32_T *)((char_T *)c1_O_PatientInfo + 4) = c1_r3.patientAge;
  *(uint32_T *)((char_T *)c1_O_PatientInfo + 8) = c1_r3.patientGender;
  *(uint32_T *)((char_T *)c1_O_PatientInfo + 12) = c1_r3.patientWeight;
  *c1_O_ProgrammedFlowRate = c1_i_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 9)), "O_ProgrammedFlowRate");
  *c1_O_ProgrammedVTBI = c1_i_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 10)), "O_ProgrammedVTBI");
  chartInstance->c1_bolusing = c1_g_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 11)), "bolusing");
  chartInstance->c1_doseRate = c1_i_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 12)), "doseRate");
  chartInstance->c1_infusing = c1_g_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 13)), "infusing");
  chartInstance->c1_initDrugReservoirVolume = c1_i_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 14)),
     "initDrugReservoirVolume");
  chartInstance->c1_temp = c1_i_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 15)), "temp");
  chartInstance->c1_tempx = c1_b_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 16)), "tempx");
  chartInstance->c1_vtbi = c1_i_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 17)), "vtbi");
  *c1_E_AlarmClear = c1_g_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 18)), "E_AlarmClear");
  *c1_E_RequestToStart = c1_g_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getcell(c1_u, 19)), "E_RequestToStart");
  *c1_E_Restart = c1_g_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c1_u, 20)), "E_Restart");
  chartInstance->c1_E_AlarmClearEventCounter = c1_b_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 21)),
     "E_AlarmClearEventCounter");
  chartInstance->c1_E_RequestToStartEventCounter = c1_b_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 22)),
     "E_RequestToStartEventCounter");
  chartInstance->c1_E_RestartEventCounter = c1_b_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c1_u, 23)), "E_RestartEventCounter");
  chartInstance->c1_is_active_c1_GPCA_Extension = c1_e_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 24)),
     "is_active_c1_GPCA_Extension");
  chartInstance->c1_is_c1_GPCA_Extension = c1_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c1_u, 25)), "is_c1_GPCA_Extension");
  chartInstance->c1_is_InfusionInSession = c1_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c1_u, 26)), "is_InfusionInSession");
  chartInstance->c1_is_InfusionSubMachine = c1_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c1_u, 27)), "is_InfusionSubMachine");
  chartInstance->c1_is_CheckDrugRoutine = c1_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c1_u, 28)), "is_CheckDrugRoutine");
  chartInstance->c1_is_ConfigureInfusionProgram = c1_e_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 29)),
     "is_ConfigureInfusionProgram");
  chartInstance->c1_is_InfusionStateMachine = c1_e_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 30)),
     "is_InfusionStateMachine");
  chartInstance->c1_was_InfusionInSession = c1_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c1_u, 31)), "was_InfusionInSession");
  chartInstance->c1_was_CheckDrugRoutine = c1_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c1_u, 32)), "was_CheckDrugRoutine");
  chartInstance->c1_was_ConfigureInfusionProgram = c1_e_emlrt_marshallIn
    (chartInstance, sf_mex_dup(sf_mex_getcell(c1_u, 33)),
     "was_ConfigureInfusionProgram");
  chartInstance->c1_temporalCounter_i1 = c1_e_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getcell(c1_u, 34)), "temporalCounter_i1");
  sf_mex_assign(&chartInstance->c1_setSimStateSideEffectsInfo,
                c1_q_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getcell
    (c1_u, 35)), "setSimStateSideEffectsInfo"), TRUE);
  sf_mex_destroy(&c1_u);
  chartInstance->c1_doSetSimStateSideEffects = 1U;
  c1_update_debugger_state_c1_GPCA_Extension(chartInstance);
  sf_mex_destroy(&c1_st);
}

static void c1_set_sim_state_side_effects_c1_GPCA_Extension
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  if (chartInstance->c1_doSetSimStateSideEffects != 0) {
    if (chartInstance->c1_is_c1_GPCA_Extension == c1_IN_InfusionStateMachine) {
      chartInstance->c1_tp_InfusionStateMachine = 1U;
    } else {
      chartInstance->c1_tp_InfusionStateMachine = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_ALM_POSTFailed) {
      chartInstance->c1_tp_ALM_POSTFailed = 1U;
    } else {
      chartInstance->c1_tp_ALM_POSTFailed = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_CheckDrugRoutine) {
      chartInstance->c1_tp_CheckDrugRoutine = 1U;
    } else {
      chartInstance->c1_tp_CheckDrugRoutine = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_ALM_WrongAdminCheck) {
      chartInstance->c1_tp_ALM_WrongAdminCheck = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_ALM_WrongAdminCheck;
    } else {
      chartInstance->c1_tp_ALM_WrongAdminCheck = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_CheckAdminSet) {
      chartInstance->c1_tp_CheckAdminSet = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckAdminSet;
    } else {
      chartInstance->c1_tp_CheckAdminSet = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_CheckDrug_CheckType) {
      chartInstance->c1_tp_CheckDrug_CheckType = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    } else {
      chartInstance->c1_tp_CheckDrug_CheckType = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_CheckPrime) {
      chartInstance->c1_tp_CheckPrime = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckPrime;
    } else {
      chartInstance->c1_tp_CheckPrime = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_Check_Concen) {
      chartInstance->c1_tp_Check_Concen = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_Check_Concen;
    } else {
      chartInstance->c1_tp_Check_Concen = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_Check_DrugUnits) {
      chartInstance->c1_tp_Check_DrugUnits = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_Check_DrugUnits;
    } else {
      chartInstance->c1_tp_Check_DrugUnits = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_DisplayDrugInfo) {
      chartInstance->c1_tp_DisplayDrugInfo = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
    } else {
      chartInstance->c1_tp_DisplayDrugInfo = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_DisplayPatientProfile) {
      chartInstance->c1_tp_DisplayPatientProfile = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
    } else {
      chartInstance->c1_tp_DisplayPatientProfile = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_IncorrectDrugUnits) {
      chartInstance->c1_tp_IncorrectDrugUnits = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_IncorrectDrugUnits;
    } else {
      chartInstance->c1_tp_IncorrectDrugUnits = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_PrimeFailed) {
      chartInstance->c1_tp_PrimeFailed = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_PrimeFailed;
    } else {
      chartInstance->c1_tp_PrimeFailed = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_UnknownDrug) {
      chartInstance->c1_tp_UnknownDrug = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_UnknownDrug;
    } else {
      chartInstance->c1_tp_UnknownDrug = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_WRN_DangerCon) {
      chartInstance->c1_tp_WRN_DangerCon = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_WRN_DangerCon;
    } else {
      chartInstance->c1_tp_WRN_DangerCon = 0U;
    }

    if (chartInstance->c1_is_CheckDrugRoutine == c1_IN_WrongConcentration) {
      chartInstance->c1_tp_WrongConcentration = 1U;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_WrongConcentration;
    } else {
      chartInstance->c1_tp_WrongConcentration = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine ==
        c1_IN_ConfigureInfusionProgram) {
      chartInstance->c1_tp_ConfigureInfusionProgram = 1U;
    } else {
      chartInstance->c1_tp_ConfigureInfusionProgram = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram ==
        c1_IN_ALM_DoseRateOutBound) {
      chartInstance->c1_tp_ALM_DoseRateOutBound = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram =
        c1_IN_ALM_DoseRateOutBound;
    } else {
      chartInstance->c1_tp_ALM_DoseRateOutBound = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_ALM_VTBIOutBound)
    {
      chartInstance->c1_tp_ALM_VTBIOutBound = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ALM_VTBIOutBound;
    } else {
      chartInstance->c1_tp_ALM_VTBIOutBound = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_ChangeDoseRate) {
      chartInstance->c1_tp_ChangeDoseRate = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
    } else {
      chartInstance->c1_tp_ChangeDoseRate = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_ChangeVTBI) {
      chartInstance->c1_tp_ChangeVTBI = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
    } else {
      chartInstance->c1_tp_ChangeVTBI = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_CheckDoseRate) {
      chartInstance->c1_tp_CheckDoseRate = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_CheckDoseRate;
    } else {
      chartInstance->c1_tp_CheckDoseRate = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_CheckVTBI) {
      chartInstance->c1_tp_CheckVTBI = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_CheckVTBI;
    } else {
      chartInstance->c1_tp_CheckVTBI = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_DisplayDoseRate)
    {
      chartInstance->c1_tp_DisplayDoseRate = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
    } else {
      chartInstance->c1_tp_DisplayDoseRate = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_DisplaySettings)
    {
      chartInstance->c1_tp_DisplaySettings = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplaySettings;
    } else {
      chartInstance->c1_tp_DisplaySettings = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_DisplayVTBI) {
      chartInstance->c1_tp_DisplayVTBI = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
    } else {
      chartInstance->c1_tp_DisplayVTBI = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_ReadyToStart) {
      chartInstance->c1_tp_ReadyToStart = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ReadyToStart;
    } else {
      chartInstance->c1_tp_ReadyToStart = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram ==
        c1_IN_WRN_DOSERATEOUTSOFTLIMITS) {
      chartInstance->c1_tp_WRN_DOSERATEOUTSOFTLIMITS = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram =
        c1_IN_WRN_DOSERATEOUTSOFTLIMITS;
    } else {
      chartInstance->c1_tp_WRN_DOSERATEOUTSOFTLIMITS = 0U;
    }

    if (chartInstance->c1_is_ConfigureInfusionProgram == c1_IN_WRN_VTBIOutBound)
    {
      chartInstance->c1_tp_WRN_VTBIOutBound = 1U;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_WRN_VTBIOutBound;
    } else {
      chartInstance->c1_tp_WRN_VTBIOutBound = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_ConfirmPowerDown) {
      chartInstance->c1_tp_ConfirmPowerDown = 1U;
    } else {
      chartInstance->c1_tp_ConfirmPowerDown = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_InfusionInSession) {
      chartInstance->c1_tp_InfusionInSession = 1U;
    } else {
      chartInstance->c1_tp_InfusionInSession = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_ALMWrongDrug) {
      chartInstance->c1_tp_ALMWrongDrug = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_ALMWrongDrug;
    } else {
      chartInstance->c1_tp_ALMWrongDrug = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_CheckDrugWhileInfusing)
    {
      chartInstance->c1_tp_CheckDrugWhileInfusing = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_CheckDrugWhileInfusing;
    } else {
      chartInstance->c1_tp_CheckDrugWhileInfusing = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_EmptyReservoir) {
      chartInstance->c1_tp_EmptyReservoir = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_EmptyReservoir;
    } else {
      chartInstance->c1_tp_EmptyReservoir = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_InfusionPaused) {
      chartInstance->c1_tp_InfusionPaused = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_InfusionPaused;
    } else {
      chartInstance->c1_tp_InfusionPaused = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_InfusionStopped) {
      chartInstance->c1_tp_InfusionStopped = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
    } else {
      chartInstance->c1_tp_InfusionStopped = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_InfusionSubMachine) {
      chartInstance->c1_tp_InfusionSubMachine = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_InfusionSubMachine;
    } else {
      chartInstance->c1_tp_InfusionSubMachine = 0U;
    }

    if (chartInstance->c1_is_InfusionSubMachine == c1_IN_ALM_NewRateOutBound) {
      chartInstance->c1_tp_ALM_NewRateOutBound = 1U;
      if (sf_mex_sub(chartInstance->c1_setSimStateSideEffectsInfo,
                     "setSimStateSideEffectsInfo", 1, 39) == 0.0) {
        chartInstance->c1_temporalCounter_i1 = 0U;
      }
    } else {
      chartInstance->c1_tp_ALM_NewRateOutBound = 0U;
    }

    if (chartInstance->c1_is_InfusionSubMachine == c1_IN_BolusRequest) {
      chartInstance->c1_tp_BolusRequest = 1U;
    } else {
      chartInstance->c1_tp_BolusRequest = 0U;
    }

    if (chartInstance->c1_is_InfusionSubMachine == c1_IN_ChangeRate) {
      chartInstance->c1_tp_ChangeRate = 1U;
      if (sf_mex_sub(chartInstance->c1_setSimStateSideEffectsInfo,
                     "setSimStateSideEffectsInfo", 1, 41) == 0.0) {
        chartInstance->c1_temporalCounter_i1 = 0U;
      }
    } else {
      chartInstance->c1_tp_ChangeRate = 0U;
    }

    if (chartInstance->c1_is_InfusionSubMachine == c1_IN_CheckNewRate) {
      chartInstance->c1_tp_CheckNewRate = 1U;
      if (sf_mex_sub(chartInstance->c1_setSimStateSideEffectsInfo,
                     "setSimStateSideEffectsInfo", 1, 42) == 0.0) {
        chartInstance->c1_temporalCounter_i1 = 0U;
      }
    } else {
      chartInstance->c1_tp_CheckNewRate = 0U;
    }

    if (chartInstance->c1_is_InfusionSubMachine == c1_IN_ConfirmPause) {
      chartInstance->c1_tp_ConfirmPause = 1U;
      if (sf_mex_sub(chartInstance->c1_setSimStateSideEffectsInfo,
                     "setSimStateSideEffectsInfo", 1, 43) == 0.0) {
        chartInstance->c1_temporalCounter_i1 = 0U;
      }
    } else {
      chartInstance->c1_tp_ConfirmPause = 0U;
    }

    if (chartInstance->c1_is_InfusionSubMachine == c1_IN_ConfirmStop) {
      chartInstance->c1_tp_ConfirmStop = 1U;
      if (sf_mex_sub(chartInstance->c1_setSimStateSideEffectsInfo,
                     "setSimStateSideEffectsInfo", 1, 44) == 0.0) {
        chartInstance->c1_temporalCounter_i1 = 0U;
      }
    } else {
      chartInstance->c1_tp_ConfirmStop = 0U;
    }

    if (chartInstance->c1_is_InfusionSubMachine == c1_IN_Infusing) {
      chartInstance->c1_tp_Infusing = 1U;
      if (sf_mex_sub(chartInstance->c1_setSimStateSideEffectsInfo,
                     "setSimStateSideEffectsInfo", 1, 45) == 0.0) {
        chartInstance->c1_temporalCounter_i1 = 0U;
      }
    } else {
      chartInstance->c1_tp_Infusing = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_LevelTwoAlarming) {
      chartInstance->c1_tp_LevelTwoAlarming = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_LevelTwoAlarming;
    } else {
      chartInstance->c1_tp_LevelTwoAlarming = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_PausedStopConfirm) {
      chartInstance->c1_tp_PausedStopConfirm = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_PausedStopConfirm;
    } else {
      chartInstance->c1_tp_PausedStopConfirm = 0U;
    }

    if (chartInstance->c1_is_InfusionInSession == c1_IN_PausedTooLong) {
      chartInstance->c1_tp_PausedTooLong = 1U;
      chartInstance->c1_was_InfusionInSession = c1_IN_PausedTooLong;
    } else {
      chartInstance->c1_tp_PausedTooLong = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_Init) {
      chartInstance->c1_tp_Init = 1U;
    } else {
      chartInstance->c1_tp_Init = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_LEVELONEALRM) {
      chartInstance->c1_tp_LEVELONEALRM = 1U;
    } else {
      chartInstance->c1_tp_LEVELONEALRM = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_POST) {
      chartInstance->c1_tp_POST = 1U;
    } else {
      chartInstance->c1_tp_POST = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_POSTDONE) {
      chartInstance->c1_tp_POSTDONE = 1U;
    } else {
      chartInstance->c1_tp_POSTDONE = 0U;
    }

    if (chartInstance->c1_is_InfusionStateMachine == c1_IN_PowerOff) {
      chartInstance->c1_tp_PowerOff = 1U;
    } else {
      chartInstance->c1_tp_PowerOff = 0U;
    }

    chartInstance->c1_doSetSimStateSideEffects = 0U;
  }
}

static void finalize_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  sf_mex_destroy(&chartInstance->c1_setSimStateSideEffectsInfo);
}

static void sf_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  int32_T c1_inputEventFiredFlag;
  real_T *c1_ErrCond;
  uint32_T *c1_ClearCond;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  boolean_T *c1_O_BolusRequested;
  real_T *c1_O_ProgrammedVTBI;
  real_T *c1_O_ProgrammedFlowRate;
  uint32_T *c1_O_CurrentState;
  uint32_T *c1_O_AlarmCond;
  int8_T *c1_E_Clock;
  int8_T *c1_E_Alarm;
  int8_T *c1_E_Warning;
  int8_T *c1_E_Ready;
  int8_T *c1_E_NotReady;
  int8_T *c1_E_StartSimulation;
  int8_T *c1_E_PowerButton;
  int8_T *c1_E_NewInfusion;
  int8_T *c1_E_CheckAdminSet;
  int8_T *c1_E_Prime;
  int8_T *c1_E_CheckDrug;
  int8_T *c1_E_ConfigureInfusionProgram;
  int8_T *c1_E_ConfirmConcentration;
  int8_T *c1_E_ConfirmDoseRate;
  int8_T *c1_E_ConfirmVTBI;
  int8_T *c1_E_StartInfusion;
  int8_T *c1_E_ChangeDoseRate;
  int8_T *c1_E_ChangeVTBI;
  int8_T *c1_E_PauseInfusion;
  int8_T *c1_E_ConfirmPauseInfusion;
  int8_T *c1_E_StopInfusion;
  int8_T *c1_E_ConfirmStopInfusion;
  int8_T *c1_E_RequestBolus;
  int8_T *c1_E_ClearAlarm;
  int8_T *c1_E_ConfirmPowerDown;
  int8_T *c1_E_Cancel;
  boolean_T *c1_E_Restart;
  boolean_T *c1_E_AlarmClear;
  boolean_T *c1_E_RequestToStart;
  c1_E_RequestToStart = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 14);
  c1_E_AlarmClear = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 13);
  c1_E_Restart = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 12);
  c1_E_Cancel = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) + 25);
  c1_E_ConfirmPowerDown = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S,
    7) + 24);
  c1_E_ClearAlarm = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) +
    23);
  c1_E_RequestBolus = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7)
    + 22);
  c1_E_ConfirmStopInfusion = (int8_T *)*(ssGetInputPortSignalPtrs
    (chartInstance->S, 7) + 21);
  c1_E_StopInfusion = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7)
    + 20);
  c1_E_ConfirmPauseInfusion = (int8_T *)*(ssGetInputPortSignalPtrs
    (chartInstance->S, 7) + 19);
  c1_E_PauseInfusion = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7)
    + 18);
  c1_E_ChangeVTBI = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) +
    17);
  c1_E_ChangeDoseRate = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7)
    + 16);
  c1_E_StartInfusion = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7)
    + 15);
  c1_E_ConfirmVTBI = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) +
    14);
  c1_E_ConfirmDoseRate = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S,
    7) + 13);
  c1_E_ConfirmConcentration = (int8_T *)*(ssGetInputPortSignalPtrs
    (chartInstance->S, 7) + 12);
  c1_E_ConfigureInfusionProgram = (int8_T *)*(ssGetInputPortSignalPtrs
    (chartInstance->S, 7) + 11);
  c1_E_CheckDrug = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) +
    10);
  c1_E_Prime = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) + 9);
  c1_E_CheckAdminSet = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7)
    + 8);
  c1_E_NewInfusion = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) +
    7);
  c1_E_PowerButton = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) +
    6);
  c1_E_StartSimulation = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S,
    7) + 5);
  c1_E_NotReady = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) + 4);
  c1_E_Ready = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) + 3);
  c1_E_Warning = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) + 2);
  c1_E_Alarm = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) + 1);
  c1_E_Clock = (int8_T *)*(ssGetInputPortSignalPtrs(chartInstance->S, 7) + 0);
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_O_CurrentState = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 7);
  c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c1_O_ProgrammedVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  c1_ClearCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  c1_ErrCond = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
  c1_set_sim_state_side_effects_c1_GPCA_Extension(chartInstance);
  _sfTime_ = (real_T)ssGetT(chartInstance->S);
  _SFD_CC_CALL(CHART_ENTER_SFUNCTION_TAG, 0U, chartInstance->c1_sfEvent);
  _SFD_DATA_RANGE_CHECK(*c1_ErrCond, 0U);
  _SFD_DATA_RANGE_CHECK((real_T)*c1_ClearCond, 1U);
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionInProgress, 2U);
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionPaused, 3U);
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_BolusRequested, 4U);
  _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedVTBI, 5U);
  _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedFlowRate, 6U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_WELCOME, 7U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_POWEROFF, 8U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_POST, 9U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_POSTFAIL, 10U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_ADMINCHECK, 11U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_ADMINFAIL, 12U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_PRIME, 13U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_PRIMEFAIL, 14U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CHECKTYPE, 15U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_WRONGDRUG, 16U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CHECKDU, 17U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_WRONGDU, 18U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CHECKCON, 19U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_WRONGCON, 20U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DANGECON, 21U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_PATIENTINFO, 22U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CHANGEVTBI, 23U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_VTBI, 24U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CHECKVTBI, 25U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_ALMVTBI, 26U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DISPLAYDR, 27U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CHECKDR, 28U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CHANGEDR, 29U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DISPLAYSET, 30U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_ALRMDR, 31U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_INFUSING, 32U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DANGERENVTEMP, 33U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DANGERHUMD, 34U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DANGERAP, 35U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_POSTDONE, 36U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DRUGINFO, 37U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_BOLUSGRANT, 38U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_BOLUSDENIED, 39U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_STOPBOLUS, 40U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_EMPTYRESERVOIR, 41U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DOOROPEN, 42U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_AIRINLINE, 43U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_OCCULUSION, 44U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_PAUSETOOLONG, 45U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_FLOWRATEVARY, 46U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_OVERINFUSION, 47U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_UNDERINFUSION, 48U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_LESSTHANKVO, 49U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_RATEEXCEEDCAPACITY, 50U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_REALTIMECLOCK, 51U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_WATCHDOGALERT, 52U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_OUTOFPOWER, 53U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_MEMORYCORRUPT, 54U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CPUFAILURE, 55U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_INFUSIONSTOP, 56U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_SPCHOOSE, 57U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_INFUSIONPAUSED, 58U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CONFIRMPAUSE, 59U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_CONFIRMSTOP, 60U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_STOPPAUSE, 61U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_LOGERR, 62U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_LOWBATT, 63U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_LOWRESR, 64U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_WRNDR, 65U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_WRNVTBI, 66U);
  _SFD_DATA_RANGE_CHECK(chartInstance->c1_temp, 67U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_NOTREADY, 68U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_BLANK, 69U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_WRNBATTERYCHARGE, 70U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_VOLTOUTRANGE, 71U);
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_CurrentState, 72U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_infusing, 84U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
  _SFD_DATA_RANGE_CHECK(chartInstance->c1_vtbi, 86U);
  _SFD_DATA_RANGE_CHECK(chartInstance->c1_doseRate, 87U);
  _SFD_DATA_RANGE_CHECK(chartInstance->c1_initDrugReservoirVolume, 88U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_PUMPTOOHOT, 89U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_PAUSELONG, 90U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_PUMPOVERHEAT, 91U);
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_MSG_DISPINFU, 92U);
  c1_inputEventFiredFlag = 0;
  if (*c1_E_Clock != 0) {
    c1_inputEventFiredFlag = 1;
    if ((int16_T)chartInstance->c1_temporalCounter_i1 < 3) {
      chartInstance->c1_temporalCounter_i1 = c1__u8_s32_(chartInstance,
        chartInstance->c1_temporalCounter_i1 + 1);
    }

    c1_broadcast_E_Clock(chartInstance);
    if ((int16_T)chartInstance->c1_temporalCounter_i1 == 3) {
      chartInstance->c1_temporalCounter_i1 = 0U;
    }
  }

  if (*c1_E_Alarm == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_Alarm(chartInstance);
  }

  if (*c1_E_Warning == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_Warning(chartInstance);
  }

  if (*c1_E_Ready == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_Ready(chartInstance);
  }

  if (*c1_E_NotReady == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_NotReady(chartInstance);
  }

  if (*c1_E_StartSimulation == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_StartSimulation(chartInstance);
  }

  if (*c1_E_PowerButton == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_PowerButton(chartInstance);
  }

  if (*c1_E_NewInfusion == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_NewInfusion(chartInstance);
  }

  if (*c1_E_CheckAdminSet == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_CheckAdminSet(chartInstance);
  }

  if (*c1_E_Prime == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_Prime(chartInstance);
  }

  if (*c1_E_CheckDrug == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_CheckDrug(chartInstance);
  }

  if (*c1_E_ConfigureInfusionProgram == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_ConfigureInfusionProgram(chartInstance);
  }

  if (*c1_E_ConfirmConcentration == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_ConfirmConcentration(chartInstance);
  }

  if (*c1_E_ConfirmDoseRate == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_ConfirmDoseRate(chartInstance);
  }

  if (*c1_E_ConfirmVTBI == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_ConfirmVTBI(chartInstance);
  }

  if (*c1_E_StartInfusion == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_StartInfusion(chartInstance);
  }

  if (*c1_E_ChangeDoseRate == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_ChangeDoseRate(chartInstance);
  }

  if (*c1_E_ChangeVTBI == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_ChangeVTBI(chartInstance);
  }

  if (*c1_E_PauseInfusion == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_PauseInfusion(chartInstance);
  }

  if (*c1_E_ConfirmPauseInfusion == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_ConfirmPauseInfusion(chartInstance);
  }

  if (*c1_E_StopInfusion == 1) {
    c1_inputEventFiredFlag = 1;
    c1_broadcast_E_StopInfusion(chartInstance);
  }

  if (*c1_E_ConfirmStopInfusion == 1) {
    c1_inputEventFiredFlag = 1;
    chartInstance->c1_sfEvent = c1_event_E_ConfirmStopInfusion;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ConfirmStopInfusion,
                 chartInstance->c1_sfEvent);
    c1_chartstep_c1_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ConfirmStopInfusion,
                 chartInstance->c1_sfEvent);
  }

  if (*c1_E_RequestBolus == 1) {
    c1_inputEventFiredFlag = 1;
    chartInstance->c1_sfEvent = c1_event_E_RequestBolus;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_RequestBolus,
                 chartInstance->c1_sfEvent);
    c1_chartstep_c1_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_RequestBolus,
                 chartInstance->c1_sfEvent);
  }

  if (*c1_E_ClearAlarm == 1) {
    c1_inputEventFiredFlag = 1;
    chartInstance->c1_sfEvent = c1_event_E_ClearAlarm;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ClearAlarm,
                 chartInstance->c1_sfEvent);
    c1_chartstep_c1_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ClearAlarm,
                 chartInstance->c1_sfEvent);
  }

  if (*c1_E_ConfirmPowerDown == 1) {
    c1_inputEventFiredFlag = 1;
    chartInstance->c1_sfEvent = c1_event_E_ConfirmPowerDown;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ConfirmPowerDown,
                 chartInstance->c1_sfEvent);
    c1_chartstep_c1_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ConfirmPowerDown,
                 chartInstance->c1_sfEvent);
  }

  if (*c1_E_Cancel == 1) {
    c1_inputEventFiredFlag = 1;
    chartInstance->c1_sfEvent = c1_event_E_Cancel;
    _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_Cancel,
                 chartInstance->c1_sfEvent);
    c1_chartstep_c1_GPCA_Extension(chartInstance);
    _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_Cancel,
                 chartInstance->c1_sfEvent);
  }

  if (c1_inputEventFiredFlag != 0) {
    if (chartInstance->c1_E_RestartEventCounter > 0U) {
      *c1_E_Restart = !*c1_E_Restart;
      chartInstance->c1_E_RestartEventCounter--;
    }
  }

  if (c1_inputEventFiredFlag != 0) {
    if (chartInstance->c1_E_AlarmClearEventCounter > 0U) {
      *c1_E_AlarmClear = !*c1_E_AlarmClear;
      chartInstance->c1_E_AlarmClearEventCounter--;
    }
  }

  if (c1_inputEventFiredFlag != 0) {
    if (chartInstance->c1_E_RequestToStartEventCounter > 0U) {
      *c1_E_RequestToStart = !*c1_E_RequestToStart;
      chartInstance->c1_E_RequestToStartEventCounter--;
    }
  }

  sf_debug_check_for_state_inconsistency(_GPCA_ExtensionMachineNumber_,
    chartInstance->chartNumber, chartInstance->instanceNumber);
}

static void c1_chartstep_c1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  _SFD_CC_CALL(CHART_ENTER_DURING_FUNCTION_TAG, 0U, chartInstance->c1_sfEvent);
  if (chartInstance->c1_is_active_c1_GPCA_Extension == 0) {
    _SFD_CC_CALL(CHART_ENTER_ENTRY_FUNCTION_TAG, 0U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_active_c1_GPCA_Extension = 1U;
    _SFD_CC_CALL(EXIT_OUT_OF_FUNCTION_TAG, 0U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_c1_GPCA_Extension = c1_IN_InfusionStateMachine;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 0U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionStateMachine = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 132U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 132U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_Init;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 47U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_Init = 1U;
  } else {
    c1_InfusionStateMachine(chartInstance);
  }

  _SFD_CC_CALL(EXIT_OUT_OF_FUNCTION_TAG, 0U, chartInstance->c1_sfEvent);
}

static void initSimStructsc1_GPCA_Extension(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
}

static void c1_DisplayDoseRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d0;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d1;
  boolean_T c1_f_out;
  real_T c1_d2;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 23U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 47U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(47U, (int32_T)_SFD_CCP_CALL(47U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ChangeDoseRate != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 47;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_ConfirmDoseRate);
      if (c1_b_out) {
        transitionList[numTransitions] = 55;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_c_out) {
        transitionList[numTransitions] = 190;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 47U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplayDoseRate = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ChangeDoseRate = 1U;
    c1_enterinto(chartInstance, 24U);
    c1_d0 = (real_T)c1_const_MSG_CHANGEDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d0, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 55U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(55U, (int32_T)_SFD_CCP_CALL(55U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ConfirmDoseRate != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 55;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
        if (c1_e_out) {
          transitionList[numTransitions] = 190;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 55U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayDoseRate = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplaySettings;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplaySettings;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplaySettings = 1U;
      c1_enterinto(chartInstance, 27U);
      c1_d1 = (real_T)c1_const_MSG_DISPLAYSET;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d1, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 190U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(190U, (int32_T)_SFD_CCP_CALL(190U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 190U, chartInstance->c1_sfEvent);
        c1_warning(chartInstance);
        chartInstance->c1_tp_DisplayDoseRate = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
        chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_DisplayDoseRate = 1U;
        c1_enterinto(chartInstance, 23U);
        c1_d2 = (real_T)c1_const_MSG_DISPLAYDR;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d2, 0, 0U,
          0U, 0U, 0), 0);
        chartInstance->c1_tempx = 0U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
        c1_setDoseRate(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 24));
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 23U, chartInstance->c1_sfEvent);
}

static void c1_ConfirmPowerDown(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_b_temp;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_c_temp;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  boolean_T c1_g_out;
  boolean_T c1_d_temp;
  boolean_T c1_h_out;
  boolean_T c1_i_out;
  boolean_T c1_e_temp;
  boolean_T c1_j_out;
  real_T c1_d3;
  boolean_T c1_k_out;
  boolean_T c1_l_out;
  real_T c1_d4;
  boolean_T c1_m_out;
  real_T c1_d5;
  uint32_T *c1_O_AlarmCond;
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 29U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 50U, chartInstance->c1_sfEvent);
  c1_b_temp = (_SFD_CCP_CALL(50U, 0, chartInstance->c1_sfEvent ==
    c1_event_E_Cancel != 0U, chartInstance->c1_sfEvent) != 0);
  if (c1_b_temp) {
    c1_b_temp = (_SFD_CCP_CALL(50U, 1, chartInstance->c1_tempx == 3U != 0U,
      chartInstance->c1_sfEvent) != 0);
  }

  c1_out = (CV_TRANSITION_EVAL(50U, (int32_T)c1_b_temp) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[4];
      unsigned int numTransitions = 1;
      transitionList[0] = 50;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = ((chartInstance->c1_sfEvent == c1_event_E_Cancel) &&
                  (chartInstance->c1_tempx == 2U));
      if (c1_b_out) {
        transitionList[numTransitions] = 46;
        numTransitions++;
      }

      c1_c_out = ((chartInstance->c1_sfEvent == c1_event_E_Cancel) &&
                  (chartInstance->c1_tempx == 1U));
      if (c1_c_out) {
        transitionList[numTransitions] = 7;
        numTransitions++;
      }

      c1_d_out = ((chartInstance->c1_sfEvent == c1_event_E_Cancel) &&
                  (chartInstance->c1_tempx == 4U));
      if (c1_d_out) {
        transitionList[numTransitions] = 154;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ConfirmPowerDown = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_InfusionInSession;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 30U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionInSession = 1U;
    c1_enter_internal_InfusionInSession(chartInstance);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 46U,
                 chartInstance->c1_sfEvent);
    c1_c_temp = (_SFD_CCP_CALL(46U, 0, chartInstance->c1_sfEvent ==
      c1_event_E_Cancel != 0U, chartInstance->c1_sfEvent) != 0);
    if (c1_c_temp) {
      c1_c_temp = (_SFD_CCP_CALL(46U, 1, chartInstance->c1_tempx == 2U != 0U,
        chartInstance->c1_sfEvent) != 0);
    }

    c1_e_out = (CV_TRANSITION_EVAL(46U, (int32_T)c1_c_temp) != 0);
    if (c1_e_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[3];
        unsigned int numTransitions = 1;
        transitionList[0] = 46;
        sf_debug_transition_conflict_check_begin();
        c1_f_out = ((chartInstance->c1_sfEvent == c1_event_E_Cancel) &&
                    (chartInstance->c1_tempx == 1U));
        if (c1_f_out) {
          transitionList[numTransitions] = 7;
          numTransitions++;
        }

        c1_g_out = ((chartInstance->c1_sfEvent == c1_event_E_Cancel) &&
                    (chartInstance->c1_tempx == 4U));
        if (c1_g_out) {
          transitionList[numTransitions] = 154;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ConfirmPowerDown = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionStateMachine = c1_IN_ConfigureInfusionProgram;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 16U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ConfigureInfusionProgram = 1U;
      c1_enter_internal_ConfigureInfusionProgram(chartInstance);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 7U,
                   chartInstance->c1_sfEvent);
      c1_d_temp = (_SFD_CCP_CALL(7U, 0, chartInstance->c1_sfEvent ==
        c1_event_E_Cancel != 0U, chartInstance->c1_sfEvent) != 0);
      if (c1_d_temp) {
        c1_d_temp = (_SFD_CCP_CALL(7U, 1, chartInstance->c1_tempx == 1U != 0U,
          chartInstance->c1_sfEvent) != 0);
      }

      c1_h_out = (CV_TRANSITION_EVAL(7U, (int32_T)c1_d_temp) != 0);
      if (c1_h_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 7;
          sf_debug_transition_conflict_check_begin();
          c1_i_out = ((chartInstance->c1_sfEvent == c1_event_E_Cancel) &&
                      (chartInstance->c1_tempx == 4U));
          if (c1_i_out) {
            transitionList[numTransitions] = 154;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ConfirmPowerDown = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionStateMachine = c1_IN_CheckDrugRoutine;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_CheckDrugRoutine = 1U;
        c1_enter_internal_CheckDrugRoutine(chartInstance);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 154U,
                     chartInstance->c1_sfEvent);
        c1_e_temp = (_SFD_CCP_CALL(154U, 0, chartInstance->c1_sfEvent ==
          c1_event_E_Cancel != 0U, chartInstance->c1_sfEvent) != 0);
        if (c1_e_temp) {
          c1_e_temp = (_SFD_CCP_CALL(154U, 1, chartInstance->c1_tempx == 4U !=
            0U, chartInstance->c1_sfEvent) != 0);
        }

        c1_j_out = (CV_TRANSITION_EVAL(154U, (int32_T)c1_e_temp) != 0);
        if (c1_j_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 154U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_ConfirmPowerDown = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionStateMachine = c1_IN_POSTDONE;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_POSTDONE = 1U;
          c1_d3 = (real_T)c1_const_MSG_POSTDONE;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d3, 0, 0U,
            0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 45U);
          chartInstance->c1_tempx = 0U;
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 96U,
                       chartInstance->c1_sfEvent);
          c1_k_out = (CV_TRANSITION_EVAL(96U, (int32_T)_SFD_CCP_CALL(96U, 0,
            chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_k_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[2];
              unsigned int numTransitions = 1;
              transitionList[0] = 96;
              sf_debug_transition_conflict_check_begin();
              c1_l_out = (chartInstance->c1_sfEvent ==
                          c1_event_E_ConfirmPowerDown);
              if (c1_l_out) {
                transitionList[numTransitions] = 27;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 96U, chartInstance->c1_sfEvent);
            c1_warning(chartInstance);
            chartInstance->c1_tp_ConfirmPowerDown = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionStateMachine = c1_IN_ConfirmPowerDown;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ConfirmPowerDown = 1U;
            c1_enterinto(chartInstance, 2U);
            c1_d4 = (real_T)c1_const_MSG_POWEROFF;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d4, 0,
              0U, 0U, 0U, 0), 0);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 27U,
                         chartInstance->c1_sfEvent);
            c1_m_out = (CV_TRANSITION_EVAL(27U, (int32_T)_SFD_CCP_CALL(27U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ConfirmPowerDown != 0U,
              chartInstance->c1_sfEvent)) != 0);
            if (c1_m_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 27U, chartInstance->c1_sfEvent);
              *c1_O_AlarmCond = 0U;
              _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
              c1_d5 = (real_T)c1_const_MSG_BLANK;
              sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d5, 0, 0U,
                0U, 0U, 0), 0);
              chartInstance->c1_tp_ConfirmPowerDown = 0U;
              _SFD_CS_CALL(STATE_INACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
              chartInstance->c1_is_InfusionStateMachine = c1_IN_PowerOff;
              _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c1_sfEvent);
              chartInstance->c1_tp_PowerOff = 1U;
              c1_enterinto(chartInstance, 1U);
            }
          }
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 29U, chartInstance->c1_sfEvent);
}

static void c1_PowerOff(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  real_T c1_x;
  real_T c1_b_x;
  real_T c1_c_x;
  real_T c1_d6;
  real_T c1_d7;
  uint32_T *c1_ClearCond;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  boolean_T *c1_O_BolusRequested;
  real_T *c1_O_ProgrammedVTBI;
  real_T *c1_O_ProgrammedFlowRate;
  uint32_T *c1_O_CurrentState;
  uint32_T *c1_O_AlarmCond;
  c1_DrugLibrary *c1_O_DrugLibInfo;
  c1_PatientInformation *c1_O_PatientInfo;
  c1_PumpConfigurationsStatus *c1_pumpConfigData;
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_O_PatientInfo = (c1_PatientInformation *)ssGetOutputPortSignal
    (chartInstance->S, 9);
  c1_O_DrugLibInfo = (c1_DrugLibrary *)ssGetOutputPortSignal(chartInstance->S, 8);
  c1_pumpConfigData = (c1_PumpConfigurationsStatus *)ssGetInputPortSignal
    (chartInstance->S, 6);
  c1_O_CurrentState = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 7);
  c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c1_O_ProgrammedVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  c1_ClearCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 51U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 5U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(5U, (int32_T)_SFD_CCP_CALL(5U, 0,
              chartInstance->c1_sfEvent == c1_event_E_PowerButton != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
    sf_debug_symbol_scope_push(1U, 0U);
    sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
      c1_f_sf_marshallIn);
    _SFD_SET_DATA_VALUE_PTR(95U, &c1_x);
    _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 67U, chartInstance->c1_sfEvent);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 67U, chartInstance->c1_sfEvent);
    c1_x = 0.0;
    _SFD_DATA_RANGE_CHECK(c1_x, 95U);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 165U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 165U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 221U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 221U, chartInstance->c1_sfEvent);
    *c1_ClearCond = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_ClearCond, 1U);
    *c1_O_InfusionInProgress = FALSE;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionInProgress, 2U);
    *c1_O_InfusionPaused = FALSE;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionPaused, 3U);
    *c1_O_BolusRequested = FALSE;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_BolusRequested, 4U);
    *c1_O_ProgrammedVTBI = 0.0;
    _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedVTBI, 5U);
    *c1_O_ProgrammedFlowRate = 0.0;
    _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedFlowRate, 6U);
    *c1_O_CurrentState = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_CurrentState, 72U);
    *c1_O_AlarmCond = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
    sf_debug_symbol_scope_push(1U, 0U);
    sf_debug_symbol_scope_add_importable("x", &c1_b_x, c1_e_sf_marshallOut,
      c1_f_sf_marshallIn);
    _SFD_SET_DATA_VALUE_PTR(97U, &c1_b_x);
    _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 68U, chartInstance->c1_sfEvent);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 68U, chartInstance->c1_sfEvent);
    c1_b_x = 0.0;
    _SFD_DATA_RANGE_CHECK(c1_b_x, 97U);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 224U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 224U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 6U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
    *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 0) = 0U;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 8) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 16) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 24) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 32) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 40) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 48) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 56) = 0.0;
    *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 64) = 0U;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 72) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 80) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 88) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 96) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 104) = 0.0;
    *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 112) = 0U;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 120) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 128) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 136) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 144) = 0.0;
    *(real_T *)((char_T *)c1_O_DrugLibInfo + 152) = 0.0;
    _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 68U, chartInstance->c1_sfEvent);
    _SFD_UNSET_DATA_VALUE_PTR(97U);
    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 68U, chartInstance->c1_sfEvent);
    sf_debug_symbol_scope_pop();
    sf_debug_symbol_scope_push(1U, 0U);
    sf_debug_symbol_scope_add_importable("x", &c1_c_x, c1_e_sf_marshallOut,
      c1_f_sf_marshallIn);
    _SFD_SET_DATA_VALUE_PTR(98U, &c1_c_x);
    _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 71U, chartInstance->c1_sfEvent);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 71U, chartInstance->c1_sfEvent);
    c1_c_x = 0.0;
    _SFD_DATA_RANGE_CHECK(c1_c_x, 98U);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 92U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 92U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 84U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 84U, chartInstance->c1_sfEvent);
    *(uint32_T *)((char_T *)c1_O_PatientInfo + 0) = 0U;
    *(uint32_T *)((char_T *)c1_O_PatientInfo + 4) = 0U;
    *(uint32_T *)((char_T *)c1_O_PatientInfo + 8) = 0U;
    *(uint32_T *)((char_T *)c1_O_PatientInfo + 12) = 0U;
    _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 71U, chartInstance->c1_sfEvent);
    _SFD_UNSET_DATA_VALUE_PTR(98U);
    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 71U, chartInstance->c1_sfEvent);
    sf_debug_symbol_scope_pop();
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 156U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 156U, chartInstance->c1_sfEvent);
    chartInstance->c1_temp = 0.0;
    _SFD_DATA_RANGE_CHECK(chartInstance->c1_temp, 67U);
    chartInstance->c1_tempx = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    chartInstance->c1_infusing = FALSE;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_infusing, 84U);
    chartInstance->c1_bolusing = FALSE;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
    _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 67U, chartInstance->c1_sfEvent);
    _SFD_UNSET_DATA_VALUE_PTR(95U);
    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 67U, chartInstance->c1_sfEvent);
    sf_debug_symbol_scope_pop();
    c1_d6 = (real_T)c1_const_MSG_POST;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d6, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tp_PowerOff = 0U;
    _SFD_CS_CALL(STATE_ENTER_EXIT_FUNCTION_TAG, 51U, chartInstance->c1_sfEvent);
    c1_d7 = (real_T)c1_const_MSG_WELCOME;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d7, 0, 0U, 0U,
      0U, 0), 0);
    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 51U, chartInstance->c1_sfEvent);
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 51U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_POST;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 49U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_POST = 1U;
    c1_enterinto(chartInstance, 3U);
    chartInstance->c1_tempx = (uint32_T)*(boolean_T *)((char_T *)
      c1_pumpConfigData + 0);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 51U, chartInstance->c1_sfEvent);
}

static void c1_PrimeFailed(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  real_T c1_d8;
  boolean_T c1_c_out;
  real_T c1_d9;
  c1_PumpConfigurationsStatus *c1_pumpConfigData;
  c1_pumpConfigData = (c1_PumpConfigurationsStatus *)ssGetInputPortSignal
    (chartInstance->S, 6);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 12U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 195U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(195U, (int32_T)_SFD_CCP_CALL(195U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 195;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_Prime);
      if (c1_b_out) {
        transitionList[numTransitions] = 37;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 195U, chartInstance->c1_sfEvent);
    c1_warning(chartInstance);
    chartInstance->c1_tp_PrimeFailed = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_PrimeFailed;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_PrimeFailed;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_PrimeFailed = 1U;
    c1_enterinto(chartInstance, 8U);
    c1_d8 = (real_T)c1_const_MSG_PRIMEFAIL;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d8, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 37U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(37U, (int32_T)_SFD_CCP_CALL(37U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Prime != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_PrimeFailed = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckPrime;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckPrime;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_CheckPrime = 1U;
      c1_enterinto(chartInstance, 7U);
      chartInstance->c1_tempx = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
      c1_d9 = (real_T)c1_const_MSG_PRIME;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d9, 0, 0U, 0U,
        0U, 0), 0);
      chartInstance->c1_tempx = (uint32_T)*(boolean_T *)((char_T *)
        c1_pumpConfigData + 1);
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 12U, chartInstance->c1_sfEvent);
}

static void c1_DisplayDrugInfo(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  real_T c1_d10;
  boolean_T c1_c_out;
  real_T c1_d11;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 9U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 41U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(41U, (int32_T)_SFD_CCP_CALL(41U, 0,
              chartInstance->c1_sfEvent == c1_event_E_CheckDrug != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 41;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_b_out) {
        transitionList[numTransitions] = 95;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplayDrugInfo = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDrug_CheckType = 1U;
    c1_enterinto(chartInstance, 10U);
    c1_d10 = (real_T)c1_const_MSG_CHECKTYPE;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d10, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = c1_checkDrugType(chartInstance);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 95U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(95U, (int32_T)_SFD_CCP_CALL(95U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 95U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_DisplayDrugInfo = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayDrugInfo = 1U;
      c1_enterinto(chartInstance, 9U);
      chartInstance->c1_tempx = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
      c1_d11 = (real_T)c1_const_MSG_DRUGINFO;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d11, 0, 0U, 0U,
        0U, 0), 0);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 9U, chartInstance->c1_sfEvent);
}

static void c1_UnknownDrug(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  real_T c1_d12;
  boolean_T c1_c_out;
  real_T c1_d13;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 13U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 65U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(65U, (int32_T)_SFD_CCP_CALL(65U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 65;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_CheckDrug);
      if (c1_b_out) {
        transitionList[numTransitions] = 3;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 65U, chartInstance->c1_sfEvent);
    c1_warning(chartInstance);
    chartInstance->c1_tp_UnknownDrug = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_UnknownDrug;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_UnknownDrug;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_UnknownDrug = 1U;
    c1_enterinto(chartInstance, 11U);
    c1_d12 = (real_T)c1_const_MSG_WRONGDRUG;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d12, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 3U, chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(3U, (int32_T)_SFD_CCP_CALL(3U, 0,
      chartInstance->c1_sfEvent == c1_event_E_CheckDrug != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_UnknownDrug = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_CheckDrug_CheckType = 1U;
      c1_enterinto(chartInstance, 10U);
      c1_d13 = (real_T)c1_const_MSG_CHECKTYPE;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d13, 0, 0U, 0U,
        0U, 0), 0);
      chartInstance->c1_tempx = c1_checkDrugType(chartInstance);
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 13U, chartInstance->c1_sfEvent);
}

static void c1_Check_DrugUnits(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  real_T c1_d14;
  boolean_T c1_c_out;
  real_T c1_d15;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 8U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 13U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(13U, (int32_T)_SFD_CCP_CALL(13U, 0,
              chartInstance->c1_tempx != 0U != 0U, chartInstance->c1_sfEvent))
            != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 13;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_tempx == 0U);
      if (c1_b_out) {
        transitionList[numTransitions] = 15;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_Check_DrugUnits = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 8U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_IncorrectDrugUnits;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_IncorrectDrugUnits;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_IncorrectDrugUnits = 1U;
    c1_enterinto(chartInstance, 13U);
    c1_d14 = (real_T)c1_const_MSG_WRONGDU;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d14, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 15U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(15U, (int32_T)_SFD_CCP_CALL(15U, 0,
      chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_Check_DrugUnits = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 8U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_Check_Concen;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_Check_Concen;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_Check_Concen = 1U;
      c1_enterinto(chartInstance, 14U);
      c1_d15 = (real_T)c1_const_MSG_CHECKCON;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d15, 0, 0U, 0U,
        0U, 0), 0);
      chartInstance->c1_tempx = (uint32_T)c1_checkDrugConcentration
        (chartInstance);
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 8U, chartInstance->c1_sfEvent);
}

static void c1_IncorrectDrugUnits(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  real_T c1_d16;
  boolean_T c1_c_out;
  real_T c1_d17;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 11U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 14U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(14U, (int32_T)_SFD_CCP_CALL(14U, 0,
              chartInstance->c1_sfEvent == c1_event_E_CheckDrug != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 14;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_b_out) {
        transitionList[numTransitions] = 199;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_IncorrectDrugUnits = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDrug_CheckType = 1U;
    c1_enterinto(chartInstance, 10U);
    c1_d16 = (real_T)c1_const_MSG_CHECKTYPE;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d16, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = c1_checkDrugType(chartInstance);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 199U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(199U, (int32_T)_SFD_CCP_CALL(199U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 199U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_IncorrectDrugUnits = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_IncorrectDrugUnits;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_IncorrectDrugUnits;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_IncorrectDrugUnits = 1U;
      c1_enterinto(chartInstance, 13U);
      c1_d17 = (real_T)c1_const_MSG_WRONGDU;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d17, 0, 0U, 0U,
        0U, 0), 0);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 11U, chartInstance->c1_sfEvent);
}

static void c1_Check_Concen(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d18;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d19;
  boolean_T c1_f_out;
  real_T c1_d20;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 7U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 9U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(9U, (int32_T)_SFD_CCP_CALL(9U, 0,
              chartInstance->c1_tempx == 2U != 0U, chartInstance->c1_sfEvent))
            != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 9;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_tempx == 1U);
      if (c1_b_out) {
        transitionList[numTransitions] = 21;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_tempx == 0U);
      if (c1_c_out) {
        transitionList[numTransitions] = 24;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_Check_Concen = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_WrongConcentration;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_WrongConcentration;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WrongConcentration = 1U;
    c1_enterinto(chartInstance, 15U);
    c1_d18 = (real_T)c1_const_MSG_WRONGCON;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d18, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 21U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(21U, (int32_T)_SFD_CCP_CALL(21U, 0,
      chartInstance->c1_tempx == 1U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 21;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_tempx == 0U);
        if (c1_e_out) {
          transitionList[numTransitions] = 24;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_Check_Concen = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_WRN_DangerCon;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_WRN_DangerCon;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_WRN_DangerCon = 1U;
      c1_enterinto(chartInstance, 16U);
      c1_d19 = (real_T)c1_const_MSG_DANGECON;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d19, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 24U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(24U, (int32_T)_SFD_CCP_CALL(24U, 0,
        chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
        c1_setPatientInfo(chartInstance);
        chartInstance->c1_tp_Check_Concen = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
        chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_DisplayPatientProfile = 1U;
        c1_enterinto(chartInstance, 18U);
        c1_d20 = (real_T)c1_const_MSG_PATIENTINFO;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d20, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 7U, chartInstance->c1_sfEvent);
}

static void c1_WrongConcentration(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  real_T c1_d21;
  boolean_T c1_c_out;
  real_T c1_d22;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 15U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 68U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(68U, (int32_T)_SFD_CCP_CALL(68U, 0,
              chartInstance->c1_sfEvent == c1_event_E_CheckDrug != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 68;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_b_out) {
        transitionList[numTransitions] = 71;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 68U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WrongConcentration = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDrug_CheckType = 1U;
    c1_enterinto(chartInstance, 10U);
    c1_d21 = (real_T)c1_const_MSG_CHECKTYPE;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d21, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = c1_checkDrugType(chartInstance);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 71U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(71U, (int32_T)_SFD_CCP_CALL(71U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 71U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_WrongConcentration = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_WrongConcentration;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_WrongConcentration;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_WrongConcentration = 1U;
      c1_enterinto(chartInstance, 15U);
      c1_d22 = (real_T)c1_const_MSG_WRONGCON;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d22, 0, 0U, 0U,
        0U, 0), 0);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 15U, chartInstance->c1_sfEvent);
}

static void c1_WRN_DangerCon(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d23;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d24;
  boolean_T c1_f_out;
  real_T c1_d25;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 14U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 155U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(155U, (int32_T)_SFD_CCP_CALL(155U, 0,
              chartInstance->c1_sfEvent == c1_event_E_CheckDrug != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 155;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_ConfirmConcentration);
      if (c1_b_out) {
        transitionList[numTransitions] = 30;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_c_out) {
        transitionList[numTransitions] = 115;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 155U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WRN_DangerCon = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDrug_CheckType = 1U;
    c1_enterinto(chartInstance, 10U);
    c1_d23 = (real_T)c1_const_MSG_CHECKTYPE;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d23, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = c1_checkDrugType(chartInstance);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 30U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(30U, (int32_T)_SFD_CCP_CALL(30U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ConfirmConcentration != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 30;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
        if (c1_e_out) {
          transitionList[numTransitions] = 115;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 30U, chartInstance->c1_sfEvent);
      c1_setPatientInfo(chartInstance);
      chartInstance->c1_tp_WRN_DangerCon = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayPatientProfile = 1U;
      c1_enterinto(chartInstance, 18U);
      c1_d24 = (real_T)c1_const_MSG_PATIENTINFO;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d24, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 115U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(115U, (int32_T)_SFD_CCP_CALL(115U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 115U, chartInstance->c1_sfEvent);
        c1_warning(chartInstance);
        chartInstance->c1_tp_WRN_DangerCon = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_CheckDrugRoutine = c1_IN_WRN_DangerCon;
        chartInstance->c1_was_CheckDrugRoutine = c1_IN_WRN_DangerCon;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_WRN_DangerCon = 1U;
        c1_enterinto(chartInstance, 16U);
        c1_d25 = (real_T)c1_const_MSG_DANGECON;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d25, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 14U, chartInstance->c1_sfEvent);
}

static void c1_DisplayPatientProfile(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  real_T c1_d26;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d27;
  boolean_T c1_d_out;
  real_T c1_d28;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 10U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 183U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(183U, (int32_T)_SFD_CCP_CALL(183U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ConfigureInfusionProgram
              != 0U, chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 183U, chartInstance->c1_sfEvent);
    c1_setDrugLibInfo(chartInstance);
    chartInstance->c1_tp_DisplayPatientProfile = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDrugRoutine = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_ConfigureInfusionProgram;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 16U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ConfigureInfusionProgram = 1U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplayVTBI = 1U;
    c1_enterinto(chartInstance, 19U);
    c1_d26 = (real_T)c1_const_MSG_VTBI;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d26, 0, 0U, 0U,
      0U, 0), 0);
    c1_setVTBI(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 72));
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 174U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(174U, (int32_T)_SFD_CCP_CALL(174U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 174;
        sf_debug_transition_conflict_check_begin();
        c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
        if (c1_c_out) {
          transitionList[numTransitions] = 40;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 174U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_DisplayPatientProfile = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
      chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayPatientProfile = 1U;
      c1_enterinto(chartInstance, 18U);
      c1_d27 = (real_T)c1_const_MSG_PATIENTINFO;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d27, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 40U,
                   chartInstance->c1_sfEvent);
      c1_d_out = (CV_TRANSITION_EVAL(40U, (int32_T)_SFD_CCP_CALL(40U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 40U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_DisplayPatientProfile = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
        chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_DisplayDrugInfo = 1U;
        c1_enterinto(chartInstance, 9U);
        chartInstance->c1_tempx = 0U;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
        c1_d28 = (real_T)c1_const_MSG_DRUGINFO;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d28, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 10U, chartInstance->c1_sfEvent);
}

static void c1_DisplayVTBI(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d29;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d30;
  boolean_T c1_f_out;
  real_T c1_d31;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 25U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 26U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(26U, (int32_T)_SFD_CCP_CALL(26U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ChangeVTBI != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 26;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_ConfirmVTBI);
      if (c1_b_out) {
        transitionList[numTransitions] = 42;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_c_out) {
        transitionList[numTransitions] = 82;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplayVTBI = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ChangeVTBI = 1U;
    c1_enterinto(chartInstance, 20U);
    c1_d29 = (real_T)c1_const_MSG_CHANGEVTBI;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d29, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 42U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(42U, (int32_T)_SFD_CCP_CALL(42U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ConfirmVTBI != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 42;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
        if (c1_e_out) {
          transitionList[numTransitions] = 82;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayVTBI = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayDoseRate = 1U;
      c1_enterinto(chartInstance, 23U);
      c1_d30 = (real_T)c1_const_MSG_DISPLAYDR;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d30, 0, 0U, 0U,
        0U, 0), 0);
      chartInstance->c1_tempx = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
      c1_setDoseRate(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 24));
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 82U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(82U, (int32_T)_SFD_CCP_CALL(82U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 82U, chartInstance->c1_sfEvent);
        c1_warning(chartInstance);
        chartInstance->c1_tp_DisplayVTBI = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
        chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_DisplayVTBI = 1U;
        c1_enterinto(chartInstance, 19U);
        c1_d31 = (real_T)c1_const_MSG_VTBI;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d31, 0, 0U,
          0U, 0U, 0), 0);
        c1_setVTBI(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 72));
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 25U, chartInstance->c1_sfEvent);
}

static void c1_ChangeVTBI(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d32;
  boolean_T c1_f_out;
  real_T c1_d33;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 20U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 22U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(22U, (int32_T)_SFD_CCP_CALL(22U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ConfirmVTBI != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 22;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
      if (c1_b_out) {
        transitionList[numTransitions] = 29;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_c_out) {
        transitionList[numTransitions] = 198;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ChangeVTBI = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_CheckVTBI;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_CheckVTBI;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckVTBI = 1U;
    c1_enter_atomic_CheckVTBI(chartInstance);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 29U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(29U, (int32_T)_SFD_CCP_CALL(29U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 29;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
        if (c1_e_out) {
          transitionList[numTransitions] = 198;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ChangeVTBI = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayVTBI = 1U;
      c1_enterinto(chartInstance, 19U);
      c1_d32 = (real_T)c1_const_MSG_VTBI;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d32, 0, 0U, 0U,
        0U, 0), 0);
      c1_setVTBI(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 72));
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 198U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(198U, (int32_T)_SFD_CCP_CALL(198U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 198U, chartInstance->c1_sfEvent);
        c1_warning(chartInstance);
        chartInstance->c1_tp_ChangeVTBI = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
        chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ChangeVTBI = 1U;
        c1_enterinto(chartInstance, 20U);
        c1_d33 = (real_T)c1_const_MSG_CHANGEVTBI;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d33, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 20U, chartInstance->c1_sfEvent);
}

static void c1_enter_atomic_CheckVTBI(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  real_T c1_d34;
  real_T c1_inputVal;
  uint32_T c1_x;
  boolean_T c1_b_temp;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_temp;
  boolean_T c1_c_out;
  boolean_T c1_d_temp;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_e_temp;
  boolean_T c1_f_out;
  c1_InfusionParameters *c1_infuParameters;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
    (chartInstance->S, 4);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  c1_enterinto(chartInstance, 21U);
  c1_d34 = (real_T)c1_const_MSG_CHECKVTBI;
  sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d34, 0, 0U, 0U, 0U,
    0), 0);
  c1_inputVal = *(real_T *)((char_T *)c1_infuParameters + 0);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("inputVal", &c1_inputVal,
    c1_e_sf_marshallOut, c1_f_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK(c1_inputVal, 116U);
  _SFD_SET_DATA_VALUE_PTR(117U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(116U, &c1_inputVal);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 60U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 60U, chartInstance->c1_sfEvent);
  c1_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x, 117U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 20U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 186U, chartInstance->c1_sfEvent);
  c1_b_temp = (_SFD_CCP_CALL(186U, 0, c1_inputVal > *(real_T *)((char_T *)
    c1_drugLibInfo + 80) != 0U, chartInstance->c1_sfEvent) != 0);
  if (!c1_b_temp) {
    c1_b_temp = (_SFD_CCP_CALL(186U, 1, c1_inputVal < *(real_T *)((char_T *)
      c1_drugLibInfo + 96) != 0U, chartInstance->c1_sfEvent) != 0);
  }

  c1_out = (CV_TRANSITION_EVAL(186U, (int32_T)c1_b_temp) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 186;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = ((c1_inputVal <= *(real_T *)((char_T *)c1_drugLibInfo + 80)) &&
                  (c1_inputVal >= *(real_T *)((char_T *)c1_drugLibInfo + 96)));
      if (c1_b_out) {
        transitionList[numTransitions] = 194;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 186U, chartInstance->c1_sfEvent);
    c1_x = 2U;
    _SFD_DATA_RANGE_CHECK((real_T)c1_x, 117U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 194U,
                 chartInstance->c1_sfEvent);
    c1_c_temp = (_SFD_CCP_CALL(194U, 0, c1_inputVal <= *(real_T *)((char_T *)
      c1_drugLibInfo + 80) != 0U, chartInstance->c1_sfEvent) != 0);
    if (c1_c_temp) {
      c1_c_temp = (_SFD_CCP_CALL(194U, 1, c1_inputVal >= *(real_T *)((char_T *)
        c1_drugLibInfo + 96) != 0U, chartInstance->c1_sfEvent) != 0);
    }

    c1_c_out = (CV_TRANSITION_EVAL(194U, (int32_T)c1_c_temp) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 194U, chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 76U,
                   chartInstance->c1_sfEvent);
      c1_d_temp = (_SFD_CCP_CALL(76U, 0, c1_inputVal > *(real_T *)((char_T *)
        c1_drugLibInfo + 88) != 0U, chartInstance->c1_sfEvent) != 0);
      if (!c1_d_temp) {
        c1_d_temp = (_SFD_CCP_CALL(76U, 1, c1_inputVal < *(real_T *)((char_T *)
          c1_drugLibInfo + 104) != 0U, chartInstance->c1_sfEvent) != 0);
      }

      c1_d_out = (CV_TRANSITION_EVAL(76U, (int32_T)c1_d_temp) != 0);
      if (c1_d_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 76;
          sf_debug_transition_conflict_check_begin();
          c1_e_out = ((c1_inputVal <= *(real_T *)((char_T *)c1_drugLibInfo + 88))
                      && (c1_inputVal <= *(real_T *)((char_T *)c1_drugLibInfo +
            104)));
          if (c1_e_out) {
            transitionList[numTransitions] = 66;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 76U, chartInstance->c1_sfEvent);
        c1_x = 1U;
        _SFD_DATA_RANGE_CHECK((real_T)c1_x, 117U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 66U,
                     chartInstance->c1_sfEvent);
        c1_e_temp = (_SFD_CCP_CALL(66U, 0, c1_inputVal <= *(real_T *)((char_T *)
          c1_drugLibInfo + 88) != 0U, chartInstance->c1_sfEvent) != 0);
        if (c1_e_temp) {
          c1_e_temp = (_SFD_CCP_CALL(66U, 1, c1_inputVal <= *(real_T *)((char_T *)
            c1_drugLibInfo + 104) != 0U, chartInstance->c1_sfEvent) != 0);
        }

        c1_f_out = (CV_TRANSITION_EVAL(66U, (int32_T)c1_e_temp) != 0);
        if (c1_f_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 66U, chartInstance->c1_sfEvent);
          c1_x = 0U;
          _SFD_DATA_RANGE_CHECK((real_T)c1_x, 117U);
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 60U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(117U);
  _SFD_UNSET_DATA_VALUE_PTR(116U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 60U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  chartInstance->c1_tempx = c1_x;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
}

static void c1_CheckVTBI(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d35;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d36;
  boolean_T c1_f_out;
  real_T c1_d37;
  c1_InfusionParameters *c1_infuParameters;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
    (chartInstance->S, 4);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 22U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 175U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(175U, (int32_T)_SFD_CCP_CALL(175U, 0,
              chartInstance->c1_tempx == 1U != 0U, chartInstance->c1_sfEvent))
            != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 175;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_tempx == 0U);
      if (c1_b_out) {
        transitionList[numTransitions] = 18;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_tempx == 2U);
      if (c1_c_out) {
        transitionList[numTransitions] = 11;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 175U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckVTBI = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_WRN_VTBIOutBound;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_WRN_VTBIOutBound;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WRN_VTBIOutBound = 1U;
    c1_enterinto(chartInstance, 46U);
    c1_d35 = (real_T)c1_const_MSG_WRNVTBI;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d35, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 18U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(18U, (int32_T)_SFD_CCP_CALL(18U, 0,
      chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 18;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_tempx == 2U);
        if (c1_e_out) {
          transitionList[numTransitions] = 11;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
      c1_setVTBI(chartInstance, *(real_T *)((char_T *)c1_infuParameters + 0));
      chartInstance->c1_tp_CheckVTBI = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayDoseRate = 1U;
      c1_enterinto(chartInstance, 23U);
      c1_d36 = (real_T)c1_const_MSG_DISPLAYDR;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d36, 0, 0U, 0U,
        0U, 0), 0);
      chartInstance->c1_tempx = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
      c1_setDoseRate(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 24));
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 11U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(11U, (int32_T)_SFD_CCP_CALL(11U, 0,
        chartInstance->c1_tempx == 2U != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_CheckVTBI = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ALM_VTBIOutBound;
        chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ALM_VTBIOutBound;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ALM_VTBIOutBound = 1U;
        c1_enterinto(chartInstance, 22U);
        c1_d37 = (real_T)c1_const_MSG_ALMVTBI;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d37, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 22U, chartInstance->c1_sfEvent);
}

static void c1_CheckDoseRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d38;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d39;
  boolean_T c1_f_out;
  real_T c1_d40;
  c1_InfusionParameters *c1_infuParameters;
  c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 21U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 189U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(189U, (int32_T)_SFD_CCP_CALL(189U, 0,
              chartInstance->c1_tempx == 1U != 0U, chartInstance->c1_sfEvent))
            != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 189;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_tempx == 0U);
      if (c1_b_out) {
        transitionList[numTransitions] = 54;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_tempx == 2U);
      if (c1_c_out) {
        transitionList[numTransitions] = 52;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 189U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDoseRate = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_ConfigureInfusionProgram =
      c1_IN_WRN_DOSERATEOUTSOFTLIMITS;
    chartInstance->c1_was_ConfigureInfusionProgram =
      c1_IN_WRN_DOSERATEOUTSOFTLIMITS;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 27U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WRN_DOSERATEOUTSOFTLIMITS = 1U;
    c1_enterinto(chartInstance, 47U);
    c1_d38 = (real_T)c1_const_MSG_WRNDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d38, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 54U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(54U, (int32_T)_SFD_CCP_CALL(54U, 0,
      chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 54;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_tempx == 2U);
        if (c1_e_out) {
          transitionList[numTransitions] = 52;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 54U, chartInstance->c1_sfEvent);
      c1_setDoseRate(chartInstance, *(real_T *)((char_T *)c1_infuParameters + 8));
      chartInstance->c1_tp_CheckDoseRate = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplaySettings;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplaySettings;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplaySettings = 1U;
      c1_enterinto(chartInstance, 27U);
      c1_d39 = (real_T)c1_const_MSG_DISPLAYSET;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d39, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 52U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(52U, (int32_T)_SFD_CCP_CALL(52U, 0,
        chartInstance->c1_tempx == 2U != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 52U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_CheckDoseRate = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_ConfigureInfusionProgram =
          c1_IN_ALM_DoseRateOutBound;
        chartInstance->c1_was_ConfigureInfusionProgram =
          c1_IN_ALM_DoseRateOutBound;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ALM_DoseRateOutBound = 1U;
        c1_enterinto(chartInstance, 26U);
        c1_d40 = (real_T)c1_const_MSG_ALRMDR;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d40, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 21U, chartInstance->c1_sfEvent);
}

static void c1_DisplaySettings(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d41;
  boolean_T c1_f_out;
  real_T c1_d42;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 24U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 59U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(59U, (int32_T)_SFD_CCP_CALL(59U, 0,
              chartInstance->c1_sfEvent == c1_event_E_StartInfusion != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 59;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent ==
                  c1_event_E_ConfigureInfusionProgram);
      if (c1_b_out) {
        transitionList[numTransitions] = 113;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_c_out) {
        transitionList[numTransitions] = 63;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 59U, chartInstance->c1_sfEvent);
    sf_mex_printf("%s\\n", "E_RequestToStart");
    chartInstance->c1_E_RequestToStartEventCounter++;
    chartInstance->c1_tp_DisplaySettings = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ReadyToStart;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ReadyToStart;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ReadyToStart = 1U;
    c1_enterinto(chartInstance, 48U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 113U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(113U, (int32_T)_SFD_CCP_CALL(113U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ConfigureInfusionProgram != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 113;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
        if (c1_e_out) {
          transitionList[numTransitions] = 63;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 113U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplaySettings = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayVTBI = 1U;
      c1_enterinto(chartInstance, 19U);
      c1_d41 = (real_T)c1_const_MSG_VTBI;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d41, 0, 0U, 0U,
        0U, 0), 0);
      c1_setVTBI(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 72));
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 63U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(63U, (int32_T)_SFD_CCP_CALL(63U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 63U, chartInstance->c1_sfEvent);
        c1_warning(chartInstance);
        chartInstance->c1_tp_DisplaySettings = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplaySettings;
        chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplaySettings;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_DisplaySettings = 1U;
        c1_enterinto(chartInstance, 27U);
        c1_d42 = (real_T)c1_const_MSG_DISPLAYSET;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d42, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 24U, chartInstance->c1_sfEvent);
}

static void c1_Infusing(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  real_T c1_d43;
  real_T c1_d44;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  real_T c1_d45;
  boolean_T c1_g_out;
  boolean_T c1_h_out;
  boolean_T c1_i_out;
  boolean_T c1_j_out;
  real_T c1_d46;
  boolean_T c1_k_out;
  boolean_T c1_l_out;
  boolean_T c1_m_out;
  real_T c1_d47;
  boolean_T c1_n_out;
  boolean_T c1_o_out;
  boolean_T c1_p_out;
  boolean_T c1_q_out;
  boolean_T c1_r_out;
  real_T c1_d48;
  real_T c1_d49;
  boolean_T c1_s_out;
  real_T c1_d50;
  boolean_T c1_b_temp;
  boolean_T c1_c_temp;
  boolean_T c1_t_out;
  real_T c1_d51;
  real_T c1_d52;
  boolean_T *c1_O_BolusRequested;
  c1_InfusionStatus *c1_infuStatus;
  boolean_T guard1 = FALSE;
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 43U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 223U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(223U, (int32_T)_SFD_CCP_CALL(223U, 0,
              c1_infusionDone(chartInstance, chartInstance->c1_vtbi) == 1.0 !=
              0U, chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 223U, chartInstance->c1_sfEvent);
    c1_d43 = (real_T)c1_const_MSG_BLANK;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d43, 0, 0U, 0U, 0U,
      0), 0);
    chartInstance->c1_tp_Infusing = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionSubMachine = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionStopped = 1U;
    c1_copyInfuStatus(chartInstance);
    c1_stopInfusion(chartInstance);
    c1_d44 = (real_T)c1_const_MSG_INFUSIONSTOP;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d44, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 39U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 64U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(64U, (int32_T)_SFD_CCP_CALL(64U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ChangeDoseRate != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[5];
        unsigned int numTransitions = 1;
        transitionList[0] = 64;
        sf_debug_transition_conflict_check_begin();
        c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_StopInfusion);
        if (c1_c_out) {
          transitionList[numTransitions] = 94;
          numTransitions++;
        }

        c1_d_out = (chartInstance->c1_sfEvent == c1_event_E_PauseInfusion);
        if (c1_d_out) {
          transitionList[numTransitions] = 61;
          numTransitions++;
        }

        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_RequestBolus);
        if (c1_e_out) {
          transitionList[numTransitions] = 88;
          numTransitions++;
        }

        c1_f_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
        if (c1_f_out) {
          transitionList[numTransitions] = 191;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 64U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_Infusing = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionSubMachine = c1_IN_ChangeRate;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
      chartInstance->c1_temporalCounter_i1 = 0U;
      chartInstance->c1_tp_ChangeRate = 1U;
      c1_d45 = (real_T)c1_const_MSG_CHANGEDR;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d45, 0, 0U, 0U,
        0U, 0), 0);
      sf_mex_export("GSetConVal", sf_mex_create("GSetConVal",
        &chartInstance->c1_temp, 0, 0U, 0U, 0U, 0), 0);
      c1_enterinto(chartInstance, 30U);
      c1_copyInfuStatus(chartInstance);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 94U,
                   chartInstance->c1_sfEvent);
      c1_g_out = (CV_TRANSITION_EVAL(94U, (int32_T)_SFD_CCP_CALL(94U, 0,
        chartInstance->c1_sfEvent == c1_event_E_StopInfusion != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_g_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[4];
          unsigned int numTransitions = 1;
          transitionList[0] = 94;
          sf_debug_transition_conflict_check_begin();
          c1_h_out = (chartInstance->c1_sfEvent == c1_event_E_PauseInfusion);
          if (c1_h_out) {
            transitionList[numTransitions] = 61;
            numTransitions++;
          }

          c1_i_out = (chartInstance->c1_sfEvent == c1_event_E_RequestBolus);
          if (c1_i_out) {
            transitionList[numTransitions] = 88;
            numTransitions++;
          }

          c1_j_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
          if (c1_j_out) {
            transitionList[numTransitions] = 191;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 94U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_Infusing = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionSubMachine = c1_IN_ConfirmStop;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
        chartInstance->c1_temporalCounter_i1 = 0U;
        chartInstance->c1_tp_ConfirmStop = 1U;
        c1_d46 = (real_T)c1_const_MSG_CONFIRMSTOP;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d46, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 35U);
        c1_copyInfuStatus(chartInstance);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 61U,
                     chartInstance->c1_sfEvent);
        c1_k_out = (CV_TRANSITION_EVAL(61U, (int32_T)_SFD_CCP_CALL(61U, 0,
          chartInstance->c1_sfEvent == c1_event_E_PauseInfusion != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_k_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[3];
            unsigned int numTransitions = 1;
            transitionList[0] = 61;
            sf_debug_transition_conflict_check_begin();
            c1_l_out = (chartInstance->c1_sfEvent == c1_event_E_RequestBolus);
            if (c1_l_out) {
              transitionList[numTransitions] = 88;
              numTransitions++;
            }

            c1_m_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
            if (c1_m_out) {
              transitionList[numTransitions] = 191;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 61U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_Infusing = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionSubMachine = c1_IN_ConfirmPause;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
          chartInstance->c1_temporalCounter_i1 = 0U;
          chartInstance->c1_tp_ConfirmPause = 1U;
          c1_d47 = (real_T)c1_const_MSG_CONFIRMPAUSE;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d47, 0, 0U,
            0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 34U);
          c1_copyInfuStatus(chartInstance);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 88U,
                       chartInstance->c1_sfEvent);
          c1_n_out = (CV_TRANSITION_EVAL(88U, (int32_T)_SFD_CCP_CALL(88U, 0,
            chartInstance->c1_sfEvent == c1_event_E_RequestBolus != 0U,
            chartInstance->c1_sfEvent)) != 0);
          guard1 = FALSE;
          if (c1_n_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[2];
              unsigned int numTransitions = 1;
              transitionList[0] = 88;
              sf_debug_transition_conflict_check_begin();
              c1_o_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
              if (c1_o_out) {
                transitionList[numTransitions] = 191;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 88U, chartInstance->c1_sfEvent);
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 213U,
                         chartInstance->c1_sfEvent);
            c1_p_out = (CV_TRANSITION_EVAL(213U, (int32_T)_SFD_CCP_CALL(213U, 0,
                          (int16_T)*(boolean_T *)((char_T *)c1_infuStatus + 0) ==
              0 != 0U, chartInstance->c1_sfEvent)) != 0);
            if (c1_p_out) {
              if (sf_debug_transition_conflict_check_enabled()) {
                unsigned int transitionList[2];
                unsigned int numTransitions = 1;
                transitionList[0] = 213;
                sf_debug_transition_conflict_check_begin();
                c1_q_out = ((int16_T)*(boolean_T *)((char_T *)c1_infuStatus + 0)
                            == 1);
                if (c1_q_out) {
                  transitionList[numTransitions] = 87;
                  numTransitions++;
                }

                sf_debug_transition_conflict_check_end();
                if (numTransitions > 1) {
                  _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
                }
              }

              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 213U,
                           chartInstance->c1_sfEvent);
              *c1_O_BolusRequested = TRUE;
              _SFD_DATA_RANGE_CHECK((real_T)*c1_O_BolusRequested, 4U);
              chartInstance->c1_tp_Infusing = 0U;
              _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
              chartInstance->c1_is_InfusionSubMachine = c1_IN_BolusRequest;
              _SFD_CS_CALL(STATE_ACTIVE_TAG, 38U, chartInstance->c1_sfEvent);
              chartInstance->c1_tp_BolusRequest = 1U;
              c1_enterinto(chartInstance, 29U);
            } else {
              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 87U,
                           chartInstance->c1_sfEvent);
              c1_r_out = (CV_TRANSITION_EVAL(87U, (int32_T)_SFD_CCP_CALL(87U, 0,
                            (int16_T)*(boolean_T *)((char_T *)c1_infuStatus + 0)
                == 1 != 0U, chartInstance->c1_sfEvent)) != 0);
              if (c1_r_out) {
                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 87U,
                             chartInstance->c1_sfEvent);
                c1_d48 = (real_T)c1_const_MSG_BOLUSDENIED;
                sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d48, 0,
                  0U, 0U, 0U, 0), 0);
                chartInstance->c1_tp_Infusing = 0U;
                _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
                chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
                _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
                chartInstance->c1_temporalCounter_i1 = 0U;
                chartInstance->c1_tp_Infusing = 1U;
                c1_d49 = (real_T)c1_const_MSG_INFUSING;
                sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d49,
                  0, 0U, 0U, 0U, 0), 0);
                c1_enterinto(chartInstance, 28U);
                c1_copyInfuStatus(chartInstance);
              } else {
                guard1 = TRUE;
              }
            }
          } else {
            guard1 = TRUE;
          }

          if (guard1 == TRUE) {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 191U,
                         chartInstance->c1_sfEvent);
            c1_s_out = (CV_TRANSITION_EVAL(191U, (int32_T)_SFD_CCP_CALL(191U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
              chartInstance->c1_sfEvent)) != 0);
            if (c1_s_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 191U,
                           chartInstance->c1_sfEvent);
              c1_warning(chartInstance);
              chartInstance->c1_tp_Infusing = 0U;
              _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
              chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
              _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
              chartInstance->c1_temporalCounter_i1 = 0U;
              chartInstance->c1_tp_Infusing = 1U;
              c1_d50 = (real_T)c1_const_MSG_INFUSING;
              sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d50, 0,
                0U, 0U, 0U, 0), 0);
              c1_enterinto(chartInstance, 28U);
              c1_copyInfuStatus(chartInstance);
            } else {
              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 214U,
                           chartInstance->c1_sfEvent);
              c1_b_temp = (_SFD_CCP_CALL(214U, 0, (int16_T)
                chartInstance->c1_infusing > 0 != 0U, chartInstance->c1_sfEvent)
                           != 0);
              if (c1_b_temp) {
                c1_b_temp = (_SFD_CCP_CALL(214U, 1, (int16_T)
                  chartInstance->c1_bolusing > 0 != 0U,
                  chartInstance->c1_sfEvent) != 0);
              }

              c1_c_temp = c1_b_temp;
              if (c1_c_temp) {
                c1_c_temp = (_SFD_CCP_CALL(214U, 2, (int16_T)*(boolean_T *)
                  ((char_T *)c1_infuStatus + 0) == 0 != 0U,
                  chartInstance->c1_sfEvent) != 0);
              }

              c1_t_out = (CV_TRANSITION_EVAL(214U, (int32_T)c1_c_temp) != 0);
              if (c1_t_out) {
                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 214U,
                             chartInstance->c1_sfEvent);
                chartInstance->c1_bolusing = FALSE;
                _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
                c1_d51 = (real_T)c1_const_MSG_STOPBOLUS;
                sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d51, 0,
                  0U, 0U, 0U, 0), 0);
                chartInstance->c1_tp_Infusing = 0U;
                _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
                chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
                _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
                chartInstance->c1_temporalCounter_i1 = 0U;
                chartInstance->c1_tp_Infusing = 1U;
                c1_d52 = (real_T)c1_const_MSG_INFUSING;
                sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d52,
                  0, 0U, 0U, 0U, 0), 0);
                c1_enterinto(chartInstance, 28U);
                c1_copyInfuStatus(chartInstance);
              } else if (chartInstance->c1_sfEvent == c1_event_E_Clock) {
                if (chartInstance->c1_temporalCounter_i1 == 3) {
                  CV_STATE_EVAL(43, 0, 2);
                  c1_copyInfuStatus(chartInstance);
                } else {
                  CV_STATE_EVAL(43, 0, 1);
                }
              } else {
                CV_STATE_EVAL(43, 0, 1);
              }
            }
          }
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 43U, chartInstance->c1_sfEvent);
}

static void c1_enter_internal_InfusionInSession
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_d53;
  real_T c1_d54;
  real_T c1_d55;
  real_T c1_d56;
  real_T c1_d57;
  real_T c1_d58;
  real_T c1_d59;
  real_T c1_d60;
  switch (chartInstance->c1_was_InfusionInSession) {
   case c1_IN_ALMWrongDrug:
    CV_STATE_EVAL(30, 2, 1);
    chartInstance->c1_is_InfusionInSession = c1_IN_ALMWrongDrug;
    chartInstance->c1_was_InfusionInSession = c1_IN_ALMWrongDrug;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ALMWrongDrug = 1U;
    c1_d53 = (real_T)c1_const_MSG_WRONGDRUG;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d53, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 42U);
    break;

   case c1_IN_CheckDrugWhileInfusing:
    CV_STATE_EVAL(30, 2, 2);
    chartInstance->c1_is_InfusionInSession = c1_IN_CheckDrugWhileInfusing;
    chartInstance->c1_was_InfusionInSession = c1_IN_CheckDrugWhileInfusing;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDrugWhileInfusing = 1U;
    c1_enter_atomic_CheckDrugWhileInfusing(chartInstance);
    break;

   case c1_IN_EmptyReservoir:
    CV_STATE_EVAL(30, 2, 3);
    chartInstance->c1_is_InfusionInSession = c1_IN_EmptyReservoir;
    chartInstance->c1_was_InfusionInSession = c1_IN_EmptyReservoir;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_EmptyReservoir = 1U;
    c1_enterinto(chartInstance, 40U);
    c1_d54 = (real_T)c1_const_MSG_EMPTYRESERVOIR;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d54, 0, 0U, 0U, 0U,
      0), 0);
    break;

   case c1_IN_InfusionPaused:
    CV_STATE_EVAL(30, 2, 4);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionPaused;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionPaused;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionPaused = 1U;
    c1_enterinto(chartInstance, 36U);
    c1_pauseInfusion(chartInstance);
    c1_d55 = (real_T)c1_const_MSG_INFUSIONPAUSED;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d55, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_InfusionStopped:
    CV_STATE_EVAL(30, 2, 5);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionStopped = 1U;
    c1_copyInfuStatus(chartInstance);
    c1_stopInfusion(chartInstance);
    c1_d56 = (real_T)c1_const_MSG_INFUSIONSTOP;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d56, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 39U);
    break;

   case c1_IN_InfusionSubMachine:
    CV_STATE_EVAL(30, 2, 6);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionSubMachine;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionSubMachine;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionSubMachine = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 77U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 77U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
    chartInstance->c1_temporalCounter_i1 = 0U;
    chartInstance->c1_tp_Infusing = 1U;
    c1_d57 = (real_T)c1_const_MSG_INFUSING;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d57, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 28U);
    c1_copyInfuStatus(chartInstance);
    break;

   case c1_IN_LevelTwoAlarming:
    CV_STATE_EVAL(30, 2, 7);
    chartInstance->c1_is_InfusionInSession = c1_IN_LevelTwoAlarming;
    chartInstance->c1_was_InfusionInSession = c1_IN_LevelTwoAlarming;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_LevelTwoAlarming = 1U;
    c1_enter_atomic_LevelTwoAlarming(chartInstance);
    break;

   case c1_IN_PausedStopConfirm:
    CV_STATE_EVAL(30, 2, 8);
    chartInstance->c1_is_InfusionInSession = c1_IN_PausedStopConfirm;
    chartInstance->c1_was_InfusionInSession = c1_IN_PausedStopConfirm;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_PausedStopConfirm = 1U;
    c1_d58 = (real_T)c1_const_MSG_SPCHOOSE;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d58, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 38U);
    break;

   case c1_IN_PausedTooLong:
    CV_STATE_EVAL(30, 2, 9);
    chartInstance->c1_is_InfusionInSession = c1_IN_PausedTooLong;
    chartInstance->c1_was_InfusionInSession = c1_IN_PausedTooLong;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_PausedTooLong = 1U;
    c1_enterinto(chartInstance, 37U);
    c1_d59 = (real_T)c1_const_MSG_PAUSETOOLONG;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d59, 0, 0U, 0U, 0U,
      0), 0);
    break;

   default:
    CV_STATE_EVAL(30, 2, 0);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 111U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 111U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionSubMachine;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionSubMachine;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionSubMachine = 1U;
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 77U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 77U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
    chartInstance->c1_temporalCounter_i1 = 0U;
    chartInstance->c1_tp_Infusing = 1U;
    c1_d60 = (real_T)c1_const_MSG_INFUSING;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d60, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 28U);
    c1_copyInfuStatus(chartInstance);
    break;
  }
}

static void c1_InfusionInSession(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  real_T c1_d61;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d62;
  boolean_T c1_f_out;
  boolean_T c1_g_out;
  boolean_T c1_h_out;
  real_T c1_d63;
  boolean_T c1_i_out;
  boolean_T c1_j_out;
  real_T c1_d64;
  boolean_T c1_k_out;
  real_T c1_d65;
  boolean_T c1_l_out;
  boolean_T c1_m_out;
  boolean_T c1_n_out;
  real_T c1_d66;
  boolean_T c1_o_out;
  boolean_T c1_p_out;
  boolean_T c1_q_out;
  real_T c1_d67;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 30U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 10U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(10U, (int32_T)_SFD_CCP_CALL(10U, 0,
              chartInstance->c1_sfEvent == c1_event_E_PowerButton != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
    chartInstance->c1_tempx = 3U;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    c1_exit_internal_InfusionInSession(chartInstance);
    chartInstance->c1_tp_InfusionInSession = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 30U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_ConfirmPowerDown;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ConfirmPowerDown = 1U;
    c1_enterinto(chartInstance, 2U);
    c1_d61 = (real_T)c1_const_MSG_POWEROFF;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d61, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 69U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(69U, (int32_T)_SFD_CCP_CALL(69U, 0,
      c1_alrmLevel(chartInstance) == 1U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 69U, chartInstance->c1_sfEvent);
      c1_resetInfusionInstructions(chartInstance);
      c1_exit_internal_InfusionInSession(chartInstance);
      chartInstance->c1_tp_InfusionInSession = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 30U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionStateMachine = c1_IN_LEVELONEALRM;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 48U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_LEVELONEALRM = 1U;
      c1_enter_atomic_LEVELONEALRM(chartInstance);
    } else {
      switch (chartInstance->c1_is_InfusionInSession) {
       case c1_IN_ALMWrongDrug:
        CV_STATE_EVAL(30, 0, 1);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 31U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 102U,
                     chartInstance->c1_sfEvent);
        c1_c_out = (CV_TRANSITION_EVAL(102U, (int32_T)_SFD_CCP_CALL(102U, 0,
          chartInstance->c1_sfEvent == c1_event_E_StopInfusion != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_c_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[3];
            unsigned int numTransitions = 1;
            transitionList[0] = 102;
            sf_debug_transition_conflict_check_begin();
            c1_d_out = (chartInstance->c1_sfEvent == c1_event_E_CheckDrug);
            if (c1_d_out) {
              transitionList[numTransitions] = 167;
              numTransitions++;
            }

            c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
            if (c1_e_out) {
              transitionList[numTransitions] = 151;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 102U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_ALMWrongDrug = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
          chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_InfusionStopped = 1U;
          c1_copyInfuStatus(chartInstance);
          c1_stopInfusion(chartInstance);
          c1_d62 = (real_T)c1_const_MSG_INFUSIONSTOP;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d62, 0, 0U,
            0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 39U);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 167U,
                       chartInstance->c1_sfEvent);
          c1_f_out = (CV_TRANSITION_EVAL(167U, (int32_T)_SFD_CCP_CALL(167U, 0,
            chartInstance->c1_sfEvent == c1_event_E_CheckDrug != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_f_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[2];
              unsigned int numTransitions = 1;
              transitionList[0] = 167;
              sf_debug_transition_conflict_check_begin();
              c1_g_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
              if (c1_g_out) {
                transitionList[numTransitions] = 151;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 167U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ALMWrongDrug = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionInSession =
              c1_IN_CheckDrugWhileInfusing;
            chartInstance->c1_was_InfusionInSession =
              c1_IN_CheckDrugWhileInfusing;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_CheckDrugWhileInfusing = 1U;
            c1_enter_atomic_CheckDrugWhileInfusing(chartInstance);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 151U,
                         chartInstance->c1_sfEvent);
            c1_h_out = (CV_TRANSITION_EVAL(151U, (int32_T)_SFD_CCP_CALL(151U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
              chartInstance->c1_sfEvent)) != 0);
            if (c1_h_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 151U,
                           chartInstance->c1_sfEvent);
              c1_warning(chartInstance);
              chartInstance->c1_tp_ALMWrongDrug = 0U;
              _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
              chartInstance->c1_is_InfusionInSession = c1_IN_ALMWrongDrug;
              chartInstance->c1_was_InfusionInSession = c1_IN_ALMWrongDrug;
              _SFD_CS_CALL(STATE_ACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
              chartInstance->c1_tp_ALMWrongDrug = 1U;
              c1_d63 = (real_T)c1_const_MSG_WRONGDRUG;
              sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d63, 0,
                0U, 0U, 0U, 0), 0);
              c1_enterinto(chartInstance, 42U);
            }
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 31U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_CheckDrugWhileInfusing:
        CV_STATE_EVAL(30, 0, 2);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 32U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 98U,
                     chartInstance->c1_sfEvent);
        c1_i_out = (CV_TRANSITION_EVAL(98U, (int32_T)_SFD_CCP_CALL(98U, 0,
          chartInstance->c1_tempx > 0U != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_i_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[2];
            unsigned int numTransitions = 1;
            transitionList[0] = 98;
            sf_debug_transition_conflict_check_begin();
            c1_j_out = (chartInstance->c1_tempx == 0U);
            if (c1_j_out) {
              transitionList[numTransitions] = 226;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 98U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_CheckDrugWhileInfusing = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionInSession = c1_IN_ALMWrongDrug;
          chartInstance->c1_was_InfusionInSession = c1_IN_ALMWrongDrug;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_ALMWrongDrug = 1U;
          c1_d64 = (real_T)c1_const_MSG_WRONGDRUG;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d64, 0, 0U,
            0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 42U);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 226U,
                       chartInstance->c1_sfEvent);
          c1_k_out = (CV_TRANSITION_EVAL(226U, (int32_T)_SFD_CCP_CALL(226U, 0,
            chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) !=
                      0);
          if (c1_k_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 226U, chartInstance->c1_sfEvent);
            c1_resumeInfusion(chartInstance);
            chartInstance->c1_tp_CheckDrugWhileInfusing = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionInSession = c1_IN_InfusionSubMachine;
            chartInstance->c1_was_InfusionInSession = c1_IN_InfusionSubMachine;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_InfusionSubMachine = 1U;
            chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
            chartInstance->c1_temporalCounter_i1 = 0U;
            chartInstance->c1_tp_Infusing = 1U;
            c1_d65 = (real_T)c1_const_MSG_INFUSING;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d65, 0,
              0U, 0U, 0U, 0), 0);
            c1_enterinto(chartInstance, 28U);
            c1_copyInfuStatus(chartInstance);
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 32U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_EmptyReservoir:
        CV_STATE_EVAL(30, 0, 3);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 33U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 179U,
                     chartInstance->c1_sfEvent);
        c1_l_out = (CV_TRANSITION_EVAL(179U, (int32_T)_SFD_CCP_CALL(179U, 0,
          chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_l_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[3];
            unsigned int numTransitions = 1;
            transitionList[0] = 179;
            sf_debug_transition_conflict_check_begin();
            c1_m_out = (chartInstance->c1_sfEvent == c1_event_E_CheckDrug);
            if (c1_m_out) {
              transitionList[numTransitions] = 97;
              numTransitions++;
            }

            c1_n_out = (chartInstance->c1_sfEvent == c1_event_E_StopInfusion);
            if (c1_n_out) {
              transitionList[numTransitions] = 101;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 179U, chartInstance->c1_sfEvent);
          c1_warning(chartInstance);
          chartInstance->c1_tp_EmptyReservoir = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionInSession = c1_IN_EmptyReservoir;
          chartInstance->c1_was_InfusionInSession = c1_IN_EmptyReservoir;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_EmptyReservoir = 1U;
          c1_enterinto(chartInstance, 40U);
          c1_d66 = (real_T)c1_const_MSG_EMPTYRESERVOIR;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d66, 0, 0U, 0U,
            0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 97U,
                       chartInstance->c1_sfEvent);
          c1_o_out = (CV_TRANSITION_EVAL(97U, (int32_T)_SFD_CCP_CALL(97U, 0,
            chartInstance->c1_sfEvent == c1_event_E_CheckDrug != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_o_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[2];
              unsigned int numTransitions = 1;
              transitionList[0] = 97;
              sf_debug_transition_conflict_check_begin();
              c1_p_out = (chartInstance->c1_sfEvent == c1_event_E_StopInfusion);
              if (c1_p_out) {
                transitionList[numTransitions] = 101;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 97U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_EmptyReservoir = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionInSession =
              c1_IN_CheckDrugWhileInfusing;
            chartInstance->c1_was_InfusionInSession =
              c1_IN_CheckDrugWhileInfusing;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_CheckDrugWhileInfusing = 1U;
            c1_enter_atomic_CheckDrugWhileInfusing(chartInstance);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 101U,
                         chartInstance->c1_sfEvent);
            c1_q_out = (CV_TRANSITION_EVAL(101U, (int32_T)_SFD_CCP_CALL(101U, 0,
              chartInstance->c1_sfEvent == c1_event_E_StopInfusion != 0U,
              chartInstance->c1_sfEvent)) != 0);
            if (c1_q_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 101U,
                           chartInstance->c1_sfEvent);
              chartInstance->c1_tp_EmptyReservoir = 0U;
              _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
              chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
              chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
              _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
              chartInstance->c1_tp_InfusionStopped = 1U;
              c1_copyInfuStatus(chartInstance);
              c1_stopInfusion(chartInstance);
              c1_d67 = (real_T)c1_const_MSG_INFUSIONSTOP;
              sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d67, 0,
                0U, 0U, 0U, 0), 0);
              c1_enterinto(chartInstance, 39U);
            }
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 33U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_InfusionPaused:
        CV_STATE_EVAL(30, 0, 4);
        c1_InfusionPaused(chartInstance);
        break;

       case c1_IN_InfusionStopped:
        CV_STATE_EVAL(30, 0, 5);
        c1_InfusionStopped(chartInstance);
        break;

       case c1_IN_InfusionSubMachine:
        CV_STATE_EVAL(30, 0, 6);
        c1_InfusionSubMachine(chartInstance);
        break;

       case c1_IN_LevelTwoAlarming:
        CV_STATE_EVAL(30, 0, 7);
        c1_LevelTwoAlarming(chartInstance);
        break;

       case c1_IN_PausedStopConfirm:
        CV_STATE_EVAL(30, 0, 8);
        c1_PausedStopConfirm(chartInstance);
        break;

       case c1_IN_PausedTooLong:
        CV_STATE_EVAL(30, 0, 9);
        c1_PausedTooLong(chartInstance);
        break;

       default:
        CV_STATE_EVAL(30, 0, 0);
        chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
        break;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 30U, chartInstance->c1_sfEvent);
}

static void c1_exit_internal_InfusionInSession(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  switch (chartInstance->c1_is_InfusionInSession) {
   case c1_IN_ALMWrongDrug:
    CV_STATE_EVAL(30, 1, 1);
    chartInstance->c1_tp_ALMWrongDrug = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_CheckDrugWhileInfusing:
    CV_STATE_EVAL(30, 1, 2);
    chartInstance->c1_tp_CheckDrugWhileInfusing = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_EmptyReservoir:
    CV_STATE_EVAL(30, 1, 3);
    chartInstance->c1_tp_EmptyReservoir = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_InfusionPaused:
    CV_STATE_EVAL(30, 1, 4);
    chartInstance->c1_tp_InfusionPaused = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_InfusionStopped:
    CV_STATE_EVAL(30, 1, 5);
    chartInstance->c1_tp_InfusionStopped = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_InfusionSubMachine:
    CV_STATE_EVAL(30, 1, 6);
    c1_exit_internal_InfusionSubMachine(chartInstance);
    chartInstance->c1_tp_InfusionSubMachine = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_LevelTwoAlarming:
    CV_STATE_EVAL(30, 1, 7);
    chartInstance->c1_tp_LevelTwoAlarming = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_PausedStopConfirm:
    CV_STATE_EVAL(30, 1, 8);
    chartInstance->c1_tp_PausedStopConfirm = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_PausedTooLong:
    CV_STATE_EVAL(30, 1, 9);
    chartInstance->c1_tp_PausedTooLong = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
    break;

   default:
    CV_STATE_EVAL(30, 1, 0);
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
    break;
  }
}

static void c1_ChangeRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d68;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d69;
  boolean_T c1_f_out;
  real_T c1_d70;
  boolean_T c1_b_temp;
  boolean_T c1_c_temp;
  boolean_T c1_g_out;
  real_T c1_d71;
  real_T c1_d72;
  boolean_T c1_h_out;
  real_T c1_d73;
  c1_InfusionStatus *c1_infuStatus;
  c1_InfusionParameters *c1_infuParameters;
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 39U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 168U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(168U, (int32_T)_SFD_CCP_CALL(168U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 168;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_ConfirmDoseRate);
      if (c1_b_out) {
        transitionList[numTransitions] = 70;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
      if (c1_c_out) {
        transitionList[numTransitions] = 67;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 168U, chartInstance->c1_sfEvent);
    c1_warning(chartInstance);
    chartInstance->c1_tp_ChangeRate = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionSubMachine = c1_IN_ChangeRate;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
    chartInstance->c1_temporalCounter_i1 = 0U;
    chartInstance->c1_tp_ChangeRate = 1U;
    c1_d68 = (real_T)c1_const_MSG_CHANGEDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d68, 0, 0U, 0U,
      0U, 0), 0);
    sf_mex_export("GSetConVal", sf_mex_create("GSetConVal",
      &chartInstance->c1_temp, 0, 0U, 0U, 0U, 0), 0);
    c1_enterinto(chartInstance, 30U);
    c1_copyInfuStatus(chartInstance);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 70U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(70U, (int32_T)_SFD_CCP_CALL(70U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ConfirmDoseRate != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 70;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
        if (c1_e_out) {
          transitionList[numTransitions] = 67;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 70U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ChangeRate = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionSubMachine = c1_IN_CheckNewRate;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 40U, chartInstance->c1_sfEvent);
      chartInstance->c1_temporalCounter_i1 = 0U;
      chartInstance->c1_tp_CheckNewRate = 1U;
      c1_d69 = (real_T)c1_const_MSG_CHECKDR;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d69, 0, 0U, 0U,
        0U, 0), 0);
      chartInstance->c1_tempx = c1_checkDoseRate(chartInstance, *(real_T *)
        ((char_T *)c1_infuParameters + 8));
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
      chartInstance->c1_temp = *(real_T *)((char_T *)c1_infuParameters + 8);
      _SFD_DATA_RANGE_CHECK(chartInstance->c1_temp, 67U);
      c1_enterinto(chartInstance, 31U);
      c1_copyInfuStatus(chartInstance);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 67U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(67U, (int32_T)_SFD_CCP_CALL(67U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 67U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ChangeRate = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
        chartInstance->c1_temporalCounter_i1 = 0U;
        chartInstance->c1_tp_Infusing = 1U;
        c1_d70 = (real_T)c1_const_MSG_INFUSING;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d70, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 28U);
        c1_copyInfuStatus(chartInstance);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 264U,
                     chartInstance->c1_sfEvent);
        c1_b_temp = (_SFD_CCP_CALL(264U, 0, (int16_T)chartInstance->c1_infusing >
          0 != 0U, chartInstance->c1_sfEvent) != 0);
        if (c1_b_temp) {
          c1_b_temp = (_SFD_CCP_CALL(264U, 1, (int16_T)
            chartInstance->c1_bolusing > 0 != 0U, chartInstance->c1_sfEvent) !=
                       0);
        }

        c1_c_temp = c1_b_temp;
        if (c1_c_temp) {
          c1_c_temp = (_SFD_CCP_CALL(264U, 2, (int16_T)*(boolean_T *)((char_T *)
            c1_infuStatus + 0) == 0 != 0U, chartInstance->c1_sfEvent) != 0);
        }

        c1_g_out = (CV_TRANSITION_EVAL(264U, (int32_T)c1_c_temp) != 0);
        if (c1_g_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 264U, chartInstance->c1_sfEvent);
          chartInstance->c1_bolusing = FALSE;
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
          c1_d71 = (real_T)c1_const_MSG_STOPBOLUS;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d71, 0, 0U, 0U,
            0U, 0), 0);
          chartInstance->c1_tp_ChangeRate = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionSubMachine = c1_IN_ChangeRate;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
          chartInstance->c1_temporalCounter_i1 = 0U;
          chartInstance->c1_tp_ChangeRate = 1U;
          c1_d72 = (real_T)c1_const_MSG_CHANGEDR;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d72, 0, 0U,
            0U, 0U, 0), 0);
          sf_mex_export("GSetConVal", sf_mex_create("GSetConVal",
            &chartInstance->c1_temp, 0, 0U, 0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 30U);
          c1_copyInfuStatus(chartInstance);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 231U,
                       chartInstance->c1_sfEvent);
          c1_h_out = (CV_TRANSITION_EVAL(231U, (int32_T)_SFD_CCP_CALL(231U, 0,
            c1_infusionDone(chartInstance, chartInstance->c1_vtbi) == 1.0 != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_h_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 231U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ChangeRate = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
            chartInstance->c1_temporalCounter_i1 = 0U;
            chartInstance->c1_tp_Infusing = 1U;
            c1_d73 = (real_T)c1_const_MSG_INFUSING;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d73, 0,
              0U, 0U, 0U, 0), 0);
            c1_enterinto(chartInstance, 28U);
            c1_copyInfuStatus(chartInstance);
          } else if (chartInstance->c1_sfEvent == c1_event_E_Clock) {
            if (chartInstance->c1_temporalCounter_i1 == 3) {
              CV_STATE_EVAL(39, 0, 2);
              c1_copyInfuStatus(chartInstance);
            } else {
              CV_STATE_EVAL(39, 0, 1);
            }
          } else {
            CV_STATE_EVAL(39, 0, 1);
          }
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 39U, chartInstance->c1_sfEvent);
}

static void c1_ALM_NewRateOutBound(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d74;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d75;
  boolean_T c1_f_out;
  real_T c1_d76;
  boolean_T c1_b_temp;
  boolean_T c1_c_temp;
  boolean_T c1_g_out;
  real_T c1_d77;
  real_T c1_d78;
  boolean_T c1_h_out;
  real_T c1_d79;
  c1_InfusionStatus *c1_infuStatus;
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 37U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 182U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(182U, (int32_T)_SFD_CCP_CALL(182U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 182;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_ChangeDoseRate);
      if (c1_b_out) {
        transitionList[numTransitions] = 105;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
      if (c1_c_out) {
        transitionList[numTransitions] = 75;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 182U, chartInstance->c1_sfEvent);
    c1_warning(chartInstance);
    chartInstance->c1_tp_ALM_NewRateOutBound = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionSubMachine = c1_IN_ALM_NewRateOutBound;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
    chartInstance->c1_temporalCounter_i1 = 0U;
    chartInstance->c1_tp_ALM_NewRateOutBound = 1U;
    c1_d74 = (real_T)c1_const_MSG_ALRMDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d74, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 32U);
    c1_copyInfuStatus(chartInstance);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 105U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(105U, (int32_T)_SFD_CCP_CALL(105U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ChangeDoseRate != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 105;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
        if (c1_e_out) {
          transitionList[numTransitions] = 75;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 105U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ALM_NewRateOutBound = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionSubMachine = c1_IN_ChangeRate;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
      chartInstance->c1_temporalCounter_i1 = 0U;
      chartInstance->c1_tp_ChangeRate = 1U;
      c1_d75 = (real_T)c1_const_MSG_CHANGEDR;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d75, 0, 0U, 0U,
        0U, 0), 0);
      sf_mex_export("GSetConVal", sf_mex_create("GSetConVal",
        &chartInstance->c1_temp, 0, 0U, 0U, 0U, 0), 0);
      c1_enterinto(chartInstance, 30U);
      c1_copyInfuStatus(chartInstance);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 75U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(75U, (int32_T)_SFD_CCP_CALL(75U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 75U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ALM_NewRateOutBound = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
        chartInstance->c1_temporalCounter_i1 = 0U;
        chartInstance->c1_tp_Infusing = 1U;
        c1_d76 = (real_T)c1_const_MSG_INFUSING;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d76, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 28U);
        c1_copyInfuStatus(chartInstance);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 265U,
                     chartInstance->c1_sfEvent);
        c1_b_temp = (_SFD_CCP_CALL(265U, 0, (int16_T)chartInstance->c1_infusing >
          0 != 0U, chartInstance->c1_sfEvent) != 0);
        if (c1_b_temp) {
          c1_b_temp = (_SFD_CCP_CALL(265U, 1, (int16_T)
            chartInstance->c1_bolusing > 0 != 0U, chartInstance->c1_sfEvent) !=
                       0);
        }

        c1_c_temp = c1_b_temp;
        if (c1_c_temp) {
          c1_c_temp = (_SFD_CCP_CALL(265U, 2, (int16_T)*(boolean_T *)((char_T *)
            c1_infuStatus + 0) == 0 != 0U, chartInstance->c1_sfEvent) != 0);
        }

        c1_g_out = (CV_TRANSITION_EVAL(265U, (int32_T)c1_c_temp) != 0);
        if (c1_g_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 265U, chartInstance->c1_sfEvent);
          chartInstance->c1_bolusing = FALSE;
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
          c1_d77 = (real_T)c1_const_MSG_STOPBOLUS;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d77, 0, 0U, 0U,
            0U, 0), 0);
          chartInstance->c1_tp_ALM_NewRateOutBound = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionSubMachine = c1_IN_ALM_NewRateOutBound;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
          chartInstance->c1_temporalCounter_i1 = 0U;
          chartInstance->c1_tp_ALM_NewRateOutBound = 1U;
          c1_d78 = (real_T)c1_const_MSG_ALRMDR;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d78, 0, 0U,
            0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 32U);
          c1_copyInfuStatus(chartInstance);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 232U,
                       chartInstance->c1_sfEvent);
          c1_h_out = (CV_TRANSITION_EVAL(232U, (int32_T)_SFD_CCP_CALL(232U, 0,
            c1_infusionDone(chartInstance, chartInstance->c1_vtbi) == 1.0 != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_h_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 232U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ALM_NewRateOutBound = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
            chartInstance->c1_temporalCounter_i1 = 0U;
            chartInstance->c1_tp_Infusing = 1U;
            c1_d79 = (real_T)c1_const_MSG_INFUSING;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d79, 0,
              0U, 0U, 0U, 0), 0);
            c1_enterinto(chartInstance, 28U);
            c1_copyInfuStatus(chartInstance);
          } else if (chartInstance->c1_sfEvent == c1_event_E_Clock) {
            if (chartInstance->c1_temporalCounter_i1 == 3) {
              CV_STATE_EVAL(37, 0, 2);
              c1_copyInfuStatus(chartInstance);
            } else {
              CV_STATE_EVAL(37, 0, 1);
            }
          } else {
            CV_STATE_EVAL(37, 0, 1);
          }
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 37U, chartInstance->c1_sfEvent);
}

static void c1_ConfirmStop(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  real_T c1_d80;
  real_T c1_d81;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d82;
  boolean_T c1_d_out;
  real_T c1_d83;
  boolean_T c1_b_temp;
  boolean_T c1_c_temp;
  boolean_T c1_e_out;
  real_T c1_d84;
  real_T c1_d85;
  boolean_T c1_f_out;
  real_T c1_d86;
  c1_InfusionStatus *c1_infuStatus;
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 42U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 229U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(229U, (int32_T)_SFD_CCP_CALL(229U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ConfirmStopInfusion != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 229U, chartInstance->c1_sfEvent);
    c1_d80 = (real_T)c1_const_MSG_BLANK;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d80, 0, 0U, 0U, 0U,
      0), 0);
    chartInstance->c1_tp_ConfirmStop = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionSubMachine = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionStopped = 1U;
    c1_copyInfuStatus(chartInstance);
    c1_stopInfusion(chartInstance);
    c1_d81 = (real_T)c1_const_MSG_INFUSIONSTOP;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d81, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 39U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 187U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(187U, (int32_T)_SFD_CCP_CALL(187U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 187;
        sf_debug_transition_conflict_check_begin();
        c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
        if (c1_c_out) {
          transitionList[numTransitions] = 81;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 187U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_ConfirmStop = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionSubMachine = c1_IN_ConfirmStop;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
      chartInstance->c1_temporalCounter_i1 = 0U;
      chartInstance->c1_tp_ConfirmStop = 1U;
      c1_d82 = (real_T)c1_const_MSG_CONFIRMSTOP;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d82, 0, 0U, 0U,
        0U, 0), 0);
      c1_enterinto(chartInstance, 35U);
      c1_copyInfuStatus(chartInstance);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 81U,
                   chartInstance->c1_sfEvent);
      c1_d_out = (CV_TRANSITION_EVAL(81U, (int32_T)_SFD_CCP_CALL(81U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 81U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ConfirmStop = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
        chartInstance->c1_temporalCounter_i1 = 0U;
        chartInstance->c1_tp_Infusing = 1U;
        c1_d83 = (real_T)c1_const_MSG_INFUSING;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d83, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 28U);
        c1_copyInfuStatus(chartInstance);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 263U,
                     chartInstance->c1_sfEvent);
        c1_b_temp = (_SFD_CCP_CALL(263U, 0, (int16_T)chartInstance->c1_infusing >
          0 != 0U, chartInstance->c1_sfEvent) != 0);
        if (c1_b_temp) {
          c1_b_temp = (_SFD_CCP_CALL(263U, 1, (int16_T)
            chartInstance->c1_bolusing > 0 != 0U, chartInstance->c1_sfEvent) !=
                       0);
        }

        c1_c_temp = c1_b_temp;
        if (c1_c_temp) {
          c1_c_temp = (_SFD_CCP_CALL(263U, 2, (int16_T)*(boolean_T *)((char_T *)
            c1_infuStatus + 0) == 0 != 0U, chartInstance->c1_sfEvent) != 0);
        }

        c1_e_out = (CV_TRANSITION_EVAL(263U, (int32_T)c1_c_temp) != 0);
        if (c1_e_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 263U, chartInstance->c1_sfEvent);
          chartInstance->c1_bolusing = FALSE;
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
          c1_d84 = (real_T)c1_const_MSG_STOPBOLUS;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d84, 0, 0U, 0U,
            0U, 0), 0);
          chartInstance->c1_tp_ConfirmStop = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionSubMachine = c1_IN_ConfirmStop;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
          chartInstance->c1_temporalCounter_i1 = 0U;
          chartInstance->c1_tp_ConfirmStop = 1U;
          c1_d85 = (real_T)c1_const_MSG_CONFIRMSTOP;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d85, 0, 0U,
            0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 35U);
          c1_copyInfuStatus(chartInstance);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 233U,
                       chartInstance->c1_sfEvent);
          c1_f_out = (CV_TRANSITION_EVAL(233U, (int32_T)_SFD_CCP_CALL(233U, 0,
            c1_infusionDone(chartInstance, chartInstance->c1_vtbi) == 1.0 != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_f_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 233U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ConfirmStop = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
            chartInstance->c1_temporalCounter_i1 = 0U;
            chartInstance->c1_tp_Infusing = 1U;
            c1_d86 = (real_T)c1_const_MSG_INFUSING;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d86, 0,
              0U, 0U, 0U, 0), 0);
            c1_enterinto(chartInstance, 28U);
            c1_copyInfuStatus(chartInstance);
          } else if (chartInstance->c1_sfEvent == c1_event_E_Clock) {
            if (chartInstance->c1_temporalCounter_i1 == 3) {
              CV_STATE_EVAL(42, 0, 2);
              c1_copyInfuStatus(chartInstance);
            } else {
              CV_STATE_EVAL(42, 0, 1);
            }
          } else {
            CV_STATE_EVAL(42, 0, 1);
          }
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 42U, chartInstance->c1_sfEvent);
}

static void c1_ConfirmPause(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  real_T c1_d87;
  real_T c1_d88;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d89;
  boolean_T c1_d_out;
  real_T c1_d90;
  boolean_T c1_b_temp;
  boolean_T c1_c_temp;
  boolean_T c1_e_out;
  real_T c1_d91;
  real_T c1_d92;
  boolean_T c1_f_out;
  real_T c1_d93;
  c1_InfusionStatus *c1_infuStatus;
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 41U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 230U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(230U, (int32_T)_SFD_CCP_CALL(230U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ConfirmPauseInfusion != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 230U, chartInstance->c1_sfEvent);
    c1_d87 = (real_T)c1_const_MSG_BLANK;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d87, 0, 0U, 0U, 0U,
      0), 0);
    chartInstance->c1_tp_ConfirmPause = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionSubMachine = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionPaused;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionPaused;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionPaused = 1U;
    c1_enterinto(chartInstance, 36U);
    c1_pauseInfusion(chartInstance);
    c1_d88 = (real_T)c1_const_MSG_INFUSIONPAUSED;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d88, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 204U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(204U, (int32_T)_SFD_CCP_CALL(204U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 204;
        sf_debug_transition_conflict_check_begin();
        c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
        if (c1_c_out) {
          transitionList[numTransitions] = 78;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 204U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_ConfirmPause = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionSubMachine = c1_IN_ConfirmPause;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
      chartInstance->c1_temporalCounter_i1 = 0U;
      chartInstance->c1_tp_ConfirmPause = 1U;
      c1_d89 = (real_T)c1_const_MSG_CONFIRMPAUSE;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d89, 0, 0U, 0U,
        0U, 0), 0);
      c1_enterinto(chartInstance, 34U);
      c1_copyInfuStatus(chartInstance);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 78U,
                   chartInstance->c1_sfEvent);
      c1_d_out = (CV_TRANSITION_EVAL(78U, (int32_T)_SFD_CCP_CALL(78U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 78U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ConfirmPause = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
        chartInstance->c1_temporalCounter_i1 = 0U;
        chartInstance->c1_tp_Infusing = 1U;
        c1_d90 = (real_T)c1_const_MSG_INFUSING;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d90, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 28U);
        c1_copyInfuStatus(chartInstance);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 262U,
                     chartInstance->c1_sfEvent);
        c1_b_temp = (_SFD_CCP_CALL(262U, 0, (int16_T)chartInstance->c1_infusing >
          0 != 0U, chartInstance->c1_sfEvent) != 0);
        if (c1_b_temp) {
          c1_b_temp = (_SFD_CCP_CALL(262U, 1, (int16_T)
            chartInstance->c1_bolusing > 0 != 0U, chartInstance->c1_sfEvent) !=
                       0);
        }

        c1_c_temp = c1_b_temp;
        if (c1_c_temp) {
          c1_c_temp = (_SFD_CCP_CALL(262U, 2, (int16_T)*(boolean_T *)((char_T *)
            c1_infuStatus + 0) == 0 != 0U, chartInstance->c1_sfEvent) != 0);
        }

        c1_e_out = (CV_TRANSITION_EVAL(262U, (int32_T)c1_c_temp) != 0);
        if (c1_e_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 262U, chartInstance->c1_sfEvent);
          chartInstance->c1_bolusing = FALSE;
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
          c1_d91 = (real_T)c1_const_MSG_STOPBOLUS;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d91, 0, 0U, 0U,
            0U, 0), 0);
          chartInstance->c1_tp_ConfirmPause = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionSubMachine = c1_IN_ConfirmPause;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
          chartInstance->c1_temporalCounter_i1 = 0U;
          chartInstance->c1_tp_ConfirmPause = 1U;
          c1_d92 = (real_T)c1_const_MSG_CONFIRMPAUSE;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d92, 0, 0U,
            0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 34U);
          c1_copyInfuStatus(chartInstance);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 234U,
                       chartInstance->c1_sfEvent);
          c1_f_out = (CV_TRANSITION_EVAL(234U, (int32_T)_SFD_CCP_CALL(234U, 0,
            c1_infusionDone(chartInstance, chartInstance->c1_vtbi) == 1.0 != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_f_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 234U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ConfirmPause = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
            chartInstance->c1_temporalCounter_i1 = 0U;
            chartInstance->c1_tp_Infusing = 1U;
            c1_d93 = (real_T)c1_const_MSG_INFUSING;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d93, 0,
              0U, 0U, 0U, 0), 0);
            c1_enterinto(chartInstance, 28U);
            c1_copyInfuStatus(chartInstance);
          } else if (chartInstance->c1_sfEvent == c1_event_E_Clock) {
            if (chartInstance->c1_temporalCounter_i1 == 3) {
              CV_STATE_EVAL(41, 0, 2);
              c1_copyInfuStatus(chartInstance);
            } else {
              CV_STATE_EVAL(41, 0, 1);
            }
          } else {
            CV_STATE_EVAL(41, 0, 1);
          }
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 41U, chartInstance->c1_sfEvent);
}

static void c1_InfusionPaused(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_b_temp;
  boolean_T c1_out;
  real_T c1_d94;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  real_T c1_d95;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  real_T c1_d96;
  boolean_T c1_g_out;
  real_T c1_d97;
  boolean_T c1_h_out;
  real_T *c1_ErrCond;
  c1_ErrCond = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 34U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 86U, chartInstance->c1_sfEvent);
  c1_b_temp = (_SFD_CCP_CALL(86U, 0, chartInstance->c1_sfEvent ==
    c1_event_E_Alarm != 0U, chartInstance->c1_sfEvent) != 0);
  if (c1_b_temp) {
    c1_b_temp = (_SFD_CCP_CALL(86U, 1, *c1_ErrCond == 13.0 != 0U,
      chartInstance->c1_sfEvent) != 0);
  }

  c1_out = (CV_TRANSITION_EVAL(86U, (int32_T)c1_b_temp) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 86U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionPaused = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_PausedTooLong;
    chartInstance->c1_was_InfusionInSession = c1_IN_PausedTooLong;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_PausedTooLong = 1U;
    c1_enterinto(chartInstance, 37U);
    c1_d94 = (real_T)c1_const_MSG_PAUSETOOLONG;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d94, 0, 0U, 0U, 0U,
      0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 184U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(184U, (int32_T)_SFD_CCP_CALL(184U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[3];
        unsigned int numTransitions = 1;
        transitionList[0] = 184;
        sf_debug_transition_conflict_check_begin();
        c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_StopInfusion);
        if (c1_c_out) {
          transitionList[numTransitions] = 89;
          numTransitions++;
        }

        c1_d_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
        if (c1_d_out) {
          transitionList[numTransitions] = 225;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 184U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_InfusionPaused = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionInSession = c1_IN_InfusionPaused;
      chartInstance->c1_was_InfusionInSession = c1_IN_InfusionPaused;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_InfusionPaused = 1U;
      c1_enterinto(chartInstance, 36U);
      c1_pauseInfusion(chartInstance);
      c1_d95 = (real_T)c1_const_MSG_INFUSIONPAUSED;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d95, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 89U,
                   chartInstance->c1_sfEvent);
      c1_e_out = (CV_TRANSITION_EVAL(89U, (int32_T)_SFD_CCP_CALL(89U, 0,
        chartInstance->c1_sfEvent == c1_event_E_StopInfusion != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_e_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 89;
          sf_debug_transition_conflict_check_begin();
          c1_f_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
          if (c1_f_out) {
            transitionList[numTransitions] = 225;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 89U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_InfusionPaused = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionInSession = c1_IN_PausedStopConfirm;
        chartInstance->c1_was_InfusionInSession = c1_IN_PausedStopConfirm;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_PausedStopConfirm = 1U;
        c1_d96 = (real_T)c1_const_MSG_SPCHOOSE;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d96, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 38U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 225U,
                     chartInstance->c1_sfEvent);
        c1_g_out = (CV_TRANSITION_EVAL(225U, (int32_T)_SFD_CCP_CALL(225U, 0,
          chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_g_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 225U, chartInstance->c1_sfEvent);
          c1_resumeInfusion(chartInstance);
          chartInstance->c1_tp_InfusionPaused = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionInSession = c1_IN_InfusionSubMachine;
          chartInstance->c1_was_InfusionInSession = c1_IN_InfusionSubMachine;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_InfusionSubMachine = 1U;
          chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
          chartInstance->c1_temporalCounter_i1 = 0U;
          chartInstance->c1_tp_Infusing = 1U;
          c1_d97 = (real_T)c1_const_MSG_INFUSING;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d97, 0, 0U,
            0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 28U);
          c1_copyInfuStatus(chartInstance);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 8U,
                       chartInstance->c1_sfEvent);
          c1_h_out = (CV_TRANSITION_EVAL(8U, (int32_T)_SFD_CCP_CALL(8U, 0,
            c1_alrmLevel(chartInstance) == 2U != 0U, chartInstance->c1_sfEvent))
                      != 0);
          if (c1_h_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 8U, chartInstance->c1_sfEvent);
            c1_pauseInfusion(chartInstance);
            chartInstance->c1_tp_InfusionPaused = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_InfusionInSession = c1_IN_LevelTwoAlarming;
            chartInstance->c1_was_InfusionInSession = c1_IN_LevelTwoAlarming;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_LevelTwoAlarming = 1U;
            c1_enter_atomic_LevelTwoAlarming(chartInstance);
          }
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 34U, chartInstance->c1_sfEvent);
}

static void c1_ReadyToStart(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  real_T c1_x;
  real_T c1_d98;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  real_T c1_d99;
  real_T c1_d100;
  real_T *c1_O_ProgrammedFlowRate;
  real_T *c1_O_ProgrammedVTBI;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  boolean_T *c1_O_BolusRequested;
  c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c1_O_ProgrammedVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 26U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 188U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(188U, (int32_T)_SFD_CCP_CALL(188U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Ready != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 188U, chartInstance->c1_sfEvent);
    sf_debug_symbol_scope_push(1U, 0U);
    sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
      c1_f_sf_marshallIn);
    _SFD_SET_DATA_VALUE_PTR(131U, &c1_x);
    _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 82U, chartInstance->c1_sfEvent);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 82U, chartInstance->c1_sfEvent);
    c1_x = 0.0;
    _SFD_DATA_RANGE_CHECK(c1_x, 131U);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 251U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 251U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 252U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 252U, chartInstance->c1_sfEvent);
    *c1_O_ProgrammedFlowRate = c1_calcFlowRate(chartInstance,
      chartInstance->c1_doseRate);
    _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedFlowRate, 6U);
    *c1_O_ProgrammedVTBI = chartInstance->c1_vtbi;
    _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedVTBI, 5U);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 253U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 253U, chartInstance->c1_sfEvent);
    *c1_O_InfusionInProgress = TRUE;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionInProgress, 2U);
    *c1_O_InfusionPaused = FALSE;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionPaused, 3U);
    *c1_O_BolusRequested = FALSE;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_BolusRequested, 4U);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 254U,
                 chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 254U, chartInstance->c1_sfEvent);
    chartInstance->c1_infusing = TRUE;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_infusing, 84U);
    chartInstance->c1_bolusing = FALSE;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
    _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 82U, chartInstance->c1_sfEvent);
    _SFD_UNSET_DATA_VALUE_PTR(131U);
    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 82U, chartInstance->c1_sfEvent);
    sf_debug_symbol_scope_pop();
    chartInstance->c1_tp_ReadyToStart = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ConfigureInfusionProgram = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 16U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_InfusionInSession;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 30U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionInSession = 1U;
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionSubMachine;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionSubMachine;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionSubMachine = 1U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
    chartInstance->c1_temporalCounter_i1 = 0U;
    chartInstance->c1_tp_Infusing = 1U;
    c1_d98 = (real_T)c1_const_MSG_INFUSING;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d98, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 28U);
    c1_copyInfuStatus(chartInstance);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 80U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(80U, (int32_T)_SFD_CCP_CALL(80U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 80;
        sf_debug_transition_conflict_check_begin();
        c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_NotReady);
        if (c1_c_out) {
          transitionList[numTransitions] = 112;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 80U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_ReadyToStart = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ReadyToStart;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ReadyToStart;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ReadyToStart = 1U;
      c1_enterinto(chartInstance, 48U);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 112U,
                   chartInstance->c1_sfEvent);
      c1_d_out = (CV_TRANSITION_EVAL(112U, (int32_T)_SFD_CCP_CALL(112U, 0,
        chartInstance->c1_sfEvent == c1_event_E_NotReady != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_d_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 112U, chartInstance->c1_sfEvent);
        c1_d99 = (real_T)c1_const_MSG_NOTREADY;
        sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d99, 0, 0U, 0U,
          0U, 0), 0);
        chartInstance->c1_tp_ReadyToStart = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplaySettings;
        chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplaySettings;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_DisplaySettings = 1U;
        c1_enterinto(chartInstance, 27U);
        c1_d100 = (real_T)c1_const_MSG_DISPLAYSET;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d100, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 26U, chartInstance->c1_sfEvent);
}

static void c1_PausedStopConfirm(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d101;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d102;
  boolean_T c1_f_out;
  real_T c1_d103;
  boolean_T c1_g_out;
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 45U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 91U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(91U, (int32_T)_SFD_CCP_CALL(91U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ConfirmStopInfusion != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 91;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_b_out) {
        transitionList[numTransitions] = 196;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
      if (c1_c_out) {
        transitionList[numTransitions] = 90;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 91U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_PausedStopConfirm = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionStopped = 1U;
    c1_copyInfuStatus(chartInstance);
    c1_stopInfusion(chartInstance);
    c1_d101 = (real_T)c1_const_MSG_INFUSIONSTOP;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d101, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 39U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 196U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(196U, (int32_T)_SFD_CCP_CALL(196U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 196;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
        if (c1_e_out) {
          transitionList[numTransitions] = 90;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 196U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_PausedStopConfirm = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionInSession = c1_IN_PausedStopConfirm;
      chartInstance->c1_was_InfusionInSession = c1_IN_PausedStopConfirm;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_PausedStopConfirm = 1U;
      c1_d102 = (real_T)c1_const_MSG_SPCHOOSE;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d102, 0, 0U,
        0U, 0U, 0), 0);
      c1_enterinto(chartInstance, 38U);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 90U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(90U, (int32_T)_SFD_CCP_CALL(90U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 90U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_PausedStopConfirm = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionInSession = c1_IN_InfusionPaused;
        chartInstance->c1_was_InfusionInSession = c1_IN_InfusionPaused;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_InfusionPaused = 1U;
        c1_enterinto(chartInstance, 36U);
        c1_pauseInfusion(chartInstance);
        c1_d103 = (real_T)c1_const_MSG_INFUSIONPAUSED;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d103, 0, 0U,
          0U, 0U, 0), 0);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 160U,
                     chartInstance->c1_sfEvent);
        c1_g_out = (CV_TRANSITION_EVAL(160U, (int32_T)_SFD_CCP_CALL(160U, 0,
          c1_alrmLevel(chartInstance) == 2U != 0U, chartInstance->c1_sfEvent))
                    != 0);
        if (c1_g_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 160U, chartInstance->c1_sfEvent);
          c1_pauseInfusion(chartInstance);
          chartInstance->c1_tp_PausedStopConfirm = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionInSession = c1_IN_LevelTwoAlarming;
          chartInstance->c1_was_InfusionInSession = c1_IN_LevelTwoAlarming;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_LevelTwoAlarming = 1U;
          c1_enter_atomic_LevelTwoAlarming(chartInstance);
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 45U, chartInstance->c1_sfEvent);
}

static void c1_InfusionStopped(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  real_T c1_d104;
  boolean_T c1_b_out;
  real_T c1_d105;
  c1_PumpConfigurationsStatus *c1_pumpConfigData;
  c1_pumpConfigData = (c1_PumpConfigurationsStatus *)ssGetInputPortSignal
    (chartInstance->S, 6);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 35U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 79U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(79U, (int32_T)_SFD_CCP_CALL(79U, 0,
              chartInstance->c1_sfEvent == c1_event_E_NewInfusion != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 79U, chartInstance->c1_sfEvent);
    c1_resetInfusionInstructions(chartInstance);
    c1_initInfuStatus(chartInstance);
    chartInstance->c1_tp_InfusionStopped = 0U;
    chartInstance->c1_is_InfusionInSession = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionInSession = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 30U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_CheckDrugRoutine;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDrugRoutine = 1U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckAdminSet;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckAdminSet;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckAdminSet = 1U;
    c1_enterinto(chartInstance, 5U);
    c1_d104 = (real_T)c1_const_MSG_ADMINCHECK;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d104, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = (uint32_T)*(boolean_T *)((char_T *)
      c1_pumpConfigData + 2);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 181U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(181U, (int32_T)_SFD_CCP_CALL(181U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 181U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_InfusionStopped = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
      chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_InfusionStopped = 1U;
      c1_copyInfuStatus(chartInstance);
      c1_stopInfusion(chartInstance);
      c1_d105 = (real_T)c1_const_MSG_INFUSIONSTOP;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d105, 0, 0U,
        0U, 0U, 0), 0);
      c1_enterinto(chartInstance, 39U);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 35U, chartInstance->c1_sfEvent);
}

static void c1_enter_atomic_CheckDrugWhileInfusing
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_d106;
  real_T c1_x;
  boolean_T c1_flag;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  boolean_T c1_g_out;
  boolean_T c1_h_out;
  boolean_T c1_i_out;
  c1_d106 = (real_T)c1_const_MSG_CHECKTYPE;
  sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d106, 0, 0U, 0U,
    0U, 0), 0);
  sf_mex_printf("%s =\\n", "ml.GMsgConStr");
  sf_mex_call_debug("disp", 0U, 1U, 14, sf_mex_get_ml_var("GMsgConStr", 0));
  c1_enterinto(chartInstance, 41U);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("flag", &c1_flag, c1_f_sf_marshallOut,
    c1_e_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(112U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(113U, &c1_flag);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 56U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 56U, chartInstance->c1_sfEvent);
  c1_flag = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)c1_flag, 113U);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 112U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 171U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 171U, chartInstance->c1_sfEvent);
  c1_flag = (c1_checkDrugType(chartInstance) != 0U);
  _SFD_DATA_RANGE_CHECK((real_T)c1_flag, 113U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 44U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(44U, (int32_T)_SFD_CCP_CALL(44U, 0, (int16_T)
              c1_flag == 1 != 0U, chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 44;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = ((int16_T)c1_flag == 0);
      if (c1_b_out) {
        transitionList[numTransitions] = 242;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
    c1_x = 1.0;
    _SFD_DATA_RANGE_CHECK(c1_x, 112U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 242U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(242U, (int32_T)_SFD_CCP_CALL(242U, 0,
      (int16_T)c1_flag == 0 != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 242U, chartInstance->c1_sfEvent);
      c1_flag = (c1_checkDrugUnits(chartInstance) != 0.0);
      _SFD_DATA_RANGE_CHECK((real_T)c1_flag, 113U);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 217U,
                   chartInstance->c1_sfEvent);
      c1_d_out = (CV_TRANSITION_EVAL(217U, (int32_T)_SFD_CCP_CALL(217U, 0,
        (int16_T)c1_flag == 1 != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_d_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 217;
          sf_debug_transition_conflict_check_begin();
          c1_e_out = ((int16_T)c1_flag == 0);
          if (c1_e_out) {
            transitionList[numTransitions] = 239;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 217U, chartInstance->c1_sfEvent);
        c1_x = 1.0;
        _SFD_DATA_RANGE_CHECK(c1_x, 112U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 239U,
                     chartInstance->c1_sfEvent);
        c1_f_out = (CV_TRANSITION_EVAL(239U, (int32_T)_SFD_CCP_CALL(239U, 0,
          (int16_T)c1_flag == 0 != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_f_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 239U, chartInstance->c1_sfEvent);
          c1_flag = (c1_checkDrugConcentration(chartInstance) != 0.0);
          _SFD_DATA_RANGE_CHECK((real_T)c1_flag, 113U);
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 241U,
                       chartInstance->c1_sfEvent);
          c1_g_out = (CV_TRANSITION_EVAL(241U, (int32_T)_SFD_CCP_CALL(241U, 0,
            (int16_T)c1_flag > 0 != 0U, chartInstance->c1_sfEvent)) != 0);
          if (c1_g_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[2];
              unsigned int numTransitions = 1;
              transitionList[0] = 241;
              sf_debug_transition_conflict_check_begin();
              c1_h_out = ((int16_T)c1_flag == 0);
              if (c1_h_out) {
                transitionList[numTransitions] = 240;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 241U, chartInstance->c1_sfEvent);
            c1_x = 1.0;
            _SFD_DATA_RANGE_CHECK(c1_x, 112U);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 240U,
                         chartInstance->c1_sfEvent);
            c1_i_out = (CV_TRANSITION_EVAL(240U, (int32_T)_SFD_CCP_CALL(240U, 0,
                          (int16_T)c1_flag == 0 != 0U, chartInstance->c1_sfEvent))
                        != 0);
            if (c1_i_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 240U,
                           chartInstance->c1_sfEvent);
              c1_x = 0.0;
              _SFD_DATA_RANGE_CHECK(c1_x, 112U);
            }
          }
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 56U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(112U);
  _SFD_UNSET_DATA_VALUE_PTR(113U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 56U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  chartInstance->c1_tempx = (uint32_T)c1_x;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
}

static void c1_enter_atomic_LevelTwoAlarming(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  real_T c1_hoistedGlobal;
  uint32_T c1_fCond;
  uint32_T c1_x;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  boolean_T c1_g_out;
  boolean_T c1_h_out;
  boolean_T c1_i_out;
  real_T c1_d107;
  boolean_T c1_j_out;
  boolean_T c1_k_out;
  boolean_T c1_l_out;
  boolean_T c1_m_out;
  boolean_T c1_n_out;
  boolean_T c1_o_out;
  boolean_T c1_p_out;
  boolean_T c1_q_out;
  real_T c1_d108;
  boolean_T c1_r_out;
  boolean_T c1_s_out;
  boolean_T c1_t_out;
  boolean_T c1_u_out;
  boolean_T c1_v_out;
  boolean_T c1_w_out;
  boolean_T c1_x_out;
  real_T c1_d109;
  boolean_T c1_y_out;
  boolean_T c1_ab_out;
  boolean_T c1_bb_out;
  boolean_T c1_cb_out;
  boolean_T c1_db_out;
  boolean_T c1_eb_out;
  real_T c1_d110;
  boolean_T c1_fb_out;
  boolean_T c1_gb_out;
  boolean_T c1_hb_out;
  boolean_T c1_ib_out;
  boolean_T c1_jb_out;
  real_T c1_d111;
  boolean_T c1_kb_out;
  boolean_T c1_lb_out;
  boolean_T c1_mb_out;
  boolean_T c1_nb_out;
  real_T c1_d112;
  boolean_T c1_ob_out;
  boolean_T c1_pb_out;
  boolean_T c1_qb_out;
  real_T c1_d113;
  boolean_T c1_rb_out;
  boolean_T c1_sb_out;
  real_T c1_d114;
  boolean_T c1_tb_out;
  real_T c1_d115;
  real_T *c1_ErrCond;
  uint32_T *c1_O_AlarmCond;
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_ErrCond = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
  c1_enterinto(chartInstance, 44U);
  c1_hoistedGlobal = *c1_ErrCond;
  c1_fCond = c1__u32_d_(chartInstance, c1_hoistedGlobal);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("fCond", &c1_fCond, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK((real_T)c1_fCond, 103U);
  _SFD_SET_DATA_VALUE_PTR(104U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(103U, &c1_fCond);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 79U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 79U, chartInstance->c1_sfEvent);
  c1_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x, 104U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 131U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 131U, chartInstance->c1_sfEvent);
  *c1_O_AlarmCond = c1_fCond;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 133U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(133U, (int32_T)_SFD_CCP_CALL(133U, 0, c1_fCond ==
              7U != 0U, chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[9];
      unsigned int numTransitions = 1;
      transitionList[0] = 133;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (c1_fCond == 8U);
      if (c1_b_out) {
        transitionList[numTransitions] = 134;
        numTransitions++;
      }

      c1_c_out = (c1_fCond == 9U);
      if (c1_c_out) {
        transitionList[numTransitions] = 127;
        numTransitions++;
      }

      c1_d_out = (c1_fCond == 10U);
      if (c1_d_out) {
        transitionList[numTransitions] = 136;
        numTransitions++;
      }

      c1_e_out = (c1_fCond == 11U);
      if (c1_e_out) {
        transitionList[numTransitions] = 137;
        numTransitions++;
      }

      c1_f_out = (c1_fCond == 12U);
      if (c1_f_out) {
        transitionList[numTransitions] = 138;
        numTransitions++;
      }

      c1_g_out = (c1_fCond == 13U);
      if (c1_g_out) {
        transitionList[numTransitions] = 139;
        numTransitions++;
      }

      c1_h_out = (c1_fCond == 14U);
      if (c1_h_out) {
        transitionList[numTransitions] = 125;
        numTransitions++;
      }

      c1_i_out = (c1_fCond == 15U);
      if (c1_i_out) {
        transitionList[numTransitions] = 130;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 133U, chartInstance->c1_sfEvent);
    c1_d107 = (real_T)c1_const_MSG_DOOROPEN;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d107, 0, 0U, 0U, 0U,
      0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 134U,
                 chartInstance->c1_sfEvent);
    c1_j_out = (CV_TRANSITION_EVAL(134U, (int32_T)_SFD_CCP_CALL(134U, 0,
      c1_fCond == 8U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_j_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[8];
        unsigned int numTransitions = 1;
        transitionList[0] = 134;
        sf_debug_transition_conflict_check_begin();
        c1_k_out = (c1_fCond == 9U);
        if (c1_k_out) {
          transitionList[numTransitions] = 127;
          numTransitions++;
        }

        c1_l_out = (c1_fCond == 10U);
        if (c1_l_out) {
          transitionList[numTransitions] = 136;
          numTransitions++;
        }

        c1_m_out = (c1_fCond == 11U);
        if (c1_m_out) {
          transitionList[numTransitions] = 137;
          numTransitions++;
        }

        c1_n_out = (c1_fCond == 12U);
        if (c1_n_out) {
          transitionList[numTransitions] = 138;
          numTransitions++;
        }

        c1_o_out = (c1_fCond == 13U);
        if (c1_o_out) {
          transitionList[numTransitions] = 139;
          numTransitions++;
        }

        c1_p_out = (c1_fCond == 14U);
        if (c1_p_out) {
          transitionList[numTransitions] = 125;
          numTransitions++;
        }

        c1_q_out = (c1_fCond == 15U);
        if (c1_q_out) {
          transitionList[numTransitions] = 130;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 134U, chartInstance->c1_sfEvent);
      c1_d108 = (real_T)c1_const_MSG_EMPTYRESERVOIR;
      sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d108, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 127U,
                   chartInstance->c1_sfEvent);
      c1_r_out = (CV_TRANSITION_EVAL(127U, (int32_T)_SFD_CCP_CALL(127U, 0,
        c1_fCond == 9U != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_r_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[7];
          unsigned int numTransitions = 1;
          transitionList[0] = 127;
          sf_debug_transition_conflict_check_begin();
          c1_s_out = (c1_fCond == 10U);
          if (c1_s_out) {
            transitionList[numTransitions] = 136;
            numTransitions++;
          }

          c1_t_out = (c1_fCond == 11U);
          if (c1_t_out) {
            transitionList[numTransitions] = 137;
            numTransitions++;
          }

          c1_u_out = (c1_fCond == 12U);
          if (c1_u_out) {
            transitionList[numTransitions] = 138;
            numTransitions++;
          }

          c1_v_out = (c1_fCond == 13U);
          if (c1_v_out) {
            transitionList[numTransitions] = 139;
            numTransitions++;
          }

          c1_w_out = (c1_fCond == 14U);
          if (c1_w_out) {
            transitionList[numTransitions] = 125;
            numTransitions++;
          }

          c1_x_out = (c1_fCond == 15U);
          if (c1_x_out) {
            transitionList[numTransitions] = 130;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 127U, chartInstance->c1_sfEvent);
        c1_d109 = (real_T)c1_const_MSG_OCCULUSION;
        sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d109, 0, 0U, 0U,
          0U, 0), 0);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 136U,
                     chartInstance->c1_sfEvent);
        c1_y_out = (CV_TRANSITION_EVAL(136U, (int32_T)_SFD_CCP_CALL(136U, 0,
          c1_fCond == 10U != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_y_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[6];
            unsigned int numTransitions = 1;
            transitionList[0] = 136;
            sf_debug_transition_conflict_check_begin();
            c1_ab_out = (c1_fCond == 11U);
            if (c1_ab_out) {
              transitionList[numTransitions] = 137;
              numTransitions++;
            }

            c1_bb_out = (c1_fCond == 12U);
            if (c1_bb_out) {
              transitionList[numTransitions] = 138;
              numTransitions++;
            }

            c1_cb_out = (c1_fCond == 13U);
            if (c1_cb_out) {
              transitionList[numTransitions] = 139;
              numTransitions++;
            }

            c1_db_out = (c1_fCond == 14U);
            if (c1_db_out) {
              transitionList[numTransitions] = 125;
              numTransitions++;
            }

            c1_eb_out = (c1_fCond == 15U);
            if (c1_eb_out) {
              transitionList[numTransitions] = 130;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 136U, chartInstance->c1_sfEvent);
          c1_d110 = (real_T)c1_const_MSG_OVERINFUSION;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d110, 0, 0U,
            0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 137U,
                       chartInstance->c1_sfEvent);
          c1_fb_out = (CV_TRANSITION_EVAL(137U, (int32_T)_SFD_CCP_CALL(137U, 0,
            c1_fCond == 11U != 0U, chartInstance->c1_sfEvent)) != 0);
          if (c1_fb_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[5];
              unsigned int numTransitions = 1;
              transitionList[0] = 137;
              sf_debug_transition_conflict_check_begin();
              c1_gb_out = (c1_fCond == 12U);
              if (c1_gb_out) {
                transitionList[numTransitions] = 138;
                numTransitions++;
              }

              c1_hb_out = (c1_fCond == 13U);
              if (c1_hb_out) {
                transitionList[numTransitions] = 139;
                numTransitions++;
              }

              c1_ib_out = (c1_fCond == 14U);
              if (c1_ib_out) {
                transitionList[numTransitions] = 125;
                numTransitions++;
              }

              c1_jb_out = (c1_fCond == 15U);
              if (c1_jb_out) {
                transitionList[numTransitions] = 130;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 137U, chartInstance->c1_sfEvent);
            c1_d111 = (real_T)c1_const_MSG_UNDERINFUSION;
            sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d111, 0, 0U,
              0U, 0U, 0), 0);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 138U,
                         chartInstance->c1_sfEvent);
            c1_kb_out = (CV_TRANSITION_EVAL(138U, (int32_T)_SFD_CCP_CALL(138U, 0,
              c1_fCond == 12U != 0U, chartInstance->c1_sfEvent)) != 0);
            if (c1_kb_out) {
              if (sf_debug_transition_conflict_check_enabled()) {
                unsigned int transitionList[4];
                unsigned int numTransitions = 1;
                transitionList[0] = 138;
                sf_debug_transition_conflict_check_begin();
                c1_lb_out = (c1_fCond == 13U);
                if (c1_lb_out) {
                  transitionList[numTransitions] = 139;
                  numTransitions++;
                }

                c1_mb_out = (c1_fCond == 14U);
                if (c1_mb_out) {
                  transitionList[numTransitions] = 125;
                  numTransitions++;
                }

                c1_nb_out = (c1_fCond == 15U);
                if (c1_nb_out) {
                  transitionList[numTransitions] = 130;
                  numTransitions++;
                }

                sf_debug_transition_conflict_check_end();
                if (numTransitions > 1) {
                  _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
                }
              }

              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 138U,
                           chartInstance->c1_sfEvent);
              c1_d112 = (real_T)c1_const_MSG_LESSTHANKVO;
              sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d112, 0,
                0U, 0U, 0U, 0), 0);
            } else {
              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 139U,
                           chartInstance->c1_sfEvent);
              c1_ob_out = (CV_TRANSITION_EVAL(139U, (int32_T)_SFD_CCP_CALL(139U,
                0, c1_fCond == 13U != 0U, chartInstance->c1_sfEvent)) != 0);
              if (c1_ob_out) {
                if (sf_debug_transition_conflict_check_enabled()) {
                  unsigned int transitionList[3];
                  unsigned int numTransitions = 1;
                  transitionList[0] = 139;
                  sf_debug_transition_conflict_check_begin();
                  c1_pb_out = (c1_fCond == 14U);
                  if (c1_pb_out) {
                    transitionList[numTransitions] = 125;
                    numTransitions++;
                  }

                  c1_qb_out = (c1_fCond == 15U);
                  if (c1_qb_out) {
                    transitionList[numTransitions] = 130;
                    numTransitions++;
                  }

                  sf_debug_transition_conflict_check_end();
                  if (numTransitions > 1) {
                    _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
                  }
                }

                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 139U,
                             chartInstance->c1_sfEvent);
                c1_d113 = (real_T)c1_const_MSG_RATEEXCEEDCAPACITY;
                sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d113, 0,
                  0U, 0U, 0U, 0), 0);
              } else {
                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 125U,
                             chartInstance->c1_sfEvent);
                c1_rb_out = (CV_TRANSITION_EVAL(125U, (int32_T)_SFD_CCP_CALL
                  (125U, 0, c1_fCond == 14U != 0U, chartInstance->c1_sfEvent))
                             != 0);
                if (c1_rb_out) {
                  if (sf_debug_transition_conflict_check_enabled()) {
                    unsigned int transitionList[2];
                    unsigned int numTransitions = 1;
                    transitionList[0] = 125;
                    sf_debug_transition_conflict_check_begin();
                    c1_sb_out = (c1_fCond == 15U);
                    if (c1_sb_out) {
                      transitionList[numTransitions] = 130;
                      numTransitions++;
                    }

                    sf_debug_transition_conflict_check_end();
                    if (numTransitions > 1) {
                      _SFD_TRANSITION_CONFLICT(&(transitionList[0]),
                        numTransitions);
                    }
                  }

                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 125U,
                               chartInstance->c1_sfEvent);
                  c1_d114 = (real_T)c1_const_MSG_PAUSETOOLONG;
                  sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d114,
                    0, 0U, 0U, 0U, 0), 0);
                } else {
                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 130U,
                               chartInstance->c1_sfEvent);
                  c1_tb_out = (CV_TRANSITION_EVAL(130U, (int32_T)_SFD_CCP_CALL
                    (130U, 0, c1_fCond == 15U != 0U, chartInstance->c1_sfEvent))
                               != 0);
                  if (c1_tb_out) {
                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 130U,
                                 chartInstance->c1_sfEvent);
                    c1_d115 = (real_T)c1_const_MSG_AIRINLINE;
                    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d115,
                      0, 0U, 0U, 0U, 0), 0);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 79U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(104U);
  _SFD_UNSET_DATA_VALUE_PTR(103U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 79U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
}

static void c1_LevelTwoAlarming(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d116;
  boolean_T c1_f_out;
  real_T c1_d117;
  boolean_T c1_g_out;
  real_T c1_d118;
  real_T *c1_ErrCond;
  c1_ErrCond = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 44U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 178U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(178U, (int32_T)_SFD_CCP_CALL(178U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 178;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_StopInfusion);
      if (c1_b_out) {
        transitionList[numTransitions] = 117;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_ClearAlarm);
      if (c1_c_out) {
        transitionList[numTransitions] = 227;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 178U, chartInstance->c1_sfEvent);
    c1_warning(chartInstance);
    chartInstance->c1_tp_LevelTwoAlarming = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_LevelTwoAlarming;
    chartInstance->c1_was_InfusionInSession = c1_IN_LevelTwoAlarming;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_LevelTwoAlarming = 1U;
    c1_enter_atomic_LevelTwoAlarming(chartInstance);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 117U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(117U, (int32_T)_SFD_CCP_CALL(117U, 0,
      chartInstance->c1_sfEvent == c1_event_E_StopInfusion != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 117;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_ClearAlarm);
        if (c1_e_out) {
          transitionList[numTransitions] = 227;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 117U, chartInstance->c1_sfEvent);
      c1_clearLevel2Alarm(chartInstance);
      chartInstance->c1_tp_LevelTwoAlarming = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
      chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_InfusionStopped = 1U;
      c1_copyInfuStatus(chartInstance);
      c1_stopInfusion(chartInstance);
      c1_d116 = (real_T)c1_const_MSG_INFUSIONSTOP;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d116, 0, 0U,
        0U, 0U, 0), 0);
      c1_enterinto(chartInstance, 39U);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 227U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(227U, (int32_T)_SFD_CCP_CALL(227U, 0,
        chartInstance->c1_sfEvent == c1_event_E_ClearAlarm != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 227U, chartInstance->c1_sfEvent);
        c1_clearLevel2Alarm(chartInstance);
        c1_resumeInfusion(chartInstance);
        chartInstance->c1_tp_LevelTwoAlarming = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionInSession = c1_IN_InfusionSubMachine;
        chartInstance->c1_was_InfusionInSession = c1_IN_InfusionSubMachine;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_InfusionSubMachine = 1U;
        chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
        chartInstance->c1_temporalCounter_i1 = 0U;
        chartInstance->c1_tp_Infusing = 1U;
        c1_d117 = (real_T)c1_const_MSG_INFUSING;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d117, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 28U);
        c1_copyInfuStatus(chartInstance);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 110U,
                     chartInstance->c1_sfEvent);
        c1_g_out = (CV_TRANSITION_EVAL(110U, (int32_T)_SFD_CCP_CALL(110U, 0,
          *c1_ErrCond == 7.0 != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_g_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 110U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_LevelTwoAlarming = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionInSession = c1_IN_EmptyReservoir;
          chartInstance->c1_was_InfusionInSession = c1_IN_EmptyReservoir;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_EmptyReservoir = 1U;
          c1_enterinto(chartInstance, 40U);
          c1_d118 = (real_T)c1_const_MSG_EMPTYRESERVOIR;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d118, 0, 0U,
            0U, 0U, 0), 0);
        }
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 44U, chartInstance->c1_sfEvent);
}

static void c1_InfusionSubMachine(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  real_T c1_x;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d119;
  boolean_T c1_d_out;
  real_T c1_d120;
  real_T c1_d121;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  real_T c1_d122;
  boolean_T c1_g_out;
  real_T c1_d123;
  boolean_T *c1_O_BolusRequested;
  real_T *c1_O_ProgrammedFlowRate;
  c1_InfusionStatus *c1_infuStatus;
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 36U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 114U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(114U, (int32_T)_SFD_CCP_CALL(114U, 0,
              c1_alrmLevel(chartInstance) == 2U != 0U, chartInstance->c1_sfEvent))
            != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 114U, chartInstance->c1_sfEvent);
    c1_pauseInfusion(chartInstance);
    c1_exit_internal_InfusionSubMachine(chartInstance);
    chartInstance->c1_tp_InfusionSubMachine = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_LevelTwoAlarming;
    chartInstance->c1_was_InfusionInSession = c1_IN_LevelTwoAlarming;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 44U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_LevelTwoAlarming = 1U;
    c1_enter_atomic_LevelTwoAlarming(chartInstance);
  } else {
    switch (chartInstance->c1_is_InfusionSubMachine) {
     case c1_IN_ALM_NewRateOutBound:
      CV_STATE_EVAL(36, 0, 1);
      c1_ALM_NewRateOutBound(chartInstance);
      break;

     case c1_IN_BolusRequest:
      CV_STATE_EVAL(36, 0, 2);
      _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 38U,
                   chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 206U,
                   chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 206U, chartInstance->c1_sfEvent);
      *c1_O_BolusRequested = FALSE;
      _SFD_DATA_RANGE_CHECK((real_T)*c1_O_BolusRequested, 4U);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 209U,
                   chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 209U, chartInstance->c1_sfEvent);
      sf_debug_symbol_scope_push(1U, 0U);
      sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
        c1_f_sf_marshallIn);
      _SFD_SET_DATA_VALUE_PTR(118U, &c1_x);
      _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 64U, chartInstance->c1_sfEvent);
      _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 64U,
                   chartInstance->c1_sfEvent);
      c1_x = 0.0;
      _SFD_DATA_RANGE_CHECK(c1_x, 118U);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 93U,
                   chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 93U, chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 85U,
                   chartInstance->c1_sfEvent);
      c1_b_out = (CV_TRANSITION_EVAL(85U, (int32_T)_SFD_CCP_CALL(85U, 0,
        (int16_T)*(boolean_T *)((char_T *)c1_infuStatus + 0) == 1 != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_b_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 85;
          sf_debug_transition_conflict_check_begin();
          c1_c_out = ((int16_T)*(boolean_T *)((char_T *)c1_infuStatus + 0) == 0);
          if (c1_c_out) {
            transitionList[numTransitions] = 208;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 85U, chartInstance->c1_sfEvent);
        chartInstance->c1_bolusing = TRUE;
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
        c1_d119 = (real_T)c1_const_MSG_BOLUSGRANT;
        sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d119, 0, 0U, 0U,
          0U, 0), 0);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 208U,
                     chartInstance->c1_sfEvent);
        c1_d_out = (CV_TRANSITION_EVAL(208U, (int32_T)_SFD_CCP_CALL(208U, 0,
          (int16_T)*(boolean_T *)((char_T *)c1_infuStatus + 0) == 0 != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_d_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 208U, chartInstance->c1_sfEvent);
          c1_d120 = (real_T)c1_const_MSG_BOLUSDENIED;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d120, 0, 0U,
            0U, 0U, 0), 0);
        }
      }

      _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 64U, chartInstance->c1_sfEvent);
      _SFD_UNSET_DATA_VALUE_PTR(118U);
      _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 64U, chartInstance->c1_sfEvent);
      sf_debug_symbol_scope_pop();
      chartInstance->c1_tp_BolusRequest = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 38U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
      chartInstance->c1_temporalCounter_i1 = 0U;
      chartInstance->c1_tp_Infusing = 1U;
      c1_d121 = (real_T)c1_const_MSG_INFUSING;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d121, 0, 0U,
        0U, 0U, 0), 0);
      c1_enterinto(chartInstance, 28U);
      c1_copyInfuStatus(chartInstance);
      _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 38U, chartInstance->c1_sfEvent);
      break;

     case c1_IN_ChangeRate:
      CV_STATE_EVAL(36, 0, 3);
      c1_ChangeRate(chartInstance);
      break;

     case c1_IN_CheckNewRate:
      CV_STATE_EVAL(36, 0, 4);
      _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 40U,
                   chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 73U,
                   chartInstance->c1_sfEvent);
      c1_e_out = (CV_TRANSITION_EVAL(73U, (int32_T)_SFD_CCP_CALL(73U, 0,
        chartInstance->c1_tempx > 0U != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_e_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 73;
          sf_debug_transition_conflict_check_begin();
          c1_f_out = (chartInstance->c1_tempx == 0U);
          if (c1_f_out) {
            transitionList[numTransitions] = 74;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 73U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_CheckNewRate = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 40U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionSubMachine = c1_IN_ALM_NewRateOutBound;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
        chartInstance->c1_temporalCounter_i1 = 0U;
        chartInstance->c1_tp_ALM_NewRateOutBound = 1U;
        c1_d122 = (real_T)c1_const_MSG_ALRMDR;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d122, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 32U);
        c1_copyInfuStatus(chartInstance);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 74U,
                     chartInstance->c1_sfEvent);
        c1_g_out = (CV_TRANSITION_EVAL(74U, (int32_T)_SFD_CCP_CALL(74U, 0,
          chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_g_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 74U, chartInstance->c1_sfEvent);
          c1_setDoseRate(chartInstance, chartInstance->c1_temp);
          *c1_O_ProgrammedFlowRate = c1_calcFlowRate(chartInstance,
            chartInstance->c1_temp);
          _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedFlowRate, 6U);
          chartInstance->c1_tp_CheckNewRate = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 40U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
          chartInstance->c1_temporalCounter_i1 = 0U;
          chartInstance->c1_tp_Infusing = 1U;
          c1_d123 = (real_T)c1_const_MSG_INFUSING;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d123, 0,
            0U, 0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 28U);
          c1_copyInfuStatus(chartInstance);
        } else if (chartInstance->c1_sfEvent == c1_event_E_Clock) {
          if (chartInstance->c1_temporalCounter_i1 == 3) {
            CV_STATE_EVAL(40, 0, 2);
            c1_copyInfuStatus(chartInstance);
          } else {
            CV_STATE_EVAL(40, 0, 1);
          }
        } else {
          CV_STATE_EVAL(40, 0, 1);
        }
      }

      _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 40U, chartInstance->c1_sfEvent);
      break;

     case c1_IN_ConfirmPause:
      CV_STATE_EVAL(36, 0, 5);
      c1_ConfirmPause(chartInstance);
      break;

     case c1_IN_ConfirmStop:
      CV_STATE_EVAL(36, 0, 6);
      c1_ConfirmStop(chartInstance);
      break;

     case c1_IN_Infusing:
      CV_STATE_EVAL(36, 0, 7);
      c1_Infusing(chartInstance);
      break;

     default:
      CV_STATE_EVAL(36, 0, 0);
      chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
      break;
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 36U, chartInstance->c1_sfEvent);
}

static void c1_exit_internal_InfusionSubMachine
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  switch (chartInstance->c1_is_InfusionSubMachine) {
   case c1_IN_ALM_NewRateOutBound:
    CV_STATE_EVAL(36, 1, 1);
    chartInstance->c1_tp_ALM_NewRateOutBound = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_BolusRequest:
    CV_STATE_EVAL(36, 1, 2);
    chartInstance->c1_tp_BolusRequest = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 38U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_ChangeRate:
    CV_STATE_EVAL(36, 1, 3);
    chartInstance->c1_tp_ChangeRate = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_CheckNewRate:
    CV_STATE_EVAL(36, 1, 4);
    chartInstance->c1_tp_CheckNewRate = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 40U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_ConfirmPause:
    CV_STATE_EVAL(36, 1, 5);
    chartInstance->c1_tp_ConfirmPause = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 41U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_ConfirmStop:
    CV_STATE_EVAL(36, 1, 6);
    chartInstance->c1_tp_ConfirmStop = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 42U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_Infusing:
    CV_STATE_EVAL(36, 1, 7);
    chartInstance->c1_tp_Infusing = 0U;
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
    break;

   default:
    CV_STATE_EVAL(36, 1, 0);
    chartInstance->c1_is_InfusionSubMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 37U, chartInstance->c1_sfEvent);
    break;
  }
}

static void c1_WRN_VTBIOutBound(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d124;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d125;
  boolean_T c1_f_out;
  real_T c1_d126;
  c1_InfusionParameters *c1_infuParameters;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
    (chartInstance->S, 4);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 28U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 72U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(72U, (int32_T)_SFD_CCP_CALL(72U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 72;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_ConfirmVTBI);
      if (c1_b_out) {
        transitionList[numTransitions] = 176;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_ChangeVTBI);
      if (c1_c_out) {
        transitionList[numTransitions] = 177;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 72U, chartInstance->c1_sfEvent);
    c1_warning(chartInstance);
    chartInstance->c1_tp_WRN_VTBIOutBound = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_WRN_VTBIOutBound;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_WRN_VTBIOutBound;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WRN_VTBIOutBound = 1U;
    c1_enterinto(chartInstance, 46U);
    c1_d124 = (real_T)c1_const_MSG_WRNVTBI;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d124, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 176U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(176U, (int32_T)_SFD_CCP_CALL(176U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ConfirmVTBI != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 176;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_ChangeVTBI);
        if (c1_e_out) {
          transitionList[numTransitions] = 177;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 176U, chartInstance->c1_sfEvent);
      c1_setVTBI(chartInstance, *(real_T *)((char_T *)c1_infuParameters + 0));
      chartInstance->c1_tp_WRN_VTBIOutBound = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_DisplayDoseRate = 1U;
      c1_enterinto(chartInstance, 23U);
      c1_d125 = (real_T)c1_const_MSG_DISPLAYDR;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d125, 0, 0U,
        0U, 0U, 0), 0);
      chartInstance->c1_tempx = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
      c1_setDoseRate(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 24));
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 177U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(177U, (int32_T)_SFD_CCP_CALL(177U, 0,
        chartInstance->c1_sfEvent == c1_event_E_ChangeVTBI != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 177U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_WRN_VTBIOutBound = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
        chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ChangeVTBI = 1U;
        c1_enterinto(chartInstance, 20U);
        c1_d126 = (real_T)c1_const_MSG_CHANGEVTBI;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d126, 0, 0U,
          0U, 0U, 0), 0);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 28U, chartInstance->c1_sfEvent);
}

static void c1_enter_atomic_LEVELONEALRM(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  real_T c1_hoistedGlobal;
  uint32_T c1_fcond;
  uint32_T c1_x;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  real_T c1_d127;
  boolean_T c1_g_out;
  boolean_T c1_h_out;
  boolean_T c1_i_out;
  boolean_T c1_j_out;
  boolean_T c1_k_out;
  real_T c1_d128;
  boolean_T c1_l_out;
  boolean_T c1_m_out;
  boolean_T c1_n_out;
  boolean_T c1_o_out;
  real_T c1_d129;
  boolean_T c1_p_out;
  boolean_T c1_q_out;
  boolean_T c1_r_out;
  real_T c1_d130;
  boolean_T c1_s_out;
  boolean_T c1_t_out;
  real_T c1_d131;
  boolean_T c1_u_out;
  real_T c1_d132;
  real_T *c1_ErrCond;
  uint32_T *c1_O_AlarmCond;
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_ErrCond = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
  c1_hoistedGlobal = *c1_ErrCond;
  c1_fcond = c1__u32_d_(chartInstance, c1_hoistedGlobal);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("fcond", &c1_fcond, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK((real_T)c1_fcond, 101U);
  _SFD_SET_DATA_VALUE_PTR(102U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(101U, &c1_fcond);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 78U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 78U, chartInstance->c1_sfEvent);
  c1_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x, 102U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 118U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 118U, chartInstance->c1_sfEvent);
  *c1_O_AlarmCond = c1_fcond;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 119U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(119U, (int32_T)_SFD_CCP_CALL(119U, 0, c1_fcond ==
              1U != 0U, chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[6];
      unsigned int numTransitions = 1;
      transitionList[0] = 119;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (c1_fcond == 2U);
      if (c1_b_out) {
        transitionList[numTransitions] = 158;
        numTransitions++;
      }

      c1_c_out = (c1_fcond == 3U);
      if (c1_c_out) {
        transitionList[numTransitions] = 121;
        numTransitions++;
      }

      c1_d_out = (c1_fcond == 4U);
      if (c1_d_out) {
        transitionList[numTransitions] = 122;
        numTransitions++;
      }

      c1_e_out = (c1_fcond == 5U);
      if (c1_e_out) {
        transitionList[numTransitions] = 123;
        numTransitions++;
      }

      c1_f_out = (c1_fcond == 6U);
      if (c1_f_out) {
        transitionList[numTransitions] = 124;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 119U, chartInstance->c1_sfEvent);
    c1_d127 = (real_T)c1_const_MSG_OUTOFPOWER;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d127, 0, 0U, 0U, 0U,
      0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 158U,
                 chartInstance->c1_sfEvent);
    c1_g_out = (CV_TRANSITION_EVAL(158U, (int32_T)_SFD_CCP_CALL(158U, 0,
      c1_fcond == 2U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_g_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[5];
        unsigned int numTransitions = 1;
        transitionList[0] = 158;
        sf_debug_transition_conflict_check_begin();
        c1_h_out = (c1_fcond == 3U);
        if (c1_h_out) {
          transitionList[numTransitions] = 121;
          numTransitions++;
        }

        c1_i_out = (c1_fcond == 4U);
        if (c1_i_out) {
          transitionList[numTransitions] = 122;
          numTransitions++;
        }

        c1_j_out = (c1_fcond == 5U);
        if (c1_j_out) {
          transitionList[numTransitions] = 123;
          numTransitions++;
        }

        c1_k_out = (c1_fcond == 6U);
        if (c1_k_out) {
          transitionList[numTransitions] = 124;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 158U, chartInstance->c1_sfEvent);
      c1_d128 = (real_T)c1_const_MSG_REALTIMECLOCK;
      sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d128, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 121U,
                   chartInstance->c1_sfEvent);
      c1_l_out = (CV_TRANSITION_EVAL(121U, (int32_T)_SFD_CCP_CALL(121U, 0,
        c1_fcond == 3U != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_l_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[4];
          unsigned int numTransitions = 1;
          transitionList[0] = 121;
          sf_debug_transition_conflict_check_begin();
          c1_m_out = (c1_fcond == 4U);
          if (c1_m_out) {
            transitionList[numTransitions] = 122;
            numTransitions++;
          }

          c1_n_out = (c1_fcond == 5U);
          if (c1_n_out) {
            transitionList[numTransitions] = 123;
            numTransitions++;
          }

          c1_o_out = (c1_fcond == 6U);
          if (c1_o_out) {
            transitionList[numTransitions] = 124;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 121U, chartInstance->c1_sfEvent);
        c1_d129 = (real_T)c1_const_MSG_CPUFAILURE;
        sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d129, 0, 0U, 0U,
          0U, 0), 0);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 122U,
                     chartInstance->c1_sfEvent);
        c1_p_out = (CV_TRANSITION_EVAL(122U, (int32_T)_SFD_CCP_CALL(122U, 0,
          c1_fcond == 4U != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_p_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[3];
            unsigned int numTransitions = 1;
            transitionList[0] = 122;
            sf_debug_transition_conflict_check_begin();
            c1_q_out = (c1_fcond == 5U);
            if (c1_q_out) {
              transitionList[numTransitions] = 123;
              numTransitions++;
            }

            c1_r_out = (c1_fcond == 6U);
            if (c1_r_out) {
              transitionList[numTransitions] = 124;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 122U, chartInstance->c1_sfEvent);
          c1_d130 = (real_T)c1_const_MSG_MEMORYCORRUPT;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d130, 0, 0U,
            0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 123U,
                       chartInstance->c1_sfEvent);
          c1_s_out = (CV_TRANSITION_EVAL(123U, (int32_T)_SFD_CCP_CALL(123U, 0,
            c1_fcond == 5U != 0U, chartInstance->c1_sfEvent)) != 0);
          if (c1_s_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[2];
              unsigned int numTransitions = 1;
              transitionList[0] = 123;
              sf_debug_transition_conflict_check_begin();
              c1_t_out = (c1_fcond == 6U);
              if (c1_t_out) {
                transitionList[numTransitions] = 124;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 123U, chartInstance->c1_sfEvent);
            c1_d131 = (real_T)c1_const_MSG_PUMPTOOHOT;
            sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d131, 0, 0U,
              0U, 0U, 0), 0);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 124U,
                         chartInstance->c1_sfEvent);
            c1_u_out = (CV_TRANSITION_EVAL(124U, (int32_T)_SFD_CCP_CALL(124U, 0,
              c1_fcond == 6U != 0U, chartInstance->c1_sfEvent)) != 0);
            if (c1_u_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 124U,
                           chartInstance->c1_sfEvent);
              c1_d132 = (real_T)c1_const_MSG_WATCHDOGALERT;
              sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d132, 0,
                0U, 0U, 0U, 0), 0);
            }
          }
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 78U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(102U);
  _SFD_UNSET_DATA_VALUE_PTR(101U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 78U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  c1_enterinto(chartInstance, 43U);
}

static void c1_WRN_DOSERATEOUTSOFTLIMITS(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  real_T c1_d133;
  boolean_T c1_c_out;
  real_T c1_d134;
  c1_InfusionParameters *c1_infuParameters;
  c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
    (chartInstance->S, 4);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 27U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 185U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(185U, (int32_T)_SFD_CCP_CALL(185U, 0,
              chartInstance->c1_sfEvent == c1_event_E_ConfirmDoseRate != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 185;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_ChangeDoseRate);
      if (c1_b_out) {
        transitionList[numTransitions] = 201;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 185U, chartInstance->c1_sfEvent);
    c1_setDoseRate(chartInstance, *(real_T *)((char_T *)c1_infuParameters + 8));
    chartInstance->c1_tp_WRN_DOSERATEOUTSOFTLIMITS = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 27U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplaySettings;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplaySettings;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplaySettings = 1U;
    c1_enterinto(chartInstance, 27U);
    c1_d133 = (real_T)c1_const_MSG_DISPLAYSET;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d133, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 201U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(201U, (int32_T)_SFD_CCP_CALL(201U, 0,
      chartInstance->c1_sfEvent == c1_event_E_ChangeDoseRate != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 201U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_WRN_DOSERATEOUTSOFTLIMITS = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 27U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
      chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ChangeDoseRate = 1U;
      c1_enterinto(chartInstance, 24U);
      c1_d134 = (real_T)c1_const_MSG_CHANGEDR;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d134, 0, 0U,
        0U, 0U, 0), 0);
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 27U, chartInstance->c1_sfEvent);
}

static void c1_PausedTooLong(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d135;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  real_T c1_d136;
  boolean_T c1_f_out;
  real_T c1_d137;
  uint32_T *c1_ClearCond;
  c1_ClearCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 46U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 222U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(222U, (int32_T)_SFD_CCP_CALL(222U, 0,
              chartInstance->c1_sfEvent == c1_event_E_StopInfusion != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[3];
      unsigned int numTransitions = 1;
      transitionList[0] = 222;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
      if (c1_b_out) {
        transitionList[numTransitions] = 205;
        numTransitions++;
      }

      c1_c_out = (chartInstance->c1_sfEvent == c1_event_E_ClearAlarm);
      if (c1_c_out) {
        transitionList[numTransitions] = 228;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 222U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_PausedTooLong = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionInSession = c1_IN_InfusionStopped;
    chartInstance->c1_was_InfusionInSession = c1_IN_InfusionStopped;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_InfusionStopped = 1U;
    c1_copyInfuStatus(chartInstance);
    c1_stopInfusion(chartInstance);
    c1_d135 = (real_T)c1_const_MSG_INFUSIONSTOP;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d135, 0, 0U, 0U,
      0U, 0), 0);
    c1_enterinto(chartInstance, 39U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 205U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(205U, (int32_T)_SFD_CCP_CALL(205U, 0,
      chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 205;
        sf_debug_transition_conflict_check_begin();
        c1_e_out = (chartInstance->c1_sfEvent == c1_event_E_ClearAlarm);
        if (c1_e_out) {
          transitionList[numTransitions] = 228;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 205U, chartInstance->c1_sfEvent);
      c1_warning(chartInstance);
      chartInstance->c1_tp_PausedTooLong = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionInSession = c1_IN_PausedTooLong;
      chartInstance->c1_was_InfusionInSession = c1_IN_PausedTooLong;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_PausedTooLong = 1U;
      c1_enterinto(chartInstance, 37U);
      c1_d136 = (real_T)c1_const_MSG_PAUSETOOLONG;
      sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d136, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 228U,
                   chartInstance->c1_sfEvent);
      c1_f_out = (CV_TRANSITION_EVAL(228U, (int32_T)_SFD_CCP_CALL(228U, 0,
        chartInstance->c1_sfEvent == c1_event_E_ClearAlarm != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_f_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 228U, chartInstance->c1_sfEvent);
        *c1_ClearCond = 13U;
        _SFD_DATA_RANGE_CHECK((real_T)*c1_ClearCond, 1U);
        c1_resumeInfusion(chartInstance);
        sf_mex_printf("%s\\n", "E_AlarmClear");
        chartInstance->c1_E_AlarmClearEventCounter++;
        chartInstance->c1_tp_PausedTooLong = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 46U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionInSession = c1_IN_InfusionSubMachine;
        chartInstance->c1_was_InfusionInSession = c1_IN_InfusionSubMachine;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_InfusionSubMachine = 1U;
        chartInstance->c1_is_InfusionSubMachine = c1_IN_Infusing;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
        chartInstance->c1_temporalCounter_i1 = 0U;
        chartInstance->c1_tp_Infusing = 1U;
        c1_d137 = (real_T)c1_const_MSG_INFUSING;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d137, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 28U);
        c1_copyInfuStatus(chartInstance);
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 46U, chartInstance->c1_sfEvent);
}

static void c1_enter_internal_CheckDrugRoutine(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  real_T c1_d138;
  real_T c1_d139;
  real_T c1_d140;
  real_T c1_d141;
  real_T c1_d142;
  real_T c1_d143;
  real_T c1_d144;
  real_T c1_d145;
  real_T c1_d146;
  real_T c1_d147;
  real_T c1_d148;
  real_T c1_d149;
  real_T c1_d150;
  c1_PumpConfigurationsStatus *c1_pumpConfigData;
  c1_pumpConfigData = (c1_PumpConfigurationsStatus *)ssGetInputPortSignal
    (chartInstance->S, 6);
  switch (chartInstance->c1_was_CheckDrugRoutine) {
   case c1_IN_ALM_WrongAdminCheck:
    CV_STATE_EVAL(2, 2, 1);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_ALM_WrongAdminCheck;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_ALM_WrongAdminCheck;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ALM_WrongAdminCheck = 1U;
    c1_enterinto(chartInstance, 6U);
    c1_d138 = (real_T)c1_const_MSG_ADMINFAIL;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d138, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_CheckAdminSet:
    CV_STATE_EVAL(2, 2, 2);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckAdminSet;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckAdminSet;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckAdminSet = 1U;
    c1_enterinto(chartInstance, 5U);
    c1_d139 = (real_T)c1_const_MSG_ADMINCHECK;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d139, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = (uint32_T)*(boolean_T *)((char_T *)
      c1_pumpConfigData + 2);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    break;

   case c1_IN_CheckDrug_CheckType:
    CV_STATE_EVAL(2, 2, 3);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckDrug_CheckType;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDrug_CheckType = 1U;
    c1_enterinto(chartInstance, 10U);
    c1_d140 = (real_T)c1_const_MSG_CHECKTYPE;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d140, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = c1_checkDrugType(chartInstance);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    break;

   case c1_IN_CheckPrime:
    CV_STATE_EVAL(2, 2, 4);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckPrime;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckPrime;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckPrime = 1U;
    c1_enterinto(chartInstance, 7U);
    chartInstance->c1_tempx = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    c1_d141 = (real_T)c1_const_MSG_PRIME;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d141, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = (uint32_T)*(boolean_T *)((char_T *)
      c1_pumpConfigData + 1);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    break;

   case c1_IN_Check_Concen:
    CV_STATE_EVAL(2, 2, 5);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_Check_Concen;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_Check_Concen;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_Check_Concen = 1U;
    c1_enterinto(chartInstance, 14U);
    c1_d142 = (real_T)c1_const_MSG_CHECKCON;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d142, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = (uint32_T)c1_checkDrugConcentration(chartInstance);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    break;

   case c1_IN_Check_DrugUnits:
    CV_STATE_EVAL(2, 2, 6);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_Check_DrugUnits;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_Check_DrugUnits;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 8U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_Check_DrugUnits = 1U;
    c1_enterinto(chartInstance, 12U);
    c1_d143 = (real_T)c1_const_MSG_CHECKDU;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d143, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = (uint32_T)c1_checkDrugUnits(chartInstance);
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    break;

   case c1_IN_DisplayDrugInfo:
    CV_STATE_EVAL(2, 2, 7);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplayDrugInfo = 1U;
    c1_enterinto(chartInstance, 9U);
    chartInstance->c1_tempx = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    c1_d144 = (real_T)c1_const_MSG_DRUGINFO;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d144, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_DisplayPatientProfile:
    CV_STATE_EVAL(2, 2, 8);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayPatientProfile;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplayPatientProfile = 1U;
    c1_enterinto(chartInstance, 18U);
    c1_d145 = (real_T)c1_const_MSG_PATIENTINFO;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d145, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_IncorrectDrugUnits:
    CV_STATE_EVAL(2, 2, 9);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_IncorrectDrugUnits;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_IncorrectDrugUnits;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_IncorrectDrugUnits = 1U;
    c1_enterinto(chartInstance, 13U);
    c1_d146 = (real_T)c1_const_MSG_WRONGDU;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d146, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_PrimeFailed:
    CV_STATE_EVAL(2, 2, 10);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_PrimeFailed;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_PrimeFailed;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_PrimeFailed = 1U;
    c1_enterinto(chartInstance, 8U);
    c1_d147 = (real_T)c1_const_MSG_PRIMEFAIL;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d147, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_UnknownDrug:
    CV_STATE_EVAL(2, 2, 11);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_UnknownDrug;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_UnknownDrug;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_UnknownDrug = 1U;
    c1_enterinto(chartInstance, 11U);
    c1_d148 = (real_T)c1_const_MSG_WRONGDRUG;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d148, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_WRN_DangerCon:
    CV_STATE_EVAL(2, 2, 12);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_WRN_DangerCon;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_WRN_DangerCon;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WRN_DangerCon = 1U;
    c1_enterinto(chartInstance, 16U);
    c1_d149 = (real_T)c1_const_MSG_DANGECON;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d149, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_WrongConcentration:
    CV_STATE_EVAL(2, 2, 13);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_WrongConcentration;
    chartInstance->c1_was_CheckDrugRoutine = c1_IN_WrongConcentration;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WrongConcentration = 1U;
    c1_enterinto(chartInstance, 15U);
    c1_d150 = (real_T)c1_const_MSG_WRONGCON;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d150, 0, 0U, 0U,
      0U, 0), 0);
    break;

   default:
    CV_STATE_EVAL(2, 2, 0);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
    break;
  }
}

static void c1_CheckDrugRoutine(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  boolean_T c1_out;
  real_T c1_d151;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  real_T c1_d152;
  boolean_T c1_e_out;
  real_T c1_d153;
  boolean_T c1_f_out;
  boolean_T c1_g_out;
  real_T c1_d154;
  boolean_T c1_h_out;
  real_T c1_d155;
  boolean_T c1_i_out;
  boolean_T c1_j_out;
  real_T c1_d156;
  boolean_T c1_k_out;
  real_T c1_d157;
  boolean_T c1_l_out;
  boolean_T c1_m_out;
  real_T c1_d158;
  boolean_T c1_n_out;
  real_T c1_d159;
  c1_PumpConfigurationsStatus *c1_pumpConfigData;
  c1_pumpConfigData = (c1_PumpConfigurationsStatus *)ssGetInputPortSignal
    (chartInstance->S, 6);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 2U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 197U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(197U, (int32_T)_SFD_CCP_CALL(197U, 0,
              chartInstance->c1_sfEvent == c1_event_E_PowerButton != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 197U, chartInstance->c1_sfEvent);
    chartInstance->c1_tempx = 1U;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    c1_exit_internal_CheckDrugRoutine(chartInstance);
    chartInstance->c1_tp_CheckDrugRoutine = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_ConfirmPowerDown;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ConfirmPowerDown = 1U;
    c1_enterinto(chartInstance, 2U);
    c1_d151 = (real_T)c1_const_MSG_POWEROFF;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d151, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 109U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(109U, (int32_T)_SFD_CCP_CALL(109U, 0,
      c1_alrmLevel(chartInstance) == 1U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 109U, chartInstance->c1_sfEvent);
      c1_exit_internal_CheckDrugRoutine(chartInstance);
      chartInstance->c1_tp_CheckDrugRoutine = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionStateMachine = c1_IN_LEVELONEALRM;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 48U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_LEVELONEALRM = 1U;
      c1_enter_atomic_LEVELONEALRM(chartInstance);
    } else {
      switch (chartInstance->c1_is_CheckDrugRoutine) {
       case c1_IN_ALM_WrongAdminCheck:
        CV_STATE_EVAL(2, 0, 1);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 3U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 62U,
                     chartInstance->c1_sfEvent);
        c1_c_out = (CV_TRANSITION_EVAL(62U, (int32_T)_SFD_CCP_CALL(62U, 0,
          chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_c_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[2];
            unsigned int numTransitions = 1;
            transitionList[0] = 62;
            sf_debug_transition_conflict_check_begin();
            c1_d_out = (chartInstance->c1_sfEvent == c1_event_E_CheckAdminSet);
            if (c1_d_out) {
              transitionList[numTransitions] = 34;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 62U, chartInstance->c1_sfEvent);
          c1_warning(chartInstance);
          chartInstance->c1_tp_ALM_WrongAdminCheck = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_CheckDrugRoutine = c1_IN_ALM_WrongAdminCheck;
          chartInstance->c1_was_CheckDrugRoutine = c1_IN_ALM_WrongAdminCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_ALM_WrongAdminCheck = 1U;
          c1_enterinto(chartInstance, 6U);
          c1_d152 = (real_T)c1_const_MSG_ADMINFAIL;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d152, 0,
            0U, 0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 34U,
                       chartInstance->c1_sfEvent);
          c1_e_out = (CV_TRANSITION_EVAL(34U, (int32_T)_SFD_CCP_CALL(34U, 0,
            chartInstance->c1_sfEvent == c1_event_E_CheckAdminSet != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_e_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 34U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ALM_WrongAdminCheck = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckAdminSet;
            chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckAdminSet;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_CheckAdminSet = 1U;
            c1_enterinto(chartInstance, 5U);
            c1_d153 = (real_T)c1_const_MSG_ADMINCHECK;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d153, 0,
              0U, 0U, 0U, 0), 0);
            chartInstance->c1_tempx = (uint32_T)*(boolean_T *)((char_T *)
              c1_pumpConfigData + 2);
            _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 3U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_CheckAdminSet:
        CV_STATE_EVAL(2, 0, 2);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 4U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 35U,
                     chartInstance->c1_sfEvent);
        c1_f_out = (CV_TRANSITION_EVAL(35U, (int32_T)_SFD_CCP_CALL(35U, 0,
          chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_f_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[2];
            unsigned int numTransitions = 1;
            transitionList[0] = 35;
            sf_debug_transition_conflict_check_begin();
            c1_g_out = (chartInstance->c1_tempx == 1U);
            if (c1_g_out) {
              transitionList[numTransitions] = 36;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 35U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_CheckAdminSet = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_CheckDrugRoutine = c1_IN_ALM_WrongAdminCheck;
          chartInstance->c1_was_CheckDrugRoutine = c1_IN_ALM_WrongAdminCheck;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_ALM_WrongAdminCheck = 1U;
          c1_enterinto(chartInstance, 6U);
          c1_d154 = (real_T)c1_const_MSG_ADMINFAIL;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d154, 0,
            0U, 0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 36U,
                       chartInstance->c1_sfEvent);
          c1_h_out = (CV_TRANSITION_EVAL(36U, (int32_T)_SFD_CCP_CALL(36U, 0,
            chartInstance->c1_tempx == 1U != 0U, chartInstance->c1_sfEvent)) !=
                      0);
          if (c1_h_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 36U, chartInstance->c1_sfEvent);
            chartInstance->c1_E_RestartEventCounter++;
            chartInstance->c1_tp_CheckAdminSet = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckPrime;
            chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckPrime;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_CheckPrime = 1U;
            c1_enterinto(chartInstance, 7U);
            chartInstance->c1_tempx = 0U;
            _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
            c1_d155 = (real_T)c1_const_MSG_PRIME;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d155, 0,
              0U, 0U, 0U, 0), 0);
            chartInstance->c1_tempx = (uint32_T)*(boolean_T *)((char_T *)
              c1_pumpConfigData + 1);
            _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 4U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_CheckDrug_CheckType:
        CV_STATE_EVAL(2, 0, 3);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 5U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 16U,
                     chartInstance->c1_sfEvent);
        c1_i_out = (CV_TRANSITION_EVAL(16U, (int32_T)_SFD_CCP_CALL(16U, 0,
          chartInstance->c1_tempx == 1U != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_i_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[2];
            unsigned int numTransitions = 1;
            transitionList[0] = 16;
            sf_debug_transition_conflict_check_begin();
            c1_j_out = (chartInstance->c1_tempx == 0U);
            if (c1_j_out) {
              transitionList[numTransitions] = 17;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 16U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_CheckDrug_CheckType = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_CheckDrugRoutine = c1_IN_UnknownDrug;
          chartInstance->c1_was_CheckDrugRoutine = c1_IN_UnknownDrug;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_UnknownDrug = 1U;
          c1_enterinto(chartInstance, 11U);
          c1_d156 = (real_T)c1_const_MSG_WRONGDRUG;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d156, 0,
            0U, 0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 17U,
                       chartInstance->c1_sfEvent);
          c1_k_out = (CV_TRANSITION_EVAL(17U, (int32_T)_SFD_CCP_CALL(17U, 0,
            chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) !=
                      0);
          if (c1_k_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_CheckDrug_CheckType = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_CheckDrugRoutine = c1_IN_Check_DrugUnits;
            chartInstance->c1_was_CheckDrugRoutine = c1_IN_Check_DrugUnits;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 8U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_Check_DrugUnits = 1U;
            c1_enterinto(chartInstance, 12U);
            c1_d157 = (real_T)c1_const_MSG_CHECKDU;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d157, 0,
              0U, 0U, 0U, 0), 0);
            chartInstance->c1_tempx = (uint32_T)c1_checkDrugUnits(chartInstance);
            _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 5U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_CheckPrime:
        CV_STATE_EVAL(2, 0, 4);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 6U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 38U,
                     chartInstance->c1_sfEvent);
        c1_l_out = (CV_TRANSITION_EVAL(38U, (int32_T)_SFD_CCP_CALL(38U, 0,
          chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_l_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[2];
            unsigned int numTransitions = 1;
            transitionList[0] = 38;
            sf_debug_transition_conflict_check_begin();
            c1_m_out = (chartInstance->c1_tempx == 1U);
            if (c1_m_out) {
              transitionList[numTransitions] = 39;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 38U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_CheckPrime = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_CheckDrugRoutine = c1_IN_PrimeFailed;
          chartInstance->c1_was_CheckDrugRoutine = c1_IN_PrimeFailed;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_PrimeFailed = 1U;
          c1_enterinto(chartInstance, 8U);
          c1_d158 = (real_T)c1_const_MSG_PRIMEFAIL;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d158, 0,
            0U, 0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 39U,
                       chartInstance->c1_sfEvent);
          c1_n_out = (CV_TRANSITION_EVAL(39U, (int32_T)_SFD_CCP_CALL(39U, 0,
            chartInstance->c1_tempx == 1U != 0U, chartInstance->c1_sfEvent)) !=
                      0);
          if (c1_n_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 39U, chartInstance->c1_sfEvent);
            c1_setDrugLibInfo(chartInstance);
            chartInstance->c1_tp_CheckPrime = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
            chartInstance->c1_was_CheckDrugRoutine = c1_IN_DisplayDrugInfo;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_DisplayDrugInfo = 1U;
            c1_enterinto(chartInstance, 9U);
            chartInstance->c1_tempx = 0U;
            _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
            c1_d159 = (real_T)c1_const_MSG_DRUGINFO;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d159, 0,
              0U, 0U, 0U, 0), 0);
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 6U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_Check_Concen:
        CV_STATE_EVAL(2, 0, 5);
        c1_Check_Concen(chartInstance);
        break;

       case c1_IN_Check_DrugUnits:
        CV_STATE_EVAL(2, 0, 6);
        c1_Check_DrugUnits(chartInstance);
        break;

       case c1_IN_DisplayDrugInfo:
        CV_STATE_EVAL(2, 0, 7);
        c1_DisplayDrugInfo(chartInstance);
        break;

       case c1_IN_DisplayPatientProfile:
        CV_STATE_EVAL(2, 0, 8);
        c1_DisplayPatientProfile(chartInstance);
        break;

       case c1_IN_IncorrectDrugUnits:
        CV_STATE_EVAL(2, 0, 9);
        c1_IncorrectDrugUnits(chartInstance);
        break;

       case c1_IN_PrimeFailed:
        CV_STATE_EVAL(2, 0, 10);
        c1_PrimeFailed(chartInstance);
        break;

       case c1_IN_UnknownDrug:
        CV_STATE_EVAL(2, 0, 11);
        c1_UnknownDrug(chartInstance);
        break;

       case c1_IN_WRN_DangerCon:
        CV_STATE_EVAL(2, 0, 12);
        c1_WRN_DangerCon(chartInstance);
        break;

       case c1_IN_WrongConcentration:
        CV_STATE_EVAL(2, 0, 13);
        c1_WrongConcentration(chartInstance);
        break;

       default:
        CV_STATE_EVAL(2, 0, 0);
        chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
        break;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 2U, chartInstance->c1_sfEvent);
}

static void c1_exit_internal_CheckDrugRoutine(SFc1_GPCA_ExtensionInstanceStruct *
  chartInstance)
{
  switch (chartInstance->c1_is_CheckDrugRoutine) {
   case c1_IN_ALM_WrongAdminCheck:
    CV_STATE_EVAL(2, 1, 1);
    chartInstance->c1_tp_ALM_WrongAdminCheck = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_CheckAdminSet:
    CV_STATE_EVAL(2, 1, 2);
    chartInstance->c1_tp_CheckAdminSet = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_CheckDrug_CheckType:
    CV_STATE_EVAL(2, 1, 3);
    chartInstance->c1_tp_CheckDrug_CheckType = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 5U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_CheckPrime:
    CV_STATE_EVAL(2, 1, 4);
    chartInstance->c1_tp_CheckPrime = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 6U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_Check_Concen:
    CV_STATE_EVAL(2, 1, 5);
    chartInstance->c1_tp_Check_Concen = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 7U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_Check_DrugUnits:
    CV_STATE_EVAL(2, 1, 6);
    chartInstance->c1_tp_Check_DrugUnits = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 8U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_DisplayDrugInfo:
    CV_STATE_EVAL(2, 1, 7);
    chartInstance->c1_tp_DisplayDrugInfo = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 9U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_DisplayPatientProfile:
    CV_STATE_EVAL(2, 1, 8);
    chartInstance->c1_tp_DisplayPatientProfile = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 10U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_IncorrectDrugUnits:
    CV_STATE_EVAL(2, 1, 9);
    chartInstance->c1_tp_IncorrectDrugUnits = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 11U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_PrimeFailed:
    CV_STATE_EVAL(2, 1, 10);
    chartInstance->c1_tp_PrimeFailed = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_UnknownDrug:
    CV_STATE_EVAL(2, 1, 11);
    chartInstance->c1_tp_UnknownDrug = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 13U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_WRN_DangerCon:
    CV_STATE_EVAL(2, 1, 12);
    chartInstance->c1_tp_WRN_DangerCon = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 14U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_WrongConcentration:
    CV_STATE_EVAL(2, 1, 13);
    chartInstance->c1_tp_WrongConcentration = 0U;
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 15U, chartInstance->c1_sfEvent);
    break;

   default:
    CV_STATE_EVAL(2, 1, 0);
    chartInstance->c1_is_CheckDrugRoutine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 3U, chartInstance->c1_sfEvent);
    break;
  }
}

static void c1_enter_internal_ConfigureInfusionProgram
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_d160;
  real_T c1_d161;
  real_T c1_d162;
  real_T c1_d163;
  real_T c1_d164;
  real_T c1_d165;
  real_T c1_d166;
  real_T c1_d167;
  real_T c1_d168;
  real_T c1_d169;
  c1_InfusionParameters *c1_infuParameters;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
    (chartInstance->S, 4);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  switch (chartInstance->c1_was_ConfigureInfusionProgram) {
   case c1_IN_ALM_DoseRateOutBound:
    CV_STATE_EVAL(16, 2, 1);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ALM_DoseRateOutBound;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ALM_DoseRateOutBound;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ALM_DoseRateOutBound = 1U;
    c1_enterinto(chartInstance, 26U);
    c1_d160 = (real_T)c1_const_MSG_ALRMDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d160, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_ALM_VTBIOutBound:
    CV_STATE_EVAL(16, 2, 2);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ALM_VTBIOutBound;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ALM_VTBIOutBound;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ALM_VTBIOutBound = 1U;
    c1_enterinto(chartInstance, 22U);
    c1_d161 = (real_T)c1_const_MSG_ALMVTBI;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d161, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_ChangeDoseRate:
    CV_STATE_EVAL(16, 2, 3);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ChangeDoseRate = 1U;
    c1_enterinto(chartInstance, 24U);
    c1_d162 = (real_T)c1_const_MSG_CHANGEDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d162, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_ChangeVTBI:
    CV_STATE_EVAL(16, 2, 4);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ChangeVTBI = 1U;
    c1_enterinto(chartInstance, 20U);
    c1_d163 = (real_T)c1_const_MSG_CHANGEVTBI;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d163, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_CheckDoseRate:
    CV_STATE_EVAL(16, 2, 5);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_CheckDoseRate;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_CheckDoseRate;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckDoseRate = 1U;
    c1_enterinto(chartInstance, 25U);
    c1_d164 = (real_T)c1_const_MSG_CHECKDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d164, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = c1_checkDoseRate(chartInstance, *(real_T *)
      ((char_T *)c1_infuParameters + 8));
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    break;

   case c1_IN_CheckVTBI:
    CV_STATE_EVAL(16, 2, 6);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_CheckVTBI;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_CheckVTBI;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_CheckVTBI = 1U;
    c1_enter_atomic_CheckVTBI(chartInstance);
    break;

   case c1_IN_DisplayDoseRate:
    CV_STATE_EVAL(16, 2, 7);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayDoseRate;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplayDoseRate = 1U;
    c1_enterinto(chartInstance, 23U);
    c1_d165 = (real_T)c1_const_MSG_DISPLAYDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d165, 0, 0U, 0U,
      0U, 0), 0);
    chartInstance->c1_tempx = 0U;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    c1_setDoseRate(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 24));
    break;

   case c1_IN_DisplaySettings:
    CV_STATE_EVAL(16, 2, 8);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplaySettings;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplaySettings;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplaySettings = 1U;
    c1_enterinto(chartInstance, 27U);
    c1_d166 = (real_T)c1_const_MSG_DISPLAYSET;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d166, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_DisplayVTBI:
    CV_STATE_EVAL(16, 2, 9);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_DisplayVTBI;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_DisplayVTBI = 1U;
    c1_enterinto(chartInstance, 19U);
    c1_d167 = (real_T)c1_const_MSG_VTBI;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d167, 0, 0U, 0U,
      0U, 0), 0);
    c1_setVTBI(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo + 72));
    break;

   case c1_IN_ReadyToStart:
    CV_STATE_EVAL(16, 2, 10);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ReadyToStart;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ReadyToStart;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ReadyToStart = 1U;
    c1_enterinto(chartInstance, 48U);
    break;

   case c1_IN_WRN_DOSERATEOUTSOFTLIMITS:
    CV_STATE_EVAL(16, 2, 11);
    chartInstance->c1_is_ConfigureInfusionProgram =
      c1_IN_WRN_DOSERATEOUTSOFTLIMITS;
    chartInstance->c1_was_ConfigureInfusionProgram =
      c1_IN_WRN_DOSERATEOUTSOFTLIMITS;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 27U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WRN_DOSERATEOUTSOFTLIMITS = 1U;
    c1_enterinto(chartInstance, 47U);
    c1_d168 = (real_T)c1_const_MSG_WRNDR;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d168, 0, 0U, 0U,
      0U, 0), 0);
    break;

   case c1_IN_WRN_VTBIOutBound:
    CV_STATE_EVAL(16, 2, 12);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_WRN_VTBIOutBound;
    chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_WRN_VTBIOutBound;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_WRN_VTBIOutBound = 1U;
    c1_enterinto(chartInstance, 46U);
    c1_d169 = (real_T)c1_const_MSG_WRNVTBI;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d169, 0, 0U, 0U,
      0U, 0), 0);
    break;

   default:
    CV_STATE_EVAL(16, 2, 0);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
    break;
  }
}

static void c1_ConfigureInfusionProgram(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  real_T c1_d170;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  real_T c1_d171;
  boolean_T c1_e_out;
  real_T c1_d172;
  boolean_T c1_f_out;
  boolean_T c1_g_out;
  real_T c1_d173;
  boolean_T c1_h_out;
  real_T c1_d174;
  boolean_T c1_i_out;
  boolean_T c1_j_out;
  boolean_T c1_k_out;
  real_T c1_d175;
  boolean_T c1_l_out;
  boolean_T c1_m_out;
  real_T c1_d176;
  boolean_T c1_n_out;
  real_T c1_d177;
  c1_InfusionParameters *c1_infuParameters;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
    (chartInstance->S, 4);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 16U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 49U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(49U, (int32_T)_SFD_CCP_CALL(49U, 0,
              chartInstance->c1_sfEvent == c1_event_E_PowerButton != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 49U, chartInstance->c1_sfEvent);
    chartInstance->c1_tempx = 2U;
    _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    c1_exit_internal_ConfigureInfusionProgram(chartInstance);
    chartInstance->c1_tp_ConfigureInfusionProgram = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 16U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_ConfirmPowerDown;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_ConfirmPowerDown = 1U;
    c1_enterinto(chartInstance, 2U);
    c1_d170 = (real_T)c1_const_MSG_POWEROFF;
    sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d170, 0, 0U, 0U,
      0U, 0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 144U,
                 chartInstance->c1_sfEvent);
    c1_b_out = (CV_TRANSITION_EVAL(144U, (int32_T)_SFD_CCP_CALL(144U, 0,
      c1_alrmLevel(chartInstance) == 1U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_b_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 144U, chartInstance->c1_sfEvent);
      c1_exit_internal_ConfigureInfusionProgram(chartInstance);
      chartInstance->c1_tp_ConfigureInfusionProgram = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 16U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionStateMachine = c1_IN_LEVELONEALRM;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 48U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_LEVELONEALRM = 1U;
      c1_enter_atomic_LEVELONEALRM(chartInstance);
    } else {
      switch (chartInstance->c1_is_ConfigureInfusionProgram) {
       case c1_IN_ALM_DoseRateOutBound:
        CV_STATE_EVAL(16, 0, 1);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 17U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 192U,
                     chartInstance->c1_sfEvent);
        c1_c_out = (CV_TRANSITION_EVAL(192U, (int32_T)_SFD_CCP_CALL(192U, 0,
          chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_c_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[2];
            unsigned int numTransitions = 1;
            transitionList[0] = 192;
            sf_debug_transition_conflict_check_begin();
            c1_d_out = (chartInstance->c1_sfEvent == c1_event_E_ChangeDoseRate);
            if (c1_d_out) {
              transitionList[numTransitions] = 53;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 192U, chartInstance->c1_sfEvent);
          c1_warning(chartInstance);
          chartInstance->c1_tp_ALM_DoseRateOutBound = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_ConfigureInfusionProgram =
            c1_IN_ALM_DoseRateOutBound;
          chartInstance->c1_was_ConfigureInfusionProgram =
            c1_IN_ALM_DoseRateOutBound;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_ALM_DoseRateOutBound = 1U;
          c1_enterinto(chartInstance, 26U);
          c1_d171 = (real_T)c1_const_MSG_ALRMDR;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d171, 0,
            0U, 0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 53U,
                       chartInstance->c1_sfEvent);
          c1_e_out = (CV_TRANSITION_EVAL(53U, (int32_T)_SFD_CCP_CALL(53U, 0,
            chartInstance->c1_sfEvent == c1_event_E_ChangeDoseRate != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_e_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 53U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ALM_DoseRateOutBound = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
            chartInstance->c1_was_ConfigureInfusionProgram =
              c1_IN_ChangeDoseRate;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ChangeDoseRate = 1U;
            c1_enterinto(chartInstance, 24U);
            c1_d172 = (real_T)c1_const_MSG_CHANGEDR;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d172, 0,
              0U, 0U, 0U, 0), 0);
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 17U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_ALM_VTBIOutBound:
        CV_STATE_EVAL(16, 0, 2);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 18U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 193U,
                     chartInstance->c1_sfEvent);
        c1_f_out = (CV_TRANSITION_EVAL(193U, (int32_T)_SFD_CCP_CALL(193U, 0,
          chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_f_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[2];
            unsigned int numTransitions = 1;
            transitionList[0] = 193;
            sf_debug_transition_conflict_check_begin();
            c1_g_out = (chartInstance->c1_sfEvent == c1_event_E_ChangeVTBI);
            if (c1_g_out) {
              transitionList[numTransitions] = 12;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 193U, chartInstance->c1_sfEvent);
          c1_warning(chartInstance);
          chartInstance->c1_tp_ALM_VTBIOutBound = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ALM_VTBIOutBound;
          chartInstance->c1_was_ConfigureInfusionProgram =
            c1_IN_ALM_VTBIOutBound;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_ALM_VTBIOutBound = 1U;
          c1_enterinto(chartInstance, 22U);
          c1_d173 = (real_T)c1_const_MSG_ALMVTBI;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d173, 0,
            0U, 0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 12U,
                       chartInstance->c1_sfEvent);
          c1_h_out = (CV_TRANSITION_EVAL(12U, (int32_T)_SFD_CCP_CALL(12U, 0,
            chartInstance->c1_sfEvent == c1_event_E_ChangeVTBI != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_h_out) {
            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 12U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ALM_VTBIOutBound = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
            chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_ChangeVTBI;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ChangeVTBI = 1U;
            c1_enterinto(chartInstance, 20U);
            c1_d174 = (real_T)c1_const_MSG_CHANGEVTBI;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d174, 0,
              0U, 0U, 0U, 0), 0);
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 18U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_ChangeDoseRate:
        CV_STATE_EVAL(16, 0, 3);
        _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 19U,
                     chartInstance->c1_sfEvent);
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 51U,
                     chartInstance->c1_sfEvent);
        c1_i_out = (CV_TRANSITION_EVAL(51U, (int32_T)_SFD_CCP_CALL(51U, 0,
          chartInstance->c1_sfEvent == c1_event_E_ConfirmDoseRate != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_i_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[3];
            unsigned int numTransitions = 1;
            transitionList[0] = 51;
            sf_debug_transition_conflict_check_begin();
            c1_j_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
            if (c1_j_out) {
              transitionList[numTransitions] = 116;
              numTransitions++;
            }

            c1_k_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
            if (c1_k_out) {
              transitionList[numTransitions] = 48;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 51U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_ChangeDoseRate = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_CheckDoseRate;
          chartInstance->c1_was_ConfigureInfusionProgram = c1_IN_CheckDoseRate;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_CheckDoseRate = 1U;
          c1_enterinto(chartInstance, 25U);
          c1_d175 = (real_T)c1_const_MSG_CHECKDR;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d175, 0,
            0U, 0U, 0U, 0), 0);
          chartInstance->c1_tempx = c1_checkDoseRate(chartInstance, *(real_T *)
            ((char_T *)c1_infuParameters + 8));
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 116U,
                       chartInstance->c1_sfEvent);
          c1_l_out = (CV_TRANSITION_EVAL(116U, (int32_T)_SFD_CCP_CALL(116U, 0,
            chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
            chartInstance->c1_sfEvent)) != 0);
          if (c1_l_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[2];
              unsigned int numTransitions = 1;
              transitionList[0] = 116;
              sf_debug_transition_conflict_check_begin();
              c1_m_out = (chartInstance->c1_sfEvent == c1_event_E_Cancel);
              if (c1_m_out) {
                transitionList[numTransitions] = 48;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 116U, chartInstance->c1_sfEvent);
            c1_warning(chartInstance);
            chartInstance->c1_tp_ChangeDoseRate = 0U;
            _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
            chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_ChangeDoseRate;
            chartInstance->c1_was_ConfigureInfusionProgram =
              c1_IN_ChangeDoseRate;
            _SFD_CS_CALL(STATE_ACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
            chartInstance->c1_tp_ChangeDoseRate = 1U;
            c1_enterinto(chartInstance, 24U);
            c1_d176 = (real_T)c1_const_MSG_CHANGEDR;
            sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d176, 0,
              0U, 0U, 0U, 0), 0);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 48U,
                         chartInstance->c1_sfEvent);
            c1_n_out = (CV_TRANSITION_EVAL(48U, (int32_T)_SFD_CCP_CALL(48U, 0,
              chartInstance->c1_sfEvent == c1_event_E_Cancel != 0U,
              chartInstance->c1_sfEvent)) != 0);
            if (c1_n_out) {
              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 48U, chartInstance->c1_sfEvent);
              chartInstance->c1_tp_ChangeDoseRate = 0U;
              _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
              chartInstance->c1_is_ConfigureInfusionProgram =
                c1_IN_DisplayDoseRate;
              chartInstance->c1_was_ConfigureInfusionProgram =
                c1_IN_DisplayDoseRate;
              _SFD_CS_CALL(STATE_ACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
              chartInstance->c1_tp_DisplayDoseRate = 1U;
              c1_enterinto(chartInstance, 23U);
              c1_d177 = (real_T)c1_const_MSG_DISPLAYDR;
              sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d177,
                0, 0U, 0U, 0U, 0), 0);
              chartInstance->c1_tempx = 0U;
              _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
              c1_setDoseRate(chartInstance, *(real_T *)((char_T *)c1_drugLibInfo
                + 24));
            }
          }
        }

        _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 19U, chartInstance->c1_sfEvent);
        break;

       case c1_IN_ChangeVTBI:
        CV_STATE_EVAL(16, 0, 4);
        c1_ChangeVTBI(chartInstance);
        break;

       case c1_IN_CheckDoseRate:
        CV_STATE_EVAL(16, 0, 5);
        c1_CheckDoseRate(chartInstance);
        break;

       case c1_IN_CheckVTBI:
        CV_STATE_EVAL(16, 0, 6);
        c1_CheckVTBI(chartInstance);
        break;

       case c1_IN_DisplayDoseRate:
        CV_STATE_EVAL(16, 0, 7);
        c1_DisplayDoseRate(chartInstance);
        break;

       case c1_IN_DisplaySettings:
        CV_STATE_EVAL(16, 0, 8);
        c1_DisplaySettings(chartInstance);
        break;

       case c1_IN_DisplayVTBI:
        CV_STATE_EVAL(16, 0, 9);
        c1_DisplayVTBI(chartInstance);
        break;

       case c1_IN_ReadyToStart:
        CV_STATE_EVAL(16, 0, 10);
        c1_ReadyToStart(chartInstance);
        break;

       case c1_IN_WRN_DOSERATEOUTSOFTLIMITS:
        CV_STATE_EVAL(16, 0, 11);
        c1_WRN_DOSERATEOUTSOFTLIMITS(chartInstance);
        break;

       case c1_IN_WRN_VTBIOutBound:
        CV_STATE_EVAL(16, 0, 12);
        c1_WRN_VTBIOutBound(chartInstance);
        break;

       default:
        CV_STATE_EVAL(16, 0, 0);
        chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
        break;
      }
    }
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 16U, chartInstance->c1_sfEvent);
}

static void c1_exit_internal_ConfigureInfusionProgram
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  switch (chartInstance->c1_is_ConfigureInfusionProgram) {
   case c1_IN_ALM_DoseRateOutBound:
    CV_STATE_EVAL(16, 1, 1);
    chartInstance->c1_tp_ALM_DoseRateOutBound = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_ALM_VTBIOutBound:
    CV_STATE_EVAL(16, 1, 2);
    chartInstance->c1_tp_ALM_VTBIOutBound = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 18U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_ChangeDoseRate:
    CV_STATE_EVAL(16, 1, 3);
    chartInstance->c1_tp_ChangeDoseRate = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_ChangeVTBI:
    CV_STATE_EVAL(16, 1, 4);
    chartInstance->c1_tp_ChangeVTBI = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 20U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_CheckDoseRate:
    CV_STATE_EVAL(16, 1, 5);
    chartInstance->c1_tp_CheckDoseRate = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 21U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_CheckVTBI:
    CV_STATE_EVAL(16, 1, 6);
    chartInstance->c1_tp_CheckVTBI = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 22U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_DisplayDoseRate:
    CV_STATE_EVAL(16, 1, 7);
    chartInstance->c1_tp_DisplayDoseRate = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_DisplaySettings:
    CV_STATE_EVAL(16, 1, 8);
    chartInstance->c1_tp_DisplaySettings = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 24U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_DisplayVTBI:
    CV_STATE_EVAL(16, 1, 9);
    chartInstance->c1_tp_DisplayVTBI = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_ReadyToStart:
    CV_STATE_EVAL(16, 1, 10);
    chartInstance->c1_tp_ReadyToStart = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 26U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_WRN_DOSERATEOUTSOFTLIMITS:
    CV_STATE_EVAL(16, 1, 11);
    chartInstance->c1_tp_WRN_DOSERATEOUTSOFTLIMITS = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 27U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_WRN_VTBIOutBound:
    CV_STATE_EVAL(16, 1, 12);
    chartInstance->c1_tp_WRN_VTBIOutBound = 0U;
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
    break;

   default:
    CV_STATE_EVAL(16, 1, 0);
    chartInstance->c1_is_ConfigureInfusionProgram = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 17U, chartInstance->c1_sfEvent);
    break;
  }
}

static void c1_InfusionStateMachine(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  real_T c1_d178;
  boolean_T c1_d_out;
  real_T c1_d179;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  real_T c1_d180;
  boolean_T c1_g_out;
  real_T c1_d181;
  boolean_T c1_h_out;
  boolean_T c1_i_out;
  boolean_T c1_j_out;
  real_T c1_d182;
  boolean_T c1_k_out;
  boolean_T c1_l_out;
  real_T c1_d183;
  boolean_T c1_m_out;
  real_T c1_d184;
  uint32_T *c1_O_AlarmCond;
  c1_PumpConfigurationsStatus *c1_pumpConfigData;
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_pumpConfigData = (c1_PumpConfigurationsStatus *)ssGetInputPortSignal
    (chartInstance->S, 6);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 0U, chartInstance->c1_sfEvent);
  switch (chartInstance->c1_is_InfusionStateMachine) {
   case c1_IN_ALM_POSTFailed:
    CV_STATE_EVAL(0, 0, 1);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 1U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 2U, chartInstance->c1_sfEvent);
    c1_out = (CV_TRANSITION_EVAL(2U, (int32_T)_SFD_CCP_CALL(2U, 0,
                chartInstance->c1_sfEvent == c1_event_E_PowerButton != 0U,
                chartInstance->c1_sfEvent)) != 0);
    if (c1_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 2;
        sf_debug_transition_conflict_check_begin();
        c1_b_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
        if (c1_b_out) {
          transitionList[numTransitions] = 99;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ALM_POSTFailed = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 1U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionStateMachine = c1_IN_PowerOff;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_PowerOff = 1U;
      c1_enterinto(chartInstance, 1U);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 99U,
                   chartInstance->c1_sfEvent);
      c1_c_out = (CV_TRANSITION_EVAL(99U, (int32_T)_SFD_CCP_CALL(99U, 0,
        chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_c_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 99U, chartInstance->c1_sfEvent);
        c1_warning(chartInstance);
        chartInstance->c1_tp_ALM_POSTFailed = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 1U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionStateMachine = c1_IN_ALM_POSTFailed;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 1U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ALM_POSTFailed = 1U;
        c1_d178 = (real_T)c1_const_MSG_POSTFAIL;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d178, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 4U);
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 1U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_CheckDrugRoutine:
    CV_STATE_EVAL(0, 0, 2);
    c1_CheckDrugRoutine(chartInstance);
    break;

   case c1_IN_ConfigureInfusionProgram:
    CV_STATE_EVAL(0, 0, 3);
    c1_ConfigureInfusionProgram(chartInstance);
    break;

   case c1_IN_ConfirmPowerDown:
    CV_STATE_EVAL(0, 0, 4);
    c1_ConfirmPowerDown(chartInstance);
    break;

   case c1_IN_InfusionInSession:
    CV_STATE_EVAL(0, 0, 5);
    c1_InfusionInSession(chartInstance);
    break;

   case c1_IN_Init:
    CV_STATE_EVAL(0, 0, 6);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 47U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 0U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 0U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_Init = 0U;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 47U, chartInstance->c1_sfEvent);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_PowerOff;
    _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c1_sfEvent);
    chartInstance->c1_tp_PowerOff = 1U;
    c1_enterinto(chartInstance, 1U);
    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 47U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_LEVELONEALRM:
    CV_STATE_EVAL(0, 0, 7);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 48U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 148U,
                 chartInstance->c1_sfEvent);
    c1_d_out = (CV_TRANSITION_EVAL(148U, (int32_T)_SFD_CCP_CALL(148U, 0,
      chartInstance->c1_sfEvent == c1_event_E_PowerButton != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_d_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 148U, chartInstance->c1_sfEvent);
      *c1_O_AlarmCond = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
      c1_d179 = (real_T)c1_const_MSG_BLANK;
      sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d179, 0, 0U, 0U,
        0U, 0), 0);
      chartInstance->c1_tp_LEVELONEALRM = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 48U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionStateMachine = c1_IN_PowerOff;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 51U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_PowerOff = 1U;
      c1_enterinto(chartInstance, 1U);
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 48U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_POST:
    CV_STATE_EVAL(0, 0, 8);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 49U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 159U,
                 chartInstance->c1_sfEvent);
    c1_e_out = (CV_TRANSITION_EVAL(159U, (int32_T)_SFD_CCP_CALL(159U, 0,
      chartInstance->c1_tempx == 1U != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_e_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[2];
        unsigned int numTransitions = 1;
        transitionList[0] = 159;
        sf_debug_transition_conflict_check_begin();
        c1_f_out = (chartInstance->c1_tempx == 0U);
        if (c1_f_out) {
          transitionList[numTransitions] = 100;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 159U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_POST = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 49U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionStateMachine = c1_IN_POSTDONE;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_POSTDONE = 1U;
      c1_d180 = (real_T)c1_const_MSG_POSTDONE;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d180, 0, 0U,
        0U, 0U, 0), 0);
      c1_enterinto(chartInstance, 45U);
      chartInstance->c1_tempx = 0U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 100U,
                   chartInstance->c1_sfEvent);
      c1_g_out = (CV_TRANSITION_EVAL(100U, (int32_T)_SFD_CCP_CALL(100U, 0,
        chartInstance->c1_tempx == 0U != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_g_out) {
        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 100U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_POST = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 49U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionStateMachine = c1_IN_ALM_POSTFailed;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 1U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_ALM_POSTFailed = 1U;
        c1_d181 = (real_T)c1_const_MSG_POSTFAIL;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d181, 0, 0U,
          0U, 0U, 0), 0);
        c1_enterinto(chartInstance, 4U);
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 49U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_POSTDONE:
    CV_STATE_EVAL(0, 0, 9);
    _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 50U, chartInstance->c1_sfEvent);
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 153U,
                 chartInstance->c1_sfEvent);
    c1_h_out = (CV_TRANSITION_EVAL(153U, (int32_T)_SFD_CCP_CALL(153U, 0,
      chartInstance->c1_sfEvent == c1_event_E_PowerButton != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_h_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[3];
        unsigned int numTransitions = 1;
        transitionList[0] = 153;
        sf_debug_transition_conflict_check_begin();
        c1_i_out = (chartInstance->c1_sfEvent == c1_event_E_CheckAdminSet);
        if (c1_i_out) {
          transitionList[numTransitions] = 83;
          numTransitions++;
        }

        c1_j_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
        if (c1_j_out) {
          transitionList[numTransitions] = 23;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 153U, chartInstance->c1_sfEvent);
      chartInstance->c1_tempx = 4U;
      _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
      chartInstance->c1_tp_POSTDONE = 0U;
      _SFD_CS_CALL(STATE_INACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
      chartInstance->c1_is_InfusionStateMachine = c1_IN_ConfirmPowerDown;
      _SFD_CS_CALL(STATE_ACTIVE_TAG, 29U, chartInstance->c1_sfEvent);
      chartInstance->c1_tp_ConfirmPowerDown = 1U;
      c1_enterinto(chartInstance, 2U);
      c1_d182 = (real_T)c1_const_MSG_POWEROFF;
      sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d182, 0, 0U,
        0U, 0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 83U,
                   chartInstance->c1_sfEvent);
      c1_k_out = (CV_TRANSITION_EVAL(83U, (int32_T)_SFD_CCP_CALL(83U, 0,
        chartInstance->c1_sfEvent == c1_event_E_CheckAdminSet != 0U,
        chartInstance->c1_sfEvent)) != 0);
      if (c1_k_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 83;
          sf_debug_transition_conflict_check_begin();
          c1_l_out = (chartInstance->c1_sfEvent == c1_event_E_Warning);
          if (c1_l_out) {
            transitionList[numTransitions] = 23;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 83U, chartInstance->c1_sfEvent);
        c1_resetInfusionInstructions(chartInstance);
        c1_initInfuStatus(chartInstance);
        chartInstance->c1_tp_POSTDONE = 0U;
        _SFD_CS_CALL(STATE_INACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
        chartInstance->c1_is_InfusionStateMachine = c1_IN_CheckDrugRoutine;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 2U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_CheckDrugRoutine = 1U;
        chartInstance->c1_is_CheckDrugRoutine = c1_IN_CheckAdminSet;
        chartInstance->c1_was_CheckDrugRoutine = c1_IN_CheckAdminSet;
        _SFD_CS_CALL(STATE_ACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
        chartInstance->c1_tp_CheckAdminSet = 1U;
        c1_enterinto(chartInstance, 5U);
        c1_d183 = (real_T)c1_const_MSG_ADMINCHECK;
        sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d183, 0, 0U,
          0U, 0U, 0), 0);
        chartInstance->c1_tempx = (uint32_T)*(boolean_T *)((char_T *)
          c1_pumpConfigData + 2);
        _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 23U,
                     chartInstance->c1_sfEvent);
        c1_m_out = (CV_TRANSITION_EVAL(23U, (int32_T)_SFD_CCP_CALL(23U, 0,
          chartInstance->c1_sfEvent == c1_event_E_Warning != 0U,
          chartInstance->c1_sfEvent)) != 0);
        if (c1_m_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 23U, chartInstance->c1_sfEvent);
          c1_warning(chartInstance);
          chartInstance->c1_tp_POSTDONE = 0U;
          _SFD_CS_CALL(STATE_INACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
          chartInstance->c1_is_InfusionStateMachine = c1_IN_POSTDONE;
          _SFD_CS_CALL(STATE_ACTIVE_TAG, 50U, chartInstance->c1_sfEvent);
          chartInstance->c1_tp_POSTDONE = 1U;
          c1_d184 = (real_T)c1_const_MSG_POSTDONE;
          sf_mex_export("GMsgConStr", sf_mex_create("GMsgConStr", &c1_d184, 0,
            0U, 0U, 0U, 0), 0);
          c1_enterinto(chartInstance, 45U);
          chartInstance->c1_tempx = 0U;
          _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_tempx, 73U);
        }
      }
    }

    _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 50U, chartInstance->c1_sfEvent);
    break;

   case c1_IN_PowerOff:
    CV_STATE_EVAL(0, 0, 10);
    c1_PowerOff(chartInstance);
    break;

   default:
    CV_STATE_EVAL(0, 0, 0);
    chartInstance->c1_is_InfusionStateMachine = c1_IN_NO_ACTIVE_CHILD;
    _SFD_CS_CALL(STATE_INACTIVE_TAG, 1U, chartInstance->c1_sfEvent);
    break;
  }

  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 0U, chartInstance->c1_sfEvent);
}

static void init_script_number_translation(uint32_T c1_machineNumber, uint32_T
  c1_chartNumber)
{
}

const mxArray *sf_c1_GPCA_Extension_get_eml_resolved_functions_info(void)
{
  const mxArray *c1_nameCaptureInfo = NULL;
  c1_nameCaptureInfo = NULL;
  sf_mex_assign(&c1_nameCaptureInfo, sf_mex_create("nameCaptureInfo", NULL, 0,
    0U, 1U, 0U, 2, 0, 1), FALSE);
  return c1_nameCaptureInfo;
}

static void c1_broadcast_E_Clock(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_Clock;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_Clock,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_Clock,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_Alarm(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_Alarm;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_Alarm,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_Alarm,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_Warning(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_Warning;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_Warning,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_Warning,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_Ready(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_Ready;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_Ready,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_Ready,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_NotReady(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_NotReady;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_NotReady,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_NotReady,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_StartSimulation(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_StartSimulation;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_StartSimulation,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_StartSimulation,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_PowerButton(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_PowerButton;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_PowerButton,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_PowerButton,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_NewInfusion(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_NewInfusion;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_NewInfusion,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_NewInfusion,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_CheckAdminSet(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_CheckAdminSet;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_CheckAdminSet,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_CheckAdminSet,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_Prime(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_Prime;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_Prime,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_Prime,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_CheckDrug(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_CheckDrug;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_CheckDrug,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_CheckDrug,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_ConfigureInfusionProgram
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_ConfigureInfusionProgram;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ConfigureInfusionProgram,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ConfigureInfusionProgram,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_ConfirmConcentration
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_ConfirmConcentration;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ConfirmConcentration,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ConfirmConcentration,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_ConfirmDoseRate(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_ConfirmDoseRate;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ConfirmDoseRate,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ConfirmDoseRate,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_ConfirmVTBI(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_ConfirmVTBI;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ConfirmVTBI,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ConfirmVTBI,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_StartInfusion(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_StartInfusion;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_StartInfusion,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_StartInfusion,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_ChangeDoseRate(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_ChangeDoseRate;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ChangeDoseRate,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ChangeDoseRate,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_ChangeVTBI(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_ChangeVTBI;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ChangeVTBI,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ChangeVTBI,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_PauseInfusion(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_PauseInfusion;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_PauseInfusion,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_PauseInfusion,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_ConfirmPauseInfusion
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_ConfirmPauseInfusion;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_ConfirmPauseInfusion,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_ConfirmPauseInfusion,
               chartInstance->c1_sfEvent);
}

static void c1_broadcast_E_StopInfusion(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  chartInstance->c1_sfEvent = c1_event_E_StopInfusion;
  _SFD_CE_CALL(EVENT_BEFORE_BROADCAST_TAG, c1_event_E_StopInfusion,
               chartInstance->c1_sfEvent);
  c1_chartstep_c1_GPCA_Extension(chartInstance);
  _SFD_CE_CALL(EVENT_AFTER_BROADCAST_TAG, c1_event_E_StopInfusion,
               chartInstance->c1_sfEvent);
}

static uint32_T c1_enterinto(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  uint32_T c1_stateId)
{
  uint32_T c1_x1;
  uint32_T *c1_O_CurrentState;
  c1_O_CurrentState = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 7);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x1", &c1_x1, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("stateId", &c1_stateId,
    c1_b_sf_marshallOut, c1_b_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK((real_T)c1_stateId, 93U);
  _SFD_SET_DATA_VALUE_PTR(94U, &c1_x1);
  _SFD_SET_DATA_VALUE_PTR(93U, &c1_stateId);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 65U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 65U, chartInstance->c1_sfEvent);
  c1_x1 = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x1, 94U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 28U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 28U, chartInstance->c1_sfEvent);
  *c1_O_CurrentState = c1_stateId;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_CurrentState, 72U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 4U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 4U, chartInstance->c1_sfEvent);
  c1_x1 = c1_stateId;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x1, 94U);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 65U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(94U);
  _SFD_UNSET_DATA_VALUE_PTR(93U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 65U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x1;
}

static real_T c1_resumeInfusion(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_x;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  boolean_T *c1_O_BolusRequested;
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(140U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 75U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 75U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 140U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 249U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 249U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 250U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 250U, chartInstance->c1_sfEvent);
  chartInstance->c1_infusing = TRUE;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_infusing, 84U);
  chartInstance->c1_bolusing = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 120U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 120U, chartInstance->c1_sfEvent);
  *c1_O_InfusionInProgress = TRUE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionInProgress, 2U);
  *c1_O_InfusionPaused = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionPaused, 3U);
  *c1_O_BolusRequested = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_BolusRequested, 4U);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 75U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(140U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 75U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static uint32_T c1_warning(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  uint32_T c1_x;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  boolean_T c1_g_out;
  boolean_T c1_h_out;
  boolean_T c1_i_out;
  boolean_T c1_j_out;
  boolean_T c1_k_out;
  real_T c1_d185;
  boolean_T c1_l_out;
  boolean_T c1_m_out;
  boolean_T c1_n_out;
  boolean_T c1_o_out;
  boolean_T c1_p_out;
  boolean_T c1_q_out;
  boolean_T c1_r_out;
  boolean_T c1_s_out;
  boolean_T c1_t_out;
  boolean_T c1_u_out;
  real_T c1_d186;
  boolean_T c1_v_out;
  boolean_T c1_w_out;
  boolean_T c1_x_out;
  boolean_T c1_y_out;
  boolean_T c1_ab_out;
  boolean_T c1_bb_out;
  boolean_T c1_cb_out;
  boolean_T c1_db_out;
  boolean_T c1_eb_out;
  real_T c1_d187;
  boolean_T c1_fb_out;
  boolean_T c1_gb_out;
  boolean_T c1_hb_out;
  boolean_T c1_ib_out;
  boolean_T c1_jb_out;
  boolean_T c1_kb_out;
  boolean_T c1_lb_out;
  boolean_T c1_mb_out;
  real_T c1_d188;
  boolean_T c1_nb_out;
  boolean_T c1_ob_out;
  boolean_T c1_pb_out;
  boolean_T c1_qb_out;
  boolean_T c1_rb_out;
  boolean_T c1_sb_out;
  boolean_T c1_tb_out;
  real_T c1_d189;
  boolean_T c1_ub_out;
  boolean_T c1_vb_out;
  boolean_T c1_wb_out;
  boolean_T c1_xb_out;
  boolean_T c1_yb_out;
  boolean_T c1_ac_out;
  real_T c1_d190;
  boolean_T c1_bc_out;
  boolean_T c1_cc_out;
  boolean_T c1_dc_out;
  boolean_T c1_ec_out;
  boolean_T c1_fc_out;
  real_T c1_d191;
  boolean_T c1_gc_out;
  boolean_T c1_hc_out;
  boolean_T c1_ic_out;
  boolean_T c1_jc_out;
  real_T c1_d192;
  boolean_T c1_kc_out;
  boolean_T c1_lc_out;
  boolean_T c1_mc_out;
  real_T c1_d193;
  boolean_T c1_nc_out;
  boolean_T c1_oc_out;
  real_T c1_d194;
  boolean_T c1_pc_out;
  real_T c1_d195;
  real_T *c1_ErrCond;
  uint32_T *c1_O_AlarmCond;
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_ErrCond = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(114U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 84U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 84U, chartInstance->c1_sfEvent);
  c1_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x, 114U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 147U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 147U, chartInstance->c1_sfEvent);
  *c1_O_AlarmCond = (uint32_T)*c1_ErrCond;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 128U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(128U, (int32_T)_SFD_CCP_CALL(128U, 0, *c1_ErrCond
              == 16.0 != 0U, chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[11];
      unsigned int numTransitions = 1;
      transitionList[0] = 128;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (*c1_ErrCond == 17.0);
      if (c1_b_out) {
        transitionList[numTransitions] = 126;
        numTransitions++;
      }

      c1_c_out = (*c1_ErrCond == 18.0);
      if (c1_c_out) {
        transitionList[numTransitions] = 141;
        numTransitions++;
      }

      c1_d_out = (*c1_ErrCond == 19.0);
      if (c1_d_out) {
        transitionList[numTransitions] = 135;
        numTransitions++;
      }

      c1_e_out = (*c1_ErrCond == 20.0);
      if (c1_e_out) {
        transitionList[numTransitions] = 142;
        numTransitions++;
      }

      c1_f_out = (*c1_ErrCond == 21.0);
      if (c1_f_out) {
        transitionList[numTransitions] = 143;
        numTransitions++;
      }

      c1_g_out = (*c1_ErrCond == 22.0);
      if (c1_g_out) {
        transitionList[numTransitions] = 145;
        numTransitions++;
      }

      c1_h_out = (*c1_ErrCond == 23.0);
      if (c1_h_out) {
        transitionList[numTransitions] = 146;
        numTransitions++;
      }

      c1_i_out = (*c1_ErrCond == 24.0);
      if (c1_i_out) {
        transitionList[numTransitions] = 169;
        numTransitions++;
      }

      c1_j_out = (*c1_ErrCond == 25.0);
      if (c1_j_out) {
        transitionList[numTransitions] = 203;
        numTransitions++;
      }

      c1_k_out = (*c1_ErrCond == 26.0);
      if (c1_k_out) {
        transitionList[numTransitions] = 140;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 128U, chartInstance->c1_sfEvent);
    c1_d185 = (real_T)c1_const_MSG_FLOWRATEVARY;
    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d185, 0, 0U, 0U, 0U,
      0), 0);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 126U,
                 chartInstance->c1_sfEvent);
    c1_l_out = (CV_TRANSITION_EVAL(126U, (int32_T)_SFD_CCP_CALL(126U, 0,
      *c1_ErrCond == 17.0 != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_l_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[10];
        unsigned int numTransitions = 1;
        transitionList[0] = 126;
        sf_debug_transition_conflict_check_begin();
        c1_m_out = (*c1_ErrCond == 18.0);
        if (c1_m_out) {
          transitionList[numTransitions] = 141;
          numTransitions++;
        }

        c1_n_out = (*c1_ErrCond == 19.0);
        if (c1_n_out) {
          transitionList[numTransitions] = 135;
          numTransitions++;
        }

        c1_o_out = (*c1_ErrCond == 20.0);
        if (c1_o_out) {
          transitionList[numTransitions] = 142;
          numTransitions++;
        }

        c1_p_out = (*c1_ErrCond == 21.0);
        if (c1_p_out) {
          transitionList[numTransitions] = 143;
          numTransitions++;
        }

        c1_q_out = (*c1_ErrCond == 22.0);
        if (c1_q_out) {
          transitionList[numTransitions] = 145;
          numTransitions++;
        }

        c1_r_out = (*c1_ErrCond == 23.0);
        if (c1_r_out) {
          transitionList[numTransitions] = 146;
          numTransitions++;
        }

        c1_s_out = (*c1_ErrCond == 24.0);
        if (c1_s_out) {
          transitionList[numTransitions] = 169;
          numTransitions++;
        }

        c1_t_out = (*c1_ErrCond == 25.0);
        if (c1_t_out) {
          transitionList[numTransitions] = 203;
          numTransitions++;
        }

        c1_u_out = (*c1_ErrCond == 26.0);
        if (c1_u_out) {
          transitionList[numTransitions] = 140;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 126U, chartInstance->c1_sfEvent);
      c1_d186 = (real_T)c1_const_MSG_LOWRESR;
      sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d186, 0, 0U, 0U,
        0U, 0), 0);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 141U,
                   chartInstance->c1_sfEvent);
      c1_v_out = (CV_TRANSITION_EVAL(141U, (int32_T)_SFD_CCP_CALL(141U, 0,
        *c1_ErrCond == 18.0 != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_v_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[9];
          unsigned int numTransitions = 1;
          transitionList[0] = 141;
          sf_debug_transition_conflict_check_begin();
          c1_w_out = (*c1_ErrCond == 19.0);
          if (c1_w_out) {
            transitionList[numTransitions] = 135;
            numTransitions++;
          }

          c1_x_out = (*c1_ErrCond == 20.0);
          if (c1_x_out) {
            transitionList[numTransitions] = 142;
            numTransitions++;
          }

          c1_y_out = (*c1_ErrCond == 21.0);
          if (c1_y_out) {
            transitionList[numTransitions] = 143;
            numTransitions++;
          }

          c1_ab_out = (*c1_ErrCond == 22.0);
          if (c1_ab_out) {
            transitionList[numTransitions] = 145;
            numTransitions++;
          }

          c1_bb_out = (*c1_ErrCond == 23.0);
          if (c1_bb_out) {
            transitionList[numTransitions] = 146;
            numTransitions++;
          }

          c1_cb_out = (*c1_ErrCond == 24.0);
          if (c1_cb_out) {
            transitionList[numTransitions] = 169;
            numTransitions++;
          }

          c1_db_out = (*c1_ErrCond == 25.0);
          if (c1_db_out) {
            transitionList[numTransitions] = 203;
            numTransitions++;
          }

          c1_eb_out = (*c1_ErrCond == 26.0);
          if (c1_eb_out) {
            transitionList[numTransitions] = 140;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 141U, chartInstance->c1_sfEvent);
        c1_d187 = (real_T)c1_const_MSG_PAUSELONG;
        sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d187, 0, 0U, 0U,
          0U, 0), 0);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 135U,
                     chartInstance->c1_sfEvent);
        c1_fb_out = (CV_TRANSITION_EVAL(135U, (int32_T)_SFD_CCP_CALL(135U, 0,
          *c1_ErrCond == 19.0 != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_fb_out) {
          if (sf_debug_transition_conflict_check_enabled()) {
            unsigned int transitionList[8];
            unsigned int numTransitions = 1;
            transitionList[0] = 135;
            sf_debug_transition_conflict_check_begin();
            c1_gb_out = (*c1_ErrCond == 20.0);
            if (c1_gb_out) {
              transitionList[numTransitions] = 142;
              numTransitions++;
            }

            c1_hb_out = (*c1_ErrCond == 21.0);
            if (c1_hb_out) {
              transitionList[numTransitions] = 143;
              numTransitions++;
            }

            c1_ib_out = (*c1_ErrCond == 22.0);
            if (c1_ib_out) {
              transitionList[numTransitions] = 145;
              numTransitions++;
            }

            c1_jb_out = (*c1_ErrCond == 23.0);
            if (c1_jb_out) {
              transitionList[numTransitions] = 146;
              numTransitions++;
            }

            c1_kb_out = (*c1_ErrCond == 24.0);
            if (c1_kb_out) {
              transitionList[numTransitions] = 169;
              numTransitions++;
            }

            c1_lb_out = (*c1_ErrCond == 25.0);
            if (c1_lb_out) {
              transitionList[numTransitions] = 203;
              numTransitions++;
            }

            c1_mb_out = (*c1_ErrCond == 26.0);
            if (c1_mb_out) {
              transitionList[numTransitions] = 140;
              numTransitions++;
            }

            sf_debug_transition_conflict_check_end();
            if (numTransitions > 1) {
              _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
            }
          }

          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 135U, chartInstance->c1_sfEvent);
          c1_d188 = (real_T)c1_const_MSG_LOGERR;
          sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d188, 0, 0U,
            0U, 0U, 0), 0);
        } else {
          _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 142U,
                       chartInstance->c1_sfEvent);
          c1_nb_out = (CV_TRANSITION_EVAL(142U, (int32_T)_SFD_CCP_CALL(142U, 0, *
            c1_ErrCond == 20.0 != 0U, chartInstance->c1_sfEvent)) != 0);
          if (c1_nb_out) {
            if (sf_debug_transition_conflict_check_enabled()) {
              unsigned int transitionList[7];
              unsigned int numTransitions = 1;
              transitionList[0] = 142;
              sf_debug_transition_conflict_check_begin();
              c1_ob_out = (*c1_ErrCond == 21.0);
              if (c1_ob_out) {
                transitionList[numTransitions] = 143;
                numTransitions++;
              }

              c1_pb_out = (*c1_ErrCond == 22.0);
              if (c1_pb_out) {
                transitionList[numTransitions] = 145;
                numTransitions++;
              }

              c1_qb_out = (*c1_ErrCond == 23.0);
              if (c1_qb_out) {
                transitionList[numTransitions] = 146;
                numTransitions++;
              }

              c1_rb_out = (*c1_ErrCond == 24.0);
              if (c1_rb_out) {
                transitionList[numTransitions] = 169;
                numTransitions++;
              }

              c1_sb_out = (*c1_ErrCond == 25.0);
              if (c1_sb_out) {
                transitionList[numTransitions] = 203;
                numTransitions++;
              }

              c1_tb_out = (*c1_ErrCond == 26.0);
              if (c1_tb_out) {
                transitionList[numTransitions] = 140;
                numTransitions++;
              }

              sf_debug_transition_conflict_check_end();
              if (numTransitions > 1) {
                _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
              }
            }

            _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 142U, chartInstance->c1_sfEvent);
            c1_d189 = (real_T)c1_const_MSG_LOWBATT;
            sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d189, 0, 0U,
              0U, 0U, 0), 0);
          } else {
            _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 143U,
                         chartInstance->c1_sfEvent);
            c1_ub_out = (CV_TRANSITION_EVAL(143U, (int32_T)_SFD_CCP_CALL(143U, 0,
              *c1_ErrCond == 21.0 != 0U, chartInstance->c1_sfEvent)) != 0);
            if (c1_ub_out) {
              if (sf_debug_transition_conflict_check_enabled()) {
                unsigned int transitionList[6];
                unsigned int numTransitions = 1;
                transitionList[0] = 143;
                sf_debug_transition_conflict_check_begin();
                c1_vb_out = (*c1_ErrCond == 22.0);
                if (c1_vb_out) {
                  transitionList[numTransitions] = 145;
                  numTransitions++;
                }

                c1_wb_out = (*c1_ErrCond == 23.0);
                if (c1_wb_out) {
                  transitionList[numTransitions] = 146;
                  numTransitions++;
                }

                c1_xb_out = (*c1_ErrCond == 24.0);
                if (c1_xb_out) {
                  transitionList[numTransitions] = 169;
                  numTransitions++;
                }

                c1_yb_out = (*c1_ErrCond == 25.0);
                if (c1_yb_out) {
                  transitionList[numTransitions] = 203;
                  numTransitions++;
                }

                c1_ac_out = (*c1_ErrCond == 26.0);
                if (c1_ac_out) {
                  transitionList[numTransitions] = 140;
                  numTransitions++;
                }

                sf_debug_transition_conflict_check_end();
                if (numTransitions > 1) {
                  _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
                }
              }

              _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 143U,
                           chartInstance->c1_sfEvent);
              c1_d190 = (real_T)c1_const_MSG_WRNBATTERYCHARGE;
              sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d190, 0,
                0U, 0U, 0U, 0), 0);
            } else {
              _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 145U,
                           chartInstance->c1_sfEvent);
              c1_bc_out = (CV_TRANSITION_EVAL(145U, (int32_T)_SFD_CCP_CALL(145U,
                0, *c1_ErrCond == 22.0 != 0U, chartInstance->c1_sfEvent)) != 0);
              if (c1_bc_out) {
                if (sf_debug_transition_conflict_check_enabled()) {
                  unsigned int transitionList[5];
                  unsigned int numTransitions = 1;
                  transitionList[0] = 145;
                  sf_debug_transition_conflict_check_begin();
                  c1_cc_out = (*c1_ErrCond == 23.0);
                  if (c1_cc_out) {
                    transitionList[numTransitions] = 146;
                    numTransitions++;
                  }

                  c1_dc_out = (*c1_ErrCond == 24.0);
                  if (c1_dc_out) {
                    transitionList[numTransitions] = 169;
                    numTransitions++;
                  }

                  c1_ec_out = (*c1_ErrCond == 25.0);
                  if (c1_ec_out) {
                    transitionList[numTransitions] = 203;
                    numTransitions++;
                  }

                  c1_fc_out = (*c1_ErrCond == 26.0);
                  if (c1_fc_out) {
                    transitionList[numTransitions] = 140;
                    numTransitions++;
                  }

                  sf_debug_transition_conflict_check_end();
                  if (numTransitions > 1) {
                    _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
                  }
                }

                _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 145U,
                             chartInstance->c1_sfEvent);
                c1_d191 = (real_T)c1_const_MSG_VOLTOUTRANGE;
                sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d191, 0,
                  0U, 0U, 0U, 0), 0);
              } else {
                _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 146U,
                             chartInstance->c1_sfEvent);
                c1_gc_out = (CV_TRANSITION_EVAL(146U, (int32_T)_SFD_CCP_CALL
                  (146U, 0, *c1_ErrCond == 23.0 != 0U, chartInstance->c1_sfEvent))
                             != 0);
                if (c1_gc_out) {
                  if (sf_debug_transition_conflict_check_enabled()) {
                    unsigned int transitionList[4];
                    unsigned int numTransitions = 1;
                    transitionList[0] = 146;
                    sf_debug_transition_conflict_check_begin();
                    c1_hc_out = (*c1_ErrCond == 24.0);
                    if (c1_hc_out) {
                      transitionList[numTransitions] = 169;
                      numTransitions++;
                    }

                    c1_ic_out = (*c1_ErrCond == 25.0);
                    if (c1_ic_out) {
                      transitionList[numTransitions] = 203;
                      numTransitions++;
                    }

                    c1_jc_out = (*c1_ErrCond == 26.0);
                    if (c1_jc_out) {
                      transitionList[numTransitions] = 140;
                      numTransitions++;
                    }

                    sf_debug_transition_conflict_check_end();
                    if (numTransitions > 1) {
                      _SFD_TRANSITION_CONFLICT(&(transitionList[0]),
                        numTransitions);
                    }
                  }

                  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 146U,
                               chartInstance->c1_sfEvent);
                  c1_d192 = (real_T)c1_const_MSG_PUMPOVERHEAT;
                  sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d192,
                    0, 0U, 0U, 0U, 0), 0);
                } else {
                  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 169U,
                               chartInstance->c1_sfEvent);
                  c1_kc_out = (CV_TRANSITION_EVAL(169U, (int32_T)_SFD_CCP_CALL
                    (169U, 0, *c1_ErrCond == 24.0 != 0U,
                     chartInstance->c1_sfEvent)) != 0);
                  if (c1_kc_out) {
                    if (sf_debug_transition_conflict_check_enabled()) {
                      unsigned int transitionList[3];
                      unsigned int numTransitions = 1;
                      transitionList[0] = 169;
                      sf_debug_transition_conflict_check_begin();
                      c1_lc_out = (*c1_ErrCond == 25.0);
                      if (c1_lc_out) {
                        transitionList[numTransitions] = 203;
                        numTransitions++;
                      }

                      c1_mc_out = (*c1_ErrCond == 26.0);
                      if (c1_mc_out) {
                        transitionList[numTransitions] = 140;
                        numTransitions++;
                      }

                      sf_debug_transition_conflict_check_end();
                      if (numTransitions > 1) {
                        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),
                          numTransitions);
                      }
                    }

                    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 169U,
                                 chartInstance->c1_sfEvent);
                    c1_d193 = (real_T)c1_const_MSG_DANGERENVTEMP;
                    sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d193,
                      0, 0U, 0U, 0U, 0), 0);
                  } else {
                    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 203U,
                                 chartInstance->c1_sfEvent);
                    c1_nc_out = (CV_TRANSITION_EVAL(203U, (int32_T)_SFD_CCP_CALL
                                  (203U, 0, *c1_ErrCond == 25.0 != 0U,
                                   chartInstance->c1_sfEvent)) != 0);
                    if (c1_nc_out) {
                      if (sf_debug_transition_conflict_check_enabled()) {
                        unsigned int transitionList[2];
                        unsigned int numTransitions = 1;
                        transitionList[0] = 203;
                        sf_debug_transition_conflict_check_begin();
                        c1_oc_out = (*c1_ErrCond == 26.0);
                        if (c1_oc_out) {
                          transitionList[numTransitions] = 140;
                          numTransitions++;
                        }

                        sf_debug_transition_conflict_check_end();
                        if (numTransitions > 1) {
                          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),
                            numTransitions);
                        }
                      }

                      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 203U,
                                   chartInstance->c1_sfEvent);
                      c1_d194 = (real_T)c1_const_MSG_DANGERHUMD;
                      sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg",
                        &c1_d194, 0, 0U, 0U, 0U, 0), 0);
                    } else {
                      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 140U,
                                   chartInstance->c1_sfEvent);
                      c1_pc_out = (CV_TRANSITION_EVAL(140U, (int32_T)
                        _SFD_CCP_CALL(140U, 0, *c1_ErrCond == 26.0 != 0U,
                                      chartInstance->c1_sfEvent)) != 0);
                      if (c1_pc_out) {
                        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 140U,
                                     chartInstance->c1_sfEvent);
                        c1_d195 = (real_T)c1_const_MSG_DANGERAP;
                        sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg",
                          &c1_d195, 0, 0U, 0U, 0U, 0), 0);
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

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 84U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(114U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 84U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static uint32_T c1_checkDoseRate(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, real_T c1_iRate)
{
  uint32_T c1_x;
  boolean_T c1_b_temp;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_temp;
  boolean_T c1_c_out;
  boolean_T c1_d_temp;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_e_temp;
  boolean_T c1_f_out;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("iRate", &c1_iRate, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK(c1_iRate, 119U);
  _SFD_SET_DATA_VALUE_PTR(120U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(119U, &c1_iRate);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 55U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 55U, chartInstance->c1_sfEvent);
  c1_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x, 120U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 238U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 238U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 202U, chartInstance->c1_sfEvent);
  c1_b_temp = (_SFD_CCP_CALL(202U, 0, c1_iRate > *(real_T *)((char_T *)
    c1_drugLibInfo + 32) != 0U, chartInstance->c1_sfEvent) != 0);
  if (!c1_b_temp) {
    c1_b_temp = (_SFD_CCP_CALL(202U, 1, c1_iRate < *(real_T *)((char_T *)
      c1_drugLibInfo + 48) != 0U, chartInstance->c1_sfEvent) != 0);
  }

  c1_out = (CV_TRANSITION_EVAL(202U, (int32_T)c1_b_temp) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 202;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = ((c1_iRate <= *(real_T *)((char_T *)c1_drugLibInfo + 32)) &&
                  (c1_iRate >= *(real_T *)((char_T *)c1_drugLibInfo + 48)));
      if (c1_b_out) {
        transitionList[numTransitions] = 1;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 202U, chartInstance->c1_sfEvent);
    c1_x = 2U;
    _SFD_DATA_RANGE_CHECK((real_T)c1_x, 120U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 1U, chartInstance->c1_sfEvent);
    c1_c_temp = (_SFD_CCP_CALL(1U, 0, c1_iRate <= *(real_T *)((char_T *)
      c1_drugLibInfo + 32) != 0U, chartInstance->c1_sfEvent) != 0);
    if (c1_c_temp) {
      c1_c_temp = (_SFD_CCP_CALL(1U, 1, c1_iRate >= *(real_T *)((char_T *)
        c1_drugLibInfo + 48) != 0U, chartInstance->c1_sfEvent) != 0);
    }

    c1_c_out = (CV_TRANSITION_EVAL(1U, (int32_T)c1_c_temp) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 1U, chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 60U,
                   chartInstance->c1_sfEvent);
      c1_d_temp = (_SFD_CCP_CALL(60U, 0, c1_iRate > *(real_T *)((char_T *)
        c1_drugLibInfo + 40) != 0U, chartInstance->c1_sfEvent) != 0);
      if (!c1_d_temp) {
        c1_d_temp = (_SFD_CCP_CALL(60U, 1, c1_iRate < *(real_T *)((char_T *)
          c1_drugLibInfo + 56) != 0U, chartInstance->c1_sfEvent) != 0);
      }

      c1_d_out = (CV_TRANSITION_EVAL(60U, (int32_T)c1_d_temp) != 0);
      if (c1_d_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 60;
          sf_debug_transition_conflict_check_begin();
          c1_e_out = ((c1_iRate <= *(real_T *)((char_T *)c1_drugLibInfo + 40)) &&
                      (c1_iRate >= *(real_T *)((char_T *)c1_drugLibInfo + 56)));
          if (c1_e_out) {
            transitionList[numTransitions] = 207;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 60U, chartInstance->c1_sfEvent);
        c1_x = 1U;
        _SFD_DATA_RANGE_CHECK((real_T)c1_x, 120U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 207U,
                     chartInstance->c1_sfEvent);
        c1_e_temp = (_SFD_CCP_CALL(207U, 0, c1_iRate <= *(real_T *)((char_T *)
          c1_drugLibInfo + 40) != 0U, chartInstance->c1_sfEvent) != 0);
        if (c1_e_temp) {
          c1_e_temp = (_SFD_CCP_CALL(207U, 1, c1_iRate >= *(real_T *)((char_T *)
            c1_drugLibInfo + 56) != 0U, chartInstance->c1_sfEvent) != 0);
        }

        c1_f_out = (CV_TRANSITION_EVAL(207U, (int32_T)c1_e_temp) != 0);
        if (c1_f_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 207U, chartInstance->c1_sfEvent);
          c1_x = 0U;
          _SFD_DATA_RANGE_CHECK((real_T)c1_x, 120U);
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 55U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(120U);
  _SFD_UNSET_DATA_VALUE_PTR(119U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 55U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_setPatientInfo(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_x;
  c1_PatientInformation *c1_O_PatientInfo;
  c1_PatientInformation *c1_patientInfo;
  c1_O_PatientInfo = (c1_PatientInformation *)ssGetOutputPortSignal
    (chartInstance->S, 9);
  c1_patientInfo = (c1_PatientInformation *)ssGetInputPortSignal
    (chartInstance->S, 2);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(96U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 80U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 80U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 96U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 106U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 106U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 157U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 157U, chartInstance->c1_sfEvent);
  *(uint32_T *)((char_T *)c1_O_PatientInfo + 0) = *(uint32_T *)((char_T *)
    c1_patientInfo + 0);
  *(uint32_T *)((char_T *)c1_O_PatientInfo + 4) = *(uint32_T *)((char_T *)
    c1_patientInfo + 4);
  *(uint32_T *)((char_T *)c1_O_PatientInfo + 8) = *(uint32_T *)((char_T *)
    c1_patientInfo + 8);
  *(uint32_T *)((char_T *)c1_O_PatientInfo + 12) = *(uint32_T *)((char_T *)
    c1_patientInfo + 12);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 80U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(96U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 80U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_setDrugLibInfo(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_x;
  c1_DrugLibrary *c1_O_DrugLibInfo;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_O_DrugLibInfo = (c1_DrugLibrary *)ssGetOutputPortSignal(chartInstance->S, 8);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(100U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 77U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 77U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 100U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 45U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 45U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 108U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 108U, chartInstance->c1_sfEvent);
  *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 0) = *(uint32_T *)((char_T *)
    c1_drugLibInfo + 0);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 8) = *(real_T *)((char_T *)
    c1_drugLibInfo + 8);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 129U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 129U, chartInstance->c1_sfEvent);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 24) = *(real_T *)((char_T *)
    c1_drugLibInfo + 24);
  *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 64) = *(uint32_T *)((char_T *)
    c1_drugLibInfo + 64);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 32) = *(real_T *)((char_T *)
    c1_drugLibInfo + 32);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 40) = *(real_T *)((char_T *)
    c1_drugLibInfo + 40);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 56) = *(real_T *)((char_T *)
    c1_drugLibInfo + 56);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 48) = *(real_T *)((char_T *)
    c1_drugLibInfo + 48);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 220U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 220U, chartInstance->c1_sfEvent);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 72) = *(real_T *)((char_T *)
    c1_drugLibInfo + 72);
  *(uint32_T *)((char_T *)c1_O_DrugLibInfo + 112) = *(uint32_T *)((char_T *)
    c1_drugLibInfo + 112);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 80) = *(real_T *)((char_T *)
    c1_drugLibInfo + 80);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 88) = *(real_T *)((char_T *)
    c1_drugLibInfo + 88);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 104) = *(real_T *)((char_T *)
    c1_drugLibInfo + 104);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 96) = *(real_T *)((char_T *)
    c1_drugLibInfo + 96);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 32U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 32U, chartInstance->c1_sfEvent);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 120) = *(real_T *)((char_T *)
    c1_drugLibInfo + 120);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 128) = *(real_T *)((char_T *)
    c1_drugLibInfo + 128);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 136) = *(real_T *)((char_T *)
    c1_drugLibInfo + 136);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 152) = *(real_T *)((char_T *)
    c1_drugLibInfo + 152);
  *(real_T *)((char_T *)c1_O_DrugLibInfo + 144) = *(real_T *)((char_T *)
    c1_drugLibInfo + 144);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 77U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(100U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 77U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static uint32_T c1_alrmLevel(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  uint32_T c1_x;
  boolean_T c1_b_temp;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_c_temp;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  boolean_T c1_g_out;
  boolean_T c1_h_out;
  boolean_T c1_i_out;
  boolean_T c1_j_out;
  real_T *c1_ErrCond;
  uint32_T *c1_O_AlarmCond;
  c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 11);
  c1_ErrCond = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(99U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 52U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 52U, chartInstance->c1_sfEvent);
  c1_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x, 99U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 107U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 107U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 149U, chartInstance->c1_sfEvent);
  c1_b_temp = (_SFD_CCP_CALL(149U, 0, *c1_ErrCond > 0.0 != 0U,
    chartInstance->c1_sfEvent) != 0);
  if (c1_b_temp) {
    c1_b_temp = (_SFD_CCP_CALL(149U, 1, *c1_ErrCond < 7.0 != 0U,
      chartInstance->c1_sfEvent) != 0);
  }

  c1_out = (CV_TRANSITION_EVAL(149U, (int32_T)c1_b_temp) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[4];
      unsigned int numTransitions = 1;
      transitionList[0] = 149;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = ((*c1_ErrCond >= 7.0) && (*c1_ErrCond < 16.0));
      if (c1_b_out) {
        transitionList[numTransitions] = 150;
        numTransitions++;
      }

      c1_c_out = (*c1_ErrCond >= 16.0);
      if (c1_c_out) {
        transitionList[numTransitions] = 152;
        numTransitions++;
      }

      c1_d_out = (*c1_ErrCond == 0.0);
      if (c1_d_out) {
        transitionList[numTransitions] = 58;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 149U, chartInstance->c1_sfEvent);
    *c1_O_AlarmCond = (uint32_T)*c1_ErrCond;
    _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
    c1_x = 1U;
    _SFD_DATA_RANGE_CHECK((real_T)c1_x, 99U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 150U,
                 chartInstance->c1_sfEvent);
    c1_c_temp = (_SFD_CCP_CALL(150U, 0, *c1_ErrCond >= 7.0 != 0U,
      chartInstance->c1_sfEvent) != 0);
    if (c1_c_temp) {
      c1_c_temp = (_SFD_CCP_CALL(150U, 1, *c1_ErrCond < 16.0 != 0U,
        chartInstance->c1_sfEvent) != 0);
    }

    c1_e_out = (CV_TRANSITION_EVAL(150U, (int32_T)c1_c_temp) != 0);
    if (c1_e_out) {
      if (sf_debug_transition_conflict_check_enabled()) {
        unsigned int transitionList[3];
        unsigned int numTransitions = 1;
        transitionList[0] = 150;
        sf_debug_transition_conflict_check_begin();
        c1_f_out = (*c1_ErrCond >= 16.0);
        if (c1_f_out) {
          transitionList[numTransitions] = 152;
          numTransitions++;
        }

        c1_g_out = (*c1_ErrCond == 0.0);
        if (c1_g_out) {
          transitionList[numTransitions] = 58;
          numTransitions++;
        }

        sf_debug_transition_conflict_check_end();
        if (numTransitions > 1) {
          _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
        }
      }

      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 150U, chartInstance->c1_sfEvent);
      *c1_O_AlarmCond = (uint32_T)*c1_ErrCond;
      _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
      c1_x = 2U;
      _SFD_DATA_RANGE_CHECK((real_T)c1_x, 99U);
    } else {
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 152U,
                   chartInstance->c1_sfEvent);
      c1_h_out = (CV_TRANSITION_EVAL(152U, (int32_T)_SFD_CCP_CALL(152U, 0,
        *c1_ErrCond >= 16.0 != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_h_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 152;
          sf_debug_transition_conflict_check_begin();
          c1_i_out = (*c1_ErrCond == 0.0);
          if (c1_i_out) {
            transitionList[numTransitions] = 58;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 152U, chartInstance->c1_sfEvent);
        *c1_O_AlarmCond = (uint32_T)*c1_ErrCond;
        _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
        c1_x = 3U;
        _SFD_DATA_RANGE_CHECK((real_T)c1_x, 99U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 58U,
                     chartInstance->c1_sfEvent);
        c1_j_out = (CV_TRANSITION_EVAL(58U, (int32_T)_SFD_CCP_CALL(58U, 0,
          *c1_ErrCond == 0.0 != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_j_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 58U, chartInstance->c1_sfEvent);
          *c1_O_AlarmCond = (uint32_T)*c1_ErrCond;
          _SFD_DATA_RANGE_CHECK((real_T)*c1_O_AlarmCond, 83U);
          c1_x = 0U;
          _SFD_DATA_RANGE_CHECK((real_T)c1_x, 99U);
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 52U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(99U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 52U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_calcFlowRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_iRate)
{
  real_T c1_x;
  c1_DrugInformation *c1_drugInfo;
  c1_drugInfo = (c1_DrugInformation *)ssGetInputPortSignal(chartInstance->S, 3);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("iRate", &c1_iRate, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK(c1_iRate, 128U);
  _SFD_SET_DATA_VALUE_PTR(127U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(128U, &c1_iRate);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 54U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 54U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 127U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 43U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 43U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 19U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 19U, chartInstance->c1_sfEvent);
  c1_x = c1_iRate / *(real_T *)((char_T *)c1_drugInfo + 24);
  _SFD_DATA_RANGE_CHECK(c1_x, 127U);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 54U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(127U);
  _SFD_UNSET_DATA_VALUE_PTR(128U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 54U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_checkDrugConcentration(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  real_T c1_x;
  real_T c1_lowerSoft;
  real_T c1_lowerHard;
  real_T c1_upperSoft;
  real_T c1_upperHard;
  real_T c1_actualCon;
  boolean_T c1_b_temp;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_temp;
  boolean_T c1_c_out;
  boolean_T c1_d_temp;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_e_temp;
  boolean_T c1_f_out;
  c1_DrugInformation *c1_drugInfo;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugInfo = (c1_DrugInformation *)ssGetInputPortSignal(chartInstance->S, 3);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  sf_debug_symbol_scope_push(6U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("lowerSoft", &c1_lowerSoft,
    c1_e_sf_marshallOut, c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("lowerHard", &c1_lowerHard,
    c1_e_sf_marshallOut, c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("upperSoft", &c1_upperSoft,
    c1_e_sf_marshallOut, c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("upperHard", &c1_upperHard,
    c1_e_sf_marshallOut, c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("actualCon", &c1_actualCon,
    c1_e_sf_marshallOut, c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(105U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(110U, &c1_lowerSoft);
  _SFD_SET_DATA_VALUE_PTR(109U, &c1_lowerHard);
  _SFD_SET_DATA_VALUE_PTR(108U, &c1_upperSoft);
  _SFD_SET_DATA_VALUE_PTR(107U, &c1_upperHard);
  _SFD_SET_DATA_VALUE_PTR(106U, &c1_actualCon);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 57U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 57U, chartInstance->c1_sfEvent);
  c1_actualCon = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_actualCon, 106U);
  c1_upperHard = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_upperHard, 107U);
  c1_upperSoft = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_upperSoft, 108U);
  c1_lowerHard = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_lowerHard, 109U);
  c1_lowerSoft = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_lowerSoft, 110U);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 105U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 162U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 162U, chartInstance->c1_sfEvent);
  c1_actualCon = *(real_T *)((char_T *)c1_drugInfo + 24);
  _SFD_DATA_RANGE_CHECK(c1_actualCon, 106U);
  c1_upperHard = *(real_T *)((char_T *)c1_drugLibInfo + 128);
  _SFD_DATA_RANGE_CHECK(c1_upperHard, 107U);
  c1_upperSoft = *(real_T *)((char_T *)c1_drugLibInfo + 136);
  _SFD_DATA_RANGE_CHECK(c1_upperSoft, 108U);
  c1_lowerHard = *(real_T *)((char_T *)c1_drugLibInfo + 144);
  _SFD_DATA_RANGE_CHECK(c1_lowerHard, 109U);
  c1_lowerSoft = *(real_T *)((char_T *)c1_drugLibInfo + 152);
  _SFD_DATA_RANGE_CHECK(c1_lowerSoft, 110U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 25U, chartInstance->c1_sfEvent);
  c1_b_temp = (_SFD_CCP_CALL(25U, 0, c1_actualCon > c1_upperHard != 0U,
    chartInstance->c1_sfEvent) != 0);
  if (!c1_b_temp) {
    c1_b_temp = (_SFD_CCP_CALL(25U, 1, c1_actualCon < c1_lowerHard != 0U,
      chartInstance->c1_sfEvent) != 0);
  }

  c1_out = (CV_TRANSITION_EVAL(25U, (int32_T)c1_b_temp) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 25;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = ((c1_actualCon <= c1_upperHard) && (c1_actualCon >=
        c1_lowerHard));
      if (c1_b_out) {
        transitionList[numTransitions] = 56;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 25U, chartInstance->c1_sfEvent);
    c1_x = 2.0;
    _SFD_DATA_RANGE_CHECK(c1_x, 105U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 56U,
                 chartInstance->c1_sfEvent);
    c1_c_temp = (_SFD_CCP_CALL(56U, 0, c1_actualCon <= c1_upperHard != 0U,
      chartInstance->c1_sfEvent) != 0);
    if (c1_c_temp) {
      c1_c_temp = (_SFD_CCP_CALL(56U, 1, c1_actualCon >= c1_lowerHard != 0U,
        chartInstance->c1_sfEvent) != 0);
    }

    c1_c_out = (CV_TRANSITION_EVAL(56U, (int32_T)c1_c_temp) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 56U, chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 164U,
                   chartInstance->c1_sfEvent);
      c1_d_temp = (_SFD_CCP_CALL(164U, 0, c1_actualCon > c1_upperSoft != 0U,
        chartInstance->c1_sfEvent) != 0);
      if (!c1_d_temp) {
        c1_d_temp = (_SFD_CCP_CALL(164U, 1, c1_actualCon < c1_lowerSoft != 0U,
          chartInstance->c1_sfEvent) != 0);
      }

      c1_d_out = (CV_TRANSITION_EVAL(164U, (int32_T)c1_d_temp) != 0);
      if (c1_d_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 164;
          sf_debug_transition_conflict_check_begin();
          c1_e_out = ((c1_actualCon <= c1_upperSoft) && (c1_actualCon >=
            c1_lowerSoft));
          if (c1_e_out) {
            transitionList[numTransitions] = 163;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 164U, chartInstance->c1_sfEvent);
        c1_x = 1.0;
        _SFD_DATA_RANGE_CHECK(c1_x, 105U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 163U,
                     chartInstance->c1_sfEvent);
        c1_e_temp = (_SFD_CCP_CALL(163U, 0, c1_actualCon <= c1_upperSoft != 0U,
          chartInstance->c1_sfEvent) != 0);
        if (c1_e_temp) {
          c1_e_temp = (_SFD_CCP_CALL(163U, 1, c1_actualCon >= c1_lowerSoft != 0U,
            chartInstance->c1_sfEvent) != 0);
        }

        c1_f_out = (CV_TRANSITION_EVAL(163U, (int32_T)c1_e_temp) != 0);
        if (c1_f_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 163U, chartInstance->c1_sfEvent);
          c1_x = 0.0;
          _SFD_DATA_RANGE_CHECK(c1_x, 105U);
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 57U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(105U);
  _SFD_UNSET_DATA_VALUE_PTR(110U);
  _SFD_UNSET_DATA_VALUE_PTR(109U);
  _SFD_UNSET_DATA_VALUE_PTR(108U);
  _SFD_UNSET_DATA_VALUE_PTR(107U);
  _SFD_UNSET_DATA_VALUE_PTR(106U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 57U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_infusionDone(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_expectedVolume)
{
  real_T c1_x;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  c1_InfusionStatus *c1_infuStatus;
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("expectedVolume", &c1_expectedVolume,
    c1_e_sf_marshallOut, c1_f_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK(c1_expectedVolume, 123U);
  _SFD_SET_DATA_VALUE_PTR(124U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(123U, &c1_expectedVolume);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 66U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 66U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 124U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 31U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 31U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 124U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 219U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(219U, (int32_T)_SFD_CCP_CALL(219U, 0, *(real_T *)
              ((char_T *)c1_infuStatus + 8) >= c1_expectedVolume != 0U,
              chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 219;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (*(real_T *)((char_T *)c1_infuStatus + 8) < c1_expectedVolume);
      if (c1_b_out) {
        transitionList[numTransitions] = 218;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 219U, chartInstance->c1_sfEvent);
    c1_x = 1.0;
    _SFD_DATA_RANGE_CHECK(c1_x, 124U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 218U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(218U, (int32_T)_SFD_CCP_CALL(218U, 0,
      *(real_T *)((char_T *)c1_infuStatus + 8) < c1_expectedVolume != 0U,
      chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 218U, chartInstance->c1_sfEvent);
      c1_x = 0.0;
      _SFD_DATA_RANGE_CHECK(c1_x, 124U);
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 66U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(124U);
  _SFD_UNSET_DATA_VALUE_PTR(123U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 66U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static uint32_T c1_clearLevel2Alarm(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  uint32_T c1_x;
  real_T c1_d196;
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(129U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 62U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 62U, chartInstance->c1_sfEvent);
  c1_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x, 129U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 235U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 235U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 57U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 57U, chartInstance->c1_sfEvent);
  c1_d196 = (real_T)c1_const_MSG_BLANK;
  sf_mex_export("GAlrmMsg", sf_mex_create("GAlrmMsg", &c1_d196, 0, 0U, 0U, 0U, 0),
                0);
  chartInstance->c1_E_AlarmClearEventCounter++;
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 62U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(129U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 62U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static uint32_T c1_checkDrugType(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  uint32_T c1_x;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  c1_DrugInformation *c1_drugInfo;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugInfo = (c1_DrugInformation *)ssGetInputPortSignal(chartInstance->S, 3);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_b_sf_marshallOut,
    c1_b_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(111U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 58U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 58U, chartInstance->c1_sfEvent);
  c1_x = 0U;
  _SFD_DATA_RANGE_CHECK((real_T)c1_x, 111U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 200U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 200U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 236U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(236U, (int32_T)_SFD_CCP_CALL(236U, 0, *(uint32_T *)
              ((char_T *)c1_drugInfo + 0) != *(uint32_T *)((char_T *)
    c1_drugLibInfo + 0) != 0U, chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 236;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (*(uint32_T *)((char_T *)c1_drugInfo + 0) == *(uint32_T *)
                  ((char_T *)c1_drugLibInfo + 0));
      if (c1_b_out) {
        transitionList[numTransitions] = 237;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 236U, chartInstance->c1_sfEvent);
    c1_x = 1U;
    _SFD_DATA_RANGE_CHECK((real_T)c1_x, 111U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 237U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(237U, (int32_T)_SFD_CCP_CALL(237U, 0,
      *(uint32_T *)((char_T *)c1_drugInfo + 0) == *(uint32_T *)((char_T *)
      c1_drugLibInfo + 0) != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 237U, chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 180U,
                   chartInstance->c1_sfEvent);
      c1_d_out = (CV_TRANSITION_EVAL(180U, (int32_T)_SFD_CCP_CALL(180U, 0,
        *(real_T *)((char_T *)c1_drugInfo + 8) != *(real_T *)((char_T *)
        c1_drugLibInfo + 8) != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_d_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 180;
          sf_debug_transition_conflict_check_begin();
          c1_e_out = (*(real_T *)((char_T *)c1_drugInfo + 8) == *(real_T *)
                      ((char_T *)c1_drugLibInfo + 8));
          if (c1_e_out) {
            transitionList[numTransitions] = 166;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 180U, chartInstance->c1_sfEvent);
        c1_x = 1U;
        _SFD_DATA_RANGE_CHECK((real_T)c1_x, 111U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 166U,
                     chartInstance->c1_sfEvent);
        c1_f_out = (CV_TRANSITION_EVAL(166U, (int32_T)_SFD_CCP_CALL(166U, 0,
          *(real_T *)((char_T *)c1_drugInfo + 8) == *(real_T *)((char_T *)
          c1_drugLibInfo + 8) != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_f_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 166U, chartInstance->c1_sfEvent);
          c1_x = 0U;
          _SFD_DATA_RANGE_CHECK((real_T)c1_x, 111U);
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 58U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(111U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 58U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_checkDrugUnits(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_x;
  boolean_T c1_out;
  boolean_T c1_b_out;
  boolean_T c1_c_out;
  boolean_T c1_d_out;
  boolean_T c1_e_out;
  boolean_T c1_f_out;
  c1_DrugInformation *c1_drugInfo;
  c1_DrugLibrary *c1_drugLibInfo;
  c1_drugInfo = (c1_DrugInformation *)ssGetInputPortSignal(chartInstance->S, 3);
  c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal(chartInstance->S, 1);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(115U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 59U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 59U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 115U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 161U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 161U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 173U, chartInstance->c1_sfEvent);
  c1_out = (CV_TRANSITION_EVAL(173U, (int32_T)_SFD_CCP_CALL(173U, 0, *(uint32_T *)
              ((char_T *)c1_drugInfo + 32) != *(uint32_T *)((char_T *)
    c1_drugLibInfo + 64) != 0U, chartInstance->c1_sfEvent)) != 0);
  if (c1_out) {
    if (sf_debug_transition_conflict_check_enabled()) {
      unsigned int transitionList[2];
      unsigned int numTransitions = 1;
      transitionList[0] = 173;
      sf_debug_transition_conflict_check_begin();
      c1_b_out = (*(uint32_T *)((char_T *)c1_drugInfo + 32) == *(uint32_T *)
                  ((char_T *)c1_drugLibInfo + 64));
      if (c1_b_out) {
        transitionList[numTransitions] = 172;
        numTransitions++;
      }

      sf_debug_transition_conflict_check_end();
      if (numTransitions > 1) {
        _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
      }
    }

    _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 173U, chartInstance->c1_sfEvent);
    c1_x = 1.0;
    _SFD_DATA_RANGE_CHECK(c1_x, 115U);
  } else {
    _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 172U,
                 chartInstance->c1_sfEvent);
    c1_c_out = (CV_TRANSITION_EVAL(172U, (int32_T)_SFD_CCP_CALL(172U, 0,
      *(uint32_T *)((char_T *)c1_drugInfo + 32) == *(uint32_T *)((char_T *)
      c1_drugLibInfo + 64) != 0U, chartInstance->c1_sfEvent)) != 0);
    if (c1_c_out) {
      _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 172U, chartInstance->c1_sfEvent);
      _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 170U,
                   chartInstance->c1_sfEvent);
      c1_d_out = (CV_TRANSITION_EVAL(170U, (int32_T)_SFD_CCP_CALL(170U, 0,
        *(uint32_T *)((char_T *)c1_drugInfo + 36) != *(uint32_T *)((char_T *)
        c1_drugLibInfo + 112) != 0U, chartInstance->c1_sfEvent)) != 0);
      if (c1_d_out) {
        if (sf_debug_transition_conflict_check_enabled()) {
          unsigned int transitionList[2];
          unsigned int numTransitions = 1;
          transitionList[0] = 170;
          sf_debug_transition_conflict_check_begin();
          c1_e_out = (*(uint32_T *)((char_T *)c1_drugInfo + 36) == *(uint32_T *)
                      ((char_T *)c1_drugLibInfo + 112));
          if (c1_e_out) {
            transitionList[numTransitions] = 33;
            numTransitions++;
          }

          sf_debug_transition_conflict_check_end();
          if (numTransitions > 1) {
            _SFD_TRANSITION_CONFLICT(&(transitionList[0]),numTransitions);
          }
        }

        _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 170U, chartInstance->c1_sfEvent);
        c1_x = 1.0;
        _SFD_DATA_RANGE_CHECK(c1_x, 115U);
      } else {
        _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 33U,
                     chartInstance->c1_sfEvent);
        c1_f_out = (CV_TRANSITION_EVAL(33U, (int32_T)_SFD_CCP_CALL(33U, 0,
          *(uint32_T *)((char_T *)c1_drugInfo + 36) == *(uint32_T *)((char_T *)
          c1_drugLibInfo + 112) != 0U, chartInstance->c1_sfEvent)) != 0);
        if (c1_f_out) {
          _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 33U, chartInstance->c1_sfEvent);
          c1_x = 0.0;
          _SFD_DATA_RANGE_CHECK(c1_x, 115U);
        }
      }
    }
  }

  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 59U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(115U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 59U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_stopInfusion(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_x;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  boolean_T *c1_O_BolusRequested;
  real_T *c1_O_ProgrammedVTBI;
  real_T *c1_O_ProgrammedFlowRate;
  c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal(chartInstance->S, 6);
  c1_O_ProgrammedVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S, 5);
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(137U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 83U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 83U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 137U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 258U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 258U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 259U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 259U, chartInstance->c1_sfEvent);
  chartInstance->c1_infusing = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_infusing, 84U);
  chartInstance->c1_bolusing = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 244U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 244U, chartInstance->c1_sfEvent);
  *c1_O_InfusionInProgress = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionInProgress, 2U);
  *c1_O_InfusionPaused = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionPaused, 3U);
  *c1_O_BolusRequested = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_BolusRequested, 4U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 243U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 243U, chartInstance->c1_sfEvent);
  *c1_O_ProgrammedVTBI = 0.0;
  _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedVTBI, 5U);
  *c1_O_ProgrammedFlowRate = 0.0;
  _SFD_DATA_RANGE_CHECK(*c1_O_ProgrammedFlowRate, 6U);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 83U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(137U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 83U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_setVTBI(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_iVTBI)
{
  real_T c1_x;
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("iVTBI", &c1_iVTBI, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK(c1_iVTBI, 132U);
  _SFD_SET_DATA_VALUE_PTR(133U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(132U, &c1_iVTBI);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 81U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 81U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 133U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 245U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 245U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 246U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 246U, chartInstance->c1_sfEvent);
  chartInstance->c1_vtbi = c1_iVTBI;
  _SFD_DATA_RANGE_CHECK(chartInstance->c1_vtbi, 86U);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 81U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(133U);
  _SFD_UNSET_DATA_VALUE_PTR(132U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 81U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_setDoseRate(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_iRate)
{
  real_T c1_x;
  sf_debug_symbol_scope_push(2U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  sf_debug_symbol_scope_add_importable("iRate", &c1_iRate, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_DATA_RANGE_CHECK(c1_iRate, 134U);
  _SFD_SET_DATA_VALUE_PTR(135U, &c1_x);
  _SFD_SET_DATA_VALUE_PTR(134U, &c1_iRate);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 76U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 76U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 135U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 247U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 247U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 248U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 248U, chartInstance->c1_sfEvent);
  chartInstance->c1_doseRate = c1_iRate;
  _SFD_DATA_RANGE_CHECK(chartInstance->c1_doseRate, 87U);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 76U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(135U);
  _SFD_UNSET_DATA_VALUE_PTR(134U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 76U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_pauseInfusion(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_x;
  boolean_T *c1_O_InfusionInProgress;
  boolean_T *c1_O_InfusionPaused;
  boolean_T *c1_O_BolusRequested;
  c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 4);
  c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal(chartInstance->S, 3);
  c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal(chartInstance->S,
    2);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(138U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 73U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 73U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 138U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 255U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 255U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 256U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 256U, chartInstance->c1_sfEvent);
  chartInstance->c1_infusing = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_infusing, 84U);
  chartInstance->c1_bolusing = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)chartInstance->c1_bolusing, 85U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 257U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 257U, chartInstance->c1_sfEvent);
  *c1_O_InfusionInProgress = TRUE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionInProgress, 2U);
  *c1_O_InfusionPaused = TRUE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_InfusionPaused, 3U);
  *c1_O_BolusRequested = FALSE;
  _SFD_DATA_RANGE_CHECK((real_T)*c1_O_BolusRequested, 4U);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 73U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(138U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 73U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_resetInfusionInstructions(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
  real_T c1_x;
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(130U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 74U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 74U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 130U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 261U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 261U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 260U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 260U, chartInstance->c1_sfEvent);
  c1_stopInfusion(chartInstance);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 74U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(130U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 74U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_copyInfuStatus(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_x;
  c1_InfusionStatus *c1_O_InfuStatus;
  c1_InfusionStatus *c1_infuStatus;
  c1_O_InfuStatus = (c1_InfusionStatus *)ssGetOutputPortSignal(chartInstance->S,
    10);
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(136U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 63U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 63U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 136U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 266U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 266U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 267U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 267U, chartInstance->c1_sfEvent);
  *(boolean_T *)((char_T *)c1_O_InfuStatus + 0) = *(boolean_T *)((char_T *)
    c1_infuStatus + 0);
  *(real_T *)((char_T *)c1_O_InfuStatus + 8) = *(real_T *)((char_T *)
    c1_infuStatus + 8);
  *(real_T *)((char_T *)c1_O_InfuStatus + 16) = *(real_T *)((char_T *)
    c1_infuStatus + 16);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 63U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(136U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 63U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static real_T c1_initInfuStatus(SFc1_GPCA_ExtensionInstanceStruct *chartInstance)
{
  real_T c1_x;
  c1_InfusionStatus *c1_O_InfuStatus;
  c1_InfusionStatus *c1_infuStatus;
  c1_O_InfuStatus = (c1_InfusionStatus *)ssGetOutputPortSignal(chartInstance->S,
    10);
  c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal(chartInstance->S, 5);
  sf_debug_symbol_scope_push(1U, 0U);
  sf_debug_symbol_scope_add_importable("x", &c1_x, c1_e_sf_marshallOut,
    c1_f_sf_marshallIn);
  _SFD_SET_DATA_VALUE_PTR(139U, &c1_x);
  _SFD_CS_CALL(FUNCTION_ACTIVE_TAG, 69U, chartInstance->c1_sfEvent);
  _SFD_CS_CALL(STATE_ENTER_DURING_FUNCTION_TAG, 69U, chartInstance->c1_sfEvent);
  c1_x = 0.0;
  _SFD_DATA_RANGE_CHECK(c1_x, 139U);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 268U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 268U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_BEFORE_PROCESSING_TAG, 269U, chartInstance->c1_sfEvent);
  _SFD_CT_CALL(TRANSITION_ACTIVE_TAG, 269U, chartInstance->c1_sfEvent);
  *(boolean_T *)((char_T *)c1_O_InfuStatus + 0) = FALSE;
  *(real_T *)((char_T *)c1_O_InfuStatus + 8) = 0.0;
  *(real_T *)((char_T *)c1_O_InfuStatus + 16) = *(real_T *)((char_T *)
    c1_infuStatus + 16);
  _SFD_CS_CALL(FUNCTION_INACTIVE_TAG, 69U, chartInstance->c1_sfEvent);
  _SFD_UNSET_DATA_VALUE_PTR(139U);
  _SFD_CS_CALL(EXIT_OUT_OF_FUNCTION_TAG, 69U, chartInstance->c1_sfEvent);
  sf_debug_symbol_scope_pop();
  return c1_x;
}

static const mxArray *c1_sf_marshallOut(void *chartInstanceVoid, void *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  int8_T c1_u;
  const mxArray *c1_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(int8_T *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_create("y", &c1_u, 2, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static int8_T c1_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId)
{
  int8_T c1_y;
  int8_T c1_i0;
  sf_mex_import(c1_parentId, sf_mex_dup(c1_u), &c1_i0, 1, 2, 0U, 0, 0U, 0);
  c1_y = c1_i0;
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static void c1_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData)
{
  const mxArray *c1_E_Clock;
  const char_T *c1_identifier;
  emlrtMsgIdentifier c1_thisId;
  int8_T c1_y;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_E_Clock = sf_mex_dup(c1_mxArrayInData);
  c1_identifier = c1_varName;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_E_Clock), &c1_thisId);
  sf_mex_destroy(&c1_E_Clock);
  *(int8_T *)c1_outData = c1_y;
  sf_mex_destroy(&c1_mxArrayInData);
}

static const mxArray *c1_b_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  uint32_T c1_u;
  const mxArray *c1_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(uint32_T *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_create("y", &c1_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static uint32_T c1_b_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_b_E_RestartEventCounter, const char_T
  *c1_identifier)
{
  uint32_T c1_y;
  emlrtMsgIdentifier c1_thisId;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c1_b_E_RestartEventCounter), &c1_thisId);
  sf_mex_destroy(&c1_b_E_RestartEventCounter);
  return c1_y;
}

static uint32_T c1_c_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId)
{
  uint32_T c1_y;
  uint32_T c1_u0;
  sf_mex_import(c1_parentId, sf_mex_dup(c1_u), &c1_u0, 1, 7, 0U, 0, 0U, 0);
  c1_y = c1_u0;
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static void c1_b_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData)
{
  const mxArray *c1_b_E_RestartEventCounter;
  const char_T *c1_identifier;
  emlrtMsgIdentifier c1_thisId;
  uint32_T c1_y;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_b_E_RestartEventCounter = sf_mex_dup(c1_mxArrayInData);
  c1_identifier = c1_varName;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c1_b_E_RestartEventCounter), &c1_thisId);
  sf_mex_destroy(&c1_b_E_RestartEventCounter);
  *(uint32_T *)c1_outData = c1_y;
  sf_mex_destroy(&c1_mxArrayInData);
}

static const mxArray *c1_c_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  int32_T c1_u;
  const mxArray *c1_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(int32_T *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_create("y", &c1_u, 6, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static int32_T c1_d_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId)
{
  int32_T c1_y;
  int32_T c1_i1;
  sf_mex_import(c1_parentId, sf_mex_dup(c1_u), &c1_i1, 1, 6, 0U, 0, 0U, 0);
  c1_y = c1_i1;
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static void c1_c_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData)
{
  const mxArray *c1_b_sfEvent;
  const char_T *c1_identifier;
  emlrtMsgIdentifier c1_thisId;
  int32_T c1_y;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_b_sfEvent = sf_mex_dup(c1_mxArrayInData);
  c1_identifier = c1_varName;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_d_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_b_sfEvent),
    &c1_thisId);
  sf_mex_destroy(&c1_b_sfEvent);
  *(int32_T *)c1_outData = c1_y;
  sf_mex_destroy(&c1_mxArrayInData);
}

static const mxArray *c1_d_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  uint8_T c1_u;
  const mxArray *c1_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(uint8_T *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_create("y", &c1_u, 3, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static uint8_T c1_e_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_b_tp_ALM_VTBIOutBound, const char_T
  *c1_identifier)
{
  uint8_T c1_y;
  emlrtMsgIdentifier c1_thisId;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_f_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c1_b_tp_ALM_VTBIOutBound), &c1_thisId);
  sf_mex_destroy(&c1_b_tp_ALM_VTBIOutBound);
  return c1_y;
}

static uint8_T c1_f_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId)
{
  uint8_T c1_y;
  uint8_T c1_u1;
  sf_mex_import(c1_parentId, sf_mex_dup(c1_u), &c1_u1, 1, 3, 0U, 0, 0U, 0);
  c1_y = c1_u1;
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static void c1_d_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData)
{
  const mxArray *c1_b_tp_ALM_VTBIOutBound;
  const char_T *c1_identifier;
  emlrtMsgIdentifier c1_thisId;
  uint8_T c1_y;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_b_tp_ALM_VTBIOutBound = sf_mex_dup(c1_mxArrayInData);
  c1_identifier = c1_varName;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_f_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c1_b_tp_ALM_VTBIOutBound), &c1_thisId);
  sf_mex_destroy(&c1_b_tp_ALM_VTBIOutBound);
  *(uint8_T *)c1_outData = c1_y;
  sf_mex_destroy(&c1_mxArrayInData);
}

static const mxArray *c1_e_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  real_T c1_u;
  const mxArray *c1_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(real_T *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_create("y", &c1_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static const mxArray *c1_f_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  boolean_T c1_u;
  const mxArray *c1_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(boolean_T *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_create("y", &c1_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static boolean_T c1_g_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_O_InfusionInProgress, const char_T
  *c1_identifier)
{
  boolean_T c1_y;
  emlrtMsgIdentifier c1_thisId;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_h_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_O_InfusionInProgress),
    &c1_thisId);
  sf_mex_destroy(&c1_O_InfusionInProgress);
  return c1_y;
}

static boolean_T c1_h_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId)
{
  boolean_T c1_y;
  boolean_T c1_b0;
  sf_mex_import(c1_parentId, sf_mex_dup(c1_u), &c1_b0, 1, 11, 0U, 0, 0U, 0);
  c1_y = c1_b0;
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static void c1_e_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData)
{
  const mxArray *c1_O_InfusionInProgress;
  const char_T *c1_identifier;
  emlrtMsgIdentifier c1_thisId;
  boolean_T c1_y;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_O_InfusionInProgress = sf_mex_dup(c1_mxArrayInData);
  c1_identifier = c1_varName;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_h_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_O_InfusionInProgress),
    &c1_thisId);
  sf_mex_destroy(&c1_O_InfusionInProgress);
  *(boolean_T *)c1_outData = c1_y;
  sf_mex_destroy(&c1_mxArrayInData);
}

static real_T c1_i_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_O_ProgrammedVTBI, const char_T
  *c1_identifier)
{
  real_T c1_y;
  emlrtMsgIdentifier c1_thisId;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_O_ProgrammedVTBI),
    &c1_thisId);
  sf_mex_destroy(&c1_O_ProgrammedVTBI);
  return c1_y;
}

static real_T c1_j_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId)
{
  real_T c1_y;
  real_T c1_d197;
  sf_mex_import(c1_parentId, sf_mex_dup(c1_u), &c1_d197, 1, 0, 0U, 0, 0U, 0);
  c1_y = c1_d197;
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static void c1_f_sf_marshallIn(void *chartInstanceVoid, const mxArray
  *c1_mxArrayInData, const char_T *c1_varName, void *c1_outData)
{
  const mxArray *c1_O_ProgrammedVTBI;
  const char_T *c1_identifier;
  emlrtMsgIdentifier c1_thisId;
  real_T c1_y;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_O_ProgrammedVTBI = sf_mex_dup(c1_mxArrayInData);
  c1_identifier = c1_varName;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_O_ProgrammedVTBI),
    &c1_thisId);
  sf_mex_destroy(&c1_O_ProgrammedVTBI);
  *(real_T *)c1_outData = c1_y;
  sf_mex_destroy(&c1_mxArrayInData);
}

static const mxArray *c1_drugLibInfo_bus_io(void *chartInstanceVoid, void
  *c1_pData)
{
  const mxArray *c1_mxVal = NULL;
  c1_DrugLibrary c1_tmp;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxVal = NULL;
  c1_tmp.drugID = *(uint32_T *)((char_T *)c1_pData + 0);
  c1_tmp.amount = *(real_T *)((char_T *)c1_pData + 8);
  c1_tmp.diluentVolume = *(real_T *)((char_T *)c1_pData + 16);
  c1_tmp.doseRateTypical = *(real_T *)((char_T *)c1_pData + 24);
  c1_tmp.doseRateUpperHardLimit = *(real_T *)((char_T *)c1_pData + 32);
  c1_tmp.doseRateUpperSoftLimit = *(real_T *)((char_T *)c1_pData + 40);
  c1_tmp.doseRateLowerHardLimit = *(real_T *)((char_T *)c1_pData + 48);
  c1_tmp.doseRateLowerSoftLimit = *(real_T *)((char_T *)c1_pData + 56);
  c1_tmp.doseRateUnit = *(uint32_T *)((char_T *)c1_pData + 64);
  c1_tmp.vtbiTypical = *(real_T *)((char_T *)c1_pData + 72);
  c1_tmp.vtbiUpperHardLimit = *(real_T *)((char_T *)c1_pData + 80);
  c1_tmp.vtbiUpperSoftLimit = *(real_T *)((char_T *)c1_pData + 88);
  c1_tmp.vtbiLowerHardLimit = *(real_T *)((char_T *)c1_pData + 96);
  c1_tmp.vtbiLowerSoftLimit = *(real_T *)((char_T *)c1_pData + 104);
  c1_tmp.vtbiUnit = *(uint32_T *)((char_T *)c1_pData + 112);
  c1_tmp.drugConcentrationTypical = *(real_T *)((char_T *)c1_pData + 120);
  c1_tmp.drugConcentrationUpperHardLimit = *(real_T *)((char_T *)c1_pData + 128);
  c1_tmp.drugConcentrationUpperSoftLimit = *(real_T *)((char_T *)c1_pData + 136);
  c1_tmp.drugConcentrationLowerHardLimit = *(real_T *)((char_T *)c1_pData + 144);
  c1_tmp.drugConcentrationLowerSoftLimit = *(real_T *)((char_T *)c1_pData + 152);
  sf_mex_assign(&c1_mxVal, c1_g_sf_marshallOut(chartInstance, &c1_tmp), FALSE);
  return c1_mxVal;
}

static const mxArray *c1_emlrt_marshallOut(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, c1_DrugLibrary *c1_u)
{
  const mxArray *c1_y = NULL;
  uint32_T c1_b_u;
  const mxArray *c1_b_y = NULL;
  real_T c1_c_u;
  const mxArray *c1_c_y = NULL;
  real_T c1_d_u;
  const mxArray *c1_d_y = NULL;
  real_T c1_e_u;
  const mxArray *c1_e_y = NULL;
  real_T c1_f_u;
  const mxArray *c1_f_y = NULL;
  real_T c1_g_u;
  const mxArray *c1_g_y = NULL;
  real_T c1_h_u;
  const mxArray *c1_h_y = NULL;
  real_T c1_i_u;
  const mxArray *c1_i_y = NULL;
  uint32_T c1_j_u;
  const mxArray *c1_j_y = NULL;
  real_T c1_k_u;
  const mxArray *c1_k_y = NULL;
  real_T c1_l_u;
  const mxArray *c1_l_y = NULL;
  real_T c1_m_u;
  const mxArray *c1_m_y = NULL;
  real_T c1_n_u;
  const mxArray *c1_n_y = NULL;
  real_T c1_o_u;
  const mxArray *c1_o_y = NULL;
  uint32_T c1_p_u;
  const mxArray *c1_p_y = NULL;
  real_T c1_q_u;
  const mxArray *c1_q_y = NULL;
  real_T c1_r_u;
  const mxArray *c1_r_y = NULL;
  real_T c1_s_u;
  const mxArray *c1_s_y = NULL;
  real_T c1_t_u;
  const mxArray *c1_t_y = NULL;
  real_T c1_u_u;
  const mxArray *c1_u_y = NULL;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c1_b_u = c1_u->drugID;
  c1_b_y = NULL;
  sf_mex_assign(&c1_b_y, sf_mex_create("y", &c1_b_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_b_y, "drugID", "drugID", 0);
  c1_c_u = c1_u->amount;
  c1_c_y = NULL;
  sf_mex_assign(&c1_c_y, sf_mex_create("y", &c1_c_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_c_y, "amount", "amount", 0);
  c1_d_u = c1_u->diluentVolume;
  c1_d_y = NULL;
  sf_mex_assign(&c1_d_y, sf_mex_create("y", &c1_d_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_d_y, "diluentVolume", "diluentVolume", 0);
  c1_e_u = c1_u->doseRateTypical;
  c1_e_y = NULL;
  sf_mex_assign(&c1_e_y, sf_mex_create("y", &c1_e_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_e_y, "doseRateTypical", "doseRateTypical", 0);
  c1_f_u = c1_u->doseRateUpperHardLimit;
  c1_f_y = NULL;
  sf_mex_assign(&c1_f_y, sf_mex_create("y", &c1_f_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_f_y, "doseRateUpperHardLimit",
                  "doseRateUpperHardLimit", 0);
  c1_g_u = c1_u->doseRateUpperSoftLimit;
  c1_g_y = NULL;
  sf_mex_assign(&c1_g_y, sf_mex_create("y", &c1_g_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_g_y, "doseRateUpperSoftLimit",
                  "doseRateUpperSoftLimit", 0);
  c1_h_u = c1_u->doseRateLowerHardLimit;
  c1_h_y = NULL;
  sf_mex_assign(&c1_h_y, sf_mex_create("y", &c1_h_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_h_y, "doseRateLowerHardLimit",
                  "doseRateLowerHardLimit", 0);
  c1_i_u = c1_u->doseRateLowerSoftLimit;
  c1_i_y = NULL;
  sf_mex_assign(&c1_i_y, sf_mex_create("y", &c1_i_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_i_y, "doseRateLowerSoftLimit",
                  "doseRateLowerSoftLimit", 0);
  c1_j_u = c1_u->doseRateUnit;
  c1_j_y = NULL;
  sf_mex_assign(&c1_j_y, sf_mex_create("y", &c1_j_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_j_y, "doseRateUnit", "doseRateUnit", 0);
  c1_k_u = c1_u->vtbiTypical;
  c1_k_y = NULL;
  sf_mex_assign(&c1_k_y, sf_mex_create("y", &c1_k_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_k_y, "vtbiTypical", "vtbiTypical", 0);
  c1_l_u = c1_u->vtbiUpperHardLimit;
  c1_l_y = NULL;
  sf_mex_assign(&c1_l_y, sf_mex_create("y", &c1_l_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_l_y, "vtbiUpperHardLimit", "vtbiUpperHardLimit", 0);
  c1_m_u = c1_u->vtbiUpperSoftLimit;
  c1_m_y = NULL;
  sf_mex_assign(&c1_m_y, sf_mex_create("y", &c1_m_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_m_y, "vtbiUpperSoftLimit", "vtbiUpperSoftLimit", 0);
  c1_n_u = c1_u->vtbiLowerHardLimit;
  c1_n_y = NULL;
  sf_mex_assign(&c1_n_y, sf_mex_create("y", &c1_n_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_n_y, "vtbiLowerHardLimit", "vtbiLowerHardLimit", 0);
  c1_o_u = c1_u->vtbiLowerSoftLimit;
  c1_o_y = NULL;
  sf_mex_assign(&c1_o_y, sf_mex_create("y", &c1_o_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_o_y, "vtbiLowerSoftLimit", "vtbiLowerSoftLimit", 0);
  c1_p_u = c1_u->vtbiUnit;
  c1_p_y = NULL;
  sf_mex_assign(&c1_p_y, sf_mex_create("y", &c1_p_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_p_y, "vtbiUnit", "vtbiUnit", 0);
  c1_q_u = c1_u->drugConcentrationTypical;
  c1_q_y = NULL;
  sf_mex_assign(&c1_q_y, sf_mex_create("y", &c1_q_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_q_y, "drugConcentrationTypical",
                  "drugConcentrationTypical", 0);
  c1_r_u = c1_u->drugConcentrationUpperHardLimit;
  c1_r_y = NULL;
  sf_mex_assign(&c1_r_y, sf_mex_create("y", &c1_r_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_r_y, "drugConcentrationUpperHardLimit",
                  "drugConcentrationUpperHardLimit", 0);
  c1_s_u = c1_u->drugConcentrationUpperSoftLimit;
  c1_s_y = NULL;
  sf_mex_assign(&c1_s_y, sf_mex_create("y", &c1_s_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_s_y, "drugConcentrationUpperSoftLimit",
                  "drugConcentrationUpperSoftLimit", 0);
  c1_t_u = c1_u->drugConcentrationLowerHardLimit;
  c1_t_y = NULL;
  sf_mex_assign(&c1_t_y, sf_mex_create("y", &c1_t_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_t_y, "drugConcentrationLowerHardLimit",
                  "drugConcentrationLowerHardLimit", 0);
  c1_u_u = c1_u->drugConcentrationLowerSoftLimit;
  c1_u_y = NULL;
  sf_mex_assign(&c1_u_y, sf_mex_create("y", &c1_u_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_u_y, "drugConcentrationLowerSoftLimit",
                  "drugConcentrationLowerSoftLimit", 0);
  return c1_y;
}

static const mxArray *c1_g_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  c1_DrugLibrary c1_b_inData;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_b_inData = *(c1_DrugLibrary *)c1_inData;
  sf_mex_assign(&c1_mxArrayOutData, c1_emlrt_marshallOut(chartInstance,
    &c1_b_inData), FALSE);
  return c1_mxArrayOutData;
}

static const mxArray *c1_patientInfo_bus_io(void *chartInstanceVoid, void
  *c1_pData)
{
  const mxArray *c1_mxVal = NULL;
  c1_PatientInformation c1_tmp;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxVal = NULL;
  c1_tmp.patientID = *(uint32_T *)((char_T *)c1_pData + 0);
  c1_tmp.patientAge = *(uint32_T *)((char_T *)c1_pData + 4);
  c1_tmp.patientGender = *(uint32_T *)((char_T *)c1_pData + 8);
  c1_tmp.patientWeight = *(uint32_T *)((char_T *)c1_pData + 12);
  sf_mex_assign(&c1_mxVal, c1_h_sf_marshallOut(chartInstance, &c1_tmp), FALSE);
  return c1_mxVal;
}

static const mxArray *c1_h_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  c1_PatientInformation c1_u;
  const mxArray *c1_y = NULL;
  uint32_T c1_b_u;
  const mxArray *c1_b_y = NULL;
  uint32_T c1_c_u;
  const mxArray *c1_c_y = NULL;
  uint32_T c1_d_u;
  const mxArray *c1_d_y = NULL;
  uint32_T c1_e_u;
  const mxArray *c1_e_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(c1_PatientInformation *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c1_b_u = c1_u.patientID;
  c1_b_y = NULL;
  sf_mex_assign(&c1_b_y, sf_mex_create("y", &c1_b_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_b_y, "patientID", "patientID", 0);
  c1_c_u = c1_u.patientAge;
  c1_c_y = NULL;
  sf_mex_assign(&c1_c_y, sf_mex_create("y", &c1_c_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_c_y, "patientAge", "patientAge", 0);
  c1_d_u = c1_u.patientGender;
  c1_d_y = NULL;
  sf_mex_assign(&c1_d_y, sf_mex_create("y", &c1_d_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_d_y, "patientGender", "patientGender", 0);
  c1_e_u = c1_u.patientWeight;
  c1_e_y = NULL;
  sf_mex_assign(&c1_e_y, sf_mex_create("y", &c1_e_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_e_y, "patientWeight", "patientWeight", 0);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static const mxArray *c1_drugInfo_bus_io(void *chartInstanceVoid, void *c1_pData)
{
  const mxArray *c1_mxVal = NULL;
  c1_DrugInformation c1_tmp;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxVal = NULL;
  c1_tmp.drugID = *(uint32_T *)((char_T *)c1_pData + 0);
  c1_tmp.drugDoseAmount = *(real_T *)((char_T *)c1_pData + 8);
  c1_tmp.drugDiluentVolume = *(real_T *)((char_T *)c1_pData + 16);
  c1_tmp.drugConcentration = *(real_T *)((char_T *)c1_pData + 24);
  c1_tmp.drugDoseUnit = *(uint32_T *)((char_T *)c1_pData + 32);
  c1_tmp.drugVolumeUnit = *(uint32_T *)((char_T *)c1_pData + 36);
  sf_mex_assign(&c1_mxVal, c1_i_sf_marshallOut(chartInstance, &c1_tmp), FALSE);
  return c1_mxVal;
}

static const mxArray *c1_i_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  c1_DrugInformation c1_u;
  const mxArray *c1_y = NULL;
  uint32_T c1_b_u;
  const mxArray *c1_b_y = NULL;
  real_T c1_c_u;
  const mxArray *c1_c_y = NULL;
  real_T c1_d_u;
  const mxArray *c1_d_y = NULL;
  real_T c1_e_u;
  const mxArray *c1_e_y = NULL;
  uint32_T c1_f_u;
  const mxArray *c1_f_y = NULL;
  uint32_T c1_g_u;
  const mxArray *c1_g_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(c1_DrugInformation *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c1_b_u = c1_u.drugID;
  c1_b_y = NULL;
  sf_mex_assign(&c1_b_y, sf_mex_create("y", &c1_b_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_b_y, "drugID", "drugID", 0);
  c1_c_u = c1_u.drugDoseAmount;
  c1_c_y = NULL;
  sf_mex_assign(&c1_c_y, sf_mex_create("y", &c1_c_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_c_y, "drugDoseAmount", "drugDoseAmount", 0);
  c1_d_u = c1_u.drugDiluentVolume;
  c1_d_y = NULL;
  sf_mex_assign(&c1_d_y, sf_mex_create("y", &c1_d_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_d_y, "drugDiluentVolume", "drugDiluentVolume", 0);
  c1_e_u = c1_u.drugConcentration;
  c1_e_y = NULL;
  sf_mex_assign(&c1_e_y, sf_mex_create("y", &c1_e_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_e_y, "drugConcentration", "drugConcentration", 0);
  c1_f_u = c1_u.drugDoseUnit;
  c1_f_y = NULL;
  sf_mex_assign(&c1_f_y, sf_mex_create("y", &c1_f_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_f_y, "drugDoseUnit", "drugDoseUnit", 0);
  c1_g_u = c1_u.drugVolumeUnit;
  c1_g_y = NULL;
  sf_mex_assign(&c1_g_y, sf_mex_create("y", &c1_g_u, 7, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_g_y, "drugVolumeUnit", "drugVolumeUnit", 0);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static const mxArray *c1_infuParameters_bus_io(void *chartInstanceVoid, void
  *c1_pData)
{
  const mxArray *c1_mxVal = NULL;
  c1_InfusionParameters c1_tmp;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxVal = NULL;
  c1_tmp.programmedVTBI = *(real_T *)((char_T *)c1_pData + 0);
  c1_tmp.programmedDoseRate = *(real_T *)((char_T *)c1_pData + 8);
  sf_mex_assign(&c1_mxVal, c1_j_sf_marshallOut(chartInstance, &c1_tmp), FALSE);
  return c1_mxVal;
}

static const mxArray *c1_j_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  c1_InfusionParameters c1_u;
  const mxArray *c1_y = NULL;
  real_T c1_b_u;
  const mxArray *c1_b_y = NULL;
  real_T c1_c_u;
  const mxArray *c1_c_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(c1_InfusionParameters *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c1_b_u = c1_u.programmedVTBI;
  c1_b_y = NULL;
  sf_mex_assign(&c1_b_y, sf_mex_create("y", &c1_b_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_b_y, "programmedVTBI", "programmedVTBI", 0);
  c1_c_u = c1_u.programmedDoseRate;
  c1_c_y = NULL;
  sf_mex_assign(&c1_c_y, sf_mex_create("y", &c1_c_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_c_y, "programmedDoseRate", "programmedDoseRate", 0);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static const mxArray *c1_infuStatus_bus_io(void *chartInstanceVoid, void
  *c1_pData)
{
  const mxArray *c1_mxVal = NULL;
  c1_InfusionStatus c1_tmp;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxVal = NULL;
  c1_tmp.isBolusInProgress = *(boolean_T *)((char_T *)c1_pData + 0);
  c1_tmp.totalVolumeInfused = *(real_T *)((char_T *)c1_pData + 8);
  c1_tmp.remainingVolumeInReservoir = *(real_T *)((char_T *)c1_pData + 16);
  sf_mex_assign(&c1_mxVal, c1_k_sf_marshallOut(chartInstance, &c1_tmp), FALSE);
  return c1_mxVal;
}

static const mxArray *c1_k_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  c1_InfusionStatus c1_u;
  const mxArray *c1_y = NULL;
  boolean_T c1_b_u;
  const mxArray *c1_b_y = NULL;
  real_T c1_c_u;
  const mxArray *c1_c_y = NULL;
  real_T c1_d_u;
  const mxArray *c1_d_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(c1_InfusionStatus *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c1_b_u = c1_u.isBolusInProgress;
  c1_b_y = NULL;
  sf_mex_assign(&c1_b_y, sf_mex_create("y", &c1_b_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_b_y, "isBolusInProgress", "isBolusInProgress", 0);
  c1_c_u = c1_u.totalVolumeInfused;
  c1_c_y = NULL;
  sf_mex_assign(&c1_c_y, sf_mex_create("y", &c1_c_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_c_y, "totalVolumeInfused", "totalVolumeInfused", 0);
  c1_d_u = c1_u.remainingVolumeInReservoir;
  c1_d_y = NULL;
  sf_mex_assign(&c1_d_y, sf_mex_create("y", &c1_d_u, 0, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_d_y, "remainingVolumeInReservoir",
                  "remainingVolumeInReservoir", 0);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static const mxArray *c1_pumpConfigData_bus_io(void *chartInstanceVoid, void
  *c1_pData)
{
  const mxArray *c1_mxVal = NULL;
  c1_PumpConfigurationsStatus c1_tmp;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxVal = NULL;
  c1_tmp.isPOSTSuccessful = *(boolean_T *)((char_T *)c1_pData + 0);
  c1_tmp.isPumpPrimed = *(boolean_T *)((char_T *)c1_pData + 1);
  c1_tmp.isAdminSetCheckPassed = *(boolean_T *)((char_T *)c1_pData + 2);
  sf_mex_assign(&c1_mxVal, c1_l_sf_marshallOut(chartInstance, &c1_tmp), FALSE);
  return c1_mxVal;
}

static const mxArray *c1_l_sf_marshallOut(void *chartInstanceVoid, void
  *c1_inData)
{
  const mxArray *c1_mxArrayOutData = NULL;
  c1_PumpConfigurationsStatus c1_u;
  const mxArray *c1_y = NULL;
  boolean_T c1_b_u;
  const mxArray *c1_b_y = NULL;
  boolean_T c1_c_u;
  const mxArray *c1_c_y = NULL;
  boolean_T c1_d_u;
  const mxArray *c1_d_y = NULL;
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)chartInstanceVoid;
  c1_mxArrayOutData = NULL;
  c1_u = *(c1_PumpConfigurationsStatus *)c1_inData;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_createstruct("structure", 2, 1, 1), FALSE);
  c1_b_u = c1_u.isPOSTSuccessful;
  c1_b_y = NULL;
  sf_mex_assign(&c1_b_y, sf_mex_create("y", &c1_b_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_b_y, "isPOSTSuccessful", "isPOSTSuccessful", 0);
  c1_c_u = c1_u.isPumpPrimed;
  c1_c_y = NULL;
  sf_mex_assign(&c1_c_y, sf_mex_create("y", &c1_c_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_c_y, "isPumpPrimed", "isPumpPrimed", 0);
  c1_d_u = c1_u.isAdminSetCheckPassed;
  c1_d_y = NULL;
  sf_mex_assign(&c1_d_y, sf_mex_create("y", &c1_d_u, 11, 0U, 0U, 0U, 0), FALSE);
  sf_mex_addfield(c1_y, c1_d_y, "isAdminSetCheckPassed", "isAdminSetCheckPassed",
                  0);
  sf_mex_assign(&c1_mxArrayOutData, c1_y, FALSE);
  return c1_mxArrayOutData;
}

static void c1_k_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_O_DrugLibInfo, const char_T *c1_identifier,
  c1_DrugLibrary *c1_y)
{
  emlrtMsgIdentifier c1_thisId;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_l_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_O_DrugLibInfo), &c1_thisId,
                        c1_y);
  sf_mex_destroy(&c1_O_DrugLibInfo);
}

static void c1_l_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId,
  c1_DrugLibrary *c1_y)
{
  emlrtMsgIdentifier c1_thisId;
  static const char * c1_fieldNames[20] = { "drugID", "amount", "diluentVolume",
    "doseRateTypical", "doseRateUpperHardLimit", "doseRateUpperSoftLimit",
    "doseRateLowerHardLimit", "doseRateLowerSoftLimit", "doseRateUnit",
    "vtbiTypical", "vtbiUpperHardLimit", "vtbiUpperSoftLimit",
    "vtbiLowerHardLimit", "vtbiLowerSoftLimit", "vtbiUnit",
    "drugConcentrationTypical", "drugConcentrationUpperHardLimit",
    "drugConcentrationUpperSoftLimit", "drugConcentrationLowerHardLimit",
    "drugConcentrationLowerSoftLimit" };

  c1_thisId.fParent = c1_parentId;
  sf_mex_check_struct(c1_parentId, c1_u, 20, c1_fieldNames, 0U, 0);
  c1_thisId.fIdentifier = "drugID";
  c1_y->drugID = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getfield
                                        (c1_u, "drugID", "drugID", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "amount";
  c1_y->amount = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup(sf_mex_getfield
                                        (c1_u, "amount", "amount", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "diluentVolume";
  c1_y->diluentVolume = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "diluentVolume", "diluentVolume", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "doseRateTypical";
  c1_y->doseRateTypical = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "doseRateTypical", "doseRateTypical", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "doseRateUpperHardLimit";
  c1_y->doseRateUpperHardLimit = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "doseRateUpperHardLimit", "doseRateUpperHardLimit", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "doseRateUpperSoftLimit";
  c1_y->doseRateUpperSoftLimit = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "doseRateUpperSoftLimit", "doseRateUpperSoftLimit", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "doseRateLowerHardLimit";
  c1_y->doseRateLowerHardLimit = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "doseRateLowerHardLimit", "doseRateLowerHardLimit", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "doseRateLowerSoftLimit";
  c1_y->doseRateLowerSoftLimit = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "doseRateLowerSoftLimit", "doseRateLowerSoftLimit", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "doseRateUnit";
  c1_y->doseRateUnit = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "doseRateUnit", "doseRateUnit", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "vtbiTypical";
  c1_y->vtbiTypical = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "vtbiTypical", "vtbiTypical", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "vtbiUpperHardLimit";
  c1_y->vtbiUpperHardLimit = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "vtbiUpperHardLimit", "vtbiUpperHardLimit", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "vtbiUpperSoftLimit";
  c1_y->vtbiUpperSoftLimit = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "vtbiUpperSoftLimit", "vtbiUpperSoftLimit", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "vtbiLowerHardLimit";
  c1_y->vtbiLowerHardLimit = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "vtbiLowerHardLimit", "vtbiLowerHardLimit", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "vtbiLowerSoftLimit";
  c1_y->vtbiLowerSoftLimit = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "vtbiLowerSoftLimit", "vtbiLowerSoftLimit", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "vtbiUnit";
  c1_y->vtbiUnit = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "vtbiUnit", "vtbiUnit", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "drugConcentrationTypical";
  c1_y->drugConcentrationTypical = c1_j_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getfield(c1_u, "drugConcentrationTypical",
    "drugConcentrationTypical", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "drugConcentrationUpperHardLimit";
  c1_y->drugConcentrationUpperHardLimit = c1_j_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getfield(c1_u, "drugConcentrationUpperHardLimit",
    "drugConcentrationUpperHardLimit", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "drugConcentrationUpperSoftLimit";
  c1_y->drugConcentrationUpperSoftLimit = c1_j_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getfield(c1_u, "drugConcentrationUpperSoftLimit",
    "drugConcentrationUpperSoftLimit", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "drugConcentrationLowerHardLimit";
  c1_y->drugConcentrationLowerHardLimit = c1_j_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getfield(c1_u, "drugConcentrationLowerHardLimit",
    "drugConcentrationLowerHardLimit", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "drugConcentrationLowerSoftLimit";
  c1_y->drugConcentrationLowerSoftLimit = c1_j_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getfield(c1_u, "drugConcentrationLowerSoftLimit",
    "drugConcentrationLowerSoftLimit", 0)), &c1_thisId);
  sf_mex_destroy(&c1_u);
}

static c1_InfusionStatus c1_m_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_O_InfuStatus, const char_T *c1_identifier)
{
  c1_InfusionStatus c1_y;
  emlrtMsgIdentifier c1_thisId;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_n_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_O_InfuStatus),
    &c1_thisId);
  sf_mex_destroy(&c1_O_InfuStatus);
  return c1_y;
}

static c1_InfusionStatus c1_n_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId)
{
  c1_InfusionStatus c1_y;
  emlrtMsgIdentifier c1_thisId;
  static const char * c1_fieldNames[3] = { "isBolusInProgress",
    "totalVolumeInfused", "remainingVolumeInReservoir" };

  c1_thisId.fParent = c1_parentId;
  sf_mex_check_struct(c1_parentId, c1_u, 3, c1_fieldNames, 0U, 0);
  c1_thisId.fIdentifier = "isBolusInProgress";
  c1_y.isBolusInProgress = c1_h_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "isBolusInProgress", "isBolusInProgress", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "totalVolumeInfused";
  c1_y.totalVolumeInfused = c1_j_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "totalVolumeInfused", "totalVolumeInfused", 0)),
    &c1_thisId);
  c1_thisId.fIdentifier = "remainingVolumeInReservoir";
  c1_y.remainingVolumeInReservoir = c1_j_emlrt_marshallIn(chartInstance,
    sf_mex_dup(sf_mex_getfield(c1_u, "remainingVolumeInReservoir",
    "remainingVolumeInReservoir", 0)), &c1_thisId);
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static c1_PatientInformation c1_o_emlrt_marshallIn
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance, const mxArray
   *c1_O_PatientInfo, const char_T *c1_identifier)
{
  c1_PatientInformation c1_y;
  emlrtMsgIdentifier c1_thisId;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  c1_y = c1_p_emlrt_marshallIn(chartInstance, sf_mex_dup(c1_O_PatientInfo),
    &c1_thisId);
  sf_mex_destroy(&c1_O_PatientInfo);
  return c1_y;
}

static c1_PatientInformation c1_p_emlrt_marshallIn
  (SFc1_GPCA_ExtensionInstanceStruct *chartInstance, const mxArray *c1_u, const
   emlrtMsgIdentifier *c1_parentId)
{
  c1_PatientInformation c1_y;
  emlrtMsgIdentifier c1_thisId;
  static const char * c1_fieldNames[4] = { "patientID", "patientAge",
    "patientGender", "patientWeight" };

  c1_thisId.fParent = c1_parentId;
  sf_mex_check_struct(c1_parentId, c1_u, 4, c1_fieldNames, 0U, 0);
  c1_thisId.fIdentifier = "patientID";
  c1_y.patientID = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "patientID", "patientID", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "patientAge";
  c1_y.patientAge = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "patientAge", "patientAge", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "patientGender";
  c1_y.patientGender = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "patientGender", "patientGender", 0)), &c1_thisId);
  c1_thisId.fIdentifier = "patientWeight";
  c1_y.patientWeight = c1_c_emlrt_marshallIn(chartInstance, sf_mex_dup
    (sf_mex_getfield(c1_u, "patientWeight", "patientWeight", 0)), &c1_thisId);
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static const mxArray *c1_q_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_b_setSimStateSideEffectsInfo, const char_T
  *c1_identifier)
{
  const mxArray *c1_y = NULL;
  emlrtMsgIdentifier c1_thisId;
  c1_y = NULL;
  c1_thisId.fIdentifier = c1_identifier;
  c1_thisId.fParent = NULL;
  sf_mex_assign(&c1_y, c1_r_emlrt_marshallIn(chartInstance, sf_mex_dup
    (c1_b_setSimStateSideEffectsInfo), &c1_thisId), FALSE);
  sf_mex_destroy(&c1_b_setSimStateSideEffectsInfo);
  return c1_y;
}

static const mxArray *c1_r_emlrt_marshallIn(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance, const mxArray *c1_u, const emlrtMsgIdentifier *c1_parentId)
{
  const mxArray *c1_y = NULL;
  c1_y = NULL;
  sf_mex_assign(&c1_y, sf_mex_duplicatearraysafe(&c1_u), FALSE);
  sf_mex_destroy(&c1_u);
  return c1_y;
}

static uint8_T c1__u8_s32_(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  int32_T c1_b)
{
  uint8_T c1_a;
  c1_a = (uint8_T)c1_b;
  if (c1_a != c1_b) {
    sf_debug_overflow_detection(SFDB_OVERFLOW);
  }

  return c1_a;
}

static uint32_T c1__u32_d_(SFc1_GPCA_ExtensionInstanceStruct *chartInstance,
  real_T c1_b)
{
  uint32_T c1_a;
  c1_a = (uint32_T)c1_b;
  if ((real_T)c1_a != (c1_b < 0.0 ? muDoubleScalarCeil((real_T)c1_b) :
                       muDoubleScalarFloor((real_T)c1_b))) {
    sf_debug_overflow_detection(SFDB_OVERFLOW);
  }

  return c1_a;
}

static void init_dsm_address_info(SFc1_GPCA_ExtensionInstanceStruct
  *chartInstance)
{
}

/* SFunction Glue Code */
void sf_c1_GPCA_Extension_get_check_sum(mxArray *plhs[])
{
  ((real_T *)mxGetPr((plhs[0])))[0] = (real_T)(1116641520U);
  ((real_T *)mxGetPr((plhs[0])))[1] = (real_T)(1337898256U);
  ((real_T *)mxGetPr((plhs[0])))[2] = (real_T)(3149624645U);
  ((real_T *)mxGetPr((plhs[0])))[3] = (real_T)(1111398265U);
}

mxArray *sf_c1_GPCA_Extension_get_autoinheritance_info(void)
{
  const char *autoinheritanceFields[] = { "checksum", "inputs", "parameters",
    "outputs", "locals" };

  mxArray *mxAutoinheritanceInfo = mxCreateStructMatrix(1,1,5,
    autoinheritanceFields);

  {
    mxArray *mxChecksum = mxCreateString("Y2CdfjvrMoqv70bwYOIkgD");
    mxSetField(mxAutoinheritanceInfo,0,"checksum",mxChecksum);
  }

  {
    const char *dataFields[] = { "size", "type", "complexity" };

    mxArray *mxData = mxCreateStructMatrix(1,7,3,dataFields);

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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,6,"type",mxType);
    }

    mxSetField(mxData,6,"complexity",mxCreateDoubleScalar(0));
    mxSetField(mxAutoinheritanceInfo,0,"inputs",mxData);
  }

  {
    mxSetField(mxAutoinheritanceInfo,0,"parameters",mxCreateDoubleMatrix(0,0,
                mxREAL));
  }

  {
    const char *dataFields[] = { "size", "type", "complexity" };

    mxArray *mxData = mxCreateStructMatrix(1,11,3,dataFields);

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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(1));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(7));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(13));
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
      mxSetField(mxType,0,"base",mxCreateDoubleScalar(7));
      mxSetField(mxType,0,"fixpt",mxCreateDoubleMatrix(0,0,mxREAL));
      mxSetField(mxData,10,"type",mxType);
    }

    mxSetField(mxData,10,"complexity",mxCreateDoubleScalar(0));
    mxSetField(mxAutoinheritanceInfo,0,"outputs",mxData);
  }

  {
    mxSetField(mxAutoinheritanceInfo,0,"locals",mxCreateDoubleMatrix(0,0,mxREAL));
  }

  return(mxAutoinheritanceInfo);
}

static const mxArray *sf_get_sim_state_info_c1_GPCA_Extension(void)
{
  const char *infoFields[] = { "chartChecksum", "varInfo" };

  mxArray *mxInfo = mxCreateStructMatrix(1, 1, 2, infoFields);
  const char *infoEncStr[] = {
    "100 S1x10'type','srcId','name','auxInfo'{{M[1],M[515],T\"ClearCond\",},{M[1],M[597],T\"O_AlarmCond\",},{M[1],M[518],T\"O_BolusRequested\",},{M[1],M[586],T\"O_CurrentState\",},{M[1],M[594],T\"O_DrugLibInfo\",},{M[1],M[596],T\"O_InfuStatus\",},{M[1],M[516],T\"O_InfusionInProgress\",},{M[1],M[517],T\"O_InfusionPaused\",},{M[1],M[595],T\"O_PatientInfo\",},{M[1],M[520],T\"O_ProgrammedFlowRate\",}}",
    "100 S1x10'type','srcId','name','auxInfo'{{M[1],M[519],T\"O_ProgrammedVTBI\",},{M[3],M[599],T\"bolusing\",},{M[3],M[601],T\"doseRate\",},{M[3],M[598],T\"infusing\",},{M[3],M[602],T\"initDrugReservoirVolume\",},{M[3],M[581],T\"temp\",},{M[3],M[587],T\"tempx\",},{M[3],M[600],T\"vtbi\",},{M[6],M[661],T\"E_AlarmClear\",},{M[6],M[662],T\"E_RequestToStart\",}}",
    "100 S1x10'type','srcId','name','auxInfo'{{M[6],M[660],T\"E_Restart\",},{M[7],M[661],T\"E_AlarmClearEventCounter\",},{M[7],M[662],T\"E_RequestToStartEventCounter\",},{M[7],M[660],T\"E_RestartEventCounter\",},{M[8],M[0],T\"is_active_c1_GPCA_Extension\",},{M[9],M[0],T\"is_c1_GPCA_Extension\",},{M[9],M[33],T\"is_InfusionInSession\",},{M[9],M[56],T\"is_InfusionSubMachine\",},{M[9],M[69],T\"is_CheckDrugRoutine\",},{M[9],M[70],T\"is_ConfigureInfusionProgram\",}}",
    "100 S1x5'type','srcId','name','auxInfo'{{M[9],M[71],T\"is_InfusionStateMachine\",},{M[10],M[33],T\"was_InfusionInSession\",},{M[10],M[69],T\"was_CheckDrugRoutine\",},{M[10],M[70],T\"was_ConfigureInfusionProgram\",},{M[11],M[659],T\"temporalCounter_i1\",S'et','os','ct'{{T\"ev\",M1x6[31 34 35 36 38 39],M[0]}}}}"
  };

  mxArray *mxVarInfo = sf_mex_decode_encoded_mx_struct_array(infoEncStr, 35, 10);
  mxArray *mxChecksum = mxCreateDoubleMatrix(1, 4, mxREAL);
  sf_c1_GPCA_Extension_get_check_sum(&mxChecksum);
  mxSetField(mxInfo, 0, infoFields[0], mxChecksum);
  mxSetField(mxInfo, 0, infoFields[1], mxVarInfo);
  return mxInfo;
}

static void chart_debug_initialization(SimStruct *S, unsigned int
  fullDebuggerInitialization)
{
  if (!sim_mode_is_rtw_gen(S)) {
    SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
    chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *) ((ChartInfoStruct *)
      (ssGetUserData(S)))->chartInstance;
    if (ssIsFirstInitCond(S) && fullDebuggerInitialization==1) {
      /* do this only if simulation is starting */
      {
        unsigned int chartAlreadyPresent;
        chartAlreadyPresent = sf_debug_initialize_chart
          (_GPCA_ExtensionMachineNumber_,
           1,
           85,
           272,
           145,
           29,
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
            29,
            29,
            29);
          _SFD_SET_DATA_PROPS(0,1,1,0,"ErrCond");
          _SFD_SET_DATA_PROPS(1,2,0,1,"ClearCond");
          _SFD_SET_DATA_PROPS(2,2,0,1,"O_InfusionInProgress");
          _SFD_SET_DATA_PROPS(3,2,0,1,"O_InfusionPaused");
          _SFD_SET_DATA_PROPS(4,2,0,1,"O_BolusRequested");
          _SFD_SET_DATA_PROPS(5,2,0,1,"O_ProgrammedVTBI");
          _SFD_SET_DATA_PROPS(6,2,0,1,"O_ProgrammedFlowRate");
          _SFD_SET_DATA_PROPS(7,7,0,0,"MSG_WELCOME");
          _SFD_SET_DATA_PROPS(8,7,0,0,"MSG_POWEROFF");
          _SFD_SET_DATA_PROPS(9,7,0,0,"MSG_POST");
          _SFD_SET_DATA_PROPS(10,7,0,0,"MSG_POSTFAIL");
          _SFD_SET_DATA_PROPS(11,7,0,0,"MSG_ADMINCHECK");
          _SFD_SET_DATA_PROPS(12,7,0,0,"MSG_ADMINFAIL");
          _SFD_SET_DATA_PROPS(13,7,0,0,"MSG_PRIME");
          _SFD_SET_DATA_PROPS(14,7,0,0,"MSG_PRIMEFAIL");
          _SFD_SET_DATA_PROPS(15,7,0,0,"MSG_CHECKTYPE");
          _SFD_SET_DATA_PROPS(16,7,0,0,"MSG_WRONGDRUG");
          _SFD_SET_DATA_PROPS(17,7,0,0,"MSG_CHECKDU");
          _SFD_SET_DATA_PROPS(18,7,0,0,"MSG_WRONGDU");
          _SFD_SET_DATA_PROPS(19,7,0,0,"MSG_CHECKCON");
          _SFD_SET_DATA_PROPS(20,7,0,0,"MSG_WRONGCON");
          _SFD_SET_DATA_PROPS(21,7,0,0,"MSG_DANGECON");
          _SFD_SET_DATA_PROPS(22,7,0,0,"MSG_PATIENTINFO");
          _SFD_SET_DATA_PROPS(23,7,0,0,"MSG_CHANGEVTBI");
          _SFD_SET_DATA_PROPS(24,7,0,0,"MSG_VTBI");
          _SFD_SET_DATA_PROPS(25,7,0,0,"MSG_CHECKVTBI");
          _SFD_SET_DATA_PROPS(26,7,0,0,"MSG_ALMVTBI");
          _SFD_SET_DATA_PROPS(27,7,0,0,"MSG_DISPLAYDR");
          _SFD_SET_DATA_PROPS(28,7,0,0,"MSG_CHECKDR");
          _SFD_SET_DATA_PROPS(29,7,0,0,"MSG_CHANGEDR");
          _SFD_SET_DATA_PROPS(30,7,0,0,"MSG_DISPLAYSET");
          _SFD_SET_DATA_PROPS(31,7,0,0,"MSG_ALRMDR");
          _SFD_SET_DATA_PROPS(32,7,0,0,"MSG_INFUSING");
          _SFD_SET_DATA_PROPS(33,7,0,0,"MSG_DANGERENVTEMP");
          _SFD_SET_DATA_PROPS(34,7,0,0,"MSG_DANGERHUMD");
          _SFD_SET_DATA_PROPS(35,7,0,0,"MSG_DANGERAP");
          _SFD_SET_DATA_PROPS(36,7,0,0,"MSG_POSTDONE");
          _SFD_SET_DATA_PROPS(37,7,0,0,"MSG_DRUGINFO");
          _SFD_SET_DATA_PROPS(38,7,0,0,"MSG_BOLUSGRANT");
          _SFD_SET_DATA_PROPS(39,7,0,0,"MSG_BOLUSDENIED");
          _SFD_SET_DATA_PROPS(40,7,0,0,"MSG_STOPBOLUS");
          _SFD_SET_DATA_PROPS(41,7,0,0,"MSG_EMPTYRESERVOIR");
          _SFD_SET_DATA_PROPS(42,7,0,0,"MSG_DOOROPEN");
          _SFD_SET_DATA_PROPS(43,7,0,0,"MSG_AIRINLINE");
          _SFD_SET_DATA_PROPS(44,7,0,0,"MSG_OCCULUSION");
          _SFD_SET_DATA_PROPS(45,7,0,0,"MSG_PAUSETOOLONG");
          _SFD_SET_DATA_PROPS(46,7,0,0,"MSG_FLOWRATEVARY");
          _SFD_SET_DATA_PROPS(47,7,0,0,"MSG_OVERINFUSION");
          _SFD_SET_DATA_PROPS(48,7,0,0,"MSG_UNDERINFUSION");
          _SFD_SET_DATA_PROPS(49,7,0,0,"MSG_LESSTHANKVO");
          _SFD_SET_DATA_PROPS(50,7,0,0,"MSG_RATEEXCEEDCAPACITY");
          _SFD_SET_DATA_PROPS(51,7,0,0,"MSG_REALTIMECLOCK");
          _SFD_SET_DATA_PROPS(52,7,0,0,"MSG_WATCHDOGALERT");
          _SFD_SET_DATA_PROPS(53,7,0,0,"MSG_OUTOFPOWER");
          _SFD_SET_DATA_PROPS(54,7,0,0,"MSG_MEMORYCORRUPT");
          _SFD_SET_DATA_PROPS(55,7,0,0,"MSG_CPUFAILURE");
          _SFD_SET_DATA_PROPS(56,7,0,0,"MSG_INFUSIONSTOP");
          _SFD_SET_DATA_PROPS(57,7,0,0,"MSG_SPCHOOSE");
          _SFD_SET_DATA_PROPS(58,7,0,0,"MSG_INFUSIONPAUSED");
          _SFD_SET_DATA_PROPS(59,7,0,0,"MSG_CONFIRMPAUSE");
          _SFD_SET_DATA_PROPS(60,7,0,0,"MSG_CONFIRMSTOP");
          _SFD_SET_DATA_PROPS(61,7,0,0,"MSG_STOPPAUSE");
          _SFD_SET_DATA_PROPS(62,7,0,0,"MSG_LOGERR");
          _SFD_SET_DATA_PROPS(63,7,0,0,"MSG_LOWBATT");
          _SFD_SET_DATA_PROPS(64,7,0,0,"MSG_LOWRESR");
          _SFD_SET_DATA_PROPS(65,7,0,0,"MSG_WRNDR");
          _SFD_SET_DATA_PROPS(66,7,0,0,"MSG_WRNVTBI");
          _SFD_SET_DATA_PROPS(67,0,0,0,"temp");
          _SFD_SET_DATA_PROPS(68,7,0,0,"MSG_NOTREADY");
          _SFD_SET_DATA_PROPS(69,7,0,0,"MSG_BLANK");
          _SFD_SET_DATA_PROPS(70,7,0,0,"MSG_WRNBATTERYCHARGE");
          _SFD_SET_DATA_PROPS(71,7,0,0,"MSG_VOLTOUTRANGE");
          _SFD_SET_DATA_PROPS(72,2,0,1,"O_CurrentState");
          _SFD_SET_DATA_PROPS(73,0,0,0,"tempx");
          _SFD_SET_DATA_PROPS(74,1,1,0,"drugLibInfo");
          _SFD_SET_DATA_PROPS(75,1,1,0,"patientInfo");
          _SFD_SET_DATA_PROPS(76,1,1,0,"drugInfo");
          _SFD_SET_DATA_PROPS(77,1,1,0,"infuParameters");
          _SFD_SET_DATA_PROPS(78,1,1,0,"infuStatus");
          _SFD_SET_DATA_PROPS(79,1,1,0,"pumpConfigData");
          _SFD_SET_DATA_PROPS(80,2,0,1,"O_DrugLibInfo");
          _SFD_SET_DATA_PROPS(81,2,0,1,"O_PatientInfo");
          _SFD_SET_DATA_PROPS(82,2,0,1,"O_InfuStatus");
          _SFD_SET_DATA_PROPS(83,2,0,1,"O_AlarmCond");
          _SFD_SET_DATA_PROPS(84,0,0,0,"infusing");
          _SFD_SET_DATA_PROPS(85,0,0,0,"bolusing");
          _SFD_SET_DATA_PROPS(86,0,0,0,"vtbi");
          _SFD_SET_DATA_PROPS(87,0,0,0,"doseRate");
          _SFD_SET_DATA_PROPS(88,0,0,0,"initDrugReservoirVolume");
          _SFD_SET_DATA_PROPS(89,7,0,0,"MSG_PUMPTOOHOT");
          _SFD_SET_DATA_PROPS(90,7,0,0,"MSG_PAUSELONG");
          _SFD_SET_DATA_PROPS(91,7,0,0,"MSG_PUMPOVERHEAT");
          _SFD_SET_DATA_PROPS(92,7,0,0,"MSG_DISPINFU");
          _SFD_SET_DATA_PROPS(93,8,0,0,"");
          _SFD_SET_DATA_PROPS(94,9,0,0,"");
          _SFD_SET_DATA_PROPS(95,9,0,0,"");
          _SFD_SET_DATA_PROPS(96,9,0,0,"");
          _SFD_SET_DATA_PROPS(97,9,0,0,"");
          _SFD_SET_DATA_PROPS(98,9,0,0,"");
          _SFD_SET_DATA_PROPS(99,9,0,0,"");
          _SFD_SET_DATA_PROPS(100,9,0,0,"");
          _SFD_SET_DATA_PROPS(101,8,0,0,"");
          _SFD_SET_DATA_PROPS(102,9,0,0,"");
          _SFD_SET_DATA_PROPS(103,8,0,0,"");
          _SFD_SET_DATA_PROPS(104,9,0,0,"");
          _SFD_SET_DATA_PROPS(105,9,0,0,"");
          _SFD_SET_DATA_PROPS(106,6,0,0,"");
          _SFD_SET_DATA_PROPS(107,6,0,0,"");
          _SFD_SET_DATA_PROPS(108,6,0,0,"");
          _SFD_SET_DATA_PROPS(109,6,0,0,"");
          _SFD_SET_DATA_PROPS(110,6,0,0,"");
          _SFD_SET_DATA_PROPS(111,9,0,0,"");
          _SFD_SET_DATA_PROPS(112,9,0,0,"");
          _SFD_SET_DATA_PROPS(113,6,0,0,"");
          _SFD_SET_DATA_PROPS(114,9,0,0,"");
          _SFD_SET_DATA_PROPS(115,9,0,0,"");
          _SFD_SET_DATA_PROPS(116,8,0,0,"");
          _SFD_SET_DATA_PROPS(117,9,0,0,"");
          _SFD_SET_DATA_PROPS(118,9,0,0,"");
          _SFD_SET_DATA_PROPS(119,8,0,0,"");
          _SFD_SET_DATA_PROPS(120,9,0,0,"");
          _SFD_SET_DATA_PROPS(121,9,0,0,"");
          _SFD_SET_DATA_PROPS(122,9,0,0,"");
          _SFD_SET_DATA_PROPS(123,8,0,0,"");
          _SFD_SET_DATA_PROPS(124,9,0,0,"");
          _SFD_SET_DATA_PROPS(125,8,0,0,"");
          _SFD_SET_DATA_PROPS(126,9,0,0,"");
          _SFD_SET_DATA_PROPS(127,9,0,0,"");
          _SFD_SET_DATA_PROPS(128,8,0,0,"");
          _SFD_SET_DATA_PROPS(129,9,0,0,"");
          _SFD_SET_DATA_PROPS(130,9,0,0,"");
          _SFD_SET_DATA_PROPS(131,9,0,0,"");
          _SFD_SET_DATA_PROPS(132,8,0,0,"");
          _SFD_SET_DATA_PROPS(133,9,0,0,"");
          _SFD_SET_DATA_PROPS(134,8,0,0,"");
          _SFD_SET_DATA_PROPS(135,9,0,0,"");
          _SFD_SET_DATA_PROPS(136,9,0,0,"");
          _SFD_SET_DATA_PROPS(137,9,0,0,"");
          _SFD_SET_DATA_PROPS(138,9,0,0,"");
          _SFD_SET_DATA_PROPS(139,9,0,0,"");
          _SFD_SET_DATA_PROPS(140,9,0,0,"");
          _SFD_SET_DATA_PROPS(141,9,0,0,"");
          _SFD_SET_DATA_PROPS(142,8,0,0,"");
          _SFD_SET_DATA_PROPS(143,8,0,0,"");
          _SFD_SET_DATA_PROPS(144,8,0,0,"");
          _SFD_EVENT_SCOPE(0,1);
          _SFD_EVENT_SCOPE(1,2);
          _SFD_EVENT_SCOPE(2,2);
          _SFD_EVENT_SCOPE(3,2);
          _SFD_EVENT_SCOPE(4,1);
          _SFD_EVENT_SCOPE(5,1);
          _SFD_EVENT_SCOPE(6,1);
          _SFD_EVENT_SCOPE(7,1);
          _SFD_EVENT_SCOPE(8,1);
          _SFD_EVENT_SCOPE(9,1);
          _SFD_EVENT_SCOPE(10,1);
          _SFD_EVENT_SCOPE(11,1);
          _SFD_EVENT_SCOPE(12,1);
          _SFD_EVENT_SCOPE(13,1);
          _SFD_EVENT_SCOPE(14,1);
          _SFD_EVENT_SCOPE(15,1);
          _SFD_EVENT_SCOPE(16,1);
          _SFD_EVENT_SCOPE(17,1);
          _SFD_EVENT_SCOPE(18,1);
          _SFD_EVENT_SCOPE(19,1);
          _SFD_EVENT_SCOPE(20,1);
          _SFD_EVENT_SCOPE(21,1);
          _SFD_EVENT_SCOPE(22,1);
          _SFD_EVENT_SCOPE(23,1);
          _SFD_EVENT_SCOPE(24,1);
          _SFD_EVENT_SCOPE(25,1);
          _SFD_EVENT_SCOPE(26,1);
          _SFD_EVENT_SCOPE(27,1);
          _SFD_EVENT_SCOPE(28,1);
          _SFD_STATE_INFO(0,0,0);
          _SFD_STATE_INFO(1,0,0);
          _SFD_STATE_INFO(2,0,0);
          _SFD_STATE_INFO(3,0,0);
          _SFD_STATE_INFO(4,0,0);
          _SFD_STATE_INFO(5,0,0);
          _SFD_STATE_INFO(6,0,0);
          _SFD_STATE_INFO(7,0,0);
          _SFD_STATE_INFO(8,0,0);
          _SFD_STATE_INFO(9,0,0);
          _SFD_STATE_INFO(10,0,0);
          _SFD_STATE_INFO(11,0,0);
          _SFD_STATE_INFO(12,0,0);
          _SFD_STATE_INFO(13,0,0);
          _SFD_STATE_INFO(14,0,0);
          _SFD_STATE_INFO(15,0,0);
          _SFD_STATE_INFO(16,0,0);
          _SFD_STATE_INFO(17,0,0);
          _SFD_STATE_INFO(18,0,0);
          _SFD_STATE_INFO(19,0,0);
          _SFD_STATE_INFO(20,0,0);
          _SFD_STATE_INFO(21,0,0);
          _SFD_STATE_INFO(22,0,0);
          _SFD_STATE_INFO(23,0,0);
          _SFD_STATE_INFO(24,0,0);
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
          _SFD_STATE_INFO(45,0,0);
          _SFD_STATE_INFO(46,0,0);
          _SFD_STATE_INFO(47,0,0);
          _SFD_STATE_INFO(48,0,0);
          _SFD_STATE_INFO(49,0,0);
          _SFD_STATE_INFO(50,0,0);
          _SFD_STATE_INFO(51,0,0);
          _SFD_STATE_INFO(52,0,2);
          _SFD_STATE_INFO(53,0,2);
          _SFD_STATE_INFO(54,0,2);
          _SFD_STATE_INFO(55,0,2);
          _SFD_STATE_INFO(56,0,2);
          _SFD_STATE_INFO(57,0,2);
          _SFD_STATE_INFO(58,0,2);
          _SFD_STATE_INFO(59,0,2);
          _SFD_STATE_INFO(60,0,2);
          _SFD_STATE_INFO(61,0,2);
          _SFD_STATE_INFO(62,0,2);
          _SFD_STATE_INFO(63,0,2);
          _SFD_STATE_INFO(64,0,2);
          _SFD_STATE_INFO(65,0,2);
          _SFD_STATE_INFO(66,0,2);
          _SFD_STATE_INFO(67,0,2);
          _SFD_STATE_INFO(68,0,2);
          _SFD_STATE_INFO(69,0,2);
          _SFD_STATE_INFO(70,0,2);
          _SFD_STATE_INFO(71,0,2);
          _SFD_STATE_INFO(72,0,2);
          _SFD_STATE_INFO(73,0,2);
          _SFD_STATE_INFO(74,0,2);
          _SFD_STATE_INFO(75,0,2);
          _SFD_STATE_INFO(76,0,2);
          _SFD_STATE_INFO(77,0,2);
          _SFD_STATE_INFO(78,0,2);
          _SFD_STATE_INFO(79,0,2);
          _SFD_STATE_INFO(80,0,2);
          _SFD_STATE_INFO(81,0,2);
          _SFD_STATE_INFO(82,0,2);
          _SFD_STATE_INFO(83,0,2);
          _SFD_STATE_INFO(84,0,2);
          _SFD_CH_SUBSTATE_COUNT(1);
          _SFD_CH_SUBSTATE_DECOMP(0);
          _SFD_CH_SUBSTATE_INDEX(0,0);
          _SFD_ST_SUBSTATE_COUNT(0,10);
          _SFD_ST_SUBSTATE_INDEX(0,0,1);
          _SFD_ST_SUBSTATE_INDEX(0,1,2);
          _SFD_ST_SUBSTATE_INDEX(0,2,16);
          _SFD_ST_SUBSTATE_INDEX(0,3,29);
          _SFD_ST_SUBSTATE_INDEX(0,4,30);
          _SFD_ST_SUBSTATE_INDEX(0,5,47);
          _SFD_ST_SUBSTATE_INDEX(0,6,48);
          _SFD_ST_SUBSTATE_INDEX(0,7,49);
          _SFD_ST_SUBSTATE_INDEX(0,8,50);
          _SFD_ST_SUBSTATE_INDEX(0,9,51);
          _SFD_ST_SUBSTATE_COUNT(1,0);
          _SFD_ST_SUBSTATE_COUNT(2,13);
          _SFD_ST_SUBSTATE_INDEX(2,0,3);
          _SFD_ST_SUBSTATE_INDEX(2,1,4);
          _SFD_ST_SUBSTATE_INDEX(2,2,5);
          _SFD_ST_SUBSTATE_INDEX(2,3,6);
          _SFD_ST_SUBSTATE_INDEX(2,4,7);
          _SFD_ST_SUBSTATE_INDEX(2,5,8);
          _SFD_ST_SUBSTATE_INDEX(2,6,9);
          _SFD_ST_SUBSTATE_INDEX(2,7,10);
          _SFD_ST_SUBSTATE_INDEX(2,8,11);
          _SFD_ST_SUBSTATE_INDEX(2,9,12);
          _SFD_ST_SUBSTATE_INDEX(2,10,13);
          _SFD_ST_SUBSTATE_INDEX(2,11,14);
          _SFD_ST_SUBSTATE_INDEX(2,12,15);
          _SFD_ST_SUBSTATE_COUNT(3,0);
          _SFD_ST_SUBSTATE_COUNT(4,0);
          _SFD_ST_SUBSTATE_COUNT(5,0);
          _SFD_ST_SUBSTATE_COUNT(6,0);
          _SFD_ST_SUBSTATE_COUNT(7,0);
          _SFD_ST_SUBSTATE_COUNT(8,0);
          _SFD_ST_SUBSTATE_COUNT(9,0);
          _SFD_ST_SUBSTATE_COUNT(10,0);
          _SFD_ST_SUBSTATE_COUNT(11,0);
          _SFD_ST_SUBSTATE_COUNT(12,0);
          _SFD_ST_SUBSTATE_COUNT(13,0);
          _SFD_ST_SUBSTATE_COUNT(14,0);
          _SFD_ST_SUBSTATE_COUNT(15,0);
          _SFD_ST_SUBSTATE_COUNT(16,12);
          _SFD_ST_SUBSTATE_INDEX(16,0,17);
          _SFD_ST_SUBSTATE_INDEX(16,1,18);
          _SFD_ST_SUBSTATE_INDEX(16,2,19);
          _SFD_ST_SUBSTATE_INDEX(16,3,20);
          _SFD_ST_SUBSTATE_INDEX(16,4,21);
          _SFD_ST_SUBSTATE_INDEX(16,5,22);
          _SFD_ST_SUBSTATE_INDEX(16,6,23);
          _SFD_ST_SUBSTATE_INDEX(16,7,24);
          _SFD_ST_SUBSTATE_INDEX(16,8,25);
          _SFD_ST_SUBSTATE_INDEX(16,9,26);
          _SFD_ST_SUBSTATE_INDEX(16,10,27);
          _SFD_ST_SUBSTATE_INDEX(16,11,28);
          _SFD_ST_SUBSTATE_COUNT(17,0);
          _SFD_ST_SUBSTATE_COUNT(18,0);
          _SFD_ST_SUBSTATE_COUNT(19,0);
          _SFD_ST_SUBSTATE_COUNT(20,0);
          _SFD_ST_SUBSTATE_COUNT(21,0);
          _SFD_ST_SUBSTATE_COUNT(22,0);
          _SFD_ST_SUBSTATE_COUNT(23,0);
          _SFD_ST_SUBSTATE_COUNT(24,0);
          _SFD_ST_SUBSTATE_COUNT(25,0);
          _SFD_ST_SUBSTATE_COUNT(26,0);
          _SFD_ST_SUBSTATE_COUNT(27,0);
          _SFD_ST_SUBSTATE_COUNT(28,0);
          _SFD_ST_SUBSTATE_COUNT(29,0);
          _SFD_ST_SUBSTATE_COUNT(30,9);
          _SFD_ST_SUBSTATE_INDEX(30,0,31);
          _SFD_ST_SUBSTATE_INDEX(30,1,32);
          _SFD_ST_SUBSTATE_INDEX(30,2,33);
          _SFD_ST_SUBSTATE_INDEX(30,3,34);
          _SFD_ST_SUBSTATE_INDEX(30,4,35);
          _SFD_ST_SUBSTATE_INDEX(30,5,36);
          _SFD_ST_SUBSTATE_INDEX(30,6,44);
          _SFD_ST_SUBSTATE_INDEX(30,7,45);
          _SFD_ST_SUBSTATE_INDEX(30,8,46);
          _SFD_ST_SUBSTATE_COUNT(31,0);
          _SFD_ST_SUBSTATE_COUNT(32,0);
          _SFD_ST_SUBSTATE_COUNT(33,0);
          _SFD_ST_SUBSTATE_COUNT(34,0);
          _SFD_ST_SUBSTATE_COUNT(35,0);
          _SFD_ST_SUBSTATE_COUNT(36,7);
          _SFD_ST_SUBSTATE_INDEX(36,0,37);
          _SFD_ST_SUBSTATE_INDEX(36,1,38);
          _SFD_ST_SUBSTATE_INDEX(36,2,39);
          _SFD_ST_SUBSTATE_INDEX(36,3,40);
          _SFD_ST_SUBSTATE_INDEX(36,4,41);
          _SFD_ST_SUBSTATE_INDEX(36,5,42);
          _SFD_ST_SUBSTATE_INDEX(36,6,43);
          _SFD_ST_SUBSTATE_COUNT(37,0);
          _SFD_ST_SUBSTATE_COUNT(38,0);
          _SFD_ST_SUBSTATE_COUNT(39,0);
          _SFD_ST_SUBSTATE_COUNT(40,0);
          _SFD_ST_SUBSTATE_COUNT(41,0);
          _SFD_ST_SUBSTATE_COUNT(42,0);
          _SFD_ST_SUBSTATE_COUNT(43,0);
          _SFD_ST_SUBSTATE_COUNT(44,0);
          _SFD_ST_SUBSTATE_COUNT(45,0);
          _SFD_ST_SUBSTATE_COUNT(46,0);
          _SFD_ST_SUBSTATE_COUNT(47,0);
          _SFD_ST_SUBSTATE_COUNT(48,0);
          _SFD_ST_SUBSTATE_COUNT(49,0);
          _SFD_ST_SUBSTATE_COUNT(50,0);
          _SFD_ST_SUBSTATE_COUNT(51,0);
        }

        _SFD_CV_INIT_CHART(1,0,0,0);

        {
          _SFD_CV_INIT_STATE(0,10,1,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(1,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(2,13,1,1,1,0,NULL,NULL);
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
          _SFD_CV_INIT_STATE(6,0,0,0,0,0,NULL,NULL);
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
          _SFD_CV_INIT_STATE(14,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(15,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(16,12,1,1,1,0,NULL,NULL);
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
          _SFD_CV_INIT_STATE(24,0,0,0,0,0,NULL,NULL);
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
          _SFD_CV_INIT_STATE(30,9,1,1,1,0,NULL,NULL);
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
          _SFD_CV_INIT_STATE(36,7,1,1,0,0,NULL,NULL);
        }

        {
          static unsigned int sStartDecMap[] = { 110 };

          static unsigned int sEndDecMap[] = { 117 };

          _SFD_CV_INIT_STATE(37,0,0,0,0,1,&(sStartDecMap[0]),&(sEndDecMap[0]));
        }

        {
          _SFD_CV_INIT_STATE(38,0,0,0,0,0,NULL,NULL);
        }

        {
          static unsigned int sStartDecMap[] = { 129 };

          static unsigned int sEndDecMap[] = { 136 };

          _SFD_CV_INIT_STATE(39,0,0,0,0,1,&(sStartDecMap[0]),&(sEndDecMap[0]));
        }

        {
          static unsigned int sStartDecMap[] = { 214 };

          static unsigned int sEndDecMap[] = { 221 };

          _SFD_CV_INIT_STATE(40,0,0,0,0,1,&(sStartDecMap[0]),&(sEndDecMap[0]));
        }

        {
          static unsigned int sStartDecMap[] = { 107 };

          static unsigned int sEndDecMap[] = { 114 };

          _SFD_CV_INIT_STATE(41,0,0,0,0,1,&(sStartDecMap[0]),&(sEndDecMap[0]));
        }

        {
          static unsigned int sStartDecMap[] = { 106 };

          static unsigned int sEndDecMap[] = { 113 };

          _SFD_CV_INIT_STATE(42,0,0,0,0,1,&(sStartDecMap[0]),&(sEndDecMap[0]));
        }

        {
          static unsigned int sStartDecMap[] = { 101 };

          static unsigned int sEndDecMap[] = { 108 };

          _SFD_CV_INIT_STATE(43,0,0,0,0,1,&(sStartDecMap[0]),&(sEndDecMap[0]));
        }

        {
          _SFD_CV_INIT_STATE(44,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(45,0,0,0,0,0,NULL,NULL);
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

        {
          _SFD_CV_INIT_STATE(63,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(64,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(65,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(66,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(67,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(68,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(69,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(70,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(71,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(72,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(73,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(74,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(75,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(76,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(77,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(78,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(79,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(80,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(81,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(82,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(83,0,0,0,0,0,NULL,NULL);
        }

        {
          _SFD_CV_INIT_STATE(84,0,0,0,0,0,NULL,NULL);
        }

        _SFD_CV_INIT_TRANS(0,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 48 };

          static unsigned int sEndGuardMap[] = { 44, 91 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(1,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(2,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(3,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(4,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(5,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(6,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0, 9 };

          static unsigned int sEndGuardMap[] = { 8, 17 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(7,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(8,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(9,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(10,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(11,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(12,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(13,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(14,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(15,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(16,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(17,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(18,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(19,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(20,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(21,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(22,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(23,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(24,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 26 };

          static unsigned int sEndGuardMap[] = { 22, 47 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(25,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(26,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 18 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(27,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(28,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(29,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 22 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(30,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(31,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(32,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 48 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(33,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(34,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(35,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(36,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(37,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(38,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(39,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(40,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(41,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(42,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(43,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(44,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(45,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0, 9 };

          static unsigned int sEndGuardMap[] = { 8, 17 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(46,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(47,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(48,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(49,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0, 9 };

          static unsigned int sEndGuardMap[] = { 8, 17 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(50,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 17 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(51,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(52,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(53,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(54,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 17 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(55,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 27 };

          static unsigned int sEndGuardMap[] = { 23, 49 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(56,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(57,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(58,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(59,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 89 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(60,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(61,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(62,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(63,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(64,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(65,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 2, 50 };

          static unsigned int sEndGuardMap[] = { 44, 92 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(66,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(67,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(68,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(69,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 17 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(70,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
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
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(72,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(73,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(74,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(75,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 2, 49 };

          static unsigned int sEndGuardMap[] = { 43, 90 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(76,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(77,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(78,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(80,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(81,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(82,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(84,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(85,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0, 8 };

          static unsigned int sEndGuardMap[] = { 7, 21 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(86,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(87,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(88,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(89,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(90,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 21 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(91,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(92,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(93,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(94,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(95,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(96,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(97,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(98,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(99,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(100,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(101,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(102,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(103,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(104,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(105,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(106,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(107,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(108,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(109,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(110,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(111,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(112,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 26 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(113,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

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
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(116,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(117,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(118,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(119,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(120,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(121,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(122,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(123,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(124,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(125,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(126,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(127,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(128,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(129,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(130,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(131,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(132,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(133,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(134,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(135,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(136,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(137,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(138,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(139,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(140,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(141,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(142,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(143,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(144,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(145,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(146,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(147,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(148,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 17 };

          static unsigned int sEndGuardMap[] = { 13, 27 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(149,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 15 };

          static unsigned int sEndGuardMap[] = { 11, 27 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(150,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(151,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(152,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(153,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0, 9 };

          static unsigned int sEndGuardMap[] = { 8, 17 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(154,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(155,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(156,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(157,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(158,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(159,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(160,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(161,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(162,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 27 };

          static unsigned int sEndGuardMap[] = { 23, 49 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(163,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 26 };

          static unsigned int sEndGuardMap[] = { 22, 47 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(164,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(165,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 46 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(166,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(167,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(168,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(169,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 48 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(170,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(171,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 50 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(172,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 50 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(173,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(174,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(175,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(176,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(177,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(178,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(179,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 46 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(180,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(181,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(182,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(184,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 17 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(185,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 2, 49 };

          static unsigned int sEndGuardMap[] = { 43, 90 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(186,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(187,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(189,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(190,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(191,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(192,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(193,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 2, 50 };

          static unsigned int sEndGuardMap[] = { 44, 92 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(194,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(195,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(196,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(197,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(198,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(199,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(200,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(201,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 89 };

          static int sPostFixPredicateTree[] = { 0, 1, -2 };

          _SFD_CV_INIT_TRANS(202,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(203,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(204,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(205,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(206,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 48 };

          static unsigned int sEndGuardMap[] = { 44, 91 };

          static int sPostFixPredicateTree[] = { 0, 1, -3 };

          _SFD_CV_INIT_TRANS(207,2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),3,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(208,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(209,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(210,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(211,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(212,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(213,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(214,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(215,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(216,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(217,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 47 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(218,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 48 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(219,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(220,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(221,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(222,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(224,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(231,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(232,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(233,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(234,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(235,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(236,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(237,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(238,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(239,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(240,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(241,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(242,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(243,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(244,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(245,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(246,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(247,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(248,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(249,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(250,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(251,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(252,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(253,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(254,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(255,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(256,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(257,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(258,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(259,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(260,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(261,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(262,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(263,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(264,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          static int sPostFixPredicateTree[] = { 0, 1, -3, 2, -3 };

          _SFD_CV_INIT_TRANS(265,3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),5,
                             &(sPostFixPredicateTree[0]));
        }

        _SFD_CV_INIT_TRANS(266,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(267,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(268,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(269,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(270,0,NULL,NULL,0,NULL);
        _SFD_CV_INIT_TRANS(271,0,NULL,NULL,0,NULL);

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(79,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(83,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 26 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(183,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(188,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(223,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(225,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 11 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(226,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(227,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(228,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 21 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(229,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
                             &(sPostFixPredicateTree[0]));
        }

        {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 22 };

          static int sPostFixPredicateTree[] = { 0 };

          _SFD_CV_INIT_TRANS(230,1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),1,
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

        _SFD_TRANS_COV_WTS(1,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 48 };

          static unsigned int sEndGuardMap[] = { 44, 91 };

          _SFD_TRANS_COV_MAPS(1,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(2,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(2,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(3,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(3,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(4,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(4,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(5,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(5,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(6,0,0,20,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(6,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              20,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(7,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 9 };

          static unsigned int sEndGuardMap[] = { 8, 17 };

          _SFD_TRANS_COV_MAPS(7,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(8,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(8,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(9,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(9,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(10,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(10,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(11,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(11,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(12,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(12,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(13,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(13,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(14,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(14,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(15,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(15,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(16,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(16,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(17,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(17,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(18,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(18,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(19,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(19,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(20,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(20,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(21,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(21,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(22,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(22,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(23,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(23,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(24,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(24,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(25,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 26 };

          static unsigned int sEndGuardMap[] = { 22, 47 };

          _SFD_TRANS_COV_MAPS(25,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(26,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(26,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(27,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 18 };

          _SFD_TRANS_COV_MAPS(27,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(28,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(28,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(29,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(29,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(30,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 22 };

          _SFD_TRANS_COV_MAPS(30,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(32,0,0,5,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(32,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              5,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(33,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 48 };

          _SFD_TRANS_COV_MAPS(33,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(34,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(34,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(35,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(35,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(36,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(36,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(37,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(37,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(38,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(38,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(39,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(39,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(40,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(40,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(41,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(41,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(42,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(42,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
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

        _SFD_TRANS_COV_WTS(44,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(44,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(45,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(45,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(46,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 9 };

          static unsigned int sEndGuardMap[] = { 8, 17 };

          _SFD_TRANS_COV_MAPS(46,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(47,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(47,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(48,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(48,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(49,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(49,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(50,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 9 };

          static unsigned int sEndGuardMap[] = { 8, 17 };

          _SFD_TRANS_COV_MAPS(50,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(51,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 17 };

          _SFD_TRANS_COV_MAPS(51,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(52,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(52,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(53,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(53,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(54,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(54,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(55,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 17 };

          _SFD_TRANS_COV_MAPS(55,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(56,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 27 };

          static unsigned int sEndGuardMap[] = { 23, 49 };

          _SFD_TRANS_COV_MAPS(56,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(57,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(57,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(58,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(58,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(59,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(59,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(60,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 89 };

          _SFD_TRANS_COV_MAPS(60,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(61,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(61,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(62,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(62,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(63,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(63,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(64,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(64,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(65,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(65,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(66,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 2, 50 };

          static unsigned int sEndGuardMap[] = { 44, 92 };

          _SFD_TRANS_COV_MAPS(66,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(67,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(67,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(68,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(68,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(69,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(69,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(70,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 17 };

          _SFD_TRANS_COV_MAPS(70,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(71,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(71,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(72,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(72,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(73,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(73,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(74,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(74,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(75,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(75,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(76,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 2, 49 };

          static unsigned int sEndGuardMap[] = { 43, 90 };

          _SFD_TRANS_COV_MAPS(76,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
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
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(78,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(80,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(80,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(81,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(81,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(82,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(82,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(84,0,0,4,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(84,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              4,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(85,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(85,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(86,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 8 };

          static unsigned int sEndGuardMap[] = { 7, 21 };

          _SFD_TRANS_COV_MAPS(86,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(87,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(87,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(88,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(88,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(89,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(89,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(90,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(90,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(91,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 21 };

          _SFD_TRANS_COV_MAPS(91,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
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

        _SFD_TRANS_COV_WTS(93,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(93,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(94,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(94,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(95,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(95,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(96,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(96,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(97,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(97,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(98,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(98,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(99,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(99,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(100,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(100,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(101,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(101,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(102,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(102,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(103,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(103,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(104,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(104,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(105,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(105,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(108,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(108,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(109,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(109,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(110,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(110,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(111,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(111,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(112,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(112,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(113,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 26 };

          _SFD_TRANS_COV_MAPS(113,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(114,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(114,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(115,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(115,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(116,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(116,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(117,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(117,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(118,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(118,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(119,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(119,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(120,0,0,3,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(120,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              3,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(121,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(121,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(122,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(122,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(123,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(123,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(124,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(124,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(125,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(125,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(126,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(126,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(127,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(127,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(128,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(128,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(129,0,0,6,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(129,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              6,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(130,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(130,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(131,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(131,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(133,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(133,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(134,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(134,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(135,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(135,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(136,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(136,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(137,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(137,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(138,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(138,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(139,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(139,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(140,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(140,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(141,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(141,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(142,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(142,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(143,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(143,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(144,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(144,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(145,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(145,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(146,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(146,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(147,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(147,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(148,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(148,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(149,0,2,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 17 };

          static unsigned int sEndGuardMap[] = { 13, 27 };

          _SFD_TRANS_COV_MAPS(149,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(150,0,2,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 15 };

          static unsigned int sEndGuardMap[] = { 11, 27 };

          _SFD_TRANS_COV_MAPS(150,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(151,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(151,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(152,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(152,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(153,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(153,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(154,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0, 9 };

          static unsigned int sEndGuardMap[] = { 8, 17 };

          _SFD_TRANS_COV_MAPS(154,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(155,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(155,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(156,0,0,4,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(156,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              4,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(157,0,0,4,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(157,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              4,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(158,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(158,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(159,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(159,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(160,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(160,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
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

        _SFD_TRANS_COV_WTS(162,0,0,5,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(162,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              5,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(163,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 27 };

          static unsigned int sEndGuardMap[] = { 23, 49 };

          _SFD_TRANS_COV_MAPS(163,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(164,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 26 };

          static unsigned int sEndGuardMap[] = { 22, 47 };

          _SFD_TRANS_COV_MAPS(164,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
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

        _SFD_TRANS_COV_WTS(166,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 46 };

          _SFD_TRANS_COV_MAPS(166,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(167,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(167,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(168,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(168,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(169,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(169,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(170,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 48 };

          _SFD_TRANS_COV_MAPS(170,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(171,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(171,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(172,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 50 };

          _SFD_TRANS_COV_MAPS(172,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(173,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 50 };

          _SFD_TRANS_COV_MAPS(173,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(174,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(174,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(175,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(175,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(176,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(176,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(177,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(177,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(178,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(178,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(179,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(179,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(180,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 46 };

          _SFD_TRANS_COV_MAPS(180,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(181,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(181,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(182,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(182,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(184,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(184,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(185,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 17 };

          _SFD_TRANS_COV_MAPS(185,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(186,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 2, 49 };

          static unsigned int sEndGuardMap[] = { 43, 90 };

          _SFD_TRANS_COV_MAPS(186,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(187,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(187,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(189,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(189,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(190,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(190,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(191,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(191,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(192,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(192,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(193,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(193,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(194,0,2,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 2, 50 };

          static unsigned int sEndGuardMap[] = { 44, 92 };

          _SFD_TRANS_COV_MAPS(194,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(195,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(195,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(196,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(196,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(197,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(197,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(198,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(198,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(199,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(199,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(200,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(200,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(201,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 16 };

          _SFD_TRANS_COV_MAPS(201,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(202,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 47 };

          static unsigned int sEndGuardMap[] = { 43, 89 };

          _SFD_TRANS_COV_MAPS(202,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(203,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(203,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(204,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(204,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(205,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(205,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(206,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(206,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(207,0,2,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 48 };

          static unsigned int sEndGuardMap[] = { 44, 91 };

          _SFD_TRANS_COV_MAPS(207,
                              0,NULL,NULL,
                              2,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(208,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(208,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(209,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(209,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(210,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(210,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(211,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(211,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(212,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(212,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(213,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 34 };

          _SFD_TRANS_COV_MAPS(213,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(214,0,3,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          _SFD_TRANS_COV_MAPS(214,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(215,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(215,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(216,0,0,5,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(216,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              5,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(217,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(217,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(218,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 47 };

          _SFD_TRANS_COV_MAPS(218,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(219,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 48 };

          _SFD_TRANS_COV_MAPS(219,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(220,0,0,6,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(220,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              6,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(221,0,0,10,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(221,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              10,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(222,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 14 };

          _SFD_TRANS_COV_MAPS(222,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(224,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(224,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(231,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          _SFD_TRANS_COV_MAPS(231,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(232,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          _SFD_TRANS_COV_MAPS(232,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(233,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          _SFD_TRANS_COV_MAPS(233,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(234,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          _SFD_TRANS_COV_MAPS(234,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(235,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(235,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(236,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          _SFD_TRANS_COV_MAPS(236,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(237,0,1,0,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 38 };

          _SFD_TRANS_COV_MAPS(237,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(238,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(238,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(239,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(239,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(240,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(240,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(241,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 9 };

          _SFD_TRANS_COV_MAPS(241,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(242,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 10 };

          _SFD_TRANS_COV_MAPS(242,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(243,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(243,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(244,0,0,3,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(244,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              3,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(245,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(245,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(246,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(246,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(247,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(247,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(248,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(248,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(249,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(249,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(250,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(250,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(251,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(251,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(252,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(252,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(253,0,0,3,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(253,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              3,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(254,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(254,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(255,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(255,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(256,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(256,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(257,0,0,3,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(257,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              3,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(258,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(258,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(259,0,0,2,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(259,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(260,0,0,1,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(260,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(261,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(261,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(262,0,3,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          _SFD_TRANS_COV_MAPS(262,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(263,0,3,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          _SFD_TRANS_COV_MAPS(263,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(264,0,3,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          _SFD_TRANS_COV_MAPS(264,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(265,0,3,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1, 17, 33 };

          static unsigned int sEndGuardMap[] = { 13, 29, 66 };

          _SFD_TRANS_COV_MAPS(265,
                              0,NULL,NULL,
                              3,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(266,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(266,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(267,0,0,3,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(267,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              3,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(268,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(268,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(269,0,0,3,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(269,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              3,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(270,0,0,0,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(270,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(271,0,0,3,0);
        if (chartAlreadyPresent==0) {
          _SFD_TRANS_COV_MAPS(271,
                              0,NULL,NULL,
                              0,NULL,NULL,
                              3,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(79,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 13 };

          _SFD_TRANS_COV_MAPS(79,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(83,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 15 };

          _SFD_TRANS_COV_MAPS(83,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(183,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 26 };

          _SFD_TRANS_COV_MAPS(183,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(188,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 7 };

          _SFD_TRANS_COV_MAPS(188,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(223,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 24 };

          _SFD_TRANS_COV_MAPS(223,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(225,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 8 };

          _SFD_TRANS_COV_MAPS(225,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(226,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 1 };

          static unsigned int sEndGuardMap[] = { 11 };

          _SFD_TRANS_COV_MAPS(226,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(227,0,1,2,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(227,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              2,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(228,0,1,3,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 12 };

          _SFD_TRANS_COV_MAPS(228,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              3,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(229,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 21 };

          _SFD_TRANS_COV_MAPS(229,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_TRANS_COV_WTS(230,0,1,1,0);
        if (chartAlreadyPresent==0) {
          static unsigned int sStartGuardMap[] = { 0 };

          static unsigned int sEndGuardMap[] = { 22 };

          _SFD_TRANS_COV_MAPS(230,
                              0,NULL,NULL,
                              1,&(sStartGuardMap[0]),&(sEndGuardMap[0]),
                              1,NULL,NULL,
                              0,NULL,NULL);
        }

        _SFD_SET_DATA_COMPILED_PROPS(0,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(1,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(2,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_f_sf_marshallOut,(MexInFcnForType)c1_e_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(3,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_f_sf_marshallOut,(MexInFcnForType)c1_e_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(4,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_f_sf_marshallOut,(MexInFcnForType)c1_e_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(5,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(6,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(7,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(8,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(9,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(10,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(11,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(12,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(13,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(14,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(15,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(16,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(17,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(18,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(19,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(20,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(21,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(22,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(23,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(24,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(25,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(26,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(27,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(28,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(29,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(30,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(31,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(32,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(33,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(34,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(35,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(36,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(37,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(38,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(39,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(40,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(41,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(42,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(43,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(44,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(45,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(46,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(47,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(48,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(49,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(50,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(51,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(52,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(53,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(54,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(55,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(56,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(57,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(58,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(59,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(60,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(61,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(62,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(63,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(64,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(65,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(66,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(67,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(68,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(69,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(70,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(71,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(72,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(73,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(74,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_drugLibInfo_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(75,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_patientInfo_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(76,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_drugInfo_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(77,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_infuParameters_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(78,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_infuStatus_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(79,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_pumpConfigData_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(80,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_drugLibInfo_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(81,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_patientInfo_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(82,SF_STRUCT,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_infuStatus_bus_io,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(83,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(84,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_f_sf_marshallOut,(MexInFcnForType)c1_e_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(85,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_f_sf_marshallOut,(MexInFcnForType)c1_e_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(86,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(87,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(88,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(89,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(90,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(91,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(92,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)NULL);
        _SFD_SET_DATA_COMPILED_PROPS(93,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(94,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(95,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(96,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(97,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(98,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(99,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(100,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(101,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(102,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(103,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(104,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(105,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(106,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(107,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(108,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(109,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(110,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(111,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(112,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(113,SF_UINT8,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_f_sf_marshallOut,(MexInFcnForType)c1_e_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(114,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(115,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(116,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(117,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(118,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(119,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(120,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(121,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(122,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(123,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(124,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(125,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(126,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(127,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(128,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(129,SF_UINT32,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_b_sf_marshallOut,(MexInFcnForType)c1_b_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(130,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(131,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(132,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(133,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(134,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(135,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(136,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(137,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(138,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(139,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(140,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(141,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(142,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(143,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_COMPILED_PROPS(144,SF_DOUBLE,0,NULL,0,0,0,0.0,1.0,0,0,
          (MexFcnForType)c1_e_sf_marshallOut,(MexInFcnForType)c1_f_sf_marshallIn);
        _SFD_SET_DATA_VALUE_PTR(93,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(94,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(95,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(96,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(97,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(98,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(99,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(100,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(101,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(102,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(103,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(104,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(105,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(106,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(107,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(108,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(109,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(110,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(111,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(112,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(113,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(114,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(115,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(116,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(117,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(118,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(119,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(120,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(121,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(122,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(123,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(124,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(125,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(126,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(127,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(128,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(129,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(130,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(131,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(132,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(133,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(134,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(135,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(136,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(137,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(138,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(139,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(140,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(141,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(142,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(143,(void *)(NULL));
        _SFD_SET_DATA_VALUE_PTR(144,(void *)(NULL));

        {
          real_T *c1_ErrCond;
          uint32_T *c1_ClearCond;
          boolean_T *c1_O_InfusionInProgress;
          boolean_T *c1_O_InfusionPaused;
          boolean_T *c1_O_BolusRequested;
          real_T *c1_O_ProgrammedVTBI;
          real_T *c1_O_ProgrammedFlowRate;
          uint32_T *c1_O_CurrentState;
          c1_DrugLibrary *c1_drugLibInfo;
          c1_PatientInformation *c1_patientInfo;
          c1_DrugInformation *c1_drugInfo;
          c1_InfusionParameters *c1_infuParameters;
          c1_InfusionStatus *c1_infuStatus;
          c1_PumpConfigurationsStatus *c1_pumpConfigData;
          c1_DrugLibrary *c1_O_DrugLibInfo;
          c1_PatientInformation *c1_O_PatientInfo;
          c1_InfusionStatus *c1_O_InfuStatus;
          uint32_T *c1_O_AlarmCond;
          c1_O_AlarmCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S,
            11);
          c1_O_InfuStatus = (c1_InfusionStatus *)ssGetOutputPortSignal
            (chartInstance->S, 10);
          c1_O_PatientInfo = (c1_PatientInformation *)ssGetOutputPortSignal
            (chartInstance->S, 9);
          c1_O_DrugLibInfo = (c1_DrugLibrary *)ssGetOutputPortSignal
            (chartInstance->S, 8);
          c1_pumpConfigData = (c1_PumpConfigurationsStatus *)
            ssGetInputPortSignal(chartInstance->S, 6);
          c1_infuStatus = (c1_InfusionStatus *)ssGetInputPortSignal
            (chartInstance->S, 5);
          c1_infuParameters = (c1_InfusionParameters *)ssGetInputPortSignal
            (chartInstance->S, 4);
          c1_drugInfo = (c1_DrugInformation *)ssGetInputPortSignal
            (chartInstance->S, 3);
          c1_patientInfo = (c1_PatientInformation *)ssGetInputPortSignal
            (chartInstance->S, 2);
          c1_drugLibInfo = (c1_DrugLibrary *)ssGetInputPortSignal
            (chartInstance->S, 1);
          c1_O_CurrentState = (uint32_T *)ssGetOutputPortSignal(chartInstance->S,
            7);
          c1_O_ProgrammedFlowRate = (real_T *)ssGetOutputPortSignal
            (chartInstance->S, 6);
          c1_O_ProgrammedVTBI = (real_T *)ssGetOutputPortSignal(chartInstance->S,
            5);
          c1_O_BolusRequested = (boolean_T *)ssGetOutputPortSignal
            (chartInstance->S, 4);
          c1_O_InfusionPaused = (boolean_T *)ssGetOutputPortSignal
            (chartInstance->S, 3);
          c1_O_InfusionInProgress = (boolean_T *)ssGetOutputPortSignal
            (chartInstance->S, 2);
          c1_ClearCond = (uint32_T *)ssGetOutputPortSignal(chartInstance->S, 1);
          c1_ErrCond = (real_T *)ssGetInputPortSignal(chartInstance->S, 0);
          _SFD_SET_DATA_VALUE_PTR(0U, c1_ErrCond);
          _SFD_SET_DATA_VALUE_PTR(1U, c1_ClearCond);
          _SFD_SET_DATA_VALUE_PTR(2U, c1_O_InfusionInProgress);
          _SFD_SET_DATA_VALUE_PTR(3U, c1_O_InfusionPaused);
          _SFD_SET_DATA_VALUE_PTR(4U, c1_O_BolusRequested);
          _SFD_SET_DATA_VALUE_PTR(5U, c1_O_ProgrammedVTBI);
          _SFD_SET_DATA_VALUE_PTR(6U, c1_O_ProgrammedFlowRate);
          _SFD_SET_DATA_VALUE_PTR(7U, &chartInstance->c1_MSG_WELCOME);
          _SFD_SET_DATA_VALUE_PTR(8U, &chartInstance->c1_MSG_POWEROFF);
          _SFD_SET_DATA_VALUE_PTR(9U, &chartInstance->c1_MSG_POST);
          _SFD_SET_DATA_VALUE_PTR(10U, &chartInstance->c1_MSG_POSTFAIL);
          _SFD_SET_DATA_VALUE_PTR(11U, &chartInstance->c1_MSG_ADMINCHECK);
          _SFD_SET_DATA_VALUE_PTR(12U, &chartInstance->c1_MSG_ADMINFAIL);
          _SFD_SET_DATA_VALUE_PTR(13U, &chartInstance->c1_MSG_PRIME);
          _SFD_SET_DATA_VALUE_PTR(14U, &chartInstance->c1_MSG_PRIMEFAIL);
          _SFD_SET_DATA_VALUE_PTR(15U, &chartInstance->c1_MSG_CHECKTYPE);
          _SFD_SET_DATA_VALUE_PTR(16U, &chartInstance->c1_MSG_WRONGDRUG);
          _SFD_SET_DATA_VALUE_PTR(17U, &chartInstance->c1_MSG_CHECKDU);
          _SFD_SET_DATA_VALUE_PTR(18U, &chartInstance->c1_MSG_WRONGDU);
          _SFD_SET_DATA_VALUE_PTR(19U, &chartInstance->c1_MSG_CHECKCON);
          _SFD_SET_DATA_VALUE_PTR(20U, &chartInstance->c1_MSG_WRONGCON);
          _SFD_SET_DATA_VALUE_PTR(21U, &chartInstance->c1_MSG_DANGECON);
          _SFD_SET_DATA_VALUE_PTR(22U, &chartInstance->c1_MSG_PATIENTINFO);
          _SFD_SET_DATA_VALUE_PTR(23U, &chartInstance->c1_MSG_CHANGEVTBI);
          _SFD_SET_DATA_VALUE_PTR(24U, &chartInstance->c1_MSG_VTBI);
          _SFD_SET_DATA_VALUE_PTR(25U, &chartInstance->c1_MSG_CHECKVTBI);
          _SFD_SET_DATA_VALUE_PTR(26U, &chartInstance->c1_MSG_ALMVTBI);
          _SFD_SET_DATA_VALUE_PTR(27U, &chartInstance->c1_MSG_DISPLAYDR);
          _SFD_SET_DATA_VALUE_PTR(28U, &chartInstance->c1_MSG_CHECKDR);
          _SFD_SET_DATA_VALUE_PTR(29U, &chartInstance->c1_MSG_CHANGEDR);
          _SFD_SET_DATA_VALUE_PTR(30U, &chartInstance->c1_MSG_DISPLAYSET);
          _SFD_SET_DATA_VALUE_PTR(31U, &chartInstance->c1_MSG_ALRMDR);
          _SFD_SET_DATA_VALUE_PTR(32U, &chartInstance->c1_MSG_INFUSING);
          _SFD_SET_DATA_VALUE_PTR(33U, &chartInstance->c1_MSG_DANGERENVTEMP);
          _SFD_SET_DATA_VALUE_PTR(34U, &chartInstance->c1_MSG_DANGERHUMD);
          _SFD_SET_DATA_VALUE_PTR(35U, &chartInstance->c1_MSG_DANGERAP);
          _SFD_SET_DATA_VALUE_PTR(36U, &chartInstance->c1_MSG_POSTDONE);
          _SFD_SET_DATA_VALUE_PTR(37U, &chartInstance->c1_MSG_DRUGINFO);
          _SFD_SET_DATA_VALUE_PTR(38U, &chartInstance->c1_MSG_BOLUSGRANT);
          _SFD_SET_DATA_VALUE_PTR(39U, &chartInstance->c1_MSG_BOLUSDENIED);
          _SFD_SET_DATA_VALUE_PTR(40U, &chartInstance->c1_MSG_STOPBOLUS);
          _SFD_SET_DATA_VALUE_PTR(41U, &chartInstance->c1_MSG_EMPTYRESERVOIR);
          _SFD_SET_DATA_VALUE_PTR(42U, &chartInstance->c1_MSG_DOOROPEN);
          _SFD_SET_DATA_VALUE_PTR(43U, &chartInstance->c1_MSG_AIRINLINE);
          _SFD_SET_DATA_VALUE_PTR(44U, &chartInstance->c1_MSG_OCCULUSION);
          _SFD_SET_DATA_VALUE_PTR(45U, &chartInstance->c1_MSG_PAUSETOOLONG);
          _SFD_SET_DATA_VALUE_PTR(46U, &chartInstance->c1_MSG_FLOWRATEVARY);
          _SFD_SET_DATA_VALUE_PTR(47U, &chartInstance->c1_MSG_OVERINFUSION);
          _SFD_SET_DATA_VALUE_PTR(48U, &chartInstance->c1_MSG_UNDERINFUSION);
          _SFD_SET_DATA_VALUE_PTR(49U, &chartInstance->c1_MSG_LESSTHANKVO);
          _SFD_SET_DATA_VALUE_PTR(50U, &chartInstance->c1_MSG_RATEEXCEEDCAPACITY);
          _SFD_SET_DATA_VALUE_PTR(51U, &chartInstance->c1_MSG_REALTIMECLOCK);
          _SFD_SET_DATA_VALUE_PTR(52U, &chartInstance->c1_MSG_WATCHDOGALERT);
          _SFD_SET_DATA_VALUE_PTR(53U, &chartInstance->c1_MSG_OUTOFPOWER);
          _SFD_SET_DATA_VALUE_PTR(54U, &chartInstance->c1_MSG_MEMORYCORRUPT);
          _SFD_SET_DATA_VALUE_PTR(55U, &chartInstance->c1_MSG_CPUFAILURE);
          _SFD_SET_DATA_VALUE_PTR(56U, &chartInstance->c1_MSG_INFUSIONSTOP);
          _SFD_SET_DATA_VALUE_PTR(57U, &chartInstance->c1_MSG_SPCHOOSE);
          _SFD_SET_DATA_VALUE_PTR(58U, &chartInstance->c1_MSG_INFUSIONPAUSED);
          _SFD_SET_DATA_VALUE_PTR(59U, &chartInstance->c1_MSG_CONFIRMPAUSE);
          _SFD_SET_DATA_VALUE_PTR(60U, &chartInstance->c1_MSG_CONFIRMSTOP);
          _SFD_SET_DATA_VALUE_PTR(61U, &chartInstance->c1_MSG_STOPPAUSE);
          _SFD_SET_DATA_VALUE_PTR(62U, &chartInstance->c1_MSG_LOGERR);
          _SFD_SET_DATA_VALUE_PTR(63U, &chartInstance->c1_MSG_LOWBATT);
          _SFD_SET_DATA_VALUE_PTR(64U, &chartInstance->c1_MSG_LOWRESR);
          _SFD_SET_DATA_VALUE_PTR(65U, &chartInstance->c1_MSG_WRNDR);
          _SFD_SET_DATA_VALUE_PTR(66U, &chartInstance->c1_MSG_WRNVTBI);
          _SFD_SET_DATA_VALUE_PTR(67U, &chartInstance->c1_temp);
          _SFD_SET_DATA_VALUE_PTR(68U, &chartInstance->c1_MSG_NOTREADY);
          _SFD_SET_DATA_VALUE_PTR(69U, &chartInstance->c1_MSG_BLANK);
          _SFD_SET_DATA_VALUE_PTR(70U, &chartInstance->c1_MSG_WRNBATTERYCHARGE);
          _SFD_SET_DATA_VALUE_PTR(71U, &chartInstance->c1_MSG_VOLTOUTRANGE);
          _SFD_SET_DATA_VALUE_PTR(72U, c1_O_CurrentState);
          _SFD_SET_DATA_VALUE_PTR(73U, &chartInstance->c1_tempx);
          _SFD_SET_DATA_VALUE_PTR(74U, c1_drugLibInfo);
          _SFD_SET_DATA_VALUE_PTR(75U, c1_patientInfo);
          _SFD_SET_DATA_VALUE_PTR(76U, c1_drugInfo);
          _SFD_SET_DATA_VALUE_PTR(77U, c1_infuParameters);
          _SFD_SET_DATA_VALUE_PTR(78U, c1_infuStatus);
          _SFD_SET_DATA_VALUE_PTR(79U, c1_pumpConfigData);
          _SFD_SET_DATA_VALUE_PTR(80U, c1_O_DrugLibInfo);
          _SFD_SET_DATA_VALUE_PTR(81U, c1_O_PatientInfo);
          _SFD_SET_DATA_VALUE_PTR(82U, c1_O_InfuStatus);
          _SFD_SET_DATA_VALUE_PTR(83U, c1_O_AlarmCond);
          _SFD_SET_DATA_VALUE_PTR(84U, &chartInstance->c1_infusing);
          _SFD_SET_DATA_VALUE_PTR(85U, &chartInstance->c1_bolusing);
          _SFD_SET_DATA_VALUE_PTR(86U, &chartInstance->c1_vtbi);
          _SFD_SET_DATA_VALUE_PTR(87U, &chartInstance->c1_doseRate);
          _SFD_SET_DATA_VALUE_PTR(88U,
            &chartInstance->c1_initDrugReservoirVolume);
          _SFD_SET_DATA_VALUE_PTR(89U, &chartInstance->c1_MSG_PUMPTOOHOT);
          _SFD_SET_DATA_VALUE_PTR(90U, &chartInstance->c1_MSG_PAUSELONG);
          _SFD_SET_DATA_VALUE_PTR(91U, &chartInstance->c1_MSG_PUMPOVERHEAT);
          _SFD_SET_DATA_VALUE_PTR(92U, &chartInstance->c1_MSG_DISPINFU);
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
  return "Fw6F9bzuoKeSsUQvlQYddD";
}

static void sf_opaque_initialize_c1_GPCA_Extension(void *chartInstanceVar)
{
  chart_debug_initialization(((SFc1_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar)->S,0);
  initialize_params_c1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
  initialize_c1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

static void sf_opaque_enable_c1_GPCA_Extension(void *chartInstanceVar)
{
  enable_c1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*) chartInstanceVar);
}

static void sf_opaque_disable_c1_GPCA_Extension(void *chartInstanceVar)
{
  disable_c1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

static void sf_opaque_gateway_c1_GPCA_Extension(void *chartInstanceVar)
{
  sf_c1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*) chartInstanceVar);
}

extern const mxArray* sf_internal_get_sim_state_c1_GPCA_Extension(SimStruct* S)
{
  ChartInfoStruct *chartInfo = (ChartInfoStruct*) ssGetUserData(S);
  mxArray *plhs[1] = { NULL };

  mxArray *prhs[4];
  int mxError = 0;
  prhs[0] = mxCreateString("chart_simctx_raw2high");
  prhs[1] = mxCreateDoubleScalar(ssGetSFuncBlockHandle(S));
  prhs[2] = (mxArray*) get_sim_state_c1_GPCA_Extension
    ((SFc1_GPCA_ExtensionInstanceStruct*)chartInfo->chartInstance);/* raw sim ctx */
  prhs[3] = (mxArray*) sf_get_sim_state_info_c1_GPCA_Extension();/* state var info */
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

extern void sf_internal_set_sim_state_c1_GPCA_Extension(SimStruct* S, const
  mxArray *st)
{
  ChartInfoStruct *chartInfo = (ChartInfoStruct*) ssGetUserData(S);
  mxArray *plhs[1] = { NULL };

  mxArray *prhs[4];
  int mxError = 0;
  prhs[0] = mxCreateString("chart_simctx_high2raw");
  prhs[1] = mxCreateDoubleScalar(ssGetSFuncBlockHandle(S));
  prhs[2] = mxDuplicateArray(st);      /* high level simctx */
  prhs[3] = (mxArray*) sf_get_sim_state_info_c1_GPCA_Extension();/* state var info */
  mxError = sf_mex_call_matlab(1, plhs, 4, prhs, "sfprivate");
  mxDestroyArray(prhs[0]);
  mxDestroyArray(prhs[1]);
  mxDestroyArray(prhs[2]);
  mxDestroyArray(prhs[3]);
  if (mxError || plhs[0] == NULL) {
    sf_mex_error_message("Stateflow Internal Error: \nError calling 'chart_simctx_high2raw'.\n");
  }

  set_sim_state_c1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*)
    chartInfo->chartInstance, mxDuplicateArray(plhs[0]));
  mxDestroyArray(plhs[0]);
}

static const mxArray* sf_opaque_get_sim_state_c1_GPCA_Extension(SimStruct* S)
{
  return sf_internal_get_sim_state_c1_GPCA_Extension(S);
}

static void sf_opaque_set_sim_state_c1_GPCA_Extension(SimStruct* S, const
  mxArray *st)
{
  sf_internal_set_sim_state_c1_GPCA_Extension(S, st);
}

static void sf_opaque_terminate_c1_GPCA_Extension(void *chartInstanceVar)
{
  if (chartInstanceVar!=NULL) {
    SimStruct *S = ((SFc1_GPCA_ExtensionInstanceStruct*) chartInstanceVar)->S;
    if (sim_mode_is_rtw_gen(S) || sim_mode_is_external(S)) {
      sf_clear_rtw_identifier(S);
    }

    finalize_c1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*)
      chartInstanceVar);
    free((void *)chartInstanceVar);
    ssSetUserData(S,NULL);
  }

  unload_GPCA_Extension_optimization_info();
}

static void sf_opaque_init_subchart_simstructs(void *chartInstanceVar)
{
  initSimStructsc1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*)
    chartInstanceVar);
}

extern unsigned int sf_machine_global_initializer_called(void);
static void mdlProcessParameters_c1_GPCA_Extension(SimStruct *S)
{
  int i;
  for (i=0;i<ssGetNumRunTimeParams(S);i++) {
    if (ssGetSFcnParamTunable(S,i)) {
      ssUpdateDlgParamAsRunTimeParam(S,i);
    }
  }

  if (sf_machine_global_initializer_called()) {
    initialize_params_c1_GPCA_Extension((SFc1_GPCA_ExtensionInstanceStruct*)
      (((ChartInfoStruct *)ssGetUserData(S))->chartInstance));
  }
}

static void mdlSetWorkWidths_c1_GPCA_Extension(SimStruct *S)
{
  if (sim_mode_is_rtw_gen(S) || sim_mode_is_external(S)) {
    mxArray *infoStruct = load_GPCA_Extension_optimization_info();
    int_T chartIsInlinable =
      (int_T)sf_is_chart_inlinable(S,sf_get_instance_specialization(),infoStruct,
      1);
    ssSetStateflowIsInlinable(S,chartIsInlinable);
    ssSetRTWCG(S,sf_rtw_info_uint_prop(S,sf_get_instance_specialization(),
                infoStruct,1,"RTWCG"));
    ssSetEnableFcnIsTrivial(S,1);
    ssSetDisableFcnIsTrivial(S,1);
    ssSetNotMultipleInlinable(S,sf_rtw_info_uint_prop(S,
      sf_get_instance_specialization(),infoStruct,1,
      "gatewayCannotBeInlinedMultipleTimes"));
    if (chartIsInlinable) {
      ssSetInputPortOptimOpts(S, 0, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 1, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 2, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 3, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 4, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 5, SS_REUSABLE_AND_LOCAL);
      ssSetInputPortOptimOpts(S, 6, SS_REUSABLE_AND_LOCAL);
      sf_mark_chart_expressionable_inputs(S,sf_get_instance_specialization(),
        infoStruct,1,7);
      sf_mark_chart_reusable_outputs(S,sf_get_instance_specialization(),
        infoStruct,1,14);
    }

    ssSetInputPortOptimOpts(S, 7, SS_REUSABLE_AND_LOCAL);
    sf_set_rtw_dwork_info(S,sf_get_instance_specialization(),infoStruct,1);
    ssSetHasSubFunctions(S,!(chartIsInlinable));
  } else {
  }

  ssSetOptions(S,ssGetOptions(S)|SS_OPTION_WORKS_WITH_CODE_REUSE);
  ssSetChecksum0(S,(815879144U));
  ssSetChecksum1(S,(3785608889U));
  ssSetChecksum2(S,(3357069233U));
  ssSetChecksum3(S,(485940213U));
  ssSetmdlDerivatives(S, NULL);
  ssSetExplicitFCSSCtrl(S,1);
}

static void mdlRTW_c1_GPCA_Extension(SimStruct *S)
{
  if (sim_mode_is_rtw_gen(S)) {
    ssWriteRTWStrParam(S, "StateflowChartType", "Stateflow");
  }
}

static void mdlStart_c1_GPCA_Extension(SimStruct *S)
{
  SFc1_GPCA_ExtensionInstanceStruct *chartInstance;
  chartInstance = (SFc1_GPCA_ExtensionInstanceStruct *)malloc(sizeof
    (SFc1_GPCA_ExtensionInstanceStruct));
  memset(chartInstance, 0, sizeof(SFc1_GPCA_ExtensionInstanceStruct));
  if (chartInstance==NULL) {
    sf_mex_error_message("Could not allocate memory for chart instance.");
  }

  chartInstance->chartInfo.chartInstance = chartInstance;
  chartInstance->chartInfo.isEMLChart = 0;
  chartInstance->chartInfo.chartInitialized = 0;
  chartInstance->chartInfo.sFunctionGateway =
    sf_opaque_gateway_c1_GPCA_Extension;
  chartInstance->chartInfo.initializeChart =
    sf_opaque_initialize_c1_GPCA_Extension;
  chartInstance->chartInfo.terminateChart =
    sf_opaque_terminate_c1_GPCA_Extension;
  chartInstance->chartInfo.enableChart = sf_opaque_enable_c1_GPCA_Extension;
  chartInstance->chartInfo.disableChart = sf_opaque_disable_c1_GPCA_Extension;
  chartInstance->chartInfo.getSimState =
    sf_opaque_get_sim_state_c1_GPCA_Extension;
  chartInstance->chartInfo.setSimState =
    sf_opaque_set_sim_state_c1_GPCA_Extension;
  chartInstance->chartInfo.getSimStateInfo =
    sf_get_sim_state_info_c1_GPCA_Extension;
  chartInstance->chartInfo.zeroCrossings = NULL;
  chartInstance->chartInfo.outputs = NULL;
  chartInstance->chartInfo.derivatives = NULL;
  chartInstance->chartInfo.mdlRTW = mdlRTW_c1_GPCA_Extension;
  chartInstance->chartInfo.mdlStart = mdlStart_c1_GPCA_Extension;
  chartInstance->chartInfo.mdlSetWorkWidths = mdlSetWorkWidths_c1_GPCA_Extension;
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

void c1_GPCA_Extension_method_dispatcher(SimStruct *S, int_T method, void *data)
{
  switch (method) {
   case SS_CALL_MDL_START:
    mdlStart_c1_GPCA_Extension(S);
    break;

   case SS_CALL_MDL_SET_WORK_WIDTHS:
    mdlSetWorkWidths_c1_GPCA_Extension(S);
    break;

   case SS_CALL_MDL_PROCESS_PARAMETERS:
    mdlProcessParameters_c1_GPCA_Extension(S);
    break;

   default:
    /* Unhandled method */
    sf_mex_error_message("Stateflow Internal Error:\n"
                         "Error calling c1_GPCA_Extension_method_dispatcher.\n"
                         "Can't handle method %d.\n", method);
    break;
  }
}
