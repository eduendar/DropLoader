/**
 * 
 * @author Emre Duendar
 */
function DropLoad(dropzone,form){
	
	this.dropzone = document.getElementById(dropzone);
	this.amount = 0;

	this.maxHeight = 100;
	// debuging
	this.debug = true;

	var formular = document.getElementById(form);
	formular.addEventListener('submit',function(){
		var that = this;
		var canvasElements = document.getElementsByClassName("to-input");
		var i = 0;
		[].forEach.call(canvasElements, function(div) {
			
			var input = document.createElement("input");
			input.setAttribute("type","hidden");
			input.value = div.toDataURL();
			input.name = "image"+i;
			input.id = "image"+i;
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
		that.loadImage(e.dataTransfer.files[0]);
	}, true);

	var addButton = document.createElement('div');
	addButton.className = 'add-button';

	var icon = document.createElement('i');
	icon.className = 'fa fa fa-plus';

	var hiddenInput = document.createElement('input');
	hiddenInput.setAttribute('type','file');
	hiddenInput.className = 'hidden-file-input';
	hiddenInput.addEventListener('change',function(e){
		// catch file input
		that.loadImage(e.target.files[0]);
	});

	addButton.appendChild(icon);
	addButton.appendChild(hiddenInput);

	// append to dropzone
	this.addThumbnail(addButton);

}
/**
 * 
 */
DropLoad.prototype.incrAmount = function(){
	this.amount += 1;
}
/**
 * 
 */
DropLoad.prototype.decrAmount = function(){
	this.amount -= 1;
}
/**
 * 
 */
DropLoad.prototype.addThumbnail = function(element){
	console.log(this.dropzone);
	if (this.dropzone.childElementCount == 0){
		this.dropzone.appendChild(element);
	}else{
		this.dropzone.insertBefore(element, this.dropzone.firstChild);
	}
	
}

DropLoad.prototype.loadImage = function(src){
	var that = this;
	//	Prevent any non-image file type from being read.
	if(!src.type.match(/image.*/)){
		console.log("The dropped file is not an image: ", src.type);
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
	var div = document.createElement("div");
	div.className = "div-image";
	

	this.dropzone.appendChild(div);

	
	var image1 = this.drawImage(src,false,div); 
	var image2 = this.drawImage(src,true,div);

	console.log(image1);

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
	});
	buttonWrapper.appendChild(buttonRemove);

	// add edit button to button wrapper
	var buttonEdit = document.createElement("div");
	buttonEdit.className = "action-button";
	buttonEdit.innerHTML = '<i class="fa fw fa-2x fa-rotate-right"></i>';
	buttonEdit.addEventListener("click", function(e){
		var canvas1 = e.target.parentElement.nextSibling;
		var canvas2 = canvas1.nextSibling;
		var ctx1 = canvas1.getContext("2d");
		var ctx2 = canvas2.getContext("2d");
		drawRotated(ctx1,canvas1,image1,false);
		drawRotated(ctx2,canvas2,image2,true);
		
	});
	buttonWrapper.appendChild(buttonEdit);	


}

DropLoad.prototype.drawImage = function(src,thumbnail,ele){
	var that = this;
	var image = new Image();
	image.onload = function(){
		if (thumbnail){
			image.width *= that.maxHeight  / image.height;
			image.height = that.maxHeight ;
		}
		
		var canvas = document.createElement("canvas");
		if (!thumbnail){
			canvas.className = 'hide to-input';
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
