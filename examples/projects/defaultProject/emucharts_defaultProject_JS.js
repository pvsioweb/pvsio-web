//JS code generated from Emuchart
function emucharts_defaultProject_JS () {

    //declare state labels as variables
    var locked = "locked";
    var unlocked = "unlocked";
    

    //initialisation function for model
    function init() {
        var st = {"currentState":"","previousState":""};
        //initialising other state properties
        return st;
    }

    //declaration of helper functions
    function enter(newStateLabel, st) {
        st.current_state = newStateLabel;
        return state;
    }

    function leave(currentStateLabel, st) {
        st.previous_state = currentStateLabel;
        return state;
    }

    //function declarations

    function unlock (st) {
        if (st.current_state == locked) {
            st = leave('locked', st);
            st  = enter('unlocked', st);
        }
        return st;
    }

    function unlock (st) {
        if (st.current_state == unlocked) {
            st = leave('unlocked', st);
            st  = enter('unlocked', st);
        }
        return st;
    }


    return {
        IT1: IT1,
        unlock: unlock,
        unlock: unlock
    };
}

//--MIT Licenced