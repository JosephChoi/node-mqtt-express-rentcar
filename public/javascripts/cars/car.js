$(document).ready(function(){


//    function sendAjaxRestQuery(username, phone){
//        $.ajax({
//            method: "POST",
//            url: "/users",
//            contentType: "application/json",
//            data: JSON.stringify({ 
//                username: username, 
//                phone: phone 
//            }),
//            success: function(data, textStatus, jqXHR){
//                $("#ajaxResponse").append(JSON.stringify(data));
//            },
//            error: function(jqXHR, textStatus, errorThrown){
//                $("#ajaxResponse").append(errorThrown);
//            }
//        });
//    }
    
    

    function saveCarInfomation(car, carId){
        if(carId){
            $.ajax({
                method: "POST",
                url: "/rest/cars/" + carId,
                contentType: "application/json",
                data: JSON.stringify({ 
                    car: car
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
                url: "/rest/cars",
                contentType: "application/json",
                data: JSON.stringify({ 
                    cars: [car]
                }),
                success: function(data, textStatus, jqXHR){
                    $("#carId").val(data.result.insertedIds[0]);
                    initCarSetting();
                    alert('updated');
                    console.log(data);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });    
        }
    }
    
    function initCarSetting(){
        if(!$("#carId").val()){
            $("#btnNew").hide();
        }else{
            $("#btnNew").show();
        }
    }


    $("#btnSave").on('click', function(){
        var car = {
            carRegNo: $("#carRegNo").val(),
            countryCd: $("#countryCd").val(),
            locationCd: $("#locationCd").val(),
            branchCd: $("#branchCd").val(),
            carSeqNo: $("#carSeqNo").val()
        };
        var carId = $("#carId").val();
        saveCarInfomation(car, carId);
    });
    
    
    $("#btnNew").on('click', function(){
        $("#carId").val('');
        $("#btnNew").hide();
    });
    
    $("#btnCarList").on('click', function(){
        document.location = "/cars/";
    });

    initCarSetting();
});