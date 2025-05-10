document.getElementById('uploadButton').addEventListener('click', async function (e) {
    e.preventDefault();

    const uploadButton = document.getElementById('uploadButton');
    const originalButtonText = uploadButton.textContent;

    try {
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';

        const formData = new FormData();
        const imageFile = document.getElementById('paintingImage').files[0];

        if (!imageFile) {
            throw new Error('Please select an image file');
        }

        // Append file (automatically gets multipart/form-data)
        formData.append('image', imageFile);

        // Append metadata as Blob with explicit JSON content type
        // const metadata = {
        //     productName: document.getElementById('paintingTitle').value,
        //     Price: parseFloat(document.getElementById('paintingPrice').value),
        //     description: document.getElementById('paintingDescription').value,
        //     style: "Modern"
        // }; 
        const metadata = {
            productName: "testkjasdlf;kjas",
            Price: 10.00,
            description: "kfdsjafl;asdjflksadjf;lsadjflksdjfl;asdkjflkjklsajdklsajda",
            style: "Modern"
        };

        formData.append('product', new Blob(
            [JSON.stringify(metadata)],
            { type: 'application/json' }
        ));

        // Send with Authorization header if needed
        const response = await fetch('http://localhost:8080/api/products', {
            method: 'POST',
            headers: {
                // Include this if your API requires authentication
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
            // Don't set Content-Type header - browser will set it with boundary
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
        }

        // Handle success
        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadModal'));
        modal.hide();
        alert('Product uploaded successfully!');
        const data = await response.json();
        const sizeData = JSON.stringify({
            productId: data.body.Id,
            size: document.getElementById('paintingSize').value,
            length: document.getElementById('paintingLength').value,
            width: document.getElementById('paintingWidth').value,
            quantity: document.getElementById('paintingQuantity').value,
            additionalPrice: 0.0
        });
        const sizeResponse = await fetch('http://localhost:8080/api/product-sizes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: sizeData
        });

        if (!sizeResponse.ok) {
            const errorData = await sizeResponse.json();
            throw new Error(errorData.message || 'Upload failed');
        }


    } catch (error) {
        console.error('Upload error:', error);
        alert(error.message || 'An error occurred during upload');
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = originalButtonText;
    }
});