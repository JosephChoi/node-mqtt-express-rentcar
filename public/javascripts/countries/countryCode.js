$(document).ready(function(){
    var locationDialog = $("#locationDialog").dialog({
        autoOpen: false,
        height: '260',
        width: '480',
        modal: true,
        buttons:{
            Save: function(){
                var locationCode = {
                    locationCd: $("#locationCd").val(),
                    locationNm: $("#locationNm").val(),
                    locationDesc: $("#locationDesc").val()
                };
                var countryId = $("#countryId").val();
                var locationId = $("#locationId").val();
                saveLocationCode(locationCode, countryId, locationId);
            },
            Cancel: function(){
                $(this).dialog('close');
            }
        },
        close: function(){
            $(this).children('input[type=text]').val('');
        }
    });
    
    function saveLocationCode(locationCode, countryId, locationId){
        
        if(locationId){
            $.ajax({
                method: "POST",
                url: "/rest/countries/" + countryId + "/location/" + locationId,
                contentType: "application/json",
                data: JSON.stringify({ 
                    locationCode: locationCode
                }),
                success: function(data, textStatus, jqXHR){
                    console.log(data);
                    alert('updated');
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });  
        }else{
            $.ajax({
                method: "POST",
                url: "/rest/countries/" + countryId + "/location/",
                contentType: "application/json",
                data: JSON.stringify({ 
                    locationCode: locationCode
                }),
                success: function(data, textStatus, jqXHR){
                    console.log(data);
                    alert('updated');
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });    
        }
    }

    function saveCountryCode(countryCode, countryId){
        if(countryId){
            $.ajax({
                method: "POST",
                url: "/rest/countries/" + countryId,
                contentType: "application/json",
                data: JSON.stringify({ 
                    countryCode: countryCode
                }),
                success: function(data, textStatus, jqXHR){
                    console.log(data);
                    alert('updated');
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        }else{
            $.ajax({
                method: "POST",
                url: "/rest/countries",
                contentType: "application/json",
                data: JSON.stringify({ 
                    countryCodes: [countryCode]
                }),
                success: function(data, textStatus, jqXHR){
                    $("#countryId").val(data.result.insertedIds[0]);
                    initCountryCodeSetting();
                    alert('updated');
                    console.log(data);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });    
        }
    }
   
    function initCountryCodeSetting(){
        if(!$("#countryId").val()){
            $("#btnNew").hide();
            $("#btnAddLocation").hide();
        }else{
            $("#btnNew").show();
            $("#btnAddLocation").show();
        }
    }
    

    $("#btnSave").on('click', function(){
        var countryCode = {
            countryCd: $("#countryCd").val(),
            countryNm: $("#countryNm").val(),
            countryDesc: $("#countryDesc").val()
        };
        var countryId = $("#countryId").val();
        saveCountryCode(countryCode, countryId);
    });
    
    $("#btnAddLocation").on('click', function(){
//        document.location = "/countries/" + $("#countryId").val() + "/location/setting";
        locationDialog.dialog('open');
    });


    $("#btnNew").on('click', function(){
        $("#countryId").val('');
        $("#btnNew").hide();
    });

    $("#btnCountryList").on('click', function(){
        document.location = "/countries/";
    });

    initCountryCodeSetting();
});