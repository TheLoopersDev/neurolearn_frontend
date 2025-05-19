'use server';

import { signIn, signOut } from '@/lib/auth';

export async function signInAction() {
    await signIn('google', { redirectTo: '/' });
}

export async function signOutAction() {
    await signOut({ redirectTo: '/' });
}

// 'use server';

// import { signIn as signInWithGoogle, signOut } from '@/lib/auth';

// export async function signInAction() {
//     await signIn('google', { redirectTo: '/' });
// }

// export async function signInWithEmailAction() {
//     await signIn
// }

// export async function signOutAction() {
//     await signOut({ redirectTo: '/' });
// }
