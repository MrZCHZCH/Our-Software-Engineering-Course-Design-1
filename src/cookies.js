export function setCookie(key, value, exdays) {
    var exdate = new Date(); //获取时间
    exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
    //字符串拼接cookie
    window.document.cookie = key + "=" + value + ";path=/;expires=" + exdate.toGMTString();
}

export function getCookie(key) {
    if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            //判断查找相对应的值
            if (arr2[0] === key)
                return arr2[1];
        }
        return null;
    }
}

export function delCookie(key) {
    setCookie(key, "", -1)
}