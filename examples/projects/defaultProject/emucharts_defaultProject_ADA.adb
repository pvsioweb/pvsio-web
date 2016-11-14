package body emucharts_Ada is
    -- declare function implementations
    function enter (ms: MachineState; st: in out State) return State
    is
    begin
        st.current_state := ms;
        return st;
    end enter;

    function leave (ms: MachineState; st: in out State) return State
    is
    begin
        st.previous_state := ms;
        return st;
    end leave;

    
    function unlock (st: in out State) return State
    is
    begin
        if st.current_state = locked then
            st := leave(locked, st);
            st := enter(unlocked, st);
        end if;
        return st;
    end unlock;
    
    function unlock (st: in out State) return State
    is
    begin
        if st.current_state = unlocked then
            st := leave(unlocked, st);
            st := enter(unlocked, st);
        end if;
        return st;
    end unlock;
    
    function IT1 (st: in out State) return State
    is
    begin
        return st;
    end IT1;
    
end emucharts_Ada;
