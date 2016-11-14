package emucharts_Ada is
    --declare variable and function signatures
    TYPE bool is (true, false);
    TYPE MachineState is (
        locked,unlocked
    );

    TYPE State is record
            current_state, previous_state: MachineState;
            
        end record;

    -- function signatures

    function enter (ms: MachineState; st: in out State) return State;
    function leave (ms: MachineState; st: in out State) return State;


    function unlock (st: in out State) return State;
    function unlock (st: in out State) return State;
    function IT1 (st: in out State) return State;
    
end emucharts_Ada;
