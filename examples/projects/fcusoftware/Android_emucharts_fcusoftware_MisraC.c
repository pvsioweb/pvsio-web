/**---------------------------------------------------------------
*   Model: emucharts_fcusoftware_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/

#include "Android_emucharts_fcusoftware_MisraC.h"
#include <assert.h>

#ifdef DEBUG
#include <stdio.h>
#define debug_print(fmt, args...) \
        do { fprintf(stderr, "%s:%d:%s(): " fmt, \
                __FILE__, __LINE__, __FUNCTION__, ##args); } while (0)
#endif
/* constants variables */
const UI_32 MAX_ELAPSE = 60u;
/**
 * Global variables
 */

static integer data_entry.decimalDigits;
static C_8 data_entry.display[STRING_LENGTH];
static D_64 data_entry.dispval;
static nat data_entry.integerDigits;
static C_8 data_entry.msg[STRING_LENGTH];
static UC_8 data_entry.pointEntered;
static D_64 data_entry.programmedValue;
static UnitsType data_entry.units;
static UC_8 editbox_selected;
static UI_32 elapse;
static MachineState current_state;  //  Predefined variable for current state.
static MachineState previous_state;  //  Predefined variable for previous state.


/* definition of auxiliary functions */
void enter(const MachineState newStateLabel) {
#ifdef DEBUG
    debug_print("Entering state nr. '%u'.\n", newStateLabel);
#endif
    current_state = newStateLabel;
}
void leave(const MachineState currentStateLabel) {
#ifdef DEBUG    
    debug_print("Leaving state nr. '%u'.\n", currentStateLabel);
#endif    
    previous_state = currentStateLabel;
}

/* definition of initialisation function */
JNIEXPORT void JNICALL init(JNIEnv *env,jobject callingObject,jobject obj){
#ifdef DEBUG    
    debug_print("Initialisation of state variables.\n");
#endif    
    data_entry.decimalDigits = 0;
    strcpy(st->data_entry.display, "STD_INHG");
    data_entry.dispval = STD_INHG;
    data_entry.integerDigits = 0;
    strcpy(st->data_entry.msg, """");
    data_entry.pointEntered = FALSE;
    data_entry.programmedValue = STD_INHG;
    data_entry.units = inHg;
    editbox_selected = FALSE;
    elapse = MAX_ELAPSE;
    enter(STD, st);
    
    assert ( current_state == STD );
    return;
}

/* definition of transition functions */
JNIEXPORT void JNICALL click_CLR(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_0(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_1(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_2(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_3(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_4(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_5(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_6(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_7(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_8(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_digit_9(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_editbox_pressure(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == QNH);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_ESC(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == QNH );
    return;
}

JNIEXPORT void JNICALL click_hPa(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  QNH || current_state ==  EDIT_PRESSURE || current_state ==  STD );

    if ( (current_state == QNH) && (st->data_entry.units != st->hPa) ) {
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
        assert( current_state == QNH );
        return;
    }
    if ( (current_state == EDIT_PRESSURE) && (st->data_entry.units != st->hPa) ) {
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
        assert( current_state == EDIT_PRESSURE );
        return;
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
        assert( current_state == STD );
        return;
    return;
}

JNIEXPORT void JNICALL click_inHg(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  QNH || current_state ==  EDIT_PRESSURE || current_state ==  STD );

    if ( (current_state == QNH) && (st->data_entry.units != st->inHg) ) {
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
        assert( current_state == QNH );
        return;
    }
    if ( (current_state == EDIT_PRESSURE) && (st->data_entry.units != st->inHg) ) {
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
        assert( current_state == EDIT_PRESSURE );
        return;
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
        assert( current_state == STD );
        return;
    return;
}

JNIEXPORT void JNICALL click_OK(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == QNH );
    return;
}

JNIEXPORT void JNICALL click_point(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == EDIT_PRESSURE);
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
    assert( current_state == EDIT_PRESSURE );
    return;
}

JNIEXPORT void JNICALL click_QNH_RADIO(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == STD);
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
    assert( current_state == QNH );
    return;
}

JNIEXPORT void JNICALL click_STD_RADIO(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  QNH );

    if ( (current_state == QNH) && (st->data_entry.units == st->hPa) ) {
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
        assert( current_state == STD );
        return;
    }
    if ( (current_state == QNH) && (st->data_entry.units == st->inHg) ) {
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
        assert( current_state == STD );
        return;
    }
    return;
}

JNIEXPORT void JNICALL tick(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  EDIT_PRESSURE );

    if ( (current_state == EDIT_PRESSURE) && (st->elapse == 0) ) {
        leave(EDIT_PRESSURE, st);
        st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object];
#ifdef DEBUG        
        debug_print("Action st->data_entry = [object Object],[object Object],[object Object],[object Object],[object Object],[object Object] issued.\n");
#endif       
        enter(QNH, st);
        assert( current_state == QNH );
        return;
    }
    if ( (current_state == EDIT_PRESSURE) && (st->elapse > 0) ) {
        leave(EDIT_PRESSURE, st);
        st->elapse = st->elapse - 1u;
#ifdef DEBUG        
        debug_print("Action st->elapse = st->elapse - 1u issued.\n");
#endif       
        enter(EDIT_PRESSURE, st);
        assert( current_state == EDIT_PRESSURE );
        return;
    }
    return;
}


/* definition of permission function for transition functions */
JNIEXPORT jboolean JNICALL per_click_CLR(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_0(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_1(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_2(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_3(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_4(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_5(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_6(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_7(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_8(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_digit_9(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_editbox_pressure(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == QNH){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_ESC(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_hPa(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  QNH ||  current_state ==  EDIT_PRESSURE ||  current_state ==  STD ){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_inHg(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  QNH ||  current_state ==  EDIT_PRESSURE ||  current_state ==  STD ){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_OK(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_point(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == EDIT_PRESSURE){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_QNH_RADIO(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == STD){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_STD_RADIO(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  QNH ){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_tick(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  EDIT_PRESSURE ){
        return true;
    }
    return false;
}


/* definition of utility functions */
JNIEXPORT integer JNICALL Get_1data_entry.decimalDigits(JNIEnv *env, jobject callingObject)
{
    return data_entry.decimalDigits;
}
JNIEXPORT C_8 JNICALL Get_1data_entry.display(JNIEnv *env, jobject callingObject)
{
    return data_entry.display;
}
JNIEXPORT D_64 JNICALL Get_1data_entry.dispval(JNIEnv *env, jobject callingObject)
{
    return data_entry.dispval;
}
JNIEXPORT nat JNICALL Get_1data_entry.integerDigits(JNIEnv *env, jobject callingObject)
{
    return data_entry.integerDigits;
}
JNIEXPORT C_8 JNICALL Get_1data_entry.msg(JNIEnv *env, jobject callingObject)
{
    return data_entry.msg;
}
JNIEXPORT UC_8 JNICALL Get_1data_entry.pointEntered(JNIEnv *env, jobject callingObject)
{
    return data_entry.pointEntered;
}
JNIEXPORT D_64 JNICALL Get_1data_entry.programmedValue(JNIEnv *env, jobject callingObject)
{
    return data_entry.programmedValue;
}
JNIEXPORT UnitsType JNICALL Get_1data_entry.units(JNIEnv *env, jobject callingObject)
{
    return data_entry.units;
}
JNIEXPORT UC_8 JNICALL Get_1editbox_selected(JNIEnv *env, jobject callingObject)
{
    return editbox_selected;
}
JNIEXPORT UI_32 JNICALL Get_1elapse(JNIEnv *env, jobject callingObject)
{
    return elapse;
}


/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

