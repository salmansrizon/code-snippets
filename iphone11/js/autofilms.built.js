    ! function () {
        return function t(e, i, n) {
            function r(s, a) {
                if (!i[s]) {
                    if (!e[s]) {
                        var c = "function" == typeof require && require;
                        if (!a && c) return c(s, !0);
                        if (o) return o(s, !0);
                        var l = new Error("Cannot find module '" + s + "'");
                        throw l.code = "MODULE_NOT_FOUND", l
                    }
                    var u = i[s] = {
                        exports: {}
                    };
                    e[s][0].call(u.exports, function (t) {
                        return r(e[s][1][t] || t)
                    }, u, u.exports, t, e, i, n)
                }
                return i[s].exports
            }
            for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) r(n[s]);
            return r
        }
    }()({
        1: [function (t, e, i) {
            e.exports = {
                majorVersionNumber: "3.x"
            }
        }, {}],
        2: [function (t, e, i) {
            "use strict";
            var n, r = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                o = t("./sharedRAFExecutorInstance"),
                s = t("./sharedRAFEmitterIDGeneratorInstance");

            function a(t) {
                t = t || {}, r.call(this), this.id = s.getNewID(), this.executor = t.executor || o, this._reset(), this._willRun = !1, this._didDestroy = !1
            }(n = a.prototype = Object.create(r.prototype)).run = function () {
                return this._willRun || (this._willRun = !0), this._subscribe()
            }, n.cancel = function () {
                this._unsubscribe(), this._willRun && (this._willRun = !1), this._reset()
            }, n.destroy = function () {
                var t = this.willRun();
                return this.cancel(), this.executor = null, r.prototype.destroy.call(this), this._didDestroy = !0, t
            }, n.willRun = function () {
                return this._willRun
            }, n.isRunning = function () {
                return this._isRunning
            }, n._subscribe = function () {
                return this.executor.subscribe(this)
            }, n._unsubscribe = function () {
                return this.executor.unsubscribe(this)
            }, n._onAnimationFrameStart = function (t) {
                this._isRunning = !0, this._willRun = !1, this._didEmitFrameData || (this._didEmitFrameData = !0, this.trigger("start", t))
            }, n._onAnimationFrameEnd = function (t) {
                this._willRun || (this.trigger("stop", t), this._reset())
            }, n._reset = function () {
                this._didEmitFrameData = !1, this._isRunning = !1
            }, e.exports = a
        }, {
            "./sharedRAFEmitterIDGeneratorInstance": 8,
            "./sharedRAFExecutorInstance": 9,
            "@marcom/ac-event-emitter-micro": 88
        }],
        3: [function (t, e, i) {
            "use strict";
            var n, r = t("@marcom/ac-event-emitter-micro/EventEmitterMicro");

            function o(t) {
                t = t || {}, this._reset(), this.updatePhases(), this.eventEmitter = new r, this._willRun = !1, this._totalSubscribeCount = -1, this._requestAnimationFrame = window.requestAnimationFrame, this._cancelAnimationFrame = window.cancelAnimationFrame, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
            }(n = o.prototype).frameRequestedPhase = "requested", n.startPhase = "start", n.runPhases = ["update", "external", "draw"], n.endPhase = "end", n.disabledPhase = "disabled", n.beforePhaseEventPrefix = "before:", n.afterPhaseEventPrefix = "after:", n.subscribe = function (t, e) {
                return this._totalSubscribeCount++, this._nextFrameSubscribers[t.id] || (e ? this._nextFrameSubscribersOrder.unshift(t.id) : this._nextFrameSubscribersOrder.push(t.id), this._nextFrameSubscribers[t.id] = t, this._nextFrameSubscriberArrayLength++, this._nextFrameSubscriberCount++, this._run()), this._totalSubscribeCount
            }, n.subscribeImmediate = function (t, e) {
                return this._totalSubscribeCount++, this._subscribers[t.id] || (e ? this._subscribersOrder.splice(this._currentSubscriberIndex + 1, 0, t.id) : this._subscribersOrder.unshift(t.id), this._subscribers[t.id] = t, this._subscriberArrayLength++, this._subscriberCount++), this._totalSubscribeCount
            }, n.unsubscribe = function (t) {
                return !!this._nextFrameSubscribers[t.id] && (this._nextFrameSubscribers[t.id] = null, this._nextFrameSubscriberCount--, 0 === this._nextFrameSubscriberCount && this._cancel(), !0)
            }, n.getSubscribeID = function () {
                return this._totalSubscribeCount += 1
            }, n.destroy = function () {
                var t = this._cancel();
                return this.eventEmitter.destroy(), this.eventEmitter = null, this.phases = null, this._subscribers = null, this._subscribersOrder = null, this._nextFrameSubscribers = null, this._nextFrameSubscribersOrder = null, this._rafData = null, this._boundOnAnimationFrame = null, this._onExternalAnimationFrame = null, t
            }, n.useExternalAnimationFrame = function (t) {
                if ("boolean" == typeof t) {
                    var e = this._isUsingExternalAnimationFrame;
                    return t && this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), !this._willRun || t || this._animationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this._isUsingExternalAnimationFrame = t, t ? this._boundOnExternalAnimationFrame : e || !1
                }
            }, n.updatePhases = function () {
                this.phases || (this.phases = []), this.phases.length = 0, this.phases.push(this.frameRequestedPhase), this.phases.push(this.startPhase), Array.prototype.push.apply(this.phases, this.runPhases), this.phases.push(this.endPhase), this._runPhasesLength = this.runPhases.length, this._phasesLength = this.phases.length
            }, n._run = function () {
                if (!this._willRun) return this._willRun = !0, 0 === this.lastFrameTime && (this.lastFrameTime = performance.now()), this._animationFrameActive = !0, this._isUsingExternalAnimationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this.phase === this.disabledPhase && (this.phaseIndex = 0, this.phase = this.phases[this.phaseIndex]), !0
            }, n._cancel = function () {
                var t = !1;
                return this._animationFrameActive && (this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), this._animationFrameActive = !1, this._willRun = !1, t = !0), this._isRunning || this._reset(), t
            }, n._onAnimationFrame = function (t) {
                for (this._subscribers = this._nextFrameSubscribers, this._subscribersOrder = this._nextFrameSubscribersOrder, this._subscriberArrayLength = this._nextFrameSubscriberArrayLength, this._subscriberCount = this._nextFrameSubscriberCount, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this.phaseIndex = 0, this.phase = this.phases[this.phaseIndex], this._isRunning = !0, this._willRun = !1, this._didRequestNextRAF = !1, this._rafData.delta = t - this.lastFrameTime, this.lastFrameTime = t, this._rafData.fps = 0, this._rafData.delta >= 1e3 && (this._rafData.delta = 0), 0 !== this._rafData.delta && (this._rafData.fps = 1e3 / this._rafData.delta), this._rafData.time = t, this._rafData.naturalFps = this._rafData.fps, this._rafData.timeNow = Date.now(), this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && !1 === this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._onAnimationFrameStart(this._rafData);
                for (this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase), this._runPhaseIndex = 0; this._runPhaseIndex < this._runPhasesLength; this._runPhaseIndex++) {
                    for (this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && !1 === this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]].trigger(this.phase, this._rafData);
                    this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase)
                }
                for (this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && !1 === this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._onAnimationFrameEnd(this._rafData);
                this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase), this._willRun ? (this.phaseIndex = 0, this.phaseIndex = this.phases[this.phaseIndex]) : this._reset()
            }, n._onExternalAnimationFrame = function (t) {
                this._isUsingExternalAnimationFrame && this._onAnimationFrame(t)
            }, n._reset = function () {
                this._rafData || (this._rafData = {}), this._rafData.time = 0, this._rafData.delta = 0, this._rafData.fps = 0, this._rafData.naturalFps = 0, this._rafData.timeNow = 0, this._subscribers = {}, this._subscribersOrder = [], this._currentSubscriberIndex = -1, this._subscriberArrayLength = 0, this._subscriberCount = 0, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._didEmitFrameData = !1, this._animationFrame = null, this._animationFrameActive = !1, this._isRunning = !1, this._shouldReset = !1, this.lastFrameTime = 0, this._runPhaseIndex = -1, this.phaseIndex = -1, this.phase = this.disabledPhase
            }, e.exports = o
        }, {
            "@marcom/ac-event-emitter-micro/EventEmitterMicro": 89
        }],
        4: [function (t, e, i) {
            "use strict";
            var n = t("./SingleCallRAFEmitter"),
                r = function (t) {
                    this.phase = t, this.rafEmitter = new n, this._cachePhaseIndex(), this.requestAnimationFrame = this.requestAnimationFrame.bind(this), this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this), this._onBeforeRAFExecutorStart = this._onBeforeRAFExecutorStart.bind(this), this._onBeforeRAFExecutorPhase = this._onBeforeRAFExecutorPhase.bind(this), this._onAfterRAFExecutorPhase = this._onAfterRAFExecutorPhase.bind(this), this.rafEmitter.on(this.phase, this._onRAFExecuted.bind(this)), this.rafEmitter.executor.eventEmitter.on("before:start", this._onBeforeRAFExecutorStart), this.rafEmitter.executor.eventEmitter.on("before:" + this.phase, this._onBeforeRAFExecutorPhase), this.rafEmitter.executor.eventEmitter.on("after:" + this.phase, this._onAfterRAFExecutorPhase), this._frameCallbacks = [], this._currentFrameCallbacks = [], this._nextFrameCallbacks = [], this._phaseActive = !1, this._currentFrameID = -1, this._cancelFrameIdx = -1, this._frameCallbackLength = 0, this._currentFrameCallbacksLength = 0, this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0
                },
                o = r.prototype;
            o.requestAnimationFrame = function (t, e) {
                return !0 === e && this.rafEmitter.executor.phaseIndex > 0 && this.rafEmitter.executor.phaseIndex <= this.phaseIndex ? this._phaseActive ? (this._currentFrameID = this.rafEmitter.executor.subscribeImmediate(this.rafEmitter, !0), this._frameCallbacks.push(this._currentFrameID, t), this._frameCallbackLength += 2) : (this._currentFrameID = this.rafEmitter.executor.subscribeImmediate(this.rafEmitter, !1), this._currentFrameCallbacks.push(this._currentFrameID, t), this._currentFrameCallbacksLength += 2) : (this._currentFrameID = this.rafEmitter.run(), this._nextFrameCallbacks.push(this._currentFrameID, t), this._nextFrameCallbacksLength += 2), this._currentFrameID
            }, o.cancelAnimationFrame = function (t) {
                this._cancelFrameIdx = this._nextFrameCallbacks.indexOf(t), this._cancelFrameIdx > -1 ? this._cancelNextAnimationFrame() : (this._cancelFrameIdx = this._currentFrameCallbacks.indexOf(t), this._cancelFrameIdx > -1 ? this._cancelCurrentAnimationFrame() : (this._cancelFrameIdx = this._frameCallbacks.indexOf(t), this._cancelFrameIdx > -1 && this._cancelRunningAnimationFrame()))
            }, o._onRAFExecuted = function (t) {
                for (this._frameCallbackIteration = 0; this._frameCallbackIteration < this._frameCallbackLength; this._frameCallbackIteration += 2) this._frameCallbacks[this._frameCallbackIteration + 1](t.time, t);
                this._frameCallbacks.length = 0, this._frameCallbackLength = 0
            }, o._onBeforeRAFExecutorStart = function () {
                Array.prototype.push.apply(this._currentFrameCallbacks, this._nextFrameCallbacks.splice(0, this._nextFrameCallbacksLength)), this._currentFrameCallbacksLength = this._nextFrameCallbacksLength, this._nextFrameCallbacks.length = 0, this._nextFrameCallbacksLength = 0
            }, o._onBeforeRAFExecutorPhase = function () {
                this._phaseActive = !0, Array.prototype.push.apply(this._frameCallbacks, this._currentFrameCallbacks.splice(0, this._currentFrameCallbacksLength)), this._frameCallbackLength = this._currentFrameCallbacksLength, this._currentFrameCallbacks.length = 0, this._currentFrameCallbacksLength = 0
            }, o._onAfterRAFExecutorPhase = function () {
                this._phaseActive = !1
            }, o._cachePhaseIndex = function () {
                this.phaseIndex = this.rafEmitter.executor.phases.indexOf(this.phase)
            }, o._cancelRunningAnimationFrame = function () {
                this._frameCallbacks.splice(this._cancelFrameIdx, 2), this._frameCallbackLength -= 2
            }, o._cancelCurrentAnimationFrame = function () {
                this._currentFrameCallbacks.splice(this._cancelFrameIdx, 2), this._currentFrameCallbacksLength -= 2
            }, o._cancelNextAnimationFrame = function () {
                this._nextFrameCallbacks.splice(this._cancelFrameIdx, 2), this._nextFrameCallbacksLength -= 2, 0 === this._nextFrameCallbacksLength && this.rafEmitter.cancel()
            }, e.exports = r
        }, {
            "./SingleCallRAFEmitter": 6
        }],
        5: [function (t, e, i) {
            "use strict";
            var n = t("./RAFInterface"),
                r = function () {
                    this.events = {}
                },
                o = r.prototype;
            o.requestAnimationFrame = function (t) {
                return this.events[t] || (this.events[t] = new n(t)), this.events[t].requestAnimationFrame
            }, o.cancelAnimationFrame = function (t) {
                return this.events[t] || (this.events[t] = new n(t)), this.events[t].cancelAnimationFrame
            }, e.exports = new r
        }, {
            "./RAFInterface": 4
        }],
        6: [function (t, e, i) {
            "use strict";
            var n = t("./RAFEmitter"),
                r = function (t) {
                    n.call(this, t)
                };
            (r.prototype = Object.create(n.prototype))._subscribe = function () {
                return this.executor.subscribe(this, !0)
            }, e.exports = r
        }, {
            "./RAFEmitter": 2
        }],
        7: [function (t, e, i) {
            "use strict";
            var n = t("./RAFInterfaceController");
            e.exports = n.cancelAnimationFrame("update")
        }, {
            "./RAFInterfaceController": 5
        }],
        8: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-shared-instance").SharedInstance,
                r = t("../.release-info.js").majorVersionNumber,
                o = function () {
                    this._currentID = 0
                };
            o.prototype.getNewID = function () {
                return this._currentID++, "raf:" + this._currentID
            }, e.exports = n.share("@marcom/ac-raf-emitter/sharedRAFEmitterIDGeneratorInstance", r, o)
        }, {
            "../.release-info.js": 1,
            "@marcom/ac-shared-instance": 162
        }],
        9: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-shared-instance").SharedInstance,
                r = t("../.release-info.js").majorVersionNumber,
                o = t("./RAFExecutor");
            e.exports = n.share("@marcom/ac-raf-emitter/sharedRAFExecutorInstance", r, o)
        }, {
            "../.release-info.js": 1,
            "./RAFExecutor": 3,
            "@marcom/ac-shared-instance": 162
        }],
        10: [function (t, e, i) {
            "use strict";
            var n = t("./RAFInterfaceController");
            e.exports = n.requestAnimationFrame("update")
        }, {
            "./RAFInterfaceController": 5
        }],
        11: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./utils/vector3FromLatLon"),
                o = t("@marcom/ac-raf-emitter/update"),
                s = t("@marcom/ac-raf-emitter/cancelUpdate"),
                a = t("./controls/PointerControls"),
                c = t("./controls/OrientationControls"),
                l = t("@marcom/ac-event-emitter-micro/EventEmitterMicro"),
                u = t("@marcom/ac-easing/src/ac-easing/createBezier"),
                h = t("@marcom/ac-useragent"),
                d = t("./utils/simpleTimer"),
                p = t("./utils/inverseLongitude"),
                f = t("./controls/ArrowControls"),
                m = t("./utils/map"),
                _ = t("@marcom/ac-feature/webGLAvailable")(),
                v = t("./utils/loadScript"),
                y = h.os.ios,
                b = 80,
                g = 1.25,
                w = h.browser.safari && h.os.osx ? "high-performance" : "default",
                E = {
                    slow: 80,
                    fast: 120
                },
                x = u(.25, .1, 0, 1),
                k = u(.1, .15, 0, 1),
                C = .001,
                T = .999,
                O = 1600,
                S = 1600,
                P = 12,
                L = "/ac/libs/three/92/three.min.js",
                A = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                        i.el = t.el, _ || setTimeout(function () {
                            i.trigger("error")
                        }), i._textureSrc = t.src, t.video ? i._videoElement = t.video : t.src instanceof HTMLVideoElement ? i._videoElement = t.src : i._textureSrc && (i._textureSrc.endsWith(".mp4") || i._textureSrc.endsWith(".m3u8") || i._textureSrc.endsWith(".webm")) && (i._videoElement = document.createElement("video")), i._maxLat = t.maxLat || b, i._pointerControls = new a({
                            el: t.mouseTarget || i.el
                        }), i.arrowControls = new f, i._easing = t.easing || x, i._sineEasing = t.sineEasing || k, i._mapMinValue = void 0 !== t.mapMinValue ? t.mapMinValue : C, i._mapMaxValue = t.mapMaxValue || T, i._rotationDuration = t.rotationDuration || O, y && (i._orientationControls = new c), i._panVelocity = Object.assign({}, t.panVelocity || E), i._overshootMultiplier = t.overshootMultiplier || g, i._oscillationDuration = t.ocillationDuration || S, i._oscillationDistance = t.ocillationDistance || P, i._bindMethods();
                        var n = window.THREE ? Promise.resolve() : v(t.threeUrl || L);
                        return i._cachedPos = {
                            lat: 0,
                            lon: 0
                        }, n.then(function () {
                            i._attach(), i.refreshSize()
                        }), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, l), n(e, [{
                        key: "_bindMethods",
                        value: function () {
                            this._onPlaying = this._onPlaying.bind(this)
                        }
                    }, {
                        key: "_attach",
                        value: function () {
                            this._distance = 50;
                            var t = {
                                lat: 0,
                                lon: 0
                            };
                            this._cachedPos = t, this._pointerControls.position = t, this._orientationControls && (this._orientationControls.position = t);
                            var e = this.el.clientWidth,
                                i = this.el.clientHeight,
                                n = e / i;
                            this._camera = new THREE.PerspectiveCamera(75, n, 1, 1100), this._camera.target = new THREE.Vector3(0, 0, 0), this._scene = new THREE.Scene, this._geometry = new THREE.SphereBufferGeometry(500, 60, 40), this._geometry.scale(-1, 1, 1), this._texture = this._createTexture(this._textureSrc), this._material = new THREE.MeshBasicMaterial({
                                map: this._texture
                            }), this._mesh = new THREE.Mesh(this._geometry, this._material), this._scene.add(this._mesh), this._renderer = new THREE.WebGLRenderer({
                                antialias: !1,
                                powerPreference: w
                            }), this._renderer.setPixelRatio(window.devicePixelRatio), this._renderer.setSize(e, i), this._renderer.domElement.classList.add("threesixty-renderer"), this.el.appendChild(this._renderer.domElement), this._animate = this._animate.bind(this), this._animateRAF = o(this._animate)
                        }
                    }, {
                        key: "_animate",
                        value: function () {
                            this._update(), this._animateRAF = o(this._animate)
                        }
                    }, {
                        key: "_update",
                        value: function (t) {
                            if (window.THREE) {
                                var i = t;
                                i || (i = this.arrowControls.isActive ? this.arrowControls.position : this._pointerControls.isActive ? this._pointerControls.position : this._orientationControls ? this._orientationControls.position : this._cachedPos);
                                var n = !1;
                                if (this._cachedPos.lat !== i.lat || this._cachedPos.lon !== i.lon) n = !0;
                                else if (!this._videoElement || this._videoElement.paused) return;
                                var r = Math.max(-this._maxLat, Math.min(this._maxLat, i.lat)),
                                    o = THREE.Math.degToRad(90 - r),
                                    s = THREE.Math.degToRad(i.lon),
                                    a = this._distance * Math.sin(o) * Math.cos(s),
                                    c = this._distance * Math.cos(o),
                                    l = this._distance * Math.sin(o) * Math.sin(s);
                                this._camera.zoom = this._pointerControls.scale, this._camera.position.x = a, this._camera.position.y = c, this._camera.position.z = l, this._camera.lookAt(this._camera.target), this._camera.updateProjectionMatrix(), this._renderer.render(this._scene, this._camera);
                                var u = {
                                    lat: r,
                                    lon: i.lon,
                                    x: a,
                                    y: c,
                                    z: l
                                };
                                this._cachedPos = {
                                    lat: u.lat,
                                    lon: u.lon,
                                    x: u.x,
                                    y: u.y,
                                    z: u.z
                                }, this._pointerControls.position = u, this.arrowControls.position = u, this._orientationControls && (this._orientationControls.position = u), this._originQuaternion || (this._originQuaternion = (new THREE.Quaternion).copy(this._camera.quaternion)), n && this.trigger(e.POSITION_CHANGE)
                            }
                        }
                    }, {
                        key: "_createTexture",
                        value: function (t) {
                            if (t instanceof HTMLVideoElement) {
                                this._videoElement = t, this._videoElement.setAttribute("playsinline", "playsinline"), this._videoElement.setAttribute("webkit-playsinline", "webkit-playsinline"), this._videoElement.addEventListener("playing", this._onPlaying);
                                var e = new THREE.VideoTexture(this._videoElement);
                                return e.minFilter = THREE.LinearFilter, e.format = THREE.RGBFormat, e
                            }
                            if (t.endsWith(".mp4") || t.endsWith(".m3u8") || t.endsWith(".webm")) {
                                this._videoElement || (this._videoElement = document.createElement("video")), this._videoElement.src = t, this._videoElement.loop = !0, this._videoElement.muted = !0, this._videoElement.crossOrigin = "anonymous", this._videoElement.setAttribute("webkit-playsinline", "webkit-playsinline"), this._videoElement.setAttribute("playsinline", "playsinline"), this._videoElement = this._videoElement, this._videoElement.addEventListener("playing", this._onPlaying);
                                var i = new THREE.VideoTexture(this._videoElement);
                                return i.minFilter = THREE.LinearFilter, i.format = THREE.RGBFormat, i
                            }
                            return this._orientationControls.enable(), (new THREE.TextureLoader).load(t)
                        }
                    }, {
                        key: "refreshSize",
                        value: function () {
                            this._onResize()
                        }
                    }, {
                        key: "setPos",
                        value: function (t, e) {
                            this._pointerControls && (this._pointerControls.position = {
                                lat: t,
                                lon: e
                            }), this._orientationControls && (this._orientationControls.position = {
                                lat: t,
                                lon: e
                            }), this._update({
                                lat: t,
                                lon: e
                            })
                        }
                    }, {
                        key: "_onResize",
                        value: function () {
                            if (window.THREE && this._camera && this._renderer) {
                                var t = void 0,
                                    e = void 0;
                                this._videoElement.parentElement ? (t = this._videoElement.clientWidth, e = this._videoElement.clientHeight) : (t = this.el.clientWidth, e = this.el.clientHeight), s(this._animateRAF), this._pointerControls.setViewerSize(t, e), this._camera.aspect = t / e, this._camera.updateProjectionMatrix(), this._renderer.setSize(t, e), this._renderer.render(this._scene, this._camera), this._animate()
                            }
                        }
                    }, {
                        key: "_onPlaying",
                        value: function () {
                            this._videoElement.removeEventListener("playing", this._onPlaying), this._orientationControls && this._orientationControls.enable()
                        }
                    }, {
                        key: "play",
                        value: function () {
                            this._videoElement && this._videoElement.play()
                        }
                    }, {
                        key: "pause",
                        value: function () {
                            this._videoElement && !this._videoElement.paused && this._videoElement.pause()
                        }
                    }, {
                        key: "sendMouseDown",
                        value: function (t) {
                            this._pointerControls.sendMouseDown(t)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            (function t(e, i, n) {
                                null === e && (e = Function.prototype);
                                var r = Object.getOwnPropertyDescriptor(e, i);
                                if (void 0 === r) {
                                    var o = Object.getPrototypeOf(e);
                                    return null === o ? void 0 : t(o, i, n)
                                }
                                if ("value" in r) return r.value;
                                var s = r.get;
                                return void 0 !== s ? s.call(n) : void 0
                            })(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }, {
                        key: "oscillateLongitude",
                        value: function () {
                            var t = this;
                            this._pointerControls.cancelInertia(), this.arrowControls.cancelInertia();
                            var i = new THREE.Vector2(this.position.lon, this.position.lat),
                                n = this._oscillationDuration,
                                o = {
                                    time: n,
                                    startPosition: Object.assign({}, this.position),
                                    targetPosition: Object.assign({}, this.position)
                                };
                            return this.trigger(e.ROTATION_START, o), new Promise(function (s) {
                                d(n, function (n) {
                                    var s = Math.sin(Math.PI * t._sineEasing.getValue(n)),
                                        a = (new THREE.Vector2).copy(i);
                                    a.x = i.x - s * t._oscillationDistance;
                                    var c = r(a.y, a.x, t._distance);
                                    t.trigger(e.ROTATION_UPDATE, {
                                        t: n,
                                        easedVal: s,
                                        startPosition: o.startPosition,
                                        currentPosition: {
                                            lat: a.y,
                                            lon: a.x
                                        },
                                        targetPosition: o.targetPosition
                                    }), t._camera.position.copy(c), t._camera.lookAt(t._camera.target), t._camera.updateProjectionMatrix(), t._renderer.render(t._scene, t._camera)
                                }).then(function () {
                                    t.trigger(e.ROTATION_COMPLETE, o), t.setPos(i.y, i.x), t._animate(), s()
                                })
                            })
                        }
                    }, {
                        key: "panToPosition",
                        value: function (t) {
                            return this._respositionCameraToPosition(t)
                        }
                    }, {
                        key: "_respositionCameraToPosition",
                        value: function (t) {
                            var i = this;
                            if (this._pointerControls.cancelInertia(), this.arrowControls.cancelInertia(), t.lat === this.position.lat && t.lon === this.position.lon) return this.trigger(e.ROTATION_START, {
                                time: 0,
                                startPosition: Object.assign({}, this.position),
                                targetPosition: Object.assign({}, this.position)
                            }), this.trigger(e.ROTATION_COMPLETE, {
                                time: 1,
                                startPosition: Object.assign({}, this.position),
                                targetPosition: Object.assign({}, this.position)
                            }), Promise.resolve();
                            var n = new THREE.Vector2(this.position.lon, this.position.lat),
                                o = new THREE.Vector2(p(t.lon), t.lat),
                                a = new THREE.Vector2(t.lon, t.lat),
                                c = n.distanceTo(a),
                                l = n.distanceTo(o);
                            l < c && (c = l, a = o);
                            var u = (new THREE.Vector2).copy(n);
                            s(this._animateRAF);
                            var h = this._rotationDuration,
                                f = {
                                    time: h,
                                    startPosition: Object.assign({}, this._cachedPos),
                                    targetPosition: Object.assign({}, t)
                                };
                            return this.trigger(e.ROTATION_START, f), new Promise(function (o) {
                                d(h, function (t) {
                                    var o = void 0;
                                    o = 1 === t ? 1 : m(i._easing.getValue(t), 0, 1, i._mapMinValue, i._mapMaxValue);
                                    var s = u.lerpVectors(n, a, o),
                                        c = r(s.y, s.x, i._distance);
                                    i._camera.position.copy(c), i._camera.lookAt(i._camera.target), i._camera.updateProjectionMatrix(), i._renderer.render(i._scene, i._camera), i.trigger(e.ROTATION_UPDATE, {
                                        t: t,
                                        easedVal: o,
                                        startPosition: f.startPosition,
                                        currentPosition: {
                                            lat: s.y,
                                            lon: s.x
                                        },
                                        targetPosition: {
                                            lat: a.x,
                                            lon: a.y
                                        }
                                    })
                                }).then(function () {
                                    i.trigger(e.ROTATION_COMPLETE, f), i.setPos(t.lat, t.lon), i._animate(), o()
                                })
                            })
                        }
                    }, {
                        key: "position",
                        get: function () {
                            return Object.assign({}, this._cachedPos)
                        }
                    }, {
                        key: "isAtOrigin",
                        get: function () {
                            return Math.abs(this.position.lat) <= .5 && Math.abs(this.position.lon) <= .5
                        }
                    }, {
                        key: "mediaElement",
                        get: function () {
                            return this._videoElement
                        }
                    }]), e
                }();
            A.ROTATION_START = "RotationStart", A.ROTATION_UPDATE = "RotationUpdate", A.ROTATION_COMPLETE = "RotationComplete", A.POSITION_CHANGE = "360PositionChange", e.exports = A
        }, {
            "./controls/ArrowControls": 13,
            "./controls/OrientationControls": 15,
            "./controls/PointerControls": 16,
            "./utils/inverseLongitude": 17,
            "./utils/loadScript": 18,
            "./utils/map": 19,
            "./utils/simpleTimer": 21,
            "./utils/vector3FromLatLon": 22,
            "@marcom/ac-easing/src/ac-easing/createBezier": 86,
            "@marcom/ac-event-emitter-micro/EventEmitterMicro": 89,
            "@marcom/ac-feature/webGLAvailable": 98,
            "@marcom/ac-raf-emitter/cancelUpdate": 7,
            "@marcom/ac-raf-emitter/update": 10,
            "@marcom/ac-useragent": 194
        }],
        12: [function (t, e, i) {
            "use strict";
            e.exports = t("./AC360")
        }, {
            "./AC360": 11
        }],
        13: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./InertialControls"),
                o = t("../utils/normalizeLongitude"),
                s = t("@marcom/ac-raf-emitter/update"),
                a = t("@marcom/ac-raf-emitter/cancelUpdate"),
                c = {
                    acceleration: {
                        x: .6,
                        y: .6
                    },
                    friction: {
                        x: .95,
                        y: .95
                    },
                    minVelocity: .1,
                    maxVelocity: 20
                },
                l = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e), t = Object.assign({}, c, t);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return i._bindMethods(), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_bindMethods",
                        value: function () {
                            this.leftArrowDown = this.leftArrowDown.bind(this), this.rightArrowDown = this.rightArrowDown.bind(this), this.downArrowDown = this.downArrowDown.bind(this), this.upArrowDown = this.upArrowDown.bind(this), this.leftArrowUp = this.leftArrowUp.bind(this), this.rightArrowUp = this.rightArrowUp.bind(this), this.downArrowUp = this.downArrowUp.bind(this), this.upArrowUp = this.upArrowUp.bind(this),
                                function t(e, i, n) {
                                    null === e && (e = Function.prototype);
                                    var r = Object.getOwnPropertyDescriptor(e, i);
                                    if (void 0 === r) {
                                        var o = Object.getPrototypeOf(e);
                                        return null === o ? void 0 : t(o, i, n)
                                    }
                                    if ("value" in r) return r.value;
                                    var s = r.get;
                                    return void 0 !== s ? s.call(n) : void 0
                                }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_bindMethods", this).call(this)
                        }
                    }, {
                        key: "leftArrowDown",
                        value: function () {
                            Math.abs(this._velocity.x - this._horizontalIncrement) < this._maxVelocity ? this._velocity.x -= this._horizontalIncrement : this._velocity.x = -this._maxVelocity, this._lon = o(this._lon + this._velocity.x), this._triggerInertia()
                        }
                    }, {
                        key: "rightArrowDown",
                        value: function () {
                            Math.abs(this._velocity.x + this._horizontalIncrement) < this._maxVelocity ? this._velocity.x += this._horizontalIncrement : this._velocity.x = this._maxVelocity, this._velocity.x += this._horizontalIncrement, this._lon = o(this._lon + this._velocity.x), this._triggerInertia()
                        }
                    }, {
                        key: "upArrowDown",
                        value: function (t) {
                            Math.abs(this._velocity.y - this._verticalIncrement) < this._maxVelocity ? this._velocity.y -= this._verticalIncrement : this._velocity.y = -this._maxVelocity, this._lat = this._lat + this._velocity.y, this._triggerInertia()
                        }
                    }, {
                        key: "downArrowDown",
                        value: function () {
                            Math.abs(this._velocity.y + this._verticalIncrement) < this._maxVelocity ? this._velocity.y += this._verticalIncrement : this._velocity.y = this._maxVelocity, this._lat = this._lat + this._velocity.y, this._triggerInertia()
                        }
                    }, {
                        key: "leftArrowUp",
                        value: function () {
                            this._triggerInertia()
                        }
                    }, {
                        key: "rightArrowUp",
                        value: function () {
                            this._triggerInertia()
                        }
                    }, {
                        key: "upArrowUp",
                        value: function () {
                            this._triggerInertia()
                        }
                    }, {
                        key: "downArrowUp",
                        value: function () {
                            this._triggerInertia()
                        }
                    }, {
                        key: "_triggerInertia",
                        value: function () {
                            a(this._inertiaRaf), s(this._updateInertia)
                        }
                    }, {
                        key: "isActive",
                        get: function () {
                            return Math.abs(this._velocity.x) > this._minVelocity || Math.abs(this._velocity.y) > this._minVelocity
                        }
                    }]), e
                }();
            e.exports = l
        }, {
            "../utils/normalizeLongitude": 20,
            "./InertialControls": 14,
            "@marcom/ac-raf-emitter/cancelUpdate": 7,
            "@marcom/ac-raf-emitter/update": 10
        }],
        14: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("@marcom/ac-raf-emitter/update"),
                o = t("@marcom/ac-raf-emitter/cancelUpdate"),
                s = t("../utils/normalizeLongitude"),
                a = .5,
                c = .1,
                l = 5,
                u = 20,
                h = function () {
                    function t() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this._horizontalFriction = e.friction && e.friction.x || a, this._verticalFriction = e.friction && e.friction.x || a, this._horizontalIncrement = e.acceleration && e.acceleration.x || c, this._verticalIncrement = e.acceleration && e.acceleration.y || c, this._minVelocity = e.minVelocity || l, this._maxVelocity = e.maxVelocity || u, this._velocity = {
                            x: 0,
                            y: 0
                        }, this._bindMethods()
                    }
                    return n(t, [{
                        key: "_bindMethods",
                        value: function () {
                            this._updateInertia = this._updateInertia.bind(this)
                        }
                    }, {
                        key: "_updateInertia",
                        value: function () {
                            Math.abs(this._velocity.x) > this._minVelocity || Math.abs(this._velocity.y) > this._minVelocity ? (this._velocity.x *= this._horizontalFriction, this._velocity.y *= this._verticalFriction, this._lon += this._velocity.x * this._horizontalIncrement, this._lat += this._velocity.y * this._verticalIncrement, this._inertiaRaf = r(this._updateInertia)) : (this._velocity = {
                                x: 0,
                                y: 0
                            }, o(this._inertiaRaf), this._inertiaComplete())
                        }
                    }, {
                        key: "cancelInertia",
                        value: function () {
                            this._velocity = {
                                x: 0,
                                y: 0
                            }, o(this._inertiaRaf)
                        }
                    }, {
                        key: "_inertiaComplete",
                        value: function () {}
                    }, {
                        key: "position",
                        set: function (t) {
                            this._lat = t.lat, this._lon = s(t.lon)
                        },
                        get: function () {
                            return {
                                lat: this._lat,
                                lon: this._lon
                            }
                        }
                    }]), t
                }();
            e.exports = h
        }, {
            "../utils/normalizeLongitude": 20,
            "@marcom/ac-raf-emitter/cancelUpdate": 7,
            "@marcom/ac-raf-emitter/update": 10
        }],
        15: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("../utils/normalizeLongitude"),
                o = function () {
                    function t(e) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this._bindMethods()
                    }
                    return n(t, [{
                        key: "_bindMethods",
                        value: function () {
                            this._onOrientation = this._onOrientation.bind(this)
                        }
                    }, {
                        key: "_addEventListeners",
                        value: function () {
                            window.addEventListener("devicemotion", this._onOrientation, !0)
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            window.removeEventListener("devicemotion", this._onOrientation, !0)
                        }
                    }, {
                        key: "_onOrientation",
                        value: function (t) {
                            window.matchMedia("(orientation: portrait)").matches ? (this._lon = r(this._lon - .02 * t.rotationRate.beta), this._lat = this._lat - .02 * t.rotationRate.alpha) : t.orientation || -90 === window.orientation ? (this._lon = r(this._lon + .02 * t.rotationRate.alpha), this._lat = this._lat - .02 * t.rotationRate.beta) : (this._lon = r(this._lon - .02 * t.rotationRate.alpha), this._lat = this._lat + .02 * t.rotationRate.beta)
                        }
                    }, {
                        key: "disable",
                        value: function () {
                            this._removeEventListeners()
                        }
                    }, {
                        key: "enable",
                        value: function () {
                            this._addEventListeners()
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._removeEventListeners()
                        }
                    }, {
                        key: "position",
                        set: function (t) {
                            this._lat = t.lat, this._lon = r(t.lon)
                        },
                        get: function () {
                            return {
                                lat: this._lat,
                                lon: this._lon
                            }
                        }
                    }]), t
                }();
            e.exports = o
        }, {
            "../utils/normalizeLongitude": 20
        }],
        16: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("../utils/normalizeLongitude"),
                o = t("./InertialControls"),
                s = {
                    acceleration: {
                        x: .1,
                        y: .1
                    },
                    friction: {
                        x: .95,
                        y: .95
                    },
                    minVelocity: .5,
                    maxVelocity: 20
                },
                a = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e), t = Object.assign({}, s, t);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return i.el = t.el, i._mouseDown = !1, i._scale = 1, i._hasInertia = !1 !== t.inertia || t.inertia, i._bindMethods(), i._addEventListeners(), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "_bindMethods",
                        value: function () {
                            this._onMouseMove = this._onMouseMove.bind(this), this._onMouseDown = this._onMouseDown.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onTouchMove = this._onTouchMove.bind(this), this._onClick = this._onClick.bind(this),
                                function t(e, i, n) {
                                    null === e && (e = Function.prototype);
                                    var r = Object.getOwnPropertyDescriptor(e, i);
                                    if (void 0 === r) {
                                        var o = Object.getPrototypeOf(e);
                                        return null === o ? void 0 : t(o, i, n)
                                    }
                                    if ("value" in r) return r.value;
                                    var s = r.get;
                                    return void 0 !== s ? s.call(n) : void 0
                                }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_bindMethods", this).call(this)
                        }
                    }, {
                        key: "_addEventListeners",
                        value: function () {
                            this.el.addEventListener("mousedown", this._onMouseDown), this.el.addEventListener("touchstart", this._onMouseDown, {
                                passive: !1
                            }), this.el.addEventListener("click", this._onClick), this.el.addEventListener("touchmove", this._onTouchMove, {
                                passive: !1
                            })
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            this.el.removeEventListener("mousedown", this._onMouseDown), this.el.removeEventListener("touchstart", this._onMouseDown), window.removeEventListener("mousemove", this._onMouseMove), window.removeEventListener("mouseup", this._onMouseUp), this.el.removeEventListener("touchmove", this._onTouchMove), document.body.removeEventListener("touchmove", this._onTouchMove), document.body.removeEventListener("touchend", this._onMouseUp)
                        }
                    }, {
                        key: "_onMouseUp",
                        value: function (t) {
                            var e = this;
                            window.removeEventListener("mousemove", this._onMouseMove), window.removeEventListener("mouseup", this._onMouseUp), document.body.removeEventListener("touchmove", this._onTouchMove), document.body.removeEventListener("touchend", this._onMouseUp), this._mouseDown && this._hasInertia && Date.now() - this._mouseMoveTime < 300 && this._updateInertia(), setTimeout(function () {
                                e._mouseDown || (e._dragging = !1)
                            }, 350), this._mouseDown = !1
                        }
                    }, {
                        key: "sendMouseDown",
                        value: function (t) {
                            this._onMouseDown(t)
                        }
                    }, {
                        key: "_onClick",
                        value: function (t) {
                            this._dragging || (this._velocity = {
                                x: 0,
                                y: 0
                            }, this._mouseDown = !1, this._cachedPosition = t, document.removeEventListener("mousemove", this._onMouseMove), document.removeEventListener("mouseup", this._onMouseUp), document.body.removeEventListener("touchmove", this._onTouchMove), document.body.removeEventListener("touchend", this._onMouseUp))
                        }
                    }, {
                        key: "_onMouseDown",
                        value: function (t) {
                            this._mouseDownTime = Date.now();
                            var e = t;
                            if (t.touches) {
                                if (1 !== t.touches.length) return;
                                e = t.touches[0]
                            }
                            this._cachedPosition = t, window.addEventListener("mousemove", this._onMouseMove), window.addEventListener("mouseup", this._onMouseUp), document.body.addEventListener("touchmove", this._onTouchMove, {
                                passive: !1
                            }), document.body.addEventListener("touchend", this._onMouseUp), this._mouseDown = !0, this._lastMouseX = e.clientX, this._lastMouseY = e.clientY, this._lastMouseDownLon = r(this._lon), this._lastMouseDownLat = this._lat
                        }
                    }, {
                        key: "_onTouchMove",
                        value: function (t) {
                            t.cancelable && t.preventDefault(), this._onMouseMove(t)
                        }
                    }, {
                        key: "_onMouseMove",
                        value: function (t) {
                            if (this._mouseDown) {
                                this._dragging = !0;
                                var e = t;
                                if (t.touches && (e = t.touches[0]), this._cachedPosition.clientX !== e.clientX || this._cachedPosition.clientY !== e.clientY) {
                                    var i = this._lastMouseX - e.clientX,
                                        n = this._lastMouseY - e.clientY,
                                        o = i / this._viewerWidth,
                                        s = n / this._viewerHeight;
                                    if (this._cachedPosition) {
                                        var a = this._cachedPosition.clientX - e.clientX,
                                            c = this._cachedPosition.clientY - e.clientY;
                                        this._velocity.x = Math.max(Math.min(a, this._maxVelocity), -this._maxVelocity), this._velocity.y = Math.max(Math.min(c, this._maxVelocity), -this._maxVelocity)
                                    }
                                    this._lon = r(135 * o + this._lastMouseDownLon), this._lat = 90 * s + this._lastMouseDownLat, this._cachedPosition = e, this._mouseMoveTime = Date.now()
                                }
                            }
                        }
                    }, {
                        key: "setViewerSize",
                        value: function (t, e) {
                            this._viewerWidth = t, this._viewerHeight = e
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._removeEventListeners()
                        }
                    }, {
                        key: "isActive",
                        get: function () {
                            return this._mouseDown || this._hasInertia && (Math.abs(this._velocity.x) > this._minVelocity || Math.abs(this._velocity.y) > this._minVelocity)
                        }
                    }, {
                        key: "scale",
                        get: function () {
                            return this._scale
                        }
                    }]), e
                }();
            e.exports = a
        }, {
            "../utils/normalizeLongitude": 20,
            "./InertialControls": 14
        }],
        17: [function (t, e, i) {
            "use strict";
            var n = t("./normalizeLongitude");
            e.exports = function (t) {
                var e = t;
                return Math.abs(e) > 180 ? n(e) : e > 0 ? -360 + e : 360 + e
            }
        }, {
            "./normalizeLongitude": 20
        }],
        18: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                return new Promise(function (e, i) {
                    var n = document.createElement("script");
                    n.type = "text/javascript", n.src = t, n.onload = e, n.onerror = i;
                    try {
                        document.body.appendChild(n)
                    } catch (t) {
                        i(t)
                    }
                })
            }
        }, {}],
        19: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e, i, n, r) {
                return n + (r - n) * (t - e) / (i - e)
            }
        }, {}],
        20: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                var e = t;
                return e > 180 ? e = e % 180 - 180 : e <= -180 && (e = e % 180 + 180), e
            }
        }, {}],
        21: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-raf-emitter/update");
            e.exports = function (t, e) {
                return new Promise(function (i) {
                    var r = performance.now();
                    n(function o() {
                        var s = (performance.now() - r) / t;
                        s >= 1 ? (e(1), i()) : (s, e(s), n(o))
                    })
                })
            }
        }, {
            "@marcom/ac-raf-emitter/update": 10
        }],
        22: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e, i) {
                var n = THREE.Math.degToRad(90 - t),
                    r = THREE.Math.degToRad(e),
                    o = i * Math.sin(n) * Math.cos(r),
                    s = i * Math.cos(n),
                    a = i * Math.sin(n) * Math.sin(r);
                return new THREE.Vector3(o, s, a)
            }
        }, {}],
        23: [function (t, e, i) {
            "use strict";
            var n = t("./helpers/TabManager"),
                r = t("./helpers/hideSiblingElements"),
                o = t("./helpers/showSiblingElements"),
                s = function (t, e) {
                    e = e || {}, this._tabbables = null, this._excludeHidden = e.excludeHidden, this._firstTabbableElement = e.firstFocusElement, this._lastTabbableElement = null, this._relatedTarget = null, this.el = t, this._handleOnFocus = this._handleOnFocus.bind(this)
                },
                a = s.prototype;
            a.start = function () {
                this.updateTabbables(), r(this.el, null, this._excludeHidden), this._firstTabbableElement ? this.el.contains(document.activeElement) || this._firstTabbableElement.focus() : console.warn("this._firstTabbableElement is null, CircularTab needs at least one tabbable element."), this._relatedTarget = document.activeElement, document.addEventListener("focus", this._handleOnFocus, !0)
            }, a.stop = function () {
                o(this.el), document.removeEventListener("focus", this._handleOnFocus, !0)
            }, a.updateTabbables = function () {
                this._tabbables = n.getTabbableElements(this.el, this._excludeHidden), this._firstTabbableElement = this._firstTabbableElement || this._tabbables[0], this._lastTabbableElement = this._tabbables[this._tabbables.length - 1]
            }, a._handleOnFocus = function (t) {
                if (this.el.contains(t.target)) this._relatedTarget = t.target;
                else {
                    if (t.preventDefault(), this.updateTabbables(), this._relatedTarget === this._lastTabbableElement || null === this._relatedTarget) return this._firstTabbableElement.focus(), void(this._relatedTarget = this._firstTabbableElement);
                    if (this._relatedTarget === this._firstTabbableElement && this._lastTabbableElement) return this._lastTabbableElement.focus(), void(this._relatedTarget = this._lastTabbableElement)
                }
            }, a.destroy = function () {
                this.stop(), this.el = null, this._tabbables = null, this._firstTabbableElement = null, this._lastTabbableElement = null, this._relatedTarget = null, this._handleOnFocus = null
            }, e.exports = s
        }, {
            "./helpers/TabManager": 24,
            "./helpers/hideSiblingElements": 26,
            "./helpers/showSiblingElements": 29
        }],
        24: [function (t, e, i) {
            "use strict";
            var n = t("./../maps/focusableElement"),
                r = function () {
                    this.focusableSelectors = n.selectors
                },
                o = r.prototype;
            o.isFocusableElement = function (t, e, i) {
                return !(e && !this._isDisplayed(t)) && (n.nodeName[t.nodeName] ? !t.disabled : !t.contentEditable || (i = i || parseFloat(t.getAttribute("tabindex")), !isNaN(i)))
            }, o.isTabbableElement = function (t, e) {
                if (e && !this._isDisplayed(t)) return !1;
                var i = t.getAttribute("tabindex");
                return i = parseFloat(i), isNaN(i) ? this.isFocusableElement(t, e, i) : i >= 0
            }, o._isDisplayed = function (t) {
                var e = t.getBoundingClientRect();
                return (0 !== e.top || 0 !== e.left || 0 !== e.width || 0 !== e.height) && "hidden" !== window.getComputedStyle(t).visibility
            }, o.getTabbableElements = function (t, e) {
                for (var i = t.querySelectorAll(this.focusableSelectors), n = i.length, r = [], o = 0; o < n; o++) this.isTabbableElement(i[o], e) && r.push(i[o]);
                return r
            }, o.getFocusableElements = function (t, e) {
                for (var i = t.querySelectorAll(this.focusableSelectors), n = i.length, r = [], o = 0; o < n; o++) this.isFocusableElement(i[o], e) && r.push(i[o]);
                return r
            }, e.exports = new r
        }, {
            "./../maps/focusableElement": 31
        }],
        25: [function (t, e, i) {
            "use strict";
            var n = t("./../maps/ariaMap"),
                r = t("./TabManager"),
                o = function (t, e) {
                    var i = t.getAttribute("data-original-" + e);
                    i || (i = t.getAttribute(e) || "", t.setAttribute("data-original-" + e, i))
                };
            e.exports = function (t, e) {
                if (r.isFocusableElement(t, e)) o(t, "tabindex"), t.setAttribute("tabindex", "-1");
                else
                    for (var i = r.getTabbableElements(t, e), s = i.length; s--;) o(i[s], "tabindex"), i[s].setAttribute("tabindex", "-1");
                o(t, n.HIDDEN), t.setAttribute(n.HIDDEN, "true")
            }
        }, {
            "./../maps/ariaMap": 30,
            "./TabManager": 24
        }],
        26: [function (t, e, i) {
            "use strict";
            var n = t("./hide");
            e.exports = function t(e, i, r) {
                i = i || document.body;
                for (var o = e, s = e; o = o.previousElementSibling;) n(o, r);
                for (; s = s.nextElementSibling;) n(s, r);
                e.parentElement && e.parentElement !== i && t(e.parentElement, i, r)
            }
        }, {
            "./hide": 25
        }],
        27: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e) {
                let i;
                i = t instanceof NodeList ? t : [].concat(t), e = Array.isArray(e) ? e : [].concat(e), i.forEach(t => {
                    e.forEach(e => {
                        t.removeAttribute(e)
                    })
                })
            }
        }, {}],
        28: [function (t, e, i) {
            "use strict";
            var n = t("./removeAttributes"),
                r = t("./../maps/ariaMap"),
                o = "data-original-",
                s = function (t, e) {
                    var i = t.getAttribute(o + e);
                    null !== i && ("" === i ? n(t, e) : t.setAttribute(e, i), n(t, o + e))
                };
            e.exports = function (t) {
                s(t, "tabindex"), s(t, r.HIDDEN);
                for (var e = t.querySelectorAll(`[${o+"tabindex"}]`), i = e.length; i--;) s(e[i], "tabindex")
            }
        }, {
            "./../maps/ariaMap": 30,
            "./removeAttributes": 27
        }],
        29: [function (t, e, i) {
            "use strict";
            var n = t("./show");
            e.exports = function t(e, i) {
                i = i || document.body;
                for (var r = e, o = e; r = r.previousElementSibling;) n(r);
                for (; o = o.nextElementSibling;) n(o);
                e.parentElement && e.parentElement !== i && t(e.parentElement, i)
            }
        }, {
            "./show": 28
        }],
        30: [function (t, e, i) {
            "use strict";
            e.exports = {
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
        31: [function (t, e, i) {
            "use strict";
            e.exports = {
                selectors: ["input", "select", "textarea", "button", "optgroup", "option", "menuitem", "fieldset", "object", "a[href]", "[tabindex]", "[contenteditable]"].join(","),
                nodeName: {
                    INPUT: "input",
                    SELECT: "select",
                    TEXTAREA: "textarea",
                    BUTTON: "button",
                    OPTGROUP: "optgroup",
                    OPTION: "option",
                    MENUITEM: "menuitem",
                    FIELDSET: "fieldset",
                    OBJECT: "object",
                    A: "a"
                }
            }
        }, {}],
        32: [function (t, e, i) {
            "use strict";
            var n = t("./request/factory"),
                r = {
                    complete: function (t, e) {},
                    error: function (t, e) {},
                    method: "GET",
                    headers: {},
                    success: function (t, e, i) {},
                    timeout: 5e3
                },
                o = {
                    ajax: function (t, e) {
                        e = function () {
                            for (var t = 1; t < arguments.length; t++)
                                for (var e in arguments[t]) arguments[t].hasOwnProperty(e) && (arguments[0][e] = arguments[t][e]);
                            return arguments[0]
                        }({}, r, e), "//" === t.substr(0, 2) && (t = window.location.protocol + t);
                        var i = n(t);
                        return i.open(e.method, t), i.setTransportHeaders(e.headers), i.setReadyStateChangeHandlers(e.complete, e.error, e.success), i.setTimeout(e.timeout, e.error, e.complete), i.send(e.data), i
                    },
                    get: function (t, e) {
                        return e.method = "GET", o.ajax(t, e)
                    },
                    head: function (t, e) {
                        return e.method = "HEAD", o.ajax(t, e)
                    },
                    post: function (t, e) {
                        return e.method = "POST", o.ajax(t, e)
                    }
                };
            e.exports = o
        }, {
            "./request/factory": 33
        }],
        33: [function (t, e, i) {
            "use strict";
            var n = t("./xmlhttprequest"),
                r = t("./xdomainrequest"),
                o = /.*(?=:\/\/)/,
                s = /^.*:\/\/|\/.+$/g,
                a = window.XDomainRequest && document.documentMode < 10;
            e.exports = function (t, e) {
                return new(a && function (t) {
                    return !!t.match(o) && t.replace(s, "") !== window.location.hostname
                }(t) ? r : n)
            }
        }, {
            "./xdomainrequest": 35,
            "./xmlhttprequest": 36
        }],
        34: [function (t, e, i) {
            "use strict";
            var n = function () {};
            n.create = function () {
                var t = function () {};
                return t.prototype = n.prototype, new t
            }, n.prototype.open = function (t, e) {
                t = t.toUpperCase(), this.xhr.open(t, e)
            }, n.prototype.send = function (t) {
                this.xhr.send(t)
            }, n.prototype.setTimeout = function (t, e, i) {
                this.xhr.ontimeout = function () {
                    e(this.xhr, this.status), i(this.xhr, this.status)
                }.bind(this)
            }, n.prototype.setTransportHeaders = function (t) {
                for (var e in t) this.xhr.setRequestHeader(e, t[e])
            }, e.exports = n
        }, {}],
        35: [function (t, e, i) {
            "use strict";
            var n = t("./request"),
                r = t("@marcom/ac-object/toQueryParameters"),
                o = function () {
                    this.xhr = new XDomainRequest
                };
            (o.prototype = n.create()).setReadyStateChangeHandlers = function (t, e, i) {
                this.xhr.onerror = function () {
                    e(this.xhr, this.status), t(this.xhr, this.status)
                }.bind(this), this.xhr.onload = function () {
                    i(this.xhr.responseText, this.xhr.status, this.xhr), t(this.xhr, this.status)
                }.bind(this)
            }, o.prototype.send = function (t) {
                t && "object" == typeof t && (t = r(t)), this.xhr.send(t)
            }, o.prototype.setTransportHeaders = function (t) {}, e.exports = o
        }, {
            "./request": 34,
            "@marcom/ac-object/toQueryParameters": 130
        }],
        36: [function (t, e, i) {
            "use strict";
            var n = t("./request"),
                r = function () {
                    this.xhr = new XMLHttpRequest
                };
            (r.prototype = n.create()).setReadyStateChangeHandlers = function (t, e, i) {
                this.xhr.onreadystatechange = function (n) {
                    4 === this.xhr.readyState && (clearTimeout(this.timeout), this.xhr.status >= 200 && this.xhr.status < 300 ? (i(this.xhr.responseText, this.xhr.status, this.xhr), t(this.xhr, this.status)) : (e(this.xhr, this.status), t(this.xhr, this.status)))
                }.bind(this)
            }, e.exports = r
        }, {
            "./request": 34
        }],
        37: [function (t, e, i) {
            "use strict";
            e.exports = {
                log: t("./ac-console/log")
            }
        }, {
            "./ac-console/log": 38
        }],
        38: [function (t, e, i) {
            "use strict";
            var n = !! function () {
                try {
                    return window.localStorage.getItem("f7c9180f-5c45-47b4-8de4-428015f096c0")
                } catch (t) {}
            }();
            e.exports = function () {
                window.console && void 0 !== console.log && n && console.log.apply(console, Array.prototype.slice.call(arguments, 0))
            }
        }, {}],
        39: [function (t, e, i) {
            "use strict";
            var n, r = t("@marcom/ac-object/extend"),
                o = t("@marcom/ac-object/create"),
                s = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                a = t("@marcom/ac-dom-traversal/querySelectorAll"),
                c = t("@marcom/ac-dom-events/addEventListener"),
                l = t("@marcom/ac-dom-events/removeEventListener"),
                u = t("@marcom/ac-console");
            try {
                n = t("@marcom/ac-analytics")
            } catch (t) {
                u.log(t.message)
            }
            var h = {
                    dataAttribute: "analytics-share",
                    interactionEvents: ["click"],
                    autoEnable: !0
                },
                d = function (t) {
                    t = t || {}, this.options = r(h, t), s.call(this), this.elements = [], this.eventObserver = null, this.publishShareClick = this.publishShareClick.bind(this), this.options.autoEnable && this.enable()
                },
                p = s.prototype,
                f = d.prototype = o(p);
            f.enable = function () {
                if (!n) return !1;
                this._createObserver(), this.bindEventListener()
            }, f.disable = function () {
                if (!n) return !1;
                this.unbindEventListener()
            }, f.bindEventListener = function () {
                var t;
                this.elements = this.populateElements(), t = this.elements.length;
                for (var e = 0; e < t; e++) c(this.elements[e], "click", this.publishShareClick)
            }, f.unbindEventListener = function () {
                for (var t = this.elements && this.elements.length ? this.elements.length : 0, e = 0; e < t; e++) l(this.elements[e], "click", this.publishShareClick)
            }, f.populateElements = function () {
                return a("[data-" + this.options.dataAttribute + "]", this.options.context || document)
            }, f.publishShareClick = function (t) {
                var e = t.currentTarget,
                    i = this.parseDataAttribute(e.getAttribute("data-" + this.options.dataAttribute));
                if ("object" == typeof i) {
                    if (!i.title) return console.log("data-" + this.options.dataAttribute + " attribute must have a `title` property"), !1;
                    this.trigger("click", i)
                }
            }, f.parseDataAttribute = function (t) {
                var e = {};
                try {
                    e = JSON.parse(t)
                } catch (t) {
                    console.log("data-" + this.options.dataAttribute + " must be a valid JSON string")
                }
                return e
            }, f.destroy = function () {
                this.disable(), this.elements = [], this.eventObserver = null, this.publishShareClick = null, this.options = null
            }, f._createObserver = function () {
                if (!n || !n.observer || !n.observer.Event) return !1;
                this.eventObserver = new n.observer.Event(this, this.options)
            }, e.exports = d
        }, {
            "@marcom/ac-analytics": "@marcom/ac-analytics",
            "@marcom/ac-console": 37,
            "@marcom/ac-dom-events/addEventListener": 54,
            "@marcom/ac-dom-events/removeEventListener": 58,
            "@marcom/ac-dom-traversal/querySelectorAll": 82,
            "@marcom/ac-event-emitter-micro": 88,
            "@marcom/ac-object/create": 123,
            "@marcom/ac-object/extend": 125
        }],
        40: [function (t, e, i) {
            "use strict";
            var n = t("./../AnalyticsShare");
            e.exports = function (t) {
                return new n(t)
            }
        }, {
            "./../AnalyticsShare": 39
        }],
        41: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/Array/prototype.slice"), t("@marcom/ac-polyfills/Element/prototype.classList");
            var n = t("./className/add");
            e.exports = function () {
                var t, e = Array.prototype.slice.call(arguments),
                    i = e.shift(e);
                if (i.classList && i.classList.add) i.classList.add.apply(i.classList, e);
                else
                    for (t = 0; t < e.length; t++) n(i, e[t])
            }
        }, {
            "./className/add": 42,
            "@marcom/ac-polyfills/Array/prototype.slice": 135,
            "@marcom/ac-polyfills/Element/prototype.classList": 138
        }],
        42: [function (t, e, i) {
            "use strict";
            var n = t("./contains");
            e.exports = function (t, e) {
                n(t, e) || (t.className += " " + e)
            }
        }, {
            "./contains": 43
        }],
        43: [function (t, e, i) {
            "use strict";
            var n = t("./getTokenRegExp");
            e.exports = function (t, e) {
                return n(e).test(t.className)
            }
        }, {
            "./getTokenRegExp": 44
        }],
        44: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                return new RegExp("(\\s|^)" + t + "(\\s|$)")
            }
        }, {}],
        45: [function (t, e, i) {
            "use strict";
            var n = t("./contains"),
                r = t("./getTokenRegExp");
            e.exports = function (t, e) {
                n(t, e) && (t.className = t.className.replace(r(e), "$1").trim())
            }
        }, {
            "./contains": 43,
            "./getTokenRegExp": 44
        }],
        46: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/Array/prototype.slice"), t("@marcom/ac-polyfills/Element/prototype.classList");
            var n = t("./className/remove");
            e.exports = function () {
                var t, e = Array.prototype.slice.call(arguments),
                    i = e.shift(e);
                if (i.classList && i.classList.remove) i.classList.remove.apply(i.classList, e);
                else
                    for (t = 0; t < e.length; t++) n(i, e[t])
            }
        }, {
            "./className/remove": 45,
            "@marcom/ac-polyfills/Array/prototype.slice": 135,
            "@marcom/ac-polyfills/Element/prototype.classList": 138
        }],
        47: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                if ("function" == typeof t.select) {
                    t.select() || t.setSelectionRange(0, t.value.length)
                } else {
                    var e = document.createRange();
                    e.selectNodeContents(t);
                    var i = window.getSelection();
                    i.removeAllRanges(), i.addRange(e)
                }
            }
        }, {}],
        48: [function (t, e, i) {
            "use strict";
            var n = !1,
                r = window || self;
            try {
                n = !!r.localStorage.getItem("f7c9180f-5c45-47b4-8de4-428015f096c0")
            } catch (t) {}
            e.exports = n
        }, {}],
        49: [function (t, e, i) {
            "use strict";
            var n = t("../enabled");
            e.exports = function (t) {
                return function () {
                    if (n && "object" == typeof window.console && "function" == typeof console[t]) return console[t].apply(console, Array.prototype.slice.call(arguments, 0))
                }
            }
        }, {
            "../enabled": 48
        }],
        50: [function (t, e, i) {
            "use strict";
            e.exports = t("./internal/expose")("log")
        }, {
            "./internal/expose": 49
        }],
        51: [function (t, e, i) {
            "use strict";
            e.exports = {
                DOMEmitter: t("./ac-dom-emitter/DOMEmitter")
            }
        }, {
            "./ac-dom-emitter/DOMEmitter": 52
        }],
        52: [function (t, e, i) {
            "use strict";
            var n, r = t("ac-event-emitter").EventEmitter,
                o = t("./DOMEmitterEvent"),
                s = {
                    addEventListener: t("@marcom/ac-dom-events/addEventListener"),
                    removeEventListener: t("@marcom/ac-dom-events/removeEventListener"),
                    dispatchEvent: t("@marcom/ac-dom-events/dispatchEvent")
                },
                a = {
                    querySelectorAll: t("@marcom/ac-dom-traversal/querySelectorAll"),
                    matchesSelector: t("@marcom/ac-dom-traversal/matchesSelector")
                };

            function c(t) {
                null !== t && (this.el = t, this._bindings = {}, this._delegateFuncs = {}, this._eventEmitter = new r)
            }(n = c.prototype).on = function () {
                return this._normalizeArgumentsAndCall(Array.prototype.slice.call(arguments, 0), this._on), this
            }, n.once = function () {
                return this._normalizeArgumentsAndCall(Array.prototype.slice.call(arguments, 0), this._once), this
            }, n.off = function () {
                return this._normalizeArgumentsAndCall(Array.prototype.slice.call(arguments, 0), this._off), this
            }, n.has = function (t, e, i, n) {
                var r, o;
                return "string" == typeof e ? (r = e, o = i) : (o = e, n = i), r ? this._getDelegateFuncBindingIdx(t, r, o, n, !0) > -1 : !(!this._eventEmitter || !this._eventEmitter.has.apply(this._eventEmitter, arguments))
            }, n.trigger = function (t, e, i, n) {
                t = this._parseEventNames(t);
                var r, o, s, a = (t = this._cleanStringData(t)).length;
                for ("string" == typeof e ? (r = this._cleanStringData(e), o = i) : (o = e, i), s = 0; s < a; s++) this._triggerDOMEvents(t[s], o, r);
                return this
            }, n.emitterTrigger = function (t, e, i) {
                if (!this._eventEmitter) return this;
                t = this._parseEventNames(t), t = this._cleanStringData(t), e = new o(e, this);
                var n, r = t.length;
                for (n = 0; n < r; n++) this._eventEmitter.trigger(t[n], e, i);
                return this
            }, n.propagateTo = function (t, e) {
                return this._eventEmitter.propagateTo(t, e), this
            }, n.stopPropagatingTo = function (t) {
                return this._eventEmitter.stopPropagatingTo(t), this
            }, n.stopImmediatePropagation = function () {
                return this._eventEmitter.stopImmediatePropagation(), this
            }, n.destroy = function () {
                var t;
                for (t in this._triggerInternalEvent("willdestroy"), this.off(), this) this.hasOwnProperty(t) && (this[t] = null)
            }, n._parseEventNames = function (t) {
                return t ? t.split(" ") : [t]
            }, n._onListenerEvent = function (t, e) {
                var i = new o(e, this);
                this._eventEmitter.trigger(t, i, !1)
            }, n._setListener = function (t) {
                this._bindings[t] = this._onListenerEvent.bind(this, t), s.addEventListener(this.el, t, this._bindings[t])
            }, n._removeListener = function (t) {
                s.removeEventListener(this.el, t, this._bindings[t]), this._bindings[t] = null
            }, n._triggerInternalEvent = function (t, e) {
                this.emitterTrigger("dom-emitter:" + t, e)
            }, n._normalizeArgumentsAndCall = function (t, e) {
                var i = {};
                if (0 !== t.length) {
                    if ("string" == typeof t[0] || null === t[0]) return t = this._cleanStringData(t), i.events = t[0], "string" == typeof t[1] ? (i.delegateQuery = t[1], i.callback = t[2], i.context = t[3]) : (i.callback = t[1], i.context = t[2]), void e.call(this, i);
                    var n, r, o = t[0];
                    for (n in o) o.hasOwnProperty(n) && (i = {}, r = this._cleanStringData(n.split(":")), i.events = r[0], i.delegateQuery = r[1], i.callback = o[n], i.context = t[1], e.call(this, i))
                } else e.call(this, i)
            }, n._registerDelegateFunc = function (t, e, i, n, r) {
                var o = this._delegateFunc.bind(this, t, e, i, r);
                return this._delegateFuncs[e] = this._delegateFuncs[e] || {}, this._delegateFuncs[e][t] = this._delegateFuncs[e][t] || [], this._delegateFuncs[e][t].push({
                    func: n,
                    context: r,
                    delegateFunc: o
                }), o
            }, n._cleanStringData = function (t) {
                var e = !1;
                "string" == typeof t && (t = [t], e = !0);
                var i, n, r, o = [],
                    s = t.length;
                for (i = 0; i < s; i++) {
                    if ("string" == typeof (n = t[i])) {
                        if ("" === n || " " === n) continue;
                        for (r = n.length;
                            " " === n[0];) n = n.slice(1, r), r--;
                        for (;
                            " " === n[r - 1];) n = n.slice(0, r - 1), r--
                    }
                    o.push(n)
                }
                return e ? o[0] : o
            }, n._unregisterDelegateFunc = function (t, e, i, n) {
                if (this._delegateFuncs[e] && this._delegateFuncs[e][t]) {
                    var r, o = this._getDelegateFuncBindingIdx(t, e, i, n);
                    return o > -1 && (r = this._delegateFuncs[e][t][o].delegateFunc, this._delegateFuncs[e][t].splice(o, 1), 0 === this._delegateFuncs[e][t].length && (this._delegateFuncs[e][t] = null)), r
                }
            }, n._unregisterDelegateFuncs = function (t, e) {
                var i;
                if (this._delegateFuncs[e] && (null === t || this._delegateFuncs[e][t]))
                    if (null !== t) this._unbindDelegateFunc(t, e);
                    else
                        for (i in this._delegateFuncs[e]) this._delegateFuncs[e].hasOwnProperty(i) && this._unbindDelegateFunc(i, e)
            }, n._unbindDelegateFunc = function (t, e) {
                for (var i, n, r = 0; this._delegateFuncs[e][t] && this._delegateFuncs[e][t][r];) i = this._delegateFuncs[e][t][r], n = this._delegateFuncs[e][t][r].length, this._off({
                    events: t,
                    delegateQuery: e,
                    callback: i.func,
                    context: i.context
                }), this._delegateFuncs[e][t] && n === this._delegateFuncs[e][t].length && r++;
                i = n = null
            }, n._unregisterDelegateFuncsByEvent = function (t) {
                var e;
                for (e in this._delegateFuncs) this._delegateFuncs.hasOwnProperty(e) && this._unregisterDelegateFuncs(t, e)
            }, n._delegateFunc = function (t, e, i, n, r) {
                if (this._targetHasDelegateAncestor(r.target, e)) {
                    var o = Array.prototype.slice.call(arguments, 0),
                        s = o.slice(4, o.length);
                    n = n || window, "object" == typeof r.detail && (s[0] = r.detail), i.apply(n, s)
                }
            }, n._targetHasDelegateAncestor = function (t, e) {
                for (var i = t; i && i !== this.el && i !== document.documentElement;) {
                    if (a.matchesSelector(i, e)) return !0;
                    i = i.parentNode
                }
                return !1
            }, n._on = function (t) {
                var e = t.events,
                    i = t.callback,
                    n = t.delegateQuery,
                    r = t.context,
                    o = t.unboundCallback || i;
                (e = this._parseEventNames(e)).forEach(function (t, e, i, n, r) {
                    this.has(r) || this._setListener(r), "string" == typeof n && (t = this._registerDelegateFunc(r, n, t, e, i)), this._triggerInternalEvent("willon", {
                        evt: r,
                        callback: t,
                        context: i,
                        delegateQuery: n
                    }), this._eventEmitter.on(r, t, i), this._triggerInternalEvent("didon", {
                        evt: r,
                        callback: t,
                        context: i,
                        delegateQuery: n
                    })
                }.bind(this, i, o, r, n)), e = i = o = n = r = null
            }, n._off = function (t) {
                var e = t.events,
                    i = t.callback,
                    n = t.delegateQuery,
                    r = t.context,
                    o = t.unboundCallback || i;
                if (void 0 !== e)(e = this._parseEventNames(e)).forEach(function (t, e, i, n, r) {
                    ("string" != typeof n || "function" != typeof e || (t = this._unregisterDelegateFunc(r, n, e, i))) && ("string" != typeof n || void 0 !== t ? "string" == typeof r && void 0 === t && (this._unregisterDelegateFuncsByEvent(r), "string" == typeof n) || (this._triggerInternalEvent("willoff", {
                        evt: r,
                        callback: t,
                        context: i,
                        delegateQuery: n
                    }), this._eventEmitter.off(r, t, i), this._triggerInternalEvent("didoff", {
                        evt: r,
                        callback: t,
                        context: i,
                        delegateQuery: n
                    }), this.has(r) || this._removeListener(r)) : this._unregisterDelegateFuncs(r, n))
                }.bind(this, i, o, r, n)), e = i = o = n = r = null;
                else {
                    var s;
                    for (s in this._eventEmitter.off(), this._bindings) this._bindings.hasOwnProperty(s) && this._removeListener(s);
                    for (s in this._delegateFuncs) this._delegateFuncs.hasOwnProperty(s) && (this._delegateFuncs[s] = null)
                }
            }, n._once = function (t) {
                var e = t.events,
                    i = t.callback,
                    n = t.delegateQuery,
                    r = t.context;
                (e = this._parseEventNames(e)).forEach(function (t, e, i, n) {
                    if ("string" == typeof i) return this._handleDelegateOnce(n, t, e, i);
                    this.has(n) || this._setListener(n), this._triggerInternalEvent("willonce", {
                        evt: n,
                        callback: t,
                        context: e,
                        delegateQuery: i
                    }), this._eventEmitter.once.call(this, n, t, e), this._triggerInternalEvent("didonce", {
                        evt: n,
                        callback: t,
                        context: e,
                        delegateQuery: i
                    })
                }.bind(this, i, r, n)), e = i = n = r = null
            }, n._handleDelegateOnce = function (t, e, i, n) {
                return this._triggerInternalEvent("willonce", {
                    evt: t,
                    callback: e,
                    context: i,
                    delegateQuery: n
                }), this._on({
                    events: t,
                    context: i,
                    delegateQuery: n,
                    callback: this._getDelegateOnceCallback.bind(this, t, e, i, n),
                    unboundCallback: e
                }), this._triggerInternalEvent("didonce", {
                    evt: t,
                    callback: e,
                    context: i,
                    delegateQuery: n
                }), this
            }, n._getDelegateOnceCallback = function (t, e, i, n) {
                var r = Array.prototype.slice.call(arguments, 0),
                    o = r.slice(4, r.length);
                e.apply(i, o), this._off({
                    events: t,
                    delegateQuery: n,
                    callback: e,
                    context: i
                })
            }, n._getDelegateFuncBindingIdx = function (t, e, i, n, r) {
                var o = -1;
                if (this._delegateFuncs[e] && this._delegateFuncs[e][t]) {
                    var s, a, c = this._delegateFuncs[e][t].length;
                    for (s = 0; s < c; s++)
                        if (a = this._delegateFuncs[e][t][s], r && void 0 === i && (i = a.func), a.func === i && a.context === n) {
                            o = s;
                            break
                        }
                }
                return o
            }, n._triggerDOMEvents = function (t, e, i) {
                var n = [this.el];
                i && (n = a.querySelectorAll(i, this.el));
                var r, o = n.length;
                for (r = 0; r < o; r++) s.dispatchEvent(n[r], t, {
                    bubbles: !0,
                    cancelable: !0,
                    detail: e
                })
            }, e.exports = c
        }, {
            "./DOMEmitterEvent": 53,
            "@marcom/ac-dom-events/addEventListener": 54,
            "@marcom/ac-dom-events/dispatchEvent": 55,
            "@marcom/ac-dom-events/removeEventListener": 58,
            "@marcom/ac-dom-traversal/matchesSelector": 81,
            "@marcom/ac-dom-traversal/querySelectorAll": 82,
            "ac-event-emitter": 307
        }],
        53: [function (t, e, i) {
            "use strict";
            var n, r = {
                    preventDefault: t("@marcom/ac-dom-events/preventDefault"),
                    stopPropagation: t("@marcom/ac-dom-events/stopPropagation"),
                    target: t("@marcom/ac-dom-events/target")
                },
                o = function (t, e) {
                    this._domEmitter = e, this.originalEvent = t || {}, this._originalTarget = r.target(this.originalEvent), this.target = this._originalTarget || this._domEmitter.el, this.currentTarget = this._domEmitter.el, this.timeStamp = this.originalEvent.timeStamp || Date.now(), this._isDOMEvent(this.originalEvent) ? "object" == typeof this.originalEvent.detail && (this.data = this.originalEvent.detail) : t && (this.data = this.originalEvent, this.originalEvent = {})
                };
            (n = o.prototype).preventDefault = function () {
                r.preventDefault(this.originalEvent)
            }, n.stopPropagation = function () {
                r.stopPropagation(this.originalEvent)
            }, n.stopImmediatePropagation = function () {
                this.originalEvent.stopImmediatePropagation && this.originalEvent.stopImmediatePropagation(), this._domEmitter.stopImmediatePropagation()
            }, n._isDOMEvent = function (t) {
                return !!(this._originalTarget || "undefined" !== document.createEvent && "undefined" != typeof CustomEvent && t instanceof CustomEvent)
            }, e.exports = o
        }, {
            "@marcom/ac-dom-events/preventDefault": 57,
            "@marcom/ac-dom-events/stopPropagation": 61,
            "@marcom/ac-dom-events/target": 62
        }],
        54: [function (t, e, i) {
            "use strict";
            var n = t("./utils/addEventListener"),
                r = t("./shared/getEventType");
            e.exports = function (t, e, i, o) {
                return e = r(t, e), n(t, e, i, o)
            }
        }, {
            "./shared/getEventType": 59,
            "./utils/addEventListener": 63
        }],
        55: [function (t, e, i) {
            "use strict";
            var n = t("./utils/dispatchEvent"),
                r = t("./shared/getEventType");
            e.exports = function (t, e, i) {
                return e = r(t, e), n(t, e, i)
            }
        }, {
            "./shared/getEventType": 59,
            "./utils/dispatchEvent": 64
        }],
        56: [function (t, e, i) {
            "use strict";
            e.exports = {
                addEventListener: t("./addEventListener"),
                dispatchEvent: t("./dispatchEvent"),
                preventDefault: t("./preventDefault"),
                removeEventListener: t("./removeEventListener"),
                stop: t("./stop"),
                stopPropagation: t("./stopPropagation"),
                target: t("./target")
            }
        }, {
            "./addEventListener": 54,
            "./dispatchEvent": 55,
            "./preventDefault": 57,
            "./removeEventListener": 58,
            "./stop": 60,
            "./stopPropagation": 61,
            "./target": 62
        }],
        57: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                (t = t || window.event).preventDefault ? t.preventDefault() : t.returnValue = !1
            }
        }, {}],
        58: [function (t, e, i) {
            "use strict";
            var n = t("./utils/removeEventListener"),
                r = t("./shared/getEventType");
            e.exports = function (t, e, i, o) {
                return e = r(t, e), n(t, e, i, o)
            }
        }, {
            "./shared/getEventType": 59,
            "./utils/removeEventListener": 65
        }],
        59: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-prefixer/getEventType");
            e.exports = function (t, e) {
                var i;
                return i = "tagName" in t ? t.tagName : t === window ? "window" : "document", n(e, i) || e
            }
        }, {
            "@marcom/ac-prefixer/getEventType": 140
        }],
        60: [function (t, e, i) {
            "use strict";
            var n = t("./stopPropagation"),
                r = t("./preventDefault");
            e.exports = function (t) {
                t = t || window.event, n(t), r(t), t.stopped = !0, t.returnValue = !1
            }
        }, {
            "./preventDefault": 57,
            "./stopPropagation": 61
        }],
        61: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                (t = t || window.event).stopPropagation ? t.stopPropagation() : t.cancelBubble = !0
            }
        }, {}],
        62: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                return void 0 !== (t = t || window.event).target ? t.target : t.srcElement
            }
        }, {}],
        63: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e, i, n) {
                return t.addEventListener ? t.addEventListener(e, i, !!n) : t.attachEvent("on" + e, i), t
            }
        }, {}],
        64: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/CustomEvent"), e.exports = function (t, e, i) {
                var n;
                return t.dispatchEvent ? (n = i ? new CustomEvent(e, i) : new CustomEvent(e), t.dispatchEvent(n)) : (n = document.createEventObject(), i && "detail" in i && (n.detail = i.detail), t.fireEvent("on" + e, n)), t
            }
        }, {
            "@marcom/ac-polyfills/CustomEvent": 136
        }],
        65: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e, i, n) {
                return t.removeEventListener ? t.removeEventListener(e, i, !!n) : t.detachEvent("on" + e, i), t
            }
        }, {}],
        66: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                var e;
                if ((t = t || window) === window) {
                    if (e = window.pageXOffset) return e;
                    t = document.documentElement || document.body.parentNode || document.body
                }
                return t.scrollLeft
            }
        }, {}],
        67: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                var e;
                if ((t = t || window) === window) {
                    if (e = window.pageYOffset) return e;
                    t = document.documentElement || document.body.parentNode || document.body
                }
                return t.scrollTop
            }
        }, {}],
        68: [function (t, e, i) {
            "use strict";
            e.exports = 8
        }, {}],
        69: [function (t, e, i) {
            "use strict";
            e.exports = 11
        }, {}],
        70: [function (t, e, i) {
            "use strict";
            e.exports = 9
        }, {}],
        71: [function (t, e, i) {
            "use strict";
            e.exports = 1
        }, {}],
        72: [function (t, e, i) {
            "use strict";
            e.exports = 3
        }, {}],
        73: [function (t, e, i) {
            "use strict";
            var n = t("../isNode");
            e.exports = function (t, e) {
                return !!n(t) && ("number" == typeof e ? t.nodeType === e : -1 !== e.indexOf(t.nodeType))
            }
        }, {
            "../isNode": 77
        }],
        74: [function (t, e, i) {
            "use strict";
            var n = t("./isNodeType"),
                r = t("../COMMENT_NODE"),
                o = t("../DOCUMENT_FRAGMENT_NODE"),
                s = t("../ELEMENT_NODE"),
                a = t("../TEXT_NODE"),
                c = [s, a, r, o],
                l = [s, a, r],
                u = [s, o];
            e.exports = {
                parentNode: function (t, e, i, r) {
                    if (r = r || "target", (t || e) && !n(t, u)) throw new TypeError(i + ": " + r + " must be an Element, or Document Fragment")
                },
                childNode: function (t, e, i, r) {
                    if (r = r || "target", (t || e) && !n(t, l)) throw new TypeError(i + ": " + r + " must be an Element, TextNode, or Comment")
                },
                insertNode: function (t, e, i, r) {
                    if (r = r || "node", (t || e) && !n(t, c)) throw new TypeError(i + ": " + r + " must be an Element, TextNode, Comment, or Document Fragment")
                },
                hasParentNode: function (t, e, i) {
                    if (i = i || "target", !t.parentNode) throw new TypeError(e + ": " + i + " must have a parentNode")
                }
            }
        }, {
            "../COMMENT_NODE": 68,
            "../DOCUMENT_FRAGMENT_NODE": 69,
            "../ELEMENT_NODE": 71,
            "../TEXT_NODE": 72,
            "./isNodeType": 73
        }],
        75: [function (t, e, i) {
            "use strict";
            var n = t("./internal/isNodeType"),
                r = t("./DOCUMENT_FRAGMENT_NODE");
            e.exports = function (t) {
                return n(t, r)
            }
        }, {
            "./DOCUMENT_FRAGMENT_NODE": 69,
            "./internal/isNodeType": 73
        }],
        76: [function (t, e, i) {
            "use strict";
            var n = t("./internal/isNodeType"),
                r = t("./ELEMENT_NODE");
            e.exports = function (t) {
                return n(t, r)
            }
        }, {
            "./ELEMENT_NODE": 71,
            "./internal/isNodeType": 73
        }],
        77: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                return !(!t || !t.nodeType)
            }
        }, {}],
        78: [function (t, e, i) {
            "use strict";
            var n = t("./internal/validate");
            e.exports = function (t) {
                return n.childNode(t, !0, "remove"), t.parentNode ? t.parentNode.removeChild(t) : t
            }
        }, {
            "./internal/validate": 74
        }],
        79: [function (t, e, i) {
            "use strict";
            var n;
            e.exports = window.Element ? (n = Element.prototype).matches || n.matchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector : null
        }, {}],
        80: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/Array/prototype.indexOf");
            var n = t("@marcom/ac-dom-nodes/isNode"),
                r = t("@marcom/ac-dom-nodes/COMMENT_NODE"),
                o = t("@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE"),
                s = t("@marcom/ac-dom-nodes/DOCUMENT_NODE"),
                a = t("@marcom/ac-dom-nodes/ELEMENT_NODE"),
                c = function (t, e) {
                    return !!n(t) && ("number" == typeof e ? t.nodeType === e : -1 !== e.indexOf(t.nodeType))
                },
                l = [a, s, o],
                u = [a, t("@marcom/ac-dom-nodes/TEXT_NODE"), r];
            e.exports = {
                parentNode: function (t, e, i, n) {
                    if (n = n || "node", (t || e) && !c(t, l)) throw new TypeError(i + ": " + n + " must be an Element, Document, or Document Fragment")
                },
                childNode: function (t, e, i, n) {
                    if (n = n || "node", (t || e) && !c(t, u)) throw new TypeError(i + ": " + n + " must be an Element, TextNode, or Comment")
                },
                selector: function (t, e, i, n) {
                    if (n = n || "selector", (t || e) && "string" != typeof t) throw new TypeError(i + ": " + n + " must be a string")
                }
            }
        }, {
            "@marcom/ac-dom-nodes/COMMENT_NODE": 68,
            "@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE": 69,
            "@marcom/ac-dom-nodes/DOCUMENT_NODE": 70,
            "@marcom/ac-dom-nodes/ELEMENT_NODE": 71,
            "@marcom/ac-dom-nodes/TEXT_NODE": 72,
            "@marcom/ac-dom-nodes/isNode": 77,
            "@marcom/ac-polyfills/Array/prototype.indexOf": 134
        }],
        81: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-dom-nodes/isElement"),
                r = t("./internal/validate"),
                o = t("./internal/nativeMatches"),
                s = t("./shims/matchesSelector");
            e.exports = function (t, e) {
                return r.selector(e, !0, "matchesSelector"), !!n(t) && (o ? o.call(t, e) : s(t, e))
            }
        }, {
            "./internal/nativeMatches": 79,
            "./internal/validate": 80,
            "./shims/matchesSelector": 83,
            "@marcom/ac-dom-nodes/isElement": 76
        }],
        82: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/Array/prototype.slice");
            var n = t("./internal/validate"),
                r = t("./shims/querySelectorAll"),
                o = "querySelectorAll" in document;
            e.exports = function (t, e) {
                return e = e || document, n.parentNode(e, !0, "querySelectorAll", "context"), n.selector(t, !0, "querySelectorAll"), o ? Array.prototype.slice.call(e.querySelectorAll(t)) : r(t, e)
            }
        }, {
            "./internal/validate": 80,
            "./shims/querySelectorAll": 84,
            "@marcom/ac-polyfills/Array/prototype.slice": 135
        }],
        83: [function (t, e, i) {
            "use strict";
            var n = t("../querySelectorAll");
            e.exports = function (t, e) {
                var i, r = t.parentNode || document,
                    o = n(e, r);
                for (i = 0; i < o.length; i++)
                    if (o[i] === t) return !0;
                return !1
            }
        }, {
            "../querySelectorAll": 82
        }],
        84: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/Array/prototype.indexOf");
            var n = t("@marcom/ac-dom-nodes/isElement"),
                r = t("@marcom/ac-dom-nodes/isDocumentFragment"),
                o = t("@marcom/ac-dom-nodes/remove"),
                s = function (t, e) {
                    var i;
                    if (e === document) return !0;
                    for (i = t;
                        (i = i.parentNode) && n(i);)
                        if (i === e) return !0;
                    return !1
                },
                a = function (t) {
                    "recalc" in t ? t.recalc(!1) : document.recalc(!1), window.scrollBy(0, 0)
                };
            e.exports = function (t, e) {
                var i, n = document.createElement("style"),
                    c = "_ac_qsa_" + (Math.random() + "").slice(-6),
                    l = [];
                for (e = e || document, document[c] = [], r(e) ? e.appendChild(n) : document.documentElement.firstChild.appendChild(n), n.styleSheet.cssText = "*{display:recalc;}" + t + '{ac-qsa:expression(document["' + c + '"] && document["' + c + '"].push(this));}', a(e); document[c].length;)(i = document[c].shift()).style.removeAttribute("ac-qsa"), -1 === l.indexOf(i) && s(i, e) && l.push(i);
                return document[c] = null, o(n), a(e), l
            }
        }, {
            "@marcom/ac-dom-nodes/isDocumentFragment": 75,
            "@marcom/ac-dom-nodes/isElement": 76,
            "@marcom/ac-dom-nodes/remove": 78,
            "@marcom/ac-polyfills/Array/prototype.indexOf": 134
        }],
        85: [function (t, e, i) {
            "use strict";
            var n = "Ease expects an easing function.";

            function r(t, e) {
                if ("function" != typeof t) throw new TypeError(n);
                this.easingFunction = t, this.cssString = e || null
            }
            r.prototype.getValue = function (t) {
                return this.easingFunction(t, 0, 1, 1)
            }, e.exports = r
        }, {}],
        86: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/Array/prototype.every");
            var n = t("./Ease"),
                r = t("./helpers/KeySpline");
            e.exports = function (t, e, i, o) {
                var s = Array.prototype.slice.call(arguments),
                    a = s.every(function (t) {
                        return "number" == typeof t
                    });
                if (4 !== s.length || !a) throw new TypeError("Bezier curve expects exactly four (4) numbers. Given: " + s);
                var c = new r(t, e, i, o),
                    l = "cubic-bezier(" + s.join(", ") + ")";
                return new n(function (t, e, i, n) {
                    return c.get(t / n) * i + e
                }, l)
            }
        }, {
            "./Ease": 85,
            "./helpers/KeySpline": 87,
            "@marcom/ac-polyfills/Array/prototype.every": 132
        }],
        87: [function (t, e, i) {
            e.exports = function (t, e, i, n) {
                function r(t, e) {
                    return 1 - 3 * e + 3 * t
                }

                function o(t, e) {
                    return 3 * e - 6 * t
                }

                function s(t) {
                    return 3 * t
                }

                function a(t, e, i) {
                    return ((r(e, i) * t + o(e, i)) * t + s(e)) * t
                }
                this.get = function (c) {
                    return t === e && i === n ? c : a(function (e) {
                        for (var n = e, c = 0; c < 4; ++c) {
                            var l = (h = n, 3 * r(d = t, p = i) * h * h + 2 * o(d, p) * h + s(d));
                            if (0 === l) return n;
                            var u = a(n, t, i) - e;
                            n -= u / l
                        }
                        var h, d, p;
                        return n
                    }(c), e, n)
                }
            }
        }, {}],
        88: [function (t, e, i) {
            "use strict";
            e.exports = {
                EventEmitterMicro: t("./ac-event-emitter-micro/EventEmitterMicro")
            }
        }, {
            "./ac-event-emitter-micro/EventEmitterMicro": 89
        }],
        89: [function (t, e, i) {
            "use strict";

            function n() {
                this._events = {}
            }
            var r = n.prototype;
            r.on = function (t, e) {
                this._events[t] = this._events[t] || [], this._events[t].unshift(e)
            }, r.once = function (t, e) {
                var i = this;
                this.on(t, function n(r) {
                    i.off(t, n), void 0 !== r ? e(r) : e()
                })
            }, r.off = function (t, e) {
                if (this.has(t)) {
                    if (1 === arguments.length) return this._events[t] = null, void delete this._events[t];
                    var i = this._events[t].indexOf(e); - 1 !== i && this._events[t].splice(i, 1)
                }
            }, r.trigger = function (t, e) {
                if (this.has(t))
                    for (var i = this._events[t].length - 1; i >= 0; i--) void 0 !== e ? this._events[t][i](e) : this._events[t][i]()
            }, r.has = function (t) {
                return t in this._events != !1 && 0 !== this._events[t].length
            }, r.destroy = function () {
                for (var t in this._events) this._events[t] = null;
                this._events = null
            }, e.exports = n
        }, {}],
        90: [function (t, e, i) {
            e.exports.EventEmitter = t("./ac-event-emitter/EventEmitter")
        }, {
            "./ac-event-emitter/EventEmitter": 91
        }],
        91: [function (t, e, i) {
            "use strict";
            var n = "EventEmitter:propagation",
                r = function (t) {
                    t && (this.context = t)
                },
                o = r.prototype,
                s = function () {
                    return this.hasOwnProperty("_events") || "object" == typeof this._events || (this._events = {}), this._events
                },
                a = function (t, e) {
                    var i = t[0],
                        n = t[1],
                        r = t[2];
                    if ("string" != typeof i && "object" != typeof i || null === i || Array.isArray(i)) throw new TypeError("Expecting event name to be a string or object.");
                    if ("string" == typeof i && !n) throw new Error("Expecting a callback function to be provided.");
                    if (n && "function" != typeof n) {
                        if ("object" != typeof i || "object" != typeof n) throw new TypeError("Expecting callback to be a function.");
                        r = n
                    }
                    if ("object" == typeof i)
                        for (var o in i) e.call(this, o, i[o], r);
                    "string" == typeof i && (i = i.split(" ")).forEach(function (t) {
                        e.call(this, t, n, r)
                    }, this)
                },
                c = function (t, e) {
                    var i, n, r;
                    if ((i = s.call(this)[t]) && 0 !== i.length)
                        for (i = i.slice(), this._stoppedImmediatePropagation = !1, n = 0, r = i.length; n < r && (!this._stoppedImmediatePropagation && !e(i[n], n)); n++);
                },
                l = function (t, e, i) {
                    var n = -1;
                    c.call(this, e, function (t, e) {
                        if (t.callback === i) return n = e, !0
                    }), -1 !== n && t[e].splice(n, 1)
                };
            o.on = function () {
                var t = s.call(this);
                return a.call(this, arguments, function (e, i, n) {
                    t[e] = t[e] || (t[e] = []), t[e].push({
                        callback: i,
                        context: n
                    })
                }), this
            }, o.once = function () {
                return a.call(this, arguments, function (t, e, i) {
                    var n = function (r) {
                        e.call(i || this, r), this.off(t, n)
                    };
                    this.on(t, n, this)
                }), this
            }, o.off = function (t, e) {
                var i = s.call(this);
                if (0 === arguments.length) this._events = {};
                else if (!t || "string" != typeof t && "object" != typeof t || Array.isArray(t)) throw new TypeError("Expecting event name to be a string or object.");
                if ("object" == typeof t)
                    for (var n in t) l.call(this, i, n, t[n]);
                if ("string" == typeof t) {
                    var r = t.split(" ");
                    1 === r.length ? e ? l.call(this, i, t, e) : i[t] = [] : r.forEach(function (t) {
                        i[t] = []
                    })
                }
                return this
            }, o.trigger = function (t, e, i) {
                if (!t) throw new Error("trigger method requires an event name");
                if ("string" != typeof t) throw new TypeError("Expecting event names to be a string.");
                if (i && "boolean" != typeof i) throw new TypeError("Expecting doNotPropagate to be a boolean.");
                return (t = t.split(" ")).forEach(function (t) {
                    c.call(this, t, function (t) {
                        t.callback.call(t.context || this.context || this, e)
                    }.bind(this)), i || c.call(this, n, function (i) {
                        var n = t;
                        i.prefix && (n = i.prefix + n), i.emitter.trigger(n, e)
                    })
                }, this), this
            }, o.propagateTo = function (t, e) {
                var i = s.call(this);
                i[n] || (this._events[n] = []), i[n].push({
                    emitter: t,
                    prefix: e
                })
            }, o.stopPropagatingTo = function (t) {
                var e = s.call(this);
                if (t) {
                    var i, r = e[n],
                        o = r.length;
                    for (i = 0; i < o; i++)
                        if (r[i].emitter === t) {
                            r.splice(i, 1);
                            break
                        }
                } else e[n] = []
            }, o.stopImmediatePropagation = function () {
                this._stoppedImmediatePropagation = !0
            }, o.has = function (t, e, i) {
                var n = s.call(this),
                    r = n[t];
                if (0 === arguments.length) return Object.keys(n);
                if (!r) return !1;
                if (!e) return r.length > 0;
                for (var o = 0, a = r.length; o < a; o++) {
                    var c = r[o];
                    if (i && e && c.context === i && c.callback === e) return !0;
                    if (e && !i && c.callback === e) return !0
                }
                return !1
            }, e.exports = r
        }, {}],
        92: [function (t, e, i) {
            "use strict";
            e.exports = {
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
        93: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/useragent-detect").os,
                r = t("./touchAvailable").original,
                o = t("./helpers/globals"),
                s = t("@marcom/ac-function/once");

            function a() {
                var t = o.getWindow();
                return !r() && !t.orientation || n.windows
            }
            e.exports = s(a), e.exports.original = a
        }, {
            "./helpers/globals": 92,
            "./touchAvailable": 97,
            "@marcom/ac-function/once": 106,
            "@marcom/useragent-detect": 306
        }],
        94: [function (t, e, i) {
            "use strict";
            var n = t("./isDesktop").original,
                r = t("./isTablet").original,
                o = t("@marcom/ac-function/once");

            function s() {
                return !n() && !r()
            }
            e.exports = o(s), e.exports.original = s
        }, {
            "./isDesktop": 93,
            "./isTablet": 96,
            "@marcom/ac-function/once": 106
        }],
        95: [function (t, e, i) {
            "use strict";
            var n = t("./helpers/globals");
            e.exports = function () {
                var t = n.getWindow();
                return "devicePixelRatio" in t && t.devicePixelRatio >= 1.5
            }
        }, {
            "./helpers/globals": 92
        }],
        96: [function (t, e, i) {
            "use strict";
            var n = t("./isDesktop").original,
                r = t("./helpers/globals"),
                o = t("@marcom/ac-function/once"),
                s = 600;

            function a() {
                var t = r.getWindow(),
                    e = t.screen.width;
                return t.orientation && t.screen.height < e && (e = t.screen.height), !n() && e >= s
            }
            e.exports = o(a), e.exports.original = a
        }, {
            "./helpers/globals": 92,
            "./isDesktop": 93,
            "@marcom/ac-function/once": 106
        }],
        97: [function (t, e, i) {
            "use strict";
            var n = t("./helpers/globals"),
                r = t("@marcom/ac-function/once");

            function o() {
                var t = n.getWindow(),
                    e = n.getDocument(),
                    i = n.getNavigator();
                return !!("ontouchstart" in t || t.DocumentTouch && e instanceof t.DocumentTouch || i.maxTouchPoints > 0 || i.msMaxTouchPoints > 0)
            }
            e.exports = r(o), e.exports.original = o
        }, {
            "./helpers/globals": 92,
            "@marcom/ac-function/once": 106
        }],
        98: [function (t, e, i) {
            "use strict";
            var n = t("./helpers/globals"),
                r = t("@marcom/ac-function/once");

            function o() {
                var t = n.getDocument().createElement("canvas");
                return "function" == typeof t.getContext && !(!t.getContext("webgl") && !t.getContext("experimental-webgl"))
            }
            e.exports = r(o), e.exports.original = o
        }, {
            "./helpers/globals": 92,
            "@marcom/ac-function/once": 106
        }],
        99: [function (t, e, i) {
            "use strict";
            e.exports = t("./fullscreen")
        }, {
            "./fullscreen": 105
        }],
        100: [function (t, e, i) {
            e.exports = {
                STANDARD: "standard",
                IOS: "ios"
            }
        }, {}],
        101: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-dom-events/addEventListener"),
                r = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                o = t("./../events/types"),
                s = t("./../consts/modes"),
                a = new r;

            function c(t) {
                a.fullscreenElement() ? function (t) {
                    a.trigger(o.ENTERFULLSCREEN, t)
                }(t) : function (t) {
                    a.trigger(o.EXITFULLSCREEN, t)
                }(t)
            }
            n(document, "fullscreenchange", c), a.fullscreenEnabled = function (t) {
                return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
            }, a.fullscreenElement = function () {
                return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitCurrentFullScreenElement
            }, a.exitFullscreen = function (t) {
                var e;
                "function" == typeof document.exitFullscreen ? e = "exitFullscreen" : "function" == typeof document.webkitExitFullscreen ? e = "webkitExitFullscreen" : "function" == typeof document.webkitCancelFullScreen ? e = "webkitCancelFullScreen" : "function" == typeof document.mozCancelFullScreen ? e = "mozCancelFullScreen" : "function" == typeof document.msExitFullscreen && (e = "msExitFullscreen"), "function" == typeof document[e] && document[e].call(document)
            }, a.requestFullscreen = function (t) {
                var e;
                "function" == typeof t.requestFullscreen ? e = "requestFullscreen" : "function" == typeof t.webkitRequestFullscreen ? e = "webkitRequestFullscreen" : "function" == typeof t.webkitRequestFullScreen ? e = "webkitRequestFullScreen" : "function" == typeof t.mozRequestFullScreen ? e = "mozRequestFullScreen" : "function" == typeof t.msRequestFullscreen && (e = "msRequestFullscreen"), "function" == typeof t[e] && t[e].call(t)
            }, a.mode = s.STANDARD, e.exports = a
        }, {
            "./../consts/modes": 100,
            "./../events/types": 104,
            "@marcom/ac-dom-events/addEventListener": 54,
            "@marcom/ac-event-emitter-micro": 88
        }],
        102: [function (t, e, i) {
            "use strict";
            var n = t("./ios"),
                r = t("./desktop");
            e.exports = {
                create: function () {
                    var t = r;
                    return "webkitEnterFullscreen" in document.createElement("video") && !("webkitRequestFullScreen" in document.createElement("div")) && (t = n), t
                }
            }
        }, {
            "./desktop": 101,
            "./ios": 103
        }],
        103: [function (t, e, i) {
            "use strict";
            var n, r = t("@marcom/ac-dom-events/addEventListener"),
                o = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                s = t("./../events/types"),
                a = t("./../consts/modes");

            function c(t) {
                u.trigger(s.ENTERFULLSCREEN, t)
            }

            function l(t) {
                n = void 0, u.trigger(s.EXITFULLSCREEN, t)
            }
            r(document, "webkitbeginfullscreen", c, !0), r(document, "webkitendfullscreen", l, !0);
            var u = new o;
            u.fullscreenEnabled = function (t) {
                return !!t.webkitSupportsFullscreen
            }, u.fullscreenElement = function () {
                return n
            }, u.exitFullscreen = function (t) {
                t && "function" == typeof t.webkitExitFullscreen && t.webkitExitFullscreen()
            }, u.requestFullscreen = function (t) {
                "function" == typeof t.webkitEnterFullscreen && t.webkitEnterFullscreen()
            }, u.mode = a.IOS, e.exports = u
        }, {
            "./../consts/modes": 100,
            "./../events/types": 104,
            "@marcom/ac-dom-events/addEventListener": 54,
            "@marcom/ac-event-emitter-micro": 88
        }],
        104: [function (t, e, i) {
            e.exports = {
                ENTERFULLSCREEN: "enterfullscreen",
                EXITFULLSCREEN: "exitfullscreen"
            }
        }, {}],
        105: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-event-emitter-micro").EventEmitterMicro;
            var n = "Error: Element missing. ac-fullscreen requires an element to be specified",
                r = t("./delegate/factory").create();

            function o() {
                throw new Error(n)
            }
            var s = {
                requestFullscreen: function (t) {
                    return t || o(), r.requestFullscreen(t)
                },
                fullscreenEnabled: function (t) {
                    return t || o(), r.fullscreenEnabled(t)
                },
                fullscreenElement: function () {
                    return r.fullscreenElement()
                },
                exitFullscreen: function (t) {
                    return t || o(), r.exitFullscreen(t)
                },
                getMode: function () {
                    return r.mode
                },
                on: function () {
                    return r.on.apply(r, arguments)
                },
                off: function () {
                    return r.off.apply(r, arguments)
                },
                once: function () {
                    return r.once.apply(r, arguments)
                }
            };
            e.exports = s
        }, {
            "./delegate/factory": 102,
            "@marcom/ac-event-emitter-micro": 88
        }],
        106: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                var e;
                return function () {
                    return void 0 === e && (e = t.apply(this, arguments)), e
                }
            }
        }, {}],
        107: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e) {
                var i = null;
                return function () {
                    null === i && (t.apply(this, arguments), i = setTimeout(function () {
                        i = null
                    }, e))
                }
            }
        }, {}],
        108: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                r = t("@marcom/ac-dom-events/utils/addEventListener"),
                o = t("@marcom/ac-dom-events/utils/removeEventListener"),
                s = t("@marcom/ac-object/create"),
                a = t("./internal/KeyEvent"),
                c = "keydown",
                l = "keyup";

            function u(t) {
                this._keysDown = {}, this._DOMKeyDown = this._DOMKeyDown.bind(this), this._DOMKeyUp = this._DOMKeyUp.bind(this), this._context = t || document, r(this._context, c, this._DOMKeyDown, !0), r(this._context, l, this._DOMKeyUp, !0), n.call(this)
            }
            var h = u.prototype = s(n.prototype);
            h.onDown = function (t, e) {
                return this.on(c + ":" + t, e)
            }, h.onceDown = function (t, e) {
                return this.once(c + ":" + t, e)
            }, h.offDown = function (t, e) {
                return this.off(c + ":" + t, e)
            }, h.onUp = function (t, e) {
                return this.on(l + ":" + t, e)
            }, h.onceUp = function (t, e) {
                return this.once(l + ":" + t, e)
            }, h.offUp = function (t, e) {
                return this.off(l + ":" + t, e)
            }, h.isDown = function (t) {
                return t += "", this._keysDown[t] || !1
            }, h.isUp = function (t) {
                return !this.isDown(t)
            }, h.destroy = function () {
                return o(this._context, c, this._DOMKeyDown, !0), o(this._context, l, this._DOMKeyUp, !0), this._keysDown = null, this._context = null, n.prototype.destroy.call(this), this
            }, h._DOMKeyDown = function (t) {
                var e = this._normalizeKeyboardEvent(t),
                    i = e.keyCode += "";
                this._trackKeyDown(i), this.trigger(c + ":" + i, e)
            }, h._DOMKeyUp = function (t) {
                var e = this._normalizeKeyboardEvent(t),
                    i = e.keyCode += "";
                this._trackKeyUp(i), this.trigger(l + ":" + i, e)
            }, h._normalizeKeyboardEvent = function (t) {
                return new a(t)
            }, h._trackKeyUp = function (t) {
                this._keysDown[t] && (this._keysDown[t] = !1)
            }, h._trackKeyDown = function (t) {
                this._keysDown[t] || (this._keysDown[t] = !0)
            }, e.exports = u
        }, {
            "./internal/KeyEvent": 110,
            "@marcom/ac-dom-events/utils/addEventListener": 63,
            "@marcom/ac-dom-events/utils/removeEventListener": 65,
            "@marcom/ac-event-emitter-micro": 88,
            "@marcom/ac-object/create": 123
        }],
        109: [function (t, e, i) {
            "use strict";
            var n = t("./Keyboard");
            e.exports = new n
        }, {
            "./Keyboard": 108
        }],
        110: [function (t, e, i) {
            "use strict";
            var n = ["keyLocation"];

            function r(t) {
                var e;
                for (e in this.originalEvent = t, t) - 1 === n.indexOf(e) && "function" != typeof t[e] && (this[e] = t[e]);
                this.location = void 0 !== this.originalEvent.location ? this.originalEvent.location : this.originalEvent.keyLocation
            }
            r.prototype = {
                preventDefault: function () {
                    if ("function" == typeof this.originalEvent.preventDefault) return this.originalEvent.preventDefault();
                    this.originalEvent.returnValue = !1
                },
                stopPropagation: function () {
                    return this.originalEvent.stopPropagation()
                }
            }, e.exports = r
        }, {}],
        111: [function (t, e, i) {
            "use strict";
            e.exports = {
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
        112: [function (t, e, i) {
            "use strict";
            e.exports = {
                Modal: t("./ac-modal-basic/Modal"),
                Renderer: t("./ac-modal-basic/Renderer"),
                classNames: t("./ac-modal-basic/classNames"),
                dataAttributes: t("./ac-modal-basic/dataAttributes")
            }
        }, {
            "./ac-modal-basic/Modal": 113,
            "./ac-modal-basic/Renderer": 114,
            "./ac-modal-basic/classNames": 115,
            "./ac-modal-basic/dataAttributes": 116
        }],
        113: [function (t, e, i) {
            "use strict";
            var n = {
                    addEventListener: t("@marcom/ac-dom-events/addEventListener"),
                    removeEventListener: t("@marcom/ac-dom-events/removeEventListener"),
                    target: t("@marcom/ac-dom-events/target")
                },
                r = {
                    getScrollX: t("@marcom/ac-dom-metrics/getScrollX"),
                    getScrollY: t("@marcom/ac-dom-metrics/getScrollY")
                },
                o = {
                    create: t("@marcom/ac-object/create"),
                    defaults: t("@marcom/ac-object/defaults")
                },
                s = t("@marcom/ac-keyboard"),
                a = t("@marcom/ac-keyboard/keyMap"),
                c = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                l = t("./Renderer"),
                u = {
                    retainScrollPosition: !1
                };

            function h(t, e) {
                c.call(this), this.options = o.defaults(u, t), this.renderer = new l(e), this.opened = !1, this._keysToClose = [a.ESCAPE], this._attachedKeysToClose = [], this.close = this.close.bind(this)
            }
            var d = h.prototype = o.create(c.prototype);
            d.open = function () {
                this.options.retainScrollPosition && this._saveScrollPosition(), this.opened || (this._attachEvents(), this.trigger("willopen"), this.renderer.open(), this.opened = !0, this.trigger("open"))
            }, d.close = function (t) {
                var e, i;
                if (this.opened) {
                    if (t && "click" === t.type && (e = n.target(t), i = this.renderer.options.dataAttributes.close, !e.hasAttribute(i))) return;
                    this.trigger("willclose"), this._removeEvents(), this.renderer.close(), this.options.retainScrollPosition && this._restoreScrollPosition(), this.opened = !1, this.trigger("close")
                }
            }, d.render = function () {
                this.renderer.render()
            }, d.appendContent = function (t, e) {
                this.renderer.appendContent(t, e)
            }, d.removeContent = function (t) {
                this.renderer.removeContent(t)
            }, d.destroy = function () {
                for (var t in this._removeEvents(), this.renderer.destroy(), this) this.hasOwnProperty(t) && (this[t] = null)
            }, d.addKeyToClose = function (t) {
                -1 === this._keysToClose.indexOf(t) && (this._keysToClose.push(t), this._bindKeyToClose(t))
            }, d.removeKeyToClose = function (t) {
                var e = this._keysToClose.indexOf(t); - 1 !== e && this._keysToClose.splice(e, 1), this._releaseKeyToClose(t)
            }, d._bindKeyToClose = function (t) {
                -1 === this._attachedKeysToClose.indexOf(t) && (s.onUp(t, this.close), this._attachedKeysToClose.push(t))
            }, d._releaseKeyToClose = function (t) {
                var e = this._attachedKeysToClose.indexOf(t); - 1 !== e && (s.offUp(t, this.close), this._attachedKeysToClose.splice(e, 1))
            }, d._removeEvents = function () {
                this.renderer.modalElement && n.removeEventListener(this.renderer.modalElement, "click", this.close), this._keysToClose.forEach(this._releaseKeyToClose, this)
            }, d._attachEvents = function () {
                this.renderer.modalElement && n.addEventListener(this.renderer.modalElement, "click", this.close), this._keysToClose.forEach(this._bindKeyToClose, this)
            }, d._restoreScrollPosition = function () {
                window.scrollTo(this._scrollX || 0, this._scrollY || 0)
            }, d._saveScrollPosition = function () {
                this._scrollX = r.getScrollX(), this._scrollY = r.getScrollY()
            }, e.exports = h
        }, {
            "./Renderer": 114,
            "@marcom/ac-dom-events/addEventListener": 54,
            "@marcom/ac-dom-events/removeEventListener": 58,
            "@marcom/ac-dom-events/target": 62,
            "@marcom/ac-dom-metrics/getScrollX": 66,
            "@marcom/ac-dom-metrics/getScrollY": 67,
            "@marcom/ac-event-emitter-micro": 88,
            "@marcom/ac-keyboard": 109,
            "@marcom/ac-keyboard/keyMap": 111,
            "@marcom/ac-object/create": 123,
            "@marcom/ac-object/defaults": 124
        }],
        114: [function (t, e, i) {
            "use strict";
            var n = {
                    add: t("@marcom/ac-classlist/add"),
                    remove: t("@marcom/ac-classlist/remove")
                },
                r = {
                    defaults: t("@marcom/ac-object/defaults")
                },
                o = {
                    remove: t("@marcom/ac-dom-nodes/remove"),
                    isElement: t("@marcom/ac-dom-nodes/isElement")
                },
                s = {
                    modalElement: null,
                    contentElement: null,
                    closeButton: null,
                    classNames: t("./classNames"),
                    dataAttributes: t("./dataAttributes")
                },
                a = function (t) {
                    t = t || {}, this.options = r.defaults(s, t), this.options.classNames = r.defaults(s.classNames, t.classNames), this.options.dataAttributes = r.defaults(s.dataAttributes, t.dataAttributes), this.modalElement = this.options.modalElement, this.contentElement = this.options.contentElement, this.closeButton = this.options.closeButton
                },
                c = a.prototype;
            c.render = function () {
                return o.isElement(this.modalElement) || (this.modalElement = this.renderModalElement(this.options.classNames.modalElement)), o.isElement(this.contentElement) || (this.contentElement = this.renderContentElement(this.options.classNames.contentElement)), !1 !== this.closeButton && (o.isElement(this.closeButton) || (this.closeButton = this.renderCloseButton(this.options.classNames.closeButton)), this.modalElement.appendChild(this.closeButton)), this.modalElement.appendChild(this.contentElement), document.body.appendChild(this.modalElement), this.modalElement
            }, c.renderCloseButton = function (t) {
                var e;
                return t = t || this.options.classNames.closeButton, (e = this._renderElement("button", t)).setAttribute(this.options.dataAttributes.close, ""), e
            }, c.renderModalElement = function (t) {
                return t = t || this.options.classNames.modalElement, this._renderElement("div", t)
            }, c.renderContentElement = function (t) {
                return t = t || this.options.classNames.contentElement, this._renderElement("div", t)
            }, c.appendContent = function (t, e) {
                o.isElement(t) && (void 0 === arguments[1] ? this.contentElement.appendChild(t) : o.isElement(e) && e.appendChild(t))
            }, c.removeContent = function (t) {
                t ? this.modalElement.contains(t) && o.remove(t) : this._emptyContent()
            }, c.open = function () {
                var t = [document.documentElement].concat(this.options.classNames.documentElement),
                    e = [this.modalElement].concat(this.options.classNames.modalOpen);
                n.add.apply(null, t), n.add.apply(null, e)
            }, c.close = function () {
                var t = [document.documentElement].concat(this.options.classNames.documentElement),
                    e = [this.modalElement].concat(this.options.classNames.modalOpen);
                n.remove.apply(null, t), n.remove.apply(null, e)
            }, c.destroy = function () {
                var t = [document.documentElement].concat(this.options.classNames.documentElement);
                for (var e in this.modalElement && document.body.contains(this.modalElement) && (this.close(), document.body.removeChild(this.modalElement)), n.remove.apply(null, t), this) this.hasOwnProperty(e) && (this[e] = null)
            }, c._renderElement = function (t, e) {
                var i = document.createElement(t),
                    r = [i];
                return e && (r = r.concat(e)), n.add.apply(null, r), i
            }, c._emptyContent = function () {
                this.contentElement.innerHTML = ""
            }, e.exports = a
        }, {
            "./classNames": 115,
            "./dataAttributes": 116,
            "@marcom/ac-classlist/add": 41,
            "@marcom/ac-classlist/remove": 46,
            "@marcom/ac-dom-nodes/isElement": 76,
            "@marcom/ac-dom-nodes/remove": 78,
            "@marcom/ac-object/defaults": 124
        }],
        115: [function (t, e, i) {
            "use strict";
            e.exports = {
                modalElement: "modal",
                modalOpen: "modal-open",
                documentElement: "has-modal",
                contentElement: "modal-content",
                closeButton: "modal-close"
            }
        }, {}],
        116: [function (t, e, i) {
            "use strict";
            e.exports = {
                close: "data-modal-close"
            }
        }, {}],
        117: [function (t, e, i) {
            "use strict";
            e.exports = {
                Modal: t("./ac-modal/Modal"),
                createStandardModal: t("./ac-modal/factory/createStandardModal"),
                createFullViewportModal: t("./ac-modal/factory/createFullViewportModal")
            }
        }, {
            "./ac-modal/Modal": 118,
            "./ac-modal/factory/createFullViewportModal": 119,
            "./ac-modal/factory/createStandardModal": 120
        }],
        118: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-modal-basic").Modal,
                r = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                o = t("@marcom/ac-accessibility/CircularTab");

            function s(t) {
                r.call(this), this.options = t || {}, this._modal = new n(t, this.options.renderer), this.opened = !1, this._render(), this.closeButton = this._modal.renderer.closeButton, this.modalElement = this._modal.renderer.modalElement, this.contentElement = this._modal.renderer.contentElement, this.modalElement.setAttribute("role", "dialog"), this.modalElement.setAttribute("aria-label", "Modal"), this.modalElement.setAttribute("tabindex", "-1"), this.closeButton.setAttribute("aria-label", "Close"), this._circularTab = new o(this.modalElement), this._onWillOpen = this._onWillOpen.bind(this), this._onOpen = this._onOpen.bind(this), this._onWillClose = this._onWillClose.bind(this), this._onClose = this._onClose.bind(this), this._bindEvents()
            }
            var a = s.prototype = Object.create(r.prototype);
            a.open = function () {
                this._modal.open(), this.opened = this._modal.opened
            }, a.close = function () {
                this._modal.close()
            }, a.appendContent = function (t) {
                this._modal.appendContent(t)
            }, a.removeContent = function (t) {
                this._modal.removeContent(t)
            }, a.destroy = function () {
                for (var t in this._releaseEvents(), this._modal.destroy(), this._removeModalFocus(), this._circularTab.destroy(), this._focusObj = null, this) this.hasOwnProperty(t) && (this[t] = null)
            }, a.addKeyToClose = function (t) {
                this._modal.addKeyToClose(t)
            }, a.removeKeyToClose = function (t) {
                this._modal.removeKeyToClose(t)
            }, a._render = function () {
                this._modal.render(), this._modal.renderer.modalElement.setAttribute("aria-hidden", "true")
            }, a._bindEvents = function () {
                this._modal.on("willopen", this._onWillOpen), this._modal.on("open", this._onOpen), this._modal.on("willclose", this._onWillClose), this._modal.on("close", this._onClose)
            }, a._releaseEvents = function () {
                this._modal.off("willopen", this._onWillOpen), this._modal.off("open", this._onOpen), this._modal.off("willclose", this._onWillClose), this._modal.off("close", this._onClose)
            }, a._onWillOpen = function () {
                this.trigger("willopen")
            }, a._onOpen = function () {
                this.opened = this._modal.opened, this._giveModalFocus(), this.trigger("open")
            }, a._onWillClose = function () {
                this.trigger("willclose"), this._removeModalFocus()
            }, a._onClose = function () {
                this.opened = this._modal.opened, this.trigger("close")
            }, a._giveModalFocus = function () {
                this.modalElement.removeAttribute("aria-hidden"), this._activeElement = document.activeElement, this.modalElement.focus(), this._circularTab.start()
            }, a._removeModalFocus = function () {
                this._circularTab.stop(), this.modalElement.setAttribute("aria-hidden", "true"), this._activeElement && (this._activeElement.focus(), this._activeElement = null)
            }, e.exports = s
        }, {
            "@marcom/ac-accessibility/CircularTab": 23,
            "@marcom/ac-event-emitter-micro": 88,
            "@marcom/ac-modal-basic": 112
        }],
        119: [function (t, e, i) {
            "use strict";
            var n = t("../Modal"),
                r = t("@marcom/ac-modal-basic").classNames,
                o = {
                    retainScrollPosition: !0,
                    renderer: {
                        classNames: {
                            documentElement: [r.documentElement].concat("has-modal-full-viewport"),
                            modalElement: [r.modalElement].concat("modal-full-viewport")
                        }
                    }
                };
            e.exports = function (t, e) {
                var i = new n(o),
                    r = e || {};
                return t && i.appendContent(t), r.removeContainerPadding && i.modalElement.classList.add("remove-container-padding"), i
            }
        }, {
            "../Modal": 118,
            "@marcom/ac-modal-basic": 112
        }],
        120: [function (t, e, i) {
            "use strict";
            var n = t("../Modal"),
                r = t("@marcom/ac-modal-basic").classNames,
                o = t("@marcom/ac-modal-basic").dataAttributes,
                s = {
                    add: t("@marcom/ac-classlist/add")
                },
                a = {
                    renderer: {
                        classNames: {
                            documentElement: [r.documentElement].concat("has-modal-standard"),
                            modalElement: [r.modalElement].concat("modal-standard")
                        }
                    }
                };
            e.exports = function (t) {
                var e = new n(a);
                t && e.appendContent(t);
                var i = document.createElement("div"),
                    r = document.createElement("div"),
                    c = document.createElement("div"),
                    l = document.createElement("div");
                return s.add(i, "content-table"), s.add(r, "content-cell"), s.add(c, "content-wrapper"), s.add(l, "content-padding", "large-8", "medium-10"), e.modalElement.setAttribute(o.close, ""), c.setAttribute(o.close, ""), r.setAttribute(o.close, ""), i.appendChild(r), r.appendChild(c), c.appendChild(l), e.modalElement.appendChild(i), l.appendChild(e.contentElement), l.appendChild(e.closeButton), e
            }
        }, {
            "../Modal": 118,
            "@marcom/ac-classlist/add": 41,
            "@marcom/ac-modal-basic": 112
        }],
        121: [function (t, e, i) {
            "use strict";
            e.exports = {
                clone: t("./clone"),
                create: t("./create"),
                defaults: t("./defaults"),
                extend: t("./extend"),
                getPrototypeOf: t("./getPrototypeOf"),
                isDate: t("./isDate"),
                isEmpty: t("./isEmpty"),
                isRegExp: t("./isRegExp"),
                toQueryParameters: t("./toQueryParameters")
            }
        }, {
            "./clone": 122,
            "./create": 123,
            "./defaults": 124,
            "./extend": 125,
            "./getPrototypeOf": 126,
            "./isDate": 127,
            "./isEmpty": 128,
            "./isRegExp": 129,
            "./toQueryParameters": 130
        }],
        122: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/Array/isArray");
            var n = t("./extend"),
                r = Object.prototype.hasOwnProperty,
                o = function (t, e) {
                    var i;
                    for (i in e) r.call(e, i) && (null === e[i] ? t[i] = null : "object" == typeof e[i] ? (t[i] = Array.isArray(e[i]) ? [] : {}, o(t[i], e[i])) : t[i] = e[i]);
                    return t
                };
            e.exports = function (t, e) {
                return e ? o({}, t) : n({}, t)
            }
        }, {
            "./extend": 125,
            "@marcom/ac-polyfills/Array/isArray": 131
        }],
        123: [function (t, e, i) {
            "use strict";
            var n = function () {};
            e.exports = function (t) {
                if (arguments.length > 1) throw new Error("Second argument not supported");
                if (null === t || "object" != typeof t) throw new TypeError("Object prototype may only be an Object.");
                return "function" == typeof Object.create ? Object.create(t) : (n.prototype = t, new n)
            }
        }, {}],
        124: [function (t, e, i) {
            "use strict";
            var n = t("./extend");
            e.exports = function (t, e) {
                if ("object" != typeof t) throw new TypeError("defaults: must provide a defaults object");
                if ("object" != typeof (e = e || {})) throw new TypeError("defaults: options must be a typeof object");
                return n({}, t, e)
            }
        }, {
            "./extend": 125
        }],
        125: [function (t, e, i) {
            "use strict";
            t("@marcom/ac-polyfills/Array/prototype.forEach");
            var n = Object.prototype.hasOwnProperty;
            e.exports = function () {
                var t, e;
                return t = arguments.length < 2 ? [{}, arguments[0]] : [].slice.call(arguments), e = t.shift(), t.forEach(function (t) {
                    if (null != t)
                        for (var i in t) n.call(t, i) && (e[i] = t[i])
                }), e
            }
        }, {
            "@marcom/ac-polyfills/Array/prototype.forEach": 133
        }],
        126: [function (t, e, i) {
            "use strict";
            var n = Object.prototype.hasOwnProperty;
            e.exports = function (t) {
                if (Object.getPrototypeOf) return Object.getPrototypeOf(t);
                if ("object" != typeof t) throw new Error("Requested prototype of a value that is not an object.");
                if ("object" == typeof this.__proto__) return t.__proto__;
                var e, i = t.constructor;
                if (n.call(t, "constructor")) {
                    if (e = i, !delete t.constructor) return null;
                    i = t.constructor, t.constructor = e
                }
                return i ? i.prototype : null
            }
        }, {}],
        127: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                return "[object Date]" === Object.prototype.toString.call(t)
            }
        }, {}],
        128: [function (t, e, i) {
            "use strict";
            var n = Object.prototype.hasOwnProperty;
            e.exports = function (t) {
                var e;
                if ("object" != typeof t) throw new TypeError("ac-base.Object.isEmpty : Invalid parameter - expected object");
                for (e in t)
                    if (n.call(t, e)) return !1;
                return !0
            }
        }, {}],
        129: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                return !!window.RegExp && t instanceof RegExp
            }
        }, {}],
        130: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-url/joinSearchParams");
            e.exports = function (t) {
                if ("object" != typeof t) throw new TypeError("toQueryParameters error: argument is not an object");
                return n(t, !1)
            }
        }, {
            "@marcom/ac-url/joinSearchParams": 193
        }],
        131: [function (t, e, i) {
            Array.isArray || (Array.isArray = function (t) {
                return "[object Array]" === Object.prototype.toString.call(t)
            })
        }, {}],
        132: [function (t, e, i) {
            Array.prototype.every || (Array.prototype.every = function (t, e) {
                var i, n = Object(this),
                    r = n.length >>> 0;
                if ("function" != typeof t) throw new TypeError(t + " is not a function");
                for (i = 0; i < r; i += 1)
                    if (i in n && !t.call(e, n[i], i, n)) return !1;
                return !0
            })
        }, {}],
        133: [function (t, e, i) {
            Array.prototype.forEach || (Array.prototype.forEach = function (t, e) {
                var i, n, r = Object(this);
                if ("function" != typeof t) throw new TypeError("No function object passed to forEach.");
                var o = this.length;
                for (i = 0; i < o; i += 1) n = r[i], t.call(e, n, i, r)
            })
        }, {}],
        134: [function (t, e, i) {
            Array.prototype.indexOf || (Array.prototype.indexOf = function (t, e) {
                var i = e || 0,
                    n = 0;
                if (i < 0 && (i = this.length + e - 1) < 0) throw "Wrapped past beginning of array while looking up a negative start index.";
                for (n = 0; n < this.length; n++)
                    if (this[n] === t) return n;
                return -1
            })
        }, {}],
        135: [function (t, e, i) {
            ! function () {
                "use strict";
                var t = Array.prototype.slice;
                try {
                    t.call(document.documentElement)
                } catch (e) {
                    Array.prototype.slice = function (e, i) {
                        if (i = void 0 !== i ? i : this.length, "[object Array]" === Object.prototype.toString.call(this)) return t.call(this, e, i);
                        var n, r, o = [],
                            s = this.length,
                            a = e || 0;
                        a = a >= 0 ? a : s + a;
                        var c = i || s;
                        if (i < 0 && (c = s + i), (r = c - a) > 0)
                            if (o = new Array(r), this.charAt)
                                for (n = 0; n < r; n++) o[n] = this.charAt(a + n);
                            else
                                for (n = 0; n < r; n++) o[n] = this[a + n];
                        return o
                    }
                }
            }()
        }, {}],
        136: [function (t, e, i) {
            if (document.createEvent) try {
                new window.CustomEvent("click")
            } catch (t) {
                window.CustomEvent = function () {
                    function t(t, e) {
                        e = e || {
                            bubbles: !1,
                            cancelable: !1,
                            detail: void 0
                        };
                        var i = document.createEvent("CustomEvent");
                        return i.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), i
                    }
                    return t.prototype = window.Event.prototype, t
                }()
            }
        }, {}],
        137: [function (t, e, i) {
            Date.now || (Date.now = function () {
                return (new Date).getTime()
            })
        }, {}],
        138: [function (t, e, i) {
            "document" in self && ("classList" in document.createElement("_") ? function () {
                "use strict";
                var t = document.createElement("_");
                if (t.classList.add("c1", "c2"), !t.classList.contains("c2")) {
                    var e = function (t) {
                        var e = DOMTokenList.prototype[t];
                        DOMTokenList.prototype[t] = function (t) {
                            var i, n = arguments.length;
                            for (i = 0; i < n; i++) t = arguments[i], e.call(this, t)
                        }
                    };
                    e("add"), e("remove")
                }
                if (t.classList.toggle("c3", !1), t.classList.contains("c3")) {
                    var i = DOMTokenList.prototype.toggle;
                    DOMTokenList.prototype.toggle = function (t, e) {
                        return 1 in arguments && !this.contains(t) == !e ? e : i.call(this, t)
                    }
                }
                t = null
            }() : function (t) {
                "use strict";
                if ("Element" in t) {
                    var e = t.Element.prototype,
                        i = Object,
                        n = String.prototype.trim || function () {
                            return this.replace(/^\s+|\s+$/g, "")
                        },
                        r = Array.prototype.indexOf || function (t) {
                            for (var e = 0, i = this.length; e < i; e++)
                                if (e in this && this[e] === t) return e;
                            return -1
                        },
                        o = function (t, e) {
                            this.name = t, this.code = DOMException[t], this.message = e
                        },
                        s = function (t, e) {
                            if ("" === e) throw new o("SYNTAX_ERR", "An invalid or illegal string was specified");
                            if (/\s/.test(e)) throw new o("INVALID_CHARACTER_ERR", "String contains an invalid character");
                            return r.call(t, e)
                        },
                        a = function (t) {
                            for (var e = n.call(t.getAttribute("class") || ""), i = e ? e.split(/\s+/) : [], r = 0, o = i.length; r < o; r++) this.push(i[r]);
                            this._updateClassName = function () {
                                t.setAttribute("class", this.toString())
                            }
                        },
                        c = a.prototype = [],
                        l = function () {
                            return new a(this)
                        };
                    if (o.prototype = Error.prototype, c.item = function (t) {
                            return this[t] || null
                        }, c.contains = function (t) {
                            return -1 !== s(this, t += "")
                        }, c.add = function () {
                            var t, e = arguments,
                                i = 0,
                                n = e.length,
                                r = !1;
                            do {
                                t = e[i] + "", -1 === s(this, t) && (this.push(t), r = !0)
                            } while (++i < n);
                            r && this._updateClassName()
                        }, c.remove = function () {
                            var t, e, i = arguments,
                                n = 0,
                                r = i.length,
                                o = !1;
                            do {
                                for (t = i[n] + "", e = s(this, t); - 1 !== e;) this.splice(e, 1), o = !0, e = s(this, t)
                            } while (++n < r);
                            o && this._updateClassName()
                        }, c.toggle = function (t, e) {
                            t += "";
                            var i = this.contains(t),
                                n = i ? !0 !== e && "remove" : !1 !== e && "add";
                            return n && this[n](t), !0 === e || !1 === e ? e : !i
                        }, c.toString = function () {
                            return this.join(" ")
                        }, i.defineProperty) {
                        var u = {
                            get: l,
                            enumerable: !0,
                            configurable: !0
                        };
                        try {
                            i.defineProperty(e, "classList", u)
                        } catch (t) {
                            -2146823252 === t.number && (u.enumerable = !1, i.defineProperty(e, "classList", u))
                        }
                    } else i.prototype.__defineGetter__ && e.__defineGetter__("classList", l)
                }
            }(self))
        }, {}],
        139: [function (t, e, i) {
            t("../Date/now"),
                function () {
                    if ("performance" in window == 0 && (window.performance = {}), "now" in window.performance == 0) {
                        var t = Date.now();
                        performance.timing && performance.timing.navigationStart && (t = performance.timing.navigationStart), window.performance.now = function () {
                            return Date.now() - t
                        }
                    }
                }()
        }, {
            "../Date/now": 137
        }],
        140: [function (t, e, i) {
            "use strict";
            var n = t("./utils/eventTypeAvailable"),
                r = t("./shared/camelCasedEventTypes"),
                o = t("./shared/windowFallbackEventTypes"),
                s = t("./shared/prefixHelper"),
                a = {};
            e.exports = function t(e, i) {
                var c, l, u;
                if (i = i || "div", e = e.toLowerCase(), i in a || (a[i] = {}), e in (l = a[i])) return l[e];
                if (n(e, i)) return l[e] = e;
                if (e in r)
                    for (u = 0; u < r[e].length; u++)
                        if (c = r[e][u], n(c.toLowerCase(), i)) return l[e] = c;
                for (u = 0; u < s.evt.length; u++)
                    if (c = s.evt[u] + e, n(c, i)) return s.reduce(u), l[e] = c;
                return "window" !== i && o.indexOf(e) ? l[e] = t(e, "window") : l[e] = !1
            }
        }, {
            "./shared/camelCasedEventTypes": 141,
            "./shared/prefixHelper": 142,
            "./shared/windowFallbackEventTypes": 143,
            "./utils/eventTypeAvailable": 144
        }],
        141: [function (t, e, i) {
            "use strict";
            e.exports = {
                transitionend: ["webkitTransitionEnd", "MSTransitionEnd"],
                animationstart: ["webkitAnimationStart", "MSAnimationStart"],
                animationend: ["webkitAnimationEnd", "MSAnimationEnd"],
                animationiteration: ["webkitAnimationIteration", "MSAnimationIteration"],
                fullscreenchange: ["MSFullscreenChange"],
                fullscreenerror: ["MSFullscreenError"]
            }
        }, {}],
        142: [function (t, e, i) {
            "use strict";
            var n = ["-webkit-", "-moz-", "-ms-"],
                r = ["Webkit", "Moz", "ms"],
                o = ["webkit", "moz", "ms"],
                s = function () {
                    this.initialize()
                },
                a = s.prototype;
            a.initialize = function () {
                this.reduced = !1, this.css = n, this.dom = r, this.evt = o
            }, a.reduce = function (t) {
                this.reduced || (this.reduced = !0, this.css = [this.css[t]], this.dom = [this.dom[t]], this.evt = [this.evt[t]])
            }, e.exports = new s
        }, {}],
        143: [function (t, e, i) {
            "use strict";
            e.exports = ["transitionend", "animationstart", "animationend", "animationiteration"]
        }, {}],
        144: [function (t, e, i) {
            "use strict";
            var n = {
                window: window,
                document: document
            };
            e.exports = function (t, e) {
                var i;
                return t = "on" + t, e in n || (n[e] = document.createElement(e)), t in (i = n[e]) || "setAttribute" in i && (i.setAttribute(t, "return;"), "function" == typeof i[t])
            }
        }, {}],
        145: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-shared-instance").SharedInstance,
                r = function () {
                    this._currentID = 0
                };
            r.prototype.getNewID = function () {
                return this._currentID++, "raf:" + this._currentID
            }, e.exports = n.share("ac-raf-emitter-id-generator:sharedRAFEmitterIDGeneratorInstance", "1.0.3", r)
        }, {
            "@marcom/ac-shared-instance": 162
        }],
        146: [function (t, e, i) {
            "use strict";
            var n, r = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                o = t("@marcom/ac-raf-executor/sharedRAFExecutorInstance"),
                s = t("@marcom/ac-raf-emitter-id-generator/sharedRAFEmitterIDGeneratorInstance");

            function a(t) {
                t = t || {}, r.call(this), this.id = s.getNewID(), this.executor = t.executor || o, this._reset(), this._willRun = !1, this._didDestroy = !1
            }(n = a.prototype = Object.create(r.prototype)).run = function () {
                return this._willRun || (this._willRun = !0), this._subscribe()
            }, n.cancel = function () {
                this._unsubscribe(), this._willRun && (this._willRun = !1), this._reset()
            }, n.destroy = function () {
                var t = this.willRun();
                return this.cancel(), this.executor = null, r.prototype.destroy.call(this), this._didDestroy = !0, t
            }, n.willRun = function () {
                return this._willRun
            }, n.isRunning = function () {
                return this._isRunning
            }, n._subscribe = function () {
                return this.executor.subscribe(this)
            }, n._unsubscribe = function () {
                return this.executor.unsubscribe(this)
            }, n._onAnimationFrameStart = function (t) {
                this._isRunning = !0, this._willRun = !1, this._didEmitFrameData || (this._didEmitFrameData = !0, this.trigger("start", t))
            }, n._onAnimationFrameEnd = function (t) {
                this._willRun || (this.trigger("stop", t), this._reset())
            }, n._reset = function () {
                this._didEmitFrameData = !1, this._isRunning = !1
            }, e.exports = a
        }, {
            "@marcom/ac-event-emitter-micro": 88,
            "@marcom/ac-raf-emitter-id-generator/sharedRAFEmitterIDGeneratorInstance": 145,
            "@marcom/ac-raf-executor/sharedRAFExecutorInstance": 155
        }],
        147: [function (t, e, i) {
            "use strict";
            var n = t("./SingleCallRAFEmitter"),
                r = function (t) {
                    this.rafEmitter = new n, this.rafEmitter.on(t, this._onRAFExecuted.bind(this)), this.requestAnimationFrame = this.requestAnimationFrame.bind(this), this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this), this._frameCallbacks = [], this._nextFrameCallbacks = [], this._currentFrameID = -1, this._cancelFrameIdx = -1, this._frameCallbackLength = 0, this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0
                },
                o = r.prototype;
            o.requestAnimationFrame = function (t) {
                return this._currentFrameID = this.rafEmitter.run(), this._nextFrameCallbacks.push(this._currentFrameID, t), this._nextFrameCallbacksLength += 2, this._currentFrameID
            }, o.cancelAnimationFrame = function (t) {
                this._cancelFrameIdx = this._nextFrameCallbacks.indexOf(t), -1 !== this._cancelFrameIdx && (this._nextFrameCallbacks.splice(this._cancelFrameIdx, 2), this._nextFrameCallbacksLength -= 2, 0 === this._nextFrameCallbacksLength && this.rafEmitter.cancel())
            }, o._onRAFExecuted = function (t) {
                for (this._frameCallbacks = this._nextFrameCallbacks, this._frameCallbackLength = this._nextFrameCallbacksLength, this._nextFrameCallbacks = [], this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0; this._frameCallbackIteration < this._frameCallbackLength; this._frameCallbackIteration += 2) this._frameCallbacks[this._frameCallbackIteration + 1](t.time, t)
            }, e.exports = r
        }, {
            "./SingleCallRAFEmitter": 149
        }],
        148: [function (t, e, i) {
            "use strict";
            var n = t("./RAFInterface"),
                r = function () {
                    this.events = {}
                },
                o = r.prototype;
            o.requestAnimationFrame = function (t) {
                return this.events[t] || (this.events[t] = new n(t)), this.events[t].requestAnimationFrame
            }, o.cancelAnimationFrame = function (t) {
                return this.events[t] || (this.events[t] = new n(t)), this.events[t].cancelAnimationFrame
            }, e.exports = new r
        }, {
            "./RAFInterface": 147
        }],
        149: [function (t, e, i) {
            "use strict";
            var n = t("./RAFEmitter"),
                r = function (t) {
                    n.call(this, t)
                };
            (r.prototype = Object.create(n.prototype))._subscribe = function () {
                return this.executor.subscribe(this, !0)
            }, e.exports = r
        }, {
            "./RAFEmitter": 146
        }],
        150: [function (t, e, i) {
            "use strict";
            var n = t("./RAFInterfaceController");
            e.exports = n.cancelAnimationFrame("draw")
        }, {
            "./RAFInterfaceController": 148
        }],
        151: [function (t, e, i) {
            "use strict";
            var n = t("./RAFInterfaceController");
            e.exports = n.cancelAnimationFrame("update")
        }, {
            "./RAFInterfaceController": 148
        }],
        152: [function (t, e, i) {
            "use strict";
            var n = t("./RAFInterfaceController");
            e.exports = n.requestAnimationFrame("draw")
        }, {
            "./RAFInterfaceController": 148
        }],
        153: [function (t, e, i) {
            "use strict";
            var n = t("./RAFInterfaceController");
            e.exports = n.requestAnimationFrame("update")
        }, {
            "./RAFInterfaceController": 148
        }],
        154: [function (t, e, i) {
            "use strict";
            var n;

            function r(t) {
                t = t || {}, this._reset(), this._willRun = !1, this._totalSubscribeCount = -1, this._requestAnimationFrame = window.requestAnimationFrame, this._cancelAnimationFrame = window.cancelAnimationFrame, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
            }
            t("@marcom/ac-polyfills/performance/now"), (n = r.prototype).subscribe = function (t, e) {
                return this._totalSubscribeCount++, this._nextFrameSubscribers[t.id] || (e ? this._nextFrameSubscribersOrder.unshift(t.id) : this._nextFrameSubscribersOrder.push(t.id), this._nextFrameSubscribers[t.id] = t, this._nextFrameSubscriberArrayLength++, this._nextFrameSubscriberCount++, this._run()), this._totalSubscribeCount
            }, n.unsubscribe = function (t) {
                return !!this._nextFrameSubscribers[t.id] && (this._nextFrameSubscribers[t.id] = null, this._nextFrameSubscriberCount--, 0 === this._nextFrameSubscriberCount && this._cancel(), !0)
            }, n.trigger = function (t, e) {
                var i;
                for (i = 0; i < this._subscriberArrayLength; i++) null !== this._subscribers[this._subscribersOrder[i]] && !1 === this._subscribers[this._subscribersOrder[i]]._didDestroy && this._subscribers[this._subscribersOrder[i]].trigger(t, e)
            }, n.destroy = function () {
                var t = this._cancel();
                return this._subscribers = null, this._subscribersOrder = null, this._nextFrameSubscribers = null, this._nextFrameSubscribersOrder = null, this._rafData = null, this._boundOnAnimationFrame = null, this._onExternalAnimationFrame = null, t
            }, n.useExternalAnimationFrame = function (t) {
                if ("boolean" == typeof t) {
                    var e = this._isUsingExternalAnimationFrame;
                    return t && this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), !this._willRun || t || this._animationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this._isUsingExternalAnimationFrame = t, t ? this._boundOnExternalAnimationFrame : e || !1
                }
            }, n._run = function () {
                if (!this._willRun) return this._willRun = !0, 0 === this.lastFrameTime && (this.lastFrameTime = performance.now()), this._animationFrameActive = !0, this._isUsingExternalAnimationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), !0
            }, n._cancel = function () {
                var t = !1;
                return this._animationFrameActive && (this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), this._animationFrameActive = !1, this._willRun = !1, t = !0), this._isRunning || this._reset(), t
            }, n._onSubscribersAnimationFrameStart = function (t) {
                var e;
                for (e = 0; e < this._subscriberArrayLength; e++) null !== this._subscribers[this._subscribersOrder[e]] && !1 === this._subscribers[this._subscribersOrder[e]]._didDestroy && this._subscribers[this._subscribersOrder[e]]._onAnimationFrameStart(t)
            }, n._onSubscribersAnimationFrameEnd = function (t) {
                var e;
                for (e = 0; e < this._subscriberArrayLength; e++) null !== this._subscribers[this._subscribersOrder[e]] && !1 === this._subscribers[this._subscribersOrder[e]]._didDestroy && this._subscribers[this._subscribersOrder[e]]._onAnimationFrameEnd(t)
            }, n._onAnimationFrame = function (t) {
                this._subscribers = this._nextFrameSubscribers, this._subscribersOrder = this._nextFrameSubscribersOrder, this._subscriberArrayLength = this._nextFrameSubscriberArrayLength, this._subscriberCount = this._nextFrameSubscriberCount, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._isRunning = !0, this._willRun = !1, this._didRequestNextRAF = !1, this._rafData.delta = t - this.lastFrameTime, this.lastFrameTime = t, this._rafData.fps = 0, this._rafData.delta >= 1e3 && (this._rafData.delta = 0), 0 !== this._rafData.delta && (this._rafData.fps = 1e3 / this._rafData.delta), this._rafData.time = t, this._rafData.naturalFps = this._rafData.fps, this._rafData.timeNow = Date.now(), this._onSubscribersAnimationFrameStart(this._rafData), this.trigger("update", this._rafData), this.trigger("external", this._rafData), this.trigger("draw", this._rafData), this._onSubscribersAnimationFrameEnd(this._rafData), this._willRun || this._reset()
            }, n._onExternalAnimationFrame = function (t) {
                this._isUsingExternalAnimationFrame && this._onAnimationFrame(t)
            }, n._reset = function () {
                this._rafData = {
                    time: 0,
                    delta: 0,
                    fps: 0,
                    naturalFps: 0,
                    timeNow: 0
                }, this._subscribers = {}, this._subscribersOrder = [], this._subscriberArrayLength = 0, this._subscriberCount = 0, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._didEmitFrameData = !1, this._animationFrame = null, this._animationFrameActive = !1, this._isRunning = !1, this._shouldReset = !1, this.lastFrameTime = 0
            }, e.exports = r
        }, {
            "@marcom/ac-polyfills/performance/now": 139
        }],
        155: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-shared-instance").SharedInstance,
                r = t("./RAFExecutor");
            e.exports = n.share("ac-raf-executor:sharedRAFExecutorInstance", "2.0.1", r)
        }, {
            "./RAFExecutor": 154,
            "@marcom/ac-shared-instance": 162
        }],
        156: [function (t, e, i) {
            "use strict";
            e.exports = {
                Router: t("./ac-router/Router"),
                History: t("./ac-router/History"),
                Routes: t("@marcom/ac-routes").Routes,
                Route: t("@marcom/ac-routes").Route
            }
        }, {
            "./ac-router/History": 157,
            "./ac-router/Router": 158,
            "@marcom/ac-routes": 159
        }],
        157: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-object").create,
                r = t("@marcom/ac-dom-events"),
                o = t("@marcom/ac-event-emitter").EventEmitter;

            function s(t) {
                t = t || {}, this.history = window.history, this.rootStripper = /^\/+|\/+$/g, this.root = t.root || "/", this.root = ("/" + this.root + "/").replace(this.rootStripper, "/");
                var e = "boolean" != typeof t.resolveInitialHash || t.resolveInitialHash;
                this._pushState = "boolean" != typeof t.pushState || t.pushState, this._hashChange = t.hashChange || !1, this._setUpdateVars(e), t.autoStart && this.start()
            }
            var a = s.prototype = n(o.prototype);
            a._isRoot = function (t) {
                return ("/" + t + "/").replace(this.rootStripper, "/") === this.root
            }, a._isPushStateSupported = function () {
                return this.history && this.history.pushState
            }, a._isHashChangeSupported = function () {
                return "onhashchange" in window
            }, a._setUpdateVars = function (t) {
                if (this._pushState && this._isPushStateSupported()) t && this._hashChange && -1 !== window.location.href.indexOf("#") && this.history.pushState({}, document.title, window.location.href.replace("#", "")), this._hashChange = !1;
                else {
                    if (t && this._pushState && this._hashChange && window.location.href.indexOf("#") < 0) {
                        window.location.origin || (window.location.origin = window.location.protocol + "//" + window.location.hostname, window.location.origin += window.location.port ? ":" + window.location.port : "");
                        var e = window.location.href.substr(window.location.origin.length + this.root.length);
                        if (e.length) return void(window.location = window.location.origin + this.root + "#" + e)
                    }
                    this._hashChange && !this._isHashChangeSupported() && (this._interval = 50, this._iframe = document.createElement('<iframe src="javascript:0" tabindex="-1" style="display:none;">'), this._iframe = document.body.appendChild(this._iframe).contentWindow, this._iframe.document.open().close()), this._pushState = !1
                }
            }, a._checkUrl = function () {
                var t = this._iframe.location.hash.substr(1);
                0 === t.length && (t = "/"), this.fragment() !== t && (window.location.hash = "#" + t, this._ignoreHashChange = !1, this._handleHashChange())
            }, a._handlePopState = function (t) {
                this.trigger("popstate", {
                    fragment: this.fragment()
                })
            }, a._handleHashChange = function (t) {
                this._ignoreHashChange ? this._ignoreHashChange = !1 : this.trigger("popstate", {
                    fragment: this.fragment()
                })
            }, a.canUpdate = function () {
                return this._pushState || this._hashChange
            }, a.start = function () {
                return this.started || !this._pushState && !this._hashChange || (this.started = !0, this._pushState ? (this._handlePopState = this._handlePopState.bind(this), r.addEventListener(window, "popstate", this._handlePopState)) : this._hashChange && (this._isHashChangeSupported() ? (this._handleHashChange = this._handleHashChange.bind(this), r.addEventListener(window, "hashchange", this._handleHashChange)) : (this._iframe.location.hash = this.fragment(), this._checkUrl = this._checkUrl.bind(this), this._checkUrlInterval = setInterval(this._checkUrl, this._interval)))), this.started || !1
            }, a.stop = function () {
                this.started && (this.started = !1, this._pushState ? r.removeEventListener(window, "popstate", this._handlePopState) : this._hashChange && (this._isHashChangeSupported() ? r.removeEventListener(window, "hashchange", this._handleHashChange) : this._checkUrlInterval && (clearInterval(this._checkUrlInterval), this._checkUrlInterval = null)))
            }, a.navigate = function (t, e) {
                if (!this.started || !this.canUpdate()) return !1;
                e = e || {};
                var i = ((this._isRoot(t) ? "" : this.root) + t).replace(/([^:])(\/\/)/g, "$1/");
                return this._pushState ? this.history.pushState(e, document.title, i) : this._hashChange && (this._ignoreHashChange = !0, window.location.hash = "#" + t, this._isHashChangeSupported() || (this._iframe.document.open().close(), this._iframe.location.hash = "#" + t)), !0
            }, a.fragment = function () {
                var t = "";
                return this._pushState ? t = window.location.pathname.substr(this.root.length) : this._hashChange && (t = window.location.hash.substr(1)), "" === t ? "/" : t
            }, e.exports = s
        }, {
            "@marcom/ac-dom-events": 56,
            "@marcom/ac-event-emitter": 90,
            "@marcom/ac-object": 121
        }],
        158: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-object").create,
                r = t("@marcom/ac-dom-emitter").DOMEmitter,
                o = t("./History"),
                s = (t("@marcom/ac-routes").Route, t("@marcom/ac-routes").Routes);

            function a(t) {
                t = t || {}, this._intercept = t.intercept || "[data-route]", this._interceptAttribute = t.attribute || "href", this._handleTrigger = this._handleTrigger.bind(this), this.intercept(this._intercept), this.history = t.history || new o({
                    root: t.root,
                    autoStart: t.autoStart,
                    pushState: t.pushState,
                    hashChange: t.hashChange,
                    resolveInitialHash: t.resolveInitialHash
                }), s.call(this, t.routes), t.autoStart && (this.history.started || this.history.start(), this.start())
            }
            var c = a.prototype = n(s.prototype);
            c._handleTrigger = function (t) {
                if (this.started) {
                    var e = t.target.getAttribute(this._interceptAttribute);
                    e && (/^(http|https):\/\/+/.exec(e) && "href" === this._interceptAttribute && (e = e.substr(e.indexOf(this.history.root) + this.history.root.length) || "/"), this.navigate(e) && t.preventDefault())
                }
            }, c._handlePopstate = function (t) {
                this.navigate(t.fragment, !0)
            }, c.start = function () {
                this.started || (this.started = !0, this.history.start(), this._handlePopstate = this._handlePopstate.bind(this), this.history.on("popstate", this._handlePopstate), this.navigate(this.history.fragment(), !0))
            }, c.stop = function () {
                this.started && (this.started = !1, this.history.stop(), this.history.off("popstate", this._handlePopstate))
            }, c.navigate = function (t, e) {
                return this.history.fragment() !== t || e ? !(t && !e && !this.history.navigate(t)) && (this.match(t), !0) : this.history.canUpdate()
            }, c.intercept = function (t, e) {
                new r(e || document.body).on("click", t, this._handleTrigger)
            }, e.exports = a
        }, {
            "./History": 157,
            "@marcom/ac-dom-emitter": 51,
            "@marcom/ac-object": 121,
            "@marcom/ac-routes": 159
        }],
        159: [function (t, e, i) {
            "use strict";
            e.exports = {
                Routes: t("./ac-routes/Routes"),
                Route: t("./ac-routes/Route")
            }
        }, {
            "./ac-routes/Route": 160,
            "./ac-routes/Routes": 161
        }],
        160: [function (t, e, i) {
            "use strict";

            function n(t, e, i, n, r) {
                if (this.path = t, this.callback = e, this.context = i, this.greedy = n || !1, this.priority = r || 0, "number" != typeof this.priority) throw new Error("Priority must be a Number.");
                this.identifierPattern = "([a-zA-Z0-9\\-\\_]+)", this.tokensRe = new RegExp(":" + this.identifierPattern, "g"), this.matcher = this._createRouteMatcher(t)
            }
            var r = n.prototype;
            r._createRouteMatcher = function (t) {
                if (t && t.exec) return {
                    pattern: t
                };
                if ("/" === t) return {
                    pattern: /^\/$/
                };
                if ("string" != typeof t) throw new Error("path must be either a string or regex");
                var e = this._extractRouteTokens(t),
                    i = t.replace(this.tokensRe, this.identifierPattern);
                return {
                    pattern: new RegExp(i, "g"),
                    routeTokens: e
                }
            }, r._extractRouteTokens = function (t) {
                var e = t.replace(this.tokensRe, ":" + this.identifierPattern),
                    i = new RegExp(e, "g").exec(t);
                return i = i && i.length > 1 ? i.slice(1) : null
            }, r.match = function (t) {
                this.matcher.pattern.lastIndex = 0;
                var e = this.matcher.pattern.exec(t);
                if (e) {
                    var i = e.length ? e.slice(1) : [],
                        n = this.callback;
                    if (n && "function" == typeof n) return n.apply(this.context || this, i), !0
                }
                return !1
            }, e.exports = n
        }, {}],
        161: [function (t, e, i) {
            "use strict";
            var n = t("./Route");

            function r(t) {
                this._routes = {}, t && this.addRoutes(t)
            }
            var o = r.prototype;
            o._getIndex = function (t, e, i) {
                if (void 0 !== this._routes[t])
                    for (var n = this._routes[t].length; --n > -1;)
                        if (this._routes[t][n].callback === e && this._routes[t][n].context === i) return n;
                return -1
            }, o.match = function (t) {
                var e, i;
                for (e in this._routes)
                    for (i = this._routes[e].length; --i > -1 && (!this._routes[e][i].match(t) || !this._routes[e][i].greedy););
            }, o.add = function (t) {
                if (void 0 === this._routes[t.path]) this._routes[t.path] = [t];
                else if (!this.get(t.path, t.callback, t.context)) {
                    var e, i = this._routes[t.path].length;
                    if (i > 0)
                        for (e = 0; e < i; ++e)
                            if (this._routes[t.path][e].priority > t.priority) return this._routes[t.path].splice(e, 0, t), t;
                    this._routes[t.path].push(t)
                }
                return t
            }, o.remove = function (t) {
                var e = this._getIndex(t.path, t.callback, t.context);
                return e > -1 && (this._routes[t.path].splice(e, 1), t)
            }, o.get = function (t, e, i) {
                var n = this._getIndex(t, e, i);
                return n > -1 && this._routes[t][n]
            }, o.createRoute = function (t, e, i, r, o) {
                var s = new n(t, e, i, r, o);
                return this.add(s), s
            }, o.addRoutes = function (t) {
                if (!(t instanceof Array)) throw new Error("routes must be an Array.");
                var e, i, n = t.length;
                for (e = 0; e < n; ++e)(i = t[e]) && "object" == typeof i && this.add(i)
            }, o.removeRoutes = function (t) {
                if (!(t instanceof Array)) throw new Error("routes must be an Array.");
                var e, i, n = t.length;
                for (e = 0; e < n; ++e)(i = t[e]) && "object" == typeof i && this.remove(i)
            }, o.getRoutes = function (t) {
                return void 0 === this._routes[t] ? [] : this._routes[t]
            }, e.exports = r
        }, {
            "./Route": 160
        }],
        162: [function (t, e, i) {
            "use strict";
            e.exports = {
                SharedInstance: t("./ac-shared-instance/SharedInstance")
            }
        }, {
            "./ac-shared-instance/SharedInstance": 163
        }],
        163: [function (t, e, i) {
            "use strict";
            var n, r = window,
                o = r.AC,
                s = (n = {}, {
                    get: function (t, e) {
                        var i = null;
                        return n[t] && n[t][e] && (i = n[t][e]), i
                    },
                    set: function (t, e, i) {
                        return n[t] || (n[t] = {}), n[t][e] = "function" == typeof i ? new i : i, n[t][e]
                    },
                    share: function (t, e, i) {
                        var n = this.get(t, e);
                        return n || (n = this.set(t, e, i)), n
                    },
                    remove: function (t, e) {
                        var i = typeof e;
                        if ("string" !== i && "number" !== i) n[t] && (n[t] = null);
                        else {
                            if (!n[t] || !n[t][e]) return;
                            n[t][e] = null
                        }
                    }
                });
            o || (o = r.AC = {}), o.SharedInstance || (o.SharedInstance = s), e.exports = o.SharedInstance
        }, {}],
        164: [function (t, e, i) {
            "use strict";
            const n = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                r = t("@marcom/dom-metrics"),
                o = t("@marcom/ac-keyboard/Keyboard"),
                s = t("./templates/slider.html"),
                a = {
                    num: 37,
                    string: "ArrowLeft"
                },
                c = 38,
                l = {
                    num: 39,
                    string: "ArrowRight"
                },
                u = {
                    num: 40,
                    string: "ArrowDown"
                },
                h = [a, l, u, l],
                d = function (t) {
                    if (t.which) return t.which;
                    for (var e = t.key ? t.key : t.code, i = 0, n = h.length; i < n; i++)
                        if (h[i].string === e) return h[i].num;
                    return -1
                },
                p = {
                    min: 0,
                    max: 1,
                    step: 1,
                    value: 0,
                    orientation: "horizontal",
                    renderedPosition: !1,
                    template: s,
                    keyboardMaxStepPercentage: .05,
                    keyboardStepMultiplier: 1.25,
                    containerClass: "ac-slider-container",
                    grabbedClass: "ac-slider-grabbed"
                },
                f = Object.keys(p),
                m = function (t, e) {
                    this.options = Object.assign({}, p, e), this.model = Object.create(this.options), this.el = t;
                    var i = void 0 !== this.options.keyboardContext ? this.options.keyboardContext : this.el;
                    null !== i && (this._keyboard = new o(i), this._keyDown = {}), t.classList.add(this.model.containerClass), t.innerHTML = this.model.template, n.call(this), this._initialize()
                },
                _ = m.prototype = Object.create(n.prototype);
            _._addGrabClass = function () {
                this.el.classList.add(this.model.grabbedClass)
            }, _._removeGrabClass = function () {
                this.el.classList.remove(this.model.grabbedClass)
            }, _._addEventListeners = function () {
                this._addEventListener(this.el, "mousedown", this._onMouseDown), this._addEventListener(this.el, "touchstart", this._onTouchStart), this._addEventListener(this.el, "mouseover", this._onMouseOver), this._addEventListener(this.el, "mouseleave", this._onMouseLeave), this._keyboard && ("horizontal" === this.model.orientation ? (this._keyboard.onDown(l.num, this.stepUp), this._keyboard.onDown(a.num, this.stepDown)) : (this._keyboard.onDown(u.num, this.stepDown), this._keyboard.onDown(c, this.stepUp)))
            }, _._addEventListener = function (t, e, i, n) {
                t.addEventListener(e, i, n)
            }, _._bindMethods = function () {
                this._addGrabClass = this._addGrabClass.bind(this), this._removeGrabClass = this._removeGrabClass.bind(this), this.stepDown = this.stepDown.bind(this), this.stepUp = this.stepUp.bind(this), this._triggerRelease = this._triggerRelease.bind(this), this._preventDefault = this._preventDefault.bind(this), this._onMouseDown = this._bindMethod(this._onMouseDown, this), this._onTouchStart = this._bindMethod(this._onTouchStart, this), this._onMouseOver = this._bindMethod(this._onMouseOver, this), this._onMouseLeave = this._bindMethod(this._onMouseLeave, this), this._onTouchEnd = this._bindMethod(this._onTouchEnd, this), this._onMouseUp = this._bindMethod(this._onMouseUp, this), this._onMouseMove = this._bindMethod(this._onMouseMove, this), this._onTouchMove = this._bindMethod(this._onTouchMove, this)
            }, _._bindMethod = function (t, e) {
                return t.bind(e)
            }, _._correctValueMinMax = function (t, e, i) {
                return t > i && (t = i), t < e && (t = e), t
            }, _._calculateStepsToValue = function (t, e) {
                return Math.abs(t - e)
            }, _._calculateMaxSteps = function (t, e) {
                return Math.abs(e - t)
            }, _._calculateStepsEqualToPercentage = function (t, e) {
                return t / 100 * e
            }, _._calculateNextStepInRange = function (t, e, i, n) {
                var r = this._calculateMaxSteps(e, i),
                    o = this._calculateStepsToValue(t, e),
                    s = e + Math.floor(r / n) * n;
                return t = Math.min(s, e + Math.round(o / n) * n)
            }, _._dispatchEvent = function (t, e) {
                t.dispatchEvent(new CustomEvent(e))
            }, _.disableUserControls = function () {
                this._removeEventListeners()
            }, _.enableUserControls = function () {
                this._addEventListeners()
            }, _._getNextValue = function (t, e, i, n) {
                return t = this._correctValueMinMax(t, e, i), "auto" !== n && (t = this._calculateNextStepInRange(t, e, i, n)), t
            }, _.getOrientation = function () {
                return this.model.orientation
            }, _.getValue = function () {
                return this.model.value
            }, _.getMin = function () {
                return this.model.min
            }, _.getMax = function () {
                return this.model.max
            }, _.getStep = function () {
                return this.model.step
            }, _.getClientXValue = function (t, e) {
                var i = this._getClientXFromEvent(t),
                    n = null !== e ? r.getDimensions(e || this.thumbElement) : {
                        width: 0,
                        height: 0
                    },
                    o = r.getDimensions(this.runnableTrackElement),
                    s = (i - this.runnableTrackElement.getBoundingClientRect().left - Math.round(n.width / 2)) / (o.width - n.width) * 100,
                    a = this._calculateMaxSteps(this.getMin(), this.getMax()),
                    c = this._calculateStepsEqualToPercentage(s, a);
                return this.getMin() + c
            }, _.getClientYValue = function (t) {
                var e = this._getClientYFromEvent(t),
                    i = r.getDimensions(this.thumbElement),
                    n = r.getDimensions(this.runnableTrackElement),
                    o = r.getViewportPosition(this.runnableTrackElement, this.model.renderedPosition),
                    s = (n.height - i.height - (e - o.top - i.height / 2)) / (n.height - i.height) * 100,
                    a = this._calculateMaxSteps(this.model.min, this.model.max),
                    c = this._calculateStepsEqualToPercentage(s, a);
                return this.model.min + c
            }, _.getClientValue = function (t) {
                return t = t.originalEvent || t, "horizontal" === this.model.orientation ? this.getClientXValue(t) : this.getClientYValue(t)
            }, _._getClientXFromEvent = function (t) {
                return t.touches ? t.touches[0].clientX : t.clientX
            }, _._getClientYFromEvent = function (t) {
                return t.touches ? t.touches[0].clientY : t.clientY
            }, _._initialize = function () {
                this._setNodeReferences(), this.setValue(this.model.value), this._bindMethods(), this._addEventListeners()
            }, _._onMouseLeave = function () {
                this._preventDocumentMouseUpDispatch = !1
            }, _._onMouseDown = function (t) {
                this._addGrabClass(), this._addEventListener(document, "mouseup", this._onMouseUp), this._addEventListener(document, "mousemove", this._onMouseMove);
                var e = this.getClientValue(t);
                this.trigger("grab", this.getValue()), this.setValue(e)
            }, _._onMouseUp = function () {
                this._removeGrabClass(), this._removeEventListener(document, "mouseup", this._onMouseUp), this._removeEventListener(document, "mousemove", this._onMouseMove), this.trigger("release", this.getValue()), this._preventDocumentMouseUpDispatch || this._dispatchEvent(this.el, "mouseup")
            }, _._onMouseOver = function () {
                this._preventDocumentMouseUpDispatch = !0
            }, _._onTouchEnd = function () {
                this._removeGrabClass(), this._removeEventListener(document, "touchend", this._onTouchEnd), this._removeEventListener(document, "touchmove", this._onTouchMove), this.trigger("release", this.getValue()), this._preventDocumentMouseUpDispatch || this._dispatchEvent(this.el, "touchend")
            }, _._onTouchStart = function (t) {
                this._addGrabClass();
                var e = this.getClientValue(t);
                this._addEventListener(document, "touchend", this._onTouchEnd), this._addEventListener(document, "touchmove", this._onTouchMove, {
                    passive: !1
                }), this.trigger("grab", this.getValue()), this.setValue(e)
            }, _._onMouseMove = function (t) {
                var e = this.getClientValue(t);
                this.setValue(e)
            }, _._onTouchMove = function (t) {
                t.preventDefault && t.preventDefault();
                var e = this.getClientValue(t);
                this.setValue(e)
            }, _._getElementOrientationOffsetValue = function (t, e) {
                return "horizontal" === e ? r.getDimensions(t).width : r.getDimensions(t).height
            }, _._getAvailableRunnableTrack = function (t, e) {
                return t - this._getElementOrientationOffsetValue(this.thumbElement, e)
            }, _._getPercentageByValue = function (t, e) {
                return (t = this._calculateStepsToValue(t, this.getMin())) / this._calculateMaxSteps(this.getMin(), this.getMax()) * 100
            }, _._getPercentageOfRunnableTrack = function (t) {
                var e = this.getOrientation(),
                    i = this._getElementOrientationOffsetValue(this.runnableTrackElement, e),
                    n = this._getAvailableRunnableTrack(i, e);
                return this._getPercentageByValue(t, this.getMax()) / 100 * n / i * 100
            }, _._onChange = function (t) {
                var e = this._getPercentageOfRunnableTrack(t);
                isNaN(e) || ("horizontal" === this.getOrientation() ? this.thumbElement.style.left = e + "%" : this.thumbElement.style.bottom = e + "%", this.trigger("change", this.getValue()))
            }, _._removeEventListeners = function () {
                this._removeEventListener(this.el, "mousedown", this._onMouseDown), this._removeEventListener(this.el, "touchstart", this._onTouchStart), this._removeEventListener(this.el, "mouseover", this._onMouseOver), this._removeEventListener(this.el, "mouseleave", this._onMouseLeave), this._removeEventListener(document, "touchend", this._onMouseUp)
            }, _._removeEventListener = function (t, e, i) {
                t.removeEventListener(e, i)
            }, _._setNodeReferences = function () {
                this.runnableTrackElement = this.el.querySelector(".ac-slider-runnable-track"), this.thumbElement = this.el.querySelector(".ac-slider-thumb")
            }, _.setOrientation = function (t) {
                this._set("orientation", t)
            }, _._triggerRelease = function (t) {
                this._preventDefault(t), this.trigger("release", this.getValue()), this._keyDown[d(t)] = 0
            }, _._preventDefault = function (t) {
                t.preventDefault(), t.stopPropagation()
            }, _._step = function (t, e) {
                this._preventDefault(t), this.el.focus();
                var i = this._keyDown[d(t)] || 0;
                i ? Math.abs(this._keyDown[d(t)]) < Math.abs(this.model.max * this.model.keyboardMaxStepPercentage) && (i *= this.model.keyboardStepMultiplier) : (this.trigger("grab", this.getValue()), i = "auto" !== (i = this.getStep()) ? i : this._cachedMaxStep, e || (i *= -1), this._keyboard.onceUp(d(t), this._triggerRelease)), this._keyDown[d(t)] = i, this.setValue(this.getValue() + i)
            }, _.stepUp = function (t) {
                this._step(t, !0)
            }, _.stepDown = function (t) {
                this._step(t, !1)
            }, _.setValue = function (t) {
                t = this._getNextValue(t, this.getMin(), this.getMax(), this.getStep()), this._set("value", t), this.el.setAttribute("aria-valuenow", t), this._onChange(t)
            }, _.setMin = function (t) {
                this._set("min", t), this.el.setAttribute("aria-valuemin", t)
            }, _.setMax = function (t) {
                this._set("max", t), this.el.setAttribute("aria-valuemax", t), this._cachedMaxStep = t / 100
            }, _.setStep = function (t) {
                this._set("step", t)
            }, _._set = function (t, e) {
                if (f.indexOf(t) > -1 && this.model[t] !== e) {
                    var i = this.model[t];
                    this.model[t] = e, this.trigger("change:model:" + t, {
                        previous: i,
                        current: e
                    })
                }
            }, _._removeEventListeners = function () {
                this._removeEventListener(this.el, "mousedown", this._onMouseDown), this._removeEventListener(this.el, "touchstart", this._onTouchStart), this._removeEventListener(this.el, "mouseover", this._onMouseOver), this._removeEventListener(this.el, "mouseleave", this._onMouseLeave), this._removeEventListener(this.el, "touchend", this._onTouchEnd), this._removeEventListener(document, "touchend", this._onMouseUp), "horizontal" === this.model.orientation ? (this._keyboard.offDown(l.num, this.stepUp), this._keyboard.offDown(a.num, this.stepDown), this._keyboard.offUp(a.num, this._triggerRelease), this._keyboard.offUp(l.num, this._triggerRelease)) : (this._keyboard.offDown(u.num, this.stepDown), this._keyboard.offDown(c, this.stepUp), this._keyboard.offUp(u.num, this._triggerRelease), this._keyboard.offUp(c, this._triggerRelease))
            }, _.destroy = function () {
                this._removeEventListeners(), this._keyboard && this._keyboard.destroy(), n.prototype.destroy.call(this)
            }, e.exports = m
        }, {
            "./templates/slider.html": 166,
            "@marcom/ac-event-emitter-micro": 88,
            "@marcom/ac-keyboard/Keyboard": 108,
            "@marcom/dom-metrics": 284
        }],
        165: [function (t, e, i) {
            "use strict";
            e.exports.Slider = t("./Slider")
        }, {
            "./Slider": 164
        }],
        166: [function (t, e, i) {
            e.exports = '<div class="ac-slider-runnable-track">\n\t<div class="ac-slider-thumb"></div>\n</div>'
        }, {}],
        167: [function (t, e, i) {
            e.exports = t("./lib/")
        }, {
            "./lib/": 168
        }],
        168: [function (t, e, i) {
            var n = t("./stringify"),
                r = t("./parse");
            e.exports = {
                stringify: n,
                parse: r
            }
        }, {
            "./parse": 169,
            "./stringify": 170
        }],
        169: [function (t, e, i) {
            var n = t("./utils"),
                r = {
                    delimiter: "&",
                    depth: 5,
                    arrayLimit: 20,
                    parameterLimit: 1e3,
                    parseValues: function (t, e) {
                        for (var i = {}, r = t.split(e.delimiter, e.parameterLimit === 1 / 0 ? void 0 : e.parameterLimit), o = 0, s = r.length; o < s; ++o) {
                            var a = r[o],
                                c = -1 === a.indexOf("]=") ? a.indexOf("=") : a.indexOf("]=") + 1;
                            if (-1 === c) i[n.decode(a)] = "";
                            else {
                                var l = n.decode(a.slice(0, c)),
                                    u = n.decode(a.slice(c + 1));
                                i.hasOwnProperty(l) ? i[l] = [].concat(i[l]).concat(u) : i[l] = u
                            }
                        }
                        return i
                    },
                    parseObject: function (t, e, i) {
                        if (!t.length) return e;
                        var n = t.shift(),
                            o = {};
                        if ("[]" === n) o = (o = []).concat(r.parseObject(t, e, i));
                        else {
                            var s = "[" === n[0] && "]" === n[n.length - 1] ? n.slice(1, n.length - 1) : n,
                                a = parseInt(s, 10),
                                c = "" + a;
                            !isNaN(a) && n !== s && c === s && a >= 0 && a <= i.arrayLimit ? (o = [])[a] = r.parseObject(t, e, i) : o[s] = r.parseObject(t, e, i)
                        }
                        return o
                    },
                    parseKeys: function (t, e, i) {
                        if (t) {
                            var n = /(\[[^\[\]]*\])/g,
                                o = /^([^\[\]]*)/.exec(t);
                            if (!Object.prototype.hasOwnProperty(o[1])) {
                                var s = [];
                                o[1] && s.push(o[1]);
                                for (var a = 0; null !== (o = n.exec(t)) && a < i.depth;) ++a, Object.prototype.hasOwnProperty(o[1].replace(/\[|\]/g, "")) || s.push(o[1]);
                                return o && s.push("[" + t.slice(o.index) + "]"), r.parseObject(s, e, i)
                            }
                        }
                    }
                };
            e.exports = function (t, e) {
                if ("" === t || null === t || void 0 === t) return {};
                (e = e || {}).delimiter = "string" == typeof e.delimiter || n.isRegExp(e.delimiter) ? e.delimiter : r.delimiter, e.depth = "number" == typeof e.depth ? e.depth : r.depth, e.arrayLimit = "number" == typeof e.arrayLimit ? e.arrayLimit : r.arrayLimit, e.parameterLimit = "number" == typeof e.parameterLimit ? e.parameterLimit : r.parameterLimit;
                for (var i = "string" == typeof t ? r.parseValues(t, e) : t, o = {}, s = Object.keys(i), a = 0, c = s.length; a < c; ++a) {
                    var l = s[a],
                        u = r.parseKeys(l, i[l], e);
                    o = n.merge(o, u)
                }
                return n.compact(o)
            }
        }, {
            "./utils": 171
        }],
        170: [function (t, e, i) {
            var n = t("./utils"),
                r = {
                    delimiter: "&",
                    indices: !0,
                    stringify: function (t, e, i) {
                        if (n.isBuffer(t) ? t = t.toString() : t instanceof Date ? t = t.toISOString() : null === t && (t = ""), "string" == typeof t || "number" == typeof t || "boolean" == typeof t) return [encodeURIComponent(e) + "=" + encodeURIComponent(t)];
                        var o = [];
                        if (void 0 === t) return o;
                        for (var s = Object.keys(t), a = 0, c = s.length; a < c; ++a) {
                            var l = s[a];
                            o = !i.indices && Array.isArray(t) ? o.concat(r.stringify(t[l], e, i)) : o.concat(r.stringify(t[l], e + "[" + l + "]", i))
                        }
                        return o
                    }
                };
            e.exports = function (t, e) {
                var i = void 0 === (e = e || {}).delimiter ? r.delimiter : e.delimiter;
                e.indices = "boolean" == typeof e.indices ? e.indices : r.indices;
                var n = [];
                if ("object" != typeof t || null === t) return "";
                for (var o = Object.keys(t), s = 0, a = o.length; s < a; ++s) {
                    var c = o[s];
                    n = n.concat(r.stringify(t[c], c, e))
                }
                return n.join(i)
            }
        }, {
            "./utils": 171
        }],
        171: [function (t, e, i) {
            i.arrayToObject = function (t) {
                for (var e = {}, i = 0, n = t.length; i < n; ++i) void 0 !== t[i] && (e[i] = t[i]);
                return e
            }, i.merge = function (t, e) {
                if (!e) return t;
                if ("object" != typeof e) return Array.isArray(t) ? t.push(e) : t[e] = !0, t;
                if ("object" != typeof t) return t = [t].concat(e);
                Array.isArray(t) && !Array.isArray(e) && (t = i.arrayToObject(t));
                for (var n = Object.keys(e), r = 0, o = n.length; r < o; ++r) {
                    var s = n[r],
                        a = e[s];
                    t[s] ? t[s] = i.merge(t[s], a) : t[s] = a
                }
                return t
            }, i.decode = function (t) {
                try {
                    return decodeURIComponent(t.replace(/\+/g, " "))
                } catch (e) {
                    return t
                }
            }, i.compact = function (t, e) {
                if ("object" != typeof t || null === t) return t;
                var n = (e = e || []).indexOf(t);
                if (-1 !== n) return e[n];
                if (e.push(t), Array.isArray(t)) {
                    for (var r = [], o = 0, s = t.length; o < s; ++o) void 0 !== t[o] && r.push(t[o]);
                    return r
                }
                var a = Object.keys(t);
                for (o = 0, s = a.length; o < s; ++o) {
                    var c = a[o];
                    t[c] = i.compact(t[c], e)
                }
                return t
            }, i.isRegExp = function (t) {
                return "[object RegExp]" === Object.prototype.toString.call(t)
            }, i.isBuffer = function (t) {
                return null !== t && void 0 !== t && !!(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t))
            }
        }, {}],
        172: [function (t, e, i) {
            "use strict";
            e.exports = {
                Link: t("./ac-social/Link"),
                Dialog: t("./ac-social/Dialog"),
                Focus: t("./ac-social/Focus"),
                Debug: t("./ac-social/Debug")
            }
        }, {
            "./ac-social/Debug": 173,
            "./ac-social/Dialog": 174,
            "./ac-social/Focus": 175,
            "./ac-social/Link": 176
        }],
        173: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkActions");

            function r() {
                var t;
                for (t in this.types = {}, n) n.hasOwnProperty(t) && (o[t] = t, this.addType(t, n[t].getDialogDebugData.bind(n[t])))
            }
            var o = r.prototype;
            o.create = function (t, e) {
                e = e || {};
                var i = this.types[t];
                if (i) return i(e)
            }, o.addType = function (t, e) {
                return this.types[t] = e, this
            }, o.removeType = function () {
                return this.types[name] = null, this
            }, e.exports = new r
        }, {
            "./NetworkActions": 177
        }],
        174: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkActions");

            function r() {
                var t;
                for (t in this.types = {}, n) n.hasOwnProperty(t) && (o[t] = t, this.addType(t, n[t].generateDialog.bind(n[t])))
            }
            var o = r.prototype;
            o.create = function (t, e) {
                e = e || {};
                var i = this.types[t];
                if (i) return i(e)
            }, o.addType = function (t, e) {
                return this.types[t] = e, this
            }, o.removeType = function () {
                return this.types[name] = null, this
            }, e.exports = new r
        }, {
            "./NetworkActions": 177
        }],
        175: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                if (window.getSelection) {
                    var e = window.getSelection();
                    (i = document.createRange()).selectNodeContents(t), e.removeAllRanges(), e.addRange(i)
                } else if (t.setSelectionRange) t.setSelectionRange(0, t.value.length);
                else if (document.body.createTextRange) {
                    var i;
                    (i = document.body.createTextRange()).moveToElementText(t), i.select()
                }
            }
        }, {}],
        176: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkActions"),
                r = t("./network-actions/DefaultNetworkAction");

            function o() {
                var t;
                for (t in this.types = {}, n) n.hasOwnProperty(t) && (s[t] = t, this.addType(t, n[t].generateLink.bind(n[t])))
            }
            var s = o.prototype;
            s.create = function (t, e, i) {
                e = e || {};
                var n = this.types[t];
                if (n) return n(e, i)
            }, s.createFromAnchor = function (t) {
                var e, i = t.getAttribute("data-network-action");
                for (e in n)
                    if (n.hasOwnProperty(e) && i === n[e].id) return void n[e].enhanceLinkEngagement(t);
                r.enhanceLinkEngagement(t)
            }, s.addType = function (t, e) {
                return this.types[t] = e, this
            }, s.removeType = function () {
                return this.types[name] = null, this
            }, e.exports = new o
        }, {
            "./NetworkActions": 177,
            "./network-actions/DefaultNetworkAction": 178
        }],
        177: [function (t, e, i) {
            "use strict";
            var n = t("./network-actions/FacebookShare"),
                r = t("./network-actions/PinterestShare"),
                o = t("./network-actions/TumblrShare"),
                s = t("./network-actions/TwitterFavorite"),
                a = t("./network-actions/TwitterReply"),
                c = t("./network-actions/TwitterRetweet"),
                l = t("./network-actions/TwitterTweet"),
                u = t("./network-actions/WeiboShare"),
                h = t("./network-actions/QQWeiboShare"),
                d = t("./network-actions/QZoneShare"),
                p = t("./network-actions/RenrenShare"),
                f = t("./network-actions/EMailShare");
            e.exports = {
                FACEBOOK_SHARE: n,
                PINTEREST_SHARE: r,
                TUMBLR_SHARE: o,
                TWITTER_FAVORITE: s,
                TWITTER_REPLY: a,
                TWITTER_RETWEET: c,
                TWITTER_TWEET: l,
                WEIBO_SHARE: u,
                QQWEIBO_SHARE: h,
                QZONE_SHARE: d,
                RENREN_SHARE: p,
                EMAIL_SHARE: f
            }
        }, {
            "./network-actions/EMailShare": 179,
            "./network-actions/FacebookShare": 180,
            "./network-actions/PinterestShare": 182,
            "./network-actions/QQWeiboShare": 183,
            "./network-actions/QZoneShare": 184,
            "./network-actions/RenrenShare": 185,
            "./network-actions/TumblrShare": 186,
            "./network-actions/TwitterFavorite": 187,
            "./network-actions/TwitterReply": 188,
            "./network-actions/TwitterRetweet": 189,
            "./network-actions/TwitterTweet": 190,
            "./network-actions/WeiboShare": 191
        }],
        178: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                return t
            }, {
                baseLinkPath: ""
            })
        }, {
            "./NetworkAction": 181
        }],
        179: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                var e = {
                    url: t.url
                };
                return t.title && (e.subject = t.title), t.description ? e.body = t.description + "\r\n\r\n" + t.url : e.body = t.url, e
            }, {
                id: "email-share",
                baseLinkPath: "mailto:",
                preventDialog: !0
            })
        }, {
            "./NetworkAction": 181
        }],
        180: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                return {
                    u: t.url
                }
            }, {
                id: "facebook-share",
                baseLinkPath: "https://www.facebook.com/sharer/sharer.php",
                dialogDimensions: {
                    width: 555,
                    height: 368
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        181: [function (t, e, i) {
            "use strict";
            var n, r = t("qs"),
                o = function (t, e) {
                    e = e || {}, this.baseLinkPath = e.baseLinkPath, e.dialogDimensions && (this.dialogDimensions = e.dialogDimensions), e.id && (this.id = e.id), e.preventDialog && (this.preventDialog = e.preventDialog), this.normalizeData = t
                };
            (n = o.prototype).dataAttributeName = "network-action", n.id = "network-action", n.normalizeData = function (t) {
                return t
            }, n.dialogDimensions = {
                width: 500,
                height: 500
            }, n.generateLinkURL = function (t) {
                var e = this.normalizeData(t),
                    i = r.stringify(e),
                    n = this.baseLinkPath;
                return i.length > 0 && (n = n + "?" + i), n
            }, n.generateLink = function (t, e) {
                var i = this.generateLinkURL(t);
                return (e = e || document.createElement("A")).setAttribute("href", i), e.setAttribute("target", "_blank"), e.setAttribute("data-" + this.dataAttributeName, this.id), this.enhanceLinkEngagement(e, i), e
            }, n.generateDialog = function (t) {
                var e = this.generateLinkURL(t);
                this._triggerDialog(e)
            }, n.enhanceLinkEngagement = function (t, e) {
                e = e || t.getAttribute("href"), t.addEventListener("click", this._onLinkEngaged.bind(this, e))
            }, n.getDialogOptions = function () {
                var t, e = "status=1",
                    i = {
                        width: this.dialogDimensions.width,
                        height: this.dialogDimensions.height
                    };
                for (t in i.top = (window.screen.availHeight - i.height) / 2, i.left = (window.screen.availWidth - i.width) / 2, i) i.hasOwnProperty(t) && (e += ", " + t + "=" + i[t]);
                return e
            }, n.getDialogDebugData = function (t) {
                return {
                    data: this.normalizeData(t),
                    dialogUrl: this.generateLinkURL(t)
                }
            }, n._triggerDialog = function (t) {
                this.preventDialog ? window.location.href = t : window.open(t, "_blank", this.getDialogOptions())
            }, n._onLinkEngaged = function (t, e) {
                e.preventDefault(), this._triggerDialog(t)
            }, e.exports = o
        }, {
            qs: 167
        }],
        182: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                var e = {
                    url: t.url,
                    description: t.description
                };
                return t.media && (e.media = t.media), e
            }, {
                id: "pinterest-share",
                baseLinkPath: "http://www.pinterest.com/pin/create/button",
                dialogDimensions: {
                    width: 750,
                    height: 450
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        183: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                return {
                    url: t.url,
                    title: t.title,
                    pic: t.media
                }
            }, {
                id: "qq-weibo-share",
                baseLinkPath: "http://v.t.qq.com/share/share.php",
                dialogDimensions: {
                    width: 658,
                    height: 506
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        184: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                return {
                    url: t.url,
                    title: t.title,
                    pics: t.media,
                    summary: t.description
                }
            }, {
                id: "qzone-share",
                baseLinkPath: "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey",
                dialogDimensions: {
                    width: 620,
                    height: 645
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        185: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                return {
                    url: t.url,
                    title: t.title
                }
            }, {
                id: "renren-share",
                baseLinkPath: "http://www.connect.renren.com/share/sharer",
                dialogDimensions: {
                    width: 500,
                    height: 315
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        186: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                var e = {
                    clickthru: t.url,
                    caption: t.description
                };
                return t.media && (e.source = t.media), e
            }, {
                id: "tumblr-share",
                baseLinkPath: "http://www.tumblr.com/share/photo",
                dialogDimensions: {
                    width: 450,
                    height: 432
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        187: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                return {
                    tweet_id: t.messageId
                }
            }, {
                id: "twitter-favorite",
                baseLinkPath: "https://twitter.com/intent/favorite",
                dialogDimensions: {
                    width: 550,
                    height: 420
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        188: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                var e = {
                    in_reply_to: t.messageId
                };
                return t.hashtags && (e.hashtags = t.hashtags), e
            }, {
                id: "twitter-reply",
                baseLinkPath: "https://twitter.com/intent/tweet",
                dialogDimensions: {
                    width: 550,
                    height: 420
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        189: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                return {
                    tweet_id: t.messageId
                }
            }, {
                id: "twitter-retweet",
                baseLinkPath: "https://twitter.com/intent/retweet",
                dialogDimensions: {
                    width: 550,
                    height: 420
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        190: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                var e = {
                    url: t.url,
                    text: t.description
                };
                return t.hashtags && (e.hashtags = t.hashtags), e
            }, {
                id: "twitter-tweet",
                baseLinkPath: "https://twitter.com/intent/tweet",
                dialogDimensions: {
                    width: 550,
                    height: 420
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        191: [function (t, e, i) {
            "use strict";
            var n = t("./NetworkAction");
            e.exports = new n(function (t) {
                return {
                    url: t.url,
                    title: t.title,
                    pic: t.media
                }
            }, {
                id: "weibo-share",
                baseLinkPath: "http://service.weibo.com/share/share.php",
                dialogDimensions: {
                    width: 650,
                    height: 426
                }
            })
        }, {
            "./NetworkAction": 181
        }],
        192: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e, i) {
                return e ? (i = i || /{([^{}]*)}/g, t.replace(i, function (t, i) {
                    var n = e[i];
                    return "string" == typeof n || "number" == typeof n || "boolean" == typeof n ? n : t
                })) : t
            }
        }, {}],
        193: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e) {
                var i = "";
                if (t) {
                    var n = Object.keys(t),
                        r = n.length - 1;
                    n.forEach(function (e, n) {
                        var o = t[e],
                            s = (e = e.trim()) + (o = null === (o = o && "string" == typeof o ? o.trim() : o) ? "" : "=" + o) + (n === r ? "" : "&");
                        i = i ? i.concat(s) : s
                    })
                }
                return i && !1 !== e ? "?" + i : i
            }
        }, {}],
        194: [function (t, e, i) {
            "use strict";
            var n = {
                ua: window.navigator.userAgent,
                platform: window.navigator.platform,
                vendor: window.navigator.vendor
            };
            e.exports = t("./parseUserAgent")(n)
        }, {
            "./parseUserAgent": 197
        }],
        195: [function (t, e, i) {
            "use strict";
            e.exports = {
                browser: {
                    safari: !1,
                    chrome: !1,
                    firefox: !1,
                    ie: !1,
                    opera: !1,
                    android: !1,
                    edge: !1,
                    version: {
                        name: "",
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
                        name: "",
                        major: 0,
                        minor: 0,
                        patch: 0
                    }
                }
            }
        }, {}],
        196: [function (t, e, i) {
            "use strict";
            e.exports = {
                browser: [{
                    name: "edge",
                    userAgent: "Edge",
                    version: ["rv", "Edge"],
                    test: function (t) {
                        return t.ua.indexOf("Edge") > -1 || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" === t.ua
                    }
                }, {
                    name: "chrome",
                    userAgent: "Chrome"
                }, {
                    name: "firefox",
                    test: function (t) {
                        return t.ua.indexOf("Firefox") > -1 && -1 === t.ua.indexOf("Opera")
                    },
                    version: "Firefox"
                }, {
                    name: "android",
                    userAgent: "Android"
                }, {
                    name: "safari",
                    test: function (t) {
                        return t.ua.indexOf("Safari") > -1 && t.vendor.indexOf("Apple") > -1
                    },
                    version: "Version"
                }, {
                    name: "ie",
                    test: function (t) {
                        return t.ua.indexOf("IE") > -1 || t.ua.indexOf("Trident") > -1
                    },
                    version: ["MSIE", "rv"],
                    parseDocumentMode: function () {
                        var t = !1;
                        return document.documentMode && (t = parseInt(document.documentMode, 10)), t
                    }
                }, {
                    name: "opera",
                    userAgent: "Opera",
                    version: ["Version", "Opera"]
                }],
                os: [{
                    name: "windows",
                    test: function (t) {
                        return t.platform.indexOf("Win") > -1
                    },
                    version: "Windows NT"
                }, {
                    name: "osx",
                    userAgent: "Mac",
                    test: function (t) {
                        return t.platform.indexOf("Mac") > -1
                    }
                }, {
                    name: "ios",
                    test: function (t) {
                        return t.ua.indexOf("iPhone") > -1 || t.ua.indexOf("iPad") > -1
                    },
                    version: ["iPhone OS", "CPU OS"]
                }, {
                    name: "linux",
                    userAgent: "Linux",
                    test: function (t) {
                        return t.platform.indexOf("Linux") > -1 && -1 === t.ua.indexOf("Android")
                    }
                }, {
                    name: "fireos",
                    test: function (t) {
                        return t.ua.indexOf("Firefox") > -1 && t.ua.indexOf("Mobile") > -1
                    },
                    version: "rv"
                }, {
                    name: "android",
                    userAgent: "Android"
                }, {
                    name: "chromeos",
                    userAgent: "CrOS"
                }]
            }
        }, {}],
        197: [function (t, e, i) {
            "use strict";
            var n = t("./defaults"),
                r = t("./dictionary");

            function o(t, e) {
                if ("function" == typeof t.parseVersion) return t.parseVersion(e);
                var i, n = t.version || t.userAgent;
                "string" == typeof n && (n = [n]);
                for (var r, o = n.length, s = 0; s < o; s++)
                    if ((r = e.match((i = n[s], new RegExp(i + "[a-zA-Z\\s/:]+([0-9_.]+)", "i")))) && r.length > 1) return r[1].replace(/_/g, ".")
            }

            function s(t, e, i) {
                for (var n, r, s = t.length, a = 0; a < s; a++)
                    if ("function" == typeof t[a].test ? !0 === t[a].test(i) && (n = t[a].name) : i.ua.indexOf(t[a].userAgent) > -1 && (n = t[a].name), n) {
                        if (e[n] = !0, "string" == typeof (r = o(t[a], i.ua))) {
                            var c = r.split(".");
                            e.version.name = r, c && c.length > 0 && (e.version.major = parseInt(c[0] || 0), e.version.minor = parseInt(c[1] || 0), e.version.patch = parseInt(c[2] || 0))
                        } else "edge" === n && (e.version.name = "12.0.0", e.version.major = "12", e.version.minor = "0", e.version.patch = "0");
                        return "function" == typeof t[a].parseDocumentMode && (e.version.documentMode = t[a].parseDocumentMode()), e
                    } return e
            }
            e.exports = function (t) {
                var e = {};
                return e.browser = s(r.browser, n.browser, t), e.os = s(r.os, n.os, t), e
            }
        }, {
            "./defaults": 195,
            "./dictionary": 196
        }],
        198: [function (t, e, i) {
            e.exports = {
                major: 4,
                minor: 2,
                patch: 0,
                prerelease: null,
                toString: function () {
                    return "4.2.0 (68c64f48)"
                },
                toArray: function () {
                    return [4, 2, 0]
                }
            }
        }, {}],
        199: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                o = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                        return i._chapters = Array.from(t.chapters || []), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "addChapter",
                        value: function (t) {
                            this._chapters.push(t), this._onChange()
                        }
                    }, {
                        key: "removeChapter",
                        value: function (t) {
                            for (var e = -1, i = 0; i < this._chapters.length; i++)
                                if (this._chapters[i].chapter === t) {
                                    e = i;
                                    break
                                } e >= 0 && this._chapters.splice(e, 1), this._onChange()
                        }
                    }, {
                        key: "_onChange",
                        value: function () {
                            this.trigger("change")
                        }
                    }, {
                        key: "getChapterForTime",
                        value: function (t) {
                            for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, i = 0; i < this._chapters.length; i++) {
                                var n = this._chapters[i],
                                    r = n["start-time"];
                                if (!n.duration || isNaN(n.duration)) {
                                    if (this._chapters.length > i + 1) {
                                        var o = this._chapters[i + 1];
                                        if (t >= r - e && t < o["start-time"] - e) return n
                                    } else if (t >= r) return n
                                } else if (r - e <= t && t < r + n.duration - e) return n
                            }
                            return null
                        }
                    }, {
                        key: "clearChapters",
                        value: function () {
                            this._chapters = [], this._onChange()
                        }
                    }, {
                        key: "chapters",
                        set: function (t) {
                            this._chapters = t, this._onChange()
                        },
                        get: function () {
                            return this._chapters
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "@marcom/ac-event-emitter-micro": 88
        }],
        200: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = function () {
                function t(e) {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this._listeners = {}, this.el = e
                }
                return n(t, [{
                    key: "on",
                    value: function (t, e) {
                        this._listeners[t] || (this._listeners[t] = []);
                        var i = {
                            originalCb: e,
                            args: [t, function (t) {
                                e(t)
                            }].concat(Array.from(arguments).slice(2))
                        };
                        this._listeners[t].push(i), this.el.addEventListener.apply(this.el, i.args)
                    }
                }, {
                    key: "off",
                    value: function (t, e) {
                        var i = this._listeners[t],
                            n = -1;
                        if (i.find(function (t) {
                                return n++, t.originalCb === e
                            })) {
                            var r = i[n];
                            this.el.removeEventListener.apply(this.el, r.args), i.splice(n, 1)
                        }
                    }
                }, {
                    key: "replaceElement",
                    value: function (t) {
                        var e = this;
                        Object.keys(this._listeners).forEach(function (i) {
                            e._listeners[i].forEach(function (i) {
                                e.el.removeEventListener.apply(e.el, i.args), t.addEventListener.apply(t, i.args)
                            })
                        }), this.el = t
                    }
                }, {
                    key: "once",
                    value: function (t, e) {
                        var i = this;
                        this.on(t, function n() {
                            e(), i.off(t, n)
                        })
                    }
                }, {
                    key: "trigger",
                    value: function (t, e) {
                        var i = new CustomEvent(t, {
                            detail: e
                        });
                        this.el.dispatchEvent(i)
                    }
                }]), t
            }();
            e.exports = r
        }, {}],
        201: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                s = function (t) {
                    function e() {
                        return function (t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, e),
                            function (t, e) {
                                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return !e || "object" != typeof e && "function" != typeof e ? t : e
                            }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this))
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "once",
                        value: function (t, i, n) {
                            if (n) {
                                r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "once", this).apply(this, [t, function () {
                                    i.apply(n, arguments)
                                }])
                            } else r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "once", this).apply(this, arguments)
                        }
                    }, {
                        key: "on",
                        value: function (t, i, n) {
                            if (arguments.length > 2) {
                                this._boundListeners || (this._boundListeners = {}), this._boundListeners[t] || (this._boundListeners[t] = []);
                                var o = i.bind(n);
                                return this._boundListeners[t].push([i, n, o]), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "on", this).call(this, t, o)
                            }
                            return r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "on", this).apply(this, arguments)
                        }
                    }, {
                        key: "off",
                        value: function (t, i, n) {
                            if (arguments.length > 2) try {
                                for (var o = this._boundListeners[t], s = o.length, a = 0; a < s; a++)
                                    if (o[a][0] === i && o[a][1] === n) {
                                        var c = o.splice(a, 1)[0];
                                        return r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "off", this).call(this, t, c[2])
                                    }
                            } catch (t) {}
                            return r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "off", this).apply(this, arguments)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._boundListeners = void 0, r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = s
        }, {
            "@marcom/ac-event-emitter-micro": 88
        }],
        202: [function (t, e, i) {
            "use strict";
            e.exports = t("./utils/urlOptimizer/OptimizeVideoUrl")
        }, {
            "./utils/urlOptimizer/OptimizeVideoUrl": 279
        }],
        203: [function (t, e, i) {
            "use strict";
            var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                    return typeof t
                } : function (t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                },
                r = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }();
            var o = t("../event-emitter-shim/EventEmitterShim"),
                s = t("../dom-emitter/DOMEmitterMicro"),
                a = t("../chapters/ChapterEmitter"),
                c = t("../video/VideoFactory").create,
                l = t("@marcom/useragent-detect"),
                u = t("@marcom/ac-fullscreen"),
                h = t("../posterframe/PosterFrameFactory"),
                d = t("../ui/localization/Localization"),
                p = t("../ui/error/ErrorView"),
                f = t("@marcom/ac-raf-emitter/update"),
                m = t("@marcom/ac-raf-emitter/cancelUpdate"),
                _ = t("@marcom/ac-feature/isRetina")(),
                v = t("@marcom/ac-feature/isDesktop")() && !t("@marcom/ac-feature/touchAvailable")(),
                y = t("@marcom/ac-feature/isHandheld")(),
                b = l.browser.safari && l.os.ios,
                g = l.browser.chrome,
                w = t("../ui/DefaultBreakpoints"),
                E = t("@marcom/ac-console/log"),
                x = t("./event/EventsToForward"),
                k = t("./event/ReadyStateChangeEvents"),
                C = t("../utils/BreakpointDetect"),
                T = t("../ui/keyboard-control/createKeyboardControl"),
                O = t("../ui/controls-interaction/createControlsInteraction"),
                S = t("@marcom/ac-accessibility/helpers/hide"),
                P = t("@marcom/ac-accessibility/helpers/show"),
                L = t("../utils/getVersion"),
                A = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        t = t || {}, i.el = t.el || document.createElement("div"), i._elementEmitter = new s(i.el), i.VERSION = L, i.options = t, i._controlsFactory = t.controlsFactory, i._urlOptimizer = t.urlOptimizer;
                        try {
                            var n = window.top;
                            i._maxWidth = t.maxWidth || Math.min(window.innerWidth, 1280) || Math.min(n.innerWidth, 1280)
                        } catch (e) {
                            i._maxWidth = t.maxWidth || Math.min(window.innerWidth, 1280)
                        }
                        return i._lastResize = 0, i._lastMouseCoords = {}, i.el.classList.add("ac-video-player"), i.el.classList.add("idle-state"), i._isLive = t.live, i._isLive && i._useLiveMode(), i._videoImpl = c(t, i.el), i._isResponsive = t.responsive, i._isResponsive && (i._breakpointDetect = new C({
                            el: i.el,
                            player: i,
                            breakpoints: w,
                            addClass: !0
                        })), i._isLive && i._useLiveMode(), i._videoImpl = c(t, i.el), i._supportsInlineVideo = v || !(y && b), i._cachedPiPMode = i.isPictureInPicture(), i._cachedReadyState = i.getReadyState(), i._cachedVisibleTracksLength = 0, i.el.appendChild(i._videoImpl.getRenderElement()), (t.poster || void 0 === t.poster) && i._initPoster(t.poster), i._bindMethods(), i._addEventListeners(), v && (i._keyboardControl = T({
                            player: i,
                            threesixty: t.threesixty,
                            keyboardTarget: t.keyboardTarget
                        })), t.controls && i._initUIComponents(), i._initErrorView(), t.parentElement && t.parentElement.appendChild(i.el), i._chapterEmitter = new a(t), i.refreshSize = i.refreshSize.bind(i), i._refreshSizeTimeout = setTimeout(i.refreshSize, 0), window.addEventListener("DOMContentLoaded", i.refreshSize), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), r(e, [{
                        key: "_bindMethods",
                        value: function () {
                            this._onStart = this._onStart.bind(this), this._onEnded = this._onEnded.bind(this), this._onTimeUpdate = this._onTimeUpdate.bind(this), this._onCaptionsChanged = this._onCaptionsChanged.bind(this), this._onPlay = this._onPlay.bind(this), this._onFullscreenChange = this._onFullscreenChange.bind(this), this._onError = this._onError.bind(this), this._forwardEvent = this._forwardEvent.bind(this), this._onPresentationModeChanged = this._onPresentationModeChanged.bind(this), this._forwardFullScreenChangeEvent = this._forwardNamedEvent.bind(this, "fullscreen:change"), this._forwardEnterFullScreenEvent = this._forwardNamedEvent.bind(this, "enterfullscreen"), this._forwardExitFullScreenEvent = this._forwardNamedEvent.bind(this, "exitfullscreen"), this._onDurationChange = this._onDurationChange.bind(this), this._forwardReadyStateChange = this._forwardReadyStateChange.bind(this), this._showControls = this._showControls.bind(this), this._hideControls = this._hideControls.bind(this), this._raiseControls = this._raiseControls.bind(this), this._lowerControls = this._lowerControls.bind(this), this._onPlayPromiseError = this._onPlayPromiseError.bind(this), this._onPlayPromiseResolved = this._onPlayPromiseResolved.bind(this), this._onChapterChange = this._onChapterChange.bind(this), this.refreshSize = this.refreshSize.bind(this)
                        }
                    }, {
                        key: "_addEventListeners",
                        value: function () {
                            for (var t = 0, e = x.length; t < e; t++) this._videoImpl.on(x[t], this._forwardEvent);
                            for (t = 0, e = k.length; t < e; t++) this._videoImpl.on(k[t], this._forwardReadyStateChange);
                            this._videoImpl.on("timeupdate", this._onTimeUpdate), this._videoImpl.on("webkitpresentationmodechanged", this._onPresentationModeChanged), this._videoImpl.on("durationchange", this._onDurationChange), this._videoImpl.on("addtrack", this._forwardEvent), this._videoImpl.on("change", this._forwardEvent), this._videoImpl.on("change", this._onCaptionsChanged), this._videoImpl.on("removetrack", this._forwardEvent), this._videoImpl.on("loadedmetadata", this.refreshSize), this._videoImpl.on("loadeddata", this.refreshSize), v ? (u.on("enterfullscreen", this._forwardEnterFullScreenEvent), u.on("exitfullscreen", this._forwardExitFullScreenEvent), u.on("enterfullscreen", this._forwardFullScreenChangeEvent), u.on("exitfullscreen", this._forwardFullScreenChangeEvent), this.on("fullscreen:change", this._onFullscreenChange)) : b && (this._videoImpl.on("webkitbeginfullscreen", this._forwardEnterFullScreenEvent), this._videoImpl.on("webkitendfullscreen", this._forwardExitFullScreenEvent), this._videoImpl.on("webkitbeginfullscreen", this._forwardFullScreenChangeEvent), this._videoImpl.on("webkitendfullscreen", this._forwardFullScreenChangeEvent), y && this.on("fullscreen:change", this._onFullscreenChange)), this._chapterEmitter && this._chapterEmitter.on("change", this._onChapterChange), this._videoImpl.on("PlayPromiseError", this._onPlayPromiseError), this._videoImpl.on("PlayPromiseResolved", this._onPlayPromiseResolved), this._videoImpl.on("error", this._onError)
                        }
                    }, {
                        key: "_onPlayPromiseResolved",
                        value: function () {
                            this.trigger("PlayPromiseResolved")
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            for (var t = 0, e = x.length; t < e; t++) this._videoImpl.off(x[t], this._forwardEvent);
                            for (t = 0, e = k.length; t < e; t++) this._videoImpl.off(k[t], this._forwardReadyStateChange);
                            this._videoImpl.off("timeupdate", this._onTimeUpdate), this._videoImpl.off("webkitpresentationmodechanged", this._onPresentationModeChanged), this._videoImpl.off("durationchange", this._onDurationChange), v ? (u.off("enterfullscreen", this._forwardEnterFullScreenEvent), u.off("exitfullscreen", this._forwardExitFullScreenEvent), u.off("enterfullscreen", this._forwardFullScreenChangeEvent), u.off("exitfullscreen", this._forwardFullScreenChangeEvent)) : l.os.ios && (this._videoImpl.off("webkitbeginfullscreen", this._forwardEnterFullScreenEvent), this._videoImpl.off("webkitendfullscreen", this._forwardExitFullScreenEvent), this._videoImpl.off("webkitbeginfullscreen", this._forwardFullScreenChangeEvent), this._videoImpl.off("webkitendfullscreen", this._forwardFullScreenChangeEvent)), this._chapterEmitter && this._chapterEmitter.off("change", this._onChapterChange), this._videoImpl.off("PlayPromiseError", this._onPlayPromiseError), this._videoImpl.off("loadedmetadata", this.refreshSize), this._videoImpl.off("loadeddata", this.refreshSize), window.removeEventListener("DOMContentLoaded", this.refreshSize)
                        }
                    }, {
                        key: "_forwardReadyStateChange",
                        value: function () {
                            var t = this.getReadyState();
                            (t > this._cachedReadyState || 0 === t) && (this._cachedReadyState = t, this.trigger("readystatechange", {
                                readyState: t
                            }))
                        }
                    }, {
                        key: "_forwardEvent",
                        value: function (t) {
                            E(t.type + " time:" + this.getCurrentTime()), this.trigger(t.type)
                        }
                    }, {
                        key: "_forwardNamedEvent",
                        value: function (t) {
                            E(t + " time:" + this.getCurrentTime()), this.trigger(t)
                        }
                    }, {
                        key: "_onPlayPromiseError",
                        value: function () {
                            E("play() Promise rejected, probably because the browser is blocking autoplay"), this.el.classList.add("initial-play"), this._showStartState(), this.once("play", this._onPlay)
                        }
                    }, {
                        key: "_onCaptionsChanged",
                        value: function (t) {
                            var e = this.getVisibleTextTracks().length;
                            e > 0 && 0 === this._cachedVisibleTracksLength ? this.trigger("texttrackshow") : 0 === e && this._cachedVisibleTracksLength > 0 && this.trigger("texttrackhide"), this._cachedVisibleTracksLength = e
                        }
                    }, {
                        key: "_onTimeUpdate",
                        value: function () {
                            this.trigger("timeupdate", {
                                currentTime: this.getCurrentTime()
                            })
                        }
                    }, {
                        key: "load",
                        value: function (t, e, i, n) {
                            if (this._setError(!1), this.refreshSize(), Array.isArray(t) || (t = [t]), e && !Array.isArray(e) && (e = [{
                                    src: e
                                }]), this._cachedReadyState = 0, n || (n = this.options), this._urlOptimizer) {
                                e || (e = t.map(this._urlOptimizer.getCaptionsSource).filter(function (t) {
                                    return !!t
                                }));
                                var r = this.getVisibleTextTracks();
                                r && r.length && e && e.length && (e[0].mode = "showing");
                                var o = n.maxWidth || this._calcMaxWidth();
                                t = t.map(function (t) {
                                    return this._urlOptimizer.getVideoSource(t, o, null, {
                                        maxWidth: this._maxWidth
                                    })
                                }.bind(this))
                            }
                            var s = n && n.thumbnails || this._urlOptimizer && this._urlOptimizer.getThumbnailImageSource(t[0]);
                            this.once("play", this._onPlay), (this.options.autoplay && v || this.getEnded()) && this.once("loadstart", function () {
                                this.play()
                            }.bind(this)), n || (n = this.options), n && this._poster && this.setPoster(n.poster), this._poster && this._poster.show(), this.controls && this.controls.sharingModule && (n.sharing ? this.controls.sharingModule.setData(n.sharing) : this.controls.sharingModule.setData(null)), void 0 !== n.live && (this._isLive = n.live, this._useLiveMode()), this._hideEndState(), this._videoImpl.load(t, e, i), this.controls && this.controls.overlays ? this.controls.overlays.setData(s) : this.controls && this.once("controlsready", function () {
                                this.controls.overlays && this.controls.overlays.setData(s)
                            }.bind(this)), this.controls && this.controls.endState ? this.controls.endState.setData(n.endState) : this.controls && this.once("controlsready", function () {
                                this.controls.endState && this.controls.endState.setData(n.endState)
                            }.bind(this))
                        }
                    }, {
                        key: "_calcMaxWidth",
                        value: function () {
                            return this.el.parentElement ? this.el.parentElement.clientWidth : this._maxWidth
                        }
                    }, {
                        key: "_isActiveArea",
                        value: function (t) {
                            for (; t !== this.el;) {
                                if (t.hasAttribute("data-acv-active-area")) return !0;
                                t = t.parentNode
                            }
                            return !1
                        }
                    }, {
                        key: "_onPresentationModeChanged",
                        value: function (t) {
                            this._forwardEvent(t);
                            var e = this.isPictureInPicture();
                            this._cachedPiPMode !== e && (this._cachedPiPMode = e, E("pictureinpicture:change to " + e), this.trigger("pictureinpicture:change"))
                        }
                    }, {
                        key: "_onDurationChange",
                        value: function (t) {
                            this.getDuration() > 3600 && this.el.classList.add("longform"), this.refreshSize()
                        }
                    }, {
                        key: "appendTo",
                        value: function (t) {
                            t.appendChild(this.el), this.refreshSize()
                        }
                    }, {
                        key: "getTextTracks",
                        value: function () {
                            return Array.prototype.slice.call(this._videoImpl.getTextTracks())
                        }
                    }, {
                        key: "getVisibleTextTracks",
                        value: function () {
                            var t = Array.prototype.slice.call(this._videoImpl.getTextTracks());
                            return t && t.length && (t = t.filter(function (t) {
                                return "showing" === t.mode
                            })), t
                        }
                    }, {
                        key: "getFullScreenElement",
                        value: function () {
                            return v ? this.el : this.getMediaElement()
                        }
                    }, {
                        key: "getFullScreenEnabled",
                        value: function () {
                            return u.fullscreenEnabled(this.getFullScreenElement())
                        }
                    }, {
                        key: "isFullscreen",
                        value: function () {
                            return v ? u.fullscreenElement() === this.getFullScreenElement() : this._videoImpl.isFullscreen()
                        }
                    }, {
                        key: "requestFullscreen",
                        value: function () {
                            if (!this.isFullscreen()) {
                                this.controls && (this.controls.el.display = "none", this._hideControls()), this.trigger("fullscreen:willenter", {
                                    type: "enter"
                                }), this._lastResize = Date.now(), m(this._updateFullscreenId);
                                var t = this;
                                this._updateFullscreenId = f(function e() {
                                    t.refreshSize(), t._updateFullscreenId = f(e)
                                }), g ? setTimeout(function () {
                                    this._lastResize = Date.now(), u.requestFullscreen(this.getFullScreenElement())
                                }.bind(this), 300) : u.requestFullscreen(this.getFullScreenElement())
                            }
                        }
                    }, {
                        key: "exitFullscreen",
                        value: function () {
                            this.isFullscreen() && (this.controls && (this.controls.el.display = "none", this._hideControls()), this.trigger("fullscreen:willexit", {
                                type: "exit"
                            }), g ? setTimeout(function () {
                                u.exitFullscreen(this.getFullScreenElement())
                            }.bind(this), 300) : u.exitFullscreen(this.getFullScreenElement()))
                        }
                    }, {
                        key: "_onFullscreenChange",
                        value: function () {
                            this._lastResize = Date.now(), this.controls && (this.controls.el.display = "", this._hideControls()), this._preventUserInteraction = !0, setTimeout(function () {
                                m(this._updateFullscreenId), this._preventUserInteraction = !1, this.refreshSize()
                            }.bind(this), 750), this.refreshSize()
                        }
                    }, {
                        key: "toggleFullscreen",
                        value: function () {
                            this.isFullscreen() ? this.exitFullscreen() : this.requestFullscreen()
                        }
                    }, {
                        key: "_initUIComponents",
                        value: function () {
                            this._controlsFactory ? (this._instantiateDefaultCustomUIControls(), v ? this.el.appendChild(this._blockade.el) : (this.controls.el.classList.add("mobile"), this.setControls(!0))) : this.setControls(!0)
                        }
                    }, {
                        key: "_showControls",
                        value: function () {
                            this._controlsVisible = !0, this.el.classList.remove("initial-play"), this.el.classList.add("user-hover")
                        }
                    }, {
                        key: "_hideControls",
                        value: function () {
                            this._controlsVisible = !1, this.el.classList.remove("user-hover"), this.hideCaptionsSelector()
                        }
                    }, {
                        key: "_raiseControls",
                        value: function () {
                            this._controlsVisible = !0, this.el.classList.remove("mouse-leave")
                        }
                    }, {
                        key: "_lowerControls",
                        value: function () {
                            this._controlsVisible = !1, this.el.classList.add("mouse-leave"), this.hideCaptionsSelector()
                        }
                    }, {
                        key: "_onControlsReady",
                        value: function () {
                            this.options.autoplay && v || this._showStartState()
                        }
                    }, {
                        key: "_showStartState",
                        value: function () {
                            this.controls && this.controls.el.classList.add("start-state"), this._poster && this._poster.show(), v || S(this.getMediaElement())
                        }
                    }, {
                        key: "_hideStartState",
                        value: function () {
                            this.controls && this.controls.el.classList.remove("start-state"), this._poster && this._poster.hide(), v || P(this.getMediaElement())
                        }
                    }, {
                        key: "_showEndState",
                        value: function () {
                            this.controls && (this.controls.mainControlsElement ? this.controls.mainControlsElement.contains(document.activeElement) && setTimeout(function () {
                                this.controls.playButtonElement.focus()
                            }.bind(this)) : this.el.contains(document.activeElement) && !this.controls.sharingModule.el.contains(document.activeElement) && setTimeout(function () {
                                this.controls.playButtonElement.focus()
                            }.bind(this)), this.controls.el.classList.add("end-state")), this._poster && this._poster.show(), S(this.getMediaElement())
                        }
                    }, {
                        key: "_hideEndState",
                        value: function () {
                            this.controls && this.controls.el.classList.remove("end-state"), v || P(this.getMediaElement())
                        }
                    }, {
                        key: "_createBlockade",
                        value: function () {
                            this._blockade = new s(document.createElement("div")), this._blockade.el.classList.add("ac-video-blockade")
                        }
                    }, {
                        key: "_instantiateDefaultCustomUIControls",
                        value: function () {
                            return this.controls = this._controlsFactory.create({
                                player: this,
                                endState: this.options.endState,
                                enableMainControls: v,
                                basePath: this.options.localizationBasePath,
                                template: this.options.template,
                                readyCallback: function () {
                                    this._onControlsReady(), this.trigger("controlsready")
                                }.bind(this)
                            }), this.controls.el.parentNode !== this.el && this.el.appendChild(this.controls.el), this._videoImpl.setControls(!1), this._createBlockade(), this._controlsInteraction = O({
                                player: this,
                                keyboardControl: this._keyboardControl,
                                controlsTimeoutDuration: this.options.controlsTimeoutDuration,
                                showControls: this._showControls,
                                hideControls: this._hideControls,
                                raiseControls: this._raiseControls,
                                lowerControls: this._lowerControls,
                                controlsVisible: function () {
                                    return this._controlsVisible
                                }.bind(this),
                                sendMouseDown: this._videoImpl.sendMouseDown,
                                elementEmitter: this._elementEmitter
                            }), this.controls
                        }
                    }, {
                        key: "_onPlay",
                        value: function () {
                            this.el.classList.remove("idle-state"), this.once("timeupdate", this._onStart, function () {
                                return this.getCurrentTime() > 0 && !this.getPaused()
                            }.bind(this))
                        }
                    }, {
                        key: "isCaptionsSelectorShowing",
                        value: function () {
                            return this.controls.el.classList.contains("captions-selector-showing")
                        }
                    }, {
                        key: "showCaptionsSelector",
                        value: function () {
                            this.controls.el.classList.add("captions-selector-showing")
                        }
                    }, {
                        key: "hideCaptionsSelector",
                        value: function () {
                            this.controls.el.classList.remove("captions-selector-showing")
                        }
                    }, {
                        key: "_onStart",
                        value: function () {
                            this.el.classList.add("initial-play"), this._poster && this._poster.hide(), this.controls && (this._hideStartState(), this._hideEndState()), this.once("ended", this._onEnded)
                        }
                    }, {
                        key: "_onEnded",
                        value: function () {
                            this.isFullscreen() && this.exitFullscreen(), this.controls && (this._hideStartState(), this._showEndState()), setTimeout(function () {
                                this.once("timeupdate", function () {
                                    this.getEnded() ? this._onEnded() : this._onStart()
                                }.bind(this))
                            }.bind(this), 300), this._poster && this._poster.show()
                        }
                    }, {
                        key: "_initPoster",
                        value: function (t) {
                            this._poster = h({
                                player: this,
                                video: this._videoImpl,
                                useNativePoster: !1 === this.options.controls,
                                is2x: _,
                                src: t
                            }), this._poster.el && this.el.appendChild(this._poster.el), this.options.autoplay || this._poster.show()
                        }
                    }, {
                        key: "_initErrorView",
                        value: function () {
                            this._errorView = new p, this.el.appendChild(this._errorView.el)
                        }
                    }, {
                        key: "_useLiveMode",
                        value: function () {
                            this._isLive ? this.el.classList.add("ac-video-live") : this.el.classList.remove("ac-video-live")
                        }
                    }, {
                        key: "once",
                        value: function (t, i, r) {
                            if (arguments.length < 3 || "object" === (void 0 === r ? "undefined" : n(r)))(function t(e, i, n) {
                                null === e && (e = Function.prototype);
                                var r = Object.getOwnPropertyDescriptor(e, i);
                                if (void 0 === r) {
                                    var o = Object.getPrototypeOf(e);
                                    return null === o ? void 0 : t(o, i, n)
                                }
                                if ("value" in r) return r.value;
                                var s = r.get;
                                return void 0 !== s ? s.call(n) : void 0
                            })(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "once", this).apply(this, arguments);
                            else {
                                var o = arguments,
                                    s = Array.prototype.slice.call(arguments, 2),
                                    a = function () {
                                        s.every(function (t) {
                                            return !!t()
                                        }) && (o[1].apply(this, o), this.off(o[0], a))
                                    }.bind(this);
                                this.on(o[0], a)
                            }
                        }
                    }, {
                        key: "getMediaElement",
                        value: function () {
                            return this._videoImpl.getMediaElement()
                        }
                    }, {
                        key: "play",
                        value: function () {
                            var t = this;
                            this.el.classList.remove("idle-state");
                            var e = this._videoImpl.getCurrentTime();
                            E("play called"), !this._videoImpl.getError() || 0 !== e && !isNaN(e) ? this._videoImpl.play() : setTimeout(function () {
                                t._errorView.focus()
                            }, 1e3)
                        }
                    }, {
                        key: "pause",
                        value: function () {
                            this._videoImpl.pause()
                        }
                    }, {
                        key: "seek",
                        value: function (t) {
                            this.setCurrentTime.apply(this, arguments)
                        }
                    }, {
                        key: "addTextTrack",
                        value: function (t) {
                            this._videoImpl.addTextTrack(t)
                        }
                    }, {
                        key: "getReadyState",
                        value: function () {
                            return this._videoImpl.getMediaElement().readyState
                        }
                    }, {
                        key: "getPreload",
                        value: function () {
                            return this._videoImpl.getPreload()
                        }
                    }, {
                        key: "setPoster",
                        value: function (t) {
                            this._poster.setSrc(t)
                        }
                    }, {
                        key: "getPoster",
                        value: function () {
                            this._poster.getSrc()
                        }
                    }, {
                        key: "getVolume",
                        value: function () {
                            return this._videoImpl.getVolume()
                        }
                    }, {
                        key: "getMuted",
                        value: function () {
                            return this._videoImpl.getMuted()
                        }
                    }, {
                        key: "getCurrentTime",
                        value: function () {
                            return this._videoImpl.getCurrentTime()
                        }
                    }, {
                        key: "getDuration",
                        value: function () {
                            return this._videoImpl.getDuration()
                        }
                    }, {
                        key: "getPaused",
                        value: function () {
                            return this._videoImpl.getPaused()
                        }
                    }, {
                        key: "getEnded",
                        value: function () {
                            return this._videoImpl.getEnded()
                        }
                    }, {
                        key: "setCurrentTime",
                        value: function (t) {
                            return this._videoImpl.setCurrentTime(t)
                        }
                    }, {
                        key: "setVolume",
                        value: function (t) {
                            return this.trigger("uservolumechange"), this._videoImpl.setVolume(t)
                        }
                    }, {
                        key: "setMuted",
                        value: function (t) {
                            this.trigger("uservolumechange"), this._videoImpl.setMuted(t)
                        }
                    }, {
                        key: "setSrc",
                        value: function (t) {
                            this._videoImpl.setSrc(t)
                        }
                    }, {
                        key: "getCurrentSrc",
                        value: function () {
                            return this._videoImpl.getCurrentSrc()
                        }
                    }, {
                        key: "setControls",
                        value: function (t) {
                            return this._videoImpl.setControls(t)
                        }
                    }, {
                        key: "getMediaHeight",
                        value: function () {
                            return this._videoImpl.getMediaElement().videoHeight
                        }
                    }, {
                        key: "getMediaWidth",
                        value: function () {
                            return this._videoImpl.getMediaElement().videoWidth
                        }
                    }, {
                        key: "supportsPictureInPicture",
                        value: function () {
                            return this._videoImpl.supportsPictureInPicture()
                        }
                    }, {
                        key: "isPictureInPicture",
                        value: function () {
                            return this._videoImpl.isPictureInPicture()
                        }
                    }, {
                        key: "setPictureInPicture",
                        value: function (t) {
                            return this._videoImpl.setPictureInPicture(t)
                        }
                    }, {
                        key: "supportsAirPlay",
                        value: function () {
                            return this._videoImpl.supportsAirPlay()
                        }
                    }, {
                        key: "isLive",
                        value: function () {
                            return this._isLive
                        }
                    }, {
                        key: "refreshSize",
                        value: function () {
                            this._breakpointDetect ? this._breakpointDetect.refresh() : (this._currentBreakpoint && this.el.classList.remove(this._currentBreakpoint.name), this._currentBreakpoint = C.getBreakpointFromElement(this.el, w), this.el.classList.add(this._currentBreakpoint.name)), this._videoImpl.refreshSize()
                        }
                    }, {
                        key: "_setError",
                        value: function (t) {
                            t ? this.el.classList.add("media-error") : this.el.classList.remove("media-error")
                        }
                    }, {
                        key: "_onError",
                        value: function (t) {
                            if (0 === this.getCurrentTime()) {
                                if (this._setError(!0), this.controls) {
                                    var e = void 0;
                                    if (t.message) e = t.message;
                                    else {
                                        if (!d.translationReady()) return void d.getTranslation({
                                            callback: this._onError.bind(this, t)
                                        });
                                        e = d.getTranslation().error
                                    }
                                    this._poster.show(), this._errorView.setText(e)
                                }
                            } else E("ERROR: an error occured during playback, but we'll try to recover. Error code " + this.getMediaElement().error.message)
                        }
                    }, {
                        key: "_onChapterChange",
                        value: function (t) {
                            this.trigger("chapter:change")
                        }
                    }, {
                        key: "getChapters",
                        value: function () {
                            return this._chapterEmitter.chapters
                        }
                    }, {
                        key: "setChapters",
                        value: function (t) {
                            this._chapterEmitter.chapters = t
                        }
                    }, {
                        key: "getChapterForTime",
                        value: function (t) {
                            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                            return this._chapterEmitter.getChapterForTime(t, e)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._removeEventListeners(), this.controls && (this.controls.destroy(), this.controls = null), this._poster && (this._poster.destroy(), this._poster = null), this._controlsInteraction && (this._controlsInteraction.destroy(), this._controlsInteraction = null), this._keyboardControl && this._keyboardControl.destroy(), this.el.innerHTML = "", this._breakpointDetect && this._breakpointDetect.destroy(), this._chapterEmitter && this._chapterEmitter.destroy(), this._blockade && (this._blockade = null), this._videoImpl.destroy(), this._videoImpl = null, clearTimeout(this._refreshSizeTimeout), o.prototype.destroy.call(this)
                        }
                    }]), e
                }();
            A.LOADEDMETADATA = 1, A.LOADEDDATA = 2, A.CANPLAY = 3, A.CANPLAYTHROUGH = 4, e.exports = A
        }, {
            "../chapters/ChapterEmitter": 199,
            "../dom-emitter/DOMEmitterMicro": 200,
            "../event-emitter-shim/EventEmitterShim": 201,
            "../posterframe/PosterFrameFactory": 210,
            "../ui/DefaultBreakpoints": 219,
            "../ui/controls-interaction/createControlsInteraction": 239,
            "../ui/error/ErrorView": 250,
            "../ui/keyboard-control/createKeyboardControl": 256,
            "../ui/localization/Localization": 258,
            "../utils/BreakpointDetect": 271,
            "../utils/getVersion": 273,
            "../video/VideoFactory": 283,
            "./event/EventsToForward": 205,
            "./event/ReadyStateChangeEvents": 206,
            "@marcom/ac-accessibility/helpers/hide": 25,
            "@marcom/ac-accessibility/helpers/show": 28,
            "@marcom/ac-console/log": 50,
            "@marcom/ac-feature/isDesktop": 93,
            "@marcom/ac-feature/isHandheld": 94,
            "@marcom/ac-feature/isRetina": 95,
            "@marcom/ac-feature/touchAvailable": 97,
            "@marcom/ac-fullscreen": 99,
            "@marcom/ac-raf-emitter/cancelUpdate": 151,
            "@marcom/ac-raf-emitter/update": 153,
            "@marcom/useragent-detect": 306
        }],
        204: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = t("./Player"),
                s = t("../ui/controls-interaction/createControlsInteraction"),
                a = t("@marcom/useragent-detect").os,
                c = a.ios || a.android || !t("@marcom/ac-feature/isDesktop")(),
                l = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return t.threesixty && i.el.classList.add("threesixty-video"), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "_bindMethods",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_bindMethods", this).call(this), this._showCompass = this._showCompass.bind(this), this._hideCompass = this._hideCompass.bind(this), this.panToOrigin = this.panToOrigin.bind(this)
                        }
                    }, {
                        key: "_addEventListeners",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_addEventListeners", this).call(this)
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_removeEventListeners", this).call(this), this.controls.compass.removeEventListener("click", this.panToOrigin)
                        }
                    }, {
                        key: "_showCompass",
                        value: function () {
                            this.el.classList.add("threesixty-ui")
                        }
                    }, {
                        key: "_hideCompass",
                        value: function () {
                            this.el.classList.remove("threesixty-ui")
                        }
                    }, {
                        key: "_instantiateDefaultCustomUIControls",
                        value: function () {
                            return this.controls = this._controlsFactory.create({
                                player: this,
                                endState: this.options.endState,
                                threesixty: !0,
                                enableMainControls: !0,
                                basePath: this.options.localizationBasePath,
                                template: this.options.template,
                                readyCallback: function () {
                                    this.options.autoplay && !c || this._showStartState(), this.trigger("controlsready")
                                }.bind(this)
                            }), this.controls.el.parentNode !== this.el && this.el.appendChild(this.controls.el), this._videoImpl.setControls(!1), this._createBlockade(), this._controlsInteraction = s({
                                player: this,
                                keyboardControl: this._keyboardControl,
                                threesixty: !0,
                                controlsTimeoutDuration: this.options.controlsTimeoutDuration,
                                threesixtyElementsTimeoutDuration: this.options.threesixtyElementsTimeoutDuration,
                                showControls: this._showControls,
                                hideControls: this._hideControls,
                                raiseControls: this._raiseControls,
                                lowerControls: this._lowerControls,
                                showCompass: this._showCompass,
                                hideCompass: this._hideCompass,
                                controlsVisible: function () {
                                    return this._controlsVisible
                                }.bind(this),
                                sendMouseDown: this._videoImpl.sendMouseDown,
                                elementEmitter: this._elementEmitter
                            }), this.controls
                        }
                    }, {
                        key: "panToOrigin",
                        value: function () {
                            this.get360().panToPosition({
                                lat: 0,
                                lon: 0
                            })
                        }
                    }, {
                        key: "get360",
                        value: function () {
                            return this._videoImpl.get360()
                        }
                    }, {
                        key: "getFullScreenElement",
                        value: function () {
                            return this.el
                        }
                    }, {
                        key: "getFullScreenEnabled",
                        value: function () {
                            return !c && r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "getFullScreenEnabled", this).call(this)
                        }
                    }]), e
                }();
            e.exports = l
        }, {
            "../ui/controls-interaction/createControlsInteraction": 239,
            "./Player": 203,
            "@marcom/ac-feature/isDesktop": 93,
            "@marcom/useragent-detect": 306
        }],
        205: [function (t, e, i) {
            "use strict";
            e.exports = ["loadstart", "progress", "suspend", "abort", "error", "emptied", "stalled", "play", "pause", "loadedmetadata", "loadeddata", "waiting", "playing", "canplay", "canplaythrough", "seeking", "seeked", "ended", "ratechange", "durationchange", "volumechange", "addtrack", "change", "removetrack"]
        }, {}],
        206: [function (t, e, i) {
            "use strict";
            e.exports = ["loadstart", "suspend", "abort", "error", "emptied", "stalled", "loadedmetadata", "loadeddata", "waiting", "canplay", "canplaythrough"]
        }, {}],
        207: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-feature/isDesktop")();
            e.exports = function (e) {
                var i;
                (e ? arguments.length > 1 && (e = Object.assign.apply(null, Array.prototype.slice.apply(arguments))) : e = {}, e.components || (e.components = t("../../ui/DefaultComponents")), void 0 === e.controls && (e.controls = !0), e.controlsImplementation || (e.controlsImplementation = t("../../ui/ControlBar")), e.controlsFactory || (e.controlsFactory = t("../../ui/ControlsFactory")({
                    controlsImplementation: e.controlsImplementation,
                    components: e.components,
                    template: e.controlsTemplate
                })), (void 0 !== e.urlOptimizer && !0 === e.urlOptimizer || "true" === e.urlOptimizer) && (e.urlOptimizer = t("../../optimizeVideoUrl")), e.sources || e.src ? e.sources || (e.sources = e.src ? [e.src] : []) : e.sources = [], e.autoplay = void 0 !== e.autoplay ? e.autoplay : n, e.controlsTimeoutDuration || (e.controlsTimeoutDuration = 3e3), e.threesixty) ? (e.threesixtyElementsTimeoutDuration || (e.threesixtyElementsTimeoutDuration = 3e3), i = new(t("../ThreeSixtyPlayer"))(e)) : i = new(t("../Player"))(e);
                var r = {};
                return e.sharing && (r.sharing = Object.assign({}, e.sharing)), e.thumbnails && (r.thumbnails = Object.assign({}, e.thumbnails)), e.endState && (r.endState = Object.assign({}, e.endState)), e.sources && e.sources.length && i.load(e.sources, e.textTracks, e.startTime, r), i
            }
        }, {
            "../../optimizeVideoUrl": 202,
            "../../ui/ControlBar": 217,
            "../../ui/ControlsFactory": 218,
            "../../ui/DefaultComponents": 220,
            "../Player": 203,
            "../ThreeSixtyPlayer": 204,
            "@marcom/ac-feature/isDesktop": 93
        }],
        208: [function (t, e, i) {
            "use strict";
            e.exports = t("./createPlayer")
        }, {
            "./createPlayer": 207
        }],
        209: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = function () {
                function t(e) {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.options = e, this._defaultSrc = e.src, this._initialize()
                }
                return n(t, [{
                    key: "_initialize",
                    value: function () {
                        var t = this.options.src;
                        this.el = this.options.el || document.createElement("div"), this._imgElement = document.createElement("img"), this._imgElement.src = t, this._currentSrc = t, this._imgElement.alt = "", this._onLoad = this._onLoad.bind(this), this._imgElement.addEventListener("load", this._onLoad), this.el.appendChild(this._imgElement), this.hide(), this.el.classList.add("ac-video-poster")
                    }
                }, {
                    key: "hide",
                    value: function () {
                        this.el.classList.add("ac-video-poster-hide")
                    }
                }, {
                    key: "show",
                    value: function () {
                        this.el.classList.remove("ac-video-poster-hide")
                    }
                }, {
                    key: "setSrc",
                    value: function (t) {
                        var e = t || this._defaultSrc;
                        e !== this._currentSrc && (this._imgElement.style.display = "none", this._imgElement.src = e, this._currentSrc = e)
                    }
                }, {
                    key: "_onLoad",
                    value: function () {
                        this._imgElement.style.display = ""
                    }
                }, {
                    key: "getSrc",
                    value: function () {
                        return this._imgElement.src
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this._imgElement.removeEventListener("load", this._onLoad), this._el = null
                    }
                }]), t
            }();
            e.exports = r
        }, {}],
        210: [function (t, e, i) {
            "use strict";
            var n = t("./PosterFrame"),
                r = "/ac/ac-video-posterframe/1.0/images/ac-video-poster_848x480.jpg",
                o = "/ac/ac-video-posterframe/1.0/images/ac-video-poster_848x480_2x.jpg";
            e.exports = function (t) {
                if (t.src = t.src || (t.is2x ? o : r), t.useNativePoster) {
                    t.video.setPoster(t.src);
                    var e = !1,
                        i = void 0;
                    return {
                        show: function () {
                            e = !0, i && (t.video.setPoster(i), i = null)
                        },
                        hide: function () {
                            e = !1
                        },
                        setSrc: function (n) {
                            e ? n ? t.video.setPoster(n) : t.video.setPoster(t.src) : i = n
                        }
                    }
                }
                return new n(t)
            }
        }, {
            "./PosterFrame": 209
        }],
        211: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("@marcom/ac-ajax-xhr"),
                o = t("@marcom/ac-function/throttle"),
                s = t("./parseVTT"),
                a = function () {
                    function t(e, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this._view = e, this._video = i.video, this._refreshTracks = this._refreshTracks.bind(this), this._throttledRefreshCurrentCaption = o(this._refreshCurrentCaption.bind(this, 300)), this._addTrackListeners()
                    }
                    return n(t, [{
                        key: "_addTrackListeners",
                        value: function () {
                            this._video.on("addtrack", this._refreshTracks), this._video.on("removetrack", this._refreshTracks), this._video.on("change", this._refreshTracks)
                        }
                    }, {
                        key: "_addVideoListeners",
                        value: function (t) {
                            if (!t.cues) {
                                this._view.setText("");
                                try {
                                    r.get(t.src, {
                                        complete: function (e) {
                                            t.cues = s(e.responseText), this._addVideoListeners(t), this._refreshCurrentCaption()
                                        }.bind(this),
                                        error: function (t) {}.bind(this)
                                    })
                                } catch (t) {}
                            }
                            this._video.on("loadstart", this._refreshTracks), this._video.on("timeupdate", this._throttledRefreshCurrentCaption)
                        }
                    }, {
                        key: "_removeVideoListeners",
                        value: function () {
                            this._video.off("loadstart", this._refreshTracks), this._video.off("timeupdate", this._throttledRefreshCurrentCaption)
                        }
                    }, {
                        key: "_refreshTracks",
                        value: function () {
                            var t = this._video.getTextTracks();
                            t && t.length && (t = t.filter(function (t) {
                                return "showing" === t.mode
                            })), t.length ? (this._activeTrack = t[0], this._addVideoListeners(this._activeTrack)) : (this._activeTrack = null, this._removeVideoListeners()), this._refreshCurrentCaption()
                        }
                    }, {
                        key: "_getCurrentCaptionText",
                        value: function (t) {
                            var e = this._activeTrack ? this._activeTrack.cues : null;
                            if (!e) return "";
                            if (this._currentCaption && this._currentCaption.startTime >= t && this._currentCaption <= t) return this._currentCaption.text;
                            for (var i = 0, n = e.length, r = void 0; i < n;) {
                                if (e[i].startTime <= t && e[i].endTime >= t) r = e[i];
                                else if (e[i].startTime >= t) break;
                                i++
                            }
                            return this._currentCaption = r, r ? r.text : ""
                        }
                    }, {
                        key: "_refreshCurrentCaption",
                        value: function () {
                            this._view.setText(this._getCurrentCaptionText(this._video.getCurrentTime()))
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._removeVideoListeners()
                        }
                    }]), t
                }();
            e.exports = a
        }, {
            "./parseVTT": 216,
            "@marcom/ac-ajax-xhr": 32,
            "@marcom/ac-function/throttle": 107
        }],
        212: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = t("../ui/factory/createComponents"),
                s = t("./TextTracksBehavior"),
                a = t("../ui/elements/Label"),
                c = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                l = {
                    textTracksPolyfill: {
                        className: "ac-video-player-text-track",
                        view: {
                            classDef: a,
                            options: {}
                        },
                        behavior: {
                            classDef: s
                        }
                    }
                },
                u = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return i.container = t.container, i._video = t.video, i._initialize(t), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, c), n(e, [{
                        key: "_initialize",
                        value: function (t) {
                            this._onTrackChange = this._onTrackChange.bind(this), this.el = document.createElement("div"), this.el.innerHTML = t.template || '<div class="ac-video-player-text-track"></div>', this.el.classList.add("ac-video-player-text-track-container"), this._tracks = t.tracks || [], this._textTrackComponent = o(this.el, l, {
                                video: this._video
                            })
                        }
                    }, {
                        key: "_onTrackChange",
                        value: function () {
                            this.trigger("change"), this.el.parentElement || (this._video.getRenderElement().parentElement.appendChild(this.el), this.el.firstElementChild.classList.add("is-visible"))
                        }
                    }, {
                        key: "addTrack",
                        value: function (t) {
                            this._tracks || (this._tracks = []);
                            var e = t.mode || "hidden",
                                i = this._onTrackChange;
                            Object.defineProperty(t, "mode", {
                                get: function () {
                                    return e
                                },
                                set: function (t) {
                                    e = t, i()
                                },
                                enumerable: !0,
                                configurable: !0
                            }), this._tracks.push(t), this.trigger("addtrack")
                        }
                    }, {
                        key: "clearTracks",
                        value: function () {
                            this._tracks = [], this.trigger("removetrack"), this.trigger("change")
                        }
                    }, {
                        key: "getTextTracks",
                        value: function () {
                            return this._tracks
                        }
                    }, {
                        key: "trigger",
                        value: function (t, i) {
                            return r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "trigger", this).call(this, t, Object.assign({
                                type: t
                            }, i || {}))
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._textTrackComponent.destroy(), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = u
        }, {
            "../ui/elements/Label": 242,
            "../ui/factory/createComponents": 252,
            "./TextTracksBehavior": 211,
            "@marcom/ac-event-emitter-micro": 88
        }],
        213: [function (t, e, i) {
            "use strict";
            var n, r = t("@marcom/useragent-detect");
            n = r.browser.safari ? function (t, e) {
                t.track.mode = e
            } : function (t, e) {
                t.mode = e
            };
            var o = function (t) {
                var e;
                if (t instanceof HTMLElement) this.el.appendChild(t);
                else {
                    var i = document.createElement("track");
                    i.src = t.src, i.kind = "captions", i.srclang = t.srclang, "en" === i.srclang ? i.label = t.label || "English" : i.label = t.label || t.srclang && t.srclang.toUpperCase() || "Unknown CC", r.browser.firefox ? (e = this.el.textTracks.length, setTimeout(function () {
                        this.el.appendChild(i), n(this.el.textTracks[e], t.mode || "hidden")
                    }.bind(this), 0)) : r.os.android ? (e = this.el.textTracks.length, this.el.appendChild(i), n(this.el.textTracks[e], t.mode || "hidden")) : (this.el.appendChild(i), n(i, t.mode || "hidden"))
                }
            };
            e.exports = {
                create: function (t) {
                    for (var e = 0, i = t ? t.length : 0; e < i; e++) {
                        var n = t[e];
                        o.call(this, n)
                    }
                },
                add: o,
                get: function () {
                    return this.el.textTracks
                },
                getEmitter: function () {
                    if (!this._textTracksEmitter) {
                        var e = t("../dom-emitter/DOMEmitterMicro");
                        this._textTracksEmitter = new e(this.getTextTracks())
                    }
                    return this._textTracksEmitter
                },
                destroy: function () {}
            }
        }, {
            "../dom-emitter/DOMEmitterMicro": 200,
            "@marcom/useragent-detect": 306
        }],
        214: [function (t, e, i) {
            "use strict";
            var n = t("./TextTracksDOM");
            e.exports = {
                create: function (t) {
                    if (t)
                        if (this._textTracksPolyfill) {
                            this._textTracksPolyfill.clearTracks();
                            for (var e = 0, i = t.length; e < i; e++) this._textTracksPolyfill.addTrack(t[e])
                        } else this._textTracksPolyfill = new n({
                            video: this,
                            tracks: t,
                            container: this._parentElement
                        })
                },
                add: function (t) {
                    return this._textTracksPolyfill.addTrack(t)
                },
                get: function () {
                    return this._textTracksPolyfill || this._createTextTrackTags([]), this._textTracksPolyfill.getTextTracks()
                },
                getEmitter: function () {
                    return this._textTracksPolyfill || this._createTextTrackTags([]), this._textTracksPolyfill
                },
                destroy: function () {
                    this._textTracksPolyfill.destroy(), this._textTracksPolyfill = null
                }
            }
        }, {
            "./TextTracksDOM": 212
        }],
        215: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/useragent-detect"),
                r = !n.browser.ie && !n.browser.edge;
            e.exports = function (e) {
                var i;
                return i = !!(e = e || {}).hls || !e.threesixty && (void 0 === e.useNativeCaptions ? r : e.useNativeCaptions), t(i ? "./TextTracksNative" : "./TextTracksPolyfill")
            }
        }, {
            "./TextTracksNative": 213,
            "./TextTracksPolyfill": 214,
            "@marcom/useragent-detect": 306
        }],
        216: [function (t, e, i) {
            "use strict";
            var n = t("../utils/Time");
            e.exports = function (t) {
                for (var e, i, r = t.split(/\n/), o = /([\d]{2}:)?[\d]{2}:[\d]{2}.[\d]{3}( --> ){1}([\d]{2}:)?[\d]{2}:[\d]{2}.[\d]{3}/, s = [], a = 0, c = r.length; a < c; a++)
                    if (i = "", o.test(r[a])) {
                        for ((e = r[a].split(" --\x3e "))[0] = e[0].split(":").length < 3 ? "00:" + e[0] : e[0], e[1] = e[1].split(":").length < 3 ? "00:" + e[1] : e[1]; ++a && a < c && !o.test(r[a]);) "" !== r[a] && (i += r[a] + "<br />");
                        i = i.substr(0, i.length - 6), a < c && a--, s.push({
                            startTime: n.stringToNumber(e[0].split(" ")[0]),
                            endTime: n.stringToNumber(e[1].split(" ")[0]),
                            text: i
                        })
                    } return s
            }
        }, {
            "../utils/Time": 272
        }],
        217: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-string/supplant"),
                r = t("../utils/Time"),
                o = t("./localization/Localization"),
                s = t("./factory/createComponents"),
                a = t("@marcom/ac-feature/isDesktop")(),
                c = t("./overlays/OverlayContainer"),
                l = t("./end-state/EndStateItemContainer"),
                u = t("./compass/Compass"),
                h = t("../utils/merge"),
                d = t("./templates/default-controls.html"),
                p = function (t) {
                    this._initialize(t)
                },
                f = p.prototype;
            f._initialize = function (t) {
                this.el = t.element || document.createElement("div"), this._basePath = t.basePath, this.el.style.display = "none", this._template = t.template || d, this._templateData = t.templateData || Object.assign({
                    elementClassPrefix: "controls"
                }), this._destroyed = !1, this._localize().then(function () {
                    this._destroyed || (this._initUIComponents(t), this.el.style.display = ""), "function" == typeof t.readyCallback && t.readyCallback()
                }.bind(this))
            }, f._localize = function () {
                return new Promise(function (t) {
                    o.getTranslation({
                        callback: function (e) {
                            t(e)
                        }.bind(this),
                        basePath: this._basePath
                    })
                }.bind(this)).then(function (t) {
                    this._templateData = Object.assign(this._templateData, t)
                }.bind(this))
            }, f._renderTemplateMarkup = function () {
                var t = n(this._template, this._templateData);
                this.el.innerHTML = t
            }, f._initDesktopControls = function (t, e) {
                this._componentCollection = s(t, h(e, {
                    elementClassPrefix: this._templateData.elementClassPrefix,
                    elapsedTimeIndicator: {
                        behavior: {
                            observe: {
                                source: this._player,
                                events: ["timeupdate", "seeking", "seeked", "durationchange"],
                                update: function (t) {
                                    t.setText(r.formatTime(this._player.getCurrentTime(), this._player.getDuration()))
                                }.bind(this)
                            }
                        }
                    },
                    remainingTimeIndicator: {
                        behavior: {
                            observe: {
                                source: this._player,
                                events: ["timeupdate", "seeking", "seeked", "durationchange"],
                                update: function (t) {
                                    t.setText(r.formatTime(this._player.getCurrentTime() - this._player.getDuration(), this._player.getDuration()))
                                }.bind(this)
                            }
                        }
                    },
                    volumeLevel: {
                        view: {
                            options: {
                                value: this._player.getMuted() ? 0 : 100 * this._player.getVolume()
                            }
                        }
                    },
                    playPauseContainer: {
                        view: {
                            options: {
                                labels: {
                                    playing: this._templateData.pause,
                                    paused: this._templateData.play,
                                    ended: this._templateData.replay
                                }
                            }
                        }
                    },
                    fullScreen: {
                        view: {
                            options: {
                                labels: {
                                    initial: this._templateData.fullscreen,
                                    on: this._templateData.exitfullscreen,
                                    off: this._templateData.fullscreen
                                }
                            }
                        }
                    },
                    pictureInPictureToggle: {
                        view: {
                            options: {
                                labels: {
                                    initial: this._templateData.pictureinpicture,
                                    on: this._templateData.exitpictureinpicture,
                                    off: this._templateData.pictureinpicture
                                }
                            }
                        }
                    }
                }), {
                    player: this._player,
                    localization: this._templateData
                })
            }, f._initUIComponents = function (t) {
                this._player = t.player;
                var e = this.el,
                    i = t.components;
                e.classList.add(t.className || "ac-video-controls"), this._renderTemplateMarkup();
                var n = e.querySelector(".main-controls-container");
                n && (t.enableMainControls ? (n.classList.add("control-bar-skin-default"), this.mainControlsElement = n) : n.parentElement.removeChild(n));
                var r = e.querySelector(".end-state-container");
                r && (this.endState = new l(Object.assign({}, {
                    el: r,
                    player: this._player
                }, t.endState))), t.threesixty && (this.compass = new u({
                    rootElement: e,
                    player: this._player
                })), this._initDesktopControls(e, i);
                var o = this._componentCollection.components.socialShare;
                this.sharingModule = o && o.length ? o[0].behavior.sharingModule : null, this._componentCollection.components.progressBar.length && (this.scrubberView = this._componentCollection.components.progressBar[0].view), this.playButtonElement = this.el.querySelector(".controls-play-pause-button"), a && t.enableMainControls && (this.overlays = new c({
                    el: this.el.querySelector(".ac-video-overlay-container"),
                    player: this._player
                }))
            }, f.destroy = function () {
                this._componentCollection && (this._componentCollection.destroy(), this._componentCollection = null), this.overlays && this.overlays.destroy(), this._destroyed = !0, this._player = null, this._templateData = null
            }, e.exports = p
        }, {
            "../utils/Time": 272,
            "../utils/merge": 274,
            "./compass/Compass": 235,
            "./end-state/EndStateItemContainer": 249,
            "./factory/createComponents": 252,
            "./localization/Localization": 258,
            "./overlays/OverlayContainer": 260,
            "./templates/default-controls.html": 264,
            "@marcom/ac-feature/isDesktop": 93,
            "@marcom/ac-string/supplant": 192
        }],
        218: [function (t, e, i) {
            "use strict";
            var n = {
                components: t("./DefaultComponents"),
                controlsImplementation: t("./ControlBar")
            };
            e.exports = function (t) {
                t = t || {};
                var e = Object.assign({}, n, t);
                return {
                    create: function (i) {
                        var r = Object.assign({}, e, i);
                        return r.components = t.components || n.components, new r.controlsImplementation(r)
                    }
                }
            }
        }, {
            "./ControlBar": 217,
            "./DefaultComponents": 220
        }],
        219: [function (t, e, i) {
            "use strict";
            e.exports = [{
                name: "small",
                minWidth: 0,
                maxWidth: 569
            }, {
                name: "medium",
                minWidth: 570,
                maxWidth: 779
            }, {
                name: "large",
                minWidth: 780,
                maxWidth: 1 / 0
            }]
        }, {}],
        220: [function (t, e, i) {
            "use strict";
            var n = t("./elements/Button"),
                r = t("./elements/StatefulButton"),
                o = t("./elements/ToggleButton"),
                s = t("./elements/Label"),
                a = t("./elements/ListSelector"),
                c = t("./elements/Slider"),
                l = t("./elements/Container"),
                u = t("./behaviors/MuteButtonBehavior"),
                h = t("./behaviors/PlayPauseButtonBehavior"),
                d = t("./behaviors/PictureInPictureButtonBehavior"),
                p = t("./behaviors/CaptionsButtonBehavior"),
                f = t("./behaviors/CaptionsSelectorBehavior"),
                m = t("./behaviors/FullScreenButtonBehavior"),
                _ = t("./behaviors/ProgressBarSliderBehavior"),
                v = t("./behaviors/VolumeSliderBehavior"),
                y = t("./behaviors/SharingButtonBehavior"),
                b = t("./behaviors/SocialContainerBehavior"),
                g = t("./behaviors/AirPlayButtonBehavior"),
                w = t("./elements/mixins/CursorPointer"),
                E = t("./templates/progress-slider.html"),
                x = t("./templates/volume-slider.html");
            e.exports = {
                back30Seconds: {
                    className: "back-30-seconds-button",
                    view: {
                        classDef: n
                    }
                },
                fullScreen: {
                    className: "full-screen-button",
                    view: {
                        classDef: o,
                        options: {
                            states: {
                                initial: "fullscreen-unsupported",
                                on: "is-fullscreen",
                                off: ""
                            },
                            labels: {
                                initial: "fullscreen",
                                on: "exitfullscreen",
                                off: "fullscreen"
                            }
                        }
                    },
                    behavior: {
                        classDef: m
                    }
                },
                toggleMuteVolume: {
                    className: "toggle-mute-volume-button",
                    view: {
                        classDef: o,
                        options: {
                            states: {
                                initial: [],
                                on: ["is-muted"],
                                off: []
                            }
                        }
                    },
                    behavior: {
                        classDef: u
                    }
                },
                playPauseContainer: {
                    className: "play-pause-button-container",
                    view: {
                        classDef: r,
                        options: {
                            states: {
                                playing: ["is-playing"],
                                paused: [],
                                ended: ["is-ended"]
                            }
                        }
                    },
                    behavior: {
                        classDef: h
                    }
                },
                pictureInPictureToggle: {
                    className: "picture-in-picture-button",
                    view: {
                        classDef: o,
                        options: {
                            states: {
                                initial: ["picture-in-picture-unsupported"],
                                on: ["is-picture-in-picture"],
                                off: []
                            },
                            labels: {
                                initial: "pictureinpicture",
                                on: "exitpictureinpicture",
                                off: "pictureinpicture"
                            }
                        }
                    },
                    behavior: {
                        classDef: d
                    }
                },
                captionsToggle: {
                    className: "text-tracks-toggle-button",
                    view: {
                        classDef: o,
                        options: {
                            states: {
                                initial: ["no-text-tracks"],
                                on: ["text-tracks-visible"],
                                off: []
                            }
                        }
                    },
                    behavior: {
                        classDef: p
                    }
                },
                captionsSelector: {
                    className: "captions-selector",
                    view: {
                        classDef: a
                    },
                    behavior: {
                        classDef: f
                    }
                },
                airplayToggle: {
                    className: "airplay-button",
                    view: {
                        classDef: o,
                        options: {
                            states: {
                                initial: ["airplay-unsupported"],
                                on: ["airplay-active"],
                                off: []
                            }
                        }
                    },
                    behavior: {
                        classDef: g
                    }
                },
                elapsedTimeIndicator: {
                    className: "elapsed-time",
                    view: {
                        classDef: s
                    }
                },
                remainingTimeIndicator: {
                    className: "remaining-time",
                    view: {
                        classDef: s
                    }
                },
                progressBar: {
                    className: "progress-indicator",
                    view: {
                        classDef: c,
                        options: {
                            template: E,
                            min: 0,
                            max: 1,
                            mixins: [w],
                            orientation: "horizontal"
                        }
                    },
                    behavior: {
                        classDef: _
                    }
                },
                volumeLevel: {
                    className: "volume-level-indicator",
                    view: {
                        classDef: c,
                        options: {
                            template: x,
                            min: 0,
                            max: 100,
                            mixins: [w],
                            orientation: "vertical"
                        }
                    },
                    behavior: {
                        classDef: v
                    }
                },
                sharing: {
                    className: "sharing-button",
                    view: {
                        classDef: r,
                        options: {
                            states: {
                                initial: ["sharing-unsupported"],
                                on: ["is-sharing"],
                                off: []
                            }
                        }
                    },
                    behavior: {
                        classDef: y
                    }
                },
                socialShare: {
                    className: "social-tray",
                    view: {
                        classDef: l,
                        options: {}
                    },
                    behavior: {
                        classDef: b
                    }
                }
            }
        }, {
            "./behaviors/AirPlayButtonBehavior": 221,
            "./behaviors/CaptionsButtonBehavior": 224,
            "./behaviors/CaptionsSelectorBehavior": 225,
            "./behaviors/FullScreenButtonBehavior": 226,
            "./behaviors/MuteButtonBehavior": 227,
            "./behaviors/PictureInPictureButtonBehavior": 228,
            "./behaviors/PlayPauseButtonBehavior": 229,
            "./behaviors/ProgressBarSliderBehavior": 230,
            "./behaviors/SharingButtonBehavior": 231,
            "./behaviors/SocialContainerBehavior": 232,
            "./behaviors/VolumeSliderBehavior": 233,
            "./elements/Button": 240,
            "./elements/Container": 241,
            "./elements/Label": 242,
            "./elements/ListSelector": 243,
            "./elements/Slider": 244,
            "./elements/StatefulButton": 245,
            "./elements/ToggleButton": 246,
            "./elements/mixins/CursorPointer": 247,
            "./templates/progress-slider.html": 266,
            "./templates/volume-slider.html": 270
        }],
        221: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./ButtonBehavior"),
                o = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._player.supportsAirPlay() && (n._airplayStateChange = n._airplayStateChange.bind(n), n._player.getMediaElement().addEventListener("webkitplaybacktargetavailabilitychanged", n._airplayStateChange), n._updateState = n._updateState.bind(n), n._player.getMediaElement().addEventListener("webkitcurrentplaybacktargetiswirelesschanged", n._updateState)), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_airplayStateChange",
                        value: function (t) {
                            "available" === t.availability ? this._airplayAvailable = !0 : this._airplayAvailable = !1, this._updateState()
                        }
                    }, {
                        key: "_updateState",
                        value: function () {
                            this._player.getMediaElement().webkitCurrentPlaybackTargetIsWireless ? this._view.setState("on") : this._airplayAvailable ? this._view.setState("off") : this._view.setState("initial")
                        }
                    }, {
                        key: "_onClick",
                        value: function () {
                            this._player.getMediaElement().webkitShowPlaybackTargetPicker()
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._player.getMediaElement().removeEventListener("webkitplaybacktargetavailabilitychanged", this._airplayStateChange), this._player.getMediaElement().removeEventListener("webkitcurrentplaybacktargetiswirelesschanged", this._updateState),
                                function t(e, i, n) {
                                    null === e && (e = Function.prototype);
                                    var r = Object.getOwnPropertyDescriptor(e, i);
                                    if (void 0 === r) {
                                        var o = Object.getPrototypeOf(e);
                                        return null === o ? void 0 : t(o, i, n)
                                    }
                                    if ("value" in r) return r.value;
                                    var s = r.get;
                                    return void 0 !== s ? s.call(n) : void 0
                                }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./ButtonBehavior": 223
        }],
        222: [function (t, e, i) {
            "use strict";
            e.exports = function t(e, i) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this._player = i.player, this._view = e, this._addViewListeners && this._addViewListeners(), this._addPlayerListeners && this._addPlayerListeners()
            }
        }, {}],
        223: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./BaseBehavior"),
                o = function (t) {
                    function e(t, i) {
                        return function (t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, e),
                            function (t, e) {
                                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return !e || "object" != typeof e && "function" != typeof e ? t : e
                            }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i))
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_initialize",
                        value: function () {
                            this._onClick = this._onClick.bind(this)
                        }
                    }, {
                        key: "_addViewListeners",
                        value: function () {
                            this._initialize(), this._view.on("click", this._onClick)
                        }
                    }, {
                        key: "_onClick",
                        value: function (t) {}
                    }, {
                        key: "destroy",
                        value: function () {
                            this._view.off("click", this._onClick)
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./BaseBehavior": 222
        }],
        224: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./ButtonBehavior"),
                o = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._updateState(), n._allowMultiLanguageCaptions = !n._player.options.disableMultiLanguageCaptions, n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_updateState",
                        value: function () {
                            var t = this._player.getVisibleTextTracks(),
                                e = this._player.getTextTracks().filter(function (t) {
                                    return "subtitles" === t.kind || "captions" === t.kind || !t.kind
                                });
                            t.length ? this._view.setState("on") : e.length ? this._view.setState("off") : this._view.setState("initial")
                        }
                    }, {
                        key: "_addPlayerListeners",
                        value: function () {
                            this._updateState = this._updateState.bind(this), this._player.on("addtrack", this._updateState), this._player.on("change", this._updateState), this._player.on("removetrack", this._updateState)
                        }
                    }, {
                        key: "_onClick",
                        value: function () {
                            var t = this._player.getVisibleTextTracks(),
                                e = this._player.getTextTracks().filter(function (t) {
                                    return "metadata" !== t.kind
                                });
                            e.length > 1 && this._allowMultiLanguageCaptions ? this._player.isCaptionsSelectorShowing() ? this._player.hideCaptionsSelector() : this._player.showCaptionsSelector() : 1 === t.length ? e[0].mode = "hidden" : e[0].mode = "showing", setTimeout(this._updateState)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._player.off("addtrack", this._updateState), this._player.off("change", this._updateState), this._player.off("removetrack", this._updateState),
                                function t(e, i, n) {
                                    null === e && (e = Function.prototype);
                                    var r = Object.getOwnPropertyDescriptor(e, i);
                                    if (void 0 === r) {
                                        var o = Object.getPrototypeOf(e);
                                        return null === o ? void 0 : t(o, i, n)
                                    }
                                    if ("value" in r) return r.value;
                                    var s = r.get;
                                    return void 0 !== s ? s.call(n) : void 0
                                }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./ButtonBehavior": 223
        }],
        225: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = "__CC_DISABLE",
                o = t("./BaseBehavior"),
                s = t("@marcom/useragent-detect").browser,
                a = s.edge || s.ie || s.firefox,
                c = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._updateState(), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "_addViewListeners",
                        value: function () {
                            this._onSelected = this._onSelected.bind(this), this._view.on("ItemSelected", this._onSelected)
                        }
                    }, {
                        key: "_updateState",
                        value: function () {
                            var t = "showing",
                                e = this._player.getTextTracks().filter(function (t) {
                                    return "subtitles" === t.kind || "captions" === t.kind || !t.kind
                                }).map(function (e) {
                                    "showing" === e.mode && (t = "hidden");
                                    var i = {
                                        label: e.label || e.language || e.srclang && ("en" === e.srclang.toLowerCase() ? "English" : e.srclang) || "Unknown CC",
                                        language: e.language
                                    };
                                    return Object.defineProperty(i, "mode", {
                                        get: function () {
                                            return e.mode
                                        },
                                        set: function (t) {
                                            e.mode = t
                                        }
                                    }), i
                                });
                            this._view.setItems([{
                                label: "Off",
                                language: r,
                                mode: t
                            }].concat(e))
                        }
                    }, {
                        key: "_addPlayerListeners",
                        value: function () {
                            this._updateState = this._updateState.bind(this), this._player.on("addtrack", this._updateState), this._player.on("change", this._updateState), this._player.on("removetrack", this._updateState)
                        }
                    }, {
                        key: "_onSelected",
                        value: function (t) {
                            var e = t.detail;
                            this._player.getVisibleTextTracks().forEach(function (t) {
                                t.mode = "hidden"
                            }), e.language !== r && (e.mode = "showing"), a && this._player.getMediaElement().textTracks.dispatchEvent(new CustomEvent("change")), setTimeout(this._updateState)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._player.off("addtrack", this._updateState), this._player.off("change", this._updateState), this._player.off("removetrack", this._updateState), this._view.off("ItemSelected", this._onSelected)
                        }
                    }]), e
                }();
            e.exports = c
        }, {
            "./BaseBehavior": 222,
            "@marcom/useragent-detect": 306
        }],
        226: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./ButtonBehavior"),
                o = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._player.getFullScreenEnabled() && n._updateState(), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_addPlayerListeners",
                        value: function () {
                            this._updateState = this._updateState.bind(this), this._player.on("fullscreen:change", this._updateState)
                        }
                    }, {
                        key: "_updateState",
                        value: function () {
                            this._view.setState(this._player.isFullscreen() ? "on" : "off")
                        }
                    }, {
                        key: "_onClick",
                        value: function () {
                            this._player.toggleFullscreen(!this._player.isFullscreen())
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._player.off("fullscreen:change", this._updateState),
                                function t(e, i, n) {
                                    null === e && (e = Function.prototype);
                                    var r = Object.getOwnPropertyDescriptor(e, i);
                                    if (void 0 === r) {
                                        var o = Object.getPrototypeOf(e);
                                        return null === o ? void 0 : t(o, i, n)
                                    }
                                    if ("value" in r) return r.value;
                                    var s = r.get;
                                    return void 0 !== s ? s.call(n) : void 0
                                }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./ButtonBehavior": 223
        }],
        227: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./ButtonBehavior"),
                o = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._updateState(), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_updateState",
                        value: function () {
                            this._view.setState(this._player.getMuted() ? "on" : "off")
                        }
                    }, {
                        key: "_addPlayerListeners",
                        value: function () {
                            this._updateState = this._updateState.bind(this), this._player.on("volumechange", this._updateState)
                        }
                    }, {
                        key: "_onClick",
                        value: function () {
                            this._player.getMuted() ? (this._player.setMuted(!1), 0 === this._player.getVolume() && this._player.setVolume(.1)) : this._player.setMuted(!0)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._player.off("volumechange", this._updateState),
                                function t(e, i, n) {
                                    null === e && (e = Function.prototype);
                                    var r = Object.getOwnPropertyDescriptor(e, i);
                                    if (void 0 === r) {
                                        var o = Object.getPrototypeOf(e);
                                        return null === o ? void 0 : t(o, i, n)
                                    }
                                    if ("value" in r) return r.value;
                                    var s = r.get;
                                    return void 0 !== s ? s.call(n) : void 0
                                }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./ButtonBehavior": 223
        }],
        228: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = t("./ButtonBehavior"),
                s = function (t) {
                    function e(t, i) {
                        return function (t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, e),
                            function (t, e) {
                                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return !e || "object" != typeof e && "function" != typeof e ? t : e
                            }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i))
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "_initialize",
                        value: function () {
                            this._updateButtonState = this._updateButtonState.bind(this), this._player.supportsPictureInPicture() && (this._updateButtonState(), this._player.on("webkitpresentationmodechanged", this._updateButtonState)), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_initialize", this).call(this)
                        }
                    }, {
                        key: "_onClick",
                        value: function () {
                            this._player.setPictureInPicture(!this._player.isPictureInPicture())
                        }
                    }, {
                        key: "_updateButtonState",
                        value: function () {
                            this._view.setState(this._player.isPictureInPicture() ? "on" : "off")
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._player.off("webkitpresentationmodechanged", this._updateButtonState), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = s
        }, {
            "./ButtonBehavior": 223
        }],
        229: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./ButtonBehavior"),
                o = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._setPlayingState(), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_addPlayerListeners",
                        value: function () {
                            this._setPlayingState = this._setPlayingState.bind(this), this._player.on("play", this._setPlayingState), this._player.on("playing", this._setPlayingState), this._player.on("pause", this._setPlayingState), this._player.on("ended", this._setPlayingState)
                        }
                    }, {
                        key: "_onClick",
                        value: function () {
                            this._togglePlay()
                        }
                    }, {
                        key: "_setPlayingState",
                        value: function () {
                            this._player.getEnded() ? this._view.setState("ended") : this._view.setState(this._player.getPaused() ? "paused" : "playing")
                        }
                    }, {
                        key: "_togglePlay",
                        value: function () {
                            this._player.getPaused() || this._player.getEnded() ? this._player.play() : this._player.pause()
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._player.off("play", this._setPlayingState), this._player.off("pause", this._setPlayingState), this._player.off("playing", this._setPlayingState), this._player.off("ended", this._setPlayingState),
                                function t(e, i, n) {
                                    null === e && (e = Function.prototype);
                                    var r = Object.getOwnPropertyDescriptor(e, i);
                                    if (void 0 === r) {
                                        var o = Object.getPrototypeOf(e);
                                        return null === o ? void 0 : t(o, i, n)
                                    }
                                    if ("value" in r) return r.value;
                                    var s = r.get;
                                    return void 0 !== s ? s.call(n) : void 0
                                }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./ButtonBehavior": 223
        }],
        230: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./BaseBehavior"),
                o = t("@marcom/ac-string/supplant"),
                s = t("@marcom/ac-raf-emitter/draw"),
                a = t("@marcom/ac-raf-emitter/cancelDraw"),
                c = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._visible = !1, n._ariaTextTemplate = i.localization.currenttimetext, n._onDurationChange(), n._refreshChapters(), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_addViewListeners",
                        value: function () {
                            this._onSliderGrab = this._onSliderGrab.bind(this), this._onSliderChange = this._onSliderChange.bind(this), this._onSliderRelease = this._onSliderRelease.bind(this), this._onChapterClicked = this._onChapterClicked.bind(this), this._onChapterFocusIn = this._onChapterFocusIn.bind(this), this._onChapterFocusOut = this._onChapterFocusOut.bind(this), this._view.on("grab", this._onSliderGrab), this._view.on("chapter:click", this._onChapterClicked), this._view.on("chapter:focusin", this._onChapterFocusIn), this._view.on("chapter:focusout", this._onChapterFocusOut)
                        }
                    }, {
                        key: "_addPlayerListeners",
                        value: function () {
                            this._onTimeUpdate = this._onTimeUpdate.bind(this), this._onPlay = this._onPlay.bind(this), this._onPause = this._onPause.bind(this), this._onEnded = this._onEnded.bind(this), this._onDurationChange = this._onDurationChange.bind(this), this._refreshChapters = this._refreshChapters.bind(this), this._onRAF = this._onRAF.bind(this), this._player.on("durationchange", this._onDurationChange), this._player.on("loadstart", this._onEnded), this._player.on("ended", this._onEnded), this._player.on("timeupdate", this._onTimeUpdate), this._player.on("play", this._onPlay), this._player.on("pause", this._onPause), this._player.on("ended", this._onEnded), this._player.on("chapters:change", this._refreshChapters)
                        }
                    }, {
                        key: "_setIsPlaying",
                        value: function (t) {
                            t ? this._view.setState("is-playing") : this._view.clearState("is-playing")
                        }
                    }, {
                        key: "_onPlay",
                        value: function () {
                            this._setIsPlaying(!0), this._player.isLive() || (a(this._timeUpdateInterval), this._raf = s(this._onRAF))
                        }
                    }, {
                        key: "_onRAF",
                        value: function () {
                            this._onTimeUpdate(), this._timeUpdateInterval = s(this._onRAF)
                        }
                    }, {
                        key: "_onPause",
                        value: function () {
                            this._setIsPlaying(!1), a(this._raf), a(this._timeUpdateInterval), this._onTimeUpdate()
                        }
                    }, {
                        key: "_onEnded",
                        value: function () {
                            this._onPause(), this._updateSliderPosition(0)
                        }
                    }, {
                        key: "_onChapterClicked",
                        value: function (t) {
                            this._player.setCurrentTime(t["start-time"])
                        }
                    }, {
                        key: "_onChapterFocusIn",
                        value: function (t) {
                            this._chapterFocused = !0, this._player.controls.overlays.setPopUpPosition(t["start-time"])
                        }
                    }, {
                        key: "_onChapterFocusOut",
                        value: function (t) {
                            this._chapterFocused = !1
                        }
                    }, {
                        key: "_refreshChapters",
                        value: function () {
                            var t = this._player.getDuration();
                            t && !isNaN(t) && t !== Math.Infinity ? this._view.setChapters(this._player.getChapters().map(function (e) {
                                var i = e["start-time"] / t * 100;
                                return Object.assign({}, e, {
                                    startTimeInPercentage: i + "%",
                                    startTime: i
                                })
                            })) : this._view.setChapters([])
                        }
                    }, {
                        key: "_onSliderGrab",
                        value: function () {
                            this._chapterFocused || (this._player.off("timeupdate", this._onTimeUpdate), a(this._timeUpdateInterval), this._view.off("grab", this._onSliderGrab), this._view.on("change", this._onSliderChange), this._view.on("release", this._onSliderRelease), this._onPause())
                        }
                    }, {
                        key: "_onSliderRelease",
                        value: function () {
                            this._chapterFocused || (this._view.off("change", this._onSliderChange), this._view.off("release", this._onSliderRelease), this._view.on("grab", this._onSliderGrab), this._player.on("timeupdate", this._onTimeUpdate), this._player.getPaused() || this._onPlay())
                        }
                    }, {
                        key: "_getDuration",
                        value: function () {
                            return this._cachedDuration && isNaN(this._cachedDuration) || (this._cachedDuration = this._player.getDuration()), this._cachedDuration
                        }
                    }, {
                        key: "_getTimeAsPercent",
                        value: function () {
                            return this._player.getCurrentTime() / this._getDuration()
                        }
                    }, {
                        key: "_onDurationChange",
                        value: function () {
                            this._cachedDuration = this._player.getDuration(), this._updateSliderPosition(this._getTimeAsPercent()), this._player.getPaused() || this._onPlay(), this._refreshChapters()
                        }
                    }, {
                        key: "_onSliderChange",
                        value: function () {
                            var t = this._view.getValue();
                            this._setPlayerCurrentTime(t * this._getDuration()), this._setAriaValueText(t * this._getDuration()), this._updateScrubbedValue()
                        }
                    }, {
                        key: "_onTimeUpdate",
                        value: function () {
                            this._player.getPaused(), this._updateSliderPosition(this._getTimeAsPercent())
                        }
                    }, {
                        key: "_updateSliderPosition",
                        value: function (t) {
                            this._view.setValue(t), this._setAriaValueText(t * this._getDuration()), this._updateScrubbedValue(), this._visible || isNaN(this._getDuration()) || (this._view.show(), this._visible = !0)
                        }
                    }, {
                        key: "_setAriaValueText",
                        value: function (t) {
                            var e = Math.floor(t / 60),
                                i = Math.ceil(t % 60);
                            this._view.setAriaValueText(o(this._ariaTextTemplate, {
                                minutes: e,
                                seconds: i
                            }))
                        }
                    }, {
                        key: "_updateScrubbedValue",
                        value: function () {
                            this._view.setScrubbedValue()
                        }
                    }, {
                        key: "_setPlayerCurrentTime",
                        value: function (t) {
                            this._player.setCurrentTime(t)
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            this._player.chapters && this._player.chapters.off("change", this._refreshChapters), this._player.off("durationchange", this._onDurationChange), this._player.off("loadstart", this._onEnded), this._player.off("ended", this._onEnded), this._player.off("timeupdate", this._onTimeUpdate), this._view.off("change", this._onSliderChange), this._view.off("release", this._onSliderRelease), this._view.off("grab", this._onSliderGrab), this._view.off("chapter:click", this._onChapterClicked), this._view.off("chapter:focusin", this._onChapterFocusIn), this._view.off("chapter:focusout", this._onChapterFocusOut), this._player.off("play", this._onPlay), this._player.off("pause", this._onPause), this._player.off("ended", this._onPause)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._removeEventListeners(), a(this._raf), a(this._timeUpdateInterval), this._view = null
                        }
                    }]), e
                }();
            e.exports = c
        }, {
            "./BaseBehavior": 222,
            "@marcom/ac-raf-emitter/cancelDraw": 150,
            "@marcom/ac-raf-emitter/draw": 152,
            "@marcom/ac-string/supplant": 192
        }],
        231: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./ButtonBehavior"),
                o = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._player.states && n._updateState(), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_addPlayerListeners",
                        value: function () {
                            this._updateState = this._updateState.bind(this), this._player.states && this._player.states.on("statechange", this._updateState)
                        }
                    }, {
                        key: "_updateState",
                        value: function () {
                            this._stateChanging = !1, this._view.setState("sharing" === this._player.states.getCurrentState() ? "on" : "off")
                        }
                    }, {
                        key: "_onClick",
                        value: function () {
                            this._stateChanging || ("sharing" === this._player.states.getCurrentState() ? (this._view.setState("off"), this._player.states.setState("none")) : (this._view.setState("on"), this._player.states.setState("sharing")), this._stateChanging = !0)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._player.states && this._player.states.off("statechange", this._updateState),
                                function t(e, i, n) {
                                    null === e && (e = Function.prototype);
                                    var r = Object.getOwnPropertyDescriptor(e, i);
                                    if (void 0 === r) {
                                        var o = Object.getPrototypeOf(e);
                                        return null === o ? void 0 : t(o, i, n)
                                    }
                                    if ("value" in r) return r.value;
                                    var s = r.get;
                                    return void 0 !== s ? s.call(n) : void 0
                                }(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./ButtonBehavior": 223
        }],
        232: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./BaseBehavior"),
                o = t("../sharing/SharingModule"),
                s = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._updateState(), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_updateState",
                        value: function () {
                            this.sharingModule = new o(Object.assign({}, {
                                player: this._player,
                                parentView: this._view
                            })), this.sharingModule.setData(this._player.options.sharing), this._view.el.innerHTML = "", this._view.el.appendChild(this.sharingModule.el)
                        }
                    }]), e
                }();
            e.exports = s
        }, {
            "../sharing/SharingModule": 263,
            "./BaseBehavior": 222
        }],
        233: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./BaseBehavior"),
                o = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._hideVolume(), n._updateSliderVolumeValue(), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_addViewListeners",
                        value: function () {
                            this._showVolume = this._showVolume.bind(this), this._hideVolume = this._hideVolume.bind(this), this._onSliderGrab = this._onSliderGrab.bind(this), this._onSliderChange = this._onSliderChange.bind(this), this._onSliderRelease = this._onSliderRelease.bind(this), this._onFocusChange = this._onFocusChange.bind(this), this._view.on("grab", this._onSliderGrab), this._view.on("focuschange", this._onFocusChange)
                        }
                    }, {
                        key: "_addPlayerListeners",
                        value: function () {
                            this._updateSliderVolumeValue = this._updateSliderVolumeValue.bind(this), this._onUserVolumeChange = this._onUserVolumeChange.bind(this), this._player.once("durationchange", this._updateSliderVolumeValue), this._player.on("volumechange", this._updateSliderVolumeValue), this._player.on("uservolumechange", this._onUserVolumeChange)
                        }
                    }, {
                        key: "_onSliderGrab",
                        value: function () {
                            this._cachedVolume = this._player.getVolume(), this._player.off("volumechange", this._updateSliderVolumeValue), this._view.off("grab", this._onSliderGrab), this._view.on("change", this._onSliderChange), this._view.on("release", this._onSliderRelease)
                        }
                    }, {
                        key: "_onSliderRelease",
                        value: function () {
                            this._setPlayerVolume(this._view.getValue()), this._view.off("change", this._onSliderChange), this._view.off("release", this._onSliderRelease), this._view.on("grab", this._onSliderGrab), this._player.on("volumechange", this._updateSliderVolumeValue)
                        }
                    }, {
                        key: "_onSliderChange",
                        value: function () {
                            var t = this._view.getValue();
                            this._setPlayerVolume(t), this._view.setScrubbedValue()
                        }
                    }, {
                        key: "_setPlayerVolume",
                        value: function (t) {
                            t ? (this._player.setMuted(!1), this._player.setVolume(t / 100)) : (this._player.setMuted(!0), this._player.setVolume(this._cachedVolume))
                        }
                    }, {
                        key: "_showVolume",
                        value: function () {
                            this._view.show()
                        }
                    }, {
                        key: "_hideVolume",
                        value: function () {
                            this._view.hide()
                        }
                    }, {
                        key: "_onUserVolumeChange",
                        value: function () {
                            this._showVolume(), clearTimeout(this._hideVolumeTimer), this._view.isFocused() || (this._hideVolumeTimer = setTimeout(this._hideVolume, 1e3))
                        }
                    }, {
                        key: "_onFocusChange",
                        value: function () {
                            this._view.isFocused() ? this._showVolume() : this._hideVolume()
                        }
                    }, {
                        key: "_updateSliderVolumeValue",
                        value: function () {
                            if (this._player.getMuted()) this._view.setValue(0), this._view.setScrubbedValue();
                            else {
                                var t = this._player.getVolume();
                                this._view.setValue(100 * t), this._view.setScrubbedValue()
                            }
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            this._player.off("durationchange", this._updateSliderVolumeValue), this._player.off("volumechange", this._updateSliderVolumeValue), this._player.off("uservolumechange", this._onUserVolumeChange), this._view.off("change", this._onSliderChange), this._view.off("release", this._onSliderRelease), this._view.off("grab", this._onSliderGrab)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._removeEventListeners()
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./BaseBehavior": 222
        }],
        234: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                o = "ac-slider-chapter-container",
                s = "en",
                a = "hidden-chapter",
                c = t("@marcom/ac-string/supplant"),
                l = t("../localization/Localization"),
                u = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                        i.el = document.createElement("button"), i.el.className = o;
                        var n = t.titles.find(function (t) {
                                return t.language === s
                            }) || t.titles[0],
                            r = l.getTranslation().chapter;
                        i._chapterMarker = document.createElement("div"), i._chapterMarker.classList.add("ac-slider-chapter-marker"), "0%" === t.startTimeInPercentage && i.el.classList.add(a), i.el.style.left = t.startTimeInPercentage, i.el.setAttribute("data-acv-chapter-time", t["start-time"]), i.el.tabIndex = 0, i._chapterData = t, i.el.appendChild(i._chapterMarker);
                        var u = t["start-time"],
                            h = Math.floor(u / 60),
                            d = Math.ceil(u % 60);
                        return i._span = document.createElement("span"), i._span.innerText = c(r, {
                            chaptertitle: n.title,
                            chaptertime: c(l.getTranslation().minutesandseconds, {
                                minutes: h,
                                seconds: d
                            })
                        }), i.el.firstElementChild.appendChild(i._span), i._onClick = i._onClick.bind(i), i._onMouseOver = i._onMouseOver.bind(i), i._onMouseOut = i._onMouseOut.bind(i), i._onFocusIn = i._onFocusIn.bind(i), i._onFocusOut = i._onFocusOut.bind(i), i._onMouseDown = i._onMouseDown.bind(i), i.el.addEventListener("click", i._onClick), i.el.addEventListener("focusin", i._onFocusIn), i.el.addEventListener("focusout", i._onFocusOut), i.el.addEventListener("mouseover", i._onMouseOver), i.el.addEventListener("mouseout", i._onMouseOut), i.el.addEventListener("mousemove", i._onMouseMove), i.el.addEventListener("mousedown", i._onMouseDown), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_onClick",
                        value: function (t) {
                            t.preventDefault(), t.stopPropagation(), this.trigger("click", this._chapterData)
                        }
                    }, {
                        key: "_onMouseOver",
                        value: function (t) {
                            t.stopPropagation(), this.trigger("mouseover", this._chapterData)
                        }
                    }, {
                        key: "_onMouseOut",
                        value: function (t) {
                            this.trigger("mouseout", this._chapterData)
                        }
                    }, {
                        key: "_onMouseMove",
                        value: function (t) {
                            t.stopPropagation()
                        }
                    }, {
                        key: "_onMouseDown",
                        value: function (t) {
                            t.stopPropagation()
                        }
                    }, {
                        key: "_onFocusIn",
                        value: function (t) {
                            this.trigger("focusin", this._chapterData)
                        }
                    }, {
                        key: "_onFocusOut",
                        value: function (t) {
                            this.trigger("focusout", this._chapterData)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this.el.removeEventListener("click", this._onClick), this.el.removeEventListener("focusin", this._onFocusIn), this.el.removeEventListener("focusout", this._onFocusOut), this.el.removeEventListener("mouseover", this._onMouseOver), this.el.removeEventListener("mouseout", this._onMouseOut), this.el.removeEventListener("mousemove", this._onMouseMove)
                        }
                    }]), e
                }();
            e.exports = u
        }, {
            "../localization/Localization": 258,
            "@marcom/ac-event-emitter-micro": 88,
            "@marcom/ac-string/supplant": 192
        }],
        235: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("@marcom/ac-keyboard/Keyboard"),
                o = t("@marcom/useragent-detect"),
                s = o.os.ios || o.os.android,
                a = t("@marcom/ac-360"),
                c = function () {
                    function t(e) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this._rootElement = e.rootElement, this._player = e.player, this._360 = this._player.get360(), this.el = this._rootElement.querySelector(".compass-wrapper"), this.compassRing = this.el.querySelector(".compass-ring"), this.compassField = this.el.querySelector(".compass-field"), this.compass = this.el.querySelector(".compass"), this.compassArrows = this.el.querySelector(".compass-arrows"), this.compassArrowLeft = this.el.querySelector(".compass-arrow-left"), this.compassArrowRight = this.el.querySelector(".compass-arrow-right"), this.compassArrowTop = this.el.querySelector(".compass-arrow-top"), this.compassArrowBottom = this.el.querySelector(".compass-arrow-bottom"), this._keyboard = new r(this.el), this._arrowControls = this._player.get360().arrowControls, this._bindMethods(), this._addEventListeners()
                    }
                    return n(t, [{
                        key: "_bindMethods",
                        value: function () {
                            this._onFocusIn = this._onFocusIn.bind(this), this._onFocusOut = this._onFocusOut.bind(this), this._onCompassClick = this._onCompassClick.bind(this), this._onCompassMouseEnter = this._onCompassMouseEnter.bind(this), this._onCompassMouseLeave = this._onCompassMouseLeave.bind(this), this._onCompassFocusIn = this._onCompassFocusIn.bind(this), this._onCompassFocusOut = this._onCompassFocusOut.bind(this), this._onRotationTransitionEnd = this._onRotationTransitionEnd.bind(this), this._onCompassArrowsClick = this._onCompassArrowsClick.bind(this), this._on360PositionChange = this._on360PositionChange.bind(this), this._on360IconUpdate = this._on360IconUpdate.bind(this), this._transitionTiming = this._transitionTiming.bind(this)
                        }
                    }, {
                        key: "_addEventListeners",
                        value: function () {
                            this._player.once("controlsready", function () {
                                s || (this.compass.addEventListener("mouseenter", this._onCompassMouseEnter), this.compass.addEventListener("mouseleave", this._onCompassMouseLeave)), this.el.addEventListener("focusin", this._onFocusIn), this.el.addEventListener("focusout", this._onFocusOut), this.compass.addEventListener("click", this._onCompassClick), this.compass.addEventListener("focusin", this._onCompassFocusIn), this.compass.addEventListener("focusout", this._onCompassFocusOut), this.compassArrows.addEventListener("click", this._onCompassArrowsClick), this._360.on(a.POSITION_CHANGE, this._on360PositionChange), this._360.on(a.ROTATION_START, this._transitionTiming), this._360.on(a.ROTATION_COMPLETE, this._onRotationTransitionEnd)
                            }.bind(this))
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            this.el.removeEventListener("focusin", this._onFocusIn), this.el.removeEventListener("focusout", this._onFocusOut), this.compass.removeEventListener("click", this._onCompassClick), this.compass.removeEventListener("focusin", this._onCompassFocusIn), this.compass.removeEventListener("focusout", this._onCompassFocusOut), this.compass.removeEventListener("mouseenter", this._onCompassMouseEnter), this.compass.removeEventListener("mouseleave", this._onCompassMouseLeave), this.compassArrows.removeEventListener("click", this._onCompassArrowsClick), this._360.off(a.POSITION_CHANGE, this._on360PositionChange), this._360.off(a.ROTATION_START, this._transitionTiming), this._360.off(a.ROTATION_COMPLETE, this._onRotationTransitionEnd)
                        }
                    }, {
                        key: "_showCompassArrows",
                        value: function () {
                            this.el.classList.add("show-arrows")
                        }
                    }, {
                        key: "_hideCompassArrows",
                        value: function () {
                            this.el.classList.remove("show-arrows")
                        }
                    }, {
                        key: "_onRotationTransitionEnd",
                        value: function () {
                            this._compassIsRotating = !1, this._360.off(a.ROTATION_UPDATE, this._on360IconUpdate)
                        }
                    }, {
                        key: "_transitionTiming",
                        value: function (t) {
                            var e = t.time,
                                i = this._get360HorizontalAngle();
                            this._compassIsRotating = !0, this.compassRing.style.transition = "transform " + e + "ms cubic-bezier(0.25,0.1,0,1)", this.compassField.style.transition = "transform " + e + "ms cubic-bezier(0.25,0.1,0,1)";
                            i > 180 ? (this.compassRing.style.transform = "rotate(360deg)", this.compassField.style.transform = "rotate(360deg)") : i < -180 ? (this.compassRing.style.transform = "rotate(360deg)", this.compassField.style.transform = "rotate(360deg)") : (this.compassRing.style.transform = "rotate(0deg)", this.compassField.style.transform = "rotate(0deg)")
                        }
                    }, {
                        key: "_on360IconUpdate",
                        value: function (t) {
                            this.compassRing.style.transition = "transform 0.1s ease", this.compassRing.style.transform = "rotate(" + t.currentPosition.lon + "deg)", this.compassField.style.transition = "transform 0.1s ease", this.compassField.style.transform = "rotate(" + t.currentPosition.lon + "deg)"
                        }
                    }, {
                        key: "_onCompassClick",
                        value: function (t) {
                            this._compassIsRotating || (this._player.get360().isAtOrigin ? (this._360.on(a.ROTATION_UPDATE, this._on360IconUpdate), this._player.get360().oscillateLongitude()) : this._player.panToOrigin())
                        }
                    }, {
                        key: "_onCompassArrowsClick",
                        value: function (t) {
                            switch (t.target) {
                                case this.compassArrowLeft:
                                    this._arrowControls.leftArrowDown(t), this._arrowControls.leftArrowUp(t);
                                    break;
                                case this.compassArrowRight:
                                    this._arrowControls.rightArrowDown(t), this._arrowControls.rightArrowUp(t);
                                    break;
                                case this.compassArrowTop:
                                    this._arrowControls.upArrowDown(t), this._arrowControls.upArrowUp(t);
                                    break;
                                case this.compassArrowBottom:
                                    this._arrowControls.downArrowDown(t), this._arrowControls.downArrowUp(t)
                            }
                        }
                    }, {
                        key: "_onFocusIn",
                        value: function (t) {
                            t.target !== this.compass && this._showCompassArrows()
                        }
                    }, {
                        key: "_onFocusOut",
                        value: function (t) {
                            this._hideCompassArrows()
                        }
                    }, {
                        key: "_onCompassFocusIn",
                        value: function (t) {
                            this._rotateFieldOfViewToOrigin()
                        }
                    }, {
                        key: "_onCompassFocusOut",
                        value: function (t) {
                            var e = this._get360HorizontalAngle();
                            this.compassField.style.transform = "rotate(" + e + "deg)"
                        }
                    }, {
                        key: "_rotateFieldOfViewToOrigin",
                        value: function () {
                            var t = this._get360HorizontalAngle();
                            this.compassField.style.transition = "transform 0.3s ease", this.compassField.style.transform = t > 180 ? "rotate(360deg)" : t < -180 ? "rotate(-360deg)" : "rotate(0deg)"
                        }
                    }, {
                        key: "_onCompassMouseEnter",
                        value: function (t) {
                            this._hovering = !0, this._compassIsRotating || this._rotateFieldOfViewToOrigin()
                        }
                    }, {
                        key: "_onCompassMouseLeave",
                        value: function (t) {
                            if (this._hovering = !1, !this._compassIsRotating) {
                                var e = this._get360HorizontalAngle();
                                this.compassField.style.transition = "transform 0.3s ease", this.compassField.style.transform = "rotate(" + e + "deg)"
                            }
                        }
                    }, {
                        key: "_on360PositionChange",
                        value: function () {
                            var t = this._get360HorizontalAngle();
                            this.compassRing.style.transition = "none", this.compassRing.style.transform = "rotate(" + t + "deg)", this._hovering || (this.compassField.style.transition = "none", this.compassField.style.transform = "rotate(" + t + "deg)")
                        }
                    }, {
                        key: "_get360HorizontalAngle",
                        value: function () {
                            return this._player.get360().position.lon % 360
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._removeEventListeners()
                        }
                    }]), t
                }();
            e.exports = c
        }, {
            "@marcom/ac-360": 12,
            "@marcom/ac-keyboard/Keyboard": 108,
            "@marcom/useragent-detect": 306
        }],
        236: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = function () {
                function t(e) {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this._player = e.player, this.el = this._player.el, this._showControls = e.showControls, this._hideControls = e.hideControls, this._raiseControls = e.raiseControls, this._lowerControls = e.lowerControls, this._sendMouseDown = e.sendMouseDown, this._controls = this._player.controls, this._controlsVisible = e.controlsVisible, this._controlsTimeoutDuration = e.controlsTimeoutDuration, this._keyboardControl = e.keyboardControl, this._lastMouseCoords = {}, this._elementEmitter = e.elementEmitter, this._bindMethods(), this._addEventListeners()
                }
                return n(t, [{
                    key: "_bindMethods",
                    value: function () {
                        this._onUserInteraction = this._onUserInteraction.bind(this), this._onFullscreenChange = this._onFullscreenChange.bind(this), this._onFullscreenWillExit = this._onFullscreenWillExit.bind(this), this._onMouseOut = this._onMouseOut.bind(this), this._onMouseLeave = this._onMouseLeave.bind(this), this._onClick = this._onClick.bind(this), this._onFocusIn = this._onFocusIn.bind(this), this._onFocusOut = this._onFocusOut.bind(this), this._onUserInteractionTimeout = this._onUserInteractionTimeout.bind(this)
                    }
                }, {
                    key: "_addEventListeners",
                    value: function () {
                        this._controls.el.addEventListener("mousemove", this._onUserInteraction, !0), this._controls.el.addEventListener("click", this._onClick, !0), this._player.on("fullscreen:change", this._onFullscreenChange), this._player.on("fullscreen:willexit", this._onFullscreenWillExit), "onmouseleave" in this.el ? this._controls.el.addEventListener("mouseleave", this._onMouseLeave) : this._controls.el.addEventListener("mouseout", this._onMouseOut, !0), this._keyboardControl && this._keyboardControl.on("keyboardinteraction", this._onUserInteraction), this._elementEmitter.on("focusin", this._onFocusIn), this._elementEmitter.on("focusout", this._onFocusOut)
                    }
                }, {
                    key: "_removeEventListeners",
                    value: function () {
                        this._controls.el.removeEventListener("mousemove", this._onUserInteraction, !0), this._controls.el.removeEventListener("click", this._onClick, !0), this._player.off("fullscreen:change", this._onFullscreenChange), this._player.off("fullscreen:willexit", this._onFullscreenWillExit), "onmouseleave" in this.el ? this._controls.el.removeEventListener("mouseleave", this._onMouseLeave) : this._controls.el.removeEventListener("mouseout", this._onMouseOut, !0), this._keyboardControl && this._keyboardControl.off("keyboardinteraction", this._onUserInteraction), this._elementEmitter.off("focusin", this._onFocusIn), this._elementEmitter.off("focusout", this._onFocusOut)
                    }
                }, {
                    key: "_shouldIgnoreUserInteraction",
                    value: function (t) {
                        return !!(t && "focusin" !== t.type && t.target && this._isActiveArea(t.target))
                    }
                }, {
                    key: "_onUserInteraction",
                    value: function (t, e) {
                        !t || "click" !== t.type && "focusin" !== t.type || this._player.isCaptionsSelectorShowing() && !t.target.classList.contains("controls-text-tracks-toggle-button") && "radio" !== t.target.getAttribute("role") && "radiogroup" !== t.target.getAttribute("role") && this._player.hideCaptionsSelector(), !this._player.getCurrentSrc() || this._preventUserInteraction || !e && t && "mousemove" === t.type && this._lastMouseCoords.x === t.screenX && this._lastMouseCoords.y === t.screenY || (t && t.pageX && (this._lastMouseCoords = {
                            x: t.screenX,
                            y: t.screenY
                        }), this._showControls(), this._raiseControls(), clearTimeout(this._userInteractionTimeout), this._shouldIgnoreUserInteraction(t) || (this._userInteractionTimeout = window.setTimeout(this._onUserInteractionTimeout, this._controlsTimeoutDuration)))
                    }
                }, {
                    key: "_onUserInteractionTimeout",
                    value: function () {
                        this._hideControls()
                    }
                }, {
                    key: "_onMouseLeave",
                    value: function (t) {
                        window.clearTimeout(this._userInteractionTimeout), this._hideControls(), this._lowerControls(), this._lastMouseCoords = {}
                    }
                }, {
                    key: "_onMouseOut",
                    value: function (t) {
                        this._controls.el.contains(t.target) || t.target === this._controls.el || this._onMouseLeave()
                    }
                }, {
                    key: "_isActiveArea",
                    value: function (t) {
                        for (; t !== this.el;) {
                            if (t.hasAttribute("data-acv-active-area")) return !0;
                            t = t.parentNode
                        }
                        return !1
                    }
                }, {
                    key: "_onClick",
                    value: function (t) {
                        this._hasFocus = !1, this._onUserInteraction(t)
                    }
                }, {
                    key: "_onFullscreenWillExit",
                    value: function () {
                        this.controls && (this.controls.el.display = "none")
                    }
                }, {
                    key: "_onFullscreenChange",
                    value: function () {
                        var t = this;
                        this.controls && (this.controls.el.display = ""), this._hideControls(), this._lowerControls(), this._preventUserInteraction = !0, this._fullscreenChangeTimeout = setTimeout(function () {
                            t._preventUserInteraction = !1, t._player.refreshSize()
                        }, 750), this._player.refreshSize()
                    }
                }, {
                    key: "_onFocusIn",
                    value: function (t) {
                        clearTimeout(this._focusOutTimer), this._focusOutTimer = null, this._hasFocus = !0, this._onUserInteraction(t)
                    }
                }, {
                    key: "_onFocusOut",
                    value: function (t) {
                        var e = this;
                        this._focusOutTimer = setTimeout(function () {
                            e._hasFocus && !e.el.contains(document.activeElement) && (e._hasFocus = !1, e._hideControls(), e._lowerControls())
                        }, 100)
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        clearTimeout(this._focusOutTimer), clearTimeout(this._fullscreenChangeTimeout), clearTimeout(this._userInteractionTimeout), this._removeEventListeners()
                    }
                }]), t
            }();
            e.exports = r
        }, {}],
        237: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = t("./DefaultControlsInteraction"),
                s = 500,
                a = 3e3,
                c = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return i._showCompass = t.showCompass, i._hideCompass = t.hideCompass, i._threesixtyElementsTimeoutDuration = t.threesixtyElementsTimeoutDuration || a, i._dragEndThreshold = s, i._mouseDownPosition = null, i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "_bindMethods",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_bindMethods", this).call(this), this._onMouseDown = this._onMouseDown.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onDragging = this._onDragging.bind(this), this._onClick = this._onClick.bind(this)
                        }
                    }, {
                        key: "_addEventListeners",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_addEventListeners", this).call(this), this._controls.el.addEventListener("mousedown", this._onMouseDown), this._controls.el.addEventListener("click", this._onClick)
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_removeEventListeners", this).call(this), this._controls.el.removeEventListener("mousedown", this._onMouseDown)
                        }
                    }, {
                        key: "_onUserInteraction",
                        value: function (t) {
                            this._userWasRecentlyDragging || t && "mousemove" === t.type && this._lastMouseCoords.x === t.screenX && this._lastMouseCoords.y === t.screenY || this._dragging || (this._showCompass(), clearTimeout(this._userHideMouse), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_onUserInteraction", this).call(this))
                        }
                    }, {
                        key: "_onUserInteractionTimeout",
                        value: function () {
                            var t = this;
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_onUserInteractionTimeout", this).call(this), clearTimeout(this._userHideMouse), this._userHideMouse = setTimeout(function () {
                                t._hideCompass()
                            }, this._threesixtyElementsTimeoutDuration)
                        }
                    }, {
                        key: "_onDragging",
                        value: function (t) {
                            var e = this;
                            !this._dragging && this._isActiveArea(t.target) || (this._dragging = !0, this._player.el.classList.add("dragging"), this._player.el.classList.add("recently-dragging"), this._recentDragTimeout = setTimeout(function () {
                                e._dragging && (e._hideControls(), e._userWasRecentlyDragging = !0, clearTimeout(e._dragTimer), e._dragTimer = setTimeout(function () {
                                    e._userWasRecentlyDragging = !1, e._player.el.classList.remove("recently-dragging")
                                }, e._dragEndThreshold))
                            }, 30), clearTimeout(this._userInteractionTimeout), clearTimeout(this._userHideMouse))
                        }
                    }, {
                        key: "_isDraggable",
                        value: function (t) {
                            return -1 !== [this._player.controls.compass.el, this._player.controls.playButtonElement].indexOf(t) || this._player.controls.compass.el.contains(t)
                        }
                    }, {
                        key: "_onMouseDown",
                        value: function (t) {
                            this._isActiveArea(t.target) && this._controlsVisible() && !this._isDraggable(t.target) || !this._isPlayingState() || (this._showControls(), clearTimeout(this._userHideMouse), clearTimeout(this._recentDragTimeout), this._player.el.classList.remove("dragging"), this._player.el.classList.remove("recently-dragging"), this._mouseDownPosition = {
                                x: t.x,
                                y: t.y
                            }, window.addEventListener("mouseup", this._onMouseUp), window.addEventListener("mousemove", this._onDragging), this._sendMouseDown(t))
                        }
                    }, {
                        key: "_onMouseUp",
                        value: function (t) {
                            window.removeEventListener("mousemove", this._onDragging), window.removeEventListener("mouseup", this._onMouseUp), this._dragging && this._onUserInteractionTimeout(), this._player.el.contains(t.target) || this._hideCompass(), this._player.el.classList.remove("dragging"), this._dragging = !1
                        }
                    }, {
                        key: "_onMouseLeave",
                        value: function (t) {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_onMouseLeave", this).call(this), this._userWasRecentlyDragging = !1, this._dragging || (clearTimeout(this._userHideMouse), this._hideCompass())
                        }
                    }, {
                        key: "_onClick",
                        value: function (t) {
                            this._player.controls.compass.el.contains(t.target) && this._userWasRecentlyDragging && t.stopPropagation(), t.target !== this._player.controls.playButtonElement.parentElement && t.target !== this._controls.el.firstElementChild || null === this._mouseDownPosition || this._mouseDownPosition.x !== t.x || this._mouseDownPosition.y !== t.y || (this._mouseDownPosition = null, this._mouseDownTime = 1 / 0, this._dragging = !1, this._userWasRecentlyDragging = !1, clearTimeout(this._dragTimer), clearTimeout(this._recentDragTimeout))
                        }
                    }, {
                        key: "_isPlayingState",
                        value: function () {
                            return !this._player.controls.el.classList.contains("start-state") && !this._player.controls.el.classList.contains("end-state")
                        }
                    }]), e
                }();
            e.exports = c
        }, {
            "./DefaultControlsInteraction": 236
        }],
        238: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = t("./ThreeSixtyControlsInteraction"),
                s = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return i._controlsVisible = t.controlsVisible, i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "_bindMethods",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_bindMethods", this).call(this), this._onTouchStart = this._onTouchStart.bind(this), this._onTouchEnd = this._onTouchEnd.bind(this), this._onClick = this._onClick.bind(this)
                        }
                    }, {
                        key: "_addEventListeners",
                        value: function () {
                            this._controls.el.addEventListener("touchstart", this._onTouchStart, {
                                passive: !1
                            }), this._controls.el.addEventListener("click", this._onClick), this._controls.el.addEventListener("focusin", this._onFocusIn), this._controls.el.addEventListener("focusout", this._onFocusOut)
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            this._controls.el.removeEventListener("touchstart", this._onTouchStart), this._controls.el.removeEventListener("touchend", this._onTouchEnd), this._controls.el.removeEventListener("click", this._onClick), this._controls.el.removeEventListener("focusin", this._onFocusIn), this._controls.el.removeEventListener("focusout", this._onFocusOut)
                        }
                    }, {
                        key: "_onDragging",
                        value: function (t) {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_onDragging", this).call(this)
                        }
                    }, {
                        key: "_shouldIgnoreUserInteraction",
                        value: function (t) {
                            return !1
                        }
                    }, {
                        key: "_onClick",
                        value: function (t) {
                            t.target !== this._player.controls.compass.compassView && (this._controlsVisible() ? this._isActiveArea(t.target) || (this._hideControls(), this._hideCompass()) : this._onUserInteraction(t))
                        }
                    }, {
                        key: "_onTouchStart",
                        value: function (t) {
                            t.target !== this._player.controls.playButtonElement && t.target !== this._controls.el.firstElementChild && t.target !== this._player.controls.compass.compassView && t.target !== this._player.controls.playButtonElement || (document.addEventListener("touchend", this._onTouchEnd), window.addEventListener("touchmove", this._onDragging), this._showCompass(), this._touchDownTime = Date.now(), this._sendMouseDown(t))
                        }
                    }, {
                        key: "_onTouchEnd",
                        value: function (t) {
                            document.removeEventListener("touchend", this._onTouchEnd), window.removeEventListener("touchmove", this._onDragging), this._onMouseUp(t)
                        }
                    }]), e
                }();
            e.exports = s
        }, {
            "./ThreeSixtyControlsInteraction": 237
        }],
        239: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/useragent-detect"),
                r = n.os.ios || n.os.android,
                o = t("./DefaultControlsInteraction"),
                s = t("./ThreeSixtyControlsInteraction"),
                a = t("./ThreeSixtyMobileControlsInteraction");
            e.exports = function (t) {
                return t.threesixty ? r ? new a(t) : new s(t) : new o(t)
            }
        }, {
            "./DefaultControlsInteraction": 236,
            "./ThreeSixtyControlsInteraction": 237,
            "./ThreeSixtyMobileControlsInteraction": 238,
            "@marcom/useragent-detect": 306
        }],
        240: [function (t, e, i) {
            "use strict";
            var n = t("../../dom-emitter/DOMEmitterMicro"),
                r = function (t) {
                    function e(t) {
                        return function (t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, e),
                            function (t, e) {
                                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return !e || "object" != typeof e && "function" != typeof e ? t : e
                            }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t))
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, n), e
                }();
            e.exports = r
        }, {
            "../../dom-emitter/DOMEmitterMicro": 200
        }],
        241: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = function () {
                function t(e) {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.el = e
                }
                return n(t, [{
                    key: "show",
                    value: function () {
                        this.el.classList.remove("hidden")
                    }
                }, {
                    key: "hide",
                    value: function () {
                        this.el.classList.add("hidden")
                    }
                }, {
                    key: "destroy",
                    value: function (t) {}
                }]), t
            }();
            e.exports = r
        }, {}],
        242: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = function () {
                function t(e) {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.el = e
                }
                return n(t, [{
                    key: "setText",
                    value: function (t) {
                        this.el.innerHTML = t
                    }
                }]), t
            }();
            e.exports = r
        }, {}],
        243: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("../../dom-emitter/DOMEmitterMicro"),
                o = t("@marcom/ac-keyboard/Keyboard"),
                s = t("@marcom/ac-keyboard/keyMap"),
                a = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return i.el = t, i._keyboard = new o(i.el), i._addEventListeners(), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_addEventListeners",
                        value: function () {
                            this._onClick = this._onClick.bind(this), this._onKeyDown = this._onKeyDown.bind(this), this.el.addEventListener("click", this._onClick), this._keyboard.onDown(s.ARROW_UP, this._onKeyDown), this._keyboard.onDown(s.ARROW_DOWN, this._onKeyDown)
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            this.el.removeEventListener("click", this._onClick), this._keyboard.onDown(s.ARROW_UP, this._onKeyDown), this._keyboard.onDown(s.ARROW_DOWN, this._onKeyDown)
                        }
                    }, {
                        key: "setItems",
                        value: function (t) {
                            var e = this,
                                i = void 0;
                            this.el.innerHTML = "", t.forEach(function (t) {
                                var n = document.createElement("li");
                                n.setAttribute("role", "radio"), "showing" === t.mode ? (n.classList.add(t.mode), n.setAttribute("aria-checked", "true"), n.setAttribute("tabIndex", 0), i = n) : (n.setAttribute("aria-checked", "false"), n.setAttribute("tabIndex", -1)), n.innerText = t.label, n.acvMetadata = t, e.el.appendChild(n)
                            }), i && i.focus()
                        }
                    }, {
                        key: "_onKeyDown",
                        value: function (t) {
                            var e = t.target,
                                i = !1;
                            parseInt(t.keyCode) === s.ARROW_DOWN ? i = e.nextSibling : parseInt(t.keyCode) === s.ARROW_UP && (i = e.previousSibling), i && (this.trigger("ItemSelected", i.acvMetadata), t.preventDefault(), t.stopPropagation())
                        }
                    }, {
                        key: "_onClick",
                        value: function (t) {
                            this.el !== t.target && this.el.contains(t.target) && this.trigger("ItemSelected", t.target.acvMetadata)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._removeEventListeners()
                        }
                    }]), e
                }();
            e.exports = a
        }, {
            "../../dom-emitter/DOMEmitterMicro": 200,
            "@marcom/ac-keyboard/Keyboard": 108,
            "@marcom/ac-keyboard/keyMap": 111
        }],
        244: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-slider").Slider,
                r = t("../chapters/ChapterView"),
                o = function (t, e) {
                    if (this.el = t, this._min = e.min || 0, this._max = e.max || 1, e.mixins)
                        for (var i = e.mixins.slice(0); i.length;) Object.assign(this, i.pop());
                    this._slider = new n(this.el, {
                        template: e.template,
                        min: this._min,
                        max: this._max,
                        step: isNaN(+this.el.getAttribute("step")) ? this.el.getAttribute("step") : +this.el.getAttribute("step"),
                        value: void 0 !== e.value ? e.value : +this.el.getAttribute("value"),
                        orientation: e.orientation,
                        renderedPosition: !0,
                        keyboardContext: this.el
                    }), this._onFocusChange = this._onFocusChange.bind(this), this._setHoveringValue = this._setHoveringValue.bind(this), this._onMouseOver = this._onMouseOver.bind(this), this._onMouseLeave = this._onMouseLeave.bind(this), this._onChapterClicked = this._onChapterClicked.bind(this), this._onChapterFocusIn = this._onChapterFocusIn.bind(this), this._onChapterFocusOut = this._onChapterFocusOut.bind(this), this._slider.el.addEventListener("blur", this._onFocusChange), this._slider.el.addEventListener("focus", this._onFocusChange), this._slider.el.addEventListener("mouseout", this._onFocusChange), this._onGrab = this._onGrab.bind(this), this._onRelease = this._onRelease.bind(this), this._slider.on("grab", this._onGrab), this._slider.on("release", this._onRelease), this._scrubbedEl = this.el.querySelector(".ac-slider-scrubbed"), this._notchEl = this.el.querySelector(".ac-slider-hover-notch"), this._chapterContainer = this.el.querySelector(".ac-slider-chapters-track"), this._axTrack = this.el.querySelector(".ac-slider-ax-track"), this._notchEl && (this._slider.el.addEventListener("mouseover", this._onMouseOver), this._slider.el.addEventListener("mouseleave", this._onMouseLeave), this._slider.el.addEventListener("mousemove", this._setHoveringValue)), this._axTrack && (this._axTrack.tabIndex = 0, this._slider.el.tabIndex = -1, this._slider.el.setAttribute("aria-hidden", ""), this._slider.el.removeAttribute("aria-label"), this._slider.el.removeAttribute("role")), e.value && requestAnimationFrame(function () {
                        this._slider && this.setValue(e.value)
                    }.bind(this))
                },
                s = o.prototype;
            s.on = function () {
                return this._slider.on.apply(this._slider, arguments)
            }, s.off = function () {
                return this._slider.off.apply(this._slider, arguments)
            }, s.trigger = function () {
                return this._slider.trigger.apply(this._slider, arguments)
            }, s.setValue = function (t) {
                return this._axTrack && this._axTrack.setAttribute("aria-valuenow", t), this._slider.setValue.call(this._slider, t)
            }, s.setAriaValueText = function (t) {
                this._axTrack ? this._axTrack.setAttribute("aria-valuetext", t) : this._slider.el.setAttribute("aria-valuetext", t)
            }, s.setMin = function (t) {
                this._min = t, this._slider.setMin(t)
            }, s.setMax = function (t) {
                this._max = t, this._slider.setMax(t)
            }, s._onMouseOver = function () {
                this._slider.el.classList.add("hover")
            }, s._onMouseLeave = function () {
                this._slider.el.classList.remove("hover")
            }, s._onFocusChange = function () {
                setTimeout(function () {
                    this.trigger("focuschange")
                }.bind(this), 0)
            }, s.isFocused = function () {
                return this._slider.el === document.activeElement && this._hasFocusOutline()
            }, s._hasFocusOutline = function () {
                return "none" !== getComputedStyle(this._slider.el).getPropertyValue("outline-style")
            }, s.getValue = function () {
                return this._slider.getValue.apply(this._slider, arguments)
            }, s.getMax = function () {
                return this._max
            }, s.setScrubbedValue = function () {
                this._chapters && this._checkCollisionsSetValue(), "horizontal" === this._slider.getOrientation() ? this._scrubbedEl.style.left = this._slider.thumbElement.style.left : this._scrubbedEl.style.bottom = this._slider.thumbElement.style.bottom
            }, s._checkCollisionsSetValue = function () {
                for (var t = 0; t < this._chapters.length; t++) {
                    var e = this._chapters[t].el.children[0],
                        i = parseInt(this._chapters[t].el.style.left) < this.getValue() / this.getMax() * 100;
                    this._setInlineBackgroundColor(!i, e)
                }
            }, s._setHoveringValue = function (t) {
                var e = this.getClientXValue(t, this._notchEl),
                    i = e > this.getValue();
                this._notchEl.style.left = e / this.getMax() * 100 + "%", this._setInlineBackgroundColor(i, this._notchEl)
            }, s._setInlineBackgroundColor = function (t, e) {
                t ? e.classList.remove("invert-element") : e.classList.add("invert-element")
            }, s._onChapterClicked = function (t) {
                this.trigger("chapter:click", t), this._slider.thumbElement.style.pointerEvents = ""
            }, s._onChapterFocusIn = function (t) {
                this._notchEl.classList.add("hidden"), this._slider.thumbElement.style.pointerEvents = "none", this.trigger("chapter:focusin", t)
            }, s._onChapterFocusOut = function (t) {
                this._notchEl.classList.remove("hidden"), this._slider.thumbElement.style.pointerEvents = "", this.trigger("chapter:focusout", t)
            }, s._onGrab = function () {
                this.forceCursorPointer(), this.setScrubbedValue()
            }, s._onRelease = function () {
                this.disableForcedCursorPointer(), this.setScrubbedValue()
            }, s.setChapters = function (t) {
                var e = this;
                this._chapters && this._chapters.forEach(function (t) {
                    t.off("click", e._onChapterClicked), t.off("focusin", e._onChapterFocusIn), t.off("focusout", e._onChapterFocusOut), t.off("mouseover", e._onChapterFocusIn), t.off("mouseout", e._onChapterFocusOut), t.destroy()
                }), this._chapterContainer.innerHTML = "", this._chapters = [];
                for (var i = 0; i < t.length; i++)
                    if (t[i].startTime < 100) {
                        var n = new r(t[i]);
                        n.on("click", this._onChapterClicked), n.on("focusin", this._onChapterFocusIn), n.on("focusout", this._onChapterFocusOut), n.on("mouseover", this._onChapterFocusIn), n.on("mouseout", this._onChapterFocusOut), this._chapters.push(n), this._chapterContainer.appendChild(n.el)
                    }
            }, s.show = function () {
                this.el.classList.remove("ac-slider-inactive")
            }, s.hide = function () {
                this.el.classList.add("ac-slider-inactive")
            }, s.setState = function (t) {
                this.el.classList.add(t)
            }, s.clearState = function (t) {
                this.el.classList.remove(t)
            }, s.getClientXValue = function (t, e) {
                return this._slider.getClientXValue(t, e)
            }, s.destroy = function () {
                var t = this;
                this._chapters && this._chapters.forEach(function (e) {
                    e.off("click", t._onChapterClicked), e.off("focusin", t._onChapterFocusIn), e.off("focusout", t._onChapterFocusOut), e.off("mouseover", t._onChapterFocusIn), e.off("mouseout", t._onChapterFocusOut), e.destroy()
                }), this._slider.el.removeEventListener("mousemove", this._setHoveringValue), this._slider.el.removeEventListener("mouseleave", this._onMouseOver), this._slider.el.removeEventListener("mouseout", this._onMouseLeave), this._slider.el.removeEventListener("blur", this._onFocusChange), this._slider.el.removeEventListener("focus", this._onFocusChange), this._slider.el.removeEventListener("mouseout", this._onFocusChange), this._slider.off("grab", this._onGrab), this._slider.off("release", this._onRelease), this._slider.destroy(), this._slider = null
            }, e.exports = o
        }, {
            "../chapters/ChapterView": 234,
            "@marcom/ac-slider": 165
        }],
        245: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./Button"),
                o = function (t) {
                    function e(t, i) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var n = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i));
                        return n._states = i.states || {}, n._labels = i.labels, n._focusTarget = n.el.querySelector("button") || n.el, n._states && n._states.initial && n.setState("initial"), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "setState",
                        value: function (t) {
                            this._currentState && this._currentState !== t && this._states[this._currentState].length && this.el.classList.remove(this._states[this._currentState]), this._currentState = t, this._labels && this._labels[this._currentState] && (this._focusTarget.value = this._labels[this._currentState], this._focusTarget.setAttribute("aria-label", this._labels[this._currentState])), this._states[t].length && this.el.classList.add(this._states[t])
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./Button": 240
        }],
        246: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("./StatefulButton"),
                o = function (t) {
                    function e(t, i) {
                        return function (t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, e),
                            function (t, e) {
                                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return !e || "object" != typeof e && "function" != typeof e ? t : e
                            }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i))
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "setState",
                        value: function (t) {
                            (function t(e, i, n) {
                                null === e && (e = Function.prototype);
                                var r = Object.getOwnPropertyDescriptor(e, i);
                                if (void 0 === r) {
                                    var o = Object.getPrototypeOf(e);
                                    return null === o ? void 0 : t(o, i, n)
                                }
                                if ("value" in r) return r.value;
                                var s = r.get;
                                return void 0 !== s ? s.call(n) : void 0
                            })(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "setState", this).call(this, t), "on" === this._currentState ? this._focusTarget.setAttribute("aria-pressed", !0) : this._focusTarget.setAttribute("aria-pressed", !1)
                        }
                    }]), e
                }();
            e.exports = o
        }, {
            "./StatefulButton": 245
        }],
        247: [function (t, e, i) {
            "use strict";
            e.exports = {
                disableForcedCursorPointer: function () {
                    document.body.classList.remove("cursor-pointer"), this.onSelectStartResumeDefault()
                },
                forceCursorPointer: function () {
                    document.body.classList.add("cursor-pointer"), this.onSelectStartPreventDefault()
                },
                onSelectStartResumeDefault: function () {
                    document.removeEventListener("selectstart", this.preventDefault)
                },
                onSelectStartPreventDefault: function () {
                    document.addEventListener("selectstart", this.preventDefault)
                },
                preventDefault: function (t) {
                    t.preventDefault()
                }
            }
        }, {}],
        248: [function (t, e, i) {
            "use strict";
            var n = t("../templates/states/EndStateItem.html"),
                r = function (t) {
                    this.el = t.el, this.el.innerHTML = n, this._player = t.player, this._bindContent(t)
                },
                o = r.prototype;
            o._bindContent = function (t) {
                if ("link" === t.type || "video" === t.type) {
                    var e = this.el.querySelector(".end-state-link"),
                        i = document.createElement("div");
                    e.classList.remove("hidden"), i.classList.add("end-state-text-container"), i.innerText = t.label || "", e.href = t.url || "", e.appendChild(i), "link" === t.type ? e.classList.add("icon", "icon-after", "icon-chevronright") : "video" === t.type && e.classList.add("icon", "icon-after", "icon-playcircle"), this._bindAction(this.el, t)
                }
            }, o._bindAction = function (t, e) {
                "function" == typeof e.onclick ? t.onclick = function (t) {
                    t.preventDefault(), e.onclick.call(null, t)
                }.bind(this) : "video" === e.type && e.url && (t.onclick = function (t) {
                    t.preventDefault(), this._player.load(e.url, null, 0, {})
                }.bind(this))
            }, o.destroy = function () {}, e.exports = r
        }, {
            "../templates/states/EndStateItem.html": 267
        }],
        249: [function (t, e, i) {
            "use strict";
            var n = t("./EndStateItem"),
                r = function (t) {
                    this.el = t.el, this._player = t.player, this._addItems(t.items || [])
                },
                o = r.prototype;
            o._addItems = function (t) {
                this._items = [], t.forEach(function (t) {
                    var e = document.createElement("div");
                    e.classList.add("end-state-item");
                    var i = new n(Object.assign({}, t, {
                        el: e,
                        player: this._player
                    }));
                    this.el.appendChild(e), this._items.push(i)
                }.bind(this))
            }, o.setData = function (t) {
                for (; this._items.length;) this._items.pop().destroy();
                this.el.innerHTML = "", t ? (this.el.classList.remove("hidden"), this._addItems(t.items)) : this.el.classList.add("hidden")
            }, o.destroy = function () {
                for (; this._items.length;) this._items.pop().destroy()
            }, e.exports = r
        }, {
            "./EndStateItem": 248
        }],
        250: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = function () {
                function t(e) {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.el = document.createElement("div"), this.el.classList.add("error-state-wrapper")
                }
                return n(t, [{
                    key: "setText",
                    value: function (t) {
                        this._errorStr = t, this.render(), this._container = this.el.firstElementChild
                    }
                }, {
                    key: "focus",
                    value: function () {
                        this._container.firstElementChild.focus()
                    }
                }, {
                    key: "render",
                    value: function () {
                        this.el.innerHTML = '<div class="error-state-container" >\n\t\t\t<div tabindex="-1" role="text" class="error-state-message">' + this._errorStr + "</div>\n\t\t</div>\n\t\t"
                    }
                }]), t
            }();
            e.exports = r
        }, {}],
        251: [function (t, e, i) {
            "use strict";
            var n = function (t, e, i) {
                return function (n) {
                    t[e](n, i)
                }
            };
            e.exports = function (t, e, i) {
                return e.classDef ? function (t, e, i) {
                    return new e.classDef(t, Object.assign(e.options || {}, i || {}))
                }(t, e, i) : function (t, e) {
                    var i = e.handlers || {},
                        r = {};
                    for (var o in i) i.hasOwnProperty(o) && t.on(o, r[o] = n(i, o, t));
                    var s, a = e.observe;
                    if (a) {
                        for (var c = a.update, l = a.source, u = l.on.bind(l) || l.addEventListener, h = l.off.bind(l) || l.removeEventListener, d = a.events, p = 0, f = d.length, m = function () {
                                c.call(a, t)
                            }; p < f; p++) u(o = d[p], m);
                        s = function () {
                            for (p = 0; p < f; p++) o = d[p], h(o, m)
                        }
                    }
                    return {
                        destroy: function () {
                            for (var e in r) r.hasOwnProperty(e) && t.off(e, r[e]);
                            s && s()
                        }
                    }
                }(t, e)
            }
        }, {}],
        252: [function (t, e, i) {
            "use strict";
            var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                    return typeof t
                } : function (t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                },
                r = t("./createView"),
                o = t("./createBehavior"),
                s = function (t) {
                    for (; t.length;) t.shift().destroy()
                },
                a = function (t, e, i) {
                    var n = r(t, e.view),
                        s = o(n, e.behavior, i);
                    return {
                        view: n,
                        behavior: s,
                        destroy: function (t, e) {
                            "function" == typeof e.destroy && e.destroy(), "function" == typeof t.destroy && t.destroy()
                        }.bind(null, n, s)
                    }
                };
            e.exports = function (t, e, i) {
                var r = {};
                for (var o in e)
                    if (e.hasOwnProperty(o) && "object" === n(e[o])) {
                        var c = e[o],
                            l = e.elementClassPrefix ? "." + e.elementClassPrefix + "-" + c.className : "." + c.className,
                            u = t.querySelectorAll(l);
                        r[o] = [];
                        for (var h = 0, d = u.length; h < d; h++) r[o].push(a(u[h], c, i))
                    } return {
                    components: r,
                    destroy: function (t) {
                        for (var e in t) t.hasOwnProperty(e) && (s(t[e]), delete t[e])
                    }.bind(null, r)
                }
            }
        }, {
            "./createBehavior": 251,
            "./createView": 253
        }],
        253: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e) {
                return new e.classDef(t, e.options)
            }
        }, {}],
        254: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-keyboard/Keyboard"),
                r = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                o = 32,
                s = 37,
                a = 38,
                c = 39,
                l = 40,
                u = function (t) {
                    r.call(this), this._player = t.player, this._target = t.keyboardTarget || this._player.el, this._keyboard = new n(this._target), this._bindMethods(), this._addEventListeners()
                },
                h = r.prototype,
                d = u.prototype = Object.create(h);
            d._bindMethods = function () {
                this._onLeftArrowDown = this._onLeftArrowDown.bind(this), this._onRightArrowDown = this._onRightArrowDown.bind(this), this._onUpArrowDown = this._onUpArrowDown.bind(this), this._onDownArrowDown = this._onDownArrowDown.bind(this), this._onSpaceBarUp = this._onSpaceBarUp.bind(this), this._onSpaceBarDown = this._onSpaceBarDown.bind(this), this._onKeyboardInteraction = this._onKeyboardInteraction.bind(this), this._onDurationChange = this._onDurationChange.bind(this), this._boundKeyboardInteraction = {}, [o, s, c, a, l].forEach(function (t) {
                    this._boundKeyboardInteraction[t] = this._onKeyboardInteraction.bind(this, t)
                }.bind(this))
            }, d._addEventListeners = function () {
                [o, s, c, a, l].forEach(function (t) {
                    this._keyboard.onDown(t, this._boundKeyboardInteraction[t])
                }.bind(this)), this._keyboard.onDown(o, this._onSpaceBarDown), this._keyboard.onDown(s, this._onLeftArrowDown), this._keyboard.onDown(c, this._onRightArrowDown), this._keyboard.onDown(a, this._onUpArrowDown), this._keyboard.onDown(l, this._onDownArrowDown), this._player.on("durationchange", this._onDurationChange)
            }, d._removeEventListeners = function () {
                [o, s, c, a, l].forEach(function (t) {
                    this._keyboard.offDown(t, this._boundKeyboardInteraction[t])
                }.bind(this)), this._boundKeyboardInteraction = null, this._keyboard.offDown(o, this._onSpaceBarDown), this._keyboard.offUp(o, this._onSpaceBarUp), this._keyboard.offDown(s, this._onLeftArrowDown), this._keyboard.offDown(c, this._onRightArrowDown), this._keyboard.offDown(a, this._onUpArrowDownDown), this._keyboard.offDown(l, this._onDownArrowDown), this._player.off("durationchange", this._onDurationChange)
            }, d._onKeyboardInteraction = function () {
                this._triggerKeyboardInteraction()
            }, d._triggerKeyboardInteraction = function () {
                this.trigger("keyboardinteraction")
            }, d._onDurationChange = function () {
                var t = this._player.getDuration();
                this._interval = t >= 60 ? 10 : t >= 20 ? 5 : 1
            }, d._onLeftArrowDown = function (t) {
                if (!this._player.isLive()) {
                    t.originalEvent.preventDefault(), t.originalEvent.stopPropagation();
                    var e = this._player.getCurrentTime();
                    isNaN(e) || this._player.seek(Math.max(e - this._interval, 0))
                }
            }, d._onRightArrowDown = function (t) {
                if (!this._player.isLive()) {
                    t.originalEvent.preventDefault(), t.originalEvent.stopPropagation();
                    var e = this._player.getCurrentTime();
                    isNaN(e) || this._player.seek(Math.min(e + this._interval, this._player.getDuration()))
                }
            }, d._onUpArrowDown = function (t) {
                if (!t.target.hasAttribute("aria-checked")) {
                    t.originalEvent.preventDefault(), t.originalEvent.stopPropagation();
                    var e = this._player.getMuted() ? 0 : this._player.getVolume(),
                        i = Math.min(1, e + .1);
                    this._player.setVolume(i), this._player.setMuted(!1)
                }
            }, d._onDownArrowDown = function (t) {
                if (!t.target.hasAttribute("aria-checked")) {
                    t.originalEvent.preventDefault(), t.originalEvent.stopPropagation();
                    var e = this._player.getMuted() ? 0 : this._player.getVolume(),
                        i = Math.max(0, e - .1);
                    this._player.setVolume(i), this._player.setMuted(0 === Math.round(10 * i))
                }
            }, d._onSpaceBarDown = function (t) {
                "BUTTON" !== t.target.tagName && "button" !== t.target.getAttribute("role") && (this._keyboard.offDown(o, this._onSpaceBarDown), this._keyboard.onUp(o, this._onSpaceBarUp))
            }, d._onSpaceBarUp = function () {
                this._keyboard.offUp(o, this._onSpaceBarUp), this._player.getPaused() ? this._player.play() : this._player.pause(), this._keyboard.onDown(o, this._onSpaceBarDown)
            }, d.destroy = function () {
                this._removeEventListeners(), this._keyboard.destroy(), h.destroy.call(this)
            }, e.exports = u
        }, {
            "@marcom/ac-event-emitter-micro": 88,
            "@marcom/ac-keyboard/Keyboard": 108
        }],
        255: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = t("./KeyboardControl"),
                s = ["controls-toggle-mute-volume-button", "controls-volume-level-indicator"],
                a = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return !e || "object" != typeof e && "function" != typeof e ? t : e
                            }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t)),
                            n = i._player.get360();
                        return i._arrowControls = !n || n.arrowControls, i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "_bindMethods",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_bindMethods", this).call(this), this._onLeftArrowUp = this._onLeftArrowUp.bind(this), this._onRightArrowUp = this._onRightArrowUp.bind(this), this._onDownArrowUp = this._onDownArrowUp.bind(this), this._onUpArrowUp = this._onUpArrowUp.bind(this)
                        }
                    }, {
                        key: "_addEventListeners",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_addEventListeners", this).call(this), this._keyboard.onUp(37, this._onLeftArrowUp), this._keyboard.onUp(39, this._onRightArrowUp), this._keyboard.onUp(38, this._onUpArrowUp), this._keyboard.onUp(40, this._onDownArrowUp)
                        }
                    }, {
                        key: "_removeEventListeners",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_removeEventListeners", this).call(this), this._keyboard.offUp(37, this._onLeftArrowUp), this._keyboard.offUp(39, this._onRightArrowUp), this._keyboard.offUp(38, this._onUpArrowUp), this._keyboard.offUp(40, this._onDownArrowUp)
                        }
                    }, {
                        key: "_onLeftArrowDown",
                        value: function (t) {
                            if (t.target.classList.contains("controls-progress-indicator")) return this._triggerKeyboardInteraction(), void r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_onLeftArrowDown", this).call(this, t);
                            this._arrowControls.leftArrowDown(t)
                        }
                    }, {
                        key: "_onRightArrowDown",
                        value: function (t) {
                            if (t.target.classList.contains("controls-progress-indicator")) return this._triggerKeyboardInteraction(), void r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_onRightArrowDown", this).call(this, t);
                            this._arrowControls.rightArrowDown(t)
                        }
                    }, {
                        key: "_onUpArrowDown",
                        value: function (t) {
                            if (t.target.classList.contains(s[0]) || t.target.classList.contains(s[1])) return this._triggerKeyboardInteraction(), void r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_onUpArrowDown", this).call(this, t);
                            t.originalEvent.preventDefault(), this._arrowControls.upArrowDown(t)
                        }
                    }, {
                        key: "_onDownArrowDown",
                        value: function (t) {
                            if (t.target.classList.contains(s[0]) || t.target.classList.contains(s[1])) return this._triggerKeyboardInteraction(), void r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_onDownArrowDown", this).call(this, t);
                            t.originalEvent.preventDefault(), this._arrowControls.downArrowDown(t)
                        }
                    }, {
                        key: "_onLeftArrowUp",
                        value: function (t) {
                            t.target.classList.contains("controls-progress-indicator") ? this._triggerKeyboardInteraction() : (t.originalEvent.preventDefault(), this._arrowControls.leftArrowUp(t))
                        }
                    }, {
                        key: "_onRightArrowUp",
                        value: function (t) {
                            t.target.classList.contains("controls-progress-indicator") ? this._triggerKeyboardInteraction() : (t.originalEvent.preventDefault(), this._arrowControls.rightArrowUp(t))
                        }
                    }, {
                        key: "_onUpArrowUp",
                        value: function (t) {
                            t.target.classList.contains("controls-progress-indicator") ? this._triggerKeyboardInteraction() : this._arrowControls.upArrowUp(t)
                        }
                    }, {
                        key: "_onDownArrowUp",
                        value: function (t) {
                            t.target.classList.contains("controls-progress-indicator") ? this._triggerKeyboardInteraction() : this._arrowControls.downArrowUp(t)
                        }
                    }, {
                        key: "_onKeyboardInteraction",
                        value: function (t) {}
                    }, {
                        key: "destroy",
                        value: function () {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this)
                        }
                    }]), e
                }();
            e.exports = a
        }, {
            "./KeyboardControl": 254
        }],
        256: [function (t, e, i) {
            "use strict";
            var n, r;
            e.exports = function (e) {
                return e.threesixty ? (n || (n = t("./ThreeSixtyKeyboardControl")), new n(e)) : (r || (r = t("./KeyboardControl")), new r(e))
            }
        }, {
            "./KeyboardControl": 254,
            "./ThreeSixtyKeyboardControl": 255
        }],
        257: [function (t, e, i) {
            "use strict";
            e.exports = {
                backthirtyseconds: "Back 30 Seconds",
                playpause: "Play/Pause",
                play: "Play",
                pause: "Pause",
                togglemutevolume: "Toggle Mute Volume",
                mutevolume: "Mute Volume",
                minvolume: "Minimum Volume",
                adjustvolume: "Adjust Volume",
                fastreverse: "Fast Reverse",
                fastforward: "Fast Forward",
                fullvolume: "Full Volume",
                fullscreen: "Full Screen",
                exitfullscreen: "Exit Full Screen",
                airplay: "AirPlay",
                captionscontrol: "Closed Captions",
                captionsturnedon: "Closed Captions On",
                captionsturnedoff: "Closed Captions Off",
                subtitlescontrol: "Subtitles",
                subtitlesturnedon: "Subtitles On",
                subtitlesturnedoff: "Subtitles Off",
                sizescontrol: "Video Size",
                downloadcontrol: "Download Video",
                share: "Share",
                small: "Small",
                medium: "Medium",
                large: "Large",
                hd: "HD",
                ipod: "iPod/iPhone",
                mb: "MB",
                gb: "GB",
                tb: "TB",
                downloadquicktimetitle: "Get QuickTime.",
                downloadquicktimetext: "Download QuickTime to view this video. QuickTime is free for Mac + PC.",
                downloadquicktimebutton: "Download",
                downloadquicktimeurl: "https://www.apple.com/quicktime/download/",
                elapsed: "elapsed",
                remaining: "remaining",
                currenttimetext: "{minutes} minutes and {seconds} seconds",
                pictureinpicture: "Picture-in-Picture",
                exitpictureinpicture: "Exit Picture-in-Picture",
                closesharing: "Close Sharing",
                facebookshare: "Share to Facebook",
                twittershare: "Share to Twitter",
                copylink: "Copy Link",
                copyembed: "Copy Embed Code",
                copyarea: "Copy Link Text Area",
                selectlink: "Select Link Text",
                selectembed: "Select Embed Code",
                close: "Close",
                dismisscopy: "Dismiss Copy",
                replay: "Replay",
                livestream: "Live Streaming",
                newwindow: "Opens in New Window",
                threesixtyicon: "Return 360 Point of View to Origin",
                threesixtyleft: "Move 360 Point of View Left",
                threesixtyright: "Move 360 Point of View Right",
                threesixtyup: "Move 360 Point of View Up",
                threesixtydown: "Move 360 Point of View Down",
                error: "The video could not be played.",
                jumptochapter: "Jump to chapter",
                chapter: "{chaptertitle} Chapter {chaptertime}",
                minutesandseconds: "{minutes} minutes and {seconds} seconds"
            }
        }, {}],
        258: [function (t, e, i) {
            "use strict";
            var n = t("./Translations"),
                r = t("./DefaultLabelStrings"),
                o = window.document.documentElement,
                s = void 0;
            try {
                s = window.top.document.documentElement
            } catch (t) {
                s = o
            }
            var a = t("@marcom/ac-ajax-xhr"),
                c = {},
                l = function (t) {
                    var e = void 0;
                    try {
                        e = t || s.getAttribute("lang")
                    } catch (t) {
                        e = o.getAttribute("lang")
                    }
                    var i = void 0;
                    if (e) switch (e.toLowerCase()) {
                        case "es-418":
                            i = "es-LA";
                            break;
                        case "pt":
                            i = "pt-BR";
                            break;
                        default:
                            i = e
                    } else i = "en-US";
                    return i
                },
                u = function (t) {
                    return t = l(t), void 0 !== c[t]
                };
            e.exports = {
                getLanguage: l,
                getTranslation: function (t) {
                    var e = l((t = t || {}).lang);
                    if (u(e)) return t.callback ? (t.callback(c[e]), null) : c[e];
                    if (!t.callback) throw new Error("To use Localization.getTranslation you must either pass a callback or ensure the translation is ready via Localization.translationReady");
                    var i = t.basePath || "/global/ac_media_player/scripts/ac_media_languages/",
                        o = n[e] ? i + n[e] : i + n["en-US"],
                        s = r,
                        h = function () {
                            c[e] = s, t.callback(s)
                        };
                    return a.get(o, {
                        success: function (i) {
                            try {
                                s = Object.assign(s, JSON.parse(i)), c[e] = s, t.callback(s)
                            } catch (t) {
                                h()
                            }
                        },
                        error: h
                    }), null
                },
                translationReady: u
            }
        }, {
            "./DefaultLabelStrings": 257,
            "./Translations": 259,
            "@marcom/ac-ajax-xhr": 32
        }],
        259: [function (t, e, i) {
            "use strict";
            e.exports = {
                "bg-BG": "bg-BG.json",
                "cs-CZ": "cs-CZ.json",
                "el-GR": "el-GR.json",
                "de-AT": "de-AT.json",
                "de-CH": "de-CH.json",
                "de-DE": "de-DE.json",
                "de-LI": "de-LI.json",
                "da-DK": "da-DK.json",
                en: "en.json",
                "en-US": "en-US.json",
                "en-AP": "en-AP.json",
                "en-CA": "en-CA.json",
                "en-GB": "en-GB.json",
                "en-HK": "en-HK.json",
                "en-IE": "en-IE.json",
                "en-IN": "en-IN.json",
                "en-KR": "en-KR.json",
                "en-AU": "en-AU.json",
                "en-NZ": "en-NZ.json",
                "en-SG": "en-SG.json",
                "en-ZA": "en-ZA.json",
                es: "es.json",
                "es-LA": "es-LA.json",
                "es-MX": "es-MX.json",
                "es-ES": "es-ES.json",
                "et-EE": "et-EE.json",
                "fi-FI": "fi-FI.json",
                fr: "fr.json",
                "fr-BE": "fr-BE.json",
                "fr-CA": "fr-CA.json",
                "fr-CH": "fr-CH.json",
                "fr-FR": "fr-FR.json",
                "hr-HR": "hr-HR.json",
                "hu-HU": "hu-HU.json",
                "it-IT": "it-IT.json",
                ja: "ja.json",
                "ja-JP": "ja-JP.json",
                "ko-KR": "ko-KR.json",
                "lt-LT": "lt-LT.json",
                "lv-LV": "lv-LV.json",
                "nl-BE": "nl-BE.json",
                "nl-NL": "nl-NL.json",
                "no-NO": "no-NO.json",
                "pl-PL": "pl-PL.json",
                pt: "pt.json",
                "pt-BR": "pt-BR.json",
                "pt-PT": "pt-PT.json",
                "ro-RO": "ro-RO.json",
                "ru-RU": "ru-RU.json",
                "sk-SK": "sk-SK.json",
                "sv-SE": "sv-SE.json",
                "tr-TR": "tr-TR.json",
                zh: "zh.json",
                "zh-CN": "zh-CN.json",
                "zh-HK": "zh-HK.json",
                "zh-TW": "zh-TW.json"
            }
        }, {}],
        260: [function (t, e, i) {
            "use strict";
            var n = t("./PopUp"),
                r = function (t) {
                    this.el = t.el, this._player = t.player, this._popUp = new n(t), this.el.appendChild(this._popUp.el)
                },
                o = r.prototype;
            o.setData = function (t) {
                this._popUp.setData(t)
            }, o.show = function () {
                this.el.classList.remove("hidden"), this._popUp.show()
            }, o.hide = function () {
                this.el.classList.add("hidden"), this._popUp.hide()
            }, o.setPopUpPosition = function (t) {
                this._popUp.setPopUpPosition(t)
            }, o.destroy = function () {
                this._popUp.destroy()
            }, e.exports = r
        }, {
            "./PopUp": 261
        }],
        261: [function (t, e, i) {
            "use strict";
            var n = t("../templates/overlays/trickplay-overlay.html"),
                r = t("../../utils/Time"),
                o = t("./ThumbnailHandler"),
                s = t("@marcom/function-utils/throttle"),
                a = function (t) {
                    this._player = t.player, this.el = document.createElement("div"), this.el.style.opacity = "0", this.el.innerHTML = n, this._thumbnailHandler = new o({
                        el: this.el.querySelector(".ac-video-trickplay-image"),
                        player: this._player,
                        numberOfImages: t.numberOfImages
                    }), this._timeLabel = this.el.querySelector(".ac-video-trickplay-time"), this._chapterLabel = this.el.querySelector(".ac-video-trickplay-chapter-title"), this._bindMethods(), this._addEventListeners()
                },
                c = a.prototype;
            c._initPointerTracking = function () {
                this._scrubberView = this._player.controls.scrubberView, this._scrubberView && (this._runnableTrack = this._scrubberView.el.querySelector(".ac-slider-runnable-track"), this._calcOffsets(), this._scrubberView.el.addEventListener("mouseover", this.show), this._scrubberView.el.addEventListener("mouseout", this.hide), this._scrubberView.el.addEventListener("focusin", this._onScrubberFocusIn), this._scrubberView.el.addEventListener("focusout", this._onScrubberFocusOut), this._scrubberView.el.addEventListener("mousedown", this._startScrubbing), this._scrubberView.el.addEventListener("mouseup", this._endScrubbing), this._scrubberView.el.addEventListener("mousemove", this._onTrackerUpdate), this._scrubberView.el.addEventListener("mousemove", this._setThumbnail), this._player.on("resize", this._throttledCalcOffsets), window.addEventListener("resize", this._throttledCalcOffsets))
            }, c._bindMethods = function () {
                this.show = this.show.bind(this), this.hide = this.hide.bind(this), this._onDurationChange = this._onDurationChange.bind(this), this._onLoadedMetaData = this._onLoadedMetaData.bind(this), this._startScrubbing = this._startScrubbing.bind(this), this._endScrubbing = this._endScrubbing.bind(this), this._initPointerTracking = this._initPointerTracking.bind(this), this._onTrackerUpdate = this._onTrackerUpdate.bind(this), this._setThumbnail = this._setThumbnail.bind(this), this._calcOffsets = this._calcOffsets.bind(this), this._onScrubberFocusIn = this._onScrubberFocusIn.bind(this), this._onScrubberFocusOut = this._onScrubberFocusOut.bind(this), this._throttledCalcOffsets = s(this._calcOffsets, 30)
            }, c._startScrubbing = function (t) {
                this._thumbnailHandler.el.classList.add("hidden"), this._scrubberView.el.removeEventListener("mousemove", this._setThumbnail), this._scrubberView.el.removeEventListener("mouseout", this.hide), document.addEventListener("mouseup", this._endScrubbing), document.addEventListener("mousemove", this._onTrackerUpdate)
            }, c._endScrubbing = function (t) {
                t.target === this._scrubberView.el && this.hide(), this._scrubberView.el.addEventListener("mousemove", this._setThumbnail), this._scrubberView.el.addEventListener("mouseout", this.hide), document.removeEventListener("mouseup", this._endScrubbing), document.removeEventListener("mousemove", this._onTrackerUpdate), this._setThumbnail(t), this._thumbnailHandler.el.classList.remove("hidden")
            }, c._calcOffsets = function () {
                this._onLoadedMetaData();
                var t = this._player.el.getBoundingClientRect();
                this._offsetLeft = t.left;
                var e = this._runnableTrack.getBoundingClientRect();
                this._leftBoundary = e.left - this._offsetLeft + 5, this._rightBoundary = this._leftBoundary + e.width - 5 - 2, this._imgWidth = this.el.firstElementChild.getBoundingClientRect().width
            }, c._onLoadedMetaData = function () {
                var t = this._player.getMediaElement().videoWidth,
                    e = this._player.getMediaElement().videoHeight,
                    i = -1 !== (this._player.getCurrentSrc() || "").indexOf("-tft-");
                this.el.classList.remove("square-video"), this.el.classList.remove("vertical-video"), this.el.classList.remove("tft-video"), i ? (this.el.classList.add("tft-video"), this._thumbnailHandler.setVertical(!1)) : t < e ? (this.el.classList.add("vertical-video"), this._thumbnailHandler.setVertical(!0)) : t === e ? (this.el.classList.add("square-video"), this._thumbnailHandler.setVertical(!1)) : this._thumbnailHandler.setVertical(!1)
            }, c._addEventListeners = function () {
                this._player.on("durationchange", this._onDurationChange), this._player.once("controlsready", this._initPointerTracking), this._player.on("loadedmetadata", this._calcOffsets)
            }, c._removeEventListeners = function () {
                this._player.off("durationchange", this._onDurationChange), this._player.off("controlsready", this._initPointerTracking), this._player.off("canplaythrough", this._canPlayThroughHander), this._player.off("playing", this._canPlayThroughHander), this._player.off("loadedmetadata", this._calcOffsets), this._player.off("resize", this._throttledCalcOffsets), window.removeEventListener("resize", this._throttledCalcOffsets), this._scrubberView.el.removeEventListener("mouseover", this.show), this._scrubberView.el.removeEventListener("mouseout", this.hide), this._scrubberView.el.removeEventListener("focusin", this._onScrubberFocusIn), this._scrubberView.el.removeEventListener("focusout", this._onScrubberFocusOut), this._scrubberView.el.removeEventListener("mouseout", this.hide), this._scrubberView.el.removeEventListener("mousemove", this._onTrackerUpdate), this._scrubberView.el.removeEventListener("mousemove", this._setThumbnail), document.removeEventListener("mouseup", this._endScrubbing), document.removeEventListener("mousemove", this._onTrackerUpdate)
            }, c._getDuration = function () {
                return this._cachedDuration && isNaN(this._cachedDuration) || (this._cachedDuration = this._player.getDuration()), this._cachedDuration
            }, c.setPopUpPosition = function (t) {
                this.show();
                var e = t / this._cachedDuration * (this._rightBoundary - this._leftBoundary) - this._imgWidth / 2,
                    i = this._leftBoundary + e;
                this.el.firstElementChild.style.left = i + "px", this._time = t, this._timeLabel.innerText = r.formatTime(t, this._getDuration()), this._refreshChapter(), this._setThumbnail()
            }, c._onScrubberFocusIn = function (t) {
                if (t.target.classList.contains("ac-slider-chapter-container")) {
                    this._calcOffsets();
                    var e = Array.from(t.target.parentElement.children).indexOf(t.target),
                        i = this._player.getChapters()[e]["start-time"];
                    this.setPopUpPosition(i), this.show()
                }
            }, c._onScrubberFocusOut = function (t) {
                this.hide()
            }, c._onTrackerUpdate = function (t) {
                this._calcOffsets();
                var e = Math.min(Math.max(t.clientX - this._offsetLeft, this._leftBoundary), this._rightBoundary);
                this.el.firstElementChild.style.left = e - this._imgWidth / 2 + "px";
                var i = this._scrubberView.getClientXValue(t);
                this._player.getReadyState() <= 2 ? this._cachedTrackerUpdate = t : this._cachedTrackerUpdate = null, this._setTimeFromPercentPosition(Math.max(i, 0))
            }, c._onDurationChange = function (t) {
                this._cachedDuration = this._player.getDuration(), this._cachedTrackerUpdate && (this._onTrackerUpdate(this._cachedTrackerUpdate), this._setThumbnail()), this.el.style.opacity = "1"
            }, c._setThumbnail = function (t) {
                this._thumbnailHandler.setTime(this._time, this._getDuration())
            }, c._setTimeFromPercentPosition = function (t) {
                var e = t / this._scrubberView.getMax();
                this._time = Math.min(e * this._getDuration(), this._getDuration());
                var i = r.formatTime(this._time, this._getDuration());
                this._timeLabel.innerText = i, this._refreshChapter()
            }, c._refreshChapter = function () {
                var t = this._player.getChapterForTime(this._time, 0);
                if (t && t.titles.length) {
                    var e = t.titles.find(function (t) {
                        return "en" === t.language
                    }) || t.titles[0];
                    this._chapterLabel.innerText = e.title, this._chapterLabel.classList.remove("hidden")
                } else this._chapterLabel.classList.add("hidden")
            }, c.setData = function (t) {
                this.el.style.opacity = "0", this._canPlayThroughHander && (this._player.off("canplaythrough", this._canPlayThroughHander), this._player.off("playing", this._canPlayThroughHander), this._canPlayThroughHander = null), t && this._player.getReadyState() > 2 ? (this.el.style.opacity = "1", this._thumbnailHandler.setData(t), this._cachedTrackerUpdate && (this._onTrackerUpdate(this._cachedTrackerUpdate), this._setThumbnail())) : (this._thumbnailHandler.setData(null), t ? (this._canPlayThroughHander = this.setData.bind(this, t), this._player.on("canplaythrough", this._canPlayThroughHander), this._player.on("playing", this._canPlayThroughHander)) : this.el.style.opacity = "1"), this._onLoadedMetaData()
            }, c.show = function (t) {
                t && this._onTrackerUpdate(t), this.el.firstElementChild.classList.remove("hidden")
            }, c.hide = function () {
                this.el.firstElementChild.classList.add("hidden")
            }, c.destroy = function () {
                this._canPlayThroughHander && (this._player.off("canplaythrough", this._canPlayThroughHander), this._player.off("playing", this._canPlayThroughHander)), this._removeEventListeners(), this._throttledCalcOffsets && this._throttledCalcOffsets.cancel(), this._scrubberView = null
            }, e.exports = a
        }, {
            "../../utils/Time": 272,
            "../templates/overlays/trickplay-overlay.html": 265,
            "./ThumbnailHandler": 262,
            "@marcom/function-utils/throttle": 302
        }],
        262: [function (t, e, i) {
            "use strict";
            var n = function (t) {
                    this.el = t.el, this._player = t.player, this._imgWidth = t.imgWidth || 144, this.el.style.backgroundSize = 100 * this._numberOfImages + "% 100%"
                },
                r = n.prototype;
            r.setVertical = function (t) {
                this._imgWidth = t ? 81 : 144
            }, r.getWidth = function () {
                return this._imgWidth
            }, r.setData = function (t) {
                if (!t) return this._imgUrl = null, void(this.el.style.backgroundImage = "");
                if (t.url !== this._imgUrl) {
                    this._imgUrl = t.url, this._numberOfImages = parseInt(t.numberOfImages || 120), this.el.style.backgroundSize = 100 * this._numberOfImages + "% 100%", this.el.style.backgroundImage = "", this.el.classList.add("hidden");
                    var e = this._loadImage(this._imgUrl).then(function () {
                        this._imageLoadPromise === e && (this.el.style.backgroundImage = 'url("' + this._imgUrl + '")', this._imageLoadPromise = null, this.el.classList.remove("hidden"))
                    }.bind(this));
                    this._imageLoadPromise = e
                }
            }, r._loadImage = function (t) {
                return new Promise(function (e, i) {
                    var n = new Image;
                    n.onload = function () {
                        e()
                    }, n.onerror = function () {
                        i()
                    }, n.src = t
                })
            }, r.setTime = function (t, e) {
                var i = t / e,
                    n = Math.min(Math.round(i * this._numberOfImages), this._numberOfImages - 1) / (this._numberOfImages - 1) * 100;
                this.el.style.backgroundPositionX = n + "%"
            }, r.destroy = function () {
                this._imageLoadPromise && this._imageLoadPromise.cancel()
            }, e.exports = n
        }, {}],
        263: [function (t, e, i) {
            "use strict";
            var n = t("../templates/states/SharingState.html"),
                r = t("../templates/states/IFrameEmbed.html"),
                o = t("@marcom/ac-console/log"),
                s = t("@marcom/ac-clipboard/select"),
                a = t("@marcom/ac-social").Dialog,
                c = t("@marcom/ac-string/supplant"),
                l = t("../localization/Localization"),
                u = t("@marcom/ac-accessibility/helpers/TabManager"),
                h = void 0;
            try {
                h = t("@marcom/ac-analytics-share/factory/create")
            } catch (t) {
                o("ac-analytics-share failed to load, are you sure you've included it?")
            }
            var d = t("@marcom/useragent-detect").os,
                p = d.ios || d.android,
                f = function (t) {
                    this.el || this._initializeElement(t.el, t.template), this._player = t.player, this._parentView = t.parentView, this._clickedShareButton = null, this._container = this.el.querySelector(".container"), this._sharingButtonContainer = this.el.querySelector(".sharing-button-container"), this._facebookButton = this.el.querySelector(".facebook-share"), this._twitterButton = this.el.querySelector(".twitter-share"), this._copyLinkButton = this.el.querySelector(".copy-link"), this._copyEmbedCodeButton = this.el.querySelector(".copy-embed-code"), this._copyTextArea = this.el.querySelector(".copy-area"), this._copyCloseButton = this.el.querySelector(".textinput-close-button"), this._closeButton = this.el.querySelector(".close-button"), !1 === t.analytics && (h = null), p && (this.el.firstChild.classList.add("mobile"), this._player.on("loadstart", function () {
                        this._getClientWidth() > 735 && this.el.firstChild.classList.add("mobile-large")
                    }.bind(this))), this._bindMethods(), this._addEventListeners(), this._syncSocialShareHidden()
                },
                m = f.prototype;
            m._initializeElement = function (t, e) {
                t ? this.el = t : (this.el = document.createElement("div"), this._templateData = l.getTranslation(), this.el.innerHTML = c((e || n).toString(), this._templateData))
            }, m.setData = function (t) {
                if (t) {
                    if (this._parentView.show(), t.allowEmbed && this.el.firstChild.classList.add("embed-enabled"), this._sharingUrl = t.originatorUrl || window.location.href, this._videoid = t.videoid, this._hideExtension = t.hideExtension, this._embedPath = t.embedpath || "https://www.apple.com/embed/", this._hideFacebook = t.hideFacebookShare || !1, this._hideTwitter = t.hideTwitterShare || !1, this._title = t.title || "Video Player", this._syncSocialShareHidden(), this._container.classList.remove("textarea-active"), h && !1 !== t.analytics && t.videoid) try {
                        this._initAnalyticsAttributes(t), this._analyticsObserver || (this._analyticsObserver = h({
                            context: this.el
                        }))
                    } catch (t) {
                        o("ac-analytics-share failed to load, are you sure you've included it?")
                    }
                } else this._parentView.hide()
            }, m._bindMethods = function () {
                this._doFacebookShare = this._doSocialShare.bind(this, a.FACEBOOK_SHARE), this._doTwitterShare = this._doSocialShare.bind(this, a.TWITTER_TWEET), this._copyUrl = this._copyUrl.bind(this), this._copyEmbedCode = this._copyEmbedCode.bind(this), this._closeCopyArea = this._showTextArea.bind(this, !1), this._closeState = this._closeState.bind(this)
            }, m._addEventListeners = function () {
                this._facebookButton && this._facebookButton.addEventListener("click", this._doFacebookShare), this._twitterButton && this._twitterButton.addEventListener("click", this._doTwitterShare), this._copyLinkButton && this._copyLinkButton.addEventListener("click", this._copyUrl), this._copyEmbedCodeButton && this._copyEmbedCodeButton.addEventListener("click", this._copyEmbedCode), this._copyCloseButton && this._copyCloseButton.addEventListener("click", this._closeCopyArea), this._closeButton && this._closeButton.addEventListener("click", this._closeState)
            }, m._removeEventListeners = function () {
                this._facebookButton && this._facebookButton.removeEventListener("click", this._doFacebookShare), this._twitterButton && this._twitterButton.removeEventListener("click", this._doTwitterShare), this._copyLinkButton && this._copyLinkButton.removeEventListener("click", this._copyUrl), this._copyEmbedCodeButton && this._copyEmbedCodeButton.removeEventListener("click", this._copyEmbedCode), this._copyCloseButton && this._copyCloseButton.removeEventListener("click", this._closeCopyArea), this._closeButton && this._closeButton.removeEventListener("click", this._closeState)
            }, m._syncSocialShareHidden = function () {
                this._facebookButton && (this._hideFacebook ? this._facebookButton.classList.add("hide-button") : this._facebookButton.classList.remove("hide-button")), this._twitterButton && (this._hideTwitter ? this._twitterButton.classList.add("hide-button") : this._twitterButton.classList.remove("hide-button"))
            }, m._doSocialShare = function (t) {
                this._clickedShareButton = null, this._copyLinkButton.classList.remove("active"), this._copyEmbedCodeButton.classList.remove("active"), this._showTextArea(!1), a.create(t, {
                    url: this._sharingUrl,
                    title: this._title
                })
            }, m._showTextArea = function (t) {
                t ? (this._container.classList.add("textarea-active"), s(this._copyTextArea), p || this._copyTextArea.setAttribute("readonly", "")) : (this._container.classList.remove("textarea-active"), this._copyLinkButton.classList.remove("active"), this._copyEmbedCodeButton.classList.remove("active"), this._copyTextArea.removeAttribute("readonly"), this._clickedShareButton && this._clickedShareButton.focus(), this._copyLinkButton.setAttribute("aria-label", this._templateData.copylink), this._copyEmbedCodeButton.setAttribute("aria-label", this._templateData.copyembed))
            }, m._copyUrl = function () {
                this._clearTextArea(), this._copyTextArea.value = this._sharingUrl, this._copyLinkButton.classList.add("active"), this._copyLinkButton.setAttribute("aria-label", this._templateData.selectlink), this._showTextArea(!0), this._clickedShareButton = this._copyLinkButton, this._copyTextArea.setAttribute("aria-label", this._templateData.copylink), s(this._copyTextArea)
            }, m._clearTextArea = function () {
                window.getSelection().removeAllRanges(), this._copyLinkButton.classList.remove("active"), this._copyEmbedCodeButton.classList.remove("active"), this._copyTextArea.removeAttribute("readonly")
            }, m._copyEmbedCode = function () {
                this._clearTextArea(), this._copyTextArea.value = c(r, {
                    videoid: this._videoid,
                    embedCodePath: this._embedPath,
                    width: this._player.getMediaWidth(),
                    height: this._player.getMediaHeight(),
                    title: this._title,
                    extension: this._hideExtension ? "" : ".html"
                }), this._copyEmbedCodeButton.classList.add("active"), this._copyEmbedCodeButton.setAttribute("aria-label", this._templateData.selectembed), this._showTextArea(!0), this._clickedShareButton = this._copyEmbedCodeButton, this._copyTextArea.setAttribute("aria-label", this._templateData.copyembed), s(this._copyTextArea)
            }, m._focusFirstButton = function () {
                this._firstButton || (this._firstButton = u.getTabbableElements(this._sharingButtonContainer)[0]), this._firstButton.focus()
            }, m.show = function () {
                this._container.classList.add("showing")
            }, m.hide = function () {
                this._clickedShareButton = null, this._showTextArea(!1), this._container.classList.remove("showing")
            }, m._getClientHeight = function () {
                return this.el.clientHeight
            }, m._getClientWidth = function () {
                return this.el.clientWidth
            }, m.destroy = function () {
                this._removeEventListeners()
            }, m._closeState = function () {
                this._showTextArea(!1), 0 === this._player.getCurrentTime() || this._player.getEnded() ? this._player.states.setState("initial") : this._player.states.setState("none")
            }, m._getAnalyticsSource = function () {
                return "drawer"
            }, m._initAnalyticsAttributes = function (t) {
                var e = [];
                this._facebookButton && e.push({
                    button: this._facebookButton,
                    title: "facebook",
                    events: "event85"
                }), this._twitterButton && e.push({
                    button: this._twitterButton,
                    title: "twitter",
                    events: "event84"
                }), this._copyLinkButton && e.push({
                    button: this._copyLinkButton,
                    title: "copy-link",
                    events: "event89"
                }), this._copyEmbedCodeButton && e.push({
                    button: this._copyEmbedCodeButton,
                    title: "copy-embed-code",
                    events: "event101"
                });
                var i = (-1 !== (t.url && t.url.indexOf(".m3u8")) ? "m3u8" : "mp4") + " via html5",
                    n = this._getAnalyticsSource(),
                    r = t.videoid,
                    o = document.head.querySelectorAll('meta[property="analytics-track"]');
                o = o ? o[0].getAttribute("content") : "", e.forEach(function (t) {
                    t.button.setAttribute("data-analytics-click", ""), t.button.setAttribute("data-analytics-share", JSON.stringify({
                        title: r,
                        events: t.events,
                        prop2: o + " - " + r + " - " + t.title,
                        prop18: i,
                        eVar49: document.referrer,
                        eVar54: document.location.href,
                        eVar55: o + " - " + r,
                        eVar70: n
                    }))
                }.bind(this))
            }, e.exports = f
        }, {
            "../localization/Localization": 258,
            "../templates/states/IFrameEmbed.html": 268,
            "../templates/states/SharingState.html": 269,
            "@marcom/ac-accessibility/helpers/TabManager": 24,
            "@marcom/ac-analytics-share/factory/create": 40,
            "@marcom/ac-clipboard/select": 47,
            "@marcom/ac-console/log": 50,
            "@marcom/ac-social": 172,
            "@marcom/ac-string/supplant": 192,
            "@marcom/useragent-detect": 306
        }],
        264: [function (t, e, i) {
            "use strict";
            e.exports = '\n<div class="controls-container" >\n\t<span id="acv-chapter-description" style="display:none">{jumptochapter}</span>\n\t<div class="{elementClassPrefix}-social-tray hidden"></div>\n\n\t<div class="center-button-container {elementClassPrefix}-play-pause-button-container">\n\t\t<div class="button-wrapper">\n\t\t\t<button type="button" class="ac-video-icon centered-button {elementClassPrefix}-play-pause-button {elementClassPrefix}-button no-autoplay" value="{playpause}" aria-label="{playpause}" role="button" tabindex="0" data-acv-active-area data-acv-draggable-area></button>\n\t\t</div>\n\t</div>\n\n\t<div class="main-controls-container">\n\t\t<div class="ac-video-overlay-container"></div>\n\t\t<div class="main-controls">\n\t\t\t<div class="button-wrapper">\n\t\t\t\t<div class="main-controls-item controls-volume">\n\t\t\t\t\t<button type="button" class="ac-video-icon {elementClassPrefix}-toggle-mute-volume-button {elementClassPrefix}-button" value="{togglemutevolume}" aria-label="{togglemutevolume}" role="button" tabindex="0" data-acv-active-area></button>\n\t\t\t\t\t<div class="{elementClassPrefix}-volume-level-indicator" tabindex="0" aria-valuemin="0" aria-valuemax="100" min="0" max="100" aria-label="{adjustvolume}" role="slider" aria-orientation="vertical" step="0.05" data-acv-active-area></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="button-wrapper">\n\t\t\t\t<button type="button" class="ac-video-icon main-controls-item {elementClassPrefix}-text-tracks-toggle-button {elementClassPrefix}-button no-text-tracks" value="{captionscontrol}" aria-label="{captionscontrol}" role="button" tabindex="0" data-acv-active-area></button>\n\t\t\t\t<div class="ac-video-captions-selector-container">\n\t\t\t\t\t<span class="ac-video-captions-selector-title">{subtitlescontrol}</span>\n\t\t\t\t\t<ul class="{elementClassPrefix}-captions-selector" role="radiogroup" aria-label="{subtitlescontrol}" data-acv-active-area></ul>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="main-controls-item controls-progress">\n\t\t\t\t<div class="controls-progress-time controls-progress-time-1">\n\t\t\t\t\t<div class="{elementClassPrefix}-elapsed-time-indicator" role="text" tabindex="-1">\n\t\t\t\t\t\t<span class="label">{elapsed}</span>\n\t\t\t\t\t\t<span class="{elementClassPrefix}-elapsed-time">00:00</span>\n\t\t\t\t\t\t<span class="{elementClassPrefix}-time-maxwidth" aria-hidden="true">44:44</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="controls-progress-bar">\n\t\t\t\t\t<div class="{elementClassPrefix}-buffered-indicator"></div>\n\t\t\t\t\t<div class="{elementClassPrefix}-progress-indicator ac-slider-inactive" aria-label="progress-indicator" role="slider" precision="float" min="0" max="1" step="0.0005" value="0" tabindex="0" aria-valuemax="1" aria-valuemin="0" aria-valuenow="{value}" data-acv-active-area></div>\n\t\t\t\t</div>\n\t\t\t\t<div class="controls-progress-time controls-progress-time-2">\n\t\t\t\t\t<div class="{elementClassPrefix}-remaining-time-indicator" role="text" tabindex="-1">\n\t\t\t\t\t\t<span class="label">{remaining}</span>\n\t\t\t\t\t\t<span class="{elementClassPrefix}-remaining-time">-00:00</span>\n\t\t\t\t\t\t<span class="{elementClassPrefix}-time-maxwidth" aria-hidden="true">-44:44</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="main-controls-item live-stream">\n\t\t\t\t<span class="live-stream-text">{livestream}</span>\n\t\t\t</div>\n\n\t\t\t<div class="button-wrapper">\n\t\t\t\t<button type="button" class="ac-video-icon main-controls-item {elementClassPrefix}-airplay-button {elementClassPrefix}-button airplay-unsupported" value="{airplay}" aria-label="{airplay}" role="button" tabindex="0" data-acv-active-area></button>\n\t\t\t</div>\n\n\t\t\t<div class="button-wrapper">\n\t\t\t\t<button type="button" class="ac-video-icon main-controls-item {elementClassPrefix}-picture-in-picture-button {elementClassPrefix}-button picture-in-picture-unsupported" value="{pictureinpicture}" aria-label="{pictureinpicture}" role="button" tabindex="0" data-acv-active-area></button>\n\t\t\t</div>\n\n\t\t\t<div class="button-wrapper">\n\t\t\t\t<button type="button" class="ac-video-icon main-controls-item {elementClassPrefix}-full-screen-button {elementClassPrefix}-button fullscreen-unsupported" value="{fullscreen}" aria-label="{fullscreen}" role="button" tabindex="0" data-acv-active-area></button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<div class="end-state-wrapper">\n\t\t<div class="end-state-container"></div>\n\t</div>\n\n\n</div>\n\n<div class="compass-wrapper" data-acv-active-area>\n\t<div class="compass-background ac-video-icon"></div>\n\t<div class="compass-arrows">\n\t\t<button class="compass-arrow-top ac-video-icon" aria-label="{threesixtyup}" role="button" tabindex="0"></button>\n\t\t<button class="compass-arrow-right ac-video-icon" aria-label="{threesixtyright}" role="button" tabindex="0"></button>\n\t\t<button class="compass-arrow-bottom ac-video-icon" aria-label="{threesixtydown}" role="button" tabindex="0"></button>\n\t\t<button class="compass-arrow-left ac-video-icon" aria-label="{threesixtyleft}" role="button" tabindex="0"></button>\n\t</div>\n\t<div class="compass-field ac-video-icon"></div>\n\t<div class="compass-ring ac-video-icon"></div>\n\t<button class="compass" aria-label="{threesixtyicon}" role="button" tabindex="0"></button>\n</div>\n'
        }, {}],
        265: [function (t, e, i) {
            "use strict";
            e.exports = '<div class="ac-video-trickplay hidden" aria-hidden="true">\n    <div class="ac-video-trickplay-image">\n    </div>\n    <div class="ac-video-trickplay-chapter-title"></div>\n    <div class="ac-video-trickplay-time"></div>\n</div>'
        }, {}],
        266: [function (t, e, i) {
            "use strict";
            e.exports = '\n<div class="ac-slider-ax-track" role="slider" aria-valuemin="0" aria-valuemax="1" ></div>\n<div class="ac-slider-runnable-track">\n\t<div class="ac-slider-hover-track">\n\t\t<div class="ac-slider-hover-notch"></div>\n\t</div>\n\t<div class="ac-slider-thumb">\n\t\t<div class="ac-slider-thumb-background-wrapper">\n\t\t\t<div class="ac-slider-thumb-overlay"></div>\n\t\t\t<div class="ac-slider-thumb-background"></div>\n\t\t</div>\n\t</div>\n\t<div class="ac-slider-chapters-track"></div>\n\t<div class="ac-slider-inner-track">\n\t\t<div class="ac-slider-scrubbed"></div>\n\t</div>\n</div>\n'
        }, {}],
        267: [function (t, e, i) {
            "use strict";
            e.exports = '<a class="end-state-link hidden"></a>'
        }, {}],
        268: [function (t, e, i) {
            "use strict";
            e.exports = '<iframe src="{embedCodePath}{videoid}{extension}" width="{width}" height="{height}" title="{title}" allowfullscreen></iframe>'
        }, {}],
        269: [function (t, e, i) {
            "use strict";
            e.exports = '<div class="sharing-state">\n    <div class="container" data-acv-active-area>\n        <div class="sharing-container">\n            <div class="sharing-button-container">\n                <button class="facebook-share ac-video-icon icon-share_fb" aria-label="{facebookshare}, {newwindow}"></button>\n                <button class="twitter-share ac-video-icon icon-share_twitter" aria-label="{twittershare}, {newwindow}"></button>\n                <button class="copy-link ac-video-icon icon-share_link" aria-label="{copylink}"></button>\n                <button class="copy-embed-code ac-video-icon icon-share_embed" aria-label="{copyembed}"></button>\n            </div>\n        </div>\n        <div class="textarea-container">\n            <span>\n                <input class="copy-area form-textbox form-textbox-text disabled" type="text" id="copy-link" aria-label="{copylink}"></input>\n                <button class="textinput-close-button ac-video-icon icon-share_close" aria-label="{dismisscopy}"></button>\n            </span>\n        </div>\n    </div>\n</div>'
        }, {}],
        270: [function (t, e, i) {
            "use strict";
            e.exports = '\n<div class="ac-slider-runnable-track">\n\t<div class="ac-slider-background"></div>\n\t<div class="ac-slider-thumb-wrapper">\n\t\t<div class="ac-slider-thumb">\n\t\t\t<div class="ac-slider-thumb-background-wrapper">\n\t\t\t\t<div class="ac-slider-thumb-background"></div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class="ac-slider-inner-track">\n\t\t<div class="ac-slider-scrubbed"></div>\n\t</div>\n</div>\n'
        }, {}],
        271: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-event-emitter-micro").EventEmitterMicro,
                r = function (t) {
                    n.call(this), this.el = t.el || document.body, this.breakpoints = t.breakpoints.sort(function (t, e) {
                        return t.minWidth - e.minWidth
                    }), this._player = t.player, this._breakPointsLength = this.breakpoints.length, this._addClasses = t.addClass, this._addEventListeners(), this._onResize()
                },
                o = n.prototype,
                s = r.prototype = Object.create(o);
            s.constructor = r, s._addEventListeners = function () {
                var t = this;
                this._boundOnResize = function () {
                    t._onResize.apply(t, arguments)
                }, window.addEventListener("resize", this._boundOnResize), window.addEventListener("orientationchange", this._boundOnResize), window.addEventListener("DOMContentLoaded", this._boundOnResize)
            }, s._removeEventListeners = function () {
                window.removeEventListener("resize", this._boundOnResize), window.removeEventListener("orientationchange", this._boundOnResize), window.addEventListener("DOMContentLoaded", this._boundOnResize)
            }, s._onResize = function (t) {
                var e = this.el.clientWidth,
                    i = this._currentBreakpoint;
                if (!1 !== t && this._player.refreshSize(), !i || !r.widthInBreakpoint(e, i)) {
                    var n = r.getBreakpointFromWidth(e, this.breakpoints, i, this._breakPointsLength);
                    this._addClasses && (this._currentBreakpoint && this.el.classList.remove(i.name), this.el.classList.add(n.name)), this._currentBreakpoint = n, this.trigger("breakpointchange", n)
                }
            }, s.getCurrentBreakpoint = function () {
                return this._currentBreakpoint
            }, s.refresh = function () {
                this._onResize(!1)
            }, s.destroy = function () {
                this._removeEventListeners(), o.destroy.call(this)
            }, r.getBreakpointFromElement = function (t, e) {
                return r.getBreakpointFromWidth(t.clientWidth, e)
            }, r.getBreakpointFromWidth = function (t, e, i, n) {
                for (var r = 0, o = n || e.length; r < o; r++) {
                    var s = e[r];
                    if (s !== i && (t >= s.minWidth && t <= s.maxWidth)) return s
                }
                return null
            }, r.widthInBreakpoint = function (t, e) {
                return t >= e.minWidth && t <= e.maxWidth
            }, e.exports = r
        }, {
            "@marcom/ac-event-emitter-micro": 88
        }],
        272: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-string/supplant"),
                r = {
                    addLeadingZero: function (t, e) {
                        if (e = e || 2, t < 10 || e > 2)
                            for (t = String(t); t.length < e;) t = "0" + t;
                        return t
                    },
                    formatTime: function (t, e, i) {
                        return isNaN(t) ? "00:00" : (t = this.splitTime(Math.floor(t), e, function (t) {
                            return this.addLeadingZero(t, i)
                        }.bind(this)), n(e >= 3600 ? "{PN}{hours}:{minutes}:{seconds}" : "{PN}{minutes}:{seconds}", {
                            PN: t.negativeModifier,
                            hours: t.hours,
                            minutes: t.minutes,
                            seconds: t.seconds
                        }))
                    },
                    splitTime: function (t, e, i) {
                        i = i || function (t) {
                            return t
                        };
                        var n = {
                            negativeModifier: "",
                            hours: 0,
                            minutes: 0,
                            seconds: 0
                        };
                        if (isNaN(t)) return n;
                        for (var r in n.negativeModifier = t < 0 ? "-" : "", t = Math.abs(t), n.hours = e >= 3600 ? Math.floor(t / 3600) : 0, n.minutes = n.hours ? Math.floor(t / 60 % 60) : Math.floor(t / 60), n.seconds = t % 60, n) "number" == typeof n[r] && "hours" !== r && (n[r] = i(n[r]));
                        return n
                    },
                    stringToNumber: function (t) {
                        for (var e = 0, i = t.split(":"); i.length;) 3 === i.length ? e += 3600 * parseFloat(i.shift()) : 2 === i.length ? e += 60 * parseFloat(i.shift()) : e += parseFloat(i.shift());
                        return e
                    }
                };
            e.exports = r
        }, {
            "@marcom/ac-string/supplant": 192
        }],
        273: [function (t, e, i) {
            "use strict";
            e.exports = t("../../../.versionfile")
        }, {
            "../../../.versionfile": 198
        }],
        274: [function (t, e, i) {
            "use strict";
            var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                    return typeof t
                } : function (t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                },
                r = t("@marcom/ac-object/clone");
            e.exports = function t() {
                var e = Array.prototype.slice.call(arguments);
                if (e.length < 2) return r(e[0]);
                var i = r(e.shift(), !0),
                    o = e.shift();
                for (var s in o) o.hasOwnProperty(s) && (i.hasOwnProperty(s) && "object" === n(i[s]) ? "object" === n(i[s]) && "object" === n(o[s]) && (i[s] = t(i[s], o[s])) : i[s] = o[s]);
                return e.length ? t.apply(null, [i].concat(e)) : i
            }
        }, {
            "@marcom/ac-object/clone": 122
        }],
        275: [function (t, e, i) {
            "use strict";
            e.exports = [{
                width: 384,
                height: 160,
                type: "baseline-high",
                suffix: "h"
            }, {
                width: 384,
                height: 160,
                type: "small",
                suffix: "h"
            }, {
                width: 384,
                height: 160,
                type: "baseline-low",
                suffix: "l"
            }, {
                width: 384,
                height: 160,
                type: "baseline-medium",
                suffix: "m"
            }, {
                width: 480,
                height: 200,
                type: "medium",
                suffix: "h"
            }, {
                width: 768,
                height: 320,
                type: "large",
                suffix: ""
            }, {
                width: 960,
                height: 400,
                type: "large",
                suffix: ""
            }, {
                width: 1536,
                height: 640,
                type: "large",
                suffix: "h"
            }, {
                width: 1536,
                height: 640,
                type: "large",
                suffix: "l"
            }, {
                width: 1920,
                height: 800,
                type: "large",
                suffix: "l"
            }, {
                width: 1920,
                height: 800,
                type: "large",
                suffix: "h"
            }]
        }, {}],
        276: [function (t, e, i) {
            "use strict";
            e.exports = [{
                width: 416,
                height: 234,
                type: "baseline-high",
                suffix: "h"
            }, {
                width: 416,
                height: 234,
                type: "small",
                suffix: "h"
            }, {
                width: 416,
                height: 234,
                type: "baseline-low",
                suffix: "l"
            }, {
                width: 416,
                height: 234,
                type: "baseline-medium",
                suffix: "m"
            }, {
                width: 640,
                height: 360,
                type: "medium",
                suffix: "h"
            }, {
                width: 848,
                height: 480,
                type: "large",
                suffix: ""
            }, {
                width: 960,
                height: 540,
                type: "large",
                suffix: ""
            }, {
                width: 1280,
                height: 720,
                type: "large",
                suffix: "h"
            }, {
                width: 1280,
                height: 720,
                type: "large",
                suffix: "l"
            }, {
                width: 1920,
                height: 1080,
                type: "large",
                suffix: "l"
            }, {
                width: 1920,
                height: 1080,
                type: "large",
                suffix: "h"
            }]
        }, {}],
        277: [function (t, e, i) {
            "use strict";
            e.exports = [{
                width: 528,
                height: 244,
                type: "baseline-high",
                suffix: "h"
            }, {
                width: 528,
                height: 244,
                type: "small",
                suffix: "h"
            }, {
                width: 528,
                height: 244,
                type: "baseline-low",
                suffix: "l"
            }, {
                width: 528,
                height: 244,
                type: "baseline-medium",
                suffix: "m"
            }, {
                width: 812,
                height: 375,
                type: "medium",
                suffix: "h"
            }, {
                width: 1082,
                height: 500,
                type: "large",
                suffix: ""
            }, {
                width: 1218,
                height: 563,
                type: "large",
                suffix: ""
            }, {
                width: 1624,
                height: 750,
                type: "large",
                suffix: "h"
            }, {
                width: 1624,
                height: 750,
                type: "large",
                suffix: "l"
            }, {
                width: 2436,
                height: 1126,
                type: "large",
                suffix: "l"
            }, {
                width: 2436,
                height: 1126,
                type: "large",
                suffix: "h"
            }]
        }, {}],
        278: [function (t, e, i) {
            "use strict";
            e.exports = [{
                width: 360,
                height: 360,
                type: "baseline-high",
                suffix: "h"
            }, {
                width: 360,
                height: 360,
                type: "small",
                suffix: "h"
            }, {
                width: 360,
                height: 360,
                type: "baseline-low",
                suffix: "l"
            }, {
                width: 480,
                height: 480,
                type: "medium",
                suffix: ""
            }, {
                width: 540,
                height: 540,
                type: "medium",
                suffix: ""
            }, {
                width: 720,
                height: 720,
                type: "large",
                suffix: "h"
            }, {
                width: 720,
                height: 720,
                type: "large",
                suffix: "l"
            }, {
                width: 1080,
                height: 1080,
                type: "large",
                suffix: "l"
            }, {
                width: 1080,
                height: 1080,
                type: "large",
                suffix: "h"
            }]
        }, {}],
        279: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-string/supplant"),
                r = /_r[0-9].+\.mov$/,
                o = /_[0-9]+x[0-9].+\.mp4$/,
                s = /_[0-9]+x[0-9].+\.(mp4|m3u8)/,
                a = /_([0-9]+)x([0-9]+)/,
                c = /-tpl-.*-/,
                l = /-cc-[a-z].*-/,
                u = /-tft-.*-/,
                h = t("./1X1AssetSizes"),
                d = t("./16X9AssetSizes"),
                p = t("./12X5AssetSizes"),
                f = t("./19X9AssetSizes"),
                m = function (t, e) {
                    return t.find(function (t) {
                        return t.width === e.width && (t.height = e.height) || t.width === e.height && (t.height = e.width)
                    })
                };
            e.exports = {
                getVideoSource: function (t, e, i, s) {
                    var c, l;
                    a.test(t);
                    var _, v = {};
                    if (v.width = parseInt(RegExp.$1, 10), v.height = parseInt(RegExp.$2, 10), t.match(u)) c = p, l = 1536;
                    else if (v.width === v.height) c = h, l = 1080;
                    else if (t.match(r) || m(d, v)) c = d, l = 1280;
                    else {
                        if (!m(f, v)) return t;
                        c = f, l = 1624
                    }
                    v.width < v.height && (_ = !0);
                    var y, b = c[0].width,
                        g = s && s.maxWidth ? Math.max(s.maxWidth, b) : l;
                    if (!t) throw "Must provide an url to optimize";
                    if (void 0 === e || isNaN(e)) throw "Must provide a width";
                    0 === e && (e = v.width), i && (c = c.filter(function (t) {
                        return t.type === i
                    })), g < 1920 && (c = c.filter(function (t) {
                        return t.width <= g
                    })), y = _ ? c.reduce(function (t, i) {
                        return Math.abs(i.height - e) < Math.abs(t.height - e) ? i : t
                    }) : c.reduce(function (t, i) {
                        return Math.abs(i.width - e) < Math.abs(t.width - e) ? i : t
                    });
                    var w = "_{width}x{height}{suffix}.mp4";
                    return _ && (w = "_{height}x{width}{suffix}.mp4"), t.match(o) ? t.replace(o, n(w, y)) : t.match(r) ? t.replace(r, n(w, y)) : t
                },
                getCaptionsSource: function (t) {
                    return t.match(l) ? t.match(o) ? {
                        src: t.replace(o, "_cc.vtt"),
                        srclang: "en"
                    } : t.match(r) ? {
                        src: t.replace(r, "_cc.vtt"),
                        srclang: "en"
                    } : null : null
                },
                getThumbnailImageSource: function (t) {
                    return t.match(c) ? {
                        url: t.replace(s, "_thumbnails.jpg")
                    } : null
                }
            }
        }, {
            "./12X5AssetSizes": 275,
            "./16X9AssetSizes": 276,
            "./19X9AssetSizes": 277,
            "./1X1AssetSizes": 278,
            "@marcom/ac-string/supplant": 192
        }],
        280: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = window.Hls,
                s = t("@marcom/ac-console/log"),
                a = t("./HTML5Video"),
                c = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return i._src = null, i._initialize(t), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, a), n(e, [{
                        key: "_initialize",
                        value: function (t) {
                            if (void 0 === window.Hls) throw new Error("Hls.js should be included on the page in a script tag");
                            this._debugHls = t.debugHls, this._enablePerformanceLogging = t.enablePerformanceLogging, this._onTextTrackChangeAfterLoad = this._onTextTrackChangeAfterLoad.bind(this), this._onHlsError = this._onHlsError.bind(this), this._onDesiredRateChanged = this._onDesiredRateChanged.bind(this), this._onPlay = this._onPlay.bind(this), this.on("play", this._onPlay)
                        }
                    }, {
                        key: "load",
                        value: function (t, e) {
                            if (this._hls) {
                                this.getTextTracksEventEmitter().off("addtrack", this._onTextTrackChangeAfterLoad), this._cachedVisibleTracks = Array.from(this.el.textTracks).filter(function (t) {
                                    return "showing" === t.mode
                                }), this._hls.off(o.Events.ERROR, this._onHlsError), this._hls.off(o.Events.DESIRED_RATE_CHANGED, this._onDesiredRateChanged), this._hls.destroy();
                                var i = this.el.cloneNode(!1);
                                this.el.parentElement.replaceChild(i, this.el), this.el = i, this.replaceElement(i);
                                var n = this.getTextTracksEventEmitter();
                                n.replaceElement(this.el.textTracks), n.on("addtrack", this._onTextTrackChangeAfterLoad)
                            }
                            this._hls = new o({
                                debug: this._debugHls,
                                enableWorker: !0,
                                enableStreaming: !0,
                                autoRecoverError: !0,
                                enablePerformanceLogging: this._enablePerformanceLogging || !1
                            }), this._hls.on(o.Events.ERROR, this._onHlsError), this._hls.on(o.Events.DESIRED_RATE_CHANGED, this._onDesiredRateChanged), this._src = t[0];
                            var r = function () {
                                this._hls.off(o.Events.MEDIA_ATTACHED, r), this.setSrc(t[0]), this._createTextTrackTags(e)
                            }.bind(this);
                            this._hls.on(o.Events.MEDIA_ATTACHED, r), this._hls.attachMedia(this.el)
                        }
                    }, {
                        key: "setSrc",
                        value: function (t) {
                            this._src = t, this._manifestParsed = !1, this._hls.loadSource(t, {
                                appData: {}
                            }), this._hls.on(o.Events.MANIFEST_PARSED, this._boundManifestParsed = function () {
                                this._manifestParsed = !0, this._hls.off(o.Events.MANIFEST_PARSED, this._boundManifestParsed), this._shouldPlay && this.play()
                            }.bind(this))
                        }
                    }, {
                        key: "getCurrentSrc",
                        value: function () {
                            return this._src
                        }
                    }, {
                        key: "canPlayType",
                        value: function (t) {
                            return "vnd.apple.mpegURL" === t ? r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "canPlayType", this).call(this, "video/mp4") : r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "canPlayType", this).call(this, t)
                        }
                    }, {
                        key: "_playPromiseRejected",
                        value: function () {
                            void 0 !== this._hls.desiredRate && (this._hls.desiredRate = 0), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "_playPromiseRejected", this).call(this)
                        }
                    }, {
                        key: "_onTextTrackChangeAfterLoad",
                        value: function () {
                            var t = this;
                            this._cachedVisibleTracks && this.el.textTracks.length > 1 && (this._cachedVisibleTracks.forEach(function (e) {
                                var i = Array.from(t.el.textTracks).find(function (t) {
                                    return e.language === t.language
                                });
                                i && (i.mode = "showing")
                            }), this.getTextTracksEventEmitter().off("addtrack", this._onTextTrackChangeAfterLoad), this._cachedVisibleTracks = null)
                        }
                    }, {
                        key: "_onPlay",
                        value: function () {
                            this._hls && 0 === this._hls.desiredRate && (this._hls.desiredRate = 1)
                        }
                    }, {
                        key: "getError",
                        value: function () {
                            return this.el.error || this._error
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this.off("play", this._onPlay), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroy", this).call(this), this._hls && (this._hls.destroy(), this._hls = null)
                        }
                    }, {
                        key: "_onHlsError",
                        value: function (t, e) {
                            !0 === e.fatal && ("fragLoadError" === e.details ? s("HLS JS threw a fatal fragLoadError error, but we'll try to let it recover because it probably can if the network/stream recovers") : (this._error = e.type, this.trigger("error", e)))
                        }
                    }, {
                        key: "_onDesiredRateChanged",
                        value: function (t) {
                            0 === this._hls.desiredRate ? this.trigger("pause") : this.trigger("play")
                        }
                    }, {
                        key: "play",
                        value: function () {
                            this._shouldPlay = !0, this._manifestParsed && r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "play", this).call(this)
                        }
                    }, {
                        key: "pause",
                        value: function () {
                            this._shouldPlay = !1, r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "pause", this).call(this)
                        }
                    }, {
                        key: "getPaused",
                        value: function () {
                            return this._hls && void 0 !== this._hls.desiredRate ? 0 === this._hls.desiredRate : r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "getPaused", this).call(this)
                        }
                    }]), e
                }();
            e.exports = c
        }, {
            "./HTML5Video": 281,
            "@marcom/ac-console/log": 50
        }],
        281: [function (t, e, i) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function (e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }();
            var r = t("../dom-emitter/DOMEmitterMicro"),
                o = t("../texttracks/createTextTracks"),
                s = t("@marcom/ac-console/log"),
                a = window.document,
                c = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = t && t.mediaElement ? t.mediaElement : a.createElement("video"),
                            n = function (t, e) {
                                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return !e || "object" != typeof e && "function" != typeof e ? t : e
                            }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, i));
                        return n.el = i, n.options = t || {}, n._textTracks = o(t), n._initElement(), n._forwardCaptionEvent = n._forwardCaptionEvent.bind(n), n._textTracksEmitter = n.getTextTracksEventEmitter(), n._textTracksEmitter.on("addtrack", n._forwardCaptionEvent), n._textTracksEmitter.on("change", n._forwardCaptionEvent), n._textTracksEmitter.on("removetrack", n._forwardCaptionEvent), n
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, r), n(e, [{
                        key: "_initElement",
                        value: function () {
                            this.el.classList.add("ac-video-media-controller"), null !== this.options.crossorigin && this.el.setAttribute("crossorigin", this.options.crossorigin ? this.options.crossorigin : "anonymous"), this.el.setAttribute("preload", this.options.preload || "auto"), this.el.setAttribute("x-webkit-airplay", "")
                        }
                    }, {
                        key: "_forwardCaptionEvent",
                        value: function (t) {
                            this.trigger(t.type)
                        }
                    }, {
                        key: "load",
                        value: function (t, e, i) {
                            i && (t = t.map(function (t) {
                                return t + "#t=" + i
                            })), this._createSourceTags(t), this._createTextTrackTags(e), this.el.load()
                        }
                    }, {
                        key: "_createSourceTags",
                        value: function (t) {
                            this.el.removeAttribute("src"), this.el.innerHTML = "";
                            var e = 0,
                                i = t.length;
                            for (i && this.el.setAttribute("src", t[0]); e < i; e++) {
                                var n = a.createElement("source");
                                n.src = t[e], this.el.appendChild(n)
                            }
                        }
                    }, {
                        key: "_playPromiseRejected",
                        value: function () {
                            this.trigger("PlayPromiseError")
                        }
                    }, {
                        key: "play",
                        value: function () {
                            try {
                                var t = this.el.play();
                                t && "function" == typeof t.catch && (t.catch(function (e) {
                                    this._playPromise === t && this._playPromiseRejected()
                                }.bind(this)), t.then(function () {
                                    this.trigger("PlayPromiseResolved")
                                }.bind(this), function (t) {
                                    s(t)
                                })), this._playPromise = t
                            } catch (t) {
                                s(t)
                            }
                        }
                    }, {
                        key: "refreshSize",
                        value: function () {}
                    }, {
                        key: "pause",
                        value: function () {
                            this._playPromise = null, this.el.pause()
                        }
                    }, {
                        key: "addTextTrack",
                        value: function (t) {
                            this._addTextTrackTag(t)
                        }
                    }, {
                        key: "removeTextTrack",
                        value: function (t) {
                            this._removeTextTrackTag(t)
                        }
                    }, {
                        key: "getRenderElement",
                        value: function () {
                            return this.getMediaElement()
                        }
                    }, {
                        key: "getMediaElement",
                        value: function () {
                            return this.el
                        }
                    }, {
                        key: "_createTextTrackTags",
                        value: function () {
                            return this._textTracks.create.apply(this, arguments)
                        }
                    }, {
                        key: "_addTextTrackTag",
                        value: function () {
                            return this._textTracks.add.apply(this, arguments)
                        }
                    }, {
                        key: "_removeTextTrackTag",
                        value: function () {
                            return this._textTracks.remove.apply(this, arguments)
                        }
                    }, {
                        key: "getTextTracks",
                        value: function () {
                            return this._textTracks.get.apply(this, arguments)
                        }
                    }, {
                        key: "getTextTracksEventEmitter",
                        value: function () {
                            return this._textTracks.getEmitter.apply(this, arguments)
                        }
                    }, {
                        key: "getReadyState",
                        value: function () {
                            return this.el.readyState
                        }
                    }, {
                        key: "getPreload",
                        value: function () {
                            return this.el.preload
                        }
                    }, {
                        key: "setPreload",
                        value: function (t) {
                            return this.el.preload = t
                        }
                    }, {
                        key: "setPoster",
                        value: function (t) {
                            t ? this.el.poster = t : this.el.removeAttribute("poster")
                        }
                    }, {
                        key: "getVolume",
                        value: function () {
                            return this.el.volume
                        }
                    }, {
                        key: "getMuted",
                        value: function () {
                            return this.el.muted
                        }
                    }, {
                        key: "getPaused",
                        value: function () {
                            return this.el.paused
                        }
                    }, {
                        key: "getCurrentTime",
                        value: function () {
                            return this.el.currentTime
                        }
                    }, {
                        key: "getDuration",
                        value: function () {
                            return this.el.duration
                        }
                    }, {
                        key: "setCurrentTime",
                        value: function (t) {
                            return this.el.currentTime = t
                        }
                    }, {
                        key: "setVolume",
                        value: function (t) {
                            return this.el.volume = t
                        }
                    }, {
                        key: "setMuted",
                        value: function (t) {
                            this.el.muted = t
                        }
                    }, {
                        key: "getEnded",
                        value: function () {
                            return this.el.ended
                        }
                    }, {
                        key: "getError",
                        value: function () {
                            return this.el.error
                        }
                    }, {
                        key: "setSrc",
                        value: function (t) {
                            this.el.childNodes.length && t === this._getSrcNode().url || this._createSourceTags([t])
                        }
                    }, {
                        key: "advanceLiveStream",
                        value: function () {}
                    }, {
                        key: "getCurrentSrc",
                        value: function () {
                            return this.el.src
                        }
                    }, {
                        key: "_getSrcNode",
                        value: function () {
                            return this.el.childNodes[0]
                        }
                    }, {
                        key: "setControls",
                        value: function (t) {
                            t ? (this.el.setAttribute("controls", ""), this.el.removeAttribute("aria-hidden")) : (this.el.removeAttribute("controls"), this.el.setAttribute("aria-hidden", "true"))
                        }
                    }, {
                        key: "isFullscreen",
                        value: function () {
                            return this.el.webkitDisplayingFullscreen
                        }
                    }, {
                        key: "supportsPictureInPicture",
                        value: function () {
                            return "function" == typeof this.el.webkitSetPresentationMode
                        }
                    }, {
                        key: "isPictureInPicture",
                        value: function () {
                            return "picture-in-picture" === this.el.webkitPresentationMode
                        }
                    }, {
                        key: "setPictureInPicture",
                        value: function (t) {
                            this.supportsPictureInPicture() && this.el.webkitSetPresentationMode(t ? "picture-in-picture" : "inline")
                        }
                    }, {
                        key: "supportsAirPlay",
                        value: function () {
                            return !!window.WebKitPlaybackTargetAvailabilityEvent
                        }
                    }, {
                        key: "canPlayType",
                        value: function (t) {
                            return this.el.canPlayType(t)
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            this._textTracksEmitter && (this._textTracksEmitter.off("addtrack", this._forwardCaptionEvent), this._textTracksEmitter.off("change", this._forwardCaptionEvent), this._textTracksEmitter.off("removetrack", this._forwardCaptionEvent)), this._textTracks && this._textTracks.destroy.call(this), this._textTracks = null, this._textTracksEmitter = null, this.el = null
                        }
                    }]), e
                }();
            e.exports = c
        }, {
            "../dom-emitter/DOMEmitterMicro": 200,
            "../texttracks/createTextTracks": 215,
            "@marcom/ac-console/log": 50
        }],
        282: [function (t, e, i) {
            "use strict";
            var n = function () {
                    function t(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                        }
                    }
                    return function (e, i, n) {
                        return i && t(e.prototype, i), n && t(e, n), e
                    }
                }(),
                r = function t(e, i, n) {
                    null === e && (e = Function.prototype);
                    var r = Object.getOwnPropertyDescriptor(e, i);
                    if (void 0 === r) {
                        var o = Object.getPrototypeOf(e);
                        return null === o ? void 0 : t(o, i, n)
                    }
                    if ("value" in r) return r.value;
                    var s = r.get;
                    return void 0 !== s ? s.call(n) : void 0
                };
            var o = t("./HTML5Video"),
                s = t("@marcom/ac-360"),
                a = function (t) {
                    function e(t) {
                        ! function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, e);
                        var i = function (t, e) {
                            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !e || "object" != typeof e && "function" != typeof e ? t : e
                        }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                        return i._renderElement = document.createElement("div"), i._renderElement.classList.add("threesixty-video-container"), i.el.style.visibility = "hidden", i.el.style.opacity = 0, i._renderElement.appendChild(i.el), i._ac360 = new s({
                            el: i._renderElement,
                            src: i.getMediaElement()
                        }), i._ac360.on("error", function () {
                            this._error = "360_ERROR", this.trigger("error")
                        }.bind(i)), i.sendMouseDown = i.sendMouseDown.bind(i), i
                    }
                    return function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }(e, o), n(e, [{
                        key: "load",
                        value: function () {
                            this._ac360.setPos(0, 0), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "load", this).apply(this, arguments)
                        }
                    }, {
                        key: "play",
                        value: function () {
                            this.getEnded() && this._ac360.setPos(0, 0), r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "play", this).call(this)
                        }
                    }, {
                        key: "sendMouseDown",
                        value: function (t) {
                            this._ac360.sendMouseDown(t)
                        }
                    }, {
                        key: "getRenderElement",
                        value: function () {
                            return this._renderElement
                        }
                    }, {
                        key: "get360",
                        value: function () {
                            return this._ac360
                        }
                    }, {
                        key: "setControls",
                        value: function (t) {
                            r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "setControls", this).call(this, !1)
                        }
                    }, {
                        key: "supportsPictureInPicture",
                        value: function () {
                            return !1
                        }
                    }, {
                        key: "supportsAirPlay",
                        value: function () {
                            return !1
                        }
                    }, {
                        key: "refreshSize",
                        value: function () {
                            this._ac360.refreshSize()
                        }
                    }, {
                        key: "getError",
                        value: function () {
                            return this._error || r(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "getError", this).call(this)
                        }
                    }]), e
                }();
            e.exports = a
        }, {
            "./HTML5Video": 281,
            "@marcom/ac-360": 12
        }],
        283: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/useragent-detect"),
                r = n.browser.safari || n.browser.edge,
                o = "MediaSource" in window,
                s = function () {};
            s.prototype.create = function (e, i) {
                return e.hls && !r && o ? new(t("./HLSVideo"))(Object.assign({}, e, {
                    parentElement: i
                })) : e.threesixty ? new(t("./ThreeSixtyVideo"))(Object.assign({}, e, {
                    parentElement: i
                })) : new(t("./HTML5Video"))(Object.assign({}, e, {
                    parentElement: i
                }))
            }, e.exports = Object.create(s.prototype)
        }, {
            "./HLSVideo": 280,
            "./HTML5Video": 281,
            "./ThreeSixtyVideo": 282,
            "@marcom/useragent-detect": 306
        }],
        284: [function (t, e, i) {
            "use strict";
            e.exports = {
                getContentDimensions: t("./getContentDimensions"),
                getDimensions: t("./getDimensions"),
                getMaxScrollPosition: t("./getMaxScrollPosition"),
                getPagePosition: t("./getPagePosition"),
                getPercentInViewport: t("./getPercentInViewport"),
                getPixelsInViewport: t("./getPixelsInViewport"),
                getPosition: t("./getPosition"),
                getScrollPosition: t("./getScrollPosition"),
                getViewportPosition: t("./getViewportPosition"),
                isInViewport: t("./isInViewport")
            }
        }, {
            "./getContentDimensions": 285,
            "./getDimensions": 286,
            "./getMaxScrollPosition": 287,
            "./getPagePosition": 288,
            "./getPercentInViewport": 289,
            "./getPixelsInViewport": 290,
            "./getPosition": 291,
            "./getScrollPosition": 292,
            "./getViewportPosition": 293,
            "./isInViewport": 294
        }],
        285: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e) {
                var i = 1;
                return e && (i = t.getBoundingClientRect().width / t.offsetWidth), {
                    width: t.scrollWidth * i,
                    height: t.scrollHeight * i
                }
            }
        }, {}],
        286: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e) {
                var i;
                return e ? {
                    width: (i = t.getBoundingClientRect()).width,
                    height: i.height
                } : {
                    width: t.offsetWidth,
                    height: t.offsetHeight
                }
            }
        }, {}],
        287: [function (t, e, i) {
            "use strict";

            function n(t, e) {
                return "x" === e ? t.scrollWidth - t.clientWidth : t.scrollHeight - t.clientHeight
            }
            e.exports = function (t, e) {
                var i = typeof t;
                return e = "string" === i ? t : e, t = t && "string" !== i && t !== window ? t : document.documentElement, e && /^[xy]$/i.test(e) ? n(t, e) : {
                    x: n(t, "x"),
                    y: n(t, "y")
                }
            }
        }, {}],
        288: [function (t, e, i) {
            "use strict";
            var n = t("./getDimensions"),
                r = t("./getScrollPosition");
            e.exports = function (t, e) {
                var i;
                if (e) {
                    var o = r(),
                        s = t.getBoundingClientRect();
                    i = {
                        top: s.top + o.y,
                        right: s.right + o.x,
                        bottom: s.bottom + o.y,
                        left: s.left + o.x
                    }
                } else {
                    var a = n(t);
                    for (i = {
                            top: t.offsetTop,
                            right: a.width,
                            bottom: a.height,
                            left: t.offsetLeft
                        }; t = t.offsetParent;) i.top += t.offsetTop, i.left += t.offsetLeft;
                    i.right += i.left, i.bottom += i.top
                }
                var c = document.documentElement.offsetTop,
                    l = document.documentElement.offsetLeft;
                return {
                    top: i.top + c,
                    right: i.right + l,
                    bottom: i.bottom + c,
                    left: i.left + l
                }
            }
        }, {
            "./getDimensions": 286,
            "./getScrollPosition": 292
        }],
        289: [function (t, e, i) {
            "use strict";
            var n = t("./getDimensions"),
                r = t("./getPixelsInViewport");
            e.exports = function (t, e) {
                var i = r(t, e),
                    o = n(t, e);
                return {
                    x: i.x / o.width,
                    y: i.y / o.height
                }
            }
        }, {
            "./getDimensions": 286,
            "./getPixelsInViewport": 290
        }],
        290: [function (t, e, i) {
            "use strict";
            var n = t("./getViewportPosition");
            e.exports = function (t, e) {
                var i = window.innerWidth,
                    r = window.innerHeight,
                    o = n(t, e),
                    s = {
                        x: o.right - o.left,
                        y: o.bottom - o.top
                    };
                return o.top < 0 && (s.y += o.top), o.bottom > r && (s.y -= o.bottom - r), o.left < 0 && (s.x += o.left), o.right > i && (s.x -= o.right - i), s.x = s.x < 0 ? 0 : s.x, s.y = s.y < 0 ? 0 : s.y, s
            }
        }, {
            "./getViewportPosition": 293
        }],
        291: [function (t, e, i) {
            "use strict";
            var n = t("./getDimensions");
            e.exports = function (t, e) {
                var i, r, o, s, a, c, l;
                return e ? (r = (i = t.getBoundingClientRect()).top, o = i.left, s = i.width, a = i.height, t.offsetParent && (r -= (c = t.offsetParent.getBoundingClientRect()).top, o -= c.left)) : (l = n(t, e), r = t.offsetTop, o = t.offsetLeft, s = l.width, a = l.height), {
                    top: r,
                    right: o + s,
                    bottom: r + a,
                    left: o
                }
            }
        }, {
            "./getDimensions": 286
        }],
        292: [function (t, e, i) {
            "use strict";

            function n(t) {
                return "x" === t ? window.scrollX || window.pageXOffset : window.scrollY || window.pageYOffset
            }

            function r(t, e, i) {
                return "x" === e ? i ? n("x") : t.scrollLeft : i ? n("y") : t.scrollTop
            }
            e.exports = function (t, e) {
                var i = typeof t;
                e = "string" === i ? t : e;
                var n = (t = t && "string" !== i ? t : window) === window;
                return e && /^[xy]$/i.test(e) ? r(t, e, n) : {
                    x: r(t, "x", n),
                    y: r(t, "y", n)
                }
            }
        }, {}],
        293: [function (t, e, i) {
            "use strict";
            var n = t("./getPagePosition"),
                r = t("./getScrollPosition");
            e.exports = function (t, e) {
                var i;
                if (e) return {
                    top: (i = t.getBoundingClientRect()).top,
                    right: i.right,
                    bottom: i.bottom,
                    left: i.left
                };
                i = n(t);
                var o = r();
                return {
                    top: i.top - o.y,
                    right: i.right - o.x,
                    bottom: i.bottom - o.y,
                    left: i.left - o.x
                }
            }
        }, {
            "./getPagePosition": 288,
            "./getScrollPosition": 292
        }],
        294: [function (t, e, i) {
            "use strict";
            var n = t("./getPercentInViewport"),
                r = t("./getDimensions");
            e.exports = function (t, e, i) {
                var o = n(t, e);
                return i = function (t, e, i) {
                    var n = {
                        x: 0,
                        y: 0
                    };
                    if (!e) return n;
                    var o, s = typeof e;
                    return e = "number" === s || "string" === s ? {
                        x: e,
                        y: e
                    } : Object.assign(n, e), Object.keys(n).forEach(function (n) {
                        var s = e[n];
                        ("string" == typeof s || s > 1) && (o = o || r(t, i), s = (parseInt(s, 10) || 0) / ("x" === n ? o.width : o.height)), e[n] = s
                    }), e
                }(t, i, e), o.y > 0 && o.y >= i.y && o.x > 0 && o.x >= i.x
            }
        }, {
            "./getDimensions": 286,
            "./getPercentInViewport": 289
        }],
        295: [function (t, e, i) {
            "use strict";
            e.exports = {
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
        296: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/useragent-detect").os,
                r = t("./touchAvailable").original,
                o = t("./helpers/globals"),
                s = t("@marcom/function-utils/once");

            function a() {
                var t = o.getWindow();
                return !r() && !t.orientation || n.windows
            }
            e.exports = s(a), e.exports.original = a
        }, {
            "./helpers/globals": 295,
            "./touchAvailable": 300,
            "@marcom/function-utils/once": 301,
            "@marcom/useragent-detect": 306
        }],
        297: [function (t, e, i) {
            "use strict";
            var n = t("./isDesktop").original,
                r = t("./isTablet").original,
                o = t("@marcom/function-utils/once");

            function s() {
                return !n() && !r()
            }
            e.exports = o(s), e.exports.original = s
        }, {
            "./isDesktop": 296,
            "./isTablet": 299,
            "@marcom/function-utils/once": 301
        }],
        298: [function (t, e, i) {
            "use strict";
            var n = t("./helpers/globals");
            e.exports = function () {
                var t = n.getWindow();
                return "devicePixelRatio" in t && t.devicePixelRatio >= 1.5
            }
        }, {
            "./helpers/globals": 295
        }],
        299: [function (t, e, i) {
            "use strict";
            var n = t("./isDesktop").original,
                r = t("./helpers/globals"),
                o = t("@marcom/function-utils/once"),
                s = 600;

            function a() {
                var t = r.getWindow(),
                    e = t.screen.width;
                return t.orientation && t.screen.height < e && (e = t.screen.height), !n() && e >= s
            }
            e.exports = o(a), e.exports.original = a
        }, {
            "./helpers/globals": 295,
            "./isDesktop": 296,
            "@marcom/function-utils/once": 301
        }],
        300: [function (t, e, i) {
            "use strict";
            var n = t("./helpers/globals"),
                r = t("@marcom/function-utils/once");

            function o() {
                var t = n.getWindow(),
                    e = n.getDocument(),
                    i = n.getNavigator();
                return !!("ontouchstart" in t || t.DocumentTouch && e instanceof t.DocumentTouch || i.maxTouchPoints > 0 || i.msMaxTouchPoints > 0)
            }
            e.exports = r(o), e.exports.original = o
        }, {
            "./helpers/globals": 295,
            "@marcom/function-utils/once": 301
        }],
        301: [function (t, e, i) {
            "use strict";
            e.exports = function (t) {
                var e;
                return function () {
                    return void 0 === e && (e = t.apply(this, arguments)), e
                }
            }
        }, {}],
        302: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e) {
                var i = null,
                    n = function () {
                        null === i && (t.apply(this, arguments), i = setTimeout(function () {
                            i = null
                        }, e))
                    };
                return n.cancel = function () {
                    clearTimeout(i)
                }, n
            }
        }, {}],
        303: [function (t, e, i) {
            "use strict";
            e.exports = {
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
        304: [function (t, e, i) {
            "use strict";
            e.exports = {
                browser: [{
                    name: "edge",
                    userAgent: "Edge",
                    version: ["rv", "Edge"],
                    test: function (t) {
                        return t.ua.indexOf("Edge") > -1 || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" === t.ua
                    }
                }, {
                    name: "chrome",
                    userAgent: "Chrome"
                }, {
                    name: "firefox",
                    test: function (t) {
                        return t.ua.indexOf("Firefox") > -1 && -1 === t.ua.indexOf("Opera")
                    },
                    version: "Firefox"
                }, {
                    name: "android",
                    userAgent: "Android"
                }, {
                    name: "safari",
                    test: function (t) {
                        return t.ua.indexOf("Safari") > -1 && t.vendor.indexOf("Apple") > -1
                    },
                    version: "Version"
                }, {
                    name: "ie",
                    test: function (t) {
                        return t.ua.indexOf("IE") > -1 || t.ua.indexOf("Trident") > -1
                    },
                    version: ["MSIE", "rv"],
                    parseDocumentMode: function () {
                        var t = !1;
                        return document.documentMode && (t = parseInt(document.documentMode, 10)), t
                    }
                }, {
                    name: "opera",
                    userAgent: "Opera",
                    version: ["Version", "Opera"]
                }],
                os: [{
                    name: "windows",
                    test: function (t) {
                        return t.ua.indexOf("Windows") > -1
                    },
                    version: "Windows NT"
                }, {
                    name: "osx",
                    userAgent: "Mac",
                    test: function (t) {
                        return t.ua.indexOf("Macintosh") > -1
                    }
                }, {
                    name: "ios",
                    test: function (t) {
                        return t.ua.indexOf("iPhone") > -1 || t.ua.indexOf("iPad") > -1
                    },
                    version: ["iPhone OS", "CPU OS"]
                }, {
                    name: "linux",
                    userAgent: "Linux",
                    test: function (t) {
                        return (t.ua.indexOf("Linux") > -1 || t.platform.indexOf("Linux") > -1) && -1 === t.ua.indexOf("Android")
                    }
                }, {
                    name: "fireos",
                    test: function (t) {
                        return t.ua.indexOf("Firefox") > -1 && t.ua.indexOf("Mobile") > -1
                    },
                    version: "rv"
                }, {
                    name: "android",
                    userAgent: "Android",
                    test: function (t) {
                        return t.ua.indexOf("Android") > -1
                    }
                }, {
                    name: "chromeos",
                    userAgent: "CrOS"
                }]
            }
        }, {}],
        305: [function (t, e, i) {
            "use strict";
            var n = t("./defaults"),
                r = t("./dictionary");

            function o(t, e) {
                if ("function" == typeof t.parseVersion) return t.parseVersion(e);
                var i, n = t.version || t.userAgent;
                "string" == typeof n && (n = [n]);
                for (var r, o = n.length, s = 0; s < o; s++)
                    if ((r = e.match((i = n[s], new RegExp(i + "[a-zA-Z\\s/:]+([0-9_.]+)", "i")))) && r.length > 1) return r[1].replace(/_/g, ".");
                return !1
            }

            function s(t, e, i) {
                for (var n, r, s = t.length, a = 0; a < s; a++)
                    if ("function" == typeof t[a].test ? !0 === t[a].test(i) && (n = t[a].name) : i.ua.indexOf(t[a].userAgent) > -1 && (n = t[a].name), n) {
                        if (e[n] = !0, "string" == typeof (r = o(t[a], i.ua))) {
                            var c = r.split(".");
                            e.version.string = r, c && c.length > 0 && (e.version.major = parseInt(c[0] || 0), e.version.minor = parseInt(c[1] || 0), e.version.patch = parseInt(c[2] || 0))
                        } else "edge" === n && (e.version.string = "12.0.0", e.version.major = "12", e.version.minor = "0", e.version.patch = "0");
                        return "function" == typeof t[a].parseDocumentMode && (e.version.documentMode = t[a].parseDocumentMode()), e
                    } return e
            }
            e.exports = function (t) {
                var e = {};
                return e.browser = s(r.browser, n.browser, t), e.os = s(r.os, n.os, t), e
            }
        }, {
            "./defaults": 303,
            "./dictionary": 304
        }],
        306: [function (t, e, i) {
            "use strict";
            var n = {
                ua: window.navigator.userAgent,
                platform: window.navigator.platform,
                vendor: window.navigator.vendor
            };
            e.exports = t("./parseUserAgent")(n)
        }, {
            "./parseUserAgent": 305
        }],
        307: [function (t, e, i) {
            arguments[4][90][0].apply(i, arguments)
        }, {
            "./ac-event-emitter/EventEmitter": 308,
            dup: 90
        }],
        308: [function (t, e, i) {
            arguments[4][91][0].apply(i, arguments)
        }, {
            dup: 91
        }],
        309: [function (t, e, i) {
            "use strict";
            var n, r = "data-films-modal-link",
                o = "data-films-inline-target",
                s = t("./factory/createFilms"),
                a = !0;
            e.exports = function t(e, i) {
                if (!(this instanceof t) && a) return a = !1, n = setTimeout(t, 1),
                    function (e, i) {
                        return clearTimeout(n), new t(e, i)
                    };
                e = e || document;
                var c, l = Array.prototype.slice.call(e.querySelectorAll("[" + r + "]")),
                    u = Array.prototype.slice.call(e.querySelectorAll("[" + o + "]"));
                if (l.length) c = s(l, Object.assign(i || {}, {
                    modal: !0
                }));
                else if (u.length) {
                    for (var h = {}, d = 0, p = u.length; d < p; d++) {
                        var f = u[d],
                            m = f.getAttribute(o);
                        h[m] || (h[m] = []), h[m].push(f)
                    }
                    for (var _ in h) h.hasOwnProperty(_) && (c = s(h[_], Object.assign(i || {}, {
                        targetElement: e.querySelector("#" + _)
                    })))
                }
                return c
            }()
        }, {
            "./factory/createFilms": 314
        }],
        310: [function (t, e, i) {
            "use strict";
            var n;
            try {
                n = t("@marcom/ac-analytics")
            } catch (t) {}
            var r = t("@marcom/useragent-detect").browser,
                o = r.ie || r.edge,
                s = t("@marcom/ac-video/event-emitter-shim/EventEmitterShim"),
                a = function (t, e, i) {
                    if (i) {
                        s.prototype.once.apply(this, [t, function () {
                            e.apply(i, arguments)
                        }])
                    } else s.prototype.once.apply(this, arguments)
                };

            function c(t, e, i) {
                this.player = t, this.sources = {}, this.currentStubPlayer = null, this.playerType = "", this.videoType = "", this.options = e, i && this._bindAnchors(i)
            }
            var l = c.prototype;
            l._bindAnchors = function (t) {
                for (var e = 0, i = t.length; e < i; e++) this._bindAnchorForAnalytics(t[e])
            }, l.activate = function () {
                this._onPlay = this._onPlay.bind(this), this._onEnded = this._onEnded.bind(this), this._onTimeupdate = this._onTimeupdate.bind(this), this._onTexttrackshow = this._onTexttrackshow.bind(this), this._onLoadStart = this._onLoadStart.bind(this), this.setCurrentStubPlayer = this.setCurrentStubPlayer.bind(this), this._onPlayPromiseResolved = this._onPlayPromiseResolved.bind(this), o ? this.player.on("playing", this._onPlay) : this.player.on("play", this._onPlay), this.player.on("ended", this._onEnded), this.player.on("loadstart", this._onLoadStart), this.player.on("timeupdate", this._onTimeupdate), this.player.on("texttrackshow", this._onTexttrackshow), this.player.on("PlayPromiseResolved", this._onPlayPromiseResolved), this.player.on("durationchange", this.setCurrentStubPlayer)
            }, l.deactivate = function () {
                o ? this.player.off("playing", this._onPlay) : this.player.off("play", this._onPlay), this.player.off("ended", this._onEnded), this.player.off("timeupdate", this._onTimeupdate), this.player.off("texttrackshow", this._onTexttrackshow), this.player.off("durationchange", this.setCurrentStubPlayer), this.player.off("PlayPromiseResolved", this._onPlayPromiseResolved)
            }, l._bindAnchorForAnalytics = function (t) {
                var e;
                if (t) {
                    if (this.sources[t.id]) return;
                    e = this._createStubPlayer(t), t.getAttribute("data-" + this.options.dataAttribute) || (e.videoId = t.id), this.sources[t.id] = {
                        stubPlayer: e,
                        observer: this._createObserver(e)
                    }
                }
            }, l.addSourceObject = l._bindAnchorForAnalytics, l.setCurrentStubPlayer = function () {
                var t, e = this.player.el.getAttribute("data-" + this.options.dataAttribute),
                    i = this._getCurrentSourceObject(e);
                i && i.stubPlayer && (this.currentStubPlayer = i.stubPlayer, this.playerType = "html5", (t = this.player.getCurrentSrc()) && (this.videoType = t.split(".").pop()))
            }, l.destroy = function () {
                this.deactivate(), this.player = null, this.sources = null, this.currentStubPlayer = null, this.options = null
            }, l._onPlay = function () {
                this.setCurrentStubPlayer(), this._started || (this._proxyEvent("play"), this._started = !0)
            }, l._onPlayPromiseResolved = function () {
                this.setCurrentStubPlayer(), this._proxyEvent("PlayPromiseResolved")
            }, l._onLoadStart = function () {
                this._started = !1
            }, l._onEnded = function () {
                this._started = !1, this._proxyEvent("ended")
            }, l._onTimeupdate = function () {
                this._proxyEvent("timeupdate"), this._started && 0 === this.player.getCurrentTime() && this.player.getPaused() && (this._started = !1)
            }, l._onTexttrackshow = function () {
                this._proxyEvent("captions-enabled")
            }, l._getSourceObjectBySrcObjId = function (t) {
                return this.sources[t] || null
            }, l._getCurrentSourceObject = function (t) {
                var e;
                return t && (e = this._getSourceObjectBySrcObjId(t)), e
            }, l._createStubPlayer = function (t) {
                var e = new s;
                return e.once = a, e.el = t, e.VERSION = this.player.VERSION, e
            }, l._getEventData = function () {
                return {
                    currentTime: this.player.getCurrentTime(),
                    playerType: this.playerType || "html5",
                    videoType: this.videoType || null
                }
            }, l._createObserver = function (t) {
                var e;
                return n && n.observer && n.observer.Video && (e = new n.observer.Video(t, {
                    dataAttribute: this.options.dataAttribute
                })), e
            }, l._proxyEvent = function (t) {
                this.currentStubPlayer && this.currentStubPlayer.trigger(t, this._getEventData())
            }, e.exports = c
        }, {
            "@marcom/ac-analytics": "@marcom/ac-analytics",
            "@marcom/ac-video/event-emitter-shim/EventEmitterShim": 201,
            "@marcom/useragent-detect": 306
        }],
        311: [function (t, e, i) {
            "use strict";
            var n = t("../windowload/windowLoad"),
                r = t("@marcom/useragent-detect"),
                o = t("@marcom/feature-detect/touchAvailable")(),
                s = r.os.ios || r.os.android || r.os.osx && o;
            e.exports = function (t, e, i, r) {
                var o = {
                    click: function (i) {
                        i.preventDefault(), e(t)
                    },
                    TriggerAnchor: function () {
                        e(t)
                    }
                };
                return Object.keys(o).forEach(function (e) {
                    t.addEventListener(e, o[e])
                }), r && t.id && r.createRoute(t.id, function () {
                    n(function () {
                        e(t, !s)
                    })
                }), {
                    detatch: function () {
                        Object.keys(o).forEach(function (e) {
                            t.removeEventListener(e, o[e])
                        })
                    }
                }
            }
        }, {
            "../windowload/windowLoad": 321,
            "@marcom/feature-detect/touchAvailable": 300,
            "@marcom/useragent-detect": 306
        }],
        312: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-router").Router,
                r = t("@marcom/ac-video/player/factory/createShareablePlayer"),
                o = t("@marcom/ac-video/optimizeVideoUrl"),
                s = t("@marcom/useragent-detect"),
                a = t("./bindAnchor"),
                c = t("./createClickHandler"),
                l = t("./createModalLink"),
                u = t("./createHandheldModalLink"),
                h = t("./createInlineLink"),
                d = t("@marcom/feature-detect/isHandheld")(),
                p = s.os.ios,
                f = {
                    controls: !0,
                    urlOptimizer: o
                };
            e.exports = function (t, e) {
                var i;
                e = e || {}, e = Object.assign({}, f, e), t.forEach(function (t) {
                    t.hasAttribute("data-films-options") && (!1 !== JSON.parse(t.getAttribute("data-films-options")).closeOnEnd || e.closeOnEnd || (e.closeOnEnd = !1))
                }), e.maxWidth || (e.maxWidth = 1280);
                var o, s = r(e);
                i = new n({
                    hashChange: !0,
                    pushState: !1
                });
                var m = (o = !e.modal || d && p && !e.threesixty ? e.modal ? u(s, document.body, e) : h(s, e) : l(s, e)).play.bind(o),
                    _ = c({
                        player: s,
                        playHandler: m,
                        attr: "data-" + e.dataAttribute
                    }),
                    v = new Map;
                t.forEach(function (t) {
                    v.set(t, a(t, _, m, i))
                });
                var y = function (t, e) {
                    t.detatch(), v.delete(e)
                };
                return i.start(), {
                    play: function (e) {
                        for (var i = 0, n = t.length; i < n; i++) t[i].id !== e && t[i] !== e || m(t[i].href)
                    },
                    player: s,
                    modalVideo: o.modal,
                    destroy: function () {
                        v.forEach(y), o.destroy()
                    }
                }
            }
        }, {
            "./bindAnchor": 311,
            "./createClickHandler": 313,
            "./createHandheldModalLink": 315,
            "./createInlineLink": 316,
            "./createModalLink": 317,
            "@marcom/ac-router": 156,
            "@marcom/ac-video/optimizeVideoUrl": 202,
            "@marcom/ac-video/player/factory/createShareablePlayer": 208,
            "@marcom/feature-detect/isHandheld": 297,
            "@marcom/useragent-detect": 306
        }],
        313: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/feature-detect/isRetina");
            e.exports = function (t) {
                return function (e, i) {
                    var r = null;
                    Array.from(document.querySelectorAll(".theme-dark")).find(function (e) {
                        return e.contains(t.player.el)
                    }) && (r = n() ? "/ac/ac-video-posterframe/3.0/images/ac_video_poster_dark_960x540_2x.jpg" : "/ac/ac-video-posterframe/3.0/images/ac_video_poster_dark_960x540.jpg");
                    var o = e.getAttribute("data-films-options"),
                        s = void 0;
                    (s = o ? JSON.parse(o) : null) && s.endState && s.endState.items.forEach(function (t) {
                        if (t.url && 0 === t.url.indexOf("#")) {
                            var e = document.querySelector(t.url);
                            t.onclick = function () {
                                e.dispatchEvent(new CustomEvent("TriggerAnchor"))
                            }
                        }
                    }), s || (s = {}), s.poster || (s.poster = r);
                    var a = e.getAttribute("data-films-modal-label") || s && s.modalLabel || t.player.options.modalLabel || "Video Player";
                    t.player.el.setAttribute(t.attr, e.getAttribute(t.attr) || e.id), t.playHandler(e.href, s, i, a)
                }
            }
        }, {
            "@marcom/feature-detect/isRetina": 298
        }],
        314: [function (t, e, i) {
            "use strict";
            var n = t("./bindAnchors"),
                r = t("../analytics/AnalyticsTranslator"),
                o = {
                    dataAttribute: "analytics-video-id",
                    analytics: !0
                };
            e.exports = function (t, e) {
                e = e || {}, e = Object.assign({}, o, e);
                var i = n(t, e);
                e.analytics && new r(i.player, e, t).activate();
                return i
            }
        }, {
            "../analytics/AnalyticsTranslator": 310,
            "./bindAnchors": 312
        }],
        315: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e, i) {
                t.el.classList.add("ac-films-handheld-player");
                return e.appendChild(t.el), {
                    play: function (e, i) {
                        var n = function () {
                            t.getPaused() || t.pause(), t.el.classList.remove("player-fullscreen")
                        };
                        t.el.classList.add("player-fullscreen"), t.once("ended", n), t.once("exitfullscreen", n), t.load(e), !1 !== i && t.play()
                    },
                    player: t,
                    destroy: function () {
                        t.destroy()
                    }
                }
            }
        }, {}],
        316: [function (t, e, i) {
            "use strict";
            e.exports = function (t, e) {
                var i = e.targetElement,
                    n = function (e, i) {
                        t.load(e, null, 0, i), t.play()
                    };
                return e.playHandler = n, i && i.appendChild(t.el), {
                    play: n,
                    player: t,
                    destroy: function () {
                        t.destroy()
                    }
                }
            }
        }, {}],
        317: [function (t, e, i) {
            "use strict";
            var n = t("@marcom/ac-modal").createFullViewportModal,
                r = t("@marcom/useragent-detect"),
                o = t("@marcom/feature-detect/touchAvailable")(),
                s = r.os.ios || r.os.android || r.os.osx && o,
                a = t("./link/ModalLink");
            e.exports = function (t, e) {
                e = e || {};
                var i = document.createElement("div");
                i.classList.add("ac-player-container"), s && i.classList.add("ac-films-modal-mobile"), i.appendChild(t.el);
                var r = n(i);
                return r.modalElement.classList.add("ac-modal-video"), new a({
                    player: t,
                    modal: r,
                    closeOnEnd: e.closeOnEnd
                })
            }
        }, {
            "./link/ModalLink": 318,
            "@marcom/ac-modal": 117,
            "@marcom/feature-detect/touchAvailable": 300,
            "@marcom/useragent-detect": 306
        }],
        318: [function (t, e, i) {
            "use strict";
            var n = /_([0-9]+)x([0-9]+)/,
                r = t("../../resize/ResizeHandler"),
                o = t("@marcom/ac-video/utils/urlOptimizer/19X9AssetSizes"),
                s = function (t) {
                    this.modal = t.modal, this.player = t.player, this._resizeHandler = new r({
                        player: this.player,
                        modal: this.modal
                    }), this._closeOnEnd = void 0 === t.closeOnEnd || t.closeOnEnd, this._ended = !1, this._pauseTime = 0, this._playing = !1, this._initialize()
                },
                a = s.prototype;
            a._initialize = function () {
                this._bindMethods(), this.player.on("ended", this._onEnded), this.player.on("pause", this._onPaused), this.modal.on("open", this._onOpen), this.player.supportsPictureInPicture() && this.player.on("pictureinpicture:change", this._onPipModeChanged)
            }, a._bindMethods = function () {
                this._onEnded = this._onEnded.bind(this), this._onPipModeChanged = this._onPipModeChanged.bind(this), this._onPaused = this._onPaused.bind(this), this._onModalWillClose = this._onModalWillClose.bind(this), this._onOpen = this._onOpen.bind(this)
            }, a._onOpen = function () {
                this.player.refreshSize()
            }, a._onPaused = function () {
                this._pauseTime = Date.now()
            }, a._onEnded = function () {
                this._ended = !0, !this.player.isPictureInPicture() && this._closeOnEnd ? this.modal.close() : this.player.isPictureInPicture() && (this.player.setPictureInPicture(!1), this.modal.modalElement.classList.remove("ac-modal-video-pip"), this._closeOnEnd || (this.modal.open(), this._bindWillClose()))
            }, a._onPipModeChanged = function () {
                this._ended || (this.player.isPictureInPicture() && this._isModalOpen() ? (this._unBindWillClose(), this.modal.modalElement.classList.add("ac-modal-video-pip"), this.modal.close()) : this._isModalOpen() || (this.modal.modalElement.classList.remove("ac-modal-video-pip"), !this._pauseTime || Date.now() - this._pauseTime > 400 ? (this._bindWillClose(), this.modal.open()) : this._resetVideo()))
            }, a._resetVideo = function () {
                this.player.pause(), this.player.setCurrentTime(0)
            }, a._onModalWillClose = function () {
                this._unBindWillClose(), this._resetVideo(), this.player.setPictureInPicture(!1), this.modal.modalElement.classList.remove("ac-modal-video-pip")
            }, a._clearAspectRatio = function () {
                this.player.el.parentElement.classList.remove("ac-video-cinematic-aspect-ratio"), this.player.el.parentElement.classList.remove("ac-video-square-aspect-ratio"), this.player.el.parentElement.classList.remove("ac-video-vertical-aspect-ratio"), this.player.el.parentElement.classList.remove("ac-video-19x9-aspect-ratio"), this.player.el.parentElement.classList.remove("ac-video-9x19-aspect-ratio")
            }, a._set19X9Mode = function () {
                this.player.el.parentElement.classList.add("ac-video-19x9-aspect-ratio")
            }, a._set9X19Mode = function () {
                this.player.el.parentElement.classList.add("ac-video-9x19-aspect-ratio")
            }, a._setCinematicMode = function () {
                this.player.el.parentElement.classList.add("ac-video-cinematic-aspect-ratio")
            }, a._setSquareVideo = function () {
                this.player.el.parentElement.classList.add("ac-video-square-aspect-ratio")
            }, a._setVerticalVideo = function () {
                this.player.el.parentElement.classList.add("ac-video-vertical-aspect-ratio")
            }, a._resetPiPVideo = function () {
                var t = this.player.getVisibleTextTracks();
                t.forEach(function (t) {
                    t.mode = "hidden"
                }), this._resetVideo(), t.forEach(function (t) {
                    t.mode = "showing"
                })
            }, a.play = function (t, e, i, r) {
                if (this._ended = !1, this._clearAspectRatio(), t.match("-tft-")) this._setCinematicMode();
                else if (n.test(t)) {
                    var s = parseInt(RegExp.$1, 10),
                        a = parseInt(RegExp.$2, 10);
                    c = {
                        width: s,
                        height: a
                    }, o.find(function (t) {
                        return t.width === c.width && (t.height = c.height) || t.width === c.height && (t.height = c.width)
                    }) ? a > s ? this._set9X19Mode(!0) : this._set19X9Mode(!0) : a > s ? this._setVerticalVideo(!0) : a === s && this._setSquareVideo(!0)
                }
                var c;
                this.modal.modalElement.setAttribute("aria-label", r), this.player.load(t, null, 0, Object.assign({}, e, {
                    maxWidth: window.innerWidth
                })), this.player.isPictureInPicture() ? this._resetPiPVideo() : (this.modal.open(), this._bindWillClose()), !1 !== i && this.player.play()
            }, a._bindWillClose = function () {
                this.modal.on("willclose", this._onModalWillClose)
            }, a._unBindWillClose = function () {
                this.modal.off("willclose", this._onModalWillClose)
            }, a._isModalOpen = function () {
                return document.documentElement.classList.contains("has-modal")
            }, a.destroy = function () {
                this.player.off("ended", this._onEnded), this.player.off("paused", this._onPaused), this.player.off("pictureinpicture:change", this._onPipModeChanged), this._unBindWillClose(), this._resizeHandler.destroy(), this.modal.destroy(), this.player.destroy()
            }, e.exports = s
        }, {
            "../../resize/ResizeHandler": 320,
            "@marcom/ac-video/utils/urlOptimizer/19X9AssetSizes": 277
        }],
        319: [function (t, e, i) {
            "use strict";
            t("../AutoFilms")()
        }, {
            "../AutoFilms": 309
        }],
        320: [function (t, e, i) {
            "use strict";
            var n = /_([0-9]+)x([0-9]+)/,
                r = t("@marcom/useragent-detect"),
                o = t("@marcom/feature-detect/touchAvailable")(),
                s = r.os.ios || r.os.android || r.os.osx && o;

            function a(t) {
                this._modal = t.modal, this._player = t.player, this._mediaElement = t.player.getMediaElement(), this._posterEl = this._player.el.querySelector(".ac-video-poster img"), this._playerContainer = this._player.el.parentElement, this._bindMethods(), this._addEventListeners(), this._calcAspectRatio()
            }
            var c = a.prototype;
            c._bindMethods = function () {
                this._onLoadStart = this._onLoadStart.bind(this), this._onResize = this._onResize.bind(this), this._fullScreenChange = this._fullScreenChange.bind(this), this._calcAspectRatio = this._calcAspectRatio.bind(this), this._addResizeListeners = this._addResizeListeners.bind(this), this._removeResizeListeners = this._removeResizeListeners.bind(this), this._onModalOpen = this._onModalOpen.bind(this)
            }, c._addEventListeners = function () {
                this._posterEl && this._posterEl.addEventListener("load", this._calcAspectRatio), this._modal.on("willopen", this._addResizeListeners), this._modal.on("open", this._onModalOpen), this._modal.on("close", this._removeResizeListeners)
            }, c._onModalOpen = function () {
                this._loadStarted && (this._onResize(), this._player.el.style.display = "", this._player.el.style.opacity = "")
            }, c._addResizeListeners = function () {
                this._mediaElement = this._player.getMediaElement(), this._player.el.style.display = "block", this._player.el.style.opacity = 0, window.addEventListener("resize", this._onResize), window.addEventListener("orientationchange", this._onResize), this._player.on("loadstart", this._onLoadStart), this._player.on("loadeddata", this._calcAspectRatio), this._player.on("fullscreen:change", this._fullScreenChange), this._player.on("fullscreen:willenter", this._fullScreenChange), this._calcAspectRatio()
            }, c._removeResizeListeners = function () {
                this._onResize(), window.removeEventListener("resize", this._onResize), window.removeEventListener("orientationchange", this._onResize), this._player.off("loadstart", this._onLoadStart), this._player.off("loadeddata", this._calcAspectRatio), this._player.off("fullscreen:change", this._fullScreenChange)
            }, c._removeEventListeners = function () {
                this._removeResizeListeners(), this._modal.off("willopen", this._addResizeListeners), this._modal.off("open", this._onModalOpen), this._modal.off("close", this._removeResizeListeners), this._posterEl && this._posterEl.removeEventListener("load", this._calcAspectRatio)
            }, c._onLoadStart = function () {
                this._mediaElement = this._player.getMediaElement(), this._loadStarted = !1, requestAnimationFrame(function () {
                    this._loadStarted = !0, this._onModalOpen()
                }.bind(this)), this._calcAspectRatio()
            }, c._calcAspectRatio = function () {
                this._aspectRatio = this._player.getMediaWidth() / this._player.getMediaHeight(), (isNaN(this._aspectRatio) || this._aspectRatio <= 0) && this._player.getCurrentSrc() && n.test(this._player.getCurrentSrc()) && (this._aspectRatio = parseInt(RegExp.$1, 10) / parseInt(RegExp.$2, 10)), (isNaN(this._aspectRatio) || this._aspectRatio <= 0) && this._posterEl && (this._aspectRatio = this._posterEl.naturalWidth / this._posterEl.naturalHeight), this._onResize()
            }, c._fullScreenChange = function (t) {
                if (t && "enter" === t.type) return clearTimeout(this._fullScreenChangeTimeout), void(this._fullScreenChangeTimeout = setTimeout(function () {
                    this._isFullScreen = !0, this._onResize()
                }.bind(this), 60));
                this._isFullScreen = this._player.isFullscreen(), this._onResize()
            }, c.destroy = function () {
                clearTimeout(this._fullScreenChangeTimeout), this._removeEventListeners()
            }, c._onResize = function () {
                var t = this._aspectRatio;
                if (isNaN(t)) return this._mediaElement.style.width = "", void(this._mediaElement.style.height = "");
                var e = window.innerWidth,
                    i = window.innerHeight,
                    n = e / i;
                if (this._mediaElement.readyState < 1) {
                    var r = parseInt(getComputedStyle(this._playerContainer).maxWidth.replace("px", "")),
                        o = r / t,
                        a = s ? parseInt(getComputedStyle(this._player.el).maxHeight.replace("px", "")) : o;
                    (o > i || a && o > a) && (r = (a || i) * t, o = Math.min(r / t, i)), (r > e || r > o * t) && (r = (o = Math.min(e / t, i)) * t), this._mediaElement.style.width = r + "px", this._mediaElement.style.height = Math.min(o, i) + "px"
                } else this._mediaElement.style.width = "", this._mediaElement.style.height = "";
                n > t && !this._isFullScreen ? this._playerContainer.parentElement.classList.add("center-horizontal") : this._playerContainer.parentElement.classList.remove("center-horizontal"), this._player.refreshSize()
            }, e.exports = a
        }, {
            "@marcom/feature-detect/touchAvailable": 300,
            "@marcom/useragent-detect": 306
        }],
        321: [function (t, e, i) {
            "use strict";
            var n = !1;
            window.addEventListener("load", function () {
                n = !0
            }), e.exports = function (t) {
                n ? t() : window.addEventListener("load", t)
            }
        }, {}]
    }, {}, [319]);