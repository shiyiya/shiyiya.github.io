var web_style = $("#web_style").val();
var valine_appid = $("#valine_appid").val();
var valine_appKey = $("#valine_appKey").val();

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre').forEach((block) => {
    hljs.highlightBlock(block);
  });
});

function setCookie(key, value) {
  localStorage.setItem(key, value);
}

function getCookie(key) {
  var data = localStorage.getItem(key);
  return data
}

function updateStyle() {
  $('#theme').remove();
  if (getCookie("style") == "white") {
    $("#footer").attr("style", "color: #51525d;");
    $(".flink").attr("style", "color: #51525d;");
    $(".ba").attr("style", "color: #51525d;");
    $("#bodyx").removeClass("bg_black");
    $("#update_style").attr('checked', false);
  } else {
    $("#footer").attr("style", "");
    $(".flink").attr("style", "");
    $(".ba").attr("style", "");
    $("#bodyx").addClass("bg_black");
    $("#update_style").attr('checked', true);
  }
}

if (getCookie("style") == null) {
  setCookie("style", web_style)
  updateStyle();
} else if (getCookie("style") == "white") {
  setCookie("style", "white")
  updateStyle();
} else if (getCookie("style") == "black") {
  setCookie("style", "black")
  updateStyle();
}

$("#update_style").change(function () {
  var style = $("#update_style").is(':checked');
  if (style) {
    setCookie("style", "black")
    updateStyle();
  } else {
    setCookie("style", "white")
    updateStyle();
  }
});

function toggleNightMode(){
  document.getElementById("update_style").checked ^= 1
  $("#update_style").trigger('change')
}

// 文章过时提示
if (/^\/archives\/.+/.test(location.pathname) && pub_date && Date.now() - pub_date >= 90 * 24 * 60 * 60 * 1000) {
  $('.outdated-notify .num').text(Math.floor((Date.now() - pub_date) / (24 * 60 * 60 * 1000)))
  $('.outdated-notify').show()
};

// 文章页后退按钮
$('a.back').click(function () {
  if (history.length > 1) {
    history.go(-1);
  } else {
    location.replace('/')
  }
});

// 返回顶部按钮
(function () {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return
  }

  var isShow = false, lock = false;
  var $btn = $('.back-to-top');

  $(document).scroll(function () {
    if (lock) return

    if ($(this).scrollTop() >= 1000) {
      if (!isShow) $btn.addClass('load')
      isShow = true
    } else {
      if (isShow) {
        $btn.removeClass('load')
        isShow = false
      }
    }
  })

  $btn.click(function () {
    lock = true
    $btn.addClass('ani-leave')

    $("html, body").animate({ scrollTop: 0 }, 800);

    setTimeout(function () {
      $btn.removeClass('ani-leave').addClass('leaved')
    }, 390)

    setTimeout(function () {
      $btn.addClass('ending')
    }, 120)

    setTimeout(function () {
      $btn.removeClass('load')
    }, 1500);

    setTimeout(function () {
      lock = false
      isShow = false
      $btn.removeClass('leaved ending')
    }, 2000);
  })
})();

// 点击锚链接平滑滚动到视图
$(document).on('click', 'a[href^="#"]', function (e) {
  e.preventDefault();
  var id = $(this).attr('href');
  var $el = $(id);
  if ($el.length > 0) $el[0].scrollIntoView({
    behavior: 'smooth'
  })
});

// 简单粗暴跳转指定评论
(function () {
  var hash = location.hash
  if (hash && hash.startsWith('#')) {
    setTimeout(function () {
      var $el = $(hash);
      if ($el.length > 0) $el[0].scrollIntoView({
        behavior: 'smooth'
      })
    }, 1500);
  }
})();