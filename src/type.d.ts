export type rol = 'Admin' | 'Responsable' | 'Soci' | 'Visitant';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    rol: number;
}

export type newUser =  Omit<User, 'uid'>
