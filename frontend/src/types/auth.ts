export type UserRole = 'PATIENT' | 'DOCTOR' | 'PLANNER';

export interface User {
    role: UserRole;
    name?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (role: UserRole) => void;
    logout: () => void;
}
