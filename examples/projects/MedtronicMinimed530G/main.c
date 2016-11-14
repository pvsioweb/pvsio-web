/**---------------------------------------------------------------
*   Model: emucharts_MedtronicMinimed530G_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/

#include "emucharts_MedtronicMinimed530G_MisraC.h"
#include <stdio.h>
#include <string.h>
#define NUM_OF_FUNC 4


int main(){
    UC_8 *MachineState[] = { (UC_8*)"off", (UC_8*)"on" };   // Useful for printf()
    /*
     * At first instantiate state variable and call init() in order to initialise it as follow: 
     */
    state s;
    init(&s);
    printf("Initialised, current state: %s \n-------\n", MachineState[s.current_state]);
    
    /*
     * Example generated in order to call all the functions
     * with the use of a menu to select the required function
     * (this example uses the standard output stream, it is illustrative purposes only)
     */
     
    char *function_name[] = { "click_DOWN", "click_UP", "tick", "turn_off" };   ///< Useful for printf()
    int t, i;
    printf("List of functions name\n");
    for(i = 1; i <= NUM_OF_FUNC; i++){
        printf("%d - %s\n", i, function_name[i-1]);
    }
     while(1){    
        printf("Enter number of transition to be issued (enter 0 to exit): ");
        if( scanf("%d",&t) != 1 ){
            fprintf( stderr, "Expected a numbers as input\n");
            return 1;
        }
        t--;
        printf("\n");
        if ( (t < 0) || (t >= NUM_OF_FUNC) ){
            printf("Wrong input\n");
            return 1;
        }
        /*
        * It's recommended to call permission function before issuing the transition function as follow
        */
        else if (strcmp(function_name[t], "click_DOWN") == 0){
            if (per_click_DOWN(&s)){
                click_DOWN(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_UP") == 0){
            if (per_click_UP(&s)){
                click_UP(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "tick") == 0){
            if (per_tick(&s)){
                tick(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "turn_off") == 0){
            if (per_turn_off(&s)){
                turn_off(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
         
        else{
            return 1;
        }
    }    
    return 0;
}

/** ---------------------------------------------------------------
*   C code generated using PVSio-web MisraCPrinter ver 1.0
*   Tool freely available at http://www.pvsioweb.org
*  --------------------------------------------------------------*/

