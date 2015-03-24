function GPCA_Bus_Def2() 
% GPCA_BUS_DEF2 initializes a set of bus objects in the MATLAB base workspace 

% Bus object: DrugInformation 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'drugID';
elems(1).Dimensions = 1;
elems(1).DataType = 'uint32';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'drugDoseAmount';
elems(2).Dimensions = 1;
elems(2).DataType = 'double';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'drugDiluentVolume';
elems(3).Dimensions = 1;
elems(3).DataType = 'double';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

elems(4) = Simulink.BusElement;
elems(4).Name = 'drugConcentration';
elems(4).Dimensions = 1;
elems(4).DataType = 'double';
elems(4).SampleTime = -1;
elems(4).Complexity = 'real';
elems(4).SamplingMode = 'Sample based';

elems(5) = Simulink.BusElement;
elems(5).Name = 'drugDoseUnit';
elems(5).Dimensions = 1;
elems(5).DataType = 'uint32';
elems(5).SampleTime = -1;
elems(5).Complexity = 'real';
elems(5).SamplingMode = 'Sample based';

elems(6) = Simulink.BusElement;
elems(6).Name = 'drugVolumeUnit';
elems(6).Dimensions = 1;
elems(6).DataType = 'uint32';
elems(6).SampleTime = -1;
elems(6).Complexity = 'real';
elems(6).SamplingMode = 'Sample based';

DrugInformation = Simulink.Bus;
DrugInformation.HeaderFile = '';
DrugInformation.Description = sprintf('');
DrugInformation.Elements = elems;
assignin('base', 'DrugInformation', DrugInformation)

% Bus object: DrugLibrary 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'drugID';
elems(1).Dimensions = 1;
elems(1).DataType = 'uint32';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'amount';
elems(2).Dimensions = 1;
elems(2).DataType = 'double';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'diluentVolume';
elems(3).Dimensions = 1;
elems(3).DataType = 'double';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

elems(4) = Simulink.BusElement;
elems(4).Name = 'doseRateTypical';
elems(4).Dimensions = 1;
elems(4).DataType = 'double';
elems(4).SampleTime = -1;
elems(4).Complexity = 'real';
elems(4).SamplingMode = 'Sample based';

elems(5) = Simulink.BusElement;
elems(5).Name = 'doseRateUpperHardLimit';
elems(5).Dimensions = 1;
elems(5).DataType = 'double';
elems(5).SampleTime = -1;
elems(5).Complexity = 'real';
elems(5).SamplingMode = 'Sample based';

elems(6) = Simulink.BusElement;
elems(6).Name = 'doseRateUpperSoftLimit';
elems(6).Dimensions = 1;
elems(6).DataType = 'double';
elems(6).SampleTime = -1;
elems(6).Complexity = 'real';
elems(6).SamplingMode = 'Sample based';

elems(7) = Simulink.BusElement;
elems(7).Name = 'doseRateLowerHardLimit';
elems(7).Dimensions = 1;
elems(7).DataType = 'double';
elems(7).SampleTime = -1;
elems(7).Complexity = 'real';
elems(7).SamplingMode = 'Sample based';

elems(8) = Simulink.BusElement;
elems(8).Name = 'doseRateLowerSoftLimit';
elems(8).Dimensions = 1;
elems(8).DataType = 'double';
elems(8).SampleTime = -1;
elems(8).Complexity = 'real';
elems(8).SamplingMode = 'Sample based';

elems(9) = Simulink.BusElement;
elems(9).Name = 'doseRateUnit';
elems(9).Dimensions = 1;
elems(9).DataType = 'uint32';
elems(9).SampleTime = -1;
elems(9).Complexity = 'real';
elems(9).SamplingMode = 'Sample based';

elems(10) = Simulink.BusElement;
elems(10).Name = 'vtbiTypical';
elems(10).Dimensions = 1;
elems(10).DataType = 'double';
elems(10).SampleTime = -1;
elems(10).Complexity = 'real';
elems(10).SamplingMode = 'Sample based';

elems(11) = Simulink.BusElement;
elems(11).Name = 'vtbiUpperHardLimit';
elems(11).Dimensions = 1;
elems(11).DataType = 'double';
elems(11).SampleTime = -1;
elems(11).Complexity = 'real';
elems(11).SamplingMode = 'Sample based';

elems(12) = Simulink.BusElement;
elems(12).Name = 'vtbiUpperSoftLimit';
elems(12).Dimensions = 1;
elems(12).DataType = 'double';
elems(12).SampleTime = -1;
elems(12).Complexity = 'real';
elems(12).SamplingMode = 'Sample based';

elems(13) = Simulink.BusElement;
elems(13).Name = 'vtbiLowerHardLimit';
elems(13).Dimensions = 1;
elems(13).DataType = 'double';
elems(13).SampleTime = -1;
elems(13).Complexity = 'real';
elems(13).SamplingMode = 'Sample based';

elems(14) = Simulink.BusElement;
elems(14).Name = 'vtbiLowerSoftLimit';
elems(14).Dimensions = 1;
elems(14).DataType = 'double';
elems(14).SampleTime = -1;
elems(14).Complexity = 'real';
elems(14).SamplingMode = 'Sample based';

elems(15) = Simulink.BusElement;
elems(15).Name = 'vtbiUnit';
elems(15).Dimensions = 1;
elems(15).DataType = 'uint32';
elems(15).SampleTime = -1;
elems(15).Complexity = 'real';
elems(15).SamplingMode = 'Sample based';

elems(16) = Simulink.BusElement;
elems(16).Name = 'drugConcentrationTypical';
elems(16).Dimensions = 1;
elems(16).DataType = 'double';
elems(16).SampleTime = -1;
elems(16).Complexity = 'real';
elems(16).SamplingMode = 'Sample based';

elems(17) = Simulink.BusElement;
elems(17).Name = 'drugConcentrationUpperHardLimit';
elems(17).Dimensions = 1;
elems(17).DataType = 'double';
elems(17).SampleTime = -1;
elems(17).Complexity = 'real';
elems(17).SamplingMode = 'Sample based';

elems(18) = Simulink.BusElement;
elems(18).Name = 'drugConcentrationUpperSoftLimit';
elems(18).Dimensions = 1;
elems(18).DataType = 'double';
elems(18).SampleTime = -1;
elems(18).Complexity = 'real';
elems(18).SamplingMode = 'Sample based';

elems(19) = Simulink.BusElement;
elems(19).Name = 'drugConcentrationLowerHardLimit';
elems(19).Dimensions = 1;
elems(19).DataType = 'double';
elems(19).SampleTime = -1;
elems(19).Complexity = 'real';
elems(19).SamplingMode = 'Sample based';

elems(20) = Simulink.BusElement;
elems(20).Name = 'drugConcentrationLowerSoftLimit';
elems(20).Dimensions = 1;
elems(20).DataType = 'double';
elems(20).SampleTime = -1;
elems(20).Complexity = 'real';
elems(20).SamplingMode = 'Sample based';

DrugLibrary = Simulink.Bus;
DrugLibrary.HeaderFile = '';
DrugLibrary.Description = sprintf('');
DrugLibrary.Elements = elems;
assignin('base', 'DrugLibrary', DrugLibrary)

% Bus object: EnvironmentSensorSignals 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'isTemperatureOutOfRange';
elems(1).Dimensions = 1;
elems(1).DataType = 'boolean';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'isHumidityOutOfRange';
elems(2).Dimensions = 1;
elems(2).DataType = 'boolean';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'isAirPressureOutOfRange';
elems(3).Dimensions = 1;
elems(3).DataType = 'boolean';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

EnvironmentSensorSignals = Simulink.Bus;
EnvironmentSensorSignals.HeaderFile = '';
EnvironmentSensorSignals.Description = sprintf('');
EnvironmentSensorSignals.Elements = elems;
assignin('base', 'EnvironmentSensorSignals', EnvironmentSensorSignals)

% Bus object: HardwareSensorSignals 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'isLoggingFailed';
elems(1).Dimensions = 1;
elems(1).DataType = 'boolean';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'isWatchDogInterruptDetected';
elems(2).Dimensions = 1;
elems(2).DataType = 'boolean';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'isReservoirDoorOpen';
elems(3).Dimensions = 1;
elems(3).DataType = 'boolean';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

elems(4) = Simulink.BusElement;
elems(4).Name = 'isBatteryDepleted';
elems(4).Dimensions = 1;
elems(4).DataType = 'boolean';
elems(4).SampleTime = -1;
elems(4).Complexity = 'real';
elems(4).SamplingMode = 'Sample based';

elems(5) = Simulink.BusElement;
elems(5).Name = 'isBatteryLow';
elems(5).Dimensions = 1;
elems(5).DataType = 'boolean';
elems(5).SampleTime = -1;
elems(5).Complexity = 'real';
elems(5).SamplingMode = 'Sample based';

elems(6) = Simulink.BusElement;
elems(6).Name = 'isBatteryUnableToCharge';
elems(6).Dimensions = 1;
elems(6).DataType = 'boolean';
elems(6).SampleTime = -1;
elems(6).Complexity = 'real';
elems(6).SamplingMode = 'Sample based';

elems(7) = Simulink.BusElement;
elems(7).Name = 'isSupplyVoltageOutOfRange';
elems(7).Dimensions = 1;
elems(7).DataType = 'boolean';
elems(7).SampleTime = -1;
elems(7).Complexity = 'real';
elems(7).SamplingMode = 'Sample based';

elems(8) = Simulink.BusElement;
elems(8).Name = 'isCPUInError';
elems(8).Dimensions = 1;
elems(8).DataType = 'boolean';
elems(8).SampleTime = -1;
elems(8).Complexity = 'real';
elems(8).SamplingMode = 'Sample based';

elems(9) = Simulink.BusElement;
elems(9).Name = 'isRTCInError';
elems(9).Dimensions = 1;
elems(9).DataType = 'boolean';
elems(9).SampleTime = -1;
elems(9).Complexity = 'real';
elems(9).SamplingMode = 'Sample based';

elems(10) = Simulink.BusElement;
elems(10).Name = 'isMemoryCorrupted';
elems(10).Dimensions = 1;
elems(10).DataType = 'boolean';
elems(10).SampleTime = -1;
elems(10).Complexity = 'real';
elems(10).SamplingMode = 'Sample based';

elems(11) = Simulink.BusElement;
elems(11).Name = 'isPumpTooHot';
elems(11).Dimensions = 1;
elems(11).DataType = 'boolean';
elems(11).SampleTime = -1;
elems(11).Complexity = 'real';
elems(11).SamplingMode = 'Sample based';

elems(12) = Simulink.BusElement;
elems(12).Name = 'isPumpOverheated';
elems(12).Dimensions = 1;
elems(12).DataType = 'boolean';
elems(12).SampleTime = -1;
elems(12).Complexity = 'real';
elems(12).SamplingMode = 'Sample based';

HardwareSensorSignals = Simulink.Bus;
HardwareSensorSignals.HeaderFile = '';
HardwareSensorSignals.Description = sprintf('');
HardwareSensorSignals.Elements = elems;
assignin('base', 'HardwareSensorSignals', HardwareSensorSignals)

% Bus object: InfusionInstructions 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'infusionInProgress';
elems(1).Dimensions = 1;
elems(1).DataType = 'boolean';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'infusionPaused';
elems(2).Dimensions = 1;
elems(2).DataType = 'boolean';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'bolusRequested';
elems(3).Dimensions = 1;
elems(3).DataType = 'boolean';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

elems(4) = Simulink.BusElement;
elems(4).Name = 'programmedVTBI';
elems(4).Dimensions = 1;
elems(4).DataType = 'double';
elems(4).SampleTime = -1;
elems(4).Complexity = 'real';
elems(4).SamplingMode = 'Sample based';

elems(5) = Simulink.BusElement;
elems(5).Name = 'programmedFlowRate';
elems(5).Dimensions = 1;
elems(5).DataType = 'double';
elems(5).SampleTime = -1;
elems(5).Complexity = 'real';
elems(5).SamplingMode = 'Sample based';

InfusionInstructions = Simulink.Bus;
InfusionInstructions.HeaderFile = '';
InfusionInstructions.Description = sprintf('');
InfusionInstructions.Elements = elems;
assignin('base', 'InfusionInstructions', InfusionInstructions)

% Bus object: InfusionParameters 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'programmedVTBI';
elems(1).Dimensions = 1;
elems(1).DataType = 'double';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'programmedDoseRate';
elems(2).Dimensions = 1;
elems(2).DataType = 'double';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

InfusionParameters = Simulink.Bus;
InfusionParameters.HeaderFile = '';
InfusionParameters.Description = sprintf('');
InfusionParameters.Elements = elems;
assignin('base', 'InfusionParameters', InfusionParameters)

% Bus object: InfusionSensorSignals 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'isReservoirEmpty';
elems(1).Dimensions = 1;
elems(1).DataType = 'boolean';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'isReservoirLow';
elems(2).Dimensions = 1;
elems(2).DataType = 'boolean';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'isOcclusionDetected';
elems(3).Dimensions = 1;
elems(3).DataType = 'boolean';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

elems(4) = Simulink.BusElement;
elems(4).Name = 'isInfusionRateTooHigh';
elems(4).Dimensions = 1;
elems(4).DataType = 'boolean';
elems(4).SampleTime = -1;
elems(4).Complexity = 'real';
elems(4).SamplingMode = 'Sample based';

elems(5) = Simulink.BusElement;
elems(5).Name = 'isInfusionRateTooLow';
elems(5).Dimensions = 1;
elems(5).DataType = 'boolean';
elems(5).SampleTime = -1;
elems(5).Complexity = 'real';
elems(5).SamplingMode = 'Sample based';

elems(6) = Simulink.BusElement;
elems(6).Name = 'isInfusionRateLessThanKVO';
elems(6).Dimensions = 1;
elems(6).DataType = 'boolean';
elems(6).SampleTime = -1;
elems(6).Complexity = 'real';
elems(6).SamplingMode = 'Sample based';

elems(7) = Simulink.BusElement;
elems(7).Name = 'isFlowRateNotStable';
elems(7).Dimensions = 1;
elems(7).DataType = 'boolean';
elems(7).SampleTime = -1;
elems(7).Complexity = 'real';
elems(7).SamplingMode = 'Sample based';

elems(8) = Simulink.BusElement;
elems(8).Name = 'isFlowRateOverPumpCapacity';
elems(8).Dimensions = 1;
elems(8).DataType = 'boolean';
elems(8).SampleTime = -1;
elems(8).Complexity = 'real';
elems(8).SamplingMode = 'Sample based';

elems(9) = Simulink.BusElement;
elems(9).Name = 'isInfusionPausedLong';
elems(9).Dimensions = 1;
elems(9).DataType = 'boolean';
elems(9).SampleTime = -1;
elems(9).Complexity = 'real';
elems(9).SamplingMode = 'Sample based';

elems(10) = Simulink.BusElement;
elems(10).Name = 'isInfusionPausedTooLong';
elems(10).Dimensions = 1;
elems(10).DataType = 'boolean';
elems(10).SampleTime = -1;
elems(10).Complexity = 'real';
elems(10).SamplingMode = 'Sample based';

elems(11) = Simulink.BusElement;
elems(11).Name = 'isAirInLineDetected';
elems(11).Dimensions = 1;
elems(11).DataType = 'boolean';
elems(11).SampleTime = -1;
elems(11).Complexity = 'real';
elems(11).SamplingMode = 'Sample based';

InfusionSensorSignals = Simulink.Bus;
InfusionSensorSignals.HeaderFile = '';
InfusionSensorSignals.Description = sprintf('');
InfusionSensorSignals.Elements = elems;
assignin('base', 'InfusionSensorSignals', InfusionSensorSignals)

% Bus object: InfusionStatus 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'isBolusInProgress';
elems(1).Dimensions = 1;
elems(1).DataType = 'boolean';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'totalVolumeInfused';
elems(2).Dimensions = 1;
elems(2).DataType = 'double';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'remainingVolumeInReservoir';
elems(3).Dimensions = 1;
elems(3).DataType = 'double';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

InfusionStatus = Simulink.Bus;
InfusionStatus.HeaderFile = '';
InfusionStatus.Description = sprintf('');
InfusionStatus.Elements = elems;
assignin('base', 'InfusionStatus', InfusionStatus)

% Bus object: PatientInformation 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'patientID';
elems(1).Dimensions = 1;
elems(1).DataType = 'uint32';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'patientAge';
elems(2).Dimensions = 1;
elems(2).DataType = 'uint32';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'patientGender';
elems(3).Dimensions = 1;
elems(3).DataType = 'uint32';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

elems(4) = Simulink.BusElement;
elems(4).Name = 'patientWeight';
elems(4).Dimensions = 1;
elems(4).DataType = 'uint32';
elems(4).SampleTime = -1;
elems(4).Complexity = 'real';
elems(4).SamplingMode = 'Sample based';

PatientInformation = Simulink.Bus;
PatientInformation.HeaderFile = '';
PatientInformation.Description = sprintf('');
PatientInformation.Elements = elems;
assignin('base', 'PatientInformation', PatientInformation)

% Bus object: PumpConfigurationsStatus 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'isPOSTSuccessful';
elems(1).Dimensions = 1;
elems(1).DataType = 'boolean';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'isPumpPrimed';
elems(2).Dimensions = 1;
elems(2).DataType = 'boolean';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'isAdminSetCheckPassed';
elems(3).Dimensions = 1;
elems(3).DataType = 'boolean';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

PumpConfigurationsStatus = Simulink.Bus;
PumpConfigurationsStatus.HeaderFile = '';
PumpConfigurationsStatus.Description = sprintf('');
PumpConfigurationsStatus.Elements = elems;
assignin('base', 'PumpConfigurationsStatus', PumpConfigurationsStatus)

% Bus object: SoftwareOutput 
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'currentState';
elems(1).Dimensions = 1;
elems(1).DataType = 'double';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'drugLibrary';
elems(2).Dimensions = 1;
elems(2).DataType = 'DrugLibrary';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'currentVTBI';
elems(3).Dimensions = 1;
elems(3).DataType = 'double';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

elems(4) = Simulink.BusElement;
elems(4).Name = 'remainVolume';
elems(4).Dimensions = 1;
elems(4).DataType = 'double';
elems(4).SampleTime = -1;
elems(4).Complexity = 'real';
elems(4).SamplingMode = 'Sample based';

elems(5) = Simulink.BusElement;
elems(5).Name = 'patientInfo';
elems(5).Dimensions = 1;
elems(5).DataType = 'PatientInformation';
elems(5).SampleTime = -1;
elems(5).Complexity = 'real';
elems(5).SamplingMode = 'Sample based';

elems(6) = Simulink.BusElement;
elems(6).Name = 'drugConcentration';
elems(6).Dimensions = 1;
elems(6).DataType = 'double';
elems(6).SampleTime = -1;
elems(6).Complexity = 'real';
elems(6).SamplingMode = 'Sample based';

elems(7) = Simulink.BusElement;
elems(7).Name = 'drugAmount';
elems(7).Dimensions = 1;
elems(7).DataType = 'double';
elems(7).SampleTime = -1;
elems(7).Complexity = 'real';
elems(7).SamplingMode = 'Sample based';

SoftwareOutput = Simulink.Bus;
SoftwareOutput.HeaderFile = '';
SoftwareOutput.Description = sprintf('');
SoftwareOutput.Elements = elems;
assignin('base', 'SoftwareOutput', SoftwareOutput)

% Bus object: PVS_GPCAUI_BUS
clear elems;
elems(1) = Simulink.BusElement;
elems(1).Name = 'event';
elems(1).Dimensions = 1;
elems(1).DataType = 'uint32';
elems(1).SampleTime = -1;
elems(1).Complexity = 'real';
elems(1).SamplingMode = 'Sample based';

elems(2) = Simulink.BusElement;
elems(2).Name = 'programmedVTBI';
elems(2).Dimensions = 1;
elems(2).DataType = 'double';
elems(2).SampleTime = -1;
elems(2).Complexity = 'real';
elems(2).SamplingMode = 'Sample based';

elems(3) = Simulink.BusElement;
elems(3).Name = 'programmedDoseRate';
elems(3).Dimensions = 1;
elems(3).DataType = 'double';
elems(3).SampleTime = -1;
elems(3).Complexity = 'real';
elems(3).SamplingMode = 'Sample based';

PVS_GPCAUI_BUS = Simulink.Bus;
PVS_GPCAUI_BUS.HeaderFile = '';
PVS_GPCAUI_BUS.Description = sprintf('Structure of the receive bus for the PVS-based GPCA-UI');
PVS_GPCAUI_BUS.Elements = elems;
assignin('base', 'PVS_GPCAUI_BUS', PVS_GPCAUI_BUS)

