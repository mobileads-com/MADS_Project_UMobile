var mads = function() {
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }
    this.id = this.uniqId();
    this.tracked = [];
    this.bodyTag = document.getElementsByTagName('body')[0];
    this.headTag = document.getElementsByTagName('head')[0];
    this.contentTag = document.getElementById('rma-widget');
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};
mads.prototype.uniqId = function() {
    return new Date().getTime();
};
mads.prototype.linkOpener = function(url) {
    if (typeof url != "undefined" && url != "") {
        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        } else {
            window.open(url);
        }
    }
};
mads.prototype.tracker = function(tt, type, name, value) {
    name = name || type;
    if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');
            var src = this.custTracker[i].replace('{{type}}', type);
            src = src.replace('{{tt}}', tt);
            if (typeof value != 'undefined') {
                src += '&value=' + value;
            }
            img.src = src + '&' + this.id;
            img.style.display = 'none';
            this.bodyTag.appendChild(img);
            this.tracked.push(name);
        }
    }
};
mads.prototype.loadJs = function(js, callback) {
    var script = document.createElement('script');
    script.src = js;
    if (typeof callback != 'undefined') {
        script.onload = callback;
    }
    this.headTag.appendChild(script);
};
mads.prototype.loadCss = function(href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    this.headTag.appendChild(link);
};
mads.prototype.listen = function(options) {
    var receiveMessage = function(event) {
        options.callback(event.data);
    }
    window.addEventListener("message", receiveMessage, false);
}
var testunit = function() {
    var app = new mads();
    console.log(typeof app.bodyTag != 'undefined');
    console.log(typeof app.headTag != 'undefined');
    console.log(typeof app.custTracker != 'undefined');
    console.log(typeof app.path != 'undefined');
    console.log(typeof app.contentTag != 'undefined');
    app.loadJs('https://code.jquery.com/jquery-1.11.3.min.js', function() {
        console.log(typeof window.jQuery != 'undefined');
    });
    app.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
    app.contentTag.innerHTML = '<div class="container"><div class="jumbotron">   <h1>Hello, world!</h1>   <p>...</p>   <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p>   </div></div>';
    app.custTracker = ['http://www.tracker.com?type={{type}}&tt={{tt}}', 'http://www.tracker2.com?type={{type}}'];
    app.tracker('CTR', 'test');
    app.tracker('E', 'test', 'name');
    app.linkOpener('http://www.google.com');
};
var msgObj = {
    firstScreen: {
        title: '<p class="first-line">YOUR</p><p class="second-line">MISSION</p>',
        message: '<p class="first-line">SAVE YOUR SELF OR YOUR FRIENDS</p><p class="second-line">FROM HIGH PHONE BILLS.</p>'
    },
    secondScreen: {
        title: 'HOW?',
        message: '<p>WITH</p> ' + '<p class="medium-size">UNLIMITED</p> ' + '<p class="big-size">CALLS</p> ' + '<p class="small-size">TO ALL NETWORKS</p> ' + '<p class="medium-size">+</p> ' + '<p class="bigger-size">7GB</p> ' + '<p class="bigger-size">DATA</p>'
    },
    thirdScreen: {
        title: '<p><span class="big-size">RM</span> ' + '<span class="huge-size">70</span></p>' + '<p class="big-size">ONLY</p>'
    },
    fourthScreen: {
        message: '<p>TO ACCEPT</p>' + '<p>YOUR MISSION,</p>' + '<p>ENTER YOUR</p>' + '<p>FRIEND\'S\/YOUR OWN</p>' + '<p>NUMBER:</p>',
        phoneNumberPlaceholder: '018 XXX XXXX',
        buttonText: 'I Accept',
        formURL: 'https://api.mobileads.com/twilio/index.php'
    },
    fifthScreen: {
        title: '<p class="huge-size">WELL DONE,</p>' + '<p class="medium-size">AGENT!</p>',
        message: '<p class="first-line">THIS MESSAGE</p> ' + '<p class="second-line">WILL SELF-DESTRUCT IN</p>' + '<p class="third-line">5 SECONDS.</p>'
    }
};
var UMobileAd = function() {
    
    var sdk = new mads();
    
    this.ct = document.createElement('div');
    this.ct.setAttribute('style', 'width: 320px;height: 480px;position: absolute;top: 0;left: 0;');
    this.ct.addEventListener('click', function () {
        sdk.tracker('CTR','site');
        sdk.linkOpener('http://www.u.com.my/postpaid');
    });
    
    var startSeconds = new Date().getTime() / 1000;
    sdk.listen({
        'callback': function(msg) {
            if (typeof msg.auth != 'undefined' && typeof msg.auth.type != 'undefined' && msg.auth.type == 'closeExpandable') {
                var endSeconds = new Date().getTime() / 1000;
                var diffSeconds = endSeconds - startSeconds;
                sdk.tracker('E', 'duration', 'duration', diffSeconds);
                console.log(diffSeconds);
            }
        }
    });
    sdk.loadCss(sdk.path + 'css/style.css');
    this.phoneNumber = null;
    this.preloadImages(sdk.bodyTag);
    this.initFirstScreen(sdk.contentTag);
};
UMobileAd.prototype.preloadImages = function(parent) {
    var script = document.createElement('SCRIPT');
    var str = '';
    str = str + 'var pic1 = new Image();' + 'var pic2 = new Image();' + 'var pic3 = new Image();' + 'var pic4 = new Image();' + 'var pic5 = new Image();' + 'var pic6 = new Image();' + 'var pic7 = new Image();' + 'var pic8 = new Image();' + 'var pic9 = new Image();' + 'pic1.src=sdk.path+"img/explosion.png";' + 'pic2.src=sdk.path+"img/hero.png";' + 'pic3.src=sdk.path+"img/screen1-bg.png";' + 'pic4.src=sdk.path+"img/screen2-bg.png";' + 'pic5.src=sdk.path+"img/screen3-bg.png";' + 'pic6.src=sdk.path+"img/screen4-bg.png";' + 'pic7.src=sdk.path+"img/screen5-bg.png";' + 'pic8.src=sdk.path+"img/screen6-bg.png";' + 'pic9.src=sdk.path+"img/screen8-bg.png";';
    script.innerHTML = str;
    parent.appendChild(script);
};
UMobileAd.prototype.initFirstScreen = function(parent) {
    var div = document.createElement('DIV');
    var title = document.createElement('P');
    var message = document.createElement('P');
    title.setAttribute('class', 'title');
    title.innerHTML = msgObj.firstScreen.title;
    div.appendChild(title);
    message.setAttribute('class', 'msg');
    message.innerHTML = msgObj.firstScreen.message;
    div.appendChild(message);
    div.setAttribute('class', 'first-screen');
    div.setAttribute('id', 'first-screen');
    parent.appendChild(div);
    this.showSecondScreen(parent, 2000);
};
UMobileAd.prototype.showSecondScreen = function(parent, timeout) {
    var firstScreen = document.getElementById('first-screen');
    var div = document.createElement('DIV');
    var title = document.createElement('P');
    var message = document.createElement('P');
    var me = this;
    setTimeout(function() {
        firstScreen.style.display = 'none';
        title.setAttribute('class', 'title');
        title.innerHTML = msgObj.secondScreen.title;
        div.appendChild(title);
        message.setAttribute('class', 'msg');
        message.innerHTML = msgObj.secondScreen.message;
        div.appendChild(message);
        div.setAttribute('class', 'second-screen');
        div.setAttribute('id', 'second-screen');
        parent.appendChild(div);
        me.showThirdScreen(parent, 2000);
    }, timeout);
};
UMobileAd.prototype.showThirdScreen = function(parent, timeout) {
    var secondScreen = document.getElementById('second-screen');
    var div = document.createElement('DIV');
    var title = document.createElement('P');
    var me = this;
    setTimeout(function() {
        secondScreen.style.display = 'none';
        title.setAttribute('class', 'title');
        title.innerHTML = msgObj.thirdScreen.title;
        div.appendChild(title);
        div.setAttribute('class', 'third-screen');
        div.setAttribute('id', 'third-screen');
        parent.appendChild(div);
        me.show4thScreen(parent, timeout);
    }, timeout);
};
UMobileAd.prototype.show4thScreen = function(parent, timeout) {
    var thirdScreen = document.getElementById('third-screen');
    var div = document.createElement('DIV');
    var message = document.createElement('P');
    var me = this;
    var form = document.createElement('FORM');
    var input = document.createElement('INPUT');
    var submit = document.createElement('INPUT');
    var span = document.createElement('SPAN');
    var notification = document.createElement('P');
    
    setTimeout(function() {
        thirdScreen.style.display = 'none';
        message.setAttribute('class', 'msg');
        message.innerHTML = msgObj.fourthScreen.message;
        div.appendChild(message);
        form.setAttribute('action', msgObj.fourthScreen.formURL);
        form.setAttribute('method', 'post');
        form.setAttribute('style', 'position: relative;z-index:10;');
        div.appendChild(form);
        div.appendChild(me.ct);
        span.setAttribute('id', 'label');
        span.innerHTML = '+6';
        form.appendChild(span);
        input.setAttribute('type', 'text');
        input.setAttribute('required', 'true');
        input.setAttribute('id', 'phone-number');
        input.setAttribute('name', 'phone-number');
        form.appendChild(input);
        notification.setAttribute('class', 'notification hidden');
        notification.setAttribute('id', 'alert-notification');
        notification.innerHTML = 'Please enter a valid phone number.';
        form.appendChild(notification);
        submit.setAttribute('type', 'button');
        submit.setAttribute('value', msgObj.fourthScreen.buttonText);
        submit.setAttribute('id', 'submit-btn');
        submit.setAttribute('name', 'submit-btn');
        form.appendChild(submit);
        div.setAttribute('class', 'fourth-screen');
        div.setAttribute('id', 'fourth-screen');
        parent.appendChild(div);
        submit.addEventListener('click', me.submitForm, false);
    }, 2000);
};
UMobileAd.prototype.submitForm = function() {
    document.getElementById('submit-btn').style.marginTop = '20px';
    document.getElementById("alert-notification").className = "";
    document.getElementById("alert-notification").className = "notification hidden";
    var inputValue = document.getElementById('phone-number').value;
    var num = isNaN(inputValue);
    if (inputValue.length > 0 && num == false) {
        var me = ad;
        me.phoneNumber = inputValue;
        me.show5thScreen(document.getElementById('rma-widget'), 500);
    } else if (num) {
        document.getElementById('alert-notification').innerHTML = "Please enter a valid phone number."
        document.getElementById("alert-notification").className = "";
        document.getElementById("alert-notification").className = "notification";
        document.getElementById('submit-btn').style.marginTop = '5px'
        document.getElementById('phone-number').focus();
    } else {
        document.getElementById('alert-notification').innerHTML = "Please enter your phone number."
        document.getElementById("alert-notification").className = "";
        document.getElementById("alert-notification").className = "notification";
        document.getElementById('submit-btn').style.marginTop = '5px'
        document.getElementById('phone-number').focus();
    }
};
UMobileAd.prototype.show5thScreen = function(parent, timeout) {
    var fourthScreen = document.getElementById('fourth-screen');
    var div = document.createElement('DIV');
    var title = document.createElement('P');
    var message = document.createElement('P');
    var me = this;
    setTimeout(function() {
        fourthScreen.style.display = 'none';
        title.setAttribute('class', 'title');
        title.innerHTML = msgObj.fifthScreen.title;
        div.appendChild(title);
        message.setAttribute('class', 'msg');
        message.innerHTML = msgObj.fifthScreen.message;
        div.appendChild(message);
        div.setAttribute('class', 'fifth-screen');
        div.setAttribute('id', 'fifth-screen');
        parent.appendChild(div);
        me.show6thScreen(parent, 3000);
    }, timeout);
};
UMobileAd.prototype.show6thScreen = function(parent, timeout) {
    var fifthScreen = document.getElementById('fifth-screen');
    var div = document.createElement('DIV');
    var title = document.createElement('P');
    var me = this;
    setTimeout(function() {
        fifthScreen.style.display = 'none';
        title.setAttribute('class', 'title');
        title.innerHTML = '5';
        div.appendChild(title);
        div.setAttribute('class', 'sixth-screen');
        div.setAttribute('id', 'sixth-screen');
        parent.appendChild(div);
        me.countDown(4, title, parent);
    }, timeout);
};
UMobileAd.prototype.show7thScreen = function(parent, timeout) {
    var div = document.createElement('DIV');
    var explosionImg = document.createElement('IMG');
    var heroImg = document.createElement('IMG');
    var xhr = new XMLHttpRequest();
    var me = this;
    var params = 'mobile=+6' + me.phoneNumber;
    explosionImg.setAttribute('class', 'explosion-img');
    explosionImg.setAttribute('src', 'img/explosion.png');
    div.appendChild(explosionImg);
    heroImg.setAttribute('class', 'hero-img');
    heroImg.setAttribute('src', 'img/hero.png');
    div.appendChild(heroImg);
    div.setAttribute('class', 'seventh-screen');
    div.setAttribute('id', 'seventh-screen');
    div.appendChild(this.ct);
    parent.appendChild(div);
    
    xhr.open("POST", msgObj.fourthScreen.formURL, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            setTimeout(function() {
                var lastScreen = document.createElement('DIV');
                var seventhScreen = document.getElementById('seventh-screen');
                seventhScreen.style.display = 'none';
                lastScreen.setAttribute('class', 'eight-screen');
                lastScreen.setAttribute('id', 'eight-screen');
                lastScreen.appendChild(me.ct);
                parent.appendChild(lastScreen);
            }, timeout);
        }
    };
    setTimeout(function() {
        xhr.send(params);
    }, 1000);
};
UMobileAd.prototype.countDown = function(duration, display, parent) {
    var timer = duration;
    var seconds;
    var sixthScreen = document.getElementById('sixth-screen');
    var me = this;
    var countDownTimer = setInterval(function() {
        seconds = parseInt(timer % 60, 10);
        display.textContent = seconds;
        if (--timer < 0) {
            timer = duration;
        }
        if (seconds == 0) {
            clearInterval(countDownTimer);
            setTimeout(function() {
                sixthScreen.style.display = 'none';
                me.show7thScreen(parent, 3000);
            }, 1000);
        }
    }, 1000);
};
var ad = new UMobileAd();