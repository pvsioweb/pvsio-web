/**---------------------------------------------------------------
*   Model: emucharts_fcusoftware_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/

#include "emucharts_fcusoftware_MisraC.h"
#include <assert.h>

#ifdef DEBUG
#include <stdio.h>
#define debug_print(fmt, args...) \
        do { fprintf(stderr, "%s:%d:%s(): " fmt, \
                __FILE__, __LINE__, __FUNCTION__, ##args); } while (0)
#endif
/* constants variables */
const UI_32 MAX_ELAPSE = 60u;

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
    st->data_entry.decimalDigits = 0;
    strcpy(st->data_entry.display, "STD_INHG");
    st->data_entry.dispval = STD_INHG;
    st->data_entry.integerDigits = 0;
    strcpy(st->data_entry.msg, """");
    st->data_entry.pointEntered = FALSE;
    st->data_entry.programmedValue = STD_INHG;
    st->data_entry.units = inHg;
    st->editbox_selected = FALSE;
    st->elapse = MAX_ELAPSE;
    enter(STD, st);
    
    assert ( st->current_state == STD );
    return *st;
}

/* definition of transition functions */
state click_CLR(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_0(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_1(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_2(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_3(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_4(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_5(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_6(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_7(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_8(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_digit_9(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_editbox_pressure(state *st) {
    assert( st->current_state == QNH);
    if (! st->editbox_selected) {
        leave(QNH, st);
        st->editbox_selected = TRUE;
#ifdef DEBUG        
        debug_print("Action st->editbox_selected = TRUE issued.\n");
#endif
        st->elapse = MAX_ELAPSE;
#ifdef DEBUG        
        debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
        st->data_entry = [object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object] issued.\n");
#endif       
        enter(EDIT_PRESSURE, st);
    }
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_ESC(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->editbox_selected = FALSE;
#ifdef DEBUG    
    debug_print("Action st->editbox_selected = FALSE issued.\n");
#endif
  
    enter(QNH, st);
    assert( st->current_state == QNH );
    return *st;
}

state click_hPa(state *st) {
    assert( st->current_state ==  QNH || st->current_state ==  EDIT_PRESSURE || st->current_state ==  STD );

    if ( (st->current_state == QNH) && (st->data_entry.units != st->hPa) ) {
        leave(QNH, st);
        st->data_entry.units = st->hPa;
#ifdef DEBUG        
        debug_print("Action st->data_entry.units = st->hPa issued.\n");
#endif 
        st->data_entry.dispval = st->data_entry.programmedValue * 33.86f;
#ifdef DEBUG        
        debug_print("Action st->data_entry.dispval = st->data_entry.programmedValue * 33.86f issued.\n");
#endif 
        st->data_entry.display = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry.display = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif 
        st->data_entry.programmedValue = st->data_entry.programmedValue * 33.86f;
#ifdef DEBUG        
        debug_print("Action st->data_entry.programmedValue = st->data_entry.programmedValue * 33.86f issued.\n");
#endif       
        enter(QNH, st);
        assert( st->current_state == QNH );
        return *st;
    }
    if ( (st->current_state == EDIT_PRESSURE) && (st->data_entry.units != st->hPa) ) {
        leave(EDIT_PRESSURE, st);
        st->data_entry.units = st->hPa;
#ifdef DEBUG        
        debug_print("Action st->data_entry.units = st->hPa issued.\n");
#endif 
        st->data_entry.programmedValue = st->data_entry.programmedValue * 33.86f;
#ifdef DEBUG        
        debug_print("Action st->data_entry.programmedValue = st->data_entry.programmedValue * 33.86f issued.\n");
#endif       
        enter(EDIT_PRESSURE, st);
        assert( st->current_state == EDIT_PRESSURE );
        return *st;
    }
    if (current_state == STD) {
        leave(STD, st);
        st->data_entry.units = st->hPa;
#ifdef DEBUG        
        debug_print("Action st->data_entry.units = st->hPa issued.\n");
#endif
        st->data_entry.programmedValue = st->STD_HPA;
#ifdef DEBUG        
        debug_print("Action st->data_entry.programmedValue = st->STD_HPA issued.\n");
#endif
        st->data_entry.dispval = st->STD_HPA;
#ifdef DEBUG        
        debug_print("Action st->data_entry.dispval = st->STD_HPA issued.\n");
#endif
        st->data_entry.display = [object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry.display = [object Object],[object Object],[object Object],[object Object] issued.\n");
#endif       
        enter(STD, st);
        assert( st->current_state == STD );
        return *st;
    return *st;
}

state click_inHg(state *st) {
    assert( st->current_state ==  QNH || st->current_state ==  EDIT_PRESSURE || st->current_state ==  STD );

    if ( (st->current_state == QNH) && (st->data_entry.units != st->inHg) ) {
        leave(QNH, st);
        st->data_entry.units = st->inHg;
#ifdef DEBUG        
        debug_print("Action st->data_entry.units = st->inHg issued.\n");
#endif 
        st->data_entry.dispval = st->data_entry.programmedValue / 33.86f;
#ifdef DEBUG        
        debug_print("Action st->data_entry.dispval = st->data_entry.programmedValue / 33.86f issued.\n");
#endif 
        st->data_entry.display = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry.display = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif 
        st->data_entry.programmedValue = st->data_entry.programmedValue / 33.86f;
#ifdef DEBUG        
        debug_print("Action st->data_entry.programmedValue = st->data_entry.programmedValue / 33.86f issued.\n");
#endif       
        enter(QNH, st);
        assert( st->current_state == QNH );
        return *st;
    }
    if ( (st->current_state == EDIT_PRESSURE) && (st->data_entry.units != st->inHg) ) {
        leave(EDIT_PRESSURE, st);
        st->data_entry.units = st->inHg;
#ifdef DEBUG        
        debug_print("Action st->data_entry.units = st->inHg issued.\n");
#endif 
        st->data_entry.programmedValue = st->data_entry.programmedValue / 33.46f;
#ifdef DEBUG        
        debug_print("Action st->data_entry.programmedValue = st->data_entry.programmedValue / 33.46f issued.\n");
#endif       
        enter(EDIT_PRESSURE, st);
        assert( st->current_state == EDIT_PRESSURE );
        return *st;
    }
    if (current_state == STD) {
        leave(STD, st);
        st->data_entry.units = st->inHg;
#ifdef DEBUG        
        debug_print("Action st->data_entry.units = st->inHg issued.\n");
#endif
        st->data_entry.programmedValue = st->STD_INHG;
#ifdef DEBUG        
        debug_print("Action st->data_entry.programmedValue = st->STD_INHG issued.\n");
#endif
        st->data_entry.dispval = st->STD_INHG;
#ifdef DEBUG        
        debug_print("Action st->data_entry.dispval = st->STD_INHG issued.\n");
#endif
        st->data_entry.display = [object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry.display = [object Object],[object Object],[object Object],[object Object] issued.\n");
#endif       
        enter(STD, st);
        assert( st->current_state == STD );
        return *st;
    return *st;
}

state click_OK(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->editbox_selected = FALSE;
#ifdef DEBUG    
    debug_print("Action st->editbox_selected = FALSE issued.\n");
#endif
  
    enter(QNH, st);
    assert( st->current_state == QNH );
    return *st;
}

state click_point(state *st) {
    assert( st->current_state == EDIT_PRESSURE);
    leave(EDIT_PRESSURE, st);
    st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
    st->elapse = MAX_ELAPSE;
#ifdef DEBUG    
    debug_print("Action st->elapse = MAX_ELAPSE issued.\n");
#endif
  
    enter(EDIT_PRESSURE, st);
    assert( st->current_state == EDIT_PRESSURE );
    return *st;
}

state click_QNH_RADIO(state *st) {
    assert( st->current_state == STD);
    leave(STD, st);
    st->data_entry.dispval = st->data_entry.programmedValue;
#ifdef DEBUG    
    debug_print("Action st->data_entry.dispval = st->data_entry.programmedValue issued.\n");
#endif
    st->data_entry.display = [object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG    
    debug_print("Action st->data_entry.display = [object Object],[object Object],[object Object],[object Object] issued.\n");
#endif
  
    enter(QNH, st);
    assert( st->current_state == QNH );
    return *st;
}

state click_STD_RADIO(state *st) {
    assert( st->current_state ==  QNH );

    if ( (st->current_state == QNH) && (st->data_entry.units == st->hPa) ) {
        leave(QNH, st);
        st->data_entry.programmedValue = st->STD_HPA;
#ifdef DEBUG        
        debug_print("Action st->data_entry.programmedValue = st->STD_HPA issued.\n");
#endif 
        st->data_entry.dispval = st->STD_HPA;
#ifdef DEBUG        
        debug_print("Action st->data_entry.dispval = st->STD_HPA issued.\n");
#endif 
        st->data_entry.display = [object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry.display = [object Object],[object Object],[object Object],[object Object] issued.\n");
#endif       
        enter(STD, st);
        assert( st->current_state == STD );
        return *st;
    }
    if ( (st->current_state == QNH) && (st->data_entry.units == st->inHg) ) {
        leave(QNH, st);
        st->data_entry.programmedValue = st->STD_INHG;
#ifdef DEBUG        
        debug_print("Action st->data_entry.programmedValue = st->STD_INHG issued.\n");
#endif 
        st->data_entry.dispval = st->STD_INHG;
#ifdef DEBUG        
        debug_print("Action st->data_entry.dispval = st->STD_INHG issued.\n");
#endif 
        st->data_entry.display = [object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry.display = [object Object],[object Object],[object Object],[object Object] issued.\n");
#endif       
        enter(STD, st);
        assert( st->current_state == STD );
        return *st;
    }
    return *st;
}

state tick(state *st) {
    assert( st->current_state ==  EDIT_PRESSURE );

    if ( (st->current_state == EDIT_PRESSURE) && (st->elapse == 0) ) {
        leave(EDIT_PRESSURE, st);
        st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif       
        enter(QNH, st);
        assert( st->current_state == QNH );
        return *st;
    }
    if ( (st->current_state == EDIT_PRESSURE) && (st->elapse > 0) ) {
        leave(EDIT_PRESSURE, st);
        st->elapse = st->elapse - 1u;
#ifdef DEBUG        
        debug_print("Action st->elapse = st->elapse - 1u issued.\n");
#endif       
        enter(EDIT_PRESSURE, st);
        assert( st->current_state == EDIT_PRESSURE );
        return *st;
    }
    return *st;
}


/* definition of permission function for transition functions */
UC_8 per_click_CLR(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_0(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_1(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_2(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_3(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_4(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_5(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_6(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_7(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_8(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_digit_9(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_editbox_pressure(const state *st) {
    if (st->current_state == QNH){
        return true;
    }
    return false;
}

UC_8 per_click_ESC(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_hPa(const state *st) {
    if (st->current_state ==  QNH || st->current_state ==  EDIT_PRESSURE || st->current_state ==  STD ){
        return true;
    }
    return false;
}

UC_8 per_click_inHg(const state *st) {
    if (st->current_state ==  QNH || st->current_state ==  EDIT_PRESSURE || st->current_state ==  STD ){
        return true;
    }
    return false;
}

UC_8 per_click_OK(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_point(const state *st) {
    if (st->current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

UC_8 per_click_QNH_RADIO(const state *st) {
    if (st->current_state == STD){
        return true;
    }
    return false;
}

UC_8 per_click_STD_RADIO(const state *st) {
    if (st->current_state ==  QNH ){
        return true;
    }
    return false;
}

UC_8 per_tick(const state *st) {
    if (st->current_state ==  EDIT_PRESSURE ){
        return true;
    }
    return false;
}


/**
 * \example emucharts_fcusoftware_MisraC.c
 * \example main.c
 * An example to test the C code generated.
 */
 
/*! \page table_transitions Table of transitions
<table>
<tr><th>Transition name<th>Current state<th>Next state<th>Condition<th>Action
<tr><td>click_CLR<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_0<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_1<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_2<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_3<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_4<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_5<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_6<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_7<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_8<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_digit_9<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_editbox_pressure<td>QNH<td>EDIT_PRESSURE<td>! st->editbox_selected<td>st->editbox_selected = TRUE<br> st->elapse = MAX_ELAPSE<br> st->data_entry = [object Object],[object Object],[object Object],[object Object]<br> 
<tr><td>click_ESC<td>EDIT_PRESSURE<td>QNH<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->editbox_selected = FALSE<br> 
<tr><td rowspan="3">click_hPa<td>QNH<td>QNH<td>st->data_entry.units != st->hPa<td>st->data_entry.units = st->hPa<br> st->data_entry.dispval = st->data_entry.programmedValue * 33.86f<br> st->data_entry.display = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->data_entry.programmedValue = st->data_entry.programmedValue * 33.86f<br> 
<tr><td>EDIT_PRESSURE<td>EDIT_PRESSURE<td>st->data_entry.units != st->hPa<td>st->data_entry.units = st->hPa<br> st->data_entry.programmedValue = st->data_entry.programmedValue * 33.86f<br> 
<tr><td>STD<td>STD<td><td>st->data_entry.units = st->hPa<br> st->data_entry.programmedValue = st->STD_HPA<br> st->data_entry.dispval = st->STD_HPA<br> st->data_entry.display = [object Object],[object Object],[object Object],[object Object]<br> 
<tr><td rowspan="3">click_inHg<td>QNH<td>QNH<td>st->data_entry.units != st->inHg<td>st->data_entry.units = st->inHg<br> st->data_entry.dispval = st->data_entry.programmedValue / 33.86f<br> st->data_entry.display = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->data_entry.programmedValue = st->data_entry.programmedValue / 33.86f<br> 
<tr><td>EDIT_PRESSURE<td>EDIT_PRESSURE<td>st->data_entry.units != st->inHg<td>st->data_entry.units = st->inHg<br> st->data_entry.programmedValue = st->data_entry.programmedValue / 33.46f<br> 
<tr><td>STD<td>STD<td><td>st->data_entry.units = st->inHg<br> st->data_entry.programmedValue = st->STD_INHG<br> st->data_entry.dispval = st->STD_INHG<br> st->data_entry.display = [object Object],[object Object],[object Object],[object Object]<br> 
<tr><td>click_OK<td>EDIT_PRESSURE<td>QNH<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->editbox_selected = FALSE<br> 
<tr><td>click_point<td>EDIT_PRESSURE<td>EDIT_PRESSURE<td><td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> st->elapse = MAX_ELAPSE<br> 
<tr><td>click_QNH_RADIO<td>STD<td>QNH<td><td>st->data_entry.dispval = st->data_entry.programmedValue<br> st->data_entry.display = [object Object],[object Object],[object Object],[object Object]<br> 
<tr><td rowspan="2">click_STD_RADIO<td>QNH<td>STD<td>st->data_entry.units == st->hPa<td>st->data_entry.programmedValue = st->STD_HPA<br> st->data_entry.dispval = st->STD_HPA<br> st->data_entry.display = [object Object],[object Object],[object Object],[object Object]<br> 
<tr><td>QNH<td>STD<td>st->data_entry.units == st->inHg<td>st->data_entry.programmedValue = st->STD_INHG<br> st->data_entry.dispval = st->STD_INHG<br> st->data_entry.display = [object Object],[object Object],[object Object],[object Object]<br> 
<tr><td rowspan="2">tick<td>EDIT_PRESSURE<td>QNH<td>st->elapse == 0<td>st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object]<br> 
<tr><td>EDIT_PRESSURE<td>EDIT_PRESSURE<td>st->elapse > 0<td>st->elapse = st->elapse - 1u<br> 

</table>
*/


/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

