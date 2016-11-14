/**---------------------------------------------------------------
*   Model: emucharts_MedtronicMinimed530G_MisraC
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
    off,on
} MachineState;

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

/** click_DOWN transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "on" to "on" when condition [st->display == 0] holds,
 *
 *     from "on" to "on" when condition [st->display > 0] holds
 *
 *    
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("on" )
 *    \post function is moving to the right state ("on" )
 */
JNIEXPORT void JNICALL click_DOWN(JNIEnv *env, jobject callingObject, jobject obj);

/** click_UP transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "on" to "on" when condition [st->display < 10] holds,
 *
 *     from "on" to "on" when condition [st->display == 10] holds
 *
 *    
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("on" )
 *    \post function is moving to the right state ("on" )
 */
JNIEXPORT void JNICALL click_UP(JNIEnv *env, jobject callingObject, jobject obj);

/** tick transition function.
 *    It changes state from "off" to "on".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("off")
 *    \post function is moving to the right state ("on")
 */
JNIEXPORT void JNICALL tick(JNIEnv *env, jobject callingObject, jobject obj);

/** turn_off transition function.
 *    It changes state from "on" to "off".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("on")
 *    \post function is moving to the right state ("off")
 */
JNIEXPORT void JNICALL turn_off(JNIEnv *env, jobject callingObject, jobject obj);


/** click_DOWN permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "on")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_DOWN(JNIEnv *env, jobject callingObject, jobject obj);

/** click_UP permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "on")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_UP(JNIEnv *env, jobject callingObject, jobject obj);

/** tick permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "off")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_tick(JNIEnv *env, jobject callingObject, jobject obj);

/** turn_off permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "on")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_turn_off(JNIEnv *env, jobject callingObject, jobject obj);


/* definition of utility functions */
/** Get display function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1display(JNIEnv *env, jobject callingObject);



/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

