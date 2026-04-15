const Paths = {
    Attempts: {
        Base: '/attempts',
        List: '/',
        Send: '/solution',
        View: '/:attemptId'

    },
    Auth: {
        Base: '/auth',
        Login: '/login',
        Logout: '/logout',
        Refresh: '/refresh',
        Register: '/register',
        RequestPasswordRestore: '/request-restore',
        RestorePassword: '/restore',
        Verify: '/verify'
    },
    Base: '/api',
    Chat: {
        Base: '/chat',
        Message: '/:specificExerciseId'
    },
    Dashboard: {
        Base: '/dashboard',
        View: '/'
    },
    Exercises: {
        Base: '/exercises',
        Language: '/:exerciseId/language/:languageId',
        List: '/',
        View: '/:exerciseId'
    },
    Health: {
        Base: '/health',
        Check: '/'
    },
    Users: {
        Account: '/account',
        Attempts: '/attempts',
        Base: '/users',
        Education: '/education',
        Messages: '/messages',
        Password: '/password',
        Profile: '/profile'
    }
} as const;

export default Paths;
