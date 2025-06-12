const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if(!session) {
        window.location.href = "login.html";
    }
};

checkAuth();