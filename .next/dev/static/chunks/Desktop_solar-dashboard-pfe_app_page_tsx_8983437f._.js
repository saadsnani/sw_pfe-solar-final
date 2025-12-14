(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/solar-dashboard-pfe/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$solar$2d$dashboard$2d$pfe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/solar-dashboard-pfe/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function Home() {
    _s();
    // 1. DÉCLARATION DES VARIABLES (STATE)
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$solar$2d$dashboard$2d$pfe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$solar$2d$dashboard$2d$pfe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // 2. TAF3IL L-MÉMOIRE (useEffect)
    // Kaykhddem ghir mrra w7da bach ychouf wach deja dkhlti
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$solar$2d$dashboard$2d$pfe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            // Kat-9ra mn l-Mémoire dyal Browser
            const savedLogin = localStorage.getItem("userLoggedIn");
            if (savedLogin === "true") {
                setIsLoggedIn(true);
            }
        // L-[] kat-goul l-React: khdm hadchi ghir melli t-ch3l l-page
        }
    }["Home.useEffect"], []);
    // 3. FONCTION SE CONNECTER
    const handleLogin = (e)=>{
        e.preventDefault(); // bach ma-y-darwch l-page
        // Ghaliban hna 3ndk l-password (mtln: 1234)
        if (password === "votre_code_secret") {
            setIsLoggedIn(true);
            // Hada howa s-ster l-Mohim: Kay-sjjl f l-Mémoire
            localStorage.setItem("userLoggedIn", "true");
        } else {
            alert("Code incorrect!"); // Hatta had s-ster zidou bach yban l-erreur
        }
    };
    // 4. FONCTION DÉCONNEXION
    const handleLogout = ()=>{
        setIsLoggedIn(false);
        // Hada howa s-ster l-Mohim: Kay-ms7 l-Mémoire
        localStorage.removeItem("userLoggedIn");
        // Ghaydir actualisation automatique
        window.location.reload();
    };
// Hna katbdaw t-khelli l-code dyalkom dyal (return)
// ...
// 👇👇👇 ZID L-BOUTON DYAL DÉCONNEXION F L-HEADER HNA 👇👇👇
// W3yyet 3la 'handleLogout' melli y-cliki bnadem
// ... (Code dyal l-HTML (return) dyalkom, ma-tms7ouch) ...
}
_s(Home, "U/p1r3UJcf7TEQ6uK1fR7p8WpJM=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_solar-dashboard-pfe_app_page_tsx_8983437f._.js.map