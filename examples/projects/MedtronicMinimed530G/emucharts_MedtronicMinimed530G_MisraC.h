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

/** 
 * Enumeration of state labels.
 */
typedef enum {
    off,on
} MachineState;
 
/**
 * Structure containing labelled states and variables
 */
typedef struct{ 
    D_64 display;
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

/** click_DOWN transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "on" to "on" when condition [st->display == 0] holds,
 *
 *     from "on" to "on" when condition [st->display > 0] holds
 *
 *    
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("on" )
 *    \post function is moving to the right state ("on" )
 */
state click_DOWN(state *st);

/** click_UP transition function.
 * This function is generated merging two or more triggers with the same name.
 *    It changes state from "on" to "on" when condition [st->display < 10] holds,
 *
 *     from "on" to "on" when condition [st->display == 10] holds
 *
 *    
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("on" )
 *    \post function is moving to the right state ("on" )
 */
state click_UP(state *st);

/** tick transition function.
 *    It changes state from "off" to "on".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("off")
 *    \post function is moving to the right state ("on")
 */
state tick(state *st);

/** turn_off transition function.
 *    It changes state from "on" to "off".
 *    \param st state structure pointer
 *    \return state structure
 *    \pre function is called from the right state ("on")
 *    \post function is moving to the right state ("off")
 */
state turn_off(state *st);


/** click_DOWN permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "on")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_DOWN(const state *st);

/** click_UP permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "on")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_click_UP(const state *st);

/** tick permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "off")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_tick(const state *st);

/** turn_off permission function for transition.
 * Use to check if functions can be performed, it controls if the current state is eligible.
 * (i.e., current state is "on")
 *    \param st state structure pointer
 *    \return boolean
 */
UC_8 per_turn_off(const state *st);



/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

