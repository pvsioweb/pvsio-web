#ifndef websocket_server_h
#define websocket_server_h

#include "libwebsockets.h"

/** 
 * WebSocket Server Received (WSSReceive) is periodically invoked by Simulink 
 * to check for new incoming messages from the GPCA-UI
 */
extern int WebsocketServer(
					
					/* input variables */
                    const double Aget,
                    const double Vget,
                    /* output variables */
                    int* AP,
                    int* VP
                    );



enum ControllerState { 
    CTRL_NULL                       = -1,
    PowerOff                        = 1,
    CONFIRM_POWER_DOWN              = 2,
    POWER_ON_SELF_TEST              = 3,
    POST_FAILED                     = 4,
    CHECK_ADMIN_SET                 = 5,
    INCORRECT_ADMIN_SETUP           = 6,
    CHECK_PRIME                     = 7,
    PRIME_FAILED                    = 8, 
    DISPLAY_DRUG_INFORMATION        = 9,
    CHECK_DRUG_TYPE                 = 10,
    UNKNOWN_DRUG                    = 11,    
    CHECK_DOSE_UNIT                 = 12,
    INCORRECT_DOSE_UNIT             = 13,
    CHECK_CONCENTRATION             = 14,
    CONC_HARD_LIMITS_VIOLATED       = 15,
    CONC_SOFT_LIMITS_VIOLATED       = 16,
    /* where is state 17? */
    DISPLAY_PATIENT_PROFILE         = 18,
    DISPLAY_VTBI                    = 19,   
    CHANGE_VTBI                     = 20,
    CHECK_VTBI                      = 21,
    VTBI_HARD_LIMITS_VIOLATED       = 22,
    DISPLAY_DOSE_RATE               = 23,
    CHANGE_DOSE_RATE                = 24,
    CHECK_DOSE_RATE                 = 25,
    DOSE_RATE_HARD_LIMITS_VIOLATED  = 26,
    DISPLAY_SETTINGS                = 27,
    INFUSION_NORMAL_OPERATION       = 28,
    BOLUS_REQUEST                   = 29,
    CHANGE_DOSE_RATE_WHEN_INFUSING  = 30,
    CHECK_NEW_DOSE_RATE             = 31,
    NEW_DOSE_RATE_OUT_OF_BOUNDS     = 32,
    STOP_PAUSE                      = 33,
    CONFIRM_PAUSE                   = 34,
    CONFIRM_STOP                    = 35,
    INFUSION_PAUSED                 = 36,
    INFUSION_PAUSED_TOO_LONG        = 37,
    PAUSED_STOP_CONFIRM             = 38,
    INFUSION_STOPPED                = 39,
    EMPTY_RESERVOIR                 = 40,
    CHECK_DRUG_WHEN_INFUSING        = 41,
    WRONG_DRUG_DURING_INFUSION      = 42,
    HARDWARE_FAILURE_LEVEL_ONE      = 43,
    FAILURE_LEVEL_TWO               = 44,  
    POST_SUCCESSFUL                 = 45,  
    VTBI_SOFT_LIMITS_VIOLATED       = 46,
    DOSE_RATE_SOFT_LIMITS_VIOLATED  = 47,
    READY_TO_START                  = 48 
};

enum ControllerEvent { 
    E_NULL = 0, 
	E_StartStop_Simulation, 
    E_PowerButton, 
    E_StartNewInfusion, 
    E_CheckAdminSet, 
    E_PrimePump,
	E_CheckDrug, 
    E_ConfigureInfusionProgram, 
    E_ConfigureConcentration, 
    E_ConfirmDoseRate, 
    E_ConfirmVTBI,
	E_StartInfusion, 
    E_ChangeDoseRate, 
    E_ChangeVTBI, 
    E_PauseInfusion, 
    E_ConfirmPauseInfusion, 
	E_StopInfusion, 
    E_ConfirmStopInfusion, 
    E_RequestBolus, 
    E_ClearAlarm, 
    E_ConfirmPowerDown,
	E_Cancel 
};

#endif

int open_websocket();
int indexOf_shift();
int indexOf();
