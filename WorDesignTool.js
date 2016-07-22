var WorDesignTool = (function(d, w) {
    var $ = {
        default: function() {
            /*Elements set up*/
            $.elements.objDisplay = d.getElementById('wdDisplay');
            $.elements.objMainWrapper = d.getElementById('wdMainWrapper');
            /*Editors set up*/
            $.editors.editPageWidth = d.getElementById('wdePageWidth');
            $.editors.editPanel = d.getElementById('wdEditorPanel');
            /*Constants set up*/
            $.consts.displayScrollTop = $.elements.objDisplay.scrollTop;
        },
        init: function(config) {
            $.default();
            if (config != null) {
                if (config.elements != null) {
                    $.elements = $.utility.merge($.elements, config.elements);
                }
                if (config.editors != null) {
                    $.editors = $.utility.merge($.editors, config.editors);
                }
                if (config.buttons != null) {
                    $.buttons = $.utility.merge($.buttons, config.buttons);
                }
            }
            $.controls.initPageWidth();
            $.controls.initDisplay();
            $.controls.initMainWrapper();
            $.controls.initPanel();
            $.controls.initButtons();
            $.controls.initRemove();
        },
        variables: {
            currentElements: null,
            isRow: false,
            isColumn: false,
        },
        consts: {
            displayScrollTop: 0,
            rowCount: 0,
        },
        elements: {
            objDisplay: null,
            objMainWrapper: null,
        },
        editors: {
            editPanel: null,
            editPageWidth: null,
            editContentWidth: null,
            editContentHeight: null,
            editContentPaddingTop: null,
            editContentPaddingRight: null,
            editContentPaddingBottom: null,
            editContentPaddingLeft: null,
            editContentMarginTop: null,
            editContentMarginRight: null,
            editContentMarginBottom: null,
            editContentMarginLeft: null,
            editContentFont: null,
            editContentTextColor: null,
            editContentTextAlign: null,
            editContentDisplay: null,
            editContentPosition: null,
            editContentBackgroundSize: null,
            editContentBackgroundImage: null,
            editContentBackgroundColor: null,
        },
        buttons: {
            btnAddRow: "WD_addRow",
            btnAddColumn: "WD_addColumn",
            btnRemove: "WD_remove",
        },
        controls: {
            /*Initilization*/
            initDisplay: function() {
                $.elements.objDisplay.addEventListener("wheel", function(e) {
                    var currentZoom = parseFloat($.elements.objDisplay.style.zoom);
                    if (!currentZoom) currentZoom = 1;
                    if (e.deltaY > 0) {
                        $.elements.objDisplay.style.zoom = currentZoom + 0.05;
                        $.consts.displayScrollTop = $.elements.objDisplay.scrollTop;
                    } else {
                        $.elements.objDisplay.style.zoom = currentZoom - 0.05;
                        $.consts.displayScrollTop = $.elements.objDisplay.scrollTop;
                    }
                });
            },
            initPageWidth: function() {
                $.editors.editPageWidth.value = $.elements.objMainWrapper.offsetWidth;
                $.editors.editPageWidth.addEventListener("change", function() {
                    $.elements.objMainWrapper.style.width = $.editors.editPageWidth.value;
                }, true);
            },
            initMainWrapper: function() {
                var oldX = 0;
                var oldY = 0;
                var wrapperMove = function(e) {
                    mousemove(e);
                }
                var mousemove = function(e) {
                    // console.log(e);
                    var top = $.elements.objMainWrapper.offsetTop;
                    var left = $.elements.objMainWrapper.offsetLeft;
                    $.elements.objMainWrapper.style.position = "absolute";
                    // if (top < e.clientY) top += e.clientY - oldY;
                    // else top -= e.clientY;
                    top += e.clientY - oldY;
                    $.elements.objMainWrapper.style.top = top + "px";
                    // if (left < e.clientX) left += oldX;
                    // else left -= e.clientX;
                    left += e.clientX - oldX;
                    $.elements.objMainWrapper.style.left = left + "px";
                    oldX = e.clientX;
                    oldY = e.clientY;
                };
                var mouseUp = function() {
                    w.removeEventListener('mousemove', wrapperMove, true);
                };
                var mouseDown = function(e) {
                    oldX = e.clientX;
                    oldY = e.clientY;
                    w.addEventListener('mousemove', wrapperMove, true);
                };
                $.elements.objMainWrapper.addEventListener("mousedown", mouseDown, false);
                w.addEventListener("mouseup", mouseUp, false);
            },
            initPanel: function() {
                $.DOM.generateEditorPanel();
            },
            initButtons: function() {
                $.eventHookers.evtBtnAddRow();
                $.eventHookers.evtBtnAddColumn();
                $.eventHookers.evtBtnRemove();
            },
            initRemove: function() {
                Element.prototype.remove = function() {
                    this.parentElement.removeChild(this);
                }
                NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
                    for (var i = this.length - 1; i >= 0; i--) {
                        if (this[i] && this[i].parentElement) {
                            this[i].parentElement.removeChild(this[i]);
                        }
                    }
                }
            },
            /*Update Panel*/
            updatePanel: function() {
                var e = $.variables.currentElement;
                $.utility.triggerClassEvent('WD_input-child-input', 'update');
            },
        },
        DOM: {
            generateEditorPanel: function() {
                $.editors.editPanel.appendChild($.DOM.genBtnRemove());
                $.editors.editPanel.appendChild($.DOM.genBtnAddRow());
                $.editors.editPanel.appendChild($.DOM.genInputWidth());
                $.editors.editPanel.appendChild($.DOM.genInputHeight());
                $.editors.editPanel.appendChild($.DOM.genInputPaddingTop());
                $.editors.editPanel.appendChild($.DOM.genInputPaddingRight());
                $.editors.editPanel.appendChild($.DOM.genInputPaddingBottom());
                $.editors.editPanel.appendChild($.DOM.genInputPaddingLeft());
            },
            /*Button DOM*/
            genBtnAddRow: function() {
                var btn = d.createElement("button");
                btn.innerHTML = "Add Row";
                btn.className = $.buttons.btnAddRow;
                return btn;
            },
            genBtnAddColumn: function() {
                var btn = d.createElement("button");
                btn.innerHTML = "Add Column";
                btn.className = $.buttons.btnAddColumn;
                return btn;
            },
            genBtnRemove: function() {
                var btn = d.createElement("button");
                btn.innerHTML = "Remove";
                btn.className = $.buttons.btnRemove;
                return btn;
            },
            /*Input DOM*/
            genInputWidth: function() {
                var el = $.genElement.addInput("width", "Width");
                return el;
            },
            genInputHeight: function() {
                var el = $.genElement.addInput("height", "Height");
                return el;
            },
            genInputPaddingTop: function() {
                var el = $.genElement.addInput("paddingTop", "Padding Top");
                return el;
            },
            genInputPaddingRight: function() {
                var el = $.genElement.addInput("paddingRight", "Padding Right");
                return el;
            },
            genInputPaddingBottom: function() {
                var el = $.genElement.addInput("paddingBottom", "Padding Bottom");
                return el;
            },
            genInputPaddingLeft: function() {
                var el = $.genElement.addInput("paddingLeft", "Padding Left");
                return el;
            }
        },
        genElement: {
            /*Element Manipulate*/
            addInput: function(name, text) {
                var wrapper = d.createElement("div");
                wrapper.id = "WD_editor_wrapper-" + name;
                wrapper.className = "WD_input-wrapper";
                var label = d.createElement("label");
                label.className = "WD_input-child-label";
                label.innerHTML = text;
                var input = d.createElement("input");
                input.id = "WD_input-" + name;
                input.className = "WD_input-child-input";
                input.addEventListener("update", function(e) {
                    var current = $.variables.currentElement;
                    if (current != null) {
                        this.value = current.style[name];
                    }
                });
                input.addEventListener("change", function(e) {
                    $.variables.currentElement.style[name] = this.value;
                });
                wrapper.appendChild(label);
                wrapper.appendChild(input);
                return wrapper;
            },
            addColumnType: function() {
                var wrapper = d.createElement("div");
                wrapper.id = "WD_editor_wrapper-" + name;
                wrapper.className = "WD_input-wrapper";
                var label = d.createElement("label");
                label.className = "WD_input-child-label";
                label.innerHTML = text;
            },
            /*Frame Manipulate*/
            addRow: function() {
                var row = d.createElement("div");
                row.WD_id = $.consts.rowCount;
                row.id = "WD_row-" + $.consts.rowCount;
                row.className = "WD_row";
                row.style.width = "100%";
                row.style.minHeight = "50px";
                row.style.border = "1px dotted grey";
                row.style.overflow = "hidden";
                row.style.position = "relative";
                row.onclick = $.eventHookers.editable;
                $.elements.objMainWrapper.appendChild(row);
                $.consts.rowCount += 1;
                // console.log(row);
            },
            addColumn: function() {
                var row = $.variables.currentElement;
                if (!$.variables.isRow && row == null) {
                    return;
                }
                var className = 'WD_row_child-' + row.WD_id;
                var columns = d.getElementsByClassName(className);
                var count = 0;
                if (columns.length) {
                    count = columns.length;
                }
                var column = d.createElement("div");
                column.id = "WD_" + row.WD_id + "_column-" + count;
                column.className = "WD_column " + className;
                column.style.width = "33%";
                column.style.minHeight = "50px";
                column.style.border = "1px dotted grey";
                column.style.overflow = "hidden";
                column.style.position = "relative";
                column.style.float = "left";
                column.onclick = $.eventHookers.editable;
                row.appendChild(column);
            }
        },
        eventHookers: {
            /*Content Editable*/
            editable: function(e) {
                $.variables.currentElement = this;
                if (this.WD_id != null) {
                    $.variables.isRow = true;
                    var isBtnColumn = d.getElementsByClassName($.buttons.btnAddColumn);
                    if (isBtnColumn.length < 1) {
                        $.editors.editPanel.appendChild($.DOM.genBtnAddColumn());
                        $.eventHookers.evtBtnAddColumn();
                    }
                } else {
                    $.variables.isRow = false;
                    d.getElementsByClassName($.buttons.btnAddColumn).remove();
                }
                $.controls.updatePanel();
                e.stopPropagation();
            },
            delete: function() {
                $.variables.currentElement.remove();
                $.variables.currentElement = null;
                $.controls.updatePanel();
                $.utility.clear('WD_input-child-input');
                $.variables.isRow = false;
                $.variables.isColumn = false;
            },
            /*Button Handler*/
            evtBtnAddRow: function() {
                $.utility.applyClassEvent($.buttons.btnAddRow, "click", function() {
                    $.genElement.addRow();
                }, true);
            },
            evtBtnAddColumn: function() {
                $.utility.applyClassEvent($.buttons.btnAddColumn, "click", function() {
                    $.genElement.addColumn();
                }, false);
            },
            evtBtnRemove: function() {
                $.utility.applyClassEvent($.buttons.btnRemove, "click", function() {
                    $.eventHookers.delete();
                }, true);
            },
        },
        utility: {
            merge: function(obj, src) {
                Object.keys(src).forEach(function(key) {
                    obj[key] = src[key];
                });
                return obj;
            },
            clear: function(c) {
                var classElements = d.getElementsByClassName(c);
                for (var i = 0; i < classElements.length; i++) {
                    classElements[i]["value"] = "";
                }
            },
            applyClassEvent: function(c, e, f, t) {
                var classElements = d.getElementsByClassName(c);
                for (var i = 0; i < classElements.length; i++) {
                    classElements[i]["on" + e] = f;
                }
            },
            triggerClassEvent: function(c, e, b) {
                var event = new CustomEvent(e, {
                    detail: {
                        time: new Date(),
                    },
                    bubbles: b,
                    cancelable: true
                });
                var classElements = d.getElementsByClassName(c);
                for (var i = 0; i < classElements.length; i++) {
                    classElements[i].dispatchEvent(event);
                }
            }
        },
    };
    return $;
})(document, window);