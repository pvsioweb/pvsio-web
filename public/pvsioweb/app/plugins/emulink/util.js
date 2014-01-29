function show_pvs_theory()
{
	// Hidding stateMachine 
	document.getElementById("ContainerStateMachine").style.display = 'none';
	
	
	// Showing pvsio editor 
	document.getElementById("sourcecode-editor-wrapper").style.visibility = 'visible';
	document.getElementById("specification_log_Container").style.visibility = 'visible';
	
	document.getElementById("state_machine").disabled = false;
	document.getElementById("pvs_theory").disabled = true ;
	
	document.getElementById("state_machine_toolbar").style.display 	    = 'none';
	document.getElementById("state_machine_toolbar_menu").style.display = 'none';



}
