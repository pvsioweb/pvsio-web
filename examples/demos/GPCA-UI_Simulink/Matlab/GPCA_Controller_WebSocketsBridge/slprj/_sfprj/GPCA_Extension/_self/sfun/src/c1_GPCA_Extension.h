#ifndef __c1_GPCA_Extension_h__
#define __c1_GPCA_Extension_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
#ifndef struct_DrugLibrary_tag
#define struct_DrugLibrary_tag

typedef struct DrugLibrary_tag
{
  uint32_T drugID;
  real_T amount;
  real_T diluentVolume;
  real_T doseRateTypical;
  real_T doseRateUpperHardLimit;
  real_T doseRateUpperSoftLimit;
  real_T doseRateLowerHardLimit;
  real_T doseRateLowerSoftLimit;
  uint32_T doseRateUnit;
  real_T vtbiTypical;
  real_T vtbiUpperHardLimit;
  real_T vtbiUpperSoftLimit;
  real_T vtbiLowerHardLimit;
  real_T vtbiLowerSoftLimit;
  uint32_T vtbiUnit;
  real_T drugConcentrationTypical;
  real_T drugConcentrationUpperHardLimit;
  real_T drugConcentrationUpperSoftLimit;
  real_T drugConcentrationLowerHardLimit;
  real_T drugConcentrationLowerSoftLimit;
} c1_DrugLibrary;

#else

typedef struct DrugLibrary_tag c1_DrugLibrary;

#endif

#ifndef struct_PatientInformation_tag
#define struct_PatientInformation_tag

typedef struct PatientInformation_tag
{
  uint32_T patientID;
  uint32_T patientAge;
  uint32_T patientGender;
  uint32_T patientWeight;
} c1_PatientInformation;

#else

typedef struct PatientInformation_tag c1_PatientInformation;

#endif

#ifndef struct_DrugInformation_tag
#define struct_DrugInformation_tag

typedef struct DrugInformation_tag
{
  uint32_T drugID;
  real_T drugDoseAmount;
  real_T drugDiluentVolume;
  real_T drugConcentration;
  uint32_T drugDoseUnit;
  uint32_T drugVolumeUnit;
} c1_DrugInformation;

#else

typedef struct DrugInformation_tag c1_DrugInformation;

#endif

#ifndef struct_InfusionParameters_tag
#define struct_InfusionParameters_tag

typedef struct InfusionParameters_tag
{
  real_T programmedVTBI;
  real_T programmedDoseRate;
} c1_InfusionParameters;

#else

typedef struct InfusionParameters_tag c1_InfusionParameters;

#endif

#ifndef struct_InfusionStatus_tag
#define struct_InfusionStatus_tag

typedef struct InfusionStatus_tag
{
  boolean_T isBolusInProgress;
  real_T totalVolumeInfused;
  real_T remainingVolumeInReservoir;
} c1_InfusionStatus;

#else

typedef struct InfusionStatus_tag c1_InfusionStatus;

#endif

#ifndef struct_PumpConfigurationsStatus_tag
#define struct_PumpConfigurationsStatus_tag

typedef struct PumpConfigurationsStatus_tag
{
  boolean_T isPOSTSuccessful;
  boolean_T isPumpPrimed;
  boolean_T isAdminSetCheckPassed;
} c1_PumpConfigurationsStatus;

#else

typedef struct PumpConfigurationsStatus_tag c1_PumpConfigurationsStatus;

#endif

typedef struct {
  uint32_T c1_E_RestartEventCounter;
  uint32_T c1_E_AlarmClearEventCounter;
  uint32_T c1_E_RequestToStartEventCounter;
  int32_T c1_sfEvent;
  uint8_T c1_tp_ALM_VTBIOutBound;
  uint8_T c1_tp_DisplayDoseRate;
  uint8_T c1_tp_ConfirmPowerDown;
  uint8_T c1_tp_PowerOff;
  uint8_T c1_tp_POST;
  uint8_T c1_tp_ALM_POSTFailed;
  uint8_T c1_tp_CheckAdminSet;
  uint8_T c1_tp_CheckPrime;
  uint8_T c1_tp_ALM_WrongAdminCheck;
  uint8_T c1_tp_PrimeFailed;
  uint8_T c1_tp_DisplayDrugInfo;
  uint8_T c1_tp_CheckDrug_CheckType;
  uint8_T c1_tp_UnknownDrug;
  uint8_T c1_tp_Check_DrugUnits;
  uint8_T c1_tp_IncorrectDrugUnits;
  uint8_T c1_tp_Check_Concen;
  uint8_T c1_tp_WrongConcentration;
  uint8_T c1_tp_WRN_DangerCon;
  uint8_T c1_tp_DisplayPatientProfile;
  uint8_T c1_tp_DisplayVTBI;
  uint8_T c1_tp_ChangeVTBI;
  uint8_T c1_tp_CheckVTBI;
  uint8_T c1_tp_ChangeDoseRate;
  uint8_T c1_tp_CheckDoseRate;
  uint8_T c1_tp_ALM_DoseRateOutBound;
  uint8_T c1_tp_DisplaySettings;
  uint8_T c1_tp_Infusing;
  uint8_T c1_tp_InfusionInSession;
  uint8_T c1_tp_ChangeRate;
  uint8_T c1_tp_CheckNewRate;
  uint8_T c1_tp_ALM_NewRateOutBound;
  uint8_T c1_tp_ConfirmStop;
  uint8_T c1_tp_ConfirmPause;
  uint8_T c1_tp_InfusionPaused;
  uint8_T c1_tp_ReadyToStart;
  uint8_T c1_tp_PausedStopConfirm;
  uint8_T c1_tp_InfusionStopped;
  uint8_T c1_tp_EmptyReservoir;
  uint8_T c1_tp_CheckDrugWhileInfusing;
  uint8_T c1_tp_ALMWrongDrug;
  uint8_T c1_tp_Init;
  uint8_T c1_tp_LevelTwoAlarming;
  uint8_T c1_tp_InfusionSubMachine;
  uint8_T c1_tp_POSTDONE;
  uint8_T c1_tp_WRN_VTBIOutBound;
  uint8_T c1_tp_LEVELONEALRM;
  uint8_T c1_tp_BolusRequest;
  uint8_T c1_tp_WRN_DOSERATEOUTSOFTLIMITS;
  uint8_T c1_tp_PausedTooLong;
  uint8_T c1_tp_CheckDrugRoutine;
  uint8_T c1_tp_ConfigureInfusionProgram;
  uint8_T c1_tp_InfusionStateMachine;
  boolean_T c1_isStable;
  uint8_T c1_is_active_c1_GPCA_Extension;
  uint8_T c1_is_c1_GPCA_Extension;
  uint8_T c1_is_InfusionInSession;
  uint8_T c1_was_InfusionInSession;
  uint8_T c1_is_InfusionSubMachine;
  uint8_T c1_is_CheckDrugRoutine;
  uint8_T c1_was_CheckDrugRoutine;
  uint8_T c1_is_ConfigureInfusionProgram;
  uint8_T c1_was_ConfigureInfusionProgram;
  uint8_T c1_is_InfusionStateMachine;
  uint32_T c1_MSG_WELCOME;
  uint32_T c1_MSG_POWEROFF;
  uint32_T c1_MSG_POST;
  uint32_T c1_MSG_POSTFAIL;
  uint32_T c1_MSG_ADMINCHECK;
  uint32_T c1_MSG_ADMINFAIL;
  uint32_T c1_MSG_PRIME;
  uint32_T c1_MSG_PRIMEFAIL;
  uint32_T c1_MSG_CHECKTYPE;
  uint32_T c1_MSG_WRONGDRUG;
  uint32_T c1_MSG_CHECKDU;
  uint32_T c1_MSG_WRONGDU;
  uint32_T c1_MSG_CHECKCON;
  uint32_T c1_MSG_WRONGCON;
  uint32_T c1_MSG_DANGECON;
  uint32_T c1_MSG_PATIENTINFO;
  uint32_T c1_MSG_CHANGEVTBI;
  uint32_T c1_MSG_VTBI;
  uint32_T c1_MSG_CHECKVTBI;
  uint32_T c1_MSG_ALMVTBI;
  uint32_T c1_MSG_DISPLAYDR;
  uint32_T c1_MSG_CHECKDR;
  uint32_T c1_MSG_CHANGEDR;
  uint32_T c1_MSG_DISPLAYSET;
  uint32_T c1_MSG_ALRMDR;
  uint32_T c1_MSG_INFUSING;
  uint32_T c1_MSG_DANGERENVTEMP;
  uint32_T c1_MSG_DANGERHUMD;
  uint32_T c1_MSG_DANGERAP;
  uint32_T c1_MSG_POSTDONE;
  uint32_T c1_MSG_DRUGINFO;
  uint32_T c1_MSG_BOLUSGRANT;
  uint32_T c1_MSG_BOLUSDENIED;
  uint32_T c1_MSG_STOPBOLUS;
  uint32_T c1_MSG_EMPTYRESERVOIR;
  uint32_T c1_MSG_DOOROPEN;
  uint32_T c1_MSG_AIRINLINE;
  uint32_T c1_MSG_OCCULUSION;
  uint32_T c1_MSG_PAUSETOOLONG;
  uint32_T c1_MSG_FLOWRATEVARY;
  uint32_T c1_MSG_OVERINFUSION;
  uint32_T c1_MSG_UNDERINFUSION;
  uint32_T c1_MSG_LESSTHANKVO;
  uint32_T c1_MSG_RATEEXCEEDCAPACITY;
  uint32_T c1_MSG_REALTIMECLOCK;
  uint32_T c1_MSG_WATCHDOGALERT;
  uint32_T c1_MSG_OUTOFPOWER;
  uint32_T c1_MSG_MEMORYCORRUPT;
  uint32_T c1_MSG_CPUFAILURE;
  uint32_T c1_MSG_INFUSIONSTOP;
  uint32_T c1_MSG_SPCHOOSE;
  uint32_T c1_MSG_INFUSIONPAUSED;
  uint32_T c1_MSG_CONFIRMPAUSE;
  uint32_T c1_MSG_CONFIRMSTOP;
  uint32_T c1_MSG_STOPPAUSE;
  uint32_T c1_MSG_LOGERR;
  uint32_T c1_MSG_LOWBATT;
  uint32_T c1_MSG_LOWRESR;
  uint32_T c1_MSG_WRNDR;
  uint32_T c1_MSG_WRNVTBI;
  real_T c1_temp;
  uint32_T c1_MSG_NOTREADY;
  uint32_T c1_MSG_BLANK;
  uint32_T c1_MSG_WRNBATTERYCHARGE;
  uint32_T c1_MSG_VOLTOUTRANGE;
  uint32_T c1_tempx;
  boolean_T c1_infusing;
  boolean_T c1_bolusing;
  real_T c1_vtbi;
  real_T c1_doseRate;
  real_T c1_initDrugReservoirVolume;
  uint32_T c1_MSG_PUMPTOOHOT;
  uint32_T c1_MSG_PAUSELONG;
  uint32_T c1_MSG_PUMPOVERHEAT;
  uint32_T c1_MSG_DISPINFU;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c1_temporalCounter_i1;
  uint8_T c1_doSetSimStateSideEffects;
  const mxArray *c1_setSimStateSideEffectsInfo;
} SFc1_GPCA_ExtensionInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c1_GPCA_Extension_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c1_GPCA_Extension_get_check_sum(mxArray *plhs[]);
extern void c1_GPCA_Extension_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
