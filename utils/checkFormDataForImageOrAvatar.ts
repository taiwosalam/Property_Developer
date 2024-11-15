export function checkFormDataForImageOrAvatar(
  data: FormData,
  pictureField: string = "picture",
  avatarField: string = "avatar"
): boolean {
  // Get picture and avatar fields from FormData
  const pictureFile = data.get(pictureField) as File | null;
  const avatarValue = data.get(avatarField) as string | null;

  // Check if the picture is a non-empty file
  const hasPicture = pictureFile instanceof File && pictureFile.size > 0;

  // Check if the avatar is not an empty string or null
  const hasAvatar =
    typeof avatarValue === "string" && avatarValue.trim() !== "";

  // Return true if either picture or avatar exists and is valid
  return hasPicture || hasAvatar;
}
