(function ($) {
    $.fn.imagePicker = function( options ) {
        // Define plugin options
        var settings = $.extend({
            // Input name attribute
            name: "",
            // Classes for styling the input
            class: "form-control",
            // Icon which displays in center of input
            icon: "fas fa-plus",

            url: ""
        }, options );
        // Create an input inside each matched element
        if (options.url) {
            return $(this).html(create_btn(this, settings, true));
        } else {
            return $(this).html(create_btn(this, settings, false));
        }

    };
 
    // Private function for creating the input element
    function create_btn(that, settings, isUpdate) {
        // The input icon element
        if (isUpdate) {
            var preview = create_preview(that, settings.url, settings, null);

            $(that).html(preview);
        } else {
            var picker_btn_icon = $('<i class="'+settings.icon+'"></i>');
        
            // The actual file input which stays hidden
            var picker_btn_input = $('<input type="file" name="'+settings.name+'" accept="image/*"/>');
            
            // The actual element displayed
            var picker_btn = $('<div class="'+settings.class+' img-upload-btn"></div>')
                .append(picker_btn_icon)
                .append(picker_btn_input);

            picker_btn_input.change(function() {
                if ($(this).prop('files')[0]) {
                    // Use FileReader to get file
                    var reader = new FileReader();
                    
                    // Create a preview once image has loaded
                    reader.onload = function(e) {
                        var preview = create_preview(that, e.target.result, settings, picker_btn_input);
                        $(that).html(preview);
                    }
                    
                    // Load image
                    reader.readAsDataURL(picker_btn_input.prop('files')[0]);
                }                
            });
        }
            
        // File load listener
    

        return picker_btn
    };
    
    // Private function for creating a preview element
    function create_preview(that, src, settings, picker_input) {
        // The preview image
        var picker_preview_image = $('<img src="'+src+'" class="img-responsive img-rounded" />');
        
        // The remove image button
        var picker_preview_remove = $('<button class="btn page-button button-style-1 type-2 btn-remove-img-upload"><small>Remove</small></button>');

        if (picker_input) {
            picker_input[0].hidden = true
        }
        
        // The preview element
        var picker_preview = $('<div class="text-center"></div>')
            .append(picker_preview_image)
            .append(picker_preview_remove)
            .append(picker_input);
        // Remove image listener
        picker_preview_remove.click(function() {
            var btn = create_btn(that, settings, false);
            $(that).html(btn);
        });
        
        return picker_preview;
    };
    
}(jQuery));

$(document).ready(function() {
    // $('.img-picker').imagePicker({name: 'avatarImage'});

    let avatarPicker = $(document.getElementById('avatarPicker'))
    
    if (avatarPicker[0].attributes[2].value) {
        avatarPicker.imagePicker({name: 'avatarPicker', url: avatarPicker[0].attributes[2].value});
    } else {
        avatarPicker.imagePicker({name: 'avatarPicker'});
    }

    let descriptionPicker1 = $(document.getElementById('descriptionPicker1'))
    
    if (descriptionPicker1[0].attributes[2].value) {
        descriptionPicker1.imagePicker({name: 'descriptionPicker1', url: descriptionPicker1[0].attributes[2].value});
    } else {
        descriptionPicker1.imagePicker({name: 'descriptionPicker1'});
    }

    let descriptionPicker2 = $(document.getElementById('descriptionPicker2'))
    if (descriptionPicker2[0].attributes[2].value) {
        descriptionPicker2.imagePicker({name: 'descriptionPicker2', url: descriptionPicker2[0].attributes[2].value});
    } else {
        descriptionPicker2.imagePicker({name: 'descriptionPicker2'});
    }

    let descriptionPicker3 = $(document.getElementById('descriptionPicker3'))
    if (descriptionPicker3[0].attributes[2].value) {
        descriptionPicker3.imagePicker({name: 'descriptionPicker3', url: descriptionPicker3[0].attributes[2].value});
    } else {
        descriptionPicker3.imagePicker({name: 'descriptionPicker3'});
    }

    let descriptionPicker4 = $(document.getElementById('descriptionPicker4'))
    if (descriptionPicker4[0].attributes[2].value) {
        descriptionPicker4.imagePicker({name: 'descriptionPicker4', url: descriptionPicker4[0].attributes[2].value});
    } else {
        descriptionPicker4.imagePicker({name: 'descriptionPicker4'});
    }
})
