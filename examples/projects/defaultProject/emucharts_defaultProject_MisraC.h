/**---------------------------------------------------------------
*   Model: emucharts_defaultProject_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/


typedef double D_64;
typedef unsigned char UC_8;
#define true 1
#define false 0
#define TRUE 1
#define FALSE 0

/** 
 * Enumeration of state labels.
 */
typedef enum {
    INFUSING_BATT,INFUSING_MAINS,OFF,ON
} MachineState;
/** 
 * constants variables 
 */
extern const D_64 bat_max;
extern const D_64 bat_min;
extern const D_64 infusemin;
extern const D_64 maxinfuse;
extern const D_64 maxrate;
extern const D_64 maxtime;
extern const D_64 shorttime;
extern const D_64 timeout;
 
/**
 * Structure containing labelled states and variables
 */
typedef struct{ 
    UC_8 ac_connect;
    D_64 battery;
    D_64 elapse;
    D_64 elapsedtime;
    UC_8 infusing;
    D_64 infusionrate;
    UC_8 kvoflag;
    D_64 kvorate;
    UC_8 powered_on;
    UC_8 set_fitted;
    D_64 time;
    D_64 volumeinfused;
    D_64 vtbi;
    MachineState current_state;  //  Predefined variable for current state.
    MachineState previous_state;  //  Predefined variable for previous state.
} state;

/** 'Enter' auxiliary function.
 *    \param newStateLabel label to update the current state.
 *    \param st state structure pointer
 *    \return void
 *    \sa leave()
 */
void enter(MachineState newStateLabel, state *st);
/** 'Leave' auxiliary function.
 *    \param currentStateLabel label to update the previous state.
 *    \param st state structure pointer
 *    \return void
 *    \sa enter()
 */
void leave(MachineState currentStateLabel, state *st);

/** Initialiser.
 *    \param st state structure pointer
 *    \return state structure
 */
state init(state *st);

/** on transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "OFF" to "ON" when condition [! st->powered_on] holds,
 *
 *     from "ON" to "OFF" when condition [st->powered_on] holds
 *
 *    
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("OFF" or "ON" )
 *    \post function is moving to the right state ("ON" or "OFF" )
 */
state on(state *st);

/** pause transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "INFUSING_BATT" to "ON" when condition [( st->infusing ) && ( st->powered_on )] holds,
 *
 *     from "INFUSING_MAINS" to "ON" when condition [( st->infusing ) && ( st->powered_on )] holds
 *
 *    
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("INFUSING_BATT" or "INFUSING_MAINS" )
 *    \post function is moving to the right state ("ON" )
 */
state pause(state *st);

/** start transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "ON" to "INFUSING_BATT" when condition [( ! st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi != 0 ) )] holds,
 *
 *     from "ON" to "INFUSING_BATT" when condition [( ! st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi == 0 ) )] holds,
 *
 *     from "ON" to "INFUSING_BATT" when condition [( ! st->ac_connect ) && ( ! st->kvoflag ) && ( ( st->vtbi != 0 ) )] holds,
 *
 *     from "ON" to "INFUSING_MAINS" when condition [( st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi != 0 ) )] holds,
 *
 *     from "ON" to "INFUSING_MAINS" when condition [( st->ac_connect ) && ( st->kvoflag ) && ( ( st->vtbi == 0 ) )] holds,
 *
 *     from "ON" to "INFUSING_MAINS" when condition [( st->ac_connect ) && ( ! st->kvoflag ) && ( ( st->vtbi != 0 ) )] holds,
 *
 *     from "ON" to "ON" when condition [( ! st->kvoflag ) && ( ( ( st->vtbi == 0 ) ) || ( ( st->infusionrate == 0 ) ) )] holds
 *
 *    
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("ON" )
 *    \post function is moving to the right state ("INFUSING_BATT" or "INFUSING_MAINS" or "ON" )
 */
state start(state *st);

/** tick transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "INFUSING_MAINS" to "INFUSING_BATT" when condition [! st->ac_connect] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_MAINS" when condition [st->ac_connect] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 == 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( ! st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery - 1 > 0 ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate == 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery < st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 < maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate <= maxinfuse )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate < st->vtbi ) && ( st->ac_connect ) && ( st->infusionrate > 0 ) && ( st->battery == st->max_bat ) && ( st->elapsedtime + 1 == maxtime ) && ( st->volumeinfused + st->infusionrate > maxinfuse )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi <= maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime < maxtime - 1 ) && ( st->infusionrate >= infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( ( st->battery - 1 ) > 0 )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( ! st->ac_connect ) && ( st->battery == 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( ! st->kvoflag ) && ( st->volumeinfused + st->vtbi > maxinfuse ) && ( st->elapsedtime >= maxtime - 1 ) && ( st->infusionrate < infusemin ) && ( st->ac_connect ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery - 1 > 0 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery <= 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery - 1 > 0 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery <= 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate <= maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery - 1 > 0 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery <= 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 < maxtime ) && ( st->battery == st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery - 1 > 0 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery < st->max_bat )] holds,
 *
 *     from "INFUSING_BATT" to "INFUSING_BATT" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery <= 1 )] holds,
 *
 *     from "INFUSING_MAINS" to "INFUSING_MAINS" when condition [( st->infusing ) && ( st->infusionrate >= st->vtbi ) && ( st->kvoflag ) && ( st->volumeinfused + st->kvorate > maxinfuse ) && ( st->elapsedtime + 1 == maxtime ) && ( st->battery == st->max_bat )] holds
 *
 *    
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("INFUSING_MAINS" or "INFUSING_BATT" )
 *    \post function is moving to the right state ("INFUSING_BATT" or "INFUSING_MAINS" )
 */
state tick(state *st);


/** on permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "OFF" or "ON")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_on(const state *st);

/** pause permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "INFUSING_BATT" or "INFUSING_MAINS")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_pause(const state *st);

/** start permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "ON")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_start(const state *st);

/** tick permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "INFUSING_MAINS" or "INFUSING_BATT")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_tick(const state *st);



/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

