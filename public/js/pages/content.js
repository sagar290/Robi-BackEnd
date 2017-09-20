var tally = 2;
var sup = 'st';

$(document).ready(function() {

    $('#addNewQuestion').on('click', function() {
        //alert('clicked');
        if (tally == 2)
            sup = 'nd';
        else if (tally == 3)
            sup = 'rd';
        else if (tally == 1)
            sup = 'st';
        else {
            sup = 'th';
        }
        var id = 'question' + tally;
        var placeholderQues = 'Enter\u00A0the\u00A0'+tally+sup+'\u00A0question';
        $question = $('<div class="question"></div>');
        $form_group = $('<div class="form-group"></div>');
        $labelQues = $('<label for=' + id + '>Question ' + tally + '</label>');
        $inputQues = $('<div class="form-group"><input class="form-control" type="text" required name=' + id + ' id=' + id +' placeholder=' + placeholderQues + '></div>');
        $errorLogger = $('<div class="help-block with-error"></div>');
        $inputQues.children()
        var options = [];
        for(var i = 0; i < 4; i++) {
            var id = 'option' + tally + '' + (i+1);
            var placeholderAns = 'Enter\u00A0Option\u00A0#' + (i+1);
            $elem = $('<div class="form-group"><input class="form-control" type="text" required name=' + id + ' id=' + id + ' placeholder=' + placeholderAns + '></div>');
            options[i] = $elem;

        }
        var id = 'answer' + tally;
        $answer = $('<div class="form-group"><input class="form-control" type="text" required name=' + id + ' id=' + id + ' placeholder=Enter\u00A0the\u00A0answer\u00A0(a/b/c/d)' + '></div>');
        options[options.length] = $answer;

        $question.append($labelQues);
        $question.append($inputQues, options);
        $question.append($errorLogger);


        $('.questions').append($question);
        tally+=1;
    });

    // Course thumbnail preview
    if($('.fileUpload').length) {
        $('.fileUpload').uploadPreview({
            width: '200px',
            height: '200px',
            backgroundSize: 'cover',
            fontSize: '16px',
            borderRadius: '200px',
            border: '3px solid #dedede',
            lang: 'en', //language
        });
    }

});
