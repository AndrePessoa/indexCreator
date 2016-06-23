var data = [];

function renderFile( file ){
	var reader = new FileReader();
	var output = [];
	reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2

        var result = evt.target.result;

        var attrs = {
        	title: ( ( file.type = "text/html" ) ? $( "<div/>" ).append(result).find('title').text() : '' ),
        	name: file.name,
        	type: file.type,
        	size: file.size,
        	lastModifiedDate: file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
        };

        data.push(attrs);

        output.push(
			'<li>',
			'<div><strong>', 
			escape(attrs.name) + ( attrs.title ? "</strong> / title: <strong>" + attrs.title  : "" ), 
			'</strong> (', 
			attrs.type || 'n/a', ') - ',
            attrs.size, 
            ' bytes, last modified: ',
            attrs.lastModifiedDate,
            '</div>',
            '<code></code>',
            '</li>'
        );

        var dom = document.createElement('DIV');
        dom.innerHTML += output.join('');
        dom.getElementsByTagName('code')[0].textContent = ( attrs.type = "text/html" ) ? result : '' ;

        document.getElementById('list').appendChild( dom );
      }
    };

	reader.readAsText(file);
}

function processFiles( files ){
	// files is a FileList of File objects. List some properties.
	//var reader = new FileReader();

	for (var i = 0, f; f = files[i]; i++) {
		var file = f;	
		renderFile( file );
	}
}

function outputData(data){
	var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, '\t'));
	var a = document.createElement('a');
	a.href = 'data:' + data;
	a.download = 'data.json';
	a.innerHTML = 'download JSON';

	/*var container = document.forms[0];
	container.appendChild(a);*/

	eventFire( a, 'click' );
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function handleFileSelect( evt ) {
	evt.stopPropagation();
	evt.preventDefault();
	var files = evt.dataTransfer.files; // FileList object.
	processFiles( files );
}

function handleFileInput( evt ) {
	//evt.stopPropagation();
	//evt.preventDefault();
	var files = evt.target.files; // FileList object
	processFiles( files );
}

function handleDataOutput( evt ) {
	outputData(data);
}


function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
var inputFiles = document.getElementById('files');
inputFiles.addEventListener('change', handleFileInput, false);

var downloadData = document.getElementById('download');
downloadData.addEventListener('click', handleDataOutput, false);