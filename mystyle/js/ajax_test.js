//hello
$(function() {
  $('#search').on('keyup', function(){
    var searchInput = $('#search');
    $.ajax({
      url: '/products',
      method: 'post',
      contentType: 'application/json',
      data: JSON.stringify({typing: searchInput.val() }),
      success:function(res){
        var mirror = document.createElement('p');
        var textnode = document.createTextNode(res.products);
        var par = document.getElementById('after');
        mirror.appendChild(textnode);
        if (par.firstChild){
          par.removeChild(par.firstChild);
        }
        par.appendChild(mirror);
        console.log(res);
      }
    })
  });
});
