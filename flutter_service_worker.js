'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"capytale.js": "26c38c26a29bcf9653696738829228da",
"icons/Icon-512.png": "d282023ba310553c53d99dea8371334d",
"icons/Icon-maskable-512.png": "d282023ba310553c53d99dea8371334d",
"icons/Icon-192.png": "87873e8adf03bbc4cdbc634c56773912",
"icons/Icon-maskable-192.png": "87873e8adf03bbc4cdbc634c56773912",
"manifest.json": "9cabdadca485e51bd43668b25cf7593b",
"index.html": "e4ae46d99790f6aa0b1c9814983f0b79",
"/": "e4ae46d99790f6aa0b1c9814983f0b79",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin.json": "6aa24b81b7957741eb153f7152325889",
"assets/assets/blockly/blockly.min.js": "d82238c2d80b4fe9e8f36e3f3db83b60",
"assets/assets/blockly/media/quote1.png": "390e15501d3d0a01993d1da1639f2181",
"assets/assets/blockly/media/sprites.svg": "911d25e52cb1d95f2d942ec5b7670d06",
"assets/assets/blockly/media/sprites.png": "e48f1139901723da3ecbd9dab1ba2e3d",
"assets/assets/blockly/media/click.ogg": "d62ab7f0a6c29b69e90793dffa4ad828",
"assets/assets/blockly/media/delete.wav": "ace3b1f0042c22fafa5ddc7d4bb4b050",
"assets/assets/blockly/media/disconnect.ogg": "f43c7533d7d9e35d40f696015a297d40",
"assets/assets/blockly/media/pilcrow.png": "580e99d437cb1c9c78fc54baea8bb168",
"assets/assets/blockly/media/click.mp3": "217b91bbdfcb63874a5efa3a6f361380",
"assets/assets/blockly/media/resize-handle.svg": "c17caef6640cd918dde02956a45d785e",
"assets/assets/blockly/media/dropdown-arrow.svg": "be850da552699b8705b5902cb59c6d37",
"assets/assets/blockly/media/click.wav": "2ca0992269564624ad5bc0d3c58a641f",
"assets/assets/blockly/media/disconnect.wav": "409e7fabb73e895a642b9d3899d6ee7f",
"assets/assets/blockly/media/handdelete.cur": "b0b4b0b44ed0136f7899c8b2957ca68f",
"assets/assets/blockly/media/disconnect.mp3": "a275b1ba174f21b5688e333266375718",
"assets/assets/blockly/media/delete-icon.svg": "2315b20f4a680a3394aa5879ebc47587",
"assets/assets/blockly/media/handclosed.cur": "6b45ea439228cba3afaa23022f1246a2",
"assets/assets/blockly/media/delete.ogg": "5c3387d5bcbebd49fd7c7837c65321b4",
"assets/assets/blockly/media/foldout-icon.svg": "4db734a8ffaca9416247553cb63409bd",
"assets/assets/blockly/media/quote0.png": "0b9354e0d3e28a11f5a6d931ebb5a3ef",
"assets/assets/blockly/media/handopen.cur": "505cbb975d6102c374ec64aa92397051",
"assets/assets/blockly/media/delete.mp3": "dfe58781f5681406e35890a575765345",
"assets/assets/blockly/media/1x1.gif": "4b252c2abb0553eeb61ed061862f7540",
"assets/assets/blockly/index.html": "b57cf2608a08e538b074176cfd073613",
"assets/assets/blockly/custom_generators.js": "80372cc6d349481fe7a7cf812fae6929",
"assets/assets/blockly/toolbox.xml": "9f0764c85ca765cb59f692c6bf10a210",
"assets/assets/blockly/blockly_compressed.js": "5aa42e8144270ff761a93d49724cfbbe",
"assets/assets/blockly/msg/fr.js": "c6ae4b36c0fc32b9a7d8a625168e1378",
"assets/assets/blockly/custom_generators_python.js": "0e7995d92c6435a1f749cafdcf4b595c",
"assets/assets/blockly/blocks_compressed.js.map": "5da9d7befc3a1dccec54c03a2daa5ab2",
"assets/assets/blockly/python_pipeline.js": "ba9cee42df8f77309020a1beff6bbee2",
"assets/assets/blockly/javascript_compressed.js.map": "c530234238c9f09f1dae39be19a9c435",
"assets/assets/blockly/javascript_compressed.js": "faff45afbfcf4d8b95a501f81fd9bb4f",
"assets/assets/blockly/python_editor.html": "8fb46e7d7d1bc0643812ce367438a3e1",
"assets/assets/blockly/python_parser.js": "91a1d668b907a8e477c32781ab3abab7",
"assets/assets/blockly/custom_blocks.js": "36674ae14d46d3b1b76190d7487b8b0f",
"assets/assets/blockly/blocks_compressed.js": "3e55b2fd165638573822ea8fbeba8563",
"assets/assets/images/obstacle-left.png": "e151639c917c163c5974e4b9caa7e2b5",
"assets/assets/images/arrow2.svg": "8ecbad8c721d0d62b0fcd0cece9e3f6f",
"assets/assets/images/Dessus.png": "af6f0be253cd0c7cb1226daea78442ae",
"assets/assets/images/imu/top.png": "bed73b0cdd8caba87b354b555cb0ed81",
"assets/assets/images/imu/front.png": "bcb785b88547b07eecc27b9c560ff60a",
"assets/assets/images/imu/side.png": "265fb88ffa36650e4db874414c4015ad",
"assets/assets/images/ilo-remote-race-button.png": "9e8d1562cb24efadea53e4cb1c47b686",
"assets/assets/images/preview_cours.webp": "24982f0f918314c8e9ae23701f2627aa",
"assets/assets/images/cartoon_side.png": "30f441926c626e0d37a0c05eb167d93c",
"assets/assets/images/com_port.png": "e8655c517f5d5590312c91af1c520369",
"assets/assets/images/preview_eval.webp": "50583014c4b4f82c746d7576d90248d7",
"assets/assets/images/robot_picto.svg": "1820607279415d9bf6cc5a0f3443b545",
"assets/assets/images/arrow1.svg": "ae4041e4fe52134c5d38858cadd2c7d2",
"assets/assets/images/arrow3.svg": "7e941636aa7c05e0c9c90e39189ced87",
"assets/assets/images/icon.png": "67bf87de9aa6a6cf53c3452ce92c0efd",
"assets/assets/images/arrow4.svg": "68b6a6b0a3e05ff1bfc8caa1be7ea27b",
"assets/assets/images/ilorobot-title.svg": "9ec51b78507d5d7cd715684523154d4e",
"assets/assets/images/mini-obstacle-left.png": "9bbf45a468f6819af363d65297d5d680",
"assets/assets/images/iloscan.png": "94c4c6da64ae2fa4c48ca4845e549a9b",
"assets/assets/images/ilo-remote-race-newbg.png": "28d5aee26460c98170b8e598922e51ce",
"assets/assets/images/preview_app.webp": "866bd95899e0739d2a13ef360cb649fc",
"assets/assets/images/obstacle-back.png": "121a277eb3c22e8317f1ab3ddd9c6548",
"assets/assets/images/obstacle-front.png": "9d32f0b749c47b8846274d605eb98ac0",
"assets/assets/images/preview_app.png": "504a0c24c8b6ce3d7209bebb7ec61b40",
"assets/assets/images/robot_no_wheels.png": "ded5411704593d220d7bbca043e7e53e",
"assets/assets/images/texture_brick.jpeg": "d170c161041ce0847da20101ae5b20e5",
"assets/assets/images/mini-obstacle-back.png": "ef328322f014f350e6802edc98f09de5",
"assets/assets/images/google.png": "937c87b4439809d5b17b82728df09639",
"assets/assets/images/ilo_side1.png": "ddf0c6a0732e7908bb33f54ff9333da9",
"assets/assets/images/obstacle-right.png": "ccc14d6862ab237ce8c6206d16b525f0",
"assets/assets/images/ilorobot-title-white.svg": "1afadf4b07452957133ac0e84a969641",
"assets/assets/images/iloscan.svg": "77b699a6f0dbc5a493a129649d3b6d59",
"assets/assets/images/ilorobot-title-white.png": "b93e0653b77a00c3a286a067d2dc022d",
"assets/assets/images/i2c/robot_demonte.jpg": "ef31aef82215d95b7a5e7a8758323a05",
"assets/assets/images/i2c/oscillo.png": "5334b00d100f0f0cfe2e8d97989ef69e",
"assets/assets/images/mini-ilo-calculs.svg": "1ed87ca587f859b7af21b7beab31e366",
"assets/assets/images/ilorobot-neutral.png": "bf521dc1c773730ef982204245157338",
"assets/assets/images/ilo-pencils.png": "93e4edc77d9a2bcc197ea5cca2709a48",
"assets/assets/images/mini-ilorobot-top1.png": "e4f20c1748cef6b38684f9b585f2d19a",
"assets/assets/images/icon-little.png": "47e1af81edf38d5d4f365a5f8a705d5f",
"assets/assets/images/mini-obstacle-right.png": "2519b8580867cd577e90e35d333733e6",
"assets/assets/images/cartoon_side.svg": "19af43081dce2cf6ebe9de54f855408e",
"assets/assets/images/ilocolors.svg": "ea49f0d4a9b969e0409ef7e5a778ae73",
"assets/assets/images/mini-ilorobot-top.png": "a1c45d3dfaf19e1a811413f6ef402b4e",
"assets/assets/images/mini-obstacle-front.png": "20a147e975023f74f2e42648844a4eb1",
"assets/assets/images/bottom_wave.svg": "6523bc54aa50585b06693159cc71cb57",
"assets/assets/sounds/siren.mp3": "f804d9af234d6287a09ee1fc0f740df7",
"assets/assets/sounds/laugh.mp3": "a9f98079b4dfb8bb6739fa43bdd6c9a8",
"assets/assets/sounds/horn.mp3": "bb79bac713c02f795addc93431c5fba2",
"assets/assets/sounds/beep.mp3": "70860b475d4bcca8eccbcfcb607eb812",
"assets/assets/animations/gif_robot_recharge_vf.gif": "1e02a78c7cfbf7dfb8c0911553ec8a3e",
"assets/assets/animations/gif_robot_standard_vf.gif": "03bede28ca0516f14b22128b93877ac3",
"assets/assets/animations/autonomes/gif_ilo_logo.gif": "2edff42b952f462e9abdf51f3a13c945",
"assets/assets/animations/autonomes/gif_detecteur_obstacle.gif": "3e832319bf7b9ef347f02ed323f092ab",
"assets/assets/animations/autonomes/gif_suivis_de_ligne.gif": "71e5954b789c5f8263eebe6a94a139a1",
"assets/assets/animations/autonomes/gif_cartes_colorees.gif": "694901cd566cc21d2bdae6849ba4640a",
"assets/assets/animations/autonomes/gif_labyrinthe.gif": "286ce26d9df01af9d30cbdcabee7dd17",
"assets/assets/animations/autonomes/gif_imu_water.gif": "facce3beee4d0d19a6ed3b58d2655d84",
"assets/assets/animations/gif_batterie_faible_vf.gif": "a72326ffdb081344273dcdc0413b8d50",
"assets/assets/animations/gif_robot_connectee_vf.gif": "03cfff623ffc67694bfaa4889ae6694d",
"assets/assets/animations/rive/loader_app_color.riv": "9260dcb2ad0314d08aa8171ed4238c87",
"assets/assets/animations/rive/waiting.riv": "7cd79ac917bd6ce562715d518769f3e9",
"assets/assets/animations/rive/ilo_base_app.riv": "2b4f63f0a4b52ea9a1d80d5c18f302aa",
"assets/assets/animations/rive/animation_ui.riv": "2305d65100499f945a0282b3000d29fe",
"assets/assets/animations/rive/splash.riv": "2bc7b7b3d7178c2958c6c61f81aec19e",
"assets/assets/animations/gif_robot_erreur_vf.gif": "51b7803aea707ed96bfa368239d1e792",
"assets/fonts/MaterialIcons-Regular.otf": "7aca84c88429a8876359f896e6a56103",
"assets/NOTICES": "e1479147c34e758009af15287a345ec9",
"assets/packages/flutter_inappwebview_web/assets/web/web_support.js": "509ae636cfdd93e49b5a6eaf0f06d79f",
"assets/packages/record_web/assets/js/record.fixwebmduration.js": "1f0108ea80c8951ba702ced40cf8cdce",
"assets/packages/record_web/assets/js/record.worklet.js": "6d247986689d283b7e45ccdf7214c2ff",
"assets/packages/font_awesome_flutter/lib/fonts/Font-Awesome-7-Free-Solid-900.otf": "debe8bbde6183a6e178e7b3bb87a0ee6",
"assets/packages/font_awesome_flutter/lib/fonts/Font-Awesome-7-Brands-Regular-400.otf": "800046bced6ec02eac081de653cdae2f",
"assets/packages/font_awesome_flutter/lib/fonts/Font-Awesome-7-Free-Regular-400.otf": "2f74096cd99fa72b3e39789a7eff7fcd",
"assets/packages/wakelock_plus/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_AMS-Regular.ttf": "657a5353a553777e270827bd1630e467",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Math-Italic.ttf": "a7732ecb5840a15be39e1eda377bc21d",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Italic.ttf": "d89b80e7bdd57d238eeaa80ed9a1013a",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size3-Regular.ttf": "e87212c26bb86c21eb028aba2ac53ec3",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-BoldItalic.ttf": "e3c361ea8d1c215805439ce0941a1c8d",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Caligraphic-Regular.ttf": "7ec92adfa4fe03eb8e9bfb60813df1fa",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Math-BoldItalic.ttf": "946a26954ab7fbd7ea78df07795a6cbc",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size1-Regular.ttf": "1e6a3368d660edc3a2fbbe72edfeaa85",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size4-Regular.ttf": "85554307b465da7eb785fd3ce52ad282",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size2-Regular.ttf": "959972785387fe35f7d47dbfb0385bc4",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Bold.ttf": "9eef86c1f9efa78ab93d41a0551948f7",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Fraktur-Regular.ttf": "dede6f2c7dad4402fa205644391b3a94",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Regular.ttf": "b5f967ed9e4933f1c3165a12fe3436df",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Caligraphic-Bold.ttf": "a9c8e437146ef63fcd6fae7cf65ca859",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Fraktur-Bold.ttf": "46b41c4de7a936d099575185a94855c4",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Regular.ttf": "5a5766c715ee765aa1398997643f1589",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Typewriter-Regular.ttf": "87f56927f1ba726ce0591955c8b3b42d",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Italic.ttf": "ac3b1882325add4f148f05db8cafd401",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Script-Regular.ttf": "55d2dcd4778875a53ff09320a85a5296",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Bold.ttf": "ad0a28f28f736cf4c121bcb0e719b88a",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/packages/liquid_glass_renderer/lib/assets/shaders/liquid_glass_arbitrary.frag": "165123cf809bb7cea0f60cdb8658f67a",
"assets/packages/liquid_glass_renderer/lib/assets/shaders/liquid_glass_filter.frag": "7a69a481c4b01af713dc9d1ba40463fa",
"assets/packages/liquid_glass_renderer/lib/assets/shaders/liquid_glass_geometry_blended.frag": "884d38ba3a7ab0ab72a463611f229e53",
"assets/packages/liquid_glass_renderer/lib/assets/shaders/liquid_glass_final_render.frag": "77416b256a173eb8a39a26e00899bc1a",
"assets/FontManifest.json": "a16cc92de852ee0f263edb1c20749595",
"assets/AssetManifest.bin": "ac5e9737cbf89961536928a52e6c7c55",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"favicon.png": "f3dd57534664db8b7a8612b8b37b3d5c",
"esp_flasher.js": "85859e7465c60ca3fc96804396bdaec8",
"PUBLIC_README.md": "b89a2a2bc8721801d10b331c5a4cc46f",
"flutter_bootstrap.js": "6b01d74cc57eacaac2de80e07b9be762",
"version.json": "44e3e4e86f888430728a600259da7ed2",
"main.dart.js": "91290b54b1f5aa079f370a245f79281e",
"serial.js": "4a00097913775b7ac53e57a6c094d4b5",
"firmware/battery_fix.bin": "9afa613092f9ea7f974dbb3581cfe0f3",
"firmware/partition-table.bin": "2ddc2d5f85b2c5288013adbe45d9cb7b",
"firmware/bootloader.bin": "70c9a76fcbc41d62b871521885c08342"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
