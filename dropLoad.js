/**
 * 
 * @author Emre Duendar
 */
function DropLoad(dropzone,options){

	this.defaultOptions = {
		maxHeight: 100,
		maxAmount: 2,
		autoMergeToForm: 'formular',
		maxImageSize: 5000000 // 5MB
	};

	this.dropzone = document.getElementById(dropzone);
	this.amount = 0;

	function extend(dft,opt){
		for (var property in opt) {
			if (opt.hasOwnProperty(property)) {
				dft[property] = opt[property];
			}
		}
	}

	extend(this.defaultOptions,options);

	var form = document.getElementById(this.defaultOptions.autoMergeToForm);
	form.addEventListener('submit',function(){
		var that = this;
		var canvasElements = document.getElementsByClassName("origin");
		var i = 0;
		[].forEach.call(canvasElements, function(div) {
			
			var input = document.createElement("input");
			input.setAttribute("type","hidden");
			input.value = div.toDataURL();
			input.name = "base64_image"+i;
			input.id = "base64_image"+i;
			that.appendChild(input);
		  i += 1;
		});		
	});

}
/**
 * 
 */
DropLoad.prototype.create = function(){
	var that = this;
	
	this.dropzone.className = 'dropzone';
	this.dropzone.addEventListener("dragover", function(e){
		e.preventDefault();
	}, true);

	this.dropzone.addEventListener("drop", function(e){
		e.preventDefault();
		that.dropzone.className = "dropzone";

		var files = e.dataTransfer.files;
		if (files.length > 0){
			for (var i = 0; i < files.length; i++) {
				var file = files.item(i);
				that.loadImage(file);
			}

		}

	}, true);

	this.dropzone.addEventListener("dragend", function (e) {
		that.dropzone.className = "dropzone";
	}, true);
	this.dropzone.addEventListener("dragenter", function (e) {
		if (that.amount < that.defaultOptions.maxAmount){
			that.dropzone.className = "dropzone dz-drop-allowed";
		}else{
			that.dropzone.className = "dropzone dz-drop-not-allowed";
		}
	}, true);
	this.dropzone.addEventListener("dragleave", function (e) {
		that.dropzone.className = "dropzone";
	}, true);

	var addButton = document.createElement('div');
	addButton.className = 'add-button';
	addButton.setAttribute('title', 'Zum Auswählen klicken');

	var icon = document.createElement('i');
	icon.className = 'fa fw fa-plus';

	var hiddenInput = document.createElement('input');
	hiddenInput.setAttribute('type','file');
	hiddenInput.setAttribute('multiple','multiple');
	hiddenInput.className = 'hidden-file-input';
	hiddenInput.addEventListener('change',function(e){
		// catch file input
		var files = e.target.files;
		if (files.length > 0){
			for (var i = 0; i < files.length; i++) {
				var file = files.item(i);
				that.loadImage(file);
			}

			var input = e.target;
			//clear file input
			input.value = "";
		}

	});

	addButton.appendChild(icon);
	addButton.appendChild(hiddenInput);

	// append to dropzone
	this.addThumbnail(addButton);

}
/**
 * 
 */
DropLoad.prototype.incrementAmount = function(){
	this.amount += 1;
}
/**
 * 
 */
DropLoad.prototype.decrementAmount = function(){
	this.amount -= 1;
}
/**
 * 
 */
DropLoad.prototype.addThumbnail = function(element){
	if (this.dropzone.childElementCount == 0){
		this.dropzone.appendChild(element);
	}else{
		this.dropzone.insertBefore(element, this.dropzone.firstChild);
		this.incrementAmount();
	}
	
}

DropLoad.prototype.loadImage = function(src){
	var that = this;

	//	Prevent any non-image file type from being read.
	if(!src.type.match(/image.*/)){
		console.log("The dropped file is not an image: ", src.type);
		return;
	}
	if(src.size > this.defaultOptions.maxImageSize){
		console.log("Image to big");
		return;
	}

	//	Create our FileReader and run the results through the render function.
	var reader = new FileReader();
	reader.onload = function(e){
		that.render(e.target.result);
	};
	reader.readAsDataURL(src);
}

DropLoad.prototype.render = function(src){
	var that = this;
	var div = document.createElement("div");
	div.className = "div-image no-select";
	div.setAttribute("data-degrees",0);

	this.addThumbnail(div);
	
	var image1 = this.drawImage(src,false,div);
	this.origin = image1;
	var image2 = this.drawImage(src,true,div);

	var buttonWrapper = document.createElement("div");
	buttonWrapper.className = 'button-wrapper';
	div.appendChild(buttonWrapper);
	
	// add remove button to button wrapper
	var buttonRemove = document.createElement("div");
	buttonRemove.className = "action-button";
	buttonRemove.innerHTML = '<i class="fa fw fa-2x fa-remove"></i>';
	buttonRemove.addEventListener("click", function(e){
		// delete element
		e.target.parentElement.parentElement.remove();
		that.decrementAmount();
	});
	buttonWrapper.appendChild(buttonRemove);

	// add edit button to button wrapper
	var buttonEdit = document.createElement("div");
	buttonEdit.className = "action-button";
	buttonEdit.innerHTML = '<i class="fa fw fa-2x fa-rotate-right"></i>';
	buttonEdit.addEventListener("click", function(e){
		var editor = new that.openEditor();
		editor.create();
		/*
		var canvas_origin = e.target.parentElement.nextSibling;
		var canvas_thumbnail = canvas_origin.nextSibling;
		var ctx_origin = canvas_origin.getContext("2d");
		var ctx_thumbnail = canvas_thumbnail.getContext("2d");
		var degrees = e.target.parentElement.parentElement.getAttribute('data-degrees');
		degrees += 90;
		that.rotate(ctx_origin,canvas_origin,image1,degrees);
		that.rotate(ctx_thumbnail,canvas_thumbnail,image2,degrees);
		*/
		
	});
	buttonWrapper.appendChild(buttonEdit);	


}

DropLoad.prototype.drawImage = function(src,thumbnail,ele){
	var that = this;
	var image = new Image();
	image.onload = function(){
		if (thumbnail){
			image.width *= that.defaultOptions.maxHeight  / image.height;
			image.height = that.defaultOptions.maxHeight ;
		}
		
		var canvas = document.createElement("canvas");
		if (!thumbnail){
			canvas.className = 'hide origin';
			canvas.id = 'test';
		}
		ele.appendChild(canvas);
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.width = image.width;
		canvas.height = image.height;
		ctx.drawImage(image, 0, 0, image.width, image.height);
	};
	image.src = src;
	return image;
}

DropLoad.prototype.rotate = function(ctx,canvas,image,degrees){
	var w = canvas.width;
	var h = canvas.height;
	ctx.clearRect(0,0,w,h);
	ctx.save();
	ctx.translate(w/2,h/2);
	ctx.rotate(degrees*Math.PI / 180);
	ctx.translate(-w/2,-h/2);

	ctx.drawImage(image,0,0,image.width,image.height);
	ctx.restore();


};

DropLoad.prototype.openEditor = function(){

	function _init(overlay,dialog){
		this.overlay = overlay;
		this.dialog = dialog;
	}

	return {

		create: function(){
			var that = this;
			var overlay = document.createElement("div");
			overlay.className = "dz-overlay";
			document.body.appendChild(overlay);

			document.body.addEventListener("keyUp",function (e) {
				if (e.which == 9){

				}
			});

			var dialog = document.createElement("div");
			dialog.className = 'dz-dialog';
			document.body.appendChild(dialog);

			/* HEADER */
			var header = document.createElement("div");
			header.className = "dz-dialog-header";
			var title = document.createElement("div");
			title.className = "title";
			title.innerText = "Image Editor";
			header.appendChild(title);
			var btnClose = document.createElement("i");
			btnClose.className = "fa fw fa-close close-btn";
			btnClose.addEventListener("click", function(){
				that.closeDialog();
			});
			header.appendChild(btnClose);
			dialog.appendChild(header);

			var body = document.createElement("div");
			body.className = "dz-dialog-body";
			dialog.appendChild(body);

			/* FOOTER */
			var footer = document.createElement("div");
			footer.className = "dz-dialog-footer";
			dialog.appendChild(footer);
			var btnCancel = document.createElement("button");
			btnCancel.className = "btn btn-cancel";
			btnCancel.innerHTML = "<i class='fa fw fa-close'></i> Abbrechen";
			footer.appendChild(btnCancel);

			var btnSave = document.createElement("button");
			var btnSave = document.createElement("button");
			btnSave.className = "btn btn-save";
			btnSave.innerHTML = "<i class='fa fw fa-save'></i> Speichern";
			footer.appendChild(btnSave);

			_init(overlay,dialog);
		},

		closeDialog: function () {
			this.overlay.parentNode.removeChild(this.overlay);
			this.dialog.parentNode.removeChild(this.dialog);
		}

	}
};