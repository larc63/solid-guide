import { title } from "process";
import { TODOListState } from "../types";


const API_URL = 'http://localhost:6299'

const ENDPOINTS = {
    getNote: `${API_URL}/notes`,
    createItem: `${API_URL}/items`,
    toggleListState: `${API_URL}/items/toggle`
}

class RESTfulTODOListController {
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
            throw error;
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
    static async updateNote(item_id: number, text: string) {
        try {
            const putData = {
                text: text,
                item_id: item_id
            }
            console.log(`calling ${ENDPOINTS.createItem} with ${JSON.stringify(putData)}`);
            const response = await fetch(ENDPOINTS.createItem, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(putData)
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

    static async deleteNote(item_id: number) {
        try {
            const putData = {
                item_id: item_id
            }
            console.log(`calling ${ENDPOINTS.createItem} with ${JSON.stringify(putData)}`);
            const response = await fetch(ENDPOINTS.createItem, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(putData)
            });

            // Check if the request was successful (status in the 200-299 range)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error: any) {
            console.error('Fetch error:', error.message);
        }
    }

    static async toggleListState(item_id: number) {
        try {
            const url = `${ENDPOINTS.toggleListState}/${item_id}`
            console.log(`calling ${url}`);
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // Check if the request was successful (status in the 200-299 range)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error: any) {
            console.error('Fetch error:', error.message);
        }
    }
}



class LocalTODOListController {
    static notes: TODOListState;
    static async getNotes() {
        try {
            let notesString = localStorage.getItem('MY_NOTES');
            if (!notesString) {
                this.notes = {
                    title: 'Shopping List (local)',
                    list_id: 1,
                    items: [
                        {
                            done: false,
                            item_id: 1,
                            rank: 3,
                            text: 'Strawberries'
                        },
                        {
                            done: false,
                            item_id: 2,
                            rank: 2,
                            text: 'Cream'
                        }
                    ]
                }
            } else {
                this.notes = JSON.parse(notesString);
            }
            console.log(this.notes);
            return this.notes;
        } catch (error) {
            console.error('errored out getting notes from localstorage');
        }
    }

    static createNote(owner: number, text: string) {
        return new Promise((resolve) => {
            let max = 0;
            for (let i = 0; i < this.notes.items.length; i++) {
                const item = this.notes.items[i];
                if (item.item_id > max) {
                    max = item.item_id;
                }
            }
            max++;
            let item = {
                done: false,
                item_id: max,
                rank: max,
                text: text
            };
            this.notes.items.push(item);
            localStorage.setItem('MY_NOTES', JSON.stringify(this.notes));
            resolve(item);
        });
    }
    static async updateNote(item_id: number, text: string) {
        for (let i = 0; i < this.notes.items.length; i++) {
            const item = this.notes.items[i];
            if (item.item_id === item_id) {
                item.text = text;
            }
        }
        localStorage.setItem('MY_NOTES', JSON.stringify(this.notes));
    }

    static async deleteNote(item_id: number) {
        for (let i = 0; i < this.notes.items.length; i++) {
            const item = this.notes.items[i];
            if (item.item_id === item_id) {
                this.notes.items.splice(i, 1);
                break;
            }
        }
        localStorage.setItem('MY_NOTES', JSON.stringify(this.notes));
    }

    static async toggleListState(item_id: number) {
        for (let i = 0; i < this.notes.items.length; i++) {
            const item = this.notes.items[i];
            if (item.item_id === item_id) {
                item.done = !item.done;
            }
        }
        localStorage.setItem('MY_NOTES', JSON.stringify(this.notes));
    }

}


class TODOListController {
    static useRemote = true;
    static async getNotes() {
        try {
            if (this.useRemote) {
                return await RESTfulTODOListController.getNotes();
            } else {
                return await LocalTODOListController.getNotes();
            }
        } catch (error) {
            console.error('errored out getting notes');
            this.useRemote = false;
            return LocalTODOListController.getNotes();
        }
    }

    static async createNote(owner: number, text: string) {
        if (this.useRemote) {
            return await RESTfulTODOListController.createNote(owner, text);
        } else {
            return LocalTODOListController.createNote(owner, text);
        }
    }
    static async updateNote(item_id: number, text: string) {
        if (this.useRemote) {
            return await RESTfulTODOListController.updateNote(item_id, text);
        } else {
            return LocalTODOListController.updateNote(item_id, text);
        }
    }

    static async deleteNote(item_id: number) {
        if (this.useRemote) {
            await RESTfulTODOListController.deleteNote(item_id);
        } else {
            LocalTODOListController.deleteNote(item_id);
        }
    }

    static async toggleListState(item_id: number) {
        if (this.useRemote) {
            await RESTfulTODOListController.toggleListState(item_id);
        } else {
            LocalTODOListController.toggleListState(item_id);
        }
    }

}

export default TODOListController;