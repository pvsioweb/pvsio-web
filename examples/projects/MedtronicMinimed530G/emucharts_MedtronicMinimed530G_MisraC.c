/**---------------------------------------------------------------
*   Model: emucharts_MedtronicMinimed530G_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/

#include "emucharts_MedtronicMinimed530G_MisraC.h"
#include <assert.h>

#ifdef DEBUG
#include <stdio.h>
#define debug_print(fmt, args...) \
        do { fprintf(stderr, "%s:%d:%s(): " fmt, \
                __FILE__, __LINE__, __FUNCTION__, ##args); } while (0)
#endif

/* definition of auxiliary functions */
void enter(MachineState newStateLabel, state *st) {
#ifdef DEBUG
    debug_print("Entering state nr. '%u'.\n", newStateLabel);
#endif
    st->current_state = newStateLabel;
}
void leave(MachineState currentStateLabel, state *st) {
#ifdef DEBUG    
    debug_print("Leaving state nr. '%u'.\n", currentStateLabel);
#endif    
    st->previous_state = currentStateLabel;
}

/* definition of initialisation function */
state init(state *st){
#ifdef DEBUG    
    debug_print("Initialisation of state variables.\n");
#endif    
    st->display = 0.0f;
    enter(off, st);
    
    assert ( st->current_state == off );
    return *st;
}

/* definition of transition functions */
state click_DOWN(state *st) {
    assert( st->current_state ==  on );

    if ( (st->current_state == on) && (st->display == 0) ) {
        leave(on, st);
        st->display = 10.0f;
#ifdef DEBUG        
        debug_print("Action st->display = 10.0f issued.\n");
#endif       
        enter(on, st);
        assert( st->current_state == on );
        return *st;
    }
    if ( (st->current_state == on) && (st->display > 0) ) {
        leave(on, st);
        st->display = st->display - 0.1f;
#ifdef DEBUG        
        debug_print("Action st->display = st->display - 0.1f issued.\n");
#endif       
        enter(on, st);
        assert( st->current_state == on );
        return *st;
    }
    return *st;
}

state click_UP(state *st) {
    assert( st->current_state ==  on );

    if ( (st->current_state == on) && (st->display < 10) ) {
        leave(on, st);
        st->display = st->display + 0.1f;
#ifdef DEBUG        
        debug_print("Action st->display = st->display + 0.1f issued.\n");
#endif       
        enter(on, st);
        assert( st->current_state == on );
        return *st;
    }
    if ( (st->current_state == on) && (st->display == 10) ) {
        leave(on, st);
        st->display = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->display = 0.0f issued.\n");
#endif       
        enter(on, st);
        assert( st->current_state == on );
        return *st;
    }
    return *st;
}

state tick(state *st) {
    assert( st->current_state == off);
    leave(off, st);
  
    enter(on, st);
    assert( st->current_state == on );
    return *st;
}

state turn_off(state *st) {
    assert( st->current_state == on);
    leave(on, st);
  
    enter(off, st);
    assert( st->current_state == off );
    return *st;
}


/* definition of permission function for transition functions */
UC_8 per_click_DOWN(const state *st) {
    if (st->current_state ==  on ){
        return true;
    }
    return false;
}

UC_8 per_click_UP(const state *st) {
    if (st->current_state ==  on ){
        return true;
    }
    return false;
}

UC_8 per_tick(const state *st) {
    if (st->current_state == off){
        return true;
    }
    return false;
}

UC_8 per_turn_off(const state *st) {
    if (st->current_state == on){
        return true;
    }
    return false;
}


/**
 * \example emucharts_MedtronicMinimed530G_MisraC.c
 * \example main.c
 * An example to test the C code generated.
 */
 
/*! \page table_transitions Table of transitions
<table>
<tr><th>Transition name<th>Current state<th>Next state<th>Condition<th>Action
<tr><td rowspan="2">click_DOWN<td>on<td>on<td>st->display == 0<td>st->display = 10.0f<br> 
<tr><td>on<td>on<td>st->display > 0<td>st->display = st->display - 0.1f<br> 
<tr><td rowspan="2">click_UP<td>on<td>on<td>st->display < 10<td>st->display = st->display + 0.1f<br> 
<tr><td>on<td>on<td>st->display == 10<td>st->display = 0.0f<br> 
<tr><td>tick<td>off<td>on<td><td>
<tr><td>turn_off<td>on<td>off<td><td>

</table>
*/


/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

