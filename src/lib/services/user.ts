const USER_BASE_URL = `${process.env.BACKEND_BASE_URL}/user`;

export async function getUserByEmail(email: string) {
    try {
        const res = await fetch(`${USER_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const user = await res.json();
        return user;
    } catch {
        throw new Error('Could not fetch user');
    }
}

export async function createUser({ name, email, image }: { name: string; email: string; image: string }) {
    try {
        const res = await fetch(`${USER_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, image })
        });
        const user = await res.json();
        return user;
    } catch {
        throw new Error('Could not create user');
    }
}
