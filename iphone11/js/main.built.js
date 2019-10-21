! function () {
    function e(t, n, r) {
        function i(s, o) {
            if (!n[s]) {
                if (!t[s]) {
                    var c = "function" == typeof require && require;
                    if (!o && c) return c(s, !0);
                    if (a) return a(s, !0);
                    var l = new Error("Cannot find module '" + s + "'");
                    throw l.code = "MODULE_NOT_FOUND", l
                }
                var u = n[s] = {
                    exports: {}
                };
                t[s][0].call(u.exports, function (e) {
                    var n = t[s][1][e];
                    return i(n ? n : e)
                }, u, u.exports, e, t, n, r)
            }
            return n[s].exports
        }
        for (var a = "function" == typeof require && require, s = 0; s < r.length; s++) i(r[s]);
        return i
    }
    return e
}()({
    1: [function (e, t, n) {
        "use strict";
        var r = e("./helpers/disableTabbable"),
            i = e("./helpers/enableTabbable"),
            a = e("./helpers/setAttributes"),
            s = e("./helpers/isTruthy"),
            o = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            c = o.prototype,
            l = e("./maps/ariaMap"),
            u = e("./maps/keyMap"),
            h = [l.BUSY, l.CHECKED, l.DISABLED, l.EXPANDED, l.HIDDEN, l.INVALID, l.PRESSED, l.SELECTED],
            m = function (e, t) {
                o.call(this), this._options = t || {}, this._selector = t.selector || ".navitem", this._allowMultiSelection = t.multiSelection || !1;
                var n = h.indexOf(t.state) > -1 ? t.state : l.SELECTED;
                this.el = e, this._navItems = e.querySelectorAll(this._selector), this._navItems = Array.prototype.slice.call(this._navItems), this._state = n, this._navKeys = {}, this.selectOption = this.selectOption.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._setup()
            };
        m.ONSELECT = "onSelect", m.ONFOCUS = "onFocus";
        var d = m.prototype = Object.create(c);
        d._setup = function () {
            for (var e = [u.ARROW_DOWN, u.ARROW_RIGHT], t = [u.ARROW_UP, u.ARROW_LEFT], n = [u.ENTER, u.SPACEBAR], r = 0; r < e.length; r++) this.addNavkey(e[r], this._arrowDown.bind(this, !0)), this.addNavkey(t[r], this._arrowDown.bind(this, null)), this.addNavkey(n[r], this.selectOption);
            this._setupNavItems()
        }, d._setupNavItems = function () {
            if (this._navItems.length) {
                for (var e = 0; e < this._navItems.length; e++) this._setTabbingByIndex(e);
                void 0 !== this.focusedNavItemIndex && void 0 !== this.selectedNavitemIndex || this.setSelectedItemByIndex(0, !0)
            }
        }, d._setTabbingByIndex = function (e) {
            var t = this._navItems[e],
                n = s(t.getAttribute(this._state));
            n && (this.focusedNavItemIndex = e, this.selectedNavitemIndex = e);
            var a = s(t.getAttribute(l.DISABLED));
            a ? r(t) : i(t)
        }, d.start = function () {
            this._navItems.length < 1 || (this.el.addEventListener("keydown", this._handleKeyDown), this.el.addEventListener("click", this.selectOption))
        }, d.stop = function () {
            this.el.removeEventListener("keydown", this._handleKeyDown), this.el.removeEventListener("click", this.selectOption)
        }, d._handleKeyDown = function (e) {
            return !!(e.ctrlKey || e.altKey || e.metaKey) || void(this._navKeys[e.keyCode] && this._navKeys[e.keyCode](e))
        }, d._arrowDown = function (e, t, n) {
            t.preventDefault(), this.previousNavItemIndex = this.focusedNavItemIndex, this.focusedNavItemIndex = this._calculateIndex(e, this.focusedNavItemIndex), this._navItems[this.focusedNavItemIndex].focus(), n || this.trigger(m.ONFOCUS, {
                event: t,
                index: this.focusedNavItemIndex,
                el: this._navItems[this.focusedNavItemIndex]
            })
        }, d.selectOption = function (e, t) {
            e.preventDefault();
            var n = this._navItems.indexOf(document.activeElement);
            n > -1 && document.activeElement !== this._navItems[this.focusedNavItemIndex] && (this.focusedNavItemIndex = n), this._allowMultiSelection ? this._toggleState() : (a(this._navItems[this.selectedNavitemIndex], this._state, "false"), a(this._navItems[this.focusedNavItemIndex], this._state, "true")), this.selectedNavitemIndex = this.focusedNavItemIndex, t || this.trigger(m.ONSELECT, {
                event: e,
                index: this.selectedNavitemIndex,
                el: this._navItems[this.selectedNavitemIndex]
            })
        }, d._toggleState = function () {
            var e = this._navItems[this.focusedNavItemIndex].getAttribute(this._state);
            s(e) ? a(this._navItems[this.focusedNavItemIndex], this._state, "false") : a(this._navItems[this.focusedNavItemIndex], this._state, "true")
        }, d._calculateIndex = function (e, t) {
            var n = t;
            if (e === !0) {
                if (n++, n = n >= this._navItems.length ? 0 : n, !s(this._navItems[n].getAttribute(l.DISABLED)) || this._navItems[n].hasAttribute("disabled")) return n
            } else if (n--, n = n < 0 ? this._navItems.length - 1 : n, !s(this._navItems[n].getAttribute(l.DISABLED)) || this._navItems[n].hasAttribute("disabled")) return n;
            return this._calculateIndex(e, n)
        }, d.updateNavItems = function () {
            var e = this.el.querySelectorAll(this._selector);
            this._navItems = Array.prototype.slice.call(e)
        }, d.addNavItem = function (e) {
            e && e.nodeType && this._navItems.indexOf(e) < 0 && (s(e.getAttribute(l.DISABLED)) || i(e), this._navItems.push(e))
        }, d.setSelectedItemByIndex = function (e, t) {
            this._allowMultiSelection || isNaN(this.selectedNavitemIndex) || a(this._navItems[this.selectedNavitemIndex], this._state, "false"), this.focusedNavItemIndex = e, this.selectedNavitemIndex = e, a(this._navItems[this.selectedNavitemIndex], this._state, "true"), t || this.trigger(m.ONSELECT, {
                event: null,
                index: this.focusedNavItemIndex,
                el: this._navItems[this.focusedNavItemIndex]
            })
        }, d.getSelectedItem = function () {
            return this._navItems[this.selectedNavitemIndex]
        }, d.getFocusedItem = function (e) {
            return this._navItems[this.focusedNavItemIndex]
        }, d.addNavkey = function (e, t) {
            "function" == typeof t && "number" == typeof e ? this._navKeys[e] = t : console.warn("incorrect types arguments were passed")
        }, d.removeNavkey = function (e) {
            delete this._navKeys[e]
        }, d.destroy = function () {
            c.destroy.call(this), this.stop(), this.el = null, this._options = null, this._selector = null, this.focusedNavItemIndex = null, this.selectedNavitemIndex = null, this._navItems = null, this._state = null, this.selectOption = null, this._handleKeyDown = null;
            for (var e in this._navKeys) this._navKeys.hasOwnProperty(e) && this.removeNavkey(e);
            this._navKeys = null
        }, t.exports = m
    }, {
        "./helpers/disableTabbable": 5,
        "./helpers/enableTabbable": 6,
        "./helpers/isTruthy": 9,
        "./helpers/setAttributes": 11,
        "./maps/ariaMap": 14,
        "./maps/keyMap": 16,
        "@marcom/ac-event-emitter-micro": 23
    }],
    2: [function (e, t, n) {
        "use strict";
        var r = e("./helpers/TabManager"),
            i = e("./helpers/hideSiblingElements"),
            a = e("./helpers/showSiblingElements"),
            s = function (e, t) {
                t = t || {}, this._tabbables = null, this._excludeHidden = t.excludeHidden, this._firstTabbableElement = t.firstFocusElement, this._lastTabbableElement = null, this._relatedTarget = null, this.el = e, this._handleOnFocus = this._handleOnFocus.bind(this)
            },
            o = s.prototype;
        o.start = function () {
            this.updateTabbables(), i(this.el, null, this._excludeHidden), this._firstTabbableElement ? this.el.contains(document.activeElement) || this._firstTabbableElement.focus() : console.warn("this._firstTabbableElement is null, CircularTab needs at least one tabbable element."), this._relatedTarget = document.activeElement, document.addEventListener("focus", this._handleOnFocus, !0)
        }, o.stop = function () {
            a(this.el), document.removeEventListener("focus", this._handleOnFocus, !0)
        }, o.updateTabbables = function () {
            this._tabbables = r.getTabbableElements(this.el, this._excludeHidden), this._firstTabbableElement = this._firstTabbableElement || this._tabbables[0], this._lastTabbableElement = this._tabbables[this._tabbables.length - 1]
        }, o._handleOnFocus = function (e) {
            if (this.el.contains(e.target)) this._relatedTarget = e.target;
            else {
                if (e.preventDefault(), this.updateTabbables(), this._relatedTarget === this._lastTabbableElement || null === this._relatedTarget) return this._firstTabbableElement.focus(), void(this._relatedTarget = this._firstTabbableElement);
                if (this._relatedTarget === this._firstTabbableElement) return this._lastTabbableElement.focus(), void(this._relatedTarget = this._lastTabbableElement)
            }
        }, o.destroy = function () {
            this.stop(), this.el = null, this._tabbables = null, this._firstTabbableElement = null, this._lastTabbableElement = null, this._relatedTarget = null, this._handleOnFocus = null
        }, t.exports = s
    }, {
        "./helpers/TabManager": 4,
        "./helpers/hideSiblingElements": 8,
        "./helpers/showSiblingElements": 13
    }],
    3: [function (e, t, n) {
        "use strict";
        var r = e("./maps/ariaMap"),
            i = e("./maps/roleMap"),
            a = e("./helpers/enableTabbable"),
            s = e("./helpers/disableTabbable"),
            o = e("./helpers/setAttributes"),
            c = e("./helpers/isTruthy"),
            l = e("./ArrowNavigation"),
            u = l.prototype,
            h = function (e, t) {
                t = t || {}, l.call(this, e, {
                    selector: t.selector || "*[role=" + i.OPTION + "]",
                    state: t.state || r.SELECTED
                })
            },
            m = h.prototype = Object.create(u);
        m._setTabbingByIndex = function (e) {
            var t = this._navItems[e];
            c(t.getAttribute(this._state)) ? (this.focusedNavItemIndex = e, this.selectedNavitemIndex = e, this._enableElement(t)) : this._disableElement(t)
        }, m.setSelectedItemByIndex = function (e, t) {
            isNaN(this.selectedNavitemIndex) || this._disableElement(this._navItems[this.selectedNavitemIndex]), u.setSelectedItemByIndex.call(this, e, t), this._enableElement(this._navItems[this.selectedNavitemIndex])
        }, m.addNavItem = function (e) {
            e && e.nodeType && this._navItems.indexOf(e) < 0 && (c(e.getAttribute(r.DISABLED)) || this._disableElement(e), this._navItems.push(e))
        }, m._arrowDown = function (e, t) {
            u._arrowDown.call(this, e, t, !0), this.selectOption(t)
        }, m._enableElement = function (e) {
            a(e), o(e, this._state, "true")
        }, m._disableElement = function (e) {
            s(e), o(e, this._state, "false")
        }, m.selectOption = function (e) {
            s(this._navItems[this.selectedNavitemIndex]), u.selectOption.call(this, e), a(this._navItems[this.focusedNavItemIndex])
        }, t.exports = h
    }, {
        "./ArrowNavigation": 1,
        "./helpers/disableTabbable": 5,
        "./helpers/enableTabbable": 6,
        "./helpers/isTruthy": 9,
        "./helpers/setAttributes": 11,
        "./maps/ariaMap": 14,
        "./maps/roleMap": 17
    }],
    4: [function (e, t, n) {
        "use strict";
        var r = e("./../maps/focusableElement"),
            i = function () {
                this.focusableSelectors = r.join(",")
            },
            a = i.prototype;
        a.isFocusableElement = function (e, t, n) {
            if (t && !this._isDisplayed(e)) return !1;
            var i = e.nodeName.toLowerCase(),
                a = r.indexOf(i) > -1;
            return "a" === i || (a ? !e.disabled : !e.contentEditable || (n = n || parseFloat(e.getAttribute("tabindex")), !isNaN(n)))
        }, a.isTabbableElement = function (e, t) {
            if (t && !this._isDisplayed(e)) return !1;
            var n = e.getAttribute("tabindex");
            return n = parseFloat(n), isNaN(n) ? this.isFocusableElement(e, t, n) : n >= 0
        }, a._isDisplayed = function (e) {
            var t = e.getBoundingClientRect();
            return (0 !== t.top || 0 !== t.left || 0 !== t.width || 0 !== t.height) && "hidden" !== window.getComputedStyle(e).visibility
        }, a.getTabbableElements = function (e, t) {
            for (var n = e.querySelectorAll(this.focusableSelectors), r = n.length, i = [], a = 0; a < r; a++) this.isTabbableElement(n[a], t) && i.push(n[a]);
            return i
        }, a.getFocusableElements = function (e, t) {
            for (var n = e.querySelectorAll(this.focusableSelectors), r = n.length, i = [], a = 0; a < r; a++) this.isFocusableElement(n[a], t) && i.push(n[a]);
            return i
        }, t.exports = new i
    }, {
        "./../maps/focusableElement": 15
    }],
    5: [function (e, t, n) {
        "use strict";
        var r = e("./setAttributes");
        t.exports = function (e) {
            r(e, "tabindex", "-1")
        }
    }, {
        "./setAttributes": 11
    }],
    6: [function (e, t, n) {
        "use strict";
        var r = e("./setAttributes"),
            i = e("./TabManager");
        t.exports = function (e) {
            var t = [].concat(e);
            t = t.filter(function (e) {
                return !i.isTabbableElement(e)
            }), t.length > 0 && r(t, "tabindex", 0)
        }
    }, {
        "./TabManager": 4,
        "./setAttributes": 11
    }],
    7: [function (e, t, n) {
        "use strict";
        var r = e("./setAttributes"),
            i = e("./../maps/ariaMap"),
            a = e("./TabManager"),
            s = "data-original-",
            o = "tabindex",
            c = function (e, t) {
                var n = e.getAttribute(s + t);
                n || (n = e.getAttribute(t) || "", r(e, s + t, n))
            };
        t.exports = function (e, t) {
            if (a.isFocusableElement(e, t)) c(e, o), r(e, o, -1);
            else
                for (var n = a.getTabbableElements(e, t), s = n.length; s--;) c(n[s], o), r(n[s], o, -1);
            c(e, i.HIDDEN), r(e, i.HIDDEN, !0)
        }
    }, {
        "./../maps/ariaMap": 14,
        "./TabManager": 4,
        "./setAttributes": 11
    }],
    8: [function (e, t, n) {
        "use strict";
        var r = e("./hide");
        t.exports = function i(e, t, n) {
            t = t || document.body;
            for (var a = e, s = e; a = a.previousElementSibling;) r(a, n);
            for (; s = s.nextElementSibling;) r(s, n);
            e.parentElement && e.parentElement !== t && i(e.parentElement)
        }
    }, {
        "./hide": 7
    }],
    9: [function (e, t, n) {
        "use strict";
        t.exports = function (e) {
            return "string" == typeof e ? (e = e.toLowerCase(), "true" === e) : e
        }
    }, {}],
    10: [function (e, t, n) {
        "use strict";
        var r = function (e, t) {
                if ("string" == typeof t)
                    for (var n = t.split(/\s+/), r = 0; r < n.length; r++) e.getAttribute(n[r]) && e.removeAttribute(n[r])
            },
            i = function (e, t) {
                if (e.length)
                    for (var n = 0; n < e.length; n++) r(e[n], t);
                else r(e, t)
            };
        t.exports = i
    }, {}],
    11: [function (e, t, n) {
        "use strict";
        var r = function (e, t, n) {
                e && 1 === e.nodeType && e.setAttribute(t, n)
            },
            i = function (e, t, n) {
                if ("string" != typeof n && (n = n.toString()), e)
                    if (e.length)
                        for (var i = 0; i < e.length; i++) r(e[i], t, n);
                    else r(e, t, n)
            };
        t.exports = i
    }, {}],
    12: [function (e, t, n) {
        "use strict";
        var r = e("./removeAttributes"),
            i = e("./setAttributes"),
            a = e("./../maps/ariaMap"),
            s = "data-original-",
            o = "tabindex",
            c = function (e, t) {
                var n = e.getAttribute(s + t);
                "string" == typeof n && (n.length ? i(e, t, n) : r(e, t), r(e, s + t))
            };
        t.exports = function (e) {
            r(e, o + " " + a.HIDDEN), c(e, o), c(e, a.HIDDEN);
            for (var t = e.querySelectorAll("[" + s + o + "]"), n = t.length; n--;) c(t[n], o)
        }
    }, {
        "./../maps/ariaMap": 14,
        "./removeAttributes": 10,
        "./setAttributes": 11
    }],
    13: [function (e, t, n) {
        "use strict";
        var r = e("./show");
        t.exports = function i(e, t) {
            t = t || document.body;
            for (var n = e, a = e; n = n.previousElementSibling;) r(n);
            for (; a = a.nextElementSibling;) r(a);
            e.parentElement && e.parentElement !== t && i(e.parentElement)
        }
    }, {
        "./show": 12
    }],
    14: [function (e, t, n) {
        "use strict";
        t.exports = {
            AUTOCOMPLETE: "aria-autocomplete",
            CHECKED: "aria-checked",
            DISABLED: "aria-disabled",
            EXPANDED: "aria-expanded",
            HASPOPUP: "aria-haspopup",
            HIDDEN: "aria-hidden",
            INVALID: "aria-invalid",
            LABEL: "aria-label",
            LEVEL: "aria-level",
            MULTILINE: "aria-multiline",
            MULTISELECTABLE: "aria-multiselectable",
            ORIENTATION: "aria-orientation",
            PRESSED: "aria-pressed",
            READONLY: "aria-readonly",
            REQUIRED: "aria-required",
            SELECTED: "aria-selected",
            SORT: "aria-sort",
            VALUEMAX: "aria-valuemax",
            VALUEMIN: "aria-valuemin",
            VALUENOW: "aria-valuenow",
            VALUETEXT: "aria-valuetext",
            ATOMIC: "aria-atomic",
            BUSY: "aria-busy",
            LIVE: "aria-live",
            RELEVANT: "aria-relevant",
            DROPEFFECT: "aria-dropeffect",
            GRABBED: "aria-grabbed",
            ACTIVEDESCENDANT: "aria-activedescendant",
            CONTROLS: "aria-controls",
            DESCRIBEDBY: "aria-describedby",
            FLOWTO: "aria-flowto",
            LABELLEDBY: "aria-labelledby",
            OWNS: "aria-owns",
            POSINSET: "aria-posinset",
            SETSIZE: "aria-setsize"
        }
    }, {}],
    15: [function (e, t, n) {
        "use strict";
        t.exports = ["input", "select", "textarea", "button", "optgroup", "option", "menuitem", "fieldset", "object", "a[href]", "*[tabindex]", "*[contenteditable]"]
    }, {}],
    16: [function (e, t, n) {
        "use strict";
        t.exports = e("@marcom/ac-keyboard/keyMap")
    }, {
        "@marcom/ac-keyboard/keyMap": 25
    }],
    17: [function (e, t, n) {
        "use strict";
        t.exports = {
            ALERT: "alert",
            ALERTDIALOG: "alertdialog",
            BUTTON: "button",
            CHECKBOX: "checkbox",
            DIALOG: "dialog",
            GRIDCELL: "gridcell",
            LINK: "link",
            LOG: "log",
            MARQUEE: "marquee",
            MENUITEM: "menuitem",
            MENUITEMCHECKBOX: "menuitemcheckbox",
            MENUITEMRADIO: "menuitemradio",
            OPTION: "option",
            PROGRESSBAR: "progressbar",
            RADIO: "radio",
            SCROLLBAR: "scrollbar",
            SLIDER: "slider",
            SPINBUTTON: "spinbutton",
            STATUS: "status",
            SWITCH: "switch",
            TAB: "tab",
            TABPANEL: "tabpanel",
            TEXTBOX: "textbox",
            TIMER: "timer",
            TOOLTIP: "tooltip",
            TREEITEM: "treeitem",
            COMBOBOX: "combobox",
            GRID: "grid",
            LISTBOX: "listbox",
            MENU: "menu",
            MENUBAR: "menubar",
            RADIOGROUP: "radiogroup",
            TABLIST: "tablist",
            TREE: "tree",
            TREEGRID: "treegrid",
            ARTICLE: "article",
            COLUMNHEADER: "columnheader",
            DEFINITION: "definition",
            DIRECTORY: "directory",
            DOCUMENT: "document",
            GROUP: "group",
            HEADING: "heading",
            IMG: "img",
            LIST: "list",
            LISTITEM: "listitem",
            MATH: "math",
            NOTE: "note",
            PRESENTATION: "presentation",
            REGION: "region",
            ROW: "row",
            ROWGROUP: "rowgroup",
            ROWHEADER: "rowheader",
            SEPARATOR: "separator",
            TOOLBAR: "toolbar",
            APPLICATION: "application",
            BANNER: "banner",
            COMPLEMENTARY: "complementary",
            CONTENTINFO: "contentinfo",
            FORM: "form",
            MAIN: "main",
            NAVIGATION: "navigation",
            SEARCH: "search"
        }
    }, {}],
    18: [function (e, t, n) {
        "use strict";
        var r = "f7c9180f-5c45-47b4-8de4-428015f096c0",
            i = !1,
            a = window || self;
        try {
            i = !!a.localStorage.getItem(r)
        } catch (s) {}
        t.exports = i
    }, {}],
    19: [function (e, t, n) {
        "use strict";
        t.exports = e("./internal/expose")("error")
    }, {
        "./internal/expose": 20
    }],
    20: [function (e, t, n) {
        "use strict";
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = e("../enabled");
        t.exports = function (e) {
            return function () {
                if (i && "object" === r(window.console) && "function" == typeof console[e]) return console[e].apply(console, Array.prototype.slice.call(arguments, 0))
            }
        }
    }, {
        "../enabled": 18
    }],
    21: [function (e, t, n) {
        "use strict";
        t.exports = e("./internal/expose")("log")
    }, {
        "./internal/expose": 20
    }],
    22: [function (e, t, n) {
        "use strict";
        t.exports = e("./internal/expose")("warn")
    }, {
        "./internal/expose": 20
    }],
    23: [function (e, t, n) {
        "use strict";
        t.exports = {
            EventEmitterMicro: e("./ac-event-emitter-micro/EventEmitterMicro")
        }
    }, {
        "./ac-event-emitter-micro/EventEmitterMicro": 24
    }],
    24: [function (e, t, n) {
        "use strict";

        function r() {
            this._events = {}
        }
        var i = r.prototype;
        i.on = function (e, t) {
            this._events[e] = this._events[e] || [], this._events[e].unshift(t)
        }, i.once = function (e, t) {
            function n(i) {
                r.off(e, n), void 0 !== i ? t(i) : t()
            }
            var r = this;
            this.on(e, n)
        }, i.off = function (e, t) {
            if (this.has(e)) {
                if (1 === arguments.length) return this._events[e] = null, void delete this._events[e];
                var n = this._events[e].indexOf(t);
                n !== -1 && this._events[e].splice(n, 1)
            }
        }, i.trigger = function (e, t) {
            if (this.has(e))
                for (var n = this._events[e].length - 1; n >= 0; n--) void 0 !== t ? this._events[e][n](t) : this._events[e][n]()
        }, i.has = function (e) {
            return e in this._events != !1 && 0 !== this._events[e].length
        }, i.destroy = function () {
            for (var e in this._events) this._events[e] = null;
            this._events = null
        }, t.exports = r
    }, {}],
    25: [function (e, t, n) {
        "use strict";
        t.exports = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CONTROL: 17,
            ALT: 18,
            COMMAND: 91,
            CAPSLOCK: 20,
            ESCAPE: 27,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40,
            DELETE: 46,
            ZERO: 48,
            ONE: 49,
            TWO: 50,
            THREE: 51,
            FOUR: 52,
            FIVE: 53,
            SIX: 54,
            SEVEN: 55,
            EIGHT: 56,
            NINE: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            NUMPAD_ZERO: 96,
            NUMPAD_ONE: 97,
            NUMPAD_TWO: 98,
            NUMPAD_THREE: 99,
            NUMPAD_FOUR: 100,
            NUMPAD_FIVE: 101,
            NUMPAD_SIX: 102,
            NUMPAD_SEVEN: 103,
            NUMPAD_EIGHT: 104,
            NUMPAD_NINE: 105,
            NUMPAD_ASTERISK: 106,
            NUMPAD_PLUS: 107,
            NUMPAD_DASH: 109,
            NUMPAD_DOT: 110,
            NUMPAD_SLASH: 111,
            NUMPAD_EQUALS: 187,
            TICK: 192,
            LEFT_BRACKET: 219,
            RIGHT_BRACKET: 221,
            BACKSLASH: 220,
            SEMICOLON: 186,
            APOSTRAPHE: 222,
            APOSTROPHE: 222,
            SPACEBAR: 32,
            CLEAR: 12,
            COMMA: 188,
            DOT: 190,
            SLASH: 191
        }
    }, {}],
    26: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/ac-shared-instance").SharedInstance,
            i = "ac-raf-emitter-id-generator:sharedRAFEmitterIDGeneratorInstance",
            a = "1.0.3",
            s = function () {
                this._currentID = 0
            };
        s.prototype.getNewID = function () {
            return this._currentID++, "raf:" + this._currentID
        }, t.exports = r.share(i, a, s)
    }, {
        "@marcom/ac-shared-instance": 42
    }],
    27: [function (e, t, n) {
        "use strict";
        t.exports = {
            majorVersionNumber: "3.x"
        }
    }, {}],
    28: [function (e, t, n) {
        "use strict";

        function r(e) {
            e = e || {}, a.call(this), this.id = o.getNewID(), this.executor = e.executor || s, this._reset(), this._willRun = !1, this._didDestroy = !1
        }
        var i, a = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = e("./sharedRAFExecutorInstance"),
            o = e("./sharedRAFEmitterIDGeneratorInstance");
        i = r.prototype = Object.create(a.prototype), i.run = function () {
            return this._willRun || (this._willRun = !0), this._subscribe()
        }, i.cancel = function () {
            this._unsubscribe(), this._willRun && (this._willRun = !1), this._reset()
        }, i.destroy = function () {
            var e = this.willRun();
            return this.cancel(), this.executor = null, a.prototype.destroy.call(this), this._didDestroy = !0, e
        }, i.willRun = function () {
            return this._willRun
        }, i.isRunning = function () {
            return this._isRunning
        }, i._subscribe = function () {
            return this.executor.subscribe(this)
        }, i._unsubscribe = function () {
            return this.executor.unsubscribe(this)
        }, i._onAnimationFrameStart = function (e) {
            this._isRunning = !0, this._willRun = !1, this._didEmitFrameData || (this._didEmitFrameData = !0, this.trigger("start", e))
        }, i._onAnimationFrameEnd = function (e) {
            this._willRun || (this.trigger("stop", e), this._reset())
        }, i._reset = function () {
            this._didEmitFrameData = !1, this._isRunning = !1
        }, t.exports = r
    }, {
        "./sharedRAFEmitterIDGeneratorInstance": 37,
        "./sharedRAFExecutorInstance": 38,
        "@marcom/ac-event-emitter-micro": 23
    }],
    29: [function (e, t, n) {
        "use strict";

        function r(e) {
            e = e || {}, this._reset(), this.updatePhases(), this.eventEmitter = new a, this._willRun = !1, this._totalSubscribeCount = -1, this._requestAnimationFrame = window.requestAnimationFrame, this._cancelAnimationFrame = window.cancelAnimationFrame, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
        }
        var i, a = e("@marcom/ac-event-emitter-micro/EventEmitterMicro");
        i = r.prototype, i.frameRequestedPhase = "requested", i.startPhase = "start", i.runPhases = ["update", "external", "draw"], i.endPhase = "end", i.disabledPhase = "disabled", i.beforePhaseEventPrefix = "before:", i.afterPhaseEventPrefix = "after:", i.subscribe = function (e, t) {
            return this._totalSubscribeCount++, this._nextFrameSubscribers[e.id] || (t ? this._nextFrameSubscribersOrder.unshift(e.id) : this._nextFrameSubscribersOrder.push(e.id), this._nextFrameSubscribers[e.id] = e, this._nextFrameSubscriberArrayLength++, this._nextFrameSubscriberCount++, this._run()), this._totalSubscribeCount
        }, i.subscribeImmediate = function (e, t) {
            return this._totalSubscribeCount++, this._subscribers[e.id] || (t ? this._subscribersOrder.splice(this._currentSubscriberIndex + 1, 0, e.id) : this._subscribersOrder.unshift(e.id), this._subscribers[e.id] = e, this._subscriberArrayLength++, this._subscriberCount++), this._totalSubscribeCount
        }, i.unsubscribe = function (e) {
            return !!this._nextFrameSubscribers[e.id] && (this._nextFrameSubscribers[e.id] = null, this._nextFrameSubscriberCount--, 0 === this._nextFrameSubscriberCount && this._cancel(), !0)
        }, i.getSubscribeID = function () {
            return this._totalSubscribeCount += 1
        }, i.destroy = function () {
            var e = this._cancel();
            return this.eventEmitter.destroy(), this.eventEmitter = null, this.phases = null, this._subscribers = null, this._subscribersOrder = null, this._nextFrameSubscribers = null, this._nextFrameSubscribersOrder = null, this._rafData = null, this._boundOnAnimationFrame = null, this._onExternalAnimationFrame = null, e
        }, i.useExternalAnimationFrame = function (e) {
            if ("boolean" == typeof e) {
                var t = this._isUsingExternalAnimationFrame;
                return e && this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), !this._willRun || e || this._animationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this._isUsingExternalAnimationFrame = e, e ? this._boundOnExternalAnimationFrame : t || !1
            }
        }, i.updatePhases = function () {
            this.phases || (this.phases = []), this.phases.length = 0, this.phases.push(this.frameRequestedPhase), this.phases.push(this.startPhase), Array.prototype.push.apply(this.phases, this.runPhases), this.phases.push(this.endPhase), this._runPhasesLength = this.runPhases.length, this._phasesLength = this.phases.length
        }, i._run = function () {
            if (!this._willRun) return this._willRun = !0, 0 === this.lastFrameTime && (this.lastFrameTime = performance.now()), this._animationFrameActive = !0, this._isUsingExternalAnimationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this.phase === this.disabledPhase && (this.phaseIndex = 0, this.phase = this.phases[this.phaseIndex]), !0
        }, i._cancel = function () {
            var e = !1;
            return this._animationFrameActive && (this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), this._animationFrameActive = !1, this._willRun = !1, e = !0), this._isRunning || this._reset(), e
        }, i._onAnimationFrame = function (e) {
            for (this._subscribers = this._nextFrameSubscribers, this._subscribersOrder = this._nextFrameSubscribersOrder, this._subscriberArrayLength = this._nextFrameSubscriberArrayLength, this._subscriberCount = this._nextFrameSubscriberCount, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this.phaseIndex = 0, this.phase = this.phases[this.phaseIndex], this._isRunning = !0, this._willRun = !1, this._didRequestNextRAF = !1, this._rafData.delta = e - this.lastFrameTime, this.lastFrameTime = e, this._rafData.fps = 0, this._rafData.delta >= 1e3 && (this._rafData.delta = 0), 0 !== this._rafData.delta && (this._rafData.fps = 1e3 / this._rafData.delta), this._rafData.time = e, this._rafData.naturalFps = this._rafData.fps, this._rafData.timeNow = Date.now(), this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._onAnimationFrameStart(this._rafData);
            for (this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase), this._runPhaseIndex = 0; this._runPhaseIndex < this._runPhasesLength; this._runPhaseIndex++) {
                for (this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]].trigger(this.phase, this._rafData);
                this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase)
            }
            for (this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._onAnimationFrameEnd(this._rafData);
            this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase), this._willRun ? (this.phaseIndex = 0, this.phaseIndex = this.phases[this.phaseIndex]) : this._reset()
        }, i._onExternalAnimationFrame = function (e) {
            this._isUsingExternalAnimationFrame && this._onAnimationFrame(e)
        }, i._reset = function () {
            this._rafData || (this._rafData = {}), this._rafData.time = 0, this._rafData.delta = 0, this._rafData.fps = 0, this._rafData.naturalFps = 0, this._rafData.timeNow = 0, this._subscribers = {}, this._subscribersOrder = [], this._currentSubscriberIndex = -1, this._subscriberArrayLength = 0, this._subscriberCount = 0, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._didEmitFrameData = !1, this._animationFrame = null, this._animationFrameActive = !1, this._isRunning = !1, this._shouldReset = !1, this.lastFrameTime = 0, this._runPhaseIndex = -1, this.phaseIndex = -1, this.phase = this.disabledPhase
        }, t.exports = r
    }, {
        "@marcom/ac-event-emitter-micro/EventEmitterMicro": 24
    }],
    30: [function (e, t, n) {
        "use strict";
        var r = e("./SingleCallRAFEmitter"),
            i = function (e) {
                this.phase = e, this.rafEmitter = new r, this._cachePhaseIndex(), this.requestAnimationFrame = this.requestAnimationFrame.bind(this), this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this), this._onBeforeRAFExecutorStart = this._onBeforeRAFExecutorStart.bind(this), this._onBeforeRAFExecutorPhase = this._onBeforeRAFExecutorPhase.bind(this), this._onAfterRAFExecutorPhase = this._onAfterRAFExecutorPhase.bind(this), this.rafEmitter.on(this.phase, this._onRAFExecuted.bind(this)), this.rafEmitter.executor.eventEmitter.on("before:start", this._onBeforeRAFExecutorStart), this.rafEmitter.executor.eventEmitter.on("before:" + this.phase, this._onBeforeRAFExecutorPhase), this.rafEmitter.executor.eventEmitter.on("after:" + this.phase, this._onAfterRAFExecutorPhase), this._frameCallbacks = [], this._currentFrameCallbacks = [], this._nextFrameCallbacks = [], this._phaseActive = !1, this._currentFrameID = -1, this._cancelFrameIdx = -1, this._frameCallbackLength = 0, this._currentFrameCallbacksLength = 0, this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0
            },
            a = i.prototype;
        a.requestAnimationFrame = function (e, t) {
            return t === !0 && this.rafEmitter.executor.phaseIndex > 0 && this.rafEmitter.executor.phaseIndex <= this.phaseIndex ? this._phaseActive ? (this._currentFrameID = this.rafEmitter.executor.subscribeImmediate(this.rafEmitter, !0), this._frameCallbacks.push(this._currentFrameID, e), this._frameCallbackLength += 2) : (this._currentFrameID = this.rafEmitter.executor.subscribeImmediate(this.rafEmitter, !1), this._currentFrameCallbacks.push(this._currentFrameID, e), this._currentFrameCallbacksLength += 2) : (this._currentFrameID = this.rafEmitter.run(), this._nextFrameCallbacks.push(this._currentFrameID, e), this._nextFrameCallbacksLength += 2), this._currentFrameID
        }, a.cancelAnimationFrame = function (e) {
            this._cancelFrameIdx = this._nextFrameCallbacks.indexOf(e), this._cancelFrameIdx > -1 ? this._cancelNextAnimationFrame() : (this._cancelFrameIdx = this._currentFrameCallbacks.indexOf(e), this._cancelFrameIdx > -1 ? this._cancelCurrentAnimationFrame() : (this._cancelFrameIdx = this._frameCallbacks.indexOf(e), this._cancelFrameIdx > -1 && this._cancelRunningAnimationFrame()))
        }, a._onRAFExecuted = function (e) {
            for (this._frameCallbackIteration = 0; this._frameCallbackIteration < this._frameCallbackLength; this._frameCallbackIteration += 2) this._frameCallbacks[this._frameCallbackIteration + 1](e.time, e);
            this._frameCallbacks.length = 0, this._frameCallbackLength = 0
        }, a._onBeforeRAFExecutorStart = function () {
            Array.prototype.push.apply(this._currentFrameCallbacks, this._nextFrameCallbacks.splice(0, this._nextFrameCallbacksLength)), this._currentFrameCallbacksLength = this._nextFrameCallbacksLength, this._nextFrameCallbacks.length = 0, this._nextFrameCallbacksLength = 0
        }, a._onBeforeRAFExecutorPhase = function () {
            this._phaseActive = !0, Array.prototype.push.apply(this._frameCallbacks, this._currentFrameCallbacks.splice(0, this._currentFrameCallbacksLength)), this._frameCallbackLength = this._currentFrameCallbacksLength, this._currentFrameCallbacks.length = 0, this._currentFrameCallbacksLength = 0
        }, a._onAfterRAFExecutorPhase = function () {
            this._phaseActive = !1
        }, a._cachePhaseIndex = function () {
            this.phaseIndex = this.rafEmitter.executor.phases.indexOf(this.phase)
        }, a._cancelRunningAnimationFrame = function () {
            this._frameCallbacks.splice(this._cancelFrameIdx, 2), this._frameCallbackLength -= 2
        }, a._cancelCurrentAnimationFrame = function () {
            this._currentFrameCallbacks.splice(this._cancelFrameIdx, 2), this._currentFrameCallbacksLength -= 2
        }, a._cancelNextAnimationFrame = function () {
            this._nextFrameCallbacks.splice(this._cancelFrameIdx, 2), this._nextFrameCallbacksLength -= 2, 0 === this._nextFrameCallbacksLength && this.rafEmitter.cancel()
        }, t.exports = i
    }, {
        "./SingleCallRAFEmitter": 32
    }],
    31: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterface"),
            i = function () {
                this.events = {}
            },
            a = i.prototype;
        a.requestAnimationFrame = function (e) {
            return this.events[e] || (this.events[e] = new r(e)), this.events[e].requestAnimationFrame
        }, a.cancelAnimationFrame = function (e) {
            return this.events[e] || (this.events[e] = new r(e)), this.events[e].cancelAnimationFrame
        }, t.exports = new i
    }, {
        "./RAFInterface": 30
    }],
    32: [function (e, t, n) {
        "use strict";
        var r = e("./RAFEmitter"),
            i = function (e) {
                r.call(this, e)
            },
            a = i.prototype = Object.create(r.prototype);
        a._subscribe = function () {
            return this.executor.subscribe(this, !0)
        }, t.exports = i
    }, {
        "./RAFEmitter": 28
    }],
    33: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterfaceController");
        t.exports = r.cancelAnimationFrame("draw")
    }, {
        "./RAFInterfaceController": 31
    }],
    34: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterfaceController");
        t.exports = r.cancelAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 31
    }],
    35: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterfaceController");
        t.exports = r.requestAnimationFrame("draw")
    }, {
        "./RAFInterfaceController": 31
    }],
    36: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterfaceController");
        t.exports = r.requestAnimationFrame("external")
    }, {
        "./RAFInterfaceController": 31
    }],
    37: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/ac-shared-instance").SharedInstance,
            i = e("../.release-info.js").majorVersionNumber,
            a = function () {
                this._currentID = 0
            };
        a.prototype.getNewID = function () {
            return this._currentID++, "raf:" + this._currentID
        }, t.exports = r.share("@marcom/ac-raf-emitter/sharedRAFEmitterIDGeneratorInstance", i, a)
    }, {
        "../.release-info.js": 27,
        "@marcom/ac-shared-instance": 42
    }],
    38: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/ac-shared-instance").SharedInstance,
            i = e("../.release-info.js").majorVersionNumber,
            a = e("./RAFExecutor");
        t.exports = r.share("@marcom/ac-raf-emitter/sharedRAFExecutorInstance", i, a)
    }, {
        "../.release-info.js": 27,
        "./RAFExecutor": 29,
        "@marcom/ac-shared-instance": 42
    }],
    39: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterfaceController");
        t.exports = r.requestAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 31
    }],
    40: [function (e, t, n) {
        "use strict";

        function r(e) {
            e = e || {}, this._reset(), this._willRun = !1, this._totalSubscribeCount = -1,
                this._requestAnimationFrame = window.requestAnimationFrame, this._cancelAnimationFrame = window.cancelAnimationFrame, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
        }
        e("@marcom/ac-polyfills/performance/now");
        var i;
        i = r.prototype, i.subscribe = function (e, t) {
            return this._totalSubscribeCount++, this._nextFrameSubscribers[e.id] || (t ? this._nextFrameSubscribersOrder.unshift(e.id) : this._nextFrameSubscribersOrder.push(e.id), this._nextFrameSubscribers[e.id] = e, this._nextFrameSubscriberArrayLength++, this._nextFrameSubscriberCount++, this._run()), this._totalSubscribeCount
        }, i.unsubscribe = function (e) {
            return !!this._nextFrameSubscribers[e.id] && (this._nextFrameSubscribers[e.id] = null, this._nextFrameSubscriberCount--, 0 === this._nextFrameSubscriberCount && this._cancel(), !0)
        }, i.trigger = function (e, t) {
            var n;
            for (n = 0; n < this._subscriberArrayLength; n++) null !== this._subscribers[this._subscribersOrder[n]] && this._subscribers[this._subscribersOrder[n]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[n]].trigger(e, t)
        }, i.destroy = function () {
            var e = this._cancel();
            return this._subscribers = null, this._subscribersOrder = null, this._nextFrameSubscribers = null, this._nextFrameSubscribersOrder = null, this._rafData = null, this._boundOnAnimationFrame = null, this._onExternalAnimationFrame = null, e
        }, i.useExternalAnimationFrame = function (e) {
            if ("boolean" == typeof e) {
                var t = this._isUsingExternalAnimationFrame;
                return e && this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), !this._willRun || e || this._animationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this._isUsingExternalAnimationFrame = e, e ? this._boundOnExternalAnimationFrame : t || !1
            }
        }, i._run = function () {
            if (!this._willRun) return this._willRun = !0, 0 === this.lastFrameTime && (this.lastFrameTime = performance.now()), this._animationFrameActive = !0, this._isUsingExternalAnimationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), !0
        }, i._cancel = function () {
            var e = !1;
            return this._animationFrameActive && (this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), this._animationFrameActive = !1, this._willRun = !1, e = !0), this._isRunning || this._reset(), e
        }, i._onSubscribersAnimationFrameStart = function (e) {
            var t;
            for (t = 0; t < this._subscriberArrayLength; t++) null !== this._subscribers[this._subscribersOrder[t]] && this._subscribers[this._subscribersOrder[t]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[t]]._onAnimationFrameStart(e)
        }, i._onSubscribersAnimationFrameEnd = function (e) {
            var t;
            for (t = 0; t < this._subscriberArrayLength; t++) null !== this._subscribers[this._subscribersOrder[t]] && this._subscribers[this._subscribersOrder[t]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[t]]._onAnimationFrameEnd(e)
        }, i._onAnimationFrame = function (e) {
            this._subscribers = this._nextFrameSubscribers, this._subscribersOrder = this._nextFrameSubscribersOrder, this._subscriberArrayLength = this._nextFrameSubscriberArrayLength, this._subscriberCount = this._nextFrameSubscriberCount, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._isRunning = !0, this._willRun = !1, this._didRequestNextRAF = !1, this._rafData.delta = e - this.lastFrameTime, this.lastFrameTime = e, this._rafData.fps = 0, this._rafData.delta >= 1e3 && (this._rafData.delta = 0), 0 !== this._rafData.delta && (this._rafData.fps = 1e3 / this._rafData.delta), this._rafData.time = e, this._rafData.naturalFps = this._rafData.fps, this._rafData.timeNow = Date.now(), this._onSubscribersAnimationFrameStart(this._rafData), this.trigger("update", this._rafData), this.trigger("external", this._rafData), this.trigger("draw", this._rafData), this._onSubscribersAnimationFrameEnd(this._rafData), this._willRun || this._reset()
        }, i._onExternalAnimationFrame = function (e) {
            this._isUsingExternalAnimationFrame && this._onAnimationFrame(e)
        }, i._reset = function () {
            this._rafData = {
                time: 0,
                delta: 0,
                fps: 0,
                naturalFps: 0,
                timeNow: 0
            }, this._subscribers = {}, this._subscribersOrder = [], this._subscriberArrayLength = 0, this._subscriberCount = 0, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._didEmitFrameData = !1, this._animationFrame = null, this._animationFrameActive = !1, this._isRunning = !1, this._shouldReset = !1, this.lastFrameTime = 0
        }, t.exports = r
    }, {
        "@marcom/ac-polyfills/performance/now": void 0
    }],
    41: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/ac-shared-instance").SharedInstance,
            i = "ac-raf-executor:sharedRAFExecutorInstance",
            a = "2.0.1",
            s = e("./RAFExecutor");
        t.exports = r.share(i, a, s)
    }, {
        "./RAFExecutor": 40,
        "@marcom/ac-shared-instance": 42
    }],
    42: [function (e, t, n) {
        "use strict";
        t.exports = {
            SharedInstance: e("./ac-shared-instance/SharedInstance")
        }
    }, {
        "./ac-shared-instance/SharedInstance": 43
    }],
    43: [function (e, t, n) {
        "use strict";
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = window,
            a = "AC",
            s = "SharedInstance",
            o = i[a],
            c = function () {
                var e = {};
                return {
                    get: function (t, n) {
                        var r = null;
                        return e[t] && e[t][n] && (r = e[t][n]), r
                    },
                    set: function (t, n, r) {
                        return e[t] || (e[t] = {}), "function" == typeof r ? e[t][n] = new r : e[t][n] = r, e[t][n]
                    },
                    share: function (e, t, n) {
                        var r = this.get(e, t);
                        return r || (r = this.set(e, t, n)), r
                    },
                    remove: function (t, n) {
                        var i = "undefined" == typeof n ? "undefined" : r(n);
                        if ("string" === i || "number" === i) {
                            if (!e[t] || !e[t][n]) return;
                            return void(e[t][n] = null)
                        }
                        e[t] && (e[t] = null)
                    }
                }
            }();
        o || (o = i[a] = {}), o[s] || (o[s] = c), t.exports = o[s]
    }, {}],
    44: [function (e, t, n) {
        "use strict";
        t.exports = function (e) {
            e = e || window.location.search, e = e.replace(/^[^?]*\?/, "");
            var t = "&",
                n = e ? e.split(t) : [],
                r = {},
                i = "=",
                a = new RegExp(i);
            return n.forEach(function (e) {
                var t, n;
                if (a.test(e)) {
                    var s = e.split(i, 2);
                    t = s[0], n = s[1]
                } else t = e, n = null;
                r[t] = n
            }), r
        }
    }, {}],
    45: [function (e, t, n) {
        "use strict";

        function r(e) {
            var t = e.port,
                n = new RegExp(":" + t);
            return t && !n.test(e.href) && n.test(e.host)
        }
        var i = e("./parseSearchParams");
        t.exports = function (e) {
            var t, n = "",
                a = !1;
            return e ? window.URL && "function" == typeof window.URL ? t = new URL(e, window.location) : (t = document.createElement("a"), t.href = e, t.href = t.href, r(t) && (n = t.host.replace(new RegExp(":" + t.port), ""), a = !0)) : t = window.location, {
                hash: t.hash,
                host: n || t.host,
                hostname: t.hostname,
                href: t.href,
                origin: t.origin || t.protocol + "//" + (n || t.host),
                pathname: t.pathname,
                port: a ? "" : t.port,
                protocol: t.protocol,
                search: t.search,
                searchParams: i(t.search)
            }
        }
    }, {
        "./parseSearchParams": 44
    }],
    46: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = function () {
                function e() {
                    var t = this,
                        n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    r(this, e), this.options = n, "loading" === document.readyState ? document.addEventListener("readystatechange", function (e) {
                        "interactive" === document.readyState && t._init()
                    }) : this._init()
                }
                return i(e, [{
                    key: "_init",
                    value: function () {
                        return this._images = Array.from(document.querySelectorAll("*[" + e.DATA_ATTRIBUTE + "]")), this.AnimSystem = this._findAnim(), null === this.AnimSystem ? null : void this._addKeyframesToImages()
                    }
                }, {
                    key: "_defineKeyframeOptions",
                    value: function () {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                            n = t.getAttribute(e.DATA_DOWNLOAD_AREA_KEYFRAME) || "{}";
                        return Object.assign({}, {
                            start: "t - 200vh",
                            end: "b + 100vh",
                            event: "AnimLazyImage"
                        }, JSON.parse(n))
                    }
                }, {
                    key: "_addKeyframesToImages",
                    value: function () {
                        var e = this;
                        this._scrollGroup = this.AnimSystem.getGroupForTarget(document.body), this._images.forEach(function (t) {
                            var n = e._defineKeyframeOptions(t),
                                r = e._scrollGroup.addKeyframe(t, n);
                            r.controller.once("AnimLazyImage:enter", function () {
                                e._imageIsInLoadRange(t)
                            })
                        })
                    }
                }, {
                    key: "_cleanUpImageAttributes",
                    value: function (t) {
                        var n = this._scrollGroup.getControllerForTarget(t).getNearestKeyframeForAttribute("AnimLazyImage").isCurrentlyInRange;
                        n || t.setAttribute(e.DATA_ATTRIBUTE, "")
                    }
                }, {
                    key: "_downloadingImageAttributes",
                    value: function (t) {
                        t.removeAttribute(e.DATA_ATTRIBUTE)
                    }
                }, {
                    key: "_imageIsInLoadRange",
                    value: function (e) {
                        this._downloadImage(e)
                    }
                }, {
                    key: "_downloadImage",
                    value: function (e) {
                        this._downloadingImageAttributes(e)
                    }
                }, {
                    key: "_findAnim",
                    value: function () {
                        var e = Array.from(document.querySelectorAll("[data-anim-group],[data-anim-scroll-group],[data-anim-time-group]"));
                        return e.map(function (e) {
                            return e._animInfo ? e._animInfo.group : null
                        }).filter(function (e) {
                            return null !== e
                        }), e[0] && e[0]._animInfo ? e[0]._animInfo.group.anim : (console.error("AnimLazyImage: AnimSystem not found, please initialize anim before instantiating"), null)
                    }
                }]), e
            }();
        a.DATA_DOWNLOAD_AREA_KEYFRAME = "data-download-area-keyframe", a.DATA_ATTRIBUTE = "data-anim-lazy-image", t.exports = a
    }, {}],
    47: [function (e, t, n) {
        "use strict";
        t.exports = {
            version: "3.0.10",
            major: "3.x",
            majorMinor: "3.0"
        }
    }, {}],
    48: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            c = e("./Model/AnimSystemModel"),
            l = e("./Keyframes/Keyframe"),
            u = e("./Keyframes/KeyframeCSSClass"),
            h = e("./Keyframes/KeyframeDiscreteEvent"),
            m = e("./ScrollGroup"),
            d = e("./TimeGroup"),
            f = e("./.release-info"),
            p = {
                update: e("@marcom/ac-raf-emitter/update"),
                cancelUpdate: e("@marcom/ac-raf-emitter/cancelUpdate"),
                external: e("@marcom/ac-raf-emitter/external"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            v = null,
            y = function (e) {
                function t() {
                    r(this, t);
                    var e = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    if (v) throw "You cannot create multiple AnimSystems. You probably want to create multiple groups instead. You can have unlimited groups on a page";
                    return v = e, e.groups = [], e.scrollSystems = [], e.timeSystems = [], e._forceUpdateRAFId = -1, e._initialized = !1, e.model = c, e.version = f.version, e.onScroll = e.onScroll.bind(e), e.onResizedDebounced = e.onResizedDebounced.bind(e), e.onResizeImmediate = e.onResizeImmediate.bind(e), e
                }
                return a(t, e), s(t, [{
                    key: "initialize",
                    value: function () {
                        this._initialized || (this._initialized = !0, this.timeSystems = [], this.scrollSystems = [], this.groups = [], this.setupEvents(), this.initializeResizeFilter(), this.initializeModel(), this.createDOMGroups(), this.createDOMKeyframes())
                    }
                }, {
                    key: "remove",
                    value: function () {
                        var e = this;
                        return Promise.all(this.groups.map(function (e) {
                            return e.remove()
                        })).then(function () {
                            e.groups = null, e.scrollSystems = null, e.timeSystems = null, window.clearTimeout(c.RESIZE_TIMEOUT), window.removeEventListener("scroll", e.onScroll), window.removeEventListener("resize", e.onResizeImmediate), e._events = {}, e._initialized = !1
                        })
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        return this.remove()
                    }
                }, {
                    key: "createTimeGroup",
                    value: function (e) {
                        var t = new d(e, this);
                        return this.groups.push(t), this.timeSystems.push(t), this.trigger(c.EVENTS.ON_GROUP_CREATED, t), t
                    }
                }, {
                    key: "createScrollGroup",
                    value: function (e) {
                        if (!e) throw "AnimSystem scroll based groups must supply an HTMLElement";
                        var t = new m(e, this);
                        return this.groups.push(t), this.scrollSystems.push(t), this.trigger(c.EVENTS.ON_GROUP_CREATED, t), t
                    }
                }, {
                    key: "removeGroup",
                    value: function (e) {
                        var t = this;
                        return Promise.all(e.keyframeControllers.map(function (t) {
                            return e.removeKeyframeController(t)
                        })).then(function () {
                            var n = t.groups.indexOf(e);
                            n !== -1 && t.groups.splice(n, 1), n = t.scrollSystems.indexOf(e), n !== -1 && t.scrollSystems.splice(n, 1), n = t.timeSystems.indexOf(e), n !== -1 && t.timeSystems.splice(n, 1), e.destroy()
                        })
                    }
                }, {
                    key: "createDOMGroups",
                    value: function () {
                        var e = this;
                        document.body.setAttribute("data-anim-scroll-group", "body"), document.querySelectorAll("[data-anim-scroll-group]").forEach(function (t) {
                            return e.createScrollGroup(t)
                        }), document.querySelectorAll("[data-anim-time-group]").forEach(function (t) {
                            return e.createTimeGroup(t)
                        }), this.trigger(c.EVENTS.ON_DOM_GROUPS_CREATED, this.groups)
                    }
                }, {
                    key: "createDOMKeyframes",
                    value: function () {
                        var e = this,
                            t = [];
                        [l.DATA_ATTRIBUTE, u.DATA_ATTRIBUTE, h.DATA_ATTRIBUTE].forEach(function (e) {
                            for (var n = 0; n < 12; n++) t.push(e + (0 === n ? "" : "-" + (n - 1)))
                        });
                        for (var n = 0; n < t.length; n++)
                            for (var r = t[n], i = document.querySelectorAll("[" + r + "]"), a = 0; a < i.length; a++) {
                                var s = i[a],
                                    o = JSON.parse(s.getAttribute(r));
                                this.addKeyframe(s, o)
                            }
                        p.update(function () {
                            e.groups.forEach(function (e) {
                                return e.onKeyframesDirty({
                                    silent: !0
                                })
                            }), e.groups.forEach(function (e) {
                                return e.trigger(c.EVENTS.ON_DOM_KEYFRAMES_CREATED, e)
                            }), e.trigger(c.EVENTS.ON_DOM_KEYFRAMES_CREATED, e), e.groups.forEach(function (e) {
                                e.forceUpdate({
                                    waitForNextUpdate: !1,
                                    silent: !0
                                }), e.reconcile()
                            }), e.onScroll()
                        }, !0)
                    }
                }, {
                    key: "initializeResizeFilter",
                    value: function () {
                        if (!c.cssDimensionsTracker) {
                            var e = document.querySelector(".cssDimensionsTracker") || document.createElement("div");
                            e.setAttribute("cssDimensionsTracker", "true"), e.style.position = "fixed", e.style.top = "0", e.style.width = "100%", e.style.height = "100vh", e.style.pointerEvents = "none", e.style.visibility = "hidden", e.style.zIndex = "-1", document.documentElement.appendChild(e), c.cssDimensionsTracker = e
                        }
                    }
                }, {
                    key: "initializeModel",
                    value: function () {
                        c.pageMetrics.windowHeight = c.cssDimensionsTracker.clientHeight, c.pageMetrics.windowWidth = c.cssDimensionsTracker.clientWidth, c.pageMetrics.scrollY = window.scrollY || window.pageYOffset, c.pageMetrics.scrollX = window.scrollX || window.pageXOffset, c.pageMetrics.breakpoint = c.getBreakpoint();
                        var e = document.documentElement.getBoundingClientRect();
                        c.pageMetrics.documentOffsetX = e.left + c.pageMetrics.scrollX, c.pageMetrics.documentOffsetY = e.top + c.pageMetrics.scrollY
                    }
                }, {
                    key: "setupEvents",
                    value: function () {
                        window.removeEventListener("scroll", this.onScroll), window.addEventListener("scroll", this.onScroll), window.removeEventListener("resize", this.onResizeImmediate), window.addEventListener("resize", this.onResizeImmediate)
                    }
                }, {
                    key: "onScroll",
                    value: function () {
                        c.pageMetrics.scrollY = window.scrollY || window.pageYOffset, c.pageMetrics.scrollX = window.scrollX || window.pageXOffset;
                        for (var e = 0, t = this.scrollSystems.length; e < t; e++) this.scrollSystems[e]._onScroll();
                        this.trigger(c.PageEvents.ON_SCROLL, c.pageMetrics)
                    }
                }, {
                    key: "onResizeImmediate",
                    value: function () {
                        var e = c.cssDimensionsTracker.clientWidth,
                            t = c.cssDimensionsTracker.clientHeight;
                        if (e !== c.pageMetrics.windowWidth || t !== c.pageMetrics.windowHeight) {
                            c.pageMetrics.windowWidth = e, c.pageMetrics.windowHeight = t, c.pageMetrics.scrollY = window.scrollY || window.pageYOffset, c.pageMetrics.scrollX = window.scrollX || window.pageXOffset;
                            var n = document.documentElement.getBoundingClientRect();
                            c.pageMetrics.documentOffsetX = n.left + c.pageMetrics.scrollX, c.pageMetrics.documentOffsetY = n.top + c.pageMetrics.scrollY, window.clearTimeout(c.RESIZE_TIMEOUT), c.RESIZE_TIMEOUT = window.setTimeout(this.onResizedDebounced, 250), this.trigger(c.PageEvents.ON_RESIZE_IMMEDIATE, c.pageMetrics)
                        }
                    }
                }, {
                    key: "onResizedDebounced",
                    value: function () {
                        var e = this;
                        p.update(function () {
                            var t = c.pageMetrics.breakpoint,
                                n = c.getBreakpoint(),
                                r = n !== t;
                            if (r) {
                                c.pageMetrics.previousBreakpoint = t, c.pageMetrics.breakpoint = n;
                                for (var i = 0, a = e.groups.length; i < a; i++) e.groups[i]._onBreakpointChange();
                                e.trigger(c.PageEvents.ON_BREAKPOINT_CHANGE, c.pageMetrics)
                            }
                            for (var s = 0, o = e.groups.length; s < o; s++) e.groups[s].forceUpdate({
                                waitForNextUpdate: !1
                            });
                            e.trigger(c.PageEvents.ON_RESIZE_DEBOUNCED, c.pageMetrics)
                        }, !0)
                    }
                }, {
                    key: "forceUpdate",
                    value: function () {
                        var e = this,
                            t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            n = t.waitForNextUpdate,
                            r = void 0 === n || n,
                            i = t.silent,
                            a = void 0 !== i && i;
                        this._forceUpdateRAFId !== -1 && p.cancelUpdate(this._forceUpdateRAFId);
                        var s = function () {
                            for (var t = 0, n = e.groups.length; t < n; t++) {
                                var r = e.groups[t];
                                r.forceUpdate({
                                    waitForNextUpdate: !1,
                                    silent: a
                                })
                            }
                            return -1
                        };
                        this._forceUpdateRAFId = r ? p.update(s, !0) : s()
                    }
                }, {
                    key: "addKeyframe",
                    value: function (e, t) {
                        var n = this.getGroupForTarget(e);
                        return n = n || this.getGroupForTarget(document.body), n.addKeyframe(e, t)
                    }
                }, {
                    key: "getGroupForTarget",
                    value: function (e) {
                        if (e._animInfo && e._animInfo.group) return e._animInfo.group;
                        for (var t = e; t;) {
                            if (t._animInfo && t._animInfo.isGroup) return t._animInfo.group;
                            t = t.parentElement
                        }
                    }
                }, {
                    key: "getControllerForTarget",
                    value: function (e) {
                        return e._animInfo && e._animInfo.controller ? e._animInfo.controller : null
                    }
                }]), t
            }(o);
        t.exports = window.AC.SharedInstance.share("AnimSystem", f.major, y)
    }, {
        "./.release-info": 47,
        "./Keyframes/Keyframe": 49,
        "./Keyframes/KeyframeCSSClass": 50,
        "./Keyframes/KeyframeDiscreteEvent": 52,
        "./Model/AnimSystemModel": 53,
        "./ScrollGroup": 61,
        "./TimeGroup": 62,
        "@marcom/ac-event-emitter-micro": 23,
        "@marcom/ac-raf-emitter/cancelUpdate": 34,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/external": 36,
        "@marcom/ac-raf-emitter/update": 39
    }],
    49: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("../Model/AnimSystemModel"),
            s = e("@marcom/sm-math-utils"),
            o = e("../Model/EasingFunctions"),
            c = e("../Model/UnitBezier"),
            l = e("../utils/arrayToObject"),
            u = e("../utils/toValidAnchor"),
            h = function () {
                function e(t, n) {
                    r(this, e), this.controller = t, this.anchors = [], this.jsonProps = n, this.ease = t.group.defaultEase, this.easeFunctionString = a.KeyframeDefaults.easeFunctionString, this.easeFunction = o[this.easeFunctionString], this.start = 0, this.end = 0, this.localT = 0, this.curvedT = 0, this.id = 0, this.event = "", this.needsEventDispatch = !1, this.snapAtCreation = !1, this.isEnabled = !1, this.animValues = {}, this.breakpointMask = "SMLX", this.disabledWhen = [], this.keyframeType = a.KeyframeTypes.Interpolation, this.hold = !1
                }
                return i(e, [{
                    key: "destroy",
                    value: function () {
                        this.controller = null, this.disabledWhen = null, this.anchors = null, this.jsonProps = null, this.easeFunction = null, this.animValues = null
                    }
                }, {
                    key: "remove",
                    value: function () {
                        return this.controller.removeKeyframe(this)
                    }
                }, {
                    key: "parseOptions",
                    value: function (e) {
                        var t = this;
                        if (this.jsonProps = e, e.relativeTo && console.error("KeyframeError: relativeTo has been removed. Use 'anchors' property instead. Found 'relativeTo':\"" + e.relativeTo + '"'), "" !== e.anchors && e.anchors ? (this.anchors = [], e.anchors = Array.isArray(e.anchors) ? e.anchors : [e.anchors], e.anchors.forEach(function (n, r) {
                                var i = u(n, t.controller.group.element);
                                if (!i) {
                                    var a = "";
                                    return "string" == typeof n && (a = " Provided value was a string, so a failed attempt was made to find anchor with the provided querystring in group.element, or in the document."), void console.warn("Keyframe on", t.controller.element, " failed to find anchor at index " + r + " in array", e.anchors, ". Anchors must be JS Object references, Elements references, or valid query selector strings. " + a)
                                }
                                t.anchors.push(i), t.controller.group.metrics.add(i)
                            })) : (this.anchors = [], e.anchors = []), e.ease ? this.ease = parseFloat(e.ease) : e.ease = this.ease, e.hasOwnProperty("snapAtCreation") ? this.snapAtCreation = e.snapAtCreation : e.snapAtCreation = this.snapAtCreation, e.easeFunction ? this.easeFunction = e.easeFunction : e.easeFunction = this.easeFunctionString, e.breakpointMask ? this.breakpointMask = e.breakpointMask : e.breakpointMask = this.breakpointMask, e.disabledWhen ? this.disabledWhen = Array.isArray(e.disabledWhen) ? e.disabledWhen : [e.disabledWhen] : e.disabledWhen = this.disabledWhen, e.hasOwnProperty("hold") ? this.hold = e.hold : e.hold = this.hold, this.easeFunction = o[e.easeFunction], !o.hasOwnProperty(e.easeFunction)) {
                            var n = c.fromCSSString(e.easeFunction);
                            n ? this.easeFunction = n : console.error("Keyframe parseOptions cannot find EasingFunction named '" + e.easingFunction + "'")
                        }
                        for (var r in e)
                            if (a.KeyframeJSONReservedWords.indexOf(r) === -1) {
                                var i = e[r];
                                if (Array.isArray(i)) {
                                    if (this.animValues[r] = this.controller.group.expressionParser.parseArray(this, i), void 0 === this.controller.tweenProps[r] || !this.controller._ownerIsElement) {
                                        var s = 0;
                                        this.controller._ownerIsElement || (s = this.controller.element[r] || 0);
                                        var l = new a.TargetValue(s, a.KeyframeDefaults.epsilon, this.snapAtCreation);
                                        this.controller.tweenProps[r] = l
                                    }
                                    var h = this.controller.tweenProps[r];
                                    if (e.epsilon) h.epsilon = e.epsilon;
                                    else {
                                        var m = Math.abs(this.animValues[r][0] - this.animValues[r][1]),
                                            d = Math.min(.001 * m, h.epsilon, a.KeyframeDefaults.epsilon);
                                        h.epsilon = Math.max(d, 1e-4)
                                    }
                                }
                            } this.keyframeType = this.hold ? a.KeyframeTypes.InterpolationForward : a.KeyframeTypes.Interpolation, e.event && (this.event = e.event)
                    }
                }, {
                    key: "overwriteProps",
                    value: function (e) {
                        this.animValues = {};
                        var t = Object.assign({}, this.jsonProps, e);
                        this.controller.updateKeyframe(this, t)
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function (e) {
                        if (this.start === this.end || e < this.start || e > this.end) return this.localT = e < this.start ? 0 : e > this.end ? 1 : 0, void(this.curvedT = this.easeFunction(this.localT));
                        var t = (e - this.start) / (this.end - this.start),
                            n = this.hold ? this.localT : 0;
                        this.localT = s.clamp(t, n, 1), this.curvedT = this.easeFunction(this.localT)
                    }
                }, {
                    key: "reconcile",
                    value: function (e) {
                        var t = this.animValues[e],
                            n = this.controller.tweenProps[e];
                        n.initialValue = t[0], n.target = t[0] + this.curvedT * (t[1] - t[0]), n.current !== n.target && (n.current = n.target, this.needsEventDispatch || (this.needsEventDispatch = !0, this.controller.keyframesRequiringDispatch.push(this)))
                    }
                }, {
                    key: "reset",
                    value: function (e) {
                        this.localT = e || 0;
                        var t = this.ease;
                        this.ease = 1;
                        for (var n in this.animValues) this.reconcile(n);
                        this.ease = t
                    }
                }, {
                    key: "onDOMRead",
                    value: function (e) {
                        var t = this.animValues[e],
                            n = this.controller.tweenProps[e];
                        n.target = t[0] + this.curvedT * (t[1] - t[0]);
                        var r = n.current;
                        n.current += (n.target - n.current) * this.ease;
                        var i = n.current - n.target;
                        i < n.epsilon && i > -n.epsilon && (n.current = n.target, i = 0), "" === this.event || this.needsEventDispatch || (i > n.epsilon || i < -n.epsilon || 0 === i && r !== n.current) && (this.needsEventDispatch = !0, this.controller.keyframesRequiringDispatch.push(this))
                    }
                }, {
                    key: "isInRange",
                    value: function (e) {
                        return e >= this.start && e <= this.end
                    }
                }, {
                    key: "setEnabled",
                    value: function (e) {
                        e = e || l(Array.from(document.documentElement.classList));
                        var t = this.breakpointMask.indexOf(a.pageMetrics.breakpoint) !== -1,
                            n = !1;
                        return this.disabledWhen.length > 0 && (n = this.disabledWhen.some(function (t) {
                            return "undefined" != typeof e[t]
                        })), this.isEnabled = t && !n, this.isEnabled
                    }
                }, {
                    key: "evaluateConstraints",
                    value: function () {
                        this.start = this.controller.group.expressionParser.parseTimeValue(this, this.jsonProps.start), this.end = this.controller.group.expressionParser.parseTimeValue(this, this.jsonProps.end), this.evaluateInterpolationConstraints()
                    }
                }, {
                    key: "evaluateInterpolationConstraints",
                    value: function () {
                        for (var e in this.animValues) {
                            var t = this.jsonProps[e];
                            this.animValues[e] = this.controller.group.expressionParser.parseArray(this, t)
                        }
                    }
                }]), e
            }();
        h.DATA_ATTRIBUTE = "data-anim-tween", t.exports = h
    }, {
        "../Model/AnimSystemModel": 53,
        "../Model/EasingFunctions": 54,
        "../Model/UnitBezier": 58,
        "../utils/arrayToObject": 63,
        "../utils/toValidAnchor": 64,
        "@marcom/sm-math-utils": 111
    }],
    50: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            c = e("./Keyframe"),
            l = e("../Model/AnimSystemModel.js"),
            u = function (e) {
                function t(e, n) {
                    r(this, t);
                    var a = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
                    return a.keyframeType = l.KeyframeTypes.CSSClass, a._triggerType = t.TRIGGER_TYPE_CSS_CLASS, a.cssClass = "", a.friendlyName = "", a.style = {
                        on: null,
                        off: null
                    }, a.toggle = !1, a.isApplied = !1, a
                }
                return a(t, e), o(t, [{
                    key: "parseOptions",
                    value: function (e) {
                        if (!this.controller._ownerIsElement) throw new TypeError("CSS Keyframes cannot be applied to JS Objects");
                        if (e.x = void 0, e.y = void 0, e.scale = void 0, e.scaleX = void 0, e.scaleY = void 0, e.rotation = void 0, e.opacity = void 0, e.hold = void 0, void 0 !== e.toggle && (this.toggle = e.toggle), void 0 !== e.cssClass) this._triggerType = t.TRIGGER_TYPE_CSS_CLASS, this.cssClass = e.cssClass, this.friendlyName = "." + this.cssClass, void 0 === this.controller.tweenProps.targetClasses && (this.controller.tweenProps.targetClasses = {
                            add: [],
                            remove: []
                        });
                        else {
                            if (void 0 === e.style || !this.isValidStyleProperty(e.style)) throw new TypeError("KeyframeCSSClass no 'cssClass` property found. If using `style` property its also missing or invalid");
                            if (this._triggerType = t.TRIGGER_TYPE_STYLE_PROPERTY, this.style = e.style, this.friendlyName = "style", this.toggle = void 0 !== this.style.off || this.toggle, this.toggle && void 0 === this.style.off) {
                                this.style.off = {};
                                for (var n in this.style.on) this.style.off[n] = ""
                            }
                            void 0 === this.controller.tweenProps.targetStyles && (this.controller.tweenProps.targetStyles = {})
                        }
                        if (void 0 === e.end && (e.end = e.start), e.toggle = this.toggle, this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.isApplied = this.controller.element.classList.contains(this.cssClass);
                        else {
                            var r = getComputedStyle(this.controller.element);
                            this.isApplied = !0;
                            for (var i in this.style.on)
                                if (r[i] !== this.style.on[i]) {
                                    this.isApplied = !1;
                                    break
                                }
                        }
                        c.prototype.parseOptions.call(this, e), this.animValues[this.friendlyName] = [0, 0], void 0 === this.controller.tweenProps[this.friendlyName] && (this.controller.tweenProps[this.friendlyName] = new l.TargetValue(0, 1, (!1))), this.keyframeType = l.KeyframeTypes.CSSClass
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function (e) {
                        this.isApplied && !this.toggle || (this.start !== this.end ? !this.isApplied && e >= this.start && e <= this.end ? this._apply() : this.isApplied && this.toggle && (e < this.start || e > this.end) && this._unapply() : !this.isApplied && e >= this.start ? this._apply() : this.isApplied && this.toggle && e < this.start && this._unapply())
                    }
                }, {
                    key: "_apply",
                    value: function () {
                        if (this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.controller.tweenProps.targetClasses.add.push(this.cssClass), this.controller.needsClassUpdate = !0;
                        else {
                            for (var e in this.style.on) this.controller.tweenProps.targetStyles[e] = this.style.on[e];
                            this.controller.needsStyleUpdate = !0
                        }
                        this.isApplied = !0
                    }
                }, {
                    key: "_unapply",
                    value: function () {
                        if (this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.controller.tweenProps.targetClasses.remove.push(this.cssClass), this.controller.needsClassUpdate = !0;
                        else {
                            for (var e in this.style.off) this.controller.tweenProps.targetStyles[e] = this.style.off[e];
                            this.controller.needsStyleUpdate = !0
                        }
                        this.isApplied = !1
                    }
                }, {
                    key: "isValidStyleProperty",
                    value: function (e) {
                        if (!e.hasOwnProperty("on")) return !1;
                        if ("object" !== s(e.on)) throw new TypeError("KeyframeCSSClass `style` property should be in the form of: {on:{visibility:hidden, otherProperty: value}}");
                        if (this.toggle && e.hasOwnProperty("off") && "object" !== s(e.off)) throw new TypeError("KeyframeCSSClass `style` property should be in the form of: {on:{visibility:hidden, otherProperty: value}}");
                        return !0
                    }
                }, {
                    key: "reconcile",
                    value: function (e, t) {}
                }, {
                    key: "onDOMRead",
                    value: function (e, t) {}
                }, {
                    key: "evaluateInterpolationConstraints",
                    value: function () {}
                }]), t
            }(c);
        u.TRIGGER_TYPE_CSS_CLASS = 0, u.TRIGGER_TYPE_STYLE_PROPERTY = 1, u.DATA_ATTRIBUTE = "data-anim-classname", t.exports = u
    }, {
        "../Model/AnimSystemModel.js": 53,
        "./Keyframe": 49
    }],
    51: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = function g(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : g(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            c = e("../Model/AnimSystemModel"),
            l = (e("./Keyframe"), e("./KeyframeCSSClass")),
            u = e("../Model/InferKeyframeFromProps"),
            h = e("../utils/arrayToObject"),
            m = e("../Model/UUID"),
            d = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            f = e("@marcom/decompose-css-transform"),
            p = {
                update: e("@marcom/ac-raf-emitter/update"),
                external: e("@marcom/ac-raf-emitter/external"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            v = Math.PI / 180,
            y = {
                create: e("gl-mat4/create"),
                rotateX: e("gl-mat4/rotateX"),
                rotateY: e("gl-mat4/rotateY"),
                rotateZ: e("gl-mat4/rotateZ"),
                scale: e("gl-mat4/scale")
            },
            b = function (e) {
                function t(e, n) {
                    r(this, t);
                    var a = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return a._events.draw = [], a.uuid = m(), a.group = e, a.element = n, a._ownerIsElement = a.element instanceof Element, a._ownerIsElement ? a.friendlyName = a.element.tagName + "." + Array.from(a.element.classList).join(".") : a.friendlyName = a.element.friendlyName || a.uuid, a.element._animInfo = a.element._animInfo || new c.AnimInfo(e, a), a.element._animInfo.controller = a, a.element._animInfo.group = a.group, a.element._animInfo.controllers.push(a), a.tweenProps = a.element._animInfo.tweenProps, a.eventObject = new c.EventObject(a), a.needsStyleUpdate = !1, a.needsClassUpdate = !1, a.elementMetrics = a.group.metrics.add(a.element), a.attributes = [], a.keyframes = {}, a._allKeyframes = [], a._activeKeyframes = [], a.keyframesRequiringDispatch = [], a.updateCachedValuesFromElement(), a.boundsMin = 0, a.boundsMax = 0, a.mat2d = new Float32Array(6), a.mat4 = y.create(), a.needsWrite = !0, a.onDOMWriteImp = a._ownerIsElement ? a.onDOMWriteForElement : a.onDOMWriteForObject, a
                }
                return a(t, e), s(t, [{
                    key: "destroy",
                    value: function () {
                        if (this.element._animInfo) {
                            this.element._animInfo.controller === this && (this.element._animInfo.controller = null);
                            var e = this.element._animInfo.controllers.indexOf(this);
                            e !== -1 && this.element._animInfo.controllers.splice(e, 1), 0 === this.element._animInfo.controllers.length ? this.element._animInfo = null : (this.element._animInfo.controller = this.element._animInfo.controllers[this.element._animInfo.controllers.length - 1], this.element._animInfo.group = this.element._animInfo.controller.group)
                        }
                        this.eventObject.controller = null, this.eventObject.element = null, this.eventObject.keyframe = null, this.eventObject.tweenProps = null, this.eventObject = null, this.elementMetrics = null, this.group = null, this.keyframesRequiringDispatch = null;
                        for (var n = 0; n < this._allKeyframes.length; n++) this._allKeyframes[n].destroy();
                        this._allKeyframes = null, this._activeKeyframes = null, this.attributes = null, this.keyframes = null, this.element = null, this.tweenProps = null, o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this);
                    }
                }, {
                    key: "remove",
                    value: function () {
                        return this.group.removeKeyframeController(this)
                    }
                }, {
                    key: "updateCachedValuesFromElement",
                    value: function () {
                        var e = this;
                        if (this._ownerIsElement) {
                            var t = getComputedStyle(this.element),
                                n = f(this.element, !0),
                                r = c.KeyframeDefaults.epsilon,
                                i = !1;
                            ["x", "y", "z"].forEach(function (t, a) {
                                e.tweenProps[t] = new c.TargetValue(n.translation[a], r, i)
                            }), this.tweenProps.rotation = new c.TargetValue(n.eulerRotation[2], r, i), ["rotationX", "rotationY", "rotationZ"].forEach(function (t, a) {
                                e.tweenProps[t] = new c.TargetValue(n.eulerRotation[a], r, i)
                            }), this.tweenProps.scaleZ = new c.TargetValue(n.scale[0], r, i), ["scaleX", "scaleY", "scale"].forEach(function (t, a) {
                                e.tweenProps[t] = new c.TargetValue(n.scale[a], r, i)
                            }), this.tweenProps.opacity = new c.TargetValue(parseFloat(t.opacity), r, i)
                        }
                    }
                }, {
                    key: "addKeyframe",
                    value: function (e) {
                        var t = u(e);
                        if (!t) throw new Error("AnimSystem Cannot create keyframe for from options `" + e + "`");
                        var n = new t(this, e);
                        return n.parseOptions(e), n.id = this._allKeyframes.length, this._allKeyframes.push(n), n
                    }
                }, {
                    key: "needsUpdate",
                    value: function () {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var n = this.attributes[e],
                                r = this.tweenProps[n],
                                i = Math.abs(r.current - r.target);
                            if (i > r.epsilon) return !0
                        }
                        return !1
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function (e) {
                        for (var t = 0, n = this.attributes.length; t < n; t++) {
                            var r = this.attributes[t],
                                i = this.keyframes[this.attributes[t]];
                            if (1 !== i.length) {
                                var a = this.getNearestKeyframeForAttribute(r, e);
                                a && a.updateLocalProgress(e)
                            } else i[0].updateLocalProgress(e)
                        }
                    }
                }, {
                    key: "reconcile",
                    value: function () {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var n = this.attributes[e],
                                r = this.getNearestKeyframeForAttribute(n, this.group.position.local);
                            r.updateLocalProgress(this.group.position.local), r.snapAtCreation && r.reconcile(n)
                        }
                    }
                }, {
                    key: "determineActiveKeyframes",
                    value: function (e) {
                        var t = this;
                        e = e || h(Array.from(document.documentElement.classList));
                        var n = this._activeKeyframes,
                            r = this.attributes;
                        this._activeKeyframes = [], this.attributes = [], this.keyframes = {};
                        for (var i = 0; i < this._allKeyframes.length; i++) {
                            var a = this._allKeyframes[i];
                            if (a.setEnabled(e)) {
                                this._activeKeyframes.push(a);
                                for (var s in a.animValues) this.keyframes[s] = this.keyframes[s] || [], this.keyframes[s].push(a), this.attributes.indexOf(s) === -1 && (this.attributes.push(s), this.tweenProps[s].isActive = !0)
                            }
                        }
                        var o = n.filter(function (e) {
                            return t._activeKeyframes.indexOf(e) === -1
                        });
                        if (0 !== o.length) {
                            var c = r.filter(function (e) {
                                return t.attributes.indexOf(e) === -1
                            });
                            if (0 !== c.length)
                                if (this.needsWrite = !0, this._ownerIsElement) p.external(function () {
                                    var e = ["x", "y", "z", "scale", "scaleX", "scaleY", "rotation", "rotationX", "rotationY", "rotationZ"],
                                        n = c.filter(function (t) {
                                            return e.indexOf(t) !== -1
                                        });
                                    n.length > 0 && t.element.style.removeProperty("transform");
                                    for (var r = 0, i = c.length; r < i; ++r) {
                                        var a = c[r],
                                            s = t.tweenProps[a];
                                        s.current = s.target, s.isActive = !1, "opacity" === a && t.element.style.removeProperty("opacity")
                                    }
                                    for (var u = 0, h = o.length; u < h; ++u) {
                                        var m = o[u];
                                        m instanceof l && m._unapply()
                                    }
                                }, !0);
                                else
                                    for (var u = 0, m = c.length; u < m; ++u) {
                                        var d = this.tweenProps[c[u]];
                                        d.current = d.target, d.isActive = !1
                                    }
                        }
                    }
                }, {
                    key: "onDOMRead",
                    value: function (e) {
                        for (var t = 0, n = this.attributes.length; t < n; t++) {
                            var r = this.attributes[t];
                            this.tweenProps[r].previousValue = this.tweenProps[r].current;
                            var i = this.getNearestKeyframeForAttribute(r, e.local);
                            i && i.onDOMRead(r), this.tweenProps[r].previousValue !== this.tweenProps[r].current && (this.needsWrite = !0)
                        }
                    }
                }, {
                    key: "onDOMWrite",
                    value: function () {
                        (this.needsWrite || this.needsClassUpdate || this.needsStyleUpdate) && (this.needsWrite = !1, this.onDOMWriteImp(), this.handleEventDispatch())
                    }
                }, {
                    key: "onDOMWriteForObject",
                    value: function () {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var n = this.attributes[e];
                            this.element[n] = this.tweenProps[n].current
                        }
                    }
                }, {
                    key: "onDOMWriteForElement",
                    value: function () {
                        var e = this.tweenProps;
                        if (e.z.isActive || e.rotationX.isActive || e.rotationY.isActive) {
                            var t = this.mat4;
                            if (t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, e.x.isActive || e.y.isActive || e.z.isActive) {
                                var n = e.x.current,
                                    r = e.y.current,
                                    i = e.z.current;
                                t[12] = t[0] * n + t[4] * r + t[8] * i + t[12], t[13] = t[1] * n + t[5] * r + t[9] * i + t[13], t[14] = t[2] * n + t[6] * r + t[10] * i + t[14], t[15] = t[3] * n + t[7] * r + t[11] * i + t[15]
                            }
                            if (e.rotation.isActive || e.rotationZ.isActive) {
                                var a = (e.rotation.current || e.rotationZ.current) * v;
                                y.rotateZ(t, t, a)
                            }
                            if (e.rotationX.isActive) {
                                var s = e.rotationX.current * v;
                                y.rotateX(t, t, s)
                            }
                            if (e.rotationY.isActive) {
                                var o = e.rotationY.current * v;
                                y.rotateY(t, t, o)
                            }(e.scale.isActive || e.scaleX.isActive || e.scaleY.isActive) && y.scale(t, t, [e.scale.current, e.scale.current, 1]), this.element.style.transform = "matrix3d(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + "," + t[4] + "," + t[5] + "," + t[6] + "," + t[7] + "," + t[8] + "," + t[9] + "," + t[10] + "," + t[11] + "," + t[12] + "," + t[13] + "," + t[14] + "," + t[15] + ")"
                        } else if (e.x.isActive || e.y.isActive || e.rotation.isActive || e.rotationZ.isActive || e.scale.isActive || e.scaleX.isActive || e.scaleY.isActive) {
                            var c = this.mat2d;
                            if (c[0] = 1, c[1] = 0, c[2] = 0, c[3] = 1, c[4] = 0, c[5] = 0, e.x.isActive || e.y.isActive) {
                                var l = e.x.current,
                                    u = e.y.current,
                                    h = c[0],
                                    m = c[1],
                                    d = c[2],
                                    f = c[3],
                                    p = c[4],
                                    b = c[5];
                                c[0] = h, c[1] = m, c[2] = d, c[3] = f, c[4] = h * l + d * u + p, c[5] = m * l + f * u + b
                            }
                            if (e.rotation.isActive || e.rotationZ.isActive) {
                                var g = (e.rotation.current || e.rotationZ.current) * v,
                                    _ = c[0],
                                    E = c[1],
                                    w = c[2],
                                    x = c[3],
                                    I = c[4],
                                    O = c[5],
                                    A = Math.sin(g),
                                    S = Math.cos(g);
                                c[0] = _ * S + w * A, c[1] = E * S + x * A, c[2] = _ * -A + w * S, c[3] = E * -A + x * S, c[4] = I, c[5] = O
                            }
                            e.scale.isActive ? (c[0] = c[0] * e.scale.current, c[1] = c[1] * e.scale.current, c[2] = c[2] * e.scale.current, c[3] = c[3] * e.scale.current, c[4] = c[4], c[5] = c[5]) : (e.scaleX.isActive || e.scaleY.isActive) && (c[0] = c[0] * e.scaleX.current, c[1] = c[1] * e.scaleX.current, c[2] = c[2] * e.scaleY.current, c[3] = c[3] * e.scaleY.current, c[4] = c[4], c[5] = c[5]), this.element.style.transform = "matrix(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + c[3] + ", " + c[4] + ", " + c[5] + ")"
                        }
                        if (e.opacity.isActive && (this.element.style.opacity = e.opacity.current), this.needsStyleUpdate) {
                            for (var T in this.tweenProps.targetStyles) null !== this.tweenProps.targetStyles[T] && (this.element.style[T] = this.tweenProps.targetStyles[T]), this.tweenProps.targetStyles[T] = null;
                            this.needsStyleUpdate = !1
                        }
                        this.needsClassUpdate && (this.tweenProps.targetClasses.add.length > 0 && this.element.classList.add.apply(this.element.classList, this.tweenProps.targetClasses.add), this.tweenProps.targetClasses.remove.length > 0 && this.element.classList.remove.apply(this.element.classList, this.tweenProps.targetClasses.remove), this.tweenProps.targetClasses.add.length = 0, this.tweenProps.targetClasses.remove.length = 0, this.needsClassUpdate = !1)
                    }
                }, {
                    key: "handleEventDispatch",
                    value: function () {
                        if (0 !== this.keyframesRequiringDispatch.length) {
                            for (var e = 0, t = this.keyframesRequiringDispatch.length; e < t; e++) {
                                var n = this.keyframesRequiringDispatch[e];
                                n.needsEventDispatch = !1, this.eventObject.keyframe = n, this.eventObject.pageMetrics = c.pageMetrics, this.eventObject.event = n.event, this.trigger(n.event, this.eventObject)
                            }
                            this.keyframesRequiringDispatch.length = 0
                        }
                        if (0 !== this._events.draw.length) {
                            this.eventObject.keyframe = null, this.eventObject.event = "draw";
                            for (var r = this._events.draw.length - 1; r >= 0; r--) this._events.draw[r](this.eventObject)
                        }
                    }
                }, {
                    key: "updateAnimationConstraints",
                    value: function () {
                        for (var e = this, t = 0, n = this._activeKeyframes.length; t < n; t++) this._activeKeyframes[t].evaluateConstraints();
                        this.attributes.forEach(function (t) {
                            1 !== e.keyframes[t].length && e.keyframes[t].sort(c.KeyframeComparison)
                        }), this.updateDeferredPropertyValues()
                    }
                }, {
                    key: "refreshMetrics",
                    value: function () {
                        var e = new Set([this.element]);
                        this._allKeyframes.forEach(function (t) {
                            return t.anchors.forEach(function (t) {
                                return e.add(t)
                            })
                        }), this.group.metrics.refreshCollection(e), this.group.keyframesDirty = !0
                    }
                }, {
                    key: "updateDeferredPropertyValues",
                    value: function () {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var n = this.attributes[e],
                                r = this.keyframes[n],
                                i = r[0];
                            if (!(i.keyframeType > c.KeyframeTypes.InterpolationForward))
                                for (var a = 0, s = r.length; a < s; a++) {
                                    var o = r[a];
                                    if (null === o.jsonProps[n][0]) {
                                        if (0 === a) {
                                            o.animValues[n][0] = this.tweenProps[n].initialValue;
                                            continue
                                        }
                                        o.animValues[n][0] = r[a - 1].animValues[n][1]
                                    }
                                    if (null === o.jsonProps[n][1]) {
                                        if (a === s - 1) throw new RangeError("AnimSystem - last keyframe cannot defer it's end value! " + n + ":[" + o.jsonProps[n][0] + ",null]");
                                        o.animValues[n][1] = r[a + 1].animValues[n][0]
                                    }
                                }
                        }
                    }
                }, {
                    key: "getBounds",
                    value: function (e) {
                        this.boundsMin = Number.MAX_VALUE, this.boundsMax = -Number.MAX_VALUE;
                        for (var t = 0, n = this.attributes.length; t < n; t++)
                            for (var r = this.keyframes[this.attributes[t]], i = 0; i < r.length; i++) {
                                var a = r[i];
                                this.boundsMin = Math.min(a.start, this.boundsMin), this.boundsMax = Math.max(a.end, this.boundsMax), e.min = Math.min(a.start, e.min), e.max = Math.max(a.end, e.max)
                            }
                    }
                }, {
                    key: "getNearestKeyframeForAttribute",
                    value: function (e, t) {
                        t = void 0 !== t ? t : this.group.position.local;
                        var n = null,
                            r = Number.POSITIVE_INFINITY,
                            i = this.keyframes[e];
                        if (void 0 === i) return null;
                        var a = i.length;
                        if (0 === a) return null;
                        if (1 === a) return i[0];
                        for (var s = 0; s < a; s++) {
                            var o = i[s];
                            if (o.isInRange(t)) {
                                n = o;
                                break
                            }
                            var c = Math.min(Math.abs(t - o.start), Math.abs(t - o.end));
                            c < r && (r = c, n = o)
                        }
                        return n
                    }
                }, {
                    key: "getAllKeyframesForAttribute",
                    value: function (e) {
                        return this.keyframes[e]
                    }
                }, {
                    key: "updateKeyframe",
                    value: function (e, t) {
                        var n = this;
                        e.parseOptions(t), e.evaluateConstraints(), this.group.keyframesDirty = !0, p.update(function () {
                            n.trigger(c.EVENTS.ON_KEYFRAME_UPDATED, e), n.group.trigger(c.EVENTS.ON_KEYFRAME_UPDATED, e)
                        }, !0)
                    }
                }, {
                    key: "removeKeyframe",
                    value: function (e) {
                        var t = this,
                            n = this._allKeyframes.indexOf(e);
                        return n === -1 ? Promise.resolve(null) : (this._allKeyframes.splice(n, 1), this.group.keyframesDirty = !0, new Promise(function (n) {
                            t.group.rafEmitter.executor.eventEmitter.once("before:draw", function () {
                                n(e), e.destroy()
                            })
                        }))
                    }
                }, {
                    key: "updateAnimation",
                    value: function (e, t) {
                        return this.group.gui && console.warn("KeyframeController.updateAnimation(keyframe,props) has been deprecated. Please use updateKeyframe(keyframe,props)"), this.updateKeyframe(e, t)
                    }
                }]), t
            }(d);
        t.exports = b
    }, {
        "../Model/AnimSystemModel": 53,
        "../Model/InferKeyframeFromProps": 56,
        "../Model/UUID": 57,
        "../utils/arrayToObject": 63,
        "./Keyframe": 49,
        "./KeyframeCSSClass": 50,
        "@marcom/ac-event-emitter-micro": 23,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/external": 36,
        "@marcom/ac-raf-emitter/update": 39,
        "@marcom/decompose-css-transform": 82,
        "gl-mat4/create": 118,
        "gl-mat4/rotateX": 120,
        "gl-mat4/rotateY": 121,
        "gl-mat4/rotateZ": 122,
        "gl-mat4/scale": 123
    }],
    52: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = function h(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : h(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            c = e("./Keyframe"),
            l = e("../Model/AnimSystemModel.js"),
            u = function (e) {
                function t(e, n) {
                    r(this, t);
                    var a = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
                    return a.keyframeType = l.KeyframeTypes.Event, a.isApplied = !1, a.hasDuration = !1, a.isCurrentlyInRange = !1, a
                }
                return a(t, e), s(t, [{
                    key: "parseOptions",
                    value: function (e) {
                        e.x = void 0, e.y = void 0, e.scale = void 0, e.scaleX = void 0, e.scaleY = void 0, e.rotation = void 0, e.style = void 0, e.cssClass = void 0, e.rotation = void 0, e.opacity = void 0, e.hold = void 0, void 0 === e.end && (e.end = e.start), this.event = e.event, this.animValues[this.event] = [0, 0], "undefined" == typeof this.controller.tweenProps[this.event] && (this.controller.tweenProps[this.event] = new l.TargetValue(0, 1, (!1))), o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "parseOptions", this).call(this, e), this.keyframeType = l.KeyframeTypes.Event
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function (e) {
                        if (this.hasDuration) {
                            var t = this.isCurrentlyInRange,
                                n = e >= this.start && e <= this.end;
                            if (t === n) return;
                            return this.isCurrentlyInRange = n, void(n && !t ? this._trigger(this.event + ":enter") : t && !n && this._trigger(this.event + ":exit"))
                        }!this.isApplied && e >= this.start ? (this.isApplied = !0, this._trigger(this.event)) : this.isApplied && e < this.start && (this.isApplied = !1, this._trigger(this.event + ":reverse"))
                    }
                }, {
                    key: "_trigger",
                    value: function (e) {
                        this.controller.eventObject.event = e, this.controller.eventObject.keyframe = this, this.controller.trigger(e, this.controller.eventObject)
                    }
                }, {
                    key: "evaluateConstraints",
                    value: function () {
                        o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "evaluateConstraints", this).call(this), this.hasDuration = this.start !== this.end
                    }
                }, {
                    key: "reset",
                    value: function (e) {
                        this.isApplied = !1, this.isCurrentlyInRange = !1, o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "reset", this).call(this, e)
                    }
                }, {
                    key: "onDOMRead",
                    value: function (e, t) {}
                }, {
                    key: "reconcile",
                    value: function (e, t) {}
                }, {
                    key: "evaluateInterpolationConstraints",
                    value: function () {}
                }]), t
            }(c);
        u.DATA_ATTRIBUTE = "data-anim-event", t.exports = u
    }, {
        "../Model/AnimSystemModel.js": 53,
        "./Keyframe": 49
    }],
    53: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = {
            GUI_INSTANCE: null,
            ANIM_INSTANCE: null,
            VIEWPORT_EMITTER_ELEMENT: void 0,
            LOCAL_STORAGE_KEYS: {
                GuiPosition: "anim-ui.position",
                GroupCollapsedStates: "anim-ui.group-collapsed-states",
                scrollY: "anim-ui.scrollY-position",
                path: "anim-ui.path"
            },
            RESIZE_TIMEOUT: -1,
            BREAKPOINTS: [{
                name: "S",
                mediaQuery: "only screen and (max-width: 735px)"
            }, {
                name: "M",
                mediaQuery: "only screen and (max-width: 1068px)"
            }, {
                name: "L",
                mediaQuery: "only screen and (min-width: 1442px)"
            }, {
                name: "L",
                mediaQuery: "only screen and (min-width: 1069px)"
            }],
            getBreakpoint: function () {
                for (var e = 0; e < i.BREAKPOINTS.length; e++) {
                    var t = i.BREAKPOINTS[e],
                        n = window.matchMedia(t.mediaQuery);
                    if (n.matches) return t.name
                }
            },
            KeyframeDefaults: {
                ease: 1,
                epsilon: .05,
                easeFunctionString: "linear",
                easeFunction: "linear",
                hold: !1,
                snapAtCreation: !1,
                toggle: !1,
                breakpointMask: "SMLX",
                event: "",
                disabledWhen: [],
                cssClass: ""
            },
            KeyframeTypes: {
                Interpolation: 0,
                InterpolationForward: 1,
                CSSClass: 2,
                Event: 3
            },
            EVENTS: {
                ON_DOM_KEYFRAMES_CREATED: "ON_DOM_KEYFRAMES_CREATED",
                ON_DOM_GROUPS_CREATED: "ON_DOM_GROUPS_CREATED",
                ON_GROUP_CREATED: "ON_GROUP_CREATED",
                ON_KEYFRAME_UPDATED: "ON_KEYFRAME_UPDATED",
                ON_TIMELINE_START: "ON_TIMELINE_START",
                ON_TIMELINE_UPDATE: "ON_TIMELINE_UPDATE",
                ON_TIMELINE_COMPLETE: "ON_TIMELINE_COMPLETE"
            },
            PageEvents: {
                ON_SCROLL: "ON_SCROLL",
                ON_RESIZE_IMMEDIATE: "ON_RESIZE_IMMEDIATE",
                ON_RESIZE_DEBOUNCED: "ON_RESIZE_DEBOUNCED",
                ON_BREAKPOINT_CHANGE: "ON_BREAKPOINT_CHANGE"
            },
            KeyframeJSONReservedWords: ["event", "cssClass", "style", "anchors", "start", "end", "epsilon", "easeFunction", "ease", "breakpointMask", "disabledWhen"],
            TweenProps: function a() {
                r(this, a)
            },
            TargetValue: function s(e, t, n) {
                r(this, s), this.epsilon = parseFloat(t), this.snapAtCreation = n, this.initialValue = e, this.target = e, this.current = e, this.previousValue = e, this.isActive = !1
            },
            AnimInfo: function (e, t) {
                var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                this.isGroup = n, this.group = e, this.controller = t, this.controllers = [], this.tweenProps = new i.TweenProps
            },
            Progress: function () {
                this.local = 0, this.localUnclamped = 0, this.lastPosition = 0
            },
            ViewableRange: function (e, t) {
                this.a = e.top - t, this.a < 0 && (this.a = e.top), this.b = e.top, this.d = e.bottom, this.c = Math.max(this.d - t, this.b)
            },
            pageMetrics: new function () {
                this.scrollX = 0, this.scrollY = 0, this.windowWidth = 0, this.windowHeight = 0, this.documentOffsetX = 0, this.documentOffsetY = 0, this.previousBreakpoint = "", this.breakpoint = ""
            },
            EventObject: function (e) {
                this.controller = e, this.element = this.controller.element, this.keyframe = null, this.event = "", this.tweenProps = this.controller.tweenProps
            },
            KeyframeComparison: function (e, t) {
                return e.start < t.start ? -1 : e.start > t.start ? 1 : 0
            }
        };
        t.exports = i
    }, {}],
    54: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function a() {
            r(this, a), this.linear = function (e) {
                return e
            }, this.easeInQuad = function (e) {
                return e * e
            }, this.easeOutQuad = function (e) {
                return e * (2 - e)
            }, this.easeInOutQuad = function (e) {
                return e < .5 ? 2 * e * e : -1 + (4 - 2 * e) * e
            }, this.easeInSin = function (e) {
                return 1 + Math.sin(Math.PI / 2 * e - Math.PI / 2)
            }, this.easeOutSin = function (e) {
                return Math.sin(Math.PI / 2 * e)
            }, this.easeInOutSin = function (e) {
                return (1 + Math.sin(Math.PI * e - Math.PI / 2)) / 2
            }, this.easeInElastic = function (e) {
                return 0 === e ? e : (.04 - .04 / e) * Math.sin(25 * e) + 1
            }, this.easeOutElastic = function (e) {
                return .04 * e / --e * Math.sin(25 * e)
            }, this.easeInOutElastic = function (e) {
                return (e -= .5) < 0 ? (.02 + .01 / e) * Math.sin(50 * e) : (.02 - .01 / e) * Math.sin(50 * e) + 1
            }, this.easeOutBack = function (e) {
                return e -= 1, e * e * (2.70158 * e + 1.70158) + 1
            }, this.easeInCubic = function (e) {
                return e * e * e
            }, this.easeOutCubic = function (e) {
                return --e * e * e + 1
            }, this.easeInOutCubic = function (e) {
                return e < .5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1
            }, this.easeInQuart = function (e) {
                return e * e * e * e
            }, this.easeOutQuart = function (e) {
                return 1 - --e * e * e * e
            }, this.easeInOutQuart = function (e) {
                return e < .5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e
            }, this.easeInQuint = function (e) {
                return e * e * e * e * e
            }, this.easeOutQuint = function (e) {
                return 1 + --e * e * e * e * e
            }, this.easeInOutQuint = function (e) {
                return e < .5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e
            }
        };
        t.exports = new i
    }, {}],
    55: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("./AnimSystemModel"),
            s = function (e, t) {
                return void 0 === e || null === e ? t : e
            },
            o = function () {
                function e() {
                    r(this, e), this.clear()
                }
                return i(e, [{
                    key: "clear",
                    value: function () {
                        this._metrics = new WeakMap
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this._metrics = null
                    }
                }, {
                    key: "add",
                    value: function (e) {
                        var t = this._metrics.get(e);
                        if (t) return t;
                        var n = new c(e);
                        return this._metrics.set(e, n), this._refreshMetrics(e, n)
                    }
                }, {
                    key: "get",
                    value: function (e) {
                        return this._metrics.get(e)
                    }
                }, {
                    key: "refreshCollection",
                    value: function (e) {
                        var t = this;
                        e.forEach(function (e) {
                            return t._refreshMetrics(e, null)
                        })
                    }
                }, {
                    key: "refreshMetrics",
                    value: function (e) {
                        return this._refreshMetrics(e)
                    }
                }, {
                    key: "_refreshMetrics",
                    value: function (e, t) {
                        if (t = t || this._metrics.get(e), !(e instanceof Element)) return t.width = s(e.width, 0), t.height = s(e.height, 0), t.top = s(e.top, s(e.y, 0)), t.left = s(e.left, s(e.x, 0)), t.right = t.left + t.width, t.bottom = t.top + t.height, t;
                        if (void 0 === e.offsetWidth) {
                            var n = e.getBoundingClientRect();
                            return t.width = n.width, t.height = n.height, t.top = a.pageMetrics.scrollY + n.top, t.left = a.pageMetrics.scrollX + n.left, t.right = t.left + t.width, t.bottom = t.top + t.height, t
                        }
                        t.width = e.offsetWidth, t.height = e.offsetHeight, t.top = a.pageMetrics.documentOffsetY, t.left = a.pageMetrics.documentOffsetX;
                        for (var r = e; r;) t.top += r.offsetTop, t.left += r.offsetLeft, r = r.offsetParent;
                        return t.right = t.left + t.width, t.bottom = t.top + t.height, t
                    }
                }]), e
            }(),
            c = function () {
                function e(t) {
                    r(this, e), this.top = 0, this.bottom = 0, this.left = 0, this.right = 0, this.height = 0, this.width = 0
                }
                return i(e, [{
                    key: "toString",
                    value: function () {
                        return "top:" + this.top + ", bottom:" + this.bottom + ", left:" + this.left + ", right:" + this.right + ", height:" + this.height + ", width:" + this.width
                    }
                }, {
                    key: "toObject",
                    value: function () {
                        return {
                            top: this.top,
                            bottom: this.bottom,
                            left: this.left,
                            right: this.right,
                            height: this.height,
                            width: this.width
                        }
                    }
                }]), e
            }();
        t.exports = o
    }, {
        "./AnimSystemModel": 53
    }],
    56: [function (e, t, n) {
        "use strict";
        var r = e("./AnimSystemModel"),
            i = e("../Keyframes/Keyframe"),
            a = e("../Keyframes/KeyframeDiscreteEvent"),
            s = e("../Keyframes/KeyframeCSSClass"),
            o = function (e) {
                for (var t in e) {
                    var n = e[t];
                    if (r.KeyframeJSONReservedWords.indexOf(t) === -1 && Array.isArray(n)) return !0
                }
                return !1
            };
        t.exports = function (e) {
            if (void 0 !== e.cssClass || void 0 !== e.style) {
                if (o(e)) throw "CSS Keyframes cannot tween values, please use multiple keyframes instead";
                return s
            }
            if (o(e)) return i;
            if (e.event) return a;
            throw delete e.anchors, "Could not determine tween type based on " + JSON.stringify(e)
        }
    }, {
        "../Keyframes/Keyframe": 49,
        "../Keyframes/KeyframeCSSClass": 50,
        "../Keyframes/KeyframeDiscreteEvent": 52,
        "./AnimSystemModel": 53
    }],
    57: [function (e, t, n) {
        "use strict";
        t.exports = function () {
            for (var e = "", t = 0; t < 8; t++) {
                var n = 16 * Math.random() | 0;
                8 !== t && 12 !== t && 16 !== t && 20 !== t || (e += "-"), e += (12 === t ? 4 : 16 === t ? 3 & n | 8 : n).toString(16)
            }
            return e
        }
    }, {}],
    58: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = 1e-5,
            s = Math.abs,
            o = 5,
            c = function () {
                function e(t, n, i, a) {
                    r(this, e), this.cp = new Float32Array(6), this.cp[0] = 3 * t, this.cp[1] = 3 * (i - t) - this.cp[0], this.cp[2] = 1 - this.cp[0] - this.cp[1], this.cp[3] = 3 * n, this.cp[4] = 3 * (a - n) - this.cp[3], this.cp[5] = 1 - this.cp[3] - this.cp[4]
                }
                return i(e, [{
                    key: "sampleCurveX",
                    value: function (e) {
                        return ((this.cp[2] * e + this.cp[1]) * e + this.cp[0]) * e
                    }
                }, {
                    key: "sampleCurveY",
                    value: function (e) {
                        return ((this.cp[5] * e + this.cp[4]) * e + this.cp[3]) * e
                    }
                }, {
                    key: "sampleCurveDerivativeX",
                    value: function (e) {
                        return (3 * this.cp[2] * e + 2 * this.cp[1]) * e + this.cp[0]
                    }
                }, {
                    key: "solveCurveX",
                    value: function (e) {
                        var t, n, r, i, c, l;
                        for (r = e, l = 0; l < o; l++) {
                            if (i = this.sampleCurveX(r) - e, s(i) < a) return r;
                            if (c = this.sampleCurveDerivativeX(r), s(c) < a) break;
                            r -= i / c
                        }
                        if (t = 0, n = 1, r = e, r < t) return t;
                        if (r > n) return n;
                        for (; t < n;) {
                            if (i = this.sampleCurveX(r), s(i - e) < a) return r;
                            e > i ? t = r : n = r, r = .5 * (n - t) + t
                        }
                        return r
                    }
                }, {
                    key: "solve",
                    value: function (e) {
                        return this.sampleCurveY(this.solveCurveX(e))
                    }
                }]), e
            }(),
            l = /\d*\.?\d+/g;
        c.fromCSSString = function (e) {
            var t = e.match(l);
            if (4 !== t.length) throw "UnitBezier could not convert " + e + " to cubic-bezier";
            var n = t.map(Number),
                r = new c(n[0], n[1], n[2], n[3]);
            return r.solve.bind(r)
        }, t.exports = c
    }, {}],
    59: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            a = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            s = e("./Interpreter"),
            o = new(e("../Model/ElementMetricsLookup")),
            c = function () {
                function e(t) {
                    r(this, e), this.group = t, this.data = {
                        target: null,
                        anchors: null,
                        metrics: this.group.metrics
                    }
                }
                return a(e, [{
                    key: "parseArray",
                    value: function (e, t) {
                        return [this.parseExpression(e, t[0]), this.parseExpression(e, t[1])]
                    }
                }, {
                    key: "parseExpression",
                    value: function (t, n) {
                        if (!n) return null;
                        if ("number" == typeof n) return n;
                        if ("string" != typeof n) throw "Expression must be a string, received " + ("undefined" == typeof n ? "undefined" : i(n));
                        return this.data.target = t.controller.element, this.data.anchors = t.anchors, this.data.keyframe = t.keyframe, e._parse(n, this.data)
                    }
                }, {
                    key: "parseTimeValue",
                    value: function (e, t) {
                        if ("number" == typeof t) return t;
                        var n = this.group.expressionParser.parseExpression(e, t);
                        return this.group.convertScrollPositionToTValue(n)
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this.group = null
                    }
                }], [{
                    key: "parse",
                    value: function (t, n) {
                        return n = n || {}, n && (o.clear(), n.target && o.add(n.target), n.anchors && n.anchors.forEach(function (e) {
                            return o.add(e)
                        })), n.metrics = o, e._parse(t, n)
                    }
                }, {
                    key: "_parse",
                    value: function (e, t) {
                        return s.Parse(e).execute(t)
                    }
                }]), e
            }();
        c.programs = s.programs, window.ExpressionParser = c, t.exports = c
    }, {
        "../Model/ElementMetricsLookup": 55,
        "./Interpreter": 60
    }],
    60: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function i(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function a(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("../Model/AnimSystemModel"),
            c = e("@marcom/sm-math-utils"),
            l = {},
            u = {
                smoothstep: function (e, t, n) {
                    return n = u.clamp((n - e) / (t - e), 0, 1), n * n * (3 - 2 * n)
                },
                deg: function (e) {
                    return 180 * e / Math.PI
                },
                rad: function (e) {
                    return e * Math.PI / 180
                },
                random: function (e, t) {
                    return Math.random() * (t - e) + e
                },
                atan: Math.atan2
            };
        Object.getOwnPropertyNames(Math).forEach(function (e) {
            return u[e] ? null : u[e.toLowerCase()] = Math[e]
        }), Object.getOwnPropertyNames(c).forEach(function (e) {
            return u[e] ? null : u[e.toLowerCase()] = c[e]
        });
        var h = null,
            m = {
                ANCHOR_CONST: "a",
                ALPHA: "ALPHA",
                LPAREN: "(",
                RPAREN: ")",
                PLUS: "PLUS",
                MINUS: "MINUS",
                MUL: "MUL",
                DIV: "DIV",
                INTEGER_CONST: "INTEGER_CONST",
                FLOAT_CONST: "FLOAT_CONST",
                COMMA: ",",
                EOF: "EOF"
            },
            d = {
                NUMBERS: /\d|\d\.\d/,
                DIGIT: /\d/,
                OPERATOR: /[-+*\/]/,
                PAREN: /[()]/,
                WHITE_SPACE: /\s/,
                ALPHA: /[a-zA-Z]|%/,
                ALPHANUMERIC: /[a-zA-Z0-9]/,
                OBJECT_UNIT: /^(t|l|b|r|%w|%h|%|h|w)$/,
                GLOBAL_METRICS_UNIT: /^(px|vh|vw)$/,
                ANY_UNIT: /^(t|l|b|r|%w|%h|%|h|w|px|vh|vw)$/,
                MATH_FUNCTION: new RegExp("\\b(" + Object.keys(u).join("|") + ")\\b", "i")
            },
            f = {
                round: 1,
                clamp: 3,
                lerp: 3,
                random: 2,
                atan: 2,
                floor: 1,
                ceil: 1,
                abs: 1,
                cos: 1,
                sin: 1,
                smoothstep: 3,
                rad: 1,
                deg: 1,
                pow: 2,
                calc: 1
            },
            p = function S(e, t) {
                a(this, S), this.type = e, this.value = t
            };
        p.ONE = new p("100", 100), p.EOF = new p(m.EOF, null);
        var v = function T(e) {
                a(this, T), this.type = e
            },
            y = function (e) {
                function t(e, n) {
                    a(this, t);
                    var i = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "UnaryOp"));
                    return i.token = i.op = e, i.expr = n, i
                }
                return i(t, e), t
            }(v),
            b = function (e) {
                function t(e, n, i) {
                    a(this, t);
                    var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "BinOp"));
                    return s.left = e, s.op = n, s.right = i, s
                }
                return i(t, e), t
            }(v),
            g = function (e) {
                function t(e, n) {
                    a(this, t);
                    var i = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "MathOp"));
                    if (i.op = e, i.list = n, f[e.value] && n.length !== f[e.value]) throw new Error("Incorrect number of arguments for '" + e.value + "'. Received " + n.length + ", expected " + f[e.value]);
                    return i
                }
                return i(t, e), t
            }(v),
            _ = function (e) {
                function t(e) {
                    a(this, t);
                    var n = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "Num"));
                    return n.token = e, n.value = e.value, n
                }
                return i(t, e), t
            }(v),
            E = (function (e) {
                function t(e) {
                    a(this, t);
                    var n = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "Unit"));
                    return n.token = e, n.value = e.value, n
                }
                return i(t, e), t
            }(v), function (e) {
                function t(e, n, i) {
                    a(this, t);
                    var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "RefValue"));
                    return s.num = e, s.ref = n, s.unit = i, s
                }
                return i(t, e), t
            }(v)),
            w = function (e) {
                function t(e, n) {
                    a(this, t);
                    var i = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "CSSValue"));
                    return i.ref = e, i.propertyName = n, i
                }
                return i(t, e), t
            }(v),
            x = function (e) {
                function t(e, n) {
                    a(this, t);
                    var i = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "PropValue"));
                    return i.ref = e, i.propertyName = n, i
                }
                return i(t, e), t
            }(v),
            I = function () {
                function e(t) {
                    a(this, e), this.text = t, this.pos = 0, this["char"] = this.text[this.pos], this.tokens = [];
                    for (var n = void 0;
                        (n = this.getNextToken()) && n !== p.EOF;) this.tokens.push(n);
                    this.tokens.push(n)
                }
                return s(e, [{
                    key: "advance",
                    value: function () {
                        this["char"] = this.text[++this.pos]
                    }
                }, {
                    key: "skipWhiteSpace",
                    value: function () {
                        for (; null != this["char"] && d.WHITE_SPACE.test(this["char"]);) this.advance()
                    }
                }, {
                    key: "name",
                    value: function () {
                        for (var e = ""; null != this["char"] && d.ALPHA.test(this["char"]);) e += this["char"], this.advance();
                        return new p(m.ALPHA, e)
                    }
                }, {
                    key: "number",
                    value: function () {
                        for (var e = ""; null != this["char"] && d.DIGIT.test(this["char"]);) e += this["char"], this.advance();
                        if (null != this["char"] && "." === this["char"]) {
                            for (e += this["char"], this.advance(); null != this["char"] && d.DIGIT.test(this["char"]);) e += this["char"], this.advance();
                            return new p(m.FLOAT_CONST, parseFloat(e))
                        }
                        return new p(m.INTEGER_CONST, parseInt(e))
                    }
                }, {
                    key: "getNextToken",
                    value: function () {
                        for (; null != this["char"];)
                            if (d.WHITE_SPACE.test(this["char"])) this.skipWhiteSpace();
                            else {
                                if (d.DIGIT.test(this["char"])) return this.number();
                                if ("," === this["char"]) return this.advance(), new p(m.COMMA, ",");
                                if (d.OPERATOR.test(this["char"])) {
                                    var e = "",
                                        t = this["char"];
                                    switch (t) {
                                        case "+":
                                            e = m.PLUS;
                                            break;
                                        case "-":
                                            e = m.MINUS;
                                            break;
                                        case "*":
                                            e = m.MUL;
                                            break;
                                        case "/":
                                            e = m.DIV
                                    }
                                    return this.advance(), new p(e, t)
                                }
                                if (d.PAREN.test(this["char"])) {
                                    var n = "",
                                        r = this["char"];
                                    switch (r) {
                                        case "(":
                                            n = m.LPAREN;
                                            break;
                                        case ")":
                                            n = m.RPAREN
                                    }
                                    return this.advance(), new p(n, r)
                                }
                                if (d.ALPHA.test(this["char"])) return this.name();
                                this.error("Unexpected character " + this["char"])
                            } return p.EOF
                    }
                }]), e
            }(),
            O = function () {
                function e(t) {
                    a(this, e), this.lexer = t, this.pos = 0
                }
                return s(e, [{
                    key: "error",
                    value: function t(e) {
                        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                            r = this.lexer.text.slice(this.pos - 3, this.pos + 3),
                            t = new Error(e + ' in "' + this.lexer.text + '" near "' + r + '". ' + n + " ");
                        throw console.error(t.message, h ? h.keyframe || h.target : ""), t
                    }
                }, {
                    key: "consume",
                    value: function (e) {
                        var t = this.currentToken;
                        return t.type === e ? this.pos += 1 : this.error("Invalid token " + this.currentToken.value + ", expected " + e), t
                    }
                }, {
                    key: "consumeList",
                    value: function (e) {
                        e.includes(this.currentToken) ? this.pos += 1 : this.error("Invalid token " + this.currentToken.value + ", expected " + tokenType)
                    }
                }, {
                    key: "expr",
                    value: function () {
                        for (var e = this.term(); this.currentToken.type === m.PLUS || this.currentToken.type === m.MINUS;) {
                            var t = this.currentToken;
                            switch (t.value) {
                                case "+":
                                    this.consume(m.PLUS);
                                    break;
                                case "-":
                                    this.consume(m.MINUS)
                            }
                            e = new b(e, t, this.term())
                        }
                        return e
                    }
                }, {
                    key: "term",
                    value: function () {
                        for (var e = this.factor(); this.currentToken.type === m.MUL || this.currentToken.type === m.DIV;) {
                            var t = this.currentToken;
                            switch (t.value) {
                                case "*":
                                    this.consume(m.MUL);
                                    break;
                                case "/":
                                    this.consume(m.DIV)
                            }
                            e = new b(e, t, this.factor())
                        }
                        return e
                    }
                }, {
                    key: "factor",
                    value: function () {
                        if (this.currentToken.type === m.PLUS) return new y(this.consume(m.PLUS), this.factor());
                        if (this.currentToken.type === m.MINUS) return new y(this.consume(m.MINUS), this.factor());
                        if (this.currentToken.type === m.INTEGER_CONST || this.currentToken.type === m.FLOAT_CONST) {
                            var e = new _(this.currentToken);
                            if (this.pos += 1, d.OPERATOR.test(this.currentToken.value) || this.currentToken.type === m.RPAREN || this.currentToken.type === m.COMMA || this.currentToken.type === m.EOF) return e;
                            if (this.currentToken.type === m.ALPHA && this.currentToken.value === m.ANCHOR_CONST) return this.consume(m.ALPHA), new E(e, this.anchorIndex(), this.unit(d.ANY_UNIT));
                            if (this.currentToken.type === m.ALPHA) return "%a" === this.currentToken.value && this.error("%a is invalid, try removing the %"), new E(e, null, this.unit());
                            this.error("Expected a scaling unit type", "Such as 'h' / 'w'")
                        } else {
                            if (d.OBJECT_UNIT.test(this.currentToken.value)) return new E(new _(p.ONE), null, this.unit());
                            if (this.currentToken.value === m.ANCHOR_CONST) {
                                this.consume(m.ALPHA);
                                var t = this.anchorIndex();
                                if (d.OBJECT_UNIT.test(this.currentToken.value)) return new E(new _(p.ONE), t, this.unit())
                            } else if (this.currentToken.type === m.ALPHA) {
                                if ("css" === this.currentToken.value || "prop" === this.currentToken.value) {
                                    var n = "css" === this.currentToken.value ? w : x;
                                    this.consume(m.ALPHA), this.consume(m.LPAREN);
                                    var r = this.propertyName(),
                                        i = null;
                                    return this.currentToken.type === m.COMMA && (this.consume(m.COMMA), this.consume(m.ALPHA), i = this.anchorIndex()), this.consume(m.RPAREN), new n(i, r)
                                }
                                if (d.MATH_FUNCTION.test(this.currentToken.value)) {
                                    var a = this.currentToken.value.toLowerCase();
                                    if ("number" == typeof u[a]) return this.consume(m.ALPHA), new _(new p(m.ALPHA, u[a]));
                                    var s = p[a] || new p(a, a),
                                        o = [];
                                    this.consume(m.ALPHA),
                                        this.consume(m.LPAREN);
                                    var c = null;
                                    do this.currentToken.value === m.COMMA && this.consume(m.COMMA), c = this.expr(), o.push(c); while (this.currentToken.value === m.COMMA);
                                    return this.consume(m.RPAREN), new g(s, o)
                                }
                            } else if (this.currentToken.type === m.LPAREN) {
                                this.consume(m.LPAREN);
                                var l = this.expr();
                                return this.consume(m.RPAREN), l
                            }
                        }
                        this.error("Unexpected token " + this.currentToken.value)
                    }
                }, {
                    key: "propertyName",
                    value: function () {
                        for (var e = ""; this.currentToken.type === m.ALPHA || this.currentToken.type === m.MINUS;) e += this.currentToken.value, this.pos += 1;
                        return e
                    }
                }, {
                    key: "unit",
                    value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : d.ANY_UNIT,
                            t = this.currentToken;
                        return t.type === m.ALPHA && e.test(t.value) ? (this.consume(m.ALPHA), new p(m.ALPHA, t.value = t.value.replace(/%(h|w)/, "$1").replace("%", "h"))) : void this.error("Expected unit type")
                    }
                }, {
                    key: "anchorIndex",
                    value: function () {
                        var e = this.currentToken;
                        return e.type === m.INTEGER_CONST ? (this.consume(m.INTEGER_CONST), new _(e)) : void this.error("Invalid anchor reference", ". Should be something like a0, a1, a2")
                    }
                }, {
                    key: "parse",
                    value: function () {
                        var e = this.expr();
                        return this.currentToken !== p.EOF && this.error("Unexpected token " + this.currentToken.value), e
                    }
                }, {
                    key: "currentToken",
                    get: function () {
                        return this.lexer.tokens[this.pos]
                    }
                }]), e
            }(),
            A = function () {
                function e(t) {
                    a(this, e), this.parser = t, this.root = t.parse()
                }
                return s(e, [{
                    key: "visit",
                    value: function (e) {
                        var t = this[e.type];
                        if (!t) throw new Error("No visit method named, " + t);
                        var n = t.call(this, e);
                        return n
                    }
                }, {
                    key: "BinOp",
                    value: function (e) {
                        switch (e.op.type) {
                            case m.PLUS:
                                return this.visit(e.left) + this.visit(e.right);
                            case m.MINUS:
                                return this.visit(e.left) - this.visit(e.right);
                            case m.MUL:
                                return this.visit(e.left) * this.visit(e.right);
                            case m.DIV:
                                return this.visit(e.left) / this.visit(e.right)
                        }
                    }
                }, {
                    key: "RefValue",
                    value: function (e) {
                        var t = this.unwrapReference(e),
                            n = e.unit.value,
                            r = e.num.value,
                            i = h.metrics.get(t);
                        switch (n) {
                            case "h":
                                return .01 * r * i.height;
                            case "t":
                                return .01 * r * i.top;
                            case "vh":
                                return .01 * r * o.pageMetrics.windowHeight;
                            case "vw":
                                return .01 * r * o.pageMetrics.windowWidth;
                            case "px":
                                return r;
                            case "w":
                                return .01 * r * i.width;
                            case "b":
                                return .01 * r * i.bottom;
                            case "l":
                                return .01 * r * i.left;
                            case "r":
                                return .01 * r * i.right
                        }
                    }
                }, {
                    key: "PropValue",
                    value: function (e) {
                        var t = null === e.ref ? h.target : h.anchors[e.ref.value];
                        return t[e.propertyName]
                    }
                }, {
                    key: "CSSValue",
                    value: function (t) {
                        var n = this.unwrapReference(t),
                            r = getComputedStyle(n).getPropertyValue(t.propertyName);
                        return "" === r ? 0 : e.Parse(r).execute(h)
                    }
                }, {
                    key: "Num",
                    value: function (e) {
                        return e.value
                    }
                }, {
                    key: "UnaryOp",
                    value: function (e) {
                        return e.op.type === m.PLUS ? +this.visit(e.expr) : e.op.type === m.MINUS ? -this.visit(e.expr) : void 0
                    }
                }, {
                    key: "MathOp",
                    value: function (e) {
                        var t = this,
                            n = e.list.map(function (e) {
                                return t.visit(e)
                            });
                        return u[e.op.value].apply(null, n)
                    }
                }, {
                    key: "unwrapReference",
                    value: function (e) {
                        return null === e.ref ? h.target : (e.ref.value >= h.anchors.length && console.error("Not enough anchors supplied for expression " + this.parser.lexer.text, h.target), h.anchors[e.ref.value])
                    }
                }, {
                    key: "execute",
                    value: function (e) {
                        return h = e, this.visit(this.root)
                    }
                }], [{
                    key: "Parse",
                    value: function (t) {
                        return l[t] || (l[t] = new e(new O(new I(t))))
                    }
                }]), e
            }();
        A.programs = l, t.exports = A
    }, {
        "../Model/AnimSystemModel": 53,
        "@marcom/sm-math-utils": 111
    }],
    61: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = function y(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : y(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            c = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            l = e("@marcom/sm-math-utils"),
            u = e("./utils/arrayToObject"),
            h = e("./Model/AnimSystemModel"),
            m = e("./Model/ElementMetricsLookup"),
            d = e("./Parsing/ExpressionParser"),
            f = e("./Keyframes/KeyframeController"),
            p = {
                create: e("@marcom/ac-raf-emitter/RAFEmitter"),
                update: e("@marcom/ac-raf-emitter/update"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            v = function (e) {
                function t(e, n) {
                    r(this, t);
                    var a = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return a.anim = n, a.element = e, a.name = a.name || e.getAttribute("data-anim-scroll-group"), a.isEnabled = !0, a.position = new h.Progress, a.metrics = new m, a.metrics.add(a.element), a.expressionParser = new d(a), a.boundsMin = 0, a.boundsMax = 0, a.timelineUpdateRequired = !1, a._keyframesDirty = !1, a.viewableRange = a.createViewableRange(), a.defaultEase = h.KeyframeDefaults.ease, a.keyframeControllers = [], a.updateProgress(a.getPosition()), a.onDOMRead = a.onDOMRead.bind(a), a.onDOMWrite = a.onDOMWrite.bind(a), a.gui = null, a.finalizeInit(), a
                }
                return a(t, e), s(t, [{
                    key: "finalizeInit",
                    value: function () {
                        this.element._animInfo = new h.AnimInfo(this, null, (!0)), this.setupRAFEmitter()
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this.expressionParser.destroy(), this.expressionParser = null;
                        for (var e = 0, n = this.keyframeControllers.length; e < n; e++) this.keyframeControllers[e].destroy();
                        this.keyframeControllers = null, this.position = null, this.viewableRange = null, this.gui && (this.gui.destroy(), this.gui = null), this.metrics.destroy(), this.metrics = null, this.rafEmitter.destroy(), this.rafEmitter = null, this.anim = null, this.element._animInfo && this.element._animInfo.group === this && (this.element._animInfo.group = null, this.element._animInfo = null), this.element = null, this.isEnabled = !1, o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "removeKeyframeController",
                    value: function (e) {
                        var t = this;
                        if (!this.keyframeControllers.includes(e)) return Promise.resolve();
                        var n = e._allKeyframes;
                        return e._allKeyframes = [], this.keyframesDirty = !0, new Promise(function (r) {
                            p.draw(function () {
                                var i = t.keyframeControllers.indexOf(e);
                                return i === -1 ? void r() : (t.keyframeControllers.splice(i, 1), e.onDOMWrite(), n.forEach(function (e) {
                                    return e.destroy()
                                }), e.destroy(), t.gui && t.gui.create(), void r())
                            })
                        })
                    }
                }, {
                    key: "remove",
                    value: function () {
                        return this.anim.removeGroup(this)
                    }
                }, {
                    key: "setupRAFEmitter",
                    value: function (e) {
                        var t = this;
                        this.rafEmitter && this.rafEmitter.destroy(), this.rafEmitter = e || new p.create, this.rafEmitter.on("update", this.onDOMRead), this.rafEmitter.on("draw", this.onDOMWrite), this.rafEmitter.once("external", function () {
                            return t.reconcile()
                        })
                    }
                }, {
                    key: "requestDOMChange",
                    value: function () {
                        return !!this.isEnabled && this.rafEmitter.run()
                    }
                }, {
                    key: "onDOMRead",
                    value: function () {
                        this.keyframesDirty && this.onKeyframesDirty();
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].onDOMRead(this.position)
                    }
                }, {
                    key: "onDOMWrite",
                    value: function () {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].onDOMWrite(this.position);
                        this.needsUpdate() && this.requestDOMChange()
                    }
                }, {
                    key: "needsUpdate",
                    value: function () {
                        if (this._keyframesDirty) return !0;
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++)
                            if (this.keyframeControllers[e].needsUpdate()) return !0;
                        return !1
                    }
                }, {
                    key: "addKeyframe",
                    value: function (e, t) {
                        var n = this.getControllerForTarget(e);
                        return null === n && (n = new f(this, e), this.keyframeControllers.push(n)), this.keyframesDirty = !0, n.addKeyframe(t)
                    }
                }, {
                    key: "forceUpdate",
                    value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            t = e.waitForNextUpdate,
                            n = void 0 === t || t,
                            r = e.silent,
                            i = void 0 !== r && r;
                        this.isEnabled && (this.refreshMetrics(), this.timelineUpdateRequired = !0, n ? this.keyframesDirty = !0 : this.onKeyframesDirty({
                            silent: i
                        }))
                    }
                }, {
                    key: "onKeyframesDirty",
                    value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            t = e.silent,
                            n = void 0 !== t && t;
                        this.determineActiveKeyframes(), this.keyframesDirty = !1, this.metrics.refreshMetrics(this.element), this.viewableRange = this.createViewableRange();
                        for (var r = 0, i = this.keyframeControllers.length; r < i; r++) this.keyframeControllers[r].updateAnimationConstraints();
                        this.updateBounds(), this.updateProgress(this.getPosition()), n || this._onScroll(), this.gui && this.gui.create()
                    }
                }, {
                    key: "refreshMetrics",
                    value: function () {
                        var e = new Set([this.element]);
                        this.keyframeControllers.forEach(function (t) {
                            e.add(t.element), t._allKeyframes.forEach(function (t) {
                                return t.anchors.forEach(function (t) {
                                    return e.add(t)
                                })
                            })
                        }), this.metrics.refreshCollection(e), this.viewableRange = this.createViewableRange()
                    }
                }, {
                    key: "reconcile",
                    value: function () {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].reconcile()
                    }
                }, {
                    key: "determineActiveKeyframes",
                    value: function (e) {
                        e = e || u(Array.from(document.documentElement.classList));
                        for (var t = 0, n = this.keyframeControllers.length; t < n; t++) this.keyframeControllers[t].determineActiveKeyframes(e)
                    }
                }, {
                    key: "updateBounds",
                    value: function () {
                        if (0 === this.keyframeControllers.length) return this.boundsMin = 0, void(this.boundsMax = 0);
                        for (var e = {
                                min: Number.POSITIVE_INFINITY,
                                max: Number.NEGATIVE_INFINITY
                            }, t = 0, n = this.keyframeControllers.length; t < n; t++) this.keyframeControllers[t].getBounds(e);
                        var r = this.convertTValueToScrollPosition(e.min),
                            i = this.convertTValueToScrollPosition(e.max);
                        i - r < h.pageMetrics.windowHeight ? (e.min = this.convertScrollPositionToTValue(r - .5 * h.pageMetrics.windowHeight), e.max = this.convertScrollPositionToTValue(i + .5 * h.pageMetrics.windowHeight)) : (e.min -= .001, e.max += .001), this.boundsMin = e.min, this.boundsMax = e.max, this.timelineUpdateRequired = !0
                    }
                }, {
                    key: "createViewableRange",
                    value: function () {
                        return new h.ViewableRange(this.metrics.get(this.element), h.pageMetrics.windowHeight)
                    }
                }, {
                    key: "_onBreakpointChange",
                    value: function (e, t) {
                        this.keyframesDirty = !0, this.determineActiveKeyframes()
                    }
                }, {
                    key: "updateProgress",
                    value: function (e) {
                        return this.hasDuration() ? (this.position.localUnclamped = (e - this.viewableRange.a) / (this.viewableRange.d - this.viewableRange.a), void(this.position.local = l.clamp(this.position.localUnclamped, this.boundsMin, this.boundsMax))) : void(this.position.local = this.position.localUnclamped = 0)
                    }
                }, {
                    key: "performTimelineDispatch",
                    value: function () {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].updateLocalProgress(this.position.local);
                        this.trigger(h.EVENTS.ON_TIMELINE_UPDATE, this.position.local), this.timelineUpdateRequired = !1, this.position.lastPosition !== this.position.local && (this.position.lastPosition <= this.boundsMin && this.position.localUnclamped > this.boundsMin ? this.trigger(h.EVENTS.ON_TIMELINE_START, this) : this.position.lastPosition >= this.boundsMin && this.position.localUnclamped < this.boundsMin ? this.trigger(h.EVENTS.ON_TIMELINE_START + ":reverse", this) : this.position.lastPosition <= this.boundsMax && this.position.localUnclamped >= this.boundsMax ? this.trigger(h.EVENTS.ON_TIMELINE_COMPLETE, this) : this.position.lastPosition >= this.boundsMax && this.position.localUnclamped < this.boundsMax && this.trigger(h.EVENTS.ON_TIMELINE_COMPLETE + ":reverse", this)), null !== this.gui && this.gui.onScrollUpdate(this.position)
                    }
                }, {
                    key: "_onScroll",
                    value: function (e) {
                        if (!this.isEnabled) return !1;
                        void 0 === e && (e = this.getPosition()), this.updateProgress(e);
                        var t = this.position.lastPosition === this.boundsMin || this.position.lastPosition === this.boundsMax,
                            n = this.position.localUnclamped === this.boundsMin || this.position.localUnclamped === this.boundsMax;
                        if (!this.timelineUpdateRequired && t && n && this.position.lastPosition === e) return void(this.position.local = this.position.localUnclamped);
                        if (this.timelineUpdateRequired || this.position.localUnclamped > this.boundsMin && this.position.localUnclamped < this.boundsMax) return this.performTimelineDispatch(), this.requestDOMChange(), void(this.position.lastPosition = this.position.localUnclamped);
                        var r = this.position.lastPosition > this.boundsMin && this.position.lastPosition < this.boundsMax,
                            i = this.position.localUnclamped <= this.boundsMin || this.position.localUnclamped >= this.boundsMax;
                        if (r && i) return this.performTimelineDispatch(), this.requestDOMChange(), void(this.position.lastPosition = this.position.localUnclamped);
                        var a = this.position.lastPosition < this.boundsMin && this.position.localUnclamped > this.boundsMax,
                            s = this.position.lastPosition > this.boundsMax && this.position.localUnclamped < this.boundsMax;
                        (a || s) && (this.performTimelineDispatch(), this.requestDOMChange(), this.position.lastPosition = this.position.localUnclamped), null !== this.gui && this.gui.onScrollUpdate(this.position)
                    }
                }, {
                    key: "convertScrollPositionToTValue",
                    value: function (e) {
                        return this.hasDuration() ? l.map(e, this.viewableRange.a, this.viewableRange.d, 0, 1) : 0
                    }
                }, {
                    key: "convertTValueToScrollPosition",
                    value: function (e) {
                        return this.hasDuration() ? l.map(e, 0, 1, this.viewableRange.a, this.viewableRange.d) : 0
                    }
                }, {
                    key: "hasDuration",
                    value: function () {
                        return this.viewableRange.a !== this.viewableRange.d
                    }
                }, {
                    key: "getPosition",
                    value: function () {
                        return h.pageMetrics.scrollY
                    }
                }, {
                    key: "getControllerForTarget",
                    value: function (e) {
                        if (!e._animInfo || !e._animInfo.controllers) return null;
                        if (e._animInfo.controller && e._animInfo.controller.group === this) return e._animInfo.controller;
                        for (var t = e._animInfo.controllers, n = 0, r = t.length; n < r; n++)
                            if (t[n].group === this) return t[n];
                        return null
                    }
                }, {
                    key: "trigger",
                    value: function (e, t) {
                        if ("undefined" != typeof this._events[e])
                            for (var n = this._events[e].length - 1; n >= 0; n--) void 0 !== t ? this._events[e][n](t) : this._events[e][n]()
                    }
                }, {
                    key: "keyframesDirty",
                    set: function (e) {
                        this._keyframesDirty = e, this._keyframesDirty && this.requestDOMChange()
                    },
                    get: function () {
                        return this._keyframesDirty
                    }
                }]), t
            }(c);
        t.exports = v
    }, {
        "./Keyframes/KeyframeController": 51,
        "./Model/AnimSystemModel": 53,
        "./Model/ElementMetricsLookup": 55,
        "./Parsing/ExpressionParser": 59,
        "./utils/arrayToObject": 63,
        "@marcom/ac-event-emitter-micro": 23,
        "@marcom/ac-raf-emitter/RAFEmitter": 28,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/update": 39,
        "@marcom/sm-math-utils": 111
    }],
    62: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = function d(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : d(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            c = e("./ScrollGroup"),
            l = e("@marcom/sm-math-utils"),
            u = 0,
            h = {
                create: e("@marcom/ac-raf-emitter/RAFEmitter")
            },
            m = function (e) {
                function t(e, n) {
                    r(this, t), e || (e = document.createElement("div"), e.className = "TimeGroup-" + u++);
                    var a = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
                    return a.name = a.name || e.getAttribute("data-anim-time-group"), a._isPaused = !0, a._repeats = 0, a._isReversed = !1, a._timeScale = 1, a
                }
                return a(t, e), s(t, [{
                    key: "finalizeInit",
                    value: function () {
                        if (!this.anim) throw "TimeGroup not instantiated correctly. Please use `AnimSystem.createTimeGroup(el)`";
                        this.defaultEase = 1, this.onPlayTimeUpdate = this.onPlayTimeUpdate.bind(this), o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "finalizeInit", this).call(this)
                    }
                }, {
                    key: "progress",
                    value: function (e) {
                        if (void 0 === e) return 0 === this.boundsMax ? 0 : this.position.local / this.boundsMax;
                        var t = e * this.boundsMax;
                        this.timelineUpdateRequired = !0, this._onScroll(t)
                    }
                }, {
                    key: "time",
                    value: function (e) {
                        return void 0 === e ? this.position.local : (e = l.clamp(e, this.boundsMin, this.boundsMax), this.timelineUpdateRequired = !0, void this._onScroll(e))
                    }
                }, {
                    key: "play",
                    value: function (e) {
                        this.reversed(!1), this.isEnabled = !0, this._isPaused = !1, this.time(e), this._playheadEmitter.run()
                    }
                }, {
                    key: "reverse",
                    value: function (e) {
                        this.reversed(!0), this.isEnabled = !0, this._isPaused = !1, this.time(e), this._playheadEmitter.run()
                    }
                }, {
                    key: "reversed",
                    value: function (e) {
                        return void 0 === e ? this._isReversed : void(this._isReversed = e)
                    }
                }, {
                    key: "restart",
                    value: function () {
                        this._isReversed ? (this.progress(1), this.reverse(this.time())) : (this.progress(0), this.play(this.time()))
                    }
                }, {
                    key: "pause",
                    value: function (e) {
                        this.time(e), this._isPaused = !0
                    }
                }, {
                    key: "paused",
                    value: function (e) {
                        return void 0 === e ? this._isPaused : (this._isPaused = e, this._isPaused || this.play(), this)
                    }
                }, {
                    key: "onPlayTimeUpdate",
                    value: function (e) {
                        if (!this._isPaused) {
                            var n = l.clamp(e.delta / 1e3, 0, .5);
                            this._isReversed && (n = -n);
                            var r = this.time(),
                                i = r + n * this._timeScale;
                            if (this._repeats === t.REPEAT_FOREVER || this._repeats > 0) {
                                var a = !1;
                                !this._isReversed && i > this.boundsMax ? (i -= this.boundsMax, a = !0) : this._isReversed && i < 0 && (i = this.boundsMax + i, a = !0), a && (this._repeats = this._repeats === t.REPEAT_FOREVER ? t.REPEAT_FOREVER : this._repeats - 1)
                            }
                            this.time(i);
                            var s = !this._isReversed && this.position.local !== this.duration,
                                o = this._isReversed && 0 !== this.position.local;
                            s || o ? this._playheadEmitter.run() : this.paused(!0)
                        }
                    }
                }, {
                    key: "updateProgress",
                    value: function (e) {
                        return this.hasDuration() ? (this.position.localUnclamped = e, void(this.position.local = l.clamp(this.position.localUnclamped, this.boundsMin, this.boundsMax))) : void(this.position.local = this.position.localUnclamped = 0)
                    }
                }, {
                    key: "updateBounds",
                    value: function () {
                        if (0 === this.keyframeControllers.length) return this.boundsMin = 0, void(this.boundsMax = 0);
                        for (var e = {
                                min: Number.POSITIVE_INFINITY,
                                max: Number.NEGATIVE_INFINITY
                            }, t = 0, n = this.keyframeControllers.length; t < n; t++) this.keyframeControllers[t].getBounds(e);
                        this.boundsMin = 0, this.boundsMax = e.max, this.viewableRange.a = this.viewableRange.b = 0, this.viewableRange.c = this.viewableRange.d = this.boundsMax, this.timelineUpdateRequired = !0
                    }
                }, {
                    key: "setupRAFEmitter",
                    value: function (e) {
                        this._playheadEmitter = new h.create, this._playheadEmitter.on("update", this.onPlayTimeUpdate), o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setupRAFEmitter", this).call(this, e)
                    }
                }, {
                    key: "timeScale",
                    value: function (e) {
                        return void 0 === e ? this._timeScale : (this._timeScale = e, this)
                    }
                }, {
                    key: "repeats",
                    value: function (e) {
                        return void 0 === e ? this._repeats : void(this._repeats = e)
                    }
                }, {
                    key: "getPosition",
                    value: function () {
                        return this.position.local
                    }
                }, {
                    key: "convertScrollPositionToTValue",
                    value: function (e) {
                        return e
                    }
                }, {
                    key: "convertTValueToScrollPosition",
                    value: function (e) {
                        return e
                    }
                }, {
                    key: "hasDuration",
                    value: function () {
                        return this.duration > 0
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this._playheadEmitter.destroy(), this._playheadEmitter = null, o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "duration",
                    get: function () {
                        return this.keyframesDirty && this.onKeyframesDirty({
                            silent: !0
                        }), this.boundsMax
                    }
                }]), t
            }(c);
        m.REPEAT_FOREVER = -1, t.exports = m
    }, {
        "./ScrollGroup": 61,
        "@marcom/ac-raf-emitter/RAFEmitter": 28,
        "@marcom/sm-math-utils": 111
    }],
    63: [function (e, t, n) {
        "use strict";
        var r = function (e) {
            return e.reduce(function (e, t) {
                return e[t] = t, e
            }, {})
        };
        t.exports = r
    }, {}],
    64: [function (e, t, n) {
        "use strict";
        t.exports = function (e, t) {
            if ("string" != typeof e) return e;
            try {
                return (t || document).querySelector(e) || document.querySelector(e)
            } catch (n) {
                return !1
            }
        }
    }, {}],
    65: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            a = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            s = e("./SourceTemplate.js"),
            o = e("@marcom/xhr-request"),
            c = e("@marcom/ac-console/error"),
            l = Object.freeze({
                responseType: "blob"
            }),
            u = function () {
                function e(t) {
                    r(this, e), t = Object.assign({}, t), this._requestOptions = Object.assign({}, l, t.xhr), this._template = new s(t), this._evtObserver = null, this._state = {
                        request: null,
                        objectUrl: ""
                    }, this._requestCache = new Map, this._history = [], this._openNewRequest()
                }
                return a(e, null, [{
                    key: "convertToResolution",
                    value: function (e) {
                        return "boolean" != typeof e ? null : e ? "2x" : "1x"
                    }
                }, {
                    key: "convertViewportName",
                    value: function (e, t) {
                        return "L" === e || t !== !0 && "xlarge" === e ? "large" : "M" === e ? "medium" : "S" === e ? "small" : e
                    }
                }]), a(e, [{
                    key: "load",
                    value: function () {
                        var e = this,
                            t = this._state.request,
                            n = t.xhr.response,
                            r = !n,
                            i = void 0;
                        return i = r ? t.send() : 200 === t.xhr.status ? Promise.resolve({
                            response: n
                        }) : Promise.reject({
                            error: this._state.requestErr
                        }), i.then(function (t) {
                            var n = t.response;
                            return "blob" === e._requestOptions.responseType && (e._state.objectUrl = n = window.URL.createObjectURL(t.response), e._updateHistory()), Promise.resolve(n)
                        }, function (t) {
                            var n = e._state.requestErr = t.error;
                            return Promise.reject(n)
                        })
                    }
                }, {
                    key: "change",
                    value: function (t) {
                        if ("object" !== ("undefined" == typeof t ? "undefined" : i(t)) || Array.isArray(t)) return void c("AssetSource.change expects an object argument.");
                        var n = t.hasOwnProperty("viewport"),
                            r = t.hasOwnProperty("resolution");
                        if (!n && !r) return void c("AssetSource.change requires a viewport and/or resolution.");
                        if (n && (this._template.viewport = e.convertViewportName(t.viewport)), r) {
                            var a = t.resolution;
                            this._template.resolution = "boolean" == typeof a ? e.convertToResolution(a) : a
                        }
                        this._openNewRequest()
                    }
                }, {
                    key: "abortLoad",
                    value: function () {
                        this._state.request.xhr.abort()
                    }
                }, {
                    key: "revokeLastObjectUrl",
                    value: function () {
                        if ("blob" === this._requestOptions.responseType) {
                            var e = this._history.length,
                                t = 2,
                                n = e - t;
                            if (n < 0) return;
                            var r = this._history[n];
                            window.URL.revokeObjectURL(r.objectUrl)
                        }
                    }
                }, {
                    key: "_openNewRequest",
                    value: function () {
                        var e = this._template.viewport + "_" + this._template.resolution,
                            t = this._requestCache.get(e);
                        if (!t) {
                            var n = this._template.generatePath();
                            t = new o(n, this._requestOptions), this._requestCache.set(e, t), t.open()
                        }
                        this._state.request = t
                    }
                }, {
                    key: "_updateHistory",
                    value: function () {
                        this._history.push(Object.assign({}, this._state))
                    }
                }, {
                    key: "_revokeAllObjectUrls",
                    value: function () {
                        "blob" === this._requestOptions.responseType && this._history.forEach(function (e) {
                            window.URL.revokeObjectURL(e.objectUrl)
                        })
                    }
                }, {
                    key: "request",
                    get: function () {
                        return this._state.request
                    }
                }, {
                    key: "assetUrl",
                    get: function () {
                        return this._state.request.requestUrl
                    }
                }, {
                    key: "objectUrl",
                    get: function () {
                        return this._state.objectUrl
                    }
                }, {
                    key: "viewport",
                    get: function () {
                        return this._template.viewport
                    }
                }, {
                    key: "resolution",
                    get: function () {
                        return this._template.resolution
                    }
                }, {
                    key: "requestCache",
                    get: function () {
                        return this._requestCache
                    }
                }, {
                    key: "history",
                    get: function () {
                        return this._history
                    }
                }]), e
            }();
        t.exports = u
    }, {
        "./SourceTemplate.js": 66,
        "@marcom/ac-console/error": 19,
        "@marcom/xhr-request": 116
    }],
    66: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("./model"),
            s = {
                isVatPath: !0
            },
            o = "/105/media",
            c = function () {
                function e(t) {
                    r(this, e), t = Object.assign({}, s, t), t.model = t.model || a, this._model = t.model, this._isVatPath = t.isVatPath, this.viewport = "", this.resolution = "", this._pathSegmentsMap = this._createPathSegmentMap(t), this._template = this._createTemplate(this._pathSegmentsMap)
                }
                return i(e, null, [{
                    key: "formatPathSegment",
                    value: function (e) {
                        var t = /^\s*\/*\s*|\s*\/*\s*$/g,
                            n = /\b\/{2,}\b/g,
                            r = /\b:\/{2}\b/,
                            i = e.replace(t, "");
                        return i ? (i = i.replace(n, "/"), r.test(i) ? i : "/" + i) : ""
                    }
                }]), i(e, [{
                    key: "generatePath",
                    value: function () {
                        var e = this._model.TEMPLATE_PLACEHOLDERS,
                            t = this.viewport,
                            n = this.resolution;
                        return n && (n = "1x" === n || "" === t ? "" : "_" + n), this._template.replace(e.viewport, t).replace(e.resolution, n)
                    }
                }, {
                    key: "_createPathSegmentMap",
                    value: function (e) {
                        var t = e.el,
                            n = e.model,
                            r = n.PATH_SEGMENTS,
                            i = n.ATTRIBUTES,
                            a = new Map;
                        return Object.keys(r).forEach(function (n) {
                            var s = i[n],
                                o = s && t && t.hasAttribute(s),
                                c = o ? t.getAttribute(s) : e[n];
                            "/" === c || null === c || "null" === c ? c = "" : c || o || (c = r[n]), a.set(n, c)
                        }), this.viewport = a.get("viewport"), this.resolution = a.get("resolution"), a
                    }
                }, {
                    key: "_createTemplate",
                    value: function (t) {
                        var n = this._isVatPath ? o : "",
                            r = this._model.TEMPLATE_PLACEHOLDERS;
                        return t.forEach(function (t, i) {
                            t && (n += "viewport" === i ? e.formatPathSegment(r.viewport) : "resolution" === i ? r.resolution : "format" === i ? "." + t : e.formatPathSegment(t))
                        }), n
                    }
                }]), e
            }();
        t.exports = c
    }, {
        "./model": 67
    }],
    67: [function (e, t, n) {
        "use strict";
        t.exports = {
            ATTRIBUTES: {
                locale: "data-source-locale",
                path: "data-source-path",
                name: "data-source-name",
                viewport: "data-source-viewport",
                resolution: "data-source-resolution",
                format: "data-source-format"
            },
            TEMPLATE_PLACEHOLDERS: {
                viewport: "{{viewport}}",
                resolution: "{{resolution}}"
            },
            PATH_SEGMENTS: {
                locale: "us",
                path: "",
                name: "",
                viewport: "",
                resolution: "",
                format: "mp4"
            }
        }
    }, {}],
    68: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = function f(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : f(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            c = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            l = e("@marcom/anim-system/Model/AnimSystemModel"),
            u = {
                create: e("@marcom/ac-raf-emitter/RAFEmitter"),
                update: e("@marcom/ac-raf-emitter/update"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            h = function () {},
            m = 0,
            d = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return n.el = e.el, n.gum = e.gum, n.componentName = e.componentName, n._keyframeController = null, n
                }
                return a(t, e), s(t, [{
                    key: "destroy",
                    value: function () {
                        this.el = null, this.gum = null, this._keyframeController = null, o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "addKeyframe",
                    value: function (e) {
                        var t = e.el || this.el;
                        return (e.group || this.anim).addKeyframe(t, e)
                    }
                }, {
                    key: "addDiscreteEvent",
                    value: function (e) {
                        e.event = e.event || "Generic-Event-Name-" + m++;
                        var t = void 0 !== e.end && e.end !== e.start,
                            n = this.addKeyframe(e);
                        return t ? (e.onEnterOnce && n.controller.once(e.event + ":enter", e.onEnterOnce), e.onExitOnce && n.controller.once(e.event + ":exit", e.onExitOnce), e.onEnter && n.controller.on(e.event + ":enter", e.onEnter), e.onExit && n.controller.on(e.event + ":exit", e.onExit)) : (e.onEventOnce && n.controller.once(e.event, e.onEventOnce), e.onEventReverseOnce && n.controller.once(e.event + ":reverse", e.onEventReverseOnce), e.onEvent && n.controller.on(e.event, e.onEvent), e.onEventReverse && n.controller.on(e.event + ":reverse", e.onEventReverse)), n
                    }
                }, {
                    key: "addRAFLoop",
                    value: function (e) {
                        var t = ["start", "end"];
                        if (!t.every(function (t) {
                                return e.hasOwnProperty(t)
                            })) return void console.log("BubbleGum.BaseComponent::addRAFLoop required options are missing: " + t.join(" "));
                        var n = new u.create;
                        n.on("update", e.onUpdate || h), n.on("draw", e.onDraw || h), n.on("draw", function () {
                            return n.run()
                        });
                        var r = e.onEnter,
                            i = e.onExit;
                        return e.onEnter = function () {
                            n.run(), r ? r() : 0
                        }, e.onExit = function () {
                            n.cancel(), i ? i() : 0
                        }, this.addDiscreteEvent(e)
                    }
                }, {
                    key: "addContinuousEvent",
                    value: function (e) {
                        e.onDraw || console.log("BubbleGum.BaseComponent::addContinuousEvent required option `onDraw` is missing. Consider using a regular keyframe if you do not need a callback"), e.event = e.event || "Generic-Event-Name-" + m++;
                        var t = this.addKeyframe(e);
                        return t.controller.on(e.event, e.onDraw), t
                    }
                }, {
                    key: "mounted",
                    value: function () {}
                }, {
                    key: "onResizeImmediate",
                    value: function (e) {}
                }, {
                    key: "onResizeDebounced",
                    value: function (e) {}
                }, {
                    key: "onBreakpointChange",
                    value: function (e) {}
                }, {
                    key: "anim",
                    get: function () {
                        return this.gum.anim
                    }
                }, {
                    key: "keyframeController",
                    get: function () {
                        return this._keyframeController || (this._keyframeController = this.anim.getControllerForTarget(this.el))
                    }
                }, {
                    key: "pageMetrics",
                    get: function () {
                        return l.pageMetrics
                    }
                }]), t
            }(c);
        t.exports = d
    }, {
        "@marcom/ac-event-emitter-micro": 23,
        "@marcom/ac-raf-emitter/RAFEmitter": 28,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/update": 39,
        "@marcom/anim-system/Model/AnimSystemModel": 53
    }],
    69: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            c = e("@marcom/delayed-initializer"),
            l = e("@marcom/anim-system"),
            u = e("@marcom/anim-system/Model/AnimSystemModel"),
            h = e("./ComponentMap"),
            m = {},
            d = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return n.el = e, n.anim = l, n.components = [], n.el.getAttribute("data-anim-scroll-group") || n.el.setAttribute("data-anim-scroll-group", "bubble-gum-group"), l.on(u.EVENTS.ON_DOM_GROUPS_CREATED, function (e) {
                        n.componentsInitialized = !1, n.initComponents(), n.setupEvents()
                    }), l.on(u.EVENTS.ON_DOM_KEYFRAMES_CREATED, function () {
                        n.components.forEach(function (e) {
                            return e.mounted()
                        }), n.trigger(t.EVENTS.DOM_COMPONENTS_MOUNTED)
                    }), c.add(function () {
                        return l.initialize()
                    }), n
                }
                return a(t, e), s(t, [{
                    key: "initComponents",
                    value: function () {
                        var e = Array.prototype.slice.call(this.el.querySelectorAll("[data-component-list]"));
                        this.el.hasAttribute("data-component-list") && e.push(this.el);
                        for (var t = 0; t < e.length; t++)
                            for (var n = e[t], r = n.getAttribute("data-component-list"), i = r.split(" "), a = 0, s = i.length; a < s; a++) {
                                var o = i[a];
                                "" !== o && " " !== o && this.addComponent({
                                    el: n,
                                    componentName: o
                                })
                            }
                        this.componentsInitialized = !0
                    }
                }, {
                    key: "setupEvents",
                    value: function () {
                        this.onResizeDebounced = this.onResizeDebounced.bind(this), this.onResizeImmediate = this.onResizeImmediate.bind(this), this.onBreakpointChange = this.onBreakpointChange.bind(this), l.on(u.PageEvents.ON_RESIZE_IMMEDIATE, this.onResizeImmediate), l.on(u.PageEvents.ON_RESIZE_DEBOUNCED, this.onResizeDebounced), l.on(u.PageEvents.ON_BREAKPOINT_CHANGE, this.onBreakpointChange)
                    }
                }, {
                    key: "addComponent",
                    value: function (e) {
                        var n = e.el,
                            r = e.componentName,
                            i = e.data;
                        if (!h.hasOwnProperty(r)) throw "BubbleGum::addComponent could not add component to '" + n.className + "'. No component type '" + r + "' found!";
                        var a = h[r];
                        if (!t.componentIsSupported(a, r)) return void 0 === m[r] && (console.log("BubbleGum::addComponent unsupported component '" + r + "'. Reason: '" + r + ".IS_SUPPORTED' returned false"),
                            m[r] = !0), null;
                        var s = n.dataset.componentList || "";
                        s.includes(r) || (n.dataset.componentList = s.split(" ").concat(r).join(" "));
                        var o = new a({
                            el: n,
                            data: i,
                            componentName: e.componentName,
                            gum: this,
                            pageMetrics: u.pageMetrics
                        });
                        return this.components.push(o), this.componentsInitialized && o.mounted(), o
                    }
                }, {
                    key: "removeComponent",
                    value: function (e) {
                        var t = this.components.indexOf(e);
                        t !== -1 && (this.components.splice(t, 1), e.el.dataset.componentList = e.el.dataset.componentList.split(" ").filter(function (t) {
                            return t !== e.componentName
                        }).join(" "), e.destroy())
                    }
                }, {
                    key: "getComponentOfType",
                    value: function (e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.documentElement,
                            n = "[data-component-list*=" + e + "]",
                            r = t.matches(n) ? t : t.querySelector(n);
                        return r ? this.components.find(function (t) {
                            return t instanceof h[e] && t.el === r
                        }) : null
                    }
                }, {
                    key: "getComponentsOfType",
                    value: function (e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.documentElement,
                            n = "[data-component-list*=" + e + "]",
                            r = t.matches(n) ? [t] : Array.from(t.querySelectorAll(n));
                        return this.components.filter(function (t) {
                            return t instanceof h[e] && r.includes(t.el)
                        })
                    }
                }, {
                    key: "getComponentsForElement",
                    value: function (e) {
                        return this.components.filter(function (t) {
                            return t.el === e
                        })
                    }
                }, {
                    key: "onResizeImmediate",
                    value: function () {
                        this.components.forEach(function (e) {
                            return e.onResizeImmediate(u.pageMetrics)
                        })
                    }
                }, {
                    key: "onResizeDebounced",
                    value: function () {
                        this.components.forEach(function (e) {
                            return e.onResizeDebounced(u.pageMetrics)
                        })
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function () {
                        this.components.forEach(function (e) {
                            return e.onBreakpointChange(u.pageMetrics)
                        })
                    }
                }], [{
                    key: "componentIsSupported",
                    value: function (e, t) {
                        var n = e.IS_SUPPORTED;
                        if (void 0 === n) return !0;
                        if ("function" != typeof n) return console.error('BubbleGum::addComponent error in "' + t + '".IS_SUPPORTED - it should be a function which returns true/false'), !0;
                        var r = e.IS_SUPPORTED();
                        return void 0 === r ? (console.error('BubbleGum::addComponent error in "' + t + '".IS_SUPPORTED - it should be a function which returns true/false'), !0) : r
                    }
                }]), t
            }(o);
        d.EVENTS = {
            DOM_COMPONENTS_MOUNTED: "DOM_COMPONENTS_MOUNTED"
        }, t.exports = d
    }, {
        "./ComponentMap": 70,
        "@marcom/ac-event-emitter-micro": 23,
        "@marcom/anim-system": 48,
        "@marcom/anim-system/Model/AnimSystemModel": 53,
        "@marcom/delayed-initializer": 83
    }],
    70: [function (e, t, n) {
        "use strict";
        t.exports = {
            BaseComponent: e("./BaseComponent")
        }
    }, {
        "./BaseComponent": 68
    }],
    71: [function (e, t, n) {
        "use strict";

        function r(e) {
            e = e || {}, a.call(this), this.id = o.getNewID(), this.executor = e.executor || s, this._reset(), this._willRun = !1, this._didDestroy = !1
        }
        var i, a = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = e("@marcom/ac-raf-executor/sharedRAFExecutorInstance"),
            o = e("@marcom/ac-raf-emitter-id-generator/sharedRAFEmitterIDGeneratorInstance");
        i = r.prototype = Object.create(a.prototype), i.run = function () {
            return this._willRun || (this._willRun = !0), this._subscribe()
        }, i.cancel = function () {
            this._unsubscribe(), this._willRun && (this._willRun = !1), this._reset()
        }, i.destroy = function () {
            var e = this.willRun();
            return this.cancel(), this.executor = null, a.prototype.destroy.call(this), this._didDestroy = !0, e
        }, i.willRun = function () {
            return this._willRun
        }, i.isRunning = function () {
            return this._isRunning
        }, i._subscribe = function () {
            return this.executor.subscribe(this)
        }, i._unsubscribe = function () {
            return this.executor.unsubscribe(this)
        }, i._onAnimationFrameStart = function (e) {
            this._isRunning = !0, this._willRun = !1, this._didEmitFrameData || (this._didEmitFrameData = !0, this.trigger("start", e))
        }, i._onAnimationFrameEnd = function (e) {
            this._willRun || (this.trigger("stop", e), this._reset())
        }, i._reset = function () {
            this._didEmitFrameData = !1, this._isRunning = !1
        }, t.exports = r
    }, {
        "@marcom/ac-event-emitter-micro": 23,
        "@marcom/ac-raf-emitter-id-generator/sharedRAFEmitterIDGeneratorInstance": 26,
        "@marcom/ac-raf-executor/sharedRAFExecutorInstance": 41
    }],
    72: [function (e, t, n) {
        "use strict";
        var r = e("./SingleCallRAFEmitter"),
            i = function (e) {
                this.rafEmitter = new r, this.rafEmitter.on(e, this._onRAFExecuted.bind(this)), this.requestAnimationFrame = this.requestAnimationFrame.bind(this), this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this), this._frameCallbacks = [], this._nextFrameCallbacks = [], this._currentFrameID = -1, this._cancelFrameIdx = -1, this._frameCallbackLength = 0, this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0
            },
            a = i.prototype;
        a.requestAnimationFrame = function (e) {
            return this._currentFrameID = this.rafEmitter.run(), this._nextFrameCallbacks.push(this._currentFrameID, e), this._nextFrameCallbacksLength += 2, this._currentFrameID
        }, a.cancelAnimationFrame = function (e) {
            this._cancelFrameIdx = this._nextFrameCallbacks.indexOf(e), this._cancelFrameIdx !== -1 && (this._nextFrameCallbacks.splice(this._cancelFrameIdx, 2), this._nextFrameCallbacksLength -= 2, 0 === this._nextFrameCallbacksLength && this.rafEmitter.cancel())
        }, a._onRAFExecuted = function (e) {
            for (this._frameCallbacks = this._nextFrameCallbacks, this._frameCallbackLength = this._nextFrameCallbacksLength, this._nextFrameCallbacks = [], this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0; this._frameCallbackIteration < this._frameCallbackLength; this._frameCallbackIteration += 2) this._frameCallbacks[this._frameCallbackIteration + 1](e.time, e)
        }, t.exports = i
    }, {
        "./SingleCallRAFEmitter": 74
    }],
    73: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterface"),
            i = function () {
                this.events = {}
            },
            a = i.prototype;
        a.requestAnimationFrame = function (e) {
            return this.events[e] || (this.events[e] = new r(e)), this.events[e].requestAnimationFrame
        }, a.cancelAnimationFrame = function (e) {
            return this.events[e] || (this.events[e] = new r(e)), this.events[e].cancelAnimationFrame
        }, t.exports = new i
    }, {
        "./RAFInterface": 72
    }],
    74: [function (e, t, n) {
        "use strict";
        var r = e("./RAFEmitter"),
            i = function (e) {
                r.call(this, e)
            },
            a = i.prototype = Object.create(r.prototype);
        a._subscribe = function () {
            return this.executor.subscribe(this, !0)
        }, t.exports = i
    }, {
        "./RAFEmitter": 71
    }],
    75: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterfaceController");
        t.exports = r.requestAnimationFrame("draw")
    }, {
        "./RAFInterfaceController": 73
    }],
    76: [function (e, t, n) {
        "use strict";
        var r = e("./RAFInterfaceController");
        t.exports = r.requestAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 73
    }],
    77: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("@marcom/ac-raf-emitter/update"),
            s = e("@marcom/ac-raf-emitter/draw"),
            o = e("./private/afterOptionalPromise"),
            c = e("./private/ensureFunctionOrNull"),
            l = e("./private/sequence"),
            u = e("./private/clamp"),
            h = function () {
                function e(t) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    if (r(this, e), "number" != typeof t || !isFinite(t)) throw new TypeError('Clip duration must be a finite number; got "' + t + '"');
                    "function" == typeof n && (n = {
                        draw: n
                    }), this.ease = c(n.ease), this.update = c(n.update), this.draw = n.draw, this.prepare = c(n.prepare), this.finish = c(n.finish), this._duration = 1e3 * t, this._startTime = null, this._isPrepared = !1, this._promise = null, this._isPlaying = !1
                }
                return i(e, [{
                    key: "_run",
                    value: function (e, t) {
                        var n = this;
                        this.lastFrameTime = Date.now(), null === this._startTime && (this._startTime = this.lastFrameTime);
                        var r = this.easedProgress;
                        this.update && a(function () {
                            return n._isPlaying && n.update(r)
                        }), s(function () {
                            n._isPlaying && (n.draw(r), n.isComplete ? l(s, [n.finish, t]) : n._run(n, t))
                        })
                    }
                }, {
                    key: "play",
                    value: function () {
                        var e = this;
                        if ("function" != typeof this.draw) throw new Error('Clip must be given a "draw" function as an option or have its "draw" method overriden.');
                        return this._isPlaying = !0, this._promise ? this._promise : (this._promise = new Promise(function (t, n) {
                            !e._isPrepared && e.prepare ? (e._isPrepared = !0, s(function () {
                                return o(e.prepare(), function () {
                                    e._run(e, t)
                                })
                            })) : e._run(e, t)
                        }), this._promise)
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this._isPlaying = !1, this.draw = this.finish = this.update = null
                    }
                }, {
                    key: "isReversed",
                    get: function () {
                        return this._duration < 0
                    }
                }, {
                    key: "isComplete",
                    get: function () {
                        var e = this.progress;
                        return !this.isReversed && e >= 1 || this.isReversed && e <= 0
                    }
                }, {
                    key: "progress",
                    get: function () {
                        if (0 === this._duration) return 1;
                        var e = (this.lastFrameTime - this._startTime) / this._duration;
                        return this.isReversed && (e = 1 + e), u(e, 0, 1)
                    }
                }, {
                    key: "easedProgress",
                    get: function () {
                        return this.ease ? this.ease(this.progress) : this.progress
                    }
                }], [{
                    key: "play",
                    value: function () {
                        return (new(Function.prototype.bind.apply(this, [null].concat(Array.prototype.slice.call(arguments))))).play()
                    }
                }]), e
            }();
        t.exports = h
    }, {
        "./private/afterOptionalPromise": 78,
        "./private/clamp": 79,
        "./private/ensureFunctionOrNull": 80,
        "./private/sequence": 81,
        "@marcom/ac-raf-emitter/draw": 75,
        "@marcom/ac-raf-emitter/update": 76
    }],
    78: [function (e, t, n) {
        "use strict";
        t.exports = function (e, t) {
            e instanceof Promise ? e.then(t) : t()
        }
    }, {}],
    79: [function (e, t, n) {
        "use strict";
        t.exports = function (e, t, n) {
            return Math.min(Math.max(e, t), n)
        }
    }, {}],
    80: [function (e, t, n) {
        "use strict";
        t.exports = function (e) {
            return "function" == typeof e ? e : null
        }
    }, {}],
    81: [function (e, t, n) {
        "use strict";
        t.exports = function (e, t) {
            function n() {
                var a = t[i];
                "function" == typeof a && e(t[i]), i++, i < r && n()
            }
            var r = t.length,
                i = 0;
            n()
        }
    }, {}],
    82: [function (e, t, n) {
        "use strict";
        var r = {
                create: e("gl-mat4/create"),
                invert: e("gl-mat4/invert"),
                clone: e("gl-mat4/clone"),
                transpose: e("gl-mat4/transpose")
            },
            i = {
                create: e("gl-vec3/create"),
                dot: e("gl-vec3/dot"),
                normalize: e("gl-vec3/normalize"),
                length: e("gl-vec3/length"),
                cross: e("gl-vec3/cross"),
                fromValues: e("gl-vec3/fromValues")
            },
            a = {
                create: e("gl-vec4/create"),
                transformMat4: e("gl-vec4/transformMat4"),
                fromValues: e("gl-vec4/fromValues")
            },
            s = (Math.PI / 180, 180 / Math.PI),
            o = 0,
            c = 1,
            l = 3,
            u = 4,
            h = 5,
            m = 7,
            d = 11,
            f = 12,
            p = 13,
            v = 15,
            y = function (e, t) {
                t = t || !1;
                for (var n = r.clone(e), o = i.create(), c = i.create(), u = i.create(), h = a.create(), f = a.create(), p = (i.create(), 0); p < 16; p++) n[p] /= n[v];
                var y = r.clone(n);
                y[l] = 0, y[m] = 0, y[d] = 0, y[v] = 1;
                var E = (n[3], n[7], n[11], n[12]),
                    w = n[13],
                    x = n[14],
                    I = (n[15], a.create());
                if (_(n[l]) && _(n[m]) && _(n[d])) h = a.fromValues(0, 0, 0, 1);
                else {
                    I[0] = n[l], I[1] = n[m], I[2] = n[d], I[3] = n[v];
                    var O = r.invert(r.create(), y),
                        A = r.transpose(r.create(), O);
                    h = a.transformMat4(h, I, A)
                }
                o[0] = E, o[1] = w, o[2] = x;
                var S = [i.create(), i.create(), i.create()];
                S[0][0] = n[0], S[0][1] = n[1], S[0][2] = n[2], S[1][0] = n[4], S[1][1] = n[5], S[1][2] = n[6], S[2][0] = n[8], S[2][1] = n[9], S[2][2] = n[10], c[0] = i.length(S[0]), i.normalize(S[0], S[0]), u[0] = i.dot(S[0], S[1]), S[1] = b(S[1], S[0], 1, -u[0]), c[1] = i.length(S[1]), i.normalize(S[1], S[1]), u[0] /= c[1], u[1] = i.dot(S[0], S[2]), S[2] = b(S[2], S[0], 1, -u[1]), u[2] = i.dot(S[1], S[2]), S[2] = b(S[2], S[1], 1, -u[2]), c[2] = i.length(S[2]), i.normalize(S[2], S[2]), u[1] /= c[2], u[2] /= c[2];
                var T = i.cross(i.create(), S[1], S[2]);
                if (i.dot(S[0], T) < 0)
                    for (p = 0; p < 3; p++) c[p] *= -1, S[p][0] *= -1, S[p][1] *= -1, S[p][2] *= -1;
                f[0] = .5 * Math.sqrt(Math.max(1 + S[0][0] - S[1][1] - S[2][2], 0)), f[1] = .5 * Math.sqrt(Math.max(1 - S[0][0] + S[1][1] - S[2][2], 0)), f[2] = .5 * Math.sqrt(Math.max(1 - S[0][0] - S[1][1] + S[2][2], 0)), f[3] = .5 * Math.sqrt(Math.max(1 + S[0][0] + S[1][1] + S[2][2], 0)), S[2][1] > S[1][2] && (f[0] = -f[0]), S[0][2] > S[2][0] && (f[1] = -f[1]), S[1][0] > S[0][1] && (f[2] = -f[2]);
                var k = a.fromValues(f[0], f[1], f[2], 2 * Math.acos(f[3])),
                    P = g(f);
                return t && (u[0] = Math.round(u[0] * s * 100) / 100, u[1] = Math.round(u[1] * s * 100) / 100, u[2] = Math.round(u[2] * s * 100) / 100, P[0] = Math.round(P[0] * s * 100) / 100, P[1] = Math.round(P[1] * s * 100) / 100, P[2] = Math.round(P[2] * s * 100) / 100, k[3] = Math.round(k[3] * s * 100) / 100), {
                    translation: o,
                    scale: c,
                    skew: u,
                    perspective: h,
                    quaternion: f,
                    eulerRotation: P,
                    axisAngle: k
                }
            },
            b = function (e, t, n, r) {
                var a = i.create();
                return a[0] = n * e[0] + r * t[0], a[1] = n * e[1] + r * t[1], a[2] = n * e[2] + r * t[2], a
            },
            g = function (e) {
                var t, n, r, a = e[3] * e[3],
                    s = e[0] * e[0],
                    o = e[1] * e[1],
                    c = e[2] * e[2],
                    l = s + o + c + a,
                    u = e[0] * e[1] + e[2] * e[3];
                return u > .499 * l ? (n = 2 * Math.atan2(e[0], e[3]), r = Math.PI / 2, t = 0, i.fromValues(t, n, r)) : u < -.499 * l ? (n = -2 * Math.atan2(e[0], e[3]), r = -Math.PI / 2, t = 0, i.fromValues(t, n, r)) : (n = Math.atan2(2 * e[1] * e[3] - 2 * e[0] * e[2], s - o - c + a), r = Math.asin(2 * u / l), t = Math.atan2(2 * e[0] * e[3] - 2 * e[1] * e[2], -s + o - c + a), i.fromValues(t, n, r))
            },
            _ = function (e) {
                return Math.abs(e) < 1e-4
            },
            E = function (e) {
                var t = String(getComputedStyle(e).transform).trim(),
                    n = r.create();
                if ("none" === t || "" === t) return n;
                var i, a, s = t.slice(0, t.indexOf("("));
                if ("matrix3d" === s)
                    for (i = t.slice(9, -1).split(","), a = 0; a < i.length; a++) n[a] = parseFloat(i[a]);
                else {
                    if ("matrix" !== s) throw new TypeError("Invalid Matrix Value");
                    for (i = t.slice(7, -1).split(","), a = i.length; a--;) i[a] = parseFloat(i[a]);
                    n[o] = i[0], n[c] = i[1], n[f] = i[4], n[u] = i[2], n[h] = i[3], n[p] = i[5]
                }
                return n
            };
        t.exports = function (e, t) {
            var n = E(e);
            return y(n, t)
        }
    }, {
        "gl-mat4/clone": 117,
        "gl-mat4/create": 118,
        "gl-mat4/invert": 119,
        "gl-mat4/transpose": 124,
        "gl-vec3/create": 125,
        "gl-vec3/cross": 126,
        "gl-vec3/dot": 127,
        "gl-vec3/fromValues": 128,
        "gl-vec3/length": 129,
        "gl-vec3/normalize": 130,
        "gl-vec4/create": 131,
        "gl-vec4/fromValues": 132,
        "gl-vec4/transformMat4": 133
    }],
    83: [function (e, t, n) {
        "use strict";
        var r = !1,
            i = !1,
            a = [];
        t.exports = {
            NUMBER_OF_FRAMES_TO_WAIT: 30,
            add: function (e) {
                var t = this;
                if (i && e(), a.push(e), !r) {
                    r = !0;
                    var n = document.documentElement.scrollHeight,
                        s = 0,
                        o = function c() {
                            var e = document.documentElement.scrollHeight;
                            if (n !== e) s = 0;
                            else if (s++, s >= t.NUMBER_OF_FRAMES_TO_WAIT) return void a.forEach(function (e) {
                                return e()
                            });
                            n = e, requestAnimationFrame(c)
                        };
                    requestAnimationFrame(o)
                }
            }
        }
    }, {}],
    84: [function (e, t, n) {
        "use strict";
        t.exports = {
            getWindow: function () {
                return window
            },
            getDocument: function () {
                return document
            },
            getNavigator: function () {
                return navigator
            }
        }
    }, {}],
    85: [function (e, t, n) {
        "use strict";

        function r() {
            var e = i.getWindow(),
                t = e.matchMedia("(prefers-reduced-motion)");
            return !(!t || !t.matches)
        }
        var i = e("./helpers/globals");
        t.exports = r
    }, {
        "./helpers/globals": 84
    }],
    86: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("./model").controls,
            s = e("@marcom/ac-console/warn"),
            o = function () {
                function e(t, n) {
                    r(this, e), n = Object.assign({}, n), this._model = n.model || a, this._container = t, this._ctrls = new Map, this._state = {
                        arePresent: !1
                    }
                }
                return i(e, [{
                    key: "initialize",
                    value: function () {
                        var e = this,
                            t = this._container;
                        if (t) {
                            var n = this._model.SELECTORS;
                            Object.keys(n).forEach(function (r) {
                                if ("container" !== r) {
                                    var i = n[r],
                                        a = t.querySelector(i);
                                    a && (e._ctrls.set(r, a), e._state.arePresent = !0)
                                }
                            })
                        }
                    }
                }, {
                    key: "isPresent",
                    value: function (e) {
                        return !!this._ctrls.get(e)
                    }
                }, {
                    key: "getElement",
                    value: function (e) {
                        var t = this._ctrls.get(e);
                        return t || null
                    }
                }, {
                    key: "enable",
                    value: function (e) {
                        this._setDisabled(e, !1)
                    }
                }, {
                    key: "disable",
                    value: function (e) {
                        this._setDisabled(e, !0)
                    }
                }, {
                    key: "_setDisabled",
                    value: function (e, t) {
                        var n = this._ctrls,
                            r = function (r, i) {
                                var a = n.get(r);
                                a ? a.disabled = i : s("Unable to " + (t ? "disable" : "enable") + " the " + e + " control. The element does not exist.")
                            };
                        "string" == typeof e ? r(e, t) : Array.isArray(e) && e.forEach(function (e) {
                            r(e, t)
                        })
                    }
                }, {
                    key: "disableAll",
                    value: function () {
                        var e = this;
                        this._ctrls.forEach(function (t, n) {
                            e.disable(n)
                        })
                    }
                }, {
                    key: "attach",
                    value: function (e, t) {
                        var n = this._ctrls.get(e);
                        return n && "function" == typeof t ? void n.addEventListener("click", t) : void s("Unable to attach " + e + " control.")
                    }
                }, {
                    key: "remove",
                    value: function (e, t) {
                        var n = this._ctrls.get(e);
                        return "string" != typeof e && "function" != typeof t || !this._ctrls.get(e) ? void s("Unable to remove " + e + " control.") : void n.removeEventListener("click", t)
                    }
                }, {
                    key: "arePresent",
                    get: function () {
                        return this._state.arePresent
                    }
                }, {
                    key: "allElements",
                    get: function () {
                        return this._ctrls
                    }
                }]), e
            }();
        t.exports = o
    }, {
        "./model": 92,
        "@marcom/ac-console/warn": 22
    }],
    87: [function (e, t, n) {
        "use strict";
        "use stric";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("./model").frames,
            s = e("@marcom/ac-console/warn"),
            o = function () {
                function e(t, n) {
                    r(this, e), n = Object.assign({}, n), this._model = n.model || a, this._container = t, this._frames = new Map, this._promise = {}, this._state = {
                        arePresent: !1,
                        active: !1
                    }
                }
                return i(e, [{
                    key: "isPresent",
                    value: function (e) {
                        return !!this._frames.get(e)
                    }
                }, {
                    key: "isActive",
                    value: function (e) {
                        return this._state[e].active
                    }
                }, {
                    key: "getElement",
                    value: function (e) {
                        var t = this._frames.get(e);
                        return t ? t : (s("The " + e + "Frame does not appear to exist."), null)
                    }
                }, {
                    key: "initialize",
                    value: function () {
                        var e = this,
                            t = this._container;
                        if (t) {
                            var n = this._model.SELECTORS;
                            Object.keys(n).forEach(function (r) {
                                if ("container" !== r) {
                                    var i = n[r],
                                        a = t.querySelector(i);
                                    a && (e._frames.set(r, a), e._state.arePresent = !0, e._state[r] = {}, e._state[r].active = a.classList.contains(e._model.CLASS.active), e._state[r].hasCSSTransition = e._checkForCSSTransition(a, r), e._promise[r] = {}, e._promise[r].activate = null, e._promise[r].deactivate = null)
                                }
                            })
                        }
                    }
                }, {
                    key: "activate",
                    value: function (e) {
                        return this._setActivity(e, !0)
                    }
                }, {
                    key: "deactivate",
                    value: function (e) {
                        return this._setActivity(e, !1)
                    }
                }, {
                    key: "deactivateAll",
                    value: function () {
                        var e = this,
                            t = [];
                        return this._frames.forEach(function (n, r) {
                            t.push(e.deactivate(r))
                        }), Promise.all(t)
                    }
                }, {
                    key: "_checkForCSSTransition",
                    value: function (e, t) {
                        var n = window.getComputedStyle(e)["transition-duration"],
                            r = n && "0s" !== n;
                        return r || s("InlineVideo : Frames : " + (t ? t + "Frame" : e) + " does not have a valid CSS transition for (de)activation"), r
                    }
                }, {
                    key: "_toggleActivity",
                    value: function (e, t) {
                        t || (t = this.getElement(e)), t.classList.toggle(this._model.CLASS.active), this._state[e].active = !this._state[e].active
                    }
                }, {
                    key: "_setActivity",
                    value: function (e, t) {
                        var n = this,
                            r = this._frames.get(e);
                        if (!r) return Promise.reject("The " + e + "Frame element does not exist");
                        var i = t ? "activate" : "deactivate",
                            a = t ? "deactivate" : "activate",
                            s = this._promise[e][i];
                        if (s) return s;
                        var o = this._promise[e][a] || Promise.resolve();
                        return o.then(function () {
                            return n._promise[e][a] = null, n._promise[e][i] = new Promise(function (a, s) {
                                var o = n._state[e].active;
                                if (!(t && !o || !t && o)) return n._promise[e][i] = null, void a();
                                var c = !!r.offsetHeight;
                                if (n._state[e].hasCSSTransition && c) {
                                    var l = function u() {
                                        r.removeEventListener("transitionend", u), n._promise[e][i] = null, a()
                                    };
                                    r.addEventListener("transitionend", l), n._toggleActivity(e, r)
                                } else n._toggleActivity(e, r), n._promise[e][i] = null, a()
                            })
                        })
                    }
                }, {
                    key: "arePresent",
                    get: function () {
                        return this._state.arePresent
                    }
                }, {
                    key: "active",
                    get: function () {
                        var e = this,
                            t = !1;
                        return this._frames.forEach(function (n, r) {
                            var i = e.isActive(r);
                            t = i ? i : t
                        }), t
                    }
                }]), e
            }();
        t.exports = o
    }, {
        "./model": 92,
        "@marcom/ac-console/warn": 22
    }],
    88: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("./model").indicators,
            s = e("@marcom/ac-console/warn"),
            o = function () {
                function e(t, n) {
                    r(this, e), n = Object.assign({}, n), this._model = n.model || a, this._container = t, this._indicators = new Map, this._state = {
                        arePresent: !1
                    }
                }
                return i(e, [{
                    key: "initialize",
                    value: function () {
                        var e = this,
                            t = this._container;
                        if (t) {
                            var n = this._model.SELECTORS;
                            Object.keys(n).forEach(function (r) {
                                if ("container" !== r) {
                                    var i = n[r],
                                        a = t.querySelector(i);
                                    a && (e._indicators.set(r, a), e._state.arePresent = !0, e._state[r] = {}, e._state[r].active = a.classList.contains(e._model.CLASS.active))
                                }
                            })
                        }
                    }
                }, {
                    key: "isPresent",
                    value: function (e) {
                        return !!this._indicators.get(e)
                    }
                }, {
                    key: "isActive",
                    value: function (e) {
                        return this._state[e].active
                    }
                }, {
                    key: "getElement",
                    value: function (e) {
                        var t = this._indicators.get(e);
                        return t || null
                    }
                }, {
                    key: "activate",
                    value: function (e) {
                        this._setActivity(e, !1)
                    }
                }, {
                    key: "deactivate",
                    value: function (e) {
                        this._setActivity(e, !0)
                    }
                }, {
                    key: "_setActivity",
                    value: function (e, t) {
                        var n = this._indicators.get(e);
                        if (!n) return void s("Unable to " + (t ? "deactivate" : "activate") + " the " + e + " indicator. The element does not exist.");
                        var r = t ? "remove" : "add";
                        this._state[e].active = !t, n.classList[r](this._model.CLASS.active)
                    }
                }, {
                    key: "arePresent",
                    get: function () {
                        return this._state.arePresent
                    }
                }, {
                    key: "allElements",
                    get: function () {
                        return this._indicators
                    }
                }]), e
            }();
        t.exports = o
    }, {
        "./model": 92,
        "@marcom/ac-console/warn": 22
    }],
    89: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = function v(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : v(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            c = e("./Video"),
            l = e("./Controls"),
            u = e("./Frames"),
            h = e("./Indicators"),
            m = e("./model"),
            d = e("@marcom/ac-console/warn"),
            f = e("@marcom/ac-console/error"),
            p = function (e) {
                function t(e, n) {
                    r(this, t), n = Object.assign({}, n), n.model = n.model || m, n.model = Object.assign({}, n.model, n.model.video), delete n.model.video;
                    var a = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
                    return a._controls = {}, a._frames = {}, a._indicators = {}, a.replay = a.replay.bind(a), a
                }
                return a(t, e), s(t, [{
                    key: "initialize",
                    value: function () {
                        o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "initialize", this).call(this);
                        var e = this._container;
                        if (!e) return void f("InlineVideo Error : A video element was passed as the containing element. InlineVideo class expects a container element holding the video, optional frames, and optional controls.");
                        var n = e.querySelector(this._model.controls.SELECTORS.container),
                            r = e.querySelector(this._model.frames.SELECTORS.container) || e,
                            i = e.querySelector(this._model.indicators.SELECTORS.container),
                            a = this._model;
                        n && (this._controls = new l(n, {
                            model: a.controls
                        }), this._controls.initialize(), this._controls.arePresent && this._attachControls()), r && (this._frames = new u(r, {
                            model: a.frames
                        }), this._frames.initialize(), this._frames.arePresent || d("No inline-video frames appear to be present. At minimum, a static frame should be present for fallback.")), i && (this._indicators = new h(i, {
                            model: a.indicators
                        }), this._indicators.initialize())
                    }
                }, {
                    key: "load",
                    value: function () {
                        var e = this,
                            n = this._indicators,
                            r = "loading";
                        !this.loaded && n.arePresent && n.activate(r);
                        var i = Promise.resolve();
                        return !this._frames.active, i.then(function () {
                            return o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "load", e).call(e)
                        })
                    }
                }, {
                    key: "play",
                    value: function () {
                        var e = this,
                            n = this._frames,
                            r = this._controls,
                            i = "playing",
                            a = n.isPresent("end") && n.isActive("end") ? n.deactivate("end") : Promise.resolve(),
                            s = function c() {
                                e._el.removeEventListener(i, c), r.arePresent && (r.disable(["play", "replay"]), r.enable("pause"))
                            };
                        return this._el.addEventListener(i, s), a.then(function () {
                            return o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "play", e).call(e)
                        }, function (e) {
                            d(e)
                        })
                    }
                }, {
                    key: "pause",
                    value: function () {
                        var e = this._controls;
                        return o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "pause", this).call(this).then(function () {
                            e.arePresent && (e.disable("pause"), e.enable("play"))
                        }, function (e) {
                            d(e)
                        })
                    }
                }, {
                    key: "reset",
                    value: function () {
                        var e = this,
                            n = this._controls;
                        return o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "reset", this).call(this).then(function () {
                            n.arePresent && (n.disable("pause"), e.hasPlayed && n.isPresent("replay") ? n.enable("replay") : n.enable("play"))
                        }, function (e) {
                            d(e)
                        })
                    }
                }, {
                    key: "replay",
                    value: function () {
                        var e = this,
                            t = this._controls,
                            n = t.arePresent;
                        return n && (t.disable("replay"), t.enable("pause")), this.reset().then(function () {
                            return e.play()
                        })["catch"](function (e) {
                            d(e)
                        })
                    }
                }, {
                    key: "_attachControls",
                    value: function () {
                        var e = this,
                            t = this._controls,
                            n = t.allElements;
                        n.forEach(function (n, r) {
                            var i = e[r];
                            i ? t.attach(r, i) : d("Unable to attach " + r + " control. No equivalent video method.")
                        })
                    }
                }, {
                    key: "_onLoadSuccess",
                    value: function (e) {
                        var n = this,
                            r = this._controls,
                            i = this._frames,
                            a = this._indicators,
                            s = "loading";
                        return o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_onLoadSuccess", this).call(this, e).then(function () {
                            return a.arePresent && a.deactivate(s), r.arePresent && (n.hasPlayed && r.isPresent("replay") ? r.enable("replay") : r.enable("play")), i.arePresent ? i.deactivateAll() : Promise.resolve()
                        })["catch"](function (e) {
                            d(e)
                        }).then(function () {
                            return Promise.resolve()
                        })
                    }
                }, {
                    key: "_onLoadFailure",
                    value: function (e) {
                        var n = this,
                            r = this._controls,
                            i = this._frames,
                            a = this._indicators,
                            s = "loading";
                        return o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_onLoadFailure", this).call(this, e)["catch"](function (e) {}).then(function () {
                            return a.arePresent && a.deactivate(s), r.arePresent && r.disableAll(), i.arePresent ? i.activate("static") : Promise.resolve()
                        }).then(function () {
                            var e = i.deactivate("end"),
                                t = i.deactivate("start");
                            return Promise.all([e, t])
                        })["catch"](function (e) {
                            d(e)
                        }).then(function () {
                            var t = n._el;
                            return t.getAttribute("src") && (t.setAttribute("src", ""), n._video.source.revokeLastObjectUrl()), Promise.reject(e)
                        })
                    }
                }, {
                    key: "_onEnded",
                    value: function (e) {
                        var n = this,
                            r = this._controls,
                            i = this._frames;
                        r.arePresent && (r.disable("pause"), r.isPresent("replay") ? r.enable("replay") : r.enable("play"));
                        var a = i.isPresent("end") && !i.isActive("end") ? i.activate("end") : Promise.resolve();
                        return a["catch"](function (e) {
                            d(e)
                        }).then(function () {
                            return o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_onEnded", n).call(n, e)
                        })
                    }
                }, {
                    key: "frames",
                    get: function () {
                        return this._frames
                    }
                }, {
                    key: "controls",
                    get: function () {
                        return this._controls
                    }
                }, {
                    key: "indicators",
                    get: function () {
                        return this._indicators
                    }
                }]), t
            }(c);
        t.exports = p
    }, {
        "./Controls": 86,
        "./Frames": 87,
        "./Indicators": 88,
        "./Video": 90,
        "./model": 92,
        "@marcom/ac-console/error": 19,
        "@marcom/ac-console/warn": 22
    }],
    90: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("./model").video,
            s = e("@marcom/asset-source/AssetSource"),
            o = e("@marcom/ac-console/error"),
            c = function () {
                function e(t, n) {
                    r(this, e), n = Object.assign({}, n), this._model = n.model || a, delete n.model, this._options = n;
                    var i = "VIDEO" === t.tagName;
                    this._container = i ? null : t, this._el = i ? t : null, this._source = null, this._promise = {
                        load: null,
                        nativePlay: null,
                        playOnEnd: null
                    }, this._state = {
                        loading: !1,
                        hasPlayed: !1,
                        assetUrl: ""
                    }, this.load = this.load.bind(this), this.play = this.play.bind(this), this.pause = this.pause.bind(this), this.end = this.end.bind(this), this.reset = this.reset.bind(this), this._crossBrowserPlay = this._crossBrowserPlay.bind(this), this._playPromiseOnEnded = this._playPromiseOnEnded.bind(this), this._onEnded = this._onEnded.bind(this)
                }
                return i(e, null, [{
                    key: "convertToResolution",
                    value: function (e) {
                        return s.convertToResolution(e)
                    }
                }, {
                    key: "convertViewportName",
                    value: function (e, t) {
                        return s.convertViewportName(e, t)
                    }
                }]), i(e, [{
                    key: "initialize",
                    value: function () {
                        var e = this._container;
                        e && (this._el = this._container.querySelector(this._model.SELECTORS.video)), this._options.el = this._el, this._source = new s(this._options)
                    }
                }, {
                    key: "change",
                    value: function (e) {
                        this.source.change(e)
                    }
                }, {
                    key: "load",
                    value: function () {
                        var e = this;
                        return this._promise.load && this.loaded ? this._promise.load : (this._state.loading = !0, this._promise.load = this._source.load().then(function (t) {
                            return e._onLoadSuccess(t)
                        }, function (t) {
                            return e._onLoadFailure(t)
                        }))
                    }
                }, {
                    key: "play",
                    value: function () {
                        if (this._promise.nativePlay || this.isPlaying) return this._promise.playOnEnd;
                        var e = this._promise.load;
                        return e || this.loaded || (e = this.load()), this._promise.playOnEnd = e.then(this._playPromiseOnEnded)
                    }
                }, {
                    key: "pause",
                    value: function () {
                        var e = this,
                            t = this._promise.nativePlay;
                        return t = t ? t : Promise.resolve(), t.then(function () {
                            return !e._el.paused && e.loaded && e._el.pause(), Promise.resolve()
                        }, function (e) {
                            return Promise.reject(e)
                        })
                    }
                }, {
                    key: "reset",
                    value: function () {
                        var e = this,
                            t = this._promise.nativePlay;
                        return t = t ? t : Promise.resolve(), t.then(function () {
                            return e.loaded && (e._el.paused || e._el.pause(), e._el.currentTime = 0), Promise.resolve()
                        }, function (e) {
                            return Promise.reject(e)
                        })
                    }
                }, {
                    key: "end",
                    value: function () {
                        var e = this;
                        return this._el.ended ? Promise.resolve() : this.pause().then(function () {
                            return e._el.currentTime = e.normalizedDuration, Promise.resolve()
                        }, function (e) {
                            return Promise.reject(e)
                        })
                    }
                }, {
                    key: "_onLoadSuccess",
                    value: function (e) {
                        var t = this;
                        return new Promise(function (n, r) {
                            var i = function a() {
                                t._el.removeEventListener("loadeddata", a), t._onFirstFrameLoaded(), n()
                            };
                            t._el.addEventListener("loadeddata", i), t._el.setAttribute("src", e), t._el.load()
                        })
                    }
                }, {
                    key: "_onFirstFrameLoaded",
                    value: function () {
                        this._state.assetUrl = this._source.assetUrl, this._state.loading = !1, this._source.revokeLastObjectUrl()
                    }
                }, {
                    key: "_onLoadFailure",
                    value: function (e) {
                        return o("inline-video load error:", e), this._state.loading = !1, Promise.reject(e)
                    }
                }, {
                    key: "_crossBrowserPlay",
                    value: function () {
                        var e = this._el.play();
                        return e ? e : Promise.resolve()
                    }
                }, {
                    key: "_playPromiseOnEnded",
                    value: function () {
                        var e = this;
                        return new Promise(function (t, n) {
                            e._el.onended = function () {
                                e._onEnded(t)
                            };
                            var r = e._promise.nativePlay = e._crossBrowserPlay();
                            r.then(function () {
                                e._state.hasPlayed = !0, e._promise.nativePlay = null
                            })["catch"](n)
                        })
                    }
                }, {
                    key: "_onEnded",
                    value: function (e) {
                        return e()
                    }
                }, {
                    key: "el",
                    get: function () {
                        return this._el
                    }
                }, {
                    key: "source",
                    get: function () {
                        return this._source
                    }
                }, {
                    key: "loading",
                    get: function () {
                        return this._state.loading
                    }
                }, {
                    key: "loaded",
                    get: function () {
                        return this._state.assetUrl === this._source.assetUrl
                    }
                }, {
                    key: "hasPlayed",
                    get: function () {
                        return this._state.hasPlayed
                    }
                }, {
                    key: "assetUrl",
                    get: function () {
                        return this._state.hasPlayed
                    }
                }, {
                    key: "isPlaying",
                    get: function () {
                        var e = this._el;
                        return !(!e || e.paused || e.ended || !(e.readyState > 2))
                    }
                }, {
                    key: "viewport",
                    get: function () {
                        return this.source.viewport
                    },
                    set: function (t) {
                        this.change({
                            viewport: e.convertViewportName(t)
                        })
                    }
                }, {
                    key: "resolution",
                    get: function () {
                        return this.source.resolution
                    },
                    set: function (e) {
                        this.change({
                            resolution: e
                        })
                    }
                }, {
                    key: "normalizedDuration",
                    get: function () {
                        var e = this._el.duration,
                            t = e % 1,
                            n = e - t,
                            r = .1,
                            i = Math.ceil(t / r) * r;
                        return n + i
                    }
                }]), e
            }();
        t.exports = c
    }, {
        "./model": 92,
        "@marcom/ac-console/error": 19,
        "@marcom/asset-source/AssetSource": 65
    }],
    91: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/bubble-gum/BaseComponent"),
            c = e("@marcom/ac-raf-emitter/draw"),
            l = e("@marcom/ac-console/error"),
            u = e("@marcom/asset-source/model"),
            h = e("../InlineVideo"),
            m = {
                RETINA: "only screen and (-webkit-min-device-pixel-ratio: 1.5), screen and (min-resolution: 1.5dppx), screen and (min-resolution: 144dpi)",
                REDUCED_MOTION: "(prefers-reduced-motion)"
            },
            d = {
                play: {
                    start: "-100vh + (t + 50h)",
                    end: "(t + 50h)",
                    event: "inline-video-play"
                },
                load: {
                    start: "-250vh + (t + 50h)",
                    end: "(t + 50h) + 150vh",
                    event: "inline-video-load"
                }
            },
            f = {
                animLoad: "data-inline-video-anim-load",
                animPlay: "data-inline-video-anim-play",
                reload: "data-inline-video-reload-viewports",
                viewport: u.ATTRIBUTES.viewport,
                resolution: u.ATTRIBUTES.resolution
            },
            p = function (e) {
                function t(e, n) {
                    r(this, t);
                    var a = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return a.video = null, a._domOverrides = {}, a._pathSegments = {
                        vatPath: n,
                        viewport: h.convertViewportName(e.pageMetrics.breakpoint),
                        resolution: h.convertToResolution(a.isRetina)
                    }, a._animController = "", a._animEvents = {
                        load: "",
                        play: ""
                    }, a._load = a._load.bind(a), a._play = a._play.bind(a), a._enableReducedMotionControls = a._enableReducedMotionControls.bind(a), a
                }
                return a(t, e), s(t, null, [{
                    key: "IS_SUPPORTED",
                    value: function () {
                        return document.documentElement.classList.contains("inline-video")
                    }
                }]), s(t, [{
                    key: "mounted",
                    value: function () {
                        var e = this._pathSegments,
                            t = this._getDomOverrides(f);
                        this.video = new h(this.el, {
                            path: "" + e.vatPath,
                            viewport: e.viewport,
                            resolution: e.resolution
                        }), this.video.initialize();
                        var n = Object.assign({}, d.load, t.animLoad),
                            r = Object.assign({}, d.play, t.animPlay);
                        this._setupAnimLoad(n), this._setupAnimPlay(r), this._animController = this.anim.getControllerForTarget(this.el)
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function (e) {
                        var t = e.breakpoint,
                            n = e.previousBreakpoint,
                            r = this._shouldReloadViewport(t, n),
                            i = this._shouldReloadResolution(),
                            a = {};
                        (r || i) && (r && (a.viewport = h.convertViewportName(t)), i && (a.resolution = h.convertToResolution(this.isRetina)), this.video.change(a))
                    }
                }, {
                    key: "_getDomOverrides",
                    value: function (e) {
                        var t = this,
                            n = this.el.querySelector("video"),
                            r = {};
                        return Object.keys(e).forEach(function (r) {
                            var i = e[r],
                                a = n.getAttribute(i);
                            a && "null" !== a && (t._domOverrides[r] = a)
                        }), r
                    }
                }, {
                    key: "_enableReducedMotionControls",
                    value: function () {
                        var e = this.video.controls;
                        return this.prefersReducedMotion && e.arePresent && (e.isPresent("play") ? e.enable("play") : e.isPresent("replay") && e.enable("replay")), Promise.resolve()
                    }
                }, {
                    key: "_load",
                    value: function () {
                        var e = this,
                            t = this.video;
                        if (t.loaded) return Promise.resolve();
                        var n = function () {
                            return new Promise(function (n, r) {
                                var i = function () {
                                    c(function () {
                                        window.URL.revokeObjectURL(t.el.src), t.el.src = "", n()
                                    })
                                };
                                e.prefersReducedMotion && !t.controls.arePresent ? t.frames.activate("static").then(i, r) : t.load().then(e._enableReducedMotionControls).then(n, r)
                            })
                        };
                        return n()["catch"](function (e) {
                            l("BaseInlineVideo encountered an error while trying to load, " + e)
                        })
                    }
                }, {
                    key: "_play",
                    value: function () {
                        var e = this.video;
                        return e.play()["catch"](function (e) {
                            l("BaseInlineVideo encountered an error while trying to play, " + e)
                        })
                    }
                }, {
                    key: "_setupAnimLoad",
                    value: function (e) {
                        var t = this,
                            n = this.addDiscreteEvent(e),
                            r = this._animEvents.load = e.event;
                        n.controller.on(r + ":enter", this._load), n.controller.on(r + ":exit", function () {
                            t.video.isPlaying && t.video.end()
                        })
                    }
                }, {
                    key: "_setupAnimPlay",
                    value: function (e) {
                        if (!this.prefersReducedMotion) {
                            var t = this.addDiscreteEvent(e),
                                n = this._animEvents.play = e.event;
                            t.controller.once(n + ":enter", this._play)
                        }
                    }
                }, {
                    key: "_shouldReloadViewport",
                    value: function (e, t) {
                        var n = this._domOverrides;
                        if (n.viewport || e === t) return !1;
                        if (!n.reload) return !0;
                        e = e.toLowerCase(), t = t.toLowerCase();
                        for (var r = n.reload.split(","), i = /(\w+)(:)(\w+)/, a = n.reload.length, s = !1, o = 0; o < a; o++) {
                            var c = r[o];
                            if (s = c === e || c === t) break;
                            var l = c.match(i);
                            if (l) {
                                var u = l[1],
                                    h = l[3];
                                if (s = u === t && h === e) break
                            }
                        }
                        return s
                    }
                }, {
                    key: "_shouldReloadResolution",
                    value: function () {
                        if (this._domOverrides.resolution) return !1;
                        var e = h.convertToResolution(this.isRetina),
                            t = this.video.resolution;
                        return e !== t
                    }
                }, {
                    key: "isRetina",
                    get: function () {
                        return window.matchMedia(m.RETINA).matches
                    }
                }, {
                    key: "prefersReducedMotion",
                    get: function () {
                        return window.matchMedia(m.REDUCED_MOTION).matches
                    }
                }]), t
            }(o);
        t.exports = p
    }, {
        "../InlineVideo": 89,
        "@marcom/ac-console/error": 19,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/asset-source/model": 67,
        "@marcom/bubble-gum/BaseComponent": 68
    }],
    92: [function (e, t, n) {
        "use strict";
        t.exports = {
            video: {
                SELECTORS: {
                    video: "video",
                    mediaContainer: ".inline-video-media"
                }
            },
            frames: {
                CLASS: {
                    active: "active"
                },
                SELECTORS: {
                    container: ".inline-video-media",
                    "static": ".inline-video-frame-static",
                    start: ".inline-video-frame-start",
                    end: ".inline-video-frame-end"
                }
            },
            controls: {
                SELECTORS: {
                    container: ".inline-video-controls",
                    play: ".inline-video-control-play",
                    replay: ".inline-video-control-replay",
                    pause: ".inline-video-control-pause",
                    reset: ".inline-video-control-reset"
                }
            },
            indicators: {
                CLASS: {
                    active: "active"
                },
                SELECTORS: {
                    container: ".inline-video-indicators",
                    loading: ".inline-video-indicator-loading"
                }
            }
        }
    }, {}],
    93: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = e("@marcom/ac-event-emitter-micro/src/ac-event-emitter-micro/EventEmitterMicro"),
            o = e("./Model"),
            c = e("./mixins/Getters"),
            l = e("./mixins/AutoMount"),
            u = e("./mixins/KeyframeUtils"),
            h = e("./mixins/TrackSelections"),
            m = e("./mixins/AutoCreateItems"),
            d = e("./mixins/InitialItemSelection"),
            f = e("./mixins/SetAriaVisibilityOnChangeCompleted"),
            p = ["beforeCreate", "created", "beforeMount", "createItems", "itemsCreated", "mounted", "animateToItem", "onItemChangeInitiated", "onItemChangeOccurred", "onItemChangeCompleted", "onResizeImmediate", "onBreakpointChange", "onResizeDebounced", "destroy"],
            v = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.el = e.el, n.model = Object.assign({
                        options: e
                    }, JSON.parse(JSON.stringify(o))), n._items = [], n.itemIndex = {
                        current: 0,
                        previous: 0
                    }, p.forEach(function (e) {
                        n[e] = function () {
                            for (var t = arguments.length, r = Array(t), i = 0; i < t; i++) r[i] = arguments[i];
                            n["__" + e] && n["__" + e].forEach(function (e) {
                                return e.apply(n, r)
                            })
                        }
                    }), n.on(o.Events.ITEM_CHANGE_INITIATED, n.onItemChangeInitiated), n.on(o.Events.ITEM_CHANGE_OCCURRED, n.onItemChangeOccurred), n.on(o.Events.ITEM_CHANGE_COMPLETED, n.onItemChangeCompleted), ["beforeCreate", "created", "beforeMount", "createItems"].forEach(function (t) {
                        return n[t](e)
                    }), n
                }
                return a(t, e), t
            }(s);
        v.withMixins = function () {
            for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            var s = function (e) {
                    function t() {
                        return r(this, t), i(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                    }
                    return a(t, e), t
                }(v),
                o = s.prototype;
            return t.unshift(c, h, u), t.push(m, f, l, d), t.forEach(function (e) {
                for (var t in e) p.includes(t) ? (o["__" + t] = o["__" + t] || [], o["__" + t].push(e[t])) : o[t] = e[t]
            }), s
        }, t.exports = v
    }, {
        "./Model": 95,
        "./mixins/AutoCreateItems": 97,
        "./mixins/AutoMount": 98,
        "./mixins/Getters": 101,
        "./mixins/InitialItemSelection": 102,
        "./mixins/KeyframeUtils": 104,
        "./mixins/SetAriaVisibilityOnChangeCompleted": 107,
        "./mixins/TrackSelections": 110,
        "@marcom/ac-event-emitter-micro/src/ac-event-emitter-micro/EventEmitterMicro": 24
    }],
    94: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/ac-event-emitter-micro/src/ac-event-emitter-micro").EventEmitterMicro,
            c = {
                draw: e("@marcom/ac-raf-emitter/draw"),
                cancelDraw: e("@marcom/ac-raf-emitter/cancelDraw")
            },
            l = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return n._x = 0, n._y = 0, n._opacity = 0, n._width = 0, n._height = 0, n._zIndex = 0, n.index = e.index, n.el = e.el, n.applyDraw = n.applyDraw.bind(n), n.measure(), n
                }
                return a(t, e), s(t, [{
                    key: "measure",
                    value: function () {
                        var e = getComputedStyle(this.el);
                        this._width = this.el.clientWidth, this._height = this.el.clientHeight, this._zIndex = parseInt(e.getPropertyValue("z-index")), this._opacity = parseFloat(e.getPropertyValue("opacity"))
                    }
                }, {
                    key: "select",
                    value: function () {
                        this.el.classList.add("current"), this.trigger("select", this)
                    }
                }, {
                    key: "deselect",
                    value: function () {
                        this.el.classList.remove("current"), this.trigger("deselect", this)
                    }
                }, {
                    key: "progress",
                    value: function (e) {}
                }, {
                    key: "needsRedraw",
                    value: function () {
                        c.cancelDraw(this._rafID), this._rafID = c.draw(this.applyDraw, !0)
                    }
                }, {
                    key: "applyDraw",
                    value: function () {
                        this.el.style.zIndex = this._zIndex, this.el.style.opacity = this._opacity, this.el.style.transform = "translate(" + this._x + "px, " + this._y + "px)"
                    }
                }, {
                    key: "id",
                    get: function () {
                        return this.el.id
                    }
                }, {
                    key: "height",
                    get: function () {
                        return this._height
                    },
                    set: function (e) {
                        this._height = e, this.needsRedraw()
                    }
                }, {
                    key: "width",
                    get: function () {
                        return this._width
                    },
                    set: function (e) {
                        this._width = e, this.needsRedraw()
                    }
                }, {
                    key: "x",
                    get: function () {
                        return this._x
                    },
                    set: function (e) {
                        this._x = e, this.needsRedraw()
                    }
                }, {
                    key: "y",
                    get: function () {
                        return this._y
                    },
                    set: function (e) {
                        this._y = e, this.needsRedraw()
                    }
                }, {
                    key: "opacity",
                    get: function () {
                        return this._opacity
                    },
                    set: function (e) {
                        this._opacity = e, this.needsRedraw()
                    }
                }, {
                    key: "zIndex",
                    get: function () {
                        return this._zIndex
                    },
                    set: function (e) {
                        this._zIndex = e, this.needsRedraw()
                    }
                }]), t
            }(o);
        t.exports = l
    }, {
        "@marcom/ac-event-emitter-micro/src/ac-event-emitter-micro": 23,
        "@marcom/ac-raf-emitter/cancelDraw": 33,
        "@marcom/ac-raf-emitter/draw": 35
    }],
    95: [function (e, t, n) {
        "use strict";
        t.exports = {
            PrefersReducedMotion: !1,
            IsRTL: !1,
            IsTouch: !1,
            Slide: {
                Selector: ".slide-container"
            },
            Item: {
                Selector: ".gallery-item",
                ConstructorFunction: null
            },
            DotNav: {
                Selector: ".dotnav"
            },
            PaddleNav: {
                Selector: ".paddlenav"
            },
            ChapterPlayer: {
                defaultEase: function (e) {
                    return e
                }
            },
            FadeCaptionOnChange: {
                ItemSelector: ".captions-gallery [data-captions-gallery-item]"
            },
            TabNav: {
                ItemSelector: ".tabnav-items .tabnav-item",
                RoamingTabIndexSelector: "a"
            },
            SwipeDrag: {
                DesktopSwipe: !1,
                movementRateMultiplier: 1.5,
                velocityMultiplier: 8
            },
            Events: {
                ITEM_CHANGE_INITIATED: "ITEM_CHANGE_INITIATED",
                ITEM_CHANGE_OCCURRED: "ITEM_CHANGE_OCCURRED",
                ITEM_CHANGE_COMPLETED: "ITEM_CHANGE_COMPLETED"
            }
        }
    }, {}],
    96: [function (e, t, n) {
        "use strict";
        var r = void 0;
        try {
            r = e("@marcom/ac-analytics").observer.Gallery
        } catch (i) {}
        t.exports = {
            created: function (e) {
                this.analytics = {
                    lastTrackedItem: null,
                    observer: null,
                    events: {
                        UPDATE: "update",
                        UPDATE_COMPLETE: "update:complete"
                    }
                }
            },
            mounted: function () {
                if (r) {
                    var e = this.el.getAttribute("id");
                    e || (console.warn("No ID attribute found on the Mixin Gallery element - please add an ID", this), e = "null"), this.analytics.observer = new r(this, {
                        galleryName: e,
                        beforeUpdateEvent: this.analytics.events.UPDATE,
                        afterUpdateEvent: this.analytics.events.UPDATE_COMPLETE,
                        trackAutoRotate: !0
                    })
                }
            },
            onItemChangeCompleted: function (e) {
                if (e.previous && e.current !== this.analytics.lastTrackedItem && (e.current !== e.previous || this.analytics.lastTrackedItem)) {
                    this.analytics.lastTrackedItem = e.current;
                    var t = {
                        incoming: {
                            id: e.current.id
                        },
                        outgoing: {
                            id: e.previous.id
                        },
                        interactionEvent: this.lastInteractionEvent
                    };
                    this.trigger(this.analytics.events.UPDATE_COMPLETE, t)
                }
            }
        }
    }, {
        "@marcom/ac-analytics": void 0
    }],
    97: [function (e, t, n) {
        "use strict";
        t.exports = {
            createItems: function (e) {
                var t = this;
                if (this._items.length) return void this.itemsCreated();
                if (!this.model.Item.ConstructorFunction) throw new ReferenceError("MixinGallery::AutoCreateItems - this.model.Item.ConstructorFunction is null");
                if (0 === this._items.length) {
                    this._items = [], Array.from(this.el.querySelectorAll(this.model.Item.Selector)).forEach(function (e, n) {
                        var r = new t.model.Item.ConstructorFunction({
                            el: e,
                            index: n
                        });
                        t._items.push(r)
                    });
                    for (var n = this._items[this._items.length - 1], r = 0; r < this._items.length; r++) {
                        var i = this._items[r];
                        i.prev = n, i.next = this._items[r + 1], n = i
                    }
                    n.next = this._items[0]
                }
                this.itemsCreated()
            }
        }
    }, {}],
    98: [function (e, t, n) {
        "use strict";
        t.exports = {
            itemsCreated: function (e) {
                var t = this;
                this.model.options.gum || this._isVue || (this.anim.on("ON_RESIZE_IMMEDIATE", function (e) {
                    return t.onResizeImmediate(e)
                }), this.anim.on("ON_RESIZE_DEBOUNCED", function (e) {
                    return t.onResizeDebounced(e)
                }), this.anim.on("ON_BREAKPOINT_CHANGE", function (e) {
                    return t.onBreakpointChange(e)
                }), requestAnimationFrame(this.mounted))
            }
        }
    }, {}],
    99: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/ac-accessibility/src/RoamingTabIndex"),
            i = e("@marcom/ac-accessibility/src/maps/ariaMap"),
            a = e("@marcom/ac-accessibility/src/maps/roleMap");
        t.exports = {
            created: function () {
                this.dotNav = {
                    navElement: null,
                    current: null,
                    roamingTabIndex: null,
                    items: [],
                    onRoamingTabIndexSelect: function (e) {
                        var t = this.dotNav.items.filter(function (t) {
                            return t === e.el
                        });
                        if (0 === t.length) throw "Could not find tab nav item"
                    }
                }, this.dotNav.onRoamingTabIndexSelect = this.dotNav.onRoamingTabIndexSelect.bind(this)
            },
            itemsCreated: function () {
                var e = this;
                this.dotNav.navElement = this.el.querySelector(this.model.DotNav.Selector), this._items.forEach(function (t, n) {
                    var r = e.dotNav.navElement.querySelector("a[data-ac-gallery-trigger=" + t.id + "]");
                    r.setAttribute("role", a.TAB), r.setAttribute(i.CONTROLS, t.id), r.setAttribute(i.SELECTED, !1), t.on("select", function () {
                        r.classList.add("current"), r.setAttribute(i.SELECTED, !0)
                    }), t.on("deselect", function () {
                        r.classList.remove("current"), r.setAttribute(i.SELECTED, !1)
                    }), r.parentElement.addEventListener("click", function (n) {
                        n.preventDefault(), e.lastInteractionEvent = n;
                        var r = e.itemIndex.current + (t.index - e.wrappedIndex(e.itemIndex.current));
                        e.animateToItem(r)
                    }), e.dotNav.items.push(r), t.el.setAttribute("role", a.TABPANEL), t.el.setAttribute(i.LABELLEDBY, e.dotNav.items[n].id)
                })
            },
            mounted: function () {
                this.dotNav.roamingTabIndex = new r(this.dotNav.navElement, {
                    selector: "a"
                }), this.dotNav.roamingTabIndex.start(), this.dotNav.roamingTabIndex.on("onSelect", this.dotNav.onRoamingTabIndexSelect)
            },
            onItemChangeCompleted: function (e) {
                var t = this.dotNav.items.filter(function (t) {
                    return t.getAttribute("data-ac-gallery-trigger") === e.current.id
                })[0];
                this.setCurrentItem(t), this.dotNav.roamingTabIndex.setSelectedItemByIndex(this.wrappedIndex(this.itemIndex.current), !0)
            },
            setCurrentItem: function (e) {
                e !== this.dotNav.current && (this.dotNav.current = e)
            }
        }
    }, {
        "@marcom/ac-accessibility/src/RoamingTabIndex": 3,
        "@marcom/ac-accessibility/src/maps/ariaMap": 14,
        "@marcom/ac-accessibility/src/maps/roleMap": 17
    }],
    100: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/clip"),
            i = e("@marcom/anim-system/src/Model/EasingFunctions");
        t.exports = {
            mounted: function () {
                var e = this;
                this.el.classList.remove("peeking"), this._items.forEach(function (t) {
                    t.measure(), t.x = 0, t.zIndex = t === e.currentItem ? 2 : 0
                }), this.trigger(this.model.Events.ITEM_CHANGE_OCCURRED, {
                    gallery: this,
                    previous: null,
                    current: this.currentItem
                })
            },
            animateToItem: function (e) {
                var t = this;
                if (this.itemIndex.current !== e) {
                    this.el.parentElement.scrollLeft = 0;
                    var n = this.model.IsTouch ? "easeOutCubic" : "easeInOutCubic",
                        a = 1;
                    this.clip && this.clip._isPlaying && (n = "easeOutQuint", this.clip.destroy());
                    var s = this._items[this.wrappedIndex(this.itemIndex.previous)],
                        o = this._items[this.wrappedIndex(this.itemIndex.current)],
                        c = this._items[this.wrappedIndex(e)];
                    c.opacity = 0, s.zIndex = 0, o.zIndex = 1, c.zIndex = 2;
                    var l = !1;
                    this.clip = new r(a, {
                        ease: i[n],
                        prepare: function () {
                            return t.trigger(t.model.Events.ITEM_CHANGE_INITIATED, {
                                gallery: t,
                                previous: s,
                                current: o,
                                next: c
                            })
                        },
                        update: function (e) {
                            e > .5 && !l && (l = !0, t.itemIndex.previous = o.index, t.itemIndex.current = c.index, t.trigger(t.model.Events.ITEM_CHANGE_OCCURRED, {
                                gallery: t,
                                previous: o,
                                current: c
                            })), c.opacity = e
                        },
                        draw: function () {},
                        finish: function () {
                            t.trigger(t.model.Events.ITEM_CHANGE_COMPLETED, {
                                gallery: t,
                                previous: o,
                                current: c
                            })
                        }
                    }), this.clip.play().then(function () {
                        t.clip.destroy(), t.clip = null
                    })
                }
            },
            onResizeImmediate: function () {
                this.clip && (this.clip.destroy(), this.clip = null)
            },
            destroy: function () {
                this.clip && this.clip.destroy(), this._items.forEach(function (e) {
                    e.zIndex = 0
                })
            }
        }
    }, {
        "@marcom/anim-system/src/Model/EasingFunctions": 54,
        "@marcom/clip": 77
    }],
    101: [function (e, t, n) {
        "use strict";
        t.exports = {
            beforeCreate: function () {
                var e = this;
                Object.defineProperties(this, {
                    currentItem: {
                        configurable: !0,
                        get: function () {
                            return e._items[e.wrappedIndex(e.itemIndex.current)]
                        }
                    }
                })
            },
            wrappedIndex: function (e) {
                return e %= this._items.length, e < 0 ? this._items.length + e : e
            },
            getItemForTrigger: function (e) {
                return this._items.find(function (t) {
                    return t.id === e
                })
            }
        }
    }, {}],
    102: [function (e, t, n) {
        "use strict";
        t.exports = {
            mounted: function () {
                var e = this._items[this.wrappedIndex(this.itemIndex.current)],
                    t = this,
                    n = null,
                    r = null,
                    i = {
                        gallery: t,
                        previous: n,
                        current: e,
                        next: r
                    };
                this.trigger(this.model.Events.ITEM_CHANGE_INITIATED, i), this.trigger(this.model.Events.ITEM_CHANGE_OCCURRED, i), this.trigger(this.model.Events.ITEM_CHANGE_COMPLETED, i)
            }
        }
    }, {}],
    103: [function (e, t, n) {
        "use strict";
        var r = ["INPUT", "SELECT", "TEXTAREA"],
            i = 37,
            a = 39;
        t.exports = {
            created: function (e) {
                var t = this;
                this.onKeyDown = this.onKeyDown.bind(this), this.inViewKeyframe = this.addDiscreteEvent({
                    event: "Gallery: In View",
                    start: "t - 100vh",
                    end: "b + 100%",
                    onEnter: function () {
                        return window.addEventListener("keydown", t.onKeyDown)
                    },
                    onExit: function () {
                        return window.removeEventListener("keydown", t.onKeyDown)
                    }
                }), Object.defineProperty(this, "isInView", {
                    get: function () {
                        return t.inViewKeyframe.isCurrentlyInRange
                    }
                })
            },
            destroy: function () {
                this.inViewKeyframe.remove(), window.removeEventListener("keydown", this.onKeyDown)
            },
            onKeyDown: function (e) {
                if (this.isInView && !this.inputHasFocus() && (e.keyCode === i || e.keyCode === a)) {
                    var t = this.model.IsRTL ? -1 : 1,
                        n = e.keyCode === i ? -1 : 1;
                    this.lastInteractionEvent = e;
                    var r = this.itemIndex.current + n * t;
                    this.animateToItem(r)
                }
            },
            inputHasFocus: function () {
                return r.indexOf(document.activeElement.nodeName) !== -1
            }
        }
    }, {}],
    104: [function (e, t, n) {
        "use strict";
        t.exports = {
            beforeCreate: function () {
                document.body._animInfo && (this.anim = document.body._animInfo.group.anim, this.model.pageMetrics = this.anim.model.pageMetrics)
            },
            addKeyframe: function (e) {
                var t = e.el || this.el;
                return (e.group || this.anim).addKeyframe(t, e)
            },
            addDiscreteEvent: function (e) {
                e.event = e.event || "Generic-Event-Name-" + tmpUUID++;
                var t = void 0 !== e.end && e.end !== e.start,
                    n = this.addKeyframe(e);
                return t ? (e.onEnterOnce && n.controller.once(e.event + ":enter", e.onEnterOnce), e.onExitOnce && n.controller.once(e.event + ":exit", e.onExitOnce), e.onEnter && n.controller.on(e.event + ":enter", e.onEnter), e.onExit && n.controller.on(e.event + ":exit", e.onExit)) : (e.onEventOnce && n.controller.once(e.event, e.onEventOnce), e.onEventReverseOnce && n.controller.once(e.event + ":reverse", e.onEventReverseOnce), e.onEvent && n.controller.on(e.event, e.onEvent), e.onEventReverse && n.controller.on(e.event + ":reverse", e.onEventReverse)), n
            },
            addRAFLoop: function (e) {
                var t = ["start", "end"];
                if (!t.every(function (t) {
                        return e.hasOwnProperty(t)
                    })) return void console.log("BubbleGum.BaseComponent::addRAFLoop required options are missing: " + t.join(" "));
                var n = new RAFEmitter.create;
                n.on("update", e.onUpdate || noop), n.on("draw", e.onDraw || noop), n.on("draw", function () {
                    return n.run()
                });
                var r = e.onEnter,
                    i = e.onExit;
                return e.onEnter = function () {
                    n.run(), r ? r() : 0
                }, e.onExit = function () {
                    n.cancel(), i ? i() : 0
                }, this.addDiscreteEvent(e)
            },
            addContinuousEvent: function (e) {
                e.onDraw || console.log("BubbleGum.BaseComponent::addContinuousEvent required option `onDraw` is missing. Consider using a regular keyframe if you do not need a callback"), e.event = e.event || "Generic-Event-Name-" + tmpUUID++;
                var t = this.addKeyframe(e);
                return t.controller.on(e.event, e.onDraw), t
            }
        }
    }, {}],
    105: [function (e, t, n) {
        "use strict";
        var r = function (e, t) {
            t ? e.removeAttribute("disabled") : e.setAttribute("disabled", "true")
        };
        t.exports = {
            mounted: function () {
                var e = this,
                    t = this.el.querySelector(this.model.PaddleNav.Selector);
                this.paddleNav = {
                    previousEl: t.querySelector(".paddlenav-arrow-previous"),
                    nextEl: t.querySelector(".paddlenav-arrow-next")
                }, this.onPaddleNavSelected = this.onPaddleNavSelected.bind(this), [this.paddleNav.previousEl, this.paddleNav.nextEl].forEach(function (t) {
                    t.addEventListener("click", e.onPaddleNavSelected)
                })
            },
            destroy: function () {
                var e = this;
                [this.paddleNav.previousEl, this.paddleNav.nextEl].forEach(function (t) {
                    t.removeEventListener("click", e.onPaddleNavSelected)
                }), this.paddleNav = null
            },
            onPaddleNavSelected: function (e) {
                var t = e.target.className.includes("previous"),
                    n = this.model.IsRTL ? -1 : 1,
                    r = t ? -1 : 1;
                this.lastInteractionEvent = e;
                var i = this.itemIndex.current + r * n;
                this.animateToItem(i)
            },
            onItemChangeCompleted: function (e) {
                var t = this.model.IsRTL ? -1 : 1,
                    n = this.wrappedIndex(this.itemIndex.current + 1 * t),
                    i = n !== this.itemIndex.current;
                r(this.paddleNav.nextEl, i);
                var a = this.wrappedIndex(this.itemIndex.current + -1 * t),
                    s = a !== this.itemIndex.current;
                r(this.paddleNav.previousEl, s)
            }
        }
    }, {}],
    106: [function (e, t, n) {
        "use strict";
        t.exports = {
            onItemChangeOccurred: function (e) {
                var t = this.selections.occurred,
                    n = t.previous,
                    r = t.current;
                n && n !== r && n.deselect(), r.select()
            }
        }
    }, {}],
    107: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/ac-accessibility/src/helpers/hide"),
            i = e("@marcom/ac-accessibility/src/helpers/show"),
            a = e("@marcom/ac-accessibility/src/maps/focusableElement").join(","),
            s = function (e) {
                return e.forEach(i)
            },
            o = function (e) {
                return e.forEach(r)
            };
        t.exports = {
            itemsCreated: function (e) {
                var t = this;
                this._items.forEach(function (e, n) {
                    var r = [e.el].concat(Array.from(e.el.querySelectorAll(a)));
                    n === t.wrappedIndex(t.itemIndex.current) ? s(r) : o(r), e.accessibleElements = r
                })
            },
            onItemChangeCompleted: function (e) {
                var t = this.selections.completed,
                    n = t.previous,
                    r = t.current;
                n && n !== r && o(n.accessibleElements), s(r.accessibleElements)
            }
        }
    }, {
        "@marcom/ac-accessibility/src/helpers/hide": 7,
        "@marcom/ac-accessibility/src/helpers/show": 12,
        "@marcom/ac-accessibility/src/maps/focusableElement": 15
    }],
    108: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/clip"),
            i = e("@marcom/anim-system/src/Model/EasingFunctions"),
            a = e("@marcom/ac-raf-emitter/src/ac-raf-emitter/update"),
            s = e("@marcom/ac-raf-emitter/src/ac-raf-emitter/draw"),
            o = e("@marcom/ac-raf-emitter/src/ac-raf-emitter/cancelDraw");
        t.exports = {
            beforeCreate: function () {
                var e = this;
                Object.defineProperties(this, {
                    widthOfItem: {
                        configurable: !0,
                        get: function () {
                            return e._items[0].width
                        }
                    }
                })
            },
            created: function (e) {
                this.position = 0, this.target = 0, this.slideContainer = this.el.querySelector(this.model.Slide.Selector)
            },
            mounted: function () {
                var e = this;
                a(function () {
                    e._items.forEach(function (e) {
                        e.measure(), e.x = e.width * e.index
                    }), s(function () {
                        e.position = e.target = e.convertSlideIndexToHorizontalPosition(e.wrappedIndex(e.itemIndex.current)), e.slideContainer.style.transform = "translate3d(" + -e.position + "px, 0,0)", e.checkForSlideUpdate(!0)
                    })
                })
            },
            animateToItem: function (e) {
                var t = this,
                    n = this.wrappedIndex(e);
                if (this.itemIndex.current !== n) {
                    this.el.parentElement.scrollLeft = 0;
                    var a = "easeInOutCubic",
                        s = this.target;
                    this.clip && this.clip._isPlaying && (s = this.clip.endPosition, this.clip.destroy(), a = "easeOutQuint");
                    var o = this.target,
                        c = this.convertSlideIndexToHorizontalPosition(e),
                        l = this.model.PrefersReducedMotion ? .001 : 1,
                        u = this._items[this.wrappedIndex(this.itemIndex.previous)],
                        h = this._items[this.wrappedIndex(this.itemIndex.current)],
                        m = this._items[this.wrappedIndex(e)];
                    this.clip = new r(l, {
                        ease: i[a],
                        prepare: function () {
                            return t.trigger(t.model.Events.ITEM_CHANGE_INITIATED, {
                                gallery: t,
                                previous: u,
                                current: h,
                                next: m
                            })
                        },
                        update: function (e) {
                            t.target = o + (c - o) * e
                        },
                        draw: function () {
                            return t.draw(1)
                        },
                        finish: function () {
                            return t.trigger(t.model.Events.ITEM_CHANGE_COMPLETED, {
                                gallery: t,
                                previous: h,
                                current: m
                            })
                        }
                    }), this.clip.endPosition = c, this.clip.play().then(function () {
                        t.clip.destroy(), t.clip = null
                    })
                }
            },
            draw: function () {
                var e = this,
                    t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                    n = this.target - this.position;
                this.position += n * t;
                var r = Math.abs(this.position - this.target);
                r < .1 && (this.position = this.target), this.checkForSlideUpdate(), this.slideContainer.style.transform = "translate3d(" + -this.position + "px, 0,0)";
                for (var i = 0, a = this._items.length; i < a; i++) {
                    var c = this._items[i],
                        l = this.position - c.x,
                        u = l / this.widthOfItem;
                    c.progress(u)
                }
                this.position / (this.widthOfItem * this._items.length);
                Math.abs(r) > 0 && (o(this.dragDrawId), s(function () {
                    return e.draw(t)
                }))
            },
            checkForSlideUpdate: function (e) {
                var t = Math.floor((this.position + .5 * this.widthOfItem) / this.widthOfItem);
                if (t !== this.itemIndex.current || e) {
                    var n = this.currentItem;
                    this.itemIndex.previous = this.itemIndex.current, this.itemIndex.current = t, this.wrapSlideItems(), this.trigger(this.model.Events.ITEM_CHANGE_OCCURRED, {
                        gallery: this,
                        current: this.currentItem,
                        previous: n
                    })
                }
            },
            wrapSlideItems: function () {
                this.currentItem.x = this.convertSlideIndexToHorizontalPosition(this.itemIndex.current), this.currentItem.prev.x = this.convertSlideIndexToHorizontalPosition(this.itemIndex.current - 1), this.currentItem.next.x = this.convertSlideIndexToHorizontalPosition(this.itemIndex.current + 1)
            },
            onResizeImmediate: function () {
                this.clip && (this.clip.destroy(), this.clip = null), this._items.forEach(function (e) {
                    e.measure(), e.x = e.width * e.index
                }), this.itemIndex.current = this.wrappedIndex(this.currentItem.index), this.wrapSlideItems(), this.position = this.target = this.convertSlideIndexToHorizontalPosition(this.wrappedIndex(this.itemIndex.current)), this.slideContainer.style.transform = "translate3d(" + -this.position + "px, 0,0)"
            },
            convertSlideIndexToHorizontalPosition: function (e) {
                return e * this.widthOfItem
            },
            destroy: function () {
                var e = this;
                this._items.forEach(function (t) {
                    t.measure(), t.x = 0, t.zIndex = t === e.currentItem ? 2 : 0
                }), this.slideContainer.removeAttribute("style")
            }
        }
    }, {
        "@marcom/ac-raf-emitter/src/ac-raf-emitter/cancelDraw": 33,
        "@marcom/ac-raf-emitter/src/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/src/ac-raf-emitter/update": 39,
        "@marcom/anim-system/src/Model/EasingFunctions": 54,
        "@marcom/clip": 77
    }],
    109: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/ac-raf-emitter/src/ac-raf-emitter/draw"),
            i = e("@marcom/ac-raf-emitter/src/ac-raf-emitter/cancelDraw");
        t.exports = {
            created: function (e) {
                this.swipeDrag = {
                    movementRateMultiplier: this.model.SwipeDrag.movementRateMultiplier,
                    velocityMultiplier: this.model.SwipeDrag.velocityMultiplier,
                    dragDrawId: -1,
                    waitingToReachTargetDrawId: -1,
                    inputStart: {
                        x: 0,
                        y: 0
                    },
                    swipeVelocity: 0,
                    isDragging: !1
                }, this._onStartDrag = this._onStartDrag.bind(this), this._onDrag = this._onDrag.bind(this), this._onStopDrag = this._onStopDrag.bind(this), this.waitingToReachTarget = this.waitingToReachTarget.bind(this)
            },
            mounted: function () {
                this.inputMoveEventName = this.model.IsTouch ? "touchmove" : "mousemove", this.inputUpEventName = this.model.IsTouch ? "touchend" : "mouseup", this.inputDownEvent = this.model.IsTouch ? "touchstart" : "mousedown", (this.model.IsTouch || this.model.SwipeDrag.DesktopSwipe) && (this.el.removeEventListener(this.inputDownEvent, this._onStartDrag), this.el.addEventListener(this.inputDownEvent, this._onStartDrag))
            },
            _onStartDrag: function (e) {
                switch (i(this.swipeDrag.dragDrawId), i(this.swipeDrag.waitingToReachTargetDrawId), !0) {
                    case "A" === e.target.tagName:
                    case "BUTTON" === e.target.tagName:
                    case !e.touches && 1 !== e.which:
                        return
                }
                this.clip && this.clip.destroy(), this.lastInteractionEvent = e, this.swipeDrag.swipeVelocity = 0, this.swipeDrag.isDragging = !1;
                var t = this.model.IsTouch ? e.touches[0] : e,
                    n = t.screenX,
                    r = t.screenY;
                this.swipeDrag.inputStart = {
                    x: n,
                    y: r
                }, window.addEventListener(this.inputMoveEventName, this._onDrag, {
                    passive: !1
                }), window.addEventListener(this.inputUpEventName, this._onStopDrag)
            },
            _onDrag: function (e) {
                var t = this;
                this.swipeDrag.isDragging && e.cancelable && e.preventDefault();
                var n = this.model.IsTouch ? e.touches[0] : e,
                    a = n.screenX,
                    s = n.screenY,
                    o = this.swipeDrag.inputStart.x - a,
                    c = this.swipeDrag.inputStart.y - s;
                this.swipeDrag.inputStart = {
                    x: a,
                    y: s
                }, this.swipeDrag.isDragging || (this.swipeDrag.isDragging = Math.abs(o) > 3 && Math.abs(o) > Math.abs(c)), this.swipeDrag.isDragging && (this.target += o * this.swipeDrag.movementRateMultiplier, this.swipeDrag.swipeVelocity = o * this.swipeDrag.velocityMultiplier, i(this.swipeDrag.dragDrawId), this.swipeDrag.dragDrawId = r(function () {
                    return t.draw(.3)
                }))
            },
            _onStopDrag: function (e) {
                var t = this;
                if (window.removeEventListener(this.inputMoveEventName, this._onDrag), window.removeEventListener(this.inputUpEventName, this._onStopDrag), this.swipeDrag.isDragging) {
                    for (var n = [this.itemIndex.current - 1, this.itemIndex.current, this.itemIndex.current + 1], a = 0, s = Number.MAX_VALUE, o = 0, c = n.length; o < c; o++) {
                        var l = n[o] * this.widthOfItem,
                            u = Math.abs(l - (this.position + this.swipeDrag.swipeVelocity));
                        u < s && (s = u, a = o)
                    }
                    this.lastInteractionEvent = e;
                    var h = n[a];
                    this.target = this.convertSlideIndexToHorizontalPosition(h), i(this.swipeDrag.dragDrawId), i(this.swipeDrag.waitingToReachTargetDrawId), this.swipeDrag.dragDrawId = r(function () {
                        t.draw(.2), t.waitingToReachTarget(h)
                    })
                }
            },
            waitingToReachTarget: function (e) {
                var t = this,
                    n = Math.abs(this.position - this.target);
                if (n > .1) return void(this.swipeDrag.waitingToReachTargetDrawId = r(function () {
                    return t.waitingToReachTarget(e)
                }));
                var i = this._items[this.wrappedIndex(this.itemIndex.current)],
                    a = this._items[this.wrappedIndex(this.itemIndex.previous)];
                this.trigger(this.model.Events.ITEM_CHANGE_COMPLETED, {
                    gallery: this,
                    previous: a,
                    current: i
                })
            },
            destroy: function () {
                this.el.removeEventListener(this.inputDownEvent, this._onStartDrag), window.removeEventListener(this.inputUpEventName, this._onStopDrag), window.removeEventListener(this.inputUpEventName, this._onStopDrag)
            }
        }
    }, {
        "@marcom/ac-raf-emitter/src/ac-raf-emitter/cancelDraw": 33,
        "@marcom/ac-raf-emitter/src/ac-raf-emitter/draw": 35
    }],
    110: [function (e, t, n) {
        "use strict";
        t.exports = {
            beforeCreate: function () {
                this.selections = {
                    initiated: {
                        current: null,
                        previous: null
                    },
                    occurred: {
                        current: null,
                        previous: null
                    },
                    completed: {
                        current: null,
                        previous: null
                    }
                }
            },
            onItemChangeInitiated: function (e) {
                this.selections.initiated.previous = e.previous = this.selections.initiated.current, this.selections.initiated.current = e.current
            },
            onItemChangeOccurred: function (e) {
                this.selections.occurred.previous = e.previous = this.selections.occurred.current, this.selections.occurred.current = e.current
            },
            onItemChangeCompleted: function (e) {
                this.selections.completed.previous = e.previous = this.selections.completed.current, this.selections.completed.current = e.current
            }
        }
    }, {}],
    111: [function (e, t, n) {
        "use strict";
        t.exports = {
            lerp: function (e, t, n) {
                return t + (n - t) * e
            },
            map: function (e, t, n, r, i) {
                return r + (i - r) * (e - t) / (n - t)
            },
            mapClamp: function (e, t, n, r, i) {
                var a = r + (i - r) * (e - t) / (n - t);
                return Math.max(r, Math.min(i, a))
            },
            norm: function (e, t, n) {
                return (e - t) / (n - t)
            },
            clamp: function (e, t, n) {
                return Math.max(t, Math.min(n, e))
            },
            randFloat: function (e, t) {
                return Math.random() * (t - e) + e
            },
            randInt: function (e, t) {
                return Math.floor(Math.random() * (t - e) + e)
            }
        }
    }, {}],
    112: [function (e, t, n) {
        "use strict";
        t.exports = {
            browser: {
                safari: !1,
                chrome: !1,
                firefox: !1,
                ie: !1,
                opera: !1,
                android: !1,
                edge: !1,
                version: {
                    string: "",
                    major: 0,
                    minor: 0,
                    patch: 0,
                    documentMode: !1
                }
            },
            os: {
                osx: !1,
                ios: !1,
                android: !1,
                windows: !1,
                linux: !1,
                fireos: !1,
                chromeos: !1,
                version: {
                    string: "",
                    major: 0,
                    minor: 0,
                    patch: 0
                }
            }
        }
    }, {}],
    113: [function (e, t, n) {
        "use strict";
        t.exports = {
            browser: [{
                name: "edge",
                userAgent: "Edge",
                version: ["rv", "Edge"],
                test: function (e) {
                    return e.ua.indexOf("Edge") > -1 || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" === e.ua
                }
            }, {
                name: "chrome",
                userAgent: "Chrome"
            }, {
                name: "firefox",
                test: function (e) {
                    return e.ua.indexOf("Firefox") > -1 && e.ua.indexOf("Opera") === -1
                },
                version: "Firefox"
            }, {
                name: "android",
                userAgent: "Android"
            }, {
                name: "safari",
                test: function (e) {
                    return e.ua.indexOf("Safari") > -1 && e.vendor.indexOf("Apple") > -1
                },
                version: "Version"
            }, {
                name: "ie",
                test: function (e) {
                    return e.ua.indexOf("IE") > -1 || e.ua.indexOf("Trident") > -1
                },
                version: ["MSIE", "rv"],
                parseDocumentMode: function () {
                    var e = !1;
                    return document.documentMode && (e = parseInt(document.documentMode, 10)), e
                }
            }, {
                name: "opera",
                userAgent: "Opera",
                version: ["Version", "Opera"]
            }],
            os: [{
                name: "windows",
                test: function (e) {
                    return e.ua.indexOf("Windows") > -1
                },
                version: "Windows NT"
            }, {
                name: "osx",
                userAgent: "Mac",
                test: function (e) {
                    return e.ua.indexOf("Macintosh") > -1
                }
            }, {
                name: "ios",
                test: function (e) {
                    return e.ua.indexOf("iPhone") > -1 || e.ua.indexOf("iPad") > -1
                },
                version: ["iPhone OS", "CPU OS"]
            }, {
                name: "linux",
                userAgent: "Linux",
                test: function (e) {
                    return (e.ua.indexOf("Linux") > -1 || e.platform.indexOf("Linux") > -1) && e.ua.indexOf("Android") === -1;
                }
            }, {
                name: "fireos",
                test: function (e) {
                    return e.ua.indexOf("Firefox") > -1 && e.ua.indexOf("Mobile") > -1
                },
                version: "rv"
            }, {
                name: "android",
                userAgent: "Android",
                test: function (e) {
                    return e.ua.indexOf("Android") > -1
                }
            }, {
                name: "chromeos",
                userAgent: "CrOS"
            }]
        }
    }, {}],
    114: [function (e, t, n) {
        "use strict";

        function r(e) {
            return new RegExp(e + "[a-zA-Z\\s/:]+([0-9_.]+)", "i")
        }

        function i(e, t) {
            if ("function" == typeof e.parseVersion) return e.parseVersion(t);
            var n = e.version || e.userAgent;
            "string" == typeof n && (n = [n]);
            for (var i, a = n.length, s = 0; s < a; s++)
                if (i = t.match(r(n[s])), i && i.length > 1) return i[1].replace(/_/g, ".");
            return !1
        }

        function a(e, t, n) {
            for (var r, a, s = e.length, o = 0; o < s; o++)
                if ("function" == typeof e[o].test ? e[o].test(n) === !0 && (r = e[o].name) : n.ua.indexOf(e[o].userAgent) > -1 && (r = e[o].name), r) {
                    if (t[r] = !0, a = i(e[o], n.ua), "string" == typeof a) {
                        var c = a.split(".");
                        t.version.string = a, c && c.length > 0 && (t.version.major = parseInt(c[0] || 0), t.version.minor = parseInt(c[1] || 0), t.version.patch = parseInt(c[2] || 0))
                    } else "edge" === r && (t.version.string = "12.0.0", t.version.major = "12", t.version.minor = "0", t.version.patch = "0");
                    return "function" == typeof e[o].parseDocumentMode && (t.version.documentMode = e[o].parseDocumentMode()), t
                } return t
        }

        function s(e) {
            var t = {};
            return t.browser = a(c.browser, o.browser, e), t.os = a(c.os, o.os, e), t
        }
        var o = e("./defaults"),
            c = e("./dictionary");
        t.exports = s
    }, {
        "./defaults": 112,
        "./dictionary": 113
    }],
    115: [function (e, t, n) {
        "use strict";
        var r = {
            ua: window.navigator.userAgent,
            platform: window.navigator.platform,
            vendor: window.navigator.vendor
        };
        t.exports = e("./parseUserAgent")(r)
    }, {
        "./parseUserAgent": 114
    }],
    116: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = e("@marcom/ac-url/parseURL"),
            s = e("@marcom/ac-console/error"),
            o = e("@marcom/ac-console/log"),
            c = {
                requestMethod: "GET",
                timeout: 3e4
            };
        Object.freeze(c);
        var l = {
            response: null,
            xhr: null
        };
        Object.freeze(l);
        var u = {
            evt: null,
            xhr: null
        };
        Object.freeze(u);
        var h = "href",
            m = function () {
                function e(t, n) {
                    return r(this, e), t || "string" == typeof t ? (this._src = a(t)[h], this._opts = Object.assign({}, c, n), this._xhr = new XMLHttpRequest, this._promise = null, this._metrics = {
                        progress: 0,
                        totalAssetSize: null,
                        time: {
                            requested: null,
                            load: {
                                start: null,
                                end: null,
                                total: null
                            }
                        }
                    }, this._onLoadStart = this._onLoadStart.bind(this), this._onProgress = this._onProgress.bind(this), void(this._rejectData = this._rejectData.bind(this))) : void s("createXhr(src, opts), a src is required to create an XMLHttpRequest")
                }
                return i(e, null, [{
                    key: "isCORSRequest",
                    value: function (e) {
                        return window.location.hostname !== a(e).hostname
                    }
                }, {
                    key: "IS_SUPPORTED",
                    get: function () {
                        var e = window.XMLHttpRequest,
                            t = window.Promise,
                            n = e && "function" == typeof e,
                            r = t && "function" == typeof t;
                        return n && r
                    }
                }]), i(e, [{
                    key: "open",
                    value: function () {
                        0 === this._xhr.readyState && (this._xhr.open(this._opts.requestMethod, this._src, !0, this._opts.user, this._opts.password), this._setXhrProps(), o("XmlHttpRequest opened and properties set"))
                    }
                }, {
                    key: "send",
                    value: function (e) {
                        var t = this;
                        return e = void 0 === e ? null : e, this._promise ? this._promise : this._promise = new Promise(function (n, r) {
                            t._xhr.onprogress = t._onProgress, t._xhr.onloadstart = t._onLoadStart, t._xhr.onload = function (e) {
                                return t._onLoad(n, r, e)
                            }, t._xhr.ontimeout = function (e) {
                                return t._rejectData(r, e)
                            }, t._xhr.onerror = function (e) {
                                return t._rejectData(r, e)
                            }, t._xhr.onabort = function (e) {
                                return t._rejectData(r, e)
                            }, t._metrics.time.requested = Date.now(), t._xhr.send(e), o("XmlHttpRequest sent")
                        })
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        var e = this;
                        return 4 !== this._xhr.readyState && this._xhr.abort(), this._promise = this._promise || Promise.resolve(), this._promise.then(function () {
                            e._nullifyConstructorProps()
                        }, function () {
                            e._nullifyConstructorProps()
                        }).then(function () {
                            return Promise.resolve()
                        })
                    }
                }, {
                    key: "_nullifyConstructorProps",
                    value: function () {
                        this._src = null, this._metrics = {
                            progress: null,
                            totalAssetSize: null,
                            time: {
                                requested: null,
                                load: {
                                    start: null,
                                    end: null,
                                    total: null
                                }
                            }
                        }
                    }
                }, {
                    key: "_calcTotalLoadTime",
                    value: function () {
                        this._metrics.time.load.end = Date.now(), this._metrics.time.load.total = this._metrics.time.load.end - this._metrics.time.load.start
                    }
                }, {
                    key: "_setXhrProps",
                    value: function () {
                        var e = this;
                        Object.keys(this._opts).forEach(function (t) {
                            t in e._xhr && "function" != typeof e._xhr[t] && (e._xhr[t] = e._opts[t])
                        })
                    }
                }, {
                    key: "_onLoadStart",
                    value: function () {
                        this._metrics.time.load.start = Date.now(), this._metrics.progress = 0, o("XmlHttpRequest loading")
                    }
                }, {
                    key: "_onLoad",
                    value: function (e, t, n) {
                        var r = this._xhr.status;
                        if (200 !== r) return this._rejectData(t, n);
                        this._calcTotalLoadTime();
                        var i = Object.assign({}, l, {
                            response: this._xhr.response,
                            xhr: this._xhr
                        });
                        return o("XmlHttpRequest loaded"), e(i)
                    }
                }, {
                    key: "_onProgress",
                    value: function (e) {
                        this._metrics.totalAssetSize || (this._metrics.totalAssetSize = e.total), this._metrics.progress = e.total ? e.loaded / e.total : 0
                    }
                }, {
                    key: "_rejectData",
                    value: function (e, t) {
                        var n = Object.assign({}, u, {
                            evt: t,
                            xhr: this._xhr
                        });
                        return s("XhrRequest failed due to", n), e(n)
                    }
                }, {
                    key: "xhr",
                    get: function () {
                        return this._xhr
                    }
                }, {
                    key: "requestUrl",
                    get: function () {
                        return this._src
                    }
                }, {
                    key: "progress",
                    get: function () {
                        return this._metrics.progress
                    }
                }, {
                    key: "totalAssetSize",
                    get: function () {
                        return this._metrics.totalAssetSize
                    }
                }, {
                    key: "requestedAtTime",
                    get: function () {
                        return this._metrics.time.requested
                    }
                }, {
                    key: "loadStartTime",
                    get: function () {
                        return this._metrics.time.load.start
                    }
                }, {
                    key: "loadEndTime",
                    get: function () {
                        return this._metrics.time.load.end
                    }
                }, {
                    key: "totalLoadTime",
                    get: function () {
                        return this._metrics.time.load.total
                    }
                }]), e
            }();
        t.exports = m
    }, {
        "@marcom/ac-console/error": 19,
        "@marcom/ac-console/log": 21,
        "@marcom/ac-url/parseURL": 45
    }],
    117: [function (e, t, n) {
        function r(e) {
            var t = new Float32Array(16);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
        }
        t.exports = r
    }, {}],
    118: [function (e, t, n) {
        function r() {
            var e = new Float32Array(16);
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e
        }
        t.exports = r
    }, {}],
    119: [function (e, t, n) {
        function r(e, t) {
            var n = t[0],
                r = t[1],
                i = t[2],
                a = t[3],
                s = t[4],
                o = t[5],
                c = t[6],
                l = t[7],
                u = t[8],
                h = t[9],
                m = t[10],
                d = t[11],
                f = t[12],
                p = t[13],
                v = t[14],
                y = t[15],
                b = n * o - r * s,
                g = n * c - i * s,
                _ = n * l - a * s,
                E = r * c - i * o,
                w = r * l - a * o,
                x = i * l - a * c,
                I = u * p - h * f,
                O = u * v - m * f,
                A = u * y - d * f,
                S = h * v - m * p,
                T = h * y - d * p,
                k = m * y - d * v,
                P = b * k - g * T + _ * S + E * A - w * O + x * I;
            return P ? (P = 1 / P, e[0] = (o * k - c * T + l * S) * P, e[1] = (i * T - r * k - a * S) * P, e[2] = (p * x - v * w + y * E) * P, e[3] = (m * w - h * x - d * E) * P, e[4] = (c * A - s * k - l * O) * P, e[5] = (n * k - i * A + a * O) * P, e[6] = (v * _ - f * x - y * g) * P, e[7] = (u * x - m * _ + d * g) * P, e[8] = (s * T - o * A + l * I) * P, e[9] = (r * A - n * T - a * I) * P, e[10] = (f * w - p * _ + y * b) * P, e[11] = (h * _ - u * w - d * b) * P, e[12] = (o * O - s * S - c * I) * P, e[13] = (n * S - r * O + i * I) * P, e[14] = (p * g - f * E - v * b) * P, e[15] = (u * E - h * g + m * b) * P, e) : null
        }
        t.exports = r
    }, {}],
    120: [function (e, t, n) {
        function r(e, t, n) {
            var r = Math.sin(n),
                i = Math.cos(n),
                a = t[4],
                s = t[5],
                o = t[6],
                c = t[7],
                l = t[8],
                u = t[9],
                h = t[10],
                m = t[11];
            return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = a * i + l * r, e[5] = s * i + u * r, e[6] = o * i + h * r, e[7] = c * i + m * r, e[8] = l * i - a * r, e[9] = u * i - s * r, e[10] = h * i - o * r, e[11] = m * i - c * r, e
        }
        t.exports = r
    }, {}],
    121: [function (e, t, n) {
        function r(e, t, n) {
            var r = Math.sin(n),
                i = Math.cos(n),
                a = t[0],
                s = t[1],
                o = t[2],
                c = t[3],
                l = t[8],
                u = t[9],
                h = t[10],
                m = t[11];
            return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * i - l * r, e[1] = s * i - u * r, e[2] = o * i - h * r, e[3] = c * i - m * r, e[8] = a * r + l * i, e[9] = s * r + u * i, e[10] = o * r + h * i, e[11] = c * r + m * i, e
        }
        t.exports = r
    }, {}],
    122: [function (e, t, n) {
        function r(e, t, n) {
            var r = Math.sin(n),
                i = Math.cos(n),
                a = t[0],
                s = t[1],
                o = t[2],
                c = t[3],
                l = t[4],
                u = t[5],
                h = t[6],
                m = t[7];
            return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * i + l * r, e[1] = s * i + u * r, e[2] = o * i + h * r, e[3] = c * i + m * r, e[4] = l * i - a * r, e[5] = u * i - s * r, e[6] = h * i - o * r, e[7] = m * i - c * r, e
        }
        t.exports = r
    }, {}],
    123: [function (e, t, n) {
        function r(e, t, n) {
            var r = n[0],
                i = n[1],
                a = n[2];
            return e[0] = t[0] * r, e[1] = t[1] * r, e[2] = t[2] * r, e[3] = t[3] * r, e[4] = t[4] * i, e[5] = t[5] * i, e[6] = t[6] * i, e[7] = t[7] * i, e[8] = t[8] * a, e[9] = t[9] * a, e[10] = t[10] * a, e[11] = t[11] * a, e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e
        }
        t.exports = r
    }, {}],
    124: [function (e, t, n) {
        function r(e, t) {
            if (e === t) {
                var n = t[1],
                    r = t[2],
                    i = t[3],
                    a = t[6],
                    s = t[7],
                    o = t[11];
                e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = n, e[6] = t[9], e[7] = t[13], e[8] = r, e[9] = a, e[11] = t[14], e[12] = i, e[13] = s, e[14] = o
            } else e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15];
            return e
        }
        t.exports = r
    }, {}],
    125: [function (e, t, n) {
        function r() {
            var e = new Float32Array(3);
            return e[0] = 0, e[1] = 0, e[2] = 0, e
        }
        t.exports = r
    }, {}],
    126: [function (e, t, n) {
        function r(e, t, n) {
            var r = t[0],
                i = t[1],
                a = t[2],
                s = n[0],
                o = n[1],
                c = n[2];
            return e[0] = i * c - a * o, e[1] = a * s - r * c, e[2] = r * o - i * s, e
        }
        t.exports = r
    }, {}],
    127: [function (e, t, n) {
        function r(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2]
        }
        t.exports = r
    }, {}],
    128: [function (e, t, n) {
        function r(e, t, n) {
            var r = new Float32Array(3);
            return r[0] = e, r[1] = t, r[2] = n, r
        }
        t.exports = r
    }, {}],
    129: [function (e, t, n) {
        function r(e) {
            var t = e[0],
                n = e[1],
                r = e[2];
            return Math.sqrt(t * t + n * n + r * r)
        }
        t.exports = r
    }, {}],
    130: [function (e, t, n) {
        function r(e, t) {
            var n = t[0],
                r = t[1],
                i = t[2],
                a = n * n + r * r + i * i;
            return a > 0 && (a = 1 / Math.sqrt(a), e[0] = t[0] * a, e[1] = t[1] * a, e[2] = t[2] * a), e
        }
        t.exports = r
    }, {}],
    131: [function (e, t, n) {
        function r() {
            var e = new Float32Array(4);
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e
        }
        t.exports = r
    }, {}],
    132: [function (e, t, n) {
        function r(e, t, n, r) {
            var i = new Float32Array(4);
            return i[0] = e, i[1] = t, i[2] = n, i[3] = r, i
        }
        t.exports = r
    }, {}],
    133: [function (e, t, n) {
        function r(e, t, n) {
            var r = t[0],
                i = t[1],
                a = t[2],
                s = t[3];
            return e[0] = n[0] * r + n[4] * i + n[8] * a + n[12] * s, e[1] = n[1] * r + n[5] * i + n[9] * a + n[13] * s, e[2] = n[2] * r + n[6] * i + n[10] * a + n[14] * s, e[3] = n[3] * r + n[7] * i + n[11] * a + n[15] * s, e
        }
        t.exports = r
    }, {}],
    134: [function (e, t, n) {
        "use strict";

        function r(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                return n
            }
            return Array.from(e)
        }

        function i(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function a(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var o = function m(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : m(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            c = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            l = e("@marcom/bubble-gum/BaseComponent"),
            u = e("@marcom/feature-detect/prefersReducedMotion"),
            h = function (e) {
                function t(e) {
                    i(this, t);
                    var n = a(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.elements = {
                        imagePurple: n.el.querySelector(".image-battery-purple"),
                        imageGreen: n.el.querySelector(".image-battery-green"),
                        imageYellow: n.el.querySelector(".image-battery-yellow"),
                        imageWhite: n.el.querySelector(".image-battery-white"),
                        imageBlack: n.el.querySelector(".image-battery-black"),
                        imageRed: n.el.querySelector(".image-battery-red")
                    }, n.defaultAnchors = [n.el], n.start = "t - 80vh", n.end = "t - 35vh", n.initializeKeyframes(), n
                }
                return s(t, e), c(t, null, [{
                    key: "IS_SUPPORTED",
                    value: function () {
                        return !u() && !document.documentElement.classList.contains("ie")
                    }
                }]), c(t, [{
                    key: "initializeKeyframes",
                    value: function () {
                        var e = this;
                        [this.elements.imagePurple, this.elements.imageGreen, this.elements.imageYellow, this.elements.imageWhite, this.elements.imageBlack, this.elements.imageRed].forEach(function (t) {
                            e.addKeyframe({
                                el: t,
                                start: "t - 120vh",
                                end: "b + 50vh",
                                cssClass: "will-change"
                            })
                        }), this.colorKeyframe(this.elements.imagePurple, "purple"), this.colorKeyframe(this.elements.imageGreen, "green"), this.colorKeyframe(this.elements.imageYellow, "yellow"), this.colorKeyframe(this.elements.imageWhite, "white"), this.colorKeyframe(this.elements.imageBlack, "black"), this.colorKeyframe(this.elements.imageRed, "red")
                    }
                }, {
                    key: "colorKeyframe",
                    value: function (e, t) {
                        this.addKeyframe({
                            el: e,
                            x: ["css(--distance-" + t + ")", 0],
                            easingFunction: "easeOutQuad"
                        })
                    }
                }, {
                    key: "addKeyframe",
                    value: function (e) {
                        e = Object.assign({}, {
                            start: this.start,
                            end: this.end
                        }, e), e.anchors = [].concat(r(this.defaultAnchors), r(e.anchors || [])), o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "addKeyframe", this).call(this, e)
                    }
                }]), t
            }(l);
        t.exports = h
    }, {
        "@marcom/bubble-gum/BaseComponent": 68,
        "@marcom/feature-detect/prefersReducedMotion": 85
    }],
    135: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/bubble-gum/BaseComponent"),
            c = e("@marcom/feature-detect/prefersReducedMotion"),
            l = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.addKeyframe({
                        anchors: [n.el.querySelector(".camera-lenses-iphone")],
                        start: "a0t - 30vh",
                        cssClass: "camera-lenses-show",
                        toggle: !0,
                        breakpointMask: "LM"
                    }), [n.el.querySelector(".image-camera-lenses-iphone"), n.el.querySelector(".camera-lenses-housing")].forEach(function (e) {
                        var t = {
                            el: e,
                            anchors: [n.el.querySelector(".camera-lenses-iphone")],
                            start: "a0t - 100vh",
                            end: "a0b"
                        };
                        n.addKeyframe(Object.assign({
                            y: [100, -50],
                            breakpointMask: "L"
                        }, t)), n.addKeyframe(Object.assign({
                            y: [50, -50],
                            breakpointMask: "M"
                        }, t)), e.style.willChange = "transform"
                    }), n.addKeyframe({
                        el: n.el.querySelector(".image-camera-lenses-iphone"),
                        start: "t - 100vh",
                        end: "b",
                        y: [50, -50],
                        breakpointMask: "S"
                    }), n.onBreakpointChange(n.pageMetrics), n
                }
                return a(t, e), s(t, null, [{
                    key: "IS_SUPPORTED",
                    value: function () {
                        return !c()
                    }
                }]), s(t, [{
                    key: "onBreakpointChange",
                    value: function (e) {
                        document.documentElement.classList.toggle("camera-lenses", "S" !== e.breakpoint)
                    }
                }]), t
            }(o);
        t.exports = l
    }, {
        "@marcom/bubble-gum/BaseComponent": 68,
        "@marcom/feature-detect/prefersReducedMotion": 85
    }],
    136: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/mixin-gallery/"),
            i = e("@marcom/mixin-gallery/mixins/KeyboardNavigation"),
            a = e("@marcom/mixin-gallery/mixins/DotNav"),
            s = e("@marcom/mixin-gallery/mixins/PaddleNav"),
            o = e("@marcom/mixin-gallery/mixins/SwipeDrag"),
            c = e("@marcom/mixin-gallery/mixins/Analytics"),
            l = e("@marcom/mixin-gallery/mixins/Slide"),
            u = e("@marcom/mixin-gallery/mixins/Fade"),
            h = e("@marcom/mixin-gallery/mixins/SelectDeselectOnChange"),
            m = void 0;
        try {
            m = e("@marcom/ac-analytics")
        } catch (d) {}
        var f = document.documentElement.classList.contains("reduced-motion"),
            p = function (e, t) {
                var n = void 0;
                return function () {
                    var r = this,
                        i = arguments,
                        a = function () {
                            return e.apply(r, i)
                        };
                    clearTimeout(n), n = setTimeout(a, t)
                }
            },
            v = {
                beforeCreate: function () {
                    this.model.IsTouch = document.documentElement.classList.contains("touch"), this.model.PrefersReducedMotion = f, this.model.IsRTL = "rtl" === document.documentElement.getAttribute("dir"), this.model.velocityMultiplier = 12, this.dotnav = this.el.querySelector(".dotnav"), this.paddlenav = this.el.querySelector(".paddlenav-container"), this.paddlenavPrevious = this.paddlenav.querySelector(".paddlenav-arrow-previous"), this.paddlenavNext = this.paddlenav.querySelector(".paddlenav-arrow-next"), this.colornavItems = Array.from(this.el.querySelectorAll(".colornav-item")).map(function (e) {
                        return e.querySelector(".colornav-link")
                    })
                },
                mounted: function () {
                    this.setupColornav(), this.el.classList.add("mounted"), this.allColorDevices = this._items.reduce(function (e, t) {
                        return e = e.concat(Array.from(t.el.querySelectorAll(".images-hardware-scaler")))
                    }, []), this.anim.getGroupForTarget(this.el).addKeyframe(this.el, {
                        start: "t - 100vh",
                        end: "b + 100%",
                        cssClass: "engaged",
                        toggle: !0
                    }), this.onBreakpointChange(this.model.pageMetrics)
                },
                setColor: function (e, t) {
                    t !== this.colornavSelected && (m && this.colornavSelected && m.track({
                        title: "colornav item " + t,
                        prop3: "color picker - " + t + " - finishes-gallery-slide-" + this.itemIndex.current
                    }), this.el.classList.remove("color-" + this.colornavSelected), this.el.classList.add("color-" + t), this.colornavSelected = t, this.setColorTabNav(e), this.setGalleryTheme())
                },
                setColorTabNav: function (e) {
                    var t = this;
                    this.allColorDevices.forEach(function (e) {
                        e.className.includes(t.colornavSelected) && e.classList.remove("hide")
                    }), e.classList.add("current"), e.setAttribute("aria-selected", !0), e.parentElement.querySelector("input[type=radio]").setAttribute("checked", !0), this.currentTabNav && (this.currentTabNav.classList.remove("current"), this.currentTabNav.removeAttribute("aria-selected"), this.currentTabNav.parentElement.querySelector("input[type=radio]").removeAttribute("checked")), this.currentTabNav = e, this.colornavTimeout && clearTimeout(this.colornavTimeout), this.colornavTimeout = setTimeout(function () {
                        t.allColorDevices.forEach(function (e) {
                            e.className.includes(t.colornavSelected) ? e.classList.remove("hide") : e.classList.add("hide")
                        }), clearTimeout(t.colornavTimeout)
                    }, 600)
                },
                setupColornav: function () {
                    this.colornav = this.el.querySelector(".colornav"), this.setColor = this.setColor.bind(this);
                    var e = p(this.setColor, 200);
                    this.colornavItems.forEach(function (t, n) {
                        t.addEventListener("click", function (t) {
                            return e(t.currentTarget, t.currentTarget.getAttribute("data-color-value"))
                        }), 0 === n && e(t, t.getAttribute("data-color-value"));
                        var r = t.parentElement.querySelector(".colornav-value");
                        r.addEventListener("change", function (t) {
                            var n = t.currentTarget.parentElement.querySelector(".colornav-link");
                            e(n, t.currentTarget.value)
                        })
                    })
                },
                setGalleryTheme: function () {
                    var e = this.wrappedIndex(this.itemIndex.current);
                    e % this._items.length === 1 ? this.el.classList.add("theme-dark") : 3 === e && "black" === this.colornavSelected && "S" !== this.model.pageMetrics.breakpoint ? (this.dotnav.classList.add("theme-dark"), this.paddlenav.classList.add("theme-dark")) : (this.el.classList.remove("theme-dark"), this.dotnav.classList.remove("theme-dark"), this.paddlenav.classList.remove("theme-dark"))
                },
                onItemChangeOccurred: function () {
                    this.setGalleryTheme()
                },
                onBreakpointChange: function (e) {
                    this.setGalleryTheme()
                }
            },
            y = [u, {
                beforeCreate: function () {
                    this.model.Item.ConstructorFunction = e("@marcom/mixin-gallery/Item"), this.model.Item.Selector = ".slide"
                }
            }],
            b = [l, {
                beforeCreate: function () {
                    this.model.Item.ConstructorFunction = e("./ParallaxItem"), this.model.Item.Selector = ".slide", this.model.Slide.Selector = ".finishes-gallery-container"
                }
            }],
            g = f ? y : b;
        t.exports = r.withMixins.apply(r, [c, i, s, a, o, h, v].concat(g))
    }, {
        "./ParallaxItem": 137,
        "@marcom/ac-analytics": void 0,
        "@marcom/mixin-gallery/": 93,
        "@marcom/mixin-gallery/Item": 94,
        "@marcom/mixin-gallery/mixins/Analytics": 96,
        "@marcom/mixin-gallery/mixins/DotNav": 99,
        "@marcom/mixin-gallery/mixins/Fade": 100,
        "@marcom/mixin-gallery/mixins/KeyboardNavigation": 103,
        "@marcom/mixin-gallery/mixins/PaddleNav": 105,
        "@marcom/mixin-gallery/mixins/SelectDeselectOnChange": 106,
        "@marcom/mixin-gallery/mixins/Slide": 108,
        "@marcom/mixin-gallery/mixins/SwipeDrag": 109
    }],
    137: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/mixin-gallery/Item"),
            c = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.figure = n.el.querySelector(".figure-container"), n
                }
                return a(t, e), s(t, [{
                    key: "progress",
                    value: function (e) {
                        Math.abs(e) <= 1 && (this.figure.style.transform = "translateX(" + 80 * -e + "%)")
                    }
                }]), t
            }(o);
        t.exports = c
    }, {
        "@marcom/mixin-gallery/Item": 94
    }],
    138: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function s(e) {
            !m && h && h.passiveTracker && (m = !0, h.passiveTracker({
                eVar70: e
            }))
        }
        var o = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            c = e("@marcom/bubble-gum/BaseComponent"),
            l = e("@marcom/anim-system/AnimSystem"),
            u = {
                update: e("@marcom/ac-raf-emitter/update"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            h = void 0,
            m = void 0;
        try {
            h = e("@marcom/ac-analytics")
        } catch (d) {}
        document.documentElement.classList.contains("reduced-motion") && s("hero-image-static");
        var f = function (e) {
            function t(e) {
                r(this, t);
                var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return n.options = e, n.elements = {
                    globalNav: document.querySelector("#ac-globalnav"),
                    video: n.el.querySelector("#hero-video"),
                    startTitle: n.el.querySelector(".hero-title-start"),
                    deviceContainer: n.el.querySelector(".device-container"),
                    hardwareContainer: n.el.querySelector(".hardware-container"),
                    hardwareWrapper: n.el.querySelector(".hardware-wrapper"),
                    screen: n.el.querySelector(".hardware-container .screen"),
                    stickyContainer: n.el.querySelector(".sticky-container"),
                    endFrame: n.el.querySelector(".hardware-endframe"),
                    heroContent: n.el.querySelector(".hero-content")
                }, n
            }
            return a(t, e), o(t, null, [{
                key: "IS_SUPPORTED",
                value: function () {
                    return document.documentElement.classList.contains("hero-enhanced")
                }
            }]), o(t, [{
                key: "mounted",
                value: function () {
                    this.prepareAnimation()
                }
            }, {
                key: "getHeroMargins",
                value: function () {
                    var e = this.options.pageMetrics.windowHeight,
                        t = this.options.pageMetrics.windowWidth,
                        n = this.elements.deviceContainer.getBoundingClientRect().width,
                        r = this.elements.deviceContainer.getBoundingClientRect().height,
                        i = this.elements.endFrame.getBoundingClientRect().height,
                        a = Math.min((e - 150) / r, (t - 150) / n),
                        s = -Math.round((this.options.pageMetrics.windowHeight - i * a) / 2),
                        o = this.options.pageMetrics.breakpoint;
                    return s += "L" === o ? 106 : "M" === o ? 146 : 122, s > 0 && (s = 0), s
                }
            }, {
                key: "setHeroMargins",
                value: function () {
                    this.elements.heroContent.style.marginTop = this.getHeroMargins() + "px"
                }
            }, {
                key: "getScaleExpr",
                value: function () {
                    var e = this.options.pageMetrics.breakpoint,
                        t = null;
                    return t = "S" === e ? "max(190vw/80w / css(--device-scale-expr, a1), 120vh/90h / css(--device-scale-expr, a1)) * css(--device-scale-expr)" : "max(190vw/80w / css(--device-scale-expr, a1), 220vh/80h / css(--device-scale-expr, a1)) * css(--device-scale-expr)"
                }
            }, {
                key: "onResizeDebounced",
                value: function () {
                    this.setHeroMargins(), this.animationIsTriggered || this.scaleKeyframe.overwriteProps({
                        scale: [this.getScaleExpr(), "css(--device-scale-expr)"]
                    })
                }
            }, {
                key: "prepareAnimation",
                value: function () {
                    var e = this,
                        t = this.gum.getComponentOfType("VideoViewportSource");
                    t.hasPlayed = !0;
                    var n = "25a3h * max(190vw/80w / css(--device-scale-expr, a1), 220vh/100a3h / css(--device-scale-expr, a1)) * css(--device-scale-expr)",
                        r = !1;
                    this.elements.video.addEventListener("canplaythrough", function (e) {
                        r = !0
                    }), this.elements.video.addEventListener("ended", function (t) {
                        e.elements.endFrame.classList.add("swap")
                    }), this.scaleKeyframe = this.addKeyframe({
                        el: this.elements.deviceContainer,
                        start: "a0t",
                        end: "a0t + 100vh",
                        scale: [this.getScaleExpr(), "css(--device-scale-expr)"],
                        anchors: [".sticky-container", this.elements.deviceContainer, this.elements.globalNav, this.elements.hardwareWrapper]
                    });
                    var i = this.addKeyframe({
                            el: this.elements.deviceContainer,
                            start: "a0t",
                            end: "a0t + 100vh",
                            y: [n],
                            breakpointMask: "LM",
                            anchors: [".sticky-container", this.elements.deviceContainer, this.elements.globalNav, this.elements.hardwareWrapper]
                        }),
                        a = (this.addKeyframe({
                            el: this.elements.deviceContainer,
                            start: "a0t",
                            end: "a0t + 100a1h",
                            y: ["50a1h", 0],
                            anchors: [".sticky-container", this.elements.globalNav]
                        }), this.addKeyframe({
                            el: this.elements.video,
                            start: "a0t - 50vh",
                            end: "a0t + 85vh",
                            toggle: !0,
                            cssClass: "extra-hidden",
                            anchors: [".sticky-container"],
                            disabledWhen: ["no-hero-screen-fix"]
                        })),
                        o = l.getGroupForTarget(this.el);
                    o.addKeyframe(this.elements.startTitle, {
                        start: 0,
                        end: "a0b + 100vh",
                        cssClass: "will-change",
                        anchors: [".sticky-container"]
                    }), o.addKeyframe(this.elements.startTitle, {
                        start: 0,
                        end: "a0t + 50vh",
                        scale: [.5, .3],
                        opacity: [1, 0],
                        easeFunction: "easeOutCubic",
                        anchors: [".sticky-container"]
                    }), o.addKeyframe(this.elements.startTitle, {
                        start: "a0t + 100vh",
                        cssClass: "hide-title",
                        anchors: [".sticky-container"],
                        toggle: !1
                    }), o.addKeyframe(this.elements.hardwareContainer, {
                        start: "a0t + 100vh - 50px",
                        end: "a0t + 100vh",
                        anchors: [".sticky-container"],
                        easeFunction: "easeInCubic",
                        opacity: [1, 0]
                    }), this.addDiscreteEvent({
                        group: o,
                        el: this.elements.video,
                        start: "a0t + 100vh",
                        anchors: [".sticky-container"],
                        onEventOnce: function (t) {
                            e.animationIsTriggered = !0, e.elements.video.currentTime = 0, e.elements.heroContent.classList.add("show"), e.setHeroMargins(), r ? (e.elements.video.play(), s("hero-image-enhanced")) : (e.elements.video.classList.add("hide"), e.elements.endFrame.classList.add("show"), s("hero-image-static")), i.remove(), u.update(function () {
                                a && a.remove()
                            }), e.elements.hardwareContainer.style.visibility = "hidden";
                            var n = e.scaleKeyframe.jsonProps.scale[1];
                            e.scaleKeyframe.overwriteProps({
                                scale: [n, n]
                            }), "ontouchstart" in document.documentElement || u.update(function () {
                                var t = 2 * e.elements.globalNav.getBoundingClientRect().height;
                                u.draw(function () {
                                    window.scrollTo(0, t), e.elements.stickyContainer.style.height = "115vh", l.forceUpdate()
                                }, !0)
                            }, !0)
                        }
                    }), l.getGroupForTarget(this.el).rafEmitter.once("draw", function () {
                        e.elements.deviceContainer.style.visibility = "visible"
                    })
                }
            }]), t
        }(c);
        t.exports = f
    }, {
        "@marcom/ac-analytics": void 0,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/update": 39,
        "@marcom/anim-system/AnimSystem": 48,
        "@marcom/bubble-gum/BaseComponent": 68
    }],
    139: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("./Modal"),
            c = e("@marcom/ac-raf-emitter/update"),
            l = e("@marcom/ac-raf-emitter/draw"),
            u = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.headline && n.headline.setAttribute("aria-hidden", !0), n._contentElement = n.el.querySelector(".inline-compare-panel"), n.transitioningElement = n._contentElement, n.scrim = n.el.querySelector(".inline-compare-scrim"), n.scrim.addEventListener("click", n.close, !0), n
                }
                return a(t, e), s(t, null, [{
                    key: "IS_SUPPORTED",
                    value: function () {
                        return window.CSSStyleDeclaration && "setProperty" in CSSStyleDeclaration.prototype
                    }
                }]), s(t, [{
                    key: "mounted",
                    value: function () {
                        this.cachePanelMetrics(), this.addKeyframe({
                            el: this.openButton,
                            anchors: [this.el.querySelector(".inline-compare-panel")],
                            start: "b - 100vh + css(padding-bottom, a0)",
                            cssClass: "show"
                        })
                    }
                }, {
                    key: "onResizeImmediate",
                    value: function () {
                        this.cachePanelMetrics()
                    }
                }, {
                    key: "cachePanelMetrics",
                    value: function () {
                        var e = this;
                        return new Promise(function (t) {
                            c(function () {
                                var n = e._contentElement.clientWidth;
                                e.buttonBottomOffset = parseFloat(window.getComputedStyle(e._contentElement).paddingBottom), l(function () {
                                    var e = n ? n + "px" : null;
                                    document.documentElement.classList.add("inline-compare-prevent-transition"), document.documentElement.style.setProperty("--inline-compare-actual-width", e), l(function () {
                                        document.documentElement.classList.remove("inline-compare-prevent-transition"), t()
                                    })
                                })
                            })
                        })
                    }
                }]), t
            }(o);
        t.exports = u
    }, {
        "./Modal": 142,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/update": 39
    }],
    140: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = e("@marcom/inline-video/bubble-gum/BaseInlineVideo"),
            o = "/iphone-11/2019/dc09a167-9d96-4ea8-935e-14af260ac4b1/anim/",
            c = function (e) {
                function t(e) {
                    return r(this, t), i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, o))
                }
                return a(t, e), t
            }(s);
        t.exports = c
    }, {
        "@marcom/inline-video/bubble-gum/BaseInlineVideo": 91
    }],
    141: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/bubble-gum/BaseComponent"),
            c = e("@marcom/ac-raf-emitter/update"),
            l = (e("@marcom/ac-raf-emitter/draw"), document.querySelector("#ac-localnav")),
            u = document.querySelector("#ac-localeswitcher"),
            h = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.cacheTopOffset().then(function (e) {
                        n.keyframe = n.anim.addKeyframe(l, {
                            anchors: [n.el],
                            start: "a0t - " + e + "px",
                            end: "a0b - 100%",
                            cssClass: "ac-localnav-dark",
                            toggle: !0
                        })
                    }), n
                }
                return a(t, e), s(t, [{
                    key: "IS_SUPPORTED",
                    value: function () {
                        return !!l;
                    }
                }]), s(t, [{
                    key: "onResizeDebounced",
                    value: function () {
                        var e = this;
                        this.cacheTopOffset().then(function (t) {
                            e.keyframe.overwriteProps({
                                start: "a0t - " + t + "px"
                            })
                        })
                    }
                }, {
                    key: "cacheTopOffset",
                    value: function () {
                        return new Promise(function (e) {
                            c(function () {
                                return c(function () {
                                    var t = l.clientHeight;
                                    u && (t += u.clientHeight), e(t)
                                })
                            })
                        })
                    }
                }]), t
            }(o);
        t.exports = h
    }, {
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/update": 39,
        "@marcom/bubble-gum/BaseComponent": 68
    }],
    142: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function i(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function a(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function s(e) {
            return function (t) {
                27 === t.keyCode && e()
            }
        }
        var o = function y(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : y(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            c = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            l = e("@marcom/bubble-gum/BaseComponent"),
            u = e("@marcom/ac-raf-emitter/update"),
            h = e("@marcom/ac-raf-emitter/draw"),
            m = e("@marcom/ac-accessibility/CircularTab"),
            d = "inert" in HTMLElement.prototype,
            f = document.getElementById("modals") || function () {
                var e = document.createElement("div");
                return e.id = "modals", document.body.appendChild(e), e
            }(),
            p = function () {
                function e() {
                    a(this, e)
                }
                return c(e, [{
                    key: "start",
                    value: function () {}
                }, {
                    key: "stop",
                    value: function () {}
                }, {
                    key: "destroy",
                    value: function () {}
                }]), e
            }(),
            v = function (e) {
                function t(e) {
                    a(this, t);
                    var n = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    if (n.el.parentElement !== f && f.appendChild(n.el), !n.el.id) throw new Error('Modal must have an "id".');
                    n.classes = {
                        documentModalOpen: "modal-open"
                    };
                    var i = n.el.querySelector("h3"),
                        o = document.createElement("h2");
                    o.innerHTML = i.innerHTML, i.parentElement.replaceChild(o, i);
                    for (var c = 0; c < i.attributes.length; c++) {
                        var l = i.attributes[c];
                        l.specified && o.setAttribute(l.name, l.value)
                    }
                    return n.headline = o, n._opened = !1, n.transitioningElement = null, n.openButton = document.querySelector('button[data-modal-open="' + n.el.id + '"]'), n.closeButtons = n.el.querySelectorAll("[data-modal-close]"), n.focusElement = n.el.querySelector("[data-modal-focus]") || n.el, n.focusElement.tabIndex = -1, n.focusElement.setAttribute("role", "dialog"), n.backgroundElements = document.querySelectorAll("[data-modal-background]"), n.tab = d ? new p : new m(n.focusElement, {
                        firstFocusElement: n.focusElement
                    }), n.open = n.open.bind(n), n.close = n.close.bind(n), n.openButton.addEventListener("click", n.open, !0), n.closeButtons.forEach(function (e) {
                        e.addEventListener("click", n.close, !0)
                    }), n._handleEscapeKeyPress = s(n.close), document.addEventListener("keydown", n._handleEscapeKeyPress, !0), n
                }
                return i(t, e), c(t, [{
                    key: "destroy",
                    value: function () {
                        var e = this;
                        this.openButton.removeEventListener("click", this.open), this.closeButtons.forEach(function (t) {
                            return t.addEventListener("click", e.close)
                        }), document.removeEventListener("keydown", this._handleEscapeKeyPress, !0), this.tab.destroy(), o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "open",
                    value: function () {
                        var e = this,
                            t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        return this._opened ? Promise.resolve() : (t instanceof Event && (t = {
                            event: t
                        }), this._openedFromElement = t.event && t.event.target, this._opened = !0, this._openedFromElement.hasAttribute("data-modal-open") || (this._openedFromElement = this._openedFromElement.closest("[data-modal-open]")), new Promise(function (t, n) {
                            h(function () {
                                e.tab.start(), e.updateDOM().then(function () {
                                    e.focusElement.focus(), t()
                                }, n)
                            })
                        }))
                    }
                }, {
                    key: "close",
                    value: function () {
                        var e = this;
                        return this._opened ? (this._opened = !1, new Promise(function (t, n) {
                            h(function () {
                                e.tab.stop(), e.updateDOM().then(function () {
                                    e._openedFromElement && e._openedFromElement.focus(), e._openedFromElement = null, t()
                                }, n)
                            })
                        })) : Promise.resolve()
                    }
                }, {
                    key: "lockScroll",
                    value: function () {
                        document.documentElement.style.overflow = this._opened ? "hidden" : null, document.documentElement.style.height = this._opened ? "100%" : null
                    }
                }, {
                    key: "updateDOM",
                    value: function () {
                        var e = this;
                        return new Promise(function (t) {
                            h(function () {
                                e.el.setAttribute("aria-modal", e._opened), e.el.setAttribute("aria-hidden", !e._opened), e.backgroundElements.forEach(function (t) {
                                    t.setAttribute("aria-hidden", e._opened), t.toggleAttribute("inert", e._opened)
                                }), e._opened && e.el.querySelectorAll("[data-anim-lazy-image]").forEach(function (e) {
                                    e.removeAttribute("data-anim-lazy-image")
                                }), e.el.id && (e._opened ? document.documentElement.setAttribute("data-modal-opened", e.el.id) : document.documentElement.removeAttribute("data-modal-opened"), e.transitioningElement && (document.documentElement.setAttribute("data-modal-transitioning", e.el.id), e.transitioningElement.addEventListener("transitionend", function (t) {
                                    t.target === e.transitioningElement && document.documentElement.removeAttribute("data-modal-transitioning")
                                }))), document.documentElement.classList.toggle(e.classes.documentModalOpen, e._opened), e.lockScroll(), u(function () {
                                    return void t()
                                })
                            })
                        })
                    }
                }]), t
            }(l);
        t.exports = v
    }, {
        "@marcom/ac-accessibility/CircularTab": 2,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/update": 39,
        "@marcom/bubble-gum/BaseComponent": 68
    }],
    143: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/bubble-gum/BaseComponent"),
            c = e("@marcom/feature-detect/prefersReducedMotion"),
            l = e("@marcom/anim-system/Parsing/ExpressionParser"),
            u = e("@marcom/useragent-detect"),
            h = .001,
            m = .999,
            d = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.elements = {
                        localnav: document.getElementById("ac-localnav"),
                        heroImage: n.el.querySelector(".image-night-mode-hero"),
                        headline: n.el.querySelector(".night-mode-headline"),
                        stickyCopy: n.el.querySelector(".sticky-vo-headline"),
                        comparisonContainer: n.el.querySelector(".night-mode-comparison"),
                        offImage: n.el.querySelector(".image-night-mode-off"),
                        onImage: n.el.querySelector(".image-night-mode-on")
                    }, Object.values(n.elements).forEach(function (e) {
                        e !== n.elements.localnav && n.addKeyframe({
                            el: e,
                            start: "t - 120vh",
                            end: "b + 50vh",
                            cssClass: "will-change",
                            toggle: !0
                        })
                    }), n.addKeyframe({
                        el: n.elements.heroImage,
                        anchors: [n.elements.headline, n.elements.localnav],
                        start: "t - 80vh",
                        end: "a0t + 50a0h - 50vh - a1h",
                        opacity: [h, m]
                    }), [n.elements.onImage, n.elements.offImage].forEach(function (e) {
                        n.addKeyframe({
                            el: e,
                            start: "t - 90vh",
                            end: "t - 50vh",
                            opacity: [h, m]
                        })
                    }), n.addKeyframe({
                        el: n.elements.comparisonContainer,
                        anchors: [n.elements.onImage],
                        start: "b - 95vh",
                        cssClass: "show-captions",
                        toggle: !0
                    }), n.elements.stickyCopy.addEventListener("focus", function (e) {
                        ["mouse", "touch"].includes(e.target.getAttribute("data-focus-method")) || n._voScroll()
                    }, !0), n
                }
                return a(t, e), s(t, null, [{
                    key: "IS_SUPPORTED",
                    value: function () {
                        return !c() && !document.documentElement.classList.contains("ie")
                    }
                }]), s(t, [{
                    key: "_voScroll",
                    value: function () {
                        var e = l.parse("t", {
                                target: this.elements.stickyCopy
                            }),
                            t = window.scrollTo.bind(null, 0, e);
                        u.browser.safari ? setTimeout(t, 100) : t()
                    }
                }]), t
            }(o);
        t.exports = d
    }, {
        "@marcom/anim-system/Parsing/ExpressionParser": 59,
        "@marcom/bubble-gum/BaseComponent": 68,
        "@marcom/feature-detect/prefersReducedMotion": 85,
        "@marcom/useragent-detect": 115
    }],
    144: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function s(e) {
            e && e.reason && "NotAllowedError" === e.reason.name && 0 === e.reason.stack.indexOf("play") && (m = !0)
        }
        var o = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            c = e("@marcom/bubble-gum/BaseComponent"),
            l = e("@marcom/ac-raf-emitter/draw"),
            u = window.matchMedia("(prefers-reduced-motion)"),
            h = u.matches,
            m = !1;
        window.addEventListener("unhandledrejection", s), window.addEventListener("rejectionhandled", s);
        var d = function (e) {
            function t(e) {
                r(this, t);
                var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                e.data = e.data || {}, n.loadingLabel = e.data.loadingLabel || n.el.dataset.loadingLabel, n.pauseLabel = e.data.pauseLabel || n.el.dataset.pauseLabel, n.playLabel = e.data.playLabel || n.el.dataset.playLabel;
                var a = void 0;
                if (Object.defineProperty(n, "mediaElement", {
                        get: function () {
                            return a
                        },
                        set: function (e) {
                            n.mediaElementDelegate && n.mediaElementDelegate.destroy(), e instanceof HTMLMediaElement && (n.mediaElementDelegate = new f(n, e))
                        }
                    }), n.el.dataset["for"]) {
                    var s = document.getElementById(n.el.dataset["for"]);
                    n.mediaElement = s.querySelector("video")
                }
                return n.analyticsClickTemplate = e.data.analyticsClickTemplate || n.el.dataset.analyticsClickTemplate, n.analyticsTitleTemplate = e.data.analyticsTitleTemplate || n.el.dataset.analyticsTitleTemplate, n._mediaStateWasPlaying = !1, n._appearanceInitialized = !1, n.mediaState = e.initialState || t.DefaultMediaState, n.remainARIAHidden = n.el.hasAttribute("data-always-aria-hidden"), n.onClick = n.onClick.bind(n), n.el.addEventListener("click", n.onClick, !1), u.addListener(function (e) {
                    h = e.matches, h && n.mediaState === t.MediaState.Playing && (n.mediaState = t.MediaState.Paused, n.trigger("pause"))
                }), n
            }
            return a(t, e), o(t, [{
                key: "destroy",
                value: function () {
                    this.mediaElementDelegate.destroy(), this.mediaElementDelegate = null, this.el.removeEventListener("click", this.onClick)
                }
            }, {
                key: "onClick",
                value: function () {
                    this.toggle(), this.mediaState === t.MediaState.Playing ? (this.mediaElementDelegate && this.mediaElementDelegate.onPlayControlActivated(), this.trigger("play")) : this.mediaState === t.MediaState.Paused && this.trigger("pause"), this.updateAppearance()
                }
            }, {
                key: "toggle",
                value: function () {
                    this.mediaState === t.MediaState.Paused ? this.mediaState = t.MediaState.Playing : this.mediaState === t.MediaState.Playing && (this.mediaState = t.MediaState.Paused)
                }
            }, {
                key: "updateAppearance",
                value: function () {
                    var e = this;
                    l(function () {
                        e._appearanceInitialized || e.remainARIAHidden || e.el.removeAttribute("aria-hidden");
                        var n = e.mediaState === t.MediaState.Loading;
                        e.el.disabled = n, e.el.setAttribute("aria-label", e.ariaLabel), e.el.classList.toggle("is-loading", n), e.el.classList.toggle("is-playing", e.mediaState === t.MediaState.Playing), e.el.classList.toggle("is-paused", e.mediaState === t.MediaState.Paused), e.setAnalyticsAttributes()
                    })
                }
            }, {
                key: "setAnalyticsAttributes",
                value: function () {
                    var e = void 0;
                    return this.mediaState === t.MediaState.Playing ? e = "pause" : this.mediaState === t.MediaState.Paused && (e = "play"), e ? (this.el.setAttribute("data-analytics-click", this.analyticsClickTemplate.replace("{controlState}", e)), void this.el.setAttribute("data-analytics-title", this.analyticsTitleTemplate.replace("{controlState}", e))) : (this.el.removeAttribute("data-analytics-click"), void this.el.removeAttribute("data-analytics-title"))
                }
            }, {
                key: "mediaState",
                get: function () {
                    return this._mediaState
                },
                set: function (e) {
                    if ("boolean" == typeof e || e || (e = t.MediaState.Loading), !t.validMediaStates.includes(e)) {
                        var n = t.validMediaStates.map(function (e) {
                            return "'" + e + "'"
                        }).join(", ");
                        throw new Error(this.constructor.name + " 'mediaState' must be one of: " + n)
                    }
                    e === t.MediaState.Playing && (h && !this._mediaStateWasPlaying && (e = t.MediaState.Paused, this.trigger("pause")), this._mediaStateWasPlaying = !0), this._mediaState = e, this.updateAppearance()
                }
            }, {
                key: "ariaLabel",
                get: function () {
                    switch (this.mediaState) {
                        case t.MediaState.Loading:
                            return this.loadingLabel;
                        case t.MediaState.Playing:
                            return this.pauseLabel;
                        case t.MediaState.Paused:
                            return this.playLabel;
                        default:
                            return ""
                    }
                }
            }]), t
        }(c);
        d.MediaState = Object.freeze({
            Loading: "loading",
            Playing: "playing",
            Paused: "paused"
        }), d.validMediaStates = Object.freeze(Object.keys(d.MediaState).map(function (e) {
            return d.MediaState[e]
        }));
        var f = function () {
            function e(t, n) {
                r(this, e), this.element = n, this.controls = t, this.lastUserInitiatedState = null, this.lastEventWasUserInteraction = !1, this.onMediaLoading = this.onMediaLoading.bind(this), this.onMediaPlay = this.onMediaPlay.bind(this), this.onMediaPause = this.onMediaPause.bind(this), this.onPlayControlActivated = this.onPlayControlActivated.bind(this), this.onPauseControlActivated = this.onPauseControlActivated.bind(this), this.element.addEventListener("emptied", this.onMediaLoading), this.element.addEventListener("waiting", this.onMediaLoading), this.element.addEventListener("canplay", this.onMediaPause), this.element.addEventListener("playing", this.onMediaPlay), this.element.addEventListener("pause", this.onMediaPause), this.controls.on("play", this.onPlayControlActivated), this.controls.on("pause", this.onPauseControlActivated), this.element.readyState >= 3 && (this.element.paused ? this.onMediaPause() : this.onMediaPlay()), this.onMediaLoading()
            }
            return o(e, [{
                key: "onMediaLoading",
                value: function () {
                    this.controls.mediaState = d.MediaState.Loading
                }
            }, {
                key: "onMediaPlay",
                value: function () {
                    !this.lastEventWasUserInteraction && ("pause" === this.lastUserInitiatedState || m && "play" !== this.lastUserInitiatedState) ? this.element.pause() : this.controls.mediaState = d.MediaState.Playing, this.lastEventWasUserInteraction = !1
                }
            }, {
                key: "onMediaPause",
                value: function () {
                    this.controls.mediaState = d.MediaState.Paused, this.lastEventWasUserInteraction = !1
                }
            }, {
                key: "onPlayControlActivated",
                value: function () {
                    this.lastEventWasUserInteraction = !0, this.lastUserInitiatedState = "play", this.element.play()
                }
            }, {
                key: "onPauseControlActivated",
                value: function () {
                    this.lastEventWasUserInteraction = !0, this.lastUserInitiatedState = "pause", this.element.pause()
                }
            }, {
                key: "destroy",
                value: function () {
                    this.element.removeEventListener("emptied", this.onMediaLoading), this.element.removeEventListener("waiting", this.onMediaLoading), this.element.removeEventListener("canplay", this.onMediaPause), this.element.removeEventListener("playing", this.onMediaPlay), this.element.removeEventListener("pause", this.onMediaPause), this.controls.off("play", this.onPlayControlActivated), this.controls.off("pause", this.onPauseControlActivated), this.element = null, this.controls = null
                }
            }]), e
        }();
        t.exports = d
    }, {
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/bubble-gum/BaseComponent": 68
    }],
    145: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/feature-detect/prefersReducedMotion"),
            i = e("@marcom/mixin-gallery/"),
            a = e("@marcom/mixin-gallery/mixins/KeyboardNavigation"),
            s = e("@marcom/mixin-gallery/mixins/SwipeDrag"),
            o = e("@marcom/mixin-gallery/mixins/PaddleNav"),
            c = e("@marcom/mixin-gallery/mixins/DotNav"),
            l = e("@marcom/mixin-gallery/mixins/Slide"),
            u = e("@marcom/mixin-gallery/mixins/Analytics"),
            h = e("@marcom/mixin-gallery/mixins/SelectDeselectOnChange"),
            m = {
                beforeCreate: function () {
                    this.model.IsTouch = document.documentElement.classList.contains("touch"), this.model.PrefersReducedMotion = r(), this.model.IsRTL = "rtl" === document.documentElement.getAttribute("dir"), this.model.Item.ConstructorFunction = e("@marcom/mixin-gallery/Item"), this.model.Item.Selector = ".slide-gallery-item", this.model.Slide.Selector = ".slide-gallery-items-container"
                },
                mounted: function () {
                    this.anim.getGroupForTarget(this.el).addKeyframe(this.el, {
                        start: "t - 100vh",
                        end: "b + 100%",
                        cssClass: "engaged",
                        toggle: !0
                    })
                }
            };
        t.exports = i.withMixins(m, o, c, a, s, u, h, l)
    }, {
        "@marcom/feature-detect/prefersReducedMotion": 85,
        "@marcom/mixin-gallery/": 93,
        "@marcom/mixin-gallery/Item": 94,
        "@marcom/mixin-gallery/mixins/Analytics": 96,
        "@marcom/mixin-gallery/mixins/DotNav": 99,
        "@marcom/mixin-gallery/mixins/KeyboardNavigation": 103,
        "@marcom/mixin-gallery/mixins/PaddleNav": 105,
        "@marcom/mixin-gallery/mixins/SelectDeselectOnChange": 106,
        "@marcom/mixin-gallery/mixins/Slide": 108,
        "@marcom/mixin-gallery/mixins/SwipeDrag": 109
    }],
    146: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = e("@marcom/bubble-gum/BaseComponent"),
            c = e("@marcom/ac-raf-emitter/draw"),
            l = function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                return "a0t + " + (100 - e) + "vh"
            },
            u = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    if (n.elements = {
                            videoContainer: n.el.querySelector(".inline-video-container"),
                            phoneFrame: n.el.querySelector(".phone-frame"),
                            scrim: n.el.querySelector(".scrim"),
                            phone: n.el.querySelector(".phone-frame"),
                            gallery: n.el.querySelector(".subsection-gallery"),
                            segmentnav: n.el.querySelector(".segmentnav-container"),
                            playbackControl: n.el.parentElement.querySelector(".playback-control-container:not(.visuallyhidden)"),
                            hiddenPlaybackControl: n.el.parentElement.querySelector(".playback-control-container.visuallyhidden .playback-control")
                        }, n.elements.hiddenPlaybackControl) {
                        var a = n.elements.playbackControl.querySelector(".playback-control");
                        n.elements.hiddenPlaybackControl.addEventListener("focus", function () {
                            return a.classList.add("has-focus")
                        }), n.elements.hiddenPlaybackControl.addEventListener("blur", function () {
                            return a.classList.remove("has-focus")
                        })
                    }
                    return n
                }
                return a(t, e), s(t, [{
                    key: "mounted",
                    value: function () {
                        var e = this,
                            t = this.gum.getComponentOfType("InlineVideo", this.el);
                        c(function () {
                            var n = t.video,
                                r = t.keyframeController,
                                i = r.getNearestKeyframeForAttribute("inline-video-play");
                            i.remove();
                            var a = "." + e.el.className;
                            n.el && n.el.removeAttribute("aria-label"), e.addDiscreteEvent({
                                start: "a0t - 85vh",
                                end: l(),
                                event: "video-event",
                                anchors: a,
                                onEnter: function () {
                                    n.el.setAttribute("loop", ""), n.play()
                                },
                                onExit: function () {
                                    n.el.removeAttribute("loop"), n.pause()
                                }
                            }), e.addKeyframe({
                                el: e.el,
                                start: "a0t - 100vh",
                                end: "a0t + 35vh",
                                cssClass: "show-scrim",
                                toggle: !0,
                                anchors: a
                            }), e.addKeyframe({
                                el: e.elements.scrim,
                                start: "a0t + 35vh",
                                end: "a0t + 45vh",
                                opacity: [.5, 0],
                                anchors: a
                            }), e.addKeyframe({
                                el: e.elements.playbackControl,
                                start: "a0t + 33vh",
                                end: "a0t + 35vh",
                                opacity: [1, 0],
                                anchors: a
                            }), e.addKeyframe({
                                el: e.elements.phoneFrame,
                                start: "a0t + 35vh",
                                end: "a0t + 90vh",
                                scale: ["max(105vw/85w, 105vh/85h)", 1],
                                anchors: a
                            }), e.addKeyframe({
                                el: e.elements.videoContainer,
                                start: l(10),
                                end: l(),
                                scale: [null, 1],
                                opacity: [1, 0],
                                anchors: a
                            }), e.addKeyframe({
                                el: e.elements.segmentnav,
                                start: l(),
                                end: "a0b + 100vh",
                                cssClass: "active",
                                toggle: !0,
                                anchors: a
                            }), e.addKeyframe({
                                el: e.elements.segmentnav,
                                start: l(10),
                                end: l(0),
                                y: [40, 0],
                                opacity: [null, 1],
                                anchors: a
                            })
                        })
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function () {
                        return document.documentElement.classList.contains("video-edit-intro")
                    }
                }]), t
            }(o);
        t.exports = u
    }, {
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/bubble-gum/BaseComponent": 68
    }],
    147: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/ac-accessibility/src/RoamingTabIndex"),
            i = e("@marcom/ac-accessibility/src/maps/ariaMap"),
            a = e("@marcom/ac-accessibility/src/maps/roleMap"),
            s = e("@marcom/ac-raf-emitter/update"),
            o = e("@marcom/ac-raf-emitter/draw"),
            c = e("@marcom/useragent-detect");
        t.exports = {
            created: function () {
                this.segmentNav = {
                    items: [],
                    current: null,
                    roamingTabIndex: null,
                    segments: new Map,
                    segmentNavEl: this.el.querySelector(".segmentnav"),
                    setCurrentItem: function (e) {
                        e !== this.segmentNav.current && (this.segmentNav.current = e, this.selection = e, this._updateSelectionBackground(this.segmentNav.segments.get(this.selection)))
                    },
                    onRoamingTabIndexSelect: function (e) {
                        var t = this.segmentNav.items.filter(function (t) {
                            return t === e.el
                        });
                        if (0 === t.length) throw "Could not find segment nav item";
                        this.lastInteractionEvent || (this.lastInteractionEvent = e), this.itemIndex.current !== e.index && this.animateToItem(e.index)
                    }
                }, this.segmentNav.setCurrentItem = this.segmentNav.setCurrentItem.bind(this), this.segmentNav.onRoamingTabIndexSelect = this.segmentNav.onRoamingTabIndexSelect.bind(this)
            },
            itemsCreated: function () {
                var e = this;
                this._items.forEach(function (t, n) {
                    var r = e.segmentNav.segmentNavEl.querySelector("#" + t.id.replace("gallery-item", "segment"));
                    r.setAttribute("role", a.TAB), r.setAttribute(i.CONTROLS, t.id), r.setAttribute(i.SELECTED, !1), t.on("select", function () {
                        r.classList.add("current"), r.setAttribute(i.SELECTED, !0)
                    }), t.on("deselect", function () {
                        r.classList.remove("current"), r.setAttribute(i.SELECTED, !1)
                    }), r.addEventListener("click", function (n) {
                        n.preventDefault(), e.lastInteractionEvent = n;
                        var r = e.itemIndex.current + (t.index - e.wrappedIndex(e.itemIndex.current));
                        e.animateToItem(r)
                    }), r.addEventListener("focus", function (t) {
                        ["mouse", "touch"].includes(t.target.getAttribute("data-focus-method")) || e._voScroll()
                    }, !0), e.segmentNav.items.push(r), t.el.setAttribute("role", a.TABPANEL), t.el.setAttribute(i.LABELLEDBY, e.segmentNav.items[n].id), e.segmentNav.segments.set(r, {
                        width: r.offsetWidth,
                        offset: r.offsetLeft
                    })
                }), this.selection = this.segmentNav.segmentNavEl.querySelector('.segmentnav-item[aria-selected="true"]'), this.selectionBackground = document.createElement("div"), this.selectionBackground.classList.add("segmentnav-selection-background"), this.selectionBackground.setAttribute("role", "presentation"), this.segmentNav.segmentNavEl.appendChild(this.selectionBackground), this._updateSelectionBackground(this.segmentNav.segments.get(this.selection))
            },
            mounted: function () {
                this.segmentNav.roamingTabIndex = new r(this.segmentNav.segmentNavEl, {
                    selector: "button"
                }), this.segmentNav.roamingTabIndex.start(), this.segmentNav.roamingTabIndex.on("onSelect", this.segmentNav.onRoamingTabIndexSelect)
            },
            onItemChangeInitiated: function (e) {
                e.next && this._updateSegment(e.next.id, e.next.index)
            },
            onItemChangeOccurred: function (e) {
                this._updateSegment(e.current.id, this.itemIndex.current)
            },
            _updateSegment: function (e, t) {
                if (!this.selection || e !== this.selection.id) {
                    var n = this.segmentNav.items.filter(function (t) {
                        return t.getAttribute("aria-controls") === e
                    })[0];
                    this.segmentNav.setCurrentItem(n), this.segmentNav.roamingTabIndex && this.segmentNav.roamingTabIndex.setSelectedItemByIndex(t, !0)
                }
            },
            _updateSelectionBackground: function (e) {
                var t = this;
                if (e) return new Promise(function (n, r) {
                    try {
                        s(function () {
                            var r = parseFloat(window.getComputedStyle(t.segmentNav.segmentNavEl).paddingLeft);
                            o(function () {
                                t.selectionBackground.style.width = e.width + "px", t.selectionBackground.style.transform = "translateX(" + (e.offset - r) + "px)", n()
                            })
                        })
                    } catch (i) {
                        r(i)
                    }
                })
            },
            _voScroll: function () {
                var e = this.anim.getGroupForTarget(this.el),
                    t = this.anim.getControllerForTarget(this.el),
                    n = t.getNearestKeyframeForAttribute("Gallery: In View"),
                    r = e.convertTValueToScrollPosition(n.start),
                    i = window.scrollTo.bind(null, 0, r);
                c.browser.safari ? setTimeout(i, 100) : i()
            }
        }
    }, {
        "@marcom/ac-accessibility/src/RoamingTabIndex": 3,
        "@marcom/ac-accessibility/src/maps/ariaMap": 14,
        "@marcom/ac-accessibility/src/maps/roleMap": 17,
        "@marcom/ac-raf-emitter/draw": 35,
        "@marcom/ac-raf-emitter/update": 39,
        "@marcom/useragent-detect": 115
    }],
    148: [function (e, t, n) {
        "use strict";
        t.exports = {
            onItemChangeInitiated: function (e) {
                if (e.next) {
                    var t = this.selections.initiated.previous;
                    t && t !== e.next && t.deselect(), e.next.select()
                }
            }
        }
    }, {}],
    149: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/feature-detect/prefersReducedMotion"),
            i = e("@marcom/mixin-gallery/"),
            a = e("@marcom/mixin-gallery/mixins/Fade"),
            s = e("@marcom/mixin-gallery/mixins/KeyboardNavigation"),
            o = e("@marcom/mixin-gallery/mixins/Analytics"),
            c = e("./SelectDeselectOnInitiate"),
            l = e("./SegmentedNav"),
            u = {
                beforeCreate: function () {
                    this.model.IsTouch = document.documentElement.classList.contains("touch"), this.model.PrefersReducedMotion = r(), this.model.IsRTL = "rtl" === document.documentElement.getAttribute("dir"), this.model.Item.ConstructorFunction = e("@marcom/mixin-gallery/Item")
                },
                beforeMount: function () {
                    var e = this;
                    if (this.inViewKeyframe) {
                        this.inViewKeyframe.remove();
                        var t = this.el.parentElement.parentElement.parentElement;
                        this.inViewKeyframe = this.addDiscreteEvent({
                            event: "Gallery: In View",
                            start: "a0b - 90vh",
                            end: "a0b + 100%",
                            anchors: "." + t.className,
                            onEnter: function () {
                                return window.addEventListener("keydown", e.onKeyDown)
                            },
                            onExit: function () {
                                return window.removeEventListener("keydown", e.onKeyDown)
                            }
                        })
                    }
                }
            };
        t.exports = i.withMixins(u, s, o, c, a, l)
    }, {
        "./SegmentedNav": 147,
        "./SelectDeselectOnInitiate": 148,
        "@marcom/feature-detect/prefersReducedMotion": 85,
        "@marcom/mixin-gallery/": 93,
        "@marcom/mixin-gallery/Item": 94,
        "@marcom/mixin-gallery/mixins/Analytics": 96,
        "@marcom/mixin-gallery/mixins/Fade": 100,
        "@marcom/mixin-gallery/mixins/KeyboardNavigation": 103
    }],
    150: [function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function () {
                function e(e, t) {
                    var n = [],
                        r = !0,
                        i = !1,
                        a = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(r = (s = o.next()).done) && (n.push(s.value), !t || n.length !== t); r = !0);
                    } catch (c) {
                        i = !0, a = c
                    } finally {
                        try {
                            !r && o["return"] && o["return"]()
                        } finally {
                            if (i) throw a
                        }
                    }
                    return n
                }
                return function (t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            o = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            c = function d(e, t, n) {
                null === e && (e = Function.prototype);
                var r = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === r) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : d(i, t, n)
                }
                if ("value" in r) return r.value;
                var a = r.get;
                if (void 0 !== a) return a.call(n)
            },
            l = e("@marcom/bubble-gum/BaseComponent"),
            u = 3,
            h = window.matchMedia("only screen and (min-width: 1441px)"),
            m = function (e) {
                function t(e) {
                    r(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.video = n.el, n.sources = {}, Object.entries(n.video.dataset).filter(function (e) {
                        var t = s(e, 1),
                            n = t[0];
                        return n.includes("src")
                    }).forEach(function (e) {
                        var t = s(e, 2),
                            r = t[0],
                            i = t[1],
                            a = r.replace(/^src/, "").toLowerCase();
                        n.sources[a] = i
                    }), n.onBreakpointChange = n.onBreakpointChange.bind(n), n._currentViewport = null, n.previousSource = null, n.hasPlayed = !1, n
                }
                return a(t, e), o(t, [{
                    key: "mounted",
                    value: function () {
                        var e = this;
                        h.addListener(this.onBreakpointChange);
                        var t = JSON.parse(this.el.getAttribute("data-load-keyframe") || "{}");
                        this.loadKeyframe = this.addDiscreteEvent(Object.assign({
                            event: "Video: Load",
                            start: "a0t - 200vh",
                            end: "a0b + 100vh",
                            anchors: [this.el],
                            onEnter: function () {
                                return e.load()
                            }
                        }, t));
                        var n = JSON.parse(this.el.getAttribute("data-play-keyframe") || "{}");
                        this.playKeyframe = this.addDiscreteEvent(Object.assign({
                            event: "Video: Play",
                            start: "a0t - 100vh",
                            end: "a0b",
                            anchors: [this.el],
                            onEnter: function () {
                                e.hasPlayed || (e.queueVideoPlayback(), e.hasPlayed = !0)
                            }
                        }, n)), this.currentViewport = this.pageMetrics.breakpoint
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this), this.loadKeyframe.remove(), this.loadKeyframe = null, this.playKeyframe.remove(), this.playKeyframe = null
                    }
                }, {
                    key: "load",
                    value: function (e) {
                        if (this.inLoadArea) {
                            e = e || this.currentViewport;
                            var t = this.sources[e];
                            this.isRetina && (t = t.replace(e, e + "_2x")), t && t !== this.previousSource && (this.video.autoplay = this.video.readyState >= u && !this.video.paused, this.video.src = this.previousSource = t, this.video.load())
                        }
                    }
                }, {
                    key: "queueVideoPlayback",
                    value: function () {
                        var e = this;
                        "function" == typeof this._onCanPlay && this.video.removeEventListener("canplay", this._onCanPlay), this.video.readyState < u ? (this._onCanPlay = function () {
                            e.video.play(), e.video.removeEventListener("canplay", e._onCanPlay)
                        }, this.video.addEventListener("canplay", this._onCanPlay)) : this.video.play()
                    }
                }, {
                    key: "pauseVideoPlayback",
                    value: function () {
                        this.video.paused || this.video.pause()
                    }
                }, {
                    key: "getViewportFullName",
                    value: function (e) {
                        return h.matches && this.sources.xlarge ? "xlarge" : {
                            L: "large",
                            M: "medium",
                            S: "small"
                        } [e]
                    }
                }, {
                    key: "currentViewport",
                    set: function (e) {
                        this._currentViewport = this.getViewportFullName(e), this.load(this._currentViewport)
                    },
                    get: function () {
                        return this._currentViewport
                    }
                }, {
                    key: "isRetina",
                    get: function () {
                        return window.devicePixelRatio > 1
                    }
                }, {
                    key: "inLoadArea",
                    get: function () {
                        return this.loadKeyframe.isCurrentlyInRange
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function () {
                        var e = document.documentElement.classList;
                        return e.contains("inline-video") && !e.contains("reduced-motion") && !e.contains("ie")
                    }
                }]), t
            }(l);
        t.exports = m
    }, {
        "@marcom/bubble-gum/BaseComponent": 68
    }],
    151: [function (e, t, n) {
        "use strict";
        var r = e("@marcom/anim-system"),
            i = e("@marcom/bubble-gum"),
            a = e("@marcom/bubble-gum/ComponentMap"),
            s = e("@marcom/anim-lazy-image/AnimLazyImage");
        void
        function () {
            Object.assign(a, {
                Modal: e("./components/Modal"),
                InlineCompareModal: e("./components/InlineCompareModal"),
                InlineVideo: e("./components/InlineVideo"),
                LocalNavDarkTheme: e("./components/LocalNavDarkTheme"),
                HeroAnimation: e("./components/HeroAnimation"),
                FinishesGallery: e("./components/FinishesGallery/FinishesGallery"),
                CameraLenses: e("./components/CameraLenses"),
                VideoQualityGallery: e("./components/VideoQualityGallery/VideoQualityGallery"),
                SmartHdrGallery: e("./components/SmartHdrGallery"),
                VideoEditModeIntro: e("./components/VideoEditModeIntro"),
                NightMode: e("./components/NightMode"),
                VideoViewportSource: e("./components/VideoViewportSource"),
                Battery: e("./components/Battery"),
                PlaybackControl: e("./components/PlaybackControl")
            }), r.model.BREAKPOINTS = [{
                name: "S",
                mediaQuery: "only screen and (max-width: 734px)"
            }, {
                name: "M",
                mediaQuery: "only screen and (max-width: 1068px)"
            }, {
                name: "L",
                mediaQuery: "only screen and (min-width: 1441px)"
            }, {
                name: "L",
                mediaQuery: "only screen and (min-width: 1069px)"
            }];
            var t = new i(document.querySelector(".main"));
            t.anim.on(r.model.EVENTS.ON_DOM_GROUPS_CREATED, function () {
                new s
            });
            var n = document.querySelector(".hmc-link");
            n && window.AC && window.AC.iPhoneHelpMeChoose && (n.setAttribute("data-analytics-intrapage-link", ""), new window.AC.iPhoneHelpMeChoose(n))
        }()
    }, {
        "./components/Battery": 134,
        "./components/CameraLenses": 135,
        "./components/FinishesGallery/FinishesGallery": 136,
        "./components/HeroAnimation": 138,
        "./components/InlineCompareModal": 139,
        "./components/InlineVideo": 140,
        "./components/LocalNavDarkTheme": 141,
        "./components/Modal": 142,
        "./components/NightMode": 143,
        "./components/PlaybackControl": 144,
        "./components/SmartHdrGallery": 145,
        "./components/VideoEditModeIntro": 146,
        "./components/VideoQualityGallery/VideoQualityGallery": 149,
        "./components/VideoViewportSource": 150,
        "@marcom/anim-lazy-image/AnimLazyImage": 46,
        "@marcom/anim-system": 48,
        "@marcom/bubble-gum": 69,
        "@marcom/bubble-gum/ComponentMap": 70
    }]
}, {}, [151]);