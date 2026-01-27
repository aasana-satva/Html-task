console.log('Jquery task');

$(document).ready(function () { 
    // When button is clicked paragraph should hide
    $(".btn1").click(function () { 
        $("p").hide();
    });

    $(".btn2").click(function () { 
        $("p").show();
    });

    $("#btn3").click(function(){                  //mouse event
        $(".second").toggle(2000);
    });

    $("#btn4").click(function(){                  //animation 
        $(".box").animate({
            width:"+=200px",
            height:"200px",
            fontSize:"20px"
    
        },"slow");
    });

    $(".p1").mouseleave(function(){                 //mouse event
        alert("Bye! You now leave p1!");
      });
      
      $("p").on({
        mouseenter: function(){
          $(this).css("background-color", "lightgray");
        },
        mouseleave: function(){
          $(this).css("background-color", "lightblue");
        },
        click: function(){
          $(this).css("background-color", "yellow");
        }
      });
});
