Crafty.scene("splash",function(){require(["lib/modernizr.custom.js"],function(){var b="click";var a=128,d=34;if(_Globals.conf.get("mobile")){d=0;$("#menu").css("top","632px");b="touchstart"}var c=Crafty.e("2D, "+_Globals.conf.get("renderType")+", Image").attr({x:a,y:d}).image("art/stuz_splash.png","no-repeat");$("#menu-start").bind(b,function(){$("#version").hide();$("#menu").hide();Crafty.scene("main")});$("#version").text("v"+_Globals.version);$("#version").show();$("#menu-howto").bind(b,function(){$("#dialog-howto").dialog({resizable:false,width:720,height:420,modal:true,title:"How to play",buttons:{"Sounds legit":function(){$(this).dialog("close")}},})});$("#menu-hiscore").bind(b,function(){Crafty.trigger("ShowHiscore",{text:undefined,refresh:false})});$("#menu-credits").bind(b,function(){$("#dialog-credits").dialog({resizable:false,width:480,height:280,modal:true,title:"Credits",buttons:{Ok:function(){$(this).dialog("close")}},})});$("#menu").show()})});