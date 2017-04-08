//hello
$(function() {
  $('#search').on('keyup', function(){
    var $searchInput = $('#search').val();
    var $city = $('#city').val();
    function toUnderscore(str){
      return str.replace(/ /g, '_');
    };

        $.ajax({
          url: '/products',
          method: 'post',
          contentType: 'application/json',
          data: JSON.stringify({typing: $searchInput,
                                  city:$city}),
          success:function(res){
            var par = document.getElementById('after');
            var count = par.childNodes.length;

            if (par.firstChild){
              for(var i = 0; i < count; i++){
                par.removeChild(par.childNodes[0]);
              }
            }
            if ($searchInput !== ''){
              res.products.forEach(function(result){
                var link = document.createElement('a');
                link.setAttribute('href', 'restaurants/' + toUnderscore(result.toLowerCase()));
                var mirror = document.createElement('p');
                var textnode = document.createTextNode(result);
                link.appendChild(mirror);
                mirror.appendChild(textnode);
                par.appendChild(link);

              })
            }
          }
        })
  });
});
