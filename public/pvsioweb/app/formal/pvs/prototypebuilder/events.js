/**
 * module defining events emitted by the prototype builder
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 10:38:34 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define({
	MarkEdited: "MarkEdited",
	MarkDeleted: "MarkDeleted",
	ServerReady: "ServerReady",
	OutputUpdated: "OutputUpdated",
	InputUpdated: "InputUpdated",
	StateChanged: "StateChanged",
	SourceCodeReceived: "SourceCodeReceived",
	ProcessExited: "ProcessExited",
	SourceCodeSaved: "SourceCodeSaved",
	SourceCodeNotSaved: "SourceCodeNotSaved",
	ProjectCreated: "ProjectCreated",
	TempFileSaved: "TempFileSaved"
});