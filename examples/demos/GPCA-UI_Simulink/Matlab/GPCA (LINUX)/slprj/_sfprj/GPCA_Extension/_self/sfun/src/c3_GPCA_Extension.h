#ifndef __c3_GPCA_Extension_h__
#define __c3_GPCA_Extension_h__

/* Include files */
#include "sfc_sf.h"
#include "sfc_mex.h"
#include "rtwtypes.h"

/* Type Definitions */
#ifndef struct_EnvironmentSensorSignals_tag
#define struct_EnvironmentSensorSignals_tag

typedef struct EnvironmentSensorSignals_tag
{
  boolean_T isTemperatureOutOfRange;
  boolean_T isHumidityOutOfRange;
  boolean_T isAirPressureOutOfRange;
} c3_EnvironmentSensorSignals;

#else

typedef struct EnvironmentSensorSignals_tag c3_EnvironmentSensorSignals;

#endif

#ifndef struct_HardwareSensorSignals_tag
#define struct_HardwareSensorSignals_tag

typedef struct HardwareSensorSignals_tag
{
  boolean_T isLoggingFailed;
  boolean_T isWatchDogInterruptDetected;
  boolean_T isReservoirDoorOpen;
  boolean_T isBatteryDepleted;
  boolean_T isBatteryLow;
  boolean_T isBatteryUnableToCharge;
  boolean_T isSupplyVoltageOutOfRange;
  boolean_T isCPUInError;
  boolean_T isRTCInError;
  boolean_T isMemoryCorrupted;
  boolean_T isPumpTooHot;
  boolean_T isPumpOverheated;
} c3_HardwareSensorSignals;

#else

typedef struct HardwareSensorSignals_tag c3_HardwareSensorSignals;

#endif

#ifndef struct_InfusionSensorSignals_tag
#define struct_InfusionSensorSignals_tag

typedef struct InfusionSensorSignals_tag
{
  boolean_T isReservoirEmpty;
  boolean_T isReservoirLow;
  boolean_T isOcclusionDetected;
  boolean_T isInfusionRateTooHigh;
  boolean_T isInfusionRateTooLow;
  boolean_T isInfusionRateLessThanKVO;
  boolean_T isFlowRateNotStable;
  boolean_T isFlowRateOverPumpCapacity;
  boolean_T isInfusionPausedLong;
  boolean_T isInfusionPausedTooLong;
  boolean_T isAirInLineDetected;
} c3_InfusionSensorSignals;

#else

typedef struct InfusionSensorSignals_tag c3_InfusionSensorSignals;

#endif

typedef struct {
  uint32_T c3_E_AlarmEventCounter;
  uint32_T c3_E_WarningEventCounter;
  uint32_T c3_E_ReadyEventCounter;
  uint32_T c3_E_NotReadyEventCounter;
  int32_T c3_sfEvent;
  uint8_T c3_tp_HumidityCheck;
  uint8_T c3_tp_BatteryChargingCheck;
  uint8_T c3_tp_LowBatteryCheck;
  uint8_T c3_tp_LoggingCheck;
  uint8_T c3_tp_InfusionPausedDurationCheck;
  uint8_T c3_tp_EndState;
  uint8_T c3_tp_WNStart;
  uint8_T c3_tp_LowReservoirCheck;
  uint8_T c3_tp_Hold;
  uint8_T c3_tp_HOLD;
  uint8_T c3_tp_AlarmingMachine;
  uint8_T c3_tp_SinkTWOCheckOne;
  uint8_T c3_tp_START;
  uint8_T c3_tp_WRN;
  uint8_T c3_tp_WatchdogCheck;
  uint8_T c3_tp_Sink24;
  uint8_T c3_tp_Sink26;
  uint8_T c3_tp_RateOverPumpCapacityCheck;
  uint8_T c3_tp_CheckLOne;
  uint8_T c3_tp_CheckWRN;
  uint8_T c3_tp_SinkOne;
  uint8_T c3_tp_LowInfusionRateCheck;
  uint8_T c3_tp_RateLessThanKVOCheck;
  uint8_T c3_tp_Sink25;
  uint8_T c3_tp_OcculusionCheck;
  uint8_T c3_tp_Sink23;
  uint8_T c3_tp_HighInfusionRateCheck;
  uint8_T c3_tp_SinkTWO;
  uint8_T c3_tp_Controller;
  uint8_T c3_tp_Normal;
  uint8_T c3_tp_DoorOpenCheck;
  uint8_T c3_tp_Sink22;
  uint8_T c3_b_tp_Normal;
  uint8_T c3_tp_s1;
  uint8_T c3_tp_ReservoirEmptyCheck;
  uint8_T c3_tp_Sink21;
  uint8_T c3_tp_LTwo;
  uint8_T c3_tp_MemoryCheck;
  uint8_T c3_tp_CPUCheck;
  uint8_T c3_tp_VoltageCheck;
  uint8_T c3_tp_RTCCheck;
  uint8_T c3_tp_FlowRateStabilityCheck;
  uint8_T c3_c_tp_Normal;
  uint8_T c3_tp_InfusionPauseDurationCheck;
  uint8_T c3_tp_Checking;
  uint8_T c3_tp_CheckLTwo;
  uint8_T c3_tp_Sink27;
  uint8_T c3_tp_AirInLineCheck;
  uint8_T c3_tp_Sink29;
  uint8_T c3_tp_Sink28;
  uint8_T c3_tp_LOne;
  uint8_T c3_tp_PumpTempCheck;
  uint8_T c3_tp_s2;
  uint8_T c3_tp_L1Sink;
  uint8_T c3_tp_BatteryDepletionCheck;
  uint8_T c3_tp_HoldOn;
  uint8_T c3_tp_CheckReady;
  uint8_T c3_b_tp_PumpTempCheck;
  uint8_T c3_tp_EnvTempCheck;
  uint8_T c3_tp_APErrCheck;
  boolean_T c3_isStable;
  uint8_T c3_is_active_c3_GPCA_Extension;
  uint8_T c3_is_c3_GPCA_Extension;
  uint8_T c3_is_active_WRN;
  uint8_T c3_is_WRN;
  uint8_T c3_is_active_Controller;
  uint8_T c3_is_Controller;
  uint8_T c3_is_active_LTwo;
  uint8_T c3_is_LTwo;
  uint8_T c3_is_active_LOne;
  uint8_T c3_is_LOne;
  uint8_T c3_is_active_CheckReady;
  uint8_T c3_is_CheckReady;
  uint32_T c3_LOneCond;
  uint32_T c3_LTwoCond;
  uint32_T c3_WnCond;
  uint32_T c3_MSG_BLANK;
  boolean_T c3_temp;
  SimStruct *S;
  ChartInfoStruct chartInfo;
  uint32_T chartNumber;
  uint32_T instanceNumber;
  uint8_T c3_doSetSimStateSideEffects;
  const mxArray *c3_setSimStateSideEffectsInfo;
} SFc3_GPCA_ExtensionInstanceStruct;

/* Named Constants */

/* Variable Declarations */

/* Variable Definitions */

/* Function Declarations */
extern const mxArray *sf_c3_GPCA_Extension_get_eml_resolved_functions_info(void);

/* Function Definitions */
extern void sf_c3_GPCA_Extension_get_check_sum(mxArray *plhs[]);
extern void c3_GPCA_Extension_method_dispatcher(SimStruct *S, int_T method, void
  *data);

#endif
