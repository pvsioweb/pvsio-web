export function makeDialogTemplate(content: string): string {
    return `
<div class="modal fade" id="PVSioWebModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="display:none;">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="cancel-button">Cancel</button>
        <button type="button" class="btn btn-primary" id="ok-button">Ok</button>
      </div>
    </div>
  </div>
</div>`;
}


export const editWidgetTemplate: string = `
<div class="form-center">
    <form class="center form-horizontal" onsubmit="return false" role="form">
    <div class="card panel panel-info shadow center dialog">
        <div class="card-header panel-heading">Edit {{type}}</div>
        <div class="card-body panel-body" style="min-height:420px; display:inline-flex;">
            <div class="tab-content col-sm-4 noselect">
                <div class="widgetPreview" id="widgetPreview"></div>
                <div class="img-thumbnail" id="navkeys"><img src="projects/navkeys.png" usemap="#widgetPreviewMap"></img></div>
            </div>
            <div class="tab-content col-sm-8">

                {{#if isButton}}
                <div class="form-group">
                    <label for="functionText" class="col-sm-4 control-label noselect">Button Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="functionText" id="functionText" required class="form-control"
                               value="{{functionText}}" placeholder="Please enter button name (mandatory)"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="visibleWhen" class="col-sm-4 control-label noselect">Active when...</label>
                    <div class="col-sm-8">
                        <input type="text" name="visibleWhen" id="visibleWhen" class="form-control" placeholder="always active" value="{{visibleWhen}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="events" class="col-sm-4 control-label noselect">User Actions</label>
                    <div class="col-sm-8" id="events" style="padding-top:5px;">
                        <label>
                            Click
                            <input type="radio" name="button_events" value="click"/>
                        </label>
                        <label style="padding-left:25px;">
                            Press and Release
                            <input type="radio" name="button_events" value="press/release" />
                        </label>
                        <label style="padding-left:25px;">
                            Custom
                            <input type="radio" name="button_events" id="custom_event" value="custom" />
                        </label>
                    </div>
                </div>
<!--                        <div class="form-group">
                    <label for="recallRate" class="col-sm-4 control-label noselect">Repeat Time (ms)</label>
                    <div class="col-sm-8">
                        <input type="text" name="recallRate" id="recallRate" required class="form-control" value="250" pattern="\d{2,5}" />
                    </div>
                </div>-->
                <div class="form-group">
                    <label for="buttonReadback" class="col-sm-4 control-label noselect">Voice Readback</label>
                    <div class="col-sm-8">
                        <input type="text" name="buttonReadback" id="buttonReadback" class="form-control"
                               value="{{buttonReadback}}" placeholder="Please enter readback text (optional)"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="keyCode" class="col-sm-4 control-label noselect">Keyboard Key</label>
                    <div class="col-sm-8">
                        <input onkeydown="uniKeyCode(event)" class="form-control"
                               type="text" id="keyName" name="keyName" value="{{keyName}}" placeholder="Please choose keyboard key (optional)" />
                        <input type="text" id="keyCode" name="keyCode" value="{{keyCode}}" readonly style="display:none"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="boundFunctions" class="col-sm-4 control-label noselect">Generated Events</label>
                    <div class="col-sm-8">
                        <textarea id="boundFunctions" name="boundFunctions" type="text" readonly="true" class="form-control" style="resize:none;"></textarea>
                    </div>
                </div>
                {{else}}{{#if isDisplay}}
                <div class="form-group">
                    <label for="displayKey" class="col-sm-4 control-label noselect">Display Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="displayKey" id="displayKey" required class="form-control" placeholder="Please enter display name (mandatory)" value="{{displayKey}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="visibleWhen" class="col-sm-4 control-label noselect">Visible when...</label>
                    <div class="col-sm-8">
                        <input type="text" name="visibleWhen" id="visibleWhen" class="form-control" placeholder="always visible" value="{{visibleWhen}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="auditoryFeedback" class="col-sm-4 control-label noselect">Voice Readback</label>
                    <div class="col-sm-8" style="padding-top:6px;">
                        <input type="checkbox" name="auditoryFeedback" id="auditoryFeedback" value="{{auditoryFeedback}}"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="fontsize" class="col-sm-4 control-label noselect">Font size</label>
                    <div class="col-sm-8">
                        <input type="text" name="fontsize" id="fontsize" class="form-control" placeholder="Please enter font size (default: 20)" value="{{fontsize}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="fontColor" class="col-sm-4 control-label noselect">Font color</label>
                    <div class="col-sm-8">
                        <input type="text" name="fontColor" id="fontColor" class="form-control" placeholder="Please enter font color (default: white)" value="{{fontColor}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="backgroundColor" class="col-sm-4 control-label noselect">Background color</label>
                    <div class="col-sm-8">
                        <input type="text" name="backgroundColor" id="backgroundColor" class="form-control" placeholder="Please enter background color (default: black)" value="{{backgroundColor}}" />
                    </div>
                </div>
                {{else}}{{#if isNumericDisplay}}
                <div class="form-group">
                    <label for="displayKey" class="col-sm-4 control-label noselect">Display Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="displayKey" id="displayKey" required class="form-control" placeholder="Please enter display name (mandatory)" value="{{displayKey}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="cursorName" class="col-sm-4 control-label noselect">Cursor Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="cursorName" id="cursorName" class="form-control" placeholder="Please enter cursor name (optional)" value="{{cursorName}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="visibleWhen" class="col-sm-4 control-label noselect">Visible when...</label>
                    <div class="col-sm-8">
                        <input type="text" name="visibleWhen" id="visibleWhen" class="form-control" placeholder="always visible" value="{{visibleWhen}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="auditoryFeedback" class="col-sm-4 control-label noselect">Voice Readback</label>
                    <div class="col-sm-8" style="padding-top:6px;">
                        <input type="checkbox" name="auditoryFeedback" id="auditoryFeedback" value="{{auditoryFeedback}}"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="fontsize" class="col-sm-4 control-label noselect">Font size</label>
                    <div class="col-sm-8">
                        <input type="text" name="fontsize" id="fontsize" class="form-control" placeholder="Please enter font size (default: 20)" value="{{fontsize}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="fontColor" class="col-sm-4 control-label noselect">Font color</label>
                    <div class="col-sm-8">
                        <input type="text" name="fontColor" id="fontColor" class="form-control" placeholder="Please enter font color (default: white)" value="{{fontColor}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="backgroundColor" class="col-sm-4 control-label noselect">Background color</label>
                    <div class="col-sm-8">
                        <input type="text" name="backgroundColor" id="backgroundColor" class="form-control" placeholder="Please enter background color (default: transparent)" value="{{backgroundColor}}" />
                    </div>
                </div>
                {{else}}{{#if isTouchscreenDisplay}}
                <div class="form-group">
                    <label for="displayKey" class="col-sm-4 control-label noselect">Display Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="displayKey" id="displayKey" required class="form-control" placeholder="Please enter display name (mandatory)" value="{{displayKey}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="cursorName" class="col-sm-4 control-label noselect">Cursor Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="cursorName" id="cursorName" class="form-control" placeholder="Please enter cursor name (optional)" value="{{cursorName}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="visibleWhen" class="col-sm-4 control-label noselect">Visible when...</label>
                    <div class="col-sm-8">
                        <input type="text" name="visibleWhen" id="visibleWhen" class="form-control" placeholder="always visible" value="{{visibleWhen}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="functionText" class="col-sm-4 control-label noselect">Function</label>
                    <div class="col-sm-8">
                        <input type="text" name="functionText" id="functionText"
                               class="form-control" placeholder="Please enter function name" value="{{functionText}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="auditoryFeedback" class="col-sm-4 control-label noselect">Voice Readback</label>
                    <div class="col-sm-8" style="padding-top:6px;">
                        <input type="checkbox" name="auditoryFeedback" id="auditoryFeedback" value="{{auditoryFeedback}}"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="fontsize" class="col-sm-4 control-label noselect">Font size</label>
                    <div class="col-sm-8">
                        <input type="text" name="fontsize" id="fontsize" class="form-control" placeholder="Please enter font size (default: 20)" value="{{fontsize}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="fontColor" class="col-sm-4 control-label noselect">Font color</label>
                    <div class="col-sm-8">
                        <input type="text" name="fontColor" id="fontColor" class="form-control" placeholder="Please enter font color (default: white)" value="{{fontColor}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="backgroundColor" class="col-sm-4 control-label noselect">Background color</label>
                    <div class="col-sm-8">
                        <input type="text" name="backgroundColor" id="backgroundColor" class="form-control" placeholder="Please enter background color (default: transparent)" value="{{backgroundColor}}" />
                    </div>
                </div>
                {{else}}{{#if isTouchscreenButton}}
                <div class="form-group">
                    <label for="functionText" class="col-sm-4 control-label noselect">Touchscreen Button Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="functionText" id="functionText" required class="form-control"
                               value="{{functionText}}" placeholder="Please enter button name (mandatory)"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="softLabel" class="col-sm-4 control-label noselect">Touchscreen Button Label</label>
                    <div class="col-sm-8">
                        <input type="text" name="softLabel" id="softLabel" class="form-control"
                               value="{{softLabel}}" placeholder="Soft button label (optional)"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="visibleWhen" class="col-sm-4 control-label noselect">Visible when...</label>
                    <div class="col-sm-8">
                        <input type="text" name="visibleWhen" id="visibleWhen" class="form-control" placeholder="always visible" value="{{visibleWhen}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="buttonReadback" class="col-sm-4 control-label noselect">Voice Readback</label>
                    <div class="col-sm-8">
                        <input type="text" name="buttonReadback" id="buttonReadback" class="form-control"
                               value="{{buttonReadback}}" placeholder="Please enter readback text (optional)"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="fontsize" class="col-sm-4 control-label noselect">Font size</label>
                    <div class="col-sm-8">
                        <input type="text" name="fontsize" id="fontsize" class="form-control" placeholder="Please enter font size (default: 20)" value="{{fontsize}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="fontColor" class="col-sm-4 control-label noselect">Font color</label>
                    <div class="col-sm-8">
                        <input type="text" name="fontColor" id="fontColor" class="form-control" placeholder="Please enter font color (default: white)" value="{{fontColor}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="backgroundColor" class="col-sm-4 control-label noselect">Background color</label>
                    <div class="col-sm-8">
                        <input type="text" name="backgroundColor" id="backgroundColor" class="form-control" placeholder="Please enter background color (default: transparent)" value="{{backgroundColor}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="events" class="col-sm-4 control-label noselect">User Actions</label>
                    <div class="col-sm-8" id="events" style="padding-top:5px;">
                        <label>
                            Click
                            <input type="radio" name="touchscreenbutton_events" value="click" checked />
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="boundFunctions" class="col-sm-4 control-label noselect">Generated Events</label>
                    <div class="col-sm-8">
                        <textarea id="boundFunctions" name="boundFunctions" type="text" readonly="true" class="form-control" style="resize:none;">{{boundFunctions}}</textarea>
                    </div>
                </div>
                {{else}}{{#if isLED}}
                <div class="form-group">
                    <label for="ledKey" class="col-sm-4 control-label noselect">LED Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="ledKey" id="ledKey" required class="form-control"
                               value="{{ledKey}}" placeholder="Please enter LED name (mandatory)"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="visibleWhen" class="col-sm-4 control-label noselect">Visible when...</label>
                    <div class="col-sm-8">
                        <input type="text" name="visibleWhen" id="visibleWhen" class="form-control" placeholder="always visible" value="{{visibleWhen}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="ledColor" class="col-sm-4 control-label noselect">Color</label>
                    <div class="col-sm-8">
                        <input type="text" name="ledColor" id="ledColor" class="form-control" placeholder="Please enter LED color (default: lightgreen)" value="{{ledColor}}" />
                    </div>
                </div>
                {{else}}{{#if isTimer}}
                <div class="form-group">
                    <label for="timerEvent" class="col-sm-4 control-label noselect">Timer Name</label>
                    <div class="col-sm-8">
                        <input type="text" name="timerEvent" id="timerEvent" required class="form-control" value="{{timerEvent}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="timerRate" class="col-sm-4 control-label noselect">Repeat Time (ms)</label>
                    <div class="col-sm-8">
                        <input type="text" name="timerRate" id="timerRate" required class="form-control" value="{{timerRate}}" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="timerFunction" class="col-sm-4 control-label noselect">Generated Events</label>
                    <div class="col-sm-8" id="events">
                        <textarea id="timerFunction" name="timerFunction" type="text" readonly="true" class="form-control">{{timerFunction}}</textarea>
                    </div>
                </div>
                {{/if}}{{/if}}{{/if}}{{/if}}{{/if}}{{/if}}{{/if}}
            </div>
        </div>
        <div class="card-footer panel-footer">
            <button type="button" class="btn btn-danger left" id="btnCancel">Cancel</button>
            <button type="submit" class="btn btn-success right" id="btnOk">OK</button>
        </div>
    </div>
    </form>
</div>
`;