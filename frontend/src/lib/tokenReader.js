

export function useNameFromToken(token) {
  try {
                const parsedAuthStatus = JSON.parse(token); // Parse the JSON string
                if (parsedAuthStatus && parsedAuthStatus.username) {
                    const username = parsedAuthStatus.username;
                    return username
                }
            } catch (error) {
                console.error('Error parsing auth-status cookie:', error);
            }

 
}