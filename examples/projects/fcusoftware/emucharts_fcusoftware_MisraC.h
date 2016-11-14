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
 
/**
 * Structure containing labelled states and variables
 */
typedef struct{ 
    integer data_entry.decimalDigits;
    C_8 data_entry.display[STRING_LENGTH];
    D_64 data_entry.dispval;
    nat data_entry.integerDigits;
    C_8 data_entry.msg[STRING_LENGTH];
    UC_8 data_entry.pointEntered;
    D_64 data_entry.programmedValue;
    UnitsType data_entry.units;
    UC_8 editbox_selected;
    UI_32 elapse;
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

/** click_CLR transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_CLR(state *st);

/** click_digit_0 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_0(state *st);

/** click_digit_1 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_1(state *st);

/** click_digit_2 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_2(state *st);

/** click_digit_3 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_3(state *st);

/** click_digit_4 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_4(state *st);

/** click_digit_5 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_5(state *st);

/** click_digit_6 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_6(state *st);

/** click_digit_7 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_7(state *st);

/** click_digit_8 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_8(state *st);

/** click_digit_9 transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_digit_9(state *st);

/** click_editbox_pressure transition function.
 *    It changes state from "QNH" to "EDIT_PRESSURE" when condition [! st->editbox_selected] holds.
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("QNH")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_editbox_pressure(state *st);

/** click_ESC transition function.
 *    It changes state from "EDIT_PRESSURE" to "QNH".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("QNH")
 */
state click_ESC(state *st);

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
 *    \return state structure
 *    \pre function is called from the right state ("QNH" or "EDIT_PRESSURE" or "STD" )
 *    \post function is moving to the right state ("QNH" or "EDIT_PRESSURE" or "STD" )
 */
state click_hPa(state *st);

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
 *    \return state structure
 *    \pre function is called from the right state ("QNH" or "EDIT_PRESSURE" or "STD" )
 *    \post function is moving to the right state ("QNH" or "EDIT_PRESSURE" or "STD" )
 */
state click_inHg(state *st);

/** click_OK transition function.
 *    It changes state from "EDIT_PRESSURE" to "QNH".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("QNH")
 */
state click_OK(state *st);

/** click_point transition function.
 *    It changes state from "EDIT_PRESSURE" to "EDIT_PRESSURE".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE")
 *    \post function is moving to the right state ("EDIT_PRESSURE")
 */
state click_point(state *st);

/** click_QNH_RADIO transition function.
 *    It changes state from "STD" to "QNH".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("STD")
 *    \post function is moving to the right state ("QNH")
 */
state click_QNH_RADIO(state *st);

/** click_STD_RADIO transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "QNH" to "STD" when condition [st->data_entry.units == st->hPa] holds,
 *
 *     from "QNH" to "STD" when condition [st->data_entry.units == st->inHg] holds
 *
 *    
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("QNH" )
 *    \post function is moving to the right state ("STD" )
 */
state click_STD_RADIO(state *st);

/** tick transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "EDIT_PRESSURE" to "QNH" when condition [st->elapse == 0] holds,
 *
 *     from "EDIT_PRESSURE" to "EDIT_PRESSURE" when condition [st->elapse > 0] holds
 *
 *    
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("EDIT_PRESSURE" )
 *    \post function is moving to the right state ("QNH" or "EDIT_PRESSURE" )
 */
state tick(state *st);


/** click_CLR permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_CLR(const state *st);

/** click_digit_0 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_0(const state *st);

/** click_digit_1 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_1(const state *st);

/** click_digit_2 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_2(const state *st);

/** click_digit_3 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_3(const state *st);

/** click_digit_4 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_4(const state *st);

/** click_digit_5 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_5(const state *st);

/** click_digit_6 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_6(const state *st);

/** click_digit_7 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_7(const state *st);

/** click_digit_8 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_8(const state *st);

/** click_digit_9 permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_digit_9(const state *st);

/** click_editbox_pressure permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "QNH")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_editbox_pressure(const state *st);

/** click_ESC permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_ESC(const state *st);

/** click_hPa permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "QNH" or "EDIT_PRESSURE" or "STD")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_hPa(const state *st);

/** click_inHg permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "QNH" or "EDIT_PRESSURE" or "STD")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_inHg(const state *st);

/** click_OK permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_OK(const state *st);

/** click_point permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_point(const state *st);

/** click_QNH_RADIO permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "STD")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_QNH_RADIO(const state *st);

/** click_STD_RADIO permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "QNH")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_STD_RADIO(const state *st);

/** tick permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "EDIT_PRESSURE")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_tick(const state *st);



/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

