%Define Legacy Code Tool options
specs = legacy_code('initialize');                          %Create specifications structure

specs.OutputFcnSpec = 'DrugLibraryReader(uint32 u1[2], uint32 y1[1], uint32 y2[1], uint32 y3[1], uint32 y4[1], double  y5[1], double  y6[1], double  y7[1],double  y8[1],double  y9[1],double  y10[1],double  y11[1],double  y12[1], double  y13[1],double  y14[1],double  y15[1],double  y16[1],double  y17[1],double  y18[1],double  y19[1], double  y20[1],double  y21[1], uint32  y22[1])';


specs.StartFcnSpec = 'openFile()';                          %Function to be called before simulation
% specs.InitializeConditionsFcnSpec = 'randomizeSeed()';
specs.TerminateFcnSpec = 'closeFile()';              %Function to be called after simulation
specs.HeaderFiles = {'DrugLibraryLCT.h'};                       %Necessary external header files
specs.SourceFiles = {'DrugLibraryLCT.c'};                       %Necessary external source files
specs.SFunctionName = 'DrugLibraryReaderSfun';                 %S-function name
specs.SampleTime = 1;
%Create S-function, TLC file, etc.
legacy_code('sfcn_cmex_generate', specs);     %Generate S-function code
legacy_code('compile', specs)                            %Compile S-function
legacy_code('slblock_generate',specs)              %Create block for S-function
%%
legacy_code('sfcn_tlc_generate', specs)           %Inline S-function by creating TLC file
legacy_code('rtwmakecfg_generate', specs)     %Add path info to RTW make file

