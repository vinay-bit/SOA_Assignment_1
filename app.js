const express = require('express');
const app = express();
const port = process.env.PORT || 3200;

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In-memory array to store content
const contents = [];

// Endpoint to create new content
app.post("/new_content", (req, res) => {
    const { title, body } = req.body;

    // Simple validation to check if the required fields are provided
    if (title && body) {
        const newContent = {
            id: contents.length + 1,
            title,
            body,
            date: new Date().toISOString()
        };

        // Add the new content to the array
        contents.push(newContent);

        // Send a success response
        res.status(200).json({
            message: "Content created successfully",
            content: newContent
        });
    } else {
        // Send an error response if validation fails
        res.status(400).json({
            message: "Invalid content creation. Please provide both title and body."
        });
    }
});

// Endpoint to get all content
app.get("/get_contents", (req, res) => {
    res.status(200).json(contents);
});

// Endpoint to update content by ID
app.put("/update_content/:id", (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;
    const content = contents.find(c => c.id === parseInt(id));

    if (content) {
        // Update the content if it exists
        content.title = title ?? content.title;
        content.body = body ?? content.body;

        res.status(200).json({
            message: "Content updated successfully",
            content
        });
    } else {
        // Send an error response if the content was not found
        res.status(404).json({
            message: "Content not found"
        });
    }
});

// Endpoint to delete content by ID
app.delete("/delete_content/:id", (req, res) => {
    const { id } = req.params;
    const index = contents.findIndex(c => c.id === parseInt(id));

    if (index !== -1) {
        // Remove the content from the array
        const [deletedContent] = contents.splice(index, 1);
        res.status(200).json({
            message: "Content deleted successfully",
            deletedContent
        });
    } else {
        // Send an error response if the content was not found
        res.status(404).json({
            message: "Content not found"
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`CMS running at port ${port}`);
});
