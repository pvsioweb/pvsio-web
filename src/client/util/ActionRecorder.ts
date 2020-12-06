/**
 * Manages user action recording for project
 * @author Patrick Oladimeji
 * @date 3/24/14 16:17:55 PM
 */

export interface RecordedAction {
    id: string,
    timerEvent?: string,
    timerFunction?: string,
    functionText?: string,
    action?: string,
    ts: number // timestamp
};

export class Recorder {

    protected static actions: RecordedAction[] = [];//list of objects representing user actions
    protected static recording: boolean = false;

    static startRecording(): void {
        Recorder.actions = [];
        Recorder.recording = true;
    }

    static addAction(action: RecordedAction): void {
        if (Recorder.recording) {
            Recorder.actions.push(action);
            console.log(action);
        }
    }

    static stopRecording(): RecordedAction[] {
        Recorder.recording = false;
        return Recorder.actions;
    }

    static isRecording(): boolean {
        return Recorder.recording;
    }

}
