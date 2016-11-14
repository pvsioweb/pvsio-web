/**---------------------------------------------------------------
*   Model: emucharts_MedtronicMinimed530G_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/

#include "Android_emucharts_MedtronicMinimed530G_MisraC.h"
#include <assert.h>

#ifdef DEBUG
#include <stdio.h>
#define debug_print(fmt, args...) \
        do { fprintf(stderr, "%s:%d:%s(): " fmt, \
                __FILE__, __LINE__, __FUNCTION__, ##args); } while (0)
#endif
/**
 * Global variables
 */

static D_64 display;
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
    display = 0.0f;
    enter(off, st);
    
    assert ( current_state == off );
    return;
}

/* definition of transition functions */
JNIEXPORT void JNICALL click_DOWN(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  on );

    if ( (current_state == on) && (st->display == 0) ) {
        leave(on, st);
        st->display = 10.0f;
#ifdef DEBUG        
        debug_print("Action st->display = 10.0f issued.\n");
#endif       
        enter(on, st);
        assert( current_state == on );
        return;
    }
    if ( (current_state == on) && (st->display > 0) ) {
        leave(on, st);
        st->display = st->display - 0.1f;
#ifdef DEBUG        
        debug_print("Action st->display = st->display - 0.1f issued.\n");
#endif       
        enter(on, st);
        assert( current_state == on );
        return;
    }
    return;
}

JNIEXPORT void JNICALL click_UP(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state ==  on );

    if ( (current_state == on) && (st->display < 10) ) {
        leave(on, st);
        st->display = st->display + 0.1f;
#ifdef DEBUG        
        debug_print("Action st->display = st->display + 0.1f issued.\n");
#endif       
        enter(on, st);
        assert( current_state == on );
        return;
    }
    if ( (current_state == on) && (st->display == 10) ) {
        leave(on, st);
        st->display = 0.0f;
#ifdef DEBUG        
        debug_print("Action st->display = 0.0f issued.\n");
#endif       
        enter(on, st);
        assert( current_state == on );
        return;
    }
    return;
}

JNIEXPORT void JNICALL tick(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == off);
    leave(off, st);
  
    enter(on, st);
    assert( current_state == on );
    return;
}

JNIEXPORT void JNICALL turn_off(JNIEnv *env, jobject callingObject, jobject obj) {
    assert( current_state == on);
    leave(on, st);
  
    enter(off, st);
    assert( current_state == off );
    return;
}


/* definition of permission function for transition functions */
JNIEXPORT jboolean JNICALL per_click_DOWN(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  on ){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_click_UP(JNIEnv *env, jobject callingObject, jobject obj) {
    if ( current_state ==  on ){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_tick(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == off){
        return true;
    }
    return false;
}

JNIEXPORT jboolean JNICALL per_turn_off(JNIEnv *env, jobject callingObject, jobject obj) {
    if (current_state == on){
        return true;
    }
    return false;
}


/* definition of utility functions */
JNIEXPORT D_64 JNICALL Get_1display(JNIEnv *env, jobject callingObject)
{
    return display;
}


/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

