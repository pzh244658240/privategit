var doc = this.edit.doc; 
var cmd = this.edit.cmd; 
/* Paste in chrome.*/
/* Code reference from http://www.foliotek.com/devblog/copy-images-from-clipboard-in-javascript/. */
if(K.WEBKIT)
{
    $(doc.body).bind('paste', function(ev)
    {
        var $this = $(this);
        var original =  ev.originalEvent;
        var file =  original.clipboardData.items[0].getAsFile();
        var reader = new FileReader();
        reader.onload = function (evt) 
        {
            var result = evt.target.result; 
            var result = evt.target.result;
            var arr = result.split(",");
            var data = arr[1]; // raw base64
            var contentType = arr[0].split(";")[0].split(":")[1];
            html = '<img src="' + result + '" alt="" />';
            $.post(createLink('file', 'ajaxPasteImage'), {editor: html}, function(data){cmd.inserthtml(data);});
        };
        reader.readAsDataURL(file);
    });
}
/* Paste in firfox.*/
if(K.GECKO)
{
    K(doc.body).bind('paste', function(ev)
    {
        setTimeout(function()
        {
            var html = K(doc.body).html();
            if(html.search(/<img src="data:.+;base64,/) > -1)
            {
                $.post(createLink('file', 'ajaxPasteImage'), {editor: html}, function(data){K(doc.body).html(data);});
            }
        }, 80);
    });
}
/* End */
