$(document).ready(function(){
    cityNow = null;
    url = null;
    $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
        if(remote_ip_info.ret == '1'){
            cityNow = remote_ip_info.city;//获得当地城市
            url = 'http://api.map.baidu.com/telematics/v3/weather?location=' + cityNow + '&output=json&ak=iw5m2G7ayDow8ofDdDGVUMB3&mcode=com.BaiduWeather&callback=?';
            $.getJSON(url,function(data){
               console.log(data);
               var cityresult = data.results[0];//城市天气详细信息
               var otherDatas = cityresult.weather_data;//其他日期的天气信息
               var cityToday = otherDatas[0];
               var todayPic = cityToday.dayPictureUrl.substring(cityToday.dayPictureUrl.lastIndexOf('/'));

               //当天
                $('.header').text(cityNow);
                $('.datestr').text(data.date);
                $('.teic .icon').css('background-image','url(pictures' + todayPic +')');
                var maxTem = cityToday.temperature.substring(0,1);
                var minTem = cityToday.temperature.substring(4,5);
                $('.teic .tempers').text(minTem + ' ~ ' + maxTem + '℃');
                $('.weatherf .weather').text(cityToday.weather);
                $('.weatherf .wind').text(cityToday.wind);
                var pm25 = cityresult.pm25;
                var currentStr = cityToday.date.substring(11,16) + '<br />' + 'PM2.5：' + pm25 + '&nbsp;&nbsp;&nbsp;&nbsp;' + getPmStatus(pm25.toString());
                $('.weatherf .current').html(currentStr);

                //其他时间
                var dayWeather = $('.sec');
                for(var i=1; i<4; i++){
                    var dayDetail = dayWeather.get(i-1);
                    var datas = cityresult.weather_data[i];
                    var pic = datas.dayPictureUrl.substring(datas.dayPictureUrl.lastIndexOf('/'));
                    $('.week',dayDetail).text(getDateStr(i));
                    $('.icon',dayDetail).css('background-image','url(pictures' + pic + ')');
                    var maxTems = datas.temperature.substring(0,1);
                    var minTems = datas.temperature.substring(4,5);
                    $('.temper',dayDetail).text(minTems + ' ~ ' + maxTems + '℃');
                    $('.weather',dayDetail).text(datas.weather);
                    $('.wind',dayDetail).text(datas.wind);
                }
                // pm2.5
                function getPmStatus(pm25) {
                    var pm25Status;
                    if (pm25 <= 50) pm25Status = '优';
                    if (pm25 >= 51 && pm25 <= 100) pm25Status = '良';
                    if (pm25 >= 101 && pm25 <= 150) pm25Status = '轻微污染';
                    if (pm25 >= 151 && pm25 <= 200) pm25Status = '轻度污染';
                    if (pm25 >= 201 && pm25 <= 300) pm25Status = '中度污染';
                    if (pm25 > 300) pm25Status = '重度污染';
                    if (pm25 > 500) pm25Status = '已爆表！';
                    return pm25Status;
                }
                //日期
                function getDateStr(addDayCount){
                    var dateStr = new Date(data.date);
                    dateStr.setDate(dateStr.getDate()+addDayCount);
                    var yearStr = dateStr.getFullYear();
                    var monthStr = dateStr.getMonth()+1;
                    var dayStr = dateStr.getDate();
                    var str = yearStr + '-' + monthStr + '-' + dayStr;
                    return str;
                }
            });
        }
    })
});
