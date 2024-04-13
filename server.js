const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to get comments
app.get('/comments', async (req, res) => {
    try {
        // Read comments from file
        const data = await fs.readFile('comments.json', 'utf8');
        const comments = JSON.parse(data);
        res.json(comments);
    } catch (error) {
        console.error('Error reading comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to add a new comment
app.post('/comments', async (req, res) => {
    const newComment = req.body.comment;

    if (!newComment || typeof newComment !== 'string') {
        return res.status(400).json({ error: 'Invalid comment' });
    }

    try {
        // Read existing comments
        const data = await fs.readFile('comments.json', 'utf8');
        const comments = JSON.parse(data);

        // Add new comment
        comments.push(newComment);

        // Write updated comments to file
        await fs.writeFile('comments.json', JSON.stringify(comments, null, 2));

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
