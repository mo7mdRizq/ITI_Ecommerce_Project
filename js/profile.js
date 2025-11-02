// ====== Shared Local Storage Helper Functions ======
// نستخدم "currentUser" كما هو موجود في الكود الذي أرسلته للبروفايل
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
}

// ====== 1. Setup Profile Icon Navigation (التوجيه) ======
function setupProfileIconNavigation() {
    // ⚠️ تأكد أن أيقونة البروفايل في HTML تحمل ID: "profileIcon"
    const profileIcon = document.getElementById("profileIcon"); 

    if (profileIcon) {
        profileIcon.addEventListener("click", (e) => {
            e.preventDefault();
            
            const user = getLoggedInUser(); 
            // المسار الافتراضي لصفحة البروفايل
            const profilePagePath = "../pages/user/profile.html"; 
            // المسار الافتراضي لصفحة تسجيل الدخول
            const signinPagePath = "../pages/auth/signin.html"; 

            if (user) {
                // المستخدم مسجل دخول، قم بالتوجيه لصفحة البروفايل
                window.location.href = profilePagePath;

            } else {
                // المستخدم غير مسجل دخول
                window.location.href = signinPagePath; 
            }
        });
    }
}

// ====== 2. Dashboard Visibility Control (الإظهار والإخفاء حسب الدور) ======
function setupDashboardVisibility() {
    // ⚠️ تأكد أن رابط الداشبورد يحمل ID: "dashboardLink"
    const dashboardLinkLi = document.getElementById("dashboard"); // LI element
    const dashboardLinkA = document.getElementById("dashboardLink"); // A element

    // إخفاء الـ LI أو الـ A كخيار افتراضي لمنع الظهور اللحظي
    if (dashboardLinkLi) {
        dashboardLinkLi.style.display = 'none';
    } else if (dashboardLinkA) {
        // إذا كان الـ ID على الـ A مباشرة
        dashboardLinkA.style.display = 'none';
    }


    const user = getLoggedInUser();

    if (user && (user.role === 'seller' || user.role === 'admin')) {
        let destinationURL = "";
        
        if (user.role === 'admin') {
            destinationURL = "../pages/admin/admin-dashboard.html";
        } else {
            destinationURL = "../pages/seller/seller-dashboard.html";
        }

        // إظهار الرابط وتحديث مساره
        if (dashboardLinkLi) {
            dashboardLinkLi.style.display = 'block'; // أو 'flex' حسب تصميم الناف بار
            // تحديث رابط الداشبورد داخل الـ LI
            const innerLink = dashboardLinkLi.querySelector('a');
            if(innerLink) innerLink.href = destinationURL;

        } else if (dashboardLinkA) {
            dashboardLinkA.style.display = 'block';
            dashboardLinkA.href = destinationURL;
        }
    }
}


// ====== Initialization ======
document.addEventListener("DOMContentLoaded", () => {
    // هذا سيعمل على أي صفحة بها navbar
    setupProfileIconNavigation();
    setupDashboardVisibility();
});