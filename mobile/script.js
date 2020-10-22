$(document).ready(() => {
  initializeWhiteboard();
});

let state = {
  login: 0,
  tool: {
    pen: 1,
    highlighter: 1,
    eraser: 1
  },
};

function loadContent(argument) {
  let file = argument.file,
    parent = argument.parent,
    callback = argument.callback;
  $.get(file, function (data) {
    $(parent).html(data);
  }).done(function () {
    if (callback && typeof callback === "function") {
      callback();
    }
  });
}

function initializeHome() {
  if (state.login === 0) {
    loadContent({
      file: "./page/home/zero.html",
      parent: document.querySelector(".vy-app"),
      callback: () => {
        $(".vy-whiteboard__item").click(() => {
          initializeWhiteboard();
        })
      }
    })
  } else {
    loadContent({
      file: "./page/home/content.html",
      parent: document.querySelector(".vy-app"),
      callback: () => {
        $(".vy-whiteboard__item").click(() => {
          initializeWhiteboard();
        })
      }
    })
  }
}

function initializeWhiteboard() {
  loadContent({
    file: "./page/whiteboard/content.html",
    parent: document.querySelector(".vy-app"),
    callback: () => {
      initializeToast();
    }
  })
}

function initializeToast() {
  if (state.login === 0) {
    loadContent({
      file: "./page/whiteboard/toast/login.html",
      parent: document.querySelector(".vy-toast"),
      callback: () => {
        $(".vy-toast").fadeIn("fast");

        $(".vy-toast button").click(() => {
          $(".vy-toast").fadeOut("fast");
        })
      }
    })
  }
}

function initializeHeader() {
  $(".vy-header button.is-back").click(() => {
    initializeHome()
  })

  $(".vy-header button.is-add").click(() => {
    loadContent({
      file: "./page/whiteboard/toast/link.html",
      parent: document.querySelector(".vy-toast"),
      callback: () => {
        $(".vy-toast").addClass("is-success");
        $(".vy-toast").fadeIn("fast");

        setTimeout(() => {
          $(".vy-toast").fadeOut("fast", () => {
            $(".vy-toast").removeClass("is-success");
          });
        }, 2000);
      }
    })
  })

  $(".vy-header button.is-setting").click(() => {
    initializeSetting();
  })
}

function initializeSetting() {
  loadContent({
    file: "./page/whiteboard/setting/content.html",
    parent: document.querySelector("#js-page-setting"),
    callback: () => {
      $("#js-page-setting").fadeIn("fast");
      $("#js-page-setting .vy-menu__panel").css("right", "0");

      $("#js-page-setting .vy-menu__panel").click(() => {
        $("#js-page-setting .vy-menu__panel").css("right", "-100%");
        $("#js-page-setting").fadeOut("fast");
      })
    }
  })
}

function initializeToolbar() {
  $(".vy-toolbar.is-level-1 .vy-toolbar__item").click((event) => {
    let classList = $(event.target).attr("class");
    let tool = classList.replace("vy-toolbar__item is-", "");

    loadContent({
      file: `./page/whiteboard/toolbar/level-2/${tool}.html`,
      parent: document.querySelector("#js-page-toolbar-level-2"),
      callback: () => {
        initializeTool(tool);
        $("#js-page-toolbar-level-1").slideUp("fast");
        $("#js-page-toolbar-level-2").slideDown("fast");
      }
    })
  })
}

function initializeTool(tool) {
  $(`.vy-toolbar.is-level-2 .vy-toolbar__item.is-active`).removeClass("is-active");
  if (tool === "pen") {
    document.querySelectorAll(".vy-toolbar.is-level-2 .vy-toolbar__item")[state.tool.pen].classList.add("is-active");
  } else if (tool === "highlighter") {
    document.querySelectorAll(".vy-toolbar.is-level-2 .vy-toolbar__item")[state.tool.highlighter].classList.add("is-active");
  } else if (tool === "eraser") {
    document.querySelectorAll(".vy-toolbar.is-level-2 .vy-toolbar__item")[state.tool.eraser].classList.add("is-active");
  }

  $(".vy-toolbar__item.is-done").click(() => {
    $(".vy-toolbar.is-level-1 .vy-toolbar__item.is-active").removeClass("is-active");
    $("#js-page-callout").slideUp("fast");
    $(".vy-toolbar.is-level-2").slideUp("fast");
    $(".vy-toolbar.is-level-1").slideDown("fast");
  })

  $(`.vy-toolbar.is-level-2 .vy-toolbar__item.is-${tool}`).click((event) => {
    $("#js-page-callout").slideUp("fast");
    $(`.vy-toolbar.is-level-2 .vy-toolbar__item.is-active`).removeClass("is-active");
    $(event.target).addClass("is-active");
    if ($(event.target).index() > 0 && $(event.target).index() < 6) {
      if (tool === "pen") {
        state.tool.pen = $(event.target).index();
      } else if (tool === "highlighter") {
        state.tool.highlighter = $(event.target).index();
      } else if (tool === "eraser") {
        state.tool.eraser = $(event.target).index();
      }
    }
  })

  $(".vy-toolbar.is-level-2 .vy-toolbar__item.is-rgb").click((event) => {
    $("#js-page-callout").slideUp("fast", () => {
      $("#js-page-callout").removeClass("is-eraser");
      $("#js-page-callout").removeClass("is-more");
      $("#js-page-callout").removeClass("is-rgb");
      $("#js-page-callout").addClass("is-rgb");

      loadContent({
        file: `./page/whiteboard/callout/rgb.html`,
        parent: document.querySelector("#js-page-callout"),
        callback: () => {
          $("#js-page-callout").css("left", `calc(${$(event.target).position().left}px - 2.75em)`);
          $("#js-page-callout").slideDown("fast");

          $("#js-page-callout.is-rgb").click(() => {
            $("#js-page-callout").slideUp("fast");
          })
        }
      })
    });
  })

  $(".vy-toolbar.is-level-2 .vy-toolbar__item.is-eraser").click((event) => {
    if (!event.target.classList.contains('is-fine') && !event.target.classList.contains('is-block')) {
      $("#js-page-callout").slideUp("fast", () => {
        $("#js-page-callout").removeClass("is-eraser");
        $("#js-page-callout").removeClass("is-more");
        $("#js-page-callout").removeClass("is-rgb");
        $("#js-page-callout").addClass("is-eraser");

        loadContent({
          file: `./page/whiteboard/callout/eraser.html`,
          parent: document.querySelector("#js-page-callout"),
          callback: () => {
            $(`.vy-toolbar.is-level-2 .vy-toolbar__item.is-active`).removeClass("is-active");
            $(event.target).addClass("is-active");
            $("#js-page-callout").css("left", `calc(${$(event.target).position().left}px - .25em)`);
            $("#js-page-callout").slideDown("fast");

            $("#js-page-callout.is-eraser").click(() => {
              $("#js-page-callout").slideUp("fast");
            })
          }
        })
      });
    } else {

    }
  })

  $(".vy-toolbar.is-level-2 .vy-toolbar__item.is-more").click((event) => {
    $("#js-page-callout").slideUp("fast", () => {
      $("#js-page-callout").removeClass("is-eraser");
      $("#js-page-callout").removeClass("is-more");
      $("#js-page-callout").removeClass("is-rgb");
      $("#js-page-callout").addClass("is-more");

      loadContent({
        file: `./page/whiteboard/callout/more.html`,
        parent: document.querySelector("#js-page-callout"),
        callback: () => {
          $("#js-page-callout").css("left", `calc(${$(event.target).position().left}px - .25em)`);
          $("#js-page-callout").slideDown("fast");
          $(event.target).addClass("is-active");


          $("#js-page-callout.is-more").click(() => {
            $("#js-page-callout").slideUp("fast");
            $(".vy-toolbar__item.is-more.is-active").removeClass("is-active");
          })
        }
      })
    });
  })
}
