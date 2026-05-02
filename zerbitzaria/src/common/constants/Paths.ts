import { environment } from "@common/constants/env";

const Paths = {
    Attempts: {
        Base: "/attempts",
        List: "/",
        Send: "/solution",
        View: "/:attemptId",
    },
    Auth: {
        Base: "/auth",
        Login: "/login",
        Logout: "/logout",
        Refresh: "/refresh",
        Register: "/register",
        RequestPasswordRestore: "/request-restore",
        RestorePassword: "/restore",
        Verify: "/verify",
    },
    Base: environment.VITE_BASE_API_PATH,
    Chat: {
        Base: "/chat",
        Message: "/:specificExerciseId",
    },
    Dashboard: {
        Base: "/dashboard",
        View: "/",
    },
    Exercises: {
        Base: "/exercises",
        Categories: "/categories",
        Language: "/:exerciseId/language",
        List: "/",
        ProgrammingLanguages: "/programming-languages",
        Tags: "/tags",
        View: "/:ariketa_id",
    },
    Health: {
        Base: "/health",
        Check: "/",
    },
    Users: {
        Account: "/account",
        Attempts: "/attempts",
        Base: "/users",
        Education: "/education",
        Messages: "/messages",
        Password: "/password",
        Profile: "/profile",
    },
} as const;

export default Paths;
