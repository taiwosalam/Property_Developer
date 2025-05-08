import imageCompression from "browser-image-compression";

export const compressImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log(" image: to compress", imageUrl);
    // Fetch the image as a blob
    const response = await fetch(imageUrl, { mode: "cors" });
    if (!response.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);
    const blob = await response.blob();

    // Compress the image
    const compressedFile = await imageCompression(
      new File([blob], "compressed.jpg"),
      {
        maxSizeMB: 0.1, // Target size ~100KB per image
        maxWidthOrHeight: 800, // Reduce resolution
        useWebWorker: true,
        fileType: "image/jpeg", // Convert to JPEG
        initialQuality: 0.7, // JPEG quality
      }
    );

    // Convert compressed file to data URL
    return await imageCompression.getDataUrlFromFile(compressedFile);
  } catch (err) {
    console.error("Image compression failed:", err);
    return imageUrl; // Fallback to original URL
  }
};
