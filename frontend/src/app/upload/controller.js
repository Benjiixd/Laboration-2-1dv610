export class ImageController {
    constructor() {
    }

    async postImage(formData) {
        try {
            const response = await fetch("http://localhost:3020/images", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Data submitted successfully", result.data_id);
                return result.data_id;
            } else {
                console.error("Server error:", response.statusText);
                return null;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    async addImage(formData) {
        try {
            console.log(formData)
            const response = await fetch("http://localhost:3020/users/addImage", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Data submitted successfully", result);
                return result
            } else {
                console.error("Server error:", response.statusText);
                return null;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



}