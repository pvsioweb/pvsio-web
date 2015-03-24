function varargout = GPCA_UI(varargin)
% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;


gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @GPCA_UI_OpeningFcn, ...
                   'gui_OutputFcn',  @GPCA_UI_OutputFcn, ...
                   'gui_LayoutFcn',  [] , ...
                   'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
% End initialization code - DO NOT EDIT


% --- Executes just before GPCA_UI is made visible.
function GPCA_UI_OpeningFcn(hObject, eventdata, handles, varargin)
%%Choose default command line output for GPCA_UI
handles.output = hObject;

%%Constants and Variables definition.

%%States defined in the GPCA state controller. The states are defined as
%%constants, since Simulink (and Stateflow) does not support the String
%%data type. The constants assigned here correspond to the state
%%definitions in the GPCA state model for the sake of consistency. 
handles.POWER_DOWN                      = 1;
handles.CONFIRM_POWER_DOWN              = 2;
handles.POWER_ON_SELF_TEST              = 3;
handles.POST_FAILED                     = 4;
handles.CHECK_ADMIN_SET                 = 5;
handles.INCORRECT_ADMIN_SETUP           = 6;
handles.CHECK_PRIME                     = 7;
handles.PRIME_FAILED                    = 8; 
handles.DISPLAY_DRUG_INFORMATION        = 9;
handles.CHECK_DRUG_TYPE                 = 10;
handles.UNKNOWN_DRUG                    = 11;    
handles.CHECK_DOSE_UNIT                 = 12;
handles.INCORRECT_DOSE_UNIT             = 13;
handles.CHECK_CONCENTRATION             = 14;
handles.CONC_HARD_LIMITS_VIOLATED       = 15;
handles.CONC_SOFT_LIMITS_VIOLATED       = 16;
handles.DISPLAY_PATIENT_PROFILE         = 18;
handles.DISPLAY_VTBI                    = 19;   
handles.CHANGE_VTBI                     = 20;
handles.CHECK_VTBI                      = 21;
handles.VTBI_HARD_LIMITS_VIOLATED       = 22;
handles.DISPLAY_DOSE_RATE               = 23;
handles.CHANGE_DOSE_RATE                = 24;
handles.CHECK_DOSE_RATE                 = 25;
handles.DOSE_RATE_HARD_LIMITS_VIOLATED  = 26;
handles.DISPLAY_SETTINGS                = 27;
handles.INFUSION_NORMAL_OPERATION       = 28;
handles.BOLUS_REQUEST                   = 29;
handles.CHANGE_DOSE_RATE_WHEN_INFUSING  = 30;
handles.CHECK_NEW_DOSE_RATE             = 31;
handles.NEW_DOSE_RATE_OUT_OF_BOUNDS     = 32;
handles.STOP_PAUSE                      = 33;
handles.CONFIRM_PAUSE                   = 34;
handles.CONFIRM_STOP                    = 35;
handles.INFUSION_PAUSED                 = 36;
handles.INFUSION_PAUSED_TOO_LONG        = 37;
handles.PAUSED_STOP_CONFIRM             = 38;
handles.INFUSION_STOPPED                = 39;
handles.EMPTY_RESERVOIR                 = 40;
handles.CHECK_DRUG_WHEN_INFUSING        = 41;
handles.WRONG_DRUG_DURING_INFUSION      = 42;
handles.HARDWARE_FAILURE_LEVEL_ONE      = 43;
handles.FAILURE_LEVEL_TWO               = 44;  
handles.POST_SUCCESSFUL                 = 45;  
handles.VTBI_SOFT_LIMITS_VIOLATED       = 46;
handles.DOSE_RATE_SOFT_LIMITS_VIOLATED  = 47;
handles.READY_TO_START                  = 48;
handles.NULL                            = -1;

%%Additonal variables defined and associated with the GUI handles
%%structure.  
%%The variable GCurrState represents the current state that the
%%GPCA state controller machine is in.
handles.GCurrState      = -1;

%%These variables are used to communicate Simulink/Stateflow information 
%%to the GUI. All variables are initialized to a default value of -1.
handles.GVTBIUH         = -1;
handles.GVTBIUS         = -1;
handles.GVTBITypical    = -1;
handles.GVTBILS         = -1;
handles.GVTBILH         = -1;
handles.GVTBIUnit       = -1;
handles.GDRTypical      = -1;
handles.GDRUH           = -1;
handles.GDRUS           = -1;
handles.GDRLS           = -1;
handles.GDRLH           = -1;
handles.GCurrVTBI       = -1;
handles.GRemainVol      = -1;
handles.GPatientID      = -1;
handles.GPatientAge     = -1;
handles.GPatientGender  = -1;
handles.GPatientWeight  = -1;
handles.GDrugID         = -1;
handles.GDrugConc       = -1;
handles.GDrugDoseUnit   = -1;
handles.GDrugAmount     = -1;
handles.GDrugDilVol     = -1;

% The vector GOutputEvents triggers the various output events, when a button
% is pressed. Each entry in the vector corresponds to a specific button in
% the UI. When a button is pressed, the corresponding entry is set to 1 in
% the vector. The indices in the vector denotes the following buttons:
% 1: Start/Stop Simulation 
% 2: Power button
% 3: New Infusion
% 4: Check Administration Set 
% 5: Prime pump
% 6: Check Drug
% 7: Configure Infusion Program
% 8: Confirm Concentration
% 9: Confirm Dose Rate
% 10: Confirm VTBI
% 11: Start Infusion
% 12: Change Dose Rate
% 13: Change VTBI
% 14: Pause Infusion
% 15: Confirm Pause Infusion
% 16: Stop Infusion
% 17: Confirm Stop Infusion
% 18: Request Bolus
% 19: Clear Alarm
% 20: Confirm Power Down
% 21: Cancel

%%Initialize GOutputEvents
assignin('base', 'GOutputEvents', [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]);


%%Define the initial configuration of the GUI.
%%Set simulation button to on, to indicate that the model is being
%%simulated. All other buttons remain disabled.
set(handles.simulationButton, 'enable', 'on');
set(handles.simulationButton, 'value', 1);

%%Set the UI configuration based on the current state
setConfiguration(handles);
handles.setConfigFcn = @setConfiguration;
%%Associate the handles structure with the GPCA model 
handles.mdl = 'GPCA_Extension'; 
handles.gcbo = '';

%%Update handles structure
guidata(hObject, handles);



% --- Outputs from this function are returned to the command line.
function varargout = GPCA_UI_OutputFcn(hObject, eventdata, handles) 
%%Get default command line output from handles structure
varargout{1} = handles;



% --- Set the configuration of the GUI based on the current state.
function setConfiguration(handles)
%%Disable the simulation button
set(handles.simulationButton, 'enable', 'off');

%%Set the UI configuration.
%%Depending on the value of handles.GCurrState, the corresponding
%%setConfiguration function is invoked
switch handles.GCurrState
	case handles.POWER_DOWN
        setConfigurationToPowerDown(handles);
	case handles.CONFIRM_POWER_DOWN
        setConfigurationToConfirmPowerDown(handles);
	case handles.POWER_ON_SELF_TEST
        setConfigurationToPOST(handles);
    case handles.POST_FAILED
        setConfigurationToPOSTFailed(handles);
    case handles.POST_SUCCESSFUL
        setConfigurationToPOSTSuccessful(handles);
    case handles.CHECK_ADMIN_SET
        setConfigurationToCheckAdminSet(handles);
    case handles.CHECK_PRIME
        setConfigurationToCheckPrime(handles);
    case handles.PRIME_FAILED
        setConfigurationToPrimeFailed(handles);
    case handles.DISPLAY_SETTINGS
        setConfigurationToDisplaySettings(handles);
    case handles.CHECK_DRUG_TYPE
        setConfigurationToCheckDrugType(handles);
    case handles.CHECK_DOSE_UNIT
        setConfigurationToCheckDoseUnit(handles);
    case handles.CHECK_CONCENTRATION
        setConfigurationToCheckConcentration(handles);
    case handles.CHECK_VTBI
        setConfigurationToCheckVTBI(handles);
    case handles.CHANGE_VTBI
        setConfigurationToChangeVTBI(handles);
    case handles.INFUSION_NORMAL_OPERATION
        setConfigurationToInfusion_NormalOperation(handles);
    case handles.CHANGE_DOSE_RATE_WHEN_INFUSING
        setConfigurationToChangeDoseRateWhenInfusing(handles);
    case handles.DISPLAY_DRUG_INFORMATION
        setConfigurationToDisplayDrugInformation(handles);
    case handles.DISPLAY_PATIENT_PROFILE
        setConfigurationToDisplayPatientProfile(handles);
    case handles.DISPLAY_VTBI
        setConfigurationToDisplayVTBI(handles);
    case handles.DISPLAY_DOSE_RATE
        setConfigurationToDisplayDoseRate(handles);
    case handles.CHECK_DRUG_TYPE
        setConfigurationToCheckDrugType(handles);
    case handles.CHECK_DOSE_RATE
        setConfigurationToCheckDoseRate(handles);
    case handles.CHANGE_DOSE_RATE
        setConfigurationToChangeDoseRate(handles);
    case handles.INFUSION_STOPPED
        setConfigurationToInfusionStopped(handles);
    case handles.BOLUS_REQUEST
        setConfigurationToBolusRequest(handles);
    case handles.CHECK_DRUG_WHEN_INFUSING
        setConfigurationToCheckDrugWhenInfusing(handles);
    case handles.CHECK_NEW_DOSE_RATE
        setConfigurationToCheckNewDoseRate(handles);
    case handles.STOP_PAUSE
        setConfigurationToStop_Pause(handles);
    case handles.CONFIRM_STOP
        setConfigurationToConfirmStop(handles);        
    case handles.CONFIRM_PAUSE
        setConfigurationToConfirmPause(handles);
    case handles.INFUSION_PAUSED
        setConfigurationToInfusionPaused(handles);        
    case handles.INFUSION_PAUSED_TOO_LONG
        setConfigurationToInfusionPausedTooLong(handles);        
    case handles.PAUSED_STOP_CONFIRM
        setConfigurationToPausedStopConfirm(handles);        
    case handles.WRONG_DRUG_DURING_INFUSION
        setConfigurationToIncorrectDrug(handles); 
    case handles.INCORRECT_ADMIN_SETUP
        setConfigurationToIncorrectAdminSetup(handles);
    case handles.INCORRECT_DOSE_UNIT
        setConfigurationToIncorrectDoseUnit(handles);
    case handles.UNKNOWN_DRUG
        setConfigurationToUnknownDrug(handles);
    case handles.CONC_HARD_LIMITS_VIOLATED
        setConfigurationToConcentrationHardLimitsViolated(handles);
    case handles.CONC_SOFT_LIMITS_VIOLATED
        setConfigurationToConcentrationSoftLimitsViolated(handles);
    case handles.VTBI_HARD_LIMITS_VIOLATED
        setConfigurationToVTBIHardLimitsViolated(handles);
    case handles.VTBI_SOFT_LIMITS_VIOLATED
        setConfigurationToVTBISoftLimitsViolated(handles);
    case handles.DOSE_RATE_HARD_LIMITS_VIOLATED
        setConfigurationToDoseRateHardLimitsViolated(handles);
    case handles.DOSE_RATE_SOFT_LIMITS_VIOLATED
        setConfigurationToDoseRateSoftLimitsViolated(handles);
    case handles.HARDWARE_FAILURE_LEVEL_ONE
        setConfigurationToLevelOneHardwareFailure(handles);
	case handles.FAILURE_LEVEL_TWO
        setConfigurationToLevelTwoFailure(handles);
	case handles.EMPTY_RESERVOIR
        setConfigurationToEmptyReservoir(handles);
    case handles.NEW_DOSE_RATE_OUT_OF_BOUNDS
        setConfigurationToNewRateOutOfBounds(handles);
    case handles.READY_TO_START
        setConfigurationToReadyToStart(handles);
    otherwise
        % Do nothing.
end;
%%Re-enable the simulation button
set(handles.simulationButton, 'enable', 'on');




% --- Executes on button press in simulationButton.
function simulationButton_Callback(hObject, eventdata, handles)
simButtonValue = get(hObject,'Value');
if simButtonValue == true
    %%Generate an event indicating that the simulation button has been pressed.
    vec = [1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
    assignin('base', 'GOutputEvents', vec);
    
    %%Enable the power button 
    set(handles.powerButton, 'enable', 'on');
    set(handles.button1, 'enable', 'off');
    set(handles.button2, 'enable', 'off');
    set(handles.settingsConsole, 'enable', 'off');
    set(handles.incButton, 'enable', 'off');
    set(handles.decButton, 'enable', 'off');
    set(handles.displayConsole, 'enable', 'off');
    set(handles.doseRequestButton, 'enable', 'off');  
    set_param(handles.mdl,'SimulationCommand','start');
    set_param(handles.mdl,'SimulationCommand','Update')
end;
if simButtonValue == false
    %%Stop the Simulink simulation when simulation mode is turned Off.
    %%Switch the power button to the off position, clear the displayConsole and
    %%disable all user buttons and interfaces
    set(handles.powerButton, 'value', 0);
    set(handles.displayConsole, 'String', '');
    disableAll(handles);
    clearAll(handles);

    %Terminate model simulation
    set_param(handles.mdl,'SimulationCommand','stop');
end;




% --- Executes on button press in powerButton.
function powerButton_Callback(hObject, eventdata, handles)
handles.gcbo = hObject;
set(handles.gcbo,'enable','off');
set(handles.powerButton, 'enable', 'off');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');

set_param(handles.mdl, 'Dirty', 'on');
switch(handles.GCurrState)
    case handles.CONFIRM_POWER_DOWN
    case handles.POWER_ON_SELF_TEST
        %%This should not be possible, as the power button is disabled in these states.
    otherwise
        %%For all other states, generate an event indicating that the power button has been pressed.
        vec = [0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
end;
set_param(handles.mdl,'SimulationCommand','Update');




% --- Executes on button press in button1.
function button1_Callback(hObject, eventdata, handles)
% hObject    handle to button1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.gcbo = hObject;
set(handles.gcbo,'enable','off');
set(handles.powerButton, 'enable', 'off');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set_param(handles.mdl, 'Dirty', 'on');
switch(handles.GCurrState)
    case handles.POWER_DOWN
    case handles.CHECK_NEW_DOSE_RATE
	case handles.POWER_ON_SELF_TEST
	case handles.POST_FAILED
    case handles.CHECK_PRIME
    case handles.CHECK_ADMIN_SET
    case handles.CHECK_DRUG_TYPE
    case handles.CHECK_CONCENTRATION
    case handles.CONC_HARD_LIMITS_VIOLATED 
    case handles.CHECK_DOSE_UNIT
    case handles.VTBI_HARD_LIMITS_VIOLATED
    case handles.CHECK_VTBI
    case handles.CHECK_DOSE_RATE
    case handles.DOSE_RATE_HARD_LIMITS_VIOLATED
    case handles.READY_TO_START
    case handles.BOLUS_REQUEST
    case handles.HARDWARE_FAILURE_LEVEL_ONE
    case handles.CHECK_DRUG_WHEN_INFUSING
        %%Button1 is disabled in these states.
    case handles.CONFIRM_POWER_DOWN
        %E_ConfirmPowerDown
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.POST_SUCCESSFUL
        %E_CheckAdminSet
        vec = [0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.INCORRECT_ADMIN_SETUP
        %E_CheckAdminSet
        vec = [0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.PRIME_FAILED
        %E_Prime
        vec = [0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.DISPLAY_DRUG_INFORMATION
        %E_CheckDrug
        vec = [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.UNKNOWN_DRUG
        %E_CheckDrug
        vec = [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.INCORRECT_DOSE_UNIT
        %E_CheckDrug
        vec = [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
	case handles.CONC_SOFT_LIMITS_VIOLATED
        %E_ConfirmConcentration
        vec = [0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
	case handles.DISPLAY_PATIENT_PROFILE
        %E_ConfigureInfusionProgram
        vec = [0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.DISPLAY_VTBI
        %E_ConfirmVTBI
        vec = [0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CHANGE_VTBI
        %E_ConfirmVTBI
        vec = [0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
	case handles.VTBI_SOFT_LIMITS_VIOLATED
        %E_ConfirmVTBI
        vec = [0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.DISPLAY_DOSE_RATE
        %E_ConfirmDoseRate
        vec = [0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CHANGE_DOSE_RATE
        %E_ConfirmDoseRate
        vec = [0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.DOSE_RATE_SOFT_LIMITS_VIOLATED
        %E_ConfirmDoseRate
        vec = [0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
	case handles.DISPLAY_SETTINGS
        %E_StartInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.INFUSION_NORMAL_OPERATION
        %E_ChangeDoseRate
        vec = [0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.INFUSION_STOPPED
        %E_NewInfusion
        vec = [0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.FAILURE_LEVEL_TWO
        %E_StopInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.EMPTY_RESERVOIR
        %E_StopInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.WRONG_DRUG_DURING_INFUSION
        %E_StopInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CHANGE_DOSE_RATE_WHEN_INFUSING
        %E_ConfirmDoseRate
        vec = [0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.NEW_DOSE_RATE_OUT_OF_BOUNDS
        %E_ChangeDoseRate
        vec = [0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CONFIRM_STOP
        %E_ConfirmStopInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CONFIRM_PAUSE
        %E_ConfirmPauseInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.INFUSION_PAUSED
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.INFUSION_PAUSED_TOO_LONG
        %E_StopInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.PAUSED_STOP_CONFIRM
        %E_ConfirmStopInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
end
set_param(handles.mdl,'SimulationCommand','Update')


% --- Executes on button press in button2.
function button2_Callback(hObject, eventdata, handles)

% hObject    handle to button2 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.gcbo = hObject;
set(handles.gcbo,'enable','off')
set(handles.powerButton, 'enable', 'off');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');

set_param(handles.mdl, 'Dirty', 'on');
switch(handles.GCurrState)
    case handles.POWER_DOWN
	case handles.POWER_ON_SELF_TEST
	case handles.POST_FAILED
    case handles.POST_SUCCESSFUL
    case handles.CHECK_ADMIN_SET
    case handles.INCORRECT_ADMIN_SETUP
    case handles.CHECK_PRIME
    case handles.PRIME_FAILED
    case handles.DISPLAY_DRUG_INFORMATION
    case handles.CHECK_DRUG_TYPE
    case handles.UNKNOWN_DRUG
    case handles.CHECK_DOSE_UNIT
    case handles.INCORRECT_DOSE_UNIT 
    case handles.CHECK_CONCENTRATION
    case handles.CHECK_VTBI
    case handles.CHECK_DOSE_RATE
   	case handles.READY_TO_START
    case handles.INFUSION_STOPPED    
    case handles.BOLUS_REQUEST
    case handles.HARDWARE_FAILURE_LEVEL_ONE
    case handles.CHECK_DRUG_WHEN_INFUSING
    case handles.CHECK_NEW_DOSE_RATE
        %%Button2 is disabled in these states.
    case handles.CONFIRM_POWER_DOWN
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.CONC_HARD_LIMITS_VIOLATED
        %E_CheckDrug
        vec = [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CONC_SOFT_LIMITS_VIOLATED
        %E_CheckDrug
        vec = [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.DISPLAY_PATIENT_PROFILE
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.DISPLAY_VTBI
        %E_ChangeVTBI
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CHANGE_VTBI
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.VTBI_HARD_LIMITS_VIOLATED
        %E_ChangeVTBI
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.VTBI_SOFT_LIMITS_VIOLATED
        %E_ChangeVTBI
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.DISPLAY_DOSE_RATE
        %E_ChangeDoseRate
        vec = [0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CHANGE_DOSE_RATE
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.DOSE_RATE_HARD_LIMITS_VIOLATED
        %E_ChangeDoseRate
        vec = [0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.DOSE_RATE_SOFT_LIMITS_VIOLATED
        %E_ChangeDoseRate
        vec = [0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
	case handles.DISPLAY_SETTINGS
        %E_ConfigureInfusionProgram
        vec = [0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.INFUSION_NORMAL_OPERATION
        %E_PauseInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.FAILURE_LEVEL_TWO
        %E_ClearAlarm
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.EMPTY_RESERVOIR
        %E_CheckDrug
        vec = [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.WRONG_DRUG_DURING_INFUSION
        %E_CheckDrug
        vec = [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.CHANGE_DOSE_RATE_WHEN_INFUSING
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.NEW_DOSE_RATE_OUT_OF_BOUNDS
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.CONFIRM_STOP
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.CONFIRM_PAUSE
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
    case handles.INFUSION_PAUSED
        %E_StopInfusion
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.INFUSION_PAUSED_TOO_LONG
        %E_ClearAlarm
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0];
        assignin('base', 'GOutputEvents', vec);
    case handles.PAUSED_STOP_CONFIRM
        %E_Cancel
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1];
        assignin('base', 'GOutputEvents', vec);
end
set_param(handles.mdl,'SimulationCommand','Update')

% --- Executes on button press in incButton.
function incButton_Callback(hObject, eventdata, handles)
% hObject    handle to incButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.gcbo = hObject;
set(handles.gcbo,'enable','off')
set(handles.powerButton, 'enable', 'off');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');

set_param(handles.mdl, 'Dirty', 'on');
switch(handles.GCurrState)
    case handles.POWER_DOWN
    case handles.CONFIRM_POWER_DOWN
	case handles.POWER_ON_SELF_TEST
	case handles.POST_FAILED
    case handles.POST_SUCCESSFUL
    case handles.CHECK_ADMIN_SET
    case handles.INCORRECT_ADMIN_SETUP
    case handles.CHECK_PRIME
    case handles.PRIME_FAILED
    case handles.DISPLAY_DRUG_INFORMATION
    case handles.CHECK_DRUG_TYPE
    case handles.UNKNOWN_DRUG
    case handles.CHECK_DOSE_UNIT
    case handles.INCORRECT_DOSE_UNIT
    case handles.CHECK_CONCENTRATION
    case handles.CONC_HARD_LIMITS_VIOLATED
    case handles.CONC_SOFT_LIMITS_VIOLATED
    case handles.DISPLAY_PATIENT_PROFILE
    case handles.DISPLAY_VTBI
    case handles.CHECK_VTBI
    case handles.VTBI_HARD_LIMITS_VIOLATED
    case handles.VTBI_SOFT_LIMITS_VIOLATED
    case handles.DISPLAY_DOSE_RATE
    case handles.CHECK_DOSE_RATE
    case handles.DOSE_RATE_HARD_LIMITS_VIOLATED
    case handles.DOSE_RATE_SOFT_LIMITS_VIOLATED
	case handles.DISPLAY_SETTINGS
    case handles.READY_TO_START
    case handles.INFUSION_NORMAL_OPERATION
    case handles.INFUSION_STOPPED    
    case handles.BOLUS_REQUEST
    case handles.HARDWARE_FAILURE_LEVEL_ONE
    case handles.FAILURE_LEVEL_TWO
    case handles.EMPTY_RESERVOIR
    case handles.CHECK_DRUG_WHEN_INFUSING
    case handles.WRONG_DRUG_DURING_INFUSION
    case handles.CHECK_NEW_DOSE_RATE
    case handles.NEW_DOSE_RATE_OUT_OF_BOUNDS
    case handles.STOP_PAUSE
    case handles.CONFIRM_STOP
    case handles.CONFIRM_PAUSE
    case handles.INFUSION_PAUSED
    case handles.INFUSION_PAUSED_TOO_LONG
    case handles.PAUSED_STOP_CONFIRM
        %%incButton is disabled in these states.
    case handles.CHANGE_VTBI
        scValue = str2num(get(handles.settingsConsole, 'String'));
        scValue = scValue + evalin('base', 'GVTBIIncrement');
        set(handles.settingsConsole, 'String', num2str(scValue));
        assignin('base', 'GProgrammedVTBI', scValue);
    case handles.CHANGE_DOSE_RATE
        scValue = str2num(get(handles.settingsConsole, 'String'));
        scValue = scValue + evalin('base', 'GDoseRateIncrement');
        set(handles.settingsConsole, 'String', num2str(scValue));
        assignin('base', 'GProgrammedDoseRate', scValue);
    case handles.CHANGE_DOSE_RATE_WHEN_INFUSING
        scValue = str2num(get(handles.settingsConsole, 'String'));
        scValue = scValue + evalin('base', 'GDoseRateIncrement');
        set(handles.settingsConsole, 'String', num2str(scValue));
        assignin('base', 'GProgrammedDoseRate', scValue);
end
set_param(handles.mdl,'SimulationCommand','Update')

% --- Executes on button press in decButton.
function decButton_Callback(hObject, eventdata, handles)
% hObject    handle to decButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.gcbo = hObject;
set(handles.gcbo,'enable','off')
set(handles.powerButton, 'enable', 'off');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');

set_param(handles.mdl, 'Dirty', 'on');
switch(handles.GCurrState)
    case handles.POWER_DOWN
    case handles.CONFIRM_POWER_DOWN
	case handles.POWER_ON_SELF_TEST
	case handles.POST_FAILED
    case handles.POST_SUCCESSFUL
    case handles.CHECK_ADMIN_SET
    case handles.INCORRECT_ADMIN_SETUP
    case handles.CHECK_PRIME
    case handles.PRIME_FAILED
    case handles.DISPLAY_DRUG_INFORMATION
    case handles.CHECK_DRUG_TYPE
    case handles.UNKNOWN_DRUG
    case handles.CHECK_DOSE_UNIT
    case handles.INCORRECT_DOSE_UNIT    
    case handles.CHECK_CONCENTRATION 
    case handles.CONC_HARD_LIMITS_VIOLATED    
    case handles.CONC_SOFT_LIMITS_VIOLATED
    case handles.DISPLAY_PATIENT_PROFILE
    case handles.DISPLAY_VTBI
    case handles.CHECK_VTBI
    case handles.VTBI_HARD_LIMITS_VIOLATED
    case handles.VTBI_SOFT_LIMITS_VIOLATED
    case handles.DISPLAY_DOSE_RATE
    case handles.CHECK_DOSE_RATE
    case handles.DOSE_RATE_HARD_LIMITS_VIOLATED
    case handles.DOSE_RATE_SOFT_LIMITS_VIOLATED
	case handles.DISPLAY_SETTINGS
    case handles.READY_TO_START
    case handles.INFUSION_NORMAL_OPERATION
    case handles.INFUSION_STOPPED    
    case handles.BOLUS_REQUEST
    case handles.HARDWARE_FAILURE_LEVEL_ONE
    case handles.FAILURE_LEVEL_TWO
    case handles.EMPTY_RESERVOIR
    case handles.CHECK_DRUG_WHEN_INFUSING
    case handles.WRONG_DRUG_DURING_INFUSION
    case handles.CHECK_NEW_DOSE_RATE
    case handles.NEW_DOSE_RATE_OUT_OF_BOUNDS
    case handles.STOP_PAUSE
    case handles.CONFIRM_STOP
    case handles.CONFIRM_PAUSE
    case handles.INFUSION_PAUSED
    case handles.INFUSION_PAUSED_TOO_LONG
    case handles.PAUSED_STOP_CONFIRM
    case handles.CHANGE_VTBI
        scValue = str2num(get(handles.settingsConsole, 'String'));
        scValue = scValue - evalin('base', 'GVTBIIncrement'); 
        if (scValue < 0)
            scValue = 0;
        end
        set(handles.settingsConsole, 'String', num2str(scValue));
        assignin('base', 'GProgrammedVTBI', scValue);
    case handles.CHANGE_DOSE_RATE
        scValue = str2num(get(handles.settingsConsole, 'String'));
        scValue = scValue - evalin('base', 'GDoseRateIncrement');
        if (scValue < 0)
            scValue = 0;
        end
        set(handles.settingsConsole, 'String', num2str(scValue));
        assignin('base', 'GProgrammedDoseRate', scValue);
    case handles.CHANGE_DOSE_RATE_WHEN_INFUSING
        scValue = str2num(get(handles.settingsConsole, 'String'));
        scValue = scValue - evalin('base', 'GDoseRateIncrement');
        if (scValue < 0)
            scValue = 0;
        end
        set(handles.settingsConsole, 'String', num2str(scValue));
        assignin('base', 'GProgrammedDoseRate', scValue);
end
set_param(handles.mdl,'SimulationCommand','Update')


% --- Executes on button press in doseRequestButton.
function doseRequestButton_Callback(hObject, eventdata, handles)
% hObject    handle to doseRequestButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.gcbo = hObject;
set(handles.gcbo,'enable','off')
set(handles.powerButton, 'enable', 'off');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');

set_param(handles.mdl, 'Dirty', 'on');

switch(handles.GCurrState)
    case handles.POWER_DOWN
    case handles.CONFIRM_POWER_DOWN
    case handles.POWER_ON_SELF_TEST
	case handles.POST_FAILED
    case handles.POST_SUCCESSFUL
    case handles.CHECK_ADMIN_SET
    case handles.INCORRECT_ADMIN_SETUP
    case handles.CHECK_PRIME
    case handles.PRIME_FAILED
    case handles.DISPLAY_DRUG_INFORMATION
    case handles.CHECK_DRUG_TYPE
    case handles.UNKNOWN_DRUG
    case handles.CHECK_DOSE_UNIT
    case handles.INCORRECT_DOSE_UNIT
    case handles.CHECK_CONCENTRATION
    case handles.CONC_HARD_LIMITS_VIOLATED
    case handles.CONC_SOFT_LIMITS_VIOLATED
%    case handles.CHANGE_CONCENTRATION
    case handles.DISPLAY_PATIENT_PROFILE
    case handles.DISPLAY_VTBI
    case handles.CHECK_VTBI
    case handles.CHANGE_VTBI
    case handles.VTBI_HARD_LIMITS_VIOLATED
    case handles.VTBI_SOFT_LIMITS_VIOLATED
    case handles.DISPLAY_DOSE_RATE
    case handles.CHECK_DOSE_RATE
    case handles.CHANGE_DOSE_RATE
    case handles.DOSE_RATE_HARD_LIMITS_VIOLATED
    case handles.DOSE_RATE_SOFT_LIMITS_VIOLATED
	case handles.DISPLAY_SETTINGS
    case handles.READY_TO_START
    case handles.INFUSION_STOPPED    
    case handles.BOLUS_REQUEST
    case handles.HARDWARE_FAILURE_LEVEL_ONE
    case handles.FAILURE_LEVEL_TWO
    case handles.EMPTY_RESERVOIR
    case handles.CHECK_DRUG_WHEN_INFUSING
    case handles.WRONG_DRUG_DURING_INFUSION
    case handles.CHANGE_DOSE_RATE_WHEN_INFUSING
    case handles.CHECK_NEW_DOSE_RATE
    case handles.NEW_DOSE_RATE_OUT_OF_BOUNDS
    case handles.STOP_PAUSE
    case handles.CONFIRM_STOP
    case handles.CONFIRM_PAUSE
    case handles.INFUSION_PAUSED
    case handles.INFUSION_PAUSED_TOO_LONG
    case handles.PAUSED_STOP_CONFIRM
        %%doseRequestButton is disabled in these states.
    case handles.INFUSION_NORMAL_OPERATION
        %E_RequestBolus
        vec = [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0];
        assignin('base', 'GOutputEvents', vec);
end
set_param(handles.mdl,'SimulationCommand','Update')



%%The set configuration functions. Each function configures the UI layout
%%depending on the current state

function setConfigurationToPOST(handles)
set(handles.powerButton, 'value', 1);    
set(handles.powerButton, 'enable', 'on');
set(handles.button1, 'string', '');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToPOSTFailed(handles)
set(handles.powerButton, 'value', 1);
set(handles.powerButton, 'enable', 'on');
set(handles.button1, 'string', '');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToPOSTSuccessful(handles)
set(handles.powerButton, 'value', 1);
set(handles.powerButton, 'enable', 'on');
set(handles.button1, 'string', 'Continue');
set(handles.button1, 'enable', 'on');
set(handles.button2, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToPowerDown(handles)
%%Clear and enable power button
set(handles.powerButton, 'value', 0);
set(handles.powerButton, 'enable', 'on');
%%Clear the settingsConsole and soft buttons
set(handles.settingsConsole, 'enable', 'off');
set(handles.settingsConsole, 'String', '');
%%Clear the displayConsole
set(handles.displayConsole, 'enable', 'off');
set(handles.displayConsole, 'String', '');
set(handles.button1, 'enable', 'off');
set(handles.button1, 'String', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
return;


function setConfigurationToConfirmPowerDown(handles)
%%Disable all UI components other than Button1, Button2 and displayConsole
set(handles.powerButton, 'enable', 'off');
set(handles.powerButton, 'value', 1);
set(handles.settingsConsole, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.button1, 'enable', 'on');
set(handles.button1, 'String', 'Confirm Power Down');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'String', 'Cancel');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);
saveUIConfiguration(handles);
return;


function setConfigurationToCheckAdminSet(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'string', '');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToCheckPrime(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'string', '');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.settingsConsole, 'string', '');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToPrimeFailed(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'string', 'Clear Alarm');
set(handles.button1, 'enable', 'on');
set(handles.button2, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.settingsConsole, 'string', '');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);

function setConfigurationToIncorrectAdminSetup(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Clear Alarm');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.settingsConsole, 'string', '');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToIncorrectDoseUnit(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Clear Alarm');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.settingsConsole, 'string', '');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToCheckDrugType(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToCheckDoseUnit(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToCheckConcentration(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToConcentrationHardLimitsViolated(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Reload Drug');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToConcentrationSoftLimitsViolated(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Continue');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Reload Drug');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToDisplayPatientProfile(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change Patient Profile');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
msgStr = composePatientInfo(handles);
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [msgStr; '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToCheckVTBI(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToDisplayVTBI(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change VTBI');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
buff = handles.GVTBITypical;
assignin('base', 'GProgrammedVTBI', buff);
set(handles.settingsConsole, 'string', buff);
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
dispMsg = composeVTBI(handles);
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [dispMsg; '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToChangeVTBI(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Cancel');
set(handles.incButton, 'enable', 'on');
set(handles.decButton, 'enable', 'on');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'inactive');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GProgrammedVTBI');
set(handles.settingsConsole, 'String', buff);
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToDisplaySettings(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Start Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change Settings');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
dispMsg = composeInfuProg(handles);
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [dispMsg; '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToReadyToStart(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Start Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change Settings');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
dispMsg = composeInfuProg(handles);
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [dispMsg; '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToDisplayDrugInformation(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
dispMsg = composeDrugInfo(handles);
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [dispMsg; '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToUnknownDrug(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Clear Alarm');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToVTBIHardLimitsViolated(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change VTBI');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
%buff = evalin('base', 'GSetConVal');
%set(handles.settingsConsole, 'String', buff);
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToVTBISoftLimitsViolated(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Continue');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change VTBI');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToCheckDoseRate(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToDoseRateHardLimitsViolated(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change Dose Rate');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
%buff = evalin('base', 'GProgrammedDoseRate');
%set(handles.settingsConsole, 'String', buff);
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToDoseRateSoftLimitsViolated(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Continue');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change Dose Rate');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToChangeDoseRate(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Cancel');
set(handles.incButton, 'enable', 'on');
set(handles.decButton, 'enable', 'on');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'on');
buff = evalin('base', 'GProgrammedDoseRate');
set(handles.settingsConsole, 'String', buff);
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToDisplayDoseRate(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Change Dose Rate');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
buff = handles.GDRTypical;
assignin('base', 'GProgrammedDoseRate', buff);
set(handles.settingsConsole, 'string', buff);
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
%buff = evalin('base', 'GMsgConStrArray');
%index = evalin ('base', 'GMsgConStr');
dispMsg = composeDoseRate(handles);
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
%final = [buff(index); '   '; '   '; '     '; buff1(index1)];
final = [dispMsg; '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToInfusion_NormalOperation(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Change Infusion Settings');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Pause Infusion');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'on');
set(handles.settingsConsole, 'enable', 'off');
set(handles.settingsConsole, 'String', '');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
% display normal infusion status
if (index1 == 32)
    statusStr = composeInfuStatus(handles);
    final = [buff(index); '   '; '   '; '     '; statusStr];
else 
    final = [buff(index); '   '; '   '; '     '; buff1(index1)];
end;
set(handles.displayConsole, 'String', final);



function setConfigurationToBolusRequest(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.settingsConsole, 'String', '');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToChangeDoseRateWhenInfusing(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Cancel');
set(handles.incButton, 'enable', 'on');
set(handles.decButton, 'enable', 'on');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'on');
buff = evalin('base', 'GProgrammedDoseRate');
set(handles.settingsConsole, 'String', buff);
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToCheckNewDoseRate(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToNewRateOutOfBounds(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Change Dose Rate');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Cancel');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToStop_Pause(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Pause Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Stop Infusion');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToConfirmPause(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm Pause');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Cancel');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToPausedStopConfirm(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Confirm Stop');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Cancel');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToInfusionPaused(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Resume Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Stop Infusion');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToInfusionPausedTooLong(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Stop Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Clear Alarm');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);


function setConfigurationToLevelOneHardwareFailure(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToLevelTwoFailure(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Stop Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Resume Infusion');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToInfusionStopped(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Start New Infusion');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
%buff = evalin('base', 'GMsgConStrArray');
%index = evalin ('base', 'GMsgConStr');
stopMsg = composeStopMsg(handles);
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
%final = [buff(index); '   '; '   '; '     '; buff1(index1)];
final = [stopMsg; ''; ''; ''; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToEmptyReservoir(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Stop Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Clear Alarm');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToCheckDrugWhenInfusing(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'off');
set(handles.button1, 'string', '');
set(handles.button2, 'enable', 'off');
set(handles.button2, 'string', '');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToIncorrectDrug(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Stop Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Reload Drug');
set(handles.incButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToConfirmStop(handles)
set(handles.powerButton, 'enable', 'on');
set(handles.powerButton, 'value', 1);
set(handles.button1, 'enable', 'on');
set(handles.button1, 'string', 'Stop Infusion');
set(handles.button2, 'enable', 'on');
set(handles.button2, 'string', 'Cancel');
set(handles.incButton, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.displayConsole, 'enable', 'on');
buff = evalin('base', 'GMsgConStrArray');
index = evalin ('base', 'GMsgConStr');
buff1 = evalin('base', 'GAlrmMsgArray');
index1 = evalin('base', 'GAlrmMsg');
final = [buff(index); '   '; '   '; '     '; buff1(index1)];
set(handles.displayConsole, 'String', final);



function setConfigurationToPreviousState(handles)
restoreUIConfiguration(handles);


function saveUIConfiguration(handles)
global powerButtonStatus;
global settingsConsoleStatus;
global incButtonStatus;
global decButtonStatus;
global doseRequestButtonStatus;
global button1Status;
global button1Text;
global button2Status;
global button2Text;
global displayConsoleStatus;
global displayConsoleText;
powerButtonStatus = get(handles.powerButton, 'enable');
settingsConsoleStatus = get(handles.settingsConsole, 'enable');
incButtonStatus = get(handles.incButton, 'enable');
decButtonStatus = get(handles.decButton, 'enable');
doseRequestButtonStatus = get(handles.doseRequestButton, 'enable');
button1Status = get(handles.button1, 'enable');
button1Text = get(handles.button1, 'String');
button2Status = get(handles.button2, 'enable');
button2Text = get(handles.button2, 'String');
displayConsoleStatus = get(handles.displayConsole, 'enable');
displayConsoleText = get(handles.displayConsole, 'String');
return;
            

function restoreUIConfiguration(handles)
%%Restore saved values of consoles and soft buttons
global powerButtonStatus;
global settingsConsoleStatus;
global incButtonStatus;
global decButtonStatus;
global doseRequestButtonStatus;
global button1Status;
global button1Text;
global button2Status;
global button2Text;
global displayConsoleStatus;
global displayConsoleText;
set(handles.powerButton, 'enable', powerButtonStatus);
set(handles.settingsConsole, 'enable', settingsConsoleStatus);
set(handles.incButton, 'enable', incButtonStatus);
set(handles.decButton, 'enable', decButtonStatus);
set(handles.doseRequestButton, 'enable', doseRequestButtonStatus);
set(handles.button1, 'enable', button1Status);
set(handles.button1, 'String', button1Text);
set(handles.button2, 'enable', button2Status);
set(handles.button2, 'String', button2Text);
set(handles.displayConsole, 'enable', displayConsoleStatus);
set(handles.displayConsole, 'String', displayConsoleText);
return;



% --- Executes during object creation, after setting all properties.
function pumpControlPanel_CreateFcn(hObject, eventdata, handles)
% hObject    handle to pumpControlPanel (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called


% --- Executes during object creation, after setting all properties.
function axes5_CreateFcn(hObject, eventdata, handles)
% hObject    handle to axes5 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called
% Hint: place code in OpeningFcn to populate axes5
% hObject    handle to axes4 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% --- Executes during object creation, after setting all properties.
function button1_CreateFcn(hObject, eventdata, handles)
% hObject    handle to button1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called
im = importdata('1.jpg');
set(hObject, 'CData', im);


% --- Executes during object creation, after setting all properties.
function button2_CreateFcn(hObject, eventdata, handles)
% hObject    handle to button2 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called
im = importdata('1.jpg');
set(hObject, 'CData', im);


% --- Executes during object creation, after setting all properties.
function settingsConsole_CreateFcn(hObject, eventdata, handles)
if ispc
    set(hObject,'BackgroundColor','white');
else
    set(hObject,'BackgroundColor',get(0,'defaultUicontrolBackgroundColor'));
end


% --- Executes during object creation, after setting all properties.
function displayConsole_CreateFcn(hObject, eventdata, handles)
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on key press with focus on button1 and no controls selected.
function button1_KeyPressFcn(hObject, eventdata, handles)
% hObject    handle to button1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on key press with focus on button2 and no controls selected.
function button2_KeyPressFcn(hObject, eventdata, handles)
% hObject    handle to button2 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on key press with focus on incButton and no controls selected.
function incButton_KeyPressFcn(hObject, eventdata, handles)
% hObject    handle to incButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on key press with focus on decButton and no controls selected.
function decButton_KeyPressFcn(hObject, eventdata, handles)
% hObject    handle to decButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on key press with focus on doseRequestButton and no controls selected.
function doseRequestButton_KeyPressFcn(hObject, eventdata, handles)
% hObject    handle to doseRequestButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on key press with focus on simulationButton and no controls selected.
function simulationButton_KeyPressFcn(hObject, eventdata, handles)
% hObject    handle to simulationButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes during object creation, after setting all properties.
function controlButtonsPanel_CreateFcn(hObject, eventdata, handles)
% hObject    handle to controlButtonsPanel (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called


% --- Executes during object creation, after setting all properties.
function powerPanel_CreateFcn(hObject, eventdata, handles)
% hObject    handle to powerPanel (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called


% --- Executes during object creation, after setting all properties.
function executionPanel_CreateFcn(hObject, eventdata, handles)
% hObject    handle to executionPanel (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called


%%--- This function disables all buttons and interfaces on the GPCA UI.
function disableAll(handles)
%set(handles.simulationButton, 'enable', 'off');
set(handles.powerButton, 'enable', 'off');
set(handles.button1, 'enable', 'off');
set(handles.button2, 'enable', 'off');
set(handles.settingsConsole, 'enable', 'off');
set(handles.incButton, 'enable', 'off');
set(handles.decButton, 'enable', 'off');
set(handles.displayConsole, 'enable', 'off');
set(handles.doseRequestButton, 'enable', 'off');


%%--- This function clears the consoles and clears the soft buttons in the GPCA UI.
function clearAll(handles)
set(handles.simulationButton, 'value', 0);
set(handles.powerButton, 'value', 0);
set(handles.button1, 'String', '');
set(handles.button2, 'String', '');
set(handles.settingsConsole, 'String', '');
set(handles.incButton, 'String', '');
set(handles.decButton, 'String', '');
set(handles.displayConsole, 'String', '');


% --- This function is used to display the patient information on the
% display console
function x = composePatientInfo(handles)
pid     = ['   ID: ' num2str(handles.GPatientID)];
page    = ['   Age: ' num2str(handles.GPatientAge)];
pgender = ['   Gender: ' num2str(handles.GPatientGender)];
pweight = ['   Weight: ' num2str(handles.GPatientWeight)];
rest    = 'Please press Confirm if the patient connected is correctly identified. Otherwise, please choose the correct patient profile.';
final   = {'Patient '; pid; page; pgender; pweight; rest};
x = final;


% --- This function is used to display the information for the loaded drug 
% on the display console
function disp = composeDrugInfo(handles)
switch handles.GDrugDoseUnit
     case 0 
              dAmountUnit   = ' mg' ;
              dDiluentUnit  = ' ml' ;
              dConcUnit     = ' mg/ml' ;
     case 1  
              dAmountUnit   = ' mmg';
              dDiluentUnit  = ' ml';
              dConcUnit     = ' mmg/ml';
    otherwise 
              dAmountUnit   = ' mmg';
              dDiluentUnit  = ' ml';
              dConcUnit     = ' mmg/ml';
end;
did     = strcat('   ID: ',num2str(handles.GDrugID));
dconc   = strcat('   Concentration: ', num2str(handles.GDrugConc), dConcUnit);
damount = strcat('   Amount: ', num2str(handles.GDrugAmount), dAmountUnit);
ddv     = strcat('   Diluent Volume: ', num2str(handles.GDrugAmount / handles.GDrugConc), dDiluentUnit);
rest    = 'Press Confirm to continue';
disp    = {'The loaded drug is read as:'; did; dconc; damount; ddv; rest};



% --- This function is used to determine the VTBI information, as 
% suggested by the drug library, and display it on the console
function disp = composeVTBI(handles)
switch handles.GVTBIUnit
    case 0 
        vtbiunit = ' ml';
    case 1 
        vtbiunit = ' ml';
    otherwise
        vtbiunit = ' ml';
end;   
vtbitypical = strcat('   Typical: ', num2str(handles.GVTBITypical), vtbiunit);
vtbiuh = strcat('   Hard Upper Limit: ', num2str(handles.GVTBIUH), vtbiunit);
vtbius = strcat('   Soft Upper Limit: ', num2str(handles.GVTBIUS), vtbiunit);
vtbilh = strcat('   Hard Lower Limit:', num2str(handles.GVTBILH), vtbiunit);
vtbils = strcat('   Soft Lower Limit:', num2str(handles.GVTBILS), vtbiunit);
rest = 'Please press Confirm to select the suggested value, or press Change VTBI to enter another value. ';
disp = {'The Volume To Be Infused (VTBI) suggested by the drug library is:'; vtbitypical; vtbiuh; vtbius; vtbilh; vtbils; rest};


% --- This function is used to determine the dose rate information as
% suggested by the drug library, and display it on the console
function disp = composeDoseRate(handles)
switch handles.GVTBIUnit
    case 0 
        drunit = ' ml/hr';
    case 1 
        drunit = ' ml/hr';
    otherwise 
        drunit = ' ml/hr';
end;   
drtypical = ['   Typical: '  num2str(handles.GDRTypical) drunit];
druh = ['   Hard Upper Limit: ' num2str(handles.GDRUH) drunit];
drus = ['   Soft Upper Limit: ' num2str(handles.GDRUS) drunit];
drlh = ['   Hard Lower Limit:' num2str(handles.GDRLH) drunit];
drls = ['   Soft Lower Limit:' num2str(handles.GDRLS) drunit];
rest = 'Please press CONFIRM to select the suggested value, or press the CHANGE button to enter another value. ';
disp = {'The dose rate suggested by the drug library is:'; drtypical;  druh;  drus;  drlh; drls; rest};

function disp = composeInfuStatus(handles)
switch handles.GVTBIUnit
    case 0 
        vtbiunit = ' ml';
    case 1 
        vtbiunit = ' ml';
    otherwise
        vtbiunit = ' ml';
end;      
volumeInfusedStr = [' Total Volume Infused: ' num2str(handles.GCurrVTBI) vtbiunit];
remainVolumeStr = [' Drug remained in the reservoir: ' num2Str(handles.GRemainVol) vtbiunit];
disp = {volumeInfusedStr;  remainVolumeStr};

function disp = composeStopMsg(handles)
switch handles.GVTBIUnit
    case 0 
        vtbiunit = ' ml';
    case 1 
        vtbiunit = ' ml';
    otherwise
        vtbiunit = ' ml';
end;      
volumeInfusedStr = [' Total Volume Infused: ' num2str(handles.GCurrVTBI) vtbiunit];
remainVolumeStr = [' Drug remained in the reservoir: ' num2Str(handles.GRemainVol) vtbiunit];
heading = 'The ongoing infusion has been stopped.';
rest = ' Press Start New Infusion button to start a new session, or press Power button to shut down the pump.';
disp = {heading; volumeInfusedStr;  remainVolumeStr; rest};

% --- This function is used to display details of the programmed
% infusion on the display console
function disp = composeInfuProg(handles)
switch handles.GVTBIUnit
    case 0 
        vtbiunit = ' ml';
        drunit   = ' ml/hr';
    case 1 
        vtbiunit = ' ml';
        drunit   = ' ml/hr';
    otherwise 
        vtbiunit = ' ml';
        drunit   = ' ml/hr';
end;
fixedvtbi = ['VTBI programmed: ' num2str(evalin('base', 'GProgrammedVTBI')) vtbiunit];
fixedDoseRate = ['Infusion rate programmed: ' num2str(evalin('base', 'GProgrammedDoseRate')) drunit];
rest = 'Please press START INFUSION to start the infusion, or press CHANGE SETTINGS to change infusion parameters. ';
disp =  {fixedvtbi;fixedDoseRate; rest};
