/**
 * ImageProcessor handles client-side image resizing and compression.
 */
class ImageProcessor {
    /**
     * Compresses and resizes an image to stay under a certain size limit.
     * @param {File} file - The image file to process.
     * @param {number} maxWidth - Maximum width in pixels.
     * @param {number} maxHeight - Maximum height in pixels.
     * @param {number} quality - Compression quality (0 to 1).
     * @returns {Promise<{base64: string, file: File}>}
     */
    static async compress(file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions maintain aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Get compressed base64
                    const base64 = canvas.toDataURL(file.type, quality);

                    // Convert back to file if needed (optional for now as Gemini takes base64)
                    resolve({
                        base64,
                        width,
                        height,
                        originalSize: file.size,
                        compressedSize: Math.round((base64.length * 3) / 4) // approximation
                    });
                };
                img.onerror = (err) => reject(new Error("Failed to load image for processing."));
            };
            reader.onerror = (err) => reject(new Error("Failed to read file."));
        });
    }
}

export default ImageProcessor;
