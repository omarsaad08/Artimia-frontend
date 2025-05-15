document.getElementById('uploadButton').addEventListener('click', async function (e) {
    e.preventDefault();

    const uploadButton = document.getElementById('uploadButton');
    const originalButtonText = uploadButton.textContent;

    try {
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';

        const imageFile = document.getElementById('paintingImage').files[0];

        if (!imageFile) {
            throw new Error('Please select an image file');
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        const metadata = {
            productName: document.getElementById('paintingTitle').value,
            Price: parseFloat(document.getElementById('paintingPrice').value),
            description: document.getElementById('paintingDescription').value,
            style: "Modern"
        };

        formData.append('product', new Blob(
            [JSON.stringify(metadata)],
            { type: 'application/json' }
        ));

        // Upload product with image and metadata
        const response = await axios.post('http://localhost:8080/api/products', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            }
        });

        if (response.status !== 200 && response.status !== 201) {
            const errorData = response.data;
            throw new Error(errorData.message || 'Product upload failed');
        }

        // Hide modal and notify success
        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadModal'));
        modal.hide();
        alert('Product uploaded successfully!');

        const data = response.data;

        const sizePayload = {
            productName: data.productName,
            size: document.getElementById('paintingSize').value,
            length: document.getElementById('paintingLength').value,
            width: document.getElementById('paintingWidth').value,
            quantity: document.getElementById('paintingQuantity').value,
            additionalPrice: 0.0
        };

        // Upload product size
        const sizeResponse = await axios.post('http://localhost:8080/api/product-sizes', sizePayload, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
                'Content-Type': 'application/json'
            }
        });

        if (sizeResponse.status !== 200 && sizeResponse.status !== 201) {
            const errorData = sizeResponse.data;
            throw new Error(errorData.message || 'Size upload failed');
        }

        alert('Product size uploaded successfully!');

    } catch (error) {
        console.error('Upload error:', error);
        alert(error.message || 'An error occurred during upload');
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = originalButtonText;
    }
});
