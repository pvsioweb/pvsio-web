/**---------------------------------------------------------------
*   Model: emucharts_fcusoftware_MisraC
*   Author: <author name>
*           <affiliation>
*           <contact>
*  ---------------------------------------------------------------*/

#include "emucharts_fcusoftware_MisraC.h"
#include <stdio.h>
#include <string.h>
#define NUM_OF_FUNC 20


int main(){
    UC_8 *MachineState[] = { (UC_8*)"EDIT_PRESSURE", (UC_8*)"QNH", (UC_8*)"STD" };   // Useful for printf()
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
     
    char *function_name[] = { "click_CLR", "click_digit_0", "click_digit_1", "click_digit_2", "click_digit_3", "click_digit_4", "click_digit_5", "click_digit_6", "click_digit_7", "click_digit_8", "click_digit_9", "click_editbox_pressure", "click_ESC", "click_hPa", "click_inHg", "click_OK", "click_point", "click_QNH_RADIO", "click_STD_RADIO", "tick" };   ///< Useful for printf()
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
        else if (strcmp(function_name[t], "click_CLR") == 0){
            if (per_click_CLR(&s)){
                click_CLR(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_0") == 0){
            if (per_click_digit_0(&s)){
                click_digit_0(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_1") == 0){
            if (per_click_digit_1(&s)){
                click_digit_1(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_2") == 0){
            if (per_click_digit_2(&s)){
                click_digit_2(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_3") == 0){
            if (per_click_digit_3(&s)){
                click_digit_3(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_4") == 0){
            if (per_click_digit_4(&s)){
                click_digit_4(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_5") == 0){
            if (per_click_digit_5(&s)){
                click_digit_5(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_6") == 0){
            if (per_click_digit_6(&s)){
                click_digit_6(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_7") == 0){
            if (per_click_digit_7(&s)){
                click_digit_7(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_8") == 0){
            if (per_click_digit_8(&s)){
                click_digit_8(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_digit_9") == 0){
            if (per_click_digit_9(&s)){
                click_digit_9(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_editbox_pressure") == 0){
            if (per_click_editbox_pressure(&s)){
                click_editbox_pressure(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_ESC") == 0){
            if (per_click_ESC(&s)){
                click_ESC(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_hPa") == 0){
            if (per_click_hPa(&s)){
                click_hPa(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_inHg") == 0){
            if (per_click_inHg(&s)){
                click_inHg(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_OK") == 0){
            if (per_click_OK(&s)){
                click_OK(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_point") == 0){
            if (per_click_point(&s)){
                click_point(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_QNH_RADIO") == 0){
            if (per_click_QNH_RADIO(&s)){
                click_QNH_RADIO(&s);
                printf("Press %s: current state: %s previous state: %s \n", function_name[t], MachineState[s.current_state], MachineState[s.previous_state]);
            }
            else{
                printf("Permission to %s function denied\n", function_name[t]);
            }
        }
        else if (strcmp(function_name[t], "click_STD_RADIO") == 0){
            if (per_click_STD_RADIO(&s)){
                click_STD_RADIO(&s);
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

