/**
 * @module RemoteControllerEVO
 * @version 1.0
 * @description Remote controller, reads input data from gyroscope and/or joystick, and send it to the server using a special message style "controller" and a client ID
 * @author Paolo Masci
 * @date Nov 12, 2018
 *
 */
import { Coords, WidgetEVO } from "./WidgetEVO";

export class RemoteControllerEVO extends WidgetEVO {
    protected ws: WebSocket;
    protected lastData;
    protected timer: NodeJS.Timer;
    protected deviceOrientation;

    constructor (id: string, coords: Coords, opt?) {
        super(id, coords, opt);
        opt = opt || {};
        this.style["font-color"] = opt.fontColor || "black";
        this.style["overflow"] = "visible";

        coords = coords || { top: 0, left: 0, width: 200, height: 40 };

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        opt.type = opt.type || "remotecontroller";
        
        // invoke WidgetEVO constructor to create the widget
        super.createHTMLElement();

        this.ws = opt.ws;
        this.lastData = {};

        // this function prevents flooding clients with control data
        this.timer = setInterval(() => {
            if (this.ws) {
                // this.ws.ctrl({
                //     channelID: "helloworld",
                //     gscope: this.lastData.gscope
                // });
            }
        }, 500);

        if (window.DeviceOrientationEvent) {
            this.base.text("gscope-pre");
            this.deviceOrientation = window.addEventListener("deviceorientation", (evt) => {
                // console.log(evt);
                if (evt.gamma) {
                    // beta is the horizontal rotation. Range is between -180 and 180. Zero means axis is flush.
                    // gamma is the vertical axis. Ranges between -90 and 90.
                    this.base.text(evt.gamma.toFixed(0));
                    this.lastData = {
                        gscope: {
                            alpha: evt.alpha.toFixed(0),
                            beta: evt.beta.toFixed(0),
                            gamma: evt.gamma.toFixed(0)
                        }
                    };
                } else {
                    // send dummy value for testing
                    this.lastData = {
                        gscope: {
                            alpha: 45,
                            beta: 40,
                            gamma: 30
                        }
                    };
                }
                // if(evt.beta !== null && evt.gamma !== null){
                //     // let z = evt.alpha.toFixed(2); // In degree in the range [-360,360]
                //     let x = evt.beta.toFixed(2); // In degree in the range [-180,180]
                //     let y = evt.gamma.toFixed(2); // In degree in the range [-90,90]
                //     if(useSensitivity){
                //         // sensitivityValue higher than 75% or else the rotation will not be perceptible due to gyroscope sensor optics.        
                //         GyroscopeController.prototype.rotateSteeringAngleWithSensitivity(x,y,sensitivityValue);
                //     }else{
                //         GyroscopeController.prototype.rotateSteeringAngle(x,y);
                //     }
                // }
            }, false);
        } else {
            console.error("Gyroscope info not available :/");
        }

        this.reveal();
    }

}