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
  loadContent({
    file: "/page/home/zero.html",
    parent: document.querySelector(".vy-app"),
    callback: () => {
      $(".vy-app .vy-button.is-primary").click(() => {
        initializeWhiteboard();
      })
    }
  })
}

function initializeWhiteboard() {
  loadContent({
    file: "/page/whiteboard/content.html",
    parent: document.querySelector(".vy-app"),
    callback: () => {
      initializeMenu();
      initializeToast();
      initializeToolbar();
    }
  })
}

function initializeMenu() {
  $(".vy-menu.vy-back").click(() => {
    initializeHome()
  })

  $(".vy-menu.is-setting").click(() => {
    initializeSetting();
  })
}

function initializeToast() {
  $(".vy-toast button").click(() => {
    $(".vy-toast").fadeOut("fast");
  })
}

function initializeToolbar() {
  $(".vy-toolbar.is-level-1 .vy-tool").click((event) => {
    let classList = $(event.target).attr("class");
    let tool = classList.replace("vy-tool is-", "");

    loadContent({
      file: `/page/whiteboard/toolbar/${tool}.html`,
      parent: document.querySelector(".vy-toolbar.is-level-2"),
      callback: () => {
        initializeTool(tool);
        $(".vy-toolbar.is-level-1").slideUp("fast");
        $(".vy-toolbar.is-level-2").slideDown("fast");
      }
    })
  })

}

function initializeTool(tool) {
  $(`.vy-toolbar.is-level-2 .vy-tool.is-active`).removeClass("is-active");
  if (tool === "pen") {
    document.querySelectorAll(".vy-toolbar.is-level-2 .vy-tool")[state.tool.pen].classList.add("is-active");
  } else if (tool === "highlighter") {
    document.querySelectorAll(".vy-toolbar.is-level-2 .vy-tool")[state.tool.highlighter].classList.add("is-active");
  }

  $(".vy-tool.is-done").click(() => {
    $(".vy-toolbar.is-level-1 .vy-tool.is-active").removeClass("is-active");
    $(".vy-callout").slideUp("fast");
    $(".vy-toolbar.is-level-2").slideUp("fast");
    $(".vy-toolbar.is-level-1").slideDown("fast");
  })

  $(`.vy-toolbar.is-level-2 .vy-tool.is-${tool}`).click((event) => {
    $(".vy-callout").slideUp("fast");
    $(`.vy-toolbar.is-level-2 .vy-tool.is-active`).removeClass("is-active");
    $(event.target).addClass("is-active");
    if ($(event.target).index() > 0 && $(event.target).index() < 6) {
      if (tool === "pen") {
        state.tool.pen = $(event.target).index();
      } else if (tool === "highlighter") {
        state.tool.highlighter = $(event.target).index();
      }
    }
  })

  $(".vy-toolbar.is-level-2 .vy-tool.is-rgb").click((event) => {
    $(".vy-callout").slideUp("fast", () => {
      $(".vy-callout").addClass("is-rgb");

      loadContent({
        file: `/page/whiteboard/callout/rgb.html`,
        parent: document.querySelector(".vy-callout"),
        callback: () => {
          $(".vy-callout").css("left", `calc(${$(event.target).position().left}px - 2.75em)`);
          $(".vy-callout").slideDown("fast");

          $(".vy-callout.is-rgb").click(() => {
            $(".vy-callout").slideUp("fast", () => {
              $(".vy-callout").removeClass("is-rgb");
            });
          })
        }
      })
    });
  })

  $(".vy-toolbar.is-level-2 .vy-tool.is-eraser").click((event) => {
    $(".vy-callout").slideUp("fast");
    $(".vy-tool.is-active").removeClass("is-active");
    $(event.target).addClass("is-active");
  })

  $(".vy-toolbar.is-level-2 .vy-tool.is-more").click((event) => {
    $(".vy-callout").slideUp("fast", () => {
      $(".vy-callout").addClass("is-more");

      loadContent({
        file: `/page/whiteboard/callout/more.html`,
        parent: document.querySelector(".vy-callout"),
        callback: () => {
          $(".vy-callout").css("left", `calc(${$(event.target).position().left}px - .25em)`);
          $(".vy-callout").slideDown("fast");
          $(event.target).addClass("is-active");


          $(".vy-callout.is-more").click(() => {
            $(".vy-callout").slideUp("fast", () => {
              $(".vy-callout").removeClass("is-more");
            });
            $(".vy-tool.is-more.is-active").removeClass("is-active");
          })
        }
      })
    });
  })
}

function initializeSetting() {
  loadContent({
    file: "/page/whiteboard/setting/content.html",
    parent: document.querySelector(".vy-setting"),
    callback: () => {
      $(".vy-setting").fadeIn("fast");
      $(".vy-setting .vy-setting__menu").css("right", "0");

      $(".vy-setting .vy-setting__menu").click(() => {
        $(".vy-setting .vy-setting__menu").css("right", "-100%");
        $(".vy-setting").fadeOut("fast");
      })
    }
  })
}