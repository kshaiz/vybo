$(document).ready(() => {
    initializeHome();
});
let state = {
    home: 0,
    tool: 0,
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
        file: "/page/whiteboard.html",
        parent: document.querySelector(".vy-app"),
        callback: () => {
            $(".vy-toolbar.is-level-2").hide();
            $(".vy-callout").slideUp("fast");

            $(".vy-menu.vy-back").click(() => {
                initializeHome()
            })

            $(".vy-tool.is-pen").click(() => {
                $(".vy-toolbar.is-level-1").slideUp("fast");
                $(".vy-toolbar.is-level-2.is-pen").slideDown("fast");
                state.tool = ".is-pen"
            })

            $(".vy-tool.is-highlighter").click(() => {
                $(".vy-toolbar.is-level-1").slideUp("fast");
                $(".vy-toolbar.is-level-2.is-highlighter").slideDown("fast");
                state.tool = ".is-highlighter";
            })

            $(".vy-tool.is-eraser").click((event) => {
                $(".vy-callout").slideUp("fast");
                if (state.tool === 0) {
                    $(".vy-toolbar.is-level-1 .vy-tool.is-active").removeClass("is-active");
                } else {
                    $(`.vy-toolbar.is-level-2${state.tool} .vy-tool.is-active`).removeClass("is-active");
                }
                $(event.target).addClass("is-active");
            })

            $(".vy-toolbar.is-level-2 .vy-tool.is-pen").click((event) => {
                $(".vy-callout").slideUp("fast");
                $(`.vy-toolbar.is-level-2${state.tool} .vy-tool.is-active`).removeClass("is-active");
                $(event.target).addClass("is-active");
            })

            $(".vy-toolbar.is-level-2 .vy-tool.is-highlighter").click((event) => {
                $(".vy-callout").slideUp("fast");
                $(`.vy-toolbar.is-level-2${state.tool} .vy-tool.is-active`).removeClass("is-active");
                $(event.target).addClass("is-active");
            })

            $(".vy-toolbar.is-level-2 .vy-tool.is-rgb").click((event) => {
                $(".vy-callout").slideUp("fast");
                $(".vy-callout.is-rgb").css("left", `calc(${$(event.target).position().left}px - 2.75em)`);
                $(".vy-callout.is-rgb").slideDown("fast");
            })

            $(".vy-toolbar.is-level-2 .vy-tool.is-more").click((event) => {
                $(".vy-callout").slideUp("fast");
                $(".vy-callout.is-more").css("left", `calc(${$(event.target).position().left}px - .25em)`);
                $(".vy-callout.is-more").slideDown("fast");
                $(event.target).addClass("is-active");
            })

            $(".vy-tool.is-done").click(() => {
                state.tool = 0;
                $(".vy-toolbar.is-level-1 .vy-tool.is-active").removeClass("is-active");
                $(".vy-callout").slideUp("fast");
                $(".vy-toolbar.is-level-2").slideUp("fast");
                $(".vy-toolbar.is-level-1").slideDown("fast");
            })

            $(".vy-callout.is-rgb").click(() => {
                $(".vy-callout").slideUp("fast");
            })

            $(".vy-callout.is-more").click(() => {
                $(".vy-callout").slideUp("fast");
                $(".vy-toolbar.is-level-2 .vy-tool.is-more.is-active").removeClass("is-active");
            })
        }
    })
}