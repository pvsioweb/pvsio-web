%-----------------------------
% WebsocketServer
%-----------------------------
specs = legacy_code('initialize');                  % Create specifications structure

specs.HeaderFiles = {'websocket_server.h'};         % External header files
specs.SourceFiles = {'websocket_server.c'};         % External source files
specs.SFunctionName = 'websocket_serverLCT';        % S-function name
% u1 = Aget signal from heart
% u2 = Vget signal from heart
% y2 = AP pacing stimulus from pacemaker to heart
% y3 = VP pacing stimulus from pacemaker to heart
specs.OutputFcnSpec = 'uint32 y1 = WebsocketServer(double u1, double u2, uint32 y2[1], uint32 y3[1])';
% NOTE: libwebsockets must be in your included LIB-files
% e.g., in ubuntu linux, the default library path is /usr/local/lib
specs.HostLibFiles = {'libwebsockets.dylib'};
specs.TerminateFcnSpec = 'close_websocket()';

% specs.SampleTime = 1;
% Create S-function, TLC file, etc.
legacy_code('sfcn_cmex_generate', specs);           % Generate S-function code
legacy_code('compile', specs);                       % Compile S-function
legacy_code('slblock_generate',specs);               % Create block for S-function
%
legacy_code('sfcn_tlc_generate', specs);             % Inline S-function by creating TLC file
legacy_code('rtwmakecfg_generate', specs);           % Add path info to RTW make file


