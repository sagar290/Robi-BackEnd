$(function () {
  // Replace the <textarea id="editor1"> with a CKEditor
  // instance, using default configuration.
  if($('#editor1').length != 0) CKEDITOR.replace('editor1');
  else if($('#editor2').length != 0) CKEDITOR.replace('editor2');
  else if($('#editor3').length != 0) CKEDITOR.replace('editor3');
  if($('#infobutton').length != 0) {
      $('#infobutton').on('click', function() {
         var data = CKEDITOR.instances.editor1.getData();
         $.ajax({
            url: window.location.href,
            type: 'post',
            data: {
                html: data
            }
         }).done(function(response) {
             alert(response);
         }).fail(function(jqXHR, textStatus, errorThrown){
           console.log("fail" + textStatus);
         });
      });
  }
  if($('#anouncementbutton').length != 0) {
      $('#anouncementbutton').on('click', function() {
         var data = CKEDITOR.instances.editor2.getData();
         $.ajax({
            url: window.location.href,
            type: 'post',
            data: {
                html: data
            }
         }).done(function(response) {
             alert(response);
         }).fail(function(jqXHR, textStatus, errorThrown){
           console.log("fail" + textStatus);
         });
      });
  }
  if($('#adButton').length != 0) {
      console.log("Exists");
      $('#adButton').on('click', function() {
         var data = CKEDITOR.instances.editor3.getData();
         $.ajax({
            url: window.location.href,
            type: 'post',
            data: {
                html: data
            }
         }).done(function(response) {
             alert(response);
         }).fail(function(jqXHR, textStatus, errorThrown){
           console.log("fail" + textStatus);
         });
      });
  }


});

function dosomething() {
    console.log("Clicked");
}
