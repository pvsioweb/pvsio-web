/**---------------------------------------------------------------
*   Model: emucharts_fcusoftware_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/


#include <string.h>
typedef char C_8;
typedef double D_64;
typedef unsigned int UI_32;
typedef unsigned char UC_8;
#define true 1
#define false 0
#define TRUE 1
#define FALSE 0
#define STRING_LENGTH 8
#include <jni.h>

/** 
 * Enumeration of state labels.
 */
typedef enum {
    EDIT_PRESSURE,QNH,STD
} MachineState;
/** 
 * constants variables 
 */
extern const UI_32 MAX_ELAPSE;

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

/** click_CLR transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_CLR(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_0 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_0(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_1 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_1(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_2 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_2(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_3 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_3(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_4 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_4(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_5 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_5(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_6 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_6(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_7 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_7(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_8 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_8(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_9 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_digit_9(JNIEnv *env, jobject callingObject, jobject obj);

/** click_editbox_pressure transition function.
 *    It changes state from "QNH" to "EDIT_PRESSURE" when condition [! st->editbox_selected] holds.
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("QNH")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_editbox_pressure(JNIEnv *env, jobject callingObject, jobject obj);

/** click_ESC transition function.
 *    It changes state from "EDIT_PRESSURE" to "QNH".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("QNH")
 */
JNIEXPORT void JNICALL click_ESC(JNIEnv *env, jobject callingObject, jobject obj);

/** click_hPa transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "QNH" to "QNH" when condition [st->data_entry.units != st->hPa] holds,
 *
 *     from "EDIT_PRESSURE" to "EDIT_PRESSURE" when condition [st->data_entry.units != st->hPa] holds,
 *
 *     from "STD" to "STD"
 *
 *    
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("QNH" or "EDIT_PRESSURE" or "STD" )
 *    \post function is moving to the right state ("QNH" or "EDIT_PRESSURE" or "STD" )
 */
JNIEXPORT void JNICALL click_hPa(JNIEnv *env, jobject callingObject, jobject obj);

/** click_inHg transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "QNH" to "QNH" when condition [st->data_entry.units != st->inHg] holds,
 *
 *     from "EDIT_PRESSURE" to "EDIT_PRESSURE" when condition [st->data_entry.units != st->inHg] holds,
 *
 *     from "STD" to "STD"
 *
 *    
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("QNH" or "EDIT_PRESSURE" or "STD" )
 *    \post function is moving to the right state ("QNH" or "EDIT_PRESSURE" or "STD" )
 */
JNIEXPORT void JNICALL click_inHg(JNIEnv *env, jobject callingObject, jobject obj);

/** click_OK transition function.
 *    It changes state from "EDIT_PRESSURE" to "QNH".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("QNH")
 */
JNIEXPORT void JNICALL click_OK(JNIEnv *env, jobject callingObject, jobject obj);

/** click_point transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
JNIEXPORT void JNICALL click_point(JNIEnv *env, jobject callingObject, jobject obj);

/** click_QNH_RADIO transition function.
 *    It changes state from "STD" to "QNH".
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("STD")
 *    \post function is moving to the right state ("QNH")
 */
JNIEXPORT void JNICALL click_QNH_RADIO(JNIEnv *env, jobject callingObject, jobject obj);

/** click_STD_RADIO transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "QNH" to "STD" when condition [st->data_entry.units == st->hPa] holds,
 *
 *     from "QNH" to "STD" when condition [st->data_entry.units == st->inHg] holds
 *
 *    
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("QNH" )
 *    \post function is moving to the right state ("STD" )
 */
JNIEXPORT void JNICALL click_STD_RADIO(JNIEnv *env, jobject callingObject, jobject obj);

/** tick transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "EDIT_PRESSURE" to "QNH" when condition [st->elapse == 0] holds,
 *
 *     from "EDIT_PRESSURE" to "EDIT_PRESSURE" when condition [st->elapse > 0] holds
 *
 *    
 *    \param st state structure pointer
 *    \return void
 *    \pre function is called from the right state ("EDIT_PRESSURE" )
 *    \post function is moving to the right state ("QNH" or "EDIT_PRESSURE" )
 */
JNIEXPORT void JNICALL tick(JNIEnv *env, jobject callingObject, jobject obj);


/** click_CLR permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_CLR(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_0 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_0(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_1 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_1(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_2 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_2(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_3 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_3(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_4 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_4(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_5 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_5(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_6 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_6(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_7 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_7(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_8 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_8(JNIEnv *env, jobject callingObject, jobject obj);

/** click_digit_9 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_digit_9(JNIEnv *env, jobject callingObject, jobject obj);

/** click_editbox_pressure permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "QNH")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_editbox_pressure(JNIEnv *env, jobject callingObject, jobject obj);

/** click_ESC permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_ESC(JNIEnv *env, jobject callingObject, jobject obj);

/** click_hPa permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "QNH" or "EDIT_PRESSURE" or "STD")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_hPa(JNIEnv *env, jobject callingObject, jobject obj);

/** click_inHg permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "QNH" or "EDIT_PRESSURE" or "STD")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_inHg(JNIEnv *env, jobject callingObject, jobject obj);

/** click_OK permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_OK(JNIEnv *env, jobject callingObject, jobject obj);

/** click_point permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_point(JNIEnv *env, jobject callingObject, jobject obj);

/** click_QNH_RADIO permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "STD")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_QNH_RADIO(JNIEnv *env, jobject callingObject, jobject obj);

/** click_STD_RADIO permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "QNH")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_click_STD_RADIO(JNIEnv *env, jobject callingObject, jobject obj);

/** tick permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
JNIEXPORT jboolean JNICALL per_tick(JNIEnv *env, jobject callingObject, jobject obj);


/* definition of utility functions */
/** Get data_entry.decimalDigits function.
 *    \return integer
 */
JNIEXPORT integer JNICALL Get_1data_entry.decimalDigits(JNIEnv *env, jobject callingObject);

/** Get data_entry.display function.
 *    \return C_8
 */
JNIEXPORT C_8 JNICALL Get_1data_entry.display(JNIEnv *env, jobject callingObject);

/** Get data_entry.dispval function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1data_entry.dispval(JNIEnv *env, jobject callingObject);

/** Get data_entry.integerDigits function.
 *    \return nat
 */
JNIEXPORT nat JNICALL Get_1data_entry.integerDigits(JNIEnv *env, jobject callingObject);

/** Get data_entry.msg function.
 *    \return C_8
 */
JNIEXPORT C_8 JNICALL Get_1data_entry.msg(JNIEnv *env, jobject callingObject);

/** Get data_entry.pointEntered function.
 *    \return UC_8
 */
JNIEXPORT UC_8 JNICALL Get_1data_entry.pointEntered(JNIEnv *env, jobject callingObject);

/** Get data_entry.programmedValue function.
 *    \return D_64
 */
JNIEXPORT D_64 JNICALL Get_1data_entry.programmedValue(JNIEnv *env, jobject callingObject);

/** Get data_entry.units function.
 *    \return UnitsType
 */
JNIEXPORT UnitsType JNICALL Get_1data_entry.units(JNIEnv *env, jobject callingObject);

/** Get editbox_selected function.
 *    \return UC_8
 */
JNIEXPORT UC_8 JNICALL Get_1editbox_selected(JNIEnv *env, jobject callingObject);

/** Get elapse function.
 *    \return UI_32
 */
JNIEXPORT UI_32 JNICALL Get_1elapse(JNIEnv *env, jobject callingObject);



/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

