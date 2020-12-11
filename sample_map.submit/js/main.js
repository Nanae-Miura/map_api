var firebaseConfig = {
    apiKey: "",
    authDomain: "mapping-f583b.firebaseapp.com",
    databaseURL: "https://mapping-f583b.firebaseio.com",
    projectId: "mapping-f583b",
    storageBucket: "mapping-f583b.appspot.com",
    messagingSenderId: "540647587781",
    appId: "1:540647587781:web:56ce3881ef4e0882af55ac",
    measurementId: "G-KJYMFY25DH"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();



//このletって必要なのか？
let map,searchManager;

//ページを開いたときに表示させる地図
    function GetMap(getmap) {
        map = new Microsoft.Maps.Map('#myMap', {
            center: new Microsoft.Maps.Location(47.6149, -122.1941), //Location center position
            mapTypeId: Microsoft.Maps.MapTypeId.load, //Type: [load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
            zoom: 8  //Zoom:1=zoomOut, 20=zoomUp[ 1~20 ]
        });
    }


    function locateMe() {
        if (window.navigator != null && 
            window.navigator.geolocation != null) {
            window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            alert("Geolocation not supported");
        }
    }

    //データベースに送る用の宣言
    //データベースの取得した住所y緯度経度を保存しようと思った
  // const database=firebase.database();
   // Create a new post reference with an auto-generated id
  // var postListRef = firebase.database().ref('posts');

    function successCallback(p){

    position = p;
    //console.log(position);
//
//    // Position オブジェクトから Location オブジェクト作成
//    //地図に反映させます
    var loc = new Microsoft.Maps.Location(p.coords.latitude, p.coords.longitude);
    //var geocoder=new Microsoft.Maps.
     // プッシュピンの表示
     var pin = new Microsoft.Maps.Pushpin(loc);

    // OK
    //console.log(loc);
    // 地図上の Entity オブジェクト削除
    map.entities.clear();
    map.entities.push(pin);



let lat=p.coords.latitude;
let lng=p.coords.longitude;

////取得できてる
//console.log(lat);
//console.log(lng);


//    //ブラウザに表示
//    //locのままではブラウザには表示できないみたいだ。
//    //letで宣言したらできた！
$("#location").addClass("border");
  $("#location").append("[" + lat +","+　lng + "]\nです。");
    //alert( loc ) ;
//
//    // 結果の場所へ移動
    map.setView({center: loc, zoom: 12});
//上記で緯度経度を取得できた


//////  緯度経度から住所を割り出す
////geocoderというので可能らしい
////住所から緯度経度を割り出すことをgeocodingといいます。
////今回は逆リバース
reverseGeocode();

//以下reversegeocoding
function reverseGeocode(){
  if (!searchManager) {
    //Create an instance of the search manager and call the reverseGeocode function again.
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        searchManager = new Microsoft.Maps.Search.SearchManager(map);
        reverseGeocode();
    });
}else 
{
  var searchRequest = {
    //地図の真ん中を読み込む
      location: map.getCenter(),
      callback: function (r) {
          //Tell the user the name of the result.
          //処理の結果イコールrの名前
          //alert(r.name);
          //ここの書き方が難しい。全体を文字列で囲む。+かっこ内も文字列に
          //＋でつなぐ
          $("#adressoutput").addClass("border");
          $("#adressoutput").append("["+r.name+"]\nです。");
          //("[" + lat +","+　lng + "]\nです。");
          //連続で押すとずっとAPPENDされる仕様になってる
      },
      errorCallback: function (e) {
          //If there is an error, alert the user about it.
          alert("Unable to reverse geocode location.");
      }
  };
         //Make the reverse geocode request.
         searchManager.reverseGeocode(searchRequest);
        }
    }


}
function errorCallback(error) {
    var message = "";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            // 位置情報へのアクセスをユーザーが拒否した
            message = "Permission denied";
            break;
        case error.POSITION_UNAVAILABLE:
            // 位置を特定できなかった
            message = "Position unavailable";
            break;
        case error.TIMEOUT:
            // 取得が許容時間内に完了しなかった
            message = "timeout";
            break;
    }
    alert(message);
}

//取得した位置情報をのURLを生成してシェアできる様にしたかった
//以下の仕様だとWebサイトのURLの情報のみ含む()

var href =location.href; //1.URLを取得しエンコードする
var getTitle = $('title').html(); //2.ページのタイトルを取得
 
//3.URLを取得しエンコードする
var snsUrl = encodeURIComponent(href);
var snsTitle = encodeURIComponent(getTitle);
 
$('.sns_link').each(function(){
 
  var sns_obj = $(this).attr('id');　//4.ID名を取得
  var snsCase = sns_obj;
 
  //5.IDを判定してリンク先を出力する
  switch (snsCase){
 
    case 'sns_line':
    $(this).attr('href','http://line.me/R/msg/text/?'+ snsTitle +'%20'+ snsUrl);
    break;
 
    //フェイスブックのURLが有効じゃない？様で使えない
    case 'sns_fb':
    $(this).attr('href','http://www.facebook.com/sharer.php?u='+ snsUrl);
    break;
 
    case 'sns_tw':
    $(this).attr('href','http://twitter.com/share?text='+ snsTitle + '&url='+ snsUrl);
    break;
 
    case 'sns_plus':
    $(this).attr('href','https://plus.google.com/share?url='+ snsUrl);
    break;
  }
 
  });

