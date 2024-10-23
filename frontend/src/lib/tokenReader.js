

export function getNameFromToken(token) {
  try {
                const parsedAuthStatus = JSON.parse(token);
                if (parsedAuthStatus && parsedAuthStatus.username) {
                    const username = parsedAuthStatus.username;
                    return username
                }
            } catch (error) {
                console.error('Error parsing auth-status cookie:', error);
            }

 
}