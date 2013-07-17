var Debug = 0;            // DebugMode (writes to Error-Console)
var toolbar = null;

function onload() {

	// Create Toolbar instance
	opera.postError("Start");

	toolbar = new FVD_Single();

}

window.addEventListener( "load", onload, false );
