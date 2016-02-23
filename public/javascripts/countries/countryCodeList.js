$(document).ready(function(){


    function deleteCountryCode(countryId){

        $.ajax({
            method: "POST",
            url: "/rest/countries/" + countryId,
            contentType: "application/json",
            data: JSON.stringify({ 
                countryCode: {
                    isDeleted: true
                }
            }),
            success: function(data, textStatus, jqXHR){
                console.log(data);
                alert('deleted');

                $('tr').each(function(index, element){
                    if($(this).attr('data-country-id') === countryId){
                        $(this).slideUp();
                    }
                });

            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(errorThrown);
            }
        });
    }

    $(".lnkDeleteCountryCode").on('click', function(e){
        var countryId = $(e.currentTarget).parents('tr').attr('data-country-id');
        deleteCountryCode(countryId);
    });    

    $("#btnNew").on('click', function(e){
        document.location = '/countries/setting/';
    });

});