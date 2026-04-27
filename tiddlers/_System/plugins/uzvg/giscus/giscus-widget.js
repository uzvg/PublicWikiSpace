/*\
title: $:/plugins/giscus/widget.js
type: application/javascript
module-type: widget
\*/

(function(){

"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var GiscusWidget = function(parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
};

GiscusWidget.prototype = new Widget();

GiscusWidget.prototype.render = function(parent, nextSibling) {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();

    var domNode = this.document.createElement("div");
    domNode.className = "giscus";
    parent.insertBefore(domNode, nextSibling);
    this.domNodes.push(domNode);

    // ✅ 固定 origin（关键修复点）
    var GISCUS_ORIGIN = "https://giscus.app";

    // ===== 参数 =====
    var repo         = this.getAttribute("repo", "uzvg/PublicWikiSpace");
    var repoId       = this.getAttribute("repo-id", "R_kgDOOKXM8g");
    var category     = this.getAttribute("category", "Announcements");
    var categoryId   = this.getAttribute("category-id", "DIC_kwDOOKXM8s4C7FiI");
    var mapping      = this.getAttribute("mapping", "specific");
    var term         = this.getAttribute("term", "");
    var strict       = this.getAttribute("strict", "1");
    var reactionsEnabled = this.getAttribute("reactions-enabled", "1");
    var emitMetadata = this.getAttribute("emit-metadata", "0");
    var inputPosition = this.getAttribute("input-position", "top");
    var theme        = this.getAttribute("theme", "dark");
    var lang         = this.getAttribute("lang", "zh-CN");
    var loading      = this.getAttribute("loading", "lazy");

    // ===== 页面信息 =====
    var pageUrl = new URL(location.href);
    pageUrl.searchParams.delete("giscus");
    pageUrl.hash = "";
    var pageOrigin = pageUrl.toString();

    // ===== session =====
    var session = "";
    var storedSession = localStorage.getItem("giscus-session");

    if(storedSession) {
        try {
            session = JSON.parse(storedSession);
        } catch(e) {
            localStorage.removeItem("giscus-session");
        }
    }

    // ===== term =====
    var termValue = "";
    switch(mapping) {
        case "url":      termValue = pageOrigin; break;
        case "title":    termValue = document.title; break;
        case "specific": termValue = term; break;
        case "number":   termValue = term; break;
        default:
            termValue = location.pathname.length < 2
                ? "index"
                : location.pathname.substring(1).replace(/\.\w+$/, "");
    }

    // ===== 参数构建 =====
    var params = {
        origin:           pageOrigin, // ⚠️ 这里不是 GISCUS_ORIGIN
        session:          session,
        theme:            theme,
        reactionsEnabled: reactionsEnabled,
        emitMetadata:     emitMetadata,
        inputPosition:    inputPosition,
        repo:             repo,
        repoId:           repoId,
        category:         category,
        categoryId:       categoryId,
        strict:           strict
    };

    if(mapping === "number") {
        params.number = termValue;
    } else {
        params.term = termValue;
    }

    var langPath = lang ? "/" + lang : "";
    var iframeSrc = GISCUS_ORIGIN + langPath + "/widget?" + new URLSearchParams(params).toString();

    // ===== CSS（只加载一次）=====
    if(!document.getElementById("giscus-css")) {
        var link = document.createElement("link");
        link.id = "giscus-css";
        link.rel = "stylesheet";
        link.href = GISCUS_ORIGIN + "/default.css";
        document.head.prepend(link);
    }

    // ===== iframe =====
    var iframe = document.createElement("iframe");

    var attrs = {
        "class": "giscus-frame giscus-frame--loading",
        "title": "Comments",
        "scrolling": "no",
        "allow": "clipboard-write",
        "src": iframeSrc
    };

    if(loading === "lazy") {
        attrs.loading = "lazy";
    }

    Object.entries(attrs).forEach(function(entry){
        iframe.setAttribute(entry[0], entry[1]);
    });

    iframe.style.opacity = "0";

    iframe.addEventListener("load", function(){
        iframe.style.removeProperty("opacity");
        iframe.classList.remove("giscus-frame--loading");
    });

    domNode.appendChild(iframe);

    // ===== postMessage 监听 =====
    var self = this;

    this._giscusMessageHandler = function(event) {
        // ✅ 必须严格匹配 origin
        if(event.origin !== GISCUS_ORIGIN) return;

        var data = event.data;
        if(typeof data !== "object" || !data.giscus) return;

        if(data.giscus.resizeHeight) {
            iframe.style.height = data.giscus.resizeHeight + "px";
        }

        if(data.giscus.signOut) {
            localStorage.removeItem("giscus-session");
        }
    };

    window.addEventListener("message", this._giscusMessageHandler);
};

GiscusWidget.prototype.destroy = function() {
    if(this._giscusMessageHandler) {
        window.removeEventListener("message", this._giscusMessageHandler);
    }
};

GiscusWidget.prototype.refresh = function(changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if(Object.keys(changedAttributes).length > 0) {
        this.refreshSelf();
        return true;
    }
    return false;
};

exports.giscus = GiscusWidget;

})();