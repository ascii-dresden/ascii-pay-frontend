{ fetchurl, fetchgit }:
  self:
    super:
      let
        registries = {
          yarn = n:
            v:
              "https://registry.yarnpkg.com/${n}/-/${n}-${v}.tgz";
          npm = n:
            v:
              "https://registry.npmjs.org/${n}/-/${n}-${v}.tgz";
          };
        nodeFilePackage = key:
          version:
            registry:
              sha1:
                deps:
                  super._buildNodePackage {
                    inherit key version;
                    src = fetchurl {
                      url = registry key version;
                      inherit sha1;
                      };
                    nodeBuildInputs = deps;
                    dontMakeSourcesWritable = true;

                    postUnpack = ''
                        chmod +x package || true
                    ''; 
                  };
        nodeFileLocalPackage = key:
          version:
            path:
              sha1:
                deps:
                  super._buildNodePackage {
                    inherit key version;
                    src = builtins.path { inherit path; };
                    nodeBuildInputs = deps;
                    };
        nodeGitPackage = key:
          version:
            url:
              rev:
                sha256:
                  deps:
                    super._buildNodePackage {
                      inherit key version;
                      src = fetchgit { inherit url rev sha256; };
                      nodeBuildInputs = deps;
                      };
        identityRegistry = url:
          _:
            _:
              url;
        scopedName = scope:
          name:
            { inherit scope name; };
        ir = identityRegistry;
        l = nodeFileLocalPackage;
        f = nodeFilePackage;
        g = nodeGitPackage;
        n = registries.npm;
        y = registries.yarn;
        sc = scopedName;
        s = self;
      in {
        "@ant-design/charts@1.2.5" = f (sc "ant-design" "charts") "1.2.5" (ir "https://registry.yarnpkg.com/@ant-design/charts/-/charts-1.2.5.tgz") "48952af5c3d825c21cd1613fb53bcdfe64315e21" [
          (s."@antv/g2plot@^2.2.11")
          (s."@antv/g6@^4.2.4")
          (s."@antv/util@^2.0.9")
          (s."react-content-loader@^5.0.4")
          ];
        "@ant-design/charts@^1.2.5" = s."@ant-design/charts@1.2.5";
        "@ant-design/colors@4.0.5" = f (sc "ant-design" "colors") "4.0.5" (ir "https://registry.yarnpkg.com/@ant-design/colors/-/colors-4.0.5.tgz") "d7d100d7545cca8f624954604a6892fc48ba5aae" [
          (s."tinycolor2@^1.4.1")
          ];
        "@ant-design/colors@6.0.0" = f (sc "ant-design" "colors") "6.0.0" (ir "https://registry.yarnpkg.com/@ant-design/colors/-/colors-6.0.0.tgz") "9b9366257cffcc47db42b9d0203bb592c13c0298" [
          (s."@ctrl/tinycolor@^3.4.0")
          ];
        "@ant-design/colors@^4.0.5" = s."@ant-design/colors@4.0.5";
        "@ant-design/colors@^6.0.0" = s."@ant-design/colors@6.0.0";
        "@ant-design/icons-svg@4.1.0" = f (sc "ant-design" "icons-svg") "4.1.0" (ir "https://registry.yarnpkg.com/@ant-design/icons-svg/-/icons-svg-4.1.0.tgz") "480b025f4b20ef7fe8f47d4a4846e4fee84ea06c" [];
        "@ant-design/icons-svg@^4.0.0" = s."@ant-design/icons-svg@4.1.0";
        "@ant-design/icons@4.6.2" = f (sc "ant-design" "icons") "4.6.2" (ir "https://registry.yarnpkg.com/@ant-design/icons/-/icons-4.6.2.tgz") "290f2e8cde505ab081fda63e511e82d3c48be982" [
          (s."@ant-design/colors@^6.0.0")
          (s."@ant-design/icons-svg@^4.0.0")
          (s."@babel/runtime@^7.11.2")
          (s."classnames@^2.2.6")
          (s."rc-util@^5.9.4")
          ];
        "@ant-design/icons@^4.6.2" = s."@ant-design/icons@4.6.2";
        "@ant-design/react-slick@0.28.3" = f (sc "ant-design" "react-slick") "0.28.3" (ir "https://registry.yarnpkg.com/@ant-design/react-slick/-/react-slick-0.28.3.tgz") "ad5cf1cf50363c1a3842874d69d0ce1f26696e71" [
          (s."@babel/runtime@^7.10.4")
          (s."classnames@^2.2.5")
          (s."json2mq@^0.2.0")
          (s."lodash@^4.17.21")
          (s."resize-observer-polyfill@^1.5.0")
          ];
        "@ant-design/react-slick@~0.28.1" = s."@ant-design/react-slick@0.28.3";
        "@antv/adjust@0.2.3" = f (sc "antv" "adjust") "0.2.3" (ir "https://registry.yarnpkg.com/@antv/adjust/-/adjust-0.2.3.tgz") "c3884a680c3264cc125d7f2ab5398e8a1c0b9401" [
          (s."@antv/util@~2.0.0")
          (s."tslib@^1.10.0")
          ];
        "@antv/adjust@^0.2.1" = s."@antv/adjust@0.2.3";
        "@antv/algorithm@0.1.9" = f (sc "antv" "algorithm") "0.1.9" (ir "https://registry.yarnpkg.com/@antv/algorithm/-/algorithm-0.1.9.tgz") "532ee5311e43f5be2ed1ac2b8f3504683fddeb5e" [
          (s."@antv/util@^2.0.13")
          ];
        "@antv/algorithm@^0.1.8" = s."@antv/algorithm@0.1.9";
        "@antv/attr@0.3.2" = f (sc "antv" "attr") "0.3.2" (ir "https://registry.yarnpkg.com/@antv/attr/-/attr-0.3.2.tgz") "e5866b64870c62f3a9c25b8a61f654ba2bfda051" [
          (s."@antv/color-util@^2.0.1")
          (s."@antv/util@~2.0.0")
          (s."tslib@^1.10.0")
          ];
        "@antv/attr@^0.3.1" = s."@antv/attr@0.3.2";
        "@antv/color-util@2.0.6" = f (sc "antv" "color-util") "2.0.6" (ir "https://registry.yarnpkg.com/@antv/color-util/-/color-util-2.0.6.tgz") "5e129bb9ce3f2b9309b52102b3dc929430ccc016" [
          (s."@antv/util@^2.0.9")
          (s."tslib@^2.0.3")
          ];
        "@antv/color-util@^2.0.1" = s."@antv/color-util@2.0.6";
        "@antv/color-util@^2.0.2" = s."@antv/color-util@2.0.6";
        "@antv/component@0.8.17" = f (sc "antv" "component") "0.8.17" (ir "https://registry.yarnpkg.com/@antv/component/-/component-0.8.17.tgz") "d93e0ead9bbdccea0f558531eb4610ccfacbcbf7" [
          (s."@antv/dom-util@~2.0.1")
          (s."@antv/g-base@0.5.6")
          (s."@antv/matrix-util@^3.1.0-beta.1")
          (s."@antv/path-util@~2.0.7")
          (s."@antv/scale@~0.3.1")
          (s."@antv/util@~2.0.0")
          (s."fecha@~4.2.0")
          (s."tslib@^2.0.3")
          ];
        "@antv/component@^0.8.7" = s."@antv/component@0.8.17";
        "@antv/coord@0.3.1" = f (sc "antv" "coord") "0.3.1" (ir "https://registry.yarnpkg.com/@antv/coord/-/coord-0.3.1.tgz") "982e261d8a1e06a198eb518ea7acc20ed875a019" [
          (s."@antv/matrix-util@^3.1.0-beta.2")
          (s."@antv/util@~2.0.12")
          (s."tslib@^2.1.0")
          ];
        "@antv/coord@^0.3.0" = s."@antv/coord@0.3.1";
        "@antv/dom-util@2.0.3" = f (sc "antv" "dom-util") "2.0.3" (ir "https://registry.yarnpkg.com/@antv/dom-util/-/dom-util-2.0.3.tgz") "cbd158b1c88e0e8a4d865871a5969b1190554ff5" [
          (s."tslib@^2.0.3")
          ];
        "@antv/dom-util@^2.0.1" = s."@antv/dom-util@2.0.3";
        "@antv/dom-util@^2.0.2" = s."@antv/dom-util@2.0.3";
        "@antv/dom-util@~2.0.1" = s."@antv/dom-util@2.0.3";
        "@antv/event-emitter@0.1.2" = f (sc "antv" "event-emitter") "0.1.2" (ir "https://registry.yarnpkg.com/@antv/event-emitter/-/event-emitter-0.1.2.tgz") "a17b7cb86e6d071880dc6bfb232756f88624ecbc" [];
        "@antv/event-emitter@^0.1.1" = s."@antv/event-emitter@0.1.2";
        "@antv/event-emitter@^0.1.2" = s."@antv/event-emitter@0.1.2";
        "@antv/event-emitter@~0.1.0" = s."@antv/event-emitter@0.1.2";
        "@antv/g-base@0.5.6" = f (sc "antv" "g-base") "0.5.6" (ir "https://registry.yarnpkg.com/@antv/g-base/-/g-base-0.5.6.tgz") "d96da5fbf6c5f8b073072751e15e5eec70b393fc" [
          (s."@antv/event-emitter@^0.1.1")
          (s."@antv/g-math@^0.1.6")
          (s."@antv/matrix-util@^3.1.0-beta.1")
          (s."@antv/path-util@~2.0.5")
          (s."@antv/util@~2.0.0")
          (s."@types/d3-timer@^2.0.0")
          (s."d3-ease@^1.0.5")
          (s."d3-interpolate@^1.3.2")
          (s."d3-timer@^1.0.9")
          (s."detect-browser@^5.1.0")
          (s."tslib@^2.0.3")
          ];
        "@antv/g-base@0.5.9" = f (sc "antv" "g-base") "0.5.9" (ir "https://registry.yarnpkg.com/@antv/g-base/-/g-base-0.5.9.tgz") "58d0e11d85157ada1408fbdf24f4f468f40e59cd" [
          (s."@antv/event-emitter@^0.1.1")
          (s."@antv/g-math@^0.1.6")
          (s."@antv/matrix-util@^3.1.0-beta.1")
          (s."@antv/path-util@~2.0.5")
          (s."@antv/util@~2.0.0")
          (s."@types/d3-timer@^2.0.0")
          (s."d3-ease@^1.0.5")
          (s."d3-interpolate@^1.3.2")
          (s."d3-timer@^1.0.9")
          (s."detect-browser@^5.1.0")
          (s."tslib@^2.0.3")
          ];
        "@antv/g-base@^0.5.1" = s."@antv/g-base@0.5.9";
        "@antv/g-base@^0.5.3" = s."@antv/g-base@0.5.9";
        "@antv/g-base@~0.5.6" = s."@antv/g-base@0.5.9";
        "@antv/g-canvas@0.5.12" = f (sc "antv" "g-canvas") "0.5.12" (ir "https://registry.yarnpkg.com/@antv/g-canvas/-/g-canvas-0.5.12.tgz") "2fc40dced6994f074f22341e65d56f7bbd5275f7" [
          (s."@antv/g-base@^0.5.3")
          (s."@antv/g-math@^0.1.6")
          (s."@antv/matrix-util@^3.1.0-beta.1")
          (s."@antv/path-util@~2.0.5")
          (s."@antv/util@~2.0.0")
          (s."gl-matrix@^3.0.0")
          (s."tslib@^2.0.3")
          ];
        "@antv/g-canvas@^0.5.2" = s."@antv/g-canvas@0.5.12";
        "@antv/g-canvas@~0.5.10" = s."@antv/g-canvas@0.5.12";
        "@antv/g-math@0.1.7" = f (sc "antv" "g-math") "0.1.7" (ir "https://registry.yarnpkg.com/@antv/g-math/-/g-math-0.1.7.tgz") "6ec2769269f7ccb67e58140d5739df74046cc04e" [
          (s."@antv/util@~2.0.0")
          (s."gl-matrix@^3.0.0")
          ];
        "@antv/g-math@^0.1.1" = s."@antv/g-math@0.1.7";
        "@antv/g-math@^0.1.6" = s."@antv/g-math@0.1.7";
        "@antv/g-svg@0.5.6" = f (sc "antv" "g-svg") "0.5.6" (ir "https://registry.yarnpkg.com/@antv/g-svg/-/g-svg-0.5.6.tgz") "70b2fa980c431b39ad3c5b4b53e36a1d60957d65" [
          (s."@antv/g-base@^0.5.3")
          (s."@antv/g-math@^0.1.6")
          (s."@antv/util@~2.0.0")
          (s."detect-browser@^5.0.0")
          (s."tslib@^2.0.3")
          ];
        "@antv/g-svg@^0.5.1" = s."@antv/g-svg@0.5.6";
        "@antv/g-svg@^0.5.2" = s."@antv/g-svg@0.5.6";
        "@antv/g-svg@~0.5.6" = s."@antv/g-svg@0.5.6";
        "@antv/g-webgpu-core@0.5.6" = f (sc "antv" "g-webgpu-core") "0.5.6" (ir "https://registry.yarnpkg.com/@antv/g-webgpu-core/-/g-webgpu-core-0.5.6.tgz") "68cde0b5d0b44b5794371c2523682f4734da3c6c" [
          (s."eventemitter3@^4.0.0")
          (s."gl-matrix@^3.1.0")
          (s."inversify@^5.0.1")
          (s."inversify-inject-decorators@^3.1.0")
          (s."probe.gl@^3.1.1")
          (s."reflect-metadata@^0.1.13")
          ];
        "@antv/g-webgpu-core@^0.5.5" = s."@antv/g-webgpu-core@0.5.6";
        "@antv/g-webgpu-core@^0.5.6" = s."@antv/g-webgpu-core@0.5.6";
        "@antv/g-webgpu-engine@0.5.6" = f (sc "antv" "g-webgpu-engine") "0.5.6" (ir "https://registry.yarnpkg.com/@antv/g-webgpu-engine/-/g-webgpu-engine-0.5.6.tgz") "be7c1bf8e4b1822d72a302d628034345e0577bbd" [
          (s."@antv/g-webgpu-core@^0.5.6")
          (s."@webgpu/glslang@^0.0.15")
          (s."@webgpu/types@^0.0.31")
          (s."gl-matrix@^3.1.0")
          (s."hammerjs@^2.0.8")
          (s."inversify@^5.0.1")
          (s."inversify-inject-decorators@^3.1.0")
          (s."probe.gl@^3.1.1")
          (s."reflect-metadata@^0.1.13")
          (s."regl@^1.3.11")
          ];
        "@antv/g-webgpu-engine@^0.5.5" = s."@antv/g-webgpu-engine@0.5.6";
        "@antv/g-webgpu@0.5.5" = f (sc "antv" "g-webgpu") "0.5.5" (ir "https://registry.yarnpkg.com/@antv/g-webgpu/-/g-webgpu-0.5.5.tgz") "003d411453ed03e7dd916bd6c6db26a2b53d1991" [
          (s."@antv/g-webgpu-core@^0.5.5")
          (s."@antv/g-webgpu-engine@^0.5.5")
          (s."@webgpu/types@^0.0.31")
          (s."gl-matrix@^3.1.0")
          (s."gl-vec2@^1.3.0")
          (s."hammerjs@^2.0.8")
          (s."inversify@^5.0.1")
          (s."inversify-inject-decorators@^3.1.0")
          (s."polyline-miter-util@^1.0.1")
          (s."polyline-normals@^2.0.2")
          (s."probe.gl@^3.1.1")
          (s."reflect-metadata@^0.1.13")
          ];
        "@antv/g2@4.1.23" = f (sc "antv" "g2") "4.1.23" (ir "https://registry.yarnpkg.com/@antv/g2/-/g2-4.1.23.tgz") "e2066925070ab3cb0dfefea45214a58e9fd8e242" [
          (s."@antv/adjust@^0.2.1")
          (s."@antv/attr@^0.3.1")
          (s."@antv/color-util@^2.0.2")
          (s."@antv/component@^0.8.7")
          (s."@antv/coord@^0.3.0")
          (s."@antv/dom-util@^2.0.2")
          (s."@antv/event-emitter@~0.1.0")
          (s."@antv/g-base@~0.5.6")
          (s."@antv/g-canvas@~0.5.10")
          (s."@antv/g-svg@~0.5.6")
          (s."@antv/matrix-util@^3.1.0-beta.1")
          (s."@antv/path-util@^2.0.3")
          (s."@antv/scale@^0.3.7")
          (s."@antv/util@~2.0.5")
          (s."tslib@^2.0.0")
          ];
        "@antv/g2@^4.1.19" = s."@antv/g2@4.1.23";
        "@antv/g2plot@2.3.28" = f (sc "antv" "g2plot") "2.3.28" (ir "https://registry.yarnpkg.com/@antv/g2plot/-/g2plot-2.3.28.tgz") "a4169631ab3131c9840fd1ab3ed115835ad3a1b2" [
          (s."@antv/event-emitter@^0.1.2")
          (s."@antv/g2@^4.1.19")
          (s."d3-hierarchy@^2.0.0")
          (s."d3-regression@^1.3.5")
          (s."pdfast@^0.2.0")
          (s."size-sensor@^1.0.1")
          (s."tslib@^2.0.3")
          ];
        "@antv/g2plot@^2.2.11" = s."@antv/g2plot@2.3.28";
        "@antv/g6-core@0.3.5" = f (sc "antv" "g6-core") "0.3.5" (ir "https://registry.yarnpkg.com/@antv/g6-core/-/g6-core-0.3.5.tgz") "53e253241d90d3fd6188df719339cabdb1ddd116" [
          (s."@antv/algorithm@^0.1.8")
          (s."@antv/dom-util@^2.0.1")
          (s."@antv/event-emitter@~0.1.0")
          (s."@antv/g-base@^0.5.1")
          (s."@antv/g-math@^0.1.1")
          (s."@antv/matrix-util@^3.1.0-beta.2")
          (s."@antv/path-util@^2.0.3")
          (s."@antv/util@~2.0.5")
          (s."ml-matrix@^6.5.0")
          (s."tslib@^2.1.0")
          ];
        "@antv/g6-element@0.3.5" = f (sc "antv" "g6-element") "0.3.5" (ir "https://registry.yarnpkg.com/@antv/g6-element/-/g6-element-0.3.5.tgz") "00f74938d8c24ca34fed15841b95b5e1b0e5d8c8" [
          (s."@antv/g-base@^0.5.1")
          (s."@antv/g6-core@0.3.5")
          (s."@antv/util@~2.0.5")
          ];
        "@antv/g6-pc@0.3.5" = f (sc "antv" "g6-pc") "0.3.5" (ir "https://registry.yarnpkg.com/@antv/g6-pc/-/g6-pc-0.3.5.tgz") "4b4d7cea5ef7e8131d9674c77c735e68c0a1cadf" [
          (s."@ant-design/colors@^4.0.5")
          (s."@antv/algorithm@^0.1.8")
          (s."@antv/dom-util@^2.0.1")
          (s."@antv/event-emitter@~0.1.0")
          (s."@antv/g-base@^0.5.1")
          (s."@antv/g-canvas@^0.5.2")
          (s."@antv/g-math@^0.1.1")
          (s."@antv/g-svg@^0.5.1")
          (s."@antv/g6-core@0.3.5")
          (s."@antv/g6-element@0.3.5")
          (s."@antv/g6-plugin@0.3.5")
          (s."@antv/hierarchy@^0.6.7")
          (s."@antv/layout@^0.1.14")
          (s."@antv/matrix-util@^3.0.4")
          (s."@antv/path-util@^2.0.3")
          (s."@antv/util@~2.0.5")
          (s."color@^3.1.3")
          (s."d3-force@^2.0.1")
          (s."dagre@^0.8.5")
          (s."insert-css@^2.0.0")
          (s."ml-matrix@^6.5.0")
          ];
        "@antv/g6-plugin@0.3.5" = f (sc "antv" "g6-plugin") "0.3.5" (ir "https://registry.yarnpkg.com/@antv/g6-plugin/-/g6-plugin-0.3.5.tgz") "3b355f2455f2247f7857ee953d9ce42f8b8e5dbe" [
          (s."@antv/dom-util@^2.0.2")
          (s."@antv/g-base@^0.5.1")
          (s."@antv/g-canvas@^0.5.2")
          (s."@antv/g-svg@^0.5.2")
          (s."@antv/g6-core@0.3.5")
          (s."@antv/matrix-util@^3.0.4")
          (s."@antv/scale@^0.3.4")
          (s."@antv/util@^2.0.9")
          (s."insert-css@^2.0.0")
          ];
        "@antv/g6@4.3.5" = f (sc "antv" "g6") "4.3.5" (ir "https://registry.yarnpkg.com/@antv/g6/-/g6-4.3.5.tgz") "651d7b99238c857d88e82b55d90cace8870f594a" [
          (s."@antv/g6-pc@0.3.5")
          ];
        "@antv/g6@^4.2.4" = s."@antv/g6@4.3.5";
        "@antv/hierarchy@0.6.7" = f (sc "antv" "hierarchy") "0.6.7" (ir "https://registry.yarnpkg.com/@antv/hierarchy/-/hierarchy-0.6.7.tgz") "bccd57a21764c5b71ed8c1cba52817b235b19c5c" [
          (s."@antv/util@^2.0.7")
          ];
        "@antv/hierarchy@^0.6.7" = s."@antv/hierarchy@0.6.7";
        "@antv/layout@0.1.18" = f (sc "antv" "layout") "0.1.18" (ir "https://registry.yarnpkg.com/@antv/layout/-/layout-0.1.18.tgz") "f1e23510fb3035f05fbc2978205efeec3fb878ed" [
          (s."@antv/g-webgpu@0.5.5")
          (s."d3-force@^2.0.1")
          (s."dagre@^0.8.5")
          (s."ml-matrix@^6.5.0")
          ];
        "@antv/layout@^0.1.14" = s."@antv/layout@0.1.18";
        "@antv/matrix-util@3.0.4" = f (sc "antv" "matrix-util") "3.0.4" (ir "https://registry.yarnpkg.com/@antv/matrix-util/-/matrix-util-3.0.4.tgz") "ea13f158aa2fb4ba2fb8d6b6b561ec467ea3ac20" [
          (s."@antv/util@^2.0.9")
          (s."gl-matrix@^3.3.0")
          (s."tslib@^2.0.3")
          ];
        "@antv/matrix-util@3.1.0-beta.2" = f (sc "antv" "matrix-util") "3.1.0-beta.2" (ir "https://registry.yarnpkg.com/@antv/matrix-util/-/matrix-util-3.1.0-beta.2.tgz") "b4afafb70dbdf52affca308d3546c8a090fd23ca" [
          (s."@antv/util@^2.0.9")
          (s."gl-matrix@^3.3.0")
          (s."tslib@^1.10.0")
          ];
        "@antv/matrix-util@^3.0.4" = s."@antv/matrix-util@3.0.4";
        "@antv/matrix-util@^3.1.0-beta.1" = s."@antv/matrix-util@3.1.0-beta.2";
        "@antv/matrix-util@^3.1.0-beta.2" = s."@antv/matrix-util@3.1.0-beta.2";
        "@antv/path-util@2.0.9" = f (sc "antv" "path-util") "2.0.9" (ir "https://registry.yarnpkg.com/@antv/path-util/-/path-util-2.0.9.tgz") "976e4a3cfb6219767a602d297b205c88d66d7b2c" [
          (s."@antv/util@^2.0.9")
          (s."tslib@^2.0.3")
          ];
        "@antv/path-util@^2.0.3" = s."@antv/path-util@2.0.9";
        "@antv/path-util@~2.0.5" = s."@antv/path-util@2.0.9";
        "@antv/path-util@~2.0.7" = s."@antv/path-util@2.0.9";
        "@antv/scale@0.3.12" = f (sc "antv" "scale") "0.3.12" (ir "https://registry.yarnpkg.com/@antv/scale/-/scale-0.3.12.tgz") "47dbba3e30f230bd6d27ca31d4204106608650db" [
          (s."@antv/util@~2.0.3")
          (s."fecha@~4.2.0")
          (s."tslib@^2.0.0")
          ];
        "@antv/scale@^0.3.4" = s."@antv/scale@0.3.12";
        "@antv/scale@^0.3.7" = s."@antv/scale@0.3.12";
        "@antv/scale@~0.3.1" = s."@antv/scale@0.3.12";
        "@antv/util@2.0.14" = f (sc "antv" "util") "2.0.14" (ir "https://registry.yarnpkg.com/@antv/util/-/util-2.0.14.tgz") "1ac8c4f790beaf6572daecf62df6aa55fa0a31df" [
          (s."tslib@^2.0.3")
          ];
        "@antv/util@^2.0.13" = s."@antv/util@2.0.14";
        "@antv/util@^2.0.7" = s."@antv/util@2.0.14";
        "@antv/util@^2.0.9" = s."@antv/util@2.0.14";
        "@antv/util@~2.0.0" = s."@antv/util@2.0.14";
        "@antv/util@~2.0.12" = s."@antv/util@2.0.14";
        "@antv/util@~2.0.3" = s."@antv/util@2.0.14";
        "@antv/util@~2.0.5" = s."@antv/util@2.0.14";
        "@apollo/client@3.4.13" = f (sc "apollo" "client") "3.4.13" (ir "https://registry.yarnpkg.com/@apollo/client/-/client-3.4.13.tgz") "81670c27b376e80e3845ecf6468e534d908fa5b5" [
          (s."@graphql-typed-document-node/core@^3.0.0")
          (s."@wry/context@^0.6.0")
          (s."@wry/equality@^0.5.0")
          (s."@wry/trie@^0.3.0")
          (s."graphql-tag@^2.12.3")
          (s."hoist-non-react-statics@^3.3.2")
          (s."optimism@^0.16.1")
          (s."prop-types@^15.7.2")
          (s."symbol-observable@^4.0.0")
          (s."ts-invariant@^0.9.0")
          (s."tslib@^2.3.0")
          (s."zen-observable-ts@~1.1.0")
          ];
        "@apollo/client@^3.4.13" = s."@apollo/client@3.4.13";
        "@apollo/federation@0.27.0" = f (sc "apollo" "federation") "0.27.0" (ir "https://registry.yarnpkg.com/@apollo/federation/-/federation-0.27.0.tgz") "2ee13b28cff94817ff07bb02215aa764d8becba3" [
          (s."apollo-graphql@^0.9.3")
          (s."lodash.xorby@^4.7.0")
          ];
        "@apollographql/apollo-tools@0.5.1" = f (sc "apollographql" "apollo-tools") "0.5.1" (ir "https://registry.yarnpkg.com/@apollographql/apollo-tools/-/apollo-tools-0.5.1.tgz") "f0baef739ff7e2fafcb8b98ad29f6ac817e53e32" [];
        "@apollographql/apollo-tools@^0.5.1" = s."@apollographql/apollo-tools@0.5.1";
        "@apollographql/graphql-language-service-interface@2.0.2" = f (sc "apollographql" "graphql-language-service-interface") "2.0.2" (ir "https://registry.yarnpkg.com/@apollographql/graphql-language-service-interface/-/graphql-language-service-interface-2.0.2.tgz") "0e793636eca3d2ee0f818602d52fb5dab9edc0e3" [
          (s."@apollographql/graphql-language-service-parser@^2.0.0")
          (s."@apollographql/graphql-language-service-types@^2.0.0")
          (s."@apollographql/graphql-language-service-utils@^2.0.2")
          ];
        "@apollographql/graphql-language-service-interface@^2.0.2" = s."@apollographql/graphql-language-service-interface@2.0.2";
        "@apollographql/graphql-language-service-parser@2.0.2" = f (sc "apollographql" "graphql-language-service-parser") "2.0.2" (ir "https://registry.yarnpkg.com/@apollographql/graphql-language-service-parser/-/graphql-language-service-parser-2.0.2.tgz") "50cb7a6c3e331eae09f6de13101da688dab261f1" [
          (s."@apollographql/graphql-language-service-types@^2.0.0")
          ];
        "@apollographql/graphql-language-service-parser@^2.0.0" = s."@apollographql/graphql-language-service-parser@2.0.2";
        "@apollographql/graphql-language-service-types@2.0.2" = f (sc "apollographql" "graphql-language-service-types") "2.0.2" (ir "https://registry.yarnpkg.com/@apollographql/graphql-language-service-types/-/graphql-language-service-types-2.0.2.tgz") "1034e47eb7479129959c1bed2ee12d874aab5cab" [];
        "@apollographql/graphql-language-service-types@^2.0.0" = s."@apollographql/graphql-language-service-types@2.0.2";
        "@apollographql/graphql-language-service-utils@2.0.2" = f (sc "apollographql" "graphql-language-service-utils") "2.0.2" (ir "https://registry.yarnpkg.com/@apollographql/graphql-language-service-utils/-/graphql-language-service-utils-2.0.2.tgz") "aa552c31de16172433bbdbc03914585caaca1d03" [
          (s."@apollographql/graphql-language-service-types@^2.0.0")
          ];
        "@apollographql/graphql-language-service-utils@^2.0.2" = s."@apollographql/graphql-language-service-utils@2.0.2";
        "@babel/code-frame@7.10.4" = f (sc "babel" "code-frame") "7.10.4" (ir "https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.10.4.tgz") "168da1a36e90da68ae8d49c0f1b48c7c6249213a" [
          (s."@babel/highlight@^7.10.4")
          ];
        "@babel/code-frame@7.12.11" = f (sc "babel" "code-frame") "7.12.11" (ir "https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.12.11.tgz") "f4ad435aa263db935b8f10f2c552d23fb716a63f" [
          (s."@babel/highlight@^7.10.4")
          ];
        "@babel/code-frame@7.14.5" = f (sc "babel" "code-frame") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.14.5.tgz") "23b08d740e83f49c5e59945fbf1b43e80bbf4edb" [
          (s."@babel/highlight@^7.14.5")
          ];
        "@babel/code-frame@^7.0.0" = s."@babel/code-frame@7.14.5";
        "@babel/code-frame@^7.10.4" = s."@babel/code-frame@7.14.5";
        "@babel/code-frame@^7.14.5" = s."@babel/code-frame@7.14.5";
        "@babel/code-frame@^7.5.5" = s."@babel/code-frame@7.14.5";
        "@babel/compat-data@7.15.0" = f (sc "babel" "compat-data") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/compat-data/-/compat-data-7.15.0.tgz") "2dbaf8b85334796cafbb0f5793a90a2fc010b176" [];
        "@babel/compat-data@^7.12.1" = s."@babel/compat-data@7.15.0";
        "@babel/compat-data@^7.13.11" = s."@babel/compat-data@7.15.0";
        "@babel/compat-data@^7.14.7" = s."@babel/compat-data@7.15.0";
        "@babel/compat-data@^7.15.0" = s."@babel/compat-data@7.15.0";
        "@babel/core@7.12.3" = f (sc "babel" "core") "7.12.3" (ir "https://registry.yarnpkg.com/@babel/core/-/core-7.12.3.tgz") "1b436884e1e3bff6fb1328dc02b208759de92ad8" [
          (s."@babel/code-frame@^7.10.4")
          (s."@babel/generator@^7.12.1")
          (s."@babel/helper-module-transforms@^7.12.1")
          (s."@babel/helpers@^7.12.1")
          (s."@babel/parser@^7.12.3")
          (s."@babel/template@^7.10.4")
          (s."@babel/traverse@^7.12.1")
          (s."@babel/types@^7.12.1")
          (s."convert-source-map@^1.7.0")
          (s."debug@^4.1.0")
          (s."gensync@^1.0.0-beta.1")
          (s."json5@^2.1.2")
          (s."lodash@^4.17.19")
          (s."resolve@^1.3.2")
          (s."semver@^5.4.1")
          (s."source-map@^0.5.0")
          ];
        "@babel/core@7.15.0" = f (sc "babel" "core") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/core/-/core-7.15.0.tgz") "749e57c68778b73ad8082775561f67f5196aafa8" [
          (s."@babel/code-frame@^7.14.5")
          (s."@babel/generator@^7.15.0")
          (s."@babel/helper-compilation-targets@^7.15.0")
          (s."@babel/helper-module-transforms@^7.15.0")
          (s."@babel/helpers@^7.14.8")
          (s."@babel/parser@^7.15.0")
          (s."@babel/template@^7.14.5")
          (s."@babel/traverse@^7.15.0")
          (s."@babel/types@^7.15.0")
          (s."convert-source-map@^1.7.0")
          (s."debug@^4.1.0")
          (s."gensync@^1.0.0-beta.2")
          (s."json5@^2.1.2")
          (s."semver@^6.3.0")
          (s."source-map@^0.5.0")
          ];
        "@babel/core@^7.1.0" = s."@babel/core@7.15.0";
        "@babel/core@^7.12.3" = s."@babel/core@7.15.0";
        "@babel/core@^7.7.5" = s."@babel/core@7.15.0";
        "@babel/core@^7.8.4" = s."@babel/core@7.15.0";
        "@babel/generator@7.14.8" = f (sc "babel" "generator") "7.14.8" (ir "https://registry.yarnpkg.com/@babel/generator/-/generator-7.14.8.tgz") "bf86fd6af96cf3b74395a8ca409515f89423e070" [
          (s."@babel/types@^7.14.8")
          (s."jsesc@^2.5.1")
          (s."source-map@^0.5.0")
          ];
        "@babel/generator@7.15.0" = f (sc "babel" "generator") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/generator/-/generator-7.15.0.tgz") "a7d0c172e0d814974bad5aa77ace543b97917f15" [
          (s."@babel/types@^7.15.0")
          (s."jsesc@^2.5.1")
          (s."source-map@^0.5.0")
          ];
        "@babel/generator@^7.12.1" = s."@babel/generator@7.15.0";
        "@babel/generator@^7.15.0" = s."@babel/generator@7.15.0";
        "@babel/helper-annotate-as-pure@7.14.5" = f (sc "babel" "helper-annotate-as-pure") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.14.5.tgz") "7bf478ec3b71726d56a8ca5775b046fc29879e61" [
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-annotate-as-pure@^7.14.5" = s."@babel/helper-annotate-as-pure@7.14.5";
        "@babel/helper-builder-binary-assignment-operator-visitor@7.14.5" = f (sc "babel" "helper-builder-binary-assignment-operator-visitor") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-builder-binary-assignment-operator-visitor/-/helper-builder-binary-assignment-operator-visitor-7.14.5.tgz") "b939b43f8c37765443a19ae74ad8b15978e0a191" [
          (s."@babel/helper-explode-assignable-expression@^7.14.5")
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-builder-binary-assignment-operator-visitor@^7.14.5" = s."@babel/helper-builder-binary-assignment-operator-visitor@7.14.5";
        "@babel/helper-compilation-targets@7.15.0" = f (sc "babel" "helper-compilation-targets") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/helper-compilation-targets/-/helper-compilation-targets-7.15.0.tgz") "973df8cbd025515f3ff25db0c05efc704fa79818" [
          (s."@babel/compat-data@^7.15.0")
          (s."@babel/helper-validator-option@^7.14.5")
          (s."browserslist@^4.16.6")
          (s."semver@^6.3.0")
          ];
        "@babel/helper-compilation-targets@^7.12.1" = s."@babel/helper-compilation-targets@7.15.0";
        "@babel/helper-compilation-targets@^7.13.0" = s."@babel/helper-compilation-targets@7.15.0";
        "@babel/helper-compilation-targets@^7.14.5" = s."@babel/helper-compilation-targets@7.15.0";
        "@babel/helper-compilation-targets@^7.15.0" = s."@babel/helper-compilation-targets@7.15.0";
        "@babel/helper-create-class-features-plugin@7.15.0" = f (sc "babel" "helper-create-class-features-plugin") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.15.0.tgz") "c9a137a4d137b2d0e2c649acf536d7ba1a76c0f7" [
          (s."@babel/helper-annotate-as-pure@^7.14.5")
          (s."@babel/helper-function-name@^7.14.5")
          (s."@babel/helper-member-expression-to-functions@^7.15.0")
          (s."@babel/helper-optimise-call-expression@^7.14.5")
          (s."@babel/helper-replace-supers@^7.15.0")
          (s."@babel/helper-split-export-declaration@^7.14.5")
          ];
        "@babel/helper-create-class-features-plugin@^7.12.1" = s."@babel/helper-create-class-features-plugin@7.15.0";
        "@babel/helper-create-class-features-plugin@^7.14.5" = s."@babel/helper-create-class-features-plugin@7.15.0";
        "@babel/helper-create-class-features-plugin@^7.15.0" = s."@babel/helper-create-class-features-plugin@7.15.0";
        "@babel/helper-create-regexp-features-plugin@7.14.5" = f (sc "babel" "helper-create-regexp-features-plugin") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-create-regexp-features-plugin/-/helper-create-regexp-features-plugin-7.14.5.tgz") "c7d5ac5e9cf621c26057722fb7a8a4c5889358c4" [
          (s."@babel/helper-annotate-as-pure@^7.14.5")
          (s."regexpu-core@^4.7.1")
          ];
        "@babel/helper-create-regexp-features-plugin@^7.14.5" = s."@babel/helper-create-regexp-features-plugin@7.14.5";
        "@babel/helper-define-polyfill-provider@0.2.3" = f (sc "babel" "helper-define-polyfill-provider") "0.2.3" (ir "https://registry.yarnpkg.com/@babel/helper-define-polyfill-provider/-/helper-define-polyfill-provider-0.2.3.tgz") "0525edec5094653a282688d34d846e4c75e9c0b6" [
          (s."@babel/helper-compilation-targets@^7.13.0")
          (s."@babel/helper-module-imports@^7.12.13")
          (s."@babel/helper-plugin-utils@^7.13.0")
          (s."@babel/traverse@^7.13.0")
          (s."debug@^4.1.1")
          (s."lodash.debounce@^4.0.8")
          (s."resolve@^1.14.2")
          (s."semver@^6.1.2")
          ];
        "@babel/helper-define-polyfill-provider@^0.2.2" = s."@babel/helper-define-polyfill-provider@0.2.3";
        "@babel/helper-explode-assignable-expression@7.14.5" = f (sc "babel" "helper-explode-assignable-expression") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-explode-assignable-expression/-/helper-explode-assignable-expression-7.14.5.tgz") "8aa72e708205c7bb643e45c73b4386cdf2a1f645" [
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-explode-assignable-expression@^7.14.5" = s."@babel/helper-explode-assignable-expression@7.14.5";
        "@babel/helper-function-name@7.14.5" = f (sc "babel" "helper-function-name") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-function-name/-/helper-function-name-7.14.5.tgz") "89e2c474972f15d8e233b52ee8c480e2cfcd50c4" [
          (s."@babel/helper-get-function-arity@^7.14.5")
          (s."@babel/template@^7.14.5")
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-function-name@^7.14.5" = s."@babel/helper-function-name@7.14.5";
        "@babel/helper-get-function-arity@7.14.5" = f (sc "babel" "helper-get-function-arity") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-get-function-arity/-/helper-get-function-arity-7.14.5.tgz") "25fbfa579b0937eee1f3b805ece4ce398c431815" [
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-get-function-arity@^7.14.5" = s."@babel/helper-get-function-arity@7.14.5";
        "@babel/helper-hoist-variables@7.14.5" = f (sc "babel" "helper-hoist-variables") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-hoist-variables/-/helper-hoist-variables-7.14.5.tgz") "e0dd27c33a78e577d7c8884916a3e7ef1f7c7f8d" [
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-hoist-variables@^7.14.5" = s."@babel/helper-hoist-variables@7.14.5";
        "@babel/helper-member-expression-to-functions@7.15.0" = f (sc "babel" "helper-member-expression-to-functions") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/helper-member-expression-to-functions/-/helper-member-expression-to-functions-7.15.0.tgz") "0ddaf5299c8179f27f37327936553e9bba60990b" [
          (s."@babel/types@^7.15.0")
          ];
        "@babel/helper-member-expression-to-functions@^7.15.0" = s."@babel/helper-member-expression-to-functions@7.15.0";
        "@babel/helper-module-imports@7.14.5" = f (sc "babel" "helper-module-imports") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-module-imports/-/helper-module-imports-7.14.5.tgz") "6d1a44df6a38c957aa7c312da076429f11b422f3" [
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-module-imports@^7.0.0" = s."@babel/helper-module-imports@7.14.5";
        "@babel/helper-module-imports@^7.12.1" = s."@babel/helper-module-imports@7.14.5";
        "@babel/helper-module-imports@^7.12.13" = s."@babel/helper-module-imports@7.14.5";
        "@babel/helper-module-imports@^7.14.5" = s."@babel/helper-module-imports@7.14.5";
        "@babel/helper-module-transforms@7.15.0" = f (sc "babel" "helper-module-transforms") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/helper-module-transforms/-/helper-module-transforms-7.15.0.tgz") "679275581ea056373eddbe360e1419ef23783b08" [
          (s."@babel/helper-module-imports@^7.14.5")
          (s."@babel/helper-replace-supers@^7.15.0")
          (s."@babel/helper-simple-access@^7.14.8")
          (s."@babel/helper-split-export-declaration@^7.14.5")
          (s."@babel/helper-validator-identifier@^7.14.9")
          (s."@babel/template@^7.14.5")
          (s."@babel/traverse@^7.15.0")
          (s."@babel/types@^7.15.0")
          ];
        "@babel/helper-module-transforms@^7.12.1" = s."@babel/helper-module-transforms@7.15.0";
        "@babel/helper-module-transforms@^7.14.5" = s."@babel/helper-module-transforms@7.15.0";
        "@babel/helper-module-transforms@^7.15.0" = s."@babel/helper-module-transforms@7.15.0";
        "@babel/helper-optimise-call-expression@7.14.5" = f (sc "babel" "helper-optimise-call-expression") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-optimise-call-expression/-/helper-optimise-call-expression-7.14.5.tgz") "f27395a8619e0665b3f0364cddb41c25d71b499c" [
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-optimise-call-expression@^7.14.5" = s."@babel/helper-optimise-call-expression@7.14.5";
        "@babel/helper-plugin-utils@7.14.5" = f (sc "babel" "helper-plugin-utils") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-plugin-utils/-/helper-plugin-utils-7.14.5.tgz") "5ac822ce97eec46741ab70a517971e443a70c5a9" [];
        "@babel/helper-plugin-utils@^7.0.0" = s."@babel/helper-plugin-utils@7.14.5";
        "@babel/helper-plugin-utils@^7.10.4" = s."@babel/helper-plugin-utils@7.14.5";
        "@babel/helper-plugin-utils@^7.12.13" = s."@babel/helper-plugin-utils@7.14.5";
        "@babel/helper-plugin-utils@^7.13.0" = s."@babel/helper-plugin-utils@7.14.5";
        "@babel/helper-plugin-utils@^7.14.5" = s."@babel/helper-plugin-utils@7.14.5";
        "@babel/helper-plugin-utils@^7.8.0" = s."@babel/helper-plugin-utils@7.14.5";
        "@babel/helper-plugin-utils@^7.8.3" = s."@babel/helper-plugin-utils@7.14.5";
        "@babel/helper-remap-async-to-generator@7.14.5" = f (sc "babel" "helper-remap-async-to-generator") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-remap-async-to-generator/-/helper-remap-async-to-generator-7.14.5.tgz") "51439c913612958f54a987a4ffc9ee587a2045d6" [
          (s."@babel/helper-annotate-as-pure@^7.14.5")
          (s."@babel/helper-wrap-function@^7.14.5")
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-remap-async-to-generator@^7.14.5" = s."@babel/helper-remap-async-to-generator@7.14.5";
        "@babel/helper-replace-supers@7.15.0" = f (sc "babel" "helper-replace-supers") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/helper-replace-supers/-/helper-replace-supers-7.15.0.tgz") "ace07708f5bf746bf2e6ba99572cce79b5d4e7f4" [
          (s."@babel/helper-member-expression-to-functions@^7.15.0")
          (s."@babel/helper-optimise-call-expression@^7.14.5")
          (s."@babel/traverse@^7.15.0")
          (s."@babel/types@^7.15.0")
          ];
        "@babel/helper-replace-supers@^7.14.5" = s."@babel/helper-replace-supers@7.15.0";
        "@babel/helper-replace-supers@^7.15.0" = s."@babel/helper-replace-supers@7.15.0";
        "@babel/helper-simple-access@7.14.8" = f (sc "babel" "helper-simple-access") "7.14.8" (ir "https://registry.yarnpkg.com/@babel/helper-simple-access/-/helper-simple-access-7.14.8.tgz") "82e1fec0644a7e775c74d305f212c39f8fe73924" [
          (s."@babel/types@^7.14.8")
          ];
        "@babel/helper-simple-access@^7.14.8" = s."@babel/helper-simple-access@7.14.8";
        "@babel/helper-skip-transparent-expression-wrappers@7.14.5" = f (sc "babel" "helper-skip-transparent-expression-wrappers") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-skip-transparent-expression-wrappers/-/helper-skip-transparent-expression-wrappers-7.14.5.tgz") "96f486ac050ca9f44b009fbe5b7d394cab3a0ee4" [
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-skip-transparent-expression-wrappers@^7.12.1" = s."@babel/helper-skip-transparent-expression-wrappers@7.14.5";
        "@babel/helper-skip-transparent-expression-wrappers@^7.14.5" = s."@babel/helper-skip-transparent-expression-wrappers@7.14.5";
        "@babel/helper-split-export-declaration@7.14.5" = f (sc "babel" "helper-split-export-declaration") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-split-export-declaration/-/helper-split-export-declaration-7.14.5.tgz") "22b23a54ef51c2b7605d851930c1976dd0bc693a" [
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-split-export-declaration@^7.14.5" = s."@babel/helper-split-export-declaration@7.14.5";
        "@babel/helper-validator-identifier@7.14.9" = f (sc "babel" "helper-validator-identifier") "7.14.9" (ir "https://registry.yarnpkg.com/@babel/helper-validator-identifier/-/helper-validator-identifier-7.14.9.tgz") "6654d171b2024f6d8ee151bf2509699919131d48" [];
        "@babel/helper-validator-identifier@7.15.7" = f (sc "babel" "helper-validator-identifier") "7.15.7" (ir "https://registry.yarnpkg.com/@babel/helper-validator-identifier/-/helper-validator-identifier-7.15.7.tgz") "220df993bfe904a4a6b02ab4f3385a5ebf6e2389" [];
        "@babel/helper-validator-identifier@^7.14.5" = s."@babel/helper-validator-identifier@7.14.9";
        "@babel/helper-validator-identifier@^7.14.8" = s."@babel/helper-validator-identifier@7.15.7";
        "@babel/helper-validator-identifier@^7.14.9" = s."@babel/helper-validator-identifier@7.14.9";
        "@babel/helper-validator-option@7.14.5" = f (sc "babel" "helper-validator-option") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-validator-option/-/helper-validator-option-7.14.5.tgz") "6e72a1fff18d5dfcb878e1e62f1a021c4b72d5a3" [];
        "@babel/helper-validator-option@^7.12.1" = s."@babel/helper-validator-option@7.14.5";
        "@babel/helper-validator-option@^7.14.5" = s."@babel/helper-validator-option@7.14.5";
        "@babel/helper-wrap-function@7.14.5" = f (sc "babel" "helper-wrap-function") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/helper-wrap-function/-/helper-wrap-function-7.14.5.tgz") "5919d115bf0fe328b8a5d63bcb610f51601f2bff" [
          (s."@babel/helper-function-name@^7.14.5")
          (s."@babel/template@^7.14.5")
          (s."@babel/traverse@^7.14.5")
          (s."@babel/types@^7.14.5")
          ];
        "@babel/helper-wrap-function@^7.14.5" = s."@babel/helper-wrap-function@7.14.5";
        "@babel/helpers@7.14.8" = f (sc "babel" "helpers") "7.14.8" (ir "https://registry.yarnpkg.com/@babel/helpers/-/helpers-7.14.8.tgz") "839f88f463025886cff7f85a35297007e2da1b77" [
          (s."@babel/template@^7.14.5")
          (s."@babel/traverse@^7.14.8")
          (s."@babel/types@^7.14.8")
          ];
        "@babel/helpers@^7.12.1" = s."@babel/helpers@7.14.8";
        "@babel/helpers@^7.14.8" = s."@babel/helpers@7.14.8";
        "@babel/highlight@7.14.5" = f (sc "babel" "highlight") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/highlight/-/highlight-7.14.5.tgz") "6861a52f03966405001f6aa534a01a24d99e8cd9" [
          (s."@babel/helper-validator-identifier@^7.14.5")
          (s."chalk@^2.0.0")
          (s."js-tokens@^4.0.0")
          ];
        "@babel/highlight@^7.10.4" = s."@babel/highlight@7.14.5";
        "@babel/highlight@^7.14.5" = s."@babel/highlight@7.14.5";
        "@babel/parser@7.15.0" = f (sc "babel" "parser") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/parser/-/parser-7.15.0.tgz") "b6d6e29058ca369127b0eeca2a1c4b5794f1b6b9" [];
        "@babel/parser@7.15.7" = f (sc "babel" "parser") "7.15.7" (ir "https://registry.yarnpkg.com/@babel/parser/-/parser-7.15.7.tgz") "0c3ed4a2eb07b165dfa85b3cc45c727334c4edae" [];
        "@babel/parser@^7.1.0" = s."@babel/parser@7.15.0";
        "@babel/parser@^7.1.3" = s."@babel/parser@7.15.7";
        "@babel/parser@^7.12.3" = s."@babel/parser@7.15.0";
        "@babel/parser@^7.14.5" = s."@babel/parser@7.15.0";
        "@babel/parser@^7.15.0" = s."@babel/parser@7.15.0";
        "@babel/parser@^7.7.0" = s."@babel/parser@7.15.0";
        "@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@7.14.5" = f (sc "babel" "plugin-bugfix-v8-spread-parameters-in-optional-chaining") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining/-/plugin-bugfix-v8-spread-parameters-in-optional-chaining-7.14.5.tgz") "4b467302e1548ed3b1be43beae2cc9cf45e0bb7e" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-skip-transparent-expression-wrappers@^7.14.5")
          (s."@babel/plugin-proposal-optional-chaining@^7.14.5")
          ];
        "@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@^7.14.5" = s."@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@7.14.5";
        "@babel/plugin-proposal-async-generator-functions@7.14.9" = f (sc "babel" "plugin-proposal-async-generator-functions") "7.14.9" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-async-generator-functions/-/plugin-proposal-async-generator-functions-7.14.9.tgz") "7028dc4fa21dc199bbacf98b39bab1267d0eaf9a" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-remap-async-to-generator@^7.14.5")
          (s."@babel/plugin-syntax-async-generators@^7.8.4")
          ];
        "@babel/plugin-proposal-async-generator-functions@^7.12.1" = s."@babel/plugin-proposal-async-generator-functions@7.14.9";
        "@babel/plugin-proposal-async-generator-functions@^7.14.9" = s."@babel/plugin-proposal-async-generator-functions@7.14.9";
        "@babel/plugin-proposal-class-properties@7.12.1" = f (sc "babel" "plugin-proposal-class-properties") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-class-properties/-/plugin-proposal-class-properties-7.12.1.tgz") "a082ff541f2a29a4821065b8add9346c0c16e5de" [
          (s."@babel/helper-create-class-features-plugin@^7.12.1")
          (s."@babel/helper-plugin-utils@^7.10.4")
          ];
        "@babel/plugin-proposal-class-properties@7.14.5" = f (sc "babel" "plugin-proposal-class-properties") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-class-properties/-/plugin-proposal-class-properties-7.14.5.tgz") "40d1ee140c5b1e31a350f4f5eed945096559b42e" [
          (s."@babel/helper-create-class-features-plugin@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-proposal-class-properties@^7.12.1" = s."@babel/plugin-proposal-class-properties@7.14.5";
        "@babel/plugin-proposal-class-properties@^7.14.5" = s."@babel/plugin-proposal-class-properties@7.14.5";
        "@babel/plugin-proposal-class-static-block@7.14.5" = f (sc "babel" "plugin-proposal-class-static-block") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-class-static-block/-/plugin-proposal-class-static-block-7.14.5.tgz") "158e9e10d449c3849ef3ecde94a03d9f1841b681" [
          (s."@babel/helper-create-class-features-plugin@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-class-static-block@^7.14.5")
          ];
        "@babel/plugin-proposal-class-static-block@^7.14.5" = s."@babel/plugin-proposal-class-static-block@7.14.5";
        "@babel/plugin-proposal-decorators@7.12.1" = f (sc "babel" "plugin-proposal-decorators") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-decorators/-/plugin-proposal-decorators-7.12.1.tgz") "59271439fed4145456c41067450543aee332d15f" [
          (s."@babel/helper-create-class-features-plugin@^7.12.1")
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."@babel/plugin-syntax-decorators@^7.12.1")
          ];
        "@babel/plugin-proposal-dynamic-import@7.14.5" = f (sc "babel" "plugin-proposal-dynamic-import") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-dynamic-import/-/plugin-proposal-dynamic-import-7.14.5.tgz") "0c6617df461c0c1f8fff3b47cd59772360101d2c" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-dynamic-import@^7.8.3")
          ];
        "@babel/plugin-proposal-dynamic-import@^7.12.1" = s."@babel/plugin-proposal-dynamic-import@7.14.5";
        "@babel/plugin-proposal-dynamic-import@^7.14.5" = s."@babel/plugin-proposal-dynamic-import@7.14.5";
        "@babel/plugin-proposal-export-namespace-from@7.14.5" = f (sc "babel" "plugin-proposal-export-namespace-from") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-export-namespace-from/-/plugin-proposal-export-namespace-from-7.14.5.tgz") "dbad244310ce6ccd083072167d8cea83a52faf76" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-export-namespace-from@^7.8.3")
          ];
        "@babel/plugin-proposal-export-namespace-from@^7.12.1" = s."@babel/plugin-proposal-export-namespace-from@7.14.5";
        "@babel/plugin-proposal-export-namespace-from@^7.14.5" = s."@babel/plugin-proposal-export-namespace-from@7.14.5";
        "@babel/plugin-proposal-json-strings@7.14.5" = f (sc "babel" "plugin-proposal-json-strings") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-json-strings/-/plugin-proposal-json-strings-7.14.5.tgz") "38de60db362e83a3d8c944ac858ddf9f0c2239eb" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-json-strings@^7.8.3")
          ];
        "@babel/plugin-proposal-json-strings@^7.12.1" = s."@babel/plugin-proposal-json-strings@7.14.5";
        "@babel/plugin-proposal-json-strings@^7.14.5" = s."@babel/plugin-proposal-json-strings@7.14.5";
        "@babel/plugin-proposal-logical-assignment-operators@7.14.5" = f (sc "babel" "plugin-proposal-logical-assignment-operators") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-logical-assignment-operators/-/plugin-proposal-logical-assignment-operators-7.14.5.tgz") "6e6229c2a99b02ab2915f82571e0cc646a40c738" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-logical-assignment-operators@^7.10.4")
          ];
        "@babel/plugin-proposal-logical-assignment-operators@^7.12.1" = s."@babel/plugin-proposal-logical-assignment-operators@7.14.5";
        "@babel/plugin-proposal-logical-assignment-operators@^7.14.5" = s."@babel/plugin-proposal-logical-assignment-operators@7.14.5";
        "@babel/plugin-proposal-nullish-coalescing-operator@7.12.1" = f (sc "babel" "plugin-proposal-nullish-coalescing-operator") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-nullish-coalescing-operator/-/plugin-proposal-nullish-coalescing-operator-7.12.1.tgz") "3ed4fff31c015e7f3f1467f190dbe545cd7b046c" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."@babel/plugin-syntax-nullish-coalescing-operator@^7.8.0")
          ];
        "@babel/plugin-proposal-nullish-coalescing-operator@7.14.5" = f (sc "babel" "plugin-proposal-nullish-coalescing-operator") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-nullish-coalescing-operator/-/plugin-proposal-nullish-coalescing-operator-7.14.5.tgz") "ee38589ce00e2cc59b299ec3ea406fcd3a0fdaf6" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-nullish-coalescing-operator@^7.8.3")
          ];
        "@babel/plugin-proposal-nullish-coalescing-operator@^7.12.1" = s."@babel/plugin-proposal-nullish-coalescing-operator@7.14.5";
        "@babel/plugin-proposal-nullish-coalescing-operator@^7.14.5" = s."@babel/plugin-proposal-nullish-coalescing-operator@7.14.5";
        "@babel/plugin-proposal-numeric-separator@7.12.1" = f (sc "babel" "plugin-proposal-numeric-separator") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-numeric-separator/-/plugin-proposal-numeric-separator-7.12.1.tgz") "0e2c6774c4ce48be412119b4d693ac777f7685a6" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."@babel/plugin-syntax-numeric-separator@^7.10.4")
          ];
        "@babel/plugin-proposal-numeric-separator@7.14.5" = f (sc "babel" "plugin-proposal-numeric-separator") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-numeric-separator/-/plugin-proposal-numeric-separator-7.14.5.tgz") "83631bf33d9a51df184c2102a069ac0c58c05f18" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-numeric-separator@^7.10.4")
          ];
        "@babel/plugin-proposal-numeric-separator@^7.12.1" = s."@babel/plugin-proposal-numeric-separator@7.14.5";
        "@babel/plugin-proposal-numeric-separator@^7.14.5" = s."@babel/plugin-proposal-numeric-separator@7.14.5";
        "@babel/plugin-proposal-object-rest-spread@7.14.7" = f (sc "babel" "plugin-proposal-object-rest-spread") "7.14.7" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-object-rest-spread/-/plugin-proposal-object-rest-spread-7.14.7.tgz") "5920a2b3df7f7901df0205974c0641b13fd9d363" [
          (s."@babel/compat-data@^7.14.7")
          (s."@babel/helper-compilation-targets@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-object-rest-spread@^7.8.3")
          (s."@babel/plugin-transform-parameters@^7.14.5")
          ];
        "@babel/plugin-proposal-object-rest-spread@^7.12.1" = s."@babel/plugin-proposal-object-rest-spread@7.14.7";
        "@babel/plugin-proposal-object-rest-spread@^7.14.7" = s."@babel/plugin-proposal-object-rest-spread@7.14.7";
        "@babel/plugin-proposal-optional-catch-binding@7.14.5" = f (sc "babel" "plugin-proposal-optional-catch-binding") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-optional-catch-binding/-/plugin-proposal-optional-catch-binding-7.14.5.tgz") "939dd6eddeff3a67fdf7b3f044b5347262598c3c" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-optional-catch-binding@^7.8.3")
          ];
        "@babel/plugin-proposal-optional-catch-binding@^7.12.1" = s."@babel/plugin-proposal-optional-catch-binding@7.14.5";
        "@babel/plugin-proposal-optional-catch-binding@^7.14.5" = s."@babel/plugin-proposal-optional-catch-binding@7.14.5";
        "@babel/plugin-proposal-optional-chaining@7.12.1" = f (sc "babel" "plugin-proposal-optional-chaining") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-optional-chaining/-/plugin-proposal-optional-chaining-7.12.1.tgz") "cce122203fc8a32794296fc377c6dedaf4363797" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."@babel/helper-skip-transparent-expression-wrappers@^7.12.1")
          (s."@babel/plugin-syntax-optional-chaining@^7.8.0")
          ];
        "@babel/plugin-proposal-optional-chaining@7.14.5" = f (sc "babel" "plugin-proposal-optional-chaining") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-optional-chaining/-/plugin-proposal-optional-chaining-7.14.5.tgz") "fa83651e60a360e3f13797eef00b8d519695b603" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-skip-transparent-expression-wrappers@^7.14.5")
          (s."@babel/plugin-syntax-optional-chaining@^7.8.3")
          ];
        "@babel/plugin-proposal-optional-chaining@^7.12.1" = s."@babel/plugin-proposal-optional-chaining@7.14.5";
        "@babel/plugin-proposal-optional-chaining@^7.14.5" = s."@babel/plugin-proposal-optional-chaining@7.14.5";
        "@babel/plugin-proposal-private-methods@7.14.5" = f (sc "babel" "plugin-proposal-private-methods") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-private-methods/-/plugin-proposal-private-methods-7.14.5.tgz") "37446495996b2945f30f5be5b60d5e2aa4f5792d" [
          (s."@babel/helper-create-class-features-plugin@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-proposal-private-methods@^7.12.1" = s."@babel/plugin-proposal-private-methods@7.14.5";
        "@babel/plugin-proposal-private-methods@^7.14.5" = s."@babel/plugin-proposal-private-methods@7.14.5";
        "@babel/plugin-proposal-private-property-in-object@7.14.5" = f (sc "babel" "plugin-proposal-private-property-in-object") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-private-property-in-object/-/plugin-proposal-private-property-in-object-7.14.5.tgz") "9f65a4d0493a940b4c01f8aa9d3f1894a587f636" [
          (s."@babel/helper-annotate-as-pure@^7.14.5")
          (s."@babel/helper-create-class-features-plugin@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-private-property-in-object@^7.14.5")
          ];
        "@babel/plugin-proposal-private-property-in-object@^7.14.5" = s."@babel/plugin-proposal-private-property-in-object@7.14.5";
        "@babel/plugin-proposal-unicode-property-regex@7.14.5" = f (sc "babel" "plugin-proposal-unicode-property-regex") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-proposal-unicode-property-regex/-/plugin-proposal-unicode-property-regex-7.14.5.tgz") "0f95ee0e757a5d647f378daa0eca7e93faa8bbe8" [
          (s."@babel/helper-create-regexp-features-plugin@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-proposal-unicode-property-regex@^7.12.1" = s."@babel/plugin-proposal-unicode-property-regex@7.14.5";
        "@babel/plugin-proposal-unicode-property-regex@^7.14.5" = s."@babel/plugin-proposal-unicode-property-regex@7.14.5";
        "@babel/plugin-proposal-unicode-property-regex@^7.4.4" = s."@babel/plugin-proposal-unicode-property-regex@7.14.5";
        "@babel/plugin-syntax-async-generators@7.8.4" = f (sc "babel" "plugin-syntax-async-generators") "7.8.4" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-async-generators/-/plugin-syntax-async-generators-7.8.4.tgz") "a983fb1aeb2ec3f6ed042a210f640e90e786fe0d" [
          (s."@babel/helper-plugin-utils@^7.8.0")
          ];
        "@babel/plugin-syntax-async-generators@^7.8.0" = s."@babel/plugin-syntax-async-generators@7.8.4";
        "@babel/plugin-syntax-async-generators@^7.8.4" = s."@babel/plugin-syntax-async-generators@7.8.4";
        "@babel/plugin-syntax-bigint@7.8.3" = f (sc "babel" "plugin-syntax-bigint") "7.8.3" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-bigint/-/plugin-syntax-bigint-7.8.3.tgz") "4c9a6f669f5d0cdf1b90a1671e9a146be5300cea" [
          (s."@babel/helper-plugin-utils@^7.8.0")
          ];
        "@babel/plugin-syntax-bigint@^7.8.3" = s."@babel/plugin-syntax-bigint@7.8.3";
        "@babel/plugin-syntax-class-properties@7.12.13" = f (sc "babel" "plugin-syntax-class-properties") "7.12.13" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-class-properties/-/plugin-syntax-class-properties-7.12.13.tgz") "b5c987274c4a3a82b89714796931a6b53544ae10" [
          (s."@babel/helper-plugin-utils@^7.12.13")
          ];
        "@babel/plugin-syntax-class-properties@^7.12.1" = s."@babel/plugin-syntax-class-properties@7.12.13";
        "@babel/plugin-syntax-class-properties@^7.12.13" = s."@babel/plugin-syntax-class-properties@7.12.13";
        "@babel/plugin-syntax-class-properties@^7.8.3" = s."@babel/plugin-syntax-class-properties@7.12.13";
        "@babel/plugin-syntax-class-static-block@7.14.5" = f (sc "babel" "plugin-syntax-class-static-block") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-class-static-block/-/plugin-syntax-class-static-block-7.14.5.tgz") "195df89b146b4b78b3bf897fd7a257c84659d406" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-syntax-class-static-block@^7.14.5" = s."@babel/plugin-syntax-class-static-block@7.14.5";
        "@babel/plugin-syntax-decorators@7.14.5" = f (sc "babel" "plugin-syntax-decorators") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-decorators/-/plugin-syntax-decorators-7.14.5.tgz") "eafb9c0cbe09c8afeb964ba3a7bbd63945a72f20" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-syntax-decorators@^7.12.1" = s."@babel/plugin-syntax-decorators@7.14.5";
        "@babel/plugin-syntax-dynamic-import@7.8.3" = f (sc "babel" "plugin-syntax-dynamic-import") "7.8.3" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-dynamic-import/-/plugin-syntax-dynamic-import-7.8.3.tgz") "62bf98b2da3cd21d626154fc96ee5b3cb68eacb3" [
          (s."@babel/helper-plugin-utils@^7.8.0")
          ];
        "@babel/plugin-syntax-dynamic-import@^7.8.0" = s."@babel/plugin-syntax-dynamic-import@7.8.3";
        "@babel/plugin-syntax-dynamic-import@^7.8.3" = s."@babel/plugin-syntax-dynamic-import@7.8.3";
        "@babel/plugin-syntax-export-namespace-from@7.8.3" = f (sc "babel" "plugin-syntax-export-namespace-from") "7.8.3" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-export-namespace-from/-/plugin-syntax-export-namespace-from-7.8.3.tgz") "028964a9ba80dbc094c915c487ad7c4e7a66465a" [
          (s."@babel/helper-plugin-utils@^7.8.3")
          ];
        "@babel/plugin-syntax-export-namespace-from@^7.8.3" = s."@babel/plugin-syntax-export-namespace-from@7.8.3";
        "@babel/plugin-syntax-flow@7.14.5" = f (sc "babel" "plugin-syntax-flow") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-flow/-/plugin-syntax-flow-7.14.5.tgz") "2ff654999497d7d7d142493260005263731da180" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-syntax-flow@^7.12.1" = s."@babel/plugin-syntax-flow@7.14.5";
        "@babel/plugin-syntax-import-meta@7.10.4" = f (sc "babel" "plugin-syntax-import-meta") "7.10.4" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-import-meta/-/plugin-syntax-import-meta-7.10.4.tgz") "ee601348c370fa334d2207be158777496521fd51" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          ];
        "@babel/plugin-syntax-import-meta@^7.8.3" = s."@babel/plugin-syntax-import-meta@7.10.4";
        "@babel/plugin-syntax-json-strings@7.8.3" = f (sc "babel" "plugin-syntax-json-strings") "7.8.3" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-json-strings/-/plugin-syntax-json-strings-7.8.3.tgz") "01ca21b668cd8218c9e640cb6dd88c5412b2c96a" [
          (s."@babel/helper-plugin-utils@^7.8.0")
          ];
        "@babel/plugin-syntax-json-strings@^7.8.0" = s."@babel/plugin-syntax-json-strings@7.8.3";
        "@babel/plugin-syntax-json-strings@^7.8.3" = s."@babel/plugin-syntax-json-strings@7.8.3";
        "@babel/plugin-syntax-jsx@7.14.5" = f (sc "babel" "plugin-syntax-jsx") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-jsx/-/plugin-syntax-jsx-7.14.5.tgz") "000e2e25d8673cce49300517a3eda44c263e4201" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-syntax-jsx@^7.14.5" = s."@babel/plugin-syntax-jsx@7.14.5";
        "@babel/plugin-syntax-logical-assignment-operators@7.10.4" = f (sc "babel" "plugin-syntax-logical-assignment-operators") "7.10.4" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-logical-assignment-operators/-/plugin-syntax-logical-assignment-operators-7.10.4.tgz") "ca91ef46303530448b906652bac2e9fe9941f699" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          ];
        "@babel/plugin-syntax-logical-assignment-operators@^7.10.4" = s."@babel/plugin-syntax-logical-assignment-operators@7.10.4";
        "@babel/plugin-syntax-logical-assignment-operators@^7.8.3" = s."@babel/plugin-syntax-logical-assignment-operators@7.10.4";
        "@babel/plugin-syntax-nullish-coalescing-operator@7.8.3" = f (sc "babel" "plugin-syntax-nullish-coalescing-operator") "7.8.3" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-nullish-coalescing-operator/-/plugin-syntax-nullish-coalescing-operator-7.8.3.tgz") "167ed70368886081f74b5c36c65a88c03b66d1a9" [
          (s."@babel/helper-plugin-utils@^7.8.0")
          ];
        "@babel/plugin-syntax-nullish-coalescing-operator@^7.8.0" = s."@babel/plugin-syntax-nullish-coalescing-operator@7.8.3";
        "@babel/plugin-syntax-nullish-coalescing-operator@^7.8.3" = s."@babel/plugin-syntax-nullish-coalescing-operator@7.8.3";
        "@babel/plugin-syntax-numeric-separator@7.10.4" = f (sc "babel" "plugin-syntax-numeric-separator") "7.10.4" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-numeric-separator/-/plugin-syntax-numeric-separator-7.10.4.tgz") "b9b070b3e33570cd9fd07ba7fa91c0dd37b9af97" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          ];
        "@babel/plugin-syntax-numeric-separator@^7.10.4" = s."@babel/plugin-syntax-numeric-separator@7.10.4";
        "@babel/plugin-syntax-numeric-separator@^7.8.3" = s."@babel/plugin-syntax-numeric-separator@7.10.4";
        "@babel/plugin-syntax-object-rest-spread@7.8.3" = f (sc "babel" "plugin-syntax-object-rest-spread") "7.8.3" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-object-rest-spread/-/plugin-syntax-object-rest-spread-7.8.3.tgz") "60e225edcbd98a640332a2e72dd3e66f1af55871" [
          (s."@babel/helper-plugin-utils@^7.8.0")
          ];
        "@babel/plugin-syntax-object-rest-spread@^7.8.0" = s."@babel/plugin-syntax-object-rest-spread@7.8.3";
        "@babel/plugin-syntax-object-rest-spread@^7.8.3" = s."@babel/plugin-syntax-object-rest-spread@7.8.3";
        "@babel/plugin-syntax-optional-catch-binding@7.8.3" = f (sc "babel" "plugin-syntax-optional-catch-binding") "7.8.3" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-optional-catch-binding/-/plugin-syntax-optional-catch-binding-7.8.3.tgz") "6111a265bcfb020eb9efd0fdfd7d26402b9ed6c1" [
          (s."@babel/helper-plugin-utils@^7.8.0")
          ];
        "@babel/plugin-syntax-optional-catch-binding@^7.8.0" = s."@babel/plugin-syntax-optional-catch-binding@7.8.3";
        "@babel/plugin-syntax-optional-catch-binding@^7.8.3" = s."@babel/plugin-syntax-optional-catch-binding@7.8.3";
        "@babel/plugin-syntax-optional-chaining@7.8.3" = f (sc "babel" "plugin-syntax-optional-chaining") "7.8.3" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-optional-chaining/-/plugin-syntax-optional-chaining-7.8.3.tgz") "4f69c2ab95167e0180cd5336613f8c5788f7d48a" [
          (s."@babel/helper-plugin-utils@^7.8.0")
          ];
        "@babel/plugin-syntax-optional-chaining@^7.8.0" = s."@babel/plugin-syntax-optional-chaining@7.8.3";
        "@babel/plugin-syntax-optional-chaining@^7.8.3" = s."@babel/plugin-syntax-optional-chaining@7.8.3";
        "@babel/plugin-syntax-private-property-in-object@7.14.5" = f (sc "babel" "plugin-syntax-private-property-in-object") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-private-property-in-object/-/plugin-syntax-private-property-in-object-7.14.5.tgz") "0dc6671ec0ea22b6e94a1114f857970cd39de1ad" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-syntax-private-property-in-object@^7.14.5" = s."@babel/plugin-syntax-private-property-in-object@7.14.5";
        "@babel/plugin-syntax-top-level-await@7.14.5" = f (sc "babel" "plugin-syntax-top-level-await") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-top-level-await/-/plugin-syntax-top-level-await-7.14.5.tgz") "c1cfdadc35a646240001f06138247b741c34d94c" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-syntax-top-level-await@^7.12.1" = s."@babel/plugin-syntax-top-level-await@7.14.5";
        "@babel/plugin-syntax-top-level-await@^7.14.5" = s."@babel/plugin-syntax-top-level-await@7.14.5";
        "@babel/plugin-syntax-top-level-await@^7.8.3" = s."@babel/plugin-syntax-top-level-await@7.14.5";
        "@babel/plugin-syntax-typescript@7.14.5" = f (sc "babel" "plugin-syntax-typescript") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-syntax-typescript/-/plugin-syntax-typescript-7.14.5.tgz") "b82c6ce471b165b5ce420cf92914d6fb46225716" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-syntax-typescript@^7.14.5" = s."@babel/plugin-syntax-typescript@7.14.5";
        "@babel/plugin-transform-arrow-functions@7.14.5" = f (sc "babel" "plugin-transform-arrow-functions") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-arrow-functions/-/plugin-transform-arrow-functions-7.14.5.tgz") "f7187d9588a768dd080bf4c9ffe117ea62f7862a" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-arrow-functions@^7.12.1" = s."@babel/plugin-transform-arrow-functions@7.14.5";
        "@babel/plugin-transform-arrow-functions@^7.14.5" = s."@babel/plugin-transform-arrow-functions@7.14.5";
        "@babel/plugin-transform-async-to-generator@7.14.5" = f (sc "babel" "plugin-transform-async-to-generator") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-async-to-generator/-/plugin-transform-async-to-generator-7.14.5.tgz") "72c789084d8f2094acb945633943ef8443d39e67" [
          (s."@babel/helper-module-imports@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-remap-async-to-generator@^7.14.5")
          ];
        "@babel/plugin-transform-async-to-generator@^7.12.1" = s."@babel/plugin-transform-async-to-generator@7.14.5";
        "@babel/plugin-transform-async-to-generator@^7.14.5" = s."@babel/plugin-transform-async-to-generator@7.14.5";
        "@babel/plugin-transform-block-scoped-functions@7.14.5" = f (sc "babel" "plugin-transform-block-scoped-functions") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-block-scoped-functions/-/plugin-transform-block-scoped-functions-7.14.5.tgz") "e48641d999d4bc157a67ef336aeb54bc44fd3ad4" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-block-scoped-functions@^7.12.1" = s."@babel/plugin-transform-block-scoped-functions@7.14.5";
        "@babel/plugin-transform-block-scoped-functions@^7.14.5" = s."@babel/plugin-transform-block-scoped-functions@7.14.5";
        "@babel/plugin-transform-block-scoping@7.14.5" = f (sc "babel" "plugin-transform-block-scoping") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-block-scoping/-/plugin-transform-block-scoping-7.14.5.tgz") "8cc63e61e50f42e078e6f09be775a75f23ef9939" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-block-scoping@^7.12.1" = s."@babel/plugin-transform-block-scoping@7.14.5";
        "@babel/plugin-transform-block-scoping@^7.14.5" = s."@babel/plugin-transform-block-scoping@7.14.5";
        "@babel/plugin-transform-classes@7.14.9" = f (sc "babel" "plugin-transform-classes") "7.14.9" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-classes/-/plugin-transform-classes-7.14.9.tgz") "2a391ffb1e5292710b00f2e2c210e1435e7d449f" [
          (s."@babel/helper-annotate-as-pure@^7.14.5")
          (s."@babel/helper-function-name@^7.14.5")
          (s."@babel/helper-optimise-call-expression@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-replace-supers@^7.14.5")
          (s."@babel/helper-split-export-declaration@^7.14.5")
          (s."globals@^11.1.0")
          ];
        "@babel/plugin-transform-classes@^7.12.1" = s."@babel/plugin-transform-classes@7.14.9";
        "@babel/plugin-transform-classes@^7.14.9" = s."@babel/plugin-transform-classes@7.14.9";
        "@babel/plugin-transform-computed-properties@7.14.5" = f (sc "babel" "plugin-transform-computed-properties") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-computed-properties/-/plugin-transform-computed-properties-7.14.5.tgz") "1b9d78987420d11223d41195461cc43b974b204f" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-computed-properties@^7.12.1" = s."@babel/plugin-transform-computed-properties@7.14.5";
        "@babel/plugin-transform-computed-properties@^7.14.5" = s."@babel/plugin-transform-computed-properties@7.14.5";
        "@babel/plugin-transform-destructuring@7.14.7" = f (sc "babel" "plugin-transform-destructuring") "7.14.7" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-destructuring/-/plugin-transform-destructuring-7.14.7.tgz") "0ad58ed37e23e22084d109f185260835e5557576" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-destructuring@^7.12.1" = s."@babel/plugin-transform-destructuring@7.14.7";
        "@babel/plugin-transform-destructuring@^7.14.7" = s."@babel/plugin-transform-destructuring@7.14.7";
        "@babel/plugin-transform-dotall-regex@7.14.5" = f (sc "babel" "plugin-transform-dotall-regex") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-dotall-regex/-/plugin-transform-dotall-regex-7.14.5.tgz") "2f6bf76e46bdf8043b4e7e16cf24532629ba0c7a" [
          (s."@babel/helper-create-regexp-features-plugin@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-dotall-regex@^7.12.1" = s."@babel/plugin-transform-dotall-regex@7.14.5";
        "@babel/plugin-transform-dotall-regex@^7.14.5" = s."@babel/plugin-transform-dotall-regex@7.14.5";
        "@babel/plugin-transform-dotall-regex@^7.4.4" = s."@babel/plugin-transform-dotall-regex@7.14.5";
        "@babel/plugin-transform-duplicate-keys@7.14.5" = f (sc "babel" "plugin-transform-duplicate-keys") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-duplicate-keys/-/plugin-transform-duplicate-keys-7.14.5.tgz") "365a4844881bdf1501e3a9f0270e7f0f91177954" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-duplicate-keys@^7.12.1" = s."@babel/plugin-transform-duplicate-keys@7.14.5";
        "@babel/plugin-transform-duplicate-keys@^7.14.5" = s."@babel/plugin-transform-duplicate-keys@7.14.5";
        "@babel/plugin-transform-exponentiation-operator@7.14.5" = f (sc "babel" "plugin-transform-exponentiation-operator") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-exponentiation-operator/-/plugin-transform-exponentiation-operator-7.14.5.tgz") "5154b8dd6a3dfe6d90923d61724bd3deeb90b493" [
          (s."@babel/helper-builder-binary-assignment-operator-visitor@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-exponentiation-operator@^7.12.1" = s."@babel/plugin-transform-exponentiation-operator@7.14.5";
        "@babel/plugin-transform-exponentiation-operator@^7.14.5" = s."@babel/plugin-transform-exponentiation-operator@7.14.5";
        "@babel/plugin-transform-flow-strip-types@7.12.1" = f (sc "babel" "plugin-transform-flow-strip-types") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-flow-strip-types/-/plugin-transform-flow-strip-types-7.12.1.tgz") "8430decfa7eb2aea5414ed4a3fa6e1652b7d77c4" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."@babel/plugin-syntax-flow@^7.12.1")
          ];
        "@babel/plugin-transform-for-of@7.14.5" = f (sc "babel" "plugin-transform-for-of") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-for-of/-/plugin-transform-for-of-7.14.5.tgz") "dae384613de8f77c196a8869cbf602a44f7fc0eb" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-for-of@^7.12.1" = s."@babel/plugin-transform-for-of@7.14.5";
        "@babel/plugin-transform-for-of@^7.14.5" = s."@babel/plugin-transform-for-of@7.14.5";
        "@babel/plugin-transform-function-name@7.14.5" = f (sc "babel" "plugin-transform-function-name") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-function-name/-/plugin-transform-function-name-7.14.5.tgz") "e81c65ecb900746d7f31802f6bed1f52d915d6f2" [
          (s."@babel/helper-function-name@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-function-name@^7.12.1" = s."@babel/plugin-transform-function-name@7.14.5";
        "@babel/plugin-transform-function-name@^7.14.5" = s."@babel/plugin-transform-function-name@7.14.5";
        "@babel/plugin-transform-literals@7.14.5" = f (sc "babel" "plugin-transform-literals") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-literals/-/plugin-transform-literals-7.14.5.tgz") "41d06c7ff5d4d09e3cf4587bd3ecf3930c730f78" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-literals@^7.12.1" = s."@babel/plugin-transform-literals@7.14.5";
        "@babel/plugin-transform-literals@^7.14.5" = s."@babel/plugin-transform-literals@7.14.5";
        "@babel/plugin-transform-member-expression-literals@7.14.5" = f (sc "babel" "plugin-transform-member-expression-literals") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-member-expression-literals/-/plugin-transform-member-expression-literals-7.14.5.tgz") "b39cd5212a2bf235a617d320ec2b48bcc091b8a7" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-member-expression-literals@^7.12.1" = s."@babel/plugin-transform-member-expression-literals@7.14.5";
        "@babel/plugin-transform-member-expression-literals@^7.14.5" = s."@babel/plugin-transform-member-expression-literals@7.14.5";
        "@babel/plugin-transform-modules-amd@7.14.5" = f (sc "babel" "plugin-transform-modules-amd") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-modules-amd/-/plugin-transform-modules-amd-7.14.5.tgz") "4fd9ce7e3411cb8b83848480b7041d83004858f7" [
          (s."@babel/helper-module-transforms@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."babel-plugin-dynamic-import-node@^2.3.3")
          ];
        "@babel/plugin-transform-modules-amd@^7.12.1" = s."@babel/plugin-transform-modules-amd@7.14.5";
        "@babel/plugin-transform-modules-amd@^7.14.5" = s."@babel/plugin-transform-modules-amd@7.14.5";
        "@babel/plugin-transform-modules-commonjs@7.15.0" = f (sc "babel" "plugin-transform-modules-commonjs") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-modules-commonjs/-/plugin-transform-modules-commonjs-7.15.0.tgz") "3305896e5835f953b5cdb363acd9e8c2219a5281" [
          (s."@babel/helper-module-transforms@^7.15.0")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-simple-access@^7.14.8")
          (s."babel-plugin-dynamic-import-node@^2.3.3")
          ];
        "@babel/plugin-transform-modules-commonjs@^7.12.1" = s."@babel/plugin-transform-modules-commonjs@7.15.0";
        "@babel/plugin-transform-modules-commonjs@^7.15.0" = s."@babel/plugin-transform-modules-commonjs@7.15.0";
        "@babel/plugin-transform-modules-systemjs@7.14.5" = f (sc "babel" "plugin-transform-modules-systemjs") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-modules-systemjs/-/plugin-transform-modules-systemjs-7.14.5.tgz") "c75342ef8b30dcde4295d3401aae24e65638ed29" [
          (s."@babel/helper-hoist-variables@^7.14.5")
          (s."@babel/helper-module-transforms@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-validator-identifier@^7.14.5")
          (s."babel-plugin-dynamic-import-node@^2.3.3")
          ];
        "@babel/plugin-transform-modules-systemjs@^7.12.1" = s."@babel/plugin-transform-modules-systemjs@7.14.5";
        "@babel/plugin-transform-modules-systemjs@^7.14.5" = s."@babel/plugin-transform-modules-systemjs@7.14.5";
        "@babel/plugin-transform-modules-umd@7.14.5" = f (sc "babel" "plugin-transform-modules-umd") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-modules-umd/-/plugin-transform-modules-umd-7.14.5.tgz") "fb662dfee697cce274a7cda525190a79096aa6e0" [
          (s."@babel/helper-module-transforms@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-modules-umd@^7.12.1" = s."@babel/plugin-transform-modules-umd@7.14.5";
        "@babel/plugin-transform-modules-umd@^7.14.5" = s."@babel/plugin-transform-modules-umd@7.14.5";
        "@babel/plugin-transform-named-capturing-groups-regex@7.14.9" = f (sc "babel" "plugin-transform-named-capturing-groups-regex") "7.14.9" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-named-capturing-groups-regex/-/plugin-transform-named-capturing-groups-regex-7.14.9.tgz") "c68f5c5d12d2ebaba3762e57c2c4f6347a46e7b2" [
          (s."@babel/helper-create-regexp-features-plugin@^7.14.5")
          ];
        "@babel/plugin-transform-named-capturing-groups-regex@^7.12.1" = s."@babel/plugin-transform-named-capturing-groups-regex@7.14.9";
        "@babel/plugin-transform-named-capturing-groups-regex@^7.14.9" = s."@babel/plugin-transform-named-capturing-groups-regex@7.14.9";
        "@babel/plugin-transform-new-target@7.14.5" = f (sc "babel" "plugin-transform-new-target") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-new-target/-/plugin-transform-new-target-7.14.5.tgz") "31bdae8b925dc84076ebfcd2a9940143aed7dbf8" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-new-target@^7.12.1" = s."@babel/plugin-transform-new-target@7.14.5";
        "@babel/plugin-transform-new-target@^7.14.5" = s."@babel/plugin-transform-new-target@7.14.5";
        "@babel/plugin-transform-object-super@7.14.5" = f (sc "babel" "plugin-transform-object-super") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-object-super/-/plugin-transform-object-super-7.14.5.tgz") "d0b5faeac9e98597a161a9cf78c527ed934cdc45" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-replace-supers@^7.14.5")
          ];
        "@babel/plugin-transform-object-super@^7.12.1" = s."@babel/plugin-transform-object-super@7.14.5";
        "@babel/plugin-transform-object-super@^7.14.5" = s."@babel/plugin-transform-object-super@7.14.5";
        "@babel/plugin-transform-parameters@7.14.5" = f (sc "babel" "plugin-transform-parameters") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-parameters/-/plugin-transform-parameters-7.14.5.tgz") "49662e86a1f3ddccac6363a7dfb1ff0a158afeb3" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-parameters@^7.12.1" = s."@babel/plugin-transform-parameters@7.14.5";
        "@babel/plugin-transform-parameters@^7.14.5" = s."@babel/plugin-transform-parameters@7.14.5";
        "@babel/plugin-transform-property-literals@7.14.5" = f (sc "babel" "plugin-transform-property-literals") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-property-literals/-/plugin-transform-property-literals-7.14.5.tgz") "0ddbaa1f83db3606f1cdf4846fa1dfb473458b34" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-property-literals@^7.12.1" = s."@babel/plugin-transform-property-literals@7.14.5";
        "@babel/plugin-transform-property-literals@^7.14.5" = s."@babel/plugin-transform-property-literals@7.14.5";
        "@babel/plugin-transform-react-constant-elements@7.14.5" = f (sc "babel" "plugin-transform-react-constant-elements") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-react-constant-elements/-/plugin-transform-react-constant-elements-7.14.5.tgz") "41790d856f7c5cec82d2bcf5d0e5064d682522ed" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-react-constant-elements@^7.12.1" = s."@babel/plugin-transform-react-constant-elements@7.14.5";
        "@babel/plugin-transform-react-display-name@7.12.1" = f (sc "babel" "plugin-transform-react-display-name") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-react-display-name/-/plugin-transform-react-display-name-7.12.1.tgz") "1cbcd0c3b1d6648c55374a22fc9b6b7e5341c00d" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          ];
        "@babel/plugin-transform-react-display-name@7.15.1" = f (sc "babel" "plugin-transform-react-display-name") "7.15.1" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-react-display-name/-/plugin-transform-react-display-name-7.15.1.tgz") "6aaac6099f1fcf6589d35ae6be1b6e10c8c602b9" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-react-display-name@^7.12.1" = s."@babel/plugin-transform-react-display-name@7.15.1";
        "@babel/plugin-transform-react-display-name@^7.14.5" = s."@babel/plugin-transform-react-display-name@7.15.1";
        "@babel/plugin-transform-react-jsx-development@7.14.5" = f (sc "babel" "plugin-transform-react-jsx-development") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-react-jsx-development/-/plugin-transform-react-jsx-development-7.14.5.tgz") "1a6c73e2f7ed2c42eebc3d2ad60b0c7494fcb9af" [
          (s."@babel/plugin-transform-react-jsx@^7.14.5")
          ];
        "@babel/plugin-transform-react-jsx-development@^7.12.1" = s."@babel/plugin-transform-react-jsx-development@7.14.5";
        "@babel/plugin-transform-react-jsx-development@^7.14.5" = s."@babel/plugin-transform-react-jsx-development@7.14.5";
        "@babel/plugin-transform-react-jsx-self@7.14.9" = f (sc "babel" "plugin-transform-react-jsx-self") "7.14.9" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.14.9.tgz") "33041e665453391eb6ee54a2ecf3ba1d46bd30f4" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-react-jsx-self@^7.12.1" = s."@babel/plugin-transform-react-jsx-self@7.14.9";
        "@babel/plugin-transform-react-jsx-source@7.14.5" = f (sc "babel" "plugin-transform-react-jsx-source") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.14.5.tgz") "79f728e60e6dbd31a2b860b0bf6c9765918acf1d" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-react-jsx-source@^7.12.1" = s."@babel/plugin-transform-react-jsx-source@7.14.5";
        "@babel/plugin-transform-react-jsx@7.14.9" = f (sc "babel" "plugin-transform-react-jsx") "7.14.9" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-react-jsx/-/plugin-transform-react-jsx-7.14.9.tgz") "3314b2163033abac5200a869c4de242cd50a914c" [
          (s."@babel/helper-annotate-as-pure@^7.14.5")
          (s."@babel/helper-module-imports@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-jsx@^7.14.5")
          (s."@babel/types@^7.14.9")
          ];
        "@babel/plugin-transform-react-jsx@^7.12.1" = s."@babel/plugin-transform-react-jsx@7.14.9";
        "@babel/plugin-transform-react-jsx@^7.14.5" = s."@babel/plugin-transform-react-jsx@7.14.9";
        "@babel/plugin-transform-react-pure-annotations@7.14.5" = f (sc "babel" "plugin-transform-react-pure-annotations") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-react-pure-annotations/-/plugin-transform-react-pure-annotations-7.14.5.tgz") "18de612b84021e3a9802cbc212c9d9f46d0d11fc" [
          (s."@babel/helper-annotate-as-pure@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-react-pure-annotations@^7.12.1" = s."@babel/plugin-transform-react-pure-annotations@7.14.5";
        "@babel/plugin-transform-react-pure-annotations@^7.14.5" = s."@babel/plugin-transform-react-pure-annotations@7.14.5";
        "@babel/plugin-transform-regenerator@7.14.5" = f (sc "babel" "plugin-transform-regenerator") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-regenerator/-/plugin-transform-regenerator-7.14.5.tgz") "9676fd5707ed28f522727c5b3c0aa8544440b04f" [
          (s."regenerator-transform@^0.14.2")
          ];
        "@babel/plugin-transform-regenerator@^7.12.1" = s."@babel/plugin-transform-regenerator@7.14.5";
        "@babel/plugin-transform-regenerator@^7.14.5" = s."@babel/plugin-transform-regenerator@7.14.5";
        "@babel/plugin-transform-reserved-words@7.14.5" = f (sc "babel" "plugin-transform-reserved-words") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-reserved-words/-/plugin-transform-reserved-words-7.14.5.tgz") "c44589b661cfdbef8d4300dcc7469dffa92f8304" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-reserved-words@^7.12.1" = s."@babel/plugin-transform-reserved-words@7.14.5";
        "@babel/plugin-transform-reserved-words@^7.14.5" = s."@babel/plugin-transform-reserved-words@7.14.5";
        "@babel/plugin-transform-runtime@7.12.1" = f (sc "babel" "plugin-transform-runtime") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-runtime/-/plugin-transform-runtime-7.12.1.tgz") "04b792057eb460389ff6a4198e377614ea1e7ba5" [
          (s."@babel/helper-module-imports@^7.12.1")
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."resolve@^1.8.1")
          (s."semver@^5.5.1")
          ];
        "@babel/plugin-transform-shorthand-properties@7.14.5" = f (sc "babel" "plugin-transform-shorthand-properties") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-shorthand-properties/-/plugin-transform-shorthand-properties-7.14.5.tgz") "97f13855f1409338d8cadcbaca670ad79e091a58" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-shorthand-properties@^7.12.1" = s."@babel/plugin-transform-shorthand-properties@7.14.5";
        "@babel/plugin-transform-shorthand-properties@^7.14.5" = s."@babel/plugin-transform-shorthand-properties@7.14.5";
        "@babel/plugin-transform-spread@7.14.6" = f (sc "babel" "plugin-transform-spread") "7.14.6" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-spread/-/plugin-transform-spread-7.14.6.tgz") "6bd40e57fe7de94aa904851963b5616652f73144" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-skip-transparent-expression-wrappers@^7.14.5")
          ];
        "@babel/plugin-transform-spread@^7.12.1" = s."@babel/plugin-transform-spread@7.14.6";
        "@babel/plugin-transform-spread@^7.14.6" = s."@babel/plugin-transform-spread@7.14.6";
        "@babel/plugin-transform-sticky-regex@7.14.5" = f (sc "babel" "plugin-transform-sticky-regex") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-sticky-regex/-/plugin-transform-sticky-regex-7.14.5.tgz") "5b617542675e8b7761294381f3c28c633f40aeb9" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-sticky-regex@^7.12.1" = s."@babel/plugin-transform-sticky-regex@7.14.5";
        "@babel/plugin-transform-sticky-regex@^7.14.5" = s."@babel/plugin-transform-sticky-regex@7.14.5";
        "@babel/plugin-transform-template-literals@7.14.5" = f (sc "babel" "plugin-transform-template-literals") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-template-literals/-/plugin-transform-template-literals-7.14.5.tgz") "a5f2bc233937d8453885dc736bdd8d9ffabf3d93" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-template-literals@^7.12.1" = s."@babel/plugin-transform-template-literals@7.14.5";
        "@babel/plugin-transform-template-literals@^7.14.5" = s."@babel/plugin-transform-template-literals@7.14.5";
        "@babel/plugin-transform-typeof-symbol@7.14.5" = f (sc "babel" "plugin-transform-typeof-symbol") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-typeof-symbol/-/plugin-transform-typeof-symbol-7.14.5.tgz") "39af2739e989a2bd291bf6b53f16981423d457d4" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-typeof-symbol@^7.12.1" = s."@babel/plugin-transform-typeof-symbol@7.14.5";
        "@babel/plugin-transform-typeof-symbol@^7.14.5" = s."@babel/plugin-transform-typeof-symbol@7.14.5";
        "@babel/plugin-transform-typescript@7.15.0" = f (sc "babel" "plugin-transform-typescript") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-typescript/-/plugin-transform-typescript-7.15.0.tgz") "553f230b9d5385018716586fc48db10dd228eb7e" [
          (s."@babel/helper-create-class-features-plugin@^7.15.0")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/plugin-syntax-typescript@^7.14.5")
          ];
        "@babel/plugin-transform-typescript@^7.12.1" = s."@babel/plugin-transform-typescript@7.15.0";
        "@babel/plugin-transform-unicode-escapes@7.14.5" = f (sc "babel" "plugin-transform-unicode-escapes") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-unicode-escapes/-/plugin-transform-unicode-escapes-7.14.5.tgz") "9d4bd2a681e3c5d7acf4f57fa9e51175d91d0c6b" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-unicode-escapes@^7.12.1" = s."@babel/plugin-transform-unicode-escapes@7.14.5";
        "@babel/plugin-transform-unicode-escapes@^7.14.5" = s."@babel/plugin-transform-unicode-escapes@7.14.5";
        "@babel/plugin-transform-unicode-regex@7.14.5" = f (sc "babel" "plugin-transform-unicode-regex") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/plugin-transform-unicode-regex/-/plugin-transform-unicode-regex-7.14.5.tgz") "4cd09b6c8425dd81255c7ceb3fb1836e7414382e" [
          (s."@babel/helper-create-regexp-features-plugin@^7.14.5")
          (s."@babel/helper-plugin-utils@^7.14.5")
          ];
        "@babel/plugin-transform-unicode-regex@^7.12.1" = s."@babel/plugin-transform-unicode-regex@7.14.5";
        "@babel/plugin-transform-unicode-regex@^7.14.5" = s."@babel/plugin-transform-unicode-regex@7.14.5";
        "@babel/preset-env@7.12.1" = f (sc "babel" "preset-env") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/preset-env/-/preset-env-7.12.1.tgz") "9c7e5ca82a19efc865384bb4989148d2ee5d7ac2" [
          (s."@babel/compat-data@^7.12.1")
          (s."@babel/helper-compilation-targets@^7.12.1")
          (s."@babel/helper-module-imports@^7.12.1")
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."@babel/helper-validator-option@^7.12.1")
          (s."@babel/plugin-proposal-async-generator-functions@^7.12.1")
          (s."@babel/plugin-proposal-class-properties@^7.12.1")
          (s."@babel/plugin-proposal-dynamic-import@^7.12.1")
          (s."@babel/plugin-proposal-export-namespace-from@^7.12.1")
          (s."@babel/plugin-proposal-json-strings@^7.12.1")
          (s."@babel/plugin-proposal-logical-assignment-operators@^7.12.1")
          (s."@babel/plugin-proposal-nullish-coalescing-operator@^7.12.1")
          (s."@babel/plugin-proposal-numeric-separator@^7.12.1")
          (s."@babel/plugin-proposal-object-rest-spread@^7.12.1")
          (s."@babel/plugin-proposal-optional-catch-binding@^7.12.1")
          (s."@babel/plugin-proposal-optional-chaining@^7.12.1")
          (s."@babel/plugin-proposal-private-methods@^7.12.1")
          (s."@babel/plugin-proposal-unicode-property-regex@^7.12.1")
          (s."@babel/plugin-syntax-async-generators@^7.8.0")
          (s."@babel/plugin-syntax-class-properties@^7.12.1")
          (s."@babel/plugin-syntax-dynamic-import@^7.8.0")
          (s."@babel/plugin-syntax-export-namespace-from@^7.8.3")
          (s."@babel/plugin-syntax-json-strings@^7.8.0")
          (s."@babel/plugin-syntax-logical-assignment-operators@^7.10.4")
          (s."@babel/plugin-syntax-nullish-coalescing-operator@^7.8.0")
          (s."@babel/plugin-syntax-numeric-separator@^7.10.4")
          (s."@babel/plugin-syntax-object-rest-spread@^7.8.0")
          (s."@babel/plugin-syntax-optional-catch-binding@^7.8.0")
          (s."@babel/plugin-syntax-optional-chaining@^7.8.0")
          (s."@babel/plugin-syntax-top-level-await@^7.12.1")
          (s."@babel/plugin-transform-arrow-functions@^7.12.1")
          (s."@babel/plugin-transform-async-to-generator@^7.12.1")
          (s."@babel/plugin-transform-block-scoped-functions@^7.12.1")
          (s."@babel/plugin-transform-block-scoping@^7.12.1")
          (s."@babel/plugin-transform-classes@^7.12.1")
          (s."@babel/plugin-transform-computed-properties@^7.12.1")
          (s."@babel/plugin-transform-destructuring@^7.12.1")
          (s."@babel/plugin-transform-dotall-regex@^7.12.1")
          (s."@babel/plugin-transform-duplicate-keys@^7.12.1")
          (s."@babel/plugin-transform-exponentiation-operator@^7.12.1")
          (s."@babel/plugin-transform-for-of@^7.12.1")
          (s."@babel/plugin-transform-function-name@^7.12.1")
          (s."@babel/plugin-transform-literals@^7.12.1")
          (s."@babel/plugin-transform-member-expression-literals@^7.12.1")
          (s."@babel/plugin-transform-modules-amd@^7.12.1")
          (s."@babel/plugin-transform-modules-commonjs@^7.12.1")
          (s."@babel/plugin-transform-modules-systemjs@^7.12.1")
          (s."@babel/plugin-transform-modules-umd@^7.12.1")
          (s."@babel/plugin-transform-named-capturing-groups-regex@^7.12.1")
          (s."@babel/plugin-transform-new-target@^7.12.1")
          (s."@babel/plugin-transform-object-super@^7.12.1")
          (s."@babel/plugin-transform-parameters@^7.12.1")
          (s."@babel/plugin-transform-property-literals@^7.12.1")
          (s."@babel/plugin-transform-regenerator@^7.12.1")
          (s."@babel/plugin-transform-reserved-words@^7.12.1")
          (s."@babel/plugin-transform-shorthand-properties@^7.12.1")
          (s."@babel/plugin-transform-spread@^7.12.1")
          (s."@babel/plugin-transform-sticky-regex@^7.12.1")
          (s."@babel/plugin-transform-template-literals@^7.12.1")
          (s."@babel/plugin-transform-typeof-symbol@^7.12.1")
          (s."@babel/plugin-transform-unicode-escapes@^7.12.1")
          (s."@babel/plugin-transform-unicode-regex@^7.12.1")
          (s."@babel/preset-modules@^0.1.3")
          (s."@babel/types@^7.12.1")
          (s."core-js-compat@^3.6.2")
          (s."semver@^5.5.0")
          ];
        "@babel/preset-env@7.15.0" = f (sc "babel" "preset-env") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/preset-env/-/preset-env-7.15.0.tgz") "e2165bf16594c9c05e52517a194bf6187d6fe464" [
          (s."@babel/compat-data@^7.15.0")
          (s."@babel/helper-compilation-targets@^7.15.0")
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-validator-option@^7.14.5")
          (s."@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@^7.14.5")
          (s."@babel/plugin-proposal-async-generator-functions@^7.14.9")
          (s."@babel/plugin-proposal-class-properties@^7.14.5")
          (s."@babel/plugin-proposal-class-static-block@^7.14.5")
          (s."@babel/plugin-proposal-dynamic-import@^7.14.5")
          (s."@babel/plugin-proposal-export-namespace-from@^7.14.5")
          (s."@babel/plugin-proposal-json-strings@^7.14.5")
          (s."@babel/plugin-proposal-logical-assignment-operators@^7.14.5")
          (s."@babel/plugin-proposal-nullish-coalescing-operator@^7.14.5")
          (s."@babel/plugin-proposal-numeric-separator@^7.14.5")
          (s."@babel/plugin-proposal-object-rest-spread@^7.14.7")
          (s."@babel/plugin-proposal-optional-catch-binding@^7.14.5")
          (s."@babel/plugin-proposal-optional-chaining@^7.14.5")
          (s."@babel/plugin-proposal-private-methods@^7.14.5")
          (s."@babel/plugin-proposal-private-property-in-object@^7.14.5")
          (s."@babel/plugin-proposal-unicode-property-regex@^7.14.5")
          (s."@babel/plugin-syntax-async-generators@^7.8.4")
          (s."@babel/plugin-syntax-class-properties@^7.12.13")
          (s."@babel/plugin-syntax-class-static-block@^7.14.5")
          (s."@babel/plugin-syntax-dynamic-import@^7.8.3")
          (s."@babel/plugin-syntax-export-namespace-from@^7.8.3")
          (s."@babel/plugin-syntax-json-strings@^7.8.3")
          (s."@babel/plugin-syntax-logical-assignment-operators@^7.10.4")
          (s."@babel/plugin-syntax-nullish-coalescing-operator@^7.8.3")
          (s."@babel/plugin-syntax-numeric-separator@^7.10.4")
          (s."@babel/plugin-syntax-object-rest-spread@^7.8.3")
          (s."@babel/plugin-syntax-optional-catch-binding@^7.8.3")
          (s."@babel/plugin-syntax-optional-chaining@^7.8.3")
          (s."@babel/plugin-syntax-private-property-in-object@^7.14.5")
          (s."@babel/plugin-syntax-top-level-await@^7.14.5")
          (s."@babel/plugin-transform-arrow-functions@^7.14.5")
          (s."@babel/plugin-transform-async-to-generator@^7.14.5")
          (s."@babel/plugin-transform-block-scoped-functions@^7.14.5")
          (s."@babel/plugin-transform-block-scoping@^7.14.5")
          (s."@babel/plugin-transform-classes@^7.14.9")
          (s."@babel/plugin-transform-computed-properties@^7.14.5")
          (s."@babel/plugin-transform-destructuring@^7.14.7")
          (s."@babel/plugin-transform-dotall-regex@^7.14.5")
          (s."@babel/plugin-transform-duplicate-keys@^7.14.5")
          (s."@babel/plugin-transform-exponentiation-operator@^7.14.5")
          (s."@babel/plugin-transform-for-of@^7.14.5")
          (s."@babel/plugin-transform-function-name@^7.14.5")
          (s."@babel/plugin-transform-literals@^7.14.5")
          (s."@babel/plugin-transform-member-expression-literals@^7.14.5")
          (s."@babel/plugin-transform-modules-amd@^7.14.5")
          (s."@babel/plugin-transform-modules-commonjs@^7.15.0")
          (s."@babel/plugin-transform-modules-systemjs@^7.14.5")
          (s."@babel/plugin-transform-modules-umd@^7.14.5")
          (s."@babel/plugin-transform-named-capturing-groups-regex@^7.14.9")
          (s."@babel/plugin-transform-new-target@^7.14.5")
          (s."@babel/plugin-transform-object-super@^7.14.5")
          (s."@babel/plugin-transform-parameters@^7.14.5")
          (s."@babel/plugin-transform-property-literals@^7.14.5")
          (s."@babel/plugin-transform-regenerator@^7.14.5")
          (s."@babel/plugin-transform-reserved-words@^7.14.5")
          (s."@babel/plugin-transform-shorthand-properties@^7.14.5")
          (s."@babel/plugin-transform-spread@^7.14.6")
          (s."@babel/plugin-transform-sticky-regex@^7.14.5")
          (s."@babel/plugin-transform-template-literals@^7.14.5")
          (s."@babel/plugin-transform-typeof-symbol@^7.14.5")
          (s."@babel/plugin-transform-unicode-escapes@^7.14.5")
          (s."@babel/plugin-transform-unicode-regex@^7.14.5")
          (s."@babel/preset-modules@^0.1.4")
          (s."@babel/types@^7.15.0")
          (s."babel-plugin-polyfill-corejs2@^0.2.2")
          (s."babel-plugin-polyfill-corejs3@^0.2.2")
          (s."babel-plugin-polyfill-regenerator@^0.2.2")
          (s."core-js-compat@^3.16.0")
          (s."semver@^6.3.0")
          ];
        "@babel/preset-env@^7.12.1" = s."@babel/preset-env@7.15.0";
        "@babel/preset-env@^7.8.4" = s."@babel/preset-env@7.15.0";
        "@babel/preset-modules@0.1.4" = f (sc "babel" "preset-modules") "0.1.4" (ir "https://registry.yarnpkg.com/@babel/preset-modules/-/preset-modules-0.1.4.tgz") "362f2b68c662842970fdb5e254ffc8fc1c2e415e" [
          (s."@babel/helper-plugin-utils@^7.0.0")
          (s."@babel/plugin-proposal-unicode-property-regex@^7.4.4")
          (s."@babel/plugin-transform-dotall-regex@^7.4.4")
          (s."@babel/types@^7.4.4")
          (s."esutils@^2.0.2")
          ];
        "@babel/preset-modules@^0.1.3" = s."@babel/preset-modules@0.1.4";
        "@babel/preset-modules@^0.1.4" = s."@babel/preset-modules@0.1.4";
        "@babel/preset-react@7.12.1" = f (sc "babel" "preset-react") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/preset-react/-/preset-react-7.12.1.tgz") "7f022b13f55b6dd82f00f16d1c599ae62985358c" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."@babel/plugin-transform-react-display-name@^7.12.1")
          (s."@babel/plugin-transform-react-jsx@^7.12.1")
          (s."@babel/plugin-transform-react-jsx-development@^7.12.1")
          (s."@babel/plugin-transform-react-jsx-self@^7.12.1")
          (s."@babel/plugin-transform-react-jsx-source@^7.12.1")
          (s."@babel/plugin-transform-react-pure-annotations@^7.12.1")
          ];
        "@babel/preset-react@7.14.5" = f (sc "babel" "preset-react") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/preset-react/-/preset-react-7.14.5.tgz") "0fbb769513f899c2c56f3a882fa79673c2d4ab3c" [
          (s."@babel/helper-plugin-utils@^7.14.5")
          (s."@babel/helper-validator-option@^7.14.5")
          (s."@babel/plugin-transform-react-display-name@^7.14.5")
          (s."@babel/plugin-transform-react-jsx@^7.14.5")
          (s."@babel/plugin-transform-react-jsx-development@^7.14.5")
          (s."@babel/plugin-transform-react-pure-annotations@^7.14.5")
          ];
        "@babel/preset-react@^7.12.5" = s."@babel/preset-react@7.14.5";
        "@babel/preset-typescript@7.12.1" = f (sc "babel" "preset-typescript") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/preset-typescript/-/preset-typescript-7.12.1.tgz") "86480b483bb97f75036e8864fe404cc782cc311b" [
          (s."@babel/helper-plugin-utils@^7.10.4")
          (s."@babel/plugin-transform-typescript@^7.12.1")
          ];
        "@babel/runtime-corejs3@7.14.9" = f (sc "babel" "runtime-corejs3") "7.14.9" (ir "https://registry.yarnpkg.com/@babel/runtime-corejs3/-/runtime-corejs3-7.14.9.tgz") "fb21b1cf11650dcb8fcf4de2e6b3b8cf411da3f3" [
          (s."core-js-pure@^3.16.0")
          (s."regenerator-runtime@^0.13.4")
          ];
        "@babel/runtime-corejs3@^7.10.2" = s."@babel/runtime-corejs3@7.14.9";
        "@babel/runtime@7.12.1" = f (sc "babel" "runtime") "7.12.1" (ir "https://registry.yarnpkg.com/@babel/runtime/-/runtime-7.12.1.tgz") "b4116a6b6711d010b2dad3b7b6e43bf1b9954740" [
          (s."regenerator-runtime@^0.13.4")
          ];
        "@babel/runtime@7.14.8" = f (sc "babel" "runtime") "7.14.8" (ir "https://registry.yarnpkg.com/@babel/runtime/-/runtime-7.14.8.tgz") "7119a56f421018852694290b9f9148097391b446" [
          (s."regenerator-runtime@^0.13.4")
          ];
        "@babel/runtime@^7.0.0" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.1.2" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.10.1" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.10.2" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.10.4" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.11.1" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.11.2" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.12.1" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.12.5" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.5.1" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.5.5" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.7.2" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.8.4" = s."@babel/runtime@7.14.8";
        "@babel/runtime@^7.9.2" = s."@babel/runtime@7.14.8";
        "@babel/template@7.14.5" = f (sc "babel" "template") "7.14.5" (ir "https://registry.yarnpkg.com/@babel/template/-/template-7.14.5.tgz") "a9bc9d8b33354ff6e55a9c60d1109200a68974f4" [
          (s."@babel/code-frame@^7.14.5")
          (s."@babel/parser@^7.14.5")
          (s."@babel/types@^7.14.5")
          ];
        "@babel/template@^7.10.4" = s."@babel/template@7.14.5";
        "@babel/template@^7.14.5" = s."@babel/template@7.14.5";
        "@babel/template@^7.3.3" = s."@babel/template@7.14.5";
        "@babel/traverse@7.15.0" = f (sc "babel" "traverse") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.15.0.tgz") "4cca838fd1b2a03283c1f38e141f639d60b3fc98" [
          (s."@babel/code-frame@^7.14.5")
          (s."@babel/generator@^7.15.0")
          (s."@babel/helper-function-name@^7.14.5")
          (s."@babel/helper-hoist-variables@^7.14.5")
          (s."@babel/helper-split-export-declaration@^7.14.5")
          (s."@babel/parser@^7.15.0")
          (s."@babel/types@^7.15.0")
          (s."debug@^4.1.0")
          (s."globals@^11.1.0")
          ];
        "@babel/traverse@^7.1.0" = s."@babel/traverse@7.15.0";
        "@babel/traverse@^7.12.1" = s."@babel/traverse@7.15.0";
        "@babel/traverse@^7.13.0" = s."@babel/traverse@7.15.0";
        "@babel/traverse@^7.14.5" = s."@babel/traverse@7.15.0";
        "@babel/traverse@^7.14.8" = s."@babel/traverse@7.15.0";
        "@babel/traverse@^7.15.0" = s."@babel/traverse@7.15.0";
        "@babel/traverse@^7.7.0" = s."@babel/traverse@7.15.0";
        "@babel/types@7.14.8" = f (sc "babel" "types") "7.14.8" (ir "https://registry.yarnpkg.com/@babel/types/-/types-7.14.8.tgz") "38109de8fcadc06415fbd9b74df0065d4d41c728" [
          (s."@babel/helper-validator-identifier@^7.14.8")
          (s."to-fast-properties@^2.0.0")
          ];
        "@babel/types@7.15.0" = f (sc "babel" "types") "7.15.0" (ir "https://registry.yarnpkg.com/@babel/types/-/types-7.15.0.tgz") "61af11f2286c4e9c69ca8deb5f4375a73c72dcbd" [
          (s."@babel/helper-validator-identifier@^7.14.9")
          (s."to-fast-properties@^2.0.0")
          ];
        "@babel/types@^7.0.0" = s."@babel/types@7.15.0";
        "@babel/types@^7.12.1" = s."@babel/types@7.15.0";
        "@babel/types@^7.12.6" = s."@babel/types@7.15.0";
        "@babel/types@^7.14.5" = s."@babel/types@7.15.0";
        "@babel/types@^7.14.8" = s."@babel/types@7.15.0";
        "@babel/types@^7.14.9" = s."@babel/types@7.15.0";
        "@babel/types@^7.15.0" = s."@babel/types@7.15.0";
        "@babel/types@^7.3.0" = s."@babel/types@7.15.0";
        "@babel/types@^7.3.3" = s."@babel/types@7.15.0";
        "@babel/types@^7.4.4" = s."@babel/types@7.15.0";
        "@babel/types@^7.7.0" = s."@babel/types@7.15.0";
        "@bcoe/v8-coverage@0.2.3" = f (sc "bcoe" "v8-coverage") "0.2.3" (ir "https://registry.yarnpkg.com/@bcoe/v8-coverage/-/v8-coverage-0.2.3.tgz") "75a2e8b51cb758a7553d6804a5932d7aace75c39" [];
        "@bcoe/v8-coverage@^0.2.3" = s."@bcoe/v8-coverage@0.2.3";
        "@cnakazawa/watch@1.0.4" = f (sc "cnakazawa" "watch") "1.0.4" (ir "https://registry.yarnpkg.com/@cnakazawa/watch/-/watch-1.0.4.tgz") "f864ae85004d0fcab6f50be9141c4da368d1656a" [
          (s."exec-sh@^0.3.2")
          (s."minimist@^1.2.0")
          ];
        "@cnakazawa/watch@^1.0.3" = s."@cnakazawa/watch@1.0.4";
        "@csstools/convert-colors@1.4.0" = f (sc "csstools" "convert-colors") "1.4.0" (ir "https://registry.yarnpkg.com/@csstools/convert-colors/-/convert-colors-1.4.0.tgz") "ad495dc41b12e75d588c6db8b9834f08fa131eb7" [];
        "@csstools/convert-colors@^1.4.0" = s."@csstools/convert-colors@1.4.0";
        "@csstools/normalize.css@10.1.0" = f (sc "csstools" "normalize.css") "10.1.0" (ir "https://registry.yarnpkg.com/@csstools/normalize.css/-/normalize.css-10.1.0.tgz") "f0950bba18819512d42f7197e56c518aa491cf18" [];
        "@csstools/normalize.css@^10.1.0" = s."@csstools/normalize.css@10.1.0";
        "@ctrl/tinycolor@3.4.0" = f (sc "ctrl" "tinycolor") "3.4.0" (ir "https://registry.yarnpkg.com/@ctrl/tinycolor/-/tinycolor-3.4.0.tgz") "c3c5ae543c897caa9c2a68630bed355be5f9990f" [];
        "@ctrl/tinycolor@^3.4.0" = s."@ctrl/tinycolor@3.4.0";
        "@endemolshinegroup/cosmiconfig-typescript-loader@1.0.2" = f (sc "endemolshinegroup" "cosmiconfig-typescript-loader") "1.0.2" (ir "https://registry.yarnpkg.com/@endemolshinegroup/cosmiconfig-typescript-loader/-/cosmiconfig-typescript-loader-1.0.2.tgz") "c1eadbb4c269f7898195ca8f7428bf5f5d1c449a" [
          (s."lodash.get@^4")
          (s."make-error@^1")
          (s."ts-node@^8")
          (s."tslib@^1")
          ];
        "@endemolshinegroup/cosmiconfig-typescript-loader@^1.0.0" = s."@endemolshinegroup/cosmiconfig-typescript-loader@1.0.2";
        "@eslint/eslintrc@0.4.3" = f (sc "eslint" "eslintrc") "0.4.3" (ir "https://registry.yarnpkg.com/@eslint/eslintrc/-/eslintrc-0.4.3.tgz") "9e42981ef035beb3dd49add17acb96e8ff6f394c" [
          (s."ajv@^6.12.4")
          (s."debug@^4.1.1")
          (s."espree@^7.3.0")
          (s."globals@^13.9.0")
          (s."ignore@^4.0.6")
          (s."import-fresh@^3.2.1")
          (s."js-yaml@^3.13.1")
          (s."minimatch@^3.0.4")
          (s."strip-json-comments@^3.1.1")
          ];
        "@eslint/eslintrc@^0.4.3" = s."@eslint/eslintrc@0.4.3";
        "@graphql-typed-document-node/core@3.1.0" = f (sc "graphql-typed-document-node" "core") "3.1.0" (ir "https://registry.yarnpkg.com/@graphql-typed-document-node/core/-/core-3.1.0.tgz") "0eee6373e11418bfe0b5638f654df7a4ca6a3950" [];
        "@graphql-typed-document-node/core@^3.0.0" = s."@graphql-typed-document-node/core@3.1.0";
        "@hapi/address@2.1.4" = f (sc "hapi" "address") "2.1.4" (ir "https://registry.yarnpkg.com/@hapi/address/-/address-2.1.4.tgz") "5d67ed43f3fd41a69d4b9ff7b56e7c0d1d0a81e5" [];
        "@hapi/address@2.x.x" = s."@hapi/address@2.1.4";
        "@hapi/bourne@1.3.2" = f (sc "hapi" "bourne") "1.3.2" (ir "https://registry.yarnpkg.com/@hapi/bourne/-/bourne-1.3.2.tgz") "0a7095adea067243ce3283e1b56b8a8f453b242a" [];
        "@hapi/bourne@1.x.x" = s."@hapi/bourne@1.3.2";
        "@hapi/hoek@8.5.1" = f (sc "hapi" "hoek") "8.5.1" (ir "https://registry.yarnpkg.com/@hapi/hoek/-/hoek-8.5.1.tgz") "fde96064ca446dec8c55a8c2f130957b070c6e06" [];
        "@hapi/hoek@8.x.x" = s."@hapi/hoek@8.5.1";
        "@hapi/hoek@^8.3.0" = s."@hapi/hoek@8.5.1";
        "@hapi/joi@15.1.1" = f (sc "hapi" "joi") "15.1.1" (ir "https://registry.yarnpkg.com/@hapi/joi/-/joi-15.1.1.tgz") "c675b8a71296f02833f8d6d243b34c57b8ce19d7" [
          (s."@hapi/address@2.x.x")
          (s."@hapi/bourne@1.x.x")
          (s."@hapi/hoek@8.x.x")
          (s."@hapi/topo@3.x.x")
          ];
        "@hapi/joi@^15.1.0" = s."@hapi/joi@15.1.1";
        "@hapi/topo@3.1.6" = f (sc "hapi" "topo") "3.1.6" (ir "https://registry.yarnpkg.com/@hapi/topo/-/topo-3.1.6.tgz") "68d935fa3eae7fdd5ab0d7f953f3205d8b2bfc29" [
          (s."@hapi/hoek@^8.3.0")
          ];
        "@hapi/topo@3.x.x" = s."@hapi/topo@3.1.6";
        "@humanwhocodes/config-array@0.5.0" = f (sc "humanwhocodes" "config-array") "0.5.0" (ir "https://registry.yarnpkg.com/@humanwhocodes/config-array/-/config-array-0.5.0.tgz") "1407967d4c6eecd7388f83acf1eaf4d0c6e58ef9" [
          (s."@humanwhocodes/object-schema@^1.2.0")
          (s."debug@^4.1.1")
          (s."minimatch@^3.0.4")
          ];
        "@humanwhocodes/config-array@^0.5.0" = s."@humanwhocodes/config-array@0.5.0";
        "@humanwhocodes/object-schema@1.2.0" = f (sc "humanwhocodes" "object-schema") "1.2.0" (ir "https://registry.yarnpkg.com/@humanwhocodes/object-schema/-/object-schema-1.2.0.tgz") "87de7af9c231826fdd68ac7258f77c429e0e5fcf" [];
        "@humanwhocodes/object-schema@^1.2.0" = s."@humanwhocodes/object-schema@1.2.0";
        "@istanbuljs/load-nyc-config@1.1.0" = f (sc "istanbuljs" "load-nyc-config") "1.1.0" (ir "https://registry.yarnpkg.com/@istanbuljs/load-nyc-config/-/load-nyc-config-1.1.0.tgz") "fd3db1d59ecf7cf121e80650bb86712f9b55eced" [
          (s."camelcase@^5.3.1")
          (s."find-up@^4.1.0")
          (s."get-package-type@^0.1.0")
          (s."js-yaml@^3.13.1")
          (s."resolve-from@^5.0.0")
          ];
        "@istanbuljs/load-nyc-config@^1.0.0" = s."@istanbuljs/load-nyc-config@1.1.0";
        "@istanbuljs/schema@0.1.3" = f (sc "istanbuljs" "schema") "0.1.3" (ir "https://registry.yarnpkg.com/@istanbuljs/schema/-/schema-0.1.3.tgz") "e45e384e4b8ec16bce2fd903af78450f6bf7ec98" [];
        "@istanbuljs/schema@^0.1.2" = s."@istanbuljs/schema@0.1.3";
        "@jest/console@26.6.2" = f (sc "jest" "console") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/console/-/console-26.6.2.tgz") "4e04bc464014358b03ab4937805ee36a0aeb98f2" [
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."chalk@^4.0.0")
          (s."jest-message-util@^26.6.2")
          (s."jest-util@^26.6.2")
          (s."slash@^3.0.0")
          ];
        "@jest/console@^26.6.2" = s."@jest/console@26.6.2";
        "@jest/core@26.6.3" = f (sc "jest" "core") "26.6.3" (ir "https://registry.yarnpkg.com/@jest/core/-/core-26.6.3.tgz") "7639fcb3833d748a4656ada54bde193051e45fad" [
          (s."@jest/console@^26.6.2")
          (s."@jest/reporters@^26.6.2")
          (s."@jest/test-result@^26.6.2")
          (s."@jest/transform@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."ansi-escapes@^4.2.1")
          (s."chalk@^4.0.0")
          (s."exit@^0.1.2")
          (s."graceful-fs@^4.2.4")
          (s."jest-changed-files@^26.6.2")
          (s."jest-config@^26.6.3")
          (s."jest-haste-map@^26.6.2")
          (s."jest-message-util@^26.6.2")
          (s."jest-regex-util@^26.0.0")
          (s."jest-resolve@^26.6.2")
          (s."jest-resolve-dependencies@^26.6.3")
          (s."jest-runner@^26.6.3")
          (s."jest-runtime@^26.6.3")
          (s."jest-snapshot@^26.6.2")
          (s."jest-util@^26.6.2")
          (s."jest-validate@^26.6.2")
          (s."jest-watcher@^26.6.2")
          (s."micromatch@^4.0.2")
          (s."p-each-series@^2.1.0")
          (s."rimraf@^3.0.0")
          (s."slash@^3.0.0")
          (s."strip-ansi@^6.0.0")
          ];
        "@jest/core@^26.6.0" = s."@jest/core@26.6.3";
        "@jest/core@^26.6.3" = s."@jest/core@26.6.3";
        "@jest/environment@26.6.2" = f (sc "jest" "environment") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/environment/-/environment-26.6.2.tgz") "ba364cc72e221e79cc8f0a99555bf5d7577cf92c" [
          (s."@jest/fake-timers@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."jest-mock@^26.6.2")
          ];
        "@jest/environment@^26.6.0" = s."@jest/environment@26.6.2";
        "@jest/environment@^26.6.2" = s."@jest/environment@26.6.2";
        "@jest/fake-timers@26.6.2" = f (sc "jest" "fake-timers") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/fake-timers/-/fake-timers-26.6.2.tgz") "459c329bcf70cee4af4d7e3f3e67848123535aad" [
          (s."@jest/types@^26.6.2")
          (s."@sinonjs/fake-timers@^6.0.1")
          (s."@types/node@*")
          (s."jest-message-util@^26.6.2")
          (s."jest-mock@^26.6.2")
          (s."jest-util@^26.6.2")
          ];
        "@jest/fake-timers@^26.6.2" = s."@jest/fake-timers@26.6.2";
        "@jest/globals@26.6.2" = f (sc "jest" "globals") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/globals/-/globals-26.6.2.tgz") "5b613b78a1aa2655ae908eba638cc96a20df720a" [
          (s."@jest/environment@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."expect@^26.6.2")
          ];
        "@jest/globals@^26.6.2" = s."@jest/globals@26.6.2";
        "@jest/reporters@26.6.2" = f (sc "jest" "reporters") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/reporters/-/reporters-26.6.2.tgz") "1f518b99637a5f18307bd3ecf9275f6882a667f6" [
          (s."@bcoe/v8-coverage@^0.2.3")
          (s."@jest/console@^26.6.2")
          (s."@jest/test-result@^26.6.2")
          (s."@jest/transform@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."chalk@^4.0.0")
          (s."collect-v8-coverage@^1.0.0")
          (s."exit@^0.1.2")
          (s."glob@^7.1.2")
          (s."graceful-fs@^4.2.4")
          (s."istanbul-lib-coverage@^3.0.0")
          (s."istanbul-lib-instrument@^4.0.3")
          (s."istanbul-lib-report@^3.0.0")
          (s."istanbul-lib-source-maps@^4.0.0")
          (s."istanbul-reports@^3.0.2")
          (s."jest-haste-map@^26.6.2")
          (s."jest-resolve@^26.6.2")
          (s."jest-util@^26.6.2")
          (s."jest-worker@^26.6.2")
          (s."slash@^3.0.0")
          (s."source-map@^0.6.0")
          (s."string-length@^4.0.1")
          (s."terminal-link@^2.0.0")
          (s."v8-to-istanbul@^7.0.0")
          (s."node-notifier@^8.0.0")
          ];
        "@jest/reporters@^26.6.2" = s."@jest/reporters@26.6.2";
        "@jest/source-map@26.6.2" = f (sc "jest" "source-map") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/source-map/-/source-map-26.6.2.tgz") "29af5e1e2e324cafccc936f218309f54ab69d535" [
          (s."callsites@^3.0.0")
          (s."graceful-fs@^4.2.4")
          (s."source-map@^0.6.0")
          ];
        "@jest/source-map@^26.6.2" = s."@jest/source-map@26.6.2";
        "@jest/test-result@26.6.2" = f (sc "jest" "test-result") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/test-result/-/test-result-26.6.2.tgz") "55da58b62df134576cc95476efa5f7949e3f5f18" [
          (s."@jest/console@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/istanbul-lib-coverage@^2.0.0")
          (s."collect-v8-coverage@^1.0.0")
          ];
        "@jest/test-result@^26.6.0" = s."@jest/test-result@26.6.2";
        "@jest/test-result@^26.6.2" = s."@jest/test-result@26.6.2";
        "@jest/test-sequencer@26.6.3" = f (sc "jest" "test-sequencer") "26.6.3" (ir "https://registry.yarnpkg.com/@jest/test-sequencer/-/test-sequencer-26.6.3.tgz") "98e8a45100863886d074205e8ffdc5a7eb582b17" [
          (s."@jest/test-result@^26.6.2")
          (s."graceful-fs@^4.2.4")
          (s."jest-haste-map@^26.6.2")
          (s."jest-runner@^26.6.3")
          (s."jest-runtime@^26.6.3")
          ];
        "@jest/test-sequencer@^26.6.3" = s."@jest/test-sequencer@26.6.3";
        "@jest/transform@26.6.2" = f (sc "jest" "transform") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/transform/-/transform-26.6.2.tgz") "5ac57c5fa1ad17b2aae83e73e45813894dcf2e4b" [
          (s."@babel/core@^7.1.0")
          (s."@jest/types@^26.6.2")
          (s."babel-plugin-istanbul@^6.0.0")
          (s."chalk@^4.0.0")
          (s."convert-source-map@^1.4.0")
          (s."fast-json-stable-stringify@^2.0.0")
          (s."graceful-fs@^4.2.4")
          (s."jest-haste-map@^26.6.2")
          (s."jest-regex-util@^26.0.0")
          (s."jest-util@^26.6.2")
          (s."micromatch@^4.0.2")
          (s."pirates@^4.0.1")
          (s."slash@^3.0.0")
          (s."source-map@^0.6.1")
          (s."write-file-atomic@^3.0.0")
          ];
        "@jest/transform@^26.6.2" = s."@jest/transform@26.6.2";
        "@jest/types@24.9.0" = f (sc "jest" "types") "24.9.0" (ir "https://registry.yarnpkg.com/@jest/types/-/types-24.9.0.tgz") "63cb26cb7500d069e5a389441a7c6ab5e909fc59" [
          (s."@types/istanbul-lib-coverage@^2.0.0")
          (s."@types/istanbul-reports@^1.1.1")
          (s."@types/yargs@^13.0.0")
          ];
        "@jest/types@25.5.0" = f (sc "jest" "types") "25.5.0" (ir "https://registry.yarnpkg.com/@jest/types/-/types-25.5.0.tgz") "4d6a4793f7b9599fc3680877b856a97dbccf2a9d" [
          (s."@types/istanbul-lib-coverage@^2.0.0")
          (s."@types/istanbul-reports@^1.1.1")
          (s."@types/yargs@^15.0.0")
          (s."chalk@^3.0.0")
          ];
        "@jest/types@26.6.2" = f (sc "jest" "types") "26.6.2" (ir "https://registry.yarnpkg.com/@jest/types/-/types-26.6.2.tgz") "bef5a532030e1d88a2f5a6d933f84e97226ed48e" [
          (s."@types/istanbul-lib-coverage@^2.0.0")
          (s."@types/istanbul-reports@^3.0.0")
          (s."@types/node@*")
          (s."@types/yargs@^15.0.0")
          (s."chalk@^4.0.0")
          ];
        "@jest/types@27.0.6" = f (sc "jest" "types") "27.0.6" (ir "https://registry.yarnpkg.com/@jest/types/-/types-27.0.6.tgz") "9a992bc517e0c49f035938b8549719c2de40706b" [
          (s."@types/istanbul-lib-coverage@^2.0.0")
          (s."@types/istanbul-reports@^3.0.0")
          (s."@types/node@*")
          (s."@types/yargs@^16.0.0")
          (s."chalk@^4.0.0")
          ];
        "@jest/types@^24.9.0" = s."@jest/types@24.9.0";
        "@jest/types@^25.5.0" = s."@jest/types@25.5.0";
        "@jest/types@^26.6.0" = s."@jest/types@26.6.2";
        "@jest/types@^26.6.2" = s."@jest/types@26.6.2";
        "@jest/types@^27.0.6" = s."@jest/types@27.0.6";
        "@nodelib/fs.scandir@2.1.5" = f (sc "nodelib" "fs.scandir") "2.1.5" (ir "https://registry.yarnpkg.com/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz") "7619c2eb21b25483f6d167548b4cfd5a7488c3d5" [
          (s."@nodelib/fs.stat@2.0.5")
          (s."run-parallel@^1.1.9")
          ];
        "@nodelib/fs.stat@2.0.5" = f (sc "nodelib" "fs.stat") "2.0.5" (ir "https://registry.yarnpkg.com/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz") "5bd262af94e9d25bd1e71b05deed44876a222e8b" [];
        "@nodelib/fs.stat@^2.0.2" = s."@nodelib/fs.stat@2.0.5";
        "@nodelib/fs.walk@1.2.8" = f (sc "nodelib" "fs.walk") "1.2.8" (ir "https://registry.yarnpkg.com/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz") "e95737e8bb6746ddedf69c556953494f196fe69a" [
          (s."@nodelib/fs.scandir@2.1.5")
          (s."fastq@^1.6.0")
          ];
        "@nodelib/fs.walk@^1.2.3" = s."@nodelib/fs.walk@1.2.8";
        "@npmcli/move-file@1.1.2" = f (sc "npmcli" "move-file") "1.1.2" (ir "https://registry.yarnpkg.com/@npmcli/move-file/-/move-file-1.1.2.tgz") "1a82c3e372f7cae9253eb66d72543d6b8685c674" [
          (s."mkdirp@^1.0.4")
          (s."rimraf@^3.0.2")
          ];
        "@npmcli/move-file@^1.0.1" = s."@npmcli/move-file@1.1.2";
        "@oclif/color@0.1.2" = f (sc "oclif" "color") "0.1.2" (ir "https://registry.yarnpkg.com/@oclif/color/-/color-0.1.2.tgz") "28b07e2850d9ce814d0b587ce3403b7ad8f7d987" [
          (s."ansi-styles@^3.2.1")
          (s."chalk@^3.0.0")
          (s."strip-ansi@^5.2.0")
          (s."supports-color@^5.4.0")
          (s."tslib@^1")
          ];
        "@oclif/color@^0.x" = s."@oclif/color@0.1.2";
        "@oclif/command@1.8.0" = f (sc "oclif" "command") "1.8.0" (ir "https://registry.yarnpkg.com/@oclif/command/-/command-1.8.0.tgz") "c1a499b10d26e9d1a611190a81005589accbb339" [
          (s."@oclif/config@^1.15.1")
          (s."@oclif/errors@^1.3.3")
          (s."@oclif/parser@^3.8.3")
          (s."debug@^4.1.1")
          (s."semver@^7.3.2")
          ];
        "@oclif/command@^1.5.10" = s."@oclif/command@1.8.0";
        "@oclif/command@^1.5.12" = s."@oclif/command@1.8.0";
        "@oclif/command@^1.5.13" = s."@oclif/command@1.8.0";
        "@oclif/command@^1.5.20" = s."@oclif/command@1.8.0";
        "@oclif/command@^1.6.0" = s."@oclif/command@1.8.0";
        "@oclif/config@1.17.0" = f (sc "oclif" "config") "1.17.0" (ir "https://registry.yarnpkg.com/@oclif/config/-/config-1.17.0.tgz") "ba8639118633102a7e481760c50054623d09fcab" [
          (s."@oclif/errors@^1.3.3")
          (s."@oclif/parser@^3.8.0")
          (s."debug@^4.1.1")
          (s."globby@^11.0.1")
          (s."is-wsl@^2.1.1")
          (s."tslib@^2.0.0")
          ];
        "@oclif/config@^1.12.8" = s."@oclif/config@1.17.0";
        "@oclif/config@^1.13.0" = s."@oclif/config@1.17.0";
        "@oclif/config@^1.15.1" = s."@oclif/config@1.17.0";
        "@oclif/errors@1.3.5" = f (sc "oclif" "errors") "1.3.5" (ir "https://registry.yarnpkg.com/@oclif/errors/-/errors-1.3.5.tgz") "a1e9694dbeccab10fe2fe15acb7113991bed636c" [
          (s."clean-stack@^3.0.0")
          (s."fs-extra@^8.1")
          (s."indent-string@^4.0.0")
          (s."strip-ansi@^6.0.0")
          (s."wrap-ansi@^7.0.0")
          ];
        "@oclif/errors@^1.2.1" = s."@oclif/errors@1.3.5";
        "@oclif/errors@^1.2.2" = s."@oclif/errors@1.3.5";
        "@oclif/errors@^1.3.3" = s."@oclif/errors@1.3.5";
        "@oclif/linewrap@1.0.0" = f (sc "oclif" "linewrap") "1.0.0" (ir "https://registry.yarnpkg.com/@oclif/linewrap/-/linewrap-1.0.0.tgz") "aedcb64b479d4db7be24196384897b5000901d91" [];
        "@oclif/linewrap@^1.0.0" = s."@oclif/linewrap@1.0.0";
        "@oclif/parser@3.8.5" = f (sc "oclif" "parser") "3.8.5" (ir "https://registry.yarnpkg.com/@oclif/parser/-/parser-3.8.5.tgz") "c5161766a1efca7343e1f25d769efbefe09f639b" [
          (s."@oclif/errors@^1.2.2")
          (s."@oclif/linewrap@^1.0.0")
          (s."chalk@^2.4.2")
          (s."tslib@^1.9.3")
          ];
        "@oclif/parser@^3.8.0" = s."@oclif/parser@3.8.5";
        "@oclif/parser@^3.8.3" = s."@oclif/parser@3.8.5";
        "@oclif/plugin-autocomplete@0.3.0" = f (sc "oclif" "plugin-autocomplete") "0.3.0" (ir "https://registry.yarnpkg.com/@oclif/plugin-autocomplete/-/plugin-autocomplete-0.3.0.tgz") "eec788596a88a4ca5170a9103b6c2835119a8fbd" [
          (s."@oclif/command@^1.5.13")
          (s."@oclif/config@^1.13.0")
          (s."chalk@^4.1.0")
          (s."cli-ux@^5.2.1")
          (s."debug@^4.0.0")
          (s."fs-extra@^9.0.1")
          (s."moment@^2.22.1")
          ];
        "@oclif/plugin-help@3.2.2" = f (sc "oclif" "plugin-help") "3.2.2" (ir "https://registry.yarnpkg.com/@oclif/plugin-help/-/plugin-help-3.2.2.tgz") "063ee08cee556573a5198fbdfdaa32796deba0ed" [
          (s."@oclif/command@^1.5.20")
          (s."@oclif/config@^1.15.1")
          (s."@oclif/errors@^1.2.2")
          (s."chalk@^4.1.0")
          (s."indent-string@^4.0.0")
          (s."lodash.template@^4.4.0")
          (s."string-width@^4.2.0")
          (s."strip-ansi@^6.0.0")
          (s."widest-line@^3.1.0")
          (s."wrap-ansi@^4.0.0")
          ];
        "@oclif/plugin-help@3.2.3" = f (sc "oclif" "plugin-help") "3.2.3" (ir "https://registry.yarnpkg.com/@oclif/plugin-help/-/plugin-help-3.2.3.tgz") "cd24010e7eb326782843d3aa6d6b5a4affebb2c3" [
          (s."@oclif/command@^1.5.20")
          (s."@oclif/config@^1.15.1")
          (s."@oclif/errors@^1.2.2")
          (s."chalk@^4.1.0")
          (s."indent-string@^4.0.0")
          (s."lodash.template@^4.4.0")
          (s."string-width@^4.2.0")
          (s."strip-ansi@^6.0.0")
          (s."widest-line@^3.1.0")
          (s."wrap-ansi@^4.0.0")
          ];
        "@oclif/plugin-help@^3" = s."@oclif/plugin-help@3.2.3";
        "@oclif/plugin-not-found@1.2.4" = f (sc "oclif" "plugin-not-found") "1.2.4" (ir "https://registry.yarnpkg.com/@oclif/plugin-not-found/-/plugin-not-found-1.2.4.tgz") "160108c82f0aa10f4fb52cee4e0135af34b7220b" [
          (s."@oclif/color@^0.x")
          (s."@oclif/command@^1.6.0")
          (s."cli-ux@^4.9.0")
          (s."fast-levenshtein@^2.0.6")
          (s."lodash@^4.17.13")
          ];
        "@oclif/plugin-plugins@1.10.1" = f (sc "oclif" "plugin-plugins") "1.10.1" (ir "https://registry.yarnpkg.com/@oclif/plugin-plugins/-/plugin-plugins-1.10.1.tgz") "13666d7c2f591a77f7a16334feee59f9eb216eb1" [
          (s."@oclif/color@^0.x")
          (s."@oclif/command@^1.5.12")
          (s."@oclif/errors@^1.2.2")
          (s."chalk@^4.1.0")
          (s."cli-ux@^5.2.1")
          (s."debug@^4.1.0")
          (s."fs-extra@^9.0")
          (s."http-call@^5.2.2")
          (s."load-json-file@^5.2.0")
          (s."npm-run-path@^4.0.1")
          (s."semver@^7.3.2")
          (s."tslib@^2.0.0")
          (s."yarn@^1.21.1")
          ];
        "@oclif/plugin-warn-if-update-available@1.7.0" = f (sc "oclif" "plugin-warn-if-update-available") "1.7.0" (ir "https://registry.yarnpkg.com/@oclif/plugin-warn-if-update-available/-/plugin-warn-if-update-available-1.7.0.tgz") "5a72abe39ce0b831eb4ae81cb64eb4b9f3ea424a" [
          (s."@oclif/command@^1.5.10")
          (s."@oclif/config@^1.12.8")
          (s."@oclif/errors@^1.2.2")
          (s."chalk@^2.4.1")
          (s."debug@^4.1.0")
          (s."fs-extra@^7.0.0")
          (s."http-call@^5.2.2")
          (s."lodash.template@^4.4.0")
          (s."semver@^5.6.0")
          ];
        "@oclif/screen@1.0.4" = f (sc "oclif" "screen") "1.0.4" (ir "https://registry.yarnpkg.com/@oclif/screen/-/screen-1.0.4.tgz") "b740f68609dfae8aa71c3a6cab15d816407ba493" [];
        "@oclif/screen@^1.0.3" = s."@oclif/screen@1.0.4";
        "@pmmmwh/react-refresh-webpack-plugin@0.4.3" = f (sc "pmmmwh" "react-refresh-webpack-plugin") "0.4.3" (ir "https://registry.yarnpkg.com/@pmmmwh/react-refresh-webpack-plugin/-/react-refresh-webpack-plugin-0.4.3.tgz") "1eec460596d200c0236bf195b078a5d1df89b766" [
          (s."ansi-html@^0.0.7")
          (s."error-stack-parser@^2.0.6")
          (s."html-entities@^1.2.1")
          (s."native-url@^0.2.6")
          (s."schema-utils@^2.6.5")
          (s."source-map@^0.7.3")
          ];
        "@probe.gl/stats@3.4.0" = f (sc "probe.gl" "stats") "3.4.0" (ir "https://registry.yarnpkg.com/@probe.gl/stats/-/stats-3.4.0.tgz") "9315c4726ea031661daa6a1771b8e978684a8b9b" [
          (s."@babel/runtime@^7.0.0")
          ];
        "@reduxjs/toolkit@1.6.1" = f (sc "reduxjs" "toolkit") "1.6.1" (ir "https://registry.yarnpkg.com/@reduxjs/toolkit/-/toolkit-1.6.1.tgz") "7bc83b47352a663bf28db01e79d17ba54b98ade9" [
          (s."immer@^9.0.1")
          (s."redux@^4.1.0")
          (s."redux-thunk@^2.3.0")
          (s."reselect@^4.0.0")
          ];
        "@reduxjs/toolkit@^1.5.1" = s."@reduxjs/toolkit@1.6.1";
        "@rollup/plugin-node-resolve@7.1.3" = f (sc "rollup" "plugin-node-resolve") "7.1.3" (ir "https://registry.yarnpkg.com/@rollup/plugin-node-resolve/-/plugin-node-resolve-7.1.3.tgz") "80de384edfbd7bfc9101164910f86078151a3eca" [
          (s."@rollup/pluginutils@^3.0.8")
          (s."@types/resolve@0.0.8")
          (s."builtin-modules@^3.1.0")
          (s."is-module@^1.0.0")
          (s."resolve@^1.14.2")
          ];
        "@rollup/plugin-node-resolve@^7.1.1" = s."@rollup/plugin-node-resolve@7.1.3";
        "@rollup/plugin-replace@2.4.2" = f (sc "rollup" "plugin-replace") "2.4.2" (ir "https://registry.yarnpkg.com/@rollup/plugin-replace/-/plugin-replace-2.4.2.tgz") "a2d539314fbc77c244858faa523012825068510a" [
          (s."@rollup/pluginutils@^3.1.0")
          (s."magic-string@^0.25.7")
          ];
        "@rollup/plugin-replace@^2.3.1" = s."@rollup/plugin-replace@2.4.2";
        "@rollup/pluginutils@3.1.0" = f (sc "rollup" "pluginutils") "3.1.0" (ir "https://registry.yarnpkg.com/@rollup/pluginutils/-/pluginutils-3.1.0.tgz") "706b4524ee6dc8b103b3c995533e5ad680c02b9b" [
          (s."@types/estree@0.0.39")
          (s."estree-walker@^1.0.1")
          (s."picomatch@^2.2.2")
          ];
        "@rollup/pluginutils@^3.0.8" = s."@rollup/pluginutils@3.1.0";
        "@rollup/pluginutils@^3.1.0" = s."@rollup/pluginutils@3.1.0";
        "@samverschueren/stream-to-observable@0.3.1" = f (sc "samverschueren" "stream-to-observable") "0.3.1" (ir "https://registry.yarnpkg.com/@samverschueren/stream-to-observable/-/stream-to-observable-0.3.1.tgz") "a21117b19ee9be70c379ec1877537ef2e1c63301" [
          (s."any-observable@^0.3.0")
          ];
        "@samverschueren/stream-to-observable@^0.3.0" = s."@samverschueren/stream-to-observable@0.3.1";
        "@sheerun/mutationobserver-shim@0.3.3" = f (sc "sheerun" "mutationobserver-shim") "0.3.3" (ir "https://registry.yarnpkg.com/@sheerun/mutationobserver-shim/-/mutationobserver-shim-0.3.3.tgz") "5405ee8e444ed212db44e79351f0c70a582aae25" [];
        "@sheerun/mutationobserver-shim@^0.3.2" = s."@sheerun/mutationobserver-shim@0.3.3";
        "@sinonjs/commons@1.8.3" = f (sc "sinonjs" "commons") "1.8.3" (ir "https://registry.yarnpkg.com/@sinonjs/commons/-/commons-1.8.3.tgz") "3802ddd21a50a949b6721ddd72da36e67e7f1b2d" [
          (s."type-detect@4.0.8")
          ];
        "@sinonjs/commons@^1.7.0" = s."@sinonjs/commons@1.8.3";
        "@sinonjs/fake-timers@6.0.1" = f (sc "sinonjs" "fake-timers") "6.0.1" (ir "https://registry.yarnpkg.com/@sinonjs/fake-timers/-/fake-timers-6.0.1.tgz") "293674fccb3262ac782c7aadfdeca86b10c75c40" [
          (s."@sinonjs/commons@^1.7.0")
          ];
        "@sinonjs/fake-timers@^6.0.1" = s."@sinonjs/fake-timers@6.0.1";
        "@surma/rollup-plugin-off-main-thread@1.4.2" = f (sc "surma" "rollup-plugin-off-main-thread") "1.4.2" (ir "https://registry.yarnpkg.com/@surma/rollup-plugin-off-main-thread/-/rollup-plugin-off-main-thread-1.4.2.tgz") "e6786b6af5799f82f7ab3a82e53f6182d2b91a58" [
          (s."ejs@^2.6.1")
          (s."magic-string@^0.25.0")
          ];
        "@surma/rollup-plugin-off-main-thread@^1.1.1" = s."@surma/rollup-plugin-off-main-thread@1.4.2";
        "@svgr/babel-plugin-add-jsx-attribute@5.4.0" = f (sc "svgr" "babel-plugin-add-jsx-attribute") "5.4.0" (ir "https://registry.yarnpkg.com/@svgr/babel-plugin-add-jsx-attribute/-/babel-plugin-add-jsx-attribute-5.4.0.tgz") "81ef61947bb268eb9d50523446f9c638fb355906" [];
        "@svgr/babel-plugin-add-jsx-attribute@^5.4.0" = s."@svgr/babel-plugin-add-jsx-attribute@5.4.0";
        "@svgr/babel-plugin-remove-jsx-attribute@5.4.0" = f (sc "svgr" "babel-plugin-remove-jsx-attribute") "5.4.0" (ir "https://registry.yarnpkg.com/@svgr/babel-plugin-remove-jsx-attribute/-/babel-plugin-remove-jsx-attribute-5.4.0.tgz") "6b2c770c95c874654fd5e1d5ef475b78a0a962ef" [];
        "@svgr/babel-plugin-remove-jsx-attribute@^5.4.0" = s."@svgr/babel-plugin-remove-jsx-attribute@5.4.0";
        "@svgr/babel-plugin-remove-jsx-empty-expression@5.0.1" = f (sc "svgr" "babel-plugin-remove-jsx-empty-expression") "5.0.1" (ir "https://registry.yarnpkg.com/@svgr/babel-plugin-remove-jsx-empty-expression/-/babel-plugin-remove-jsx-empty-expression-5.0.1.tgz") "25621a8915ed7ad70da6cea3d0a6dbc2ea933efd" [];
        "@svgr/babel-plugin-remove-jsx-empty-expression@^5.0.1" = s."@svgr/babel-plugin-remove-jsx-empty-expression@5.0.1";
        "@svgr/babel-plugin-replace-jsx-attribute-value@5.0.1" = f (sc "svgr" "babel-plugin-replace-jsx-attribute-value") "5.0.1" (ir "https://registry.yarnpkg.com/@svgr/babel-plugin-replace-jsx-attribute-value/-/babel-plugin-replace-jsx-attribute-value-5.0.1.tgz") "0b221fc57f9fcd10e91fe219e2cd0dd03145a897" [];
        "@svgr/babel-plugin-replace-jsx-attribute-value@^5.0.1" = s."@svgr/babel-plugin-replace-jsx-attribute-value@5.0.1";
        "@svgr/babel-plugin-svg-dynamic-title@5.4.0" = f (sc "svgr" "babel-plugin-svg-dynamic-title") "5.4.0" (ir "https://registry.yarnpkg.com/@svgr/babel-plugin-svg-dynamic-title/-/babel-plugin-svg-dynamic-title-5.4.0.tgz") "139b546dd0c3186b6e5db4fefc26cb0baea729d7" [];
        "@svgr/babel-plugin-svg-dynamic-title@^5.4.0" = s."@svgr/babel-plugin-svg-dynamic-title@5.4.0";
        "@svgr/babel-plugin-svg-em-dimensions@5.4.0" = f (sc "svgr" "babel-plugin-svg-em-dimensions") "5.4.0" (ir "https://registry.yarnpkg.com/@svgr/babel-plugin-svg-em-dimensions/-/babel-plugin-svg-em-dimensions-5.4.0.tgz") "6543f69526632a133ce5cabab965deeaea2234a0" [];
        "@svgr/babel-plugin-svg-em-dimensions@^5.4.0" = s."@svgr/babel-plugin-svg-em-dimensions@5.4.0";
        "@svgr/babel-plugin-transform-react-native-svg@5.4.0" = f (sc "svgr" "babel-plugin-transform-react-native-svg") "5.4.0" (ir "https://registry.yarnpkg.com/@svgr/babel-plugin-transform-react-native-svg/-/babel-plugin-transform-react-native-svg-5.4.0.tgz") "00bf9a7a73f1cad3948cdab1f8dfb774750f8c80" [];
        "@svgr/babel-plugin-transform-react-native-svg@^5.4.0" = s."@svgr/babel-plugin-transform-react-native-svg@5.4.0";
        "@svgr/babel-plugin-transform-svg-component@5.5.0" = f (sc "svgr" "babel-plugin-transform-svg-component") "5.5.0" (ir "https://registry.yarnpkg.com/@svgr/babel-plugin-transform-svg-component/-/babel-plugin-transform-svg-component-5.5.0.tgz") "583a5e2a193e214da2f3afeb0b9e8d3250126b4a" [];
        "@svgr/babel-plugin-transform-svg-component@^5.5.0" = s."@svgr/babel-plugin-transform-svg-component@5.5.0";
        "@svgr/babel-preset@5.5.0" = f (sc "svgr" "babel-preset") "5.5.0" (ir "https://registry.yarnpkg.com/@svgr/babel-preset/-/babel-preset-5.5.0.tgz") "8af54f3e0a8add7b1e2b0fcd5a882c55393df327" [
          (s."@svgr/babel-plugin-add-jsx-attribute@^5.4.0")
          (s."@svgr/babel-plugin-remove-jsx-attribute@^5.4.0")
          (s."@svgr/babel-plugin-remove-jsx-empty-expression@^5.0.1")
          (s."@svgr/babel-plugin-replace-jsx-attribute-value@^5.0.1")
          (s."@svgr/babel-plugin-svg-dynamic-title@^5.4.0")
          (s."@svgr/babel-plugin-svg-em-dimensions@^5.4.0")
          (s."@svgr/babel-plugin-transform-react-native-svg@^5.4.0")
          (s."@svgr/babel-plugin-transform-svg-component@^5.5.0")
          ];
        "@svgr/babel-preset@^5.5.0" = s."@svgr/babel-preset@5.5.0";
        "@svgr/core@5.5.0" = f (sc "svgr" "core") "5.5.0" (ir "https://registry.yarnpkg.com/@svgr/core/-/core-5.5.0.tgz") "82e826b8715d71083120fe8f2492ec7d7874a579" [
          (s."@svgr/plugin-jsx@^5.5.0")
          (s."camelcase@^6.2.0")
          (s."cosmiconfig@^7.0.0")
          ];
        "@svgr/core@^5.5.0" = s."@svgr/core@5.5.0";
        "@svgr/hast-util-to-babel-ast@5.5.0" = f (sc "svgr" "hast-util-to-babel-ast") "5.5.0" (ir "https://registry.yarnpkg.com/@svgr/hast-util-to-babel-ast/-/hast-util-to-babel-ast-5.5.0.tgz") "5ee52a9c2533f73e63f8f22b779f93cd432a5461" [
          (s."@babel/types@^7.12.6")
          ];
        "@svgr/hast-util-to-babel-ast@^5.5.0" = s."@svgr/hast-util-to-babel-ast@5.5.0";
        "@svgr/plugin-jsx@5.5.0" = f (sc "svgr" "plugin-jsx") "5.5.0" (ir "https://registry.yarnpkg.com/@svgr/plugin-jsx/-/plugin-jsx-5.5.0.tgz") "1aa8cd798a1db7173ac043466d7b52236b369000" [
          (s."@babel/core@^7.12.3")
          (s."@svgr/babel-preset@^5.5.0")
          (s."@svgr/hast-util-to-babel-ast@^5.5.0")
          (s."svg-parser@^2.0.2")
          ];
        "@svgr/plugin-jsx@^5.5.0" = s."@svgr/plugin-jsx@5.5.0";
        "@svgr/plugin-svgo@5.5.0" = f (sc "svgr" "plugin-svgo") "5.5.0" (ir "https://registry.yarnpkg.com/@svgr/plugin-svgo/-/plugin-svgo-5.5.0.tgz") "02da55d85320549324e201c7b2e53bf431fcc246" [
          (s."cosmiconfig@^7.0.0")
          (s."deepmerge@^4.2.2")
          (s."svgo@^1.2.2")
          ];
        "@svgr/plugin-svgo@^5.5.0" = s."@svgr/plugin-svgo@5.5.0";
        "@svgr/webpack@5.5.0" = f (sc "svgr" "webpack") "5.5.0" (ir "https://registry.yarnpkg.com/@svgr/webpack/-/webpack-5.5.0.tgz") "aae858ee579f5fa8ce6c3166ef56c6a1b381b640" [
          (s."@babel/core@^7.12.3")
          (s."@babel/plugin-transform-react-constant-elements@^7.12.1")
          (s."@babel/preset-env@^7.12.1")
          (s."@babel/preset-react@^7.12.5")
          (s."@svgr/core@^5.5.0")
          (s."@svgr/plugin-jsx@^5.5.0")
          (s."@svgr/plugin-svgo@^5.5.0")
          (s."loader-utils@^2.0.0")
          ];
        "@testing-library/dom@*" = s."@testing-library/dom@8.1.0";
        "@testing-library/dom@6.16.0" = f (sc "testing-library" "dom") "6.16.0" (ir "https://registry.yarnpkg.com/@testing-library/dom/-/dom-6.16.0.tgz") "04ada27ed74ad4c0f0d984a1245bb29b1fd90ba9" [
          (s."@babel/runtime@^7.8.4")
          (s."@sheerun/mutationobserver-shim@^0.3.2")
          (s."@types/testing-library__dom@^6.12.1")
          (s."aria-query@^4.0.2")
          (s."dom-accessibility-api@^0.3.0")
          (s."pretty-format@^25.1.0")
          (s."wait-for-expect@^3.0.2")
          ];
        "@testing-library/dom@8.1.0" = f (sc "testing-library" "dom") "8.1.0" (ir "https://registry.yarnpkg.com/@testing-library/dom/-/dom-8.1.0.tgz") "f8358b1883844ea569ba76b7e94582168df5370d" [
          (s."@babel/code-frame@^7.10.4")
          (s."@babel/runtime@^7.12.5")
          (s."@types/aria-query@^4.2.0")
          (s."aria-query@^4.2.2")
          (s."chalk@^4.1.0")
          (s."dom-accessibility-api@^0.5.6")
          (s."lz-string@^1.4.4")
          (s."pretty-format@^27.0.2")
          ];
        "@testing-library/dom@^6.15.0" = s."@testing-library/dom@6.16.0";
        "@testing-library/jest-dom@4.2.4" = f (sc "testing-library" "jest-dom") "4.2.4" (ir "https://registry.yarnpkg.com/@testing-library/jest-dom/-/jest-dom-4.2.4.tgz") "00dfa0cbdd837d9a3c2a7f3f0a248ea6e7b89742" [
          (s."@babel/runtime@^7.5.1")
          (s."chalk@^2.4.1")
          (s."css@^2.2.3")
          (s."css.escape@^1.5.1")
          (s."jest-diff@^24.0.0")
          (s."jest-matcher-utils@^24.0.0")
          (s."lodash@^4.17.11")
          (s."pretty-format@^24.0.0")
          (s."redent@^3.0.0")
          ];
        "@testing-library/jest-dom@^4.2.4" = s."@testing-library/jest-dom@4.2.4";
        "@testing-library/react@9.5.0" = f (sc "testing-library" "react") "9.5.0" (ir "https://registry.yarnpkg.com/@testing-library/react/-/react-9.5.0.tgz") "71531655a7890b61e77a1b39452fbedf0472ca5e" [
          (s."@babel/runtime@^7.8.4")
          (s."@testing-library/dom@^6.15.0")
          (s."@types/testing-library__react@^9.1.2")
          ];
        "@testing-library/react@^9.3.2" = s."@testing-library/react@9.5.0";
        "@testing-library/user-event@7.2.1" = f (sc "testing-library" "user-event") "7.2.1" (ir "https://registry.yarnpkg.com/@testing-library/user-event/-/user-event-7.2.1.tgz") "2ad4e844175a3738cb9e7064be5ea070b8863a1c" [];
        "@testing-library/user-event@^7.1.2" = s."@testing-library/user-event@7.2.1";
        "@tootallnate/once@1" = s."@tootallnate/once@1.1.2";
        "@tootallnate/once@1.1.2" = f (sc "tootallnate" "once") "1.1.2" (ir "https://registry.yarnpkg.com/@tootallnate/once/-/once-1.1.2.tgz") "ccb91445360179a04e7fe6aff78c00ffc1eeaf82" [];
        "@types/aria-query@4.2.2" = f (sc "types" "aria-query") "4.2.2" (ir "https://registry.yarnpkg.com/@types/aria-query/-/aria-query-4.2.2.tgz") "ed4e0ad92306a704f9fb132a0cfcf77486dbe2bc" [];
        "@types/aria-query@^4.2.0" = s."@types/aria-query@4.2.2";
        "@types/babel__core@7.1.15" = f (sc "types" "babel__core") "7.1.15" (ir "https://registry.yarnpkg.com/@types/babel__core/-/babel__core-7.1.15.tgz") "2ccfb1ad55a02c83f8e0ad327cbc332f55eb1024" [
          (s."@babel/parser@^7.1.0")
          (s."@babel/types@^7.0.0")
          (s."@types/babel__generator@*")
          (s."@types/babel__template@*")
          (s."@types/babel__traverse@*")
          ];
        "@types/babel__core@^7.0.0" = s."@types/babel__core@7.1.15";
        "@types/babel__core@^7.1.7" = s."@types/babel__core@7.1.15";
        "@types/babel__generator@*" = s."@types/babel__generator@7.6.3";
        "@types/babel__generator@7.6.3" = f (sc "types" "babel__generator") "7.6.3" (ir "https://registry.yarnpkg.com/@types/babel__generator/-/babel__generator-7.6.3.tgz") "f456b4b2ce79137f768aa130d2423d2f0ccfaba5" [
          (s."@babel/types@^7.0.0")
          ];
        "@types/babel__template@*" = s."@types/babel__template@7.4.1";
        "@types/babel__template@7.4.1" = f (sc "types" "babel__template") "7.4.1" (ir "https://registry.yarnpkg.com/@types/babel__template/-/babel__template-7.4.1.tgz") "3d1a48fd9d6c0edfd56f2ff578daed48f36c8969" [
          (s."@babel/parser@^7.1.0")
          (s."@babel/types@^7.0.0")
          ];
        "@types/babel__traverse@*" = s."@types/babel__traverse@7.14.2";
        "@types/babel__traverse@7.14.2" = f (sc "types" "babel__traverse") "7.14.2" (ir "https://registry.yarnpkg.com/@types/babel__traverse/-/babel__traverse-7.14.2.tgz") "ffcd470bbb3f8bf30481678fb5502278ca833a43" [
          (s."@babel/types@^7.3.0")
          ];
        "@types/babel__traverse@^7.0.4" = s."@types/babel__traverse@7.14.2";
        "@types/babel__traverse@^7.0.6" = s."@types/babel__traverse@7.14.2";
        "@types/d3-timer@2.0.1" = f (sc "types" "d3-timer") "2.0.1" (ir "https://registry.yarnpkg.com/@types/d3-timer/-/d3-timer-2.0.1.tgz") "ffb6620d290624f3726aa362c0c8a4b44c8d7200" [];
        "@types/d3-timer@^2.0.0" = s."@types/d3-timer@2.0.1";
        "@types/eslint@7.28.0" = f (sc "types" "eslint") "7.28.0" (ir "https://registry.yarnpkg.com/@types/eslint/-/eslint-7.28.0.tgz") "7e41f2481d301c68e14f483fe10b017753ce8d5a" [
          (s."@types/estree@*")
          (s."@types/json-schema@*")
          ];
        "@types/eslint@^7.2.6" = s."@types/eslint@7.28.0";
        "@types/estree@*" = s."@types/estree@0.0.50";
        "@types/estree@0.0.39" = f (sc "types" "estree") "0.0.39" (ir "https://registry.yarnpkg.com/@types/estree/-/estree-0.0.39.tgz") "e177e699ee1b8c22d23174caaa7422644389509f" [];
        "@types/estree@0.0.50" = f (sc "types" "estree") "0.0.50" (ir "https://registry.yarnpkg.com/@types/estree/-/estree-0.0.50.tgz") "1e0caa9364d3fccd2931c3ed96fdbeaa5d4cca83" [];
        "@types/glob@7.1.4" = f (sc "types" "glob") "7.1.4" (ir "https://registry.yarnpkg.com/@types/glob/-/glob-7.1.4.tgz") "ea59e21d2ee5c517914cb4bc8e4153b99e566672" [
          (s."@types/minimatch@*")
          (s."@types/node@*")
          ];
        "@types/glob@^7.1.1" = s."@types/glob@7.1.4";
        "@types/graceful-fs@4.1.5" = f (sc "types" "graceful-fs") "4.1.5" (ir "https://registry.yarnpkg.com/@types/graceful-fs/-/graceful-fs-4.1.5.tgz") "21ffba0d98da4350db64891f92a9e5db3cdb4e15" [
          (s."@types/node@*")
          ];
        "@types/graceful-fs@^4.1.2" = s."@types/graceful-fs@4.1.5";
        "@types/history@*" = s."@types/history@4.7.9";
        "@types/history@4.7.9" = f (sc "types" "history") "4.7.9" (ir "https://registry.yarnpkg.com/@types/history/-/history-4.7.9.tgz") "1cfb6d60ef3822c589f18e70f8b12f9a28ce8724" [];
        "@types/hoist-non-react-statics@3.3.1" = f (sc "types" "hoist-non-react-statics") "3.3.1" (ir "https://registry.yarnpkg.com/@types/hoist-non-react-statics/-/hoist-non-react-statics-3.3.1.tgz") "1124aafe5118cb591977aeb1ceaaed1070eb039f" [
          (s."@types/react@*")
          (s."hoist-non-react-statics@^3.3.0")
          ];
        "@types/hoist-non-react-statics@^3.3.0" = s."@types/hoist-non-react-statics@3.3.1";
        "@types/html-minifier-terser@5.1.2" = f (sc "types" "html-minifier-terser") "5.1.2" (ir "https://registry.yarnpkg.com/@types/html-minifier-terser/-/html-minifier-terser-5.1.2.tgz") "693b316ad323ea97eed6b38ed1a3cc02b1672b57" [];
        "@types/html-minifier-terser@^5.0.0" = s."@types/html-minifier-terser@5.1.2";
        "@types/istanbul-lib-coverage@*" = s."@types/istanbul-lib-coverage@2.0.3";
        "@types/istanbul-lib-coverage@2.0.3" = f (sc "types" "istanbul-lib-coverage") "2.0.3" (ir "https://registry.yarnpkg.com/@types/istanbul-lib-coverage/-/istanbul-lib-coverage-2.0.3.tgz") "4ba8ddb720221f432e443bd5f9117fd22cfd4762" [];
        "@types/istanbul-lib-coverage@^2.0.0" = s."@types/istanbul-lib-coverage@2.0.3";
        "@types/istanbul-lib-coverage@^2.0.1" = s."@types/istanbul-lib-coverage@2.0.3";
        "@types/istanbul-lib-report@*" = s."@types/istanbul-lib-report@3.0.0";
        "@types/istanbul-lib-report@3.0.0" = f (sc "types" "istanbul-lib-report") "3.0.0" (ir "https://registry.yarnpkg.com/@types/istanbul-lib-report/-/istanbul-lib-report-3.0.0.tgz") "c14c24f18ea8190c118ee7562b7ff99a36552686" [
          (s."@types/istanbul-lib-coverage@*")
          ];
        "@types/istanbul-reports@1.1.2" = f (sc "types" "istanbul-reports") "1.1.2" (ir "https://registry.yarnpkg.com/@types/istanbul-reports/-/istanbul-reports-1.1.2.tgz") "e875cc689e47bce549ec81f3df5e6f6f11cfaeb2" [
          (s."@types/istanbul-lib-coverage@*")
          (s."@types/istanbul-lib-report@*")
          ];
        "@types/istanbul-reports@3.0.1" = f (sc "types" "istanbul-reports") "3.0.1" (ir "https://registry.yarnpkg.com/@types/istanbul-reports/-/istanbul-reports-3.0.1.tgz") "9153fe98bba2bd565a63add9436d6f0d7f8468ff" [
          (s."@types/istanbul-lib-report@*")
          ];
        "@types/istanbul-reports@^1.1.1" = s."@types/istanbul-reports@1.1.2";
        "@types/istanbul-reports@^3.0.0" = s."@types/istanbul-reports@3.0.1";
        "@types/jest@24.9.1" = f (sc "types" "jest") "24.9.1" (ir "https://registry.yarnpkg.com/@types/jest/-/jest-24.9.1.tgz") "02baf9573c78f1b9974a5f36778b366aa77bd534" [
          (s."jest-diff@^24.3.0")
          ];
        "@types/jest@^24.0.0" = s."@types/jest@24.9.1";
        "@types/json-schema@*" = s."@types/json-schema@7.0.9";
        "@types/json-schema@7.0.9" = f (sc "types" "json-schema") "7.0.9" (ir "https://registry.yarnpkg.com/@types/json-schema/-/json-schema-7.0.9.tgz") "97edc9037ea0c38585320b28964dde3b39e4660d" [];
        "@types/json-schema@^7.0.3" = s."@types/json-schema@7.0.9";
        "@types/json-schema@^7.0.5" = s."@types/json-schema@7.0.9";
        "@types/json-schema@^7.0.7" = s."@types/json-schema@7.0.9";
        "@types/json-schema@^7.0.8" = s."@types/json-schema@7.0.9";
        "@types/minimatch@*" = s."@types/minimatch@3.0.5";
        "@types/minimatch@3.0.5" = f (sc "types" "minimatch") "3.0.5" (ir "https://registry.yarnpkg.com/@types/minimatch/-/minimatch-3.0.5.tgz") "1001cc5e6a3704b83c236027e77f2f58ea010f40" [];
        "@types/minimatch@^3.0.3" = s."@types/minimatch@3.0.5";
        "@types/node-fetch@2.5.12" = f (sc "types" "node-fetch") "2.5.12" (ir "https://registry.yarnpkg.com/@types/node-fetch/-/node-fetch-2.5.12.tgz") "8a6f779b1d4e60b7a57fb6fd48d84fb545b9cc66" [
          (s."@types/node@*")
          (s."form-data@^3.0.0")
          ];
        "@types/node-fetch@^2.5.10" = s."@types/node-fetch@2.5.12";
        "@types/node@*" = s."@types/node@16.4.13";
        "@types/node@12.20.19" = f (sc "types" "node") "12.20.19" (ir "https://registry.yarnpkg.com/@types/node/-/node-12.20.19.tgz") "538e61fc220f77ae4a4663c3d8c3cb391365c209" [];
        "@types/node@16.4.13" = f (sc "types" "node") "16.4.13" (ir "https://registry.yarnpkg.com/@types/node/-/node-16.4.13.tgz") "7dfd9c14661edc65cccd43a29eb454174642370d" [];
        "@types/node@^12.0.0" = s."@types/node@12.20.19";
        "@types/normalize-package-data@2.4.1" = f (sc "types" "normalize-package-data") "2.4.1" (ir "https://registry.yarnpkg.com/@types/normalize-package-data/-/normalize-package-data-2.4.1.tgz") "d3357479a0fdfdd5907fe67e17e0a85c906e1301" [];
        "@types/normalize-package-data@^2.4.0" = s."@types/normalize-package-data@2.4.1";
        "@types/parse-json@4.0.0" = f (sc "types" "parse-json") "4.0.0" (ir "https://registry.yarnpkg.com/@types/parse-json/-/parse-json-4.0.0.tgz") "2f8bb441434d163b35fb8ffdccd7138927ffb8c0" [];
        "@types/parse-json@^4.0.0" = s."@types/parse-json@4.0.0";
        "@types/prettier@2.3.2" = f (sc "types" "prettier") "2.3.2" (ir "https://registry.yarnpkg.com/@types/prettier/-/prettier-2.3.2.tgz") "fc8c2825e4ed2142473b4a81064e6e081463d1b3" [];
        "@types/prettier@^2.0.0" = s."@types/prettier@2.3.2";
        "@types/prop-types@*" = s."@types/prop-types@15.7.4";
        "@types/prop-types@15.7.4" = f (sc "types" "prop-types") "15.7.4" (ir "https://registry.yarnpkg.com/@types/prop-types/-/prop-types-15.7.4.tgz") "fcf7205c25dff795ee79af1e30da2c9790808f11" [];
        "@types/q@1.5.5" = f (sc "types" "q") "1.5.5" (ir "https://registry.yarnpkg.com/@types/q/-/q-1.5.5.tgz") "75a2a8e7d8ab4b230414505d92335d1dcb53a6df" [];
        "@types/q@^1.5.1" = s."@types/q@1.5.5";
        "@types/react-dom@*" = s."@types/react-dom@17.0.9";
        "@types/react-dom@16.9.14" = f (sc "types" "react-dom") "16.9.14" (ir "https://registry.yarnpkg.com/@types/react-dom/-/react-dom-16.9.14.tgz") "674b8f116645fe5266b40b525777fc6bb8eb3bcd" [
          (s."@types/react@^16")
          ];
        "@types/react-dom@17.0.9" = f (sc "types" "react-dom") "17.0.9" (ir "https://registry.yarnpkg.com/@types/react-dom/-/react-dom-17.0.9.tgz") "441a981da9d7be117042e1a6fd3dac4b30f55add" [
          (s."@types/react@*")
          ];
        "@types/react-dom@^16.9.0" = s."@types/react-dom@16.9.14";
        "@types/react-redux@7.1.18" = f (sc "types" "react-redux") "7.1.18" (ir "https://registry.yarnpkg.com/@types/react-redux/-/react-redux-7.1.18.tgz") "2bf8fd56ebaae679a90ebffe48ff73717c438e04" [
          (s."@types/hoist-non-react-statics@^3.3.0")
          (s."@types/react@*")
          (s."hoist-non-react-statics@^3.3.0")
          (s."redux@^4.0.0")
          ];
        "@types/react-redux@^7.1.16" = s."@types/react-redux@7.1.18";
        "@types/react-redux@^7.1.7" = s."@types/react-redux@7.1.18";
        "@types/react-router-dom@5.1.8" = f (sc "types" "react-router-dom") "5.1.8" (ir "https://registry.yarnpkg.com/@types/react-router-dom/-/react-router-dom-5.1.8.tgz") "bf3e1c8149b3d62eaa206d58599de82df0241192" [
          (s."@types/history@*")
          (s."@types/react@*")
          (s."@types/react-router@*")
          ];
        "@types/react-router-dom@^5.1.8" = s."@types/react-router-dom@5.1.8";
        "@types/react-router@*" = s."@types/react-router@5.1.16";
        "@types/react-router@5.1.16" = f (sc "types" "react-router") "5.1.16" (ir "https://registry.yarnpkg.com/@types/react-router/-/react-router-5.1.16.tgz") "f3ba045fb96634e38b21531c482f9aeb37608a99" [
          (s."@types/history@*")
          (s."@types/react@*")
          ];
        "@types/react-router@^5.1.16" = s."@types/react-router@5.1.16";
        "@types/react@*" = s."@types/react@17.0.16";
        "@types/react@16.14.12" = f (sc "types" "react") "16.14.12" (ir "https://registry.yarnpkg.com/@types/react/-/react-16.14.12.tgz") "1e38e2114e568f6541f88628a207f72630ee161f" [
          (s."@types/prop-types@*")
          (s."@types/scheduler@*")
          (s."csstype@^3.0.2")
          ];
        "@types/react@17.0.16" = f (sc "types" "react") "17.0.16" (ir "https://registry.yarnpkg.com/@types/react/-/react-17.0.16.tgz") "056f40c45645761527baeb7d89d842a6abdf285a" [
          (s."@types/prop-types@*")
          (s."@types/scheduler@*")
          (s."csstype@^3.0.2")
          ];
        "@types/react@^16" = s."@types/react@16.14.12";
        "@types/react@^16.9.0" = s."@types/react@16.14.12";
        "@types/resolve@0.0.8" = f (sc "types" "resolve") "0.0.8" (ir "https://registry.yarnpkg.com/@types/resolve/-/resolve-0.0.8.tgz") "f26074d238e02659e323ce1a13d041eee280e194" [
          (s."@types/node@*")
          ];
        "@types/scheduler@*" = s."@types/scheduler@0.16.2";
        "@types/scheduler@0.16.2" = f (sc "types" "scheduler") "0.16.2" (ir "https://registry.yarnpkg.com/@types/scheduler/-/scheduler-0.16.2.tgz") "1a62f89525723dde24ba1b01b092bf5df8ad4d39" [];
        "@types/source-list-map@*" = s."@types/source-list-map@0.1.2";
        "@types/source-list-map@0.1.2" = f (sc "types" "source-list-map") "0.1.2" (ir "https://registry.yarnpkg.com/@types/source-list-map/-/source-list-map-0.1.2.tgz") "0078836063ffaf17412349bba364087e0ac02ec9" [];
        "@types/stack-utils@2.0.1" = f (sc "types" "stack-utils") "2.0.1" (ir "https://registry.yarnpkg.com/@types/stack-utils/-/stack-utils-2.0.1.tgz") "20f18294f797f2209b5f65c8e3b5c8e8261d127c" [];
        "@types/stack-utils@^2.0.0" = s."@types/stack-utils@2.0.1";
        "@types/tapable@1.0.8" = f (sc "types" "tapable") "1.0.8" (ir "https://registry.yarnpkg.com/@types/tapable/-/tapable-1.0.8.tgz") "b94a4391c85666c7b73299fd3ad79d4faa435310" [];
        "@types/tapable@^1" = s."@types/tapable@1.0.8";
        "@types/tapable@^1.0.5" = s."@types/tapable@1.0.8";
        "@types/testing-library__dom@*" = s."@types/testing-library__dom@7.5.0";
        "@types/testing-library__dom@6.14.0" = f (sc "types" "testing-library__dom") "6.14.0" (ir "https://registry.yarnpkg.com/@types/testing-library__dom/-/testing-library__dom-6.14.0.tgz") "1aede831cb4ed4a398448df5a2c54b54a365644e" [
          (s."pretty-format@^24.3.0")
          ];
        "@types/testing-library__dom@7.5.0" = f (sc "types" "testing-library__dom") "7.5.0" (ir "https://registry.yarnpkg.com/@types/testing-library__dom/-/testing-library__dom-7.5.0.tgz") "e0a00dd766983b1d6e9d10d33e708005ce6ad13e" [
          (s."@testing-library/dom@*")
          ];
        "@types/testing-library__dom@^6.12.1" = s."@types/testing-library__dom@6.14.0";
        "@types/testing-library__react@9.1.3" = f (sc "types" "testing-library__react") "9.1.3" (ir "https://registry.yarnpkg.com/@types/testing-library__react/-/testing-library__react-9.1.3.tgz") "35eca61cc6ea923543796f16034882a1603d7302" [
          (s."@types/react-dom@*")
          (s."@types/testing-library__dom@*")
          (s."pretty-format@^25.1.0")
          ];
        "@types/testing-library__react@^9.1.2" = s."@types/testing-library__react@9.1.3";
        "@types/uglify-js@*" = s."@types/uglify-js@3.13.1";
        "@types/uglify-js@3.13.1" = f (sc "types" "uglify-js") "3.13.1" (ir "https://registry.yarnpkg.com/@types/uglify-js/-/uglify-js-3.13.1.tgz") "5e889e9e81e94245c75b6450600e1c5ea2878aea" [
          (s."source-map@^0.6.1")
          ];
        "@types/webpack-sources@*" = s."@types/webpack-sources@2.1.1";
        "@types/webpack-sources@2.1.1" = f (sc "types" "webpack-sources") "2.1.1" (ir "https://registry.yarnpkg.com/@types/webpack-sources/-/webpack-sources-2.1.1.tgz") "6af17e3a3ded71eec2b98008d7c12f498a0a4506" [
          (s."@types/node@*")
          (s."@types/source-list-map@*")
          (s."source-map@^0.7.3")
          ];
        "@types/webpack@4.41.30" = f (sc "types" "webpack") "4.41.30" (ir "https://registry.yarnpkg.com/@types/webpack/-/webpack-4.41.30.tgz") "fd3db6d0d41e145a8eeeafcd3c4a7ccde9068ddc" [
          (s."@types/node@*")
          (s."@types/tapable@^1")
          (s."@types/uglify-js@*")
          (s."@types/webpack-sources@*")
          (s."anymatch@^3.0.0")
          (s."source-map@^0.6.0")
          ];
        "@types/webpack@^4.41.8" = s."@types/webpack@4.41.30";
        "@types/yargs-parser@*" = s."@types/yargs-parser@20.2.1";
        "@types/yargs-parser@20.2.1" = f (sc "types" "yargs-parser") "20.2.1" (ir "https://registry.yarnpkg.com/@types/yargs-parser/-/yargs-parser-20.2.1.tgz") "3b9ce2489919d9e4fea439b76916abc34b2df129" [];
        "@types/yargs@13.0.12" = f (sc "types" "yargs") "13.0.12" (ir "https://registry.yarnpkg.com/@types/yargs/-/yargs-13.0.12.tgz") "d895a88c703b78af0465a9de88aa92c61430b092" [
          (s."@types/yargs-parser@*")
          ];
        "@types/yargs@15.0.14" = f (sc "types" "yargs") "15.0.14" (ir "https://registry.yarnpkg.com/@types/yargs/-/yargs-15.0.14.tgz") "26d821ddb89e70492160b66d10a0eb6df8f6fb06" [
          (s."@types/yargs-parser@*")
          ];
        "@types/yargs@16.0.4" = f (sc "types" "yargs") "16.0.4" (ir "https://registry.yarnpkg.com/@types/yargs/-/yargs-16.0.4.tgz") "26aad98dd2c2a38e421086ea9ad42b9e51642977" [
          (s."@types/yargs-parser@*")
          ];
        "@types/yargs@^13.0.0" = s."@types/yargs@13.0.12";
        "@types/yargs@^15.0.0" = s."@types/yargs@15.0.14";
        "@types/yargs@^16.0.0" = s."@types/yargs@16.0.4";
        "@types/zen-observable@0.8.3" = f (sc "types" "zen-observable") "0.8.3" (ir "https://registry.yarnpkg.com/@types/zen-observable/-/zen-observable-0.8.3.tgz") "781d360c282436494b32fe7d9f7f8e64b3118aa3" [];
        "@typescript-eslint/eslint-plugin@4.29.0" = f (sc "typescript-eslint" "eslint-plugin") "4.29.0" (ir "https://registry.yarnpkg.com/@typescript-eslint/eslint-plugin/-/eslint-plugin-4.29.0.tgz") "b866c9cd193bfaba5e89bade0015629ebeb27996" [
          (s."@typescript-eslint/experimental-utils@4.29.0")
          (s."@typescript-eslint/scope-manager@4.29.0")
          (s."debug@^4.3.1")
          (s."functional-red-black-tree@^1.0.1")
          (s."regexpp@^3.1.0")
          (s."semver@^7.3.5")
          (s."tsutils@^3.21.0")
          ];
        "@typescript-eslint/eslint-plugin@^4.5.0" = s."@typescript-eslint/eslint-plugin@4.29.0";
        "@typescript-eslint/experimental-utils@3.10.1" = f (sc "typescript-eslint" "experimental-utils") "3.10.1" (ir "https://registry.yarnpkg.com/@typescript-eslint/experimental-utils/-/experimental-utils-3.10.1.tgz") "e179ffc81a80ebcae2ea04e0332f8b251345a686" [
          (s."@types/json-schema@^7.0.3")
          (s."@typescript-eslint/types@3.10.1")
          (s."@typescript-eslint/typescript-estree@3.10.1")
          (s."eslint-scope@^5.0.0")
          (s."eslint-utils@^2.0.0")
          ];
        "@typescript-eslint/experimental-utils@4.29.0" = f (sc "typescript-eslint" "experimental-utils") "4.29.0" (ir "https://registry.yarnpkg.com/@typescript-eslint/experimental-utils/-/experimental-utils-4.29.0.tgz") "19b1417602d0e1ef325b3312ee95f61220542df5" [
          (s."@types/json-schema@^7.0.7")
          (s."@typescript-eslint/scope-manager@4.29.0")
          (s."@typescript-eslint/types@4.29.0")
          (s."@typescript-eslint/typescript-estree@4.29.0")
          (s."eslint-scope@^5.1.1")
          (s."eslint-utils@^3.0.0")
          ];
        "@typescript-eslint/experimental-utils@^3.10.1" = s."@typescript-eslint/experimental-utils@3.10.1";
        "@typescript-eslint/experimental-utils@^4.0.1" = s."@typescript-eslint/experimental-utils@4.29.0";
        "@typescript-eslint/parser@4.29.0" = f (sc "typescript-eslint" "parser") "4.29.0" (ir "https://registry.yarnpkg.com/@typescript-eslint/parser/-/parser-4.29.0.tgz") "e5367ca3c63636bb5d8e0748fcbab7a4f4a04289" [
          (s."@typescript-eslint/scope-manager@4.29.0")
          (s."@typescript-eslint/types@4.29.0")
          (s."@typescript-eslint/typescript-estree@4.29.0")
          (s."debug@^4.3.1")
          ];
        "@typescript-eslint/parser@^4.5.0" = s."@typescript-eslint/parser@4.29.0";
        "@typescript-eslint/scope-manager@4.29.0" = f (sc "typescript-eslint" "scope-manager") "4.29.0" (ir "https://registry.yarnpkg.com/@typescript-eslint/scope-manager/-/scope-manager-4.29.0.tgz") "cf5474f87321bedf416ef65839b693bddd838599" [
          (s."@typescript-eslint/types@4.29.0")
          (s."@typescript-eslint/visitor-keys@4.29.0")
          ];
        "@typescript-eslint/types@3.10.1" = f (sc "typescript-eslint" "types") "3.10.1" (ir "https://registry.yarnpkg.com/@typescript-eslint/types/-/types-3.10.1.tgz") "1d7463fa7c32d8a23ab508a803ca2fe26e758727" [];
        "@typescript-eslint/types@4.29.0" = f (sc "typescript-eslint" "types") "4.29.0" (ir "https://registry.yarnpkg.com/@typescript-eslint/types/-/types-4.29.0.tgz") "c8f1a1e4441ea4aca9b3109241adbc145f7f8a4e" [];
        "@typescript-eslint/typescript-estree@3.10.1" = f (sc "typescript-eslint" "typescript-estree") "3.10.1" (ir "https://registry.yarnpkg.com/@typescript-eslint/typescript-estree/-/typescript-estree-3.10.1.tgz") "fd0061cc38add4fad45136d654408569f365b853" [
          (s."@typescript-eslint/types@3.10.1")
          (s."@typescript-eslint/visitor-keys@3.10.1")
          (s."debug@^4.1.1")
          (s."glob@^7.1.6")
          (s."is-glob@^4.0.1")
          (s."lodash@^4.17.15")
          (s."semver@^7.3.2")
          (s."tsutils@^3.17.1")
          ];
        "@typescript-eslint/typescript-estree@4.29.0" = f (sc "typescript-eslint" "typescript-estree") "4.29.0" (ir "https://registry.yarnpkg.com/@typescript-eslint/typescript-estree/-/typescript-estree-4.29.0.tgz") "af7ab547757b86c91bfdbc54ff86845410856256" [
          (s."@typescript-eslint/types@4.29.0")
          (s."@typescript-eslint/visitor-keys@4.29.0")
          (s."debug@^4.3.1")
          (s."globby@^11.0.3")
          (s."is-glob@^4.0.1")
          (s."semver@^7.3.5")
          (s."tsutils@^3.21.0")
          ];
        "@typescript-eslint/visitor-keys@3.10.1" = f (sc "typescript-eslint" "visitor-keys") "3.10.1" (ir "https://registry.yarnpkg.com/@typescript-eslint/visitor-keys/-/visitor-keys-3.10.1.tgz") "cd4274773e3eb63b2e870ac602274487ecd1e931" [
          (s."eslint-visitor-keys@^1.1.0")
          ];
        "@typescript-eslint/visitor-keys@4.29.0" = f (sc "typescript-eslint" "visitor-keys") "4.29.0" (ir "https://registry.yarnpkg.com/@typescript-eslint/visitor-keys/-/visitor-keys-4.29.0.tgz") "1ff60f240def4d85ea68d4fd2e4e9759b7850c04" [
          (s."@typescript-eslint/types@4.29.0")
          (s."eslint-visitor-keys@^2.0.0")
          ];
        "@webassemblyjs/ast@1.9.0" = f (sc "webassemblyjs" "ast") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/ast/-/ast-1.9.0.tgz") "bd850604b4042459a5a41cd7d338cbed695ed964" [
          (s."@webassemblyjs/helper-module-context@1.9.0")
          (s."@webassemblyjs/helper-wasm-bytecode@1.9.0")
          (s."@webassemblyjs/wast-parser@1.9.0")
          ];
        "@webassemblyjs/floating-point-hex-parser@1.9.0" = f (sc "webassemblyjs" "floating-point-hex-parser") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/floating-point-hex-parser/-/floating-point-hex-parser-1.9.0.tgz") "3c3d3b271bddfc84deb00f71344438311d52ffb4" [];
        "@webassemblyjs/helper-api-error@1.9.0" = f (sc "webassemblyjs" "helper-api-error") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/helper-api-error/-/helper-api-error-1.9.0.tgz") "203f676e333b96c9da2eeab3ccef33c45928b6a2" [];
        "@webassemblyjs/helper-buffer@1.9.0" = f (sc "webassemblyjs" "helper-buffer") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/helper-buffer/-/helper-buffer-1.9.0.tgz") "a1442d269c5feb23fcbc9ef759dac3547f29de00" [];
        "@webassemblyjs/helper-code-frame@1.9.0" = f (sc "webassemblyjs" "helper-code-frame") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/helper-code-frame/-/helper-code-frame-1.9.0.tgz") "647f8892cd2043a82ac0c8c5e75c36f1d9159f27" [
          (s."@webassemblyjs/wast-printer@1.9.0")
          ];
        "@webassemblyjs/helper-fsm@1.9.0" = f (sc "webassemblyjs" "helper-fsm") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/helper-fsm/-/helper-fsm-1.9.0.tgz") "c05256b71244214671f4b08ec108ad63b70eddb8" [];
        "@webassemblyjs/helper-module-context@1.9.0" = f (sc "webassemblyjs" "helper-module-context") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/helper-module-context/-/helper-module-context-1.9.0.tgz") "25d8884b76839871a08a6c6f806c3979ef712f07" [];
        "@webassemblyjs/helper-wasm-bytecode@1.9.0" = f (sc "webassemblyjs" "helper-wasm-bytecode") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/helper-wasm-bytecode/-/helper-wasm-bytecode-1.9.0.tgz") "4fed8beac9b8c14f8c58b70d124d549dd1fe5790" [];
        "@webassemblyjs/helper-wasm-section@1.9.0" = f (sc "webassemblyjs" "helper-wasm-section") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/helper-wasm-section/-/helper-wasm-section-1.9.0.tgz") "5a4138d5a6292ba18b04c5ae49717e4167965346" [
          (s."@webassemblyjs/ast@1.9.0")
          (s."@webassemblyjs/helper-buffer@1.9.0")
          (s."@webassemblyjs/helper-wasm-bytecode@1.9.0")
          (s."@webassemblyjs/wasm-gen@1.9.0")
          ];
        "@webassemblyjs/ieee754@1.9.0" = f (sc "webassemblyjs" "ieee754") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/ieee754/-/ieee754-1.9.0.tgz") "15c7a0fbaae83fb26143bbacf6d6df1702ad39e4" [
          (s."@xtuc/ieee754@^1.2.0")
          ];
        "@webassemblyjs/leb128@1.9.0" = f (sc "webassemblyjs" "leb128") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/leb128/-/leb128-1.9.0.tgz") "f19ca0b76a6dc55623a09cffa769e838fa1e1c95" [
          (s."@xtuc/long@4.2.2")
          ];
        "@webassemblyjs/utf8@1.9.0" = f (sc "webassemblyjs" "utf8") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/utf8/-/utf8-1.9.0.tgz") "04d33b636f78e6a6813227e82402f7637b6229ab" [];
        "@webassemblyjs/wasm-edit@1.9.0" = f (sc "webassemblyjs" "wasm-edit") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/wasm-edit/-/wasm-edit-1.9.0.tgz") "3fe6d79d3f0f922183aa86002c42dd256cfee9cf" [
          (s."@webassemblyjs/ast@1.9.0")
          (s."@webassemblyjs/helper-buffer@1.9.0")
          (s."@webassemblyjs/helper-wasm-bytecode@1.9.0")
          (s."@webassemblyjs/helper-wasm-section@1.9.0")
          (s."@webassemblyjs/wasm-gen@1.9.0")
          (s."@webassemblyjs/wasm-opt@1.9.0")
          (s."@webassemblyjs/wasm-parser@1.9.0")
          (s."@webassemblyjs/wast-printer@1.9.0")
          ];
        "@webassemblyjs/wasm-gen@1.9.0" = f (sc "webassemblyjs" "wasm-gen") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/wasm-gen/-/wasm-gen-1.9.0.tgz") "50bc70ec68ded8e2763b01a1418bf43491a7a49c" [
          (s."@webassemblyjs/ast@1.9.0")
          (s."@webassemblyjs/helper-wasm-bytecode@1.9.0")
          (s."@webassemblyjs/ieee754@1.9.0")
          (s."@webassemblyjs/leb128@1.9.0")
          (s."@webassemblyjs/utf8@1.9.0")
          ];
        "@webassemblyjs/wasm-opt@1.9.0" = f (sc "webassemblyjs" "wasm-opt") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/wasm-opt/-/wasm-opt-1.9.0.tgz") "2211181e5b31326443cc8112eb9f0b9028721a61" [
          (s."@webassemblyjs/ast@1.9.0")
          (s."@webassemblyjs/helper-buffer@1.9.0")
          (s."@webassemblyjs/wasm-gen@1.9.0")
          (s."@webassemblyjs/wasm-parser@1.9.0")
          ];
        "@webassemblyjs/wasm-parser@1.9.0" = f (sc "webassemblyjs" "wasm-parser") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/wasm-parser/-/wasm-parser-1.9.0.tgz") "9d48e44826df4a6598294aa6c87469d642fff65e" [
          (s."@webassemblyjs/ast@1.9.0")
          (s."@webassemblyjs/helper-api-error@1.9.0")
          (s."@webassemblyjs/helper-wasm-bytecode@1.9.0")
          (s."@webassemblyjs/ieee754@1.9.0")
          (s."@webassemblyjs/leb128@1.9.0")
          (s."@webassemblyjs/utf8@1.9.0")
          ];
        "@webassemblyjs/wast-parser@1.9.0" = f (sc "webassemblyjs" "wast-parser") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/wast-parser/-/wast-parser-1.9.0.tgz") "3031115d79ac5bd261556cecc3fa90a3ef451914" [
          (s."@webassemblyjs/floating-point-hex-parser@1.9.0")
          (s."@webassemblyjs/helper-api-error@1.9.0")
          (s."@webassemblyjs/helper-code-frame@1.9.0")
          (s."@webassemblyjs/helper-fsm@1.9.0")
          (s."@xtuc/long@4.2.2")
          ];
        "@webassemblyjs/wast-printer@1.9.0" = f (sc "webassemblyjs" "wast-printer") "1.9.0" (ir "https://registry.yarnpkg.com/@webassemblyjs/wast-printer/-/wast-printer-1.9.0.tgz") "4935d54c85fef637b00ce9f52377451d00d47899" [
          (s."@xtuc/long@4.2.2")
          ];
        "@webgpu/glslang@0.0.15" = f (sc "webgpu" "glslang") "0.0.15" (ir "https://registry.yarnpkg.com/@webgpu/glslang/-/glslang-0.0.15.tgz") "f5ccaf6015241e6175f4b90906b053f88483d1f2" [];
        "@webgpu/glslang@^0.0.15" = s."@webgpu/glslang@0.0.15";
        "@webgpu/types@0.0.31" = f (sc "webgpu" "types") "0.0.31" (ir "https://registry.yarnpkg.com/@webgpu/types/-/types-0.0.31.tgz") "c05ec6e60024bf1836f31236ecd7677a969a2a2c" [];
        "@webgpu/types@^0.0.31" = s."@webgpu/types@0.0.31";
        "@wry/context@0.6.1" = f (sc "wry" "context") "0.6.1" (ir "https://registry.yarnpkg.com/@wry/context/-/context-0.6.1.tgz") "c3c29c0ad622adb00f6a53303c4f965ee06ebeb2" [
          (s."tslib@^2.3.0")
          ];
        "@wry/context@^0.6.0" = s."@wry/context@0.6.1";
        "@wry/equality@0.1.11" = f (sc "wry" "equality") "0.1.11" (ir "https://registry.yarnpkg.com/@wry/equality/-/equality-0.1.11.tgz") "35cb156e4a96695aa81a9ecc4d03787bc17f1790" [
          (s."tslib@^1.9.3")
          ];
        "@wry/equality@0.5.2" = f (sc "wry" "equality") "0.5.2" (ir "https://registry.yarnpkg.com/@wry/equality/-/equality-0.5.2.tgz") "72c8a7a7d884dff30b612f4f8464eba26c080e73" [
          (s."tslib@^2.3.0")
          ];
        "@wry/equality@^0.1.2" = s."@wry/equality@0.1.11";
        "@wry/equality@^0.5.0" = s."@wry/equality@0.5.2";
        "@wry/trie@0.3.1" = f (sc "wry" "trie") "0.3.1" (ir "https://registry.yarnpkg.com/@wry/trie/-/trie-0.3.1.tgz") "2279b790f15032f8bcea7fc944d27988e5b3b139" [
          (s."tslib@^2.3.0")
          ];
        "@wry/trie@^0.3.0" = s."@wry/trie@0.3.1";
        "@xtuc/ieee754@1.2.0" = f (sc "xtuc" "ieee754") "1.2.0" (ir "https://registry.yarnpkg.com/@xtuc/ieee754/-/ieee754-1.2.0.tgz") "eef014a3145ae477a1cbc00cd1e552336dceb790" [];
        "@xtuc/ieee754@^1.2.0" = s."@xtuc/ieee754@1.2.0";
        "@xtuc/long@4.2.2" = f (sc "xtuc" "long") "4.2.2" (ir "https://registry.yarnpkg.com/@xtuc/long/-/long-4.2.2.tgz") "d291c6a4e97989b5c61d9acf396ae4fe133a718d" [];
        "abab@2.0.5" = f "abab" "2.0.5" y "c0b678fb32d60fc1219c784d6a826fe385aeb79a" [];
        "abab@^2.0.3" = s."abab@2.0.5";
        "abab@^2.0.5" = s."abab@2.0.5";
        "accepts@1.3.7" = f "accepts" "1.3.7" y "531bc726517a3b2b41f850021c6cc15eaab507cd" [
          (s."mime-types@~2.1.24")
          (s."negotiator@0.6.2")
          ];
        "accepts@~1.3.4" = s."accepts@1.3.7";
        "accepts@~1.3.5" = s."accepts@1.3.7";
        "accepts@~1.3.7" = s."accepts@1.3.7";
        "acorn-globals@6.0.0" = f "acorn-globals" "6.0.0" y "46cdd39f0f8ff08a876619b55f5ac8a6dc770b45" [
          (s."acorn@^7.1.1")
          (s."acorn-walk@^7.1.1")
          ];
        "acorn-globals@^6.0.0" = s."acorn-globals@6.0.0";
        "acorn-jsx@5.3.2" = f "acorn-jsx" "5.3.2" y "7ed5bb55908b3b2f1bc55c6af1653bada7f07937" [];
        "acorn-jsx@^5.3.1" = s."acorn-jsx@5.3.2";
        "acorn-walk@7.2.0" = f "acorn-walk" "7.2.0" y "0de889a601203909b0fbe07b8938dc21d2e967bc" [];
        "acorn-walk@^7.1.1" = s."acorn-walk@7.2.0";
        "acorn@6.4.2" = f "acorn" "6.4.2" y "35866fd710528e92de10cf06016498e47e39e1e6" [];
        "acorn@7.4.1" = f "acorn" "7.4.1" y "feaed255973d2e77555b83dbc08851a6c63520fa" [];
        "acorn@8.4.1" = f "acorn" "8.4.1" y "56c36251fc7cabc7096adc18f05afe814321a28c" [];
        "acorn@^6.4.1" = s."acorn@6.4.2";
        "acorn@^7.1.0" = s."acorn@7.4.1";
        "acorn@^7.1.1" = s."acorn@7.4.1";
        "acorn@^7.4.0" = s."acorn@7.4.1";
        "acorn@^8.2.4" = s."acorn@8.4.1";
        "address@1.1.2" = f "address" "1.1.2" y "bf1116c9c758c51b7a933d296b72c221ed9428b6" [];
        "address@^1.0.1" = s."address@1.1.2";
        "adjust-sourcemap-loader@3.0.0" = f "adjust-sourcemap-loader" "3.0.0" y "5ae12fb5b7b1c585e80bbb5a63ec163a1a45e61e" [
          (s."loader-utils@^2.0.0")
          (s."regex-parser@^2.2.11")
          ];
        "agent-base@6" = s."agent-base@6.0.2";
        "agent-base@6.0.2" = f "agent-base" "6.0.2" y "49fff58577cfee3f37176feab4c22e00f86d7f77" [
          (s."debug@4")
          ];
        "aggregate-error@3.1.0" = f "aggregate-error" "3.1.0" y "92670ff50f5359bdb7a3e0d40d0ec30c5737687a" [
          (s."clean-stack@^2.0.0")
          (s."indent-string@^4.0.0")
          ];
        "aggregate-error@^3.0.0" = s."aggregate-error@3.1.0";
        "ajv-errors@1.0.1" = f "ajv-errors" "1.0.1" y "f35986aceb91afadec4102fbd85014950cefa64d" [];
        "ajv-errors@^1.0.0" = s."ajv-errors@1.0.1";
        "ajv-keywords@3.5.2" = f "ajv-keywords" "3.5.2" y "31f29da5ab6e00d1c2d329acf7b5929614d5014d" [];
        "ajv-keywords@^3.1.0" = s."ajv-keywords@3.5.2";
        "ajv-keywords@^3.4.1" = s."ajv-keywords@3.5.2";
        "ajv-keywords@^3.5.2" = s."ajv-keywords@3.5.2";
        "ajv@6.12.6" = f "ajv" "6.12.6" y "baf5a62e802b07d977034586f8c3baf5adf26df4" [
          (s."fast-deep-equal@^3.1.1")
          (s."fast-json-stable-stringify@^2.0.0")
          (s."json-schema-traverse@^0.4.1")
          (s."uri-js@^4.2.2")
          ];
        "ajv@8.6.2" = f "ajv" "8.6.2" y "2fb45e0e5fcbc0813326c1c3da535d1881bb0571" [
          (s."fast-deep-equal@^3.1.1")
          (s."json-schema-traverse@^1.0.0")
          (s."require-from-string@^2.0.2")
          (s."uri-js@^4.2.2")
          ];
        "ajv@^6.1.0" = s."ajv@6.12.6";
        "ajv@^6.10.0" = s."ajv@6.12.6";
        "ajv@^6.10.2" = s."ajv@6.12.6";
        "ajv@^6.12.4" = s."ajv@6.12.6";
        "ajv@^6.12.5" = s."ajv@6.12.6";
        "ajv@^8.0.1" = s."ajv@8.6.2";
        "alphanum-sort@1.0.2" = f "alphanum-sort" "1.0.2" y "97a1119649b211ad33691d9f9f486a8ec9fbe0a3" [];
        "alphanum-sort@^1.0.0" = s."alphanum-sort@1.0.2";
        "ansi-colors@3.2.4" = f "ansi-colors" "3.2.4" y "e3a3da4bfbae6c86a9c285625de124a234026fbf" [];
        "ansi-colors@4.1.1" = f "ansi-colors" "4.1.1" y "cbb9ae256bf750af1eab344f229aa27fe94ba348" [];
        "ansi-colors@^3.0.0" = s."ansi-colors@3.2.4";
        "ansi-colors@^4.1.1" = s."ansi-colors@4.1.1";
        "ansi-escapes@3.2.0" = f "ansi-escapes" "3.2.0" y "8780b98ff9dbf5638152d1f1fe5c1d7b4442976b" [];
        "ansi-escapes@4.3.2" = f "ansi-escapes" "4.3.2" y "6b2291d1db7d98b6521d5f1efa42d0f3a9feb65e" [
          (s."type-fest@^0.21.3")
          ];
        "ansi-escapes@^3.0.0" = s."ansi-escapes@3.2.0";
        "ansi-escapes@^3.1.0" = s."ansi-escapes@3.2.0";
        "ansi-escapes@^4.2.1" = s."ansi-escapes@4.3.2";
        "ansi-escapes@^4.3.0" = s."ansi-escapes@4.3.2";
        "ansi-escapes@^4.3.1" = s."ansi-escapes@4.3.2";
        "ansi-html@0.0.7" = f "ansi-html" "0.0.7" y "813584021962a9e9e6fd039f940d12f56ca7859e" [];
        "ansi-html@^0.0.7" = s."ansi-html@0.0.7";
        "ansi-regex@2.1.1" = f "ansi-regex" "2.1.1" y "c3b33ab5ee360d86e0e628f0468ae7ef27d654df" [];
        "ansi-regex@3.0.0" = f "ansi-regex" "3.0.0" y "ed0317c322064f79466c02966bddb605ab37d998" [];
        "ansi-regex@4.1.0" = f "ansi-regex" "4.1.0" y "8b9f8f08cf1acb843756a839ca8c7e3168c51997" [];
        "ansi-regex@5.0.0" = f "ansi-regex" "5.0.0" y "388539f55179bf39339c81af30a654d69f87cb75" [];
        "ansi-regex@5.0.1" = f "ansi-regex" "5.0.1" y "082cb2c89c9fe8659a311a53bd6a4dc5301db304" [];
        "ansi-regex@^2.0.0" = s."ansi-regex@2.1.1";
        "ansi-regex@^3.0.0" = s."ansi-regex@3.0.0";
        "ansi-regex@^4.0.0" = s."ansi-regex@4.1.0";
        "ansi-regex@^4.1.0" = s."ansi-regex@4.1.0";
        "ansi-regex@^5.0.0" = s."ansi-regex@5.0.0";
        "ansi-regex@^5.0.1" = s."ansi-regex@5.0.1";
        "ansi-styles@2.2.1" = f "ansi-styles" "2.2.1" y "b432dd3358b634cf75e1e4664368240533c1ddbe" [];
        "ansi-styles@3.2.1" = f "ansi-styles" "3.2.1" y "41fbb20243e50b12be0f04b8dedbf07520ce841d" [
          (s."color-convert@^1.9.0")
          ];
        "ansi-styles@4.3.0" = f "ansi-styles" "4.3.0" y "edd803628ae71c04c85ae7a0906edad34b648937" [
          (s."color-convert@^2.0.1")
          ];
        "ansi-styles@5.2.0" = f "ansi-styles" "5.2.0" y "07449690ad45777d1924ac2abb2fc8895dba836b" [];
        "ansi-styles@^2.2.1" = s."ansi-styles@2.2.1";
        "ansi-styles@^3.2.0" = s."ansi-styles@3.2.1";
        "ansi-styles@^3.2.1" = s."ansi-styles@3.2.1";
        "ansi-styles@^4.0.0" = s."ansi-styles@4.3.0";
        "ansi-styles@^4.1.0" = s."ansi-styles@4.3.0";
        "ansi-styles@^4.2.0" = s."ansi-styles@4.3.0";
        "ansi-styles@^5.0.0" = s."ansi-styles@5.2.0";
        "ansicolors@0.3.2" = f "ansicolors" "0.3.2" y "665597de86a9ffe3aa9bfbe6cae5c6ea426b4979" [];
        "ansicolors@~0.3.2" = s."ansicolors@0.3.2";
        "antd@4.16.10" = f "antd" "4.16.10" y "d785741413a1875d9e526a09b8f5388cc29677e9" [
          (s."@ant-design/colors@^6.0.0")
          (s."@ant-design/icons@^4.6.2")
          (s."@ant-design/react-slick@~0.28.1")
          (s."@babel/runtime@^7.12.5")
          (s."array-tree-filter@^2.1.0")
          (s."classnames@^2.2.6")
          (s."copy-to-clipboard@^3.2.0")
          (s."lodash@^4.17.21")
          (s."moment@^2.25.3")
          (s."rc-cascader@~1.4.0")
          (s."rc-checkbox@~2.3.0")
          (s."rc-collapse@~3.1.0")
          (s."rc-dialog@~8.6.0")
          (s."rc-drawer@~4.3.0")
          (s."rc-dropdown@~3.2.0")
          (s."rc-field-form@~1.20.0")
          (s."rc-image@~5.2.4")
          (s."rc-input-number@~7.1.0")
          (s."rc-mentions@~1.6.1")
          (s."rc-menu@~9.0.12")
          (s."rc-motion@^2.4.0")
          (s."rc-notification@~4.5.7")
          (s."rc-pagination@~3.1.6")
          (s."rc-picker@~2.5.10")
          (s."rc-progress@~3.1.0")
          (s."rc-rate@~2.9.0")
          (s."rc-resize-observer@^1.0.0")
          (s."rc-select@~12.1.6")
          (s."rc-slider@~9.7.1")
          (s."rc-steps@~4.1.0")
          (s."rc-switch@~3.2.0")
          (s."rc-table@~7.15.1")
          (s."rc-tabs@~11.10.0")
          (s."rc-textarea@~0.3.0")
          (s."rc-tooltip@~5.1.1")
          (s."rc-tree@~4.2.1")
          (s."rc-tree-select@~4.3.0")
          (s."rc-trigger@^5.2.1")
          (s."rc-upload@~4.3.0")
          (s."rc-util@^5.13.1")
          (s."scroll-into-view-if-needed@^2.2.25")
          (s."warning@^4.0.3")
          ];
        "antd@^4.16.10" = s."antd@4.16.10";
        "any-observable@0.3.0" = f "any-observable" "0.3.0" y "af933475e5806a67d0d7df090dd5e8bef65d119b" [];
        "any-observable@^0.3.0" = s."any-observable@0.3.0";
        "anymatch@2.0.0" = f "anymatch" "2.0.0" y "bcb24b4f37934d9aa7ac17b4adaf89e7c76ef2eb" [
          (s."micromatch@^3.1.4")
          (s."normalize-path@^2.1.1")
          ];
        "anymatch@3.1.2" = f "anymatch" "3.1.2" y "c0557c096af32f106198f4f4e2a383537e378716" [
          (s."normalize-path@^3.0.0")
          (s."picomatch@^2.0.4")
          ];
        "anymatch@^2.0.0" = s."anymatch@2.0.0";
        "anymatch@^3.0.0" = s."anymatch@3.1.2";
        "anymatch@^3.0.3" = s."anymatch@3.1.2";
        "anymatch@~3.1.2" = s."anymatch@3.1.2";
        "apollo-codegen-core@0.40.4" = f "apollo-codegen-core" "0.40.4" y "b17e515a893e9a5d006570258828f20ac4ffa63f" [
          (s."@babel/generator@7.14.8")
          (s."@babel/parser@^7.1.3")
          (s."@babel/types@7.14.8")
          (s."apollo-env@^0.10.0")
          (s."apollo-language-server@^1.26.4")
          (s."ast-types@^0.14.0")
          (s."common-tags@^1.5.1")
          (s."recast@^0.20.0")
          ];
        "apollo-codegen-core@^0.40.4" = s."apollo-codegen-core@0.40.4";
        "apollo-codegen-flow@0.38.4" = f "apollo-codegen-flow" "0.38.4" y "b6aa0903a9888af142b887ceede5072fcaca2595" [
          (s."@babel/generator@7.14.8")
          (s."@babel/types@7.14.8")
          (s."apollo-codegen-core@^0.40.4")
          (s."change-case@^4.0.0")
          (s."common-tags@^1.5.1")
          (s."inflected@^2.0.3")
          ];
        "apollo-codegen-flow@^0.38.4" = s."apollo-codegen-flow@0.38.4";
        "apollo-codegen-scala@0.39.4" = f "apollo-codegen-scala" "0.39.4" y "fb5fe247e2d8810b94f0aef505d2ebc1169736e7" [
          (s."apollo-codegen-core@^0.40.4")
          (s."change-case@^4.0.0")
          (s."common-tags@^1.5.1")
          (s."inflected@^2.0.3")
          ];
        "apollo-codegen-scala@^0.39.4" = s."apollo-codegen-scala@0.39.4";
        "apollo-codegen-swift@0.40.4" = f "apollo-codegen-swift" "0.40.4" y "88ff5eb49a5531e5b04a4c43ae61a4cf984ab80f" [
          (s."apollo-codegen-core@^0.40.4")
          (s."change-case@^4.0.0")
          (s."common-tags@^1.5.1")
          (s."inflected@^2.0.3")
          ];
        "apollo-codegen-swift@^0.40.4" = s."apollo-codegen-swift@0.40.4";
        "apollo-codegen-typescript@0.40.4" = f "apollo-codegen-typescript" "0.40.4" y "d5eb84050cdc91e37cce7ab80a1461cc23d0eea9" [
          (s."@babel/generator@7.14.8")
          (s."@babel/types@7.14.8")
          (s."apollo-codegen-core@^0.40.4")
          (s."change-case@^4.0.0")
          (s."common-tags@^1.5.1")
          (s."inflected@^2.0.3")
          ];
        "apollo-codegen-typescript@^0.40.4" = s."apollo-codegen-typescript@0.40.4";
        "apollo-datasource@0.9.0" = f "apollo-datasource" "0.9.0" y "b0b2913257a6103a5f4c03cb56d78a30e9d850db" [
          (s."apollo-server-caching@^0.7.0")
          (s."apollo-server-env@^3.1.0")
          ];
        "apollo-datasource@^0.9.0" = s."apollo-datasource@0.9.0";
        "apollo-env@0.10.0" = f "apollo-env" "0.10.0" y "8dd51bf974253a760ea15c81e870ff2c0d6e6820" [
          (s."@types/node-fetch@^2.5.10")
          (s."core-js@^3.0.1")
          (s."node-fetch@^2.6.1")
          (s."sha.js@^2.4.11")
          ];
        "apollo-env@^0.10.0" = s."apollo-env@0.10.0";
        "apollo-graphql@0.9.3" = f "apollo-graphql" "0.9.3" y "1ca6f625322ae10a66f57a39642849a07a7a5dc9" [
          (s."core-js-pure@^3.10.2")
          (s."lodash.sortby@^4.7.0")
          (s."sha.js@^2.4.11")
          ];
        "apollo-graphql@^0.9.3" = s."apollo-graphql@0.9.3";
        "apollo-language-server@1.26.4" = f "apollo-language-server" "1.26.4" y "62d5d21e2027d2fe7c18ac638dfeae36b400fc28" [
          (s."@apollo/federation@0.27.0")
          (s."@apollographql/apollo-tools@^0.5.1")
          (s."@apollographql/graphql-language-service-interface@^2.0.2")
          (s."@endemolshinegroup/cosmiconfig-typescript-loader@^1.0.0")
          (s."apollo-datasource@^0.9.0")
          (s."apollo-env@^0.10.0")
          (s."apollo-graphql@^0.9.3")
          (s."apollo-link@^1.2.3")
          (s."apollo-link-context@^1.0.9")
          (s."apollo-link-error@^1.1.1")
          (s."apollo-link-http@^1.5.5")
          (s."apollo-server-errors@^2.0.2")
          (s."await-to-js@^2.0.1")
          (s."core-js@^3.0.1")
          (s."cosmiconfig@^5.0.6")
          (s."dotenv@^8.0.0")
          (s."glob@^7.1.3")
          (s."graphql@14.0.2 - 14.2.0 || ^14.3.1 || ^15.0.0")
          (s."graphql-tag@^2.10.1")
          (s."lodash.debounce@^4.0.8")
          (s."lodash.merge@^4.6.1")
          (s."minimatch@^3.0.4")
          (s."moment@2.29.1")
          (s."vscode-languageserver@^5.1.0")
          (s."vscode-uri@1.0.6")
          ];
        "apollo-language-server@^1.26.4" = s."apollo-language-server@1.26.4";
        "apollo-link-context@1.0.20" = f "apollo-link-context" "1.0.20" y "1939ac5dc65d6dff0c855ee53521150053c24676" [
          (s."apollo-link@^1.2.14")
          (s."tslib@^1.9.3")
          ];
        "apollo-link-context@^1.0.9" = s."apollo-link-context@1.0.20";
        "apollo-link-error@1.1.13" = f "apollo-link-error" "1.1.13" y "c1a1bb876ffe380802c8df0506a32c33aad284cd" [
          (s."apollo-link@^1.2.14")
          (s."apollo-link-http-common@^0.2.16")
          (s."tslib@^1.9.3")
          ];
        "apollo-link-error@^1.1.1" = s."apollo-link-error@1.1.13";
        "apollo-link-http-common@0.2.16" = f "apollo-link-http-common" "0.2.16" y "756749dafc732792c8ca0923f9a40564b7c59ecc" [
          (s."apollo-link@^1.2.14")
          (s."ts-invariant@^0.4.0")
          (s."tslib@^1.9.3")
          ];
        "apollo-link-http-common@^0.2.16" = s."apollo-link-http-common@0.2.16";
        "apollo-link-http@1.5.17" = f "apollo-link-http" "1.5.17" y "499e9f1711bf694497f02c51af12d82de5d8d8ba" [
          (s."apollo-link@^1.2.14")
          (s."apollo-link-http-common@^0.2.16")
          (s."tslib@^1.9.3")
          ];
        "apollo-link-http@^1.5.5" = s."apollo-link-http@1.5.17";
        "apollo-link@1.2.14" = f "apollo-link" "1.2.14" y "3feda4b47f9ebba7f4160bef8b977ba725b684d9" [
          (s."apollo-utilities@^1.3.0")
          (s."ts-invariant@^0.4.0")
          (s."tslib@^1.9.3")
          (s."zen-observable-ts@^0.8.21")
          ];
        "apollo-link@^1.2.14" = s."apollo-link@1.2.14";
        "apollo-link@^1.2.3" = s."apollo-link@1.2.14";
        "apollo-server-caching@0.7.0" = f "apollo-server-caching" "0.7.0" y "e6d1e68e3bb571cba63a61f60b434fb771c6ff39" [
          (s."lru-cache@^6.0.0")
          ];
        "apollo-server-caching@^0.7.0" = s."apollo-server-caching@0.7.0";
        "apollo-server-env@3.1.0" = f "apollo-server-env" "3.1.0" y "0733c2ef50aea596cc90cf40a53f6ea2ad402cd0" [
          (s."node-fetch@^2.6.1")
          (s."util.promisify@^1.0.0")
          ];
        "apollo-server-env@^3.1.0" = s."apollo-server-env@3.1.0";
        "apollo-server-errors@2.5.0" = f "apollo-server-errors" "2.5.0" y "5d1024117c7496a2979e3e34908b5685fe112b68" [];
        "apollo-server-errors@^2.0.2" = s."apollo-server-errors@2.5.0";
        "apollo-utilities@1.3.4" = f "apollo-utilities" "1.3.4" y "6129e438e8be201b6c55b0f13ce49d2c7175c9cf" [
          (s."@wry/equality@^0.1.2")
          (s."fast-json-stable-stringify@^2.0.0")
          (s."ts-invariant@^0.4.0")
          (s."tslib@^1.10.0")
          ];
        "apollo-utilities@^1.3.0" = s."apollo-utilities@1.3.4";
        "apollo@2.33.6" = f "apollo" "2.33.6" y "9ea12f88bf3fd5ee5e55cc2e5d632a069d6df393" [
          (s."@apollographql/apollo-tools@^0.5.1")
          (s."@oclif/command@1.8.0")
          (s."@oclif/config@1.17.0")
          (s."@oclif/errors@1.3.5")
          (s."@oclif/plugin-autocomplete@0.3.0")
          (s."@oclif/plugin-help@3.2.2")
          (s."@oclif/plugin-not-found@1.2.4")
          (s."@oclif/plugin-plugins@1.10.1")
          (s."@oclif/plugin-warn-if-update-available@1.7.0")
          (s."apollo-codegen-core@^0.40.4")
          (s."apollo-codegen-flow@^0.38.4")
          (s."apollo-codegen-scala@^0.39.4")
          (s."apollo-codegen-swift@^0.40.4")
          (s."apollo-codegen-typescript@^0.40.4")
          (s."apollo-env@^0.10.0")
          (s."apollo-graphql@^0.9.3")
          (s."apollo-language-server@^1.26.4")
          (s."chalk@2.4.2")
          (s."cli-ux@5.6.3")
          (s."env-ci@5.0.2")
          (s."gaze@1.1.3")
          (s."git-parse@1.0.4")
          (s."git-rev-sync@3.0.1")
          (s."git-url-parse@11.5.0")
          (s."glob@7.1.7")
          (s."global-agent@2.2.0")
          (s."graphql@14.0.2 - 14.2.0 || ^14.3.1 || ^15.0.0")
          (s."graphql-tag@2.12.4")
          (s."listr@0.14.3")
          (s."lodash.identity@3.0.0")
          (s."lodash.pickby@4.6.0")
          (s."mkdirp@1.0.4")
          (s."moment@2.29.1")
          (s."strip-ansi@5.2.0")
          (s."table@6.7.1")
          (s."tty@1.0.1")
          (s."vscode-uri@1.0.6")
          ];
        "apollo@^2.33.6" = s."apollo@2.33.6";
        "aproba@1.2.0" = f "aproba" "1.2.0" y "6802e6264efd18c790a1b0d517f0f2627bf2c94a" [];
        "aproba@^1.1.1" = s."aproba@1.2.0";
        "arg@4.1.3" = f "arg" "4.1.3" y "269fc7ad5b8e42cb63c896d5666017261c144089" [];
        "arg@^4.1.0" = s."arg@4.1.3";
        "argparse@1.0.10" = f "argparse" "1.0.10" y "bcd6791ea5ae09725e17e5ad988134cd40b3d911" [
          (s."sprintf-js@~1.0.2")
          ];
        "argparse@^1.0.7" = s."argparse@1.0.10";
        "aria-query@4.2.2" = f "aria-query" "4.2.2" y "0d2ca6c9aceb56b8977e9fed6aed7e15bbd2f83b" [
          (s."@babel/runtime@^7.10.2")
          (s."@babel/runtime-corejs3@^7.10.2")
          ];
        "aria-query@^4.0.2" = s."aria-query@4.2.2";
        "aria-query@^4.2.2" = s."aria-query@4.2.2";
        "arity-n@1.0.4" = f "arity-n" "1.0.4" y "d9e76b11733e08569c0847ae7b39b2860b30b745" [];
        "arity-n@^1.0.4" = s."arity-n@1.0.4";
        "arr-diff@4.0.0" = f "arr-diff" "4.0.0" y "d6461074febfec71e7e15235761a329a5dc7c520" [];
        "arr-diff@^4.0.0" = s."arr-diff@4.0.0";
        "arr-flatten@1.1.0" = f "arr-flatten" "1.1.0" y "36048bbff4e7b47e136644316c99669ea5ae91f1" [];
        "arr-flatten@^1.1.0" = s."arr-flatten@1.1.0";
        "arr-union@3.1.0" = f "arr-union" "3.1.0" y "e39b09aea9def866a8f206e288af63919bae39c4" [];
        "arr-union@^3.1.0" = s."arr-union@3.1.0";
        "array-differ@3.0.0" = f "array-differ" "3.0.0" y "3cbb3d0f316810eafcc47624734237d6aee4ae6b" [];
        "array-differ@^3.0.0" = s."array-differ@3.0.0";
        "array-flatten@1.1.1" = f "array-flatten" "1.1.1" y "9a5f699051b1e7073328f2a008968b64ea2955d2" [];
        "array-flatten@2.1.2" = f "array-flatten" "2.1.2" y "24ef80a28c1a893617e2149b0c6d0d788293b099" [];
        "array-flatten@^2.1.0" = s."array-flatten@2.1.2";
        "array-includes@3.1.3" = f "array-includes" "3.1.3" y "c7f619b382ad2afaf5326cddfdc0afc61af7690a" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.0-next.2")
          (s."get-intrinsic@^1.1.1")
          (s."is-string@^1.0.5")
          ];
        "array-includes@^3.1.1" = s."array-includes@3.1.3";
        "array-includes@^3.1.2" = s."array-includes@3.1.3";
        "array-includes@^3.1.3" = s."array-includes@3.1.3";
        "array-tree-filter@2.1.0" = f "array-tree-filter" "2.1.0" y "873ac00fec83749f255ac8dd083814b4f6329190" [];
        "array-tree-filter@^2.1.0" = s."array-tree-filter@2.1.0";
        "array-union@1.0.2" = f "array-union" "1.0.2" y "9a34410e4f4e3da23dea375be5be70f24778ec39" [
          (s."array-uniq@^1.0.1")
          ];
        "array-union@2.1.0" = f "array-union" "2.1.0" y "b798420adbeb1de828d84acd8a2e23d3efe85e8d" [];
        "array-union@^1.0.1" = s."array-union@1.0.2";
        "array-union@^2.1.0" = s."array-union@2.1.0";
        "array-uniq@1.0.3" = f "array-uniq" "1.0.3" y "af6ac877a25cc7f74e058894753858dfdb24fdb6" [];
        "array-uniq@^1.0.1" = s."array-uniq@1.0.3";
        "array-unique@0.3.2" = f "array-unique" "0.3.2" y "a894b75d4bc4f6cd679ef3244a9fd8f46ae2d428" [];
        "array-unique@^0.3.2" = s."array-unique@0.3.2";
        "array.prototype.flat@1.2.4" = f "array.prototype.flat" "1.2.4" y "6ef638b43312bd401b4c6199fdec7e2dc9e9a123" [
          (s."call-bind@^1.0.0")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.0-next.1")
          ];
        "array.prototype.flat@^1.2.4" = s."array.prototype.flat@1.2.4";
        "array.prototype.flatmap@1.2.4" = f "array.prototype.flatmap" "1.2.4" y "94cfd47cc1556ec0747d97f7c7738c58122004c9" [
          (s."call-bind@^1.0.0")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.0-next.1")
          (s."function-bind@^1.1.1")
          ];
        "array.prototype.flatmap@^1.2.4" = s."array.prototype.flatmap@1.2.4";
        "arrify@2.0.1" = f "arrify" "2.0.1" y "c9655e9331e0abcd588d2a7cad7e9956f66701fa" [];
        "arrify@^2.0.1" = s."arrify@2.0.1";
        "asap@2.0.6" = f "asap" "2.0.6" y "e50347611d7e690943208bbdafebcbc2fb866d46" [];
        "asap@~2.0.6" = s."asap@2.0.6";
        "asn1.js@5.4.1" = f "asn1.js" "5.4.1" y "11a980b84ebb91781ce35b0fdc2ee294e3783f07" [
          (s."bn.js@^4.0.0")
          (s."inherits@^2.0.1")
          (s."minimalistic-assert@^1.0.0")
          (s."safer-buffer@^2.1.0")
          ];
        "asn1.js@^5.2.0" = s."asn1.js@5.4.1";
        "assert@1.5.0" = f "assert" "1.5.0" y "55c109aaf6e0aefdb3dc4b71240c70bf574b18eb" [
          (s."object-assign@^4.1.1")
          (s."util@0.10.3")
          ];
        "assert@^1.1.1" = s."assert@1.5.0";
        "assign-symbols@1.0.0" = f "assign-symbols" "1.0.0" y "59667f41fadd4f20ccbc2bb96b8d4f7f78ec0367" [];
        "assign-symbols@^1.0.0" = s."assign-symbols@1.0.0";
        "ast-types-flow@0.0.7" = f "ast-types-flow" "0.0.7" y "f70b735c6bca1a5c9c22d982c3e39e7feba3bdad" [];
        "ast-types-flow@^0.0.7" = s."ast-types-flow@0.0.7";
        "ast-types@0.14.2" = f "ast-types" "0.14.2" y "600b882df8583e3cd4f2df5fa20fa83759d4bdfd" [
          (s."tslib@^2.0.1")
          ];
        "ast-types@^0.14.0" = s."ast-types@0.14.2";
        "astral-regex@2.0.0" = f "astral-regex" "2.0.0" y "483143c567aeed4785759c0865786dc77d7d2e31" [];
        "astral-regex@^2.0.0" = s."astral-regex@2.0.0";
        "async-each@1.0.3" = f "async-each" "1.0.3" y "b727dbf87d7651602f06f4d4ac387f47d91b0cbf" [];
        "async-each@^1.0.1" = s."async-each@1.0.3";
        "async-limiter@1.0.1" = f "async-limiter" "1.0.1" y "dd379e94f0db8310b08291f9d64c3209766617fd" [];
        "async-limiter@~1.0.0" = s."async-limiter@1.0.1";
        "async-validator@3.5.2" = f "async-validator" "3.5.2" y "68e866a96824e8b2694ff7a831c1a25c44d5e500" [];
        "async-validator@^3.0.3" = s."async-validator@3.5.2";
        "async@2.6.3" = f "async" "2.6.3" y "d72625e2344a3656e3a3ad4fa749fa83299d82ff" [
          (s."lodash@^4.17.14")
          ];
        "async@^2.6.2" = s."async@2.6.3";
        "asynckit@0.4.0" = f "asynckit" "0.4.0" y "c79ed97f7f34cb8f2ba1bc9790bcc366474b4b79" [];
        "asynckit@^0.4.0" = s."asynckit@0.4.0";
        "at-least-node@1.0.0" = f "at-least-node" "1.0.0" y "602cd4b46e844ad4effc92a8011a3c46e0238dc2" [];
        "at-least-node@^1.0.0" = s."at-least-node@1.0.0";
        "atob@2.1.2" = f "atob" "2.1.2" y "6d9517eb9e030d2436666651e86bd9f6f13533c9" [];
        "atob@^2.1.2" = s."atob@2.1.2";
        "autoprefixer@9.8.6" = f "autoprefixer" "9.8.6" y "3b73594ca1bf9266320c5acf1588d74dea74210f" [
          (s."browserslist@^4.12.0")
          (s."caniuse-lite@^1.0.30001109")
          (s."colorette@^1.2.1")
          (s."normalize-range@^0.1.2")
          (s."num2fraction@^1.2.2")
          (s."postcss@^7.0.32")
          (s."postcss-value-parser@^4.1.0")
          ];
        "autoprefixer@^9.6.1" = s."autoprefixer@9.8.6";
        "await-to-js@2.1.1" = f "await-to-js" "2.1.1" y "c2093cd5a386f2bb945d79b292817bbc3f41b31b" [];
        "await-to-js@^2.0.1" = s."await-to-js@2.1.1";
        "axe-core@4.3.2" = f "axe-core" "4.3.2" y "fcf8777b82c62cfc69c7e9f32c0d2226287680e7" [];
        "axe-core@^4.0.2" = s."axe-core@4.3.2";
        "axobject-query@2.2.0" = f "axobject-query" "2.2.0" y "943d47e10c0b704aa42275e20edf3722648989be" [];
        "axobject-query@^2.2.0" = s."axobject-query@2.2.0";
        "babel-eslint@10.1.0" = f "babel-eslint" "10.1.0" y "6968e568a910b78fb3779cdd8b6ac2f479943232" [
          (s."@babel/code-frame@^7.0.0")
          (s."@babel/parser@^7.7.0")
          (s."@babel/traverse@^7.7.0")
          (s."@babel/types@^7.7.0")
          (s."eslint-visitor-keys@^1.0.0")
          (s."resolve@^1.12.0")
          ];
        "babel-eslint@^10.1.0" = s."babel-eslint@10.1.0";
        "babel-extract-comments@1.0.0" = f "babel-extract-comments" "1.0.0" y "0a2aedf81417ed391b85e18b4614e693a0351a21" [
          (s."babylon@^6.18.0")
          ];
        "babel-extract-comments@^1.0.0" = s."babel-extract-comments@1.0.0";
        "babel-jest@26.6.3" = f "babel-jest" "26.6.3" y "d87d25cb0037577a0c89f82e5755c5d293c01056" [
          (s."@jest/transform@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/babel__core@^7.1.7")
          (s."babel-plugin-istanbul@^6.0.0")
          (s."babel-preset-jest@^26.6.2")
          (s."chalk@^4.0.0")
          (s."graceful-fs@^4.2.4")
          (s."slash@^3.0.0")
          ];
        "babel-jest@^26.6.0" = s."babel-jest@26.6.3";
        "babel-jest@^26.6.3" = s."babel-jest@26.6.3";
        "babel-loader@8.1.0" = f "babel-loader" "8.1.0" y "c611d5112bd5209abe8b9fa84c3e4da25275f1c3" [
          (s."find-cache-dir@^2.1.0")
          (s."loader-utils@^1.4.0")
          (s."mkdirp@^0.5.3")
          (s."pify@^4.0.1")
          (s."schema-utils@^2.6.5")
          ];
        "babel-plugin-dynamic-import-node@2.3.3" = f "babel-plugin-dynamic-import-node" "2.3.3" y "84fda19c976ec5c6defef57f9427b3def66e17a3" [
          (s."object.assign@^4.1.0")
          ];
        "babel-plugin-dynamic-import-node@^2.3.3" = s."babel-plugin-dynamic-import-node@2.3.3";
        "babel-plugin-istanbul@6.0.0" = f "babel-plugin-istanbul" "6.0.0" y "e159ccdc9af95e0b570c75b4573b7c34d671d765" [
          (s."@babel/helper-plugin-utils@^7.0.0")
          (s."@istanbuljs/load-nyc-config@^1.0.0")
          (s."@istanbuljs/schema@^0.1.2")
          (s."istanbul-lib-instrument@^4.0.0")
          (s."test-exclude@^6.0.0")
          ];
        "babel-plugin-istanbul@^6.0.0" = s."babel-plugin-istanbul@6.0.0";
        "babel-plugin-jest-hoist@26.6.2" = f "babel-plugin-jest-hoist" "26.6.2" y "8185bd030348d254c6d7dd974355e6a28b21e62d" [
          (s."@babel/template@^7.3.3")
          (s."@babel/types@^7.3.3")
          (s."@types/babel__core@^7.0.0")
          (s."@types/babel__traverse@^7.0.6")
          ];
        "babel-plugin-jest-hoist@^26.6.2" = s."babel-plugin-jest-hoist@26.6.2";
        "babel-plugin-macros@2.8.0" = f "babel-plugin-macros" "2.8.0" y "0f958a7cc6556b1e65344465d99111a1e5e10138" [
          (s."@babel/runtime@^7.7.2")
          (s."cosmiconfig@^6.0.0")
          (s."resolve@^1.12.0")
          ];
        "babel-plugin-named-asset-import@0.3.7" = f "babel-plugin-named-asset-import" "0.3.7" y "156cd55d3f1228a5765774340937afc8398067dd" [];
        "babel-plugin-named-asset-import@^0.3.7" = s."babel-plugin-named-asset-import@0.3.7";
        "babel-plugin-polyfill-corejs2@0.2.2" = f "babel-plugin-polyfill-corejs2" "0.2.2" y "e9124785e6fd94f94b618a7954e5693053bf5327" [
          (s."@babel/compat-data@^7.13.11")
          (s."@babel/helper-define-polyfill-provider@^0.2.2")
          (s."semver@^6.1.1")
          ];
        "babel-plugin-polyfill-corejs2@^0.2.2" = s."babel-plugin-polyfill-corejs2@0.2.2";
        "babel-plugin-polyfill-corejs3@0.2.4" = f "babel-plugin-polyfill-corejs3" "0.2.4" y "68cb81316b0e8d9d721a92e0009ec6ecd4cd2ca9" [
          (s."@babel/helper-define-polyfill-provider@^0.2.2")
          (s."core-js-compat@^3.14.0")
          ];
        "babel-plugin-polyfill-corejs3@^0.2.2" = s."babel-plugin-polyfill-corejs3@0.2.4";
        "babel-plugin-polyfill-regenerator@0.2.2" = f "babel-plugin-polyfill-regenerator" "0.2.2" y "b310c8d642acada348c1fa3b3e6ce0e851bee077" [
          (s."@babel/helper-define-polyfill-provider@^0.2.2")
          ];
        "babel-plugin-polyfill-regenerator@^0.2.2" = s."babel-plugin-polyfill-regenerator@0.2.2";
        "babel-plugin-syntax-object-rest-spread@6.13.0" = f "babel-plugin-syntax-object-rest-spread" "6.13.0" y "fd6536f2bce13836ffa3a5458c4903a597bb3bf5" [];
        "babel-plugin-syntax-object-rest-spread@^6.8.0" = s."babel-plugin-syntax-object-rest-spread@6.13.0";
        "babel-plugin-transform-object-rest-spread@6.26.0" = f "babel-plugin-transform-object-rest-spread" "6.26.0" y "0f36692d50fef6b7e2d4b3ac1478137a963b7b06" [
          (s."babel-plugin-syntax-object-rest-spread@^6.8.0")
          (s."babel-runtime@^6.26.0")
          ];
        "babel-plugin-transform-object-rest-spread@^6.26.0" = s."babel-plugin-transform-object-rest-spread@6.26.0";
        "babel-plugin-transform-react-remove-prop-types@0.4.24" = f "babel-plugin-transform-react-remove-prop-types" "0.4.24" y "f2edaf9b4c6a5fbe5c1d678bfb531078c1555f3a" [];
        "babel-preset-current-node-syntax@1.0.1" = f "babel-preset-current-node-syntax" "1.0.1" y "b4399239b89b2a011f9ddbe3e4f401fc40cff73b" [
          (s."@babel/plugin-syntax-async-generators@^7.8.4")
          (s."@babel/plugin-syntax-bigint@^7.8.3")
          (s."@babel/plugin-syntax-class-properties@^7.8.3")
          (s."@babel/plugin-syntax-import-meta@^7.8.3")
          (s."@babel/plugin-syntax-json-strings@^7.8.3")
          (s."@babel/plugin-syntax-logical-assignment-operators@^7.8.3")
          (s."@babel/plugin-syntax-nullish-coalescing-operator@^7.8.3")
          (s."@babel/plugin-syntax-numeric-separator@^7.8.3")
          (s."@babel/plugin-syntax-object-rest-spread@^7.8.3")
          (s."@babel/plugin-syntax-optional-catch-binding@^7.8.3")
          (s."@babel/plugin-syntax-optional-chaining@^7.8.3")
          (s."@babel/plugin-syntax-top-level-await@^7.8.3")
          ];
        "babel-preset-current-node-syntax@^1.0.0" = s."babel-preset-current-node-syntax@1.0.1";
        "babel-preset-jest@26.6.2" = f "babel-preset-jest" "26.6.2" y "747872b1171df032252426586881d62d31798fee" [
          (s."babel-plugin-jest-hoist@^26.6.2")
          (s."babel-preset-current-node-syntax@^1.0.0")
          ];
        "babel-preset-jest@^26.6.2" = s."babel-preset-jest@26.6.2";
        "babel-preset-react-app@10.0.0" = f "babel-preset-react-app" "10.0.0" y "689b60edc705f8a70ce87f47ab0e560a317d7045" [
          (s."@babel/core@7.12.3")
          (s."@babel/plugin-proposal-class-properties@7.12.1")
          (s."@babel/plugin-proposal-decorators@7.12.1")
          (s."@babel/plugin-proposal-nullish-coalescing-operator@7.12.1")
          (s."@babel/plugin-proposal-numeric-separator@7.12.1")
          (s."@babel/plugin-proposal-optional-chaining@7.12.1")
          (s."@babel/plugin-transform-flow-strip-types@7.12.1")
          (s."@babel/plugin-transform-react-display-name@7.12.1")
          (s."@babel/plugin-transform-runtime@7.12.1")
          (s."@babel/preset-env@7.12.1")
          (s."@babel/preset-react@7.12.1")
          (s."@babel/preset-typescript@7.12.1")
          (s."@babel/runtime@7.12.1")
          (s."babel-plugin-macros@2.8.0")
          (s."babel-plugin-transform-react-remove-prop-types@0.4.24")
          ];
        "babel-preset-react-app@^10.0.0" = s."babel-preset-react-app@10.0.0";
        "babel-runtime@6.26.0" = f "babel-runtime" "6.26.0" y "965c7058668e82b55d7bfe04ff2337bc8b5647fe" [
          (s."core-js@^2.4.0")
          (s."regenerator-runtime@^0.11.0")
          ];
        "babel-runtime@^6.26.0" = s."babel-runtime@6.26.0";
        "babylon@6.18.0" = f "babylon" "6.18.0" y "af2f3b88fa6f5c1e4c634d1a0f8eac4f55b395e3" [];
        "babylon@^6.18.0" = s."babylon@6.18.0";
        "balanced-match@1.0.2" = f "balanced-match" "1.0.2" y "e83e3a7e3f300b34cb9d87f615fa0cbf357690ee" [];
        "balanced-match@^1.0.0" = s."balanced-match@1.0.2";
        "base64-js@1.5.1" = f "base64-js" "1.5.1" y "1b1b440160a5bf7ad40b650f095963481903930a" [];
        "base64-js@^1.0.2" = s."base64-js@1.5.1";
        "base@0.11.2" = f "base" "0.11.2" y "7bde5ced145b6d551a90db87f83c558b4eb48a8f" [
          (s."cache-base@^1.0.1")
          (s."class-utils@^0.3.5")
          (s."component-emitter@^1.2.1")
          (s."define-property@^1.0.0")
          (s."isobject@^3.0.1")
          (s."mixin-deep@^1.2.0")
          (s."pascalcase@^0.1.1")
          ];
        "base@^0.11.1" = s."base@0.11.2";
        "batch@0.6.1" = f "batch" "0.6.1" y "dc34314f4e679318093fc760272525f94bf25c16" [];
        "bfj@7.0.2" = f "bfj" "7.0.2" y "1988ce76f3add9ac2913fd8ba47aad9e651bfbb2" [
          (s."bluebird@^3.5.5")
          (s."check-types@^11.1.1")
          (s."hoopy@^0.1.4")
          (s."tryer@^1.0.1")
          ];
        "bfj@^7.0.2" = s."bfj@7.0.2";
        "big.js@5.2.2" = f "big.js" "5.2.2" y "65f0af382f578bcdc742bd9c281e9cb2d7768328" [];
        "big.js@^5.2.2" = s."big.js@5.2.2";
        "binary-extensions@1.13.1" = f "binary-extensions" "1.13.1" y "598afe54755b2868a5330d2aff9d4ebb53209b65" [];
        "binary-extensions@2.2.0" = f "binary-extensions" "2.2.0" y "75f502eeaf9ffde42fc98829645be4ea76bd9e2d" [];
        "binary-extensions@^1.0.0" = s."binary-extensions@1.13.1";
        "binary-extensions@^2.0.0" = s."binary-extensions@2.2.0";
        "bindings@1.5.0" = f "bindings" "1.5.0" y "10353c9e945334bc0511a6d90b38fbc7c9c504df" [
          (s."file-uri-to-path@1.0.0")
          ];
        "bindings@^1.5.0" = s."bindings@1.5.0";
        "bluebird@3.7.2" = f "bluebird" "3.7.2" y "9f229c15be272454ffa973ace0dbee79a1b0c36f" [];
        "bluebird@^3.5.5" = s."bluebird@3.7.2";
        "bn.js@4.12.0" = f "bn.js" "4.12.0" y "775b3f278efbb9718eec7361f483fb36fbbfea88" [];
        "bn.js@5.2.0" = f "bn.js" "5.2.0" y "358860674396c6997771a9d051fcc1b57d4ae002" [];
        "bn.js@^4.0.0" = s."bn.js@4.12.0";
        "bn.js@^4.1.0" = s."bn.js@4.12.0";
        "bn.js@^4.11.9" = s."bn.js@4.12.0";
        "bn.js@^5.0.0" = s."bn.js@5.2.0";
        "bn.js@^5.1.1" = s."bn.js@5.2.0";
        "body-parser@1.19.0" = f "body-parser" "1.19.0" y "96b2709e57c9c4e09a6fd66a8fd979844f69f08a" [
          (s."bytes@3.1.0")
          (s."content-type@~1.0.4")
          (s."debug@2.6.9")
          (s."depd@~1.1.2")
          (s."http-errors@1.7.2")
          (s."iconv-lite@0.4.24")
          (s."on-finished@~2.3.0")
          (s."qs@6.7.0")
          (s."raw-body@2.4.0")
          (s."type-is@~1.6.17")
          ];
        "bonjour@3.5.0" = f "bonjour" "3.5.0" y "8e890a183d8ee9a2393b3844c691a42bcf7bc9f5" [
          (s."array-flatten@^2.1.0")
          (s."deep-equal@^1.0.1")
          (s."dns-equal@^1.0.0")
          (s."dns-txt@^2.0.2")
          (s."multicast-dns@^6.0.1")
          (s."multicast-dns-service-types@^1.1.0")
          ];
        "bonjour@^3.5.0" = s."bonjour@3.5.0";
        "boolbase@1.0.0" = f "boolbase" "1.0.0" y "68dff5fbe60c51eb37725ea9e3ed310dcc1e776e" [];
        "boolbase@^1.0.0" = s."boolbase@1.0.0";
        "boolbase@~1.0.0" = s."boolbase@1.0.0";
        "boolean@3.1.2" = f "boolean" "3.1.2" y "e30f210a26b02458482a8cc353ab06f262a780c2" [];
        "boolean@^3.0.1" = s."boolean@3.1.2";
        "brace-expansion@1.1.11" = f "brace-expansion" "1.1.11" y "3c7fcbf529d87226f3d2f52b966ff5271eb441dd" [
          (s."balanced-match@^1.0.0")
          (s."concat-map@0.0.1")
          ];
        "brace-expansion@^1.1.7" = s."brace-expansion@1.1.11";
        "braces@2.3.2" = f "braces" "2.3.2" y "5979fd3f14cd531565e5fa2df1abfff1dfaee729" [
          (s."arr-flatten@^1.1.0")
          (s."array-unique@^0.3.2")
          (s."extend-shallow@^2.0.1")
          (s."fill-range@^4.0.0")
          (s."isobject@^3.0.1")
          (s."repeat-element@^1.1.2")
          (s."snapdragon@^0.8.1")
          (s."snapdragon-node@^2.0.1")
          (s."split-string@^3.0.2")
          (s."to-regex@^3.0.1")
          ];
        "braces@3.0.2" = f "braces" "3.0.2" y "3454e1a462ee8d599e236df336cd9ea4f8afe107" [
          (s."fill-range@^7.0.1")
          ];
        "braces@^2.3.1" = s."braces@2.3.2";
        "braces@^2.3.2" = s."braces@2.3.2";
        "braces@^3.0.1" = s."braces@3.0.2";
        "braces@~3.0.2" = s."braces@3.0.2";
        "brorand@1.1.0" = f "brorand" "1.1.0" y "12c25efe40a45e3c323eb8675a0a0ce57b22371f" [];
        "brorand@^1.0.1" = s."brorand@1.1.0";
        "brorand@^1.1.0" = s."brorand@1.1.0";
        "browser-process-hrtime@1.0.0" = f "browser-process-hrtime" "1.0.0" y "3c9b4b7d782c8121e56f10106d84c0d0ffc94626" [];
        "browser-process-hrtime@^1.0.0" = s."browser-process-hrtime@1.0.0";
        "browserify-aes@1.2.0" = f "browserify-aes" "1.2.0" y "326734642f403dabc3003209853bb70ad428ef48" [
          (s."buffer-xor@^1.0.3")
          (s."cipher-base@^1.0.0")
          (s."create-hash@^1.1.0")
          (s."evp_bytestokey@^1.0.3")
          (s."inherits@^2.0.1")
          (s."safe-buffer@^5.0.1")
          ];
        "browserify-aes@^1.0.0" = s."browserify-aes@1.2.0";
        "browserify-aes@^1.0.4" = s."browserify-aes@1.2.0";
        "browserify-cipher@1.0.1" = f "browserify-cipher" "1.0.1" y "8d6474c1b870bfdabcd3bcfcc1934a10e94f15f0" [
          (s."browserify-aes@^1.0.4")
          (s."browserify-des@^1.0.0")
          (s."evp_bytestokey@^1.0.0")
          ];
        "browserify-cipher@^1.0.0" = s."browserify-cipher@1.0.1";
        "browserify-des@1.0.2" = f "browserify-des" "1.0.2" y "3af4f1f59839403572f1c66204375f7a7f703e9c" [
          (s."cipher-base@^1.0.1")
          (s."des.js@^1.0.0")
          (s."inherits@^2.0.1")
          (s."safe-buffer@^5.1.2")
          ];
        "browserify-des@^1.0.0" = s."browserify-des@1.0.2";
        "browserify-rsa@4.1.0" = f "browserify-rsa" "4.1.0" y "b2fd06b5b75ae297f7ce2dc651f918f5be158c8d" [
          (s."bn.js@^5.0.0")
          (s."randombytes@^2.0.1")
          ];
        "browserify-rsa@^4.0.0" = s."browserify-rsa@4.1.0";
        "browserify-rsa@^4.0.1" = s."browserify-rsa@4.1.0";
        "browserify-sign@4.2.1" = f "browserify-sign" "4.2.1" y "eaf4add46dd54be3bb3b36c0cf15abbeba7956c3" [
          (s."bn.js@^5.1.1")
          (s."browserify-rsa@^4.0.1")
          (s."create-hash@^1.2.0")
          (s."create-hmac@^1.1.7")
          (s."elliptic@^6.5.3")
          (s."inherits@^2.0.4")
          (s."parse-asn1@^5.1.5")
          (s."readable-stream@^3.6.0")
          (s."safe-buffer@^5.2.0")
          ];
        "browserify-sign@^4.0.0" = s."browserify-sign@4.2.1";
        "browserify-zlib@0.2.0" = f "browserify-zlib" "0.2.0" y "2869459d9aa3be245fe8fe2ca1f46e2e7f54d73f" [
          (s."pako@~1.0.5")
          ];
        "browserify-zlib@^0.2.0" = s."browserify-zlib@0.2.0";
        "browserslist@4.14.2" = f "browserslist" "4.14.2" y "1b3cec458a1ba87588cc5e9be62f19b6d48813ce" [
          (s."caniuse-lite@^1.0.30001125")
          (s."electron-to-chromium@^1.3.564")
          (s."escalade@^3.0.2")
          (s."node-releases@^1.1.61")
          ];
        "browserslist@4.16.7" = f "browserslist" "4.16.7" y "108b0d1ef33c4af1b587c54f390e7041178e4335" [
          (s."caniuse-lite@^1.0.30001248")
          (s."colorette@^1.2.2")
          (s."electron-to-chromium@^1.3.793")
          (s."escalade@^3.1.1")
          (s."node-releases@^1.1.73")
          ];
        "browserslist@^4.0.0" = s."browserslist@4.16.7";
        "browserslist@^4.12.0" = s."browserslist@4.16.7";
        "browserslist@^4.16.6" = s."browserslist@4.16.7";
        "browserslist@^4.6.2" = s."browserslist@4.16.7";
        "browserslist@^4.6.4" = s."browserslist@4.16.7";
        "bser@2.1.1" = f "bser" "2.1.1" y "e6787da20ece9d07998533cfd9de6f5c38f4bc05" [
          (s."node-int64@^0.4.0")
          ];
        "buffer-from@1.1.2" = f "buffer-from" "1.1.2" y "2b146a6fd72e80b4f55d255f35ed59a3a9a41bd5" [];
        "buffer-from@^1.0.0" = s."buffer-from@1.1.2";
        "buffer-indexof@1.1.1" = f "buffer-indexof" "1.1.1" y "52fabcc6a606d1a00302802648ef68f639da268c" [];
        "buffer-indexof@^1.0.0" = s."buffer-indexof@1.1.1";
        "buffer-xor@1.0.3" = f "buffer-xor" "1.0.3" y "26e61ed1422fb70dd42e6e36729ed51d855fe8d9" [];
        "buffer-xor@^1.0.3" = s."buffer-xor@1.0.3";
        "buffer@4.9.2" = f "buffer" "4.9.2" y "230ead344002988644841ab0244af8c44bbe3ef8" [
          (s."base64-js@^1.0.2")
          (s."ieee754@^1.1.4")
          (s."isarray@^1.0.0")
          ];
        "buffer@^4.3.0" = s."buffer@4.9.2";
        "builtin-modules@3.2.0" = f "builtin-modules" "3.2.0" y "45d5db99e7ee5e6bc4f362e008bf917ab5049887" [];
        "builtin-modules@^3.1.0" = s."builtin-modules@3.2.0";
        "builtin-status-codes@3.0.0" = f "builtin-status-codes" "3.0.0" y "85982878e21b98e1c66425e03d0174788f569ee8" [];
        "builtin-status-codes@^3.0.0" = s."builtin-status-codes@3.0.0";
        "byline@5.0.0" = f "byline" "5.0.0" y "741c5216468eadc457b03410118ad77de8c1ddb1" [];
        "bytes@3.0.0" = f "bytes" "3.0.0" y "d32815404d689699f85a4ea4fa8755dd13a96048" [];
        "bytes@3.1.0" = f "bytes" "3.1.0" y "f6cf7933a360e0588fa9fde85651cdc7f805d1f6" [];
        "cacache@12.0.4" = f "cacache" "12.0.4" y "668bcbd105aeb5f1d92fe25570ec9525c8faa40c" [
          (s."bluebird@^3.5.5")
          (s."chownr@^1.1.1")
          (s."figgy-pudding@^3.5.1")
          (s."glob@^7.1.4")
          (s."graceful-fs@^4.1.15")
          (s."infer-owner@^1.0.3")
          (s."lru-cache@^5.1.1")
          (s."mississippi@^3.0.0")
          (s."mkdirp@^0.5.1")
          (s."move-concurrently@^1.0.1")
          (s."promise-inflight@^1.0.1")
          (s."rimraf@^2.6.3")
          (s."ssri@^6.0.1")
          (s."unique-filename@^1.1.1")
          (s."y18n@^4.0.0")
          ];
        "cacache@15.2.0" = f "cacache" "15.2.0" y "73af75f77c58e72d8c630a7a2858cb18ef523389" [
          (s."@npmcli/move-file@^1.0.1")
          (s."chownr@^2.0.0")
          (s."fs-minipass@^2.0.0")
          (s."glob@^7.1.4")
          (s."infer-owner@^1.0.4")
          (s."lru-cache@^6.0.0")
          (s."minipass@^3.1.1")
          (s."minipass-collect@^1.0.2")
          (s."minipass-flush@^1.0.5")
          (s."minipass-pipeline@^1.2.2")
          (s."mkdirp@^1.0.3")
          (s."p-map@^4.0.0")
          (s."promise-inflight@^1.0.1")
          (s."rimraf@^3.0.2")
          (s."ssri@^8.0.1")
          (s."tar@^6.0.2")
          (s."unique-filename@^1.1.1")
          ];
        "cacache@^12.0.2" = s."cacache@12.0.4";
        "cacache@^15.0.5" = s."cacache@15.2.0";
        "cache-base@1.0.1" = f "cache-base" "1.0.1" y "0a7f46416831c8b662ee36fe4e7c59d76f666ab2" [
          (s."collection-visit@^1.0.0")
          (s."component-emitter@^1.2.1")
          (s."get-value@^2.0.6")
          (s."has-value@^1.0.0")
          (s."isobject@^3.0.1")
          (s."set-value@^2.0.0")
          (s."to-object-path@^0.3.0")
          (s."union-value@^1.0.0")
          (s."unset-value@^1.0.0")
          ];
        "cache-base@^1.0.1" = s."cache-base@1.0.1";
        "call-bind@1.0.2" = f "call-bind" "1.0.2" y "b1d4e89e688119c3c9a903ad30abb2f6a919be3c" [
          (s."function-bind@^1.1.1")
          (s."get-intrinsic@^1.0.2")
          ];
        "call-bind@^1.0.0" = s."call-bind@1.0.2";
        "call-bind@^1.0.2" = s."call-bind@1.0.2";
        "caller-callsite@2.0.0" = f "caller-callsite" "2.0.0" y "847e0fce0a223750a9a027c54b33731ad3154134" [
          (s."callsites@^2.0.0")
          ];
        "caller-callsite@^2.0.0" = s."caller-callsite@2.0.0";
        "caller-path@2.0.0" = f "caller-path" "2.0.0" y "468f83044e369ab2010fac5f06ceee15bb2cb1f4" [
          (s."caller-callsite@^2.0.0")
          ];
        "caller-path@^2.0.0" = s."caller-path@2.0.0";
        "callsites@2.0.0" = f "callsites" "2.0.0" y "06eb84f00eea413da86affefacbffb36093b3c50" [];
        "callsites@3.1.0" = f "callsites" "3.1.0" y "b3630abd8943432f54b3f0519238e33cd7df2f73" [];
        "callsites@^2.0.0" = s."callsites@2.0.0";
        "callsites@^3.0.0" = s."callsites@3.1.0";
        "camel-case@4.1.2" = f "camel-case" "4.1.2" y "9728072a954f805228225a6deea6b38461e1bd5a" [
          (s."pascal-case@^3.1.2")
          (s."tslib@^2.0.3")
          ];
        "camel-case@^4.1.1" = s."camel-case@4.1.2";
        "camel-case@^4.1.2" = s."camel-case@4.1.2";
        "camelcase@5.3.1" = f "camelcase" "5.3.1" y "e3c9b31569e106811df242f715725a1f4c494320" [];
        "camelcase@6.2.0" = f "camelcase" "6.2.0" y "924af881c9d525ac9d87f40d964e5cea982a1809" [];
        "camelcase@^5.0.0" = s."camelcase@5.3.1";
        "camelcase@^5.3.1" = s."camelcase@5.3.1";
        "camelcase@^6.0.0" = s."camelcase@6.2.0";
        "camelcase@^6.1.0" = s."camelcase@6.2.0";
        "camelcase@^6.2.0" = s."camelcase@6.2.0";
        "caniuse-api@3.0.0" = f "caniuse-api" "3.0.0" y "5e4d90e2274961d46291997df599e3ed008ee4c0" [
          (s."browserslist@^4.0.0")
          (s."caniuse-lite@^1.0.0")
          (s."lodash.memoize@^4.1.2")
          (s."lodash.uniq@^4.5.0")
          ];
        "caniuse-api@^3.0.0" = s."caniuse-api@3.0.0";
        "caniuse-lite@1.0.30001249" = f "caniuse-lite" "1.0.30001249" y "90a330057f8ff75bfe97a94d047d5e14fabb2ee8" [];
        "caniuse-lite@^1.0.0" = s."caniuse-lite@1.0.30001249";
        "caniuse-lite@^1.0.30000981" = s."caniuse-lite@1.0.30001249";
        "caniuse-lite@^1.0.30001109" = s."caniuse-lite@1.0.30001249";
        "caniuse-lite@^1.0.30001125" = s."caniuse-lite@1.0.30001249";
        "caniuse-lite@^1.0.30001248" = s."caniuse-lite@1.0.30001249";
        "capital-case@1.0.4" = f "capital-case" "1.0.4" y "9d130292353c9249f6b00fa5852bee38a717e669" [
          (s."no-case@^3.0.4")
          (s."tslib@^2.0.3")
          (s."upper-case-first@^2.0.2")
          ];
        "capital-case@^1.0.4" = s."capital-case@1.0.4";
        "capture-exit@2.0.0" = f "capture-exit" "2.0.0" y "fb953bfaebeb781f62898239dabb426d08a509a4" [
          (s."rsvp@^4.8.4")
          ];
        "capture-exit@^2.0.0" = s."capture-exit@2.0.0";
        "cardinal@2.1.1" = f "cardinal" "2.1.1" y "7cc1055d822d212954d07b085dea251cc7bc5505" [
          (s."ansicolors@~0.3.2")
          (s."redeyed@~2.1.0")
          ];
        "cardinal@^2.1.1" = s."cardinal@2.1.1";
        "case-sensitive-paths-webpack-plugin@2.3.0" = f "case-sensitive-paths-webpack-plugin" "2.3.0" y "23ac613cc9a856e4f88ff8bb73bbb5e989825cf7" [];
        "chalk@1.1.3" = f "chalk" "1.1.3" y "a8115c55e4a702fe4d150abd3872822a7e09fc98" [
          (s."ansi-styles@^2.2.1")
          (s."escape-string-regexp@^1.0.2")
          (s."has-ansi@^2.0.0")
          (s."strip-ansi@^3.0.0")
          (s."supports-color@^2.0.0")
          ];
        "chalk@2.4.2" = f "chalk" "2.4.2" y "cd42541677a54333cf541a49108c1432b44c9424" [
          (s."ansi-styles@^3.2.1")
          (s."escape-string-regexp@^1.0.5")
          (s."supports-color@^5.3.0")
          ];
        "chalk@3.0.0" = f "chalk" "3.0.0" y "3f73c2bf526591f574cc492c51e2456349f844e4" [
          (s."ansi-styles@^4.1.0")
          (s."supports-color@^7.1.0")
          ];
        "chalk@4.1.2" = f "chalk" "4.1.2" y "aac4e2b7734a740867aeb16bf02aad556a1e7a01" [
          (s."ansi-styles@^4.1.0")
          (s."supports-color@^7.1.0")
          ];
        "chalk@^1.0.0" = s."chalk@1.1.3";
        "chalk@^1.1.3" = s."chalk@1.1.3";
        "chalk@^2.0.0" = s."chalk@2.4.2";
        "chalk@^2.0.1" = s."chalk@2.4.2";
        "chalk@^2.4.1" = s."chalk@2.4.2";
        "chalk@^2.4.2" = s."chalk@2.4.2";
        "chalk@^3.0.0" = s."chalk@3.0.0";
        "chalk@^4.0.0" = s."chalk@4.1.2";
        "chalk@^4.1.0" = s."chalk@4.1.2";
        "change-case@4.1.2" = f "change-case" "4.1.2" y "fedfc5f136045e2398c0410ee441f95704641e12" [
          (s."camel-case@^4.1.2")
          (s."capital-case@^1.0.4")
          (s."constant-case@^3.0.4")
          (s."dot-case@^3.0.4")
          (s."header-case@^2.0.4")
          (s."no-case@^3.0.4")
          (s."param-case@^3.0.4")
          (s."pascal-case@^3.1.2")
          (s."path-case@^3.0.4")
          (s."sentence-case@^3.0.4")
          (s."snake-case@^3.0.4")
          (s."tslib@^2.0.3")
          ];
        "change-case@^4.0.0" = s."change-case@4.1.2";
        "char-regex@1.0.2" = f "char-regex" "1.0.2" y "d744358226217f981ed58f479b1d6bcc29545dcf" [];
        "char-regex@^1.0.2" = s."char-regex@1.0.2";
        "check-types@11.1.2" = f "check-types" "11.1.2" y "86a7c12bf5539f6324eb0e70ca8896c0e38f3e2f" [];
        "check-types@^11.1.1" = s."check-types@11.1.2";
        "chokidar@2.1.8" = f "chokidar" "2.1.8" y "804b3a7b6a99358c3c5c61e71d8728f041cff917" [
          (s."anymatch@^2.0.0")
          (s."async-each@^1.0.1")
          (s."braces@^2.3.2")
          (s."glob-parent@^3.1.0")
          (s."inherits@^2.0.3")
          (s."is-binary-path@^1.0.0")
          (s."is-glob@^4.0.0")
          (s."normalize-path@^3.0.0")
          (s."path-is-absolute@^1.0.0")
          (s."readdirp@^2.2.1")
          (s."upath@^1.1.1")
          (s."fsevents@^1.2.7")
          ];
        "chokidar@3.5.2" = f "chokidar" "3.5.2" y "dba3976fcadb016f66fd365021d91600d01c1e75" [
          (s."anymatch@~3.1.2")
          (s."braces@~3.0.2")
          (s."glob-parent@~5.1.2")
          (s."is-binary-path@~2.1.0")
          (s."is-glob@~4.0.1")
          (s."normalize-path@~3.0.0")
          (s."readdirp@~3.6.0")
          (s."fsevents@~2.3.2")
          ];
        "chokidar@>=3.0.0 <4.0.0" = s."chokidar@3.5.2";
        "chokidar@^2.1.8" = s."chokidar@2.1.8";
        "chokidar@^3.4.1" = s."chokidar@3.5.2";
        "chownr@1.1.4" = f "chownr" "1.1.4" y "6fc9d7b42d32a583596337666e7d08084da2cc6b" [];
        "chownr@2.0.0" = f "chownr" "2.0.0" y "15bfbe53d2eab4cf70f18a8cd68ebe5b3cb1dece" [];
        "chownr@^1.1.1" = s."chownr@1.1.4";
        "chownr@^2.0.0" = s."chownr@2.0.0";
        "chrome-trace-event@1.0.3" = f "chrome-trace-event" "1.0.3" y "1015eced4741e15d06664a957dbbf50d041e26ac" [];
        "chrome-trace-event@^1.0.2" = s."chrome-trace-event@1.0.3";
        "ci-info@2.0.0" = f "ci-info" "2.0.0" y "67a9e964be31a51e15e5010d58e6f12834002f46" [];
        "ci-info@^2.0.0" = s."ci-info@2.0.0";
        "cipher-base@1.0.4" = f "cipher-base" "1.0.4" y "8760e4ecc272f4c363532f926d874aae2c1397de" [
          (s."inherits@^2.0.1")
          (s."safe-buffer@^5.0.1")
          ];
        "cipher-base@^1.0.0" = s."cipher-base@1.0.4";
        "cipher-base@^1.0.1" = s."cipher-base@1.0.4";
        "cipher-base@^1.0.3" = s."cipher-base@1.0.4";
        "cjs-module-lexer@0.6.0" = f "cjs-module-lexer" "0.6.0" y "4186fcca0eae175970aee870b9fe2d6cf8d5655f" [];
        "cjs-module-lexer@^0.6.0" = s."cjs-module-lexer@0.6.0";
        "class-utils@0.3.6" = f "class-utils" "0.3.6" y "f93369ae8b9a7ce02fd41faad0ca83033190c463" [
          (s."arr-union@^3.1.0")
          (s."define-property@^0.2.5")
          (s."isobject@^3.0.0")
          (s."static-extend@^0.1.1")
          ];
        "class-utils@^0.3.5" = s."class-utils@0.3.6";
        "classnames@2.3.1" = f "classnames" "2.3.1" y "dfcfa3891e306ec1dad105d0e88f4417b8535e8e" [];
        "classnames@2.x" = s."classnames@2.3.1";
        "classnames@^2.2.1" = s."classnames@2.3.1";
        "classnames@^2.2.3" = s."classnames@2.3.1";
        "classnames@^2.2.5" = s."classnames@2.3.1";
        "classnames@^2.2.6" = s."classnames@2.3.1";
        "clean-css@4.2.3" = f "clean-css" "4.2.3" y "507b5de7d97b48ee53d84adb0160ff6216380f78" [
          (s."source-map@~0.6.0")
          ];
        "clean-css@^4.2.3" = s."clean-css@4.2.3";
        "clean-stack@2.2.0" = f "clean-stack" "2.2.0" y "ee8472dbb129e727b31e8a10a427dee9dfe4008b" [];
        "clean-stack@3.0.1" = f "clean-stack" "3.0.1" y "155bf0b2221bf5f4fba89528d24c5953f17fe3a8" [
          (s."escape-string-regexp@4.0.0")
          ];
        "clean-stack@^2.0.0" = s."clean-stack@2.2.0";
        "clean-stack@^3.0.0" = s."clean-stack@3.0.1";
        "cli-cursor@2.1.0" = f "cli-cursor" "2.1.0" y "b35dac376479facc3e94747d41d0d0f5238ffcb5" [
          (s."restore-cursor@^2.0.0")
          ];
        "cli-cursor@^2.0.0" = s."cli-cursor@2.1.0";
        "cli-cursor@^2.1.0" = s."cli-cursor@2.1.0";
        "cli-progress@3.9.1" = f "cli-progress" "3.9.1" y "a22eba6a20f53289fdd05d5ee8cb2cc8c28f866e" [
          (s."colors@^1.1.2")
          (s."string-width@^4.2.0")
          ];
        "cli-progress@^3.4.0" = s."cli-progress@3.9.1";
        "cli-truncate@0.2.1" = f "cli-truncate" "0.2.1" y "9f15cfbb0705005369216c626ac7d05ab90dd574" [
          (s."slice-ansi@0.0.4")
          (s."string-width@^1.0.1")
          ];
        "cli-truncate@^0.2.1" = s."cli-truncate@0.2.1";
        "cli-ux@4.9.3" = f "cli-ux" "4.9.3" y "4c3e070c1ea23eef010bbdb041192e0661be84ce" [
          (s."@oclif/errors@^1.2.2")
          (s."@oclif/linewrap@^1.0.0")
          (s."@oclif/screen@^1.0.3")
          (s."ansi-escapes@^3.1.0")
          (s."ansi-styles@^3.2.1")
          (s."cardinal@^2.1.1")
          (s."chalk@^2.4.1")
          (s."clean-stack@^2.0.0")
          (s."extract-stack@^1.0.0")
          (s."fs-extra@^7.0.0")
          (s."hyperlinker@^1.0.0")
          (s."indent-string@^3.2.0")
          (s."is-wsl@^1.1.0")
          (s."lodash@^4.17.11")
          (s."password-prompt@^1.0.7")
          (s."semver@^5.6.0")
          (s."strip-ansi@^5.0.0")
          (s."supports-color@^5.5.0")
          (s."supports-hyperlinks@^1.0.1")
          (s."treeify@^1.1.0")
          (s."tslib@^1.9.3")
          ];
        "cli-ux@5.6.3" = f "cli-ux" "5.6.3" y "eecdb2e0261171f2b28f2be6b18c490291c3a287" [
          (s."@oclif/command@^1.6.0")
          (s."@oclif/errors@^1.2.1")
          (s."@oclif/linewrap@^1.0.0")
          (s."@oclif/screen@^1.0.3")
          (s."ansi-escapes@^4.3.0")
          (s."ansi-styles@^4.2.0")
          (s."cardinal@^2.1.1")
          (s."chalk@^4.1.0")
          (s."clean-stack@^3.0.0")
          (s."cli-progress@^3.4.0")
          (s."extract-stack@^2.0.0")
          (s."fs-extra@^8.1")
          (s."hyperlinker@^1.0.0")
          (s."indent-string@^4.0.0")
          (s."is-wsl@^2.2.0")
          (s."js-yaml@^3.13.1")
          (s."lodash@^4.17.11")
          (s."natural-orderby@^2.0.1")
          (s."object-treeify@^1.1.4")
          (s."password-prompt@^1.1.2")
          (s."semver@^7.3.2")
          (s."string-width@^4.2.0")
          (s."strip-ansi@^6.0.0")
          (s."supports-color@^8.1.0")
          (s."supports-hyperlinks@^2.1.0")
          (s."tslib@^2.0.0")
          ];
        "cli-ux@^4.9.0" = s."cli-ux@4.9.3";
        "cli-ux@^5.2.1" = s."cli-ux@5.6.3";
        "cliui@5.0.0" = f "cliui" "5.0.0" y "deefcfdb2e800784aa34f46fa08e06851c7bbbc5" [
          (s."string-width@^3.1.0")
          (s."strip-ansi@^5.2.0")
          (s."wrap-ansi@^5.1.0")
          ];
        "cliui@6.0.0" = f "cliui" "6.0.0" y "511d702c0c4e41ca156d7d0e96021f23e13225b1" [
          (s."string-width@^4.2.0")
          (s."strip-ansi@^6.0.0")
          (s."wrap-ansi@^6.2.0")
          ];
        "cliui@^5.0.0" = s."cliui@5.0.0";
        "cliui@^6.0.0" = s."cliui@6.0.0";
        "co@4.6.0" = f "co" "4.6.0" y "6ea6bdf3d853ae54ccb8e47bfa0bf3f9031fb184" [];
        "co@^4.6.0" = s."co@4.6.0";
        "coa@2.0.2" = f "coa" "2.0.2" y "43f6c21151b4ef2bf57187db0d73de229e3e7ec3" [
          (s."@types/q@^1.5.1")
          (s."chalk@^2.4.1")
          (s."q@^1.1.2")
          ];
        "coa@^2.0.2" = s."coa@2.0.2";
        "code-point-at@1.1.0" = f "code-point-at" "1.1.0" y "0d070b4d043a5bea33a2f1a40e2edb3d9a4ccf77" [];
        "code-point-at@^1.0.0" = s."code-point-at@1.1.0";
        "collect-v8-coverage@1.0.1" = f "collect-v8-coverage" "1.0.1" y "cc2c8e94fc18bbdffe64d6534570c8a673b27f59" [];
        "collect-v8-coverage@^1.0.0" = s."collect-v8-coverage@1.0.1";
        "collection-visit@1.0.0" = f "collection-visit" "1.0.0" y "4bc0373c164bc3291b4d368c829cf1a80a59dca0" [
          (s."map-visit@^1.0.0")
          (s."object-visit@^1.0.0")
          ];
        "collection-visit@^1.0.0" = s."collection-visit@1.0.0";
        "color-convert@1.9.3" = f "color-convert" "1.9.3" y "bb71850690e1f136567de629d2d5471deda4c1e8" [
          (s."color-name@1.1.3")
          ];
        "color-convert@2.0.1" = f "color-convert" "2.0.1" y "72d3a68d598c9bdb3af2ad1e84f21d896abd4de3" [
          (s."color-name@~1.1.4")
          ];
        "color-convert@^1.9.0" = s."color-convert@1.9.3";
        "color-convert@^1.9.3" = s."color-convert@1.9.3";
        "color-convert@^2.0.1" = s."color-convert@2.0.1";
        "color-name@1.1.3" = f "color-name" "1.1.3" y "a7d0558bd89c42f795dd42328f740831ca53bc25" [];
        "color-name@1.1.4" = f "color-name" "1.1.4" y "c2a09a87acbde69543de6f63fa3995c826c536a2" [];
        "color-name@^1.0.0" = s."color-name@1.1.4";
        "color-name@~1.1.4" = s."color-name@1.1.4";
        "color-string@1.6.0" = f "color-string" "1.6.0" y "c3915f61fe267672cb7e1e064c9d692219f6c312" [
          (s."color-name@^1.0.0")
          (s."simple-swizzle@^0.2.2")
          ];
        "color-string@^1.6.0" = s."color-string@1.6.0";
        "color@3.2.1" = f "color" "3.2.1" y "3544dc198caf4490c3ecc9a790b54fe9ff45e164" [
          (s."color-convert@^1.9.3")
          (s."color-string@^1.6.0")
          ];
        "color@^3.0.0" = s."color@3.2.1";
        "color@^3.1.3" = s."color@3.2.1";
        "colorette@1.2.2" = f "colorette" "1.2.2" y "cbcc79d5e99caea2dbf10eb3a26fd8b3e6acfa94" [];
        "colorette@^1.2.1" = s."colorette@1.2.2";
        "colorette@^1.2.2" = s."colorette@1.2.2";
        "colors@1.4.0" = f "colors" "1.4.0" y "c50491479d4c1bdaed2c9ced32cf7c7dc2360f78" [];
        "colors@^1.1.2" = s."colors@1.4.0";
        "combined-stream@1.0.8" = f "combined-stream" "1.0.8" y "c3d45a8b34fd730631a110a8a2520682b31d5a7f" [
          (s."delayed-stream@~1.0.0")
          ];
        "combined-stream@^1.0.8" = s."combined-stream@1.0.8";
        "commander@2.20.3" = f "commander" "2.20.3" y "fd485e84c03eb4881c20722ba48035e8531aeb33" [];
        "commander@4.1.1" = f "commander" "4.1.1" y "9fd602bd936294e9e9ef46a3f4d6964044b18068" [];
        "commander@^2.20.0" = s."commander@2.20.3";
        "commander@^4.1.1" = s."commander@4.1.1";
        "common-tags@1.8.0" = f "common-tags" "1.8.0" y "8e3153e542d4a39e9b10554434afaaf98956a937" [];
        "common-tags@^1.5.1" = s."common-tags@1.8.0";
        "common-tags@^1.8.0" = s."common-tags@1.8.0";
        "commondir@1.0.1" = f "commondir" "1.0.1" y "ddd800da0c66127393cca5950ea968a3aaf1253b" [];
        "commondir@^1.0.1" = s."commondir@1.0.1";
        "component-emitter@1.3.0" = f "component-emitter" "1.3.0" y "16e4070fba8ae29b679f2215853ee181ab2eabc0" [];
        "component-emitter@^1.2.1" = s."component-emitter@1.3.0";
        "compose-function@3.0.3" = f "compose-function" "3.0.3" y "9ed675f13cc54501d30950a486ff6a7ba3ab185f" [
          (s."arity-n@^1.0.4")
          ];
        "compressible@2.0.18" = f "compressible" "2.0.18" y "af53cca6b070d4c3c0750fbd77286a6d7cc46fba" [
          (s."mime-db@>= 1.43.0 < 2")
          ];
        "compressible@~2.0.16" = s."compressible@2.0.18";
        "compression@1.7.4" = f "compression" "1.7.4" y "95523eff170ca57c29a0ca41e6fe131f41e5bb8f" [
          (s."accepts@~1.3.5")
          (s."bytes@3.0.0")
          (s."compressible@~2.0.16")
          (s."debug@2.6.9")
          (s."on-headers@~1.0.2")
          (s."safe-buffer@5.1.2")
          (s."vary@~1.1.2")
          ];
        "compression@^1.7.4" = s."compression@1.7.4";
        "compute-scroll-into-view@1.0.17" = f "compute-scroll-into-view" "1.0.17" y "6a88f18acd9d42e9cf4baa6bec7e0522607ab7ab" [];
        "compute-scroll-into-view@^1.0.17" = s."compute-scroll-into-view@1.0.17";
        "concat-map@0.0.1" = f "concat-map" "0.0.1" y "d8a96bd77fd68df7793a73036a3ba0d5405d477b" [];
        "concat-stream@1.6.2" = f "concat-stream" "1.6.2" y "904bdf194cd3122fc675c77fc4ac3d4ff0fd1a34" [
          (s."buffer-from@^1.0.0")
          (s."inherits@^2.0.3")
          (s."readable-stream@^2.2.2")
          (s."typedarray@^0.0.6")
          ];
        "concat-stream@^1.5.0" = s."concat-stream@1.6.2";
        "confusing-browser-globals@1.0.10" = f "confusing-browser-globals" "1.0.10" y "30d1e7f3d1b882b25ec4933d1d1adac353d20a59" [];
        "confusing-browser-globals@^1.0.10" = s."confusing-browser-globals@1.0.10";
        "connect-history-api-fallback@1.6.0" = f "connect-history-api-fallback" "1.6.0" y "8b32089359308d111115d81cad3fceab888f97bc" [];
        "connect-history-api-fallback@^1.6.0" = s."connect-history-api-fallback@1.6.0";
        "console-browserify@1.2.0" = f "console-browserify" "1.2.0" y "67063cef57ceb6cf4993a2ab3a55840ae8c49336" [];
        "console-browserify@^1.1.0" = s."console-browserify@1.2.0";
        "constant-case@3.0.4" = f "constant-case" "3.0.4" y "3b84a9aeaf4cf31ec45e6bf5de91bdfb0589faf1" [
          (s."no-case@^3.0.4")
          (s."tslib@^2.0.3")
          (s."upper-case@^2.0.2")
          ];
        "constant-case@^3.0.4" = s."constant-case@3.0.4";
        "constants-browserify@1.0.0" = f "constants-browserify" "1.0.0" y "c20b96d8c617748aaf1c16021760cd27fcb8cb75" [];
        "constants-browserify@^1.0.0" = s."constants-browserify@1.0.0";
        "content-disposition@0.5.3" = f "content-disposition" "0.5.3" y "e130caf7e7279087c5616c2007d0485698984fbd" [
          (s."safe-buffer@5.1.2")
          ];
        "content-type@1.0.4" = f "content-type" "1.0.4" y "e138cc75e040c727b1966fe5e5f8c9aee256fe3b" [];
        "content-type@^1.0.4" = s."content-type@1.0.4";
        "content-type@~1.0.4" = s."content-type@1.0.4";
        "convert-source-map@0.3.5" = f "convert-source-map" "0.3.5" y "f1d802950af7dd2631a1febe0596550c86ab3190" [];
        "convert-source-map@1.7.0" = f "convert-source-map" "1.7.0" y "17a2cb882d7f77d3490585e2ce6c524424a3a442" [
          (s."safe-buffer@~5.1.1")
          ];
        "convert-source-map@1.8.0" = f "convert-source-map" "1.8.0" y "f3373c32d21b4d780dd8004514684fb791ca4369" [
          (s."safe-buffer@~5.1.1")
          ];
        "convert-source-map@^0.3.3" = s."convert-source-map@0.3.5";
        "convert-source-map@^1.4.0" = s."convert-source-map@1.8.0";
        "convert-source-map@^1.6.0" = s."convert-source-map@1.8.0";
        "convert-source-map@^1.7.0" = s."convert-source-map@1.8.0";
        "cookie-signature@1.0.6" = f "cookie-signature" "1.0.6" y "e303a882b342cc3ee8ca513a79999734dab3ae2c" [];
        "cookie@0.4.0" = f "cookie" "0.4.0" y "beb437e7022b3b6d49019d088665303ebe9c14ba" [];
        "copy-concurrently@1.0.5" = f "copy-concurrently" "1.0.5" y "92297398cae34937fcafd6ec8139c18051f0b5e0" [
          (s."aproba@^1.1.1")
          (s."fs-write-stream-atomic@^1.0.8")
          (s."iferr@^0.1.5")
          (s."mkdirp@^0.5.1")
          (s."rimraf@^2.5.4")
          (s."run-queue@^1.0.0")
          ];
        "copy-concurrently@^1.0.0" = s."copy-concurrently@1.0.5";
        "copy-descriptor@0.1.1" = f "copy-descriptor" "0.1.1" y "676f6eb3c39997c2ee1ac3a924fd6124748f578d" [];
        "copy-descriptor@^0.1.0" = s."copy-descriptor@0.1.1";
        "copy-to-clipboard@3.3.1" = f "copy-to-clipboard" "3.3.1" y "115aa1a9998ffab6196f93076ad6da3b913662ae" [
          (s."toggle-selection@^1.0.6")
          ];
        "copy-to-clipboard@^3.2.0" = s."copy-to-clipboard@3.3.1";
        "core-js-compat@3.16.0" = f "core-js-compat" "3.16.0" y "fced4a0a534e7e02f7e084bff66c701f8281805f" [
          (s."browserslist@^4.16.6")
          (s."semver@7.0.0")
          ];
        "core-js-compat@^3.14.0" = s."core-js-compat@3.16.0";
        "core-js-compat@^3.16.0" = s."core-js-compat@3.16.0";
        "core-js-compat@^3.6.2" = s."core-js-compat@3.16.0";
        "core-js-pure@3.16.0" = f "core-js-pure" "3.16.0" y "218e07add3f1844e53fab195c47871fc5ba18de8" [];
        "core-js-pure@3.18.0" = f "core-js-pure" "3.18.0" y "e5187347bae66448c9e2d67c01c34c4df3261dc5" [];
        "core-js-pure@^3.10.2" = s."core-js-pure@3.18.0";
        "core-js-pure@^3.16.0" = s."core-js-pure@3.16.0";
        "core-js@2.6.12" = f "core-js" "2.6.12" y "d9333dfa7b065e347cc5682219d6f690859cc2ec" [];
        "core-js@3.16.0" = f "core-js" "3.16.0" y "1d46fb33720bc1fa7f90d20431f36a5540858986" [];
        "core-js@3.18.0" = f "core-js" "3.18.0" y "9af3f4a6df9ba3428a3fb1b171f1503b3f40cc49" [];
        "core-js@^2.4.0" = s."core-js@2.6.12";
        "core-js@^3.0.1" = s."core-js@3.18.0";
        "core-js@^3.6.5" = s."core-js@3.16.0";
        "core-util-is@1.0.2" = f "core-util-is" "1.0.2" y "b5fd54220aa2bc5ab57aab7140c940754503c1a7" [];
        "core-util-is@~1.0.0" = s."core-util-is@1.0.2";
        "cosmiconfig@5.2.1" = f "cosmiconfig" "5.2.1" y "040f726809c591e77a17c0a3626ca45b4f168b1a" [
          (s."import-fresh@^2.0.0")
          (s."is-directory@^0.3.1")
          (s."js-yaml@^3.13.1")
          (s."parse-json@^4.0.0")
          ];
        "cosmiconfig@6.0.0" = f "cosmiconfig" "6.0.0" y "da4fee853c52f6b1e6935f41c1a2fc50bd4a9982" [
          (s."@types/parse-json@^4.0.0")
          (s."import-fresh@^3.1.0")
          (s."parse-json@^5.0.0")
          (s."path-type@^4.0.0")
          (s."yaml@^1.7.2")
          ];
        "cosmiconfig@7.0.0" = f "cosmiconfig" "7.0.0" y "ef9b44d773959cae63ddecd122de23853b60f8d3" [
          (s."@types/parse-json@^4.0.0")
          (s."import-fresh@^3.2.1")
          (s."parse-json@^5.0.0")
          (s."path-type@^4.0.0")
          (s."yaml@^1.10.0")
          ];
        "cosmiconfig@^5.0.0" = s."cosmiconfig@5.2.1";
        "cosmiconfig@^5.0.6" = s."cosmiconfig@5.2.1";
        "cosmiconfig@^6.0.0" = s."cosmiconfig@6.0.0";
        "cosmiconfig@^7.0.0" = s."cosmiconfig@7.0.0";
        "create-ecdh@4.0.4" = f "create-ecdh" "4.0.4" y "d6e7f4bffa66736085a0762fd3a632684dabcc4e" [
          (s."bn.js@^4.1.0")
          (s."elliptic@^6.5.3")
          ];
        "create-ecdh@^4.0.0" = s."create-ecdh@4.0.4";
        "create-hash@1.2.0" = f "create-hash" "1.2.0" y "889078af11a63756bcfb59bd221996be3a9ef196" [
          (s."cipher-base@^1.0.1")
          (s."inherits@^2.0.1")
          (s."md5.js@^1.3.4")
          (s."ripemd160@^2.0.1")
          (s."sha.js@^2.4.0")
          ];
        "create-hash@^1.1.0" = s."create-hash@1.2.0";
        "create-hash@^1.1.2" = s."create-hash@1.2.0";
        "create-hash@^1.2.0" = s."create-hash@1.2.0";
        "create-hmac@1.1.7" = f "create-hmac" "1.1.7" y "69170c78b3ab957147b2b8b04572e47ead2243ff" [
          (s."cipher-base@^1.0.3")
          (s."create-hash@^1.1.0")
          (s."inherits@^2.0.1")
          (s."ripemd160@^2.0.0")
          (s."safe-buffer@^5.0.1")
          (s."sha.js@^2.4.8")
          ];
        "create-hmac@^1.1.0" = s."create-hmac@1.1.7";
        "create-hmac@^1.1.4" = s."create-hmac@1.1.7";
        "create-hmac@^1.1.7" = s."create-hmac@1.1.7";
        "cross-spawn@6.0.5" = f "cross-spawn" "6.0.5" y "4a5ec7c64dfae22c3a14124dbacdee846d80cbc4" [
          (s."nice-try@^1.0.4")
          (s."path-key@^2.0.1")
          (s."semver@^5.5.0")
          (s."shebang-command@^1.2.0")
          (s."which@^1.2.9")
          ];
        "cross-spawn@7.0.3" = f "cross-spawn" "7.0.3" y "f73a85b9d5d41d045551c177e2882d4ac85728a6" [
          (s."path-key@^3.1.0")
          (s."shebang-command@^2.0.0")
          (s."which@^2.0.1")
          ];
        "cross-spawn@^6.0.0" = s."cross-spawn@6.0.5";
        "cross-spawn@^6.0.5" = s."cross-spawn@6.0.5";
        "cross-spawn@^7.0.0" = s."cross-spawn@7.0.3";
        "cross-spawn@^7.0.2" = s."cross-spawn@7.0.3";
        "crypto-browserify@3.12.0" = f "crypto-browserify" "3.12.0" y "396cf9f3137f03e4b8e532c58f698254e00f80ec" [
          (s."browserify-cipher@^1.0.0")
          (s."browserify-sign@^4.0.0")
          (s."create-ecdh@^4.0.0")
          (s."create-hash@^1.1.0")
          (s."create-hmac@^1.1.0")
          (s."diffie-hellman@^5.0.0")
          (s."inherits@^2.0.1")
          (s."pbkdf2@^3.0.3")
          (s."public-encrypt@^4.0.0")
          (s."randombytes@^2.0.0")
          (s."randomfill@^1.0.3")
          ];
        "crypto-browserify@^3.11.0" = s."crypto-browserify@3.12.0";
        "crypto-random-string@1.0.0" = f "crypto-random-string" "1.0.0" y "a230f64f568310e1498009940790ec99545bca7e" [];
        "crypto-random-string@^1.0.0" = s."crypto-random-string@1.0.0";
        "css-blank-pseudo@0.1.4" = f "css-blank-pseudo" "0.1.4" y "dfdefd3254bf8a82027993674ccf35483bfcb3c5" [
          (s."postcss@^7.0.5")
          ];
        "css-blank-pseudo@^0.1.4" = s."css-blank-pseudo@0.1.4";
        "css-color-names@0.0.4" = f "css-color-names" "0.0.4" y "808adc2e79cf84738069b646cb20ec27beb629e0" [];
        "css-color-names@^0.0.4" = s."css-color-names@0.0.4";
        "css-declaration-sorter@4.0.1" = f "css-declaration-sorter" "4.0.1" y "c198940f63a76d7e36c1e71018b001721054cb22" [
          (s."postcss@^7.0.1")
          (s."timsort@^0.3.0")
          ];
        "css-declaration-sorter@^4.0.1" = s."css-declaration-sorter@4.0.1";
        "css-has-pseudo@0.10.0" = f "css-has-pseudo" "0.10.0" y "3c642ab34ca242c59c41a125df9105841f6966ee" [
          (s."postcss@^7.0.6")
          (s."postcss-selector-parser@^5.0.0-rc.4")
          ];
        "css-has-pseudo@^0.10.0" = s."css-has-pseudo@0.10.0";
        "css-loader@4.3.0" = f "css-loader" "4.3.0" y "c888af64b2a5b2e85462c72c0f4a85c7e2e0821e" [
          (s."camelcase@^6.0.0")
          (s."cssesc@^3.0.0")
          (s."icss-utils@^4.1.1")
          (s."loader-utils@^2.0.0")
          (s."postcss@^7.0.32")
          (s."postcss-modules-extract-imports@^2.0.0")
          (s."postcss-modules-local-by-default@^3.0.3")
          (s."postcss-modules-scope@^2.2.0")
          (s."postcss-modules-values@^3.0.0")
          (s."postcss-value-parser@^4.1.0")
          (s."schema-utils@^2.7.1")
          (s."semver@^7.3.2")
          ];
        "css-prefers-color-scheme@3.1.1" = f "css-prefers-color-scheme" "3.1.1" y "6f830a2714199d4f0d0d0bb8a27916ed65cff1f4" [
          (s."postcss@^7.0.5")
          ];
        "css-prefers-color-scheme@^3.1.1" = s."css-prefers-color-scheme@3.1.1";
        "css-select-base-adapter@0.1.1" = f "css-select-base-adapter" "0.1.1" y "3b2ff4972cc362ab88561507a95408a1432135d7" [];
        "css-select-base-adapter@^0.1.1" = s."css-select-base-adapter@0.1.1";
        "css-select@2.1.0" = f "css-select" "2.1.0" y "6a34653356635934a81baca68d0255432105dbef" [
          (s."boolbase@^1.0.0")
          (s."css-what@^3.2.1")
          (s."domutils@^1.7.0")
          (s."nth-check@^1.0.2")
          ];
        "css-select@4.1.3" = f "css-select" "4.1.3" y "a70440f70317f2669118ad74ff105e65849c7067" [
          (s."boolbase@^1.0.0")
          (s."css-what@^5.0.0")
          (s."domhandler@^4.2.0")
          (s."domutils@^2.6.0")
          (s."nth-check@^2.0.0")
          ];
        "css-select@^2.0.0" = s."css-select@2.1.0";
        "css-select@^4.1.3" = s."css-select@4.1.3";
        "css-tree@1.0.0-alpha.37" = f "css-tree" "1.0.0-alpha.37" y "98bebd62c4c1d9f960ec340cf9f7522e30709a22" [
          (s."mdn-data@2.0.4")
          (s."source-map@^0.6.1")
          ];
        "css-tree@1.1.3" = f "css-tree" "1.1.3" y "eb4870fb6fd7707327ec95c2ff2ab09b5e8db91d" [
          (s."mdn-data@2.0.14")
          (s."source-map@^0.6.1")
          ];
        "css-tree@^1.1.2" = s."css-tree@1.1.3";
        "css-what@3.4.2" = f "css-what" "3.4.2" y "ea7026fcb01777edbde52124e21f327e7ae950e4" [];
        "css-what@5.0.1" = f "css-what" "5.0.1" y "3efa820131f4669a8ac2408f9c32e7c7de9f4cad" [];
        "css-what@^3.2.1" = s."css-what@3.4.2";
        "css-what@^5.0.0" = s."css-what@5.0.1";
        "css.escape@1.5.1" = f "css.escape" "1.5.1" y "42e27d4fa04ae32f931a4b4d4191fa9cddee97cb" [];
        "css.escape@^1.5.1" = s."css.escape@1.5.1";
        "css@2.2.4" = f "css" "2.2.4" y "c646755c73971f2bba6a601e2cf2fd71b1298929" [
          (s."inherits@^2.0.3")
          (s."source-map@^0.6.1")
          (s."source-map-resolve@^0.5.2")
          (s."urix@^0.1.0")
          ];
        "css@^2.0.0" = s."css@2.2.4";
        "css@^2.2.3" = s."css@2.2.4";
        "cssdb@4.4.0" = f "cssdb" "4.4.0" y "3bf2f2a68c10f5c6a08abd92378331ee803cddb0" [];
        "cssdb@^4.4.0" = s."cssdb@4.4.0";
        "cssesc@2.0.0" = f "cssesc" "2.0.0" y "3b13bd1bb1cb36e1bcb5a4dcd27f54c5dcb35703" [];
        "cssesc@3.0.0" = f "cssesc" "3.0.0" y "37741919903b868565e1c09ea747445cd18983ee" [];
        "cssesc@^2.0.0" = s."cssesc@2.0.0";
        "cssesc@^3.0.0" = s."cssesc@3.0.0";
        "cssnano-preset-default@4.0.8" = f "cssnano-preset-default" "4.0.8" y "920622b1fc1e95a34e8838203f1397a504f2d3ff" [
          (s."css-declaration-sorter@^4.0.1")
          (s."cssnano-util-raw-cache@^4.0.1")
          (s."postcss@^7.0.0")
          (s."postcss-calc@^7.0.1")
          (s."postcss-colormin@^4.0.3")
          (s."postcss-convert-values@^4.0.1")
          (s."postcss-discard-comments@^4.0.2")
          (s."postcss-discard-duplicates@^4.0.2")
          (s."postcss-discard-empty@^4.0.1")
          (s."postcss-discard-overridden@^4.0.1")
          (s."postcss-merge-longhand@^4.0.11")
          (s."postcss-merge-rules@^4.0.3")
          (s."postcss-minify-font-values@^4.0.2")
          (s."postcss-minify-gradients@^4.0.2")
          (s."postcss-minify-params@^4.0.2")
          (s."postcss-minify-selectors@^4.0.2")
          (s."postcss-normalize-charset@^4.0.1")
          (s."postcss-normalize-display-values@^4.0.2")
          (s."postcss-normalize-positions@^4.0.2")
          (s."postcss-normalize-repeat-style@^4.0.2")
          (s."postcss-normalize-string@^4.0.2")
          (s."postcss-normalize-timing-functions@^4.0.2")
          (s."postcss-normalize-unicode@^4.0.1")
          (s."postcss-normalize-url@^4.0.1")
          (s."postcss-normalize-whitespace@^4.0.2")
          (s."postcss-ordered-values@^4.1.2")
          (s."postcss-reduce-initial@^4.0.3")
          (s."postcss-reduce-transforms@^4.0.2")
          (s."postcss-svgo@^4.0.3")
          (s."postcss-unique-selectors@^4.0.1")
          ];
        "cssnano-preset-default@^4.0.8" = s."cssnano-preset-default@4.0.8";
        "cssnano-util-get-arguments@4.0.0" = f "cssnano-util-get-arguments" "4.0.0" y "ed3a08299f21d75741b20f3b81f194ed49cc150f" [];
        "cssnano-util-get-arguments@^4.0.0" = s."cssnano-util-get-arguments@4.0.0";
        "cssnano-util-get-match@4.0.0" = f "cssnano-util-get-match" "4.0.0" y "c0e4ca07f5386bb17ec5e52250b4f5961365156d" [];
        "cssnano-util-get-match@^4.0.0" = s."cssnano-util-get-match@4.0.0";
        "cssnano-util-raw-cache@4.0.1" = f "cssnano-util-raw-cache" "4.0.1" y "b26d5fd5f72a11dfe7a7846fb4c67260f96bf282" [
          (s."postcss@^7.0.0")
          ];
        "cssnano-util-raw-cache@^4.0.1" = s."cssnano-util-raw-cache@4.0.1";
        "cssnano-util-same-parent@4.0.1" = f "cssnano-util-same-parent" "4.0.1" y "574082fb2859d2db433855835d9a8456ea18bbf3" [];
        "cssnano-util-same-parent@^4.0.0" = s."cssnano-util-same-parent@4.0.1";
        "cssnano@4.1.11" = f "cssnano" "4.1.11" y "c7b5f5b81da269cb1fd982cb960c1200910c9a99" [
          (s."cosmiconfig@^5.0.0")
          (s."cssnano-preset-default@^4.0.8")
          (s."is-resolvable@^1.0.0")
          (s."postcss@^7.0.0")
          ];
        "cssnano@^4.1.10" = s."cssnano@4.1.11";
        "csso@4.2.0" = f "csso" "4.2.0" y "ea3a561346e8dc9f546d6febedd50187cf389529" [
          (s."css-tree@^1.1.2")
          ];
        "csso@^4.0.2" = s."csso@4.2.0";
        "cssom@0.3.8" = f "cssom" "0.3.8" y "9f1276f5b2b463f2114d3f2c75250af8c1a36f4a" [];
        "cssom@0.4.4" = f "cssom" "0.4.4" y "5a66cf93d2d0b661d80bf6a44fb65f5c2e4e0a10" [];
        "cssom@^0.4.4" = s."cssom@0.4.4";
        "cssom@~0.3.6" = s."cssom@0.3.8";
        "cssstyle@2.3.0" = f "cssstyle" "2.3.0" y "ff665a0ddbdc31864b09647f34163443d90b0852" [
          (s."cssom@~0.3.6")
          ];
        "cssstyle@^2.3.0" = s."cssstyle@2.3.0";
        "csstype@3.0.8" = f "csstype" "3.0.8" y "d2266a792729fb227cd216fb572f43728e1ad340" [];
        "csstype@^3.0.2" = s."csstype@3.0.8";
        "cyclist@1.0.1" = f "cyclist" "1.0.1" y "596e9698fd0c80e12038c2b82d6eb1b35b6224d9" [];
        "cyclist@^1.0.1" = s."cyclist@1.0.1";
        "d3-color@1" = s."d3-color@1.4.1";
        "d3-color@1.4.1" = f "d3-color" "1.4.1" y "c52002bf8846ada4424d55d97982fef26eb3bc8a" [];
        "d3-dispatch@1 - 2" = s."d3-dispatch@2.0.0";
        "d3-dispatch@2.0.0" = f "d3-dispatch" "2.0.0" y "8a18e16f76dd3fcaef42163c97b926aa9b55e7cf" [];
        "d3-ease@1.0.7" = f "d3-ease" "1.0.7" y "9a834890ef8b8ae8c558b2fe55bd57f5993b85e2" [];
        "d3-ease@^1.0.5" = s."d3-ease@1.0.7";
        "d3-force@2.1.1" = f "d3-force" "2.1.1" y "f20ccbf1e6c9e80add1926f09b51f686a8bc0937" [
          (s."d3-dispatch@1 - 2")
          (s."d3-quadtree@1 - 2")
          (s."d3-timer@1 - 2")
          ];
        "d3-force@^2.0.1" = s."d3-force@2.1.1";
        "d3-hierarchy@2.0.0" = f "d3-hierarchy" "2.0.0" y "dab88a58ca3e7a1bc6cab390e89667fcc6d20218" [];
        "d3-hierarchy@^2.0.0" = s."d3-hierarchy@2.0.0";
        "d3-interpolate@1.4.0" = f "d3-interpolate" "1.4.0" y "526e79e2d80daa383f9e0c1c1c7dcc0f0583e987" [
          (s."d3-color@1")
          ];
        "d3-interpolate@^1.3.2" = s."d3-interpolate@1.4.0";
        "d3-quadtree@1 - 2" = s."d3-quadtree@2.0.0";
        "d3-quadtree@2.0.0" = f "d3-quadtree" "2.0.0" y "edbad045cef88701f6fee3aee8e93fb332d30f9d" [];
        "d3-regression@1.3.9" = f "d3-regression" "1.3.9" y "61c34acb9b6bbd9172ede89f05d0b7fbd57ccdc0" [];
        "d3-regression@^1.3.5" = s."d3-regression@1.3.9";
        "d3-timer@1 - 2" = s."d3-timer@2.0.0";
        "d3-timer@1.0.10" = f "d3-timer" "1.0.10" y "dfe76b8a91748831b13b6d9c793ffbd508dd9de5" [];
        "d3-timer@2.0.0" = f "d3-timer" "2.0.0" y "055edb1d170cfe31ab2da8968deee940b56623e6" [];
        "d3-timer@^1.0.9" = s."d3-timer@1.0.10";
        "d@1" = s."d@1.0.1";
        "d@1.0.1" = f "d" "1.0.1" y "8698095372d58dbee346ffd0c7093f99f8f9eb5a" [
          (s."type@^1.0.1")
          ];
        "d@^1.0.1" = s."d@1.0.1";
        "dagre@0.8.5" = f "dagre" "0.8.5" y "ba30b0055dac12b6c1fcc247817442777d06afee" [
          (s."graphlib@^2.1.8")
          (s."lodash@^4.17.15")
          ];
        "dagre@^0.8.5" = s."dagre@0.8.5";
        "damerau-levenshtein@1.0.7" = f "damerau-levenshtein" "1.0.7" y "64368003512a1a6992593741a09a9d31a836f55d" [];
        "damerau-levenshtein@^1.0.6" = s."damerau-levenshtein@1.0.7";
        "data-urls@2.0.0" = f "data-urls" "2.0.0" y "156485a72963a970f5d5821aaf642bef2bf2db9b" [
          (s."abab@^2.0.3")
          (s."whatwg-mimetype@^2.3.0")
          (s."whatwg-url@^8.0.0")
          ];
        "data-urls@^2.0.0" = s."data-urls@2.0.0";
        "date-fns@1.30.1" = f "date-fns" "1.30.1" y "2e71bf0b119153dbb4cc4e88d9ea5acfb50dc05c" [];
        "date-fns@2.23.0" = f "date-fns" "2.23.0" y "4e886c941659af0cf7b30fafdd1eaa37e88788a9" [];
        "date-fns@2.x" = s."date-fns@2.23.0";
        "date-fns@^1.27.2" = s."date-fns@1.30.1";
        "dayjs@1.10.6" = f "dayjs" "1.10.6" y "288b2aa82f2d8418a6c9d4df5898c0737ad02a63" [];
        "dayjs@1.x" = s."dayjs@1.10.6";
        "debug@2.6.9" = f "debug" "2.6.9" y "5d128515df134ff327e90a4c93f4e077a536341f" [
          (s."ms@2.0.0")
          ];
        "debug@3.2.7" = f "debug" "3.2.7" y "72580b7e9145fb39b6676f9c5e5fb100b934179a" [
          (s."ms@^2.1.1")
          ];
        "debug@4" = s."debug@4.3.2";
        "debug@4.3.2" = f "debug" "4.3.2" y "f0a49c18ac8779e31d4a0c6029dfb76873c7428b" [
          (s."ms@2.1.2")
          ];
        "debug@^2.2.0" = s."debug@2.6.9";
        "debug@^2.3.3" = s."debug@2.6.9";
        "debug@^2.6.0" = s."debug@2.6.9";
        "debug@^2.6.9" = s."debug@2.6.9";
        "debug@^3.1.1" = s."debug@3.2.7";
        "debug@^3.2.6" = s."debug@3.2.7";
        "debug@^3.2.7" = s."debug@3.2.7";
        "debug@^4.0.0" = s."debug@4.3.2";
        "debug@^4.0.1" = s."debug@4.3.2";
        "debug@^4.1.0" = s."debug@4.3.2";
        "debug@^4.1.1" = s."debug@4.3.2";
        "debug@^4.3.1" = s."debug@4.3.2";
        "decamelize@1.2.0" = f "decamelize" "1.2.0" y "f6534d15148269b20352e7bee26f501f9a191290" [];
        "decamelize@^1.2.0" = s."decamelize@1.2.0";
        "decimal.js@10.3.1" = f "decimal.js" "10.3.1" y "d8c3a444a9c6774ba60ca6ad7261c3a94fd5e783" [];
        "decimal.js@^10.2.1" = s."decimal.js@10.3.1";
        "decode-uri-component@0.2.0" = f "decode-uri-component" "0.2.0" y "eb3913333458775cb84cd1a1fae062106bb87545" [];
        "decode-uri-component@^0.2.0" = s."decode-uri-component@0.2.0";
        "dedent@0.7.0" = f "dedent" "0.7.0" y "2495ddbaf6eb874abb0e1be9df22d2e5a544326c" [];
        "dedent@^0.7.0" = s."dedent@0.7.0";
        "deep-equal@1.1.1" = f "deep-equal" "1.1.1" y "b5c98c942ceffaf7cb051e24e1434a25a2e6076a" [
          (s."is-arguments@^1.0.4")
          (s."is-date-object@^1.0.1")
          (s."is-regex@^1.0.4")
          (s."object-is@^1.0.1")
          (s."object-keys@^1.1.1")
          (s."regexp.prototype.flags@^1.2.0")
          ];
        "deep-equal@^1.0.1" = s."deep-equal@1.1.1";
        "deep-is@0.1.3" = f "deep-is" "0.1.3" y "b369d6fb5dbc13eecf524f91b070feedc357cf34" [];
        "deep-is@^0.1.3" = s."deep-is@0.1.3";
        "deep-is@~0.1.3" = s."deep-is@0.1.3";
        "deepmerge@4.2.2" = f "deepmerge" "4.2.2" y "44d2ea3679b8f4d4ffba33f03d865fc1e7bf4955" [];
        "deepmerge@^4.2.2" = s."deepmerge@4.2.2";
        "default-gateway@4.2.0" = f "default-gateway" "4.2.0" y "167104c7500c2115f6dd69b0a536bb8ed720552b" [
          (s."execa@^1.0.0")
          (s."ip-regex@^2.1.0")
          ];
        "default-gateway@^4.2.0" = s."default-gateway@4.2.0";
        "define-properties@1.1.3" = f "define-properties" "1.1.3" y "cf88da6cbee26fe6db7094f61d870cbd84cee9f1" [
          (s."object-keys@^1.0.12")
          ];
        "define-properties@^1.1.2" = s."define-properties@1.1.3";
        "define-properties@^1.1.3" = s."define-properties@1.1.3";
        "define-property@0.2.5" = f "define-property" "0.2.5" y "c35b1ef918ec3c990f9a5bc57be04aacec5c8116" [
          (s."is-descriptor@^0.1.0")
          ];
        "define-property@1.0.0" = f "define-property" "1.0.0" y "769ebaaf3f4a63aad3af9e8d304c9bbe79bfb0e6" [
          (s."is-descriptor@^1.0.0")
          ];
        "define-property@2.0.2" = f "define-property" "2.0.2" y "d459689e8d654ba77e02a817f8710d702cb16e9d" [
          (s."is-descriptor@^1.0.2")
          (s."isobject@^3.0.1")
          ];
        "define-property@^0.2.5" = s."define-property@0.2.5";
        "define-property@^1.0.0" = s."define-property@1.0.0";
        "define-property@^2.0.2" = s."define-property@2.0.2";
        "del@4.1.1" = f "del" "4.1.1" y "9e8f117222ea44a31ff3a156c049b99052a9f0b4" [
          (s."@types/glob@^7.1.1")
          (s."globby@^6.1.0")
          (s."is-path-cwd@^2.0.0")
          (s."is-path-in-cwd@^2.0.0")
          (s."p-map@^2.0.0")
          (s."pify@^4.0.1")
          (s."rimraf@^2.6.3")
          ];
        "del@^4.1.1" = s."del@4.1.1";
        "delayed-stream@1.0.0" = f "delayed-stream" "1.0.0" y "df3ae199acadfb7d440aaae0b29e2272b24ec619" [];
        "delayed-stream@~1.0.0" = s."delayed-stream@1.0.0";
        "depd@1.1.2" = f "depd" "1.1.2" y "9bcd52e14c097763e749b274c4346ed2e560b5a9" [];
        "depd@~1.1.2" = s."depd@1.1.2";
        "des.js@1.0.1" = f "des.js" "1.0.1" y "5382142e1bdc53f85d86d53e5f4aa7deb91e0843" [
          (s."inherits@^2.0.1")
          (s."minimalistic-assert@^1.0.0")
          ];
        "des.js@^1.0.0" = s."des.js@1.0.1";
        "destroy@1.0.4" = f "destroy" "1.0.4" y "978857442c44749e4206613e37946205826abd80" [];
        "destroy@~1.0.4" = s."destroy@1.0.4";
        "detect-browser@5.2.0" = f "detect-browser" "5.2.0" y "c9cd5afa96a6a19fda0bbe9e9be48a6b6e1e9c97" [];
        "detect-browser@^5.0.0" = s."detect-browser@5.2.0";
        "detect-browser@^5.1.0" = s."detect-browser@5.2.0";
        "detect-newline@3.1.0" = f "detect-newline" "3.1.0" y "576f5dfc63ae1a192ff192d8ad3af6308991b651" [];
        "detect-newline@^3.0.0" = s."detect-newline@3.1.0";
        "detect-node@2.1.0" = f "detect-node" "2.1.0" y "c9c70775a49c3d03bc2c06d9a73be550f978f8b1" [];
        "detect-node@^2.0.4" = s."detect-node@2.1.0";
        "detect-port-alt@1.1.6" = f "detect-port-alt" "1.1.6" y "24707deabe932d4a3cf621302027c2b266568275" [
          (s."address@^1.0.1")
          (s."debug@^2.6.0")
          ];
        "diff-sequences@24.9.0" = f "diff-sequences" "24.9.0" y "5715d6244e2aa65f48bba0bc972db0b0b11e95b5" [];
        "diff-sequences@26.6.2" = f "diff-sequences" "26.6.2" y "48ba99157de1923412eed41db6b6d4aa9ca7c0b1" [];
        "diff-sequences@^24.9.0" = s."diff-sequences@24.9.0";
        "diff-sequences@^26.6.2" = s."diff-sequences@26.6.2";
        "diff@4.0.2" = f "diff" "4.0.2" y "60f3aecb89d5fae520c11aa19efc2bb982aade7d" [];
        "diff@^4.0.1" = s."diff@4.0.2";
        "diffie-hellman@5.0.3" = f "diffie-hellman" "5.0.3" y "40e8ee98f55a2149607146921c63e1ae5f3d2875" [
          (s."bn.js@^4.1.0")
          (s."miller-rabin@^4.0.0")
          (s."randombytes@^2.0.0")
          ];
        "diffie-hellman@^5.0.0" = s."diffie-hellman@5.0.3";
        "dir-glob@3.0.1" = f "dir-glob" "3.0.1" y "56dbf73d992a4a93ba1584f4534063fd2e41717f" [
          (s."path-type@^4.0.0")
          ];
        "dir-glob@^3.0.1" = s."dir-glob@3.0.1";
        "dns-equal@1.0.0" = f "dns-equal" "1.0.0" y "b39e7f1da6eb0a75ba9c17324b34753c47e0654d" [];
        "dns-equal@^1.0.0" = s."dns-equal@1.0.0";
        "dns-packet@1.3.4" = f "dns-packet" "1.3.4" y "e3455065824a2507ba886c55a89963bb107dec6f" [
          (s."ip@^1.1.0")
          (s."safe-buffer@^5.0.1")
          ];
        "dns-packet@^1.3.1" = s."dns-packet@1.3.4";
        "dns-txt@2.0.2" = f "dns-txt" "2.0.2" y "b91d806f5d27188e4ab3e7d107d881a1cc4642b6" [
          (s."buffer-indexof@^1.0.0")
          ];
        "dns-txt@^2.0.2" = s."dns-txt@2.0.2";
        "doctrine@2.1.0" = f "doctrine" "2.1.0" y "5cd01fc101621b42c4cd7f5d1a66243716d3f39d" [
          (s."esutils@^2.0.2")
          ];
        "doctrine@3.0.0" = f "doctrine" "3.0.0" y "addebead72a6574db783639dc87a121773973961" [
          (s."esutils@^2.0.2")
          ];
        "doctrine@^2.1.0" = s."doctrine@2.1.0";
        "doctrine@^3.0.0" = s."doctrine@3.0.0";
        "dom-accessibility-api@0.3.0" = f "dom-accessibility-api" "0.3.0" y "511e5993dd673b97c87ea47dba0e3892f7e0c983" [];
        "dom-accessibility-api@0.5.7" = f "dom-accessibility-api" "0.5.7" y "8c2aa6325968f2933160a0b7dbb380893ddf3e7d" [];
        "dom-accessibility-api@^0.3.0" = s."dom-accessibility-api@0.3.0";
        "dom-accessibility-api@^0.5.6" = s."dom-accessibility-api@0.5.7";
        "dom-align@1.12.2" = f "dom-align" "1.12.2" y "0f8164ebd0c9c21b0c790310493cd855892acd4b" [];
        "dom-align@^1.7.0" = s."dom-align@1.12.2";
        "dom-converter@0.2.0" = f "dom-converter" "0.2.0" y "6721a9daee2e293682955b6afe416771627bb768" [
          (s."utila@~0.4")
          ];
        "dom-converter@^0.2.0" = s."dom-converter@0.2.0";
        "dom-serializer@0" = s."dom-serializer@0.2.2";
        "dom-serializer@0.2.2" = f "dom-serializer" "0.2.2" y "1afb81f533717175d478655debc5e332d9f9bb51" [
          (s."domelementtype@^2.0.1")
          (s."entities@^2.0.0")
          ];
        "dom-serializer@1.3.2" = f "dom-serializer" "1.3.2" y "6206437d32ceefaec7161803230c7a20bc1b4d91" [
          (s."domelementtype@^2.0.1")
          (s."domhandler@^4.2.0")
          (s."entities@^2.0.0")
          ];
        "dom-serializer@^1.0.1" = s."dom-serializer@1.3.2";
        "domain-browser@1.2.0" = f "domain-browser" "1.2.0" y "3d31f50191a6749dd1375a7f522e823d42e54eda" [];
        "domain-browser@^1.1.1" = s."domain-browser@1.2.0";
        "domelementtype@1" = s."domelementtype@1.3.1";
        "domelementtype@1.3.1" = f "domelementtype" "1.3.1" y "d048c44b37b0d10a7f2a3d5fee3f4333d790481f" [];
        "domelementtype@2.2.0" = f "domelementtype" "2.2.0" y "9a0b6c2782ed6a1c7323d42267183df9bd8b1d57" [];
        "domelementtype@^2.0.1" = s."domelementtype@2.2.0";
        "domelementtype@^2.2.0" = s."domelementtype@2.2.0";
        "domexception@2.0.1" = f "domexception" "2.0.1" y "fb44aefba793e1574b0af6aed2801d057529f304" [
          (s."webidl-conversions@^5.0.0")
          ];
        "domexception@^2.0.1" = s."domexception@2.0.1";
        "domhandler@4.2.0" = f "domhandler" "4.2.0" y "f9768a5f034be60a89a27c2e4d0f74eba0d8b059" [
          (s."domelementtype@^2.2.0")
          ];
        "domhandler@^4.0.0" = s."domhandler@4.2.0";
        "domhandler@^4.2.0" = s."domhandler@4.2.0";
        "domutils@1.7.0" = f "domutils" "1.7.0" y "56ea341e834e06e6748af7a1cb25da67ea9f8c2a" [
          (s."dom-serializer@0")
          (s."domelementtype@1")
          ];
        "domutils@2.7.0" = f "domutils" "2.7.0" y "8ebaf0c41ebafcf55b0b72ec31c56323712c5442" [
          (s."dom-serializer@^1.0.1")
          (s."domelementtype@^2.2.0")
          (s."domhandler@^4.2.0")
          ];
        "domutils@^1.7.0" = s."domutils@1.7.0";
        "domutils@^2.5.2" = s."domutils@2.7.0";
        "domutils@^2.6.0" = s."domutils@2.7.0";
        "dot-case@3.0.4" = f "dot-case" "3.0.4" y "9b2b670d00a431667a8a75ba29cd1b98809ce751" [
          (s."no-case@^3.0.4")
          (s."tslib@^2.0.3")
          ];
        "dot-case@^3.0.4" = s."dot-case@3.0.4";
        "dot-prop@5.3.0" = f "dot-prop" "5.3.0" y "90ccce708cd9cd82cc4dc8c3ddd9abdd55b20e88" [
          (s."is-obj@^2.0.0")
          ];
        "dot-prop@^5.2.0" = s."dot-prop@5.3.0";
        "dotenv-expand@5.1.0" = f "dotenv-expand" "5.1.0" y "3fbaf020bfd794884072ea26b1e9791d45a629f0" [];
        "dotenv@8.2.0" = f "dotenv" "8.2.0" y "97e619259ada750eea3e4ea3e26bceea5424b16a" [];
        "dotenv@8.6.0" = f "dotenv" "8.6.0" y "061af664d19f7f4d8fc6e4ff9b584ce237adcb8b" [];
        "dotenv@^8.0.0" = s."dotenv@8.6.0";
        "duplexer@0.1.2" = f "duplexer" "0.1.2" y "3abe43aef3835f8ae077d136ddce0f276b0400e6" [];
        "duplexer@^0.1.1" = s."duplexer@0.1.2";
        "duplexify@3.7.1" = f "duplexify" "3.7.1" y "2a4df5317f6ccfd91f86d6fd25d8d8a103b88309" [
          (s."end-of-stream@^1.0.0")
          (s."inherits@^2.0.1")
          (s."readable-stream@^2.0.0")
          (s."stream-shift@^1.0.0")
          ];
        "duplexify@^3.4.2" = s."duplexify@3.7.1";
        "duplexify@^3.6.0" = s."duplexify@3.7.1";
        "ee-first@1.1.1" = f "ee-first" "1.1.1" y "590c61156b0ae2f4f0255732a158b266bc56b21d" [];
        "ejs@2.7.4" = f "ejs" "2.7.4" y "48661287573dcc53e366c7a1ae52c3a120eec9ba" [];
        "ejs@^2.6.1" = s."ejs@2.7.4";
        "electron-to-chromium@1.3.798" = f "electron-to-chromium" "1.3.798" y "12b0bb826ddf35486f2ca41c01be4bd6ad1b9b1e" [];
        "electron-to-chromium@^1.3.564" = s."electron-to-chromium@1.3.798";
        "electron-to-chromium@^1.3.793" = s."electron-to-chromium@1.3.798";
        "elegant-spinner@1.0.1" = f "elegant-spinner" "1.0.1" y "db043521c95d7e303fd8f345bedc3349cfb0729e" [];
        "elegant-spinner@^1.0.1" = s."elegant-spinner@1.0.1";
        "elliptic@6.5.4" = f "elliptic" "6.5.4" y "da37cebd31e79a1367e941b592ed1fbebd58abbb" [
          (s."bn.js@^4.11.9")
          (s."brorand@^1.1.0")
          (s."hash.js@^1.0.0")
          (s."hmac-drbg@^1.0.1")
          (s."inherits@^2.0.4")
          (s."minimalistic-assert@^1.0.1")
          (s."minimalistic-crypto-utils@^1.0.1")
          ];
        "elliptic@^6.5.3" = s."elliptic@6.5.4";
        "emittery@0.7.2" = f "emittery" "0.7.2" y "25595908e13af0f5674ab419396e2fb394cdfa82" [];
        "emittery@^0.7.1" = s."emittery@0.7.2";
        "emoji-regex@7.0.3" = f "emoji-regex" "7.0.3" y "933a04052860c85e83c122479c4748a8e4c72156" [];
        "emoji-regex@8.0.0" = f "emoji-regex" "8.0.0" y "e818fd69ce5ccfcb404594f842963bf53164cc37" [];
        "emoji-regex@9.2.2" = f "emoji-regex" "9.2.2" y "840c8803b0d8047f4ff0cf963176b32d4ef3ed72" [];
        "emoji-regex@^7.0.1" = s."emoji-regex@7.0.3";
        "emoji-regex@^8.0.0" = s."emoji-regex@8.0.0";
        "emoji-regex@^9.0.0" = s."emoji-regex@9.2.2";
        "emojis-list@2.1.0" = f "emojis-list" "2.1.0" y "4daa4d9db00f9819880c79fa457ae5b09a1fd389" [];
        "emojis-list@3.0.0" = f "emojis-list" "3.0.0" y "5570662046ad29e2e916e71aae260abdff4f6a78" [];
        "emojis-list@^2.0.0" = s."emojis-list@2.1.0";
        "emojis-list@^3.0.0" = s."emojis-list@3.0.0";
        "encodeurl@1.0.2" = f "encodeurl" "1.0.2" y "ad3ff4c86ec2d029322f5a02c3a9a606c95b3f59" [];
        "encodeurl@~1.0.2" = s."encodeurl@1.0.2";
        "end-of-stream@1.4.4" = f "end-of-stream" "1.4.4" y "5ae64a5f45057baf3626ec14da0ca5e4b2431eb0" [
          (s."once@^1.4.0")
          ];
        "end-of-stream@^1.0.0" = s."end-of-stream@1.4.4";
        "end-of-stream@^1.1.0" = s."end-of-stream@1.4.4";
        "enhanced-resolve@4.5.0" = f "enhanced-resolve" "4.5.0" y "2f3cfd84dbe3b487f18f2db2ef1e064a571ca5ec" [
          (s."graceful-fs@^4.1.2")
          (s."memory-fs@^0.5.0")
          (s."tapable@^1.0.0")
          ];
        "enhanced-resolve@^4.3.0" = s."enhanced-resolve@4.5.0";
        "enquirer@2.3.6" = f "enquirer" "2.3.6" y "2a7fe5dd634a1e4125a975ec994ff5456dc3734d" [
          (s."ansi-colors@^4.1.1")
          ];
        "enquirer@^2.3.5" = s."enquirer@2.3.6";
        "entities@2.2.0" = f "entities" "2.2.0" y "098dc90ebb83d8dffa089d55256b351d34c4da55" [];
        "entities@^2.0.0" = s."entities@2.2.0";
        "env-ci@5.0.2" = f "env-ci" "5.0.2" y "48b6687f8af8cdf5e31b8fcf2987553d085249d9" [
          (s."execa@^4.0.0")
          (s."java-properties@^1.0.0")
          ];
        "errno@0.1.8" = f "errno" "0.1.8" y "8bb3e9c7d463be4976ff888f76b4809ebc2e811f" [
          (s."prr@~1.0.1")
          ];
        "errno@^0.1.3" = s."errno@0.1.8";
        "errno@~0.1.7" = s."errno@0.1.8";
        "error-ex@1.3.2" = f "error-ex" "1.3.2" y "b4ac40648107fdcdcfae242f428bea8a14d4f1bf" [
          (s."is-arrayish@^0.2.1")
          ];
        "error-ex@^1.3.1" = s."error-ex@1.3.2";
        "error-stack-parser@2.0.6" = f "error-stack-parser" "2.0.6" y "5a99a707bd7a4c58a797902d48d82803ede6aad8" [
          (s."stackframe@^1.1.1")
          ];
        "error-stack-parser@^2.0.6" = s."error-stack-parser@2.0.6";
        "es-abstract@1.18.5" = f "es-abstract" "1.18.5" y "9b10de7d4c206a3581fd5b2124233e04db49ae19" [
          (s."call-bind@^1.0.2")
          (s."es-to-primitive@^1.2.1")
          (s."function-bind@^1.1.1")
          (s."get-intrinsic@^1.1.1")
          (s."has@^1.0.3")
          (s."has-symbols@^1.0.2")
          (s."internal-slot@^1.0.3")
          (s."is-callable@^1.2.3")
          (s."is-negative-zero@^2.0.1")
          (s."is-regex@^1.1.3")
          (s."is-string@^1.0.6")
          (s."object-inspect@^1.11.0")
          (s."object-keys@^1.1.1")
          (s."object.assign@^4.1.2")
          (s."string.prototype.trimend@^1.0.4")
          (s."string.prototype.trimstart@^1.0.4")
          (s."unbox-primitive@^1.0.1")
          ];
        "es-abstract@^1.17.2" = s."es-abstract@1.18.5";
        "es-abstract@^1.18.0-next.1" = s."es-abstract@1.18.5";
        "es-abstract@^1.18.0-next.2" = s."es-abstract@1.18.5";
        "es-abstract@^1.18.2" = s."es-abstract@1.18.5";
        "es-to-primitive@1.2.1" = f "es-to-primitive" "1.2.1" y "e55cd4c9cdc188bcefb03b366c736323fc5c898a" [
          (s."is-callable@^1.1.4")
          (s."is-date-object@^1.0.1")
          (s."is-symbol@^1.0.2")
          ];
        "es-to-primitive@^1.2.1" = s."es-to-primitive@1.2.1";
        "es5-ext@0.10.53" = f "es5-ext" "0.10.53" y "93c5a3acfdbef275220ad72644ad02ee18368de1" [
          (s."es6-symbol@~3.1.3")
          (s."next-tick@~1.0.0")
          ];
        "es5-ext@^0.10.35" = s."es5-ext@0.10.53";
        "es5-ext@^0.10.50" = s."es5-ext@0.10.53";
        "es6-error@4.1.1" = f "es6-error" "4.1.1" y "9e3af407459deed47e9a91f9b885a84eb05c561d" [];
        "es6-error@^4.1.1" = s."es6-error@4.1.1";
        "es6-iterator@2.0.3" = f "es6-iterator" "2.0.3" y "a7de889141a05a94b0854403b2d0a0fbfa98f3b7" [
          (s."es5-ext@^0.10.35")
          (s."es6-symbol@^3.1.1")
          ];
        "es6-iterator@~2.0.3" = s."es6-iterator@2.0.3";
        "es6-symbol@3.1.3" = f "es6-symbol" "3.1.3" y "bad5d3c1bcdac28269f4cb331e431c78ac705d18" [
          (s."d@^1.0.1")
          (s."ext@^1.1.2")
          ];
        "es6-symbol@^3.1.1" = s."es6-symbol@3.1.3";
        "es6-symbol@~3.1.3" = s."es6-symbol@3.1.3";
        "escalade@3.1.1" = f "escalade" "3.1.1" y "d8cfdc7000965c5a0174b4a82eaa5c0552742e40" [];
        "escalade@^3.0.2" = s."escalade@3.1.1";
        "escalade@^3.1.1" = s."escalade@3.1.1";
        "escape-html@1.0.3" = f "escape-html" "1.0.3" y "0258eae4d3d0c0974de1c169188ef0051d1d1988" [];
        "escape-html@~1.0.3" = s."escape-html@1.0.3";
        "escape-string-regexp@1.0.5" = f "escape-string-regexp" "1.0.5" y "1b61c0562190a8dff6ae3bb2cf0200ca130b86d4" [];
        "escape-string-regexp@2.0.0" = f "escape-string-regexp" "2.0.0" y "a30304e99daa32e23b2fd20f51babd07cffca344" [];
        "escape-string-regexp@4.0.0" = f "escape-string-regexp" "4.0.0" y "14ba83a5d373e3d311e5afca29cf5bfad965bf34" [];
        "escape-string-regexp@^1.0.2" = s."escape-string-regexp@1.0.5";
        "escape-string-regexp@^1.0.5" = s."escape-string-regexp@1.0.5";
        "escape-string-regexp@^2.0.0" = s."escape-string-regexp@2.0.0";
        "escape-string-regexp@^4.0.0" = s."escape-string-regexp@4.0.0";
        "escodegen@2.0.0" = f "escodegen" "2.0.0" y "5e32b12833e8aa8fa35e1bf0befa89380484c7dd" [
          (s."esprima@^4.0.1")
          (s."estraverse@^5.2.0")
          (s."esutils@^2.0.2")
          (s."optionator@^0.8.1")
          (s."source-map@~0.6.1")
          ];
        "escodegen@^2.0.0" = s."escodegen@2.0.0";
        "eslint-config-react-app@6.0.0" = f "eslint-config-react-app" "6.0.0" y "ccff9fc8e36b322902844cbd79197982be355a0e" [
          (s."confusing-browser-globals@^1.0.10")
          ];
        "eslint-config-react-app@^6.0.0" = s."eslint-config-react-app@6.0.0";
        "eslint-import-resolver-node@0.3.4" = f "eslint-import-resolver-node" "0.3.4" y "85ffa81942c25012d8231096ddf679c03042c717" [
          (s."debug@^2.6.9")
          (s."resolve@^1.13.1")
          ];
        "eslint-import-resolver-node@^0.3.4" = s."eslint-import-resolver-node@0.3.4";
        "eslint-module-utils@2.6.1" = f "eslint-module-utils" "2.6.1" y "b51be1e473dd0de1c5ea638e22429c2490ea8233" [
          (s."debug@^3.2.7")
          (s."pkg-dir@^2.0.0")
          ];
        "eslint-module-utils@^2.6.1" = s."eslint-module-utils@2.6.1";
        "eslint-plugin-flowtype@5.9.0" = f "eslint-plugin-flowtype" "5.9.0" y "8d2d81d3d79bb53470ed62b97409b31684757e30" [
          (s."lodash@^4.17.15")
          (s."string-natural-compare@^3.0.1")
          ];
        "eslint-plugin-flowtype@^5.2.0" = s."eslint-plugin-flowtype@5.9.0";
        "eslint-plugin-import@2.23.4" = f "eslint-plugin-import" "2.23.4" y "8dceb1ed6b73e46e50ec9a5bb2411b645e7d3d97" [
          (s."array-includes@^3.1.3")
          (s."array.prototype.flat@^1.2.4")
          (s."debug@^2.6.9")
          (s."doctrine@^2.1.0")
          (s."eslint-import-resolver-node@^0.3.4")
          (s."eslint-module-utils@^2.6.1")
          (s."find-up@^2.0.0")
          (s."has@^1.0.3")
          (s."is-core-module@^2.4.0")
          (s."minimatch@^3.0.4")
          (s."object.values@^1.1.3")
          (s."pkg-up@^2.0.0")
          (s."read-pkg-up@^3.0.0")
          (s."resolve@^1.20.0")
          (s."tsconfig-paths@^3.9.0")
          ];
        "eslint-plugin-import@^2.22.1" = s."eslint-plugin-import@2.23.4";
        "eslint-plugin-jest@24.4.0" = f "eslint-plugin-jest" "24.4.0" y "fa4b614dbd46a98b652d830377971f097bda9262" [
          (s."@typescript-eslint/experimental-utils@^4.0.1")
          ];
        "eslint-plugin-jest@^24.1.0" = s."eslint-plugin-jest@24.4.0";
        "eslint-plugin-jsx-a11y@6.4.1" = f "eslint-plugin-jsx-a11y" "6.4.1" y "a2d84caa49756942f42f1ffab9002436391718fd" [
          (s."@babel/runtime@^7.11.2")
          (s."aria-query@^4.2.2")
          (s."array-includes@^3.1.1")
          (s."ast-types-flow@^0.0.7")
          (s."axe-core@^4.0.2")
          (s."axobject-query@^2.2.0")
          (s."damerau-levenshtein@^1.0.6")
          (s."emoji-regex@^9.0.0")
          (s."has@^1.0.3")
          (s."jsx-ast-utils@^3.1.0")
          (s."language-tags@^1.0.5")
          ];
        "eslint-plugin-jsx-a11y@^6.3.1" = s."eslint-plugin-jsx-a11y@6.4.1";
        "eslint-plugin-react-hooks@4.2.0" = f "eslint-plugin-react-hooks" "4.2.0" y "8c229c268d468956334c943bb45fc860280f5556" [];
        "eslint-plugin-react-hooks@^4.2.0" = s."eslint-plugin-react-hooks@4.2.0";
        "eslint-plugin-react@7.24.0" = f "eslint-plugin-react" "7.24.0" y "eadedfa351a6f36b490aa17f4fa9b14e842b9eb4" [
          (s."array-includes@^3.1.3")
          (s."array.prototype.flatmap@^1.2.4")
          (s."doctrine@^2.1.0")
          (s."has@^1.0.3")
          (s."jsx-ast-utils@^2.4.1 || ^3.0.0")
          (s."minimatch@^3.0.4")
          (s."object.entries@^1.1.4")
          (s."object.fromentries@^2.0.4")
          (s."object.values@^1.1.4")
          (s."prop-types@^15.7.2")
          (s."resolve@^2.0.0-next.3")
          (s."string.prototype.matchall@^4.0.5")
          ];
        "eslint-plugin-react@^7.21.5" = s."eslint-plugin-react@7.24.0";
        "eslint-plugin-testing-library@3.10.2" = f "eslint-plugin-testing-library" "3.10.2" y "609ec2b0369da7cf2e6d9edff5da153cc31d87bd" [
          (s."@typescript-eslint/experimental-utils@^3.10.1")
          ];
        "eslint-plugin-testing-library@^3.9.2" = s."eslint-plugin-testing-library@3.10.2";
        "eslint-scope@4.0.3" = f "eslint-scope" "4.0.3" y "ca03833310f6889a3264781aa82e63eb9cfe7848" [
          (s."esrecurse@^4.1.0")
          (s."estraverse@^4.1.1")
          ];
        "eslint-scope@5.1.1" = f "eslint-scope" "5.1.1" y "e786e59a66cb92b3f6c1fb0d508aab174848f48c" [
          (s."esrecurse@^4.3.0")
          (s."estraverse@^4.1.1")
          ];
        "eslint-scope@^4.0.3" = s."eslint-scope@4.0.3";
        "eslint-scope@^5.0.0" = s."eslint-scope@5.1.1";
        "eslint-scope@^5.1.1" = s."eslint-scope@5.1.1";
        "eslint-utils@2.1.0" = f "eslint-utils" "2.1.0" y "d2de5e03424e707dc10c74068ddedae708741b27" [
          (s."eslint-visitor-keys@^1.1.0")
          ];
        "eslint-utils@3.0.0" = f "eslint-utils" "3.0.0" y "8aebaface7345bb33559db0a1f13a1d2d48c3672" [
          (s."eslint-visitor-keys@^2.0.0")
          ];
        "eslint-utils@^2.0.0" = s."eslint-utils@2.1.0";
        "eslint-utils@^2.1.0" = s."eslint-utils@2.1.0";
        "eslint-utils@^3.0.0" = s."eslint-utils@3.0.0";
        "eslint-visitor-keys@1.3.0" = f "eslint-visitor-keys" "1.3.0" y "30ebd1ef7c2fdff01c3a4f151044af25fab0523e" [];
        "eslint-visitor-keys@2.1.0" = f "eslint-visitor-keys" "2.1.0" y "f65328259305927392c938ed44eb0a5c9b2bd303" [];
        "eslint-visitor-keys@^1.0.0" = s."eslint-visitor-keys@1.3.0";
        "eslint-visitor-keys@^1.1.0" = s."eslint-visitor-keys@1.3.0";
        "eslint-visitor-keys@^1.3.0" = s."eslint-visitor-keys@1.3.0";
        "eslint-visitor-keys@^2.0.0" = s."eslint-visitor-keys@2.1.0";
        "eslint-webpack-plugin@2.5.4" = f "eslint-webpack-plugin" "2.5.4" y "473b84932f1a8e2c2b8e66a402d0497bf440b986" [
          (s."@types/eslint@^7.2.6")
          (s."arrify@^2.0.1")
          (s."jest-worker@^26.6.2")
          (s."micromatch@^4.0.2")
          (s."normalize-path@^3.0.0")
          (s."schema-utils@^3.0.0")
          ];
        "eslint-webpack-plugin@^2.5.2" = s."eslint-webpack-plugin@2.5.4";
        "eslint@7.32.0" = f "eslint" "7.32.0" y "c6d328a14be3fb08c8d1d21e12c02fdb7a2a812d" [
          (s."@babel/code-frame@7.12.11")
          (s."@eslint/eslintrc@^0.4.3")
          (s."@humanwhocodes/config-array@^0.5.0")
          (s."ajv@^6.10.0")
          (s."chalk@^4.0.0")
          (s."cross-spawn@^7.0.2")
          (s."debug@^4.0.1")
          (s."doctrine@^3.0.0")
          (s."enquirer@^2.3.5")
          (s."escape-string-regexp@^4.0.0")
          (s."eslint-scope@^5.1.1")
          (s."eslint-utils@^2.1.0")
          (s."eslint-visitor-keys@^2.0.0")
          (s."espree@^7.3.1")
          (s."esquery@^1.4.0")
          (s."esutils@^2.0.2")
          (s."fast-deep-equal@^3.1.3")
          (s."file-entry-cache@^6.0.1")
          (s."functional-red-black-tree@^1.0.1")
          (s."glob-parent@^5.1.2")
          (s."globals@^13.6.0")
          (s."ignore@^4.0.6")
          (s."import-fresh@^3.0.0")
          (s."imurmurhash@^0.1.4")
          (s."is-glob@^4.0.0")
          (s."js-yaml@^3.13.1")
          (s."json-stable-stringify-without-jsonify@^1.0.1")
          (s."levn@^0.4.1")
          (s."lodash.merge@^4.6.2")
          (s."minimatch@^3.0.4")
          (s."natural-compare@^1.4.0")
          (s."optionator@^0.9.1")
          (s."progress@^2.0.0")
          (s."regexpp@^3.1.0")
          (s."semver@^7.2.1")
          (s."strip-ansi@^6.0.0")
          (s."strip-json-comments@^3.1.0")
          (s."table@^6.0.9")
          (s."text-table@^0.2.0")
          (s."v8-compile-cache@^2.0.3")
          ];
        "eslint@^7.11.0" = s."eslint@7.32.0";
        "espree@7.3.1" = f "espree" "7.3.1" y "f2df330b752c6f55019f8bd89b7660039c1bbbb6" [
          (s."acorn@^7.4.0")
          (s."acorn-jsx@^5.3.1")
          (s."eslint-visitor-keys@^1.3.0")
          ];
        "espree@^7.3.0" = s."espree@7.3.1";
        "espree@^7.3.1" = s."espree@7.3.1";
        "esprima@4.0.1" = f "esprima" "4.0.1" y "13b04cdb3e6c5d19df91ab6987a8695619b0aa71" [];
        "esprima@^4.0.0" = s."esprima@4.0.1";
        "esprima@^4.0.1" = s."esprima@4.0.1";
        "esprima@~4.0.0" = s."esprima@4.0.1";
        "esquery@1.4.0" = f "esquery" "1.4.0" y "2148ffc38b82e8c7057dfed48425b3e61f0f24a5" [
          (s."estraverse@^5.1.0")
          ];
        "esquery@^1.4.0" = s."esquery@1.4.0";
        "esrecurse@4.3.0" = f "esrecurse" "4.3.0" y "7ad7964d679abb28bee72cec63758b1c5d2c9921" [
          (s."estraverse@^5.2.0")
          ];
        "esrecurse@^4.1.0" = s."esrecurse@4.3.0";
        "esrecurse@^4.3.0" = s."esrecurse@4.3.0";
        "estraverse@4.3.0" = f "estraverse" "4.3.0" y "398ad3f3c5a24948be7725e83d11a7de28cdbd1d" [];
        "estraverse@5.2.0" = f "estraverse" "5.2.0" y "307df42547e6cc7324d3cf03c155d5cdb8c53880" [];
        "estraverse@^4.1.1" = s."estraverse@4.3.0";
        "estraverse@^5.1.0" = s."estraverse@5.2.0";
        "estraverse@^5.2.0" = s."estraverse@5.2.0";
        "estree-walker@0.6.1" = f "estree-walker" "0.6.1" y "53049143f40c6eb918b23671d1fe3219f3a1b362" [];
        "estree-walker@1.0.1" = f "estree-walker" "1.0.1" y "31bc5d612c96b704106b477e6dd5d8aa138cb700" [];
        "estree-walker@^0.6.1" = s."estree-walker@0.6.1";
        "estree-walker@^1.0.1" = s."estree-walker@1.0.1";
        "esutils@2.0.3" = f "esutils" "2.0.3" y "74d2eb4de0b8da1293711910d50775b9b710ef64" [];
        "esutils@^2.0.2" = s."esutils@2.0.3";
        "etag@1.8.1" = f "etag" "1.8.1" y "41ae2eeb65efa62268aebfea83ac7d79299b0887" [];
        "etag@~1.8.1" = s."etag@1.8.1";
        "eventemitter3@4.0.7" = f "eventemitter3" "4.0.7" y "2de9b68f6528d5644ef5c59526a1b4a07306169f" [];
        "eventemitter3@^4.0.0" = s."eventemitter3@4.0.7";
        "events@3.3.0" = f "events" "3.3.0" y "31a95ad0a924e2d2c419a813aeb2c4e878ea7400" [];
        "events@^3.0.0" = s."events@3.3.0";
        "eventsource@1.1.0" = f "eventsource" "1.1.0" y "00e8ca7c92109e94b0ddf32dac677d841028cfaf" [
          (s."original@^1.0.0")
          ];
        "eventsource@^1.0.7" = s."eventsource@1.1.0";
        "evp_bytestokey@1.0.3" = f "evp_bytestokey" "1.0.3" y "7fcbdb198dc71959432efe13842684e0525acb02" [
          (s."md5.js@^1.3.4")
          (s."safe-buffer@^5.1.1")
          ];
        "evp_bytestokey@^1.0.0" = s."evp_bytestokey@1.0.3";
        "evp_bytestokey@^1.0.3" = s."evp_bytestokey@1.0.3";
        "exec-sh@0.3.6" = f "exec-sh" "0.3.6" y "ff264f9e325519a60cb5e273692943483cca63bc" [];
        "exec-sh@^0.3.2" = s."exec-sh@0.3.6";
        "execa@1.0.0" = f "execa" "1.0.0" y "c6236a5bb4df6d6f15e88e7f017798216749ddd8" [
          (s."cross-spawn@^6.0.0")
          (s."get-stream@^4.0.0")
          (s."is-stream@^1.1.0")
          (s."npm-run-path@^2.0.0")
          (s."p-finally@^1.0.0")
          (s."signal-exit@^3.0.0")
          (s."strip-eof@^1.0.0")
          ];
        "execa@4.1.0" = f "execa" "4.1.0" y "4e5491ad1572f2f17a77d388c6c857135b22847a" [
          (s."cross-spawn@^7.0.0")
          (s."get-stream@^5.0.0")
          (s."human-signals@^1.1.1")
          (s."is-stream@^2.0.0")
          (s."merge-stream@^2.0.0")
          (s."npm-run-path@^4.0.0")
          (s."onetime@^5.1.0")
          (s."signal-exit@^3.0.2")
          (s."strip-final-newline@^2.0.0")
          ];
        "execa@^1.0.0" = s."execa@1.0.0";
        "execa@^4.0.0" = s."execa@4.1.0";
        "exit@0.1.2" = f "exit" "0.1.2" y "0632638f8d877cc82107d30a0fff1a17cba1cd0c" [];
        "exit@^0.1.2" = s."exit@0.1.2";
        "expand-brackets@2.1.4" = f "expand-brackets" "2.1.4" y "b77735e315ce30f6b6eff0f83b04151a22449622" [
          (s."debug@^2.3.3")
          (s."define-property@^0.2.5")
          (s."extend-shallow@^2.0.1")
          (s."posix-character-classes@^0.1.0")
          (s."regex-not@^1.0.0")
          (s."snapdragon@^0.8.1")
          (s."to-regex@^3.0.1")
          ];
        "expand-brackets@^2.1.4" = s."expand-brackets@2.1.4";
        "expect@26.6.2" = f "expect" "26.6.2" y "c6b996bf26bf3fe18b67b2d0f51fc981ba934417" [
          (s."@jest/types@^26.6.2")
          (s."ansi-styles@^4.0.0")
          (s."jest-get-type@^26.3.0")
          (s."jest-matcher-utils@^26.6.2")
          (s."jest-message-util@^26.6.2")
          (s."jest-regex-util@^26.0.0")
          ];
        "expect@^26.6.0" = s."expect@26.6.2";
        "expect@^26.6.2" = s."expect@26.6.2";
        "express@4.17.1" = f "express" "4.17.1" y "4491fc38605cf51f8629d39c2b5d026f98a4c134" [
          (s."accepts@~1.3.7")
          (s."array-flatten@1.1.1")
          (s."body-parser@1.19.0")
          (s."content-disposition@0.5.3")
          (s."content-type@~1.0.4")
          (s."cookie@0.4.0")
          (s."cookie-signature@1.0.6")
          (s."debug@2.6.9")
          (s."depd@~1.1.2")
          (s."encodeurl@~1.0.2")
          (s."escape-html@~1.0.3")
          (s."etag@~1.8.1")
          (s."finalhandler@~1.1.2")
          (s."fresh@0.5.2")
          (s."merge-descriptors@1.0.1")
          (s."methods@~1.1.2")
          (s."on-finished@~2.3.0")
          (s."parseurl@~1.3.3")
          (s."path-to-regexp@0.1.7")
          (s."proxy-addr@~2.0.5")
          (s."qs@6.7.0")
          (s."range-parser@~1.2.1")
          (s."safe-buffer@5.1.2")
          (s."send@0.17.1")
          (s."serve-static@1.14.1")
          (s."setprototypeof@1.1.1")
          (s."statuses@~1.5.0")
          (s."type-is@~1.6.18")
          (s."utils-merge@1.0.1")
          (s."vary@~1.1.2")
          ];
        "express@^4.17.1" = s."express@4.17.1";
        "ext@1.4.0" = f "ext" "1.4.0" y "89ae7a07158f79d35517882904324077e4379244" [
          (s."type@^2.0.0")
          ];
        "ext@^1.1.2" = s."ext@1.4.0";
        "extend-shallow@2.0.1" = f "extend-shallow" "2.0.1" y "51af7d614ad9a9f610ea1bafbb989d6b1c56890f" [
          (s."is-extendable@^0.1.0")
          ];
        "extend-shallow@3.0.2" = f "extend-shallow" "3.0.2" y "26a71aaf073b39fb2127172746131c2704028db8" [
          (s."assign-symbols@^1.0.0")
          (s."is-extendable@^1.0.1")
          ];
        "extend-shallow@^2.0.1" = s."extend-shallow@2.0.1";
        "extend-shallow@^3.0.0" = s."extend-shallow@3.0.2";
        "extend-shallow@^3.0.2" = s."extend-shallow@3.0.2";
        "extglob@2.0.4" = f "extglob" "2.0.4" y "ad00fe4dc612a9232e8718711dc5cb5ab0285543" [
          (s."array-unique@^0.3.2")
          (s."define-property@^1.0.0")
          (s."expand-brackets@^2.1.4")
          (s."extend-shallow@^2.0.1")
          (s."fragment-cache@^0.2.1")
          (s."regex-not@^1.0.0")
          (s."snapdragon@^0.8.1")
          (s."to-regex@^3.0.1")
          ];
        "extglob@^2.0.4" = s."extglob@2.0.4";
        "extract-stack@1.0.0" = f "extract-stack" "1.0.0" y "b97acaf9441eea2332529624b732fc5a1c8165fa" [];
        "extract-stack@2.0.0" = f "extract-stack" "2.0.0" y "11367bc865bfcd9bc0db3123e5edb57786f11f9b" [];
        "extract-stack@^1.0.0" = s."extract-stack@1.0.0";
        "extract-stack@^2.0.0" = s."extract-stack@2.0.0";
        "fast-deep-equal@3.1.3" = f "fast-deep-equal" "3.1.3" y "3a7d56b559d6cbc3eb512325244e619a65c6c525" [];
        "fast-deep-equal@^3.1.1" = s."fast-deep-equal@3.1.3";
        "fast-deep-equal@^3.1.3" = s."fast-deep-equal@3.1.3";
        "fast-glob@3.2.7" = f "fast-glob" "3.2.7" y "fd6cb7a2d7e9aa7a7846111e85a196d6b2f766a1" [
          (s."@nodelib/fs.stat@^2.0.2")
          (s."@nodelib/fs.walk@^1.2.3")
          (s."glob-parent@^5.1.2")
          (s."merge2@^1.3.0")
          (s."micromatch@^4.0.4")
          ];
        "fast-glob@^3.1.1" = s."fast-glob@3.2.7";
        "fast-json-stable-stringify@2.1.0" = f "fast-json-stable-stringify" "2.1.0" y "874bf69c6f404c2b5d99c481341399fd55892633" [];
        "fast-json-stable-stringify@^2.0.0" = s."fast-json-stable-stringify@2.1.0";
        "fast-json-stable-stringify@^2.1.0" = s."fast-json-stable-stringify@2.1.0";
        "fast-levenshtein@2.0.6" = f "fast-levenshtein" "2.0.6" y "3d8a5c66883a16a30ca8643e851f19baa7797917" [];
        "fast-levenshtein@^2.0.6" = s."fast-levenshtein@2.0.6";
        "fast-levenshtein@~2.0.6" = s."fast-levenshtein@2.0.6";
        "fastq@1.11.1" = f "fastq" "1.11.1" y "5d8175aae17db61947f8b162cfc7f63264d22807" [
          (s."reusify@^1.0.4")
          ];
        "fastq@^1.6.0" = s."fastq@1.11.1";
        "faye-websocket@0.11.4" = f "faye-websocket" "0.11.4" y "7f0d9275cfdd86a1c963dc8b65fcc451edcbb1da" [
          (s."websocket-driver@>=0.5.1")
          ];
        "faye-websocket@^0.11.3" = s."faye-websocket@0.11.4";
        "fb-watchman@2.0.1" = f "fb-watchman" "2.0.1" y "fc84fb39d2709cf3ff6d743706157bb5708a8a85" [
          (s."bser@2.1.1")
          ];
        "fb-watchman@^2.0.0" = s."fb-watchman@2.0.1";
        "fecha@4.2.1" = f "fecha" "4.2.1" y "0a83ad8f86ef62a091e22bb5a039cd03d23eecce" [];
        "fecha@~4.2.0" = s."fecha@4.2.1";
        "figgy-pudding@3.5.2" = f "figgy-pudding" "3.5.2" y "b4eee8148abb01dcf1d1ac34367d59e12fa61d6e" [];
        "figgy-pudding@^3.5.1" = s."figgy-pudding@3.5.2";
        "figures@1.7.0" = f "figures" "1.7.0" y "cbe1e3affcf1cd44b80cadfed28dc793a9701d2e" [
          (s."escape-string-regexp@^1.0.5")
          (s."object-assign@^4.1.0")
          ];
        "figures@2.0.0" = f "figures" "2.0.0" y "3ab1a2d2a62c8bfb431a0c94cb797a2fce27c962" [
          (s."escape-string-regexp@^1.0.5")
          ];
        "figures@^1.7.0" = s."figures@1.7.0";
        "figures@^2.0.0" = s."figures@2.0.0";
        "file-entry-cache@6.0.1" = f "file-entry-cache" "6.0.1" y "211b2dd9659cb0394b073e7323ac3c933d522027" [
          (s."flat-cache@^3.0.4")
          ];
        "file-entry-cache@^6.0.1" = s."file-entry-cache@6.0.1";
        "file-loader@6.1.1" = f "file-loader" "6.1.1" y "a6f29dfb3f5933a1c350b2dbaa20ac5be0539baa" [
          (s."loader-utils@^2.0.0")
          (s."schema-utils@^3.0.0")
          ];
        "file-uri-to-path@1.0.0" = f "file-uri-to-path" "1.0.0" y "553a7b8446ff6f684359c445f1e37a05dacc33dd" [];
        "filesize@6.1.0" = f "filesize" "6.1.0" y "e81bdaa780e2451d714d71c0d7a4f3238d37ad00" [];
        "fill-range@4.0.0" = f "fill-range" "4.0.0" y "d544811d428f98eb06a63dc402d2403c328c38f7" [
          (s."extend-shallow@^2.0.1")
          (s."is-number@^3.0.0")
          (s."repeat-string@^1.6.1")
          (s."to-regex-range@^2.1.0")
          ];
        "fill-range@7.0.1" = f "fill-range" "7.0.1" y "1919a6a7c75fe38b2c7c77e5198535da9acdda40" [
          (s."to-regex-range@^5.0.1")
          ];
        "fill-range@^4.0.0" = s."fill-range@4.0.0";
        "fill-range@^7.0.1" = s."fill-range@7.0.1";
        "filter-obj@1.1.0" = f "filter-obj" "1.1.0" y "9b311112bc6c6127a16e016c6c5d7f19e0805c5b" [];
        "filter-obj@^1.1.0" = s."filter-obj@1.1.0";
        "finalhandler@1.1.2" = f "finalhandler" "1.1.2" y "b7e7d000ffd11938d0fdb053506f6ebabe9f587d" [
          (s."debug@2.6.9")
          (s."encodeurl@~1.0.2")
          (s."escape-html@~1.0.3")
          (s."on-finished@~2.3.0")
          (s."parseurl@~1.3.3")
          (s."statuses@~1.5.0")
          (s."unpipe@~1.0.0")
          ];
        "finalhandler@~1.1.2" = s."finalhandler@1.1.2";
        "find-cache-dir@2.1.0" = f "find-cache-dir" "2.1.0" y "8d0f94cd13fe43c6c7c261a0d86115ca918c05f7" [
          (s."commondir@^1.0.1")
          (s."make-dir@^2.0.0")
          (s."pkg-dir@^3.0.0")
          ];
        "find-cache-dir@3.3.1" = f "find-cache-dir" "3.3.1" y "89b33fad4a4670daa94f855f7fbe31d6d84fe880" [
          (s."commondir@^1.0.1")
          (s."make-dir@^3.0.2")
          (s."pkg-dir@^4.1.0")
          ];
        "find-cache-dir@^2.1.0" = s."find-cache-dir@2.1.0";
        "find-cache-dir@^3.3.1" = s."find-cache-dir@3.3.1";
        "find-up@2.1.0" = f "find-up" "2.1.0" y "45d1b7e506c717ddd482775a2b77920a3c0c57a7" [
          (s."locate-path@^2.0.0")
          ];
        "find-up@3.0.0" = f "find-up" "3.0.0" y "49169f1d7993430646da61ecc5ae355c21c97b73" [
          (s."locate-path@^3.0.0")
          ];
        "find-up@4.1.0" = f "find-up" "4.1.0" y "97afe7d6cdc0bc5928584b7c8d7b16e8a9aa5d19" [
          (s."locate-path@^5.0.0")
          (s."path-exists@^4.0.0")
          ];
        "find-up@^2.0.0" = s."find-up@2.1.0";
        "find-up@^2.1.0" = s."find-up@2.1.0";
        "find-up@^3.0.0" = s."find-up@3.0.0";
        "find-up@^4.0.0" = s."find-up@4.1.0";
        "find-up@^4.1.0" = s."find-up@4.1.0";
        "flat-cache@3.0.4" = f "flat-cache" "3.0.4" y "61b0338302b2fe9f957dcc32fc2a87f1c3048b11" [
          (s."flatted@^3.1.0")
          (s."rimraf@^3.0.2")
          ];
        "flat-cache@^3.0.4" = s."flat-cache@3.0.4";
        "flatted@3.2.2" = f "flatted" "3.2.2" y "64bfed5cb68fe3ca78b3eb214ad97b63bedce561" [];
        "flatted@^3.1.0" = s."flatted@3.2.2";
        "flatten@1.0.3" = f "flatten" "1.0.3" y "c1283ac9f27b368abc1e36d1ff7b04501a30356b" [];
        "flatten@^1.0.2" = s."flatten@1.0.3";
        "flush-write-stream@1.1.1" = f "flush-write-stream" "1.1.1" y "8dd7d873a1babc207d94ead0c2e0e44276ebf2e8" [
          (s."inherits@^2.0.3")
          (s."readable-stream@^2.3.6")
          ];
        "flush-write-stream@^1.0.0" = s."flush-write-stream@1.1.1";
        "follow-redirects@1.14.1" = f "follow-redirects" "1.14.1" y "d9114ded0a1cfdd334e164e6662ad02bfd91ff43" [];
        "follow-redirects@^1.0.0" = s."follow-redirects@1.14.1";
        "for-each@0.3.3" = f "for-each" "0.3.3" y "69b447e88a0a5d32c3e7084f3f1710034b21376e" [
          (s."is-callable@^1.1.3")
          ];
        "for-each@^0.3.3" = s."for-each@0.3.3";
        "for-in@1.0.2" = f "for-in" "1.0.2" y "81068d295a8142ec0ac726c6e2200c30fb6d5e80" [];
        "for-in@^1.0.2" = s."for-in@1.0.2";
        "fork-ts-checker-webpack-plugin@4.1.6" = f "fork-ts-checker-webpack-plugin" "4.1.6" y "5055c703febcf37fa06405d400c122b905167fc5" [
          (s."@babel/code-frame@^7.5.5")
          (s."chalk@^2.4.1")
          (s."micromatch@^3.1.10")
          (s."minimatch@^3.0.4")
          (s."semver@^5.6.0")
          (s."tapable@^1.0.0")
          (s."worker-rpc@^0.1.0")
          ];
        "form-data@3.0.1" = f "form-data" "3.0.1" y "ebd53791b78356a99af9a300d4282c4d5eb9755f" [
          (s."asynckit@^0.4.0")
          (s."combined-stream@^1.0.8")
          (s."mime-types@^2.1.12")
          ];
        "form-data@^3.0.0" = s."form-data@3.0.1";
        "forwarded@0.2.0" = f "forwarded" "0.2.0" y "2269936428aad4c15c7ebe9779a84bf0b2a81811" [];
        "fragment-cache@0.2.1" = f "fragment-cache" "0.2.1" y "4290fad27f13e89be7f33799c6bc5a0abfff0d19" [
          (s."map-cache@^0.2.2")
          ];
        "fragment-cache@^0.2.1" = s."fragment-cache@0.2.1";
        "fresh@0.5.2" = f "fresh" "0.5.2" y "3d8cadd90d976569fa835ab1f8e4b23a105605a7" [];
        "from2@2.3.0" = f "from2" "2.3.0" y "8bfb5502bde4a4d36cfdeea007fcca21d7e382af" [
          (s."inherits@^2.0.1")
          (s."readable-stream@^2.0.0")
          ];
        "from2@^2.1.0" = s."from2@2.3.0";
        "fs-extra@7.0.1" = f "fs-extra" "7.0.1" y "4f189c44aa123b895f722804f55ea23eadc348e9" [
          (s."graceful-fs@^4.1.2")
          (s."jsonfile@^4.0.0")
          (s."universalify@^0.1.0")
          ];
        "fs-extra@8.1.0" = f "fs-extra" "8.1.0" y "49d43c45a88cd9677668cb7be1b46efdb8d2e1c0" [
          (s."graceful-fs@^4.2.0")
          (s."jsonfile@^4.0.0")
          (s."universalify@^0.1.0")
          ];
        "fs-extra@9.1.0" = f "fs-extra" "9.1.0" y "5954460c764a8da2094ba3554bf839e6b9a7c86d" [
          (s."at-least-node@^1.0.0")
          (s."graceful-fs@^4.2.0")
          (s."jsonfile@^6.0.1")
          (s."universalify@^2.0.0")
          ];
        "fs-extra@^7.0.0" = s."fs-extra@7.0.1";
        "fs-extra@^8.1" = s."fs-extra@8.1.0";
        "fs-extra@^8.1.0" = s."fs-extra@8.1.0";
        "fs-extra@^9.0" = s."fs-extra@9.1.0";
        "fs-extra@^9.0.1" = s."fs-extra@9.1.0";
        "fs-minipass@2.1.0" = f "fs-minipass" "2.1.0" y "7f5036fdbf12c63c169190cbe4199c852271f9fb" [
          (s."minipass@^3.0.0")
          ];
        "fs-minipass@^2.0.0" = s."fs-minipass@2.1.0";
        "fs-write-stream-atomic@1.0.10" = f "fs-write-stream-atomic" "1.0.10" y "b47df53493ef911df75731e70a9ded0189db40c9" [
          (s."graceful-fs@^4.1.2")
          (s."iferr@^0.1.5")
          (s."imurmurhash@^0.1.4")
          (s."readable-stream@1 || 2")
          ];
        "fs-write-stream-atomic@^1.0.8" = s."fs-write-stream-atomic@1.0.10";
        "fs.realpath@1.0.0" = f "fs.realpath" "1.0.0" y "1504ad2523158caa40db4a2787cb01411994ea4f" [];
        "fs.realpath@^1.0.0" = s."fs.realpath@1.0.0";
        "fsevents@1.2.13" = f "fsevents" "1.2.13" y "f325cb0455592428bcf11b383370ef70e3bfcc38" [
          (s."bindings@^1.5.0")
          (s."nan@^2.12.1")
          ];
        "fsevents@2.3.2" = f "fsevents" "2.3.2" y "8a526f78b8fdf4623b709e0b975c52c24c02fd1a" [];
        "fsevents@^1.2.7" = s."fsevents@1.2.13";
        "fsevents@^2.1.2" = s."fsevents@2.3.2";
        "fsevents@^2.1.3" = s."fsevents@2.3.2";
        "fsevents@~2.3.2" = s."fsevents@2.3.2";
        "function-bind@1.1.1" = f "function-bind" "1.1.1" y "a56899d3ea3c9bab874bb9773b7c5ede92f4895d" [];
        "function-bind@^1.1.1" = s."function-bind@1.1.1";
        "functional-red-black-tree@1.0.1" = f "functional-red-black-tree" "1.0.1" y "1b0ab3bd553b2a0d6399d29c0e3ea0b252078327" [];
        "functional-red-black-tree@^1.0.1" = s."functional-red-black-tree@1.0.1";
        "gaze@1.1.3" = f "gaze" "1.1.3" y "c441733e13b927ac8c0ff0b4c3b033f28812924a" [
          (s."globule@^1.0.0")
          ];
        "gensync@1.0.0-beta.2" = f "gensync" "1.0.0-beta.2" y "32a6ee76c3d7f52d46b2b1ae5d93fea8580a25e0" [];
        "gensync@^1.0.0-beta.1" = s."gensync@1.0.0-beta.2";
        "gensync@^1.0.0-beta.2" = s."gensync@1.0.0-beta.2";
        "get-caller-file@2.0.5" = f "get-caller-file" "2.0.5" y "4f94412a82db32f36e3b0b9741f8a97feb031f7e" [];
        "get-caller-file@^2.0.1" = s."get-caller-file@2.0.5";
        "get-intrinsic@1.1.1" = f "get-intrinsic" "1.1.1" y "15f59f376f855c446963948f0d24cd3637b4abc6" [
          (s."function-bind@^1.1.1")
          (s."has@^1.0.3")
          (s."has-symbols@^1.0.1")
          ];
        "get-intrinsic@^1.0.2" = s."get-intrinsic@1.1.1";
        "get-intrinsic@^1.1.0" = s."get-intrinsic@1.1.1";
        "get-intrinsic@^1.1.1" = s."get-intrinsic@1.1.1";
        "get-own-enumerable-property-symbols@3.0.2" = f "get-own-enumerable-property-symbols" "3.0.2" y "b5fde77f22cbe35f390b4e089922c50bce6ef664" [];
        "get-own-enumerable-property-symbols@^3.0.0" = s."get-own-enumerable-property-symbols@3.0.2";
        "get-package-type@0.1.0" = f "get-package-type" "0.1.0" y "8de2d803cff44df3bc6c456e6668b36c3926e11a" [];
        "get-package-type@^0.1.0" = s."get-package-type@0.1.0";
        "get-stream@4.1.0" = f "get-stream" "4.1.0" y "c1b255575f3dc21d59bfc79cd3d2b46b1c3a54b5" [
          (s."pump@^3.0.0")
          ];
        "get-stream@5.2.0" = f "get-stream" "5.2.0" y "4966a1795ee5ace65e706c4b7beb71257d6e22d3" [
          (s."pump@^3.0.0")
          ];
        "get-stream@^4.0.0" = s."get-stream@4.1.0";
        "get-stream@^5.0.0" = s."get-stream@5.2.0";
        "get-value@2.0.6" = f "get-value" "2.0.6" y "dc15ca1c672387ca76bd37ac0a395ba2042a2c28" [];
        "get-value@^2.0.3" = s."get-value@2.0.6";
        "get-value@^2.0.6" = s."get-value@2.0.6";
        "git-parse@1.0.4" = f "git-parse" "1.0.4" y "d8687e3b5729c2c9ae8f7231eb03d8862d029966" [
          (s."byline@5.0.0")
          (s."util.promisify@1.0.1")
          ];
        "git-rev-sync@3.0.1" = f "git-rev-sync" "3.0.1" y "a393a97f2e4b2a0cc41e512b48065e64f4d8ca3a" [
          (s."escape-string-regexp@1.0.5")
          (s."graceful-fs@4.1.15")
          (s."shelljs@0.8.4")
          ];
        "git-up@4.0.5" = f "git-up" "4.0.5" y "e7bb70981a37ea2fb8fe049669800a1f9a01d759" [
          (s."is-ssh@^1.3.0")
          (s."parse-url@^6.0.0")
          ];
        "git-up@^4.0.0" = s."git-up@4.0.5";
        "git-url-parse@11.5.0" = f "git-url-parse" "11.5.0" y "acaaf65239cb1536185b19165a24bbc754b3f764" [
          (s."git-up@^4.0.0")
          ];
        "gl-matrix@3.3.0" = f "gl-matrix" "3.3.0" y "232eef60b1c8b30a28cbbe75b2caf6c48fd6358b" [];
        "gl-matrix@^3.0.0" = s."gl-matrix@3.3.0";
        "gl-matrix@^3.1.0" = s."gl-matrix@3.3.0";
        "gl-matrix@^3.3.0" = s."gl-matrix@3.3.0";
        "gl-vec2@1.3.0" = f "gl-vec2" "1.3.0" y "83d472ed46034de8e09cbc857123fb6c81c51199" [];
        "gl-vec2@^1.0.0" = s."gl-vec2@1.3.0";
        "gl-vec2@^1.3.0" = s."gl-vec2@1.3.0";
        "glob-parent@3.1.0" = f "glob-parent" "3.1.0" y "9e6af6299d8d3bd2bd40430832bd113df906c5ae" [
          (s."is-glob@^3.1.0")
          (s."path-dirname@^1.0.0")
          ];
        "glob-parent@5.1.2" = f "glob-parent" "5.1.2" y "869832c58034fe68a4093c17dc15e8340d8401c4" [
          (s."is-glob@^4.0.1")
          ];
        "glob-parent@^3.1.0" = s."glob-parent@3.1.0";
        "glob-parent@^5.1.2" = s."glob-parent@5.1.2";
        "glob-parent@~5.1.2" = s."glob-parent@5.1.2";
        "glob@7.1.7" = f "glob" "7.1.7" y "3b193e9233f01d42d0b3f78294bbeeb418f94a90" [
          (s."fs.realpath@^1.0.0")
          (s."inflight@^1.0.4")
          (s."inherits@2")
          (s."minimatch@^3.0.4")
          (s."once@^1.3.0")
          (s."path-is-absolute@^1.0.0")
          ];
        "glob@7.2.0" = f "glob" "7.2.0" y "d15535af7732e02e948f4c41628bd910293f6023" [
          (s."fs.realpath@^1.0.0")
          (s."inflight@^1.0.4")
          (s."inherits@2")
          (s."minimatch@^3.0.4")
          (s."once@^1.3.0")
          (s."path-is-absolute@^1.0.0")
          ];
        "glob@^7.0.0" = s."glob@7.2.0";
        "glob@^7.0.3" = s."glob@7.1.7";
        "glob@^7.1.1" = s."glob@7.1.7";
        "glob@^7.1.2" = s."glob@7.1.7";
        "glob@^7.1.3" = s."glob@7.1.7";
        "glob@^7.1.4" = s."glob@7.1.7";
        "glob@^7.1.6" = s."glob@7.1.7";
        "glob@~7.1.1" = s."glob@7.1.7";
        "global-agent@2.2.0" = f "global-agent" "2.2.0" y "566331b0646e6bf79429a16877685c4a1fbf76dc" [
          (s."boolean@^3.0.1")
          (s."core-js@^3.6.5")
          (s."es6-error@^4.1.1")
          (s."matcher@^3.0.0")
          (s."roarr@^2.15.3")
          (s."semver@^7.3.2")
          (s."serialize-error@^7.0.1")
          ];
        "global-modules@2.0.0" = f "global-modules" "2.0.0" y "997605ad2345f27f51539bea26574421215c7780" [
          (s."global-prefix@^3.0.0")
          ];
        "global-prefix@3.0.0" = f "global-prefix" "3.0.0" y "fc85f73064df69f50421f47f883fe5b913ba9b97" [
          (s."ini@^1.3.5")
          (s."kind-of@^6.0.2")
          (s."which@^1.3.1")
          ];
        "global-prefix@^3.0.0" = s."global-prefix@3.0.0";
        "globals@11.12.0" = f "globals" "11.12.0" y "ab8795338868a0babd8525758018c2a7eb95c42e" [];
        "globals@13.10.0" = f "globals" "13.10.0" y "60ba56c3ac2ca845cfbf4faeca727ad9dd204676" [
          (s."type-fest@^0.20.2")
          ];
        "globals@^11.1.0" = s."globals@11.12.0";
        "globals@^13.6.0" = s."globals@13.10.0";
        "globals@^13.9.0" = s."globals@13.10.0";
        "globalthis@1.0.2" = f "globalthis" "1.0.2" y "2a235d34f4d8036219f7e34929b5de9e18166b8b" [
          (s."define-properties@^1.1.3")
          ];
        "globalthis@^1.0.1" = s."globalthis@1.0.2";
        "globby@11.0.1" = f "globby" "11.0.1" y "9a2bf107a068f3ffeabc49ad702c79ede8cfd357" [
          (s."array-union@^2.1.0")
          (s."dir-glob@^3.0.1")
          (s."fast-glob@^3.1.1")
          (s."ignore@^5.1.4")
          (s."merge2@^1.3.0")
          (s."slash@^3.0.0")
          ];
        "globby@11.0.4" = f "globby" "11.0.4" y "2cbaff77c2f2a62e71e9b2813a67b97a3a3001a5" [
          (s."array-union@^2.1.0")
          (s."dir-glob@^3.0.1")
          (s."fast-glob@^3.1.1")
          (s."ignore@^5.1.4")
          (s."merge2@^1.3.0")
          (s."slash@^3.0.0")
          ];
        "globby@6.1.0" = f "globby" "6.1.0" y "f5a6d70e8395e21c858fb0489d64df02424d506c" [
          (s."array-union@^1.0.1")
          (s."glob@^7.0.3")
          (s."object-assign@^4.0.1")
          (s."pify@^2.0.0")
          (s."pinkie-promise@^2.0.0")
          ];
        "globby@^11.0.1" = s."globby@11.0.4";
        "globby@^11.0.3" = s."globby@11.0.4";
        "globby@^6.1.0" = s."globby@6.1.0";
        "globule@1.3.3" = f "globule" "1.3.3" y "811919eeac1ab7344e905f2e3be80a13447973c2" [
          (s."glob@~7.1.1")
          (s."lodash@~4.17.10")
          (s."minimatch@~3.0.2")
          ];
        "globule@^1.0.0" = s."globule@1.3.3";
        "graceful-fs@4.1.15" = f "graceful-fs" "4.1.15" y "ffb703e1066e8a0eeaa4c8b80ba9253eeefbfb00" [];
        "graceful-fs@4.2.8" = f "graceful-fs" "4.2.8" y "e412b8d33f5e006593cbd3cee6df9f2cebbe802a" [];
        "graceful-fs@^4.1.11" = s."graceful-fs@4.2.8";
        "graceful-fs@^4.1.15" = s."graceful-fs@4.2.8";
        "graceful-fs@^4.1.2" = s."graceful-fs@4.2.8";
        "graceful-fs@^4.1.6" = s."graceful-fs@4.2.8";
        "graceful-fs@^4.2.0" = s."graceful-fs@4.2.8";
        "graceful-fs@^4.2.4" = s."graceful-fs@4.2.8";
        "graphlib@2.1.8" = f "graphlib" "2.1.8" y "5761d414737870084c92ec7b5dbcb0592c9d35da" [
          (s."lodash@^4.17.15")
          ];
        "graphlib@^2.1.8" = s."graphlib@2.1.8";
        "graphql-tag@2.12.4" = f "graphql-tag" "2.12.4" y "d34066688a4f09e72d6f4663c74211e9b4b7c4bf" [
          (s."tslib@^2.1.0")
          ];
        "graphql-tag@2.12.5" = f "graphql-tag" "2.12.5" y "5cff974a67b417747d05c8d9f5f3cb4495d0db8f" [
          (s."tslib@^2.1.0")
          ];
        "graphql-tag@^2.10.1" = s."graphql-tag@2.12.5";
        "graphql-tag@^2.12.3" = s."graphql-tag@2.12.5";
        "graphql@14.0.2 - 14.2.0 || ^14.3.1 || ^15.0.0" = s."graphql@15.6.0";
        "graphql@15.6.0" = f "graphql" "15.6.0" y "e69323c6a9780a1a4b9ddf7e35ca8904bb04df02" [];
        "graphql@^15.6.0" = s."graphql@15.6.0";
        "growly@1.3.0" = f "growly" "1.3.0" y "f10748cbe76af964b7c96c93c6bcc28af120c081" [];
        "growly@^1.3.0" = s."growly@1.3.0";
        "gzip-size@5.1.1" = f "gzip-size" "5.1.1" y "cb9bee692f87c0612b232840a873904e4c135274" [
          (s."duplexer@^0.1.1")
          (s."pify@^4.0.1")
          ];
        "hammerjs@2.0.8" = f "hammerjs" "2.0.8" y "04ef77862cff2bb79d30f7692095930222bf60f1" [];
        "hammerjs@^2.0.8" = s."hammerjs@2.0.8";
        "handle-thing@2.0.1" = f "handle-thing" "2.0.1" y "857f79ce359580c340d43081cc648970d0bb234e" [];
        "handle-thing@^2.0.0" = s."handle-thing@2.0.1";
        "harmony-reflect@1.6.2" = f "harmony-reflect" "1.6.2" y "31ecbd32e648a34d030d86adb67d4d47547fe710" [];
        "harmony-reflect@^1.4.6" = s."harmony-reflect@1.6.2";
        "has-ansi@2.0.0" = f "has-ansi" "2.0.0" y "34f5049ce1ecdf2b0649af3ef24e45ed35416d91" [
          (s."ansi-regex@^2.0.0")
          ];
        "has-ansi@^2.0.0" = s."has-ansi@2.0.0";
        "has-bigints@1.0.1" = f "has-bigints" "1.0.1" y "64fe6acb020673e3b78db035a5af69aa9d07b113" [];
        "has-bigints@^1.0.1" = s."has-bigints@1.0.1";
        "has-flag@2.0.0" = f "has-flag" "2.0.0" y "e8207af1cc7b30d446cc70b734b5e8be18f88d51" [];
        "has-flag@3.0.0" = f "has-flag" "3.0.0" y "b5d454dc2199ae225699f3467e5a07f3b955bafd" [];
        "has-flag@4.0.0" = f "has-flag" "4.0.0" y "944771fd9c81c81265c4d6941860da06bb59479b" [];
        "has-flag@^2.0.0" = s."has-flag@2.0.0";
        "has-flag@^3.0.0" = s."has-flag@3.0.0";
        "has-flag@^4.0.0" = s."has-flag@4.0.0";
        "has-symbols@1.0.2" = f "has-symbols" "1.0.2" y "165d3070c00309752a1236a479331e3ac56f1423" [];
        "has-symbols@^1.0.1" = s."has-symbols@1.0.2";
        "has-symbols@^1.0.2" = s."has-symbols@1.0.2";
        "has-tostringtag@1.0.0" = f "has-tostringtag" "1.0.0" y "7e133818a7d394734f941e73c3d3f9291e658b25" [
          (s."has-symbols@^1.0.2")
          ];
        "has-tostringtag@^1.0.0" = s."has-tostringtag@1.0.0";
        "has-value@0.3.1" = f "has-value" "0.3.1" y "7b1f58bada62ca827ec0a2078025654845995e1f" [
          (s."get-value@^2.0.3")
          (s."has-values@^0.1.4")
          (s."isobject@^2.0.0")
          ];
        "has-value@1.0.0" = f "has-value" "1.0.0" y "18b281da585b1c5c51def24c930ed29a0be6b177" [
          (s."get-value@^2.0.6")
          (s."has-values@^1.0.0")
          (s."isobject@^3.0.0")
          ];
        "has-value@^0.3.1" = s."has-value@0.3.1";
        "has-value@^1.0.0" = s."has-value@1.0.0";
        "has-values@0.1.4" = f "has-values" "0.1.4" y "6d61de95d91dfca9b9a02089ad384bff8f62b771" [];
        "has-values@1.0.0" = f "has-values" "1.0.0" y "95b0b63fec2146619a6fe57fe75628d5a39efe4f" [
          (s."is-number@^3.0.0")
          (s."kind-of@^4.0.0")
          ];
        "has-values@^0.1.4" = s."has-values@0.1.4";
        "has-values@^1.0.0" = s."has-values@1.0.0";
        "has@1.0.3" = f "has" "1.0.3" y "722d7cbfc1f6aa8241f16dd814e011e1f41e8796" [
          (s."function-bind@^1.1.1")
          ];
        "has@^1.0.0" = s."has@1.0.3";
        "has@^1.0.3" = s."has@1.0.3";
        "hash-base@3.1.0" = f "hash-base" "3.1.0" y "55c381d9e06e1d2997a883b4a3fddfe7f0d3af33" [
          (s."inherits@^2.0.4")
          (s."readable-stream@^3.6.0")
          (s."safe-buffer@^5.2.0")
          ];
        "hash-base@^3.0.0" = s."hash-base@3.1.0";
        "hash.js@1.1.7" = f "hash.js" "1.1.7" y "0babca538e8d4ee4a0f8988d68866537a003cf42" [
          (s."inherits@^2.0.3")
          (s."minimalistic-assert@^1.0.1")
          ];
        "hash.js@^1.0.0" = s."hash.js@1.1.7";
        "hash.js@^1.0.3" = s."hash.js@1.1.7";
        "he@1.2.0" = f "he" "1.2.0" y "84ae65fa7eafb165fddb61566ae14baf05664f0f" [];
        "he@^1.2.0" = s."he@1.2.0";
        "header-case@2.0.4" = f "header-case" "2.0.4" y "5a42e63b55177349cf405beb8d775acabb92c063" [
          (s."capital-case@^1.0.4")
          (s."tslib@^2.0.3")
          ];
        "header-case@^2.0.4" = s."header-case@2.0.4";
        "hex-color-regex@1.1.0" = f "hex-color-regex" "1.1.0" y "4c06fccb4602fe2602b3c93df82d7e7dbf1a8a8e" [];
        "hex-color-regex@^1.1.0" = s."hex-color-regex@1.1.0";
        "history@4.10.1" = f "history" "4.10.1" y "33371a65e3a83b267434e2b3f3b1b4c58aad4cf3" [
          (s."@babel/runtime@^7.1.2")
          (s."loose-envify@^1.2.0")
          (s."resolve-pathname@^3.0.0")
          (s."tiny-invariant@^1.0.2")
          (s."tiny-warning@^1.0.0")
          (s."value-equal@^1.0.1")
          ];
        "history@^4.9.0" = s."history@4.10.1";
        "hmac-drbg@1.0.1" = f "hmac-drbg" "1.0.1" y "d2745701025a6c775a6c545793ed502fc0c649a1" [
          (s."hash.js@^1.0.3")
          (s."minimalistic-assert@^1.0.0")
          (s."minimalistic-crypto-utils@^1.0.1")
          ];
        "hmac-drbg@^1.0.1" = s."hmac-drbg@1.0.1";
        "hoist-non-react-statics@3.3.2" = f "hoist-non-react-statics" "3.3.2" y "ece0acaf71d62c2969c2ec59feff42a4b1a85b45" [
          (s."react-is@^16.7.0")
          ];
        "hoist-non-react-statics@^3.1.0" = s."hoist-non-react-statics@3.3.2";
        "hoist-non-react-statics@^3.3.0" = s."hoist-non-react-statics@3.3.2";
        "hoist-non-react-statics@^3.3.2" = s."hoist-non-react-statics@3.3.2";
        "hoopy@0.1.4" = f "hoopy" "0.1.4" y "609207d661100033a9a9402ad3dea677381c1b1d" [];
        "hoopy@^0.1.4" = s."hoopy@0.1.4";
        "hosted-git-info@2.8.9" = f "hosted-git-info" "2.8.9" y "dffc0bf9a21c02209090f2aa69429e1414daf3f9" [];
        "hosted-git-info@^2.1.4" = s."hosted-git-info@2.8.9";
        "hpack.js@2.1.6" = f "hpack.js" "2.1.6" y "87774c0949e513f42e84575b3c45681fade2a0b2" [
          (s."inherits@^2.0.1")
          (s."obuf@^1.0.0")
          (s."readable-stream@^2.0.1")
          (s."wbuf@^1.1.0")
          ];
        "hpack.js@^2.1.6" = s."hpack.js@2.1.6";
        "hsl-regex@1.0.0" = f "hsl-regex" "1.0.0" y "d49330c789ed819e276a4c0d272dffa30b18fe6e" [];
        "hsl-regex@^1.0.0" = s."hsl-regex@1.0.0";
        "hsla-regex@1.0.0" = f "hsla-regex" "1.0.0" y "c1ce7a3168c8c6614033a4b5f7877f3b225f9c38" [];
        "hsla-regex@^1.0.0" = s."hsla-regex@1.0.0";
        "html-encoding-sniffer@2.0.1" = f "html-encoding-sniffer" "2.0.1" y "42a6dc4fd33f00281176e8b23759ca4e4fa185f3" [
          (s."whatwg-encoding@^1.0.5")
          ];
        "html-encoding-sniffer@^2.0.1" = s."html-encoding-sniffer@2.0.1";
        "html-entities@1.4.0" = f "html-entities" "1.4.0" y "cfbd1b01d2afaf9adca1b10ae7dffab98c71d2dc" [];
        "html-entities@^1.2.1" = s."html-entities@1.4.0";
        "html-entities@^1.3.1" = s."html-entities@1.4.0";
        "html-escaper@2.0.2" = f "html-escaper" "2.0.2" y "dfd60027da36a36dfcbe236262c00a5822681453" [];
        "html-escaper@^2.0.0" = s."html-escaper@2.0.2";
        "html-minifier-terser@5.1.1" = f "html-minifier-terser" "5.1.1" y "922e96f1f3bb60832c2634b79884096389b1f054" [
          (s."camel-case@^4.1.1")
          (s."clean-css@^4.2.3")
          (s."commander@^4.1.1")
          (s."he@^1.2.0")
          (s."param-case@^3.0.3")
          (s."relateurl@^0.2.7")
          (s."terser@^4.6.3")
          ];
        "html-minifier-terser@^5.0.1" = s."html-minifier-terser@5.1.1";
        "html-webpack-plugin@4.5.0" = f "html-webpack-plugin" "4.5.0" y "625097650886b97ea5dae331c320e3238f6c121c" [
          (s."@types/html-minifier-terser@^5.0.0")
          (s."@types/tapable@^1.0.5")
          (s."@types/webpack@^4.41.8")
          (s."html-minifier-terser@^5.0.1")
          (s."loader-utils@^1.2.3")
          (s."lodash@^4.17.15")
          (s."pretty-error@^2.1.1")
          (s."tapable@^1.1.3")
          (s."util.promisify@1.0.0")
          ];
        "htmlparser2@6.1.0" = f "htmlparser2" "6.1.0" y "c4d762b6c3371a05dbe65e94ae43a9f845fb8fb7" [
          (s."domelementtype@^2.0.1")
          (s."domhandler@^4.0.0")
          (s."domutils@^2.5.2")
          (s."entities@^2.0.0")
          ];
        "htmlparser2@^6.1.0" = s."htmlparser2@6.1.0";
        "http-call@5.3.0" = f "http-call" "5.3.0" y "4ded815b13f423de176eb0942d69c43b25b148db" [
          (s."content-type@^1.0.4")
          (s."debug@^4.1.1")
          (s."is-retry-allowed@^1.1.0")
          (s."is-stream@^2.0.0")
          (s."parse-json@^4.0.0")
          (s."tunnel-agent@^0.6.0")
          ];
        "http-call@^5.2.2" = s."http-call@5.3.0";
        "http-deceiver@1.2.7" = f "http-deceiver" "1.2.7" y "fa7168944ab9a519d337cb0bec7284dc3e723d87" [];
        "http-deceiver@^1.2.7" = s."http-deceiver@1.2.7";
        "http-errors@1.6.3" = f "http-errors" "1.6.3" y "8b55680bb4be283a0b5bf4ea2e38580be1d9320d" [
          (s."depd@~1.1.2")
          (s."inherits@2.0.3")
          (s."setprototypeof@1.1.0")
          (s."statuses@>= 1.4.0 < 2")
          ];
        "http-errors@1.7.2" = f "http-errors" "1.7.2" y "4f5029cf13239f31036e5b2e55292bcfbcc85c8f" [
          (s."depd@~1.1.2")
          (s."inherits@2.0.3")
          (s."setprototypeof@1.1.1")
          (s."statuses@>= 1.5.0 < 2")
          (s."toidentifier@1.0.0")
          ];
        "http-errors@1.7.3" = f "http-errors" "1.7.3" y "6c619e4f9c60308c38519498c14fbb10aacebb06" [
          (s."depd@~1.1.2")
          (s."inherits@2.0.4")
          (s."setprototypeof@1.1.1")
          (s."statuses@>= 1.5.0 < 2")
          (s."toidentifier@1.0.0")
          ];
        "http-errors@~1.6.2" = s."http-errors@1.6.3";
        "http-errors@~1.7.2" = s."http-errors@1.7.3";
        "http-parser-js@0.5.3" = f "http-parser-js" "0.5.3" y "01d2709c79d41698bb01d4decc5e9da4e4a033d9" [];
        "http-parser-js@>=0.5.1" = s."http-parser-js@0.5.3";
        "http-proxy-agent@4.0.1" = f "http-proxy-agent" "4.0.1" y "8a8c8ef7f5932ccf953c296ca8291b95aa74aa3a" [
          (s."@tootallnate/once@1")
          (s."agent-base@6")
          (s."debug@4")
          ];
        "http-proxy-agent@^4.0.1" = s."http-proxy-agent@4.0.1";
        "http-proxy-middleware@0.19.1" = f "http-proxy-middleware" "0.19.1" y "183c7dc4aa1479150306498c210cdaf96080a43a" [
          (s."http-proxy@^1.17.0")
          (s."is-glob@^4.0.0")
          (s."lodash@^4.17.11")
          (s."micromatch@^3.1.10")
          ];
        "http-proxy@1.18.1" = f "http-proxy" "1.18.1" y "401541f0534884bbf95260334e72f88ee3976549" [
          (s."eventemitter3@^4.0.0")
          (s."follow-redirects@^1.0.0")
          (s."requires-port@^1.0.0")
          ];
        "http-proxy@^1.17.0" = s."http-proxy@1.18.1";
        "https-browserify@1.0.0" = f "https-browserify" "1.0.0" y "ec06c10e0a34c0f2faf199f7fd7fc78fffd03c73" [];
        "https-browserify@^1.0.0" = s."https-browserify@1.0.0";
        "https-proxy-agent@5.0.0" = f "https-proxy-agent" "5.0.0" y "e2a90542abb68a762e0a0850f6c9edadfd8506b2" [
          (s."agent-base@6")
          (s."debug@4")
          ];
        "https-proxy-agent@^5.0.0" = s."https-proxy-agent@5.0.0";
        "human-signals@1.1.1" = f "human-signals" "1.1.1" y "c5b1cd14f50aeae09ab6c59fe63ba3395fe4dfa3" [];
        "human-signals@^1.1.1" = s."human-signals@1.1.1";
        "husky@7.0.2" = f "husky" "7.0.2" y "21900da0f30199acca43a46c043c4ad84ae88dff" [];
        "husky@^7.0.2" = s."husky@7.0.2";
        "hyperlinker@1.0.0" = f "hyperlinker" "1.0.0" y "23dc9e38a206b208ee49bc2d6c8ef47027df0c0e" [];
        "hyperlinker@^1.0.0" = s."hyperlinker@1.0.0";
        "iconv-lite@0.4.24" = f "iconv-lite" "0.4.24" y "2022b4b25fbddc21d2f524974a474aafe733908b" [
          (s."safer-buffer@>= 2.1.2 < 3")
          ];
        "icss-utils@4.1.1" = f "icss-utils" "4.1.1" y "21170b53789ee27447c2f47dd683081403f9a467" [
          (s."postcss@^7.0.14")
          ];
        "icss-utils@^4.0.0" = s."icss-utils@4.1.1";
        "icss-utils@^4.1.1" = s."icss-utils@4.1.1";
        "identity-obj-proxy@3.0.0" = f "identity-obj-proxy" "3.0.0" y "94d2bda96084453ef36fbc5aaec37e0f79f1fc14" [
          (s."harmony-reflect@^1.4.6")
          ];
        "ieee754@1.2.1" = f "ieee754" "1.2.1" y "8eb7a10a63fff25d15a57b001586d177d1b0d352" [];
        "ieee754@^1.1.4" = s."ieee754@1.2.1";
        "iferr@0.1.5" = f "iferr" "0.1.5" y "c60eed69e6d8fdb6b3104a1fcbca1c192dc5b501" [];
        "iferr@^0.1.5" = s."iferr@0.1.5";
        "ignore@4.0.6" = f "ignore" "4.0.6" y "750e3db5862087b4737ebac8207ffd1ef27b25fc" [];
        "ignore@5.1.8" = f "ignore" "5.1.8" y "f150a8b50a34289b33e22f5889abd4d8016f0e57" [];
        "ignore@^4.0.6" = s."ignore@4.0.6";
        "ignore@^5.1.4" = s."ignore@5.1.8";
        "immer@8.0.1" = f "immer" "8.0.1" y "9c73db683e2b3975c424fb0572af5889877ae656" [];
        "immer@9.0.5" = f "immer" "9.0.5" y "a7154f34fe7064f15f00554cc94c66cc0bf453ec" [];
        "immer@^9.0.1" = s."immer@9.0.5";
        "import-cwd@2.1.0" = f "import-cwd" "2.1.0" y "aa6cf36e722761285cb371ec6519f53e2435b0a9" [
          (s."import-from@^2.1.0")
          ];
        "import-cwd@^2.0.0" = s."import-cwd@2.1.0";
        "import-fresh@2.0.0" = f "import-fresh" "2.0.0" y "d81355c15612d386c61f9ddd3922d4304822a546" [
          (s."caller-path@^2.0.0")
          (s."resolve-from@^3.0.0")
          ];
        "import-fresh@3.3.0" = f "import-fresh" "3.3.0" y "37162c25fcb9ebaa2e6e53d5b4d88ce17d9e0c2b" [
          (s."parent-module@^1.0.0")
          (s."resolve-from@^4.0.0")
          ];
        "import-fresh@^2.0.0" = s."import-fresh@2.0.0";
        "import-fresh@^3.0.0" = s."import-fresh@3.3.0";
        "import-fresh@^3.1.0" = s."import-fresh@3.3.0";
        "import-fresh@^3.2.1" = s."import-fresh@3.3.0";
        "import-from@2.1.0" = f "import-from" "2.1.0" y "335db7f2a7affd53aaa471d4b8021dee36b7f3b1" [
          (s."resolve-from@^3.0.0")
          ];
        "import-from@^2.1.0" = s."import-from@2.1.0";
        "import-local@2.0.0" = f "import-local" "2.0.0" y "55070be38a5993cf18ef6db7e961f5bee5c5a09d" [
          (s."pkg-dir@^3.0.0")
          (s."resolve-cwd@^2.0.0")
          ];
        "import-local@3.0.2" = f "import-local" "3.0.2" y "a8cfd0431d1de4a2199703d003e3e62364fa6db6" [
          (s."pkg-dir@^4.2.0")
          (s."resolve-cwd@^3.0.0")
          ];
        "import-local@^2.0.0" = s."import-local@2.0.0";
        "import-local@^3.0.2" = s."import-local@3.0.2";
        "imurmurhash@0.1.4" = f "imurmurhash" "0.1.4" y "9218b9b2b928a238b13dc4fb6b6d576f231453ea" [];
        "imurmurhash@^0.1.4" = s."imurmurhash@0.1.4";
        "indent-string@3.2.0" = f "indent-string" "3.2.0" y "4a5fd6d27cc332f37e5419a504dbb837105c9289" [];
        "indent-string@4.0.0" = f "indent-string" "4.0.0" y "624f8f4497d619b2d9768531d58f4122854d7251" [];
        "indent-string@^3.0.0" = s."indent-string@3.2.0";
        "indent-string@^3.2.0" = s."indent-string@3.2.0";
        "indent-string@^4.0.0" = s."indent-string@4.0.0";
        "indexes-of@1.0.1" = f "indexes-of" "1.0.1" y "f30f716c8e2bd346c7b67d3df3915566a7c05607" [];
        "indexes-of@^1.0.1" = s."indexes-of@1.0.1";
        "infer-owner@1.0.4" = f "infer-owner" "1.0.4" y "c4cefcaa8e51051c2a40ba2ce8a3d27295af9467" [];
        "infer-owner@^1.0.3" = s."infer-owner@1.0.4";
        "infer-owner@^1.0.4" = s."infer-owner@1.0.4";
        "inflected@2.1.0" = f "inflected" "2.1.0" y "2816ac17a570bbbc8303ca05bca8bf9b3f959687" [];
        "inflected@^2.0.3" = s."inflected@2.1.0";
        "inflight@1.0.6" = f "inflight" "1.0.6" y "49bd6331d7d02d0c09bc910a1075ba8165b56df9" [
          (s."once@^1.3.0")
          (s."wrappy@1")
          ];
        "inflight@^1.0.4" = s."inflight@1.0.6";
        "inherits@2" = s."inherits@2.0.4";
        "inherits@2.0.1" = f "inherits" "2.0.1" y "b17d08d326b4423e568eff719f91b0b1cbdf69f1" [];
        "inherits@2.0.3" = f "inherits" "2.0.3" y "633c2c83e3da42a502f52466022480f4208261de" [];
        "inherits@2.0.4" = f "inherits" "2.0.4" y "0fa2c64f932917c3433a0ded55363aae37416b7c" [];
        "inherits@^2.0.1" = s."inherits@2.0.4";
        "inherits@^2.0.3" = s."inherits@2.0.4";
        "inherits@^2.0.4" = s."inherits@2.0.4";
        "inherits@~2.0.1" = s."inherits@2.0.4";
        "inherits@~2.0.3" = s."inherits@2.0.4";
        "ini@1.3.8" = f "ini" "1.3.8" y "a29da425b48806f34767a4efce397269af28432c" [];
        "ini@^1.3.5" = s."ini@1.3.8";
        "insert-css@2.0.0" = f "insert-css" "2.0.0" y "eb5d1097b7542f4c79ea3060d3aee07d053880f4" [];
        "insert-css@^2.0.0" = s."insert-css@2.0.0";
        "internal-ip@4.3.0" = f "internal-ip" "4.3.0" y "845452baad9d2ca3b69c635a137acb9a0dad0907" [
          (s."default-gateway@^4.2.0")
          (s."ipaddr.js@^1.9.0")
          ];
        "internal-ip@^4.3.0" = s."internal-ip@4.3.0";
        "internal-slot@1.0.3" = f "internal-slot" "1.0.3" y "7347e307deeea2faac2ac6205d4bc7d34967f59c" [
          (s."get-intrinsic@^1.1.0")
          (s."has@^1.0.3")
          (s."side-channel@^1.0.4")
          ];
        "internal-slot@^1.0.3" = s."internal-slot@1.0.3";
        "interpret@1.4.0" = f "interpret" "1.4.0" y "665ab8bc4da27a774a40584e812e3e0fa45b1a1e" [];
        "interpret@^1.0.0" = s."interpret@1.4.0";
        "inversify-inject-decorators@3.1.0" = f "inversify-inject-decorators" "3.1.0" y "d9941080bad77cec8a65ee29d905e4d5d73e1e95" [];
        "inversify-inject-decorators@^3.1.0" = s."inversify-inject-decorators@3.1.0";
        "inversify@5.1.1" = f "inversify" "5.1.1" y "6fbd668c591337404e005a1946bfe0d802c08730" [];
        "inversify@^5.0.1" = s."inversify@5.1.1";
        "ip-regex@2.1.0" = f "ip-regex" "2.1.0" y "fa78bf5d2e6913c911ce9f819ee5146bb6d844e9" [];
        "ip-regex@^2.1.0" = s."ip-regex@2.1.0";
        "ip@1.1.5" = f "ip" "1.1.5" y "bdded70114290828c0a039e72ef25f5aaec4354a" [];
        "ip@^1.1.0" = s."ip@1.1.5";
        "ip@^1.1.5" = s."ip@1.1.5";
        "ipaddr.js@1.9.1" = f "ipaddr.js" "1.9.1" y "bff38543eeb8984825079ff3a2a8e6cbd46781b3" [];
        "ipaddr.js@^1.9.0" = s."ipaddr.js@1.9.1";
        "is-absolute-url@2.1.0" = f "is-absolute-url" "2.1.0" y "50530dfb84fcc9aa7dbe7852e83a37b93b9f2aa6" [];
        "is-absolute-url@3.0.3" = f "is-absolute-url" "3.0.3" y "96c6a22b6a23929b11ea0afb1836c36ad4a5d698" [];
        "is-absolute-url@^2.0.0" = s."is-absolute-url@2.1.0";
        "is-absolute-url@^3.0.3" = s."is-absolute-url@3.0.3";
        "is-accessor-descriptor@0.1.6" = f "is-accessor-descriptor" "0.1.6" y "a9e12cb3ae8d876727eeef3843f8a0897b5c98d6" [
          (s."kind-of@^3.0.2")
          ];
        "is-accessor-descriptor@1.0.0" = f "is-accessor-descriptor" "1.0.0" y "169c2f6d3df1f992618072365c9b0ea1f6878656" [
          (s."kind-of@^6.0.0")
          ];
        "is-accessor-descriptor@^0.1.6" = s."is-accessor-descriptor@0.1.6";
        "is-accessor-descriptor@^1.0.0" = s."is-accessor-descriptor@1.0.0";
        "is-any-array@1.0.0" = f "is-any-array" "1.0.0" y "bcb2c7e2d28aaa2fa02ee8f6b604b0b3a957bba7" [];
        "is-any-array@^1.0.0" = s."is-any-array@1.0.0";
        "is-arguments@1.1.1" = f "is-arguments" "1.1.1" y "15b3f88fda01f2a97fec84ca761a560f123efa9b" [
          (s."call-bind@^1.0.2")
          (s."has-tostringtag@^1.0.0")
          ];
        "is-arguments@^1.0.4" = s."is-arguments@1.1.1";
        "is-arrayish@0.2.1" = f "is-arrayish" "0.2.1" y "77c99840527aa8ecb1a8ba697b80645a7a926a9d" [];
        "is-arrayish@0.3.2" = f "is-arrayish" "0.3.2" y "4574a2ae56f7ab206896fb431eaeed066fdf8f03" [];
        "is-arrayish@^0.2.1" = s."is-arrayish@0.2.1";
        "is-arrayish@^0.3.1" = s."is-arrayish@0.3.2";
        "is-bigint@1.0.2" = f "is-bigint" "1.0.2" y "ffb381442503235ad245ea89e45b3dbff040ee5a" [];
        "is-bigint@^1.0.1" = s."is-bigint@1.0.2";
        "is-binary-path@1.0.1" = f "is-binary-path" "1.0.1" y "75f16642b480f187a711c814161fd3a4a7655898" [
          (s."binary-extensions@^1.0.0")
          ];
        "is-binary-path@2.1.0" = f "is-binary-path" "2.1.0" y "ea1f7f3b80f064236e83470f86c09c254fb45b09" [
          (s."binary-extensions@^2.0.0")
          ];
        "is-binary-path@^1.0.0" = s."is-binary-path@1.0.1";
        "is-binary-path@~2.1.0" = s."is-binary-path@2.1.0";
        "is-boolean-object@1.1.2" = f "is-boolean-object" "1.1.2" y "5c6dc200246dd9321ae4b885a114bb1f75f63719" [
          (s."call-bind@^1.0.2")
          (s."has-tostringtag@^1.0.0")
          ];
        "is-boolean-object@^1.1.0" = s."is-boolean-object@1.1.2";
        "is-buffer@1.1.6" = f "is-buffer" "1.1.6" y "efaa2ea9daa0d7ab2ea13a97b2b8ad51fefbe8be" [];
        "is-buffer@^1.1.5" = s."is-buffer@1.1.6";
        "is-callable@1.2.3" = f "is-callable" "1.2.3" y "8b1e0500b73a1d76c70487636f368e519de8db8e" [];
        "is-callable@1.2.4" = f "is-callable" "1.2.4" y "47301d58dd0259407865547853df6d61fe471945" [];
        "is-callable@^1.1.3" = s."is-callable@1.2.4";
        "is-callable@^1.1.4" = s."is-callable@1.2.3";
        "is-callable@^1.2.3" = s."is-callable@1.2.3";
        "is-ci@2.0.0" = f "is-ci" "2.0.0" y "6bc6334181810e04b5c22b3d589fdca55026404c" [
          (s."ci-info@^2.0.0")
          ];
        "is-ci@^2.0.0" = s."is-ci@2.0.0";
        "is-color-stop@1.1.0" = f "is-color-stop" "1.1.0" y "cfff471aee4dd5c9e158598fbe12967b5cdad345" [
          (s."css-color-names@^0.0.4")
          (s."hex-color-regex@^1.1.0")
          (s."hsl-regex@^1.0.0")
          (s."hsla-regex@^1.0.0")
          (s."rgb-regex@^1.0.1")
          (s."rgba-regex@^1.0.0")
          ];
        "is-color-stop@^1.0.0" = s."is-color-stop@1.1.0";
        "is-core-module@2.5.0" = f "is-core-module" "2.5.0" y "f754843617c70bfd29b7bd87327400cda5c18491" [
          (s."has@^1.0.3")
          ];
        "is-core-module@^2.0.0" = s."is-core-module@2.5.0";
        "is-core-module@^2.2.0" = s."is-core-module@2.5.0";
        "is-core-module@^2.4.0" = s."is-core-module@2.5.0";
        "is-data-descriptor@0.1.4" = f "is-data-descriptor" "0.1.4" y "0b5ee648388e2c860282e793f1856fec3f301b56" [
          (s."kind-of@^3.0.2")
          ];
        "is-data-descriptor@1.0.0" = f "is-data-descriptor" "1.0.0" y "d84876321d0e7add03990406abbbbd36ba9268c7" [
          (s."kind-of@^6.0.0")
          ];
        "is-data-descriptor@^0.1.4" = s."is-data-descriptor@0.1.4";
        "is-data-descriptor@^1.0.0" = s."is-data-descriptor@1.0.0";
        "is-date-object@1.0.5" = f "is-date-object" "1.0.5" y "0841d5536e724c25597bf6ea62e1bd38298df31f" [
          (s."has-tostringtag@^1.0.0")
          ];
        "is-date-object@^1.0.1" = s."is-date-object@1.0.5";
        "is-descriptor@0.1.6" = f "is-descriptor" "0.1.6" y "366d8240dde487ca51823b1ab9f07a10a78251ca" [
          (s."is-accessor-descriptor@^0.1.6")
          (s."is-data-descriptor@^0.1.4")
          (s."kind-of@^5.0.0")
          ];
        "is-descriptor@1.0.2" = f "is-descriptor" "1.0.2" y "3b159746a66604b04f8c81524ba365c5f14d86ec" [
          (s."is-accessor-descriptor@^1.0.0")
          (s."is-data-descriptor@^1.0.0")
          (s."kind-of@^6.0.2")
          ];
        "is-descriptor@^0.1.0" = s."is-descriptor@0.1.6";
        "is-descriptor@^1.0.0" = s."is-descriptor@1.0.2";
        "is-descriptor@^1.0.2" = s."is-descriptor@1.0.2";
        "is-directory@0.3.1" = f "is-directory" "0.3.1" y "61339b6f2475fc772fd9c9d83f5c8575dc154ae1" [];
        "is-directory@^0.3.1" = s."is-directory@0.3.1";
        "is-docker@2.2.1" = f "is-docker" "2.2.1" y "33eeabe23cfe86f14bde4408a02c0cfb853acdaa" [];
        "is-docker@^2.0.0" = s."is-docker@2.2.1";
        "is-extendable@0.1.1" = f "is-extendable" "0.1.1" y "62b110e289a471418e3ec36a617d472e301dfc89" [];
        "is-extendable@1.0.1" = f "is-extendable" "1.0.1" y "a7470f9e426733d81bd81e1155264e3a3507cab4" [
          (s."is-plain-object@^2.0.4")
          ];
        "is-extendable@^0.1.0" = s."is-extendable@0.1.1";
        "is-extendable@^0.1.1" = s."is-extendable@0.1.1";
        "is-extendable@^1.0.1" = s."is-extendable@1.0.1";
        "is-extglob@2.1.1" = f "is-extglob" "2.1.1" y "a88c02535791f02ed37c76a1b9ea9773c833f8c2" [];
        "is-extglob@^2.1.0" = s."is-extglob@2.1.1";
        "is-extglob@^2.1.1" = s."is-extglob@2.1.1";
        "is-fullwidth-code-point@1.0.0" = f "is-fullwidth-code-point" "1.0.0" y "ef9e31386f031a7f0d643af82fde50c457ef00cb" [
          (s."number-is-nan@^1.0.0")
          ];
        "is-fullwidth-code-point@2.0.0" = f "is-fullwidth-code-point" "2.0.0" y "a3b30a5c4f199183167aaab93beefae3ddfb654f" [];
        "is-fullwidth-code-point@3.0.0" = f "is-fullwidth-code-point" "3.0.0" y "f116f8064fe90b3f7844a38997c0b75051269f1d" [];
        "is-fullwidth-code-point@^1.0.0" = s."is-fullwidth-code-point@1.0.0";
        "is-fullwidth-code-point@^2.0.0" = s."is-fullwidth-code-point@2.0.0";
        "is-fullwidth-code-point@^3.0.0" = s."is-fullwidth-code-point@3.0.0";
        "is-generator-fn@2.1.0" = f "is-generator-fn" "2.1.0" y "7d140adc389aaf3011a8f2a2a4cfa6faadffb118" [];
        "is-generator-fn@^2.0.0" = s."is-generator-fn@2.1.0";
        "is-glob@3.1.0" = f "is-glob" "3.1.0" y "7ba5ae24217804ac70707b96922567486cc3e84a" [
          (s."is-extglob@^2.1.0")
          ];
        "is-glob@4.0.1" = f "is-glob" "4.0.1" y "7567dbe9f2f5e2467bc77ab83c4a29482407a5dc" [
          (s."is-extglob@^2.1.1")
          ];
        "is-glob@^3.1.0" = s."is-glob@3.1.0";
        "is-glob@^4.0.0" = s."is-glob@4.0.1";
        "is-glob@^4.0.1" = s."is-glob@4.0.1";
        "is-glob@~4.0.1" = s."is-glob@4.0.1";
        "is-module@1.0.0" = f "is-module" "1.0.0" y "3258fb69f78c14d5b815d664336b4cffb6441591" [];
        "is-module@^1.0.0" = s."is-module@1.0.0";
        "is-negative-zero@2.0.1" = f "is-negative-zero" "2.0.1" y "3de746c18dda2319241a53675908d8f766f11c24" [];
        "is-negative-zero@^2.0.1" = s."is-negative-zero@2.0.1";
        "is-number-object@1.0.6" = f "is-number-object" "1.0.6" y "6a7aaf838c7f0686a50b4553f7e54a96494e89f0" [
          (s."has-tostringtag@^1.0.0")
          ];
        "is-number-object@^1.0.4" = s."is-number-object@1.0.6";
        "is-number@3.0.0" = f "is-number" "3.0.0" y "24fd6201a4782cf50561c810276afc7d12d71195" [
          (s."kind-of@^3.0.2")
          ];
        "is-number@7.0.0" = f "is-number" "7.0.0" y "7535345b896734d5f80c4d06c50955527a14f12b" [];
        "is-number@^3.0.0" = s."is-number@3.0.0";
        "is-number@^7.0.0" = s."is-number@7.0.0";
        "is-obj@1.0.1" = f "is-obj" "1.0.1" y "3e4729ac1f5fde025cd7d83a896dab9f4f67db0f" [];
        "is-obj@2.0.0" = f "is-obj" "2.0.0" y "473fb05d973705e3fd9620545018ca8e22ef4982" [];
        "is-obj@^1.0.1" = s."is-obj@1.0.1";
        "is-obj@^2.0.0" = s."is-obj@2.0.0";
        "is-observable@1.1.0" = f "is-observable" "1.1.0" y "b3e986c8f44de950867cab5403f5a3465005975e" [
          (s."symbol-observable@^1.1.0")
          ];
        "is-observable@^1.1.0" = s."is-observable@1.1.0";
        "is-path-cwd@2.2.0" = f "is-path-cwd" "2.2.0" y "67d43b82664a7b5191fd9119127eb300048a9fdb" [];
        "is-path-cwd@^2.0.0" = s."is-path-cwd@2.2.0";
        "is-path-in-cwd@2.1.0" = f "is-path-in-cwd" "2.1.0" y "bfe2dca26c69f397265a4009963602935a053acb" [
          (s."is-path-inside@^2.1.0")
          ];
        "is-path-in-cwd@^2.0.0" = s."is-path-in-cwd@2.1.0";
        "is-path-inside@2.1.0" = f "is-path-inside" "2.1.0" y "7c9810587d659a40d27bcdb4d5616eab059494b2" [
          (s."path-is-inside@^1.0.2")
          ];
        "is-path-inside@^2.1.0" = s."is-path-inside@2.1.0";
        "is-plain-obj@1.1.0" = f "is-plain-obj" "1.1.0" y "71a50c8429dfca773c92a390a4a03b39fcd51d3e" [];
        "is-plain-obj@^1.0.0" = s."is-plain-obj@1.1.0";
        "is-plain-object@2.0.4" = f "is-plain-object" "2.0.4" y "2c163b3fafb1b606d9d17928f05c2a1c38e07677" [
          (s."isobject@^3.0.1")
          ];
        "is-plain-object@^2.0.3" = s."is-plain-object@2.0.4";
        "is-plain-object@^2.0.4" = s."is-plain-object@2.0.4";
        "is-potential-custom-element-name@1.0.1" = f "is-potential-custom-element-name" "1.0.1" y "171ed6f19e3ac554394edf78caa05784a45bebb5" [];
        "is-potential-custom-element-name@^1.0.1" = s."is-potential-custom-element-name@1.0.1";
        "is-promise@2.2.2" = f "is-promise" "2.2.2" y "39ab959ccbf9a774cf079f7b40c7a26f763135f1" [];
        "is-promise@^2.1.0" = s."is-promise@2.2.2";
        "is-regex@1.1.4" = f "is-regex" "1.1.4" y "eef5663cd59fa4c0ae339505323df6854bb15958" [
          (s."call-bind@^1.0.2")
          (s."has-tostringtag@^1.0.0")
          ];
        "is-regex@^1.0.4" = s."is-regex@1.1.4";
        "is-regex@^1.1.3" = s."is-regex@1.1.4";
        "is-regexp@1.0.0" = f "is-regexp" "1.0.0" y "fd2d883545c46bac5a633e7b9a09e87fa2cb5069" [];
        "is-regexp@^1.0.0" = s."is-regexp@1.0.0";
        "is-resolvable@1.1.0" = f "is-resolvable" "1.1.0" y "fb18f87ce1feb925169c9a407c19318a3206ed88" [];
        "is-resolvable@^1.0.0" = s."is-resolvable@1.1.0";
        "is-retry-allowed@1.2.0" = f "is-retry-allowed" "1.2.0" y "d778488bd0a4666a3be8a1482b9f2baafedea8b4" [];
        "is-retry-allowed@^1.1.0" = s."is-retry-allowed@1.2.0";
        "is-root@2.1.0" = f "is-root" "2.1.0" y "809e18129cf1129644302a4f8544035d51984a9c" [];
        "is-ssh@1.3.3" = f "is-ssh" "1.3.3" y "7f133285ccd7f2c2c7fc897b771b53d95a2b2c7e" [
          (s."protocols@^1.1.0")
          ];
        "is-ssh@^1.3.0" = s."is-ssh@1.3.3";
        "is-stream@1.1.0" = f "is-stream" "1.1.0" y "12d4a3dd4e68e0b79ceb8dbc84173ae80d91ca44" [];
        "is-stream@2.0.1" = f "is-stream" "2.0.1" y "fac1e3d53b97ad5a9d0ae9cef2389f5810a5c077" [];
        "is-stream@^1.1.0" = s."is-stream@1.1.0";
        "is-stream@^2.0.0" = s."is-stream@2.0.1";
        "is-string@1.0.7" = f "is-string" "1.0.7" y "0dd12bf2006f255bb58f695110eff7491eebc0fd" [
          (s."has-tostringtag@^1.0.0")
          ];
        "is-string@^1.0.5" = s."is-string@1.0.7";
        "is-string@^1.0.6" = s."is-string@1.0.7";
        "is-symbol@1.0.4" = f "is-symbol" "1.0.4" y "a6dac93b635b063ca6872236de88910a57af139c" [
          (s."has-symbols@^1.0.2")
          ];
        "is-symbol@^1.0.2" = s."is-symbol@1.0.4";
        "is-symbol@^1.0.3" = s."is-symbol@1.0.4";
        "is-typedarray@1.0.0" = f "is-typedarray" "1.0.0" y "e479c80858df0c1b11ddda6940f96011fcda4a9a" [];
        "is-typedarray@^1.0.0" = s."is-typedarray@1.0.0";
        "is-windows@1.0.2" = f "is-windows" "1.0.2" y "d1850eb9791ecd18e6182ce12a30f396634bb19d" [];
        "is-windows@^1.0.2" = s."is-windows@1.0.2";
        "is-wsl@1.1.0" = f "is-wsl" "1.1.0" y "1f16e4aa22b04d1336b66188a66af3c600c3a66d" [];
        "is-wsl@2.2.0" = f "is-wsl" "2.2.0" y "74a4c76e77ca9fd3f932f290c17ea326cd157271" [
          (s."is-docker@^2.0.0")
          ];
        "is-wsl@^1.1.0" = s."is-wsl@1.1.0";
        "is-wsl@^2.1.1" = s."is-wsl@2.2.0";
        "is-wsl@^2.2.0" = s."is-wsl@2.2.0";
        "isarray@0.0.1" = f "isarray" "0.0.1" y "8a18acfca9a8f4177e09abfc6038939b05d1eedf" [];
        "isarray@1.0.0" = f "isarray" "1.0.0" y "bb935d48582cba168c06834957a54a3e07124f11" [];
        "isarray@^1.0.0" = s."isarray@1.0.0";
        "isarray@~1.0.0" = s."isarray@1.0.0";
        "isexe@2.0.0" = f "isexe" "2.0.0" y "e8fbf374dc556ff8947a10dcb0572d633f2cfa10" [];
        "isexe@^2.0.0" = s."isexe@2.0.0";
        "isobject@2.1.0" = f "isobject" "2.1.0" y "f065561096a3f1da2ef46272f815c840d87e0c89" [
          (s."isarray@1.0.0")
          ];
        "isobject@3.0.1" = f "isobject" "3.0.1" y "4e431e92b11a9731636aa1f9c8d1ccbcfdab78df" [];
        "isobject@^2.0.0" = s."isobject@2.1.0";
        "isobject@^3.0.0" = s."isobject@3.0.1";
        "isobject@^3.0.1" = s."isobject@3.0.1";
        "istanbul-lib-coverage@3.0.0" = f "istanbul-lib-coverage" "3.0.0" y "f5944a37c70b550b02a78a5c3b2055b280cec8ec" [];
        "istanbul-lib-coverage@^3.0.0" = s."istanbul-lib-coverage@3.0.0";
        "istanbul-lib-instrument@4.0.3" = f "istanbul-lib-instrument" "4.0.3" y "873c6fff897450118222774696a3f28902d77c1d" [
          (s."@babel/core@^7.7.5")
          (s."@istanbuljs/schema@^0.1.2")
          (s."istanbul-lib-coverage@^3.0.0")
          (s."semver@^6.3.0")
          ];
        "istanbul-lib-instrument@^4.0.0" = s."istanbul-lib-instrument@4.0.3";
        "istanbul-lib-instrument@^4.0.3" = s."istanbul-lib-instrument@4.0.3";
        "istanbul-lib-report@3.0.0" = f "istanbul-lib-report" "3.0.0" y "7518fe52ea44de372f460a76b5ecda9ffb73d8a6" [
          (s."istanbul-lib-coverage@^3.0.0")
          (s."make-dir@^3.0.0")
          (s."supports-color@^7.1.0")
          ];
        "istanbul-lib-report@^3.0.0" = s."istanbul-lib-report@3.0.0";
        "istanbul-lib-source-maps@4.0.0" = f "istanbul-lib-source-maps" "4.0.0" y "75743ce6d96bb86dc7ee4352cf6366a23f0b1ad9" [
          (s."debug@^4.1.1")
          (s."istanbul-lib-coverage@^3.0.0")
          (s."source-map@^0.6.1")
          ];
        "istanbul-lib-source-maps@^4.0.0" = s."istanbul-lib-source-maps@4.0.0";
        "istanbul-reports@3.0.2" = f "istanbul-reports" "3.0.2" y "d593210e5000683750cb09fc0644e4b6e27fd53b" [
          (s."html-escaper@^2.0.0")
          (s."istanbul-lib-report@^3.0.0")
          ];
        "istanbul-reports@^3.0.2" = s."istanbul-reports@3.0.2";
        "java-properties@1.0.2" = f "java-properties" "1.0.2" y "ccd1fa73907438a5b5c38982269d0e771fe78211" [];
        "java-properties@^1.0.0" = s."java-properties@1.0.2";
        "jest-changed-files@26.6.2" = f "jest-changed-files" "26.6.2" y "f6198479e1cc66f22f9ae1e22acaa0b429c042d0" [
          (s."@jest/types@^26.6.2")
          (s."execa@^4.0.0")
          (s."throat@^5.0.0")
          ];
        "jest-changed-files@^26.6.2" = s."jest-changed-files@26.6.2";
        "jest-circus@26.6.0" = f "jest-circus" "26.6.0" y "7d9647b2e7f921181869faae1f90a2629fd70705" [
          (s."@babel/traverse@^7.1.0")
          (s."@jest/environment@^26.6.0")
          (s."@jest/test-result@^26.6.0")
          (s."@jest/types@^26.6.0")
          (s."@types/babel__traverse@^7.0.4")
          (s."@types/node@*")
          (s."chalk@^4.0.0")
          (s."co@^4.6.0")
          (s."dedent@^0.7.0")
          (s."expect@^26.6.0")
          (s."is-generator-fn@^2.0.0")
          (s."jest-each@^26.6.0")
          (s."jest-matcher-utils@^26.6.0")
          (s."jest-message-util@^26.6.0")
          (s."jest-runner@^26.6.0")
          (s."jest-runtime@^26.6.0")
          (s."jest-snapshot@^26.6.0")
          (s."jest-util@^26.6.0")
          (s."pretty-format@^26.6.0")
          (s."stack-utils@^2.0.2")
          (s."throat@^5.0.0")
          ];
        "jest-cli@26.6.3" = f "jest-cli" "26.6.3" y "43117cfef24bc4cd691a174a8796a532e135e92a" [
          (s."@jest/core@^26.6.3")
          (s."@jest/test-result@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."chalk@^4.0.0")
          (s."exit@^0.1.2")
          (s."graceful-fs@^4.2.4")
          (s."import-local@^3.0.2")
          (s."is-ci@^2.0.0")
          (s."jest-config@^26.6.3")
          (s."jest-util@^26.6.2")
          (s."jest-validate@^26.6.2")
          (s."prompts@^2.0.1")
          (s."yargs@^15.4.1")
          ];
        "jest-cli@^26.6.0" = s."jest-cli@26.6.3";
        "jest-config@26.6.3" = f "jest-config" "26.6.3" y "64f41444eef9eb03dc51d5c53b75c8c71f645349" [
          (s."@babel/core@^7.1.0")
          (s."@jest/test-sequencer@^26.6.3")
          (s."@jest/types@^26.6.2")
          (s."babel-jest@^26.6.3")
          (s."chalk@^4.0.0")
          (s."deepmerge@^4.2.2")
          (s."glob@^7.1.1")
          (s."graceful-fs@^4.2.4")
          (s."jest-environment-jsdom@^26.6.2")
          (s."jest-environment-node@^26.6.2")
          (s."jest-get-type@^26.3.0")
          (s."jest-jasmine2@^26.6.3")
          (s."jest-regex-util@^26.0.0")
          (s."jest-resolve@^26.6.2")
          (s."jest-util@^26.6.2")
          (s."jest-validate@^26.6.2")
          (s."micromatch@^4.0.2")
          (s."pretty-format@^26.6.2")
          ];
        "jest-config@^26.6.3" = s."jest-config@26.6.3";
        "jest-diff@24.9.0" = f "jest-diff" "24.9.0" y "931b7d0d5778a1baf7452cb816e325e3724055da" [
          (s."chalk@^2.0.1")
          (s."diff-sequences@^24.9.0")
          (s."jest-get-type@^24.9.0")
          (s."pretty-format@^24.9.0")
          ];
        "jest-diff@26.6.2" = f "jest-diff" "26.6.2" y "1aa7468b52c3a68d7d5c5fdcdfcd5e49bd164394" [
          (s."chalk@^4.0.0")
          (s."diff-sequences@^26.6.2")
          (s."jest-get-type@^26.3.0")
          (s."pretty-format@^26.6.2")
          ];
        "jest-diff@^24.0.0" = s."jest-diff@24.9.0";
        "jest-diff@^24.3.0" = s."jest-diff@24.9.0";
        "jest-diff@^24.9.0" = s."jest-diff@24.9.0";
        "jest-diff@^26.6.2" = s."jest-diff@26.6.2";
        "jest-docblock@26.0.0" = f "jest-docblock" "26.0.0" y "3e2fa20899fc928cb13bd0ff68bd3711a36889b5" [
          (s."detect-newline@^3.0.0")
          ];
        "jest-docblock@^26.0.0" = s."jest-docblock@26.0.0";
        "jest-each@26.6.2" = f "jest-each" "26.6.2" y "02526438a77a67401c8a6382dfe5999952c167cb" [
          (s."@jest/types@^26.6.2")
          (s."chalk@^4.0.0")
          (s."jest-get-type@^26.3.0")
          (s."jest-util@^26.6.2")
          (s."pretty-format@^26.6.2")
          ];
        "jest-each@^26.6.0" = s."jest-each@26.6.2";
        "jest-each@^26.6.2" = s."jest-each@26.6.2";
        "jest-environment-jsdom@26.6.2" = f "jest-environment-jsdom" "26.6.2" y "78d09fe9cf019a357009b9b7e1f101d23bd1da3e" [
          (s."@jest/environment@^26.6.2")
          (s."@jest/fake-timers@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."jest-mock@^26.6.2")
          (s."jest-util@^26.6.2")
          (s."jsdom@^16.4.0")
          ];
        "jest-environment-jsdom@^26.6.2" = s."jest-environment-jsdom@26.6.2";
        "jest-environment-node@26.6.2" = f "jest-environment-node" "26.6.2" y "824e4c7fb4944646356f11ac75b229b0035f2b0c" [
          (s."@jest/environment@^26.6.2")
          (s."@jest/fake-timers@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."jest-mock@^26.6.2")
          (s."jest-util@^26.6.2")
          ];
        "jest-environment-node@^26.6.2" = s."jest-environment-node@26.6.2";
        "jest-get-type@24.9.0" = f "jest-get-type" "24.9.0" y "1684a0c8a50f2e4901b6644ae861f579eed2ef0e" [];
        "jest-get-type@26.3.0" = f "jest-get-type" "26.3.0" y "e97dc3c3f53c2b406ca7afaed4493b1d099199e0" [];
        "jest-get-type@^24.9.0" = s."jest-get-type@24.9.0";
        "jest-get-type@^26.3.0" = s."jest-get-type@26.3.0";
        "jest-haste-map@26.6.2" = f "jest-haste-map" "26.6.2" y "dd7e60fe7dc0e9f911a23d79c5ff7fb5c2cafeaa" [
          (s."@jest/types@^26.6.2")
          (s."@types/graceful-fs@^4.1.2")
          (s."@types/node@*")
          (s."anymatch@^3.0.3")
          (s."fb-watchman@^2.0.0")
          (s."graceful-fs@^4.2.4")
          (s."jest-regex-util@^26.0.0")
          (s."jest-serializer@^26.6.2")
          (s."jest-util@^26.6.2")
          (s."jest-worker@^26.6.2")
          (s."micromatch@^4.0.2")
          (s."sane@^4.0.3")
          (s."walker@^1.0.7")
          (s."fsevents@^2.1.2")
          ];
        "jest-haste-map@^26.6.2" = s."jest-haste-map@26.6.2";
        "jest-jasmine2@26.6.3" = f "jest-jasmine2" "26.6.3" y "adc3cf915deacb5212c93b9f3547cd12958f2edd" [
          (s."@babel/traverse@^7.1.0")
          (s."@jest/environment@^26.6.2")
          (s."@jest/source-map@^26.6.2")
          (s."@jest/test-result@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."chalk@^4.0.0")
          (s."co@^4.6.0")
          (s."expect@^26.6.2")
          (s."is-generator-fn@^2.0.0")
          (s."jest-each@^26.6.2")
          (s."jest-matcher-utils@^26.6.2")
          (s."jest-message-util@^26.6.2")
          (s."jest-runtime@^26.6.3")
          (s."jest-snapshot@^26.6.2")
          (s."jest-util@^26.6.2")
          (s."pretty-format@^26.6.2")
          (s."throat@^5.0.0")
          ];
        "jest-jasmine2@^26.6.3" = s."jest-jasmine2@26.6.3";
        "jest-leak-detector@26.6.2" = f "jest-leak-detector" "26.6.2" y "7717cf118b92238f2eba65054c8a0c9c653a91af" [
          (s."jest-get-type@^26.3.0")
          (s."pretty-format@^26.6.2")
          ];
        "jest-leak-detector@^26.6.2" = s."jest-leak-detector@26.6.2";
        "jest-matcher-utils@24.9.0" = f "jest-matcher-utils" "24.9.0" y "f5b3661d5e628dffe6dd65251dfdae0e87c3a073" [
          (s."chalk@^2.0.1")
          (s."jest-diff@^24.9.0")
          (s."jest-get-type@^24.9.0")
          (s."pretty-format@^24.9.0")
          ];
        "jest-matcher-utils@26.6.2" = f "jest-matcher-utils" "26.6.2" y "8e6fd6e863c8b2d31ac6472eeb237bc595e53e7a" [
          (s."chalk@^4.0.0")
          (s."jest-diff@^26.6.2")
          (s."jest-get-type@^26.3.0")
          (s."pretty-format@^26.6.2")
          ];
        "jest-matcher-utils@^24.0.0" = s."jest-matcher-utils@24.9.0";
        "jest-matcher-utils@^26.6.0" = s."jest-matcher-utils@26.6.2";
        "jest-matcher-utils@^26.6.2" = s."jest-matcher-utils@26.6.2";
        "jest-message-util@26.6.2" = f "jest-message-util" "26.6.2" y "58173744ad6fc0506b5d21150b9be56ef001ca07" [
          (s."@babel/code-frame@^7.0.0")
          (s."@jest/types@^26.6.2")
          (s."@types/stack-utils@^2.0.0")
          (s."chalk@^4.0.0")
          (s."graceful-fs@^4.2.4")
          (s."micromatch@^4.0.2")
          (s."pretty-format@^26.6.2")
          (s."slash@^3.0.0")
          (s."stack-utils@^2.0.2")
          ];
        "jest-message-util@^26.6.0" = s."jest-message-util@26.6.2";
        "jest-message-util@^26.6.2" = s."jest-message-util@26.6.2";
        "jest-mock@26.6.2" = f "jest-mock" "26.6.2" y "d6cb712b041ed47fe0d9b6fc3474bc6543feb302" [
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          ];
        "jest-mock@^26.6.2" = s."jest-mock@26.6.2";
        "jest-pnp-resolver@1.2.2" = f "jest-pnp-resolver" "1.2.2" y "b704ac0ae028a89108a4d040b3f919dfddc8e33c" [];
        "jest-pnp-resolver@^1.2.2" = s."jest-pnp-resolver@1.2.2";
        "jest-regex-util@26.0.0" = f "jest-regex-util" "26.0.0" y "d25e7184b36e39fd466c3bc41be0971e821fee28" [];
        "jest-regex-util@^26.0.0" = s."jest-regex-util@26.0.0";
        "jest-resolve-dependencies@26.6.3" = f "jest-resolve-dependencies" "26.6.3" y "6680859ee5d22ee5dcd961fe4871f59f4c784fb6" [
          (s."@jest/types@^26.6.2")
          (s."jest-regex-util@^26.0.0")
          (s."jest-snapshot@^26.6.2")
          ];
        "jest-resolve-dependencies@^26.6.3" = s."jest-resolve-dependencies@26.6.3";
        "jest-resolve@26.6.0" = f "jest-resolve" "26.6.0" y "070fe7159af87b03e50f52ea5e17ee95bbee40e1" [
          (s."@jest/types@^26.6.0")
          (s."chalk@^4.0.0")
          (s."graceful-fs@^4.2.4")
          (s."jest-pnp-resolver@^1.2.2")
          (s."jest-util@^26.6.0")
          (s."read-pkg-up@^7.0.1")
          (s."resolve@^1.17.0")
          (s."slash@^3.0.0")
          ];
        "jest-resolve@26.6.2" = f "jest-resolve" "26.6.2" y "a3ab1517217f469b504f1b56603c5bb541fbb507" [
          (s."@jest/types@^26.6.2")
          (s."chalk@^4.0.0")
          (s."graceful-fs@^4.2.4")
          (s."jest-pnp-resolver@^1.2.2")
          (s."jest-util@^26.6.2")
          (s."read-pkg-up@^7.0.1")
          (s."resolve@^1.18.1")
          (s."slash@^3.0.0")
          ];
        "jest-resolve@^26.6.2" = s."jest-resolve@26.6.2";
        "jest-runner@26.6.3" = f "jest-runner" "26.6.3" y "2d1fed3d46e10f233fd1dbd3bfaa3fe8924be159" [
          (s."@jest/console@^26.6.2")
          (s."@jest/environment@^26.6.2")
          (s."@jest/test-result@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."chalk@^4.0.0")
          (s."emittery@^0.7.1")
          (s."exit@^0.1.2")
          (s."graceful-fs@^4.2.4")
          (s."jest-docblock@^26.0.0")
          (s."jest-haste-map@^26.6.2")
          (s."jest-leak-detector@^26.6.2")
          (s."jest-message-util@^26.6.2")
          (s."jest-resolve@^26.6.2")
          (s."jest-runtime@^26.6.3")
          (s."jest-util@^26.6.2")
          (s."jest-worker@^26.6.2")
          (s."source-map-support@^0.5.6")
          (s."throat@^5.0.0")
          ];
        "jest-runner@^26.6.0" = s."jest-runner@26.6.3";
        "jest-runner@^26.6.3" = s."jest-runner@26.6.3";
        "jest-runtime@26.6.3" = f "jest-runtime" "26.6.3" y "4f64efbcfac398331b74b4b3c82d27d401b8fa2b" [
          (s."@jest/console@^26.6.2")
          (s."@jest/environment@^26.6.2")
          (s."@jest/fake-timers@^26.6.2")
          (s."@jest/globals@^26.6.2")
          (s."@jest/source-map@^26.6.2")
          (s."@jest/test-result@^26.6.2")
          (s."@jest/transform@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/yargs@^15.0.0")
          (s."chalk@^4.0.0")
          (s."cjs-module-lexer@^0.6.0")
          (s."collect-v8-coverage@^1.0.0")
          (s."exit@^0.1.2")
          (s."glob@^7.1.3")
          (s."graceful-fs@^4.2.4")
          (s."jest-haste-map@^26.6.2")
          (s."jest-message-util@^26.6.2")
          (s."jest-mock@^26.6.2")
          (s."jest-regex-util@^26.0.0")
          (s."jest-resolve@^26.6.2")
          (s."jest-snapshot@^26.6.2")
          (s."jest-util@^26.6.2")
          (s."jest-validate@^26.6.2")
          (s."slash@^3.0.0")
          (s."strip-bom@^4.0.0")
          (s."yargs@^15.4.1")
          ];
        "jest-runtime@^26.6.0" = s."jest-runtime@26.6.3";
        "jest-runtime@^26.6.3" = s."jest-runtime@26.6.3";
        "jest-serializer@26.6.2" = f "jest-serializer" "26.6.2" y "d139aafd46957d3a448f3a6cdabe2919ba0742d1" [
          (s."@types/node@*")
          (s."graceful-fs@^4.2.4")
          ];
        "jest-serializer@^26.6.2" = s."jest-serializer@26.6.2";
        "jest-snapshot@26.6.2" = f "jest-snapshot" "26.6.2" y "f3b0af1acb223316850bd14e1beea9837fb39c84" [
          (s."@babel/types@^7.0.0")
          (s."@jest/types@^26.6.2")
          (s."@types/babel__traverse@^7.0.4")
          (s."@types/prettier@^2.0.0")
          (s."chalk@^4.0.0")
          (s."expect@^26.6.2")
          (s."graceful-fs@^4.2.4")
          (s."jest-diff@^26.6.2")
          (s."jest-get-type@^26.3.0")
          (s."jest-haste-map@^26.6.2")
          (s."jest-matcher-utils@^26.6.2")
          (s."jest-message-util@^26.6.2")
          (s."jest-resolve@^26.6.2")
          (s."natural-compare@^1.4.0")
          (s."pretty-format@^26.6.2")
          (s."semver@^7.3.2")
          ];
        "jest-snapshot@^26.6.0" = s."jest-snapshot@26.6.2";
        "jest-snapshot@^26.6.2" = s."jest-snapshot@26.6.2";
        "jest-util@26.6.2" = f "jest-util" "26.6.2" y "907535dbe4d5a6cb4c47ac9b926f6af29576cbc1" [
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."chalk@^4.0.0")
          (s."graceful-fs@^4.2.4")
          (s."is-ci@^2.0.0")
          (s."micromatch@^4.0.2")
          ];
        "jest-util@^26.6.0" = s."jest-util@26.6.2";
        "jest-util@^26.6.2" = s."jest-util@26.6.2";
        "jest-validate@26.6.2" = f "jest-validate" "26.6.2" y "23d380971587150467342911c3d7b4ac57ab20ec" [
          (s."@jest/types@^26.6.2")
          (s."camelcase@^6.0.0")
          (s."chalk@^4.0.0")
          (s."jest-get-type@^26.3.0")
          (s."leven@^3.1.0")
          (s."pretty-format@^26.6.2")
          ];
        "jest-validate@^26.6.2" = s."jest-validate@26.6.2";
        "jest-watch-typeahead@0.6.1" = f "jest-watch-typeahead" "0.6.1" y "45221b86bb6710b7e97baaa1640ae24a07785e63" [
          (s."ansi-escapes@^4.3.1")
          (s."chalk@^4.0.0")
          (s."jest-regex-util@^26.0.0")
          (s."jest-watcher@^26.3.0")
          (s."slash@^3.0.0")
          (s."string-length@^4.0.1")
          (s."strip-ansi@^6.0.0")
          ];
        "jest-watcher@26.6.2" = f "jest-watcher" "26.6.2" y "a5b683b8f9d68dbcb1d7dae32172d2cca0592975" [
          (s."@jest/test-result@^26.6.2")
          (s."@jest/types@^26.6.2")
          (s."@types/node@*")
          (s."ansi-escapes@^4.2.1")
          (s."chalk@^4.0.0")
          (s."jest-util@^26.6.2")
          (s."string-length@^4.0.1")
          ];
        "jest-watcher@^26.3.0" = s."jest-watcher@26.6.2";
        "jest-watcher@^26.6.2" = s."jest-watcher@26.6.2";
        "jest-worker@24.9.0" = f "jest-worker" "24.9.0" y "5dbfdb5b2d322e98567898238a9697bcce67b3e5" [
          (s."merge-stream@^2.0.0")
          (s."supports-color@^6.1.0")
          ];
        "jest-worker@26.6.2" = f "jest-worker" "26.6.2" y "7f72cbc4d643c365e27b9fd775f9d0eaa9c7a8ed" [
          (s."@types/node@*")
          (s."merge-stream@^2.0.0")
          (s."supports-color@^7.0.0")
          ];
        "jest-worker@^24.9.0" = s."jest-worker@24.9.0";
        "jest-worker@^26.5.0" = s."jest-worker@26.6.2";
        "jest-worker@^26.6.2" = s."jest-worker@26.6.2";
        "jest@26.6.0" = f "jest" "26.6.0" y "546b25a1d8c888569dbbe93cae131748086a4a25" [
          (s."@jest/core@^26.6.0")
          (s."import-local@^3.0.2")
          (s."jest-cli@^26.6.0")
          ];
        "js-tokens@4.0.0" = f "js-tokens" "4.0.0" y "19203fb59991df98e3a287050d4647cdeaf32499" [];
        "js-tokens@^3.0.0 || ^4.0.0" = s."js-tokens@4.0.0";
        "js-tokens@^4.0.0" = s."js-tokens@4.0.0";
        "js-yaml@3.14.1" = f "js-yaml" "3.14.1" y "dae812fdb3825fa306609a8717383c50c36a0537" [
          (s."argparse@^1.0.7")
          (s."esprima@^4.0.0")
          ];
        "js-yaml@^3.13.1" = s."js-yaml@3.14.1";
        "jsdom@16.7.0" = f "jsdom" "16.7.0" y "918ae71965424b197c819f8183a754e18977b710" [
          (s."abab@^2.0.5")
          (s."acorn@^8.2.4")
          (s."acorn-globals@^6.0.0")
          (s."cssom@^0.4.4")
          (s."cssstyle@^2.3.0")
          (s."data-urls@^2.0.0")
          (s."decimal.js@^10.2.1")
          (s."domexception@^2.0.1")
          (s."escodegen@^2.0.0")
          (s."form-data@^3.0.0")
          (s."html-encoding-sniffer@^2.0.1")
          (s."http-proxy-agent@^4.0.1")
          (s."https-proxy-agent@^5.0.0")
          (s."is-potential-custom-element-name@^1.0.1")
          (s."nwsapi@^2.2.0")
          (s."parse5@6.0.1")
          (s."saxes@^5.0.1")
          (s."symbol-tree@^3.2.4")
          (s."tough-cookie@^4.0.0")
          (s."w3c-hr-time@^1.0.2")
          (s."w3c-xmlserializer@^2.0.0")
          (s."webidl-conversions@^6.1.0")
          (s."whatwg-encoding@^1.0.5")
          (s."whatwg-mimetype@^2.3.0")
          (s."whatwg-url@^8.5.0")
          (s."ws@^7.4.6")
          (s."xml-name-validator@^3.0.0")
          ];
        "jsdom@^16.4.0" = s."jsdom@16.7.0";
        "jsesc@0.5.0" = f "jsesc" "0.5.0" y "e7dee66e35d6fc16f710fe91d5cf69f70f08911d" [];
        "jsesc@2.5.2" = f "jsesc" "2.5.2" y "80564d2e483dacf6e8ef209650a67df3f0c283a4" [];
        "jsesc@^2.5.1" = s."jsesc@2.5.2";
        "jsesc@~0.5.0" = s."jsesc@0.5.0";
        "json-parse-better-errors@1.0.2" = f "json-parse-better-errors" "1.0.2" y "bb867cfb3450e69107c131d1c514bab3dc8bcaa9" [];
        "json-parse-better-errors@^1.0.1" = s."json-parse-better-errors@1.0.2";
        "json-parse-better-errors@^1.0.2" = s."json-parse-better-errors@1.0.2";
        "json-parse-even-better-errors@2.3.1" = f "json-parse-even-better-errors" "2.3.1" y "7c47805a94319928e05777405dc12e1f7a4ee02d" [];
        "json-parse-even-better-errors@^2.3.0" = s."json-parse-even-better-errors@2.3.1";
        "json-schema-traverse@0.4.1" = f "json-schema-traverse" "0.4.1" y "69f6a87d9513ab8bb8fe63bdb0979c448e684660" [];
        "json-schema-traverse@1.0.0" = f "json-schema-traverse" "1.0.0" y "ae7bcb3656ab77a73ba5c49bf654f38e6b6860e2" [];
        "json-schema-traverse@^0.4.1" = s."json-schema-traverse@0.4.1";
        "json-schema-traverse@^1.0.0" = s."json-schema-traverse@1.0.0";
        "json-stable-stringify-without-jsonify@1.0.1" = f "json-stable-stringify-without-jsonify" "1.0.1" y "9db7b59496ad3f3cfef30a75142d2d930ad72651" [];
        "json-stable-stringify-without-jsonify@^1.0.1" = s."json-stable-stringify-without-jsonify@1.0.1";
        "json-stringify-safe@5.0.1" = f "json-stringify-safe" "5.0.1" y "1296a2d58fd45f19a0f6ce01d65701e2c735b6eb" [];
        "json-stringify-safe@^5.0.1" = s."json-stringify-safe@5.0.1";
        "json2mq@0.2.0" = f "json2mq" "0.2.0" y "b637bd3ba9eabe122c83e9720483aeb10d2c904a" [
          (s."string-convert@^0.2.0")
          ];
        "json2mq@^0.2.0" = s."json2mq@0.2.0";
        "json3@3.3.3" = f "json3" "3.3.3" y "7fc10e375fc5ae42c4705a5cc0aa6f62be305b81" [];
        "json3@^3.3.3" = s."json3@3.3.3";
        "json5@1.0.1" = f "json5" "1.0.1" y "779fb0018604fa854eacbf6252180d83543e3dbe" [
          (s."minimist@^1.2.0")
          ];
        "json5@2.2.0" = f "json5" "2.2.0" y "2dfefe720c6ba525d9ebd909950f0515316c89a3" [
          (s."minimist@^1.2.5")
          ];
        "json5@^1.0.1" = s."json5@1.0.1";
        "json5@^2.1.2" = s."json5@2.2.0";
        "json5@^2.2.0" = s."json5@2.2.0";
        "jsonfile@4.0.0" = f "jsonfile" "4.0.0" y "8771aae0799b64076b76640fca058f9c10e33ecb" [
          (s."graceful-fs@^4.1.6")
          ];
        "jsonfile@6.1.0" = f "jsonfile" "6.1.0" y "bc55b2634793c679ec6403094eb13698a6ec0aae" [
          (s."universalify@^2.0.0")
          (s."graceful-fs@^4.1.6")
          ];
        "jsonfile@^4.0.0" = s."jsonfile@4.0.0";
        "jsonfile@^6.0.1" = s."jsonfile@6.1.0";
        "jsx-ast-utils@3.2.0" = f "jsx-ast-utils" "3.2.0" y "41108d2cec408c3453c1bbe8a4aae9e1e2bd8f82" [
          (s."array-includes@^3.1.2")
          (s."object.assign@^4.1.2")
          ];
        "jsx-ast-utils@^2.4.1 || ^3.0.0" = s."jsx-ast-utils@3.2.0";
        "jsx-ast-utils@^3.1.0" = s."jsx-ast-utils@3.2.0";
        "killable@1.0.1" = f "killable" "1.0.1" y "4c8ce441187a061c7474fb87ca08e2a638194892" [];
        "killable@^1.0.1" = s."killable@1.0.1";
        "kind-of@3.2.2" = f "kind-of" "3.2.2" y "31ea21a734bab9bbb0f32466d893aea51e4a3c64" [
          (s."is-buffer@^1.1.5")
          ];
        "kind-of@4.0.0" = f "kind-of" "4.0.0" y "20813df3d712928b207378691a45066fae72dd57" [
          (s."is-buffer@^1.1.5")
          ];
        "kind-of@5.1.0" = f "kind-of" "5.1.0" y "729c91e2d857b7a419a1f9aa65685c4c33f5845d" [];
        "kind-of@6.0.3" = f "kind-of" "6.0.3" y "07c05034a6c349fa06e24fa35aa76db4580ce4dd" [];
        "kind-of@^3.0.2" = s."kind-of@3.2.2";
        "kind-of@^3.0.3" = s."kind-of@3.2.2";
        "kind-of@^3.2.0" = s."kind-of@3.2.2";
        "kind-of@^4.0.0" = s."kind-of@4.0.0";
        "kind-of@^5.0.0" = s."kind-of@5.1.0";
        "kind-of@^6.0.0" = s."kind-of@6.0.3";
        "kind-of@^6.0.2" = s."kind-of@6.0.3";
        "kleur@3.0.3" = f "kleur" "3.0.3" y "a79c9ecc86ee1ce3fa6206d1216c501f147fc07e" [];
        "kleur@^3.0.3" = s."kleur@3.0.3";
        "klona@2.0.4" = f "klona" "2.0.4" y "7bb1e3affb0cb8624547ef7e8f6708ea2e39dfc0" [];
        "klona@^2.0.4" = s."klona@2.0.4";
        "language-subtag-registry@0.3.21" = f "language-subtag-registry" "0.3.21" y "04ac218bea46f04cb039084602c6da9e788dd45a" [];
        "language-subtag-registry@~0.3.2" = s."language-subtag-registry@0.3.21";
        "language-tags@1.0.5" = f "language-tags" "1.0.5" y "d321dbc4da30ba8bf3024e040fa5c14661f9193a" [
          (s."language-subtag-registry@~0.3.2")
          ];
        "language-tags@^1.0.5" = s."language-tags@1.0.5";
        "last-call-webpack-plugin@3.0.0" = f "last-call-webpack-plugin" "3.0.0" y "9742df0e10e3cf46e5c0381c2de90d3a7a2d7555" [
          (s."lodash@^4.17.5")
          (s."webpack-sources@^1.1.0")
          ];
        "last-call-webpack-plugin@^3.0.0" = s."last-call-webpack-plugin@3.0.0";
        "leven@3.1.0" = f "leven" "3.1.0" y "77891de834064cccba82ae7842bb6b14a13ed7f2" [];
        "leven@^3.1.0" = s."leven@3.1.0";
        "levn@0.3.0" = f "levn" "0.3.0" y "3b09924edf9f083c0490fdd4c0bc4421e04764ee" [
          (s."prelude-ls@~1.1.2")
          (s."type-check@~0.3.2")
          ];
        "levn@0.4.1" = f "levn" "0.4.1" y "ae4562c007473b932a6200d403268dd2fffc6ade" [
          (s."prelude-ls@^1.2.1")
          (s."type-check@~0.4.0")
          ];
        "levn@^0.4.1" = s."levn@0.4.1";
        "levn@~0.3.0" = s."levn@0.3.0";
        "lines-and-columns@1.1.6" = f "lines-and-columns" "1.1.6" y "1c00c743b433cd0a4e80758f7b64a57440d9ff00" [];
        "lines-and-columns@^1.1.6" = s."lines-and-columns@1.1.6";
        "listr-silent-renderer@1.1.1" = f "listr-silent-renderer" "1.1.1" y "924b5a3757153770bf1a8e3fbf74b8bbf3f9242e" [];
        "listr-silent-renderer@^1.1.1" = s."listr-silent-renderer@1.1.1";
        "listr-update-renderer@0.5.0" = f "listr-update-renderer" "0.5.0" y "4ea8368548a7b8aecb7e06d8c95cb45ae2ede6a2" [
          (s."chalk@^1.1.3")
          (s."cli-truncate@^0.2.1")
          (s."elegant-spinner@^1.0.1")
          (s."figures@^1.7.0")
          (s."indent-string@^3.0.0")
          (s."log-symbols@^1.0.2")
          (s."log-update@^2.3.0")
          (s."strip-ansi@^3.0.1")
          ];
        "listr-update-renderer@^0.5.0" = s."listr-update-renderer@0.5.0";
        "listr-verbose-renderer@0.5.0" = f "listr-verbose-renderer" "0.5.0" y "f1132167535ea4c1261102b9f28dac7cba1e03db" [
          (s."chalk@^2.4.1")
          (s."cli-cursor@^2.1.0")
          (s."date-fns@^1.27.2")
          (s."figures@^2.0.0")
          ];
        "listr-verbose-renderer@^0.5.0" = s."listr-verbose-renderer@0.5.0";
        "listr@0.14.3" = f "listr" "0.14.3" y "2fea909604e434be464c50bddba0d496928fa586" [
          (s."@samverschueren/stream-to-observable@^0.3.0")
          (s."is-observable@^1.1.0")
          (s."is-promise@^2.1.0")
          (s."is-stream@^1.1.0")
          (s."listr-silent-renderer@^1.1.1")
          (s."listr-update-renderer@^0.5.0")
          (s."listr-verbose-renderer@^0.5.0")
          (s."p-map@^2.0.0")
          (s."rxjs@^6.3.3")
          ];
        "load-json-file@4.0.0" = f "load-json-file" "4.0.0" y "2f5f45ab91e33216234fd53adab668eb4ec0993b" [
          (s."graceful-fs@^4.1.2")
          (s."parse-json@^4.0.0")
          (s."pify@^3.0.0")
          (s."strip-bom@^3.0.0")
          ];
        "load-json-file@5.3.0" = f "load-json-file" "5.3.0" y "4d3c1e01fa1c03ea78a60ac7af932c9ce53403f3" [
          (s."graceful-fs@^4.1.15")
          (s."parse-json@^4.0.0")
          (s."pify@^4.0.1")
          (s."strip-bom@^3.0.0")
          (s."type-fest@^0.3.0")
          ];
        "load-json-file@^4.0.0" = s."load-json-file@4.0.0";
        "load-json-file@^5.2.0" = s."load-json-file@5.3.0";
        "loader-runner@2.4.0" = f "loader-runner" "2.4.0" y "ed47066bfe534d7e84c4c7b9998c2a75607d9357" [];
        "loader-runner@^2.4.0" = s."loader-runner@2.4.0";
        "loader-utils@1.2.3" = f "loader-utils" "1.2.3" y "1ff5dc6911c9f0a062531a4c04b609406108c2c7" [
          (s."big.js@^5.2.2")
          (s."emojis-list@^2.0.0")
          (s."json5@^1.0.1")
          ];
        "loader-utils@1.4.0" = f "loader-utils" "1.4.0" y "c579b5e34cb34b1a74edc6c1fb36bfa371d5a613" [
          (s."big.js@^5.2.2")
          (s."emojis-list@^3.0.0")
          (s."json5@^1.0.1")
          ];
        "loader-utils@2.0.0" = f "loader-utils" "2.0.0" y "e4cace5b816d425a166b5f097e10cd12b36064b0" [
          (s."big.js@^5.2.2")
          (s."emojis-list@^3.0.0")
          (s."json5@^2.1.2")
          ];
        "loader-utils@^1.1.0" = s."loader-utils@1.4.0";
        "loader-utils@^1.2.3" = s."loader-utils@1.4.0";
        "loader-utils@^1.4.0" = s."loader-utils@1.4.0";
        "loader-utils@^2.0.0" = s."loader-utils@2.0.0";
        "locate-path@2.0.0" = f "locate-path" "2.0.0" y "2b568b265eec944c6d9c0de9c3dbbbca0354cd8e" [
          (s."p-locate@^2.0.0")
          (s."path-exists@^3.0.0")
          ];
        "locate-path@3.0.0" = f "locate-path" "3.0.0" y "dbec3b3ab759758071b58fe59fc41871af21400e" [
          (s."p-locate@^3.0.0")
          (s."path-exists@^3.0.0")
          ];
        "locate-path@5.0.0" = f "locate-path" "5.0.0" y "1afba396afd676a6d42504d0a67a3a7eb9f62aa0" [
          (s."p-locate@^4.1.0")
          ];
        "locate-path@^2.0.0" = s."locate-path@2.0.0";
        "locate-path@^3.0.0" = s."locate-path@3.0.0";
        "locate-path@^5.0.0" = s."locate-path@5.0.0";
        "lodash._reinterpolate@3.0.0" = f "lodash._reinterpolate" "3.0.0" y "0ccf2d89166af03b3663c796538b75ac6e114d9d" [];
        "lodash._reinterpolate@^3.0.0" = s."lodash._reinterpolate@3.0.0";
        "lodash.clonedeep@4.5.0" = f "lodash.clonedeep" "4.5.0" y "e23f3f9c4f8fbdde872529c1071857a086e5ccef" [];
        "lodash.clonedeep@^4.5.0" = s."lodash.clonedeep@4.5.0";
        "lodash.debounce@4.0.8" = f "lodash.debounce" "4.0.8" y "82d79bff30a67c4005ffd5e2515300ad9ca4d7af" [];
        "lodash.debounce@^4.0.8" = s."lodash.debounce@4.0.8";
        "lodash.get@4.4.2" = f "lodash.get" "4.4.2" y "2d177f652fa31e939b4438d5341499dfa3825e99" [];
        "lodash.get@^4" = s."lodash.get@4.4.2";
        "lodash.identity@3.0.0" = f "lodash.identity" "3.0.0" y "ad7bc6a4e647d79c972e1b80feef7af156267876" [];
        "lodash.memoize@4.1.2" = f "lodash.memoize" "4.1.2" y "bcc6c49a42a2840ed997f323eada5ecd182e0bfe" [];
        "lodash.memoize@^4.1.2" = s."lodash.memoize@4.1.2";
        "lodash.merge@4.6.2" = f "lodash.merge" "4.6.2" y "558aa53b43b661e1925a0afdfa36a9a1085fe57a" [];
        "lodash.merge@^4.6.1" = s."lodash.merge@4.6.2";
        "lodash.merge@^4.6.2" = s."lodash.merge@4.6.2";
        "lodash.pickby@4.6.0" = f "lodash.pickby" "4.6.0" y "7dea21d8c18d7703a27c704c15d3b84a67e33aff" [];
        "lodash.sortby@4.7.0" = f "lodash.sortby" "4.7.0" y "edd14c824e2cc9c1e0b0a1b42bb5210516a42438" [];
        "lodash.sortby@^4.7.0" = s."lodash.sortby@4.7.0";
        "lodash.template@4.5.0" = f "lodash.template" "4.5.0" y "f976195cf3f347d0d5f52483569fe8031ccce8ab" [
          (s."lodash._reinterpolate@^3.0.0")
          (s."lodash.templatesettings@^4.0.0")
          ];
        "lodash.template@^4.4.0" = s."lodash.template@4.5.0";
        "lodash.template@^4.5.0" = s."lodash.template@4.5.0";
        "lodash.templatesettings@4.2.0" = f "lodash.templatesettings" "4.2.0" y "e481310f049d3cf6d47e912ad09313b154f0fb33" [
          (s."lodash._reinterpolate@^3.0.0")
          ];
        "lodash.templatesettings@^4.0.0" = s."lodash.templatesettings@4.2.0";
        "lodash.truncate@4.4.2" = f "lodash.truncate" "4.4.2" y "5a350da0b1113b837ecfffd5812cbe58d6eae193" [];
        "lodash.truncate@^4.4.2" = s."lodash.truncate@4.4.2";
        "lodash.uniq@4.5.0" = f "lodash.uniq" "4.5.0" y "d0225373aeb652adc1bc82e4945339a842754773" [];
        "lodash.uniq@^4.5.0" = s."lodash.uniq@4.5.0";
        "lodash.xorby@4.7.0" = f "lodash.xorby" "4.7.0" y "9c19a6f9f063a6eb53dd03c1b6871799801463d7" [];
        "lodash.xorby@^4.7.0" = s."lodash.xorby@4.7.0";
        "lodash@4.17.21" = f "lodash" "4.17.21" y "679591c564c3bffaae8454cf0b3df370c3d6911c" [];
        "lodash@>=3.5 <5" = s."lodash@4.17.21";
        "lodash@^4.17.11" = s."lodash@4.17.21";
        "lodash@^4.17.13" = s."lodash@4.17.21";
        "lodash@^4.17.14" = s."lodash@4.17.21";
        "lodash@^4.17.15" = s."lodash@4.17.21";
        "lodash@^4.17.19" = s."lodash@4.17.21";
        "lodash@^4.17.20" = s."lodash@4.17.21";
        "lodash@^4.17.21" = s."lodash@4.17.21";
        "lodash@^4.17.5" = s."lodash@4.17.21";
        "lodash@^4.7.0" = s."lodash@4.17.21";
        "lodash@~4.17.10" = s."lodash@4.17.21";
        "log-symbols@1.0.2" = f "log-symbols" "1.0.2" y "376ff7b58ea3086a0f09facc74617eca501e1a18" [
          (s."chalk@^1.0.0")
          ];
        "log-symbols@^1.0.2" = s."log-symbols@1.0.2";
        "log-update@2.3.0" = f "log-update" "2.3.0" y "88328fd7d1ce7938b29283746f0b1bc126b24708" [
          (s."ansi-escapes@^3.0.0")
          (s."cli-cursor@^2.0.0")
          (s."wrap-ansi@^3.0.1")
          ];
        "log-update@^2.3.0" = s."log-update@2.3.0";
        "loglevel@1.7.1" = f "loglevel" "1.7.1" y "005fde2f5e6e47068f935ff28573e125ef72f197" [];
        "loglevel@^1.6.8" = s."loglevel@1.7.1";
        "loose-envify@1.4.0" = f "loose-envify" "1.4.0" y "71ee51fa7be4caec1a63839f7e682d8132d30caf" [
          (s."js-tokens@^3.0.0 || ^4.0.0")
          ];
        "loose-envify@^1.0.0" = s."loose-envify@1.4.0";
        "loose-envify@^1.1.0" = s."loose-envify@1.4.0";
        "loose-envify@^1.2.0" = s."loose-envify@1.4.0";
        "loose-envify@^1.3.1" = s."loose-envify@1.4.0";
        "loose-envify@^1.4.0" = s."loose-envify@1.4.0";
        "lower-case@2.0.2" = f "lower-case" "2.0.2" y "6fa237c63dbdc4a82ca0fd882e4722dc5e634e28" [
          (s."tslib@^2.0.3")
          ];
        "lower-case@^2.0.2" = s."lower-case@2.0.2";
        "lru-cache@5.1.1" = f "lru-cache" "5.1.1" y "1da27e6710271947695daf6848e847f01d84b920" [
          (s."yallist@^3.0.2")
          ];
        "lru-cache@6.0.0" = f "lru-cache" "6.0.0" y "6d6fe6570ebd96aaf90fcad1dafa3b2566db3a94" [
          (s."yallist@^4.0.0")
          ];
        "lru-cache@^5.1.1" = s."lru-cache@5.1.1";
        "lru-cache@^6.0.0" = s."lru-cache@6.0.0";
        "lz-string@1.4.4" = f "lz-string" "1.4.4" y "c0d8eaf36059f705796e1e344811cf4c498d3a26" [];
        "lz-string@^1.4.4" = s."lz-string@1.4.4";
        "magic-string@0.25.7" = f "magic-string" "0.25.7" y "3f497d6fd34c669c6798dcb821f2ef31f5445051" [
          (s."sourcemap-codec@^1.4.4")
          ];
        "magic-string@^0.25.0" = s."magic-string@0.25.7";
        "magic-string@^0.25.7" = s."magic-string@0.25.7";
        "make-dir@2.1.0" = f "make-dir" "2.1.0" y "5f0310e18b8be898cc07009295a30ae41e91e6f5" [
          (s."pify@^4.0.1")
          (s."semver@^5.6.0")
          ];
        "make-dir@3.1.0" = f "make-dir" "3.1.0" y "415e967046b3a7f1d185277d84aa58203726a13f" [
          (s."semver@^6.0.0")
          ];
        "make-dir@^2.0.0" = s."make-dir@2.1.0";
        "make-dir@^3.0.0" = s."make-dir@3.1.0";
        "make-dir@^3.0.2" = s."make-dir@3.1.0";
        "make-error@1.3.6" = f "make-error" "1.3.6" y "2eb2e37ea9b67c4891f684a1394799af484cf7a2" [];
        "make-error@^1" = s."make-error@1.3.6";
        "make-error@^1.1.1" = s."make-error@1.3.6";
        "makeerror@1.0.11" = f "makeerror" "1.0.11" y "e01a5c9109f2af79660e4e8b9587790184f5a96c" [
          (s."tmpl@1.0.x")
          ];
        "makeerror@1.0.x" = s."makeerror@1.0.11";
        "map-cache@0.2.2" = f "map-cache" "0.2.2" y "c32abd0bd6525d9b051645bb4f26ac5dc98a0dbf" [];
        "map-cache@^0.2.2" = s."map-cache@0.2.2";
        "map-visit@1.0.0" = f "map-visit" "1.0.0" y "ecdca8f13144e660f1b5bd41f12f3479d98dfb8f" [
          (s."object-visit@^1.0.0")
          ];
        "map-visit@^1.0.0" = s."map-visit@1.0.0";
        "matcher@3.0.0" = f "matcher" "3.0.0" y "bd9060f4c5b70aa8041ccc6f80368760994f30ca" [
          (s."escape-string-regexp@^4.0.0")
          ];
        "matcher@^3.0.0" = s."matcher@3.0.0";
        "md5.js@1.3.5" = f "md5.js" "1.3.5" y "b5d07b8e3216e3e27cd728d72f70d1e6a342005f" [
          (s."hash-base@^3.0.0")
          (s."inherits@^2.0.1")
          (s."safe-buffer@^5.1.2")
          ];
        "md5.js@^1.3.4" = s."md5.js@1.3.5";
        "mdn-data@2.0.14" = f "mdn-data" "2.0.14" y "7113fc4281917d63ce29b43446f701e68c25ba50" [];
        "mdn-data@2.0.4" = f "mdn-data" "2.0.4" y "699b3c38ac6f1d728091a64650b65d388502fd5b" [];
        "media-typer@0.3.0" = f "media-typer" "0.3.0" y "8710d7af0aa626f8fffa1ce00168545263255748" [];
        "memory-fs@0.4.1" = f "memory-fs" "0.4.1" y "3a9a20b8462523e447cfbc7e8bb80ed667bfc552" [
          (s."errno@^0.1.3")
          (s."readable-stream@^2.0.1")
          ];
        "memory-fs@0.5.0" = f "memory-fs" "0.5.0" y "324c01288b88652966d161db77838720845a8e3c" [
          (s."errno@^0.1.3")
          (s."readable-stream@^2.0.1")
          ];
        "memory-fs@^0.4.1" = s."memory-fs@0.4.1";
        "memory-fs@^0.5.0" = s."memory-fs@0.5.0";
        "memorystream@0.3.1" = f "memorystream" "0.3.1" y "86d7090b30ce455d63fbae12dda51a47ddcaf9b2" [];
        "memorystream@^0.3.1" = s."memorystream@0.3.1";
        "merge-descriptors@1.0.1" = f "merge-descriptors" "1.0.1" y "b00aaa556dd8b44568150ec9d1b953f3f90cbb61" [];
        "merge-stream@2.0.0" = f "merge-stream" "2.0.0" y "52823629a14dd00c9770fb6ad47dc6310f2c1f60" [];
        "merge-stream@^2.0.0" = s."merge-stream@2.0.0";
        "merge2@1.4.1" = f "merge2" "1.4.1" y "4368892f885e907455a6fd7dc55c0c9d404990ae" [];
        "merge2@^1.3.0" = s."merge2@1.4.1";
        "methods@1.1.2" = f "methods" "1.1.2" y "5529a4d67654134edcc5266656835b0f851afcee" [];
        "methods@~1.1.2" = s."methods@1.1.2";
        "microevent.ts@0.1.1" = f "microevent.ts" "0.1.1" y "70b09b83f43df5172d0205a63025bce0f7357fa0" [];
        "microevent.ts@~0.1.1" = s."microevent.ts@0.1.1";
        "micromatch@3.1.10" = f "micromatch" "3.1.10" y "70859bc95c9840952f359a068a3fc49f9ecfac23" [
          (s."arr-diff@^4.0.0")
          (s."array-unique@^0.3.2")
          (s."braces@^2.3.1")
          (s."define-property@^2.0.2")
          (s."extend-shallow@^3.0.2")
          (s."extglob@^2.0.4")
          (s."fragment-cache@^0.2.1")
          (s."kind-of@^6.0.2")
          (s."nanomatch@^1.2.9")
          (s."object.pick@^1.3.0")
          (s."regex-not@^1.0.0")
          (s."snapdragon@^0.8.1")
          (s."to-regex@^3.0.2")
          ];
        "micromatch@4.0.4" = f "micromatch" "4.0.4" y "896d519dfe9db25fce94ceb7a500919bf881ebf9" [
          (s."braces@^3.0.1")
          (s."picomatch@^2.2.3")
          ];
        "micromatch@^3.1.10" = s."micromatch@3.1.10";
        "micromatch@^3.1.4" = s."micromatch@3.1.10";
        "micromatch@^4.0.2" = s."micromatch@4.0.4";
        "micromatch@^4.0.4" = s."micromatch@4.0.4";
        "miller-rabin@4.0.1" = f "miller-rabin" "4.0.1" y "f080351c865b0dc562a8462966daa53543c78a4d" [
          (s."bn.js@^4.0.0")
          (s."brorand@^1.0.1")
          ];
        "miller-rabin@^4.0.0" = s."miller-rabin@4.0.1";
        "mime-db@1.49.0" = f "mime-db" "1.49.0" y "f3dfde60c99e9cf3bc9701d687778f537001cbed" [];
        "mime-db@>= 1.43.0 < 2" = s."mime-db@1.49.0";
        "mime-types@2.1.32" = f "mime-types" "2.1.32" y "1d00e89e7de7fe02008db61001d9e02852670fd5" [
          (s."mime-db@1.49.0")
          ];
        "mime-types@^2.1.12" = s."mime-types@2.1.32";
        "mime-types@^2.1.27" = s."mime-types@2.1.32";
        "mime-types@~2.1.17" = s."mime-types@2.1.32";
        "mime-types@~2.1.24" = s."mime-types@2.1.32";
        "mime@1.6.0" = f "mime" "1.6.0" y "32cd9e5c64553bd58d19a568af452acff04981b1" [];
        "mime@2.5.2" = f "mime" "2.5.2" y "6e3dc6cc2b9510643830e5f19d5cb753da5eeabe" [];
        "mime@^2.4.4" = s."mime@2.5.2";
        "mimic-fn@1.2.0" = f "mimic-fn" "1.2.0" y "820c86a39334640e99516928bd03fca88057d022" [];
        "mimic-fn@2.1.0" = f "mimic-fn" "2.1.0" y "7ed2c2ccccaf84d3ffcb7a69b57711fc2083401b" [];
        "mimic-fn@^1.0.0" = s."mimic-fn@1.2.0";
        "mimic-fn@^2.1.0" = s."mimic-fn@2.1.0";
        "min-indent@1.0.1" = f "min-indent" "1.0.1" y "a63f681673b30571fbe8bc25686ae746eefa9869" [];
        "min-indent@^1.0.0" = s."min-indent@1.0.1";
        "mini-create-react-context@0.4.1" = f "mini-create-react-context" "0.4.1" y "072171561bfdc922da08a60c2197a497cc2d1d5e" [
          (s."@babel/runtime@^7.12.1")
          (s."tiny-warning@^1.0.3")
          ];
        "mini-create-react-context@^0.4.0" = s."mini-create-react-context@0.4.1";
        "mini-css-extract-plugin@0.11.3" = f "mini-css-extract-plugin" "0.11.3" y "15b0910a7f32e62ffde4a7430cfefbd700724ea6" [
          (s."loader-utils@^1.1.0")
          (s."normalize-url@1.9.1")
          (s."schema-utils@^1.0.0")
          (s."webpack-sources@^1.1.0")
          ];
        "minimalistic-assert@1.0.1" = f "minimalistic-assert" "1.0.1" y "2e194de044626d4a10e7f7fbc00ce73e83e4d5c7" [];
        "minimalistic-assert@^1.0.0" = s."minimalistic-assert@1.0.1";
        "minimalistic-assert@^1.0.1" = s."minimalistic-assert@1.0.1";
        "minimalistic-crypto-utils@1.0.1" = f "minimalistic-crypto-utils" "1.0.1" y "f6c00c1c0b082246e5c4d99dfb8c7c083b2b582a" [];
        "minimalistic-crypto-utils@^1.0.1" = s."minimalistic-crypto-utils@1.0.1";
        "minimatch@3.0.4" = f "minimatch" "3.0.4" y "5166e286457f03306064be5497e8dbb0c3d32083" [
          (s."brace-expansion@^1.1.7")
          ];
        "minimatch@^3.0.4" = s."minimatch@3.0.4";
        "minimatch@~3.0.2" = s."minimatch@3.0.4";
        "minimist@1.2.5" = f "minimist" "1.2.5" y "67d66014b66a6a8aaa0c083c5fd58df4e4e97602" [];
        "minimist@^1.1.1" = s."minimist@1.2.5";
        "minimist@^1.2.0" = s."minimist@1.2.5";
        "minimist@^1.2.5" = s."minimist@1.2.5";
        "minipass-collect@1.0.2" = f "minipass-collect" "1.0.2" y "22b813bf745dc6edba2576b940022ad6edc8c617" [
          (s."minipass@^3.0.0")
          ];
        "minipass-collect@^1.0.2" = s."minipass-collect@1.0.2";
        "minipass-flush@1.0.5" = f "minipass-flush" "1.0.5" y "82e7135d7e89a50ffe64610a787953c4c4cbb373" [
          (s."minipass@^3.0.0")
          ];
        "minipass-flush@^1.0.5" = s."minipass-flush@1.0.5";
        "minipass-pipeline@1.2.4" = f "minipass-pipeline" "1.2.4" y "68472f79711c084657c067c5c6ad93cddea8214c" [
          (s."minipass@^3.0.0")
          ];
        "minipass-pipeline@^1.2.2" = s."minipass-pipeline@1.2.4";
        "minipass@3.1.3" = f "minipass" "3.1.3" y "7d42ff1f39635482e15f9cdb53184deebd5815fd" [
          (s."yallist@^4.0.0")
          ];
        "minipass@^3.0.0" = s."minipass@3.1.3";
        "minipass@^3.1.1" = s."minipass@3.1.3";
        "minizlib@2.1.2" = f "minizlib" "2.1.2" y "e90d3466ba209b932451508a11ce3d3632145931" [
          (s."minipass@^3.0.0")
          (s."yallist@^4.0.0")
          ];
        "minizlib@^2.1.1" = s."minizlib@2.1.2";
        "mississippi@3.0.0" = f "mississippi" "3.0.0" y "ea0a3291f97e0b5e8776b363d5f0a12d94c67022" [
          (s."concat-stream@^1.5.0")
          (s."duplexify@^3.4.2")
          (s."end-of-stream@^1.1.0")
          (s."flush-write-stream@^1.0.0")
          (s."from2@^2.1.0")
          (s."parallel-transform@^1.1.0")
          (s."pump@^3.0.0")
          (s."pumpify@^1.3.3")
          (s."stream-each@^1.1.0")
          (s."through2@^2.0.0")
          ];
        "mississippi@^3.0.0" = s."mississippi@3.0.0";
        "mixin-deep@1.3.2" = f "mixin-deep" "1.3.2" y "1120b43dc359a785dce65b55b82e257ccf479566" [
          (s."for-in@^1.0.2")
          (s."is-extendable@^1.0.1")
          ];
        "mixin-deep@^1.2.0" = s."mixin-deep@1.3.2";
        "mkdirp@0.5.5" = f "mkdirp" "0.5.5" y "d91cefd62d1436ca0f41620e251288d420099def" [
          (s."minimist@^1.2.5")
          ];
        "mkdirp@1.0.4" = f "mkdirp" "1.0.4" y "3eb5ed62622756d79a5f0e2a221dfebad75c2f7e" [];
        "mkdirp@^0.5.1" = s."mkdirp@0.5.5";
        "mkdirp@^0.5.3" = s."mkdirp@0.5.5";
        "mkdirp@^0.5.5" = s."mkdirp@0.5.5";
        "mkdirp@^1.0.3" = s."mkdirp@1.0.4";
        "mkdirp@^1.0.4" = s."mkdirp@1.0.4";
        "mkdirp@~0.5.1" = s."mkdirp@0.5.5";
        "ml-array-max@1.2.3" = f "ml-array-max" "1.2.3" y "92d1ffef667432d1451d35817a7276c528635e64" [
          (s."is-any-array@^1.0.0")
          ];
        "ml-array-max@^1.2.3" = s."ml-array-max@1.2.3";
        "ml-array-min@1.2.2" = f "ml-array-min" "1.2.2" y "abd68512a57fe8499513e6f2265533807e2bbe6b" [
          (s."is-any-array@^1.0.0")
          ];
        "ml-array-min@^1.2.2" = s."ml-array-min@1.2.2";
        "ml-array-rescale@1.3.5" = f "ml-array-rescale" "1.3.5" y "a41a98535e5b3bcdcde2f1ef532f4453feb11104" [
          (s."is-any-array@^1.0.0")
          (s."ml-array-max@^1.2.3")
          (s."ml-array-min@^1.2.2")
          ];
        "ml-array-rescale@^1.3.5" = s."ml-array-rescale@1.3.5";
        "ml-matrix@6.8.0" = f "ml-matrix" "6.8.0" y "55429ea9625def03ba34e7c8e6ca490409127aa6" [
          (s."ml-array-rescale@^1.3.5")
          ];
        "ml-matrix@^6.5.0" = s."ml-matrix@6.8.0";
        "moment@2.29.1" = f "moment" "2.29.1" y "b2be769fa31940be9eeea6469c075e35006fa3d3" [];
        "moment@^2.22.1" = s."moment@2.29.1";
        "moment@^2.24.0" = s."moment@2.29.1";
        "moment@^2.25.3" = s."moment@2.29.1";
        "moment@^2.29.1" = s."moment@2.29.1";
        "move-concurrently@1.0.1" = f "move-concurrently" "1.0.1" y "be2c005fda32e0b29af1f05d7c4b33214c701f92" [
          (s."aproba@^1.1.1")
          (s."copy-concurrently@^1.0.0")
          (s."fs-write-stream-atomic@^1.0.8")
          (s."mkdirp@^0.5.1")
          (s."rimraf@^2.5.4")
          (s."run-queue@^1.0.3")
          ];
        "move-concurrently@^1.0.1" = s."move-concurrently@1.0.1";
        "mri@1.2.0" = f "mri" "1.2.0" y "6721480fec2a11a4889861115a48b6cbe7cc8f0b" [];
        "mri@^1.1.5" = s."mri@1.2.0";
        "ms@2.0.0" = f "ms" "2.0.0" y "5608aeadfc00be6c2901df5f9861788de0d597c8" [];
        "ms@2.1.1" = f "ms" "2.1.1" y "30a5864eb3ebb0a66f2ebe6d727af06a09d86e0a" [];
        "ms@2.1.2" = f "ms" "2.1.2" y "d09d1f357b443f493382a8eb3ccd183872ae6009" [];
        "ms@2.1.3" = f "ms" "2.1.3" y "574c8138ce1d2b5861f0b44579dbadd60c6615b2" [];
        "ms@^2.1.1" = s."ms@2.1.3";
        "multicast-dns-service-types@1.1.0" = f "multicast-dns-service-types" "1.1.0" y "899f11d9686e5e05cb91b35d5f0e63b773cfc901" [];
        "multicast-dns-service-types@^1.1.0" = s."multicast-dns-service-types@1.1.0";
        "multicast-dns@6.2.3" = f "multicast-dns" "6.2.3" y "a0ec7bd9055c4282f790c3c82f4e28db3b31b229" [
          (s."dns-packet@^1.3.1")
          (s."thunky@^1.0.2")
          ];
        "multicast-dns@^6.0.1" = s."multicast-dns@6.2.3";
        "multimatch@4.0.0" = f "multimatch" "4.0.0" y "8c3c0f6e3e8449ada0af3dd29efb491a375191b3" [
          (s."@types/minimatch@^3.0.3")
          (s."array-differ@^3.0.0")
          (s."array-union@^2.1.0")
          (s."arrify@^2.0.1")
          (s."minimatch@^3.0.4")
          ];
        "multimatch@^4.0.0" = s."multimatch@4.0.0";
        "nan@2.15.0" = f "nan" "2.15.0" y "3f34a473ff18e15c1b5626b62903b5ad6e665fee" [];
        "nan@^2.12.1" = s."nan@2.15.0";
        "nanoid@3.1.23" = f "nanoid" "3.1.23" y "f744086ce7c2bc47ee0a8472574d5c78e4183a81" [];
        "nanoid@^3.1.23" = s."nanoid@3.1.23";
        "nanomatch@1.2.13" = f "nanomatch" "1.2.13" y "b87a8aa4fc0de8fe6be88895b38983ff265bd119" [
          (s."arr-diff@^4.0.0")
          (s."array-unique@^0.3.2")
          (s."define-property@^2.0.2")
          (s."extend-shallow@^3.0.2")
          (s."fragment-cache@^0.2.1")
          (s."is-windows@^1.0.2")
          (s."kind-of@^6.0.2")
          (s."object.pick@^1.3.0")
          (s."regex-not@^1.0.0")
          (s."snapdragon@^0.8.1")
          (s."to-regex@^3.0.1")
          ];
        "nanomatch@^1.2.9" = s."nanomatch@1.2.13";
        "native-url@0.2.6" = f "native-url" "0.2.6" y "ca1258f5ace169c716ff44eccbddb674e10399ae" [
          (s."querystring@^0.2.0")
          ];
        "native-url@^0.2.6" = s."native-url@0.2.6";
        "natural-compare@1.4.0" = f "natural-compare" "1.4.0" y "4abebfeed7541f2c27acfb29bdbbd15c8d5ba4f7" [];
        "natural-compare@^1.4.0" = s."natural-compare@1.4.0";
        "natural-orderby@2.0.3" = f "natural-orderby" "2.0.3" y "8623bc518ba162f8ff1cdb8941d74deb0fdcc016" [];
        "natural-orderby@^2.0.1" = s."natural-orderby@2.0.3";
        "negotiator@0.6.2" = f "negotiator" "0.6.2" y "feacf7ccf525a77ae9634436a64883ffeca346fb" [];
        "neo-async@2.6.2" = f "neo-async" "2.6.2" y "b4aafb93e3aeb2d8174ca53cf163ab7d7308305f" [];
        "neo-async@^2.5.0" = s."neo-async@2.6.2";
        "neo-async@^2.6.1" = s."neo-async@2.6.2";
        "neo-async@^2.6.2" = s."neo-async@2.6.2";
        "next-tick@1.0.0" = f "next-tick" "1.0.0" y "ca86d1fe8828169b0120208e3dc8424b9db8342c" [];
        "next-tick@~1.0.0" = s."next-tick@1.0.0";
        "nice-try@1.0.5" = f "nice-try" "1.0.5" y "a3378a7696ce7d223e88fc9b764bd7ef1089e366" [];
        "nice-try@^1.0.4" = s."nice-try@1.0.5";
        "no-case@3.0.4" = f "no-case" "3.0.4" y "d361fd5c9800f558551a8369fc0dcd4662b6124d" [
          (s."lower-case@^2.0.2")
          (s."tslib@^2.0.3")
          ];
        "no-case@^3.0.4" = s."no-case@3.0.4";
        "node-fetch@2.6.5" = f "node-fetch" "2.6.5" y "42735537d7f080a7e5f78b6c549b7146be1742fd" [
          (s."whatwg-url@^5.0.0")
          ];
        "node-fetch@^2.6.1" = s."node-fetch@2.6.5";
        "node-forge@0.10.0" = f "node-forge" "0.10.0" y "32dea2afb3e9926f02ee5ce8794902691a676bf3" [];
        "node-forge@^0.10.0" = s."node-forge@0.10.0";
        "node-int64@0.4.0" = f "node-int64" "0.4.0" y "87a9065cdb355d3182d8f94ce11188b825c68a3b" [];
        "node-int64@^0.4.0" = s."node-int64@0.4.0";
        "node-libs-browser@2.2.1" = f "node-libs-browser" "2.2.1" y "b64f513d18338625f90346d27b0d235e631f6425" [
          (s."assert@^1.1.1")
          (s."browserify-zlib@^0.2.0")
          (s."buffer@^4.3.0")
          (s."console-browserify@^1.1.0")
          (s."constants-browserify@^1.0.0")
          (s."crypto-browserify@^3.11.0")
          (s."domain-browser@^1.1.1")
          (s."events@^3.0.0")
          (s."https-browserify@^1.0.0")
          (s."os-browserify@^0.3.0")
          (s."path-browserify@0.0.1")
          (s."process@^0.11.10")
          (s."punycode@^1.2.4")
          (s."querystring-es3@^0.2.0")
          (s."readable-stream@^2.3.3")
          (s."stream-browserify@^2.0.1")
          (s."stream-http@^2.7.2")
          (s."string_decoder@^1.0.0")
          (s."timers-browserify@^2.0.4")
          (s."tty-browserify@0.0.0")
          (s."url@^0.11.0")
          (s."util@^0.11.0")
          (s."vm-browserify@^1.0.1")
          ];
        "node-libs-browser@^2.2.1" = s."node-libs-browser@2.2.1";
        "node-modules-regexp@1.0.0" = f "node-modules-regexp" "1.0.0" y "8d9dbe28964a4ac5712e9131642107c71e90ec40" [];
        "node-modules-regexp@^1.0.0" = s."node-modules-regexp@1.0.0";
        "node-notifier@8.0.2" = f "node-notifier" "8.0.2" y "f3167a38ef0d2c8a866a83e318c1ba0efeb702c5" [
          (s."growly@^1.3.0")
          (s."is-wsl@^2.2.0")
          (s."semver@^7.3.2")
          (s."shellwords@^0.1.1")
          (s."uuid@^8.3.0")
          (s."which@^2.0.2")
          ];
        "node-notifier@^8.0.0" = s."node-notifier@8.0.2";
        "node-releases@1.1.73" = f "node-releases" "1.1.73" y "dd4e81ddd5277ff846b80b52bb40c49edf7a7b20" [];
        "node-releases@^1.1.61" = s."node-releases@1.1.73";
        "node-releases@^1.1.73" = s."node-releases@1.1.73";
        "normalize-package-data@2.5.0" = f "normalize-package-data" "2.5.0" y "e66db1838b200c1dfc233225d12cb36520e234a8" [
          (s."hosted-git-info@^2.1.4")
          (s."resolve@^1.10.0")
          (s."semver@2 || 3 || 4 || 5")
          (s."validate-npm-package-license@^3.0.1")
          ];
        "normalize-package-data@^2.3.2" = s."normalize-package-data@2.5.0";
        "normalize-package-data@^2.5.0" = s."normalize-package-data@2.5.0";
        "normalize-path@2.1.1" = f "normalize-path" "2.1.1" y "1ab28b556e198363a8c1a6f7e6fa20137fe6aed9" [
          (s."remove-trailing-separator@^1.0.1")
          ];
        "normalize-path@3.0.0" = f "normalize-path" "3.0.0" y "0dcd69ff23a1c9b11fd0978316644a0388216a65" [];
        "normalize-path@^2.1.1" = s."normalize-path@2.1.1";
        "normalize-path@^3.0.0" = s."normalize-path@3.0.0";
        "normalize-path@~3.0.0" = s."normalize-path@3.0.0";
        "normalize-range@0.1.2" = f "normalize-range" "0.1.2" y "2d10c06bdfd312ea9777695a4d28439456b75942" [];
        "normalize-range@^0.1.2" = s."normalize-range@0.1.2";
        "normalize-url@1.9.1" = f "normalize-url" "1.9.1" y "2cc0d66b31ea23036458436e3620d85954c66c3c" [
          (s."object-assign@^4.0.1")
          (s."prepend-http@^1.0.0")
          (s."query-string@^4.1.0")
          (s."sort-keys@^1.0.0")
          ];
        "normalize-url@3.3.0" = f "normalize-url" "3.3.0" y "b2e1c4dc4f7c6d57743df733a4f5978d18650559" [];
        "normalize-url@6.1.0" = f "normalize-url" "6.1.0" y "40d0885b535deffe3f3147bec877d05fe4c5668a" [];
        "normalize-url@^3.0.0" = s."normalize-url@3.3.0";
        "normalize-url@^6.1.0" = s."normalize-url@6.1.0";
        "npm-run-all@4.1.5" = f "npm-run-all" "4.1.5" y "04476202a15ee0e2e214080861bff12a51d98fba" [
          (s."ansi-styles@^3.2.1")
          (s."chalk@^2.4.1")
          (s."cross-spawn@^6.0.5")
          (s."memorystream@^0.3.1")
          (s."minimatch@^3.0.4")
          (s."pidtree@^0.3.0")
          (s."read-pkg@^3.0.0")
          (s."shell-quote@^1.6.1")
          (s."string.prototype.padend@^3.0.0")
          ];
        "npm-run-all@^4.1.5" = s."npm-run-all@4.1.5";
        "npm-run-path@2.0.2" = f "npm-run-path" "2.0.2" y "35a9232dfa35d7067b4cb2ddf2357b1871536c5f" [
          (s."path-key@^2.0.0")
          ];
        "npm-run-path@4.0.1" = f "npm-run-path" "4.0.1" y "b7ecd1e5ed53da8e37a55e1c2269e0b97ed748ea" [
          (s."path-key@^3.0.0")
          ];
        "npm-run-path@^2.0.0" = s."npm-run-path@2.0.2";
        "npm-run-path@^4.0.0" = s."npm-run-path@4.0.1";
        "npm-run-path@^4.0.1" = s."npm-run-path@4.0.1";
        "nth-check@1.0.2" = f "nth-check" "1.0.2" y "b2bd295c37e3dd58a3bf0700376663ba4d9cf05c" [
          (s."boolbase@~1.0.0")
          ];
        "nth-check@2.0.0" = f "nth-check" "2.0.0" y "1bb4f6dac70072fc313e8c9cd1417b5074c0a125" [
          (s."boolbase@^1.0.0")
          ];
        "nth-check@^1.0.2" = s."nth-check@1.0.2";
        "nth-check@^2.0.0" = s."nth-check@2.0.0";
        "num2fraction@1.2.2" = f "num2fraction" "1.2.2" y "6f682b6a027a4e9ddfa4564cd2589d1d4e669ede" [];
        "num2fraction@^1.2.2" = s."num2fraction@1.2.2";
        "number-is-nan@1.0.1" = f "number-is-nan" "1.0.1" y "097b602b53422a522c1afb8790318336941a011d" [];
        "number-is-nan@^1.0.0" = s."number-is-nan@1.0.1";
        "nwsapi@2.2.0" = f "nwsapi" "2.2.0" y "204879a9e3d068ff2a55139c2c772780681a38b7" [];
        "nwsapi@^2.2.0" = s."nwsapi@2.2.0";
        "object-assign@4.1.1" = f "object-assign" "4.1.1" y "2109adc7965887cfc05cbbd442cac8bfbb360863" [];
        "object-assign@^4.0.1" = s."object-assign@4.1.1";
        "object-assign@^4.1.0" = s."object-assign@4.1.1";
        "object-assign@^4.1.1" = s."object-assign@4.1.1";
        "object-copy@0.1.0" = f "object-copy" "0.1.0" y "7e7d858b781bd7c991a41ba975ed3812754e998c" [
          (s."copy-descriptor@^0.1.0")
          (s."define-property@^0.2.5")
          (s."kind-of@^3.0.3")
          ];
        "object-copy@^0.1.0" = s."object-copy@0.1.0";
        "object-inspect@1.11.0" = f "object-inspect" "1.11.0" y "9dceb146cedd4148a0d9e51ab88d34cf509922b1" [];
        "object-inspect@^1.11.0" = s."object-inspect@1.11.0";
        "object-inspect@^1.9.0" = s."object-inspect@1.11.0";
        "object-is@1.1.5" = f "object-is" "1.1.5" y "b9deeaa5fc7f1846a0faecdceec138e5778f53ac" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          ];
        "object-is@^1.0.1" = s."object-is@1.1.5";
        "object-keys@1.1.1" = f "object-keys" "1.1.1" y "1c47f272df277f3b1daf061677d9c82e2322c60e" [];
        "object-keys@^1.0.12" = s."object-keys@1.1.1";
        "object-keys@^1.1.1" = s."object-keys@1.1.1";
        "object-treeify@1.1.33" = f "object-treeify" "1.1.33" y "f06fece986830a3cba78ddd32d4c11d1f76cdf40" [];
        "object-treeify@^1.1.4" = s."object-treeify@1.1.33";
        "object-visit@1.0.1" = f "object-visit" "1.0.1" y "f79c4493af0c5377b59fe39d395e41042dd045bb" [
          (s."isobject@^3.0.0")
          ];
        "object-visit@^1.0.0" = s."object-visit@1.0.1";
        "object.assign@4.1.2" = f "object.assign" "4.1.2" y "0ed54a342eceb37b38ff76eb831a0e788cb63940" [
          (s."call-bind@^1.0.0")
          (s."define-properties@^1.1.3")
          (s."has-symbols@^1.0.1")
          (s."object-keys@^1.1.1")
          ];
        "object.assign@^4.1.0" = s."object.assign@4.1.2";
        "object.assign@^4.1.2" = s."object.assign@4.1.2";
        "object.entries@1.1.4" = f "object.entries" "1.1.4" y "43ccf9a50bc5fd5b649d45ab1a579f24e088cafd" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.2")
          ];
        "object.entries@^1.1.0" = s."object.entries@1.1.4";
        "object.entries@^1.1.4" = s."object.entries@1.1.4";
        "object.fromentries@2.0.4" = f "object.fromentries" "2.0.4" y "26e1ba5c4571c5c6f0890cef4473066456a120b8" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.0-next.2")
          (s."has@^1.0.3")
          ];
        "object.fromentries@^2.0.4" = s."object.fromentries@2.0.4";
        "object.getownpropertydescriptors@2.1.2" = f "object.getownpropertydescriptors" "2.1.2" y "1bd63aeacf0d5d2d2f31b5e393b03a7c601a23f7" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.0-next.2")
          ];
        "object.getownpropertydescriptors@^2.0.3" = s."object.getownpropertydescriptors@2.1.2";
        "object.getownpropertydescriptors@^2.1.0" = s."object.getownpropertydescriptors@2.1.2";
        "object.getownpropertydescriptors@^2.1.1" = s."object.getownpropertydescriptors@2.1.2";
        "object.pick@1.3.0" = f "object.pick" "1.3.0" y "87a10ac4c1694bd2e1cbf53591a66141fb5dd747" [
          (s."isobject@^3.0.1")
          ];
        "object.pick@^1.3.0" = s."object.pick@1.3.0";
        "object.values@1.1.4" = f "object.values" "1.1.4" y "0d273762833e816b693a637d30073e7051535b30" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.2")
          ];
        "object.values@^1.1.0" = s."object.values@1.1.4";
        "object.values@^1.1.3" = s."object.values@1.1.4";
        "object.values@^1.1.4" = s."object.values@1.1.4";
        "obuf@1.1.2" = f "obuf" "1.1.2" y "09bea3343d41859ebd446292d11c9d4db619084e" [];
        "obuf@^1.0.0" = s."obuf@1.1.2";
        "obuf@^1.1.2" = s."obuf@1.1.2";
        "on-finished@2.3.0" = f "on-finished" "2.3.0" y "20f1336481b083cd75337992a16971aa2d906947" [
          (s."ee-first@1.1.1")
          ];
        "on-finished@~2.3.0" = s."on-finished@2.3.0";
        "on-headers@1.0.2" = f "on-headers" "1.0.2" y "772b0ae6aaa525c399e489adfad90c403eb3c28f" [];
        "on-headers@~1.0.2" = s."on-headers@1.0.2";
        "once@1.4.0" = f "once" "1.4.0" y "583b1aa775961d4b113ac17d9c50baef9dd76bd1" [
          (s."wrappy@1")
          ];
        "once@^1.3.0" = s."once@1.4.0";
        "once@^1.3.1" = s."once@1.4.0";
        "once@^1.4.0" = s."once@1.4.0";
        "onetime@2.0.1" = f "onetime" "2.0.1" y "067428230fd67443b2794b22bba528b6867962d4" [
          (s."mimic-fn@^1.0.0")
          ];
        "onetime@5.1.2" = f "onetime" "5.1.2" y "d0e96ebb56b07476df1dd9c4806e5237985ca45e" [
          (s."mimic-fn@^2.1.0")
          ];
        "onetime@^2.0.0" = s."onetime@2.0.1";
        "onetime@^5.1.0" = s."onetime@5.1.2";
        "open@7.4.2" = f "open" "7.4.2" y "b8147e26dcf3e426316c730089fd71edd29c2321" [
          (s."is-docker@^2.0.0")
          (s."is-wsl@^2.1.1")
          ];
        "open@^7.0.2" = s."open@7.4.2";
        "opn@5.5.0" = f "opn" "5.5.0" y "fc7164fab56d235904c51c3b27da6758ca3b9bfc" [
          (s."is-wsl@^1.1.0")
          ];
        "opn@^5.5.0" = s."opn@5.5.0";
        "optimism@0.16.1" = f "optimism" "0.16.1" y "7c8efc1f3179f18307b887e18c15c5b7133f6e7d" [
          (s."@wry/context@^0.6.0")
          (s."@wry/trie@^0.3.0")
          ];
        "optimism@^0.16.1" = s."optimism@0.16.1";
        "optimize-css-assets-webpack-plugin@5.0.4" = f "optimize-css-assets-webpack-plugin" "5.0.4" y "85883c6528aaa02e30bbad9908c92926bb52dc90" [
          (s."cssnano@^4.1.10")
          (s."last-call-webpack-plugin@^3.0.0")
          ];
        "optionator@0.8.3" = f "optionator" "0.8.3" y "84fa1d036fe9d3c7e21d99884b601167ec8fb495" [
          (s."deep-is@~0.1.3")
          (s."fast-levenshtein@~2.0.6")
          (s."levn@~0.3.0")
          (s."prelude-ls@~1.1.2")
          (s."type-check@~0.3.2")
          (s."word-wrap@~1.2.3")
          ];
        "optionator@0.9.1" = f "optionator" "0.9.1" y "4f236a6373dae0566a6d43e1326674f50c291499" [
          (s."deep-is@^0.1.3")
          (s."fast-levenshtein@^2.0.6")
          (s."levn@^0.4.1")
          (s."prelude-ls@^1.2.1")
          (s."type-check@^0.4.0")
          (s."word-wrap@^1.2.3")
          ];
        "optionator@^0.8.1" = s."optionator@0.8.3";
        "optionator@^0.9.1" = s."optionator@0.9.1";
        "original@1.0.2" = f "original" "1.0.2" y "e442a61cffe1c5fd20a65f3261c26663b303f25f" [
          (s."url-parse@^1.4.3")
          ];
        "original@^1.0.0" = s."original@1.0.2";
        "os-browserify@0.3.0" = f "os-browserify" "0.3.0" y "854373c7f5c2315914fc9bfc6bd8238fdda1ec27" [];
        "os-browserify@^0.3.0" = s."os-browserify@0.3.0";
        "p-each-series@2.2.0" = f "p-each-series" "2.2.0" y "105ab0357ce72b202a8a8b94933672657b5e2a9a" [];
        "p-each-series@^2.1.0" = s."p-each-series@2.2.0";
        "p-finally@1.0.0" = f "p-finally" "1.0.0" y "3fbcfb15b899a44123b34b6dcc18b724336a2cae" [];
        "p-finally@^1.0.0" = s."p-finally@1.0.0";
        "p-limit@1.3.0" = f "p-limit" "1.3.0" y "b86bd5f0c25690911c7590fcbfc2010d54b3ccb8" [
          (s."p-try@^1.0.0")
          ];
        "p-limit@2.3.0" = f "p-limit" "2.3.0" y "3dd33c647a214fdfffd835933eb086da0dc21db1" [
          (s."p-try@^2.0.0")
          ];
        "p-limit@3.1.0" = f "p-limit" "3.1.0" y "e1daccbe78d0d1388ca18c64fea38e3e57e3706b" [
          (s."yocto-queue@^0.1.0")
          ];
        "p-limit@^1.1.0" = s."p-limit@1.3.0";
        "p-limit@^2.0.0" = s."p-limit@2.3.0";
        "p-limit@^2.2.0" = s."p-limit@2.3.0";
        "p-limit@^3.0.2" = s."p-limit@3.1.0";
        "p-locate@2.0.0" = f "p-locate" "2.0.0" y "20a0103b222a70c8fd39cc2e580680f3dde5ec43" [
          (s."p-limit@^1.1.0")
          ];
        "p-locate@3.0.0" = f "p-locate" "3.0.0" y "322d69a05c0264b25997d9f40cd8a891ab0064a4" [
          (s."p-limit@^2.0.0")
          ];
        "p-locate@4.1.0" = f "p-locate" "4.1.0" y "a3428bb7088b3a60292f66919278b7c297ad4f07" [
          (s."p-limit@^2.2.0")
          ];
        "p-locate@^2.0.0" = s."p-locate@2.0.0";
        "p-locate@^3.0.0" = s."p-locate@3.0.0";
        "p-locate@^4.1.0" = s."p-locate@4.1.0";
        "p-map@2.1.0" = f "p-map" "2.1.0" y "310928feef9c9ecc65b68b17693018a665cea175" [];
        "p-map@4.0.0" = f "p-map" "4.0.0" y "bb2f95a5eda2ec168ec9274e06a747c3e2904d2b" [
          (s."aggregate-error@^3.0.0")
          ];
        "p-map@^2.0.0" = s."p-map@2.1.0";
        "p-map@^4.0.0" = s."p-map@4.0.0";
        "p-retry@3.0.1" = f "p-retry" "3.0.1" y "316b4c8893e2c8dc1cfa891f406c4b422bebf328" [
          (s."retry@^0.12.0")
          ];
        "p-retry@^3.0.1" = s."p-retry@3.0.1";
        "p-try@1.0.0" = f "p-try" "1.0.0" y "cbc79cdbaf8fd4228e13f621f2b1a237c1b207b3" [];
        "p-try@2.2.0" = f "p-try" "2.2.0" y "cb2868540e313d61de58fafbe35ce9004d5540e6" [];
        "p-try@^1.0.0" = s."p-try@1.0.0";
        "p-try@^2.0.0" = s."p-try@2.2.0";
        "pako@1.0.11" = f "pako" "1.0.11" y "6c9599d340d54dfd3946380252a35705a6b992bf" [];
        "pako@~1.0.5" = s."pako@1.0.11";
        "parallel-transform@1.2.0" = f "parallel-transform" "1.2.0" y "9049ca37d6cb2182c3b1d2c720be94d14a5814fc" [
          (s."cyclist@^1.0.1")
          (s."inherits@^2.0.3")
          (s."readable-stream@^2.1.5")
          ];
        "parallel-transform@^1.1.0" = s."parallel-transform@1.2.0";
        "param-case@3.0.4" = f "param-case" "3.0.4" y "7d17fe4aa12bde34d4a77d91acfb6219caad01c5" [
          (s."dot-case@^3.0.4")
          (s."tslib@^2.0.3")
          ];
        "param-case@^3.0.3" = s."param-case@3.0.4";
        "param-case@^3.0.4" = s."param-case@3.0.4";
        "parent-module@1.0.1" = f "parent-module" "1.0.1" y "691d2709e78c79fae3a156622452d00762caaaa2" [
          (s."callsites@^3.0.0")
          ];
        "parent-module@^1.0.0" = s."parent-module@1.0.1";
        "parse-asn1@5.1.6" = f "parse-asn1" "5.1.6" y "385080a3ec13cb62a62d39409cb3e88844cdaed4" [
          (s."asn1.js@^5.2.0")
          (s."browserify-aes@^1.0.0")
          (s."evp_bytestokey@^1.0.0")
          (s."pbkdf2@^3.0.3")
          (s."safe-buffer@^5.1.1")
          ];
        "parse-asn1@^5.0.0" = s."parse-asn1@5.1.6";
        "parse-asn1@^5.1.5" = s."parse-asn1@5.1.6";
        "parse-json@4.0.0" = f "parse-json" "4.0.0" y "be35f5425be1f7f6c747184f98a788cb99477ee0" [
          (s."error-ex@^1.3.1")
          (s."json-parse-better-errors@^1.0.1")
          ];
        "parse-json@5.2.0" = f "parse-json" "5.2.0" y "c76fc66dee54231c962b22bcc8a72cf2f99753cd" [
          (s."@babel/code-frame@^7.0.0")
          (s."error-ex@^1.3.1")
          (s."json-parse-even-better-errors@^2.3.0")
          (s."lines-and-columns@^1.1.6")
          ];
        "parse-json@^4.0.0" = s."parse-json@4.0.0";
        "parse-json@^5.0.0" = s."parse-json@5.2.0";
        "parse-path@4.0.3" = f "parse-path" "4.0.3" y "82d81ec3e071dcc4ab49aa9f2c9c0b8966bb22bf" [
          (s."is-ssh@^1.3.0")
          (s."protocols@^1.4.0")
          (s."qs@^6.9.4")
          (s."query-string@^6.13.8")
          ];
        "parse-path@^4.0.0" = s."parse-path@4.0.3";
        "parse-url@6.0.0" = f "parse-url" "6.0.0" y "f5dd262a7de9ec00914939220410b66cff09107d" [
          (s."is-ssh@^1.3.0")
          (s."normalize-url@^6.1.0")
          (s."parse-path@^4.0.0")
          (s."protocols@^1.4.0")
          ];
        "parse-url@^6.0.0" = s."parse-url@6.0.0";
        "parse5@6.0.1" = f "parse5" "6.0.1" y "e1a1c085c569b3dc08321184f19a39cc27f7c30b" [];
        "parseurl@1.3.3" = f "parseurl" "1.3.3" y "9da19e7bee8d12dff0513ed5b76957793bc2e8d4" [];
        "parseurl@~1.3.2" = s."parseurl@1.3.3";
        "parseurl@~1.3.3" = s."parseurl@1.3.3";
        "pascal-case@3.1.2" = f "pascal-case" "3.1.2" y "b48e0ef2b98e205e7c1dae747d0b1508237660eb" [
          (s."no-case@^3.0.4")
          (s."tslib@^2.0.3")
          ];
        "pascal-case@^3.1.2" = s."pascal-case@3.1.2";
        "pascalcase@0.1.1" = f "pascalcase" "0.1.1" y "b363e55e8006ca6fe21784d2db22bd15d7917f14" [];
        "pascalcase@^0.1.1" = s."pascalcase@0.1.1";
        "password-prompt@1.1.2" = f "password-prompt" "1.1.2" y "85b2f93896c5bd9e9f2d6ff0627fa5af3dc00923" [
          (s."ansi-escapes@^3.1.0")
          (s."cross-spawn@^6.0.5")
          ];
        "password-prompt@^1.0.7" = s."password-prompt@1.1.2";
        "password-prompt@^1.1.2" = s."password-prompt@1.1.2";
        "path-browserify@0.0.1" = f "path-browserify" "0.0.1" y "e6c4ddd7ed3aa27c68a20cc4e50e1a4ee83bbc4a" [];
        "path-case@3.0.4" = f "path-case" "3.0.4" y "9168645334eb942658375c56f80b4c0cb5f82c6f" [
          (s."dot-case@^3.0.4")
          (s."tslib@^2.0.3")
          ];
        "path-case@^3.0.4" = s."path-case@3.0.4";
        "path-dirname@1.0.2" = f "path-dirname" "1.0.2" y "cc33d24d525e099a5388c0336c6e32b9160609e0" [];
        "path-dirname@^1.0.0" = s."path-dirname@1.0.2";
        "path-exists@3.0.0" = f "path-exists" "3.0.0" y "ce0ebeaa5f78cb18925ea7d810d7b59b010fd515" [];
        "path-exists@4.0.0" = f "path-exists" "4.0.0" y "513bdbe2d3b95d7762e8c1137efa195c6c61b5b3" [];
        "path-exists@^3.0.0" = s."path-exists@3.0.0";
        "path-exists@^4.0.0" = s."path-exists@4.0.0";
        "path-is-absolute@1.0.1" = f "path-is-absolute" "1.0.1" y "174b9268735534ffbc7ace6bf53a5a9e1b5c5f5f" [];
        "path-is-absolute@^1.0.0" = s."path-is-absolute@1.0.1";
        "path-is-inside@1.0.2" = f "path-is-inside" "1.0.2" y "365417dede44430d1c11af61027facf074bdfc53" [];
        "path-is-inside@^1.0.2" = s."path-is-inside@1.0.2";
        "path-key@2.0.1" = f "path-key" "2.0.1" y "411cadb574c5a140d3a4b1910d40d80cc9f40b40" [];
        "path-key@3.1.1" = f "path-key" "3.1.1" y "581f6ade658cbba65a0d3380de7753295054f375" [];
        "path-key@^2.0.0" = s."path-key@2.0.1";
        "path-key@^2.0.1" = s."path-key@2.0.1";
        "path-key@^3.0.0" = s."path-key@3.1.1";
        "path-key@^3.1.0" = s."path-key@3.1.1";
        "path-parse@1.0.7" = f "path-parse" "1.0.7" y "fbc114b60ca42b30d9daf5858e4bd68bbedb6735" [];
        "path-parse@^1.0.6" = s."path-parse@1.0.7";
        "path-to-regexp@0.1.7" = f "path-to-regexp" "0.1.7" y "df604178005f522f15eb4490e7247a1bfaa67f8c" [];
        "path-to-regexp@1.8.0" = f "path-to-regexp" "1.8.0" y "887b3ba9d84393e87a0a0b9f4cb756198b53548a" [
          (s."isarray@0.0.1")
          ];
        "path-to-regexp@^1.7.0" = s."path-to-regexp@1.8.0";
        "path-type@3.0.0" = f "path-type" "3.0.0" y "cef31dc8e0a1a3bb0d105c0cd97cf3bf47f4e36f" [
          (s."pify@^3.0.0")
          ];
        "path-type@4.0.0" = f "path-type" "4.0.0" y "84ed01c0a7ba380afe09d90a8c180dcd9d03043b" [];
        "path-type@^3.0.0" = s."path-type@3.0.0";
        "path-type@^4.0.0" = s."path-type@4.0.0";
        "pbkdf2@3.1.2" = f "pbkdf2" "3.1.2" y "dd822aa0887580e52f1a039dc3eda108efae3075" [
          (s."create-hash@^1.1.2")
          (s."create-hmac@^1.1.4")
          (s."ripemd160@^2.0.1")
          (s."safe-buffer@^5.0.1")
          (s."sha.js@^2.4.8")
          ];
        "pbkdf2@^3.0.3" = s."pbkdf2@3.1.2";
        "pdfast@0.2.0" = f "pdfast" "0.2.0" y "8cbc556e1bf2522177787c0de2e0d4373ba885c9" [];
        "pdfast@^0.2.0" = s."pdfast@0.2.0";
        "performance-now@2.1.0" = f "performance-now" "2.1.0" y "6309f4e0e5fa913ec1c69307ae364b4b377c9e7b" [];
        "performance-now@^2.1.0" = s."performance-now@2.1.0";
        "picomatch@2.3.0" = f "picomatch" "2.3.0" y "f1f061de8f6a4bf022892e2d128234fb98302972" [];
        "picomatch@^2.0.4" = s."picomatch@2.3.0";
        "picomatch@^2.2.1" = s."picomatch@2.3.0";
        "picomatch@^2.2.2" = s."picomatch@2.3.0";
        "picomatch@^2.2.3" = s."picomatch@2.3.0";
        "pidtree@0.3.1" = f "pidtree" "0.3.1" y "ef09ac2cc0533df1f3250ccf2c4d366b0d12114a" [];
        "pidtree@^0.3.0" = s."pidtree@0.3.1";
        "pify@2.3.0" = f "pify" "2.3.0" y "ed141a6ac043a849ea588498e7dca8b15330e90c" [];
        "pify@3.0.0" = f "pify" "3.0.0" y "e5a4acd2c101fdf3d9a4d07f0dbc4db49dd28176" [];
        "pify@4.0.1" = f "pify" "4.0.1" y "4b2cd25c50d598735c50292224fd8c6df41e3231" [];
        "pify@^2.0.0" = s."pify@2.3.0";
        "pify@^3.0.0" = s."pify@3.0.0";
        "pify@^4.0.1" = s."pify@4.0.1";
        "pinkie-promise@2.0.1" = f "pinkie-promise" "2.0.1" y "2135d6dfa7a358c069ac9b178776288228450ffa" [
          (s."pinkie@^2.0.0")
          ];
        "pinkie-promise@^2.0.0" = s."pinkie-promise@2.0.1";
        "pinkie@2.0.4" = f "pinkie" "2.0.4" y "72556b80cfa0d48a974e80e77248e80ed4f7f870" [];
        "pinkie@^2.0.0" = s."pinkie@2.0.4";
        "pirates@4.0.1" = f "pirates" "4.0.1" y "643a92caf894566f91b2b986d2c66950a8e2fb87" [
          (s."node-modules-regexp@^1.0.0")
          ];
        "pirates@^4.0.1" = s."pirates@4.0.1";
        "pkg-dir@2.0.0" = f "pkg-dir" "2.0.0" y "f6d5d1109e19d63edf428e0bd57e12777615334b" [
          (s."find-up@^2.1.0")
          ];
        "pkg-dir@3.0.0" = f "pkg-dir" "3.0.0" y "2749020f239ed990881b1f71210d51eb6523bea3" [
          (s."find-up@^3.0.0")
          ];
        "pkg-dir@4.2.0" = f "pkg-dir" "4.2.0" y "f099133df7ede422e81d1d8448270eeb3e4261f3" [
          (s."find-up@^4.0.0")
          ];
        "pkg-dir@^2.0.0" = s."pkg-dir@2.0.0";
        "pkg-dir@^3.0.0" = s."pkg-dir@3.0.0";
        "pkg-dir@^4.1.0" = s."pkg-dir@4.2.0";
        "pkg-dir@^4.2.0" = s."pkg-dir@4.2.0";
        "pkg-up@2.0.0" = f "pkg-up" "2.0.0" y "c819ac728059a461cab1c3889a2be3c49a004d7f" [
          (s."find-up@^2.1.0")
          ];
        "pkg-up@3.1.0" = f "pkg-up" "3.1.0" y "100ec235cc150e4fd42519412596a28512a0def5" [
          (s."find-up@^3.0.0")
          ];
        "pkg-up@^2.0.0" = s."pkg-up@2.0.0";
        "pnp-webpack-plugin@1.6.4" = f "pnp-webpack-plugin" "1.6.4" y "c9711ac4dc48a685dabafc86f8b6dd9f8df84149" [
          (s."ts-pnp@^1.1.6")
          ];
        "polyline-miter-util@1.0.1" = f "polyline-miter-util" "1.0.1" y "b693f2389ea0ded36a6bcf5ecd2ece4b6917d957" [
          (s."gl-vec2@^1.0.0")
          ];
        "polyline-miter-util@^1.0.1" = s."polyline-miter-util@1.0.1";
        "polyline-normals@2.0.2" = f "polyline-normals" "2.0.2" y "a1737e75d8c0dccb1a591f9cb27f09eef4b7d135" [
          (s."polyline-miter-util@^1.0.1")
          ];
        "polyline-normals@^2.0.2" = s."polyline-normals@2.0.2";
        "portfinder@1.0.28" = f "portfinder" "1.0.28" y "67c4622852bd5374dd1dd900f779f53462fac778" [
          (s."async@^2.6.2")
          (s."debug@^3.1.1")
          (s."mkdirp@^0.5.5")
          ];
        "portfinder@^1.0.26" = s."portfinder@1.0.28";
        "posix-character-classes@0.1.1" = f "posix-character-classes" "0.1.1" y "01eac0fe3b5af71a2a6c02feabb8c1fef7e00eab" [];
        "posix-character-classes@^0.1.0" = s."posix-character-classes@0.1.1";
        "postcss-attribute-case-insensitive@4.0.2" = f "postcss-attribute-case-insensitive" "4.0.2" y "d93e46b504589e94ac7277b0463226c68041a880" [
          (s."postcss@^7.0.2")
          (s."postcss-selector-parser@^6.0.2")
          ];
        "postcss-attribute-case-insensitive@^4.0.1" = s."postcss-attribute-case-insensitive@4.0.2";
        "postcss-browser-comments@3.0.0" = f "postcss-browser-comments" "3.0.0" y "1248d2d935fb72053c8e1f61a84a57292d9f65e9" [
          (s."postcss@^7")
          ];
        "postcss-browser-comments@^3.0.0" = s."postcss-browser-comments@3.0.0";
        "postcss-calc@7.0.5" = f "postcss-calc" "7.0.5" y "f8a6e99f12e619c2ebc23cf6c486fdc15860933e" [
          (s."postcss@^7.0.27")
          (s."postcss-selector-parser@^6.0.2")
          (s."postcss-value-parser@^4.0.2")
          ];
        "postcss-calc@^7.0.1" = s."postcss-calc@7.0.5";
        "postcss-color-functional-notation@2.0.1" = f "postcss-color-functional-notation" "2.0.1" y "5efd37a88fbabeb00a2966d1e53d98ced93f74e0" [
          (s."postcss@^7.0.2")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-color-functional-notation@^2.0.1" = s."postcss-color-functional-notation@2.0.1";
        "postcss-color-gray@5.0.0" = f "postcss-color-gray" "5.0.0" y "532a31eb909f8da898ceffe296fdc1f864be8547" [
          (s."@csstools/convert-colors@^1.4.0")
          (s."postcss@^7.0.5")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-color-gray@^5.0.0" = s."postcss-color-gray@5.0.0";
        "postcss-color-hex-alpha@5.0.3" = f "postcss-color-hex-alpha" "5.0.3" y "a8d9ca4c39d497c9661e374b9c51899ef0f87388" [
          (s."postcss@^7.0.14")
          (s."postcss-values-parser@^2.0.1")
          ];
        "postcss-color-hex-alpha@^5.0.3" = s."postcss-color-hex-alpha@5.0.3";
        "postcss-color-mod-function@3.0.3" = f "postcss-color-mod-function" "3.0.3" y "816ba145ac11cc3cb6baa905a75a49f903e4d31d" [
          (s."@csstools/convert-colors@^1.4.0")
          (s."postcss@^7.0.2")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-color-mod-function@^3.0.3" = s."postcss-color-mod-function@3.0.3";
        "postcss-color-rebeccapurple@4.0.1" = f "postcss-color-rebeccapurple" "4.0.1" y "c7a89be872bb74e45b1e3022bfe5748823e6de77" [
          (s."postcss@^7.0.2")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-color-rebeccapurple@^4.0.1" = s."postcss-color-rebeccapurple@4.0.1";
        "postcss-colormin@4.0.3" = f "postcss-colormin" "4.0.3" y "ae060bce93ed794ac71264f08132d550956bd381" [
          (s."browserslist@^4.0.0")
          (s."color@^3.0.0")
          (s."has@^1.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-colormin@^4.0.3" = s."postcss-colormin@4.0.3";
        "postcss-convert-values@4.0.1" = f "postcss-convert-values" "4.0.1" y "ca3813ed4da0f812f9d43703584e449ebe189a7f" [
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-convert-values@^4.0.1" = s."postcss-convert-values@4.0.1";
        "postcss-custom-media@7.0.8" = f "postcss-custom-media" "7.0.8" y "fffd13ffeffad73621be5f387076a28b00294e0c" [
          (s."postcss@^7.0.14")
          ];
        "postcss-custom-media@^7.0.8" = s."postcss-custom-media@7.0.8";
        "postcss-custom-properties@8.0.11" = f "postcss-custom-properties" "8.0.11" y "2d61772d6e92f22f5e0d52602df8fae46fa30d97" [
          (s."postcss@^7.0.17")
          (s."postcss-values-parser@^2.0.1")
          ];
        "postcss-custom-properties@^8.0.11" = s."postcss-custom-properties@8.0.11";
        "postcss-custom-selectors@5.1.2" = f "postcss-custom-selectors" "5.1.2" y "64858c6eb2ecff2fb41d0b28c9dd7b3db4de7fba" [
          (s."postcss@^7.0.2")
          (s."postcss-selector-parser@^5.0.0-rc.3")
          ];
        "postcss-custom-selectors@^5.1.2" = s."postcss-custom-selectors@5.1.2";
        "postcss-dir-pseudo-class@5.0.0" = f "postcss-dir-pseudo-class" "5.0.0" y "6e3a4177d0edb3abcc85fdb6fbb1c26dabaeaba2" [
          (s."postcss@^7.0.2")
          (s."postcss-selector-parser@^5.0.0-rc.3")
          ];
        "postcss-dir-pseudo-class@^5.0.0" = s."postcss-dir-pseudo-class@5.0.0";
        "postcss-discard-comments@4.0.2" = f "postcss-discard-comments" "4.0.2" y "1fbabd2c246bff6aaad7997b2b0918f4d7af4033" [
          (s."postcss@^7.0.0")
          ];
        "postcss-discard-comments@^4.0.2" = s."postcss-discard-comments@4.0.2";
        "postcss-discard-duplicates@4.0.2" = f "postcss-discard-duplicates" "4.0.2" y "3fe133cd3c82282e550fc9b239176a9207b784eb" [
          (s."postcss@^7.0.0")
          ];
        "postcss-discard-duplicates@^4.0.2" = s."postcss-discard-duplicates@4.0.2";
        "postcss-discard-empty@4.0.1" = f "postcss-discard-empty" "4.0.1" y "c8c951e9f73ed9428019458444a02ad90bb9f765" [
          (s."postcss@^7.0.0")
          ];
        "postcss-discard-empty@^4.0.1" = s."postcss-discard-empty@4.0.1";
        "postcss-discard-overridden@4.0.1" = f "postcss-discard-overridden" "4.0.1" y "652aef8a96726f029f5e3e00146ee7a4e755ff57" [
          (s."postcss@^7.0.0")
          ];
        "postcss-discard-overridden@^4.0.1" = s."postcss-discard-overridden@4.0.1";
        "postcss-double-position-gradients@1.0.0" = f "postcss-double-position-gradients" "1.0.0" y "fc927d52fddc896cb3a2812ebc5df147e110522e" [
          (s."postcss@^7.0.5")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-double-position-gradients@^1.0.0" = s."postcss-double-position-gradients@1.0.0";
        "postcss-env-function@2.0.2" = f "postcss-env-function" "2.0.2" y "0f3e3d3c57f094a92c2baf4b6241f0b0da5365d7" [
          (s."postcss@^7.0.2")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-env-function@^2.0.2" = s."postcss-env-function@2.0.2";
        "postcss-flexbugs-fixes@4.2.1" = f "postcss-flexbugs-fixes" "4.2.1" y "9218a65249f30897deab1033aced8578562a6690" [
          (s."postcss@^7.0.26")
          ];
        "postcss-focus-visible@4.0.0" = f "postcss-focus-visible" "4.0.0" y "477d107113ade6024b14128317ade2bd1e17046e" [
          (s."postcss@^7.0.2")
          ];
        "postcss-focus-visible@^4.0.0" = s."postcss-focus-visible@4.0.0";
        "postcss-focus-within@3.0.0" = f "postcss-focus-within" "3.0.0" y "763b8788596cee9b874c999201cdde80659ef680" [
          (s."postcss@^7.0.2")
          ];
        "postcss-focus-within@^3.0.0" = s."postcss-focus-within@3.0.0";
        "postcss-font-variant@4.0.1" = f "postcss-font-variant" "4.0.1" y "42d4c0ab30894f60f98b17561eb5c0321f502641" [
          (s."postcss@^7.0.2")
          ];
        "postcss-font-variant@^4.0.0" = s."postcss-font-variant@4.0.1";
        "postcss-gap-properties@2.0.0" = f "postcss-gap-properties" "2.0.0" y "431c192ab3ed96a3c3d09f2ff615960f902c1715" [
          (s."postcss@^7.0.2")
          ];
        "postcss-gap-properties@^2.0.0" = s."postcss-gap-properties@2.0.0";
        "postcss-image-set-function@3.0.1" = f "postcss-image-set-function" "3.0.1" y "28920a2f29945bed4c3198d7df6496d410d3f288" [
          (s."postcss@^7.0.2")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-image-set-function@^3.0.1" = s."postcss-image-set-function@3.0.1";
        "postcss-initial@3.0.4" = f "postcss-initial" "3.0.4" y "9d32069a10531fe2ecafa0b6ac750ee0bc7efc53" [
          (s."postcss@^7.0.2")
          ];
        "postcss-initial@^3.0.0" = s."postcss-initial@3.0.4";
        "postcss-lab-function@2.0.1" = f "postcss-lab-function" "2.0.1" y "bb51a6856cd12289ab4ae20db1e3821ef13d7d2e" [
          (s."@csstools/convert-colors@^1.4.0")
          (s."postcss@^7.0.2")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-lab-function@^2.0.1" = s."postcss-lab-function@2.0.1";
        "postcss-load-config@2.1.2" = f "postcss-load-config" "2.1.2" y "c5ea504f2c4aef33c7359a34de3573772ad7502a" [
          (s."cosmiconfig@^5.0.0")
          (s."import-cwd@^2.0.0")
          ];
        "postcss-load-config@^2.0.0" = s."postcss-load-config@2.1.2";
        "postcss-loader@3.0.0" = f "postcss-loader" "3.0.0" y "6b97943e47c72d845fa9e03f273773d4e8dd6c2d" [
          (s."loader-utils@^1.1.0")
          (s."postcss@^7.0.0")
          (s."postcss-load-config@^2.0.0")
          (s."schema-utils@^1.0.0")
          ];
        "postcss-logical@3.0.0" = f "postcss-logical" "3.0.0" y "2495d0f8b82e9f262725f75f9401b34e7b45d5b5" [
          (s."postcss@^7.0.2")
          ];
        "postcss-logical@^3.0.0" = s."postcss-logical@3.0.0";
        "postcss-media-minmax@4.0.0" = f "postcss-media-minmax" "4.0.0" y "b75bb6cbc217c8ac49433e12f22048814a4f5ed5" [
          (s."postcss@^7.0.2")
          ];
        "postcss-media-minmax@^4.0.0" = s."postcss-media-minmax@4.0.0";
        "postcss-merge-longhand@4.0.11" = f "postcss-merge-longhand" "4.0.11" y "62f49a13e4a0ee04e7b98f42bb16062ca2549e24" [
          (s."css-color-names@0.0.4")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          (s."stylehacks@^4.0.0")
          ];
        "postcss-merge-longhand@^4.0.11" = s."postcss-merge-longhand@4.0.11";
        "postcss-merge-rules@4.0.3" = f "postcss-merge-rules" "4.0.3" y "362bea4ff5a1f98e4075a713c6cb25aefef9a650" [
          (s."browserslist@^4.0.0")
          (s."caniuse-api@^3.0.0")
          (s."cssnano-util-same-parent@^4.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-selector-parser@^3.0.0")
          (s."vendors@^1.0.0")
          ];
        "postcss-merge-rules@^4.0.3" = s."postcss-merge-rules@4.0.3";
        "postcss-minify-font-values@4.0.2" = f "postcss-minify-font-values" "4.0.2" y "cd4c344cce474343fac5d82206ab2cbcb8afd5a6" [
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-minify-font-values@^4.0.2" = s."postcss-minify-font-values@4.0.2";
        "postcss-minify-gradients@4.0.2" = f "postcss-minify-gradients" "4.0.2" y "93b29c2ff5099c535eecda56c4aa6e665a663471" [
          (s."cssnano-util-get-arguments@^4.0.0")
          (s."is-color-stop@^1.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-minify-gradients@^4.0.2" = s."postcss-minify-gradients@4.0.2";
        "postcss-minify-params@4.0.2" = f "postcss-minify-params" "4.0.2" y "6b9cef030c11e35261f95f618c90036d680db874" [
          (s."alphanum-sort@^1.0.0")
          (s."browserslist@^4.0.0")
          (s."cssnano-util-get-arguments@^4.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          (s."uniqs@^2.0.0")
          ];
        "postcss-minify-params@^4.0.2" = s."postcss-minify-params@4.0.2";
        "postcss-minify-selectors@4.0.2" = f "postcss-minify-selectors" "4.0.2" y "e2e5eb40bfee500d0cd9243500f5f8ea4262fbd8" [
          (s."alphanum-sort@^1.0.0")
          (s."has@^1.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-selector-parser@^3.0.0")
          ];
        "postcss-minify-selectors@^4.0.2" = s."postcss-minify-selectors@4.0.2";
        "postcss-modules-extract-imports@2.0.0" = f "postcss-modules-extract-imports" "2.0.0" y "818719a1ae1da325f9832446b01136eeb493cd7e" [
          (s."postcss@^7.0.5")
          ];
        "postcss-modules-extract-imports@^2.0.0" = s."postcss-modules-extract-imports@2.0.0";
        "postcss-modules-local-by-default@3.0.3" = f "postcss-modules-local-by-default" "3.0.3" y "bb14e0cc78279d504dbdcbfd7e0ca28993ffbbb0" [
          (s."icss-utils@^4.1.1")
          (s."postcss@^7.0.32")
          (s."postcss-selector-parser@^6.0.2")
          (s."postcss-value-parser@^4.1.0")
          ];
        "postcss-modules-local-by-default@^3.0.3" = s."postcss-modules-local-by-default@3.0.3";
        "postcss-modules-scope@2.2.0" = f "postcss-modules-scope" "2.2.0" y "385cae013cc7743f5a7d7602d1073a89eaae62ee" [
          (s."postcss@^7.0.6")
          (s."postcss-selector-parser@^6.0.0")
          ];
        "postcss-modules-scope@^2.2.0" = s."postcss-modules-scope@2.2.0";
        "postcss-modules-values@3.0.0" = f "postcss-modules-values" "3.0.0" y "5b5000d6ebae29b4255301b4a3a54574423e7f10" [
          (s."icss-utils@^4.0.0")
          (s."postcss@^7.0.6")
          ];
        "postcss-modules-values@^3.0.0" = s."postcss-modules-values@3.0.0";
        "postcss-nesting@7.0.1" = f "postcss-nesting" "7.0.1" y "b50ad7b7f0173e5b5e3880c3501344703e04c052" [
          (s."postcss@^7.0.2")
          ];
        "postcss-nesting@^7.0.0" = s."postcss-nesting@7.0.1";
        "postcss-normalize-charset@4.0.1" = f "postcss-normalize-charset" "4.0.1" y "8b35add3aee83a136b0471e0d59be58a50285dd4" [
          (s."postcss@^7.0.0")
          ];
        "postcss-normalize-charset@^4.0.1" = s."postcss-normalize-charset@4.0.1";
        "postcss-normalize-display-values@4.0.2" = f "postcss-normalize-display-values" "4.0.2" y "0dbe04a4ce9063d4667ed2be476bb830c825935a" [
          (s."cssnano-util-get-match@^4.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-normalize-display-values@^4.0.2" = s."postcss-normalize-display-values@4.0.2";
        "postcss-normalize-positions@4.0.2" = f "postcss-normalize-positions" "4.0.2" y "05f757f84f260437378368a91f8932d4b102917f" [
          (s."cssnano-util-get-arguments@^4.0.0")
          (s."has@^1.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-normalize-positions@^4.0.2" = s."postcss-normalize-positions@4.0.2";
        "postcss-normalize-repeat-style@4.0.2" = f "postcss-normalize-repeat-style" "4.0.2" y "c4ebbc289f3991a028d44751cbdd11918b17910c" [
          (s."cssnano-util-get-arguments@^4.0.0")
          (s."cssnano-util-get-match@^4.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-normalize-repeat-style@^4.0.2" = s."postcss-normalize-repeat-style@4.0.2";
        "postcss-normalize-string@4.0.2" = f "postcss-normalize-string" "4.0.2" y "cd44c40ab07a0c7a36dc5e99aace1eca4ec2690c" [
          (s."has@^1.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-normalize-string@^4.0.2" = s."postcss-normalize-string@4.0.2";
        "postcss-normalize-timing-functions@4.0.2" = f "postcss-normalize-timing-functions" "4.0.2" y "8e009ca2a3949cdaf8ad23e6b6ab99cb5e7d28d9" [
          (s."cssnano-util-get-match@^4.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-normalize-timing-functions@^4.0.2" = s."postcss-normalize-timing-functions@4.0.2";
        "postcss-normalize-unicode@4.0.1" = f "postcss-normalize-unicode" "4.0.1" y "841bd48fdcf3019ad4baa7493a3d363b52ae1cfb" [
          (s."browserslist@^4.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-normalize-unicode@^4.0.1" = s."postcss-normalize-unicode@4.0.1";
        "postcss-normalize-url@4.0.1" = f "postcss-normalize-url" "4.0.1" y "10e437f86bc7c7e58f7b9652ed878daaa95faae1" [
          (s."is-absolute-url@^2.0.0")
          (s."normalize-url@^3.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-normalize-url@^4.0.1" = s."postcss-normalize-url@4.0.1";
        "postcss-normalize-whitespace@4.0.2" = f "postcss-normalize-whitespace" "4.0.2" y "bf1d4070fe4fcea87d1348e825d8cc0c5faa7d82" [
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-normalize-whitespace@^4.0.2" = s."postcss-normalize-whitespace@4.0.2";
        "postcss-normalize@8.0.1" = f "postcss-normalize" "8.0.1" y "90e80a7763d7fdf2da6f2f0f82be832ce4f66776" [
          (s."@csstools/normalize.css@^10.1.0")
          (s."browserslist@^4.6.2")
          (s."postcss@^7.0.17")
          (s."postcss-browser-comments@^3.0.0")
          (s."sanitize.css@^10.0.0")
          ];
        "postcss-ordered-values@4.1.2" = f "postcss-ordered-values" "4.1.2" y "0cf75c820ec7d5c4d280189559e0b571ebac0eee" [
          (s."cssnano-util-get-arguments@^4.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-ordered-values@^4.1.2" = s."postcss-ordered-values@4.1.2";
        "postcss-overflow-shorthand@2.0.0" = f "postcss-overflow-shorthand" "2.0.0" y "31ecf350e9c6f6ddc250a78f0c3e111f32dd4c30" [
          (s."postcss@^7.0.2")
          ];
        "postcss-overflow-shorthand@^2.0.0" = s."postcss-overflow-shorthand@2.0.0";
        "postcss-page-break@2.0.0" = f "postcss-page-break" "2.0.0" y "add52d0e0a528cabe6afee8b46e2abb277df46bf" [
          (s."postcss@^7.0.2")
          ];
        "postcss-page-break@^2.0.0" = s."postcss-page-break@2.0.0";
        "postcss-place@4.0.1" = f "postcss-place" "4.0.1" y "e9f39d33d2dc584e46ee1db45adb77ca9d1dcc62" [
          (s."postcss@^7.0.2")
          (s."postcss-values-parser@^2.0.0")
          ];
        "postcss-place@^4.0.1" = s."postcss-place@4.0.1";
        "postcss-preset-env@6.7.0" = f "postcss-preset-env" "6.7.0" y "c34ddacf8f902383b35ad1e030f178f4cdf118a5" [
          (s."autoprefixer@^9.6.1")
          (s."browserslist@^4.6.4")
          (s."caniuse-lite@^1.0.30000981")
          (s."css-blank-pseudo@^0.1.4")
          (s."css-has-pseudo@^0.10.0")
          (s."css-prefers-color-scheme@^3.1.1")
          (s."cssdb@^4.4.0")
          (s."postcss@^7.0.17")
          (s."postcss-attribute-case-insensitive@^4.0.1")
          (s."postcss-color-functional-notation@^2.0.1")
          (s."postcss-color-gray@^5.0.0")
          (s."postcss-color-hex-alpha@^5.0.3")
          (s."postcss-color-mod-function@^3.0.3")
          (s."postcss-color-rebeccapurple@^4.0.1")
          (s."postcss-custom-media@^7.0.8")
          (s."postcss-custom-properties@^8.0.11")
          (s."postcss-custom-selectors@^5.1.2")
          (s."postcss-dir-pseudo-class@^5.0.0")
          (s."postcss-double-position-gradients@^1.0.0")
          (s."postcss-env-function@^2.0.2")
          (s."postcss-focus-visible@^4.0.0")
          (s."postcss-focus-within@^3.0.0")
          (s."postcss-font-variant@^4.0.0")
          (s."postcss-gap-properties@^2.0.0")
          (s."postcss-image-set-function@^3.0.1")
          (s."postcss-initial@^3.0.0")
          (s."postcss-lab-function@^2.0.1")
          (s."postcss-logical@^3.0.0")
          (s."postcss-media-minmax@^4.0.0")
          (s."postcss-nesting@^7.0.0")
          (s."postcss-overflow-shorthand@^2.0.0")
          (s."postcss-page-break@^2.0.0")
          (s."postcss-place@^4.0.1")
          (s."postcss-pseudo-class-any-link@^6.0.0")
          (s."postcss-replace-overflow-wrap@^3.0.0")
          (s."postcss-selector-matches@^4.0.0")
          (s."postcss-selector-not@^4.0.0")
          ];
        "postcss-pseudo-class-any-link@6.0.0" = f "postcss-pseudo-class-any-link" "6.0.0" y "2ed3eed393b3702879dec4a87032b210daeb04d1" [
          (s."postcss@^7.0.2")
          (s."postcss-selector-parser@^5.0.0-rc.3")
          ];
        "postcss-pseudo-class-any-link@^6.0.0" = s."postcss-pseudo-class-any-link@6.0.0";
        "postcss-reduce-initial@4.0.3" = f "postcss-reduce-initial" "4.0.3" y "7fd42ebea5e9c814609639e2c2e84ae270ba48df" [
          (s."browserslist@^4.0.0")
          (s."caniuse-api@^3.0.0")
          (s."has@^1.0.0")
          (s."postcss@^7.0.0")
          ];
        "postcss-reduce-initial@^4.0.3" = s."postcss-reduce-initial@4.0.3";
        "postcss-reduce-transforms@4.0.2" = f "postcss-reduce-transforms" "4.0.2" y "17efa405eacc6e07be3414a5ca2d1074681d4e29" [
          (s."cssnano-util-get-match@^4.0.0")
          (s."has@^1.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          ];
        "postcss-reduce-transforms@^4.0.2" = s."postcss-reduce-transforms@4.0.2";
        "postcss-replace-overflow-wrap@3.0.0" = f "postcss-replace-overflow-wrap" "3.0.0" y "61b360ffdaedca84c7c918d2b0f0d0ea559ab01c" [
          (s."postcss@^7.0.2")
          ];
        "postcss-replace-overflow-wrap@^3.0.0" = s."postcss-replace-overflow-wrap@3.0.0";
        "postcss-safe-parser@5.0.2" = f "postcss-safe-parser" "5.0.2" y "459dd27df6bc2ba64608824ba39e45dacf5e852d" [
          (s."postcss@^8.1.0")
          ];
        "postcss-selector-matches@4.0.0" = f "postcss-selector-matches" "4.0.0" y "71c8248f917ba2cc93037c9637ee09c64436fcff" [
          (s."balanced-match@^1.0.0")
          (s."postcss@^7.0.2")
          ];
        "postcss-selector-matches@^4.0.0" = s."postcss-selector-matches@4.0.0";
        "postcss-selector-not@4.0.1" = f "postcss-selector-not" "4.0.1" y "263016eef1cf219e0ade9a913780fc1f48204cbf" [
          (s."balanced-match@^1.0.0")
          (s."postcss@^7.0.2")
          ];
        "postcss-selector-not@^4.0.0" = s."postcss-selector-not@4.0.1";
        "postcss-selector-parser@3.1.2" = f "postcss-selector-parser" "3.1.2" y "b310f5c4c0fdaf76f94902bbaa30db6aa84f5270" [
          (s."dot-prop@^5.2.0")
          (s."indexes-of@^1.0.1")
          (s."uniq@^1.0.1")
          ];
        "postcss-selector-parser@5.0.0" = f "postcss-selector-parser" "5.0.0" y "249044356697b33b64f1a8f7c80922dddee7195c" [
          (s."cssesc@^2.0.0")
          (s."indexes-of@^1.0.1")
          (s."uniq@^1.0.1")
          ];
        "postcss-selector-parser@6.0.6" = f "postcss-selector-parser" "6.0.6" y "2c5bba8174ac2f6981ab631a42ab0ee54af332ea" [
          (s."cssesc@^3.0.0")
          (s."util-deprecate@^1.0.2")
          ];
        "postcss-selector-parser@^3.0.0" = s."postcss-selector-parser@3.1.2";
        "postcss-selector-parser@^5.0.0-rc.3" = s."postcss-selector-parser@5.0.0";
        "postcss-selector-parser@^5.0.0-rc.4" = s."postcss-selector-parser@5.0.0";
        "postcss-selector-parser@^6.0.0" = s."postcss-selector-parser@6.0.6";
        "postcss-selector-parser@^6.0.2" = s."postcss-selector-parser@6.0.6";
        "postcss-svgo@4.0.3" = f "postcss-svgo" "4.0.3" y "343a2cdbac9505d416243d496f724f38894c941e" [
          (s."postcss@^7.0.0")
          (s."postcss-value-parser@^3.0.0")
          (s."svgo@^1.0.0")
          ];
        "postcss-svgo@^4.0.3" = s."postcss-svgo@4.0.3";
        "postcss-unique-selectors@4.0.1" = f "postcss-unique-selectors" "4.0.1" y "9446911f3289bfd64c6d680f073c03b1f9ee4bac" [
          (s."alphanum-sort@^1.0.0")
          (s."postcss@^7.0.0")
          (s."uniqs@^2.0.0")
          ];
        "postcss-unique-selectors@^4.0.1" = s."postcss-unique-selectors@4.0.1";
        "postcss-value-parser@3.3.1" = f "postcss-value-parser" "3.3.1" y "9ff822547e2893213cf1c30efa51ac5fd1ba8281" [];
        "postcss-value-parser@4.1.0" = f "postcss-value-parser" "4.1.0" y "443f6a20ced6481a2bda4fa8532a6e55d789a2cb" [];
        "postcss-value-parser@^3.0.0" = s."postcss-value-parser@3.3.1";
        "postcss-value-parser@^4.0.2" = s."postcss-value-parser@4.1.0";
        "postcss-value-parser@^4.1.0" = s."postcss-value-parser@4.1.0";
        "postcss-values-parser@2.0.1" = f "postcss-values-parser" "2.0.1" y "da8b472d901da1e205b47bdc98637b9e9e550e5f" [
          (s."flatten@^1.0.2")
          (s."indexes-of@^1.0.1")
          (s."uniq@^1.0.1")
          ];
        "postcss-values-parser@^2.0.0" = s."postcss-values-parser@2.0.1";
        "postcss-values-parser@^2.0.1" = s."postcss-values-parser@2.0.1";
        "postcss@7.0.36" = f "postcss" "7.0.36" y "056f8cffa939662a8f5905950c07d5285644dfcb" [
          (s."chalk@^2.4.2")
          (s."source-map@^0.6.1")
          (s."supports-color@^6.1.0")
          ];
        "postcss@8.3.6" = f "postcss" "8.3.6" y "2730dd76a97969f37f53b9a6096197be311cc4ea" [
          (s."colorette@^1.2.2")
          (s."nanoid@^3.1.23")
          (s."source-map-js@^0.6.2")
          ];
        "postcss@^7" = s."postcss@7.0.36";
        "postcss@^7.0.0" = s."postcss@7.0.36";
        "postcss@^7.0.1" = s."postcss@7.0.36";
        "postcss@^7.0.14" = s."postcss@7.0.36";
        "postcss@^7.0.17" = s."postcss@7.0.36";
        "postcss@^7.0.2" = s."postcss@7.0.36";
        "postcss@^7.0.26" = s."postcss@7.0.36";
        "postcss@^7.0.27" = s."postcss@7.0.36";
        "postcss@^7.0.32" = s."postcss@7.0.36";
        "postcss@^7.0.5" = s."postcss@7.0.36";
        "postcss@^7.0.6" = s."postcss@7.0.36";
        "postcss@^8.1.0" = s."postcss@8.3.6";
        "prelude-ls@1.1.2" = f "prelude-ls" "1.1.2" y "21932a549f5e52ffd9a827f570e04be62a97da54" [];
        "prelude-ls@1.2.1" = f "prelude-ls" "1.2.1" y "debc6489d7a6e6b0e7611888cec880337d316396" [];
        "prelude-ls@^1.2.1" = s."prelude-ls@1.2.1";
        "prelude-ls@~1.1.2" = s."prelude-ls@1.1.2";
        "prepend-http@1.0.4" = f "prepend-http" "1.0.4" y "d4f4562b0ce3696e41ac52d0e002e57a635dc6dc" [];
        "prepend-http@^1.0.0" = s."prepend-http@1.0.4";
        "prettier@2.4.1" = f "prettier" "2.4.1" y "671e11c89c14a4cfc876ce564106c4a6726c9f5c" [];
        "prettier@^2.4.1" = s."prettier@2.4.1";
        "pretty-bytes@5.6.0" = f "pretty-bytes" "5.6.0" y "356256f643804773c82f64723fe78c92c62beaeb" [];
        "pretty-bytes@^5.3.0" = s."pretty-bytes@5.6.0";
        "pretty-error@2.1.2" = f "pretty-error" "2.1.2" y "be89f82d81b1c86ec8fdfbc385045882727f93b6" [
          (s."lodash@^4.17.20")
          (s."renderkid@^2.0.4")
          ];
        "pretty-error@^2.1.1" = s."pretty-error@2.1.2";
        "pretty-format@24.9.0" = f "pretty-format" "24.9.0" y "12fac31b37019a4eea3c11aa9a959eb7628aa7c9" [
          (s."@jest/types@^24.9.0")
          (s."ansi-regex@^4.0.0")
          (s."ansi-styles@^3.2.0")
          (s."react-is@^16.8.4")
          ];
        "pretty-format@25.5.0" = f "pretty-format" "25.5.0" y "7873c1d774f682c34b8d48b6743a2bf2ac55791a" [
          (s."@jest/types@^25.5.0")
          (s."ansi-regex@^5.0.0")
          (s."ansi-styles@^4.0.0")
          (s."react-is@^16.12.0")
          ];
        "pretty-format@26.6.2" = f "pretty-format" "26.6.2" y "e35c2705f14cb7fe2fe94fa078345b444120fc93" [
          (s."@jest/types@^26.6.2")
          (s."ansi-regex@^5.0.0")
          (s."ansi-styles@^4.0.0")
          (s."react-is@^17.0.1")
          ];
        "pretty-format@27.0.6" = f "pretty-format" "27.0.6" y "ab770c47b2c6f893a21aefc57b75da63ef49a11f" [
          (s."@jest/types@^27.0.6")
          (s."ansi-regex@^5.0.0")
          (s."ansi-styles@^5.0.0")
          (s."react-is@^17.0.1")
          ];
        "pretty-format@^24.0.0" = s."pretty-format@24.9.0";
        "pretty-format@^24.3.0" = s."pretty-format@24.9.0";
        "pretty-format@^24.9.0" = s."pretty-format@24.9.0";
        "pretty-format@^25.1.0" = s."pretty-format@25.5.0";
        "pretty-format@^26.6.0" = s."pretty-format@26.6.2";
        "pretty-format@^26.6.2" = s."pretty-format@26.6.2";
        "pretty-format@^27.0.2" = s."pretty-format@27.0.6";
        "pretty-quick@3.1.1" = f "pretty-quick" "3.1.1" y "93ca4e2dd38cc4e970e3f54a0ead317a25454688" [
          (s."chalk@^3.0.0")
          (s."execa@^4.0.0")
          (s."find-up@^4.1.0")
          (s."ignore@^5.1.4")
          (s."mri@^1.1.5")
          (s."multimatch@^4.0.0")
          ];
        "pretty-quick@^3.1.1" = s."pretty-quick@3.1.1";
        "probe.gl@3.4.0" = f "probe.gl" "3.4.0" y "f35029b0041fb909caff493ab23feae53339261e" [
          (s."@babel/runtime@^7.0.0")
          (s."@probe.gl/stats@3.4.0")
          ];
        "probe.gl@^3.1.1" = s."probe.gl@3.4.0";
        "process-nextick-args@2.0.1" = f "process-nextick-args" "2.0.1" y "7820d9b16120cc55ca9ae7792680ae7dba6d7fe2" [];
        "process-nextick-args@~2.0.0" = s."process-nextick-args@2.0.1";
        "process@0.11.10" = f "process" "0.11.10" y "7332300e840161bda3e69a1d1d91a7d4bc16f182" [];
        "process@^0.11.10" = s."process@0.11.10";
        "progress@2.0.3" = f "progress" "2.0.3" y "7e8cf8d8f5b8f239c1bc68beb4eb78567d572ef8" [];
        "progress@^2.0.0" = s."progress@2.0.3";
        "promise-inflight@1.0.1" = f "promise-inflight" "1.0.1" y "98472870bf228132fcbdd868129bad12c3c029e3" [];
        "promise-inflight@^1.0.1" = s."promise-inflight@1.0.1";
        "promise@8.1.0" = f "promise" "8.1.0" y "697c25c3dfe7435dd79fcd58c38a135888eaf05e" [
          (s."asap@~2.0.6")
          ];
        "promise@^8.1.0" = s."promise@8.1.0";
        "prompts@2.4.0" = f "prompts" "2.4.0" y "4aa5de0723a231d1ee9121c40fdf663df73f61d7" [
          (s."kleur@^3.0.3")
          (s."sisteransi@^1.0.5")
          ];
        "prompts@2.4.1" = f "prompts" "2.4.1" y "befd3b1195ba052f9fd2fde8a486c4e82ee77f61" [
          (s."kleur@^3.0.3")
          (s."sisteransi@^1.0.5")
          ];
        "prompts@^2.0.1" = s."prompts@2.4.1";
        "prop-types@15.7.2" = f "prop-types" "15.7.2" y "52c41e75b8c87e72b9d9360e0206b99dcbffa6c5" [
          (s."loose-envify@^1.4.0")
          (s."object-assign@^4.1.1")
          (s."react-is@^16.8.1")
          ];
        "prop-types@^15.6.2" = s."prop-types@15.7.2";
        "prop-types@^15.7.2" = s."prop-types@15.7.2";
        "protocols@1.4.8" = f "protocols" "1.4.8" y "48eea2d8f58d9644a4a32caae5d5db290a075ce8" [];
        "protocols@^1.1.0" = s."protocols@1.4.8";
        "protocols@^1.4.0" = s."protocols@1.4.8";
        "proxy-addr@2.0.7" = f "proxy-addr" "2.0.7" y "f19fe69ceab311eeb94b42e70e8c2070f9ba1025" [
          (s."forwarded@0.2.0")
          (s."ipaddr.js@1.9.1")
          ];
        "proxy-addr@~2.0.5" = s."proxy-addr@2.0.7";
        "prr@1.0.1" = f "prr" "1.0.1" y "d3fc114ba06995a45ec6893f484ceb1d78f5f476" [];
        "prr@~1.0.1" = s."prr@1.0.1";
        "psl@1.8.0" = f "psl" "1.8.0" y "9326f8bcfb013adcc005fdff056acce020e51c24" [];
        "psl@^1.1.33" = s."psl@1.8.0";
        "public-encrypt@4.0.3" = f "public-encrypt" "4.0.3" y "4fcc9d77a07e48ba7527e7cbe0de33d0701331e0" [
          (s."bn.js@^4.1.0")
          (s."browserify-rsa@^4.0.0")
          (s."create-hash@^1.1.0")
          (s."parse-asn1@^5.0.0")
          (s."randombytes@^2.0.1")
          (s."safe-buffer@^5.1.2")
          ];
        "public-encrypt@^4.0.0" = s."public-encrypt@4.0.3";
        "pump@2.0.1" = f "pump" "2.0.1" y "12399add6e4cf7526d973cbc8b5ce2e2908b3909" [
          (s."end-of-stream@^1.1.0")
          (s."once@^1.3.1")
          ];
        "pump@3.0.0" = f "pump" "3.0.0" y "b4a2116815bde2f4e1ea602354e8c75565107a64" [
          (s."end-of-stream@^1.1.0")
          (s."once@^1.3.1")
          ];
        "pump@^2.0.0" = s."pump@2.0.1";
        "pump@^3.0.0" = s."pump@3.0.0";
        "pumpify@1.5.1" = f "pumpify" "1.5.1" y "36513be246ab27570b1a374a5ce278bfd74370ce" [
          (s."duplexify@^3.6.0")
          (s."inherits@^2.0.3")
          (s."pump@^2.0.0")
          ];
        "pumpify@^1.3.3" = s."pumpify@1.5.1";
        "punycode@1.3.2" = f "punycode" "1.3.2" y "9653a036fb7c1ee42342f2325cceefea3926c48d" [];
        "punycode@1.4.1" = f "punycode" "1.4.1" y "c0d5a63b2718800ad8e1eb0fa5269c84dd41845e" [];
        "punycode@2.1.1" = f "punycode" "2.1.1" y "b58b010ac40c22c5657616c8d2c2c02c7bf479ec" [];
        "punycode@^1.2.4" = s."punycode@1.4.1";
        "punycode@^2.1.0" = s."punycode@2.1.1";
        "punycode@^2.1.1" = s."punycode@2.1.1";
        "q@1.5.1" = f "q" "1.5.1" y "7e32f75b41381291d04611f1bf14109ac00651d7" [];
        "q@^1.1.2" = s."q@1.5.1";
        "qs@6.10.1" = f "qs" "6.10.1" y "4931482fa8d647a5aab799c5271d2133b981fb6a" [
          (s."side-channel@^1.0.4")
          ];
        "qs@6.7.0" = f "qs" "6.7.0" y "41dc1a015e3d581f1621776be31afb2876a9b1bc" [];
        "qs@^6.9.4" = s."qs@6.10.1";
        "query-string@4.3.4" = f "query-string" "4.3.4" y "bbb693b9ca915c232515b228b1a02b609043dbeb" [
          (s."object-assign@^4.1.0")
          (s."strict-uri-encode@^1.0.0")
          ];
        "query-string@6.14.1" = f "query-string" "6.14.1" y "7ac2dca46da7f309449ba0f86b1fd28255b0c86a" [
          (s."decode-uri-component@^0.2.0")
          (s."filter-obj@^1.1.0")
          (s."split-on-first@^1.0.0")
          (s."strict-uri-encode@^2.0.0")
          ];
        "query-string@^4.1.0" = s."query-string@4.3.4";
        "query-string@^6.13.8" = s."query-string@6.14.1";
        "querystring-es3@0.2.1" = f "querystring-es3" "0.2.1" y "9ec61f79049875707d69414596fd907a4d711e73" [];
        "querystring-es3@^0.2.0" = s."querystring-es3@0.2.1";
        "querystring@0.2.0" = f "querystring" "0.2.0" y "b209849203bb25df820da756e747005878521620" [];
        "querystring@0.2.1" = f "querystring" "0.2.1" y "40d77615bb09d16902a85c3e38aa8b5ed761c2dd" [];
        "querystring@^0.2.0" = s."querystring@0.2.1";
        "querystringify@2.2.0" = f "querystringify" "2.2.0" y "3345941b4153cb9d082d8eee4cda2016a9aef7f6" [];
        "querystringify@^2.1.1" = s."querystringify@2.2.0";
        "queue-microtask@1.2.3" = f "queue-microtask" "1.2.3" y "4929228bbc724dfac43e0efb058caf7b6cfb6243" [];
        "queue-microtask@^1.2.2" = s."queue-microtask@1.2.3";
        "raf@3.4.1" = f "raf" "3.4.1" y "0742e99a4a6552f445d73e3ee0328af0ff1ede39" [
          (s."performance-now@^2.1.0")
          ];
        "raf@^3.4.1" = s."raf@3.4.1";
        "randombytes@2.1.0" = f "randombytes" "2.1.0" y "df6f84372f0270dc65cdf6291349ab7a473d4f2a" [
          (s."safe-buffer@^5.1.0")
          ];
        "randombytes@^2.0.0" = s."randombytes@2.1.0";
        "randombytes@^2.0.1" = s."randombytes@2.1.0";
        "randombytes@^2.0.5" = s."randombytes@2.1.0";
        "randombytes@^2.1.0" = s."randombytes@2.1.0";
        "randomfill@1.0.4" = f "randomfill" "1.0.4" y "c92196fc86ab42be983f1bf31778224931d61458" [
          (s."randombytes@^2.0.5")
          (s."safe-buffer@^5.1.0")
          ];
        "randomfill@^1.0.3" = s."randomfill@1.0.4";
        "range-parser@1.2.1" = f "range-parser" "1.2.1" y "3cf37023d199e1c24d1a55b84800c2f3e6468031" [];
        "range-parser@^1.2.1" = s."range-parser@1.2.1";
        "range-parser@~1.2.1" = s."range-parser@1.2.1";
        "raw-body@2.4.0" = f "raw-body" "2.4.0" y "a1ce6fb9c9bc356ca52e89256ab59059e13d0332" [
          (s."bytes@3.1.0")
          (s."http-errors@1.7.2")
          (s."iconv-lite@0.4.24")
          (s."unpipe@1.0.0")
          ];
        "rc-align@4.0.9" = f "rc-align" "4.0.9" y "46d8801c4a139ff6a65ad1674e8efceac98f85f2" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@2.x")
          (s."dom-align@^1.7.0")
          (s."rc-util@^5.3.0")
          (s."resize-observer-polyfill@^1.5.1")
          ];
        "rc-align@^4.0.0" = s."rc-align@4.0.9";
        "rc-cascader@1.4.3" = f "rc-cascader" "1.4.3" y "d91b0dcf8157b60ebe9ec3e58b4db054d5299464" [
          (s."@babel/runtime@^7.12.5")
          (s."array-tree-filter@^2.1.0")
          (s."rc-trigger@^5.0.4")
          (s."rc-util@^5.0.1")
          (s."warning@^4.0.1")
          ];
        "rc-cascader@~1.4.0" = s."rc-cascader@1.4.3";
        "rc-checkbox@2.3.2" = f "rc-checkbox" "2.3.2" y "f91b3678c7edb2baa8121c9483c664fa6f0aefc1" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.1")
          ];
        "rc-checkbox@~2.3.0" = s."rc-checkbox@2.3.2";
        "rc-collapse@3.1.1" = f "rc-collapse" "3.1.1" y "2421d454e85781d1cf2f04f906918e0677d779e6" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@2.x")
          (s."rc-motion@^2.3.4")
          (s."rc-util@^5.2.1")
          (s."shallowequal@^1.1.0")
          ];
        "rc-collapse@~3.1.0" = s."rc-collapse@3.1.1";
        "rc-dialog@8.6.0" = f "rc-dialog" "8.6.0" y "3b228dac085de5eed8c6237f31162104687442e7" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.6")
          (s."rc-motion@^2.3.0")
          (s."rc-util@^5.6.1")
          ];
        "rc-dialog@~8.6.0" = s."rc-dialog@8.6.0";
        "rc-drawer@4.3.1" = f "rc-drawer" "4.3.1" y "356333a7af01b777abd685c96c2ce62efb44f3f3" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.6")
          (s."rc-util@^5.7.0")
          ];
        "rc-drawer@~4.3.0" = s."rc-drawer@4.3.1";
        "rc-dropdown@3.2.0" = f "rc-dropdown" "3.2.0" y "da6c2ada403842baee3a9e909a0b1a91ba3e1090" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.6")
          (s."rc-trigger@^5.0.4")
          ];
        "rc-dropdown@^3.2.0" = s."rc-dropdown@3.2.0";
        "rc-dropdown@~3.2.0" = s."rc-dropdown@3.2.0";
        "rc-field-form@1.20.1" = f "rc-field-form" "1.20.1" y "d1c51888107cf075b42704b7b575bef84c359291" [
          (s."@babel/runtime@^7.8.4")
          (s."async-validator@^3.0.3")
          (s."rc-util@^5.8.0")
          ];
        "rc-field-form@~1.20.0" = s."rc-field-form@1.20.1";
        "rc-image@5.2.5" = f "rc-image" "5.2.5" y "44e6ffc842626827960e7ab72e1c0d6f3a8ce440" [
          (s."@babel/runtime@^7.11.2")
          (s."classnames@^2.2.6")
          (s."rc-dialog@~8.6.0")
          (s."rc-util@^5.0.6")
          ];
        "rc-image@~5.2.4" = s."rc-image@5.2.5";
        "rc-input-number@7.1.4" = f "rc-input-number" "7.1.4" y "9d7410c91ff8dc6384d0233c20df278982989f9a" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.5")
          (s."rc-util@^5.9.8")
          ];
        "rc-input-number@~7.1.0" = s."rc-input-number@7.1.4";
        "rc-mentions@1.6.1" = f "rc-mentions" "1.6.1" y "46035027d64aa33ef840ba0fbd411871e34617ae" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.6")
          (s."rc-menu@^9.0.0")
          (s."rc-textarea@^0.3.0")
          (s."rc-trigger@^5.0.4")
          (s."rc-util@^5.0.1")
          ];
        "rc-mentions@~1.6.1" = s."rc-mentions@1.6.1";
        "rc-menu@9.0.12" = f "rc-menu" "9.0.12" y "492c4bb07a596e2ce07587c669b27ee28c3810c5" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@2.x")
          (s."rc-motion@^2.4.3")
          (s."rc-overflow@^1.2.0")
          (s."rc-trigger@^5.1.2")
          (s."rc-util@^5.12.0")
          (s."shallowequal@^1.1.0")
          ];
        "rc-menu@^9.0.0" = s."rc-menu@9.0.12";
        "rc-menu@~9.0.12" = s."rc-menu@9.0.12";
        "rc-motion@2.4.4" = f "rc-motion" "2.4.4" y "e995d5fa24fc93065c24f714857cf2677d655bb0" [
          (s."@babel/runtime@^7.11.1")
          (s."classnames@^2.2.1")
          (s."rc-util@^5.2.1")
          ];
        "rc-motion@^2.0.0" = s."rc-motion@2.4.4";
        "rc-motion@^2.0.1" = s."rc-motion@2.4.4";
        "rc-motion@^2.2.0" = s."rc-motion@2.4.4";
        "rc-motion@^2.3.0" = s."rc-motion@2.4.4";
        "rc-motion@^2.3.4" = s."rc-motion@2.4.4";
        "rc-motion@^2.4.0" = s."rc-motion@2.4.4";
        "rc-motion@^2.4.3" = s."rc-motion@2.4.4";
        "rc-notification@4.5.7" = f "rc-notification" "4.5.7" y "265e6e6a0c1a0fac63d6abd4d832eb8ff31522f1" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@2.x")
          (s."rc-motion@^2.2.0")
          (s."rc-util@^5.0.1")
          ];
        "rc-notification@~4.5.7" = s."rc-notification@4.5.7";
        "rc-overflow@1.2.2" = f "rc-overflow" "1.2.2" y "95b0222016c0cdbdc0db85f569c262e7706a5f22" [
          (s."@babel/runtime@^7.11.1")
          (s."classnames@^2.2.1")
          (s."rc-resize-observer@^1.0.0")
          (s."rc-util@^5.5.1")
          ];
        "rc-overflow@^1.0.0" = s."rc-overflow@1.2.2";
        "rc-overflow@^1.2.0" = s."rc-overflow@1.2.2";
        "rc-pagination@3.1.7" = f "rc-pagination" "3.1.7" y "13ba071a7fcb0c79896076806f3944653e7bf29e" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.1")
          ];
        "rc-pagination@~3.1.6" = s."rc-pagination@3.1.7";
        "rc-picker@2.5.14" = f "rc-picker" "2.5.14" y "dfa919f7f7cc72496df45cb1cad9c82ad2fc019b" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.1")
          (s."date-fns@2.x")
          (s."dayjs@1.x")
          (s."moment@^2.24.0")
          (s."rc-trigger@^5.0.4")
          (s."rc-util@^5.4.0")
          (s."shallowequal@^1.1.0")
          ];
        "rc-picker@~2.5.10" = s."rc-picker@2.5.14";
        "rc-progress@3.1.4" = f "rc-progress" "3.1.4" y "66040d0fae7d8ced2b38588378eccb2864bad615" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.6")
          ];
        "rc-progress@~3.1.0" = s."rc-progress@3.1.4";
        "rc-rate@2.9.1" = f "rc-rate" "2.9.1" y "e43cb95c4eb90a2c1e0b16ec6614d8c43530a731" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.5")
          (s."rc-util@^5.0.1")
          ];
        "rc-rate@~2.9.0" = s."rc-rate@2.9.1";
        "rc-resize-observer@1.0.0" = f "rc-resize-observer" "1.0.0" y "97fb89856f62fec32ab6e40933935cf58e2e102d" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.1")
          (s."rc-util@^5.0.0")
          (s."resize-observer-polyfill@^1.5.1")
          ];
        "rc-resize-observer@^1.0.0" = s."rc-resize-observer@1.0.0";
        "rc-select@12.1.13" = f "rc-select" "12.1.13" y "c33560ccb9339d30695b52458f55efc35af35273" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@2.x")
          (s."rc-motion@^2.0.1")
          (s."rc-overflow@^1.0.0")
          (s."rc-trigger@^5.0.4")
          (s."rc-util@^5.9.8")
          (s."rc-virtual-list@^3.2.0")
          ];
        "rc-select@^12.0.0" = s."rc-select@12.1.13";
        "rc-select@~12.1.6" = s."rc-select@12.1.13";
        "rc-slider@9.7.2" = f "rc-slider" "9.7.2" y "282f571f7582752ebaa33964e441184f4e79ad74" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.5")
          (s."rc-tooltip@^5.0.1")
          (s."rc-util@^5.0.0")
          (s."shallowequal@^1.1.0")
          ];
        "rc-slider@~9.7.1" = s."rc-slider@9.7.2";
        "rc-steps@4.1.3" = f "rc-steps" "4.1.3" y "208580e22db619e3830ddb7fa41bc886c65d9803" [
          (s."@babel/runtime@^7.10.2")
          (s."classnames@^2.2.3")
          (s."rc-util@^5.0.1")
          ];
        "rc-steps@~4.1.0" = s."rc-steps@4.1.3";
        "rc-switch@3.2.2" = f "rc-switch" "3.2.2" y "d001f77f12664d52595b4f6fb425dd9e66fba8e8" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.1")
          (s."rc-util@^5.0.1")
          ];
        "rc-switch@~3.2.0" = s."rc-switch@3.2.2";
        "rc-table@7.15.2" = f "rc-table" "7.15.2" y "f6ab73b2cfb1c76f3cf9682c855561423c6b5b22" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.5")
          (s."rc-resize-observer@^1.0.0")
          (s."rc-util@^5.13.0")
          (s."shallowequal@^1.1.0")
          ];
        "rc-table@~7.15.1" = s."rc-table@7.15.2";
        "rc-tabs@11.10.1" = f "rc-tabs" "11.10.1" y "7b112f78bac998480c777ae160adc425e3fdb7cb" [
          (s."@babel/runtime@^7.11.2")
          (s."classnames@2.x")
          (s."rc-dropdown@^3.2.0")
          (s."rc-menu@^9.0.0")
          (s."rc-resize-observer@^1.0.0")
          (s."rc-util@^5.5.0")
          ];
        "rc-tabs@~11.10.0" = s."rc-tabs@11.10.1";
        "rc-textarea@0.3.4" = f "rc-textarea" "0.3.4" y "1408a64c87b5e76db5c847699ef9ab5ee97dd6f9" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.1")
          (s."rc-resize-observer@^1.0.0")
          (s."rc-util@^5.7.0")
          ];
        "rc-textarea@^0.3.0" = s."rc-textarea@0.3.4";
        "rc-textarea@~0.3.0" = s."rc-textarea@0.3.4";
        "rc-tooltip@5.1.1" = f "rc-tooltip" "5.1.1" y "94178ed162d0252bc4993b725f5dc2ac0fccf154" [
          (s."@babel/runtime@^7.11.2")
          (s."rc-trigger@^5.0.0")
          ];
        "rc-tooltip@^5.0.1" = s."rc-tooltip@5.1.1";
        "rc-tooltip@~5.1.1" = s."rc-tooltip@5.1.1";
        "rc-tree-select@4.3.3" = f "rc-tree-select" "4.3.3" y "28eba4d8a8dc8c0f9b61d83ce465842a6915eca4" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@2.x")
          (s."rc-select@^12.0.0")
          (s."rc-tree@^4.0.0")
          (s."rc-util@^5.0.5")
          ];
        "rc-tree-select@~4.3.0" = s."rc-tree-select@4.3.3";
        "rc-tree@4.2.2" = f "rc-tree" "4.2.2" y "4429187cbbfbecbe989714a607e3de8b3ab7763f" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@2.x")
          (s."rc-motion@^2.0.1")
          (s."rc-util@^5.0.0")
          (s."rc-virtual-list@^3.0.1")
          ];
        "rc-tree@^4.0.0" = s."rc-tree@4.2.2";
        "rc-tree@~4.2.1" = s."rc-tree@4.2.2";
        "rc-trigger@5.2.9" = f "rc-trigger" "5.2.9" y "795a787d2b038347dcde27b89a4a5cec8fc40f3e" [
          (s."@babel/runtime@^7.11.2")
          (s."classnames@^2.2.6")
          (s."rc-align@^4.0.0")
          (s."rc-motion@^2.0.0")
          (s."rc-util@^5.5.0")
          ];
        "rc-trigger@^5.0.0" = s."rc-trigger@5.2.9";
        "rc-trigger@^5.0.4" = s."rc-trigger@5.2.9";
        "rc-trigger@^5.1.2" = s."rc-trigger@5.2.9";
        "rc-trigger@^5.2.1" = s."rc-trigger@5.2.9";
        "rc-upload@4.3.1" = f "rc-upload" "4.3.1" y "d6ee66b8bd1e1dd2f78526c486538423f7e7ed84" [
          (s."@babel/runtime@^7.10.1")
          (s."classnames@^2.2.5")
          (s."rc-util@^5.2.0")
          ];
        "rc-upload@~4.3.0" = s."rc-upload@4.3.1";
        "rc-util@5.13.2" = f "rc-util" "5.13.2" y "a8a0bb77743351841ba8bed6393e03b8d2f685c8" [
          (s."@babel/runtime@^7.12.5")
          (s."react-is@^16.12.0")
          (s."shallowequal@^1.1.0")
          ];
        "rc-util@^5.0.0" = s."rc-util@5.13.2";
        "rc-util@^5.0.1" = s."rc-util@5.13.2";
        "rc-util@^5.0.5" = s."rc-util@5.13.2";
        "rc-util@^5.0.6" = s."rc-util@5.13.2";
        "rc-util@^5.0.7" = s."rc-util@5.13.2";
        "rc-util@^5.12.0" = s."rc-util@5.13.2";
        "rc-util@^5.13.0" = s."rc-util@5.13.2";
        "rc-util@^5.13.1" = s."rc-util@5.13.2";
        "rc-util@^5.2.0" = s."rc-util@5.13.2";
        "rc-util@^5.2.1" = s."rc-util@5.13.2";
        "rc-util@^5.3.0" = s."rc-util@5.13.2";
        "rc-util@^5.4.0" = s."rc-util@5.13.2";
        "rc-util@^5.5.0" = s."rc-util@5.13.2";
        "rc-util@^5.5.1" = s."rc-util@5.13.2";
        "rc-util@^5.6.1" = s."rc-util@5.13.2";
        "rc-util@^5.7.0" = s."rc-util@5.13.2";
        "rc-util@^5.8.0" = s."rc-util@5.13.2";
        "rc-util@^5.9.4" = s."rc-util@5.13.2";
        "rc-util@^5.9.8" = s."rc-util@5.13.2";
        "rc-virtual-list@3.3.0" = f "rc-virtual-list" "3.3.0" y "2f95a6ddbbf63d78b28662b57f1e69f7472762fe" [
          (s."classnames@^2.2.6")
          (s."rc-resize-observer@^1.0.0")
          (s."rc-util@^5.0.7")
          ];
        "rc-virtual-list@^3.0.1" = s."rc-virtual-list@3.3.0";
        "rc-virtual-list@^3.2.0" = s."rc-virtual-list@3.3.0";
        "react-app-polyfill@2.0.0" = f "react-app-polyfill" "2.0.0" y "a0bea50f078b8a082970a9d853dc34b6dcc6a3cf" [
          (s."core-js@^3.6.5")
          (s."object-assign@^4.1.1")
          (s."promise@^8.1.0")
          (s."raf@^3.4.1")
          (s."regenerator-runtime@^0.13.7")
          (s."whatwg-fetch@^3.4.1")
          ];
        "react-app-polyfill@^2.0.0" = s."react-app-polyfill@2.0.0";
        "react-content-loader@5.1.4" = f "react-content-loader" "5.1.4" y "854bafe4415dd9de07174621375bc308edd0ebb5" [];
        "react-content-loader@^5.0.4" = s."react-content-loader@5.1.4";
        "react-dev-utils@11.0.4" = f "react-dev-utils" "11.0.4" y "a7ccb60257a1ca2e0efe7a83e38e6700d17aa37a" [
          (s."@babel/code-frame@7.10.4")
          (s."address@1.1.2")
          (s."browserslist@4.14.2")
          (s."chalk@2.4.2")
          (s."cross-spawn@7.0.3")
          (s."detect-port-alt@1.1.6")
          (s."escape-string-regexp@2.0.0")
          (s."filesize@6.1.0")
          (s."find-up@4.1.0")
          (s."fork-ts-checker-webpack-plugin@4.1.6")
          (s."global-modules@2.0.0")
          (s."globby@11.0.1")
          (s."gzip-size@5.1.1")
          (s."immer@8.0.1")
          (s."is-root@2.1.0")
          (s."loader-utils@2.0.0")
          (s."open@^7.0.2")
          (s."pkg-up@3.1.0")
          (s."prompts@2.4.0")
          (s."react-error-overlay@^6.0.9")
          (s."recursive-readdir@2.2.2")
          (s."shell-quote@1.7.2")
          (s."strip-ansi@6.0.0")
          (s."text-table@0.2.0")
          ];
        "react-dev-utils@^11.0.3" = s."react-dev-utils@11.0.4";
        "react-dom@17.0.2" = f "react-dom" "17.0.2" y "ecffb6845e3ad8dbfcdc498f0d0a939736502c23" [
          (s."loose-envify@^1.1.0")
          (s."object-assign@^4.1.1")
          (s."scheduler@^0.20.2")
          ];
        "react-dom@^17.0.2" = s."react-dom@17.0.2";
        "react-error-overlay@6.0.9" = f "react-error-overlay" "6.0.9" y "3c743010c9359608c375ecd6bc76f35d93995b0a" [];
        "react-error-overlay@^6.0.9" = s."react-error-overlay@6.0.9";
        "react-is@16.13.1" = f "react-is" "16.13.1" y "789729a4dc36de2999dc156dd6c1d9c18cea56a4" [];
        "react-is@17.0.2" = f "react-is" "17.0.2" y "e691d4a8e9c789365655539ab372762b0efb54f0" [];
        "react-is@^16.12.0" = s."react-is@16.13.1";
        "react-is@^16.13.1" = s."react-is@16.13.1";
        "react-is@^16.6.0" = s."react-is@16.13.1";
        "react-is@^16.7.0" = s."react-is@16.13.1";
        "react-is@^16.8.1" = s."react-is@16.13.1";
        "react-is@^16.8.4" = s."react-is@16.13.1";
        "react-is@^17.0.1" = s."react-is@17.0.2";
        "react-redux@7.2.4" = f "react-redux" "7.2.4" y "1ebb474032b72d806de2e0519cd07761e222e225" [
          (s."@babel/runtime@^7.12.1")
          (s."@types/react-redux@^7.1.16")
          (s."hoist-non-react-statics@^3.3.2")
          (s."loose-envify@^1.4.0")
          (s."prop-types@^15.7.2")
          (s."react-is@^16.13.1")
          ];
        "react-redux@^7.2.0" = s."react-redux@7.2.4";
        "react-refresh@0.8.3" = f "react-refresh" "0.8.3" y "721d4657672d400c5e3c75d063c4a85fb2d5d68f" [];
        "react-refresh@^0.8.3" = s."react-refresh@0.8.3";
        "react-router-dom@5.2.0" = f "react-router-dom" "5.2.0" y "9e65a4d0c45e13289e66c7b17c7e175d0ea15662" [
          (s."@babel/runtime@^7.1.2")
          (s."history@^4.9.0")
          (s."loose-envify@^1.3.1")
          (s."prop-types@^15.6.2")
          (s."react-router@5.2.0")
          (s."tiny-invariant@^1.0.2")
          (s."tiny-warning@^1.0.0")
          ];
        "react-router-dom@^5.2.0" = s."react-router-dom@5.2.0";
        "react-router@5.2.0" = f "react-router" "5.2.0" y "424e75641ca8747fbf76e5ecca69781aa37ea293" [
          (s."@babel/runtime@^7.1.2")
          (s."history@^4.9.0")
          (s."hoist-non-react-statics@^3.1.0")
          (s."loose-envify@^1.3.1")
          (s."mini-create-react-context@^0.4.0")
          (s."path-to-regexp@^1.7.0")
          (s."prop-types@^15.6.2")
          (s."react-is@^16.6.0")
          (s."tiny-invariant@^1.0.2")
          (s."tiny-warning@^1.0.0")
          ];
        "react-router@^5.2.0" = s."react-router@5.2.0";
        "react-scripts@4.0.3" = f "react-scripts" "4.0.3" y "b1cafed7c3fa603e7628ba0f187787964cb5d345" [
          (s."@babel/core@7.12.3")
          (s."@pmmmwh/react-refresh-webpack-plugin@0.4.3")
          (s."@svgr/webpack@5.5.0")
          (s."@typescript-eslint/eslint-plugin@^4.5.0")
          (s."@typescript-eslint/parser@^4.5.0")
          (s."babel-eslint@^10.1.0")
          (s."babel-jest@^26.6.0")
          (s."babel-loader@8.1.0")
          (s."babel-plugin-named-asset-import@^0.3.7")
          (s."babel-preset-react-app@^10.0.0")
          (s."bfj@^7.0.2")
          (s."camelcase@^6.1.0")
          (s."case-sensitive-paths-webpack-plugin@2.3.0")
          (s."css-loader@4.3.0")
          (s."dotenv@8.2.0")
          (s."dotenv-expand@5.1.0")
          (s."eslint@^7.11.0")
          (s."eslint-config-react-app@^6.0.0")
          (s."eslint-plugin-flowtype@^5.2.0")
          (s."eslint-plugin-import@^2.22.1")
          (s."eslint-plugin-jest@^24.1.0")
          (s."eslint-plugin-jsx-a11y@^6.3.1")
          (s."eslint-plugin-react@^7.21.5")
          (s."eslint-plugin-react-hooks@^4.2.0")
          (s."eslint-plugin-testing-library@^3.9.2")
          (s."eslint-webpack-plugin@^2.5.2")
          (s."file-loader@6.1.1")
          (s."fs-extra@^9.0.1")
          (s."html-webpack-plugin@4.5.0")
          (s."identity-obj-proxy@3.0.0")
          (s."jest@26.6.0")
          (s."jest-circus@26.6.0")
          (s."jest-resolve@26.6.0")
          (s."jest-watch-typeahead@0.6.1")
          (s."mini-css-extract-plugin@0.11.3")
          (s."optimize-css-assets-webpack-plugin@5.0.4")
          (s."pnp-webpack-plugin@1.6.4")
          (s."postcss-flexbugs-fixes@4.2.1")
          (s."postcss-loader@3.0.0")
          (s."postcss-normalize@8.0.1")
          (s."postcss-preset-env@6.7.0")
          (s."postcss-safe-parser@5.0.2")
          (s."prompts@2.4.0")
          (s."react-app-polyfill@^2.0.0")
          (s."react-dev-utils@^11.0.3")
          (s."react-refresh@^0.8.3")
          (s."resolve@1.18.1")
          (s."resolve-url-loader@^3.1.2")
          (s."sass-loader@^10.0.5")
          (s."semver@7.3.2")
          (s."style-loader@1.3.0")
          (s."terser-webpack-plugin@4.2.3")
          (s."ts-pnp@1.2.0")
          (s."url-loader@4.1.1")
          (s."webpack@4.44.2")
          (s."webpack-dev-server@3.11.1")
          (s."webpack-manifest-plugin@2.2.0")
          (s."workbox-webpack-plugin@5.1.4")
          (s."fsevents@^2.1.3")
          ];
        "react@17.0.2" = f "react" "17.0.2" y "d0b5cc516d29eb3eee383f75b62864cfb6800037" [
          (s."loose-envify@^1.1.0")
          (s."object-assign@^4.1.1")
          ];
        "react@^17.0.2" = s."react@17.0.2";
        "read-pkg-up@3.0.0" = f "read-pkg-up" "3.0.0" y "3ed496685dba0f8fe118d0691dc51f4a1ff96f07" [
          (s."find-up@^2.0.0")
          (s."read-pkg@^3.0.0")
          ];
        "read-pkg-up@7.0.1" = f "read-pkg-up" "7.0.1" y "f3a6135758459733ae2b95638056e1854e7ef507" [
          (s."find-up@^4.1.0")
          (s."read-pkg@^5.2.0")
          (s."type-fest@^0.8.1")
          ];
        "read-pkg-up@^3.0.0" = s."read-pkg-up@3.0.0";
        "read-pkg-up@^7.0.1" = s."read-pkg-up@7.0.1";
        "read-pkg@3.0.0" = f "read-pkg" "3.0.0" y "9cbc686978fee65d16c00e2b19c237fcf6e38389" [
          (s."load-json-file@^4.0.0")
          (s."normalize-package-data@^2.3.2")
          (s."path-type@^3.0.0")
          ];
        "read-pkg@5.2.0" = f "read-pkg" "5.2.0" y "7bf295438ca5a33e56cd30e053b34ee7250c93cc" [
          (s."@types/normalize-package-data@^2.4.0")
          (s."normalize-package-data@^2.5.0")
          (s."parse-json@^5.0.0")
          (s."type-fest@^0.6.0")
          ];
        "read-pkg@^3.0.0" = s."read-pkg@3.0.0";
        "read-pkg@^5.2.0" = s."read-pkg@5.2.0";
        "readable-stream@1 || 2" = s."readable-stream@2.3.7";
        "readable-stream@2.3.7" = f "readable-stream" "2.3.7" y "1eca1cf711aef814c04f62252a36a62f6cb23b57" [
          (s."core-util-is@~1.0.0")
          (s."inherits@~2.0.3")
          (s."isarray@~1.0.0")
          (s."process-nextick-args@~2.0.0")
          (s."safe-buffer@~5.1.1")
          (s."string_decoder@~1.1.1")
          (s."util-deprecate@~1.0.1")
          ];
        "readable-stream@3.6.0" = f "readable-stream" "3.6.0" y "337bbda3adc0706bd3e024426a286d4b4b2c9198" [
          (s."inherits@^2.0.3")
          (s."string_decoder@^1.1.1")
          (s."util-deprecate@^1.0.1")
          ];
        "readable-stream@^2.0.0" = s."readable-stream@2.3.7";
        "readable-stream@^2.0.1" = s."readable-stream@2.3.7";
        "readable-stream@^2.0.2" = s."readable-stream@2.3.7";
        "readable-stream@^2.1.5" = s."readable-stream@2.3.7";
        "readable-stream@^2.2.2" = s."readable-stream@2.3.7";
        "readable-stream@^2.3.3" = s."readable-stream@2.3.7";
        "readable-stream@^2.3.6" = s."readable-stream@2.3.7";
        "readable-stream@^3.0.6" = s."readable-stream@3.6.0";
        "readable-stream@^3.6.0" = s."readable-stream@3.6.0";
        "readable-stream@~2.3.6" = s."readable-stream@2.3.7";
        "readdirp@2.2.1" = f "readdirp" "2.2.1" y "0e87622a3325aa33e892285caf8b4e846529a525" [
          (s."graceful-fs@^4.1.11")
          (s."micromatch@^3.1.10")
          (s."readable-stream@^2.0.2")
          ];
        "readdirp@3.6.0" = f "readdirp" "3.6.0" y "74a370bd857116e245b29cc97340cd431a02a6c7" [
          (s."picomatch@^2.2.1")
          ];
        "readdirp@^2.2.1" = s."readdirp@2.2.1";
        "readdirp@~3.6.0" = s."readdirp@3.6.0";
        "recast@0.20.5" = f "recast" "0.20.5" y "8e2c6c96827a1b339c634dd232957d230553ceae" [
          (s."ast-types@0.14.2")
          (s."esprima@~4.0.0")
          (s."source-map@~0.6.1")
          (s."tslib@^2.0.1")
          ];
        "recast@^0.20.0" = s."recast@0.20.5";
        "rechoir@0.6.2" = f "rechoir" "0.6.2" y "85204b54dba82d5742e28c96756ef43af50e3384" [
          (s."resolve@^1.1.6")
          ];
        "rechoir@^0.6.2" = s."rechoir@0.6.2";
        "recursive-readdir@2.2.2" = f "recursive-readdir" "2.2.2" y "9946fb3274e1628de6e36b2f6714953b4845094f" [
          (s."minimatch@3.0.4")
          ];
        "redent@3.0.0" = f "redent" "3.0.0" y "e557b7998316bb53c9f1f56fa626352c6963059f" [
          (s."indent-string@^4.0.0")
          (s."strip-indent@^3.0.0")
          ];
        "redent@^3.0.0" = s."redent@3.0.0";
        "redeyed@2.1.1" = f "redeyed" "2.1.1" y "8984b5815d99cb220469c99eeeffe38913e6cc0b" [
          (s."esprima@~4.0.0")
          ];
        "redeyed@~2.1.0" = s."redeyed@2.1.1";
        "redux-thunk@2.3.0" = f "redux-thunk" "2.3.0" y "51c2c19a185ed5187aaa9a2d08b666d0d6467622" [];
        "redux-thunk@^2.3.0" = s."redux-thunk@2.3.0";
        "redux@4.1.1" = f "redux" "4.1.1" y "76f1c439bb42043f985fbd9bf21990e60bd67f47" [
          (s."@babel/runtime@^7.9.2")
          ];
        "redux@^4.0.0" = s."redux@4.1.1";
        "redux@^4.1.0" = s."redux@4.1.1";
        "reflect-metadata@0.1.13" = f "reflect-metadata" "0.1.13" y "67ae3ca57c972a2aa1642b10fe363fe32d49dc08" [];
        "reflect-metadata@^0.1.13" = s."reflect-metadata@0.1.13";
        "regenerate-unicode-properties@8.2.0" = f "regenerate-unicode-properties" "8.2.0" y "e5de7111d655e7ba60c057dbe9ff37c87e65cdec" [
          (s."regenerate@^1.4.0")
          ];
        "regenerate-unicode-properties@^8.2.0" = s."regenerate-unicode-properties@8.2.0";
        "regenerate@1.4.2" = f "regenerate" "1.4.2" y "b9346d8827e8f5a32f7ba29637d398b69014848a" [];
        "regenerate@^1.4.0" = s."regenerate@1.4.2";
        "regenerator-runtime@0.11.1" = f "regenerator-runtime" "0.11.1" y "be05ad7f9bf7d22e056f9726cee5017fbf19e2e9" [];
        "regenerator-runtime@0.13.9" = f "regenerator-runtime" "0.13.9" y "8925742a98ffd90814988d7566ad30ca3b263b52" [];
        "regenerator-runtime@^0.11.0" = s."regenerator-runtime@0.11.1";
        "regenerator-runtime@^0.13.4" = s."regenerator-runtime@0.13.9";
        "regenerator-runtime@^0.13.7" = s."regenerator-runtime@0.13.9";
        "regenerator-transform@0.14.5" = f "regenerator-transform" "0.14.5" y "c98da154683671c9c4dcb16ece736517e1b7feb4" [
          (s."@babel/runtime@^7.8.4")
          ];
        "regenerator-transform@^0.14.2" = s."regenerator-transform@0.14.5";
        "regex-not@1.0.2" = f "regex-not" "1.0.2" y "1f4ece27e00b0b65e0247a6810e6a85d83a5752c" [
          (s."extend-shallow@^3.0.2")
          (s."safe-regex@^1.1.0")
          ];
        "regex-not@^1.0.0" = s."regex-not@1.0.2";
        "regex-not@^1.0.2" = s."regex-not@1.0.2";
        "regex-parser@2.2.11" = f "regex-parser" "2.2.11" y "3b37ec9049e19479806e878cabe7c1ca83ccfe58" [];
        "regex-parser@^2.2.11" = s."regex-parser@2.2.11";
        "regexp.prototype.flags@1.3.1" = f "regexp.prototype.flags" "1.3.1" y "7ef352ae8d159e758c0eadca6f8fcb4eef07be26" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          ];
        "regexp.prototype.flags@^1.2.0" = s."regexp.prototype.flags@1.3.1";
        "regexp.prototype.flags@^1.3.1" = s."regexp.prototype.flags@1.3.1";
        "regexpp@3.2.0" = f "regexpp" "3.2.0" y "0425a2768d8f23bad70ca4b90461fa2f1213e1b2" [];
        "regexpp@^3.1.0" = s."regexpp@3.2.0";
        "regexpu-core@4.7.1" = f "regexpu-core" "4.7.1" y "2dea5a9a07233298fbf0db91fa9abc4c6e0f8ad6" [
          (s."regenerate@^1.4.0")
          (s."regenerate-unicode-properties@^8.2.0")
          (s."regjsgen@^0.5.1")
          (s."regjsparser@^0.6.4")
          (s."unicode-match-property-ecmascript@^1.0.4")
          (s."unicode-match-property-value-ecmascript@^1.2.0")
          ];
        "regexpu-core@^4.7.1" = s."regexpu-core@4.7.1";
        "regjsgen@0.5.2" = f "regjsgen" "0.5.2" y "92ff295fb1deecbf6ecdab2543d207e91aa33733" [];
        "regjsgen@^0.5.1" = s."regjsgen@0.5.2";
        "regjsparser@0.6.9" = f "regjsparser" "0.6.9" y "b489eef7c9a2ce43727627011429cf833a7183e6" [
          (s."jsesc@~0.5.0")
          ];
        "regjsparser@^0.6.4" = s."regjsparser@0.6.9";
        "regl@1.7.0" = f "regl" "1.7.0" y "0d185431044a356bf80e9b775b11b935ef2746d3" [];
        "regl@^1.3.11" = s."regl@1.7.0";
        "relateurl@0.2.7" = f "relateurl" "0.2.7" y "54dbf377e51440aca90a4cd274600d3ff2d888a9" [];
        "relateurl@^0.2.7" = s."relateurl@0.2.7";
        "remove-trailing-separator@1.1.0" = f "remove-trailing-separator" "1.1.0" y "c24bce2a283adad5bc3f58e0d48249b92379d8ef" [];
        "remove-trailing-separator@^1.0.1" = s."remove-trailing-separator@1.1.0";
        "renderkid@2.0.7" = f "renderkid" "2.0.7" y "464f276a6bdcee606f4a15993f9b29fc74ca8609" [
          (s."css-select@^4.1.3")
          (s."dom-converter@^0.2.0")
          (s."htmlparser2@^6.1.0")
          (s."lodash@^4.17.21")
          (s."strip-ansi@^3.0.1")
          ];
        "renderkid@^2.0.4" = s."renderkid@2.0.7";
        "repeat-element@1.1.4" = f "repeat-element" "1.1.4" y "be681520847ab58c7568ac75fbfad28ed42d39e9" [];
        "repeat-element@^1.1.2" = s."repeat-element@1.1.4";
        "repeat-string@1.6.1" = f "repeat-string" "1.6.1" y "8dcae470e1c88abc2d600fff4a776286da75e637" [];
        "repeat-string@^1.6.1" = s."repeat-string@1.6.1";
        "require-directory@2.1.1" = f "require-directory" "2.1.1" y "8c64ad5fd30dab1c976e2344ffe7f792a6a6df42" [];
        "require-directory@^2.1.1" = s."require-directory@2.1.1";
        "require-from-string@2.0.2" = f "require-from-string" "2.0.2" y "89a7fdd938261267318eafe14f9c32e598c36909" [];
        "require-from-string@^2.0.2" = s."require-from-string@2.0.2";
        "require-main-filename@2.0.0" = f "require-main-filename" "2.0.0" y "d0b329ecc7cc0f61649f62215be69af54aa8989b" [];
        "require-main-filename@^2.0.0" = s."require-main-filename@2.0.0";
        "requires-port@1.0.0" = f "requires-port" "1.0.0" y "925d2601d39ac485e091cf0da5c6e694dc3dcaff" [];
        "requires-port@^1.0.0" = s."requires-port@1.0.0";
        "reselect@4.0.0" = f "reselect" "4.0.0" y "f2529830e5d3d0e021408b246a206ef4ea4437f7" [];
        "reselect@^4.0.0" = s."reselect@4.0.0";
        "resize-observer-polyfill@1.5.1" = f "resize-observer-polyfill" "1.5.1" y "0e9020dd3d21024458d4ebd27e23e40269810464" [];
        "resize-observer-polyfill@^1.5.0" = s."resize-observer-polyfill@1.5.1";
        "resize-observer-polyfill@^1.5.1" = s."resize-observer-polyfill@1.5.1";
        "resolve-cwd@2.0.0" = f "resolve-cwd" "2.0.0" y "00a9f7387556e27038eae232caa372a6a59b665a" [
          (s."resolve-from@^3.0.0")
          ];
        "resolve-cwd@3.0.0" = f "resolve-cwd" "3.0.0" y "0f0075f1bb2544766cf73ba6a6e2adfebcb13f2d" [
          (s."resolve-from@^5.0.0")
          ];
        "resolve-cwd@^2.0.0" = s."resolve-cwd@2.0.0";
        "resolve-cwd@^3.0.0" = s."resolve-cwd@3.0.0";
        "resolve-from@3.0.0" = f "resolve-from" "3.0.0" y "b22c7af7d9d6881bc8b6e653335eebcb0a188748" [];
        "resolve-from@4.0.0" = f "resolve-from" "4.0.0" y "4abcd852ad32dd7baabfe9b40e00a36db5f392e6" [];
        "resolve-from@5.0.0" = f "resolve-from" "5.0.0" y "c35225843df8f776df21c57557bc087e9dfdfc69" [];
        "resolve-from@^3.0.0" = s."resolve-from@3.0.0";
        "resolve-from@^4.0.0" = s."resolve-from@4.0.0";
        "resolve-from@^5.0.0" = s."resolve-from@5.0.0";
        "resolve-pathname@3.0.0" = f "resolve-pathname" "3.0.0" y "99d02224d3cf263689becbb393bc560313025dcd" [];
        "resolve-pathname@^3.0.0" = s."resolve-pathname@3.0.0";
        "resolve-url-loader@3.1.4" = f "resolve-url-loader" "3.1.4" y "3c16caebe0b9faea9c7cc252fa49d2353c412320" [
          (s."adjust-sourcemap-loader@3.0.0")
          (s."camelcase@5.3.1")
          (s."compose-function@3.0.3")
          (s."convert-source-map@1.7.0")
          (s."es6-iterator@2.0.3")
          (s."loader-utils@1.2.3")
          (s."postcss@7.0.36")
          (s."rework@1.0.1")
          (s."rework-visit@1.0.0")
          (s."source-map@0.6.1")
          ];
        "resolve-url-loader@^3.1.2" = s."resolve-url-loader@3.1.4";
        "resolve-url@0.2.1" = f "resolve-url" "0.2.1" y "2c637fe77c893afd2a663fe21aa9080068e2052a" [];
        "resolve-url@^0.2.1" = s."resolve-url@0.2.1";
        "resolve@1.18.1" = f "resolve" "1.18.1" y "018fcb2c5b207d2a6424aee361c5a266da8f4130" [
          (s."is-core-module@^2.0.0")
          (s."path-parse@^1.0.6")
          ];
        "resolve@1.20.0" = f "resolve" "1.20.0" y "629a013fb3f70755d6f0b7935cc1c2c5378b1975" [
          (s."is-core-module@^2.2.0")
          (s."path-parse@^1.0.6")
          ];
        "resolve@2.0.0-next.3" = f "resolve" "2.0.0-next.3" y "d41016293d4a8586a39ca5d9b5f15cbea1f55e46" [
          (s."is-core-module@^2.2.0")
          (s."path-parse@^1.0.6")
          ];
        "resolve@^1.1.6" = s."resolve@1.20.0";
        "resolve@^1.10.0" = s."resolve@1.20.0";
        "resolve@^1.12.0" = s."resolve@1.20.0";
        "resolve@^1.13.1" = s."resolve@1.20.0";
        "resolve@^1.14.2" = s."resolve@1.20.0";
        "resolve@^1.17.0" = s."resolve@1.20.0";
        "resolve@^1.18.1" = s."resolve@1.20.0";
        "resolve@^1.20.0" = s."resolve@1.20.0";
        "resolve@^1.3.2" = s."resolve@1.20.0";
        "resolve@^1.8.1" = s."resolve@1.20.0";
        "resolve@^2.0.0-next.3" = s."resolve@2.0.0-next.3";
        "restore-cursor@2.0.0" = f "restore-cursor" "2.0.0" y "9f7ee287f82fd326d4fd162923d62129eee0dfaf" [
          (s."onetime@^2.0.0")
          (s."signal-exit@^3.0.2")
          ];
        "restore-cursor@^2.0.0" = s."restore-cursor@2.0.0";
        "ret@0.1.15" = f "ret" "0.1.15" y "b8a4825d5bdb1fc3f6f53c2bc33f81388681c7bc" [];
        "ret@~0.1.10" = s."ret@0.1.15";
        "retry@0.12.0" = f "retry" "0.12.0" y "1b42a6266a21f07421d1b0b54b7dc167b01c013b" [];
        "retry@^0.12.0" = s."retry@0.12.0";
        "reusify@1.0.4" = f "reusify" "1.0.4" y "90da382b1e126efc02146e90845a88db12925d76" [];
        "reusify@^1.0.4" = s."reusify@1.0.4";
        "rework-visit@1.0.0" = f "rework-visit" "1.0.0" y "9945b2803f219e2f7aca00adb8bc9f640f842c9a" [];
        "rework@1.0.1" = f "rework" "1.0.1" y "30806a841342b54510aa4110850cd48534144aa7" [
          (s."convert-source-map@^0.3.3")
          (s."css@^2.0.0")
          ];
        "rgb-regex@1.0.1" = f "rgb-regex" "1.0.1" y "c0e0d6882df0e23be254a475e8edd41915feaeb1" [];
        "rgb-regex@^1.0.1" = s."rgb-regex@1.0.1";
        "rgba-regex@1.0.0" = f "rgba-regex" "1.0.0" y "43374e2e2ca0968b0ef1523460b7d730ff22eeb3" [];
        "rgba-regex@^1.0.0" = s."rgba-regex@1.0.0";
        "rimraf@2.7.1" = f "rimraf" "2.7.1" y "35797f13a7fdadc566142c29d4f07ccad483e3ec" [
          (s."glob@^7.1.3")
          ];
        "rimraf@3.0.2" = f "rimraf" "3.0.2" y "f1a5402ba6220ad52cc1282bac1ae3aa49fd061a" [
          (s."glob@^7.1.3")
          ];
        "rimraf@^2.5.4" = s."rimraf@2.7.1";
        "rimraf@^2.6.3" = s."rimraf@2.7.1";
        "rimraf@^3.0.0" = s."rimraf@3.0.2";
        "rimraf@^3.0.2" = s."rimraf@3.0.2";
        "ripemd160@2.0.2" = f "ripemd160" "2.0.2" y "a1c1a6f624751577ba5d07914cbc92850585890c" [
          (s."hash-base@^3.0.0")
          (s."inherits@^2.0.1")
          ];
        "ripemd160@^2.0.0" = s."ripemd160@2.0.2";
        "ripemd160@^2.0.1" = s."ripemd160@2.0.2";
        "roarr@2.15.4" = f "roarr" "2.15.4" y "f5fe795b7b838ccfe35dc608e0282b9eba2e7afd" [
          (s."boolean@^3.0.1")
          (s."detect-node@^2.0.4")
          (s."globalthis@^1.0.1")
          (s."json-stringify-safe@^5.0.1")
          (s."semver-compare@^1.0.0")
          (s."sprintf-js@^1.1.2")
          ];
        "roarr@^2.15.3" = s."roarr@2.15.4";
        "rollup-plugin-babel@4.4.0" = f "rollup-plugin-babel" "4.4.0" y "d15bd259466a9d1accbdb2fe2fff17c52d030acb" [
          (s."@babel/helper-module-imports@^7.0.0")
          (s."rollup-pluginutils@^2.8.1")
          ];
        "rollup-plugin-babel@^4.3.3" = s."rollup-plugin-babel@4.4.0";
        "rollup-plugin-terser@5.3.1" = f "rollup-plugin-terser" "5.3.1" y "8c650062c22a8426c64268548957463bf981b413" [
          (s."@babel/code-frame@^7.5.5")
          (s."jest-worker@^24.9.0")
          (s."rollup-pluginutils@^2.8.2")
          (s."serialize-javascript@^4.0.0")
          (s."terser@^4.6.2")
          ];
        "rollup-plugin-terser@^5.3.1" = s."rollup-plugin-terser@5.3.1";
        "rollup-pluginutils@2.8.2" = f "rollup-pluginutils" "2.8.2" y "72f2af0748b592364dbd3389e600e5a9444a351e" [
          (s."estree-walker@^0.6.1")
          ];
        "rollup-pluginutils@^2.8.1" = s."rollup-pluginutils@2.8.2";
        "rollup-pluginutils@^2.8.2" = s."rollup-pluginutils@2.8.2";
        "rollup@1.32.1" = f "rollup" "1.32.1" y "4480e52d9d9e2ae4b46ba0d9ddeaf3163940f9c4" [
          (s."@types/estree@*")
          (s."@types/node@*")
          (s."acorn@^7.1.0")
          ];
        "rollup@^1.31.1" = s."rollup@1.32.1";
        "rsvp@4.8.5" = f "rsvp" "4.8.5" y "c8f155311d167f68f21e168df71ec5b083113734" [];
        "rsvp@^4.8.4" = s."rsvp@4.8.5";
        "run-parallel@1.2.0" = f "run-parallel" "1.2.0" y "66d1368da7bdf921eb9d95bd1a9229e7f21a43ee" [
          (s."queue-microtask@^1.2.2")
          ];
        "run-parallel@^1.1.9" = s."run-parallel@1.2.0";
        "run-queue@1.0.3" = f "run-queue" "1.0.3" y "e848396f057d223f24386924618e25694161ec47" [
          (s."aproba@^1.1.1")
          ];
        "run-queue@^1.0.0" = s."run-queue@1.0.3";
        "run-queue@^1.0.3" = s."run-queue@1.0.3";
        "rxjs@6.6.7" = f "rxjs" "6.6.7" y "90ac018acabf491bf65044235d5863c4dab804c9" [
          (s."tslib@^1.9.0")
          ];
        "rxjs@^6.3.3" = s."rxjs@6.6.7";
        "safe-buffer@5.1.2" = f "safe-buffer" "5.1.2" y "991ec69d296e0313747d59bdfd2b745c35f8828d" [];
        "safe-buffer@5.2.1" = f "safe-buffer" "5.2.1" y "1eaf9fa9bdb1fdd4ec75f58f9cdb4e6b7827eec6" [];
        "safe-buffer@>=5.1.0" = s."safe-buffer@5.2.1";
        "safe-buffer@^5.0.1" = s."safe-buffer@5.2.1";
        "safe-buffer@^5.1.0" = s."safe-buffer@5.2.1";
        "safe-buffer@^5.1.1" = s."safe-buffer@5.2.1";
        "safe-buffer@^5.1.2" = s."safe-buffer@5.2.1";
        "safe-buffer@^5.2.0" = s."safe-buffer@5.2.1";
        "safe-buffer@~5.1.0" = s."safe-buffer@5.1.2";
        "safe-buffer@~5.1.1" = s."safe-buffer@5.1.2";
        "safe-buffer@~5.2.0" = s."safe-buffer@5.2.1";
        "safe-regex@1.1.0" = f "safe-regex" "1.1.0" y "40a3669f3b077d1e943d44629e157dd48023bf2e" [
          (s."ret@~0.1.10")
          ];
        "safe-regex@^1.1.0" = s."safe-regex@1.1.0";
        "safer-buffer@2.1.2" = f "safer-buffer" "2.1.2" y "44fa161b0187b9549dd84bb91802f9bd8385cd6a" [];
        "safer-buffer@>= 2.1.2 < 3" = s."safer-buffer@2.1.2";
        "safer-buffer@^2.1.0" = s."safer-buffer@2.1.2";
        "sane@4.1.0" = f "sane" "4.1.0" y "ed881fd922733a6c461bc189dc2b6c006f3ffded" [
          (s."@cnakazawa/watch@^1.0.3")
          (s."anymatch@^2.0.0")
          (s."capture-exit@^2.0.0")
          (s."exec-sh@^0.3.2")
          (s."execa@^1.0.0")
          (s."fb-watchman@^2.0.0")
          (s."micromatch@^3.1.4")
          (s."minimist@^1.1.1")
          (s."walker@~1.0.5")
          ];
        "sane@^4.0.3" = s."sane@4.1.0";
        "sanitize.css@10.0.0" = f "sanitize.css" "10.0.0" y "b5cb2547e96d8629a60947544665243b1dc3657a" [];
        "sanitize.css@^10.0.0" = s."sanitize.css@10.0.0";
        "sass-loader@10.2.0" = f "sass-loader" "10.2.0" y "3d64c1590f911013b3fa48a0b22a83d5e1494716" [
          (s."klona@^2.0.4")
          (s."loader-utils@^2.0.0")
          (s."neo-async@^2.6.2")
          (s."schema-utils@^3.0.0")
          (s."semver@^7.3.2")
          ];
        "sass-loader@^10.0.5" = s."sass-loader@10.2.0";
        "sass@1.37.5" = f "sass" "1.37.5" y "f6838351f7cc814c4fcfe1d9a20e0cabbd1e7b3c" [
          (s."chokidar@>=3.0.0 <4.0.0")
          ];
        "sass@^1.37.5" = s."sass@1.37.5";
        "sax@1.2.4" = f "sax" "1.2.4" y "2816234e2378bddc4e5354fab5caa895df7100d9" [];
        "sax@~1.2.4" = s."sax@1.2.4";
        "saxes@5.0.1" = f "saxes" "5.0.1" y "eebab953fa3b7608dbe94e5dadb15c888fa6696d" [
          (s."xmlchars@^2.2.0")
          ];
        "saxes@^5.0.1" = s."saxes@5.0.1";
        "scheduler@0.20.2" = f "scheduler" "0.20.2" y "4baee39436e34aa93b4874bddcbf0fe8b8b50e91" [
          (s."loose-envify@^1.1.0")
          (s."object-assign@^4.1.1")
          ];
        "scheduler@^0.20.2" = s."scheduler@0.20.2";
        "schema-utils@1.0.0" = f "schema-utils" "1.0.0" y "0b79a93204d7b600d4b2850d1f66c2a34951c770" [
          (s."ajv@^6.1.0")
          (s."ajv-errors@^1.0.0")
          (s."ajv-keywords@^3.1.0")
          ];
        "schema-utils@2.7.1" = f "schema-utils" "2.7.1" y "1ca4f32d1b24c590c203b8e7a50bf0ea4cd394d7" [
          (s."@types/json-schema@^7.0.5")
          (s."ajv@^6.12.4")
          (s."ajv-keywords@^3.5.2")
          ];
        "schema-utils@3.1.1" = f "schema-utils" "3.1.1" y "bc74c4b6b6995c1d88f76a8b77bea7219e0c8281" [
          (s."@types/json-schema@^7.0.8")
          (s."ajv@^6.12.5")
          (s."ajv-keywords@^3.5.2")
          ];
        "schema-utils@^1.0.0" = s."schema-utils@1.0.0";
        "schema-utils@^2.6.5" = s."schema-utils@2.7.1";
        "schema-utils@^2.7.0" = s."schema-utils@2.7.1";
        "schema-utils@^2.7.1" = s."schema-utils@2.7.1";
        "schema-utils@^3.0.0" = s."schema-utils@3.1.1";
        "scroll-into-view-if-needed@2.2.28" = f "scroll-into-view-if-needed" "2.2.28" y "5a15b2f58a52642c88c8eca584644e01703d645a" [
          (s."compute-scroll-into-view@^1.0.17")
          ];
        "scroll-into-view-if-needed@^2.2.25" = s."scroll-into-view-if-needed@2.2.28";
        "select-hose@2.0.0" = f "select-hose" "2.0.0" y "625d8658f865af43ec962bfc376a37359a4994ca" [];
        "select-hose@^2.0.0" = s."select-hose@2.0.0";
        "selfsigned@1.10.11" = f "selfsigned" "1.10.11" y "24929cd906fe0f44b6d01fb23999a739537acbe9" [
          (s."node-forge@^0.10.0")
          ];
        "selfsigned@^1.10.8" = s."selfsigned@1.10.11";
        "semver-compare@1.0.0" = f "semver-compare" "1.0.0" y "0dee216a1c941ab37e9efb1788f6afc5ff5537fc" [];
        "semver-compare@^1.0.0" = s."semver-compare@1.0.0";
        "semver@2 || 3 || 4 || 5" = s."semver@5.7.1";
        "semver@5.7.1" = f "semver" "5.7.1" y "a954f931aeba508d307bbf069eff0c01c96116f7" [];
        "semver@6.3.0" = f "semver" "6.3.0" y "ee0a64c8af5e8ceea67687b133761e1becbd1d3d" [];
        "semver@7.0.0" = f "semver" "7.0.0" y "5f3ca35761e47e05b206c6daff2cf814f0316b8e" [];
        "semver@7.3.2" = f "semver" "7.3.2" y "604962b052b81ed0786aae84389ffba70ffd3938" [];
        "semver@7.3.5" = f "semver" "7.3.5" y "0b621c879348d8998e4b0e4be94b3f12e6018ef7" [
          (s."lru-cache@^6.0.0")
          ];
        "semver@^5.4.1" = s."semver@5.7.1";
        "semver@^5.5.0" = s."semver@5.7.1";
        "semver@^5.5.1" = s."semver@5.7.1";
        "semver@^5.6.0" = s."semver@5.7.1";
        "semver@^6.0.0" = s."semver@6.3.0";
        "semver@^6.1.1" = s."semver@6.3.0";
        "semver@^6.1.2" = s."semver@6.3.0";
        "semver@^6.3.0" = s."semver@6.3.0";
        "semver@^7.2.1" = s."semver@7.3.5";
        "semver@^7.3.2" = s."semver@7.3.5";
        "semver@^7.3.5" = s."semver@7.3.5";
        "send@0.17.1" = f "send" "0.17.1" y "c1d8b059f7900f7466dd4938bdc44e11ddb376c8" [
          (s."debug@2.6.9")
          (s."depd@~1.1.2")
          (s."destroy@~1.0.4")
          (s."encodeurl@~1.0.2")
          (s."escape-html@~1.0.3")
          (s."etag@~1.8.1")
          (s."fresh@0.5.2")
          (s."http-errors@~1.7.2")
          (s."mime@1.6.0")
          (s."ms@2.1.1")
          (s."on-finished@~2.3.0")
          (s."range-parser@~1.2.1")
          (s."statuses@~1.5.0")
          ];
        "sentence-case@3.0.4" = f "sentence-case" "3.0.4" y "3645a7b8c117c787fde8702056225bb62a45131f" [
          (s."no-case@^3.0.4")
          (s."tslib@^2.0.3")
          (s."upper-case-first@^2.0.2")
          ];
        "sentence-case@^3.0.4" = s."sentence-case@3.0.4";
        "serialize-error@7.0.1" = f "serialize-error" "7.0.1" y "f1360b0447f61ffb483ec4157c737fab7d778e18" [
          (s."type-fest@^0.13.1")
          ];
        "serialize-error@^7.0.1" = s."serialize-error@7.0.1";
        "serialize-javascript@4.0.0" = f "serialize-javascript" "4.0.0" y "b525e1238489a5ecfc42afacc3fe99e666f4b1aa" [
          (s."randombytes@^2.1.0")
          ];
        "serialize-javascript@5.0.1" = f "serialize-javascript" "5.0.1" y "7886ec848049a462467a97d3d918ebb2aaf934f4" [
          (s."randombytes@^2.1.0")
          ];
        "serialize-javascript@^4.0.0" = s."serialize-javascript@4.0.0";
        "serialize-javascript@^5.0.1" = s."serialize-javascript@5.0.1";
        "serve-index@1.9.1" = f "serve-index" "1.9.1" y "d3768d69b1e7d82e5ce050fff5b453bea12a9239" [
          (s."accepts@~1.3.4")
          (s."batch@0.6.1")
          (s."debug@2.6.9")
          (s."escape-html@~1.0.3")
          (s."http-errors@~1.6.2")
          (s."mime-types@~2.1.17")
          (s."parseurl@~1.3.2")
          ];
        "serve-index@^1.9.1" = s."serve-index@1.9.1";
        "serve-static@1.14.1" = f "serve-static" "1.14.1" y "666e636dc4f010f7ef29970a88a674320898b2f9" [
          (s."encodeurl@~1.0.2")
          (s."escape-html@~1.0.3")
          (s."parseurl@~1.3.3")
          (s."send@0.17.1")
          ];
        "set-blocking@2.0.0" = f "set-blocking" "2.0.0" y "045f9782d011ae9a6803ddd382b24392b3d890f7" [];
        "set-blocking@^2.0.0" = s."set-blocking@2.0.0";
        "set-value@2.0.1" = f "set-value" "2.0.1" y "a18d40530e6f07de4228c7defe4227af8cad005b" [
          (s."extend-shallow@^2.0.1")
          (s."is-extendable@^0.1.1")
          (s."is-plain-object@^2.0.3")
          (s."split-string@^3.0.1")
          ];
        "set-value@^2.0.0" = s."set-value@2.0.1";
        "set-value@^2.0.1" = s."set-value@2.0.1";
        "setimmediate@1.0.5" = f "setimmediate" "1.0.5" y "290cbb232e306942d7d7ea9b83732ab7856f8285" [];
        "setimmediate@^1.0.4" = s."setimmediate@1.0.5";
        "setprototypeof@1.1.0" = f "setprototypeof" "1.1.0" y "d0bd85536887b6fe7c0d818cb962d9d91c54e656" [];
        "setprototypeof@1.1.1" = f "setprototypeof" "1.1.1" y "7e95acb24aa92f5885e0abef5ba131330d4ae683" [];
        "sha.js@2.4.11" = f "sha.js" "2.4.11" y "37a5cf0b81ecbc6943de109ba2960d1b26584ae7" [
          (s."inherits@^2.0.1")
          (s."safe-buffer@^5.0.1")
          ];
        "sha.js@^2.4.0" = s."sha.js@2.4.11";
        "sha.js@^2.4.11" = s."sha.js@2.4.11";
        "sha.js@^2.4.8" = s."sha.js@2.4.11";
        "shallowequal@1.1.0" = f "shallowequal" "1.1.0" y "188d521de95b9087404fd4dcb68b13df0ae4e7f8" [];
        "shallowequal@^1.1.0" = s."shallowequal@1.1.0";
        "shebang-command@1.2.0" = f "shebang-command" "1.2.0" y "44aac65b695b03398968c39f363fee5deafdf1ea" [
          (s."shebang-regex@^1.0.0")
          ];
        "shebang-command@2.0.0" = f "shebang-command" "2.0.0" y "ccd0af4f8835fbdc265b82461aaf0c36663f34ea" [
          (s."shebang-regex@^3.0.0")
          ];
        "shebang-command@^1.2.0" = s."shebang-command@1.2.0";
        "shebang-command@^2.0.0" = s."shebang-command@2.0.0";
        "shebang-regex@1.0.0" = f "shebang-regex" "1.0.0" y "da42f49740c0b42db2ca9728571cb190c98efea3" [];
        "shebang-regex@3.0.0" = f "shebang-regex" "3.0.0" y "ae16f1644d873ecad843b0307b143362d4c42172" [];
        "shebang-regex@^1.0.0" = s."shebang-regex@1.0.0";
        "shebang-regex@^3.0.0" = s."shebang-regex@3.0.0";
        "shell-quote@1.7.2" = f "shell-quote" "1.7.2" y "67a7d02c76c9da24f99d20808fcaded0e0e04be2" [];
        "shell-quote@^1.6.1" = s."shell-quote@1.7.2";
        "shelljs@0.8.4" = f "shelljs" "0.8.4" y "de7684feeb767f8716b326078a8a00875890e3c2" [
          (s."glob@^7.0.0")
          (s."interpret@^1.0.0")
          (s."rechoir@^0.6.2")
          ];
        "shellwords@0.1.1" = f "shellwords" "0.1.1" y "d6b9181c1a48d397324c84871efbcfc73fc0654b" [];
        "shellwords@^0.1.1" = s."shellwords@0.1.1";
        "side-channel@1.0.4" = f "side-channel" "1.0.4" y "efce5c8fdc104ee751b25c58d4290011fa5ea2cf" [
          (s."call-bind@^1.0.0")
          (s."get-intrinsic@^1.0.2")
          (s."object-inspect@^1.9.0")
          ];
        "side-channel@^1.0.4" = s."side-channel@1.0.4";
        "signal-exit@3.0.3" = f "signal-exit" "3.0.3" y "a1410c2edd8f077b08b4e253c8eacfcaf057461c" [];
        "signal-exit@^3.0.0" = s."signal-exit@3.0.3";
        "signal-exit@^3.0.2" = s."signal-exit@3.0.3";
        "simple-swizzle@0.2.2" = f "simple-swizzle" "0.2.2" y "a4da6b635ffcccca33f70d17cb92592de95e557a" [
          (s."is-arrayish@^0.3.1")
          ];
        "simple-swizzle@^0.2.2" = s."simple-swizzle@0.2.2";
        "sisteransi@1.0.5" = f "sisteransi" "1.0.5" y "134d681297756437cc05ca01370d3a7a571075ed" [];
        "sisteransi@^1.0.5" = s."sisteransi@1.0.5";
        "size-sensor@1.0.1" = f "size-sensor" "1.0.1" y "f84e46206d3e259faff1d548e4b3beca93219dbb" [];
        "size-sensor@^1.0.1" = s."size-sensor@1.0.1";
        "slash@3.0.0" = f "slash" "3.0.0" y "6539be870c165adbd5240220dbe361f1bc4d4634" [];
        "slash@^3.0.0" = s."slash@3.0.0";
        "slice-ansi@0.0.4" = f "slice-ansi" "0.0.4" y "edbf8903f66f7ce2f8eafd6ceed65e264c831b35" [];
        "slice-ansi@4.0.0" = f "slice-ansi" "4.0.0" y "500e8dd0fd55b05815086255b3195adf2a45fe6b" [
          (s."ansi-styles@^4.0.0")
          (s."astral-regex@^2.0.0")
          (s."is-fullwidth-code-point@^3.0.0")
          ];
        "slice-ansi@^4.0.0" = s."slice-ansi@4.0.0";
        "snake-case@3.0.4" = f "snake-case" "3.0.4" y "4f2bbd568e9935abdfd593f34c691dadb49c452c" [
          (s."dot-case@^3.0.4")
          (s."tslib@^2.0.3")
          ];
        "snake-case@^3.0.4" = s."snake-case@3.0.4";
        "snapdragon-node@2.1.1" = f "snapdragon-node" "2.1.1" y "6c175f86ff14bdb0724563e8f3c1b021a286853b" [
          (s."define-property@^1.0.0")
          (s."isobject@^3.0.0")
          (s."snapdragon-util@^3.0.1")
          ];
        "snapdragon-node@^2.0.1" = s."snapdragon-node@2.1.1";
        "snapdragon-util@3.0.1" = f "snapdragon-util" "3.0.1" y "f956479486f2acd79700693f6f7b805e45ab56e2" [
          (s."kind-of@^3.2.0")
          ];
        "snapdragon-util@^3.0.1" = s."snapdragon-util@3.0.1";
        "snapdragon@0.8.2" = f "snapdragon" "0.8.2" y "64922e7c565b0e14204ba1aa7d6964278d25182d" [
          (s."base@^0.11.1")
          (s."debug@^2.2.0")
          (s."define-property@^0.2.5")
          (s."extend-shallow@^2.0.1")
          (s."map-cache@^0.2.2")
          (s."source-map@^0.5.6")
          (s."source-map-resolve@^0.5.0")
          (s."use@^3.1.0")
          ];
        "snapdragon@^0.8.1" = s."snapdragon@0.8.2";
        "sockjs-client@1.5.1" = f "sockjs-client" "1.5.1" y "256908f6d5adfb94dabbdbd02c66362cca0f9ea6" [
          (s."debug@^3.2.6")
          (s."eventsource@^1.0.7")
          (s."faye-websocket@^0.11.3")
          (s."inherits@^2.0.4")
          (s."json3@^3.3.3")
          (s."url-parse@^1.5.1")
          ];
        "sockjs-client@^1.5.0" = s."sockjs-client@1.5.1";
        "sockjs@0.3.21" = f "sockjs" "0.3.21" y "b34ffb98e796930b60a0cfa11904d6a339a7d417" [
          (s."faye-websocket@^0.11.3")
          (s."uuid@^3.4.0")
          (s."websocket-driver@^0.7.4")
          ];
        "sockjs@^0.3.21" = s."sockjs@0.3.21";
        "sort-keys@1.1.2" = f "sort-keys" "1.1.2" y "441b6d4d346798f1b4e49e8920adfba0e543f9ad" [
          (s."is-plain-obj@^1.0.0")
          ];
        "sort-keys@^1.0.0" = s."sort-keys@1.1.2";
        "source-list-map@2.0.1" = f "source-list-map" "2.0.1" y "3993bd873bfc48479cca9ea3a547835c7c154b34" [];
        "source-list-map@^2.0.0" = s."source-list-map@2.0.1";
        "source-map-js@0.6.2" = f "source-map-js" "0.6.2" y "0bb5de631b41cfbda6cfba8bd05a80efdfd2385e" [];
        "source-map-js@^0.6.2" = s."source-map-js@0.6.2";
        "source-map-resolve@0.5.3" = f "source-map-resolve" "0.5.3" y "190866bece7553e1f8f267a2ee82c606b5509a1a" [
          (s."atob@^2.1.2")
          (s."decode-uri-component@^0.2.0")
          (s."resolve-url@^0.2.1")
          (s."source-map-url@^0.4.0")
          (s."urix@^0.1.0")
          ];
        "source-map-resolve@^0.5.0" = s."source-map-resolve@0.5.3";
        "source-map-resolve@^0.5.2" = s."source-map-resolve@0.5.3";
        "source-map-support@0.5.19" = f "source-map-support" "0.5.19" y "a98b62f86dcaf4f67399648c085291ab9e8fed61" [
          (s."buffer-from@^1.0.0")
          (s."source-map@^0.6.0")
          ];
        "source-map-support@0.5.20" = f "source-map-support" "0.5.20" y "12166089f8f5e5e8c56926b377633392dd2cb6c9" [
          (s."buffer-from@^1.0.0")
          (s."source-map@^0.6.0")
          ];
        "source-map-support@^0.5.17" = s."source-map-support@0.5.20";
        "source-map-support@^0.5.6" = s."source-map-support@0.5.19";
        "source-map-support@~0.5.12" = s."source-map-support@0.5.19";
        "source-map-support@~0.5.19" = s."source-map-support@0.5.19";
        "source-map-url@0.4.1" = f "source-map-url" "0.4.1" y "0af66605a745a5a2f91cf1bbf8a7afbc283dec56" [];
        "source-map-url@^0.4.0" = s."source-map-url@0.4.1";
        "source-map@0.5.7" = f "source-map" "0.5.7" y "8a039d2d1021d22d1ea14c80d8ea468ba2ef3fcc" [];
        "source-map@0.6.1" = f "source-map" "0.6.1" y "74722af32e9614e9c287a8d0bbde48b5e2f1a263" [];
        "source-map@0.7.3" = f "source-map" "0.7.3" y "5302f8169031735226544092e64981f751750383" [];
        "source-map@^0.5.0" = s."source-map@0.5.7";
        "source-map@^0.5.6" = s."source-map@0.5.7";
        "source-map@^0.6.0" = s."source-map@0.6.1";
        "source-map@^0.6.1" = s."source-map@0.6.1";
        "source-map@^0.7.3" = s."source-map@0.7.3";
        "source-map@~0.6.0" = s."source-map@0.6.1";
        "source-map@~0.6.1" = s."source-map@0.6.1";
        "source-map@~0.7.2" = s."source-map@0.7.3";
        "sourcemap-codec@1.4.8" = f "sourcemap-codec" "1.4.8" y "ea804bd94857402e6992d05a38ef1ae35a9ab4c4" [];
        "sourcemap-codec@^1.4.4" = s."sourcemap-codec@1.4.8";
        "spdx-correct@3.1.1" = f "spdx-correct" "3.1.1" y "dece81ac9c1e6713e5f7d1b6f17d468fa53d89a9" [
          (s."spdx-expression-parse@^3.0.0")
          (s."spdx-license-ids@^3.0.0")
          ];
        "spdx-correct@^3.0.0" = s."spdx-correct@3.1.1";
        "spdx-exceptions@2.3.0" = f "spdx-exceptions" "2.3.0" y "3f28ce1a77a00372683eade4a433183527a2163d" [];
        "spdx-exceptions@^2.1.0" = s."spdx-exceptions@2.3.0";
        "spdx-expression-parse@3.0.1" = f "spdx-expression-parse" "3.0.1" y "cf70f50482eefdc98e3ce0a6833e4a53ceeba679" [
          (s."spdx-exceptions@^2.1.0")
          (s."spdx-license-ids@^3.0.0")
          ];
        "spdx-expression-parse@^3.0.0" = s."spdx-expression-parse@3.0.1";
        "spdx-license-ids@3.0.9" = f "spdx-license-ids" "3.0.9" y "8a595135def9592bda69709474f1cbeea7c2467f" [];
        "spdx-license-ids@^3.0.0" = s."spdx-license-ids@3.0.9";
        "spdy-transport@3.0.0" = f "spdy-transport" "3.0.0" y "00d4863a6400ad75df93361a1608605e5dcdcf31" [
          (s."debug@^4.1.0")
          (s."detect-node@^2.0.4")
          (s."hpack.js@^2.1.6")
          (s."obuf@^1.1.2")
          (s."readable-stream@^3.0.6")
          (s."wbuf@^1.7.3")
          ];
        "spdy-transport@^3.0.0" = s."spdy-transport@3.0.0";
        "spdy@4.0.2" = f "spdy" "4.0.2" y "b74f466203a3eda452c02492b91fb9e84a27677b" [
          (s."debug@^4.1.0")
          (s."handle-thing@^2.0.0")
          (s."http-deceiver@^1.2.7")
          (s."select-hose@^2.0.0")
          (s."spdy-transport@^3.0.0")
          ];
        "spdy@^4.0.2" = s."spdy@4.0.2";
        "split-on-first@1.1.0" = f "split-on-first" "1.1.0" y "f610afeee3b12bce1d0c30425e76398b78249a5f" [];
        "split-on-first@^1.0.0" = s."split-on-first@1.1.0";
        "split-string@3.1.0" = f "split-string" "3.1.0" y "7cb09dda3a86585705c64b39a6466038682e8fe2" [
          (s."extend-shallow@^3.0.0")
          ];
        "split-string@^3.0.1" = s."split-string@3.1.0";
        "split-string@^3.0.2" = s."split-string@3.1.0";
        "sprintf-js@1.0.3" = f "sprintf-js" "1.0.3" y "04e6926f662895354f3dd015203633b857297e2c" [];
        "sprintf-js@1.1.2" = f "sprintf-js" "1.1.2" y "da1765262bf8c0f571749f2ad6c26300207ae673" [];
        "sprintf-js@^1.1.2" = s."sprintf-js@1.1.2";
        "sprintf-js@~1.0.2" = s."sprintf-js@1.0.3";
        "ssri@6.0.2" = f "ssri" "6.0.2" y "157939134f20464e7301ddba3e90ffa8f7728ac5" [
          (s."figgy-pudding@^3.5.1")
          ];
        "ssri@8.0.1" = f "ssri" "8.0.1" y "638e4e439e2ffbd2cd289776d5ca457c4f51a2af" [
          (s."minipass@^3.1.1")
          ];
        "ssri@^6.0.1" = s."ssri@6.0.2";
        "ssri@^8.0.1" = s."ssri@8.0.1";
        "stable@0.1.8" = f "stable" "0.1.8" y "836eb3c8382fe2936feaf544631017ce7d47a3cf" [];
        "stable@^0.1.8" = s."stable@0.1.8";
        "stack-utils@2.0.3" = f "stack-utils" "2.0.3" y "cd5f030126ff116b78ccb3c027fe302713b61277" [
          (s."escape-string-regexp@^2.0.0")
          ];
        "stack-utils@^2.0.2" = s."stack-utils@2.0.3";
        "stackframe@1.2.0" = f "stackframe" "1.2.0" y "52429492d63c62eb989804c11552e3d22e779303" [];
        "stackframe@^1.1.1" = s."stackframe@1.2.0";
        "static-extend@0.1.2" = f "static-extend" "0.1.2" y "60809c39cbff55337226fd5e0b520f341f1fb5c6" [
          (s."define-property@^0.2.5")
          (s."object-copy@^0.1.0")
          ];
        "static-extend@^0.1.1" = s."static-extend@0.1.2";
        "statuses@1.5.0" = f "statuses" "1.5.0" y "161c7dac177659fd9811f43771fa99381478628c" [];
        "statuses@>= 1.4.0 < 2" = s."statuses@1.5.0";
        "statuses@>= 1.5.0 < 2" = s."statuses@1.5.0";
        "statuses@~1.5.0" = s."statuses@1.5.0";
        "stream-browserify@2.0.2" = f "stream-browserify" "2.0.2" y "87521d38a44aa7ee91ce1cd2a47df0cb49dd660b" [
          (s."inherits@~2.0.1")
          (s."readable-stream@^2.0.2")
          ];
        "stream-browserify@^2.0.1" = s."stream-browserify@2.0.2";
        "stream-each@1.2.3" = f "stream-each" "1.2.3" y "ebe27a0c389b04fbcc233642952e10731afa9bae" [
          (s."end-of-stream@^1.1.0")
          (s."stream-shift@^1.0.0")
          ];
        "stream-each@^1.1.0" = s."stream-each@1.2.3";
        "stream-http@2.8.3" = f "stream-http" "2.8.3" y "b2d242469288a5a27ec4fe8933acf623de6514fc" [
          (s."builtin-status-codes@^3.0.0")
          (s."inherits@^2.0.1")
          (s."readable-stream@^2.3.6")
          (s."to-arraybuffer@^1.0.0")
          (s."xtend@^4.0.0")
          ];
        "stream-http@^2.7.2" = s."stream-http@2.8.3";
        "stream-shift@1.0.1" = f "stream-shift" "1.0.1" y "d7088281559ab2778424279b0877da3c392d5a3d" [];
        "stream-shift@^1.0.0" = s."stream-shift@1.0.1";
        "strict-uri-encode@1.1.0" = f "strict-uri-encode" "1.1.0" y "279b225df1d582b1f54e65addd4352e18faa0713" [];
        "strict-uri-encode@2.0.0" = f "strict-uri-encode" "2.0.0" y "b9c7330c7042862f6b142dc274bbcc5866ce3546" [];
        "strict-uri-encode@^1.0.0" = s."strict-uri-encode@1.1.0";
        "strict-uri-encode@^2.0.0" = s."strict-uri-encode@2.0.0";
        "string-convert@0.2.1" = f "string-convert" "0.2.1" y "6982cc3049fbb4cd85f8b24568b9d9bf39eeff97" [];
        "string-convert@^0.2.0" = s."string-convert@0.2.1";
        "string-length@4.0.2" = f "string-length" "4.0.2" y "a8a8dc7bd5c1a82b9b3c8b87e125f66871b6e57a" [
          (s."char-regex@^1.0.2")
          (s."strip-ansi@^6.0.0")
          ];
        "string-length@^4.0.1" = s."string-length@4.0.2";
        "string-natural-compare@3.0.1" = f "string-natural-compare" "3.0.1" y "7a42d58474454963759e8e8b7ae63d71c1e7fdf4" [];
        "string-natural-compare@^3.0.1" = s."string-natural-compare@3.0.1";
        "string-width@1.0.2" = f "string-width" "1.0.2" y "118bdf5b8cdc51a2a7e70d211e07e2b0b9b107d3" [
          (s."code-point-at@^1.0.0")
          (s."is-fullwidth-code-point@^1.0.0")
          (s."strip-ansi@^3.0.0")
          ];
        "string-width@2.1.1" = f "string-width" "2.1.1" y "ab93f27a8dc13d28cac815c462143a6d9012ae9e" [
          (s."is-fullwidth-code-point@^2.0.0")
          (s."strip-ansi@^4.0.0")
          ];
        "string-width@3.1.0" = f "string-width" "3.1.0" y "22767be21b62af1081574306f69ac51b62203961" [
          (s."emoji-regex@^7.0.1")
          (s."is-fullwidth-code-point@^2.0.0")
          (s."strip-ansi@^5.1.0")
          ];
        "string-width@4.2.2" = f "string-width" "4.2.2" y "dafd4f9559a7585cfba529c6a0a4f73488ebd4c5" [
          (s."emoji-regex@^8.0.0")
          (s."is-fullwidth-code-point@^3.0.0")
          (s."strip-ansi@^6.0.0")
          ];
        "string-width@4.2.3" = f "string-width" "4.2.3" y "269c7117d27b05ad2e536830a8ec895ef9c6d010" [
          (s."emoji-regex@^8.0.0")
          (s."is-fullwidth-code-point@^3.0.0")
          (s."strip-ansi@^6.0.1")
          ];
        "string-width@^1.0.1" = s."string-width@1.0.2";
        "string-width@^2.1.1" = s."string-width@2.1.1";
        "string-width@^3.0.0" = s."string-width@3.1.0";
        "string-width@^3.1.0" = s."string-width@3.1.0";
        "string-width@^4.0.0" = s."string-width@4.2.3";
        "string-width@^4.1.0" = s."string-width@4.2.2";
        "string-width@^4.2.0" = s."string-width@4.2.2";
        "string.prototype.matchall@4.0.5" = f "string.prototype.matchall" "4.0.5" y "59370644e1db7e4c0c045277690cf7b01203c4da" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.2")
          (s."get-intrinsic@^1.1.1")
          (s."has-symbols@^1.0.2")
          (s."internal-slot@^1.0.3")
          (s."regexp.prototype.flags@^1.3.1")
          (s."side-channel@^1.0.4")
          ];
        "string.prototype.matchall@^4.0.5" = s."string.prototype.matchall@4.0.5";
        "string.prototype.padend@3.1.2" = f "string.prototype.padend" "3.1.2" y "6858ca4f35c5268ebd5e8615e1327d55f59ee311" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.18.0-next.2")
          ];
        "string.prototype.padend@^3.0.0" = s."string.prototype.padend@3.1.2";
        "string.prototype.trimend@1.0.4" = f "string.prototype.trimend" "1.0.4" y "e75ae90c2942c63504686c18b287b4a0b1a45f80" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          ];
        "string.prototype.trimend@^1.0.4" = s."string.prototype.trimend@1.0.4";
        "string.prototype.trimstart@1.0.4" = f "string.prototype.trimstart" "1.0.4" y "b36399af4ab2999b4c9c648bd7a3fb2bb26feeed" [
          (s."call-bind@^1.0.2")
          (s."define-properties@^1.1.3")
          ];
        "string.prototype.trimstart@^1.0.4" = s."string.prototype.trimstart@1.0.4";
        "string_decoder@1.1.1" = f "string_decoder" "1.1.1" y "9cf1611ba62685d7030ae9e4ba34149c3af03fc8" [
          (s."safe-buffer@~5.1.0")
          ];
        "string_decoder@1.3.0" = f "string_decoder" "1.3.0" y "42f114594a46cf1a8e30b0a84f56c78c3edac21e" [
          (s."safe-buffer@~5.2.0")
          ];
        "string_decoder@^1.0.0" = s."string_decoder@1.3.0";
        "string_decoder@^1.1.1" = s."string_decoder@1.3.0";
        "string_decoder@~1.1.1" = s."string_decoder@1.1.1";
        "stringify-object@3.3.0" = f "stringify-object" "3.3.0" y "703065aefca19300d3ce88af4f5b3956d7556629" [
          (s."get-own-enumerable-property-symbols@^3.0.0")
          (s."is-obj@^1.0.1")
          (s."is-regexp@^1.0.0")
          ];
        "stringify-object@^3.3.0" = s."stringify-object@3.3.0";
        "strip-ansi@3.0.1" = f "strip-ansi" "3.0.1" y "6a385fb8853d952d5ff05d0e8aaf94278dc63dcf" [
          (s."ansi-regex@^2.0.0")
          ];
        "strip-ansi@4.0.0" = f "strip-ansi" "4.0.0" y "a8479022eb1ac368a871389b635262c505ee368f" [
          (s."ansi-regex@^3.0.0")
          ];
        "strip-ansi@5.2.0" = f "strip-ansi" "5.2.0" y "8c9a536feb6afc962bdfa5b104a5091c1ad9c0ae" [
          (s."ansi-regex@^4.1.0")
          ];
        "strip-ansi@6.0.0" = f "strip-ansi" "6.0.0" y "0b1571dd7669ccd4f3e06e14ef1eed26225ae532" [
          (s."ansi-regex@^5.0.0")
          ];
        "strip-ansi@6.0.1" = f "strip-ansi" "6.0.1" y "9e26c63d30f53443e9489495b2105d37b67a85d9" [
          (s."ansi-regex@^5.0.1")
          ];
        "strip-ansi@^3.0.0" = s."strip-ansi@3.0.1";
        "strip-ansi@^3.0.1" = s."strip-ansi@3.0.1";
        "strip-ansi@^4.0.0" = s."strip-ansi@4.0.0";
        "strip-ansi@^5.0.0" = s."strip-ansi@5.2.0";
        "strip-ansi@^5.1.0" = s."strip-ansi@5.2.0";
        "strip-ansi@^5.2.0" = s."strip-ansi@5.2.0";
        "strip-ansi@^6.0.0" = s."strip-ansi@6.0.0";
        "strip-ansi@^6.0.1" = s."strip-ansi@6.0.1";
        "strip-bom@3.0.0" = f "strip-bom" "3.0.0" y "2334c18e9c759f7bdd56fdef7e9ae3d588e68ed3" [];
        "strip-bom@4.0.0" = f "strip-bom" "4.0.0" y "9c3505c1db45bcedca3d9cf7a16f5c5aa3901878" [];
        "strip-bom@^3.0.0" = s."strip-bom@3.0.0";
        "strip-bom@^4.0.0" = s."strip-bom@4.0.0";
        "strip-comments@1.0.2" = f "strip-comments" "1.0.2" y "82b9c45e7f05873bee53f37168af930aa368679d" [
          (s."babel-extract-comments@^1.0.0")
          (s."babel-plugin-transform-object-rest-spread@^6.26.0")
          ];
        "strip-comments@^1.0.2" = s."strip-comments@1.0.2";
        "strip-eof@1.0.0" = f "strip-eof" "1.0.0" y "bb43ff5598a6eb05d89b59fcd129c983313606bf" [];
        "strip-eof@^1.0.0" = s."strip-eof@1.0.0";
        "strip-final-newline@2.0.0" = f "strip-final-newline" "2.0.0" y "89b852fb2fcbe936f6f4b3187afb0a12c1ab58ad" [];
        "strip-final-newline@^2.0.0" = s."strip-final-newline@2.0.0";
        "strip-indent@3.0.0" = f "strip-indent" "3.0.0" y "c32e1cee940b6b3432c771bc2c54bcce73cd3001" [
          (s."min-indent@^1.0.0")
          ];
        "strip-indent@^3.0.0" = s."strip-indent@3.0.0";
        "strip-json-comments@3.1.1" = f "strip-json-comments" "3.1.1" y "31f1281b3832630434831c310c01cccda8cbe006" [];
        "strip-json-comments@^3.1.0" = s."strip-json-comments@3.1.1";
        "strip-json-comments@^3.1.1" = s."strip-json-comments@3.1.1";
        "style-loader@1.3.0" = f "style-loader" "1.3.0" y "828b4a3b3b7e7aa5847ce7bae9e874512114249e" [
          (s."loader-utils@^2.0.0")
          (s."schema-utils@^2.7.0")
          ];
        "stylehacks@4.0.3" = f "stylehacks" "4.0.3" y "6718fcaf4d1e07d8a1318690881e8d96726a71d5" [
          (s."browserslist@^4.0.0")
          (s."postcss@^7.0.0")
          (s."postcss-selector-parser@^3.0.0")
          ];
        "stylehacks@^4.0.0" = s."stylehacks@4.0.3";
        "supports-color@2.0.0" = f "supports-color" "2.0.0" y "535d045ce6b6363fa40117084629995e9df324c7" [];
        "supports-color@5.5.0" = f "supports-color" "5.5.0" y "e2e69a44ac8772f78a1ec0b35b689df6530efc8f" [
          (s."has-flag@^3.0.0")
          ];
        "supports-color@6.1.0" = f "supports-color" "6.1.0" y "0764abc69c63d5ac842dd4867e8d025e880df8f3" [
          (s."has-flag@^3.0.0")
          ];
        "supports-color@7.2.0" = f "supports-color" "7.2.0" y "1b7dcdcb32b8138801b3e478ba6a51caa89648da" [
          (s."has-flag@^4.0.0")
          ];
        "supports-color@8.1.1" = f "supports-color" "8.1.1" y "cd6fc17e28500cff56c1b86c0a7fd4a54a73005c" [
          (s."has-flag@^4.0.0")
          ];
        "supports-color@^2.0.0" = s."supports-color@2.0.0";
        "supports-color@^5.0.0" = s."supports-color@5.5.0";
        "supports-color@^5.3.0" = s."supports-color@5.5.0";
        "supports-color@^5.4.0" = s."supports-color@5.5.0";
        "supports-color@^5.5.0" = s."supports-color@5.5.0";
        "supports-color@^6.1.0" = s."supports-color@6.1.0";
        "supports-color@^7.0.0" = s."supports-color@7.2.0";
        "supports-color@^7.1.0" = s."supports-color@7.2.0";
        "supports-color@^8.1.0" = s."supports-color@8.1.1";
        "supports-hyperlinks@1.0.1" = f "supports-hyperlinks" "1.0.1" y "71daedf36cc1060ac5100c351bb3da48c29c0ef7" [
          (s."has-flag@^2.0.0")
          (s."supports-color@^5.0.0")
          ];
        "supports-hyperlinks@2.2.0" = f "supports-hyperlinks" "2.2.0" y "4f77b42488765891774b70c79babd87f9bd594bb" [
          (s."has-flag@^4.0.0")
          (s."supports-color@^7.0.0")
          ];
        "supports-hyperlinks@^1.0.1" = s."supports-hyperlinks@1.0.1";
        "supports-hyperlinks@^2.0.0" = s."supports-hyperlinks@2.2.0";
        "supports-hyperlinks@^2.1.0" = s."supports-hyperlinks@2.2.0";
        "svg-parser@2.0.4" = f "svg-parser" "2.0.4" y "fdc2e29e13951736140b76cb122c8ee6630eb6b5" [];
        "svg-parser@^2.0.2" = s."svg-parser@2.0.4";
        "svgo@1.3.2" = f "svgo" "1.3.2" y "b6dc511c063346c9e415b81e43401145b96d4167" [
          (s."chalk@^2.4.1")
          (s."coa@^2.0.2")
          (s."css-select@^2.0.0")
          (s."css-select-base-adapter@^0.1.1")
          (s."css-tree@1.0.0-alpha.37")
          (s."csso@^4.0.2")
          (s."js-yaml@^3.13.1")
          (s."mkdirp@~0.5.1")
          (s."object.values@^1.1.0")
          (s."sax@~1.2.4")
          (s."stable@^0.1.8")
          (s."unquote@~1.1.1")
          (s."util.promisify@~1.0.0")
          ];
        "svgo@^1.0.0" = s."svgo@1.3.2";
        "svgo@^1.2.2" = s."svgo@1.3.2";
        "symbol-observable@1.2.0" = f "symbol-observable" "1.2.0" y "c22688aed4eab3cdc2dfeacbb561660560a00804" [];
        "symbol-observable@4.0.0" = f "symbol-observable" "4.0.0" y "5b425f192279e87f2f9b937ac8540d1984b39205" [];
        "symbol-observable@^1.1.0" = s."symbol-observable@1.2.0";
        "symbol-observable@^4.0.0" = s."symbol-observable@4.0.0";
        "symbol-tree@3.2.4" = f "symbol-tree" "3.2.4" y "430637d248ba77e078883951fb9aa0eed7c63fa2" [];
        "symbol-tree@^3.2.4" = s."symbol-tree@3.2.4";
        "table@6.7.1" = f "table" "6.7.1" y "ee05592b7143831a8c94f3cee6aae4c1ccef33e2" [
          (s."ajv@^8.0.1")
          (s."lodash.clonedeep@^4.5.0")
          (s."lodash.truncate@^4.4.2")
          (s."slice-ansi@^4.0.0")
          (s."string-width@^4.2.0")
          (s."strip-ansi@^6.0.0")
          ];
        "table@^6.0.9" = s."table@6.7.1";
        "tapable@1.1.3" = f "tapable" "1.1.3" y "a1fccc06b58db61fd7a45da2da44f5f3a3e67ba2" [];
        "tapable@^1.0.0" = s."tapable@1.1.3";
        "tapable@^1.1.3" = s."tapable@1.1.3";
        "tar@6.1.6" = f "tar" "6.1.6" y "c23d797b0a1efe5d479b1490805c5443f3560c5d" [
          (s."chownr@^2.0.0")
          (s."fs-minipass@^2.0.0")
          (s."minipass@^3.0.0")
          (s."minizlib@^2.1.1")
          (s."mkdirp@^1.0.3")
          (s."yallist@^4.0.0")
          ];
        "tar@^6.0.2" = s."tar@6.1.6";
        "temp-dir@1.0.0" = f "temp-dir" "1.0.0" y "0a7c0ea26d3a39afa7e0ebea9c1fc0bc4daa011d" [];
        "temp-dir@^1.0.0" = s."temp-dir@1.0.0";
        "tempy@0.3.0" = f "tempy" "0.3.0" y "6f6c5b295695a16130996ad5ab01a8bd726e8bf8" [
          (s."temp-dir@^1.0.0")
          (s."type-fest@^0.3.1")
          (s."unique-string@^1.0.0")
          ];
        "tempy@^0.3.0" = s."tempy@0.3.0";
        "terminal-link@2.1.1" = f "terminal-link" "2.1.1" y "14a64a27ab3c0df933ea546fba55f2d078edc994" [
          (s."ansi-escapes@^4.2.1")
          (s."supports-hyperlinks@^2.0.0")
          ];
        "terminal-link@^2.0.0" = s."terminal-link@2.1.1";
        "terser-webpack-plugin@1.4.5" = f "terser-webpack-plugin" "1.4.5" y "a217aefaea330e734ffacb6120ec1fa312d6040b" [
          (s."cacache@^12.0.2")
          (s."find-cache-dir@^2.1.0")
          (s."is-wsl@^1.1.0")
          (s."schema-utils@^1.0.0")
          (s."serialize-javascript@^4.0.0")
          (s."source-map@^0.6.1")
          (s."terser@^4.1.2")
          (s."webpack-sources@^1.4.0")
          (s."worker-farm@^1.7.0")
          ];
        "terser-webpack-plugin@4.2.3" = f "terser-webpack-plugin" "4.2.3" y "28daef4a83bd17c1db0297070adc07fc8cfc6a9a" [
          (s."cacache@^15.0.5")
          (s."find-cache-dir@^3.3.1")
          (s."jest-worker@^26.5.0")
          (s."p-limit@^3.0.2")
          (s."schema-utils@^3.0.0")
          (s."serialize-javascript@^5.0.1")
          (s."source-map@^0.6.1")
          (s."terser@^5.3.4")
          (s."webpack-sources@^1.4.3")
          ];
        "terser-webpack-plugin@^1.4.3" = s."terser-webpack-plugin@1.4.5";
        "terser@4.8.0" = f "terser" "4.8.0" y "63056343d7c70bb29f3af665865a46fe03a0df17" [
          (s."commander@^2.20.0")
          (s."source-map@~0.6.1")
          (s."source-map-support@~0.5.12")
          ];
        "terser@5.7.1" = f "terser" "5.7.1" y "2dc7a61009b66bb638305cb2a824763b116bf784" [
          (s."commander@^2.20.0")
          (s."source-map@~0.7.2")
          (s."source-map-support@~0.5.19")
          ];
        "terser@^4.1.2" = s."terser@4.8.0";
        "terser@^4.6.2" = s."terser@4.8.0";
        "terser@^4.6.3" = s."terser@4.8.0";
        "terser@^5.3.4" = s."terser@5.7.1";
        "test-exclude@6.0.0" = f "test-exclude" "6.0.0" y "04a8698661d805ea6fa293b6cb9e63ac044ef15e" [
          (s."@istanbuljs/schema@^0.1.2")
          (s."glob@^7.1.4")
          (s."minimatch@^3.0.4")
          ];
        "test-exclude@^6.0.0" = s."test-exclude@6.0.0";
        "text-table@0.2.0" = f "text-table" "0.2.0" y "7f5ee823ae805207c00af2df4a84ec3fcfa570b4" [];
        "text-table@^0.2.0" = s."text-table@0.2.0";
        "throat@5.0.0" = f "throat" "5.0.0" y "c5199235803aad18754a667d659b5e72ce16764b" [];
        "throat@^5.0.0" = s."throat@5.0.0";
        "through2@2.0.5" = f "through2" "2.0.5" y "01c1e39eb31d07cb7d03a96a70823260b23132cd" [
          (s."readable-stream@~2.3.6")
          (s."xtend@~4.0.1")
          ];
        "through2@^2.0.0" = s."through2@2.0.5";
        "thunky@1.1.0" = f "thunky" "1.1.0" y "5abaf714a9405db0504732bbccd2cedd9ef9537d" [];
        "thunky@^1.0.2" = s."thunky@1.1.0";
        "timers-browserify@2.0.12" = f "timers-browserify" "2.0.12" y "44a45c11fbf407f34f97bccd1577c652361b00ee" [
          (s."setimmediate@^1.0.4")
          ];
        "timers-browserify@^2.0.4" = s."timers-browserify@2.0.12";
        "timsort@0.3.0" = f "timsort" "0.3.0" y "405411a8e7e6339fe64db9a234de11dc31e02bd4" [];
        "timsort@^0.3.0" = s."timsort@0.3.0";
        "tiny-invariant@1.1.0" = f "tiny-invariant" "1.1.0" y "634c5f8efdc27714b7f386c35e6760991d230875" [];
        "tiny-invariant@^1.0.2" = s."tiny-invariant@1.1.0";
        "tiny-warning@1.0.3" = f "tiny-warning" "1.0.3" y "94a30db453df4c643d0fd566060d60a875d84754" [];
        "tiny-warning@^1.0.0" = s."tiny-warning@1.0.3";
        "tiny-warning@^1.0.3" = s."tiny-warning@1.0.3";
        "tinycolor2@1.4.2" = f "tinycolor2" "1.4.2" y "3f6a4d1071ad07676d7fa472e1fac40a719d8803" [];
        "tinycolor2@^1.4.1" = s."tinycolor2@1.4.2";
        "tmpl@1.0.4" = f "tmpl" "1.0.4" y "23640dd7b42d00433911140820e5cf440e521dd1" [];
        "tmpl@1.0.x" = s."tmpl@1.0.4";
        "to-arraybuffer@1.0.1" = f "to-arraybuffer" "1.0.1" y "7d229b1fcc637e466ca081180836a7aabff83f43" [];
        "to-arraybuffer@^1.0.0" = s."to-arraybuffer@1.0.1";
        "to-fast-properties@2.0.0" = f "to-fast-properties" "2.0.0" y "dc5e698cbd079265bc73e0377681a4e4e83f616e" [];
        "to-fast-properties@^2.0.0" = s."to-fast-properties@2.0.0";
        "to-object-path@0.3.0" = f "to-object-path" "0.3.0" y "297588b7b0e7e0ac08e04e672f85c1f4999e17af" [
          (s."kind-of@^3.0.2")
          ];
        "to-object-path@^0.3.0" = s."to-object-path@0.3.0";
        "to-regex-range@2.1.1" = f "to-regex-range" "2.1.1" y "7c80c17b9dfebe599e27367e0d4dd5590141db38" [
          (s."is-number@^3.0.0")
          (s."repeat-string@^1.6.1")
          ];
        "to-regex-range@5.0.1" = f "to-regex-range" "5.0.1" y "1648c44aae7c8d988a326018ed72f5b4dd0392e4" [
          (s."is-number@^7.0.0")
          ];
        "to-regex-range@^2.1.0" = s."to-regex-range@2.1.1";
        "to-regex-range@^5.0.1" = s."to-regex-range@5.0.1";
        "to-regex@3.0.2" = f "to-regex" "3.0.2" y "13cfdd9b336552f30b51f33a8ae1b42a7a7599ce" [
          (s."define-property@^2.0.2")
          (s."extend-shallow@^3.0.2")
          (s."regex-not@^1.0.2")
          (s."safe-regex@^1.1.0")
          ];
        "to-regex@^3.0.1" = s."to-regex@3.0.2";
        "to-regex@^3.0.2" = s."to-regex@3.0.2";
        "toggle-selection@1.0.6" = f "toggle-selection" "1.0.6" y "6e45b1263f2017fa0acc7d89d78b15b8bf77da32" [];
        "toggle-selection@^1.0.6" = s."toggle-selection@1.0.6";
        "toidentifier@1.0.0" = f "toidentifier" "1.0.0" y "7e1be3470f1e77948bc43d94a3c8f4d7752ba553" [];
        "tough-cookie@4.0.0" = f "tough-cookie" "4.0.0" y "d822234eeca882f991f0f908824ad2622ddbece4" [
          (s."psl@^1.1.33")
          (s."punycode@^2.1.1")
          (s."universalify@^0.1.2")
          ];
        "tough-cookie@^4.0.0" = s."tough-cookie@4.0.0";
        "tr46@0.0.3" = f "tr46" "0.0.3" y "8184fd347dac9cdc185992f3a6622e14b9d9ab6a" [];
        "tr46@2.1.0" = f "tr46" "2.1.0" y "fa87aa81ca5d5941da8cbf1f9b749dc969a4e240" [
          (s."punycode@^2.1.1")
          ];
        "tr46@^2.1.0" = s."tr46@2.1.0";
        "tr46@~0.0.3" = s."tr46@0.0.3";
        "treeify@1.1.0" = f "treeify" "1.1.0" y "4e31c6a463accd0943879f30667c4fdaff411bb8" [];
        "treeify@^1.1.0" = s."treeify@1.1.0";
        "tryer@1.0.1" = f "tryer" "1.0.1" y "f2c85406800b9b0f74c9f7465b81eaad241252f8" [];
        "tryer@^1.0.1" = s."tryer@1.0.1";
        "ts-invariant@0.4.4" = f "ts-invariant" "0.4.4" y "97a523518688f93aafad01b0e80eb803eb2abd86" [
          (s."tslib@^1.9.3")
          ];
        "ts-invariant@0.9.3" = f "ts-invariant" "0.9.3" y "4b41e0a80c2530a56ce4b8fd4e14183aaac0efa8" [
          (s."tslib@^2.1.0")
          ];
        "ts-invariant@^0.4.0" = s."ts-invariant@0.4.4";
        "ts-invariant@^0.9.0" = s."ts-invariant@0.9.3";
        "ts-node@8.10.2" = f "ts-node" "8.10.2" y "eee03764633b1234ddd37f8db9ec10b75ec7fb8d" [
          (s."arg@^4.1.0")
          (s."diff@^4.0.1")
          (s."make-error@^1.1.1")
          (s."source-map-support@^0.5.17")
          (s."yn@3.1.1")
          ];
        "ts-node@^8" = s."ts-node@8.10.2";
        "ts-pnp@1.2.0" = f "ts-pnp" "1.2.0" y "a500ad084b0798f1c3071af391e65912c86bca92" [];
        "ts-pnp@^1.1.6" = s."ts-pnp@1.2.0";
        "tsconfig-paths@3.10.1" = f "tsconfig-paths" "3.10.1" y "79ae67a68c15289fdf5c51cb74f397522d795ed7" [
          (s."json5@^2.2.0")
          (s."minimist@^1.2.0")
          (s."strip-bom@^3.0.0")
          ];
        "tsconfig-paths@^3.9.0" = s."tsconfig-paths@3.10.1";
        "tslib@1.14.1" = f "tslib" "1.14.1" y "cf2d38bdc34a134bcaf1091c41f6619e2f672d00" [];
        "tslib@2.3.0" = f "tslib" "2.3.0" y "803b8cdab3e12ba581a4ca41c8839bbb0dacb09e" [];
        "tslib@2.3.1" = f "tslib" "2.3.1" y "e8a335add5ceae51aa261d32a490158ef042ef01" [];
        "tslib@^1" = s."tslib@1.14.1";
        "tslib@^1.10.0" = s."tslib@1.14.1";
        "tslib@^1.8.1" = s."tslib@1.14.1";
        "tslib@^1.9.0" = s."tslib@1.14.1";
        "tslib@^1.9.3" = s."tslib@1.14.1";
        "tslib@^2.0.0" = s."tslib@2.3.0";
        "tslib@^2.0.1" = s."tslib@2.3.1";
        "tslib@^2.0.3" = s."tslib@2.3.0";
        "tslib@^2.1.0" = s."tslib@2.3.0";
        "tslib@^2.3.0" = s."tslib@2.3.1";
        "tsutils@3.21.0" = f "tsutils" "3.21.0" y "b48717d394cea6c1e096983eed58e9d61715b623" [
          (s."tslib@^1.8.1")
          ];
        "tsutils@^3.17.1" = s."tsutils@3.21.0";
        "tsutils@^3.21.0" = s."tsutils@3.21.0";
        "tty-browserify@0.0.0" = f "tty-browserify" "0.0.0" y "a157ba402da24e9bf957f9aa69d524eed42901a6" [];
        "tty@1.0.1" = f "tty" "1.0.1" y "e4409ac98b0dd1c50b59ff38e86eac3f0764ee45" [];
        "tunnel-agent@0.6.0" = f "tunnel-agent" "0.6.0" y "27a5dea06b36b04a0a9966774b290868f0fc40fd" [
          (s."safe-buffer@^5.0.1")
          ];
        "tunnel-agent@^0.6.0" = s."tunnel-agent@0.6.0";
        "type-check@0.3.2" = f "type-check" "0.3.2" y "5884cab512cf1d355e3fb784f30804b2b520db72" [
          (s."prelude-ls@~1.1.2")
          ];
        "type-check@0.4.0" = f "type-check" "0.4.0" y "07b8203bfa7056c0657050e3ccd2c37730bab8f1" [
          (s."prelude-ls@^1.2.1")
          ];
        "type-check@^0.4.0" = s."type-check@0.4.0";
        "type-check@~0.3.2" = s."type-check@0.3.2";
        "type-check@~0.4.0" = s."type-check@0.4.0";
        "type-detect@4.0.8" = f "type-detect" "4.0.8" y "7646fb5f18871cfbb7749e69bd39a6388eb7450c" [];
        "type-fest@0.13.1" = f "type-fest" "0.13.1" y "0172cb5bce80b0bd542ea348db50c7e21834d934" [];
        "type-fest@0.20.2" = f "type-fest" "0.20.2" y "1bf207f4b28f91583666cb5fbd327887301cd5f4" [];
        "type-fest@0.21.3" = f "type-fest" "0.21.3" y "d260a24b0198436e133fa26a524a6d65fa3b2e37" [];
        "type-fest@0.3.1" = f "type-fest" "0.3.1" y "63d00d204e059474fe5e1b7c011112bbd1dc29e1" [];
        "type-fest@0.6.0" = f "type-fest" "0.6.0" y "8d2a2370d3df886eb5c90ada1c5bf6188acf838b" [];
        "type-fest@0.8.1" = f "type-fest" "0.8.1" y "09e249ebde851d3b1e48d27c105444667f17b83d" [];
        "type-fest@^0.13.1" = s."type-fest@0.13.1";
        "type-fest@^0.20.2" = s."type-fest@0.20.2";
        "type-fest@^0.21.3" = s."type-fest@0.21.3";
        "type-fest@^0.3.0" = s."type-fest@0.3.1";
        "type-fest@^0.3.1" = s."type-fest@0.3.1";
        "type-fest@^0.6.0" = s."type-fest@0.6.0";
        "type-fest@^0.8.1" = s."type-fest@0.8.1";
        "type-is@1.6.18" = f "type-is" "1.6.18" y "4e552cd05df09467dcbc4ef739de89f2cf37c131" [
          (s."media-typer@0.3.0")
          (s."mime-types@~2.1.24")
          ];
        "type-is@~1.6.17" = s."type-is@1.6.18";
        "type-is@~1.6.18" = s."type-is@1.6.18";
        "type@1.2.0" = f "type" "1.2.0" y "848dd7698dafa3e54a6c479e759c4bc3f18847a0" [];
        "type@2.5.0" = f "type" "2.5.0" y "0a2e78c2e77907b252abe5f298c1b01c63f0db3d" [];
        "type@^1.0.1" = s."type@1.2.0";
        "type@^2.0.0" = s."type@2.5.0";
        "typedarray-to-buffer@3.1.5" = f "typedarray-to-buffer" "3.1.5" y "a97ee7a9ff42691b9f783ff1bc5112fe3fca9080" [
          (s."is-typedarray@^1.0.0")
          ];
        "typedarray-to-buffer@^3.1.5" = s."typedarray-to-buffer@3.1.5";
        "typedarray@0.0.6" = f "typedarray" "0.0.6" y "867ac74e3864187b1d3d47d996a78ec5c8830777" [];
        "typedarray@^0.0.6" = s."typedarray@0.0.6";
        "typescript@4.1.6" = f "typescript" "4.1.6" y "1becd85d77567c3c741172339e93ce2e69932138" [];
        "typescript@~4.1.5" = s."typescript@4.1.6";
        "unbox-primitive@1.0.1" = f "unbox-primitive" "1.0.1" y "085e215625ec3162574dc8859abee78a59b14471" [
          (s."function-bind@^1.1.1")
          (s."has-bigints@^1.0.1")
          (s."has-symbols@^1.0.2")
          (s."which-boxed-primitive@^1.0.2")
          ];
        "unbox-primitive@^1.0.1" = s."unbox-primitive@1.0.1";
        "unicode-canonical-property-names-ecmascript@1.0.4" = f "unicode-canonical-property-names-ecmascript" "1.0.4" y "2619800c4c825800efdd8343af7dd9933cbe2818" [];
        "unicode-canonical-property-names-ecmascript@^1.0.4" = s."unicode-canonical-property-names-ecmascript@1.0.4";
        "unicode-match-property-ecmascript@1.0.4" = f "unicode-match-property-ecmascript" "1.0.4" y "8ed2a32569961bce9227d09cd3ffbb8fed5f020c" [
          (s."unicode-canonical-property-names-ecmascript@^1.0.4")
          (s."unicode-property-aliases-ecmascript@^1.0.4")
          ];
        "unicode-match-property-ecmascript@^1.0.4" = s."unicode-match-property-ecmascript@1.0.4";
        "unicode-match-property-value-ecmascript@1.2.0" = f "unicode-match-property-value-ecmascript" "1.2.0" y "0d91f600eeeb3096aa962b1d6fc88876e64ea531" [];
        "unicode-match-property-value-ecmascript@^1.2.0" = s."unicode-match-property-value-ecmascript@1.2.0";
        "unicode-property-aliases-ecmascript@1.1.0" = f "unicode-property-aliases-ecmascript" "1.1.0" y "dd57a99f6207bedff4628abefb94c50db941c8f4" [];
        "unicode-property-aliases-ecmascript@^1.0.4" = s."unicode-property-aliases-ecmascript@1.1.0";
        "union-value@1.0.1" = f "union-value" "1.0.1" y "0b6fe7b835aecda61c6ea4d4f02c14221e109847" [
          (s."arr-union@^3.1.0")
          (s."get-value@^2.0.6")
          (s."is-extendable@^0.1.1")
          (s."set-value@^2.0.1")
          ];
        "union-value@^1.0.0" = s."union-value@1.0.1";
        "uniq@1.0.1" = f "uniq" "1.0.1" y "b31c5ae8254844a3a8281541ce2b04b865a734ff" [];
        "uniq@^1.0.1" = s."uniq@1.0.1";
        "uniqs@2.0.0" = f "uniqs" "2.0.0" y "ffede4b36b25290696e6e165d4a59edb998e6b02" [];
        "uniqs@^2.0.0" = s."uniqs@2.0.0";
        "unique-filename@1.1.1" = f "unique-filename" "1.1.1" y "1d69769369ada0583103a1e6ae87681b56573230" [
          (s."unique-slug@^2.0.0")
          ];
        "unique-filename@^1.1.1" = s."unique-filename@1.1.1";
        "unique-slug@2.0.2" = f "unique-slug" "2.0.2" y "baabce91083fc64e945b0f3ad613e264f7cd4e6c" [
          (s."imurmurhash@^0.1.4")
          ];
        "unique-slug@^2.0.0" = s."unique-slug@2.0.2";
        "unique-string@1.0.0" = f "unique-string" "1.0.0" y "9e1057cca851abb93398f8b33ae187b99caec11a" [
          (s."crypto-random-string@^1.0.0")
          ];
        "unique-string@^1.0.0" = s."unique-string@1.0.0";
        "universalify@0.1.2" = f "universalify" "0.1.2" y "b646f69be3942dabcecc9d6639c80dc105efaa66" [];
        "universalify@2.0.0" = f "universalify" "2.0.0" y "75a4984efedc4b08975c5aeb73f530d02df25717" [];
        "universalify@^0.1.0" = s."universalify@0.1.2";
        "universalify@^0.1.2" = s."universalify@0.1.2";
        "universalify@^2.0.0" = s."universalify@2.0.0";
        "unpipe@1.0.0" = f "unpipe" "1.0.0" y "b2bf4ee8514aae6165b4817829d21b2ef49904ec" [];
        "unpipe@~1.0.0" = s."unpipe@1.0.0";
        "unquote@1.1.1" = f "unquote" "1.1.1" y "8fded7324ec6e88a0ff8b905e7c098cdc086d544" [];
        "unquote@~1.1.1" = s."unquote@1.1.1";
        "unset-value@1.0.0" = f "unset-value" "1.0.0" y "8376873f7d2335179ffb1e6fc3a8ed0dfc8ab559" [
          (s."has-value@^0.3.1")
          (s."isobject@^3.0.0")
          ];
        "unset-value@^1.0.0" = s."unset-value@1.0.0";
        "upath@1.2.0" = f "upath" "1.2.0" y "8f66dbcd55a883acdae4408af8b035a5044c1894" [];
        "upath@^1.1.1" = s."upath@1.2.0";
        "upath@^1.1.2" = s."upath@1.2.0";
        "upath@^1.2.0" = s."upath@1.2.0";
        "upper-case-first@2.0.2" = f "upper-case-first" "2.0.2" y "992c3273f882abd19d1e02894cc147117f844324" [
          (s."tslib@^2.0.3")
          ];
        "upper-case-first@^2.0.2" = s."upper-case-first@2.0.2";
        "upper-case@2.0.2" = f "upper-case" "2.0.2" y "d89810823faab1df1549b7d97a76f8662bae6f7a" [
          (s."tslib@^2.0.3")
          ];
        "upper-case@^2.0.2" = s."upper-case@2.0.2";
        "uri-js@4.4.1" = f "uri-js" "4.4.1" y "9b1a52595225859e55f669d928f88c6c57f2a77e" [
          (s."punycode@^2.1.0")
          ];
        "uri-js@^4.2.2" = s."uri-js@4.4.1";
        "urix@0.1.0" = f "urix" "0.1.0" y "da937f7a62e21fec1fd18d49b35c2935067a6c72" [];
        "urix@^0.1.0" = s."urix@0.1.0";
        "url-loader@4.1.1" = f "url-loader" "4.1.1" y "28505e905cae158cf07c92ca622d7f237e70a4e2" [
          (s."loader-utils@^2.0.0")
          (s."mime-types@^2.1.27")
          (s."schema-utils@^3.0.0")
          ];
        "url-parse@1.5.3" = f "url-parse" "1.5.3" y "71c1303d38fb6639ade183c2992c8cc0686df862" [
          (s."querystringify@^2.1.1")
          (s."requires-port@^1.0.0")
          ];
        "url-parse@^1.4.3" = s."url-parse@1.5.3";
        "url-parse@^1.5.1" = s."url-parse@1.5.3";
        "url@0.11.0" = f "url" "0.11.0" y "3838e97cfc60521eb73c525a8e55bfdd9e2e28f1" [
          (s."punycode@1.3.2")
          (s."querystring@0.2.0")
          ];
        "url@^0.11.0" = s."url@0.11.0";
        "use@3.1.1" = f "use" "3.1.1" y "d50c8cac79a19fbc20f2911f56eb973f4e10070f" [];
        "use@^3.1.0" = s."use@3.1.1";
        "util-deprecate@1.0.2" = f "util-deprecate" "1.0.2" y "450d4dc9fa70de732762fbd2d4a28981419a0ccf" [];
        "util-deprecate@^1.0.1" = s."util-deprecate@1.0.2";
        "util-deprecate@^1.0.2" = s."util-deprecate@1.0.2";
        "util-deprecate@~1.0.1" = s."util-deprecate@1.0.2";
        "util.promisify@1.0.0" = f "util.promisify" "1.0.0" y "440f7165a459c9a16dc145eb8e72f35687097030" [
          (s."define-properties@^1.1.2")
          (s."object.getownpropertydescriptors@^2.0.3")
          ];
        "util.promisify@1.0.1" = f "util.promisify" "1.0.1" y "6baf7774b80eeb0f7520d8b81d07982a59abbaee" [
          (s."define-properties@^1.1.3")
          (s."es-abstract@^1.17.2")
          (s."has-symbols@^1.0.1")
          (s."object.getownpropertydescriptors@^2.1.0")
          ];
        "util.promisify@1.1.1" = f "util.promisify" "1.1.1" y "77832f57ced2c9478174149cae9b96e9918cd54b" [
          (s."call-bind@^1.0.0")
          (s."define-properties@^1.1.3")
          (s."for-each@^0.3.3")
          (s."has-symbols@^1.0.1")
          (s."object.getownpropertydescriptors@^2.1.1")
          ];
        "util.promisify@^1.0.0" = s."util.promisify@1.1.1";
        "util.promisify@~1.0.0" = s."util.promisify@1.0.1";
        "util@0.10.3" = f "util" "0.10.3" y "7afb1afe50805246489e3db7fe0ed379336ac0f9" [
          (s."inherits@2.0.1")
          ];
        "util@0.11.1" = f "util" "0.11.1" y "3236733720ec64bb27f6e26f421aaa2e1b588d61" [
          (s."inherits@2.0.3")
          ];
        "util@^0.11.0" = s."util@0.11.1";
        "utila@0.4.0" = f "utila" "0.4.0" y "8a16a05d445657a3aea5eecc5b12a4fa5379772c" [];
        "utila@~0.4" = s."utila@0.4.0";
        "utils-merge@1.0.1" = f "utils-merge" "1.0.1" y "9f95710f50a267947b2ccc124741c1028427e713" [];
        "uuid@3.4.0" = f "uuid" "3.4.0" y "b23e4358afa8a202fe7a100af1f5f883f02007ee" [];
        "uuid@8.3.2" = f "uuid" "8.3.2" y "80d5b5ced271bb9af6c445f21a1a04c606cefbe2" [];
        "uuid@^3.3.2" = s."uuid@3.4.0";
        "uuid@^3.4.0" = s."uuid@3.4.0";
        "uuid@^8.3.0" = s."uuid@8.3.2";
        "v8-compile-cache@2.3.0" = f "v8-compile-cache" "2.3.0" y "2de19618c66dc247dcfb6f99338035d8245a2cee" [];
        "v8-compile-cache@^2.0.3" = s."v8-compile-cache@2.3.0";
        "v8-to-istanbul@7.1.2" = f "v8-to-istanbul" "7.1.2" y "30898d1a7fa0c84d225a2c1434fb958f290883c1" [
          (s."@types/istanbul-lib-coverage@^2.0.1")
          (s."convert-source-map@^1.6.0")
          (s."source-map@^0.7.3")
          ];
        "v8-to-istanbul@^7.0.0" = s."v8-to-istanbul@7.1.2";
        "validate-npm-package-license@3.0.4" = f "validate-npm-package-license" "3.0.4" y "fc91f6b9c7ba15c857f4cb2c5defeec39d4f410a" [
          (s."spdx-correct@^3.0.0")
          (s."spdx-expression-parse@^3.0.0")
          ];
        "validate-npm-package-license@^3.0.1" = s."validate-npm-package-license@3.0.4";
        "value-equal@1.0.1" = f "value-equal" "1.0.1" y "1e0b794c734c5c0cade179c437d356d931a34d6c" [];
        "value-equal@^1.0.1" = s."value-equal@1.0.1";
        "vary@1.1.2" = f "vary" "1.1.2" y "2299f02c6ded30d4a5961b0b9f74524a18f634fc" [];
        "vary@~1.1.2" = s."vary@1.1.2";
        "vendors@1.0.4" = f "vendors" "1.0.4" y "e2b800a53e7a29b93506c3cf41100d16c4c4ad8e" [];
        "vendors@^1.0.0" = s."vendors@1.0.4";
        "vm-browserify@1.1.2" = f "vm-browserify" "1.1.2" y "78641c488b8e6ca91a75f511e7a3b32a86e5dda0" [];
        "vm-browserify@^1.0.1" = s."vm-browserify@1.1.2";
        "vscode-jsonrpc@4.0.0" = f "vscode-jsonrpc" "4.0.0" y "a7bf74ef3254d0a0c272fab15c82128e378b3be9" [];
        "vscode-jsonrpc@^4.0.0" = s."vscode-jsonrpc@4.0.0";
        "vscode-languageserver-protocol@3.14.1" = f "vscode-languageserver-protocol" "3.14.1" y "b8aab6afae2849c84a8983d39a1cf742417afe2f" [
          (s."vscode-jsonrpc@^4.0.0")
          (s."vscode-languageserver-types@3.14.0")
          ];
        "vscode-languageserver-types@3.14.0" = f "vscode-languageserver-types" "3.14.0" y "d3b5952246d30e5241592b6dde8280e03942e743" [];
        "vscode-languageserver@5.2.1" = f "vscode-languageserver" "5.2.1" y "0d2feddd33f92aadf5da32450df498d52f6f14eb" [
          (s."vscode-languageserver-protocol@3.14.1")
          (s."vscode-uri@^1.0.6")
          ];
        "vscode-languageserver@^5.1.0" = s."vscode-languageserver@5.2.1";
        "vscode-uri@1.0.6" = f "vscode-uri" "1.0.6" y "6b8f141b0bbc44ad7b07e94f82f168ac7608ad4d" [];
        "vscode-uri@1.0.8" = f "vscode-uri" "1.0.8" y "9769aaececae4026fb6e22359cb38946580ded59" [];
        "vscode-uri@^1.0.6" = s."vscode-uri@1.0.8";
        "w3c-hr-time@1.0.2" = f "w3c-hr-time" "1.0.2" y "0a89cdf5cc15822df9c360543676963e0cc308cd" [
          (s."browser-process-hrtime@^1.0.0")
          ];
        "w3c-hr-time@^1.0.2" = s."w3c-hr-time@1.0.2";
        "w3c-xmlserializer@2.0.0" = f "w3c-xmlserializer" "2.0.0" y "3e7104a05b75146cc60f564380b7f683acf1020a" [
          (s."xml-name-validator@^3.0.0")
          ];
        "w3c-xmlserializer@^2.0.0" = s."w3c-xmlserializer@2.0.0";
        "wait-for-expect@3.0.2" = f "wait-for-expect" "3.0.2" y "d2f14b2f7b778c9b82144109c8fa89ceaadaa463" [];
        "wait-for-expect@^3.0.2" = s."wait-for-expect@3.0.2";
        "walker@1.0.7" = f "walker" "1.0.7" y "2f7f9b8fd10d677262b18a884e28d19618e028fb" [
          (s."makeerror@1.0.x")
          ];
        "walker@^1.0.7" = s."walker@1.0.7";
        "walker@~1.0.5" = s."walker@1.0.7";
        "warning@4.0.3" = f "warning" "4.0.3" y "16e9e077eb8a86d6af7d64aa1e05fd85b4678ca3" [
          (s."loose-envify@^1.0.0")
          ];
        "warning@^4.0.1" = s."warning@4.0.3";
        "warning@^4.0.3" = s."warning@4.0.3";
        "watchpack-chokidar2@2.0.1" = f "watchpack-chokidar2" "2.0.1" y "38500072ee6ece66f3769936950ea1771be1c957" [
          (s."chokidar@^2.1.8")
          ];
        "watchpack-chokidar2@^2.0.1" = s."watchpack-chokidar2@2.0.1";
        "watchpack@1.7.5" = f "watchpack" "1.7.5" y "1267e6c55e0b9b5be44c2023aed5437a2c26c453" [
          (s."graceful-fs@^4.1.2")
          (s."neo-async@^2.5.0")
          (s."chokidar@^3.4.1")
          (s."watchpack-chokidar2@^2.0.1")
          ];
        "watchpack@^1.7.4" = s."watchpack@1.7.5";
        "wbuf@1.7.3" = f "wbuf" "1.7.3" y "c1d8d149316d3ea852848895cb6a0bfe887b87df" [
          (s."minimalistic-assert@^1.0.0")
          ];
        "wbuf@^1.1.0" = s."wbuf@1.7.3";
        "wbuf@^1.7.3" = s."wbuf@1.7.3";
        "webidl-conversions@3.0.1" = f "webidl-conversions" "3.0.1" y "24534275e2a7bc6be7bc86611cc16ae0a5654871" [];
        "webidl-conversions@5.0.0" = f "webidl-conversions" "5.0.0" y "ae59c8a00b121543a2acc65c0434f57b0fc11aff" [];
        "webidl-conversions@6.1.0" = f "webidl-conversions" "6.1.0" y "9111b4d7ea80acd40f5270d666621afa78b69514" [];
        "webidl-conversions@^3.0.0" = s."webidl-conversions@3.0.1";
        "webidl-conversions@^5.0.0" = s."webidl-conversions@5.0.0";
        "webidl-conversions@^6.1.0" = s."webidl-conversions@6.1.0";
        "webpack-dev-middleware@3.7.3" = f "webpack-dev-middleware" "3.7.3" y "0639372b143262e2b84ab95d3b91a7597061c2c5" [
          (s."memory-fs@^0.4.1")
          (s."mime@^2.4.4")
          (s."mkdirp@^0.5.1")
          (s."range-parser@^1.2.1")
          (s."webpack-log@^2.0.0")
          ];
        "webpack-dev-middleware@^3.7.2" = s."webpack-dev-middleware@3.7.3";
        "webpack-dev-server@3.11.1" = f "webpack-dev-server" "3.11.1" y "c74028bf5ba8885aaf230e48a20e8936ab8511f0" [
          (s."ansi-html@0.0.7")
          (s."bonjour@^3.5.0")
          (s."chokidar@^2.1.8")
          (s."compression@^1.7.4")
          (s."connect-history-api-fallback@^1.6.0")
          (s."debug@^4.1.1")
          (s."del@^4.1.1")
          (s."express@^4.17.1")
          (s."html-entities@^1.3.1")
          (s."http-proxy-middleware@0.19.1")
          (s."import-local@^2.0.0")
          (s."internal-ip@^4.3.0")
          (s."ip@^1.1.5")
          (s."is-absolute-url@^3.0.3")
          (s."killable@^1.0.1")
          (s."loglevel@^1.6.8")
          (s."opn@^5.5.0")
          (s."p-retry@^3.0.1")
          (s."portfinder@^1.0.26")
          (s."schema-utils@^1.0.0")
          (s."selfsigned@^1.10.8")
          (s."semver@^6.3.0")
          (s."serve-index@^1.9.1")
          (s."sockjs@^0.3.21")
          (s."sockjs-client@^1.5.0")
          (s."spdy@^4.0.2")
          (s."strip-ansi@^3.0.1")
          (s."supports-color@^6.1.0")
          (s."url@^0.11.0")
          (s."webpack-dev-middleware@^3.7.2")
          (s."webpack-log@^2.0.0")
          (s."ws@^6.2.1")
          (s."yargs@^13.3.2")
          ];
        "webpack-log@2.0.0" = f "webpack-log" "2.0.0" y "5b7928e0637593f119d32f6227c1e0ac31e1b47f" [
          (s."ansi-colors@^3.0.0")
          (s."uuid@^3.3.2")
          ];
        "webpack-log@^2.0.0" = s."webpack-log@2.0.0";
        "webpack-manifest-plugin@2.2.0" = f "webpack-manifest-plugin" "2.2.0" y "19ca69b435b0baec7e29fbe90fb4015de2de4f16" [
          (s."fs-extra@^7.0.0")
          (s."lodash@>=3.5 <5")
          (s."object.entries@^1.1.0")
          (s."tapable@^1.0.0")
          ];
        "webpack-sources@1.4.3" = f "webpack-sources" "1.4.3" y "eedd8ec0b928fbf1cbfe994e22d2d890f330a933" [
          (s."source-list-map@^2.0.0")
          (s."source-map@~0.6.1")
          ];
        "webpack-sources@^1.1.0" = s."webpack-sources@1.4.3";
        "webpack-sources@^1.3.0" = s."webpack-sources@1.4.3";
        "webpack-sources@^1.4.0" = s."webpack-sources@1.4.3";
        "webpack-sources@^1.4.1" = s."webpack-sources@1.4.3";
        "webpack-sources@^1.4.3" = s."webpack-sources@1.4.3";
        "webpack@4.44.2" = f "webpack" "4.44.2" y "6bfe2b0af055c8b2d1e90ed2cd9363f841266b72" [
          (s."@webassemblyjs/ast@1.9.0")
          (s."@webassemblyjs/helper-module-context@1.9.0")
          (s."@webassemblyjs/wasm-edit@1.9.0")
          (s."@webassemblyjs/wasm-parser@1.9.0")
          (s."acorn@^6.4.1")
          (s."ajv@^6.10.2")
          (s."ajv-keywords@^3.4.1")
          (s."chrome-trace-event@^1.0.2")
          (s."enhanced-resolve@^4.3.0")
          (s."eslint-scope@^4.0.3")
          (s."json-parse-better-errors@^1.0.2")
          (s."loader-runner@^2.4.0")
          (s."loader-utils@^1.2.3")
          (s."memory-fs@^0.4.1")
          (s."micromatch@^3.1.10")
          (s."mkdirp@^0.5.3")
          (s."neo-async@^2.6.1")
          (s."node-libs-browser@^2.2.1")
          (s."schema-utils@^1.0.0")
          (s."tapable@^1.1.3")
          (s."terser-webpack-plugin@^1.4.3")
          (s."watchpack@^1.7.4")
          (s."webpack-sources@^1.4.1")
          ];
        "websocket-driver@0.7.4" = f "websocket-driver" "0.7.4" y "89ad5295bbf64b480abcba31e4953aca706f5760" [
          (s."http-parser-js@>=0.5.1")
          (s."safe-buffer@>=5.1.0")
          (s."websocket-extensions@>=0.1.1")
          ];
        "websocket-driver@>=0.5.1" = s."websocket-driver@0.7.4";
        "websocket-driver@^0.7.4" = s."websocket-driver@0.7.4";
        "websocket-extensions@0.1.4" = f "websocket-extensions" "0.1.4" y "7f8473bc839dfd87608adb95d7eb075211578a42" [];
        "websocket-extensions@>=0.1.1" = s."websocket-extensions@0.1.4";
        "whatwg-encoding@1.0.5" = f "whatwg-encoding" "1.0.5" y "5abacf777c32166a51d085d6b4f3e7d27113ddb0" [
          (s."iconv-lite@0.4.24")
          ];
        "whatwg-encoding@^1.0.5" = s."whatwg-encoding@1.0.5";
        "whatwg-fetch@3.6.2" = f "whatwg-fetch" "3.6.2" y "dced24f37f2624ed0281725d51d0e2e3fe677f8c" [];
        "whatwg-fetch@^3.4.1" = s."whatwg-fetch@3.6.2";
        "whatwg-mimetype@2.3.0" = f "whatwg-mimetype" "2.3.0" y "3d4b1e0312d2079879f826aff18dbeeca5960fbf" [];
        "whatwg-mimetype@^2.3.0" = s."whatwg-mimetype@2.3.0";
        "whatwg-url@5.0.0" = f "whatwg-url" "5.0.0" y "966454e8765462e37644d3626f6742ce8b70965d" [
          (s."tr46@~0.0.3")
          (s."webidl-conversions@^3.0.0")
          ];
        "whatwg-url@8.7.0" = f "whatwg-url" "8.7.0" y "656a78e510ff8f3937bc0bcbe9f5c0ac35941b77" [
          (s."lodash@^4.7.0")
          (s."tr46@^2.1.0")
          (s."webidl-conversions@^6.1.0")
          ];
        "whatwg-url@^5.0.0" = s."whatwg-url@5.0.0";
        "whatwg-url@^8.0.0" = s."whatwg-url@8.7.0";
        "whatwg-url@^8.5.0" = s."whatwg-url@8.7.0";
        "which-boxed-primitive@1.0.2" = f "which-boxed-primitive" "1.0.2" y "13757bc89b209b049fe5d86430e21cf40a89a8e6" [
          (s."is-bigint@^1.0.1")
          (s."is-boolean-object@^1.1.0")
          (s."is-number-object@^1.0.4")
          (s."is-string@^1.0.5")
          (s."is-symbol@^1.0.3")
          ];
        "which-boxed-primitive@^1.0.2" = s."which-boxed-primitive@1.0.2";
        "which-module@2.0.0" = f "which-module" "2.0.0" y "d9ef07dce77b9902b8a3a8fa4b31c3e3f7e6e87a" [];
        "which-module@^2.0.0" = s."which-module@2.0.0";
        "which@1.3.1" = f "which" "1.3.1" y "a45043d54f5805316da8d62f9f50918d3da70b0a" [
          (s."isexe@^2.0.0")
          ];
        "which@2.0.2" = f "which" "2.0.2" y "7c6a8dd0a636a0327e10b59c9286eee93f3f51b1" [
          (s."isexe@^2.0.0")
          ];
        "which@^1.2.9" = s."which@1.3.1";
        "which@^1.3.1" = s."which@1.3.1";
        "which@^2.0.1" = s."which@2.0.2";
        "which@^2.0.2" = s."which@2.0.2";
        "widest-line@3.1.0" = f "widest-line" "3.1.0" y "8292333bbf66cb45ff0de1603b136b7ae1496eca" [
          (s."string-width@^4.0.0")
          ];
        "widest-line@^3.1.0" = s."widest-line@3.1.0";
        "word-wrap@1.2.3" = f "word-wrap" "1.2.3" y "610636f6b1f703891bd34771ccb17fb93b47079c" [];
        "word-wrap@^1.2.3" = s."word-wrap@1.2.3";
        "word-wrap@~1.2.3" = s."word-wrap@1.2.3";
        "workbox-background-sync@5.1.4" = f "workbox-background-sync" "5.1.4" y "5ae0bbd455f4e9c319e8d827c055bb86c894fd12" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-background-sync@^5.1.4" = s."workbox-background-sync@5.1.4";
        "workbox-broadcast-update@5.1.4" = f "workbox-broadcast-update" "5.1.4" y "0eeb89170ddca7f6914fa3523fb14462891f2cfc" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-broadcast-update@^5.1.4" = s."workbox-broadcast-update@5.1.4";
        "workbox-build@5.1.4" = f "workbox-build" "5.1.4" y "23d17ed5c32060c363030c8823b39d0eabf4c8c7" [
          (s."@babel/core@^7.8.4")
          (s."@babel/preset-env@^7.8.4")
          (s."@babel/runtime@^7.8.4")
          (s."@hapi/joi@^15.1.0")
          (s."@rollup/plugin-node-resolve@^7.1.1")
          (s."@rollup/plugin-replace@^2.3.1")
          (s."@surma/rollup-plugin-off-main-thread@^1.1.1")
          (s."common-tags@^1.8.0")
          (s."fast-json-stable-stringify@^2.1.0")
          (s."fs-extra@^8.1.0")
          (s."glob@^7.1.6")
          (s."lodash.template@^4.5.0")
          (s."pretty-bytes@^5.3.0")
          (s."rollup@^1.31.1")
          (s."rollup-plugin-babel@^4.3.3")
          (s."rollup-plugin-terser@^5.3.1")
          (s."source-map@^0.7.3")
          (s."source-map-url@^0.4.0")
          (s."stringify-object@^3.3.0")
          (s."strip-comments@^1.0.2")
          (s."tempy@^0.3.0")
          (s."upath@^1.2.0")
          (s."workbox-background-sync@^5.1.4")
          (s."workbox-broadcast-update@^5.1.4")
          (s."workbox-cacheable-response@^5.1.4")
          (s."workbox-core@^5.1.4")
          (s."workbox-expiration@^5.1.4")
          (s."workbox-google-analytics@^5.1.4")
          (s."workbox-navigation-preload@^5.1.4")
          (s."workbox-precaching@^5.1.4")
          (s."workbox-range-requests@^5.1.4")
          (s."workbox-routing@^5.1.4")
          (s."workbox-strategies@^5.1.4")
          (s."workbox-streams@^5.1.4")
          (s."workbox-sw@^5.1.4")
          (s."workbox-window@^5.1.4")
          ];
        "workbox-build@^5.1.4" = s."workbox-build@5.1.4";
        "workbox-cacheable-response@5.1.4" = f "workbox-cacheable-response" "5.1.4" y "9ff26e1366214bdd05cf5a43da9305b274078a54" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-cacheable-response@^5.1.4" = s."workbox-cacheable-response@5.1.4";
        "workbox-core@5.1.4" = f "workbox-core" "5.1.4" y "8bbfb2362ecdff30e25d123c82c79ac65d9264f4" [];
        "workbox-core@^5.1.4" = s."workbox-core@5.1.4";
        "workbox-expiration@5.1.4" = f "workbox-expiration" "5.1.4" y "92b5df461e8126114943a3b15c55e4ecb920b163" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-expiration@^5.1.4" = s."workbox-expiration@5.1.4";
        "workbox-google-analytics@5.1.4" = f "workbox-google-analytics" "5.1.4" y "b3376806b1ac7d7df8418304d379707195fa8517" [
          (s."workbox-background-sync@^5.1.4")
          (s."workbox-core@^5.1.4")
          (s."workbox-routing@^5.1.4")
          (s."workbox-strategies@^5.1.4")
          ];
        "workbox-google-analytics@^5.1.4" = s."workbox-google-analytics@5.1.4";
        "workbox-navigation-preload@5.1.4" = f "workbox-navigation-preload" "5.1.4" y "30d1b720d26a05efc5fa11503e5cc1ed5a78902a" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-navigation-preload@^5.1.4" = s."workbox-navigation-preload@5.1.4";
        "workbox-precaching@5.1.4" = f "workbox-precaching" "5.1.4" y "874f7ebdd750dd3e04249efae9a1b3f48285fe6b" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-precaching@^5.1.4" = s."workbox-precaching@5.1.4";
        "workbox-range-requests@5.1.4" = f "workbox-range-requests" "5.1.4" y "7066a12c121df65bf76fdf2b0868016aa2bab859" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-range-requests@^5.1.4" = s."workbox-range-requests@5.1.4";
        "workbox-routing@5.1.4" = f "workbox-routing" "5.1.4" y "3e8cd86bd3b6573488d1a2ce7385e547b547e970" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-routing@^5.1.4" = s."workbox-routing@5.1.4";
        "workbox-strategies@5.1.4" = f "workbox-strategies" "5.1.4" y "96b1418ccdfde5354612914964074d466c52d08c" [
          (s."workbox-core@^5.1.4")
          (s."workbox-routing@^5.1.4")
          ];
        "workbox-strategies@^5.1.4" = s."workbox-strategies@5.1.4";
        "workbox-streams@5.1.4" = f "workbox-streams" "5.1.4" y "05754e5e3667bdc078df2c9315b3f41210d8cac0" [
          (s."workbox-core@^5.1.4")
          (s."workbox-routing@^5.1.4")
          ];
        "workbox-streams@^5.1.4" = s."workbox-streams@5.1.4";
        "workbox-sw@5.1.4" = f "workbox-sw" "5.1.4" y "2bb34c9f7381f90d84cef644816d45150011d3db" [];
        "workbox-sw@^5.1.4" = s."workbox-sw@5.1.4";
        "workbox-webpack-plugin@5.1.4" = f "workbox-webpack-plugin" "5.1.4" y "7bfe8c16e40fe9ed8937080ac7ae9c8bde01e79c" [
          (s."@babel/runtime@^7.5.5")
          (s."fast-json-stable-stringify@^2.0.0")
          (s."source-map-url@^0.4.0")
          (s."upath@^1.1.2")
          (s."webpack-sources@^1.3.0")
          (s."workbox-build@^5.1.4")
          ];
        "workbox-window@5.1.4" = f "workbox-window" "5.1.4" y "2740f7dea7f93b99326179a62f1cc0ca2c93c863" [
          (s."workbox-core@^5.1.4")
          ];
        "workbox-window@^5.1.4" = s."workbox-window@5.1.4";
        "worker-farm@1.7.0" = f "worker-farm" "1.7.0" y "26a94c5391bbca926152002f69b84a4bf772e5a8" [
          (s."errno@~0.1.7")
          ];
        "worker-farm@^1.7.0" = s."worker-farm@1.7.0";
        "worker-rpc@0.1.1" = f "worker-rpc" "0.1.1" y "cb565bd6d7071a8f16660686051e969ad32f54d5" [
          (s."microevent.ts@~0.1.1")
          ];
        "worker-rpc@^0.1.0" = s."worker-rpc@0.1.1";
        "wrap-ansi@3.0.1" = f "wrap-ansi" "3.0.1" y "288a04d87eda5c286e060dfe8f135ce8d007f8ba" [
          (s."string-width@^2.1.1")
          (s."strip-ansi@^4.0.0")
          ];
        "wrap-ansi@4.0.0" = f "wrap-ansi" "4.0.0" y "b3570d7c70156159a2d42be5cc942e957f7b1131" [
          (s."ansi-styles@^3.2.0")
          (s."string-width@^2.1.1")
          (s."strip-ansi@^4.0.0")
          ];
        "wrap-ansi@5.1.0" = f "wrap-ansi" "5.1.0" y "1fd1f67235d5b6d0fee781056001bfb694c03b09" [
          (s."ansi-styles@^3.2.0")
          (s."string-width@^3.0.0")
          (s."strip-ansi@^5.0.0")
          ];
        "wrap-ansi@6.2.0" = f "wrap-ansi" "6.2.0" y "e9393ba07102e6c91a3b221478f0257cd2856e53" [
          (s."ansi-styles@^4.0.0")
          (s."string-width@^4.1.0")
          (s."strip-ansi@^6.0.0")
          ];
        "wrap-ansi@7.0.0" = f "wrap-ansi" "7.0.0" y "67e145cff510a6a6984bdf1152911d69d2eb9e43" [
          (s."ansi-styles@^4.0.0")
          (s."string-width@^4.1.0")
          (s."strip-ansi@^6.0.0")
          ];
        "wrap-ansi@^3.0.1" = s."wrap-ansi@3.0.1";
        "wrap-ansi@^4.0.0" = s."wrap-ansi@4.0.0";
        "wrap-ansi@^5.1.0" = s."wrap-ansi@5.1.0";
        "wrap-ansi@^6.2.0" = s."wrap-ansi@6.2.0";
        "wrap-ansi@^7.0.0" = s."wrap-ansi@7.0.0";
        "wrappy@1" = s."wrappy@1.0.2";
        "wrappy@1.0.2" = f "wrappy" "1.0.2" y "b5243d8f3ec1aa35f1364605bc0d1036e30ab69f" [];
        "write-file-atomic@3.0.3" = f "write-file-atomic" "3.0.3" y "56bd5c5a5c70481cd19c571bd39ab965a5de56e8" [
          (s."imurmurhash@^0.1.4")
          (s."is-typedarray@^1.0.0")
          (s."signal-exit@^3.0.2")
          (s."typedarray-to-buffer@^3.1.5")
          ];
        "write-file-atomic@^3.0.0" = s."write-file-atomic@3.0.3";
        "ws@6.2.2" = f "ws" "6.2.2" y "dd5cdbd57a9979916097652d78f1cc5faea0c32e" [
          (s."async-limiter@~1.0.0")
          ];
        "ws@7.5.3" = f "ws" "7.5.3" y "160835b63c7d97bfab418fc1b8a9fced2ac01a74" [];
        "ws@^6.2.1" = s."ws@6.2.2";
        "ws@^7.4.6" = s."ws@7.5.3";
        "xml-name-validator@3.0.0" = f "xml-name-validator" "3.0.0" y "6ae73e06de4d8c6e47f9fb181f78d648ad457c6a" [];
        "xml-name-validator@^3.0.0" = s."xml-name-validator@3.0.0";
        "xmlchars@2.2.0" = f "xmlchars" "2.2.0" y "060fe1bcb7f9c76fe2a17db86a9bc3ab894210cb" [];
        "xmlchars@^2.2.0" = s."xmlchars@2.2.0";
        "xtend@4.0.2" = f "xtend" "4.0.2" y "bb72779f5fa465186b1f438f674fa347fdb5db54" [];
        "xtend@^4.0.0" = s."xtend@4.0.2";
        "xtend@~4.0.1" = s."xtend@4.0.2";
        "y18n@4.0.3" = f "y18n" "4.0.3" y "b5f259c82cd6e336921efd7bfd8bf560de9eeedf" [];
        "y18n@^4.0.0" = s."y18n@4.0.3";
        "yallist@3.1.1" = f "yallist" "3.1.1" y "dbb7daf9bfd8bac9ab45ebf602b8cbad0d5d08fd" [];
        "yallist@4.0.0" = f "yallist" "4.0.0" y "9bb92790d9c0effec63be73519e11a35019a3a72" [];
        "yallist@^3.0.2" = s."yallist@3.1.1";
        "yallist@^4.0.0" = s."yallist@4.0.0";
        "yaml@1.10.2" = f "yaml" "1.10.2" y "2301c5ffbf12b467de8da2333a459e29e7920e4b" [];
        "yaml@^1.10.0" = s."yaml@1.10.2";
        "yaml@^1.7.2" = s."yaml@1.10.2";
        "yargs-parser@13.1.2" = f "yargs-parser" "13.1.2" y "130f09702ebaeef2650d54ce6e3e5706f7a4fb38" [
          (s."camelcase@^5.0.0")
          (s."decamelize@^1.2.0")
          ];
        "yargs-parser@18.1.3" = f "yargs-parser" "18.1.3" y "be68c4975c6b2abf469236b0c870362fab09a7b0" [
          (s."camelcase@^5.0.0")
          (s."decamelize@^1.2.0")
          ];
        "yargs-parser@^13.1.2" = s."yargs-parser@13.1.2";
        "yargs-parser@^18.1.2" = s."yargs-parser@18.1.3";
        "yargs@13.3.2" = f "yargs" "13.3.2" y "ad7ffefec1aa59565ac915f82dccb38a9c31a2dd" [
          (s."cliui@^5.0.0")
          (s."find-up@^3.0.0")
          (s."get-caller-file@^2.0.1")
          (s."require-directory@^2.1.1")
          (s."require-main-filename@^2.0.0")
          (s."set-blocking@^2.0.0")
          (s."string-width@^3.0.0")
          (s."which-module@^2.0.0")
          (s."y18n@^4.0.0")
          (s."yargs-parser@^13.1.2")
          ];
        "yargs@15.4.1" = f "yargs" "15.4.1" y "0d87a16de01aee9d8bec2bfbf74f67851730f4f8" [
          (s."cliui@^6.0.0")
          (s."decamelize@^1.2.0")
          (s."find-up@^4.1.0")
          (s."get-caller-file@^2.0.1")
          (s."require-directory@^2.1.1")
          (s."require-main-filename@^2.0.0")
          (s."set-blocking@^2.0.0")
          (s."string-width@^4.2.0")
          (s."which-module@^2.0.0")
          (s."y18n@^4.0.0")
          (s."yargs-parser@^18.1.2")
          ];
        "yargs@^13.3.2" = s."yargs@13.3.2";
        "yargs@^15.4.1" = s."yargs@15.4.1";
        "yarn@1.22.11" = f "yarn" "1.22.11" y "d0104043e7349046e0e2aec977c24be106925ed6" [];
        "yarn@^1.21.1" = s."yarn@1.22.11";
        "yn@3.1.1" = f "yn" "3.1.1" y "1e87401a09d767c1d5eab26a6e4c185182d2eb50" [];
        "yocto-queue@0.1.0" = f "yocto-queue" "0.1.0" y "0294eb3dee05028d31ee1a5fa2c556a6aaf10a1b" [];
        "yocto-queue@^0.1.0" = s."yocto-queue@0.1.0";
        "zen-observable-ts@0.8.21" = f "zen-observable-ts" "0.8.21" y "85d0031fbbde1eba3cd07d3ba90da241215f421d" [
          (s."tslib@^1.9.3")
          (s."zen-observable@^0.8.0")
          ];
        "zen-observable-ts@1.1.0" = f "zen-observable-ts" "1.1.0" y "2d1aa9d79b87058e9b75698b92791c1838551f83" [
          (s."@types/zen-observable@0.8.3")
          (s."zen-observable@0.8.15")
          ];
        "zen-observable-ts@^0.8.21" = s."zen-observable-ts@0.8.21";
        "zen-observable-ts@~1.1.0" = s."zen-observable-ts@1.1.0";
        "zen-observable@0.8.15" = f "zen-observable" "0.8.15" y "96415c512d8e3ffd920afd3889604e30b9eaac15" [];
        "zen-observable@^0.8.0" = s."zen-observable@0.8.15";
        }
