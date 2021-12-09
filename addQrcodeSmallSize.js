
window.addQrcode = addQrcode;
// 參考 https://www.itread01.com/content/1546828227.html
function addQrcode(elementID, qrcodeContent) {
    var x = 10;
    var y = 20;
    $('#' + elementID).mouseover((e) => {
        var code = "<div id='code' style='position:absolute;border:1px solid #999; background:#ffffff;padding:10px;'></div>";//定義一個div為絕對佈局
        $("body").append(code);//將上面定義的div新增到body裡，因為是絕對佈局，需要設定座標位置

        $("#code").css(//設定css樣式並顯示
            {
                "top": (e.pageY - y) + "px",//e.page就是滑鼠停留點的座標，這樣就可以確定code的具體位置
                "left": (e.pageX + x) + "px"
            }
        ).show("fast");//設定成快速出現

    }).mouseout(function () {
        $("#code").remove(); //滑鼠移出時間，remove掉該div
    }).mousemove(function (e) {//滑鼠移動事件，設定具體座標，這裡設定成向上，向下top改成e.pageY+y，如果想向左可以改left
        $("#code").css({
            "top": (e.pageY + 2 * y - 100) + "px",
            "left": (e.pageX + 2*x) + "px"
        }).empty().qrcode({ //empty清除二維碼後qrcode重新顯示，不然會出現很多二維碼
            render: "table",//這裡用table難以識別比較長的網址產生的二維碼
            width: 100,
            height: 100,
            text: qrcodeContent
        });
    })
}