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
#include <jni.h>

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

/** 'Enter' auxiliary function.
 *    \param newStateLabel label to update the current state.
 *    \param st state structure pointer
 *    \return void
 *    \sa leave()
 */
void enter(const MachineState newStateLabel);
/** 'Leave' auxiliary function.
 *    \param currentStateLabel label to update the previous state.
 *    \param st state structure pointer
 *    \return void
 *    \sa enter()
 */
void leave(const MachineState currentStateLabel);

/** Initialiser.
 *    \param st state structure pointer
 *    \return void 
 */
JNIEXPORT void JNICALL init(JNIEnv *env,jobject callingObject,jobject obj);

/** on transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "OFF" to "ON" when condition [! st->powered_on] holds,
 *
 *     from "ON" to "OFF" when condition [st->powered_on] holds
 *
 *    
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("OFF" or "ON" )
 *    \post function is moving to the right state ("ON" or "OFF" )
 */
JNIEXPORT void JNICALL on(JNIEnv *env, jobject callingObject, jobject obj);

/** pause transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "INFUSING_BATT" to "ON" when condition [( st->infusing ) && ( st->powered_on )] holds,
 *
 *     from "INFUSING_MAINS" to "ON" when condition [( st->infusing ) && ( st->powered_on )] holds
 *
 *    
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("INFUSING_BATT" or "INFUSING_MAINS" )
 *    \post function is moving to the right state ("ON" )
 */
JNIEXPORT void JNICALL pause(JNIEnv *env, jobject callingObject, jobject obj);

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
 *    \return void
 *    \pre function is called from the right state ("ON" )
 *    \post function is moving to the right state ("INFUSING_BATT" or "INFUSING_MAINS" or "ON" )
 */
JNIEXPORT void JNICALL start(JNIEnv *env, jobject callingObject, jobject obj);

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
 *    \return void
 *    \pre function is called from the right state ("INFUSING_MAINS" or "INFUSING_BATT" )
 *    \post function is moving to the right state ("INFUSING_BATT" or "INFUSING_MAINS" )
 */
JNIEXPORT void JNICALL tick(JNIEnv *env, jobject callingObject, jobject obj);


/** on permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "OFF" or "ON")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_on(JNIEnv *env, jobject callingObject, jobject obj);

/** pause permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "INFUSING_BATT" or "INFUSING_MAINS")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_pause(JNIEnv *env, jobject callingObject, jobject obj);

/** start permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "ON")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_start(JNIEnv *env, jobject callingObject, jobject obj);

/** tick permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "INFUSING_MAINS" or "INFUSING_BATT")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_tick(JNIEnv *env, jobject callingObject, jobject obj);


/* definition of utility functions */
/** Get ac_connect function.
 *    \return UC_8
 */
JNIEXPORT UC_8 JNICALL Get_1ac_connect(JNIEnv *env, jobject callingObject);

/** Get battery function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1battery(JNIEnv *env, jobject callingObject);

/** Get elapse function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1elapse(JNIEnv *env, jobject callingObject);

/** Get elapsedtime function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1elapsedtime(JNIEnv *env, jobject callingObject);

/** Get infusing function.
 *    \return UC_8
 */
JNIEXPORT UC_8 JNICALL Get_1infusing(JNIEnv *env, jobject callingObject);

/** Get infusionrate function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1infusionrate(JNIEnv *env, jobject callingObject);

/** Get kvoflag function.
 *    \return UC_8
 */
JNIEXPORT UC_8 JNICALL Get_1kvoflag(JNIEnv *env, jobject callingObject);

/** Get kvorate function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1kvorate(JNIEnv *env, jobject callingObject);

/** Get powered_on function.
 *    \return UC_8
 */
JNIEXPORT UC_8 JNICALL Get_1powered_on(JNIEnv *env, jobject callingObject);

/** Get set_fitted function.
 *    \return UC_8
 */
JNIEXPORT UC_8 JNICALL Get_1set_fitted(JNIEnv *env, jobject callingObject);

/** Get time function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1time(JNIEnv *env, jobject callingObject);

/** Get volumeinfused function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1volumeinfused(JNIEnv *env, jobject callingObject);

/** Get vtbi function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1vtbi(JNIEnv *env, jobject callingObject);



/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

