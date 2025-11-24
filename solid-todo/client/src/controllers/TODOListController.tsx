

const API_URL = 'http://localhost:3002'

const ENDPOINTS = {
    getNote: `${API_URL}/notes`,
    createItem: `${API_URL}/items`
}

class TODOListController {
    static async getNotes() {
        try {
            const response = await fetch(ENDPOINTS.getNote);

            // Check if the request was successful (status in the 200-299 range)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Extract the response body content as JSON
            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('Fetch error:', error.message);
        }
    }

    static async createNote(owner: number, text: string) {
        try {
            const postData = {
                text: text,
                owner: owner
            }
            console.log(`calling ${ENDPOINTS.createItem} with ${JSON.stringify(postData)}`);
            const response = await fetch(ENDPOINTS.createItem, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData)
            });

            // Check if the request was successful (status in the 200-299 range)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Extract the response body content as JSON
            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('Fetch error:', error.message);
            return null;
        }
    }
}

export default TODOListController;