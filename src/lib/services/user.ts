const USER_BASE_URL = `${process.env.BACKEND_BASE_URL}/user`;
const USER_API_URL = `${process.env.NEXT_PUBLIC_SERVER_URI}/users`;

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

export async function getUserById(id: string) {
    try {
        const res = await fetch(`${USER_API_URL}/${id}`);
        if (!res.ok) throw new Error('Failed to fetch user by ID');
        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error('Could not fetch user by ID');
    }
}
