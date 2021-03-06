/**
 * angular-range-slider v3.2.0 
 * Built: 2016-09-22 20:02:29 
 * Christoffer Hasselberg stofolus@gmail.com 
 * Released under the MIT license 
 */


! function() { "use strict";

    function a() {
        function a(a, b, c) {
            function d() { a.min = void 0 === a.min ? 0 : parseFloat(a.min), a.max = void 0 === a.max ? 100 : parseFloat(a.max), a.step = void 0 === a.step ? 1 : parseFloat(a.step), a.model = void 0 === a.model ? (a.max - a.min) / 2 : parseFloat(a.model), a.shouldSnapToInit = void 0 === a.shouldSnapToInit || !!a.shouldSnapToInit, a.snapToInitRange = void 0 === a.snapToInitRange ? l(2.5, 100) : parseFloat(l(a.snapToInitRange, 100)), e(), h(), i() }

            function e() { f(), g() }

            function f() {
                function b(a) { d && (a.preventDefault(), j(a)) }

                function c(a) { d && (d = !1, angular.element(window).off("touchmove", b), angular.element(window).off("touchend", c)) } var d = !1;
                p.on("touchstart", function(e) { a.disabled !== !0 && (d = !0, angular.element(window).on("touchmove", b), angular.element(window).on("touchend", c)) }), o.on("touchstart", function(e) { a.disabled !== !0 && (d = !0, angular.element(window).on("touchmove", b), angular.element(window).on("touchend", c), j(e)) }) }

            function g() {
                function b(a) { d && (a.preventDefault(), j(a)) }

                function c(a) { d && (d = !1, angular.element(window).off("mousemove", b), angular.element(window).off("mouseup", c)) } var d = !1;
                p.on("mousedown", function(e) { a.disabled !== !0 && (d = !0, angular.element(window).on("mousemove", b), angular.element(window).on("mouseup", c)) }), o.on("mousedown", function(e) { a.disabled !== !0 && (d = !0, angular.element(window).on("mousemove", b), angular.element(window).on("mouseup", c), j(e)) }) }

            function h() {
                function b(b) { switch (b.keyCode) {
                        case c.UP:
                        case c.RIGHT:
                            b.preventDefault(), k(a.model + a.step, !0, !0); break;
                        case c.DOWN:
                        case c.LEFT:
                            b.preventDefault(), k(a.model - a.step, !0, !0); break;
                        case c.PAGEUP:
                            b.preventDefault(), k(a.model + 10 * a.step, !0, !0); break;
                        case c.PAGEDOWN:
                            b.preventDefault(), k(a.model - 10 * a.step, !0, !0); break;
                        case c.HOME:
                            b.preventDefault(), k(a.min, !0, !0); break;
                        case c.END:
                            b.preventDefault(), k(a.max, !0, !0) } } n.on("keydown", b); var c = { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, PAGEUP: 33, PAGEDOWN: 34, HOME: 36, END: 35 } }

            function i() {
                function d(b) { b = void 0 !== b && b, k(a.model, b, !1, !1, !0) } a.$watch(function() { return a.model }, function(a) { a = void 0 === a || "" === a || isNaN(a) ? 0 : parseFloat(a), k(a, !1) }), c.$observe("min", function(b) { a.min = void 0 === b || "" === b || isNaN(b) ? 0 : parseFloat(b), d(!1) }), c.$observe("max", function(b) { a.max = void 0 === b || "" === b || isNaN(b) ? 100 : parseFloat(b), d(!1) }), c.$observe("step", function(b) { a.step = void 0 === b || "" === b || isNaN(b) ? 1 : parseFloat(b), d(!0) }), a.$watch(function() { return b.attr("disabled") }, function(b) { a.disabled = void 0 !== b }) }

            function j(b) { var c;
                c = void 0 !== b.pageX ? b.pageX : void 0 !== b.changedTouches && b.changedTouches.length > 0 ? b.changedTouches[0].pageX : void 0 !== b.originalEvent && void 0 !== b.originalEvent.touches && b.originalEvent.touches.length > 0 ? b.originalEvent.touches[0].pageX : void 0 !== b.originalEvent && void 0 !== b.originalEvent.changedTouches && b.originalEvent.changedTouches.length > 0 ? b.originalEvent.changedTouches[0].pageX : 0; var d, e = o[0].getBoundingClientRect().width,
                    f = o[0].getBoundingClientRect().left + document.body.scrollLeft - c,
                    g = Math.abs(f); if (f > 0) g = a.min, d = g;
                else { var h = l(g, e);
                    d = (a.max - a.min) * h + parseFloat(a.min) } k(d, !0, !0, a.shouldSnapToInit) }

            function k(b, c, d, e, f) { if (b = parseFloat(b), c = void 0 === c || c, d = void 0 !== d && d, e = void 0 !== e && e, f = void 0 !== f && f, c) { var g = Math.abs(l(s - b, a.max - a.min));
                    b = e && g < a.snapToInitRange ? s : m(b, a.step) } b < a.min ? b = a.min : b > a.max && (b = a.max); var h = p[0].getBoundingClientRect().width / 2,
                    i = 100 * l(b - a.min, a.max - a.min);
                0 === h && (h = 12), i < 0 ? i = 0 : i > 100 && (i = 100), p.css("left", "calc(" + i + "% - " + h + "px)"), q.css("width", "calc(" + i + "% - " + h + "px)"), f && (s = b, r.css("left", "calc(" + i + "% - 1px)")), c && (a.model = b, d && a.$apply()) }

            function l(a, b) { return a / b }

            function m(a, b) { return Math.round(a / b) * b } var n = angular.element(b[0].querySelector(".ch-slider")),
                o = angular.element(b[0].querySelector(".ch-slider-bar")),
                p = angular.element(b[0].querySelector(".ch-slider-handle")),
                q = angular.element(b[0].querySelector(".ch-slider-fill")),
                r = angular.element(b[0].querySelector(".ch-slider-line")),
                s = 0;
            d() } var b = { restrict: "EA", scope: { model: "=", min: "@", max: "@", step: "@", shouldSnapToInit: "@", snapToInitRange: "@" }, link: a, template: '<div class="ch-slider" tabindex="0"><div class="ch-slider-bar"><span class="ch-slider-fill"></span><span class="ch-slider-line"></span><span class="ch-slider-handle" role="slider" aria-valuemin="{{ min }}" aria-valuemax="{{ max }}" aria-valuenow="{{ model }}" aria-orientation="horizontal" ></span></div></div>' }; return b } angular.module("chasselberg.slider", []).directive("slider", a) }();

angular.module('ch.examples.slider', ['chasselberg.slider']);