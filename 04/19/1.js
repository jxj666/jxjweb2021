"use strict";
exports.__esModule = true;
/*
 * @LastEditTime: 2021-04-19 17:28:07
 * @LastEditors: jinxiaojian
 */
var React = require("react");
var react_1 = require("react");
var MIN_SWIPE_DISTANCE = 0.1;
var STOP_SWIPE_DISTANCE = 0.01;
var REFRESH_INTERVAL = 20;
var SPEED_OFF_MULTIPLE = Math.pow(0.995, REFRESH_INTERVAL);
// ================================= Hook =================================
function useTouchMove(ref, onOffset) {
    var _a = react_1.useState(), touchPosition = _a[0], setTouchPosition = _a[1];
    var _b = react_1.useState(0), lastTimestamp = _b[0], setLastTimestamp = _b[1];
    var _c = react_1.useState(0), lastTimeDiff = _c[0], setLastTimeDiff = _c[1];
    var _d = react_1.useState(), lastOffset = _d[0], setLastOffset = _d[1];
    var motionRef = react_1.useRef();
    // ========================= Events =========================
    // >>> Touch events
    function onTouchStart(e) {
        var _a = e.touches[0], screenX = _a.screenX, screenY = _a.screenY;
        setTouchPosition({ x: screenX, y: screenY });
        window.clearInterval(motionRef.current);
    }
    function onTouchMove(e) {
        if (!touchPosition)
            return;
        e.preventDefault();
        var _a = e.touches[0], screenX = _a.screenX, screenY = _a.screenY;
        setTouchPosition({ x: screenX, y: screenY });
        var offsetX = screenX - touchPosition.x;
        var offsetY = screenY - touchPosition.y;
        onOffset(offsetX, offsetY);
        var now = Date.now();
        setLastTimestamp(now);
        setLastTimeDiff(now - lastTimestamp);
        setLastOffset({ x: offsetX, y: offsetY });
    }
    function onTouchEnd() {
        if (!touchPosition)
            return;
        setTouchPosition(null);
        setLastOffset(null);
        // Swipe if needed
        if (lastOffset) {
            var distanceX = lastOffset.x / lastTimeDiff;
            var distanceY = lastOffset.y / lastTimeDiff;
            var absX = Math.abs(distanceX);
            var absY = Math.abs(distanceY);
            // Skip swipe if low distance
            if (Math.max(absX, absY) < MIN_SWIPE_DISTANCE)
                return;
            var currentX_1 = distanceX;
            var currentY_1 = distanceY;
            motionRef.current = window.setInterval(function () {
                if (Math.abs(currentX_1) < STOP_SWIPE_DISTANCE && Math.abs(currentY_1) < STOP_SWIPE_DISTANCE) {
                    window.clearInterval(motionRef.current);
                    return;
                }
                currentX_1 *= SPEED_OFF_MULTIPLE;
                currentY_1 *= SPEED_OFF_MULTIPLE;
                onOffset(currentX_1 * REFRESH_INTERVAL, currentY_1 * REFRESH_INTERVAL);
            }, REFRESH_INTERVAL);
        }
    }
    // >>> Wheel event
    var lastWheelDirectionRef = react_1.useRef();
    function onWheel(e) {
        var deltaX = e.deltaX, deltaY = e.deltaY;
        // Convert both to x & y since wheel only happened on PC
        var mixed = 0;
        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);
        if (absX === absY) {
            mixed = lastWheelDirectionRef.current === 'x' ? deltaX : deltaY;
        }
        else if (absX > absY) {
            mixed = deltaX;
            lastWheelDirectionRef.current = 'x';
        }
        else {
            mixed = deltaY;
            lastWheelDirectionRef.current = 'y';
        }
        if (onOffset(-mixed, -mixed)) {
            e.preventDefault();
        }
    }
    // ========================= Effect =========================
    var touchEventsRef = react_1.useRef(null);
    touchEventsRef.current = { onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, onWheel: onWheel };
    React.useEffect(function () {
        function onProxyTouchStart(e) {
            touchEventsRef.current.onTouchStart(e);
        }
        function onProxyTouchMove(e) {
            touchEventsRef.current.onTouchMove(e);
        }
        function onProxyTouchEnd(e) {
            touchEventsRef.current.onTouchEnd(e);
        }
        function onProxyWheel(e) {
            touchEventsRef.current.onWheel(e);
        }
        document.addEventListener('touchmove', onProxyTouchMove, { passive: false });
        document.addEventListener('touchend', onProxyTouchEnd, { passive: false });
        // No need to clean up since element removed
        ref.current.addEventListener('touchstart', onProxyTouchStart, { passive: false });
        ref.current.addEventListener('wheel', onProxyWheel);
        return function () {
            document.removeEventListener('touchmove', onProxyTouchMove);
            document.removeEventListener('touchend', onProxyTouchEnd);
        };
    }, []);
}
exports["default"] = useTouchMove;
